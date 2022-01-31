import React from 'react';
import ReactModal from 'react-modal';
import { useEffect } from 'react';

type PropType = {
  isOpen: boolean;
  label: string;
  copyText: string;
};
const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

export const Modal = ({ isOpen, label, copyText }: PropType) => {
  const copyResult = () => {
    navigator.clipboard.writeText(copyText);
  };
  return (
    <ReactModal isOpen={isOpen} style={customStyles}>
      <div className='text-center'>
        <p className='text-zinc-800	text-2xl p-5'>{label}</p>
        <div>
          <div className='mb-4'>
            {copyText.split('\n').map((block) => (
              <p key={block} className='text-2xl'>
                {block}
              </p>
            ))}
          </div>
          <button
            className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer'
            onClick={copyResult}
          >
            <img
              src='https://img.icons8.com/flat-round/64/000000/share--v1.png'
              alt='share'
            />
          </button>
        </div>
      </div>
    </ReactModal>
  );
};
