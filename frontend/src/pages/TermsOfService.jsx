import React, { useEffect } from 'react';

const TermsOfService = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="pt-20">
      <div className="bg-[#01298a] py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white text-center">
            Terms of Service
          </h1>
          <p className="text-white/80 text-center mt-4">
            Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="prose prose-lg max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Welcome to ReCircle Foundation. By accessing or using our website and services, you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, please do not use our website or services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. About ReCircle Foundation</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              ReCircle Foundation is a non-profit organization dedicated to building an ethical, inclusive, and self-sustaining circular economy in India. Our mission focuses on formalizing waste workers (Safai Saathis), building infrastructure for waste recovery, and driving behavioral change in communities.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Use of Website</h2>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">3.1 Permitted Use</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              You may use our website for lawful purposes only. You agree to use our website in accordance with all applicable laws and regulations.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">3.2 Prohibited Activities</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              You agree not to:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
              <li>Use our website for any unlawful purpose or to solicit illegal activities</li>
              <li>Attempt to gain unauthorized access to our systems or networks</li>
              <li>Transmit any viruses, malware, or other harmful code</li>
              <li>Harass, abuse, or harm other users or the foundation</li>
              <li>Impersonate any person or entity or misrepresent your affiliation</li>
              <li>Collect or store personal data of other users without consent</li>
              <li>Use automated systems to access the website without permission</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Intellectual Property Rights</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              All content on this website, including text, graphics, logos, images, and software, is the property of ReCircle Foundation or its content suppliers and is protected by copyright, trademark, and other intellectual property laws.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              You may not reproduce, distribute, modify, or create derivative works from any content on our website without our express written permission.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. User Content</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              If you submit any content to our website (including comments, feedback, or other communications), you grant ReCircle Foundation a non-exclusive, worldwide, royalty-free license to use, reproduce, and display such content for our charitable purposes.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              You represent and warrant that you own or have the necessary rights to any content you submit and that such content does not violate any third-party rights.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Donations and Contributions</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              All donations made to ReCircle Foundation are voluntary and non-refundable unless otherwise required by law. Donations are used to support our mission and programs as described on our website.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              We reserve the right to refuse or return any donation at our discretion. Donation receipts will be provided for tax purposes as applicable under Indian tax laws.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Third-Party Links and Services</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Our website may contain links to third-party websites or services. We are not responsible for the content, accuracy, or practices of these external sites. Your use of third-party websites is at your own risk and subject to their terms and conditions.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Disclaimer of Warranties</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Our website and services are provided "as is" and "as available" without warranties of any kind, either express or implied. We do not warrant that:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
              <li>The website will be uninterrupted, timely, secure, or error-free</li>
              <li>The information provided is accurate, complete, or current</li>
              <li>Any defects or errors will be corrected</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Limitation of Liability</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              To the fullest extent permitted by law, ReCircle Foundation shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses resulting from:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
              <li>Your use or inability to use our website or services</li>
              <li>Any unauthorized access to or use of our servers or personal information</li>
              <li>Any interruption or cessation of transmission to or from our website</li>
              <li>Any bugs, viruses, or other harmful code transmitted through our website</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Indemnification</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              You agree to indemnify, defend, and hold harmless ReCircle Foundation, its directors, officers, employees, volunteers, and partners from any claims, liabilities, damages, losses, and expenses arising from your use of our website or violation of these Terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Governing Law and Jurisdiction</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              These Terms shall be governed by and construed in accordance with the laws of India. Any disputes arising from these Terms or your use of our website shall be subject to the exclusive jurisdiction of the courts in Mumbai, India.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Changes to Terms</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We reserve the right to modify these Terms at any time. We will notify users of any material changes by posting the updated Terms on this page with a new "Last updated" date. Your continued use of our website after changes constitutes acceptance of the modified Terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Termination</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We reserve the right to terminate or suspend your access to our website at any time, without prior notice, for conduct that we believe violates these Terms or is harmful to other users, us, or third parties, or for any other reason at our sole discretion.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">14. Severability</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              If any provision of these Terms is found to be unenforceable or invalid, that provision will be limited or eliminated to the minimum extent necessary so that the remaining provisions will remain in full force and effect.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">15. Contact Information</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              If you have any questions about these Terms of Service, please contact us:
            </p>
            <div className="bg-brand-offwhite p-6 rounded-lg">
              <p className="text-gray-700 mb-2"><strong>ReCircle Foundation</strong></p>
              <p className="text-gray-700 mb-2">Email: info@recirclefoundation.org</p>
              <p className="text-gray-700 mb-2">Phone: +91 90042 40004</p>
              <p className="text-gray-700">Address: Mumbai, India</p>
            </div>
          </section>

          <div className="bg-brand-blue/10 border-l-4 border-brand-blue p-6 rounded-r-lg mt-8">
            <p className="text-gray-800">
              By using our website and services, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
