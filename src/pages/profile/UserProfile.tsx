import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
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
  Tooltip,
} from "@mantine/core";
import { FiCheck, FiMessageSquare, FiSend, FiUserPlus } from "react-icons/fi";
import { FriendState, getUserProfile, UserProfileResponse, sendFriendRequest, revokeFriendRequest } from "./api";
import { showNotification } from "@mantine/notifications";
import { API_BASE_URL } from "../../_constants/api.constants.ts";

function UserProfile() {
  const { username } = useParams();
  const [user, setUser] = useState<UserProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!username) return Promise.reject("Username is not supplied");
        const response = await getUserProfile(username);
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [username]);

  if (loading) {
    return <Loader size="lg" />;
  }

  if (!user) {
    return <Text size="lg" color="red">User not found.</Text>;
  }

  const handleChat = (userId: number) => {
    console.log('Starting chat with:', userId);
  };

  const handleRevokeFriendRequest = async (userId: number) => {
      const response = await revokeFriendRequest(userId);
      if (response.status === 204) {
        setUser(prevUser => prevUser ? { ...prevUser, friendState: FriendState.CanSendRequest } : null);
        showNotification({
          title: "Success",
          message: "Request revoked!",
          color: "green",
        });
      } else {
        showNotification({
          title: "Error",
          message: "An error has occurred!",
          color: "red",
        });
      }
  };

  const handleAddFriend = async (userId: number) => {
      const response = await sendFriendRequest(userId);
      if (response.status === 204) {
        setUser(prevUser => prevUser ? { ...prevUser, friendState: FriendState.RequestSent } : null);
        showNotification({
          title: "Success",
          message: "Request sent!",
          color: "green",
        });
      } else {
        showNotification({
          title: "Error",
          message: "An error has occurred!",
          color: "red",
        });
        setUser(prevUser => prevUser ? { ...prevUser, friendState: FriendState.CanSendRequest } : null);
      }
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
          <Button onClick={() => handleAddFriend(user.userId)} color="green" fullWidth >
            <FiUserPlus size={20} style={{ marginRight: 8 }} />
            Add as Friend
          </Button>
        );
      case FriendState.CannotSendRequest:
        return (
          <Tooltip label="Can't add as friend" position="top" withArrow>
            <Button color="gray" disabled fullWidth>
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
      <Card shadow="lg" padding="xl" style={{ borderRadius: '8px', margin: '10px 0' }}>
        <Stack align="center">
          <Avatar src={API_BASE_URL + user.profilePicturePath} alt={user.fullname} size="xl" radius="lg" style={{ border: '4px solid #fff' }} />
          <Title order={2} style={{ color: '#333' }}>{user.fullname}</Title>
          <Group>
            <Button onClick={() => handleChat(user.userId)} variant="gradient" gradient={{ from: 'indigo', to: 'cyan' }} fullWidth >
              <FiMessageSquare size={20} style={{ marginRight: 8 }} />
              Chat Now
            </Button>
            {renderFriendButton()}
          </Group>
        </Stack>
      </Card>
      <Card shadow="lg" padding="xl" style={{ borderRadius: '8px', margin: '20px 0' }}>
        <Text size="xl" w={600} mb="sm">Posts</Text>
        {user.posts && user.posts.length > 0 ? (
          user.posts.map((post, index) => (
            <Card key={index} shadow="sm" withBorder style={{ margin: '10px 0' }}>
              <Text>{post.content}</Text>
            </Card>
          ))
        ) : (
          <Text>No posts available.</Text>
        )}
      </Card>
    </Container>
  );
}

export default UserProfile;