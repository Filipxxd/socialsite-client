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
  Title,
  Flex,
  Divider,
  Box,
} from "@mantine/core";
import { FiCheck, FiMessageSquare, FiSend, FiUserPlus } from "react-icons/fi";
import { getUserProfile, UserProfileResponse } from "../../_api/users.api.ts";
import { showErrorToast, showSuccessToast } from "../../_helpers/toasts.helper.ts";
import { HomeRoute } from "../../_constants/routes.constants.ts";
import { useAuth } from "../../_auth/AuthContext.tsx";
import { getPathOrNull } from "../../_helpers/file.helper.ts";
import { FriendState, revokeFriendRequest, sendFriendRequest } from "../../_api/friends.api.ts";
import PostsList from "../posts/PostList.tsx";

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
          <Button
            variant="outline"
            color="green"
            leftSection={<FiCheck />}
            disabled
          >
            Friends
          </Button>
        );
      case FriendState.CanSendRequest:
        return (
          <Button
            onClick={() => handleAddFriend(user.userId)}
            color="blue"
            leftSection={<FiUserPlus />}
          >
            Add as Friend
          </Button>
        );
      case FriendState.RequestSent:
        return (
          <Button
            variant="outline"
            color="gray"
            leftSection={<FiSend />}
            onClick={() => handleRevokeFriendRequest(user?.userId)}
          >
            Request Sent
          </Button>
        );
      case FriendState.RequestReceived:
        return (
          <Button variant="outline" color="green" leftSection={<FiSend />} >
            Accept Request
          </Button>
        );
      default:
        return null;
    }
  };

  return (
    <Container size="sm" p="md">
      <Card shadow="lg" padding="lg" radius="md" withBorder>
        <Stack p="lg">
          <Flex p="sm">
            <Avatar
              src={getPathOrNull(user.profilePicturePath)}
              alt={user.fullname}
              size="xl"
              radius="xl"
            />
            <Flex direction="column"
                  justify="flex-start"
                  align="start"
                  px="md">
              <Title order={2}>{user.fullname}</Title>
              {user.bio && (
                <Box py="xs">
                  <Text size="sm" c="dimmed">{user.bio}</Text>
                </Box>
              )}
            </Flex>
          </Flex>

          <Divider />
          <Flex justify="center" align="center" gap="md">
            <Button
              leftSection={<FiMessageSquare />}
              onClick={() => handleChat(user.userId)}
            >
              Chat Now
            </Button>
            {renderFriendButton()}
          </Flex>
        </Stack>

      </Card>
        <PostsList userId={user.userId} onlyCurrentUser={false} />
    </Container>
  );
}

export default UserProfile;