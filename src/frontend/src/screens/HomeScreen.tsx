import { Skeleton } from "@/components/ui/skeleton";
import { Bell, ChevronRight, Clock } from "lucide-react";
import { motion } from "motion/react";
import type { Announcement } from "../backend.d.ts";
import { useAnnouncements, usePrayerTimes } from "../hooks/useQueries";
import { getNextPrayer } from "../utils/prayerUtils";

interface HomeScreenProps {
  onNavigate: (tab: string) => void;
}

export default function HomeScreen({ onNavigate }: HomeScreenProps) {
  const { data: prayerTimes, isLoading: prayerLoading } = usePrayerTimes();
  const { data: announcements, isLoading: announcementsLoading } =
    useAnnouncements();

  const nextPrayer = prayerTimes ? getNextPrayer(prayerTimes) : null;
  const latestAnnouncements: Announcement[] = (announcements || []).slice(0, 2);

  return (
    <div className="pb-24 hide-scrollbar">
      {/* Header */}
      <div className="bg-green-deep px-4 py-5 text-center">
        <p className="text-white/70 text-xs font-medium tracking-wider uppercase mb-1">
          بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ
        </p>
        <h1 className="text-white font-bold text-lg leading-tight">
          Jamia Husainiya Masjid
        </h1>
        <h2 className="text-white font-bold text-base leading-tight" dir="rtl">
          جامعہ حسینیہ مسجد مرغوبپور مصطفی آباد
        </h2>
        <p className="text-white/60 text-xs mt-1">Margoobpur Mustufabad</p>
      </div>

      {/* Banner */}
      <div className="relative w-full" style={{ height: "200px" }}>
        <img
          src="/assets/generated/mosque-banner.dim_800x400.jpg"
          alt="Jamia Husainiya Masjid"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/50" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="border-2 border-gold rounded-2xl px-6 py-4 text-center"
            style={{ background: "rgba(15, 77, 58, 0.82)" }}
          >
            <p
              className="text-white font-bold text-3xl leading-tight"
              dir="rtl"
            >
              السلام عليكم
            </p>
            <p className="text-white/90 text-base font-medium mt-1">
              Assalamu Alaikum
            </p>
          </div>
        </div>
      </div>

      <div className="px-4 mt-4 space-y-4">
        {/* Welcome description */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-card rounded-2xl p-4 shadow-card"
        >
          <p className="text-muted-foreground text-sm leading-relaxed">
            Jamia Husainiya Masjid is a community mosque dedicated to worship,
            education and unity. Located in Margoobpur Mustufabad, we welcome
            all Muslims to pray and learn together.
          </p>
        </motion.div>

        {/* Next Prayer */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <h3 className="text-foreground font-bold text-base mb-2 flex items-center gap-2">
            <Clock className="w-4 h-4 text-green-deep" />
            Next Prayer
          </h3>
          {prayerLoading ? (
            <Skeleton className="h-20 rounded-2xl" />
          ) : nextPrayer ? (
            <div
              data-ocid="home.next_prayer.card"
              className="bg-green-deep rounded-2xl p-4 border-2 border-gold flex items-center justify-between"
            >
              <div>
                <p className="text-white/70 text-xs font-medium uppercase tracking-wider">
                  Coming Up
                </p>
                <p className="text-white font-bold text-xl">
                  {nextPrayer.nameEn}
                </p>
                <p className="text-white/80 text-sm" dir="rtl">
                  {nextPrayer.nameUr}
                </p>
              </div>
              <div className="text-right">
                <p className="text-gold font-bold text-2xl">
                  {nextPrayer.time}
                </p>
              </div>
            </div>
          ) : null}
        </motion.div>

        {/* Latest Announcements */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-foreground font-bold text-base flex items-center gap-2">
              <Bell className="w-4 h-4 text-green-deep" />
              Announcements
            </h3>
            <button
              type="button"
              data-ocid="home.view_all.button"
              onClick={() => onNavigate("notice")}
              className="text-green-deep text-sm font-semibold flex items-center gap-1 hover:opacity-70 transition-opacity"
            >
              View All <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          {announcementsLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-20 rounded-2xl" />
              <Skeleton className="h-20 rounded-2xl" />
            </div>
          ) : latestAnnouncements.length > 0 ? (
            <div className="space-y-3">
              {latestAnnouncements.map((ann, idx) => (
                <div
                  key={String(ann.id)}
                  data-ocid={`home.announcement.item.${idx + 1}`}
                  className="bg-card rounded-2xl p-4 shadow-card"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-foreground font-semibold text-sm">
                      {ann.title}
                    </p>
                    <span className="text-muted-foreground text-xs whitespace-nowrap">
                      {ann.date}
                    </span>
                  </div>
                  <p className="text-muted-foreground text-sm mt-1 line-clamp-2">
                    {ann.body}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div
              data-ocid="home.announcements.empty_state"
              className="bg-card rounded-2xl p-6 text-center shadow-card"
            >
              <Bell className="w-8 h-8 text-muted-foreground/40 mx-auto mb-2" />
              <p className="text-muted-foreground text-sm">
                No announcements yet
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
