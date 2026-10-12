# Commerces de détail de papeterie, fournitures de bureau, bureautique, informatique et librairie — IDCC 1513

Le fichier [2026.1](1513-papeterie-librairie.2026.1.publicodes) entre en vigueur le 1er août 2026 pour le champ étendu. Il est fondé sur l’avenant n° 4 du 24 mars 2026 relatif aux salaires minima conventionnels et sur l’arrêté d’extension du 30 juin 2026 (JORF du 7 juillet 2026, NOR TRST2617482A), cités dans ses métadonnées. Les textes ont été consultés sur Légifrance.

La convention collective nationale des commerces de détail de papeterie, fournitures de bureau, bureautique et informatique, et de librairie (IDCC 1513, brochure 3252) couvre les entreprises de ce champ. La valeur Publicodes est `papeterie fournitures bureau bureautique informatique librairie` ; les règles sont sous `salarié . convention collective . papeterie fournitures bureau bureautique informatique librairie`.

## Règles implémentées

- `coefficient` reçoit un coefficient de classification de `1` à `10` (défaut : `non renseigné`).
- `salaire minimum conventionnel . grille` donne le minimum mensuel pour 151,67 heures : 1 823 € pour les coefficients 1 à 5 et 1 830 € pour les coefficients 6 à 10.
- `salaire minimum conventionnel` multiplie la grille par `salarié . contrat . temps de travail . quotité` de `modele-social`. Le montant ne doit donc pas être proratisé une seconde fois.
- `coefficient hors grille` signale un coefficient absent. La grille retourne alors `0 €/mois` et l’application doit traiter l’anomalie.

## Limites

- L’avenant s’applique au 1er avril 2026 aux entreprises adhérant à une organisation d’employeurs signataire ; pour les autres entreprises, l’arrêté d’extension prévoit une prise d’effet le premier jour du mois suivant sa publication. La version couvre le champ étendu à compter du 1er août 2026.
- Seuls les salaires minima de l’avenant sont modélisés ; les primes, majorations, prévoyance et autres dispositions de la convention ne le sont pas.
- Les grilles antérieures au 1er avril 2026 ne sont pas modélisées.
