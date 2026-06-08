import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text } from 'react-native';
import LoginView from './LoginView';
import RegisterView from './RegisterView';

export default function AuthView() {
  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <SafeAreaView style={styles.authMainContainer}>
      <ScrollView contentContainerStyle={styles.authScroll} keyboardShouldPersistTaps="handled">
        <Text style={styles.logoText}>Emprax</Text>
        {isSignUp ? (
          <RegisterView onSwitchMode={() => setIsSignUp(false)} />
        ) : (
          <LoginView onSwitchMode={() => setIsSignUp(true)} />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  authMainContainer: { flex: 1, backgroundColor: '#F8F9FA' },
  authScroll: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 20, paddingTop: 60 },
  logoText: { fontSize: 40, fontWeight: '900', color: '#1A1A1A', marginBottom: 40, letterSpacing: -1 },
});
