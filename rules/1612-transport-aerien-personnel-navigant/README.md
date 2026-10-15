# Travail aérien, personnel navigant des essais et réceptions — IDCC 1612

La convention collective nationale du travail aérien du 21 janvier 1991 couvre le personnel navigant des essais et réceptions (pilotes d'essais, ingénieurs et mécaniciens navigants d'essais). Conteneur Légifrance `KALICONT000005635916`.

## Versions

- `2024.1` : **modèle erroné, remplacé.** Il décrivait le personnel navigant technique des exploitants d'hélicoptères, une autre convention (IDCC 1944), avec une grille FTR1-1 à FTR8-3 dont la source citée n'existe pas sur Légifrance et dont les montants ne correspondent à aucun texte publié. Cette version publiée reste dans le package, car une version publiée ne se modifie pas, mais la révision `2024.2` la remplace dès la même date.
- `2024.2` : reconstruction complète sur l'**avenant n° 8 du 7 mai 2024** (BO 2024-27, Légifrance `KALITEXT000050130287`), signé par le GIFAS, **en vigueur non étendu** depuis le 4 juillet 2024. Son annexe 1 fixe les planchers de traitement fixe mensuel, en valeurs au **1er janvier 2024** : la version prend effet à cette date.

La valeur publicodes `personnel navigant technique hélicoptères` est historique : elle est conservée pour que les versions publiées restent calculables avec la même valeur de convention. Les règles sont sous `salarié . convention collective . personnel navigant technique hélicoptères`.

## Règles implémentées (2024.2)

- `classification` reçoit la classification suivie de l'échelon, par exemple `PEX 1` ou `ENE-B 3`.
- `minimum mensuel de la grille` expose les 25 planchers de l'annexe 1 (en euros par mois) :

| Classification | 1er | 2e | 3e | 4e | 5e |
|---|---:|---:|---:|---:|---:|
| `PEX` : pilotes d'essais expérimentaux (FTR1 ou PEX) | 5 757 | 6 334 | 7 199 | 8 060 | 8 633 |
| `INE-A` : LFTE-1 ou INE-A | 5 388 | 6 194 | 7 004 | 7 810 | 8 344 |
| `ENA-A` : LFTE-1 – MNE ou ENA-A | 3 648 | 4 196 | 4 742 | 5 300 | 5 648 |
| `PE` : FTR2 ou PE | 4 612 | 5 076 | 5 717 | 6 454 | 6 914 |
| `ENE-B` : LFTE-2 ou MNR ou ENE-B | 3 603 | 4 143 | 4 683 | 5 221 | 5 582 |

- L'échelon dépend de l'ancienneté dans la fonction : 1er échelon dès la 1re année, 2e dès la 3e année, 3e dès la 5e année, 4e dès la 10e année, 5e dès la 15e année pour les pilotes et dès la 17e année pour les autres spécialités. Le modèle reçoit l'échelon, il ne le calcule pas.
- `salaire minimum conventionnel` proratise le plancher selon la quotité de travail. L'article 19 définit le traitement fixe comme un forfait indépendant de l'horaire et ne prévoit rien pour le temps partiel : la proratisation est un choix du modèle.
- `classification hors grille` est vraie pour une classification ou un échelon absent de l'annexe, y compris les codes FTR de la version 2024.1.

## Limites

- **Champ** : l'avenant n° 8 n'est pas étendu ; il s'applique aux entreprises adhérentes du GIFAS.
- **Revalorisation** : l'article 19 indexe les minima sur l'évolution moyenne des minima hiérarchiques des cadres de la convention de la métallurgie, avec un coefficient fixé chaque année par la commission paritaire. Les coefficients de 2025 et 2026 ne sont pas publiés sur Légifrance : la grille reste celle du 1er janvier 2024.
- **Primes de vol** : les annexes sur les primes de vol en avion et en hélicoptère ne sont pas modélisées, pas plus que les cotisations, la santé, la prévoyance, la formation et l'AT/MP.

## Sources officielles

- Avenant n° 8 du 7 mai 2024, Légifrance `KALITEXT000050130287` ; article 19 et annexe 1, `KALIARTI000050130292`.
- Convention collective nationale du travail aérien du 21 janvier 1991 (personnel navigant des essais et réceptions), IDCC 1612, `KALICONT000005635916`.
