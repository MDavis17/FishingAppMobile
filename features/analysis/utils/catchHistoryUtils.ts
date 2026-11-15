import { format, parseISO } from "date-fns";
import { SpeciesCatchHistory, SpeciesCatchHistoryItem } from "types";

export function formatCatchLength(
  length: number | null | undefined,
  lengthUnit: string,
): string {
  if (length == null) {
    return "—";
  }
  const formatted = Number.isInteger(length)
    ? String(length)
    : length.toFixed(1);
  return `${formatted} ${lengthUnit}`;
}

export function formatCatchDate(iso: string): string {
  return format(parseISO(iso), "MMM d, yyyy");
}

export type CatchHistoryYearFilter = "all" | "thisYear" | "lastYear";

export type CatchHistorySort = "newest" | "oldest" | "longest";

export function yearFilterCounts(catches: SpeciesCatchHistoryItem[]): {
  all: number;
  thisYear: number;
  lastYear: number;
} {
  const now = new Date();
  const thisYear = now.getFullYear();
  const lastYear = thisYear - 1;

  let thisYearCount = 0;
  let lastYearCount = 0;

  for (const item of catches) {
    const year = parseISO(item.dateTime).getFullYear();
    if (year === thisYear) {
      thisYearCount += 1;
    } else if (year === lastYear) {
      lastYearCount += 1;
    }
  }

  return {
    all: catches.length,
    thisYear: thisYearCount,
    lastYear: lastYearCount,
  };
}

export function filterCatchesByYear(
  catches: SpeciesCatchHistoryItem[],
  filter: CatchHistoryYearFilter,
): SpeciesCatchHistoryItem[] {
  if (filter === "all") {
    return catches;
  }

  const now = new Date();
  const targetYear =
    filter === "thisYear" ? now.getFullYear() : now.getFullYear() - 1;

  return catches.filter(
    (item) => parseISO(item.dateTime).getFullYear() === targetYear,
  );
}

export function sortCatches(
  catches: SpeciesCatchHistoryItem[],
  sort: CatchHistorySort,
): SpeciesCatchHistoryItem[] {
  const copy = [...catches];

  switch (sort) {
    case "newest":
      return copy.sort(
        (a, b) =>
          parseISO(b.dateTime).getTime() - parseISO(a.dateTime).getTime(),
      );
    case "oldest":
      return copy.sort(
        (a, b) =>
          parseISO(a.dateTime).getTime() - parseISO(b.dateTime).getTime(),
      );
    case "longest":
      return copy.sort((a, b) => {
        const aLen = a.length ?? -1;
        const bLen = b.length ?? -1;
        if (bLen !== aLen) {
          return bLen - aLen;
        }
        return parseISO(b.dateTime).getTime() - parseISO(a.dateTime).getTime();
      });
    default:
      return copy;
  }
}

export function catchHistoryStatsInput(
  history: SpeciesCatchHistory | null,
  lengthUnit: string,
) {
  return {
    totalCatches: history?.totalCatches ?? 0,
    personalBest: history?.personalBest ?? null,
    mostRecentCatch: history?.mostRecentCatch ?? null,
    lengthUnit,
  };
}
