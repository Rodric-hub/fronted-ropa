import { useEffect, useState } from 'react';
import { Container, Button, Alert } from 'react-bootstrap';
import CartItem from '../Components/CartItem';
import { useCart } from '../Context/CartContext';
// 🆕 importaciones nuevas
import { createOrder } from '../Services/Api';
import { useContext } from 'react';
import { AuthContext } from '../Context/AuthContext';

function Cart() {
    const { cart, removeFromCart, clearCart } = useCart();
<<<<<<< HEAD

    // 🆕 acceder al usuario logeado
    const { user } = useContext(AuthContext);

    const [checkout, setCheckout] = useState(false);
    const [loading, setLoading] = useState(false); // 🆕 nuevo estado para mostrar cargando
    const [message, setMessage] = useState(''); // 🆕 nuevo estado para mensajes

    // 🆕 función mejorada de compra
    const handleCheckout = async () => {
        if (!user?.id) {
            alert('Debes iniciar sesión para realizar una compra.');
            return;
        }
=======

    const [checkout, setCheckout] = useState(false);
>>>>>>> 8135cd58dc0f4b6dbc4753748b49ce196abca0ef

        if (cart.length === 0) {
            alert('Tu carrito está vacío.');
            return;
        }

        try {
            setLoading(true);
            setMessage('');

            // 🆕 registrar pedido en el backend
            const res = await createOrder(user.id, cart);
            console.log('Pedido creado:', res.data);

            setCheckout(true);
            setMessage('✅ ¡Compra realizada con éxito!');
            clearCart(); // 🟢 tu código original (mantiene vaciado)
        } catch (error) {
            console.error('Error al registrar compra:', error);
            setMessage('No se pudo registrar la compra.');
        } finally {
            setLoading(false);
        }
    };

    const total = cart.reduce(
        (sum, item) => sum + Number(item.precio) * (item.quantity || 1),
        0
    );

    return (
        <Container className="my-5">
            <h2 className="mb-4 text-center">Tu Carrito</h2>

            {/* 🆕 Mensaje dinámico */}
            {message && (
                <Alert variant={checkout ? 'success' : 'danger'}>{message}</Alert>
            )}

            {checkout && !message && (
                <Alert variant="success">¡Compra realizada con éxito!</Alert>
            )}

            {cart.length === 0 ? (
                <p className="text-center">No hay productos en el carrito.</p>
            ) : (
                <>
                    {cart.map((item) => (
                        <CartItem key={item.id} item={item} removeFromCart={removeFromCart} />
                    ))}
                    <h4 className="text-end mt-4">Total: S/. {total.toFixed(2)}</h4>
                    <div className="text-end">
                        <Button
                            variant="success"
                            onClick={handleCheckout}
                            disabled={loading} // 🆕 evita doble clic
                        >
                            {loading ? 'Procesando...' : 'Comprar'}
                        </Button>
                    </div>
                </>
            )}
        </Container>
    );
}

export default Cart;
