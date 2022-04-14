import React, { useEffect, useState } from 'react';

// assets
import styles from '../assets/sass/_variables.scss';

// data
import { Answer, KarmaVote, VoteType } from '../utils/Types';
import API from '../data/FrontendAPI';

// utils
import { CLIENT_USER } from '../utils/Constants';

// MUI
import { IconButton, Stack, Tooltip } from '@mui/material';
import {
  KeyboardArrowUp as UpvoteIcon,
  KeyboardArrowDown as DownvoteIcon,
} from '@mui/icons-material';

type Props = {
  answer: Answer;
};

export const KarmaVoter = ({ answer }: Props) => {
  const [karmaCount, setKarmaCount] = useState<number>(0);
  const [vote, setVote] = useState<number>(0);

  useEffect(() => {
    API.Answers.checkIfVoted(
      {
        qid: answer.qid,
        uid: answer.uid,
      },
      CLIENT_USER.uid
    ).then((voted) => {
      setVote(voted);
    });

    API.Answers.getKarmaCount({
      qid: answer.qid,
      uid: answer.uid,
    }).then((count: number) => {
      setKarmaCount(count);
    });
  }, []);

  // Functions
  const handleUpvote = () => {
    const karmaVote: KarmaVote = {
      qid: answer.qid,
      uid: answer.uid,
      voter_uid: CLIENT_USER.uid,
      type: VoteType.Upvote,
    };

    API.Answers.vote(karmaVote)
      .then((res) => {
        setKarmaCount(karmaCount + 1);
        setVote(1);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleDownvote = () => {
    const karmaVote: KarmaVote = {
      qid: answer.qid,
      uid: answer.uid,
      voter_uid: CLIENT_USER.uid,
      type: VoteType.Downvote,
    };

    API.Answers.vote(karmaVote)
      .then((res) => {
        setKarmaCount(karmaCount - 1);
        setVote(-1);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="karma-container">
      <Stack justifyContent={'center'} alignItems={'center'}>
        <Tooltip title={'Upvote answer'} placement={'right'} arrow>
          <IconButton
            name="upvote"
            className="karma-upvote"
            onClick={handleUpvote}
            style={{ color: vote === 1 ? styles.color_primary_500 : '' }}
          >
            <UpvoteIcon
              style={{
                width: 40,
                height: 40,
              }}
            />
          </IconButton>
        </Tooltip>
        <span style={{ color: vote === 1 ? styles.color_primary_500 : '' }}>
          {karmaCount}
        </span>
        <Tooltip title={'Downvote answer'} placement={'right'} arrow>
          <IconButton
            name="downvote"
            className="karma-downvote"
            onClick={handleDownvote}
            style={{ color: vote === -1 ? styles.color_text : '' }}
          >
            <DownvoteIcon
              style={{
                width: 40,
                height: 40,
              }}
            />
          </IconButton>
        </Tooltip>
      </Stack>
    </div>
  );
};

export default KarmaVoter;
