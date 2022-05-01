import { useState, useEffect } from 'react';
import { format } from 'date-fns';

// Data
import { Author, AuthorType } from '../utils/Types';

// MUI
import { Stack } from '@mui/material';
import API from '../data/FrontendAPI';

type Props = {
  uid: string | undefined; // to fetch user
  authorType?: AuthorType | null;
  timestamp?: Date;
};

const AuthorComponent = ({ uid, authorType = null, timestamp }: Props) => {
  const [author, setAuthor] = useState<Author>();

  useEffect(() => {
    if (uid) {
      API.Users.getUser(uid).then((user) => {
        setAuthor({
          user: user,
          authorType: authorType,
          timestamp: timestamp,
        });
      });
    }
  });

  // Functions
  const renderTimestamp = () => {
    if (author && author.timestamp) {
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
    if (author) {
      const letter = author.user.username[0].toUpperCase();

      return (
        <div
          onClick={() => {
            window.location.href = `/@${author.user.username}`;
          }}
          className={'author-avatar'}
          style={{
            backgroundColor: author.user.color,
          }}
        >
          {letter}
        </div>
      );
    }
  };

  const getClassName = () => {
    if (authorType !== null) {
      if (authorType === AuthorType.Asker) {
        return 'author-asker';
      } else {
        return 'author-answerer';
      }
    }
    return 'author-answerer';
  };

  const renderAuthorStatus = () => {
    if (author) {
      const statusClassName = author.user.status.split(' ').reverse().pop();

      return (
        <div className={`author-status ${statusClassName}`}>
          <p>{author.user.status}</p>
        </div>
      );
    } else {
      return null;
    }
  };

  return author ? (
    <div className={`author ${getClassName()}`}>
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
            {renderAuthorStatus()}
          </Stack>
        </Stack>
      </Stack>
    </div>
  ) : null;
};

export default AuthorComponent;
