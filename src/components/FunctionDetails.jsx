import { ArrowDown, ArrowLeft } from "lucide-react";

const FunctionDetails = ({ data, isActive, formatBinary }) => {
  if (!data) return null;

  return (
    <div className="border rounded-lg p-4">
      <div className="relative w-full max-w-sm mx-auto space-y-1">
        {/* Header */}
        <div className="text-center font-semibold text-sm">
          f(R{data.round - 1}, K{data.round})
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
            <div className="absolute inset-0 bg-blue-200 rounded">
              <div className="absolute inset-0 flex flex-col items-center justify-center p-1 pt-2">
                <div className="text-xs font-semibold mb-1">Expansion Permutation</div>
                <div className="font-mono text-xs bg-white/75 p-1 rounded w-5/6 text-center">
                  {formatBinary(data.steps.expansion, 6)}
                </div>
              </div>
            </div>
          </div>
        </div>
        <ArrowDown className="mx-auto" size={12} />
        {/* XOR with key section */}
        <div className="flex flex-col items-center space-y-1">


          <div className="w-full">

            <div className="w-1/2"></div>
            <div className="w-1/2 flex justify-between">
              <div className="w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center text-white text-lg ml-48 leading-none">
                ⊕
              </div>

              <ArrowLeft size={20} className="" />

              <div className="space-y-0.5 text-center">
                <div className="text-xs text-gray-600">K{data.round} (48 bits)</div>
                <div className="font-mono align-text-top text-xs bg-white p-0.5 rounded border">
                  {formatBinary(data.key, 6)}
                </div>
              </div>
            </div>
          </div>

          <ArrowDown className="h-3 w-3" />

          <div className="font-mono text-xs bg-white p-1 rounded border w-full text-center">
            {formatBinary(data.steps.xor_output, 6)}
          </div>
        </div>


        {/* S-Boxes */}
        <div className="bg-blue-100 p-2 rounded space-y-1">
          <div className="text-center text-xs font-semibold ">S-box Transformations</div>
          <div className="grid grid-cols-8 gap-0.5">
            {Array(8).fill(0).map((_, i) => (
              <div key={i} className="aspect-square bg-blue-200 flex items-center justify-center text-xs font-bold rounded">
                S{i + 1}
              </div>
            ))}
          </div>
          <div className="font-mono text-xs bg-white p-1 rounded border text-center">
            {formatBinary(data.steps.sbox_output)}
          </div>
        </div>

        {/* Straight P-box */}
        <div className="w-full h-14 bg-blue-200 rounded flex flex-col items-center justify-center pt-2">
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