export function showToast(message: string): void {
  if (typeof window === 'undefined') return;

  const toast = document.createElement('div');
  toast.textContent = message;
  toast.className = 'fixed bottom-6 right-6 z-[70] px-4 py-2 rounded-md border border-border bg-bg-surface text-text-primary text-sm shadow-lg opacity-0 translate-y-2 transition-all duration-200';

  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.remove('opacity-0', 'translate-y-2');
    toast.classList.add('opacity-100', 'translate-y-0');
  });

  window.setTimeout(() => {
    toast.classList.remove('opacity-100', 'translate-y-0');
    toast.classList.add('opacity-0', 'translate-y-2');
    window.setTimeout(() => toast.remove(), 200);
  }, 1600);
}
