import { createContext, useState, useEffect, useContext } from "react";
import { UserContext } from "./UserContext";

export const CartContext = createContext();

export default function CartContextProvider({ children }) {
  const { userLogin } = useContext(UserContext);

  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem("cartItems");
    const token = localStorage.getItem("userToken");
    return saved && token ? JSON.parse(saved) : [];
  });

  const [cartCount, setCartCount] = useState(0);

  // Clear cart if user is not logged in
  useEffect(() => {
    if (!userLogin) {
      setCartItems([]);
      localStorage.removeItem("cartItems");
    }
  }, [userLogin]);

  useEffect(() => {
    if (userLogin) {
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
    }
    const totalCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
    setCartCount(totalCount);
  }, [cartItems, userLogin]);

  const addToCart = (product, quantity) => {
    if (!userLogin) return;
    setCartItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex((item) => item.id === product.id);
      if (existingItemIndex > -1) {
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity = quantity;
        return updatedItems;
      } else {
        return [...prevItems, { ...product, quantity }];
      }
    });
  };

  const removeFromCart = (productId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (!userLogin || quantity < 1) return;
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
