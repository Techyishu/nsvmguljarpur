import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Pencil, Trash2, Plus } from "lucide-react";
import { mockActivities, mockStaff, mockToppers, mockGallery } from "@/data/mockData";

const Admin = () => {
  const { toast } = useToast();
  const [activities, setActivities] = useState(mockActivities);
  const [staff, setStaff] = useState(mockStaff);
  const [toppers, setToppers] = useState(mockToppers);
  const [gallery, setGallery] = useState(mockGallery);

  const handleDelete = (type: string, id: string) => {
    toast({
      title: "Item Deleted",
      description: `${type} has been removed successfully.`,
    });
  };

  const handleAdd = (type: string) => {
    toast({
      title: "Item Added",
      description: `New ${type} has been added successfully.`,
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-12 bg-accent">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-8 text-center">Admin Panel</h1>
          
          <Tabs defaultValue="activities" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="activities">Activities</TabsTrigger>
              <TabsTrigger value="staff">Staff</TabsTrigger>
              <TabsTrigger value="toppers">Toppers</TabsTrigger>
              <TabsTrigger value="gallery">Gallery</TabsTrigger>
            </TabsList>

            {/* Activities Tab */}
            <TabsContent value="activities" className="space-y-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Manage Activities</CardTitle>
                  <Button onClick={() => handleAdd("Activity")}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add New
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {activities.map((activity) => (
                      <Card key={activity.id}>
                        <CardContent className="pt-6">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="font-bold text-lg mb-2">{activity.title}</h3>
                              <p className="text-sm text-muted-foreground mb-2">{activity.description}</p>
                              <p className="text-xs text-secondary">{activity.date}</p>
                            </div>
                            <div className="flex space-x-2">
                              <Button variant="outline" size="icon">
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="destructive"
                                size="icon"
                                onClick={() => handleDelete("Activity", activity.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Staff Tab */}
            <TabsContent value="staff" className="space-y-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Manage Staff</CardTitle>
                  <Button onClick={() => handleAdd("Staff Member")}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add New
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {staff.map((member) => (
                      <Card key={member.id}>
                        <CardContent className="pt-6">
                          <div className="flex items-start space-x-4">
                            <img
                              src={member.image}
                              alt={member.name}
                              className="w-20 h-20 rounded-full object-cover"
                            />
                            <div className="flex-1">
                              <h3 className="font-bold">{member.name}</h3>
                              <p className="text-sm text-secondary">{member.designation}</p>
                              <p className="text-xs text-muted-foreground">{member.qualification}</p>
                            </div>
                            <div className="flex flex-col space-y-2">
                              <Button variant="outline" size="icon">
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="destructive"
                                size="icon"
                                onClick={() => handleDelete("Staff Member", member.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Toppers Tab */}
            <TabsContent value="toppers" className="space-y-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Manage Toppers</CardTitle>
                  <Button onClick={() => handleAdd("Topper")}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add New
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4">
                    {toppers.map((topper) => (
                      <Card key={topper.id}>
                        <CardContent className="pt-6 text-center">
                          <img
                            src={topper.image}
                            alt={topper.name}
                            className="w-24 h-24 rounded-full object-cover mx-auto mb-4"
                          />
                          <h3 className="font-bold">{topper.name}</h3>
                          <p className="text-sm text-secondary">{topper.class}</p>
                          <p className="text-2xl font-bold text-primary mt-2">{topper.percentage}</p>
                          <div className="flex justify-center space-x-2 mt-4">
                            <Button variant="outline" size="icon">
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="destructive"
                              size="icon"
                              onClick={() => handleDelete("Topper", topper.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Gallery Tab */}
            <TabsContent value="gallery" className="space-y-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Manage Gallery</CardTitle>
                  <Button onClick={() => handleAdd("Image")}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add New
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4">
                    {gallery.map((item) => (
                      <Card key={item.id} className="overflow-hidden">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-48 object-cover"
                        />
                        <CardContent className="pt-4">
                          <h3 className="font-bold">{item.title}</h3>
                          <p className="text-sm text-secondary">{item.category}</p>
                          <div className="flex justify-end space-x-2 mt-4">
                            <Button variant="outline" size="icon">
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="destructive"
                              size="icon"
                              onClick={() => handleDelete("Image", item.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Admin;
