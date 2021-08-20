export abstract class Task
{
    public completed: boolean = false

    public onStart() {}

    protected completeTask()
    {
        this.completed = true
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

    public onStart()
    {
        this.action()
        this.completeTask()
    }
}

export default class TaskManager
{
    private _tasks: Task[] = []

    private _executingTask = false

    public addTask(task: Task)
    {
        this._tasks.push(task)
    }

    public addTaskAt(task: Task, index: number)
    {
        this._tasks.splice(index, 0, task)
    }

    public clearTasks()
    {
        this._tasks.splice(1)
    }

    public update(delta: number)
    {
        if(this._executingTask)
        {
            const task = this._tasks[0]

            if(task.completed)
            {
                this._tasks.splice(0, 1)
                this._executingTask = false
            }
        } 

        if(this._tasks.length > 0 && !this._executingTask)
        {
            const task = this._tasks[0]
            this._executingTask = true
            
            //console.log(task)

            task.onStart()
        }
        
    }
}