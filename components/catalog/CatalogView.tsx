// components/CatalogView.tsx
import { Ionicons } from '@expo/vector-icons';
import React, { useState, useMemo } from 'react';
import { Modal, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View, TextInput } from 'react-native';

import CatalogOfferCard from './cards/CatalogOfferCard';

interface CatalogProps {
  ofertasDisponibles: any[];
  misPracticas: any[];
  misFavoritos?: any[];
  handlePostularse: (ofertaId: string, empresaId: string, nombreEmpresa: string) => void;
  handleToggleFavorito?: (ofertaId: string, empresaId: string) => void;
  isFavoritesView?: boolean;
}

export default function CatalogView({ 
  ofertasDisponibles, 
  misPracticas, 
  misFavoritos = [], 
  handlePostularse, 
  handleToggleFavorito,
  isFavoritesView = false 
}: CatalogProps) {
  const [selectedOferta, setSelectedOferta] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedModality, setSelectedModality] = useState<string | null>(null);

  const getInitials = (name: string) => {
    return name ? name.substring(0, 2).toUpperCase() : 'EM';
  };

  const getRandomColor = (id: string) => {
    const colors = ['#3498db', '#9b59b6', '#f1c40f', '#e67e22', '#e74c3c', '#1abc9c', '#34495e'];
    let hash = 0;
    if (!id) return colors[0];
    for (let i = 0; i < id.length; i++) {
      hash = id.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  const calcularTiempoTranscurrido = (fechaString: string) => {
    if (!fechaString) return 'Recientemente';
    const fecha = new Date(fechaString);
    const hoy = new Date();
    const difTiempo = hoy.getTime() - fecha.getTime();
    const difDias = Math.floor(difTiempo / (1000 * 3600 * 24));
    
    if (difDias === 0) return 'Hoy';
    if (difDias === 1) return 'Ayer';
    if (difDias > 30) return `Hace ${Math.floor(difDias/30)} meses`;
    return `Hace ${difDias} días`;
  };

  const renderModal = () => {
    if (!selectedOferta) return null;
    
    // Verificamos si ya está postulado por oferta_id o como respaldo por empresa_id
    const yaPostulado = misPracticas.some(p => p.oferta_id === selectedOferta.id || (p.empresas?.nombre === selectedOferta.empresas?.nombre && !p.oferta_id));
    const empresaNombre = selectedOferta.empresas?.nombre || 'Empresa';

    return (
      <Modal animationType="fade" visible={!!selectedOferta} onRequestClose={() => setSelectedOferta(null)} transparent>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setSelectedOferta(null)}>
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
              <TouchableOpacity onPress={() => setSelectedOferta(null)} style={styles.closeBtnIcon}>
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
                  setSelectedOferta(null); // Close modal after applying
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
  };

  const ofertasAMostrar = useMemo(() => {
    let result = ofertasDisponibles;

    // Filter by favorites if in favorites view
    if (isFavoritesView) {
      result = result.filter(o => misFavoritos.some(f => f.oferta_id === o.id));
    }

    // Filter by search query
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      result = result.filter(o => 
        o.titulo?.toLowerCase().includes(query) || 
        o.empresas?.nombre?.toLowerCase().includes(query) ||
        o.empresas?.sector?.toLowerCase().includes(query)
      );
    }

    // Filter by modality
    if (selectedModality) {
      result = result.filter(o => o.modalidad === selectedModality);
    }

    return result;
  }, [ofertasDisponibles, misFavoritos, isFavoritesView, searchQuery, selectedModality]);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.dashboardScroll} contentContainerStyle={styles.scrollContent} stickyHeaderIndices={[1]}>
        <View style={styles.header}>
          {isFavoritesView ? (
            <>
              <Text style={styles.dashboardTitle}>
                Tus <Text style={styles.dashboardTitleGreen}>Favoritos</Text>
              </Text>
              <Text style={styles.sectionSubtitle}>Ofertas que has guardado para después</Text>
            </>
          ) : (
            <>
              <Text style={styles.dashboardTitle}>
                Explora <Text style={styles.dashboardTitleGreen}>Ofertas</Text>
              </Text>
              <Text style={styles.sectionSubtitle}>Recomendado para ti basado en tu perfil</Text>
            </>
          )}
        </View>

        {/* Search & Filters Section (Sticky) */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBox}>
            <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar por rol, empresa o sector..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#999"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={20} color="#999" />
              </TouchableOpacity>
            )}
          </View>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersScroll}>
            {['Remoto', 'Híbrido', 'Presencial'].map((modality) => (
              <TouchableOpacity 
                key={modality} 
                style={[styles.filterChip, selectedModality === modality && styles.filterChipActive]}
                onPress={() => setSelectedModality(prev => prev === modality ? null : modality)}
              >
                <Text style={[styles.filterChipText, selectedModality === modality && styles.filterChipTextActive]}>
                  {modality}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.listContainer}>
          {ofertasAMostrar.length === 0 && isFavoritesView && (
            <View style={styles.emptyStateContainer}>
              <View style={styles.emptyStateIconBg}>
                <Ionicons name="bookmark" size={50} color="#0A66C2" />
              </View>
              <Text style={styles.emptyStateTitle}>No tienes favoritos</Text>
              <Text style={styles.emptyStateDesc}>Guarda las ofertas que más te gusten para revisarlas más tarde y postularte cuando estés listo.</Text>
            </View>
          )}
          {ofertasAMostrar.length === 0 && !isFavoritesView && (
            <View style={styles.emptyStateContainer}>
              <View style={styles.emptyStateIconBg}>
                <Ionicons name="search" size={50} color="#0A66C2" />
              </View>
              <Text style={styles.emptyStateTitle}>No hay ofertas disponibles</Text>
              <Text style={styles.emptyStateDesc}>Actualmente no encontramos ofertas que coincidan con tu búsqueda. ¡Intenta con otros filtros!</Text>
            </View>
          )}

          {ofertasAMostrar.map((oferta) => {
            const yaPostulado = misPracticas.some(p => p.oferta_id === oferta.id || (p.empresas?.nombre === oferta.empresas?.nombre && !p.oferta_id));
            const esFavorito = misFavoritos.some(f => f.oferta_id === oferta.id);
            const empresaNombre = oferta.empresas?.nombre || 'Empresa';
            
            return (
              <CatalogOfferCard
                key={oferta.id}
                oferta={oferta}
                yaPostulado={yaPostulado}
                esFavorito={esFavorito}
                empresaNombre={empresaNombre}
                onPress={() => setSelectedOferta(oferta)}
                onToggleFavorito={handleToggleFavorito}
                getRandomColor={getRandomColor}
                getInitials={getInitials}
                calcularTiempoTranscurrido={calcularTiempoTranscurrido}
              />
            );
          })}
        </View>
      </ScrollView>

      {renderModal()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F2EF' }, // LinkedIn-like background gray
  dashboardScroll: { flex: 1 },
  scrollContent: { paddingBottom: 20 },
  header: { padding: 20, backgroundColor: '#FFF', marginBottom: 8 },
  dashboardTitle: { fontSize: 24, fontWeight: 'bold', color: '#000' },
  dashboardTitleGreen: { color: '#0A66C2' }, // LinkedIn blue instead of green for theme match
  sectionSubtitle: { fontSize: 14, color: '#666', marginTop: 4 },
  
  listContainer: { paddingHorizontal: 0 },
  
  // Search and Filters
  searchContainer: { backgroundColor: '#FFF', paddingHorizontal: 16, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: '#EBEBEB' },
  searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F3F2EF', borderRadius: 8, paddingHorizontal: 12, height: 40 },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, height: '100%', color: '#000', fontSize: 15 },
  filtersScroll: { marginTop: 12 },
  filterChip: { paddingHorizontal: 16, paddingVertical: 6, borderRadius: 16, borderWidth: 1, borderColor: '#666', marginRight: 8 },
  filterChipActive: { backgroundColor: '#01754F', borderColor: '#01754F' },
  filterChipText: { color: '#666', fontSize: 14, fontWeight: '600' },
  filterChipTextActive: { color: '#FFF' },

  emptyStateContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
  },
  emptyStateIconBg: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(10, 102, 194, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateDesc: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  bottomSheetContainer: { backgroundColor: '#FFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, height: '90%' },
  dragHandle: { width: 40, height: 5, backgroundColor: '#DDD', borderRadius: 3, alignSelf: 'center', marginTop: 12, marginBottom: 12 },
  bottomSheetHeader: { flexDirection: 'row', alignItems: 'flex-start', paddingHorizontal: 20, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: '#EEE' },
  modalLogo: { width: 50, height: 50, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  modalLogoText: { color: '#FFF', fontWeight: 'bold', fontSize: 20 },
  modalJobTitle: { fontSize: 20, fontWeight: 'bold', color: '#000', marginBottom: 4 },
  modalCompanyName: { fontSize: 16, color: '#666' },
  closeBtnIcon: { padding: 4 },
  modalScrollContent: { padding: 20, paddingBottom: 100 },
  modalJobDetails: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 24 },
  detailPill: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F3F2EF', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 16, marginRight: 10, marginBottom: 10 },
  pillText: { marginLeft: 6, fontSize: 14, color: '#333', fontWeight: '500' },
  sectionContainer: { marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#000', marginBottom: 12 },
  sectionText: { fontSize: 15, color: '#444', lineHeight: 24, marginBottom: 16 },
  modalFooter: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#FFF', padding: 20, borderTopWidth: 1, borderTopColor: '#EEE', paddingBottom: Platform.OS === 'ios' ? 34 : 20 },
  modalApplyBtn: { backgroundColor: '#0A66C2', paddingVertical: 14, borderRadius: 24, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  postuladoBtn: { backgroundColor: '#EBEBEB' },
  modalApplyText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  postuladoText: { color: '#999' }
});