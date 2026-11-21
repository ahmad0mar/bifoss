// Liquid glass tab bar engine (WebGL2 + springs), ported from a vanilla script.
//
// The open tab sits in a soft capsule. When another tab is chosen the capsule
// lifts off as a drop of clear glass, drawn on the GPU over the bar: it shows
// the row larger through its middle and bends it hard at its rim, each colour
// its own way, so words and icons split like light through a prism. Held, the
// drop follows the finger along the bar; let go, it carries on to the nearest
// tab and settles. Without WebGL2 (or with reduced motion) the capsule simply
// moves between tabs.
//
// createLiquidTabs() takes the bar's elements and returns { select, setOpen,
// getOpen, destroy }. The page's router decides which tab is open (setOpen);
// choosing a tab by tap, drag or key calls onSelect(index).

const PAD = 4 // px between the bar's edge and a tab's capsule
const GROW = 0.36 // how much wider the drop is than the capsule, lifted
const TALL = 1.32 // and how tall against the bar
const LENS = 1.2 // how much larger the row shows through it, lifted
const DRAW_OUT = 0.0003 // how drawn out it is, per px a second it moves
const MOST = 0.22 // and at most
const SLOP = 6 // px a press travels before it is a drag, not a tap
const THROW = 0.14 // s of a release's speed it carries on for
const MOVE = { stiffness: 160, damping: 23 }
const HOLD = { stiffness: 620, damping: 50 }
const RISE = { stiffness: 240, damping: 27 }
const LAND = { stiffness: 240, damping: 27 }

const VERTEX = `#version 300 es
void main() {
  vec2 corner = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2));
  gl_Position = vec4(corner * 2.0 - 1.0, 0.0, 1.0);
}`

const FRAGMENT = `#version 300 es
precision highp float;

uniform sampler2D u_row;
uniform vec2 u_size;
uniform float u_dpr;
uniform vec2 u_rowAt;
uniform vec2 u_rowSize;
uniform vec2 u_center;
uniform vec2 u_half;
uniform vec2 u_scale;
uniform float u_zoom;
uniform float u_lift;
uniform float u_dark;

out vec4 color;

const float BEZEL = 0.62;
const float PULL = 0.15;
const float LEAST = 0.5;
const float MOST = 1.5;
const int TAPS = 9;

vec4 row(vec2 p) {
  vec2 uv = (p - u_rowAt) / u_rowSize;
  if (any(lessThan(uv, vec2(0.0))) || any(greaterThan(uv, vec2(1.0)))) return vec4(0.0);
  return texture(u_row, uv);
}

vec3 hue(float t) {
  return clamp(1.0 - abs(t - vec3(0.1, 0.5, 0.9)) * 2.5, 0.0, 1.0);
}

vec4 over(vec4 top, vec4 under) {
  return top + under * (1.0 - top.a);
}

void main() {
  vec2 p = vec2(gl_FragCoord.x, u_size.y * u_dpr - gl_FragCoord.y) / u_dpr;
  vec2 v = p - u_center;
  vec2 l = v / u_scale;
  float r = u_half.y;
  vec2 q = vec2(max(abs(l.x) - max(u_half.x - r, 0.0), 0.0), l.y);
  float d = length(q);
  vec2 outward = d > 1e-4 ? vec2(sign(l.x) * q.x, q.y) / d : vec2(0.0);
  float edge = r - d;
  float px = max(length(outward * u_scale), 1.0);
  float edgeOn = edge * px;
  if (edgeOn < -1.0) {
    color = vec4(0.0);
    return;
  }
  float inside = smoothstep(-0.7, 0.7, edgeOn);

  float bezel = r * BEZEL;
  float fall = 1.0 - clamp(edge / bezel, 0.0, 1.0);
  float bend = r * PULL * u_lift * fall * fall;
  vec2 at = u_center + v / u_zoom;
  vec4 seen;
  if (bend < 0.01) {
    seen = row(at);
  } else {
    vec2 way = outward * u_scale * bend;
    vec3 rgb = vec3(0.0);
    vec3 alpha = vec3(0.0);
    vec3 weight = vec3(0.0);
    for (int i = 0; i < TAPS; i++) {
      float t = float(i) / float(TAPS - 1);
      vec3 w = hue(t);
      vec4 s = row(at - way * mix(LEAST, MOST, t));
      rgb += s.rgb * w;
      alpha += s.a * w;
      weight += w;
    }
    alpha /= weight;
    seen = vec4(rgb / weight, max(alpha.r, max(alpha.g, alpha.b)));
  }

  vec4 glass = over(vec4(vec3(0.035 * u_dark * u_lift), 0.035 * u_dark * u_lift), seen);
  float shade = u_lift * mix(0.06, 0.13, u_dark) * exp(-pow((edge - 0.3 * bezel) / (0.22 * bezel), 2.0));
  glass = over(vec4(0.0, 0.0, 0.0, shade), glass);
  vec3 bright = hue(smoothstep(-0.8, 0.8, outward.x - 0.4 * outward.y));
  vec3 tint = mix(vec3(1.0), bright / max(bright.r, max(bright.g, bright.b)), 0.6);
  float thread = u_lift * mix(0.24, 0.26, u_dark) * exp(-pow((edgeOn - 2.0) / 0.75, 2.0));
  glass = over(vec4(tint * thread, thread), glass);
  float hair = u_lift * mix(0.95, 0.85, u_dark) * smoothstep(1.7, 0.1, edgeOn) * (0.3 + 0.7 * outward.y * outward.y) * (outward.y < 0.0 ? 1.0 : 0.75);
  glass = over(vec4(vec3(hair), hair), glass);
  float line = u_lift * (1.0 - u_dark) * 0.1 * smoothstep(0.9, 0.0, abs(edgeOn - 0.2));
  glass = over(vec4(0.0, 0.0, 0.0, line), glass);

  color = glass * inside;
}`

function compile(gl, type, source) {
  const shader = gl.createShader(type)
  if (!shader) return null
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) return shader
  gl.deleteShader(shader)
  return null
}

function link(gl, vertex, fragment) {
  const program = gl.createProgram()
  if (!program) return null
  gl.attachShader(program, vertex)
  gl.attachShader(program, fragment)
  gl.linkProgram(program)
  if (gl.getProgramParameter(program, gl.LINK_STATUS)) return program
  gl.deleteProgram(program)
  return null
}

// a colour as rgba(), whatever notation the page hands back, read off one pixel
let pixel = null
function rgba(css) {
  if (!pixel) {
    const canvas = document.createElement('canvas')
    canvas.width = canvas.height = 1
    pixel = canvas.getContext('2d', { willReadFrequently: true })
  }
  if (!pixel) return css
  pixel.clearRect(0, 0, 1, 1)
  pixel.fillStyle = css
  pixel.fillRect(0, 0, 1, 1)
  const [r, g, b, a] = pixel.getImageData(0, 0, 1, 1).data
  return `rgba(${r}, ${g}, ${b}, ${(a / 255).toFixed(3)})`
}

function capsule(context, x, y, w, h) {
  const r = Math.min(w, h) / 2
  context.beginPath()
  context.moveTo(x + r, y)
  context.lineTo(x + w - r, y)
  context.arc(x + w - r, y + r, r, -Math.PI / 2, Math.PI / 2)
  context.lineTo(x + r, y + h)
  context.arc(x + r, y + r, r, Math.PI / 2, (Math.PI * 3) / 2)
  context.closePath()
}

// The bar as the drop shows it, painted `scale` times over: its glass, then
// each tab's icon (its own svg, drawn as a picture) and word. The lit tab is
// drawn in `tint`, the rest in `rest`.
async function paintRow(bar, skin, row, out, scale, rest, tint, lit, pictures) {
  const box = bar.getBoundingClientRect()
  const k = box.width / bar.offsetWidth || 1
  const left = box.left + bar.clientLeft * k
  const top = box.top + bar.clientTop * k
  const place = (element) => {
    const at = element.getBoundingClientRect()
    return { x: (at.left - left) / k, y: (at.top - top) / k, w: at.width / k, h: at.height / k }
  }
  const tabs = [...row.children]
  const icons = await Promise.all(
    tabs.map(async (tab, i) => {
      const svg = tab.querySelector('svg')
      if (!svg) return null
      const at = place(svg)
      const copy = svg.cloneNode(true)
      copy.removeAttribute('class')
      copy.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
      copy.setAttribute('width', String(Math.round(at.w * scale)))
      copy.setAttribute('height', String(Math.round(at.h * scale)))
      copy.style.color = i === lit ? tint : rest
      const markup = new XMLSerializer().serializeToString(copy)
      let picture = pictures.get(markup)
      if (!picture) {
        picture = new Image()
        picture.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(markup)}`
        try {
          await picture.decode()
        } catch {
          return null
        }
        if (pictures.size > 48) pictures.clear()
        pictures.set(markup, picture)
      }
      return { picture, at }
    }),
  )
  out.width = Math.round(bar.clientWidth * scale)
  out.height = Math.round(bar.clientHeight * scale)
  const context = out.getContext('2d')
  if (!context) return false
  const look = getComputedStyle(skin)
  const border = parseFloat(look.borderTopWidth) || 0
  const w = bar.clientWidth * scale
  const h = bar.clientHeight * scale
  capsule(context, 0, 0, w, h)
  context.fillStyle = rgba(look.backgroundColor)
  context.fill()
  context.save()
  context.clip()
  capsule(context, 0, scale, w, h)
  context.lineWidth = 2 * scale
  context.strokeStyle = 'rgba(255, 255, 255, 0.9)'
  context.stroke()
  context.restore()
  if (border) {
    capsule(context, (border * scale) / 2, (border * scale) / 2, w - border * scale, h - border * scale)
    context.lineWidth = border * scale
    context.strokeStyle = rgba(look.borderTopColor)
    context.stroke()
  }
  tabs.forEach((tab, i) => {
    const icon = icons[i]
    if (icon) context.drawImage(icon.picture, icon.at.x * scale, icon.at.y * scale, icon.at.w * scale, icon.at.h * scale)
    const word = tab.querySelector('svg + span')
    const text = word?.textContent
    if (!word || !text) return
    const style = getComputedStyle(word)
    const at = place(word)
    context.font = `${style.fontStyle} ${style.fontWeight} ${parseFloat(style.fontSize) * scale}px ${style.fontFamily}`
    if ('letterSpacing' in context) context.letterSpacing = `${(parseFloat(style.letterSpacing) || 0) * scale}px`
    context.fillStyle = i === lit ? tint : rest
    context.textAlign = 'center'
    context.textBaseline = 'alphabetic'
    const metrics = context.measureText(text)
    const ascent = metrics.fontBoundingBoxAscent
    const baseline = at.y * scale + (at.h * scale - ascent - metrics.fontBoundingBoxDescent) / 2 + ascent
    context.fillText(text, (at.x + at.w / 2) * scale, baseline)
  })
  return true
}

function outline(x, y, hw, hh, rx) {
  const ends = Math.min(rx, hw)
  const a = x - hw + ends
  const b = x + hw - ends
  return `M${a} ${y - hh}H${b}A${ends} ${hh} 0 0 1 ${b} ${y + hh}H${a}A${ends} ${hh} 0 0 1 ${a} ${y - hh}Z`
}

function pull(s, to, { stiffness, damping }, dt) {
  s.v += (-stiffness * (s.x - to) - damping * s.v) * dt
  s.x += s.v * dt
}

const give = (over, reach) => (over * reach * 0.55) / (reach + 0.55 * Math.abs(over))

/**
 * @param {object} o
 * @param {HTMLElement} o.bar     the bar (position: relative, has a size)
 * @param {HTMLElement} o.skin    the bar's glass
 * @param {HTMLElement} o.drop    the drop, a capsule that follows the open tab
 * @param {HTMLElement} o.pill    the capsule inside the drop
 * @param {HTMLElement} o.row     holds one child per tab, each with an svg then a span
 * @param {HTMLCanvasElement} o.canvas  the GPU layer
 * @param {HTMLElement} o.ink     an element whose CSS colour is the resting tab colour
 * @param {string} o.tint         the lit tab's colour (must match the .lit CSS colour)
 * @param {number} o.initial      the open tab, or -1 for none
 * @param {(k:number)=>void} o.onSelect  called when the person chooses a tab
 */
export function createLiquidTabs({ bar, skin, drop, pill, row, canvas, ink, tint, initial, onSelect }) {
  const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const tabs = [...row.children]
  bar.style.setProperty('--count', String(tabs.length))

  let open = initial
  let lit = initial
  let goal = initial
  let hand = null
  let alive = true
  const size = { width: 0, height: 0 }

  const middleOf = (k) => {
    const span = (size.width - 2 * PAD) / tabs.length
    return PAD + span * (k + 0.5)
  }
  const nearest = (x) => {
    const span = (size.width - 2 * PAD) / tabs.length
    return Math.max(0, Math.min(tabs.length - 1, Math.floor((x - PAD) / span)))
  }

  const pos = { x: 0, v: 0 }
  const lift = { x: 0, v: 0 }
  const shape = { x: 0, v: 0 }
  let placed = false
  let margin = 0
  let dpr = Math.min(window.devicePixelRatio || 1, 3)

  let gl = null
  let program = null
  let vao = null
  let texture = null
  let u = {}
  let ready = false
  let drawn = false
  let lost = false

  const setUp = () => {
    gl = canvas.getContext('webgl2', { alpha: true, premultipliedAlpha: true, antialias: false, depth: false })
    const vertex = gl && compile(gl, gl.VERTEX_SHADER, VERTEX)
    const fragment = gl && compile(gl, gl.FRAGMENT_SHADER, FRAGMENT)
    program = gl && vertex && fragment ? link(gl, vertex, fragment) : null
    vao = gl && program ? gl.createVertexArray() : null
    texture = gl && program ? gl.createTexture() : null
    const at = (name) => (gl && program ? gl.getUniformLocation(program, name) : null)
    u = {
      row: at('u_row'),
      size: at('u_size'),
      dpr: at('u_dpr'),
      rowAt: at('u_rowAt'),
      rowSize: at('u_rowSize'),
      center: at('u_center'),
      half: at('u_half'),
      scale: at('u_scale'),
      zoom: at('u_zoom'),
      lift: at('u_lift'),
      dark: at('u_dark'),
    }
    if (gl && texture) {
      gl.bindTexture(gl.TEXTURE_2D, texture)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    }
    ready = false
    lost = false
  }
  setUp()

  const painted = document.createElement('canvas')
  const pictures = new Map()
  let asked = 0
  function repaint() {
    if (!gl || !texture || lost || !alive) return
    const turn = ++asked
    const go = async () => {
      await document.fonts.ready
      if (!alive || turn !== asked || !bar.clientWidth) return
      const done = await paintRow(bar, skin, row, painted, dpr * 1.25, rgba(getComputedStyle(ink).color), tint, lit, pictures)
      if (!alive || !done || turn !== asked || lost) return
      try {
        gl.bindTexture(gl.TEXTURE_2D, texture)
        gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true)
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, painted)
        ready = true
      } catch {
        ready = false
      }
    }
    void go()
  }

  // the lit tab's colour and weight, which tab is the current page, and the
  // row painted again for the drop
  const show = () => {
    tabs.forEach((tab, k) => {
      if (k === open) tab.setAttribute('aria-current', 'page')
      else tab.removeAttribute('aria-current')
      const face = tab.querySelector('.lg-face')
      face?.classList.toggle('lit', k === lit)
      tab.querySelector('svg')?.setAttribute('stroke-width', k === lit ? '2.3' : '1.9')
    })
    repaint()
  }
  show()

  const choose = (k) => {
    goal = k
    if (k === open) return
    if (open < 0) {
      pos.x = middleOf(k)
      pos.v = 0
    }
    open = k
    show()
    onSelect?.(k)
  }

  // the router's say: no animation of its own, and no onSelect
  const setOpen = (k) => {
    if (!alive) return
    goal = k
    if (k === open) return
    if (open < 0 && k >= 0) {
      pos.x = middleOf(k)
      pos.v = 0
    }
    open = k
    if (k < 0) lit = -1
    show()
  }

  const resizer = new ResizeObserver(() => {
    size.width = bar.clientWidth
    size.height = bar.clientHeight
    if (!placed && bar.clientWidth) {
      pos.x = middleOf(Math.max(goal, 0))
      placed = true
    }
    margin = Math.ceil(Math.max(size.height, (size.width - 2 * PAD) / tabs.length))
    dpr = Math.min(window.devicePixelRatio || 1, 3)
    canvas.style.left = canvas.style.top = `${-margin}px`
    canvas.style.width = `${size.width + 2 * margin}px`
    canvas.style.height = `${size.height + 2 * margin}px`
    canvas.width = Math.round((size.width + 2 * margin) * dpr)
    canvas.height = Math.round((size.height + 2 * margin) * dpr)
    drawn = true
    repaint()
  })
  resizer.observe(bar)

  const step = (dt) => {
    const first = middleOf(0)
    const last = middleOf(tabs.length - 1)
    let to = goal >= 0 ? middleOf(goal) : pos.x
    if (hand) {
      const reach = size.width / tabs.length
      to = hand.x < first ? first + give(hand.x - first, reach) : hand.x > last ? last + give(hand.x - last, reach) : hand.x
    }
    if (still) {
      pos.x = to
      pos.v = 0
    } else pull(pos, to, hand ? HOLD : MOVE, dt)
    const going = Math.abs(pos.x - to) > 10 || Math.abs(pos.v) > 120
    const up = !still && (!!hand || going)
    pull(lift, up ? 1 : 0, up ? RISE : LAND, dt)
    pull(shape, still ? 0 : Math.min(MOST, Math.abs(pos.v) * DRAW_OUT), LAND, dt)
  }

  const draw = (delta) => {
    const { width, height } = size
    if (!width || !height) return
    let left = Math.min(delta, 100) / 1000
    while (left > 0) {
      const dt = Math.min(left, 1 / 120)
      step(dt)
      left -= dt
    }
    const span = (width - 2 * PAD) / tabs.length
    const tall = height - 2 * PAD
    const l = Math.max(0, lift.x)
    const out = Math.max(0, shape.x)
    const w = span * (1 + GROW * l)
    const h = tall * (1 + ((height * TALL) / tall - 1) * l)
    const sx = 1 + out
    const sy = 1 / (1 + 0.6 * out)
    // no tab open (a page that is not in the bar): no capsule, and no drop
    const shown = open >= 0 || !!hand
    drop.style.visibility = shown ? 'visible' : 'hidden'
    drop.style.width = `${w}px`
    drop.style.height = `${h}px`
    drop.style.transform = `translate(${pos.x - w / 2}px, ${(height - h) / 2}px) scale(${sx}, ${sy})`
    drop.style.boxShadow = `0 ${8 * l}px ${22 * l}px rgb(0 0 0 / ${0.14 * l})`

    const lens = !!gl && !!program && ready && !lost
    const on = lens && shown && l > 0.004
    pill.style.opacity = String(lens ? Math.max(0, 1 - 1.6 * l) : 1)
    if (on) {
      const hole = outline(pos.x, height / 2, (w * sx) / 2, (h * sy) / 2, (h / 2) * sx)
      row.style.clipPath = skin.style.clipPath = `path(evenodd, "M${-margin} ${-margin}H${width + margin}V${height + margin}H${-margin}Z${hole}")`
      gl.viewport(0, 0, canvas.width, canvas.height)
      gl.clearColor(0, 0, 0, 0)
      gl.clear(gl.COLOR_BUFFER_BIT)
      gl.useProgram(program)
      gl.bindVertexArray(vao)
      gl.activeTexture(gl.TEXTURE0)
      gl.bindTexture(gl.TEXTURE_2D, texture)
      gl.uniform1i(u.row, 0)
      gl.uniform2f(u.size, width + 2 * margin, height + 2 * margin)
      gl.uniform1f(u.dpr, canvas.width / (width + 2 * margin))
      gl.uniform2f(u.rowAt, margin, margin)
      gl.uniform2f(u.rowSize, width, height)
      gl.uniform2f(u.center, pos.x + margin, height / 2 + margin)
      gl.uniform2f(u.half, w / 2, h / 2)
      gl.uniform2f(u.scale, sx, sy)
      gl.uniform1f(u.zoom, 1 + (LENS - 1) * l)
      gl.uniform1f(u.lift, Math.min(1, l))
      gl.uniform1f(u.dark, 0)
      gl.drawArrays(gl.TRIANGLES, 0, 3)
      drawn = true
    } else if (drawn) {
      row.style.clipPath = skin.style.clipPath = ''
      if (gl && !lost) {
        gl.viewport(0, 0, canvas.width, canvas.height)
        gl.clearColor(0, 0, 0, 0)
        gl.clear(gl.COLOR_BUFFER_BIT)
      }
      drawn = false
    }
    const over = hand ? nearest(pos.x) : goal
    if (over !== lit) {
      lit = over
      show()
    }
  }

  let lastTime = 0
  let raf = 0
  const frame = (timestamp) => {
    if (!alive) return
    const delta = lastTime ? Math.max(1, Math.min(timestamp - lastTime, 40)) : 1000 / 60
    lastTime = timestamp
    draw(delta)
    raf = requestAnimationFrame(frame)
  }
  raf = requestAnimationFrame(frame)

  const onLost = (event) => {
    event.preventDefault()
    lost = true
    ready = false
    row.style.clipPath = skin.style.clipPath = ''
  }
  const onRestored = () => {
    setUp()
    repaint()
  }
  canvas.addEventListener('webglcontextlost', onLost)
  canvas.addEventListener('webglcontextrestored', onRestored)
  const onFonts = () => repaint()
  document.fonts.addEventListener('loadingdone', onFonts)

  const across = (event) => event.clientX - bar.getBoundingClientRect().left

  const onDown = (event) => {
    // with no tab open there is no drop to hold: a press is just a click on a link
    if (event.button !== 0 || hand || open < 0) return
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return
    bar.setPointerCapture(event.pointerId)
    const x = across(event)
    hand = { id: event.pointerId, x, x0: x, moved: false, samples: [{ x, t: event.timeStamp }] }
  }
  const onMove = (event) => {
    if (!hand || hand.id !== event.pointerId) return
    hand.x = across(event)
    if (Math.abs(hand.x - hand.x0) > SLOP) hand.moved = true
    hand.samples.push({ x: hand.x, t: event.timeStamp })
    if (hand.samples.length > 6) hand.samples.shift()
  }
  // a tap opens the tab under it; a drag, the tab nearest where it would come
  // to rest, thrown on at the speed of its last moves
  const letGo = (event) => {
    const was = hand
    if (!was || was.id !== event.pointerId) return
    hand = null
    if (event.type === 'pointercancel') return
    if (!was.moved) return choose(nearest(was.x0))
    const recent = was.samples.filter((s) => event.timeStamp - s.t < 100)
    const dt = recent.length > 1 ? recent[recent.length - 1].t - recent[0].t : 0
    const speed = dt > 0 ? ((recent[recent.length - 1].x - recent[0].x) / dt) * 1000 : 0
    choose(nearest(was.x + speed * THROW))
  }
  // links are draggable by default, and a native drag cancels the pointer
  const onDragStart = (event) => event.preventDefault()
  bar.addEventListener('dragstart', onDragStart)
  bar.addEventListener('pointerdown', onDown)
  bar.addEventListener('pointermove', onMove)
  bar.addEventListener('pointerup', letGo)
  bar.addEventListener('pointercancel', letGo)

  return {
    select: choose,
    setOpen,
    getOpen: () => open,
    destroy() {
      alive = false
      cancelAnimationFrame(raf)
      resizer.disconnect()
      canvas.removeEventListener('webglcontextlost', onLost)
      canvas.removeEventListener('webglcontextrestored', onRestored)
      document.fonts.removeEventListener('loadingdone', onFonts)
      bar.removeEventListener('dragstart', onDragStart)
      bar.removeEventListener('pointerdown', onDown)
      bar.removeEventListener('pointermove', onMove)
      bar.removeEventListener('pointerup', letGo)
      bar.removeEventListener('pointercancel', letGo)
      row.style.clipPath = skin.style.clipPath = ''
      if (gl) {
        if (program) gl.deleteProgram(program)
        if (texture) gl.deleteTexture(texture)
        if (vao) gl.deleteVertexArray(vao)
      }
    },
  }
}
