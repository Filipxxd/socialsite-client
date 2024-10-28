import {
  Container,
  Title,
  TextInput,
  PasswordInput,
  Button,
  Group,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { register, RegisterRequest } from "./api.ts";
import {
  czechAlphabetRegex,
  alphabetNumberRegex,
  passwordRegex,
} from "../../_constants/regex.constants.tsx";

export default function Register() {
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

        return alphabetNumberRegex.test(value)
          ? null
          : "Firstname must contain only characters";
      },
      firstname: (value) => {
        return czechAlphabetRegex.test(value)
          ? null
          : "Firstname must contain only characters";
      },
      lastname: (value) => {
        return czechAlphabetRegex.test(value)
          ? null
          : "Lastname must contain only characters";
      },
      password: (value) => {
        return passwordRegex.test(value)
          ? null
          : "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character";
      },
      passwordConfirm: (value, values) => {
        if (value !== values.password) {
          return "Passwords do not match";
        }
        return null;
      },
    },
  });

  const handleSubmit = async (values: RegisterRequest) => {
    var data = await register(values);
    console.log(data);
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
          <Button type="submit">Sign up</Button>
        </Group>
      </form>
    </Container>
  );
}
