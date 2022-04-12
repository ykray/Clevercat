import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import reactStringReplace from 'react-string-replace';

// MUI
import { Fade, Grow, Stack } from '@mui/material';

// Data
import { QuestionPost } from '../utils/Types';
import NoResults from './NoResults';

type Props = {
  searchQuery?: string | null;
  posts: QuestionPost[];
};
export const Feed = ({ searchQuery = null, posts }: Props) => {
  const postsNum = posts?.length || 0;

  const [grow, setGrow] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    setGrow(true);
    setFadeIn(true);
  }, [posts]);

  return (
    <Stack className={'feed'} spacing={3}>
      {postsNum > 0 ? (
        posts.map((post) => {
          const answers = post.answers ?? [];

          // TODO: - Prioritize best answers
          return (
            <Grow in={grow} timeout={500} key={post.question.qid}>
              <Fade in={fadeIn} timeout={800}>
                <Link to={`/q/${post.question.qid}`}>
                  <div className={'search-result'}>
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

                    <p>
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
                          answers[0].body
                        )
                      ) : (
                        <span style={{ fontStyle: 'italic' }}>
                          No answers yet
                        </span>
                      )}
                    </p>
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
