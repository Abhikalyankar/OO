import {
  ArrowLeft,
  Check,
  CheckCheck,
  Mic,
  MoreVertical,
  Paperclip,
  Phone,
  Plus,
  Search,
  Send,
  Video
} from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

// ✅ FIXED: Corrected import for ContactsScreen (was named import before)
import ContactsScreen from "./ContactsScreen";

export default function ChatScreen({ onNavigate }) {
  const [activeView, setActiveView] = useState("list"); // list | chat | contacts
  const [activeChat, setActiveChat] = useState(null);
  const [inputMessage, setInputMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  const [chats, setChats] = useState([
    {
      id: "1",
      name: "SuperApp Support",
      avatar: "🛠️",
      lastMessage: "Hello! How can I help you today?",
      timestamp: new Date(Date.now() - 300000),
      unreadCount: 1,
      isOnline: true,
      isTyping: false,
      type: "service",
      messages: [
        {
          id: "1",
          type: "service",
          content: "Hello Rahul! How can I help you today?",
          timestamp: new Date(Date.now() - 300000),
          status: "read",
        },
      ],
    },
    {
      id: "4",
      name: "Mom",
      avatar:
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
      lastMessage: "Did you eat lunch?",
      timestamp: new Date(Date.now() - 1800000),
      unreadCount: 2,
      isOnline: true,
      isTyping: false,
      type: "personal",
      messages: [
        {
          id: "1",
          type: "bot",
          content: "Hi beta! How are you?",
          timestamp: new Date(Date.now() - 3600000),
          status: "read",
        },
        {
          id: "2",
          type: "user",
          content: "I'm good mom! Just busy with work",
          timestamp: new Date(Date.now() - 2400000),
          status: "read",
        },
        {
          id: "3",
          type: "bot",
          content: "Did you eat lunch?",
          timestamp: new Date(Date.now() - 1800000),
          status: "delivered",
        },
      ],
    },
  ]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollToEnd({ animated: true });
    }
  }, [activeChat?.messages]);

  const filteredChats = chats.filter(
    (chat) =>
      chat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chat.lastMessage.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openChat = (chat) => {
    setActiveChat(chat);
    setActiveView("chat");
    setChats((prev) =>
      prev.map((c) =>
        c.id === chat.id ? { ...c, unreadCount: 0 } : { ...c }
      )
    );
  };

  const sendMessage = () => {
    if (!inputMessage.trim() || !activeChat) return;
    const newMsg = {
      id: Date.now().toString(),
      type: "user",
      content: inputMessage,
      timestamp: new Date(),
      status: "sent",
    };
    const updated = {
      ...activeChat,
      messages: [...activeChat.messages, newMsg],
      lastMessage: inputMessage,
    };
    setActiveChat(updated);
    setChats((prev) =>
      prev.map((chat) => (chat.id === activeChat.id ? updated : chat))
    );
    setInputMessage("");
    setIsTyping(true);
    setTimeout(() => setIsTyping(false), 1500);
  };

  const formatTime = (date) => {
    const now = new Date();
    const diffHrs = (now - date) / (1000 * 60 * 60);
    if (diffHrs < 24)
      return date.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
      });
    else
      return date.toLocaleDateString("en-IN", {
        month: "short",
        day: "numeric",
      });
  };

  const renderStatus = (status) => {
    if (status === "sent") return <Check size={14} color="#999" />;
    if (status === "delivered") return <CheckCheck size={14} color="#999" />;
    if (status === "read") return <CheckCheck size={14} color="#007bff" />;
    return null;
  };

  // Contacts Screen
  if (activeView === "contacts")
    return (
      <ContactsScreen
        onClose={() => setActiveView("list")}
        onStartChat={(contact) => openChat(contact)}
      />
    );

  // Active Chat
  if (activeView === "chat" && activeChat)
    return (
      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: "#fff" }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* HEADER */}
        <View style={styles.chatHeader}>
          <TouchableOpacity onPress={() => setActiveView("list")}>
            <ArrowLeft color="#fff" size={24} />
          </TouchableOpacity>
          <Image
            source={{ uri: activeChat.avatar }}
            style={styles.avatar}
            resizeMode="cover"
          />
          <View style={{ flex: 1 }}>
            <Text style={styles.chatName}>{activeChat.name}</Text>
            <Text style={styles.chatStatus}>
              {activeChat.isOnline ? "online" : "offline"}
            </Text>
          </View>
          <Phone color="#fff" size={22} style={{ marginRight: 12 }} />
          <Video color="#fff" size={22} />
        </View>

        {/* MESSAGES */}
        <ScrollView
          ref={scrollRef}
          style={styles.messagesContainer}
          contentContainerStyle={{ padding: 10 }}
        >
          {activeChat.messages.map((msg) => (
            <View
              key={msg.id}
              style={[
                styles.messageBubble,
                msg.type === "user"
                  ? styles.userMessage
                  : styles.botMessage,
              ]}
            >
              <Text style={styles.messageText}>{msg.content}</Text>
              <View style={styles.messageMeta}>
                <Text style={styles.timeText}>
                  {formatTime(msg.timestamp)}
                </Text>
                {msg.type === "user" && renderStatus(msg.status)}
              </View>
            </View>
          ))}
          {isTyping && (
            <View style={styles.typingBubble}>
              <Text style={{ color: "#555" }}>Typing...</Text>
            </View>
          )}
        </ScrollView>

        {/* INPUT */}
        <View style={styles.inputArea}>
          <TouchableOpacity style={styles.iconBtn}>
            <Plus color="#555" size={20} />
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            value={inputMessage}
            onChangeText={setInputMessage}
          />
          <TouchableOpacity style={styles.iconBtn}>
            <Paperclip color="#555" size={20} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.sendBtn} onPress={sendMessage}>
            {inputMessage.trim() ? (
              <Send color="#fff" size={18} />
            ) : (
              <Mic color="#fff" size={18} />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    );

  // Chat List
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Chats</Text>
        <View style={{ flexDirection: "row" }}>
          <Search color="#fff" size={20} style={{ marginRight: 12 }} />
          <MoreVertical color="#fff" size={20} />
        </View>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <Search color="#888" size={18} style={{ marginHorizontal: 8 }} />
        <TextInput
          placeholder="Search chats..."
          placeholderTextColor="#999"
          style={{ flex: 1, color: "#000" }}
          value={searchTerm}
          onChangeText={setSearchTerm}
        />
      </View>

      {/* Chat List */}
      <ScrollView style={{ flex: 1 }}>
        {filteredChats.map((chat) => (
          <TouchableOpacity
            key={chat.id}
            style={styles.chatItem}
            onPress={() => openChat(chat)}
          >
            <Image
              source={{
                uri: chat.avatar.startsWith("http")
                  ? chat.avatar
                  : "https://via.placeholder.com/50",
              }}
              style={styles.avatar}
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.chatName}>{chat.name}</Text>
              <Text style={styles.lastMsg} numberOfLines={1}>
                {chat.lastMessage}
              </Text>
            </View>
            <Text style={styles.timeText}>{formatTime(chat.timestamp)}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Floating Add Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setActiveView("contacts")}
      >
        <Plus color="#fff" size={28} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    backgroundColor: "#007bff",
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: { color: "#fff", fontSize: 20, fontWeight: "600" },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f2f2f2",
    margin: 10,
    borderRadius: 12,
    paddingHorizontal: 8,
  },
  chatItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  avatar: { width: 50, height: 50, borderRadius: 25, marginRight: 12 },
  chatName: { fontWeight: "600", fontSize: 16 },
  lastMsg: { color: "#555", fontSize: 14 },
  timeText: { color: "#777", fontSize: 12 },
  fab: {
    position: "absolute",
    bottom: 25,
    right: 25,
    backgroundColor: "#007bff",
    borderRadius: 50,
    width: 60,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
  },
  chatHeader: {
    backgroundColor: "#007bff",
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
  },
  chatStatus: { color: "#eee", fontSize: 12 },
  messagesContainer: { flex: 1, backgroundColor: "#f7f7f7" },
  messageBubble: {
    marginVertical: 5,
    padding: 10,
    borderRadius: 12,
    maxWidth: "80%",
  },
  userMessage: {
    backgroundColor: "#007bff",
    alignSelf: "flex-end",
  },
  botMessage: {
    backgroundColor: "#fff",
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  messageText: { color: "#000" },
  messageMeta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 4,
  },
  typingBubble: {
    alignSelf: "flex-start",
    backgroundColor: "#e0e0e0",
    padding: 10,
    borderRadius: 12,
    marginVertical: 5,
  },
  inputArea: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    borderColor: "#ddd",
    padding: 10,
  },
  input: {
    flex: 1,
    backgroundColor: "#f2f2f2",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: "#000",
  },
  iconBtn: { paddingHorizontal: 8 },
  sendBtn: {
    backgroundColor: "#007bff",
    borderRadius: 25,
    padding: 10,
    marginLeft: 4,
  },
});
