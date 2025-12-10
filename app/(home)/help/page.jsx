"use client";

import { Mail, Phone, MessageCircle, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function HelpSupportPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-12 text-black mt-20">
      {/* TITLE */}
      <div className="text-center">
        <h1 className="text-4xl font-bold">Help & Support</h1>
        <p className="text-gray-600 mt-2">
          Get answers, find solutions, and reach out anytime you need help.
        </p>
      </div>

      {/* CONTACT INFO + FORM */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* CONTACT INFO */}
        <div className="p-6 rounded-xl border bg-white shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Contact Information</h2>

          <div className="space-y-4 text-gray-700">
            <p className="flex items-center gap-3">
              <Mail size={20} className="text-blue-600" />
              support@sosay.com
            </p>

            <p className="flex items-center gap-3">
              <Phone size={20} className="text-green-600" />
              +00 33666100010
            </p>

            <p className="flex items-center gap-3">
              <MessageCircle size={20} className="text-purple-600" />
              Live Chat (Launching soon)
            </p>

            <p className="flex items-center gap-3">
              <HelpCircle size={20} className="text-orange-600" />
              Community Help Center (Coming soon)
            </p>
          </div>
        </div>

        {/* SUPPORT FORM */}
        <div className="p-6 rounded-xl border bg-white shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Send Us a Message</h2>

          <form className="space-y-4">
            <Input placeholder="Your Name" className="text-black" />
            <Input placeholder="Your Email" type="email" className="text-black" />
            <Textarea
              rows={4}
              placeholder="Describe your issue or question..."
              className="text-black"
            />
            <Button className="w-full">Submit</Button>
          </form>

          <p className="text-xs text-gray-500 mt-3">
            Our support team will reply within 24–48 hours.
          </p>
        </div>
      </div>

      {/* FAQ SECTION */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Frequently Asked Questions</h2>

        <Accordion type="single" collapsible className="w-full text-black">
          {/* ACCOUNT */}
          <AccordionItem value="acc-1">
            <AccordionTrigger>How do I reset my password?</AccordionTrigger>
            <AccordionContent>
              Go to <b>Settings → Account → Change Password</b> and follow the steps.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="acc-2">
            <AccordionTrigger>Why is my profile not updating?</AccordionTrigger>
            <AccordionContent>
              Please check your internet connection. If the issue continues, try logging out and back in.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="acc-3">
            <AccordionTrigger>
              How do I delete or deactivate my account?
            </AccordionTrigger>
            <AccordionContent>
              Go to <b>Settings → Privacy & Account</b> to deactivate, or contact support for deletion.
            </AccordionContent>
          </AccordionItem>

          {/* SAFETY */}
          <AccordionItem value="safety-1">
            <AccordionTrigger>
              How do I report inappropriate or harmful content?
            </AccordionTrigger>
            <AccordionContent>
              Tap the <b>Report</b> button on the post or profile. Our team reviews reports within 24 hours.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="safety-2">
            <AccordionTrigger>
              What type of content is not allowed?
            </AccordionTrigger>
            <AccordionContent>
              We do not allow violence, nudity, sexual content, hate speech, scams, threats, spam, or abuse.
            </AccordionContent>
          </AccordionItem>

          {/* CONTENT CREATORS */}
          <AccordionItem value="creator-1">
            <AccordionTrigger>
              How do I become a content creator?
            </AccordionTrigger>
            <AccordionContent>
              Any user can post content. Creator tools will unlock automatically as your profile grows.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="creator-2">
            <AccordionTrigger>
              How do I collaborate with brands?
            </AccordionTrigger>
            <AccordionContent>
              Verified creators can access <b>Creator Dashboard → Brand Deals</b> to manage collaborations.
            </AccordionContent>
          </AccordionItem>

          {/* BUSINESS USER */}
          <AccordionItem value="business-1">
            <AccordionTrigger>
              How do I create a business account?
            </AccordionTrigger>
            <AccordionContent>
              Go to <b>Settings → Switch to Business Account</b>. You can manage analytics and promotions.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="business-2">
            <AccordionTrigger>
              How do I promote my products or services?
            </AccordionTrigger>
            <AccordionContent>
              Use the <b>Promotions</b> tab to run ads, boost posts, and track performance.
            </AccordionContent>
          </AccordionItem>

          {/* TECH ISSUE */}
          <AccordionItem value="tech-1">
            <AccordionTrigger>
              The app is slow or crashing. What should I do?
            </AccordionTrigger>
            <AccordionContent>
              Try clearing cache, updating the app, or restarting your device. If it continues, contact support.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="tech-2">
            <AccordionTrigger>
              I didn’t receive my verification code.
            </AccordionTrigger>
            <AccordionContent>
              Wait 1–2 minutes and try again. If the problem persists, switch to email verification.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      {/* EXTRA HELP SECTION */}
      <div className="p-6 rounded-xl border bg-white shadow-sm">
        <h2 className="text-xl font-semibold">Need More Help?</h2>
        <p className="text-gray-700 mt-2">
          Visit our <b>Support Center</b> for guides on account management,
          creator tools, promotion, safety, and more.
        </p>

        <Button className="mt-4">Go to Support Center</Button>
      </div>
    </div>
  );
}
