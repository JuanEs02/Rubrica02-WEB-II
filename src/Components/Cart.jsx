import React, { useState} from 'react'
import { db } from '../firebase.js'
import { collection, onSnapshot, addDoc} from 'firebase/firestore'

const Cart = () => {

  const [productos, setProductos] = useState([]);
  const [material, setMaterial] = useState('');
  const [forma, setForma] = useState('');
  const [tipo, setTipo] = useState('');

  const agregarProducto = async (e) => {
    e.preventDefault();
    const data = await addDoc(collection(db, 'productos'), {

      material: material,
      forma: forma,
      tipo: tipo
    })
    setProductos(
      [...productos, {
        id: data.id,
        material: material,
        forma: forma,
        tipo: tipo
      }]
    )

    setMaterial('');
    setForma('');
    setTipo('');
    await onSnapshot(collection(db, 'productos'), (query) => {
      setProductos(query.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
    })
  };

  return (
    <div>
      <h2>Carrito de compras</h2>
      <form onSubmit={agregarProducto}>
        <select value={material} onChange={(e) => setMaterial(e.target.value)}>
          <option value="">Seleccione el material</option>
          <option value="cuero">Cuero</option>
          <option value="cuerda">Cuerda</option>
        </select>
        <select value={forma} onChange={(e) => setForma(e.target.value)}>
          <option value="">Seleccione la forma</option>
          <option value="martillo">Martillo</option>
          <option value="ancla">Ancla</option>
        </select>
        <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
          <option value="">Seleccione el tipo</option>
          <option value="oro">Oro</option>
          <option value="plata">Plata</option>
          <option value="niquel">Niquel</option>
        </select>
        <button type="submit">Agregar</button>
      </form>
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Material</th>
            <th>Forma</th>
            <th>Tipo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((producto) => (
            <tr key={producto.id}>
              <td>{producto.nombre}</td>
              <td>{producto.material}</td>
              <td>{producto.forma}</td>
              <td>{producto.tipo}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Cart;