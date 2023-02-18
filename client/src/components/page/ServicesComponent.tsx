import { useQuery } from "@tanstack/react-query";
import { ServiceGet, TReturnData, TReturnError } from "../../api/api";
import { TAllService, TSingleService } from "../../utils/types";
import ServiceSkeleton from "../Skeleton/ServiceSkeleton";
import { Card, Image, Text, Badge, Button, Group, Flex } from "@mantine/core";
import { useCart } from "../../context/cartContext";
import ALink from "../common/ALink";
import { useAuth } from "../../context/authContext";
import { AxiosError } from "axios";

export default function Services({
  dataLength,
}: {
  dataLength: number | "FULL";
}) {
  const {
    data: serviceData,
    isLoading: serviceLoading,
    error: serviceError,
  } = useQuery<TReturnData<TAllService>, AxiosError<TReturnError>>({
    queryKey: ["all-services"],
    queryFn: () => ServiceGet(),
  });

  return (
    <div className="container-fluid pt-5">
      <div className="container">
        <h6 className="text-secondary text-uppercase text-center font-weight-medium mb-3">
          Our Services
        </h6>
        <h1 className="display-4 text-center mb-5">What We Offer</h1>

        {dataLength !== "FULL" && (
          <div className="d-flex justify-content-center mb-3">
            <ALink href="/service">
              <Button size="xs" variant="light">
                View All
              </Button>
            </ALink>
          </div>
        )}

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
            {serviceData.data.length <= 0 && (
              <div className="col-12">
                <h1 className="text-center">No Service Found</h1>
              </div>
            )}
            {dataLength === "FULL" &&
              serviceData.data.map((service, idx) => (
                <div
                  key={`service-${service.id}-${idx}}`}
                  className="col-lg-4 col-md-6 mb-5"
                >
                  <SingleServiceCart service={service} />
                </div>
              ))}
            {dataLength !== "FULL" &&
              serviceData.data.slice(0, dataLength).map((service, idx) => (
                <div
                  key={`service-${service.id}-${idx}}`}
                  className="col-lg-4 col-md-6 mb-5"
                >
                  <SingleServiceCart service={service} />
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}

function SingleServiceCart({ service }: { service: TSingleService }) {
  const { dispatch } = useCart();
  const { authState } = useAuth();
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
        <Image src={service.image} height={160} alt="Norway" />
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

      <Flex gap="md">
        {authState.authenticated &&
          authState.vendor === undefined &&
          authState.user !== undefined && (
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
          )}
        <ALink href={`/service/${service.id}`}>
          <Button variant="light" color="blue" fullWidth mt="md" radius="md">
            View More
          </Button>
        </ALink>
      </Flex>
    </Card>
  );
}
