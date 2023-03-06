import PageHeader from "../../../partials/PageHeader";
import { PasswordInput, TextInput, Button, Paper } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import ALink from "../../../components/common/ALink";
import RegisterSchema from "../../../models/auth/register";
import { useMutation } from "@tanstack/react-query";
import { TReturnData, TReturnError, VendorRegister } from "../../../api/api";
import { useAuth } from "../../../context/authContext";
import { Navigate } from "react-router-dom";
import { TUser } from "../../../utils/types";
import ServerError from "../../../components/common/ServerError";
import { AxiosError } from "axios";
import { showNotification, updateNotification } from "@mantine/notifications";
import { Check, X } from "tabler-icons-react";
import { useJsApiLoader, Autocomplete } from "@react-google-maps/api";
import { useRef } from "react";
import { KTM_BOUNDS } from "../../../utils/constants";

export default function Register() {
  const { isLoaded: mapIsLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAP_API_KEY,
    libraries: ["places", "visualization"],
  });

  if (mapIsLoaded) {
    return <DisplayForm />;
  }
  return <div>Loading</div>;
}

function DisplayForm() {
  const form = useForm({
    initialValues: {
      name: "",
      password: "",
      confirmPassword: "",
      email: "",
      address: "",
      address_latitude: 0,
      address_longitude: 0,
      phone: "",
    },
    validate: zodResolver(RegisterSchema),
  });

  const { authState } = useAuth();

  const {
    isLoading: registerLoading,
    isSuccess: registerSuccess,
    error: registerError,
    mutate: mutateRegister,
  } = useMutation<TReturnData<TUser>, AxiosError<TReturnError>>({
    mutationFn: () =>
      VendorRegister({
        email: form.values.email,
        name: form.values.name,
        password: form.values.password,
        address: form.values.address,
        address_latitude: form.values.address_latitude,
        address_longitude: form.values.address_longitude,
        phone: form.values.phone,
      }),
  });

  if (registerLoading) {
    showNotification({
      id: "register-notification",
      message: "Registration in progress",
      title: "Loading",
      loading: true,
    });
  }
  if (registerError) {
    updateNotification({
      id: "register-notification",
      message: "Error While registration",
      title: "Error",
      icon: <X />,
      color: "red",
    });
  }
  if (registerSuccess) {
    updateNotification({
      id: "register-notification",
      message: "Registration successful",
      title: "Success",
      icon: <Check />,
      color: "green",
    });
  }

  const googleAddressRef = useRef<HTMLInputElement>(null);

  if (authState.authenticated === true) {
    return <Navigate to="/" />;
  } else if (registerSuccess === true) {
    return <Navigate to="/vendor/login" />;
  }

  return (
    <>
      <PageHeader title="Vendor Register" />
      <div className="position-relative">
        <div
          className="d-flex justify-content-center align-items-center p-5 m-5 mx-auto position-relative"
          style={{
            height: "400px",
          }}
        >
          <Paper
            shadow="sm"
            className="position-absolute bg-white p-5"
            style={{
              width: "500px",
              top: "-40%",
            }}
          >
            <div className="mb-3">
              {registerError &&
                registerError.response &&
                registerError.response.data && (
                  <ServerError
                    message={registerError.response.data.message || ""}
                  />
                )}
            </div>
            <form
              onClick={form.onSubmit(async (values) => {
                if (googleAddressRef.current) {
                  form.values.address = googleAddressRef.current.value;
                  const geoCoder = new google.maps.Geocoder();
                  const addressResult = await geoCoder.geocode({
                    address: googleAddressRef.current.value,
                  });
                  const addressLatLng =
                    addressResult.results[0].geometry.location;

                  form.values.address_latitude = addressLatLng.lat();
                  form.values.address_longitude = addressLatLng.lng();
                  mutateRegister();
                }
              })}
            >
              <div className="form-outline mb-4">
                <TextInput
                  label="Name"
                  placeholder="Enter your name"
                  {...form.getInputProps("name")}
                />
              </div>
              <div className="form-outline mb-4">
                <TextInput
                  type="email"
                  label="Email"
                  placeholder="Enter your email"
                  {...form.getInputProps("email")}
                />
              </div>
              <div className="form-outline mb-4">
                <TextInput
                  label="Phone Number"
                  placeholder="Enter your Phone Number"
                  {...form.getInputProps("phone")}
                />
              </div>
              <div className="form-outline mb-4">
                <Autocomplete bounds={KTM_BOUNDS}>
                  <TextInput
                    autoComplete="false"
                    label="Address"
                    placeholder="Enter your Address"
                    ref={googleAddressRef}
                    onChange={() => {
                      if (googleAddressRef.current) {
                        form.setFieldValue(
                          "address",
                          googleAddressRef.current.value
                        );
                      }
                    }}
                  />
                </Autocomplete>
              </div>
              <div className="form-outline mb-4">
                <PasswordInput
                  label="Password"
                  placeholder="Enter Password"
                  {...form.getInputProps("password")}
                />
              </div>
              <div className="form-outline mb-4">
                <PasswordInput
                  label="Confirm Password"
                  placeholder="Re enter Password"
                  {...form.getInputProps("confirmPassword")}
                />
              </div>
              <Button
                loading={registerLoading}
                type="submit"
                fullWidth
                className="mb-4"
              >
                Register
              </Button>
              <div className="text-center">
                <p>
                  Already a member? <ALink href="/login">Login</ALink>
                </p>
              </div>
            </form>
          </Paper>
        </div>
      </div>
    </>
  );
}
