# Établissements privés à but non lucratif — IDCC 29 (CCN 51, FEHAP)

Le fichier [2026.1](0029-etablissements-prives-non-lucratifs.2026.1.publicodes) entre en vigueur le 1er janvier 2026. Il est fondé sur l’avenant salarial n° 2025-04, signé en décembre 2025, qui porte la valeur du point à 4,568 €, cité dans ses métadonnées. La valeur Publicodes est `établissements privés non lucratifs` ; les règles sont sous `salarié . convention collective . établissements privés non lucratifs`.

La convention collective nationale du 31 octobre 1951 (CCN 51, FEHAP) ne fixe pas une grille de salaires par niveau : chaque emploi a un coefficient et le salaire de base est le coefficient multiplié par la valeur du point.

## Règles implémentées

- `coefficient` reçoit le coefficient de l’emploi occupé (défaut : 0).
- `valeur du point` vaut 4,568 € (avenant n° 2025-04, applicable au 1er janvier 2026).
- `salaire minimum conventionnel` multiplie le coefficient par la valeur du point, puis par `salarié . contrat . temps de travail . quotité` de `modele-social`. Le montant ne doit donc pas être proratisé une seconde fois. Par exemple, le coefficient 477 vaut 2 178,94 €/mois à temps complet et 1 089,47 €/mois à mi-temps.
- `coefficient hors grille` signale un coefficient absent ou nul : le minimum vaut alors `0 €/mois`.

Le coefficient 409 est le premier dont le salaire de base dépasse le SMIC mensuel de 1 867,02 € en vigueur depuis juin 2026 ; en dessous (par exemple 306, 351 ou 376), l’application doit retenir le SMIC.

## Limites

- Le texte de l’avenant n’a pas pu être lu. La valeur de 4,568 €, sa date et la valeur précédente de 4,477 € viennent de trois pages de synthèse concordantes. Une quatrième page donne 4,96 € et n’est pas retenue. L’agrément ministériel, qui conditionne l’application aux établissements financés par l’assurance maladie, n’a pas été vérifié. À recouper avec l’avenant et l’arrêté d’agrément.
- Les pages divergent sur le calcul : l’une indique que le salaire de base intègre un facteur de 1,03 (3 % à l’embauche) qui donnerait des montants supérieurs de 3 %. La règle retient le coefficient multiplié par la valeur du point, le montant le plus bas.
- La prime d’ancienneté, dont les pages donnent des règles différentes (1 % par an plafonné à 30 %, ou jusqu’à 34 %), la prime décentralisée de 5 % et les compléments Ségur ne sont pas modélisés.
- La liste des coefficients n’est pas contrôlée : tout coefficient positif est accepté. Les pages citent par exemple 306 (agent de service), 351, 376 (aide-soignant), 477 (infirmier) et 590 (cadre de santé).
- Les valeurs du point antérieures au 1er janvier 2026 ne sont pas modélisées : la première version couvre les périodes à partir de cette date.
