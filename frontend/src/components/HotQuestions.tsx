import React, { useEffect, useState } from 'react';

// Assets
import styles from '../assets/sass/_variables.scss';

// MUI
import { Stack } from '@mui/material';
import { Whatshot as HotIcon } from '@mui/icons-material';
// Data
import API from '../data/FrontendAPI';

// Utils
import { QuestionPost } from '../utils/Types';

// Components
import Feed from './Feed';

export default function HotQuestions() {
  const [posts, setPosts] = useState<QuestionPost[]>([]);

  useEffect(() => {
    API.getHotQuestions().then((results) => {
      setPosts(results);
    });
  }, []);

  const renderFeed = () => {
    return posts ? <Feed posts={posts} /> : null;
  };

  return (
    <>
      <Stack
        direction={'row'}
        justifyContent={'flex-start'}
        alignItems={'center'}
        spacing={'5px'}
      >
        <HotIcon
          style={{
            color: styles.color_secondary_500,
            width: 23,
            height: 23,
            marginTop: -4,
          }}
        />
        <h1>Hot Questions</h1>
      </Stack>
      {renderFeed()}
    </>
  );
}
