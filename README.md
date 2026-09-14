# CopperPro GitHub Pages 最终版

这个版本专门为 GitHub Pages 调整，支持“项目仓库子路径”：

`https://你的用户名.github.io/仓库名/`

所有 CSS、JS、图片、Manifest 和 Service Worker 都使用相对路径，因此无需手动修改仓库名。

## 一、第一次部署（完全不用 Git 命令）

### 1. 新建 GitHub 仓库
建议仓库名：

`copper-products`

选择 `Public`，然后创建。

### 2. 上传本项目中的全部文件
打开解压后的文件夹，上传里面的内容，不要再套一层文件夹。

仓库最外层必须直接看到：

- index.html
- styles.css
- config.js
- app.js
- sw.js
- manifest.webmanifest
- .nojekyll
- assets/

### 3. 提交
点击 `Commit changes`。

### 4. 开启 GitHub Pages
进入：

`Settings → Pages`

Build and deployment：

- Source：`Deploy from a branch`
- Branch：`main`
- Folder：`/(root)`

点击 Save。

### 5. 打开网站
如果用户名是：

`abcfactory`

仓库叫：

`copper-products`

网址通常是：

`https://abcfactory.github.io/copper-products/`

## 二、日常只改 config.js

公司名称、电话、微信、邮箱、产品、价格区间基本全部集中在：

`config.js`

改完后 GitHub 网页上点：

`Commit changes`

网站会自动更新。

## 三、换图片

进入：

`assets/images/`

上传同名图片覆盖即可。

具体文件名看：

`assets/images/IMAGE_GUIDE.txt`

## 四、PWA 更新缓存

如果以后大改网站，请打开：

`sw.js`

把：

`copperpro-github-v1`

改成：

`copperpro-github-v2`

下一次再改成 v3、v4……

这样客户设备更容易更新到新版缓存。

## 五、手机安装

Android：
Chrome 打开网站 → 菜单 → 安装应用 / 添加到主屏幕。

iPhone：
Safari 打开网站 → 分享 → 添加到主屏幕。

微信内可直接浏览、查看产品、联系销售。
如需安装到桌面，建议微信右上角选择“在浏览器打开”，再用 Chrome 或 Safari 添加到主屏幕。

## 六、注意

当前页面中的价格为演示参考价格 /kg，请务必根据你们真实产品、牌号和成本修改。
