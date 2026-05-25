type PedometerSyncListener = () => void;

const listeners = new Set<PedometerSyncListener>();

export function subscribePedometerSync(listener: PedometerSyncListener) {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}

export function notifyPedometerSync() {
  listeners.forEach((listener) => {
    listener();
  });
}
