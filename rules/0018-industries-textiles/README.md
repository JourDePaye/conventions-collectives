# Industries textiles — IDCC 18

Le fichier [2026.1](0018-industries-textiles.2026.1.publicodes) entre en vigueur le 1er juin 2026. Il est fondé sur l’accord national du 17 juin 2026 relatif aux salaires minima, étendu par arrêté du 24 août 2026 (JORF n° 0206 du 4 septembre 2026, texte n° 45, NOR TRST2621209A), cités dans ses métadonnées. La valeur Publicodes est `industries textiles` ; les règles sont sous `salarié . convention collective . industries textiles`.

La convention collective nationale de l’industrie textile du 1er février 1951 (brochure 3106) ne doit pas être confondue avec la convention [1483](../1483-commerce-detail-habillement-textiles/README.md), celle du commerce de détail de l’habillement et des articles textiles.

## Règles implémentées

- `niveau` reçoit le niveau et l’échelon : `1`, `2.1`, `2.2`, `2.3`, `3.1` à `3.3`, `4.1` à `4.3`, `5.1` à `5.3`, `6.1` à `6.3`, `I.1`, `I.2`, `II`, `III`, `IV` (défaut : `non renseigné`).
- `salaire minimum conventionnel . grille` donne le salaire mensuel minimum des 21 positions, de 1 898 € (niveau 1) à 5 029 € (position IV).
- `salaire minimum conventionnel` multiplie la grille par `salarié . contrat . temps de travail . quotité` de `modele-social`. Le montant ne doit donc pas être proratisé une seconde fois. Par exemple, le niveau 4, échelon 2 vaut 1 996 €/mois à temps complet et 998 €/mois à mi-temps.
- `niveau hors grille` signale un niveau absent des 21 positions. La grille retourne alors `0 €/mois` et l’application doit traiter l’anomalie.

Tous les montants de la grille dépassent le SMIC mensuel de 1 867,02 € en vigueur depuis juin 2026.

## Limites

- Le texte de l’accord n’a pas pu être lu : les 21 montants viennent de deux pages de synthèse concordantes (juristique.org et salaire-minimum.com), les références de l’arrêté de Légifrance. À recouper avec l’accord.
- Ces pages indiquent une base de 152,25 heures par mois pour 35 heures par semaine, et non 151,67 : le minimum est proratisé par la quotité de `modele-social`, sans changement de base horaire.
- Les pages ne précisent pas à quelles catégories s’appliquent les niveaux 1 à 6 et les positions I à IV : la règle ne distingue pas les statuts.
- L’accord s’applique à compter du 1er juin 2026 aux employeurs adhérents à la fédération signataire ; pour les autres, l’arrêté ne le rend applicable qu’à compter de sa publication (4 septembre 2026). Cette distinction n’est pas modélisée.
- L’accord du 15 janvier 2026 relatif aux salaires, antérieur, et les grilles précédentes ne sont pas modélisés : la première version couvre les périodes à partir du 1er juin 2026.
- Les primes, majorations, la prévoyance et les autres éléments de la convention ne sont pas modélisés.
