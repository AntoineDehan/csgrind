import { useForm } from "@tanstack/react-form";
import { useNavigate, useSearchParams } from "react-router-dom";
import { z } from "zod";
import { passwordSchema } from "@backend/schemas/user.schema";
import { useResetPassword } from "../auth/useAuth";
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

const resetPasswordFormSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

function fieldError(errors: unknown[]): string {
  return errors
    .map((e) => (e as { message?: string })?.message ?? String(e))
    .join(", ");
}

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();
  const mutation = useResetPassword();

  const form = useForm({
    defaultValues: { password: "", confirmPassword: "" },
    validators: { onChange: resetPasswordFormSchema },
    onSubmit: async ({ value }) => {
      if (!token) return;
      await mutation.mutateAsync({ token, password: value.password });
      navigate("/login", { replace: true, state: { passwordReset: true } });
    },
  });

  return (
    <div className="flex flex-col items-center gap-8 py-20 max-md:px-4 max-md:py-12">
      <Link to="/">
        <Logo variant="white" size="large" />
      </Link>
      <Card className="w-100 max-md:w-full border-background-secondary-border">
        {!token ? (
          <>
            <CardHeader>
              <CardTitle>Link incomplete</CardTitle>
              <CardDescription>
                This address is missing its reset token.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Text size="small">
                Open the link from your email directly, without editing it.
              </Text>
            </CardContent>
            <CardFooter>
              <Text size="small">
                <Link to="/forgot-password">Ask for a new link</Link>
              </Text>
            </CardFooter>
          </>
        ) : (
          <>
            <CardHeader>
              <CardTitle>Reset password</CardTitle>
              <CardDescription>
                Pick a new password for your account.
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

                <form.Field name="password">
                  {(field) => (
                    <div className="flex flex-col gap-1">
                      <label htmlFor={field.name} className="text-sm">
                        New password{" "}
                        <Text span size="small" color="destructive">
                          *
                        </Text>
                      </label>
                      <Input
                        id={field.name}
                        name={field.name}
                        aria-required
                        type="password"
                        autoComplete="new-password"
                        placeholder="At least 8 characters"
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

                <form.Field name="confirmPassword">
                  {(field) => (
                    <div className="flex flex-col gap-1">
                      <label htmlFor={field.name} className="text-sm">
                        Confirm password{" "}
                        <Text span size="small" color="destructive">
                          *
                        </Text>
                      </label>
                      <Input
                        id={field.name}
                        name={field.name}
                        aria-required
                        type="password"
                        autoComplete="new-password"
                        placeholder="Type it again"
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
                  <Alert variant="error">
                    <div className="flex flex-col items-start gap-1">
                      <Text size="small">{mutation.error.message}</Text>
                      <Link to="/forgot-password">
                        <Text span size="small">
                          Ask for a new link
                        </Text>
                      </Link>
                    </div>
                  </Alert>
                )}

                <Button
                  type="submit"
                  variant="cta"
                  disabled={mutation.isPending}
                >
                  {mutation.isPending ? "Saving…" : "Save new password"}
                </Button>
              </form>
            </CardContent>
          </>
        )}
      </Card>
    </div>
  );
}
