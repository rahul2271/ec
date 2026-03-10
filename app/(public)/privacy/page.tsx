// import { Header } from "@/components/header";
import Link from "next/link";

export const metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy for our e-commerce platform",
};

export default function PrivacyPage() {
  return (
    <>
       
      <main className="min-h-screen bg-background">
        <article className="max-w-3xl mx-auto px-4 py-12">
          <h1 className="text-4xl font-serif font-bold text-foreground mb-2">
            Privacy Policy
          </h1>
          <p className="text-muted-foreground mb-8">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <div className="prose prose-invert max-w-none space-y-6 text-muted-foreground">
            <section>
              <h2 className="text-2xl font-serif font-bold text-foreground mb-3">
                1. Introduction
              </h2>
              <p>
                We are committed to protecting your privacy. This Privacy Policy explains how
                we collect, use, disclose, and safeguard your information when you visit our
                website and use our services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-bold text-foreground mb-3">
                2. Information We Collect
              </h2>
              <h3 className="text-lg font-semibold text-foreground mt-3 mb-2">
                Personal Information
              </h3>
              <p>We may collect personal information including but not limited to:</p>
              <ul className="list-disc list-inside space-y-2 mt-3">
                <li>Name and email address</li>
                <li>Billing and shipping address</li>
                <li>Phone number</li>
                <li>Payment information</li>
                <li>Account login credentials</li>
              </ul>

              <h3 className="text-lg font-semibold text-foreground mt-5 mb-2">
                Automatically Collected Information
              </h3>
              <p>When you visit our website, we automatically collect:</p>
              <ul className="list-disc list-inside space-y-2 mt-3">
                <li>Browser type and IP address</li>
                <li>Pages visited and time spent on site</li>
                <li>Referring URL and exit pages</li>
                <li>Cookie and tracking data</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-bold text-foreground mb-3">
                3. How We Use Your Information
              </h2>
              <p>We use the information we collect to:</p>
              <ul className="list-disc list-inside space-y-2">
                <li>Process your orders and send you related information</li>
                <li>Provide customer service and respond to your inquiries</li>
                <li>Send promotional communications (with your consent)</li>
                <li>Improve our website and services</li>
                <li>Detect and prevent fraudulent transactions</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-bold text-foreground mb-3">
                4. Information Sharing
              </h2>
              <p>
                We do not sell, trade, or rent your personal information to third parties. We
                may share information with:
              </p>
              <ul className="list-disc list-inside space-y-2 mt-3">
                <li>Service providers who assist us in operating our website</li>
                <li>Payment processors for payment transactions</li>
                <li>Shipping partners for order fulfillment</li>
                <li>Law enforcement if required by law</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-bold text-foreground mb-3">
                5. Data Security
              </h2>
              <p>
                We implement appropriate technical and organizational measures to protect your
                personal information against unauthorized access, alteration, disclosure, or
                destruction. However, no method of transmission over the internet is completely
                secure.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-bold text-foreground mb-3">
                6. Cookies
              </h2>
              <p>
                Our website uses cookies to enhance your experience. Cookies are small files
                stored on your device that help us remember your preferences and improve our
                services. You can control cookie settings in your browser.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-bold text-foreground mb-3">
                7. Your Rights
              </h2>
              <p>Depending on your location, you may have the right to:</p>
              <ul className="list-disc list-inside space-y-2 mt-3">
                <li>Access your personal information</li>
                <li>Request correction of inaccurate data</li>
                <li>Request deletion of your data</li>
                <li>Opt-out of marketing communications</li>
                <li>Request a copy of your information</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-bold text-foreground mb-3">
                8. Third-Party Links
              </h2>
              <p>
                Our website may contain links to third-party websites. We are not responsible
                for the privacy practices of external sites. We encourage you to review their
                privacy policies.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-bold text-foreground mb-3">
                9. Children's Privacy
              </h2>
              <p>
                Our website is not intended for children under 13. We do not knowingly collect
                personal information from children under 13. If we become aware of such
                collection, we will take steps to delete it.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-bold text-foreground mb-3">
                10. Policy Updates
              </h2>
              <p>
                We may update this Privacy Policy periodically. We will notify you of
                significant changes by updating the date at the top of this page and, if
                necessary, by email.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-bold text-foreground mb-3">
                Contact Us
              </h2>
              <p>
                If you have questions about this Privacy Policy, please{" "}
                <Link href="/contact" className="text-primary hover:text-primary/80">
                  contact us
                </Link>
                .
              </p>
            </section>
          </div>
        </article>
      </main>
    </>
  );
}
