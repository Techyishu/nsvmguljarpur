import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { PageHero } from "@/components/PageHero";
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

      <PageHero
        title="Contact Us"
        description="Reach out to our team for admissions queries, campus visits, or general assistance — we’re happy to help."
        eyebrow="Get In Touch"
      />

      <main className="flex-grow py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto md:gap-12">
            <div className="space-y-6 md:space-y-8">
              <Card className="bg-card border-border">
                <CardContent className="pt-5 md:pt-6">
                  <div className="space-y-5 md:space-y-6">
                    <div className="flex items-start space-x-3 md:space-x-4">
                      <div className="bg-secondary/10 p-3 rounded md:p-4">
                        <MapPin className="h-5 w-5 text-secondary md:h-6 md:w-6" />
                      </div>
                      <div>
                        <h3 className="font-bold text-base mb-1 uppercase tracking-wide md:text-lg">Address</h3>
                        <p className="text-muted-foreground text-sm md:text-base">Anupam Shiksha Niketan School Kutail, Haryana 132037</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3 md:space-x-4">
                      <div className="bg-secondary/10 p-3 rounded md:p-4">
                        <Phone className="h-5 w-5 text-secondary md:h-6 md:w-6" />
                      </div>
                      <div>
                        <h3 className="font-bold text-base mb-1 uppercase tracking-wide md:text-lg">Phone</h3>
                        <p className="text-muted-foreground text-sm md:text-base">+91-85700 54094</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3 md:space-x-4">
                      <div className="bg-secondary/10 p-3 rounded md:p-4">
                        <Mail className="h-5 w-5 text-secondary md:h-6 md:w-6" />
                      </div>
                      <div>
                        <h3 className="font-bold text-base mb-1 uppercase tracking-wide md:text-lg">Email</h3>
                        <p className="text-muted-foreground text-sm break-all md:text-base">anupamshikshaniketan@gmail.com</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3 md:space-x-4">
                      <div className="bg-secondary/10 p-3 rounded md:p-4">
                        <Clock className="h-5 w-5 text-secondary md:h-6 md:w-6" />
                      </div>
                      <div>
                        <h3 className="font-bold text-base mb-1 uppercase tracking-wide md:text-lg">Office Hours</h3>
                        <p className="text-muted-foreground text-sm md:text-base">Monday - Friday: 8:00 AM - 4:00 PM</p>
                        <p className="text-muted-foreground text-sm md:text-base">Saturday: 8:00 AM - 12:00 PM</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-card border-border">
              <CardContent className="pt-5 md:pt-6">
                <h2 className="text-xl font-black mb-5 uppercase tracking-wide md:text-3xl md:mb-6 md:tracking-wider">Send Message</h2>
                <form onSubmit={handleSubmit} className="space-y-5 md:space-y-6">
                  <div>
                    <Label htmlFor="name" className="uppercase tracking-wide font-bold text-xs md:text-sm">Name</Label>
                    <Input 
                      id="name" 
                      placeholder="Your name" 
                      required 
                      className="bg-background border-border mt-1.5 text-sm md:mt-2 md:text-base"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="email" className="uppercase tracking-wide font-bold text-xs md:text-sm">Email</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="your@email.com" 
                      required 
                      className="bg-background border-border mt-1.5 text-sm md:mt-2 md:text-base"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="phone" className="uppercase tracking-wide font-bold text-xs md:text-sm">Phone</Label>
                    <Input 
                      id="phone" 
                      type="tel" 
                      placeholder="Your phone number" 
                      className="bg-background border-border mt-1.5 text-sm md:mt-2 md:text-base"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="message" className="uppercase tracking-wide font-bold text-xs md:text-sm">Message</Label>
                    <Textarea
                      id="message"
                      placeholder="Your message..."
                      rows={5}
                      required
                      className="bg-background border-border mt-1.5 text-sm md:mt-2 md:text-base"
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90 font-bold uppercase tracking-wide py-5 text-xs md:py-6 md:text-sm md:tracking-wider"
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
