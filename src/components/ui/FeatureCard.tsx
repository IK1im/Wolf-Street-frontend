interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  text: string;
}

export default function FeatureCard({ icon, title, text }: FeatureCardProps) {
  return (
    <div className="bg-light-card dark:bg-dark-card rounded-2xl shadow-xl p-6 border-2 border-light-border dark:border-dark-border flex flex-col gap-4 items-center text-center min-h-[260px] justify-start transition-all duration-300 hover:scale-105">
      <span className="mb-2">{icon}</span>
      <div className="text-lg font-bold mb-1 text-light-fg dark:text-dark-fg">
        {title}
      </div>
      <div className="text-light-fg dark:text-dark-fg text-sm leading-[1.6]">
        {text}
      </div>
    </div>
  );
}
