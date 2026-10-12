# Jardineries et graineteries — IDCC 1760

Le fichier [2026.1](1760-jardineries-graineteries.2026.1.publicodes) entre en vigueur le 1er juillet 2026 pour les entreprises non adhérentes à l'organisation patronale signataire, premier jour du mois suivant l'extension de l'accord du 2 avril 2026 par l'arrêté du 11 juin 2026 publié au Journal officiel du 27 juin 2026. L'accord était applicable aux entreprises adhérentes à l'organisation patronale signataire à compter du 1er mai 2026. La valeur Publicodes est `jardineries graineteries` ; les règles sont sous `salarié . convention collective . jardineries graineteries`.

La convention collective nationale des jardineries et graineteries du 3 décembre 1993 (brochure 3272) couvre les entreprises relevant de l'IDCC 1760.

## Règles implémentées

- `classification` reçoit la combinaison niveau-échelon de l'accord du 2 avril 2026, sous la forme `1.1` à `8.2`.
- `grille` donne le salaire minimum mensuel à temps plein pour 151,67 heures : 1 823 € à 3 900 € selon les 18 combinaisons des niveaux 1 à 8.
- `salaire minimum conventionnel` multiplie la grille par `salarié . contrat . temps de travail . quotité` de `modele-social`.
- `classification hors grille` signale une combinaison absente de la grille. La grille retourne alors `0 €/mois` et l'application doit traiter l'anomalie.

## Limites

- Cette version modélise uniquement la grille des salaires minima de l'accord du 2 avril 2026 à compter du 1er juillet 2026 pour les entreprises non adhérentes à l'organisation patronale signataire ; les grilles antérieures ne sont pas incluses.
- Les primes, majorations, indemnités, classifications détaillées et autres obligations conventionnelles ne sont pas modélisés.
- La version est étendue à l'ensemble du champ de la convention à compter du 1er juillet 2026 ; l'effet au 1er mai 2026 pour les entreprises adhérentes à l'organisation patronale signataire n'est pas exposé comme une version distincte.

## Sources officielles

- [Accord du 2 avril 2026 relatif aux salaires minima — Légifrance](https://www.legifrance.gouv.fr/conv_coll/id/KALITEXT000054801832)
- [Arrêté du 11 juin 2026 portant extension — Journal officiel](https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000054322267)
