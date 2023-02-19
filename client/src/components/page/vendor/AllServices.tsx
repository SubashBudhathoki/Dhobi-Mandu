import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import {
  ServiceDelete,
  ServiceGet,
  TReturnData,
  TReturnError,
} from "../../../api/api";
import { TAllService, TSingleService } from "../../../utils/types";
import {
  Table,
  Group,
  ActionIcon,
  Tooltip,
  ScrollArea,
  Button,
  Modal,
  Flex,
} from "@mantine/core";
import { Check, Pencil, Trash, X } from "tabler-icons-react";
import { useEffect, useState } from "react";
import ServiceForm from "./ServiceForm";
import { showNotification, updateNotification } from "@mantine/notifications";
export default function AllServices() {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [refreshData, setRefreshData] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [activeService, setActiveService] = useState<TSingleService | null>(
    null
  );

  const {
    data: serviceData,
    isLoading: serviceLoading,
    refetch: serviceRefetch,
  } = useQuery<TReturnData<TAllService>, AxiosError<TReturnError>>({
    queryKey: ["all-services"],
    queryFn: () => ServiceGet(),
  });

  const {
    isSuccess: serviceDeleteSuccess,
    isLoading: serviceDeleteLoading,
    error: serviceDeleteError,
    mutate: serviceDeleteMutate,
  } = useMutation<TReturnData<{}>, AxiosError<TReturnError>>({
    mutationFn: () => {
      if (activeService) return ServiceDelete(activeService.id);
      return Promise.reject("No active service");
    },
  });

  function handleRefresh() {
    setRefreshData((p) => !p);
  }

  if (serviceDeleteLoading) {
    showNotification({
      id: "delete-service-notification",
      title: "Loading",
      message: "Deletion in progress",
      loading: true,
    });
  }
  if (serviceDeleteError) {
    updateNotification({
      id: "delete-service-notification",
      title: "Error",
      message: "Error while deleting service",
      icon: <X />,
      color: "red",
    });
  }
  if (serviceDeleteSuccess) {
    updateNotification({
      id: "delete-service-notification",
      title: "Success",
      message: "Service deleted successfully",
      icon: <Check />,
      color: "green",
    });
  }

  useEffect(() => {
    serviceRefetch();
  }, [refreshData]);

  useEffect(() => {
    if (serviceDeleteSuccess) {
      handleRefresh();
      setDeleteModalOpen(false);
    }
  }, [serviceDeleteSuccess]);

  return (
    <div>
      {serviceLoading && <>Loading all Services</>}
      {serviceData && (
        <div>
          <Button onClick={() => setCreateModalOpen(true)}>Create New</Button>
          <ScrollArea
            style={{
              height: "400px",
            }}
          >
            <Table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {serviceData.data.map((service, idx) => {
                  return (
                    <tr key={idx}>
                      <td>{service.id}</td>
                      <td>{service.name}</td>
                      <td>{service.price}</td>
                      <td>
                        <Group>
                          <Tooltip label={`Edit ${service.name}`}>
                            <ActionIcon
                              variant="light"
                              color="blue"
                              onClick={() => {
                                setActiveService(service);
                                setEditModalOpen(true);
                              }}
                            >
                              <Pencil />
                            </ActionIcon>
                          </Tooltip>
                          <Tooltip label={`Delete ${service.name}`}>
                            <ActionIcon
                              variant="light"
                              color="red"
                              onClick={() => {
                                setActiveService(service);
                                setDeleteModalOpen(true);
                              }}
                            >
                              <Trash />
                            </ActionIcon>
                          </Tooltip>
                        </Group>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </ScrollArea>
        </div>
      )}
      <Modal
        centered
        opened={createModalOpen}
        title="Create New Service"
        onClose={() => setCreateModalOpen(false)}
      >
        <ServiceForm
          type="create"
          triggerRefresh={handleRefresh}
          closeModal={() => setCreateModalOpen(false)}
        />
      </Modal>
      {activeService && (
        <>
          <Modal
            centered
            opened={editModalOpen}
            title={`Edit Service - ${activeService.name}`}
            onClose={() => setEditModalOpen(false)}
          >
            <ServiceForm
              type="edit"
              service={activeService}
              triggerRefresh={handleRefresh}
              closeModal={() => setEditModalOpen(false)}
            />
          </Modal>
          <Modal
            centered
            opened={deleteModalOpen}
            title={`Delete Service - ${activeService.name}`}
            onClose={() => setDeleteModalOpen(false)}
          >
            Are you sure to Delete this Service?
            <Flex justify="end" gap="sm">
              <Button
                loading={serviceDeleteLoading}
                onClick={() => {
                  serviceDeleteMutate();
                }}
              >
                Yes
              </Button>
              <Button
                onClick={() => {
                  setDeleteModalOpen(false);
                }}
              >
                No
              </Button>
            </Flex>
          </Modal>
        </>
      )}
    </div>
  );
}
