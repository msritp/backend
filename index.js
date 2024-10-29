const express = require("express");
const connection = require("./db");
const app = express();
var cors = require('cors');
const port = 1000;


app.use(cors());
connection();


app.use(express.json());
app.use("/api/auth",require("./routes/auth"));
app.use("/api/Notes",require("./routes/Notes"));


app.listen(port, () => {
    console.log(`server running at http://localhost:${port}`);
});