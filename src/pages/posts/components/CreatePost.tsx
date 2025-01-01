import { useState } from "react";
import {
  Button,
  Group,
  Textarea,
  Box,
  Image,
  ActionIcon,
  Grid,
  Paper,
  Menu,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { FaRegTrashAlt, FaUpload, FaGlobe } from "react-icons/fa";
import { Dropzone } from "@mantine/dropzone";
import Typography from "@mui/material/Typography";
import { createPost, CreatePostRequest, PostVisibility } from "../api.ts";
import { convertFilesToBase64 } from "../../../_helpers/file.helper.ts";
import { ACCEPTED_IMG_TYPES, MAX_SIZE } from "../../../_constants/file.constants.ts";
import { showErrorToast, showSuccessToast } from "../../../_helpers/toasts.helper.ts";

type CreatePostProps = {
  onSuccess: () => Promise<void>;
};

export default function CreatePost({ onSuccess }: CreatePostProps) {
  const [fileImages, setFileImages] = useState<File[]>([]);
  const [imagesBase64, setBase64Images] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CreatePostRequest>({
    initialValues: {
      content: "",
      images: [],
      visibility: PostVisibility.Everyone,
    },
    validate: {
      content: (value) => (!value.trim() ? "Content cannot be empty" : null),
      images: (value) => (value.length > 5 ? "You can upload up to 5 images" : null),
    },
  });

  const handleImagesChange = (files: File[]) => {
    if (!files) return;
    setFileImages(files);
    convertFilesToBase64(files).then(setBase64Images);
  };

  const removeImage = (index: number) => {
    setFileImages((prev) => prev.filter((_, i) => i !== index));
    setBase64Images((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (createPostRequest: CreatePostRequest) => {
    setIsSubmitting(true);

    const processedImages = fileImages.map((file, index) => ({
      name: file.name,
      base64: imagesBase64[index].split(",")[1],
    }));

    await createPost({ ...createPostRequest, images: processedImages })
      .then(async () => {
        showSuccessToast("Post created successfully");
        form.reset();
        setFileImages([]);
        setBase64Images([]);
        await onSuccess();
      })
      .catch(() => showErrorToast());

    setIsSubmitting(false);
  }

  return (
    <Paper p="md" shadow="xs" mb="md" withBorder>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Textarea
          placeholder="Share your thoughts..."
          minRows={3}
          mb="sm"
          {...form.getInputProps("content")}
        />
        <Dropzone
          onDrop={handleImagesChange}
          accept={ACCEPTED_IMG_TYPES}
          maxFiles={5}
          maxSize={MAX_SIZE}
          mb="sm"
        >
          <Typography variant="h6" align="center" color="textSecondary">
            <FaUpload /> Upload Images
          </Typography>
        </Dropzone>
        {imagesBase64.length > 0 && (
          <Grid gutter="sm" mb="sm">
            {imagesBase64.map((src, idx) => (
              <Grid.Col span={4} key={idx}>
                <Box style={{ position: "relative" }}>
                  <Image src={src} alt={`Preview ${idx}`} radius="sm" />
                  <ActionIcon
                    color="red"
                    style={{ position: "absolute", top: 5, right: 5 }}
                    onClick={() => removeImage(idx)}
                  >
                    <FaRegTrashAlt size={16} />
                  </ActionIcon>
                </Box>
              </Grid.Col>
            ))}
          </Grid>
        )}
        <Group>
          <Button type="submit" loading={isSubmitting}>
            Post
          </Button>
          <Menu>
            <Menu.Target>
              <ActionIcon variant="outline">
                <FaGlobe />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              {Object.entries(PostVisibility).map(([key, value]) => (
                <Menu.Item
                  key={key}
                  onClick={() => form.setFieldValue("visibility", key as PostVisibility)}
                  style={{ fontWeight: form.values.visibility === key ? 700 : 400 }}
                >
                  {value}
                </Menu.Item>
              ))}
            </Menu.Dropdown>
          </Menu>
        </Group>
      </form>
    </Paper>
  );
}