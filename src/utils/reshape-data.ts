import _ from "lodash";

// eslint-disable-next-line import/prefer-default-export
export const reshapeData = (data: Object, exclude: string[]) => {
  if (Array.isArray(data)) {
    return _.map(
      data,
      (object) => _.omit(object, exclude) // return from _.omit
    );
  }
  return _.omit(data, exclude);
};
