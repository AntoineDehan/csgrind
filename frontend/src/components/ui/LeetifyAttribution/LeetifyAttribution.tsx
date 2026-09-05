import { useUser } from "../../../auth/useAuth";
import Text from "../Text/Text";
import leetifyLogo from "../../../assets/Leetify.png";

type LeetifyAttributionProps = {
  className?: string;
};

export default function LeetifyAttribution({
  className = "",
}: LeetifyAttributionProps) {
  const { data: user } = useUser();

  const profileUrl = user?.steam64Id
    ? `https://leetify.com/app/profile/${user.steam64Id}`
    : "https://leetify.com/";

  return (
    <div className={`flex justify-between items-end mb-2 mt-2 ${className}`}>
      <a href="https://leetify.com/" target="_blank" rel="noreferrer">
        <img src={leetifyLogo} alt="Powered by Leetify" className="h-8 w-auto" />
      </a>
      <a href={profileUrl} target="_blank" rel="noreferrer">
        <Text size="small" color="leetify" className="underline">
          View on Leetify
        </Text>
      </a>
    </div>
  );
}
