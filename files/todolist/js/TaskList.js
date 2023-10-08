import { SlotBuilder } from "./SlotBuilder.js"
import { helpersDate } from "../../helpers/date.js"

export class TaskList {

    constructor(){
        this.wrapperElement = null

        this.currentDate = helpersDate.currentDate
        this.arbitraryDateSuffix = helpersDate.arbitraryDateSuffix

        this.freshList = []
        this.filteredList = []
        this.filterIsActive = false

        this.CHILD_CLASS = "slot-container"

        this.init()

        return this.wrapperElement
    }

    // Basics
    init(){
        this.createWrapperElement()
        this.createTitle()
        this.appendTitle()
        this.initEvents()
        this.requestFreshList()
    }

    createWrapperElement(){
        this.wrapperElement = document.createElement("div")
        this.wrapperElement.classList.add("slots-wrapper")
    }

    createTitle(){
        this.title = document.createElement("h3")
        Object.assign(this.title, {
            innerText: "Tasks list",
            className: "slots-wrapper-title"
        })
    }

    appendTitle(){
        this.wrapperElement.appendChild(this.title)
    }

    initEvents(){
        this.wrapperElement.addEventListener("click", event => this.handleClick(event))
        this.wrapperElement.addEventListener("change", event => this.handleChange(event))

        this.wrapperElement.addEventListener("from-slot-to-list--focus-specific-slot", event => this.handleFocusSpecificSlot(event))

        this.wrapperElement.addEventListener("from-task-constructor-to-slots-wrapper--refresh-slots", event => this.handleRefreshSlots(event))

        this.wrapperElement.addEventListener("from-task-searcher-to-slots-wrapper--filter", event => this.handleSearchFilter(event))
        this.wrapperElement.addEventListener("from-task-searcher-to-slots-wrapper--filter-reset", event => this.handleSearchFilterReset(event))
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
        .then(() => {
            updatedInputEndDate.classList.add("fullfilled") 
            this.checkTasksValidity()
        })
        .catch(error => console.log("something went wrong : error : ", error))
    }

    handleRefreshSlots(event){
        console.log("slots wrapper: handleRefresh : ", event)

        this.requestFreshList()
    }

    // Methods
    setActive(slot){
        if( !slot.classList.contains(this.CHILD_CLASS) ){return}
        
        slot.classList.contains("inactive") && slot.classList.remove("inactive")
        !slot.classList.contains("active") && slot.classList.add("active")
    }

    setInactive(slot){
        if( !slot.classList.contains(this.CHILD_CLASS) ){return}
        
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
        fetch("http://localhost:9000/v1/tasks", {
            method: "GET",
            mode: "cors"
        })
        .then(response => response.json())
        .then(response => {
            this.freshList = response
            this.refreshList()
            this.checkTasksValidity()
        })
    }

    emptyWrapper(){
        this.wrapperElement.children.length && Array.from(this.wrapperElement.children).forEach(child => {
            if( !child.classList.contains("slots-wrapper-title") ){
                child.parentNode.removeChild(child)
            }
        })
    }

    appendList(){
        if( this.filterIsActive ){
            this.filteredList.forEach((infos, slotIndex) => this.wrapperElement.appendChild(new SlotBuilder({ infos, slotIndex })))
        } else {
            this.freshList.forEach((infos, slotIndex) => this.wrapperElement.appendChild(new SlotBuilder({ infos, slotIndex })))
        }
    }

    refreshList(){
        this.emptyWrapper()
        this.appendList()
    }

    checkTasksValidity(){
        const tasks = Array.from(this.wrapperElement.querySelectorAll(".slot-container"))
        const currentDateTimestamp = new Date(this.currentDate).getTime()

        tasks.forEach(task => {
            const taskEndDate = task.querySelector(".slot-end-date").value
            const taskEndDateTimestamp = new Date(taskEndDate).getTime()

            if( taskEndDateTimestamp < currentDateTimestamp ){
                // task is validated
                this.setTaskValidity(task, true)
            } else {
                // task is not validated
                this.setTaskValidity(task, false)
            }
        })
    }

    setTaskValidity(task, validity){
        if( validity ){
            !task.classList.contains("is-validated") && task.classList.add("is-validated")
        } else {
            task.classList.contains("is-validated") && task.classList.remove("is-validated")
        }
    }

    handleSearchFilter(event){
        const { searchText, searchDate, filtersToApply } = event.detail
        
        console.log("filters to apply : ", filtersToApply)

        if( !filtersToApply.date && !filtersToApply.text ){
            this.filterIsActive = false
        } else {

            this.filterIsActive = true
    
            this.filteredList = this.freshList.filter(slot => {
    
                if( filtersToApply.date ){
    
                    if( this.filterDateChecker(searchDate, slot) ) {
    
                        if( filtersToApply.text) {
                            if( this.filterTextChecker(searchText, slot) ){
                                return slot
                            }
                        } else {
                            return slot
                        }
    
                    }
    
    
                } else if( filtersToApply.text && this.filterTextChecker(searchText, slot) ){
                    return slot
                }
                
            })

        }

        this.refreshList()
    }

    handleSearchFilterReset(){
        this.filterIsActive = false
        this.requestFreshList()
    }

    filterDateChecker(searchDate, slot){
        // @TODO -> ask about ambigious : filter by start_date or end_date ? exact values or >= / <= ?
        const formatedSearchDate = searchDate + this.arbitraryDateSuffix
        return (slot.start_date === formatedSearchDate || slot.end_date === formatedSearchDate)
    }

    filterTextChecker(searchText, slot){
        return (slot.label.trim().includes(searchText) || slot.description.trim().includes(searchText))
    }



}