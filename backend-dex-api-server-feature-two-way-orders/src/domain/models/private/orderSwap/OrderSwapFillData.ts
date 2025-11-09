export type FilledOrderSwapUnspentOutputReference = {
  filledOrderSwapUtxoReferenceIndex: number;
  filledOrderSwapUtxoReferenceTransactionHash: string;
};

export type FilledOrderSwapUnspentOutputReferenceWithAmount = {
  filledOrderSwapUnspentOutputReference: FilledOrderSwapUnspentOutputReference;
  filledOrderSwapToAssetFillAmount: string;
};
