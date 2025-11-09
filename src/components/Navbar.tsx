import { useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
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

type NavItem =
  | { name: string; path: string; children?: undefined }
  | { name: string; path?: undefined; children: { name: string; path: string }[] };

const navItems: NavItem[] = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Academics", path: "/academics" },
  {
    name: "Campus",
    children: [
      { name: "Facilities", path: "/facilities" },
      { name: "Activities", path: "/activities" },
      { name: "Gallery", path: "/gallery" },
    ],
  },
  {
    name: "Community",
    children: [
      { name: "Toppers", path: "/toppers" },
      { name: "Staff", path: "/staff" },
    ],
  },
  { name: "Contact", path: "/contact" },
];


export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50">

      <nav className="bg-primary text-primary-foreground border-b border-border shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-20">
            <NavLink to="/" className="flex items-center space-x-3">
              <img
                src="/images/anupam-sr.-sec-school-2.png"
                alt="Anupam Shiksha Niketan logo"
                className="h-10 w-auto md:h-12"
              />
            </NavLink>

            <div className="hidden lg:flex items-center gap-6">
              {navItems.map((item) => {
                if (item.children) {
                  const isGroupActive = item.children.some(
                    (child) => location.pathname === child.path,
                  );
                  return (
                    <DropdownMenu key={item.name}>
                      <DropdownMenuTrigger asChild>
                        <button
                          type="button"
                          className={clsx(
                            "inline-flex items-center gap-2 text-sm font-medium uppercase tracking-wide transition-colors py-2",
                            isGroupActive
                              ? "text-secondary"
                              : "text-primary-foreground/80 hover:text-secondary",
                          )}
                        >
                          {item.name}
                          <ChevronDown className="h-4 w-4" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-48 rounded-lg border border-border bg-card text-foreground shadow-lg">
                        {item.children.map((child) => (
                          <DropdownMenuItem key={child.path} className="p-0">
                            <NavLink
                              to={child.path}
                              className={({ isActive }) =>
                                clsx(
                                  "block w-full px-3 py-2 text-sm font-medium uppercase tracking-wide transition-colors",
                                  isActive
                                    ? "bg-secondary text-secondary-foreground"
                                    : "hover:bg-muted",
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
                        "group relative text-sm font-medium uppercase tracking-wide transition-colors py-2",
                        isActive ? "text-secondary" : "text-primary-foreground/80 hover:text-secondary",
                      )
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {item.name}
                        <span
                          className={clsx(
                            "pointer-events-none absolute bottom-0 left-0 h-0.5 w-full origin-left transform bg-secondary transition-transform duration-300",
                            isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100",
                          )}
                        />
                      </>
                    )}
                  </NavLink>
                );
              })}
            </div>

            <div className="hidden lg:flex items-center gap-3">
              <Button asChild className="bg-secondary text-secondary-foreground hover:bg-secondary/90 px-6">
                <NavLink to="/contact">Apply Now</NavLink>
              </Button>
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-primary-foreground"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle navigation menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {isOpen && (
          <div className="lg:hidden border-t border-border bg-primary text-primary-foreground">
            <div className="container mx-auto px-4 py-4">
              <div className="grid gap-4">
                {navItems.map((item) => {
                  if (item.children) {
                    return (
                      <div key={item.name} className="space-y-2">
                        <p className="px-3 text-[0.65rem] font-semibold uppercase tracking-[0.15em] text-primary-foreground/50">
                          {item.name}
                        </p>
                        <div className="space-y-1">
                          {item.children.map((child) => (
                            <NavLink
                              key={child.path}
                              to={child.path}
                              className={({ isActive }) =>
                                clsx(
                                  "block rounded-md px-3 py-2 text-xs font-semibold uppercase tracking-wide",
                                  isActive
                                    ? "bg-secondary text-secondary-foreground"
                                    : "text-primary-foreground hover:bg-primary-foreground/10"
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
                          "block rounded-md px-3 py-2 text-xs font-semibold uppercase tracking-wide",
                          isActive
                            ? "bg-secondary text-secondary-foreground"
                            : "text-primary-foreground hover:bg-primary-foreground/10"
                        )
                      }
                      onClick={() => setIsOpen(false)}
                    >
                      {item.name}
                    </NavLink>
                  );
                })}
              </div>

              <div className="flex flex-col gap-2 pt-2">
                <Button asChild className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
                  <NavLink to="/contact">Apply Now</NavLink>
                </Button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};
