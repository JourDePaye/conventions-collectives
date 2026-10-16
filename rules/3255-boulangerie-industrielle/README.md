# Activités industrielles de boulangerie et pâtisserie et professionnels de l'œuf — IDCC 3255

Modèle `3255-boulangerie-industrielle`, versions `2025.1` et `2026.1`, espace de noms
`salarié . convention collective . boulangerie industrielle`.

La convention collective nationale du 1er octobre 2024 (conteneur `KALICONT000051160618`) est
issue de la fusion des conventions des activités industrielles de boulangerie et pâtisserie
(IDCC 1747) et des centres de conditionnement et de transformation des œufs (IDCC 2075). Elle
a été étendue par arrêté du 20 novembre 2025 (JORF du 27 novembre 2025) et s'applique depuis le
**1er décembre 2025**, en se substituant aux dispositions conventionnelles antérieures. Ce modèle
remplace le modèle `1747-boulangerie-industrielle`.

## Versions

| Version | Date d'effet | Source | Contenu |
|---|---|---|---|
| `2025.1` | 1er décembre 2025 | Article 21 de la convention (montants de l'avenant du 16 janvier 2025, étendu par arrêté du 9 avril 2025) | Grille de transposition A1 à M (33 positions), grille sectorielle boulangerie-pâtisserie OE1 à CA5 (17 positions), grille sectorielle des œufs I-1 à IX-3 (27 positions) |
| `2026.1` | 1er mars 2026 | Avenant n° 4 du 22 janvier 2026 (étendu par arrêté du 2 avril 2026, JORF du 17 avril 2026) | Grille A1 à M (33 positions), de 1 826,03 € (A1) à 5 222,43 € (M) |

Les grilles sectorielles (boulangerie-pâtisserie et œufs) étaient transitoires, pour les entreprises
n'ayant pas encore transposé la nouvelle classification, au plus tard le 1er janvier 2026. L'avenant
n° 4 ne publie plus que la grille de la nouvelle classification : leurs clés sont donc
`niveau hors grille` à partir de la version `2026.1`.

## Clés de classification (`niveau`)

- Grille de transposition (versions `2025.1` et `2026.1`) : `A1`, `A2`, `B1`, `B2`, `C1` à `C3`, `D1` à `D3`,
  `E1` à `E3` (ouvriers/employés), `F1` à `F3`, `G1` à `G3`, `H1` à `H3`, `I` (TAM), `J1` à `J3`, `K1` à `K3`,
  `L1` à `L3` et `M` (cadres). Les niveaux `I` et `M` n'ont pas d'échelon.
- Grille sectorielle boulangerie-pâtisserie (`2025.1` seulement) : `OE1` à `OE7`, `TAM1` à `TAM5`, `CA1` à `CA5`.
- Grille sectorielle des œufs (`2025.1` seulement) : `I-1` à `I-3`, `II-1` à `II-3`, jusqu'à `IX-1` à `IX-3`.

## Règles implémentées

- `salaire minimum conventionnel` (€/mois) : minimum brut mensuel pour 151,67 heures, proratisé une seule fois par `contrat . temps de travail . quotité`.
- `niveau hors grille` : vrai si le niveau est absent de la grille de la version ; le minimum vaut alors 0 €/mois.

## Sources officielles

- [Convention collective du 1er octobre 2024 (texte de base)](https://www.legifrance.gouv.fr/conv_coll/id/KALITEXT000051150351)
- [Avenant n° 4 du 22 janvier 2026, article 21](https://www.legifrance.gouv.fr/conv_coll/id/KALITEXT000054162284)
- [Avenant du 16 janvier 2025 à l'accord du 13 février 2024](https://www.legifrance.gouv.fr/conv_coll/id/KALITEXT000051537768)

## Limites

- Le salaire annuel sur 13 mois de la grille sectorielle des œufs n'est pas modélisé ; le texte du
  tableau source contient d'ailleurs une valeur annuelle manifestement erronée pour V-1 (27 428,05 €).
- La régularisation de fin d'année 2025 du salaire annuel minimal des œufs, la prime de 13e mois, la prime
  d'ancienneté et les autres dispositions de la convention ne sont pas modélisées.
- Le passage automatique de A1 à A2 au plus tard au 6e mois de présence (article 12.5.3) n'est pas calculé :
  le niveau est fourni par l'application.
- Le choix de la grille (transposée ou sectorielle) et de la version selon la période de paie reste à la charge de l'application consommatrice.
