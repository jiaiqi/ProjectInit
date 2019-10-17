<template>
  <div ref="gantt"></div>
</template>

<script>
import 'dhtmlx-gantt'
import '../assets/gantt/codebase/locale/locale_cn.js'
import config from '@/assets/gantt/ganttconfig.js'
export default {
  'name': 'gantt',
  props: {
    tasks: {
      type: Object,
      default() {
        return { data: [], links: [] }
      }
    }
    // ,
    // tasks:{
    //     type:Object,
    //     default:()=>{
    //         return null
    //     }
    // }
  },
  data() {
    return {
      // tasks:[],
    }
  },

  methods: {
    $_initGanttEvents: function () {
      gantt.init(this.$refs.gantt)
      gantt.parse(this.$props.tasks)
      gantt.config = Object.assign(gantt.config, config.config) // 设置自定义设置
      gantt.readonly = true
      // console.table(gantt.config)
      function myFunc(task) {
        if (task.priority === 1) {
          return "<div class='important'>" + task.text + " (" + task.user + ") </div>";
        } else {
          return task.text + " (" + task.user + ")";
        }


      };
      gantt.config.columns = [
        { name: "text", label: "工作名称", tree: true, template: myFunc },
        { name: "start_date", label: "开始日期", align: "center" },
        { name: "duration", label: "工期", align: "center" },
        { name: "user", label: "人员", align: "center" }
      ];


      console.log('config===task_class>', gantt.templates.task_class)
      gantt.templates.task_class = function (start, end, task) {
        console.log('config===2>', task, task.priority)
        // not-started ||  processing || complete || postpone
        switch (task.state) {
          case "not-started":
            return "tesk-default";
            break;
          case "processing":
            return "tesk-info";
            break;
          case "complete":
            return "tesk-success";
            break;
          case "postpone":
            return "tesk-danger";
            break;
        }
      }
      if (gantt.$_eventsInitialized)
        return;
      gantt.attachEvent('onTaskSelected', (id) => {
        let task = gantt.getTask(id)
        this.$emit('task-selected', task)
      })

      gantt.attachEvent('onAfterTaskAdd', (id, task) => {
        this.$emit('task-updated', id, 'inserted', task)
        task.progress = task.progress || 0
        if (gantt.getSelectedId() == id) {
          this.$emit('task-selected', task)
        }
      })

      gantt.attachEvent('onAfterTaskUpdate', (id, task) => {
        this.$emit('task-updated', id, 'updated', task)
      })

      gantt.attachEvent('onAfterTaskDelete', (id) => {
        this.$emit('task-updated', id, 'deleted')
        if (!gantt.getSelectedId()) {
          this.$emit('task-selected', null)
        }
      })

      gantt.attachEvent('onAfterLinkAdd', (id, link) => {
        this.$emit('link-updated', id, 'inserted', link)
      })

      gantt.attachEvent('onAfterLinkUpdate', (id, link) => {
        this.$emit('link-updated', id, 'updated', link)
      })

      gantt.attachEvent('onAfterLinkDelete', (id, link) => {
        this.$emit('link-updated', id, 'deleted')
      })
      gantt.$_eventsInitialized = true;
    }
  },

  mounted() {
    this.$_initGanttEvents();


  },
  watch: {
    "tasks": {//深度监听，可监听到对象、数组的变化
      handler(val, oldVal) {
        this.$_initGanttEvents()
        console.log("b.c: " + val.c, oldVal.c);//但是这两个值打印出来却都是一样的
      },
      deep: true
    }
  },
}
</script>
<style>
/* @import "../assets/gantt/dhtmlxgantt.css"; */
@import "../assets/gantt/codebase/skins/dhtmlxgantt_broadway.css";
/* @import "../assets/gantt/codebase/skins/dhtmlxgantt_material.css"; */
.important {
  color: #ff0a0a;
}
.tesk-default {
  background-color: #909399;
}
.tesk-info {
  background-color: #409eff;
}
.tesk-success {
  background-color: #67c23a;
}
.tesk-danger {
  background-color: #f56c6c;
}
.tesk-info .gantt_task_progress {
  background-color: rgb(38, 107, 177);
}
.tesk-success .gantt_task_progress {
  background-color: rgb(68, 138, 33);
}
.tesk-danger .gantt_task_progress {
  background-color: #f56c6c;
}
</style>