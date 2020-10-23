# 数据蒸馏助手

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Run your tests
```
npm run test
```

### Lints and fixes files
```
npm run lint
```

### Run your unit tests
```
npm run test:unit
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

### 项目技术栈
  1. vue
  2. vue-property-decorator  
  3. vuex + vuex-module-decorators
  4. axios + @types/axios
  5. element-ui
  6. vue-router
### 说明
   vue-property-decorator：在Vue中使用TypeScript时，非常好用的一个库，使用装饰器来简化书写，基于vue-class-component
   vuex-module-decorators： vuex的装饰器
   @types/axios: axios类型声明文件

### 组件代码的组织方式
  1. @Prop
  2. @PropSync
  3. @Model
  4. @Watch
  5. @Provide
  6. @Inject
  7. @ProvideReactive
  8. @InjectReactive
  9. @Emit
  10. @Ref


### 主要库的链接
  * [class-component](https://npm.im/capsid)
  * [vue-property-decorator](https://github.com/kaorun343/vue-property-decorator#readme)
  * [vuex-module-decorator](https://github.com/championswimmer/vuex-module-decorators)

| 命名 | 说明 |
| - | :- | :- | :-: |
| 文件夹命名 | 遵循驼峰命名规则 |
| 组件命名 | 驼峰+首字母大写 |
| 基础组件 | 以Base开头 |

###根据博客https://juejin.im/post/6844904192331481101

### element ui 自定义主题
由于项目中使用的是 less，所以用命令行主题工具 自定义主题 (https://element.eleme.cn/#/zh-CN/component/custom-theme)

### 自定义主题
### 安装「主题生成工具」，可以全局安装或者安装在当前项目下，目前安装在项目下
```
npm i element-theme -D 
```
### 安装白垩主题
```
npm i element-theme-chalk -D
```

### 初始化变量文件，全局：et -i [可以自定义变量文件]  ；因为我没有全局安装，所以要 ./node_modules/.bin/et -i
```
./node_modules/.bin/et -i [可以自定义变量文件]    
```

### 修改文件element-variables.scss，保存后，到命令行里执行 et ，编译主题


### 编译主题
### 保存文件后，到命令行里执行 et 编译主题 指定编译路径;全局安装的话：et -o ./public/theme；因为我没有全局安装，所以：./node_modules/.bin/et -o ./public/theme，生成在public下的theme
```
./node_modules/.bin/et -o ./public/theme
```

###  使用自定义主题
在代码里直接引用「命令行工具」生成的主题的 theme/index.css 文件即可
### 搭配插件按需引入组件主题
如果是搭配 babel-plugin-component 一起使用，只需要修改 .babelrc 的配置，指定 styleLibraryName 路径为自定义主题相对于 .babelrc 的路径，注意要加 ~。
