import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import type { Db } from "mongodb";
import { recordJobRun } from "./jobRun.repository";
import { getLogDb } from "../lib/mongo";

vi.mock("../lib/mongo", () => ({ getLogDb: vi.fn() }));

const getDb = vi.mocked(getLogDb);
const insertOne = vi.fn();
const collection = vi.fn();

const RUN = {
  job: "report-scheduler" as const,
  startedAt: new Date("2026-01-01T13:00:00.000Z"),
  result: { due: 12, succeeded: 11, failed: 1 },
};

beforeEach(() => {
  vi.clearAllMocks();
  insertOne.mockResolvedValue({ acknowledged: true });
  collection.mockReturnValue({ insertOne });
  getDb.mockResolvedValue({ collection } as unknown as Db);
  vi.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("recordJobRun", () => {
  it("writes the job name and its counters", async () => {
    await recordJobRun(RUN);

    expect(insertOne).toHaveBeenCalledWith(
      expect.objectContaining({
        job: "report-scheduler",
        result: { due: 12, succeeded: 11, failed: 1 },
      }),
    );
  });

  it("writes nothing when no journal is configured", async () => {
    getDb.mockResolvedValue(null);

    await recordJobRun(RUN);

    expect(insertOne).not.toHaveBeenCalled();
  });

  it("does not fail the job when the write fails", async () => {
    insertOne.mockRejectedValue(new Error("mongo unreachable"));

    await expect(recordJobRun(RUN)).resolves.toBeUndefined();
  });
});
