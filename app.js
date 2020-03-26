//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

mongoose.connect("mongodb://localhost:27017/todolistDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const itemsSchema = {
  name: String
};

const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
  name: "Welcome to your todolist!"
});

const item2 = new Item({
  name: "Tap + button to add a new todo."
});

const item3 = new Item({
  name: "<-- Hit here to mark as done the task."
});

const defaultItems = [item1, item2, item3];

app.get("/", function(req, res) {
  Item.find((err, items) => {
    if (items.length == 0) {
      Item.insertMany(defaultItems, err => {
        if (!err) {
          console.log("Successfully added default items.");
        }
      });
      res.redirect("/");
    } else {
      res.render("list", { listTitle: "Today", newListItems: items });
    }
  });
});

app.post("/", function(req, res) {
  const itemName = req.body.newItem;
  const item = new Item({
    name: itemName
  });
  item.save();
  res.redirect("/");
});

app.post("/delete", (req, res) => {
  const itemId = req.body.checkbox;
  Item.findByIdAndDelete(itemId, err => {
    if (err) {
      console.log(err);
    }
  });
  res.redirect("/");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
