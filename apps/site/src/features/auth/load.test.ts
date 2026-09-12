import { describe, expect, it } from "vitest";
import { canShowAuthStep, fallbackAuthPath, parseEntryKind, stepFromPath } from "./gate";

describe("auth step gate", () => {
  it("hides the chooser and later screens until a code is verified", () => {
    expect(
      canShowAuthStep({ mode: "start", step: "choose", preStep: "code", sessionPresent: false }),
    ).toBe(false);
    expect(
      canShowAuthStep({ mode: "start", step: "profile", preStep: "code", sessionPresent: false }),
    ).toBe(false);
    expect(
      canShowAuthStep({ mode: "start", step: "choose", preStep: "choose", sessionPresent: false }),
    ).toBe(true);
  });

  it("never names a recycled path before verification", () => {
    expect(
      canShowAuthStep({ mode: "recover", step: "recycled", preStep: "code", sessionPresent: false }),
    ).toBe(false);
    expect(fallbackAuthPath("en", "recover", "code")).toBe("/en/recover");
  });

  it("requires a session for the exists screen", () => {
    expect(
      canShowAuthStep({ mode: "start", step: "done", preStep: null, sessionPresent: false }),
    ).toBe(false);
    expect(
      canShowAuthStep({ mode: "start", step: "done", preStep: null, sessionPresent: true }),
    ).toBe(true);
  });

  it("maps name to profile and keeps unknown recover steps on the hub", () => {
    expect(stepFromPath("start", ["name"])).toBe("profile");
    expect(stepFromPath("recover", ["unknown"])).toBe("recover");
    expect(parseEntryKind("demo")).toBe("demo");
    expect(parseEntryKind("nope")).toBe("landing");
  });
});
