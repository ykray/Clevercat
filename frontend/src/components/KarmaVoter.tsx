import React, { useEffect, useState, useContext } from 'react';

// Assets
import styles from '../assets/sass/_variables.scss';
import BestAnswerIcon from '../assets/images/best-answer-icon.png';

// Data
import { Answer, KarmaVote, VoteType } from '../utils/Types';
import API from '../data/FrontendAPI';

// MUI
import { IconButton, Stack, Tooltip } from '@mui/material';
import {
  KeyboardArrowUp as UpvoteIcon,
  KeyboardArrowDown as DownvoteIcon,
} from '@mui/icons-material';
import { UserContext } from '../App';

type Props = {
  answer: Answer;
};

export const KarmaVoter = ({ answer }: Props) => {
  const currentUser = useContext(UserContext);
  const [karmaCount, setKarmaCount] = useState<number>(0);
  const [vote, setVote] = useState<number>(0);

  useEffect(() => {
    if (currentUser) {
      API.Answers.checkIfVoted(
        {
          qid: answer.qid,
          uid: answer.uid,
        },
        currentUser
      ).then((voted) => {
        setVote(voted);
      });
    }

    API.Answers.getKarmaCount({
      qid: answer.qid,
      uid: answer.uid,
    }).then((count: number) => {
      setKarmaCount(count);
    });
  }, []);

  // Functions
  const handleUpvote = () => {
    if (currentUser) {
      const karmaVote: KarmaVote = {
        qid: answer.qid,
        uid: answer.uid,
        voter_uid: currentUser,
        vote: VoteType.Upvote,
      };

      API.Answers.vote(karmaVote)
        .then((res) => {
          setKarmaCount(karmaCount + 1);
          setVote(1);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const handleDownvote = () => {
    if (currentUser) {
      const karmaVote: KarmaVote = {
        qid: answer.qid,
        uid: answer.uid,
        voter_uid: currentUser,
        vote: VoteType.Downvote,
      };

      API.Answers.vote(karmaVote)
        .then((res) => {
          setKarmaCount(karmaCount - 1);
          setVote(-1);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const handleBestAnswer = () => {
    if (currentUser) {
      API.Answers.selectBestAnswer(answer).then((res) => {
        window.location.reload();
      });
    }
  };

  const renderBestAnswerBadge = () => {
    if (answer.q_uid === currentUser) {
      // Allow best answer selection
      return (
        <Tooltip
          title={answer.bestAnswer ? 'Best answer' : 'Select as best answer'}
          placement={'right'}
          arrow
        >
          <IconButton
            name="upvote"
            className={'best-answer-icon'}
            onClick={handleBestAnswer}
          >
            <img
              src={BestAnswerIcon}
              alt={'best answer icon'}
              style={{
                filter: answer.bestAnswer
                  ? 'saturate(100%) brightness(100%)'
                  : '',
              }}
            />
          </IconButton>
        </Tooltip>
      );
    } else {
      // Viewer, show best answers but disable selection
      return answer.bestAnswer ? (
        <Tooltip title={'Best answer'} placement={'right'} arrow>
          <IconButton
            name="upvote"
            className={'best-answer-icon'}
            onClick={handleBestAnswer}
          >
            <img
              src={BestAnswerIcon}
              alt={'best answer icon'}
              style={{
                filter: answer.bestAnswer
                  ? 'saturate(100%) brightness(100%)'
                  : '',
              }}
            />
          </IconButton>
        </Tooltip>
      ) : null;
    }
  };

  return (
    <div className={'karma-container'}>
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
                width: 35,
                height: 35,
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
                width: 35,
                height: 35,
              }}
            />
          </IconButton>
        </Tooltip>
        {renderBestAnswerBadge()}
      </Stack>
    </div>
  );
};

export default KarmaVoter;
