import React from 'react';

export const FeaturesPanel: React.FC = () => {
  const features = [
    {
      icon: '🔐',
      title: 'WebAuthn Integration',
      description: 'Passkey-based authentication for secure contract interactions'
    },
    {
      icon: '📊',
      title: 'Price Oracle',
      description: 'Real-time price feeds for accurate collateral valuation'
    },
    {
      icon: '⚡',
      title: 'Instant Liquidation',
      description: 'Automated liquidation mechanism protects lenders'
    },
    {
      icon: '🏛️',
      title: 'DAO Governance',
      description: 'Community-driven protocol parameter management'
    },
    {
      icon: '🔗',
      title: 'Chainhooks Integration',
      description: 'Real-time blockchain event monitoring'
    },
    {
      icon: '💼',
      title: 'WalletConnect',
      description: 'Multi-wallet support via industry standard'
    }
  ];

  return (
    <div className="panel wide">
      <h2>Protocol Features</h2>
      <p className="panel-subtitle">Comprehensive lending infrastructure on Stacks</p>
      <div className="features-grid">
        {features.map((feature, index) => (
          <div key={index} className="feature-card">
            <span className="feature-icon">{feature.icon}</span>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
