import { ArrowDown } from "lucide-react";

const formatBinary = (binary, groupSize = 4) => {
  if (!binary) return '';
  const regex = new RegExp(`.{1,${groupSize}}`, 'g');
  return binary.match(regex)?.join(' ') || binary;
};

const FeistelStructure = ({ currentStage, roundNumber, data }) => {
  const isActive = currentStage === roundNumber;
  const effectiveRound = Math.min(Math.max(0, currentStage), 16);

  return (
    <div className="flex flex-col items-center">
      {/* Round Number */}
      <div className="w-full h-12 md:h-10 border rounded mb-1 bg-white flex items-center justify-center">
        Round {effectiveRound > 0 ? effectiveRound : 1}
      </div>

      <div
        className={`relative flex flex-col items-center transition-all duration-300 
        ${isActive ? 'scale-100 opacity-100' : 'scale-95 opacity-50'}`}
      >
        {/* Input Row */}
        <div className="flex w-full mb-2 flex-wrap md:flex-nowrap">
          <div
            className="flex-1 h-14 md:h-10 border rounded bg-white flex items-center justify-center p-2 text-[10px] overflow-hidden overflow-ellipsis"
          >
            {formatBinary(data?.left || 'L0')}
          </div>
          <div
            className="flex-1 h-14 md:h-10 border rounded bg-white flex items-center justify-center p-2 text-[10px] overflow-hidden overflow-ellipsis"
          >
            {formatBinary(data?.right || 'R0')}
          </div>
        </div>

        {/* Connection Structure */}
        <div className="w-full">
          <ArrowDown className="mx-auto" />
        </div>

        {/* Output Row */}
        <div className="flex w-full mb-2 flex-wrap md:flex-nowrap">
          <div
            className="flex-1 h-14 md:h-10 border rounded bg-white flex items-center justify-center p-4 text-[10px] overflow-hidden overflow-ellipsis"
          >
            {formatBinary(data?.output.slice(0, 32)) || 'L1'}
          </div>
          <div
            className="flex-1 h-14 md:h-10 border rounded bg-white flex items-center justify-center p-4 text-[10px] overflow-hidden overflow-ellipsis"
          >
            {formatBinary(data?.output.slice(32)) || 'R1'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeistelStructure;
