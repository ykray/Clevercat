import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import reactStringReplace from 'react-string-replace';

// Components
import TopicHierarchy from './TopicHierarchy';
import NoResults from './NoResults';

// MUI
import { Fade, Grow, Stack } from '@mui/material';

// Data + Utils
import { Answer, QuestionPost } from '../utils/Types';

type Props = {
  searchQuery?: string | null;
  posts?: QuestionPost[];
  answers?: Answer[];
  hideTopic?: boolean;
  showQuestionBody?: boolean;
  hideMoreAnswers?: boolean;
};
export const Feed = ({
  searchQuery = null,
  posts,
  hideTopic = false,
  showQuestionBody = false,
  hideMoreAnswers = false,
}: Props) => {
  const postsNum = posts?.length || 0;

  const [growIn, setGrowIn] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    setGrowIn(true);
    setFadeIn(true);
  }, [posts]);

  return (
    <Stack className={'feed'} spacing={3}>
      {posts && postsNum > 0 ? (
        posts.map((post) => {
          const answers = post.answers ?? [];

          return (
            <Grow in={growIn} timeout={500} key={post.question.qid}>
              <Fade in={fadeIn} timeout={800}>
                <Link to={`/q/${post.question.qid}`}>
                  <div className={'feed-result'}>
                    {!hideTopic ? (
                      <TopicHierarchy noClick topicPath={post.question.topic} />
                    ) : null}
                    <h2>
                      {searchQuery
                        ? reactStringReplace(
                            post.question.title,
                            searchQuery,
                            (match, i) => (
                              <span className={'search-hit-title'}>
                                {match}
                              </span>
                            )
                          )
                        : post.question.title}
                    </h2>
                    <div>
                      {answers.length > 0 ? (
                        searchQuery ? (
                          reactStringReplace(
                            answers[0].body,
                            searchQuery,
                            (match, i) => (
                              <span className={'search-hit-body'}>{match}</span>
                            )
                          )
                        ) : (
                          <Stack
                            alignItems={'flex-start'}
                            justifyContent={'center'}
                            spacing={2}
                          >
                            <p className={'feed-result-body'}>
                              {showQuestionBody
                                ? post.question.body
                                : answers[0].body}
                            </p>

                            {!hideMoreAnswers && answers.length > 1 ? (
                              <span className={'feed-more-answers'}>
                                + {answers.length - 1} more answer
                                {answers.length - 1 === 1 ? '' : 's'}
                              </span>
                            ) : null}
                          </Stack>
                        )
                      ) : (
                        <p style={{ fontStyle: 'italic' }}>No answers yet</p>
                      )}
                    </div>
                  </div>
                </Link>
              </Fade>
            </Grow>
          );
        })
      ) : searchQuery ? (
        <NoResults />
      ) : null}
    </Stack>
  );
};

export default Feed;
