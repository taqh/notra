"use client";

import { Button } from "@notra/ui/components/ui/button";
import { useEffect, useRef, useState } from "react";
import CTASection from "../components/cta-section";
import DocumentationSection from "../components/documentation-section";
import EffortlessIntegration from "../components/effortless-integration-updated";
import FAQSection from "../components/faq-section";
import { FeatureCard } from "../components/feature-card";
import FooterSection from "../components/footer-section";
import NumbersThatSpeak from "../components/numbers-that-speak";
import PricingSection from "../components/pricing-section";
import SmartSimpleBrilliant from "../components/smart-simple-brilliant";
import TestimonialsSection from "../components/testimonials-section";
import YourWorkInSync from "../components/your-work-in-sync";

export default function LandingPage() {
  const [activeCard, setActiveCard] = useState(0);
  const [progress, setProgress] = useState(0);
  const mountedRef = useRef(true);

  useEffect(() => {
    const progressInterval = setInterval(() => {
      if (!mountedRef.current) {
        return;
      }

      setProgress((prev) => {
        if (prev >= 100) {
          if (mountedRef.current) {
            setActiveCard((current) => (current + 1) % 3);
          }
          return 0;
        }
        return prev + 2;
      });
    }, 100);

    return () => {
      clearInterval(progressInterval);
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const handleCardClick = (index: number) => {
    if (!mountedRef.current) return;
    setActiveCard(index);
    setProgress(0);
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-start overflow-x-hidden bg-background">
      <div className="relative flex w-full flex-col items-center justify-start">
        <div className="relative flex min-h-screen w-full max-w-none flex-col items-start justify-start px-4 sm:px-6 md:px-8 lg:w-[1060px] lg:max-w-[1060px] lg:px-0">
          <div className="absolute top-0 left-4 z-0 h-full w-px bg-primary/12 shadow-[1px_0px_0px_white] sm:left-6 md:left-8 lg:left-0" />

          <div className="absolute top-0 right-4 z-0 h-full w-px bg-primary/12 shadow-[1px_0px_0px_white] sm:right-6 md:right-8 lg:right-0" />

          <div className="relative z-10 flex flex-col items-center justify-center gap-4 self-stretch overflow-hidden border-primary/6 border-b pt-[9px] sm:gap-6 md:gap-8 lg:gap-[66px]">
            <div className="absolute top-0 left-0 z-20 flex h-12 w-full items-center justify-center px-6 sm:h-14 sm:px-8 md:h-16 md:px-12 lg:h-[84px] lg:px-0">
              <div className="absolute top-6 left-0 h-0 w-full border-primary/12 border-t shadow-[0px_1px_0px_white] sm:top-7 md:top-8 lg:top-[42px]" />

              <div className="relative z-30 flex h-10 w-full max-w-[calc(100%-32px)] items-center justify-between overflow-hidden rounded-lg bg-background px-3 py-1.5 pr-2 shadow-[0px_0px_0px_2px_white] backdrop-blur-sm sm:h-11 sm:max-w-[calc(100%-48px)] sm:px-4 sm:py-2 sm:pr-3 md:h-12 md:max-w-[calc(100%-64px)] md:px-4 lg:w-[700px] lg:max-w-[700px]">
                <div className="flex items-center justify-center">
                  <div className="flex items-center justify-start">
                    <div className="flex flex-col justify-center font-medium font-sans text-foreground text-sm leading-5 sm:text-base md:text-lg lg:text-xl">
                      Notra
                    </div>
                  </div>
                  <div className="flex flex-row items-start justify-start gap-2 pl-3 sm:flex sm:gap-3 sm:pl-4 md:gap-4 md:pl-5 lg:gap-4 lg:pl-5">
                    <div className="flex items-center justify-start">
                      <div className="flex flex-col justify-center font-medium font-sans text-foreground/80 text-xs leading-[14px] md:text-[13px]">
                        Products
                      </div>
                    </div>
                    <div className="flex items-center justify-start">
                      <div className="flex flex-col justify-center font-medium font-sans text-foreground/80 text-xs leading-[14px] md:text-[13px]">
                        Pricing
                      </div>
                    </div>
                    <div className="flex items-center justify-start">
                      <div className="flex flex-col justify-center font-medium font-sans text-foreground/80 text-xs leading-[14px] md:text-[13px]">
                        Docs
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex h-6 items-start justify-start gap-2 sm:h-7 sm:gap-3 md:h-8">
                  <Button
                    className="overflow-hidden border-transparent bg-white px-2 py-1 shadow-[0px_1px_2px_rgba(55,50,47,0.12)] hover:bg-muted sm:px-3 sm:py-[6px] md:px-[14px]"
                    variant="ghost"
                  >
                    <span className="flex flex-col justify-center font-medium font-sans text-primary text-xs leading-5 md:text-[13px]">
                      Log in
                    </span>
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex w-full flex-col items-center justify-start px-2 pt-16 pr-0 pb-8 pl-0 sm:px-4 sm:pt-20 sm:pr-0 sm:pb-12 sm:pl-0 md:px-8 md:pt-24 md:pb-16 lg:px-0 lg:pt-[216px]">
              <div className="flex w-full max-w-[937px] flex-col items-center justify-center gap-3 sm:gap-4 md:gap-5 lg:w-[937px] lg:gap-6">
                <div className="flex flex-col items-center justify-center gap-4 self-stretch rounded-[3px] sm:gap-5 md:gap-6 lg:gap-8">
                  <div className="flex w-full max-w-[748.71px] flex-col justify-center px-2 text-center font-normal font-serif text-[24px] text-foreground xs:text-[28px] leading-[1.1] sm:px-4 sm:text-[36px] sm:leading-[1.15] md:px-0 md:text-[52px] md:leading-[1.2] lg:w-[748.71px] lg:text-[80px] lg:leading-24">
                    Effortless custom contract
                    <br />
                    billing by Notra
                  </div>
                  <div className="flex w-full max-w-[506.08px] flex-col justify-center px-2 text-center font-medium font-sans text-foreground/80 text-sm leading-[1.4] sm:px-4 sm:text-lg sm:leading-[1.45] md:px-0 md:text-xl md:leading-[1.5] lg:w-[506.08px] lg:text-lg lg:leading-7">
                    Streamline your billing process with seamless automation
                    <br className="hidden sm:block" />
                    for every custom contract, tailored by Notra.
                  </div>
                </div>
              </div>

              <div className="relative z-10 mt-6 flex w-full max-w-[497px] flex-col items-center justify-center gap-6 sm:mt-8 sm:gap-8 md:mt-10 md:gap-10 lg:mt-12 lg:w-[497px] lg:gap-12">
                <div className="flex items-center justify-start gap-4 backdrop-blur-[8.25px]">
                  <Button className="h-10 overflow-hidden border-transparent bg-primary px-6 py-2 shadow-[0px_0px_0px_2.5px_rgba(255,255,255,0.08)_inset] hover:bg-primary-hover sm:h-11 sm:px-8 sm:py-[6px] md:h-12 md:px-10 lg:px-12">
                    <span className="flex flex-col justify-center font-medium font-sans text-primary-foreground text-sm leading-5 sm:text-base md:text-[15px]">
                      Start for free
                    </span>
                  </Button>
                </div>
              </div>

              <div className="-translate-x-1/2 pointer-events-none absolute top-[232px] left-1/2 z-0 transform sm:top-[248px] md:top-[264px] lg:top-[320px]">
                <img
                  alt=""
                  className="h-auto w-[936px] opacity-30 mix-blend-multiply sm:w-[1404px] sm:opacity-40 md:w-[2106px] md:opacity-50 lg:w-[2808px]"
                  src="/mask-group-pattern.svg"
                  style={{
                    filter: "hue-rotate(15deg) saturate(0.7) brightness(1.2)",
                  }}
                />
              </div>

              <div className="relative z-5 my-8 mb-0 flex w-full max-w-[960px] flex-col items-center justify-center gap-2 px-2 pt-2 pb-6 sm:my-12 sm:px-4 sm:pt-4 sm:pb-8 md:my-16 md:px-6 md:pb-10 lg:my-16 lg:w-[960px] lg:px-11 lg:pb-0">
                <div className="flex h-[200px] w-full max-w-[960px] flex-col items-start justify-start overflow-hidden rounded-[6px] bg-card shadow-[0px_0px_0px_0.9056603908538818px_rgba(0,0,0,0.08)] sm:h-[280px] sm:rounded-[8px] md:h-[450px] lg:h-[695.55px] lg:w-[960px] lg:rounded-[9.06px]">
                  <div className="flex flex-1 items-start justify-start self-stretch">
                    <div className="flex h-full w-full items-center justify-center">
                      <div className="relative h-full w-full overflow-hidden">
                        <div
                          className={`absolute inset-0 transition-all duration-500 ease-in-out ${
                            activeCard === 0
                              ? "scale-100 opacity-100 blur-0"
                              : "scale-95 opacity-0 blur-sm"
                          }`}
                        >
                          <img
                            alt="Schedules Dashboard - Customer Subscription Management"
                            className="h-full w-full object-cover"
                            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/dsadsadsa.jpg-xTHS4hGwCWp2H5bTj8np6DXZUyrxX7.jpeg"
                          />
                        </div>

                        <div
                          className={`absolute inset-0 transition-all duration-500 ease-in-out ${
                            activeCard === 1
                              ? "scale-100 opacity-100 blur-0"
                              : "scale-95 opacity-0 blur-sm"
                          }`}
                        >
                          <img
                            alt="Analytics Dashboard"
                            className="h-full w-full object-cover"
                            src="/analytics-dashboard-with-charts-graphs-and-data-vi.jpg"
                          />
                        </div>

                        <div
                          className={`absolute inset-0 transition-all duration-500 ease-in-out ${
                            activeCard === 2
                              ? "scale-100 opacity-100 blur-0"
                              : "scale-95 opacity-0 blur-sm"
                          }`}
                        >
                          <img
                            alt="Data Visualization Dashboard"
                            className="h-full w-full object-contain"
                            src="/data-visualization-dashboard-with-interactive-char.jpg"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-start justify-center self-stretch border-border border-t border-b">
                <div className="relative w-4 self-stretch overflow-hidden sm:w-6 md:w-8 lg:w-12">
                  <div className="absolute top-[-120px] left-[-40px] flex w-[120px] flex-col items-start justify-start sm:left-[-50px] sm:w-[140px] md:left-[-58px] md:w-[162px]">
                    {Array.from({ length: 50 }).map((_, i) => (
                      <div
                        className="h-3 origin-top-left rotate-[-45deg] self-stretch outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] outline-offset-[-0.25px] sm:h-4"
                        key={i}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex flex-1 flex-col items-stretch justify-center gap-0 px-0 sm:px-2 md:flex-row md:px-0">
                  <FeatureCard
                    description="Streamline customer subscriptions and billing with automated scheduling tools."
                    isActive={activeCard === 0}
                    onClick={() => handleCardClick(0)}
                    progress={activeCard === 0 ? progress : 0}
                    title="Plan your schedules"
                  />
                  <FeatureCard
                    description="Transform your business data into actionable insights with real-time analytics."
                    isActive={activeCard === 1}
                    onClick={() => handleCardClick(1)}
                    progress={activeCard === 1 ? progress : 0}
                    title="Analytics & insights"
                  />
                  <FeatureCard
                    description="Keep your team aligned with shared dashboards and collaborative workflows."
                    isActive={activeCard === 2}
                    onClick={() => handleCardClick(2)}
                    progress={activeCard === 2 ? progress : 0}
                    title="Collaborate seamlessly"
                  />
                </div>

                <div className="relative w-4 self-stretch overflow-hidden sm:w-6 md:w-8 lg:w-12">
                  <div className="absolute top-[-120px] left-[-40px] flex w-[120px] flex-col items-start justify-start sm:left-[-50px] sm:w-[140px] md:left-[-58px] md:w-[162px]">
                    {Array.from({ length: 50 }).map((_, i) => (
                      <div
                        className="h-3 origin-top-left rotate-[-45deg] self-stretch outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] outline-offset-[-0.25px] sm:h-4"
                        key={i}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex w-full flex-col items-center justify-center border-primary/12 border-b">
                <div className="flex items-center justify-center gap-6 self-stretch border-primary/12 border-b px-4 py-8 sm:px-6 sm:py-12 md:px-24 md:py-16">
                  <div className="flex w-full max-w-[586px] flex-col items-center justify-start gap-3 overflow-hidden rounded-lg px-4 py-4 shadow-[0px_2px_4px_rgba(50,45,43,0.06)] shadow-none sm:gap-4 sm:px-6 sm:py-5">
                    <div className="flex w-full max-w-[472.55px] flex-col justify-center text-center font-sans font-semibold text-foreground text-xl leading-tight tracking-tight sm:text-2xl md:text-3xl md:leading-[60px] lg:text-5xl">
                      Confidence backed by results
                    </div>
                    <div className="self-stretch text-center font-normal font-sans text-muted-foreground text-sm leading-6 sm:text-base sm:leading-7">
                      Our customers achieve more each day
                      <br className="hidden sm:block" />
                      because their tools are simple, powerful, and clear.
                    </div>
                  </div>
                </div>

                <div className="flex items-start justify-center self-stretch border-primary/12 border-t border-b-0">
                  <div className="relative w-4 self-stretch overflow-hidden sm:w-6 md:w-8 lg:w-12">
                    <div className="absolute top-[-120px] left-[-40px] flex w-[120px] flex-col items-start justify-start sm:left-[-50px] sm:w-[140px] md:left-[-58px] md:w-[162px]">
                      {Array.from({ length: 50 }).map((_, i) => (
                        <div
                          className="h-3 origin-top-left rotate-[-45deg] self-stretch outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] outline-offset-[-0.25px] sm:h-4"
                          key={i}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="grid flex-1 grid-cols-2 gap-0 border-primary/12 border-r border-l sm:grid-cols-4 md:grid-cols-4">
                    {Array.from({ length: 8 }).map((_, index) => {
                      const isMobileFirstColumn = index % 2 === 0;
                      const isDesktopFirstColumn = index % 4 === 0;
                      const isDesktopLastColumn = index % 4 === 3;
                      const isDesktopTopRow = index < 4;
                      const isDesktopBottomRow = index >= 4;

                      return (
                        <div
                          className={`flex h-24 xs:h-28 items-center justify-center gap-1 xs:gap-2 border-[rgba(227,226,225,0.5)] border-b sm:h-32 sm:gap-3 md:h-36 lg:h-40 ${index < 6 ? "sm:border-b-[0.5px]" : "sm:border-b"}
                            ${index >= 6 ? "border-b" : ""}
                            ${isMobileFirstColumn ? "border-r-[0.5px]" : ""}sm:border-r-[0.5px] sm:border-l-0 ${isDesktopFirstColumn ? "md:border-l" : "md:border-l-[0.5px]"}
                            ${isDesktopLastColumn ? "md:border-r" : "md:border-r-[0.5px]"}
                            ${isDesktopTopRow ? "md:border-b-[0.5px]" : ""}
                            ${isDesktopBottomRow ? "md:border-t-[0.5px] md:border-b" : ""}border-border`}
                          key={index}
                        >
                          <div className="relative h-6 xs:h-7 w-6 xs:w-7 overflow-hidden rounded-full shadow-[0px_-4px_8px_rgba(255,255,255,0.64)_inset] sm:h-8 sm:w-8 md:h-9 md:w-9 lg:h-10 lg:w-10">
                            <img
                              alt="Horizon"
                              className="h-full w-full object-contain"
                              src="/horizon-icon.svg"
                            />
                          </div>
                          <div className="flex flex-col justify-center text-center font-medium font-sans text-primary text-sm xs:text-base leading-tight sm:text-lg md:text-xl md:leading-9 lg:text-2xl">
                            Acute
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="relative w-4 self-stretch overflow-hidden sm:w-6 md:w-8 lg:w-12">
                    <div className="absolute top-[-120px] left-[-40px] flex w-[120px] flex-col items-start justify-start sm:left-[-50px] sm:w-[140px] md:left-[-58px] md:w-[162px]">
                      {Array.from({ length: 50 }).map((_, i) => (
                        <div
                          className="h-3 origin-top-left rotate-[-45deg] self-stretch outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] outline-offset-[-0.25px] sm:h-4"
                          key={i}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex w-full flex-col items-center justify-center border-primary/12 border-b">
                <div className="flex items-center justify-center gap-6 self-stretch border-primary/12 border-b px-4 py-8 sm:px-6 sm:py-12 md:px-8 md:py-16 lg:w-[1060px] lg:max-w-[1060px] lg:px-0">
                  <div className="flex w-full max-w-[616px] flex-col items-center justify-start gap-3 overflow-hidden rounded-lg px-4 py-4 shadow-[0px_2px_4px_rgba(50,45,43,0.06)] shadow-none sm:gap-4 sm:px-6 sm:py-5 lg:w-[616px]">
                    <div className="flex w-full max-w-[598.06px] flex-col justify-center text-center font-sans font-semibold text-foreground text-xl leading-tight tracking-tight sm:text-2xl md:text-3xl md:leading-[60px] lg:w-[598.06px] lg:text-5xl">
                      Built for absolute clarity and focused work
                    </div>
                    <div className="self-stretch text-center font-normal font-sans text-muted-foreground text-sm leading-6 sm:text-base sm:leading-7">
                      Stay focused with tools that organize, connect
                      <br />
                      and turn information into confident decisions.
                    </div>
                  </div>
                </div>

                <div className="flex items-start justify-center self-stretch">
                  <div className="relative w-4 self-stretch overflow-hidden sm:w-6 md:w-8 lg:w-12">
                    <div className="absolute top-[-120px] left-[-40px] flex w-[120px] flex-col items-start justify-start sm:left-[-50px] sm:w-[140px] md:left-[-58px] md:w-[162px]">
                      {Array.from({ length: 200 }).map((_, i) => (
                        <div
                          className="h-3 origin-top-left rotate-[-45deg] self-stretch outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] outline-offset-[-0.25px] sm:h-4"
                          key={i}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="grid flex-1 grid-cols-1 gap-0 border-primary/12 border-r border-l md:grid-cols-2">
                    <div className="flex flex-col items-start justify-start gap-4 border-primary/12 border-r-0 border-b p-4 sm:gap-6 sm:p-6 md:border-r md:p-8 lg:p-12">
                      <div className="flex flex-col gap-2">
                        <h3 className="font-sans font-semibold text-lg text-primary leading-tight sm:text-xl">
                          Smart. Simple. Brilliant.
                        </h3>
                        <p className="font-normal font-sans text-muted-foreground text-sm leading-relaxed md:text-base">
                          Your data is beautifully organized so you see
                          everything clearly without the clutter.
                        </p>
                      </div>
                      <div className="flex h-[200px] w-full items-center justify-center overflow-hidden rounded-lg sm:h-[250px] md:h-[300px]">
                        <SmartSimpleBrilliant
                          className="scale-50 sm:scale-65 md:scale-75 lg:scale-90"
                          height="100%"
                          theme="light"
                          width="100%"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col items-start justify-start gap-4 border-primary/12 border-b p-4 sm:gap-6 sm:p-6 md:p-8 lg:p-12">
                      <div className="flex flex-col gap-2">
                        <h3 className="font-sans font-semibold text-lg text-primary leading-tight sm:text-xl">
                          Your work, in sync
                        </h3>
                        <p className="font-normal font-sans text-muted-foreground text-sm leading-relaxed md:text-base">
                          Every update flows instantly across your team and
                          keeps collaboration effortless and fast.
                        </p>
                      </div>
                      <div className="flex h-[200px] w-full items-center justify-center overflow-hidden rounded-lg text-right sm:h-[250px] md:h-[300px]">
                        <YourWorkInSync
                          className="scale-60 sm:scale-75 md:scale-90"
                          height="250"
                          theme="light"
                          width="400"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col items-start justify-start gap-4 border-primary/12 border-r-0 bg-transparent p-4 sm:gap-6 sm:p-6 md:border-r md:p-8 lg:p-12">
                      <div className="flex flex-col gap-2">
                        <h3 className="font-sans font-semibold text-lg text-primary leading-tight sm:text-xl">
                          Effortless integration
                        </h3>
                        <p className="font-normal font-sans text-muted-foreground text-sm leading-relaxed md:text-base">
                          All your favorite tools connect in one place and work
                          together seamlessly by design.
                        </p>
                      </div>
                      <div className="relative flex h-[200px] w-full items-center justify-center overflow-hidden rounded-lg bg-transparent sm:h-[250px] md:h-[300px]">
                        <div className="flex h-full w-full items-center justify-center bg-transparent">
                          <EffortlessIntegration
                            className="max-h-full max-w-full"
                            height={250}
                            width={400}
                          />
                        </div>
                        <div className="pointer-events-none absolute right-0 bottom-0 left-0 h-8 bg-gradient-to-t from-background to-transparent" />
                      </div>
                    </div>

                    <div className="flex flex-col items-start justify-start gap-4 p-4 sm:gap-6 sm:p-6 md:p-8 lg:p-12">
                      <div className="flex flex-col gap-2">
                        <h3 className="font-sans font-semibold text-lg text-primary leading-tight sm:text-xl">
                          Numbers that speak
                        </h3>
                        <p className="font-normal font-sans text-muted-foreground text-sm leading-relaxed md:text-base">
                          Track growth with precision and turn raw data into
                          confident decisions you can trust.
                        </p>
                      </div>
                      <div className="relative flex h-[200px] w-full items-center justify-center overflow-hidden rounded-lg sm:h-[250px] md:h-[300px]">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <NumbersThatSpeak
                            className="h-full w-full object-contain"
                            height="100%"
                            theme="light"
                            width="100%"
                          />
                        </div>
                        <div className="pointer-events-none absolute right-0 bottom-0 left-0 h-8 bg-gradient-to-t from-background to-transparent" />
                        <div className="absolute inset-0 flex hidden items-center justify-center opacity-20">
                          <div className="flex flex-col items-center gap-2 p-4">
                            <div className="h-full w-3/4 rounded-full bg-green-500" />
                          </div>
                          <div className="text-green-600 text-sm">
                            Growth Rate
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="relative w-4 self-stretch overflow-hidden sm:w-6 md:w-8 lg:w-12">
                    <div className="absolute top-[-120px] left-[-40px] flex w-[120px] flex-col items-start justify-start sm:left-[-50px] sm:w-[140px] md:left-[-58px] md:w-[162px]">
                      {Array.from({ length: 200 }).map((_, i) => (
                        <div
                          className="h-3 origin-top-left rotate-[-45deg] self-stretch outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] outline-offset-[-0.25px] sm:h-4"
                          key={i}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <DocumentationSection />

              <TestimonialsSection />

              <PricingSection />

              <FAQSection />

              <CTASection />

              <FooterSection />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
