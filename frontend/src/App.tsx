import { useState, useEffect, createContext } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

// MUI
import { Grid, Stack, ThemeProvider } from '@mui/material';

// Assets
import './assets/sass/App.scss';
import Theme from './assets/Theme';

// Data
import API from './data/FrontendAPI';
import PublicWrapper from './utils/PublicWrapper';
import PrivateWrapper from './utils/PrivateWrapper';

// Components
import Login from './components/Login';
import Profile from './components/Profile';
import Sidebar from './components/sidebar/Sidebar';
import SearchComponent from './components/SearchComponent';
import PostComponent from './components/PostComponent';
import HotQuestions from './components/HotQuestions';
import Ask from './components/Ask';
import FloatingAsk from './components/FloatingAsk';
import TopicFeed from './components/TopicFeed';
import ScrollToTop from './components/ScrollToTop';
import Signup from './components/Signup';
import MainHeader from './components/header/MainHeader';

export const UserContext = createContext<string | undefined>(undefined);

function App() {
  const location = useLocation();
  // const largeScreen = useMediaQuery((theme: any) => theme.breakpoints.up('md'));

  const [currentUser, setCurrentUser] = useState<string>();

  const getCurrentUser = async () => {
    const curr = await API.Auth.currentUser();
    setCurrentUser(curr);
  };

  useEffect(() => {
    getCurrentUser();
  });

  return (
    <UserContext.Provider value={currentUser}>
      <ThemeProvider theme={Theme}>
        <ScrollToTop />

        <Grid
          container
          className={'container'}
          direction={'row'}
          alignItems={'flex-start'}
          spacing={2}
        >
          <Grid item>
            <Sidebar />
          </Grid>
          <Grid item xs>
            <MainHeader />

            <div className={'main'}>
              <Stack
                direction={'row'}
                justifyContent={'space-between'}
                spacing={2}
              >
                <Stack
                  direction={'column'}
                  alignItems={'flex-start'}
                  spacing={2}
                  maxWidth={'70%'}
                  pb={'50px'}
                >
                  <Routes>
                    <Route path={'/'} element={<HotQuestions />} />
                    <Route element={<PublicWrapper />}>
                      {/*           ^^^^^^^^^^^^^^^^^ */}
                      {/* TODO: - works, but clean up later */}
                      <Route path={'/login'} element={<Login />} />
                      <Route path={'/signup'} element={<Signup />} />
                    </Route>

                    <Route path={'/q/:qid'} element={<PostComponent />} />
                    <Route path={'/search'} element={<SearchComponent />} />
                    <Route element={<PrivateWrapper />}>
                      <Route path={'/ask'} element={<Ask />} />
                    </Route>
                    <Route path={'/@:username'} element={<Profile />} />
                    <Route path={'/topics/*'} element={<TopicFeed />} />
                    <Route index element={<HotQuestions />} />
                  </Routes>
                </Stack>

                <div
                  className={'hide-on-mobile'}
                  style={{
                    width: '30%',
                    // backgroundColor: 'green',
                  }}
                ></div>
              </Stack>
              {location.pathname === '/ask' ||
              location.pathname === '/login' ||
              location.pathname === '/signup' ? null : (
                <FloatingAsk />
              )}
            </div>
          </Grid>
        </Grid>
      </ThemeProvider>
    </UserContext.Provider>
  );
}

export default App;
