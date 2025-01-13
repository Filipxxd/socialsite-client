import { useState } from "react";
import { Button, Group, Modal, Select, Textarea } from "@mantine/core";
import { useForm } from "@mantine/form";
import { createReport, CreateReportRequest, ReportType } from "../../../_api/reports.api.ts";
import { showErrorToast, showSuccessToast } from "../../../_helpers/toasts.helper.ts";
import { FaFlag } from "react-icons/fa";

export type CreateReportProps = {
  postId: number;
  callback: () => void;
};

export function CreateReportModal(props: CreateReportProps) {
  const [opened, setOpened] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CreateReportRequest>({
    initialValues: {
      postId: props.postId,
      type: ReportType.Offensive,
      content: ''
    },

    validate: {
      content: (value: string) => (value.length > 0 ? null : 'Please enter a report message'),
      type: (value: ReportType) => (value ? null : 'Please select a type of offense'),
    },
  });

  const handleSubmit = async (data: CreateReportRequest) => {
    setIsSubmitting(true);

    await createReport(data)
      .then(() => {
        props.callback();

        setOpened(false);
        showSuccessToast('Report submitted successfully');
        form.reset();
      })
      .catch(() => {
        showErrorToast();
      });

    setIsSubmitting(false);
  };

  return (
    <>
      <Button
        size="sm"
        variant="subtle"
        children={<FaFlag />}
        onClick={() => setOpened(true)} />

      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title="Report this post"
        size="md"
      >
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Textarea
            label="Message"
            placeholder="Describe the issue..."
            {...form.getInputProps('content')}
            minRows={3}
          />

          <Select
            label="Type"
            value={form.values.type}
            onChange={(newType) => form.setFieldValue("type", newType as ReportType)}
            data={Object.entries(ReportType).map(([key, value]) => ({
              value: key as ReportType,
              label: value,
            }))}
            w="100%"
          />

          <Group mt="md">
            <Button type="submit" loading={isSubmitting}>
              Report
            </Button>
          </Group>
        </form>
      </Modal>
    </>
  );
}