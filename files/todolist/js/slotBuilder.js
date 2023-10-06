export class SlotBuilder {

    constructor(params){
        Object.assign(this, { ...params })

        this.slotElement = null
        this.children = {}

        this.PARENT_CLASS = "slots-wrapper"
        this.CHILD_CONTAINER_CLASS = "slot-container"

        this.init()

        return this.slotElement
    }

    // Basics
    init(){
        this.createSlotElement()
        this.createChildren()
        this.initEvents()
        this.appendChildren()
    }

    createSlotElement(){
        // this.slotElement = document.createElement("form");
        this.slotElement = document.createElement("div");

        this.slotElement.classList.add(this.CHILD_CONTAINER_CLASS, "inactive")
        this.slotElement.dataset.slotIndex = this.slotIndex
        this.slotElement.dataset.order = this.slotIndex
    }

    createChildren(){

        // Label
        this.children.label = document.createElement("p")
        Object.assign(this.children.label, {
            className: "slot-label",
            innerText: decodeURI(this.infos.label),
        })
        this.children.label.dataset.labelVanilla = this.infos.label
        
        // Description
        this.children.description = document.createElement("p")
        Object.assign(this.children.description, {
            className: "slot-description",
            innerText:  this.infos.description
        })

        // Start date
        this.children.startDate = document.createElement("p")
        Object.assign(this.children.startDate, {
            className: "slot-start-date",
            innerText: this.infos.start_date.split("T")[0]
            // .split() because we have "2022-06-01T15:00:00Z" and the html standard is "2018-07-22"
        })

        // End date
        this.children.endDate = document.createElement("input")
        Object.assign(this.children.endDate, {
            className: "slot-end-date updatable",
            type:  "date"
        })
        
        if( this.infos.end_date ){
            this.children.endDate.value = this.infos.end_date.split("T")[0]
            this.children.endDate.classList.add("fullfilled")
        } else {
            this.children.endDate.value = this.infos.start_date.split("T")[0]
        }

        // Delete button
        this.children.buttonDelete = document.createElement("button")
        Object.assign(this.children.buttonDelete, {
            className: "slot-button-delete",
            innerText: "Delete"
        })

        // Add .slot-child class to every children
        Object.keys(this.children).forEach(childKey => this.children[childKey].classList.add("slot-child"))

    }

    appendChildren(){
        Object.keys(this.children).forEach(childKey => this.slotElement.appendChild(this.children[childKey]))
    }

    // Events
    initEvents(){
        // this.children.endDate.addEventListener("change", event => this.handleChange(event))
        this.children.endDate.addEventListener("focus", event => this.handleFocus(event))

        // this.children.buttonDelete.addEventListener("click", event => this.handleDelete(event))
    }

    // Handlers
    handleFocus(event){
        const wrapper = event.target.closest(`.${this.PARENT_CLASS}`)
        const currentFocusedSlotIndex = parseInt(event.target.closest(`.${this.CHILD_CONTAINER_CLASS}`).dataset.slotIndex)

        const customFocusEvent = new CustomEvent("from-slot-to-list--focus-specific-slot", { detail: currentFocusedSlotIndex})
        
        wrapper.dispatchEvent(customFocusEvent)
    }

}