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
    agreeToTerms: false,
  });

  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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
  // Choose host depending on platform. Android emulator should use 10.0.2.2
  const host = Platform.OS === "android" ? "10.0.2.2" : "127.0.0.1";
  const url = `http://127.0.0.1:8000/api/users/register2/`;
  console.log("Sending OTP to:", url);
        const payload = {
          first_name: formData.firstName,
          last_name: formData.lastName,
          phone: formData.phoneNumber,
          email: formData.email,
        };
        const resp = await postAPI(url, payload);
        console.log("OTP/send response:", resp);
        toast.info("OTP sent. Please enter the code to verify.");
        setOtpSent(true);
      } catch (error) {
        console.error("Send OTP failed:", error);
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
