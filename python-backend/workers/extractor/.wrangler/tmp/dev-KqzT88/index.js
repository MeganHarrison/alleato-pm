var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};

// .wrangler/tmp/bundle-sX1Lat/strip-cf-connecting-ip-header.js
function stripCfConnectingIPHeader(input, init) {
  const request = new Request(input, init);
  request.headers.delete("CF-Connecting-IP");
  return request;
}
__name(stripCfConnectingIPHeader, "stripCfConnectingIPHeader");
globalThis.fetch = new Proxy(globalThis.fetch, {
  apply(target, thisArg, argArray) {
    return Reflect.apply(target, thisArg, [
      stripCfConnectingIPHeader.apply(null, argArray)
    ]);
  }
});

// ../node_modules/unenv/dist/runtime/_internal/utils.mjs
function createNotImplementedError(name) {
  return new Error(`[unenv] ${name} is not implemented yet!`);
}
__name(createNotImplementedError, "createNotImplementedError");
function notImplemented(name) {
  const fn = /* @__PURE__ */ __name(() => {
    throw createNotImplementedError(name);
  }, "fn");
  return Object.assign(fn, { __unenv__: true });
}
__name(notImplemented, "notImplemented");
function notImplementedClass(name) {
  return class {
    __unenv__ = true;
    constructor() {
      throw new Error(`[unenv] ${name} is not implemented yet!`);
    }
  };
}
__name(notImplementedClass, "notImplementedClass");

// ../node_modules/unenv/dist/runtime/node/internal/perf_hooks/performance.mjs
var _timeOrigin = globalThis.performance?.timeOrigin ?? Date.now();
var _performanceNow = globalThis.performance?.now ? globalThis.performance.now.bind(globalThis.performance) : () => Date.now() - _timeOrigin;
var nodeTiming = {
  name: "node",
  entryType: "node",
  startTime: 0,
  duration: 0,
  nodeStart: 0,
  v8Start: 0,
  bootstrapComplete: 0,
  environment: 0,
  loopStart: 0,
  loopExit: 0,
  idleTime: 0,
  uvMetricsInfo: {
    loopCount: 0,
    events: 0,
    eventsWaiting: 0
  },
  detail: void 0,
  toJSON() {
    return this;
  }
};
var PerformanceEntry = class {
  __unenv__ = true;
  detail;
  entryType = "event";
  name;
  startTime;
  constructor(name, options) {
    this.name = name;
    this.startTime = options?.startTime || _performanceNow();
    this.detail = options?.detail;
  }
  get duration() {
    return _performanceNow() - this.startTime;
  }
  toJSON() {
    return {
      name: this.name,
      entryType: this.entryType,
      startTime: this.startTime,
      duration: this.duration,
      detail: this.detail
    };
  }
};
__name(PerformanceEntry, "PerformanceEntry");
var PerformanceMark = /* @__PURE__ */ __name(class PerformanceMark2 extends PerformanceEntry {
  entryType = "mark";
  constructor() {
    super(...arguments);
  }
  get duration() {
    return 0;
  }
}, "PerformanceMark");
var PerformanceMeasure = class extends PerformanceEntry {
  entryType = "measure";
};
__name(PerformanceMeasure, "PerformanceMeasure");
var PerformanceResourceTiming = class extends PerformanceEntry {
  entryType = "resource";
  serverTiming = [];
  connectEnd = 0;
  connectStart = 0;
  decodedBodySize = 0;
  domainLookupEnd = 0;
  domainLookupStart = 0;
  encodedBodySize = 0;
  fetchStart = 0;
  initiatorType = "";
  name = "";
  nextHopProtocol = "";
  redirectEnd = 0;
  redirectStart = 0;
  requestStart = 0;
  responseEnd = 0;
  responseStart = 0;
  secureConnectionStart = 0;
  startTime = 0;
  transferSize = 0;
  workerStart = 0;
  responseStatus = 0;
};
__name(PerformanceResourceTiming, "PerformanceResourceTiming");
var PerformanceObserverEntryList = class {
  __unenv__ = true;
  getEntries() {
    return [];
  }
  getEntriesByName(_name, _type) {
    return [];
  }
  getEntriesByType(type) {
    return [];
  }
};
__name(PerformanceObserverEntryList, "PerformanceObserverEntryList");
var Performance = class {
  __unenv__ = true;
  timeOrigin = _timeOrigin;
  eventCounts = /* @__PURE__ */ new Map();
  _entries = [];
  _resourceTimingBufferSize = 0;
  navigation = void 0;
  timing = void 0;
  timerify(_fn, _options) {
    throw createNotImplementedError("Performance.timerify");
  }
  get nodeTiming() {
    return nodeTiming;
  }
  eventLoopUtilization() {
    return {};
  }
  markResourceTiming() {
    return new PerformanceResourceTiming("");
  }
  onresourcetimingbufferfull = null;
  now() {
    if (this.timeOrigin === _timeOrigin) {
      return _performanceNow();
    }
    return Date.now() - this.timeOrigin;
  }
  clearMarks(markName) {
    this._entries = markName ? this._entries.filter((e) => e.name !== markName) : this._entries.filter((e) => e.entryType !== "mark");
  }
  clearMeasures(measureName) {
    this._entries = measureName ? this._entries.filter((e) => e.name !== measureName) : this._entries.filter((e) => e.entryType !== "measure");
  }
  clearResourceTimings() {
    this._entries = this._entries.filter((e) => e.entryType !== "resource" || e.entryType !== "navigation");
  }
  getEntries() {
    return this._entries;
  }
  getEntriesByName(name, type) {
    return this._entries.filter((e) => e.name === name && (!type || e.entryType === type));
  }
  getEntriesByType(type) {
    return this._entries.filter((e) => e.entryType === type);
  }
  mark(name, options) {
    const entry = new PerformanceMark(name, options);
    this._entries.push(entry);
    return entry;
  }
  measure(measureName, startOrMeasureOptions, endMark) {
    let start;
    let end;
    if (typeof startOrMeasureOptions === "string") {
      start = this.getEntriesByName(startOrMeasureOptions, "mark")[0]?.startTime;
      end = this.getEntriesByName(endMark, "mark")[0]?.startTime;
    } else {
      start = Number.parseFloat(startOrMeasureOptions?.start) || this.now();
      end = Number.parseFloat(startOrMeasureOptions?.end) || this.now();
    }
    const entry = new PerformanceMeasure(measureName, {
      startTime: start,
      detail: {
        start,
        end
      }
    });
    this._entries.push(entry);
    return entry;
  }
  setResourceTimingBufferSize(maxSize) {
    this._resourceTimingBufferSize = maxSize;
  }
  addEventListener(type, listener, options) {
    throw createNotImplementedError("Performance.addEventListener");
  }
  removeEventListener(type, listener, options) {
    throw createNotImplementedError("Performance.removeEventListener");
  }
  dispatchEvent(event) {
    throw createNotImplementedError("Performance.dispatchEvent");
  }
  toJSON() {
    return this;
  }
};
__name(Performance, "Performance");
var PerformanceObserver = class {
  __unenv__ = true;
  _callback = null;
  constructor(callback) {
    this._callback = callback;
  }
  takeRecords() {
    return [];
  }
  disconnect() {
    throw createNotImplementedError("PerformanceObserver.disconnect");
  }
  observe(options) {
    throw createNotImplementedError("PerformanceObserver.observe");
  }
  bind(fn) {
    return fn;
  }
  runInAsyncScope(fn, thisArg, ...args) {
    return fn.call(thisArg, ...args);
  }
  asyncId() {
    return 0;
  }
  triggerAsyncId() {
    return 0;
  }
  emitDestroy() {
    return this;
  }
};
__name(PerformanceObserver, "PerformanceObserver");
__publicField(PerformanceObserver, "supportedEntryTypes", []);
var performance = globalThis.performance && "addEventListener" in globalThis.performance ? globalThis.performance : new Performance();

// ../node_modules/@cloudflare/unenv-preset/dist/runtime/polyfill/performance.mjs
globalThis.performance = performance;
globalThis.Performance = Performance;
globalThis.PerformanceEntry = PerformanceEntry;
globalThis.PerformanceMark = PerformanceMark;
globalThis.PerformanceMeasure = PerformanceMeasure;
globalThis.PerformanceObserver = PerformanceObserver;
globalThis.PerformanceObserverEntryList = PerformanceObserverEntryList;
globalThis.PerformanceResourceTiming = PerformanceResourceTiming;

// ../node_modules/unenv/dist/runtime/node/console.mjs
import { Writable } from "node:stream";

// ../node_modules/unenv/dist/runtime/mock/noop.mjs
var noop_default = Object.assign(() => {
}, { __unenv__: true });

// ../node_modules/unenv/dist/runtime/node/console.mjs
var _console = globalThis.console;
var _ignoreErrors = true;
var _stderr = new Writable();
var _stdout = new Writable();
var log = _console?.log ?? noop_default;
var info = _console?.info ?? log;
var trace = _console?.trace ?? info;
var debug = _console?.debug ?? log;
var table = _console?.table ?? log;
var error = _console?.error ?? log;
var warn = _console?.warn ?? error;
var createTask = _console?.createTask ?? /* @__PURE__ */ notImplemented("console.createTask");
var clear = _console?.clear ?? noop_default;
var count = _console?.count ?? noop_default;
var countReset = _console?.countReset ?? noop_default;
var dir = _console?.dir ?? noop_default;
var dirxml = _console?.dirxml ?? noop_default;
var group = _console?.group ?? noop_default;
var groupEnd = _console?.groupEnd ?? noop_default;
var groupCollapsed = _console?.groupCollapsed ?? noop_default;
var profile = _console?.profile ?? noop_default;
var profileEnd = _console?.profileEnd ?? noop_default;
var time = _console?.time ?? noop_default;
var timeEnd = _console?.timeEnd ?? noop_default;
var timeLog = _console?.timeLog ?? noop_default;
var timeStamp = _console?.timeStamp ?? noop_default;
var Console = _console?.Console ?? /* @__PURE__ */ notImplementedClass("console.Console");
var _times = /* @__PURE__ */ new Map();
var _stdoutErrorHandler = noop_default;
var _stderrErrorHandler = noop_default;

// ../node_modules/@cloudflare/unenv-preset/dist/runtime/node/console.mjs
var workerdConsole = globalThis["console"];
var {
  assert,
  clear: clear2,
  // @ts-expect-error undocumented public API
  context,
  count: count2,
  countReset: countReset2,
  // @ts-expect-error undocumented public API
  createTask: createTask2,
  debug: debug2,
  dir: dir2,
  dirxml: dirxml2,
  error: error2,
  group: group2,
  groupCollapsed: groupCollapsed2,
  groupEnd: groupEnd2,
  info: info2,
  log: log2,
  profile: profile2,
  profileEnd: profileEnd2,
  table: table2,
  time: time2,
  timeEnd: timeEnd2,
  timeLog: timeLog2,
  timeStamp: timeStamp2,
  trace: trace2,
  warn: warn2
} = workerdConsole;
Object.assign(workerdConsole, {
  Console,
  _ignoreErrors,
  _stderr,
  _stderrErrorHandler,
  _stdout,
  _stdoutErrorHandler,
  _times
});
var console_default = workerdConsole;

// ../node_modules/wrangler/_virtual_unenv_global_polyfill-@cloudflare-unenv-preset-node-console
globalThis.console = console_default;

// ../node_modules/unenv/dist/runtime/node/internal/process/hrtime.mjs
var hrtime = /* @__PURE__ */ Object.assign(/* @__PURE__ */ __name(function hrtime2(startTime) {
  const now = Date.now();
  const seconds = Math.trunc(now / 1e3);
  const nanos = now % 1e3 * 1e6;
  if (startTime) {
    let diffSeconds = seconds - startTime[0];
    let diffNanos = nanos - startTime[0];
    if (diffNanos < 0) {
      diffSeconds = diffSeconds - 1;
      diffNanos = 1e9 + diffNanos;
    }
    return [diffSeconds, diffNanos];
  }
  return [seconds, nanos];
}, "hrtime"), { bigint: /* @__PURE__ */ __name(function bigint() {
  return BigInt(Date.now() * 1e6);
}, "bigint") });

// ../node_modules/unenv/dist/runtime/node/internal/process/process.mjs
import { EventEmitter } from "node:events";

// ../node_modules/unenv/dist/runtime/node/internal/tty/read-stream.mjs
import { Socket } from "node:net";
var ReadStream = class extends Socket {
  fd;
  constructor(fd) {
    super();
    this.fd = fd;
  }
  isRaw = false;
  setRawMode(mode) {
    this.isRaw = mode;
    return this;
  }
  isTTY = false;
};
__name(ReadStream, "ReadStream");

// ../node_modules/unenv/dist/runtime/node/internal/tty/write-stream.mjs
import { Socket as Socket2 } from "node:net";
var WriteStream = class extends Socket2 {
  fd;
  constructor(fd) {
    super();
    this.fd = fd;
  }
  clearLine(dir3, callback) {
    callback && callback();
    return false;
  }
  clearScreenDown(callback) {
    callback && callback();
    return false;
  }
  cursorTo(x, y, callback) {
    callback && typeof callback === "function" && callback();
    return false;
  }
  moveCursor(dx, dy, callback) {
    callback && callback();
    return false;
  }
  getColorDepth(env2) {
    return 1;
  }
  hasColors(count3, env2) {
    return false;
  }
  getWindowSize() {
    return [this.columns, this.rows];
  }
  columns = 80;
  rows = 24;
  isTTY = false;
};
__name(WriteStream, "WriteStream");

// ../node_modules/unenv/dist/runtime/node/internal/process/process.mjs
var Process = class extends EventEmitter {
  env;
  hrtime;
  nextTick;
  constructor(impl) {
    super();
    this.env = impl.env;
    this.hrtime = impl.hrtime;
    this.nextTick = impl.nextTick;
    for (const prop of [...Object.getOwnPropertyNames(Process.prototype), ...Object.getOwnPropertyNames(EventEmitter.prototype)]) {
      const value = this[prop];
      if (typeof value === "function") {
        this[prop] = value.bind(this);
      }
    }
  }
  emitWarning(warning, type, code) {
    console.warn(`${code ? `[${code}] ` : ""}${type ? `${type}: ` : ""}${warning}`);
  }
  emit(...args) {
    return super.emit(...args);
  }
  listeners(eventName) {
    return super.listeners(eventName);
  }
  #stdin;
  #stdout;
  #stderr;
  get stdin() {
    return this.#stdin ??= new ReadStream(0);
  }
  get stdout() {
    return this.#stdout ??= new WriteStream(1);
  }
  get stderr() {
    return this.#stderr ??= new WriteStream(2);
  }
  #cwd = "/";
  chdir(cwd2) {
    this.#cwd = cwd2;
  }
  cwd() {
    return this.#cwd;
  }
  arch = "";
  platform = "";
  argv = [];
  argv0 = "";
  execArgv = [];
  execPath = "";
  title = "";
  pid = 200;
  ppid = 100;
  get version() {
    return "";
  }
  get versions() {
    return {};
  }
  get allowedNodeEnvironmentFlags() {
    return /* @__PURE__ */ new Set();
  }
  get sourceMapsEnabled() {
    return false;
  }
  get debugPort() {
    return 0;
  }
  get throwDeprecation() {
    return false;
  }
  get traceDeprecation() {
    return false;
  }
  get features() {
    return {};
  }
  get release() {
    return {};
  }
  get connected() {
    return false;
  }
  get config() {
    return {};
  }
  get moduleLoadList() {
    return [];
  }
  constrainedMemory() {
    return 0;
  }
  availableMemory() {
    return 0;
  }
  uptime() {
    return 0;
  }
  resourceUsage() {
    return {};
  }
  ref() {
  }
  unref() {
  }
  umask() {
    throw createNotImplementedError("process.umask");
  }
  getBuiltinModule() {
    return void 0;
  }
  getActiveResourcesInfo() {
    throw createNotImplementedError("process.getActiveResourcesInfo");
  }
  exit() {
    throw createNotImplementedError("process.exit");
  }
  reallyExit() {
    throw createNotImplementedError("process.reallyExit");
  }
  kill() {
    throw createNotImplementedError("process.kill");
  }
  abort() {
    throw createNotImplementedError("process.abort");
  }
  dlopen() {
    throw createNotImplementedError("process.dlopen");
  }
  setSourceMapsEnabled() {
    throw createNotImplementedError("process.setSourceMapsEnabled");
  }
  loadEnvFile() {
    throw createNotImplementedError("process.loadEnvFile");
  }
  disconnect() {
    throw createNotImplementedError("process.disconnect");
  }
  cpuUsage() {
    throw createNotImplementedError("process.cpuUsage");
  }
  setUncaughtExceptionCaptureCallback() {
    throw createNotImplementedError("process.setUncaughtExceptionCaptureCallback");
  }
  hasUncaughtExceptionCaptureCallback() {
    throw createNotImplementedError("process.hasUncaughtExceptionCaptureCallback");
  }
  initgroups() {
    throw createNotImplementedError("process.initgroups");
  }
  openStdin() {
    throw createNotImplementedError("process.openStdin");
  }
  assert() {
    throw createNotImplementedError("process.assert");
  }
  binding() {
    throw createNotImplementedError("process.binding");
  }
  permission = { has: /* @__PURE__ */ notImplemented("process.permission.has") };
  report = {
    directory: "",
    filename: "",
    signal: "SIGUSR2",
    compact: false,
    reportOnFatalError: false,
    reportOnSignal: false,
    reportOnUncaughtException: false,
    getReport: /* @__PURE__ */ notImplemented("process.report.getReport"),
    writeReport: /* @__PURE__ */ notImplemented("process.report.writeReport")
  };
  finalization = {
    register: /* @__PURE__ */ notImplemented("process.finalization.register"),
    unregister: /* @__PURE__ */ notImplemented("process.finalization.unregister"),
    registerBeforeExit: /* @__PURE__ */ notImplemented("process.finalization.registerBeforeExit")
  };
  memoryUsage = Object.assign(() => ({
    arrayBuffers: 0,
    rss: 0,
    external: 0,
    heapTotal: 0,
    heapUsed: 0
  }), { rss: () => 0 });
  mainModule = void 0;
  domain = void 0;
  send = void 0;
  exitCode = void 0;
  channel = void 0;
  getegid = void 0;
  geteuid = void 0;
  getgid = void 0;
  getgroups = void 0;
  getuid = void 0;
  setegid = void 0;
  seteuid = void 0;
  setgid = void 0;
  setgroups = void 0;
  setuid = void 0;
  _events = void 0;
  _eventsCount = void 0;
  _exiting = void 0;
  _maxListeners = void 0;
  _debugEnd = void 0;
  _debugProcess = void 0;
  _fatalException = void 0;
  _getActiveHandles = void 0;
  _getActiveRequests = void 0;
  _kill = void 0;
  _preload_modules = void 0;
  _rawDebug = void 0;
  _startProfilerIdleNotifier = void 0;
  _stopProfilerIdleNotifier = void 0;
  _tickCallback = void 0;
  _disconnect = void 0;
  _handleQueue = void 0;
  _pendingMessage = void 0;
  _channel = void 0;
  _send = void 0;
  _linkedBinding = void 0;
};
__name(Process, "Process");

// ../node_modules/@cloudflare/unenv-preset/dist/runtime/node/process.mjs
var globalProcess = globalThis["process"];
var getBuiltinModule = globalProcess.getBuiltinModule;
var { exit, platform, nextTick } = getBuiltinModule(
  "node:process"
);
var unenvProcess = new Process({
  env: globalProcess.env,
  hrtime,
  nextTick
});
var {
  abort,
  addListener,
  allowedNodeEnvironmentFlags,
  hasUncaughtExceptionCaptureCallback,
  setUncaughtExceptionCaptureCallback,
  loadEnvFile,
  sourceMapsEnabled,
  arch,
  argv,
  argv0,
  chdir,
  config,
  connected,
  constrainedMemory,
  availableMemory,
  cpuUsage,
  cwd,
  debugPort,
  dlopen,
  disconnect,
  emit,
  emitWarning,
  env,
  eventNames,
  execArgv,
  execPath,
  finalization,
  features,
  getActiveResourcesInfo,
  getMaxListeners,
  hrtime: hrtime3,
  kill,
  listeners,
  listenerCount,
  memoryUsage,
  on,
  off,
  once,
  pid,
  ppid,
  prependListener,
  prependOnceListener,
  rawListeners,
  release,
  removeAllListeners,
  removeListener,
  report,
  resourceUsage,
  setMaxListeners,
  setSourceMapsEnabled,
  stderr,
  stdin,
  stdout,
  title,
  throwDeprecation,
  traceDeprecation,
  umask,
  uptime,
  version,
  versions,
  domain,
  initgroups,
  moduleLoadList,
  reallyExit,
  openStdin,
  assert: assert2,
  binding,
  send,
  exitCode,
  channel,
  getegid,
  geteuid,
  getgid,
  getgroups,
  getuid,
  setegid,
  seteuid,
  setgid,
  setgroups,
  setuid,
  permission,
  mainModule,
  _events,
  _eventsCount,
  _exiting,
  _maxListeners,
  _debugEnd,
  _debugProcess,
  _fatalException,
  _getActiveHandles,
  _getActiveRequests,
  _kill,
  _preload_modules,
  _rawDebug,
  _startProfilerIdleNotifier,
  _stopProfilerIdleNotifier,
  _tickCallback,
  _disconnect,
  _handleQueue,
  _pendingMessage,
  _channel,
  _send,
  _linkedBinding
} = unenvProcess;
var _process = {
  abort,
  addListener,
  allowedNodeEnvironmentFlags,
  hasUncaughtExceptionCaptureCallback,
  setUncaughtExceptionCaptureCallback,
  loadEnvFile,
  sourceMapsEnabled,
  arch,
  argv,
  argv0,
  chdir,
  config,
  connected,
  constrainedMemory,
  availableMemory,
  cpuUsage,
  cwd,
  debugPort,
  dlopen,
  disconnect,
  emit,
  emitWarning,
  env,
  eventNames,
  execArgv,
  execPath,
  exit,
  finalization,
  features,
  getBuiltinModule,
  getActiveResourcesInfo,
  getMaxListeners,
  hrtime: hrtime3,
  kill,
  listeners,
  listenerCount,
  memoryUsage,
  nextTick,
  on,
  off,
  once,
  pid,
  platform,
  ppid,
  prependListener,
  prependOnceListener,
  rawListeners,
  release,
  removeAllListeners,
  removeListener,
  report,
  resourceUsage,
  setMaxListeners,
  setSourceMapsEnabled,
  stderr,
  stdin,
  stdout,
  title,
  throwDeprecation,
  traceDeprecation,
  umask,
  uptime,
  version,
  versions,
  // @ts-expect-error old API
  domain,
  initgroups,
  moduleLoadList,
  reallyExit,
  openStdin,
  assert: assert2,
  binding,
  send,
  exitCode,
  channel,
  getegid,
  geteuid,
  getgid,
  getgroups,
  getuid,
  setegid,
  seteuid,
  setgid,
  setgroups,
  setuid,
  permission,
  mainModule,
  _events,
  _eventsCount,
  _exiting,
  _maxListeners,
  _debugEnd,
  _debugProcess,
  _fatalException,
  _getActiveHandles,
  _getActiveRequests,
  _kill,
  _preload_modules,
  _rawDebug,
  _startProfilerIdleNotifier,
  _stopProfilerIdleNotifier,
  _tickCallback,
  _disconnect,
  _handleQueue,
  _pendingMessage,
  _channel,
  _send,
  _linkedBinding
};
var process_default = _process;

// ../node_modules/wrangler/_virtual_unenv_global_polyfill-@cloudflare-unenv-preset-node-process
globalThis.process = process_default;

// ../shared/supabase.ts
async function supabaseRequest(env2, path, method, body) {
  const isUpsert = path.includes("on_conflict=");
  const headers = {
    apikey: env2.SUPABASE_SERVICE_KEY,
    Authorization: `Bearer ${env2.SUPABASE_SERVICE_KEY}`,
    "Content-Type": "application/json"
  };
  if (method === "POST") {
    headers["Prefer"] = isUpsert ? "return=representation,resolution=merge-duplicates" : "return=representation";
  } else if (method === "PATCH") {
    headers["Prefer"] = "return=representation";
  }
  const tableName = path.split("?")[0];
  console.log(`[Supabase] ${method} ${tableName}`);
  const response = await fetch(`${env2.SUPABASE_URL}/rest/v1/${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : void 0
  });
  if (!response.ok) {
    const error3 = await response.text();
    console.error(`[Supabase] Error: ${error3}`);
    throw new Error(`Supabase error (${response.status}): ${error3}`);
  }
  if (method === "GET" || method === "POST" || method === "PATCH") {
    const json = await response.json();
    console.log(
      `[Supabase] Success: ${Array.isArray(json) ? json.length : 1} record(s)`
    );
    return json;
  }
  return null;
}
__name(supabaseRequest, "supabaseRequest");
async function getJob(env2, firefliesId) {
  const result = await supabaseRequest(
    env2,
    `fireflies_ingestion_jobs?fireflies_id=eq.${encodeURIComponent(firefliesId)}&select=id,stage,metadata_id`,
    "GET"
  );
  return result && result.length > 0 ? result[0] : null;
}
__name(getJob, "getJob");
async function updateJobStage(env2, firefliesId, stage, metadataId, errorMessage) {
  const existing = await getJob(env2, firefliesId);
  const updateData = {
    stage,
    last_attempt_at: (/* @__PURE__ */ new Date()).toISOString()
  };
  if (metadataId) {
    updateData.metadata_id = metadataId;
  }
  if (errorMessage) {
    updateData.error_message = errorMessage;
  }
  if (existing) {
    updateData.attempt_count = existing.attempt_count + 1 || 1;
    await supabaseRequest(
      env2,
      `fireflies_ingestion_jobs?id=eq.${existing.id}`,
      "PATCH",
      updateData
    );
  } else {
    await supabaseRequest(env2, "fireflies_ingestion_jobs", "POST", {
      fireflies_id: firefliesId,
      ...updateData,
      attempt_count: 1
    });
  }
}
__name(updateJobStage, "updateJobStage");
async function getMetadataById(env2, metadataId) {
  const result = await supabaseRequest(
    env2,
    `document_metadata?id=eq.${metadataId}&select=*`,
    "GET"
  );
  return result && result.length > 0 ? result[0] : null;
}
__name(getMetadataById, "getMetadataById");
async function updateMetadataStatus(env2, metadataId, status) {
  await supabaseRequest(env2, `document_metadata?id=eq.${metadataId}`, "PATCH", {
    status,
    updated_at: (/* @__PURE__ */ new Date()).toISOString()
  });
}
__name(updateMetadataStatus, "updateMetadataStatus");
async function getSegmentsByMetadataId(env2, metadataId) {
  return await supabaseRequest(
    env2,
    `meeting_segments?metadata_id=eq.${metadataId}&select=*&order=segment_index`,
    "GET"
  );
}
__name(getSegmentsByMetadataId, "getSegmentsByMetadataId");

// ../shared/openai.ts
async function batchEmbed(env2, texts, model = "text-embedding-3-small") {
  if (texts.length === 0)
    return [];
  const truncatedTexts = texts.map((t) => t.slice(0, 8e3));
  console.log(`[OpenAI] Embedding ${texts.length} texts with ${model}`);
  const response = await fetch("https://api.openai.com/v1/embeddings", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env2.OPENAI_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model,
      input: truncatedTexts
    })
  });
  if (!response.ok) {
    const error3 = await response.text();
    throw new Error(`OpenAI embedding error: ${response.status} - ${error3}`);
  }
  const data = await response.json();
  console.log(`[OpenAI] Generated ${data.data.length} embeddings`);
  return data.data.map((d) => d.embedding);
}
__name(batchEmbed, "batchEmbed");
async function callLLM(env2, prompt, options = {}) {
  const {
    model = "gpt-4o-mini",
    temperature = 0.3,
    jsonMode = false,
    maxTokens
  } = options;
  console.log(`[OpenAI] Calling ${model} (json=${jsonMode})`);
  const body = {
    model,
    messages: [{ role: "user", content: prompt }],
    temperature
  };
  if (jsonMode) {
    body.response_format = { type: "json_object" };
  }
  if (maxTokens) {
    body.max_tokens = maxTokens;
  }
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env2.OPENAI_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });
  if (!response.ok) {
    const error3 = await response.text();
    throw new Error(`OpenAI chat error: ${response.status} - ${error3}`);
  }
  const data = await response.json();
  return data.choices[0].message.content;
}
__name(callLLM, "callLLM");
async function extractStructuredData(env2, title2, date, participants, summary, rawDecisions, rawRisks, rawTasks) {
  const prompt = `Analyze and normalize these meeting extractions. Deduplicate, add context, and identify opportunities.

Meeting: ${title2}
Date: ${date || "Unknown"}
Participants: ${participants.join(", ")}

Raw Decisions: ${JSON.stringify(rawDecisions)}
Raw Risks: ${JSON.stringify(rawRisks)}
Raw Tasks: ${JSON.stringify(rawTasks)}

Meeting Summary: ${summary.slice(0, 2e3)}

Return JSON with normalized, deduplicated entries:
{
  "decisions": [
    {"description": "Clear description", "rationale": "Why decided", "owner": "Person name or null"}
  ],
  "risks": [
    {"description": "Risk description", "category": "schedule|budget|resource|technical|external", "likelihood": "low|medium|high", "impact": "low|medium|high", "owner": "Person or null"}
  ],
  "tasks": [
    {"description": "Task description", "assignee": "Person name or null", "dueDate": "YYYY-MM-DD or null", "priority": "low|medium|high|urgent"}
  ],
  "opportunities": [
    {"description": "Opportunity description", "type": "efficiency|revenue|relationship|innovation", "owner": "Person or null"}
  ]
}

Guidelines:
- Deduplicate similar items
- Infer owners from context when possible
- Convert vague items to specific actionable descriptions
- Identify implied opportunities from discussion`;
  const response = await callLLM(env2, prompt, { jsonMode: true });
  return JSON.parse(response);
}
__name(extractStructuredData, "extractStructuredData");

// index.ts
var extractor_default = {
  async fetch(request, env2) {
    const url = new URL(request.url);
    if (request.method === "POST" && url.pathname === "/extract") {
      return handleExtract(request, env2);
    }
    if (request.method === "POST" && url.pathname === "/extract-pending") {
      return handleExtractPending(env2);
    }
    if (request.method === "GET" && url.pathname === "/health") {
      return Response.json({ status: "ok", worker: "extractor" });
    }
    return Response.json({
      worker: "fireflies-extractor",
      endpoints: [
        "POST /extract - Extract from meeting {metadataId} or {firefliesId}",
        "POST /extract-pending - Extract from all pending meetings",
        "GET /health - Health check"
      ]
    });
  }
};
async function handleExtract(request, env2) {
  try {
    const body = await request.json();
    if (!body.metadataId && !body.firefliesId) {
      return Response.json(
        { error: "metadataId or firefliesId required" },
        { status: 400 }
      );
    }
    let metadataId = body.metadataId;
    let firefliesId = body.firefliesId;
    if (!metadataId && firefliesId) {
      const job = await getJob(env2, firefliesId);
      if (!job || !job.metadata_id) {
        return Response.json(
          { error: "Job not found or no metadata_id" },
          { status: 404 }
        );
      }
      metadataId = job.metadata_id;
    }
    const result = await extractFromMeeting(env2, metadataId);
    return Response.json({
      success: true,
      ...result
    });
  } catch (err) {
    console.error("[Extract] Error:", err);
    return Response.json({ error: String(err) }, { status: 500 });
  }
}
__name(handleExtract, "handleExtract");
async function handleExtractPending(env2) {
  try {
    const jobs = await supabaseRequest(
      env2,
      "fireflies_ingestion_jobs?stage=eq.embedded&select=fireflies_id,metadata_id&limit=10",
      "GET"
    );
    if (!jobs || jobs.length === 0) {
      return Response.json({ message: "No pending jobs", processed: 0 });
    }
    console.log(`[Extract] Found ${jobs.length} pending jobs`);
    const results = [];
    for (const job of jobs) {
      if (!job.metadata_id)
        continue;
      try {
        const result = await extractFromMeeting(env2, job.metadata_id);
        results.push({ firefliesId: job.fireflies_id, success: true, ...result });
      } catch (err) {
        console.error(`[Extract] Error processing ${job.fireflies_id}:`, err);
        await updateJobStage(env2, job.fireflies_id, "error", void 0, String(err));
        results.push({ firefliesId: job.fireflies_id, success: false, error: String(err) });
      }
    }
    return Response.json({
      processed: results.length,
      results
    });
  } catch (err) {
    console.error("[ExtractPending] Error:", err);
    return Response.json({ error: String(err) }, { status: 500 });
  }
}
__name(handleExtractPending, "handleExtractPending");
async function extractFromMeeting(env2, metadataId) {
  const metadata = await getMetadataById(env2, metadataId);
  if (!metadata) {
    throw new Error(`Metadata not found: ${metadataId}`);
  }
  const firefliesId = metadata.fireflies_id;
  const title2 = metadata.title;
  const meetingSummary = metadata.meeting_summary || "";
  const startedAt = metadata.started_at;
  const participantsArray = metadata.participants_array || [];
  console.log(`[Extract] Processing: ${title2} (${firefliesId})`);
  const segmentRows = await getSegmentsByMetadataId(env2, metadataId);
  const rawDecisions = [];
  const rawRisks = [];
  const rawTasks = [];
  for (const row of segmentRows) {
    const decisions = row.decisions;
    const risks = row.risks;
    const tasks = row.tasks;
    if (decisions)
      rawDecisions.push(...decisions);
    if (risks)
      rawRisks.push(...risks);
    if (tasks)
      rawTasks.push(...tasks);
  }
  const actionItems = metadata.action_items;
  if (actionItems) {
    rawTasks.push(
      ...actionItems.split("\n").filter((t) => t.trim())
    );
  }
  console.log(
    `[Extract] Raw items: ${rawDecisions.length} decisions, ${rawRisks.length} risks, ${rawTasks.length} tasks`
  );
  const structured = await extractStructuredData(
    env2,
    title2,
    startedAt,
    participantsArray,
    meetingSummary,
    rawDecisions,
    rawRisks,
    rawTasks
  );
  console.log(
    `[Extract] Structured: ${structured.decisions.length} decisions, ${structured.risks.length} risks, ${structured.tasks.length} tasks, ${structured.opportunities.length} opportunities`
  );
  const allDescriptions = [
    ...structured.decisions.map((d) => d.description),
    ...structured.risks.map((r) => r.description),
    ...structured.tasks.map((t) => t.description),
    ...structured.opportunities.map((o) => o.description)
  ];
  let embeddings = [];
  if (allDescriptions.length > 0) {
    embeddings = await batchEmbed(env2, allDescriptions);
  }
  let idx = 0;
  const embeddedStructured = {
    decisions: structured.decisions.map((d) => ({
      ...d,
      embedding: embeddings[idx++]
    })),
    risks: structured.risks.map((r) => ({
      ...r,
      embedding: embeddings[idx++]
    })),
    tasks: structured.tasks.map((t) => ({
      ...t,
      embedding: embeddings[idx++]
    })),
    opportunities: structured.opportunities.map((o) => ({
      ...o,
      embedding: embeddings[idx++]
    }))
  };
  for (const decision of embeddedStructured.decisions) {
    await upsertDecision(env2, decision, metadataId);
  }
  for (const risk of embeddedStructured.risks) {
    await upsertRisk(env2, risk, metadataId);
  }
  for (const task of embeddedStructured.tasks) {
    await upsertTask(env2, task, metadataId);
  }
  for (const opportunity of embeddedStructured.opportunities) {
    await upsertOpportunity(env2, opportunity, metadataId);
  }
  await updateJobStage(env2, firefliesId, "done");
  await updateMetadataStatus(env2, metadataId, "complete");
  return {
    metadataId,
    firefliesId,
    decisions: embeddedStructured.decisions.length,
    risks: embeddedStructured.risks.length,
    tasks: embeddedStructured.tasks.length,
    opportunities: embeddedStructured.opportunities.length
  };
}
__name(extractFromMeeting, "extractFromMeeting");
async function upsertDecision(env2, decision, metadataId) {
  await supabaseRequest(
    env2,
    "decisions?on_conflict=metadata_id,description",
    "POST",
    {
      metadata_id: metadataId,
      description: decision.description,
      rationale: decision.rationale,
      owner_name: decision.owner,
      embedding: decision.embedding,
      status: "active"
    }
  );
}
__name(upsertDecision, "upsertDecision");
async function upsertRisk(env2, risk, metadataId) {
  await supabaseRequest(
    env2,
    "risks?on_conflict=metadata_id,description",
    "POST",
    {
      metadata_id: metadataId,
      description: risk.description,
      category: risk.category,
      likelihood: risk.likelihood,
      impact: risk.impact,
      owner_name: risk.owner,
      embedding: risk.embedding,
      status: "open"
    }
  );
}
__name(upsertRisk, "upsertRisk");
async function upsertTask(env2, task, metadataId) {
  await supabaseRequest(
    env2,
    "tasks?on_conflict=metadata_id,description",
    "POST",
    {
      metadata_id: metadataId,
      description: task.description,
      assignee_name: task.assignee,
      due_date: task.dueDate,
      priority: task.priority,
      embedding: task.embedding,
      status: "open",
      source_system: "fireflies"
    }
  );
}
__name(upsertTask, "upsertTask");
async function upsertOpportunity(env2, opportunity, metadataId) {
  await supabaseRequest(
    env2,
    "opportunities?on_conflict=metadata_id,description",
    "POST",
    {
      metadata_id: metadataId,
      description: opportunity.description,
      type: opportunity.type,
      owner_name: opportunity.owner,
      embedding: opportunity.embedding,
      status: "open"
    }
  );
}
__name(upsertOpportunity, "upsertOpportunity");

// ../node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
var drainBody = /* @__PURE__ */ __name(async (request, env2, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env2);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;

// ../node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
function reduceError(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError(e.cause)
  };
}
__name(reduceError, "reduceError");
var jsonError = /* @__PURE__ */ __name(async (request, env2, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env2);
  } catch (e) {
    const error3 = reduceError(e);
    return Response.json(error3, {
      status: 500,
      headers: { "MF-Experimental-Error-Stack": "true" }
    });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default = jsonError;

// .wrangler/tmp/bundle-sX1Lat/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = extractor_default;

// ../node_modules/wrangler/templates/middleware/common.ts
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env2, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env2, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env2, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env2, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");

// .wrangler/tmp/bundle-sX1Lat/middleware-loader.entry.ts
var __Facade_ScheduledController__ = class {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof __Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
__name(__Facade_ScheduledController__, "__Facade_ScheduledController__");
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env2, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env2, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env2, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env2, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env2, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = (request, env2, ctx) => {
      this.env = env2;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    };
    #dispatcher = (type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    };
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;
export {
  __INTERNAL_WRANGLER_MIDDLEWARE__,
  middleware_loader_entry_default as default
};
//# sourceMappingURL=index.js.map
