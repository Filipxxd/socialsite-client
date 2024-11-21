import { useMantineTheme } from "@mantine/core";
import { Paper, Text } from "@mantine/core";

type ChatMessageProps = {
  message: string;
  fromUser: boolean;
  timestamp: string;
}

export default function ChatMessage({
  message,
  fromUser,
  timestamp,
}: ChatMessageProps) {
  const theme = useMantineTheme();
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: fromUser ? "flex-end" : "flex-start",
        marginBottom: "1rem",
      }}
    >
      <Paper
        shadow="sm"
        p="md"
        radius="md"
        bg={fromUser ? theme.colors.myColor[5] : "lightgrey"}
        style={{
          color: fromUser ? "white" : "black",
          maxWidth: "70%",
        }}
      >
        <Text>{message}</Text>
      </Paper>
      <Text size="xs" c="gray" style={{ marginTop: "0.2rem" }}>
        {timestamp}
      </Text>
    </div>
  );
}
