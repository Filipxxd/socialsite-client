import { useState, useEffect } from "react";
import {
  Container,
  TextInput,
  Select,
  Avatar,
  Checkbox,
  Stack,
  Textarea,
  Loader,
  Grid,
  Button,
  ActionIcon,
} from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { Dropzone } from "@mantine/dropzone";
import { FaUpload } from "react-icons/fa";
import { convertFileToBase64 } from "../../_helpers/file.helper.ts";
import { API_BASE_URL } from "../../_constants/api.constants";
import {
  MyProfileResponse,
  getProfileInfo,
  updateProfileInfo,
  updateProfileImage,
} from "./api";
import { ACCEPTED_IMG_TYPES, MAX_SIZE } from "../../_constants/file.constants.ts";

const MyProfile = () => {
  const [profile, setProfile] = useState<MyProfileResponse | null>(null);
  const [originalProfile, setOriginalProfile] = useState<MyProfileResponse | null>(null);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const response = await getProfileInfo();
      setProfile(response.data);
      setOriginalProfile(response.data);
    };
    fetchProfile();

    if (selectedImageFile) {
      const objectUrl = URL.createObjectURL(selectedImageFile);
      setPreviewImage(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else {
      setPreviewImage(null);
    }
  }, [selectedImageFile]);

  const friendRequestOptions = [
    { value: "AnyOne", label: "Anyone" },
    { value: "FriendsOfFriends", label: "Friends of Friends" },
    { value: "NoOne", label: "No One" },
  ];

  const changesMade = profile && originalProfile && JSON.stringify(profile) !== JSON.stringify(originalProfile);

  const updateNotification = (title: string, message: string, color: string) => {
    showNotification({ title, message, color });
  };

  const handleSave = async () => {
    setIsSubmitting(true);

    if (changesMade) {
      const response = await updateProfileInfo(profile);
      if (response.status === 200) {
        updateNotification("Profile Updated", "Your profile has been updated successfully", "teal");
        setOriginalProfile(profile);
      }
    }

    if (selectedImageFile)
      await handleImageUpdate();

    setIsSubmitting(false);
  };

  const handleImageUpdate = async () => {
    if (!selectedImageFile || !profile) return;

    const base64String = await convertFileToBase64(selectedImageFile);
    const response = await updateProfileImage(base64String.split(",")[1], selectedImageFile.name);

    if (response.status === 204) {
      updateNotification("Profile Image Updated", "Your profile image has been updated successfully", "teal");
      setProfile({ ...profile, profilePicturePath: response.data.updatedImagePath });
      setPreviewImage(null);
      setSelectedImageFile(null);
    }
  };

  if (!profile) return <Loader size="xl" />;

  const handleProfileChange = (field: keyof MyProfileResponse) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProfile((prev) => prev ? { ...prev, [field]: event.currentTarget.value } : null);
  };

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
              accept={ACCEPTED_IMG_TYPES}
              maxSize={MAX_SIZE}
              maxFiles={1}
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
            <TextInput label="Username" value={profile.username} readOnly w="100%" />
          </Stack>
          <Select
            label="Friend Requests"
            value={profile.friendRequestSetting}
            onChange={(newSetting) =>
              setProfile((prev) =>
                prev ? { ...prev, friendRequestSetting: newSetting || prev.friendRequestSetting } : null
              )
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
              onChange={handleProfileChange("firstname")}
              w="100%"
            />
            <TextInput
              label="Last Name"
              value={profile.lastname}
              onChange={handleProfileChange("lastname")}
              w="100%"
            />
            <Textarea
              label="Bio"
              value={profile.bio ?? ""}
              w="100%"
              onChange={(e) =>
                setProfile((prev) => prev ? { ...prev, bio: e.currentTarget.value } : null)
              }
            />
            <Button
              onClick={handleSave}
              loading={isSubmitting}
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