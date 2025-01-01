import React, { useState, useEffect } from 'react';
import { TextInput, Loader, Avatar, Group } from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { searchUsers, SearchUserResponse } from '../api';
import { UserProfileRoute } from '../../../_constants/routes.constants.ts';
import { API_BASE_URL } from '../../../_constants/api.constants.ts';
import { showErrorToast } from '../../../_helpers/toasts.helper.ts';
import styles from './UserSearchBar.module.css';

function SearchBar() {
  const [searchValue, setSearchValue] = useState('');
  const [debouncedValue] = useDebouncedValue(searchValue, 300);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SearchUserResponse[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResults = async () => {
      if (debouncedValue.length < 2) return;
      setLoading(true);

      await searchUsers(debouncedValue)
        .then((res) => setResults(res.data.items))
        .catch(() => showErrorToast())
        .finally(() => setLoading(false));
    };

    void fetchResults();
  }, [debouncedValue]);

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement, MouseEvent>, username: string) => {
    event.preventDefault();
    navigate(`${UserProfileRoute}/${username}`);
  };

  return (
    <div className={styles.container}>
      <TextInput
        placeholder="Search users..."
        value={searchValue}
        radius={8}
        onChange={(event) => setSearchValue(event.currentTarget.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      {loading && <Loader size="sm" className={styles.loader} />}
      {results.length > 0 && isFocused && (
        <Paper className={styles.paper}>
          {results.map((user) => (
            <Group
              key={user.username}
              className={styles.group}
              onMouseDown={(event) => handleMouseDown(event, user.username)}
            >
              <Avatar src={`${API_BASE_URL}${user.profilePicturePath}`} alt={user.fullname} />
              <div>{user.fullname}</div>
            </Group>
          ))}
        </Paper>
      )}
    </div>
  );
}

export default SearchBar;