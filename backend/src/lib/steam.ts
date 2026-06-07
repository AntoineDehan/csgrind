const STEAM_URL = "https://steamcommunity.com/openid/login";

export function getSteamRedirectUrl(returnTo: string, realm: string) {
  const params = new URLSearchParams({
    "openid.ns": "http://specs.openid.net/auth/2.0",
    "openid.mode": "checkid_setup",
    "openid.return_to": returnTo,
    "openid.realm": realm,
    "openid.identity": "http://specs.openid.net/auth/2.0/identifier_select",
    "openid.claimed_id": "http://specs.openid.net/auth/2.0/identifier_select",
  });
  return `${STEAM_URL}?${params.toString()}`;
}

export async function verifySteamReturn(
  params: Record<string, string>,
): Promise<string> {
  const body = new URLSearchParams({
    ...params,
    "openid.mode": "check_authentication",
  });

  const res = await fetch(STEAM_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  const text = await res.text();

  if (!text.includes("is_valid:true"))
    throw new Error("Steam verification failed");

  const claimedId = params["openid.claimed_id"];
  const match = claimedId?.match(/\/id\/(\d+)$/);

  if (!match || !match[1]) throw new Error("Could not extract steam64Id");
  return match[1];
}
