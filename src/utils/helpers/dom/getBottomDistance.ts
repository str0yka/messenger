export const getBottomDistance = (element: HTMLElement) =>
  element.scrollHeight - (element.scrollTop + element.offsetHeight);
