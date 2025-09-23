# Guide d'Installation Supabase - ImmoGest CI

## Étapes d'Installation

### 1. Configuration de la Base de Données

1. **Accédez à votre projet Supabase** : https://tyldyultokmmowhjokvh.supabase.co
2. **Allez dans l'éditeur SQL** (icône SQL dans la barre latérale)
3. **Copiez et exécutez le script** contenu dans le fichier `SUPABASE_SCHEMA.sql`
   - Ce script créera toutes les tables nécessaires
   - Il ajoutera des données d'exemple pour tester l'application
   - Il configurera les triggers et les politiques de sécurité

### 2. Vérification de l'Installation

Après avoir exécuté le script SQL :

1. **Vérifiez que les tables ont été créées** :
   - Allez dans l'onglet "Table Editor"
   - Vous devriez voir 5 tables : `properties`, `units`, `tenants`, `maintenance_requests`, `transactions`

2. **Testez la connexion dans l'application** :
   - Allez dans le mode Propriétaire → Paramètres (ou mode Locataire → Tableau de bord)
   - Cliquez sur "Tester Connexion"
   - Vous devriez voir "Connexion Supabase réussie!"

### 3. Configuration des Politiques RLS (Optionnel)

Le script inclut des politiques RLS (Row Level Security) basiques qui permettent l'accès complet aux données. Pour une application en production, vous voudrez peut-être :

1. **Personnaliser les politiques** selon vos besoins de sécurité
2. **Ajouter l'authentification utilisateur** avec Supabase Auth
3. **Restreindre l'accès** par propriétaire/locataire

### 4. Fonctionnalités Disponibles

Une fois Supabase configuré, votre application ImmoGest CI disposera de :

✅ **Persistance des données** - Toutes les données sont sauvegardées en base
✅ **Opérations CRUD** - Créer, lire, mettre à jour, supprimer les données
✅ **Synchronisation temps réel** - Données partagées entre sessions
✅ **Sauvegarde automatique** - Pas de perte de données lors du rechargement
✅ **Gestion des relations** - Liens entre propriétés, logements, locataires, etc.

### 5. Données d'Exemple

Le script inclut des données d'exemple pour :
- 1 propriété (Résidence Les Palmiers)
- 5 logements avec différents statuts
- 3 locataires 
- 4 demandes de maintenance
- 4 transactions financières

### 6. Fallback Automatique

L'application est conçue avec un fallback automatique :
- Si Supabase est disponible → utilise la base de données
- Si problème de connexion → utilise les données mock en local
- Transition transparente pour l'utilisateur

### 7. Surveillance et Maintenance

Votre projet Supabase dispose de :
- **Dashboard** pour surveiller l'utilisation
- **Logs** pour diagnostiquer les problèmes
- **Métriques** de performance
- **Sauvegardes automatiques**

### 8. URL et Clés

Votre configuration actuelle :
- **URL du projet** : https://tyldyultokmmowhjokvh.supabase.co
- **Clé anonyme** : Déjà configurée dans l'application
- **Région** : Automatiquement optimisée

## Support et Troubleshooting

### Problèmes Courants

1. **Erreur "relation does not exist"** :
   - Vérifiez que le script SQL a été exécuté complètement
   - Assurez-vous d'être dans le bon projet Supabase

2. **Problème de permissions** :
   - Les politiques RLS sont configurées pour permettre l'accès complet
   - Vérifiez dans l'onglet "Authentication" → "Policies"

3. **Connexion qui échoue** :
   - Vérifiez l'URL et la clé dans la configuration
   - Testez depuis l'éditeur SQL de Supabase

### Contact

Pour toute assistance supplémentaire :
- Documentation Supabase : https://supabase.com/docs
- Dashboard de votre projet : https://supabase.com/dashboard/project/tyldyultokmmowhjokvh

---

**Note** : Une fois l'installation terminée, vous pouvez supprimer les données d'exemple si vous le souhaitez et commencer à saisir vos vraies données de gestion immobilière.