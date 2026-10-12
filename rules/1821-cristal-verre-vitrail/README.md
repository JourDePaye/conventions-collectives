# Professions regroupées du cristal, du verre et du vitrail — IDCC 1821

Le fichier [2026.1](1821-cristal-verre-vitrail.2026.1.publicodes) entre en vigueur le 1er janvier 2026. Il est fondé sur l'accord du 3 mars 2026 relatif aux salaires minima pour l'année 2026, étendu par arrêté du 11 juin 2026 (JORF du 27 juin 2026), cité dans ses métadonnées. La valeur Publicodes est `cristal verre vitrail` ; les règles sont sous `salarié . convention collective . cristal verre vitrail`.

## Règles implémentées

- `coefficient` reçoit l'un des coefficients de la grille publiée : 115, 125, 135, 145, 155, 160, 175, 190, 205, 220, 230, 245, 260, 275, 290, 295, 315, 330, 345, 385, 440, 490, 550, 660, 770 ou 880.
- `salaire minimum conventionnel . grille` donne le salaire minimum garanti mensuel à temps complet, selon l'article 2 de l'accord ; il ne doit pas être inférieur au SMIC, qui reste fourni par le modèle légal.
- `salaire minimum conventionnel` proratisе le minimum selon la quotité de travail.
- L'accord exclut les entreprises relevant de l'annexe B (industrie du vitrail). `annexe B vitrail exclue` permet de rendre le modèle inapplicable à ce périmètre.

## Limites

- Le salaire minimum professionnel horaire et mensuel de l'article 3, les primes et autres éléments conventionnels ne sont pas modélisés.
- Le modèle ne calcule pas le SMIC : les coefficients dont le minimum conventionnel est inférieur au SMIC doivent être couverts par la règle légale du SMIC dans l'application consommatrice.
