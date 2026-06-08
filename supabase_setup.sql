-- Ejecuta este script en el SQL Editor de Supabase

-- 1. Asegurar que la tabla empresas existe y su ID puede ser el de auth.users
CREATE TABLE IF NOT EXISTS empresas (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nombre TEXT NOT NULL,
  sector TEXT NOT NULL
);

-- 2. Crear tabla de ofertas (los administradores/universidades suben ofertas)
CREATE TABLE IF NOT EXISTS ofertas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  empresa_id UUID REFERENCES empresas(id) ON DELETE CASCADE,
  titulo TEXT NOT NULL,
  descripcion TEXT,
  acerca_empleo TEXT,
  requisitos TEXT,
  beneficios TEXT,
  salario TEXT,
  modalidad TEXT, -- Ejemplo: 'Híbrido', 'Remoto', 'Presencial'
  tiempo TEXT,    -- Ejemplo: 'Tiempo Completo', 'Medio Tiempo'
  fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Modificar la tabla practicas para que apunte a una oferta_id
-- NOTA: Si ya tienes datos, esto podría requerir limpiar la tabla practicas primero o permitir null temporalmente.
ALTER TABLE practicas ADD COLUMN IF NOT EXISTS oferta_id UUID REFERENCES ofertas(id) ON DELETE CASCADE;

-- (Opcional) Si la tabla favoritos existe y ahora prefieres que guarden ofertas:
ALTER TABLE favoritos ADD COLUMN IF NOT EXISTS oferta_id UUID REFERENCES ofertas(id) ON DELETE CASCADE;

-- 4. Habilitar Realtime para las tablas
-- Esto es necesario para que supabase.channel escuche los eventos
BEGIN;
  -- Remover las tablas del publication si ya estaban (evitar duplicados)
  ALTER PUBLICATION supabase_realtime DROP TABLE IF EXISTS ofertas, practicas;
  -- Añadir las tablas al publication
  ALTER PUBLICATION supabase_realtime ADD TABLE ofertas, practicas;
COMMIT;

