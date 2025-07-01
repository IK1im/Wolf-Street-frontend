interface AuthFormHeaderProps {
  title: string;
  subtitle: string;
}

export default function AuthFormHeader({
  title,
  subtitle,
}: AuthFormHeaderProps) {
  return (
    <div className="px-8 py-6">
      <h2 className="text-2xl font-bold text-center text-custom-accent">
        {title}
      </h2>
      <p className="text-center mt-2 text-custom-primary">{subtitle}</p>
    </div>
  );
}
