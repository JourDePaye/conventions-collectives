# Industries textiles — IDCC 18

La convention collective nationale de l’industrie textile du 1er février 1951 (brochure 3106) ne doit pas être confondue avec la convention [1483](../1483-commerce-detail-habillement-textiles/README.md), celle du commerce de détail de l’habillement et des articles textiles. La valeur Publicodes est `industries textiles` ; les règles sont sous `salarié . convention collective . industries textiles`.

Depuis l’accord du 18 juin 2024 de rapprochement avec la convention des textiles artificiels et synthétiques et produits assimilés du 6 juin 1996, la convention a deux barèmes de salaires minima : celui de l’industrie textile et celui du secteur des textiles artificiels et synthétiques, dont les classifications sont maintenues jusqu’au 31 décembre 2026.

## Versions

| Version | Date d’effet | Extension | Contenu |
|---|---|---|---|
| [2026.1](0018-industries-textiles.2026.1.publicodes) | 1er juin 2026 | — | Grille de l’industrie textile de l’accord du 17 juin 2026, sans secteur. Remplacée par 2026.3. |
| [2026.2](0018-industries-textiles.2026.2.publicodes) | 1er janvier 2026 | 17 avril 2026 | Accord du 15 janvier 2026 (KALITEXT000054161832) pour l’industrie textile, accord du 12 janvier 2026 (KALITEXT000053973002) pour le secteur artificiel. |
| [2026.3](0018-industries-textiles.2026.3.publicodes) | 1er juin 2026 | 4 septembre 2026 | Grille de l’industrie textile de 2026.1 et barème du secteur artificiel du 12 janvier 2026. |

L’extension est la date de publication au Journal officiel de l’arrêté d’extension, à partir de laquelle la version lie aussi les employeurs qui n’adhèrent pas à l’organisation signataire (Union des industries textiles).

## Règles implémentées

- `secteur` : `industrie textile` (défaut) ou `textiles artificiels et synthétiques`.
- `niveau` reçoit, pour l’industrie textile, le niveau et l’échelon : `1`, `2.1` à `2.3`, `3.1` à `3.3`, `4.1` à `4.3`, `5.1` à `5.3`, `6.1` à `6.3`, `I.1`, `I.2`, `II`, `III`, `IV` ; pour le secteur artificiel, le coefficient : `210`, `225`, `240`… `450`, `500`, `600`, `700`, `800` (défaut : `non renseigné`).
- `salaire minimum conventionnel . grille` donne le salaire mensuel minimum de la classification dans la grille du secteur :
  - industrie textile au 1er janvier 2026 : de 1 853 € (niveau 1) à 4 911 € (position IV), base de 152,25 heures pour 35 heures par semaine ;
  - industrie textile au 1er juin 2026 : de 1 898 € à 5 029 € ;
  - secteur artificiel au 1er janvier 2026 : de 1 857 € (coefficient 210) à 6 780 € (coefficient 800), base de 152,19 heures.
- `salaire minimum conventionnel` multiplie la grille par `salarié . contrat . temps de travail . quotité` de `modele-social`. Le montant ne doit donc pas être proratisé une seconde fois.
- `niveau hors grille` signale une classification absente de la grille du secteur (un coefficient dans l’industrie textile, un niveau dans le secteur artificiel). La grille retourne alors `0 €/mois` et l’application doit traiter l’anomalie.

## Limites

- **Grille du 1er juin 2026 non vérifiée.** Le texte de l’accord du 17 juin 2026, étendu par arrêté du 24 août 2026 (JORF du 4 septembre 2026, JORFTEXT000054794573), n’est ni dans KALI ni dans les BOCC en ligne (jusqu’au 2026/30). Ses 21 montants viennent de deux pages de synthèse concordantes (juristique.org et salaire-minimum.com) : à vérifier dès la publication du texte.
- **Secteur artificiel après juillet 2026.** L’accord du 15 juillet 2026 sur les salaires minima du secteur, étendu par arrêté publié au JORF du 30 septembre 2026 (JORFTEXT000054914182), n’est pas encore publié : le barème du 12 janvier 2026 reste appliqué.
- **Extension de 2026.2.** La version réunit deux accords étendus à des dates différentes : elle retient la plus tardive (17 avril 2026, accord de l’industrie textile), alors que l’accord du secteur artificiel lie les non-adhérents depuis le 19 mars 2026.
- Les montants mensuels sont calculés par les accords sur 152,25 heures (152,19 pour le secteur artificiel) pour 35 heures par semaine : le minimum est proratisé par la quotité de `modele-social`, sans changement de base horaire.
- Le secteur artificiel a aussi une rémunération minimale annuelle (22 285 € pour 2026) et des rémunérations garanties annuelles par niveau de responsabilité (B à H, de 22 285 € à 37 740 €), vérifiées au 31 décembre : elles ne sont pas modélisées.
- Les grilles antérieures au 1er janvier 2026, la garantie collective au rendement, les primes, la prévoyance et les autres éléments de la convention ne sont pas modélisés.
