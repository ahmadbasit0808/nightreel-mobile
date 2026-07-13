import { useEffect } from 'react';
import * as Updates from 'expo-updates';

export function useOTAUpdate() {
  useEffect(() => {
    if (__DEV__) return;
    (async () => {
      try {
        const update = await Updates.checkForUpdateAsync();
        if (update.isAvailable) {
          await Updates.fetchUpdateAsync();
          await Updates.reloadAsync();
        }
      } catch (e) {
        console.error('OTA update error:', e);
      }
    })();
  }, []);
}
