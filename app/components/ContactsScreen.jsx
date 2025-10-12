import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StyleSheet,
} from "react-native";
import {
  ArrowLeft,
  Search,
  Check,
  UserPlus,
  MessageCircle,
} from "lucide-react-native";

export default function ContactsScreen({ onClose, onStartChat }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedContacts, setSelectedContacts] = useState([]);

  const contacts = [
    {
      id: "1",
      name: "Priya Sharma",
      phone: "+91 98765 43210",
      avatar:
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
      isOnline: true,
      status: "Hey there! I am using SuperApp",
    },
    {
      id: "2",
      name: "Arjun Patel",
      phone: "+91 87654 32109",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      isOnline: false,
      lastSeen: "2 hours ago",
      status: "Busy with work",
    },
    {
      id: "3",
      name: "Sneha Gupta",
      phone: "+91 76543 21098",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
      isOnline: true,
      status: "Available",
    },
    {
      id: "4",
      name: "Vikram Singh",
      phone: "+91 65432 10987",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      isOnline: false,
      lastSeen: "1 day ago",
      status: "Out for lunch",
    },
    {
      id: "5",
      name: "Anjali Reddy",
      phone: "+91 54321 09876",
      avatar:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face",
      isOnline: true,
      status: "At the gym 💪",
    },
    {
      id: "6",
      name: "Rohit Kumar",
      phone: "+91 43210 98765",
      isOnline: false,
      lastSeen: "5 minutes ago",
      status: "Studying for exams",
    },
    {
      id: "7",
      name: "Kavya Nair",
      phone: "+91 32109 87654",
      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face",
      isOnline: true,
      status: "Working from cafe ☕",
    },
    {
      id: "8",
      name: "Dad",
      phone: "+91 21098 76543",
      avatar:
        "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop&crop=face",
      isOnline: false,
      lastSeen: "30 minutes ago",
      status: "Proud of you beta!",
    },
  ];

  const filteredContacts = contacts.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone.includes(searchTerm)
  );

  const toggleContactSelection = (id) => {
    setSelectedContacts((prev) =>
      prev.includes(id)
        ? prev.filter((cid) => cid !== id)
        : [...prev, id]
    );
  };

  const handleStartChat = (contact) => {
    onStartChat(contact);
    onClose();
  };

  const handleStartGroupChat = () => {
    console.log("Starting group chat with:", selectedContacts);
    onClose();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.iconButton} onPress={onClose}>
            <ArrowLeft color="#fff" size={22} />
          </TouchableOpacity>
          <View>
            <Text style={styles.headerTitle}>New Chat</Text>
            <Text style={styles.headerSubtitle}>
              {filteredContacts.length} contacts
            </Text>
          </View>

          {selectedContacts.length > 1 && (
            <TouchableOpacity
              style={styles.groupButton}
              onPress={handleStartGroupChat}
            >
              <UserPlus color="#fff" size={16} style={{ marginRight: 4 }} />
              <Text style={styles.groupButtonText}>
                Group ({selectedContacts.length})
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Search Bar */}
        <View style={styles.searchBox}>
          <Search color="#9ca3af" size={18} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search contacts..."
            placeholderTextColor="rgba(255,255,255,0.7)"
            value={searchTerm}
            onChangeText={setSearchTerm}
          />
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <TouchableOpacity style={styles.quickCard}>
          <View style={[styles.quickIcon, { backgroundColor: "#dcfce7" }]}>
            <UserPlus color="#16a34a" size={24} />
          </View>
          <View>
            <Text style={styles.quickTitle}>New Group</Text>
            <Text style={styles.quickSubtitle}>Create a group chat</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.quickCard}>
          <View style={[styles.quickIcon, { backgroundColor: "#dbeafe" }]}>
            <MessageCircle color="#2563eb" size={24} />
          </View>
          <View>
            <Text style={styles.quickTitle}>New Contact</Text>
            <Text style={styles.quickSubtitle}>Add a new contact</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Contact List */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16 }}
      >
        <Text style={styles.sectionLabel}>CONTACTS ON SUPERAPP</Text>

        {filteredContacts.map((contact) => (
          <TouchableOpacity
            key={contact.id}
            style={styles.contactRow}
            onPress={() => handleStartChat(contact)}
          >
            {/* Selection Checkbox */}
            <TouchableOpacity
              style={[
                styles.checkCircle,
                selectedContacts.includes(contact.id) && styles.checkActive,
              ]}
              onPress={(e) => {
                e.stopPropagation();
                toggleContactSelection(contact.id);
              }}
            >
              {selectedContacts.includes(contact.id) && (
                <Check color="#fff" size={12} />
              )}
            </TouchableOpacity>

            {/* Avatar */}
            <View style={styles.avatarContainer}>
              {contact.avatar ? (
                <Image source={{ uri: contact.avatar }} style={styles.avatar} />
              ) : (
                <View style={styles.avatarFallback}>
                  <Text style={styles.avatarText}>
                    {contact.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()}
                  </Text>
                </View>
              )}
              {contact.isOnline && <View style={styles.onlineDot} />}
            </View>

            {/* Contact Info */}
            <View style={styles.contactInfo}>
              <View style={styles.contactHeader}>
                <Text style={styles.contactName}>{contact.name}</Text>
                {contact.isOnline ? (
                  <View style={styles.onlineBadge}>
                    <Text style={styles.onlineText}>online</Text>
                  </View>
                ) : (
                  <Text style={styles.lastSeen}>{contact.lastSeen}</Text>
                )}
              </View>
              <Text style={styles.contactStatus}>
                {contact.status || contact.phone}
              </Text>
            </View>
          </TouchableOpacity>
        ))}

        {filteredContacts.length === 0 && (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyEmoji}>👥</Text>
            <Text style={styles.emptyTitle}>No contacts found</Text>
            <Text style={styles.emptySubtitle}>
              Try a different search term or invite friends to SuperApp
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafb" },
  header: { backgroundColor: "#007bff", padding: 16 },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  iconButton: {
    backgroundColor: "rgba(255,255,255,0.15)",
    padding: 6,
    borderRadius: 8,
    marginRight: 8,
  },
  headerTitle: { color: "#fff", fontSize: 18, fontWeight: "600" },
  headerSubtitle: { color: "rgba(255,255,255,0.8)", fontSize: 12 },
  groupButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  groupButtonText: { color: "#fff", fontSize: 12, fontWeight: "500" },

  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 8,
    paddingLeft: 36,
    height: 40,
  },
  searchIcon: { position: "absolute", left: 10 },
  searchInput: { flex: 1, color: "#fff", fontSize: 14 },

  quickActions: { padding: 16, backgroundColor: "#fff", borderBottomWidth: 1, borderColor: "#e5e7eb" },
  quickCard: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  quickIcon: {
    padding: 10,
    borderRadius: 100,
    marginRight: 12,
  },
  quickTitle: { fontWeight: "600", color: "#111827" },
  quickSubtitle: { color: "#6b7280", fontSize: 12 },

  sectionLabel: { color: "#6b7280", fontSize: 12, fontWeight: "600", marginBottom: 10 },
  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    marginBottom: 8,
    elevation: 1,
  },
  checkCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#d1d5db",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  checkActive: { backgroundColor: "#007bff", borderColor: "#007bff" },
  avatarContainer: { position: "relative", marginRight: 10 },
  avatar: { width: 48, height: 48, borderRadius: 24 },
  avatarFallback: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#e0f2fe",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { color: "#0284c7", fontWeight: "700", fontSize: 16 },
  onlineDot: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#22c55e",
    borderWidth: 2,
    borderColor: "#fff",
  },
  contactInfo: { flex: 1 },
  contactHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  contactName: { fontWeight: "600", color: "#111827" },
  onlineBadge: {
    backgroundColor: "#dcfce7",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  onlineText: { color: "#16a34a", fontSize: 10, fontWeight: "500" },
  lastSeen: { fontSize: 11, color: "#6b7280" },
  contactStatus: { color: "#6b7280", fontSize: 12, marginTop: 2 },

  emptyBox: { alignItems: "center", justifyContent: "center", marginTop: 50 },
  emptyEmoji: { fontSize: 40, marginBottom: 10 },
  emptyTitle: { fontWeight: "600", fontSize: 16, color: "#111827" },
  emptySubtitle: { color: "#6b7280", fontSize: 13, textAlign: "center" },
});
