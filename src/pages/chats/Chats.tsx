import {
  Container,
  Grid,
  Group,
  Card,
  Avatar,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { useState, useEffect } from "react";
import Chat from "./components/Chat.tsx";
import { getChats, ChatResponse } from "./api.tsx";

const Chats = () => {
  const [selectedChat, setSelectedChat] = useState<ChatResponse | null>(null);
  const [chats, setChats] = useState<ChatResponse[]>([]);
  const theme = useMantineTheme();

  useEffect(() => {
    const fetchChats = async () => {
      const response = await getChats();

      if(response.status !== 200)
        return;

      setChats(response.data);
    };

    fetchChats();
  }, []);

  return (
    <Container>
      {/* Desktop layout */}
      <Group visibleFrom="sm" grow>
        <Grid>
          <Grid.Col span={4}>
            {chats.map((chat, index) => (
              <Card
                key={index}
                shadow="sm"
                padding="lg"
                onClick={() => setSelectedChat(chat)}
                style={{
                  cursor: "pointer",
                  backgroundColor:
                    selectedChat === chat ? theme.colors.gray[2] : theme.white,
                }}
              >
                <Group>
                  <Avatar />
                  <Text>{chat.name}</Text>
                </Group>
              </Card>
            ))}
          </Grid.Col>
          <Grid.Col span={8}>
            {selectedChat ? (
              <Chat
                chatName={selectedChat.name}
                onClose={() => setSelectedChat(null)}
              />
            ) : (
              <div
                style={{
                  height: "70vh",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "column",
                  color: "#888",
                  backgroundColor: "#f5f5f5",
                  borderRadius: "8px",
                  padding: "2rem",
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="48"
                  viewBox="0 96 960 960"
                  width="48"
                  fill="#ccc"
                >
                  <path d="M480 936q-156 0-263-107T110 566q0-156 107-263T480 196q156 0 263 107t107 263q0 156-107 263T480 936Zm0-60q132 0 226-94t94-226q0-132-94-226T480 236q-132 0-226 94t-94 226q0 132 94 226t226 94Zm0-340Zm-70-47 70 70 70-70q11-11 27-11t28 12q12 11 12 28t-12 28l-70 70 70 70q11 11 11.5 27t-11.5 28q-11 12-28 12t-28-12l-70-70-70 70q-11 11-27 11.5T384 752q-12-11-12-28t12-28l70-70-70-70q-11-11-11.5-27t11.5-28q11-12 28-12t28 12Z" />
                </svg>
                <h3 style={{ marginTop: "1rem", fontSize: "1.5rem" }}>
                  No chat selected
                </h3>
                <p style={{ color: "#aaa" }}>
                  Please select a chat to start messaging.
                </p>
              </div>
            )}
          </Grid.Col>
        </Grid>
      </Group>

      {/* Mobile layout */}
      <Group hiddenFrom="sm">
        <div style={{ width: "100%" }}>
          {selectedChat ? (
            <Chat
              chatName={selectedChat.name}
              onClose={() => setSelectedChat(null)}
            />
          ) : (
            <>
              {chats.map((chat, index) => (
                <Card
                  w="100%"
                  key={index}
                  shadow="sm"
                  padding="lg"
                  onClick={() => setSelectedChat(chat)}
                  style={{
                    cursor: "pointer",
                    backgroundColor: theme.white,
                  }}
                >
                  <Group>
                    <Avatar />
                    <Text>{chat.name}</Text>
                  </Group>
                </Card>
              ))}
            </>
          )}
        </div>
      </Group>
    </Container>
  );
};

export default Chats;
