import { useState, useEffect } from 'react';
import { TextInput, Loader, Avatar, Group } from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { Paper } from '@mui/material';
import { searchUsers, SearchUserResponse } from '../api';
import { useNavigate } from 'react-router-dom';
import { UserProfileRoute } from "../../../_constants/routes.constants.ts";

function SearchBar() {
  const [searchValue, setSearchValue] = useState('');
  const [debouncedValue] = useDebouncedValue(searchValue, 300);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SearchUserResponse[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResults = async () => {
      if (debouncedValue.length >= 3) {
        setLoading(true);
        try {
          const response = await searchUsers(debouncedValue);
          setResults(response.data);
        } catch (error) {
          console.error('Error fetching users:', error);
          setResults([]);
        } finally {
          setLoading(false);
        }
      } else {
        setResults([]);
      }
    };
    fetchResults();
  }, [debouncedValue]);

  const handleUserClick = (username: string) => {
    navigate(`${UserProfileRoute}/${username}`);
  };

  return (
    <div style={{ position: 'relative', maxWidth: 400, margin: 'auto' }}>
      <TextInput
        placeholder="Search friends..."
        value={searchValue}
        onChange={(event) => setSearchValue(event.currentTarget.value)}
        styles={{ input: { height: 'auto', borderRadius: 8 } }}
      />
      {loading && <Loader size="sm" style={{ position: 'absolute', right: 12, top: 10 }} />}
      {results.length > 0 && (
        <Paper
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            marginTop: 8,
            zIndex: 10,
            background: 'white',
          }}
          elevation={3}
        >
          {results.map((user) => (
            <Group
              key={user.username}
              style={{
                padding: '8px 12px',
                cursor: 'pointer',
                transition: 'background-color 0.3s',
              }}
              onClick={() => handleUserClick(user.username)}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f0f0f0')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'white')}
            >
              <Avatar src={user.profilePicturePath} alt={user.fullname} />
              <div>{user.fullname}</div>
            </Group>
          ))}
        </Paper>
      )}
    </div>
  );
}

export default SearchBar;