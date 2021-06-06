//https://www.tutorialsteacher.com/nodejs/expressjs-web-application (webapp's step-by-step tutorial)
//https://www.tutorialspoint.com/http/http_methods.htm  (HTTP request methods)

var express = require('express')
const fs = require('fs')
const qs = require('querystring')
const multer = require('multer')
const {queryStores} = require('./src/api/storesApi.js') 
const {insertPhoto,queryAlbumIds} = require('./src/api/photosApi.js')

var app = express()


app.get('/', function (req, res) {
    console.log(req.url)
    res.sendFile(__dirname + '/' + 'index.html');
});

app.get('/todo', function (req, res) {
    console.log(req.url)
    res.sendFile(__dirname + '/src/todo/' + 'todo.html');
});

app.get('/stores/', function (req, res) {
    console.log(req.url);
    res.sendFile(__dirname + '/src/stores/' + 'stores.html');
});

app.get('/upload/', function (req, res) {
    console.log(req.url);
    res.sendFile(__dirname + '/src/photos/' + 'upload.html');
});

app.get('/album', function (req, res) {
    console.log(req.url)
    res.sendFile(__dirname + '/src/photos/' + 'album.html');
});

app.get('/stores/api', function (req, res) {
    console.log(req.url);
    try {
        const querystr = req.url.replace('/stores/api?', '')
        const opts = qs.parse(querystr)
        //console.log(opts)
        let stores = queryStores(opts)
        //console.log(stores)
        res.json(stores)
    } catch (error) {
        console.error(error)
    }
})

app.get('/photos/album/api', function (req, res) {
    console.log(req.url);
    try {
        const querystr = req.url.replace('/photos/album/api?', '')
        const rec = qs.parse(querystr)
        //console.log(opts)
        queryAlbumIds(rec, (response) => {
            //console.log(response)
            res.json(response)
        })
    } catch (error) {
        console.error(error.message)
    }
})

app.get('/stores/details/', function (req, res) {
    console.log(req.url);
    res.sendFile(__dirname + '/src/stores/details' + '/details.html' )
});

app.get('/*', function (req, res) {
    console.log(req.url);
    res.sendFile(__dirname + '/' + req.url);
});

let record = {
    no: -1,                     // is assigned as Date.now()
    albumid: '',                // default current date, but user can change it while submiting photo
    caption: '',                // given by user
    path: ''                    // file name saved in backend
}

let storage = multer.diskStorage({
    destination: function (req, file, callback) {
        let dir =  __dirname + '/database/photos'
        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir)
        }
        // invoke next handler    
        callback(null, dir)
    },

    filename: function (req, file, callback) {
        record.no = Date.now()
        let seperators = file.originalname.split('.') 
        record.path = `${seperators[0]}_${record.no}.${seperators[1]}`  //i.e. 'abc.jpg' as 'abc_67597243572345.jpg"
        // invoke next handler   
        callback(null, record.path)
    }
})
let upload = multer({ storage: storage })

//passing multer as middleware
app.post('/photos/upload', upload.any(), function (req, res) {
    if (req.body) {
        record.albumid = req.body.albumid
        record.caption = req.body.caption
        console.log(`Upload successfully: album id is ${req.body.albumid} , caption is ${req.body.caption}` )
        insertPhoto(record)

        //redirect to album page after upload compeletes
        res.sendFile(__dirname + '/src/photos/' + 'album.html')
    } 
})


var server = app.listen(5000, function () {
    console.log('Node server is running..');
});