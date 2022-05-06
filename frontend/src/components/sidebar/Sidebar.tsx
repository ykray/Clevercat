import { useState, useEffect } from 'react';

// Components
import SidebarHeader from './SidebarHeader';
import Menu from '../header/Menu';

// MUI
import { Stack } from '@mui/material';

export default function Sidebar() {
  // States
  const [showMenu, setShowMenu] = useState(true);

  useEffect(() => {
    let menuPreference = JSON.parse(
      localStorage.getItem('showMenu') ?? 'false'
    );
    setShowMenu(menuPreference);
  }, []);

  const menuButtonOnClick = () => {
    localStorage.setItem('showMenu', JSON.stringify(!showMenu));
    setShowMenu(!showMenu);
  };

  return (
    <div className={'sidebar'}>
      <Stack direction={'column'} alignItems={'stretch'} spacing={'13px'}>
        <SidebarHeader onClick={menuButtonOnClick} />
        <div className={'hide-on-mobile'}>
          <Menu show={showMenu} />
        </div>
      </Stack>
    </div>
  );
}
