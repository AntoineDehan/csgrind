import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useVerifyEmail } from "../auth/useAuth";
import Link from "../components/ui/Link/Link";
import Text from "../components/ui/Text/Text";
import Logo from "../components/ui/Logo/Logo";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const mutation = useVerifyEmail();

  const { mutate } = mutation;

  useEffect(() => {
    if (!token) return;
    mutate(token);
  }, [token, mutate]);

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
                This address is missing its confirmation token.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Text size="small">
                Open the link from your email directly, without editing it.
              </Text>
            </CardContent>
          </>
        ) : mutation.isPending ? (
          <CardHeader>
            <CardTitle>Confirming…</CardTitle>
            <CardDescription>This only takes a moment.</CardDescription>
          </CardHeader>
        ) : mutation.isSuccess ? (
          <>
            <CardHeader>
              <CardTitle>Email confirmed</CardTitle>
              <CardDescription>Your account is now active.</CardDescription>
            </CardHeader>
            <CardFooter>
              <Text size="small">
                <Link to="/login">Log in to start your grind</Link>
              </Text>
            </CardFooter>
          </>
        ) : (
          <>
            <CardHeader>
              <CardTitle>Link expired</CardTitle>
              <CardDescription>
                This confirmation link is no longer valid.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Text size="small">
                Links expire after 24 hours. Try logging in — we will offer you
                a fresh one.
              </Text>
            </CardContent>
            <CardFooter>
              <Text size="small">
                <Link to="/login">Go to login</Link>
              </Text>
            </CardFooter>
          </>
        )}
      </Card>
    </div>
  );
}
