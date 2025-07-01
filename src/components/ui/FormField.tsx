import { useTheme } from "../../context/ThemeContext";

interface FormFieldProps {
  label: string;
  name: string;
  type: string;
  value: string | undefined;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  required?: boolean;
  error?: string;
  className?: string;
}

export default function FormField({
  label,
  name,
  type,
  value,
  onChange,
  placeholder,
  required = false,
  error,
  className = "",
}: FormFieldProps) {
  const { palette } = useTheme();

  return (
    <div className={className}>
      <label
        htmlFor={name}
        className="block text-sm font-medium mb-1"
        style={{ color: palette.fg }}
      >
        {label} {required && "*"}
      </label>
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full px-4 py-3 rounded-lg focus:outline-none transition-all duration-300 ease-in-out placeholder-gray-400"
        style={{
          backgroundColor: palette.card,
          border: error ? "2px solid #ef4444" : `2px solid ${palette.border}`,
          color: palette.fg,
          ...(error && { backgroundColor: "#7f1d1d20" }),
        }}
        onFocus={(e) => {
          if (!error) {
            e.target.style.borderColor = palette.accent;
            e.target.style.boxShadow = `0 0 0 3px ${palette.accent}33`;
          }
        }}
        onBlur={(e) => {
          if (!error) {
            e.target.style.borderColor = palette.border;
            e.target.style.boxShadow = "none";
          }
        }}
        placeholder={placeholder}
      />
      {error && (
        <p className="mt-1 text-sm text-red-400 transition-all duration-300 ease-in-out transform translate-y-0 opacity-100">
          {error}
        </p>
      )}
    </div>
  );
}
