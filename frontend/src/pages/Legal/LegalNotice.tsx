import LegalPage, { LegalSection } from "./LegalPage";
import Text from "../../components/ui/Text/Text";

export default function LegalNotice() {
  return (
    <LegalPage title="Legal notice" updatedAt="7 August 2026">
      <LegalSection heading="Publisher">
        <Text>
          csgrind is published by Antoine Dehan, acting as a private individual.
        </Text>
        <Text>
          Contact: <span className="text-brand">nelekk33@gmail.com</span>
        </Text>
        <Text color="secondary" size="small">
          As a non-professional publisher, no postal address is disclosed. The
          publisher's full identity is held by the hosting provider.
        </Text>
      </LegalSection>

      <LegalSection heading="Publication director">
        <Text>Antoine Dehan.</Text>
      </LegalSection>

      <LegalSection heading="Hosting">
        <Text>
          OVH SAS, a société par actions simplifiée with a share capital of
          €50,000,000, registered at 2 rue Kellermann, 59100 Roubaix, France,
          under RCS Lille Métropole 424 761 419 00045.
        </Text>
        <Text color="secondary" size="small">
          The servers used by csgrind are located in Germany, within the
          European Union.
        </Text>
      </LegalSection>

      <LegalSection heading="Credits and trademarks">
        <Text>
          Gameplay statistics are provided by Leetify. Counter-Strike 2 and
          related trademarks belong to Valve Corporation.
        </Text>
        <Text>
          csgrind is an independent project. It is not affiliated with,
          endorsed by, or sponsored by Valve Corporation or Leetify.
        </Text>
      </LegalSection>

      <LegalSection heading="Intellectual property">
        <Text>
          The source code, design and written content of csgrind belong to
          their author, except where stated otherwise. Game data displayed
          through the service remains the property of its respective owners.
        </Text>
      </LegalSection>
    </LegalPage>
  );
}
