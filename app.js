const express = require("express");
const app = express();
const { MongoClient } = require("mongodb");
const URL = "mongodb+srv://MonkAno:MonkAno@cluster0.cfvup.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

const client = new MongoClient(URL);

const PORT = 8080;
client.connect();


app.use(express.json());


app.get("/newblog", async (req, res) => {
    try {

        // Inserted Data
        const date = Math.floor(new Date().getTime() / 1000.0);
        const Post_id = Math.floor(Math.random() * 10000);
        let BlogTitle = req.query.BlogTitle;
        let BlogContent = req.query.BlogContent;
        let myBlogData = { BlogTitle, BlogContent, date, Post_id };


        const allBlog = await client.db("LinkedList").collection("Sample data").find().toArray();

        const lastBlog = allBlog[allBlog.length - 1];

        if (allBlog.length === 0) {
            myBlogData = { ...myBlogData, prev: null, next: null };
        } else {
            const updatedBlog = {
                ...lastBlog,
                next: Post_id,
            };
            client.db("LinkedList").collection("Sample data").findOneAndUpdate(
                { Post_id: lastBlog.Post_id },
                { $set: updatedBlog },
                { ReturnDocument: "after" }
            );
            myBlogData = { ...myBlogData, prev: lastBlog.Post_id, next: null };
        }

        const insertNewBlog = await client.db("LinkedList").collection("Sample data").insertOne(myBlogData);
        res
            .status(200)
            .send(
                "<script>window.location.href = 'http://127.0.0.1:5500//index.html'; </script>"
            );
    } catch (e) {
        console.log(e);
        res.status(422).send("Error in Posting");
    }
},
);

app.get("/allblog", (req, res) => {

    async function findAllBlog(client) {

        const allBlog = client.db("LinkedList").collection("Sample data").find();
        const result = await allBlog.toArray();
        res.send(result);
    }

    async function main() {
        const uri = URL;
        client(uri);

        try {
            await client.connect();
            const pen = await findAllBlog(client, res);
        } catch (e) {
            console.error(e);
        } finally {
            await client.close();
        }
    }
    main().catch(console.error);

   
}
);


app.listen(PORT, () => {
    console.log("server started at http://localhost:8080/");
})

