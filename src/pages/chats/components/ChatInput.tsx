import { TextInput, Button, useMantineTheme } from "@mantine/core";

export default function ChatInput() {
  const theme = useMantineTheme();

  return (
    <div
      style={{
        position: "sticky",
        bottom: 0,
        backgroundColor: "white",
        padding: "1rem",
        display: "flex",
      }}
    >
      <div
        style={{
          margin: "0 .25rem",
          display: "flex",
          cursor: "pointer",
          alignItems: "center",
          color: theme.colors.myColor[7],
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" />
          <path d="M9 12h6" />
          <path d="M12 9v6" />
        </svg>
      </div>

      <TextInput
        placeholder="Type a message"
        style={{ flexGrow: 1, marginRight: "0.5rem" }}
      />
      <Button type="submit">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M10 14l11 -11" />
          <path d="M21 3l-6.5 18a.55 .55 0 0 1 -1 0l-3.5 -7l-7 -3.5a.55 .55 0 0 1 0 -1l18 -6.5" />
        </svg>
      </Button>
    </div>
  );
}
