import PageHeader from "../../partials/PageHeader";
import { PasswordInput, TextInput, Button } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import ALink from "../../components/common/ALink";
import RegisterSchema from "../../models/auth/register";

export default function Register() {
  const form = useForm({
    initialValues: {
      name: "",
      password: "",
      confirmPassword: "",
      email: "",
    },
    validate: zodResolver(RegisterSchema),
  });

  return (
    <>
      <PageHeader title="Register" />
      <div className="card d-flex justify-content-center align-items-center p-5 m-5 mx-auto">
        <form
          onClick={form.onSubmit((values) => {
            console.log(values);
          })}
          className="w-50"
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
          <Button type="submit" fullWidth className="mb-4">
            Register
          </Button>
          <div className="text-center">
            <p>
              Already a member? <ALink href="/login">Login</ALink>
            </p>
          </div>
        </form>
      </div>
    </>
  );
}
