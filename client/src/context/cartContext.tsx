import { createContext, useContext, useEffect, useReducer } from "react";
import { TCart, TCartItem } from "../utils/types";

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
};
const CartContext = createContext<CartContextType>({
  cart: {
    items: [],
    total: 0,
  },
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
      // find a cart item with same serviceId. If present. update that cartItem by updating its uantity to +1
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
  const value = { cart, dispatch };

  useEffect(() => {
    const cartFromLocalStorage = localStorage.getItem("cart");
    if (cartFromLocalStorage) {
      const cart: TCartState = JSON.parse(cartFromLocalStorage);
      dispatch({ type: "setCart", payload: cart });
    }
  }, []);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
