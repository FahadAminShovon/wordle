import type { NextPage } from 'next';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { Block } from '../components/Word';
import { NUMBER_OF_COLUMNS, NUMBER_OF_ROWS } from '../constants/variables';
import styles from '../styles/Home.module.css';

type RowColumType = {
  rowIdx: number;
  colIdx: number;
};

const Home: NextPage = () => {
  const [blocks, setBlocks] = useState<string[][]>([]);

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
          gridCopy[rowIdx][colIdx] = '';
          if (colIdx === 0) {
            setTimeout(() => {
              updateFocus({ rowIdx, colIdx: 0 });
            }, 100);
          }
          updateFocus({ rowIdx, colIdx: prevCol });
          break;
        }
        case 'Enter': {
          if (colIdx === NUMBER_OF_COLUMNS - 1) {
            if (rowIdx !== NUMBER_OF_ROWS - 1) {
              updateFocus({ rowIdx: rowIdx + 1, colIdx: 0 });
            } else {
              //todo: handle game over
            }
          }
          break;
        }
        default: {
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
