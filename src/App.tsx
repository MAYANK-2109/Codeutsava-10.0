/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import LoadingScreen from './components/LoadingScreen';
import MainSite from './components/MainSite';
import CustomCursor from './components/CustomCursor';

export default function App() {
  // Phase:
  //   'loading'       → show only LoadingScreen
  //   'transitioning' → show both: LoadingScreen on top (clouds cover), MainSite mounting below
  //   'done'          → show only MainSite
  const [appPhase, setAppPhase] = useState<'loading' | 'transitioning' | 'done'>('loading');

  return (
    <div className="bg-midnight min-h-screen text-arctic">
      <CustomCursor />

      {/* MainSite is pre-mounted when transition starts so Three.js / video
          can initialise behind the cloud curtain — no pop-in on reveal */}
      {(appPhase === 'transitioning' || appPhase === 'done') && <MainSite />}

      {/* Loading screen sits on top (z-50) until onComplete is called */}
      {appPhase !== 'done' && (
        <LoadingScreen
          onComplete={() => setAppPhase('done')}
          onStartTransition={() => setAppPhase('transitioning')}
        />
      )}
    </div>
  );
}
