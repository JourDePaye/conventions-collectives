/**
 * Small travel allowances (indemnités de petits déplacements) of the building agreements (shared
 * version 2026.6) and of the public works agreements (shared version 2026.5): the daily travel
 * time (trajet) and transport allowances of each zone and the meal allowance, from the scale of
 * the company's département, each from the publication of its extension order (or its effective
 * date if later), from 1 January 2026.
 *
 * Expected amounts are those of the regional and departmental accords, read on Légifrance on
 * 20 October 2026 (their KALITEXT ids are in the versions' sources), independently of the YAML;
 * the exemption limits are those of the BOSS (frais professionnels, §§ 1940 and 1960).
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import Engine, { type Rule } from "publicodes";
import modeleSocial from "modele-social";
import { COMPILED_VERSIONS } from "../src/index.ts";

const BTP = "salarié . convention collective . BTP";
const P = `${BTP} . petits déplacements`;

type Scale = {
  id: string;
  depts: string[];
  since: string;
  until: string | null;
  /** Building, Centre-Val de Loire: a scale for each company size. */
  small: boolean | null;
  meal: number;
  /** [trajet, transport] by zone; null where the accord fixes none. */
  zones: Record<string, [number | null, number | null]>;
};

const BUILDING_SCALES: Scale[] = [
  { id: "idf 2024 hors 77", depts: ["75", "78", "91", "92", "93", "94", "95"], since: "01/01/2026", until: "05/02/2026", small: null, meal: 11.6, zones: {"1": [2.26, 2.34], "2": [3.12, 3.05], "3": [4.63, 4.61], "4": [5.36, 5.7], "5": [6.71, 7.2], "6": [8.23, 9.55]} },
  { id: "idf 2024 77", depts: ["77"], since: "01/01/2026", until: "05/02/2026", small: null, meal: 11.6, zones: {"1": [2.54, 2.69], "2": [3.44, 3.39], "3": [5.07, 5.07], "4": [5.78, 6.33], "5": [7.29, 8.07], "6": [8.23, 9.55]} },
  { id: "idf 2025", depts: ["75", "77", "78", "91", "92", "93", "94", "95"], since: "05/02/2026", until: null, small: null, meal: 11.85, zones: {"1": [2.54, 2.69], "2": [3.44, 3.39], "3": [5.07, 5.07], "4": [5.78, 6.33], "5": [7.29, 8.07], "6": [8.23, 9.55]} },
  { id: "bretagne 2025", depts: ["22", "29", "35", "56"], since: "01/01/2026", until: "05/02/2026", small: null, meal: 12.14, zones: {"1A": [0.47, 0.57], "1B": [1.51, 2.83], "2": [2.08, 5.67], "3": [3.11, 7.78], "4": [4.36, 9.98], "5": [5.21, 12.15]} },
  { id: "bretagne 2026", depts: ["22", "29", "35", "56"], since: "05/02/2026", until: null, small: null, meal: 12.3, zones: {"1A": [0.47, 0.58], "1B": [1.51, 2.86], "2": [2.08, 5.73], "3": [3.11, 7.86], "4": [4.36, 10.08], "5": [5.21, 12.27]} },
  { id: "hauts de france 2025", depts: ["02", "59", "60", "62", "80"], since: "01/01/2026", until: "28/03/2026", small: null, meal: 14, zones: {"1": [1.55, 2.68], "2": [3.11, 6.38], "3": [4.66, 9.86], "4": [6.22, 12.96], "5": [7.78, 16.57]} },
  { id: "hauts de france 2026", depts: ["02", "59", "60", "62", "80"], since: "28/03/2026", until: null, small: null, meal: 14, zones: {"1": [1.57, 2.71], "2": [3.14, 6.44], "3": [4.71, 9.96], "4": [6.28, 13.09], "5": [7.86, 16.74]} },
  { id: "normandie 2025", depts: ["14", "27", "50", "61", "76"], since: "01/01/2026", until: "10/05/2026", small: null, meal: 12.0, zones: {"1": [1.68, 3.04], "2": [3.36, 6.7], "3": [5.03, 10.05], "4": [6.67, 14.08], "5": [8.39, 18.1]} },
  { id: "normandie 2026", depts: ["14", "27", "50", "61", "76"], since: "10/05/2026", until: null, small: null, meal: 12.5, zones: {"1": [1.68, 3.04], "2": [3.36, 6.7], "3": [5.03, 10.05], "4": [6.67, 14.08], "5": [8.39, 18.1]} },
  { id: "alsace", depts: ["67", "68"], since: "01/01/2026", until: null, small: null, meal: 11.8, zones: {"1": [2.0, 2.8], "2": [3.15, 3.95], "3": [4.6, 5.0], "4": [5.75, 6.9], "5": [7.0, 8.2]} },
  { id: "lorraine", depts: ["54", "55", "57", "88"], since: "01/01/2026", until: null, small: null, meal: 11.8, zones: {"1": [2.0, 2.8], "2": [3.15, 4.7], "3": [4.6, 7.6], "4": [5.75, 11.45], "5": [7.4, 13.35]} },
  { id: "champagne ardenne", depts: ["08", "10", "51", "52"], since: "01/01/2026", until: null, small: null, meal: 11.8, zones: {"1": [2.0, 2.8], "2": [3.15, 4.7], "3": [4.6, 7.45], "4": [5.75, 9.8], "5": [8.25, 11.8]} },
  { id: "centre val de loire 2025 plus de 10", depts: ["18", "28", "36", "37", "41", "45"], since: "01/01/2026", until: "10/07/2026", small: false, meal: 11.0, zones: {"1A": [0.41, 0.53], "1B": [2.58, 3.74], "2": [4.21, 7.87], "3": [5.17, 11.63], "4": [6.49, 16.11], "5": [8.1, 20.61]} },
  { id: "centre val de loire 2026 plus de 10", depts: ["18", "28", "36", "37", "41", "45"], since: "10/07/2026", until: null, small: false, meal: 11.17, zones: {"1A": [0.42, 0.54], "1B": [2.62, 3.8], "2": [4.27, 7.99], "3": [5.25, 11.8], "4": [6.59, 16.35], "5": [8.22, 20.92]} },
  { id: "centre val de loire 2025 jusqu à 10", depts: ["18", "28", "36", "37", "41", "45"], since: "01/01/2026", until: "04/08/2026", small: true, meal: 11.0, zones: {"1A": [0.41, 0.53], "1B": [2.59, 3.76], "2": [4.23, 7.91], "3": [5.2, 11.69], "4": [6.52, 16.19], "5": [8.13, 20.71]} },
  { id: "centre val de loire 2026 jusqu à 10", depts: ["18", "28", "36", "37", "41", "45"], since: "04/08/2026", until: null, small: true, meal: 11.17, zones: {"1A": [0.42, 0.54], "1B": [2.63, 3.82], "2": [4.29, 8.03], "3": [5.28, 11.87], "4": [6.62, 16.43], "5": [8.25, 21.02]} },
  { id: "bourgogne franche comté 2024", depts: ["21", "25", "39", "58", "70", "71", "89", "90"], since: "01/01/2026", until: "04/09/2026", small: null, meal: 11.44, zones: {"1": [1.76, 2.65], "2": [3.38, 5.57], "3": [4.7, 9.06], "4": [6.6, 11.67], "5": [7.77, 14.51]} },
  { id: "bourgogne franche comté 2026", depts: ["21", "25", "39", "58", "70", "71", "89", "90"], since: "04/09/2026", until: "01/01/2027", small: null, meal: 11.61, zones: {"1": [1.79, 2.69], "2": [3.43, 5.65], "3": [4.77, 9.2], "4": [6.7, 11.85], "5": [7.89, 14.73]} },
  { id: "bourgogne franche comté 2027", depts: ["21", "25", "39", "58", "70", "71", "89", "90"], since: "01/01/2027", until: null, small: null, meal: 11.67, zones: {"1": [1.8, 2.7], "2": [3.45, 5.68], "3": [4.79, 9.24], "4": [6.73, 11.9], "5": [7.93, 14.8]} },
  { id: "pays de la loire 2023", depts: ["44", "49", "53", "72", "85"], since: "01/01/2026", until: "01/03/2026", small: null, meal: 11.5, zones: {"1A": [0.48, 0.88], "1B": [0.67, 1.12], "2": [1.9, 4.37], "3": [4.08, 8.25], "4": [5.12, 12.63], "5": [6.11, 18.81], "6": [6.86, 20.14], "7": [8.17, 24.39]} },
  { id: "pays de la loire 2025", depts: ["44", "49", "53", "72", "85"], since: "01/03/2026", until: null, small: null, meal: 12.0, zones: {"1A": [0.48, 0.9], "1B": [0.67, 1.14], "2": [1.9, 4.46], "3": [4.08, 8.42], "4": [5.12, 12.88], "5": [6.11, 19.19], "6": [6.86, 20.54], "7": [8.17, 24.88]} },
  { id: "nouvelle aquitaine 2023", depts: ["16", "17", "19", "23", "24", "33", "40", "47", "64", "79", "86", "87"], since: "01/01/2026", until: "17/01/2026", small: null, meal: 10.8, zones: {"1A": [0.73, 0.88], "1B": [1.65, 2.32], "2": [3.4, 5.04], "3": [4.83, 8.37], "4": [6.28, 11.75], "5": [7.76, 15.1]} },
  { id: "nouvelle aquitaine 2025", depts: ["16", "17", "19", "23", "24", "33", "40", "47", "64", "79", "86", "87"], since: "17/01/2026", until: null, small: null, meal: 11.2, zones: {"1A": [0.74, 0.89], "1B": [1.67, 2.35], "2": [3.45, 5.12], "3": [4.9, 8.5], "4": [6.37, 11.93], "5": [7.88, 15.33]} },
  { id: "occitanie 2024", depts: ["09", "11", "12", "30", "31", "32", "34", "46", "48", "65", "66", "81", "82"], since: "01/01/2026", until: "29/05/2026", small: null, meal: 13.0, zones: {"1A": [2.06, 3.19], "1B": [2.06, 3.19], "2": [4.38, 6.43], "3": [5.58, 9.59], "4": [7.42, 12.7], "5": [9.4, 16.13]} },
  { id: "occitanie 2026", depts: ["09", "11", "12", "30", "31", "32", "34", "46", "48", "65", "66", "81", "82"], since: "29/05/2026", until: null, small: null, meal: 13.2, zones: {"1A": [2.06, 3.19], "1B": [2.06, 3.19], "2": [4.38, 6.43], "3": [5.58, 9.59], "4": [7.42, 12.7], "5": [9.4, 16.13]} },
  { id: "PACA", depts: ["04", "05", "06", "13", "83", "84"], since: "01/01/2026", until: null, small: null, meal: 12.2, zones: {"1": [2.05, 3.65], "2": [3.25, 6.42], "3": [4.38, 8.63], "4": [5.81, 11.26], "5": [6.9, 14.8]} },
  { id: "corse 2023", depts: ["20"], since: "01/01/2026", until: "06/06/2026", small: null, meal: 10.5, zones: {"1": [1.56, 2.54], "2": [2.9, 5.26], "3": [4.24, 8.22], "4": [5.69, 11.26], "5": [8.55, 14.36], "6": [10.89, 18.18], "7": [12.91, 22.25]} },
  { id: "corse 2025", depts: ["20"], since: "06/06/2026", until: null, small: null, meal: 11.0, zones: {"1": [1.56, 2.54], "2": [2.9, 5.26], "3": [4.24, 8.22], "4": [5.69, 11.26], "5": [8.55, 14.36], "6": [10.89, 18.18], "7": [12.91, 22.25]} },
  { id: "auvergne 2024", depts: ["03", "15", "43", "63"], since: "01/01/2026", until: "29/05/2026", small: null, meal: 11.65, zones: {"1A": [0.65, 0.85], "1B": [1.39, 1.94], "2": [2.72, 5.71], "3": [3.95, 9.01], "4": [5.0, 12.46], "5": [6.54, 15.74]} },
  { id: "auvergne 2026", depts: ["03", "15", "43", "63"], since: "29/05/2026", until: null, small: null, meal: 12.0, zones: {"1A": [0.66, 0.86], "1B": [1.4, 1.96], "2": [2.73, 5.77], "3": [3.97, 9.1], "4": [5.03, 12.58], "5": [6.57, 15.9]} },
  { id: "ain 2024", depts: ["01"], since: "01/01/2026", until: "08/05/2026", small: null, meal: 11.71, zones: {"1A": [0.54, 0.85], "1B": [1.27, 2.96], "2": [2.52, 6.23], "3": [3.82, 10.42], "4": [5.06, 14.62], "5": [6.51, 18.8]} },
  { id: "ain 2026", depts: ["01"], since: "08/05/2026", until: null, small: null, meal: 12.06, zones: {"1A": [0.54, 0.86], "1B": [1.28, 3.0], "2": [2.53, 6.32], "3": [3.84, 10.58], "4": [5.09, 14.84], "5": [6.54, 19.08]} },
  { id: "loire 2024", depts: ["42"], since: "01/01/2026", until: "29/05/2026", small: null, meal: 11.76, zones: {"1A": [1.52, 3.31], "1B": [1.52, 3.31], "2": [3.11, 6.71], "3": [4.63, 10.93], "4": [6.26, 15.35], "5": [8.07, 20.0]} },
  { id: "loire 2026", depts: ["42"], since: "29/05/2026", until: null, small: null, meal: 12.11, zones: {"1A": [1.54, 3.34], "1B": [1.54, 3.34], "2": [3.14, 6.78], "3": [4.68, 11.04], "4": [6.32, 15.5], "5": [8.15, 20.2]} },
  { id: "savoie 2025", depts: ["73"], since: "01/01/2026", until: "24/02/2026", small: null, meal: 12.03, zones: {"1": [1.95, 4.31], "2": [3.79, 8.63], "3": [5.85, 12.94], "4": [7.6, 17.26], "5": [9.55, 21.57]} },
  { id: "savoie 2026", depts: ["73"], since: "24/02/2026", until: null, small: null, meal: 12.25, zones: {"1": [1.97, 4.33], "2": [3.83, 8.67], "3": [5.91, 13.0], "4": [7.67, 17.34], "5": [9.65, 21.67]} },
  { id: "haute savoie 2024", depts: ["74"], since: "01/01/2026", until: "20/03/2026", small: null, meal: 12.63, zones: {"1A": [0.92, 1.88], "1B": [1.52, 2.81], "2": [3.01, 6.52], "3": [4.42, 10.29], "4": [5.75, 14.26], "5": [7.35, 18.05]} },
  { id: "haute savoie 2026", depts: ["74"], since: "20/03/2026", until: null, small: null, meal: 12.88, zones: {"1A": [0.92, 1.9], "1B": [1.52, 2.84], "2": [3.01, 6.59], "3": [4.42, 10.39], "4": [5.75, 14.4], "5": [7.35, 18.23]} },
  { id: "isère 2024", depts: ["38"], since: "01/01/2026", until: "19/03/2026", small: null, meal: 11.82, zones: {"1A": [0.69, 1.11], "1B": [2.01, 3.38], "2": [3.69, 6.63], "3": [5.71, 10.84], "4": [7.73, 15.03], "5": [9.64, 18.95]} },
  { id: "isère 2026", depts: ["38"], since: "19/03/2026", until: null, small: null, meal: 12.06, zones: {"1A": [0.69, 1.12], "1B": [2.02, 3.4], "2": [3.72, 6.66], "3": [5.75, 10.89], "4": [7.78, 15.11], "5": [9.71, 19.04]} },
  { id: "drôme ardèche 2025", depts: ["07", "26"], since: "01/01/2026", until: "29/05/2026", small: null, meal: 11.82, zones: {"1A": [0.81, 1.86], "1B": [1.45, 3.16], "2": [2.92, 5.99], "3": [4.23, 9.64], "4": [5.76, 13.53], "5": [7.06, 17.26]} },
  { id: "drôme ardèche 2026", depts: ["07", "26"], since: "29/05/2026", until: null, small: null, meal: 12.0, zones: {"1A": [0.85, 1.9], "1B": [1.49, 3.2], "2": [2.96, 6.03], "3": [4.27, 9.68], "4": [5.8, 13.57], "5": [7.1, 17.3]} },
  { id: "rhône 2025", depts: ["69"], since: "01/01/2026", until: "06/03/2026", small: null, meal: 12.05, zones: {"1": [1.59, 4.43], "1A": [0.97, 3.65], "1B": [1.59, 4.43], "2": [2.93, 7.99], "3": [4.21, 12.11], "4": [5.49, 16.57], "5": [6.69, 20.78]} },
  { id: "rhône 2026", depts: ["69"], since: "06/03/2026", until: null, small: null, meal: 12.35, zones: {"1": [1.6, 4.45], "1A": [0.98, 3.67], "1B": [1.6, 4.45], "2": [2.94, 8.01], "3": [4.22, 12.13], "4": [5.5, 16.59], "5": [6.7, 20.8]} },
];

const PUBLIC_WORKS_SCALES: Scale[] = [
  { id: "île de france", depts: ["75", "77", "78", "91", "92", "93", "94", "95"], since: "17/04/2026", until: "01/01/2027", small: null, meal: 14, zones: {"1": [2.57, 2.32], "2": [3.77, 4.06], "3": [5.89, 6.4], "4": [7.09, 7.51], "5": [8.71, 8.95], "6": [10.0, 10.77]} },
  { id: "aquitaine", depts: ["24", "33", "40", "47", "64"], since: "17/04/2026", until: "01/01/2027", small: null, meal: 14.2, zones: {"1": [1.97, 2.86], "2": [3.71, 5.78], "3": [5.22, 9.66], "4": [6.92, 12.8], "5": [8.79, 16.65]} },
  { id: "limousin", depts: ["19", "23", "87"], since: "17/04/2026", until: "01/01/2027", small: null, meal: 14.2, zones: {"1A": [1.62, 0.86], "1B": [1.98, 1.88], "2": [3.51, 5.67], "3": [5.09, 9.52], "4": [6.55, 13.27], "5": [7.96, 17.07], "6": [8.65, 20.37]} },
  { id: "poitou charentes", depts: ["16", "17", "79", "86"], since: "17/04/2026", until: "01/01/2027", small: null, meal: 14.2, zones: {"1A": [1.71, 2.17], "1B": [2.07, 3.54], "2": [4.0, 6.98], "3": [6.26, 11.08], "4": [7.44, 15.66], "5": [9.42, 19.55]} },
  { id: "centre val de loire", depts: ["18", "28", "36", "37", "41", "45"], since: "20/03/2026", until: "01/01/2027", small: null, meal: 14.3, zones: {"1": [2.66, 3.76], "2": [4.31, 7.96], "3": [5.34, 11.65], "4": [6.69, 16.1], "5": [8.36, 20.62], "6": [10.1, null], "7": [12.03, null]} },
  { id: "bretagne", depts: ["22", "29", "35", "56"], since: "24/02/2026", until: "01/01/2027", small: null, meal: 14.5, zones: {"1": [2.35, 4.04], "2": [3.85, 6.93], "3": [5.35, 9.84], "4": [6.85, 12.58], "5": [8.35, 15.53]} },
  { id: "bourgogne", depts: ["21", "58", "71", "89"], since: "05/03/2026", until: "01/01/2027", small: null, meal: 13.5, zones: {"1": [1.89, 2.65], "2": [3.62, 5.31], "3": [5.21, 8.45], "4": [6.86, 10.6], "5": [8.53, 13.25]} },
  { id: "franche comté", depts: ["25", "39", "70", "90"], since: "05/03/2026", until: "01/01/2027", small: null, meal: 13.5, zones: {"1": [1.89, 2.67], "2": [3.62, 5.57], "3": [5.21, 9.7], "4": [6.86, 13.3], "5": [8.53, 16.33], "6": [11.33, 20.72]} },
  { id: "occitanie", depts: ["09", "11", "12", "30", "31", "32", "34", "46", "48", "65", "66", "81", "82"], since: "20/03/2026", until: "01/01/2027", small: null, meal: 14.1, zones: {"1": [2.2, 3.63], "2": [4.37, 7.25], "3": [5.72, 10.86], "4": [7.49, 14.49], "5": [9.45, 18.09]} },
  { id: "hauts de france", depts: ["02", "59", "60", "62", "80"], since: "20/03/2026", until: "01/01/2027", small: null, meal: 14.4, zones: {"1": [1.97, 2.79], "2": [3.71, 6.51], "3": [5.56, 9.61], "4": [7.39, 13.43], "5": [9.26, 17.3]} },
  { id: "pays de la loire", depts: ["44", "49", "53", "72", "85"], since: "04/09/2026", until: "01/01/2027", small: null, meal: 14.5, zones: {"1": [1.85, 3.23], "2": [3.44, 7.22], "3": [5.1, 12.08], "4": [6.79, 16.57], "5": [8.42, 21.2]} },
  { id: "alsace", depts: ["67", "68"], since: "20/03/2026", until: "01/01/2027", small: null, meal: 13.8, zones: {"1": [2.55, 3.15], "2": [4.3, 6.5], "3": [6.1, 9.85], "4": [7.85, 13.2], "5": [10.65, 15.22], "6": [11.6, 17.75]} },
  { id: "grand est hors alsace", depts: ["08", "10", "51", "52", "54", "55", "57", "88"], since: "20/03/2026", until: "01/01/2027", small: null, meal: 13.8, zones: {"1": [2.55, 3.15], "2": [4.3, 6.5], "3": [6.1, 9.85], "4": [7.85, 13.2], "5": [10.65, 15.22]} },
  { id: "normandie", depts: ["14", "27", "50", "61", "76"], since: "24/02/2026", until: "01/01/2027", small: null, meal: 14.5, zones: {"1": [2.37, 4.25], "2": [4.67, 8.52], "3": [6.78, 12.77], "4": [8.78, 17.05], "5": [10.85, 21.31]} },
];

async function engineOf(agreement: string, version: string) {
  const found = COMPILED_VERSIONS[agreement]!.find((v) => v.version === version);
  assert.ok(found, `${agreement} ${version}`);
  const rules: Record<string, Rule> = { ...modeleSocial, ...(await found.loadRules()) };
  return new Engine(rules, { logger: { log() {}, warn() {}, error() {} } });
}

const building = await engineOf("1597-batiment-ouvriers-plus-de-10", "2026.6");
const publicWorks = await engineOf("1702-travaux-publics-ouvriers", "2026.5");

type Situation = Record<string, string>;

function evaluate(engine: Engine, rule: string, situation: Situation) {
  engine.setSituation({
    "salarié . convention collective": "'BTP'",
    "salarié . contrat . salaire brut": "2500 €/mois",
    [`${BTP} . catégorie`]: "'ouvrier'",
    ...situation,
  });
  return engine.evaluate(rule).nodeValue;
}

const amount = (engine: Engine, rule: string, situation: Situation) =>
  Math.round((evaluate(engine, rule, situation) as number) * 100) / 100;

/** One day in a zone, or one meal, on a date in a département. */
const day = (dept: string, date: string, zone: string | null, extra: Situation = {}): Situation => ({
  date,
  [`${P} . département`]: `'${dept}'`,
  ...(zone === null ? { [`${P} . repas`]: "1 repas/mois" } : { [`${P} . jours zone ${zone}`]: "1 jour/mois" }),
  ...extra,
});

function dayBefore(date: string): string {
  const [d, m, y] = date.split("/").map(Number) as [number, number, number];
  const previous = new Date(Date.UTC(y, m - 1, d - 1));
  return [previous.getUTCDate(), previous.getUTCMonth() + 1, previous.getUTCFullYear()]
    .map((n, i) => String(n).padStart(i < 2 ? 2 : 4, "0"))
    .join("/");
}

function checkScales(engine: Engine, scales: Scale[]) {
  for (const scale of scales) {
    const size: Situation =
      scale.small === null ? {} : { "entreprise . salariés . effectif": scale.small ? "5 employé" : "50 employé" };
    it(`${scale.id}, from ${scale.since}${scale.until ? ` to ${scale.until}` : ""}`, () => {
      for (const dept of scale.depts) {
        for (const date of [scale.since, ...(scale.until ? [dayBefore(scale.until)] : [])]) {
          assert.equal(amount(engine, `${P} . indemnité de repas`, day(dept, date, null, size)), scale.meal, `${dept} ${date} repas`);
          for (const [zone, [trajet, transport]] of Object.entries(scale.zones)) {
            const at = day(dept, date, zone, size);
            assert.equal(amount(engine, `${P} . indemnité de trajet`, at), trajet ?? 0, `${dept} ${date} trajet ${zone}`);
            assert.equal(amount(engine, `${P} . indemnité de transport`, at), transport ?? 0, `${dept} ${date} transport ${zone}`);
            assert.equal(evaluate(engine, `${P} . saisie hors barème`, at), false, `${dept} ${date} ${zone}`);
          }
        }
      }
      // A zone the scale does not have is refused.
      for (const zone of ["1A", "1B", "1", "2", "3", "4", "5", "6", "7"].filter((z) => !(z in scale.zones))) {
        assert.equal(evaluate(engine, `${P} . saisie hors barème`, day(scale.depts[0]!, scale.since, zone, size)), true, zone);
      }
    });
  }
}

describe("building agreements — small travel scales (2026.6)", () => {
  checkScales(building, BUILDING_SCALES);

  it("covers every mainland département from 1 January 2026", () => {
    const depts = new Set(BUILDING_SCALES.flatMap((s) => s.depts));
    for (let n = 1; n <= 95; n++) {
      const dept = String(n).padStart(2, "0");
      assert.ok(depts.has(dept), dept);
      assert.equal(evaluate(building, `${P} . barème applicable`, day(dept, "01/01/2026", "2", { "entreprise . salariés . effectif": "50 employé" })), true, dept);
    }
  });

  it("has no scale before 2026, overseas, or without a département", () => {
    for (const situation of [day("75", "31/12/2025", "2"), day("974", "01/10/2026", "2"), { date: "01/10/2026", [`${P} . jours zone 2`]: "1 jour/mois" }]) {
      assert.equal(evaluate(building, `${P} . saisie hors barème`, situation), true);
      assert.equal(amount(building, `${P} . indemnité de trajet`, situation), 0);
    }
  });

  it("pays the workers only", () => {
    const etam = day("75", "01/10/2026", "2", { [`${BTP} . catégorie`]: "'etam'" });
    assert.equal(evaluate(building, `${P} . saisie hors barème`, etam), true);
    assert.equal(amount(building, `${P} . indemnité de transport`, etam), 0);
  });
});

describe("public works agreements — small travel scales (2026.5)", () => {
  checkScales(publicWorks, PUBLIC_WORKS_SCALES);

  it("has no scale for 2026 in Auvergne-Rhône-Alpes, PACA and Corse, nor after 2026", () => {
    for (const situation of [day("69", "01/10/2026", "1"), day("13", "01/10/2026", "1"), day("20", "01/10/2026", "1"), day("75", "01/01/2027", "1")]) {
      assert.equal(evaluate(publicWorks, `${P} . saisie hors barème`, situation), true);
    }
  });

  it("pays the ETAM the meal and transport allowances, without the travel time one", () => {
    const etam = (zone: string | null) => day("75", "01/10/2026", zone, { [`${BTP} . catégorie`]: "'etam'" });
    assert.equal(amount(publicWorks, `${P} . indemnité de repas`, etam(null)), 14);
    assert.equal(amount(publicWorks, `${P} . indemnité de transport`, etam("3")), 6.4);
    assert.equal(amount(publicWorks, `${P} . indemnité de trajet`, etam("3")), 0);
    const cadre = day("75", "01/10/2026", "3", { [`${BTP} . catégorie`]: "'cadre'" });
    assert.equal(evaluate(publicWorks, `${P} . saisie hors barème`, cadre), true);
  });
});

describe("small travel allowances — social treatment", () => {
  const month: Situation = {
    date: "01/10/2026",
    [`${P} . département`]: "'75'",
    [`${P} . jours zone 3`]: "10 jour/mois",
    [`${P} . repas`]: "10 repas/mois",
  };

  it("exempts the meal allowance up to 10,40 € and the transport allowance up to the zone's limit", () => {
    // Paris, building: 11,85 € a meal, 5,07 € of transport in zone 3 (A/R up to 60 km: 18,20 €).
    assert.equal(amount(building, `${P} . indemnité de repas . exonérée`, month), 104);
    assert.equal(amount(building, `${P} . indemnité de transport . exonérée`, month), 50.7);
  });

  it("adds the travel time allowance and the meal excess to the gross, and the exempt part to the net", () => {
    const gross = (s: Situation) => amount(building, "salarié . rémunération . brut", s);
    const base = { date: "01/10/2026", [`${P} . département`]: "'75'" };
    assert.equal(Math.round((gross(month) - gross(base)) * 100) / 100, 50.7 + 14.5);
    const exempt = (s: Situation) => amount(building, "salarié . rémunération . frais professionnels . déductible", s);
    assert.equal(Math.round((exempt(month) - exempt(base)) * 100) / 100, 50.7 + 104);
    assert.equal(amount(building, "salarié . rémunération . primes . activité . conventionnelles", month), 50.7);
  });
});
