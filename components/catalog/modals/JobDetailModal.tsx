import React from 'react';
import { Modal, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface JobDetailModalProps {
  selectedOferta: any;
  onClose: () => void;
  yaPostulado: boolean;
  empresaNombre: string;
  handlePostularse: (ofertaId: string, empresaId: string, nombreEmpresa: string) => void;
  getRandomColor: (id: string) => string;
  getInitials: (name: string) => string;
  calcularTiempoTranscurrido: (fecha: string) => string;
}

export default function JobDetailModal({
  selectedOferta,
  onClose,
  yaPostulado,
  empresaNombre,
  handlePostularse,
  getRandomColor,
  getInitials,
  calcularTiempoTranscurrido
}: JobDetailModalProps) {
  if (!selectedOferta) return null;

  return (
    <Modal animationType="fade" visible={!!selectedOferta} onRequestClose={onClose} transparent>
      <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={onClose}>
        <TouchableOpacity activeOpacity={1} style={styles.bottomSheetContainer}>
          <View style={styles.dragHandle} />
          
          <View style={styles.bottomSheetHeader}>
            <View style={[styles.modalLogo, { backgroundColor: getRandomColor(selectedOferta.empresa_id) }]}>
              <Text style={styles.modalLogoText}>{getInitials(empresaNombre)}</Text>
            </View>
            <View style={{ flex: 1, paddingLeft: 12 }}>
              <Text style={styles.modalJobTitle}>{selectedOferta.titulo}</Text>
              <Text style={styles.modalCompanyName}>{empresaNombre}</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtnIcon}>
              <Ionicons name="close-circle" size={28} color="#999" />
            </TouchableOpacity>
          </View>

          <ScrollView style={{ backgroundColor: '#FFF' }} contentContainerStyle={styles.modalScrollContent} bounces={false}>
            <View style={styles.modalJobDetails}>
              <View style={styles.detailPill}>
                <Ionicons name="location" size={14} color="#0A66C2" />
                <Text style={styles.pillText}>{selectedOferta.modalidad || 'Presencial'}</Text>
              </View>
              <View style={styles.detailPill}>
                <Ionicons name="time" size={14} color="#0A66C2" />
                <Text style={styles.pillText}>{selectedOferta.tiempo || 'Tiempo Completo'}</Text>
              </View>
              <View style={styles.detailPill}>
                <Ionicons name="calendar" size={14} color="#0A66C2" />
                <Text style={styles.pillText}>{calcularTiempoTranscurrido(selectedOferta.fecha_creacion)}</Text>
              </View>
            </View>

            {/* Job Description Sections */}
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Acerca del empleo</Text>
              <Text style={styles.sectionText}>
                {selectedOferta.acerca_empleo || selectedOferta.descripcion || 'Detalles del empleo no especificados por la empresa.'}
              </Text>

              {selectedOferta.requisitos && (
                <>
                  <Text style={styles.sectionTitle}>Requisitos</Text>
                  <Text style={styles.sectionText}>{selectedOferta.requisitos}</Text>
                </>
              )}
              
              {selectedOferta.beneficios && (
                <>
                  <Text style={styles.sectionTitle}>Beneficios</Text>
                  <Text style={styles.sectionText}>{selectedOferta.beneficios}</Text>
                </>
              )}

              {selectedOferta.salario && (
                <>
                  <Text style={styles.sectionTitle}>Salario / Auxilio</Text>
                  <Text style={styles.sectionText}>{selectedOferta.salario}</Text>
                </>
              )}
            </View>
          </ScrollView>

          {/* Sticky Footer */}
          <View style={styles.modalFooter}>
            <TouchableOpacity 
              style={[styles.modalApplyBtn, yaPostulado && styles.postuladoBtn]} 
              disabled={yaPostulado} 
              onPress={() => {
                handlePostularse(selectedOferta.id, selectedOferta.empresa_id, empresaNombre);
                onClose();
              }}
            >
              <Ionicons name="briefcase" size={20} color={yaPostulado ? "#999" : "#FFF"} style={{ marginRight: 8 }} />
              <Text style={[styles.modalApplyText, yaPostulado && styles.postuladoText]}>
                {yaPostulado ? 'Ya estás en proceso' : 'Solicitud sencilla'}
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  bottomSheetContainer: { backgroundColor: '#FFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, maxHeight: '90%', paddingBottom: Platform.OS === 'ios' ? 20 : 0 },
  dragHandle: { width: 40, height: 4, backgroundColor: '#CCC', borderRadius: 2, alignSelf: 'center', marginTop: 12, marginBottom: 8 },
  bottomSheetHeader: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: '#EBEBEB' },
  closeBtnIcon: { padding: 4 },
  
  modalScrollContent: { paddingBottom: 100, backgroundColor: '#FFF' },
  modalLogo: { width: 50, height: 50, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  modalLogoText: { color: '#FFF', fontWeight: 'bold', fontSize: 20 },
  
  modalJobTitle: { fontSize: 18, fontWeight: 'bold', color: '#000', marginBottom: 4 },
  modalCompanyName: { fontSize: 14, color: '#666' },
  
  modalJobDetails: { flexDirection: 'row', padding: 20, gap: 10, flexWrap: 'wrap', borderBottomWidth: 1, borderBottomColor: '#EBEBEB' },
  detailPill: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(10, 102, 194, 0.08)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 },
  pillText: { fontSize: 13, color: '#0A66C2', marginLeft: 6, fontWeight: '600' },
  
  sectionContainer: { padding: 20 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#000', marginBottom: 12, marginTop: 8 },
  sectionText: { fontSize: 15, color: '#444', lineHeight: 22, marginBottom: 16 },

  modalFooter: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 16, backgroundColor: '#FFF', borderTopWidth: 1, borderTopColor: '#EBEBEB', flexDirection: 'row', justifyContent: 'center', ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: 0, height: -2 }, shadowOpacity: 0.1, shadowRadius: 4 }, android: { elevation: 8 } }) },
  modalApplyBtn: { flexDirection: 'row', backgroundColor: '#0A66C2', paddingVertical: 14, borderRadius: 24, flex: 1, justifyContent: 'center', alignItems: 'center', maxWidth: 400 },
  modalApplyText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
  postuladoBtn: { backgroundColor: '#E0E0E0' },
  postuladoText: { color: '#999' },
});
