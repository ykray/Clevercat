import React, { useState } from 'react';

// MUI
import {
  Button,
  FormControl,
  InputLabel,
  ListSubheader,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
} from '@mui/material';

// Data
import topics, { Topic } from '../data/Topics';

type Props = {};

const Ask = ({}: Props) => {
  const [selectedTopic, setSelectedTopic] = useState<string>();
  const [title, setTitle] = useState<string>('');
  const [body, setBody] = useState<string>('');
  const [errorTitle, setErrorTitle] = useState<boolean>(false);
  const [errorBody, setErrorBody] = useState<boolean>(false);

  const handleTopicSelect = (e: SelectChangeEvent) => {
    setSelectedTopic(e.target.value);
  };

  const renderTopics = () => {
    return topics.map((topic: Topic) => {
      return topic.subTopics.map((subTopic, i) => {
        if (i === 0) {
          return (
            <ListSubheader>
              <Stack
                direction={'row'}
                alignItems={'center'}
                justifyContent={'flex-start'}
              >
                {topic.icon}
                {topic.category}
              </Stack>
            </ListSubheader>
          );
        }
        return <MenuItem value={subTopic}>{subTopic}</MenuItem>;
      });
    });
  };

  const ask = () => {
    if (title) {
      if (body) {
        // Handle ask
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
        <FormControl sx={{ m: 1, width: 200 }}>
          <InputLabel htmlFor="grouped-select">Topic</InputLabel>

          <Select
            value={selectedTopic}
            onChange={handleTopicSelect}
            id="topic-select"
            label="Topic"
          >
            {renderTopics()}
          </Select>
        </FormControl>

        <Button variant={'contained'} style={{ width: 'auto' }} onClick={ask}>
          Ask Question
        </Button>
      </Stack>
    </div>
  );
};

export default Ask;
