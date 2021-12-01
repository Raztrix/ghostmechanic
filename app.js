const express = require("express");
const path = require("path");
const https = require("https");
const mongoose = require("mongoose");

mongoose.connect(
  "mongodb+srv://admin-Raz:Test123@cluster0.fqu8i.mongodb.net/Subscribers?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
  }
);

const db = mongoose.connection;
db.on("error", console.log.bind(console, "connection error"));
db.once("open", function (callback) {
  console.log("connection succeeded");
});
// instead of body-parser it's directly inside express now
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Subscribers Schema mongoose
const { Schema } = mongoose;

const SubscribersSchema = new Schema({
  name: String,
  email: String,
  // the phones in Israel starts with 0 and there is no number that starts with 0.
  phone: String,
  checkbox: Boolean,
});

// Model defining mongoose
const Detail = mongoose.model("Detail", SubscribersSchema);

// Creating instance via model
// const person1 = new Detail({
//   name: "Rami",
//   email: "test@test.com",
//   phone: "0525563334",
//   checkbox: true,
// });
// // person1.save(function (err, result) {
// //   if (err) {
// //     console.log(err);
// //   } else {
// //     console.log(result);
// //   }
// //   // saved!
// //});

// this is making images available online via my internal host localhost.
const dir = path.join(__dirname, "public");
app.use(express.static(dir));

// communications

// get into home directly
app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "./public", "index.html"));
});
// get to contact directly or via home
app.get("/addsubscribe.html", function (req, res) {
  res.sendFile(path.join(__dirname, "./public", "addsubscribe.html"));
});
// get from contact to home.
app.get("/index.html", function (req, res) {
  res.sendFile(path.join(__dirname, "./public", "index.html"));
});
// get to success page
app.get("/signup_success.html", function (req, res) {
  res.sendFile(path.join(__dirname, "./public", "signup_success.html"));
});
// post request inserting data into database
app.post("/post-details", (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const phone = req.body.phone;
  const checkbox = req.body.newsletter;

  const data = new Detail({
    name: name,
    email: email,
    phone: phone,
    checkbox: checkbox,
  });
  db.collection("details").insertOne(data, function (err, collection) {
    if (err) throw err;
    console.log("Record inserted Successfully");
  });

  return res.redirect("signup_success.html");
});
// if the heroku didnt set thier own port let the port be 8000
let port = process.env.PORT;
if (port == null || port == "") {
  port = 8000;
}

app.listen(port, function () {
  console.log("server is up and runing via Heroku");
});
