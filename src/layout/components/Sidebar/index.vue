<template>
  <div :class="{'has-logo':showLogo}">
    <logo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="false"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-item v-for="route in roleList" :key="route.path" :item="route" :base-path="route.path" />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Logo from './Logo'
import SidebarItem from './SidebarItem'
import variables from '@/styles/variables.scss'

export default {
  components: { SidebarItem, Logo },
  computed: {
    ...mapGetters([
      'sidebar'
    ]),
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo
    },
    variables() {
      return variables
    },
    isCollapse() {
      return !this.sidebar.opened
    },
    userType(){
      return this.Read('userType')
    }
  },
  data() {
    return {
      roleList: []
    }
  },
  created() {
    this.getUserTree()
  },
  methods: {
    getUserTree() {
      this.GET(
        '/user/function/getUserTree',
        {},
        data => {
          this.renderRoleList(this.$router.options.routes,data.body)
        }
      )
    },
    renderRoleList(routes,roleRoutes) {
      routes.forEach(item1 => {
        roleRoutes.forEach(item2 => {
          if(this.userType == 1){
            if ((item1.functionCodeA === item2.functionCode)) {
              if(item1.children&&item1.children.length > 1){
                item1.children.forEach((child1,index) => {
                  var includ = false
                  item2.children.forEach(child2 => {
                    if(child1.functionCodeA === child2.functionCode){
                      includ = true
                      return
                    }
                  })
                  if(!includ) item1.children.splice(index,1)
                })
              }
              this.roleList.push(item1)
            }
          }else{
            if ((item1.functionCode === item2.functionCode)) {
              if(item1.children&&item1.children.length > 1){
                item1.children.forEach((child1,index) => {
                  var includ = false
                  item2.children.forEach(child2 => {
                    if(child1.functionCode === child2.functionCode){
                      includ = true
                      return
                    }
                  })
                  if(!includ) item1.children.splice(index,1)
                })
              }
              this.roleList.push(item1)
            }
          }
        })
      })
    }
  }
}
</script>
