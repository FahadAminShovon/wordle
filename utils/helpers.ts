export const isWinner = ({
  correctWord,
  currentWord,
}: {
  correctWord: string;
  currentWord: string;
}) => correctWord.toLowerCase() === currentWord.toLowerCase();

type GetColorsPropType = {
  currentString: string;
  correctString: string;
  currentIndex: number;
  value: string;
  isComplete: boolean;
};

type StatusType = 'black' | 'green' | 'yellow';

type GetColorsReturnType = {
  borderColor: string;
  backgroundColor: string;
  textColor: string;
  status: StatusType;
};
export const getColors = ({
  correctString,
  currentIndex,
  currentString,
  value,
  isComplete,
}: GetColorsPropType): GetColorsReturnType => {
  let borderColor = 'border-zinc-900';
  let backgroundColor = 'bg-slate-800';
  let textColor = 'text-slate-100';
  let status: StatusType = 'black';

  if (isComplete) {
    if (
      correctString[currentIndex].toLowerCase() ===
      currentString[currentIndex].toLowerCase()
    ) {
      borderColor = 'border-inherit';
      backgroundColor = 'bg-emerald-700';

      status = 'green';
    } else if (correctString.toLowerCase().includes(value.toLowerCase())) {
      let allOccurances: number[] = [];
      let correctOccurances: number[] = [];
      let potentialWrongOccurances: number[] = [];
      currentString
        .toLowerCase()
        .split('')
        .forEach((o, idx) => {
          if (o === value.toLowerCase()) {
            allOccurances.push(idx);
          }
        });
      correctString
        .toLowerCase()
        .split('')
        .forEach((o, idx) => {
          if (o === value.toLowerCase()) {
            correctOccurances.push(idx);
          }
        });

      currentString
        .toLowerCase()
        .split('')
        .forEach((char, idx) => {
          if (char === correctString.toLowerCase()[idx]) {
            correctOccurances = correctOccurances.filter(
              (occurance) => occurance !== idx
            );
          }
        });

      potentialWrongOccurances = allOccurances
        .filter((occurance) => !correctOccurances.includes(occurance))
        .slice(0, correctOccurances.length);

      if (potentialWrongOccurances.includes(currentIndex)) {
        status = 'yellow';
        borderColor = 'border-inherit';
        backgroundColor = 'bg-amber-400';
      }
    }
  }

  return {
    borderColor,
    backgroundColor,
    textColor,
    status,
  };
};
