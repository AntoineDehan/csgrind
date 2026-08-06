import { useForm } from "@tanstack/react-form";
import { useNavigate } from "react-router-dom";
import { registerUserSchema } from "@backend/schemas/auth.schema";
import { useRegister } from "../auth/useAuth";
import Link from "../components/ui/Link/Link";
import Input from "../components/ui/Input/Input";
import Button from "../components/ui/Button/Button";
import Text from "../components/ui/Text/Text";
import Alert from "../components/ui/Alert/Alert";
import Logo from "../components/ui/Logo/Logo";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

function fieldError(errors: unknown[]): string {
  return errors
    .map((e) => (e as { message?: string })?.message ?? String(e))
    .join(", ");
}

export default function Register() {
  const navigate = useNavigate();
  const mutation = useRegister();

  const form = useForm({
    defaultValues: { email: "", password: "" },
    validators: { onChange: registerUserSchema },
    onSubmit: async ({ value }) => {
      await mutation.mutateAsync(value);
      navigate("/steam-link");
    },
  });

  return (
    <div className="flex flex-col items-center gap-8 py-20 max-md:px-4 max-md:py-12">
      <Link to="/">
        <Logo variant="white" size="large" />
      </Link>
      <Card className="w-100 max-md:w-full border-background-secondary-border">
        <CardHeader>
          <CardTitle>Create account</CardTitle>
          <CardDescription>
            Set a goal, get reports, climb. Start your grind.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            className="flex flex-col gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
          >
            <form.Field name="email">
              {(field) => (
                <div className="flex flex-col gap-1">
                  <label htmlFor={field.name} className="text-sm">
                    Email
                  </label>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                  />
                  {field.state.meta.isTouched &&
                    field.state.meta.errors.length > 0 && (
                      <span className="text-sm text-destructive">
                        {fieldError(field.state.meta.errors)}
                      </span>
                    )}
                </div>
              )}
            </form.Field>

            <form.Field name="password">
              {(field) => (
                <div className="flex flex-col gap-1">
                  <label htmlFor={field.name} className="text-sm">
                    Password
                  </label>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="password"
                    autoComplete="new-password"
                    placeholder="At least 8 characters"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                  />
                  {field.state.meta.isTouched &&
                    field.state.meta.errors.length > 0 && (
                      <span className="text-sm text-destructive">
                        {fieldError(field.state.meta.errors)}
                      </span>
                    )}
                </div>
              )}
            </form.Field>

            {mutation.error && (
              <Alert variant="error">{mutation.error.message}</Alert>
            )}

            <Button type="submit" variant="cta" disabled={mutation.isPending}>
              {mutation.isPending ? "Creating account…" : "Register"}
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          <Text size="small">
            Already have an account? <Link to="/login">Log in</Link>
          </Text>
        </CardFooter>
      </Card>
    </div>
  );
}
