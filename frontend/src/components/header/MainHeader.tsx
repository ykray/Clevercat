// MUI
import { Stack } from '@mui/material';

// Components
import SearchBar from '../SearchBar';
import UserHeader from './UserHeader';

export default function MainHeader() {
  return (
    <Stack
      direction={'row'}
      alignItems={'flex-start'}
      justifyContent={'space-between'}
      spacing={2}
    >
      <SearchBar />
      <div className={'hide-on-mobile'}>
        <UserHeader />
      </div>
    </Stack>
  );
}
