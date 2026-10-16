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

## Version `2026.2` (1er juin 2026)

Le fichier [2026.2](2121-edition.2026.2.publicodes) reprend la même grille que `2026.1` avec la date d'effet exacte de l'avenant n° 18 du 26 juin 2026 (KALITEXT000054951908) : il entre en vigueur le **1er juin 2026**, avec application rétroactive si l'avenant est mis en œuvre sur la paie de juillet 2026 (article 6). Il a été étendu par arrêté du 7 septembre 2026 (JORF du 19 septembre 2026). La version `2026.1` (1er juillet 2026, avenant daté à tort du 18 juin et arrêté du 24 août dans ses sources) reste inchangée ; sa grille est identique.

Non modélisés : la garantie annuelle (minima mensuels × 13 / 12, article 2.1) et le barème des minima à l'ancienneté de 5, 10 et 15 ans (article 4). Les catégories E4 et C5 figurent au tableau sans montant : elles restent hors grille.
