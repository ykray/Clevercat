import { useNavigate } from 'react-router-dom';

// Assets
import styles from '../assets/sass/_variables.scss';

// MUI
import { IconButton, Stack } from '@mui/material';
import { SendRounded } from '@mui/icons-material';

export default function FloatingAsk() {
  const navigate = useNavigate();

  return (
    <div className={'floating-ask'} onClick={() => navigate('/ask')}>
      <Stack direction={'row'} alignItems={'center'} spacing={'20px'}>
        <p>Ask a question!</p>
        <IconButton>
          <SendRounded />
        </IconButton>
      </Stack>
    </div>
  );
}
