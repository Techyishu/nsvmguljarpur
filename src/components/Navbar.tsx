import { useState } from "react";
import { Menu, X, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NavLink } from "@/components/NavLink";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: "HOME", path: "/" },
    { name: "WHO WE ARE", path: "/about" },
    { name: "WHAT WE DO", path: "/academics" },
    { name: "NEWS & EVENTS", path: "/gallery" },
    { name: "CONTACTS", path: "/contact" },
  ];

  return (
    <nav className="bg-background/95 backdrop-blur-sm text-foreground shadow-lg sticky top-0 z-50 border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          <NavLink to="/" className="flex items-center space-x-2">
            <GraduationCap className="h-8 w-8 text-secondary" />
            <span className="font-bold text-xl uppercase tracking-wider">Anupam Shiksha Niketan</span>
          </NavLink>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className="px-4 py-2 text-sm font-bold uppercase tracking-wider hover:text-secondary transition-colors relative group"
                activeClassName="text-secondary"
              >
                {item.name}
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-secondary transform scale-x-0 group-hover:scale-x-100 transition-transform"></span>
              </NavLink>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className="block px-3 py-3 text-base font-bold uppercase tracking-wider hover:text-secondary transition-colors"
                activeClassName="text-secondary"
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </NavLink>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};
