//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////

class Main extends egret.DisplayObjectContainer {

    /**
     * 加载进度界面
     * Process interface loading
     */
    private loadingView:LoadingUI;

    public constructor() {
        super();
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
        
    }

    private onAddToStage(event:egret.Event) {
        //设置加载进度界面
        //Config to load process interface
        this.loadingView = new LoadingUI();
        this.stage.addChild(this.loadingView);

        //初始化Resource资源加载库
        //initiate Resource loading library
        RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.loadConfig("resource/default.res.json", "resource/");
    }

    /**
     * 配置文件加载完成,开始预加载preload资源组。
     * configuration file loading is completed, start to pre-load the preload resource group
     */
    private onConfigComplete(event:RES.ResourceEvent):void {
        RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
        RES.addEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
        RES.loadGroup("preload");
    }

    /**
     * preload资源组加载完成
     * Preload resource group is loaded
     */
    private onResourceLoadComplete(event:RES.ResourceEvent):void {
        if (event.groupName == "preload") {
            this.stage.removeChild(this.loadingView);
            RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
            RES.removeEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
            this.createGameScene();
        }
    }

    /**
     * 资源组加载出错
     *  The resource group loading failed
     */
    private onItemLoadError(event:RES.ResourceEvent):void {
        console.warn("Url:" + event.resItem.url + " has failed to load");
    }

    /**
     * 资源组加载出错
     *  The resource group loading failed
     */
    private onResourceLoadError(event:RES.ResourceEvent):void {
        //TODO
        console.warn("Group:" + event.groupName + " has failed to load");
        //忽略加载失败的项目
        //Ignore the loading failed projects
        this.onResourceLoadComplete(event);
    }

    /**
     * preload资源组加载进度
     * Loading process of preload resource group
     */
    private onResourceProgress(event:RES.ResourceEvent):void {
        if (event.groupName == "preload") {
            this.loadingView.setProgress(event.itemsLoaded, event.itemsTotal);
        }
    }

    private textfield:egret.TextField;
    private EventPoint : egret.Point = new egret.Point();
    public IdlePictures:egret.Bitmap[] = [
        this.createBitmapByName("0008_png"),this.createBitmapByName("0009_png"),this.createBitmapByName("0010_png"),
        this.createBitmapByName("0011_png"),this.createBitmapByName("0012_png"),this.createBitmapByName("0013_png"),
        this.createBitmapByName("0014_png"),this.createBitmapByName("0015_png"),this.createBitmapByName("0016_png"),
        this.createBitmapByName("0017_png"),this.createBitmapByName("0018_png"),this.createBitmapByName("0019_png")];

    public WalkingRightPictures:egret.Bitmap[] = [
        this.createBitmapByName("0024_png"),this.createBitmapByName("0025_png"),this.createBitmapByName("0026_png"),
        this.createBitmapByName("0027_png"),this.createBitmapByName("0028_png"),this.createBitmapByName("0029_png"),
        this.createBitmapByName("0030_png"),this.createBitmapByName("0031_png"),this.createBitmapByName("0032_png"),
        this.createBitmapByName("0033_png"),this.createBitmapByName("0034_png")];

    public WalkingLeftPictures:egret.Bitmap[] = [
        this.createBitmapByName("0024_2_png"),this.createBitmapByName("0025_2_png"),this.createBitmapByName("0026_2_png"),
        this.createBitmapByName("0027_2_png"),this.createBitmapByName("0028_2_png"),this.createBitmapByName("0029_2_png"),
        this.createBitmapByName("0030_2_png"),this.createBitmapByName("0031_2_png"),this.createBitmapByName("0032_2_png"),
        this.createBitmapByName("0033_2_png"),this.createBitmapByName("0034_2_png")];

    public Player : Person;
    private GoalPoint : egret.Point = new egret.Point();
    private DistancePoint : egret.Point = new egret.Point();
    private Stage01Background : egret.Bitmap;
    private MoveTime = 0;
    private map01 : TileMap;
    private astar : AStar;
    private tileX : number;
    private tileY : number;
    private tileSize = 64;
    private ifFindAWay : boolean = false;
    private currentPath : number = 0;
    private movingTime = 32;
    private ifOnGoal = false;
    private ifStartMove = false;
    private playerx : number;
    private playery : number;
    private playerBitX : number;
    private playerBitY : number;
    private task01 : Task;
    //private task02 : Task = new Task("task_");
    private taskService : TaskService /*= TaskService.getInstance() */;
    private taskPanel : TaskPanel;
    private NPC01 : NPC;
    private NPC02 : NPC;
    private Npc01Dialogue : string[] = ["你好我是NPC01"]
    private Npc02Dialogue : string[] = ["你好我是NPC02"]
    private dialoguePanel : DialoguePanel; 
    private screenService :ScreenService;

    
    /**
     * 创建游戏场景
     * Create a game scene
     */
    private createGameScene():void {
        // this.Stage01Background = this.createBitmapByName("BackGround_jpg");
        // this.addChild(this.Stage01Background);
        // this.Stage01Background.width = stageH * 3.1;
        // this.Stage01Background.height = stageH;
        // this.Stage01Background.x = -stageH * 3.1 / 2;
        // this.Stage01Background.y = 0;
        this.Player  = new Person();
        var stageW:number = this.stage.stageWidth;
        var stageH:number = this.stage.stageHeight;

        this.map01 = new TileMap();
        this.addChild(this.map01);

        TaskService.getInstance();
        //TaskService.getInstance().init();
        
        
        this.task01 = creatTask("task_00")
        TaskService.getInstance().addTask(this.task01);
        TaskService.getInstance().addTask(creatTask("task_01"));
        this.taskPanel = new TaskPanel();
        TaskService.getInstance().addObserver(this.taskPanel);
        

        
        this.addChild(this.taskPanel);
        this.taskPanel.x = this.stage.width - this.taskPanel.width;
        this.taskPanel.y = 0;

        


        this.NPC01 = new NPC("npc_0","NPC_Man_01_png",this.Npc01Dialogue);
        this.NPC02 = new NPC("npc_1","NPC_Man_02_png",this.Npc02Dialogue);
        TaskService.getInstance().addObserver(this.NPC01);
        TaskService.getInstance().addObserver(this.NPC02);

        this.screenService = new ScreenService();
        var slime = this.createBitmapByName("Slime_png");
        this.addChild(slime);
        slime.x = 64 * 5;
        slime.y = 64 * 4;
        slime.touchEnabled = true;

        slime.addEventListener(egret.TouchEvent.TOUCH_TAP,(e : egret.TouchEvent)=>{
            this.screenService.monsterBeenKilled("task_01");
        },this)


        this.addChild(this.NPC01);
        this.NPC01.x = 128;
        this.NPC01.y = 128;

        this.addChild(this.NPC02);
        this.NPC02.x = 256;
        this.NPC02.y = 256;

        this.dialoguePanel = DialoguePanel.getInstance() ;
        this.addChild(this.dialoguePanel);
        this.dialoguePanel.x = 200;
        this.dialoguePanel.y = 200;

        

         this.addChild(this.Player.PersonBitmap);
         this.Player.PersonBitmap.x = 0;
         this.Player.PersonBitmap.y = 0;

         this.map01.startTile = this.map01.getTile(0,0);
         this.map01.endTile = this.map01.getTile(0,0);
         //this.map01.setEndTile(2,1);

         this.astar = new AStar();

         
       

        //根据name关键字，异步获取一个json配置文件，name属性请参考resources/resource.json配置文件的内容。
        // Get asynchronously a json configuration file according to name keyword. As for the property of name please refer to the configuration file of resources/resource.json.
        //RES.getResAsync("description_json", this.startAnimation, this)
            this.stage.addEventListener(egret.TouchEvent.TOUCH_BEGIN,(e : egret.TouchEvent)=>{
            //egret.Tween.removeTweens(this.Player.PersonBitmap);
            this.ifStartMove = true;
            //var tempTile : Tile;
            this.playerx = Math.floor(this.Player.PersonBitmap.x / this.tileSize);
            this.playery = Math.floor(this.Player.PersonBitmap.y / this.tileSize);
            this.playerBitX = this.Player.PersonBitmap.x;
            this.playerBitY = this.Player.PersonBitmap.y;
            this.map01.startTile = this.map01.getTile(this.playerx,this.playery);
            this.currentPath = 0;
            //console.log(playerx + " And " + playery);
            this.EventPoint.x = e.stageX;
            this.EventPoint.y = e.stageY;
            this.tileX = Math.floor(this.EventPoint.x / this.tileSize);
            this.tileY = Math.floor(this.EventPoint.y / this.tileSize);
            
            // if(this.map01.getTile(this.tileX,this.tileY).tileData.walkable)
            // {
            //     
            // }
            //this.map01.setEndTile(this.tileX,this.tileY);
            this.map01.endTile = this.map01.getTile(this.tileX,this.tileY);
            this.ifFindAWay = this.astar.findPath(this.map01);
            if(this.ifFindAWay){
                this.Player.SetState(new WalkingState(),this);
                this.currentPath = 0;
            }

            for(let i = 0 ; i < this.astar.pathArray.length ; i++){
                console.log(this.astar.pathArray[i].x + " And " + this.astar.pathArray[i].y);
            }
            // egret.Ticker.getInstance().register(()=>{
            // if(!this.IfOnGoal(this.map01.getTile(1,0))){
            //    this.Player.PersonBitmap.x++;
            // }
            // },this)
            
            
            //console.log(this.map01.endTile.x + " And " + this.map01.endTile.y);
            
        
            // while(this.Player.PersonBitmap.x != this.GoalPoint.x || this.Player.PersonBitmap.y != this.GoalPoint.y){
            //     egret.Ticker.getInstance().register(()=>{
            //        this.Player.PersonBitmap.x += 1;
            //         this.Player.PersonBitmap.y += 1;
            //     },this)
            // }
            // this.PictureMove(this.Stage01Background);

            if(this.ifFindAWay)
            this.map01.startTile = this.map01.endTile;
        },this)
        
            //this.PlayerMove();
        
        
            this.PlayerAnimation();
            
        
            
    }

    /**
     * 根据name关键字创建一个Bitmap对象。name属性请参考resources/resource.json配置文件的内容。
     * Create a Bitmap object according to name keyword.As for the property of name please refer to the configuration file of resources/resource.json.
     */
    private createBitmapByName(name:string):egret.Bitmap {
        var result = new egret.Bitmap();
        var texture:egret.Texture = RES.getRes(name);
        result.texture = texture;
        return result;
    }

    /**
     * 描述文件加载成功，开始播放动画
     * Description file loading is successful, start to play the animation
     */
    // private startAnimation(result:Array<any>):void {
    //     var self:any = this;

    //     var parser = new egret.HtmlTextParser();
    //     var textflowArr:Array<Array<egret.ITextElement>> = [];
    //     for (var i:number = 0; i < result.length; i++) {
    //         textflowArr.push(parser.parser(result[i]));
    //     }

    //     var textfield = self.textfield;
    //     var count = -1;
    //     var change:Function = function () {
    //         count++;
    //         if (count >= textflowArr.length) {
    //             count = 0;
    //         }
    //         var lineArr = textflowArr[count];

    //         self.changeDescription(textfield, lineArr);

    //         var tw = egret.Tween.get(textfield);
    //         tw.to({"alpha": 1}, 200);
    //         tw.wait(2000);
    //         tw.to({"alpha": 0}, 200);
    //         tw.call(change, self);
    //     };

        
    // }

   public PlayerMove(){
       var self:any = this;
       
       egret.Ticker.getInstance().register(()=>{
    if(this.ifStartMove && self.ifFindAWay){
       if(self.currentPath < self.astar.pathArray.length - 1){ 
            var distanceX = self.astar.pathArray[self.currentPath + 1].x - self.astar.pathArray[self.currentPath].x;
            var distanceY = self.astar.pathArray[self.currentPath + 1].y - self.astar.pathArray[self.currentPath].y;
            //console.log(distanceX + "And" + distanceY);

            if(distanceX > 0){
            self.Player.SetRightOrLeftState(new GoRightState(),self);
            }
            if(distanceX <= 0){
            self.Player.SetRightOrLeftState(new GoLeftState(),self);
            }
            if(!self.IfOnGoal(self.astar.pathArray[self.currentPath + 1])){
               self.Player.PersonBitmap.x += distanceX / self.movingTime;
               self.Player.PersonBitmap.y += distanceY / self.movingTime;
            }
            else{
               self.currentPath += 1;
            }
          }
    }
    if(this.ifStartMove && !self.ifFindAWay){
        var distanceX = self.map01.startTile.x - self.playerBitX;
        var distanceY = self.map01.startTile.y - self.playerBitY;
        if(distanceX > 0){
            self.Player.SetRightOrLeftState(new GoRightState(),self);
            }
            if(distanceX <= 0){
            self.Player.SetRightOrLeftState(new GoLeftState(),self);
            }
        if(!self.IfOnGoal(self.map01.startTile)){
               self.Player.PersonBitmap.x += distanceX / self.movingTime;
               self.Player.PersonBitmap.y += distanceY / self.movingTime;
            }
            else
            self.Player.SetState(new IdleState(),self);
    }
        },self)


    //    for( self.currentPath = 0 ; self.currentPath < self.astar.pathArray.length - 1; self.currentPath++){
    //         var distanceX = self.astar.pathArray[self.currentPath + 1].x - self.astar.pathArray[self.currentPath].x;
    //         var distanceY = self.astar.pathArray[self.currentPath + 1].y - self.astar.pathArray[self.currentPath].y;
    //         if(distanceX < 0){
    //         self.Player.SetRightOrLeftState(new GoRightState(),self);
    //         }
    //         if(distanceX >= 0){
    //         self.Player.SetRightOrLeftState(new GoLeftState(),self);
    //         }
    //         egret.Tween.get(self.Player.PersonBitmap).to({x : self.Player.PersonBitmap.x + distanceX,y : self.Player.PersonBitmap.y + distanceY} , Math.abs(distanceX) * 3 + Math.abs(distanceY) * 3);
    //         self.MoveTime = Math.abs(distanceX) * 3 + Math.abs(distanceY) * 3;
    //    }
      
   }



    public PictureMove(pic : egret.Bitmap):void{
        var self:any = this;
        var MapMove:Function = function (){
            egret.Tween.removeTweens(pic);
            var dis = self.Player.PersonBitmap.x - self.EventPoint.x;
        if(self.Player.GetIfGoRight() && pic.x >= - (pic.width - self.stage.stageWidth) ){
            egret.Tween.get(pic).to({x : pic.x - Math.abs(dis)},self.MoveTime);
        }

        if(self.Player.GetIfGoLeft() && pic.x <= 0){
            egret.Tween.get(pic).to({x : pic.x + Math.abs(dis)},self.MoveTime);
        }
        //egret.Tween.get(pic).call(MapMove,self);
        }
        MapMove();
    }


    public IfOnGoal(tile : Tile) : any{
        var self:any = this;
        if(self.Player.PersonBitmap.x == tile.x && self.Player.PersonBitmap.y == tile.y)
        this.ifOnGoal = true;
        else 
        this.ifOnGoal = false;
        //console.log(Math.floor(self.Player.PersonBitmap.x - 42 / tile.x) + " And " + Math.floor(self.Player.PersonBitmap.y - 64 / tile.y));
        return this.ifOnGoal;

    }


    public PlayerAnimation():void{
        var self:any = this;
        var n = 0;
        var GOR = 0;
        var GOL = 0;
        var zhen = 0;
        var zhen2 = 0;
        var zhen3 = 0;
        var standArr = ["08","09","10","11","12","13","14","15","16","17","18","19"];
        var walkRightArr = ["24","25","26","27","28","29","30","31","32","33","34",];

        var MoveAnimation:Function = function (){
            //var playerBitmap = egret.Tween.get(self.Player.PersonBitmap);
               
                
                egret.Ticker.getInstance().register(()=>{
                if(zhen % 4 == 0){
                    
                    if(self.Player.GetIfIdle() && !self.Player.GetIfWalk()){
                    GOR = 0;
                    GOL = 0;
                    var textureName = "00" + standArr[n] + "_png";
                    var texture : egret.Texture = RES.getRes(textureName);
                    self.Player.PersonBitmap.texture = texture;
                    n++;
                    if(n >= standArr.length){
                          n=0;
                          }
                          }
                          



                    if(self.Player.GetIfWalk() && self.Player.GetIfGoRight() && !self.Player.GetIfIdle()){
                        n = 0;
                        GOL = 0;
                    var textureName = "00" + walkRightArr[GOR] + "_png";
                    var texture : egret.Texture = RES.getRes(textureName);
                    self.Player.PersonBitmap.texture = texture;
                    GOR++;
                    if(GOR >= walkRightArr.length){
                          GOR=0;
                          }
                          }

                          if(self.Player.GetIfWalk() && self.Player.GetIfGoLeft() && !self.Player.GetIfIdle()){
                              n = 0;
                              GOR = 0;
                    var textureName = "00" + walkRightArr[GOL] + "_2_png";
                    var texture : egret.Texture = RES.getRes(textureName);
                    self.Player.PersonBitmap.texture = texture;
                    GOL++;
                    if(GOL >= walkRightArr.length){
                          GOL=0;
                          }
                    }

                    }


                    if(self.IfOnGoal(self.map01.endTile)){
                     self.Player.SetState(new IdleState(),self);
                    }
                },self);

                // var texture : egret.Texture = self.IdlePictures[n];
                // self.PlayerPic.texture = texture;

                       
                //        egret.Tween.get(self.PlayerPic).to(self.IdlePictures[n],0);
                //        egret.Tween.get(self.PlayerPic).wait(42);
                //        n++;
                //        if(n >= self.IdlePictures.length){
                //           n=0;
                //           }
            
            //egret.Tween.get(self.Player.PersonBitmap).call(IdleAnimation,self);
        }

        

        

        

        var FramePlus : Function = function(){
            egret.Ticker.getInstance().register(()=>{
            zhen++;
            if(zhen == 400)
            zhen = 0;
            },self)
        }




        MoveAnimation();
        
        FramePlus();
    }

    /**
     * 切换描述内容
     * Switch to described content
     */
    // private changeDescription(textfield:egret.TextField, textFlow:Array<egret.ITextElement>):void {
    //     textfield.textFlow = textFlow;
    // }
}


class Person{
    public PersonBitmap : egret.Bitmap;
    private IsIdle : boolean;
    private IsWalking : boolean;
    private GoRight : boolean = false;
    private GoLeft : boolean = false;
    private IdleOrWalkStateMachine : StateMachine;
    private LeftOrRightStateMachine : StateMachine;

    constructor(){
        this.PersonBitmap = new egret.Bitmap();
        this.PersonBitmap.width = 49;
        this.PersonBitmap.height = 64;
        // this.PersonBitmap.anchorOffsetX = 2 * this.PersonBitmap.width / 3;
        // this.PersonBitmap.anchorOffsetY = this.PersonBitmap.height;
        this.IsIdle = true;
        this.IsWalking = false;
        this.IdleOrWalkStateMachine = new StateMachine();
        this.LeftOrRightStateMachine = new StateMachine();

    }

    public SetPersonBitmap(picture:egret.Bitmap){
        this.PersonBitmap = picture;
    }


    public SetIdle(set : boolean){
        this.IsIdle = set;
    }

    public GetIfIdle(): boolean{
        return this.IsIdle;
    }

    public SetWalk(set : boolean){
        this.IsWalking = set;
    }

    public GetIfWalk(): boolean{
        return this.IsWalking
    }

    public SetGoRight(){
        this.GoRight = true;
        this.GoLeft = false;
    }

    public GetIfGoRight(): boolean{
        return this.GoRight;
    }

    public SetGoLeft(){
        this.GoLeft = true;
        this.GoRight = false;
    }

    public GetIfGoLeft() : boolean{
        return this.GoLeft;
    }

    private createBitmapByName(name:string):egret.Bitmap {
        var result = new egret.Bitmap();
        var texture:egret.Texture = RES.getRes(name);
        result.texture = texture;
        return result;
    }

    public SetState(e : State , _tmain : Main){
        this.IdleOrWalkStateMachine.setState(e,_tmain);
    }

    public SetRightOrLeftState(e : State , _tmain : Main){
        this.LeftOrRightStateMachine.setState(e,_tmain);
    }


}

interface State{
    OnState(_tmain : Main);

    ExitState(_tmain : Main);

}

class PeopleState implements State{
      OnState(_tmain : Main){};

      ExitState(_tmain : Main){};
}

class StateMachine{
     CurrentState : State;

     setState( e : State , _tmain : Main){
        if( this.CurrentState != null){
           this.CurrentState.ExitState(_tmain);
        }
        this.CurrentState = e;
        this.CurrentState.OnState(_tmain);
     }
}


class IdleState implements PeopleState{

    OnState(_tmain : Main){
        _tmain.Player.SetIdle(true);
        _tmain.Player.SetWalk(false);
    };

    ExitState(_tmain : Main){
        _tmain.Player.SetIdle(false);
    };

}

class WalkingState implements PeopleState{
      OnState(_tmain : Main){
        _tmain.Player.SetIdle(false);
        _tmain.Player.SetWalk(true);
    };

    ExitState(_tmain : Main){
        _tmain.Player.SetWalk(false);
    };
}

class GoRightState implements PeopleState{
    OnState(_tmain : Main){
        _tmain.Player.SetGoRight();
    };

    ExitState(_tmain : Main){};

}

class GoLeftState implements PeopleState{
    OnState(_tmain : Main){
        _tmain.Player.SetGoLeft();
    };

    ExitState(_tmain : Main){};

}

