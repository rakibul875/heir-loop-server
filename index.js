const express = require('express')
const app = express()
const dotenv = require("dotenv");
const cors = require("cors")
const { MongoClient, ServerApiVersion } = require('mongodb');
const port = 8000
dotenv.config()

const uri = process.env.MONGO_DB_URI;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

app.use(cors());
app.use(express.json());

async function run() {
  try {
    
    await client.connect();
    const database= client.db('userInfo')
    const jobsCollection=database.collection('jobs');

    app.post('/jobs', async (req,res)=>{
        const job=req.body;
        const result= await jobsCollection.insertOne(job);
        res.send(result)
    })
    
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    
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