import React from 'react';

// MUI
import {
  Button,
  FormControl,
  InputLabel,
  ListSubheader,
  MenuItem,
  Select,
  Stack,
  TextField,
} from '@mui/material';
import {
  Science as ScienceIcon,
  Memory as TechIcon,
  Restaurant as FoodIcon,
} from '@mui/icons-material';

type Props = {};

const Ask = ({}: Props) => {
  const topics = [
    {
      icon: (
        <ScienceIcon
          style={{ marginTop: -3, paddingRight: 6, width: 20, height: 20 }}
        />
      ),
      category: 'Science',
      topics: ['Computer Science', 'Physics', 'Biology', 'Astronomy'],
    },
    {
      icon: (
        <TechIcon
          style={{ marginTop: -3, paddingRight: 6, width: 23, height: 23 }}
        />
      ),
      category: 'Technology',
      topics: [
        'Electronics',
        'Smartphones',
        'Software',
        'Artificial Intelligence',
      ],
    },
    {
      icon: (
        <FoodIcon
          style={{ marginTop: -3, paddingRight: 6, width: 18, height: 18 }}
        />
      ),
      category: 'Food',
      topics: ['Baking', 'Cooking', 'Recipes'],
    },
  ];

  const renderTopics = () => {
    return topics.map((items) => {
      return items.topics.map((topic, i) => {
        if (i === 0) {
          return (
            <>
              <ListSubheader>
                <Stack
                  direction={'row'}
                  alignItems={'center'}
                  justifyContent={'flex-start'}
                >
                  {items.icon}
                  {items.category}
                </Stack>
              </ListSubheader>
              <MenuItem value={1}>{topic}</MenuItem>
            </>
          );
        }
        return <MenuItem value={2}>{topic}</MenuItem>;
      });
    });
  };

  return (
    <div>
      <h1>Ask a Question</h1>

      <Stack spacing={3}>
        <TextField placeholder={'How to xyz?'} label={'Title'} />
        <TextField
          placeholder={
            'Enter a description to help people understand your question'
          }
          label={'Body'}
        />

        <FormControl sx={{ m: 1, minWidth: 120, maxWidth: 400 }}>
          <InputLabel htmlFor="grouped-select">Topic</InputLabel>
          <Select defaultValue="" id="grouped-select" label="Topic">
            {renderTopics()}
          </Select>
        </FormControl>

        <Button variant={'contained'}>Ask Question</Button>
      </Stack>
    </div>
  );
};

export default Ask;
