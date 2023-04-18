import React, { useState, useEffect } from 'react'
import { db } from '../firebase.js'
import { collection, onSnapshot, addDoc, deleteDoc, doc } from 'firebase/firestore'

const Cart = () => {

  const [productos, setProductos] = useState([]);
  const [material, setMaterial] = useState('');
  const [forma, setForma] = useState('');
  const [tipo, setTipo] = useState('');
  const [precio, setPrecio] = useState(0);
  const [moneda, setMoneda] = useState('pesos');

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

  const agregarProducto = async (e) => {
    e.preventDefault();
    const data = await addDoc(collection(db, 'productos'), {
      material: material,
      forma: forma,
      tipo: tipo,
      precio: precio,
      moneda: moneda
    })
    setProductos(
      [...productos, {
        id: data.id,
        material: material,
        forma: forma,
        tipo: tipo,
        precio: precio,
        moneda: moneda
      }]
    )

    setMaterial('');
    setForma('');
    setTipo('');
    setPrecio(0);
    setMoneda('pesos');
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

  const handlePrecioChange = (e) => {
    const precio = Number(e.target.value);
    if (moneda === 'dolares') {
      setPrecio(precio * 5000);
    } else {
      setPrecio(precio);
    }
  }

  const handleMonedaChange = (e) => {
    const moneda = e.target.value;
    if (moneda === 'dolares') {
      setPrecio(precio / 5000);
      setMoneda('dolares');
    } else {
      setPrecio(precio * 5000);
      setMoneda('pesos');
    }
  }
  
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
            <label htmlFor="moneda-select">Seleccione la moneda</label>
            <select id="moneda-select" className="form-select mb-3" value={moneda} onChange={(e) => setMoneda(e.target.value)}>
              <option value="pesos">Pesos Colombianos</option>
              <option value="dolares">Dólares</option>
            </select>
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
                  <th>Moneda</th>
                  <th>Precio</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {productos.map((producto) => (
                  <tr key={producto.id}>
                    <td>{producto.material}</td>
                    <td>{producto.forma}</td>
                    <td>{producto.tipo}</td>
                    <td>
                      <select value={producto.moneda} onChange={async (e) => {
                          const moneda = e.target.value;
                          try {
                            await db.doc(`productos/${producto.id}`).update({
                              moneda
                            })
                            setProductos(productos.map(p => {
                              if (p.id === producto.id) {
                                return {
                                  ...p,
                                  moneda
                                }
                              }
                              return p;
                            }))
                          } catch (error) {
                            console.log(error);
                          }
                        }}>
                        <option value="COP">COP</option>
                        <option value="USD">USD</option>
                      </select>
                    </td>
                    <td>{producto.moneda === 'COP' ? `$${producto.precioCOP}` : `$${producto.precioUSD}`}</td>
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