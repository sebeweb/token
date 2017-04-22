var express = require('express');
var jwt = require('jsonwebtoken');
var sqlite = require('sqlite3').verbose();
var bodyParser = require('body-parser');
var db = new sqlite.Database("token");

var app = express();
var api = express.Router();
var port = process.env.PORT || 5364;
db.serialize(function () {
    db.run("DROP TABLE users");
    db.run("CREATE TABLE users (id INT, username VARCHAR(255), password VARCHAR(255), age INT)");
    db.run("INSERT INTO users VALUES (1,'user', 'pass', 26)");
});
db.close();

api.use(function (req, res, next) {
    var token = req.param("token")||req.headers['x-access-token']||req.body.token ;;
    console.log(token);
    
        // verifies secret and checks exp
        jwt.verify(token, 'shhhhh', function (err, decoded) {
            if (err) {
                return res.json({success: false, message: 'Failed to authenticate token.'});
            } else {
                // if everything is good, save to request for use in other routes
                req.decoded = decoded;
                next();
            }
        });

});

api.get("/users", function (req, res) {
//    db.each("SELECT * FROM users", function (err, row) {
//        res.send("Username : " + row.username + "\n\
//age: " + row.age);
//    });
res.send("tu es dans l'api");
});

app.get("/", function (req, res) {
    var token = jwt.sign({foo: 'bar'}, 'shhhhh');
    res.send("Pour acceder aux utilisateurs: www.token.fr:" + port + "/api/users\n\r token: "+ token);
    
});
app.use("/api", api);
//console.log(token);
app.listen(port);