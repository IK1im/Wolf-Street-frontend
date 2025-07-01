import AccordionItem from "../../../components/ui/AccordionItem";
import type { Palette } from "../../../context/ThemeContext";

interface FAQSectionProps {
  palette: Palette;
  theme?: string;
}

export default function FAQSection({ palette, theme }: FAQSectionProps) {
  const faqItems = [
    {
      question: "Что такое Wolf Street?",
      answer:
        "Wolf Street — это современная платформа для управления финансами, инвестирования и аналитики рынка.",
    },
    {
      question: "Как зарегистрироваться?",
      answer:
        'Нажмите кнопку "Войти" в шапке и следуйте инструкции для создания аккаунта.',
    },
    {
      question: "Когда появятся реальные данные по рынку?",
      answer:
        "В ближайших обновлениях мы подключим ClickHouse и вы сможете видеть актуальные графики.",
    },
    {
      question: "Как связаться с поддержкой?",
      answer: "Пишите на support@wolfstreet.ru или в чат поддержки на сайте.",
    },
  ];

  return (
    <section
      id="faq"
      style={{
        maxWidth: "100vw",
        minHeight: "100vh",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: 0,
        background: palette.bg,
        color: palette.fg,
        margin: 0,
      }}
    >
      <div
        style={{
          maxWidth: 700,
          margin: "0 auto",
          width: "100%",
          padding: 48,
        }}
      >
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
          FAQ
        </h2>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 32,
          }}
        >
          {faqItems.map((item, idx) => (
            <AccordionItem
              key={idx}
              title={item.question}
              text={item.answer}
              theme={theme}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
