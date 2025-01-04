import React, { Dispatch, SetStateAction } from "react";
import { Card, Stack, Group, Text, ActionIcon, Avatar, Flex, Box, ScrollArea } from "@mantine/core";
import { removeFriend, FriendResponse } from "../../../_api/friends.api.ts";
import { useModals } from "@mantine/modals";
import { getPathOrNull } from "../../../_helpers/file.helper.ts";
import { showErrorToast, showSuccessToast } from "../../../_helpers/toasts.helper.ts";
import { formatDate } from "../../../_helpers/date.helper.ts";
import NoDataFound from "../../../shared/NoDataFound.tsx";
import { FaTrash } from "react-icons/fa6";

type FriendsListProps = {
  friends: FriendResponse[];
  setFriends: Dispatch<SetStateAction<FriendResponse[]>>;
}

const FriendsList: React.FC<FriendsListProps> = ({ friends, setFriends }) => {
  const modals = useModals();

  const openConfirmRemoveFriendModal = (friend: FriendResponse) => {
    modals.openConfirmModal({
      title: "Confirm Removal",
      children: (
        <Text>Are you sure you want to remove {friend.friendFullname} from your friends list?</Text>
      ),
      labels: { confirm: "Remove", cancel: "Cancel" },
      confirmProps: { color: "red" },
      onConfirm: () => handleRemoveFriend(friend),
    });
  };

  const handleRemoveFriend = async (friendToRemove: FriendResponse) => {
    await removeFriend(friendToRemove.friendId)
      .then(async () => {
        setFriends((currentFriends) =>
          currentFriends.filter((friend) => friend.friendId !== friendToRemove.friendId)
        );
        showSuccessToast(`Removed ${friendToRemove.friendFullname} successfully`);
      }).catch(() => showErrorToast());
  };

  return (
    <Box>
      <Stack p={"xs"}>
        <ScrollArea h={500}>
          {friends.length === 0 ? (
            <NoDataFound title="No Friends Found" message="You have no friends." />
          ) : (
            friends.map((friend) => (
              <Card key={friend.friendId} shadow="md" padding="md" withBorder>
                <Flex justify="space-between" align="center">
                  <Group>
                    <Avatar
                      src={getPathOrNull(friend.profilePicturePath)}
                      alt={friend.friendFullname}
                      size="lg"
                      radius="xl"
                    />
                    <div>
                      <Text fw={500}>{friend.friendFullname}</Text>
                      <Text size="sm" c="dimmed">
                        Friends since: {formatDate(friend.friendsSince)}
                      </Text>
                    </div>
                  </Group>
                  <ActionIcon color="red" onClick={() => openConfirmRemoveFriendModal(friend)} variant="outline">
                    <FaTrash size={13}/>
                  </ActionIcon>
                </Flex>
              </Card>
            ))
          )}
        </ScrollArea>
      </Stack>
    </Box>
  );
};

export default FriendsList;