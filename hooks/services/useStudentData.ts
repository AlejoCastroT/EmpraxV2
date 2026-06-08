import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../lib/supabase';
import Toast from 'react-native-toast-message';

export function useStudentData(session: any, refreshTrigger: number) {
  const [perfil, setPerfil] = useState<any>(null);
  const [ofertasDisponibles, setOfertasDisponibles] = useState<any[]>([]);
  const [misPracticas, setMisPracticas] = useState<any[]>([]);
  const [misEntrevistas, setMisEntrevistas] = useState<any[]>([]);
  const [misFavoritos, setMisFavoritos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    if (!session?.user?.id) return;
    
    setLoading(true);
    try {
      // 1. Obtener perfil
      const { data: perfilData, error: perfilError } = await supabase
        .from('estudiantes')
        .select('*')
        .eq('id', session.user.id)
        .single();
      
      if (perfilError && perfilError.code !== 'PGRST116') {
        console.error('Error fetching perfil:', perfilError);
      } else if (perfilData) {
        setPerfil(perfilData);
      }

      // 2. Obtener TODAS las ofertas de cualquier empresa
      const { data: ofertasData, error: ofertasError } = await supabase
        .from('ofertas')
        .select(`
          *,
          empresas (nombre, sector)
        `)
        .order('fecha_creacion', { ascending: false });
        
      if (!ofertasError && ofertasData) {
        setOfertasDisponibles(ofertasData);
      }

      // 3. Obtener mis postulaciones (prácticas)
      const { data: practicasData, error: practicasError } = await supabase
        .from('practicas')
        .select(`
          *,
          empresas (nombre, sector),
          ofertas (titulo)
        `)
        .eq('estudiante_id', session.user.id);
        
      if (!practicasError && practicasData) {
        setMisPracticas(practicasData);
        setMisEntrevistas(practicasData.filter(p => p.estado === 'entrevista'));
      }

      // 4. Obtener mis favoritos
      const { data: favsData, error: favsError } = await supabase
        .from('favoritos')
        .select('*')
        .eq('estudiante_id', session.user.id);
        
      if (!favsError && favsData) {
        setMisFavoritos(favsData);
      }

    } catch (error) {
      console.error('Error in fetchData:', error);
    } finally {
      setLoading(false);
    }
  }, [session]);

  useEffect(() => {
    fetchData();

    if (!session?.user?.id) return;

    // Configurar suscripciones en tiempo real
    const practicasSubscription = supabase
      .channel('public:practicas:estudiante')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'practicas', filter: `estudiante_id=eq.${session.user.id}` }, () => {
        fetchData();
      })
      .subscribe();

    const ofertasSubscription = supabase
      .channel('public:ofertas:all')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'ofertas' }, () => {
        fetchData();
      })
      .subscribe();

    const favoritosSubscription = supabase
      .channel('public:favoritos:estudiante')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'favoritos', filter: `estudiante_id=eq.${session.user.id}` }, () => {
        fetchData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(practicasSubscription);
      supabase.removeChannel(ofertasSubscription);
      supabase.removeChannel(favoritosSubscription);
    };
  }, [session, refreshTrigger, fetchData]);

  const handlePostularse = async (ofertaId: string, empresaId: string, nombreEmpresa: string) => {
    if (!session?.user?.id) return;

    const yaPostulado = misPracticas.some(p => p.oferta_id === ofertaId);
    if (yaPostulado) {
      Toast.show({ type: 'info', text1: 'Aviso', text2: 'Ya te has postulado a esta oferta.' });
      return;
    }

    const { error } = await supabase.from('practicas').insert([{
      estudiante_id: session.user.id,
      empresa_id: empresaId,
      oferta_id: ofertaId,
      estado: 'pendiente'
    }]);

    if (!error) {
      Toast.show({ type: 'success', text1: '¡Postulación Exitosa!', text2: `Te has postulado a la oferta de ${nombreEmpresa}` });
      fetchData(); // Refrescar datos
    } else {
      Toast.show({ type: 'error', text1: 'Error', text2: 'No se pudo realizar la postulación.' });
      console.error(error);
    }
  };

  const handleRetirarPostulacion = async (practicaId: string) => {
    const { error } = await supabase.from('practicas').delete().eq('id', practicaId);
    if (!error) {
      Toast.show({ type: 'success', text1: 'Postulación retirada', text2: 'Se ha cancelado tu solicitud correctamente.' });
      fetchData();
    }
  };

  const handleToggleFavorito = async (ofertaId: string, empresaId: string) => {
    if (!session?.user?.id) return;

    const favExistente = misFavoritos.find(f => f.oferta_id === ofertaId);
    
    if (favExistente) {
      const { error } = await supabase.from('favoritos').delete().eq('id', favExistente.id);
      if (!error) {
        Toast.show({ type: 'success', text1: 'Eliminado de favoritos' });
        fetchData();
      }
    } else {
      const { error } = await supabase.from('favoritos').insert([{
        estudiante_id: session.user.id,
        oferta_id: ofertaId,
        empresa_id: empresaId
      }]);
      if (!error) {
        Toast.show({ type: 'success', text1: 'Guardado en favoritos' });
        fetchData();
      }
    }
  };

  return {
    perfil,
    ofertasDisponibles,
    misPracticas,
    misEntrevistas,
    misFavoritos,
    loading,
    fetchData,
    handlePostularse,
    handleRetirarPostulacion,
    handleToggleFavorito
  };
}