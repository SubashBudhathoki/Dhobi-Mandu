import PageHeader from "../../../partials/PageHeader";
import { PasswordInput, TextInput, Button } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import ALink from "../../../components/common/ALink";
import LoginSchema from "../../../models/auth/login";
import { useMutation, useQuery } from "@tanstack/react-query";
import { TReturnData, TReturnError, UserLogin } from "../../../api/api";
import { AxiosError } from "axios";
import ServerError from "../../../components/common/ServerError";
import { Navigate, redirect } from "react-router";
import { TUser } from "../../../utils/types";
import { useAuth } from "../../../context/authContext";
import { useEffect } from "react";

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
    mutate: fetchLogin,
  } = useMutation<
    TReturnData<{
      user: TUser;
      token: {
        accessToken: string;
      };
    }>,
    AxiosError<TReturnError>
  >({
    mutationFn: () =>
      UserLogin({
        email: form.values.email,
        password: form.values.password,
      }),
  });

  useEffect(() => {
    if (data) {
      dispatch({
        type: "login",
        payload: { user: data.data.user, vendor: undefined },
      });
    }
  }, [data]);

  if (authState.authenticated && authState.user !== undefined) {
    return <Navigate to="/" />;
  }

  return (
    <>
      <PageHeader title="Login" />
      <div className="card d-flex justify-content-center align-items-center p-5 m-5 mx-auto">
        <div className="w-50">
          {error && error.response && error.response.data && (
            <ServerError message={error.response.data.message || ""} />
          )}
          <form onSubmit={form.onSubmit(() => fetchLogin())}>
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
        </div>
      </div>
    </>
  );
}
