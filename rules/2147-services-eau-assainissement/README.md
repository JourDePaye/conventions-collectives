# Entreprises des services d'eau et d'assainissement — IDCC 2147

Le fichier [2025.1](2147-services-eau-assainissement.2025.1.publicodes) entre en vigueur le 1er janvier 2025, avec effet rétroactif prévu par l'avenant n° 23 du 10 juin 2025 relatif aux salaires. L'avenant a été étendu par arrêté du 4 septembre 2025, publié au Journal officiel le 10 septembre 2025. Les sources officielles sont citées dans les métadonnées du fichier Publicodes.

La valeur Publicodes est `services eau assainissement` ; toutes les règles sont sous `salarié . convention collective . services eau assainissement`.

## Règles implémentées

- `groupe` reçoit le groupe de classification `I` à `VIII` (défaut : `non renseigné`).
- `grille annuelle` donne les salaires globaux bruts minimaux annuels à temps plein : de 22 862 € (groupe I) à 65 237 € (groupe VIII).
- `salaire minimum annuel conventionnel` est l'endpoint de comparaison principal : le minimum annuel est proratisé selon `salarié . contrat . temps de travail . quotité`.
- `salaire minimum conventionnel` expose uniquement le douzième indicatif du minimum annuel, arrondi au centime ; il ne remplace pas la comparaison annuelle.
- `compensation minimale astreinte` expose le montant conventionnel de 15,36 € par période d'astreinte de 24 heures, hors interventions.
- `groupe hors grille` signale un groupe absent de la grille et retourne un minimum nul pour permettre à l'application de traiter l'anomalie.

## Limites

- L'avenant distingue le salaire global brut annuel et les éléments retenus pour sa comparaison : ce modèle expose les minima et ne détermine pas automatiquement les éléments individuels de rémunération à inclure.
- La compensation d'astreinte est exposée comme montant unitaire ; le nombre de périodes et les heures d'intervention doivent être fournis et traités par l'application de paie.
- Les primes, indemnités de déplacement, frais, prévoyance, santé, formation et AT/MP ne sont pas calculés automatiquement lorsqu'ils ne sont pas quantifiés directement par l'avenant salarial.
- Les grilles antérieures au 1er janvier 2025 ne sont pas modélisées.
