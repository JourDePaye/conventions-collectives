# Boyauderie — IDCC 1543

Le fichier [2026.1](1543-boyauderie.2026.1.publicodes) entre en vigueur le 1er février 2026. Il reprend l’accord du 16 janvier 2026 relatif aux salaires minimaux conventionnels, rattaché par Légifrance aux IDCC 1586 et 1543, dont les champs ont été fusionnés par arrêté ministériel du 23 janvier 2019. La version est donc un modèle distinct pour l’IDCC 1543, avec les mêmes minima de la branche de rattachement.

Sources officielles : [accord du 16 janvier 2026](https://www.legifrance.gouv.fr/conv_coll/article/KALIARTI000054092006), [article 5 sur le rattachement aux IDCC 1586 et 1543](https://www.legifrance.gouv.fr/conv_coll/article/KALIARTI000054092016), [texte de base de la boyauderie](https://www.legifrance.gouv.fr/conv_coll/id/KALITEXT000005649964).

## Règles implémentées

- `coefficient` reçoit le coefficient hiérarchique (défaut : `0`) : de 125 à 345 par pas de 5, puis 350, 400, 600 et 700.
- `salaire minimum conventionnel . grille` donne le minimum mensuel garanti à temps plein (35 heures / 151,67 heures), de 1 835,60 € à 5 763,40 € ; le minimum est proratisé par la quotité de travail.
- `coefficient hors grille` signale les coefficients absents et la grille retourne alors `0 €/mois`.
- `prévoyance` modélise les effets de paie explicitement sourcés par l’avenant n° 9 : 1,04 % du salaire plafonné à quatre plafonds, partagé à parts égales pour les non-cadres, et 1,50 % employeur sur la tranche A pour les cadres.

## Limites

- Le modèle couvre la grille rattachée publiée pour la branche fusionnée ; il ne reconstitue pas une classification historique propre à la boyauderie antérieure à la fusion.
- Les primes, majorations et garanties contractuelles non chiffrées par les sources ne sont pas calculées.
- La version est bornée au texte salarial applicable à compter du 1er février 2026 ; l’extension aux employeurs non adhérents suit la règle d’un jour franc après publication de l’arrêté d’extension.
