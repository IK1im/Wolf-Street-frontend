import { Link } from "react-router-dom";
import { useTheme } from "../../../context/ThemeContext";

interface RememberMeSectionProps {
  rememberMe: boolean;
  onRememberMeChange: (checked: boolean) => void;
}

export default function RememberMeSection({
  rememberMe,
  onRememberMeChange,
}: RememberMeSectionProps) {
  const { palette } = useTheme();

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        <input
          id="remember-me"
          name="remember-me"
          type="checkbox"
          checked={rememberMe}
          onChange={(e) => onRememberMeChange(e.target.checked)}
          className="h-4 w-4 rounded cursor-pointer"
          style={{
            accentColor: palette.accent,
            backgroundColor: palette.card,
            borderColor: palette.border,
          }}
        />
        <label
          htmlFor="remember-me"
          className="ml-2 block text-sm cursor-pointer"
          style={{ color: palette.fg }}
        >
          Запомнить меня
        </label>
      </div>
      <Link
        to="/forgot-password"
        className="text-sm hover:underline transition-all duration-200"
        style={{ color: palette.accent }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = palette.brown;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = palette.accent;
        }}
      >
        Забыли пароль?
      </Link>
    </div>
  );
}
