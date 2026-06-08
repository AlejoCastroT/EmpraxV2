// components/DashboardView.tsx
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, Linking, Modal, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ApplicationStatusCard from './cards/ApplicationStatusCard';
import InterviewCard from './cards/InterviewCard';
import NotificationsModal from './modals/NotificationsModal';

interface DashboardProps {
  primerNombre: string;
  inicial: string;
  misPracticas: any[];
  misEntrevistas: any[];
  setActiveTab: (tab: string) => void;
  handleRetirarPostulacion: (id: string) => void;
}

export default function DashboardView({ primerNombre, inicial, misPracticas, misEntrevistas, setActiveTab, handleRetirarPostulacion }: DashboardProps) {
  const [showNotifications, setShowNotifications] = useState(false);

  const getStatusColor = (estado: string) => {
    switch (estado) {
      case 'entrevista': return '#7B88FF'; // Purple/Blue
      case 'rechazado': return '#FF5A5A'; // Red
      case 'aceptado': return '#52B788'; // Green
      default: return '#F4B04F'; // Orange (en revisión / pendiente)
    }
  };

  const getStatusLabel = (estado: string) => {
    switch (estado) {
      case 'entrevista': return 'Entrevista programada';
      case 'rechazado': return 'Proceso finalizado';
      case 'aceptado': return '¡Aceptado!';
      default: return 'En revisión';
    }
  };

  // Generamos notificaciones dinámicas basadas en el estado actual para no necesitar una tabla extra en el MVP
  const notifications = [
    ...misEntrevistas.map(e => ({
      id: `ent-${e.id}`,
      icon: 'calendar',
      color: '#7B88FF',
      title: 'Entrevista Programada',
      body: `Tienes una entrevista pendiente con ${e.empresas?.nombre}. Revisa tu correo para el enlace.`,
      date: e.fecha_inicio || 'Próximamente'
    })),
    ...misPracticas.filter(p => p.estado !== 'entrevista' && p.estado !== 'rechazado').map(p => ({
      id: `prac-${p.id}`,
      icon: 'document-text',
      color: '#F4B04F',
      title: 'Postulación en Revisión',
      body: `Tu perfil en ${p.empresas?.nombre} está siendo evaluado por los reclutadores.`,
      date: p.fecha_inicio || 'Recientemente'
    }))
  ];

  const handleContactRRHH = (empresaNombre: string) => {
    // Simulamos un correo a recursos humanos de la empresa
    const email = `rrhh@${empresaNombre.toLowerCase().replace(/\s/g, '')}.com`;
    Linking.openURL(`mailto:${email}?subject=Duda sobre entrevista de práctica`);
  };

  return (
    <>
      <ScrollView style={styles.dashboardScroll}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hola, {primerNombre} 👋</Text>
            <Text style={styles.dashboardTitle}>Todo listo para</Text>
            <Text style={styles.dashboardTitleGreen}>comenzar tu práctica</Text>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.bellIcon} onPress={() => setShowNotifications(true)}>
              <Ionicons name="notifications-outline" size={28} color="#1A1A1A" />
              {notifications.length > 0 && <View style={styles.badge} />}
            </TouchableOpacity>
            <TouchableOpacity style={styles.avatarPlaceholder} onPress={() => setActiveTab('Perfil')}>
              <Text style={styles.avatarText}>{inicial}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Estado de tus Postulaciones</Text>
        <Text style={styles.sectionSubtitle}>Sigue el proceso de tus solicitudes</Text>
        
        <View style={styles.applicationsContainer}>
          {misPracticas.length > 0 ? (
            misPracticas.map((practica) => {
              const nombreEmpresa = practica.empresas?.nombre || 'Empresa';
              const estado = practica.estado || 'pendiente';
              
              return (
                <ApplicationStatusCard
                  key={practica.id}
                  practica={practica}
                  nombreEmpresa={nombreEmpresa}
                  estado={estado}
                  onWithdraw={handleRetirarPostulacion}
                  getStatusColor={getStatusColor}
                  getStatusLabel={getStatusLabel}
                />
              );
            })
          ) : (
            <View style={styles.emptyStateContainer}>
              <View style={styles.emptyStateIconBg}>
                <Ionicons name="document-text" size={40} color="#0A66C2" />
              </View>
              <Text style={styles.emptyStateTitle}>Aún no te has postulado</Text>
              <Text style={styles.emptyStateDesc}>Ve a la sección de ofertas y encuentra el lugar ideal para iniciar tu carrera.</Text>
              <TouchableOpacity onPress={() => setActiveTab('Ofertas')} style={{ marginTop: 15 }}>
                <Text style={styles.exploreText}>Explorar ofertas</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <Text style={styles.sectionTitle}>Entrevistas Próximas</Text>
        <Text style={styles.sectionSubtitle}>Tienes las siguientes entrevistas</Text>
        {misEntrevistas.length > 0 ? (
          misEntrevistas.map((entrevista) => (
            <View key={entrevista.id} style={styles.modernInterviewCard}>
              <Text style={styles.interviewTitle}>{entrevista.empresas?.nombre.toUpperCase()}.</Text>
              <Text style={styles.interviewRole}>{entrevista.empresas?.sector}</Text>
              <Text style={styles.interviewDetail}>📅 {entrevista.fecha_inicio || 'Fecha por definir'}</Text>
              <Text style={styles.interviewDetail}>📹 Modalidad Virtual</Text>
              
              <TouchableOpacity 
                style={styles.contactBtn} 
                onPress={() => handleContactRRHH(entrevista.empresas?.nombre || 'empresa')}
              >
                <Ionicons name="mail-outline" size={16} color="#FFF" />
                <Text style={styles.contactBtnText}>Contactar RRHH</Text>
              </TouchableOpacity>

              <View style={styles.interviewLogo}><Text style={styles.interviewLogoText}>{entrevista.empresas?.nombre.charAt(0)}</Text></View>
            </View>
          ))
        ) : (
          <View style={styles.emptyStateContainer}>
             <View style={[styles.emptyStateIconBg, { backgroundColor: 'rgba(123, 136, 255, 0.1)' }]}>
                <Ionicons name="calendar" size={40} color="#7B88FF" />
             </View>
             <Text style={styles.emptyStateDesc}>Aún no tienes entrevistas programadas.</Text>
          </View>
        )}
      </ScrollView>

      {/* Modal de Notificaciones */}
      <Modal visible={showNotifications} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setShowNotifications(false)}>
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Notificaciones</Text>
            <TouchableOpacity onPress={() => setShowNotifications(false)} style={styles.closeBtn}>
              <Ionicons name="close" size={24} color="#1A1A1A" />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.notificationsScroll}>
            {notifications.length > 0 ? (
              notifications.map((notif) => (
                <View key={notif.id} style={styles.notificationCard}>
                  <View style={[styles.notifIconContainer, { backgroundColor: notif.color + '20' }]}>
                    <Ionicons name={notif.icon as any} size={24} color={notif.color} />
                  </View>
                  <View style={styles.notifContent}>
                    <Text style={styles.notifTitle}>{notif.title}</Text>
                    <Text style={styles.notifBody}>{notif.body}</Text>
                    <Text style={styles.notifDate}>{notif.date}</Text>
                  </View>
                </View>
              ))
            ) : (
              <View style={styles.emptyNotifs}>
                <Ionicons name="notifications-off-outline" size={48} color="#CCC" />
                <Text style={styles.emptyNotifsText}>No tienes notificaciones nuevas.</Text>
              </View>
            )}
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  dashboardScroll: { padding: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 30, marginTop: 20 },
  greeting: { fontSize: 16, color: '#666', marginBottom: 5 },
  dashboardTitle: { fontSize: 28, fontWeight: '900', color: '#1A1A1A' },
  dashboardTitleGreen: { fontSize: 28, fontWeight: '900', color: '#2ECC71' },
  avatarPlaceholder: { width: 50, height: 50, backgroundColor: '#4D79FF', borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  avatarText: { color: '#FFFFFF', fontSize: 24, fontWeight: 'bold' },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#1A1A1A', marginTop: 10 },
  sectionSubtitle: { fontSize: 14, color: '#999', marginBottom: 15 },
  
  // New application cards styles
  applicationsContainer: { marginBottom: 30 },
  exploreText: { color: '#0A66C2', fontWeight: 'bold' },

  // Header and Notifications Styles
  headerRight: { flexDirection: 'row', alignItems: 'center' },
  bellIcon: { marginRight: 16, position: 'relative' },
  badge: { position: 'absolute', top: 0, right: 0, width: 10, height: 10, backgroundColor: '#FF5A5A', borderRadius: 5, borderWidth: 2, borderColor: '#FFF' },

  // Nuevos estilos modernos
  emptyStateContainer: {
    padding: 40,
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
  },
  modernInterviewCard: { backgroundColor: '#FFF', padding: 20, borderRadius: 16, marginBottom: 15, position: 'relative', overflow: 'hidden', borderWidth: 1, borderColor: '#F0F0F0' },
  interviewTitle: { fontSize: 18, fontWeight: 'bold', color: '#1A1A1A', marginBottom: 5 },
  interviewRole: { fontSize: 14, color: '#7B88FF', fontWeight: 'bold', marginBottom: 15 },
  interviewDetail: { fontSize: 14, color: '#666', marginBottom: 5 },
  contactBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#7B88FF', paddingHorizontal: 15, paddingVertical: 10, borderRadius: 8, alignSelf: 'flex-start', marginTop: 15 },
  contactBtnText: { color: '#FFF', fontWeight: 'bold', marginLeft: 8 },
  interviewLogo: { position: 'absolute', right: -20, top: -20, width: 100, height: 100, borderRadius: 50, backgroundColor: 'rgba(123, 136, 255, 0.1)', justifyContent: 'center', alignItems: 'center' },
  interviewLogoText: { fontSize: 40, fontWeight: 'bold', color: '#7B88FF', opacity: 0.3 },
  modalContainer: { flex: 1, backgroundColor: '#F8F9FA' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#EEE' },
  modalTitle: { fontSize: 20, fontWeight: 'bold' },
  closeBtn: { padding: 5 },
  notificationsScroll: { padding: 15 },
  notificationCard: { flexDirection: 'row', backgroundColor: '#FFF', padding: 15, borderRadius: 12, marginBottom: 12, borderWidth: 1, borderColor: '#EEE' },
  notifIconContainer: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  notifContent: { flex: 1 },
  notifTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 5 },
  notifBody: { fontSize: 14, color: '#666', marginBottom: 5 },
  notifDate: { fontSize: 12, color: '#999' },
  emptyNotifs: { alignItems: 'center', justifyContent: 'center', padding: 40, marginTop: 40 },
  emptyNotifsText: { fontSize: 16, color: '#999', marginTop: 15 }
});