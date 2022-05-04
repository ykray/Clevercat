import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

// MUI
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
} from '@mui/material';
import {
  Science as ScienceIcon,
  AttachMoney as BusinessIcon,
  Memory as TechnologyIcon,
  Tag as GeneralIcon,
} from '@mui/icons-material';

// Data
import styles from '../assets/sass/_variables.scss';
import API from '../data/FrontendAPI';
import { Question, Topic } from '../utils/Types';

type Props = {};

const Ask = ({}: Props) => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [topics, setTopics] = useState<Topic[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<string | undefined>(
    searchParams.get('topic') ?? undefined
  );
  const [title, setTitle] = useState<string>('');
  const [body, setBody] = useState<string>('');
  const [errorTitle, setErrorTitle] = useState<boolean>(false);
  const [errorBody, setErrorBody] = useState<boolean>(false);
  const [errorTopic, setErrorTopic] = useState<boolean>(false);

  const handleTopicSelect = (e: SelectChangeEvent) => {
    console.log(e.target.value);
    setSelectedTopic(e.target.value);
  };

  useEffect(() => {
    API.getAllTopics().then((topics) => setTopics(topics));
  }, []);

  useEffect(() => {
    setErrorTopic(false);
  }, [selectedTopic]);

  const toTopicPath = (topic: Topic) => {
    return (
      topic.category +
      '.' +
      (topic.subtopic ?? '')
        .replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
          return word.toUpperCase();
        })
        .replace(/\s+/g, '')
    );
  };

  const renderCategoryIcon = (category: string) => {
    const style = {
      width: 15,
      height: 15,
      marginTop: -3,
      marginRight: 4,
      marginLeft: -2,
    };

    switch (category) {
      case 'Science':
        return <ScienceIcon style={style} />;
      case 'Technology':
        return <TechnologyIcon style={style} />;
      case 'Business':
        return <BusinessIcon style={style} />;
      default:
        return <GeneralIcon style={style} />;
    }
  };

  const renderTopics = () => {
    return topics.map((topic) => {
      // is a subtopic
      if (topic.subtopic) {
        return (
          <MenuItem key={topic.subtopic} value={toTopicPath(topic)}>
            {topic.subtopic}
          </MenuItem>
        );
      } else {
        // is a category
        return (
          <MenuItem
            key={topic.category}
            value={topic.category}
            style={{
              marginTop: 10,
              marginBottom: 10,
              fontFamily: 'GilroySemibold',
              textTransform: 'uppercase',
              letterSpacing: '2px',
              fontSize: '0.9rem',
              paddingLeft: 10,
              color:
                topic.category === selectedTopic ? '' : styles.color_text_body,
            }}
          >
            <Stack direction={'row'} alignItems={'center'} spacing={1}>
              {renderCategoryIcon(topic.category)}
              {topic.category}
            </Stack>
          </MenuItem>
        );
      }
    });
  };

  const handleClick = () => {
    if (title) {
      if (body) {
        if (selectedTopic) {
          const question: Question = {
            title,
            body,
            topic: selectedTopic,
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
            value={selectedTopic?.split('.').pop()}
            onChange={handleTopicSelect}
            id="topic-select"
            label="Topic"
            style={{
              color: styles.color_primary_500,
              width: 250,
            }}
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
