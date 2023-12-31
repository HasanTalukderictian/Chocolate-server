const express = require('express')
const app = express()
const cors = require('cors');
const port = process.env.PORT || 4000;
require('dotenv').config();

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');



// middleware 
app.use(cors());
app.use(express.json());





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vtmwivk.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
     
    const ChocolateCollection = client.db("Chocolate_DB").collection("Chocolate");


   // trying to get post data
    app.post('/addItem', async(req, res) => {
       const newItem = req.body;

       console.log(newItem);
       const result = await ChocolateCollection.insertOne(newItem);
       res.send(result);
    })
    

    app.get('/chocolate/:id', async(req, res)=>{
        const id = req.params.id;
        const query = {_id: new ObjectId(id)}
        const result = await ChocolateCollection.findOne(query);
        res.send(result);
    })



    // try to get data 

    app.get('/chocolate', async(req, res) =>{
        const cursor = ChocolateCollection.find();
        const result = await cursor.toArray();
        res.send(result);
    })



    app.put('/chocolate/:id', async (req, res) => {
        const id = req.params.id;
    
        const filter = { _id: new ObjectId(id) }
        const options = { upsert: true };
        const updatedChocolate = req.body;

        console.log(updatedChocolate);
        const chocolate = {
            $set: {
                name:updatedChocolate.name, country:updatedChocolate.country,
                category:updatedChocolate.category, image:updatedChocolate.image
            }
        }
        const result = await ChocolateCollection.updateOne(filter, chocolate,options);
        res.send(result);
    })


    // delete item from database 

    app.delete('/chocolate/:id', async(req, res) =>{
    
        const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await ChocolateCollection.deleteOne(query);
            res.send(result);
    })

    // updated chocolate item from database

   


    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})