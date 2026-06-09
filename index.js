const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = 8000;
dotenv.config();

const uri = process.env.MONGO_DB_URI;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

app.use(cors());
app.use(express.json());

async function run() {
  try {
    await client.connect();
    const database = client.db("userInfo");
    const jobsCollection = database.collection("jobs");
    const companyCollection = database.collection("company");
    const applicationCollection= database.collection('application')
    const planCollection=database.collection('plans')

    app.get("/jobs", async (req, res) => {
      const query = {};
      if (req.query.companyId) {
        query.companyId = req.query.companyId;
      }
      if (req.query.status) {
        query.status = req.query.status;
      }
      const cursor = jobsCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get('/jobs/:id',async(req,res)=>{
      const id= req.params.id
      const query={
        _id:new ObjectId(id)
      }
      const result= await jobsCollection.findOne(query)
      res.send(result)
    })

    app.post("/jobs", async (req, res) => {
      const job = req.body;
      const newJobs={
        ...job,
        createdAt:new Date() 
      }
      const result = await jobsCollection.insertOne(newJobs);
      res.send(result);
    });
    //application related data
    app.get('/application',async (req,res)=>{
      const query={}
      if(req.query.applicantId){
        query.applicantId=req.query.applicantId;
      }
      if(req.query.jobId){
        query.jobId=req.query.jobId;
      }
      const cursor=applicationCollection.find(query);
      const result= await cursor.toArray();
      res.send(result)
    })

    app.post('/application', async (req,res)=>{
      const application=req.body;
      const newApplication={
        ...application,
        createdAt: new Date()
      }
      const result= await applicationCollection.insertOne(newApplication)
      res.send(result)
    })

    //plans gate

    app.get('/plans',async(req,res)=>{
      const query={}
      if(req.query.plan_id){
        query.id=req.query.plan_id
      }
      const result= await planCollection.findOne(query)
      res.send(result)
    })

    //company post and get

    app.get("/my/company", async (req, res) => {
      const query = {};
      if (req.query.recruiterId) {
        query.recruiterId = req.query.recruiterId;
      }
      console.log(query);
      const result = await companyCollection.findOne(query);
      console.log(result);
      res.send(result ||{});
    });

    app.post("/company", async (req, res) => {
      const company = req.body;
      const newCompany={
        ...company,
        createdAt: new Date()
      }
      const result = await companyCollection.insertOne(newCompany);
      res.send(result || {});
    });


    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!",
    );
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
