import { describe, expect, it } from "vitest";
import { numberToHangul } from "@/lib/numberToHangul";

describe("numberToHangul", () => {
  it("converts small numbers", () => {
    expect(numberToHangul("0")).toBe("영");
    expect(numberToHangul("5")).toBe("오");
    expect(numberToHangul("15")).toBe("십오");
  });

  it("formats large amounts with 만/억", () => {
    expect(numberToHangul("5000000")).toBe("오백만");
    expect(numberToHangul("12340000")).toBe("천이백삼십사만");
    expect(numberToHangul("1005000000")).toBe("십억 오백만");
  });

  it("handles decimals and errors", () => {
    expect(numberToHangul("12.34")).toBe("소수점 지원 예정");
    expect(numberToHangul("Error")).toBe("오류");
  });
});
