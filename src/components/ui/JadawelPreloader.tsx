'use client';

import React from 'react';
import { JadawelIntro } from './JadawelIntro';

export const JadawelPreloader: React.FC<{ onComplete?: () => void }> = ({ onComplete }) => {
  return <JadawelIntro onComplete={onComplete} />;
};

export default JadawelPreloader;
