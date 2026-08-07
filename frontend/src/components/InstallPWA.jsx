import React, { useEffect, useState } from 'react';
import { Download, X } from 'lucide-react';

const InstallPWA = () => {
  const [installPrompt, setInstallPrompt] = useState(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const installedStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone === true;

    if (installedStandalone) {
      setIsInstalled(true);
      return;
    }

    const handleBeforeInstallPrompt = (event) => {
      event.preventDefault();
      setInstallPrompt(event);
      setShowBanner(true);
    };

    const handleInstalled = () => {
      setIsInstalled(true);
      setShowBanner(false);
      setInstallPrompt(null);
    };

    window.addEventListener(
      'beforeinstallprompt',
      handleBeforeInstallPrompt
    );

    window.addEventListener(
      'appinstalled',
      handleInstalled
    );

    return () => {
      window.removeEventListener(
        'beforeinstallprompt',
        handleBeforeInstallPrompt
      );

      window.removeEventListener(
        'appinstalled',
        handleInstalled
      );
    };
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) {
      return;
    }

    installPrompt.prompt();

    const choiceResult =
      await installPrompt.userChoice;

    if (choiceResult.outcome === 'accepted') {
      setShowBanner(false);
    }

    setInstallPrompt(null);
  };

  if (!showBanner || isInstalled) {
    return null;
  }

  return (
    <div className="fixed bottom-5 left-1/2 z-[9999] w-[calc(100%-2rem)] max-w-md -translate-x-1/2">
      <div className="relative rounded-3xl border border-[#D4A847]/30 bg-white p-5 shadow-2xl">
        <button
          type="button"
          onClick={() => setShowBanner(false)}
          className="absolute right-3 top-3 rounded-full p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
          aria-label="Închide"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-start gap-4 pr-8">
          <img
            src="/logo192.png"
            alt="PanAghia"
            className="h-16 w-16 rounded-2xl object-cover shadow-md"
          />

          <div className="flex-1">
            <p className="text-sm font-medium text-[#B78A32]">
              Aplicația PanAghia
            </p>

            <h3 className="mt-1 text-lg font-bold text-gray-900">
              Instalează PanAghia pe telefon
            </h3>

            <p className="mt-1 text-sm leading-5 text-gray-600">
              Accesează mai rapid meniul, comenzile și locația noastră.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleInstall}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-[#D4A847] px-5 py-3 font-medium text-white transition-all hover:bg-[#C2993D] hover:shadow-lg"
        >
          <Download className="h-5 w-5" />
          Instalează aplicația
        </button>
      </div>
    </div>
  );
};

export default InstallPWA;