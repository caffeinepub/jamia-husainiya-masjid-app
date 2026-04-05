import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "motion/react";
import { usePrayerTimes } from "../hooks/useQueries";
import { getNextPrayer, getPrayerEntries } from "../utils/prayerUtils";

export default function NamazScreen() {
  const { data: prayerTimes, isLoading } = usePrayerTimes();
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const entries = prayerTimes ? getPrayerEntries(prayerTimes) : [];
  const nextPrayer = prayerTimes ? getNextPrayer(prayerTimes) : null;

  const skeletonKeys = ["s1", "s2", "s3", "s4", "s5", "s6"];

  return (
    <div className="pb-24 hide-scrollbar">
      {/* Header */}
      <div className="bg-green-deep px-4 py-5 text-center">
        <h1 className="text-white font-bold text-xl">Namaz Timings</h1>
        <p className="text-white/80 text-base" dir="rtl">
          نماز کے اوقات
        </p>
        <p className="text-white/60 text-sm mt-2">{today}</p>
        <span className="inline-block bg-gold text-foreground text-xs font-semibold rounded-full px-3 py-0.5 mt-2">
          Today
        </span>
      </div>

      <div className="px-4 mt-4 space-y-4">
        {/* Next Prayer Highlight */}
        {isLoading ? (
          <Skeleton className="h-24 rounded-2xl" />
        ) : nextPrayer ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            data-ocid="namaz.next_prayer.card"
            className="bg-green-deep rounded-2xl p-5 border-2 border-gold"
          >
            <p className="text-white/70 text-xs font-semibold uppercase tracking-widest mb-1">
              Next Prayer
            </p>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-bold text-2xl">
                  {nextPrayer.nameEn}
                </p>
                <p className="text-white/80 text-lg" dir="rtl">
                  {nextPrayer.nameUr}
                </p>
              </div>
              <p className="text-gold font-bold text-3xl">{nextPrayer.time}</p>
            </div>
          </motion.div>
        ) : null}

        {/* Prayer Grid */}
        <div>
          <h3 className="text-foreground font-bold text-sm uppercase tracking-wider mb-3 text-muted-foreground">
            All Prayer Times
          </h3>
          {isLoading ? (
            <div className="grid grid-cols-2 gap-3">
              {skeletonKeys.map((key) => (
                <Skeleton key={key} className="h-28 rounded-2xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {entries.map((entry, idx) => {
                const isNext = nextPrayer?.key === entry.key;
                return (
                  <motion.div
                    key={entry.key}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, delay: idx * 0.05 }}
                    data-ocid={`namaz.prayer.item.${idx + 1}`}
                    className={`rounded-2xl p-4 text-center shadow-card ${
                      isNext ? "bg-green-deep border-2 border-gold" : "bg-mint"
                    }`}
                  >
                    {isNext && (
                      <span className="inline-block bg-gold text-foreground text-xs font-bold rounded-full px-2 py-0.5 mb-2">
                        Next
                      </span>
                    )}
                    <p
                      className={`font-bold text-base ${
                        isNext ? "text-white" : "text-green-deep"
                      }`}
                    >
                      {entry.nameEn}
                    </p>
                    <p
                      className={`text-sm mb-1 ${
                        isNext ? "text-white/80" : "text-muted-foreground"
                      }`}
                      dir="rtl"
                    >
                      {entry.nameUr}
                    </p>
                    <p
                      className={`font-bold text-2xl ${
                        isNext ? "text-gold" : "text-foreground"
                      }`}
                    >
                      {entry.time}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
