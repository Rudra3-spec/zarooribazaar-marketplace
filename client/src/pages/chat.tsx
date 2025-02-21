import { useAuth } from "@/hooks/use-auth";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Message, User } from "@shared/schema";
import { MessageSquare, Bot, Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

interface ChatPageProps {
  autoOpen?: boolean;
  welcomeMessage?: string;
}

export default function ChatPage({ autoOpen = false, welcomeMessage }: ChatPageProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [message, setMessage] = useState("");
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [showAiChat, setShowAiChat] = useState(true);
  const [selectedUser, setSelectedUser] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(autoOpen);
  const [showWelcome, setShowWelcome] = useState(!!welcomeMessage);

  const { data: messages } = useQuery<Message[]>({
    queryKey: ["/api/messages", user?.id],
  });

  const { data: users = [] } = useQuery<User[]>({
    queryKey: ["/api/users"],
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (data: Partial<Message>) => {
      const res = await apiRequest("POST", "/api/messages", data);
      return res.json();
    },
    onSuccess: () => {
      setMessage("");
      queryClient.invalidateQueries({ queryKey: ["/api/messages"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log("Connected to chat server");
      toast({
        title: "Connected",
        description: "Chat connection established",
      });
    };

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        if (message.type === 'chat_message' || message.type === 'ai_response') {
          queryClient.invalidateQueries({ queryKey: ["/api/messages"] });
        }
      } catch (error) {
        console.error('Error processing message:', error);
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      toast({
        title: "Connection Error",
        description: "Failed to connect to chat server",
        variant: "destructive",
      });
    };

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, [user?.id, toast]);

  const handleSendMessage = (event: React.FormEvent) => {
    event.preventDefault();
    if (!message.trim() || (!showAiChat && !selectedUser)) return;

    if (socket?.readyState === WebSocket.OPEN) {
      if (showAiChat) {
        socket.send(JSON.stringify({
          type: 'ai_message',
          content: message
        }));
      } else {
        socket.send(JSON.stringify({
          type: 'chat_message',
          content: message,
          toUserId: selectedUser
        }));
      }
    }

    sendMessageMutation.mutate({
      content: message,
      fromUserId: user?.id || 0,
      toUserId: showAiChat ? null : selectedUser,
      isAiMessage: showAiChat,
      timestamp: new Date().toISOString(),
    });
  };

  const filteredUsers = users.filter(u => 
    u.id !== user?.id && 
    u.businessName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const userMessages = messages?.filter(
    (msg) => 
      !msg.isAiMessage && 
      ((msg.fromUserId === selectedUser && msg.toUserId === user?.id) ||
       (msg.fromUserId === user?.id && msg.toUserId === selectedUser))
  ) || [];

  const aiMessages = messages?.filter((msg) => msg.isAiMessage) || [];

  return (
    <>
      <Button 
        className="fixed bottom-6 right-6 z-50 rounded-full w-14 h-14 p-0 shadow-lg hover:shadow-xl transition-shadow"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
      </Button>

      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-96 shadow-2xl rounded-xl overflow-hidden animate-in fade-in slide-in-from-bottom-5">
          {showWelcome && (
            <div className="absolute top-0 left-0 right-0 bg-primary text-primary-foreground p-4 text-sm">
              Hi! 👋 How can I help you today?
              <button onClick={() => setShowWelcome(false)} className="absolute top-2 right-2 hover:opacity-70">
                <X className="h-4 w-4" />
              </button>
            </div>
          )}
          <Card>
            <CardHeader>
              <CardTitle>
                {showAiChat ? "AI Assistant" : selectedUser ? users.find(u => u.id === selectedUser)?.businessName : "Select a chat"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col h-[500px]">
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search users..."
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <ScrollArea className="flex-grow mb-4">
                  <div className="space-y-2 mb-4">
                    <Button
                      variant={showAiChat ? "secondary" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => {
                        setShowAiChat(true);
                        setSelectedUser(null);
                      }}
                    >
                      <Bot className="mr-2 h-4 w-4" />
                      AI Assistant
                    </Button>
                    {filteredUsers.map((u) => (
                      <Button
                        key={u.id}
                        variant={selectedUser === u.id ? "secondary" : "ghost"}
                        className="w-full justify-start"
                        onClick={() => {
                          setSelectedUser(u.id);
                          setShowAiChat(false);
                        }}
                      >
                        <MessageSquare className="mr-2 h-4 w-4" />
                        {u.businessName}
                      </Button>
                    ))}
                  </div>

                  <div className="space-y-4">
                    {showAiChat ? (
                      aiMessages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`flex ${
                            msg.fromUserId === user?.id ? "justify-end" : "justify-start"
                          }`}
                        >
                          <div
                            className={`rounded-lg px-4 py-2 max-w-[80%] ${
                              msg.fromUserId === user?.id
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted"
                            }`}
                          >
                            {msg.content}
                          </div>
                        </div>
                      ))
                    ) : (
                      userMessages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`flex ${
                            msg.fromUserId === user?.id ? "justify-end" : "justify-start"
                          }`}
                        >
                          <div
                            className={`rounded-lg px-4 py-2 max-w-[80%] ${
                              msg.fromUserId === user?.id
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted"
                            }`}
                          >
                            {msg.content}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </ScrollArea>

                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <Input
                    placeholder={showAiChat ? "Ask the AI assistant..." : "Type your message..."}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    disabled={!showAiChat && !selectedUser}
                  />
                  <Button 
                    type="submit" 
                    disabled={(!showAiChat && !selectedUser) || sendMessageMutation.isPending}
                  >
                    Send
                  </Button>
                </form>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}