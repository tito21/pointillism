
let radius_array = [200, 50, 30, 10];
const k = 30;
let width;
let height;

let points_arrays = [];
let indices = [];
let ii = 0;
let animate_flag = false;
let redraw = false;

let img;

let save_botton;
let over_sample;
let radius_input;
let animate;

function preload() {
  img = loadImage('assets/einstein-tongue.jpg');
  // img = loadImage('assets/francis_crop.jpg');
  // img = loadImage('assets/francis.jpg');
  // img = loadImage('assets/einstein-head.jpg');
}

function setup() {

  save_botton = select('#save');
  save_botton.mouseClicked(() => save('frame.jpg'));

  over_sample = select('#over-sample');
  over_sample.mouseReleased(calculatePoints);

  animate = select('#animate');
  animate.mouseClicked(() => {
    animate_flag = animate.checked();
    background(255);
    ii = 0;
    indices.forEach((element, index) => { element = 0; indices[index] = element; })
    loop();
  });

  radius_input = selectAll('.radius');
  radius_input.forEach(element => { element.mouseReleased(getRadius); });

  width = over_sample.value() * img.width;
  height = over_sample.value() * img.height;
  createCanvas(width, height, document.getElementById('canvas'));

  calculatePoints();
}

function getRadius() {
  let radius = [];
  let radius_input = selectAll('.radius');
  radius_input.forEach(element => {
    if (!element.value() == 0) {
      radius.push(element.value());
    }
  });
  radius_array = radius;
  calculatePoints();
}

function calculatePoints() {

  width = over_sample.value() * img.width;
  height = over_sample.value() * img.height;
  resizeCanvas(width, height);
  console.log(width, height);
  indices = [];
  points_arrays = [];
  for (let i = 0; i < radius_array.length; i++) {
    // console.log(radius[i]);
    points_arrays.push(poissonDiskSampling(radius_array[i], k));
    console.log(points_arrays[i].length);
    indices.push(0);
  }
  ii = 0;
  console.log(points_arrays);
  noStroke();
  background(255);
  loop();
}

function draw() {

  if (!animate_flag) {
    background(255);
    for (let i = 0; i < points_arrays.length; i++) {
      for (let j = 0; j < points_arrays[i].length; j++) {
        fill(color(img.get(points_arrays[i][j].x / over_sample.value(), points_arrays[i][j].y / over_sample.value())));
        ellipse(points_arrays[i][j].x, points_arrays[i][j].y, radius_array[i], radius_array[i]);
      }
    }
    noLoop();
    console.log('done');
  }
  else {
    if (ii < indices.length) {
      fill(color(img.get(points_arrays[ii][indices[ii]].x / over_sample.value(), points_arrays[ii][indices[ii]].y / over_sample.value())));
      ellipse(points_arrays[ii][indices[ii]].x, points_arrays[ii][indices[ii]].y, radius_array[ii], radius_array[ii]);
      indices[ii]++;
      if (indices[ii] >= points_arrays[ii].length) {
        ii++;
        console.log(ii);
      }
    }
    else {
      noLoop();
      console.log('done');
    }
  }
}

function load_new_img(event) {
  let file = event.target.files[0];
  let reader = new FileReader();
  reader.onload = () => {
    // console.log(reader.result);
    loadImage(reader.result, (img_local) => {
      img = img_local;
      console.log("loaded");
      width = img.width;
      height = img.height;
      resizeCanvas(width, height);
      calculatePoints();
      loop();
    });
  }

  reader.readAsDataURL(file);

}
