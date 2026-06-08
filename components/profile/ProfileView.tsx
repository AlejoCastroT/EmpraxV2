// components/ProfileView.tsx
import * as DocumentPicker from 'expo-document-picker';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Linking, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { supabase } from '../../lib/supabase';

interface ProfileProps {
  session: any;
  perfil: any;
  inicial: string;
  setActiveTab: (tab: string) => void;
  onProfileUpdated: () => void;
}

export default function ProfileView({ session, perfil, inicial, setActiveTab, onProfileUpdated }: ProfileProps) {
  const [bioTemporal, setBioTemporal] = useState('');
  const [skillsTemporal, setSkillsTemporal] = useState('');
  const [linkTemporal, setLinkTemporal] = useState('');
  const [cvUrl, setCvUrl] = useState('');
  const [subiendoCV, setSubiendoCV] = useState(false);

  useEffect(() => {
    if (perfil) {
      setBioTemporal(perfil.biografia || '');
      setSkillsTemporal(perfil.habilidades || '');
      setLinkTemporal(perfil.enlace_profesional || '');
      setCvUrl(perfil.cv_url || '');
    }
  }, [perfil]);

  const guardarPerfil = async () => {
    const { error } = await supabase.from('estudiantes').update({ biografia: bioTemporal, habilidades: skillsTemporal, enlace_profesional: linkTemporal }).eq('id', session.user.id);
    if (!error) { 
      Alert.alert('¡Excelente!', 'Perfil actualizado.'); 
      onProfileUpdated();
      setActiveTab('Inicio'); 
    }
  };

  const subirCV = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: 'application/pdf' });
      if (result.canceled) return;

      setSubiendoCV(true);
      const asset = result.assets[0];
      const fetchResponse = await fetch(asset.uri);
      const blob = await fetchResponse.blob();
      const fileName = `${session.user.id}-${Date.now()}.pdf`;

      const resultUpload = await supabase.storage.from('cvs').upload(fileName, blob, { contentType: 'application/pdf', upsert: true });
      if (resultUpload.error) throw resultUpload.error;

      const { data: { publicUrl } } = supabase.storage.from('cvs').getPublicUrl(fileName);
      await supabase.from('estudiantes').update({ cv_url: publicUrl }).eq('id', session.user.id);
      
      setCvUrl(publicUrl);
      Alert.alert('¡Listo!', 'Tu CV en PDF se ha guardado correctamente.');
    } catch (error: any) {
      console.error(error);
      Alert.alert('Error', 'No se pudo subir el archivo.');
    } finally {
      setSubiendoCV(false);
    }
  };

  return (
    <ScrollView style={styles.dashboardScroll}>
      <View style={styles.headerPerfil}>
        <View style={styles.avatarPlaceholder}>
          <Text style={styles.avatarText}>{inicial}</Text>
        </View>
        <Text style={styles.perfilNombre}>{perfil?.nombre_completo}</Text>
        <Text style={styles.perfilCarrera}>{perfil?.carrera} • Semestre {perfil?.semestre}</Text>
      </View>

      <View style={styles.formularioPerfil}>
        <Text style={styles.inputLabel}>Biografía profesional</Text>
        <TextInput style={[styles.inputUi, { height: 100, textAlignVertical: 'top' }]} multiline placeholder="Cuenta un poco sobre ti..." value={bioTemporal} onChangeText={setBioTemporal} />

        <Text style={styles.inputLabel}>Habilidades</Text>
        <TextInput style={styles.inputUi} placeholder="Ej: React, Figma, Liderazgo" value={skillsTemporal} onChangeText={setSkillsTemporal} />

        <Text style={styles.inputLabel}>LinkedIn o Portafolio</Text>
        <TextInput style={styles.inputUi} placeholder="https://..." value={linkTemporal} onChangeText={setLinkTemporal} autoCapitalize="none" />

        <View style={styles.cvContainer}>
          <Text style={styles.inputLabel}>Hoja de Vida (PDF)</Text>
          {cvUrl ? (
            <TouchableOpacity onPress={() => Linking.openURL(cvUrl)}>
              <Text style={styles.cvLinkText}>📄 Ver mi CV actual</Text>
            </TouchableOpacity>
          ) : (
            <Text style={{color: '#999', fontSize: 13, marginBottom: 10, marginLeft: 5}}>No has subido un CV aún.</Text>
          )}
          <TouchableOpacity style={styles.cvButton} onPress={subirCV} disabled={subiendoCV}>
            {subiendoCV ? <ActivityIndicator color="#4D79FF" /> : <Text style={styles.cvButtonText}>+ Subir Archivo PDF</Text>}
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.actionButton} onPress={guardarPerfil}>
          <Text style={styles.actionButtonText}>guardar mi perfil</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.volverBtn} onPress={() => setActiveTab('Inicio')}>
          <Text style={styles.volverText}>Volver al Inicio</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  dashboardScroll: { padding: 20 },
  headerPerfil: { alignItems: 'center', marginVertical: 30 },
  avatarPlaceholder: { width: 80, height: 80, backgroundColor: '#4D79FF', borderRadius: 25, justifyContent: 'center', alignItems: 'center' },
  avatarText: { color: '#FFFFFF', fontSize: 36, fontWeight: 'bold' },
  perfilNombre: { fontSize: 24, fontWeight: 'bold', color: '#1A1A1A', marginTop: 15, marginBottom: 5 },
  perfilCarrera: { fontSize: 16, color: '#666', fontWeight: '500' },
  formularioPerfil: { backgroundColor: '#FFFFFF', paddingBottom: 60 },
  inputLabel: { fontSize: 12, color: '#999', marginBottom: 5, marginLeft: 5, fontWeight: '600' },
  inputUi: { backgroundColor: '#F5F5F5', borderRadius: 12, padding: 15, fontSize: 15, color: '#333', marginBottom: 15 },
  cvContainer: { marginBottom: 25, backgroundColor: '#F8F9FA', padding: 15, borderRadius: 12, borderWidth: 1, borderColor: '#EBEBEB' },
  cvLinkText: { color: '#2ECC71', fontWeight: 'bold', fontSize: 14, marginBottom: 15, marginLeft: 5 },
  cvButton: { backgroundColor: '#E0E7FF', padding: 12, borderRadius: 8, alignItems: 'center' },
  cvButtonText: { color: '#4D79FF', fontWeight: 'bold', fontSize: 14 },
  actionButton: { backgroundColor: '#FFB84D', borderRadius: 12, padding: 15, alignItems: 'center', shadowColor: '#FFB84D', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 8, elevation: 4 },
  actionButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold', textTransform: 'lowercase' },
  volverBtn: { marginTop: 25, alignItems: 'center', padding: 10 },
  volverText: { color: '#999', fontSize: 15, fontWeight: 'bold' }
});