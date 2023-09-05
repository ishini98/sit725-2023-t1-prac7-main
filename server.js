let express = require('express');
let app = express();

const {MongoClient} = require('mongodb');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const uri = 'mongodb+srv://admin:admin@cluster0.h67qv0n.mongodb.net/?retryWrites=true&w=majority';
const client = new MongoClient(uri);
let dbCollection;

app.use(express.static(__dirname + '/public'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

let http = require('http').createServer(app);
let io = require('socket.io')(http);


io.on('connection',(socket)=>{
    console.log('A User connected...');

    socket.on('chat message', (message) => {
        // Broadcast the message to all connected clients
        io.emit('chat message', message);
    });
    
    socket.on('disconnect',()=>{
        console.log('User disconnected...');
    });
    setInterval(()=>{
        socket.emit('number', parseInt(Math.random()*10));
      }, 1000);
});


function dbConnection(collectionName) {
    client.connect(err => {
        dbCollection = client.db().collection(collectionName);
        if (!err) {
            console.log('DB Connected');
            console.log(dbCollection);
        } else {
            console.log(err);
        }
    });
}




function insert(cat, callback) {
    dbCollection.insertOne(cat, callback);
}

function getAllCats(callback) {
    dbCollection.find().toArray(callback);
}

app.get('/api/cats',(req,res) => {
    getAllCats((error, result) => {
        if (error) {
            res.json({statusCode:400, message: err});
        } else {
            res.json({statusCode: 200, data: result, message: 'Successfully'});
        }
    });
    //res.json({statusCode: 200, data: cardList, message:"Success"})
});

app.post('/api/cats', upload.single('image'), (req, res) => {
    let cat = req.body;
    cat.image =  req.file.path; // Store the path to the uploaded image

    insert(cat, (err, result) => {
        if (err) {
            res.json({ statusCode: 400, message: err });
        } else {
            res.json({ statusCode: 200, data: result, message: 'Cat successfully added' });
        }
    });
});

/*app.post('/api/cats', (req, res) => {
    let cat = req.body;
    insert(cat, (err, result) => {
        if (err) {
            res.json({statusCode:400, message: err});
        } else {
            res.json({statusCode: 200, data: result, message: 'Cat successfully added'});
        }
    });
});*/



const port = process.env.port || 5500;
http.listen(port,()=>{
    console.log('App listening to: ' + port);
    dbConnection('Cats');
})
