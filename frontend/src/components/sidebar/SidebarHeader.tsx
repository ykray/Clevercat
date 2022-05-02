import { useNavigate } from 'react-router-dom';

// Assets
import styles from '../../assets/sass/_variables.scss';
import KittyImage from '../../assets/images/kitty.png';

// MUI
import { IconButton, Stack } from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';

// Components
import SearchBar from '../SearchBar';
import UserHeader from '../header/UserHeader';

type Props = {
  onClick?: any;
};

export default function SidebarHeader({ onClick }: Props) {
  const navigate = useNavigate();

  return (
    <>
      <div className="sidebar-header">
        <Stack
          justifyContent="space-around"
          alignItems={'flex-end'}
          spacing={3}
          id={'header'}
        >
          <Stack
            direction={'row'}
            justifyContent={'space-between'}
            alignItems={'flex-start'}
            spacing={2}
            // zIndex={9999}
          >
            <Stack direction={'row'} alignItems={'center'} spacing={1}>
              <div className={'logo'} onClick={() => navigate('/')}>
                <Stack direction={'row'} alignItems={'center'} spacing={'12px'}>
                  <img src={KittyImage} alt={'kitty'} />
                  <h1>
                    <span className="highlight">clever</span>cat
                  </h1>
                </Stack>
              </div>
              <IconButton className={'icon-button'} onClick={onClick}>
                <MenuIcon
                  style={{
                    width: 27,
                    height: 27,
                    color: styles.color_surface_500,
                  }}
                />
              </IconButton>
              <div className={'hide-on-desktop'}>
                <UserHeader />
              </div>
            </Stack>
          </Stack>
          <SearchBar mobile />
        </Stack>
      </div>
    </>
  );
}
