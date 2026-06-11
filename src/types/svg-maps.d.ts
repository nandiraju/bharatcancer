declare module "@svg-maps/india" {
  export interface Location {
    id: string;
    name: string;
    path: string;
  }
  
  export interface SVGMap {
    label: string;
    viewBox: string;
    locations: Location[];
  }

  const map: SVGMap;
  export default map;
}
