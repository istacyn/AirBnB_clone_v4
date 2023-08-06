$(document).ready(function () {
  let amenities = {};
  let locations = [];

  // Listen to changes on each input checkbox tag
  $('input[type=checkbox]').change(function () {
    const locationType = $(this).attr('data-name');
    const locationId = $(this).attr('data-id');

    if ($(this).is(':checked')) {
      // If the checkbox is checked, store the State or City ID in the variable
      if (!(locationType in amenities)) {
        amenities[locationType] = [];
      }
      amenities[locationType].push(locationId);
    } else {
      // If the checkbox is unchecked, remove the State or City ID from the variable
      if (locationType in amenities) {
        amenities[locationType] = amenities[locationType].filter(id => id !== locationId);
      }
    }

    // Update the h4 tag inside the div Locations with the list of States or Cities checked
    locations = [];
    for (const type in amenities) {
      const locationNames = amenities[type].join(', ');
      locations.push(locationNames);
    }
    $('.locations h4').text(locations.join(', '));
  });

  // Event handler for the "Filter" button click
  $('.filters button').click(function (event) {
    event.preventDefault();

    // Create an object with selected amenities, cities, and states, and make the POST request
    const obj = {
      amenities: Object.values(amenities).flat(),
      cities: amenities['cities'] || [],
      states: amenities['states'] || [],
    };
    listPlaces(JSON.stringify(obj));
  });

  // AJAX call to check the API status
  $.ajax({
    url: 'http://0.0.0.0:5001/api/v1/status/',
    type: 'GET',
    dataType: 'json',
    success: function (json) {
      $('#api_status').addClass('available');
    },
    error: function (xhr, status) {
      console.log('error ' + xhr);
    }
  });

  // Initial call to listPlaces function without any amenities specified
  listPlaces();
});

// Function to retrieve and display a list of places based on amenities, cities, and states
function listPlaces(data) {
  $.ajax({
    type: 'POST',
    url: 'http://0.0.0.0:5001/api/v1/places_search',
    dataType: 'json',
    data: data,
    contentType: 'application/json; charset=utf-8',
    success: function (places) {
      // Clear the previous list of places
      $('.places').empty();

      // Loop through the retrieved places and append them to the display
      for (let i = 0; i < places.length; i++) {
        $('.places').append(`
          <article>
            <div class="title_box">
              <h2>${places[i].name}</h2>
              <div class="price_by_night">${places[i].price_by_night}</div>
            </div>
            <div class="information">
              <div class="max_guest">${places[i].max_guest} ${places[i].max_guest > 1 ? 'Guests' : 'Guest'}</div>
              <div class="number_rooms">${places[i].number_rooms} ${places[i].number_rooms > 1 ? 'Bedrooms' : 'Bedroom'}</div>
              <div class="number_bathrooms">${places[i].number_bathrooms} ${places[i].number_bathrooms > 1 ? 'Bathrooms' : 'Bathroom'}</div>
            </div>
            <div class="user"></div>
            <div class="description">${places[i].description}</div>
          </article>
        `);
      }
    },
    error: function (xhr, status) {
      console.log('error ' + status);
    }
  });
}
