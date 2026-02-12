"use client";

import OrbitImages from "@notra/ui/components/OrbitImages";
import { Framer } from "@notra/ui/components/ui/svgs/framer";
import { Github } from "@notra/ui/components/ui/svgs/github";
import { Linear } from "@notra/ui/components/ui/svgs/linear";
import { Marble } from "@notra/ui/components/ui/svgs/marble";
import { Slack } from "@notra/ui/components/ui/svgs/slack";
import { Webflow } from "@notra/ui/components/ui/svgs/webflow";
import { NotraMark } from "./notra-mark";

const items = [
  <Github className="h-6 w-6" key="github" />,
  <Linear className="h-6 w-6" key="linear" />,
  <Slack className="h-6 w-6" key="slack" />,
  <img
    alt="DataBuddy"
    className="h-6 w-6"
    key="databuddy"
    src="/logos/brands/databuddy.svg"
  />,
  <Framer className="h-6 w-6" key="framer" />,
  <Marble className="h-6 w-6" key="marble" />,
  <Webflow className="h-6 w-6" key="webflow" />,
];

const centerLogo = (
  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#37322f] text-[#8E51FF] shadow-md">
    <NotraMark className="h-7 w-7 shrink-0" strokeWidth={42} />
  </div>
);

interface IntegrationOrbitProps {
  className?: string;
}

export default function IntegrationOrbit({
  className = "",
}: IntegrationOrbitProps) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="aspect-square h-full">
        <OrbitImages
          baseWidth={400}
          centerContent={centerLogo}
          direction="normal"
          duration={25}
          fill
          itemSize={36}
          items={items}
          paused={false}
          radius={150}
          responsive
          rotation={0}
          shape="circle"
        />
      </div>
    </div>
  );
}
