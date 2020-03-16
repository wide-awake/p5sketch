let range = 100;
let bass;
let mid = 250;
var soundFile, amplitude, fft;
var playing = false;
let particles = [];
let p;
let size = 400;

class particle {
	constructor(x, y, z){

		this.x = x;
		this.y = y;
		this.z = z;
		this.rot = (Math.random()-0.5) * 0.01;
		this.type = (int(random(1,4))); //each type rotates around an axis.
	}

	show(){

		push();
		specularMaterial(250);
		translate(this.x, this.y, this.z);
		sphere(1, 6, 6);
		pop();
	}

	move(){

		let rad = this.rot;
		switch(this.type){

			case 1:
				this.x = (this.x * Math.cos(rad)) + (this.z * ((Math.sin(rad)*-1)))
				this.z = (this.x * Math.sin(rad)) + (this.z * Math.cos(rad))
				break; 
			case 2:
				this.y = (this.y * Math.cos(rad)) + (this.z * ((Math.sin(rad)*-1)))
				this.z = (this.y * Math.sin(rad)) + (this.z * Math.cos(rad))
				break; 
			case 3:
				this.x = (this.x * Math.cos(rad)) + (this.y * ((Math.sin(rad)*-1)))
				this.y = (this.x * Math.sin(rad)) + (this.y * Math.cos(rad))
		}	

	}
}

function preload() {
  // load the sound, but don't play it yet
  soundFile = loadSound('IDL.mp3')
}

function setup(){

 	c = createCanvas(windowWidth, windowHeight, WEBGL);
	amplitude = new p5.Amplitude();
 	soundFile.loop();
 	fft = new p5.FFT();
 	fft.setInput(soundFile);

 	for (let i = 0; i < 200; i++){ //generates points from unit sphere. this is not a very uniform distribution
 		
 		let O = randomGaussian(0.5, 0.35)*2*Math.PI;
 		let o = Math.acos(2*Math.random()-(1));
 		let r = ((Math.random())*size)^(1/3) //^ was supposed to be **. but it works anyway. i really wish i knew how

 		let x = int(r * Math.cos(O) * Math.sin(o));
 		let y = int(r * Math.sin(O) * Math.sin(o));
 		let z = int(r * Math.cos(o));

 		let sq = Math.sqrt(x^2 + y^2 + z^2);

 		if ( (Math.sqrt(x**2 + y**2 + z**2) < size-10) ){ //you could consider this a bruteforce method. it only runs once so i don't care
 			i--;
 		}else{
 			particles[i] = new particle(x,y,z);
 	}

 	}

}


function mouseClicked() { //this is required because chrome sucks
	if (!playing){
 		soundFile.loop();
 		playing = true;
	} else {
		soundFile.stop();
		playing = false;
		}
}

function draw(){

	orbitControl();

	var spectrum = fft.analyze();
  	setFrameRate(60);
  	var level = amplitude.getLevel();
  	var bass    = fft.getEnergy("bass");
  	var mid     = fft.getEnergy("mid");
  	var treble  = fft.getEnergy("treble");
  	range = mid/2;
	background(0);
	
	let locX = mouseX - height / 2;
 	let locY = mouseY - width / 2;

 	ambientLight(60, 60, 60);
 	pointLight(255, 255, 255, locX, locY, 100);



	for(let i = 0; i < particles.length; i++){
		particles[i].show();
		particles[i].move();
	}


	for(var i = 0; i < particles.length; i++){
  		for(var j = 0; j < particles.length; j++){
  			if ((particles[j].x > (particles[i].x - range)) && ((particles[j].x < (particles[i].x + range))) && (particles[j].y > (particles[i].y - range)) && (particles[j].y < (particles[i].y + range)) && (particles[j].z > (particles[i].z - range)) && (particles[j].z < (particles[i].z + range)) && (i != j)){

  				stroke(bass, abs(particles[i].z-50), abs(particles[j].z)-50,); // Change the color
				line(particles[j].x, particles[j].y, particles[j].z, particles[i].x, particles[i].y, particles[i].z);

  			}


  		}
  	}


  	let r = random([1])
  	console.log(r)
  	


}