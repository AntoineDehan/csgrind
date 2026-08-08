import Link from "../Link/Link";
import Text from "../Text/Text";

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-background-secondary-border">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-6 py-8 max-md:flex-col max-md:justify-center max-md:text-center">
        <Text size="small" color="secondary">
          © 2026 csgrind
        </Text>
        <nav className="flex flex-wrap items-center gap-x-5 gap-y-2 max-md:justify-center">
          <Text size="small" span>
            <Link to="/legal-notice">Legal notice</Link>
          </Text>
          <Text size="small" span>
            <Link to="/privacy">Privacy</Link>
          </Text>
          <Text size="small" span>
            <Link to="/terms">Terms</Link>
          </Text>
        </nav>
      </div>
    </footer>
  );
}
