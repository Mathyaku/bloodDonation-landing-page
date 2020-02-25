const express = require('express');
const nunjucks = require('nunjucks');

const server = express();

server.use(express.urlencoded({extended: true}))

// adding static files
server.use(express.static('./public'));

// template engine
nunjucks.configure('./', {
    express: server,
    noCache: true
});

//configure database
const Pool = require('pg').Pool;
const db = new Pool({
    user: 'postgresAdmin',
    password: '1234',
    host: 'localhost',
    port: 5432,
    database: 'donation'
});

server.get('/', function (req, res) {

    db.query("SELECT * FROM DONORS", function(err, result) {
        if(err) {
            return res.send("Erro de banco de dados.");
        }

        const donors = result.rows;

        return res.render('index.html', { donors });
    });
});


server.post('/', function (req, res) {
    const { name, email, blood } = req.body;

    if(!name || !blood || !blood) {
        return res.send("Todos os campos são obrigatórios.");
    }

    const query = `
        INSERT INTO donors ("name", "email", "blood") 
        VALUES ( $1, $2, $3 ) `;

    const values = [name, email, blood];

    db.query(query, values, function (err) {
        if(err) {
            return res.send("Erro de banco de dados.");
        }

        return res.redirect('/');
    });
});

server.listen(3333);