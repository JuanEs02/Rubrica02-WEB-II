import React, { useState, useEffect } from 'react'
import { db } from '../firebase.js'
import { collection, onSnapshot, addDoc, deleteDoc, doc } from 'firebase/firestore'

const Cart = () => {

  const [productos, setProductos] = useState([]);
  const [material, setMaterial] = useState('');
  const [forma, setForma] = useState('');
  const [tipo, setTipo] = useState('');
  const [tipoMoneda, setTipoMoneda] = useState(true);

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        await onSnapshot(collection(db, 'productos'), (query) => {
          setProductos(query.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
        })
      } catch (error) {
        console.log(error)
      }
    }
    obtenerDatos();
  }, [])

  const calcularPrecio = (precio, tipoMoneda) => {
    if (tipoMoneda) {
      return precio;
    } else {
      return precio * 5000;
    }
  };

  const agregarProducto = async (e) => {
    e.preventDefault();
    const data = await addDoc(collection(db, 'productos'), {
      material: material,
      forma: forma,
      tipo: tipo,
      tipom: tipoMoneda
    })
    setProductos(
      [...productos, {
        id: data.id,
        material: material,
        forma: forma,
        tipo: tipo,
        tipom: tipoMoneda
      }]
    )

    setMaterial('');
    setForma('');
    setTipo('');
    setTipoMoneda(true)
    await onSnapshot(collection(db, 'productos'), (query) => {
      setProductos(query.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
    })
  };

  const eliminarProducto = async (id) => {
    try {
      await deleteDoc(doc(db, 'productos', id))
    } catch (error) {
      console.log(error)
    }
  };

  return (
    <div>
      <br></br>
      <h2 className='text-center text-light'>Compra tu Manilla</h2>
      <br></br>
      <div className="container text-center">
        <div className="row align-items-start">
          <div className="col-6">
            <form onSubmit={agregarProducto}>
              <label htmlFor="material-select">Seleccione el material</label>
              <select id="material-select" className="form-select mb-3" value={material} onChange={(e) => setMaterial(e.target.value)}>
                <option value="">Seleccione el material</option>
                <option value="Cuero">Cuero</option>
                <option value="Cuerda">Cuerda</option>
              </select>
              <label htmlFor="forma-select">Seleccione la forma</label>
              <select id="forma-select" className="form-select mb-3" value={forma} onChange={(e) => setForma(e.target.value)}>
                <option value="">Seleccione la forma</option>
                <option value="Martillo">Martillo</option>
                <option value="Ancla">Ancla</option>
              </select>
              <label htmlFor="tipo-select">Seleccione el tipo</label>
              <select id="tipo-select" className="form-select mb-3" value={tipo} onChange={(e) => setTipo(e.target.value)}>
                <option value="">Seleccione el tipo</option>
                <option value="Oro">Oro</option>
                <option value="Plata">Plata</option>
                <option value="Niquel">Niquel</option>
              </select>
              <input type="checkbox" checked={tipoMoneda} onChange={(e) => setTipoMoneda(e.target.checked)} />
              Pago en dólares
              <button type="submit" className="btn btn-primary">Agregar</button>
            </form>
          </div>
          <div className="col-6">
            <img src="https://ae01.alicdn.com/kf/HTB1fVX1QVXXXXbtXXXXq6xXFXXXu/123682848/HTB1fVX1QVXXXXbtXXXXq6xXFXXXu.jpg" alt="Ejemplo_Venta" className="img-fluid" />
          </div>
        </div>
      </div>
      <br></br>
      <h2 className='text-center text-light'>Lista de compra</h2>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <table className="table text-light">
              <thead>
                <tr>
                  <th>Material</th>
                  <th>Forma</th>
                  <th>Tipo</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {productos.map((producto) => (
                  <tr key={producto.id}>
                    <td>{producto.material}</td>
                    <td>{producto.forma}</td>
                    <td>{producto.tipo}</td>
                    <td>{producto.precio} {tipoMoneda ? 'USD' : 'COP'}</td>

                    <td>
                      <button className="btn btn-danger" onClick={() => eliminarProducto(producto.id)}>Eliminar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Cart;