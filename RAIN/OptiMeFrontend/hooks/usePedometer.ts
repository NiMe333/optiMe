import { useEffect, useState } from 'react';
import { Pedometer } from 'expo-sensors';
import client from '@/services/mqttClient';

const USER_ID = '69fd9f14c176d3f352b24d49';

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
            date: '2026-05-09'
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