module.exports = (RED) => {
  class StopTimer {
    constructor(config) {
      RED.nodes.createNode(this, config)
      this.on("input", this.onInput)
      this.on("close", this.onClose)
      this.startTime = null
    }

    onInput = (msg) => {
      if (msg.stop) {
        this.send({ ...msg, payload: this.elapsedTime() })
        this.startTime = null
      } else if (msg.reset) {
        this.status("reset")
        this.startTime = null
      } else if (!this.startTime) {
        this.startTime = Date.now()
        this.status("start")
        this.reportElapsedTime()
      }
    }

    reportElapsedTime = () => {
      setTimeout(() => {
        if (this.startTime) {
          this.status(`${Math.round(this.elapsedTime() / 1000)}s`)
          this.reportElapsedTime()
        }
      }, 1000)
    }

    elapsedTime = () => {
      return Date.now() - this.startTime
    }

    onClose = () => {
      this.startTime = null
      this.status({})
      clearTimeout(this.timeout)
    }
  }

  RED.nodes.registerType("stoptimer", StopTimer)
}
