import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import {
  Eye,
  EyeOff,
  Phone,
  Mail,
  ArrowRight,
} from "lucide-react-native";
// import { ArrowRight } from "lucide-react-native";
import { toast } from "react-toastify"; // optional: replace with RN Toast
import { postAPI } from "../axios/utils";
import TokenService from "../axios/tokenService";
import { useAppDispatch } from "../../store/hook";
import { login } from "../../store/auth/authThunk";

export default function SignInScreen({
  onSignIn,
  onNavigateToSignUp,
  isLoading: externalIsLoading = false,
}) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [activeTab, setActiveTab] = useState("phone");
  const [formErrors, setFormErrors] = useState({});
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(externalIsLoading);

  const validateField = (field, value) => {
    const errors = { ...formErrors };
    switch (field) {
      case "phone":
        if (value && !/^[6-9]\d{9}$/.test(value)) {
          errors.phone = "Enter a valid phone number";
        } else delete errors.phone;
        break;
      case "email":
        if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          errors.email = "Enter a valid email";
        } else delete errors.email;
        break;
      case "password":
        if (value && value.length < 6) {
          errors.password = "Password must be 6+ characters";
        } else delete errors.password;
        break;
    }
    setFormErrors(errors);
  };

  const handlePhoneSignIn = async () => {
    if (phoneNumber && !otpSent) {
      // show OTP entry UI; sending OTP should be done by backend/register flow
      setOtpSent(true);
      return;
    }

    if (otp) {
      setIsLoading(true);
      try {
        // dispatch login thunk which calls the verify endpoint
        const resp = await dispatch(login({ phone_number: "+91"+phoneNumber, otp })).unwrap();
        // authThunk returns axios response; tokens may be in resp.data.tokens
        const data = resp?.data || resp;
        console.log('Login response data21:', data);
        const access = data?.tokens?.access || data?.access || data?.token || data?.auth_token || null;
        if (access) {
          try { TokenService.setToken(access); } catch (e) { console.warn('TokenService.setToken failed', e); }
        }
        toast.info('Signed in');
        await onSignIn();
      } catch (err) {
        console.error('Sign in failed:', err);
        toast.error('Sign in failed. Please check OTP and try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleEmailSignIn = async () => {
    if (email && password) {
      await onSignIn();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{ paddingVertical: 20 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Logo */}
          <View style={styles.logoContainer}>
            <View style={styles.logoOuter}>
              <View style={styles.logoInner}>
                <View style={styles.logoDot} />
              </View>
            </View>
            <Text style={styles.title}>Welcome Back!</Text>
            <Text style={styles.subtitle}>
              Sign in to your SuperApp account
            </Text>
          </View>

          {/* Tabs */}
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[styles.tab, activeTab === "phone" && styles.activeTab]}
              onPress={() => setActiveTab("phone")}
            >
              <Phone
                size={18}
                color={activeTab === "phone" ? "#007bff" : "#6b7280"}
              />
              <Text
                style={[
                  styles.tabText,
                  activeTab === "phone" && styles.activeTabText,
                ]}
              >
                Phone
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === "email" && styles.activeTab]}
              onPress={() => setActiveTab("email")}
            >
              <Mail
                size={18}
                color={activeTab === "email" ? "#007bff" : "#6b7280"}
              />
              <Text
                style={[
                  styles.tabText,
                  activeTab === "email" && styles.activeTabText,
                ]}
              >
                Email
              </Text>
            </TouchableOpacity>
          </View>

          {/* === PHONE LOGIN === */}
          {activeTab === "phone" && (
            <View style={styles.form}>
              {!otpSent ? (
                <>
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
                      value={phoneNumber}
                      onChangeText={(t) => {
                        setPhoneNumber(t);
                        validateField("phone", t);
                      }}
                    />
                  </View>
                  {formErrors.phone && (
                    <Text style={styles.errorText}>{formErrors.phone}</Text>
                  )}
                </>
              ) : (
                <>
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
                    OTP sent to +91 {phoneNumber}
                  </Text>
                  <TouchableOpacity onPress={() => setOtpSent(false)}>
                    <Text style={styles.linkText}>Change number</Text>
                  </TouchableOpacity>
                </>
              )}

              <TouchableOpacity
                style={[
                  styles.button,
                  ((!phoneNumber && !otpSent) ||
                    (otpSent && !otp) ||
                    isLoading) &&
                    styles.buttonDisabled,
                ]}
                onPress={handlePhoneSignIn}
                disabled={
                  (!phoneNumber && !otpSent) || (otpSent && !otp) || isLoading
                }
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <>
                    <Text style={styles.buttonText}>
                      {!otpSent ? "Send OTP" : "Verify OTP"}
                    </Text>
                    <ArrowRight color="#fff" size={18} />
                  </>
                )}
              </TouchableOpacity>
            </View>
          )}

          {/* === EMAIL LOGIN === */}
          {activeTab === "email" && (
            <View style={styles.form}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                keyboardType="email-address"
                value={email}
                onChangeText={(t) => {
                  setEmail(t);
                  validateField("email", t);
                }}
              />
              {formErrors.email && (
                <Text style={styles.errorText}>{formErrors.email}</Text>
              )}

              <Text style={styles.label}>Password</Text>
              <View style={styles.passwordRow}>
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  placeholder="Enter your password"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={(t) => {
                    setPassword(t);
                    validateField("password", t);
                  }}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff size={20} color="#6b7280" />
                  ) : (
                    <Eye size={20} color="#6b7280" />
                  )}
                </TouchableOpacity>
              </View>
              {formErrors.password && (
                <Text style={styles.errorText}>{formErrors.password}</Text>
              )}

              <TouchableOpacity style={styles.forgotBtn}>
                <Text style={styles.linkText}>Forgot password?</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.button,
                  (!email || !password || Object.keys(formErrors).length > 0) &&
                    styles.buttonDisabled,
                ]}
                onPress={handleEmailSignIn}
                disabled={
                  !email ||
                  !password ||
                  Object.keys(formErrors).length > 0 ||
                  isLoading
                }
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <>
                    <Text style={styles.buttonText}>Sign In</Text>
                    <ArrowRight color="#fff" size={18} />
                  </>
                )}
              </TouchableOpacity>
            </View>
          )}

          {/* Social Logins */}
          <View style={styles.socialContainer}>
            <Text style={styles.dividerText}>or continue with</Text>
            <View style={styles.socialButtons}>
              {["🇬", "📘", "🍎"].map((icon, i) => (
                <TouchableOpacity
                  key={i}
                  style={styles.socialButton}
                  onPress={onSignIn}
                >
                  <Text style={{ fontSize: 18 }}>{icon}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Sign Up */}
          <View style={styles.signupContainer}>
            <Text style={styles.signInText}>Don’t have an account?</Text>
            <TouchableOpacity onPress={onNavigateToSignUp}>
              <Text style={styles.linkText}> Sign up</Text>
            </TouchableOpacity>
          </View>

          {/* Terms */}
          <Text style={styles.termsText}>
            By signing in, you agree to our{" "}
            <Text style={styles.linkText}>Terms of Service</Text> and{" "}
            <Text style={styles.linkText}>Privacy Policy</Text>.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  logoContainer: { alignItems: "center", marginBottom: 20 },
  logoOuter: {
    width: 70,
    height: 70,
    backgroundColor: "#007bff",
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  logoInner: {
    width: 40,
    height: 40,
    backgroundColor: "#fff",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  logoDot: { width: 20, height: 20, backgroundColor: "#007bff", borderRadius: 10 },
  title: { fontSize: 22, fontWeight: "700", color: "#111827" },
  subtitle: { fontSize: 14, color: "#6b7280" },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#e5e7eb",
    borderRadius: 12,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
  },
  activeTab: {
    backgroundColor: "#fff",
  },
  tabText: {
    marginLeft: 6,
    color: "#6b7280",
    fontWeight: "500",
  },
  activeTabText: {
    color: "#007bff",
  },
  form: { paddingHorizontal: 20 },
  label: { fontSize: 14, color: "#374151", marginBottom: 4 },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: "#111827",
    backgroundColor: "#fff",
  },
  phoneRow: { flexDirection: "row", alignItems: "center" },
  countryCode: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRightWidth: 0,
    borderRadius: 8,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    backgroundColor: "#f3f4f6",
  },
  passwordRow: { flexDirection: "row", alignItems: "center" },
  button: {
    backgroundColor: "#007bff",
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 12,
    marginTop: 20,
  },
  buttonDisabled: { opacity: 0.5 },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    marginRight: 8,
    fontSize: 16,
  },
  errorText: { color: "#ef4444", fontSize: 12, marginTop: 4 },
  helperText: { color: "#6b7280", fontSize: 12, marginTop: 4 },
  linkText: { color: "#007bff", fontWeight: "500" },
  forgotBtn: { alignSelf: "flex-end", marginTop: 6 },
  socialContainer: { alignItems: "center", marginTop: 30 },
  dividerText: { fontSize: 13, color: "#6b7280", marginBottom: 12 },
  socialButtons: { flexDirection: "row", justifyContent: "center" },
  socialButton: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 25,
    marginHorizontal: 6,
  },
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  signInText: { color: "#6b7280", fontSize: 14 },
  termsText: {
    textAlign: "center",
    fontSize: 12,
    color: "#6b7280",
    marginTop: 20,
    paddingHorizontal: 30,
    lineHeight: 18,
  },
});
