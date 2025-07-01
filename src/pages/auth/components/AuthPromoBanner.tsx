import { Link } from "react-router-dom";
import { useTheme } from "../../../context/ThemeContext";

interface PromoFeature {
  text: string;
}

interface AuthPromoBannerProps {
  title: string;
  subtitle: string;
  features: PromoFeature[];
  ctaText: string;
  ctaSubtext: string;
  ctaLink: string;
  ctaButtonText: string;
}

export default function AuthPromoBanner({
  title,
  subtitle,
  features,
  ctaText,
  ctaLink,
  ctaButtonText,
}: AuthPromoBannerProps) {
  const { palette } = useTheme();

  return (
    <div
      className="lg:col-span-1 p-8 flex flex-col"
      style={{ backgroundColor: palette.bg }}
    >
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <div className="text-center lg:text-left mb-8">
            <h2
              className="text-3xl font-bold mb-2"
              style={{ color: palette.accent }}
            >
              {title}
            </h2>
            <p className="mb-4" style={{ color: palette.fg }}>
              {subtitle}
            </p>
          </div>

          <div className="space-y-2 text-sm" style={{ color: palette.fg }}>
            {features.map((feature, index) => (
              <div key={index} className="flex items-center">
                <div
                  className="w-1.5 h-1.5 rounded-full mr-2 flex-shrink-0"
                  style={{ backgroundColor: palette.accent }}
                ></div>
                <span>{feature.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA секция */}
        <div className="pt-8">
          <p
            className="text-sm mb-4 text-center lg:text-left"
            style={{ color: palette.navInactive }}
          >
            {ctaText}
          </p>
          <Link
            to={ctaLink}
            className="inline-block w-full py-3 px-4 rounded-lg font-medium transition-all duration-300 ease-in-out text-center transform hover:scale-105 hover:shadow-lg"
            style={{
              backgroundColor: "transparent",
              border: `2px solid ${palette.accent}`,
              color: palette.accent,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = palette.accent;
              e.currentTarget.style.color = palette.bg;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = palette.accent;
            }}
          >
            {ctaButtonText}
          </Link>
        </div>
      </div>
    </div>
  );
}
