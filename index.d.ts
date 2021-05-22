export type Scramble = {
  string: string;
  state: string | Array;
};

export type ScrambleGenerator = () => Scramble;