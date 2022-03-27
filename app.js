const express = require("express");
const app = express();
const { MongoClient } = require("mongodb");
const URL =
  "mongodb+srv://MonkAno:MonkAno@cluster0.cfvup.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

const client = new MongoClient(URL);

const PORT = 8080;
client.connect();
app.use(express.json());

app.get("/newblog", async (req, res) => {
  // Inserted Data
  const date = Math.floor(new Date().getTime() / 1000.0);
  const Post_id = Math.floor(Math.random() * 10000);
  let BlogTitle = req.query.BlogTitle;
  let BlogContent = req.query.BlogContent;
  let myBlogData = { BlogTitle, BlogContent, date, Post_id };

  const allBlog = await client
    .db("LinkedList")
    .collection("Sample data")
    .find()
    .toArray();

  const lastBlog = allBlog[allBlog.length - 1];

  if (allBlog.length === 0) {
    myBlogData = { ...myBlogData, prev: null, next: null };
  } else {
    const updatedBlog = {
      ...lastBlog,
      next: Post_id,
    };
    client
      .db("LinkedList")
      .collection("Sample data")
      .findOneAndUpdate(
        { Post_id: lastBlog.Post_id },
        { $set: updatedBlog },
        { ReturnDocument: "after" }
      );
    myBlogData = { ...myBlogData, prev: lastBlog.Post_id, next: null };
  }

  const insertNewBlog = await client
    .db("LinkedList")
    .collection("Sample data")
    .insertOne(myBlogData);
  res
    .status(200)
    .send(
      "<script>window.location.href = 'http://127.0.0.1:5500//index.html'; </script>"
    );
});

app.get("/allblog", async (req, res) => {
  const blog = await client
    .db("LinkedList")
    .collection("Sample data")
    .find()
    .toArray();
  res.status(200).send(blog);
});

app.get("/getSingleBlog/:id", async (req, res) => {
  const id = req.params.id;
  const singleBlog = await client
    .db("LinkedList")
    .collection("Sample data")
    .findOne({ Post_id: Number(id) });
  res.send(singleBlog);
});

app.delete("/deleteBlog/:id", async (req, res) => {
  const id = req.params.id;
  const allBlog = await client
    .db("LinkedList")
    .collection("Sample data")
    .find()
    .toArray();
  console.log(allBlog);
  const currentBlog = await client
    .db("LinkedList")
    .collection("Sample data")
    .findOne({ Post_id: Number(id) });
  console.log(currentBlog);

  if (currentBlog.prev === null) {
    allBlog.map((blog) => {
      if (blog.prev === currentBlog.Post_id) {
        const updatedBlog = {
          ...blog,
          prev: null,
        };

        client
          .db("LinkedList")
          .collection("Sample data")
          .findOneAndUpdate(
            { Post_id: blog.Post_id },
            { $set: updatedBlog },
            { ReturnDocument: "after" }
          );
      }
    });
  } else if (currentBlog.next === null) {
    allBlog.map((blog) => {
      if (blog.next === currentBlog.Post_id) {
        const updatedBlog = {
          ...blog,
          next: null,
        };
        client
          .db("LinkedList")
          .collection("Sample data")
          .findOneAndUpdate(
            { Post_id: blog.Post_id },
            { $set: updatedBlog },
            { ReturnDocument: "after" }
          );
      }
    });
  } else {
    allBlog.map((blog) => {
      if (blog.next === currentBlog.Post_id) {
        const updatedBlog = {
          ...blog,
          next: currentBlog.next,
        };
        client
          .db("LinkedList")
          .collection("Sample data")
          .findOneAndUpdate(
            { Post_id: blog.Post_id },
            { $set: updatedBlog },
            { ReturnDocument: "after" }
          );
      }

      if (blog.prev === currentBlog.Post_id) {
        const updatedBlog = {
          ...blog,
          prev: currentBlog.prev,
        };
        client
          .db("LinkedList")
          .collection("Sample data")
          .findOneAndUpdate(
            { Post_id: blog.Post_id },
            { $set: updatedBlog },
            { ReturnDocument: "after" }
          );
      }
    });
  }
  await client
    .db("LinkedList")
    .collection("Sample data")
    .deleteOne({ Post_id: currentBlog.Post_id });
  res.status(200).send("Successfully Deleted");
});

app.get("/insertblog", async (req, res) => {

  const date = Math.floor(new Date().getTime() / 1000.0);
  const Post_id = Math.floor(Math.random() * 10000);
  let BlogTitle = req.query.BlogTitle;
  let BlogContent = req.query.BlogContent;
  let myBlogData = { BlogTitle, BlogContent, date, Post_id }; 

  const allBlog = await client
    .db("LinkedList")
    .collection("Sample data")
    .find()
    .toArray();

    let previousBlog = allBlog[req.params.firstId - 1];
    let nextBlog = allBlog[req.params.secondId - 1];

    myBlogData = {...myBlogData, prev: previousBlog.Post_id, next: nextBlog.Post_id};
  
    await client
    .db("LinkedList")
    .collection("Sample data")
    .insertOne(myBlogData);

    let updatedBlog = {
      ...previousBlog,
      next: Post_id
    }

  await client
    .db("LinkedList")
    .collection("Sample data")
    .findOneAndUpdate(
      { Post_id: previousBlog.Post_id },
      { $set: updatedBlog },
      { ReturnDocument: "after" }
    );

    updatedBlog = {
      ...nextBlog,
      prev: Post_id
    }

  await client
    .db("LinkedList")
    .collection("Sample data")
    .findOneAndUpdate(
      { Post_id: nextBlog.Post_id },
      { $set: updatedBlog },
      { ReturnDocument: "after" }
    );

  res
    .status(200)
    .send(
      "<script>window.location.href = 'http://127.0.0.1:5500//index.html'; </script>"
    );
})

app.listen(PORT, () => {
  console.log("server started at http://localhost:8080/");
});
