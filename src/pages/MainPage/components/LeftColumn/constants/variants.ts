export const variants = {
  enter: (direction: 'back' | 'forward') => ({
    x: direction === 'forward' ? '100%' : '-50%',
    zIndex: direction === 'forward' ? 10 : 5,
    opacity: direction === 'forward' ? 1 : 0.5,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: 'back' | 'forward') => ({
    x: direction === 'forward' ? '-50%' : '100%',
    zIndex: direction === 'forward' ? 5 : 10,
    opacity: direction === 'forward' ? 0.5 : 1,
  }),
};
