import React, { useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';
import { supabase } from '../../lib/supabase';

interface RegisterViewProps {
  onSwitchMode: () => void;
}

export default function RegisterView({ onSwitchMode }: RegisterViewProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState<'estudiante' | 'universidad'>('estudiante');
  
  // Datos del estudiante
  const [nombreCompleto, setNombreCompleto] = useState('');
  const [carrera, setCarrera] = useState('');
  const [semestre, setSemestre] = useState('');

  // Datos de la universidad/empresa
  const [nombreEmpresa, setNombreEmpresa] = useState('');
  const [sector, setSector] = useState('');

  const handleSignUp = async () => {
    if (!email || !password) {
      Toast.show({ type: 'error', text1: 'Faltan datos', text2: 'Ingresa correo y contraseña.' });
      return;
    }

    if (role === 'estudiante' && !nombreCompleto) {
      Toast.show({ type: 'error', text1: 'Faltan datos', text2: 'Ingresa tu nombre completo.' });
      return;
    }

    if (role === 'universidad' && (!nombreEmpresa || !sector)) {
      Toast.show({ type: 'error', text1: 'Faltan datos', text2: 'Ingresa el nombre y sector.' });
      return;
    }

    setLoading(true);
    const correoLimpio = email.trim();

    const { data, error } = await supabase.auth.signUp({ 
      email: correoLimpio, 
      password: password 
    });

    if (error) {
      Toast.show({ type: 'error', text1: 'No se pudo registrar', text2: error.message });
      setLoading(false);
      return;
    }

    if (data?.user) {
      let dbError;
      if (role === 'estudiante') {
        const result = await supabase.from('estudiantes').insert([{ 
          id: data.user.id, 
          nombre_completo: nombreCompleto, 
          carrera: carrera, 
          semestre: parseInt(semestre, 10) || 1 
        }]);
        dbError = result.error;
      } else {
        const result = await supabase.from('empresas').insert([{
          id: data.user.id,
          nombre: nombreEmpresa,
          sector: sector
        }]);
        dbError = result.error;
      }
      
      if (dbError) {
        console.log("Error al guardar en tabla:", dbError.message);
        Toast.show({ type: 'error', text1: 'Error', text2: 'Hubo un problema guardando el perfil.' });
      } else {
        Toast.show({ type: 'success', text1: '¡Registro exitoso!', text2: 'Ahora puedes iniciar sesión.' });
        
        // 1. Matamos la sesión automática que Supabase acaba de crear
        await supabase.auth.signOut();
        
        // 2. Esperamos 1.5 segundos para que vea el Toast y luego cambiamos a Login
        setTimeout(() => {
          onSwitchMode();
        }, 1500);
      }
    }
    
    setLoading(false);
  };

  return (
    <View style={styles.authCard}>
      <Text style={styles.authCardTitle}>¡Únete a nosotros!</Text>
      <Text style={styles.authCardSubtitle}>Crea tu cuenta como:</Text>

      <View style={styles.roleContainer}>
        <TouchableOpacity 
          style={[styles.roleButton, role === 'estudiante' && styles.roleButtonActive]} 
          onPress={() => setRole('estudiante')}
        >
          <Text style={[styles.roleText, role === 'estudiante' && styles.roleTextActive]}>Estudiante</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.roleButton, role === 'universidad' && styles.roleButtonActive]} 
          onPress={() => setRole('universidad')}
        >
          <Text style={[styles.roleText, role === 'universidad' && styles.roleTextActive]}>Universidad</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.inputWrapper}>
        {role === 'estudiante' ? (
          <>
            <Text style={styles.inputLabel}>Nombre Completo</Text>
            <TextInput style={styles.inputUi} value={nombreCompleto} onChangeText={setNombreCompleto} placeholder="Ej. Alejandro Castro" />
            <Text style={styles.inputLabel}>Carrera</Text>
            <TextInput style={styles.inputUi} value={carrera} onChangeText={setCarrera} placeholder="Ej. Ingeniería" />
            <Text style={styles.inputLabel}>Semestre</Text>
            <TextInput style={styles.inputUi} value={semestre} onChangeText={setSemestre} keyboardType="numeric" placeholder="Ej. 5" />
          </>
        ) : (
          <>
            <Text style={styles.inputLabel}>Nombre de la Institución/Empresa</Text>
            <TextInput style={styles.inputUi} value={nombreEmpresa} onChangeText={setNombreEmpresa} placeholder="Ej. Universidad Nacional" />
            <Text style={styles.inputLabel}>Sector</Text>
            <TextInput style={styles.inputUi} value={sector} onChangeText={setSector} placeholder="Ej. Educación, Tecnología" />
          </>
        )}
        
        <Text style={styles.inputLabel}>Correo Institucional o Personal</Text>
        <TextInput 
          style={styles.inputUi} 
          value={email} 
          onChangeText={setEmail} 
          autoCapitalize="none" 
          keyboardType="email-address"
          placeholder="correo@ejemplo.com" 
        />
        
        <Text style={styles.inputLabel}>Contraseña</Text>
        <TextInput 
          style={styles.inputUi} 
          value={password} 
          onChangeText={setPassword} 
          secureTextEntry 
          autoCapitalize="none"
          placeholder="********" 
        />
      </View>

      <TouchableOpacity style={styles.actionButton} onPress={handleSignUp} disabled={loading}>
        {loading ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.actionButtonText}>registrarse</Text>}
      </TouchableOpacity>
      
      <TouchableOpacity onPress={onSwitchMode} style={{ marginTop: 20, alignItems: 'center' }}>
        <Text style={styles.switchModeText}>¿Ya tienes cuenta? Inicia sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  authCard: { backgroundColor: '#FFFFFF', width: '100%', borderRadius: 24, padding: 30, shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.05, shadowRadius: 20, elevation: 5 },
  authCardTitle: { fontSize: 18, fontWeight: '700', textAlign: 'center', color: '#333' },
  authCardSubtitle: { fontSize: 14, textAlign: 'center', color: '#666', marginTop: 5, marginBottom: 15 },
  roleContainer: { flexDirection: 'row', marginBottom: 20, backgroundColor: '#F0F0F0', borderRadius: 12, padding: 4 },
  roleButton: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 8 },
  roleButtonActive: { backgroundColor: '#FFFFFF', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
  roleText: { fontSize: 14, color: '#999', fontWeight: '600' },
  roleTextActive: { color: '#333' },
  inputWrapper: { marginBottom: 20 },
  inputLabel: { fontSize: 12, color: '#999', marginBottom: 5, marginLeft: 5, fontWeight: '600' },
  inputUi: { backgroundColor: '#F5F5F5', borderRadius: 12, padding: 15, fontSize: 15, color: '#333', marginBottom: 15 },
  actionButton: { backgroundColor: '#FFB84D', borderRadius: 12, padding: 15, alignItems: 'center', shadowColor: '#FFB84D', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 8, elevation: 4 },
  actionButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold', textTransform: 'lowercase' },
  switchModeText: { color: '#4D79FF', fontSize: 13, fontWeight: '600' }
});