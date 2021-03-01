import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

export const constantRoutes = [
  {
    path: '/',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/qqBindLogin',
    component: () => import('@/views/login/qqBindLogin'),
    hidden: true
  },
  {
    path: '/qqLoginReturnPlatform',
    component: () => import('@/views/login/qqLoginReturnPlatform'),
    hidden: true
  },
  {
    path: '/',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/home',
    component: Layout,
    redirect: '/dashboard',
    functionCode: 'p-home',
    functionCodeA: 'a-home',
    children: [{
      path: '/dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'component' },
      permission: 'p-home'
    }]
  },
  // {
  //   path: '/site',
  //   component: Layout,
  //   redirect: '/site/list',
  //   meta: { title: '主站管理', icon: 'eye-open' },
  //   children: [
  //     {
  //       path: 'list',
  //       name: 'SiteList',
  //       component: () => import('@/views/site/list'),
  //       meta: { title: '主站列表'}
  //     }
  //   ]
  // },
  {
    path: '/site',
    component: Layout,
    redirect: '/site/list',
    functionCode: 'p-site',
    functionCodeA: 'a-site',
    meta: { title: '站点管理', icon: 'eye-open' },
    children: [
      {
        path: 'list',
        name: 'SiteList',
        functionCode: 'p-site-site',
        functionCodeA: 'a-site-site',
        component: () => import('@/views/site/list'),
        meta: { title: '站点列表',icon: 'eye-open' }
      },
      {
        path: 'version',
        name: 'VersionList',
        functionCode: 'p-site-edition',
        functionCodeA: 'a-site-edition',
        component: () => import('@/views/version/list'),
        meta: { title: '站点版本',icon: 'eye-open' }
      },
      {
        path: 'package',
        name: 'VersionPackage',
        functionCode: 'p-site-package',
        functionCodeA: 'a-site-package',
        component: () => import('@/views/version/package'),
        meta: { title: '版本套餐',icon: 'eye-open' }
      },
      {
        path: 'domain',
        name: 'domain',
        functionCode: "p-site-alias",
        functionCodeA: "a-site-alias",
        component: () => import('@/views/site/domain'),
        meta: { title: '域名管理', icon: 'eye-open' }
      }
    ]
  },
  {
    path: '/platform',
    component: Layout,
    redirect: '/platform/list',
    functionCode: 'p-platform',
    functionCodeA: 'a-platform',
    meta: { title: '平台管理', icon: 'eye-open' },
    children: [
      {
        path: 'list',
        name: 'platformList',
        functionCode: 'p-platform-platform',
        functionCodeA: 'a-platform-platform',
        component: () => import('@/views/platform/list'),
        meta: { title: '平台列表',icon: 'eye-open' }
      },
      {
        path: 'versionList',
        name: 'VersionList',
        functionCode: 'p-platform-edition',
        functionCodeA: 'a-platform-edition',
        component: () => import('@/views/platform/versionList'),
        meta: { title: '平台版本',icon: 'eye-open' }
      },
      {
        path: 'package',
        name: 'PlatformPackage',
        functionCode: 'p-platform-package',
        functionCodeA: 'a-platform-package',
        component: () => import('@/views/platform/package'),
        meta: { title: '版本套餐',icon: 'eye-open' }
      }
    ]
  },
  {
    path: '/cashManage',
    component: Layout,
    redirect: '/cashManage/index',
    functionCode: 'p-cash',
    functionCodeA: 'a-cash',
    meta: { title: '提现管理', icon: 'eye-open' },
    children: [
      {
        path: 'index',
        name: 'Index',
        functionCode: 'p-cash-cash',
        functionCodeA: 'a-cash-cash',
        component: () => import('@/views/othercash/index'),
        meta: { title: '提现管理',icon: 'eye-open' }
      },
      {
        path: '/cash',
        component: () => import('@/views/cash/index'),
        hidden: false
      }
    ]
  },
  {
    path: '/recharge',
    component: Layout,
    redirect: '/recharge/way',
    functionCode: 'p-recharge',
    functionCodeA: 'a-recharge',
    meta: { title: '充值管理', icon: 'eye-open' },
    children: [
      {
        path: 'way',
        name: 'rechargeWay',
        functionCode: 'p-recharge-mode',
        functionCodeA: 'a-recharge-mode',
        component: () => import('@/views/recharge/way'),
        meta: { title: '充值方式',icon: 'eye-open' }
      },
      {
        path: 'interface',
        name: 'rechargeInterface',
        functionCode: 'p-recharge-attr',
        functionCodeA: 'a-recharge-attr',
        component: () => import('@/views/recharge/interface'),
        meta: { title: '充值接口',icon: 'eye-open' }
      },
      {
        path: 'rate',
        name: 'rateMaster',
        functionCode: 'p-recharge-rate',
        functionCodeA: 'a-recharge-rate',
        component: () => import('@/views/recharge/rate'),
        meta: { title: '充值费率',icon: 'eye-open' }
      }
    ]
  },
  {
    path: '/order',
    component: Layout,
    redirect: '/order/index',
    functionCode: 'p-order',
    functionCodeA: 'a-order',
    meta: { title: '订单管理', icon: 'eye-open' },
    children: [
      {
        path: 'index',
        name: 'orderList',
        functionCode: 'p-order-order',
        functionCodeA: 'a-order-order',
        component: () => import('@/views/other/order'),
        meta: { title: '订单查询',icon: 'eye-open' }
      },
      {
        path:'complaint',
        name:'complaintList',
        functionCode:'p-order-complaint',
        functionCodeA:'a-order-complaint',
        component: () => import('@/views/other/complaint'),
        meta: { title: '订单投诉管理',icon: 'eye-open' }
      }
    ]
  },
  {
    path: '/user',
    component: Layout,
    redirect: '/user/index',
    functionCode: 'p-user',
    functionCodeA: 'a-user',
    meta: { title: '用户管理', icon: 'eye-open' },
    children: [
      {
        path: 'index',
        name: 'userList',
        functionCode: 'p-user',
        functionCodeA: 'a-user',
        component: () => import('@/views/other/user'),
        meta: { title: '用户查询',icon: 'eye-open' }
      }
    ]
  },
  {
    path: '/money',
    component: Layout,
    // redirect: '/money/index',
    functionCode: 'p-finance',
    functionCodeA: 'a-finance',
    meta: { title: '财务管理', icon: 'eye-open' },
    children: [
      {
        path: 'rechargeRecord-1',
        name: 'rechargeRecord-1',
        functionCode: 'a-finance-recharge',
        functionCodeA: 'a-finance-recharge',
        component: () => import('@/views/other/adminRechargeRecord'),
        meta: { title: '充值记录',icon: 'eye-open' }
      },
      {
        path: 'rechargeRecord-2',
        name: 'rechargeRecord-2',
        functionCode: 'p-finance-recharge',
        functionCodeA: 'P-finance-recharge',
        component: () => import('@/views/other/platformRechargeRecord'),
        meta: { title: '充值记录',icon: 'eye-open' }
      },
      {
        path: 'platformmoney',
        name: 'platformmoneyList',
        functionCode: 'p-finance-platform',
        functionCodeA: 'a-finance-platform',
        component: () => import('@/views/other/platformmoney'),
        meta: { title: '平台资金',icon: 'eye-open' }
      },
      {
        path: 'sitemoney',
        name: 'sitemoneyList',
        functionCode: 'p-finance-site',
        functionCodeA: 'a-finance-site',
        component: () => import('@/views/other/sitemoney'),
        meta: { title: '站点资金',icon: 'eye-open' }
      },
      {
        path: 'usermoney',
        name: 'usermoneyList',
        functionCode: 'p-finance-user',
        functionCodeA: 'a-finance-user',
        component: () => import('@/views/other/usermoney'),
        meta: { title: '客户资金',icon: 'eye-open' }
      },
      {
        path: 'dayMoney-1',
        name: 'dayMoney-1',
        functionCode: 'a-finance-platformDayMoney',
        functionCodeA: 'a-finance-platformDayMoney',
        component: () => import('@/views/other/adminDayMoney'),
        meta: { title: '平台每日资金统计',icon: 'eye-open' }
      },
      {
        path: 'dayMoney-2',
        name: 'dayMoney-2',
        functionCode: 'p-finance-platformDayMoney',
        functionCodeA: 'p-finance-platformDayMoney',
        component: () => import('@/views/other/platformDayMoney'),
        meta: { title: '平台每日资金统计',icon: 'eye-open' }
      },
      {
        path: 'siteDayMoney',
        name: 'siteDayMoney',
        functionCode: 'p-finance-siteDayMoney',
        functionCodeA: 'p-finance-siteDayMoney',
        component: () => import('@/views/other/siteDayMoney'),
        meta: { title: '站点每日资金统计',icon: 'eye-open' }
      }
    ]
  },
  {
    path: '/auth',
    component: Layout,
    redirect: '/auth/admin',
    meta: { title: '权限管理', icon: 'eye-open' },
    children: [
      {
        path: 'admin',
        name: 'Admin',
        component: () => import('@/views/auth/index'),
        meta: { title: '管理员权限管理',icon: 'eye-open' }
      },
      {
        path: 'admin/authedit/:roleID/:name',
        component: () => import('@/views/auth/authedit'),
        // meta: { title: '设置权限', icon: '' },
        hidden: false
      },
      {
        path: 'role',
        name: 'Role',
        component: () => import('@/views/auth/role'),
        meta: { title: '管理员管理',icon: 'eye-open'}
      }
    ]
  },
  {
    path: '/notice',
    component: Layout,
    redirect: '/notice/updatenotice',
    functionCode: 'p-update',
    functionCodeA: 'a-update',
    meta: { title: '更新公告', icon: 'eye-open' },
    children: [{
      path: 'updatenotice',
      name: 'Updatenotice',
      functionCode: 'p-update',
      functionCodeA: 'a-update',
      component: () => import('@/views/notice/index'),
      meta: { title: '更新公告', icon: 'eye-open' }
    }]
  },
  {
    path: '/log',
    component: Layout,
    redirect: '/loginlog',
    functionCode: 'p-log',
    functionCodeA: 'a-log',
    meta: { title: '系统日志', icon: 'eye-open' },
    children: [
      {
        path: 'loginlog',
        name: 'loginLog',
        functionCode: 'p-log-login',
        functionCodeA: 'a-log-login',
        component: () => import('@/views/log/loginlog'),
        meta: { title: '登录日志',icon: 'eye-open' }
      }
    ]
  },
  {
    path: '/set',
    component: Layout,
    redirect: '/baseSet',
    functionCode: 'p-set',
    functionCodeA: 'a-set',
    meta: { title: '系统设置', icon: 'eye-open' },
    children: [
      {
        path: 'baseSet',
        name: 'baseSet',
        functionCode: 'p-set-base',
        functionCodeA: 'a-set-base',
        component: () => import('@/views/setting/base'),
        meta: { title: '网站信息设置',icon: 'eye-open' }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

export default router
