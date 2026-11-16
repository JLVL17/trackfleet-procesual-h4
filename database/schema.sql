CREATE DATABASE IF NOT EXISTS trackfleet_h4
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE trackfleet_h4;

CREATE TABLE IF NOT EXISTS vehiculos (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  placa VARCHAR(15) NOT NULL UNIQUE,
  modelo VARCHAR(100) NOT NULL,
  estado VARCHAR(30) NOT NULL
);

CREATE TABLE IF NOT EXISTS conductores (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  licencia VARCHAR(30) NOT NULL UNIQUE
);

INSERT INTO vehiculos (placa, modelo, estado) VALUES
  ('4821-AXB', 'Toyota Hilux', 'Disponible'),
  ('5912-BTC', 'Nissan Frontier', 'En ruta'),
  ('6374-CPD', 'Ford Ranger', 'En mantenimiento')
ON DUPLICATE KEY UPDATE id = vehiculos.id;

INSERT INTO conductores (nombre, licencia) VALUES
  ('Ana Rojas', 'LIC-1001'),
  ('Luis Condori', 'LIC-1002'),
  ('María Flores', 'LIC-1003')
ON DUPLICATE KEY UPDATE id = conductores.id;