import {KycDocument} from './KycDocument';
import {KycReference} from './KycReference';

export type KycData = KycReference & {
  countryCode?: string;
  documents: KycDocument[];
};
