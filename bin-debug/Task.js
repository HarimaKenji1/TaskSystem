var TaskStatus;
(function (TaskStatus) {
    TaskStatus[TaskStatus["UNACCEPTABLE"] = 0] = "UNACCEPTABLE";
    TaskStatus[TaskStatus["ACCEPTABLE"] = 1] = "ACCEPTABLE";
    TaskStatus[TaskStatus["DURING"] = 2] = "DURING";
    TaskStatus[TaskStatus["CAN_SUBMIT"] = 3] = "CAN_SUBMIT";
    TaskStatus[TaskStatus["SUBMITTED"] = 4] = "SUBMITTED";
})(TaskStatus || (TaskStatus = {}));
var Task = (function () {
    function Task(id, name, fromNpcId, toNpcId) {
        this.id = id;
        this.name = name;
        this.status = TaskStatus.UNACCEPTABLE;
        this.fromNpcId = fromNpcId;
        this.toNpcId = toNpcId;
    }
    var d = __define,c=Task,p=c.prototype;
    p.getId = function () {
        return this.id;
    };
    p.getName = function () {
        return this.name;
    };
    p.changeStatus = function (status) {
        this.status = status;
    };
    p.showStatus = function () {
        return this.status;
    };
    p.getFromNpcId = function () {
        return this.fromNpcId;
    };
    p.getToNpcId = function () {
        return this.toNpcId;
    };
    return Task;
}());
egret.registerClass(Task,'Task');
var TaskService = (function () {
    function TaskService() {
        this.observerList = [];
        this.taskList = {};
    }
    var d = __define,c=TaskService,p=c.prototype;
    TaskService.getInstance = function () {
        if (TaskService.instance == null) {
            TaskService.instance = new TaskService();
        }
        return TaskService.instance;
    };
    p.addTask = function (task) {
        this.taskList[task.getId()] = task;
    };
    p.addObserver = function (o) {
        this.observerList.push(o);
    };
    p.getTaskByCustomRule = function (rule) {
        return rule(this.taskList);
    };
    p.finish = function (id) {
        if (this.taskList[id].showStatus() == TaskStatus.CAN_SUBMIT) {
            this.taskList[id].changeStatus(TaskStatus.SUBMITTED);
        }
        this.notify(this.taskList[id]);
    };
    p.accept = function (id) {
        if (this.taskList[id].showStatus() == TaskStatus.ACCEPTABLE) {
            this.taskList[id].changeStatus(TaskStatus.DURING);
        }
        this.notify(this.taskList[id]);
    };
    p.canAccept = function (id) {
        if (this.taskList[id].showStatus() == TaskStatus.UNACCEPTABLE) {
            this.taskList[id].changeStatus(TaskStatus.ACCEPTABLE);
        }
        this.notify(this.taskList[id]);
    };
    p.canFinish = function (id) {
        if (this.taskList[id].showStatus() == TaskStatus.DURING) {
            this.taskList[id].changeStatus(TaskStatus.CAN_SUBMIT);
        }
        this.notify(this.taskList[id]);
    };
    p.notify = function (task) {
        for (var _i = 0, _a = this.observerList; _i < _a.length; _i++) {
            var observer = _a[_i];
            observer.onChange(task);
        }
    };
    TaskService.instance = new TaskService();
    return TaskService;
}());
egret.registerClass(TaskService,'TaskService');
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
        var rule = function (taskList) {
            for (var taskId in taskList) {
                //console.log(taskId);
                _this.taskList.push(taskList[taskId]);
            }
        };
        TaskService.getInstance().getTaskByCustomRule(rule);
        // this.taskList = rule;
        for (var i = 0; i < this.taskList.length; i++) {
            this.show[i] = this.taskList[i].getName() + " : " + this.taskList[i].showStatus();
        }
        for (var i = 0; i < this.show.length; i++) {
            this.textField.text += this.show[i] + "\n";
        }
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
            }
        };
        TaskService.getInstance().getTaskByCustomRule(rule);
        for (var i = 0; i < this.taskList.length; i++) {
            if (this.taskList[i].getId() == task.getId()) {
                egret.Tween.get(this).to({ alpha: 1 }, 500);
                //this.button.touchEnabled = true;
                if (this.taskList[i].showStatus() == TaskStatus.ACCEPTABLE) {
                    this.ifAccept = true;
                    var texture = RES.getRes("jieshou_png");
                }
                if (this.taskList[i].showStatus() == TaskStatus.CAN_SUBMIT) {
                    this.ifAccept = false;
                    var texture = RES.getRes("wancheng_png");
                }
                this.show[i] = this.taskList[i].getName() + " : " + this.taskList[i].showStatus();
                this.duringTaskId = this.taskList[i].getId();
                this.textField.text = "";
                for (var i = 0; i < this.show.length; i++) {
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