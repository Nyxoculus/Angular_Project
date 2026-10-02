/// <reference lib="webworker" />

interface LogEntry {
  id: number;
  timestamp: string;
  type: string;
  user: string;
  message: string;
  severity: string;
}

interface LogStats {
  total: number;
  errors: number;
  warnings: number;
  topUser: string | null;
  perDay: Record<string, number>;
}

let entries: LogEntry[] = [];

addEventListener('message', ({ data }) => {
  entries = (data ?? []) as LogEntry[];

  let errors = 0;
  let warnings = 0;
  const userCounts = new Map<string, number>();
  const perDayMap = new Map<string, number>();

  for (const entry of entries) {
    if (entry.severity === 'error') {
      errors++;
    } else if (entry.severity === 'warning') {
      warnings++;
    }
    userCounts.set(entry.user, (userCounts.get(entry.user) ?? 0) + 1);
    const day = (entry.timestamp ?? '').slice(0, 10);
    if (day) {
      perDayMap.set(day, (perDayMap.get(day) ?? 0) + 1);
    }
  }

  let topUser: string | null = null;
  let max = -1;
  for (const [user, count] of userCounts) {
    if (count > max) {
      max = count;
      topUser = user;
    }
  }

  const perDay: Record<string, number> = {};
  [...perDayMap.keys()].sort().forEach((key) => {
    perDay[key] = perDayMap.get(key)!;
  });

  const stats: LogStats = {
    total: entries.length,
    errors,
    warnings,
    topUser,
    perDay,
  };

  postMessage(stats);
});
