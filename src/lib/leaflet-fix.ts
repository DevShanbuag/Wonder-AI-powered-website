import L from "leaflet";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";

// Fix for Leaflet marker icons in Next.js/Vite hybrid environment
const getIconUrl = (icon: any) => {
  if (typeof icon === 'string') return icon;
  return icon?.src || icon;
};

L.Icon.Default.mergeOptions({
  iconUrl: getIconUrl(iconUrl),
  iconRetinaUrl: getIconUrl(iconRetinaUrl),
  shadowUrl: getIconUrl(shadowUrl),
});
