/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
 import { MarkerClusterer } from '@googlemaps/markerclusterer';

 function initMap(): void {
   const map = new google.maps.Map(
     document.getElementById('map') as HTMLElement,
     {
       zoom: 3,
       center: { lat: 6, lng: 4 },
     }
   );
 
   const infoWindow = new google.maps.InfoWindow({
     content: '',
     disableAutoPan: true,
   });
 
   // Create an array of alphabetical characters used to label the markers
   const labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
 
   // Add some markers to the map.
   fetch('https://verdureclimate.com/api/mapdata')
     .then((res) => res.json())
     .then((data) => {
       const markers = data.description.map((location, i) => {
         const label = labels[i % labels.length];
         const position = {
           lat: Number(location.latitude),
           lng: Number(location.longitude),
         };
         const marker = new google.maps.Marker({
           position,
           label,
         });
 
         const geocoder = new google.maps.Geocoder();
         geocoder
           .geocode({ location: position})
           .then((response) => {
             
             const contentString =
               '<div id="content">' + 
               '<p><b>Status</b> : '+ data.status +'</p>' +
               '<p><b>Message</b> : ' + data.message + '</p>' +
               '<p><b>Location</b> : ' + response.results[0].formatted_address + 
               '</p>' +
               '<p><b>Description</b> : '+ location.name.toString() + '</p>' +
               '</div>';
             // markers can only be keyboard focusable when they have click listeners
             // open info window when marker is clicked
 
             marker.addListener('mouseover', () => {
               infoWindow.setContent(contentString);
               infoWindow.open(map, marker);
             });
           });
 
         marker.addListener('mouseout', () => {
           infoWindow.close();
         });
 
         return marker;
       });
 
       // Add a marker clusterer to manage the markers.
       new MarkerClusterer({ markers, map });
     });
 }
 
 declare global {
   interface Window {
     initMap: () => void;
   }
 }
 window.initMap = initMap;
 export {};
 