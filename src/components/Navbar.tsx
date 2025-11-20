import { useState, useEffect } from "react";
import { Menu, X, ChevronDown, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NavLink } from "@/components/NavLink";
import clsx from "clsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLocation } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { motion, AnimatePresence } from "framer-motion";

type NavItem =
  | { name: string; path: string; children?: undefined }
  | { name: string; path?: undefined; children: { name: string; path: string }[] };

const navItems: NavItem[] = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Academics", path: "/academics" },
  { name: "Facilities", path: "/facilities" },
  { name: "Activities", path: "/activities" },
  { name: "Gallery", path: "/gallery" },
  { name: "Toppers", path: "/toppers" },
  { name: "Staff", path: "/staff" },
  { name: "Contact", path: "/contact" },
];

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const isMobile = useIsMobile();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={clsx(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        scrolled
          ? "glass py-2 shadow-lg"
          : "bg-transparent py-4"
      )}
    >
      <nav className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <NavLink to="/" className="flex items-center gap-3 group">
            <div className="relative flex-shrink-0 overflow-hidden rounded-xl shadow-lg group-hover:shadow-primary/20 transition-all duration-300">
              <img
                src="/images/nirakar-jyoti-vidya-mandir-gullarpur-logo.jpeg"
                alt="Nirakar Jyoti Vidya Mandir Gullarpur logo"
                className="h-12 w-12 sm:h-14 sm:w-14 object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </div>
            <div className="flex flex-col">
              <span className={clsx(
                "text-lg sm:text-xl font-bold leading-none tracking-tight transition-colors duration-300",
                scrolled ? "text-primary" : "text-white drop-shadow-md"
              )}>
                Nirakar Jyoti
              </span>
              {!isMobile && (
                <span className={clsx(
                  "text-sm font-medium tracking-wide transition-colors duration-300",
                  scrolled ? "text-muted-foreground" : "text-white/90 drop-shadow-sm"
                )}>
                  Vidya Mandir
                </span>
              )}
            </div>
          </NavLink>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1 bg-white/10 backdrop-blur-sm p-1.5 rounded-full border border-white/20 shadow-sm">
            {navItems.map((item) => {
              if (item.children) {
                const isGroupActive = item.children.some(
                  (child) => location.pathname === child.path
                );
                return (
                  <DropdownMenu key={item.name}>
                    <DropdownMenuTrigger asChild>
                      <button
                        type="button"
                        className={clsx(
                          "inline-flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-full transition-all duration-300",
                          isGroupActive
                            ? "bg-white text-primary shadow-sm"
                            : scrolled ? "text-foreground hover:bg-white/50" : "text-white hover:bg-white/20"
                        )}
                      >
                        {item.name}
                        <ChevronDown className="h-3 w-3 opacity-70" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56 p-2 rounded-2xl border-white/20 bg-white/80 backdrop-blur-xl shadow-xl animate-slide-up">
                      {item.children.map((child) => (
                        <DropdownMenuItem key={child.path} className="p-0 focus:bg-transparent">
                          <NavLink
                            to={child.path}
                            className={({ isActive }) =>
                              clsx(
                                "block w-full px-4 py-2.5 text-sm font-medium rounded-xl transition-all",
                                isActive
                                  ? "bg-primary/10 text-primary"
                                  : "text-muted-foreground hover:text-primary hover:bg-primary/5"
                              )
                            }
                          >
                            {child.name}
                          </NavLink>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                );
              }

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    clsx(
                      "px-5 py-2 text-sm font-medium rounded-full transition-all duration-300 relative",
                      isActive
                        ? "bg-white text-primary shadow-sm font-semibold"
                        : scrolled ? "text-foreground hover:bg-white/50" : "text-white hover:bg-white/20"
                    )
                  }
                >
                  {item.name}
                </NavLink>
              );
            })}
          </div>

          <div className="hidden lg:flex items-center gap-3">
            <Button asChild className="rounded-full bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold px-6 shadow-lg shadow-secondary/20 hover:shadow-secondary/40 transition-all duration-300 hover:-translate-y-0.5">
              <NavLink to="/contact">Apply Now</NavLink>
            </Button>
          </div>

          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className={clsx(
              "lg:hidden transition-colors",
              scrolled ? "text-primary" : "text-white hover:bg-white/20"
            )}
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle navigation menu"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden fixed inset-x-4 top-20 z-40"
            >
              <div className="rounded-3xl border border-white/20 bg-white/90 backdrop-blur-2xl p-4 shadow-2xl ring-1 ring-black/5">
                <div className="grid gap-1 max-h-[70vh] overflow-y-auto pr-2">
                  {navItems.map((item) => {
                    if (item.children) {
                      return (
                        <div key={item.name} className="space-y-1 py-2">
                          <div className="px-4 text-xs font-bold uppercase tracking-wider text-muted-foreground/70">
                            {item.name}
                          </div>
                          <div className="pl-4 space-y-1 border-l-2 border-primary/10 ml-4">
                            {item.children.map((child) => (
                              <NavLink
                                key={child.path}
                                to={child.path}
                                className={({ isActive }) =>
                                  clsx(
                                    "block px-4 py-3 text-sm font-medium rounded-xl transition-colors",
                                    isActive
                                      ? "text-primary bg-primary/5"
                                      : "text-muted-foreground hover:text-primary hover:bg-primary/5"
                                  )
                                }
                                onClick={() => setIsOpen(false)}
                              >
                                {child.name}
                              </NavLink>
                            ))}
                          </div>
                        </div>
                      );
                    }

                    return (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                          clsx(
                            "block px-4 py-3 text-sm font-medium rounded-xl transition-all",
                            isActive
                              ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                              : "text-foreground hover:bg-muted"
                          )
                        }
                        onClick={() => setIsOpen(false)}
                      >
                        {item.name}
                      </NavLink>
                    );
                  })}
                </div>
                <div className="mt-4 pt-4 border-t border-border/50">
                  <Button asChild className="w-full rounded-xl bg-secondary text-secondary-foreground font-bold shadow-lg h-12 text-lg">
                    <NavLink to="/contact">Apply Now</NavLink>
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
};
