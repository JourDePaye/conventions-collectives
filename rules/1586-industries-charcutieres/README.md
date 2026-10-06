# Industries charcutières — IDCC 1586

Le fichier [2026.1](1586-industries-charcutieres.2026.1.publicodes) entre en vigueur le 1er février 2026. Il est fondé sur l’accord du 16 janvier 2026 relatif aux salaires minimaux conventionnels à compter du 1er février 2026, étendu par arrêté du 14 avril 2026 (JORF n° 0091 du 17 avril 2026, texte n° 88, NOR TRST2609134A), cités dans ses métadonnées. La valeur Publicodes est `industries charcutières` ; les règles sont sous `salarié . convention collective . industries charcutières`.

La convention collective nationale des industries charcutières (industrie de la salaison, charcuterie en gros et conserves de viandes) du 29 mars 1972 (brochure 3125) a absorbé la convention de la boyauderie (IDCC 1543) par arrêté du 23 janvier 2019. Elle ne doit pas être confondue avec la convention [1534](../1534-industrie-commerces-gros-viandes/README.md), celle de l’industrie et des commerces en gros des viandes.

## Règles implémentées

- `coefficient` reçoit le coefficient hiérarchique (défaut : `0`) :
  - de 125 à 345 par pas de 5, pour les niveaux I à VII (ouvriers et employés, puis techniciens et agents de maîtrise) ;
  - 350, 400, 600 et 700 pour les niveaux VIII à X (cadres).
- `salaire minimum conventionnel . grille` donne le salaire minimum mensuel garanti des 49 coefficients, pour 35 heures par semaine, de 1 835,60 € (coefficient 125) à 5 763,40 € (coefficient 700).
- `salaire minimum conventionnel` multiplie la grille par `salarié . contrat . temps de travail . quotité` de `modele-social`. Le montant ne doit donc pas être proratisé une seconde fois. Par exemple, le coefficient 200 vaut 2 130,20 €/mois à temps complet et 1 065,10 €/mois à mi-temps.
- `coefficient hors grille` signale un coefficient absent des 49 positions. La grille retourne alors `0 €/mois` et l’application doit traiter l’anomalie.

Les coefficients 125 à 140 (de 1 835,60 € à 1 852,60 €) sont inférieurs au SMIC mensuel de 1 867,02 € en vigueur depuis juin 2026 : l’application doit retenir le plus élevé des deux montants.

## Limites

- Les montants sont ceux du texte de l’accord, arrondis au dixième d’euro. Une synthèse de la grille (juristique.org) donne des montants au centime qui en diffèrent d’au plus 0,05 € : le texte est retenu.
- L’accord s’applique aux entreprises adhérentes de l’organisation signataire dès le lendemain de son dépôt, et aux autres un jour franc après la publication de l’arrêté d’extension (article 8), soit à partir du 18 avril 2026. Pour les employeurs non adhérents, les périodes de février à avril 2026 sont donc incertaines. La version retient le 1er février 2026.
- L’accord ne distingue pas le minimum des cadres au forfait : la grille est lue comme un salaire mensuel pour 35 heures, proratisé selon la quotité.
- Les primes, majorations, la prévoyance et les autres éléments de la convention ne sont pas modélisés.
- L’accord du 19 décembre 2024, que celui-ci remplace, n’est pas modélisé : la première version couvre les périodes à partir du 1er février 2026.
