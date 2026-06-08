import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface StudentApplicationCardProps {
  post: any;
  onChangeStatus: (id: string, estado: string) => void;
  openLink: (url: string) => void;
}

export default function StudentApplicationCard({ post, onChangeStatus, openLink }: StudentApplicationCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{post.estudiantes?.nombre_completo || 'Estudiante Desconocido'}</Text>
      <Text style={styles.cardDetailBold}>Oferta: {post.ofertas?.titulo || 'Práctica General'}</Text>
      <Text style={styles.cardDetail}>{post.estudiantes?.carrera} - Semestre {post.estudiantes?.semestre}</Text>
      <Text style={styles.cardDetail}>Estado actual: {post.estado}</Text>
      
      <View style={styles.studentLinksRow}>
        {post.estudiantes?.enlace_profesional ? (
          <TouchableOpacity onPress={() => openLink(post.estudiantes.enlace_profesional)} style={styles.linkBtn}>
            <Ionicons name="logo-linkedin" size={16} color="#0A66C2" />
            <Text style={styles.linkBtnText}>LinkedIn / Portfolio</Text>
          </TouchableOpacity>
        ) : null}
        {post.estudiantes?.cv_url ? (
          <TouchableOpacity onPress={() => openLink(post.estudiantes.cv_url)} style={styles.linkBtn}>
            <Ionicons name="document-text" size={16} color="#E74C3C" />
            <Text style={[styles.linkBtnText, { color: '#E74C3C' }]}>Ver CV (PDF)</Text>
          </TouchableOpacity>
        ) : null}
      </View>
      
      <View style={styles.actionsRow}>
        <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#7B88FF' }]} onPress={() => onChangeStatus(post.id, 'entrevista')}>
          <Text style={styles.actionBtnText}>Entrevista</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#52B788' }]} onPress={() => onChangeStatus(post.id, 'aceptado')}>
          <Text style={styles.actionBtnText}>Aceptar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#FF5A5A' }]} onPress={() => onChangeStatus(post.id, 'rechazado')}>
          <Text style={styles.actionBtnText}>Rechazar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#FFF', padding: 15, borderRadius: 12, marginBottom: 15, borderWidth: 1, borderColor: '#EEE' },
  cardTitle: { fontSize: 16, fontWeight: 'bold' },
  cardDetail: { fontSize: 14, color: '#666', marginBottom: 5 },
  cardDetailBold: { fontSize: 14, color: '#333', fontWeight: 'bold', marginBottom: 5 },
  studentLinksRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginVertical: 10 },
  linkBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F0F0F0', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 16 },
  linkBtnText: { color: '#0A66C2', fontSize: 13, fontWeight: '600', marginLeft: 6 },
  actionsRow: { flexDirection: 'row', marginTop: 10, gap: 10 },
  actionBtn: { flex: 1, padding: 8, borderRadius: 8, alignItems: 'center' },
  actionBtnText: { color: '#FFF', fontSize: 12, fontWeight: 'bold' },
});
