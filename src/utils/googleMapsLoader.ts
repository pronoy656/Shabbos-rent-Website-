// ─────────────────────────────────────────────
// Google Maps Dynamic Script Loader
// ─────────────────────────────────────────────

let googleMapsPromise: Promise<any> | null = null;

export function loadGoogleMaps(apiKey?: string): Promise<any> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Google Maps can only be loaded in the browser"));
  }

  // If google.maps is already available on window, resolve immediately
  if ((window as any).google?.maps) {
    return Promise.resolve((window as any).google.maps);
  }

  // Return existing singleton promise if already loading
  if (googleMapsPromise) {
    return googleMapsPromise;
  }

  const key = apiKey || process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

  googleMapsPromise = new Promise<any>((resolve, reject) => {
    // Check if script element is already injected
    const existingScript = document.querySelector('script[src*="maps.googleapis.com/maps/api/js"]');
    if (existingScript) {
      if ((window as any).google?.maps) {
        resolve((window as any).google.maps);
        return;
      }
      existingScript.addEventListener("load", () => {
        if ((window as any).google?.maps) {
          resolve((window as any).google.maps);
        } else {
          reject(new Error("Google Maps script loaded but google.maps is undefined"));
        }
      });
      existingScript.addEventListener("error", () => {
        reject(new Error("Failed to load Google Maps script"));
      });
      return;
    }

    const script = document.createElement("script");
    const callbackName = `__googleMapsInitCallback_${Date.now()}`;

    (window as any)[callbackName] = () => {
      delete (window as any)[callbackName];
      if ((window as any).google?.maps) {
        resolve((window as any).google.maps);
      } else {
        reject(new Error("Google Maps loaded but google.maps is undefined"));
      }
    };

    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(key)}&libraries=places,marker,geometry&callback=${callbackName}&loading=async`;
    script.async = true;
    script.defer = true;
    script.onerror = (err) => {
      delete (window as any)[callbackName];
      googleMapsPromise = null;
      reject(new Error(`Failed to load Google Maps script: ${err}`));
    };

    document.head.appendChild(script);
  });

  return googleMapsPromise;
}
