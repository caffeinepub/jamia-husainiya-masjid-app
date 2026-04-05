import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type AnnouncementId = bigint;
export interface Announcement {
    id: AnnouncementId;
    title: string;
    body: string;
    date: string;
}
export interface ContactInfo {
    whatsapp: string;
    address: string;
    phone: string;
}
export interface UserProfile {
    name: string;
}
export interface PrayerTimes {
    asr: string;
    maghrib: string;
    juma_khutba: string;
    fajr: string;
    isha: string;
    zohar: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addAnnouncement(title: string, body: string, date: string): Promise<void>;
    adminLogin(username: string, password: string): Promise<boolean>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deleteAnnouncement(id: AnnouncementId): Promise<void>;
    getAnnouncements(): Promise<Array<Announcement>>;
    getAnnouncementsByDate(): Promise<Array<Announcement>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getContactInfo(): Promise<ContactInfo>;
    getPrayerTimes(): Promise<PrayerTimes>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateAdminCredentials(oldPassword: string, newUsername: string, newPassword: string): Promise<void>;
    updateAnnouncement(id: AnnouncementId, title: string, body: string, date: string): Promise<void>;
    updateContactInfo(newContact: ContactInfo): Promise<void>;
    updatePrayerTimes(newTimes: PrayerTimes): Promise<void>;
}
