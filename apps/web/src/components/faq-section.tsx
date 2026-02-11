"use client";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@notra/ui/components/ui/collapsible";
import { useState } from "react";

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: "What is Notra and who is it for?",
    answer:
      "Notra is a comprehensive billing automation platform designed for businesses that need custom contract management. It's perfect for SaaS companies, service providers, and enterprises looking to streamline their billing processes.",
  },
  {
    question: "How does the custom contract billing work?",
    answer:
      "Our platform automatically processes your custom contracts, calculates billing amounts based on your specific terms, and generates invoices. You can set up complex pricing structures, usage-based billing, and custom billing cycles.",
  },
  {
    question: "Can I integrate Notra with my existing tools?",
    answer:
      "Yes! Notra integrates seamlessly with popular CRM systems, accounting software, and payment processors. We support APIs and webhooks for custom integrations with your existing workflow.",
  },
  {
    question: "What kind of support do you provide?",
    answer:
      "We offer 24/7 customer support, dedicated account managers for enterprise clients, comprehensive documentation, and onboarding assistance to help you get started quickly.",
  },
  {
    question: "Is my data secure with Notra?",
    answer:
      "Absolutely. We use enterprise-grade security measures including end-to-end encryption, SOC 2 compliance, and regular security audits. Your data is stored in secure, redundant data centers.",
  },
  {
    question: "How do I get started with Notra?",
    answer:
      "Getting started is simple! Sign up for our free trial, connect your existing systems, and our onboarding team will help you set up your first custom billing workflow within 24 hours.",
  },
];

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      height="24"
      viewBox="0 0 24 24"
      width="24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="m6 9 6 6 6-6"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

export default function FAQSection() {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setOpenItems((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  return (
    <div className="flex w-full items-start justify-center">
      <div className="flex flex-1 flex-col items-start justify-start gap-6 px-4 py-16 md:px-12 md:py-20 lg:flex-row lg:gap-12">
        <div className="flex w-full flex-col items-start justify-center gap-4 lg:flex-1 lg:py-5">
          <div className="flex w-full flex-col justify-center font-sans font-semibold text-4xl text-foreground leading-tight tracking-tight md:leading-[44px]">
            Frequently Asked Questions
          </div>
          <div className="w-full font-normal font-sans text-base text-muted-foreground leading-7">
            Explore your data, build your dashboard,
            <br className="hidden md:block" />
            bring your team together.
          </div>
        </div>

        <div className="flex w-full flex-col items-center justify-center lg:flex-1">
          <div className="flex w-full flex-col">
            {faqData.map((item, index) => {
              const isOpen = openItems.includes(index);

              return (
                <Collapsible
                  className="w-full overflow-hidden border-foreground/16 border-b"
                  key={index}
                  onOpenChange={() => toggleItem(index)}
                  open={isOpen}
                >
                  <CollapsibleTrigger className="flex w-full items-center justify-between gap-5 px-5 py-[18px] text-left transition-colors duration-200 hover:bg-foreground/[0.02]">
                    <div className="flex-1 font-medium font-sans text-base text-foreground leading-6">
                      {item.question}
                    </div>
                    <div className="flex items-center justify-center">
                      <ChevronDownIcon
                        className={`h-6 w-6 text-foreground/60 transition-transform duration-300 ease-in-out ${
                          isOpen ? "rotate-180" : "rotate-0"
                        }`}
                      />
                    </div>
                  </CollapsibleTrigger>

                  <CollapsibleContent className="overflow-hidden transition-all duration-300 ease-in-out data-[ending-style]:max-h-0 data-[starting-style]:max-h-0 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0 [[data-open]>&]:max-h-96 [[data-open]>&]:opacity-100">
                    <div className="px-5 pb-[18px] font-normal font-sans text-muted-foreground text-sm leading-6">
                      {item.answer}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
