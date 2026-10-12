# Salariés permanents des entreprises de travail temporaire — IDCC 1413

La version [2026.1](1413-travail-temporaire.2026.1.publicodes) prend effet le **1er février 2026**. Elle modélise l’accord du 20 février 2026 relatif aux salaires minima conventionnels des salariés permanents des entreprises de travail temporaire, étendu par arrêté du 4 mai 2026 publié au Journal officiel le 10 mai 2026. Les références officielles sont dans les métadonnées du fichier source.

## Règles

- `niveau` reçoit une classification de `A` à `M`.
- `salaire minimum conventionnel` donne le minimum mensuel brut à temps complet, puis applique une fois la quotité de travail de `modele-social`.
- Les minima vont de 1 836 € au niveau A à 5 666 € au niveau M.
- Pour le niveau F avec `forfait jours = oui`, le minimum est de 2 517 €.
- `niveau hors grille` vaut vrai si le niveau est absent ou manquant.

## Limites

- Le modèle couvre les salariés permanents des entreprises de travail temporaire, pas les salariés intérimaires mis à disposition.
- Les montants sont ceux de l’accord du 20 février 2026, applicable aux périodes d’emploi courant à compter du 1er février 2026. Les évolutions ultérieures ne sont pas incluses dans cette version immuable.
- Le SMIC, les primes, la garantie de rémunération incluant la part variable et les autres dispositions de la convention sont laissés à l’application ou ne sont pas modélisés.
