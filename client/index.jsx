import React from "react";
import React, {useEffect, useRef, useState} from "react";
import ReactDOM from "react-dom/client";

const root = ReactDOM.createRoot(document.getElementById("root"));

function AddTaskButton({reload}) {
    const dialogRef = useRef();
    const [taskTitle, setTaskTitle] = useState("");
    const [description, setDescription] = useState("");

    function handleClick() {
        dialogRef.current.showModal();
    }

    function handleCancel() {
        dialogRef.current.close();
    }

    async function handleSubmit() {
        await fetch("/api/todos", {
            method: "POST",
            body: JSON.stringify({title: taskTitle, description: description}),
            headers: {
                "content-type": "application/json"
            }
        })
        reload();
    }

    return <>
        <dialog ref={dialogRef}>
            <form method={"dialog"}>
                <h2>Add a new task</h2>
                <div>
                    Task title:<br />
                    <input
                        value={taskTitle}
                        onChange={e => setTaskTitle(e.target.value)}
                    />
                </div>
                <div>
                    Description:<br />
                    <textarea
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                    />
                </div>
                <div>
                    <button onClick={handleSubmit}>Submit</button>
                </div>
                <div>
                    <button onClick={handleCancel}>Cancel</button>
                </div>
            </form>
        </dialog>
        <button onClick={handleClick}>Add new task</button>
    </>;
}

function TaskListEntry({task, reload}) {
    const detialRef = useRef();
    const [description, setDescription] = useState("");

    function handleClose() {
        detialRef.current.close();
    }

    function handleShowDetail() {
        detialRef.current.showModal();
    }

    async function handleStartTask() {
        await fetch(`/api/todos/${task.id}`, {
            method: "PUT",
            body: JSON.stringify({status: "doing"}),
            headers: {
                "content-type": "application/json"
            }
        })
        reload();
    }

    async function handleFinishTask() {
        await fetch(`/api/todos/${task.id}`, {
            method: "PUT",
            body: JSON.stringify({status: "done"}),
            headers: {
                "content-type": "application/json"
            }
        })
        reload();
    }

    return <div>
        <h3>{task.title} ({task.status}): ID: {task.id}</h3><button onClick={handleShowDetail}>Description</button>
        {task.status === "todo" && <button onClick={handleStartTask}>Start task</button>}
        {task.status === "doing" && <button onClick={handleFinishTask}>Finish task</button>}
        <dialog ref={detialRef}>
            <form method={"dialog"}>
                <h2>Description: </h2>
                <text style={{border: "solid", borderColor: "lightgray"}}>{task.description}</text><br /><br />
                <button onClick={handleClose}>Close</button>
            </form>
        </dialog>
    </div>;
}

function App(){
    const [taskTitle, setTaskTitle] = useState();
    useEffect(() => {
        loadTasks();
    },[]);

    async function loadTasks(){
        const res = await fetch("http://localhost:3000/api/todos");
        setTaskTitle(await res.json());
    }

    return <>
        <h2>Tasks</h2>
        <AddTaskButton reload={loadTasks}/>
        {taskTitle && taskTitle.map(t => <TaskListEntry task={t} reload={loadTasks} />)}
        {!taskTitle && <div>loading...</div>}
    </>;
}

root.render(<App />);
