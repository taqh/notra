export function FeatureCard({
  title,
  description,
  isActive,
  progress,
  onClick,
}: {
  title: string;
  description: string;
  isActive: boolean;
  progress: number;
  onClick: () => void;
}) {
  return (
    <div
      className={`relative flex w-full cursor-pointer flex-col items-start justify-start gap-2 self-stretch overflow-hidden border-b px-6 py-5 last:border-b-0 md:flex-1 md:border-b-0 ${
        isActive
          ? "bg-card shadow-[0px_0px_0px_0.75px_var(--border)_inset]"
          : "border-border/80 border-r-0 border-l-0 md:border"
      }`}
      onClick={onClick}
    >
      {isActive && (
        <div className="absolute top-0 left-0 h-0.5 w-full bg-primary/8">
          <div
            className="h-full bg-primary transition-all duration-100 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      <div className="flex flex-col justify-center self-stretch font-sans font-semibold text-foreground text-sm leading-6 md:text-sm md:leading-6">
        {title}
      </div>
      <div className="self-stretch font-normal font-sans text-[13px] text-muted-foreground leading-[22px] md:text-[13px] md:leading-[22px]">
        {description}
      </div>
    </div>
  );
}
