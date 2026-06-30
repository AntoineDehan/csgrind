import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { useMutation, useQuery } from "@tanstack/react-query";
import { startSteamLink } from "../services/steam";
import { getReports } from "../services/reports";

export default function Dashboard() {
  const { user } = useAuth();
  const { data: reports } = useQuery({
    queryKey: ["reports"],
    queryFn: getReports,
  });
  const steamMutation = useMutation({
    mutationFn: startSteamLink,
    onSuccess: ({ url }) => {
      window.location.href = url;
    },
  });

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Email : {user?.email}</p>
      <p>Steam : {user?.steam64Id ?? "non lié"}</p>
      <button
        onClick={() => steamMutation.mutate()}
        disabled={steamMutation.isPending}
      >
        Steam Link
      </button>

      {user?.steam64Id && (
        <Link to="/set-goal">
          <button>Set a goal</button>
        </Link>
      )}

      <h2>Mes reports</h2>
      <ul>
        {reports?.map((r) => (
          <li key={r.id}>
            <Link to={`/reports/${r.id}`}>
              {r.id} — {new Date(r.createdAt).toLocaleString()}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
