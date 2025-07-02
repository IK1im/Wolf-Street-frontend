export default function CandlestickChart() {
  return (
    <div className="text-light-accent dark:text-dark-accent">
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 400 200"
        className="max-w-full max-h-full"
      >
        {/* Оси координат */}
        <line
          x1="40"
          y1="10"
          x2="40"
          y2="190"
          className="stroke-current"
          strokeWidth="2"
        />
        <line
          x1="40"
          y1="190"
          x2="380"
          y2="190"
          className="stroke-current"
          strokeWidth="2"
        />

        {/* Свечи графика */}
        <g className="fill-current stroke-current">
          {/* Первая свеча - растущая */}
          <rect x="60" y="80" width="18" height="60" strokeWidth="2" rx="3" />
          <line x1="69" y1="60" x2="69" y2="140" strokeWidth="4" />

          {/* Вторая свеча - падающая */}
          <rect
            x="100"
            y="100"
            width="18"
            height="40"
            className="fill-light-card dark:fill-dark-card stroke-current"
            strokeWidth="2"
            rx="3"
          />
          <line
            x1="109"
            y1="90"
            x2="109"
            y2="140"
            className="stroke-light-card dark:stroke-dark-card"
            strokeWidth="4"
          />

          {/* Третья свеча - растущая */}
          <rect x="140" y="60" width="18" height="80" strokeWidth="2" rx="3" />
          <line x1="149" y1="40" x2="149" y2="140" strokeWidth="4" />

          {/* Четвертая свеча - падающая */}
          <rect
            x="180"
            y="120"
            width="18"
            height="20"
            className="fill-light-card dark:fill-dark-card stroke-current"
            strokeWidth="2"
            rx="3"
          />
          <line
            x1="189"
            y1="110"
            x2="189"
            y2="140"
            className="stroke-light-card dark:stroke-dark-card"
            strokeWidth="4"
          />

          {/* Пятая свеча - растущая */}
          <rect x="220" y="90" width="18" height="50" strokeWidth="2" rx="3" />
          <line x1="229" y1="70" x2="229" y2="140" strokeWidth="4" />
        </g>
      </svg>
    </div>
  );
}
