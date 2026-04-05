import { Toaster } from "@/components/ui/sonner";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

import BottomNav from "./components/BottomNav";
import AdminScreen from "./screens/AdminScreen";
import ContactScreen from "./screens/ContactScreen";
import HomeScreen from "./screens/HomeScreen";
import MapScreen from "./screens/MapScreen";
import NamazScreen from "./screens/NamazScreen";
import NoticeScreen from "./screens/NoticeScreen";
import SettingsScreen from "./screens/SettingsScreen";

type Tab =
  | "home"
  | "namaz"
  | "notice"
  | "contact"
  | "map"
  | "admin"
  | "settings";
type Language = "en" | "hi" | "ur";

export default function App() {
  const [currentTab, setCurrentTab] = useState<Tab>("home");
  const [isAdmin, setIsAdmin] = useState(false);
  const [language, setLanguage] = useState<Language>("en");

  const handleNavigate = (tab: string) => {
    setCurrentTab(tab as Tab);
  };

  const renderScreen = () => {
    switch (currentTab) {
      case "home":
        return <HomeScreen onNavigate={handleNavigate} />;
      case "namaz":
        return <NamazScreen />;
      case "notice":
        return <NoticeScreen />;
      case "contact":
        return <ContactScreen />;
      case "map":
        return <MapScreen />;
      case "admin":
        return (
          <AdminScreen
            isAdmin={isAdmin}
            onLogin={() => setIsAdmin(true)}
            onLogout={() => setIsAdmin(false)}
          />
        );
      case "settings":
        return (
          <SettingsScreen language={language} onLanguageChange={setLanguage} />
        );
      default:
        return <HomeScreen onNavigate={handleNavigate} />;
    }
  };

  return (
    <>
      {/* Desktop centering wrapper with phone-frame feel */}
      <div
        className="min-h-screen flex items-start justify-center"
        style={{ background: "oklch(0.88 0.04 155)" }}
      >
        <div className="phone-frame w-full relative overflow-x-hidden">
          <AnimatePresence mode="wait">
            <motion.main
              key={currentTab}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.2 }}
              className="min-h-dvh overflow-y-auto hide-scrollbar"
            >
              {renderScreen()}
            </motion.main>
          </AnimatePresence>

          <BottomNav activeTab={currentTab} onTabChange={setCurrentTab} />
        </div>
      </div>

      <Toaster position="top-center" />

      {/* Footer */}
      <footer
        className="fixed bottom-0 left-0 right-0 text-center text-xs py-1 text-white/60"
        style={{ zIndex: -1 }}
      >
        &copy; {new Date().getFullYear()} Built with ❤️ using{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
          className="underline hover:text-white/80"
          target="_blank"
          rel="noopener noreferrer"
        >
          caffeine.ai
        </a>
      </footer>
    </>
  );
}
