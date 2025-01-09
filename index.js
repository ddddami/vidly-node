const express = require("express");
const genres = require("./routes/genres");

const app = express();

app.use(express.json());
app.use("/api/genres", genres);

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(3000, () => {
  console.log("Listening on port 3000");
});
