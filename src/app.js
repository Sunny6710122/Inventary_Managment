const express = require('express');
const hbs = require("hbs");
const path = require("path");
const app = express();
port = 8000;

const admin = require('firebase-admin');
const serviceAccount = require('../firebase.json'); // Replace with the path to your JSON file

// Initialize Firebase Admin SDK
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

let objectArray = [];



async function findItemById(docId) {
    try {
      const docRef = db.collection('pantryItems').doc(docId); // Replace 'pantryItems' with your collection name
      const doc = await docRef.get();
  
      if (!doc.exists) {
        console.log('No such document!');
        return null;
      }
  
      console.log('Document data:', doc.data());
      return doc.data();
    } catch (error) {
      console.error('Error getting document:', error);
      throw new Error('Error getting document');
    }
  }
  


// Example function to add an item to Firestore
async function addItem(name, quantity) {
  try {
    const docRef = db.collection('pantryItems').doc();
    await docRef.set({
      name: name,
      quantity: quantity
    });
    console.log(`Document added with ID: ${docRef.id}`);
  } catch (error) {
    console.error('Error adding document:', error);
  }
}

// Example function to get all items from Firestore
async function getItems() {
  try {
    objectArray = []
    const snapshot = await db.collection('pantryItems').get();
    snapshot.forEach(doc => {
    //   console.log(`${doc.id} =>`, doc.data());
    //   console.log(doc.data().quantity);
      objectArray.push({
            docid: doc.id,
            name: doc.data().name,
            quantity: doc.data().quantity
        });
    });
  } catch (error) {
    console.error('Error getting documents:', error);
  }
}

// Example function to update an item in Firestore
async function updateItem(docId, name, quantity) {
  try {
    const docRef = db.collection('pantryItems').doc(docId);
    await docRef.update({
      name: name,
      quantity: quantity
    });
    console.log(`Document with ID: ${docId} updated`);
  } catch (error) {
    console.error('Error updating document:', error);
  }
}

// Example function to delete an item from Firestore
async function deleteItem(docId) {
  try {
    const docRef = db.collection('pantryItems').doc(docId);
    await docRef.delete();
    console.log(`Document with ID: ${docId} deleted`);
  } catch (error) {
    console.error('Error deleting document:', error);
  }
}

// Example usage
// (async () => {
//   await addItem('Sunny', 10);
//   // Replace 'DOCUMENT_ID' with the actual ID of the document you want to update or delete
//   // await updateItem('DOCUMENT_ID', 'Apples', 20);
//   // await deleteItem('DOCUMENT_ID');
//   await getItems();
// })();

const templatePath = path.join(__dirname,"./Templates");

msgggg = "";
app.set("view engine","hbs");
app.set("views",templatePath);
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.get('/',async (req,res)=>
{
    await getItems();
    res.render("HomePage",{objectArray});
});

app.post('/delete',async (req,res)=>
{
    await deleteItem(req.body.button);
    await getItems();
    res.render("HomePage",{objectArray});
});

app.post('/update',async (req,res)=>
{
    let data2 = await findItemById(req.body.button)
    await getItems();
    res.render("HomePage",{objectArray, Name1: data2.name, Quantity1: data2.quantity, ID: req.body.button});
});

app.post('/AddUpdate',async (req,res)=>
{
    let Name2 = req.body.Item;
    let Quantity2 = req.body.Quantity;
    if(req.body.button=="")
    {
        await addItem(Name2,Quantity2);
    }
    else
    {
        await updateItem(req.body.button,Name2,Quantity2);
    }
    await getItems();
    res.render("HomePage",{objectArray});
});





app.listen(port,'localhost',()=>{
    console.log(`Listening on port number : ${port}`);
});







