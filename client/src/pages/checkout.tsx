import CartList from "../components/cart/CartList";
import WithAuth from "../components/hoc/WithAuth";
import { useCart } from "../context/cartContext";
import PageHeader from "../partials/PageHeader";
import { Text, Flex, Badge, Button } from "@mantine/core";
import { useMutation } from "@tanstack/react-query";
import { TOrderRequest, TOrderResponse } from "../utils/types";
import { OrderCreate, TReturnData, TReturnError } from "../api/api";
import { AxiosError } from "axios";
import ServerError from "../components/common/ServerError";
import { Navigate } from "react-router-dom";
import { showNotification, updateNotification } from "@mantine/notifications";
import { X, Check } from "tabler-icons-react";

function Checkout() {
  const { cart, dispatch } = useCart();

  const {
    isLoading: orderLoading,
    error: orderError,
    isSuccess: orderSuccess,
    mutate: mutateOrderCreate,
  } = useMutation<TReturnData<TOrderResponse>, AxiosError<TReturnError>>({
    mutationFn: () => {
      // create order schema from cart
      const orderDataFormat: TOrderRequest = cart.items.map((item) => {
        return {
          serviceId: item.service.id,
          quantity: item.quantity,
        };
      });
      return OrderCreate(orderDataFormat);
    },
  });

  if (orderLoading) {
    showNotification({
      id: "order-notification",
      message: "Placing your Order",
      title: "Loading",
      loading: true,
    });
  }
  if (orderError) {
    updateNotification({
      id: "order-notification",
      message: "Error placing order",
      title: "Error",
      icon: <X />,
    });
  }

  if (orderSuccess) {
    dispatch({ type: "clearCart" });
    updateNotification({
      id: "order-notification",
      message: "Order placed successfully",
      title: "Success",
      icon: <Check />,
    });
    return <Navigate to="/dashboard" />;
  }

  return (
    <>
      <PageHeader title="Checkout" />
      <div className="container-fluid pt-5">
        <div className="container">
          <div className="mb-3">
            {orderError && orderError.response && orderError.response.data && (
              <ServerError message={orderError.response.data.message || ""} />
            )}
          </div>
          {cart.items.length > 0 && (
            <div className="my-3">
              <Text size="xl" className="mb-2 font-weight-bold">
                Cart Total: <Badge size="xl">Nrs. {cart.total}</Badge>
              </Text>
              <Flex gap="lg">
                <Button
                  loading={orderLoading}
                  onClick={() => mutateOrderCreate()}
                >
                  Place Order
                </Button>
                <Button onClick={() => dispatch({ type: "clearCart" })}>
                  Clear Cart
                </Button>
              </Flex>
            </div>
          )}
          <CartList />
        </div>
      </div>
    </>
  );
}

export default WithAuth(Checkout);
