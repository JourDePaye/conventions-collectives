# Acteurs du lien social et familial — IDCC 1261

La version [2026.1](1261-acteurs-lien-social-familial.2026.1.publicodes) applique en 2026 le système de classification et de rémunération entré en vigueur le 1er janvier 2024. La valeur Publicodes est `acteurs du lien social et familial`.

La version [2026.9](1261-acteurs-lien-social-familial.2026.9.publicodes), applicable au 1er mai 2026, ajoute le régime conventionnel étendu de complémentaire santé : santé à 1,60 % du PMSS (60 % employeur, 40 % salarié). Les ayants droit, options, dispenses et garanties restent contractuels. Le nouveau régime de prévoyance est documenté dans les sources mais n'est pas calculé automatiquement, car ses catégories, ancienneté et assiettes de garanties nécessitent des entrées de contrat.

La révision [2026.10](1261-acteurs-lien-social-familial.2026.10.publicodes), à la même date et aux mêmes taux, change la forme de la complémentaire santé : ses règles `santé . montant` et `santé . taux employeur` remplacent le montant et la part employeur de modele-social (`santé . montant` et `santé . taux employeur`) plutôt que ses parts employeur et salarié : une application peut y saisir le montant ou la part de l'entreprise (`test/health-insurance-scheme.test.ts`).

Le salaire minimum hiérarchique annuel est la somme du salaire socle de **23 000 €**, des `points de pesée` du poste et des `points d'expérience professionnelle`, à **55 €** par point. Il est payé mensuellement par douzième et proratisé par la quotité de travail.

`points de pesée` est la somme des points au-delà du premier niveau des huit critères classants. La détermination détaillée du poste et des points d'ancienneté ou de compétences demeure une décision de paie documentée ; le modèle reçoit leurs totaux déjà établis. Les valeurs négatives sont invalides.

Les règles couvrent le minimum hiérarchique de branche. Elles n'incluent pas les primes, indemnités, avantages ou les modalités de détermination des huit critères. Les références juridiques sont enregistrées dans les métadonnées de la version.
