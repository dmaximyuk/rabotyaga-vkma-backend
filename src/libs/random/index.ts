type TRandomType = "NUM" | "NUMS" | "ELEMENTS";

const random = <T>(type: TRandomType, ...args: Array<T>) => {
  switch (type) {
    case "NUM":
      return;
  }
};

export default <
  {
    num: (a: number) => number;
    nums: (a: number, b: number) => number;
    elements: <T>(...args: Array<T>) => T;
  }
>{
  num: (a) => random(a),
  nums: (a, b) => random(a, b),
  elements: (...args) => random(...args),
};
