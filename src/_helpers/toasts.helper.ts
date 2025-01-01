import { showNotification } from "@mantine/notifications";

export const showSuccessToast = (message: string) => {
  showNotification({
    title: "Success",
    message: message,
    color: "teal",
  });
};

export const showErrorToast = (message?: string) => {
  showNotification({
    title: "Error",
    message: message ?? "Unexpected error occurred at server, please try again later.",
    color: "red",
  });
};