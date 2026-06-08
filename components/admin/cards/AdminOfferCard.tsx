import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface AdminOfferCardProps {
  oferta: any;
  onDelete: (id: string, titulo: string) => void;
}

export default function AdminOfferCard({ oferta, onDelete }: AdminOfferCardProps) {
  return (
    <View style={styles.modernCard}>
      <View style={styles.cardHeaderRow}>
        <Text style={[styles.cardTitle, { flex: 1 }]}>{oferta.titulo}</Text>
        <TouchableOpacity onPress={() => onDelete(oferta.id, oferta.titulo)} style={{ padding: 4 }}>
          <Ionicons name="trash-outline" size={20} color="#FF5A5A" />
        </TouchableOpacity>
      </View>
      <Text style={styles.cardDetail}>{oferta.modalidad} • {oferta.tiempo}</Text>
      {oferta.salario ? <Text style={styles.cardDetailBold}>Salario/Auxilio: {oferta.salario}</Text> : null}
      <Text style={styles.cardDetail} numberOfLines={2}>{oferta.descripcion}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  modernCard: {
    backgroundColor: '#FFF',
    padding: 16,
    marginBottom: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.02)',
  },
  cardHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 },
  cardTitle: { fontSize: 16, fontWeight: 'bold' },
  cardDetail: { fontSize: 14, color: '#666', marginBottom: 5 },
  cardDetailBold: { fontSize: 14, color: '#333', fontWeight: 'bold', marginBottom: 5 },
});
