import FeatureCard from "../../../components/ui/FeatureCard";
import SectionContainer from "../../../components/ui/SectionContainer";
import type { Palette } from "../../../context/ThemeContext";

interface AboutSectionProps {
  palette: Palette;
}

export default function AboutSection({ palette }: AboutSectionProps) {
  const features = [
    {
      icon: (
        <svg width="48" height="48" fill="none" viewBox="0 0 32 32">
          <circle
            cx="16"
            cy="16"
            r="15"
            stroke={palette.accent}
            strokeWidth="2"
          />
          <path
            d="M10 16l4 4 8-8"
            stroke={palette.accent}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      title: "Гарантия безопасности",
      text: "Ваши активы под защитой: многоуровневое шифрование, резервные копии и круглосуточный мониторинг. Мы — ваш цифровой сейф.",
    },
    {
      icon: (
        <svg width="48" height="48" fill="none" viewBox="0 0 32 32">
          <rect
            x="4"
            y="8"
            width="24"
            height="16"
            rx="4"
            stroke={palette.accent}
            strokeWidth="2"
          />
          <path
            d="M8 16h16M16 12v8"
            stroke={palette.accent}
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      ),
      title: "Технологии будущего",
      text: "Интеллектуальные алгоритмы, автоматизация сделок и интеграция с топовыми банками. Всё для вашего роста и удобства.",
    },
    {
      icon: (
        <svg width="48" height="48" fill="none" viewBox="0 0 32 32">
          <path
            d="M16 4l4 8 8 1-6 6 2 9-8-4-8 4 2-9-6-6 8-1 4-8z"
            stroke={palette.accent}
            strokeWidth="2"
            fill={palette.card}
          />
        </svg>
      ),
      title: "Премиальный стиль",
      text: "Дизайн, который вдохновляет: минимализм, скорость, внимание к деталям. Управляйте капиталом с удовольствием.",
    },
    {
      icon: (
        <svg width="48" height="48" fill="none" viewBox="0 0 32 32">
          <circle
            cx="16"
            cy="16"
            r="14"
            stroke={palette.accent}
            strokeWidth="2"
          />
          <path
            d="M10 22v-2a4 4 0 014-4h4a4 4 0 014 4v2"
            stroke={palette.accent}
            strokeWidth="2"
          />
          <circle
            cx="16"
            cy="13"
            r="3"
            stroke={palette.accent}
            strokeWidth="2"
          />
        </svg>
      ),
      title: "Живое сообщество",
      text: "Wolf Street — это не только сервис, но и люди. Форумы, поддержка 24/7, обмен опытом и совместные инвестиции.",
    },
  ];

  return (
    <SectionContainer id="about" palette={palette}>
      <h2
        style={{
          fontSize: 36,
          fontWeight: 800,
          color: palette.accent,
          marginBottom: 40,
          textAlign: "center",
          letterSpacing: 1,
        }}
      >
        О проекте
      </h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: 32,
        }}
      >
        {features.map((feature, idx) => (
          <FeatureCard
            key={idx}
            icon={feature.icon}
            title={feature.title}
            text={feature.text}
            palette={palette}
          />
        ))}
      </div>
    </SectionContainer>
  );
}
