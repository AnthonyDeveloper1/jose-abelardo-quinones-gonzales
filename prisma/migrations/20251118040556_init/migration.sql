-- CreateTable
CREATE TABLE "roles" (
    "id_rol" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "descripcion" TEXT,
    "fecha_creacion" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id_rol")
);

-- CreateTable
CREATE TABLE "usuarios" (
    "id_usuario" SERIAL NOT NULL,
    "nombre_completo" VARCHAR(200) NOT NULL,
    "usuario" VARCHAR(100) NOT NULL,
    "correo" VARCHAR(200) NOT NULL,
    "clave" VARCHAR(255) NOT NULL,
    "id_rol" INTEGER,
    "ultima_conexion" TIMESTAMP,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "fecha_registro" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id_usuario")
);

-- CreateTable
CREATE TABLE "publicaciones" (
    "id_publicacion" SERIAL NOT NULL,
    "titulo" VARCHAR(255) NOT NULL,
    "slug" VARCHAR(255) NOT NULL,
    "descripcion" TEXT,
    "contenido" TEXT NOT NULL,
    "imagen_principal" VARCHAR(500),
    "estado" VARCHAR(50) NOT NULL DEFAULT 'borrador',
    "id_usuario" INTEGER,
    "id_categoria" INTEGER,
    "fecha_creacion" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_actualizacion" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "publicaciones_pkey" PRIMARY KEY ("id_publicacion")
);

-- CreateTable
CREATE TABLE "etiquetas" (
    "id_etiqueta" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "slug" VARCHAR(150) NOT NULL,
    "descripcion" TEXT,

    CONSTRAINT "etiquetas_pkey" PRIMARY KEY ("id_etiqueta")
);

-- CreateTable
CREATE TABLE "publicacion_etiqueta" (
    "id_publicacion_etiqueta" SERIAL NOT NULL,
    "id_publicacion" INTEGER NOT NULL,
    "id_etiqueta" INTEGER NOT NULL,

    CONSTRAINT "publicacion_etiqueta_pkey" PRIMARY KEY ("id_publicacion_etiqueta")
);

-- CreateTable
CREATE TABLE "comentarios" (
    "id_comentario" SERIAL NOT NULL,
    "id_publicacion" INTEGER NOT NULL,
    "nombre" VARCHAR(150),
    "mensaje" TEXT NOT NULL,
    "aprobado" BOOLEAN NOT NULL DEFAULT false,
    "fecha_creacion" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "comentarios_pkey" PRIMARY KEY ("id_comentario")
);

-- CreateTable
CREATE TABLE "reacciones" (
    "id_reaccion" SERIAL NOT NULL,
    "id_comentario" INTEGER,
    "nombre" VARCHAR(150),
    "tipo_reaccion" VARCHAR(50) NOT NULL DEFAULT 'like',
    "fecha_creacion" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reacciones_pkey" PRIMARY KEY ("id_reaccion")
);

-- CreateTable
CREATE TABLE "asuntos_contacto" (
    "id_asunto" SERIAL NOT NULL,
    "nombre" VARCHAR(200) NOT NULL,
    "descripcion" TEXT,

    CONSTRAINT "asuntos_contacto_pkey" PRIMARY KEY ("id_asunto")
);

-- CreateTable
CREATE TABLE "mensajes_contacto" (
    "id_mensaje" SERIAL NOT NULL,
    "nombre" VARCHAR(200) NOT NULL,
    "correo" VARCHAR(200) NOT NULL,
    "telefono" VARCHAR(50),
    "id_asunto" INTEGER,
    "mensaje" TEXT NOT NULL,
    "respondido" BOOLEAN NOT NULL DEFAULT false,
    "fecha_envio" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_respuesta" TIMESTAMP,

    CONSTRAINT "mensajes_contacto_pkey" PRIMARY KEY ("id_mensaje")
);

-- CreateTable
CREATE TABLE "correos_destino" (
    "id_correo_destino" SERIAL NOT NULL,
    "nombre" VARCHAR(200) NOT NULL,
    "correo" VARCHAR(200) NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "correos_destino_pkey" PRIMARY KEY ("id_correo_destino")
);

-- CreateTable
CREATE TABLE "directivos" (
    "id_directivo" SERIAL NOT NULL,
    "nombre_completo" VARCHAR(200) NOT NULL,
    "cargo" VARCHAR(200),
    "foto" VARCHAR(500),
    "descripcion" TEXT,
    "estado" BOOLEAN NOT NULL DEFAULT true,
    "fecha_registro" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "directivos_pkey" PRIMARY KEY ("id_directivo")
);

-- CreateTable
CREATE TABLE "historial_acciones" (
    "id_accion" SERIAL NOT NULL,
    "id_usuario" INTEGER,
    "accion" VARCHAR(255) NOT NULL,
    "tabla_afectada" VARCHAR(100),
    "id_registro" INTEGER,
    "detalles" TEXT,
    "fecha_accion" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "historial_acciones_pkey" PRIMARY KEY ("id_accion")
);

-- CreateTable
CREATE TABLE "visitas" (
    "id_visita" SERIAL NOT NULL,
    "id_publicacion" INTEGER NOT NULL,
    "direccion_ip" VARCHAR(45),
    "user_agent" TEXT,
    "fecha_visita" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "visitas_pkey" PRIMARY KEY ("id_visita")
);

-- CreateTable
CREATE TABLE "categorias" (
    "id_categoria" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "slug" VARCHAR(150) NOT NULL,
    "descripcion" TEXT,
    "icono" VARCHAR(100),
    "color" VARCHAR(50),
    "orden" INTEGER NOT NULL DEFAULT 0,
    "fecha_creacion" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "categorias_pkey" PRIMARY KEY ("id_categoria")
);

-- CreateTable
CREATE TABLE "galeria" (
    "id_imagen" SERIAL NOT NULL,
    "titulo" VARCHAR(255) NOT NULL,
    "descripcion" TEXT,
    "url_imagen" VARCHAR(500) NOT NULL,
    "tipo" VARCHAR(50) NOT NULL DEFAULT 'imagen',
    "id_usuario" INTEGER,
    "fecha_subida" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "galeria_pkey" PRIMARY KEY ("id_imagen")
);

-- CreateIndex
CREATE UNIQUE INDEX "roles_nombre_key" ON "roles"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_usuario_key" ON "usuarios"("usuario");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_correo_key" ON "usuarios"("correo");

-- CreateIndex
CREATE INDEX "idx_usuarios_correo" ON "usuarios"("correo");

-- CreateIndex
CREATE INDEX "idx_usuarios_usuario" ON "usuarios"("usuario");

-- CreateIndex
CREATE INDEX "idx_usuarios_rol" ON "usuarios"("id_rol");

-- CreateIndex
CREATE UNIQUE INDEX "publicaciones_slug_key" ON "publicaciones"("slug");

-- CreateIndex
CREATE INDEX "idx_publicaciones_slug" ON "publicaciones"("slug");

-- CreateIndex
CREATE INDEX "idx_publicaciones_estado" ON "publicaciones"("estado");

-- CreateIndex
CREATE INDEX "idx_publicaciones_usuario" ON "publicaciones"("id_usuario");

-- CreateIndex
CREATE INDEX "idx_publicaciones_categoria" ON "publicaciones"("id_categoria");

-- CreateIndex
CREATE UNIQUE INDEX "etiquetas_nombre_key" ON "etiquetas"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "etiquetas_slug_key" ON "etiquetas"("slug");

-- CreateIndex
CREATE INDEX "idx_pub_etiq_publicacion" ON "publicacion_etiqueta"("id_publicacion");

-- CreateIndex
CREATE INDEX "idx_pub_etiq_etiqueta" ON "publicacion_etiqueta"("id_etiqueta");

-- CreateIndex
CREATE UNIQUE INDEX "publicacion_etiqueta_id_publicacion_id_etiqueta_key" ON "publicacion_etiqueta"("id_publicacion", "id_etiqueta");

-- CreateIndex
CREATE INDEX "idx_comentarios_publicacion" ON "comentarios"("id_publicacion");

-- CreateIndex
CREATE INDEX "idx_comentarios_aprobado" ON "comentarios"("aprobado");

-- CreateIndex
CREATE INDEX "idx_reacciones_comentario" ON "reacciones"("id_comentario");

-- CreateIndex
CREATE UNIQUE INDEX "asuntos_contacto_nombre_key" ON "asuntos_contacto"("nombre");

-- CreateIndex
CREATE INDEX "idx_mensajes_respondido" ON "mensajes_contacto"("respondido");

-- CreateIndex
CREATE UNIQUE INDEX "correos_destino_correo_key" ON "correos_destino"("correo");

-- CreateIndex
CREATE INDEX "idx_historial_usuario" ON "historial_acciones"("id_usuario");

-- CreateIndex
CREATE INDEX "idx_historial_fecha" ON "historial_acciones"("fecha_accion");

-- CreateIndex
CREATE INDEX "idx_visitas_publicacion" ON "visitas"("id_publicacion");

-- CreateIndex
CREATE INDEX "idx_visitas_fecha" ON "visitas"("fecha_visita");

-- CreateIndex
CREATE UNIQUE INDEX "categorias_nombre_key" ON "categorias"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "categorias_slug_key" ON "categorias"("slug");

-- CreateIndex
CREATE INDEX "idx_categorias_slug" ON "categorias"("slug");

-- CreateIndex
CREATE INDEX "idx_galeria_tipo" ON "galeria"("tipo");

-- AddForeignKey
ALTER TABLE "usuarios" ADD CONSTRAINT "usuarios_id_rol_fkey" FOREIGN KEY ("id_rol") REFERENCES "roles"("id_rol") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "publicaciones" ADD CONSTRAINT "publicaciones_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuarios"("id_usuario") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "publicaciones" ADD CONSTRAINT "publicaciones_id_categoria_fkey" FOREIGN KEY ("id_categoria") REFERENCES "categorias"("id_categoria") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "publicacion_etiqueta" ADD CONSTRAINT "publicacion_etiqueta_id_publicacion_fkey" FOREIGN KEY ("id_publicacion") REFERENCES "publicaciones"("id_publicacion") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "publicacion_etiqueta" ADD CONSTRAINT "publicacion_etiqueta_id_etiqueta_fkey" FOREIGN KEY ("id_etiqueta") REFERENCES "etiquetas"("id_etiqueta") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comentarios" ADD CONSTRAINT "comentarios_id_publicacion_fkey" FOREIGN KEY ("id_publicacion") REFERENCES "publicaciones"("id_publicacion") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reacciones" ADD CONSTRAINT "reacciones_id_comentario_fkey" FOREIGN KEY ("id_comentario") REFERENCES "comentarios"("id_comentario") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mensajes_contacto" ADD CONSTRAINT "mensajes_contacto_id_asunto_fkey" FOREIGN KEY ("id_asunto") REFERENCES "asuntos_contacto"("id_asunto") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "historial_acciones" ADD CONSTRAINT "historial_acciones_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuarios"("id_usuario") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "visitas" ADD CONSTRAINT "visitas_id_publicacion_fkey" FOREIGN KEY ("id_publicacion") REFERENCES "publicaciones"("id_publicacion") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "galeria" ADD CONSTRAINT "galeria_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuarios"("id_usuario") ON DELETE SET NULL ON UPDATE CASCADE;
