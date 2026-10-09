// Anchor: an attention and working-memory layer for Figma's infinite canvas.
// Prototype plugin. Three features share one idea: the file remembers your
// intent so you don't have to.
//
//   Tunnel      - pick a scope, everything else dims and locks.
//   Park it     - tangents move to a Parking lot page with a note and a way back.
//   Where was I - a re-entry card built from what you touched last session.

// ---------- Types ----------

interface Touched {
  name: string
  count: number
  last: number
}

interface Session {
  fileId: string
  start: number
  end: number
  pageId: string
  pageName: string
  intent: string
  touched: { [id: string]: Touched }
  lastSelection: string[]
  note: string
  parked: number
}

interface TunnelState {
  intent: string
  start: number
  pageId: string
  scopeIds: string[]
  // original values of nodes we dimmed, so Exit restores them exactly
  dimmed: { [id: string]: { opacity: number; locked: boolean } }
}

interface ReentryCard {
  when: string
  duration: string
  intent: string
  pageName: string
  touchedCount: number
  topNames: string[]
  note: string
  parked: number
  hasTarget: boolean
}

type UiMessage =
  | { type: 'ready' }
  | { type: 'enter-tunnel'; intent: string }
  | { type: 'exit-tunnel' }
  | { type: 'park'; ids: string[] }
  | { type: 'adopt'; ids: string[] }
  | { type: 'snooze-drift' }
  | { type: 'take-me-there' }
  | { type: 'dismiss-reentry' }
  | { type: 'save-note'; note: string }
  | { type: 'set-threshold'; minutes: number }
  | { type: 'open-parking-lot' }

// ---------- Constants ----------

const DIM_OPACITY = 0.12
const SAVE_EVERY_MS = 8000
const DRIFT_CHECK_MS = 5000
const PARKING_PAGE = '🅿 Parking lot'
const DEFAULT_THRESHOLD_MIN = 15
const MAX_SESSIONS = 5

// ---------- State ----------

let fileId = ''
let session: Session
let previous: Session | null = null
let tunnel: TunnelState | null = null
let thresholdMin = DEFAULT_THRESHOLD_MIN

// drift tracking, only meaningful while a tunnel is active
let offScopeSince = 0
let offScopeIds: { [id: string]: true } = {}
let driftShown = false
let driftSnoozedUntil = 0
let dirty = false

let listeningPageId = ''

// ---------- Helpers ----------

function now(): number {
  return Date.now()
}

function post(msg: object): void {
  figma.ui.postMessage(msg)
}

function relative(ms: number): string {
  const m = Math.round(ms / 60000)
  if (m < 1) return 'moments ago'
  if (m < 60) return `${m} min ago`
  const h = Math.round(m / 60)
  if (h < 24) return `${h} hour${h === 1 ? '' : 's'} ago`
  const d = Math.round(h / 24)
  return `${d} day${d === 1 ? '' : 's'} ago`
}

function duration(ms: number): string {
  const m = Math.max(1, Math.round(ms / 60000))
  if (m < 60) return `${m} min`
  const h = Math.floor(m / 60)
  const rest = m % 60
  return rest ? `${h} h ${rest} min` : `${h} h`
}

// Climb to the node directly under the page. Dimming and parking work at this
// level so a whole flow moves together.
function topLevelOf(node: BaseNode): SceneNode | null {
  let cur: BaseNode | null = node
  while (cur && cur.parent && cur.parent.type !== 'PAGE') cur = cur.parent
  if (!cur || !cur.parent || cur.parent.type !== 'PAGE') return null
  return cur as SceneNode
}

function uuid(): string {
  let s = ''
  for (let i = 0; i < 16; i++) s += Math.floor(Math.random() * 16).toString(16)
  return s
}

function sessionsKey(): string {
  return `anchor:sessions:${fileId}`
}

function newSession(): Session {
  return {
    fileId,
    start: now(),
    end: now(),
    pageId: figma.currentPage.id,
    pageName: figma.currentPage.name,
    intent: '',
    touched: {},
    lastSelection: [],
    note: '',
    parked: 0,
  }
}

// ---------- Persistence ----------

async function loadState(): Promise<void> {
  fileId = figma.root.getPluginData('anchorFileId')
  if (!fileId) {
    fileId = uuid()
    figma.root.setPluginData('anchorFileId', fileId)
  }

  const stored = (await figma.clientStorage.getAsync(sessionsKey())) as Session[] | undefined
  if (stored && stored.length) previous = stored[stored.length - 1]

  const t = (await figma.clientStorage.getAsync('anchor:threshold')) as number | undefined
  if (typeof t === 'number' && t > 0) thresholdMin = t

  // Tunnel state lives in file plugin data so Exit can restore nodes even if
  // the plugin was closed mid-tunnel.
  const raw = figma.root.getPluginData('anchorTunnel')
  if (raw) {
    try {
      tunnel = JSON.parse(raw) as TunnelState
    } catch (e) {
      tunnel = null
    }
  }

  session = newSession()
  if (tunnel) session.intent = tunnel.intent
}

async function saveSessions(): Promise<void> {
  session.end = now()
  const stored = ((await figma.clientStorage.getAsync(sessionsKey())) as Session[] | undefined) || []
  // replace the current session if it is already stored (same start), else append
  const idx = stored.findIndex((s) => s.start === session.start)
  if (idx >= 0) stored[idx] = session
  else stored.push(session)
  while (stored.length > MAX_SESSIONS) stored.shift()
  await figma.clientStorage.setAsync(sessionsKey(), stored)
  dirty = false
}

function saveTunnel(): void {
  figma.root.setPluginData('anchorTunnel', tunnel ? JSON.stringify(tunnel) : '')
}

// ---------- Re-entry card ----------

function buildReentry(): ReentryCard | null {
  if (!previous) return null
  const touched = Object.keys(previous.touched).map((id) => previous!.touched[id])
  touched.sort((a, b) => b.count - a.count)
  return {
    when: relative(now() - previous.end),
    duration: duration(previous.end - previous.start),
    intent: previous.intent,
    pageName: previous.pageName,
    touchedCount: touched.length,
    topNames: touched.slice(0, 3).map((t) => t.name),
    note: previous.note,
    parked: previous.parked,
    hasTarget: previous.lastSelection.length > 0 || touched.length > 0,
  }
}

async function takeMeThere(): Promise<void> {
  if (!previous) return
  const page = (await figma.getNodeByIdAsync(previous.pageId)) as PageNode | null
  if (page && page.type === 'PAGE') {
    await page.loadAsync()
    await figma.setCurrentPageAsync(page)
  }
  let ids = previous.lastSelection
  if (!ids.length) {
    const touched = Object.keys(previous.touched)
    touched.sort((a, b) => previous!.touched[b].last - previous!.touched[a].last)
    ids = touched.slice(0, 1)
  }
  const nodes: SceneNode[] = []
  for (const id of ids) {
    const n = await figma.getNodeByIdAsync(id)
    if (n && !('removed' in n && n.removed) && n.type !== 'PAGE' && n.type !== 'DOCUMENT') nodes.push(n as SceneNode)
  }
  if (!nodes.length) {
    figma.notify("Couldn't find what you were working on. It may have been deleted.")
    return
  }
  figma.currentPage.selection = nodes
  figma.viewport.scrollAndZoomIntoView(nodes)
  figma.notify('Back where you left off.')
}

// ---------- Tunnel ----------

async function enterTunnel(intent: string): Promise<void> {
  const sel = figma.currentPage.selection
  if (!sel.length) {
    post({ type: 'error', text: 'Select the frame or flow you want to focus on first.' })
    return
  }
  if (tunnel) await exitTunnel(false)

  const scope: { [id: string]: true } = {}
  for (const n of sel) {
    const top = topLevelOf(n)
    if (top) scope[top.id] = true
  }

  const dimmed: TunnelState['dimmed'] = {}
  for (const child of figma.currentPage.children) {
    if (scope[child.id]) continue
    const opacity = 'opacity' in child ? (child as BlendMixin).opacity : 1
    dimmed[child.id] = { opacity, locked: child.locked }
    if ('opacity' in child) (child as BlendMixin).opacity = DIM_OPACITY
    child.locked = true
  }

  tunnel = {
    intent: intent.trim(),
    start: now(),
    pageId: figma.currentPage.id,
    scopeIds: Object.keys(scope),
    dimmed,
  }
  saveTunnel()
  session.intent = tunnel.intent
  offScopeSince = 0
  offScopeIds = {}
  driftShown = false
  driftSnoozedUntil = 0
  dirty = true

  figma.viewport.scrollAndZoomIntoView(sel)
  figma.notify(`Tunnel on: ${tunnel.intent || 'focus'}`)
  sendState()
}

async function restoreDimmed(skip?: { [id: string]: true }): Promise<void> {
  if (!tunnel) return
  const page = (await figma.getNodeByIdAsync(tunnel.pageId)) as PageNode | null
  if (page && page.type === 'PAGE') await page.loadAsync()
  for (const id of Object.keys(tunnel.dimmed)) {
    if (skip && skip[id]) continue
    const n = (await figma.getNodeByIdAsync(id)) as SceneNode | null
    if (!n || ('removed' in n && n.removed)) continue
    const orig = tunnel.dimmed[id]
    if ('opacity' in n) (n as BlendMixin).opacity = orig.opacity
    n.locked = orig.locked
  }
}

async function exitTunnel(announce: boolean): Promise<void> {
  if (!tunnel) return
  await restoreDimmed()
  tunnel = null
  saveTunnel()
  offScopeSince = 0
  offScopeIds = {}
  driftShown = false
  if (announce) figma.notify('Tunnel off. Everything is back.')
  sendState()
}

// ---------- Drift and Park it ----------

function noteEdit(change: NodeChange): void {
  if (change.origin !== 'LOCAL') return
  const node = change.node
  if ('removed' in node && node.removed) return
  const top = topLevelOf(node)
  if (!top) return

  const t = session.touched[top.id] || { name: top.name, count: 0, last: 0 }
  t.name = top.name
  t.count++
  t.last = now()
  session.touched[top.id] = t
  dirty = true

  if (!tunnel || tunnel.pageId !== figma.currentPage.id) return
  const inScope = tunnel.scopeIds.indexOf(top.id) >= 0
  if (inScope) {
    offScopeSince = 0
    offScopeIds = {}
  } else {
    if (!offScopeSince) offScopeSince = now()
    offScopeIds[top.id] = true
  }
}

async function checkDrift(): Promise<void> {
  if (!tunnel || !offScopeSince || driftShown) return
  if (now() < driftSnoozedUntil) return
  const minutes = (now() - offScopeSince) / 60000
  if (minutes < thresholdMin) return
  const nodes: { id: string; name: string }[] = []
  for (const id of Object.keys(offScopeIds)) {
    const n = await figma.getNodeByIdAsync(id)
    if (n && !('removed' in n && n.removed)) nodes.push({ id, name: n.name })
  }
  if (!nodes.length) {
    offScopeSince = 0
    return
  }
  driftShown = true
  post({ type: 'drift', nodes, minutes: Math.round(minutes), intent: tunnel.intent })
}

async function getParkingPage(): Promise<PageNode> {
  for (const p of figma.root.children) {
    if (p.name === PARKING_PAGE) {
      await p.loadAsync()
      return p
    }
  }
  const page = figma.createPage()
  page.name = PARKING_PAGE
  return page
}

async function parkNodes(ids: string[]): Promise<void> {
  const fromPage = figma.currentPage
  const page = await getParkingPage()
  const nodes: SceneNode[] = []
  for (const id of ids) {
    const n = (await figma.getNodeByIdAsync(id)) as SceneNode | null
    if (n && !('removed' in n && n.removed) && n.parent && n.parent.type === 'PAGE') nodes.push(n)
  }
  if (!nodes.length) {
    post({ type: 'error', text: 'Nothing left to park.' })
    return
  }

  // These nodes were dimmed as "outside the tunnel". Put them back to normal
  // before they leave, and forget them so Exit doesn't try to restore them.
  if (tunnel) {
    for (const n of nodes) {
      const orig = tunnel.dimmed[n.id]
      if (orig) {
        if ('opacity' in n) (n as BlendMixin).opacity = orig.opacity
        n.locked = orig.locked
        delete tunnel.dimmed[n.id]
      }
    }
    saveTunnel()
  }

  // Lay the parked group out to the right of whatever is already parked.
  let x = 0
  let y = 0
  for (const c of page.children) x = Math.max(x, c.x + c.width + 200)

  await figma.loadFontAsync({ family: 'Inter', style: 'Regular' })
  await figma.loadFontAsync({ family: 'Inter', style: 'Bold' })
  const stamp = new Date()
  const intent = tunnel ? tunnel.intent : session.intent
  const note = figma.createText()
  note.fontName = { family: 'Inter', style: 'Bold' }
  note.characters = `Parked ${stamp.toLocaleDateString()} ${stamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}\n`
  const bodyStart = note.characters.length
  const body =
    `While the intent was "${intent || '(no intent set)'}". Came from page "${fromPage.name}".\n` +
    `Nothing here is lost. Drag it back whenever it's the thing to do.`
  note.insertCharacters(bodyStart, body)
  note.setRangeFontName(bodyStart, note.characters.length, { family: 'Inter', style: 'Regular' })
  note.fontSize = 14
  note.x = x
  note.y = y
  page.appendChild(note)
  y += note.height + 40

  for (const n of nodes) {
    page.appendChild(n)
    n.x = x
    n.y = y
    y += n.height + 60
  }

  session.parked += nodes.length
  offScopeSince = 0
  offScopeIds = {}
  driftShown = false
  dirty = true

  // Return the user to the scope, not to the parking lot.
  if (tunnel) {
    const scope: SceneNode[] = []
    for (const id of tunnel.scopeIds) {
      const n = (await figma.getNodeByIdAsync(id)) as SceneNode | null
      if (n && !('removed' in n && n.removed)) scope.push(n)
    }
    if (scope.length) {
      figma.currentPage.selection = scope
      figma.viewport.scrollAndZoomIntoView(scope)
    }
  }
  figma.notify(`Parked ${nodes.length} item${nodes.length === 1 ? '' : 's'} in ${PARKING_PAGE}.`)
  sendState()
}

// "Make it the intent": the tangent becomes the tunnel. We re-enter the
// tunnel with the drifted nodes as scope and let the UI collect a new intent line.
async function adoptNodes(ids: string[]): Promise<void> {
  const nodes: SceneNode[] = []
  for (const id of ids) {
    const n = (await figma.getNodeByIdAsync(id)) as SceneNode | null
    if (n && !('removed' in n && n.removed)) nodes.push(n)
  }
  if (!nodes.length) return
  await exitTunnel(false)
  figma.currentPage.selection = nodes
  figma.viewport.scrollAndZoomIntoView(nodes)
  post({ type: 'adopted', name: nodes.map((n) => n.name).join(', ') })
}

async function openParkingLot(): Promise<void> {
  const page = await getParkingPage()
  await figma.setCurrentPageAsync(page)
  if (page.children.length) figma.viewport.scrollAndZoomIntoView(page.children)
}

// ---------- Wiring ----------

function sendState(): void {
  post({
    type: 'state',
    tunnel: tunnel ? { intent: tunnel.intent, start: tunnel.start, scopeCount: tunnel.scopeIds.length } : null,
    reentry: buildReentry(),
    note: session.note,
    threshold: thresholdMin,
    hasSelection: figma.currentPage.selection.length > 0,
  })
}

function listenToPage(): void {
  const page = figma.currentPage
  if (listeningPageId === page.id) return
  listeningPageId = page.id
  page.on('nodechange', (e: NodeChangeEvent) => {
    for (const c of e.nodeChanges) noteEdit(c)
  })
}

async function main(): Promise<void> {
  await loadState()
  figma.showUI(__html__, { width: 320, height: 540, themeColors: true })

  listenToPage()
  figma.on('currentpagechange', () => {
    listenToPage()
    sendState()
  })
  figma.on('selectionchange', () => {
    const sel = figma.currentPage.selection
    if (sel.length) {
      session.lastSelection = sel.map((n) => n.id)
      session.pageId = figma.currentPage.id
      session.pageName = figma.currentPage.name
      dirty = true
    }
    post({ type: 'selection', hasSelection: sel.length > 0 })
  })

  setInterval(() => {
    if (dirty) saveSessions()
  }, SAVE_EVERY_MS)
  setInterval(() => {
    checkDrift()
  }, DRIFT_CHECK_MS)

  figma.ui.onmessage = async (msg: UiMessage) => {
    switch (msg.type) {
      case 'ready':
        sendState()
        break
      case 'enter-tunnel':
        await enterTunnel(msg.intent)
        break
      case 'exit-tunnel':
        await exitTunnel(true)
        break
      case 'park':
        await parkNodes(msg.ids)
        break
      case 'adopt':
        await adoptNodes(msg.ids)
        break
      case 'snooze-drift':
        driftShown = false
        offScopeSince = now()
        driftSnoozedUntil = now() + thresholdMin * 60000
        break
      case 'take-me-there':
        await takeMeThere()
        break
      case 'dismiss-reentry':
        previous = null
        sendState()
        break
      case 'save-note':
        session.note = msg.note
        dirty = true
        break
      case 'set-threshold':
        thresholdMin = msg.minutes
        await figma.clientStorage.setAsync('anchor:threshold', thresholdMin)
        break
      case 'open-parking-lot':
        await openParkingLot()
        break
    }
  }

  // Mark the session as ended on close. The write is best-effort: the
  // periodic save has usually already captured everything.
  figma.on('close', () => {
    session.end = now()
    saveSessions()
  })
}

main()
