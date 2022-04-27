import { Routes, Route } from 'react-router-dom';

import { ThemeProvider } from '@mui/material';

// Assets
import './assets/sass/App.scss';
import Theme from './assets/Theme';

// Components
import Header from './components/Header';
import PostComponent from './components/PostComponent';
import SearchComponent from './components/SearchComponent';
import HotQuestions from './components/HotQuestions';
import Ask from './components/Ask';
import Profile from './components/Profile';

function App() {
  return (
    <ThemeProvider theme={Theme}>
      <div className={'wrapper'}>
        <Header />

        <Routes>
          <Route path={'/'} element={<HotQuestions />} />
          <Route path={'/q/:qid'} element={<PostComponent />} />
          <Route path={'/search'} element={<SearchComponent />} />
          <Route path={'/ask'} element={<Ask />} />
          <Route path="/@:username" element={<Profile />} />
          <Route index element={<HotQuestions />} />
        </Routes>
      </div>
    </ThemeProvider>
  );
}

export default App;
