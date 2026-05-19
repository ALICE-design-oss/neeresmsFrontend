// Tarifs SMS par pays et par fournisseur (basé sur le fichier)
export const pricingService = {
  // Configuration complète des fournisseurs
  providers: {
    hub2: {
      name: 'Hub2',
      priority: 1,
      countries: ['CI', 'SN', 'BF', 'ML', 'TG', 'BJ', 'NE'],
      costPerSms: {
        'CI': 4.2,  // Côte d'Ivoire
        'SN': 4.5,  // Sénégal
        'BF': 4.0,  // Burkina Faso
        'ML': 4.3,  // Mali
        'TG': 4.2,  // Togo
        'BJ': 4.2,  // Bénin
        'NE': 4.5,  // Niger
        'GN': 4.8,  // Guinée
        'CM': 4.5,  // Cameroun
        'GA': 4.8,  // Gabon
        'CG': 4.8,  // Congo
        'TD': 5.0   // Tchad
      },
      sellingPrice: {
        'CI': 9,    // Prix de vente FCFA
        'SN': 10,
        'BF': 8,
        'ML': 9,
        'TG': 9,
        'BJ': 9,
        'NE': 10,
        'GN': 10,
        'CM': 9,
        'GA': 10,
        'CG': 10,
        'TD': 11
      }
    },
    smspartner: {
      name: 'SMSPartner',
      priority: 2,
      countries: ['FR', 'BE', 'CH', 'CA', 'MA', 'TN', 'DZ'],
      costPerSms: {
        'FR': 0.019,   // Euro
        'BE': 0.020,
        'CH': 0.022,
        'CA': 0.025,
        'MA': 0.09,    // MAD
        'TN': 0.10,
        'DZ': 0.11
      },
      sellingPrice: {
        'FR': 0.039,   // Prix de vente Euro
        'BE': 0.040,
        'CH': 0.045,
        'CA': 0.050,
        'MA': 0.20,    // MAD
        'TN': 0.22,
        'DZ': 0.24
      }
    },
    infobip: {
      name: 'Infobip',
      priority: 3,
      countries: ['US', 'GB', 'DE', 'IT', 'ES', 'worldwide'],
      costPerSms: {
        'US': 0.004,   // USD
        'GB': 0.028,
        'DE': 0.025,
        'IT': 0.024,
        'ES': 0.023,
        'worldwide': 0.030
      },
      sellingPrice: {
        'US': 0.009,   // Prix de vente USD
        'GB': 0.058,
        'DE': 0.052,
        'IT': 0.050,
        'ES': 0.048,
        'worldwide': 0.065
      }
    }
  },

  // Conversion des devises (taux indicatifs)
  exchangeRates: {
    'XOF': 1,
    'EUR': 655.957,  // 1 EUR = 655.957 FCFA
    'USD': 600,      // 1 USD ≈ 600 FCFA
    'MAD': 60,       // 1 MAD ≈ 60 FCFA
    'GBP': 760,      // 1 GBP ≈ 760 FCFA
    'CAD': 440       // 1 CAD ≈ 440 FCFA
  },

  // Détection du pays à partir du numéro de téléphone
  detectCountry(phoneNumber) {
    const cleaned = phoneNumber.replace(/[^0-9+]/g, '');
    
    const countryCodes = {
      '+225': 'CI', '+221': 'SN', '+226': 'BF', '+223': 'ML',
      '+228': 'TG', '+229': 'BJ', '+227': 'NE', '+224': 'GN',
      '+237': 'CM', '+241': 'GA', '+242': 'CG', '+235': 'TD',
      '+33': 'FR', '+32': 'BE', '+41': 'CH', '+1': 'CA', '+44': 'GB',
      '+49': 'DE', '+39': 'IT', '+34': 'ES', '+212': 'MA', '+216': 'TN', '+213': 'DZ'
    };
    
    for (const [code, country] of Object.entries(countryCodes)) {
      if (cleaned.startsWith(code)) {
        return country;
      }
    }
    return 'worldwide';
  },

  // Obtenir les prix pour un pays
  getPricingByCountry(countryCode) {
    const result = [];
    
    for (const [providerKey, provider] of Object.entries(this.providers)) {
      if (provider.countries.includes(countryCode) || provider.countries.includes('worldwide')) {
        const cost = provider.costPerSms[countryCode] || provider.costPerSms['worldwide'];
        const selling = provider.sellingPrice[countryCode] || provider.sellingPrice['worldwide'];
        
        if (cost && selling) {
          result.push({
            provider: provider.name,
            providerKey: providerKey,
            cost: cost,
            sellingPrice: selling,
            currency: this.getCurrencyForCountry(countryCode),
            margin: ((selling - cost) / cost * 100).toFixed(1),
            priority: provider.priority
          });
        }
      }
    }
    
    return result.sort((a, b) => a.priority - b.priority);
  },

  // Obtenir la devise pour un pays
  getCurrencyForCountry(countryCode) {
    const currencies = {
      'CI': 'XOF', 'SN': 'XOF', 'BF': 'XOF', 'ML': 'XOF', 'TG': 'XOF', 'BJ': 'XOF', 'NE': 'XOF', 'GN': 'XOF',
      'CM': 'XAF', 'GA': 'XAF', 'CG': 'XAF', 'TD': 'XAF',
      'FR': 'EUR', 'BE': 'EUR', 'CH': 'CHF', 'CA': 'CAD',
      'US': 'USD', 'GB': 'GBP', 'DE': 'EUR', 'IT': 'EUR', 'ES': 'EUR',
      'MA': 'MAD', 'TN': 'MAD', 'DZ': 'DZD'
    };
    return currencies[countryCode] || 'XOF';
  },

  // Obtenir le fournisseur le moins cher
  getCheapestProvider(countryCode) {
    const providers = this.getPricingByCountry(countryCode);
    if (providers.length === 0) return null;
    return providers.reduce((min, p) => p.sellingPrice < min.sellingPrice ? p : min, providers[0]);
  },

  // Calculer le coût total
  calculateCost(recipientNumber, message) {
    const countryCode = this.detectCountry(recipientNumber);
    const providers = this.getPricingByCountry(countryCode);
    const cheapest = this.getCheapestProvider(countryCode);
    
    const messageLength = message.length;
    const smsCount = Math.ceil(messageLength / 160);
    
    let totalCost = 0;
    let totalSelling = 0;
    
    if (cheapest) {
      totalCost = smsCount * cheapest.cost;
      totalSelling = smsCount * cheapest.sellingPrice;
    }
    
    return {
      countryCode: countryCode,
      country: this.getCountryName(countryCode),
      flag: this.getFlag(countryCode),
      currency: this.getCurrencyForCountry(countryCode),
      smsCount: smsCount,
      costPerSms: cheapest?.cost || 0,
      sellingPricePerSms: cheapest?.sellingPrice || 0,
      totalCost: totalCost,
      totalSelling: totalSelling,
      providers: providers,
      cheapestProvider: cheapest?.provider,
      margin: cheapest?.margin
    };
  },

  // Obtenir le nom du pays
  getCountryName(code) {
    const names = {
      'CI': 'Côte d\'Ivoire', 'SN': 'Sénégal', 'BF': 'Burkina Faso', 'ML': 'Mali',
      'TG': 'Togo', 'BJ': 'Bénin', 'NE': 'Niger', 'GN': 'Guinée',
      'CM': 'Cameroun', 'GA': 'Gabon', 'CG': 'Congo', 'TD': 'Tchad',
      'FR': 'France', 'BE': 'Belgique', 'CH': 'Suisse', 'CA': 'Canada',
      'US': 'États-Unis', 'GB': 'Royaume-Uni', 'DE': 'Allemagne', 'IT': 'Italie', 'ES': 'Espagne',
      'MA': 'Maroc', 'TN': 'Tunisie', 'DZ': 'Algérie',
      'worldwide': 'International'
    };
    return names[code] || 'International';
  },

  // Obtenir le drapeau
  getFlag(code) {
    const flags = {
      'CI': '🇨🇮', 'SN': '🇸🇳', 'BF': '🇧🇫', 'ML': '🇲🇱',
      'TG': '🇹🇬', 'BJ': '🇧🇯', 'NE': '🇳🇪', 'GN': '🇬🇳',
      'CM': '🇨🇲', 'GA': '🇬🇦', 'CG': '🇨🇬', 'TD': '🇹🇩',
      'FR': '🇫🇷', 'BE': '🇧🇪', 'CH': '🇨🇭', 'CA': '🇨🇦',
      'US': '🇺🇸', 'GB': '🇬🇧', 'DE': '🇩🇪', 'IT': '🇮🇹', 'ES': '🇪🇸',
      'MA': '🇲🇦', 'TN': '🇹🇳', 'DZ': '🇩🇿'
    };
    return flags[code] || '🌍';
  },

  // Obtenir tous les pays avec leurs tarifs
  getAllPricing() {
    const allCountries = [
      'CI', 'SN', 'BF', 'ML', 'TG', 'BJ', 'NE', 'GN',
      'CM', 'GA', 'CG', 'TD',
      'FR', 'BE', 'CH', 'CA',
      'US', 'GB', 'DE', 'IT', 'ES',
      'MA', 'TN', 'DZ'
    ];
    
    return allCountries.map(code => ({
      code: code,
      country: this.getCountryName(code),
      flag: this.getFlag(code),
      currency: this.getCurrencyForCountry(code),
      providers: this.getPricingByCountry(code),
      cheapestProvider: this.getCheapestProvider(code)
    }));
  },

  // Calculer la marge pour un pays
  getMarginForCountry(countryCode) {
    const cheapest = this.getCheapestProvider(countryCode);
    if (!cheapest) return null;
    return {
      cost: cheapest.cost,
      selling: cheapest.sellingPrice,
      margin: ((cheapest.sellingPrice - cheapest.cost) / cheapest.cost * 100).toFixed(1),
      currency: cheapest.currency
    };
  }
};

export default pricingService;