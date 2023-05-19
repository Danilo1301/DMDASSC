import Container from "react-bootstrap/esm/Container"
import Nav from "react-bootstrap/esm/Nav"
import Navbar from "react-bootstrap/esm/Navbar"
import NavDropdown from "react-bootstrap/esm/NavDropdown"

const MainNavbar: React.FC = () =>
(
    <>
        <Navbar style={{backgroundColor: '#5d67c7'}}>
            <Container>
                <Navbar.Brand className="text-light" href="#home">
                    {
                        /*
                        <img
                        alt=""
                        src="/logo.svg"
                        width="30"
                        height="30"
                        className="d-inline-block align-top"
                      />{' '}
                        */
                    }
                    DMDASSC
                </Navbar.Brand>

                
            </Container>
        </Navbar>
    </>
)

/*
                <Navbar.Collapse id="navbar-dark-example" className="justify-content-end">
                    <Nav>
                        <NavDropdown
                            id="nav-dropdown-dark-example"
                            title="Dropdown"
                            menuVariant="dark"
                        >
                            <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                            <NavDropdown.Item href="#action/3.2">
                                Another action
                            </NavDropdown.Item>
                            <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item href="#action/3.4">
                                Separated link
                            </NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                </Navbar.Collapse>
*/

export default MainNavbar