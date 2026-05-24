import { useEffect, useState } from 'react';
import { Pedometer } from 'expo-sensors';
import client from '@/services/mqttClient';

const USER_ID = '6a05fd3e2a7cf4be350a8ea1';

export default function usePedometer() {
  const [steps, setSteps] = useState(0);

  useEffect(() => {
    let subscription: any;

    const start = async () => {
      const available = await Pedometer.isAvailableAsync();

      if (!available) {
        console.log('Pedometer not available on this device');
        return;
      }
      if(available)
      {
        console.log("pedo is here");
      }

      subscription = Pedometer.watchStepCount((result) => {
        setSteps(result.steps);

        client.publish(
          `users/${USER_ID}/steps`,
          JSON.stringify({
            userId: USER_ID,
            steps: result.steps,
            date: '2026-05-14'
          })
        );
      });
    };

    start();

    return () => {
      subscription?.remove();
    };
  }, []);

  return steps;
}