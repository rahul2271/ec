// import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata = {
  title: "About Us",
  description: "Learn more about our e-commerce platform and mission",
};

export default function AboutPage() {
  return (
    <>
       
      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="bg-secondary border-b border-border py-16 md:py-24">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">
              About Our Platform
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We're building the future of e-commerce with a focus on merchant success and
              affiliate empowerment.
            </p>
          </div>
        </section>

        {/* Mission Section */}
        <section className="max-w-4xl mx-auto px-4 py-16 md:py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h2 className="text-3xl font-serif font-bold text-foreground mb-4">
                Our Mission
              </h2>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                We believe that commerce should be simple, fair, and rewarding for everyone
                involved. Our platform connects sellers with customers while empowering
                affiliates to build sustainable income through transparent partnerships.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                By combining intuitive technology with genuine support, we're creating a
                marketplace where merchants thrive, customers find value, and partners grow
                together.
              </p>
            </div>
            <div className="bg-secondary rounded-lg p-8 border border-border">
              <h3 className="text-xl font-semibold text-foreground mb-4">By The Numbers</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-3xl font-bold text-primary">10K+</p>
                  <p className="text-muted-foreground">Active Users</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-primary">50K+</p>
                  <p className="text-muted-foreground">Products Listed</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-primary">$2M+</p>
                  <p className="text-muted-foreground">Affiliate Earnings Paid</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="bg-secondary border-y border-border py-16 md:py-24">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-3xl font-serif font-bold text-foreground mb-12 text-center">
              Our Values
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "Transparency",
                  description:
                    "We believe in honest communication and clear metrics so everyone understands how the platform works.",
                },
                {
                  title: "Fairness",
                  description:
                    "Equal opportunities for all participants. We don't favor any group—merchants, customers, or affiliates.",
                },
                {
                  title: "Innovation",
                  description:
                    "We continuously improve our platform with new features and better tools for success.",
                },
                {
                  title: "Support",
                  description:
                    "Our team is dedicated to helping you succeed with responsive customer service.",
                },
                {
                  title: "Security",
                  description:
                    "We protect your data and transactions with industry-leading security standards.",
                },
                {
                  title: "Community",
                  description:
                    "We foster a supportive ecosystem where members help each other grow.",
                },
              ].map((value, idx) => (
                <div key={idx} className="border border-border rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {value.title}
                  </h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="max-w-4xl mx-auto px-4 py-16 md:py-24">
          <h2 className="text-3xl font-serif font-bold text-foreground mb-12 text-center">
            Our Team
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {[
              {
                name: "Sarah Johnson",
                role: "Founder & CEO",
                bio: "Former e-commerce executive with 15+ years building marketplace platforms.",
              },
              {
                name: "Michael Chen",
                role: "CTO",
                bio: "Software engineer and product strategist focused on scalable platforms.",
              },
              {
                name: "Emily Rodriguez",
                role: "Head of Community",
                bio: "Community builder and user advocate ensuring platform success for all members.",
              },
              {
                name: "David Park",
                role: "VP Finance",
                bio: "Finance expert ensuring transparent, fair payouts and sustainable growth.",
              },
            ].map((member, idx) => (
              <div key={idx} className="border border-border rounded-lg p-6 bg-secondary">
                <h3 className="text-lg font-semibold text-foreground mb-1">
                  {member.name}
                </h3>
                <p className="text-sm text-primary font-medium mb-3">{member.role}</p>
                <p className="text-muted-foreground text-sm">{member.bio}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-primary/5 border-t border-border py-16">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-serif font-bold text-foreground mb-4">
              Join Our Community
            </h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Whether you're a merchant, customer, or affiliate partner, there's a place for
              you on our platform. Let's build something great together.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild>
                <Link href="/shop">Start Shopping</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/contact">Get in Touch</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
