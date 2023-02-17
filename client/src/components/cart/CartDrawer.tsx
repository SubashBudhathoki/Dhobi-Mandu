import { Button, Drawer, Flex, useMantineTheme } from "@mantine/core";
import { useCart } from "../../context/cartContext";
import ALink from "../common/ALink";
import CartList from "./CartList";

export default function CartDrawer({
  drawerOpen,
  setDrawerOpen,
}: {
  drawerOpen: boolean;
  setDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const theme = useMantineTheme();
  const { cart, dispatch } = useCart();

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
      {cart.items.length > 0 && (
        <div className="my-3">
          <p>Cart Total: Nrs. {cart.total}</p>
          <Flex gap="lg">
            <ALink href="/checkout">
              <Button fullWidth>Proceed to Checkout</Button>
            </ALink>
            <Button onClick={() => dispatch({ type: "clearCart" })} fullWidth>
              Clear Cart
            </Button>
          </Flex>
        </div>
      )}
      <CartList />
    </Drawer>
  );
}
