import React, { useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Toast from 'react-native-toast-message';
import { supabase } from '../../lib/supabase';

interface LoginViewProps {
  onSwitchMode: () => void;
}

export default function LoginView({ onSwitchMode }: LoginViewProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    if (!email || !password) {
      Toast.show({
        type: 'error',
        text1: 'Faltan datos',
        text2: 'Por favor ingresa tu correo y contraseña.',
      });
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      Toast.show({
        type: 'error',
        text1: 'Error al acceder',
        text2: 'Revisa que tu correo y contraseña sean correctos.',
      });
    }

    setLoading(false);
  };

  return (
    <View style={styles.authCard}>
      <Text style={styles.authCardTitle}>
        Tu futuro empieza aquí
      </Text>

      <Text style={styles.authCardSubtitle}>
        Inicia{' '}
        <Text style={styles.orangeText}>sesión</Text>{' '}
        y{' '}
        <Text style={styles.blueText}>conecta</Text>{' '}
        con nuevas oportunidades.
      </Text>

      <View style={styles.inputWrapper}>
        <Text style={styles.inputLabel}>Correo</Text>

        <TextInput
          style={styles.inputUi}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          placeholder=""
          placeholderTextColor="#AAA"
        />

        <Text style={styles.inputLabel}>Contraseña</Text>

        <TextInput
          style={[styles.inputUi, { marginBottom: 40 }]}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
          placeholder=""
          placeholderTextColor="#AAA"
        />
      </View>

      <TouchableOpacity
        style={styles.actionButton}
        onPress={handleSignIn}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.actionButtonText}>
            acceder
          </Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        onPress={onSwitchMode}
        style={styles.switchContainer}
      >
        <Text style={styles.switchModeText}>
          ¿No tienes cuenta? Regístrate
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  authCard: {
    width: '92%',
    maxWidth: 380,
    minHeight: 550,
    backgroundColor: '#FFFFFF',
    borderRadius: 32,
    paddingTop: 40,
    paddingHorizontal: 35,
    paddingBottom: 35,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
  },

  authCardTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F1F1F',
    textAlign: 'center',
  },

  authCardSubtitle: {
    marginTop: 10,
    marginBottom: 55,
    textAlign: 'center',
    fontSize: 17,
    lineHeight: 24,
    color: '#1F1F1F',
  },

  orangeText: {
    color: '#F4A52A',
    fontWeight: '600',
  },

  blueText: {
    color: '#2563EB',
    fontWeight: '600',
  },

  inputWrapper: {
    width: '100%',
  },

  inputLabel: {
    fontSize: 13,
    color: '#8B8B8B',
    marginBottom: 8,
    marginLeft: 2,
  },

  inputUi: {
    height: 52,
    backgroundColor: '#F6F1F2',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 18,
    fontSize: 15,
    color: '#333',
  },

  actionButton: {
    alignSelf: 'center',
    width: 160,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: '#F5B75A',

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },

  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '500',
    textTransform: 'lowercase',
  },

  switchContainer: {
    marginTop: 25,
    alignItems: 'center',
  },

  switchModeText: {
    color: '#2563EB',
    fontSize: 13,
    fontWeight: '600',
  },
});