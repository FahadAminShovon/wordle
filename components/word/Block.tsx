import React, { ReactChild } from 'react';

type PropType = {
  value?: string;
  onChange: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  name: string;
};

const Block = ({ value = '', onChange, name }: PropType) => {
  return (
    <div className=' border-zinc-900 border-2 my-2 flex items-center justify-center rounded-md bg-slate-600 overflow-hidden'>
      <div className='bg-slate-800 h-16 w-16 flex items-center justify-center'>
        <input
          className='bg-slate-800 text-5xl text-slate-100 font-semibold outline-none uppercase w-16  text-center cursor-default caret-transparent'
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
