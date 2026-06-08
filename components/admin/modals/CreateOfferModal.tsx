import React from 'react';
import { KeyboardAvoidingView, Modal, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface CreateOfferModalProps {
  visible: boolean;
  onClose: () => void;
  newOffer: any;
  setNewOffer: (offer: any) => void;
  handleCreateOffer: () => void;
}

export default function CreateOfferModal({ visible, onClose, newOffer, setNewOffer, handleCreateOffer }: CreateOfferModalProps) {
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={onClose}>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.bottomSheetContainer}>
          <TouchableOpacity activeOpacity={1} style={{ width: '100%', height: '100%' }}>
            <View style={styles.dragHandle} />
            <View style={styles.bottomSheetHeader}>
              <Text style={styles.modalTitle}>Nueva Oferta</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeBtnIcon}>
                <Ionicons name="close-circle" size={28} color="#999" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalBody} contentContainerStyle={{ paddingBottom: 50 }}>
              <Text style={styles.label}>Título de la Oferta</Text>
              <TextInput style={styles.input} value={newOffer.titulo} onChangeText={t => setNewOffer({...newOffer, titulo: t})} placeholder="Ej. Desarrollador Frontend" />
              
              <Text style={styles.label}>Resumen (Breve descripción)</Text>
              <TextInput style={[styles.input, { height: 60 }]} multiline value={newOffer.descripcion} onChangeText={d => setNewOffer({...newOffer, descripcion: d})} placeholder="Ej. Buscamos practicante en React..." />
              
              <Text style={styles.label}>Acerca del empleo (Detalle completo)</Text>
              <TextInput style={[styles.input, { height: 80 }]} multiline value={newOffer.acerca_empleo} onChangeText={t => setNewOffer({...newOffer, acerca_empleo: t})} placeholder="Detalla de qué trata el rol y el equipo..." />
              
              <Text style={styles.label}>Requisitos</Text>
              <TextInput style={[styles.input, { height: 70 }]} multiline value={newOffer.requisitos} onChangeText={t => setNewOffer({...newOffer, requisitos: t})} placeholder="• Estudiante de últimos semestres&#10;• Conocimiento en JS" />
              
              <Text style={styles.label}>Beneficios</Text>
              <TextInput style={[styles.input, { height: 70 }]} multiline value={newOffer.beneficios} onChangeText={t => setNewOffer({...newOffer, beneficios: t})} placeholder="• Auxilio económico&#10;• Horario flexible" />
              
              <Text style={styles.label}>Salario / Auxilio Económico</Text>
              <TextInput style={styles.input} value={newOffer.salario} onChangeText={t => setNewOffer({...newOffer, salario: t})} placeholder="Ej. $1.500.000 COP o N/A" />

              <Text style={styles.label}>Modalidad</Text>
              <View style={styles.row}>
                {['Presencial', 'Híbrido', 'Remoto'].map(mod => (
                  <TouchableOpacity 
                    key={mod} 
                    style={[styles.modBtn, newOffer.modalidad === mod && styles.modBtnActive]}
                    onPress={() => setNewOffer({...newOffer, modalidad: mod})}
                  >
                    <Text style={[styles.modText, newOffer.modalidad === mod && styles.modTextActive]}>{mod}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.label}>Jornada</Text>
              <View style={styles.row}>
                {['Tiempo Completo', 'Medio Tiempo'].map(t => (
                  <TouchableOpacity 
                    key={t} 
                    style={[styles.modBtn, newOffer.tiempo === t && styles.modBtnActive]}
                    onPress={() => setNewOffer({...newOffer, tiempo: t})}
                  >
                    <Text style={[styles.modText, newOffer.tiempo === t && styles.modTextActive]}>{t}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity style={styles.saveBtn} onPress={handleCreateOffer}>
                <Text style={styles.saveBtnText}>Publicar Oferta</Text>
              </TouchableOpacity>
            </ScrollView>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  bottomSheetContainer: { backgroundColor: '#FFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, maxHeight: '90%', paddingBottom: Platform.OS === 'ios' ? 20 : 0 },
  dragHandle: { width: 40, height: 4, backgroundColor: '#CCC', borderRadius: 2, alignSelf: 'center', marginTop: 12, marginBottom: 8 },
  bottomSheetHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: '#EBEBEB' },
  closeBtnIcon: { padding: 4 },
  modalTitle: { fontSize: 20, fontWeight: 'bold' },
  modalBody: { padding: 20 },
  label: { fontSize: 13, fontWeight: 'bold', marginBottom: 5, marginTop: 15, color: '#333' },
  input: { backgroundColor: '#F5F5F5', padding: 12, borderRadius: 10, fontSize: 15 },
  row: { flexDirection: 'row', gap: 10 },
  modBtn: { flex: 1, padding: 10, borderWidth: 1, borderColor: '#CCC', borderRadius: 8, alignItems: 'center' },
  modBtnActive: { backgroundColor: '#0A66C2', borderColor: '#0A66C2' },
  modText: { color: '#666', fontSize: 12 },
  modTextActive: { color: '#FFF', fontWeight: 'bold' },
  saveBtn: { backgroundColor: '#2ECC71', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 30 },
  saveBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
});
