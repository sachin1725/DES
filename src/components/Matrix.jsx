import React, { useState } from 'react';
import { ArrowRightIcon } from 'lucide-react';
import DESInfoCard from '../DESInfoCard';
const Cell = ({ value, onHover, isHighlighted, bg = 'bg-gray-100' }) => (
  <div
    className={`px-2 py-1 border rounded transition-colors duration-300 cursor-pointer w-8 h-8 flex items-center justify-center
      ${bg} ${isHighlighted ? 'bg-blue-200 border-blue-500 border-2' : ''}`}
    onMouseEnter={onHover}
  >
    {String(value).padStart(2, ' ')}
  </div>
);

const Matrix = ({ data, cols = 8, highlights, onHover, bg }) => (
  <div className="grid gap-1 w-fit">
    {Array.from({ length: data.length / cols }, (_, row) => (
      <div key={row} className="flex gap-1">
        {Array.from({ length: cols }, (_, col) => {
          const idx = row * cols + col;
          return (
            <Cell
              key={col}
              value={data[idx]}
              isHighlighted={highlights === idx}
              onHover={() => onHover?.(idx)}
              bg={bg}
            />
          );
        })}
      </div>
    ))}
  </div>
);

const PermutationComponent = ({ title, dkey, input, output, table, defaultValue = '0'.repeat(64) }) => {
  const [highlights, setHighlights] = useState({ input: -1, table: -1, output: -1 });

  const handleHover = (type, index) => {
    if (type === 'output') {
      const tableValue = table[Math.floor(index / 8)][index % 8];
      setHighlights({ input: tableValue - 1, table: index, output: index });
    } else if (type === 'table') {
      const tableValue = table.flat()[index];
      setHighlights({ input: tableValue - 1, table: index, output: index });
    }
  };

  const inputBits = input || defaultValue;
  const outputBits = output || defaultValue;

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className='flex justify-center items-center'>
      <DESInfoCard stage={dkey} />
      <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      <div className="grid grid-cols-1 gap-4 items-center justify-items-center md:grid-cols-3">
        <div className="flex flex-col items-center">
          <p className="font-medium mb-2">Input:</p>
          <Matrix
            data={inputBits.split('')}
            highlights={highlights.input}
            bg="bg-blue-50"
          />
        </div>
        <div className="flex flex-col items-center gap-4">
          <ArrowRightIcon size={32} />
          <Matrix
            data={table.flat()}
            highlights={highlights.table}
            onHover={(idx) => handleHover('table', idx)}
          />
        </div>
        <div className="flex flex-col items-center">
          <p className="font-medium mb-2">Output:</p>
          <Matrix
            data={outputBits.split('')}
            highlights={highlights.output}
            onHover={(idx) => handleHover('output', idx)}
            bg="bg-green-50"
          />
        </div>
      </div>
    </div>
  );
};

const IPMatrix = ({ data }) => (
  <PermutationComponent
    title="Initial Permutation"
    dkey="initial"
    input={data?.message}
    output={data?.permuted}
    table={[
      [58, 50, 42, 34, 26, 18, 10, 2],
      [60, 52, 44, 36, 28, 20, 12, 4],
      [62, 54, 46, 38, 30, 22, 14, 6],
      [64, 56, 48, 40, 32, 24, 16, 8],
      [57, 49, 41, 33, 25, 17, 9, 1],
      [59, 51, 43, 35, 27, 19, 11, 3],
      [61, 53, 45, 37, 29, 21, 13, 5],
      [63, 55, 47, 39, 31, 23, 15, 7]
    ]}
  />
);

const FPMatrix = ({ data }) => (
  <PermutationComponent
    title="Final Permutation"
    dkey="final"
    input={data?.swap}
    output={data?.permuted}
    table={[
      [40, 8, 48, 16, 56, 24, 64, 32],
      [39, 7, 47, 15, 55, 23, 63, 31],
      [38, 6, 46, 14, 54, 22, 62, 30],
      [37, 5, 45, 13, 53, 21, 61, 29],
      [36, 4, 44, 12, 52, 20, 60, 28],
      [35, 3, 43, 11, 51, 19, 59, 27],
      [34, 2, 42, 10, 50, 18, 58, 26],
      [33, 1, 41, 9, 49, 17, 57, 25]
    ]}
  />
);

export { IPMatrix, FPMatrix };