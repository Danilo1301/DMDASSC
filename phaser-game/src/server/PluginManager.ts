export default class PluginManager {
    public static _classes: {[key: string]: string[]} = {}

    public static initializate()
    {
        PluginManager.addClass('Server', ['id', 'getWorlds'])
        PluginManager.addClass('World', ['id', 'createEntity', 'createControllablePlayer'])
    }

    public static addClass(name: string, values: string[])
    {
        this._classes[name] = values
    }

    public static objectfyClass(c: any)
    {
        if(c === undefined) return null

        var obj = {}

        var keys = PluginManager._classes[c.constructor.name]
        
        if(!keys) return null

        for (const key of keys) {
            Object.defineProperty(obj, key, {
                get : function () {
                    //console.log(key, c, c[key])

                    var value = c[key]

                    if(typeof value == 'function')
                    {
                        return function()
                        {
                            var result = c[key].bind(c).apply(null, arguments)

                            if(typeof result == 'object')
                            {
                                if(result.length != undefined)
                                {
                                    var arr: any = []

                                    for (const v of result) {
                                        arr.push(PluginManager.objectfyClass(v))
                                    }

                                    return arr
                                }
                            }

                            //console.log(result)

                            return PluginManager.objectfyClass(result)

                            console.log(result)

                            //return c[key]
                        }
                    }

                    return c[key]

                    
                }
            });
        }

        return obj
    }
}