import React, { useState, useEffect } from 'react'
import { db } from '../firebase.js'
import { collection, onSnapshot, addDoc, deleteDoc, doc } from 'firebase/firestore'

const Cart = () => {
  
  const [productos, setProductos] = useState([]);
  const [material, setMaterial] = useState('Cuero');
  const [forma, setForma] = useState('Martillo');
  const [tipo, setTipo] = useState('Oro');
  const [tipoMoneda, setTipoMoneda] = useState("USD");
  const [, setPrecio] = useState(0);

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

  function precioP() {
    if (material && forma && tipo) {
      if (material === 'Cuero') {
        if (forma === 'Martillo') {
          if (tipo === 'Oro' || tipo === 'Oro rosado') {
            return 100
          } else if (tipo === 'Plata') {
            console.log("Cuero Martillo y plata")
            return 80
          } else if (tipo === 'Niquel') {
            return 70
          }
        } else if (forma === 'Ancla') {
          if (tipo === 'Oro' || tipo === 'Oro rosado') {
            return 120
          } else if (tipo === 'Plata') {
            return 100
          } else if (tipo === 'Niquel') {
            return 90
          }
        }
      } else if (material === 'Cuerda') {
        if (forma === 'Martillo') {
          if (tipo === 'Oro' || tipo === 'Oro rosado') {
            return 90
          } else if (tipo === 'Plata') {
            return 70
          } else if (tipo === 'Niquel') {
            return 50
          }
        } else if (forma === 'Ancla') {
          if (tipo === 'Oro' || tipo === 'Oro rosado') {
            return 110
          } else if (tipo === 'Plata') {
            return 90
          } else if (tipo === 'Niquel') {
            return 80
          }
        }
      }
    }
  }

  const agregarProducto = async (e) => {
    e.preventDefault();
    try {
      const precioActual = precioP()
      const data = await addDoc(collection(db, 'productos'), {
        material: material,
        forma: forma,
        tipo: tipo,
        precio: precioActual,
        tipom: tipoMoneda
      })

      setProductos(
        [...productos, {
          id: data.id,
          material: material,
          forma: forma,
          tipo: tipo,
          precio: precioActual,
          tipom: tipoMoneda
        }]
      )

      setMaterial('Cuero');
      setForma('Martillo');
      setTipo('oro');
      setPrecio(0);
      setTipoMoneda(true)
      await onSnapshot(collection(db, 'productos'), (query) => {
        setProductos(query.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
      })
    } catch (error) {
      console.log(error)
    }
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
      <div className="container text-center text-light">
        <div className="row align-items-start">
          <div className="col-6">
            <form onSubmit={agregarProducto}>
              <label htmlFor="material-select">Seleccione el material</label>
              <select id="material-select" className="form-select mb-3" value={material} onChange={(e) => setMaterial(e.target.value)}>
                <option value="Cuero">Cuero</option>
                <option value="Cuerda">Cuerda</option>
              </select>
              <label htmlFor="forma-select ">Seleccione la forma</label>
              <select id="forma-select" className="form-select mb-3" value={forma} onChange={(e) => setForma(e.target.value)}>
                <option value="Martillo">Martillo</option>
                <option value="Ancla">Ancla</option>
              </select>
              <label htmlFor="tipo-select ">Seleccione el tipo</label>
              <select id="tipo-select" className="form-select mb-3" value={tipo} onChange={(e) => setTipo(e.target.value)}>
                <option value="Oro">Oro</option>
                <option value="Plata">Plata</option>
                <option value="Niquel">Niquel</option>
              </select>
              <div className="col-12 text-light">
                <input type="checkbox" checked={tipoMoneda} onChange={(e) => setTipoMoneda(e.target.checked)} />
                Pago en dólares
              </div>
              <br></br>
              <div className="col-12 text-light">
                <button type="submit" className="btn btn-primary">Agregar</button>
              </div>
            </form>
          </div>
          <div className="col-6">
            <img src="https://ae01.alicdn.com/kf/HTB1fVX1QVXXXXbtXXXXq6xXFXXXu/123682848/HTB1fVX1QVXXXXbtXXXXq6xXFXXXu.jpg" alt="Ejemplo_Venta" className="rounded mx-auto d-block col-6"/>
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
                    {
                      tipoMoneda ? <td>{producto.precio} USD </td> : <td>{producto.precio * 5000} COP </td>
                    }
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