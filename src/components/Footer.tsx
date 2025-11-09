import {
  Phone,
  Mail,
  MapPin,
} from "lucide-react";
import { Link } from "react-router-dom";

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
    <footer className="mt-12 bg-primary text-primary-foreground md:mt-20">
      <div className="container mx-auto px-4 pt-12 border-t border-primary-foreground/20 md:pt-16">
        <div className="grid gap-8 md:grid-cols-3 lg:grid-cols-4 pb-10 md:gap-12 md:pb-12">
          <div className="md:col-span-2">
            <p className="text-xs text-primary-foreground/80 leading-relaxed max-w-lg md:text-sm">
              We cultivate a balanced blend of traditional values and modern learning
              experiences so every student develops confidence, curiosity, and
              compassion for the world around them.
            </p>
            <div className="mt-5 flex flex-col gap-3 text-xs text-primary-foreground/80 md:mt-6 md:gap-4 md:text-sm">
              <div className="flex items-start gap-2.5 md:gap-3">
                <MapPin className="h-3.5 w-3.5 text-secondary mt-0.5 shrink-0 md:h-4 md:w-4 md:mt-1" />
                <span>Anupam Shiksha Niketan School, Kutail, Haryana 132037</span>
              </div>
              <div className="flex items-center gap-2.5 md:gap-3">
                <Phone className="h-3.5 w-3.5 text-secondary shrink-0 md:h-4 md:w-4" />
                <a href="tel:+918570054094" className="hover:text-secondary transition-colors">
                  +91-85700 54094
                </a>
              </div>
              <div className="flex items-center gap-2.5 md:gap-3">
                <Mail className="h-3.5 w-3.5 text-secondary shrink-0 md:h-4 md:w-4" />
                <a
                  href="mailto:anupamshikshaniketan@gmail.com"
                  className="hover:text-secondary transition-colors break-all"
                >
                  anupamshikshaniketan@gmail.com
                </a>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.15em] text-secondary mb-4 md:text-base md:tracking-[0.2em] md:mb-6">
              Popular
            </h3>
            <ul className="space-y-2 text-xs text-primary-foreground/80 md:space-y-3 md:text-sm">
              {popularLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="hover:text-secondary transition-colors flex items-center gap-2"
                  >
                    <span className="h-1 w-1 rounded-full bg-secondary/40 shrink-0" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.15em] text-secondary mb-4 md:text-base md:tracking-[0.2em] md:mb-6">
              Quick Links
            </h3>
            <ul className="space-y-2 text-xs text-primary-foreground/80 md:space-y-3 md:text-sm">
              {quickLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="hover:text-secondary transition-colors flex items-center gap-2"
                  >
                    <span className="h-1 w-1 rounded-full bg-secondary/40 shrink-0" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/15 py-5 text-center text-[0.65rem] text-primary-foreground/70 md:py-6 md:text-xs">
          <p>
            &copy; {new Date().getFullYear()} Anupam Shiksha Niketan Sr. Sec. School. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
