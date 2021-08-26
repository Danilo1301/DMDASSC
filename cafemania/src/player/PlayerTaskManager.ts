export abstract class Task
{
    public events = new Phaser.Events.EventEmitter()

    public start()
    {
        this.events.emit('start')
    }

    protected completeTask()
    {
        this.events.emit('complete', true)
    }

    public cancel()
    {
        this.events.emit('complete', false)
    }
}

export class TaskExecuteAction extends Task
{
    private action: () => void

    constructor(action: () => void)
    {
        super()

        this.action = action
    }

    public start()
    {
        super.start()

        this.action()
        this.completeTask()
    }
}

export class PlayerTaskManager
{
    private _tasks: Task[] = []

    private _executingTask?: Task

    public addTask(task: Task)
    {
        this._tasks.push(task)

        console.log(`[TaskManager] Added task ${task.constructor.name}`)

        this.tryStartTask()

        return task
    }

    public addTaskAt(task: Task, index: number)
    {
        this._tasks.splice(index, 0, task)
    }

    public clearTasks(keepFirst?: boolean)
    {
        //this._tasks.splice(keepFirst ? 1 : 0)
        this._tasks = []

        if(this._executingTask)
        {
            const task = this._executingTask

            this._executingTask = undefined

            task.cancel()
        }
    }

    public update(delta: number)
    {
        this.tryStartTask()
    }

    private tryStartTask()
    {
        if(!this._executingTask && this._tasks.length > 0)
        {
            const task = this._tasks.splice(0, 1)[0]

            console.log(`[TaskManager] Executing task ${task.constructor.name}`)

            this._executingTask = task

            task.events.once('complete', (result) =>
            {

                if(this._executingTask == task)
                {
                    console.log("completed with result", result)

                    this._executingTask = undefined
    
                    this.tryStartTask()
                } else {
                    console.log("completed, but was already discarted")
                }

                
            })
            task.start()
        }
    }
}