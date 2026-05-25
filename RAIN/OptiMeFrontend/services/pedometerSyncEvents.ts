export type PedometerSyncPayload = {
  steps: number;
  date: string;
  timestamp: string;
};

type PedometerSyncListener = (payload: PedometerSyncPayload) => void;

const listeners = new Set<PedometerSyncListener>();

export function subscribePedometerSync(listener: PedometerSyncListener) {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}

export function notifyPedometerSync(payload: PedometerSyncPayload) {
  listeners.forEach((listener) => {
    listener(payload);
  });
}
