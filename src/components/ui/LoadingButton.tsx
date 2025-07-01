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
  return (
    <button
      type={type}
      disabled={isLoading || disabled}
      onClick={onClick}
      className={`w-full py-2.5 px-4 rounded-lg font-medium focus:outline-none transition-all duration-300 ease-in-out 
        disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center
        bg-light-accent dark:bg-dark-accent 
        text-light-bg dark:text-dark-bg
        hover:bg-light-brown dark:hover:bg-dark-brown
        hover:scale-105 active:scale-95
        shadow-[0_0_0_2px_rgba(197,107,98,0.2)] dark:shadow-[0_0_0_2px_rgba(129,199,132,0.2)]
        focus:shadow-[0_0_0_4px_rgba(197,107,98,0.3)] dark:focus:shadow-[0_0_0_4px_rgba(129,199,132,0.3)]
        ${className}`}
    >
      {isLoading ? (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-light-bg dark:border-dark-bg mr-2"></div>
          {loadingText}
        </>
      ) : (
        children
      )}
    </button>
  );
}
