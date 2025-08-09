const { execSync } = require("child_process")
const fs = require("fs")
const path = require("path")

module.exports = async () => {
  const pidFile = path.join(__dirname, "server.pid")

  if (fs.existsSync(pidFile)) {
    const pid = fs.readFileSync(pidFile, "utf8").trim()
    console.log(`Attempting to stop server with PID ${pid}...`)

    try {
      // Check if PID exists in tasklist before killing
      const runningProcesses = execSync(`tasklist /FI "PID eq ${pid}"`).toString()
      if (!runningProcesses.includes(pid)) {
        console.log(`Server PID ${pid} is not running. Skipping stop.`)
        fs.unlinkSync(pidFile)
        return
      }

      execSync(`taskkill /PID ${pid} /F`)
      console.log(`Server with PID ${pid} stopped successfully.`)
      fs.unlinkSync(pidFile)
    } catch (err) {
      console.error(`Failed to stop server: ${err.message}`)
    }
  } else {
    console.log("No PID file found. Skipping server stop.")
  }
}
