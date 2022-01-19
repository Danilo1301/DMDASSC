export interface Anime {
    id: string
    name: string
    watchedEpisodes: number 
    totalEpisodes: number 
    watchedOvas: number 
    totalOvas: number 
    nextEpisodeDate?: number
    lastUpdated: number
}