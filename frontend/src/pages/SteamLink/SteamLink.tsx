import { Navigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useUser } from "../../auth/useAuth";
import { startSteamLink } from "../../services/steam";
import Link from "../../components/ui/Link/Link";
import Alert from "../../components/ui/Alert/Alert";
import Logo from "../../components/ui/Logo/Logo";
import Loader from "../../components/ui/Loader/Loader";
import steamButton from "../../assets/steam.png";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

export default function SteamLink() {
  const { data: user, isLoading } = useUser();

  const steamMutation = useMutation({
    mutationFn: startSteamLink,
    onSuccess: ({ url }) => {
      window.location.href = url;
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader size="large" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.steam64Id) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="flex flex-col items-center gap-8 py-20 max-md:px-4 max-md:py-12">
      <Link to="/">
        <Logo variant="white" size="large" />
      </Link>
      <Card className="w-100 max-md:w-full border-background-secondary-border">
        <CardHeader>
          <CardTitle>Link your Steam account</CardTitle>
          <CardDescription>
            Connect Steam so we can pull your CS2 stats from Leetify.com
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="flex flex-col items-center gap-3">
        {steamMutation.error && (
          <Alert variant="error">{steamMutation.error.message}</Alert>
        )}
        <button
          type="button"
          onClick={() => steamMutation.mutate()}
          disabled={steamMutation.isPending}
          className="cursor-pointer p-0 transition-opacity hover:opacity-90 disabled:cursor-default disabled:opacity-60"
        >
          <img
            src={steamButton}
            alt="Sign in through Steam"
            className="h-auto w-27"
          />
        </button>
      </div>
    </div>
  );
}
