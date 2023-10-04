export class SlotBuilder {

    constructor(params){
        Object.assign(this, { ...params })

        this.slotElement = null
        this.children = {}

        this.createSlotElement()
        this.createChildren()
        this.appendChildren()

        return this.slotElement
    }

    // Basics
    createSlotElement(){
        this.slotElement = document.createElement("div");

        this.slotElement.classList.add("slot-container")
        this.slotElement.classList.add("inactive")
        this.slotElement.dataset.slotIndex = this.slotIndex
        this.slotElement.dataset.order = this.slotIndex
    }

    createChildren(){

        // Label
        this.children.inputLabel = document.createElement("input")
        this.children.inputLabel.classList.add("slot-label")
        this.children.inputLabel.setAttribute("type", "text")
        this.children.inputLabel.setAttribute("value", this.infos.label)
        
        // Description
        this.children.inputDescription = document.createElement("input")
        this.children.inputDescription.classList.add("slot-description")
        this.children.inputDescription.setAttribute("type", "text")
        this.children.inputDescription.setAttribute("value", this.infos.description) 

        // Start date
        this.children.inputStartDate = document.createElement("input")
        this.children.inputStartDate.classList.add("slot-start-date")
        this.children.inputStartDate.setAttribute("type", "text")
        this.children.inputStartDate.setAttribute("value", this.infos.start_date)

        // Add .slot-child class to every children
        Object.keys(this.children).forEach(childKey => this.children[childKey].classList.add("slot-child"))

    }

    appendChildren(){
        Object.keys(this.children).forEach(childKey => this.slotElement.appendChild(this.children[childKey]))
    }

}