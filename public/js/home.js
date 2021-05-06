"use strict";

$(document).ready(() => {
  console.log('connected');

  $('#submit-button').click(() => {
    // display loading message
    $('.message-div').css({'display': 'block'});

    $('#message-text').text('loading ...');
    $('#message-text').css({
      'background-color': 'white',
      'color': 'black'
    });

    // hide results div
    $('#results-div').css({'display': 'none'});
  });

  // color palettes
  for (let i = 1; i <= 5; i++) {
    const swatches = 10;
    const colorThief = new ColorThief();
    let palette = $(`#palette-${i}`);
    let image = $(`#movie-${i}-poster`)[0];

    try {
      setTimeout(() => {
        let colors = colorThief.getPalette(image, swatches);
        console.log(colors);
        while (palette.firstChild) palette.removeChild(palette.firstChild);
        colors.reduce( (palette,rgb) => {
          let color = `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;        
          let swatch = document.createElement('div');
          swatch.style.setProperty('--color', color);
          swatch.setAttribute('color', color);
          palette.append(swatch);
          return palette;
        }, palette);
  
        // hide poster
        $(`#movie-${i}-poster`).css({'display': 'none'});
      }, 1000);

      setTimeout(() => {
        // show results div
        $('#results-div').css({'display': 'block'});
      }, 1500);
  
    } catch (err) {
      console.log(err);
    }
  }

});