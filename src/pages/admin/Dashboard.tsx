import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Users, Award, Image as ImageIcon } from "lucide-react";
import { motion } from "framer-motion";

interface DashboardProps {
    stats: {
        activities: number;
        staff: number;
        toppers: number;
        gallery: number;
    };
}

export const Dashboard = ({ stats }: DashboardProps) => {
    const cards = [
        { label: "Total Activities", value: stats.activities, icon: Calendar, color: "text-blue-500", bg: "bg-blue-50" },
        { label: "Staff Members", value: stats.staff, icon: Users, color: "text-green-500", bg: "bg-green-50" },
        { label: "Toppers", value: stats.toppers, icon: Award, color: "text-yellow-500", bg: "bg-yellow-50" },
        { label: "Gallery Images", value: stats.gallery, icon: ImageIcon, color: "text-purple-500", bg: "bg-purple-50" },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                <p className="text-muted-foreground">Overview of your school management system.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {cards.map((card, index) => {
                    const Icon = card.icon;
                    return (
                        <motion.div
                            key={card.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Card className="hover:shadow-lg transition-shadow duration-200">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">
                                        {card.label}
                                    </CardTitle>
                                    <div className={`p-2 rounded-full ${card.bg}`}>
                                        <Icon className={`h-4 w-4 ${card.color}`} />
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{card.value}</div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};
