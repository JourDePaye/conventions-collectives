import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";
const id = "2148-telecommunications";
const ns = "salarié . convention collective . télécommunications";
async function makeEngine() {
  const version = COMPILED_VERSIONS[id]?.find(v => v.version === "2026.1");
  assert.ok(version, "IDCC 2148 must be exported");
  const extension = await version.loadRules();
  const rules: Record<string, Rule> = { ...modeleSocial };
  const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
  rules["salarié . convention collective"] = { ...choice, "une possibilité": [...choice["une possibilité"], "télécommunications"] } as Rule;
  Object.assign(rules, extension);
  return { engine: new Engine(rules, { logger: { log() {}, warn() {}, error() {} } }), version, extension };
}
function set(engine: Engine, inputs: Record<string, string | number> = {}) {
  engine.setSituation({ "salarié": "oui", "dirigeant": "non", "salarié . convention collective": "'télécommunications'", [`${ns} . niveau`]: "'A.1'", [`${ns} . date de calcul`]: "11/10/2026", ...Object.fromEntries(Object.entries(inputs).map(([k,v]) => [k.includes(" . ") || k === "date" ? k : `${ns} . ${k}`,v])) });
}
const get = (e: Engine, k: string) => e.evaluate(`${ns} . ${k}`);
// Independent transcription of article 1, KALIARTI000054092244 (not generated from implementation).
const grid = { A: [22757,23723,24894,26170], B: [23871,24657,25683,27294], C: [25185,26099,28470,29616], D: [28747,29927,32594,34427], E: [36235,41114,46894,49898], F: [48616,58172], G: [69450,84250] };
describe("IDCC 2148 — annual grid", () => {
  for (const [group, amounts] of Object.entries(grid)) {
    const thresholds = amounts.length === 4 ? ["1","1bis","2","3"] : ["1","2"];
    amounts.forEach((amount, index) => it(`${group}.${thresholds[index]} annual minimum`, async () => {
      const { engine } = await makeEngine(); set(engine, { niveau: `'${group}.${thresholds[index]}'` });
      const result = get(engine,"minimum annuel"); assert.equal(result.nodeValue,amount);
      assert.equal(result.unit?.numerators?.includes("€"),true); assert.equal(result.unit?.denominators?.includes("an"),true);
    }));
  }
  for (const niveau of ["A.0","F.1bis","G.3","H.1","non renseigné"]) it(`rejects ${niveau}`,async () => {
    const {engine} = await makeEngine(); set(engine,{niveau:`'${niveau}'`}); assert.equal(get(engine,"minimum annuel").nodeValue,null);
  });
  for (const [date,member,expected] of [["17/04/2026","non",null],["18/04/2026","non",22757],["22/01/2026","oui",null],["23/01/2026","oui",22757],["01/01/2027","oui",null]] as const) it(`date ${date}, member ${member}`,async () => {
    const {engine} = await makeEngine(); set(engine,{"date de calcul":date,"adhésion HumApp validée":member}); assert.equal(get(engine,"minimum annuel").nodeValue,expected);
  });
  for (const contract of ["apprentissage","professionnalisation","stage"]) it(`excludes ${contract}`,async () => {
    const {engine} = await makeEngine(); set(engine,{[`salarié . contrat . ${contract}`]:"oui"}); assert.equal(get(engine,"minimum annuel").nodeValue,null);
  });
});

describe("IDCC 2148 — annual remuneration comparison", () => {
  it("prorates exactly once with recurring variable included in the validated base", async () => {
    const {engine} = await makeEngine(); set(engine,{"fraction annuelle validée":"50%","assiette annuelle validée":"oui","rémunération annuelle retenue":"10000 €/an"});
    assert.equal(get(engine,"salaire minimum annuel conventionnel").nodeValue,11378.5);
    assert.equal(get(engine,"régularisation annuelle").nodeValue,1378.5);
  });
  it("does not fabricate a missing annual remuneration or fraction", async () => {
    const {engine} = await makeEngine(); set(engine,{"assiette annuelle validée":"oui"});
    const result=get(engine,"régularisation annuelle"); assert.equal(result.nodeValue,undefined);
    assert.ok(Object.keys(result.missingVariables).some(k=>k.endsWith("rémunération annuelle retenue")));
    assert.ok(Object.keys(result.missingVariables).some(k=>k.endsWith("fraction annuelle validée")));
  });
  it("requires validation and never creates a negative arrear", async () => {
    const {engine} = await makeEngine(); set(engine); assert.equal(get(engine,"régularisation annuelle").nodeValue,null);
    set(engine,{"fraction annuelle validée":"100%","assiette annuelle validée":"oui","rémunération annuelle retenue":"25000 €/an"}); assert.equal(get(engine,"régularisation annuelle").nodeValue,0);
  });
});

describe("IDCC 2148 — halfway variable-pay check", () => {
  for (const [payments,expected] of [[12,11378.5],[13,10503.23076923077]] as const) it(`${payments} annual payments`, async () => {
    const {engine}=await makeEngine(); set(engine,{"part variable":"oui","moitié de référence atteinte":"oui","assiette intermédiaire validée":"oui","nombre de mensualités":payments,"quotité intermédiaire validée":"100%","rémunération intermédiaire retenue":"10000 €"});
    assert.equal(get(engine,"minimum intermédiaire").nodeValue,expected);
    assert.equal(get(engine,"régularisation intermédiaire").nodeValue,expected-10000);
  });
  it("requires halfway, variable-pay and validated-base gates",async () => {
    const {engine}=await makeEngine(); set(engine); assert.equal(get(engine,"régularisation intermédiaire").nodeValue,null);
    set(engine,{"part variable":"oui","moitié de référence atteinte":"non","assiette intermédiaire validée":"oui"}); assert.equal(get(engine,"régularisation intermédiaire").nodeValue,null);
  });
  it("requires actual payment count and bases rather than defaulting to twelve",async () => {
    const {engine}=await makeEngine(); set(engine,{"part variable":"oui","moitié de référence atteinte":"oui","assiette intermédiaire validée":"oui"});
    const result=get(engine,"régularisation intermédiaire"); assert.equal(result.nodeValue,undefined); assert.ok(Object.keys(result.missingVariables).some(k=>k.endsWith("nombre de mensualités")));
  });
  it("uses contract fraction, not the already prorated annual fraction",async () => {
    const {engine}=await makeEngine(); set(engine,{"part variable":"oui","moitié de référence atteinte":"oui","assiette intermédiaire validée":"oui","nombre de mensualités":12,"quotité intermédiaire validée":"50%","fraction annuelle validée":"25%","rémunération intermédiaire retenue":"6000 €"});
    assert.equal(get(engine,"minimum intermédiaire").nodeValue,5689.25); assert.equal(get(engine,"régularisation intermédiaire").nodeValue,0);
  });
});

describe("IDCC 2148 — monthly SMIC excluding variable pay", () => {
  it("does not use annual variable remuneration to satisfy the monthly safeguard",async () => {
    const {engine}=await makeEngine(); set(engine,{date:"11/10/2026","assiette mensuelle hors variable validée":"oui","rémunération mensuelle hors variable":"1000 €/mois","rémunération annuelle retenue":"40000 €/an"});
    const smic=engine.evaluate("salarié . contrat . temps de travail . SMIC").nodeValue as number;
    assert.ok(smic>1000); assert.equal(get(engine,"régularisation mensuelle SMIC").nodeValue,smic-1000);
  });
  it("retains missing-base information and requires explicit validation",async () => {
    const {engine}=await makeEngine(); set(engine); assert.equal(get(engine,"régularisation mensuelle SMIC").nodeValue,null);
    set(engine,{"assiette mensuelle hors variable validée":"oui"}); assert.equal(get(engine,"régularisation mensuelle SMIC").nodeValue,undefined);
  });
  it("uses the standard part-time monthly SMIC, never annual divided by twelve",async () => {
    const {engine}=await makeEngine(); set(engine,{date:"11/10/2026","salarié . contrat . temps de travail . quotité":"50%","assiette mensuelle hors variable validée":"oui","rémunération mensuelle hors variable":"500 €/mois"});
    const smic=engine.evaluate("salarié . contrat . temps de travail . SMIC").nodeValue as number;
    assert.equal(get(engine,"régularisation mensuelle SMIC").nodeValue,smic-500);
  });
});

describe("IDCC 2148 — validated night-pay regimes", () => {
  for (const [regime,expected] of [["régulière",30],["occasionnelle",100],["occasionnelle dimanche ou férié",220]] as const) it(`${regime}: separate non-stacked supplement`,async () => {
    const {engine}=await makeEngine(); set(engine,{"régime de nuit":`'${regime}'`,"éligibilité nuit validée":"oui","heures de nuit validées":"10 heure","salaire horaire de base":"20 €/heure"}); assert.equal(get(engine,"majoration de nuit").nodeValue,expected);
  });
  for (const extra of [{"compensation occasionnelle en repos":"oui","régime de nuit":"'occasionnelle'"},{"contrepartie entreprise plus favorable":"oui"},{"éligibilité nuit validée":"non"},{"régime de nuit":"'inconnu'"}] as Record<string,string>[]) it(`requires correct eligibility and excludes alternatives: ${JSON.stringify(extra)}`,async () => {
    const {engine}=await makeEngine(); set(engine,{"régime de nuit":"'régulière'","éligibilité nuit validée":"oui",...extra}); assert.equal(get(engine,"majoration de nuit").nodeValue,null);
  });
  it("requires actual hours and base instead of hiding a due supplement as zero",async () => {
    const {engine}=await makeEngine(); set(engine,{"régime de nuit":"'régulière'","éligibilité nuit validée":"oui"}); assert.equal(get(engine,"majoration de nuit").nodeValue,undefined);
  });
});

describe("IDCC 2148 — night-worker rest", () => {
  it("counts eligible weeks below and at nine hours without stacking",async () => {
    const {engine}=await makeEngine(); set(engine,{"statut travailleur de nuit validé":"oui","semaines de nuit moins de neuf heures":3,"semaines de nuit neuf heures ou plus":2}); assert.equal(get(engine,"repos de nuit").nodeValue,120);
  });
  it("replaces weekly rest by three nights for all-year night workers",async () => {
    const {engine}=await makeEngine(); set(engine,{"statut travailleur de nuit validé":"oui","travail de nuit toute l'année":"oui","durée d'une nuit validée":"8 heure","semaines de nuit moins de neuf heures":52,"semaines de nuit neuf heures ou plus":0}); assert.equal(get(engine,"repos de nuit").nodeValue,1440);
  });
  for (const extra of [{"statut travailleur de nuit validé":"non"},{"contrepartie entreprise plus favorable":"oui"},{"forfait jours nuit":"oui"}] as Record<string,string>[]) it(`defers unsupported rest regime ${JSON.stringify(extra)}`,async () => {
    const {engine}=await makeEngine(); set(engine,{"statut travailleur de nuit validé":"oui",...extra}); assert.equal(get(engine,"repos de nuit").nodeValue,null);
  });
  it("requires validated week counts or all-year nightly duration",async () => {
    const {engine}=await makeEngine(); set(engine,{"statut travailleur de nuit validé":"oui"}); assert.equal(get(engine,"repos de nuit").nodeValue,undefined);
    set(engine,{"statut travailleur de nuit validé":"oui","travail de nuit toute l'année":"oui"}); assert.equal(get(engine,"repos de nuit").nodeValue,undefined);
  });
});
