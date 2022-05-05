// MUI
import { Stack } from '@mui/material';

// Components
import SearchBar from '../../components/search/SearchBar';
import UserHeader from '../../components/header/UserHeader';

export default function MainHeader() {
  return (
    <Stack
      direction={'row'}
      alignItems={'flex-start'}
      justifyContent={'space-between'}
      spacing={2}
      style={{
        paddingBottom: 5,
      }}
    >
      <SearchBar />
      <div className={'hide-on-mobile'}>
        <UserHeader />
      </div>
    </Stack>
  );
}
