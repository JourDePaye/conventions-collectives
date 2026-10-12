# Hôtellerie de plein air — IDCC 1631

La version `2024.1` modélise l'avenant n° 44 du **19 juin 2024** relatif aux salaires minima conventionnels, applicable au **1er novembre 2024** et étendu. La valeur Publicodes est `hôtellerie de plein air`.

## Grille implémentée

| Coefficient | Minimum mensuel brut |
|---:|---:|
| 285 | 2 112,73 € |
| 300 | 2 203,92 € |
| 325 | 2 595,82 € |
| 349 | 2 773,96 € |
| 420 | 3 581,52 € |

Le minimum est proratisé une seule fois selon `salarié . contrat . temps de travail . quotité`. Les coefficients non présents dans cette table bornée sont signalés par un résultat nul et ne sont pas présentés comme un minimum conventionnel validé. Une nouvelle grille complète devra faire l'objet d'une nouvelle version immuable.

## Audit explicite du référentiel de paie

L'avenant n° 44 modifie les salaires minima conventionnels. Dans le périmètre de ce texte salarial, aucune modification sourcée n'a été retenue pour l'assiette générale, les taux ou plafonds de cotisations, les tranches, forfaits, exonérations, avantages en nature, prévoyance, santé, formation professionnelle ou accident du travail. Aucun endpoint payroll-wide n'est redéfini sous ce namespace : le test dédié vérifie l'absence de collision avec `modele-social` et l'isolation hors convention.

Les primes, indemnités, ancienneté, classifications non reprises dans cette première table bornée, temps de travail et modalités de comparaison ne sont pas calculés ici.

## Sources officielles

- Avenant n° 44 du 19 juin 2024 relatif aux salaires minima, texte Légifrance `KALIARTI000051149881` / `KALITEXT000051149881`.
- Convention collective nationale de l'hôtellerie de plein air, IDCC 1631, conteneur KALI `KALICONT000005635029`.
- Le texte est indiqué comme étendu dans les métadonnées officielles Légifrance.
