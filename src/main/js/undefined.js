
export const Undefined = () => {
  return Undefined.apply();
};

Undefined.apply = () => {
  return {
    value: undefined
  };
};
