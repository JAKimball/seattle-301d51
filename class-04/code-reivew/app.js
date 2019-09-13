'use strict';

let allImages = [];
// const templateRender;

function Image(item){
  this.image_url = item.image_url;
  this.title = item.title;
  this.description = item.description;
  this.keyword = item.keyword;
  this.horns = item.horns;
}

Image.prototype.render = function() {
  const template = $('#photo-template').html();
  const templateRender = Handlebars.compile(template);
  return templateRender(this);
};

let readJson = (page) => {
  // first empty out all the instances of the iamges
  allImages = [];

  // empty out the entrie page
  $('main').empty();

  // fetch the json page that was called
  $.get(`page-${page}.json`, data => {
    
    // then fill the array with new instances from just that page
    data.forEach(item => {
      allImages.push(new Image(item));
    });

    // TODO: sort images by title

    // append each image to the handlebars template in the HTML
    allImages.forEach( image => {
      $('#image-container').append(image.render());
    });

    // populate the dropdown filter
    populateFilter();

  });
};

// takes in two parameters: the array to sort and the property to sort by


const populateFilter = () => {
  let filterKeywords = [];

  // put only unique keywords in the filterKeywords array
  allImages.forEach(image => {
    if (!filterKeywords.includes(image.keyword)) filterKeywords.push(image.keyword);
  });

  // sort teh filterKeywords array
  filterKeywords.sort();

  // create an option dropdown for each keyword and append it to the select
  filterKeywords.forEach(keyword => {
    let optionTag = `<option value="${keyword}">${keyword}</option>`;
    $('select').append(optionTag);
  });
};

const handleFilter = () => {
  $('select').on('change', function() {
    let selected = $(this).val();
    if(selected !== 'default') {
      $('div').hide();
      $(`div.${selected}`).fadeIn();
    }
  });
};

// TODO: need a function that will sort all the images by the attribute that the user clicks on and then render that sorted list to the page
$('form').on('change', sortSelector);

function sortSelector(e) {
  console.log('what is this??', e.target.value);
  sortImages(allImages, e.target.value)
}

function sortImages(arr, sortBy) {
  if (sortBy === 'title') {
      arr.sort((a,b) => a.title < b.title ? -1:1);
  }
  else if (sortBy === 'horns') {
      arr.sort((a,b) => {return a.horns - b.horns});
  };
};

// TODO: need a function that will listen for a click on an li in the header or footer and take the id of that li and use it to render the page number



$(() => {
  $('li').on('click',  function() {
    readJson(this.className);
  })

  readJson(1);
  handleFilter();
});