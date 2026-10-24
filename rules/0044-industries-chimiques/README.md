# Industries chimiques — IDCC 44

Trois fichiers se succèdent selon la date de la paie (la version retenue est celle de la plus récente date d'effet antérieure ou égale, puis la révision la plus haute) :

| Fichier | À compter du | Barème | Santé |
|---|---|---|---|
| [2025.1](0044-industries-chimiques.2025.1.publicodes) | 1er janvier 2025 | accord du 9 décembre 2024 (130 : 1 855,01 € ; 880 : 7 675,85 €) | non |
| [2026.3](0044-industries-chimiques.2026.3.publicodes) | 1er septembre 2025 | accord du 9 décembre 2024 | avenant n° 4 du 2 septembre 2025 |
| [2026.4](0044-industries-chimiques.2026.4.publicodes) | 1er janvier 2026 | accord du 3 décembre 2025 (130 : 1 877,13 € ; 880 : 7 764,57 €) | avenant n° 4 du 2 septembre 2025 |

Les fichiers `2026.1` (barème 2026 sans règles santé) et `2026.2` (barème 2026 daté à tort du 1er septembre 2025) sont conservés pour les paies déjà calculées mais sont remplacés par `2026.4` et `2026.3` pour les mêmes dates d'effet. Les règles et les clés (`coefficient`, `santé 2025`) sont identiques dans les cinq révisions.

L'avenant n° 4 du 2 septembre 2025 (étendu par arrêté du 9 décembre 2025, JORF du 26 décembre 2025, KALITEXT000053041327) fixe le minimum de frais de santé ; les accords salariaux sont KALITEXT000051294779 (étendu par arrêté du 25 février 2025, JORF du 18 mars 2025) et KALITEXT000053721357 (étendu par arrêté du 16 février 2026, JORF du 24 février 2026).

La valeur Publicodes est `industries chimiques` ; les règles sont sous `salarié . convention collective . industries chimiques`.

La convention collective nationale des industries chimiques et connexes du 30 décembre 1952 (brochure 3108) calcule ses minima à partir de deux paramètres, le salaire de référence (1 848,69 €) et la valeur de référence par point (8,84 €), revalorisés de 1,6 % en 2025 puis de 1,2 % en 2026 (1 826,77 € et 8,74 € en 2025). Le minimum d’un coefficient K est : (salaire de référence + (K − 100) × valeur de référence) × coefficient de calcul.

## Règles implémentées

- `coefficient` reçoit le coefficient hiérarchique : 130, 140, 150, 160, 175, 190, 205, 225, 235, 250, 275, 300, 325, 350, 360, 400, 460, 480, 510, 550, 660, 770 ou 880 (défaut : 0).
- `salaire minimum conventionnel . grille` donne le salaire mensuel minimum des 23 coefficients, pour 35 heures par semaine (151,67 heures), de 1 855,01 € (130) à 7 675,85 € (880) en 2025 et de 1 877,13 € (130) à 7 764,57 € (880) à compter du 1er janvier 2026.
- `salaire minimum conventionnel` multiplie la grille par `salarié . contrat . temps de travail . quotité` de `modele-social`. Le montant ne doit donc pas être proratisé une seconde fois. Par exemple, le coefficient 250 vaut 2 244,51 €/mois à temps complet et 1 122,255 €/mois à mi-temps.
- `coefficient hors grille` signale un coefficient absent des 23 positions. La grille retourne alors `0 €/mois` et l’application doit traiter l’anomalie.

Tous les montants de la grille dépassent le SMIC mensuel de 1 867,02 € en vigueur depuis juin 2026.

## Audit paie — 12 octobre 2026

L'avenant n° 4 fixe un minimum de frais de santé de **1,50 % du PMSS** en régime général et **0,82 % en Alsace-Moselle**, avec au moins 50 % à la charge de l'employeur. `santé 2025 . montant contractuel` est prérempli avec ce minimum et peut recevoir le montant total réel du contrat ; zéro est réservé à une dispense validée. Les endpoints standards de santé de `modele-social` sont ainsi alimentés par le montant contractuel de la branche.

L'audit des autres rubriques ne justifie pas d'automatisation supplémentaire sous le namespace IDCC 44 : l'assiette générale, les plafonds et tranches, les forfaits, les taux AT/MP, les exonérations, la formation professionnelle et la prévoyance hors santé restent ceux de `modele-social` ou nécessitent des paramètres de contrat, de catégorie ou d'entreprise non déterminés par l'IDCC seul. Aucun avantage en nature ou exemption générale calculable n'est ajouté.

Sources officielles examinées : [avenant santé](https://www.legifrance.gouv.fr/conv_coll/id/KALITEXT000053041327/?idConteneur=KALICONT000005635613), [arrêté d'extension](https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000053167638), [accord salaires](https://www.legifrance.gouv.fr/conv_coll/id/KALITEXT000053721357), ainsi que les textes IDCC 44 relatifs à la formation professionnelle et à la prévoyance listés dans la convention.


- Les 23 montants de chaque barème ont été lus dans le texte des accords sur Légifrance et recoupés avec la formule ci-dessus (2025 : salaire de référence 1 826,77 € et valeur de référence 8,74 € ; 2026 : 1 848,69 € et 8,84 €).
- Le barème vaut pour 35 heures par semaine. Les barèmes pour d’autres durées du travail, en particulier celui des 38 heures évoqué par les pages consultées, ne sont pas modélisés.
- La prime d’ancienneté (3 % après 3 ans, puis 3 % tous les 3 ans jusqu’à 15 %), les primes de poste et les autres éléments de la convention ne sont pas modélisés. Le minimum retenu est le barème, hors prime d’ancienneté.
- Les grilles antérieures au 1er janvier 2025 ne sont pas modélisées : la première version couvre les périodes à partir de cette date.

## Maintien de salaire

La révision 2026.5 ajoute le maintien de salaire conventionnel (avenants n° 1 (article 23), n° 2 (article 7) et n° 3 (article 7)) sous `maintien de salaire`, lu sur Légifrance le 24 octobre 2026 : les durées, taux, carences et modalités sont dans les sources de la version et dans `test/salary-maintenance.test.ts`. L’interface est décrite dans le README du package. La catégorie se déduit du coefficient (groupe IV de l’accord du 10 août 1978 : coefficients 225 à 360, sauf 350, cadres) ; les emplois de maîtrise « à astérisque » (3 mois à plein tarif) ne sont pas repris ; l’article 23 de l’avenant n° 1 est pris dans sa rédaction étendue.
