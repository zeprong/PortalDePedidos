CREATE TABLE usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,                         -- Identificador único
  documento VARCHAR(20) NOT NULL,                            -- Cédula o número de identificación
  nombre VARCHAR(100) NOT NULL,                              -- Nombre completo del usuario
  usuario VARCHAR(50) NOT NULL UNIQUE,                       -- Nombre de usuario (único)
  password VARCHAR(255) NOT NULL,                            -- Contraseña (encriptada, por eso campo amplio)
  rol ENUM('admin', 'vendedor', 'comprador', 'almacen', 'gerente') NOT NULL,  -- Rol del sistema
  estado ENUM('activo', 'inactivo') DEFAULT 'activo',        -- Estado del usuario (activo por defecto)
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP         -- Fecha de creación del registro
);


CREATE TABLE productos (
  id INT AUTO_INCREMENT PRIMARY KEY,                     -- Identificador único
  item VARCHAR(100) NOT NULL,                            -- Nombre o identificador interno del producto
  notas TEXT,                                            -- Notas adicionales o comentarios
  laboratorio VARCHAR(100),                              -- Laboratorio que fabrica el producto
  lab_dist VARCHAR(100),                                 -- Laboratorio distribuidor (si aplica)
  codigo_item_generico VARCHAR(50),                      -- Código genérico del producto
  descripcion_revision TEXT,                             -- Descripción del producto con revisión
  cum VARCHAR(50),                                       -- Código Único de Medicamento
  proveedor VARCHAR(100),                                -- Proveedor actual del producto
  tipo_producto ENUM('medicamento', 'insumo', 'otro') NOT NULL,  -- Tipo de producto
  costo_proveedor DECIMAL(10,2),                         -- Costo actual del proveedor
  ultimo_costo_unitario DECIMAL(10,2),                   -- Último costo registrado por unidad
  precio DECIMAL(10,2),                                  -- Precio de venta sugerido
  regulado ENUM('sí', 'no') DEFAULT 'no',                -- Si el producto es regulado por entidad de salud
  iva DECIMAL(5,2) DEFAULT 0.00                          -- Porcentaje de IVA aplicado
);
CREATE TABLE existencias (
    id_existencia INT PRIMARY KEY AUTO_INCREMENT,
    item INt,
    des_item varchar,
    lote VARCHAR(50),
    fecha_vencimiento DATE,
    cantidad_disponible INT,
    bodega VARCHAR(100),
     id_producto INT,
    FOREIGN KEY (id_producto) REFERENCES productos(id_producto)
);

-- 4. Tabla de Solicitudes de Pedido
CREATE TABLE solicitudes_pedido (
    id_solicitud INT PRIMARY KEY AUTO_INCREMENT,
    id_usuario INT,
    fecha_solicitud DATETIME DEFAULT CURRENT_TIMESTAMP,
    estado ENUM('pendiente', 'en_almacen', 'en_compras', 'completado') DEFAULT 'pendiente',
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
);

-- 5. Detalle de Solicitudes
CREATE TABLE detalle_solicitud (
    id_detalle INT PRIMARY KEY AUTO_INCREMENT,
    id_solicitud INT,
    id_producto INT,
    cantidad_solicitada INT,
    notas VARCHAR(255),
    FOREIGN KEY (id_solicitud) REFERENCES solicitudes_pedido(id_solicitud),
    FOREIGN KEY (id_producto) REFERENCES productos(id_producto)
);

-- 6. Gestión de Almacén
CREATE TABLE gestion_almacen (
    id_gestion INT PRIMARY KEY AUTO_INCREMENT,
    id_detalle INT,
    cantidad_aprobada INT,
    fecha_revision DATETIME DEFAULT CURRENT_TIMESTAMP,
    estado_almacen ENUM('revisado', 'enviado_a_compras') DEFAULT 'revisado',
    FOREIGN KEY (id_detalle) REFERENCES detalle_solicitud(id_detalle)
);

-- 7. Gestión de Compras
CREATE TABLE gestion_compras (
    id_compra INT PRIMARY KEY AUTO_INCREMENT,
    id_detalle INT,
    cantidad_comprar INT,
    fecha_oc DATE,
    proveedor VARCHAR(255),
    estado_oc ENUM('ordenada', 'entregada_parcial', 'entregada_total') DEFAULT 'ordenada',
    FOREIGN KEY (id_detalle) REFERENCES detalle_solicitud(id_detalle)
);

-- 8. Recepción en Almacén
CREATE TABLE recepcion_almacen (
    id_recepcion INT PRIMARY KEY AUTO_INCREMENT,
    id_compra INT,
    cantidad_entregada INT,
    fecha_entrega_proveedor DATE,
    dias_entrega INT,
    entrada_almacen ENUM('sí', 'no') DEFAULT 'no',
    estado_final ENUM('pendiente', 'completo') DEFAULT 'pendiente',
    FOREIGN KEY (id_compra) REFERENCES gestion_compras(id_compra)
);