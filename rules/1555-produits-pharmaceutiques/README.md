# Produits pharmaceutiques — IDCC 1555

La version `2026.1` modélise l’accord du 28 janvier 2026 relatif aux rémunérations minimales conventionnelles au 1er mars 2026. L’accord distingue les rémunérations minimales mensuelles garanties (RMMG) des niveaux I.1 à II.7 et les rémunérations annuelles garanties (RAG) des niveaux III.1 à III.10.

La valeur Publicodes est `produits pharmaceutiques` et les règles sont sous `salarié . convention collective . produits pharmaceutiques`.

## Périmètre juridique

- Du **1er mars 2026** au **7 mai 2026 inclus**, le modèle accepte l'accord pour un employeur dont `adhérent d'une organisation signataire` = oui.
- À compter du **8 mai 2026**, date de publication de l'arrêté d'extension au Journal officiel, le modèle accepte tous les employeurs, adhérents ou non.
- Aucune date n'est supposée (`date de calcul` vaut 1900 par défaut) et `adhérent d'une organisation signataire` vaut non par défaut : sans valeurs explicites, le calcul reste inapplicable.
- Les apprentis, contrats de professionnalisation, classifications individuelles et éléments de rémunération à comparer ne sont pas déduits par ce modèle.

## Règles implémentées

- `niveau` reçoit le niveau de classification fourni par l'application.
- `salaire minimum conventionnel` fournit les 13 RMMG mensuelles des niveaux I.1 à II.7 et applique une seule fois la quotité du contrat.
- `salaire minimum annuel conventionnel` fournit les 10 RAG annuelles des niveaux III.1 à III.10, sans conversion mensuelle.
- Les niveaux hors grille et les périodes ou champs juridiques non couverts rendent les deux endpoints inapplicables.

## Sources officielles

- Accord du 28 janvier 2026 relatif aux rémunérations minimales conventionnelles, texte KALI `KALITEXT000054262136`.
- Arrêté d'extension du 28 avril 2026, publié au Journal officiel le 8 mai 2026, texte `JORFTEXT000054048732`.

## Limites

Le modèle ne compare pas les éléments de rémunération effectivement versés avec les RMMG ou RAG : primes, ancienneté, treizième mois, avantages, exclusions et règles de proratisation spécifiques doivent être traités par l'application consommatrice. Les versions antérieures ne sont pas modélisées.
