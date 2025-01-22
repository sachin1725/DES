import React, { useState } from 'react';
import { Info, X } from 'lucide-react';
const stageInfo = {
    initial: {
        title: "Initial Stage",
        description: "The starting point of DES encryption",
        details: [
            "Converts the 64-bit input into binary",
            "Applies Initial Permutation (IP)",
            "Splits the result into Left (L0) and Right (R0) halves"
        ],
        importance: "The Initial Permutation rearranges bits in a standardized way, preparing data for the main encryption process."
    },
    expansion: {
        title: "Expansion (E-Box)",
        description: "Expands 32-bit right half to 48 bits",
        details: [
            "Takes the 32-bit right half of the data",
            "Expands it to 48 bits by duplicating certain bits",
            "Makes the data same size as the round key for XOR operation",
            "Hover over the output bit to see the actual bit position of the bit in the input"
        ],
        importance: "Expansion is crucial for creating an avalanche effect - where a small change in input creates a large change in output."
    },
    key: {
        title: "Key Schedule",
        description: "Generates 16 unique 48-bit round keys",
        details: [
            "Applies Permuted Choice 1 (PC-1) to the original key",
            "Performs circular left shifts",
            "Applies Permuted Choice 2 (PC-2) for each round"
        ],
        importance: "Key scheduling ensures each round uses a different key, enhancing security through key diffusion."
    },
    xor: {
        title: "XOR Operation",
        description: "Combines round key with expanded right half",
        details: [
            "Performs bitwise XOR between 48-bit expanded data and round key",
            "Creates non-linearity in the encryption process",
            "Prepares input for S-box substitution"
        ],
        importance: "XOR operation introduces key-dependent transformation, making the encryption key-dependent."
    },
    sbox: {
        title: "S-Box Substitution",
        description: "Non-linear transformation of data",
        details: [
            "Divides 48-bit XOR output into 8 6-bit blocks",
            "Each block is transformed using corresponding S-box",
            "Reduces 48 bits back to 32 bits",
            
        ],
        importance: "S-boxes provide confusion by creating a complex relationship between key and ciphertext, crucial for security."
    },
    permutation: {
        title: "P-Box Permutation",
        description: "Straight permutation of S-box output",
        details: [
            "Rearranges the 32-bit S-box output",
            "Distributes output bits from each S-box",
            "Enhances diffusion in the algorithm",
            "Hover over the output bit to see the actual bit position of the bit in the input"
        ],
        importance: "Permutation spreads S-box outputs across the entire data block, strengthening the avalanche effect."
    },
    round: {
        title: "Round Function (F-function)",
        description: "Complete round transformation",
        details: [
            "Combines Expansion, XOR, S-box, and Permutation",
            "Processes right half of data block",
            "Creates input for next round"
        ],
        importance: "The round function creates complex dependencies between input bits, key bits, and output bits."
    },
    final: {
        title: "Final Stage",
        description: "Completion of encryption process",
        details: [
            "Performs final 32-bit swap",
            "Applies Final Permutation (IP⁻¹)",
            "Produces 64-bit ciphertext"
        ],
        importance: "The final permutation is the inverse of initial permutation, making decryption possible with the same algorithm."
    }
};

const DESInfoCard = ({ stage = 'initial' }) => {
    const [isOpen, setIsOpen] = useState(false);
    const info = stageInfo[stage] || stageInfo.initial;

    // Close on escape key
    React.useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') setIsOpen(false);
        };
        if (isOpen) {
            window.addEventListener('keydown', handleEscape);
            return () => window.removeEventListener('keydown', handleEscape);
        }
    }, [isOpen]);

    return (
        <>
            {/* Info Button */}
            <button
                onClick={() => setIsOpen(true)}
                className="flex items-center space-x-2 p-1 mr-1 rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition-colors"
            >
                <Info size={15} />
            </button>

            {/* Overlay */}
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="relative w-full max-w-2xl max-h-[90vh] m-4 overflow-auto">
                        {/* Content Card */}
                        <div className="relative bg-white rounded-lg shadow-xl">
                            {/* Close Button */}
                            <button
                                onClick={() => setIsOpen(false)}
                                className="absolute right-4 top-4 p-1 rounded-full hover:bg-gray-100 transition-colors"
                            >
                                <X size={20} className="text-gray-500" />
                            </button>

                            {/* Header */}
                            <div className="p-6 border-b border-gray-200">
                                <div className="flex items-center space-x-2 mb-2">
                                    <Info size={24} className="text-blue-500" />
                                    <h2 className="text-2xl font-semibold">{info.title}</h2>
                                </div>
                                <p className="text-lg text-gray-600">{info.description}</p>
                            </div>

                            {/* Content */}
                            <div className="p-6 space-y-6">
                                <div className="space-y-3">
                                    <h3 className="font-semibold text-lg text-gray-700">Key Points:</h3>
                                    <ul className="list-disc pl-6 space-y-2">
                                        {info.details.map((detail, index) => (
                                            <li key={index} className="text-gray-600">{detail}</li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="pt-4 border-t">
                                    <h3 className="font-semibold text-lg text-gray-700">Why it matters:</h3>
                                    <p className="text-gray-600 mt-2">{info.importance}</p>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="p-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default DESInfoCard;