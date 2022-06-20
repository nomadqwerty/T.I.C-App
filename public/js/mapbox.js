const arr1 = JSON.parse(document.getElementById('map').dataset.locations);

mapboxgl.accessToken =
  'pk.eyJ1IjoiZGF2ZXhtaWtlIiwiYSI6ImNsNGZwMDd4ZTAxejAzZG04c3VzZmIxMnQifQ.6RQXOVRguEJoXWJMDUiFRA';
var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v11',
});

console.log(arr1);
