import { useCallback, useEffect, useState } from "react";
import {
  addLeaderboardEntry,
  clearLeaderboard,
  getTopLeaderboardEntries,
  trimLeaderboard,
  type LeaderboardEntry,
} from "./leaderboard";

export const LEADERBOARD_LIMIT = 100;

export function useLeaderboard() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [lastRecordedId, setLastRecordedId] = useState<number | null>(null);

  const refresh = useCallback(() => {
    getTopLeaderboardEntries(LEADERBOARD_LIMIT)
      .then(setEntries)
      .catch((error) => console.error("Failed to load leaderboard", error));
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const qualifies = useCallback(
    (score: number) => {
      if (entries.length < LEADERBOARD_LIMIT) return true;
      return score > entries[entries.length - 1].score;
    },
    [entries],
  );

  const record = useCallback(
    async (entry: Omit<LeaderboardEntry, "id">) => {
      const id = await addLeaderboardEntry(entry);
      await trimLeaderboard(LEADERBOARD_LIMIT);
      setLastRecordedId(id);
      refresh();
    },
    [refresh],
  );

  const clear = useCallback(async () => {
    await clearLeaderboard();
    setLastRecordedId(null);
    refresh();
  }, [refresh]);

  return { entries, lastRecordedId, qualifies, record, clear };
}
