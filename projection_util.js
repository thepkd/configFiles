var eyeGlobal = vec3.fromValues(0.5,0.5,-0.5);
var pointLight = vec3.fromValues(-0.5,1.5,-0.5);

var zValue=0; var vX=0;
var xValue=0; var vY=0;
var yValue=0; var vZ=0;
var xRot=0; var yRot=0;
var mxRot=0; var myRot=0; var mzRot=0;

var currentlyPressedKeys = {};

function lightsOn(){
    setLight();
    shadeLight();
}

function shadeLight(){
    setProjMat();
    setViewMat(); 
}
function setLight(){
    var lightNorm = vec3.create();
    vec3.normalize(lightNorm,pointLight);
    gl.uniform3fv(lightPositionMat, lightNorm);
}

function setProjMat(){
    var fovRad = glMatrix.toRadian(90);
    var aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
  //  console.log(aspect);
    var zFront = 0.1;
    var zBack = 100.0;
    var pMatrix = mat4.create();
    mat4.perspective(pMatrix,fovRad, aspect, zFront, zBack);
    gl.uniformMatrix4fv(perspectiveUniform,gl.FALSE,pMatrix);
}// output is Projection Matrix 

function setViewMat(){
    var mvMatrix = mat4.create();
    //Eye modify
    var eye =vec3.create(); vec3.add(eye,eyeGlobal, vec3.fromValues(vX,vY,vZ));
    gl.uniform3fv(u_eyeWorld,eye);
    var lookat = vec3.create();
    //Rotate lookat. Default lookat is (0,0,1)
    vec3.normalize(lookat,vec3.fromValues( Math.sin(yRot),Math.sin(xRot), (Math.cos(yRot) + Math.cos(xRot))/2));

    var target = vec3.create();
    vec3.add(target,eye,lookat);
    var viewup = vec3.fromValues(0,1,0);
    mat4.lookAt(mvMatrix, eye, target, viewup);
    //console.log(mvMatrix);
    gl.uniformMatrix4fv(mvUniform,gl.FALSE,mvMatrix);
} // output is View Projection matrix

function handleKeyPress(event){
    //console.log("KeyPress");
    currentlyPressedKeys[event.keyCode] = true;
}

function handleKeyDown(event){
    //currentlyPressedKeys[event.keyCode] = true;
}

function deselectObj(){
    xValue=0; yValue=0; zValue=0;
    mxRot=0; myRot=0; mzRot=0; 
}

function handleKeys(){
if(currentlyPressedKeys[97]) {
    vX-=0.05; 
    currentlyPressedKeys[97] = false;
}

if(currentlyPressedKeys[100]){
    vX += 0.05;
    currentlyPressedKeys[100] = false;
}
//Change the z dimension positively

if(currentlyPressedKeys[113]) {
    vY-=0.05;
    currentlyPressedKeys[113] = false;
}
if(currentlyPressedKeys[101]){
    vY+=0.05;
    currentlyPressedKeys[101] = false;
}
if(currentlyPressedKeys[119]){
    vZ+=0.05;
    currentlyPressedKeys[119] = false;
}
if(currentlyPressedKeys[115]){
    vZ-=0.05;
    currentlyPressedKeys[115] = false;
}
if(currentlyPressedKeys[107]){
    xValue+=0.1;
    currentlyPressedKeys[107] = false;
}
if(currentlyPressedKeys[59]){
    xValue-=0.1;
    currentlyPressedKeys[59] = false;
}
if(currentlyPressedKeys[105]){
    yValue+=0.1;
    currentlyPressedKeys[105] = false;
}
if(currentlyPressedKeys[112]){
    yValue-=0.1;
    currentlyPressedKeys[112] = false;
}
if(currentlyPressedKeys[111]){
    zValue+=0.1;
    currentlyPressedKeys[111] = false;
}
if(currentlyPressedKeys[108]){
    zValue-=0.1;
    console.log(zValue);
    currentlyPressedKeys[108] = false;
}
//Change the z dimension negatively.
if(currentlyPressedKeys[65]){
    yRot+=Math.PI/16;
    currentlyPressedKeys[65] = false;
}
if(currentlyPressedKeys[68]){
    yRot-=Math.PI/16;
    currentlyPressedKeys[68] = false;
}
if(currentlyPressedKeys[87]){
    xRot+=Math.PI/16;
    currentlyPressedKeys[87] = false;
}
if(currentlyPressedKeys[83]){
    xRot-=Math.PI/16;
    currentlyPressedKeys[83] = false;
}
if(currentlyPressedKeys[75]){
    myRot+=Math.PI/16;
    currentlyPressedKeys[75] = false;
}
if(currentlyPressedKeys[58]){
    myRot-=Math.PI/16;
    currentlyPressedKeys[58] = false;
}
if(currentlyPressedKeys[79]){
    mxRot+=Math.PI/16;
    currentlyPressedKeys[79] = false;
}
if(currentlyPressedKeys[76]){
    mxRot-=Math.PI/16;
    currentlyPressedKeys[76] = false;
}
if(currentlyPressedKeys[73]){
    mzRot+=Math.PI/16;
    currentlyPressedKeys[73] = false;
}
if(currentlyPressedKeys[80]){
    mzRot-=Math.PI/16;
    currentlyPressedKeys[80] = false;
}

}

//function handleKeyDown()

function   handleMouseDown(ev) {   // Mouse is pressed
    var x = ev.clientX, y = ev.clientY;
    var rect = ev.target.getBoundingClientRect();
    if (rect.left <= x && x < rect.right && rect.top <= y && y < rect.bottom) {
//
//      // If pressed position is inside <canvas>, check if it is above object
        var x_in_canvas = x - rect.left, y_in_canvas = rect.bottom - y;
        console.log("MouseDown"+x+y);
        console.log("MouseDown"+rect.left+rect.right+rect.top+rect.bottom);

        check(gl, x_in_canvas, y_in_canvas);
//
//      if (picked) alert('The cube was selected! ');
    }
  }

function check(gl, x, y) {

  var picked = [false,false,false];

  gl.uniform1i(u_Clicked, 1);  // Pass true to u_Clicked

  makeSpheres(); // Draw cube with red    
  // Read pixel at the clicked position

  var pixels = new Uint8Array(4); // Array for storing the pixel value

  gl.readPixels(x, y, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixels);

  if (pixels[0] == 255) // The mouse in on cube if R(pixels[0]) is 255
    picked[0] = true;
    else if(pixels[1] == 255)
    picked[1] = true;
    else if(pixels[2] == 255)
    picked[2] = true;


  gl.uniform1i(u_Clicked, 0);  // Pass false to u_Clicked(rewrite the cube)    
  if(picked[0] || picked[1] || picked[2])
  {
    if(picked[0]) {deselectObj(); sel[1]=false; sel[2]=false; sel[0]=!sel[0]};
    if(picked[1]) {deselectObj(); sel[2]=false; sel[0]=false; sel[1]=!sel[1]};
    if(picked[2]) {deselectObj(); sel[0]=false; sel[1]=false; sel[2]=!sel[2]};
    //drawS2(2,picked[1]);
    //drawS3(3,picked[2])
//    alert('Something was selected!!');
  }    
}

// 
// var worldMatrix = mat4.identity(); Any inputs to the world view can be modified here.
// var worldViewProjectionMatrix = mat4.multiply(worldMatrix, viewProjection)
