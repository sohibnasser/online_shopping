import { createContext, useContext, useEffect, useState } from "react";

const ShoppingCartContext = createContext({});
const initialCartItems = localStorage.getItem("Items")? JSON.parse(localStorage.getItem("Items")):[] ;

export default function ShoppingCartProvider({ children }) {
  const [cartItems, setCartItems] = useState(initialCartItems);
  useEffect(()=>{
      localStorage.setItem("Items" , JSON.stringify(cartItems))
  },[cartItems])

  const cartQuantity = cartItems.reduce(
    (quantity, item) => item.quantity + quantity,
    0
  );

  const getItemsQuantity = (id) => {
    return cartItems.find((item) => item.id === id)?.quantity || 0;
  };

  const increaseCartQuantity = (id) => {
    setCartItems((currItems) => {
      if (currItems.find((item) => item.id === id) == null) {
        return [...currItems, { id, quantity: 1 }];
      } else {
        return currItems.map((item) => {
          if (item.id === id) {
            return { ...item, quantity: item.quantity + 1 };
          } else {
            return item;
          }
        });
      }
    });
  };

  const decreaseCartQuantity = (id) => {
    setCartItems((currItems) => {
      if (currItems.find((item) => item.id === id) == null) {
        return currItems.filter((item) => item.id !== id);
      } else {
        return currItems.map((item) => {
          if (item.id === id) {
            return { ...item, quantity: item.quantity - 1 };
          } else {
            return item;
          }
        });
      }
    });
  };

  const removeItemFromCart = (id) => {
    setCartItems((currItems) => currItems.filter((item) => item.id !== id));
  };
  return (
    <ShoppingCartContext.Provider
      value={{
        cartItems,
        getItemsQuantity,
        increaseCartQuantity,
        decreaseCartQuantity,
        removeItemFromCart,
        cartQuantity,
      }}
    >

      {children}
    </ShoppingCartContext.Provider>
  );
}

export const useShoppingCart = () => {
  return useContext(ShoppingCartContext);
};
