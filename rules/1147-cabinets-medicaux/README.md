# Cabinets médicaux — IDCC 1147

Le fichier [2024.1](1147-cabinets-medicaux.2024.1.publicodes) entre en vigueur le 1er janvier 2024. Il est fondé sur l’avenant n° 90 du 14 décembre 2023 relatif aux salaires, étendu par arrêté du 17 mai 2024 (JORF n° 0126 du 1er juin 2024, texte n° 57, NOR TSST2406494A), cités dans ses métadonnées. La valeur Publicodes est `cabinets médicaux` ; les règles sont sous `salarié . convention collective . cabinets médicaux`.

La convention collective nationale du personnel des cabinets médicaux du 14 octobre 1981 (brochure 3168) classe les emplois en positions de 4 à 16 depuis la réforme de 2020, sans valeur de point.

## Règles implémentées

- `niveau` reçoit la position, de `4` à `16` (défaut : `non renseigné`).
- `salaire minimum conventionnel . grille` donne le salaire mensuel minimum des 13 positions, pour 151,67 heures, de 1 782,14 € (position 4) à 4 530,83 € (position 16).
- `salaire minimum conventionnel` multiplie la grille par `salarié . contrat . temps de travail . quotité` de `modele-social`. Le montant ne doit donc pas être proratisé une seconde fois. Par exemple, la position 8 vaut 2 050,62 €/mois à temps complet et 1 025,31 €/mois à mi-temps.
- `niveau hors grille` signale une position absente des 13 positions. La grille retourne alors `0 €/mois` et l’application doit traiter l’anomalie.

Les positions 4 et 5 (1 782,14 € et 1 815,79 €) sont inférieures au SMIC mensuel de 1 867,02 € en vigueur depuis juin 2026 : l’application doit retenir le plus élevé des deux montants.

## Limites

- Le texte de l’avenant n’a pas pu être lu (PDF inexploitable) : les 13 montants viennent de deux pages de synthèse concordantes (convention.fr et payfit.com), les références de l’arrêté de Légifrance. À recouper avec l’avenant.
- Aucun avenant de salaires postérieur à celui du 14 décembre 2023 n’a été trouvé, sans que son absence soit établie : la grille date de 2024.
- L’arrêté d’extension produit ses effets à compter de sa publication (1er juin 2024) : pour les employeurs non adhérents aux organisations signataires, la grille n’est opposable qu’à partir de cette date, ce qui n’est pas modélisé.
- La prime d’ancienneté (de 4 % à 20 % selon l’ancienneté, d’après les pages consultées), les jours de congés supplémentaires et les autres éléments de la convention ne sont pas modélisés.
- Les grilles antérieures au 1er janvier 2024 ne sont pas modélisées : la première version couvre les périodes à partir de cette date.
