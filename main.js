import "./files/todolist/style/main.scss"

import { TaskConstructor } from "./files/todolist/js/TaskConstructor.js"
import { TaskList } from "./files/todolist/js/TaskList.js"

const app = document.getElementById("app")
const taskBuilder = new TaskConstructor()
const slotWrapper = new TaskList()

app.appendChild(taskBuilder)
app.appendChild(slotWrapper)