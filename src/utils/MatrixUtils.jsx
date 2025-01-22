/* eslint-disable react/display-name */
import React, { useState } from 'react';
import DESInfoCard from '../DESInfoCard';
const Cell = ({
  value,
  onHover,
  onLeave,
  isHighlighted,
  bg = 'bg-gray-100',
  size = 'small' // 'small' | 'large'
}) => {
  const sizeClasses = {
    small: 'w-6 h-6 px-1 py-0.5 text-sm',
    large: 'w-8 h-8 px-2 py-1 text-base'
  };

  return (
    <div
      className={`border rounded transition-colors duration-300 cursor-pointer flex items-center justify-center
        ${sizeClasses[size]} ${bg} ${isHighlighted ? 'bg-blue-300 border-blue-500 border-2' : ''}`}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      {String(value).padStart(2, ' ')}
    </div>
  );
};

const Matrix = ({
  data,
  cols,
  rows,
  highlights,
  onHover,
  onLeave,
  bg,
  cellSize = 'small',
  gapSize = 'small' // 'small' | 'large'
}) => {
  const gapClasses = {
    small: 'gap-0.5',
    large: 'gap-1'
  };

  const actualRows = rows || Math.ceil(data.length / cols);

  return (
    <div className={`grid ${gapClasses[gapSize]} w-fit`}>
      {Array.from({ length: actualRows }, (_, row) => (
        <div key={row} className={`flex ${gapClasses[gapSize]}`}>
          {Array.from({ length: cols }, (_, col) => {
            const idx = row * cols + col;
            return idx < data.length ? (
              <Cell
                key={col}
                value={data[idx]}
                isHighlighted={highlights === idx}
                onHover={() => onHover?.(idx)}
                onLeave={() => onLeave?.()} // Reset highlight on mouse leave
                bg={bg}
                size={cellSize}
              />
            ) : null;
          })}
        </div>
      ))}
    </div>
  );
};

export const createPermutationComponent = ({
  defaultCols = 8,
  defaultRows,
  defaultOutputCols = 8, // Separate default columns for output
  defaultOutputRows, // Separate default rows for output
  defaultLength = 64,
  cellSize = 'small',
  gapSize = 'small',
  spacing = 'normal', // 'normal' | 'compact' | 'wide'
  layout = 'horizontal', // 'horizontal' | 'vertical'

}) => {
  return ({ title, dkey, input, output, table, onHighlight }) => {
    const [highlights, setHighlights] = useState({ input: -1, table: -1, output: -1 });
    const tableCols = table[0].length;

    const handleHover = (type, index) => {
      const newHighlights = { input: -1, table: -1, output: -1 };

      if (type === 'output' || type === 'table') {
        const tableValue = table[Math.floor(index / tableCols)][index % tableCols];
        newHighlights.input = tableValue - 1;
        newHighlights.table = index;
        newHighlights.output = index;
      }

      setHighlights(newHighlights);
      onHighlight?.(newHighlights);
    };

    const handleLeave = () => {
      setHighlights({ input: -1, table: -1, output: -1 });
    };

    const spacingClasses = {
      compact: 'gap-2',
      normal: 'gap-4',
      wide: 'gap-8'
    };

    const layoutClasses = {
      horizontal: 'flex justify-center items-center',
      vertical: 'flex flex-col items-center'
    };

    const inputBits = input || '0'.repeat(defaultLength);
    const outputBits = output || '0'.repeat(defaultLength);

    return (
      <div className="p-4 rounded-lg shadow lg:flex-row flex-col overflow-x-scroll ">
        <div className='flex items-center justify-center'> 
        <DESInfoCard stage={dkey}/>
        <h3 className="text-base font-semibold ">{title}</h3> {/* Added margin bottom */}
        </div>
        <div className={`mt-6 ${layoutClasses[layout]} ${spacingClasses[spacing]} flex-col md:flex-row`}> {/* Added margin top */}
          <div className="">
            <p className="text-sm font-medium mb-1">Input:</p>
            <Matrix
              data={inputBits.split('')}
              cols={defaultCols}
              rows={defaultRows}
              highlights={highlights.input}
              bg="bg-blue-50"
              cellSize={cellSize}
              gapSize={gapSize}
              onHover={(idx) => handleHover('input', idx)}
              onLeave={handleLeave} // Clear highlights on mouse leave
            />
          </div>

          {/* <Matrix
            data={table.flat()}
            cols={tableCols}
            highlights={highlights.table}
            onHover={(idx) => handleHover('table', idx)}
            onLeave={handleLeave} // Clear highlights on mouse leave
            cellSize={cellSize}
            gapSize={gapSize}
            className="mt-4"
          />
           */}
          <div>
            <p className="text-sm font-medium mb-1">Output:</p>
            <Matrix
              data={outputBits.split('')}
              cols={defaultOutputCols} // Use separate output cols
              rows={defaultOutputRows} // Use separate output rows
              highlights={highlights.output}
              onHover={(idx) => handleHover('output', idx)}
              onLeave={handleLeave} // Clear highlights on mouse leave
              bg="bg-green-50"
              cellSize={cellSize}
              gapSize={gapSize}
            />
          </div>
        </div>
      </div>
    );
  };
};
