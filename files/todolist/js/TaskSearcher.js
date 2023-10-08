import { helpersDate } from "../../helpers/date"

export class TaskSearcher{

    constructor(){
        this.element = null

        this.inputs = {}

        this.currentDate = helpersDate.currentDate

        this.filtersToApply = {
            date: false,
            text: false
        }

        this.baseText = ""
        this.baseDate = this.currentDate

        this.createElement()
        this.createChildren()
        this.initEvents()
        this.appendChildrenToParent()

        return this.element
    }

    createElement(){
        this.element = document.createElement("div")
        this.element.classList.add("task-searcher-container")

    }

    createChildren(){
        this.title = document.createElement("h5")
        Object.assign(this.title, {
            innerText: "Search a task",
            className: "task-searcher-title"
        })

        this.inputs.text = document.createElement("input")
        Object.assign(this.inputs.text, {
            type: "text",
            placeholder: "Search a task by text",
            className: "task-searcher-text",
            value: ""
        })

        this.inputs.date = document.createElement("input")
        Object.assign(this.inputs.date, {
            type: "date",
            value: this.currentDate,
            className: "task-searcher-date"
        })

        this.resetButton = document.createElement("button")
        Object.assign(this.resetButton, {
            innerText: "Reset search",
            className: "task-searcher-button-reset task-searcher-child"
        })

        Object.keys(this.inputs).forEach(inputKey => this.inputs[inputKey].classList.add("task-searcher-child"))

    }

    appendChildrenToParent(){
        this.element.appendChild(this.title)
        Object.keys(this.inputs).forEach(inputKey => this.element.appendChild(this.inputs[inputKey]))
        this.element.appendChild(this.resetButton)
    }

    initEvents(){
        this.resetButton.addEventListener("click", () => this.handleResetButtonClick())
        Object.keys(this.inputs).forEach(inputKey => this.inputs[inputKey].addEventListener("change", (event) => this.handleInputChange(event)))
        this.inputs.text.addEventListener("keyup", (event) => this.handleInputChange(event))
    }

    handleResetButtonClick(){
        Object.keys(this.inputs).forEach(inputKey => {
            this.inputs[inputKey].value = this.inputs[inputKey].type === "text" ? "" : this.currentDate
        })

        Object.keys(this.filtersToApply).forEach(filterToApplyKey => this.setFiltersToApply(filterToApplyKey, false))

        const resetRequestEvent = new CustomEvent("from-task-searcher-to-slots-wrapper--filter-reset")
        this.dispatchFilter(resetRequestEvent)
    }

    handleInputChange( event ){
        
        const searchText = this.inputs.text.value
        const searchDate = this.inputs.date.value
        
        !this.filtersToApply.date && this.setFiltersToApply("date", event.target.type === "date")
        this.setFiltersToApply("text", searchText !== this.baseText)
        
        const filterRequestEvent = new CustomEvent("from-task-searcher-to-slots-wrapper--filter", {
            detail: { searchText, searchDate, filtersToApply: this.filtersToApply }
        })

        this.dispatchFilter(filterRequestEvent)
    }
    
    dispatchFilter(filterEvent){
        const slotsWrapper = this.element.parentNode.querySelector(".slots-wrapper")
        slotsWrapper.dispatchEvent(filterEvent)
    }

    setFiltersToApply(which, isApply){
        this.filtersToApply[which] = isApply
        this.setElementState(this.inputs[which], isApply)
    }

    setElementState(element, isactive){
        if( isactive ){
            !element.classList.contains("active") && element.classList.add("active")
        } else {
            element.classList.contains("active") && element.classList.remove("active")
        }
    }
    

}