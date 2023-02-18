import { TextInput, NumberInput, Textarea, Button } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useEffect } from "react";
import {
  ServiceCreate,
  ServiceUpdate,
  TReturnData,
  TReturnError,
} from "../../../api/api";
import ServiceValidation from "../../../models/service/service";
import { TSingleService } from "../../../utils/types";
import ServerError from "../../common/ServerError";

type TProp =
  | {
      type: "create";
    }
  | {
      type: "edit";
      service: TSingleService;
    };

export default function ServiceForm(
  props: TProp & {
    triggerRefresh: () => void;
    closeModal: () => void;
  }
) {
  const form = useForm({
    initialValues: {
      name: props.type === "edit" ? props.service.name : "",
      price: props.type === "edit" ? props.service.price : 0,
      description: props.type === "edit" ? props.service.description : "",
      image: props.type === "edit" ? props.service.image : "",
    },
    validate: zodResolver(ServiceValidation),
  });

  const {
    error: serviceMutateError,
    isLoading: serviceMutateLoading,
    mutate: serviceMutate,
    isSuccess: serviceMutateSuccess,
  } = useMutation<TReturnData<TSingleService>, AxiosError<TReturnError>>({
    mutationFn: () =>
      props.type === "create"
        ? ServiceCreate({
            name: form.values.name,
            price: form.values.price,
            description: form.values.description,
            image: form.values.image,
          })
        : ServiceUpdate({
            id: props.service.id,
            name: form.values.name,
            price: form.values.price,
            description: form.values.description,
            image: form.values.image,
          }),
  });

  useEffect(() => {
    if (serviceMutateSuccess) {
      props.triggerRefresh();
      props.closeModal();
    }
  }, [serviceMutateSuccess]);

  return (
    <form
      onSubmit={form.onSubmit(() => {
        serviceMutate();
      })}
    >
      {serviceMutateError &&
        serviceMutateError.response &&
        serviceMutateError.response.data && (
          <ServerError
            message={serviceMutateError.response.data.message || ""}
          />
        )}
      <div className="my-2">
        <TextInput
          label="Enter Service Name"
          placeholder="Service Name"
          {...form.getInputProps("name")}
        />
      </div>
      <div className="my-2">
        <NumberInput
          min={0}
          label="Enter Service Price"
          placeholder="Service Price"
          {...form.getInputProps("price")}
        />
      </div>
      <div className="my-2">
        <Textarea
          label="Enter Service Description"
          placeholder="Service Description"
          {...form.getInputProps("description")}
        />
      </div>
      <div className="my-2">
        <TextInput
          label="Enter Service Image URL"
          placeholder="Service Image"
          {...form.getInputProps("image")}
        />
      </div>
      <div className="mt-3">
        <Button type="submit" fullWidth>
          {props.type[0].toUpperCase() +
            props.type.toLocaleLowerCase().slice(1, props.type.length)}{" "}
          Service
        </Button>
      </div>
    </form>
  );
}
