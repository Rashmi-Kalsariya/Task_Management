// theme.ts
import { createSystem, defineConfig } from '@chakra-ui/react';

const config = defineConfig({
  theme: {
    // Define your theme tokens here
  },
});

export const system = createSystem(config);
