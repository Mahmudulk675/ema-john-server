const express = require('express')
// const bodyParser = require('body-parser')
require('dotenv').config();
const cors = require('cors')

const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.6br73.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express()
app.use(express.json());
app.use(cors());
// app.use(bodyParser.json());
app.use(express.urlencoded({ extended:false }));

const port = 4000

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const productsCollection = client.db("EmaJohnStore").collection("products");
  const ordersCollection = client.db("EmaJohnStore").collection("orders");
  
//   app.post('/addProduct', (req, res) => {
//       const products = req.body;
//       console.log(products);
//       productsCollection.insertMany(products)
//       .then(result => {
//          res.send(result.insertCount) ;
//       })
//   })

app.post('/addProduct', (req, res) => {
    const products = req.body;
    console.log(products);
    productsCollection.insertOne(products)
    .then(result => {
       res.send(result.insertCount) ;
    })
})

//   Read Data

app.get('/products', (req, res) => {
    productsCollection.find({})
    .toArray((err, documents)=>{
        res.send(documents)
    })
})


app.get('/product/:key', (req, res) => {
    productsCollection.find({key: req.params.key})
    .toArray((err, documents)=>{
        res.send(documents[0])
    })
})


app.post('/productsByKeys', (req, res)=>{
    const productKeys = req.body;
    productsCollection.find({key: { $in: productKeys}})
    .toArray((err, documents)=>{
        res.send(documents)
        console.log(documents);
    })
    
})


app.post('/addOrder', (req, res) => {
    const orders = req.body;
    ordersCollection.insertOne(orders)
    .then(result => {
       res.send(result.insertCount > 0) ;
    })
})

});


app.listen(port)

