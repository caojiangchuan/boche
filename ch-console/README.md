## Usage

### dev
```bash
$ git clone git@gitlab.com:mumbang/web-console.git
$ cd web-console
$ npm install
$ npm start  
```
#目录结构
```
├── mock                     # 本地模拟数据
├── node_modules             # 依赖库
├── public
│   ├── favicon.ico          # Favicon
│   └── index.html           # HTML 入口模板
├── src
│   ├── common               # 应用公用配置，如导航信息
│   ├── components           # 业务通用组件
│   ├── e2e                  # 集成测试用例
│   ├── layouts              # 通用布局
│   ├── models               # dva model
│   ├── routes               # 业务页面入口和常用模板
│   ├── services             # 后台接口服务
│   ├── utils                # 工具库
│   ├── g2.js                # 可视化图形配置
│   ├── polyfill.js          # 兼容性垫片
│   ├── theme.js             # 主题配置
│   ├── index.js             # 应用入口
│   ├── index.less           # 全局样式
│   └── router.js            # 路由入口
├── tests                    # 测试工具
├── .editorconfig            # 编辑器配置
├── .eslintrc                # js代码检测工具
├── .ga                      # 未知
├── .gitignore               # git版本配置
├── .roadhogrc               # roadhog配置
├── .roadhogrc.mock.js       # roadhog的模拟配置
├── .stylelintrc             # css代码审查配置
├── .travis.yml              # travis持续构建工具配置
├── package.json             # web前端项目配置文件
├── README.md
└──
```
