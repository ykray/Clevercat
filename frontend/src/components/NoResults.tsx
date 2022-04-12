import React from 'react';

// MUI
import { Button, Stack } from '@mui/material';
import { RateReviewRounded as AskIcon } from '@mui/icons-material';

// Assets
import NoResultsImage from '../assets/images/no-results.png';

export default function NoResults() {
  return (
    <Stack alignItems={'center'} justifyContent={'center'} spacing={8}>
      <img
        className={'no-results wobble'}
        src={NoResultsImage}
        alt={'No results placeholder'}
      />
      <Button className="button-primary" endIcon={<AskIcon />}>
        Be the first to ask!
      </Button>
    </Stack>
  );
}
