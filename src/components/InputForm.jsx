import React, { useState } from 'react';


const BlockSelector = ({ blocks, activeBlockIndex, onBlockSelect }) => {
  return (
    <div className="mt-4">
      <div className="text-xs font-medium mb-2">Data Blocks ({blocks.length} × 64-bit blocks)</div>
      <div className="flex gap-2 overflow-x-auto pb-2">
        {blocks.map((block, index) => (
          <button
            key={index}
            onClick={() => onBlockSelect(block, index)}
            className={`
              min-w-[120px] p-2 rounded border text-sm transition-all
              hover:border-blue-400
              ${activeBlockIndex === index 
                ? 'border-blue-500 bg-blue-50 shadow-sm' 
                : 'border-gray-200 bg-white'
              }
            `}
          >
            <div className="text-xs text-gray-500 mb-1">Block {index + 1}</div>
            <div className="font-mono text-xs break-all">
              {block}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

const InputForm = ({ input, setInput, encrKey, setEncrKey }) => {
  const [inputText, setInputText] = useState('');
  const [keyText, setKeyText] = useState('');
  const [error, setError] = useState('');
  const [inputMode, setInputMode] = useState('text'); 
  const [keyMode, setKeyMode] = useState('text');
  const [blocks, setBlocks] = useState([]);
  const [activeBlockIndex, setActiveBlockIndex] = useState(0);

  // PKCS#5/PKCS#7 padding for the last block
  const pkcs5Pad = (text) => {
    const blockSize = 8; // DES block size (8 bytes)
    const remainingLength = blockSize - (text.length % blockSize);
    const padding = String.fromCharCode(remainingLength).repeat(remainingLength);
    return text + padding;
  };

  // Split text into blocks and pad last block if needed
  const getTextBlocks = (text) => {
    const blocks = [];
    const blockSize = 8; // 8 characters per block
    
    for (let i = 0; i < text.length; i += blockSize) {
      const block = text.slice(i, i + blockSize);
      if (block.length === blockSize) {
        blocks.push(block);
      } else {
        blocks.push(pkcs5Pad(block));
      }
    }
    
    // If text length is a multiple of blockSize, add a full padding block
    if (text.length % blockSize === 0) {
      blocks.push(pkcs5Pad(''));
    }
    
    return blocks;
  };

  // Split hex into blocks
  const getHexBlocks = (hex) => {
    const blocks = [];
    const blockSize = 16; // 16 hex characters per block (64 bits)
    hex = hex.replace(/\s/g, '').toUpperCase();
    
    for (let i = 0; i < hex.length; i += blockSize) {
      const block = hex.slice(i, i + blockSize);
      blocks.push(block.padEnd(blockSize, '0'));
    }
    
    // If hex length is a multiple of blockSize, add a full padding block
    if (hex.length % blockSize === 0) {
      blocks.push('0'.repeat(blockSize));
    }
    
    return blocks;
  };

  // Text to hex conversion
  const textToHex = (text) => {
    return Array.from(text)
      .map(char => char.charCodeAt(0).toString(16).padStart(2, '0'))
      .join('')
      .toUpperCase();
  };

  // Validate input
  const validateInput = (text, mode, isKey = false) => {
    if (!text || !text.trim()) {
      return `Please enter ${isKey ? 'key' : 'input'} ${mode === 'text' ? 'text' : 'in hex format'}`;
    }

    if (mode === 'text') {
      if (!/^[\x20-\x7E]*$/.test(text)) {
        return `${isKey ? 'Key' : 'Input'} contains invalid characters. Please use printable ASCII characters only.`;
      }
      if (isKey && text.length > 8) {
        return 'Key cannot exceed 8 characters (64 bits)';
      }
    } else {
      text = text.replace(/\s/g, '').toUpperCase();
      if (!/^[0-9A-F]*$/.test(text)) {
        return `${isKey ? 'Key' : 'Input'} must be valid hexadecimal`;
      }
      if (isKey && text.length > 16) {
        return 'Key cannot exceed 16 hex characters (64 bits)';
      }
    }

    return null;
  };

  const handleBlockSelect = (block, index) => {
    setActiveBlockIndex(index);
    setInput(block);
  };

  const handleEncrypt = () => {
    try {
      // Validate input
      const inputError = validateInput(inputText, inputMode);
      if (inputError) {
        setError(inputError);
        return;
      }

      // Validate key
      const keyError = validateInput(keyText, keyMode, true);
      if (keyError) {
        setError(keyError);
        return;
      }

      // Process key
      let finalKey;
      if (keyMode === 'text') {
        const validKey = keyText.length === 8 ? keyText : pkcs5Pad(keyText);
        finalKey = textToHex(validKey);
      } else {
        finalKey = keyText.padEnd(16, '0');
      }

      // Process input blocks
      let inputBlocks;
      if (inputMode === 'text') {
        inputBlocks = getTextBlocks(inputText).map(block => textToHex(block));
      } else {
        inputBlocks = getHexBlocks(inputText);
      }

      // Set the blocks and select the first one
      setBlocks(inputBlocks);
      setActiveBlockIndex(0);
      setInput(inputBlocks[0]);
      setEncrKey(finalKey);
      setError('');

      // Debug logging
      console.log({
        inputMode,
        originalInput: inputText,
        blocks: inputBlocks,
        keyMode,
        originalKey: keyText,
        finalKey,
      });

    } catch (error) {
      setError(`Encryption error: ${error.message}`);
      console.error('Encryption error:', error);
    }
  };

  return (
    <div>
  
        <h1 className="text-4xl font-bold text-center">DES Visualization</h1>

      <div className="mb-2 grid grid-cols-5 gap-4">
        <div>
          <div className="flex justify-between mb-1">
            <label className="block text-xs font-medium">Input</label>
            <select 
              value={inputMode}
              onChange={(e) => {
                setInputMode(e.target.value);
                setInputText('');
                setError('');
                setBlocks([]);
              }}
              className="text-xs"
            >
              <option value="text">Text</option>
              <option value="hex">Hex</option>
            </select>
          </div>
          <input
            type="text"
            value={inputText}
            onChange={(e) => {
              setInputText(e.target.value);
              setError('');
            }}
            placeholder={inputMode === 'text' ? "Enter text" : "Enter hex"}
            className="w-full p-1.5 border rounded text-sm"
            required
          />
        </div>

        <div>
          <div className="flex justify-between mb-1">
            <label className="block text-xs font-medium">Key</label>
            <select 
              value={keyMode}
              onChange={(e) => {
                setKeyMode(e.target.value);
                setKeyText('');
                setError('');
              }}
              className="text-xs"
            >
              <option value="text">Text</option>
              <option value="hex">Hex</option>
            </select>
          </div>
          <input
            type="text"
            value={keyText}
            onChange={(e) => {
              setKeyText(e.target.value);
              setError('');
            }}
            placeholder={keyMode === 'text' ? "Max 8 characters" : "Max 16 hex characters"}
            className="w-full p-1.5 border rounded text-sm"
            maxLength={keyMode === 'text' ? 8 : 16}
            required
          />
        </div>

        <div>
          <label className="block text-xs font-medium mb-1">Rounds</label>
          <input
            type="number"
            value={16}
            readOnly
            className="w-full p-1.5 border rounded text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-medium mb-1">Cipher Mode</label>
          <input
            type="text"
            value={"ECB"}
            readOnly
            className="w-full p-1.5 border rounded text-sm"
          />
        </div>

        <div className="flex justify-center mt-4">
          <button
            onClick={handleEncrypt}
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-1 px-3 rounded text-sm"
          >
            Encrypt
          </button>
        </div>
      </div>

      {error && (
        <div className="text-red-500 text-sm text-center mt-2">
          {error}
        </div>
      )}

      {blocks.length > 0 && (
        <BlockSelector
          blocks={blocks}
          activeBlockIndex={activeBlockIndex}
          onBlockSelect={handleBlockSelect}
        />
      )}
    </div>
  );
};

export default InputForm;