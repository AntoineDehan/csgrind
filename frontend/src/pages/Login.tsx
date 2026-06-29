import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import {
  loginUserSchema,
  registerUserSchema,
} from "@backend/schemas/auth.schema";

export default function Login() {
  const { login, register } = useAuth();
  const [mode, setMode] = useState<"login" | "register">("login");
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: (value: { email: string; password: string }) =>
      mode === "login" ? login(value) : register(value),
    onSuccess: () => navigate("/dashboard"),
  });

  const form = useForm({
    defaultValues: { email: "", password: "" },
    validators: {
      onChange: mode === "login" ? loginUserSchema : registerUserSchema,
    },
    onSubmit: async ({ value }) => {
      await mutation.mutateAsync(value);
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
