export const getScrollBottom = (element: HTMLElement) =>
  element.scrollHeight - (element.scrollTop + element.offsetHeight);
