/** Validation utilities — applied at every data boundary before reaching the UI */

export function safeNum(v: unknown, fallback = 0): number {
  const n = Number(v);
  if (!isFinite(n) || isNaN(n)) return fallback;
  return n;
}

export function clampScore(v: number): number {
  return Math.max(0, Math.min(100, Math.round(safeNum(v))));
}

export function safePositive(v: unknown, fallback = 0): number {
  const n = safeNum(v, fallback);
  return n < 0 ? fallback : n;
}

export function dedupeStrings(arr: unknown[]): string[] {
  if (!Array.isArray(arr)) return [];
  const seen = new Set<string>();
  return arr
    .map(s => (typeof s === 'string' ? s.trim() : ''))
    .filter(s => s.length > 0 && !seen.has(s) && seen.add(s));
}

export function validateSalary(
  entry: number,
  mid: number,
  senior: number
): { entry: number; mid: number; senior: number } {
  const e = safePositive(entry, 1);
  const m = Math.max(safePositive(mid, e), e);
  const s = Math.max(safePositive(senior, m), m);
  return { entry: e, mid: m, senior: s };
}

export function validateChartArray(data: Record<string, unknown>[]): Record<string, unknown>[] {
  if (!Array.isArray(data)) return [];
  return data.map(row => {
    const clean: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(row)) {
      if (typeof v === 'number') {
        clean[k] = isFinite(v) && !isNaN(v) ? v : 0;
      } else {
        clean[k] = v;
      }
    }
    return clean;
  });
}

/** Build a 12-month search-count array from SQLite history records.
 *  Returns null if there are no history records (triggers empty state in UI). */
export function buildMonthlyChart(history: { created_at?: string }[]): number[] | null {
  if (!Array.isArray(history) || history.length === 0) return null;
  const counts = new Array(12).fill(0) as number[];
  history.forEach(h => {
    if (h.created_at) {
      const m = new Date(h.created_at).getMonth();
      if (m >= 0 && m < 12) counts[m]++;
    }
  });
  return counts;
}

/** Compute domain distribution from a history array of records with a domain field.
 *  Returns array of { domain, count, pct } sorted by count desc. */
export function buildDomainDistribution(
  history: { domain?: string }[]
): { domain: string; count: number; pct: number }[] {
  if (!Array.isArray(history) || history.length === 0) return [];
  const map = new Map<string, number>();
  history.forEach(h => {
    const d = h.domain || 'Unknown';
    map.set(d, (map.get(d) || 0) + 1);
  });
  const total = history.length;
  return Array.from(map.entries())
    .map(([domain, count]) => ({ domain, count, pct: Math.round((count / total) * 100) }))
    .sort((a, b) => b.count - a.count);
}

/** Compute average score from ATS reports. Returns 0 if no reports. */
export function avgAtsScore(reports: { score?: number }[]): number {
  if (!Array.isArray(reports) || reports.length === 0) return 0;
  const sum = reports.reduce((acc, r) => acc + safePositive(r.score), 0);
  return Math.round(sum / reports.length);
}
