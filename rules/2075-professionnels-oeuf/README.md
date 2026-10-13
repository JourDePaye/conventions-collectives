# Professionnels de l'œuf — ancien IDCC 2075, repris par l'IDCC 3255

La version `2025.1` modélise la grille de salaires minima conventionnels mensuels de l'article 21 de la convention collective nationale des activités industrielles de boulangerie et pâtisserie et des professionnels de l'œuf du **1er octobre 2024**, applicable au **1er février 2025** pour 151,67 heures mensuelles.

L'ancien IDCC 2075 est repris dans le champ de la convention collective IDCC 3255. Cette entrée conserve une valeur de convention distincte pour les applications qui reçoivent encore l'identifiant historique ; elle reprend uniquement la grille salariale commune de l'accord successor.

La valeur Publicodes est `professionnels de l'œuf` et les règles sont sous `salarié . convention collective . professionnels de l'œuf`.

## Règles implémentées

- `salaire minimum conventionnel` expose les treize cellules A1 à E3 de la grille.
- Le minimum est proratisé selon `contrat . temps de travail . quotité`.
- Les niveaux absents de la grille rendent le minimum inapplicable et exposent `niveau hors grille` à `vrai`.

## Sources officielles

- Convention collective et article 21 relatif aux salaires minima, texte KALI `KALITEXT000052299903`.
- Conteneur officiel de la convention collective successorale, IDCC 3255, KALI `KALICONT000051160618`.

## Limites

Le modèle ne déduit pas la classification du poste et ne modélise pas les primes, majorations, ancienneté, catégories particulières, comparaison annuelle ou autres dispositions de la convention. Il ne reconstitue pas l'historique autonome de l'ancien IDCC 2075 avant son remplacement par l'IDCC 3255.

## Tests

`test/professionnels-oeuf.test.ts` vérifie la date et les sources, les treize cellules de la grille, la proratisation à temps partiel, les niveaux hors grille et l'isolation de la convention.
