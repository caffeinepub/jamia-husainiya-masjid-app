import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Time "mo:core/Time";
import Order "mo:core/Order";
import List "mo:core/List";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  type PrayerTimes = {
    fajr : Text;
    zohar : Text;
    asr : Text;
    maghrib : Text;
    isha : Text;
    juma_khutba : Text;
  };

  type AnnouncementId = Nat;

  type Announcement = {
    id : AnnouncementId;
    title : Text;
    body : Text;
    date : Text;
  };

  module Announcement {
    public func compare(announcement1 : Announcement, announcement2 : Announcement) : Order.Order {
      Nat.compare(announcement1.id, announcement2.id);
    };

    public func compareByDate(announcement1 : Announcement, announcement2 : Announcement) : Order.Order {
      Text.compare(announcement1.date, announcement2.date);
    };
  };

  type ContactInfo = {
    phone : Text;
    whatsapp : Text;
    address : Text;
  };

  type AdminCredentials = {
    username : Text;
    password : Text;
  };

  type UserProfile = {
    name : Text;
  };

  var announcementIdCounter = 0;
  var prayerTimes : PrayerTimes = {
    fajr = "05:00 AM";
    zohar = "01:00 PM";
    asr = "04:00 PM";
    maghrib = "07:00 PM";
    isha = "08:30 PM";
    juma_khutba = "01:15 PM";
  };
  let announcements = Map.empty<AnnouncementId, Announcement>();
  var contactInfo : ContactInfo = {
    phone = "";
    whatsapp = "";
    address = "";
  };
  var adminCredentials : AdminCredentials = {
    username = "admin";
    password = "masjid123";
  };
  let userProfiles = Map.empty<Principal, UserProfile>();

  // User Profile Management (required by instructions)
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Prayer Times Management
  public query ({ caller }) func getPrayerTimes() : async PrayerTimes {
    // Public read access - no authorization required
    prayerTimes;
  };

  public shared ({ caller }) func updatePrayerTimes(newTimes : PrayerTimes) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update prayer times");
    };
    prayerTimes := newTimes;
  };

  // Announcements Management
  public query ({ caller }) func getAnnouncements() : async [Announcement] {
    // Public read access - no authorization required
    announcements.values().toArray().sort();
  };

  public query ({ caller }) func getAnnouncementsByDate() : async [Announcement] {
    // Public read access - no authorization required
    announcements.values().toArray().sort(Announcement.compareByDate);
  };

  public shared ({ caller }) func addAnnouncement(title : Text, body : Text, date : Text) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can add announcements");
    };
    let id = announcementIdCounter;
    let announcement : Announcement = {
      id;
      title;
      body;
      date;
    };
    announcements.add(id, announcement);
    announcementIdCounter += 1;
  };

  public shared ({ caller }) func updateAnnouncement(id : AnnouncementId, title : Text, body : Text, date : Text) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update announcements");
    };
    switch (announcements.get(id)) {
      case (null) { Runtime.trap("Announcement not found") };
      case (?_) {
        let updatedAnnouncement : Announcement = {
          id;
          title;
          body;
          date;
        };
        announcements.add(id, updatedAnnouncement);
      };
    };
  };

  public shared ({ caller }) func deleteAnnouncement(id : AnnouncementId) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can delete announcements");
    };
    if (not announcements.containsKey(id)) {
      Runtime.trap("Announcement not found");
    };
    announcements.remove(id);
  };

  // Contact Info Management
  public query ({ caller }) func getContactInfo() : async ContactInfo {
    // Public read access - no authorization required
    contactInfo;
  };

  public shared ({ caller }) func updateContactInfo(newContact : ContactInfo) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update contact info");
    };
    contactInfo := newContact;
  };

  // Admin Authentication
  // This function validates credentials and assigns admin role to the caller
  public shared ({ caller }) func adminLogin(username : Text, password : Text) : async Bool {
    if (username != adminCredentials.username or password != adminCredentials.password) {
      Runtime.trap("Invalid username or password");
    };
    // Assign admin role to the authenticated principal
    AccessControl.assignRole(accessControlState, caller, caller, #admin);
    true;
  };

  public shared ({ caller }) func updateAdminCredentials(oldPassword : Text, newUsername : Text, newPassword : Text) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update credentials");
    };
    if (oldPassword != adminCredentials.password) {
      Runtime.trap("Invalid old password");
    };
    adminCredentials := {
      username = newUsername;
      password = newPassword;
    };
  };
};
