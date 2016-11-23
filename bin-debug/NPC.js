var NPC = (function (_super) {
    __extends(NPC, _super);
    function NPC(npcId, npcCode, dialogue) {
        var _this = this;
        _super.call(this);
        this.dialogue = [];
        //private canFinishedTaskId : string = null;
        this.taskList = {};
        this.canAcceptTaskList = {};
        this.canSumbitTaskList = {};
        for (var i = 0; i < dialogue.length; i++) {
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
        var rule = function (taskList) {
            for (var taskId in taskList) {
                if (taskList[taskId].fromNpcId == _this.NPCId || taskList[taskId].toNpcId == _this.NPCId) {
                    _this.taskList[taskId] = taskList[taskId];
                }
                if (taskList[taskId].fromNpcId == _this.NPCId) {
                    _this.canAcceptTaskList[taskId] = taskList[taskId];
                }
                if (taskList[taskId].toNpcId == _this.NPCId) {
                    _this.canSumbitTaskList[taskId] = taskList[taskId];
                }
                if (taskList[taskId].fromNpcId == _this.NPCId && taskList[taskId].status == TaskStatus.ACCEPTABLE) {
                    var texture = RES.getRes("tanhao_yellow_png");
                    _this.emoji.texture = texture;
                    _this.taskList[taskId] = taskList[taskId];
                }
                if (_this.NPCId == taskList[taskId].toNpcId && taskList[taskId].status == TaskStatus.CAN_SUBMIT) {
                    var texture = RES.getRes("wenhao_yellow_png");
                    _this.emoji.texture = texture;
                    _this.taskList[taskId] = taskList[taskId];
                }
            }
        };
        TaskService.getInstance().getTaskByCustomRule(rule);
        this.addChild(this.emoji);
        this.emoji.x = 20;
        this.emoji.y = 20;
    }
    var d = __define,c=NPC,p=c.prototype;
    p.onChange = function (task) {
        if (this.NPCId == task.fromNpcId && task.status == TaskStatus.ACCEPTABLE) {
            this.emoji.alpha = 1;
            var texture = RES.getRes("tanhao_yellow_png");
            this.emoji.texture = texture;
            this.taskList[task.id].status = TaskStatus.ACCEPTABLE;
            return;
        }
        if (this.NPCId == task.toNpcId && task.status == TaskStatus.CAN_SUBMIT) {
            this.emoji.alpha = 1;
            var texture = RES.getRes("wenhao_yellow_png");
            this.emoji.texture = texture;
            this.taskList[task.id].status = TaskStatus.CAN_SUBMIT;
            this.canSumbitTaskList[task.id] = task;
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
        if (this.NPCId == task.fromNpcId && task.status != TaskStatus.ACCEPTABLE && task.status != TaskStatus.SUBMITTED) {
            this.emoji.alpha = 0;
            this.taskList[task.id].status = task.status;
            for (var taskId in this.canSumbitTaskList) {
                if (this.NPCId == this.canSumbitTaskList[taskId].toNpcId
                    && this.canSumbitTaskList[taskId].status == TaskStatus.CAN_SUBMIT) {
                    this.emoji.alpha = 1;
                    var texture = RES.getRes("wenhao_yellow_png");
                    this.emoji.texture = texture;
                    return;
                }
            }
            for (var taskId in this.taskList) {
                if (this.NPCId == this.taskList[taskId].fromNpcId
                    && this.taskList[taskId].status == TaskStatus.ACCEPTABLE) {
                    this.emoji.alpha = 1;
                    var texture = RES.getRes("tanhao_yellow_png");
                    this.emoji.texture = texture;
                    return;
                }
            }
            return;
        }
        if (this.NPCId == task.toNpcId && task.status != TaskStatus.CAN_SUBMIT) {
            this.emoji.alpha = 0;
            this.taskList[task.id].status = task.status;
            for (var taskId in this.canSumbitTaskList) {
                if (this.NPCId == this.canSumbitTaskList[taskId].toNpcId
                    && this.canSumbitTaskList[taskId].status == TaskStatus.CAN_SUBMIT) {
                    this.emoji.alpha = 1;
                    var texture = RES.getRes("wenhao_yellow_png");
                    this.emoji.texture = texture;
                    return;
                }
            }
            for (var taskId in this.taskList) {
                if (this.NPCId == this.taskList[taskId].fromNpcId
                    && this.taskList[taskId].status == TaskStatus.ACCEPTABLE) {
                    this.emoji.alpha = 1;
                    var texture = RES.getRes("tanhao_yellow_png");
                    this.emoji.texture = texture;
                    return;
                }
            }
            return;
        }
    };
    p.onNPCClick = function () {
        var _this = this;
        this.NPCBitmap.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
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
            for (var taskId in _this.canSumbitTaskList) {
                if (_this.NPCId == _this.canSumbitTaskList[taskId].toNpcId && _this.canSumbitTaskList[taskId].status == TaskStatus.CAN_SUBMIT) {
                    DialoguePanel.getInstance().alpha = 0.8;
                    //console.log("Give me dialogue");
                    DialoguePanel.getInstance().buttonTouchEnable(true);
                    DialoguePanel.getInstance().setButtonBitmap("wancheng_png");
                    DialoguePanel.getInstance().setIfAccept(false);
                    DialoguePanel.getInstance().setDuringTask(_this.canSumbitTaskList[taskId]);
                    //DialoguePanel.getInstance().setDuringTaskConditionType(this.canSumbitTaskList[taskId].conditionType);
                    //DialoguePanel.getInstance().setDuringTaskCondition(this.taskList[taskId].getCondition());
                    DialoguePanel.getInstance().setDialogueText(_this.dialogue);
                    DialoguePanel.getInstance().setBackgroundBitmap("duihuakuang_png");
                    TaskService.getInstance().canFinish(taskId);
                    return;
                }
            }
            for (var taskId in _this.taskList) {
                //console.log(taskId);
                if (_this.NPCId == _this.taskList[taskId].fromNpcId && _this.taskList[taskId].status == TaskStatus.ACCEPTABLE) {
                    DialoguePanel.getInstance().alpha = 0.8;
                    DialoguePanel.getInstance().buttonTouchEnable(true);
                    DialoguePanel.getInstance().setButtonBitmap("jieshou_png");
                    DialoguePanel.getInstance().setIfAccept(true);
                    DialoguePanel.getInstance().setDuringTask(_this.taskList[taskId]);
                    //DialoguePanel.getInstance().setDuringTaskConditionType(this.taskList[taskId].conditionType);
                    //DialoguePanel.getInstance().setDuringTaskCondition(this.taskList[taskId].getCondition());
                    DialoguePanel.getInstance().setDialogueText(_this.dialogue);
                    DialoguePanel.getInstance().setBackgroundBitmap("duihuakuang_png");
                    //TaskService.getInstance().canAccept(taskId);
                    break;
                }
                if (_this.NPCId == _this.taskList[taskId].toNpcId && _this.taskList[taskId].status == TaskStatus.CAN_SUBMIT) {
                    DialoguePanel.getInstance().alpha = 0.8;
                    //console.log("Give me dialogue");
                    DialoguePanel.getInstance().buttonTouchEnable(true);
                    DialoguePanel.getInstance().setButtonBitmap("wancheng_png");
                    DialoguePanel.getInstance().setIfAccept(false);
                    DialoguePanel.getInstance().setDuringTask(_this.taskList[taskId]);
                    //DialoguePanel.getInstance().setDuringTaskConditionType(this.taskList[taskId].conditionType);
                    //DialoguePanel.getInstance().setDuringTaskCondition(this.taskList[taskId].getCondition());
                    DialoguePanel.getInstance().setDialogueText(_this.dialogue);
                    DialoguePanel.getInstance().setBackgroundBitmap("duihuakuang_png");
                    //TaskService.getInstance().canFinish(taskId);
                    break;
                }
            }
        }, this);
    };
    p.createBitmapByName = function (name) {
        var result = new egret.Bitmap();
        var texture = RES.getRes(name);
        result.texture = texture;
        return result;
    };
    return NPC;
}(egret.DisplayObjectContainer));
egret.registerClass(NPC,'NPC',["Observer"]);
var DialoguePanel = (function (_super) {
    __extends(DialoguePanel, _super);
    function DialoguePanel() {
        _super.call(this);
        this.dialogue = [];
        this.ifAccept = false;
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
    var d = __define,c=DialoguePanel,p=c.prototype;
    DialoguePanel.getInstance = function () {
        if (DialoguePanel.instance == null) {
            DialoguePanel.instance = new DialoguePanel();
        }
        return DialoguePanel.instance;
    };
    p.setButtonBitmap = function (buttonBitmapCode) {
        var texture = RES.getRes(buttonBitmapCode);
        this.button.texture = texture;
        // console.log(texture);
        // console.log(this.button.texture);
    };
    p.setDuringTaskCondition = function (taskCondition) {
        this.duringTaskCondition = taskCondition;
    };
    p.setDialogueText = function (dialogue) {
        for (var i = 0; i < dialogue.length; i++) {
            this.dialogue[i] = dialogue[i];
        }
        this.textField.text = this.dialogue[0];
    };
    p.setIfAccept = function (b) {
        this.ifAccept = b;
        //console.log(this.ifAccept);
    };
    p.buttonTouchEnable = function (b) {
        this.button.touchEnabled = b;
    };
    p.setDuringTask = function (task) {
        this.duringTask = task;
    };
    p.setDuringTaskConditionType = function (taskConditionType) {
        this.duringTaskConditionType = taskConditionType;
    };
    p.setBackgroundBitmap = function (backgroundCode) {
        var textureBackground = RES.getRes("duihuakuang_png");
        this.background.texture = textureBackground;
    };
    p.onClick = function () {
        var _this = this;
        this.button.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            console.log("dialogue on click");
            if (_this.ifAccept) {
                //TaskService.getInstance().accept(this.duringTask.id);
                _this.duringTask.accept();
                var texture = RES.getRes("wancheng_gray_png");
                _this.button.texture = texture;
                if (_this.duringTask.conditionType == "npctalk") {
                    _this.duringTask.updateProccess(1);
                }
                egret.Tween.get(_this).to({ alpha: 0 }, 1000);
            }
            if (!_this.ifAccept) {
                //TaskService.getInstance().finish(this.duringTask.id);
                _this.duringTask.submit();
                var texture = RES.getRes("jieshou_gray_png");
                _this.button.texture = texture;
                egret.Tween.get(_this).to({ alpha: 0 }, 1000);
            }
        }, this);
    };
    p.createBitmapByName = function (name) {
        var result = new egret.Bitmap();
        var texture = RES.getRes(name);
        result.texture = texture;
        return result;
    };
    DialoguePanel.instance = new DialoguePanel();
    return DialoguePanel;
}(egret.DisplayObjectContainer));
egret.registerClass(DialoguePanel,'DialoguePanel');
//# sourceMappingURL=NPC.js.map