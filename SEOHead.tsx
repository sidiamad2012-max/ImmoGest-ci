import { useEffect } from 'react';
import { useSupabaseAuth } from '../contexts/SupabaseAuthContext';

interface SEOHeadProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  section?: string;
}

export function SEOHead({ 
  title = "ImmoGest CI - Gestion Immobilière Moderne en Côte d'Ivoire",
  description = "Plateforme complète de gestion immobilière pour propriétaires et locataires en Côte d'Ivoire. Suivi des loyers, maintenance, paiements Mobile Money et plus.",
  image = "/og-image.jpg",
  url = window.location.href,
  type = "website",
  section
}: SEOHeadProps) {
  const { role } = useSupabaseAuth();

  useEffect(() => {
    // Dynamic title based on role and section
    let dynamicTitle = title;
    if (role && section) {
      const roleText = role === 'landlord' ? 'Propriétaire' : 'Locataire';
      const sectionText = getSectionTitle(section);
      dynamicTitle = `${sectionText} - ${roleText} | ImmoGest CI`;
    }

    // Update document title
    document.title = dynamicTitle;

    // Update meta tags
    updateMetaTag('description', description);
    updateMetaTag('keywords', getKeywords(section, role));
    
    // Open Graph tags
    updateMetaTag('og:title', dynamicTitle, 'property');
    updateMetaTag('og:description', description, 'property');
    updateMetaTag('og:image', image, 'property');
    updateMetaTag('og:url', url, 'property');
    updateMetaTag('og:type', type, 'property');
    updateMetaTag('og:site_name', 'ImmoGest CI', 'property');
    updateMetaTag('og:locale', 'fr_CI', 'property');
    
    // Twitter Card
    updateMetaTag('twitter:card', 'summary_large_image', 'name');
    updateMetaTag('twitter:title', dynamicTitle, 'name');
    updateMetaTag('twitter:description', description, 'name');
    updateMetaTag('twitter:image', image, 'name');
    
    // Schema.org JSON-LD
    updateStructuredData(dynamicTitle, description, url, role, section);
    
  }, [title, description, image, url, type, section, role]);

  return null; // This component only handles side effects
}

function updateMetaTag(name: string, content: string, type: 'name' | 'property' = 'name') {
  const attribute = type === 'property' ? 'property' : 'name';
  let meta = document.querySelector(`meta[${attribute}="${name}"]`);
  
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute(attribute, name);
    document.head.appendChild(meta);
  }
  
  meta.setAttribute('content', content);
}

function getSectionTitle(section: string): string {
  const titles: Record<string, string> = {
    // Landlord sections
    'overview': 'Vue d\'ensemble',
    'properties': 'Gestion des Propriétés',
    'units': 'Inventaire des Unités',
    'tenants': 'Gestion des Locataires',
    'maintenance': 'Suivi Maintenance',
    'finances': 'Tableau de Bord Financier',
    'settings': 'Paramètres',
    
    // Tenant sections
    'dashboard': 'Tableau de Bord',
    'payments': 'Paiements et Factures',
    'profile': 'Mon Profil'
  };
  
  return titles[section] || 'ImmoGest CI';
}

function getKeywords(section?: string, role?: string): string {
  const baseKeywords = [
    'gestion immobilière',
    'côte d\'ivoire',
    'abidjan',
    'location',
    'propriétaire',
    'locataire',
    'loyer',
    'maintenance',
    'mobile money',
    'orange money',
    'mtn money',
    'wave',
    'moov money'
  ];

  const sectionKeywords: Record<string, string[]> = {
    'properties': ['propriété', 'bien immobilier', 'investissement'],
    'tenants': ['locataire', 'bail', 'contrat location'],
    'maintenance': ['réparation', 'entretien', 'dépannage'],
    'finances': ['revenus locatifs', 'comptabilité', 'fcfa'],
    'payments': ['paiement loyer', 'facture', 'reçu']
  };

  const roleKeywords: Record<string, string[]> = {
    'landlord': ['propriétaire', 'bailleur', 'investisseur immobilier'],
    'tenant': ['locataire', 'location', 'logement']
  };

  let keywords = [...baseKeywords];
  
  if (section && sectionKeywords[section]) {
    keywords.push(...sectionKeywords[section]);
  }
  
  if (role && roleKeywords[role]) {
    keywords.push(...roleKeywords[role]);
  }

  return keywords.join(', ');
}

function updateStructuredData(title: string, description: string, url: string, role?: string, section?: string) {
  // Remove existing structured data
  const existing = document.querySelector('script[type="application/ld+json"]');
  if (existing) {
    existing.remove();
  }

  // Create new structured data
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "ImmoGest CI",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web",
    "description": description,
    "url": url,
    "author": {
      "@type": "Organization",
      "name": "ImmoGest CI"
    },
    "offers": {
      "@type": "Offer",
      "category": "SaaS",
      "priceCurrency": "XOF",
      "eligibleRegion": {
        "@type": "Country",
        "name": "Côte d'Ivoire"
      }
    },
    "featureList": [
      "Gestion des propriétés immobilières",
      "Suivi des locataires et baux",
      "Gestion de la maintenance",
      "Suivi financier et loyers",
      "Intégration Mobile Money",
      "Interface propriétaire et locataire"
    ],
    "screenshot": url + "/screenshot.jpg",
    "softwareVersion": "1.0.0",
    "inLanguage": "fr-CI",
    "accessibilityFeature": [
      "alternativeText",
      "longDescription",
      "resizeText"
    ],
    "accessibilityControl": [
      "fullKeyboardControl",
      "fullMouseControl",
      "fullTouchControl"
    ]
  };

  // Add role-specific data
  if (role === 'landlord') {
    structuredData.featureList.push("Gestion multi-propriétés", "Rapports financiers détaillés");
  } else if (role === 'tenant') {
    structuredData.featureList.push("Paiement en ligne", "Demandes de maintenance");
  }

  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(structuredData);
  document.head.appendChild(script);
}