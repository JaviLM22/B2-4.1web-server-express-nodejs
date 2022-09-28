var express = require('express');
const fileUpload = require('express-fileupload');
const clientes = require('./rutas');
var morgan = require('morgan');
const { q } = require('./bdd')
var fs = require('fs')
const cors = require('cors');
var path = require('path')
var app = express();
app.use(cors());
app.use(express.json());
app.use(fileUpload());

// app.use((request, response, next) => {
//     console.log(new Date().toISOString(),request.url, request.method, request.params,request.query);
//     next();
// })

var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })
app.use(morgan('combined', { stream: accessLogStream }))

app.use('./clientes', clientes);

app.post('/upload', function (req, res) {
    const fichero = req.files.fichero;
    fichero.mv(`./files/${fichero.name}`, function (err) {
        if (err)
            return res.status(500).send(err);

        res.send({ datos: req.body, fichero: fichero.name });
    });
});

app.post('/uploadmultiple', function (req, res) {
    const ficheros = req.files.articulos;

    ficheros.forEach(fichero => {
        fichero.mv(`./files/${fichero.name}`, function (err) {
            if (err)
                return res.status(500).send(err);

        })
    });
    res.send({ datos: req.body, nombre: ficheros.map(i => i.name) });

});



app.get("/", function (req, res) {
    res.send("Hola mundo");
})

app.get("/ping", (req, res) => {
    res.send({ fecha: new Date().toISOString() });
})

app.get("/peticion", (req, res) => {
    res.send(req.query)
})

//Responder a petición de tipo post: prueba con curl
app.post("/formulario", (request, response) => {
    response.send({ body: request.body, query: request.query })
})

app.get("/customers", async (request, response) => {
    response.send(await
        q(`select * from customers 
           order by customer_id limit ${request.query.take}
           offset ${request.query.skip}`)
        )
    });

app.get("/customers/:id", async (req, res) => {
   const cliente = await q("select * from customers where customer_id = $1", [req.params.id])
   const facturas = await q("select * from orders where customer_id = $1", [req.params.id])
   res.send({cliente: cliente[0], facturas})
})



app.listen(5555, function () {
    console.log("Escuchando en puerto 5555")
})