# Commerce de détail de l’habillement et des articles textiles — IDCC 1483

Le fichier [2026.1](1483-commerce-detail-habillement-textiles.2026.1.publicodes) entre en vigueur le 1er avril 2026. Le fichier [2026.2](1483-commerce-detail-habillement-textiles.2026.2.publicodes) entre en vigueur le 1er octobre 2026 et ajoute le barème spécifique à Mayotte issu de l'accord du 12 juin 2026, étendu par arrêté du 22 septembre 2026 publié au JORF du 30 septembre 2026. Les références figurent dans les métadonnées. La valeur Publicodes est `commerce de détail habillement` ; les règles sont sous `salarié . convention collective . commerce de détail habillement`.

La convention collective nationale du commerce de détail de l’habillement et des articles textiles du 25 novembre 1987 (brochure 3241) couvre les entreprises relevant de l’IDCC 1483. Elle ne couvre pas les succursales de commerce de détail de l’habillement (IDCC 675).

## Règles implémentées

- `niveau` reçoit la catégorie (défaut : `non renseigné`) : `1` à `8` pour les employés, `A1`, `A2` et `B` pour les agents de maîtrise, `C` et `D` pour les cadres.
- `barème` donne la rémunération minimale de la catégorie pour 151,67 heures par mois, de 1 828 € (catégorie 1) à 4 164 € (catégorie D).
- `prime d’ancienneté` donne la prime mensuelle des employés et des agents de maîtrise `A1` et `A2`, par palier de 3 ans d’ancienneté de 3 à 18 ans (par exemple 49 € à 6 ans pour les catégories 1 et 2). Elle vaut `0 €/mois` avant 3 ans et pour les catégories `B`, `C` et `D`.
- `minimum d’encadrement selon l’ancienneté` donne le minimum des catégories `B`, `C` et `D` à partir de 3 ans d’ancienneté, par palier de 3 ans jusqu’à 18 ans (par exemple 2 629 € pour `B` à 3 ans). Il vaut `0 €/mois` avant 3 ans et pour les autres catégories.
- `salaire minimum conventionnel` retient le minimum d’encadrement lorsqu’il s’applique, sinon le barème augmenté de la prime d’ancienneté, puis multiplie par `salarié . contrat . temps de travail . quotité` de `modele-social`. Le montant ne doit donc pas être proratisé une seconde fois : l’avenant prévoit le prorata du temps de travail pour la prime. Par exemple, la catégorie 3 avec 6 ans d’ancienneté vaut 1 893 € à temps complet et 946,50 € à mi-temps.
- La version `2026.2` sélectionne, lorsque `établissement . commune . département = 'Mayotte'`, le barème mahorais de l'accord du 12 juin 2026 : catégories 1 à 8 de 1 450 € à 1 655 €, A1 à D de 1 780 € à 3 181 €, et minima d'encadrement B, C et D selon l'ancienneté. Les primes d'ancienneté des employés et A1/A2 restent identiques au barème national.
- `niveau hors grille` signale une catégorie absente de la grille. Le barème retourne alors `0 €/mois` et l’application doit traiter l’anomalie.

L’ancienneté est celle de `modele-social` (`salarié . ancienneté`) : la durée depuis la date d’embauche, le jour d’embauche étant compté, mesurée au premier jour de la période avec des années de 365 jours. Un palier peut donc s’appliquer un ou deux jours avant l’anniversaire d’embauche selon les années bissextiles, et il vaut pour toute la paie du mois.

Les catégories 1 à 4 (de 1 828 € à 1 857 €), sans prime d’ancienneté, sont inférieures au SMIC mensuel de 1 867,02 € en vigueur depuis juin 2026 : l’application doit retenir le plus élevé des deux montants.

## Limites

- L'accord du 12 juin 2026 relatif aux salaires et à la prime d'ancienneté applicables à Mayotte, étendu par arrêté du 22 septembre 2026 publié au JORF du 30 septembre 2026, est modélisé dans la version `2026.2` à compter du 1er octobre 2026. Il est réservé aux entreprises mahoraises et aux salariés employés sur le territoire mahorais ; il cesse au plus tard le 31 décembre 2031 ou lors d'une nouvelle étape de convergence du SMIC.
- Les règles de santé, de prévoyance, de formation et les autres dispositions conventionnelles non salariales ne sont pas modélisées. L'accord d'adaptation à Mayotte prévoit des adaptations de champ pour les textes nationaux, mais aucune cotisation IDCC 1483 correspondante n'est exposée par le modèle actuel.
- L’ancienneté retenue est celle de l’entreprise depuis la date d’embauche. L’avenant ne la définit pas : une reprise d’ancienneté ou une ancienneté conventionnelle différente n’est pas prise en compte.
- Les rémunérations minima de l’avenant s’entendent pour 151,67 heures par mois et sont proratisées selon la quotité. Les cadres au forfait jours n’ont pas de minimum distinct.
- Les primes autres que la prime d’ancienneté, les majorations, la prévoyance et les autres éléments de la convention ne sont pas modélisés.
- Les grilles antérieures au 1er avril 2026, notamment celle de l’avenant n° 28 du 23 novembre 2023, ne sont pas modélisées : la première version couvre les périodes à partir de cette date.
