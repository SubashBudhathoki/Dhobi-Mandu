import { createContext, useContext, useEffect, useReducer } from "react";
import { TCart, TCartItem } from "../utils/types";
import { showNotification } from "@mantine/notifications";
type CartAction =
  | {
      type: "addToCart";
      payload: Omit<TCartItem, "id">;
    }
  | {
      type: "removeFromCart";
      payload: {
        itemId: number;
      };
    }
  | { type: "clearCart" }
  | {
      type: "changeQty";
      payload: {
        itemId: number;
        type: "INC" | "DEC";
      };
    }
  | {
      type: "setCart";
      payload: TCartState;
    };

type TCartState = {
  items: TCart;
  total: number;
};

type CartContextType = {
  cart: TCartState;
  dispatch: React.Dispatch<CartAction>;
  addToCart: (cartItem: Omit<TCartItem, "id">) => void;
  removeFromCart: (itemId: number) => void;
  clearCart: () => void;
  updateCartItemQty: (itemId: number, type: "INC" | "DEC") => void;
};
const CartContext = createContext<CartContextType>({
  cart: {
    items: [],
    total: 0,
  },
  addToCart: (item: Omit<TCartItem, "id">) => {},
  removeFromCart: (itemId: number) => {},
  clearCart: () => {},
  updateCartItemQty: (itemId: number, type: "INC" | "DEC") => {},
  dispatch: () => {},
});

function authReducer(state: TCartState, action: CartAction): TCartState {
  function CalcCartTotal(cartItems: TCart) {
    let total = 0;
    cartItems.forEach((item) => {
      total += item.total;
    });
    return total;
  }
  switch (action.type) {
    case "addToCart":
      const existingItemIdx = state.items.findIndex((cartItem) => {
        return cartItem.service.id === action.payload.service.id;
      });
      if (existingItemIdx > -1) {
        const existingItem = state.items[existingItemIdx];
        const newItemTotal =
          (existingItem.quantity + action.payload.quantity) *
          action.payload.service.price;
        const newCartItem = {
          ...existingItem,
          quantity: existingItem.quantity + action.payload.quantity,
          total: newItemTotal,
        };
        const updatedItems = [...state.items];
        updatedItems[existingItemIdx] = newCartItem;

        const newCartState = {
          ...state,
          total: CalcCartTotal(updatedItems),
          items: updatedItems,
        };

        localStorage.setItem("cart", JSON.stringify(newCartState));

        return newCartState;
      }

      const newCartItem = {
        service: action.payload.service,
        quantity: action.payload.quantity,
        total: action.payload.service.price * action.payload.quantity,
      };

      const newCartState = {
        ...state,
        items: [...state.items, newCartItem],
        total: CalcCartTotal([...state.items, newCartItem]),
      };

      localStorage.setItem("cart", JSON.stringify(newCartState));

      return newCartState;

    case "removeFromCart": {
      const id = action.payload.itemId;

      const index = state.items.findIndex((item) => item.service.id === id);

      const itemsInCart = [...state.items];

      if (index > -1) itemsInCart.splice(index, 1);
      const newTotal = CalcCartTotal(itemsInCart);

      const newCartState = {
        ...state,
        items: itemsInCart,
        total: newTotal,
      };
      localStorage.setItem("cart", JSON.stringify(newCartState));
      return newCartState;
    }

    case "clearCart": {
      localStorage.removeItem("cart");
      return {
        ...state,
        items: [],
        total: 0,
      };
    }

    case "changeQty": {
      const itemId = action.payload.itemId;
      const itemsInCart = [...state.items];
      const itemIdx = itemsInCart.findIndex(
        (item) => item.service.id === itemId
      );

      if (itemIdx > -1) {
        const item = itemsInCart[itemIdx];
        let newQty =
          action.payload.type === "INC" ? item.quantity + 1 : item.quantity - 1;

        if (newQty < 1) newQty = 1;

        const newItemTotal = item.service.price * newQty;

        const newItem = {
          ...item,
          quantity: newQty,
          total: newItemTotal,
        };
        itemsInCart[itemIdx] = newItem;
        const newTotal = CalcCartTotal(itemsInCart);
        const newCartState = {
          ...state,
          items: itemsInCart,
          total: newTotal,
        };
        localStorage.setItem("cart", JSON.stringify(newCartState));
        return newCartState;
      }
      return state;
    }

    case "setCart": {
      const cart = action.payload;
      const newTotal = CalcCartTotal(cart.items);
      return {
        ...state,
        items: cart.items,
        total: newTotal,
      };
    }

    default:
      return state;
  }
}

export const useCart = () => useContext(CartContext);

const initialState: TCartState = { items: [], total: 0 };

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [cart, dispatch] = useReducer(authReducer, initialState);

  function addToCart(cartItem: Omit<TCartItem, "id">) {
    showNotification({
      message: " Item added to cart",
      title: "Success",
    });
    dispatch({ type: "addToCart", payload: cartItem });
  }
  function removeFromCart(itemId: number) {
    showNotification({
      message: "Item removed from cart",
      title: "Success",
    });
    dispatch({ type: "removeFromCart", payload: { itemId } });
  }
  function clearCart() {
    showNotification({
      message: "Cart Cleared",
      title: "Success",
    });
    dispatch({ type: "clearCart" });
  }
  function updateCartItemQty(itemId: number, type: "INC" | "DEC") {
    dispatch({ type: "changeQty", payload: { itemId, type } });
  }
  function setCart(cartState: TCartState) {
    dispatch({ type: "setCart", payload: cartState });
  }

  const value = {
    cart,
    dispatch,
    addToCart,
    removeFromCart,
    clearCart,
    updateCartItemQty,
  };

  useEffect(() => {
    const cartFromLocalStorage = localStorage.getItem("cart");
    if (cartFromLocalStorage) {
      const cart: TCartState = JSON.parse(cartFromLocalStorage);
      setCart(cart);
    }
  }, []);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
