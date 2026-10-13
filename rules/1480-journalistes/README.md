# Journalistes — IDCC 1480

Le fichier [2025.1](1480-journalistes.2025.1.publicodes) entre en vigueur le **1er septembre 2025** pour les entreprises signataires et à compter du **19 septembre 2025** pour les autres entreprises, conformément à l'avenant n° 4 du 4 juillet 2025 et à son extension publiée au Journal officiel le 19 septembre 2025. La valeur Publicodes est `journalistes` ; les règles sont sous `salarié . convention collective . journalistes`.

## Grille salariale implémentée

| Groupe | Minimum mensuel brut |
|---:|---:|
| 1 | 1 905,12 € |
| 2 | 2 105,71 € |
| 3 | 2 299,90 € |
| 4 | 2 506,54 € |
| 5 | 2 752,38 € |
| 6 | 3 010,45 € |
| 7 | 3 252,50 € |
| 8 | 3 612,64 € |

Le minimum est proratisé une seule fois par la quotité de travail. Un groupe absent de la grille est signalé par `groupe hors grille` et retourne zéro afin que l'appelant puisse traiter l'anomalie.

## Audit explicite du référentiel de paie

L'avenant n° 4 porte sur les salaires minima des journalistes permanents d'agences de presse et sur des barèmes de piges. Les sources officielles inspectées pour cette livraison ne fournissent pas de modification générique et calculable de l'assiette générale, des taux ou plafonds de cotisations, des tranches, forfaits, exonérations, avantages en nature, prévoyance, santé, formation professionnelle ou AT/MP. Aucun endpoint payroll-wide n'est donc redéfini sous ce namespace ; le test dédié vérifie l'absence de collision avec `modele-social` et l'isolation hors convention.

Les primes, indemnités, treizième mois, droits d'auteur, piges, intéressement, épargne salariale et dispositions de temps de travail ne sont pas calculés ici : ils nécessitent des entrées et des règles dédiées et restent explicitement hors périmètre plutôt que d'être assimilés au salaire minimum.

## Sources officielles

- Avenant n° 4 du 4 juillet 2025 à l'accord du 3 juillet 2019, Légifrance, KALIARTI000052299406.
- Arrêté du 12 septembre 2025 portant extension de l'avenant, Journal officiel, NOR TSST2525479A, JORFTEXT000052260481.
- Convention collective nationale des journalistes du 1er novembre 1976, IDCC 1480, Légifrance.
