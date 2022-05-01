import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from '../assets/sass/_variables.scss';

// MUI
import {
  ClickAwayListener,
  IconButton,
  Slide,
  Stack,
  Tooltip,
} from '@mui/material';
import { LogoutSharp, Menu } from '@mui/icons-material';

// Components
import SearchBar from './SearchBar';
import AuthorComponent from './AuthorComponent';
import { UserContext } from '../App';

// Data
import API from '../data/FrontendAPI';
import { Topic } from '../utils/Types';

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const currentUser = useContext(UserContext);

  // States
  const [topics, setTopics] = useState<Topic[]>([]);
  const [slideIn, setSlideIn] = useState(false);

  useEffect(() => {
    API.getAllTopics().then((topics) => setTopics(topics));
  }, []);

  const handleClickAway = () => {
    if (slideIn === true) {
      setSlideIn(false);
    }
  };

  const renderMenu = () => {
    if (topics) {
      const categories = topics.reduce((acc: any, d) => {
        if (Object.keys(acc).includes(d.category)) return acc;

        acc[d.category] = topics.filter((g) => g.category === d.category);
        return acc;
      }, {});

      const renderTopics = () => {
        return (
          <Stack direction={'row'} justifyContent={'space-between'}>
            {Object.keys(categories).map((category: any) => {
              return (
                <Stack direction={'column'} spacing={'6px'}>
                  {categories[category].map((x: Topic) => {
                    return (
                      <p
                        onClick={() => {
                          window.location.href = `/topics/${x.category}${
                            x.subtopic
                              ? `/${x.subtopic.replace(/\s/g, '')}`
                              : ''
                          }`;
                        }}
                        className={`${x.subtopic ? 'subtopic' : 'category'}`}
                      >
                        {x.subtopic ?? x.category}
                      </p>
                    );
                  })}
                </Stack>
              );
            })}
          </Stack>
        );
      };

      return (
        <Slide in={slideIn} direction={'down'}>
          <div className={'menu'}>{renderTopics()}</div>
        </Slide>
      );
    } else {
      return <></>;
    }
  };
  return (
    <>
      <ClickAwayListener onClickAway={handleClickAway}>
        <div className="header">
          <Stack justifyContent="center" alignItems={'stretch'} spacing={2}>
            <Stack
              direction={'row'}
              justifyContent={'space-between'}
              alignItems={'flex-start'}
              spacing={2}
            >
              <Stack direction={'row'} alignItems={'center'} spacing={1}>
                {renderMenu()}

                <div className={'logo'} onClick={() => navigate('/')}>
                  ask
                  <span className="highlight">about</span>
                </div>
                <IconButton
                  className={'icon-button'}
                  onClick={() => setSlideIn(!slideIn)}
                >
                  <Menu
                    style={{
                      width: 27,
                      height: 27,
                      color: styles.color_surface_500,
                    }}
                  />
                </IconButton>
              </Stack>

              <SearchBar />
              {
                currentUser ? (
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

                    {/* {location.pathname === '/ask' ? null : (
                  <div className={'hide-on-mobile'}>
                    <Button component={Link} to={'/ask'} variant={'contained'}>
                      Ask Question
                    </Button>
                  </div>
                )} */}
                  </Stack>
                ) : location.pathname === '/ask' ? null : null
                // <div className={'hide-on-mobile'}>
                //   <Button component={Link} to={'/ask'} variant={'contained'}>
                //     Ask Question
                //   </Button>
                // </div>
              }
            </Stack>
            <SearchBar mobile />
          </Stack>
        </div>
      </ClickAwayListener>
    </>
  );
}
