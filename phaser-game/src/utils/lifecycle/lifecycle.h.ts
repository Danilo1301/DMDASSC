export interface IAwake {
    Awake(): void
}
  
export interface IUpdate {
    Update(deltaTime: number): void
}

export interface IDestroy {
    Destroy(): void
}