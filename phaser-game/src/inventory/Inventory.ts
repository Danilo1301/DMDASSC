import Item from "./Item";
import Slot from "./Slot";

export default class Inventory
{
    private _slots: Slot[] = []

    public createSlot()
    {
        var slot = new Slot(this._slots.length)

        this._slots.push(slot)

        return slot
    }

    public getSlots()
    {
        return this._slots
    }
}