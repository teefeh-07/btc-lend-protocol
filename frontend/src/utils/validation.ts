export const isValidAddress = (address: string): boolean => {
  return /^(ST|SP)[A-Z0-9]{38,41}$/.test(address);
};

export const isValidAmount = (amount: string): boolean => {
  const num = parseFloat(amount);
  return !isNaN(num) && num > 0;
};

export const isValidContractName = (name: string): boolean => {
  return /^[a-z][a-z0-9-_]{0,39}$/.test(name);
};
