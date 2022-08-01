const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;
const app = express();

// middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.EMA_USER}:${process.env.EMA_PASS}@cluster0.zxk0y.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run () {
    try{
        const productCollection = client.db("emaJohn").collection("product");

        app.get('/product', async(req,res) =>{
            const query = {};
            const cursor = productCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        });
    }
    finally{}
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Running ema-john on server');
});

app.listen(port, () => {
    console.log('ema-john is listening');
});