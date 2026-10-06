# Plasturgie — IDCC 292

Le fichier [2026.1](0292-plasturgie.2026.1.publicodes) entre en vigueur le 1er mars 2026. Il est fondé sur l’accord du 19 février 2026 relatif aux salaires (article 3-1), étendu par arrêté du 23 septembre 2026 (JORF n° 0231 du 3 octobre 2026, texte n° 83, NOR TRST2612629A), cités dans ses métadonnées. La valeur Publicodes est `plasturgie` ; les règles sont sous `salarié . convention collective . plasturgie`.

La convention collective nationale de la plasturgie du 1er juillet 1960 (brochure 3066) classe les salariés par coefficient, de 700 à 940.

## Règles implémentées

- `coefficient` reçoit le coefficient hiérarchique : 700, 710, 720, 730, 740, 750, 800, 810, 820, 830, 900, 910, 920, 930 ou 940 (défaut : 0).
- `salaire minimum conventionnel . grille` donne le salaire mensuel minimum des 15 coefficients, pour 35 heures par semaine (151,67 heures), de 1 835 € (700) à 6 543 € (940).
- `salaire minimum conventionnel` multiplie la grille par `salarié . contrat . temps de travail . quotité` de `modele-social`. Le montant ne doit donc pas être proratisé une seconde fois. Par exemple, le coefficient 800 vaut 2 266 €/mois à temps complet et 1 133 €/mois à mi-temps.
- `coefficient hors grille` signale un coefficient absent des 15 positions. La grille retourne alors `0 €/mois` et l’application doit traiter l’anomalie.

Les coefficients 700 et 710 (1 835 € et 1 848 €) sont inférieurs au SMIC mensuel de 1 867,02 € en vigueur depuis juin 2026 : l’arrêté d’extension étend l’article 3-1 sous réserve de l’application des dispositions réglementaires sur le SMIC, et l’application doit retenir le plus élevé des deux montants.

## Limites

- Le texte de l’accord n’a pas pu être lu : les PDF consultés n’étaient pas exploitables. Les 15 montants viennent de deux pages de synthèse concordantes (juristique.org et travail-industrie.com), les références de l’arrêté de Légifrance. À recouper avec l’accord.
- L’accord s’applique à compter du 1er mars 2026 aux employeurs adhérents à la fédération signataire ; pour les autres, l’arrêté ne le rend applicable qu’à compter de sa publication (3 octobre 2026). Cette distinction n’est pas modélisée.
- Les exclusions du minimum (heures supplémentaires, primes d’ancienneté, treizième mois, primes de poste et de danger, primes exceptionnelles, remboursements de frais) sont celles que décrit une page de synthèse, non vérifiées sur le texte.
- Les primes, majorations, la prévoyance et les autres éléments de la convention ne sont pas modélisés.
- Les grilles antérieures au 1er mars 2026 ne sont pas modélisées : la première version couvre les périodes à partir de cette date.
