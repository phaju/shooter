
const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Prefab)
    rockPrefab: cc.Prefab = null;

    @property(cc.Node)
    battleship: cc.Node = null;

    @property(cc.Prefab)
    orb: cc.Prefab = null;

    @property(cc.Node)
    fireButton: cc.Node = null;

    @property(cc.Node)
    resetButton: cc.Node = null;

    @property
    numberOfRocks: number = 0;

    @property(cc.Label)
    congrats: cc.Label = null;

    minY = -100;
    maxX = 450;
    maxY = 300;
    randX = 0;
    randY = 0;
    shipPosition = null;
    rocksArray = new Array(this.numberOfRocks);
    distanceArray = new Array(this.numberOfRocks);
    currentTarget = 0;

    randomPosition() {
        this.randY = this.minY + Math.random() * (this.maxY - this.minY);
        this.randX = this.maxX * (Math.random() - 0.5) * 2;
        return cc.v2(this.randX,this.randY);
    }

    //sortRocks() {
        // One by one move boundary of unsorted subarray  
        //set current Target back to 0 for reuse of variable.
    //    this.currentTarget = 0;
    //}

    spawnNewRocks() {
        for (var i = 0; i < this.numberOfRocks; i++){
            // Make new rocks
            this.rocksArray[i] = cc.instantiate(this.rockPrefab);
            // Place the rocks inside Canvas node
            this.node.addChild(this.rocksArray[i]);
            // Place the rocks at random positions
            this.rocksArray[i].setPosition(this.randomPosition());
            // Update the distance of each rock from the ship with distance formula
            this.distanceArray[i] = Math.sqrt(Math.pow(this.shipPosition.x - this.rocksArray[i].x,2) + Math.pow(this.shipPosition.y - this.rocksArray[i].y,2));
            console.log(this.distanceArray[i]);
        }
        var temp = 0;
        for (var i = 0; i < this.numberOfRocks-1; i++)  
        {  
            for (var j = i+1; j < this.numberOfRocks; j++) {
                if (this.distanceArray[i] > this.distanceArray[j]) {
                    temp = this.distanceArray[i];
                    this.distanceArray[i] = this.distanceArray[j];
                    this.distanceArray[j] = temp;
                    temp = this.rocksArray[i];
                    this.rocksArray[i] = this.rocksArray[j];
                    this.rocksArray[j] = temp;
                }
            }
        }
    }

    onLoad () {
        this.shipPosition = this.battleship.getPosition();
        this.spawnNewRocks();
    }

    start () {
    }

    targetFire() {
        // Calculate the angle of the shot for rotation of the ship
        var targetAngleR = Math.atan2(this.rocksArray[this.currentTarget].y - this.shipPosition.y, this.rocksArray[this.currentTarget].x - this.shipPosition.x);
        var targetAngle = cc.misc.radiansToDegrees(targetAngleR);
        cc.tween(this.battleship).to(1, {angle: (- 90 + targetAngle)}).start();
        // Create the prefab for the shot
        var shot = cc.instantiate(this.orb);
        this.node.addChild(shot);
        shot.setPosition(this.shipPosition);
        console.log(this.distanceArray[this.currentTarget]);
        cc.tween(shot).delay(1).to(0.2, {position: cc.v3(this.rocksArray[this.currentTarget])}).start();
        cc.tween(this.rocksArray[this.currentTarget]).delay(1.2).to(0.2, {scale: 0}).start();
        cc.tween(shot).delay(1.2).to(0.2, {scale: 0}).start();
        this.currentTarget++;
    }

    update (dt) {
        this.resetButton.on(cc.Node.EventType.MOUSE_UP, function (Event) {
            cc.director.loadScene("Shoot");
        });
        if(this.currentTarget == this.numberOfRocks) {
            this.fireButton.destroy();
            this.congrats.string = 'Congratulations';
        }
    }
}
