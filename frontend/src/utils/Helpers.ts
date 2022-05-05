import { format } from 'date-fns';

export const randomColor = (): string => {
  const colors: string[] = [
    '#5dda0a',
    '#f858cd',
    '#5c549d',
    '#ffbc1a',
    '#52e9dd',
    '#ffad5c',
    '#a3d837',
    '#6f37d8',
    '#1ac9bb',
    '#52c3ed',
  ];
  const randomColor: string = colors[Math.floor(Math.random() * colors.length)];

  return randomColor;
};

export const formatTimestamp = (timestamp: Date) => {
  return format(new Date(timestamp), "MMMM d, Y 'at' h:mm aaa");
};
