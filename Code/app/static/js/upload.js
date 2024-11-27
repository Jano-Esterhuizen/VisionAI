function uploadFile() {
    const form = document.getElementById('upload-form');
    const formData = new FormData(form);
    const xhr = new XMLHttpRequest();
  
    xhr.open('POST', '/upload', true);
  
    xhr.upload.onprogress = function(event) {
      if (event.lengthComputable) {
        const percentComplete = (event.loaded / event.total) * 100;
        document.getElementById('progress-container').style.display = 'block';
        document.getElementById('progress-bar').style.width = percentComplete + '%';
        document.getElementById('progress-bar').innerText = Math.round(percentComplete) + '%';
      }
    };
  
    xhr.onload = function() {
      if (xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);
        const downloadLink = document.getElementById('download-link');
        const downloadUrl = document.getElementById('download-url');
        downloadUrl.href = '/download/' + response.filename;
        downloadLink.style.display = 'block';
      } else {
        alert('An error occurred while uploading the file.');
      }
    };
  
    xhr.send(formData);
  }