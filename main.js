
// Get reference to canvas
var canvas = document.getElementById('canvas');
// var canvas_2 = document.getElementById('canvas_2');

// Images variables
var image_name = "layer";

// Clicking on images preview
var preview_0 = document.getElementById("preview-0");
var preview_1 = document.getElementById("preview-1");
var preview_2 = document.getElementById("preview-2");
// next_button.onclick = changeContent("first");

// previous_button.onclick = changeContent("layer");

function changeContent(name) {
    // image_name = name;
    console.log('here');
    layer_list[0].src="./image/first_1.png" ;
    layer_list.forEach(function(layer,index){
        layer.src = './image/' + name + '_'+index+'.png';
    });
    image_loader();
 }

// Get reference to canvas context
var context = canvas.getContext('2d');
// var context_2 = canvas_2.getContext('2d');
// Get reference to loading screen]
var loading_screen = document.getElementById('loading'); 

//Initialize loading variables
var loaded = false;
var load_counter = 0;

// Initialize image for layers
var background = new Image();
var dots = new Image();
var circle = new Image();

//Create a list of layer objects
var layer_list = [
    {
        'image': background,
        'src': './image/' + image_name + '_0.png',
        'z_index': -2,
        'position': {x: 0, y:0},
        'blend': null,
        'opacity': 1
    },
    {
        'image': dots,
        'src': './image/' + image_name + '_1.png',
        'z_index': -1.5,
        'position': {x: 0, y:0},
        'blend': null,
        'opacity': 1
    },
    {
        'image': circle,
        'src': './image/' + image_name + '_2.png',
        'z_index': -0.5,
        'position': {x: 0, y:0},
        'blend': null,
        'opacity': 1
    }
];



function image_loader(){
layer_list.forEach(function(layer,index) {
    layer.image.onload = function() {
        load_counter += 1;
        if (load_counter >= layer_list.length){
            hideLoading(); // hide loading screen
            requestAnimationFrame(drawCanvas);
        }
    };
    layer.image.src = layer.src;
});
}

image_loader();
function hideLoading(){
  loading_screen.classList.add('hidden');
}

function drawCanvas() {
    // clear whatever is in the canvas
    context.clearRect(0, 0, canvas.width, canvas.height);
    // context_2.clearRect(0, 0, canvas.width, canvas.height);
    // Update the tween
    TWEEN.update();

    // Calculate how much the canvas should rotate
    var rotate_x = (pointer.y * -0.15) + (motion.y * -1.2);
    var rotate_y = (pointer.x * 0.15) + (motion.x * 1.2);

    var transform_string = "rotateX(" + rotate_x + "deg) rotateY(" + rotate_y + "deg)";
    //Actually rotate the canvas
    canvas.style.transform = transform_string;

    // Loop through each layer and draw it to the canvas
    layer_list.forEach(function(layer, index) {

        layer.position = getOffset(layer);

        // Blend set
        if (layer.blend) {
            context.globalCompositeOperation = layer.blend;
        } else {
            context.globalCompositeOperation = 'normal';
        }
        // Opacity set
        context.globalAlpha = layer.opacity;
        context.drawImage(layer.image, layer.position.x + 150, layer.position.y + 50);
        // context_2.drawImage(layer.image, layer.position.x + 150, layer.position.y + 150);
    });

    requestAnimationFrame(drawCanvas);
}

preview_1.onclick = function (){
    changeContent('first');
};

preview_0.onclick = function(){
    changeContent("layer");
};

preview_2.onclick = function(){
    changeContent("third");
};

function getOffset(layer) {
    var touch_multiplyer = 0.3;
    var touch_offset_x = pointer.x * layer.z_index * touch_multiplyer;
    var touch_offset_y = pointer.y * layer.z_index * touch_multiplyer;

    var motion_multiplyer = 1;
    var motion_offset_x = motion.x * layer.z_index * motion_multiplyer;
    var motion_offset_y = motion.y * layer.z_index * motion_multiplyer;


    var offset = {
        x: touch_offset_x + motion_offset_x,
        y: touch_offset_y + motion_offset_y
    };
    return offset;
}

// TOUCH AND MOUSE CONTROLS //

var moving = false;

// Initialize touch and mouse position
var pointer_initial = {
    x:0,
    y:0
};

var pointer = {
    x:0,
    y:0
};

canvas.addEventListener('touchstart', pointerStart);
canvas.addEventListener('mousedown', pointerStart);

function pointerStart(event) {
    moving = true;
    if (event.type === 'touchstart') {
        pointer_initial.x = event.touches[0].clientX;
        pointer_initial.y = event.touches[0].clientY;
    } else if (event.type === 'mousedown') {
        pointer_initial.x = event.clientX;
        pointer_initial.y = event.clientY;
    }
}

window.addEventListener('touchmove', pointerMove);
window.addEventListener('mousemove', pointerMove);

function pointerMove(event) {
    event.preventDefault();
    if (moving === true) {
        var current_x = 0;
        var current_y = 0;
        if (event.type === 'touchmove') {
            current_x = event.touches[0].clientX;
            current_y = event.touches[0].clientY;
        } else if (event.type === 'mousemove'){
            current_x = event.clientX;
            current_y = event.clientY;
        }
        pointer.x = current_x - pointer_initial.x;
        pointer.y = current_y - pointer_initial.y;
    }
}

//Turn off scrolling
canvas.addEventListener('touchmove', function(event) {
    event.preventDefault();
});

canvas.addEventListener('mousemove', function(event) {
    event.preventDefault();
});


// Stop moving
window.addEventListener('touchend', function(event){
    endGesture();
});

window.addEventListener('mouseup', function(event){
    endGesture();
});

function endGesture() {
    moving = false;

    TWEEN.removeAll();
    var pointer_tween = new TWEEN.Tween(pointer).to({x:0, y:0}, 300).easing(TWEEN.Easing.Back.Out).start();
    // pointer.x = 0;
    // pointer.y = 0;
} 


// MOTION CONTROLS //

// Initial variables for motion-based parallax
var motion_initial = {
    x: null,
    y: null
};

var motion = {
    x: 0,
    y: 0
};

// Listen to gyroscope events
window.addEventListener('deviceorientation', function(event) {
    // if this is the first time through
    if (!motion_initial.x && !motion_initial.y) {
        motion_initial.x = event.beta;
        motion_initial.y = event.gamma;
    }
    if (window.orientation === 0) {
        // The device is in portrait orientation
        motion.x = event.gamma - motion_initial.y;
        motion.y = event.beta - motion_initial.x;
    } else if (window.orientation === 90) {
        // The device is in landscape orientation on its right side
        motion.x = event.beta - motion.motion_initial.x;
        motion.y = -event.gamma + motion.motion_initial.y;
    } else if (window.orientation === -90) {
        // The device is in landscape orientation on its left side 
        motion.x = -event.beta + motion.motion_initial.x;
        motion.y = event.gamma - motion.motion_initial.y;
    } else {
        // The device is upside down
        motion.y = -event.beta + motion.motion_initial.x;
        motion.x = -event.gamma + motion.motion_initial.y;
    }
});

window.addEventListener('orientationchange', function(event) {
    motion_initial.x = 0;
    motion_initial.y = 0;
});


