export class Logger
{
    public static print(...args: any): void
    {
        console.log.apply(null, args)
    }
}