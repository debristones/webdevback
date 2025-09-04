/*
FilePond.registerPlugin(FilePondPluginImagePreview);
const form = document.querySelector('form');
const pond = FilePond.create(document.querySelector('.filepond'), {
  allowMultiple: false,
  instantUpload: false,
});

form.addEventListener('submit', e => {
  e.preventDefault(); // stop normal submission

  const formData = new FormData(form);

  if (pond.getFiles().length > 0) {
    formData.append('cover', pond.getFiles()[0].file);
  }

  fetch(form.action, {
    method: 'POST', 
    body: formData
  }).then( async res => {
    if ( res.redirected)window.location.href = res.url;
  }).catch(console.error);
});



FilePond.create(document.querySelector('input[type="file"]'), {
  storeAsFile: true   // 👈 ensures FilePond writes the file back into the input
});

FilePond.parse(document.body)
*/


FilePond.registerPlugin(
  FilePondPluginImagePreview,    
);
FilePond.create(document.querySelector('input[type="file"]'), {
  storeAsFile:true
});
FilePond.parse(document.body)


  

