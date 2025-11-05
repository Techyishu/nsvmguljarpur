import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Contact = () => {
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message Sent!",
      description: "We'll get back to you soon.",
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <section className="py-24 bg-card">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-6xl md:text-7xl font-black mb-6 uppercase tracking-tight">CONTACTS</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Get in touch with us - We're here to help
          </p>
        </div>
      </section>

      <main className="flex-grow py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            <div className="space-y-8">
              <Card className="bg-card border-border">
                <CardContent className="pt-6">
                  <div className="space-y-6">
                    <div className="flex items-start space-x-4">
                      <div className="bg-secondary/10 p-4 rounded">
                        <MapPin className="h-6 w-6 text-secondary" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg mb-1 uppercase tracking-wider">Address</h3>
                        <p className="text-muted-foreground">School Address, City - 132037</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-4">
                      <div className="bg-secondary/10 p-4 rounded">
                        <Phone className="h-6 w-6 text-secondary" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg mb-1 uppercase tracking-wider">Phone</h3>
                        <p className="text-muted-foreground">+91-85700 54094</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-4">
                      <div className="bg-secondary/10 p-4 rounded">
                        <Mail className="h-6 w-6 text-secondary" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg mb-1 uppercase tracking-wider">Email</h3>
                        <p className="text-muted-foreground">school@example.com</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-4">
                      <div className="bg-secondary/10 p-4 rounded">
                        <Clock className="h-6 w-6 text-secondary" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg mb-1 uppercase tracking-wider">Office Hours</h3>
                        <p className="text-muted-foreground">Monday - Friday: 8:00 AM - 4:00 PM</p>
                        <p className="text-muted-foreground">Saturday: 8:00 AM - 12:00 PM</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-card border-border">
              <CardContent className="pt-6">
                <h2 className="text-3xl font-black mb-6 uppercase tracking-wider">Send Message</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="name" className="uppercase tracking-wider font-bold">Name</Label>
                    <Input 
                      id="name" 
                      placeholder="Your name" 
                      required 
                      className="bg-background border-border mt-2"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="email" className="uppercase tracking-wider font-bold">Email</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="your@email.com" 
                      required 
                      className="bg-background border-border mt-2"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="phone" className="uppercase tracking-wider font-bold">Phone</Label>
                    <Input 
                      id="phone" 
                      type="tel" 
                      placeholder="Your phone number" 
                      className="bg-background border-border mt-2"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="message" className="uppercase tracking-wider font-bold">Message</Label>
                    <Textarea
                      id="message"
                      placeholder="Your message..."
                      rows={5}
                      required
                      className="bg-background border-border mt-2"
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90 font-bold uppercase tracking-wider py-6"
                  >
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
