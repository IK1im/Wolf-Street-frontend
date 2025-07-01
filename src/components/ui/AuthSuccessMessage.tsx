interface AuthSuccessMessageProps {
  title: string;
  message: string;
}

export default function AuthSuccessMessage({
  title,
  message,
}: AuthSuccessMessageProps) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-custom-primary">
      <div className="max-w-md w-full rounded-2xl shadow-2xl p-8 text-center border-2 border-custom-accent bg-custom-secondary">
        <div className="mb-6">
          <div className="mx-auto w-16 h-16 bg-custom-accent rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-custom-secondary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
          </div>
        </div>
        <h2 className="text-2xl font-bold text-custom-primary mb-4">{title}</h2>
        <p className="text-custom-secondary mb-6">{message}</p>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-custom-accent mx-auto"></div>
      </div>
    </div>
  );
}
