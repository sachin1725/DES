import { useState, useEffect } from 'react';
import { ArrowDown, Play, Pause, SkipForward, ChevronUp, ChevronDown, LucideSkipBack } from 'lucide-react';
import { runDES } from './utils/DESAlgorithm';
import FunctionDetails from './components/FunctionDetails';
import { IPMatrix, FPMatrix } from './components/Matrix';
import Transformation from './components/Transformation';
import InputForm from './components/InputForm';
import FeistelStructure from './components/FeistelStructure';
import GenerateDESReport from './components/GenerateDESReport';


const hexToBin = (hex) => ("00000000" + (parseInt(hex, 16)).toString(2)).substr(-8);
const binToHex = (bin) => parseInt(bin, 2).toString(16).toUpperCase();
const chunkString = (str, len) => str.match(new RegExp('.{1,' + len + '}', 'g'));

const formatBinary = (binary, groupSize = 4) => {
  if (!binary) return '';
  const regex = new RegExp(`.{1,${groupSize}}`, 'g');
  return binary.match(regex)?.join(' ') || binary;
};


const hexToText = (hex) => {
  if (hex.length % 2 !== 0) {
    throw new Error('Invalid hex string length');
  }

  // Convert hex to an array of bytes (each byte is 2 characters)
  const bytes = hex.match(/.{1,2}/g);

  // Convert the bytes back to characters
  let text = bytes
    .map(byte => String.fromCharCode(parseInt(byte, 16)))
    .join('');

  // Unpad the text using PKCS#5/PKCS#7 unpadding
  const padLength = text.charCodeAt(text.length - 1);  // Padding length is stored in the last byte
  if (padLength > 0 && padLength <= 8) {
    // Remove padding
    text = text.slice(0, text.length - padLength);
  }

  return text;
};

const StageBox = ({ children, stageStyle }) => (
  <div className={`mb-2 transition-all duration-300 rounded-lg border border-gray-200 ${stageStyle}`}>
    <div className="text-center p-1.5 rounded mb-1 text-sm">
      {children}
    </div>
  </div>
);

const ArrowDivider = () => (
  <div className="flex justify-center my-2">
    <ArrowDown className="w-4 h-4" />
  </div>
)


// Stage Display Component
const StageDisplay = ({ stage, blockInput, effectiveRound, currentStage, cipherText, getStageStyles, desResult }) => (
  <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 shadow-sm">
    {/* Input Box */}
    <StageBox stageStyle={getStageStyles(-1, stage)}>
      <h1>{blockInput || 'Input (64-bit)'}</h1>
    </StageBox>

    <ArrowDivider />

    {/* Initial Permutation Box */}
    <StageBox stageStyle={getStageStyles(0, stage)}>
      Initial Permutation (64-bit)
    </StageBox>

    <ArrowDivider />

    {/* Feistel Structure */}
    <div className={`p-2 rounded-lg border border-gray-200 transition-all duration-300 
      ${currentStage >= 1 && currentStage <= 16 ? getStageStyles(currentStage, stage) : 'bg-gray-50'}`}>
      <FeistelStructure
        currentStage={currentStage}
        roundNumber={currentStage}
        data={desResult?.rounds[currentStage]}
      />
    </div>

    {/* Final Permutation Box */}
    <StageBox stageStyle={getStageStyles(17, stage)}>
      <ArrowDivider />
      Inverse Initial Permutation (64-bit)
    </StageBox>

    {/* Cipher Text Box */}
    <StageBox stageStyle={getStageStyles(18, stage)}>
      <ArrowDivider />
      {cipherText === "" ? (
        "Cipher Text"
      ) : (
        <>
          {cipherText}
        </>
      )}

    </StageBox>
  </div>
);
const getStageStyles = (targetStage, currentStage) => {
  if (currentStage < 0) return "bg-gray-50";
  if (targetStage === currentStage) {
    return "bg-blue-100 ring-2 ring-blue-500 shadow-md transform scale-105 transition-all duration-300";
  }
  if (targetStage < currentStage) {
    return "bg-green-50 text-gray-500";
  }
  return "bg-gray-50";
};

const AnimationControls = ({
  isAnimating,
  isPaused,
  onMainButtonClick,
  onPrev,
  onSkip,
  showDetails,
  onToggleDetails,
  currentStage,
  totalStages,
}) => (
  <div className="space-y-2">
    {/* Main controls */}
    <div className="flex gap-2 mb-2">
      <button
        onClick={onMainButtonClick}
        className="flex-1 px-3 py-1.5 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center justify-center gap-2 text-sm"
      >
        {!isAnimating || isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
        {!isAnimating ? 'Start' : (isPaused ? 'Resume' : 'Pause')}
      </button>

      <button
        onClick={onToggleDetails}
        className="flex-1 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded flex items-center justify-center gap-2 text-sm"
      >
        {showDetails ? (
          <>
            <ChevronUp className="w-4 h-4" />
            Hide Details
          </>
        ) : (
          <>
            <ChevronDown className="w-4 h-4" />
            Show Details
          </>
        )}
      </button>

      {isAnimating && (
        <>

          <button
            onClick={onPrev}
            className="px-3 py-1.5 bg-gray-500 text-white rounded hover:bg-gray-600 flex items-center justify-center gap-2 text-sm"
          >
            <LucideSkipBack className="w-4 h-4" />
            Prev
          </button>
          <button
            onClick={onSkip}
            className="px-3 py-1.5 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center justify-center gap-2 text-sm"
            disabled={currentStage >= totalStages}
          >
            <SkipForward className="w-4 h-4" />
            Next
          </button>

        </>
      )}
    </div>
  </div>
);

// Updated ResultsPanel Component
const ResultsPanel = ({ desResult, currentStage, formatBinary, isPaused, showDetails }) => {
  if (!desResult) return null;

  if (currentStage === 0 && showDetails) return <IPMatrix className="flex md:flex-row" data={desResult.initial} formatBinary={formatBinary} isPaused={isPaused} />;
  if (currentStage === 17 && showDetails) return (
    <>
      <div className='text-center'>32 bit swap</div>

      <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-2">
        <div>Input:</div>
        <div><span className='none'>Left:</span>{desResult.swap.input.slice(0, 32)}</div>
        <div><span className=''>Right:</span>{desResult.swap.input.slice(32, 64)}</div>
      </div>

      <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-2">
        <div>Output:</div>
        <div>Left:{desResult.swap.output.slice(0, 32)}</div>
        <div>Right:{desResult.swap.output.slice(32, 64)}</div>
      </div>
      <FPMatrix data={desResult.final} formatBinary={formatBinary} isPaused={isPaused} />
    </>)

    ;

  return (
    <div className={`flex flex-col w-full lg:flex-row transition-all duration-300 ${showDetails ? 'opacity-100' : 'hidden'}`}>
      <div className="w-50 h-100">
        <FunctionDetails
          data={desResult.rounds[currentStage - 1]}
          isActive={true}
          formatBinary={formatBinary}
          showDetails={showDetails}
          parentStage={currentStage}
          isPaused={isPaused}
        />
      </div>
      {currentStage > 0 && currentStage <= 16 && (
        <div className="w-30">
          <Transformation
            data={desResult}
            formatBinary={formatBinary}
            currentStage={currentStage}
            showDetails={showDetails}
          />
        </div>
      )}
    </div>
  );
};

const DESVisualizer = () => {
  const [currentStage, setCurrentStage] = useState(-1);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [showDetails, setShowDetails] = useState(true);
  const [input, setInput] = useState("");
  const [desResult, setDESResult] = useState(null);
  const [blockInput, setBlockInput] = useState("");
  const [encrKey, setEncrKey] = useState("");
  const [cipherText, setCipherText] = useState("");
  const [blocks, setBlocks] = useState([]);


  const TOTAL_STAGES = 18;
  const effectiveRound = Math.min(Math.max(currentStage, 0), 16);

  // effect to run DES when blockInput or key changes
  useEffect(() => {
    if (blockInput && encrKey) {
      try {
        // Convert hex blockInput to binary
        const binaryMsg = chunkString(blockInput, 2).map(hex => hexToBin(hex)).join("");
        const binaryKey = chunkString(encrKey, 2).map(hex => hexToBin(hex)).join("");

        // Run DES algorithm
        const result = runDES(binaryMsg, binaryKey);

        // Convert final output to hex for cipher text
        const cipher = chunkString(result.final.output, 4)
          .map(bin => binToHex(bin))
          .join("");

        // Update state
        setDESResult(result);
        setCipherText(cipher);

        // Reset animation state
        setCurrentStage(-1);
        setIsAnimating(false);
        setIsPaused(false);
      } catch (error) {
        console.error('Error running DES:', error);
      }
    }
  }, [blockInput, encrKey]);

  const handleMainButtonClick = () => {
    if (!desResult) {
      alert("Please blockInput a message and key to start the animation");
      return;
    }
    if (!isAnimating) {

      setIsAnimating(true);
      setIsPaused(false);
      setCurrentStage(0);
    } else {
      setIsPaused(!isPaused);
    }
  };

  const handleSkip = () => {
    if (currentStage < TOTAL_STAGES) {
      setCurrentStage(prev => prev + 1);
    }
    setIsPaused(true);
  };

  const handlePrev = () => {
    if (currentStage >= 0) {
      setCurrentStage(prev => prev - 1);
    }

    setIsPaused(true);
  };

  const handleToggleDetails = () => {
    setShowDetails(!showDetails);
  };

  useEffect(() => {
    let timer;
    if (isAnimating && !isPaused && currentStage <= 17) {
      timer = setTimeout(() => {
        setCurrentStage(prev => prev + 1);
      }, 1000);
    } else if (currentStage > 17) {
      setIsAnimating(false);
      setIsPaused(false);
    }
    return () => clearTimeout(timer);
  }, [currentStage, isAnimating, isPaused]);

  return (
    <div className="max-w-[98vw] mx-auto">
      <div className="p-2">
        <InputForm
          setInput={setInput}
          blockInput={blockInput}
          setBlockInput={setBlockInput}
          encrKey={encrKey}
          setEncrKey={setEncrKey}
          blocks={blocks}
          setBlocks={setBlocks}
        />
        <GenerateDESReport
          input={input}
          encrKey={encrKey}
          blocks={blocks}
        />
        <div className=' top-2 sticky z-20'>
          <AnimationControls
            isAnimating={isAnimating}
            isPaused={isPaused}
            onMainButtonClick={handleMainButtonClick}
            onPrev={handlePrev}
            onSkip={handleSkip}
            showDetails={showDetails}
            onToggleDetails={() => setShowDetails(!showDetails)}
            currentStage={currentStage}
            totalStages={TOTAL_STAGES}
          />

        </div>

        <div className="flex flex-col lg:flex-row gap-4">
          <div className="lg:w-80 min-w-[280px] max-w-full">
            <StageDisplay
              stage={currentStage}
              blockInput={blockInput}
              effectiveRound={effectiveRound}
              currentStage={currentStage}
              cipherText={cipherText}
              getStageStyles={getStageStyles}
              desResult={desResult}
            />
          </div>

          <div className="lg:flex-1 max-w-full">
            <ResultsPanel
              desResult={desResult}
              currentStage={currentStage}
              formatBinary={formatBinary}
              isPaused={isPaused}
              showDetails={showDetails}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DESVisualizer;

//msachinjames@gmail.com