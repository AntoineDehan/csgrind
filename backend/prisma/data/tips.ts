export type TipSeed = {
  id: string;
  category: string;
  priority: number;
  content: string;
};

export const TIP_SEEDS: TipSeed[] = [
  {
    id: "75650a27-fa77-48e5-b6bc-a175b0782fc3",
    category: "accuracyEnemySpotted",
    priority: 1,
    content:
      "Take angles where you actually expect a peek, or be the one to peek first.",
  },
  {
    id: "b84efa56-bae1-494a-84cc-dc74473e7381",
    category: "accuracyEnemySpotted",
    priority: 1,
    content: "Use rush/aim warmup maps.",
  },
  {
    id: "adb137ea-6ea2-4325-9aa1-ecc0dbb07b6d",
    category: "accuracyHead",
    priority: 1,
    content: "Warm up on headshot-only (HS) servers.",
  },
  {
    id: "331a48c9-518f-4233-bf8f-6313075c3f87",
    category: "accuracyHead",
    priority: 1,
    content: "Focus on your crosshair placement.",
  },
  {
    id: "b4b65be0-3a09-4665-a8a5-c0c4ea70d919",
    category: "aimRating",
    priority: 1,
    content: "Play a deathmatch to actually get warm, not just aim maps.",
  },
  {
    id: "c75f473f-f179-4dd2-b229-31d86587717b",
    category: "aimRating",
    priority: 1,
    content: "You should warmup before playing games.",
  },
  {
    id: "8d8dcbb4-366a-4bf6-89bd-233b950c9b9e",
    category: "aimRating",
    priority: 1,
    content: "Use warmup maps to train your aim before your session.",
  },
  {
    id: "0199a89d-36a6-4f7e-b537-7141d85a1711",
    category: "counterStrafingRatio",
    priority: 1,
    content:
      "Use a dynamic crosshair for some time just to check whether you're counter-strafing correctly.",
  },
  {
    id: "d64d2287-89b4-4bb6-a850-94074ddb08e4",
    category: "counterStrafingRatio",
    priority: 1,
    content:
      "Take the time to properly learn how to counter-strafe properly before drilling it.",
  },
  {
    id: "2c7a6011-027d-4afd-942c-f4c03a582a64",
    category: "ctOpeningSuccess",
    priority: 1,
    content: "If you want to push as CT, coordinate flashes with your team.",
  },
  {
    id: "f1154a91-975e-44c3-b73e-d04f81507a21",
    category: "ctOpeningSuccess",
    priority: 1,
    content:
      "Don't hold the same common angle every rounds, try to surprise the enemy push from time to time.",
  },
  {
    id: "654990b8-8b71-432c-852c-5e377465028d",
    category: "flashAvgDuration",
    priority: 1,
    content:
      "Flash the moment you or your team push, not before otherwise it will warn the enemy you're pushing.",
  },
  {
    id: "e93b2887-556f-462e-b4c9-392e3d1429eb",
    category: "flashAvgDuration",
    priority: 1,
    content:
      "A flash they can turn away from does nothing, aim it where they're looking",
  },
  {
    id: "d941794e-0d0e-482d-b929-5e4161f1ff61",
    category: "flashHitPerFlash",
    priority: 1,
    content: "Practice good pop-flashes to help your team.",
  },
  {
    id: "8f4040d6-e556-415a-b752-f3c1d3109d5f",
    category: "flashHitPerFlash",
    priority: 1,
    content: "Often, a flash that pops without bouncing is better.",
  },
  {
    id: "6933c542-30dd-4868-9420-b4a013e7259b",
    category: "flashHitPerFlash",
    priority: 1,
    content: "Throw fewer flashes on the ground and more above head-level.",
  },
  {
    id: "7726ca76-4ec1-4cb9-bc68-1090e73eb2b8",
    category: "flashLeadingToKill",
    priority: 1,
    content: "Flash before entering the site.",
  },
  {
    id: "8926c706-2383-485f-8a0a-54d02753100d",
    category: "flashLeadingToKill",
    priority: 1,
    content:
      "Communicate before flashing so a teammate can peek. Communication is key.",
  },
  {
    id: "77c9800c-b9ef-4aae-84c7-96d394785224",
    category: "heFoesDamageAvg",
    priority: 1,
    content:
      "Ask for nade drops when you hold a chokepoint (Dust2 short, Inferno banana...)",
  },
  {
    id: "bf57dd02-fa23-4fdd-8bef-0243d7a5e31d",
    category: "heFoesDamageAvg",
    priority: 1,
    content:
      "Don't waste a nade out of fear, learn map timing or get information first.",
  },
  {
    id: "2e543741-6162-4708-a3a2-32301b3a6ab9",
    category: "heFoesDamageAvg",
    priority: 1,
    content: "Learn each map's T push timings.",
  },
  {
    id: "8a51c2f8-cb09-4038-93c7-fe89427c0781",
    category: "positioningRating",
    priority: 1,
    content:
      "Set up your position to keep the advantage even when you get peeked.",
  },
  {
    id: "efc62512-eae1-4470-8084-8c2cbbb57265",
    category: "positioningRating",
    priority: 2,
    content:
      "Watch your demos from the opponent's POV to see where your positioning was bad.",
  },
  {
    id: "fde08822-0c69-49c8-a494-c76926e77ce1",
    category: "preaim",
    priority: 1,
    content: "Warm up on prefire maps.",
  },
  {
    id: "9de0110f-45eb-47aa-b024-6aa8ae99773d",
    category: "preaim",
    priority: 1,
    content: "Clear your angles.",
  },
  {
    id: "193c753e-3a9c-4c04-8ea6-54e3216b5a43",
    category: "preaim",
    priority: 1,
    content:
      "Keep your crosshair at head height at all times, even while rotating. Crosshair placement is key.",
  },
  {
    id: "9b5ddcbd-ac3f-4ba2-87a2-aa61eb337acb",
    category: "preaim",
    priority: 2,
    content:
      "Always be ready for common angles, peek while expecting someone at this angle, and keep off-angles in mind.",
  },
  {
    id: "47fb1e70-bf24-4f12-b271-da206e78872e",
    category: "reactionTimeMs",
    priority: 1,
    content: "Keep moving instead of holding an angle completely static.",
  },
  {
    id: "52c0dcd7-f00f-47ee-bbaa-7fc0d109837a",
    category: "reactionTimeMs",
    priority: 1,
    content: "Pre-aim strong angles and always expect an enemy to swing.",
  },
  {
    id: "c6e2a584-ca23-4df3-af71-f0be2b4e7912",
    category: "sprayAccuracy",
    priority: 1,
    content:
      "Master the first 10 bullets of the AK/M4 pattern : that's most fights.",
  },
  {
    id: "421a7b3c-893a-453b-9733-9e03d7fb7660",
    category: "sprayAccuracy",
    priority: 1,
    content: "Train your spray patterns on spray maps.",
  },
  {
    id: "124b89be-60a8-4759-8b9f-6d66601e50ed",
    category: "sprayAccuracy",
    priority: 1,
    content: "Warm up on recoil/multicfg servers.",
  },
  {
    id: "5468716f-5e6a-4678-b2bb-df773af170be",
    category: "tOpeningSuccess",
    priority: 1,
    content: "Communicate so teammates can pop-flash your entries.",
  },
  {
    id: "eca3819a-2ba8-4ac2-b90d-f3000e512cf9",
    category: "tOpeningSuccess",
    priority: 1,
    content:
      "Adapt to the game: if CTs push every round, play more for map control.",
  },
  {
    id: "77176a3d-5bd0-4c64-a7ee-a40a155b645e",
    category: "tradeDeathsSuccess",
    priority: 1,
    content: "You play to win as a team, not to die alone without impact.",
  },
  {
    id: "9e705be0-3824-4d51-9481-713e0e11b167",
    category: "tradeDeathsSuccess",
    priority: 1,
    content: "Dying to get traded is almost always worth it.",
  },
  {
    id: "2945db3d-2225-489d-b4fc-967089e18ddb",
    category: "tradeDeathsSuccess",
    priority: 1,
    content: "Call that you're entrying and ask for a trade beforehand.",
  },
  {
    id: "40d2acbc-3320-4b75-b942-17b57c7d3238",
    category: "tradeKillsSuccess",
    priority: 1,
    content: "Communicate to peek together.",
  },
  {
    id: "2a6fb02b-56c7-4678-8e41-28dbc40311f6",
    category: "tradeKillsSuccess",
    priority: 1,
    content: "Always play in a position to trade your teammate.",
  },
  {
    id: "f3cc03c3-f478-4c4c-a251-18e4466bbd8c",
    category: "tradeKillsSuccess",
    priority: 1,
    content: "Trading kills is the key to winning rounds. Baiting isn't.",
  },
  {
    id: "27d7a628-a926-497d-8d2c-8b4d40f27519",
    category: "utilityOnDeathAvg",
    priority: 1,
    content:
      "If you struggle at first, force yourself to use utility even if it's a bit wasted, you'll balance it out with habit.",
  },
  {
    id: "f9fcc1c6-c108-44af-b887-23aedbeb45e9",
    category: "utilityOnDeathAvg",
    priority: 1,
    content:
      "Buying utility and dying with it unused is a complete waste. Use it or drop it to your teammates.",
  },
  {
    id: "2b488d35-379d-4afc-a6f4-42ed5e3377f0",
    category: "utilityRating",
    priority: 1,
    content:
      "Don't treat your molotov as a wall, a committed rush will run right through it. Use an HE to punish the stacked push instead.",
  },
  {
    id: "068ab6ff-ac9a-49ac-9841-9a9c3a09dacb",
    category: "utilityRating",
    priority: 1,
    content:
      "Download utility guides from the Workshop to learn line-ups on each map.",
  },
  {
    id: "037fd182-7378-4aca-bb06-a79519572a7b",
    category: "utilityRating",
    priority: 1,
    content:
      "Before throwing a utility, ask yourself whether it will really be useful. It's often times worth the second to think about it.",
  },
  {
    id: "b76d122b-fe3c-4ded-ae85-630c46a6d2fd",
    category: "utilityRating",
    priority: 1,
    content:
      "Many flash and smoke spots are easy to learn, take the time to do so.",
  },
];
