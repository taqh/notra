"use client";

import { Button } from "@notra/ui/components/ui/button";
import { Card } from "@notra/ui/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@notra/ui/components/ui/tabs";
import { useState } from "react";
export default function PricingSection() {
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "annually">(
    "annually"
  );

  const pricing = {
    starter: {
      monthly: 0,
      annually: 0,
    },
    professional: {
      monthly: 20,
      annually: 16,
    },
    enterprise: {
      monthly: 200,
      annually: 160,
    },
  };

  return (
    <div className="flex w-full flex-col items-center justify-center gap-2">
      <div className="flex items-center justify-center gap-6 self-stretch border-primary/12 border-b px-6 py-12 md:px-24 md:py-16">
        <div className="flex w-full max-w-[586px] flex-col items-center justify-start gap-4 overflow-hidden rounded-lg px-6 py-5 shadow-[0px_2px_4px_rgba(50,45,43,0.06)] shadow-none">
          <div className="flex flex-col justify-center self-stretch text-center font-sans font-semibold text-3xl text-foreground leading-tight tracking-tight md:text-5xl md:leading-[60px]">
            Choose the perfect plan for your business
          </div>

          <div className="self-stretch text-center font-normal font-sans text-base text-muted-foreground leading-7">
            Scale your operations with flexible pricing that grows with your
            team.
            <br />
            Start free, upgrade when you're ready.
          </div>
        </div>
      </div>

      <Tabs
        className="relative flex flex-col items-center justify-center gap-0 self-stretch px-6 py-9 md:px-16"
        onValueChange={(value) =>
          setBillingPeriod(value as "monthly" | "annually")
        }
        value={billingPeriod}
      >
        <div className="-translate-x-1/2 absolute top-[63px] left-1/2 z-0 h-0 w-full max-w-[1060px] transform border-primary/12 border-t" />

        <div className="relative z-20 flex items-center justify-center rounded-lg border border-primary/6 bg-background p-3">
          <TabsList className="relative h-auto gap-[2px] rounded-[99px] border-[0.5px] border-primary/8 bg-primary/10 p-[2px] shadow-[0px_1px_0px_white]">
            <div
              className={`absolute top-[2px] h-[calc(100%-4px)] w-[calc(50%-1px)] rounded-[99px] bg-white shadow-[0px_2px_4px_rgba(0,0,0,0.08)] transition-all duration-300 ease-in-out ${
                billingPeriod === "annually" ? "left-[2px]" : "right-[2px]"
              }`}
            />

            <TabsTrigger
              className="relative z-10 h-auto cursor-pointer rounded-[99px] border-transparent bg-transparent px-4 py-1 shadow-none transition-colors duration-300 hover:bg-transparent data-active:border-transparent data-active:bg-transparent data-active:shadow-none"
              value="annually"
            >
              <span
                className={`font-medium font-sans text-[13px] leading-5 transition-colors duration-300 ${
                  billingPeriod === "annually"
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
              >
                Annually
              </span>
            </TabsTrigger>

            <TabsTrigger
              className="relative z-10 h-auto cursor-pointer rounded-[99px] border-transparent bg-transparent px-4 py-1 shadow-none transition-colors duration-300 hover:bg-transparent data-active:border-transparent data-active:bg-transparent data-active:shadow-none"
              value="monthly"
            >
              <span
                className={`font-medium font-sans text-[13px] leading-5 transition-colors duration-300 ${
                  billingPeriod === "monthly"
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
              >
                Monthly
              </span>
            </TabsTrigger>
          </TabsList>

          <div className="absolute top-[5.25px] left-[5px] h-[3px] w-[3px] rounded-[99px] bg-primary/10 shadow-[0px_0px_0.5px_rgba(0,0,0,0.12)]" />
          <div className="absolute top-[5.25px] right-[5px] h-[3px] w-[3px] rounded-[99px] bg-primary/10 shadow-[0px_0px_0.5px_rgba(0,0,0,0.12)]" />
          <div className="absolute bottom-[5.25px] left-[5px] h-[3px] w-[3px] rounded-[99px] bg-primary/10 shadow-[0px_0px_0.5px_rgba(0,0,0,0.12)]" />
          <div className="absolute right-[5px] bottom-[5.25px] h-[3px] w-[3px] rounded-[99px] bg-primary/10 shadow-[0px_0px_0.5px_rgba(0,0,0,0.12)]" />
        </div>
      </Tabs>

      <div className="flex items-center justify-center self-stretch border-primary/12 border-t border-b">
        <div className="flex w-full items-start justify-center">
          <div className="relative hidden w-12 self-stretch overflow-hidden md:block">
            <div className="absolute top-[-120px] left-[-58px] flex w-[162px] flex-col items-start justify-start">
              {Array.from({ length: 200 }).map((_, i) => (
                <div
                  className="h-4 origin-top-left rotate-[-45deg] self-stretch outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] outline-offset-[-0.25px]"
                  key={i}
                />
              ))}
            </div>
          </div>

          <div className="flex flex-1 flex-col items-center justify-center gap-6 py-12 md:flex-row md:py-0">
            <Card className="flex max-w-full flex-1 flex-col items-start justify-start gap-12 self-stretch overflow-hidden rounded-none border border-border border-primary/12 bg-[rgba(255,255,255,0)] px-6 py-5 ring-0 md:max-w-none">
              <div className="flex flex-col items-center justify-start gap-9 self-stretch">
                <div className="flex flex-col items-start justify-start gap-2 self-stretch">
                  <div className="font-medium font-sans text-lg text-primary/90 leading-7">
                    Starter
                  </div>
                  <div className="w-full max-w-[242px] font-normal font-sans text-foreground/70 text-sm leading-5">
                    Perfect for individuals and small teams getting started.
                  </div>
                </div>

                <div className="flex flex-col items-start justify-start gap-2 self-stretch">
                  <div className="flex flex-col items-start justify-start gap-1">
                    <div className="relative flex h-[60px] items-center font-medium font-serif text-5xl text-primary leading-[60px]">
                      <span className="invisible">
                        ${pricing.starter[billingPeriod]}
                      </span>
                      <span
                        aria-hidden={billingPeriod !== "annually"}
                        className="absolute inset-0 flex items-center transition-all duration-500"
                        style={{
                          opacity: billingPeriod === "annually" ? 1 : 0,
                          transform: `scale(${billingPeriod === "annually" ? 1 : 0.8})`,
                          filter: `blur(${billingPeriod === "annually" ? 0 : 4}px)`,
                        }}
                      >
                        ${pricing.starter.annually}
                      </span>
                      <span
                        aria-hidden={billingPeriod !== "monthly"}
                        className="absolute inset-0 flex items-center transition-all duration-500"
                        style={{
                          opacity: billingPeriod === "monthly" ? 1 : 0,
                          transform: `scale(${billingPeriod === "monthly" ? 1 : 0.8})`,
                          filter: `blur(${billingPeriod === "monthly" ? 0 : 4}px)`,
                        }}
                      >
                        ${pricing.starter.monthly}
                      </span>
                    </div>
                    <div className="font-medium font-sans text-muted-foreground text-sm">
                      per {billingPeriod === "monthly" ? "month" : "year"}, per
                      user.
                    </div>
                  </div>
                </div>

                <Button className="w-full border-transparent bg-primary px-4 py-[10px] shadow-[0px_2px_4px_rgba(55,50,47,0.12)] hover:bg-primary-hover">
                  <span className="flex max-w-[108px] flex-col justify-center font-medium font-sans text-[13px] text-primary-foreground leading-5">
                    Start for free
                  </span>
                </Button>
              </div>

              <div className="flex flex-col items-start justify-start gap-2 self-stretch">
                {[
                  "Up to 3 projects",
                  "Basic documentation tools",
                  "Community support",
                  "Standard templates",
                  "Basic analytics",
                ].map((feature, index) => (
                  <div
                    className="flex items-center justify-start gap-[13px] self-stretch"
                    key={index}
                  >
                    <div className="relative flex h-4 w-4 items-center justify-center">
                      <svg
                        fill="none"
                        height="12"
                        viewBox="0 0 12 12"
                        width="12"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M10 3L4.5 8.5L2 6"
                          stroke="#9CA3AF"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.5"
                        />
                      </svg>
                    </div>
                    <div className="flex-1 font-normal font-sans text-[12.5px] text-primary/80 leading-5">
                      {feature}
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="flex max-w-full flex-1 flex-col items-start justify-start gap-12 self-stretch overflow-hidden rounded-none border border-primary/12 bg-primary px-6 py-5 ring-0 md:max-w-none">
              <div className="flex flex-col items-center justify-start gap-9 self-stretch">
                <div className="flex flex-col items-start justify-start gap-2 self-stretch">
                  <div className="font-medium font-sans text-lg text-primary-foreground leading-7">
                    Professional
                  </div>
                  <div className="w-full max-w-[242px] font-normal font-sans text-primary-foreground/70 text-sm leading-5">
                    Advanced features for growing teams and businesses.
                  </div>
                </div>

                <div className="flex flex-col items-start justify-start gap-2 self-stretch">
                  <div className="flex flex-col items-start justify-start gap-1">
                    <div className="relative flex h-[60px] items-center font-medium font-serif text-5xl text-primary-foreground/95 leading-[60px]">
                      <span className="invisible">
                        ${pricing.professional[billingPeriod]}
                      </span>
                      <span
                        aria-hidden={billingPeriod !== "annually"}
                        className="absolute inset-0 flex items-center transition-all duration-500"
                        style={{
                          opacity: billingPeriod === "annually" ? 1 : 0,
                          transform: `scale(${billingPeriod === "annually" ? 1 : 0.8})`,
                          filter: `blur(${billingPeriod === "annually" ? 0 : 4}px)`,
                        }}
                      >
                        ${pricing.professional.annually}
                      </span>
                      <span
                        aria-hidden={billingPeriod !== "monthly"}
                        className="absolute inset-0 flex items-center transition-all duration-500"
                        style={{
                          opacity: billingPeriod === "monthly" ? 1 : 0,
                          transform: `scale(${billingPeriod === "monthly" ? 1 : 0.8})`,
                          filter: `blur(${billingPeriod === "monthly" ? 0 : 4}px)`,
                        }}
                      >
                        ${pricing.professional.monthly}
                      </span>
                    </div>
                    <div className="font-medium font-sans text-primary-foreground/80 text-sm">
                      per {billingPeriod === "monthly" ? "month" : "year"}, per
                      user.
                    </div>
                  </div>
                </div>

                <Button className="w-full border-transparent bg-primary-foreground px-4 py-[10px] text-primary shadow-[0px_2px_4px_rgba(55,50,47,0.12)] hover:bg-muted">
                  <span className="flex max-w-[108px] flex-col justify-center font-medium font-sans text-[13px] text-primary leading-5">
                    Get started
                  </span>
                </Button>
              </div>

              <div className="flex flex-col items-start justify-start gap-2 self-stretch">
                {[
                  "Unlimited projects",
                  "Advanced documentation tools",
                  "Priority support",
                  "Custom templates",
                  "Advanced analytics",
                  "Team collaboration",
                  "API access",
                  "Custom integrations",
                ].map((feature, index) => (
                  <div
                    className="flex items-center justify-start gap-[13px] self-stretch"
                    key={index}
                  >
                    <div className="relative flex h-4 w-4 items-center justify-center">
                      <svg
                        fill="none"
                        height="12"
                        viewBox="0 0 12 12"
                        width="12"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M10 3L4.5 8.5L2 6"
                          stroke="#FF8000"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.5"
                        />
                      </svg>
                    </div>
                    <div className="flex-1 font-normal font-sans text-[12.5px] text-primary-foreground/95 leading-5">
                      {feature}
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="flex max-w-full flex-1 flex-col items-start justify-start gap-12 self-stretch overflow-hidden rounded-none border border-border bg-card px-6 py-5 ring-0 md:max-w-none">
              <div className="flex flex-col items-center justify-start gap-9 self-stretch">
                <div className="flex flex-col items-start justify-start gap-2 self-stretch">
                  <div className="font-medium font-sans text-lg text-primary/90 leading-7">
                    Enterprise
                  </div>
                  <div className="w-full max-w-[242px] font-normal font-sans text-foreground/70 text-sm leading-5">
                    Complete solution for large organizations and enterprises.
                  </div>
                </div>

                <div className="flex flex-col items-start justify-start gap-2 self-stretch">
                  <div className="flex flex-col items-start justify-start gap-1">
                    <div className="relative flex h-[60px] items-center font-medium font-serif text-5xl text-primary leading-[60px]">
                      <span className="invisible">
                        ${pricing.enterprise[billingPeriod]}
                      </span>
                      <span
                        aria-hidden={billingPeriod !== "annually"}
                        className="absolute inset-0 flex items-center transition-all duration-500"
                        style={{
                          opacity: billingPeriod === "annually" ? 1 : 0,
                          transform: `scale(${billingPeriod === "annually" ? 1 : 0.8})`,
                          filter: `blur(${billingPeriod === "annually" ? 0 : 4}px)`,
                        }}
                      >
                        ${pricing.enterprise.annually}
                      </span>
                      <span
                        aria-hidden={billingPeriod !== "monthly"}
                        className="absolute inset-0 flex items-center transition-all duration-500"
                        style={{
                          opacity: billingPeriod === "monthly" ? 1 : 0,
                          transform: `scale(${billingPeriod === "monthly" ? 1 : 0.8})`,
                          filter: `blur(${billingPeriod === "monthly" ? 0 : 4}px)`,
                        }}
                      >
                        ${pricing.enterprise.monthly}
                      </span>
                    </div>
                    <div className="font-medium font-sans text-muted-foreground text-sm">
                      per {billingPeriod === "monthly" ? "month" : "year"}, per
                      user.
                    </div>
                  </div>
                </div>

                <Button className="w-full border-transparent bg-primary px-4 py-[10px] shadow-[0px_2px_4px_rgba(55,50,47,0.12)] hover:bg-primary-hover">
                  <span className="flex max-w-[108px] flex-col justify-center font-medium font-sans text-[13px] text-primary-foreground leading-5">
                    Contact sales
                  </span>
                </Button>
              </div>

              <div className="flex flex-col items-start justify-start gap-2 self-stretch">
                {[
                  "Everything in Professional",
                  "Dedicated account manager",
                  "24/7 phone support",
                  "Custom onboarding",
                  "Advanced security features",
                  "SSO integration",
                  "Custom contracts",
                  "White-label options",
                ].map((feature, index) => (
                  <div
                    className="flex items-center justify-start gap-[13px] self-stretch"
                    key={index}
                  >
                    <div className="relative flex h-4 w-4 items-center justify-center">
                      <svg
                        fill="none"
                        height="12"
                        viewBox="0 0 12 12"
                        width="12"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M10 3L4.5 8.5L2 6"
                          stroke="#9CA3AF"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.5"
                        />
                      </svg>
                    </div>
                    <div className="flex-1 font-normal font-sans text-[12.5px] text-primary/80 leading-5">
                      {feature}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <div className="relative hidden w-12 self-stretch overflow-hidden md:block">
            <div className="absolute top-[-120px] left-[-58px] flex w-[162px] flex-col items-start justify-start">
              {Array.from({ length: 200 }).map((_, i) => (
                <div
                  className="h-4 origin-top-left rotate-[-45deg] self-stretch outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] outline-offset-[-0.25px]"
                  key={i}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
