import { ALL_FIELD_NAMES, STEP_FIELD_NAMES } from './config';

function isProjectNameValid(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function isNumericValid(value) {
  if (value === '' || value === null || value === undefined) {
    return false;
  }

  const numeric = Number(value);
  return Number.isFinite(numeric) && numeric >= 0;
}

export function validateField(name, value) {
  if (name === 'project_name') {
    return isProjectNameValid(value) ? '' : 'Champ requis.';
  }

  return isNumericValid(value) ? '' : 'Saisissez une valeur positive.';
}

export function buildErrors(form) {
  return Object.fromEntries(
    ALL_FIELD_NAMES.map((name) => [name, validateField(name, form[name])]),
  );
}

export function isStepValid(stepIndex, errors) {
  return STEP_FIELD_NAMES[stepIndex].every((name) => !errors[name]);
}

export function getCompletionPercent(form) {
  const completed = ALL_FIELD_NAMES.filter((name) => !validateField(name, form[name])).length;

  return Math.round((completed / ALL_FIELD_NAMES.length) * 100);
}

export function touchStep(stepIndex) {
  return Object.fromEntries(STEP_FIELD_NAMES[stepIndex].map((name) => [name, true]));
}
