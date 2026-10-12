# Édition — IDCC 2121

Le fichier [2026.1](2121-edition.2026.1.publicodes) entre en vigueur le 1er juillet 2026. Il modélise l'avenant n° 18 du 18 juin 2026 relatif aux salaires minima conventionnels, étendu par arrêté du 24 août 2026 publié au Journal officiel. Les textes officiels ont été consultés dans les bases Légifrance/JORF pour la convention collective nationale de l'édition (brochure 3076).

La valeur Publicodes est `édition` ; les règles sont sous `salarié . convention collective . édition`.

## Règles implémentées

- `niveau` reçoit les catégories E5 à E9 (employés), AM/T 1 à AM/T 4 (agents de maîtrise et techniciens), puis Cl A, Cl B, C2A, C2 B, C3A, C3 B et C4 (cadres).
- `salaire minimum conventionnel . grille` donne les minima mensuels à temps complet, de 1 868 € (`E5`) à 3 847 € (`C4`).
- `salaire minimum conventionnel` applique une seule fois la quotité de travail de `modele-social`.
- `niveau hors grille` signale une catégorie absente et le minimum vaut alors 0 €/mois ; l'application doit traiter l'anomalie.

## Limites

- Seuls les minima mensuels de l'avenant n° 18 sont modélisés. Les primes, droits d'auteur, indemnités, classifications détaillées, dispositions relatives aux cadres dirigeants et autres avantages conventionnels ne le sont pas.
- L'arrêté d'extension réserve l'application du SMIC : l'application de paie doit retenir le minimum légal lorsqu'il est supérieur au minimum conventionnel.
- Les catégories non présentes dans le tableau de l'avenant restent hors grille plutôt que de recevoir une valeur extrapolée.
