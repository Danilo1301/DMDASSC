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

interface IHomepageItemCardProps
{
    homepageItem: HomepageItem
}

const HomepageItemCard: React.FC<IHomepageItemCardProps> = (props) =>
{
    const homepageItem = props.homepageItem

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleViewPage = () => {
        const url = homepageItem.projectUrl
        window.open(url, '_blank')?.focus()
    }

    return (
        <>
            <Col>
                <NavLink onClick={handleShow}>
                    <Card>
                        <Card.Img variant="top" src={homepageItem.image} />
                        <Card.Body>
                        <Card.Title>{homepageItem.title}</Card.Title>
                        <Card.Text>
                            {homepageItem.shortDescription}
                        </Card.Text>
                        </Card.Body>
                    </Card>
                </NavLink>
            </Col>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{homepageItem.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {homepageItem.shortDescription}
                    
                    { homepageItem.videoPreviewId
                        ? (<iframe width="100%" height="300px" src={ "https://www.youtube.com/embed/" + homepageItem.videoPreviewId } title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"></iframe>) 
                        : ""
                    }

                    {homepageItem.description}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleViewPage}>
                        View page
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

interface IHomepageItemCardListProps
{
    title: string
    category: HomepageItemCategory
}

const HomepageItemCardList: React.FC<IHomepageItemCardListProps> = (props) =>
{
    const items = homePageItems.filter(item => item.category === props.category && !item.hidden)

    return (
        <>
            <ListGroup className="my-2 mt-4">
                <ListGroup.Item variant="dark">{props.title}</ListGroup.Item>
            </ListGroup>

            <Row xs={1} md={3} className="g-4">
                {items.map((homepageItem, idx) => (
                <>
                    <HomepageItemCard homepageItem={homepageItem}></HomepageItemCard>
                </>
                ))}
            </Row>
        </>
    )
}

const Home: React.FC = () =>
{
    return (
    <>
        <Container className="mt-4">
            <HomepageItemCardList title="Games" category={HomepageItemCategory.GAMES}></HomepageItemCardList>
            <HomepageItemCardList title="Projects" category={HomepageItemCategory.PROJECTS}></HomepageItemCardList>
            <HomepageItemCardList title="GTA SA Mods" category={HomepageItemCategory.GTA_SA_MODS}></HomepageItemCardList>
            <HomepageItemCardList title="Scratch" category={HomepageItemCategory.SCRATCH}></HomepageItemCardList>
        </Container>
    </>
  )
}

export default Home