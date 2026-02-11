"use client";

import { Button } from "@notra/ui/components/ui/button";
import { useEffect, useState } from "react";

export default function TestimonialsSection() {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const testimonials = [
    {
      quote:
        "In just a few minutes, we transformed our data into actionable insights. The process was seamless and incredibly efficient!",
      name: "Jamie Marshall",
      company: "Co-founder, Exponent",
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Sep%2011%2C%202025%2C%2011_35_19%20AM-z4zSRLsbOQDp7MJS1t8EXmGNB6Al9Z.png",
    },
    {
      quote:
        "Notra has revolutionized how we handle custom contracts. The automation saves us hours every week and eliminates errors completely.",
      name: "Sarah Chen",
      company: "VP Operations, TechFlow",
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Sep%2011%2C%202025%2C%2010_54_18%20AM-nbiecp92QNdTudmCrHr97uekrIPzCP.png",
    },
    {
      quote:
        "The billing automation is a game-changer. What used to take our team days now happens automatically with perfect accuracy.",
      name: "Marcus Rodriguez",
      company: "Finance Director, InnovateCorp",
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20Sep%2011%2C%202025%2C%2011_01_05%20AM-TBOe92trRxKn4G5So1m9D2h7LRH4PG.png",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
        setTimeout(() => {
          setIsTransitioning(false);
        }, 100);
      }, 300);
    }, 12_000);

    return () => clearInterval(interval);
  }, [testimonials.length]);

  const handleNavigationClick = (index: number) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveTestimonial(index);
      setTimeout(() => {
        setIsTransitioning(false);
      }, 100);
    }, 300);
  };

  const current = testimonials[activeTestimonial]!;

  return (
    <div className="flex w-full flex-col items-center justify-center border-primary/12 border-b">
      <div className="flex items-center justify-start self-stretch overflow-hidden border border-t-0 border-r-0 border-b border-l-0 bg-background px-2">
        <div className="flex flex-1 flex-col items-end justify-center gap-6 py-16 md:flex-row md:py-17">
          <div className="flex flex-col items-start justify-center gap-4 self-stretch px-3 md:flex-row md:px-12">
            <img
              alt={current.name}
              className="h-50 w-48 rounded-lg object-cover transition-all duration-700 ease-in-out md:h-50 md:w-48"
              src={current.image || "/placeholder.svg"}
              style={{
                opacity: isTransitioning ? 0.6 : 1,
                transform: isTransitioning ? "scale(0.95)" : "scale(1)",
                transition:
                  "opacity 0.7s ease-in-out, transform 0.7s ease-in-out",
              }}
            />
            <div className="flex flex-1 flex-col items-start justify-start gap-6 overflow-hidden px-6 py-6 pt-0 pb-0 shadow-[0px_0px_0px_0.75px_rgba(50,45,43,0.12)] shadow-none">
              <div
                className="line-clamp-5 flex h-[200px] flex-col justify-start self-stretch overflow-hidden font-medium font-sans text-2xl text-foreground leading-10 tracking-tight transition-all duration-700 ease-in-out md:h-[210px] md:text-[32px] md:leading-[42px]"
                style={{
                  filter: isTransitioning ? "blur(4px)" : "blur(0px)",
                  transition: "filter 0.7s ease-in-out",
                }}
              >
                "{current.quote}"
              </div>
              <div
                className="flex flex-col items-start justify-start gap-1 self-stretch transition-all duration-700 ease-in-out"
                style={{
                  filter: isTransitioning ? "blur(4px)" : "blur(0px)",
                  transition: "filter 0.7s ease-in-out",
                }}
              >
                <div className="flex flex-col justify-center self-stretch font-medium font-sans text-foreground/90 text-lg leading-[26px]">
                  {current.name}
                </div>
                <div className="flex flex-col justify-center self-stretch font-medium font-sans text-foreground/70 text-lg leading-[26px]">
                  {current.company}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-start justify-start gap-[14px] pr-6">
            <Button
              className="h-9 w-9 overflow-hidden rounded-full border border-[rgba(0,0,0,0.15)] bg-transparent p-0 shadow-[0px_1px_2px_rgba(0,0,0,0.08)] transition-colors hover:bg-muted"
              onClick={() =>
                handleNavigationClick(
                  (activeTestimonial - 1 + testimonials.length) %
                    testimonials.length
                )
              }
              size="icon"
              variant="outline"
            >
              <div className="relative h-6 w-6 overflow-hidden">
                <svg
                  fill="none"
                  height="24"
                  viewBox="0 0 24 24"
                  width="24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M15 18L9 12L15 6"
                    stroke="#46413E"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  />
                </svg>
              </div>
            </Button>
            <Button
              className="h-9 w-9 overflow-hidden rounded-full border border-[rgba(0,0,0,0.15)] bg-transparent p-0 shadow-[0px_1px_2px_rgba(0,0,0,0.08)] transition-colors hover:bg-muted"
              onClick={() =>
                handleNavigationClick(
                  (activeTestimonial + 1) % testimonials.length
                )
              }
              size="icon"
              variant="outline"
            >
              <div className="relative h-6 w-6 overflow-hidden">
                <svg
                  fill="none"
                  height="24"
                  viewBox="0 0 24 24"
                  width="24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9 18L15 12L9 6"
                    stroke="#46413E"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  />
                </svg>
              </div>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
