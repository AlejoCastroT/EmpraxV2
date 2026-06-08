import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Alert, Linking, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';
import { supabase } from '../../lib/supabase';

import AdminOfferCard from './cards/AdminOfferCard';
import CreateOfferModal from './modals/CreateOfferModal';

// Añadimos refreshTrigger en los props
export default function AdminDashboard({ session, perfil, onLogout, refreshTrigger }: any) {
  const [ofertas, setOfertas] = useState<any[]>([]);
  const [postulaciones, setPostulaciones] = useState<any[]>([]);
  const [showNewOfferModal, setShowNewOfferModal] = useState(false);
  const [newOffer, setNewOffer] = useState({ 
    titulo: '', descripcion: '', acerca_empleo: '', requisitos: '', beneficios: '', salario: '',
    modalidad: 'Presencial', tiempo: 'Tiempo Completo' 
  });

  // Escuchamos el refreshTrigger para recargar automáticamente y configuramos suscripciones en tiempo real
  useEffect(() => {
    fetchData();

    // Configurar suscripciones en tiempo real para ofertas
    const ofertasSubscription = supabase
      .channel('public:ofertas')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'ofertas', filter: `empresa_id=eq.${session.user.id}` }, () => {
        fetchData();
      })
      .subscribe();

    // Configurar suscripciones en tiempo real para practicas (postulaciones)
    const practicasSubscription = supabase
      .channel('public:practicas')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'practicas', filter: `empresa_id=eq.${session.user.id}` }, () => {
        fetchData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(ofertasSubscription);
      supabase.removeChannel(practicasSubscription);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshTrigger]);

  const fetchData = async () => {
    const { data: ofertasData } = await supabase.from('ofertas').select('*').eq('empresa_id', session.user.id);
    if (ofertasData) setOfertas(ofertasData);

    const { data: practicasData } = await supabase.from('practicas')
      .select('*, estudiantes(nombre_completo, carrera, semestre, enlace_profesional, cv_url), ofertas(titulo)')
      .eq('empresa_id', session.user.id);
    if (practicasData) setPostulaciones(practicasData);
  };

  const handleCreateOffer = async () => {
    if (!newOffer.titulo || !newOffer.descripcion) {
      Toast.show({ type: 'error', text1: 'Error', text2: 'Por favor completa título y descripción.' });
      return;
    }
    
    const { error } = await supabase.from('ofertas').insert([{
      empresa_id: session.user.id,
      titulo: newOffer.titulo,
      descripcion: newOffer.descripcion,
      acerca_empleo: newOffer.acerca_empleo,
      requisitos: newOffer.requisitos,
      beneficios: newOffer.beneficios,
      salario: newOffer.salario,
      modalidad: newOffer.modalidad,
      tiempo: newOffer.tiempo,
    }]);

    if (!error) {
      Toast.show({ type: 'success', text1: 'Éxito', text2: 'Oferta creada correctamente.' });
      setShowNewOfferModal(false);
      setNewOffer({ titulo: '', descripcion: '', acerca_empleo: '', requisitos: '', beneficios: '', salario: '', modalidad: 'Presencial', tiempo: 'Tiempo Completo' });
      fetchData();
    } else {
      Toast.show({ type: 'error', text1: 'Error al crear', text2: 'Asegúrate de haber actualizado la tabla ofertas en Supabase.' });
      console.error(error);
    }
  };

  const handleDeleteOffer = (id: string, titulo: string) => {
    Alert.alert('Eliminar Oferta', `¿Estás seguro de eliminar la oferta "${titulo}"? Esta acción también eliminará las postulaciones asociadas.`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Eliminar', style: 'destructive', onPress: async () => {
          const { error } = await supabase.from('ofertas').delete().eq('id', id);
          if (!error) {
            Toast.show({ type: 'success', text1: 'Oferta eliminada', text2: 'Se ha eliminado correctamente.' });
            fetchData();
          } else {
            Toast.show({ type: 'error', text1: 'Error', text2: 'No se pudo eliminar la oferta.' });
            console.error(error);
          }
        }
      }
    ]);
  };

  const handleChangeStatus = async (id: string, nuevoEstado: string) => {
    const { error } = await supabase.from('practicas').update({ estado: nuevoEstado }).eq('id', id);
    if (!error) {
      Toast.show({ type: 'success', text1: 'Estado actualizado', text2: `La postulación ahora está en ${nuevoEstado}.` });
      fetchData();
    }
  };

  const openLink = (url: string) => {
    if (!url) return;
    let finalUrl = url;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      finalUrl = 'https://' + url;
    }
    Linking.openURL(finalUrl).catch(err => console.error("Couldn't load page", err));
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scroll}>
        <View style={styles.header}>
          <Text style={styles.title}>Panel de <Text style={styles.titleBlue}>Universidad / Empresa</Text></Text>
          <Text style={styles.subtitle}>{perfil?.nombre || 'Administrador'}</Text>
        </View>

        <TouchableOpacity style={styles.createBtn} onPress={() => setShowNewOfferModal(true)}>
          <Ionicons name="add-circle" size={24} color="#FFF" />
          <Text style={styles.createBtnText}>Subir Nueva Oferta</Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Tus Ofertas Activas</Text>
        {ofertas.length === 0 ? (
          <View style={styles.emptyStateContainer}>
            <View style={styles.emptyStateIconBg}>
              <Ionicons name="briefcase" size={40} color="#0A66C2" />
            </View>
            <Text style={styles.emptyStateTitle}>Sin ofertas activas</Text>
            <Text style={styles.emptyStateDesc}>No has publicado ninguna oferta todavía. Crea una para empezar a recibir postulaciones.</Text>
          </View>
        ) : (
          ofertas.map((of) => (
            <AdminOfferCard key={of.id} oferta={of} onDelete={handleDeleteOffer} />
          ))
        )}

        <Text style={styles.sectionTitle}>Postulaciones de Estudiantes</Text>
        {postulaciones.length === 0 ? (
          <View style={styles.emptyStateContainer}>
            <View style={[styles.emptyStateIconBg, { backgroundColor: 'rgba(46, 204, 113, 0.1)' }]}>
              <Ionicons name="people" size={40} color="#2ECC71" />
            </View>
            <Text style={styles.emptyStateTitle}>Sin postulaciones</Text>
            <Text style={styles.emptyStateDesc}>Aún no hay estudiantes postulados a tus ofertas.</Text>
          </View>
        ) : (
          postulaciones.map((post) => (
            <View key={post.id} style={styles.card}>
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
                <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#7B88FF' }]} onPress={() => handleChangeStatus(post.id, 'entrevista')}>
                  <Text style={styles.actionBtnText}>Entrevista</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#52B788' }]} onPress={() => handleChangeStatus(post.id, 'aceptado')}>
                  <Text style={styles.actionBtnText}>Aceptar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#FF5A5A' }]} onPress={() => handleChangeStatus(post.id, 'rechazado')}>
                  <Text style={styles.actionBtnText}>Rechazar</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
        
        <TouchableOpacity style={styles.logoutBtn} onPress={onLogout}>
          <Text style={styles.logoutBtnText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </ScrollView>

      <CreateOfferModal
        visible={showNewOfferModal}
        onClose={() => setShowNewOfferModal(false)}
        newOffer={newOffer}
        setNewOffer={setNewOffer}
        handleCreateOffer={handleCreateOffer}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  scroll: { padding: 20 },
  header: { marginBottom: 20 },
  title: { fontSize: 24, fontWeight: 'bold' },
  titleBlue: { color: '#0A66C2' },
  subtitle: { fontSize: 16, color: '#666' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginTop: 20, marginBottom: 10 },
  createBtn: { flexDirection: 'row', backgroundColor: '#0A66C2', padding: 15, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  createBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 16, marginLeft: 10 },
  logoutBtn: { marginTop: 30, padding: 15, alignItems: 'center', marginBottom: 50 },
  logoutBtnText: { color: '#FF5A5A', fontWeight: 'bold', fontSize: 16 },
  
  card: { backgroundColor: '#FFF', padding: 15, borderRadius: 12, marginBottom: 15, borderWidth: 1, borderColor: '#EEE' },
  cardTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 5 },
  cardDetailBold: { fontSize: 14, fontWeight: 'bold', color: '#333', marginBottom: 2 },
  cardDetail: { fontSize: 14, color: '#666', marginBottom: 2 },
  studentLinksRow: { flexDirection: 'row', marginTop: 10, marginBottom: 10 },
  linkBtn: { flexDirection: 'row', alignItems: 'center', marginRight: 15, padding: 5, backgroundColor: '#F0F4F8', borderRadius: 8 },
  linkBtnText: { marginLeft: 5, color: '#0A66C2', fontSize: 14, fontWeight: '500' },
  actionsRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  actionBtn: { flex: 1, padding: 10, borderRadius: 8, alignItems: 'center', marginHorizontal: 4 },
  actionBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 14 },

  emptyStateContainer: {
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 1,
    marginBottom: 20,
    marginTop: 10,
  },
  emptyStateIconBg: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(10, 102, 194, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateDesc: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  }
});