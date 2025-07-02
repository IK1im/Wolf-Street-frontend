import AccordionItem from "../../../components/ui/AccordionItem";
import SectionContainer from "../../../components/ui/SectionContainer";

export default function FAQSection() {
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
    <SectionContainer id="faq" maxWidth={700}>
      <h2 className="text-4xl font-extrabold text-light-accent dark:text-dark-accent mb-10 text-center tracking-wide">
        FAQ
      </h2>
      <div className="flex flex-col gap-8">
        {faqItems.map((item, idx) => (
          <AccordionItem key={idx} title={item.question} text={item.answer} />
        ))}
      </div>
    </SectionContainer>
  );
}
