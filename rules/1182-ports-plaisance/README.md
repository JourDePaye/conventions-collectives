# Personnels des ports de plaisance — IDCC 1182

La version `2025.1` modélise l'accord du **22 mai 2025 relatif aux mesures salariales**, étendu par arrêté du 9 octobre 2025. La valeur du point est fixée à **11,88 € à compter du 1er mai 2025**.

## Règles implémentées

- `coefficient` reçoit le coefficient contractuel ;
- `valeur du point` expose le paramètre officiel de 11,88 € ;
- `grille mensuelle` calcule le minimum par coefficient × valeur du point ;
- `salaire minimum conventionnel` prorate le minimum selon la quotité ;
- les coefficients hors de la plage explicitement publiée par la classification (225 à 605) sont signalés.

## Audit explicite des rubriques de paie

Les textes salariaux, de classification, de santé-prévoyance et de prime de transport ont été recherchés, ainsi que leurs arrêtés d'extension.

- **Cotisations salarié/employeur, taux et assiettes** : l'accord santé-prévoyance du 22 mai 2025 fixe 60 % employeur / 40 % salarié pour les cotisations obligatoires de prévoyance des non-cadres ; les cadres ont une participation employeur distincte. Le texte ne justifie pas un taux total générique ici ; seuls les pourcentages de répartition non-cadres sont exposés.
- **Plafonds, tranches et forfaits** : TA/TB sont explicitement rappelées pour la prévoyance ; aucune valeur de plafond ni forfait conventionnel autonome n'est fixée par les textes inspectés.
- **Santé** : l'accord est un texte autonome ; taux total et dispenses restent dépendants du contrat et des conditions légales, sans valeur inventée.
- **Prévoyance** : répartition 60/40 pour les non-cadres ; la participation cadre et l'obligation légale de 1,5 % TA restent distinguées, sans taux total inventé.
- **Formation professionnelle** : aucun taux conventionnel additionnel calculable n'a été identifié dans les textes inspectés ; contribution légale laissée au modèle social.
- **AT/MP** : aucun taux conventionnel ; détermination réglementaire selon l'activité, non calculée.
- **Primes et avantages** : l'accord distinct du 22 mai 2025 relatif à la prime de transport est applicable au plus tard en janvier 2026, avec mise en œuvre anticipée possible au 1er juillet 2025 ; son montant et ses conditions nécessitent des entrées de déplacement qui ne sont pas ajoutées au minimum salarial. Les autres primes, indemnités, avantages en nature et maintien maladie ne sont pas injectés automatiquement.
- **Base de comparaison** : le minimum modélisé est mensuel brut, coefficient × valeur du point, puis proratisé ; aucune assiette générique de comparaison n'est inventée.

## Sources officielles

- Accord du 22 mai 2025 relatif aux mesures salariales, Légifrance : `KALITEXT000052447538` (extension par arrêté du 9 octobre 2025).
- Avenant n° 74 du 9 décembre 2009 relatif aux classifications et à la grille indiciaire, étendu le 5 juillet 2012 : `KALIARTI000025115221`.
- Accord du 22 mai 2025 relatif à la santé-prévoyance : `KALITEXT000052447521`.
- Accord du 22 mai 2025 relatif à la prime de transport, étendu le 9 octobre 2025.

Les taux légaux, le taux total des contrats santé/prévoyance, les AT/MP, la formation légale et les rubriques conditionnelles restent fournis par les entrées appropriées de paie plutôt que par défaut dans ce modèle.
