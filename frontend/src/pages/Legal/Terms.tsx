import LegalPage, { LegalSection } from "./LegalPage";
import Link from "../../components/ui/Link/Link";
import Text from "../../components/ui/Text/Text";

export default function Terms() {
  return (
    <LegalPage title="Terms of use" updatedAt="7 August 2026">
      <LegalSection heading="What csgrind is">
        <Text>
          csgrind is a free progress tracker for Counter-Strike 2. You set an
          Elo goal, and the service produces periodic reports from your
          gameplay statistics, along with tips and tasks to work on.
        </Text>
        <Text>
          Using the service means you accept these terms. If you do not, do not
          create an account.
        </Text>
      </LegalSection>

      <LegalSection heading="Your account">
        <Text>
          One account per person. You are responsible for keeping your password
          private, and for everything done through your account.
        </Text>
        <Text>
          You must confirm your email address before signing in, and the
          address must be yours.
        </Text>
      </LegalSection>

      <LegalSection heading="Statistics are not guaranteed">
        <Text>
          All gameplay data shown by csgrind comes from Leetify. Their accuracy,
          completeness and availability are outside our control.
        </Text>
        <Text>
          Reports, tips and tasks are indicative. They are not coaching advice
          and no result is promised — nothing here guarantees that your rank
          will improve.
        </Text>
      </LegalSection>

      <LegalSection heading="Availability">
        <Text>
          csgrind is provided free of charge and as-is, with no guaranteed
          uptime. The service may be interrupted for maintenance, or because a
          third party it depends on is unavailable. It may also be discontinued.
        </Text>
      </LegalSection>

      <LegalSection heading="Acceptable use">
        <Text>
          Do not attempt to disrupt the service, access other users' data, or
          extract data automatically at scale. Accounts that do may be suspended
          or deleted without notice.
        </Text>
      </LegalSection>

      <LegalSection heading="Ending your account">
        <Text>
          You can delete your account at any time from your profile. Deletion is
          immediate and permanent: goals, reports and badges go with it, and
          none of it can be recovered.
        </Text>
      </LegalSection>

      <LegalSection heading="Changes">
        <Text>
          These terms may change. The date at the top of this page always
          reflects the current version. See also our{" "}
          <Link to="/privacy">privacy policy</Link>.
        </Text>
      </LegalSection>
    </LegalPage>
  );
}
