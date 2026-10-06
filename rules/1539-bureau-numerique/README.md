# Entreprises du bureau et du numérique — IDCC 1539

Le fichier [2025.1](1539-bureau-numerique.2025.1.publicodes) entre en vigueur le 1er septembre 2025. Il est fondé sur l’accord du 2 avril 2025 relatif à la grille des salaires minima, étendu par arrêté du 31 juillet 2025 (JORF du 7 août 2025), cités dans ses métadonnées. La valeur Publicodes est `bureau et numérique` ; les règles sont sous `salarié . convention collective . bureau et numérique`.

La convention collective nationale du commerce de détail de papeterie, fournitures de bureau, de bureautique et informatique et de librairie (15 décembre 1988) s’intitule désormais « entreprises du bureau et du numérique – commerces et services » (brochure 3269). Elle ne doit pas être confondue avec la convention [1517](../1517-commerce-detail-non-alimentaire/README.md), celle du commerce de détail non alimentaire.

## Règles implémentées

- `niveau` reçoit le niveau de classification : `A1` à `A5`, `B1` à `B3`, `C1` à `C4` (défaut : `non renseigné`).
- `salaire minimum conventionnel . grille` donne le salaire mensuel minimum des 12 niveaux, pour 151,67 heures, de 1 835 € (`A1`, coefficient 140) à 4 720 € (`C4`, coefficient 500).
- Un salarié du niveau `A1` qui a au moins un an d’ancienneté perçoit le minimum du niveau `A2` (1 855 €), comme le prévoit l’arrêté d’extension. L’ancienneté est celle de `modele-social` (`salarié . ancienneté`), calculée depuis la date d’embauche : elle compte le premier jour et des années de 365 jours.
- `salaire minimum conventionnel` multiplie la grille par `salarié . contrat . temps de travail . quotité` de `modele-social`. Le montant ne doit donc pas être proratisé une seconde fois. Par exemple, `A3` vaut 1 875 €/mois à temps complet et 937,50 €/mois à mi-temps.
- `niveau hors grille` signale un niveau absent des 12 positions. La grille retourne alors `0 €/mois` et l’application doit traiter l’anomalie.

Les niveaux `A1` et `A2` (1 835 € et 1 855 €) sont inférieurs au SMIC mensuel de 1 867,02 € en vigueur depuis juin 2026 : l’application doit retenir le plus élevé du SMIC et du minimum conventionnel.

## Limites

- Ni le texte de l’accord ni celui de l’arrêté n’ont été lus directement : les montants viennent de pages de synthèse concordantes (juristique.org, convention.fr), les dates de l’arrêté (31 juillet 2025, JORF du 7 août 2025) de pages de presse spécialisée. Le numéro de texte et le NOR ne sont pas vérifiés. À recouper avec l’accord sur Légifrance.
- Les pages consultées en 2026 donnent la même grille : aucune revalorisation postérieure au 1er septembre 2025 n’a été trouvée, sans que son absence soit établie.
- La modulation (jusqu’à 42 heures en haute saison), les primes, majorations, la prévoyance et les autres éléments de la convention ne sont pas modélisés.
- Les grilles antérieures au 1er septembre 2025 ne sont pas modélisées : la première version couvre les périodes à partir de cette date.
