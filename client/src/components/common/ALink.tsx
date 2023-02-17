import { Link } from "react-router-dom";
export default function ALink({
  href,
  children,
  className,
  style,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <Link to={href}>
      <span className={className} style={style}>
        {children}
      </span>
    </Link>
  );
}
