import { Link, useNavigate } from "react-router-dom";
import type { ReactNode } from "react";
import Logo from "../Logo/Logo";
import Button from "../Button/Button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../dropdown-menu";
import styles from "./navbar.module.css";

export type NavMenuItem = {
  label: string;
  onSelect: () => void;
  variant?: "default" | "destructive";
};

export type NavItem = {
  to: string;
  label?: ReactNode;
  cta?: boolean;
  avatar?: string | null;
  menu?: NavMenuItem[];
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
            const avatarImg = item.avatar ? (
              <img src={item.avatar} alt="" className={styles.avatarImg} />
            ) : null;

            if (item.menu && item.menu.length > 0) {
              return (
                <DropdownMenu key={item.to}>
                  <DropdownMenuTrigger
                    className={`${styles.avatar} cursor-pointer p-0`}
                    aria-label="Account menu"
                  >
                    {avatarImg}
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" sideOffset={15}>
                    {item.menu.map((menuItem) => (
                      <DropdownMenuItem
                        key={menuItem.label}
                        variant={menuItem.variant}
                        onClick={menuItem.onSelect}
                        className="cursor-pointer"
                      >
                        {menuItem.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              );
            }

            return (
              <Link
                key={item.to}
                to={item.to}
                className={styles.avatar}
                aria-label="Profile"
              >
                {avatarImg}
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
