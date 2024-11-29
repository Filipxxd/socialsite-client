import React from "react";
import { List } from "@mantine/core";
import FriendItem from "./FriendItem";
import { FriendResponse } from "../api";

type FriendListProps = {
  friends: FriendResponse[];
  onRemoveFriend: (friendId: number) => void;
};

const FriendList: React.FC<FriendListProps> = ({ friends, onRemoveFriend }) => {
  return (
    <List>
      {friends.map((friend) => (
        <FriendItem
          key={friend.friendId}
          friend={friend}
          onRemove={() => onRemoveFriend(friend.friendId)}
        />
      ))}
    </List>
  );
};

export default FriendList;