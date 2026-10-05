# Boulangerie-pâtisserie artisanale — IDCC 843

Le fichier [2026.1](0843-boulangerie-patisserie-artisanale.2026.1.publicodes) entre en vigueur le 1er février 2026. Il réunit trois textes, cités dans ses métadonnées :

- l’avenant n° 139 du 14 janvier 2026 (grille nationale, applicable le 1er janvier 2026), étendu par arrêté du 10 avril 2026 (JORF n° 0091 du 17 avril 2026, NOR TRST2608824A) ;
- l’accord Île-de-France n° 61 du 22 janvier 2026 (applicable le 1er février 2026), étendu par arrêté du 8 avril 2026 (JORF n° 0091 du 17 avril 2026, texte n° 80) ;
- l’avenant n° 20 du 21 janvier 2026 des Bouches-du-Rhône (grille au 1er janvier 2026, effet « dès son extension »), étendu par arrêté du 2 avril 2026 (JORF n° 0091 du 17 avril 2026, texte n° 60).

La valeur Publicodes est `boulangerie-pâtisserie artisanale` ; les règles sont sous `salarié . convention collective . boulangerie-pâtisserie artisanale`. La convention collective nationale du 19 mars 1976 (brochure 3117) couvre les entreprises artisanales. Elle ne couvre pas les activités industrielles de boulangerie-pâtisserie (IDCC 1747).

## Règles implémentées

- `niveau` reçoit le coefficient (`155`, `160`, `165`, `170`, `175`, `180`, `185`, `190`, `195` ou `240`) des personnels de fabrication, de vente et de services, ou `C1` et `C2` pour les cadres 1 et 2 (défaut : `non renseigné`).
- `zone` reçoit `Île-de-France`, `Bouches-du-Rhône` ou `national` (défaut), le territoire dont la grille s’applique.
- `taux horaire minimum` donne le salaire horaire minimum du coefficient dans la zone, de 12,41 €/heure (coefficient 155, national) à 17,42 €/heure (coefficient 240, Île-de-France). Il vaut `0 €/heure` pour les cadres.
- `rémunération minimale annuelle` donne la rémunération annuelle des cadres pour 218 jours de travail : 39 871 € (`C1`) et 57 206 € (`C2`) au niveau national et dans les Bouches-du-Rhône, 39 955 € et 57 328 € en Île-de-France. Elle vaut `0 €/an` pour les coefficients.
- `salaire minimum conventionnel` additionne les deux :
  - pour les coefficients, le taux horaire multiplié par `salarié . contrat . temps de travail` de `modele-social`, soit 151,67 heures par mois pour un temps plein, comme le SMIC. Par exemple, le coefficient 170 national vaut 1 938,30 €/mois à temps complet ;
  - pour les cadres, un douzième du minimum annuel, multiplié par `salarié . contrat . temps de travail . quotité`. Le montant ne doit donc pas être proratisé une seconde fois.
- `niveau hors grille` signale un coefficient ou un statut absent de la grille. Les deux grilles retournent alors zéro et l’application doit traiter l’anomalie.

Les trois grilles donnent le même salaire pour un coefficient donné quelle que soit la catégorie (fabrication, vente, services) : seule l’union des coefficients est donc modélisée.

Tous les taux horaires sont supérieurs au SMIC horaire de 12,31 € en vigueur depuis juin 2026. L’application retient néanmoins le plus élevé des deux montants.

## Limites

- La catégorie n’est pas demandée : un coefficient est accepté même s’il n’existe pas dans la catégorie de l’employé (par exemple 195 ou 240 pour le personnel de vente, 165 ou 180 pour la fabrication nationale, ou 175 et plus pour les services).
- Le tableau de l’accord Île-de-France n’est pas cohérent avec sa propre formule (point 0,0567977 et constante 3,720364) : elle donne par exemple 12,52 € pour le coefficient 155 là où le tableau donne 12,57 €, soit 0,05 à 0,07 € d’écart. Le tableau, valeur explicite de l’accord, est retenu.
- La date d’effet de l’avenant des Bouches-du-Rhône est celle de son extension (17 avril 2026), alors que sa grille mentionne le 1er janvier 2026 : les périodes de février à avril 2026 y sont à vérifier pour les employeurs non adhérents.
- Les Bouches-du-Rhône n’ont pas de montant propre pour les cadres : ceux de l’avenant national sont utilisés.
- Le minimum des cadres est annuel (forfait de 218 jours) et s’apprécie sur l’ensemble de la rémunération. Le modèle n’en donne que l’équivalent mensuel, un douzième, qui est une approximation.
- Les autres accords départementaux ou régionaux de salaires ne sont pas modélisés : la grille nationale s’applique partout ailleurs.
- Les primes, majorations, la prévoyance et les autres éléments de la convention ne sont pas modélisés.
- Les grilles antérieures au 1er février 2026 ne sont pas modélisées : la première version couvre les périodes à partir de cette date.
