import { useState, useEffect } from 'react';

// MUI
import { Stack } from '@mui/material';

// Data
import API from '../../data/FrontendAPI';

// Utils
import { Author, AuthorType } from '../../utils/Types';
import { formatTimestamp } from '../../utils/Helpers';

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
      return (
        <div className={'timestamp'}>
          <p>{formatTimestamp(author.timestamp)}</p>
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
      // IDEA: - Maybe differentiate statuses by color
      const statusClassName = author.user.status.split(' ').reverse().pop();

      return (
        <p className={`author-status ${statusClassName}`}>
          {author.user.status}
        </p>
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
          alignItems={'center'}
          spacing={'10px'}
        >
          {renderAvatar()}
          <Stack
            justifyContent={'center'}
            alignItems={'flex-start'}
            spacing={'3px'}
          >
            <div
              className={'author-username'}
              onClick={() => {
                window.location.href = `/@${author.user.username}`;
              }}
            >
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
