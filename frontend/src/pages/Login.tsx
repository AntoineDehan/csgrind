import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { useLogin, useRegister } from "../auth/useAuth";
import { useNavigate } from "react-router-dom";
import {
  loginUserSchema,
  registerUserSchema,
} from "@backend/schemas/auth.schema";

export default function Login() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const navigate = useNavigate();

  const loginMutation = useLogin();
  const registerMutation = useRegister();
  const mutation = mode === "login" ? loginMutation : registerMutation;

  const form = useForm({
    defaultValues: { email: "", password: "" },
    validators: {
      onChange: mode === "login" ? loginUserSchema : registerUserSchema,
    },
    onSubmit: async ({ value }) => {
      await mutation.mutateAsync(value);
      navigate("/dashboard");
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <form.Field name="email">
        {(field) => (
          <div>
            <input
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              placeholder="email"
            />
          </div>
        )}
      </form.Field>
      <form.Field name="password">
        {(field) => (
          <div>
            <input
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              placeholder="password"
              type="password"
            />
          </div>
        )}
      </form.Field>

      <button type="submit" disabled={mutation.isPending}>
        {mode === "login" ? "Se connecter" : "S'inscrire"}
      </button>
      {mutation.error && <p>{mutation.error.message}</p>}

      <button
        type="button"
        onClick={() => setMode(mode === "login" ? "register" : "login")}
      >
        Toggle register/login
      </button>
    </form>
  );
}
