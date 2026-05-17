import { access, mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";

const EMPTY_STORE = JSON.stringify({ books: [] }, null, 2) + "\n";

export function getDataPath(): string {
  return process.env.DATA_PATH ?? join(process.cwd(), "data", "books.json");
}

/** Ensure the data file exists (seed from repo default on first run). */
export async function ensureDataStore(): Promise<void> {
  const dataPath = getDataPath();
  await mkdir(dirname(dataPath), { recursive: true });

  try {
    await access(dataPath);
    return;
  } catch {
    // File missing — seed below.
  }

  const bundledSeed = join(process.cwd(), "data", "books.json");
  try {
    const seed = await readFile(bundledSeed, "utf-8");
    await writeFile(dataPath, seed, "utf-8");
    console.log(`Initialized data store at ${dataPath} from bundled seed.`);
  } catch {
    await writeFile(dataPath, EMPTY_STORE, "utf-8");
    console.log(`Initialized empty data store at ${dataPath}.`);
  }
}
