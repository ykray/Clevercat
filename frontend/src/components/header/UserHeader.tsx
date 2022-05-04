import React, { useContext } from 'react';

// MUI
import { Stack, Button, IconButton, Tooltip } from '@mui/material';
import { LogoutOutlined as LogoutIcon } from '@mui/icons-material';

// Assets
import styles from '../../assets/sass/_variables.scss';

// Components
import AuthorComponent from '../AuthorComponent';

// Data
import API from '../../data/FrontendAPI';
import { UserContext } from '../../App';
import { useLocation, useNavigate } from 'react-router-dom';

export default function UserHeader() {
  const location = useLocation();
  const navigate = useNavigate();
  const currentUser = useContext(UserContext);

  return currentUser ? (
    <Stack alignItems={'center'} direction={'row'} spacing={0}>
      <AuthorComponent uid={currentUser} />
      <Tooltip title={'Logout'} placement={'top'} arrow>
        <IconButton
          onClick={() => {
            API.Auth.logout().then((res) => {
              navigate('/');
            });
          }}
        >
          <LogoutIcon
            style={{
              color: styles.color_muted_400,
              width: 20,
              height: 20,
            }}
          />
        </IconButton>
      </Tooltip>
    </Stack>
  ) : location.pathname === '/ask' ? null : (
    <Stack direction={'row'} spacing={1}>
      <Button
        className={'login-button'}
        variant={'contained'}
        onClick={() => navigate('/login')}
      >
        Login
      </Button>
      <Button variant={'contained'} onClick={() => navigate('/signup')}>
        Signup
      </Button>
    </Stack>
  );
}
