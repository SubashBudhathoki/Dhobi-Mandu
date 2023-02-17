import React from "react";

import {
  Button,
  Drawer,
  Flex,
  ScrollArea,
  useMantineTheme,
} from "@mantine/core";
import { useState } from "react";
import { TCartItem } from "../../utils/types";
import { useCart } from "../../context/cartContext";
import CartItem from "./CartItem";

export default function CartDrawer({
  drawerOpen,
  setDrawerOpen,
}: {
  drawerOpen: boolean;
  setDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const theme = useMantineTheme();
  const { cart, dispatch } = useCart();
  console.log(cart);
  return (
    <Drawer
      size="xl"
      overlayColor={theme.colors.gray[2]}
      overlayOpacity={0.55}
      overlayBlur={3}
      opened={drawerOpen}
      position="right"
      title={"Your Cart"}
      padding="xl"
      onClose={() => setDrawerOpen(false)}
    >
      {cart.items.length <= 0 && <div>Your cart is empty</div>}
      {cart.items.length > 0 && (
        <div className="my-3">
          <p>Cart Total: Nrs. {cart.total}</p>
          <Flex gap="lg">
            <Button fullWidth>Proceed to Checkout</Button>
            <Button onClick={() => dispatch({ type: "clearCart" })} fullWidth>
              Clear Cart
            </Button>
          </Flex>
        </div>
      )}
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
    </Drawer>
  );
}
