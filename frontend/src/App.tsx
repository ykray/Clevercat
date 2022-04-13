import { Routes, Route } from 'react-router-dom';

import { ThemeProvider } from '@mui/material';

// Assets
import './assets/sass/App.scss';
import Theme from './assets/Theme';

// Components
import Header from './components/Header';
import QuestionPostComponent from './components/QuestionPostComponent';
import SearchComponent from './components/SearchComponent';
import HotQuestions from './components/HotQuestions';
import Ask from './components/Ask';

function App() {
  return (
    <ThemeProvider theme={Theme}>
      <div className={'wrapper'}>
        <Header />

        <Routes>
          <Route path={'/'} element={<HotQuestions />} />
          <Route path={'/q/:qid'} element={<QuestionPostComponent />} />
          <Route path={'/search'} element={<SearchComponent />} />
          <Route path={'/ask'} element={<Ask />} />
          <Route index element={<HotQuestions />} />
        </Routes>
      </div>
    </ThemeProvider>
  );
}

export default App;
