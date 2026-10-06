# Maisons à succursales de vente au détail d'habillement — IDCC 675

Le fichier [2026.1](0675-succursales-habillement.2026.1.publicodes) entre en vigueur le 1er mai 2026. Il est fondé sur l’accord du 16 avril 2026 relatif aux salaires mensuels minima garantis, étendu par arrêté du 6 juillet 2026 (JORF n° 0160 du 10 juillet 2026, texte n° 117, NOR TRST2616915A), cités dans ses métadonnées. La valeur Publicodes est `succursales habillement` ; les règles sont sous `salarié . convention collective . succursales habillement`.

La convention collective nationale des maisons à succursales de vente au détail d’habillement du 30 juin 1972 (brochure 3065) ne doit pas être confondue avec la convention [1483](../1483-commerce-detail-habillement-textiles/README.md), celle du commerce de détail de l’habillement et des articles textiles.

## Règles implémentées

- `niveau` reçoit la catégorie : `E1` à `E4` pour les employés, `AM1` et `AM2` pour les agents de maîtrise, `C1` à `C3` pour les cadres (défaut : `non renseigné`).
- `salaire minimum conventionnel . grille` donne le salaire mensuel minimum des 9 catégories, pour 151,67 heures, de 1 824 € (`E1`) à 3 044 € (`C3`).
- `salaire minimum conventionnel` multiplie la grille par `salarié . contrat . temps de travail . quotité` de `modele-social`. Le montant ne doit donc pas être proratisé une seconde fois. Par exemple, `E4` vaut 1 900 €/mois à temps complet et 950 €/mois à mi-temps.
- `niveau hors grille` signale une catégorie absente des 9 positions. La grille retourne alors `0 €/mois` et l’application doit traiter l’anomalie.

Les catégories `E1` à `E3` (de 1 824 € à 1 851 €) sont inférieures au SMIC mensuel de 1 867,02 € en vigueur depuis juin 2026 : l’arrêté d’extension réserve l’application des dispositions réglementaires sur le SMIC, et l’application doit retenir le plus élevé des deux montants.

## Limites

- Le texte de l’accord n’a pas été lu directement : les montants viennent de deux pages de synthèse concordantes (juristique.org et convention.fr), les références de l’arrêté du texte publié au JORF. À recouper avec l’accord sur Légifrance.
- L’accord s’applique à compter du 1er mai 2026. Pour les employeurs non adhérents à la fédération signataire, l’arrêté d’extension réserve son article 4 à compter du lendemain de sa publication (11 juillet 2026) : cette distinction n’est pas modélisée.
- La grille vaut pour la France métropolitaine.
- Les primes d’ancienneté (à partir de 3 ans), majorations, prévoyance et autres éléments de la convention ne sont pas modélisés.
- Les grilles antérieures au 1er mai 2026, notamment celle de l’accord du 14 mai 2024, ne sont pas modélisées : la première version couvre les périodes à partir de cette date.
