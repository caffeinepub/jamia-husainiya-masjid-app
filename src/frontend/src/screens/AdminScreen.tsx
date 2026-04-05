import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  Loader2,
  LogOut,
  Pencil,
  Plus,
  Save,
  Shield,
  Trash2,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type {
  Announcement,
  AnnouncementId,
  ContactInfo,
  PrayerTimes,
} from "../backend.d.ts";
import {
  useAddAnnouncement,
  useAdminLogin,
  useAnnouncements,
  useContactInfo,
  useDeleteAnnouncement,
  usePrayerTimes,
  useUpdateAnnouncement,
  useUpdateContactInfo,
  useUpdatePrayerTimes,
} from "../hooks/useQueries";

interface AdminScreenProps {
  isAdmin: boolean;
  onLogin: () => void;
  onLogout: () => void;
}

function LoginForm({ onLogin }: { onLogin: () => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const loginMutation = useAdminLogin();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const success = await loginMutation.mutateAsync({ username, password });
      if (success) {
        onLogin();
        toast.success("Welcome, Admin!");
      } else {
        setError("Invalid username or password");
      }
    } catch {
      setError("Login failed. Please try again.");
    }
  };

  return (
    <div className="px-4 mt-8">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="bg-card rounded-2xl p-6 shadow-card"
        data-ocid="admin.login.modal"
      >
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-mint rounded-full flex items-center justify-center mx-auto mb-3">
            <Shield className="w-8 h-8 text-green-deep" />
          </div>
          <h2 className="text-foreground font-bold text-xl">Admin Login</h2>
          <p className="text-muted-foreground text-sm mt-1">
            Sign in to manage the masjid
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label
              htmlFor="admin-username"
              className="text-foreground text-sm font-medium mb-1 block"
            >
              Username
            </label>
            <Input
              id="admin-username"
              data-ocid="admin.username.input"
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="rounded-xl"
            />
          </div>
          <div>
            <label
              htmlFor="admin-password"
              className="text-foreground text-sm font-medium mb-1 block"
            >
              Password
            </label>
            <Input
              id="admin-password"
              data-ocid="admin.password.input"
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="rounded-xl"
            />
          </div>
          {error && (
            <p
              data-ocid="admin.login.error_state"
              className="text-destructive text-sm text-center"
            >
              {error}
            </p>
          )}
          <Button
            data-ocid="admin.login.submit_button"
            type="submit"
            className="w-full bg-green-deep text-white rounded-xl font-bold"
            disabled={loginMutation.isPending || loginMutation.isActorLoading}
          >
            {loginMutation.isActorLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Connecting...
              </>
            ) : loginMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Signing In...
              </>
            ) : (
              "Login"
            )}
          </Button>
        </form>
      </motion.div>
    </div>
  );
}

function PrayerTimesEditor() {
  const { data: prayerTimes, isLoading } = usePrayerTimes();
  const updateMutation = useUpdatePrayerTimes();
  const [localTimes, setLocalTimes] = useState<PrayerTimes | null>(null);

  const times = localTimes ||
    prayerTimes || {
      fajr: "",
      zohar: "",
      asr: "",
      maghrib: "",
      isha: "",
      juma_khutba: "",
    };

  const fields: Array<{ key: keyof PrayerTimes; label: string; urdu: string }> =
    [
      { key: "fajr", label: "Fajr", urdu: "فجر" },
      { key: "zohar", label: "Zohar", urdu: "ظہر" },
      { key: "asr", label: "Asr", urdu: "عصر" },
      { key: "maghrib", label: "Maghrib", urdu: "مغرب" },
      { key: "isha", label: "Isha", urdu: "عشاء" },
      { key: "juma_khutba", label: "Juma Khutba", urdu: "جمعہ خطبہ" },
    ];

  const handleSave = async () => {
    try {
      await updateMutation.mutateAsync(times as PrayerTimes);
      toast.success("Prayer times updated!");
      setLocalTimes(null);
    } catch {
      toast.error("Failed to update prayer times");
    }
  };

  if (isLoading) return <Skeleton className="h-64 rounded-2xl" />;

  return (
    <div className="bg-card rounded-2xl p-4 shadow-card">
      <h3 className="text-foreground font-bold text-base mb-4">Prayer Times</h3>
      <div className="grid grid-cols-2 gap-3">
        {fields.map((field) => (
          <div key={field.key}>
            <label
              htmlFor={`prayer-${field.key}`}
              className="text-muted-foreground text-xs font-medium mb-1 block"
            >
              {field.label} <span dir="rtl">{field.urdu}</span>
            </label>
            <Input
              id={`prayer-${field.key}`}
              data-ocid={`admin.prayer_${field.key}.input`}
              placeholder="e.g. 5:41 AM"
              value={(times as PrayerTimes)[field.key] || ""}
              onChange={(e) =>
                setLocalTimes({
                  ...times,
                  [field.key]: e.target.value,
                } as PrayerTimes)
              }
              className="rounded-xl text-sm"
            />
          </div>
        ))}
      </div>
      <Button
        data-ocid="admin.prayer_times.save_button"
        onClick={handleSave}
        className="mt-4 w-full bg-green-deep text-white rounded-xl font-bold"
        disabled={updateMutation.isPending}
      >
        {updateMutation.isPending ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...
          </>
        ) : (
          <>
            <Save className="w-4 h-4 mr-2" /> Save Prayer Times
          </>
        )}
      </Button>
    </div>
  );
}

function AnnouncementsManager() {
  const { data: announcements, isLoading } = useAnnouncements();
  const addMutation = useAddAnnouncement();
  const updateMutation = useUpdateAnnouncement();
  const deleteMutation = useDeleteAnnouncement();

  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState<AnnouncementId | null>(null);
  const [form, setForm] = useState({ title: "", body: "", date: "" });
  const [editForm, setEditForm] = useState<{
    title: string;
    body: string;
    date: string;
  } | null>(null);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addMutation.mutateAsync(form);
      toast.success("Announcement added!");
      setForm({ title: "", body: "", date: "" });
      setShowAdd(false);
    } catch {
      toast.error("Failed to add announcement");
    }
  };

  const handleUpdate = async (id: AnnouncementId) => {
    if (!editForm) return;
    try {
      await updateMutation.mutateAsync({ id, ...editForm });
      toast.success("Announcement updated!");
      setEditingId(null);
      setEditForm(null);
    } catch {
      toast.error("Failed to update");
    }
  };

  const handleDelete = async (id: AnnouncementId) => {
    try {
      await deleteMutation.mutateAsync(id);
      toast.success("Announcement deleted!");
    } catch {
      toast.error("Failed to delete");
    }
  };

  const startEdit = (ann: Announcement) => {
    setEditingId(ann.id);
    setEditForm({ title: ann.title, body: ann.body, date: ann.date });
  };

  if (isLoading) return <Skeleton className="h-40 rounded-2xl" />;

  return (
    <div className="bg-card rounded-2xl p-4 shadow-card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-foreground font-bold text-base">Announcements</h3>
        <Button
          data-ocid="admin.add_announcement.button"
          type="button"
          onClick={() => setShowAdd(!showAdd)}
          size="sm"
          className="bg-green-deep text-white rounded-xl"
        >
          <Plus className="w-4 h-4 mr-1" />
          Add
        </Button>
      </div>

      <AnimatePresence>
        {showAdd && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleAdd}
            data-ocid="admin.add_announcement.modal"
            className="bg-mint rounded-xl p-3 mb-4 space-y-2 overflow-hidden"
          >
            <Input
              data-ocid="admin.announcement_title.input"
              placeholder="Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
              className="rounded-lg bg-white text-sm"
            />
            <Textarea
              data-ocid="admin.announcement_body.textarea"
              placeholder="Body text..."
              value={form.body}
              onChange={(e) => setForm({ ...form, body: e.target.value })}
              required
              className="rounded-lg bg-white text-sm min-h-[80px]"
            />
            <Input
              data-ocid="admin.announcement_date.input"
              placeholder="Date (e.g. 2026-04-05)"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              required
              className="rounded-lg bg-white text-sm"
            />
            <div className="flex gap-2">
              <Button
                data-ocid="admin.add_announcement.submit_button"
                type="submit"
                size="sm"
                className="bg-green-deep text-white rounded-xl flex-1"
                disabled={addMutation.isPending}
              >
                {addMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Add"
                )}
              </Button>
              <Button
                data-ocid="admin.add_announcement.cancel_button"
                type="button"
                size="sm"
                variant="outline"
                className="rounded-xl flex-1"
                onClick={() => setShowAdd(false)}
              >
                Cancel
              </Button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {!announcements || announcements.length === 0 ? (
        <p className="text-muted-foreground text-sm text-center py-4">
          No announcements yet
        </p>
      ) : (
        <div className="space-y-3">
          {announcements.map((ann, idx) => (
            <div
              key={String(ann.id)}
              data-ocid={`admin.announcement.item.${idx + 1}`}
              className="border border-border rounded-xl p-3"
            >
              {editingId === ann.id && editForm ? (
                <div className="space-y-2">
                  <Input
                    value={editForm.title}
                    onChange={(e) =>
                      setEditForm({ ...editForm, title: e.target.value })
                    }
                    className="rounded-lg text-sm"
                  />
                  <Textarea
                    value={editForm.body}
                    onChange={(e) =>
                      setEditForm({ ...editForm, body: e.target.value })
                    }
                    className="rounded-lg text-sm min-h-[60px]"
                  />
                  <Input
                    value={editForm.date}
                    onChange={(e) =>
                      setEditForm({ ...editForm, date: e.target.value })
                    }
                    className="rounded-lg text-sm"
                  />
                  <div className="flex gap-2">
                    <Button
                      data-ocid={`admin.announcement_save.button.${idx + 1}`}
                      type="button"
                      size="sm"
                      className="bg-green-deep text-white rounded-xl flex-1"
                      onClick={() => handleUpdate(ann.id)}
                      disabled={updateMutation.isPending}
                    >
                      {updateMutation.isPending ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <>
                          <Save className="w-3 h-3 mr-1" />
                          Save
                        </>
                      )}
                    </Button>
                    <Button
                      data-ocid={`admin.announcement_cancel.button.${idx + 1}`}
                      type="button"
                      size="sm"
                      variant="outline"
                      className="rounded-xl flex-1"
                      onClick={() => {
                        setEditingId(null);
                        setEditForm(null);
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <p className="text-foreground font-semibold text-sm">
                        {ann.title}
                      </p>
                      <p className="text-muted-foreground text-xs">
                        {ann.date}
                      </p>
                    </div>
                    <div className="flex gap-1">
                      <button
                        type="button"
                        data-ocid={`admin.announcement_edit.button.${idx + 1}`}
                        onClick={() => startEdit(ann)}
                        className="w-8 h-8 bg-mint rounded-lg flex items-center justify-center hover:opacity-70 transition-opacity"
                      >
                        <Pencil className="w-3.5 h-3.5 text-green-deep" />
                      </button>
                      <button
                        type="button"
                        data-ocid={`admin.announcement_delete.button.${idx + 1}`}
                        onClick={() => handleDelete(ann.id)}
                        className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center hover:opacity-70 transition-opacity"
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 className="w-3.5 h-3.5 text-destructive" />
                      </button>
                    </div>
                  </div>
                  <p className="text-muted-foreground text-xs mt-1 line-clamp-2">
                    {ann.body}
                  </p>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ContactEditor() {
  const { data: contactInfo, isLoading } = useContactInfo();
  const updateMutation = useUpdateContactInfo();
  const [localContact, setLocalContact] = useState<ContactInfo | null>(null);

  const contact = localContact ||
    contactInfo || {
      phone: "9837600353",
      whatsapp: "9837600353",
      address: "Margoobpur Mustufabad, UP, India",
    };

  const handleSave = async () => {
    try {
      await updateMutation.mutateAsync(contact as ContactInfo);
      toast.success("Contact info updated!");
      setLocalContact(null);
    } catch {
      toast.error("Failed to update contact info");
    }
  };

  if (isLoading) return <Skeleton className="h-48 rounded-2xl" />;

  return (
    <div className="bg-card rounded-2xl p-4 shadow-card">
      <h3 className="text-foreground font-bold text-base mb-4">Contact Info</h3>
      <div className="space-y-3">
        <div>
          <label
            htmlFor="contact-phone"
            className="text-muted-foreground text-xs font-medium mb-1 block"
          >
            Phone
          </label>
          <Input
            id="contact-phone"
            data-ocid="admin.contact_phone.input"
            placeholder="Phone number"
            value={(contact as ContactInfo).phone || ""}
            onChange={(e) =>
              setLocalContact({
                ...contact,
                phone: e.target.value,
              } as ContactInfo)
            }
            className="rounded-xl text-sm"
          />
        </div>
        <div>
          <label
            htmlFor="contact-whatsapp"
            className="text-muted-foreground text-xs font-medium mb-1 block"
          >
            WhatsApp
          </label>
          <Input
            id="contact-whatsapp"
            data-ocid="admin.contact_whatsapp.input"
            placeholder="WhatsApp number"
            value={(contact as ContactInfo).whatsapp || ""}
            onChange={(e) =>
              setLocalContact({
                ...contact,
                whatsapp: e.target.value,
              } as ContactInfo)
            }
            className="rounded-xl text-sm"
          />
        </div>
        <div>
          <label
            htmlFor="contact-address"
            className="text-muted-foreground text-xs font-medium mb-1 block"
          >
            Address
          </label>
          <Textarea
            id="contact-address"
            data-ocid="admin.contact_address.textarea"
            placeholder="Full address"
            value={(contact as ContactInfo).address || ""}
            onChange={(e) =>
              setLocalContact({
                ...contact,
                address: e.target.value,
              } as ContactInfo)
            }
            className="rounded-xl text-sm min-h-[72px]"
          />
        </div>
      </div>
      <Button
        data-ocid="admin.contact.save_button"
        onClick={handleSave}
        className="mt-4 w-full bg-green-deep text-white rounded-xl font-bold"
        disabled={updateMutation.isPending}
      >
        {updateMutation.isPending ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...
          </>
        ) : (
          <>
            <Save className="w-4 h-4 mr-2" /> Save Contact Info
          </>
        )}
      </Button>
    </div>
  );
}

export default function AdminScreen({
  isAdmin,
  onLogin,
  onLogout,
}: AdminScreenProps) {
  return (
    <div className="pb-24 hide-scrollbar">
      {/* Header */}
      <div className="bg-green-deep px-4 py-5 flex items-center justify-between">
        <div>
          <h1 className="text-white font-bold text-xl">Admin Panel</h1>
          <p className="text-white/70 text-sm">Masjid Management</p>
        </div>
        {isAdmin && (
          <button
            type="button"
            data-ocid="admin.logout.button"
            onClick={onLogout}
            className="flex items-center gap-1 bg-white/20 text-white rounded-xl px-3 py-2 text-sm font-medium hover:bg-white/30 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        )}
      </div>

      {!isAdmin ? (
        <LoginForm onLogin={onLogin} />
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="px-4 mt-4 space-y-4"
        >
          <PrayerTimesEditor />
          <AnnouncementsManager />
          <ContactEditor />
        </motion.div>
      )}
    </div>
  );
}
