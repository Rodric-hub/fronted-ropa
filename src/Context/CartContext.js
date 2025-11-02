import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import * as cartService from '../Services/Api';
import { AuthContext } from './AuthContext';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCart = async () => {
            try {
                if (user?.id) {
                    const res = await cartService.getCart(user.id);
                    setCart(res.data);
                } else {
                    setCart([]);
                }
            } catch (error) {
                console.error('Error al obtener carrito:', error);
            }
        };
        fetchCart();
    }, [user]);

    const addItem = async (product, quantity = 1) => {
        if (!user?.id) {
            alert('Debes iniciar sesión para agregar productos al carrito.');
            navigate('/login');
            return;
        }

        try {
            await cartService.addToCart(user.id, product.id, quantity);
            setCart(prev => {
                const existing = prev.find(i => i.product_id === product.id);
                if (existing) {
                    return prev.map(i =>
                        i.product_id === product.id
                            ? { ...i, quantity: i.quantity + quantity }
                            : i
                    );
                }
                return [...prev, { ...product, quantity }];
            });
        } catch (error) {
            console.error('Error al agregar al carrito:', error);
        }
    };

    const updateItem = async (productId, quantity) => {
        if (!user?.id) {
            navigate('/login');
            return;
        }

        try {
            await cartService.updateQuantity(user.id, productId, quantity);
            setCart(prev =>
                prev.map(i =>
                    i.product_id === productId ? { ...i, quantity } : i
                )
            );
        } catch (error) {
            console.error('Error al actualizar cantidad:', error);
        }
    };

    const removeItem = async (productId) => {
        if (!user?.id) {
            navigate('/login');
            return;
        }

        try {
            await cartService.removeFromCart(user.id, productId);
            setCart(prev => prev.filter(i => i.product_id !== productId));
        } catch (error) {
            console.error('Error al eliminar producto:', error);
        }
    };

    const clear = async () => {
        if (!user?.id) {
            navigate('/login');
            return;
        }

        try {
            await cartService.clearCart(user.id);
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
