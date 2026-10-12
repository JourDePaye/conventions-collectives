# Industries de l’habillement — IDCC 247

Le fichier [2026.1](0247-industries-habillement.2026.1.publicodes) entre en vigueur le **1er mars 2026**, date d’application aux salaires de l’avenant S 69 du 3 mars 2026. L’avenant a été étendu par arrêté du 4 mai 2026, publié au JORF le 8 mai 2026. Les sources officielles sont référencées dans les métadonnées du fichier.

## Règles implémentées

- Annexes I (ouvriers), II (employés), III (techniciens et agents de maîtrise) : minima mensuels bruts pour 151,67 heures, avec les paliers d’ancienneté de l’annexe II et III ; proratisation une seule fois par la quotité de `modele-social`.
- Annexe IV (ingénieurs et cadres) : minima annuels bruts 2026, sans conversion implicite en minimum mensuel.
- `niveau hors grille` signale les couples annexe/niveau absents.

## Audit explicite des rubriques de paie

L’avenant S 69 modifie uniquement les rémunérations minimales conventionnelles : il ne crée ni taux salarié/employeur, ni assiette, plafond ou tranche de cotisations, ni forfait, exemption, avantage en nature, prévoyance, santé, formation professionnelle ou taux AT. Le modèle ajoute donc exclusivement les endpoints `salaire minimum conventionnel`, `salaire minimum annuel conventionnel` et leurs entrées de classification ; aucune rubrique de paie héritée de `modele-social` n’est redéfinie. Les tests vérifient l’isolation de ces endpoints hors IDCC 247 et l’absence de collision de règles.

## Limites

- Les primes et éléments de rémunération non mensuels mentionnés par l’avenant ne sont pas intégrés au minimum mensuel.
- La prime d’ancienneté des ouvriers, calculée sur l’indemnité de congés payés, n’est pas une garantie mensuelle et n’est pas modélisée.
- Les garanties annuelles des cadres ne sont pas proratisées dans ce modèle ; l’application doit fournir son propre traitement du temps de travail et du forfait.
- La grille couvre les salaires de mars 2026 et ne remplace pas les versions antérieures.
