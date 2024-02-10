import React, { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css'; // Importar estilos de Bootstrap
import axios from 'axios'
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [values, setValues] = useState({
    email: '',
    password: ''
  });
  const navigate = useNavigate();

  axios.defaults.withCredentials = true;

  const handleLogin = (e) => {
    e.preventDefault();
    
    axios.post('http://localhost:3001/login', values, { withCredentials: true })
      .then(res => {
        if (res.data.status === "Success") {
          navigate('/');
        } else {
          alert(res.data.message);
        }
      })
      .catch(err => {
        console.error('Error en la solicitud:', err);
        alert('Error en la solicitud, por favor inténtalo de nuevo más tarde');
      });
  };
  

  return(
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="card">
        <div className="card-body">
          <h2 className="card-title text-center mb-4">Iniciar Sesión</h2>
          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label htmlFor="username" className="form-label">Nombre de usuario:</label>
              <input type="text" className="form-control" onChange={e => setValues({...values, email: e.target.value})} />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Contraseña:</label>
              <input type="password" className="form-control"  onChange={e => setValues({...values, password: e.target.value})} />
            </div>
            <button type="submit" className="btn btn-primary w-100">Iniciar Sesión</button>
          </form>
        </div>
      </div>
    </div>
  )
}
