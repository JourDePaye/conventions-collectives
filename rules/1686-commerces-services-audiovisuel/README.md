# Commerces et services de l’audiovisuel, de l’électronique et de l’équipement ménager — IDCC 1686

Le fichier [2026.1](1686-commerces-services-audiovisuel.2026.1.publicodes) entre en vigueur le 1er mai 2026. Il est fondé sur l’avenant n° 63 du 12 février 2026 relatif aux rémunérations conventionnelles (NOR ASET2650361M), étendu par arrêté du 5 mai 2026 (JORF n° 0109 du 10 mai 2026, texte n° 83, NOR TRST2610665A), cités dans ses métadonnées. La valeur Publicodes est `audiovisuel électronique équipement ménager` ; les règles sont sous `salarié . convention collective . audiovisuel électronique équipement ménager`.

La convention collective nationale des commerces et services de l’audiovisuel, de l’électronique et de l’équipement ménager du 26 novembre 1992 (brochure 3076) couvre les entreprises relevant de l’IDCC 1686.

## Règles implémentées

- `niveau` reçoit la classification (défaut : `non renseigné`) :
  - `<niveau>.<échelon>` pour les ouvriers, employés et agents de maîtrise, avec un niveau de I à IV en chiffres romains et un échelon de 1 à 3, de `I.1` à `IV.3` ;
  - `C1` à `C4` pour les positions I à IV des cadres.
- `grille mensuelle` donne le minimum mensuel des 12 positions des ouvriers, employés et agents de maîtrise, pour 151,67 heures, de 1 827,03 € (`I.1`) à 2 665,45 € (`IV.3`). Elle vaut `0 €/mois` pour les cadres.
- `rémunération minimale annuelle` donne la rémunération annuelle des 4 positions de cadres, de 32 187,06 € (`C1`) à 54 007,49 € (`C4`). Elle vaut `0 €/an` pour les autres niveaux.
- `salaire minimum conventionnel` additionne les deux, puis multiplie par `salarié . contrat . temps de travail . quotité` de `modele-social`. Le montant ne doit donc pas être proratisé une seconde fois. Par exemple, `III.2` vaut 2 060,98 €/mois à temps complet et 1 030,49 €/mois à mi-temps.
- `niveau hors grille` signale une classification absente des 16 positions. Les deux grilles retournent alors zéro et l’application doit traiter l’anomalie.

Les positions `I.1` (1 827,03 €), `I.2` (1 831,21 €) et `I.3` (1 843,11 €) sont inférieures au SMIC mensuel de 1 867,02 € en vigueur depuis juin 2026 : l’application doit retenir le plus élevé des deux montants.

## Limites

- L’avenant s’applique au 1er mai 2026 aux entreprises adhérant à une organisation d’employeurs signataire (FEDELEC, CNEF), et aux autres entreprises le premier jour du mois qui suit la publication de l’arrêté d’extension (article 3), soit le 1er juin 2026. Pour les employeurs non adhérents, mai 2026 est donc incertain. La version retient le 1er mai 2026.
- Les rémunérations des cadres sont annuelles. Le modèle n’en donne que l’équivalent mensuel, un douzième, qui est une approximation. La notation `C1` à `C4` des positions de cadres est celle du modèle : l’avenant les appelle positions I à IV.
- Le texte de l’avenant a été consulté sur Légifrance (textes salaires de la convention) ; il a été recoupé avec une grille publiée par convention.fr, qui donne les mêmes montants. Le fichier PDF publié au BOCC n’a pas été lu.
- Les primes, majorations, la prévoyance et les autres éléments de la convention ne sont pas modélisés.
- Les grilles antérieures au 1er mai 2026, notamment celle de l’avenant n° 61 du 13 février 2025, ne sont pas modélisées : la première version couvre les périodes à partir de cette date.
