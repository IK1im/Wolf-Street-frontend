import { Link } from "react-router-dom";

interface AuthFormFooterProps {
  text: string;
  linkText: string;
  linkTo: string;
}

export default function AuthFormFooter({
  text,
  linkText,
  linkTo,
}: AuthFormFooterProps) {
  return (
    <div className="mt-6 text-center">
      <p className="text-sm text-custom-secondary">
        {text}{" "}
        <Link
          to={linkTo}
          className="font-medium text-custom-accent hover-text-accent-dark transition-colors duration-300 ease-in-out"
        >
          {linkText}
        </Link>
      </p>
    </div>
  );
}
