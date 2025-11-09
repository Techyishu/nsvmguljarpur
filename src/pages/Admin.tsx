import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Pencil, Trash2, Plus } from "lucide-react";
import { mockActivities, mockStaff, mockToppers, mockGallery } from "@/data/mockData";
import { PageHero } from "@/components/PageHero";

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
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <PageHero
        title="Admin Panel"
        description="Manage your school’s content, events, and key information with streamlined tools designed for administrators."
        eyebrow="School Operations"
      />

      <main className="flex-grow py-16">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="activities" className="w-full max-w-7xl mx-auto">
            <TabsList className="grid w-full grid-cols-4 bg-card border border-border h-auto p-2">
              <TabsTrigger 
                value="activities" 
                className="data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground font-bold uppercase tracking-wider py-3"
              >
                Activities
              </TabsTrigger>
              <TabsTrigger 
                value="staff"
                className="data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground font-bold uppercase tracking-wider py-3"
              >
                Staff
              </TabsTrigger>
              <TabsTrigger 
                value="toppers"
                className="data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground font-bold uppercase tracking-wider py-3"
              >
                Toppers
              </TabsTrigger>
              <TabsTrigger 
                value="gallery"
                className="data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground font-bold uppercase tracking-wider py-3"
              >
                Gallery
              </TabsTrigger>
            </TabsList>

            <TabsContent value="activities" className="space-y-4 mt-8">
              <Card className="bg-card border-border">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="uppercase tracking-wider">Manage Activities</CardTitle>
                  <Button 
                    onClick={() => handleAdd("Activity")}
                    className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-bold uppercase"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add New
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {activities.map((activity) => (
                      <Card key={activity.id} className="bg-background border-border">
                        <CardContent className="pt-6">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="font-bold text-lg mb-2 uppercase tracking-wider">{activity.title}</h3>
                              <p className="text-sm text-muted-foreground mb-2">{activity.description}</p>
                              <p className="text-xs text-secondary font-bold uppercase">{activity.date}</p>
                            </div>
                            <div className="flex space-x-2">
                              <Button variant="outline" size="icon" className="border-border hover:border-secondary">
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

            <TabsContent value="staff" className="space-y-4 mt-8">
              <Card className="bg-card border-border">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="uppercase tracking-wider">Manage Staff</CardTitle>
                  <Button 
                    onClick={() => handleAdd("Staff Member")}
                    className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-bold uppercase"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add New
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {staff.map((member) => (
                      <Card key={member.id} className="bg-background border-border">
                        <CardContent className="pt-6">
                          <div className="flex items-start space-x-4">
                            <img
                              src={member.image}
                              alt={member.name}
                              className="w-20 h-20 rounded-full object-cover grayscale"
                            />
                            <div className="flex-1">
                              <h3 className="font-bold uppercase tracking-wider">{member.name}</h3>
                              <p className="text-sm text-secondary font-bold">{member.designation}</p>
                              <p className="text-xs text-muted-foreground">{member.qualification}</p>
                            </div>
                            <div className="flex flex-col space-y-2">
                              <Button variant="outline" size="icon" className="border-border hover:border-secondary">
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

            <TabsContent value="toppers" className="space-y-4 mt-8">
              <Card className="bg-card border-border">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="uppercase tracking-wider">Manage Toppers</CardTitle>
                  <Button 
                    onClick={() => handleAdd("Topper")}
                    className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-bold uppercase"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add New
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4">
                    {toppers.map((topper) => (
                      <Card key={topper.id} className="bg-background border-border">
                        <CardContent className="pt-6 text-center">
                          <img
                            src={topper.image}
                            alt={topper.name}
                            className="w-24 h-24 rounded-full object-cover mx-auto mb-4 grayscale"
                          />
                          <h3 className="font-bold uppercase tracking-wider">{topper.name}</h3>
                          <p className="text-sm text-secondary font-bold">{topper.class}</p>
                          <p className="text-3xl font-black text-secondary mt-2">{topper.percentage}</p>
                          <div className="flex justify-center space-x-2 mt-4">
                            <Button variant="outline" size="icon" className="border-border hover:border-secondary">
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

            <TabsContent value="gallery" className="space-y-4 mt-8">
              <Card className="bg-card border-border">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="uppercase tracking-wider">Manage Gallery</CardTitle>
                  <Button 
                    onClick={() => handleAdd("Image")}
                    className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-bold uppercase"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add New
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4">
                    {gallery.map((item) => (
                      <Card key={item.id} className="overflow-hidden bg-background border-border">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-48 object-cover grayscale"
                        />
                        <CardContent className="pt-4">
                          <h3 className="font-bold uppercase tracking-wider">{item.title}</h3>
                          <p className="text-sm text-secondary font-bold">{item.category}</p>
                          <div className="flex justify-end space-x-2 mt-4">
                            <Button variant="outline" size="icon" className="border-border hover:border-secondary">
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
