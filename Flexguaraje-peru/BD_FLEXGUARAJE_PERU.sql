create database flexguaraje_peru;
use flexguaraje_peru;

# TABLA ROLESSSSSSSSSSSSSSSSSSSSSS
create table roles (
	id_roles int primary key auto_increment,
    nombre_rol varchar(20) not null,
    estado varchar(15) not null default 'Activo',
    constraint UQ_nombre_rol UNIQUE (nombre_rol),
	CONSTRAINT valores_estado_roles CHECK (estado IN ('Activo', 'Desactivado'))
);
# DATOS PARA LA TABLA ROLES
INSERT INTO roles (nombre_rol, estado) VALUES 
('PROPIETARIO', 'Activo'), ('ADMINISTRADOR', 'Activo'), ('MANTENIMIENTO', 'Activo');

# TABLAAAAAAAA PERMISOSSSSSSSSSS
create table permisos (
	id_permiso int primary key auto_increment,
    id_roles int not null,
    nombre_permiso varchar(20) not null,
    estado varchar(15) not null default 'Activo',
	constraint FK_permisos_cuenta foreign key (id_roles) references roles(id_roles),
	CONSTRAINT valores_Estado_permisos CHECK (estado IN ('Activo', 'Desactivado')),
	constraint nombre_permiso UNIQUE (nombre_permiso)
);
# DATOS PARA LA TABLA PERMISOS.
INSERT INTO permisos (id_roles, nombre_permiso, estado) VALUES 
(1, 'GESTION', 'Activo'), (2, 'SUPERVISION', 'Activo'), (3, 'SOLUCIONAR PROBLEMA', 'Activo');

# TABLA usuario ( administrador, propietario y otros)
create table usuario (
	id_usuario int primary key auto_increment,
    id_roles int not null,
    dni varchar(8) not null,
    nombre varchar(30) not null,
    apellido_paterno varchar(20) not null,
    apellido_materno varchar(20) not null,
    nombre_usuario varchar(70) not null,
    email varchar(30) not null,
    telefono varchar(9) not null,
	estado varchar(15) not null default 'Activo',
	CONSTRAINT FK_roles_usuario foreign key (id_roles) references roles(id_roles),
	CONSTRAINT valores_estado_usuario CHECK (estado IN ('Activo', 'Desactivado')),
	CONSTRAINT UQ_dni UNIQUE (dni),
	constraint UQ_nombre_usuario UNIQUE (nombre_usuario)
);

# TABLAAAAA CUENTAAAAAAAAAAAAAA
create table cuenta (
	id_cuenta int primary key auto_increment,
    id_usuario int not null,
    email varchar(50) not null,
    pass varchar(255) not null,
    estado varchar(15) not null default 'Activo',
	constraint FK_usuario_cuenta foreign key (id_usuario) references usuario(id_usuario),
	CONSTRAINT valores_estado_cuenta CHECK (estado IN ('Activo', 'Desactivado')),
    constraint UQ_usuario_unico UNIQUE (id_usuario),
    constraint UQ_email_cuenta UNIQUE (email)
);

# TABLA REPORTESSSSSS

create table reportes (
	id_reportes int primary key auto_increment,
    id_usuario int not null,
    codigo_reporte varchar(15) not null,
    fecha_reporte date not null,
    descripcion_reporte varchar(255) not null,
    encargado_resolver varchar(100) not null,
    prioridad varchar(15) not null,
    estado varchar(15) not null,
    subestado varchar(15),
    fecha_respuesta_reporte date,
    respuestas_reporte varchar(255),
	CONSTRAINT FK_reporte_usuario FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario),
    CONSTRAINT CHK_prioridad_R CHECK (prioridad IN ('Baja','Media','Alta')),
    CONSTRAINT CHK_estado_R CHECK (estado IN ('Cancelado','Pendiente','Cerrado')),
    CONSTRAINT CHK_subestado_R CHECK (subestado IN ('Acogido','No_acogido')),
	CONSTRAINT UQ_codigo_reporte UNIQUE (codigo_reporte)
);

#TABLA CLIENTESSSSSSSSSSSS
CREATE TABLE cliente (
    id_cliente INT auto_increment PRIMARY KEY,
    dni VARCHAR(8) NOT NULL,
    nombre VARCHAR(50) NOT NULL,
    apellido_paterno VARCHAR(20) NOT NULL,
    apellido_materno VARCHAR(20) NOT NULL,
    telefono VARCHAR(9) NOT NULL,
    email VARCHAR(50) NOT NULL,
    direccion VARCHAR(250) NOT NULL,
    nota_adicional VARCHAR(250) DEFAULT 'Sin Discapacidad',
    CONSTRAINT UQ_dni UNIQUE (dni),
    CONSTRAINT CHK_DNI_Format CHECK (LENGTH(dni) = 8 AND dni NOT LIKE '%[^0-9]%'),
    CONSTRAINT CHK_Telefono_Format CHECK (LENGTH(telefono) = 9 AND telefono NOT LIKE '%[^0-9]%'),
    CONSTRAINT CHK_Nombre_Apellido_Letras CHECK (nombre NOT LIKE '%[^A-Za-z]%' AND 
                                                 apellido_paterno NOT LIKE '%[^A-Za-z]%' AND 
                                                 apellido_materno NOT LIKE '%[^A-Za-z]%')
);
# 20 DATOS DE LA TABLA CLIENTE
INSERT INTO cliente (dni, nombre, apellido_paterno, apellido_materno, telefono, email, direccion, nota_adicional) VALUES
('12345678', 'CARLOS', 'GOMEZ', 'LOPEZ', '912345678', 'carlos.gomez@example.com', 'Av. Siempre Viva 123, Lima', 'Sin Discapacidad'),
('23456789', 'MARIA', 'TORRES', 'PEREZ', '923456789', 'maria.torres@example.com', 'Jr. Los Pinos 456, Arequipa', 'Sin Discapacidad'),
('34567890', 'JUAN', 'RAMIREZ', 'GARCIA', '934567890', 'juan.ramirez@example.com', 'Calle Los Olivos 789, Cusco', 'Sin Discapacidad'),
('45678901', 'ELENA', 'MARTINEZ', 'LOPEZ', '945678901', 'elena.martinez@example.com', 'Av. Las Flores 321, Trujillo', 'Usuario con silla de ruedas'),
('56789012', 'LUIS', 'FERNANDEZ', 'RAMOS', '956789012', 'luis.fernandez@example.com', 'Jr. San Juan 654, Ica', 'Sin Discapacidad'),
('67890123', 'LUCIA', 'DIAZ', 'GUZMAN', '967890123', 'lucia.diaz@example.com', 'Calle Principal 987, Piura', 'Usuario con bastón'),
('78901234', 'PEDRO', 'CASTILLO', 'ALVAREZ', '978901234', 'pedro.castillo@example.com', 'Av. La Marina 147, Tacna', 'Sin Discapacidad'),
('89012345', 'ANA', 'RIOS', 'MORALES', '989012345', 'ana.rios@example.com', 'Jr. Amazonas 258, Chiclayo', 'Sin Discapacidad'),
('90123456', 'JORGE', 'PAREDES', 'FLORES', '900123456', 'jorge.paredes@example.com', 'Calle El Sol 369, Huancayo', 'Sin Discapacidad'),
('01234567', 'SOFIA', 'MENDOZA', 'CHAVEZ', '911234567', 'sofia.mendoza@example.com', 'Jr. Las Palmeras 111, Puno', 'Sin Discapacidad'),
('11234567', 'RICARDO', 'LOPEZ', 'SALAZAR', '922345678', 'ricardo.lopez@example.com', 'Av. La Cultura 222, Juliaca', 'Usuario con discapacidad auditiva'),
('22345678', 'DANIELA', 'VEGA', 'ROJAS', '933456789', 'daniela.vega@example.com', 'Calle Los Cedros 333, Tumbes', 'Sin Discapacidad'),
('33456789', 'MIGUEL', 'CRUZ', 'HERNANDEZ', '944567890', 'miguel.cruz@example.com', 'Jr. Los Claveles 444, Moquegua', 'Usuario con discapacidad visual'),
('44567890', 'ISABEL', 'RUIZ', 'ESPINOZA', '955678901', 'isabel.ruiz@example.com', 'Av. San Martín 555, Chimbote', 'Sin Discapacidad'),
('55678901', 'CAMILA', 'PONCE', 'VARGAS', '966789012', 'camila.ponce@example.com', 'Jr. Los Tulipanes 666, Cajamarca', 'Sin Discapacidad'),
('66789012', 'JOSE', 'ALVAREZ', 'PAREDES', '977890123', 'jose.alvarez@example.com', 'Calle Principal 777, Huánuco', 'Sin Discapacidad'),
('77890123', 'KARINA', 'CHAVEZ', 'GARCIA', '988901234', 'karina.chavez@example.com', 'Jr. Los Jazmines 888, Ayacucho', 'Usuario con silla de ruedas'),
('88901234', 'HECTOR', 'MORALES', 'DIAZ', '999012345', 'hector.morales@example.com', 'Av. El Progreso 999, Cajamarca', 'Sin Discapacidad'),
('99012345', 'PAOLA', 'GARCIA', 'SANCHEZ', '910123456', 'paola.garcia@example.com', 'Jr. Las Margaritas 123, Iquitos', 'Sin Discapacidad');

# TABLA SOLICITUDDDDDDDDDDDDDDD
create table solicitudes (
	id_solicitudes int primary key auto_increment,
    id_cliente int not null,
    codigo_solicitud varchar(15) not null,
    fecha_solicitud date not null,
    tipo_solicitud varchar(15) not null,
    categoria varchar(15) not null,
    descripcion varchar(255) not null,
    prioridad varchar(15) not null,
    estado varchar(15) not null,
    subestado varchar(15),
    fecha_respuesta date,
    respuestas varchar(255),
	CONSTRAINT FK_solicitud_cliente FOREIGN KEY (id_cliente) REFERENCES cliente(id_cliente),
	CONSTRAINT CHK_tipo_solicitud CHECK (tipo_solicitud IN ('Consulta','Problema','Reclamo')),
	CONSTRAINT CHK_categoria CHECK (categoria IN ('Cliente','Espacio','Alquiler','Boleta')),
    CONSTRAINT CHK_prioridad CHECK (prioridad IN ('Alta','Media','Baja')),
    CONSTRAINT CHK_estado CHECK (estado IN ('Cancelado','Pendiente','Cerrado')),
    CONSTRAINT CHK_subestado CHECK (subestado IN ('Acogido','No_acogido')),
    CONSTRAINT UQ_codigo_solicitud UNIQUE (codigo_solicitud)
);

#TABLA ESPACIOSSSSS
CREATE TABLE espacio (
    id_espacio INT auto_increment PRIMARY KEY,
    codigo_espacio VARCHAR(30) NOT NULL,
    estado VARCHAR(15) NOT NULL DEFAULT 'Disponible',
    subestado VARCHAR(15) NOT NULL DEFAULT 'Desactivado',
    costo DECIMAL(7, 2) NOT NULL,
    CONSTRAINT UQ_codigo_espacio UNIQUE (codigo_espacio),
    CONSTRAINT valores_estado CHECK (estado IN ('Disponible', 'Ocupado','Mantenimiento')),
    CONSTRAINT valores_subestado CHECK (subestado IN ('Activo', 'Desactivado'))
);
# 20 DATOSSSSSSSSSSSSSS DE LA TABLA ESPACIO
INSERT INTO espacio VALUES
(1, 'E001', 'Disponible', 'Desactivado',150),
(2, 'E002', 'Disponible', 'Desactivado',150),
(3, 'E003', 'Disponible', 'Desactivado',150),
(4, 'E004', 'Disponible', 'Desactivado',150),
(5, 'E005', 'Disponible', 'Desactivado',150),
(6, 'E006', 'Disponible', 'Desactivado',130),
(7, 'E007', 'Disponible', 'Desactivado',130),
(8, 'E008', 'Disponible', 'Desactivado',130),
(9, 'E009', 'Disponible', 'Desactivado',130),
(10, 'E010', 'Disponible', 'Desactivado',130),
(11, 'E011', 'Disponible', 'Desactivado',120),
(12, 'E012', 'Disponible', 'Desactivado',120),
(13, 'E013', 'Disponible', 'Desactivado',120),
(14, 'E014', 'Disponible', 'Desactivado',120),
(15, 'E015', 'Disponible', 'Desactivado',120),
(16, 'E016', 'Disponible', 'Desactivado',110),
(17, 'E017', 'Disponible', 'Desactivado',110),
(18, 'E018', 'Disponible', 'Desactivado',110),
(19, 'E019', 'Disponible', 'Desactivado',110),
(20, 'E020', 'Disponible', 'Desactivado',110);

#TABLA ALQUILERESSSSSSSSSSSSSSS
CREATE TABLE alquileres (
	id_alquiler INT auto_increment PRIMARY KEY,
    id_cliente INT NOT NULL,
    id_espacio INT NOT NULL,
    fecha_inicio_alquiler DATE NOT NULL,
    fecha_fin_alquiler DATE NOT NULL,
	total_dias_alquiler VARCHAR(20) NOT NULL,
    estado varchar(15) NOT NULL default 'No_Ignorar',
    CONSTRAINT FK_Alquiler_Cliente FOREIGN KEY (id_cliente) REFERENCES cliente(id_cliente),
    CONSTRAINT FK_Alquiler_Espacio FOREIGN KEY (id_espacio) REFERENCES espacio(id_espacio),
	CONSTRAINT CHK_Alquiler_estado CHECK (estado IN ('Ignorar','No_Ignorar')),
    CONSTRAINT CHK_Fechas_Alquiler CHECK (fecha_inicio_alquiler <= fecha_fin_alquiler)
);

#TABLA BOLETAAAAAAAAAAAAAAAAA
CREATE TABLE boleta (
    id_boleta INT auto_increment PRIMARY KEY,
    id_alquiler INT NOT NULL,
    codigo_boleta VARCHAR(15) NOT NULL,
    metodo_pago VARCHAR(30) NOT NULL default "Efectivo",
    fecha_emision DATE NOT NULL,
    monto_base DECIMAL(10, 2) NOT NULL,
    monto_igv DECIMAL(10, 2) NOT NULL,
    monto_pagar DECIMAL(10, 2) NOT NULL,
    CONSTRAINT FK_boleta_Alquiler FOREIGN KEY (id_alquiler) REFERENCES alquileres(id_alquiler),
    constraint UQ_codigo_boleta UNIQUE (codigo_boleta),
    CONSTRAINT UQ_id_alquiler UNIQUE (id_alquiler),
    CONSTRAINT CHK_metodo_pago CHECK (metodo_pago IN ('Efectivo','tarjeta_credito','Tarjeta_debito'))
);


# ---------- CONSULTASSSSSSSSSS -----------
use flexguaraje_peru;
select * from roles; 
select * from permisos;
select * from usuario;
select * from cuenta;
select * from cliente;
select * from espacio;
select * from alquileres;
select * from boleta;
select * from solicitudes;
select * from reportes;


# VISUALIZAR LOS DATOS COMBINADOS DE ROLES Y PERMISOS
SELECT 
    r.nombre_rol, 
    r.estado AS estado_rol, 
    p.nombre_permiso, 
    p.estado AS estado_permiso
FROM roles r
JOIN permisos p ON r.id_roles = p.id_roles;

# VISUALIZAR LOS DATOS COMBINADOS DE USUARIO Y CUENTA
SELECT 
	u.dni,
    u.nombre AS nombre_usuario,
    u.apellido_paterno, 
    u.apellido_materno, 
    u.nombre_usuario AS cuenta_usuario, 
    c.email AS cuenta_email,
    c.pass AS cuenta_contraseña,
    c.estado AS estado_cuenta
FROM usuario u
JOIN cuenta c ON u.id_usuario = c.id_usuario;

# VISUALIZAR LOS DATOS COMBINADOS DE ROLES, PERMISOS, USUARIO Y CUENTA
SELECT
	usuario.dni,
	roles.nombre_rol,
    permisos.nombre_permiso,
	usuario.nombre_usuario,
    cuenta.email AS cuenta_email,
    cuenta.pass as cuenta_contraseña,
    cuenta.estado AS cuenta_estado
FROM 
    cuenta
JOIN 
    usuario ON cuenta.id_usuario = usuario.id_usuario
JOIN 
    roles ON usuario.id_roles = roles.id_roles
LEFT JOIN 
    permisos ON permisos.id_roles = roles.id_roles;


# VISUALIZAR LOS DATOS COMBINADOS DE ALQUILERES, CLIENTE Y ESPACIO
SELECT 
	c.dni AS cliente_dni, 
    CONCAT(c.nombre, ' ', c.apellido_paterno,' ', c.apellido_materno) AS nombre_completo,
    e.codigo_espacio AS espacio_codigo,
	e.estado AS estado_espacio,
    e.costo AS espacio_costo,
    a.fecha_inicio_alquiler, 
    a.fecha_fin_alquiler, 
    a.total_dias_alquiler
FROM alquileres a
JOIN cliente c ON a.id_cliente = c.id_cliente
JOIN espacio e ON a.id_espacio = e.id_espacio;

# VISUALIZAR LOS DATOS DE LA TABLA COMBINADO - ALQUILER CON ESPACIO AL MISMO TIEMPO
SELECT 
    e.codigo_espacio AS codigoEspacio,
    e.estado AS estado,
    c.dni AS dni,
    CONCAT(c.nombre, ' ', c.apellido_paterno,' ', c.apellido_materno) AS nombre_completo,
    c.telefono AS telefono,
    a.fecha_inicio_alquiler AS fechaInicioAlquiler,
    a.fecha_fin_alquiler AS fechaFinAlquiler,
    a.total_dias_alquiler as DiasAlquiler
FROM 
    espacio e
LEFT JOIN 
    alquileres a ON e.id_espacio = a.id_espacio AND a.estado = 'No_Ignorar'
LEFT JOIN 
    cliente c ON a.id_cliente = c.id_cliente;

# VISUALIZAR DATOS COMBINADAS DE BOLETA Y ALQUILERES
SELECT 
    b.codigo_boleta, 
    b.fecha_emision, 
    b.metodo_pago, 
    b.monto_pagar, 
    a.fecha_inicio_alquiler, 
    a.fecha_fin_alquiler
FROM boleta b
JOIN alquileres a ON b.id_alquiler = a.id_alquiler;



