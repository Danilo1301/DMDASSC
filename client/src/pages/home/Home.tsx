import React from 'react'

import { HomepageItemCategory } from './HomepageItem'
import { HomepageItemCardList } from './IHomepageItemCardList'


const Home: React.FC = () =>
{
    return (
    <>
        <div className="container mt-4">
            <HomepageItemCardList title="Main Projects" category={HomepageItemCategory.PRINCIPAL}></HomepageItemCardList>
            <HomepageItemCardList title="Games" category={HomepageItemCategory.GAMES}></HomepageItemCardList>
            <HomepageItemCardList title="Projects" category={HomepageItemCategory.PROJECTS}></HomepageItemCardList>
            <HomepageItemCardList title="GTA SA Mods" category={HomepageItemCategory.GTA_SA_MODS}></HomepageItemCardList>
            <HomepageItemCardList title="Scratch" category={HomepageItemCategory.SCRATCH}></HomepageItemCardList>
        </div>
    </>
  )
}

export default Home