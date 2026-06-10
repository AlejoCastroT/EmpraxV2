// app/(tabs)/index.tsx
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Alert, SafeAreaView, StyleSheet, Animated, Text, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../lib/supabase';
import Toast from 'react-native-toast-message';
import { useStudentData } from '../../hooks/services/useStudentData';

// Tus nuevos super componentes
import AdminDashboard from '../../components/admin/AdminDashboard'; // Importación de la vista de admin
import AuthView from '../../components/auth/AuthView';
import CatalogView from '../../components/catalog/CatalogView';
import DashboardView from '../../components/dashboard/DashboardView';
import BottomMenu from '../../components/navigation/BottomMenu';
import ProfileView from '../../components/profile/ProfileView';

export default function AppScreen() {
  const [session, setSession] = useState<any>(null);
  const [role, setRole] = useState<'estudiante' | 'universidad' | null>(null);
  const [activeTab, setActiveTab] = useState('Inicio');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Estado y animaciones del Splash Screen
  const [isAppReady, setIsAppReady] = useState(false);
  const splashOpacity = useRef(new Animated.Value(1)).current;
  const logoScale = useRef(new Animated.Value(0.5)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;

  // Utilizar el Custom Hook para gestionar los datos
  const {
    perfil,
    ofertasDisponibles,
    misPracticas,
    misEntrevistas,
    misFavoritos,
    loading: loadingData,
    fetchData,
    handlePostularse,
    handleRetirarPostulacion,
    handleToggleFavorito
  } = useStudentData(session, refreshTrigger);

  useEffect(() => {
    // Animación inicial: Aparece el birrete
    Animated.parallel([
      Animated.timing(logoOpacity, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.spring(logoScale, { toValue: 1, friction: 4, tension: 8, useNativeDriver: true }),
    ]).start(() => {
      // Mantiene la pantalla por 1.5s y luego se desvanece
      setTimeout(() => {
        Animated.timing(splashOpacity, { toValue: 0, duration: 500, useNativeDriver: true }).start(() => {
          setIsAppReady(true);
        });
      }, 1500);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkUserRole = useCallback(async (userId: string) => {
    // Si no encontramos un estudiante, verificamos si es empresa
    const { data: empresa } = await supabase.from('empresas').select('id').eq('id', userId).single();
    if (empresa) {
      setRole('universidad');
    } else {
      setRole('estudiante');
      // No necesitamos llamar a fetchData() aquí manualmente porque useEffect en el hook reacciona a session.user.id
    }
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) checkUserRole(session.user.id);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) checkUserRole(session.user.id);
      else {
        setRole(null);
      }
    });

    return () => authListener.subscription.unsubscribe();
  }, [checkUserRole]);

  const handleLogout = async () => {
    if (Platform.OS === 'web') {
      const confirm = window.confirm('¿Estás seguro de que quieres salir?');
      if (confirm) {
        await supabase.auth.signOut();
        setSession(null);
        setRole(null);
        setActiveTab('Inicio');
      }
      return;
    }

    Alert.alert('Cerrar Sesión', '¿Estás seguro de que quieres salir?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Salir', style: 'destructive', onPress: async () => {
          await supabase.auth.signOut();
          setSession(null);
          setRole(null);
          setActiveTab('Inicio');
        }
      }
    ]);
  };

  const handleSignOut = async () => {
    if (Platform.OS === 'web') {
      const confirm = window.confirm('¿Estás seguro de que quieres salir?');
      if (confirm) {
        await supabase.auth.signOut();
        setRole(null);
      }
      return;
    }

    Alert.alert('Cerrar Sesión', '¿Estás seguro de que quieres salir?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Salir', style: 'destructive', onPress: async () => { 
        await supabase.auth.signOut(); 
        setRole(null);
      }}
    ]);
  };

  // 1. Si la animación no ha terminado, mostramos la pantalla de carga (Splash)
  if (!isAppReady) {
    return (
      <Animated.View style={[styles.splashContainer, { opacity: splashOpacity }]}>
        <Animated.View style={{ opacity: logoOpacity, transform: [{ scale: logoScale }], alignItems: 'center' }}>
          <Ionicons name="school" size={120} color="#FFF" />
          <Text style={styles.splashTitle}>Bienvenido a Emprax</Text>
          <Text style={styles.splashSubtitle}>Tu futuro profesional comienza aquí</Text>
        </Animated.View>
      </Animated.View>
    );
  }

  // 2. Transición al AuthView (Login) si no hay sesión
  if (!session || !session.user) {
    return <AuthView />;
  }

  // Vista para Universidad/Administrador
  if (role === 'universidad') {
    return <AdminDashboard session={session} perfil={perfil} onLogout={handleSignOut} refreshTrigger={refreshTrigger} />;
  }

  // Vista para Estudiante (Por defecto)
  const primerNombre = perfil?.nombre_completo?.split(' ')[0] || 'Estudiante';
  const inicial = primerNombre.charAt(0).toUpperCase();

  return (
    <SafeAreaView style={styles.dashboardContainer}>
      {activeTab === 'Inicio' && (
        <DashboardView 
          primerNombre={primerNombre} 
          inicial={inicial} 
          misPracticas={misPracticas} 
          misEntrevistas={misEntrevistas} 
          setActiveTab={setActiveTab} 
          handleRetirarPostulacion={handleRetirarPostulacion}
        />
      )}
      
      {activeTab === 'Ofertas' && (
        <CatalogView 
          ofertasDisponibles={ofertasDisponibles} 
          misPracticas={misPracticas} 
          misFavoritos={misFavoritos}
          handlePostularse={handlePostularse} 
          handleToggleFavorito={handleToggleFavorito}
          isFavoritesView={false}
        />
      )}

      {activeTab === 'Favoritos' && (
        <CatalogView 
          ofertasDisponibles={ofertasDisponibles} 
          misPracticas={misPracticas} 
          misFavoritos={misFavoritos}
          handlePostularse={handlePostularse} 
          handleToggleFavorito={handleToggleFavorito}
          isFavoritesView={true}
        />
      )}

      {activeTab === 'Perfil' && (
        <ProfileView session={session} perfil={perfil} inicial={inicial} setActiveTab={setActiveTab} onProfileUpdated={fetchData} />
      )}

      <BottomMenu activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleSignOut} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  dashboardContainer: { flex: 1, backgroundColor: '#FFFFFF' },
  splashContainer: {
    flex: 1,
    backgroundColor: '#0A66C2', // Azul profesional
    justifyContent: 'center',
    alignItems: 'center',
  },
  splashTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFF',
    marginTop: 20,
    textAlign: 'center',
  },
  splashSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 10,
    textAlign: 'center',
  }
});