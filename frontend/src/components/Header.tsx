import React from 'react';

interface HeaderProps {
  activeMenu: string;
  onMenuChange: (menu: string) => void;
  stxAddress: string | null;
  onConnect: () => void;
  onDisconnect: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeMenu,
  onMenuChange,
  stxAddress,
  onConnect,
  onDisconnect
}) => {
  const menuItems = ["Lend", "Borrow", "Governance", "Features"];
  const shortAddress = stxAddress
    ? `${stxAddress.slice(0, 6)}...${stxAddress.slice(-4)}`
    : "Not connected";

  return (
    <header className="app-header">
      <div className="brand">
        <span className="brand-mark">BTCLEND</span>
        <span className="brand-subtitle">Bitcoin Lending Protocol</span>
      </div>
      <nav className="nav">
        {menuItems.map((item) => (
          <button
            key={item}
            className={item === activeMenu ? "nav-link active" : "nav-link"}
            onClick={() => onMenuChange(item)}
          >
            {item}
          </button>
        ))}
      </nav>
      <div className="header-wallet">
        <span className="wallet-status">{shortAddress}</span>
        <div className="row">
          {!stxAddress && (
            <button className="primary" onClick={onConnect}>
              Connect
            </button>
          )}
          {stxAddress && (
            <button className="ghost" onClick={onDisconnect}>
              Disconnect
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
