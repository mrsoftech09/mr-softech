export function serviceStatus(expiryDate, now = new Date()) {
  const days = Math.ceil((new Date(expiryDate).getTime() - now.getTime()) / 86400000);
  
  return days < 0 
    ? 'EXPIRED' 
    : days <= 30 
      ? 'EXPIRING_SOON' 
      : 'ACTIVE';
}

export function daysUntil(expiryDate, now = new Date()) {
  return Math.ceil((new Date(expiryDate).getTime() - now.getTime()) / 86400000);
}