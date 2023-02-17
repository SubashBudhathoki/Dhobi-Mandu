import { Text, Badge, Button, Flex, ScrollArea } from "@mantine/core";
import { useCart } from "../../context/cartContext";
import CartItem from "./CartItem";

export default function CartList() {
  const { cart } = useCart();
  return (
    <>
      {cart.items.length <= 0 && <div>Your cart is empty</div>}
      <div
        style={{
          display: "grid",
          height: "810px",
        }}
      >
        <ScrollArea
          style={{
            height: "100%",
          }}
        >
          <Flex direction="column-reverse" gap={10}>
            {cart.items.map((cartItem, idx) => {
              return (
                <CartItem
                  key={`cart-item-${cartItem.service.id}-${idx}`}
                  cartItem={cartItem}
                />
              );
            })}
          </Flex>
        </ScrollArea>
      </div>
    </>
  );
}
