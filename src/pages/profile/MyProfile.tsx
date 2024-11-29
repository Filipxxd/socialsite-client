import { useState, useEffect } from 'react';
import { Container, TextInput, Select, Avatar, Checkbox, Stack, Textarea, Loader, Grid, Button } from '@mantine/core';
import { MyProfileResponse, getProfileInfo, updateProfileInfo } from './api.ts';
import { showNotification } from "@mantine/notifications";

const ProfilePage = () => {
  const [profile, setProfile] = useState<MyProfileResponse | null>(null);
  const [originalProfile, setOriginalProfile] = useState<MyProfileResponse | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const response = await getProfileInfo();
      setProfile(response.data);
      setOriginalProfile(response.data);
    };

    void fetchProfile();
  }, []);

  const friendRequestOptions = [
    { value: 'AnyOne', label: 'Anyone' },
    { value: 'FriendsOfFriends', label: 'Friends of Friends' },
    { value: 'NoOne', label: 'No One' }
  ];

  const changesMade = profile && originalProfile && JSON.stringify(profile) !== JSON.stringify(originalProfile);

  const handleSave = async () => {
    if (profile){
      const response = await updateProfileInfo(profile)

      if (response.status === 200)
      {
        showNotification({
          title: 'Profile Updated',
          message: 'Your profile has been updated successfully',
          color: 'teal',
        });
        setOriginalProfile(profile);
      }
    }
  };

  if (!profile) {
    return <Loader size="xl" />;
  }

  return (
    <Container>
      <Grid justify="center">
        <Grid.Col span={{ base: 10, md: 3 }}>
          <Stack align="center">
            <Avatar
              src={profile.profilePicturePath}
              alt={`${profile.firstname} ${profile.lastname}`}
              size={100}
              radius="xl"
            />
            <TextInput
              label="Username"
              value={profile.username}
              readOnly
              w="100%"
            />
          </Stack>
          <Select
            label="Friend Requests"
            value={profile.friendRequestSetting}
            onChange={(newSetting) => setProfile((prev) => prev ? { ...prev, friendRequestSetting: newSetting || prev.friendRequestSetting } : null)}
            data={friendRequestOptions}
            w="100%"
          />
          <Checkbox
            mt={10}
            label="Allow Non-Friend Messages"
            checked={profile.allowNonFriendChatAdd}
            onChange={(e) =>
              setProfile((prev) => prev ? { ...prev, allowNonFriendChatAdd: e.currentTarget.checked } : null)
            }
          />
        </Grid.Col>

        <Grid.Col span={{ base: 10, md: 6 }}>
          <Stack>
            <TextInput
              label="First Name"
              value={profile.firstname}
              onChange={(e) => setProfile((prev) => prev ? { ...prev, firstname: e.currentTarget.value } : null)}
              w="100%"
            />
            <TextInput
              label="Last Name"
              value={profile.lastname}
              onChange={(e) => setProfile((prev) => prev ? { ...prev, lastname: e.currentTarget.value } : null)}
              w="100%"
            />
            <Textarea
              label="Bio"
              value={profile.bio ?? ''}
              onChange={(e) => setProfile((prev) => prev ? { ...prev, bio: e.currentTarget.value } : null)}
              w="100%"
            />
            <Button
              onClick={handleSave}
              disabled={!changesMade}
              fullWidth
            >
              Save
            </Button>
          </Stack>
        </Grid.Col>
      </Grid>
    </Container>
  );
};

export default ProfilePage;