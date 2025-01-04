import { Dispatch, SetStateAction } from "react";
import { Card, Stack, Group, Button, Text, Avatar, Flex, Box, ScrollArea } from "@mantine/core";
import { resolveFriendRequest, FriendRequestResponse } from "../api.ts";
import { getPathOrNull } from "../../../_helpers/file.helper.ts";
import { showErrorToast, showSuccessToast } from "../../../_helpers/toasts.helper.ts";
import NoDataFound from "../../../shared/NoDataFound.tsx";
import { FaCheck, FaXmark } from "react-icons/fa6";

type FriendRequestsListProps = {
  friendRequests: FriendRequestResponse[];
  onAccepted: () => Promise<void>;
  setRequests: Dispatch<SetStateAction<FriendRequestResponse[]>>;
}

export default function FriendRequestsList({ onAccepted, friendRequests, setRequests }: FriendRequestsListProps) {
  const handleRequestResolve = async (requestId: number, isAccept: boolean) => {
    await resolveFriendRequest({ friendRequestId: requestId, isAccept: isAccept })
      .then(async () => {
        if (isAccept) await onAccepted();
        setRequests((currentRequests) =>
          currentRequests.filter((request) => request.friendRequestId !== requestId)
        );
        showSuccessToast(`Friend request ${isAccept ? "accepted" : "rejected"} successfully`);
      }).catch(() => showErrorToast());
  };

  return (
    <Box>
      <Stack p="xs">
        <ScrollArea h={500}>
          {friendRequests.length === 0 ? (
            <NoDataFound title="No Friend Requests" message="You have no friend requests at the moment." />
          ) : (
            friendRequests.map((request) => (
              <Card key={request.friendRequestId} shadow="md" padding="md" withBorder>
                <Flex justify="space-between" align="center">
                  <Group>
                    <Avatar
                      src={getPathOrNull(request.profilePicturePath)}
                      alt={request.senderFullname}
                      size="lg"
                      radius="xl"
                    />
                    <div>
                      <Text>{request.senderFullname}</Text>
                    </div>
                  </Group>
                  <Group>
                    <Button size="xs" onClick={() => handleRequestResolve(request.friendRequestId, true)}>
                      <FaCheck size={18} />
                    </Button>
                    <Button size="xs" variant="outline" color="red" onClick={() => handleRequestResolve(request.friendRequestId, false)}>
                      <FaXmark size={20} />
                    </Button>
                  </Group>
                </Flex>
              </Card>
            ))
          )}
        </ScrollArea>
      </Stack>
    </Box>
  );
}