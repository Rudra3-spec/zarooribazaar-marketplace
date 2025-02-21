import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LearningResource } from "@shared/schema";
import { GraduationCap, BookOpen, Play, LineChart } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";

export default function LearningPage() {
  const { user } = useAuth();

  const { data: resources } = useQuery<LearningResource[]>({
    queryKey: ["/api/learning-resources"],
  });

  const blogs = resources?.filter(resource => resource.type === 'blog') || [];
  const videos = resources?.filter(resource => resource.type === 'video') || [];
  const courses = resources?.filter(resource => resource.type === 'course') || [];

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
              <Button className="w-full">Explore</Button>
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
              <Button className="w-full">Learn More</Button>
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
              <Button className="w-full">Get Started</Button>
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
                          <Button variant="outline" size="sm">Read More</Button>
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
                          <Button variant="outline" size="sm">Watch Now</Button>
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
                          <Button>Enroll Now</Button>
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
