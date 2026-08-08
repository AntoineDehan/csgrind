import LegalPage, { LegalSection } from "./LegalPage";
import Link from "../../components/ui/Link/Link";
import Text from "../../components/ui/Text/Text";

export default function Privacy() {
  return (
    <LegalPage title="Privacy policy" updatedAt="7 August 2026">
      <LegalSection heading="Who is responsible">
        <Text>
          Antoine Dehan is the data controller for csgrind. For any question or
          request about your data, write to{" "}
          <span className="text-brand">nelekk33@gmail.com</span>.
        </Text>
      </LegalSection>

      <LegalSection heading="What we collect and why">
        <Text>
          csgrind only collects what it needs to run. There is no advertising,
          no profiling for third parties, and your data is never sold.
        </Text>
        <div className="overflow-x-auto">
          <table className="w-full min-w-100 border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-background-secondary-border">
                <th className="py-2 pr-4 font-medium">Data</th>
                <th className="py-2 pr-4 font-medium">Source</th>
                <th className="py-2 font-medium">Purpose</th>
              </tr>
            </thead>
            <tbody className="text-text-secondary">
              <tr className="border-b border-background-secondary-border">
                <td className="py-2 pr-4">Email address</td>
                <td className="py-2 pr-4">You</td>
                <td className="py-2">Account identity and report notifications</td>
              </tr>
              <tr className="border-b border-background-secondary-border">
                <td className="py-2 pr-4">Password</td>
                <td className="py-2 pr-4">You</td>
                <td className="py-2">Authentication — stored hashed, never in clear text</td>
              </tr>
              <tr className="border-b border-background-secondary-border">
                <td className="py-2 pr-4">Display name and avatar</td>
                <td className="py-2 pr-4">Steam</td>
                <td className="py-2">Showing who is signed in</td>
              </tr>
              <tr className="border-b border-background-secondary-border">
                <td className="py-2 pr-4">SteamID64</td>
                <td className="py-2 pr-4">Steam</td>
                <td className="py-2">Matching your account to your statistics</td>
              </tr>
              <tr className="border-b border-background-secondary-border">
                <td className="py-2 pr-4">Gameplay statistics and ranks</td>
                <td className="py-2 pr-4">Leetify</td>
                <td className="py-2">Generating your progress reports</td>
              </tr>
              <tr>
                <td className="py-2 pr-4">Goals, badges, task progress</td>
                <td className="py-2 pr-4">Your use of the service</td>
                <td className="py-2">Tracking your progress over time</td>
              </tr>
            </tbody>
          </table>
        </div>
      </LegalSection>

      <LegalSection heading="Legal basis">
        <Text>
          All of the above is processed to deliver the service you asked for
          when you created an account. Linking a Steam account is optional, but
          without it no statistics can be retrieved and the service cannot
          produce reports.
        </Text>
      </LegalSection>

      <LegalSection heading="How long we keep it">
        <Text>
          Your data is kept for as long as your account exists. Deleting your
          account removes your goals, reports and badges at the same time.
        </Text>
        <Text>
          In addition, csgrind checks every day whether the Leetify account
          linked to yours still exists. If it has been deleted, all statistics
          stored about you are deleted automatically, without any action on
          your part.
        </Text>
      </LegalSection>

      <LegalSection heading="Who else sees your data">
        <Text>
          csgrind relies on a small number of third parties, each for a single
          purpose:
        </Text>
        <ul className="flex list-disc flex-col gap-2 pl-5">
          <li>
            <Text span>
              <strong>Leetify</strong> — source of your gameplay statistics.
            </Text>
          </li>
          <li>
            <Text span>
              <strong>Steam (Valve)</strong> — authentication and public profile
              information.
            </Text>
          </li>
          <li>
            <Text span>
              <strong>Resend</strong> — sending account and report emails.
            </Text>
          </li>
          <li>
            <Text span>
              <strong>OVH</strong> — hosting, on servers located in Germany
              (European Union).
            </Text>
          </li>
          <li>
            <Text span>
              <strong>Google Fonts</strong> — fonts are loaded from Google's
              servers, which therefore receive your IP address when a page
              loads.
            </Text>
          </li>
        </ul>
      </LegalSection>

      <LegalSection heading="Cookies and browser storage">
        <Text>
          csgrind uses no analytics, no advertising tags and no tracking of any
          kind.
        </Text>
        <Text>
          When you sign in, a single authentication token is stored in your
          browser so you stay signed in. It is strictly necessary to run the
          service you requested, which is why no consent banner is shown.
          Signing out removes it.
        </Text>
      </LegalSection>

      <LegalSection heading="Your rights">
        <Text>
          Under the GDPR you may access your data, correct it, delete it, take
          it elsewhere, or object to its processing.
        </Text>
        <Text>
          <strong>Deletion is immediate and self-service</strong>: open your
          profile and use "Delete my account". Everything goes at once.
        </Text>
        <Text>
          For anything else, write to{" "}
          <span className="text-brand">nelekk33@gmail.com</span> and you will
          get an answer within one month.
        </Text>
        <Text>
          If you believe your rights are not being respected, you may lodge a
          complaint with the CNIL, the French data protection authority.
        </Text>
      </LegalSection>

      <LegalSection heading="Security">
        <Text>
          Passwords are hashed with bcrypt and never stored in clear text. All
          traffic runs over HTTPS. The database is not reachable from the
          internet.
        </Text>
      </LegalSection>

      <LegalSection heading="Changes">
        <Text>
          This policy may change. The date at the top of this page always
          reflects the current version. See also our{" "}
          <Link to="/terms">terms of use</Link>.
        </Text>
      </LegalSection>
    </LegalPage>
  );
}
