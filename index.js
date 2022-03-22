const { MongoClient } = require("mongodb");   // To restore data in server
let express = require("express");                    // Backbone // Engine
var cors = require("cors");     // Policy handler

const app = express();

const mongoDbUrl = "mongodb+srv://MonkAno:MonkAno@cluster0.cfvup.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";


app.get("/showdata", (req, res) => {
    MongoClient.connect(mongoDbUrl, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
        if (err) {
            console.log(err);
        }
        else {
            const db = client.db("LinkedList");
            const collection = db.collection("Sample data");
            collection.find().toArray((err, data) => {
                if (err) {
                    console.log(err);
                }
                else {
                    res.send(data);
                }
            });
        }
    });
});

// app.get("/showdata/:id", (req, res) => {
//     let postid = req.params.id;
//     MongoClient.connect(mongoDbUrl, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
//         if (err) {
//             console.log(err);
//         }
//         else {
//             const db = client.db("LinkedList");
//             const collection = db.collection("Sample data");
//             collection.find({"postId" : postid}).toArray((err, data) => {
//                 if (err) {
//                     console.log(err);
//                 }
//                 else {
//                     res.send(data);
//                 }
//             });
//         }
//     });
// });


app.get("/submit", async (req, res) => {
   
    let firstName = req.query.firstname;
    let age = req.query.age;
    let previousId = null;
    let nextId = null;

    let allData = await client
        .db("LinkedList")
        .collection("Sample data")
        .find()._id;
    

    let myData = {
        PreviousId: previousId,
        FirstName: firstName,
        Age: age,
        NextId: nextId
    };



    async function createListing(client, newListing, response) {
        const result = await client
            .db("LinkedList")
            .collection("Sample data")
            .insertOne(newListing); // MongoDB Function

        if (result.acknowledged === true) {
            res.send(
                "<script>window.location.href = 'http://127.0.0.1:5500/index.html'; </script>"
            );   // window.location.href = page redircetor
        } else {
            console.log("Data Not Inserted");
            response.json({ status: false });
        }
    }

    async function main() {
        const uri = mongoDbUrl;


        const client = new MongoClient(uri);

        try {
            await client.connect();
            const pen = await createListing(client, myData, res);
        } catch (e) {
            console.log("test");
            console.error(e);
        } finally {
            await client.close();
        }
    }
    main().catch(console.error);
});




const port = 9099;
app.listen(port, () => console.log(`Listening on port ${port}..`));


