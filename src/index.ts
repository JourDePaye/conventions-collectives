import type { Rule } from "publicodes";

/** An immutable version of a collective agreement's publicodes model. */
export type CollectiveAgreementVersion = {
  version: string;
  validFrom: string;
  /**
   * Date from which the version also binds the employers that do not belong to a signatory
   * organisation (publication of its extension order), when later than `validFrom`. Absent: the
   * version binds every employer from `validFrom` if its accord was extended by then, else only
   * the members (the consumer knows which agreements' accords are not extended).
   */
  extension?: string;
  contentHash: string;
  sources: readonly string[];
  loadRules: () => Promise<Record<string, Rule>>;
};

export { COMPILED_VERSIONS } from "./compiled/index.ts";
