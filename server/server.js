import express from "express";
import bodyParser from "body-parser";

const app = express();
app.use(bodyParser.json());

const tasks = [
    {
        id: 0,
        title: "task 1",
        status: "done",
        description: "the first task"
    },
    {
        id: 1,
        title: "task 2",
        status: "done",
        description: "the second task"
    },
    {
        id: 2,
        title: "task 3",
        status: "doing",
        description: "the third task"
    }
]

app.use(express.static("../client/dist"))

app.get("/api/todos", (req, res) => {
    console.log("www");
    res.send(tasks);
});

app.post("/api/todos", (req, res) => {
    const {title} = req.body;
    const {description} = req.body;
    const newTask = {title, status: "todo", id: tasks.length, description: description};
    tasks.push(newTask);
    res.send();
});

app.put("/api/todos/:id", (req, res) => {
    const id = parseInt(req.params.id);
    tasks.find(t => t.id === id).status = req.body.status;
    res.send();
})

app.use(express.static("../client/dist"));
app.listen(process.env.PORT || 3000);