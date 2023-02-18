import PageHeader from "../../../partials/PageHeader";
import { PasswordInput, TextInput, Button, Paper } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import ALink from "../../../components/common/ALink";
import RegisterSchema from "../../../models/auth/register";
import { useMutation } from "@tanstack/react-query";
import { TReturnData, TReturnError, UserRegister } from "../../../api/api";
import { useAuth } from "../../../context/authContext";
import { Navigate } from "react-router-dom";
import { TUser } from "../../../utils/types";
import ServerError from "../../../components/common/ServerError";
import { AxiosError } from "axios";

export default function Register() {
  const form = useForm({
    initialValues: {
      name: "",
      password: "",
      confirmPassword: "",
      email: "",
      address: "",
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
      UserRegister({
        email: form.values.email,
        name: form.values.name,
        password: form.values.password,
      }),
  });

  if (authState.authenticated === true) {
    return <Navigate to="/" />;
  } else if (registerSuccess === true) {
    return <Navigate to="/login" />;
  }

  return (
    <>
      <PageHeader title="Register" />
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
              onClick={form.onSubmit((values) => {
                mutateRegister();
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
                  label="Address"
                  placeholder="Enter your Address"
                  {...form.getInputProps("address")}
                />
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
