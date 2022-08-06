const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;
const app = express();

// middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.EMA_USER}:${process.env.EMA_PASS}@cluster0.zxk0y.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const productCollection = client.db("emaJohn").collection("product");

        app.get('/products', async (req, res) => {
            const page = parseInt(req.query.page);
            const itemCount = parseInt(req.query.itemCount);
            
            const query = {};
            const cursor = productCollection.find(query);

            let result;
            if (page || itemCount){
                result = await cursor.skip(page*itemCount).limit(itemCount).toArray();
            }
            else{
                result = await cursor.toArray();
            }
            res.send(result);
        });

        // count all products
        app.get('/productCount', async (req, res) => {
            const count = await productCollection.estimatedDocumentCount();
            res.send({count});
        });

        // use post to get products by keys
        app.post('/productByKeys', async(req, res) =>{
            const keys = req.body;
            const ids = keys.map(id => ObjectId(id));
            const query = {_id: {$in: ids}};
            const cursor = productCollection.find(query);
            const products = await cursor.toArray()
            res.send(products);
        });
    }
    finally { }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Running ema-john on server');
});

app.listen(port, () => {
    console.log('ema-john is listening');
});