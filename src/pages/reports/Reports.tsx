import React, { useEffect, useState } from 'react';
import { Container, Card, Text, Button, Group, Badge, LoadingOverlay } from '@mantine/core';
import {getReportsMocked, ReportResponse} from '../../_api/reports.api.ts';

const ReportPage: React.FC = () => {
    const [reports, setReports] = useState<ReportResponse[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchReports = async () => {
            const response = getReportsMocked(); // TODO: Call await
            setReports(response);
        };

        void fetchReports();
    }, []);

    return (
        <Container>
            <LoadingOverlay visible={loading} />
            <div>
                <Text variant="h4" mb="md">
                    Report List
                </Text>
            </div>
            {reports.length === 0 ? (
                <Text color="gray">
                    No reports available.
                </Text>
            ) : (
                reports.map((report) => (
                    <Card key={report.postId} shadow="sm" p="md" mb="lg">
                        <Group p="apart">
                            <Text w={500}>{report.reporterFullname}</Text>
                            <Badge>{report.state}</Badge>
                        </Group>
                        <Text mt="md" color="dimmed">{new Date(report.dateCreated).toLocaleString()}</Text>
                        <Text mt="sm">{report.content}</Text>
                        <Group mt="md">
                            <Button variant="outline" color="blue">
                                View Post {report.postId}
                            </Button>
                        </Group>
                    </Card>
                ))
            )}
        </Container>
    );
};

export default ReportPage;
