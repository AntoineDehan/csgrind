import { MongoClient, type Db } from "mongodb";
import { env } from "../config/env";

const RETENTION_DAYS = 90;

let connection: Promise<Db> | null = null;

async function connect(url: string): Promise<Db> {
  const client = new MongoClient(url, { serverSelectionTimeoutMS: 3000 });
  await client.connect();

  const db = client.db(env.MONGO_DB);
  await db
    .collection("job_runs")
    .createIndex(
      { startedAt: 1 },
      { expireAfterSeconds: RETENTION_DAYS * 24 * 60 * 60 },
    );

  return db;
}

export async function getLogDb(): Promise<Db | null> {
  const url = env.MONGO_URL;
  if (!url) return null;

  if (!connection) {
    connection = connect(url).catch((error) => {
      connection = null;
      throw error;
    });
  }

  return connection;
}
