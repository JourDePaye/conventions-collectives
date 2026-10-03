import type { Rule } from "publicodes";

/** An immutable version of a collective agreement's publicodes model. */
export type CollectiveAgreementVersion = {
  version: string;
  validFrom: string;
  contentHash: string;
  sources: readonly string[];
  loadRules: () => Promise<Record<string, Rule>>;
};

export { COMPILED_VERSIONS } from "./compiled/index.ts";
