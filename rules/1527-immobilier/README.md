# Immobilier — IDCC 1527

Modèle `1527-immobilier`, versions `2026.1` et `2026.2`, espace de noms
`salarié . convention collective . immobilier`.

## Périmètre

Convention collective nationale de l'immobilier, administrateurs de biens, sociétés
immobilières, agents immobiliers (9 septembre 1988). Les deux versions portent la grille de
l'avenant n° 111 du 24 juin 2026, applicable au **1er juin 2026** (étendu par arrêté du
7 septembre 2026, JORF du 19 septembre 2026).

La version `2026.2` remplace `2026.1` pour la même date d'effet : elle corrige la prime
d'ancienneté, proratise le minimum par la quotité de travail et ajoute `niveau hors grille`.

## Grille (annuel sur 13 mois, hors prime d'ancienneté)

| Niveau | Annuel | Mensuel (annuel / 13) |
|---|---:|---:|
| E1 | 24 272 € | 1 867,08 € |
| E2 | 24 428 € | 1 879,08 € |
| E3 | 25 080 € | 1 929,23 € |
| AM1 | 25 569 € | 1 966,85 € |
| AM2 | 26 415 € | 2 031,92 € |
| C1 | 28 333 € | 2 179,46 € |
| C2 | 36 932 € | 2 840,92 € |
| C3 | 44 221 € | 3 401,62 € |
| C4 | 49 800 € | 3 830,77 € |

`niveau` vaut `'E1'`, `'E2'`, `'E3'`, `'AM1'`, `'AM2'`, `'C1'`, `'C2'`, `'C3'` ou `'C4'`. Un niveau
absent ou `'non renseigné'` active `niveau hors grille` et donne un minimum nul.

## Prime d'ancienneté (article 36)

Majoration de 32 € par mois pour chaque période de **3 ans révolue** (4 ans : 32 € ; 6 ans : 64 €),
due à partir du 1er janvier suivant la date d'anniversaire. Le modèle compte les périodes entières à
partir de `années complètes d'ancienneté` ; l'application doit fournir une ancienneté arrêtée en tenant
compte du décalage au 1er janvier. Le texte ne prévoit pas de proratisation pour le temps partiel :
elle n'est pas appliquée. Le statut de négociateur (annexe IV) a sa propre prime et n'est pas modélisé.

## Sources officielles

- [Avenant n° 111 du 24 juin 2026](https://www.legifrance.gouv.fr/conv_coll/id/KALITEXT000054951900)
- [Arrêté d'extension](https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000054860891)
- [Article 36 — ancienneté](https://www.legifrance.gouv.fr/conv_coll/article/KALIARTI000049954870)

## Maintien de salaire

La révision 2026.3 ajoute le maintien de salaire conventionnel (article 24.2) sous `maintien de salaire`, lu sur Légifrance le 24 octobre 2026 : les durées, taux, carences et modalités sont dans les sources de la version et dans `test/salary-maintenance-2.test.ts`. L’interface est décrite dans le README du package.
