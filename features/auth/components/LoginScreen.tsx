import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { HelperText, Text, TextInput } from "react-native-paper";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import PrimaryButton from "common/components/buttons/PrimaryButton";
import { useAuth } from "common/context/AuthContext";
import { AuthStackParamList } from "../navigation/AuthNavigation";

type Props = NativeStackScreenProps<AuthStackParamList, "Login">;

export default function LoginScreen({ navigation }: Props) {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async () => {
    setError(null);
    if (!email.trim() || !password) {
      setError("Email and password are required.");
      return;
    }

    setIsSubmitting(true);
    const result = await login(email, password);
    setIsSubmitting(false);

    if (!result.ok) {
      setError(result.error ?? "Login failed.");
    }
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>
        Sign in
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
        autoComplete="password"
        right={
          <TextInput.Icon
            icon={showPassword ? "eye-off" : "eye"}
            onPress={() => setShowPassword((prev) => !prev)}
          />
        }
        style={styles.input}
      />
      {error ? (
        <HelperText type="error" visible={Boolean(error)}>
          {error}
        </HelperText>
      ) : null}
      <PrimaryButton onPress={handleLogin} disabled={isSubmitting}>
        {isSubmitting ? "Signing in..." : "Sign in"}
      </PrimaryButton>
      <Text
        style={styles.link}
        onPress={() => navigation.navigate("Register")}
      >
        Create an account
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
