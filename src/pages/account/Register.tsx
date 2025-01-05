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
import { useEffect, useState } from "react";
import {
  czechAlphabetRegex,
  alphabetNumberRegex,
  passwordRegex,
} from "../../_constants/regex.constants.ts";
import { register, RegisterRequest } from "../../_api/account.api.ts";
import { useAuth } from "../../_auth/AuthContext.tsx";
import { HomeRoute, LoginRoute } from "../../_constants/routes.constants.ts";
import { showErrorToast, showSuccessToast } from "../../_helpers/toasts.helper.ts";
import { checkUsernameAvailability } from "../../_api/users.api.ts";

export default function Register() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [ isSubmitting, setIsSubmitting ] = useState(false);

  const form = useForm<RegisterRequest>({
    initialValues: {
      username: "",
      firstname: "",
      lastname: "",
      password: "",
      passwordConfirm: "",
    },

    validate: {
      username: (value) => {
        if (value.length < 6)
          return "Username must be at least 6 characters long";

        if (!alphabetNumberRegex.test(value))
          return "Firstname must contain only characters";

        return null;
      },
      firstname: (value) => czechAlphabetRegex.test(value)
          ? null
          : "Firstname must contain only characters",
      lastname: (value) => czechAlphabetRegex.test(value)
          ? null
          : "Lastname must contain only characters",
      password: (value) => passwordRegex.test(value)
          ? null
          : "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character",
      passwordConfirm: (value, values) => value !== values.password
          ? "Passwords do not match" : null,
    },
  });

  useEffect(() => {
    if (isAuthenticated)
      navigate(HomeRoute);
  });

  const handleSubmit = async (values: RegisterRequest) => {
    setIsSubmitting(true);

    const res = await checkUsernameAvailability(values.username);

    if (!res.data.isAvailable) {
      showErrorToast("Username is already taken");
      setIsSubmitting(false);
      return;
    }

    await register(values)
      .then(() => {
        showSuccessToast("You can now log in");
        navigate(LoginRoute);
      })
      .catch(() => {
        showErrorToast();
      });

    setIsSubmitting(false);
  };

  return (
    <Container size={400}>
      <Title order={3} mb="lg">
        Sign up
      </Title>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput label="Username" {...form.getInputProps("username")} />
        <TextInput label="Firstname" {...form.getInputProps("firstname")} />
        <TextInput label="Lastname" {...form.getInputProps("lastname")} />
        <PasswordInput
          label="Password"
          mt="md"
          {...form.getInputProps("password")}
        />
        <PasswordInput
          label="Confirm Password"
          {...form.getInputProps("passwordConfirm")}
        />
        <Group mt="md">
          <Button
            type="submit"
            loading={isSubmitting}
            fullWidth
          >
            Sign up
          </Button>
        </Group>
      </form>
    </Container>
  );
}
