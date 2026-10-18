# Hôtels, cafés, restaurants — IDCC 1979 (HCR)

Le fichier [2024.1](1979-hotels-cafes-restaurants.2024.1.publicodes) entre en vigueur le 1er décembre 2024. Ses métadonnées citent l’avenant salarial n° 33 du 19 juin 2024 et son arrêté d’extension. Les règles ci-dessous complètent l’espace `salarié . convention collective . HCR` déjà présent dans `modele-social` ; elles s’appliquent uniquement lorsque la convention `HCR` est sélectionnée.

## Règles implémentées

- `niveau` reçoit un niveau et un échelon au format `I.1` à `V.3` (défaut : `non renseigné`). Les niveaux I à III concernent les employés, IV les agents de maîtrise et V les cadres. L’application détermine la classification effective.
- `taux horaire minimum` expose les 15 minima horaires bruts de la grille, de 12,00 €/heure au niveau `I.1` à 28,12 €/heure au niveau `V.3`. Par exemple, `II.3` donne 13,17 €/heure.
- `salaire minimum conventionnel` multiplie ce taux par `salarié . contrat . temps de travail` de `modele-social` : il suit donc la durée du contrat, hors heures supplémentaires (151,67 heures par mois pour un temps plein).
- `niveau hors grille` repère une classification absente de la grille. Le taux est alors `0 €/heure` ; l’application doit traiter cette anomalie.

Le fichier ajoute les minima à HCR ; les autres règles HCR déjà définies dans `modele-social` restent distinctes. Il ne calcule pas les repas, heures supplémentaires ou autres éléments de rémunération à partir de cette grille. Les références juridiques détaillées figurent dans les métadonnées du fichier Publicodes.

## Sources à vérifier

Les métadonnées de la version `2024.1` mentionnent « un avenant n° 36 du 4 juin 2026 » qui revaloriserait la grille sans être étendu. Au 18 octobre 2026, Légifrance ne publie ni ce texte ni d'arrêté l'étendant : le dernier avenant de salaires publié est l'avenant n° 33 du 19 juin 2024, modélisé ici (l'avenant n° 35 du 27 février 2025 ne porte que sur le salaire des apprentis). Cette mention n'a donc pas pu être vérifiée.
