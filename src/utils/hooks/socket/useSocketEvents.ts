import { useEffect } from 'react';

export const useSocketEvents = (
  socket: IO.Socket,
  events: Partial<ServerToClientEvents>,
  deps?: React.DependencyList,
  component?: string, // $FIXME (for debug)
) => {
  useEffect(() => {
    const debugEvents = Object.fromEntries(
      Object.entries(events).map(([event, listener]) => [
        event,
        (data) => {
          console.log(`[${component ? `${component}:` : ''}${event}]:`, data);
          listener(data);
        },
      ]),
    );

    Object.entries(debugEvents).forEach(([event, listener]) => {
      socket.on(event as keyof ServerToClientEvents, listener);
    });

    return () => {
      Object.entries(debugEvents).forEach(([event, listener]) => {
        socket.off(event as keyof ServerToClientEvents, listener);
      });
    };
  }, deps);
};
