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
  Calendar,
  ArrowRight,
  CheckCircle2,
  Shield,
  Heart,
  Brain,
  Loader2,
  Quote,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useFeaturedReviews, usePublishedActivities } from "@/hooks/useContentQueries";

const STATS = [
  { value: "2.5", unit: "Acre Campus", detail: "Safe, green & future-ready infrastructure" },
  { value: "1000+", unit: "Learners", detail: "From Nursery to Class XII" },
  { value: "50+", unit: "Faculty", detail: "Experienced & dedicated mentors" },
  { value: "100+", unit: "Activities", detail: "Co-curricular & leadership clubs" },
];

const HIGHLIGHTS = [
  {
    icon: CheckCircle2,
    title: "Academic Excellence",
    description:
      "Structured learning pathways with continuous assessment to ensure every child reaches mastery.",
  },
  {
    icon: Heart,
    title: "Wellbeing First",
    description:
      "Pastoral care, counselling, and values education nurture confident and compassionate individuals.",
  },
  {
    icon: Shield,
    title: "Safe & Secure",
    description:
      "Monitored campus, transport oversight, and child-friendly policies keep every learner protected.",
  },
];

const LEARNING_PATH = [
  {
    title: "Foundational Years",
    description: "Nursery – Class II focus on joyful discovery, language readiness, and numeracy.",
    icon: BookOpen,
  },
  {
    title: "Preparatory Stage",
    description: "Classes III – V strengthen core concepts with experiential projects and STEAM.",
    icon: Users,
  },
  {
    title: "Middle School",
    description: "Classes VI – VIII integrate critical thinking, research, and collaborative learning.",
    icon: Brain,
  },
  {
    title: "Senior Secondary",
    description:
      "Classes IX – XII personalise streams, career guidance, and board-prep excellence.",
    icon: Trophy,
  },
];

const CAMPUS_FEATURES = [
  {
    title: "Knowledge Hub Library",
    description: "400+ curated books, digital resources, and reading corners to inspire curiosity.",
    image: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=600&h=400&fit=crop",
  },
  {
    title: "Sports & Fitness Arena",
    description: "Integrated programme for athletics, basketball, volleyball, and yoga.",
    image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=600&h=400&fit=crop",
  },
  {
    title: "Innovation Laboratories",
    description:
      "State-of-the-art science and maths labs that encourage experimentation and maker mindsets.",
    image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600&h=400&fit=crop",
  },
  {
    title: "Performing Arts Studio",
    description: "Music and cultural programmes that celebrate talent and self-expression.",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=400&fit=crop",
  },
];

const COMMUNITY_HIGHLIGHTS = [
  {
    title: "Photo Gallery",
    description: "Explore glimpses of school events, classrooms, and campus life captured throughout the year.",
    to: "/gallery",
    icon: Sparkles,
  },
  {
    title: "Student Activities",
    description: "Track upcoming and recent co-curricular programmes that keep our learners engaged and inspired.",
    to: "/activities",
    icon: Calendar,
  },
  {
    title: "Academic Toppers",
    description: "Celebrate achievers who have excelled in board examinations and inspired their peers.",
    to: "/toppers",
    icon: Trophy,
  },
  {
    title: "Meet Our Staff",
    description: "Get to know the teachers and mentors who guide students with dedication and expertise.",
    to: "/staff",
    icon: Users,
  },
];

const Index = () => {
  const activitiesQuery = usePublishedActivities();
  const reviewsQuery = useFeaturedReviews();

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Navbar />
      <HeroSlider />

      <main className="flex-1">
        {/* Stats */}
        <section className="relative z-30 py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 md:gap-6">
              {STATS.map((stat) => (
                <Card
                  key={stat.unit}
                  className="relative overflow-hidden border border-border bg-white shadow-lg shadow-primary/5 transition hover:-translate-y-1 hover:shadow-xl"
                >
                  <CardContent className="p-4 md:p-6">
                    <p className="text-2xl font-semibold text-primary md:text-4xl">{stat.value}</p>
                    <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground md:text-sm">
                      {stat.unit}
                    </p>
                    <p className="mt-2 text-xs text-muted-foreground md:mt-3 md:text-sm">{stat.detail}</p>
                    </CardContent>
                  </Card>
              ))}
          </div>
        </div>
      </section>

        {/* School Overview */}
        <section className="py-12 md:py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid gap-8 lg:gap-12 lg:grid-cols-2">
              <div className="space-y-4 md:space-y-6">
                <span className="inline-block rounded-full bg-primary/10 px-3 py-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.25em] text-primary md:px-4 md:py-2 md:text-xs md:tracking-[0.3em]">
                  About The School
                </span>
                <h2 className="text-2xl font-semibold text-primary md:text-4xl">
                  Cultivating curiosity, character, and community.
                </h2>
                <p className="text-sm leading-relaxed text-muted-foreground md:text-lg">
                  Our CBSE-affiliated school in Kutail, Haryana, offers a warm, inclusive environment
                  that celebrates traditional values and modern aspirations. Each classroom, club, and
                  mentorship opportunity helps learners discover their unique strengths while developing
                  resilience and empathy.
                </p>
                <div className="grid gap-3 sm:grid-cols-2 md:gap-4">
                  <Card className="border border-border/50 bg-white shadow-none hover:border-primary/40">
                    <CardContent className="flex gap-2.5 p-4 md:gap-3 md:p-5">
                      <GraduationCap className="mt-0.5 h-6 w-6 shrink-0 text-primary md:mt-1 md:h-8 md:w-8" />
                      <div>
                        <h3 className="text-sm font-semibold text-primary md:text-base">CBSE Excellence</h3>
                        <p className="text-xs text-muted-foreground md:text-sm">
                          Structured academics with project-based learning and board success.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border border-border/50 bg-white shadow-none hover:border-primary/40">
                    <CardContent className="flex gap-2.5 p-4 md:gap-3 md:p-5">
                      <Heart className="mt-0.5 h-6 w-6 shrink-0 text-primary md:mt-1 md:h-8 md:w-8" />
                      <div>
                        <h3 className="text-sm font-semibold text-primary md:text-base">Care & Wellbeing</h3>
                        <p className="text-xs text-muted-foreground md:text-sm">
                          Counselling, value education, and safe spaces that nurture confidence.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border border-border/50 bg-white shadow-none hover:border-primary/40">
                    <CardContent className="flex gap-2.5 p-4 md:gap-3 md:p-5">
                      <Sparkles className="mt-0.5 h-6 w-6 shrink-0 text-primary md:mt-1 md:h-8 md:w-8" />
                      <div>
                        <h3 className="text-sm font-semibold text-primary md:text-base">Beyond Classrooms</h3>
                        <p className="text-xs text-muted-foreground md:text-sm">
                          Clubs, sports, and cultural programmes that spark creativity and leadership.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border border-border/50 bg-white shadow-none hover:border-primary/40">
                    <CardContent className="flex gap-2.5 p-4 md:gap-3 md:p-5">
                      <Shield className="mt-0.5 h-6 w-6 shrink-0 text-primary md:mt-1 md:h-8 md:w-8" />
                      <div>
                        <h3 className="text-sm font-semibold text-primary md:text-base">Future-Ready Skills</h3>
                        <p className="text-xs text-muted-foreground md:text-sm">
                          Technology integration, communication, and citizenship for tomorrow's world.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
                  <Button
                    asChild
                    className="bg-primary px-5 py-4 text-xs font-semibold uppercase tracking-wide text-primary-foreground hover:bg-primary/90 md:px-6 md:py-5 md:text-sm"
                  >
                    <Link to="/about">Explore Our Story</Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="border-primary/40 px-5 py-4 text-xs font-semibold uppercase tracking-wide text-primary hover:bg-primary/10 md:px-6 md:py-5 md:text-sm"
                  >
                    <Link to="/academics">Academic Handbook</Link>
                  </Button>
                </div>
              </div>

              <div className="relative rounded-2xl border border-border bg-primary text-primary-foreground p-6 shadow-2xl md:rounded-3xl md:p-10">
                <div className="absolute -top-10 left-10 hidden h-24 w-24 rounded-full bg-secondary/30 blur-3xl lg:block" />
                <div className="relative space-y-4 md:space-y-6">
                  <p className="text-[0.65rem] uppercase tracking-[0.25em] text-secondary-foreground/80 md:text-xs md:tracking-[0.3em]">
                    Our Promise
                  </p>
                  <h3 className="text-lg font-semibold md:text-2xl">
                    "We want every learner to feel empowered, supported, and ready to make a
                    difference."
                  </h3>
                  <div className="grid gap-3 rounded-xl bg-white/10 p-4 text-xs leading-relaxed md:gap-4 md:rounded-2xl md:p-6 md:text-sm lg:grid-cols-2">
                    <div>
                      <p className="text-[0.65rem] uppercase tracking-[0.15em] text-secondary md:text-xs md:tracking-[0.2em]">Since 2001</p>
                      <p className="mt-1 text-xs font-semibold md:text-sm">Legacy of trust & excellence</p>
                    </div>
                    <div>
                      <p className="text-[0.65rem] uppercase tracking-[0.15em] text-secondary md:text-xs md:tracking-[0.2em]">Community</p>
                      <p className="mt-1 text-xs font-semibold md:text-sm">Strong parent-school partnerships</p>
                    </div>
                    <div>
                      <p className="text-[0.65rem] uppercase tracking-[0.15em] text-secondary md:text-xs md:tracking-[0.2em]">Mentorship</p>
                      <p className="mt-1 text-xs font-semibold md:text-sm">Experienced educators & counsellors</p>
                    </div>
                    <div>
                      <p className="text-[0.65rem] uppercase tracking-[0.15em] text-secondary md:text-xs md:tracking-[0.2em]">Opportunities</p>
                      <p className="mt-1 text-xs font-semibold md:text-sm">Academic and co-scholastic scholarships</p>
                    </div>
                  </div>
                  <p className="text-xs text-primary-foreground/80 md:text-sm">
                    Families choose us for the blend of rigorous academics, values-driven education,
                    and a campus culture that encourages every student to shine.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Highlights */}
        <section className="bg-accent py-12 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl">
              <span className="text-[0.65rem] uppercase tracking-[0.25em] text-primary md:text-xs md:tracking-[0.35em]">
                Why Families Trust Us
              </span>
              <h2 className="mt-3 text-2xl font-semibold text-primary md:mt-4 md:text-4xl">
                A holistic journey from foundation to leadership.
            </h2>
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 md:mt-12 md:grid-cols-3 md:gap-6">
              {HIGHLIGHTS.map((item) => {
                const Icon = item.icon;
                return (
                  <Card
                    key={item.title}
                    className="border border-border/70 bg-white shadow-none transition hover:-translate-y-1 hover:border-primary/60 hover:shadow-lg"
                  >
                    <CardContent className="p-5 md:p-6">
                      <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary md:h-12 md:w-12">
                        <Icon className="h-5 w-5 md:h-6 md:w-6" />
                      </span>
                      <h3 className="mt-4 text-base font-semibold text-primary md:mt-6 md:text-lg">{item.title}</h3>
                      <p className="mt-2 text-xs leading-relaxed text-muted-foreground md:mt-3 md:text-sm">
                        {item.description}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
          </div>
        </div>
      </section>

        {/* Learning Path */}
        <section className="py-12 md:py-24">
        <div className="container mx-auto px-4">
            <div className="text-center">
              <span className="text-[0.65rem] uppercase tracking-[0.25em] text-primary md:text-xs md:tracking-[0.35em]">
                Learning Continuum
              </span>
              <h2 className="mt-3 text-2xl font-semibold text-primary md:mt-4 md:text-4xl">
                Every stage crafted for balanced growth.
            </h2>
              <p className="mx-auto mt-3 max-w-3xl text-sm text-muted-foreground md:mt-4 md:text-lg">
                Our vertically aligned curriculum builds conceptual clarity, values, and life skills
                year after year, ensuring readiness for higher education and the world beyond.
            </p>
          </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 md:mt-12 md:gap-6 lg:grid-cols-4">
              {LEARNING_PATH.map((stage) => {
                const Icon = stage.icon;
              return (
                  <Card
                    key={stage.title}
                    className="border border-border/70 bg-white/80 shadow-none transition hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg"
                  >
                    <CardContent className="p-5 md:p-6">
                      <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-secondary/10 text-secondary md:h-12 md:w-12">
                        <Icon className="h-5 w-5 md:h-6 md:w-6" />
                      </span>
                      <h3 className="mt-4 text-base font-semibold text-primary md:mt-6 md:text-lg">{stage.title}</h3>
                      <p className="mt-2 text-xs leading-relaxed text-muted-foreground md:mt-3 md:text-sm">
                        {stage.description}
                      </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

        {/* Campus Experience */}
        <section className="bg-white py-12 md:py-24">
          <div className="container mx-auto px-4">
            <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end md:gap-6">
              <div>
                <span className="text-[0.65rem] uppercase tracking-[0.25em] text-primary md:text-xs md:tracking-[0.35em]">
                  Campus Experience
                </span>
                <h2 className="mt-3 text-2xl font-semibold text-primary md:mt-4 md:text-4xl">
                  Spaces that encourage curiosity, collaboration, and creativity.
                </h2>
              </div>
              <Button
                asChild
                variant="outline"
                className="border-primary/30 px-5 py-4 text-xs font-semibold uppercase tracking-wide text-primary hover:bg-primary/10 md:px-6 md:py-5 md:text-sm"
              >
                <Link to="/facilities">Explore Facilities</Link>
              </Button>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 md:mt-12 md:gap-6 xl:grid-cols-4">
              {CAMPUS_FEATURES.map((feature) => (
                <Card
                  key={feature.title}
                  className="group overflow-hidden border border-border/60 bg-white shadow-none transition hover:-translate-y-1 hover:border-primary/50 hover:shadow-xl"
                >
                  <div className="relative h-40 overflow-hidden md:h-48">
                    <img
                      src={feature.image}
                      alt={feature.title}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-primary/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  </div>
                  <CardContent className="p-4 md:p-6">
                    <h3 className="text-base font-semibold text-primary md:text-lg">{feature.title}</h3>
                    <p className="mt-2 text-xs leading-relaxed text-muted-foreground md:mt-3 md:text-sm">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      </section>

        {/* Community Highlights */}
        <section className="py-12 md:py-24 bg-accent/20">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <span className="text-[0.65rem] uppercase tracking-[0.25em] text-primary md:text-xs md:tracking-[0.35em]">
                Connect With Us
              </span>
              <h2 className="mt-3 text-2xl font-semibold text-primary md:mt-4 md:text-4xl">
                Stay close to our community stories.
              </h2>
              <p className="mx-auto mt-3 max-w-3xl text-sm text-muted-foreground md:mt-4 md:text-lg">
                Jump into the sections below to browse photo albums, follow student programmes, meet our
                faculty, and recognise the toppers who make us proud.
              </p>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 md:mt-12 md:gap-6 lg:grid-cols-4">
              {COMMUNITY_HIGHLIGHTS.map((item) => {
                const Icon = item.icon;
                return (
                  <Card
                    key={item.title}
                    className="border border-border/60 bg-white/90 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                  >
                    <CardContent className="flex h-full flex-col gap-3 p-5 md:gap-4 md:p-6">
                      <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary md:h-12 md:w-12">
                        <Icon className="h-5 w-5 md:h-6 md:w-6" />
                      </span>
                      <div className="flex-1 space-y-1.5 md:space-y-2">
                        <h3 className="text-base font-semibold text-primary md:text-lg">{item.title}</h3>
                        <p className="text-xs leading-relaxed text-muted-foreground md:text-sm">{item.description}</p>
                      </div>
                      <Button
                        asChild
                        variant="link"
                        className="px-0 text-xs text-primary hover:text-secondary md:text-sm"
                      >
                        <Link to={item.to}>
                          Explore
                          <ArrowRight className="ml-1.5 inline h-3.5 w-3.5 md:ml-2 md:h-4 md:w-4" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* News & Events */}
        <section className="bg-accent py-12 md:py-24">
        <div className="container mx-auto px-4">
            <div className="text-center">
              <span className="text-[0.65rem] uppercase tracking-[0.25em] text-primary md:text-xs md:tracking-[0.35em]">
                Latest Happenings
              </span>
              <h2 className="mt-3 text-2xl font-semibold text-primary md:mt-4 md:text-4xl">
                Celebrating our vibrant school life.
              </h2>
              <p className="mx-auto mt-3 max-w-3xl text-sm text-muted-foreground md:mt-4 md:text-lg">
                Our calendar is filled with scholastic achievements, cultural showcases, sports
                victories, and community outreach programmes.
              </p>
          </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 md:mt-12 md:grid-cols-3 md:gap-6">
              {activitiesQuery.isLoading ? (
                <div className="col-span-full flex flex-col items-center justify-center gap-3 py-16 text-muted-foreground">
                  <Loader2 className="h-6 w-6 animate-spin" />
                  <p className="text-xs uppercase tracking-[0.3em]">Loading recent activities</p>
                </div>
              ) : activitiesQuery.isError ? (
                <div className="col-span-full rounded-lg border border-destructive/40 bg-destructive/10 p-6 text-center text-destructive">
                  We're unable to show recent activities right now. Please check back shortly.
                </div>
              ) : !activitiesQuery.data?.length ? (
                <div className="col-span-full rounded-lg border border-dashed border-border p-10 text-center text-muted-foreground">
                  Our latest news and events will appear here soon.
                </div>
              ) : (
                activitiesQuery.data.slice(0, 3).map((activity) => (
                  <Card
                    key={activity.id}
                    className="overflow-hidden border border-border/60 bg-white shadow-none transition hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg"
                  >
                    <div className="relative h-40 overflow-hidden md:h-48">
                      {activity.image_url ? (
                        <img
                          src={activity.image_url}
                          alt={activity.title}
                          className="h-full w-full object-cover transition duration-500 hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-accent/40 text-xs uppercase tracking-[0.35em] text-muted-foreground">
                          No Image
                        </div>
                      )}
                      <div className="absolute top-3 left-3 rounded-full bg-secondary px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-wide text-secondary-foreground shadow md:top-4 md:left-4 md:px-3 md:text-xs">
                        <Calendar className="mr-1.5 inline h-2.5 w-2.5 md:mr-2 md:h-3 md:w-3" />
                        {new Date(activity.activity_date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </div>
                    </div>
                    <CardContent className="p-4 md:p-6">
                      <h3 className="text-base font-semibold text-primary md:text-lg">{activity.title}</h3>
                      {activity.description ? (
                        <p className="mt-2 text-xs leading-relaxed text-muted-foreground md:mt-3 md:text-sm">
                          {activity.description}
                        </p>
                      ) : null}
                      <Button
                        asChild
                        variant="link"
                        className="mt-3 px-0 text-xs text-primary hover:text-secondary md:mt-4 md:text-sm"
                      >
                        <Link to="/activities">
                          View Activities
                          <ArrowRight className="ml-1.5 inline h-3.5 w-3.5 md:ml-2 md:h-4 md:w-4" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
        </div>
      </section>

        {/* Reviews */}
        <section className="bg-white py-12 md:py-24">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <span className="text-[0.65rem] uppercase tracking-[0.25em] text-primary md:text-xs md:tracking-[0.35em]">
                Voices From Our Community
              </span>
              <h2 className="mt-3 text-2xl font-semibold text-primary md:mt-4 md:text-4xl">
                Parent trust, alumni pride, and partner confidence.
              </h2>
              <p className="mx-auto mt-3 max-w-3xl text-sm text-muted-foreground md:mt-4 md:text-lg">
                Hear what families and well-wishers say about their experience with Anupam Senior Secondary School.
              </p>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 md:mt-12 md:gap-6 lg:grid-cols-3">
              {reviewsQuery.isLoading ? (
                <div className="col-span-full flex flex-col items-center justify-center gap-3 py-16 text-muted-foreground">
                  <Loader2 className="h-6 w-6 animate-spin" />
                  <p className="text-xs uppercase tracking-[0.3em]">Gathering feedback</p>
                </div>
              ) : reviewsQuery.isError ? (
                <div className="col-span-full rounded-lg border border-destructive/40 bg-destructive/10 p-6 text-center text-destructive">
                  Reviews are unavailable at the moment. Please refresh later.
                </div>
              ) : !reviewsQuery.data?.length ? (
                <div className="col-span-full rounded-lg border border-dashed border-border p-10 text-center text-muted-foreground">
                  Be the first to share your feedback with the school community.
                </div>
              ) : (
                reviewsQuery.data.slice(0, 3).map((review) => (
                  <Card
                    key={review.id}
                    className="flex h-full flex-col justify-between border border-border/60 bg-card shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                  >
                    <CardContent className="flex h-full flex-col gap-4 p-5 md:p-6">
                      <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-secondary/10 text-secondary md:h-12 md:w-12">
                        <Quote className="h-5 w-5 md:h-6 md:w-6" />
                      </span>
                      <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
                        “{review.content}”
                      </p>
                      <div className="space-y-1">
                        <p className="text-sm font-semibold text-primary md:text-base">{review.author_name}</p>
                        {review.author_role ? (
                          <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">{review.author_role}</p>
                        ) : null}
                        {review.rating !== null ? (
                          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-secondary">
                            Rating {review.rating.toFixed(1)} / 5
                          </p>
                        ) : null}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>

            {/* Review Submission Form */}
            <div className="mt-12 max-w-3xl mx-auto">
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
