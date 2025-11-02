import React from 'react';
import { Navbar, Nav, NavDropdown, Container, Badge } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../Context/CartContext';
import { FaShoppingCart } from 'react-icons/fa';

function NavigationBar() {
    const { cart } = useCart();
    const navigate = useNavigate();

    // Obtener usuario desde localStorage
    const user = JSON.parse(localStorage.getItem("user"));

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/"); // Redirige a inicio
        window.location.reload(); // Refresca el navbar
    };

    return (
        <Navbar bg="dark" variant="dark" expand="lg" sticky="top">
            <Container>
                {/* Logo */}
                <Navbar.Brand as={Link} to="/" className="fw-bold fs-4">
                    ELEGANCE
                </Navbar.Brand>

                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to="/">Inicio</Nav.Link>

                        {/* Catálogo */}
                        <NavDropdown title="Catálogo" id="catalog-dropdown" menuVariant="dark">
                            <NavDropdown.Item as={Link} to="/catalog/hombres">
                                Hombres
                            </NavDropdown.Item>
                            <NavDropdown.Item as={Link} to="/catalog/mujeres">
                                Mujeres
                            </NavDropdown.Item>
                        </NavDropdown>

                        <Nav.Link as={Link} to="/contact">Contacto</Nav.Link>
                    </Nav>

                    {/* Carrito + Login/Usuario */}
                    <Nav className="ms-auto">
                        {/* Carrito */}
                        <Nav.Link as={Link} to="/cart" className="position-relative">
                            <FaShoppingCart size={22} />
                            {cart.length > 0 && (
                                <Badge
                                    bg="danger"
                                    pill
                                    className="position-absolute top-0 start-100 translate-middle"
                                >
                                    {cart.length}
                                </Badge>
                            )}
                        </Nav.Link>

                        {/* Usuario */}
                        {user ? (
                            <NavDropdown title={`Hola, ${user.nombre}`} id="user-nav">
                                <NavDropdown.Item as={Link} to="/profile">
                                    Mi Perfil
                                </NavDropdown.Item>
                                <NavDropdown.Item onClick={handleLogout}>
                                    Cerrar sesión
                                </NavDropdown.Item>
                            </NavDropdown>
                        ) : (
                            <Nav.Link as={Link} to="/login" className="ms-3">
                                Acceder
                            </Nav.Link>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default NavigationBar;
