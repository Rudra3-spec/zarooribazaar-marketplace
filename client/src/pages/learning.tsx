import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { LearningResource } from "@shared/schema";
import { GraduationCap, BookOpen, Play, LineChart } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function LearningPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeDialog, setActiveDialog] = useState<'growth' | 'schemes' | 'skills' | null>(null);

  const { data: resources } = useQuery<LearningResource[]>({
    queryKey: ["/api/learning-resources"],
  });

  const blogs = resources?.filter(resource => resource.type === 'blog') || [];
  const videos = resources?.filter(resource => resource.type === 'video') || [];
  const courses = resources?.filter(resource => resource.type === 'course') || [];

  const handleStartLearning = (title: string) => {
    toast({
      title: "Starting Course",
      description: `You're now enrolled in ${title}. Good luck with your learning journey!`,
    });
    setActiveDialog(null);
  };

  const handleViewDetails = (title: string) => {
    toast({
      title: "Accessing Details",
      description: `Viewing detailed information about ${title}`,
    });
    setActiveDialog(null);
  };

  const handleStartCourse = (title: string) => {
    toast({
      title: "Course Started",
      description: `You've started ${title}. Your progress will be tracked automatically.`,
    });
    setActiveDialog(null);
  };

  return (
    <div className="container py-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">MSME Learning Center</h1>
          <p className="text-muted-foreground">
            Enhance your business knowledge with our curated resources
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Business Growth
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Learn strategies for scaling your business
              </p>
              <Dialog open={activeDialog === 'growth'} onOpenChange={() => setActiveDialog(null)}>
                <DialogTrigger asChild>
                  <Button className="w-full" onClick={() => setActiveDialog('growth')}>Explore</Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl">
                  <DialogHeader>
                    <DialogTitle>Business Growth Resources</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-6 mt-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <Card>
                        <CardContent className="p-4">
                          <h3 className="font-medium mb-2">Market Analysis Guide</h3>
                          <p className="text-sm text-muted-foreground mb-4">Learn how to analyze your market and identify growth opportunities</p>
                          <Button 
                            className="w-full"
                            onClick={() => handleStartLearning('Market Analysis Guide')}
                          >
                            Start Learning
                          </Button>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4">
                          <h3 className="font-medium mb-2">Financial Planning</h3>
                          <p className="text-sm text-muted-foreground mb-4">Master the basics of business financial planning</p>
                          <Button 
                            className="w-full"
                            onClick={() => handleStartLearning('Financial Planning')}
                          >
                            Start Learning
                          </Button>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LineChart className="h-5 w-5" />
                Government Schemes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Stay updated with latest MSME policies
              </p>
              <Dialog open={activeDialog === 'schemes'} onOpenChange={() => setActiveDialog(null)}>
                <DialogTrigger asChild>
                  <Button className="w-full" onClick={() => setActiveDialog('schemes')}>Learn More</Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl">
                  <DialogHeader>
                    <DialogTitle>Government Schemes & Policies</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-6 mt-4">
                    <div className="grid gap-4">
                      <Card>
                        <CardContent className="p-4">
                          <h3 className="font-medium mb-2">MSME Development Schemes</h3>
                          <p className="text-sm text-muted-foreground mb-4">Overview of government support programs</p>
                          <ul className="text-sm text-muted-foreground list-disc pl-4 mb-4">
                            <li>Credit Linked Capital Subsidy Scheme</li>
                            <li>Prime Minister's Employment Generation Programme</li>
                            <li>Credit Guarantee Fund Scheme</li>
                          </ul>
                          <Button 
                            className="w-full"
                            onClick={() => handleViewDetails('MSME Development Schemes')}
                          >
                            View Details
                          </Button>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                Digital Skills
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Master essential digital marketing skills
              </p>
              <Dialog open={activeDialog === 'skills'} onOpenChange={() => setActiveDialog(null)}>
                <DialogTrigger asChild>
                  <Button className="w-full" onClick={() => setActiveDialog('skills')}>Get Started</Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl">
                  <DialogHeader>
                    <DialogTitle>Digital Skills Training</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-6 mt-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <Card>
                        <CardContent className="p-4">
                          <h3 className="font-medium mb-2">Social Media Marketing</h3>
                          <p className="text-sm text-muted-foreground mb-4">Learn to promote your business on social platforms</p>
                          <Button 
                            className="w-full"
                            onClick={() => handleStartCourse('Social Media Marketing')}
                          >
                            Start Course
                          </Button>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4">
                          <h3 className="font-medium mb-2">E-commerce Basics</h3>
                          <p className="text-sm text-muted-foreground mb-4">Set up and manage your online store</p>
                          <Button 
                            className="w-full"
                            onClick={() => handleStartCourse('E-commerce Basics')}
                          >
                            Start Course
                          </Button>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Learning Resources</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="blogs">
              <TabsList className="grid w-full md:w-[400px] grid-cols-3">
                <TabsTrigger value="blogs">Blogs</TabsTrigger>
                <TabsTrigger value="videos">Videos</TabsTrigger>
                <TabsTrigger value="courses">Courses</TabsTrigger>
              </TabsList>

              <TabsContent value="blogs" className="mt-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {blogs.map((blog) => (
                    <Card key={blog.id}>
                      <CardHeader>
                        <CardTitle>{blog.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">
                          {blog.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">By {blog.author}</span>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              toast({
                                title: "Opening Blog",
                                description: `Reading ${blog.title}`,
                              });
                            }}
                          >
                            Read More
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="videos" className="mt-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {videos.map((video) => (
                    <Card key={video.id}>
                      <CardHeader className="p-0">
                        <AspectRatio ratio={16/9}>
                          <img
                            src={video.thumbnail || "https://images.unsplash.com/photo-1522202176988-66273c2fd55f"}
                            alt={video.title}
                            className="object-cover w-full h-full rounded-t-lg"
                          />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Play className="h-12 w-12 text-white" />
                          </div>
                        </AspectRatio>
                      </CardHeader>
                      <CardContent className="p-4">
                        <h3 className="font-medium mb-2">{video.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {video.description}
                        </p>
                        <div className="mt-4 flex items-center justify-between">
                          <span className="text-sm">{video.duration} mins</span>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              toast({
                                title: "Starting Video",
                                description: `Playing ${video.title}`,
                              });
                            }}
                          >
                            Watch Now
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="courses" className="mt-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {courses.map((course) => (
                    <Card key={course.id}>
                      <CardHeader>
                        <CardTitle>{course.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">
                          {course.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium">Duration</p>
                            <p className="text-sm text-muted-foreground">
                              {course.duration} mins
                            </p>
                          </div>
                          <Button
                            onClick={() => {
                              toast({
                                title: "Course Enrollment",
                                description: `You've enrolled in ${course.title}`,
                              });
                            }}
                          >
                            Enroll Now
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}