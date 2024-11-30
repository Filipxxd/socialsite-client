import {
  Container,
  Title,
  TextInput,
  PasswordInput,
  Button,
  Group, Checkbox
} from "@mantine/core";
import { useEffect } from "react";
import { useForm } from "@mantine/form";
import { useNavigate } from "react-router-dom";
import { login as loginUser, LoginRequest } from "./api";
import { HomeRoute } from "../../_constants/routes.constants";
import { showNotification } from "@mantine/notifications";
import { useAuth } from "../../shared/auth/AuthContext";

export default function Login() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated)
      navigate(HomeRoute);
  });

  const form = useForm<LoginRequest>({
    initialValues: {
      username: "",
      password: "",
      rememberMe: false,
    },

    validate: {
      username: (value) => value.length > 0 ? null : "Username must be supplied",
      password: (value) => value.length > 0 ? null : "Password must be supplied",
    },
  });

  const handleSubmit = async (values: LoginRequest) => {
    try {
      const response = await loginUser(values);

      if (response.status !== 200) {
        showNotification({
          title: "Error",
          message: "Invalid Credentials",
          color: "red",
        });
        return;
      }

      login(response.data.accessToken, response.data.refreshToken);
      showNotification({
        title: "Login Successful",
        message: "Welcome!",
        color: "teal",
      });
      navigate(HomeRoute);

    } catch {
      showNotification({
        title: "Error",
        message: "An error occurred during the login process",
        color: "red",
      });
    }
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
        <Checkbox label="Remember me" {...form.getInputProps("rememberMe", { type: 'checkbox' })} />
        <Group mt="md">
          <Button type="submit">Sign in</Button>
        </Group>
      </form>
    </Container>
  );
}