import { MongoClient, type Db } from "mongodb";

const URI =
  process.env.MONGO_URI ||
  process.env.MONGO_URL ||
  process.env.MONGODB_URI ||
  "";
const DB_NAME = process.env.MONGO_DB || process.env.MONGODB_DB || "mtd";

type Cache = {
  client?: MongoClient;
  db?: Db;
  promise?: Promise<{ client: MongoClient; db: Db }>;
};

const g = globalThis as unknown as { _mtdMongo?: Cache };
if (!g._mtdMongo) g._mtdMongo = {};
const cache = g._mtdMongo;

async function build() {
  if (!URI) {
    throw new Error("[mtd/mongo] MONGO_URI not set — add it to .env.local");
  }
  const client = new MongoClient(URI, {
    serverSelectionTimeoutMS: 2000,
    maxPoolSize: 5,
  });
  await client.connect();
  const db = client.db(DB_NAME);
  return { client, db };
}

export async function getDb(): Promise<Db> {
  if (cache.db) return cache.db;
  if (!cache.promise) {
    cache.promise = build().then((r) => {
      cache.client = r.client;
      cache.db = r.db;
      return r;
    });
  }
  const { db } = await cache.promise;
  return db;
}

export async function tryGetDb(): Promise<Db | null> {
  try {
    return await getDb();
  } catch (err) {
    console.warn("[mtd/mongo] unreachable:", (err as Error)?.message);
    return null;
  }
}

export function getDbName(): string {
  return DB_NAME;
}

export async function pingDb(): Promise<number | null> {
  try {
    const db = await getDb();
    const t0 = Date.now();
    await db.command({ ping: 1 });
    return Date.now() - t0;
  } catch {
    return null;
  }
}
