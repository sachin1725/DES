import { ArrowDown } from "lucide-react";

const formatBinary = (binary, groupSize = 4) => {
  if (!binary) return '';
  const regex = new RegExp(`.{1,${groupSize}}`, 'g');
  return binary.match(regex)?.join(' ') || binary;
};

const FeistelStructure = ({ currentStage, roundNumber, data }) => {
  const isActive = currentStage === roundNumber;
  const effectiveRound = Math.min(Math.max(1, currentStage), 16);

  // Get input values for current round
  const inputLeft = data?.input?.slice(0, 32) || '';
  const inputRight = data?.input?.slice(32, 64) || '';

  // Get output values for current round
  const outputLeft = data?.output?.slice(0, 32) || '';
  const outputRight = data?.output?.slice(32, 64) || '';

  return (
    <div className="flex flex-col items-center">
      {/* Round Number */}
      <div className="w-full h-12 md:h-10 border rounded mb-1 bg-white flex items-center justify-center">
        Round {effectiveRound}
      </div>

      <div
        className={`relative flex flex-col items-center transition-all duration-300 
        ${isActive ? 'scale-100 opacity-100' : 'scale-95 opacity-50'}`}
      >
        {/* Input Row */}
        <div className="flex w-full mb-2 flex-wrap md:flex-nowrap">
          <div className="flex-1 h-14 md:h-10 border rounded bg-white flex items-center justify-center p-2 text-[10px] overflow-hidden overflow-ellipsis">
            {inputLeft ? formatBinary(inputLeft) : `L${effectiveRound - 1}`}
          </div>
          <div className="flex-1 h-14 md:h-10 border rounded bg-white flex items-center justify-center p-2 text-[10px] overflow-hidden overflow-ellipsis">
            {inputRight ? formatBinary(inputRight) : `R${effectiveRound - 1}`}
          </div>
        </div>

        {/* Connection Structure */}
        <div className="w-full mb-2">
          <ArrowDown className="mx-auto" size={16} />
          <div className="flex-1 h-14 md:h-10 border rounded bg-white flex flex-col items-center justify-center p-4 text-xs">
            <p className="block">L<sub>{effectiveRound}</sub> = R <sub>{effectiveRound - 1}</sub></p>
            <p className="block">R{effectiveRound} = L{effectiveRound - 1} ⊕ f(R{effectiveRound - 1}, K{effectiveRound})</p>
          </div>
          <ArrowDown className="mx-auto" size={16} />
        </div>

        {/* Output Row */}
        <div className="flex w-full mb-2 flex-wrap md:flex-nowrap">
          <div className="flex-1 h-14 md:h-10 border rounded bg-white flex items-center justify-center p-2 text-[10px] overflow-hidden overflow-ellipsis">
            {outputLeft ? formatBinary(outputLeft) : `L${effectiveRound}`}
          </div>
          <div className="flex-1 h-14 md:h-10 border rounded bg-white flex items-center justify-center p-2 text-[10px] overflow-hidden overflow-ellipsis">
            {outputRight ? formatBinary(outputRight) : `R${effectiveRound}`}
          </div>
        </div>

      </div>
    </div>
  );
};

export default FeistelStructure;