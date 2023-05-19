import React, { useState } from 'react'
import Button from 'react-bootstrap/esm/Button'
import Card from 'react-bootstrap/esm/Card'
import Col from 'react-bootstrap/esm/Col'
import Container from 'react-bootstrap/esm/Container'
import ListGroup from 'react-bootstrap/esm/ListGroup'
import Modal from 'react-bootstrap/esm/Modal'
import NavLink from 'react-bootstrap/esm/NavLink'
import Row from 'react-bootstrap/esm/Row'
import { HomepageItem, HomepageItemCategory } from './HomepageItem'
import { homePageItems } from './homepageItems'
import { HomepageItemCard } from './HomepageItemCard'

interface IHomepageItemCardListProps
{
    title: string
    category: HomepageItemCategory
}

export const HomepageItemCardList: React.FC<IHomepageItemCardListProps> = (props) =>
{
    const items = homePageItems.filter(item => {
        if(item.hidden) return false;

        for(const category of item.categories)
        {
            if(category == props.category) return true;
        }

        return false;
    })

    return (
        <>
            <ul className="list-group mt-4">

                <a href="#" className="list-group-item list-group-item-action active">
                    <h5 className="mb-1">{props.title}</h5>
                    <small className="">{items.length} projects</small>
                </a>

                {items.map((homepageItem, idx) => (
                    <li className="list-group-item p-4">
                        <HomepageItemCard homepageItem={homepageItem}></HomepageItemCard>
                    </li>
                ))}

            </ul>
        </>
    )
}

/*
             <ListGroup className="my-2 mt-5">
                <ListGroup.Item style={{backgroundColor: '#73b2f6'}}><b>{props.title}</b></ListGroup.Item>
            </ListGroup>

            <Row xs={1} md={3} className="g-4">
                {items.map((homepageItem, idx) => (
                <>
                    <HomepageItemCard homepageItem={homepageItem}></HomepageItemCard>
                </>
                ))}
            </Row>
            */