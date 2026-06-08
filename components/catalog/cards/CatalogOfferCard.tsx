import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface CatalogOfferCardProps {
  oferta: any;
  yaPostulado: boolean;
  esFavorito: boolean;
  empresaNombre: string;
  onPress: () => void;
  onToggleFavorito?: (ofertaId: string, empresaId: string) => void;
  getRandomColor: (id: string) => string;
  getInitials: (name: string) => string;
  calcularTiempoTranscurrido: (fecha: string) => string;
}

export default function CatalogOfferCard({
  oferta,
  yaPostulado,
  esFavorito,
  empresaNombre,
  onPress,
  onToggleFavorito,
  getRandomColor,
  getInitials,
  calcularTiempoTranscurrido
}: CatalogOfferCardProps) {
  return (
    <TouchableOpacity 
      style={styles.modernCard} 
      activeOpacity={0.7}
      onPress={onPress}
    >
      <View style={styles.cardHeader}>
        <View style={[styles.cardLogo, { backgroundColor: getRandomColor(oferta.empresa_id) }]}>
          <Text style={styles.cardLogoText}>{getInitials(empresaNombre)}</Text>
        </View>
        <View style={styles.cardInfo}>
          <Text style={styles.jobTitle} numberOfLines={2}>{oferta.titulo}</Text>
          <Text style={styles.companyName}>{empresaNombre} • {oferta.empresas?.sector}</Text>
          
          <View style={styles.badgesRow}>
            <View style={[styles.badge, { backgroundColor: oferta.modalidad === 'Remoto' ? '#E1F5FE' : oferta.modalidad === 'Híbrido' ? '#F3E5F5' : '#FFF3E0' }]}>
              <Text style={[styles.badgeText, { color: oferta.modalidad === 'Remoto' ? '#2E7D32' : oferta.modalidad === 'Híbrido' ? '#6A1B9A' : '#EF6C00' }]}>{oferta.modalidad || 'Presencial'}</Text>
            </View>
            <View style={styles.badgeNeutral}>
              <Text style={styles.badgeTextNeutral}>{oferta.tiempo || 'Tiempo Completo'}</Text>
            </View>
          </View>
          
          <View style={styles.cardFooter}>
            <Text style={styles.timePosted}>{calcularTiempoTranscurrido(oferta.fecha_creacion)}</Text>
            {yaPostulado ? (
              <View style={styles.appliedBadge}>
                <Ionicons name="checkmark-circle" size={14} color="#2ECC71" />
                <Text style={styles.appliedText}>En Proceso</Text>
              </View>
            ) : (
              <View style={styles.easyApplyContainer}>
                <Text style={styles.easyApplyText}>Ver detalles</Text>
              </View>
            )}
          </View>
        </View>
        <TouchableOpacity 
          style={styles.bookmarkBtn} 
          onPress={() => onToggleFavorito && onToggleFavorito(oferta.id, oferta.empresa_id)}
        >
          <Ionicons name={esFavorito ? "bookmark" : "bookmark-outline"} size={24} color={esFavorito ? "#0A66C2" : "#999"} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  modernCard: {
    backgroundColor: '#FFF',
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.02)',
  },
  cardHeader: { flexDirection: 'row', alignItems: 'flex-start' },
  cardLogo: {
    width: 48,
    height: 48,
    borderRadius: 4, // Slightly rounded square
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cardLogoText: { color: '#FFF', fontWeight: 'bold', fontSize: 18 },
  cardInfo: { flex: 1 },
  jobTitle: { fontSize: 16, fontWeight: 'bold', color: '#000', marginBottom: 2 },
  companyName: { fontSize: 14, color: '#000', marginBottom: 2 },
  badgesRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
    marginTop: 4,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  badgeNeutral: {
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeTextNeutral: {
    color: '#666',
    fontSize: 12,
    fontWeight: '600',
  },
  cardFooter: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 8 },
  timePosted: { fontSize: 12, color: '#057642', fontWeight: '500' }, // LinkedIn green for active
  appliedBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#E8F5E9', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, marginTop: 2 },
  appliedText: { fontSize: 12, color: '#2ECC71', marginLeft: 4, fontWeight: 'bold' },
  easyApplyContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  easyApplyText: { fontSize: 12, color: '#666', marginLeft: 4, fontWeight: '500' },
  bookmarkBtn: { padding: 4 },
});
