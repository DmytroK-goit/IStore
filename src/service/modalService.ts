let res: ((value: boolean) => void) | null = null;

export function openModal(): Promise<boolean> {
  return new Promise((resolve) => {
    res = resolve;
    document.dispatchEvent(new CustomEvent('open-payment-modal'));
  });
}

export function closeModal(result: boolean) {
  if (res) {
    res(result);
    res = null;
  }
}
