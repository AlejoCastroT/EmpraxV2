import { Tabs } from 'expo-router';
import React from 'react';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false, // Oculta el título de arriba
        tabBarStyle: { display: 'none' }, // <-- ESTA LÍNEA ES LA MAGIA QUE OCULTA LA BARRA NEGRA
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
        }}
      />
      {/* Si tienes un archivo explore.tsx en esa carpeta, esto evita que cause errores al ocultarlo */}
      <Tabs.Screen
        name="explore"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}