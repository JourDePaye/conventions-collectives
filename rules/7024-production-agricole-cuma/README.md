# Production agricole et CUMA — IDCC 7024

Le fichier [2025.1](7024-production-agricole-cuma.2025.1.publicodes) reprend l'avenant n° 9 du 12 mars 2025, étendu par arrêté du 4 juin 2025 publié au Journal officiel du 11 juin 2025. La grille est applicable au 1er juillet 2025.

La révision [2025.2](7024-production-agricole-cuma.2025.2.publicodes), même date d'effet, corrige `coefficient hors grille` : en 2025.1, la règle exigeait un coefficient à la fois inférieur à 9 et supérieur à 400, et n'était donc jamais vraie. En 2025.2, seul un coefficient inférieur à 9 est hors grille, le palier 12 couvrant 400 points et plus. La révision [2025.3](7024-production-agricole-cuma.2025.3.publicodes) a les mêmes règles et source les bornes des paliers sur le texte officiel de l'article 4.5 (Légifrance, `KALIARTI000042949918`) : palier 1 de 9 à 11, palier 12 à partir de 400 sans borne supérieure.

La version [2026.1](7024-production-agricole-cuma.2026.1.publicodes) reprend l'avenant n° 10 du 20 janvier 2026 (Légifrance `KALITEXT000054162294`), étendu par arrêté du 1er avril 2026 publié au Journal officiel du 4 avril 2026 : elle est applicable au **1er mai 2026**, premier jour du mois civil suivant la parution de l'arrêté. Les règles sont celles de 2025.3 et les taux horaires passent de 11,88 € - 23,88 € à 12,02 € - 24,16 €. L'avenant n° 11 du 2 juillet 2026, qui prévoit une nouvelle grille, n'était ni étendu ni publié sur Légifrance à la date de cette version : il n'est pas modélisé.

## Règles implémentées

- `coefficient` couvre les paliers 1 (coefficients 9 à 11) à 12 (400 points et plus) ;
- `salaire minimum conventionnel` expose les minima horaires bruts de 2025.1 à 2025.3 (11,88 €, 11,97 €, 12,14 €, 12,40 €, 12,93 €, 13,54 €, 14,33 €, 15,32 €, 16,58 €, 18,36 €, 20,90 € et 23,88 €) et ceux de 2026.1 (12,02 €, 12,11 €, 12,28 €, 12,55 €, 13,08 €, 13,70 €, 14,50 €, 15,50 €, 16,78 €, 18,58 €, 21,15 € et 24,16 €) ;
- `coefficient hors grille` signale un coefficient inférieur à 9 (à partir de 2025.2).

La source fixe un minimum horaire. Aucune conversion automatique en minimum mensuel ou annuel n'est effectuée : la durée réellement rémunérée et les règles de paie agricoles doivent rester fournies par le calcul appelant.

## Audit paie et limites

L'avenant salarial, le conteneur officiel IDCC 7024, les accords de protection sociale et de formation professionnelle ainsi que leurs éventuels arrêtés d'extension ont été recherchés pour les changements de cotisations salarié et employeur, assiettes, taux, plafonds, tranches, forfaits, santé, prévoyance, retraite complémentaire, formation professionnelle, AT/MP, primes, indemnités, frais et avantages en nature. Aucun taux ou assiette conventionnel générique supplémentaire, applicable à toute la branche et calculable avec les seules entrées de ce modèle, n'a été retenu. Les cotisations légales, la santé, la prévoyance, la retraite, la formation, l'AT/MP et les contributions conventionnelles éventuelles restent externes et ne sont pas remplacées par zéro.

Les primes d'ancienneté, primes et indemnités liées aux travaux agricoles, déplacements, repas, astreintes, heures supplémentaires, congés, avantages en nature et frais dépendent de la situation et des accords territoriaux ou filières ; ils ne sont pas extrapolés. Les accords régionaux ou départementaux et les filières agricoles ayant des garanties plus favorables nécessitent une entrée de périmètre distincte.

## Sources officielles

- Avenant n° 10 du 20 janvier 2026 relatif aux salaires, Légifrance, texte `KALITEXT000054162294`, étendu par arrêté du 1er avril 2026 (JORF du 4 avril 2026, `JORFTEXT000053762935`).
- Avenant n° 9 du 12 mars 2025 relatif aux salaires minima, Légifrance, texte `KALITEXT000051787305`.
- Arrêté du 4 juin 2025 portant extension, publié au Journal officiel du 11 juin 2025.
- Conteneur officiel de la convention, Légifrance, IDCC 7024.
- Recherche des textes officiels dédiés aux cotisations salarié/employeur, assiettes, plafonds, tranches, forfaits, santé, prévoyance, retraite, formation, AT/MP, primes, avantages et frais : aucune règle calculable additionnelle retenue.