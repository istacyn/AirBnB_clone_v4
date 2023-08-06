// Function to update the h4 tag inside the div Amenities
function updateAmenities() {
  const myListName = [];
  $('input[type=checkbox]:checked').each(function () {
    myListName.push($(this).attr('data-name'));
  });

  const h4Tag = $('.amenities h4');
  if (myListName.length === 0) {
    h4Tag.html('&nbsp;');
  } else {
    h4Tag.text(myListName.join(', '));
  }
}

// Wait for DOM to be loaded
$(document).ready(function () {
  // Listen for changes on each input checkbox tag
  $('input[type=checkbox]').click(updateAmenities);

  // Request places data from the API
  $.ajax({
    url: 'http://0.0.0.0:5001/api/v1/places_search/',
    type: 'POST',
    contentType: 'application/json',
    data: JSON.stringify({}), // Send an empty dictionary in the body
    dataType: 'json',
    success: function (data) {
      // Loop through the places data and create article tags representing each place
      const placesSection = $('.places');
      data.forEach(function (place) {
        const article = $('<article>');
        const titleBox = $('<div class="title_box">');
        titleBox.append('<h2>' + place.name + '</h2>');
        titleBox.append('<div class="price_by_night">$' + place.price_by_night + '</div>');
        article.append(titleBox);

        const information = $('<div class="information">');
        information.append('<div class="max_guest">' + place.max_guest + ' Guest' + (place.max_guest !== 1 ? 's' : '') + '</div>');
        information.append('<div class="number_rooms">' + place.number_rooms + ' Bedroom' + (place.number_rooms !== 1 ? 's' : '') + '</div>');
        information.append('<div class="number_bathrooms">' + place.number_bathrooms + ' Bathroom' + (place.number_bathrooms !== 1 ? 's' : '') + '</div>');
        article.append(information);

        article.append('<div class="description">' + place.description + '</div>');

        placesSection.append(article);
      });
    },
    error: function (xhr, status) {
      console.log('Error while loading places: ' + status);
    },
  });

  // Check API status
  $.ajax({
    url: 'http://0.0.0.0:5001/api/v1/status/',
    type: 'GET',
    dataType: 'json',
    success: function (json) {
      $('#api_status').addClass('available');
    },
    error: function (xhr, status) {
      console.log('Error checking API status: ' + status);
    },
  });
});
