import { useForm } from "@mantine/form";
import { TextInput, Paper, Button } from "@mantine/core";
import { useJsApiLoader, Autocomplete } from "@react-google-maps/api";
import { useAuth } from "../../context/authContext";
import { TUser } from "../../utils/types";
import { useEffect, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  TReturnData,
  TReturnError,
  VendorUpdate,
  UserUpdate,
} from "../../api/api";
import { AxiosError } from "axios";
import ServerError from "../../components/common/ServerError";
export default function AccountInfoTab({
  entityType,
}: {
  entityType: "vendor" | "user";
}) {
  const { isLoaded: mapIsLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAP_API_KEY,
    libraries: ["places", "visualization"],
  });
  const { authState } = useAuth();

  if (mapIsLoaded) {
    if (entityType === "vendor" && authState.vendor)
      return <DisplayForm entity={authState.vendor} entityType="vendor" />;
    else if (entityType === "user" && authState.user)
      return <DisplayForm entity={authState.user} entityType="user" />;
  }
  return <div>Loading</div>;
}

function DisplayForm({
  entity,
  entityType,
}: {
  entity: TUser;
  entityType: "vendor" | "user";
}) {
  const { dispatch } = useAuth();
  const form = useForm({
    initialValues: {
      name: entity.name,
      email: entity.email,
      address: entity.address,
    },
  });

  const {
    isLoading: updateLoading,
    error: updateError,
    mutate: updateVendor,
    data: updateData,
  } = useMutation<TReturnData<TUser>, AxiosError<TReturnError>>({
    mutationFn: () =>
      entityType === "vendor"
        ? VendorUpdate({
            name: form.values.name,
            email: form.values.email,
            address: form.values.address,
          })
        : UserUpdate({
            name: form.values.name,
            email: form.values.email,
            address: form.values.address,
          }),
  });
  const googleAddressRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (updateData) {
      if (entityType === "vendor")
        dispatch({
          type: "setMe",
          payload: { vendor: updateData.data, user: undefined },
        });
      else if (entityType === "user") {
        dispatch({
          type: "setMe",
          payload: { user: updateData.data, vendor: undefined },
        });
      }
    }
  }, [updateData]);

  return (
    <div>
      {updateError && updateError.response && updateError.response.data && (
        <ServerError message={updateError.response.data.message || ""} />
      )}
      <form
        onSubmit={form.onSubmit((values) => {
          if (googleAddressRef.current)
            form.values.address = googleAddressRef.current.value;
          updateVendor();
        })}
      >
        <Paper p="xl" withBorder shadow="sm">
          <div className="pt-1">
            <TextInput
              label="Name"
              placeholder="Enter Your Name"
              {...form.getInputProps("name")}
            />
          </div>
          <div className="mt-3">
            <TextInput
              type="email"
              label="Email"
              placeholder="Enter Your Email"
              {...form.getInputProps("email")}
            />
          </div>

          <div className="mt-3">
            <Autocomplete>
              <TextInput
                ref={googleAddressRef}
                label="Address"
                placeholder="Enter Your Address"
                {...form.getInputProps("address")}
              />
            </Autocomplete>
          </div>
          <div className="mt-3">
            <Button loading={updateLoading} type="submit" fullWidth>
              Update Profile
            </Button>
          </div>
        </Paper>
      </form>
    </div>
  );
}
