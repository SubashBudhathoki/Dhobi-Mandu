import {
  ActionIcon,
  Button,
  Flex,
  Spoiler,
  Tooltip,
  Badge,
} from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useParams } from "react-router-dom";
import { TReturnData, TReturnError, ServiceGetById } from "../../api/api";
import { useCart } from "../../context/cartContext";
import PageHeader from "../../partials/PageHeader";
import { TSingleService } from "../../utils/types";
import { Plus, Minus, Trash } from "tabler-icons-react";
import { useState } from "react";
import { useAuth } from "../../context/authContext";

export default function SingleService() {
  const { id } = useParams();
  const {
    isLoading: serviceLoading,
    data: serviceData,
    error: serviceError,
  } = useQuery<TReturnData<TSingleService>, AxiosError<TReturnError>>({
    queryKey: [`singleService-${id}`],
    queryFn: () => ServiceGetById(id as string),
  });

  if (serviceData) {
    console.log(serviceData.data);
  }

  return (
    <>
      <PageHeader title="Service Details" />
      <div className="container-fluid">
        <div className="container">
          {serviceLoading ? (
            <div>Loading...</div>
          ) : serviceData ? (
            <DisplayService service={serviceData.data} />
          ) : (
            <div>Something went wrong</div>
          )}
        </div>
      </div>
    </>
  );
}

function DisplayService({ service }: { service: TSingleService }) {
  const { dispatch, addToCart } = useCart();
  const [qty, setQty] = useState(1);
  const { authState } = useAuth();
  return (
    <div className="container-fluid py-5">
      <div className="container pt-0 pt-lg-4">
        <div className="row align-items-start">
          <div className="col-lg-5">
            <img
              style={{
                aspectRatio: "1/1.2",
                objectFit: "cover",
                objectPosition: "center",
                width: "500px",
              }}
              className="img-fluid"
              src={service.image}
              alt=""
            />
          </div>
          <div className="col-lg-7 mt-5 mt-lg-0 pl-lg-5">
            <Badge size="xl" className="mb-3">
              Price: NRS {service.price}
            </Badge>
            <h1 className="mb-4">{service.name}</h1>

            <Spoiler
              maxHeight={120}
              showLabel="Show more"
              hideLabel="hide"
              className="mb-2"
            >
              {service.description}
            </Spoiler>
            {authState.authenticated &&
              authState.user !== undefined &&
              authState.vendor === undefined && (
                <Flex gap="lg" align="center">
                  <div className="pt-3">
                    <div className="d-flex align-items-center">
                      <Button
                        onClick={() => {
                          addToCart({
                            quantity: qty,
                            service: service,
                            total: service.price * qty,
                          });
                        }}
                        variant="light"
                      >
                        Add To Cart
                      </Button>
                    </div>
                  </div>
                  <div className="pt-3">
                    <div className="d-flex align-items-center">
                      <Tooltip label="Increase Quantity">
                        <ActionIcon
                          onClick={() => {
                            setQty((pq) => pq + 1);
                          }}
                          size="sm"
                          variant="outline"
                          color="blue"
                        >
                          <Plus />
                        </ActionIcon>
                      </Tooltip>
                      <div className="mx-2">x {qty}</div>
                      <Tooltip label="Decrease Quantity">
                        <ActionIcon
                          onClick={() => {
                            setQty((pq) => {
                              const newPq = pq - 1;
                              if (newPq < 1) {
                                return 1;
                              } else return newPq;
                            });
                          }}
                          size="sm"
                          variant="outline"
                          color="blue"
                        >
                          <Minus />
                        </ActionIcon>
                      </Tooltip>
                    </div>
                  </div>
                </Flex>
              )}
          </div>
        </div>
      </div>
    </div>
  );
}
