const express = require("express");
const app = express();
const port = 5000;

app.use("/css", express.static("css"));
app.use("/js", express.static("js"));

app.set("views", "html");

app.engine("html", require("ejs").renderFile);

// Serve the "main.html" when the root or "/main" is accessed
app.get(["/", "/main"], (req, res) => {
    res.render("main.html");
});

app.get("/tracker", (req, res) => {
    res.render("fitness_tracker.html");
});

app.listen(port, () => {
    console.log(`App listening on http://localhost:${port}`);
});
