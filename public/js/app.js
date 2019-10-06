'use strict';

//Toggle form show for church or pastor
$('.add-church-form').hide();
$('.add-pastor-form').hide();
$('.add-minutes-form').hide();
$('.add-budget-form').hide();

$('.add-prayer-requests-form').hide();
$('#single-pastor-edit-form').hide();
$('#single-church-edit-form').hide();
$('.add-prayer-update-form').hide();
// $('.line-break').hide();

// TODO: Determine if I want to hide the line-break... Could move where the div is and hide/show it before the toggle it was not affected by the div being toggled. Might solve the delay problem.

$('.update').on('click', function() {
  if ($('.update').hasClass('pastor-update') === true) {
    $('#single-pastor').toggle();
    $('#single-pastor-edit-form').toggle();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } else if ($('.update').hasClass('church-update') === true) {
    $('#single-church').toggle();
    $('#single-church-edit-form').toggle();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
});

$('#cancel-change').on('click', function() {
  $('#single-pastor-edit-form').toggle();
  $('#single-church-edit-form').toggle();
  $('#single-pastor').toggle();
  $('#single-church').toggle();
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

$('.add-update').on('click', function(e) {
  console.log('clicked');
  e.preventDefault();
  let id = $(this).attr('id');
  console.log(id);
  $(`#add-update-${id}`).toggle();

  $('html, body').animate(
    {
      scrollTop: $(`#add-update-${id}`).offset().top - 250
    },
    700
  );
  // $(`#add-update-${id}`).scrollTo({ top: 0, behavior: 'smooth' });
});

// TODO: DRY up repetitive button click handlers!
$('.add-church-button').on('click', function() {
  if ($('.add-pastor-button').hasClass('selected') === true) {
    $('.add-pastor-form').hide();
    $('.add-pastor-button').removeClass('selected');
  } else if ($('.add-minutes-button').hasClass('selected') === true) {
    $('.add-minutes-form').hide();
    $('.add-minutes-button').removeClass('selected');
  } else if ($('.add-budget-button').hasClass('selected') === true) {
    $('.add-budget-form').hide();
    $('.add-budget-button').removeClass('selected');
  } else if ($('.add-prayer-requests-button').hasClass('selected') === true) {
    $('.add-prayer-requests-form').hide();
    $('.add-prayer-requests-button').removeClass('selected');
  }
  $('.add-church-form').slideToggle(700);
  $('.add-church-button').toggleClass('selected');
});

$('.add-pastor-button').on('click', function() {
  if ($('.add-church-button').hasClass('selected') === true) {
    $('.add-church-form').hide();
    $('.add-church-button').removeClass('selected');
  } else if ($('.add-minutes-button').hasClass('selected') === true) {
    $('.add-minutes-form').hide();
    $('.add-minutes-button').removeClass('selected');
  } else if ($('.add-budget-button').hasClass('selected') === true) {
    $('.add-budget-form').hide();
    $('.add-budget-button').removeClass('selected');
  } else if ($('.add-prayer-requests-button').hasClass('selected') === true) {
    $('.add-prayer-requests-form').hide();
    $('.add-prayer-requests-button').removeClass('selected');
  }
  $('.add-pastor-form').slideToggle(700);
  $('.add-pastor-button').toggleClass('selected');
});

$('.add-budget-button').on('click', function() {
  if ($('.add-church-button').hasClass('selected') === true) {
    $('.add-church-form').hide();
    $('.add-church-button').removeClass('selected');
  } else if ($('.add-minutes-button').hasClass('selected') === true) {
    $('.add-minutes-form').hide();
    $('.add-minutes-button').removeClass('selected');
  } else if ($('.add-pastor-button').hasClass('selected') === true) {
    $('.add-pastor-form').hide();
    $('.add-pastor-button').removeClass('selected');
  } else if ($('.add-prayer-requests-button').hasClass('selected') === true) {
    $('.add-prayer-requests-form').hide();
    $('.add-prayer-requests-button').removeClass('selected');
  }
  $('.add-budget-form').slideToggle(700);
  $('.add-budget-button').toggleClass('selected');
});

$('.add-minutes-button').on('click', function() {
  if ($('.add-church-button').hasClass('selected') === true) {
    $('.add-church-form').hide();
    $('.add-church-button').removeClass('selected');
  } else if ($('.add-pastor-button').hasClass('selected') === true) {
    $('.add-pastor-form').hide();
    $('.add-pastor-button').removeClass('selected');
  } else if ($('.add-budget-button').hasClass('selected') === true) {
    $('.add-budget-form').hide();
    $('.add-budget-button').removeClass('selected');
  } else if ($('.add-prayer-requests-button').hasClass('selected') === true) {
    $('.add-prayer-requests-form').hide();
    $('.add-prayer-requests-button').removeClass('selected');
  }
  $('.add-minutes-form').slideToggle(700);
  $('.add-minutes-button').toggleClass('selected');
});

$('.add-prayer-requests-button').on('click', function() {
  if ($('.add-church-button').hasClass('selected') === true) {
    $('.add-church-form').hide();
    $('.add-church-button').removeClass('selected');
  } else if ($('.add-pastor-button').hasClass('selected') === true) {
    $('.add-pastor-form').hide();
    $('.add-pastor-button').removeClass('selected');
  } else if ($('.add-minutes-button').hasClass('selected') === true) {
    $('.add-minutes-form').hide();
    $('.add-minutes-button').removeClass('selected');
  } else if ($('.add-budget-button').hasClass('selected') === true) {
    $('.add-budget-form').hide();
    $('.add-budget-button').removeClass('selected');
  }
  $('.add-prayer-requests-form').slideToggle(700);
  $('.add-prayer-requests-button').toggleClass('selected');
});

//Hamburger Menu
$('.menu').hide();
$('.hamburger').click(function() {
  $('.menu').toggle('slow');
});

//drop down menu animation
$('.dropdown-el').click(function(e) {
  e.preventDefault();
  e.stopPropagation();
  $(this).toggleClass('expanded');
  $('#' + $(e.target).attr('for')).prop('checked', true);
});
$(document).click(function() {
  $('.dropdown-el').removeClass('expanded');
});

// console.log(window.location)

// Add/Remove input fields from the minutes form
$('#add-attendee').click(function(e) {
  e.preventDefault();
  $('#attendee-list').append(
    '<li><input type="text" name="attendees" placeholder="Attendee Name"</li>'
  );
  $('#attendee-list').append(
    '<li><input type="text" name="attendees" placeholder="Attendee Name"</li>'
  );
});

$('.prayer-add').click(function(e) {
  e.preventDefault();
  let id = $(this).attr('id');
  let olId = `#list-${id}`;
  let parentId = $(olId)
    .parent()
    .prop('id');
  $(olId).append(
    `<li><input type="text" name="prayer_requests${parentId}" placeholder="Prayer Request"></li>`
  );
});

$('.add-more').click(function(e) {
  e.preventDefault();
  $('#other-matters-list').append(
    '<li><input type="text" name="other_matters" placeholder="Other Matters" ></li>'
  );
});
