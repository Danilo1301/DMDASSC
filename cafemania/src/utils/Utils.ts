export default class Utils
{
    public static getRandomItemInArray<T>(arr: T[]): T
    {
        return arr[Math.round(Math.random() * (arr.length-1))]
    }
}