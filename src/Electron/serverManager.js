const process = require("child_process").spawn
const path = require("path")
const { is } = require("electron-util")

class ServerManager {

  constructor(workingPort, workingDirectory) {
    this._processes = []
    this._workingPort = workingPort
    this._workingDirectory = workingDirectory
  }

  start() {
    if (is.development) {
      return this._startDebug()
    } else {
      return this._startProduction()
    }
  }

  kill() {
    for (const obj of this._processes) {
      try {
        const { name, process } = obj
        console.log(`Attempting to kill ${name}`)
        process.kill(0)
      } catch (e) {
        console.error(e)
      }
    }
  }

  _startDebug() {
    const bvServerProcess = this._startDotnet()
    const bvClientProcess = this._startYarn()

    this._processes.push({ name: "server", process: bvServerProcess }, { name: "client", process: bvClientProcess })
    bvServerProcess.stdout.on("data", d => console.info(d.toString()))
    bvClientProcess.stdout.on("data", d => console.info(d.toString()))

    const waitForServer = new Promise(resolve => {
      const waitForStartup = data => {
        if (!data)
          return
        const string = data.toString()
        if (string.trim() === "")
          return
        if (!string.includes("Application started."))
          return
        bvServerProcess.stdout.off("data", waitForStartup)
        console.log("\tServer has started")
        resolve()
      }
      console.log("\tWaiting on Server to start up")
      bvServerProcess.stdout.on("data", waitForStartup)
    })

    const waitForClient = new Promise(resolve => {
      const waitForStartup = data => {
        if (!data)
          return
        const string = data.toString()
        if (string.trim() === "")
          return
        if (!string.includes("Waiting for file changes"))
          return
        bvClientProcess.stdout.off("data", waitForStartup)
        console.log("\tClient has started")
        resolve()
      }
      console.log("\tWaiting on Client to staart up")
      bvClientProcess.stdout.on("data", waitForStartup)
    })

    return Promise.all([waitForServer, waitForClient])
  }

  _startDotnet() {
    const options = { cwd: path.join(this._workingDirectory, "..", "..", "Server") }
    let binary = "dotnet"
    let params = ["watch", "run", "--electron enabled", `--urls http://localhost:${this._workingPort}`]

    if (is.windows)
      binary += ".exe"

    return process(binary, params, options)
  }

  _startYarn() {
    const options = { cwd: path.join(this._workingDirectory, "..", "..", "Client") }
    let binary = "node"
    let params = [path.join(options.cwd, "node_modules", "nuxt", "bin", "nuxt.js")]

    if (is.windows)
      binary += ".exe"

    return process(binary, params, options)
  }

  _startProduction() {
    const options = { cwd: this._workingDirectory }
    let binary = "BooruViewer"
    let params = ["--electron enabled", `--urls http://localhost:${this._workingPort}`]

    if (is.windows)
      binary += ".exe"

    const bvProcess = process(binary, params, options)
    this._processes.push({ name: "server", process: bvProcess })

    return new Promise(resolve => {
      const waitForStartup = data => {
        if (!data)
          return
        const string = data.toString()
        if (string.trim() === "")
          return
        if (!string.includes("Application Started."))
          return
        bvProcess.stdout.off("data", waitForStartup)
        resolve()
      }
      bvProcess.stdout.on("data", waitForStartup)
    })
  }

}

module.exports = ServerManager
