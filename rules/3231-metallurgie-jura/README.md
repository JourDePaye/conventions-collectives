# Métallurgie du Jura — IDCC 3231 (modèle historique)

Le fichier [2023.1](3231-metallurgie-jura.2023.1.publicodes) modélise le barème des rémunérations effectives garanties de l'avenant du 8 septembre 2023, applicable à compter du 8 septembre 2023 et étendu par arrêté du 13 novembre 2023.

## Règles implémentées

- `coefficient` reçoit les coefficients 140 à 395 du barème Jura 2023.
- `rémunération effective garantie annuelle` expose les minima bruts annuels en `€/an`.
- `salaire minimum annuel conventionnel` conserve la comparaison annuelle et applique la quotité de travail une seule fois.
- `coefficient hors grille` détecte un coefficient absent du barème.

## Audit explicite des rubriques de paie

L'accord salarial a été recherché avec les avenants dédiés et les arrêtés d'extension. L'audit couvre les taux salarié et employeur, assiettes, plafonds et tranches, forfaits, santé, prévoyance, formation professionnelle, AT/MP, primes, indemnités, avantages en nature et congés. Les éléments de rémunération exclus de la garantie annuelle (notamment majorations de nuit/dimanche/jours fériés, travaux pénibles ou dangereux, intéressement, prime d'ancienneté et remboursements de frais) ne sont pas ajoutés au minimum. Aucun taux ou base conventionnelle supplémentaire n'est calculable de manière sûre avec les entrées disponibles ; omission documentée, les régimes de paie applicables restant responsables de ces rubriques.

## Sources officielles

- Avenant du 8 septembre 2023 relatif aux rémunérations effectives garanties — Légifrance, KALITEXT000048437037.
- Avenant du 5 avril 2023 relatif aux rémunérations effectives garanties et rémunérations minimales hiérarchiques — Légifrance, KALIARTI000047734542.
- Arrêté d'extension du 13 novembre 2023 — Journal officiel du 2 décembre 2023.
