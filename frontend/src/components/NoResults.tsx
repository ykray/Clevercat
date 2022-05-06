import { Link } from 'react-router-dom';

// MUI
import { Button, Stack } from '@mui/material';
import { RateReviewRounded as AskIcon } from '@mui/icons-material';

// Assets
import NoResultsImage from '../assets/images/no-results.png';

export default function NoResults() {
  return (
    <Stack
      className={'no-results'}
      alignItems={'flex-start'}
      justifyContent={'center'}
      spacing={8}
    >
      <img
        className={'wobble'}
        src={NoResultsImage}
        alt={'No results placeholder'}
      />
      <Button
        component={Link}
        to={'/ask'}
        className="button-primary"
        variant={'outlined'}
        endIcon={<AskIcon />}
      >
        Be the first to ask!
      </Button>
    </Stack>
  );
}
