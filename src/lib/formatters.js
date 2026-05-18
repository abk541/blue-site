export const frenchNumberFormatter = new Intl.NumberFormat('fr-FR', {
  maximumFractionDigits: 1,
});

export const frenchIntegerFormatter = new Intl.NumberFormat('fr-FR', {
  maximumFractionDigits: 0,
});

export function parseFrenchNumber(value) {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : '';
  }

  const normalized = String(value)
    .trim()
    .replace(/\s/g, '')
    .replace(',', '.');

  if (normalized === '') {
    return '';
  }

  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : '';
}

export function formatNumber(value, maximumFractionDigits = 0) {
  const numeric = Number(value);

  if (!Number.isFinite(numeric)) {
    return '0';
  }

  return new Intl.NumberFormat('fr-FR', {
    maximumFractionDigits,
  }).format(numeric);
}

export function formatInputNumber(value) {
  const numeric = Number(value);

  if (!Number.isFinite(numeric)) {
    return '';
  }

  return new Intl.NumberFormat('fr-FR', {
    maximumFractionDigits: 2,
  }).format(numeric);
}

export function formatCurrency(value) {
  return `${formatNumber(value, 0)} MAD`;
}
