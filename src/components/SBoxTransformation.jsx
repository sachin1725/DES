import React, { useState, useEffect, useMemo } from 'react';

const S_BOXES = [
  [
    [14, 4, 13, 1, 2, 15, 11, 8, 3, 10, 6, 12, 5, 9, 0, 7],
    [0, 15, 7, 4, 14, 2, 13, 1, 10, 6, 12, 11, 9, 5, 3, 8],
    [4, 1, 14, 8, 13, 11, 2, 12, 9, 7, 3, 10, 15, 6, 0, 5],
    [15, 12, 8, 2, 4, 9, 1, 7, 5, 11, 3, 14, 10, 0, 6, 13],
  ],
  [
    [15, 1, 8, 14, 6, 11, 3, 4, 7, 9, 5, 0, 12, 10, 13, 2],
    [1, 15, 13, 8, 10, 3, 7, 4, 12, 5, 6, 11, 0, 14, 9, 2],
    [7, 11, 4, 1, 9, 12, 14, 2, 0, 6, 10, 13, 15, 3, 5, 8],
    [2, 12, 9, 5, 15, 10, 3, 8, 7, 4, 14, 11, 1, 13, 0, 6],
  ],
  [
    [10, 0, 9, 14, 6, 3, 15, 5, 1, 13, 12, 7, 11, 4, 2, 8],
    [13, 7, 0, 9, 3, 4, 6, 10, 2, 8, 5, 14, 15, 11, 1, 12],
    [13, 6, 4, 10, 9, 3, 5, 15, 12, 2, 8, 14, 1, 11, 7, 0],
    [7, 12, 14, 9, 4, 1, 13, 5, 0, 15, 10, 3, 11, 8, 6, 2],
  ],
  [
    [7, 13, 14, 3, 0, 6, 9, 10, 1, 2, 8, 5, 11, 12, 15, 4],
    [13, 8, 11, 5, 6, 15, 0, 3, 10, 7, 9, 14, 2, 12, 4, 1],
    [13, 15, 0, 11, 1, 10, 7, 9, 14, 3, 5, 12, 8, 2, 4, 6],
    [1, 15, 13, 8, 10, 3, 7, 4, 12, 9, 5, 6, 11, 0, 14, 2],
  ],
  [
    [2, 12, 4, 1, 7, 10, 11, 6, 8, 5, 3, 15, 13, 0, 14, 9],
    [14, 11, 2, 12, 4, 7, 13, 1, 5, 15, 10, 3, 9, 8, 6, 0],
    [15, 0, 8, 14, 6, 10, 1, 13, 3, 7, 9, 5, 11, 12, 2, 4],
    [12, 1, 10, 15, 9, 2, 6, 8, 0, 13, 14, 11, 4, 7, 5, 3],
  ],
  [
    [4, 11, 2, 14, 15, 0, 8, 13, 3, 12, 9, 7, 5, 10, 6, 1],
    [13, 0, 11, 7, 4, 9, 1, 10, 14, 3, 5, 12, 2, 15, 8, 6],
    [1, 4, 11, 13, 12, 3, 7, 14, 10, 15, 6, 8, 0, 5, 9, 2],
    [6, 11, 13, 8, 1, 4, 10, 7, 9, 5, 15, 0, 14, 2, 3, 12],
  ]
];

const SBoxTransformation = ({ xorOutput }) => {
  const [selectedSBox, setSelectedSBox] = useState(0);
  const [currentResult, setCurrentResult] = useState(null);

  // Normalize input and create chunks using useMemo
  const chunks = useMemo(() => {
    // Ensure xorOutput is a string
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
  }, [selectedSBox, chunks]); // Now chunks is memoized and stable

  const renderInputBits = (input) => {
    if (!input) return null;

    return (
      <div className="font-mono space-x-1">
        <span className="bg-blue-100 px-2 rounded ml-1">{input[0]}</span>
        <span className="bg-blue-300 px-2 rounded">{input.slice(1, 5).split('').join('')}</span>
        <span className="bg-blue-100 px-2 rounded">{input[5]}</span>
      </div>
    );
  };

  const renderColHeaders = () => {
    return Array.from({ length: 16 }, (_, i) => i).map(idx => (
      <div
        key={idx}
        className={`w-8 text-center text-xs ${currentResult && currentResult.col === idx ? 'bg-blue-300' : ''
          }`}
      >
        {idx.toString(2).padStart(4, '0')}
      </div>
    ));
  };

  return (
    <div className="w-full bg-white shadow border border-gray-200 text-sm">
      <div className="flex items-center justify-between p-2 border-b">
        <select
          className="border rounded px-2 py-1"
          value={selectedSBox}
          onChange={(e) => setSelectedSBox(Number(e.target.value))}
        >
          {S_BOXES.map((_, idx) => (
            <option key={idx} value={idx}>S-Box {idx + 1}</option>
          ))}
        </select>
        <div className="text-lg flex mx-auto">
          <div>Input bits:</div>
          {renderInputBits(chunks[selectedSBox])}
        </div>
        {currentResult && (
          <div className="text-lg px-4 py-2 rounded">
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