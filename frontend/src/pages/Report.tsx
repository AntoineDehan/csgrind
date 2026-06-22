import { useParams, useNavigate } from "react-router-dom";

export default function Report() {
  const { reportId } = useParams();
  const navigate = useNavigate();

  return (
    <div>
      <button type="button" onClick={() => navigate(-1)}>
        Back
      </button>
      <h1>Report #{reportId}</h1>
    </div>
  );
}
