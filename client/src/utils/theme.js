export const priorityStyles = {
  low: 'bg-secondary-light/20 text-secondary-dark',
  medium: 'bg-accent-light/20 text-accent-dark',
  high: 'bg-status-error/20 text-status-error'
};

export const statusStyles = {
  'todo': 'bg-neutral-light text-dark',
  'in-progress': 'bg-primary-light/20 text-primary-dark',
  'completed': 'bg-tertiary-light/20 text-tertiary-dark'
};

// Button variants
export const buttonVariants = {
  primary: 'bg-primary-light hover:bg-primary-dark text-white',
  secondary: 'bg-secondary hover:bg-secondary-dark text-white',
  tertiary: 'bg-tertiary hover:bg-tertiary-dark text-white',
  accent: 'bg-accent hover:bg-accent-dark text-white',
  neutral: 'bg-neutral hover:bg-neutral-dark text-dark',
  outline: 'bg-white border border-primary text-primary hover:bg-primary-light/10',
  danger: 'bg-status-error hover:bg-red-600 text-white',
};

// Form input focus styles
export const inputFocusStyles = 'focus:outline-none focus:ring-2 focus:ring-primary';