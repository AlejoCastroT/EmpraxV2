import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ApplicationStatusCardProps {
  practica: any;
  nombreEmpresa: string;
  estado: string;
  onWithdraw: (id: string) => void;
  getStatusColor: (estado: string) => string;
  getStatusLabel: (estado: string) => string;
}

export default function ApplicationStatusCard({
  practica,
  nombreEmpresa,
  estado,
  onWithdraw,
  getStatusColor,
  getStatusLabel
}: ApplicationStatusCardProps) {
  return (
    <View style={styles.modernCard}>
      <View style={styles.applicationHeader}>
        <View style={styles.applicationInfo}>
          <Text style={styles.appName}>{nombreEmpresa}</Text>
          <Text style={styles.appRole}>Práctica en {practica.empresas?.sector || 'Desarrollo'}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(estado) }]}>
          <Text style={styles.statusText}>{getStatusLabel(estado)}</Text>
        </View>
      </View>
      
      <View style={styles.applicationFooter}>
        <Text style={styles.appDate}>Aplicado: {practica.fecha_inicio || 'Recientemente'}</Text>
        <TouchableOpacity 
          style={styles.withdrawBtn}
          onPress={() => onWithdraw(practica.id)}
        >
          <Ionicons name="close-circle-outline" size={16} color="#FF5A5A" />
          <Text style={styles.withdrawText}>Retirar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  modernCard: {
    backgroundColor: '#FFF',
    padding: 16,
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
  applicationHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  applicationInfo: { flex: 1, paddingRight: 10 },
  appName: { fontSize: 16, fontWeight: 'bold', color: '#1A1A1A', marginBottom: 4 },
  appRole: { fontSize: 14, color: '#666' },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  statusText: { color: '#FFF', fontSize: 12, fontWeight: 'bold' },
  applicationFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#EBEBEB' },
  appDate: { fontSize: 13, color: '#999' },
  withdrawBtn: { flexDirection: 'row', alignItems: 'center', padding: 4 },
  withdrawText: { color: '#FF5A5A', fontSize: 13, fontWeight: '600', marginLeft: 4 },
});
