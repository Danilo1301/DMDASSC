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

/*
* Homepage Item Card
*/

interface IHomepageItemCardProps
{
    homepageItem: HomepageItem
}

export const HomepageItemCard: React.FC<IHomepageItemCardProps> = (props) =>
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
            <div className="row border p-0 m-0">
                <div className="col-auto">
                    <img src={homepageItem.image} className="bg-dark border float-left" width="300px" height="200px" alt="..."></img>
                </div>
                <div className="col">
                    <div className="row" style={{height: '100%'}}>
                        <div className="align-self-start p-2">
                            <h2>{homepageItem.title}</h2>
                            <div>{homepageItem.shortDescription}</div>
                            <div>{homepageItem.description}</div>
                        </div>
                        <div className="align-self-end row">
                            <div className="col-auto p-2">
                                <button className="btn flex btn-primary" onClick={handleShow}>Show video</button>
                            </div>
                            <div className="col-auto p-2">
                                <button className="btn btn-secondary" onClick={handleViewPage}>View page</button>
                            </div>
                           
                        </div>
                    </div>
                </div>
            </div>

            
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

/*
<div className="bg-light" style={ {width: 200, height: 200} }>
    <img src={'imageSrc'} width="100%" height="100%"></img>
</div>
                */

/*
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
*/