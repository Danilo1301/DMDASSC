export enum Direction
{
    North,
    South,
    East,
    West,
    NorthWest,
    NorthEast,
    SouthWest,
    SouthEast
}

export class Directions
{
    public static getNameOfDirection(direction: Direction)
    {
        const names = [
            "North",
            "South", 
            "East",
            "West",
            "NorthWest",
            "NorthEast",
            "SouthWest",
            "SouthEast"
        ]

        return names[direction]
    }
}