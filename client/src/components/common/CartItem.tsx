import {
  createStyles,
  Avatar,
  Text,
  Group,
  Paper,
  Badge,
  Flex,
  Button,
} from "@mantine/core";
import { PhoneCall, At, Trash } from "tabler-icons-react";
import { useCart } from "../../context/cartContext";
import { TCartItem } from "../../utils/types";

const useStyles = createStyles((theme) => ({
  icon: {
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[3]
        : theme.colors.gray[5],
  },

  name: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
  },
}));

interface UserInfoIconsProps {
  avatar: string;
  name: string;
  title: string;
  phone: string;
  email: string;
}

export default function CartItem({ cartItem }: { cartItem: TCartItem }) {
  const { classes } = useStyles();
  const { dispatch } = useCart();
  return (
    <Paper shadow="lg" p="lg" withBorder radius="md">
      <Flex justify="space-between">
        <Group noWrap>
          <div>
            <Text
              size="xs"
              sx={{ textTransform: "uppercase" }}
              weight={700}
              color="dimmed"
            >
              Nrs. {cartItem.service.price}
            </Text>

            <Text size="lg" weight={500} className={classes.name}>
              {cartItem.service.name}
            </Text>

            <Group noWrap spacing={10} mt={3}>
              <Text size="md" color="dimmed">
                x {cartItem.quantity}
              </Text>
            </Group>

            <Group noWrap spacing={10} mt={5}>
              <Badge color="blue" size="xl">
                Total: Nrs. {cartItem.total}
              </Badge>
            </Group>
          </div>
        </Group>
        <Button
          color={"red"}
          variant="light"
          onClick={() => {
            dispatch({
              type: "removeFromCart",
              payload: {
                itemId: cartItem.service.id,
              },
            });
          }}
        >
          <Trash size={20} />
        </Button>
      </Flex>
    </Paper>
  );
}
