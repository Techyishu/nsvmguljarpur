import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PageHero } from "@/components/PageHero";
import { Button } from "@/components/ui/button";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { motion } from "framer-motion";

const Contact = () => {


  const contactInfo = [
    {
      icon: MapPin,
      title: "Visit Us",
      content: "Nirakar Jyoti Vidya Mandir Gullarpur, Karnal, Haryana 132037",
      color: "text-red-500",
      bg: "bg-red-50"
    },
    {
      icon: Phone,
      title: "Call Us",
      content: "+91-77770 77176",
      color: "text-blue-500",
      bg: "bg-blue-50"
    },
    {
      icon: Mail,
      title: "Email Us",
      content: "njvidyamandir@gmail.com",
      color: "text-orange-500",
      bg: "bg-orange-50"
    },
    {
      icon: Clock,
      title: "Office Hours",
      content: "Mon - Sat: 8:00 AM - 2:00 PM",
      color: "text-green-500",
      bg: "bg-green-50"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground font-sans selection:bg-secondary/30">
      <Navbar />

      <main className="flex-grow">
        <PageHero
          title="Contact Us"
          description="Reach out to our team for admissions queries, campus visits, or general assistance — we're happy to help."
          eyebrow="Get In Touch"
          backgroundImage="/images/Gemini_Generated_Image_d2ubl3d2ubl3d2ub.png"
        />

        <section className="py-12 md:py-24 relative overflow-hidden">
          {/* Decorative background elements */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
            <div className="absolute top-1/4 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl"></div>
          </div>

          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              {/* Contact Information */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="mb-10 text-center">
                  <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary mb-4">Let's Start a Conversation</h2>
                  <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                    Have questions about admissions, academics, or campus life? We're here to help you every step of the way.
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  {contactInfo.map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="bg-card p-6 rounded-2xl border border-border/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group text-center"
                      >
                        <div className={`w-12 h-12 ${item.bg} rounded-xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform`}>
                          <Icon className={`h-6 w-6 ${item.color}`} />
                        </div>
                        <h3 className="font-heading font-bold text-lg text-primary mb-2">{item.title}</h3>
                        <p className="text-muted-foreground text-sm leading-relaxed">{item.content}</p>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Map Section */}
        <section className="h-[400px] md:h-[500px] w-full bg-muted relative grayscale hover:grayscale-0 transition-all duration-700">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3460.667287803323!2d77.0568763150983!3d29.84499998195547!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390e67f9a5a5a5a5%3A0x5a5a5a5a5a5a5a5a!2sNirakar%20Jyoti%20Vidya%20Mandir!5e0!3m2!1sen!2sin!4v1625641234567!5m2!1sen!2sin"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            title="School Location"
          ></iframe>

          {/* Map Overlay Card */}
          <div className="absolute bottom-6 left-4 right-4 md:left-10 md:right-auto md:w-80 bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-2xl border border-white/20">
            <h4 className="font-bold text-primary text-lg mb-2">Locate Us</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Easily accessible from Karnal city center via the main highway.
            </p>
            <Button variant="outline" size="sm" className="w-full" asChild>
              <a href="https://goo.gl/maps/example" target="_blank" rel="noopener noreferrer">
                Get Directions
              </a>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
