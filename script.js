


var gImageURL = "";
var gB64image = "";
var gUIState = "start";
var gPyodide = null;

const downloadButton = document.getElementById('download-button');
const nextButton = document.getElementById('next-button');
const hideButton = document.getElementById('hide-button');
const hide2Button = document.getElementById('hide2-button');
const extractButton = document.getElementById('extract-button');
const extract2Button = document.getElementById('extract2-button');
const restartButton = document.getElementById('restart-button');
const backButton = document.getElementById('back-button');
const message = document.getElementById('message');
const info = document.getElementById('info');
const log = document.getElementById('log');
const method = document.getElementById('method');


function hideElement(elementId) {    
   // {{{
   const element = document.getElementById(elementId);
   if (element) {
      element.style.display = 'none';
   }
   // }}}
}

function showElement(elementId, display='block') {
   // {{{
   const element = document.getElementById(elementId);
   if (element) {
      element.style.display = display;
   }
   // }}}
}

function disableElement(elementId) {
   // {{{
   document.getElementById(elementId).disabled = true;
   // }}}
}

function enableElement(elementId) {
   // {{{
   document.getElementById(elementId).disabled = false;
   // }}}
}

function drawImageOnCanvas(imageSrc, canvasId) {
   // {{{
   const canvas = document.getElementById(canvasId);
   if (!canvas) {
      console.error(`No se encontró el canvas con id: ${canvasId}`);
      return;
   }
   const ctx = canvas.getContext('2d');

   const image = new Image();
   image.src = imageSrc;

   image.onload = function() {
      canvas.width = image.width;
      canvas.height = image.height;

      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
   };

   image.onerror = function() {
      console.error(`No se pudo cargar la imagen: ${imageSrc}`);
   };
   // }}}
}

function imageToURL(src, callback, outputFormat){
   // {{{
   var img = new Image();
   img.crossOrigin = 'Anonymous';
   img.onload = function() {
      var canvas = document.getElementById("cover-image");
      var ctx = canvas.getContext('2d');
      var dataURL;
      canvas.height = this.naturalHeight;
      canvas.width = this.naturalWidth;
      ctx.drawImage(this, 0, 0);
      dataURL = canvas.toDataURL(outputFormat);
      callback(dataURL);
   };
   img.src = src;
   // }}}
}

function downloadBase64Image(base64Image, filename){
   // {{{
   const link = document.createElement('a');
   link.href = base64Image;
   link.download = filename;
   document.body.appendChild(link);
   link.click();
   document.body.removeChild(link);
   // }}}
}

function fileUpload(e) {
   // {{{
   var file = e.target.files[0];
   if (!file) {
      return;
   }
   if (!file.type.startsWith('image/')) {
      return;
   }
   var reader = new FileReader();
   reader.onload = function(e) {
      imageToURL(e.target.result, function(iurl){
         gImageURL = iurl;
      });
   };
   reader.readAsDataURL(file);

   if(gUIState=='hide-step-1')
      setUI('hide-step-2');
   else
      setUI('extract-step-2');
   // }}}
}

function setUI(ui) {
   // {{{
   gUIState = ui;

   showElement('info');
   hideElement('download-button');
   hideElement('upload-button-label');
   hideElement('upload-button');
   hideElement('loading');
   hideElement('password');
   hideElement('hide-button');
   hideElement('extract-button');
   hideElement('hide2-button');
   hideElement('extract2-button');
   hideElement('next-button');
   hideElement('navigation');
   hideElement('message');
   hideElement('cover-image');
   hideElement('method');
   enableElement('back-button');
   enableElement('restart-button');
   message.removeAttribute('readonly');
      
   info.textContent = 'StegoApp: Hide your secret messages inside pictures';
   log.innerHTML = "";
   if(ui=='start') {
      message.value = '';
      drawImageOnCanvas('images/hacker.png', 'cover-image');
      document.getElementById('upload-button').value = '';
      showElement('cover-image');
      showElement('hide-button');
      showElement('extract-button');
      log.textContent = "Click one of the options below to hide or extract information in an image.";
   }
   else if(ui=='hide-step-1') {
      drawImageOnCanvas('images/hacker.png', 'cover-image');
      document.getElementById('upload-button').value = '';
      showElement('cover-image');
      showElement('upload-button-label')
      showElement('navigation', 'flex');
      log.textContent = 'Select the image in which you want to hide the information.';
   }
   else if(ui=='hide-step-2') {
      showElement('cover-image');
      showElement('upload-button-label')
      showElement('next-button');
      showElement('navigation', 'flex');
      log.textContent = "Click Next or choose another image";
   }
   else if(ui=='hide-step-3') {
      showElement('hide2-button');
      disableElement('hide2-button');
      showElement('method');
      showElement('password');
      showElement('navigation', 'flex');
      showElement('message');
      log.textContent = "Enter a message and password and select the steganography method.";
   }
   else if(ui=='hide-step-4') {
      showElement('cover-image');
      showElement('loading');
      disableElement('back-button');
      disableElement('restart-button');
      showElement('navigation', 'flex');
   }
   else if(ui=='hide-step-5') {
      showElement('cover-image');
      showElement('download-button');
      showElement('navigation', 'flex');
      log.textContent = 'The message has been hidden!';
   }
   else if(ui=='extract-step-1') {
      drawImageOnCanvas('images/hacker.png', 'cover-image');
      document.getElementById('upload-button').value = '';
      showElement('cover-image');
      showElement('upload-button-label')
      showElement('navigation', 'flex');
      log.textContent = 'Select the image from which you want to extract information.';
   }
   else if(ui=='extract-step-2') {
      showElement('cover-image');
      showElement('upload-button-label')
      showElement('next-button');
      showElement('navigation', 'flex');
      log.textContent = "Click Next or choose another image";
   }
   else if(ui=='extract-step-3') {
      showElement('cover-image');
      showElement('extract2-button');
      showElement('password');
      showElement('method');
      showElement('navigation', 'flex');
      log.textContent = "Select the steganography method and enter a password";
      hideElement('info');
   }
   else if(ui=='extract-step-4') {
      showElement('cover-image');
      showElement('loading');
      disableElement('back-button');
      disableElement('restart-button');
      showElement('navigation', 'flex');
   }
   else if(ui=='extract-step-5') {
      showElement('cover-image');
      showElement('navigation', 'flex');
      showElement('message');
      message.setAttribute('readonly', true);
   }
   // }}}
}

async function loadPycFile(fileName) {
   // {{{
   const response = await fetch(`${fileName}`);
   if (!response.ok) {
      throw new Error(`Error loading file: ${response.statusText}`);
   }
   const buffer = await response.arrayBuffer();
   const pycData = new Uint8Array(buffer);
   gPyodide.FS.writeFile(`${fileName}`, pycData);
   // }}}
}


async function loadPythonFile(fileName) {
   // {{{
   const response = await fetch(`${fileName}`);
   if (!response.ok) {
      throw new Error(`Error loading file: ${response.statusText}`);
   }
   const fileContent = await response.text();
   gPyodide.FS.writeFile(fileName, fileContent);
   // }}}
}

async function loadPyodideAndPackages() {
   // {{{
   try {
      gPyodide = await loadPyodide({
         //indexURL: "https://cdn.jsdelivr.net/pyodide/v0.26.2/full/"
         indexURL: "pyodide-0.26.2"
      });

      await gPyodide.loadPackage(['scipy', 'numpy', 'pillow']);
      //await loadPythonFile('stegoapp.py');
      await loadPycFile('stegoapp.pyc');

   } catch (error) {
      console.error("Error loading Pyodide or packages:", error);
      throw error; 
   }
   // }}}
}

async function hide() {
   // {{{
   console.log("hide")
   try {
      let response = await fetch("hide.py", { cache: "no-store" });

      if (!response.ok) {
         throw new Error(`HTTP error! status: ${response.status}`);
      }

      let pycode = await response.text();

      method_version = method.options[method.selectedIndex].id;
      console.log("method_version:", method_version);

      gPyodide.globals.set("g_image_url", gImageURL);
      gPyodide.globals.set("g_password", password.value);
      gPyodide.globals.set("g_message", method_version + message.value);

      gPyodide.runPython(pycode);
      gB64image = gPyodide.globals.get("g_b64image");

      setUI('hide-step-5');

      if(gB64image == '') {
         hideElement('download-button');
         log.innerHTML = 'The message could not be embedded in the selected image.<br><br> Please try using a different image.';
      }

   } catch (error) {
      console.error("Error executing Python script:", error);
   }
   // }}}
}

async function extract() {
   // {{{
   console.log("extract")
   try {
      let response = await fetch("extract.py", { cache: "no-store" });

      if (!response.ok) {
         throw new Error(`HTTP error! status: ${response.status}`);
      }

      let pycode = await response.text();

      method_version = method.options[method.selectedIndex].id;
      console.log("method_version:", method_version);

      gPyodide.globals.set("g_image_url", gImageURL);
      gPyodide.globals.set("g_password", password.value);

      gPyodide.runPython(pycode);
      extracted_msg = gPyodide.globals.get("g_message");

      setUI('extract-step-5');

      if(extracted_msg.startsWith(method_version)) {
         log.textContent = "Message successfully extracted";
         message.value = extracted_msg.slice(3);
      }
      else {
         hideElement('message');
         log.innerHTML = "The message could not be extracted.<br><br> The password or steganography method is incorrect.";
      }


   } catch (error) {
      console.error("Error executing Python script:", error);
   }
   // }}}
}



document.getElementById('upload-button').addEventListener('change', fileUpload, false);

downloadButton.addEventListener('click', function() {
   // {{{
   downloadBase64Image(gB64image, 'image.png');
   // }}}
});

hideButton.addEventListener('click', function() {
   // {{{
   setUI('hide-step-1');
   // }}}
});

extractButton.addEventListener('click', function() {
   // {{{
   setUI('extract-step-1');

   // }}}
});

nextButton.addEventListener('click', function() {
   // {{{
   if(gUIState=='hide-step-2')
      setUI('hide-step-3');
   else
      setUI('extract-step-3');
   // }}}
});

hide2Button.addEventListener('click', function() {
   // {{{
   setUI('hide-step-4');
   log.textContent = "Running, this might take a while ...";
   hide();
   // }}}
});

extract2Button.addEventListener('click', function() {
   // {{{
   setUI('extract-step-4');
   log.textContent = "Running, this might take a while ...";
   extract();
   // }}}
});

restartButton.addEventListener('click', function() {
   // {{{
   setUI('start');
   // }}}
});

backButton.addEventListener('click', function() {
   // {{{
   if(gUIState=="hide-step-1")
      setUI('start');
   else if(gUIState=="hide-step-2")
      setUI('hide-step-1');
   else if(gUIState=="hide-step-3")
      setUI('hide-step-2');
   else if(gUIState=="hide-step-4")
      setUI('hide-step-3');
   else if(gUIState=="hide-step-5")
      setUI('hide-step-3');


   else if(gUIState=="extract-step-1")
      setUI('start');
   else if(gUIState=="extract-step-2")
      setUI('extract-step-1');
   else if(gUIState=="extract-step-3")
      setUI('extract-step-2');
   else if(gUIState=="extract-step-4")
      setUI('extract-step-3');
   else if(gUIState=="extract-step-5")
      setUI('extract-step-3');

   // }}}
});

message.addEventListener('input', function() {
   // {{{
   if(message.value.trim() !== '') {
      enableElement('hide2-button');
   } else {
      disableElement('hide2-button');
   }
   // }}}
});

document.addEventListener('DOMContentLoaded', function() {
   // {{{
   setUI('start');

   showElement("loading");
   hideElement("hide-button");
   hideElement("extract-button");
   log.textContent = "Loading libs ...";
   loadPyodideAndPackages().then(function() {
      hideElement("loading");
      showElement("hide-button");
      showElement("extract-button");
      log.textContent = "Click one of the options below to hide or extract information in an image.";
   });
   // }}}
 });



