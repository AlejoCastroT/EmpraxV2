import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface InterviewCardProps {
  entrevista: any;
  onContactRRHH: (empresaNombre: string) => void;
}

export default function InterviewCard({ entrevista, onContactRRHH }: InterviewCardProps) {
  return (
    <View style={styles.modernInterviewCard}>
      <Text style={styles.interviewTitle}>{entrevista.empresas?.nombre.toUpperCase()}.</Text>
      <Text style={styles.interviewRole}>{entrevista.empresas?.sector}</Text>
      <Text style={styles.interviewDetail}>📅 {entrevista.fecha_inicio || 'Fecha por definir'}</Text>
      <Text style={styles.interviewDetail}>📹 Modalidad Virtual</Text>
      
      <TouchableOpacity 
        style={styles.contactBtn} 
        onPress={() => onContactRRHH(entrevista.empresas?.nombre || 'empresa')}
      >
        <Ionicons name="mail-outline" size={16} color="#FFF" />
        <Text style={styles.contactBtnText}>Contactar RRHH</Text>
      </TouchableOpacity>

      <View style={styles.interviewLogo}>
        <Text style={styles.interviewLogoText}>{entrevista.empresas?.nombre.charAt(0)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  modernInterviewCard: {
    backgroundColor: '#7B88FF',
    borderRadius: 20,
    padding: 25,
    position: 'relative',
    marginBottom: 30,
    shadowColor: '#7B88FF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  interviewTitle: { fontSize: 22, fontWeight: 'bold', color: '#FFF', marginBottom: 5 },
  interviewRole: { fontSize: 14, color: '#E0E0FF', marginBottom: 15 },
  interviewDetail: { fontSize: 13, color: '#FFF', marginBottom: 5 },
  contactBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.2)', alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 16, marginTop: 10 },
  contactBtnText: { color: '#FFF', fontWeight: 'bold', marginLeft: 6, fontSize: 13 },
  interviewLogo: { position: 'absolute', right: 20, bottom: 20, width: 60, height: 60, backgroundColor: '#1A1A1A', borderRadius: 30, justifyContent: 'center', alignItems: 'center' },
  interviewLogoText: { color: '#FFF', fontSize: 28, fontWeight: 'bold' },
});
