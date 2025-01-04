import React, { useState, useEffect } from "react";
import { Tabs, Container } from '@mantine/core';
import { LuMailQuestion } from "react-icons/lu";
import FriendsList from "./components/FriendsList.tsx";
import FriendRequestsList from "./components/FriendRequestsList.tsx";
import { FriendRequestResponse, FriendResponse, getFriendRequests, getFriends } from "../../_api/friends.api.ts";
import { FaUserFriends } from "react-icons/fa";

const Friends: React.FC = () => {
  const [friends, setFriends] = useState<FriendResponse[]>([]);
  const [requests, setRequests] = useState<FriendRequestResponse[]>([]);

  const fetchFriendRequests = async () => {
    const res = await getFriendRequests();
    setRequests(res.data);
  };

  const fetchFriends = async () => {
    const res = await getFriends();
    setFriends(res.data);
  };

  useEffect(() => {
    void fetchFriends();
    void fetchFriendRequests();
  }, []);

  return (
    <Container>
      <Tabs variant="outline" defaultValue="friends">
        <Tabs.List grow>
          <Tabs.Tab value="friends" leftSection={<FaUserFriends />}>Friendships</Tabs.Tab>
          <Tabs.Tab value="requests" leftSection={<LuMailQuestion />}>Friend Requests</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="friends" pt="xs">
          <FriendsList friends={friends} setFriends={setFriends} />
        </Tabs.Panel>
        <Tabs.Panel value="requests" pt="xs">
          <FriendRequestsList
            friendRequests={requests}
            setRequests={setRequests}
            onAccepted={fetchFriends}
          />
        </Tabs.Panel>
      </Tabs>
    </Container>
  );
}

export default Friends;