(function() {
  const serverUrl = 'http://127.0.0.1:3000';

  //
  // TODO: build the swim command fetcher here
  //
  // write an AJAX request for a GET request connecting client and server
  // wrap the request with setInterval to periodically request a random swim command
  // on success -> SwimTeam.move('swim command-response from GET request')
  console.log("hey")


  setInterval(() => {$.ajax({
    url: serverUrl,
    type: 'GET',
    contentType: "tex",
    //dataType: 'json',
    //data:
    success: (data) => {SwimTeam.move(data)},
    error: function(message) {
      console.log("error:", message);
    },
  })}, 3000);

  /////////////////////////////////////////////////////////////////////
  // The ajax file uplaoder is provided for your convenience!
  // Note: remember to fix the URL below.
  /////////////////////////////////////////////////////////////////////

  const ajaxFileUplaod = file => {
    var formData = new FormData();
    formData.append('file', file);
    $.ajax({
      type: 'POST',
      data: formData,
      url: 'FILL_ME_IN',
      cache: false,
      contentType: false,
      processData: false,
      success: () => {
        // reload the page
        window.location = window.location.href;
      }
    });
  };

  $('form').on('submit', function(e) {
    e.preventDefault();

    var form = $('form .file')[0];
    if (form.files.length === 0) {
      console.log('No file selected!');
      return;
    }

    var file = form.files[0];
    if (file.type !== 'image/jpeg') {
      console.log('Not a jpg file!');
      return;
    }

    ajaxFileUplaod(file);
  });
})();
