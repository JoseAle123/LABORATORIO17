const express = require("express");
const mysql = require('mysql');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const app = express();



app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:3000",
    methods: ["POST", "GET"],
    credentials: true
}));


const db = mysql.createConnection({
    host : "localhost",
    user : "root",
    password : "josemachaca",
    database : "LIBRERIA"
});

const verifyUser = (req, res, next) => {
    const token = req.cookies.token;
    if(!token){
        return res.json({message : "we need token plese provide it. "})
    } else{
        jwt.verify(token, "our.jsonwebtoken-secret-key", (err, decoded) => {
            if(err){
                return res.json({message : "Authentication erro"})
            } else{
                req.name = decoded.name;
                next();
            }
        })
    }
}

app.get('/', verifyUser, (req, res) => {
    return res.json({Status : "Success", name : req.name})
})

app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const sql = "SELECT * FROM login WHERE email = ? AND password = ?";
    db.query(sql, [email, password], (err, data) => {
        if (err) {
            console.error('Error en la consulta SQL:', err);
            return res.status(500).json({ message: 'Error en el servidor' });
        }
        if (data.length > 0) {
            const name = data[0].name;
            const token = jwt.sign({ name }, "our.jsonwebtoken-secret-key", { expiresIn: '1d' });
            res.cookie('token', token);
            return res.json({ status: 'Success', token }); // Envía el token JWT como parte de la respuesta
        } else {
            return res.status(401).json({ message: 'Credenciales incorrectas' });
        }
    });
});

db.connect((err) => {
    if (err) {
        console.error('Error al conectar a la base de datos:', err);
        return;
    }
    console.log('Conexión establecida con la base de datos');
});

app.get('/logout', (req, res) => {
    res.clearCookie('token');
    return res.json({Status : "Success"})
})

//insertar clientes

app.post('/insertar', verifyUser, (req, res) => {
    const { codigoID, primer_apellido, segundo_apellido, DNI } = req.body;
    const sql = "INSERT INTO cliente (codigoID, primer_apellido, segundo_apellido, DNI) VALUES (?, ?, ?, ?)";
    db.query(sql, [codigoID, primer_apellido, segundo_apellido, DNI], (err, result) => {
        if (err) {
            console.error('Error en la consulta SQL:', err);
            return res.status(500).json({ message: 'Error en el servidor' });
        }
        console.log('Datos insertados correctamente en la tabla cliente');
        return res.json({ status: 'Success', message: 'Datos insertados correctamente' });
    });
});

 
// tabla de clientes

app.get('/clientes', verifyUser, (req, res) => {
    const sql = "SELECT * FROM cliente";
    db.query(sql, (err, data) => {
        if (err) {
            console.error('Error en la consulta SQL:', err);
            return res.status(500).json({ message: 'Error en el servidor' });
        }
        return res.json(data); // Devuelve los datos de la tabla cliente
    });
});


// reporte 


app.get('/IDimpar', verifyUser, (req, res) => {
    const sql = "CALL mostrar_ids_impares()";
    db.query(sql, (err, data) => {
        if (err) {
            console.error('Error en la consulta SQL:', err);
            return res.status(500).json({ message: 'Error en el servidor' });
        }
        return res.json(data[0]); // Devuelve los datos de la tabla agencia
    });
});
 



app.listen(3001, () => {
    console.log("Escuchando en el puerto 3001");
});



