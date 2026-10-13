# Industries de la maroquinerie — IDCC 2528

La version `2026.1` modélise l'accord du **18 février 2026** relatif aux salaires minima du secteur maroquinerie–ganterie de peau, applicable au **1er janvier 2026** et étendu par arrêté du 4 mai 2026 publié au Journal officiel du 8 mai 2026.

## Périmètre modélisé

- grille mensuelle de la maroquinerie, articles de voyage, chasse-sellerie, gainerie et bracelets en cuir, pour les catégories ouvrier, employé, technicien/agent de maîtrise (TAM) et cadre ;
- classifications saisies sous la forme `catégorie niveau` (par exemple `TAM III` ou `cadre IV`) ; les échelons sont définis dans l'entreprise et ne modifient pas le minimum ;
- proratisation selon `salarié . contrat . temps de travail . quotité` ;
- détection des classifications hors grille.

Les grilles distinctes de la ganterie de peau, de la tannerie-mégisserie et de la cordonnerie multiservice ne sont pas modélisées dans cette version. Les primes, frais de santé, prévoyance, formation, AT/MP, forfaits et exonérations ne sont pas calculés automatiquement : l'accord salarial ne fournit pas de règle générique supplémentaire nécessaire aux endpoints standards de paie.

## Sources officielles

- [Accord du 18 février 2026 relatif aux salaires minima au 1er janvier 2026 (secteur maroquinerie, ganterie de peau), KALITEXT000054262272](https://www.legifrance.gouv.fr/conv_coll/id/KALITEXT000054262272?idConteneur=KALICONT000005635109).
- [Arrêté du 4 mai 2026 portant extension de l'accord, JORFTEXT000051560057](https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000051560057).
- [Convention collective nationale des industries de la maroquinerie, IDCC 2528, KALICONT000005635109](https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635109).

Les valeurs sont des minima mensuels bruts pour la durée légale mensuelle du travail. Elles ne préjugent pas des règles individuelles plus favorables, du SMIC ou des éléments de rémunération non modélisés.
