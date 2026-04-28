import { spawn } from 'node:child_process'
import net from 'node:net'

export function startApi({ port, env = {} }) {
    return spawn('bun', ['src/index.ts'], {
        cwd: process.cwd(),
        env: {
            ...process.env,
            PORT: String(port),
            ...env,
        },
        stdio: 'inherit',
    })
}

export async function fetchJson(input, options = {}, baseUrl = '') {
    const response = await fetchRaw(input, options, baseUrl)
    const payload = await response.json().catch(() => null)
    if (!response.ok) {
        throw new Error(`${response.status} ${response.statusText}: ${JSON.stringify(payload)}`)
    }
    return payload
}

export function fetchRaw(input, options = {}, baseUrl = '') {
    return fetch(input.startsWith('http') ? input : `${baseUrl}${input}`, options)
}

export function assertStatus(response, expected, label) {
    if (response.status !== expected) {
        throw new Error(`${label}: expected ${expected}, got ${response.status}`)
    }
}

export function assertEqual(actual, expected, label) {
    if (actual !== expected) {
        throw new Error(`${label}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`)
    }
}

export function waitForPort(port) {
    return waitFor(async () => {
        return await new Promise((resolve) => {
            const socket = net.connect(port, '127.0.0.1')
            socket.once('connect', () => {
                socket.destroy()
                resolve(true)
            })
            socket.once('error', () => {
                socket.destroy()
                resolve(false)
            })
        })
    }, 20000)
}

export async function waitFor(check, timeoutMs) {
    const startedAt = Date.now()
    while (Date.now() - startedAt < timeoutMs) {
        if (await check()) {
            return
        }
        await new Promise((resolve) => setTimeout(resolve, 250))
    }
    throw new Error('Timed out waiting for condition')
}

export function run(command, args, { allowFailure = false } = {}) {
    return new Promise((resolve, reject) => {
        const child = spawn(command, args, { stdio: 'inherit' })
        child.once('exit', (code) => {
            if (code === 0 || allowFailure) {
                resolve(undefined)
                return
            }
            reject(new Error(`${command} ${args.join(' ')} exited with code ${code}`))
        })
    })
}
