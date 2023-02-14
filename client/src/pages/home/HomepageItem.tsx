export enum HomepageItemCategory {
    GAMES,
    PROJECTS,
    SCRATCH,
    GTA_SA_MODS,
    PRINCIPAL
  }
  
  export interface HomepageItem {
    title: string
    shortDescription: string
    description: string
    image: string
    projectUrl: string
    categories: HomepageItemCategory[]
    videoPreviewId?: string
    hidden?: boolean
}