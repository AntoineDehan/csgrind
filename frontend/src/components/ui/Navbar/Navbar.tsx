import { Link, useNavigate } from "react-router-dom";
import type { ReactNode } from "react";
import Logo from "../Logo/Logo";
import Button from "../Button/Button";
import styles from "./navbar.module.css";

type NavItem = {
  to: string;
  label?: ReactNode;
  cta?: boolean;
  avatar?: string | null;
};

type NavbarProps = {
  logo?: boolean;
  aside?: NavItem[];
};

export default function Navbar({ logo = true, aside = [] }: NavbarProps) {
  const navigate = useNavigate();

  return (
    <nav className={styles.navbar}>
      {logo && (
        <Link to="/" className={styles.brand}>
          <Logo variant="white" size="normal" />
        </Link>
      )}

      <div className={styles.aside}>
        {aside.map((item) => {
          if (item.avatar !== undefined) {
            return (
              <Link
                key={item.to}
                to={item.to}
                className={styles.avatar}
                aria-label="Profile"
              >
                {item.avatar && (
                  <img src={item.avatar} alt="" className={styles.avatarImg} />
                )}
              </Link>
            );
          }

          return item.cta ? (
            <Button
              key={item.to}
              variant="cta"
              onClick={() => navigate(item.to)}
            >
              {item.label}
            </Button>
          ) : (
            <Link key={item.to} to={item.to} className={styles.link}>
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
