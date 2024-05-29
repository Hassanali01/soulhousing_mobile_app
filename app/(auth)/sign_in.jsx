import { Image, StyleSheet, Text, View, TextInput, ActivityIndicator } from "react-native";
import React, { useState, useContext } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native";
import { images } from "../../constants";
import CustomButton from "../../components/CustomButton";
import { AuthContext } from "../../components/AuthProvider";
import FormField from "../../components/FormField";
import { useRouter } from 'expo-router';
const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, error, isLoading } = useContext(AuthContext);
  const router = useRouter();

  const handleLogin = async () => {
    await login(email, password);
    router.push('/home'); // Navigate to Home after successful login
  };
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.container}>
          <View style={styles.innerContainer}>
            <View style={styles.logoContainer}>
              <Image
                source={images.soulhousing}
                style={styles.logo}
                resizeMode='contain'
              />
            </View>
            <View style={styles.formContainer} >
              {error && <Text style={styles.errorText}>{error}</Text>}
              <TextInput
                style={[styles.inputBox, styles.mt4]}
                onChangeText={setEmail}
                value={email}
                placeholder="Email"
                placeholderTextColor="gray"
                textContentType="emailAddress"
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <TextInput
                style={[styles.passwordBox, styles.mt4]}
                onChangeText={setPassword}
                value={password}
                placeholder="Password"
                placeholderTextColor="gray"
                autoCapitalize="none"
                secureTextEntry={true}
              />
              {isLoading ? (
                <ActivityIndicator size="large" color="#fff" style={styles.mt5} />
              ) : (
                <CustomButton
                  title="Login"
                  handlePress={() => login(email, password)}
                  style={styles.mt5}
                />
              )}
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignIn;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#1d9bf1',
    // width:'100%'
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    width:'100%'
  },
  innerContainer: {
    marginTop: 30,
    width: "100%",
    padding:20
  },
  logoContainer: {
    alignItems: 'center',
  },
  logo: {
    maxWidth: 360,
    
    height: 300,
  },
  formContainer: {
    marginTop: 10,
  },
  inputBox: {
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 10,

  },
  passwordBox: {
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 10,
    marginBottom:16

  },
  mt4: {
    marginTop: 16,
  },
  mt5: {
    marginTop: 22,
  },
  errorText: {
    color: 'red',
  },
});
