import { Alert } from "@mantine/core";
import { AlertCircle } from "tabler-icons-react";

export default function ServerError({ message }: { message: string }) {
  return (
    <Alert icon={<AlertCircle size={16} />} title="Bummer!" color="red">
      {message}
    </Alert>
  );
}
