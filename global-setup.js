// global-setup.js
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';

export default async function globalSetup(config) {
  console.log("=== Pre-test setup starting ===")

  // 1. Set environment variables
  process.env.ZO_ROOT_USER_EMAIL = "root@example.com"
  process.env.ZO_ROOT_USER_PASSWORD = "Complexpass#123"

  // 2. Start openobserve.exe
  console.log("Starting OpenObserve server...")
  const serverProcess = spawn(path.join(process.cwd(), 'openobserve.exe'), [], {
    env: process.env,
    detached: true,
    stdio: 'ignore'
  })
  // Store PID for teardown
  fs.writeFileSync('server.pid', serverProcess.pid.toString())
  serverProcess.unref()

  // 3. Wait for server to be ready
  console.log("Waiting for server to be ready...")
  const waitForServer = async () => {
    for (let i = 0; i < 30; i++) {
      try {
        const res = await fetch('http://localhost:5080', { method: 'GET' })
        if (res.ok) {
          console.log("Server is ready!")
          return
        }
      } catch (err) {
        // Server not ready yet
      }
      await new Promise(resolve => setTimeout(resolve, 2000))
    }
    throw new Error("Server did not start in time")
  };
  await waitForServer()

  // 4. Upload logs.json
  console.log("Uploading logs.json...")
  if(!process.env.Email && !process.env.PASSWORD){
    throw new Error("Credentials are not available")
  }
  const credPair = `${process.env.Email}:${process.env.PASSWORD}`
  const encodedCreds = Buffer.from(credPair).toString('base64')
  const logsFilePath = path.join(process.cwd(), 'logs.json')

  const logsData = fs.readFileSync(logsFilePath, 'utf8')
  const uploadRes = await fetch("http://localhost:5080/api/default/default/_json", {
    method: 'POST',
    headers: {
      Authorization: `Basic ${encodedCreds}`,
      'Content-Type': 'application/json'
    },
    body: logsData
  })

  if (!uploadRes.ok) {
    throw new Error(`Failed to upload logs: ${uploadRes.status} ${uploadRes.statusText}`)
  }
  console.log("Logs uploaded successfully")

  console.log("=== Pre-test setup complete ===")
}
