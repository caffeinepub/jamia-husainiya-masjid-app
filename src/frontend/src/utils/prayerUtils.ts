import type { PrayerTimes } from "../backend.d.ts";

export interface PrayerEntry {
  key: keyof PrayerTimes;
  nameEn: string;
  nameUr: string;
  time: string;
}

export function getPrayerEntries(times: PrayerTimes): PrayerEntry[] {
  return [
    { key: "fajr", nameEn: "Fajr", nameUr: "فجر", time: times.fajr },
    { key: "zohar", nameEn: "Zohar", nameUr: "ظہر", time: times.zohar },
    { key: "asr", nameEn: "Asr", nameUr: "عصر", time: times.asr },
    { key: "maghrib", nameEn: "Maghrib", nameUr: "مغرب", time: times.maghrib },
    { key: "isha", nameEn: "Isha", nameUr: "عشاء", time: times.isha },
    {
      key: "juma_khutba",
      nameEn: "Juma Khutba",
      nameUr: "جمعہ خطبہ",
      time: times.juma_khutba,
    },
  ];
}

// Parse time string like "5:41 AM" or "14:30" to minutes since midnight
function parseTimeToMinutes(timeStr: string): number {
  if (!timeStr) return 0;
  const cleaned = timeStr.trim().toUpperCase();
  const isPM = cleaned.includes("PM");
  const isAM = cleaned.includes("AM");
  const numPart = cleaned.replace(/(AM|PM)/g, "").trim();
  const [hourStr, minStr] = numPart.split(":");
  let hours = Number.parseInt(hourStr, 10) || 0;
  const minutes = Number.parseInt(minStr, 10) || 0;

  if (isPM && hours !== 12) hours += 12;
  if (isAM && hours === 12) hours = 0;

  return hours * 60 + minutes;
}

export function getNextPrayer(times: PrayerTimes): PrayerEntry | null {
  const entries = getPrayerEntries(times);
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  // Filter out juma_khutba for daily next prayer logic
  const dailyPrayers = entries.filter((e) => e.key !== "juma_khutba");

  for (const entry of dailyPrayers) {
    const prayerMinutes = parseTimeToMinutes(entry.time);
    if (prayerMinutes > currentMinutes) {
      return entry;
    }
  }

  // Wrap around to Fajr next day
  return dailyPrayers[0] || null;
}
