import React from 'react';
import { Flex, Text } from "@mantine/core";
import { HiOutlineInbox } from "react-icons/hi2";

type NoDataFoundProps = {
  title: string;
  message?: string;
};

const NoDataFound: React.FC<NoDataFoundProps> = ({ title, message }) => (
  <Flex direction="column" align="center" p="xl">
    <HiOutlineInbox size={25} />
    <Text size="lg" fw={500}>{title}</Text>
    {message && <Text c="dimmed">{message}</Text>}
  </Flex>
);

export default NoDataFound;