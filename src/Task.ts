
enum TaskStatus{
    UNACCEPTABLE = 0,
    ACCEPTABLE = 1,
    DURING = 2,
    CAN_SUBMIT = 3,
    SUBMITTED = 4
}

class Task{
    
    public id : string;
    public name : string;
    public desc : string;
    public status : TaskStatus;
    public fromNpcId : string;
    public toNpcId : string;

    constructor(id : string,name : string,fromNpcId : string,toNpcId : string){
        this.id = id;
        this.name = name;
        this.status = TaskStatus.UNACCEPTABLE;
        this.fromNpcId = fromNpcId;
        this.toNpcId = toNpcId;

    }

    // public getId(){
    //     return this.id;
    // }

    // public getName(){
    //     return this.name;
    // }

    // public changeStatus( status : TaskStatus){
    //    this.status = status;
    // }

    // public showStatus(){
    //     return this.status;
    // }

    // public getFromNpcId(){
    //     return this.fromNpcId;
    // }

    // public getToNpcId(){
    //     return this.toNpcId;
    // }

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
        this.taskList[task.id] = task;
    }

    public addObserver(o : Observer){
        this.observerList.push(o);
    }

    public getTaskByCustomRule(rule : Function):Task{
        return rule(this.taskList);
    }

    public finish(id : string){
        if(this.taskList[id].status == TaskStatus.CAN_SUBMIT){
        this.taskList[id].status = TaskStatus.SUBMITTED;
        }
        this.notify(this.taskList[id]);
    }

    public accept(id : string){
        if(this.taskList[id].status == TaskStatus.ACCEPTABLE){
        this.taskList[id].status = TaskStatus.DURING;
        }
        this.notify(this.taskList[id]);
    }

    public canAccept(id : string){
        if(this.taskList[id].status == TaskStatus.UNACCEPTABLE){
        this.taskList[id].status = TaskStatus.ACCEPTABLE;
        }
        this.notify(this.taskList[id]);
    }

    public canFinish(id : string){
        if(this.taskList[id].status == TaskStatus.DURING){
        this.taskList[id].status = TaskStatus.CAN_SUBMIT;
        }
        this.notify(this.taskList[id]);
    }

    private notify(task : Task){
        for(var observer of this.observerList){
            observer.onChange(task);
        }
    }

    public init(){
        var config : Task[] = [
            {id : "task_00",name:"任务01",desc: "点击NPC_1,在NPC_2交任务" ,status :　TaskStatus.UNACCEPTABLE,fromNpcId : "npc_0", toNpcId: "npc_1"},
            //{id : "task_01",name:"任务02",desc: "点击NPC_2,在NPC_1交任务",status :　TaskStatus.UNACCEPTABLE,fromNpcId : "npc_1", toNpcId: "npc_0"}
        ]

        for( var i = 0 ; i <　config.length ; i++){
            this.addTask(config[i]);
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

        
        this.textField.size = 15;
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
        // for(var i = 0; i < this.taskList.length; i++){
        //     this.show[i] ="任务名 ：" + this.taskList[i].name + ":\n" +"任务内容："+ this.taskList[i].desc +" :\n" +" 任务状态 ：" + this.taskList[i].status;
        // }
        // for(var i = 0; i < this.show.length; i++){
        //     if(this.taskList[i].status == TaskStatus.DURING || this.taskList[i].status == TaskStatus.SUBMITTED || this.taskList[i].status == TaskStatus.ACCEPTABLE)
        //     this.textField.text += this.show[i] + "\n";
        // }
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
           if(this.taskList[i].id == task.id)
           {
               egret.Tween.get(this).to({alpha : 1},500);
               //this.button.touchEnabled = true;
               if(this.taskList[i].status == TaskStatus.ACCEPTABLE){
                   this.ifAccept = true;
                   var texture : egret.Texture = RES.getRes("jieshou_png");
                   //this.button.texture = texture;
               }
               if(this.taskList[i].status == TaskStatus.CAN_SUBMIT){
                   this.ifAccept = false;
                   var texture : egret.Texture = RES.getRes("wancheng_png");
                   //this.button.texture = texture;
               }
               this.show[i] ="任务名 ：" + this.taskList[i].name + " :\n " +"任务内容："+ this.taskList[i].desc +" :\n " +" 任务状态 ： " + this.taskList[i].status;
               this.duringTaskId = this.taskList[i].id;
               this.textField.text = "";
               for(var i = 0; i < this.show.length; i++){
                   if(this.taskList[i].status == TaskStatus.DURING || this.taskList[i].status == TaskStatus.CAN_SUBMIT || this.taskList[i].status == TaskStatus.ACCEPTABLE)
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
