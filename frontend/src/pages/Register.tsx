import { useForm } from "@tanstack/react-form";
import { useNavigate } from "react-router-dom";
import { registerUserSchema } from "@backend/schemas/auth.schema";
import { useRegister } from "../auth/useAuth";
import Title from "../components/ui/Title/Title";
import Input from "../components/ui/Input/Input";
import Button from "../components/ui/Button/Button";
import Link from "../components/ui/Link/Link";
import Alert from "../components/ui/Alert/Alert";

export default function Register() {
  const navigate = useNavigate();
  const mutation = useRegister();

  const form = useForm({
    defaultValues: { email: "", password: "" },
    validators: { onChange: registerUserSchema },
    onSubmit: async ({ value }) => {
      await mutation.mutateAsync(value);
      navigate("/dashboard");
    },
  });

  return (
    <div>
      <Title level="h2">S'inscrire</Title>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <form.Field name="email">
          {(field) => (
            <Input
              type="email"
              name="email"
              placeholder="Email"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
            />
          )}
        </form.Field>

        <form.Field name="password">
          {(field) => (
            <Input
              type="password"
              name="password"
              placeholder="Mot de passe"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
            />
          )}
        </form.Field>

        <Button type="submit" variant="cta" disabled={mutation.isPending}>
          S'inscrire
        </Button>

        {mutation.error && <Alert variant="error">{mutation.error.message}</Alert>}
      </form>

      <Link to="/login">Déjà un compte ? Se connecter</Link>
    </div>
  );
}
