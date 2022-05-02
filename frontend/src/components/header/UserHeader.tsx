import React, { useContext } from 'react';

// MUI
import {
  Stack,
  Button,
  ClickAwayListener,
  IconButton,
  Slide,
  Tooltip,
} from '@mui/material';
import { LogoutSharp, Menu as MenuIcon } from '@mui/icons-material';

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
    <Stack alignItems={'flex-end'} direction={'row'} spacing={0}>
      <AuthorComponent uid={currentUser} />
      <Tooltip title={'Logout'} placement={'top'} arrow>
        <IconButton
          onClick={() => {
            API.Auth.logout().then((res) => {
              navigate('/');
            });
          }}
        >
          <LogoutSharp
            style={{
              color: styles.color_muted_400,
              width: 26,
              height: 26,
            }}
          />
        </IconButton>
      </Tooltip>
    </Stack>
  ) : location.pathname === '/ask' ? null : (
    <Button variant={'contained'} onClick={() => navigate('/signup')}>
      Signup
    </Button>
  );
}
