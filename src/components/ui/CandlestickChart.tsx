import type { Palette } from "../../context/ThemeContext";

interface CandlestickChartProps {
  palette: Palette;
}

export default function CandlestickChart({ palette }: CandlestickChartProps) {
  const stroke = palette.accent;
  const fill = palette.card;

  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 400 200"
      className="max-w-full max-h-full"
    >
      <line x1="40" y1="10" x2="40" y2="190" stroke={stroke} strokeWidth="2" />
      <line
        x1="40"
        y1="190"
        x2="380"
        y2="190"
        stroke={stroke}
        strokeWidth="2"
      />
      <rect
        x="60"
        y="80"
        width="18"
        height="60"
        fill={stroke}
        stroke={stroke}
        strokeWidth="2"
        rx="3"
      />
      <line x1="69" y1="60" x2="69" y2="140" stroke={stroke} strokeWidth="4" />
      <rect
        x="100"
        y="100"
        width="18"
        height="40"
        fill={fill}
        stroke={stroke}
        strokeWidth="2"
        rx="3"
      />
      <line x1="109" y1="90" x2="109" y2="140" stroke={fill} strokeWidth="4" />
      <rect
        x="140"
        y="60"
        width="18"
        height="80"
        fill={stroke}
        stroke={stroke}
        strokeWidth="2"
        rx="3"
      />
      <line
        x1="149"
        y1="40"
        x2="149"
        y2="140"
        stroke={stroke}
        strokeWidth="4"
      />
      <rect
        x="180"
        y="120"
        width="18"
        height="20"
        fill={fill}
        stroke={stroke}
        strokeWidth="2"
        rx="3"
      />
      <line x1="189" y1="110" x2="189" y2="140" stroke={fill} strokeWidth="4" />
      <rect
        x="220"
        y="90"
        width="18"
        height="50"
        fill={stroke}
        stroke={stroke}
        strokeWidth="2"
        rx="3"
      />
      <line
        x1="229"
        y1="70"
        x2="229"
        y2="140"
        stroke={stroke}
        strokeWidth="4"
      />
    </svg>
  );
}
