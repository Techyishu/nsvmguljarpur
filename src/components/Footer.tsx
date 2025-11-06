import { Phone, Mail, MapPin, Facebook, Twitter, Instagram, Youtube, GraduationCap } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const Footer = () => {
  return (
    <footer className="bg-card text-card-foreground border-t border-border">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div>
            <h3 className="font-bold text-lg mb-6 uppercase tracking-wider">Popular</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><a href="/about" className="hover:text-secondary transition-colors">About Us</a></li>
              <li><a href="/academics" className="hover:text-secondary transition-colors">Academics</a></li>
              <li><a href="/facilities" className="hover:text-secondary transition-colors">Facilities</a></li>
              <li><a href="/gallery" className="hover:text-secondary transition-colors">Gallery</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-6 uppercase tracking-wider">Quick Links</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><a href="/about" className="hover:text-secondary transition-colors">About Us</a></li>
              <li><a href="/academics" className="hover:text-secondary transition-colors">Academics</a></li>
              <li><a href="/facilities" className="hover:text-secondary transition-colors">Facilities</a></li>
              <li><a href="/gallery" className="hover:text-secondary transition-colors">News & Events</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-6 uppercase tracking-wider">Contact Us</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>Anupam Shiksha Niketan School Kutail, Haryana 132037</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="h-4 w-4 flex-shrink-0" />
                <span>+91-85700 54094</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="h-4 w-4 flex-shrink-0" />
                <span>anupamshikshaniketan@gmail.com</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-6 uppercase tracking-wider">Newsletter</h3>
            <p className="text-sm text-muted-foreground mb-4">Stay updated with our latest news and events</p>
            <div className="flex flex-col space-y-3">
              <Input 
                type="email" 
                placeholder="Enter your email here" 
                className="bg-background border-border"
              />
              <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-bold uppercase">
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        <div className="flex justify-center space-x-6 mt-12 mb-8">
          <a href="#" className="text-muted-foreground hover:text-secondary transition-colors">
            <Facebook className="h-6 w-6" />
          </a>
          <a href="#" className="text-muted-foreground hover:text-secondary transition-colors">
            <Twitter className="h-6 w-6" />
          </a>
          <a href="#" className="text-muted-foreground hover:text-secondary transition-colors">
            <Instagram className="h-6 w-6" />
          </a>
          <a href="#" className="text-muted-foreground hover:text-secondary transition-colors">
            <Youtube className="h-6 w-6" />
          </a>
        </div>

        <div className="flex items-center justify-center space-x-2 opacity-50">
          <GraduationCap className="h-8 w-8" />
          <span className="font-bold text-lg uppercase tracking-wider">Anupam Shiksha Niketan</span>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Anupam Shiksha Niketan Sr. Sec. School. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
