import type { ReactNode } from "react";

type NavbarProps = {
  logo?: boolean;
  aside: ReactNode;
};

export default function Navbar({ logo, aside }: NavbarProps) {
  return (
    <nav>
      {logo ?? (
        <div>
          <img src="" alt="" />
        </div>
      )}
      <div>{aside}</div>
    </nav>
  );
}
