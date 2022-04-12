import React, { useEffect } from 'react';
import { format } from 'date-fns';
import chroma from 'chroma-js';

// Utils
import { randomColor } from '../utils/Helpers';

// Data
import { Author, AuthorType } from '../utils/Types';

// MUI
import { Stack } from '@mui/material';

type Props = {
  author: Author;
};

const AuthorComponent = ({ author }: Props) => {
  const color = author.user.color ?? randomColor();
  // const colorLighter = chroma(color).set('lab.l', 125).hex('rgb');

  // Functions
  const renderTimestamp = () => {
    if (author.timestamp) {
      const timestamp = format(
        new Date(author.timestamp),
        "MMMM d, Y 'at' h:mm aaa"
      );

      return (
        <div className={'timestamp'}>
          <p>{timestamp}</p>
        </div>
      );
    } else {
      return null;
    }
  };

  const renderAvatar = () => {
    const letter = author.user.username[0].toUpperCase();

    return (
      <div className={'author-avatar'} style={{ backgroundColor: color }}>
        {letter}
      </div>
    );
  };

  return (
    <div
      className={`author ${
        author.authorType === AuthorType.Asker
          ? 'author-asker'
          : 'author-answerer'
      }`}
    >
      <Stack justifyContent={'flex-end'} spacing={'5px'}>
        {renderTimestamp()}
        <Stack
          direction={'row'}
          justifyContent={'flex-start'}
          alignItems={'flex-start'}
          spacing={'10px'}
        >
          {renderAvatar()}
          <Stack
            justifyContent={'center'}
            alignItems={'flex-start'}
            spacing={'4px'}
          >
            <div className={'author-username'}>
              <p>{author.user.username}</p>
            </div>
            <div className={'author-status'}>
              <p>{author.user.status}</p>
            </div>
          </Stack>
        </Stack>
      </Stack>
    </div>
  );
};

export default AuthorComponent;
