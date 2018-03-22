function loadNotes (scraperDivId) {
  let scraperDiv = $(`#accordion-${scraperDivId}`);
  let postedNotes = scraperDiv.find(".postedNotes");
  let noteList = postedNotes.find(".noteList");
  noteList.empty();
  $.ajax({
    method: "GET",
    url: "/headlines/" + scraperDivId
  })
  .then(function(data) {
    data = data[0];
    data.notes.forEach((note)=>{
      noteList.append(`<li data-id="${note._id}"><button div-id="${scraperDivId}" class="x">X</button><h6>${note.title}</h6><p>${note.body}</p></li>`)
    })
  });
}

$(document).ready(function () {
  $.getJSON("/headlines", function(data) {
    let count = 0;
      for (let i = 0; i < data.length; i++) {
        let thumbnail;
        // if (!data[i].thumbnail) {
          thumbnail = "static/assets/images/placeholder.png";
        // } else {
          // thumbnail = data[i].thumbnail;
        // }
        const loopDiv = $(`
          <div id="accordion-${data[i]._id}" class="scrapedDiv" data-id='${data[i]._id}'>
            <div class="card">
              <div class="card-header">
                <a href='${data[i].link}'><h3>${data[i].title}</h3></a>
              </div>
              <div class="row card-body" id="articleBody-${data[i]._id}">
                <div class="col-12 col-md-6">
                    <p>${data[i].summary}</p>
                </div>
                <div class="col-12 col-md-6">
                    <a href='${data[i].link}'><img class="img-fluid" src="${thumbnail}"></a>
                </div>
              </div>
              
              <div class="card-header" id="commentButton-${data[i]._id}">
                <h5 class="mb-0">
                  <button class="btn btn-link" data-toggle="collapse" data-target="#comments-${data[i]._id}" aria-expanded="false" aria-controls="comments-${data[i]._id}">
                    Comments CLICKY
                  </button>
                </h5>
              </div>
          
              <div id="comments-${data[i]._id}" class="collapse" aria-labelledby="commentButton-${data[i]._id}" data-parent="#accordion-${data[i]._id}">
                <div class="card-body">
                  <div class="row notesRow">
                    <div id="notes-${data[i]._id}" data-id="${data[i]._id}" class="col-12 col-md-6 notes">
                      <h3>${data[i].title}</h3>
                      <input id='titleinput' name='title' >
                      <textarea id='bodyinput' name='body'></textarea>
                      <button data-id='${data[i]._id}' id='savenote'>Save Note</button>
                    </div>
                    <div class="postedNotes col-12 col-md-6">
                      <h5>Comments</h5>
                      <ul class="noteList">
                        
                      </ul>
                    </div>
                  </div>              
                </div>
              </div>
            </div>
          </div>
        `);
        $("#headlines").prepend(loopDiv);
        count ++;
      }
    $("#articleCount").text(count + " Articles Scraped")
  });
  $.get("/headlines", function(data) {
    for (let i = 0; i < data.length; i++) {
      loadNotes(data[i]._id);
    }
  })
})

$("#scrapeBtn").on("click", function(e) {
  e.preventDefault();
  const choice = $("#scrapeDD").val();
  $.ajax({
    method: "GET",
    url: "/scrape/" + choice
  }).then(()=>{
    window.location.reload();
  })
})

$(document).on("click", "#savenote", function(e) {
  e.preventDefault();
  const articleId = $(this).attr("data-id");

  $.ajax({
    method: "POST",
    url: "/headlines/" + articleId,
    data: {
      title: $("#titleinput").val(),
      body: $("#bodyinput").val()
    }
  })
  .then(function(data) {
    loadNotes(articleId);
  });

  $("#titleinput").val("");
  $("#bodyinput").val("");
});

$(document).on("click", ".x", function(e) {
  e.preventDefault();
  const articleId = $(this).attr("div-id");
  const noteId = $(this).parent().attr("data-id");
  $.ajax({
    method: "DELETE",
    url: "/notes/" + noteId,
  }).then(function (result) {
    loadNotes(articleId);
  })
})

