/**
 * Example node.js restify manager for helpers and pages
 */
var restify = require('restify')
    mongoClient = require('mongodb').MongoClient,
    ObjectID = require('mongodb').ObjectID,
    deparam = require('node-jquery-deparam');


var server = restify.createServer({
    name: 'BHM',
    version: '0.5.2'
});

server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());

function database(callback) {
    mongoClient.connect('mongodb://localhost:27017/bhmexample', function(err, db) {
        if (err) {
            console.log('Connection error to mongodb.helpers');
            return false;
        }

        callback(db);

    });
}

function checkID( id ) {
    if (typeof(id) == 'number') return id;
    if (typeof(Number(id)) == 'number' && !isNaN(Number(id))) return Number(id);
    return ObjectID(id);
}

function outFormat( docs ) {
    if (!Array.isArray(docs)) {
        docs.id = docs._id;
        delete docs._id;
        return docs;
    }
    for (var i=0; i < docs.length; i++) {
        docs[i].id = docs[i]._id;
        delete docs[i]._id;
    }
    return docs;
}

function inFormat( docs ) {
    if (!Array.isArray(docs)) {
        docs._id = checkID(docs.id);
        delete docs.id;
        return docs;
    }
    for (var i=0; i < docs.length; i++) {
        docs[i]._id = checkID(docs[i].id);
        delete docs[i].id;
    }
    return docs;
}

/* helper listening */
server.get('/helpers', function(req, res, next) {
    var data = req.query;


    if (typeof(data.collection) == 'undefined') {

        database(function(db) {

            db.collection('helpers').find({}).toArray(function(err, docs) {
                res.send(outFormat(docs));
                db.close();
            })
        })
        return;
    }
    database(function(db) {
        var p = data.collection.pathname,
            index = data.collection.indexpage,
            find = [{"url":p}];
        if (p.substr(-1) == '/') {
            for (var i = 0; i<index.length; i++) {
                find.push({"url":p+index[i]});
            }
        }

        db.collection('pages').find({$or:find}).toArray(function(err, docs) {
            if (!docs.length) {
                res.send('[]');
                db.close();
                return false;
            }
            var pages = docs[0]._id;
            db.collection('helpers').find({"page_ids":{$regex: ".*"+pages+".*"}}).toArray(function(err, docs) {
                res.send(outFormat(docs));
                db.close();
            });
        });

    });

    return next();
});

server.post('/helpers', function(req, res, next) {

    var data = deparam(req.body);

    var model = inFormat(data.model);
    console.log(model);

    database(function(db) {
        db.collection('helpers').save(model);
        db.collection('helpers').find({_id:model._id}).toArray(function(err, docs) {
            res.send(outFormat(docs));
            db.close();
        });
    });

    return next();
});

server.del('/helpers', function(req, res, next) {
    var data = JSON.parse(req.body),
        model = inFormat(data.model);
    database(function(db) {
        db.collection('helpers').remove({_id:model._id});
        res.send({response:'success'});
        db.close();
    });

    return next();
});

/* pages listening */
server.get('/pages', function(req, res, next) {
    database(function(db) {
        db.collection('pages').find({}).toArray(function(err, docs) {
            var docs = outFormat(docs);
            res.send(docs);
            db.close();
        })
    });
    return next();
});

server.post('/pages', function(req, res, next) {
    var data = JSON.parse(req.body),
        model = inFormat(data.model);

    database(function(db) {
        db.collection('pages').save(model);
        db.collection('pages').find({_id:model._id}).toArray(function(err, docs) {
            res.send(outFormat(docs));
            db.close();
        })
    });
    return next();
});

server.del('/pages', function(req, res, next) {
    var data = JSON.parse(req.body),
        model = inFormat(data.model);
    database(function(db) {
        db.collection('pages').remove({_id:model._id});
        res.send({response:'success'});
        db.close();
    })
});

server.listen(8080, function() {
    console.log('%s listening at %s', server.name, server.url);
});
