import { useTheme } from "../../context/ThemeContext";

interface LoadingButtonProps {
  isLoading: boolean;
  loadingText: string;
  children: React.ReactNode;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  className?: string;
  onClick?: () => void;
}

export default function LoadingButton({
  isLoading,
  loadingText,
  children,
  type = "button",
  disabled = false,
  className = "",
  onClick,
}: LoadingButtonProps) {
  const { palette } = useTheme();

  return (
    <button
      type={type}
      disabled={isLoading || disabled}
      onClick={onClick}
      className={`w-full py-3 px-4 rounded-lg font-medium focus:outline-none transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center ${className}`}
      style={{
        backgroundColor: palette.accent,
        color: palette.bg,
        boxShadow: `0 0 0 2px ${palette.accent}33`,
      }}
      onMouseEnter={(e) => {
        if (!isLoading && !disabled) {
          e.currentTarget.style.backgroundColor = palette.brown;
          e.currentTarget.style.transform = "scale(1.02)";
        }
      }}
      onMouseLeave={(e) => {
        if (!isLoading && !disabled) {
          e.currentTarget.style.backgroundColor = palette.accent;
          e.currentTarget.style.transform = "scale(1)";
        }
      }}
    >
      {isLoading ? (
        <>
          <div
            className="animate-spin rounded-full h-5 w-5 border-b-2 mr-2"
            style={{ borderColor: palette.bg }}
          ></div>
          {loadingText}
        </>
      ) : (
        children
      )}
    </button>
  );
}
