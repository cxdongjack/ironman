// Register package as ReactionCommerce package
ReactionCore.registerPackage({
  label: "Bees Knees",
  name: "beesknees",
  icon: "fa fa-vine",
  autoEnable: true,
  registry: [
    // 说明页面
    {
      route: "/about",
      name: "about",
      template: "aboutUs",
      workflow: "coreWorkflow"
    },
    // 手动增加账号
    {
      label: "Add Guest",
      icon: "fa fa-user-plus",
      provides: "settings",
      container: "accounts",
      template: "addGuestForm",
      priority: 2
    },
    // 从赛事的角度查询订单
    {
      route: "/dashboard/query",
      name: "dashboard/query",
      template: "ordersIronman",
      workflow: "coreWorkflow"
    },
    // 侧边栏的查询按钮, 这条必须在上一条之后
    {
      route: "/dashboard/query",
      name: "dashboard/query",
      provides: "shortcut",
      icon: "fa fa-sun-o"
    },
    // 手动增加账号
    {
      route: "/account/person",
      template: "accountPersonIronman",
      name: "account/person",
      label: "Person",
      icon: "fa fa-user",
      provides: "userAccountDropdown"
    }
  ],
  layout: [{
    layout: "coreLayout",
    workflow: "coreWorkflow",
    collection: "Products",
    theme: "default",
    enabled: true,
    structure: {
      template: "products",
      layoutHeader: "layoutHeader",
      layoutFooter: "layoutFooter",
      notFound: "productNotFound",
      dashboardHeader: "",
      dashboardControls: "dashboardControls",
      dashboardHeaderControls: "",
      adminControlsFooter: "adminControlsFooter"
    }
  }]
});

