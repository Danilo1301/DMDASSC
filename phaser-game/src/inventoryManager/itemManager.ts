import { Item } from "./item"

export class ItemManager
{
    private static _baseItems = new Phaser.Structs.Map<string, Item>([])
    private static _items = new Phaser.Structs.Map<string, Item>([])

    public static Setup()
    {
        this.CreateBaseItem("weapon_pistol", "Pistol", "pistol")
        this.CreateBaseItem("medkit", "Medkit", "medkit")

        var item = this.AddItem("weapon_pistol")

        console.log(item)
    }

    public static CreateBaseItem(baseId: string, name: string, texture: string): Item
    {
        var item = new Item()
        item.Id = ""
        item.BaseId = baseId
        item.Name = name
        item.Texture = "items/" + texture

        this._baseItems.set(item.BaseId, item)

        return item
    }

    public static AddItem(baseId: string): Item
    {
        if(!this._baseItems.has(baseId)) throw new Error("Item BaseId not found");
        

        var item = new Item()
        var baseItem = this._baseItems.get(baseId)

        Object.assign(item, baseItem)

        item.Id = "TEST_ITEM_ID_" + Math.random()
        item.Amount = 1

        this._items.set(item.Id, item)

        return item
    }

    public static GetItem(id: string): Item
    {
        return this._items.get(id)
    }
}