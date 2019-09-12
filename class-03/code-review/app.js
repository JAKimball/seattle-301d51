Image.prototype.render = function () {
  // make a div
  let $templateClone = $('<div></div>');

  // fill that div with html of the #photo-template
  $templateClone.html($('#photo-template').html());

  $templateClone.find('h2').text(this.title);
  $templateClone.find('img').attr('src', this.image_url);
  $templateClone.attr('class', this.keyword);
}

const populateFilter = () => {
  let filterKeywords = [];

  // make an array of unique keywords
  allImages.forEach(image => {
    if(!filterKeywords.includes(image.keyword)){
      filterKeywords.push(image.keyword);
    }
  })

  // sort alphabetically
  filterKeywords.sort();

  filterKeywords.forEach(keyword => {
    let optionTag = `<option value="${keyword}">${keyword}</option>`;
    $('select').append(optionTag);
  })
}

const handleFilter = () => {
  $('select').on('change', function() {
    // find the value of hte thing that was changed
    let selected = $(this).val();

    // as long as it waasn't the default
    if(selected !== 'defalut'){
      $('div').hide();
      //fade in only the thing that was clicked on
      $(`div.${selected}`).fadeIn();
    }
  })
}

