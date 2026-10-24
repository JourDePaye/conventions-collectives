# Hôtels, cafés, restaurants — IDCC 1979 (HCR)

Le fichier [2024.1](1979-hotels-cafes-restaurants.2024.1.publicodes) entre en vigueur le 1er décembre 2024. Ses métadonnées citent l’avenant salarial n° 33 du 19 juin 2024 et son arrêté d’extension. Les règles ci-dessous complètent l’espace `salarié . convention collective . HCR` déjà présent dans `modele-social` ; elles s’appliquent uniquement lorsque la convention `HCR` est sélectionnée.

## Versions

| Version | Date d'effet | Contenu |
|---|---|---|
| `2024.1` | 1er décembre 2024 | Grille de l'avenant n° 33, ajoutée à la convention `HCR` de modele-social |
| `2024.2` | 1er décembre 2024 | Même grille sous sa propre valeur de convention, `hôtels cafés restaurants`, avec les heures supplémentaires et la prévoyance ; l'extension est déclarée (arrêté du 5 novembre 2024, JORF du 9 novembre 2024) |
| `2026.1` | 1er novembre 2026 | Grille de l'avenant n° 36 du 4 juin 2026 (12,31 € en I.1 à 28,68 € en V.3), **provisoire** : reprise du tableau du GHR, signataire, en attendant le texte officiel ; mêmes autres règles que `2024.2` ; extension déclarée (arrêté du 12 octobre 2026, JORF du 15 octobre 2026) |

`2024.2` s'utilise à la place de la convention `HCR` de modele-social, dont elle reprend ou corrige les règles :

- **Heures supplémentaires** (`majoration heures supplémentaires`, avenant n° 2 du 5 février 2007, article 4, [KALITEXT000005670080](https://www.legifrance.gouv.fr/conv_coll/id/KALITEXT000005670080)) : 10 % de la 36e à la 39e heure, 20 % de la 40e à la 43e, 50 % au-delà ; comme modele-social.
- **Prévoyance** (`prévoyance`, avenant n° 1 du 13 juillet 2004, article 18, [KALITEXT000005670064](https://www.legifrance.gouv.fr/conv_coll/id/KALITEXT000005670064), article 18.5 dans sa rédaction de l'avenant n° 2 du 10 mai 2021, [KALITEXT000044201741](https://www.legifrance.gouv.fr/conv_coll/id/KALITEXT000044201741), en vigueur depuis le 1er juillet 2021) : 0,86 % du salaire limité à la tranche A, pour tout le personnel, financés par moitié, soit 0,43 % pour l'employeur et 0,43 % pour le salarié. modele-social appliquait 0,90 % et 0,47 %. Pour les cadres, la part de l'employeur est comprise dans sa cotisation obligatoire de 1,50 % de la tranche A, déjà calculée par modele-social : le modèle ne l'ajoute pas. La répartition interne des garanties (incapacité et invalidité financées aux 4/5 par le salarié) ne change pas les montants et n'est pas modélisée.
- **Avantage en nature repas** : modele-social l'évaluait au minimum garanti, mais sans la valeur du 1er juin 2026 (4,35 €, arrêté du 22 mai 2026). Cette évaluation relève de la réglementation de sécurité sociale, pas de la convention (son article 35.2 y renvoie) : `2024.2` ne la reprend pas, et l'avantage repas suit la règle générale de modele-social.

## Règles de la grille

Dans `2024.1`, ces règles complètent l'espace `salarié . convention collective . HCR` de modele-social ; dans `2024.2`, elles sont sous `salarié . convention collective . hôtels cafés restaurants`.

- `niveau` reçoit un niveau et un échelon au format `I.1` à `V.3` (défaut : `non renseigné`). Les niveaux I à III concernent les employés, IV les agents de maîtrise et V les cadres. L’application détermine la classification effective.
- `taux horaire minimum` expose les 15 minima horaires bruts de la grille, de 12,00 €/heure au niveau `I.1` à 28,12 €/heure au niveau `V.3`. Par exemple, `II.3` donne 13,17 €/heure.
- `salaire minimum conventionnel` multiplie ce taux par `salarié . contrat . temps de travail` de `modele-social` : il suit donc la durée du contrat, hors heures supplémentaires (151,67 heures par mois pour un temps plein).
- `niveau hors grille` repère une classification absente de la grille. Le taux est alors `0 €/heure` ; l’application doit traiter cette anomalie.

Le fichier ajoute les minima à HCR ; les autres règles HCR déjà définies dans `modele-social` restent distinctes. Il ne calcule pas les repas, heures supplémentaires ou autres éléments de rémunération à partir de cette grille. Les références juridiques détaillées figurent dans les métadonnées du fichier Publicodes.

## Sources à vérifier

L'avenant n° 36 du 4 juin 2026 relatif aux salaires est étendu par arrêté du 12 octobre 2026 (JORF du 15 octobre 2026, [JORFTEXT000054983870](https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000054983870)), qui renvoie au BOCC n° 2026/36. Au 22 octobre 2026, ce bulletin n'est pas en ligne (le dernier est le n° 2026/30) et l'avenant n'est pas dans KALI. Le GHR et l'UMIH, signataires, indiquent une application au 1er novembre 2026, premier jour du mois civil suivant l'extension. La version `2026.1` reprend les minima du [tableau du GHR](https://www.ghr.fr/social/actualites/salaires-minimas-dans-la-branche-hcr-extension-de-l-avenant-no-36) (bornes concordantes avec l'UMIH) : à recouper avec le texte officiel dès sa parution, notamment son application dans les DROM, que l'avenant n° 33 prévoyait. L'avenant n° 35 du 27 février 2025 ne porte que sur le salaire des apprentis ; l'avenant n° 37 du 4 juin 2026 a fait l'objet d'un avis d'extension (JORF du 29 septembre 2026) qui n'en donne pas l'objet.

## Congés payés

Les révisions [2024.3](1979-hotels-cafes-restaurants.2024.3.publicodes) et [2026.2](1979-hotels-cafes-restaurants.2026.2.publicodes), aux mêmes dates que 2024.2 et 2026.1, ajoutent `congés payés . jours supplémentaires`, les 6 jours ouvrables de congés conventionnels par année de référence de l'article 11 de l'avenant n° 1 du 13 juillet 2004, quand le `congé légal` acquis atteint un mois de travail (2,5 jours). L'application les proratise par le congé légal, les réserve aux adhérents d'une organisation signataire (l'arrêté d'extension du 30 décembre 2004 a été annulé sur ce point par le Conseil d'État le 18 octobre 2006) et paie ceux qui ne sont pas pris à l'issue de leur période ; ils n'ouvrent pas droit au fractionnement.

## Maintien de salaire

La révision 2024.4 et 2026.3 ajoute le maintien de salaire conventionnel (article 29.2) sous `maintien de salaire`, lu sur Légifrance le 24 octobre 2026 : les durées, taux, carences et modalités sont dans les sources de la version et dans `test/salary-maintenance.test.ts`. L’interface est décrite dans le README du package. La maternité relève de la loi (article 28).
