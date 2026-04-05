import { Code, Globe, Info, Mail, Phone } from "lucide-react";
import { motion } from "motion/react";

type Language = "en" | "hi" | "ur";

interface SettingsScreenProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
}

export default function SettingsScreen({
  language,
  onLanguageChange,
}: SettingsScreenProps) {
  const languages: Array<{ code: Language; label: string; native: string }> = [
    { code: "en", label: "English", native: "English" },
    { code: "hi", label: "Hindi", native: "हिंदी" },
    { code: "ur", label: "Urdu", native: "اردو" },
  ];

  return (
    <div className="pb-24 hide-scrollbar">
      {/* Header */}
      <div className="bg-green-deep px-4 py-5 text-center">
        <h1 className="text-white font-bold text-xl">Settings</h1>
        <p className="text-white/80 text-base" dir="rtl">
          ترتیبات
        </p>
      </div>

      <div className="px-4 mt-4 space-y-4">
        {/* Language */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-card rounded-2xl p-4 shadow-card"
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-mint rounded-lg flex items-center justify-center">
              <Globe className="w-4 h-4 text-green-deep" />
            </div>
            <h3 className="text-foreground font-bold text-base">
              Language / زبان
            </h3>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {languages.map((lang) => (
              <button
                type="button"
                key={lang.code}
                data-ocid={`settings.language_${lang.code}.button`}
                onClick={() => onLanguageChange(lang.code)}
                className={`rounded-xl p-3 text-center transition-all ${
                  language === lang.code
                    ? "bg-green-deep text-white font-bold shadow-md"
                    : "bg-mint text-foreground hover:bg-secondary"
                }`}
              >
                <p className="text-sm font-semibold">{lang.native}</p>
                {language !== lang.code && (
                  <p className="text-xs text-muted-foreground">{lang.label}</p>
                )}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Developer Info */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-card rounded-2xl p-4 shadow-card"
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-mint rounded-lg flex items-center justify-center">
              <Code className="w-4 h-4 text-green-deep" />
            </div>
            <h3 className="text-foreground font-bold text-base">
              Developer Info
            </h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-green-deep rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-sm">SQ</span>
              </div>
              <div>
                <p className="text-foreground font-bold text-sm">
                  Sameer Qureshi
                </p>
                <p className="text-muted-foreground text-xs">App Developer</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-mint rounded-lg flex items-center justify-center flex-shrink-0">
                <Mail className="w-4 h-4 text-green-deep" />
              </div>
              <p className="text-foreground text-sm">
                sammerqurashi67@gmail.com
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-mint rounded-lg flex items-center justify-center flex-shrink-0">
                <Phone className="w-4 h-4 text-green-deep" />
              </div>
              <p className="text-foreground text-sm">9837600353</p>
            </div>
          </div>
        </motion.div>

        {/* App Info */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.15 }}
          className="bg-card rounded-2xl p-4 shadow-card"
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 bg-mint rounded-lg flex items-center justify-center">
              <Info className="w-4 h-4 text-green-deep" />
            </div>
            <h3 className="text-foreground font-bold text-base">App Info</h3>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground text-sm">App Name</span>
              <span className="text-foreground font-semibold text-sm">
                Jamia Husainiya Masjid
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground text-sm">Version</span>
              <span className="text-foreground font-semibold text-sm">
                1.0.0
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground text-sm">Platform</span>
              <span className="text-foreground font-semibold text-sm">
                Web App
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
