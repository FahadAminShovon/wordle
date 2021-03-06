import type { NextPage } from 'next';
import Head from 'next/head';
import { ReactNode, useEffect, useState } from 'react';
import { Modal } from '../components/Modal/Modal';
import { Block } from '../components/Word';
import { NUMBER_OF_COLUMNS, NUMBER_OF_ROWS } from '../constants/variables';
import styles from '../styles/Home.module.css';
import { getBlockGrid, isWinner } from '../utils/helpers';

type RowColumType = {
  rowIdx: number;
  colIdx: number;
};
type PropType = {
  correctWord: string;
};

const Home: NextPage<PropType> = ({ correctWord }) => {
  const [blocks, setBlocks] = useState<string[][]>([]);
  const [completeRows, setCompleteRows] = useState<number[]>([]);
  const [result, setResult] = useState<string>('');
  const [showModal, setShowModal] = useState(false);
  const openModal = () => setShowModal(true);
  const [label, setLabel] = useState('');
  // const closeModal = setShowModal(false);

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

  const handleGameOver = () => {
    const res = blocks
      .map((block) => {
        return getBlockGrid({
          correctString: correctWord,
          currentString: block.join(''),
        });
      })
      .join('\n');
    setResult(res);
    openModal();
  };

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
      const currentWord = blocks[rowIdx].join('');

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
            setTimeout(() => {
              updateFocus({ rowIdx, colIdx: prevCol });
            }, 100);
          }
          break;
        }
        case 'Enter': {
          if (isWinner({ currentWord, correctWord })) {
            //todo: handle winner
            setCompleteRows([...completeRows, rowIdx]);
            setTimeout(() => {
              handleGameOver();
              setLabel('Congratulations for completing the puzzle');
            }, 500);
            return;
          }
          if (currentWord.length === NUMBER_OF_COLUMNS) {
            setCompleteRows([...completeRows, rowIdx]);
            if (rowIdx !== NUMBER_OF_ROWS - 1) {
              updateFocus({ rowIdx: rowIdx + 1, colIdx: 0 });
            } else {
              setTimeout(() => {
                handleGameOver();
                setLabel("Having a bad day ? Don't worry it's just a game");
              }, 500);
            }
          }
          break;
        }
        default: {
          const updatedString = currentWord.split('');
          updatedString[colIdx] = e.key;
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
      <Modal copyText={result} isOpen={showModal} label={label} />
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
                      correctString={correctWord}
                      currentString={blocks[rowIdx].join('')}
                      currentIndex={colIdx}
                      isComplete={completeRows.includes(rowIdx)}
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

export async function getStaticProps() {
  // Call an external API endpoint to get posts.
  // You can use any data fetching library
  return {
    props: {
      correctWord: process.env.TODAYS_WORD,
    },
  };
}

export default Home;
