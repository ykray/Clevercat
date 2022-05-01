import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

// MUI
import {
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  ListSubheader,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
} from '@mui/material';

// Data
import styles from '../assets/sass/_variables.scss';
import API from '../data/FrontendAPI';
import { Question } from '../utils/Types';

type Props = {};

const Ask = ({}: Props) => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [topics, setTopics] = useState<string[]>([]);
  const [topic, setTopic] = useState<string | undefined>(
    searchParams.get('topic') ?? undefined
  );
  const [title, setTitle] = useState<string>('');
  const [body, setBody] = useState<string>('');
  const [errorTitle, setErrorTitle] = useState<boolean>(false);
  const [errorBody, setErrorBody] = useState<boolean>(false);
  const [errorTopic, setErrorTopic] = useState<boolean>(false);

  const handleTopicSelect = (e: SelectChangeEvent) => {
    setTopic(e.target.value);
  };

  useEffect(() => {
    API.getAllTopics().then((topics: any) => {
      setTopics(topics.map((t: any) => t.topic_path));
    });
  }, []);

  useEffect(() => {
    setErrorTopic(false);
  }, [topic]);

  const renderTopics = () => {
    return topics.map((topicPath: string) => {
      if (!topicPath.includes('.')) {
        return (
          <MenuItem
            key={topicPath}
            value={topicPath}
            style={{
              paddingLeft: 10,
              color:
                topicPath === topic
                  ? styles.color_primary_500
                  : styles.color_muted_300,
            }}
          >
            {topicPath}
          </MenuItem>
        );
      } else {
        const subTopic = topicPath
          .replace(/([A-Z])/g, ' $1') // "SubTopic" -> "Sub Topic"
          .split('.')
          .pop();
        return (
          <MenuItem key={topicPath} value={topicPath}>
            {subTopic}
          </MenuItem>
        );
      }
    });
  };

  const handleClick = () => {
    if (title) {
      if (body) {
        if (topic) {
          const question: Question = {
            title,
            body,
            topic,
          };
          API.Users.askQuestion(question).then((res: any) => {
            navigate(`/q/${res.qid}`);
          });
        } else {
          setErrorTopic(true);
        }
      } else {
        setErrorBody(true);
      }
    } else {
      setErrorTitle(true);
    }
  };

  const handleChange = (e: any) => {
    const name = e.target.name;
    const value = e.target.value;

    if (name === 'title') {
      setErrorTitle(false);
      setTitle(value);
    } else if (name === 'body') {
      setErrorBody(false);
      setBody(value);
    }
  };

  return (
    <div className={'ask-container'}>
      <h1>Ask a question</h1>

      <Stack alignItems={'flex-start'} spacing={3}>
        <div style={{ width: '100%' }}>
          <h3>1. Create a title</h3>
          <TextField
            name={'title'}
            placeholder={'How to xyz?'}
            value={title}
            onChange={handleChange}
            fullWidth
            error={errorTitle}
          />
        </div>
        <div style={{ width: '100%' }}>
          <h3>2. Explain your question</h3>
          <TextField
            name={'body'}
            placeholder={"I've been trying to do xyz but..."}
            value={body}
            onChange={handleChange}
            multiline
            fullWidth
            helperText={
              'Try to be descriptive and provide details to help users better answer your question.'
            }
            error={errorBody}
          />
        </div>

        <h3>3. Choose a topic</h3>
        <p>Choose a subtopic that is a best fit for your question.</p>
        <FormControl sx={{ m: 1 }} error={errorTopic}>
          <InputLabel htmlFor="grouped-select">Topic</InputLabel>

          <Select
            value={topic}
            onChange={handleTopicSelect}
            id="topic-select"
            label="Topic"
            style={{ color: styles.color_primary_500, width: 250 }}
          >
            {renderTopics()}
          </Select>
        </FormControl>

        <Button
          variant={'contained'}
          style={{ width: 'auto' }}
          onClick={handleClick}
        >
          Ask Question
        </Button>
      </Stack>
    </div>
  );
};

export default Ask;
