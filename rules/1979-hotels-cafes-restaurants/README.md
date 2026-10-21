# Hôtels, cafés, restaurants — IDCC 1979 (HCR)

Le fichier [2024.1](1979-hotels-cafes-restaurants.2024.1.publicodes) entre en vigueur le 1er décembre 2024. Ses métadonnées citent l’avenant salarial n° 33 du 19 juin 2024 et son arrêté d’extension. Les règles ci-dessous complètent l’espace `salarié . convention collective . HCR` déjà présent dans `modele-social` ; elles s’appliquent uniquement lorsque la convention `HCR` est sélectionnée.

## Versions

| Version | Date d'effet | Contenu |
|---|---|---|
| `2024.1` | 1er décembre 2024 | Grille de l'avenant n° 33, ajoutée à la convention `HCR` de modele-social |
| `2024.2` | 1er décembre 2024 | Même grille sous sa propre valeur de convention, `hôtels cafés restaurants`, avec les heures supplémentaires et la prévoyance ; l'extension est déclarée (arrêté du 5 novembre 2024, JORF du 9 novembre 2024) |

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

Les métadonnées de la version `2024.1` mentionnent « un avenant n° 36 du 4 juin 2026 » qui revaloriserait la grille sans être étendu. Au 18 octobre 2026, Légifrance ne publie ni ce texte ni d'arrêté l'étendant : le dernier avenant de salaires publié est l'avenant n° 33 du 19 juin 2024, modélisé ici (l'avenant n° 35 du 27 février 2025 ne porte que sur le salaire des apprentis). Cette mention n'a donc pas pu être vérifiée.
