import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";
const name="1518-eclat", value="éclat", ns=`salarié . convention collective . ${value}`;
const version=COMPILED_VERSIONS[name]?.find(v=>v.version==="2026.1"); assert.ok(version);
const extension=await version.loadRules(); const rules:Record<string,Rule>={...modeleSocial};
const choice=rules["salarié . convention collective"] as Rule & {"une possibilité":string[]}; rules["salarié . convention collective"]={...choice,"une possibilité":[...choice["une possibilité"],value]} as Rule; Object.assign(rules,extension);
const engine=new Engine(rules,{logger:{log(){},warn(){},error(){}}});
const minimums={A:1858.11,B:1912.59,C:2048.79,D:2184.99,E:2321.19,F:2491.44,G:2661.69,H:2831.94,I:3172.44,J:3512.94} as const;
function set(group:string|undefined, extra:Record<string,string|number>={}, context:Record<string,string|number>={}) { engine.setSituation({"salarié . convention collective":`'${value}'`,...(group?{[`${ns} . groupe`]:`'${group}'`}:{}),...Object.fromEntries(Object.entries(extra).map(([k,v])=>[`${ns} . ${k}`,v])),...context}); }
function amount(rule:string) { const v=engine.evaluate(`${ns} . ${rule}`).nodeValue; assert.equal(typeof v,"number"); return Math.round((v as number)*100)/100; }
describe("IDCC 1518 — 2026.1 ÉCLAT",()=>{
 it("exports 2026 point values and sources",()=>{assert.equal(version.validFrom,"2026-01-01");assert.ok(version.sources.some(s=>s.includes("KALITEXT000052447622")));});
 for(const [g,expected] of Object.entries(minimums)) it(`${g}: ${expected} €`,()=>{set(g);assert.equal(amount("salaire minimum conventionnel"),expected);});
 it("adds ten coordination points to group C",()=>{set("C",{"coordination habituelle": "oui"});assert.equal(amount("salaire minimum conventionnel"),2116.89);});
 it("prorates once and applies seniority points at V1",()=>{set("B",{"années complètes d'ancienneté": 2},{"salarié . contrat . temps de travail . quotité":"50%"});assert.equal(amount("salaire minimum conventionnel"),956.3);assert.equal(amount("complément d'ancienneté"),14.46);});
 it("flags unknown groups and is inapplicable outside agreement",()=>{set("K");assert.equal(engine.evaluate(`${ns} . groupe hors grille`).nodeValue,true);assert.equal(amount("salaire minimum conventionnel"),0);engine.setSituation({"salarié . convention collective":"'droit commun'"});assert.equal(engine.evaluate(`${ns} . salaire minimum conventionnel`).nodeValue,null);});
});
