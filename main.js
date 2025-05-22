class Player{
    constructor(x,y){
        this.position = {x: x, y: y};
        this.velocity = {x: 0, y: 0};

        this.speed = 0.2;
        this.friction = 0.95; //slippery

        this.image = new Image();
        this.image.src = 'resources/banjo.png';

        //animations, animFrame
        this.animFrame = 0;
        this.animName = "down";
        this.animations = {
            "down": [
                {x: 20, y: 0, w: 20, h: 30, yOff: -2},
                {x: 0, y: 0, w: 20, h: 30},
                {x: 40, y: 0, w: 20, h: 30, yOff: -2},
                {x: 0, y: 0, w: 20, h: 30}
            ],
            "up": [
                {x: 20, y: 30, w: 20, h: 30, yOff: -2},
                {x: 0, y: 30, w: 20, h: 30},
                {x: 40, y: 30, w: 20, h: 30, yOff: -2},
                {x: 0, y: 30, w: 20, h: 30}
            ],
            "left": [
                {x: 15, y: 60, w: 15, h: 29, xOff: 2, yOff: -1},
                {x: 0, y: 60, w: 15, h: 29, xOff: 2, yOff: 1},
                {x: 30, y: 60, w: 15, h: 29, xOff: 2, yOff: -1},
                {x: 0, y: 60, w: 15, h: 29, xOff: 2, yOff: 1}
            ],
            "right": [
                {x: 15, y: 89, w: 15, h: 29, xOff: 4, yOff: -1},
                {x: 0, y: 89, w: 15, h: 29, xOff: 4, yOff: 1},
                {x: 30, y: 89, w: 15, h: 29, xOff: 4, yOff: -1},
                {x: 0, y: 89, w: 15, h: 29, xOff: 4, yOff: 1}
            ]
        };
    }
    update(){
        const vector = normalized({
            x: keyDown('d') - keyDown('a'),
            y: keyDown('s') - keyDown('w')
        });

        //animation
        if(vector.y){
            this.animName = (vector.y > 0) ? "down" : "up";
        }else if(vector.x){
            this.animName = (vector.x > 0) ? "right" : "left";
        }

        //increase frame
        const magnitude = getMagnitude(this.velocity);
        if(magnitude > 0.4){
            this.animFrame += magnitude / 16;
        }else{
            this.animFrame = this.animations[this.animName].length - 1; // last
        }

        //move
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
        const frame = Math.floor(this.animFrame) % this.animations[this.animName].length;

        const animation = this.animations[this.animName][frame];
        const offset = {
            x: 'xOff' in animation ? animation.xOff : 0,
            y: 'yOff' in animation ? animation.yOff : 0
        };

        //drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
        ctx.drawImage(
            this.image, 
            animation.x, animation.y, 
            animation.w, animation.h, 
            Math.floor(this.position.x) + offset.x, 
            Math.floor(this.position.y) + offset.y, 
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

function getMagnitude(vector){
    return Math.sqrt(vector.x ** 2 + vector.y ** 2);

}
function normalized(vector) {
    const magnitude = getMagnitude(vector);
    if (magnitude === 0) {
        return {x: 0, y: 0};
    }
    return {
        x: vector.x / magnitude,
        y: vector.y / magnitude
    };
}