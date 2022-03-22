const { MongoClient } = require("mongodb");   // To restore data in server
let express = require("express");                    // Backbone // Engine
var cors = require("cors");     // Policy handler
const cli = require("nodemon/lib/cli");

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
                    res.send(data[0]);
                    console.log(data.length);
                }
            });
        }
    });
});


app.get("/nextPost/:id", (req, res) => {

    let nextPostId = req.params.id;

    async function findListing(client) {
        const cursor = client.db("LinkedList").collection("Sample data").find();
        const result = await cursor.toArray();
        res.json(result);
    }

    async function main() {
        const uri = mongoDbUrl

        const client = new MongoClient(uri);

        try {
            await client.connect();
            const pen = await findListing(client, res);
        } catch (e) {
            console.error(e);
        } finally {
            await client.close();
        }
    }
    main().catch(console.error);

});


// app.get("/submit", async (req, res) => {

//     let postId = Math.floor(Math.random() * 1000);
//     let firstName = req.query.firstname;
//     let createdDate = Math.floor(new Date().getTime() / 1000.0);
//     let age = req.query.age;

//     let myData = {
//         MyId: postId,
//         PreviousId: null,
//         FirstName: firstName,
//         Age: age,
//         createdAt: createdDate,
//         NextId: null
//     };

//     let allPosts = async function allpost() {
//         const result = await client.db("LinkedList").collection("Sample data").find().toArray();
//         return result;
//     }

//     console.log(allPosts.result);

//     const length = allPosts.length;
//     const lastPost = allPosts[length - 1];

//     if (length === 0) {

//         async function createListing(client, newListing, response) {
//             const result = await client
//                 .db("LinkedList")
//                 .collection("Sample data")
//                 .insertOne(newListing); // MongoDB Function

//             if (result.acknowledged === true) {
//                 res.send(
//                     "<script>window.location.href = 'http://127.0.0.1:5500/index.html'; </script>"
//                 );   // window.location.href = page redircetor
//             } else {
//                 console.log("Data Not Inserted");
//                 response.json({ status: false });
//             }
//         }

//         async function main() {
//             const uri = mongoDbUrl;


//             const client = new MongoClient(uri);

//             try {
//                 await client.connect();
//                 const pen = await createListing(client, myData, res);
//             } catch (e) {
//                 console.log("test");
//                 console.error(e);
//             } finally {
//                 await client.close();
//             }
//         }
//         main().catch(console.error);
//     }

//     if (length !== 0 && lastPost.NextId === null) {

//         const lastPostId = lastPost.MyId;
//         let newPostId = Math.floor(Math.random() * 1000);
//         myData.MyId = newPostId;
//         const postData = myData;
//         const nextData = {
//             postData,
//             MyId: newPostId,
//             nextId: null,
//             previousId: lastPostId

//         }
//         console.log(nextData);

//         async function createListing(client, newListing, response) {
//             const result = await client
//                 .db("LinkedList")
//                 .collection("Sample data")
//                 .insertOne(newListing); // MongoDB Function

//             if (result.acknowledged === true) {
//                 res.send(
//                     "<script>window.location.href = 'http://127.0.0.1:5500/index.html'; </script>"
//                 );   // window.location.href = page redircetor
//             } else {
//                 console.log("Data Not Inserted");
//                 response.json({ status: false });
//             }
//         }

//         async function main() {
//             const uri = mongoDbUrl;


//             const client = new MongoClient(uri);

//             try {
//                 await client.connect();
//                 const pen = await createListing(client, nextData, res);
//             } catch (e) {
//                 console.log("test");
//                 console.error(e);
//             } finally {
//                 await client.close();
//             }
//         }
//         main().catch(console.error);
//     }



// });




const port = 9099;
app.listen(port, () => console.log(`Listening on port ${port}..`));


