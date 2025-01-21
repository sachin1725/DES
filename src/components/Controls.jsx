import React from 'react';

const Controls = ({ onStart, onPause, onReset }) => (
  <div className="flex gap-4 mt-4">
    <button onClick={onStart} className="bg-green-500 text-white p-2 rounded">Start</button>
    <button onClick={onPause} className="bg-yellow-500 text-white p-2 rounded">Pause</button>
    <button onClick={onReset} className="bg-red-500 text-white p-2 rounded">Reset</button>
  </div>
);

export default Controls;
