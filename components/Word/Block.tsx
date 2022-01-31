import React, { useState } from 'react';
import { getColors } from '../../utils/helpers';
import { useEffect } from 'react';

type PropType = {
  value?: string;
  onChange: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  name: string;
  isComplete: boolean;
  currentIndex: number;
  currentString: string;
  correctString: string;
};

const Block = ({
  value = '',
  onChange,
  name,
  isComplete,
  currentIndex,
  currentString,
  correctString,
}: PropType) => {
  const [borderColor, setBorderColor] = useState<string>('border-zinc-900');
  const [backgroundColor, setBackgroundColor] =
    useState<string>('bg-slate-800');
  const [textColor, setTextColor] = useState<string>('text-slate-100');
  useEffect(() => {
    const { borderColor, backgroundColor, textColor } = getColors({
      isComplete,
      value,
      currentIndex,
      currentString,
      correctString,
    });

    setBorderColor(borderColor);
    setBackgroundColor(backgroundColor);
    setTextColor(textColor);
  }, [isComplete]);

  return (
    <div
      className={`${borderColor} border-2 my-2 flex items-center justify-center rounded-md overflow-hidden transition-colors`}
    >
      <div
        className={`${backgroundColor} h-18 w-18 flex items-center justify-center transition-colors`}
      >
        <input
          className={`${backgroundColor} text-5xl ${textColor} font-semibold outline-none uppercase w-16  text-center cursor-default caret-transparent transition-colors`}
          onKeyDown={onChange}
          maxLength={1}
          value={value}
          name={name}
          onChange={() => {}}
          autoComplete='off'
          // onMouseDown={(e) => {
          // e.preventDefault();
          // }}
        />
      </div>
    </div>
  );
};

export default Block;
