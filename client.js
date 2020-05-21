let loadFile = function() {
  document.getElementById("upload-btn").innerHTML = "Do it again!"

  
  let canvas = document.getElementById("myCanvas");

  canvas.width = 400;
  canvas.height = 400;

  let ctx = canvas.getContext("2d");
  ctx.globalCompositeOperation = "";

  let image = new Image();
  image.onload = function() {
    let min = Math.min(image.width, image.height);

    ctx.drawImage(
      image,
      image.width / 2 - min / 2, // from the image
      image.height / 2 - min / 2,
      min,
      min,
      0, // draw to the canvas
      0,
      canvas.width,
      canvas.height
    );

    // convert all the pixels to grayscale
    let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    process(imageData);

    document
      .querySelector("#contrast")
      .addEventListener("change", e => process(imageData));
    document
      .querySelector("#brightness")
      .addEventListener("change", e => process(imageData));
  };

  function process(input) {
    let data = input.data;
    let output = new ImageData(input.width, input.height);

    let contrast = parseFloat(document.querySelector("#contrast").value); // could be a slider;
    let brightness = parseFloat(document.querySelector("#brightness").value); // could be a slider;

    // [r, g, b, a, r, g, b, a, r, g, b, a ....]
    for (let i = 0; i < data.length; i = i + 4) {
      let red = data[i];
      let green = data[i + 1];
      let blue = data[i + 2];
      // https://en.wikipedia.org/wiki/YUV#Conversion_to/from_RGB
      let grey = 0.299 * red + 0.587 * green + 0.114 * blue + brightness;
      // ADD CONTRASR: stretch the colors so theres a wider gap between white and black
      grey = (grey - 128) * contrast + 128;
      output.data[i] = output.data[i + 1] = output.data[i + 2] = grey;
      output.data[i + 3] = data[i + 3];
    }
    // Change the pixels in the canvas to be the new greyscale ones
    ctx.putImageData(output, 0, 0);

    // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/globalCompositeOperation
    ctx.globalCompositeOperation = "multiply";
    ctx.fillStyle = "rgba(184, 245, 216, 1)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.globalCompositeOperation = "screen";
    ctx.fillStyle = "#232444";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    let dataUrl = canvas.toDataURL();
    let link = document.querySelector("#screencap-btn");
    link.download = "warren.png";
    link.href = dataUrl;
  }
  image.src = URL.createObjectURL(event.target.files[0]);

  document.getElementById("image-preview-container").style.display = "block";
};


document
  .querySelector("#upload-btn")
  .addEventListener("click", e =>
    document.getElementById("image-file").click()
  );
