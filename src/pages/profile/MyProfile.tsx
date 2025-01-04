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
import { Dropzone } from "@mantine/dropzone";
import { FaUpload } from "react-icons/fa";
import {
  MyProfileResponse,
  FriendRequestSetting,
  getProfileInfo,
  updateProfileInfo,
  updateProfileImage
} from "../../_api/users.api.ts";
import { convertFileToBase64, getPathOrNull } from "../../_helpers/file.helper.ts";
import { ACCEPTED_IMG_TYPES, MAX_SIZE } from "../../_constants/file.constants.ts";
import { showErrorToast, showSuccessToast } from "../../_helpers/toasts.helper.ts";
import PostsList from "../posts/PostList.tsx";

const MyProfile = () => {
  const [profile, setProfile] = useState<MyProfileResponse | null>(null);
  const [originalProfile, setOriginalProfile] = useState<MyProfileResponse | null>(null);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const changesMade = profile && originalProfile && JSON.stringify(profile) !== JSON.stringify(originalProfile);

  useEffect(() => {
    const fetchProfile = async () => {
      const response = await getProfileInfo();
      setProfile(response.data);
      setOriginalProfile(response.data);
    };

    void fetchProfile();

    if (selectedImageFile) {
      const objectUrl = URL.createObjectURL(selectedImageFile);
      setPreviewImage(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else {
      setPreviewImage(null);
    }
  }, [selectedImageFile]);

  const handleSave = async () => {
    setIsSubmitting(true);

    if (changesMade) {
      await updateProfileInfo(profile)
        .then(() => {
          showSuccessToast("Your profile has been updated successfully");
          setOriginalProfile(profile);
        }).catch(() => showErrorToast());
    }

    if (selectedImageFile && profile){
      const base64String = await convertFileToBase64(selectedImageFile);

      await updateProfileImage(base64String.split(",")[1], selectedImageFile.name)
        .then((res) => {
          showSuccessToast("Your profile image has been updated successfully");
          setProfile({ ...profile, profilePicturePath: res.data.updatedImagePath });
          setPreviewImage(null);
          setSelectedImageFile(null);
        }).catch(() => showErrorToast());
    }

    setIsSubmitting(false);
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
              src={previewImage || getPathOrNull(profile.profilePicturePath)}
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
              setProfile((prev) => ({
                ...prev!,
                friendRequestSetting: newSetting as FriendRequestSetting,
              }))
            }
            data={Object.entries(FriendRequestSetting).map(([key, value]) => ({
              value: key as FriendRequestSetting,
              label: value,
            }))}
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
              rows={3}
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

      <PostsList onlyCurrentUser={true} />
    </Container>
  );
};

export default MyProfile;