import {
    Button,
    Group,
    Select,
    FileInput,
    Textarea,
    Modal,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useState } from 'react';
import { createPost, CreatePostRequest, PostVisibility } from "./api.ts";

export default function CreatePost() {
    const [images, setImages] = useState<File[]>([]);
    const [opened, setOpened] = useState(false);

    const form = useForm<CreatePostRequest>({
        initialValues: {
            content: '',
            images: [],
            visibility: PostVisibility.Anyone,
        },

        validate: {
            content: (value) => {
                if (!value.trim()) {
                    return 'Content cannot be empty';
                }
                return null;
            },

            visibility: (value) => {
                if (!value) {
                    return 'Please select a visibility option';
                }
                return null;
            },
        },
    });

    const handleModalClose = () => {
        setOpened(false);
        form.reset();
        setImages([]);
    };

    const handleSubmit = async (createPostRequest: CreatePostRequest) => {
        await createPost(createPostRequest);

        handleModalClose();
    };

    return (
        <>
            <Button onClick={() => setOpened(true)} size="md">
                Create New Post
            </Button>

            <Modal
                opened={opened}
                onClose={handleModalClose}
                title="Create Post"
                size="md"
            >
                <form onSubmit={form.onSubmit(handleSubmit)}>
                    <Textarea
                        label="Content"
                        placeholder="Write something..."
                        {...form.getInputProps('content')}
                        minRows={4}
                        mb="md"
                    />

                    <FileInput
                        label="Upload images"
                        placeholder="Choose image files"
                        multiple
                        onChange={(files) => {
                            if (files) {
                                setImages(files);
                            }
                        }}
                        accept="image/*"
                        value={images}
                        mb="md"
                    />

                    <Select
                        label="Visibility"
                        data={[
                            { value: PostVisibility.Anyone, label: 'Anyone' },
                            { value: PostVisibility.Friends, label: 'Friends' },
                            { value: PostVisibility.Private, label: 'Private' },
                        ]}
                        {...form.getInputProps('visibility')}
                        mt="md"
                    />

                    <Group mt="md">
                        <Button type="submit">Create Post</Button>
                    </Group>
                </form>
            </Modal>
        </>
    );
}
