import {
  Avatar,
  Box,
  Button,
  Card,
  Center,
  Flex,
  Pagination,
  ScrollArea,
  Select,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import NoDataFound from "../../shared/NoDataFound.tsx";
import { getPathOrNull } from "../../_helpers/file.helper.ts";
import React, { useCallback, useEffect, useState } from "react";
import { modals } from "@mantine/modals";
import { FaBan, FaCheck, FaEdit, FaSave } from "react-icons/fa";
import { useForm } from '@mantine/form';
import { FaXmark } from "react-icons/fa6";
import {
  updateBanState,
  updateUserRole,
  searchUsers,
  UserResponse,
  UserRole,
  updateUsername,
} from "../../_api/users.api.ts";
import { showErrorToast, showSuccessToast } from "../../_helpers/toasts.helper.ts";
import BetterLoader from "../../shared/BetterLoader.tsx";
import { useDebouncedValue } from '@mantine/hooks';
import { alphabetNumberRegex } from "../../_constants/regex.constants.ts";

const UserManager: React.FC = () => {
  const pageSize = 5;
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [usersLoading, setUsersLoading] = useState(false);
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm] = useDebouncedValue(searchTerm, 300);
  const [editingUserId, setEditingUserId] = useState<number | null>(null);

  const form = useForm({
    initialValues: {
      username: '',
    },
    validate: {
      username: (value) => {
        if (value.length < 6)
          return "Username must be at least 6 characters long";

        return alphabetNumberRegex.test(value)
          ? null
          : "Firstname must contain only characters";
      }
    },
  });

  const fetchUsers = useCallback(() => {
    setUsersLoading(true);
    searchUsers({
      pageNumber: page,
      pageSize: pageSize,
      searchTerm: debouncedSearchTerm,
    })
      .then((res) => {
        setTotalPages(Math.ceil(res.data.totalRecords / pageSize));
        setUsers(res.data.items);
      })
      .catch(() => showErrorToast())
      .finally(() => setUsersLoading(false));
  }, [page, pageSize, debouncedSearchTerm]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleUserBanChange = (user: UserResponse) => {
    modals.openConfirmModal({
      title: `${user.isBanned ? "Confirm Unban" : "Confirm Ban"}`,
      children: (
        <Text>{`Are you sure you want to ${
          user.isBanned ? "unban" : "ban"
        } user ${user.fullname}?`}</Text>
      ),
      labels: { confirm: user.isBanned ? "Unban" : "Ban", cancel: "Cancel" },
      confirmProps: { color: "red" },
      onConfirm: () => {
        updateBanState(user.userId, !user.isBanned)
          .then(() => {
            setUsers((currentUsers) =>
              currentUsers.map((u) =>
                u.userId === user.userId ? { ...u, isBanned: !u.isBanned } : u
              )
            );
            showSuccessToast(
              `User ${user.fullname} ${
                user.isBanned ? "unbanned" : "banned"
              } successfully`
            );
          })
          .catch(() => showErrorToast());
      },
    });
  };

  const handleUserRoleChange = (user: UserResponse, role: UserRole) => {
    updateUserRole(user.userId, role)
      .then(() => {
        setUsers((currentUsers) =>
          currentUsers.map((u) =>
            u.userId === user.userId ? { ...u, role: role } : u
          )
        );
        showSuccessToast(`${user.fullname} is now ${role}`);
      })
      .catch(() => showErrorToast());
  };

  const handleUsernameSave = () => {
    if (editingUserId === null || !form.validateField('username')) {
      setEditingUserId(null);
      return;
    }

    modals.openConfirmModal({
      title: "Confirm Username Change",
      children: (
        <Text>{`Are you sure you want to change the username to ${form.values.username}?`}</Text>
      ),
      labels: { confirm: "Change", cancel: "Cancel" },
      onConfirm: () => {
        updateUsername(editingUserId, form.values.username)
          .then(() => {
            setUsers((currentUsers) =>
              currentUsers.map((u) =>
                u.userId === editingUserId ? { ...u, username: form.values.username } : u
              )
            );
            showSuccessToast(`Username changed to ${form.values.username}`);
          })
          .catch(() => showErrorToast("Try different username"))
          .finally(() => {
            setEditingUserId(null);
            form.reset();
          });
      },
    });
  };

  return (
    <Box p={{ base: "xs", md: "md" }}>
      <Stack>
        <TextInput
          placeholder="Search users..."
          radius={8}
          rightSection={
            searchTerm && (
              <FaXmark size={20} onClick={() => setSearchTerm("")} cursor="pointer" />
            )
          }
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.currentTarget.value)}
        />
        <ScrollArea style={{ height: "70vh" }}>
          {usersLoading ? (
            <BetterLoader />
          ) : users.length === 0 ? (
            <NoDataFound title="No Users Found" />
          ) : (
            users.map((user) => (
              <Card key={user.userId} shadow="md" padding="md" withBorder>
                <Flex
                  direction={{ base: "column", md: "row" }}
                  justify="space-between"
                  align="center"
                  gap="sm"
                >
                  <Flex align="center">
                    <Avatar
                      src={getPathOrNull(user.profilePicturePath)}
                      alt={user.fullname}
                      size="lg"
                      radius="xl"
                      me={15}
                    />
                    <Box>
                      <Text fw={500}>{user.fullname}</Text>
                      <Flex align="center" gap="sm">
                        {editingUserId === user.userId ? (
                          <Flex align="center" gap="sm" wrap="nowrap">
                            <form onSubmit={form.onSubmit(handleUsernameSave)} style={{ display: 'flex', alignItems: 'center' }}>
                              <TextInput
                                {...form.getInputProps('username')}
                                style={{ width: '150px' }}
                              />
                              <Button type="submit" variant="light" style={{ marginLeft: '5px' }}>
                                <FaSave size={16} />
                              </Button>
                              <Button
                                onClick={() => {
                                  setEditingUserId(null);
                                  form.reset();
                                }}
                                variant="light"
                                style={{ marginLeft: '5px' }}
                              >
                                <FaXmark size={16} />
                              </Button>
                            </form>
                          </Flex>
                        ) : (
                          <>
                            <Text>{user.username}</Text>
                            <FaEdit
                              size={16}
                              onClick={() => {
                                setEditingUserId(user.userId);
                                form.setFieldValue('username', user.username);
                              }}
                              cursor="pointer"
                            />
                          </>
                        )}
                      </Flex>
                    </Box>
                  </Flex>
                  <Flex direction={{ base: "row", md: "column" }}>
                    <Select
                      placeholder="Select Role"
                      data={[
                        { value: UserRole.User, label: "User" },
                        { value: UserRole.Moderator, label: "Moderator" },
                        { value: UserRole.Admin, label: "Admin", disabled: true },
                      ]}
                      value={user.role}
                      onChange={(role) =>
                        handleUserRoleChange(user, role as UserRole)
                      }
                      disabled={user.role === UserRole.Admin}
                      mb={{ base: 0, md: 10 }}
                      me={{ base: 10, md: 0 }}
                    />
                    <Button
                      color={user.isBanned ? "green" : "red"}
                      onClick={() => handleUserBanChange(user)}
                      leftSection={
                        user.isBanned ? (
                          <FaCheck size={13} />
                        ) : (
                          <FaBan size={13} />
                        )
                      }
                      variant={user.isBanned ? "outline" : "filled"}
                    >
                      {user.isBanned ? "Unban" : "Ban"}
                    </Button>
                  </Flex>
                </Flex>
              </Card>
            ))
          )}
        </ScrollArea>
      </Stack>
      <Center>
        <Pagination
          mb="xl"
          total={totalPages}
          value={page}
          onChange={setPage}
          pt={10}
        />
      </Center>
    </Box>
  );
};

export default UserManager;