export class SlotWrapperBuilder {

    constructor(){
        this.wrapperElement = null

        this.createWrapperElement()

        this.initEvents()

        return this.wrapperElement
    }

    // Basics
    createWrapperElement(){
        this.wrapperElement = document.createElement("div")
        this.wrapperElement.classList.add("slots-wrapper")
    }

    initEvents(){
        this.wrapperElement.addEventListener("click", event => this.handleClick(event))
    }

    // Events handlers
    handleClick(event){

        const slotContainer = event.target.closest(".slot-container")

        if( slotContainer ){
            // click on a slot

            const clickedSlotIndex = parseInt(slotContainer.dataset.slotIndex)
            this.setSlotsStates(clickedSlotIndex)

            if( event.target.classList.contains("slot-child") ){
                this.manageChildClick(event.target);
            }

        } else {
            // click outside a slot

            Array.from(this.wrapperElement.children).forEach(child => {
                this.setInactiveSlotAndChildren(child)
            })

        }
    }

    // Methods
    manageChildClick(child){

        Array.from(child.closest(".slot-container").children).forEach(brother => {
            if( brother === child ){
                this.setActive(brother)
            } else {
                this.setInactive(brother)
            }
        })

        !child.classList.contains("active") && child.classList.add("active")
    }

    setSlotsStates( clickedSlotIndex ){

        Array.from(this.wrapperElement.children).forEach(child => {

            if( parseInt(child.dataset.slotIndex) === clickedSlotIndex ){
                this.setActive(child)
            } else {
                this.setInactiveSlotAndChildren(child)
            }

        })

    }

    setActive(slot){
        slot.classList.contains("inactive") && slot.classList.remove("inactive")
        !slot.classList.contains("active") && slot.classList.add("active")
    }

    setInactive(slot){
        !slot.classList.contains("inactive") && slot.classList.add("inactive")
        slot.classList.contains("active") && slot.classList.remove("active")
    }

    setInactiveSlotAndChildren(element){
        // Set inactive element
        this.setInactive(element)
        // and its children
        Array.from(element.children).forEach(subChild => this.setInactive(subChild))
    }

}