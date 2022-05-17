function setup() {
    createCanvas(windowWidth, windowHeight);
  }
  
  function draw() {
    background(220);
  }var radius;
  var num_segments = 6;
  var colours = ["#320E3B", "#E56399", "#7F96FF", "#A6CFD5", "#DBFCFF", "#CEC3C1"];
  var labels = ["Palimpses.", "Anthropo.", "Perform.", "Adaptive", "EXP,Memory", "Contact"];
  var counter = 0;
  var rotating = false;
  var rot_angle;
  var previous_angle=0;
  var rand_num;
  let myFont;
  var sectors = [];
  var vectors = [];
  var point_x;
  var point_y;
  var x1 = 0, y1 = 0;
  var x2 = 0, y2 = 0;
  var reset_wheel = false;
  var min_sect = 0;
  var min_dist;
  var OG_sects = [1,2,3,4,5,6];
  var OG_vects = [1,2,3,4,5,6];
  
  function preload() {
    myFont = loadFont('fbg_type.ttf');
  }
  
  function setup() {
    createCanvas(windowWidth, windowHeight);
    radius = 3*min(width, height)/5;
    min_dist = width*height;
    
    for(let i=0; i<num_segments; i++){
      sectors.push(new Sector(radius, 2*i*PI/num_segments, 2*(i+1)*PI/num_segments, colours[i], labels[i]));
      v_right = createVector(radius/2*cos(2*(i+1)*PI/num_segments), radius/2*sin(2*(i+1)*PI/num_segments))
      v_left = createVector(radius/2*cos(2*i*PI/num_segments), radius/2*sin(2*i*PI/num_segments))
      vectors.push([v_left, v_right])
    }
    point_x = 0;   
    point_y = -radius/2+radius/30;
    arrayCopy(sectors, 0, OG_sects, 0, 6);
    arrayCopy(vectors, 0, OG_vects, 0, 6);
    // OG_vects = vectors;
  }
  
  function draw() {
    stroke(255)
    translate(width/2, height/2)
    background("#fffec8");
    textFont(myFont);
    
    if(rotating){
      counter += 1
    }
    
    if(counter > rand_num){
      handle_end_spin()
      }
    
    push()
    fill(255)
    circle(0,0, radius+30)
    pop()
    
    push()
    rotate((counter+previous_angle)*PI/180)
    draw_wheel();
    pop()
    push()
    fill(255);
    strokeWeight(2)
    stroke(140)
    triangle(-30, -1.1*radius/2, point_x, point_y, 30, -1.1*radius/2)
    pop()
  }
  
  function mousePressed() {
    if(mouseX>width/2){
    rotating = true;
    rand_num = random(104, 300)
    min_dist = width*height;
    min_sect = 0;
    }else{
    }
  }
  
  function draw_wheel(){
    for(let i=0; i<sectors.length; i++){
      sectors[i].draw_sect();
      }
  }
  
  function remove_sector(ith_sect){
    if(sectors.length == 1){
      sectors = OG_sects;
      vectors = OG_vects;
      num_segments = 6;
      print("yellow "+sectors.length)
      for(let i=0;i<sectors.length;i++){
        sectors[i].e1 = 2*i*PI/num_segments
        sectors[i].e2 = 2*(i+1)*PI/num_segments
        vectors[i][0].x = radius/2*cos(2*i*PI/num_segments)
        vectors[i][0].y = radius/2*sin(2*i*PI/num_segments)
        vectors[i][1].x = radius/2*cos(2*i*PI/num_segments)
        vectors[i][1].y = radius/2*sin(2*i*PI/num_segments)
      }
    }else{
    num_segments -= 1;
    sectors.splice(ith_sect, 1)
    vectors.splice(ith_sect, 1)
    for(let i=0; i<num_segments;i++){
      sectors[i].e1 = 2*i*PI/num_segments
      sectors[i].e2 = 2*(i+1)*PI/num_segments
      vectors[i][0].x = radius/2*cos(2*i*PI/num_segments)
      vectors[i][0].y = radius/2*sin(2*i*PI/num_segments)
      vectors[i][1].x = radius/2*cos(2*i*PI/num_segments)
      vectors[i][1].y = radius/2*sin(2*i*PI/num_segments)
    }
    }
    print(sectors.length)
  }
  
  function handle_end_spin(){
    previous_angle = counter+previous_angle;
        rotating = false;
        for(let i=0; i<vectors.length;i++){
          vectors[i][0] = vectors[i][0].rotate(counter*PI/180)
          vectors[i][1] = vectors[i][1].rotate(counter*PI/180)
        }
        counter = 0;
      
      for(let i=0; i<vectors.length;i++){
        if(dist(vectors[i][0].x, vectors[i][0].y, point_x, point_y) + dist(vectors[i][1].x, vectors[i][1].y, point_x, point_y)<min_dist){
          min_sect = i
          min_dist = dist(vectors[i][0].x, vectors[i][0].y, point_x, point_y) + dist(vectors[i][1].x, vectors[i][1].y, point_x, point_y)
          } 
        }
  }
  
  class Sector {
    constructor(radius, edge1, edge2, col, text) {
      this.radius = radius;
      this.e1 = edge1;
      this.e2 = edge2;
      this.colour = col;
      this.text = text;
    }
  
    draw_sect() {
      fill(this.colour)
      textSize(radius/16)
      arc(0, 0, this.radius, this.radius, this.e1, this.e2, PIE); 
      push()
      rotate(this.e2-2*PI/(2*sectors.length))
      strokeWeight(2)
      stroke(120)
      fill(255)
      text(this.text, 3*this.radius/16, 0);
      pop()
    }
  }
