var express = require("express");

// Configure server

var app = express.createServer();
app.use(express.bodyParser());
app.use(express.errorHandler());
app.use(express.static(__dirname + "/static"));

// Database :)

var database = {
    docs: [],
    nextId: 0,
    add: function(doc) {
        doc.id = "" + (++database.nextId);
        database.docs.push(doc);
    },
    find: function(id) {
        for (var i = 0, l = database.docs.length; i < l; i++) {
            var doc = database.docs[i];
            if (doc.id == id) return doc;
        }
        return null;
    },
    remove: function(id) {
        var doc = database.find(id);
        if (!doc) return;
        var index = database.docs.indexOf(doc);
        database.docs = database.docs.slice(0, index).concat(database.docs.slice(index + 1));
    }
};

// Pages

app.get("/", function(req, res) {
    res.render("index.ejs", { docs: database.docs, layout: false });
});

app.get("/new", function(req, res) {
    var doc = {
        todo: req.param("todo"),
        done: false
    };
    database.add(doc);
    res.redirect("/");
});

app.get("/done/:id", function(req, res) {
    var doc = database.find(req.param("id"));
    doc.done = !doc.done;
    res.redirect("/");
});

app.get("/delete/:id", function(req, res) {
    database.remove(req.param("id"));
    res.redirect("/");
});

app.listen(parseInt(process.env.PORT, 10) || 1337);
console.log("Listening on http://localhost:" + app.address().port + "/");
