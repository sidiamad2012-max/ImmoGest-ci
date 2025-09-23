import { toast } from 'sonner@2.0.3';

export const demoNotifications = {
  // Notifications pour les logements
  unitCreated: (unitNumber: string) => {
    toast.success(`Logement ${unitNumber} créé avec succès !`, {
      description: 'Les statistiques de la propriété ont été mises à jour',
      duration: 4000,
    });
  },

  unitUpdated: (unitNumber: string) => {
    toast.success(`Logement ${unitNumber} modifié avec succès !`, {
      description: 'Les modifications sont visibles immédiatement',
      duration: 3000,
    });
  },

  unitDeleted: (unitNumber: string) => {
    toast.success(`Logement ${unitNumber} supprimé`, {
      description: 'Les données ont été mises à jour en temps réel',
      duration: 3000,
    });
  },

  // Notifications pour les locataires
  tenantCreated: (tenantName: string, unitNumber?: string) => {
    const description = unitNumber 
      ? `Assigné au logement ${unitNumber}. Le statut du logement a été mis à jour.`
      : 'Locataire ajouté sans logement assigné';
    
    toast.success(`Locataire ${tenantName} ajouté !`, {
      description,
      duration: 4000,
    });
  },

  tenantAssigned: (tenantName: string, unitNumber: string) => {
    toast.success(`${tenantName} assigné au logement ${unitNumber}`, {
      description: 'Le statut du logement est maintenant "Occupé"',
      duration: 4000,
    });
  },

  tenantRemoved: (tenantName: string, unitNumber?: string) => {
    const description = unitNumber 
      ? `Le logement ${unitNumber} est maintenant disponible`
      : 'Locataire retiré de la base de données';
    
    toast.success(`Locataire ${tenantName} retiré`, {
      description,
      duration: 3000,
    });
  },

  // Notifications pour la maintenance
  maintenanceCreated: (title: string, unitNumber: string) => {
    toast.success('Demande de maintenance créée !', {
      description: `${title} - Logement ${unitNumber}`,
      duration: 4000,
    });
  },

  maintenanceStatusUpdated: (title: string, newStatus: string) => {
    const statusMap = {
      'pending': 'En attente',
      'in-progress': 'En cours',
      'scheduled': 'Planifié',
      'completed': 'Terminé'
    };

    toast.success('Statut de maintenance mis à jour', {
      description: `${title} : ${statusMap[newStatus as keyof typeof statusMap] || newStatus}`,
      duration: 3000,
    });
  },

  // Notifications pour les transactions
  transactionCreated: (type: 'income' | 'expense', amount: number, description: string) => {
    const typeText = type === 'income' ? 'Recette' : 'Dépense';
    const amountText = `${amount.toLocaleString()} FCFA`;
    
    toast.success(`${typeText} enregistrée !`, {
      description: `${amountText} - ${description}`,
      duration: 4000,
    });
  },

  // Notifications générales
  dataUpdated: (entityType: string) => {
    toast.info('Données mises à jour', {
      description: `Les ${entityType} ont été synchronisées`,
      duration: 2000,
    });
  },

  demoMode: () => {
    toast.info('Mode démonstration actif', {
      description: 'Toutes les modifications sont temporaires et se réinitialisent au rechargement',
      duration: 6000,
    });
  },

  realTimeUpdate: (message: string) => {
    toast.success('Mise à jour en temps réel', {
      description: message,
      duration: 2000,
    });
  }
};

// Helper function to show a welcome notification for first-time users
export const showWelcomeNotification = () => {
  setTimeout(() => {
    toast.success('🎉 Bienvenue dans ImmoGest CI !', {
      description: 'Mode démonstration actif - testez toutes les fonctionnalités sans limites',
      duration: 5000,
    });
  }, 1000);
};

// Helper function to show periodic tips
export const showDemoTips = () => {
  const tips = [
    'Ajoutez des transactions pour voir les graphiques se mettre à jour',
    'Créez des demandes de maintenance pour tester le système de suivi',
    'Assignez des locataires aux logements pour voir les statuts changer',
    'Toutes les données sont fonctionnelles et se mettent à jour en temps réel'
  ];

  let tipIndex = 0;
  const showTip = () => {
    toast.info('💡 Astuce démonstration', {
      description: tips[tipIndex],
      duration: 4000,
    });
    tipIndex = (tipIndex + 1) % tips.length;
  };

  // Show first tip after 10 seconds, then every 30 seconds
  setTimeout(showTip, 10000);
  setInterval(showTip, 30000);
};