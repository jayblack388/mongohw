function loadNotes (scraperDivId) {
  let scraperDiv = $(`div[data-id="${scraperDivId}"]`);
  let notes = scraperDiv.find("div.notes");
  notes.empty();
  let writtenNote = scraperDiv.find("div.postedNotes");
  writtenNote.empty();
  writtenNote.append(`<h3>Comments</h3><br /><ul class="noteList"></ul>`)  
  $.ajax({
    method: "GET",
    url: "/headlines/" + scraperDivId
  })
  .then(function(data) {
    data = data[0];
    notes.append("<h3>" + data.title + "</h3>");
    notes.append("<input id='titleinput' name='title' >");
    notes.append("<textarea id='bodyinput' name='body'></textarea>");
    notes.append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");
    data.notes.forEach((note)=>{
      $(".noteList").append(`<li data-id="${note._id}"><button div-id="${scraperDivId}" class="x">X</button><h6>${note.title}</h6><p>${note.body}</p></li>`)
    })
  });
}

$.getJSON("/headlines", function(data) {
  let count = 0;
    for (var i = 0; i < data.length; i++) {
      let loopDiv = $(
       `<div class="scrapedDiv" data-id='${data[i]._id}'>
          <div class="row contentRow">
            <div class="col-12 col-md-6"><a href='${data[i].link}'><img class="img-fluid" src="${data[i].thumbnail}"></a></div>
            <div class="col-12 col-md-6 text-center">
              <a href='${data[i].link}'><h3>${data[i].title}</h3></a><br />
              <p>${data[i].summary}</p>
            </div>
          </div>
        </div><br />`);
      $("#headlines").prepend(loopDiv);
      loopDiv.append(`<div class="row notesRow text-center"><div id="notes-${data[i]._id}" data-id="${data[i]._id}" class="col-12 col-md-6 notes"></div><div class="postedNotes col-12 col-md-6"></div></div>`)


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

$(document).on("click", ".contentRow", function(e) {
  e.preventDefault();
  const thisId = $(this).parent().attr("data-id");
  loadNotes(thisId)
});

$(document).on("click", "#savenote", function(e) {
  e.preventDefault();
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
    console.log(thisId);
    loadNotes(thisId);
  });

  $("#titleinput").val("");
  $("#bodyinput").val("");
});

$(document).on("click", ".x", function(e) {
  e.preventDefault();
  const divId = $(this).attr("div-id");
  console.log(divId)
  const thisId = $(this).parent().attr("data-id")
  $.ajax({
    method: "POST",
    url: "/notes/" + thisId,
  })
  .done(function (result) {
    loadNotes(divId);
  })
})

