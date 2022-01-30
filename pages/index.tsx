import type { NextPage } from 'next';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import Block from '../components/word/Block';
import { NUMBER_OF_COLUMNS, NUMBER_OF_ROWS } from '../constants/variables';
import styles from '../styles/Home.module.css';

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

  const updateFocus = ({ row, column }: { row: Number; column: number }) => {
    console.log({ row, column });
    const nodes = document.getElementsByName(`${row}${column}`);
    if (nodes.length > 0) {
      nodes[0].focus();
    }
  };

  useEffect(() => {
    updateFocus({ row: 0, column: 0 });
  }, [blocks.length]);

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
                  const onChange = (
                    e: React.KeyboardEvent<HTMLInputElement>
                  ) => {
                    if (
                      !/^[a-zA-Z]$/.test(e.key) &&
                      e.key !== 'Backspace' &&
                      e.key !== 'Enter'
                    ) {
                      return;
                    }

                    const gridCopy = [...blocks];

                    if (e.key === 'Backspace') {
                      let prevCol = colIdx - 1;
                      gridCopy[rowIdx][colIdx] = '';
                      if (colIdx === 0) {
                        setTimeout(() => {
                          updateFocus({ row: rowIdx, column: 0 });
                        }, 100);
                      }
                      updateFocus({ row: rowIdx, column: prevCol });
                    } else if (e.key === 'Enter') {
                      if (colIdx === NUMBER_OF_COLUMNS - 1) {
                        if (rowIdx !== NUMBER_OF_ROWS - 1) {
                          console.log('enter', colIdx, rowIdx);
                          updateFocus({ row: rowIdx + 1, column: 0 });
                        } else {
                        }
                      }
                    } else {
                      let nextCol = colIdx + 1;
                      gridCopy[rowIdx][colIdx] = e.key;
                      if (colIdx === NUMBER_OF_COLUMNS - 1) {
                        console.log('I am here', e.key);
                        setTimeout(() => {
                          updateFocus({
                            row: rowIdx,
                            column: NUMBER_OF_COLUMNS - 1,
                          });
                        }, 100);
                      } else {
                        updateFocus({ row: rowIdx, column: nextCol });
                      }
                    }

                    setBlocks([...gridCopy]);
                  };

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
