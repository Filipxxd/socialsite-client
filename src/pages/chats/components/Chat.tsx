import { useMantineTheme, CloseButton } from "@mantine/core";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";

interface ChatProps {
  chatName: string;
  onClose: () => void;
}

export default function Chat({ chatName, onClose }: ChatProps) {
  const theme = useMantineTheme();

  return (
    <>
      <div
        style={{
          position: "relative",
          padding: ".7rem",
          backgroundColor: theme.colors.myColor[6],
          color: "white",
        }}
      >
        <CloseButton
          size="lg"
          variant="transparent"
          c="white"
          onClick={onClose}
          style={{
            position: "absolute",
            left: "1rem",
            top: "50%",
            transform: "translateY(-50%)",
          }}
        />

        <div
          style={{
            textAlign: "center",
          }}
        >
          {chatName}
        </div>
      </div>

      <ChatMessages />
      <ChatInput />
    </>
  );
}
