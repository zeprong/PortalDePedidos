// src/context/CarritoContext.js
import React, { createContext, useState, useMemo } from 'react';
import PropTypes from 'prop-types';

export const CarritoContext = createContext();

export const CarritoProvider = ({ children }) => {
  const [carrito, setCarrito] = useState([]);

  const calcularTotales = (producto) => {
    const iva = producto.iva || 0;
    const iva_unit = producto.precio * iva;
    const iva_total = iva_unit * producto.cantidad;
    const total = (producto.precio * producto.cantidad) + iva_total;

    return {
      ...producto,
      iva_unit,
      iva_total,
      total,
    };
  };

  const agregarProducto = (producto) => {
    setCarrito((prev) => {
      const existe = prev.find((p) => p.id === producto.id);
      if (existe) {
        return prev.map((p) =>
          p.id === producto.id
            ? calcularTotales({ ...p, cantidad: p.cantidad + producto.cantidad })
            : p
        );
      }
      return [...prev, calcularTotales(producto)];
    });
  };

  const actualizarProducto = (id, campo, valor) => {
    setCarrito((prev) =>
      prev.map((p) =>
        p.id === id
          ? calcularTotales({ ...p, [campo]: +valor })
          : p
      )
    );
  };

  const vaciarCarrito = () => setCarrito([]);

  const value = useMemo(() => ({
    carrito,
    agregarProducto,
    actualizarProducto,
    vaciarCarrito,
  }), [carrito]);

  return (
    <CarritoContext.Provider value={value}>
      {children}
    </CarritoContext.Provider>
  );
};

CarritoProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
