import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { HelperText, Text, TextInput } from "react-native-paper";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import PrimaryButton from "common/components/buttons/PrimaryButton";
import { useAuth } from "common/context/AuthContext";
import { AuthStackParamList } from "../navigation/AuthNavigation";

type Props = NativeStackScreenProps<AuthStackParamList, "Register">;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function RegisterScreen({ navigation }: Props) {
  const { register } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRegister = async () => {
    setError(null);

    if (!EMAIL_PATTERN.test(email.trim())) {
      setError("Enter a valid email address.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    const result = await register(email, password);
    setIsSubmitting(false);

    if (!result.ok) {
      setError(result.error ?? "Registration failed.");
    }
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>
        Create account
      </Text>
      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        style={styles.input}
      />
      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={!showPassword}
        autoCapitalize="none"
        autoComplete="new-password"
        right={
          <TextInput.Icon
            icon={showPassword ? "eye-off" : "eye"}
            onPress={() => setShowPassword((prev) => !prev)}
          />
        }
        style={styles.input}
      />
      <TextInput
        label="Confirm password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry={!showPassword}
        autoCapitalize="none"
        autoComplete="new-password"
        style={styles.input}
      />
      {error ? (
        <HelperText type="error" visible={Boolean(error)}>
          {error}
        </HelperText>
      ) : null}
      <PrimaryButton onPress={handleRegister} disabled={isSubmitting}>
        {isSubmitting ? "Creating account..." : "Create account"}
      </PrimaryButton>
      <Text style={styles.link} onPress={() => navigation.navigate("Login")}>
        Already have an account? Sign in
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },
  title: {
    marginBottom: 24,
    textAlign: "center",
  },
  input: {
    marginBottom: 12,
  },
  link: {
    marginTop: 24,
    textAlign: "center",
    textDecorationLine: "underline",
  },
});
