import { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import * as cartService from '../Services/Api';
import { AuthContext } from './AuthContext';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

<<<<<<< HEAD
    // ✅ Normaliza siempre el ID del usuario
=======
>>>>>>> 8135cd58dc0f4b6dbc4753748b49ce196abca0ef
    const getCurrentUser = () => {
        try {
            const fromContext = user || JSON.parse(localStorage.getItem('user'));
            if (!fromContext) return null;

            const id = fromContext.id ?? fromContext.user_id ?? null;
            return id ? { ...fromContext, id } : null;
        } catch {
            return null;
        }
    };

<<<<<<< HEAD
    // 🔁 Cargar carrito del usuario logueado
=======
>>>>>>> 8135cd58dc0f4b6dbc4753748b49ce196abca0ef
    useEffect(() => {
        const fetchCart = async () => {
            try {
                const currentUser = getCurrentUser();
                if (currentUser?.id) {
                    const res = await cartService.getCart(currentUser.id);
                    setCart(res.data || []);
                } else {
                    setCart([]);
                }
            } catch (error) {
                console.error('Error al obtener carrito:', error);
            }
        };
        fetchCart();
    }, [user]);

    // 🧩 Normalizar producto antes de añadir
    const normalizeProductForCart = (product) => {
        const id = product.id ?? product.product_id ?? product.productId;
        const name = product.name ?? product.nombre ?? product.title ?? 'Producto';
        const image = product.image ?? product.image_url ?? product.imagen ?? null;
        const precio = Number(product.price ?? product.precio ?? 0);
        return { id, name, image, precio };
    };

    // 🛒 Agregar producto al carrito
    const addItem = async (product, quantity = 1) => {
        const currentUser = getCurrentUser();
        if (!(currentUser?.id)) {
            alert('Debes iniciar sesión para agregar productos al carrito.');
            navigate('/auth');
            return;
        }

        const normalized = normalizeProductForCart(product);
<<<<<<< HEAD
        const userId = currentUser.id;
=======
>>>>>>> 8135cd58dc0f4b6dbc4753748b49ce196abca0ef

        try {
            try {
                await cartService.addToCart(userId, normalized.id, quantity);
            } catch (err) {
<<<<<<< HEAD
                console.warn('No se pudo guardar en el backend (modo local activo o sin conexión).', err);
            }

            setCart(prev => {
                const existing = prev.find(i =>
                    (i.product_id ? i.product_id === normalized.id : i.id === normalized.id)
                );

=======

                console.warn('No se pudo guardar en el backend (o no configurado).', err);
            }

            setCart(prev => {

                const existing = prev.find(i => (i.product_id ? i.product_id === normalized.id : i.id === normalized.id));
>>>>>>> 8135cd58dc0f4b6dbc4753748b49ce196abca0ef
                if (existing) {
                    return prev.map(i =>
                        (i.product_id ? i.product_id === normalized.id : i.id === normalized.id)
                            ? { ...i, quantity: (i.quantity || 1) + quantity }
                            : i
                    );
                }

<<<<<<< HEAD
                return [...prev, {
                    id: normalized.id,
                    name: normalized.name,
                    precio: normalized.precio,
                    image: normalized.image,
                    quantity
                }];
=======
                return [...prev, { id: normalized.id, name: normalized.name, precio: normalized.precio, image: normalized.image, quantity }];
>>>>>>> 8135cd58dc0f4b6dbc4753748b49ce196abca0ef
            });
        } catch (error) {
            console.error('Error al agregar al carrito:', error);
        }
    };

    // 🔄 Actualizar cantidad
    const updateItem = async (productId, quantity) => {
        const currentUser = getCurrentUser();
        if (!(currentUser?.id)) {
            navigate('/auth');
            return;
        }

        const userId = currentUser.id;

        try {
            await cartService.updateQuantity(userId, productId, quantity);
            setCart(prev =>
                prev.map(i =>
                    (i.product_id ? i.product_id === productId : i.id === productId)
                        ? { ...i, quantity }
                        : i
                )
            );
        } catch (error) {
            console.error('Error al actualizar cantidad:', error);
        }
    };

    // Eliminar producto
    const removeItem = async (productId) => {
        const currentUser = getCurrentUser();
        if (!(currentUser?.id)) {
            navigate('/auth');
            return;
        }

        const userId = currentUser.id;

        try {
            await cartService.removeFromCart(userId, productId);
            setCart(prev => prev.filter(i =>
                (i.product_id ? i.product_id !== productId : i.id !== productId)
            ));
        } catch (error) {
            console.error('Error al eliminar producto:', error);
        }
    };

    // 🧹 Vaciar carrito
    const clear = async () => {
        const currentUser = getCurrentUser();
        if (!(currentUser?.id)) {
            navigate('/auth');
            return;
        }

        const userId = currentUser.id;

        try {
            await cartService.clearCart(userId);
            setCart([]);
        } catch (error) {
            console.error('Error al limpiar carrito:', error);
        }
    };

    return (
        <CartContext.Provider value={{
            cart,
            addToCart: addItem,
            updateQuantity: updateItem,
            removeFromCart: removeItem,
            clearCart: clear
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart debe usarse dentro de un CartProvider');
    }
    return context;
};
