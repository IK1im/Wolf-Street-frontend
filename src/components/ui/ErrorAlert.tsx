interface ErrorAlertProps {
  error: string;
}

export default function ErrorAlert({ error }: ErrorAlertProps) {
  if (!error) return null;

  return (
    <div className="mb-6 p-4 bg-red-900/10 border border-red-500 rounded-lg transition-all duration-300 ease-in-out transform animate-pulse">
      <p className="text-red-400 text-sm">{error}</p>
    </div>
  );
}
