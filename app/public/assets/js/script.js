$.getJSON("/headlines", function(data) {
  let count = 0;
    for (var i = 0; i < data.length; i++) {
      $("#headlines").prepend(
       `<div class="scrapedDiv" data-id='${data[i]._id}'>
          <div class="row">
            <div class="col-12 col-md-6"><img class="img-fluid" src="${data[i].thumbnail}"></div>
            <div class="col-12 col-md-6 text-center">
              <a href='${data[i].link}'><h3>${data[i].title}</h3></a><br />
              <p>${data[i].summary}</p>
            </div>
          </div>
        </div><br />`);

      // $("#headlines").prepend(`<div class="scrapedDiv" data-id='${data[i]._id}'><a href='${data[i].link}'>${data[i].title}</a><br /><br /><p>${data[i].summary}</p></div><br />`);
      count ++;
    }
  $("#articleCount").text(count)
});

$("#scrapeBtn").on("click", function(e) {
  e.preventDefault();
  let choice = $("#scrapeDD").val();
  $.ajax({
    method: "GET",
    url: "/scrape/" + choice
  }).then(()=>{
    window.location.reload();
  })
})
  
$(document).on("click", "div.scrapedDiv", function() {
  $("#notes").empty();
  var thisId = $(this).attr("data-id");
  $.ajax({
    method: "GET",
    url: "/headlines/" + thisId
  })
    .then(function(data) {
      data = data[0];
      $("#notes").append("<h3>" + data.title + "</h3>");
      $("#notes").append("<input id='titleinput' name='title' >");
      $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
      $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");
    });
});

$(document).on("click", "#savenote", function() {
  var thisId = $(this).attr("data-id");

  $.ajax({
    method: "POST",
    url: "/headlines/" + thisId,
    data: {
      title: $("#titleinput").val(),
      body: $("#bodyinput").val()
    }
  })
    .then(function(data) {
      $("#notes").empty();
    });

  $("#titleinput").val("");
  $("#bodyinput").val("");
});
