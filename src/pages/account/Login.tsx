import {
  Container,
  Title,
  TextInput,
  PasswordInput,
  Button,
  Group, Checkbox
} from "@mantine/core";
import { useEffect, useState } from "react";
import { useForm } from "@mantine/form";
import { useNavigate } from "react-router-dom";
import { HomeRoute } from "../../_constants/routes.constants";
import { login as loginUser, LoginRequest } from "./api";
import { useAuth } from "../../shared/auth/AuthContext";
import { showErrorToast, showSuccessToast } from "../../_helpers/toasts.helper.ts";

export default function Login() {
  const { login, isAuthenticated } = useAuth();
  const [ isSubmitting, setIsSubmitting ] = useState(false);
  const navigate = useNavigate();

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

  useEffect(() => {
    if (isAuthenticated)
      navigate(HomeRoute);
  });

  const handleSubmit = async (values: LoginRequest) => {
    setIsSubmitting(true);

    await loginUser(values).then((res) => {
      login(res.data.accessToken, res.data.refreshToken);
      showSuccessToast("Successfully logged in");
      navigate(HomeRoute);
    }).catch(() => {
      showErrorToast("Invalid Credentials");
    });

    setIsSubmitting(false);
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
          <Button
            type="submit"
            loading={isSubmitting}
            fullWidth
          >
            Sign in
          </Button>
        </Group>
      </form>
    </Container>
  );
}