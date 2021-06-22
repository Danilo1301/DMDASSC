export class Item
{
    public Id: string = ""
    public BaseId: string = ""
    public Name: string = ""
    public Amount: number = 0
    public Texture: string = ""
}

export class ItemManager
{
    private static _baseItems = new Phaser.Structs.Map<string, Item>([])
    private static _items = new Phaser.Structs.Map<string, Item>([])

    public static Setup()
    {
        this.CreateBaseItem("weapon_pistol")

        var item = this.AddItem("weapon_pistol")

        console.log(item)
    }

    public static CreateBaseItem(baseId: string): Item
    {
        var item = new Item()
        item.Id = ""
        item.BaseId = baseId
        item.Name = "Pistol"
        item.Texture = "items/pistol"

        this._baseItems.set(item.BaseId, item)

        return item
    }

    public static AddItem(baseId: string): Item
    {
        var item = new Item()
        var baseItem = this._baseItems.get(baseId)

        Object.assign(item, baseItem)

        item.Id = "TEST_ITEM_ID"
        item.Amount = 1

        this._items.set(item.Id, item)

        return item
    }

    public static GetItem(id: string): Item
    {
        return this._items.get(id)
    }
}