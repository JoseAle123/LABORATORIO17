import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Home() {
  const [auth, setAuth] = useState(false);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');

  
  const [clientes, setCliente] = useState([]);  //mostrar tabla afencia
  const [clientesImpares, setClientesImpares] = useState([]);
  


  axios.defaults.withCredentials = true;

  useEffect(() => {
    axios.get('http://localhost:3001/', { withCredentials: true }) // Corregimos la URL para que coincida con el puerto del servidor
    .then(res => {
      if(res.data.Status === "Success"){
        setAuth(true);
        setName(res.data.name);
      } else{
        setAuth(false);
        setMessage(res.data.message);
      }
    })
    .catch(err => {
      console.error('Error en la solicitud:', err);
    });
  }, []);

  const handleLogout = () => {
    axios.get('http://localhost:3001/logout', { withCredentials: true }) // Corregimos la URL para que coincida con el puerto del servidor
      .then(res => {
        if(res.data.Status === "Success"){
          window.location.reload(true);
        } else{
          alert("error");
        }
      })
      .catch(err => console.log(err));
  }

  
  //MOSTRAR DATOS DE cliente
  useEffect(() => {
    axios.get('http://localhost:3001/clientes', { withCredentials: true })
      .then(res => {
        console.log(res.data); // Agrega esta línea para verificar la estructura de los datos recibidos
        if (res.data.length > 0) {
          setAuth(true);
          setName(res.data[0].name);
          setCliente(res.data); // Actualiza el estado de clientes con los datos recibidos
        } else {
          setAuth(false);
          setMessage("No hay usuarios autorizados disponibles.");
        }
      })
      .catch(err => {
        console.error('Error en la solicitud:', err);
      });
  }, []);


  //insertar

  const handleInsert = () => {
    const codigoID = document.getElementById('codigoID').value;
    const primer_apellido = document.getElementById('primer_apellido').value;
    const segundo_apellido = document.getElementById('segundo_apellido').value;
    const DNI = document.getElementById('DNI').value;
  
    axios.post('http://localhost:3001/insertar', {
      codigoID : codigoID,
      primer_apellido: primer_apellido,
      segundo_apellido: segundo_apellido,
      DNI : DNI
    }, { withCredentials: true })
    .then(res => {
      console.log(res.data);
      if (res.data.status === 'Success') {
        alert('Registro exitoso');
      }
    })
    .catch(err => console.error('Error en la solicitud:', err));
  }

  // reporte
  const obtenerIdImpares = () => {
    axios.get('http://localhost:3001/IDimpar', { withCredentials: true })
      .then(res => {
        setClientesImpares(res.data);
      })
      .catch(err => {
        console.error('Error en la solicitud:', err);
      });
  };

  
  return (
    <div className='container mt-4'>
      {
        auth ?
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3>Tu estás autorizado</h3>
            </div>
            <div>
              <button className='btn btn-danger' onClick={handleLogout}>Logout</button>
            </div>
          </div>
          <div style={{ display: 'flex', marginTop: '5px', position: 'relative' }}>
            <div style={{ width: '30%' }}>
              <input type="text" className='form-control' id="codigoID" placeholder="codigoID" style={{ marginBottom: '5px' }} /><br/>
              <input type="text" className='form-control' id="primer_apellido" placeholder="primer_apellido" style={{ marginBottom: '5px' }} /><br/>
              <input type="text" className='form-control' id="segundo_apellido" placeholder="segundo_apellido" style={{ marginBottom: '5px' }} /><br/>
              <input type="text" className='form-control' id="DNI" placeholder="DNI" style={{ marginBottom: '5px' }} /><br/>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <button className='btn btn-success' id="insertar" onClick={handleInsert}>Insertar</button>
                <button className='btn btn-primary' id="reporte" onClick={obtenerIdImpares}>Reporte</button>
              </div>
              <br></br>
              <h1 style={{ textAlign: 'center' }}>Reporte</h1>
              <table className="table table-striped table-bordered">
                <thead>
                  <tr>
                    <th scope="col">codigoID</th>
                    <th scope="col">primer_apellido</th>
                    <th scope="col">segundo_apellido</th>
                    <th scope="col">DNI</th>
                  </tr>
                </thead>
                <tbody>
                  {clientesImpares.map(cliente => (
                    <tr key={cliente.codigoID}>
                      <td>{cliente.codigoID}</td>
                      <td>{cliente.primer_apellido}</td>
                      <td>{cliente.segundo_apellido}</td>
                      <td>{cliente.DNI}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ width: '50%', position: 'absolute', top: 0, right: 0 }}> {/* Posicionamiento absoluto */}
              <h1 style={{ textAlign: 'center' }}>Tabla cliente</h1>
              <table className="table table-striped table-bordered">
                <thead className="thead-dark">
                  <tr>
                    <th scope="col">codigoID</th>
                    <th scope="col">primer_apellido</th>
                    <th scope="col">segundo_apellido</th>
                    <th scope="col">DNI</th>
                  </tr>
                </thead>
                <tbody>
                  {clientes.map(cliente => (
                    <tr key={cliente.codigoID}>
                      <td>{cliente.codigoID}</td>
                      <td>{cliente.primer_apellido}</td>
                      <td>{cliente.segundo_apellido}</td>
                      <td>{cliente.DNI}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        :
        <div>
          <h3>{message}</h3>
          <h3>Login now</h3>
          <Link to="/login" className='btn btn-primary'>Login</Link>
        </div>
      }
    </div>
  )
}  


export default Home;