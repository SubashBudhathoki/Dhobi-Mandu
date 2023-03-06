import { useForm } from "@mantine/form";
import { TextInput, Paper, Button, Flex } from "@mantine/core";
import { useJsApiLoader, Autocomplete } from "@react-google-maps/api";
import { useAuth } from "../../context/authContext";
import { TUser } from "../../utils/types";
import { useEffect, useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  TReturnData,
  TReturnError,
  VendorUpdate,
  UserUpdate,
} from "../../api/api";
import { AxiosError } from "axios";
import ServerError from "../../components/common/ServerError";
import { showNotification, updateNotification } from "@mantine/notifications";
import { Check, X } from "tabler-icons-react";
import { KTM_BOUNDS } from "../../utils/constants";
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
      address_latitude: entity.address_latitude,
      address_longitude: entity.address_longitude,
      phone: entity.phone,
    },
  });

  const {
    isLoading: updateLoading,
    error: updateError,
    isSuccess: updateSuccess,
    mutate: updateEntity,
    data: updateData,
  } = useMutation<TReturnData<TUser>, AxiosError<TReturnError>>({
    mutationFn: () =>
      entityType === "vendor"
        ? VendorUpdate({
            name: form.values.name,
            email: form.values.email,
            address: form.values.address,
            address_latitude: form.values.address_latitude,
            address_longitude: form.values.address_longitude,
            phone: form.values.phone,
          })
        : UserUpdate({
            name: form.values.name,
            email: form.values.email,
            address: form.values.address,
            address_latitude: form.values.address_latitude,
            address_longitude: form.values.address_longitude,
            phone: form.values.phone,
          }),
  });
  const googleAddressRef = useRef<HTMLInputElement>(null);
  const [address, setAddress] = useState(entity.address);
  if (updateLoading) {
    showNotification({
      id: "update-account-notification",
      message: "Updating your account",
      title: "Loading",
      loading: true,
    });
  } else if (updateError) {
    updateNotification({
      id: "update-account-notification",
      message: "Error updating account",
      title: "Error",
      icon: <X />,
      color: "red",
    });
  } else if (updateSuccess) {
    updateNotification({
      id: "update-account-notification",
      message: "Account updated successfully",
      title: "Success",
      icon: <Check />,
      color: "green",
    });
  }

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
        onSubmit={form.onSubmit(async (values) => {
          if (googleAddressRef.current) {
            form.values.address = googleAddressRef.current.value;
            form.values.address = googleAddressRef.current.value;
            const geoCoder = new google.maps.Geocoder();
            const addressResult = await geoCoder.geocode({
              address: googleAddressRef.current.value,
            });
            const addressLatLng = addressResult.results[0].geometry.location;
            form.values.address_latitude = addressLatLng.lat();
            form.values.address_longitude = addressLatLng.lng();
            updateEntity();
          }
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
            <TextInput
              label="Phone Number"
              placeholder="Enter your Phone Number"
              {...form.getInputProps("phone")}
            />
          </div>

          <div className="mt-3">
            <Autocomplete bounds={KTM_BOUNDS}>
              <TextInput
                autoComplete="false"
                ref={googleAddressRef}
                label="Address"
                placeholder="Enter Your Address"
                {...form.getInputProps("address")}
                onBlur={() => {
                  if (googleAddressRef.current) {
                    form.setFieldValue(
                      "address",
                      googleAddressRef.current.value
                    );
                    setAddress(googleAddressRef.current.value);
                  }
                }}
                onChange={() => {
                  if (googleAddressRef.current) {
                    form.setFieldValue(
                      "address",
                      googleAddressRef.current.value
                    );
                    setAddress(googleAddressRef.current.value);
                  }
                }}
              />
            </Autocomplete>
          </div>
          <Flex className="d-flex mt-3" gap="xl">
            <TextInput
              disabled
              className="w-100"
              label="Latitude"
              {...form.getInputProps("address_latitude")}
            />
            <TextInput
              disabled
              className="w-100"
              label="Longitude"
              {...form.getInputProps("address_longitude")}
            />
          </Flex>
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
