import {
  Bell,
  Home,
  MapPin,
  Moon,
  Phone,
  Settings,
  Shield,
} from "lucide-react";

type Tab =
  | "home"
  | "namaz"
  | "notice"
  | "contact"
  | "map"
  | "admin"
  | "settings";

interface NavItem {
  id: Tab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
  { id: "home", label: "Home", icon: Home },
  { id: "namaz", label: "Namaz", icon: Moon },
  { id: "notice", label: "Notice", icon: Bell },
  { id: "contact", label: "Contact", icon: Phone },
  { id: "map", label: "Map", icon: MapPin },
  { id: "admin", label: "Admin", icon: Shield },
  { id: "settings", label: "Settings", icon: Settings },
];

interface BottomNavProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

export default function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <nav
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white border-t border-border z-50"
      style={{ boxShadow: "0 -2px 12px rgba(15, 77, 58, 0.08)" }}
    >
      <div className="flex justify-around items-center px-1 py-2">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              type="button"
              key={item.id}
              data-ocid={`nav.${item.id}.link`}
              onClick={() => onTabChange(item.id)}
              className={`flex flex-col items-center gap-0.5 flex-1 py-1 px-0.5 rounded-xl transition-colors ${
                isActive
                  ? "text-green-deep"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <item.icon
                className={`w-5 h-5 transition-transform ${
                  isActive ? "scale-110" : ""
                }`}
              />
              <span
                className={`text-[10px] font-medium ${
                  isActive ? "font-bold" : ""
                }`}
              >
                {item.label}
              </span>
              {isActive && (
                <span className="w-4 h-0.5 rounded-full bg-green-deep mt-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
