import {
  Container,
  Title,
  TextInput,
  PasswordInput,
  Button,
  Group,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useNavigate } from "react-router-dom";
import { login, LoginRequest } from "./api.ts";
import { HomeRoute } from "../../_constants/routes.constants.tsx";
import { showNotification } from "@mantine/notifications";
import { useAuth } from "../../shared/AuthContext.tsx";

export default function Login() {
  const { login: setAuthToken } = useAuth();
  const navigate = useNavigate();

  const form = useForm<LoginRequest>({
    initialValues: {
      username: "",
      password: "",
    },

    validate: {
      username: (value) =>
        value.length != 0 ? null : "Username must be supplied",
      password: (value) =>
        value.length != 0 ? null : "Password must be supplied",
    },
  });

  const handleSubmit = async (values: LoginRequest) => {
    var data = await login(values);

    setAuthToken(data.token);

    showNotification({
      title: "Login Successful",
      message: `Welcome!`,
      color: "teal",
    });

    navigate(HomeRoute);
  };

  return (
    <Container size={400}>
      <Title order={3} mb="lg">
        Sign in
      </Title>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput label="Username" {...form.getInputProps("username")} />
        <PasswordInput
          label="Password"
          mt="md"
          {...form.getInputProps("password")}
        />
        <Group mt="md">
          <Button type="submit">Sign in</Button>
        </Group>
      </form>
    </Container>
  );
}
