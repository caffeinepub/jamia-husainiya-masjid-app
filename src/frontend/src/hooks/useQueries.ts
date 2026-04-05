import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  Announcement,
  AnnouncementId,
  ContactInfo,
  PrayerTimes,
} from "../backend.d.ts";
import { useActor } from "./useActor";

export function usePrayerTimes() {
  const { actor, isFetching } = useActor();
  return useQuery<PrayerTimes>({
    queryKey: ["prayerTimes"],
    queryFn: async () => {
      if (!actor) {
        return {
          fajr: "5:41 AM",
          zohar: "2:30 PM",
          asr: "5:15 PM",
          maghrib: "6:41 PM",
          isha: "8:45 PM",
          juma_khutba: "1:30 PM",
        };
      }
      return actor.getPrayerTimes();
    },
    enabled: !isFetching,
  });
}

export function useAnnouncements() {
  const { actor, isFetching } = useActor();
  return useQuery<Announcement[]>({
    queryKey: ["announcements"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAnnouncementsByDate();
    },
    enabled: !isFetching,
  });
}

export function useContactInfo() {
  const { actor, isFetching } = useActor();
  return useQuery<ContactInfo>({
    queryKey: ["contactInfo"],
    queryFn: async () => {
      if (!actor) {
        return {
          phone: "9837600353",
          whatsapp: "9837600353",
          address: "Margoobpur Mustufabad, UP, India",
        };
      }
      return actor.getContactInfo();
    },
    enabled: !isFetching,
  });
}

export function useUpdatePrayerTimes() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (times: PrayerTimes) => {
      if (!actor) throw new Error("Not connected");
      return actor.updatePrayerTimes(times);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["prayerTimes"] });
    },
  });
}

export function useAddAnnouncement() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      title,
      body,
      date,
    }: { title: string; body: string; date: string }) => {
      if (!actor) throw new Error("Not connected");
      return actor.addAnnouncement(title, body, date);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["announcements"] });
    },
  });
}

export function useUpdateAnnouncement() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      title,
      body,
      date,
    }: { id: AnnouncementId; title: string; body: string; date: string }) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateAnnouncement(id, title, body, date);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["announcements"] });
    },
  });
}

export function useDeleteAnnouncement() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: AnnouncementId) => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteAnnouncement(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["announcements"] });
    },
  });
}

export function useUpdateContactInfo() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (contact: ContactInfo) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateContactInfo(contact);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contactInfo"] });
    },
  });
}

export function useAdminLogin() {
  const { actor, isFetching } = useActor();
  const mutation = useMutation({
    mutationFn: async ({
      username,
      password,
    }: { username: string; password: string }) => {
      if (!actor)
        throw new Error(
          "Not connected to backend. Please refresh and try again.",
        );
      return actor.adminLogin(username, password);
    },
  });
  return { ...mutation, isActorLoading: isFetching };
}
