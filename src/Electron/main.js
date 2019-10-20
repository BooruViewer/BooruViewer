
const { app, shell, BrowserWindow } = require("electron")
const portScanner = require("portscanner")
const unhandled = require("electron-unhandled")
const electronDebug = require("electron-debug")
const { is, api } = require("electron-util")
const path = require("path")
const Url = require('url')
const fs = require("fs")
const flashLoader = require('flash-player-loader')
const semverSort = require("semver-sort")


unhandled()
electronDebug({
  showDevTools: false,
  devToolsMode: "undocked"
})

const ServerManager = require("./serverManager")

const currentBinPath = path.join(__dirname.replace('app.asar', ''), 'bin')

let mainWindow, serverManager

const createWindow = () => {
  mainWindow = new BrowserWindow({
    height: 720,
    width: 1290,
    backgroundColor: "#303030",
    show: false,
    webPreferences: {
      plugins: true
    }
  })

  const { webContents } = mainWindow
  const handleLinks = (event, attemptedUrl) => {
    console.log(attemptedUrl)
    const url = Url.parse(attemptedUrl)
    if (url.hostname.toLowerCase() === "localhost")
      return
    event.preventDefault()
    shell.openExternal(attemptedUrl)
  }

  webContents.on("new-window", handleLinks)

  webContents.on("will-navigate", handleLinks)

  mainWindow.removeMenu()
  mainWindow.loadURL("http://localhost:5000")
  mainWindow.on("closed", () => {
    mainWindow = null
  })

  mainWindow.once("ready-to-show", () => {
    mainWindow.show()
  })

  try {
    require("vue-devtools").install()
  } catch(crap) {}
}

const findChromeInstalledPepper = () => {
  try {
    const chromePath = path.join(app.getPath("appData"), "..", "Local", "Google", "Chrome", "User Data", "PepperFlash")
    const version = semverSort.desc(fs.readdirSync(chromePath))[0]
    return path.join(chromePath, version)
  } catch {
    return ""
  }
}

flashLoader
    .addSource("@system") // https://get.adobe.com/flashplayer/otherversions/
    .addSource("@chrome")
    .addSource()
    .addSource(findChromeInstalledPepper())
    .load()

app.on("ready", () => {
  console.log('ready')
  portScanner.findAPortNotInUse(5000, 65535, "localhost", function(error, port) {
    serverManager = new ServerManager(port, currentBinPath)
    serverManager
        .start()
        .then(createWindow)
  })
})

app.on("window-all-closed", () => {
  serverManager.kill()
  app.quit()
})
