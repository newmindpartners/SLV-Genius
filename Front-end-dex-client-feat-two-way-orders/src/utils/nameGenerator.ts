import {
  adjectives,
  animals,
  Config,
  uniqueNamesGenerator,
} from 'unique-names-generator';

const generateHashCode = (inputString: string): number =>
  inputString
    .split('')
    .reduce((hash, char) => ((hash << 5) - hash + char.charCodeAt(0)) | 0, 0);

/**
 * Generate a unique name based on the seed.
 *
 * Example outputs are 'DrivingFuchsiaViper', 'BrainySalmonMinnow', 'IncAquamarineGazelle' etc.
 *
 * Note that there may be a slight risk that two different seeds generate the
 * same output, however I believe this risk is very unlikely.
 */
export const generateUniqueName = (seed: string) => {
  /**
   * This attempts to resolve a bug in the library where two different string
   * seeds can return in the same output.
   *
   * This suggestion was proposed here
   * https://github.com/andreasonny83/unique-names-generator/issues/79
   *
   * and it seems to resolve issues described here
   * https://github.com/andreasonny83/unique-names-generator/issues/56#issuecomment-1070381874
   */
  const hashCodeSeed = generateHashCode(seed);

  const config: Config = {
    dictionaries: [adjectives, animals],
    separator: '',
    style: 'capital',
    seed: hashCodeSeed,
  };

  return uniqueNamesGenerator(config);
};
