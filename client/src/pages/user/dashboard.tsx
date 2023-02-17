import PageHeader from "../../partials/PageHeader";
import {
  Flex,
  Paper,
  Tabs,
  Timeline,
  Badge,
  Table,
  ScrollArea,
} from "@mantine/core";
import WithAuth from "../../components/hoc/WithAuth";
import { useAuth } from "../../context/authContext";
import { useQuery } from "@tanstack/react-query";
import { OrderUser, TReturnData, TReturnError } from "../../api/api";
import { TOrderResponse } from "../../utils/types";
import { AxiosError } from "axios";
import CustomLoader from "../../components/common/CustomLoader";

const ORDER_STATES = ["RECEIVED", "WASHING", "SHIPPING", "COMPLETED"];

function Dashboard() {
  const { authState } = useAuth();
  return (
    <>
      <PageHeader
        title={authState.user ? "Hello " + authState.user?.name : ""}
      />
      <div className="container">
        <Tabs defaultValue="orders" title="My Account" orientation="vertical">
          <Tabs.List>
            <Tabs.Tab value="orders">Orders</Tabs.Tab>
            <Tabs.Tab value="account-info">Account Information</Tabs.Tab>
          </Tabs.List>
          <div className="ml-4 w-100">
            <Tabs.Panel value="orders">
              <OrdersTab />
            </Tabs.Panel>
            <Tabs.Panel value="account-info">
              <AccountInfoTab />
            </Tabs.Panel>
          </div>
        </Tabs>
      </div>
    </>
  );
}

function OrdersTab() {
  const {
    data: orderData,
    isLoading: orderLoading,
    error: orderError,
  } = useQuery<TReturnData<TOrderResponse>, AxiosError<TReturnError>>({
    queryKey: ["orderUser"],
    queryFn: () => OrderUser(),
  });

  return (
    <div>
      {orderLoading && <CustomLoader />}
      {orderError && <div>error</div>}
      {orderData && (
        <Flex direction="column-reverse" gap="md">
          {orderData.data.map((order) => (
            <Paper
              withBorder
              style={{
                width: "100%",
              }}
              shadow="sm"
              radius="md"
              p="md"
              key={order.id}
            >
              <Flex gap="sm" mb="sm">
                <Badge>Order ID: {order.id}</Badge>
                <Badge>Total: NRS {order.total}</Badge>
              </Flex>

              <Flex justify="space-between" align="start">
                <div className="border w-75">
                  <ScrollArea.Autosize offsetScrollbars maxHeight={200}>
                    <Table
                      border={0}
                      style={{
                        border: "0px",
                      }}
                    >
                      <thead>
                        <tr>
                          <th>Service</th>
                          <th>Quantity</th>
                          <th>Price</th>
                          <th>Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {order.OrderItems.map((item) => (
                          <tr key={item.id}>
                            <td>{item.Service.name}</td>
                            <td>{item.quantity}</td>
                            <td>{item.Service.price}</td>
                            <td>{item.total}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </ScrollArea.Autosize>
                </div>
                <OrderStatusTimeLine
                  active={ORDER_STATES.findIndex(
                    (state) => state === order.state
                  )}
                />
              </Flex>
            </Paper>
          ))}
        </Flex>
      )}
    </div>
  );
}

function OrderStatusTimeLine({ active = 0 }: { active?: number }) {
  return (
    <Timeline align="right" active={active} bulletSize={24} lineWidth={2}>
      {ORDER_STATES.map((state, idx) => (
        <Timeline.Item
          bulletSize={20}
          key={`order-state-${idx}`}
          title={state}
          lineWidth={5}
        />
      ))}
    </Timeline>
  );
}

function AccountInfoTab() {
  return <div>Account Information</div>;
}

export default WithAuth(Dashboard);
