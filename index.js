const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
app.use(cors());
app.use(express.json());
const dotenv = require('dotenv');
const phones = require('./phones.json');
dotenv.config();
const port = process.env.PORT || 7000;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

const uri = `mongodb+srv://${process.env.DB_user}:${process.env.DB_Password}@cluster0.rwfgqco.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const phoneCollection = client.db('RePhoneX').collection('Phones');
    const categoryCollection = client.db('RePhoneX').collection('Category');
    const UsersCollection = client.db('RePhoneX').collection('SellerUser');
    const MeetingCollection = client.db('RePhoneX').collection('Meeting');

    app.get('/category', async (req, res) => {
      const query = {};
      const result = await categoryCollection.find(query).toArray();
      res.send(result);
    });

    app.get('/category/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await categoryCollection.findOne(query);
      res.send(result);
    });

    app.get('/phones', async (req, res) => {
      const query = {};
      const result = await phoneCollection.find(query).toArray();
      res.send(result);
    });

    app.get('/phone', async (req, res) => {
      const phone = req.query;
      console.log('/phone', phone);
      const result = await phoneCollection.find(phone).toArray();
      console.log('ka', result);
      res.send(result);
    });

    app.post('/phones', async (req, res) => {
      const user = req.body;
      console.log('as', user);
      const result = await phoneCollection.insertOne(user);
      console.log('sa', result);
      res.send(result);
    });

    app.delete('/phones/:id', async (req, res) => {
      const id = req.params.id;
      console.log('product_id', id);
      console.log('aksudaskf', user);
      const query = { _id: new ObjectId(id) };
      const result = await phoneCollection.deleteOne(query);
      console.log('dfdfddd', result);
      res.send(result);
    });

    app.get('/phones/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await phoneCollection.findOne(query);
      res.send(result);
    });

    app.post('/User', async (req, res) => {
      const user = req.body;
      console.log('sdfddss', user);
      const result = await UsersCollection.insertOne(user);
      res.send(result);
    });

    app.get('/users', async (req, res) => {
      const query = req.query;
      const result = await UsersCollection.find(query).toArray();
      console.log('fsfds', result);
      res.send(result);
    });

    app.post('/users', async (req, res) => {
      const email = req.query.email;
      const person = req.query.person;
      console.log('sssss', email, person);
      const query = { email: email, person: person };
      const result = await UsersCollection.findOne(query);
      res.send(result);
    });

    app.get('/users/admin/:id', async (req, res) => {
      const email = req.params.id;
      const query = { email };
      console.log('query', query);
      const user = await UsersCollection.findOne(query);
      console.log('newUser', user);

      res.send({ isAdmin: user?.role === 'admin' });
    });

    app.get('/users/sales/:id', async (req, res) => {
      const email = req.params.id;
      const query = { email };
      console.log('query', query);
      const user = await UsersCollection.findOne(query);
      console.log('newUser', user);
      res.send({ isSale: user?.person === 'Seller' });
    });
    app.get('/users/customer/:id', async (req, res) => {
      const email = req.params.id;
      const query = { email };
      console.log('query', query);
      const user = await UsersCollection.findOne(query);
      console.log('newUser', user);
      res.send({ isCustomer: user?.person === 'Customer' });
    });

    app.put('/users/admin/:id', async (req, res) => {
      const id = req.params.id;
      console.log('mt-15', id);
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedDoc = {
        $set: { role: 'admin' },
      };
      const result = await UsersCollection.updateOne(
        filter,
        updatedDoc,
        options
      );
      console.log('userrrrrr', result);
      res.send(result);
    });

    app.post('/meeting', async (req, res) => {
      const meeting = req.body;
      console.log('mm', meeting);
      const result = await MeetingCollection.insertOne(meeting);
      res.send(result);
    });

    app.get('/meeting', async (req, res) => {
      const query = {};
      // console.log(query);
      const result = await MeetingCollection.find(query).toArray();
      res.send(result);
    });

    app.get('/meetings', async (req, res) => {
      const query = req.query;
      console.log('ss', query);
      const result = await MeetingCollection.find(query).toArray();
      res.send(result);
    });
  } finally {
  }
}
run().catch((err) => console.error(err));

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
