import React, { useState, useEffect } from 'react';

// MUI
import { ClickAwayListener, Stack } from '@mui/material';

// Components
import SidebarHeader from './header/SidebarHeader';
import Menu from './Menu';

export default function Sidebar() {
  // States
  const [bottomAnchor, setBottomAnchor] = useState<number>();
  const [showMenu, setShowMenu] = useState(true);

  useEffect(() => {
    let showMenuPrefs = JSON.parse(localStorage.getItem('showMenu') ?? 'false');
    setShowMenu(showMenuPrefs);
  }, []);

  useEffect(() => {
    localStorage.setItem('showMenu', JSON.stringify(showMenu));
  }, [showMenu]);

  useEffect(() => {
    const offset = document.getElementById('header')?.offsetHeight;
    setBottomAnchor(offset);
  }, []);

  const handleClickAway = () => {
    if (showMenu === true) {
      setShowMenu(false);
    }
  };

  const menuButtonOnClick = () => {
    setShowMenu(!showMenu);
  };

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <div className={'sidebar'}>
        <Stack alignItems={'center'} spacing={9}>
          <SidebarHeader onClick={menuButtonOnClick} />
          <Menu show={showMenu} />
        </Stack>
      </div>
    </ClickAwayListener>
  );
}
