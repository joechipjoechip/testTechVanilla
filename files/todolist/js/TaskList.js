import { SlotBuilder } from "./SlotBuilder.js"

export class TaskList {

    constructor(){
        this.wrapperElement = null

        this.CHILD_CLASS = "slot-container"
        this.arbitraryDateSuffix = "T15:00:00Z"

        this.dev = true

        this.init()

        return this.wrapperElement
    }

    // Basics
    init(){
        this.createWrapperElement()
        this.initEvents()
        this.requestFreshList()
    }

    createWrapperElement(){
        this.wrapperElement = document.createElement("div")
        this.wrapperElement.classList.add("slots-wrapper")
    }

    initEvents(){
        this.wrapperElement.addEventListener("click", event => this.handleClick(event))
        this.wrapperElement.addEventListener("change", event => this.handleChange(event))
        this.wrapperElement.addEventListener("from-slot-to-list--focus-specific-slot", event => this.handleFocusSpecificSlot(event))
        this.wrapperElement.addEventListener("from-task-constructor-to-slots-wrapper--refresh-slots", event => this.handleRefreshSlots(event))
    }

    // Events handlers
    handleClick(event){

        const clickedElement = event.target
        const slotContainer = clickedElement.closest(`.${this.CHILD_CLASS}`)

        if( slotContainer ){
            // click on a slot

            const clickedSlotIndex = parseInt(slotContainer.dataset.slotIndex)
            this.setSlotsStates(clickedSlotIndex)
            this.handleSpecificActions(clickedElement)

        } else {
            // click outside a slot

            Array.from(this.wrapperElement.children).forEach(slot => {
                this.setInactive(slot)
            })

        }
    }

    handleFocusSpecificSlot(event){
        this.setSlotsStates(event.detail)
    }

    handleChange(event){
        const updatedSlotContainer = event.target.closest(`.${this.CHILD_CLASS}`)
        const labelToTarget = updatedSlotContainer.querySelector(".slot-label").dataset.labelVanilla
        const updatedInputEndDate = updatedSlotContainer.querySelector(".slot-end-date")

        const updatedValues = {
            end_date: `${updatedInputEndDate.value}${this.arbitraryDateSuffix}`
            // @ask -> why not all the rest (except label) ?
        }

        fetch(`http://localhost:9000/v1/tasks/${encodeURI(labelToTarget)}`, {
            method: "PUT",
            mode: "cors",
            body: JSON.stringify(updatedValues)
        })
        .then(() => updatedInputEndDate.classList.add("fullfilled") )
        .catch(error => console.log("something went wrong : error : ", error))
    }

    handleRefreshSlots(event){
        console.log("slots wrapper: handleRefresh : ", event)

        this.requestFreshList()
    }

    // Methods
    setActive(slot){
        slot.classList.contains("inactive") && slot.classList.remove("inactive")
        !slot.classList.contains("active") && slot.classList.add("active")
    }

    setInactive(slot){
        !slot.classList.contains("inactive") && slot.classList.add("inactive")
        slot.classList.contains("active") && slot.classList.remove("active")
    }

    setSlotsStates( clickedSlotIndex ){
        Array.from(this.wrapperElement.children).forEach(child => {
            if( parseInt(child.dataset.slotIndex) === clickedSlotIndex ){
                this.setActive(child)
            } else {
                this.setInactive(child)
            }
        })
    }

    handleSpecificActions(clickedElement){
        if( clickedElement.classList.contains("slot-button-delete") ){
            this.deleteTask(clickedElement)
        }
    }

    deleteTask(taskToDelete){
        const slotContainer = taskToDelete.closest(`.${this.CHILD_CLASS}`)
        const labelToTarget = slotContainer.querySelector(".slot-label").dataset.labelVanilla

        fetch(`http://localhost:9000/v1/tasks/${encodeURI(labelToTarget)}`, {
            method: "DELETE",
            mode: "cors"
        })
        .then(() =>{
            slotContainer.parentNode.removeChild(slotContainer)
            console.log("well deleted")
        })
        .catch(error => console.log("something went wrong : error : ", error))
    }

    requestFreshList( event ){

        if( this.dev ){

            console.log("dev = true")

            this.freshList = [
                {
                    "label": "cin%C3%A9ma",
                    "description": "demander les horaires à Marc",
                    "start_date": "2023-10-06T15:00:00Z",
                    "end_date": ""
                },
                {
                    "label": "courses",
                    "description": "pain\nlait\noeufs",
                    "start_date": "2023-10-06T15:00:00Z",
                    "end_date": "2023-10-08T15:00:00Z"
                },
                {
                    "label": "cadeaux%20noel",
                    "description": "timoté : tricycle\nmarie : gants MMA",
                    "start_date": "2023-10-06T15:00:00Z",
                    "end_date": "2023-12-14T15:00:00Z"
                },
                {
                    "label": "bouquins",
                    "description": "dora l'exploratrice\n1984",
                    "start_date": "2023-10-06T15:00:00Z",
                    "end_date": "2023-11-11T15:00:00Z"
                }
            ]

            this.emptyWrapper()
            this.appendFreshList()

        } else {

            fetch("http://localhost:9000/v1/tasks", {
                method: "GET",
                mode: "cors"
            })
            .then(response => response.json())
            .then(response => {
                this.freshList = response
    
                console.log("working data : ", response)
    
                this.emptyWrapper()
                this.appendFreshList()
    
            })

        }
    }

    emptyWrapper(){
        this.wrapperElement.children.length && Array.from(this.wrapperElement.children).forEach(child => child.parentNode.removeChild(child))
    }

    appendFreshList(){
        this.freshList.length && this.freshList.forEach((infos, slotIndex) => this.wrapperElement.appendChild(new SlotBuilder({ infos, slotIndex })))
    }

}