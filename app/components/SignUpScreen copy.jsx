// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   SafeAreaView,
//   ScrollView,
//   KeyboardAvoidingView,
//   Platform,
// } from "react-native";
// import {
//   Eye,
//   EyeOff,
//   Phone,
//   Mail,
//   ArrowRight,
//   User,
//   MapPin,
// } from "lucide-react-native";

// import { register } from "../store/auth/authThunk";

// export default function SignUpScreen({ onSignUp, onNavigateToSignIn }) {
//   const [activeTab, setActiveTab] = useState("phone");
//   const [formData, setFormData] = useState({
//     firstName: "",
//     lastName: "",
//     phoneNumber: "",
//     email: "",
//     // password: "",
//     // confirmPassword: "",
//     city: "",
//     agreeToTerms: false,
//   });
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [otpSent, setOtpSent] = useState(false);
//   const [otp, setOtp] = useState("");

//   const handleInputChange = (field, value) => {
//     setFormData((prev) => ({ ...prev, [field]: value }));
//   };

//   const handlePhoneSignUp = () => {
//     if (formData.phoneNumber && formData.firstName && !otpSent) {
//       setOtpSent(true);
//     } else if (otp) {
//       onSignUp();
//     }
//   };





//   return (
//     <SafeAreaView style={styles.container}>
//       <KeyboardAvoidingView
//         behavior={Platform.OS === "ios" ? "padding" : "height"}
//         style={{ flex: 1 }}
//       >
//         <ScrollView
//           showsVerticalScrollIndicator={false}
//           contentContainerStyle={{ paddingVertical: 20 }}
//         >
//           {/* Logo */}
//           <View style={styles.logoContainer}>
//             <View style={styles.logoOuter}>
//               <View style={styles.logoInner}>
//                 <View style={styles.logoDot} />
//               </View>
//             </View>
//             <Text style={styles.title}>Join SuperApp!</Text>
//             <Text style={styles.subtitle}>Create your account to get started</Text>
//           </View>

//           {/* === PHONE SIGN UP === */}
//           {activeTab === "phone" && (
//             <View style={styles.form}>
//               {!otpSent ? (
//                 <>
//                   <View style={styles.row}>
//                     <View style={styles.inputContainer}>
//                       <Text style={styles.label}>First Name</Text>
//                       <TextInput
//                         style={styles.input}
//                         placeholder="First name"
//                         value={formData.firstName}
//                         onChangeText={(t) => handleInputChange("firstName", t)}
//                       />
//                     </View>
//                     <View style={styles.inputContainer}>
//                       <Text style={styles.label}>Last Name</Text>
//                       <TextInput
//                         style={styles.input}
//                         placeholder="Last name"
//                         value={formData.lastName}
//                         onChangeText={(t) => handleInputChange("lastName", t)}
//                       />
//                     </View>
//                   </View>

//                   <View style={styles.inputContainer}>
//                     <Text style={styles.label}>Phone Number</Text>
//                     <View style={styles.phoneRow}>
//                       <View style={styles.countryCode}>
//                         <Text style={{ color: "#6b7280" }}>+91</Text>
//                       </View>
//                       <TextInput
//                         style={[styles.input, { flex: 1 }]}
//                         placeholder="Enter phone number"
//                         keyboardType="number-pad"
//                         maxLength={10}
//                         value={formData.phoneNumber}
//                         onChangeText={(t) => handleInputChange("phoneNumber", t)}
//                       />
//                     </View>
//                   </View>

//                   <View style={styles.inputContainer}>
//                     <Text style={styles.label}>Email</Text>
//                     <View style={styles.phoneRow}>
//                       {/* <View style={styles.countryCode}>
//                         <Text style={{ color: "#6b7280" }}>+91</Text>
//                       </View> */}
//                       <TextInput
//                         style={[styles.input, { flex: 1 }]}
//                         placeholder="Enter email"
//                         keyboardType="email"
//                         maxLength={10}
//                         value={formData.email}
//                         onChangeText={(t) => handleInputChange("email", t)}
//                       />
//                     </View>
//                   </View>

//                   <View style={styles.inputContainer}>
//                     <Text style={styles.label}>City</Text>
//                     <TextInput
//                       style={styles.input}
//                       placeholder="Enter your city"
//                       value={formData.city}
//                       onChangeText={(t) => handleInputChange("city", t)}
//                     />
//                   </View>
//                 </>
//               ) : (
//                 <View style={styles.inputContainer}>
//                   <Text style={styles.label}>Enter OTP</Text>
//                   <TextInput
//                     style={styles.input}
//                     placeholder="6-digit OTP"
//                     keyboardType="number-pad"
//                     maxLength={6}
//                     value={otp}
//                     onChangeText={setOtp}
//                   />
//                   <Text style={styles.helperText}>
//                     OTP sent to +91 {formData.phoneNumber}
//                   </Text>
//                   <TouchableOpacity onPress={() => setOtpSent(false)}>
//                     <Text style={styles.linkText}>Change details</Text>
//                   </TouchableOpacity>
//                 </View>
//               )}

//               <TouchableOpacity
//                 style={[
//                   styles.button,
//                   (!formData.phoneNumber || !formData.firstName) &&
//                     !otpSent &&
//                     styles.buttonDisabled,
//                 ]}
//                 onPress={handlePhoneSignUp}
//                 disabled={
//                   ((!formData.phoneNumber || !formData.firstName) &&
//                     !otpSent) ||
//                   (otpSent && !otp)
//                 }
//               >
//                 <Text style={styles.buttonText}>
//                   {!otpSent ? "Send OTP" : "Verify & Create Account"}
//                 </Text>
//                 <ArrowRight color="#fff" size={18} />
//               </TouchableOpacity>
//             </View>
//           )}


//           {/* Already have account */}
//           <View style={styles.signInContainer}>
//             <Text style={styles.signInText}>Already have an account?</Text>
//             <TouchableOpacity onPress={onNavigateToSignIn}>
//               <Text style={styles.linkText}> Sign in</Text>
//             </TouchableOpacity>
//           </View>

//           {/* Terms */}
//           <Text style={styles.termsText}>
//             By creating an account, you agree to our{" "}
//             <Text style={styles.linkText}>Terms of Service</Text> and{" "}
//             <Text style={styles.linkText}>Privacy Policy</Text>.
//           </Text>
//         </ScrollView>
//       </KeyboardAvoidingView>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#f8fafc" ,paddingTop:10},
//   logoContainer: { alignItems: "center", marginBottom: 20 },
//   logoOuter: {
//     width: 70,
//     height: 70,
//     backgroundColor: "#007bff",
//     borderRadius: 35,
//     justifyContent: "center",
//     alignItems: "center",
//     marginBottom: 12,
//   },
//   logoInner: {
//     width: 40,
//     height: 40,
//     backgroundColor: "#fff",
//     borderRadius: 20,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   logoDot: { width: 20, height: 20, backgroundColor: "#007bff", borderRadius: 10 },
//   title: { fontSize: 22, fontWeight: "700", color: "#111827" },
//   subtitle: { fontSize: 14, color: "#6b7280" },
//   tabContainer: {
//     flexDirection: "row",
//     backgroundColor: "#e5e7eb",
//     borderRadius: 12,
//     marginHorizontal: 20,
//     marginBottom: 20,
//   },
//   tab: {
//     flex: 1,
//     paddingVertical: 10,
//     flexDirection: "row",
//     justifyContent: "center",
//     alignItems: "center",
//     borderRadius: 12,
//   },
//   activeTab: {
//     backgroundColor: "#fff",
//   },
//   tabText: {
//     marginLeft: 6,
//     color: "#6b7280",
//     fontWeight: "500",
//   },
//   activeTabText: {
//     color: "#007bff",
//   },
//   form: { paddingHorizontal: 20 },
//   inputContainer: { marginBottom: 12 },
//   label: { fontSize: 14, color: "#374151", marginBottom: 4 },
//   input: {
//     borderWidth: 1,
//     borderColor: "#d1d5db",
//     borderRadius: 8,
//     paddingHorizontal: 12,
//     paddingVertical: 10,
//     fontSize: 14,
//     color: "#111827",
//     backgroundColor: "#fff",
//   },
//   phoneRow: { flexDirection: "row", alignItems: "center" },
//   countryCode: {
//     paddingHorizontal: 12,
//     paddingVertical: 10,
//     borderWidth: 1,
//     borderColor: "#d1d5db",
//     borderRightWidth: 0,
//     borderRadius: 8,
//     borderTopRightRadius: 0,
//     borderBottomRightRadius: 0,
//     backgroundColor: "#f3f4f6",
//   },
//   passwordRow: { flexDirection: "row", alignItems: "center" },
//   button: {
//     backgroundColor: "#007bff",
//     borderRadius: 10,
//     flexDirection: "row",
//     justifyContent: "center",
//     alignItems: "center",
//     paddingVertical: 12,
//     marginTop: 10,
//   },
//   buttonDisabled: { opacity: 0.5 },
//   buttonText: {
//     color: "#fff",
//     fontWeight: "600",
//     marginRight: 8,
//     fontSize: 16,
//   },
//   helperText: { color: "#6b7280", fontSize: 12, marginTop: 4 },
//   linkText: { color: "#007bff", fontWeight: "500" },
//   errorText: { color: "#ef4444", fontSize: 12, marginTop: 4 },
//   row: { flexDirection: "row", justifyContent: "space-between" },
//   signInContainer: {
//     flexDirection: "row",
//     justifyContent: "center",
//     marginTop: 20,
//   },
//   signInText: { color: "#6b7280", fontSize: 14 },
//   termsText: {
//     textAlign: "center",
//     fontSize: 12,
//     color: "#6b7280",
//     marginTop: 20,
//     paddingHorizontal: 30,
//     lineHeight: 18,
//   },
// });
