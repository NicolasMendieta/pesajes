var express = require('express');
var app = express();
var mysql = require('mysql');

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "envolsadora"
});
con.connect(function (err) {
    if (err) throw err;
});
app.get('/api', function (req, res) {
    con.query("\tSELECT\n" +
        "\tifnull(sum(if(pesaje > 45,1,0)),0) AS cincuenta,\n" +
        "\tifnull(sum(if(pesaje <= 45 AND pesaje >33,1,0)),0) AS cuarenta,\n" +
        "\tifnull(sum(if(pesaje <= 33 AND pesaje >10,1,0)),0) AS veinticinco\n" +
        "\tFROM pesajes\n" +
        "\tWHERE date(pesajes.date) = DATE(NOW())", function (err, result, fields) {
        if (err) throw err;
        console.log(result[0])
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({data: result[0]}));
    });


})


app.get('/', function (req, res) {
    res.send(
        '<div style="margin-top: 10%;display: flex; justify-content: space-around">' +
        '<div style="width: 30%; ">' +
        '<h1>25 kg<h1>' +
        '<p>Cantidad:</p><label for="" id="veinticinco">0</label>' +
        '   </div>' +
        '<div style="width: 30%">' +
        '<h1>40 kg<h1>' +
        '<p>Cantidad: </p><label for="" id="cuarenta">0</label>' +
        '   </div>' +
        '<div style="width: 30%">' +
        '<h1>50 kg<h1>' +
        '<p>Cantidad: </p><label for="" id="cincuenta">0</label>' +
        '   </div>' +
        '</div>' +
        '<script>' +
        'var veinticinco  = document.getElementById("veinticinco");' +
        'var cuarenta  = document.getElementById("cuarenta");' +
        'var cincuenta  = document.getElementById("cincuenta");' +
        'function actualizar(){' +
        'fetch("http://localhost:3000/api")' +
        '  .then(function(response) {' +
        '    return response.json();' +
        '  }' +
        ')' +
        '.then(function(response) {' +
        '    if (veinticinco.innerText!= response.data.veinticinco){' +
        '       veinticinco.innerText = response.data.veinticinco' +
        '       }  ' +
        '    if (cuarenta.innerText!= response.data.cuarenta){' +
        '       cuarenta.innerText = response.data.cuarenta' +
        '       }  ' +
        '    if (cincuenta.innerText!= response.data.cincuenta){' +
        '       cincuenta.innerText = response.data.cincuenta' +
        '       }  ' +
        '})' +
        '}' +
        'setInterval ("actualizar()", 5000);' +
        '</script>'
    );
});

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});