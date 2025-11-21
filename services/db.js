const { MongoClient } = require('mongodb');
const url = process.env.MONGO_URL;
let client;
let db;
 
const connectDB = async () => {
  if (db) return db;
  client = new MongoClient(url);
  await client.connect();
  db = client.db(); 
  console.log('Connected to MongoDB');
  return db;
};
 
const getDB = () => db;
const closeDB = async () => client && client.close();
 
module.exports = { connectDB, getDB, closeDB };