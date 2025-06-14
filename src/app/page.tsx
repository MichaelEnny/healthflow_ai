
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Sparkles, BotMessageSquare, DatabaseZap, CalendarPlus, FileText, ChevronRight, Users, MessageSquare, Activity, ShieldCheck, TrendingUp, BrainCircuit } from 'lucide-react';
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const featureCards = [
  {
    icon: BotMessageSquare,
    title: "AI Symptom Analysis",
    description: "Describe symptoms in natural language and get instant, AI-driven insights about potential conditions.",
    dataAiHint: "artificial intelligence",
  },
  {
    icon: DatabaseZap,
    title: "Health Record Tracking",
    description: "Securely store and review your health history, including past analyses and diagnoses, all in one place.",
    dataAiHint: "medical records",
  },
  {
    icon: CalendarPlus,
    title: "Appointment Scheduling",
    description: "Easily schedule follow-up appointments based on your analysis results directly within the app.",
    dataAiHint: "calendar schedule",
  },
  {
    icon: FileText,
    title: "Normalized Symptom Reports",
    description: "Our AI normalizes your symptoms into standardized medical terms for clarity and easier communication.",
    dataAiHint: "medical report",
  }
];

const howItWorksSteps = [
  {
    id: 1,
    icon: MessageSquare,
    title: "Describe Your Symptoms",
    description: "Provide a detailed description of how you're feeling in your own words.",
  },
  {
    id: 2,
    icon: BrainCircuit,
    title: "Get AI-Powered Analysis",
    description: "Our advanced AI processes your information to identify potential conditions, urgency, and recommended next steps.",
  },
  {
    id: 3,
    icon: Activity,
    title: "Track & Act",
    description: "Save your analysis to your health history, and if needed, schedule an appointment with a healthcare professional.",
  }
];

const testimonials = [
  {
    quote: "HealthFlow AI helped me understand my symptoms quickly and gave me peace of mind. The appointment scheduling was a breeze!",
    name: "Sarah L.",
    role: "Busy Professional",
    avatar: "https://placehold.co/100x100.png",
    dataAiHint: "person portrait"
  },
  {
    quote: "As someone who likes to keep track of my health, this app is fantastic. The AI analysis is surprisingly accurate and informative.",
    name: "John B.",
    role: "Health Enthusiast",
    avatar: "https://placehold.co/100x100.png",
    dataAiHint: "person portrait"
  },
  {
    quote: "I was hesitant about AI in healthcare, but HealthFlow AI is user-friendly and provides genuinely helpful insights. Highly recommend!",
    name: "Maria K.",
    role: "Tech Skeptic",
    avatar: "https://placehold.co/100x100.png",
    dataAiHint: "person portrait"
  }
];


export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/20 via-background to-background py-20 md:py-32">
          <div className="container mx-auto px-6 text-center">
            <div className="max-w-3xl mx-auto">
              <Sparkles className="mx-auto h-16 w-16 text-primary mb-6" />
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
                Understand Your Health with <span className="text-primary">AI-Powered</span> Symptom Analysis
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-10">
                Get personalized insights, track your health journey, and schedule appointments seamlessly. HealthFlow AI is your intelligent health companion.
              </p>
              <Button size="lg" asChild className="shadow-lg hover:shadow-xl transition-shadow">
                <Link href="/analyze">
                  Analyze Your Symptoms Now <ChevronRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
            <div className="mt-16">
              <Image
                src="https://placehold.co/1200x600.png"
                alt="HealthFlow AI Dashboard Mockup"
                width={1200}
                height={600}
                className="rounded-xl shadow-2xl mx-auto"
                data-ai-hint="health technology"
                priority
              />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-16 md:py-24 bg-secondary/20">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Why Choose HealthFlow AI?</h2>
              <p className="text-lg text-muted-foreground mt-4 max-w-2xl mx-auto">
                Our platform offers a unique blend of cutting-edge AI technology and user-friendly design to empower your health journey.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {featureCards.map((feature) => (
                <Card key={feature.title} className="shadow-lg hover:shadow-xl transition-shadow bg-card">
                  <CardHeader>
                    <div className="bg-primary/10 text-primary p-3 rounded-full w-fit mb-4">
                      <feature.icon className="h-8 w-8" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-16 md:py-24">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Simple Steps to Better Health Insights</h2>
              <p className="text-lg text-muted-foreground mt-4 max-w-2xl mx-auto">
                Getting started with HealthFlow AI is quick and easy. Follow these simple steps:
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 items-start">
              {howItWorksSteps.map((step, index) => (
                <div key={step.id} className="flex flex-col items-center text-center p-6 rounded-lg bg-card shadow-md hover:shadow-lg transition-shadow">
                  <div className="bg-accent/10 text-accent p-4 rounded-full w-fit mb-6">
                    <step.icon className="h-10 w-10" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{step.id}. {step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="py-16 md:py-24 bg-primary/5">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Loved by Users Like You</h2>
              <p className="text-lg text-muted-foreground mt-4 max-w-2xl mx-auto">
                Don't just take our word for it. Here's what our users are saying about HealthFlow AI.
              </p>
            </div>
            <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-8">
              {testimonials.map((testimonial) => (
                <Card key={testimonial.name} className="shadow-lg bg-card flex flex-col">
                  <CardContent className="pt-6 flex-grow">
                    <MessageSquare className="h-8 w-8 text-primary/50 mb-4" />
                    <p className="text-muted-foreground italic mb-6">"{testimonial.quote}"</p>
                  </CardContent>
                  <CardHeader className="border-t pt-4">
                    <div className="flex items-center">
                      <Image src={testimonial.avatar} alt={testimonial.name} width={40} height={40} className="rounded-full mr-4" data-ai-hint={testimonial.dataAiHint} />
                      <div>
                        <CardTitle className="text-md">{testimonial.name}</CardTitle>
                        <CardDescription>{testimonial.role}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-20 md:py-32 text-center bg-gradient-to-t from-primary/10 to-background">
          <div className="container mx-auto px-6">
            <ShieldCheck className="mx-auto h-16 w-16 text-primary mb-6" />
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">
              Ready to Take Control of Your Health Journey?
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              Join thousands of users who are gaining valuable health insights with HealthFlow AI. It's fast, secure, and designed for you.
            </p>
            <Button size="lg" asChild className="shadow-lg hover:shadow-xl transition-shadow text-lg px-10 py-6">
              <Link href="/analyze">
                Start Your Free Analysis Today <TrendingUp className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

    