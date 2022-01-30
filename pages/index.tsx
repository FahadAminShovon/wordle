import type { NextPage } from 'next';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { Block } from '../components/Word';
import {
  CORRECT_WORD,
  NUMBER_OF_COLUMNS,
  NUMBER_OF_ROWS,
} from '../constants/variables';
import styles from '../styles/Home.module.css';
import { isWinner } from '../utils/helpers';

type RowColumType = {
  rowIdx: number;
  colIdx: number;
};

const Home: NextPage = () => {
  const [blocks, setBlocks] = useState<string[][]>([]);
  const [currentWord, setCurrentWord] = useState('');

  useEffect(() => {
    let blockGrid: string[][] = [];
    for (let i = 0; i < NUMBER_OF_ROWS; i += 1) {
      const currentBlock = [];
      for (let j = 0; j < NUMBER_OF_COLUMNS; j += 1) {
        currentBlock[j] = '';
      }
      blockGrid[i] = currentBlock;
    }
    setBlocks(blockGrid);
  }, []);

  const updateFocus = ({ rowIdx, colIdx }: RowColumType) => {
    const nodes = document.getElementsByName(`${rowIdx}${colIdx}`);
    if (nodes.length > 0) {
      nodes[0].focus();
    }
  };

  useEffect(() => {
    updateFocus({ rowIdx: 0, colIdx: 0 });
  }, [blocks.length]);

  const genericOnChange =
    ({ rowIdx, colIdx }: RowColumType) =>
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (
        !/^[a-zA-Z]$/.test(e.key) &&
        e.key !== 'Backspace' &&
        e.key !== 'Enter'
      ) {
        return;
      }

      const gridCopy = [...blocks];

      switch (e.key) {
        case 'Backspace': {
          let prevCol = colIdx - 1;
          if (gridCopy[rowIdx][colIdx]) {
            gridCopy[rowIdx][colIdx] = '';
          } else {
            gridCopy[rowIdx][prevCol] = '';
          }
          if (colIdx === 0) {
            setTimeout(() => {
              updateFocus({ rowIdx, colIdx: 0 });
            }, 100);
          } else {
            setCurrentWord(currentWord.slice(0, currentWord.length - 1));
            setTimeout(() => {
              updateFocus({ rowIdx, colIdx: prevCol });
            }, 100);
          }
          break;
        }
        case 'Enter': {
          if (isWinner({ currentWord, correctWord: CORRECT_WORD })) {
            //todo: handle winner
            alert('winner');
            return;
          }
          if (
            colIdx === NUMBER_OF_COLUMNS - 1 &&
            currentWord.length >= NUMBER_OF_COLUMNS
          ) {
            if (rowIdx !== NUMBER_OF_ROWS - 1) {
              updateFocus({ rowIdx: rowIdx + 1, colIdx: 0 });
            } else {
              //todo: handle game over
              alert('game over');
            }
            setCurrentWord('');
          }
          break;
        }
        default: {
          const updatedString = currentWord.split('');
          updatedString[colIdx] = e.key;
          setCurrentWord(updatedString.join(''));
          let nextCol = colIdx + 1;
          gridCopy[rowIdx][colIdx] = e.key;
          if (colIdx === NUMBER_OF_COLUMNS - 1) {
            setTimeout(() => {
              updateFocus({
                rowIdx,
                colIdx: NUMBER_OF_COLUMNS - 1,
              });
            }, 100);
          } else {
            updateFocus({ rowIdx, colIdx: nextCol });
          }
        }
      }
      setBlocks([...gridCopy]);
    };

  return (
    <div className={styles.container}>
      <Head>
        <title>Wordle</title>
        <meta name='description' content='wordle clone' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <div
        className='h-screen bg-slate-700 flex items-center justify-center'
        onMouseDown={(e) => {
          e.preventDefault();
        }}
      >
        <div>
          {blocks.map((row, rowIdx) => {
            return (
              <div key={rowIdx} className='flex gap-3'>
                {row.map((column, colIdx) => {
                  const onChange = genericOnChange({ rowIdx, colIdx });
                  return (
                    <Block
                      key={column + colIdx}
                      value={column}
                      onChange={onChange}
                      name={`${rowIdx}${colIdx}`}
                    />
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Home;
