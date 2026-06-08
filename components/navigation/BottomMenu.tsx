// components/BottomMenu.tsx

import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from 'react-native';

interface BottomMenuProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
}

export default function BottomMenu({
  activeTab,
  setActiveTab,
  onLogout,
}: BottomMenuProps) {
  const [modalVisible, setModalVisible] = useState(false);

  const handleNavigation = (tab: string) => {
    setActiveTab(tab);
    setModalVisible(false);
  };

  return (
    <>
      {/* BOTÓN FLOTANTE */}
      <TouchableOpacity
        style={[
          styles.fab,
          modalVisible && styles.fabActive
        ]}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.8}
      >
        <FontAwesome5
          name="graduation-cap"
          size={24}
          color="#FFFFFF"
        />
      </TouchableOpacity>

      {/* MODAL */}
      <Modal
        transparent
        visible={modalVisible}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          activeOpacity={1}
          style={styles.overlay}
          onPress={() => setModalVisible(false)}
        >
          <TouchableWithoutFeedback>
            <View style={styles.floatingMenu}>
              
              {/* Flecha */}
              <View style={styles.menuArrow} />

              {/* Título */}
              <Text style={styles.menuTitle}>
                Navegación
              </Text>

              {/* Inicio */}
              <TouchableOpacity
                style={[
                  styles.menuItem,
                  activeTab === 'Inicio' &&
                    styles.activeMenuItem,
                ]}
                onPress={() =>
                  handleNavigation('Inicio')
                }
              >
                <Ionicons
                  name="home"
                  size={22}
                  color={
                    activeTab === 'Inicio'
                      ? '#52B788'
                      : '#555'
                  }
                />

                <Text
                  style={[
                    styles.menuText,
                    activeTab === 'Inicio' &&
                      styles.activeMenuText,
                  ]}
                >
                  Inicio
                </Text>
              </TouchableOpacity>

              {/* Ofertas */}
              <TouchableOpacity
                style={[
                  styles.menuItem,
                  activeTab === 'Ofertas' &&
                    styles.activeMenuItem,
                ]}
                onPress={() =>
                  handleNavigation('Ofertas')
                }
              >
                <Ionicons
                  name="briefcase"
                  size={22}
                  color={
                    activeTab === 'Ofertas'
                      ? '#52B788'
                      : '#555'
                  }
                />

                <Text
                  style={[
                    styles.menuText,
                    activeTab === 'Ofertas' &&
                      styles.activeMenuText,
                  ]}
                >
                  Ofertas
                </Text>
              </TouchableOpacity>

              {/* Favoritos */}
              <TouchableOpacity
                style={[
                  styles.menuItem,
                  activeTab === 'Favoritos' &&
                    styles.activeMenuItem,
                ]}
                onPress={() =>
                  handleNavigation('Favoritos')
                }
              >
                <Ionicons
                  name="bookmark"
                  size={22}
                  color={
                    activeTab === 'Favoritos'
                      ? '#52B788'
                      : '#555'
                  }
                />

                <Text
                  style={[
                    styles.menuText,
                    activeTab === 'Favoritos' &&
                      styles.activeMenuText,
                  ]}
                >
                  Favoritos
                </Text>
              </TouchableOpacity>

              {/* Separador */}
              <View style={styles.separator} />

              {/* Logout */}
              <TouchableOpacity
                style={styles.logoutItem}
                onPress={() => {
                  setModalVisible(false);
                  onLogout();
                }}
              >
                <Ionicons
                  name="log-out-outline"
                  size={22}
                  color="#FF5A5A"
                />

                <Text style={styles.logoutText}>
                  Cerrar sesión
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.20)',
  },

  /* BOTÓN BIRRETE */

  fab: {
    position: 'absolute',
    bottom: 30,
    right: 25,

    width: 68,
    height: 68,

    borderRadius: 34,

    backgroundColor: '#52B788',

    justifyContent: 'center',
    alignItems: 'center',

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.18,
    shadowRadius: 10,

    elevation: 10,
  },

  fabActive: {
    backgroundColor: '#F4B04F',
  },

  /* MENÚ */

  floatingMenu: {
    position: 'absolute',

    right: 20,
    bottom: 115,

    width: 260,

    backgroundColor: '#FFFFFF',

    borderRadius: 24,

    padding: 18,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.15,
    shadowRadius: 15,

    elevation: 20,
  },

  menuArrow: {
    position: 'absolute',

    bottom: -10,
    right: 30,

    width: 20,
    height: 20,

    backgroundColor: '#FFFFFF',

    transform: [
      {
        rotate: '45deg',
      },
    ],
  },

  menuTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111',

    marginBottom: 15,
  },

  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',

    paddingVertical: 14,
    paddingHorizontal: 14,

    borderRadius: 14,

    marginBottom: 5,
  },

  activeMenuItem: {
    backgroundColor: '#EAF8F1',
  },

  menuText: {
    marginLeft: 15,

    fontSize: 16,

    color: '#444',

    fontWeight: '600',
  },

  activeMenuText: {
    color: '#52B788',
  },

  separator: {
    height: 1,
    backgroundColor: '#EEEEEE',
    marginVertical: 10,
  },

  logoutItem: {
    flexDirection: 'row',
    alignItems: 'center',

    paddingVertical: 14,
    paddingHorizontal: 14,

    borderRadius: 14,
  },

  logoutText: {
    marginLeft: 15,

    fontSize: 16,

    fontWeight: '700',

    color: '#FF5A5A',
  },
});