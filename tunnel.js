var timer = 0;
var xPos = -0.0;
var yPos = 1.2;
var checkLeft;
var checkRight;
var rot1 = 0.0;
var rot2 = 0.0;
function loadTexture(gl, url) {
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Because images have to be download over the internet
  // they might take a moment until they are ready.
  // Until then put a single pixel in the texture so we can
  // use it immediately. When the image has finished downloading
  // we'll update the texture with the contents of the image.
  const level = 0;
  const internalFormat = gl.RGBA;
  const width = 1;
  const height = 1;
  const border = 0;
  const srcFormat = gl.RGBA;
  const srcType = gl.UNSIGNED_BYTE;
  const pixel = new Uint8Array([0, 0, 255, 255]);  // opaque blue
  gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
                width, height, border, srcFormat, srcType,
                pixel);

  const image = new Image();
  image.onload = function() {
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
                  srcFormat, srcType, image);

    // WebGL1 has different requirements for power of 2 images
    // vs non power of 2 images so check if the image is a
    // power of 2 in both dimensions.
    if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
       // Yes, it's a power of 2. Generate mips.
       gl.generateMipmap(gl.TEXTURE_2D);
    } else {
       // No, it's not a power of 2. Turn of mips and set
       // wrapping to clamp to edge
       gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
       gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
       gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    }
  };
  image.src = url;

  return texture;
}

function isPowerOf2(value) {
  return (value & (value - 1)) == 0;
}

function moveLeft() {
  
  cubeRotation += 0.095;
}
function moveRight() {

  cubeRotation -= 0.095;
 
}
function giveBoost() {
  timer += 3;
  // obstacleTimer += 0.8;
  // console.log(obstacleTimer);
}
function makeTunnel1(){
    var positions = new Array();

    var angle = 45.0;
    var length = 5.0;
    var side = 2.0;
    var current_angle = 22.5;
    let i = 0;
    for(i = 0 ; i < 96 ;)
    {
      positions[i++] = side*Math.cos((current_angle + angle)*Math.PI/180); //1
      positions[i++] = side*Math.sin((current_angle + angle)*Math.PI/180);
      positions[i++] = 0;

      positions[i++] = side*Math.cos(current_angle*Math.PI/180); //2
      positions[i++] = side*Math.sin(current_angle*Math.PI/180);
      positions[i++] = 0;

      positions[i++] = side*Math.cos(current_angle*Math.PI/180); //3
      positions[i++] = side*Math.sin(current_angle*Math.PI/180);
      positions[i++] = -length;

      positions[i++] = side*Math.cos((current_angle + angle)*Math.PI/180); //1
      positions[i++] = side*Math.sin((current_angle + angle)*Math.PI/180);
      positions[i++] = -length;   
      // console.log(i);
      current_angle += angle;
    }
    for(;i < 192 ;)
    {
      positions[i++] = side*Math.cos((current_angle + angle)*Math.PI/180); //1
      positions[i++] = side*Math.sin((current_angle + angle)*Math.PI/180);
      positions[i++] = -length;

      positions[i++] = side*Math.cos(current_angle*Math.PI/180); //2
      positions[i++] = side*Math.sin(current_angle*Math.PI/180);
      positions[i++] = -length;

      positions[i++] = side*Math.cos(current_angle*Math.PI/180); //3
      positions[i++] = side*Math.sin(current_angle*Math.PI/180);
      positions[i++] = -2*length;

      positions[i++] = side*Math.cos((current_angle + angle)*Math.PI/180); //1
      positions[i++] = side*Math.sin((current_angle + angle)*Math.PI/180);
      positions[i++] = -2*length;   
      // console.log(i);
      current_angle += angle;
    }
    return positions;
  }
function initBuffers(gl) {

  // Create a buffer for the cube's vertex positions.

  const positionBuffer = gl.createBuffer();

  // Select the positionBuffer as the one to apply buffer
  // operations to from here out.

  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  // Now create an array of positions for the cube.

  const positions = makeTunnel1();

  // Now pass the list of positions into WebGL to build the
  // shape. We do this by creating a Float32Array from the
  // JavaScript array, then use it to fill the current buffer.

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
  
  var temp = 2.0/(2*Math.tan(22.5*Math.PI/180));

  const normalBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER,normalBuffer);


  const vertexNormals = [
    temp*Math.cos(45*Math.PI/180),temp*Math.sin(45*Math.PI/180),0.0,
    temp*Math.cos(45*Math.PI/180),temp*Math.sin(45*Math.PI/180),0.0,
    temp*Math.cos(45*Math.PI/180),temp*Math.sin(45*Math.PI/180),0.0,
    temp*Math.cos(45*Math.PI/180),temp*Math.sin(45*Math.PI/180),0.0,

    temp*Math.cos(90*Math.PI/180),temp*Math.sin(90*Math.PI/180),0.0,
    temp*Math.cos(90*Math.PI/180),temp*Math.sin(90*Math.PI/180),0.0,
    temp*Math.cos(90*Math.PI/180),temp*Math.sin(90*Math.PI/180),0.0,
    temp*Math.cos(90*Math.PI/180),temp*Math.sin(90*Math.PI/180),0.0,

    temp*Math.cos(135*Math.PI/180),temp*Math.sin(135*Math.PI/180),0.0,
    temp*Math.cos(135*Math.PI/180),temp*Math.sin(135*Math.PI/180),0.0,
    temp*Math.cos(135*Math.PI/180),temp*Math.sin(135*Math.PI/180),0.0,
    temp*Math.cos(135*Math.PI/180),temp*Math.sin(135*Math.PI/180),0.0,

    temp*Math.cos(180*Math.PI/180),temp*Math.sin(180*Math.PI/180),0.0,
    temp*Math.cos(180*Math.PI/180),temp*Math.sin(180*Math.PI/180),0.0,
    temp*Math.cos(180*Math.PI/180),temp*Math.sin(180*Math.PI/180),0.0,
    temp*Math.cos(180*Math.PI/180),temp*Math.sin(180*Math.PI/180),0.0,

    temp*Math.cos(225*Math.PI/180),temp*Math.sin(225*Math.PI/180),0.0,
    temp*Math.cos(225*Math.PI/180),temp*Math.sin(225*Math.PI/180),0.0,
    temp*Math.cos(225*Math.PI/180),temp*Math.sin(225*Math.PI/180),0.0,
    temp*Math.cos(225*Math.PI/180),temp*Math.sin(225*Math.PI/180),0.0,

    temp*Math.cos(270*Math.PI/180),temp*Math.sin(270*Math.PI/180),0.0,
    temp*Math.cos(270*Math.PI/180),temp*Math.sin(270*Math.PI/180),0.0,
    temp*Math.cos(270*Math.PI/180),temp*Math.sin(270*Math.PI/180),0.0,
    temp*Math.cos(270*Math.PI/180),temp*Math.sin(270*Math.PI/180),0.0,

    temp*Math.cos(315*Math.PI/180),temp*Math.sin(315*Math.PI/180),0.0,
    temp*Math.cos(315*Math.PI/180),temp*Math.sin(315*Math.PI/180),0.0,
    temp*Math.cos(315*Math.PI/180),temp*Math.sin(315*Math.PI/180),0.0,
    temp*Math.cos(315*Math.PI/180),temp*Math.sin(315*Math.PI/180),0.0,

    temp*Math.cos(360*Math.PI/180),temp*Math.sin(360*Math.PI/180),0.0,
    temp*Math.cos(360*Math.PI/180),temp*Math.sin(360*Math.PI/180),0.0,
    temp*Math.cos(360*Math.PI/180),temp*Math.sin(360*Math.PI/180),0.0,
    temp*Math.cos(360*Math.PI/180),temp*Math.sin(360*Math.PI/180),0.0,

    temp*Math.cos(45*Math.PI/180),temp*Math.sin(45*Math.PI/180),0.0,
    temp*Math.cos(45*Math.PI/180),temp*Math.sin(45*Math.PI/180),0.0,
    temp*Math.cos(45*Math.PI/180),temp*Math.sin(45*Math.PI/180),0.0,
    temp*Math.cos(45*Math.PI/180),temp*Math.sin(45*Math.PI/180),0.0,

    temp*Math.cos(90*Math.PI/180),temp*Math.sin(90*Math.PI/180),0.0,
    temp*Math.cos(90*Math.PI/180),temp*Math.sin(90*Math.PI/180),0.0,
    temp*Math.cos(90*Math.PI/180),temp*Math.sin(90*Math.PI/180),0.0,
    temp*Math.cos(90*Math.PI/180),temp*Math.sin(90*Math.PI/180),0.0,

    temp*Math.cos(135*Math.PI/180),temp*Math.sin(135*Math.PI/180),0.0,
    temp*Math.cos(135*Math.PI/180),temp*Math.sin(135*Math.PI/180),0.0,
    temp*Math.cos(135*Math.PI/180),temp*Math.sin(135*Math.PI/180),0.0,
    temp*Math.cos(135*Math.PI/180),temp*Math.sin(135*Math.PI/180),0.0,

    temp*Math.cos(180*Math.PI/180),temp*Math.sin(180*Math.PI/180),0.0,
    temp*Math.cos(180*Math.PI/180),temp*Math.sin(180*Math.PI/180),0.0,
    temp*Math.cos(180*Math.PI/180),temp*Math.sin(180*Math.PI/180),0.0,
    temp*Math.cos(180*Math.PI/180),temp*Math.sin(180*Math.PI/180),0.0,

    temp*Math.cos(225*Math.PI/180),temp*Math.sin(225*Math.PI/180),0.0,
    temp*Math.cos(225*Math.PI/180),temp*Math.sin(225*Math.PI/180),0.0,
    temp*Math.cos(225*Math.PI/180),temp*Math.sin(225*Math.PI/180),0.0,
    temp*Math.cos(225*Math.PI/180),temp*Math.sin(225*Math.PI/180),0.0,

    temp*Math.cos(270*Math.PI/180),temp*Math.sin(270*Math.PI/180),0.0,
    temp*Math.cos(270*Math.PI/180),temp*Math.sin(270*Math.PI/180),0.0,
    temp*Math.cos(270*Math.PI/180),temp*Math.sin(270*Math.PI/180),0.0,
    temp*Math.cos(270*Math.PI/180),temp*Math.sin(270*Math.PI/180),0.0,

    temp*Math.cos(315*Math.PI/180),temp*Math.sin(315*Math.PI/180),0.0,
    temp*Math.cos(315*Math.PI/180),temp*Math.sin(315*Math.PI/180),0.0,
    temp*Math.cos(315*Math.PI/180),temp*Math.sin(315*Math.PI/180),0.0,
    temp*Math.cos(315*Math.PI/180),temp*Math.sin(315*Math.PI/180),0.0,

    temp*Math.cos(360*Math.PI/180),temp*Math.sin(360*Math.PI/180),0.0,
    temp*Math.cos(360*Math.PI/180),temp*Math.sin(360*Math.PI/180),0.0,
    temp*Math.cos(360*Math.PI/180),temp*Math.sin(360*Math.PI/180),0.0,
    temp*Math.cos(360*Math.PI/180),temp*Math.sin(360*Math.PI/180),0.0,

  ];

   gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexNormals),
                 gl.STATIC_DRAW);

  const textureCoordBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);

  const textureCoordinates = [
    // Front
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,
    // Back
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,
    // Top
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,
    // Bottom
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,
    // Right
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,
    // Left
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,

    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,

    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,

     0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,

     0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,

     0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,

     0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,

     0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,

     0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,

     0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,

     0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,
  ];

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordinates),
        gl.STATIC_DRAW);


 


  const indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

  // This array defines each face as two triangles, using the
  // indices into the vertex array to specify each triangle's
  // position.

  
  const indices = [
    0,  1,  2,      0,  2,  3,    // front
    4,  5,  6,      4,  6,  7,    // back
    8,  9,  10,     8,  10, 11,   // top
    12, 13, 14,     12, 14, 15,   // bottom
    16, 17, 18,     16, 18, 19,   // right
    20, 21, 22,     20, 22, 23,   // left
    24, 25, 26,     24, 26, 27,
    28, 29, 30,     28, 30, 31,

    32, 33, 34,     32, 34, 35,
    36, 37, 38,     36, 38, 39,
    40, 41, 42,     40, 42, 43,
    44, 45, 46,     44, 46, 47,
    48, 49, 50,     48, 50, 51,
    52, 53, 54,     52, 54, 55, 
    56, 57, 58,     56, 58, 59, 
    60, 61, 62,     60, 62, 63,
  ];

  // Now send the element array to GL

  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
      new Uint16Array(indices), gl.STATIC_DRAW);
  
  

  
  return {
    position: positionBuffer,
    normal: normalBuffer,
    textureCoord: textureCoordBuffer,
    indices: indexBuffer,
  };
}

//
// Draw the scene.
//
function drawScene(gl, programInfo, buffers,texture, deltaTime) {
  gl.clearColor(1.0, 1.0, 1.0, 1.0);  // Clear to black, fully opaque
  gl.clearDepth(1.0);                 // Clear everything
  gl.enable(gl.DEPTH_TEST);           // Enable depth testing
  gl.depthFunc(gl.LEQUAL);            // Near things obscure far things

  // Clear the canvas before we start drawing on it.

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // Create a perspective matrix, a special matrix that is
  // used to simulate the distortion of perspective in a camera.
  // Our field of view is 45 degrees, with a width/height
  // ratio that matches the display size of the canvas
  // and we only want to see objects between 0.1 units
  // and 100 units away from the camera.

  const fieldOfView = 45 * Math.PI / 180;   // in radians
  const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
  const zNear = 0.1;
  const zFar = 65.0;
  const projectionMatrix = mat4.create();

  // note: glmatrix.js always has the first argument
  // as the destination to receive the result.
  mat4.perspective(projectionMatrix,
                   fieldOfView,
                   aspect,
                   zNear,
                   zFar);

  // Set the drawing position to the "identity" point, which is
  // the center of the scene.
  timer += 0.5;
  rot1 += 0.0004;
  // Now move the drawing position a bit to where we want to
  // start drawing the square.
  for(var i = 0 ; i < 500 ; i++)
  { 
    const modelViewMatrix = mat4.create();

    
    mat4.translate(modelViewMatrix,     // destination matrix
                   modelViewMatrix,     // matrix to translate
                   [0, (side)*Math.cos(22.5*Math.PI/180)- 0.6, -10*i + timer]);  // amount to translate

    mat4.rotate(modelViewMatrix,  // destination matrix
                modelViewMatrix,  // matrix to rotate
                cubeRotation,     // amount to rotate in radians
                [0, 0, 1]);       // axis to rotate around (Z)

    // mat4.rotate(modelViewMatrix,  // destination matrix
    //             modelViewMatrix,  // matrix to rotate
    //             rot1,// amount to rotate in radians
    //             [1, 0, 0]);       // axis to rotate around (X)
    // mat4.translate(modelViewMatrix,     // destination matrix
    //                modelViewMatrix,     // matrix to translate
    //                [0, (side/2 )*Math.cos(22.5*Math.PI/180),0]);  // amount to translate

    // Tell WebGL how to pull out the positions from the position
    // buffer into the vertexPosition attribute
    
    const normalMatrix = mat4.create();
    mat4.invert(normalMatrix,modelViewMatrix);
    mat4.transpose(normalMatrix,normalMatrix);
    {
      const numComponents = 3;
      const type = gl.FLOAT;
      const normalize = false;
      const stride = 0;
      const offset = 0;
      gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);

      gl.vertexAttribPointer(
          programInfo.attribLocations.vertexPosition,
          numComponents,
          type,
          normalize,
          stride,
          offset);
      gl.enableVertexAttribArray(
          programInfo.attribLocations.vertexPosition);
    }

    // Tell WebGL how to pull out the colors from the color buffer
    // into the vertexColor attribute.
    {
    const numComponents = 2;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.textureCoord);
    gl.vertexAttribPointer(
        programInfo.attribLocations.textureCoord,
        numComponents,
        type,
        normalize,
        stride,
        offset);
    gl.enableVertexAttribArray(
        programInfo.attribLocations.textureCoord);
  }

  // Tell WebGL how to pull out the normals from
  // the normal buffer into the vertexNormal attribute.
  {
    const numComponents = 3;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.normal);
    gl.vertexAttribPointer(
        programInfo.attribLocations.vertexNormal,
        numComponents,
        type,
        normalize,
        stride,
        offset);
    gl.enableVertexAttribArray(
        programInfo.attribLocations.vertexNormal);
}
    // Tell WebGL which indices to use to index the vertices
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);

    // Tell WebGL to use our program when drawing

    gl.useProgram(programInfo.program);

    // Set the shader uniforms

    gl.uniformMatrix4fv(
      programInfo.uniformLocations.projectionMatrix,
      false,
      projectionMatrix);
  gl.uniformMatrix4fv(
      programInfo.uniformLocations.modelViewMatrix,
      false,
      modelViewMatrix);
  gl.uniformMatrix4fv(
      programInfo.uniformLocations.normalMatrix,
      false,
normalMatrix);

      gl.activeTexture(gl.TEXTURE0);

  // Bind the texture to texture unit 0
      gl.bindTexture(gl.TEXTURE_2D, texture);

  // Tell the shader we bound the texture to texture unit 0
      gl.uniform1i(programInfo.uniformLocations.uSampler, 0);


    {
      const vertexCount = 96;
      const type = gl.UNSIGNED_SHORT;
      const offset = 0;
      gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
    }

    // Update the rotation for the next draw
}
  // cubeRotation += deltaTime;

}

function initShaderProgram(gl, vsSource, fsSource) {
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

  // Create the shader program

  const shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  // If creating the shader program failed, alert

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
    return null;
  }

  return shaderProgram;
}

//
// creates a shader of the given type, uploads the source and
// compiles it.
//
function loadShader(gl, type, source) {
  const shader = gl.createShader(type);

  // Send the source to the shader object

  gl.shaderSource(shader, source);

  // Compile the shader program

  gl.compileShader(shader);

  // See if it compiled successfully

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}