import { Skeleton } from "@/components/ui/skeleton";
import { Bell } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useAnnouncements } from "../hooks/useQueries";

export default function NoticeScreen() {
  const { data: announcements, isLoading } = useAnnouncements();
  const skeletonKeys = ["sk1", "sk2", "sk3", "sk4"];

  return (
    <div className="pb-24 hide-scrollbar">
      {/* Header */}
      <div className="bg-green-deep px-4 py-5 text-center">
        <h1 className="text-white font-bold text-xl">Announcements</h1>
        <p className="text-white/80 text-base" dir="rtl">
          اعلانات
        </p>
      </div>

      <div className="px-4 mt-4">
        {isLoading ? (
          <div className="space-y-3">
            {skeletonKeys.map((key) => (
              <Skeleton key={key} className="h-28 rounded-2xl" />
            ))}
          </div>
        ) : !announcements || announcements.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            data-ocid="notice.empty_state"
            className="bg-card rounded-2xl p-10 text-center shadow-card mt-8"
          >
            <Bell className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-foreground font-semibold text-base">
              No Announcements
            </p>
            <p className="text-muted-foreground text-sm mt-1">
              Check back later for updates
            </p>
          </motion.div>
        ) : (
          <AnimatePresence>
            <div className="space-y-3">
              {announcements.map((ann, idx) => (
                <motion.div
                  key={String(ann.id)}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: idx * 0.05 }}
                  data-ocid={`notice.announcement.item.${idx + 1}`}
                  className="bg-card rounded-2xl p-4 shadow-card"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="text-foreground font-bold text-base flex-1">
                      {ann.title}
                    </h3>
                    <span className="bg-mint text-green-deep text-xs font-semibold rounded-full px-3 py-1 whitespace-nowrap">
                      {ann.date}
                    </span>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {ann.body}
                  </p>
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
