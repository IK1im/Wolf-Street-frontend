import CandlestickChart from "../../../components/ui/CandlestickChart";
import SectionContainer from "../../../components/ui/SectionContainer";
import type { Palette } from "../../../context/ThemeContext";

interface ChartSectionProps {
  palette: Palette;
}

export default function ChartSection({ palette }: ChartSectionProps) {
  return (
    <SectionContainer id="chart" palette={palette}>
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
        График рынка
      </h2>
      <div
        style={{
          background: palette.card,
          borderRadius: 32,
          boxShadow: `0 4px 24px ${palette.shadow}`,
          padding: 40,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: 380,
        }}
      >
        <CandlestickChart palette={palette} />
        <span
          style={{
            marginTop: 32,
            color: palette.fg,
            fontSize: 20,
            fontWeight: 500,
            opacity: 0.8,
          }}
        >
          Данные скоро будут поступать из ClickHouse
        </span>
      </div>
    </SectionContainer>
  );
}
