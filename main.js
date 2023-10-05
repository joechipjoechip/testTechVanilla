import "./files/todolist/style/main.scss"

import { TaskConstructor } from "./files/todolist/js/taskConstructor.js"
import { SlotWrapperBuilder } from "./files/todolist/js/slotWrapperBuilder.js"

const app = document.getElementById("app")
const taskBuilder = new TaskConstructor()
const slotWrapper = new SlotWrapperBuilder()

app.appendChild(taskBuilder)
app.appendChild(slotWrapper)