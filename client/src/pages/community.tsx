import { useAuth } from "@/hooks/use-auth";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { ForumPost, Webinar, insertForumPostSchema, insertWebinarSchema } from "@shared/schema";
import { MessageSquare, Users, Calendar, Video } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { z } from "zod";

// Extend the schema to include optional fields with proper validation
const extendedForumPostSchema = insertForumPostSchema.extend({
  tags: z.array(z.string()).optional().default([]),
  views: z.number().optional().default(0),
});

const extendedWebinarSchema = insertWebinarSchema.extend({
  status: z.enum(["upcoming", "ongoing", "completed"]).optional().default("upcoming"),
  maxParticipants: z.number().min(5, "Minimum 5 participants required").max(500, "Maximum 500 participants allowed"),
  registrationDeadline: z.string().min(1, "Registration deadline is required"),
});

type ForumPostFormData = z.infer<typeof extendedForumPostSchema>;
type WebinarFormData = z.infer<typeof extendedWebinarSchema>;

export default function CommunityPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeDialog, setActiveDialog] = useState<'post' | 'webinar' | null>(null);

  const { data: forumPosts } = useQuery<ForumPost[]>({
    queryKey: ["/api/forum-posts"],
  });

  const { data: webinars } = useQuery<Webinar[]>({
    queryKey: ["/api/webinars"],
  });

  const forumPostForm = useForm<ForumPostFormData>({
    resolver: zodResolver(extendedForumPostSchema),
    defaultValues: {
      title: "",
      content: "",
      category: "",
      tags: [],
      views: 0,
    },
  });

  const webinarForm = useForm<WebinarFormData>({
    resolver: zodResolver(extendedWebinarSchema),
    defaultValues: {
      title: "",
      description: "",
      scheduledAt: new Date().toISOString().slice(0, 16),
      duration: 60,
      maxParticipants: 100,
      registrationDeadline: new Date().toISOString().slice(0, 16),
      status: "upcoming",
    },
  });

  const createForumPostMutation = useMutation({
    mutationFn: async (data: ForumPostFormData) => {
      const response = await apiRequest("POST", "/api/forum-posts", {
        ...data,
        userId: user?.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create post');
      }

      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Forum post created successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/forum-posts"] });
      forumPostForm.reset();
      setActiveDialog(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const createWebinarMutation = useMutation({
    mutationFn: async (data: WebinarFormData) => {
      const response = await apiRequest("POST", "/api/webinars", {
        ...data,
        hostId: user?.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create webinar');
      }

      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Webinar created successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/webinars"] });
      webinarForm.reset();
      setActiveDialog(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleForumPostSubmit = async (data: ForumPostFormData) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to create a post",
        variant: "destructive",
      });
      return;
    }
    await createForumPostMutation.mutateAsync(data);
  };

  const handleWebinarSubmit = async (data: WebinarFormData) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to create a webinar",
        variant: "destructive",
      });
      return;
    }
    await createWebinarMutation.mutateAsync(data);
  };

  return (
    <div className="container py-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">MSME Community</h1>
          <p className="text-muted-foreground">
            Connect, share, and learn with other businesses
          </p>
        </div>

        <Tabs defaultValue="forum" className="space-y-6">
          <div className="flex justify-between items-center">
            <TabsList>
              <TabsTrigger value="forum" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Discussion Forum
              </TabsTrigger>
              <TabsTrigger value="webinars" className="flex items-center gap-2">
                <Video className="h-4 w-4" />
                Webinars
              </TabsTrigger>
            </TabsList>
            <div className="space-x-2">
              <Dialog open={activeDialog === 'post'} onOpenChange={(open) => setActiveDialog(open ? 'post' : null)}>
                <DialogTrigger asChild>
                  <Button onClick={() => setActiveDialog('post')}>New Post</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create Forum Post</DialogTitle>
                  </DialogHeader>
                  <Form {...forumPostForm}>
                    <form onSubmit={forumPostForm.handleSubmit(handleForumPostSubmit)} className="space-y-4">
                      <FormField
                        control={forumPostForm.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Enter post title" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={forumPostForm.control}
                        name="content"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Content</FormLabel>
                            <FormControl>
                              <Textarea {...field} placeholder="Write your post content" className="min-h-[100px]" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={forumPostForm.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Category</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="e.g., Business Tips, Market Trends" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button 
                        type="submit" 
                        className="w-full"
                        disabled={createForumPostMutation.isPending}
                      >
                        {createForumPostMutation.isPending ? "Creating..." : "Create Post"}
                      </Button>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>

              <Dialog open={activeDialog === 'webinar'} onOpenChange={(open) => setActiveDialog(open ? 'webinar' : null)}>
                <DialogTrigger asChild>
                  <Button onClick={() => setActiveDialog('webinar')}>Host Webinar</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create Webinar</DialogTitle>
                  </DialogHeader>
                  <Form {...webinarForm}>
                    <form onSubmit={webinarForm.handleSubmit(handleWebinarSubmit)} className="space-y-4">
                      <FormField
                        control={webinarForm.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Enter webinar title" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={webinarForm.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea {...field} placeholder="Describe your webinar" className="min-h-[100px]" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={webinarForm.control}
                        name="scheduledAt"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Date & Time</FormLabel>
                            <FormControl>
                              <Input 
                                type="datetime-local" 
                                {...field} 
                                min={new Date().toISOString().slice(0, 16)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={webinarForm.control}
                        name="duration"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Duration (minutes)</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                {...field} 
                                onChange={e => field.onChange(parseInt(e.target.value))}
                                min={15}
                                max={180}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={webinarForm.control}
                        name="maxParticipants"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Maximum Participants</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                {...field} 
                                onChange={e => field.onChange(parseInt(e.target.value))}
                                min={5}
                                max={500}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={webinarForm.control}
                        name="registrationDeadline"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Registration Deadline</FormLabel>
                            <FormControl>
                              <Input 
                                type="datetime-local" 
                                {...field}
                                min={new Date().toISOString().slice(0, 16)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button 
                        type="submit" 
                        className="w-full"
                        disabled={createWebinarMutation.isPending}
                      >
                        {createWebinarMutation.isPending ? "Creating..." : "Create Webinar"}
                      </Button>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <TabsContent value="forum">
            {forumPosts && forumPosts.length > 0 ? (
              <div className="grid gap-4">
                {forumPosts.map((post) => (
                  <Card key={post.id} className="hover:bg-accent/5 transition-colors">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-medium text-lg mb-1">{post.title}</h3>
                          <p className="text-sm text-muted-foreground">{post.content}</p>
                        </div>
                        <span className="text-sm text-muted-foreground px-2 py-1 bg-secondary rounded">
                          {post.category}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center gap-4">
                          <span>{post.views} views</span>
                          <span>{post.tags?.join(", ")}</span>
                        </div>
                        <Button variant="outline" size="sm">View Discussion</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="font-medium mb-2">No Discussions Yet</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Be the first to start a discussion in the community
                  </p>
                  <Button onClick={() => setActiveDialog('post')}>Create Post</Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="webinars">
            {webinars && webinars.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-4">
                {webinars.map((webinar) => (
                  <Card key={webinar.id} className="hover:bg-accent/5 transition-colors">
                    <CardContent className="p-4">
                      <div className="mb-4">
                        <h3 className="font-medium text-lg mb-1">{webinar.title}</h3>
                        <p className="text-sm text-muted-foreground">{webinar.description}</p>
                      </div>
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(webinar.scheduledAt).toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Users className="h-4 w-4" />
                          <span>{webinar.maxParticipants} max participants</span>
                        </div>
                      </div>
                      <Button 
                        className="w-full" 
                        variant={webinar.status === 'upcoming' ? 'default' : 'secondary'}
                      >
                        {webinar.status === 'upcoming' ? 'Register Now' : 'View Details'}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <Video className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="font-medium mb-2">No Upcoming Webinars</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Host a webinar to share your knowledge with the community
                  </p>
                  <Button onClick={() => setActiveDialog('webinar')}>Host Webinar</Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}