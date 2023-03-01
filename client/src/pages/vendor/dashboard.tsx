import WithAuth from "../../components/hoc/WithAuth";
import { useAuth } from "../../context/authContext";
import MapOSM, { LatLng } from "../../components/map/open-street/map";
import PageHeader from "../../partials/PageHeader";
import {
  Flex,
  Paper,
  Tabs,
  Timeline,
  Badge,
  Table,
  ScrollArea,
  Tooltip,
  ActionIcon,
  Text,
  Overlay,
  Center,
  Button,
  Modal,
} from "@mantine/core";

import {
  GoogleMap,
  Marker,
  DirectionsRenderer,
  useJsApiLoader,
  Autocomplete,
} from "@react-google-maps/api";

import { useMutation, useQuery } from "@tanstack/react-query";
import {
  OrderChangeState,
  OrderGet,
  TReturnData,
  TReturnError,
} from "../../api/api";
import { TOrderResponse, TORDER_STATE, TSingleOrder } from "../../utils/types";
import { AxiosError } from "axios";
import CustomLoader from "../../components/common/CustomLoader";
import { ShoppingCartOff } from "tabler-icons-react";
import { useEffect, useState } from "react";
import AllServices from "../../components/page/vendor/AllServices";
import AccountInfoTab from "./AccountInfoTab";
function dashboard() {
  const { authState } = useAuth();
  return (
    <>
      <PageHeader
        title={authState.vendor ? "Hello " + authState.vendor?.name : ""}
      />
      <div className="container">
        <Tabs defaultValue="orders" title="My Account" orientation="vertical">
          <Tabs.List>
            <Tabs.Tab value="orders">Orders</Tabs.Tab>
            <Tabs.Tab value="services">Services</Tabs.Tab>
            <Tabs.Tab value="acc_info">Account Information</Tabs.Tab>
          </Tabs.List>
          <div className="ml-4 w-100">
            <Tabs.Panel value="orders">
              <OrdersTab />
            </Tabs.Panel>
            <Tabs.Panel value="services">
              <AllServices />
            </Tabs.Panel>
            <Tabs.Panel value="acc_info">
              <AccountInfoTab entityType="vendor" />
            </Tabs.Panel>
          </div>
        </Tabs>
      </div>
    </>
  );
}
const ORDER_STATES = ["RECEIVED", "WASHING", "SHIPPING", "COMPLETED"] as const;

function OrdersTab() {
  const [refreshData, setRefreshData] = useState(false);
  const { authState } = useAuth();

  const [mapModalOpen, setMapModalOpen] = useState(false);
  const [activeOrder, setActiveOrder] = useState<TSingleOrder | null>(null);
  const [mapLatLng, setMapLatLng] = useState<LatLng[]>([]);

  const {
    data: orderData,
    isLoading: orderLoading,
    error: orderError,
    refetch: orderRefetch,
  } = useQuery<TReturnData<TOrderResponse>, AxiosError<TReturnError>>({
    queryKey: ["allOrders"],
    queryFn: () => OrderGet(),
  });

  const {
    isSuccess: mutateCancelOrderSuccess,
    isLoading: mutateCancelOrderLoading,
    mutate: mutateCancelOrder,
  } = useMutation({
    mutationFn: (data: { orderId: number }) =>
      OrderChangeState({ state: "CANCELLED", id: data.orderId }),
  });

  function handleRefetchData(): void {
    setRefreshData((p) => !p);
  }

  useEffect(() => {
    if (activeOrder) setMapModalOpen(true);
  }, [activeOrder]);

  useEffect(() => {
    orderRefetch();
  }, [refreshData]);
  useEffect(() => {
    if (mutateCancelOrderSuccess) handleRefetchData();
  }, [mutateCancelOrderSuccess]);

  return (
    <div>
      {orderLoading && <CustomLoader />}
      {orderError && <div>Error Fetching Orders</div>}
      {orderData && (
        <Flex direction="column-reverse" gap="md">
          {orderData.data.map((order) => (
            <Paper
              withBorder
              style={{
                width: "100%",
                position: "relative",
              }}
              shadow="sm"
              radius="md"
              p="md"
              key={order.id}
            >
              <Flex gap="sm" mb="sm" justify="space-between">
                <Flex gap="sm" align="center">
                  <Badge>Order ID: {order.id}</Badge>
                  <Badge>Ordered By: {order.user.name}</Badge>
                  <Badge>Total: NRS {order.total}</Badge>
                  <Button size="xs" onClick={() => setActiveOrder(order)}>
                    View Map
                  </Button>
                </Flex>
                <Tooltip label="Cancel Order">
                  <ActionIcon
                    loading={mutateCancelOrderLoading}
                    onClick={() => {
                      mutateCancelOrder({
                        orderId: order.id,
                      });
                    }}
                    color="red"
                    variant="light"
                  >
                    <ShoppingCartOff />
                  </ActionIcon>
                </Tooltip>
              </Flex>
              <Flex justify="space-between" gap="md" align="start">
                <div className="border w-75">
                  <ScrollArea.Autosize offsetScrollbars maxHeight={200}>
                    <Table border={0}>
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
                  orderId={order.id}
                  active={ORDER_STATES.findIndex(
                    (state) => state === order.state
                  )}
                  handleRefetch={handleRefetchData}
                />
              </Flex>
              {order.state === "CANCELLED" && (
                <Overlay color="red">
                  <Center
                    style={{
                      height: "100%",
                    }}
                  >
                    <h2 className="text-white">Cancelled</h2>
                  </Center>
                </Overlay>
              )}
            </Paper>
          ))}
        </Flex>
      )}
      {authState.vendor && activeOrder && (
        <Modal
          opened={mapModalOpen}
          fullScreen
          onClose={() => {
            setMapModalOpen(false);
            setActiveOrder(null);
          }}
          title="Route from User to Vendor"
        >
          <MapOSM
            start={{
              latitude: authState.vendor.address_latitude,
              longitude: authState.vendor.address_longitude,
            }}
            end={[
              {
                latitude: activeOrder.user.address_latitude,
                longitude: activeOrder.user.address_longitude,
              },
            ]}
          />
        </Modal>
      )}
    </div>
  );
}

function OrderStatusTimeLine({
  active = 0,
  orderId,
  handleRefetch,
}: {
  active?: number;
  orderId: number;
  handleRefetch: () => void;
}) {
  const {
    data: changeStateData,
    error: changeStateError,
    isLoading: changeStateLoading,
    mutate: mutateChangeState,
  } = useMutation({
    mutationFn: (data: TORDER_STATE) =>
      OrderChangeState({ state: data, id: orderId }),
  });

  useEffect(() => {
    if (changeStateData) handleRefetch();
  }, [changeStateData]);

  return (
    <Timeline align="right" active={active} bulletSize={24} lineWidth={4}>
      {ORDER_STATES.map((state, idx) => (
        <Timeline.Item
          bulletSize={20}
          key={`order-state-${idx}`}
          title={
            <Tooltip label={"Update to " + state}>
              <Badge
                component={BadgeButton}
                style={{
                  cursor: "pointer",
                }}
                color="blue"
              >
                <Text>{state}</Text>
              </Badge>
            </Tooltip>
          }
          lineWidth={5}
          onClick={() => {
            if (!changeStateLoading) {
              mutateChangeState(state);
            }
          }}
        />
      ))}
    </Timeline>
  );
}

const BadgeButton = ({
  children,
  ...others
}: {
  children: React.ReactNode;
}) => (
  <Button {...others} variant="light" color="gray">
    {children}
  </Button>
);
export default WithAuth(dashboard, "VENDOR");
