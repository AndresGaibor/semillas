export function esIOS(): boolean {
  if (typeof window === "undefined" || !window.navigator) {
    return false;
  }
  return /iphone|ipad|ipod/i.test(window.navigator.userAgent);
}

export function esSafariIOS(): boolean {
  if (!esIOS()) {
    return false;
  }
  const ua = window.navigator.userAgent;
  // Chrome/CriOS and Firefox/FxiOS on iOS are not Safari
  return /safari/i.test(ua) && !/crios/i.test(ua) && !/fxios/i.test(ua);
}

export function estaInstaladaComoPWA(): boolean {
  if (typeof window === "undefined") {
    return false;
  }
  const standalone = window.matchMedia("(display-mode: standalone)").matches;
  const fullscreen = window.matchMedia("(display-mode: fullscreen)").matches;
  const iosStandalone = (window.navigator as any).standalone === true;

  return standalone || fullscreen || iosStandalone;
}
