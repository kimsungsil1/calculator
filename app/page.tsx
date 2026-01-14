"use client";

import { useMemo, useState } from "react";
import { applyInput, formatNumber, initialState } from "@/lib/calc";
import { numberToHangul } from "@/lib/numberToHangul";

const buttonRows = [
  ["AC", "⌫", "÷"],
  ["7", "8", "9", "×"],
  ["4", "5", "6", "-"],
  ["1", "2", "3", "+"],
  ["0", ".", "="],
];

const actionStyles: Record<string, string> = {
  "÷": "bg-slate-700 text-white",
  "×": "bg-slate-700 text-white",
  "-": "bg-slate-700 text-white",
  "+": "bg-slate-700 text-white",
  "=": "bg-emerald-500 text-slate-900",
  AC: "bg-slate-600 text-white",
  "⌫": "bg-slate-600 text-white",
};

export default function Home() {
  const [state, setState] = useState(initialState);
  const [copyMessage, setCopyMessage] = useState<string | null>(null);

  const displayValue = state.display === "Error" ? "Error" : formatNumber(state.display);
  const hangulValue = useMemo(() => numberToHangul(state.display), [state.display]);

  const handleInput = (value: string) => {
    setState((current) => applyInput(current, value));
  };

  const handleCopy = async (type: "number" | "hangul") => {
    const text = type === "number" ? displayValue : hangulValue;
    try {
      await navigator.clipboard.writeText(text);
      setCopyMessage(type === "number" ? "숫자를 복사했어요." : "한글 금액을 복사했어요.");
    } catch (error) {
      console.error(error);
      setCopyMessage("복사에 실패했어요.");
    }

    setTimeout(() => setCopyMessage(null), 1800);
  };

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-6">
      <section className="w-full max-w-sm rounded-[32px] bg-slate-900 p-6 shadow-2xl shadow-black/40">
        <header className="mb-6">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Hangul Amount</p>
          <h1 className="mt-2 text-2xl font-semibold text-white">한글 금액 계산기</h1>
        </header>

        <div className="rounded-2xl bg-slate-950 p-5">
          <div className="text-right text-4xl font-semibold leading-tight text-white">
            {displayValue}
          </div>
          <div className="mt-2 text-right text-sm text-slate-400">{hangulValue}</div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => handleCopy("number")}
            className="rounded-xl border border-slate-700/60 px-3 py-2.5 text-sm font-medium text-slate-200 transition hover:border-slate-500"
          >
            숫자 복사
          </button>
          <button
            type="button"
            onClick={() => handleCopy("hangul")}
            className="rounded-xl border border-slate-700/60 px-3 py-2.5 text-sm font-medium text-slate-200 transition hover:border-slate-500"
          >
            한글 복사
          </button>
        </div>

        {copyMessage ? (
          <p className="mt-3 text-center text-xs text-emerald-300">{copyMessage}</p>
        ) : (
          <p className="mt-3 text-center text-xs text-slate-500">터치해서 복사하세요.</p>
        )}

        <div className="mt-6 grid gap-3">
          {buttonRows.map((row) => (
            <div key={row.join("-")} className="grid grid-cols-4 gap-3">
              {row.map((label) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => handleInput(label)}
                  className={`h-16 rounded-2xl text-xl font-semibold transition active:scale-95 ${
                    actionStyles[label] ?? "bg-slate-800 text-white"
                  } ${label === "0" ? "col-span-2" : ""}`}
                >
                  {label}
                </button>
              ))}
              {row.length < 4 && (
                <div className="hidden" aria-hidden="true" />
              )}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
