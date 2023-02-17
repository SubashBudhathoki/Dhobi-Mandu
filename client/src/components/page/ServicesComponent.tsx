import { useQuery } from "@tanstack/react-query";
import { ProductGet, TReturnData, TReturnError } from "../../api/api";
import { TAllService, TSingleService } from "../../utils/types";
import ServiceSkeleton from "../Skeleton/ServiceSkeleton";
import { Card, Image, Text, Badge, Button, Group } from "@mantine/core";
import { useCart } from "../../context/cartContext";

export default function Services() {
  const {
    data: serviceData,
    isLoading: serviceLoading,
    error: serviceError,
  } = useQuery<TReturnData<TAllService>, TReturnError>({
    queryKey: ["all-services"],
    queryFn: () => ProductGet(),
  });

  return (
    <div className="container-fluid pt-5 pb-3">
      <div className="container">
        <h6 className="text-secondary text-uppercase text-center font-weight-medium mb-3">
          Our Services
        </h6>
        <h1 className="display-4 text-center mb-5">What We Offer</h1>

        {serviceLoading && (
          <div className="row">
            {[1, 2, 3, 4].map((_) => (
              <div key={`skeleton-${_}`} className="col-md-3">
                <ServiceSkeleton />
              </div>
            ))}
          </div>
        )}
        {serviceData && (
          <div className="row">
            {serviceData.data.length <= 0 ? (
              <div className="col-12">
                <h1 className="text-center">No Service Found</h1>
              </div>
            ) : (
              serviceData.data.map((service, idx) => (
                <div
                  key={`service-${service.id}-${idx}}`}
                  className="col-lg-4 col-md-6 mb-5"
                >
                  <SingleServiceCart service={service} />
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function SingleServiceCart({ service }: { service: TSingleService }) {
  const { dispatch } = useCart();
  return (
    <Card
      style={{
        maxWidth: "300px",
      }}
      shadow="sm"
      p="lg"
      radius="md"
      withBorder
    >
      <Card.Section>
        <Image
          src="https://images.unsplash.com/photo-1527004013197-933c4bb611b3?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=720&q=80"
          height={160}
          alt="Norway"
        />
      </Card.Section>

      <Group position="apart" mt="md" mb="xs">
        <Text weight={500}>{service.name}</Text>
        <Badge color="pink" variant="light">
          Nrs. {service.price}
        </Badge>
      </Group>

      <Text size="sm" color="dimmed">
        {service.description.length > 130
          ? service.description.slice(0, 127) + "..."
          : service.description}
      </Text>

      <Button
        onClick={() => {
          dispatch({
            type: "addToCart",
            payload: {
              quantity: 1,
              service: service,
              total: 1 * service.price,
            },
          });
        }}
        variant="light"
        color="blue"
        fullWidth
        mt="md"
        radius="md"
      >
        Add to Cart
      </Button>
    </Card>
  );
}
