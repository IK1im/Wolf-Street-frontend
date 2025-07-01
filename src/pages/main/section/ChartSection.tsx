import CandlestickChart from "../../../components/ui/CandlestickChart";
import SectionContainer from "../../../components/ui/SectionContainer";

export default function ChartSection() {
  return (
    <SectionContainer id="chart">
      <h2 className="text-4xl font-extrabold text-light-accent dark:text-dark-accent mb-10 text-center tracking-wide">
        График рынка
      </h2>
      <div className="bg-light-card dark:bg-dark-card rounded-[32px] shadow-2xl p-10 flex flex-col items-center justify-center min-h-[380px]">
        <CandlestickChart />
        <span className="mt-8 text-light-fg dark:text-dark-fg text-xl font-medium opacity-80">
          Данные скоро будут поступать из ClickHouse
        </span>
      </div>
    </SectionContainer>
  );
}
