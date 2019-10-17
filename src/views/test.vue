<template>
    <div class="container">
        <gantt class="left-container" :tasks="tasks"  @task-updated="logTaskUpdate" @link-updated="logLinkUpdate" @task-selected="selectTask"></gantt>
        <!-- <div class="right-container">
            <div class="gantt-selected-info">
                <div v-if="selectedTask">
                <h2>{{selectedTask.text}}</h2>
                <span><b>ID: </b>{{selectedTask.id}}</span><br/>
                <span><b>Progress: </b>{{selectedTask.progress|toPercent}}%</span><br/>
                <span><b>Start Date: </b>{{selectedTask.start_date|niceDate}}</span><br/>
                <span><b>End Date: </b>{{selectedTask.end_date|niceDate}}</span><br/>
                </div>
                <div v-else class="select-task-prompt">
                <h2>Click any task</h2>
                </div>
            </div>
            <ul class="gantt-messages">
                <li class="gantt-message" v-for="message in messages">{{message}}</li>
            </ul>
        </div> -->
    </div>
</template>
<script>
import Gantt from '../components/gantt.vue';
export default {
    components:{Gantt},
    data(){
        return {
            tasks: {
                data: [
                    {
                        text: '填写推进策划书',//任务名
                        start_date: '19-04-2017',//开始时间
                        id: 1,//任务id
                        duration: 13,//任务时长，从start_date开始计算
                        progress: 0.6,//任务完成情况，进度
                        parent: 2,//父任务ID
                        user: "李四",//成员
                        planned_end:'19-04-2017', //计划开始时间
                        planned_start:'10-04-2017',//计划结束时间
                        show:false,
                        open: true,//默认是否打开
                        priority:1,
                        isUpdata:true, // 自定义是否有编辑
                        state:'processing',  // not-started ||  processing || complete || postpone
                        type: 'project'// gantt.config.types.milestone为里程碑类型
                                // project为项目任务类型，也就是摘要任务，
                                // task为普通任务类型
                    },
                    {id: 2, text: '提交标前调查报告', start_date: '15-04-2017', duration: 3, open: true,progress: 0.6,
                        priority:2,user: "李er",isUpdata:false, // 自定义是否有编辑
                        state:'complete'//成员
                        },
                    {id: 3, text: '开标', start_date: '18-04-2017', duration: 3, open: true,progress: 0.4,
                        priority:3,user: "李yi",isUpdata:true, // 自定义是否有编辑
                        state:'postpone'//成员
                        }
                ],
                links: [// links为任务之间连接的线
                    // {id: 1, source: 1, target: 2, type: '0'}//source根源 target目标 也就是从id为1的指向id为2的
                //type:'0'是从1任务完成到2任务开始，type:'1'是1任务开始到2任务开始，
                //type:'2'是从1任务完成到2任务完成，type:'3'是从1任务开始到2任务完成
                ]
            },
            selectedTask: null,
                messages: []
        }
    },
    filters: {
      toPercent (val) {
        if(!val) return '0'
        return Math.round((+val) * 100)
      },
      niceDate (obj){
        return `${obj.getFullYear()} / ${obj.getMonth() + 1} / ${obj.getDate()}`
      }
    },
    methods: {
        selectTask (task) {
        this.selectedTask = task
        },
    
        addMessage (message) {
        this.messages.unshift(message)
        if(this.messages.length > 40) {
            this.messages.pop()
        }
        },

        logTaskUpdate (id, mode, task) {
        let text = (task && task.text ? ` (${task.text})`: '')
        let message = `Task ${mode}: ${id} ${text}`
        this.addMessage(message)
        },

        logLinkUpdate (id, mode, link) {
        let message = `Link ${mode}: ${id}`
        if(link){
            message += ` ( source: ${link.source}, target: ${link.target} )`
        }
        this.addMessage(message)
        }
    }
}
</script>
<style>
html, body {
    height: 100%;
    margin: 0;
    padding: 0;
  }

  .container {
    height: 100vh;
    width: 100%;
  }

  .left-container {
    overflow: hidden;
    position: relative;
    height: 100%;
  }

  .right-container {
    border-right: 1px solid #cecece;
    float: right;
    height: 100%;
    width: 340px;
    box-shadow: 0 0 5px 2px #aaa;
    position: relative;
    z-index:2;
  }

  .gantt-messages {
    list-style-type: none;
    height: 50%;
    margin: 0;
    overflow-x: hidden;
    overflow-y: auto;
    padding-left: 5px;
  }

  .gantt-messages > .gantt-message {
    background-color: #f4f4f4;
    box-shadow:inset 5px 0 #d69000;
    font-family: Geneva, Arial, Helvetica, sans-serif;
    font-size: 14px;
    margin: 5px 0;
    padding: 8px 0 8px 10px;
  }

  .gantt-selected-info {
  border-bottom: 1px solid #cecece;
    box-sizing: border-box;
    font-family: Geneva, Arial, Helvetica, sans-serif;
    height: 50%;
    line-height: 28px;
    padding: 10px;
  }

  .gantt-selected-info h2 {
    border-bottom: 1px solid #cecece;
  }
  
  .select-task-prompt h2{
    color: #d9d9d9;
  }
</style>