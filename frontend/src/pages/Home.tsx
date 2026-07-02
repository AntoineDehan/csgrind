import Navbar from "../components/ui/Navbar/Navbar";
import Title from "../components/ui/Title/Title";

export default function Home() {
  return (
    <>
      <Navbar
        aside={[
          { to: "/login", label: "Login" },
          { to: "/register", label: "Register", cta: true },
        ]}
      />
      <Title>Home</Title>
    </>
  );
}
