class Player{
    constructor(x,y){
        this.position = {x: x, y: y};
        this.velocity = {x: 0, y: 0};

        this.speed = 0.25;
        this.friction = 0.95; //slippery

        this.image = new Image();
        this.image.src = 'resources/banjo.png';

        //animations, animFrame
        this.animFrame = 0;
        this.animName = "down";
        this.animations = {
            "down": [
                {x: 0, y: 0, w: 20, h: 31},
                {x: 31, y: 0, w: 20, h: 31},
                {x: 0, y: 0, w: 20, h: 31},
                {x: 62, y: 0, w: 20, h: 31}
            ],
            "up": [
                {x: 0, y: 31, w: 20, h: 31},
                {x: 31, y: 31, w: 20, h: 31},
                {x: 0, y: 31, w: 20, h: 31},
                {x: 62, y: 31, w: 20, h: 31}
            ],
            "left": [
                {x: 0, y: 62, w: 15, h: 30},
                {x: 15, y: 62, w: 15, h: 30},
                {x: 0, y: 62, w: 15, h: 30},
                {x: 30, y: 62, w: 15, h: 30}
            ],
            "right": [
                {x: 0, y: 92, w: 15, h: 30},
                {x: 15, y: 92, w: 15, h: 30},
                {x: 0, y: 92, w: 15, h: 30},
                {x: 30, y: 92, w: 15, h: 30}
            ]
        };
    }
    update(){
        const vector = normalized({
            x: keyDown('d') - keyDown('a'),
            y: keyDown('s') - keyDown('w')
        });

        this.velocity.x += vector.x * this.speed;
        this.velocity.y += vector.y * this.speed;

        //apply friction
        this.velocity.x *= this.friction;
        this.velocity.y *= this.friction;

        //apply velocity
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }
    draw(ctx){
        //drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
        const animation = this.animations[this.animName][this.animFrame];

        ctx.drawImage(
            this.image, 
            animation.x, animation.y, 
            animation.w, animation.h, 
            Math.floor(this.position.x), 
            Math.floor(this.position.y), 
            animation.w, animation.h
        );
    }
}

const canvas = document.getElementById('preview');
const ctx = canvas.getContext('2d');

//make it beautiful
ctx.imageSmoothingEnabled = false;
ctx.scale(2, 2);

const keysPressed = {};
const objects = [
    new Player(0, 0)
];

function update(){
    for(const obj of objects){
        obj.update();
    }
}

function draw(){
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    for(const obj of objects){
        obj.draw(ctx);
    }
}

function main(){
    update();
    draw();
    requestAnimationFrame(main);
}

requestAnimationFrame(main);

//manage keypresses
function keyDown(key){
    return key in keysPressed && keysPressed[key];
}
document.addEventListener('keydown', (event) => {
    keysPressed[event.key] = true;
});
document.addEventListener('keyup', (event) => {
    keysPressed[event.key] = false;
});


function normalized(vector) {
    const magnitude = Math.sqrt(vector.x ** 2 + vector.y ** 2);
    if (magnitude === 0) {
        return {x: 0, y: 0};
    }
    return {
        x: vector.x / magnitude,
        y: vector.y / magnitude
    };
}