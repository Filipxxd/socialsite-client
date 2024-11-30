import { useState, useEffect } from "react";
import {
  Container,
  Button,
  Group,
  Text,
  Card,
  Stack,
  ActionIcon,
  Modal,
  Avatar,
  Flex,
  ScrollArea
} from "@mantine/core";
import { FaMinus } from 'react-icons/fa';
import {
  getFriends,
  removeFriend,
  getFriendRequests,
  FriendResponse,
  FriendRequestResponse,
  resolveFriendRequest
} from "./api.ts";
import FriendRequestsModal from "./components/FriendRequestsModal";

const Friends = () => {
  const [friends, setFriends] = useState<FriendResponse[]>([]);
  const [friendRequests, setFriendRequests] = useState<FriendRequestResponse[]>([]);
  const [requestsModalOpen, setRequestsModalOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [friendToDelete, setFriendToDelete] = useState<FriendResponse | null>(null);

  const fetchFriends = async () => {
    const response = await getFriends();
    if (response.status === 200) {
      setFriends(response.data);
    }
  };

  const fetchFriendRequests = async () => {
    const response = await getFriendRequests();
    if (response.status === 200) {
      setFriendRequests(response.data);
    }
  };

  useEffect(() => {
    fetchFriends();
    fetchFriendRequests();
  }, []);

  const promptRemoveFriend = (friend: FriendResponse) => {
    setFriendToDelete(friend);
    setDeleteConfirmOpen(true);
  };

  const handleRemoveFriend = async () => {
    if (friendToDelete) {
      const response = await removeFriend(friendToDelete.friendId);
      if (response.status === 204) {
        setFriends((currentFriends) =>
          currentFriends.filter((friend) => friend.friendId !== friendToDelete.friendId)
        );
        setDeleteConfirmOpen(false);
        setFriendToDelete(null);
      }
    }
  };

  const handleRequestResolve = async (requestId: number, accept: boolean) => {
    const response = await resolveFriendRequest({ friendRequestId: requestId, accept });
    if (response.status === 204) {
      if (accept) {
        await fetchFriends();
      }
      setFriendRequests((currentRequests) =>
        currentRequests.filter((request) => request.friendRequestId !== requestId)
      );
    }
  };

  return (
    <Container>
      <Button onClick={() => setRequestsModalOpen(true)}>
        Friend Requests
      </Button>
      <FriendRequestsModal
        opened={requestsModalOpen}
        onClose={() => setRequestsModalOpen(false)}
        friendRequests={friendRequests}
        handleRequestResolve={handleRequestResolve}
      />

      <ScrollArea h="70vh">
        <Stack mt="lg">
          {friends.map((friend) => (
            <Card key={friend.friendId} shadow="sm" padding="lg">
              <Flex justify="space-between" align="center" w="100%">
                <Group>
                  <Avatar
                    src={"https://xsgames.co/randomusers/avatar.php"}
                    alt={friend.friendFullname}
                    size="lg"
                    radius="xl"
                  />
                  <div>
                    <Text fw={500}>{friend.friendFullname}</Text>
                    <Text size="sm" c="dimmed">
                      Friends since: {new Date(friend.friendsSince).toLocaleDateString()}
                    </Text>
                  </div>
                </Group>
                <ActionIcon onClick={() => promptRemoveFriend(friend)}>
                  <FaMinus size={18} />
                </ActionIcon>
              </Flex>
            </Card>
          ))}
        </Stack>
      </ScrollArea>

      <Modal
        opened={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        title="Confirm Removal"
      >
        <Text>Are you sure you want to remove {friendToDelete?.friendFullname} from your friends list?</Text>
        <Group mt="md" p="right">
          <Button variant="default" onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
          <Button color="red" onClick={handleRemoveFriend}>Remove</Button>
        </Group>
      </Modal>
    </Container>
  );
};

export default Friends;