
function showSnowFall(canvasId) {
    var SnowFall, SnowFlake
    SnowFall = class SnowFall {
        constructor(intensity, angle, speed, x, y, color, canvasId) {
            let cav = document.createElement('canvas')
            this.con=document.getElementById(canvasId)
                        const style = getComputedStyle(this.con)
            const widthStr = style.getPropertyValue('width')
            const heightStr = style.getPropertyValue('height')
            cav.width = parseFloat(widthStr.slice(0, widthStr.length - 2))
            cav.height = parseFloat(heightStr.slice(0, heightStr.length - 2))
            this.width=cav.width
            this.height=cav.height
            this.con.appendChild(cav)
            this.canvas=cav
            this.start = this.start.bind(this)
            this.context = cav.getContext("2d")

            this.angle = angle + 90;
            this.color = color;
            this.speed = speed;
            this.intensity = intensity;
            this.stop = this.stop.bind(this)
            this.makeFlakes()
            requestAnimationFrame(this.start)
        }
        start(d) {
            this.context.clearRect(0,0,this.width,this.height)
            this.last_time || (this.last_time = 0);
            this.delta = d - this.last_time
            this.last_time = d
            this.draw()
            return this.flakes.length <= 2 ? false : requestAnimationFrame(this.start)
        }
        stop() {
            this.flakes = this.flakes.slice(0, Math.floor(this.flakes.length / 2*1.5))
            if (this.flakes.length > 2) {
                setTimeout(() => {
                    this.stop()
                }, 20)
            }else{
                this.con.innerHTML=null
                this.flakes=[]
            }
        }
        draw() {
            var flake, j, len, ref, results;
            this.context.fillStyle = this.color;
            ref = this.flakes;
            results = [];
            for (j = 0, len = ref.length; j < len; j++) {
                flake = ref[j];
                results.push(flake.draw(this.delta))
            }
            return results;
        }

        makeFlakes() {
            return this.flakes = function () {
                var j, ref, results;
                results = [];
                for (j = 1, ref = this.intensity; 1 <= ref ? j <= ref : j >= ref; 1 <= ref ? ++j : --j) {
                    results.push(new SnowFlake(this.color, this));
                }
                return results
            }.call(this)
        }
    };



    SnowFlake = class SnowFlake {
        constructor(color, parent) {
            this.x_pos = this.start_x = Math.floor(Math.random() * (2 * parent.width)) - parent.width;
            this.y_pos = this.start_y = -1 * Math.floor(Math.random() * parent.height);
            this.angle = this.start_angle = parent.angle;
            this.parent = parent;
            this.size = Math.floor(Math.random() * 2 + 1);
            this.speed = this.start_speed = this.parent.speed
            this.speed = Math.floor(this.speed * Math.random()) + 25
            this.parent.context.fillStyle = color;
            this.rect = this.parent.context.fillRect(this.start_x, this.start_y, this.size, this.size);
        }

        draw(delta) {
            var variance;
            variance = Math.random() * 2;
            variance -= 1;
            this.angle += variance / 200;
            this.speed = Math.abs(this.speed + variance);
            this.x_pos += this.x(delta);
            this.y_pos += this.y(delta);
            if (!(this.x_pos > this.parent.width || this.y_pos > this.parent.height)) {
                return this.parent.context.fillRect(this.x_pos, this.y_pos, this.size, this.size);
            } else {
                return this.reset();
            }
        }

        x(delta) {
            return Math.cos(this.angle) * (delta / 1000) * this.speed;
        }

        y(delta) {
            return Math.sin(this.angle) * (delta / 1000) * this.speed;
        }

        reset() {
            this.x_pos = this.start_x;
            this.y_pos = this.start_y;
            this.angle = this.start_angle;
            this.speed = this.start_speed;
            return this.parent.context.fillRect(this.x_pos, this.y_pos, this.size, this.size);
        }
    }
    return new SnowFall(5000, -45, 75, 0, 0, "#FFF", canvasId)

}
export default (canvasId) => showSnowFall(canvasId)