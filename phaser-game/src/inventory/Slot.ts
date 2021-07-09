import Item from "./Item";

export default class Slot
{
    public index: number
    public item?: Item
    
    constructor(index: number)
    {
        this.index = index
    }

    
}