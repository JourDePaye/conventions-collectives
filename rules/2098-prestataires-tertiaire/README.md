# Prestataires de services dans le domaine du secteur tertiaire — IDCC 2098

Ce répertoire contient le modèle Publicodes de la convention collective nationale du personnel des prestataires de services dans le domaine du secteur tertiaire (IDCC 2098).

## Versions `2026.1` et `2026.2`

`2026.1` reprend la grille antérieure applicable au 1er août 2026. `2026.2` corrige la source et la grille à la suite de l'accord du **27 mai 2026**, étendu par arrêté du 28 juillet 2026 publié le 31 juillet 2026 ; cette grille est applicable au **1er août 2026**.

## Salaire minimum conventionnel

La convention fixe des minima mensuels pour 151,67 heures, par coefficient :

- ETAM : 120 à 300 ;
- cadres : 320 à 500.

La règle attend le **coefficient conventionnel réellement applicable**, puis prorate une seule fois le minimum par la quotité de travail. Les libellés de classification A1 à B4 et C1 à C4 ne sont pas convertis automatiquement : la grille nationale ne fournit pas une correspondance unique et mécanique avec chacun des coefficients salariaux.

Le minimum doit être comparé à la rémunération mensuelle contractuelle selon le périmètre de l'accord salarial. Les majorations d'heures supplémentaires, de nuit, de dimanche ou de jour férié, ainsi que les primes annuelles ou exceptionnelles, ne doivent pas compenser un salaire de base inférieur au minimum conventionnel.

## Travail de nuit

L'accord prévoit une plage conventionnelle de 22 h à 7 h (pouvant être fixée à 21 h–6 h par accord collectif), une majoration de 25 % pour le travail de nuit occasionnel et un repos compensateur de 4 % pour les travailleurs de nuit. Le statut de travailleur de nuit reste une entrée fournie par l'application appelante.

## Périmètre non modélisé

Cette version ne modélise pas les compléments dépendant d'annexes sectorielles, notamment les règles de prestations événementielles, les indemnités de transport afférentes, les majorations de dimanche et jours fériés spécifiques, ni les accords d'entreprise plus favorables.

## Sources

- [Accord du 27 mai 2026 relatif aux salaires et à la valeur de point](https://www.legifrance.gouv.fr/conv_coll/id/KALITEXT000054936719)
- [Article relatif aux salaires](https://www.legifrance.gouv.fr/conv_coll/article/KALIARTI000054936744)
- [Arrêté d'extension du 28 juillet 2026](https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000054570646)
- [Classification des emplois](https://www.legifrance.gouv.fr/conv_coll/article/KALIARTI000024922383)
- [Accord relatif au travail de nuit](https://www.legifrance.gouv.fr/conv_coll/id/KALITEXT000005680405)

## Maintien de salaire

La révision 2026.3 ajoute le maintien de salaire conventionnel (article 18.1 B) sous `maintien de salaire`, lu sur Légifrance le 24 octobre 2026 : les durées, taux, carences et modalités sont dans les sources de la version et dans `test/salary-maintenance-2.test.ts`. L’interface est décrite dans le README du package. La levée de la carence en cas d’hospitalisation n’est pas reprise ; la maternité reçoit les mêmes durées, sans carence.
