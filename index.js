const express = require('express')
const cors = require('cors')
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

//middle ware
app.use(cors());
app.use(express.json());

app.get('/',(req,res)=>{
    res.send('Travel management server is running')
})

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.s6hdjpg.mongodb.net/?retryWrites=true&w=majority`;


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
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const travelDataCollection = client.db('TravelDB').collection('TravelData')

  app.post('/traveldata',async(req,res)=>{
    const newTravelData = req.body;
    console.log(newTravelData);
    const result = await travelDataCollection.insertOne(newTravelData);
    res.send(result);

  })
//get all the travel data
  app.get('/traveldata',async(req,res)=>{
    const cursor = travelDataCollection.find();
    const result = await cursor.toArray();
   
    res.send(result)
  })

//get single travel data
app.get('/traveldata/:id',async(req,res)=>{
const id = req.params.id;
const query = {_id : new ObjectId(id)}
const result = await travelDataCollection.findOne(query)
res.send(result);
})

//update a data api

app.put('/traveldata/:id',async(req,res)=>{
  const id = req.params.id;
  const filter = {_id: new ObjectId(id)}
  const updatedData = req.body;
  const options = {upsert:true}
  const updatedTravelData ={
   $set:{
    spotName:updatedData.spotName,
    countryName:updatedData.countryName,
    season:updatedData.season,
    averageCost:updatedData.averageCost,
    travelDuration:updatedData.travelDuration,
    totalVisitorPerYear:updatedData.totalVisitorPerYear,
    email :updatedData.email,
    name :updatedData.name,
    shortDescription:updatedData.shortDescription,
    photoURL:updatedData.photoURL,
    vehicle:updatedData.vehicle
   }
 
  }
  const result = await travelDataCollection.updateOne(filter,updatedTravelData,options)
  res.send(result)
})

app.delete('/traveldata/:id', async(req,res)=>{
  const id = req.params.id;
  const query = {_id : new ObjectId(id)}
  const result =await travelDataCollection.deleteOne(query);
  res.send(result);
})

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.listen(port,()=>{
    console.log(`server is running on ${port}`)
})