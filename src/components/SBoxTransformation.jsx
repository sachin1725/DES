import React, { useState, useEffect, useMemo } from 'react';
import DESInfoCard from '../DESInfoCard';
const S_BOXES = [
  [
    [14, 4, 13, 1, 2, 15, 11, 8, 3, 10, 6, 12, 5, 9, 0, 7],
    [0, 15, 7, 4, 14, 2, 13, 1, 10, 6, 12, 11, 9, 5, 3, 8],
    [4, 1, 14, 8, 13, 6, 2, 11, 15, 12, 9, 7, 3, 10, 5, 0],
    [15, 12, 8, 2, 4, 9, 1, 7, 5, 11, 3, 14, 10, 0, 6, 13]
  ],
  [
    [15, 1, 8, 14, 6, 11, 3, 4, 9, 7, 2, 13, 12, 0, 5, 10],
    [3, 13, 4, 7, 15, 2, 8, 14, 12, 0, 1, 10, 6, 9, 11, 5],
    [0, 14, 7, 11, 10, 4, 13, 1, 5, 8, 12, 6, 9, 3, 2, 15],
    [13, 8, 10, 1, 3, 15, 4, 2, 11, 6, 7, 12, 0, 5, 14, 9]
  ],
  [
    [10, 0, 9, 14, 6, 3, 15, 5, 1, 13, 12, 7, 11, 4, 2, 8],
    [13, 7, 0, 9, 3, 4, 6, 10, 2, 8, 5, 14, 12, 11, 15, 1],
    [13, 6, 4, 9, 8, 15, 3, 0, 11, 1, 2, 12, 5, 10, 14, 7],
    [1, 10, 13, 0, 6, 9, 8, 7, 4, 15, 14, 3, 11, 5, 2, 12]
  ],
  [
    [7, 13, 14, 3, 0, 6, 9, 10, 1, 2, 8, 5, 11, 12, 4, 15],
    [13, 8, 11, 5, 6, 15, 0, 3, 4, 7, 2, 12, 1, 10, 14, 9],
    [10, 6, 9, 0, 12, 11, 7, 13, 15, 1, 3, 14, 5, 2, 8, 4],
    [3, 15, 0, 6, 10, 1, 13, 8, 9, 4, 5, 11, 12, 7, 2, 14]
  ],
  [
    [2, 12, 4, 1, 7, 10, 11, 6, 8, 5, 3, 15, 13, 0, 14, 9],
    [14, 11, 2, 12, 4, 7, 13, 1, 5, 0, 15, 10, 3, 9, 8, 6],
    [4, 2, 1, 11, 10, 13, 7, 8, 15, 9, 12, 5, 6, 3, 0, 14],
    [11, 8, 12, 7, 1, 14, 2, 13, 6, 15, 0, 9, 10, 4, 5, 3]
  ],
  [
    [12, 1, 10, 15, 9, 2, 6, 8, 0, 13, 3, 4, 14, 7, 5, 11],
    [10, 15, 4, 2, 7, 12, 9, 5, 6, 1, 13, 14, 0, 11, 3, 8],
    [9, 14, 15, 5, 2, 8, 12, 3, 7, 0, 4, 10, 1, 13, 11, 6],
    [4, 3, 2, 12, 9, 5, 15, 10, 11, 14, 1, 7, 6, 0, 8, 13]
  ],
  [
    [4, 11, 2, 14, 15, 0, 8, 13, 3, 12, 9, 7, 5, 10, 6, 1],
    [13, 0, 11, 7, 4, 9, 1, 10, 14, 3, 5, 12, 2, 15, 8, 6],
    [1, 4, 11, 13, 12, 3, 7, 14, 10, 15, 6, 8, 0, 5, 9, 2],
    [6, 11, 13, 8, 1, 4, 10, 7, 9, 5, 0, 15, 14, 2, 3, 12]
  ],
  [
    [13, 2, 8, 4, 6, 15, 11, 1, 10, 9, 3, 14, 5, 0, 12, 7],
    [1, 15, 13, 8, 10, 3, 7, 4, 12, 5, 6, 11, 0, 14, 9, 2],
    [7, 11, 4, 1, 9, 12, 14, 2, 0, 6, 10, 13, 15, 3, 5, 8],
    [2, 1, 14, 7, 4, 10, 8, 13, 15, 12, 9, 0, 3, 5, 6, 11]
  ]
];

const SBoxTransformation = ({ xorOutput }) => {
  const [selectedSBox, setSelectedSBox] = useState(0);
  const [currentResult, setCurrentResult] = useState(null);

  const chunks = useMemo(() => {
    const normalizedInput = String(xorOutput).replace(/[^01]/g, '');
    const result = [];
    for (let i = 0; i < normalizedInput.length; i += 6) {
      result.push(normalizedInput.slice(i, i + 6));
    }
    return result;
  }, [xorOutput]);

  useEffect(() => {
    const currentChunk = chunks[selectedSBox];
    if (currentChunk) {
      const row = parseInt(currentChunk[0] + currentChunk[5], 2);
      const col = parseInt(currentChunk.slice(1, 5), 2);
      const value = S_BOXES[selectedSBox][row][col];
      setCurrentResult({ row, col, value, input: currentChunk });
    }
  }, [selectedSBox, chunks]);

  const renderInputBits = (input) => {
    if (!input) return null;

    return (
      <div className="font-mono space-x-1">
        <span className="bg-blue-100 px-2 rounded ml-1 ">{input[0]}</span>
        <span className="bg-blue-300 px-2 rounded ">{input.slice(1, 5).split('').join('')}</span>
        <span className="bg-blue-100 px-2 rounded ">{input[5]}</span>
      </div>
    );
  };

  const renderColHeaders = () => {
    return Array.from({ length: 16 }, (_, i) => i).map(idx => (
      <div
        key={idx}
        className={`w-8 text-center text-xs ${currentResult && currentResult.col === idx ? 'bg-blue-300' : ''}`}
      >
        {idx.toString(2).padStart(4, '0')}
      </div>
    ));
  };

  return (
    <div className="w-full bg-white shadow border border-gray-300 text-sm md:p-11">
      <div className="flex items-center justify-between p-2 border-b-4">
       <div className='flex'>
        <DESInfoCard stage='sbox' />
        <select
          className="border rounded px-2 py-1 text-sm"
          value={selectedSBox}
          onChange={(e) => setSelectedSBox(Number(e.target.value))}
        >
          {S_BOXES.map((_, idx) => (
            <option key={idx} value={idx}>S-Box {idx + 1}</option>
          ))}
        </select>
        </div>
        <div className="md:text-lg flex mx-auto">
          <div>Input:</div>
          {renderInputBits(chunks[selectedSBox])}
        </div>
        {currentResult && (
          <div className="md:text-lg px-4 py-2 rounded w-fit">
            Output: {currentResult.value} ({currentResult.value.toString(2).padStart(4, '0')})
          </div>
        )}
      </div>

      <div className="p-2">
        <div className="overflow-x-auto">
          <div className="flex">
            <div className="mr-1 pt-6 text-xs font-bold">Row</div>
            <div>
              <div className="flex mb-1">
                <div className="w-6 mr-1"></div>
                {renderColHeaders()}
              </div>
              {S_BOXES[selectedSBox].map((row, rowIdx) => (
                <div key={rowIdx} className="flex">
                  <div
                    className={`w-6 flex items-center justify-center text-xs mr-1 ${currentResult && currentResult.row === rowIdx ? 'bg-blue-100' : ''
                      }`}
                  >
                    {rowIdx.toString(2).padStart(2, '0')}
                  </div>
                  {row.map((value, colIdx) => (
                    <div
                      key={colIdx}
                      className={`w-8 h-8 flex items-center justify-center border ${currentResult &&
                          currentResult.row === rowIdx &&
                          currentResult.col === colIdx
                          ? 'bg-green-200 font-bold'
                          : currentResult &&
                            (currentResult.row === rowIdx || currentResult.col === colIdx)
                            ? 'bg-gray-50'
                            : 'bg-white'
                        }`}
                    >
                      {value}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SBoxTransformation;