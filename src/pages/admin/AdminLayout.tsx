import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    LayoutDashboard,
    Calendar,
    Users,
    Award,
    Image as ImageIcon,
    LogOut,
    Menu,
    X,
    ChevronRight,
    MessageSquare,
    Settings
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AdminLayoutProps {
    children: React.ReactNode;
    activeTab: string;
    onTabChange: (tab: string) => void;
    onLogout: () => void;
}

const sidebarItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "activities", label: "Activities", icon: Calendar },
    { id: "staff", label: "Staff", icon: Users },
    { id: "toppers", label: "Toppers", icon: Award },
    { id: "gallery", label: "Gallery", icon: ImageIcon },
    { id: "reviews", label: "Reviews", icon: MessageSquare }, // Added Reviews item
    { id: "settings", label: "Settings", icon: Settings }, // Added Settings item
];

export const AdminLayout = ({ children, activeTab, onTabChange, onLogout }: AdminLayoutProps) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            const mobile = window.innerWidth < 768;
            setIsMobile(mobile);
            if (mobile) setIsSidebarOpen(false);
            else setIsSidebarOpen(true);
        };

        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {isMobile && isSidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsSidebarOpen(false)}
                        className="fixed inset-0 bg-black/50 z-40"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <motion.aside
                initial={false}
                animate={{
                    width: isSidebarOpen ? 280 : 0,
                    opacity: isSidebarOpen ? 1 : 0
                }}
                className={cn(
                    "fixed md:relative z-50 h-screen bg-white border-r border-slate-200 overflow-hidden flex flex-col shadow-xl md:shadow-none",
                    isMobile && !isSidebarOpen && "hidden"
                )}
            >
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                    <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                        Admin Panel
                    </h1>
                    {isMobile && (
                        <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(false)}>
                            <X className="h-5 w-5" />
                        </Button>
                    )}
                </div>

                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    {sidebarItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeTab === item.id;

                        return (
                            <button
                                key={item.id}
                                onClick={() => {
                                    onTabChange(item.id);
                                    if (isMobile) setIsSidebarOpen(false);
                                }}
                                className={cn(
                                    "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden",
                                    isActive
                                        ? "bg-primary text-primary-foreground shadow-md"
                                        : "hover:bg-slate-100 text-slate-600 hover:text-slate-900"
                                )}
                            >
                                <Icon className={cn("h-5 w-5", isActive ? "text-primary-foreground" : "text-slate-500 group-hover:text-slate-900")} />
                                <span className="font-medium">{item.label}</span>
                                {isActive && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute right-4"
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                    >
                                        <ChevronRight className="h-4 w-4" />
                                    </motion.div>
                                )}
                            </button>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-slate-100">
                    <Button
                        variant="ghost"
                        className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
                        onClick={onLogout}
                    >
                        <LogOut className="mr-2 h-5 w-5" />
                        Sign Out
                    </Button>
                </div>
            </motion.aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden">
                <header className="h-16 bg-white border-b border-slate-200 flex items-center px-6 justify-between md:justify-end">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="md:hidden"
                        onClick={() => setIsSidebarOpen(true)}
                    >
                        <Menu className="h-6 w-6" />
                    </Button>
                    <div className="flex items-center gap-4">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                            A
                        </div>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className="max-w-7xl mx-auto"
                    >
                        {children}
                    </motion.div>
                </div>
            </main>
        </div>
    );
};
