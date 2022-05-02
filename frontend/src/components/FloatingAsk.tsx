import { useNavigate } from 'react-router-dom';

// MUI
import { IconButton, Stack, Tooltip } from '@mui/material';
import { SendRounded } from '@mui/icons-material';

export default function FloatingAsk() {
  const navigate = useNavigate();

  return (
    <div className={'floating-ask'} onClick={() => navigate('/ask')}>
      <Stack direction={'row'} alignItems={'center'} spacing={'20px'}>
        <Tooltip title={'Ask a question!'} placement={'left'} arrow>
          <IconButton>
            <SendRounded />
          </IconButton>
        </Tooltip>
      </Stack>
    </div>
  );
}
