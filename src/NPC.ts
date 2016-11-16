class NPC  extends egret.DisplayObjectContainer implements Observer {
    private NPCId : string;
    private NPCBitmap : egret.Bitmap;
    private emoji : egret.Bitmap;
    private dialogue : string[] = [];
    //private canFinishedTaskId : string = null;
    private taskList:{
        [index : string]:Task
    } = {};

    

    constructor(npcId : string ,npcCode : string,dialogue : string[]){
        super();

        for( var i = 0 ; i < dialogue.length; i++){
            this.dialogue[i] = dialogue[i];
        }
        //console.log(npcCode);

        this.NPCId = npcId;
        this.width = 64;
        this.height = 64;


        this.NPCBitmap = this.createBitmapByName(npcCode);
        this.addChild(this.NPCBitmap);
        this.NPCBitmap.x = 0;
        this.NPCBitmap.y = 0;
        this.NPCBitmap.touchEnabled = true;

        
        this.onNPCClick();
        this.touchEnabled = true;

        this.emoji = new egret.Bitmap();

        let rule = (taskList) => {
            for(var taskId in taskList){
                if( taskList[taskId].fromNpcId == this.NPCId || taskList[taskId].toNpcId == this.NPCId){
                this.taskList[taskId] = taskList[taskId];
                }
                if(taskList[taskId].fromNpcId == this.NPCId && taskList[taskId].status == TaskStatus.UNACCEPTABLE){
                   var texture : egret.Texture = RES.getRes("tanhao_yellow_png");
                   this.emoji.texture = texture;
                   this.taskList[taskId] = taskList[taskId];
                }

                if(this.NPCId  == taskList[taskId].toNpcId && taskList[taskId].status == TaskStatus.CAN_SUBMIT){
                   var texture : egret.Texture = RES.getRes("wenhao_yellow_png");
                   this.emoji.texture = texture;
                   this.taskList[taskId] = taskList[taskId];
                }
            }
        }
        TaskService.getInstance().getTaskByCustomRule(rule);

        this.addChild(this.emoji);
        this.emoji.width = 
        this.emoji.x = 20;
        this.emoji.y = 20;
    }

    onChange(task : Task){
            if(this.NPCId == task.fromNpcId && task.status == TaskStatus.ACCEPTABLE){
               this.emoji.alpha = 1;
               var texture : egret.Texture = RES.getRes("tanhao_yellow_png");
               this.emoji.texture = texture;
               this.taskList[task.id].status = TaskStatus.ACCEPTABLE;
               return;
            }

            if(this.NPCId == task.toNpcId && task.status == TaskStatus.DURING){
                this.emoji.alpha = 1;
               var texture : egret.Texture = RES.getRes("wenhao_yellow_png");
               this.emoji.texture = texture;
               this.taskList[task.id].status = TaskStatus.DURING;
               //this.canFinishedTaskId = task.id;
               return;
            }

            // if(this.NPCId == task.toNpcId && task.status == TaskStatus.CAN_SUBMIT){
            //     this.canFinishedTaskId = task.id;
            //     return;
            // }

            // if(this.NPCId == task.toNpcId && task.status == TaskStatus.SUBMITTED){
            //     this.canFinishedTaskId = null;
            //     return;
            // }

            if(this.NPCId == task.fromNpcId && task.status != TaskStatus.ACCEPTABLE && task.status != TaskStatus.SUBMITTED){
                this.emoji.alpha = 0;
                this.taskList[task.id].status = task.status;
                return;
            }

            if(this.NPCId == task.toNpcId && task.status != TaskStatus.CAN_SUBMIT){
                this.emoji.alpha = 0;
                this.taskList[task.id].status = task.status;
                return;
            }

            


        
    }

    private onNPCClick(){
        this.NPCBitmap.addEventListener(egret.TouchEvent.TOUCH_TAP,()=>{
            //console.log(this.canFinishedTaskId);
            // if(this.canFinishedTaskId != null){
            //         if(this.NPCId == this.taskList[this.canFinishedTaskId].toNpcId && this.taskList[this.canFinishedTaskId].status == TaskStatus.DURING){
            //         DialoguePanel.getInstance().alpha = 0.8;
            //         DialoguePanel.getInstance().buttonTouchEnable(true);
            //         DialoguePanel.getInstance().setButtonBitmap("wancheng_png");
            //         DialoguePanel.getInstance().setIfAccept(false);
            //         DialoguePanel.getInstance().setDuringTaskId(this.canFinishedTaskId);
            //         DialoguePanel.getInstance().setDialogueText(this.dialogue);
            //         DialoguePanel.getInstance().setBackgroundBitmap("duihuakuang_png");
            //         TaskService.getInstance().canFinish(this.canFinishedTaskId);
            //     }
            // }

            //if( this.canFinishedTaskId == null){
            for(var taskId in this.taskList){
                //console.log(taskId);
                


                if(this.NPCId == this.taskList[taskId].fromNpcId && this.taskList[taskId].status == TaskStatus.UNACCEPTABLE){
                    DialoguePanel.getInstance().alpha = 0.8;
                    DialoguePanel.getInstance().buttonTouchEnable(true);
                    DialoguePanel.getInstance().setButtonBitmap("jieshou_png");
                    DialoguePanel.getInstance().setIfAccept(true);
                    DialoguePanel.getInstance().setDuringTaskId(taskId);
                    DialoguePanel.getInstance().setDialogueText(this.dialogue);
                    DialoguePanel.getInstance().setBackgroundBitmap("duihuakuang_png");
                    TaskService.getInstance().canAccept(taskId);
                    break;
                }

                if(this.NPCId == this.taskList[taskId].toNpcId && this.taskList[taskId].status == TaskStatus.DURING){
                    DialoguePanel.getInstance().alpha = 0.8;
                    //console.log("Give me dialogue");
                    DialoguePanel.getInstance().buttonTouchEnable(true);
                    DialoguePanel.getInstance().setButtonBitmap("wancheng_png");
                    DialoguePanel.getInstance().setIfAccept(false);
                    DialoguePanel.getInstance().setDuringTaskId(taskId);
                    DialoguePanel.getInstance().setDialogueText(this.dialogue);
                    DialoguePanel.getInstance().setBackgroundBitmap("duihuakuang_png");
                    TaskService.getInstance().canFinish(taskId);
                    break;
                }
               // }

                
            }
        },this)
    }



    private createBitmapByName(name:string):egret.Bitmap {
        var result = new egret.Bitmap();
        var texture:egret.Texture = RES.getRes(name);
        result.texture = texture;
        return result;
    }
}

class DialoguePanel extends egret.DisplayObjectContainer{

    private textField : egret.TextField;
    private button : egret.Bitmap;
    private dialogue : string[] = [];
    private background : egret.Bitmap;
    private ifAccept : boolean = false;
    private duringTaskId : string;

    private static instance = new DialoguePanel();

    static getInstance():DialoguePanel{
        if(DialoguePanel.instance == null){
            DialoguePanel.instance = new DialoguePanel();
            //DialoguePanel.instance.alpha = 1;
        }
        
            return DialoguePanel.instance;
    }


    constructor(){
        super();
        this.width = 300;
        this.height = 300;

        

        this.background = this.createBitmapByName("duihuakuang_png");
        this.addChild(this.background);
        this.background.x = 0;
        this.background.y = 0;
        this.background.width = 300;
        this.background.height = 300;


        this.button = this.createBitmapByName("jieshou_gray_png");
        this.addChild(this.button);
        this.button.width = 100;
        this.height = 50;
        this.button.x = 100;
        this.button.y = 200;
        this.button.touchEnabled = false;

        this.textField = new egret.TextField();
        this.addChild(this.textField);
        //this.textField.text = dialogue[0];
        //this.textField.text = "233"
        this.textField.width = 200;
        this.textField.x = 40;
        this.textField.y = 40;
        this.textField.size = 20;
        this.textField.textColor = 0xffffff;

        //this.alpha = 1;

        this.onClick();
    
        
    }

    public setButtonBitmap(buttonBitmapCode : string){
        var texture : egret.Texture = RES.getRes(buttonBitmapCode);
        this.button.texture = texture;
        // console.log(texture);
        // console.log(this.button.texture);
    }

    public setDialogueText(dialogue : string[]){
        for( var i = 0 ; i < dialogue.length; i++){
            this.dialogue[i] = dialogue[i];
        }
        this.textField.text = this.dialogue[0];
    }

    public setIfAccept(b : boolean){
        this.ifAccept = b;
        //console.log(this.ifAccept);
    }

    public buttonTouchEnable(b : boolean){
        this.button.touchEnabled = b;
    }

    public setDuringTaskId(taskId : string){
        this.duringTaskId = taskId;
    }

    public setBackgroundBitmap(backgroundCode :string){
        var textureBackground : egret.Texture = RES.getRes("duihuakuang_png");
                this.background.texture = textureBackground;
    }

    private onClick(){
        this.button.addEventListener(egret.TouchEvent.TOUCH_TAP,()=>{
            console.log("dialogue on click");
            if(this.ifAccept){
               TaskService.getInstance().accept(this.duringTaskId);
                var texture : egret.Texture = RES.getRes("wancheng_gray_png");
                this.button.texture = texture;
                
                egret.Tween.get(this).to({alpha : 0},1000);
            }

            if(!this.ifAccept){
                TaskService.getInstance().finish(this.duringTaskId);
                var texture : egret.Texture = RES.getRes("jieshou_gray_png");
                this.button.texture = texture;
                
                egret.Tween.get(this).to({alpha : 0},1000);
            }
        },this)
    }

    private createBitmapByName(name:string):egret.Bitmap {
        var result = new egret.Bitmap();
        var texture:egret.Texture = RES.getRes(name);
        result.texture = texture;
        return result;
    }
}