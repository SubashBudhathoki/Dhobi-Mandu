import PageHeader from "../../../partials/PageHeader";
import { PasswordInput, TextInput, Button, Paper } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import ALink from "../../../components/common/ALink";
import LoginSchema from "../../../models/auth/login";
import { useMutation, useQuery } from "@tanstack/react-query";
import { TReturnData, TReturnError, VendorLogin } from "../../../api/api";
import { AxiosError } from "axios";
import ServerError from "../../../components/common/ServerError";
import { Navigate, redirect } from "react-router";
import { TUser } from "../../../utils/types";
import { useAuth } from "../../../context/authContext";
import { useEffect } from "react";
import { showNotification, updateNotification } from "@mantine/notifications";
import { Check, X } from "tabler-icons-react";
export default function Login() {
  const form = useForm({
    initialValues: {
      password: "",
      email: "",
    },
    validate: zodResolver(LoginSchema),
  });

  const { authState, dispatch } = useAuth();
  const {
    data,
    isLoading,
    error,
    isSuccess,
    mutate: mutateLogin,
  } = useMutation<
    TReturnData<{
      vendor: TUser;
      token: {
        accessToken: string;
      };
    }>,
    AxiosError<TReturnError>
  >({
    mutationFn: () =>
      VendorLogin({
        email: form.values.email,
        password: form.values.password,
      }),
  });

  if (isLoading) {
    showNotification({
      id: "login-notification",
      message: "Logging You in",
      title: "Loading",
      loading: true,
    });
  }
  if (error) {
    updateNotification({
      id: "login-notification",
      message: "Error While Logging in",
      title: "Error",
      icon: <X />,
      color: "red",
    });
  }
  if (isSuccess) {
    updateNotification({
      id: "login-notification",
      message: "Logged in successfully",
      title: "Success",
      icon: <Check />,
      color: "green",
    });
  }

  useEffect(() => {
    if (data) {
      dispatch({
        type: "login",
        payload: { vendor: data.data.vendor, user: undefined },
      });
    }
  }, [data]);

  if (authState.authenticated && authState.vendor !== undefined) {
    return <Navigate to="/" />;
  }

  return (
    <>
      <PageHeader title="Vendor Login" />
      <div className="position-relative">
        <div
          className="d-flex justify-content-center align-items-center p-5 m-5 mx-auto"
          style={{
            height: "300px",
          }}
        >
          <Paper
            shadow="sm"
            className="position-absolute bg-white p-5"
            style={{
              width: "500px",
              top: "-50%",
            }}
          >
            {error && error.response && error.response.data && (
              <ServerError message={error.response.data.message || ""} />
            )}
            <form onSubmit={form.onSubmit(() => mutateLogin())}>
              <div className="form-outline mb-4">
                <TextInput
                  type="email"
                  label="Email"
                  placeholder="Enter your email"
                  {...form.getInputProps("email")}
                />
              </div>
              <div className="form-outline mb-4">
                <PasswordInput
                  label="Password"
                  placeholder="Enter Password"
                  {...form.getInputProps("password")}
                />
              </div>
              <Button
                loading={isLoading}
                type="submit"
                fullWidth
                className="mb-4"
              >
                Login
              </Button>
              <div className="text-center">
                <p>
                  Not a member? <ALink href="/register">Register</ALink>
                </p>
              </div>
            </form>
          </Paper>
        </div>
      </div>
    </>
  );
}
