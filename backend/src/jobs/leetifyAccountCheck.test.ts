import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { runLeetifyAccountCheck } from "./leetifyAccountCheck";
import { findUsersWithSteam } from "../repositories/user.repository";
import { deleteReportsByUser } from "../repositories/report.repository";
import { checkLeetifyProfileExists } from "../lib/leetify";
import type { LeetifyProfileStatus } from "../lib/leetify";

vi.mock("../repositories/user.repository", () => ({
  findUsersWithSteam: vi.fn(),
}));

vi.mock("../repositories/report.repository", () => ({
  deleteReportsByUser: vi.fn(),
}));

vi.mock("../lib/leetify", () => ({
  checkLeetifyProfileExists: vi.fn(),
}));

const findUsers = vi.mocked(findUsersWithSteam);
const deleteReports = vi.mocked(deleteReportsByUser);
const checkProfile = vi.mocked(checkLeetifyProfileExists);

function givenUsers(...users: { id: string; steam64Id: string | null }[]) {
  findUsers.mockResolvedValue(users);
}

function givenStatus(status: LeetifyProfileStatus) {
  checkProfile.mockResolvedValue(status);
}

function givenStatusPerSteamId(statuses: Record<string, LeetifyProfileStatus>) {
  checkProfile.mockImplementation(async (steam64Id) => {
    const status = statuses[steam64Id];
    if (!status) throw new Error(`No status configured for ${steam64Id}`);
    return status;
  });
}

beforeEach(() => {
  vi.clearAllMocks();
  deleteReports.mockResolvedValue({ count: 0 });
  vi.spyOn(console, "log").mockImplementation(() => {});
  vi.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("runLeetifyAccountCheck", () => {
  describe("when the source account is gone", () => {
    it("deletes the stats of that user", async () => {
      givenUsers({ id: "user-1", steam64Id: "76561198000000001" });
      givenStatus("gone");

      await runLeetifyAccountCheck();

      expect(deleteReports).toHaveBeenCalledTimes(1);
      expect(deleteReports).toHaveBeenCalledWith("user-1");
    });

    it("counts the user as purged", async () => {
      givenUsers({ id: "user-1", steam64Id: "76561198000000001" });
      givenStatus("gone");

      const result = await runLeetifyAccountCheck();

      expect(result).toEqual({ checked: 1, purged: 1, skipped: 0 });
    });
  });

  describe("when the answer is uncertain", () => {
    it("deletes nothing", async () => {
      givenUsers({ id: "user-1", steam64Id: "76561198000000001" });
      givenStatus("unknown");

      await runLeetifyAccountCheck();

      expect(deleteReports).not.toHaveBeenCalled();
    });

    it("counts the user as skipped and not as purged", async () => {
      givenUsers({ id: "user-1", steam64Id: "76561198000000001" });
      givenStatus("unknown");

      const result = await runLeetifyAccountCheck();

      expect(result).toEqual({ checked: 1, purged: 0, skipped: 1 });
    });
  });

  describe("when the source account still exists", () => {
    it("deletes nothing", async () => {
      givenUsers({ id: "user-1", steam64Id: "76561198000000001" });
      givenStatus("exists");

      await runLeetifyAccountCheck();

      expect(deleteReports).not.toHaveBeenCalled();
    });

    it("counts the user as checked only", async () => {
      givenUsers({ id: "user-1", steam64Id: "76561198000000001" });
      givenStatus("exists");

      const result = await runLeetifyAccountCheck();

      expect(result).toEqual({ checked: 1, purged: 0, skipped: 0 });
    });
  });

  describe("users without a linked account", () => {
    it("is never asked about a user with no steam id", async () => {
      givenUsers({ id: "user-1", steam64Id: null });

      await runLeetifyAccountCheck();

      expect(checkProfile).not.toHaveBeenCalled();
      expect(deleteReports).not.toHaveBeenCalled();
    });

    it("keeps going for the other users", async () => {
      givenUsers(
        { id: "user-1", steam64Id: null },
        { id: "user-2", steam64Id: "76561198000000002" },
      );
      givenStatus("gone");

      const result = await runLeetifyAccountCheck();

      expect(deleteReports).toHaveBeenCalledExactlyOnceWith("user-2");
      expect(result).toEqual({ checked: 1, purged: 1, skipped: 0 });
    });
  });

  describe("a batch of mixed answers", () => {
    it("purges only the users whose account is gone", async () => {
      givenUsers(
        { id: "gone-1", steam64Id: "76561198000000001" },
        { id: "alive-1", steam64Id: "76561198000000002" },
        { id: "unsure-1", steam64Id: "76561198000000003" },
        { id: "gone-2", steam64Id: "76561198000000004" },
      );
      givenStatusPerSteamId({
        "76561198000000001": "gone",
        "76561198000000002": "exists",
        "76561198000000003": "unknown",
        "76561198000000004": "gone",
      });

      const result = await runLeetifyAccountCheck();

      expect(deleteReports.mock.calls.map(([userId]) => userId)).toEqual([
        "gone-1",
        "gone-2",
      ]);
      expect(result).toEqual({ checked: 4, purged: 2, skipped: 1 });
    });
  });

  describe("resilience", () => {
    it("carries on when the deletion fails for one user", async () => {
      givenUsers(
        { id: "user-1", steam64Id: "76561198000000001" },
        { id: "user-2", steam64Id: "76561198000000002" },
      );
      givenStatus("gone");
      deleteReports
        .mockRejectedValueOnce(new Error("database unreachable"))
        .mockResolvedValueOnce({ count: 3 });

      const result = await runLeetifyAccountCheck();

      expect(deleteReports).toHaveBeenCalledTimes(2);
      expect(result).toEqual({ checked: 2, purged: 1, skipped: 0 });
    });

    it("deletes nothing at all when no user has a linked account", async () => {
      givenUsers();

      const result = await runLeetifyAccountCheck();

      expect(deleteReports).not.toHaveBeenCalled();
      expect(result).toEqual({ checked: 0, purged: 0, skipped: 0 });
    });
  });
});
