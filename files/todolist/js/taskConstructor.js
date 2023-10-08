import { helpersDate } from "../../helpers/date"

export class TaskConstructor{
    
    constructor(element){
        this.element = null
        this.inputs = {}

        this.currentDate = helpersDate.currentDate
        this.arbitraryDateSuffix = helpersDate.arbitraryDateSuffix

        this.init()

        return this.element
    }

    init(){
        this.createWrapperElement()
        this.createInputsElements()
        this.appendChildrenToParent()
        this.initEvents()
    }

    createWrapperElement(){
        this.element = document.createElement("form")
        Object.assign(this.element, {
            classList: "task-builder-container",
            id: "task-builder",
            name: "task-builder"
        })
    }

    createInputsElements(){
        this.title = document.createElement("h4")
        Object.assign(this.title, {
            innerText: "Create a task",
            className: "task-builder-title"
        })


        this.inputs.label = document.createElement("input")
        Object.assign(this.inputs.label, {
            type: "text",
            placeholder: "label",
            className: "task-builder-label",
            name: "label",
        })


        this.inputs.description = document.createElement("textarea")
        Object.assign(this.inputs.description, {
            className: "task-builder-description",
            name: "description",
            placeholder: "description"
        })

        // this.inputs.start_date = document.createElement("input")
        // Object.assign(this.inputs.start_date, {
        //     type: "date",
        //     placeholder: "date",
        //     className: "task-builder-start-date",
        //     name: "start_date",
        //     value: this.currentDate,
        // })

        this.inputs.confirmButton = document.createElement("button")
        Object.assign(this.inputs.confirmButton, {
            className: "task-builder-button-confirm",
            innerText: "Create this task"
        })

        // and for all inputs :
        Object.keys(this.inputs).forEach(inputKey => this.inputs[inputKey].classList.add("task-builder-child"))
    }

    appendChildrenToParent(){
        this.element.appendChild(this.title)
        Object.keys(this.inputs).forEach(inputKey => this.element.appendChild(this.inputs[inputKey]))
    }

    initEvents(){
        this.inputs.label.addEventListener("keypress", event => this.handleLabelKeypress(event))
        this.inputs.confirmButton.addEventListener("click", event => this.handleConfirmation(event))
        this.element.addEventListener("submit", event => event.preventDefault())
        this.element.addEventListener("keypress", event => this.handleKeypress(event))
    }

    handleKeypress(event){

        if( event.key.toLowerCase() === "enter" && !event.shiftKey ){
            event.preventDefault()

            this.handleConfirmation(event)
            
        }
    }

    handleLabelKeypress(event){
        if( event.target.value.trim() === "" ){
            if( this.inputs.label.classList.contains("invalid") ){
                this.inputs.label.classList.remove("invalid")
            } else {
                this.inputs.label.classList.add("invalid")
            }
        }
    }

    handleConfirmation(event){
        const form = event.target.closest("form")
        const labelElement = form.querySelector(".task-builder-label")
        const formData = new FormData(form)
        const taskData = {}

        if( labelElement.value.trim() === "" ){
            console.log("label manquant")
            labelElement.classList.add("invalid")
            return
        }

        for(const [key, value] of formData.entries()) { 
            taskData[key] = value
        }

        // exception for label which is an identifier (by the way : wtf !?) @ASK -> why "label" instead of "id" ?
        taskData.label = encodeURI(taskData.label)

        // exception for date format messin' between html format and api format @TODO -> harmonize
        taskData.start_date = this.currentDate + this.arbitraryDateSuffix

        this.actCreateTask(taskData)
    }

    actCreateTask(taskData){
        fetch("http://localhost:9000/v1/tasks", {
            method: "POST",
            mode: "cors",
            body: JSON.stringify({...taskData})
        })
        .then(data => {
            this.emptyInputs()
            this.askTasksListRefresh()
        })
        .catch(error => console.log("something went wrong : error : ", error))
    }

    emptyInputs(){
        Object.keys(this.inputs).forEach(inputKey => {
            this.inputs[inputKey].value = inputKey === "start_date" ? this.currentDate : ""
        })
    }

    askTasksListRefresh(){
        const slotsWrapper = this.element.parentNode.querySelector(".slots-wrapper")
        const askRefreshEvent = new CustomEvent("from-task-constructor-to-slots-wrapper--refresh-slots")

        slotsWrapper.dispatchEvent(askRefreshEvent)
    }

}