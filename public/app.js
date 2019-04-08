// Grab the articles as a json
$.getJSON("/articles", function(data) {
  for (var i = 0; i < data.length; i++) {
    //Dispaly of data on "/" page
    $("#articles").append(`
    <div class='list-group'>
      <ul class='list-group list-group-item-action'>
        <li class='list-group-item list-group-item-action list-group-item-danger'><h3 id="articleTitle" data-id=${data[i]._id}> ${data[i].title}</h3></li>
        <li class='list-group-item list-group-item-action list-group-item-danger'><h5 id="articleLink"><a href=${data[i].link}>${data[i].link}</a></h5></li>
        <li class='list-group-item list-group-item-action list-group-item-danger'><h5 id="articleSummary">${data[i].summary}</h5></li>
        <button id='save' class='btn btn-outline-danger' data-id=${data[i]._id}>Save</button>
      </ul>
      <br>
      <br>
    </div>`);
      
  }
});


// Whenever someone clicks a #saved-heading tag
$(document).on("click", ".saved-heading", function() {
  console.log($(this));
  // Empty the notes from the note section
  $("#notes").empty();
  // Save the id from the p tag
  var thisId = $(this).attr("data-id");

  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId 
  })
    // With that done, add the note information to the page
    .then(function(data) {
      console.log(data);
      // The title of the article
      $("#notes").append("<h2>" + data.title + "</h2>");
      // An input to enter a new title
      $("#notes").append("<input id='titleinput' name='title' >");
      // A textarea to add a new note body
      $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
      // A button to submit a new note, with the id of the article saved to it
      $("#notes").append("<br><button class='btn btn-outline-dark' data-id='" + data._id + "' id='savenote'>Save Note</button>");

      // If there's a note in the article
      if (data.note) {
        // Place the title of the note in the title input
        $("#titleinput").val(data.note.title);
        // Place the body of the note in the body textarea
        $("#bodyinput").val(data.note.body);
      }
    });
});

// When you click the savenote button
$(document).on("click", "#savenote", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      // Value taken from title input
      title: $("#titleinput").val(),
      // Value taken from note textarea
      body: $("#bodyinput").val()
    }
  })
    // With that done
    .then(function(data) {
      // Log the response
      console.log(data);
      // Empty the notes section
      $("#notes").empty();
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
});


$(document).on("click", "#save", function() {
  var thisId = $(this).attr("data-id");
  console.log(thisId);
  var savedArticle = $(this)
    .parents("ul")
    .data();

    $(this)
    .parents("ul")
    .remove();

    savedArticle.saved = true;


  $.ajax({
      method: "POST",
      url: "/articles/" + thisId,
      data: savedArticle,
      saved: true
    })
    // With that done
    .then(function (data) {

      // Log the response
      console.log(data);
      console.log(data._id);
      console.log(data.title);
      console.log(data.link);
      console.log(data.summary);
      $("#saved").append(`
    <div class='list-group'>
      <ul class='list-group list-group-item-action'>
        <li class='list-group-item list-group-item-action list-group-item-danger'><h3 id="articleTitle" data-id=${data._id}> ${data.title}</h3></li>
        <li class='list-group-item list-group-item-action list-group-item-danger'><h5 id="articleLink"><a href=${data.link}>${data.link}</a></h5></li>
        <li class='list-group-item list-group-item-action list-group-item-danger'><h5 id="articleSummary">${data.summary}</h5></li>
        <button id='save' class='btn btn-outline-danger' data-id=${data._id}>Save</button>
      </ul>
      <br>
      <br>
    </div>`);

    });
  });
