import { TUser } from "../../utils/types";
import CustomLoader from "../../components/common/CustomLoader";

import {
    Table,
    Group,
    ActionIcon,
    Tooltip,
    ScrollArea,
    Button,
    Modal,
    Flex,
  } from "@mantine/core";
import {useQuery } from "@tanstack/react-query";
import WithAuth from "../../components/hoc/WithAuth";

import {
  TReturnData,
  TReturnError,
  VendorUpdate,
  UserUpdate,
  UserGetAll,
} from "../../api/api";
import { AxiosError } from "axios";
 function AllUsers() {
    const {
        data: usersData,
        isLoading: usersLoading,
        error: usersError,
        refetch: usersRefetch,
      } = useQuery<TReturnData<TUser[]>, AxiosError<TReturnError>>({
        queryKey: ["allUsers"],
        queryFn: () => UserGetAll(),
      });
      return (
        <div>
          {usersLoading && <>Loading all Services</>}
          {usersData && (
            <div>
              
              <ScrollArea
                style={{
                  height: "400px",
                }}
              >
                <Table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Address</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usersData.data.map((users, idx) => {
                      return (
                        <tr key={idx}>
                          <td>{users.id}</td>
                          <td>{users.name}</td>
                          <td>{users.email}</td>
                          <td>{users.address}</td>
                         
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </ScrollArea>
            </div>
          )}
       
        </div>
      );
}
export default WithAuth( AllUsers,"VENDOR");

