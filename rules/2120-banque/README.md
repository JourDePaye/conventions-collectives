# Banque — IDCC 2120

Le fichier [2026.1](2120-banque.2026.1.publicodes) entre en vigueur le 1er avril 2026. Il est fondé sur l’accord du 16 avril 2026 relatif aux salaires minima annuels de branche (revalorisation de 1,1 %, avec une augmentation minimale de 450 € par case), cité dans ses métadonnées. La valeur Publicodes est `banque` ; les règles sont sous `salarié . convention collective . banque`.

La convention collective nationale de la banque du 10 janvier 2000 (brochure 3161) fixe des salaires annuels minima de branche pour les niveaux A à G (techniciens des métiers de la banque) et H à K (cadres), hors ancienneté puis à partir de 5, 10, 15 et 20 ans d’ancienneté. Le salaire annuel est versé en 13 mensualités égales.

## Règles implémentées

- `niveau` reçoit le niveau, de `A` à `K` (défaut : `non renseigné`).
- `salaire minimum conventionnel . grille annuelle` donne le minimum annuel à temps plein selon l’ancienneté, de 23 387 € (niveaux A à D hors ancienneté) à 62 323 € (niveau K à 20 ans). L’ancienneté est celle de `modele-social` (`salarié . ancienneté`), calculée depuis la date d’embauche.
- `salaire minimum conventionnel` est le treizième de ce minimum annuel, multiplié par `salarié . contrat . temps de travail . quotité` de `modele-social` et arrondi au centime. Le montant ne doit donc pas être proratisé une seconde fois. Par exemple, le niveau E hors ancienneté vaut 24 240 € / 13 = 1 864,62 €/mois à temps complet et 932,31 €/mois à mi-temps.
- `niveau hors grille` signale un niveau absent des 11 niveaux. La grille retourne alors `0` et l’application doit traiter l’anomalie.

Les minima mensuels vont de 1 799,00 € (niveaux A à D hors ancienneté) à 4 794,08 € (niveau K à 20 ans). Les niveaux A à D hors ancienneté et le niveau E (de 1 799,00 € à 1 864,62 €) sont inférieurs au SMIC mensuel de 1 867,02 € en vigueur depuis juin 2026 : l’application doit retenir le plus élevé des deux montants.

## Limites

- Le texte de l’accord n’a pas pu être lu. Les minima hors ancienneté viennent de trois pages de synthèse concordantes (juristique.org, salerya.fr et tripalio pour les dates) ; le tableau selon l’ancienneté ne vient que d’une page (convention.fr), qui donne 38 284 € pour le niveau I hors ancienneté, ce qui est incohérent avec les 38 734 € des autres pages et avec les écarts des autres niveaux : 38 734 € est retenu. À recouper avec l’accord.
- L’extension (arrêté du 11 juin 2026, JORF du 27 juin 2026) vient de pages de synthèse ; son numéro de texte et son NOR ne sont pas vérifiés. Pour les employeurs non adhérents, l’accord n’est opposable qu’à compter de cette publication, ce qui n’est pas modélisé.
- Un avenant du 26 juin 2026 à l’accord du 21 juillet 2022, étendu par arrêté du 7 septembre 2026 (JORF du 19 septembre 2026), réévalue les salaires minima de la branche inférieurs au SMIC : son contenu n’a pas pu être lu, et il peut modifier les cases les plus basses de la grille. Il n’est pas modélisé.
- Les pages ne précisent pas si le minimum mensuel est le treizième du minimum annuel pour un salarié à temps plein sur 13 mois, ou calculé sur 12 mois ; la règle retient le treizième (le plus bas).
- Le plancher de 36 000 € des cadres de plus de 50 ans, les primes, la prévoyance et les autres éléments de la convention ne sont pas modélisés.
- Les grilles antérieures au 1er avril 2026 ne sont pas modélisées : la première version couvre les périodes à partir de cette date.
