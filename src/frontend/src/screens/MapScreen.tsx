import { ExternalLink, MapPin } from "lucide-react";
import { motion } from "motion/react";

export default function MapScreen() {
  const mapsQuery = "Margoobpur+Mustufabad+UP+India";
  const embedUrl = `https://maps.google.com/maps?q=${mapsQuery}&output=embed`;
  const openUrl = `https://maps.google.com/maps?q=${mapsQuery}`;

  return (
    <div className="pb-24 hide-scrollbar">
      {/* Header */}
      <div className="bg-green-deep px-4 py-5 text-center">
        <h1 className="text-white font-bold text-xl">Location</h1>
        <p className="text-white/80 text-base" dir="rtl">
          مقام
        </p>
      </div>

      <div className="px-4 mt-4 space-y-4">
        {/* Map */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-card rounded-2xl overflow-hidden shadow-card"
          style={{ height: "300px" }}
        >
          <iframe
            title="Mosque Location"
            src={embedUrl}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </motion.div>

        {/* Open in Maps Button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <a
            data-ocid="map.open_maps.button"
            href={openUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green-deep text-white rounded-2xl p-4 flex items-center justify-center gap-2 font-bold text-base hover:opacity-90 active:scale-95 transition-all w-full"
          >
            <ExternalLink className="w-5 h-5" />
            Open in Google Maps
          </a>
        </motion.div>

        {/* Address Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.15 }}
          className="bg-card rounded-2xl p-4 shadow-card"
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-mint rounded-xl flex items-center justify-center flex-shrink-0">
              <MapPin className="w-5 h-5 text-green-deep" />
            </div>
            <div>
              <h3 className="text-foreground font-bold text-base">
                Masjid Address
              </h3>
              <p className="text-muted-foreground text-sm mt-1">
                Jamia Husainiya Masjid, Margoobpur Mustufabad, Uttar Pradesh,
                India
              </p>
              <p className="text-foreground text-sm mt-1" dir="rtl">
                جامعہ حسینیہ مسجد، مرغوبپور مصطفی آباد، اتر پردیش، ہندوستان
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
