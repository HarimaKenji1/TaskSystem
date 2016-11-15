
enum TaskStatus{
    UNACCEPTABLE = 0,
    ACCEPTABLE = 1,
    DURING = 2,
    CAN_SUBMIT = 3,
    SUBMITTED = 4
}

class Task{
    
    private id : string;
    private name : string;
    private desc : string;
    private status : TaskStatus;
    private fromNpcId : string;
    private toNpcId : string;

    constructor(id : string,name : string,fromNpcId : string,toNpcId : string){
        this.id = id;
        this.name = name;
        this.status = TaskStatus.UNACCEPTABLE;
        this.fromNpcId = fromNpcId;
        this.toNpcId = toNpcId;

    }

    public getId(){
        return this.id;
    }

    public getName(){
        return this.name;
    }

    public changeStatus( status : TaskStatus){
       this.status = status;
    }

    public showStatus(){
        return this.status;
    }

    public getFromNpcId(){
        return this.fromNpcId;
    }

    public getToNpcId(){
        return this.toNpcId;
    }

}

interface Observer{
     onChange(task : Task);
}


class TaskService{
    
    private static instance = new TaskService();

    static getInstance():TaskService{
        if(TaskService.instance == null){
            TaskService.instance = new TaskService();
        }
        
            return TaskService.instance;
    }

    private observerList : Observer[] = [];
    private taskList:{
        [index : string]:Task
    } = {};

    public addTask(task:Task){
        this.taskList[task.getId()] = task;
    }

    public addObserver(o : Observer){
        this.observerList.push(o);
    }

    public getTaskByCustomRule(rule : Function):Task{
        return rule(this.taskList);
    }

    public finish(id : string){
        if(this.taskList[id].showStatus() == TaskStatus.CAN_SUBMIT){
        this.taskList[id].changeStatus(TaskStatus.SUBMITTED);
        }
        this.notify(this.taskList[id]);
    }

    public accept(id : string){
        if(this.taskList[id].showStatus() == TaskStatus.ACCEPTABLE){
        this.taskList[id].changeStatus(TaskStatus.DURING);
        }
        this.notify(this.taskList[id]);
    }

    public canAccept(id : string){
        if(this.taskList[id].showStatus() == TaskStatus.UNACCEPTABLE){
        this.taskList[id].changeStatus(TaskStatus.ACCEPTABLE);
        }
        this.notify(this.taskList[id]);
    }

    public canFinish(id : string){
        if(this.taskList[id].showStatus() == TaskStatus.DURING){
        this.taskList[id].changeStatus(TaskStatus.CAN_SUBMIT);
        }
        this.notify(this.taskList[id]);
    }

    private notify(task : Task){
        for(var observer of this.observerList){
            observer.onChange(task);
        }
    }
}

class TaskPanel extends egret.DisplayObjectContainer implements Observer{

    textField : egret.TextField;
    //button : egret.Bitmap;
    background : egret.Bitmap;
    show : string[] = [];
    private taskList : Task[] = [];
    private ifAccept : boolean;
    private duringTaskId : string;

    constructor(){
        super();

        this.width = 256;
        this.height = 317;

        this.background = this.createBitmapByName("renwumianbanbeijing_png");
        this.addChild(this.background);
        this.background.width = 256;
        this.background.height = 317;
        this.background.x = 0;
        this.background.y = 0;

        this.textField = new egret.TextField();
        this.addChild(this.textField);
        this.textField.x = this.width / 2 - 100;
        this.textField.y = this.height / 2 ;

        
        this.textField.size = 20;
        this.textField.textColor = 0x000000;
        this.addChild(this.textField);
        this.textField.width = 200;
        this.textField.x = 30;
        this.textField.y = 80;

        // this.button = this.createBitmapByName("jieshou_gray_png");
        // this.ifAccept = true;
        // this.addChild(this.button);
        // this.button.x = 80;
        // this.button.y = 230;
        // this.button.touchEnabled = false;
        // this.button.alpha = 1;

        //this.onButtonClick();

        this.alpha = 0;

        let rule = (taskList) => {
            for(var taskId in taskList){
                //console.log(taskId);
                this.taskList.push(taskList[taskId]);
            }
        }
        TaskService.getInstance().getTaskByCustomRule(rule);
        // this.taskList = rule;
        for(var i = 0; i < this.taskList.length; i++){
            this.show[i] = this.taskList[i].getName() + " : " + this.taskList[i].showStatus();
        }
        for(var i = 0; i < this.show.length; i++){
            this.textField.text += this.show[i] + "\n";
        }
    }

    private createBitmapByName(name:string):egret.Bitmap {
        var result = new egret.Bitmap();
        var texture:egret.Texture = RES.getRes(name);
        result.texture = texture;
        return result;
    }

    onChange(task : Task){
        var i = 0;
        let rule = (taskList) => {
            for(var taskId in taskList){
                this.taskList[i] = taskList[taskId];
            }
        }
        TaskService.getInstance().getTaskByCustomRule(rule);
        for( var i = 0 ; i < this.taskList.length ; i++){
           if(this.taskList[i].getId() == task.getId())
           {
               egret.Tween.get(this).to({alpha : 1},500);
               //this.button.touchEnabled = true;
               if(this.taskList[i].showStatus() == TaskStatus.ACCEPTABLE){
                   this.ifAccept = true;
                   var texture : egret.Texture = RES.getRes("jieshou_png");
                   //this.button.texture = texture;
               }
               if(this.taskList[i].showStatus() == TaskStatus.CAN_SUBMIT){
                   this.ifAccept = false;
                   var texture : egret.Texture = RES.getRes("wancheng_png");
                   //this.button.texture = texture;
               }
               this.show[i] = this.taskList[i].getName() + " : " + this.taskList[i].showStatus();
               this.duringTaskId = this.taskList[i].getId();
               this.textField.text = "";
               for(var i = 0; i < this.show.length; i++){
                   this.textField.text += this.show[i] + "\n";
               }
               this.alpha = 1;
               //this.button.touchEnabled = true;
               break;
           }
        }

        
        // this.textField.text = "";
        // for(var i = 0; i < this.show.length - 1; i++){
        //     this.textField.text += this.show[i] + "\n";
        // }

    }

    // private onButtonClick(){
    //     this.button.addEventListener(egret.TouchEvent.TOUCH_TAP,()=>{
    //         if(this.ifAccept){
    //             TaskService.getInstance().accept(this.duringTaskId);
    //             var texture : egret.Texture = RES.getRes("wancheng_gray_png");
    //             this.button.texture = texture;
    //             //egret.Tween.get(this).to({alpha : 0},500);
    //         }
    //         if(!this.ifAccept){
    //             TaskService.getInstance().finish(this.duringTaskId);
    //             var texture : egret.Texture = RES.getRes("jieshou_gray_png");
    //             this.button.texture = texture;
    //             //egret.Tween.get(this).to({alpha : 0},500);
    //         }

    //     },this)
    // }


}
