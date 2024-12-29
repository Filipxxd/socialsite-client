import React from "react";
import { Avatar, Group, Text, Button } from "@mantine/core";
import { FriendResponse } from "../api";
import { API_BASE_URL } from "../../../_constants/api.constants.ts";

type FriendItemProps = {
  friend: FriendResponse;
  onRemove: () => void;
};

const FriendItem: React.FC<FriendItemProps> = ({ friend, onRemove }) => {
  return (
    <Group style={{ justifyContent: "space-between", alignItems: "center" }}>
      <Group>
        <Avatar src={API_BASE_URL + friend.profilePicturePath} alt={friend.friendFullname} />
        <Text>{friend.friendFullname}</Text>
      </Group>
      <Button variant="subtle" color="red" onClick={onRemove}>
        Remove
      </Button>
    </Group>
  );
};

export default FriendItem;