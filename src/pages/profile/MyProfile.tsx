import { useState, useEffect } from "react";
import {
  Container, TextInput, Select, Avatar, Checkbox, Stack,
  Textarea, Loader, Grid, Button, ActionIcon
} from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { Dropzone } from "@mantine/dropzone";
import {
  MyProfileResponse, getProfileInfo, updateProfileInfo, updateProfileImage
} from "./api";
import { FaUpload } from "react-icons/fa";
import { API_BASE_URL } from "../../_constants/api.constants";

const MyProfile = () => {
  const [profile, setProfile] = useState<MyProfileResponse | null>(null);
  const [originalProfile, setOriginalProfile] = useState<MyProfileResponse | null>(null);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const response = await getProfileInfo();
      setProfile(response.data);
      setOriginalProfile(response.data);
    };
    void fetchProfile();

    if (!selectedImageFile) {
      setPreviewImage(null);
      return;
    }

    const objectUrl = URL.createObjectURL(selectedImageFile);
    setPreviewImage(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);

  }, [selectedImageFile]);

  const friendRequestOptions = [
    { value: "AnyOne", label: "Anyone" },
    { value: "FriendsOfFriends", label: "Friends of Friends" },
    { value: "NoOne", label: "No One" }
  ];

  const changesMade = profile && originalProfile && JSON.stringify(profile) !== JSON.stringify(originalProfile);

  const handleSave = async () => {
    if (changesMade) {
      const response = await updateProfileInfo(profile);
      if (response.status === 200) {
        showNotification({
          title: "Profile Updated",
          message: "Your profile has been updated successfully",
          color: "teal",
        });
        setOriginalProfile(profile);
      }
    }

    if (selectedImageFile)
      await handleImageUpload();
  };

  const handleImageUpload = async () => {
    if (!selectedImageFile || !profile) return;
    const reader = new FileReader();
    reader.onload = async (event) => {
      const result = event.target?.result;
      if (typeof result !== "string") return;

      const base64String = result.split(",")[1];
      const response = await updateProfileImage(base64String, selectedImageFile.name);
      if (response.status === 204) {
        showNotification({
          title: "Profile Image Updated",
          message: "Your profile image has been updated successfully",
          color: "teal",
        });
        setProfile({ ...profile, profilePicturePath: response.data.updatedImagePath });
        setPreviewImage(null);
        setSelectedImageFile(null);
      }
    };
    reader.readAsDataURL(selectedImageFile);
  };

  if (!profile)
    return <Loader size="xl" />;

  return (
    <Container>
      <Grid justify="center">
        <Grid.Col span={{ base: 10, md: 3 }}>
          <Stack align="center" pos="relative">
            <Avatar
              src={previewImage || (API_BASE_URL + profile.profilePicturePath)}
              alt={`${profile.firstname} ${profile.lastname}`}
              size={100}
              radius="xl"
            />
            <Dropzone
              accept={{
                'image/jpeg': [],
                'image/png': [],
                'image/webp': [],
                'image/jpg': []
              }}
              onDrop={(files) => setSelectedImageFile(files[0])}
              style={{
                position: "absolute",
                bottom: 60,
                right: 20,
                width: 40,
                height: 40,
                border: "none",
                backgroundColor: "rgba(255,255,255,0.8)",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <ActionIcon variant="filled" color="blue">
                <FaUpload />
              </ActionIcon>
            </Dropzone>
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
            onChange={(newSetting) =>
              setProfile((prev) => prev ? { ...prev, friendRequestSetting: newSetting || prev.friendRequestSetting } : null)
            }
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
              value={profile.bio ?? ""}
              onChange={(e) => setProfile((prev) => prev ? { ...prev, bio: e.currentTarget.value } : null)}
              w="100%"
            />
            <Button
              onClick={handleSave}
              disabled={!changesMade && !selectedImageFile}
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

export default MyProfile;