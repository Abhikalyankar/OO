import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { ArrowRight } from "lucide-react-native";
// import { useAppDispatch } from "../store"; // your typed dispatch
import { register } from "../../store/auth/authThunk";
import { toast } from "react-toastify"; // optional: replace with RN Toast
import { postAPI } from "../axios/utils";
import { useAppDispatch } from "../../store/hook";

const SignUpScreen = ({ onNavigateToSignIn }) => {
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    city: "",
    // password: "",
    // password1: "",
    // agreeToTerms: false,
  });

  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [apiHostOverride, setApiHostOverride] = useState("");
  const [debugLogs, setDebugLogs] = useState([]);

  const addDebugLog = (txt) => {
    const ts = new Date().toLocaleTimeString();
    setDebugLogs((s) => [{ ts, txt }, ...s].slice(0, 200));
    console.log(`[TEST-CONN ${ts}]`, txt);
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePhoneSignUp = async () => {
    if (!otpSent) {
      // send OTP / start registration flow (server: /api/users/register2/)
      if (!formData.phoneNumber || !formData.firstName) {
        toast.error("Please enter first name and phone number to continue");
        return;
      }
      setIsLoading(true);
      try {
        // Try multiple hosts to increase chance of reaching backend from emulators/devices.
        const defaultHosts = Platform.OS === "android"
          ? ["10.0.2.2", "10.0.3.2", "127.0.0.1"]
          : ["127.0.0.1"];

        const hosts = apiHostOverride && apiHostOverride.trim().length > 0
          ? [apiHostOverride.trim(), ...defaultHosts]
          : defaultHosts;

        const payload = {
          first_name: formData.firstName,
          last_name: formData.lastName,
          phone_number: formData.phoneNumber,
          email: formData.email,
          city: formData.city,
        };

        let didSucceed = false;
        let lastErr = null;

        for (const host of hosts) {
          const url = `http://192.168.1.7:8000/api/users/register2/`;
          console.log("Attempting Send OTP to:", url);
          try {
            const resp = await fetch(url, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload),
            });

            // Treat non-2xx as failure but still parse to surface message
            if (!resp.ok) {
              const text = await resp.text().catch(() => null);
              console.warn(`Server responded ${resp.status} for ${url}:`, text);
              lastErr = new Error(`Server ${resp.status}: ${text || resp.statusText}`);
              // do not retry other hosts if server returned an HTTP error
              break;
            }

            const data = await resp.json().catch(() => null);
            console.log("OTP/send response data:", data || resp);
            toast.info("OTP sent. Please enter the code to verify.");
            setOtpSent(true);
            didSucceed = true;
            break;
          } catch (err) {
            lastErr = err;
            console.warn(`Send OTP attempt to ${host} failed:`, err?.message || err);
            // if network error, try next host; otherwise break
            const msg = (err?.message || "").toLowerCase();
            if (!msg.includes("network") && !msg.includes("failed")) {
              break;
            }
          }
        }

        if (!didSucceed) {
          console.error("Send OTP failed (all attempts):", lastErr);
          toast.error("Failed to send OTP. Ensure backend is running and reachable from the device.");
        }
      } catch (error) {
        console.error("Send OTP unexpected error:", error);
        toast.error("Failed to send OTP. Please try again.");
      } finally {
        setIsLoading(false);
      }
      return;
    }

    if (formData.password !== formData.password1) {
      toast.error("Passwords do not match!");
      return;
    }

    setIsLoading(true);
    try {
      const result = await dispatch(register(formData)).unwrap();
      console.log("Registration result:", result);
      toast.info("Registration successful!");
      onNavigateToSignIn();
    } catch (error) {
      console.error("Registration failed:", error);
      toast.error("Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={{ paddingVertical: 20 }}>
          <View style={styles.logoContainer}>
            <View style={styles.logoOuter}>
              <View style={styles.logoInner}>
                <View style={styles.logoDot} />
              </View>
            </View>
            <Text style={styles.title}>Join SuperApp!</Text>
            <Text style={styles.subtitle}>Create your account to get started</Text>
            {/* Optional API host override (enter machine LAN IP or emulator host) */}
            <View style={{ width: "100%", paddingHorizontal: 16, marginTop: 8 }}>
              <Text style={{ color: "#374151", marginBottom: 6, fontSize: 12 }}>API Host (optional)</Text>
              <TextInput
                style={[styles.input, { backgroundColor: "#fff" }]}
                placeholder="e.g. 192.168.1.100 or 10.0.2.2"
                value={apiHostOverride}
                onChangeText={setApiHostOverride}
                autoCapitalize="none"
              />
            </View>
              <View style={{ paddingHorizontal: 16, marginTop: 8 }}>
                <TouchableOpacity
                  style={[styles.button, { backgroundColor: "#10b981", paddingVertical: 10, margin: 0 }]}
                  onPress={async () => {
                    // Run test connection flow
                    const defaultHosts = Platform.OS === "android"
                      ? ["10.0.2.2", "10.0.3.2", "127.0.0.1"]
                      : ["127.0.0.1"];
                    const hosts = apiHostOverride && apiHostOverride.trim().length > 0
                      ? [apiHostOverride.trim(), ...defaultHosts]
                      : defaultHosts;

                    addDebugLog(`Starting test for hosts: ${hosts.join(", ")}`);

                    for (const host of hosts) {
                      const urlRoot = `http://${host}:8000/`;
                      const urlPing = `http://${host}:8000/api/users/register2/`;

                      // 1) quick GET to root
                      addDebugLog(`GET ${urlRoot}`);
                      try {
                        const resp = await fetch(urlRoot, { method: "GET" });
                        const text = await resp.text().catch(() => "<no-body>");
                        addDebugLog(`GET ${urlRoot} -> ${resp.status} ${resp.statusText} | body: ${text.substring(0, 1000)}`);
                      } catch (err) {
                        addDebugLog(`GET ${urlRoot} ERROR: ${err?.message || err}`);
                      }

                      // 2) Try POST to register2 (to match OTP endpoint) but do not send real data
                      addDebugLog(`POST ${urlPing}`);
                      try {
                        const resp = await fetch(urlPing, {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ test: true }),
                        });
                        const text = await resp.text().catch(() => "<no-body>");
                        addDebugLog(`POST ${urlPing} -> ${resp.status} ${resp.statusText} | body: ${text.substring(0, 1000)}`);
                      } catch (err) {
                        addDebugLog(`POST ${urlPing} ERROR: ${err?.message || err}`);
                      }
                    }
                    addDebugLog("Test completed.");
                  }}
                >
                  <Text style={{ color: "#fff", fontWeight: "700" }}>Test connection</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, { backgroundColor: "#6b7280", paddingVertical: 10, marginTop: 8, margin: 0 }]}
                  onPress={() => setDebugLogs([])}
                >
                  <Text style={{ color: "#fff", fontWeight: "700" }}>Clear logs</Text>
                </TouchableOpacity>
              </View>
          </View>

          {!otpSent ? (
            <View style={styles.form}>
              <View style={styles.row}>
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>First Name</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="First name"
                    value={formData.firstName}
                    onChangeText={(t) => handleInputChange("firstName", t)}
                  />
                </View>
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Last Name</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Last name"
                    value={formData.lastName}
                    onChangeText={(t) => handleInputChange("lastName", t)}
                  />
                </View>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Phone Number</Text>
                <View style={styles.phoneRow}>
                  <View style={styles.countryCode}>
                    <Text style={{ color: "#6b7280" }}>+91</Text>
                  </View>
                  <TextInput
                    style={[styles.input, { flex: 1 }]}
                    placeholder="Enter phone number"
                    keyboardType="number-pad"
                    maxLength={10}
                    value={formData.phoneNumber}
                    onChangeText={(t) => handleInputChange("phoneNumber", t)}
                  />
                </View>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter email"
                  keyboardType="email-address"
                  value={formData.email}
                  onChangeText={(t) => handleInputChange("email", t)}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>City</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your city"
                  value={formData.city}
                  onChangeText={(t) => handleInputChange("city", t)}
                />
              </View>

              {/* Debug panel: show recent logs */}
              {debugLogs.length > 0 && (
                <View style={{ paddingHorizontal: 16, marginTop: 12 }}>
                  <Text style={{ color: "#374151", marginBottom: 6, fontSize: 12 }}>Connection logs</Text>
                  <ScrollView style={{ maxHeight: 160, backgroundColor: "#fff", borderRadius: 8, padding: 8 }}>
                    {debugLogs.map((l, idx) => (
                      <View key={idx} style={{ marginBottom: 8 }}>
                        <Text style={{ fontSize: 11, color: "#6b7280" }}>[{l.ts}]</Text>
                        <Text style={{ fontSize: 12 }}>{l.txt}</Text>
                      </View>
                    ))}
                  </ScrollView>
                </View>
              )}

              {/* <View style={styles.inputContainer}>
                <Text style={styles.label}>Password</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  secureTextEntry
                  value={formData.password}
                  onChangeText={(t) => handleInputChange("password", t)}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Confirm Password</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Confirm password"
                  secureTextEntry
                  value={formData.password1}
                  onChangeText={(t) => handleInputChange("password1", t)}
                />
              </View> */}
            </View>
          ) : (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Enter OTP</Text>
              <TextInput
                style={styles.input}
                placeholder="6-digit OTP"
                keyboardType="number-pad"
                maxLength={6}
                value={otp}
                onChangeText={setOtp}
              />
              <Text style={styles.helperText}>
                OTP sent to +91 {formData.phoneNumber}
              </Text>
              <TouchableOpacity onPress={() => setOtpSent(false)}>
                <Text style={styles.linkText}>Change details</Text>
              </TouchableOpacity>
            </View>
          )}

          <TouchableOpacity
            style={[
              styles.button,
              (!formData.phoneNumber || !formData.firstName) && !otpSent && styles.buttonDisabled,
            ]}
            onPress={handlePhoneSignUp}
            disabled={((!formData.phoneNumber || !formData.firstName) && !otpSent) || isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Text style={styles.buttonText}>
                  {!otpSent ? "Send OTP" : "Verify & Create Account"}
                </Text>
                <ArrowRight color="#fff" size={18} />
              </>
            )}
          </TouchableOpacity>

          <View style={styles.signInContainer}>
            <Text style={styles.signInText}>Already have an account?</Text>
            <TouchableOpacity onPress={onNavigateToSignIn}>
              <Text style={styles.linkText}> Sign in</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.termsText}>
            By creating an account, you agree to our{" "}
            <Text style={styles.linkText}>Terms of Service</Text> and{" "}
            <Text style={styles.linkText}>Privacy Policy</Text>.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignUpScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  logoContainer: { alignItems: "center", marginBottom: 20 },
  logoOuter: {
    height: 80,
    width: 80,
    borderRadius: 40,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
  },
  logoInner: {
    height: 56,
    width: 56,
    borderRadius: 28,
    backgroundColor: "#007bff",
    alignItems: "center",
    justifyContent: "center",
  },
  logoDot: { height: 12, width: 12, borderRadius: 6, backgroundColor: "#fff" },
  title: { fontSize: 20, fontWeight: "700", marginTop: 10 },
  subtitle: { color: "#6b7280", marginTop: 4 },
  form: { paddingHorizontal: 16 },
  row: { flexDirection: "row", justifyContent: "space-between" },
  inputContainer: { marginBottom: 12 },
  label: { marginBottom: 6, color: "#374151" },
  input: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  phoneRow: { flexDirection: "row", alignItems: "center" },
  countryCode: { paddingHorizontal: 12, justifyContent: "center" },
  helperText: { color: "#6b7280", marginTop: 6 },
  linkText: { color: "#007bff" },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#007bff",
    padding: 12,
    margin: 16,
    borderRadius: 8,
  },
  buttonDisabled: { backgroundColor: "#9ca3af" },
  buttonText: { color: "#fff", fontWeight: "700", marginRight: 8 },
  signInContainer: { flexDirection: "row", justifyContent: "center", marginTop: 8 },
  signInText: { color: "#6b7280" },
  termsText: { textAlign: "center", color: "#6b7280", marginTop: 12 },
});
