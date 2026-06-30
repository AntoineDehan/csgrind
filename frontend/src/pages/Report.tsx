import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getReport } from "../services/reports";

export default function Report() {
  const { reportId } = useParams();
  const navigate = useNavigate();

  const {
    data: report,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["report", reportId],
    queryFn: () => getReport(reportId!),
    enabled: !!reportId,
  });

  return (
    <div>
      <button type="button" onClick={() => navigate(-1)}>
        Back
      </button>
      <h1>Report #{reportId}</h1>

      {isLoading && <p>Chargement…</p>}
      {error && <p>{error.message}</p>}

      {report && (
        <ul>
          {Object.entries(report).map(([key, value]) => (
            <li key={key}>
              <strong>{key}</strong> : {value === null ? "—" : String(value)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
