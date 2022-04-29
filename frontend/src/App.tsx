import { useState, useEffect, createContext } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

import { ThemeProvider } from '@mui/material';

// Assets
import './assets/sass/App.scss';
import Theme from './assets/Theme';

// Components
import Login from './components/Login';
import Profile from './components/Profile';

import Header from './components/Header';
import SearchComponent from './components/SearchComponent';
import PostComponent from './components/PostComponent';
import HotQuestions from './components/HotQuestions';
import Ask from './components/Ask';
import API from './data/FrontendAPI';
import FloatingAsk from './components/FloatingAsk';

export const UserContext = createContext<string | undefined>(undefined);

function App() {
  const location = useLocation();
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
        <div className={'wrapper'}>
          <Header />

          <Routes>
            <Route path={'/'} element={<HotQuestions />} />
            <Route path={'/login'} element={<Login />} />
            <Route path={'/q/:qid'} element={<PostComponent />} />
            <Route path={'/search'} element={<SearchComponent />} />
            <Route path={'/ask'} element={<Ask />} />
            <Route path="/@:username" element={<Profile />} />
            <Route index element={<HotQuestions />} />
          </Routes>

          {location.pathname === '/ask' ? null : <FloatingAsk />}
        </div>
      </ThemeProvider>
    </UserContext.Provider>
  );
}

export default App;
