import React from 'react';
import { Modal, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface NotificationsModalProps {
  visible: boolean;
  onClose: () => void;
  notifications: any[];
}

export default function NotificationsModal({ visible, onClose, notifications }: NotificationsModalProps) {
  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Notificaciones</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
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
  );
}

const styles = StyleSheet.create({
  modalContainer: { flex: 1, backgroundColor: '#FFF' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: '#EBEBEB' },
  modalTitle: { fontSize: 22, fontWeight: 'bold', color: '#1A1A1A' },
  closeBtn: { padding: 4 },
  notificationsScroll: { flex: 1, padding: 20 },
  notificationCard: { flexDirection: 'row', marginBottom: 20, alignItems: 'flex-start' },
  notifIconContainer: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  notifContent: { flex: 1, borderBottomWidth: 1, borderBottomColor: '#F0F0F0', paddingBottom: 15 },
  notifTitle: { fontSize: 16, fontWeight: 'bold', color: '#1A1A1A', marginBottom: 4 },
  notifBody: { fontSize: 14, color: '#666', lineHeight: 20, marginBottom: 6 },
  notifDate: { fontSize: 12, color: '#999' },
  emptyNotifs: { alignItems: 'center', marginTop: 60 },
  emptyNotifsText: { color: '#999', marginTop: 15, fontSize: 16 },
});
