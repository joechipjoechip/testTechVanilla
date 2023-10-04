export class SlotWrapperBuilder {

    constructor(){
        this.element = null

        this.createWrapperElement()

        this.initEvents()
    }

    createWrapperElement(){
        this.element = document.createElement("div")
        this.element.classList.add("slots-wrapper")
    }

    initEvents(){
        this.element.addEventListener("click", event => this.handleClick(event))
    }

    handleClick(event){

        if( event.target.closest(".slot-container") ){
            // click on a slot

            const clickedSlotIndex = parseInt(event.target.closest(".slot-container").dataset.slotIndex)
            this.setSlotsStates(clickedSlotIndex)

            if( !event.target.classList.contains("slot-container") ){
                // click on an an input directly
                this.handleChildClick(event.target);
            }

        } else {
            // click outside a slot

            Array.from(this.element.children).forEach(child => {
                this.setInactiveElementAndChildren(child)
            })

        }
    }

    handleChildClick(child){

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

        Array.from(this.element.children).forEach(child => {

            if( parseInt(child.dataset.slotIndex) === clickedSlotIndex ){
                this.setActive(child)
            } else {
                this.setInactiveElementAndChildren(child)
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

    setInactiveElementAndChildren(element){
        // Set inactive element
        this.setInactive(element)
        // and its children
        Array.from(element.children).forEach(subChild => this.setInactive(subChild))
    }

}