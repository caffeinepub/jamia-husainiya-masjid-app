import { Skeleton } from "@/components/ui/skeleton";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { motion } from "motion/react";
import { useContactInfo } from "../hooks/useQueries";

export default function ContactScreen() {
  const { data: contact, isLoading } = useContactInfo();

  const phone = contact?.phone || "9837600353";
  const whatsapp = contact?.whatsapp || "9837600353";
  const address = contact?.address || "Margoobpur Mustufabad, UP, India";

  return (
    <div className="pb-24 hide-scrollbar">
      {/* Header */}
      <div className="bg-green-deep px-4 py-5 text-center">
        <h1 className="text-white font-bold text-xl">Contact Us</h1>
        <p className="text-white/80 text-base" dir="rtl">
          رابطہ کریں
        </p>
      </div>

      <div className="px-4 mt-4 space-y-4">
        {/* Mosque Info */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-card rounded-2xl p-4 shadow-card"
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-mint rounded-xl flex items-center justify-center flex-shrink-0">
              <MapPin className="w-5 h-5 text-green-deep" />
            </div>
            <div>
              <h3 className="text-foreground font-bold text-base">
                Jamia Husainiya Masjid
              </h3>
              <p className="text-foreground font-medium text-sm" dir="rtl">
                جامعہ حسینیہ مسجد مرغوبپور مصطفی آباد
              </p>
              {isLoading ? (
                <Skeleton className="h-4 w-48 mt-2" />
              ) : (
                <p className="text-muted-foreground text-sm mt-1">{address}</p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="grid grid-cols-2 gap-3"
        >
          {isLoading ? (
            <>
              <Skeleton className="h-14 rounded-2xl" />
              <Skeleton className="h-14 rounded-2xl" />
            </>
          ) : (
            <>
              <a
                data-ocid="contact.call.button"
                href={`tel:${phone}`}
                className="bg-green-deep text-white rounded-2xl p-4 flex items-center justify-center gap-2 font-bold text-base hover:opacity-90 active:scale-95 transition-all"
              >
                <Phone className="w-5 h-5" />
                Call
              </a>
              <a
                data-ocid="contact.whatsapp.button"
                href={`https://wa.me/91${whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-emerald-600 text-white rounded-2xl p-4 flex items-center justify-center gap-2 font-bold text-base hover:opacity-90 active:scale-95 transition-all"
              >
                <MessageCircle className="w-5 h-5" />
                WhatsApp
              </a>
            </>
          )}
        </motion.div>

        {/* Contact Details */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="bg-card rounded-2xl p-4 shadow-card space-y-4"
        >
          <h3 className="text-foreground font-bold text-base">
            Contact Details
          </h3>

          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-10 rounded-xl" />
              <Skeleton className="h-10 rounded-xl" />
              <Skeleton className="h-10 rounded-xl" />
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-mint rounded-xl flex items-center justify-center flex-shrink-0">
                  <Phone className="w-4 h-4 text-green-deep" />
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Phone</p>
                  <p className="text-foreground font-semibold text-sm">
                    {phone}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-mint rounded-xl flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="w-4 h-4 text-green-deep" />
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">WhatsApp</p>
                  <p className="text-foreground font-semibold text-sm">
                    {whatsapp}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-mint rounded-xl flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-4 h-4 text-green-deep" />
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Address</p>
                  <p className="text-foreground font-semibold text-sm">
                    {address}
                  </p>
                </div>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}
