import PageHeader from "../../partials/PageHeader";
import { Tabs } from "@mantine/core";
import ALink from "../../components/common/ALink";
import WithAuth from "../../components/hoc/WithAuth";
import { useAuth } from "../../context/authContext";
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
          <div className="ml-4">
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
  return <div>My Orders</div>;
}

function AccountInfoTab() {
  return <div>Account Information</div>;
}

export default WithAuth(Dashboard);
