import { useEffect, useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import {
  Avatar,
  Button,
  Card,
  Text,
  Container,
  Loader,
  Stack,
  Group,
  Title,
  Tooltip, Flex
} from "@mantine/core";
import { FiCheck, FiMessageSquare, FiSend, FiUserPlus } from "react-icons/fi";
import {
  FriendState,
  getUserProfile,
  UserProfileResponse,
  sendFriendRequest,
  revokeFriendRequest,
} from "./api";
import { showErrorToast, showSuccessToast } from "../../_helpers/toasts.helper.ts";
import { HomeRoute } from "../../_constants/routes.constants.ts";
import { useAuth } from "../../_auth/AuthContext.tsx";
import { getPathOrNull } from "../../_helpers/file.helper.ts";

function UserProfile() {
  const { username } = useParams();
  const { username: currentUserName } = useAuth();
  const navigate = useNavigate();
  const [user, setUser] = useState<UserProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      if (!username || username === currentUserName) {
        navigate(HomeRoute);
        return;
      }
      await getUserProfile(username)
        .then(response => setUser(response.data))
        .catch(() => showErrorToast("Failed to fetch user data"));
      setLoading(false);
    };
    void fetchUserData();
  }, [username, navigate, currentUserName]);

  if (loading) return <Loader size="lg" />;
  if (!user) return <Text size="lg" c="red">User not found.</Text>;

  const handleChat = (userId: number) => {
    console.log('Starting chat with:', userId);
  };

  const handleRevokeFriendRequest = async (userId: number) => {
    await revokeFriendRequest(userId).then(() => {
      setUser(prevUser => prevUser ? { ...prevUser, friendState: FriendState.CanSendRequest } : null);
      showSuccessToast("Request revoked");
    }).catch(() => showErrorToast());
  };

  const handleAddFriend = async (userId: number) => {
    await sendFriendRequest(userId)
      .then(() => {
        setUser(prevUser => prevUser ? { ...prevUser, friendState: FriendState.RequestSent } : null);
        showSuccessToast("Friend request sent");
      }).catch(() => {
        setUser(prevUser => prevUser ? { ...prevUser, friendState: FriendState.CanSendRequest } : null);
        showErrorToast();
      });
  };

  const renderFriendButton = () => {
    switch (user.friendState) {
      case FriendState.Friends:
        return (
          <Text>
            <FiCheck size={20} style={{ marginRight: 8 }} />
            Friends
          </Text>
        );
      case FriendState.CanSendRequest:
        return (
          <Button onClick={() => handleAddFriend(user.userId)} color="green">
            <FiUserPlus size={20} style={{ marginRight: 8 }} />
            Add as Friend
          </Button>
        );
      case FriendState.CannotSendRequest:
        return (
          <Tooltip label="Can't add as friend" position="top" withArrow>
            <Button color="gray" disabled>
              <FiUserPlus size={20} style={{ marginRight: 8 }} />
              Add as Friend
            </Button>
          </Tooltip>
        );
      case FriendState.RequestSent:
        return (
          <Text>
            <FiSend size={20} style={{ marginRight: 8 }} onClick={() => handleRevokeFriendRequest(user?.userId)} />
            Request Sent
          </Text>
        );
      case FriendState.RequestReceived:
        return (
          <Text>
            <FiSend size={20} style={{ marginRight: 8 }} />
            Request Received
          </Text>
        );
      default:
        return null;
    }
  };

  return (
    <Container size="sm" p="md">
      <Card shadow="lg" padding="xl" radius={1}>
        <Stack>
          <Group align="center">
            <Avatar
              src={getPathOrNull(user.profilePicturePath)}
              alt={user.fullname}
              size="xl"
              radius="lg"
            />
            <Title order={2}>{user.fullname}</Title>
          </Group>

          <Flex align="center" justify={"space-around"}>
            <Button
              leftSection={<FiMessageSquare size={20} />}
              onClick={() => handleChat(user.userId)}>
              Chat Now
            </Button>
            {renderFriendButton()}
          </Flex>

          {user.bio && <Text size="sm" c={"dimmed"}>{user.bio}</Text>}
        </Stack>
      </Card>
    </Container>
  );
}

export default UserProfile;