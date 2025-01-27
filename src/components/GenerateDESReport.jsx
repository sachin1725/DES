import React from 'react';
import { jsPDF } from 'jspdf';
import { runDES } from '../utils/DESAlgorithm.js';

// Fixed conversion utilities
const hexToBin = (hex) => {
  if (!hex) return '';
  // Convert each hex digit to 4 bits, pad with leading zeros
  return hex.split('').map(digit => 
    parseInt(digit, 16).toString(2).padStart(4, '0')
  ).join('');
};
const textToHex = (text) => {
  return Array.from(text)
    .map(char => char.charCodeAt(0).toString(16).padStart(2, '0'))
    .join('')
    .toUpperCase();
};


const binToHex = (bin) => {
  if (!bin) return '';
  // Convert each 4 bits to a hex digit
  return bin.match(/.{1,4}/g)?.map(chunk => 
    parseInt(chunk, 2).toString(16).toUpperCase()
  ).join('') || '';
};

// Format binary string with specified group size
const formatBinaryString = (binaryStr, groupSize = 8) => {
  if (!binaryStr) return 'N/A';
  // Split into groups and join with spaces
  return binaryStr.match(new RegExp(`.{1,${groupSize}}`, 'g'))?.join(' ') || 'N/A';
};

// Convert hex string to binary string
const convertHexToBinary = (hexInput) => {
  if (!hexInput) return '';
  return hexToBin(hexInput);
};

export const generateDESReport = (input, encrKey, blocks) => {
  // Create a new PDF document
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  console.log(input);

  // Prepare binary conversions
  const binaryMsg = convertHexToBinary(textToHex(input));
  const binaryKey = convertHexToBinary(encrKey);

  // Main Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(24);
  doc.text('Detailed DES Encryption Report', 105, 20, { align: 'center' });

  // Overall Encryption Details
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('Encryption Parameters:', 15, 40);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.text(`Total Blocks: ${blocks.length}`, 15, 50);
  doc.text(`Input: ${input}`, 15, 60);
  doc.text(`Input (Binary): ${formatBinaryString(binaryMsg,64)}`, 15, 80);
  doc.text(`Encryption Key: ${encrKey}`, 15, 70);
  doc.text(`Key (Binary): ${formatBinaryString(binaryKey)}`, 15, 90);

  // Process each block
  blocks.forEach((block, blockIndex) => {
    // New page for each block
    doc.addPage();

    // Block Header
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text(`Block ${blockIndex + 1}`, 105, 20, { align: 'center' });

    // Convert block to binary
    const binaryBlock = convertHexToBinary(block);

    // Run DES on this block
    const blockResult = runDES(binaryBlock, binaryKey);

    // Initial Block Input Section
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('Block Input:', 15, 40);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.text(`Input Block (Hex): ${block}`, 20, 55);
    doc.text(`Input Block (Binary): ${formatBinaryString(binaryBlock)}`, 20, 67);

    // Initial Permutation Section
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('Initial Permutation:', 15, 85);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.text(`Permuted Block: ${formatBinaryString(blockResult.initial.permuted)}`, 20, 100);
    doc.text(`Initial Left Half (L0): ${formatBinaryString(blockResult.initial.L0)}`, 20, 112);
    doc.text(`Initial Right Half (R0): ${formatBinaryString(blockResult.initial.R0)}`, 20, 124);

    // Process the rounds, 2 rounds per page
    const roundsPerPage = 2;
    const totalRounds = blockResult.rounds.length;
    const totalPages = Math.ceil(totalRounds / roundsPerPage);

    for (let pageIndex = 0; pageIndex < totalPages; pageIndex++) {
      doc.addPage();
      let startY = 30;
      const startRoundIndex = pageIndex * roundsPerPage;
      const endRoundIndex = Math.min(startRoundIndex + roundsPerPage, totalRounds);

      for (let roundIndex = startRoundIndex; roundIndex < endRoundIndex; roundIndex++) {
        const round = blockResult.rounds[roundIndex];

        // Round Header
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(14);
        doc.text(`Round ${round.round}`, 15, startY);

        // Round details
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(11);
        let currentY = startY + 15;
        const lineSpacing = 12;

        const addLine = (text) => {
          if (currentY > 270) {
            doc.addPage();
            currentY = 30;
          }
          doc.text(text, 20, currentY);
          currentY += lineSpacing;
        };

        [
          `Round Key (Hex): ${binToHex(round.key)}`,
          `Left Half: ${formatBinaryString(round.left, 4)}`,
          `Right Half: ${formatBinaryString(round.right, 4)}`,
          `Expansion: ${formatBinaryString(round.steps.expansion, 6)}`,
          `XOR Output: ${formatBinaryString(round.steps.xor_output, 6)}`,
          `S-Box Output: ${formatBinaryString(round.steps.sbox_output, 4)}`,
          `Permutation: ${formatBinaryString(round.steps.permutation)}`
        ].forEach(addLine);

        startY = currentY + 10;
      }
    }

    // Final Steps Page
    doc.addPage();
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('Final Steps:', 15, 30);
    
    // Add 32-bit swap details
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('32-Bit Swap:', 15, 50);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.text(`Pre-swap: ${formatBinaryString(blockResult.swap.input, 32)}`, 20, 65);
    doc.text(`Post-swap: ${formatBinaryString(blockResult.swap.output, 32)}`, 20, 80);
    
    // Final permutation details
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('Final Permutation:', 15, 100);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.text(`Input to final permutation: ${formatBinaryString(blockResult.final.input, 32)}`, 20, 115);
    doc.text(`Final output (Binary): ${formatBinaryString(blockResult.final.output, 32)}`, 20, 130);
    doc.text(`Final output (Hex): ${binToHex(blockResult.final.output)}`, 20, 145);
  });

  return doc;
};

// React component for Report Download
const GenerateDESReport = ({ input, encrKey, blocks }) => {
  const handleDownloadReport = () => {
    if (!input || !encrKey || !blocks || blocks.length === 0) {
      alert("Please provide input, encryption key, and ensure blocks are divided.");
      return;
    }

    const doc = generateDESReport(input, encrKey, blocks);
    doc.save('des_encryption_detailed_report.pdf');
  };

  return (
    <button
      onClick={handleDownloadReport}
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-2"
    >
      Download Detailed Report
    </button>
  );
};

export default GenerateDESReport;