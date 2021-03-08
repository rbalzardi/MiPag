function Caynon(_canvas, _context) {
      this.fireworks = []
      this.counter = 0
      this.context = _context
      this.canvas = _canvas
      this.size = {
            height: 0,
            width: 0
      }
      this.horizontalCenter = 0
      this.shootingArea = {
            pointA : 0,
            pointB : 0,
            pointC : 0,
            pointD : 0
      }
      this.resizeScreen()
      window.onresize = () => cyn.resizeScreen()
}

Caynon.prototype.resizeScreen = function () {
      this.size.width = this.canvas.width = window.innerWidth
      this.horizontalCenter = this.size.width / 2 | 0
      this.shootingArea.pointA = this.horizontalCenter - this.horizontalCenter / 4 | 0
      this.shootingArea.pointB = this.horizontalCenter + this.horizontalCenter / 4 | 0
      this.size.height = this.canvas.height = window.innerHeight
      this.shootingArea.pointC = this.size.height * .1
      this.shootingArea.pointD = this.size.height * .5
}

Caynon.prototype.shootingFireworks = function () {
      this.context.globalCompositeOperation = 'hard-light'
      this.context.fillStyle = 'rgba(20,20,20,0.15)'
      this.context.fillRect(0, 0, this.size.width, this.size.height)
      this.context.globalCompositeOperation = 'lighter'
      
      for (let firework of this.fireworks) {
            firework.shooting()

            if (firework.exploteOrNotExplote()) {               
                  this.createExplosion(firework.endPoint.x, firework.endPoint.y, firework.color, firework.getNextLevelExplote())
            }
      }

      this.extinguishFirework()
}

Caynon.prototype._random = function (min, max) {
      return Math.random() * (max - min + 1) + min | 0
}

Caynon.prototype.createNewFirework = function () {
      const x0 = this._random(this.shootingArea.pointA, this.shootingArea.pointB)
      const y0 = this.size.height
      const x1 = this._random(0, this.size.width)
      const y1 = this._random(this.shootingArea.pointC, this.shootingArea.pointD)

      const color = this._random(300, 450)
      
      const newFirewords = new Firework(x0,
            y0,
            x1,
            y1,
            color,
            this.context,
            2)

      this.fireworks.push(newFirewords)
}

Caynon.prototype.createExplosion = function (x, y, color, explote) {
      
      const PI = Math.PI * 2
      const radioOfTheExplote = this._random(30, 110)
      let start = radioOfTheExplote / 6;

      for (let i = 0; i < start; i++) {
            let targetX = x + radioOfTheExplote * Math.cos(PI * i  / start) | 0
            let targetY = y + radioOfTheExplote * Math.sin(PI * i / start) | 0
            const newFirewords = new Firework(x,
                  y,
                  targetX,
                  targetY,
                  color,
                  this.context,
                  explote
                  )

            this.fireworks.push(newFirewords)
      }
}

Caynon.prototype.extinguishFirework = function () {
      this.fireworks = this.fireworks.filter((firework) => { return firework._hitTheTarget() })
      this.context.globalCompositeOperation = "source-over";
}

function Firework(_x0, _y0, _x1, _y1, _color, _context, _exploteLevel) {
      this.startPoint = {
            x: _x0,
            y: _y0
      }
      this.endPoint = {
            x: _x1,
            y: _y1
      }
      this.color = _color
      this.context = _context
      this.history = []
      this.exploteLevel = _exploteLevel
}

Firework.prototype.shooting = function () {

      this._addNextPointToTheTrajectory()

      this._drawTrajectory()

      this._deleteOldPointInTheTrajectory()
}

Firework.prototype._hitTheTarget = function () {
      let xDiff = this.endPoint.x - this.startPoint.x
      let yDiff = this.endPoint.y - this.startPoint.y
      return Math.abs(xDiff) > 3 || Math.abs(yDiff) > 3
}

Firework.prototype._addNextPointToTheTrajectory = function () {
      if (this._hitTheTarget()) {
            this._addNewPoint()
      }
}

Firework.prototype.exploteOrNotExplote = function () {      
      const decision = !this._hitTheTarget() && this.exploteLevel !== 0
      return decision
}

Firework.prototype.getNextLevelExplote = function(){
      
      return this.exploteLevel - 1
}

Firework.prototype._drawTrajectory = function () {
      for (let i = 0; this.history.length > i; i++) {
            let point = this.history[i]
            this._drawSinglePoint(point.x, point.y)
      }
}

Firework.prototype._drawSinglePoint = function (x, y) {
      const PI = Math.PI * 2
      this.context.beginPath()
      this.context.fillStyle = 'hsl(' + this.color + ',100%,50%)'
      this.context.arc(x, y, 2, 0, PI, false)
      this.context.fill()
}

Firework.prototype._deleteOldPointInTheTrajectory = function () {
      this.history.shift()
}

Firework.prototype._addNewPoint = function () {
      let xDiff = this.endPoint.x - this.startPoint.x
      let yDiff = this.endPoint.y - this.startPoint.y

      this.startPoint.x += xDiff / 20
      this.startPoint.y += yDiff / 20

      this.history.push(this.startPoint)
}

let canvas = document.getElementById('usa')
let ctx = canvas.getContext('2d')
const cyn = new Caynon(canvas, ctx)
let counter = 0

function StartShow() {
      requestAnimationFrame(StartShow)
      if(counter === 15){
            cyn.createNewFirework()
            counter = 0
      }else{
            counter++
      }
      cyn.shootingFireworks()
}


StartShow()
const url = window.location.href
console.log(url)