// import { Header } from "@/components/header";
import Link from "next/link";

export const metadata = {
  title: "Terms of Service",
  description: "Terms of Service for our e-commerce platform",
};

export default function TermsPage() {
  return (
    <>
       
      <main className="min-h-screen bg-background">
        <article className="max-w-3xl mx-auto px-4 py-12">
          <h1 className="text-4xl font-serif font-bold text-foreground mb-2">
            Terms of Service
          </h1>
          <p className="text-muted-foreground mb-8">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <div className="prose prose-invert max-w-none space-y-6 text-muted-foreground">
            <section>
              <h2 className="text-2xl font-serif font-bold text-foreground mb-3">
                1. Agreement to Terms
              </h2>
              <p>
                By accessing and using this website and our services, you accept and agree to
                be bound by the terms and provision of this agreement. If you do not agree to
                abide by the above, please do not use this service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-bold text-foreground mb-3">
                2. Use License
              </h2>
              <p>
                Permission is granted to temporarily download one copy of the materials
                (information or software) on our website for personal, non-commercial
                transitory viewing only. This is the grant of a license, not a transfer of
                title, and under this license you may not:
              </p>
              <ul className="list-disc list-inside space-y-2 mt-3">
                <li>Modifying or copying the materials</li>
                <li>Using the materials for any commercial purpose or for any public display</li>
                <li>Attempting to decompile or reverse engineer any software contained on the website</li>
                <li>Removing any copyright or other proprietary notations from the materials</li>
                <li>Transferring the materials to another person or "mirroring" the materials on any other server</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-bold text-foreground mb-3">
                3. Disclaimer
              </h2>
              <p>
                The materials on our website are provided on an 'as is' basis. We make no
                warranties, expressed or implied, and hereby disclaim and negate all other
                warranties including, without limitation, implied warranties or conditions of
                merchantability, fitness for a particular purpose, or non-infringement of
                intellectual property or other violation of rights.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-bold text-foreground mb-3">
                4. Limitations
              </h2>
              <p>
                In no event shall our company or its suppliers be liable for any damages
                (including, without limitation, damages for loss of data or profit, or due to
                business interruption) arising out of the use or inability to use the materials
                on this website.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-bold text-foreground mb-3">
                5. Accuracy of Materials
              </h2>
              <p>
                The materials appearing on our website could include technical, typographical,
                or photographic errors. We do not warrant that any of the materials on our
                website are accurate, complete, or current. We may make changes to the
                materials contained on our website at any time without notice.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-bold text-foreground mb-3">
                6. Links
              </h2>
              <p>
                We have not reviewed all of the sites linked to our website and are not
                responsible for the contents of any such linked site. The inclusion of any
                link does not imply endorsement by us of the site. Use of any such linked
                website is at the user's own risk.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-bold text-foreground mb-3">
                7. Modifications
              </h2>
              <p>
                We may revise these terms of service for our website at any time without
                notice. By using this website, you are agreeing to be bound by the then current
                version of these terms of service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-bold text-foreground mb-3">
                8. Governing Law
              </h2>
              <p>
                These terms and conditions are governed by and construed in accordance with the
                laws of the jurisdiction in which we operate, and you irrevocably submit to the
                exclusive jurisdiction of the courts in that location.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif font-bold text-foreground mb-3">
                Contact Us
              </h2>
              <p>
                If you have any questions about these Terms of Service, please{" "}
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
