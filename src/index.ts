import type { Rule } from "publicodes";

/** An immutable version of a collective agreement's publicodes model. */
export type CollectiveAgreementVersion = {
  version: string;
  validFrom: string;
  /**
   * Date from which the version also binds the employers that do not belong to a signatory
   * organisation (publication of its extension order). Absent: it binds only those employers.
   */
  extension?: string;
  contentHash: string;
  sources: readonly string[];
  loadRules: () => Promise<Record<string, Rule>>;
};

export { COMPILED_VERSIONS } from "./compiled/index.ts";
