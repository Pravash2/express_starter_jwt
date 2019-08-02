const express = require("express");
const mongoose = require("mongoose");
const app = express();

//routers
const users = require("./routes/api/users");
const profile = require("./routes/api/profile");
const posts = require("./routes/api/posts");

//DB congig
const db = require("./config/keys").mongoURI;

//connect the mongo
mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => console.log("mongodb Connected"))
  .catch(err => console.log(err));

app.get("/", (req, res) => res.send("Hello Pravash"));
app.use("/api/users", users);
app.use("/api/profile", profile);
app.use("/api/posts", posts);

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`server is running on port ${port}`));
