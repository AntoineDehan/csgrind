import { Link } from "react-router-dom";
import { useUser } from "../auth/useAuth";
import { useMutation, useQuery } from "@tanstack/react-query";
import { startSteamLink } from "../services/steam";
import { getReports } from "../services/reports";
import { useGoals } from "../hooks/useGoals";
import TaskList from "../components/ui/TaskList/TaskList";
import Logo from "../components/ui/Logo/Logo";

export default function Dashboard() {
  const { data: user } = useUser();
  const { data: reports } = useQuery({
    queryKey: ["reports"],
    queryFn: getReports,
  });
  const { data: goals } = useGoals();
  const activeGoal = goals?.find((goal) => goal.status === "in_progress");

  const steamMutation = useMutation({
    mutationFn: startSteamLink,
    onSuccess: ({ url }) => {
      window.location.href = url;
    },
  });

  return (
    <div>
      <Logo variant="black" size="normal" />
      <h1>Dashboard</h1>
      <p>Email : {user?.email}</p>
      <p>Steam : {user?.steam64Id ?? "not linked"}</p>
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

      {activeGoal && <TaskList goalId={activeGoal.id} />}

      <h2>My reports</h2>
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
