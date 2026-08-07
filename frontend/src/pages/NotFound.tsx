import { useNavigate } from "react-router-dom";
import Container from "../components/ui/Container/Container";
import Title from "../components/ui/Title/Title";
import Text from "../components/ui/Text/Text";
import Button from "../components/ui/Button/Button";

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <Container>
      <div className="flex flex-col items-center gap-4 py-20 text-center">
        <Title>404</Title>
        <Text color="secondary">This page does not exist.</Text>
        <Button variant="cta" onClick={() => navigate("/")}>
          Back to home
        </Button>
      </div>
    </Container>
  );
}
