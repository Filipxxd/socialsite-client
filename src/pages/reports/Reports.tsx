import React, { useCallback, useEffect, useState } from "react";
import {
  Container,
  Card,
  Text,
  Button,
  Center,
  Pagination,
  ScrollArea,
  Flex,
  Avatar,
  Box,
  Modal,
  Group,
} from "@mantine/core";
import { getReports, ReportResponse, resolveReport } from "../../_api/reports.api.ts";
import { showErrorToast, showSuccessToast } from "../../_helpers/toasts.helper.ts";
import BetterLoader from "../../shared/BetterLoader.tsx";
import NoDataFound from "../../shared/NoDataFound.tsx";
import { getPathOrNull } from "../../_helpers/file.helper.ts";
import { FaCheck } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";
import { Carousel } from "@mantine/carousel";
import { formatDate } from "../../_helpers/date.helper.ts";
import { modals } from "@mantine/modals";

const ReportPage: React.FC = () => {
  const [reports, setReports] = useState<ReportResponse[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(5);
  const [loading, setLoading] = useState<boolean>(true);

  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [selectedReport, setSelectedReport] = useState<ReportResponse | null>(null);

  const fetchReports = useCallback(async () => {
    setLoading(true);
    await getReports({ pageNumber: page, pageSize: pageSize })
      .then((res) => {
        setReports(res.data.items);
        setTotalPages(Math.ceil(res.data.totalRecords / pageSize));
      })
      .catch(() => showErrorToast());
    setLoading(false);
  }, [page, pageSize]);

  useEffect(() => {
    void fetchReports();
  }, [fetchReports]);

  const handleDecline = async (report: ReportResponse) => {
    await resolveReport({ reportId: report.reportId, accepted: false })
      .then(() => {
        void fetchReports();
        showSuccessToast("Report declined successfully");
      })
      .catch(() => showErrorToast());
  };

  const handleAccept = async (report: ReportResponse) => {
    modals.openConfirmModal({
      title: "Accept Report",
      children: (
        <Text>Are you sure? Accepting will delete post with all same reports permanently!</Text>
      ),
      labels: { confirm: "Delete", cancel: "Cancel" },
      confirmProps: { color: "red" },
      onConfirm: async () => {
        await resolveReport({ reportId: report.reportId, accepted: true })
          .then(() => {
            void fetchReports();
            showSuccessToast("Report resolved successfully!");
          })
          .catch(() => showErrorToast());
      },
    });
  };

  const openReportModal = (report: ReportResponse) => {
    setSelectedReport(report);
    setModalOpen(true);
  };

  return (
    <Container>
      <ScrollArea style={{ height: "70vh" }}>
        {loading ? (
          <BetterLoader />
        ) : reports.length === 0 ? (
          <NoDataFound title="No Reports Found" />
        ) : (
          reports.map((report) => (
            <Card key={report.reportId} shadow="md" padding="md" withBorder>
              <Flex direction={{ base: "column", md: "row" }} justify="space-between" align="center" gap="sm">
                <Flex align="center" miw={500}>
                  <Avatar
                    src={getPathOrNull(report.reporterProfilePicturePath)}
                    alt={report.reporterFullname}
                    size="lg"
                    radius="xl"
                    me={15}
                  />
                  <Flex direction={"column"}>
                    <Box>
                      <Text fw={500}>{report.reporterFullname}</Text>
                    </Box>
                    <Box>
                      <Text ml={5}>{report.content}</Text>
                    </Box>
                  </Flex>
                </Flex>
                <Flex direction="row" justify="flex-end" w="100%" gap="xs" align={"center"}>
                  <Button onClick={() => openReportModal(report)}>
                    Show Post
                  </Button>
                  <Flex direction={{ base: "row", md: "column" }}>
                    <Button onClick={() => handleAccept(report)} mb={{ base: 0, md: 10 }} me={{ base: 10, md: 0 }} leftSection={<FaCheck size={13} />}>
                      Accept
                    </Button>
                    <Button onClick={() => handleDecline(report)} leftSection={<FaXmark size={16} />}>
                      Decline
                    </Button>
                  </Flex>
                </Flex>
              </Flex>
            </Card>
          ))
        )}
      </ScrollArea>
      <Center mt={10}>
        <Pagination mb="xl" total={totalPages} value={page} onChange={setPage} />
      </Center>

      <Modal opened={modalOpen} onClose={() => setModalOpen(false)} title="Post Detail" size="xl">
        {selectedReport && (
          <div>
            <Group align="center">
              <Avatar
                src={getPathOrNull(selectedReport.post.userProfilePicturePath)}
                alt={selectedReport.post.userFullname}
                size="md"
                radius="xl"
              />
              <div>
                <Text size="sm" fw={500}>{selectedReport.post.userFullname}</Text>
                <Text size="xs" c="dimmed">{formatDate(selectedReport.post.dateCreated)}</Text>
              </div>
            </Group>
            <Text size="sm" mt="md">{selectedReport.post.content}</Text>
            {selectedReport.post.images && selectedReport.post.images.length > 0 && (
              <Carousel slideSize="100%" height="100%" slideGap="md" loop withIndicators>
                {selectedReport.post.images.map((image, index) => (
                  <Carousel.Slide key={index}>
                    <img src={`data:image/jpeg;base64,${image.base64}`} alt={image.name} />
                  </Carousel.Slide>
                ))}
              </Carousel>
            )}
          </div>
        )}
      </Modal>
    </Container>
  );
};

export default ReportPage;