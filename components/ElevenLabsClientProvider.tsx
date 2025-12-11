'use client';

import { ReactNode } from 'react';

interface ElevenLabsClientProviderProps {
  children: ReactNode;
}

/**
 * Placeholder provider maintained for future ElevenLabs client context integrations.
 * Currently acts as a pass-through to keep compatibility with existing imports.
 */
const ElevenLabsClientProvider = ({ children }: ElevenLabsClientProviderProps) => {
  return <>{children}</>;
};

export default ElevenLabsClientProvider;
