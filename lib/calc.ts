export type Operator = "+" | "-" | "×" | "÷";

export type CalcState = {
  left: string;
  operator: Operator | null;
  right: string | null;
  display: string;
};

export const initialState: CalcState = {
  left: "0",
  operator: null,
  right: null,
  display: "0",
};

const isIntegerString = (value: string) => !value.includes(".");

const normalizeNumberString = (value: string) => {
  if (value === "" || value === "-") {
    return "0";
  }
  return value;
};

export const formatNumber = (value: string) => {
  if (value === "Error") {
    return value;
  }

  const isNegative = value.startsWith("-");
  const normalized = isNegative ? value.slice(1) : value;
  const [integer, decimal] = normalized.split(".");
  const formattedInteger = integer
    .replace(/^0+(?!$)/, "")
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  const withDecimal = decimal !== undefined ? `${formattedInteger}.${decimal}` : formattedInteger;

  return isNegative ? `-${withDecimal}` : withDecimal;
};

const compute = (left: string, right: string, operator: Operator) => {
  if (left === "" || right === "") {
    return left;
  }

  if (isIntegerString(left) && isIntegerString(right)) {
    const leftBig = BigInt(left);
    const rightBig = BigInt(right);

    if (operator === "+") {
      return (leftBig + rightBig).toString();
    }
    if (operator === "-") {
      return (leftBig - rightBig).toString();
    }
    if (operator === "×") {
      return (leftBig * rightBig).toString();
    }
    if (operator === "÷") {
      if (rightBig === 0n) {
        return "Error";
      }
      if (leftBig % rightBig === 0n) {
        return (leftBig / rightBig).toString();
      }
    }
  }

  const leftNum = Number(left);
  const rightNum = Number(right);

  if (!Number.isFinite(leftNum) || !Number.isFinite(rightNum)) {
    return "Error";
  }

  if (operator === "÷" && rightNum === 0) {
    return "Error";
  }

  const result =
    operator === "+"
      ? leftNum + rightNum
      : operator === "-"
      ? leftNum - rightNum
      : operator === "×"
      ? leftNum * rightNum
      : leftNum / rightNum;

  return result.toString();
};

const updateDisplay = (state: CalcState) => {
  if (state.display === "Error") {
    return state;
  }

  const activeValue = state.right ?? state.left;
  return {
    ...state,
    display: formatNumber(normalizeNumberString(activeValue)),
  };
};

const resetIfError = (state: CalcState) => {
  if (state.display === "Error") {
    return { ...initialState };
  }
  return state;
};

const appendDigit = (value: string, digit: string) => {
  if (value === "0" && digit !== ".") {
    return digit;
  }
  if (digit === ".") {
    if (value.includes(".")) {
      return value;
    }
    return value === "" ? "0." : `${value}.`;
  }
  return `${value}${digit}`;
};

export const applyInput = (state: CalcState, input: string): CalcState => {
  const safeState = resetIfError(state);

  if (input === "AC") {
    return { ...initialState };
  }

  if (input === "⌫") {
    if (safeState.right !== null) {
      const updated = safeState.right.slice(0, -1);
      return updateDisplay({
        ...safeState,
        right: updated.length ? updated : "0",
      });
    }

    const updated = safeState.left.slice(0, -1);
    return updateDisplay({
      ...safeState,
      left: updated.length ? updated : "0",
    });
  }

  if (input === "=") {
    if (safeState.operator && safeState.right !== null) {
      const result = compute(safeState.left, safeState.right, safeState.operator);
      const nextState = {
        left: result === "Error" ? "0" : result,
        operator: null,
        right: null,
        display: result,
      } satisfies CalcState;

      return updateDisplay(nextState);
    }

    return updateDisplay(safeState);
  }

  if (["+", "-", "×", "÷"].includes(input)) {
    const op = input as Operator;
    if (safeState.operator && safeState.right !== null) {
      const result = compute(safeState.left, safeState.right, safeState.operator);
      return updateDisplay({
        left: result === "Error" ? "0" : result,
        operator: op,
        right: null,
        display: result,
      });
    }

    return updateDisplay({
      ...safeState,
      operator: op,
      right: null,
    });
  }

  if (/^\d$/.test(input) || input === ".") {
    if (safeState.operator) {
      const nextRight = appendDigit(safeState.right ?? "", input);
      return updateDisplay({
        ...safeState,
        right: nextRight,
      });
    }

    const nextLeft = appendDigit(safeState.left, input);
    return updateDisplay({
      ...safeState,
      left: nextLeft,
    });
  }

  return updateDisplay(safeState);
};
