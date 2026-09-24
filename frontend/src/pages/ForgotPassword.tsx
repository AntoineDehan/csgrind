import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { forgotPasswordSchema } from "@backend/schemas/auth.schema";
import { useForgotPassword } from "../auth/useAuth";
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

export default function ForgotPassword() {
  const [sentTo, setSentTo] = useState<string | null>(null);
  const mutation = useForgotPassword();

  const form = useForm({
    defaultValues: { email: "" },
    validators: { onChange: forgotPasswordSchema },
    onSubmit: async ({ value }) => {
      await mutation.mutateAsync(value.email);
      setSentTo(value.email);
    },
  });

  return (
    <div className="flex flex-col items-center gap-8 py-20 max-md:px-4 max-md:py-12">
      <Link to="/">
        <Logo variant="white" size="large" />
      </Link>
      <Card className="w-100 max-md:w-full border-background-secondary-border">
        {sentTo ? (
          <>
            <CardHeader>
              <CardTitle>Check your inbox</CardTitle>
              <CardDescription>
                If an account exists for {sentTo}, a reset link is on its way.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Text size="small">
                The link expires in 1 hour and works only once. If nothing
                arrives within a few minutes, check your spam folder.
              </Text>
            </CardContent>
          </>
        ) : (
          <>
            <CardHeader>
              <CardTitle>Forgot password</CardTitle>
              <CardDescription>
                Enter your email and we will send you a link to pick a new one.
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
                <Text size="xsmall" color="secondary">
                  <Text span size="xsmall" color="destructive">
                    *
                  </Text>{" "}
                  Required field
                </Text>

                <form.Field name="email">
                  {(field) => (
                    <div className="flex flex-col gap-1">
                      <label htmlFor={field.name} className="text-sm">
                        Email{" "}
                        <Text span size="small" color="destructive">
                          *
                        </Text>
                      </label>
                      <Input
                        id={field.name}
                        name={field.name}
                        aria-required
                        type="email"
                        autoComplete="email"
                        placeholder="you@example.com"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                      />
                      {field.state.meta.isTouched &&
                        field.state.meta.errors.length > 0 && (
                          <Text size="small" color="destructive">
                            {fieldError(field.state.meta.errors)}
                          </Text>
                        )}
                    </div>
                  )}
                </form.Field>

                {mutation.error && (
                  <Alert variant="error">{mutation.error.message}</Alert>
                )}

                <Button
                  type="submit"
                  variant="cta"
                  disabled={mutation.isPending}
                >
                  {mutation.isPending ? "Sending…" : "Send reset link"}
                </Button>
              </form>
            </CardContent>
          </>
        )}
        <CardFooter>
          <Text size="small">
            Remembered it? <Link to="/login">Log in</Link>
          </Text>
        </CardFooter>
      </Card>
    </div>
  );
}
