export namespace UUIDGenerator {
  export type Input = {
    key: string;
  };

  export type Output = string;
}

export interface UUIDGenerator {
  generate: (input: UUIDGenerator.Input) => UUIDGenerator.Output;
}
