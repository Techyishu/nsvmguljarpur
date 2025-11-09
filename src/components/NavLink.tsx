import { NavLink as RouterNavLink, NavLinkProps } from "react-router-dom";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

type ClassNameProp =
  | string
  | ((state: { isActive: boolean; isPending: boolean }) => string | undefined);

interface NavLinkCompatProps extends Omit<NavLinkProps, "className"> {
  className?: ClassNameProp;
  activeClassName?: string;
  pendingClassName?: string;
}

const NavLink = forwardRef<HTMLAnchorElement, NavLinkCompatProps>(
  ({ className, activeClassName, pendingClassName, to, ...props }, ref) => {
    return (
      <RouterNavLink
        ref={ref}
        to={to}
        className={({ isActive, isPending }) => {
          if (typeof className === "function") {
            return cn(className({ isActive, isPending }));
          }

          return cn(
            className,
            isActive && activeClassName,
            isPending && pendingClassName
          );
        }}
        {...props}
      />
    );
  },
);

NavLink.displayName = "NavLink";

export { NavLink };
