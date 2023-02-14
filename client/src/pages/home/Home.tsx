import React, { useState } from 'react'

import Container from 'react-bootstrap/esm/Container'
import { HomepageItemCategory } from './HomepageItem'
import { HomepageItemCardList } from './HomepageItemCard'


const Home: React.FC = () =>
{
    return (
    <>
        <Container className="mt-4">
            <HomepageItemCardList title="Principal" category={HomepageItemCategory.PRINCIPAL}></HomepageItemCardList>
            <HomepageItemCardList title="Games" category={HomepageItemCategory.GAMES}></HomepageItemCardList>
            <HomepageItemCardList title="Projects" category={HomepageItemCategory.PROJECTS}></HomepageItemCardList>
            <HomepageItemCardList title="GTA SA Mods" category={HomepageItemCategory.GTA_SA_MODS}></HomepageItemCardList>
            <HomepageItemCardList title="Scratch" category={HomepageItemCategory.SCRATCH}></HomepageItemCardList>
        </Container>
    </>
  )
}

export default Home