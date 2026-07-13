import { env } from "../config/env";

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

const STEAM_SUMMARY_URL =
  "https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/";

export type SteamPlayerSummary = {
  name: string;
  avatar: string;
};

export async function fetchSteamPlayerSummary(
  steam64Id: string,
): Promise<SteamPlayerSummary | null> {
  const params = new URLSearchParams({
    key: env.STEAM_API_KEY,
    steamids: steam64Id,
  });
  const res = await fetch(`${STEAM_SUMMARY_URL}?${params.toString()}`);

  if (!res.ok) throw new Error(`Steam summary request failed: ${res.status}`);

  const data = (await res.json()) as {
    response?: {
      players?: { personaname?: string; avatarfull?: string }[];
    };
  };

  const player = data.response?.players?.[0];
  if (!player) return null;

  return {
    name: player.personaname ?? "",
    avatar: player.avatarfull ?? "",
  };
}
