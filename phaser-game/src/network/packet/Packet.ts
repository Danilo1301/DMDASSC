export default class Packet
{
    key: string
    data: any

    constructor(key, data)
    {
        this.key = key
        this.data = data
    }
}