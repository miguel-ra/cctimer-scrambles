export type Scramble = {
  string: string;
  state: Array;
};

export type ScrambleImageProps = {
  randomScramble: Scramble;
} & HTMLProps<HTMLElement>;

export type ScrambleGenerator = {
  getRandomScramble: () => Scramble;
  ScrambleImage: (props: ScrambleImageProps) => JSX.Element;
};
