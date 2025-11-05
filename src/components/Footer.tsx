import { Phone, Mail, MapPin, Facebook, Twitter, Instagram, Youtube } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4">About School</h3>
            <p className="text-sm opacity-90">
              Educating the youth to take their productive place as leaders in the global community through comprehensive education from Nursery to Class 12.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm opacity-90">
              <li><a href="/about" className="hover:underline">About Us</a></li>
              <li><a href="/academics" className="hover:underline">Academics</a></li>
              <li><a href="/facilities" className="hover:underline">Facilities</a></li>
              <li><a href="/gallery" className="hover:underline">Gallery</a></li>
              <li><a href="/contact" className="hover:underline">Contact</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Contact Info</h3>
            <ul className="space-y-3 text-sm opacity-90">
              <li className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 mt-1 flex-shrink-0" />
                <span>School Address, City - 132037</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="h-4 w-4 flex-shrink-0" />
                <span>+91-85700 54094</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="h-4 w-4 flex-shrink-0" />
                <span>school@example.com</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="hover:opacity-80 transition-opacity">
                <Facebook className="h-6 w-6" />
              </a>
              <a href="#" className="hover:opacity-80 transition-opacity">
                <Twitter className="h-6 w-6" />
              </a>
              <a href="#" className="hover:opacity-80 transition-opacity">
                <Instagram className="h-6 w-6" />
              </a>
              <a href="#" className="hover:opacity-80 transition-opacity">
                <Youtube className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center text-sm opacity-90">
          <p>&copy; {new Date().getFullYear()} Shiksha Niketan. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
