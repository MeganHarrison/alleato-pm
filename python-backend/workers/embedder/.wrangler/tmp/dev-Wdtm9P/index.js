var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};

// .wrangler/tmp/bundle-afKHcE/strip-cf-connecting-ip-header.js
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

// ../shared/parser.ts
function hashContent(text) {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16);
}
__name(hashContent, "hashContent");
function parseFirefliesMarkdown(content) {
  const lines = content.split("\n");
  const firefliesId = extractFirefliesId(content);
  const title2 = extractTitle(lines);
  const startedAt = extractDate(lines);
  const participants = extractParticipants(lines, content);
  const firefliesSummary = extractSummary(content);
  const firefliesActions = extractActions(content);
  const transcriptLines = extractTranscript(lines);
  const firefliesLink = extractMetadataField(content, "Fireflies Link") || extractFirefliesLinkFromUrl(content);
  const audioUrl = extractMarkdownLink(content, "Audio Recording") || extractMetadataField(content, "Audio Recording") || extractMetadataField(content, "Audio");
  const videoUrl = extractMarkdownLink(content, "Video Recording") || extractMetadataField(content, "Video Recording") || extractMetadataField(content, "Video");
  const durationMinutes = extractDurationMinutes(content);
  const keywords = extractKeywords(content);
  const bulletPoints = extractBulletPoints(content);
  return {
    firefliesId,
    title: title2,
    startedAt,
    endedAt: null,
    participants,
    transcriptLines,
    rawContent: content,
    firefliesSummary,
    firefliesActions,
    firefliesLink,
    durationMinutes,
    audioUrl,
    videoUrl,
    keywords,
    bulletPoints
  };
}
__name(parseFirefliesMarkdown, "parseFirefliesMarkdown");
function extractMetadataField(content, fieldName) {
  const regex = new RegExp(`\\*\\*${fieldName}:\\*\\*\\s*(.+)`, "i");
  const match = content.match(regex);
  return match ? match[1].trim() : void 0;
}
__name(extractMetadataField, "extractMetadataField");
function extractDurationMinutes(content) {
  const match = content.match(/\*\*Duration:\*\*\s*(\d+)\s*minutes/i);
  return match ? parseInt(match[1], 10) : void 0;
}
__name(extractDurationMinutes, "extractDurationMinutes");
function extractFirefliesLinkFromUrl(content) {
  const match = content.match(/(https?:\/\/[^\s]*fireflies\.ai\/view\/[a-zA-Z0-9_-]+)/);
  return match ? match[1] : void 0;
}
__name(extractFirefliesLinkFromUrl, "extractFirefliesLinkFromUrl");
function extractMarkdownLink(content, linkText) {
  const regex = new RegExp(`\\[${linkText}\\]\\(([^\\s)]+)\\)`, "i");
  const match = content.match(regex);
  if (match)
    return match[1];
  const listRegex = new RegExp(`-\\s*\\[${linkText}\\]\\(([^\\s)]+)\\)`, "i");
  const listMatch = content.match(listRegex);
  return listMatch ? listMatch[1] : void 0;
}
__name(extractMarkdownLink, "extractMarkdownLink");
function extractKeywords(content) {
  const sectionMatch = content.match(/##\s*Keywords\s*\n+([^\n#]+)/i);
  if (sectionMatch) {
    return sectionMatch[1].split(/[,;]/).map((k) => k.trim()).filter((k) => k);
  }
  const fieldMatch = content.match(/\*\*Keywords:\*\*\s*(.+)/i);
  if (fieldMatch) {
    return fieldMatch[1].split(/[,;]/).map((k) => k.trim()).filter((k) => k);
  }
  return [];
}
__name(extractKeywords, "extractKeywords");
function extractBulletPoints(content) {
  const bullets = [];
  const sectionMatch = content.match(/##\s*Summary Bullets\s*\n([\s\S]*?)(?=\n##|$)/i);
  if (sectionMatch) {
    for (const line of sectionMatch[1].split("\n")) {
      const bulletMatch = line.match(/^[ðŸ\-\*•]\s*\*\*([^*]+)\*\*/);
      if (bulletMatch) {
        bullets.push(bulletMatch[1].trim());
      }
    }
    if (bullets.length > 0)
      return bullets;
  }
  const fieldMatch = content.match(/\*\*Summary Bullets:\*\*\s*\n([\s\S]*?)(?=\n\*\*|\n##|$)/i);
  if (fieldMatch) {
    for (const line of fieldMatch[1].split("\n")) {
      const bulletMatch = line.match(/^[-*]\s*(.+)/);
      if (bulletMatch) {
        bullets.push(bulletMatch[1].trim());
      }
    }
  }
  return bullets;
}
__name(extractBulletPoints, "extractBulletPoints");
function extractFirefliesId(content) {
  const idFieldMatch = content.match(/\*\*ID:\*\*\s*([a-zA-Z0-9_-]+)/);
  if (idFieldMatch)
    return idFieldMatch[1];
  const firefliesIdMatch = content.match(/\*\*Fireflies ID:\*\*\s*([a-zA-Z0-9_-]+)/);
  if (firefliesIdMatch)
    return firefliesIdMatch[1];
  const urlMatch = content.match(/fireflies\.ai\/view\/([a-zA-Z0-9_-]+)/);
  if (urlMatch)
    return urlMatch[1];
  return hashContent(content).slice(0, 16);
}
__name(extractFirefliesId, "extractFirefliesId");
function extractTitle(lines) {
  for (const line of lines.slice(0, 10)) {
    if (line.startsWith("# ")) {
      return line.slice(2).trim();
    }
  }
  return "Untitled Meeting";
}
__name(extractTitle, "extractTitle");
function extractDate(lines) {
  for (const line of lines.slice(0, 20)) {
    let match = line.match(/(\d{1,2}\/\d{1,2}\/\d{4})/);
    if (match) {
      const [m, d, y] = match[1].split("/");
      return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
    }
    match = line.match(/(\d{4}-\d{2}-\d{2})/);
    if (match)
      return match[1];
  }
  return null;
}
__name(extractDate, "extractDate");
function extractParticipants(lines, content) {
  const participants = /* @__PURE__ */ new Set();
  let inAttendees = false;
  for (const line of lines) {
    if (/attendees|participants/i.test(line)) {
      inAttendees = true;
      continue;
    }
    if (inAttendees) {
      if (line.startsWith("#") || line.startsWith("---")) {
        inAttendees = false;
        continue;
      }
      const match2 = line.match(/^[-*]\s*(.+)/);
      if (match2) {
        participants.add(match2[1].trim());
      }
    }
  }
  const speakerPattern = /\[\d{2}:\d{2}\]\s*\*\*([^*]+)\*\*:/g;
  let match;
  while ((match = speakerPattern.exec(content)) !== null) {
    participants.add(match[1].trim());
  }
  const boldSpeakerPattern = /^\*\*([^*]+)\*\*:/gm;
  while ((match = boldSpeakerPattern.exec(content)) !== null) {
    participants.add(match[1].trim());
  }
  return Array.from(participants);
}
__name(extractParticipants, "extractParticipants");
function extractSummary(content) {
  const match = content.match(/##\s*Summary\s*\n(.*?)(?=\n##|\Z)/is);
  return match ? match[1].trim() : "";
}
__name(extractSummary, "extractSummary");
function extractActions(content) {
  const actions = [];
  const match = content.match(/##\s*Action Items?\s*\n(.*?)(?=\n##|\Z)/is);
  if (match) {
    for (const line of match[1].split("\n")) {
      const actionMatch = line.match(/^[-*]\s*(.+)/);
      if (actionMatch) {
        actions.push({ text: actionMatch[1].trim() });
      }
    }
  }
  return actions;
}
__name(extractActions, "extractActions");
function extractTranscript(lines) {
  const transcript = [];
  const timestampPattern = /^\[(\d{2}:\d{2})\]\s*\*\*([^*]+)\*\*:\s*(.+)/;
  let currentSpeaker = "";
  let inTranscript = false;
  for (const line of lines) {
    if (line.toLowerCase().includes("## transcript")) {
      inTranscript = true;
      continue;
    }
    if (!inTranscript)
      continue;
    if (line.startsWith("##") && !line.toLowerCase().includes("transcript")) {
      break;
    }
    const trimmed = line.trim();
    if (!trimmed)
      continue;
    const timestampMatch = trimmed.match(timestampPattern);
    if (timestampMatch) {
      transcript.push({
        timestamp: timestampMatch[1],
        speaker: timestampMatch[2].trim(),
        text: timestampMatch[3].trim(),
        index: transcript.length
      });
      continue;
    }
    const speakerMatch = trimmed.match(/^\*\*([^*]+)\*\*:?\s*(.*)/);
    if (speakerMatch) {
      currentSpeaker = speakerMatch[1].trim();
      const text = speakerMatch[2].trim();
      if (text) {
        transcript.push({
          timestamp: "",
          speaker: currentSpeaker,
          text,
          index: transcript.length
        });
      }
      continue;
    }
    if (currentSpeaker && trimmed) {
      transcript.push({
        timestamp: "",
        speaker: currentSpeaker,
        text: trimmed,
        index: transcript.length
      });
    }
  }
  return transcript;
}
__name(extractTranscript, "extractTranscript");

// ../shared/chunker.ts
var CHUNK_TARGET_CHARS = 3e3;
var CHUNK_OVERLAP_CHARS = 500;
function chunkSegment(segment, allLines) {
  const segmentLines = allLines.filter(
    (l) => l.index >= segment.startIndex && l.index <= segment.endIndex
  );
  if (segmentLines.length === 0)
    return [];
  const fullText = segmentLines.map((l) => `${l.speaker}: ${l.text}`).join("\n");
  const sentences = splitSentences(fullText);
  const chunks = [];
  let currentChunk = [];
  let currentLength = 0;
  let chunkIndex = 0;
  for (const sentence of sentences) {
    const sentenceLen = sentence.length;
    if (currentLength + sentenceLen > CHUNK_TARGET_CHARS && currentChunk.length > 0) {
      const chunkText = currentChunk.join(" ");
      chunks.push({
        content: chunkText,
        chunkIndex: chunkIndex++,
        segmentIndex: segment.segmentIndex,
        docType: "chunk",
        contentHash: hashContent(chunkText)
      });
      const overlapSentences = [];
      let overlapLen = 0;
      for (let i = currentChunk.length - 1; i >= 0; i--) {
        if (overlapLen + currentChunk[i].length <= CHUNK_OVERLAP_CHARS) {
          overlapSentences.unshift(currentChunk[i]);
          overlapLen += currentChunk[i].length;
        } else {
          break;
        }
      }
      currentChunk = overlapSentences;
      currentLength = overlapLen;
    }
    currentChunk.push(sentence);
    currentLength += sentenceLen;
  }
  if (currentChunk.length > 0) {
    const chunkText = currentChunk.join(" ");
    chunks.push({
      content: chunkText,
      chunkIndex,
      segmentIndex: segment.segmentIndex,
      docType: "chunk",
      contentHash: hashContent(chunkText)
    });
  }
  return chunks;
}
__name(chunkSegment, "chunkSegment");
function splitSentences(text) {
  const pattern = /(?<=[.!?])\s+(?=[A-Z])/;
  return text.split(pattern).filter((s) => s.trim());
}
__name(splitSentences, "splitSentences");
function createMeetingChunks(segments, transcriptLines, meetingSummary) {
  const allChunks = [];
  for (const segment of segments) {
    const segmentChunks = chunkSegment(segment, transcriptLines);
    allChunks.push(...segmentChunks);
  }
  if (meetingSummary) {
    allChunks.push({
      content: meetingSummary,
      chunkIndex: 0,
      segmentIndex: -1,
      // -1 indicates meeting-level
      docType: "meeting_summary",
      contentHash: hashContent(meetingSummary)
    });
  }
  for (const segment of segments) {
    if (segment.summary) {
      allChunks.push({
        content: segment.summary,
        chunkIndex: 0,
        segmentIndex: segment.segmentIndex,
        docType: "segment_summary",
        contentHash: hashContent(segment.summary)
      });
    }
  }
  return allChunks;
}
__name(createMeetingChunks, "createMeetingChunks");

// index.ts
var embedder_default = {
  async fetch(request, env2) {
    const url = new URL(request.url);
    if (request.method === "POST" && url.pathname === "/embed") {
      return handleEmbed(request, env2);
    }
    if (request.method === "POST" && url.pathname === "/embed-pending") {
      return handleEmbedPending(env2);
    }
    if (request.method === "GET" && url.pathname === "/health") {
      return Response.json({ status: "ok", worker: "embedder" });
    }
    return Response.json({
      worker: "fireflies-embedder",
      endpoints: [
        "POST /embed - Embed meeting {metadataId} or {firefliesId}",
        "POST /embed-pending - Embed all pending meetings",
        "GET /health - Health check"
      ]
    });
  }
};
async function handleEmbed(request, env2) {
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
    const result = await embedMeeting(env2, metadataId);
    return Response.json({
      success: true,
      ...result
    });
  } catch (err) {
    console.error("[Embed] Error:", err);
    return Response.json({ error: String(err) }, { status: 500 });
  }
}
__name(handleEmbed, "handleEmbed");
async function handleEmbedPending(env2) {
  try {
    const jobs = await supabaseRequest(
      env2,
      "fireflies_ingestion_jobs?stage=eq.segmented&select=fireflies_id,metadata_id&limit=10",
      "GET"
    );
    if (!jobs || jobs.length === 0) {
      return Response.json({ message: "No pending jobs", processed: 0 });
    }
    console.log(`[Embed] Found ${jobs.length} pending jobs`);
    const results = [];
    for (const job of jobs) {
      if (!job.metadata_id)
        continue;
      try {
        const result = await embedMeeting(env2, job.metadata_id);
        results.push({ firefliesId: job.fireflies_id, success: true, ...result });
      } catch (err) {
        console.error(`[Embed] Error processing ${job.fireflies_id}:`, err);
        await updateJobStage(env2, job.fireflies_id, "error", void 0, String(err));
        results.push({ firefliesId: job.fireflies_id, success: false, error: String(err) });
      }
    }
    return Response.json({
      processed: results.length,
      results
    });
  } catch (err) {
    console.error("[EmbedPending] Error:", err);
    return Response.json({ error: String(err) }, { status: 500 });
  }
}
__name(handleEmbedPending, "handleEmbedPending");
async function embedMeeting(env2, metadataId) {
  const metadata = await getMetadataById(env2, metadataId);
  if (!metadata) {
    throw new Error(`Metadata not found: ${metadataId}`);
  }
  const firefliesId = metadata.fireflies_id;
  const content = metadata.content;
  const meetingSummary = metadata.overview || "";
  if (!content) {
    throw new Error(`No content in metadata: ${metadataId}`);
  }
  console.log(`[Embed] Processing: ${metadata.title} (${firefliesId})`);
  const parsed = parseFirefliesMarkdown(content);
  const segmentRows = await getSegmentsByMetadataId(env2, metadataId);
  if (!segmentRows || segmentRows.length === 0) {
    throw new Error(`No segments found for: ${metadataId}`);
  }
  const segments = segmentRows.map((row) => ({
    segmentIndex: row.segment_index,
    title: row.title,
    startIndex: row.start_index,
    endIndex: row.end_index,
    summary: row.summary,
    decisions: row.decisions || [],
    risks: row.risks || [],
    tasks: row.tasks || []
  }));
  console.log(`[Embed] Found ${segments.length} segments`);
  const allChunks = createMeetingChunks(
    segments,
    parsed.transcriptLines,
    meetingSummary
  );
  console.log(`[Embed] Created ${allChunks.length} chunks`);
  await updateJobStage(env2, firefliesId, "chunked");
  const chunkTexts = allChunks.map((c) => c.content);
  const chunkEmbeddings = await batchEmbed(env2, chunkTexts);
  for (let i = 0; i < allChunks.length; i++) {
    allChunks[i].embedding = chunkEmbeddings[i];
  }
  const segmentSummaries = segments.map((s) => s.summary || s.title);
  const segmentEmbeddings = await batchEmbed(env2, segmentSummaries);
  for (let i = 0; i < segments.length; i++) {
    segments[i].summaryEmbedding = segmentEmbeddings[i];
  }
  let meetingSummaryEmbedding = null;
  if (meetingSummary) {
    const [embedding] = await batchEmbed(env2, [meetingSummary]);
    meetingSummaryEmbedding = embedding;
  }
  const segmentIdMap = {};
  for (const row of segmentRows) {
    segmentIdMap[row.segment_index] = row.id;
  }
  for (const segment of segments) {
    if (segment.summaryEmbedding) {
      const segmentId = segmentIdMap[segment.segmentIndex];
      await supabaseRequest(
        env2,
        `meeting_segments?id=eq.${segmentId}`,
        "PATCH",
        { summary_embedding: segment.summaryEmbedding }
      );
    }
  }
  for (const chunk of allChunks) {
    const segmentId = chunk.segmentIndex >= 0 ? segmentIdMap[chunk.segmentIndex] : null;
    await upsertDocument(env2, chunk, metadataId, segmentId, {
      meetingDate: parsed.startedAt,
      participants: parsed.participants,
      projectId: metadata.project_id,
      clientId: metadata.client_id
    });
  }
  await supabaseRequest(env2, `document_metadata?id=eq.${metadataId}`, "PATCH", {
    status: "embedded"
  });
  await updateJobStage(env2, firefliesId, "embedded");
  return {
    metadataId,
    firefliesId,
    chunkCount: allChunks.length,
    segmentCount: segments.length
  };
}
__name(embedMeeting, "embedMeeting");
async function upsertDocument(env2, chunk, metadataId, segmentId, meta) {
  const data = {
    file_id: metadataId,
    // TEXT reference to document_metadata.id
    content: chunk.content,
    embedding: chunk.embedding,
    source: "fireflies",
    file_date: meta.meetingDate ? new Date(meta.meetingDate).toISOString() : null,
    project_id: meta.projectId || null,
    processing_status: "complete",
    metadata: {
      doc_type: chunk.docType,
      chunk_index: chunk.chunkIndex,
      segment_index: chunk.segmentIndex,
      segment_id: segmentId,
      content_hash: chunk.contentHash,
      participants: meta.participants
    }
  };
  const existingCheck = await supabaseRequest(
    env2,
    `documents?file_id=eq.${metadataId}&select=id,metadata&limit=100`,
    "GET"
  );
  const existingDoc = existingCheck.find(
    (d) => d.metadata?.content_hash === chunk.contentHash
  );
  if (existingDoc) {
    await supabaseRequest(env2, `documents?id=eq.${existingDoc.id}`, "PATCH", data);
  } else {
    await supabaseRequest(env2, "documents", "POST", data);
  }
}
__name(upsertDocument, "upsertDocument");

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

// .wrangler/tmp/bundle-afKHcE/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = embedder_default;

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

// .wrangler/tmp/bundle-afKHcE/middleware-loader.entry.ts
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
