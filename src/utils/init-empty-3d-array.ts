import { daysLength } from "../algorithms/genetic-algorithm/constants";

export default <T>(): T[][][] =>
  Array.from({ length: 20 }, () =>
    Array.from({ length: 30 }, () => Array.from({ length: 0 }))
  );
