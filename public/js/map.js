 console.log(mapToken)
  mapboxgl.accessToken = mapToken;
  const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v12',
    center: [77.209,28.6139], // [lng, lat]
    zoom: 9
  });