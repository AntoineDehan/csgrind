import { Link } from "react-router-dom";
import type { ReactNode } from "react";
import Logo from "../Logo/Logo";
import styles from "./navbar.module.css";

type NavItem = {
  to: string;
  label: ReactNode;
  cta?: boolean;
};

type NavbarProps = {
  logo?: boolean;
  aside?: NavItem[];
};

export default function Navbar({ logo = true, aside = [] }: NavbarProps) {
  return (
    <nav className={styles.navbar}>
      {logo && (
        <Link to="/" className={styles.brand}>
          <Logo variant="white" size="normal" />
        </Link>
      )}

      <div className={styles.aside}>
        {aside.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className={item.cta ? styles.linkCta : styles.link}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
