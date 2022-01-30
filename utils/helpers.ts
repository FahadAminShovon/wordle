export const isWinner = ({
  correctWord,
  currentWord,
}: {
  correctWord: string;
  currentWord: string;
}) => correctWord.toLowerCase() === currentWord.toLowerCase();
