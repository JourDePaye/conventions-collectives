import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";
const namespace = "salarié . convention collective . restauration collective";
const version = COMPILED_VERSIONS["1266-restauration-collective"]?.find(v => v.version === "2025.1");
assert.ok(version, "Agreement version must be exported");
const extension = await version.loadRules();
const rules = { ...modeleSocial, ...extension } as Record<string, Rule>;
const choice = rules["salarié . convention collective"] as Rule & { "une possibilité": string[] };
rules["salarié . convention collective"] = { ...choice, "une possibilité": [...choice["une possibilité"], "restauration collective"] } as Rule;
const engine = new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });
function situation(level = "III", extra: Record<string, string | number> = {}) {
 engine.setSituation({ "salarié": "oui", "dirigeant": "non", "salarié . convention collective": "'restauration collective'", [`${namespace} . niveau`]: `'${level}'`, "date": "11/10/2026", ...extra });
}
function value(rule: string) { return engine.evaluate(rule.startsWith("salarié .") ? rule : `${namespace} . ${rule}`).nodeValue; }
function amount(rule: string) { const v = value(rule); assert.equal(typeof v, "number", rule); return Math.round((v as number)*100)/100; }
describe("IDCC 1266", () => {
 it("exports the nine monthly SMM without including a thirteenth month", () => {
  assert.equal(version.validFrom, "2025-07-01");
  for (const [level, floor] of Object.entries({I:1803.32,II:1812.42,III:1835.17,IV:1865.50,V:1965.60,VI:2041.43,VII:2168.83,VIII:2278.03,IX:2928.68})) {
   situation(level); assert.equal(amount("salaire minimum conventionnel"), floor);
   situation(level, {"salarié . contrat . temps de travail . quotité":"50%"}); assert.equal(amount("salaire minimum conventionnel"), Math.round(floor*50)/100);
  }
 });
 it("restricts seniority to employees I–V and tests every threshold", () => {
  for (const [level, floor] of Object.entries({I:1803.32,II:1812.42,III:1835.17,IV:1865.50,V:1965.60,VI:2041.43,VII:2168.83,VIII:2278.03,IX:2928.68})) {
   for (const [years, rate] of [[0,0],[4.99,0],[5,0.01],[9.99,0.01],[10,0.02],[14.99,0.02],[15,0.03],[19.99,0.03],[20,0.04],[30,0.04]] as const) {
    situation(level, {[`${namespace} . ancienneté entreprise`]:`${years} an`, "salarié . contrat . temps de travail . quotité":"50%"});
    assert.equal(amount("prime d'ancienneté"), Math.round((['I','II','III','IV','V'].includes(level) ? floor*rate*0.5 : 0)*100)/100);
   }
  }
 });
 it("preserves the nine annual floors only after a completed continuous year", () => {
  for (const [level, floor] of Object.entries({I:23443.16,II:23561.46,III:23857.21,IV:24251.50,V:25552.80,VI:26538.59,VII:28194.79,VIII:29614.39,IX:38072.84})) {
   situation(level); assert.equal(value("salaire minimum annuel conventionnel"), null);
   situation(level, {[`${namespace} . un an continu révolu`]:"oui"}); assert.equal(amount("salaire minimum annuel conventionnel"),floor);
   assert.equal(engine.evaluate(`${namespace} . salaire minimum annuel conventionnel`).unit?.numerators.join("/"), "€");
   assert.equal(engine.evaluate(`${namespace} . salaire minimum annuel conventionnel`).unit?.denominators.join("/"), "an");
   situation(level, {[`${namespace} . un an continu révolu`]:"oui", "salarié . contrat . temps de travail . quotité":"50%"}); assert.equal(amount("salaire minimum annuel conventionnel"),Math.round(floor*50)/100);
  }
 });
 it("requires the PAC's establishment, rota and Sunday conditions before payment", () => {
  const eligible = {[`${namespace} . établissement activité continue 7 jours sur 7`]:"oui",[`${namespace} . astreint aux roulements et repos conventionnels`]:"oui",[`${namespace} . amené à travailler le dimanche`]:"oui"};
  for (const flag of Object.keys(eligible)) { situation("III", {...eligible,[flag]:"non"}); assert.equal(amount("prime d'activité continue"),0); }
  situation("III", eligible); assert.equal(amount("prime d'activité continue"),53);
  for (const [fraction, complete, expected] of [[0.2,"oui",26.5],[0.2,"non",10.6],[0.5,"oui",26.5],[0.8,"oui",42.4],[1,"oui",53]] as const) {
   situation("III",{...eligible,"salarié . contrat . temps de travail . temps partiel":"oui",[`${namespace} . fraction horaire entreprise ouvrant droit`]:`${fraction*100}%`,[`${namespace} . mois complet ouvrant droit`]:complete});
   assert.equal(amount("prime d'activité continue"),expected);
  }
  situation("III",{...eligible,[`${namespace} . prime mensuelle déjà versée de même objet que la PAC`]:"60 €/mois"}); assert.equal(amount("prime d'activité continue"),0);
  situation("III",{...eligible,[`${namespace} . prime mensuelle déjà versée de même objet que la PAC`]:"20 €/mois"}); assert.equal(amount("prime d'activité continue"),33);
 });
 it("pays service minimum only for dependent diners and a service obligation", () => {
  const eligible = {[`${namespace} . établissement activité continue 7 jours sur 7`]:"oui",[`${namespace} . restauration ou hôtellerie pour convives dépendants`]:"oui",[`${namespace} . astreint au service minimum`]:"oui"};
  for (const flag of Object.keys(eligible)) { situation("III",{...eligible,[flag]:"non"}); assert.equal(amount("prime de service minimum"),0); }
  situation("III",eligible); assert.equal(amount("prime de service minimum"),22.5);
  situation("III",{...eligible,"salarié . contrat . temps de travail . temps partiel":"oui",[`${namespace} . fraction horaire entreprise ouvrant droit`]:"20%",[`${namespace} . mois complet ouvrant droit`]:"oui"}); assert.equal(amount("prime de service minimum"),11.25);
  situation("III",{...eligible,[`${namespace} . fraction horaire entreprise ouvrant droit`]:"20%"}); assert.equal(amount("prime de service minimum"),4.5);
  situation("III",{...eligible,[`${namespace} . prime mensuelle déjà versée de même objet que la PSM`]:"30 €/mois"}); assert.equal(amount("prime de service minimum"),0);
 });
 it("uses actual eligible base pay for the thirteenth month without double proration", () => {
  situation("III",{[`${namespace} . salaire annuel de base éligible au treizième mois`]:"12000 €/an","salarié . contrat . temps de travail . quotité":"50%"}); assert.equal(amount("treizième mois annuel"),0);
  situation("III",{[`${namespace} . un an continu révolu`]:"oui",[`${namespace} . salaire annuel de base éligible au treizième mois`]:"12000 €/an","salarié . contrat . temps de travail . quotité":"50%"}); assert.equal(amount("treizième mois annuel"),1000);
  situation("III",{[`${namespace} . un an continu révolu`]:"oui",[`${namespace} . salaire annuel de base éligible au treizième mois`]:"6000 €/an"}); assert.equal(amount("treizième mois annuel"),500);
  situation("III",{[`${namespace} . un an continu révolu`]:"oui",[`${namespace} . salaire annuel de base éligible au treizième mois`]:"24000 €/an",[`${namespace} . treizième mois ou prime assimilée déjà versé`]:"2200 €/an"}); assert.equal(amount("treizième mois annuel"),0);
 });
 it("uses the intermittent school's annual base and strict six-month/1000-hour boundaries", () => {
  const input = {[`${namespace} . contrat intermittent scolaire`]:"oui",[`${namespace} . inscrit à l'effectif au versement`]:"oui",[`${namespace} . ancienneté entreprise`]:"0.5 an",[`${namespace} . salaire annuel de base intermittent`]:"12000 €/an",[`${namespace} . durée annuelle de travail intermittent`]:"999 heure"};
  situation("III",input); assert.equal(amount("prime annuelle d'intermittence"),420);
  for (const hours of [1000,1001]) { situation("III",{...input,[`${namespace} . durée annuelle de travail intermittent`]:`${hours} heure`}); assert.equal(amount("prime annuelle d'intermittence"),240); }
  situation("III",{...input,[`${namespace} . ancienneté entreprise`]:"0.49 an"}); assert.equal(amount("prime annuelle d'intermittence"),0);
  for (const flag of ["contrat intermittent scolaire","inscrit à l'effectif au versement"]) { situation("III",{...input,[`${namespace} . ${flag}`]:"non"}); assert.equal(amount("prime annuelle d'intermittence"),0); }
  situation("III",{...input,"salarié . contrat . temps de travail . quotité":"50%"}); assert.equal(amount("prime annuelle d'intermittence"),420);
 });
 it("pays only validated breaks above two hours and uses the supplied statutory MG", () => {
  situation(); assert.equal(amount("indemnité mensuelle de coupure"),0);
  situation("III",{[`${namespace} . coupures éligibles de plus de deux heures`]:3,[`${namespace} . minimum garanti par coupure`]:"4.22 €/coupure"}); assert.equal(amount("indemnité mensuelle de coupure"),7.22);
  situation("III",{[`${namespace} . coupures éligibles de plus de deux heures`]:3,[`${namespace} . minimum garanti par coupure`]:"4.5 €/coupure",[`${namespace} . indemnité mensuelle déjà versée de même objet que la coupure`]:"10 €/mois"}); assert.equal(amount("indemnité mensuelle de coupure"),0);
  situation("III",{[`${namespace} . coupures éligibles de plus de deux heures`]:1}); assert.ok(Object.keys(engine.evaluate(`${namespace} . indemnité mensuelle de coupure`).missingVariables).includes(`${namespace} . minimum garanti par coupure`));
 });
 it("pays every validated detachment day from day one without capping earned pay", () => {
  situation(); assert.equal(amount("prime mensuelle de détachement"),0);
  for (const [days, rate, expected] of [[1,4,4],[6,4,24],[31,4,124],[2,5,10],[2,3,8]] as const) {
   situation("III",{[`${namespace} . journées de détachement éligibles`]:`${days} jour/mois`,[`${namespace} . prime journalière de détachement entreprise`]:`${rate} €/jour`}); assert.equal(amount("prime mensuelle de détachement"),expected);
  }
 });
 it("keeps branch paritarisme on the employer's prior-year payroll, never the monthly wage", () => {
  situation("III",{[`${namespace} . masse salariale entreprise exercice précédent`]:"1000000 €/an"}); assert.equal(amount("contribution annuelle entreprise paritarisme"),160);
  situation("III",{[`${namespace} . masse salariale entreprise exercice précédent`]:"1000000 €/an","salarié . contrat . temps de travail . quotité":"50%","salarié . rémunération . brut":"3000 €/mois"}); assert.equal(amount("contribution annuelle entreprise paritarisme"),160);
 });
 it("preserves hourly floors and exposes a separate statutory SMIC safeguard", () => {
  for (const [level, floor] of Object.entries({I:11.89,II:11.95,III:12.10,IV:12.30,V:12.96,VI:13.46,VII:14.30,VIII:15.02,IX:19.31})) {
   situation(level,{"SMIC . horaire":"15 €/heure"}); assert.equal(amount("minimum horaire"),floor); assert.equal(amount("taux horaire minimum applicable"),Math.max(floor,15));
  }
  situation("I",{"SMIC . horaire":"15 €/heure"}); assert.equal(amount("salaire minimum légal et conventionnel"),2275); assert.equal(amount("salaire minimum conventionnel"),1803.32);
  situation("I",{"SMIC . horaire":"15 €/heure","salarié . contrat . temps de travail . quotité":"50%"}); assert.equal(amount("salaire minimum légal et conventionnel"),1137.5);
 });
 it("flags unknown classifications and never presents them as a validated legal floor", () => {
  for (const level of ["non renseigné","0","X","invalid"]) {
   situation(level,{[`${namespace} . un an continu révolu`]:"oui",[`${namespace} . ancienneté entreprise`]:"25 an"});
   assert.equal(value("niveau hors grille"),true); assert.equal(amount("salaire minimum conventionnel"),0); assert.equal(amount("prime d'ancienneté"),0);
   for (const rule of ["salaire minimum annuel conventionnel","taux horaire minimum applicable","salaire minimum légal et conventionnel"]) assert.equal(value(rule),null);
  }
 });
 it("rejects pre-extension application and excluded activities without leaking into other conventions", () => {
  const endpoints = ["salaire minimum conventionnel","salaire minimum annuel conventionnel","prime d'ancienneté","prime d'activité continue","prime de service minimum","treizième mois annuel","prime annuelle d'intermittence","indemnité mensuelle de coupure","prime mensuelle de détachement","contribution annuelle entreprise paritarisme"];
  situation("III",{"date":"30/06/2025",[`${namespace} . un an continu révolu`]:"oui"});
  for (const rule of endpoints) assert.equal(value(rule),null,rule);
  situation("III",{"date":"01/07/2025"}); assert.equal(amount("salaire minimum conventionnel"),1835.17);
  situation("III",{[`${namespace} . hors champ conventionnel`]:"oui"}); for (const rule of endpoints) assert.equal(value(rule),null,rule);
  situation("III",{"salarié . convention collective":"'autre'"}); for (const rule of endpoints) assert.equal(value(rule),null,rule);
 });
 it("requires real annual bases when a thirteenth month or intermittent bonus is due", () => {
  situation("III",{[`${namespace} . un an continu révolu`]:"oui"});
  let result = engine.evaluate(`${namespace} . treizième mois annuel`); assert.equal(result.nodeValue,undefined); assert.ok(`${namespace} . salaire annuel de base éligible au treizième mois` in result.missingVariables);
  situation("III",{[`${namespace} . contrat intermittent scolaire`]:"oui",[`${namespace} . inscrit à l'effectif au versement`]:"oui",[`${namespace} . ancienneté entreprise`]:"1 an"});
  result=engine.evaluate(`${namespace} . prime annuelle d'intermittence`); assert.equal(result.nodeValue,undefined); assert.ok(`${namespace} . salaire annuel de base intermittent` in result.missingVariables); assert.ok(`${namespace} . durée annuelle de travail intermittent` in result.missingVariables);
 });
 it("does not invent branch insurance rates or change actual standard payroll endpoints", () => {
  const baseline = new Engine(modeleSocial,{logger:{log(){},warn(){},error(){}}});
  const input = {"salarié":"oui","dirigeant":"non","salarié . contrat . statut cadre":"non","salarié . rémunération . brut":"3000 €/mois","salarié . cotisations . assiette":"3000 €/mois","plafond sécurité sociale":"4000 €/mois","salarié . cotisations . prévoyances . santé . montant":"60 €/mois","entreprise . salariés . effectif":20,"établissement . taux ATMP":"2%","date":"11/10/2026"};
  baseline.setSituation({...input,"salarié . convention collective":"'autre'"}); situation("III",input);
  for (const endpoint of ["salarié . cotisations . ATMP","salarié . cotisations . formation professionnelle","salarié . cotisations . prévoyances . santé . employeur","salarié . cotisations . prévoyances . santé . salarié","salarié . cotisations . prévoyances . conventionnelle . employeur","salarié . cotisations . employeur"]) {
   const expected=baseline.evaluate(endpoint).nodeValue; if (endpoint === "salarié . cotisations . prévoyances . conventionnelle . employeur") assert.equal(expected,null); else assert.equal(typeof expected,"number",endpoint); assert.equal(value(endpoint),expected,endpoint);
  }
  situation("III",{...input,"salarié . convention collective":"'autre'"});
  for (const endpoint of ["salarié . cotisations . ATMP","salarié . cotisations . formation professionnelle","salarié . cotisations . prévoyances . santé . montant","salarié . cotisations . employeur"]) assert.equal(value(endpoint),baseline.evaluate(endpoint).nodeValue,endpoint);
 });
});
