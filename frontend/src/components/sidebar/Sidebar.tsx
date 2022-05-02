import React, { useState, useEffect } from 'react';

// MUI
import { ClickAwayListener, Stack } from '@mui/material';

// Components
import SidebarHeader from './SidebarHeader';
import Menu from '../Menu';

export default function Sidebar() {
  // States
  const [bottomAnchor, setBottomAnchor] = useState<number>();
  const [showMenu, setShowMenu] = useState(true);

  useEffect(() => {
    let showMenuPrefs = JSON.parse(localStorage.getItem('showMenu') ?? 'false');
    setShowMenu(showMenuPrefs);
  }, []);

  useEffect(() => {
    const offset = document.getElementById('header')?.offsetHeight;
    setBottomAnchor(offset);
  }, []);

  const handleClickAway = () => {
    // if (showMenu === true) {
    //   setShowMenu(false);
    // }
  };

  const menuButtonOnClick = () => {
    localStorage.setItem('showMenu', JSON.stringify(!showMenu));
    setShowMenu(!showMenu);
  };

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <div className={'sidebar'}>
        <Stack direction={'column'} alignItems={'center'} spacing={'13px'}>
          <SidebarHeader onClick={menuButtonOnClick} />
          <Menu show={showMenu} />
        </Stack>
      </div>
    </ClickAwayListener>
  );
}
