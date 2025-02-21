import { useAuth } from "@/hooks/use-auth";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Message, User } from "@shared/schema";
import { MessageSquare, Bot, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

export default function ChatPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [message, setMessage] = useState("");
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [showAiChat, setShowAiChat] = useState(false);
  const [selectedUser, setSelectedUser] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: messages } = useQuery<Message[]>({
    queryKey: {
      queryKey: ["/api/messages"],
      userId: user?.id,
    },
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
      const message = JSON.parse(event.data);
      queryClient.invalidateQueries({ queryKey: ["/api/messages"] });
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

    if (showAiChat) {
      // Handle AI chat bot response
      sendMessageMutation.mutate({
        content: message,
        fromUserId: user?.id || 0,
        toUserId: null,
        isAiMessage: true,
        timestamp: new Date().toISOString(),
      });
    } else {
      // Handle direct message
      sendMessageMutation.mutate({
        content: message,
        fromUserId: user?.id || 0,
        toUserId: selectedUser,
        isAiMessage: false,
        timestamp: new Date().toISOString(),
      });
    }
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
    <div className="container py-8">
      <div className="max-w-5xl mx-auto">
        <div className="grid md:grid-cols-4 gap-6">
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Messages
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative mb-4">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <ScrollArea className="h-[400px]">
                <div className="space-y-2">
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
              </ScrollArea>
            </CardContent>
          </Card>

          <Card className="md:col-span-3">
            <CardHeader>
              <CardTitle>
                {showAiChat ? "AI Assistant" : selectedUser ? users.find(u => u.id === selectedUser)?.businessName : "Select a chat"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] mb-4">
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
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}