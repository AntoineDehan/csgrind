import { Link } from "react-router-dom";
import Container from "../../components/ui/Container/Container";
import Title from "../../components/ui/Title/Title";
import Text from "../../components/ui/Text/Text";
import Loader from "../../components/ui/Loader/Loader";
import { useReports } from "../../hooks/useReports";

export default function Reports() {
  const { data: reports, isLoading } = useReports();

  if (isLoading) {
    return (
      <Container>
        <div className="flex justify-center py-20">
          <Loader size="large" />
        </div>
      </Container>
    );
  }

  const sorted = [...(reports ?? [])].sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt),
  );

  return (
    <Container>
      <div className="py-10">
        <Title>Reports</Title>

        {sorted.length > 0 ? (
          <ul className="mt-6 flex flex-col gap-3">
            {sorted.map((report) => (
              <li key={report.id}>
                <Link
                  to={`/reports/${report.id}`}
                  className="block rounded-md border border-background-secondary-border bg-background-secondary p-4 transition-colors hover:border-brand"
                >
                  <Text>{new Date(report.createdAt).toLocaleDateString()}</Text>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <Text color="secondary">No reports yet.</Text>
        )}
      </div>
    </Container>
  );
}
