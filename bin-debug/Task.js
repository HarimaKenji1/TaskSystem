var TaskStatus;
(function (TaskStatus) {
    TaskStatus[TaskStatus["UNACCEPTABLE"] = 0] = "UNACCEPTABLE";
    TaskStatus[TaskStatus["ACCEPTABLE"] = 1] = "ACCEPTABLE";
    TaskStatus[TaskStatus["DURING"] = 2] = "DURING";
    TaskStatus[TaskStatus["CAN_SUBMIT"] = 3] = "CAN_SUBMIT";
    TaskStatus[TaskStatus["SUBMITTED"] = 4] = "SUBMITTED";
})(TaskStatus || (TaskStatus = {}));
var EventEmitter = (function () {
    function EventEmitter() {
        this.observerList = [];
    }
    var d = __define,c=EventEmitter,p=c.prototype;
    // constructor(){
    //     this.observerList = [];
    // }
    p.addObserver = function (o) {
        this.observerList.push(o);
    };
    p.notify = function (task) {
        for (var _i = 0, _a = this.observerList; _i < _a.length; _i++) {
            var observer = _a[_i];
            observer.onChange(task);
        }
    };
    return EventEmitter;
}());
egret.registerClass(EventEmitter,'EventEmitter');
var Task = (function (_super) {
    __extends(Task, _super);
    function Task(id, name, desc, total, status, taskcondition, conditiontype, fromNpcId, toNpcId, preTaskListId) {
        _super.call(this);
        this.current = 0;
        this.total = 100;
        this.preTaskListId = [];
        this.id = id;
        this.name = name;
        this.desc = desc;
        this.status = status;
        this.total = total;
        this.taskCondition = taskcondition;
        this.fromNpcId = fromNpcId;
        this.toNpcId = toNpcId;
        this.conditionType = conditiontype;
        this.preTaskListId = preTaskListId;
        this.addObserver(TaskService.getInstance());
    }
    var d = __define,c=Task,p=c.prototype;
    p.getCurrent = function () {
        return this.current;
    };
    p.setCurrent = function (n) {
        this.current += n;
        this.checkStatus();
    };
    p.checkStatus = function () {
        if (this.current >= this.total) {
            TaskService.getInstance().canFinish(this.id);
            this.notify(this);
        }
    };
    p.onChange = function (task) {
        if (this.id == task.id) {
            this.updateProccess(1);
        }
    };
    // public getCondition(){
    //     return this.taskCondition;
    // }
    p.canAccept = function () {
        if (this.status == TaskStatus.UNACCEPTABLE) {
            this.status = TaskStatus.ACCEPTABLE;
            this.notify(this);
        }
    };
    ;
    p.accept = function () {
        if (this.status == TaskStatus.ACCEPTABLE) {
            this.status = TaskStatus.DURING;
            this.notify(this);
        }
    };
    ;
    p.submit = function () {
        if (this.status == TaskStatus.CAN_SUBMIT) {
            this.status = TaskStatus.SUBMITTED;
            this.notify(this);
        }
    };
    ;
    p.updateProccess = function (n) {
        if (this.status == TaskStatus.DURING) {
            this.taskCondition.updateProccess(this, n);
        }
    };
    return Task;
}(EventEmitter));
egret.registerClass(Task,'Task',["TaskConditionContext","Observer"]);
var NPCTalkTaskCondition = (function () {
    function NPCTalkTaskCondition() {
    }
    var d = __define,c=NPCTalkTaskCondition,p=c.prototype;
    p.canAccept = function (task) { };
    p.onSubmit = function (task) { };
    p.getCondition = function () {
        return this;
    };
    p.updateProccess = function (task, num) {
        task.setCurrent(num);
    };
    return NPCTalkTaskCondition;
}());
egret.registerClass(NPCTalkTaskCondition,'NPCTalkTaskCondition',["TaskCondition"]);
var KillMonsterTaskCondition = (function () {
    function KillMonsterTaskCondition() {
    }
    var d = __define,c=KillMonsterTaskCondition,p=c.prototype;
    p.onAccept = function (task) { };
    p.onSubmit = function (task) { };
    p.getCondition = function () {
        return this;
    };
    p.updateProccess = function (task, num) {
        task.setCurrent(num);
    };
    return KillMonsterTaskCondition;
}());
egret.registerClass(KillMonsterTaskCondition,'KillMonsterTaskCondition',["TaskCondition"]);
var TaskService = (function (_super) {
    __extends(TaskService, _super);
    function TaskService() {
        _super.apply(this, arguments);
        this.taskList = {};
    }
    var d = __define,c=TaskService,p=c.prototype;
    TaskService.getInstance = function () {
        if (TaskService.instance == null) {
            TaskService.instance = new TaskService();
        }
        return TaskService.instance;
    };
    //private observerList : Observer[] = [];
    p.addTask = function (task) {
        this.taskList[task.id] = task;
    };
    // public addObserver(o : Observer){
    //     this.observerList.push(o);
    // }
    p.getTaskByCustomRule = function (rule) {
        return rule(this.taskList);
    };
    p.finish = function (id) {
        if (this.taskList[id].status == TaskStatus.CAN_SUBMIT) {
            this.taskList[id].status = TaskStatus.SUBMITTED;
        }
        this.notify(this.taskList[id]);
    };
    p.accept = function (id) {
        if (this.taskList[id].status == TaskStatus.ACCEPTABLE) {
            this.taskList[id].status = TaskStatus.DURING;
        }
        this.notify(this.taskList[id]);
    };
    p.canAccept = function (id) {
        if (this.taskList[id].status == TaskStatus.UNACCEPTABLE) {
            this.taskList[id].status = TaskStatus.ACCEPTABLE;
        }
        this.notify(this.taskList[id]);
    };
    p.canFinish = function (id) {
        if (this.taskList[id].status == TaskStatus.DURING) {
            this.taskList[id].status = TaskStatus.CAN_SUBMIT;
        }
        this.notify(this.taskList[id]);
    };
    // public notify(task : Task){
    //     for(var observer of this.observerList){
    //         observer.onChange(task);
    //     }
    // }
    p.onChange = function (task) {
        this.taskList[task.id] = task;
        this.notify(this.taskList[task.id]);
        for (var taskId in this.taskList) {
            if (this.taskList[taskId].status == TaskStatus.UNACCEPTABLE) {
                var canAccept = true;
                for (var _i = 0, _a = this.taskList[taskId].preTaskListId; _i < _a.length; _i++) {
                    var preId = _a[_i];
                    if (preId != "null") {
                        if (this.taskList[preId].status != TaskStatus.SUBMITTED) {
                            canAccept = false;
                            break;
                        }
                    }
                }
                if (canAccept) {
                    this.canAccept(taskId);
                }
            }
        }
    };
    return TaskService;
}(EventEmitter));
egret.registerClass(TaskService,'TaskService',["Observer"]);
function creatTaskCondition(id) {
    var data = {
        "npctalk": { condition: new NPCTalkTaskCondition() },
        "killmonster": { condition: new KillMonsterTaskCondition() }
    };
    // if (id == "npctalk") {
    //     var n = new NPCTalkTaskCondition();
    //     return n;
    // }
    // else if (id == "killmonster") {
    //     var k = new KillMonsterTaskCondition();
    //     return k;
    // }
    // else
    var info = data[id];
    if (!info) {
        console.error('missing task');
    }
    return info.condition;
}
function creatTask(id) {
    var data = {
        "task_00": { name: "任务01", desc: "点击NPC_1,在NPC_2交任务", total: 1, status: TaskStatus.ACCEPTABLE, condition: "npctalk", fromNpcId: "npc_0", toNpcId: "npc_1", preTaskListId: ["null"] },
        "task_01": { name: "任务02", desc: "点击NPC_2,杀死十只怪物后点NPC_2交任务", total: 10, status: TaskStatus.UNACCEPTABLE, condition: "killmonster", fromNpcId: "npc_1", toNpcId: "npc_1", preTaskListId: ["task_00"] },
    };
    var info = data[id];
    if (!info) {
        console.error('missing task');
    }
    var condition = this.creatTaskCondition(info.condition);
    return new Task(id, info.name, info.desc, info.total, info.status, condition, info.condition, info.fromNpcId, info.toNpcId, info.preTaskListId);
}
var TaskPanel = (function (_super) {
    __extends(TaskPanel, _super);
    function TaskPanel() {
        var _this = this;
        _super.call(this);
        this.show = [];
        this.taskList = [];
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
        this.textField.y = this.height / 2;
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
        var rule = function (taskList) {
            for (var taskId in taskList) {
                //console.log(taskId);
                _this.taskList.push(taskList[taskId]);
            }
        };
        TaskService.getInstance().getTaskByCustomRule(rule);
        //this.taskList = rule;
        // for(var i = 0; i < this.taskList.length; i++){
        //     this.show[i] ="任务名 ：" + this.taskList[i].name + ":\n" +"任务内容："+ this.taskList[i].desc +" :\n" +" 任务状态 ：" + this.taskList[i].status;
        // }
        // for(var i = 0; i < this.show.length; i++){
        //     if(this.taskList[i].status == TaskStatus.DURING || this.taskList[i].status == TaskStatus.SUBMITTED || this.taskList[i].status == TaskStatus.ACCEPTABLE)
        //     this.textField.text += this.show[i] + "\n";
        // }
    }
    var d = __define,c=TaskPanel,p=c.prototype;
    p.createBitmapByName = function (name) {
        var result = new egret.Bitmap();
        var texture = RES.getRes(name);
        result.texture = texture;
        return result;
    };
    p.onChange = function (task) {
        var _this = this;
        var i = 0;
        var rule = function (taskList) {
            for (var taskId in taskList) {
                _this.taskList[i] = taskList[taskId];
                i++;
            }
        };
        TaskService.getInstance().getTaskByCustomRule(rule);
        for (var i = 0; i < this.taskList.length; i++) {
            if (this.taskList[i].id == task.id) {
                egret.Tween.get(this).to({ alpha: 1 }, 500);
                //this.button.touchEnabled = true;
                // if (this.taskList[i].status == TaskStatus.ACCEPTABLE) {
                //     this.ifAccept = true;
                //     var texture: egret.Texture = RES.getRes("jieshou_png");
                //     //this.button.texture = texture;
                // }
                // if (this.taskList[i].status == TaskStatus.CAN_SUBMIT) {
                //     this.ifAccept = false;
                //     var texture: egret.Texture = RES.getRes("wancheng_png");
                //     //this.button.texture = texture;
                // }
                this.show[i] = "任务名 ：" + this.taskList[i].name + " :\n " + "任务内容：" + this.taskList[i].desc + " :\n " + " 任务状态 ： " + this.taskList[i].status;
                this.duringTaskId = this.taskList[i].id;
                this.textField.text = "";
                for (var i = 0; i < this.show.length; i++) {
                    if (this.taskList[i].status == TaskStatus.DURING || this.taskList[i].status == TaskStatus.CAN_SUBMIT || this.taskList[i].status == TaskStatus.ACCEPTABLE)
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
    };
    return TaskPanel;
}(egret.DisplayObjectContainer));
egret.registerClass(TaskPanel,'TaskPanel',["Observer"]);
//# sourceMappingURL=Task.js.map