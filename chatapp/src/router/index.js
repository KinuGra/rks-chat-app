import { createRouter, createWebHistory } from "vue-router"
import Login from "../components/Login.vue"
import ChatAll from "../components/ChatAll.vue"
import Chat from "../components/Chat.vue"
import Thread from "../components/Thread.vue"
import ThreadList from "../components/ThreadList/ThreadList.vue"

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "login",
      component: Login
    },{
      path: "/chat/",
      name: "chat",
      component: ChatAll,
      children: [
        {
          path: '',
          name: 'ChatOnly',
          component: Chat
        }
      ],
      beforeEnter: (to, from, next) => {
        if(from.name === "login"||"thread"){
          next()
        } else {
          next({ name:"login" })
        }
      },
    },{
      path: "/thread/",
      name: "thread",
      component: ChatAll,
      beforeEnter: (to, from, next) => {
        if(from.name === "login"||"chat"){
          next()
        } else {
          next({ name:"login" })
        }
      },
    },{
      path: "/test/threadlist",
      component: ThreadList
    }
  ],
})

export default router