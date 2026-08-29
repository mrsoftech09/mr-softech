export const statusOf = d => {
  const days = Math.ceil((new Date(d) - Date.now()) / 864e5);
  return days < 0 ? 'EXPIRED' : days <= 30 ? 'EXPIRING_SOON' : 'ACTIVE';
};

export const statusLabel = s =>
  s === 'EXPIRING_SOON' ? 'Expiring soon' : s[0] + s.slice(1).toLowerCase();

export const date = d => {
  if (typeof d === 'string' && !/^\d{4}-\d{1,2}-\d{1,2}/.test(d)) return d;
  const value = new Date(d);
  return Number.isNaN(value.getTime())
    ? String(d ?? '—')
    : new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(value);
};

export const expiryUrgency = d => {
  const days = Math.ceil((new Date(d) - Date.now()) / 864e5);
  return days <= 7
    ? { label: 'Critical', className: 'expiry-critical' }
    : days <= 15
      ? { label: 'Expiring Soon', className: 'expiry-warning' }
      : { label: 'Safe', className: 'expiry-safe' };
};