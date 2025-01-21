import { createPermutationComponent } from '../utils/MatrixUtils';
import SBoxTransformation from './SBoxTransformation';
const ExpansionPermutation = createPermutationComponent({
  defaultOutputRows: 8,
  defaultOutputCols: 6,
  cellSize: 'small',
  gapSize: 'tiny', // Reduced from small
  spacing: 'compact'
});

const PBoxPermutation = createPermutationComponent({
  cellSize: 'small',
  spacing: 'compact'
});




export const ExpansionBox = ({ data, currentStage }) => (
  <ExpansionPermutation
    title="Expansion Permutation"
    input={data?.rounds[currentStage - 1].right}
    output={data?.rounds[currentStage - 1]?.steps?.expansion}
    table={[
      [32, 1, 2, 3, 4, 5],
      [4, 5, 6, 7, 8, 9],
      [8, 9, 10, 11, 12, 13],
      [12, 13, 14, 15, 16, 17],
      [16, 17, 18, 19, 20, 21],
      [20, 21, 22, 23, 24, 25],
      [24, 25, 26, 27, 28, 29],
      [28, 29, 30, 31, 32, 1]
    ]}
  />
);

export const PBox = ({ data, currentStage }) => (
  <PBoxPermutation
    title="Transposition Permutation"
    input={data?.rounds[currentStage - 1]?.steps?.sbox_output}
    output={data?.rounds[currentStage - 1]?.steps?.permutation}
    table={[
      [16, 7, 20, 21, 29, 12, 28, 17],
      [1, 15, 23, 26, 5, 18, 31, 10],
      [2, 8, 24, 14, 32, 27, 3, 9],
      [19, 13, 30, 6, 22, 11, 4, 25]
    ]}
  />
);

const Transformation = ({ data, formatBinary, currentStage }) => (
  <div className="w-full flex flex-col">
    <div className="w-full flex flex-col sm:flex-row">
      <ExpansionBox data={data} currentStage={currentStage} />
      <PBox data={data} currentStage={currentStage} />
    </div>

    <SBoxTransformation xorOutput={data?.rounds[currentStage - 1]?.steps.xor_output} className="w-full" />
  </div>
);


export default Transformation;