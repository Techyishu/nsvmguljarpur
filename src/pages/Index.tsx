import { Navbar } from "@/components/Navbar";
import { HeroSlider } from "@/components/HeroSlider";
import { Footer } from "@/components/Footer";
import { ReviewSubmissionForm } from "@/components/ReviewSubmissionForm";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  GraduationCap,
  Users,
  BookOpen,
  Trophy,
  Sparkles,
  ArrowRight,
  Heart,
  Brain,
  Loader2,
  Quote,
  Star,
  PlayCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useFeaturedReviews, usePublishedActivities } from "@/hooks/useContentQueries";
import clsx from "clsx";
import { motion } from "framer-motion";

const BENTO_ITEMS = [
  {
    title: "Academic Excellence",
    description: "CBSE curriculum with a focus on holistic development and critical thinking.",
    icon: GraduationCap,
    className: "md:col-span-2 md:row-span-2 bg-gradient-to-br from-primary to-primary/90 text-white",
    iconClassName: "text-secondary bg-white/10",
  },
  {
    title: "Sports Academy",
    description: "State-of-the-art facilities for cricket, football, and athletics.",
    icon: Trophy,
    className: "bg-white text-foreground border border-border/50 hover:border-primary/20",
    iconClassName: "text-primary bg-primary/5",
  },
  {
    title: "Creative Arts",
    description: "Music, dance, and visual arts studios to nurture talent.",
    icon: Sparkles,
    className: "bg-white text-foreground border border-border/50 hover:border-primary/20",
    iconClassName: "text-accent bg-accent/10",
  },
  {
    title: "Innovation Labs",
    description: "Advanced STEM labs for hands-on learning.",
    icon: Brain,
    className: "md:col-span-2 bg-secondary text-secondary-foreground",
    iconClassName: "text-primary bg-white/20",
  },
];

const LEARNING_PATH = [
  {
    title: "Foundational",
    grade: "Nursery - II",
    description: "Joyful discovery & language readiness.",
    icon: Heart,
    color: "bg-pink-50 text-pink-600",
  },
  {
    title: "Preparatory",
    grade: "III - V",
    description: "Experiential projects & STEAM focus.",
    icon: BookOpen,
    color: "bg-blue-50 text-blue-600",
  },
  {
    title: "Middle",
    grade: "VI - VIII",
    description: "Critical thinking & collaborative learning.",
    icon: Users,
    color: "bg-orange-50 text-orange-600",
  },
  {
    title: "Secondary",
    grade: "IX - XII",
    description: "Career guidance & board excellence.",
    icon: GraduationCap,
    color: "bg-purple-50 text-purple-600",
  },
];

const Index = () => {
  const activitiesQuery = usePublishedActivities();
  const reviewsQuery = useFeaturedReviews();

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground font-sans selection:bg-primary/20 selection:text-primary">
      <Navbar />
      <HeroSlider />

      <main className="flex-1">
        {/* Welcome / Bento Grid Section */}
        <section className="py-20 md:py-32 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('/grid.svg')] bg-center opacity-[0.03]" />

          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center max-w-3xl mx-auto mb-16 md:mb-24">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <span className="inline-block px-4 py-1.5 rounded-full bg-primary/5 text-primary text-xs font-bold uppercase tracking-widest mb-6 border border-primary/10">
                  Welcome to Nirakar Jyoti
                </span>
                <h2 className="text-4xl sm:text-5xl md:text-6xl font-heading font-bold text-foreground mb-6 leading-tight">
                  Where Education Meets <span className="text-gradient">Excellence</span>
                </h2>
                <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed">
                  We nurture curious, confident learners through balanced academics, expressive arts, and guided mentorship so every child discovers a path that fits their dreams.
                </p>
              </motion.div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
              {BENTO_ITEMS.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={clsx(
                    "rounded-[2rem] p-8 flex flex-col justify-between transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 group overflow-hidden relative",
                    item.className
                  )}
                >
                  {/* Decorative circle */}
                  <div className="absolute -right-12 -top-12 w-48 h-48 bg-white/10 rounded-full blur-3xl transition-all duration-700 group-hover:scale-150" />

                  <div className="relative z-10">
                    <div className={clsx("w-14 h-14 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-sm shadow-sm", item.iconClassName)}>
                      <item.icon className="h-7 w-7" />
                    </div>
                    <h3 className="text-2xl font-heading font-bold mb-3">{item.title}</h3>
                    <p className="text-sm opacity-90 leading-relaxed font-medium">{item.description}</p>
                  </div>

                  <div className="mt-8 relative z-10">
                    <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0">
                      Learn More <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Director's Message - Modern Split */}
        <section className="py-20 md:py-32 bg-slate-50 relative overflow-hidden">
          <div className="container mx-auto px-4 relative z-10">
            <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24 max-w-7xl mx-auto">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="lg:w-1/2 relative"
              >
                <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl">
                  <img
                    src="/images/director-vinod-kumar.jpg"
                    alt="Director Vinod Kumar"
                    className="w-full h-auto object-cover hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 p-8 md:p-10 text-white">
                    <p className="font-heading font-bold text-3xl mb-1">Vinod Kumar</p>
                    <p className="text-base opacity-90 font-medium tracking-wide uppercase text-secondary">Director</p>
                  </div>
                </div>
                {/* Floating Badge */}
                <div className="absolute -bottom-8 -right-8 bg-white p-6 rounded-2xl shadow-xl max-w-[200px] hidden md:block animate-float">
                  <p className="text-primary font-bold text-lg leading-tight">"Inspiring the next generation"</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="lg:w-1/2 space-y-8"
              >
                <div>
                  <span className="text-secondary font-bold tracking-widest uppercase text-xs mb-2 block">Director's Message</span>
                  <h2 className="text-4xl sm:text-5xl font-heading font-bold text-primary mb-6 leading-tight">
                    A Vision for <br /><span className="text-gradient">Holistic Growth</span>
                  </h2>
                  <div className="space-y-6 text-muted-foreground text-lg leading-relaxed">
                    <p>
                      "We are passionate about offering children an exciting, stimulating and rich curriculum, based on real reasons for learning."
                    </p>
                    <p>
                      "We hope that you will share with us the belief that every child should have the opportunity to meet their potential and develop the academic, creative, social and spiritual skills that will enable them to fulfill a happy and prosperous life."
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4">
                  <Button asChild size="lg" className="rounded-full px-8 h-14 text-base bg-primary hover:bg-primary/90 shadow-lg hover:shadow-primary/25">
                    <Link to="/about">Read Full Message</Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="rounded-full px-8 h-14 text-base border-primary/20 hover:bg-primary/5 text-primary">
                    <Link to="/contact" className="flex items-center gap-2">
                      <PlayCircle className="w-5 h-5" /> Watch Video
                    </Link>
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Learning Path - Cards */}
        <section className="py-20 md:py-32">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16 md:mb-24">
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-heading font-bold text-primary mb-6">
                Your Child's Journey
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                From their first steps in education to their leap into the future, we stay present at every milestone.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
              {LEARNING_PATH.map((stage, index) => (
                <motion.div
                  key={stage.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="relative group"
                >
                  <div className="h-full bg-white border border-border/40 rounded-[2rem] p-8 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 group-hover:border-primary/20">
                    <div className={clsx("w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-500 group-hover:scale-110", stage.color)}>
                      <stage.icon className="h-8 w-8" />
                    </div>
                    <div className="mb-3">
                      <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground bg-slate-100 px-3 py-1 rounded-full">{stage.grade}</span>
                    </div>
                    <h3 className="text-2xl font-bold text-primary mb-3">{stage.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{stage.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Latest Happenings - Dark Mode Style */}
        <section className="py-20 md:py-32 bg-slate-900 text-white relative overflow-hidden">
          {/* Background Glows */}
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[128px] pointer-events-none" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-[128px] pointer-events-none" />

          <div className="container mx-auto px-4 relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 md:mb-16 gap-6">
              <div className="text-left max-w-2xl">
                <span className="text-secondary font-bold tracking-widest uppercase text-xs mb-2 block">Latest News</span>
                <h2 className="text-4xl sm:text-5xl md:text-6xl font-heading font-bold">Campus Buzz</h2>
              </div>
              <Button
                asChild
                variant="outline"
                className="rounded-full border-white/20 bg-white/5 text-white hover:bg-white hover:text-slate-900 hover:border-white px-8 h-12"
              >
                <Link to="/activities">View All Activities</Link>
              </Button>
            </div>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {activitiesQuery.isLoading ? (
                <div className="col-span-3 py-20 flex justify-center">
                  <Loader2 className="h-10 w-10 animate-spin text-white/50" />
                </div>
              ) : activitiesQuery.data?.slice(0, 3).map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="bg-white/5 border-white/10 overflow-hidden hover:bg-white/10 transition-all duration-500 group flex flex-col h-full hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/10">
                    <div className="h-64 overflow-hidden relative">
                      {activity.image_url ? (
                        <img
                          src={activity.image_url}
                          alt={activity.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      ) : (
                        <div className="w-full h-full bg-white/5 flex items-center justify-center text-white/30">
                          <Sparkles className="w-12 h-12 opacity-20" />
                        </div>
                      )}
                      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md text-slate-900 text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
                        {new Date(activity.activity_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </div>
                    </div>
                    <CardContent className="p-8 flex flex-col flex-1">
                      <h3 className="text-2xl font-bold mb-3 line-clamp-2 text-white group-hover:text-secondary transition-colors">{activity.title}</h3>
                      <p className="text-white/60 text-base line-clamp-3 mb-6 flex-1 leading-relaxed">{activity.description}</p>
                      <Link to="/activities" className="inline-flex items-center text-white font-semibold hover:text-secondary transition-colors group/link">
                        Read More <ArrowRight className="ml-2 h-4 w-4 group-hover/link:translate-x-1 transition-transform" />
                      </Link>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 md:py-32 bg-background relative">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16 md:mb-24">
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-heading font-bold text-primary mb-4">Parent Voices</h2>
              <p className="text-lg text-muted-foreground">Trusted by over 1000+ families.</p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {reviewsQuery.data?.slice(0, 3).map((review, index) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white p-8 md:p-10 rounded-[2rem] border border-border/50 shadow-lg hover:shadow-2xl transition-all duration-500 relative group hover:-translate-y-1"
                >
                  <Quote className="absolute top-8 right-8 h-10 w-10 text-primary/5 group-hover:text-primary/10 transition-colors" />
                  <div className="flex gap-1 mb-6">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={clsx("h-5 w-5", i < (review.rating || 5) ? "text-secondary fill-secondary" : "text-gray-200")} />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-8 italic text-lg leading-relaxed line-clamp-4">"{review.content}"</p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
                      {review.author_name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-primary text-lg">{review.author_name}</p>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold">{review.author_role || "Parent"}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-20 max-w-3xl mx-auto bg-gradient-to-br from-primary/5 to-transparent rounded-[2.5rem] p-8 md:p-12 text-center border border-primary/10">
              <h3 className="text-2xl sm:text-3xl font-bold text-primary mb-6">Share Your Experience</h3>
              <ReviewSubmissionForm />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
