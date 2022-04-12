export const randomColor = (): string => {
  const colors: string[] = [
    '#5dda0a',
    '#f858cd',
    '#5c549d',
    '#ffbc1a',
    '#52e9dd',
  ];
  const randomColor: string = colors[Math.floor(Math.random() * colors.length)];

  return randomColor;
};
