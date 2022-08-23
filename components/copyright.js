import { Typography, Link } from '@mui/material';

export default function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://caixiang.netlify.app/"  target="_blank">
        Stephen Fan
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}