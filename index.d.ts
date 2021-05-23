export type Scramble = {
  text: string;
  state: string;
};

export type ScrambleGenerator = () => Scramble;