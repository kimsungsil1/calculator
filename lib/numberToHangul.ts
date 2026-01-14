const digitHangul = ["", "일", "이", "삼", "사", "오", "육", "칠", "팔", "구"] as const;
const smallUnits = ["", "십", "백", "천"] as const;
const largeUnits = ["", "만", "억", "조", "경"] as const;

const convertGroup = (group: string) => {
  let output = "";
  const padded = group.padStart(4, "0");

  for (let i = 0; i < 4; i += 1) {
    const digit = Number(padded[i]);
    if (digit === 0) {
      continue;
    }

    const unitIndex = 3 - i;
    const digitText = digit === 1 && unitIndex > 0 ? "" : digitHangul[digit];
    output += `${digitText}${smallUnits[unitIndex]}`;
  }

  return output;
};

export const numberToHangul = (value: string) => {
  if (value === "Error") {
    return "오류";
  }

  if (value.includes(".")) {
    return "소수점 지원 예정";
  }

  const normalized = value.replace(/,/g, "").replace(/^0+(?!$)/, "");
  if (normalized === "" || normalized === "0") {
    return "영";
  }

  const isNegative = normalized.startsWith("-");
  const digits = isNegative ? normalized.slice(1) : normalized;
  const groups: string[] = [];

  for (let i = digits.length; i > 0; i -= 4) {
    groups.unshift(digits.slice(Math.max(0, i - 4), i));
  }

  const parts: string[] = [];
  groups.forEach((group, index) => {
    const converted = convertGroup(group);
    if (!converted) {
      return;
    }
    const unitIndex = groups.length - 1 - index;
    const unit = largeUnits[unitIndex] ?? "";
    parts.push(`${converted}${unit}`);
  });

  const joined = parts.join(" ");
  return isNegative ? `마이너스 ${joined}` : joined;
};
