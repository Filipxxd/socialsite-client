import React from "react";
import { Modal, Button, Group, Text, Stack, Card, Flex, Avatar, ScrollArea } from "@mantine/core";
import { FriendRequestResponse } from "../api";
import { API_BASE_URL } from "../../../_constants/api.constants.ts";

type FriendRequestsModalProps = {
  opened: boolean;
  onClose: () => void;
  friendRequests: FriendRequestResponse[];
  handleRequestResolve: (requestId: number, accept: boolean) => void;
};

const FriendRequestsModal: React.FC<FriendRequestsModalProps> = ({
                                                                   opened,
                                                                   onClose,
                                                                   friendRequests,
                                                                   handleRequestResolve
                                                                 }) => {
  return (
    <Modal opened={opened} onClose={onClose} title="Friend Requests">
        <ScrollArea h="70vh" min-h="70vh">
          {friendRequests.map((request) => (
              <Stack mt="lg" key={request.friendRequestId}>
                  <Card key={request.friendRequestId} shadow="sm" padding="lg">
                    <Flex justify="space-between" align="center" w="100%">
                      <Group>
                        <Avatar
                          src={API_BASE_URL + request.profilePicturePath}
                          alt={request.senderFullname}
                          size="lg"
                          radius="xl"
                        />
                        <div>
                          <Text>{request.senderFullname}</Text>
                        </div>
                      </Group>
                      <Group>
                        <Button onClick={() => handleRequestResolve(request.friendRequestId, true)}>
                          Accept
                        </Button>
                        <Button
                          variant="light"
                          color="red"
                          onClick={() => handleRequestResolve(request.friendRequestId, false)}
                        >
                          Decline
                        </Button>
                      </Group>
                    </Flex>
                  </Card>
              </Stack>
          ))}
        </ScrollArea>
    </Modal>
  );
};

export default FriendRequestsModal;