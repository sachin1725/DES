import { ArrowDown, ArrowLeft } from "lucide-react";

const FunctionDetails = ({ data, isActive, formatBinary }) => {
  if (!data) return null;

  return (
    <div className="border rounded-lg p-4">
      <div className="relative w-full max-w-sm mx-auto space-y-1">
        {/* Header */}
        <div className="text-center font-semibold text-sm">
          f(R{data.round -1}, K{data.round})
        </div>

        {/* Input with value */}
        <div className="text-center space-y-1">
          <div className="text-xs text-gray-600">In (32 bits)</div>
          <div className="font-mono text-xs bg-white p-1 rounded border">
            {formatBinary(data.right)}
          </div>
          <ArrowDown className="h-3 w-3 mx-auto my-1" />
        </div>

        {/* Expansion P-box */}
        <div className="relative mb-1">
          <div className="w-full h-14 relative">
            <div className="absolute inset-0 bg-purple-200 rounded">
              <div className="absolute inset-0 flex flex-col items-center justify-center p-1">
                <div className="text-xs font-semibold mb-1">Expansion Permutation</div>
                <div className="font-mono text-xs bg-white/75 p-1 rounded w-5/6 text-center">
                  {formatBinary(data.steps.expansion, 6)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* XOR with key section */}
        <div className="flex flex-col items-center space-y-1">
          <ArrowDown className="h-3 w-3" />
          <div className="flex items-center justify-center space-x-2">
            <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-sm ml-48">
              ⊕
            </div>
            <ArrowLeft className="h-3 w-3" />
            <div className="space-y-0.5">
              <div className="text-xs text-gray-600">K{data.round} (48 bits)</div>
              <div className="font-mono text-xs bg-white p-1 rounded border">
                {formatBinary(data.key, 6)}
              </div>
            </div>
          </div>
          <ArrowDown className="h-3 w-3"  />
          <div className="font-mono text-xs bg-white p-1 rounded border w-full text-center">
            {formatBinary(data.steps.xor_output, 6)}
          </div>
        </div>

        {/* S-Boxes */}
        <div className="bg-gray-200 p-2 rounded space-y-1">
          <div className="grid grid-cols-8 gap-0.5">
            {Array(8).fill(0).map((_, i) => (
              <div key={i} className="aspect-square bg-gray-400 flex items-center justify-center text-xs font-bold rounded">
                S{i + 1}
              </div>
            ))}
          </div>
          <div className="font-mono text-xs bg-white p-1 rounded border text-center">
            {formatBinary(data.steps.sbox_output)}
          </div>
        </div>

        {/* Straight P-box */}
        <div className="w-full h-14 bg-purple-200 rounded flex flex-col items-center justify-center p-1">
          <div className="text-xs font-semibold mb-1">Straight P-box</div>
          <div className="font-mono text-xs bg-white/75 p-1 rounded w-5/6 text-center">
            {formatBinary(data.steps.permutation)}
          </div>
        </div>

        {/* Output */}
        <div className="text-center space-y-1">
          <ArrowDown className="h-3 w-3 mx-auto my-1" />
          <div className="text-xs text-gray-600">Out (32 bits)</div>
          <div className="font-mono text-xs bg-white p-1 rounded border">
            {formatBinary(data.steps.permutation)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FunctionDetails;