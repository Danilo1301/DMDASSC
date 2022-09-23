export enum HomepageItemCategory {
    GAMES,
    PROJECTS,
    SCRATCH,
    GTA_SA_MODS
  }
  
  export interface HomepageItem {
    title: string
    shortDescription: string
    description: string
    image: string
    projectUrl: string
    category: HomepageItemCategory
    videoPreviewId?: string
    hidden?: boolean
}