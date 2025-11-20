import {
  Phone,
  Mail,
  MapPin,
  Facebook,
  Instagram,
  Youtube,
  ArrowRight,
  Heart
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const popularLinks = [
  { label: "About Us", to: "/about" },
  { label: "Academics", to: "/academics" },
  { label: "Facilities", to: "/facilities" },
  { label: "Gallery", to: "/gallery" },
];

const quickLinks = [
  { label: "Activities", to: "/activities" },
  { label: "Toppers", to: "/toppers" },
  { label: "Staff", to: "/staff" },
  { label: "Contact Us", to: "/contact" },
];

export const Footer = () => {
  return (
    <footer className="mt-12 md:mt-20 bg-slate-900 text-white relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-secondary via-accent to-secondary" />
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-accent/10 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 pt-20 pb-10 relative z-10">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4 mb-16">
          {/* Brand Column */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white rounded-xl">
                <img
                  src="/images/nirakar-jyoti-vidya-mandir-gullarpur-logo.jpeg"
                  alt="Logo"
                  className="h-12 w-12 object-cover"
                />
              </div>
              <div>
                <h3 className="font-heading font-bold text-xl leading-tight text-white">Nirakar Jyoti</h3>
                <p className="text-xs text-white/60 font-medium tracking-wide uppercase">Vidya Mandir</p>
              </div>
            </div>
            <p className="text-sm text-white/70 leading-relaxed max-w-xs">
              Empowering students with knowledge, character, and confidence. A place where tradition meets modern education.
            </p>
            <div className="flex items-center gap-3">
              <Button size="icon" variant="outline" className="rounded-full border-white/10 bg-white/5 hover:bg-primary hover:text-white hover:border-primary transition-all duration-300" aria-label="Facebook">
                <Facebook className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="outline" className="rounded-full border-white/10 bg-white/5 hover:bg-pink-600 hover:text-white hover:border-pink-600 transition-all duration-300" aria-label="Instagram">
                <Instagram className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="outline" className="rounded-full border-white/10 bg-white/5 hover:bg-red-600 hover:text-white hover:border-red-600 transition-all duration-300" aria-label="YouTube">
                <Youtube className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-semibold text-lg mb-6 flex items-center gap-2 text-white">
              Explore
            </h4>
            <ul className="space-y-3">
              {popularLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-white/60 hover:text-secondary transition-colors flex items-center gap-2 group w-fit"
                  >
                    <ArrowRight className="h-3 w-3 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300 text-secondary" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* More Links */}
          <div>
            <h4 className="font-heading font-semibold text-lg mb-6 flex items-center gap-2 text-white">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-white/60 hover:text-secondary transition-colors flex items-center gap-2 group w-fit"
                  >
                    <ArrowRight className="h-3 w-3 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300 text-secondary" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-heading font-semibold text-lg mb-6 flex items-center gap-2 text-white">
              Contact Us
            </h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3 text-sm text-white/70 group">
                <div className="p-2 rounded-lg bg-white/5 group-hover:bg-secondary/20 transition-colors mt-0.5 shrink-0">
                  <MapPin className="h-4 w-4 text-secondary" />
                </div>
                <span className="leading-relaxed group-hover:text-white transition-colors">
                  Nirakar Jyoti Vidya Mandir<br />
                  Gullarpur, Karnal<br />
                  Haryana 132037
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm text-white/70 group">
                <div className="p-2 rounded-lg bg-white/5 group-hover:bg-secondary/20 transition-colors shrink-0">
                  <Phone className="h-4 w-4 text-secondary" />
                </div>
                <a href="tel:+919050293002" className="hover:text-white transition-colors">
                  +91-90502 93002
                </a>
              </div>
              <div className="flex items-center gap-3 text-sm text-white/70 group">
                <div className="p-2 rounded-lg bg-white/5 group-hover:bg-secondary/20 transition-colors shrink-0">
                  <Mail className="h-4 w-4 text-secondary" />
                </div>
                <a href="mailto:nirakarjyotividyamandir@gmail.com" className="hover:text-white transition-colors break-all">
                  nirakarjyotividyamandir@gmail.com
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-4 text-xs text-white/40">
          <p className="flex items-center gap-1">
            &copy; {new Date().getFullYear()} Nirakar Jyoti Vidya Mandir. Made with <Heart className="h-3 w-3 text-red-500 fill-red-500" /> for education.
          </p>
          <div className="flex items-center gap-6">
            <Link to="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="#" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
