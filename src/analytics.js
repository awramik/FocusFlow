const gaMeasurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;
const hotjarId = import.meta.env.VITE_HOTJAR_ID;
const hotjarVersion = Number(import.meta.env.VITE_HOTJAR_VERSION || 6);
const contentsquareUxaSrc = import.meta.env.VITE_CONTENTSQUARE_UXA_SRC;

let initialized = false;
let lastTrackedPath = '';

const appendScript = (id, src) => {
  if (document.getElementById(id)) {
    return;
  }

  const script = document.createElement('script');
  script.id = id;
  script.async = true;
  script.src = src;
  document.head.appendChild(script);
};

const initGoogleAnalytics = () => {
  if (!gaMeasurementId) {
    return;
  }

  appendScript(
    'google-analytics-script',
    `https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`,
  );

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer.push(arguments);
  };

  window.gtag('js', new Date());
  window.gtag('config', gaMeasurementId, { send_page_view: false });
};

const initHotjar = () => {
  if (document.getElementById('hotjar-script')) {
    return;
  }

  if (contentsquareUxaSrc) {
    appendScript('hotjar-script', contentsquareUxaSrc);
    return;
  }

  if (!hotjarId) {
    return;
  }

  window.hj =
    window.hj ||
    function hj() {
      (window.hj.q = window.hj.q || []).push(arguments);
    };

  window._hjSettings = {
    hjid: Number(hotjarId),
    hjsv: hotjarVersion,
  };

  appendScript(
    'hotjar-script',
    `https://static.hotjar.com/c/hotjar-${window._hjSettings.hjid}.js?sv=${window._hjSettings.hjsv}`,
  );
};

export const initAnalytics = () => {
  if (initialized || typeof window === 'undefined') {
    return;
  }

  initialized = true;
  initGoogleAnalytics();
  initHotjar();
};

export const trackPageView = (path) => {
  if (!path || path === lastTrackedPath || typeof window === 'undefined') {
    return;
  }

  lastTrackedPath = path;

  if (gaMeasurementId && typeof window.gtag === 'function') {
    window.gtag('config', gaMeasurementId, {
      page_path: path,
    });
  }

  if ((hotjarId || contentsquareUxaSrc) && typeof window.hj === 'function') {
    window.hj('stateChange', path);
  }
};
