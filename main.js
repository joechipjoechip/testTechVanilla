import "./files/style/main.scss"

import { TaskConstructor } from "./files/todolist/js/TaskConstructor.js"
import { TaskSearcher } from "./files/todolist/js/TaskSearcher.js"
import { TaskList } from "./files/todolist/js/TaskList.js"

const app = document.getElementById("app")

const taskBuilder = new TaskConstructor()
const taskSearcher = new TaskSearcher()
const slotWrapper = new TaskList()

app.appendChild(taskBuilder)
app.appendChild(taskSearcher)
app.appendChild(slotWrapper)