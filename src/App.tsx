import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { RouteProvider } from "./router/Router.tsx";
import { createTheme, MantineColorsTuple } from "@mantine/core";
import Header from "./pages/header/Header";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import '@mantine/dropzone/styles.css';
import '@mantine/carousel/styles.css';
import { ModalsProvider } from "@mantine/modals";

const myColor: MantineColorsTuple = [
  "#f3edff",
  "#e0d7fa",
  "#beabf0",
  "#9a7de6",
  "#7c55de",
  "#693cd9",
  "#5f30d8",
  "#4f23c0",
  "#461eac",
  "#3b1898",
];

export const theme = createTheme({
  colors: {
    myColor,
  },
  primaryColor: "myColor",
});

export default function App() {
  return (
    <MantineProvider theme={theme}>
      <ModalsProvider>
        <RouteProvider>
          <Notifications />
          <Header />
        </RouteProvider>
      </ModalsProvider>
    </MantineProvider>
  );
}
