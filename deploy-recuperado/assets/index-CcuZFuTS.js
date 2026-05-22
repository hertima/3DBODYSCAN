import { r as reactExports, W as jsxRuntimeExports, V as React } from "./server-C0e4gypg.js";
import { J as reactDomExports } from "./router-BDD3RgVy.js";
var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, {
      get: all[name],
      enumerable: true,
      configurable: true,
      set: (newValue) => all[name] = () => newValue
    });
};
if (typeof reactExports.createContext !== "function") {
  const err = [
    'Remotion requires React.createContext, but it is "undefined".',
    'If you are in a React Server Component, turn it into a client component by adding "use client" at the top of the file.',
    "",
    "Before:",
    '  import {useCurrentFrame} from "remotion";',
    "",
    "After:",
    '  "use client";',
    '  import {useCurrentFrame} from "remotion";'
  ];
  throw new Error(err.join(`
`));
}
var CanUseRemotionHooks = reactExports.createContext(false);
var CanUseRemotionHooksProvider = ({ children }) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(CanUseRemotionHooks.Provider, {
    value: true,
    children
  });
};
var CompositionRenderErrorContext = reactExports.createContext({
  setError: () => {
  },
  clearError: () => {
  }
});
class CompositionErrorBoundary extends React.Component {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error2) {
    this.props.onError(error2);
  }
  componentDidUpdate(_prevProps) {
    if (!this.state.hasError) {
      this.props.onClear();
    }
  }
  render() {
    if (this.state.hasError) {
      return null;
    }
    return this.props.children;
  }
}
var CompositionManager = reactExports.createContext({
  compositions: [],
  folders: [],
  currentCompositionMetadata: null,
  canvasContent: null
});
var CompositionSetters = reactExports.createContext({
  registerComposition: () => {
    return;
  },
  unregisterComposition: () => {
    return;
  },
  registerFolder: () => {
    return;
  },
  unregisterFolder: () => {
    return;
  },
  setCanvasContent: () => {
    return;
  },
  onlyRenderComposition: null
});
var NonceContext = reactExports.createContext({
  getNonce: () => 0
});
var fastRefreshNonce = 0;
try {
  if (typeof __webpack_module__ !== "undefined") {
    if (__webpack_module__.hot) {
      __webpack_module__.hot.addStatusHandler((status) => {
        if (status === "idle") {
          fastRefreshNonce++;
        }
      });
    }
  }
} catch {
}
var useNonce = () => {
  const context = reactExports.useContext(NonceContext);
  const nonce = context.getNonce();
  const nonceRef = reactExports.useRef(nonce);
  nonceRef.current = nonce;
  const history = reactExports.useRef([[fastRefreshNonce, nonce]]);
  const get = reactExports.useCallback(() => {
    if (fastRefreshNonce !== history.current[history.current.length - 1][0]) {
      history.current = [
        ...history.current,
        [fastRefreshNonce, nonceRef.current]
      ];
    }
    return history.current;
  }, [history]);
  return reactExports.useMemo(() => {
    return { get };
  }, [get]);
};
function truthy(value) {
  return Boolean(value);
}
var FolderContext = reactExports.createContext({
  folderName: null,
  parentName: null
});
function getNodeEnvString() {
  return ["NOD", "E_EN", "V"].join("");
}
var getEnvString = () => {
  return ["e", "nv"].join("");
};
var getRemotionEnvironment = () => {
  const isPlayer = typeof window !== "undefined" && window.remotion_isPlayer;
  const isRendering = typeof window !== "undefined" && typeof window.process !== "undefined" && typeof window.process.env !== "undefined" && (window.process[getEnvString()][getNodeEnvString()] === "test" || window.process[getEnvString()][getNodeEnvString()] === "production" && typeof window !== "undefined" && typeof window.remotion_puppeteerTimeout !== "undefined");
  const isStudio = typeof window !== "undefined" && window.remotion_isStudio;
  const isReadOnlyStudio = typeof window !== "undefined" && window.remotion_isReadOnlyStudio;
  return {
    isStudio,
    isRendering,
    isPlayer,
    isReadOnlyStudio,
    isClientSideRendering: false
  };
};
var DATE_TOKEN = "remotion-date:";
var FILE_TOKEN = "remotion-file:";
var serializeJSONWithSpecialTypes = ({
  data,
  indent,
  staticBase
}) => {
  let customDateUsed = false;
  let customFileUsed = false;
  let mapUsed = false;
  let setUsed = false;
  try {
    const serializedString = JSON.stringify(data, function(key, value) {
      const item = this[key];
      if (item instanceof Date) {
        customDateUsed = true;
        return `${DATE_TOKEN}${item.toISOString()}`;
      }
      if (item instanceof Map) {
        mapUsed = true;
        return value;
      }
      if (item instanceof Set) {
        setUsed = true;
        return value;
      }
      if (typeof item === "string" && staticBase !== null && item.startsWith(staticBase)) {
        customFileUsed = true;
        return `${FILE_TOKEN}${item.replace(staticBase + "/", "")}`;
      }
      return value;
    }, indent);
    return { serializedString, customDateUsed, customFileUsed, mapUsed, setUsed };
  } catch (err) {
    throw new Error("Could not serialize the passed input props to JSON: " + err.message);
  }
};
var deserializeJSONWithSpecialTypes = (data) => {
  return JSON.parse(data, (_, value) => {
    if (typeof value === "string" && value.startsWith(DATE_TOKEN)) {
      return new Date(value.replace(DATE_TOKEN, ""));
    }
    if (typeof value === "string" && value.startsWith(FILE_TOKEN)) {
      return `${window.remotion_staticBase}/${value.replace(FILE_TOKEN, "")}`;
    }
    return value;
  });
};
var serializeThenDeserialize = (props) => {
  return deserializeJSONWithSpecialTypes(serializeJSONWithSpecialTypes({
    data: props,
    indent: 2,
    staticBase: window.remotion_staticBase
  }).serializedString);
};
var serializeThenDeserializeInStudio = (props) => {
  if (getRemotionEnvironment().isStudio) {
    return serializeThenDeserialize(props);
  }
  return props;
};
var IsPlayerContext = reactExports.createContext(false);
var IsPlayerContextProvider = ({
  children
}) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(IsPlayerContext.Provider, {
    value: true,
    children
  });
};
var useIsPlayer = () => {
  return reactExports.useContext(IsPlayerContext);
};
var hasTailwindClassName = ({
  className: className2,
  classPrefix,
  type
}) => {
  if (!className2) {
    return false;
  }
  if (type === "exact") {
    const split = className2.split(" ");
    return classPrefix.some((token) => {
      return split.some((part) => {
        return part.trim() === token || part.trim().endsWith(`:${token}`) || part.trim().endsWith(`!${token}`);
      });
    });
  }
  return classPrefix.some((prefix) => {
    return className2.startsWith(prefix) || className2.includes(` ${prefix}`) || className2.includes(`!${prefix}`) || className2.includes(`:${prefix}`);
  });
};
var AbsoluteFillRefForwarding = (props, ref) => {
  const { style: style2, ...other } = props;
  const actualStyle = reactExports.useMemo(() => {
    return {
      position: "absolute",
      top: hasTailwindClassName({
        className: other.className,
        classPrefix: ["top-", "inset-"],
        type: "prefix"
      }) ? void 0 : 0,
      left: hasTailwindClassName({
        className: other.className,
        classPrefix: ["left-", "inset-"],
        type: "prefix"
      }) ? void 0 : 0,
      right: hasTailwindClassName({
        className: other.className,
        classPrefix: ["right-", "inset-"],
        type: "prefix"
      }) ? void 0 : 0,
      bottom: hasTailwindClassName({
        className: other.className,
        classPrefix: ["bottom-", "inset-"],
        type: "prefix"
      }) ? void 0 : 0,
      width: hasTailwindClassName({
        className: other.className,
        classPrefix: ["w-"],
        type: "prefix"
      }) ? void 0 : "100%",
      height: hasTailwindClassName({
        className: other.className,
        classPrefix: ["h-"],
        type: "prefix"
      }) ? void 0 : "100%",
      display: hasTailwindClassName({
        className: other.className,
        classPrefix: [
          "block",
          "inline-block",
          "inline",
          "flex",
          "inline-flex",
          "flow-root",
          "grid",
          "inline-grid",
          "contents",
          "list-item",
          "hidden"
        ],
        type: "exact"
      }) ? void 0 : "flex",
      flexDirection: hasTailwindClassName({
        className: other.className,
        classPrefix: [
          "flex-row",
          "flex-col",
          "flex-row-reverse",
          "flex-col-reverse"
        ],
        type: "exact"
      }) ? void 0 : "column",
      ...style2
    };
  }, [other.className, style2]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
    ref,
    style: actualStyle,
    ...other
  });
};
var AbsoluteFill = reactExports.forwardRef(AbsoluteFillRefForwarding);
var rotate = {
  transform: `rotate(90deg)`
};
var ICON_SIZE$1 = 40;
var label$1 = {
  color: "white",
  fontSize: 14,
  fontFamily: "sans-serif"
};
var container = {
  justifyContent: "center",
  alignItems: "center"
};
var Loading = () => {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AbsoluteFill, {
    style: container,
    id: "remotion-comp-loading",
    children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("style", {
        type: "text/css",
        children: `
				@keyframes anim {
					from {
						opacity: 0
					}
					to {
						opacity: 1
					}
				}
				#remotion-comp-loading {
					animation: anim 2s;
					animation-fill-mode: forwards;
				}
			`
      }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("svg", {
        width: ICON_SIZE$1,
        height: ICON_SIZE$1,
        viewBox: "-100 -100 400 400",
        style: rotate,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", {
          fill: "#555",
          stroke: "#555",
          strokeWidth: "100",
          strokeLinejoin: "round",
          d: "M 2 172 a 196 100 0 0 0 195 5 A 196 240 0 0 0 100 2.259 A 196 240 0 0 0 2 172 z"
        })
      }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", {
        style: label$1,
        children: [
          "Resolving ",
          "<Suspense>",
          "..."
        ]
      })
    ]
  });
};
var _portalNode = null;
var portalNode = () => {
  if (!_portalNode) {
    if (typeof document === "undefined") {
      throw new Error("Tried to call an API that only works in the browser from outside the browser");
    }
    _portalNode = document.createElement("div");
    _portalNode.style.position = "absolute";
    _portalNode.style.top = "0px";
    _portalNode.style.left = "0px";
    _portalNode.style.right = "0px";
    _portalNode.style.bottom = "0px";
    _portalNode.style.width = "100%";
    _portalNode.style.height = "100%";
    _portalNode.style.display = "flex";
    _portalNode.style.flexDirection = "column";
    const containerNode = document.createElement("div");
    containerNode.style.position = "fixed";
    containerNode.style.top = "-999999px";
    containerNode.appendChild(_portalNode);
    document.body.appendChild(containerNode);
  }
  return _portalNode;
};
var getKey = () => {
  return `remotion_inputPropsOverride` + window.location.origin;
};
var getInputPropsOverride = () => {
  if (typeof localStorage === "undefined")
    return null;
  const override = localStorage.getItem(getKey());
  if (!override)
    return null;
  return JSON.parse(override);
};
var setInputPropsOverride = (override) => {
  if (typeof localStorage === "undefined")
    return;
  if (override === null) {
    localStorage.removeItem(getKey());
    return;
  }
  localStorage.setItem(getKey(), JSON.stringify(override));
};
var didWarnSSRImport = false;
var warnOnceSSRImport = () => {
  if (didWarnSSRImport) {
    return;
  }
  didWarnSSRImport = true;
  console.warn("Called `getInputProps()` on the server. This function is not available server-side and has returned an empty object.");
  console.warn("To hide this warning, don't call this function on the server:");
  console.warn("  typeof window === 'undefined' ? {} : getInputProps()");
};
var getInputProps = () => {
  if (typeof window === "undefined") {
    warnOnceSSRImport();
    return {};
  }
  if (getRemotionEnvironment().isPlayer) {
    throw new Error("You cannot call `getInputProps()` from a <Player>. Instead, the props are available as React props from component that you passed as `component` prop.");
  }
  const override = getInputPropsOverride();
  if (override) {
    return override;
  }
  if (typeof window === "undefined" || typeof window.remotion_inputProps === "undefined") {
    throw new Error("Cannot call `getInputProps()` - window.remotion_inputProps is not set. This API is only available if you are in the Studio, or while you are rendering server-side.");
  }
  const param = window.remotion_inputProps;
  if (!param) {
    return {};
  }
  const parsed = deserializeJSONWithSpecialTypes(param);
  return parsed;
};
var EditorPropsContext = reactExports.createContext({
  props: {},
  updateProps: () => {
    throw new Error("Not implemented");
  }
});
var timeValueRef = React.createRef();
var EditorPropsProvider = ({ children }) => {
  const [props, setProps] = React.useState({});
  const updateProps = reactExports.useCallback(({
    defaultProps,
    id,
    newProps
  }) => {
    setProps((prev) => {
      return {
        ...prev,
        [id]: typeof newProps === "function" ? newProps(prev[id] ?? defaultProps) : newProps
      };
    });
  }, []);
  const ctx = reactExports.useMemo(() => {
    return { props, updateProps };
  }, [props, updateProps]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(EditorPropsContext.Provider, {
    value: ctx,
    children
  });
};
var RemotionEnvironmentContext = React.createContext(null);
var useRemotionEnvironment = () => {
  const context = reactExports.useContext(RemotionEnvironmentContext);
  const [env] = reactExports.useState(() => getRemotionEnvironment());
  return context ?? env;
};
function validateDimension$2(amount, nameOfProp, location) {
  if (typeof amount !== "number") {
    throw new Error(`The "${nameOfProp}" prop ${location} must be a number, but you passed a value of type ${typeof amount}`);
  }
  if (isNaN(amount)) {
    throw new TypeError(`The "${nameOfProp}" prop ${location} must not be NaN, but is NaN.`);
  }
  if (!Number.isFinite(amount)) {
    throw new TypeError(`The "${nameOfProp}" prop ${location} must be finite, but is ${amount}.`);
  }
  if (amount % 1 !== 0) {
    throw new TypeError(`The "${nameOfProp}" prop ${location} must be an integer, but is ${amount}.`);
  }
  if (amount <= 0) {
    throw new TypeError(`The "${nameOfProp}" prop ${location} must be positive, but got ${amount}.`);
  }
}
function validateDurationInFrames$2(durationInFrames, options) {
  const { allowFloats, component } = options;
  if (typeof durationInFrames === "undefined") {
    throw new Error(`The "durationInFrames" prop ${component} is missing.`);
  }
  if (typeof durationInFrames !== "number") {
    throw new Error(`The "durationInFrames" prop ${component} must be a number, but you passed a value of type ${typeof durationInFrames}`);
  }
  if (durationInFrames <= 0) {
    throw new TypeError(`The "durationInFrames" prop ${component} must be positive, but got ${durationInFrames}.`);
  }
  if (!allowFloats && durationInFrames % 1 !== 0) {
    throw new TypeError(`The "durationInFrames" prop ${component} must be an integer, but got ${durationInFrames}.`);
  }
  if (!Number.isFinite(durationInFrames)) {
    throw new TypeError(`The "durationInFrames" prop ${component} must be finite, but got ${durationInFrames}.`);
  }
}
function validateFps$2(fps, location, isGif) {
  if (typeof fps !== "number") {
    throw new Error(`"fps" must be a number, but you passed a value of type ${typeof fps} ${location}`);
  }
  if (!Number.isFinite(fps)) {
    throw new Error(`"fps" must be a finite, but you passed ${fps} ${location}`);
  }
  if (isNaN(fps)) {
    throw new Error(`"fps" must not be NaN, but got ${fps} ${location}`);
  }
  if (fps <= 0) {
    throw new TypeError(`"fps" must be positive, but got ${fps} ${location}`);
  }
}
var ResolveCompositionContext = reactExports.createContext(null);
var resolveCompositionsRef = reactExports.createRef();
var needsResolution = (composition) => {
  return Boolean(composition.calculateMetadata);
};
var useResolvedVideoConfig = (preferredCompositionId) => {
  const context = reactExports.useContext(ResolveCompositionContext);
  const { props: allEditorProps } = reactExports.useContext(EditorPropsContext);
  const { compositions, canvasContent, currentCompositionMetadata } = reactExports.useContext(CompositionManager);
  const currentComposition = canvasContent?.type === "composition" ? canvasContent.compositionId : null;
  const compositionId = preferredCompositionId ?? currentComposition;
  const composition = compositions.find((c2) => c2.id === compositionId);
  const selectedEditorProps = reactExports.useMemo(() => {
    return composition ? allEditorProps[composition.id] ?? {} : {};
  }, [allEditorProps, composition]);
  const env = useRemotionEnvironment();
  return reactExports.useMemo(() => {
    if (!composition) {
      return null;
    }
    if (currentCompositionMetadata) {
      return {
        type: "success",
        result: {
          ...currentCompositionMetadata,
          id: composition.id,
          defaultProps: composition.defaultProps ?? {}
        }
      };
    }
    if (!needsResolution(composition)) {
      validateDurationInFrames$2(composition.durationInFrames, {
        allowFloats: false,
        component: `in <Composition id="${composition.id}">`
      });
      validateFps$2(composition.fps, `in <Composition id="${composition.id}">`);
      validateDimension$2(composition.width, "width", `in <Composition id="${composition.id}">`);
      validateDimension$2(composition.height, "height", `in <Composition id="${composition.id}">`);
      return {
        type: "success",
        result: {
          width: composition.width,
          height: composition.height,
          fps: composition.fps,
          id: composition.id,
          durationInFrames: composition.durationInFrames,
          defaultProps: composition.defaultProps ?? {},
          props: {
            ...composition.defaultProps ?? {},
            ...selectedEditorProps ?? {},
            ...typeof window === "undefined" || env.isPlayer || !window.remotion_inputProps ? {} : getInputProps() ?? {}
          },
          defaultCodec: null,
          defaultOutName: null,
          defaultVideoImageFormat: null,
          defaultPixelFormat: null,
          defaultProResProfile: null,
          defaultSampleRate: null
        }
      };
    }
    if (!context) {
      return null;
    }
    if (!context[composition.id]) {
      return null;
    }
    return context[composition.id];
  }, [
    composition,
    context,
    currentCompositionMetadata,
    selectedEditorProps,
    env.isPlayer
  ]);
};
var getErrorStackWithMessage = (error2) => {
  const stack = error2.stack ?? "";
  return stack.startsWith("Error:") ? stack : `${error2.message}
${stack}`;
};
var isErrorLike = (err) => {
  if (err instanceof Error) {
    return true;
  }
  if (err === null) {
    return false;
  }
  if (typeof err !== "object") {
    return false;
  }
  if (!("stack" in err)) {
    return false;
  }
  if (typeof err.stack !== "string") {
    return false;
  }
  if (!("message" in err)) {
    return false;
  }
  if (typeof err.message !== "string") {
    return false;
  }
  return true;
};
function cancelRenderInternal(scope, err) {
  let error2;
  if (isErrorLike(err)) {
    error2 = err;
    if (!error2.stack) {
      error2.stack = new Error(error2.message).stack;
    }
  } else if (typeof err === "string") {
    error2 = Error(err);
  } else {
    error2 = Error("Rendering was cancelled");
  }
  if (scope) {
    scope.remotion_cancelledError = getErrorStackWithMessage(error2);
  }
  throw error2;
}
function cancelRender(err) {
  return cancelRenderInternal(typeof window !== "undefined" ? window : void 0, err);
}
var logLevels = ["trace", "verbose", "info", "warn", "error"];
var getNumberForLogLevel = (level) => {
  return logLevels.indexOf(level);
};
var isEqualOrBelowLogLevel = (currentLevel, level) => {
  return getNumberForLogLevel(currentLevel) <= getNumberForLogLevel(level);
};
var transformArgs = ({
  args,
  logLevel,
  tag
}) => {
  const arr = [...args];
  if (getRemotionEnvironment().isRendering && !getRemotionEnvironment().isClientSideRendering) {
    arr.unshift(/* @__PURE__ */ Symbol.for(`__remotion_level_${logLevel}`));
  }
  if (tag && getRemotionEnvironment().isRendering && !getRemotionEnvironment().isClientSideRendering) {
    arr.unshift(/* @__PURE__ */ Symbol.for(`__remotion_tag_${tag}`));
  }
  return arr;
};
var verbose = (options, ...args) => {
  if (isEqualOrBelowLogLevel(options.logLevel, "verbose")) {
    return console.debug(...transformArgs({ args, logLevel: "verbose", tag: options.tag }));
  }
};
var trace = (options, ...args) => {
  if (isEqualOrBelowLogLevel(options.logLevel, "trace")) {
    return console.debug(...transformArgs({ args, logLevel: "trace", tag: options.tag }));
  }
};
var info = (options, ...args) => {
  if (isEqualOrBelowLogLevel(options.logLevel, "info")) {
    return console.log(...transformArgs({ args, logLevel: "info", tag: options.tag }));
  }
};
var warn = (options, ...args) => {
  if (isEqualOrBelowLogLevel(options.logLevel, "warn")) {
    return console.warn(...transformArgs({ args, logLevel: "warn", tag: options.tag }));
  }
};
var error = (options, ...args) => {
  return console.error(...transformArgs({ args, logLevel: "error", tag: options.tag }));
};
var Log = {
  trace,
  verbose,
  info,
  warn,
  error
};
if (typeof window !== "undefined") {
  window.remotion_renderReady = false;
  if (!window.remotion_delayRenderTimeouts) {
    window.remotion_delayRenderTimeouts = {};
  }
  window.remotion_delayRenderHandles = [];
}
var DELAY_RENDER_CALLSTACK_TOKEN = "The delayRender was called:";
var DELAY_RENDER_RETRIES_LEFT = "Retries left: ";
var DELAY_RENDER_RETRY_TOKEN = "- Rendering the frame will be retried.";
var DELAY_RENDER_CLEAR_TOKEN = "handle was cleared after";
var defaultTimeout = 3e4;
var delayRenderInternal = ({
  scope,
  environment,
  label: label2,
  options
}) => {
  if (typeof label2 !== "string" && label2 !== null) {
    throw new Error("The label parameter of delayRender() must be a string or undefined, got: " + JSON.stringify(label2));
  }
  const handle = Math.random();
  scope.remotion_delayRenderHandles.push(handle);
  const called = Error().stack?.replace(/^Error/g, "") ?? "";
  if (environment.isRendering) {
    const timeoutToUse = (options?.timeoutInMilliseconds ?? scope.remotion_puppeteerTimeout ?? defaultTimeout) - 2e3;
    const retriesLeft = (options?.retries ?? 0) - (scope.remotion_attempt - 1);
    scope.remotion_delayRenderTimeouts[handle] = {
      label: label2 ?? null,
      startTime: Date.now(),
      timeout: setTimeout(() => {
        const message = [
          `A delayRender()`,
          label2 ? `"${label2}"` : null,
          `was called but not cleared after ${timeoutToUse}ms. See https://remotion.dev/docs/timeout for help.`,
          retriesLeft > 0 ? DELAY_RENDER_RETRIES_LEFT + retriesLeft : null,
          retriesLeft > 0 ? DELAY_RENDER_RETRY_TOKEN : null,
          DELAY_RENDER_CALLSTACK_TOKEN,
          called
        ].filter(truthy).join(" ");
        if (environment.isClientSideRendering) {
          scope.remotion_cancelledError = getErrorStackWithMessage(Error(message));
        } else {
          cancelRenderInternal(scope, Error(message));
        }
      }, timeoutToUse)
    };
  }
  scope.remotion_renderReady = false;
  return handle;
};
var delayRender = (label2, options) => {
  if (typeof window === "undefined") {
    return Math.random();
  }
  return delayRenderInternal({
    scope: window,
    environment: getRemotionEnvironment(),
    label: label2 ?? null,
    options: {}
  });
};
var continueRenderInternal = ({
  scope,
  handle,
  environment,
  logLevel
}) => {
  if (typeof handle === "undefined") {
    throw new TypeError("The continueRender() method must be called with a parameter that is the return value of delayRender(). No value was passed.");
  }
  if (typeof handle !== "number") {
    throw new TypeError("The parameter passed into continueRender() must be the return value of delayRender() which is a number. Got: " + JSON.stringify(handle));
  }
  scope.remotion_delayRenderHandles = scope.remotion_delayRenderHandles.filter((h) => {
    if (h === handle) {
      if (environment.isRendering && scope !== void 0) {
        if (!scope.remotion_delayRenderTimeouts[handle]) {
          return false;
        }
        const { label: label2, startTime, timeout } = scope.remotion_delayRenderTimeouts[handle];
        clearTimeout(timeout);
        const message = [
          label2 ? `"${label2}"` : "A handle",
          DELAY_RENDER_CLEAR_TOKEN,
          `${Date.now() - startTime}ms`
        ].filter(truthy).join(" ");
        Log.verbose({ logLevel, tag: "delayRender()" }, message);
        delete scope.remotion_delayRenderTimeouts[handle];
      }
      return false;
    }
    return true;
  });
  if (scope.remotion_delayRenderHandles.length === 0) {
    scope.remotion_renderReady = true;
  }
};
var LogLevelContext = reactExports.createContext({
  logLevel: "info",
  mountTime: 0
});
var useLogLevel = () => {
  const { logLevel } = reactExports.useContext(LogLevelContext);
  if (logLevel === null) {
    throw new Error("useLogLevel must be used within a LogLevelProvider");
  }
  return logLevel;
};
var useMountTime = () => {
  const { mountTime } = reactExports.useContext(LogLevelContext);
  if (mountTime === null) {
    throw new Error("useMountTime must be used within a LogLevelProvider");
  }
  return mountTime;
};
var DelayRenderContextType = reactExports.createContext(null);
var useDelayRender = () => {
  const environment = useRemotionEnvironment();
  const scope = reactExports.useContext(DelayRenderContextType) ?? (typeof window !== "undefined" ? window : void 0);
  const logLevel = useLogLevel();
  const delayRender2 = reactExports.useCallback((label2, options) => {
    if (!scope) {
      return Math.random();
    }
    return delayRenderInternal({
      scope,
      environment,
      label: label2 ?? null,
      options: options ?? {}
    });
  }, [environment, scope]);
  const continueRender2 = reactExports.useCallback((handle) => {
    if (!scope) {
      return;
    }
    continueRenderInternal({
      scope,
      handle,
      environment,
      logLevel
    });
  }, [environment, logLevel, scope]);
  const cancelRender2 = reactExports.useCallback((err) => {
    return cancelRenderInternal(scope ?? (typeof window !== "undefined" ? window : void 0), err);
  }, [scope]);
  return { delayRender: delayRender2, continueRender: continueRender2, cancelRender: cancelRender2 };
};
var useLazyComponent = ({
  compProps,
  componentName,
  noSuspense
}) => {
  const componentRef = reactExports.useRef(null);
  if ("component" in compProps) {
    componentRef.current = compProps.component;
  }
  const lazy = reactExports.useMemo(() => {
    if ("component" in compProps) {
      if (typeof document === "undefined" || noSuspense) {
        return compProps.component;
      }
      if (typeof compProps.component === "undefined") {
        throw new Error(`A value of \`undefined\` was passed to the \`component\` prop. Check the value you are passing to the <${componentName}/> component.`);
      }
      const Wrapper = (props) => {
        const Comp = componentRef.current;
        return React.createElement(Comp, props);
      };
      return Wrapper;
    }
    if ("lazyComponent" in compProps && typeof compProps.lazyComponent !== "undefined") {
      if (typeof compProps.lazyComponent === "undefined") {
        throw new Error(`A value of \`undefined\` was passed to the \`lazyComponent\` prop. Check the value you are passing to the <${componentName}/> component.`);
      }
      return React.lazy(compProps.lazyComponent);
    }
    throw new Error("You must pass either 'component' or 'lazyComponent'");
  }, [compProps.lazyComponent]);
  return lazy;
};
var useVideo = () => {
  const { canvasContent, compositions, currentCompositionMetadata } = reactExports.useContext(CompositionManager);
  const selected = compositions.find((c2) => {
    return canvasContent?.type === "composition" && c2.id === canvasContent.compositionId;
  });
  const resolved = useResolvedVideoConfig(selected?.id ?? null);
  return reactExports.useMemo(() => {
    if (!resolved) {
      return null;
    }
    if (resolved.type === "error") {
      return null;
    }
    if (resolved.type === "loading") {
      return null;
    }
    if (!selected) {
      return null;
    }
    return {
      ...resolved.result,
      defaultProps: selected.defaultProps ?? {},
      id: selected.id,
      ...currentCompositionMetadata ?? {},
      component: selected.component
    };
  }, [currentCompositionMetadata, resolved, selected]);
};
var getRegex2 = () => /^([a-zA-Z0-9-\u4E00-\u9FFF])+$/g;
var isCompositionIdValid = (id) => id.match(getRegex2());
var validateCompositionId = (id) => {
  if (!isCompositionIdValid(id)) {
    throw new Error(`Composition id can only contain a-z, A-Z, 0-9, CJK characters and -. You passed ${id}`);
  }
};
var invalidCompositionErrorMessage = `Composition ID must match ${String(getRegex2())}`;
var validateDefaultAndInputProps$2 = (defaultProps, name, compositionId) => {
  if (!defaultProps) {
    return;
  }
  if (typeof defaultProps !== "object") {
    throw new Error(`"${name}" must be an object, but you passed a value of type ${typeof defaultProps}`);
  }
  if (Array.isArray(defaultProps)) {
    throw new Error(`"${name}" must be an object, an array was passed ${compositionId ? `for composition "${compositionId}"` : ""}`);
  }
};
var Fallback = () => {
  const { continueRender: continueRender2, delayRender: delayRender2 } = useDelayRender();
  reactExports.useEffect(() => {
    const fallback = delayRender2("Waiting for Root component to unsuspend");
    return () => continueRender2(fallback);
  }, [continueRender2, delayRender2]);
  return null;
};
var InnerComposition = ({
  width,
  height,
  fps,
  durationInFrames,
  id,
  defaultProps,
  schema,
  ...compProps
}) => {
  const compManager = reactExports.useContext(CompositionSetters);
  const { registerComposition, unregisterComposition } = compManager;
  const video = useVideo();
  const lazy = useLazyComponent({
    compProps,
    componentName: "Composition",
    noSuspense: false
  });
  const nonce = useNonce();
  const isPlayer = useIsPlayer();
  const environment = useRemotionEnvironment();
  const canUseComposition = reactExports.useContext(CanUseRemotionHooks);
  if (typeof window !== "undefined") {
    window.remotion_seenCompositionIds = Array.from(/* @__PURE__ */ new Set([...window.remotion_seenCompositionIds ?? [], id]));
  }
  if (canUseComposition) {
    if (isPlayer) {
      throw new Error("<Composition> was mounted inside the `component` that was passed to the <Player>. See https://remotion.dev/docs/wrong-composition-mount for help.");
    }
    throw new Error("<Composition> mounted inside another composition. See https://remotion.dev/docs/wrong-composition-mount for help.");
  }
  const { folderName, parentName } = reactExports.useContext(FolderContext);
  const stack = compProps.stack ?? null;
  reactExports.useEffect(() => {
    if (!id) {
      throw new Error("No id for composition passed.");
    }
    validateCompositionId(id);
    validateDefaultAndInputProps$2(defaultProps, "defaultProps", id);
    registerComposition({
      durationInFrames: durationInFrames ?? void 0,
      fps: fps ?? void 0,
      height: height ?? void 0,
      width: width ?? void 0,
      id,
      folderName,
      component: lazy,
      defaultProps: serializeThenDeserializeInStudio(defaultProps ?? {}),
      nonce: nonce.get(),
      parentFolderName: parentName,
      schema: schema ?? null,
      calculateMetadata: compProps.calculateMetadata ?? null,
      stack
    });
    return () => {
      unregisterComposition(id);
    };
  }, [
    durationInFrames,
    fps,
    height,
    lazy,
    id,
    folderName,
    defaultProps,
    width,
    nonce,
    parentName,
    schema,
    compProps.calculateMetadata,
    stack,
    registerComposition,
    unregisterComposition
  ]);
  const resolved = useResolvedVideoConfig(id);
  const { setError, clearError } = reactExports.useContext(CompositionRenderErrorContext);
  const onError = reactExports.useCallback((error2) => {
    setError(error2);
  }, [setError]);
  const onClear = reactExports.useCallback(() => {
    clearError();
  }, [clearError]);
  if (environment.isStudio && video && video.component === lazy && video.id === id) {
    const Comp = lazy;
    if (resolved === null || resolved.type !== "success" && resolved.type !== "success-and-refreshing") {
      return null;
    }
    return reactDomExports.createPortal(/* @__PURE__ */ jsxRuntimeExports.jsx(CanUseRemotionHooksProvider, {
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(CompositionErrorBoundary, {
        onError,
        onClear,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(reactExports.Suspense, {
          fallback: /* @__PURE__ */ jsxRuntimeExports.jsx(Loading, {}),
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Comp, {
            ...resolved.result.props ?? {}
          })
        })
      })
    }), portalNode());
  }
  if (environment.isRendering && video && video.component === lazy && video.id === id) {
    const Comp = lazy;
    if (resolved === null || resolved.type !== "success" && resolved.type !== "success-and-refreshing") {
      return null;
    }
    return reactDomExports.createPortal(/* @__PURE__ */ jsxRuntimeExports.jsx(CanUseRemotionHooksProvider, {
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(reactExports.Suspense, {
        fallback: /* @__PURE__ */ jsxRuntimeExports.jsx(Fallback, {}),
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Comp, {
          ...resolved.result.props ?? {}
        })
      })
    }), portalNode());
  }
  return null;
};
var Composition = (props) => {
  const { onlyRenderComposition } = reactExports.useContext(CompositionSetters);
  if (onlyRenderComposition && onlyRenderComposition !== props.id) {
    return null;
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(InnerComposition, {
    ...props
  });
};
var SequenceContext = reactExports.createContext(null);
var exports_timeline_position_state = {};
__export(exports_timeline_position_state, {
  useTimelineSetFrame: () => useTimelineSetFrame,
  useTimelinePosition: () => useTimelinePosition,
  useTimelineContext: () => useTimelineContext,
  usePlayingState: () => usePlayingState,
  usePlaybackRate: () => usePlaybackRate,
  useAbsoluteTimelinePosition: () => useAbsoluteTimelinePosition,
  persistCurrentFrame: () => persistCurrentFrame,
  getInitialFrameState: () => getInitialFrameState,
  getFrameForComposition: () => getFrameForComposition
});
function mulberry32(a2) {
  let t = a2 + 1831565813;
  t = Math.imul(t ^ t >>> 15, t | 1);
  t ^= t + Math.imul(t ^ t >>> 7, t | 61);
  return ((t ^ t >>> 14) >>> 0) / 4294967296;
}
function hashCode(str) {
  let i = 0;
  let chr = 0;
  let hash = 0;
  for (i = 0; i < str.length; i++) {
    chr = str.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0;
  }
  return hash;
}
var random = (seed, dummy) => {
  if (seed === null) {
    return Math.random();
  }
  if (typeof seed === "string") {
    return mulberry32(hashCode(seed));
  }
  if (typeof seed === "number") {
    return mulberry32(seed * 1e10);
  }
  throw new Error("random() argument must be a number or a string");
};
var SetTimelineContext = reactExports.createContext({
  setFrame: () => {
    throw new Error("default");
  },
  setPlaying: () => {
    throw new Error("default");
  }
});
var TimelineContext = reactExports.createContext(null);
var PlaybackRateContext = reactExports.createContext(null);
var AbsoluteTimeContext = reactExports.createContext(null);
var TimelineContextProvider = ({ children, frameState }) => {
  const [playing, setPlaying] = reactExports.useState(false);
  const imperativePlaying = reactExports.useRef(false);
  const [playbackRate, setPlaybackRate] = reactExports.useState(1);
  const audioAndVideoTags = reactExports.useRef([]);
  const [remotionRootId] = reactExports.useState(() => String(random(null)));
  const [_frame, setFrame] = reactExports.useState(() => getInitialFrameState());
  const frame = frameState ?? _frame;
  const { delayRender: delayRender2, continueRender: continueRender2 } = useDelayRender();
  if (typeof window !== "undefined") {
    reactExports.useLayoutEffect(() => {
      window.remotion_setFrame = (f, composition, attempt) => {
        window.remotion_attempt = attempt;
        const id = delayRender2(`Setting the current frame to ${f}`);
        let asyncUpdate = true;
        setFrame((s) => {
          const currentFrame = s[composition] ?? window.remotion_initialFrame;
          if (currentFrame === f) {
            asyncUpdate = false;
            return s;
          }
          return {
            ...s,
            [composition]: f
          };
        });
        if (asyncUpdate) {
          requestAnimationFrame(() => continueRender2(id));
        } else {
          continueRender2(id);
        }
      };
      window.remotion_isPlayer = false;
    }, [continueRender2, delayRender2]);
  }
  const timelineContextValue = reactExports.useMemo(() => {
    return {
      frame,
      playing,
      imperativePlaying,
      rootId: remotionRootId,
      audioAndVideoTags
    };
  }, [frame, playing, remotionRootId]);
  const playbackRateContextValue = reactExports.useMemo(() => {
    return {
      playbackRate,
      setPlaybackRate
    };
  }, [playbackRate]);
  const setTimelineContextValue = reactExports.useMemo(() => {
    return {
      setFrame,
      setPlaying
    };
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AbsoluteTimeContext.Provider, {
    value: timelineContextValue,
    children: /* @__PURE__ */ jsxRuntimeExports.jsx(PlaybackRateContext.Provider, {
      value: playbackRateContextValue,
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(TimelineContext.Provider, {
        value: timelineContextValue,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(SetTimelineContext.Provider, {
          value: setTimelineContextValue,
          children
        })
      })
    })
  });
};
var makeKey = () => {
  return `remotion.time-all`;
};
var persistCurrentFrame = (time) => {
  localStorage.setItem(makeKey(), JSON.stringify(time));
};
var getInitialFrameState = () => {
  const item = localStorage.getItem(makeKey()) ?? "{}";
  const obj = JSON.parse(item);
  return obj;
};
var getFrameForComposition = (composition) => {
  const item = localStorage.getItem(makeKey()) ?? "{}";
  const obj = JSON.parse(item);
  if (obj[composition] !== void 0) {
    return Number(obj[composition]);
  }
  if (typeof window === "undefined") {
    return 0;
  }
  return window.remotion_initialFrame ?? 0;
};
var useTimelinePositionFromContext = (state) => {
  const videoConfig = useVideo();
  const env = useRemotionEnvironment();
  if (!videoConfig) {
    return typeof window === "undefined" ? 0 : window.remotion_initialFrame ?? 0;
  }
  const unclamped = state.frame[videoConfig.id] ?? (env.isPlayer ? 0 : getFrameForComposition(videoConfig.id));
  return Math.min(videoConfig.durationInFrames - 1, unclamped);
};
var useTimelineContext = () => {
  const state = reactExports.useContext(TimelineContext);
  if (state === null) {
    throw new Error("TimelineContext is not available. This hook must be used inside a <Player> or the Remotion Studio.");
  }
  return state;
};
var usePlaybackRate = () => {
  const state = reactExports.useContext(PlaybackRateContext);
  if (state === null) {
    throw new Error("PlaybackRateContext is not available. This hook must be used inside a <Player> or the Remotion Studio.");
  }
  return state;
};
var useTimelinePosition = () => {
  const state = useTimelineContext();
  return useTimelinePositionFromContext(state);
};
var useAbsoluteTimelinePosition = () => {
  const state = reactExports.useContext(AbsoluteTimeContext);
  if (state === null) {
    throw new Error("AbsoluteTimeContext is not available. This hook must be used inside a <Player> or the Remotion Studio.");
  }
  return useTimelinePositionFromContext(state);
};
var useTimelineSetFrame = () => {
  const { setFrame } = reactExports.useContext(SetTimelineContext);
  return setFrame;
};
var usePlayingState = () => {
  const { playing, imperativePlaying } = useTimelineContext();
  const { setPlaying } = reactExports.useContext(SetTimelineContext);
  return reactExports.useMemo(() => [playing, setPlaying, imperativePlaying], [imperativePlaying, playing, setPlaying]);
};
var useCurrentFrame = () => {
  const canUseRemotionHooks = reactExports.useContext(CanUseRemotionHooks);
  const env = useRemotionEnvironment();
  if (!canUseRemotionHooks) {
    if (env.isPlayer) {
      throw new Error(`useCurrentFrame can only be called inside a component that was passed to <Player>. See: https://www.remotion.dev/docs/player/examples`);
    }
    throw new Error(`useCurrentFrame() can only be called inside a component that was registered as a composition. See https://www.remotion.dev/docs/the-fundamentals#defining-compositions`);
  }
  const frame = useTimelinePosition();
  const context = reactExports.useContext(SequenceContext);
  const contextOffset = context ? context.cumulatedFrom + context.relativeFrom : 0;
  return frame - contextOffset;
};
var flattenEffects = (effects) => {
  const out = [];
  for (const item of effects) {
    if (Array.isArray(item)) {
      for (const inner2 of item) {
        out.push(inner2);
      }
    } else {
      out.push(item);
    }
  }
  return out;
};
var groupByBackend = (effects) => {
  const runs = [];
  let current = [];
  let currentBackend = null;
  for (const eff of effects) {
    const { backend } = eff.definition;
    if (currentBackend === null || backend === currentBackend) {
      current.push(eff);
      currentBackend = backend;
    } else {
      runs.push({ backend: currentBackend, effects: current });
      current = [eff];
      currentBackend = backend;
    }
  }
  if (currentBackend !== null && current.length > 0) {
    runs.push({ backend: currentBackend, effects: current });
  }
  return runs;
};
class CanvasPool {
  width;
  height;
  pairs = /* @__PURE__ */ new Map();
  lostContexts = /* @__PURE__ */ new Set();
  constructor(width, height) {
    this.width = width;
    this.height = height;
  }
  getPair(backend) {
    const existing = this.pairs.get(backend);
    if (existing) {
      return existing;
    }
    const pair = [
      this.allocateCanvas(backend),
      this.allocateCanvas(backend)
    ];
    this.pairs.set(backend, pair);
    return pair;
  }
  assertContextNotLost(canvas) {
    if (this.lostContexts.has(canvas)) {
      throw new Error("WebGL context was lost during canvas effect rendering. This typically happens in headless or memory-constrained environments (e.g. Remotion Lambda). Try reducing concurrency or increasing the Lambda function memory.");
    }
  }
  allocateCanvas(backend) {
    const canvas = document.createElement("canvas");
    canvas.width = this.width;
    canvas.height = this.height;
    switch (backend) {
      case "2d": {
        const ctx = canvas.getContext("2d", {
          colorSpace: "srgb"
        });
        if (!ctx) {
          throw new Error("Failed to acquire 2D context for canvas effect");
        }
        return canvas;
      }
      case "webgl2": {
        const ctx = canvas.getContext("webgl2", {
          premultipliedAlpha: true,
          alpha: true,
          preserveDrawingBuffer: true
        });
        if (!ctx) {
          throw new Error("Failed to acquire WebGL2 context for canvas effect");
        }
        canvas.addEventListener("webglcontextlost", (e) => {
          e.preventDefault();
          this.lostContexts.add(canvas);
        });
        canvas.addEventListener("webglcontextrestored", () => {
          this.lostContexts.delete(canvas);
        });
        ctx.pixelStorei(ctx.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
        return canvas;
      }
      case "webgpu": {
        if (typeof navigator === "undefined" || !("gpu" in navigator)) {
          throw new Error("WebGPU is not available in this environment for canvas effect");
        }
        return canvas;
      }
      default: {
        const exhaustive = backend;
        throw new Error(`Unknown effect backend: ${exhaustive}`);
      }
    }
  }
}
var devicePromise = null;
var getGpuDevice = () => {
  if (devicePromise) {
    return devicePromise;
  }
  devicePromise = (async () => {
    if (typeof navigator === "undefined" || !("gpu" in navigator)) {
      throw new Error("WebGPU is not available in this environment");
    }
    const { gpu } = navigator;
    const adapter = await gpu.requestAdapter();
    if (!adapter) {
      throw new Error("No WebGPU adapter available");
    }
    return adapter.requestDevice();
  })();
  return devicePromise;
};
var createEffectChainState = (width, height) => ({
  pool: new CanvasPool(width, height),
  setupCache: /* @__PURE__ */ new WeakMap(),
  cleanupRegistry: [],
  currentRunId: 0
});
var cleanupEffectChainState = (state) => {
  state.currentRunId++;
  for (const entry of state.cleanupRegistry) {
    entry.definition.cleanup(entry.state);
  }
};
var ensureSetup = (state, def, target) => {
  const widened = def;
  if (state.setupCache.has(widened)) {
    return state.setupCache.get(widened);
  }
  const setupState = def.setup(target);
  state.setupCache.set(widened, setupState);
  state.cleanupRegistry.push({ definition: widened, state: setupState });
  return setupState;
};
var runEffectChain = async ({
  state,
  source,
  effects,
  output,
  frame,
  width,
  height
}) => {
  const runId = ++state.currentRunId;
  const isCancelled = () => state.currentRunId !== runId;
  const runs = groupByBackend(effects);
  let currentImage = source;
  let lastTarget = null;
  if (runs.length === 0) {
    if (source === output) {
      return true;
    }
    const ctx = output.getContext("2d");
    if (!ctx) {
      throw new Error("Failed to acquire 2D context for output canvas");
    }
    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(currentImage, 0, 0, width, height);
    return true;
  }
  let needsGpuDevice = false;
  for (const run of runs) {
    if (run.backend === "webgpu") {
      needsGpuDevice = true;
      break;
    }
  }
  const gpuDevice = needsGpuDevice ? await getGpuDevice() : null;
  if (isCancelled()) {
    return false;
  }
  for (let runIndex = 0; runIndex < runs.length; runIndex++) {
    const run = runs[runIndex];
    const [a2, b2] = state.pool.getPair(run.backend);
    let dst = a2;
    for (const eff of run.effects) {
      const def = eff.definition;
      const setupState = ensureSetup(state, def, dst);
      def.apply({
        source: currentImage,
        target: dst,
        state: setupState,
        params: eff.params,
        frame,
        width,
        height,
        gpuDevice
      });
      if (run.backend === "webgl2") {
        state.pool.assertContextNotLost(dst);
      }
      currentImage = dst;
      dst = dst === a2 ? b2 : a2;
    }
    lastTarget = currentImage ?? lastTarget;
    const nextRun = runs[runIndex + 1];
    if (nextRun && nextRun.backend !== run.backend && lastTarget) {
      const bitmap = await createImageBitmap(lastTarget);
      if (isCancelled()) {
        bitmap.close();
        return false;
      }
      currentImage = bitmap;
    }
  }
  if (!lastTarget) {
    return true;
  }
  const outCtx = output.getContext("2d");
  if (!outCtx) {
    throw new Error("Failed to acquire 2D context for output canvas");
  }
  outCtx.clearRect(0, 0, width, height);
  outCtx.drawImage(lastTarget, 0, 0, width, height);
  return true;
};
var useEffectChainState = () => {
  const chainStateRef = reactExports.useRef(null);
  const sizeRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    return () => {
      if (chainStateRef.current) {
        cleanupEffectChainState(chainStateRef.current);
      }
    };
  }, []);
  return reactExports.useMemo(() => ({
    get: (width, height) => {
      if (!sizeRef.current || sizeRef.current.width !== width || sizeRef.current.height !== height) {
        if (chainStateRef.current) {
          cleanupEffectChainState(chainStateRef.current);
        }
        chainStateRef.current = createEffectChainState(width, height);
        sizeRef.current = { width, height };
      }
      return chainStateRef.current;
    }
  }), []);
};
var useMemoizedEffects = (effects) => {
  const previousRef = reactExports.useRef(null);
  const previous = previousRef.current;
  const isSame = previous !== null && previous.length === effects.length && previous.every((p, i) => p.definition === effects[i].definition && p.effectKey === effects[i].effectKey);
  if (isSame) {
    return previous;
  }
  const next = effects.map((e) => ({
    definition: e.definition,
    stack: e.stack,
    effectKey: e.effectKey,
    params: e.params,
    memoized: true
  }));
  previousRef.current = next;
  return next;
};
var componentsToAddStacksTo = [];
var getComponentsToAddStacksTo = () => componentsToAddStacksTo;
var addSequenceStackTraces = (component) => {
  componentsToAddStacksTo.push(component);
};
var VERSION = "4.0.461";
var checkMultipleRemotionVersions = () => {
  if (typeof globalThis === "undefined") {
    return;
  }
  const set = () => {
    globalThis.remotion_imported = VERSION;
    if (typeof window !== "undefined") {
      window.remotion_imported = VERSION;
    }
  };
  const alreadyImported = globalThis.remotion_imported || typeof window !== "undefined" && window.remotion_imported;
  if (alreadyImported) {
    if (alreadyImported === VERSION) {
      return;
    }
    if (typeof alreadyImported === "string" && alreadyImported.includes("webcodecs")) {
      set();
      return;
    }
    throw new TypeError(`🚨 Multiple versions of Remotion detected: ${[
      VERSION,
      typeof alreadyImported === "string" ? alreadyImported : "an older version"
    ].filter(truthy).join(" and ")}. This will cause things to break in an unexpected way.
Check that all your Remotion packages are on the same version. If your dependencies depend on Remotion, make them peer dependencies. You can also run \`npx remotion versions\` from your terminal to see which versions are mismatching.`);
  }
  set();
};
var useUnsafeVideoConfig = () => {
  const context = reactExports.useContext(SequenceContext);
  const ctxWidth = context?.width ?? null;
  const ctxHeight = context?.height ?? null;
  const ctxDuration = context?.durationInFrames ?? null;
  const video = useVideo();
  return reactExports.useMemo(() => {
    if (!video) {
      return null;
    }
    const {
      id,
      durationInFrames,
      fps,
      height,
      width,
      defaultProps,
      props,
      defaultCodec,
      defaultOutName,
      defaultVideoImageFormat,
      defaultPixelFormat,
      defaultProResProfile,
      defaultSampleRate
    } = video;
    return {
      id,
      width: ctxWidth ?? width,
      height: ctxHeight ?? height,
      fps,
      durationInFrames: ctxDuration ?? durationInFrames,
      defaultProps,
      props,
      defaultCodec,
      defaultOutName,
      defaultVideoImageFormat,
      defaultPixelFormat,
      defaultProResProfile,
      defaultSampleRate
    };
  }, [ctxDuration, ctxHeight, ctxWidth, video]);
};
var useVideoConfig = () => {
  const videoConfig = useUnsafeVideoConfig();
  const context = reactExports.useContext(CanUseRemotionHooks);
  const isPlayer = useIsPlayer();
  if (!videoConfig) {
    if (typeof window !== "undefined" && window.remotion_isPlayer || isPlayer) {
      throw new Error([
        "No video config found. Likely reasons:",
        "- You are probably calling useVideoConfig() from outside the component passed to <Player />. See https://www.remotion.dev/docs/player/examples for how to set up the Player correctly.",
        "- You have multiple versions of Remotion installed which causes the React context to get lost."
      ].join("-"));
    }
    throw new Error("No video config found. You are probably calling useVideoConfig() from a component which has not been registered as a <Composition />. See https://www.remotion.dev/docs/the-fundamentals#defining-compositions for more information.");
  }
  if (!context) {
    throw new Error("Called useVideoConfig() outside a Remotion composition.");
  }
  return videoConfig;
};
var Freeze = ({
  frame: frameToFreeze,
  children,
  active = true
}) => {
  const frame = useCurrentFrame();
  const videoConfig = useVideoConfig();
  if (typeof frameToFreeze === "undefined") {
    throw new Error(`The <Freeze /> component requires a 'frame' prop, but none was passed.`);
  }
  if (typeof frameToFreeze !== "number") {
    throw new Error(`The 'frame' prop of <Freeze /> must be a number, but is of type ${typeof frameToFreeze}`);
  }
  if (Number.isNaN(frameToFreeze)) {
    throw new Error(`The 'frame' prop of <Freeze /> must be a real number, but it is NaN.`);
  }
  if (!Number.isFinite(frameToFreeze)) {
    throw new Error(`The 'frame' prop of <Freeze /> must be a finite number, but it is ${frameToFreeze}.`);
  }
  const isActive = reactExports.useMemo(() => {
    if (typeof active === "boolean") {
      return active;
    }
    if (typeof active === "function") {
      return active(frame);
    }
  }, [active, frame]);
  const timelineContext = useTimelineContext();
  const sequenceContext = reactExports.useContext(SequenceContext);
  const relativeFrom = sequenceContext?.relativeFrom ?? 0;
  const timelineValue = reactExports.useMemo(() => {
    if (!isActive) {
      return timelineContext;
    }
    return {
      ...timelineContext,
      playing: false,
      imperativePlaying: {
        current: false
      },
      frame: {
        [videoConfig.id]: frameToFreeze + relativeFrom
      }
    };
  }, [isActive, timelineContext, videoConfig.id, frameToFreeze, relativeFrom]);
  const newSequenceContext = reactExports.useMemo(() => {
    if (!sequenceContext) {
      return null;
    }
    if (!isActive) {
      return sequenceContext;
    }
    return {
      ...sequenceContext,
      cumulatedFrom: 0
    };
  }, [sequenceContext, isActive]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(TimelineContext.Provider, {
    value: timelineValue,
    children: /* @__PURE__ */ jsxRuntimeExports.jsx(SequenceContext.Provider, {
      value: newSequenceContext,
      children
    })
  });
};
var PremountContext = reactExports.createContext({
  premountFramesRemaining: 0
});
var sequenceStyleSchema = {
  "style.translate": {
    type: "translate",
    step: 1,
    default: "0px 0px",
    description: "Offset"
  },
  "style.scale": {
    type: "number",
    min: 0.05,
    max: 100,
    step: 0.01,
    default: 1,
    description: "Scale"
  },
  "style.rotate": {
    type: "rotation",
    step: 1,
    default: "0deg",
    description: "Rotation"
  },
  "style.opacity": {
    type: "number",
    min: 0,
    max: 1,
    step: 0.01,
    default: 1,
    description: "Opacity"
  },
  premountFor: {
    type: "number",
    default: 0,
    description: "Premount For",
    min: 0,
    step: 1
  },
  postmountFor: {
    type: "hidden"
  },
  styleWhilePremounted: {
    type: "hidden"
  },
  styleWhilePostmounted: {
    type: "hidden"
  }
};
var sequenceSchema = {
  layout: {
    type: "enum",
    default: "absolute-fill",
    description: "Layout",
    variants: {
      "absolute-fill": sequenceStyleSchema,
      none: {}
    }
  }
};
var sequenceSchemaDefaultLayoutNone = {
  ...sequenceSchema,
  layout: {
    ...sequenceSchema.layout,
    default: "none"
  }
};
var nodePathToString = (nodePath) => {
  return nodePath.join(".");
};
var SequenceManager = React.createContext({
  registerSequence: () => {
    throw new Error("SequenceManagerContext not initialized");
  },
  unregisterSequence: () => {
    throw new Error("SequenceManagerContext not initialized");
  },
  sequences: []
});
var SequenceVisibilityToggleContext = React.createContext({
  hidden: {},
  setHidden: () => {
    throw new Error("SequenceVisibilityToggle not initialized");
  }
});
var getCodeValuesCtx = (codeValues, nodePath) => {
  const status = codeValues[nodePathToString(nodePath)];
  if (!status) {
    return;
  }
  if (!status.canUpdate) {
    return;
  }
  return status.props;
};
var VisualModeCodeValuesContext = React.createContext({
  getCodeValues: () => {
    throw new Error("VisualModeCodeValuesContext not initialized");
  }
});
var VisualModeDragOverridesContext = React.createContext({
  getDragOverrides: () => {
    throw new Error("VisualModeDragOverridesContext not initialized");
  }
});
var VisualModeSettersContext = React.createContext({
  setDragOverrides: () => {
    throw new Error("VisualModeSettersContext not initialized");
  },
  clearDragOverrides: () => {
    throw new Error("VisualModeSettersContext not initialized");
  },
  setCodeValues: () => {
    throw new Error("VisualModeSettersContext not initialized");
  }
});
var SequenceManagerProvider = ({ children }) => {
  const [sequences, setSequences] = reactExports.useState([]);
  const [hidden, setHidden] = reactExports.useState({});
  const [dragOverrides, setControlOverrides] = reactExports.useState({});
  const controlOverridesRef = reactExports.useRef(dragOverrides);
  controlOverridesRef.current = dragOverrides;
  const [codeValues, setCodeValuesMapState] = reactExports.useState({});
  const setDragOverrides = reactExports.useCallback((nodePath, key, value) => {
    setControlOverrides((prev) => ({
      ...prev,
      [nodePathToString(nodePath)]: {
        ...prev[nodePathToString(nodePath)],
        [key]: value
      }
    }));
  }, []);
  const clearDragOverrides = reactExports.useCallback((nodePath) => {
    setControlOverrides((prev) => {
      const key = nodePathToString(nodePath);
      if (!prev[key]) {
        return prev;
      }
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }, []);
  const setCodeValues = reactExports.useCallback((nodePath, values) => {
    setCodeValuesMapState((prev) => {
      const key = nodePathToString(nodePath);
      const prevKey = prev[key];
      const newKey = values(prevKey);
      if (prevKey === newKey) {
        return prev;
      }
      return { ...prev, [key]: newKey };
    });
  }, []);
  const registerSequence = reactExports.useCallback((seq) => {
    setSequences((seqs) => {
      return [...seqs, seq];
    });
  }, []);
  const unregisterSequence = reactExports.useCallback((seq) => {
    setSequences((seqs) => seqs.filter((s) => s.id !== seq));
  }, []);
  const sequenceContext = reactExports.useMemo(() => {
    return {
      registerSequence,
      sequences,
      unregisterSequence
    };
  }, [registerSequence, sequences, unregisterSequence]);
  const hiddenContext = reactExports.useMemo(() => {
    return {
      hidden,
      setHidden
    };
  }, [hidden]);
  const getDragOverrides = reactExports.useCallback((nodePath) => {
    return dragOverrides[nodePathToString(nodePath)] ?? {};
  }, [dragOverrides]);
  const getCodeValues = reactExports.useCallback((nodePath) => {
    return getCodeValuesCtx(codeValues, nodePath);
  }, [codeValues]);
  const codeValuesContext = reactExports.useMemo(() => {
    return {
      getCodeValues
    };
  }, [getCodeValues]);
  const dragOverridesContext = reactExports.useMemo(() => {
    return {
      getDragOverrides
    };
  }, [getDragOverrides]);
  const settersContext = reactExports.useMemo(() => {
    return {
      setDragOverrides,
      clearDragOverrides,
      setCodeValues
    };
  }, [setDragOverrides, clearDragOverrides, setCodeValues]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(SequenceManager.Provider, {
    value: sequenceContext,
    children: /* @__PURE__ */ jsxRuntimeExports.jsx(SequenceVisibilityToggleContext.Provider, {
      value: hiddenContext,
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(VisualModeCodeValuesContext.Provider, {
        value: codeValuesContext,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(VisualModeDragOverridesContext.Provider, {
          value: dragOverridesContext,
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(VisualModeSettersContext.Provider, {
            value: settersContext,
            children
          })
        })
      })
    })
  });
};
var deleteNestedKey = (obj, keysToRemove) => {
  for (const key of keysToRemove) {
    const parts = key.split(".");
    const parents = [obj];
    let current = obj;
    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      const next = current[part];
      if (next === void 0 || next === null) {
        current = null;
        break;
      }
      current = next;
      parents.push(current);
    }
    if (current === null) {
      continue;
    }
    delete current[parts[parts.length - 1]];
    for (let i = parents.length - 1; i > 0; i--) {
      const parent = parents[i];
      if (Object.keys(parent).length === 0) {
        const parentKey = parts[i - 1];
        delete parents[i - 1][parentKey];
      } else {
        break;
      }
    }
  }
  return obj;
};
var flattenActiveSchema = (schema, resolve) => {
  const out = {};
  for (const key of Object.keys(schema)) {
    const field = schema[key];
    if (field.type === "hidden") {
      continue;
    } else if (field.type === "enum") {
      out[key] = field;
      const current = resolve(key) ?? field.default;
      const variant = field.variants[current];
      if (variant) {
        Object.assign(out, flattenActiveSchema(variant, resolve));
      }
    } else {
      out[key] = field;
    }
  }
  return out;
};
var getFlatSchemaWithAllKeys = (schema) => {
  const out = {};
  const addKey = (key, field) => {
    if (key in out) {
      throw new Error(`Duplicate key "${key}" in schema: discriminated union variants must not share keys`);
    }
    out[key] = field;
  };
  for (const key of Object.keys(schema)) {
    const field = schema[key];
    addKey(key, field);
    if (field.type === "enum") {
      for (const variant of Object.values(field.variants)) {
        const flatVariant = getFlatSchemaWithAllKeys(variant);
        for (const variantKey of Object.keys(flatVariant)) {
          addKey(variantKey, flatVariant[variantKey]);
        }
      }
    }
  }
  return out;
};
var OverrideIdsToNodePathsGettersContext = reactExports.createContext({
  overrideIdToNodePathMappings: {}
});
var OverrideIdsToNodePathsSettersContext = reactExports.createContext({
  setOverrideIdToNodePath: () => {
    throw new Error("OverrideIdsToNodePathsSettersContext not initialized");
  }
});
var findPropsToDelete = ({
  schema,
  key,
  value
}) => {
  const fieldSchema = schema[key];
  if (!fieldSchema) {
    throw new Error("Key " + JSON.stringify(key) + " not found in schema");
  }
  if (typeof value !== "string") {
    throw new Error("Value must be a string, but is " + JSON.stringify(value));
  }
  if (fieldSchema.type !== "enum") {
    throw new Error("Key " + JSON.stringify(key) + " is not an enum");
  }
  const currentVariant = fieldSchema.variants[value];
  if (!currentVariant) {
    throw new Error("Value for " + JSON.stringify(key) + " must be one of " + Object.keys(fieldSchema.variants).map((v) => JSON.stringify(v)).join(", ") + ", got " + JSON.stringify(value));
  }
  const otherVariants = Object.keys(fieldSchema.variants).filter((v) => v !== value);
  const otherKeys = /* @__PURE__ */ new Set();
  for (const variant of otherVariants) {
    const otherVariant = fieldSchema.variants[variant];
    const keys = Object.keys(otherVariant);
    for (const k of keys) {
      otherKeys.add(k);
    }
  }
  return [...otherKeys];
};
var getEffectiveVisualModeValue = ({
  codeValue,
  runtimeValue,
  dragOverrideValue,
  defaultValue,
  shouldResortToDefaultValueIfUndefined = false
}) => {
  if (dragOverrideValue !== void 0) {
    return dragOverrideValue;
  }
  if (!codeValue) {
    return runtimeValue;
  }
  if (!codeValue.canUpdate) {
    return runtimeValue;
  }
  if (codeValue.codeValue === void 0 && shouldResortToDefaultValueIfUndefined) {
    return defaultValue;
  }
  return codeValue.codeValue;
};
var findFieldInSchema = (schema, key) => {
  if (key in schema) {
    return schema[key];
  }
  for (const field of Object.values(schema)) {
    if (field.type !== "enum") {
      continue;
    }
    for (const variant of Object.values(field.variants)) {
      const found = findFieldInSchema(variant, key);
      if (found) {
        return found;
      }
    }
  }
  return;
};
var computeEffectiveSchemaValuesDotNotation = ({
  schema,
  currentValue,
  overrideValues,
  propStatus
}) => {
  const merged = {};
  const propsToDelete = /* @__PURE__ */ new Set();
  for (const key of Object.keys(currentValue)) {
    const codeValueStatus = propStatus?.[key] ?? null;
    const field = findFieldInSchema(schema, key);
    if (field?.type === "hidden") {
      continue;
    }
    const value = getEffectiveVisualModeValue({
      codeValue: codeValueStatus,
      runtimeValue: currentValue[key],
      dragOverrideValue: overrideValues[key],
      defaultValue: field?.default,
      shouldResortToDefaultValueIfUndefined: false
    });
    if (value === void 0) {
      propsToDelete.add(key);
    }
    merged[key] = value;
  }
  for (const key of Object.keys(overrideValues)) {
    if (schema[key]?.type === "enum") {
      const propsToDeleteForKey = findPropsToDelete({
        schema,
        key,
        value: merged[key]
      });
      for (const propToDelete of propsToDeleteForKey) {
        propsToDelete.add(propToDelete);
      }
    }
  }
  return { merged, propsToDelete };
};
var getNestedValue = (obj, key) => {
  const parts = key.split(".");
  let current = obj;
  for (const part of parts) {
    if (current === null || current === void 0 || typeof current !== "object")
      return;
    current = current[part];
  }
  return current;
};
var readValuesFromProps = (props, keys) => {
  const out = {};
  for (const key of keys) {
    out[key] = getNestedValue(props, key);
  }
  return out;
};
var selectActiveKeys = (schema, values) => {
  return Object.keys(flattenActiveSchema(schema, (key) => values[key]));
};
var mergeValues = ({
  props,
  valuesDotNotation,
  schemaKeys,
  propsToDelete
}) => {
  const merged = { ...props };
  for (const key of schemaKeys) {
    const value = valuesDotNotation[key];
    const parts = key.split(".");
    if (parts.length === 1) {
      merged[key] = value;
      continue;
    }
    let current = merged;
    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      if (typeof current[part] === "object" && current[part] !== null) {
        current[part] = { ...current[part] };
      } else {
        current[part] = {};
      }
      current = current[part];
    }
    current[parts[parts.length - 1]] = value;
  }
  deleteNestedKey(merged, propsToDelete);
  return merged;
};
var stackToOverrideMap = {};
var wrapInSchema = (Component, schema) => {
  const flatSchema = getFlatSchemaWithAllKeys(schema);
  const flatKeys = Object.keys(flatSchema);
  const Wrapped = reactExports.forwardRef((props, ref) => {
    const env = useRemotionEnvironment();
    if (!env.isStudio || env.isReadOnlyStudio || env.isRendering) {
      return React.createElement(Component, {
        ...props,
        _experimentalControls: null,
        ref
      });
    }
    const { getCodeValues } = reactExports.useContext(VisualModeCodeValuesContext);
    const { getDragOverrides } = reactExports.useContext(VisualModeDragOverridesContext);
    const nodePathMapping = reactExports.useContext(OverrideIdsToNodePathsGettersContext);
    if (props._experimentalControls) {
      return React.createElement(Component, {
        ...props,
        ref
      });
    }
    const [overrideId] = reactExports.useState(() => {
      const { stack } = props;
      if (!stack) {
        return String(Math.random());
      }
      const existingOverrideId = stackToOverrideMap[stack];
      if (existingOverrideId) {
        return existingOverrideId;
      }
      const newOverrideId = String(Math.random());
      stackToOverrideMap[stack] = newOverrideId;
      return newOverrideId;
    });
    const nodePath = nodePathMapping.overrideIdToNodePathMappings[overrideId] ?? null;
    const runtimeValues = flatKeys.map((k) => getNestedValue(props, k));
    const currentRuntimeValueDotNotation = reactExports.useMemo(() => readValuesFromProps(props, flatKeys), runtimeValues);
    const controls = reactExports.useMemo(() => {
      return {
        schema,
        currentRuntimeValueDotNotation,
        overrideId
      };
    }, [currentRuntimeValueDotNotation, overrideId]);
    const { merged: valuesDotNotation, propsToDelete } = reactExports.useMemo(() => {
      return computeEffectiveSchemaValuesDotNotation({
        schema,
        currentValue: currentRuntimeValueDotNotation,
        overrideValues: nodePath === null ? {} : getDragOverrides(nodePath),
        propStatus: nodePath === null ? void 0 : getCodeValues(nodePath)
      });
    }, [
      currentRuntimeValueDotNotation,
      getDragOverrides,
      nodePath,
      getCodeValues
    ]);
    const activeKeys = selectActiveKeys(schema, valuesDotNotation);
    const mergedProps = mergeValues({
      props,
      valuesDotNotation,
      schemaKeys: activeKeys,
      propsToDelete
    });
    return React.createElement(Component, {
      ...mergedProps,
      _experimentalControls: controls,
      ref
    });
  });
  Wrapped.displayName = `wrapInSchema(${Component.displayName || Component.name || "Component"})`;
  return Wrapped;
};
var RegularSequenceRefForwardingFunction = ({
  from = 0,
  durationInFrames = Infinity,
  children,
  name,
  height,
  width,
  showInTimeline = true,
  _experimentalControls: controls,
  _experimentalEffects,
  _remotionInternalLoopDisplay: loopDisplay,
  _remotionInternalStack: stack,
  _remotionInternalPremountDisplay: premountDisplay,
  _remotionInternalPostmountDisplay: postmountDisplay,
  _remotionInternalIsMedia: isMedia,
  ...other
}, ref) => {
  const { layout = "absolute-fill" } = other;
  const [id] = reactExports.useState(() => String(Math.random()));
  const parentSequence = reactExports.useContext(SequenceContext);
  const { rootId } = useTimelineContext();
  const cumulatedFrom = parentSequence ? parentSequence.cumulatedFrom + parentSequence.relativeFrom : 0;
  const nonce = useNonce();
  if (layout !== "absolute-fill" && layout !== "none") {
    throw new TypeError(`The layout prop of <Sequence /> expects either "absolute-fill" or "none", but you passed: ${layout}`);
  }
  if (layout === "none" && typeof other.style !== "undefined") {
    throw new TypeError('If layout="none", you may not pass a style. Passed: ' + JSON.stringify(other.style));
  }
  if (typeof durationInFrames !== "number") {
    throw new TypeError(`You passed to durationInFrames an argument of type ${typeof durationInFrames}, but it must be a number.`);
  }
  if (durationInFrames <= 0) {
    throw new TypeError(`durationInFrames must be positive, but got ${durationInFrames}`);
  }
  if (typeof from !== "number") {
    throw new TypeError(`You passed to the "from" props of your <Sequence> an argument of type ${typeof from}, but it must be a number.`);
  }
  if (!Number.isFinite(from)) {
    throw new TypeError(`The "from" prop of a sequence must be finite, but got ${from}.`);
  }
  const absoluteFrame = useTimelinePosition();
  const videoConfig = useVideoConfig();
  const parentSequenceDuration = parentSequence ? Math.min(parentSequence.durationInFrames - from, durationInFrames) : durationInFrames;
  const actualDurationInFrames = Math.max(0, Math.min(videoConfig.durationInFrames - from, parentSequenceDuration));
  const { registerSequence, unregisterSequence } = reactExports.useContext(SequenceManager);
  const { hidden } = reactExports.useContext(SequenceVisibilityToggleContext);
  const premounting = reactExports.useMemo(() => {
    return parentSequence?.premounting || Boolean(other._remotionInternalIsPremounting);
  }, [other._remotionInternalIsPremounting, parentSequence?.premounting]);
  const postmounting = reactExports.useMemo(() => {
    return parentSequence?.postmounting || Boolean(other._remotionInternalIsPostmounting);
  }, [other._remotionInternalIsPostmounting, parentSequence?.postmounting]);
  const contextValue = reactExports.useMemo(() => {
    return {
      cumulatedFrom,
      relativeFrom: from,
      durationInFrames: actualDurationInFrames,
      parentFrom: parentSequence?.relativeFrom ?? 0,
      id,
      height: height ?? parentSequence?.height ?? null,
      width: width ?? parentSequence?.width ?? null,
      premounting,
      postmounting,
      premountDisplay: premountDisplay ?? null,
      postmountDisplay: postmountDisplay ?? null
    };
  }, [
    cumulatedFrom,
    from,
    actualDurationInFrames,
    parentSequence,
    id,
    height,
    width,
    premounting,
    postmounting,
    premountDisplay,
    postmountDisplay
  ]);
  const timelineClipName = reactExports.useMemo(() => {
    return name ?? "";
  }, [name]);
  const env = useRemotionEnvironment();
  const inheritedStack = other?.stack ?? null;
  reactExports.useEffect(() => {
    if (!env.isStudio) {
      return;
    }
    if (isMedia) {
      registerSequence({
        type: isMedia.type,
        controls: controls ?? null,
        effects: _experimentalEffects ?? [],
        displayName: timelineClipName,
        doesVolumeChange: isMedia.data.doesVolumeChange,
        duration: actualDurationInFrames,
        from,
        id,
        loopDisplay,
        nonce: nonce.get(),
        parent: parentSequence?.id ?? null,
        playbackRate: isMedia.data.playbackRate,
        postmountDisplay: postmountDisplay ?? null,
        premountDisplay: premountDisplay ?? null,
        rootId,
        showInTimeline,
        src: isMedia.data.src,
        stack: stack ?? inheritedStack,
        startMediaFrom: isMedia.data.startMediaFrom,
        volume: isMedia.data.volumes
      });
      return () => {
        unregisterSequence(id);
      };
    }
    registerSequence({
      from,
      duration: actualDurationInFrames,
      id,
      displayName: timelineClipName,
      parent: parentSequence?.id ?? null,
      type: "sequence",
      rootId,
      showInTimeline,
      nonce: nonce.get(),
      loopDisplay,
      stack: stack ?? inheritedStack,
      premountDisplay: premountDisplay ?? null,
      postmountDisplay: postmountDisplay ?? null,
      controls: controls ?? null,
      effects: _experimentalEffects ?? []
    });
    return () => {
      unregisterSequence(id);
    };
  }, [
    durationInFrames,
    id,
    name,
    registerSequence,
    timelineClipName,
    unregisterSequence,
    parentSequence?.id,
    actualDurationInFrames,
    rootId,
    from,
    showInTimeline,
    nonce,
    loopDisplay,
    stack,
    premountDisplay,
    postmountDisplay,
    env.isStudio,
    inheritedStack,
    controls,
    _experimentalEffects,
    isMedia
  ]);
  const endThreshold = Math.ceil(cumulatedFrom + from + durationInFrames - 1);
  const content = absoluteFrame < cumulatedFrom + from ? null : absoluteFrame > endThreshold ? null : children;
  const styleIfThere = other.layout === "none" ? void 0 : other.style;
  const defaultStyle = reactExports.useMemo(() => {
    return {
      flexDirection: void 0,
      ...width ? { width } : {},
      ...height ? { height } : {},
      ...styleIfThere ?? {}
    };
  }, [height, styleIfThere, width]);
  if (ref !== null && layout === "none") {
    throw new TypeError('It is not supported to pass both a `ref` and `layout="none"` to <Sequence />.');
  }
  const isSequenceHidden = hidden[id] ?? false;
  if (isSequenceHidden) {
    return null;
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(SequenceContext.Provider, {
    value: contextValue,
    children: content === null ? null : other.layout === "none" ? content : /* @__PURE__ */ jsxRuntimeExports.jsx(AbsoluteFill, {
      ref,
      style: defaultStyle,
      className: other.className,
      children: content
    })
  });
};
var RegularSequence = reactExports.forwardRef(RegularSequenceRefForwardingFunction);
var PremountedPostmountedSequenceRefForwardingFunction = (props, ref) => {
  const parentPremountContext = reactExports.useContext(PremountContext);
  const frame = useCurrentFrame() - parentPremountContext.premountFramesRemaining;
  if (props.layout === "none") {
    throw new Error('`<Sequence>` with `premountFor` and `postmountFor` props does not support layout="none"');
  }
  const {
    style: passedStyle,
    from = 0,
    durationInFrames = Infinity,
    premountFor = 0,
    postmountFor = 0,
    styleWhilePremounted,
    styleWhilePostmounted,
    ...otherProps
  } = props;
  const endThreshold = Math.ceil(from + durationInFrames - 1);
  const premountingActive = frame < from && frame >= from - premountFor;
  const postmountingActive = frame > endThreshold && frame <= endThreshold + postmountFor;
  const freezeFrame = premountingActive ? from : postmountingActive ? from + durationInFrames - 1 : 0;
  const isFreezingActive = premountingActive || postmountingActive;
  const style2 = reactExports.useMemo(() => {
    return {
      ...passedStyle,
      opacity: premountingActive || postmountingActive ? 0 : 1,
      pointerEvents: premountingActive || postmountingActive ? "none" : passedStyle?.pointerEvents ?? void 0,
      ...premountingActive ? styleWhilePremounted : {},
      ...postmountingActive ? styleWhilePostmounted : {}
    };
  }, [
    passedStyle,
    premountingActive,
    postmountingActive,
    styleWhilePremounted,
    styleWhilePostmounted
  ]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Freeze, {
    frame: freezeFrame,
    active: isFreezingActive,
    children: /* @__PURE__ */ jsxRuntimeExports.jsx(SequenceInner, {
      ref,
      from,
      durationInFrames,
      style: style2,
      _remotionInternalPremountDisplay: premountFor,
      _remotionInternalPostmountDisplay: postmountFor,
      _remotionInternalIsPremounting: premountingActive,
      _remotionInternalIsPostmounting: postmountingActive,
      ...otherProps
    })
  });
};
var PremountedPostmountedSequence = reactExports.forwardRef(PremountedPostmountedSequenceRefForwardingFunction);
var SequenceRefForwardingFunction = (props, ref) => {
  const env = useRemotionEnvironment();
  const { fps } = useVideoConfig();
  if (props.layout !== "none" && !env.isRendering) {
    const effectivePremountFor = props.premountFor;
    if (effectivePremountFor || props.postmountFor) {
      return /* @__PURE__ */ jsxRuntimeExports.jsx(PremountedPostmountedSequence, {
        ref,
        ...props,
        premountFor: effectivePremountFor
      });
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(RegularSequence, {
    ...props,
    ref
  });
};
var SequenceInner = reactExports.forwardRef(SequenceRefForwardingFunction);
var Sequence = wrapInSchema(SequenceInner, sequenceSchema);
var calcArgs = (fit, frameSize, canvasSize) => {
  switch (fit) {
    case "fill": {
      return [
        0,
        0,
        frameSize.width,
        frameSize.height,
        0,
        0,
        canvasSize.width,
        canvasSize.height
      ];
    }
    case "contain": {
      const ratio = Math.min(canvasSize.width / frameSize.width, canvasSize.height / frameSize.height);
      const centerX = (canvasSize.width - frameSize.width * ratio) / 2;
      const centerY = (canvasSize.height - frameSize.height * ratio) / 2;
      return [
        0,
        0,
        frameSize.width,
        frameSize.height,
        centerX,
        centerY,
        frameSize.width * ratio,
        frameSize.height * ratio
      ];
    }
    case "cover": {
      const ratio = Math.max(canvasSize.width / frameSize.width, canvasSize.height / frameSize.height);
      const centerX = (canvasSize.width - frameSize.width * ratio) / 2;
      const centerY = (canvasSize.height - frameSize.height * ratio) / 2;
      return [
        0,
        0,
        frameSize.width,
        frameSize.height,
        centerX,
        centerY,
        frameSize.width * ratio,
        frameSize.height * ratio
      ];
    }
    default:
      throw new Error("Unknown fit: " + fit);
  }
};
var CanvasRefForwardingFunction = ({ width, height, fit, className: className2, style: style2 }, ref) => {
  const canvasRef = reactExports.useRef(null);
  const draw = reactExports.useCallback((imageData) => {
    const canvas = canvasRef.current;
    const canvasWidth = width ?? imageData.displayWidth;
    const canvasHeight = height ?? imageData.displayHeight;
    if (!canvas) {
      throw new Error("Canvas ref is not set");
    }
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) {
      throw new Error("Could not get 2d context");
    }
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    ctx.drawImage(imageData, ...calcArgs(fit, {
      height: imageData.displayHeight,
      width: imageData.displayWidth
    }, {
      width: canvasWidth,
      height: canvasHeight
    }));
  }, [fit, height, width]);
  reactExports.useImperativeHandle(ref, () => {
    return {
      draw,
      getCanvas: () => {
        if (!canvasRef.current) {
          throw new Error("Canvas ref is not set");
        }
        return canvasRef.current;
      },
      clear: () => {
        const ctx = canvasRef.current?.getContext("2d");
        if (!ctx) {
          throw new Error("Could not get 2d context");
        }
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
    };
  }, [draw]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("canvas", {
    ref: canvasRef,
    className: className2,
    style: style2
  });
};
var Canvas = React.forwardRef(CanvasRefForwardingFunction);
var CACHE_SIZE = 5;
var getActualTime = ({
  loopBehavior,
  durationFound,
  timeInSec
}) => {
  return loopBehavior === "loop" ? durationFound ? timeInSec % durationFound : timeInSec : Math.min(timeInSec, durationFound || Infinity);
};
var decodeImage = async ({
  resolvedSrc,
  signal,
  currentTime,
  initialLoopBehavior
}) => {
  if (typeof ImageDecoder === "undefined") {
    throw new Error("Your browser does not support the WebCodecs ImageDecoder API.");
  }
  const res = await fetch(resolvedSrc, { signal });
  const { body } = res;
  if (!body) {
    throw new Error("Got no body");
  }
  const decoder = new ImageDecoder({
    data: body,
    type: res.headers.get("Content-Type") || "image/gif"
  });
  await decoder.completed;
  const { selectedTrack } = decoder.tracks;
  if (!selectedTrack) {
    throw new Error("No selected track");
  }
  const cache2 = [];
  let durationFound = null;
  const getFrameByIndex = async (frameIndex) => {
    const foundInCache = cache2.find((c2) => c2.frameIndex === frameIndex);
    if (foundInCache && foundInCache.frame) {
      return foundInCache;
    }
    const frame = await decoder.decode({
      frameIndex,
      completeFramesOnly: true
    });
    if (foundInCache) {
      foundInCache.frame = frame.image;
    } else {
      cache2.push({
        frame: frame.image,
        frameIndex,
        timeInSeconds: frame.image.timestamp / 1e6
      });
    }
    return {
      frame: frame.image,
      frameIndex,
      timeInSeconds: frame.image.timestamp / 1e6
    };
  };
  const clearCache = (closeToTimeInSec) => {
    const itemsInCache = cache2.filter((c2) => c2.frame);
    const sortByClosestToCurrentTime = itemsInCache.sort((a2, b2) => {
      const aDiff = Math.abs(a2.timeInSeconds - closeToTimeInSec);
      const bDiff = Math.abs(b2.timeInSeconds - closeToTimeInSec);
      return aDiff - bDiff;
    });
    for (let i = 0; i < sortByClosestToCurrentTime.length; i++) {
      if (i < CACHE_SIZE) {
        continue;
      }
      const item = sortByClosestToCurrentTime[i];
      item.frame = null;
    }
  };
  const ensureFrameBeforeAndAfter = async ({
    timeInSec,
    loopBehavior
  }) => {
    const actualTimeInSec = getActualTime({
      durationFound,
      loopBehavior,
      timeInSec
    });
    const framesBefore = cache2.filter((c2) => c2.timeInSeconds <= actualTimeInSec);
    const biggestIndex = framesBefore.map((c2) => c2.frameIndex).reduce((a2, b2) => Math.max(a2, b2), 0);
    let i = biggestIndex;
    while (true) {
      const f = await getFrameByIndex(i);
      i++;
      if (!f.frame) {
        throw new Error("No frame found");
      }
      if (!f.frame.duration) {
        break;
      }
      if (i === selectedTrack.frameCount && durationFound === null) {
        const duration = (f.frame.timestamp + f.frame.duration) / 1e6;
        durationFound = duration;
      }
      if (f.timeInSeconds > actualTimeInSec || i === selectedTrack.frameCount) {
        break;
      }
    }
    if (selectedTrack.frameCount - biggestIndex < 3 && loopBehavior === "loop") {
      await getFrameByIndex(0);
    }
    clearCache(actualTimeInSec);
  };
  await ensureFrameBeforeAndAfter({
    timeInSec: currentTime,
    loopBehavior: initialLoopBehavior
  });
  await ensureFrameBeforeAndAfter({
    timeInSec: currentTime,
    loopBehavior: initialLoopBehavior
  });
  const getFrame = async (timeInSec, loopBehavior) => {
    if (durationFound !== null && timeInSec > durationFound && loopBehavior === "clear-after-finish") {
      return null;
    }
    const actualTimeInSec = getActualTime({
      loopBehavior,
      durationFound,
      timeInSec
    });
    await ensureFrameBeforeAndAfter({ timeInSec: actualTimeInSec, loopBehavior });
    const itemsInCache = cache2.filter((c2) => c2.frame);
    const closest = itemsInCache.reduce((a2, b2) => {
      const aDiff = Math.abs(a2.timeInSeconds - actualTimeInSec);
      const bDiff = Math.abs(b2.timeInSeconds - actualTimeInSec);
      return aDiff < bDiff ? a2 : b2;
    });
    if (!closest.frame) {
      throw new Error("No frame found");
    }
    return closest;
  };
  return {
    getFrame,
    frameCount: selectedTrack.frameCount
  };
};
var resolveAnimatedImageSource = (src) => {
  if (typeof window === "undefined") {
    return src;
  }
  return new URL(src, window.origin).href;
};
reactExports.forwardRef(({
  src,
  width,
  height,
  onError,
  loopBehavior = "loop",
  playbackRate = 1,
  fit = "fill",
  ...props
}, canvasRef) => {
  const mountState = reactExports.useRef({ isMounted: true });
  reactExports.useEffect(() => {
    const { current } = mountState;
    current.isMounted = true;
    return () => {
      current.isMounted = false;
    };
  }, []);
  const resolvedSrc = resolveAnimatedImageSource(src);
  const [imageDecoder, setImageDecoder] = reactExports.useState(null);
  const { delayRender: delayRender2, continueRender: continueRender2 } = useDelayRender();
  const [decodeHandle] = reactExports.useState(() => delayRender2(`Rendering <AnimatedImage/> with src="${resolvedSrc}"`));
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const currentTime = frame / playbackRate / fps;
  const currentTimeRef = reactExports.useRef(currentTime);
  currentTimeRef.current = currentTime;
  const ref = reactExports.useRef(null);
  reactExports.useImperativeHandle(canvasRef, () => {
    const c2 = ref.current?.getCanvas();
    if (!c2) {
      throw new Error("Canvas ref is not set");
    }
    return c2;
  }, []);
  const [initialLoopBehavior] = reactExports.useState(() => loopBehavior);
  reactExports.useEffect(() => {
    const controller = new AbortController();
    decodeImage({
      resolvedSrc,
      signal: controller.signal,
      currentTime: currentTimeRef.current,
      initialLoopBehavior
    }).then((d) => {
      setImageDecoder(d);
      continueRender2(decodeHandle);
    }).catch((err) => {
      if (err.name === "AbortError") {
        continueRender2(decodeHandle);
        return;
      }
      if (onError) {
        onError?.(err);
        continueRender2(decodeHandle);
      } else {
        cancelRender(err);
      }
    });
    return () => {
      controller.abort();
    };
  }, [
    resolvedSrc,
    decodeHandle,
    onError,
    initialLoopBehavior,
    continueRender2
  ]);
  reactExports.useLayoutEffect(() => {
    if (!imageDecoder) {
      return;
    }
    const delay2 = delayRender2(`Rendering frame at ${currentTime} of <AnimatedImage src="${src}"/>`);
    imageDecoder.getFrame(currentTime, loopBehavior).then((videoFrame) => {
      if (mountState.current.isMounted) {
        if (videoFrame === null) {
          ref.current?.clear();
        } else {
          ref.current?.draw(videoFrame.frame);
        }
      }
      continueRender2(delay2);
    }).catch((err) => {
      if (onError) {
        onError(err);
        continueRender2(delay2);
      } else {
        cancelRender(err);
      }
    });
  }, [
    currentTime,
    imageDecoder,
    loopBehavior,
    onError,
    src,
    continueRender2,
    delayRender2
  ]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Canvas, {
    ref,
    width,
    height,
    fit,
    ...props
  });
});
var cachedSupport = null;
var isHtmlInCanvasSupported = () => {
  if (cachedSupport !== null) {
    return cachedSupport;
  }
  if (typeof document === "undefined") {
    return false;
  }
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  cachedSupport = typeof ctx?.drawElementImage === "function" && typeof canvas.requestPaint === "function" && typeof canvas.captureElementImage === "function";
  return cachedSupport;
};
function assertHtmlInCanvasDimensions(width, height) {
  if (typeof width !== "number" || typeof height !== "number") {
    throw new Error(`HtmlInCanvas: \`width\` and \`height\` must be numbers. Received width=${String(width)}, height=${String(height)}.`);
  }
  if (!Number.isInteger(width) || width <= 0) {
    throw new Error(`HtmlInCanvas: \`width\` must be a positive integer. Received: ${String(width)}.`);
  }
  if (!Number.isInteger(height) || height <= 0) {
    throw new Error(`HtmlInCanvas: \`height\` must be a positive integer. Received: ${String(height)}.`);
  }
}
var defaultOnPaint = ({
  canvas,
  element,
  elementImage
}) => {
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Failed to acquire 2D context for <HtmlInCanvas> canvas");
  }
  ctx.reset();
  const transform = ctx.drawElementImage(elementImage, 0, 0);
  element.style.transform = transform.toString();
};
var HtmlInCanvasAncestorContext = reactExports.createContext(false);
var HtmlInCanvasInner = reactExports.forwardRef(({
  width,
  height,
  _experimentalEffects: effects = [],
  children,
  onPaint,
  onInit,
  _experimentalControls: controls,
  style: style2,
  durationInFrames,
  ...sequenceProps
}, ref) => {
  const isInsideAncestorHtmlInCanvas = reactExports.useContext(HtmlInCanvasAncestorContext);
  assertHtmlInCanvasDimensions(width, height);
  const { continueRender: continueRender2, cancelRender: cancelRender2 } = useDelayRender();
  if (!isHtmlInCanvasSupported()) {
    cancelRender2(new Error("HTML in Canvas is not supported. Open this page in Chrome Canary with chrome://flags/#canvas-draw-element enabled."));
  }
  const { durationInFrames: videoDuration } = useVideoConfig();
  const resolvedDuration = durationInFrames ?? videoDuration;
  const frame = useCurrentFrame();
  const canvas2dRef = reactExports.useRef(null);
  const divRef = reactExports.useRef(null);
  const setLayoutCanvasRef = reactExports.useCallback((node) => {
    canvas2dRef.current = node;
    if (typeof ref === "function") {
      ref(node);
    } else if (ref) {
      ref.current = node;
    }
  }, [ref]);
  const [offscreenCanvas] = reactExports.useState(() => new OffscreenCanvas(1, 1));
  const chainState = useEffectChainState();
  const memoizedEffects = useMemoizedEffects(flattenEffects(effects));
  const effectsRef = reactExports.useRef(memoizedEffects);
  effectsRef.current = memoizedEffects;
  const frameRef = reactExports.useRef(frame);
  frameRef.current = frame;
  const onPaintRef = reactExports.useRef(onPaint);
  onPaintRef.current = onPaint;
  const onInitRef = reactExports.useRef(onInit);
  onInitRef.current = onInit;
  const initializedRef = reactExports.useRef(false);
  const onInitCleanupRef = reactExports.useRef(null);
  const unmountedRef = reactExports.useRef(false);
  const onPaintCb = reactExports.useCallback(async () => {
    const element = divRef.current;
    if (!element) {
      throw new Error("Canvas or scene element not found");
    }
    offscreenCanvas.width = width;
    offscreenCanvas.height = height;
    try {
      const layoutCanvas = canvas2dRef.current;
      if (!layoutCanvas) {
        throw new Error("Canvas not found");
      }
      const layout2d = layoutCanvas.getContext("2d");
      if (!layout2d) {
        throw new Error("Failed to acquire 2D context for <HtmlInCanvas> layout canvas");
      }
      const handle = delayRender("onPaint");
      if (!initializedRef.current) {
        initializedRef.current = true;
        const initImage = layoutCanvas.captureElementImage(element);
        const currentOnInit = onInitRef.current;
        if (currentOnInit) {
          const cleanup = await currentOnInit({
            canvas: offscreenCanvas,
            element,
            elementImage: initImage
          });
          if (typeof cleanup !== "function") {
            throw new Error("HtmlInCanvas: when `onInit` is provided, it must return a cleanup function, or a Promise that resolves to one.");
          }
          if (unmountedRef.current) {
            cleanup();
          } else {
            onInitCleanupRef.current = cleanup;
          }
        }
      }
      const handler = onPaintRef.current ?? defaultOnPaint;
      const elImage = layoutCanvas.captureElementImage(element);
      await handler({
        canvas: offscreenCanvas,
        element,
        elementImage: elImage
      });
      await runEffectChain({
        state: chainState.get(width, height),
        source: offscreenCanvas,
        effects: effectsRef.current,
        output: canvas2dRef.current,
        frame: frameRef.current,
        width,
        height
      });
      continueRender2(handle);
    } catch (error2) {
      cancelRender2(error2);
    }
  }, [
    chainState,
    continueRender2,
    cancelRender2,
    width,
    height,
    offscreenCanvas
  ]);
  reactExports.useLayoutEffect(() => {
    const canvas = canvas2dRef.current;
    if (!canvas) {
      throw new Error("Canvas not found");
    }
    canvas.layoutSubtree = true;
    canvas.addEventListener("paint", onPaintCb);
    return () => {
      canvas.removeEventListener("paint", onPaintCb);
      unmountedRef.current = true;
      onInitCleanupRef.current?.();
      onInitCleanupRef.current = null;
    };
  }, [onPaintCb, cancelRender2]);
  const onPaintChangedRef = reactExports.useRef(false);
  reactExports.useLayoutEffect(() => {
    if (!onPaintChangedRef.current) {
      onPaintChangedRef.current = true;
      return;
    }
    const canvas = canvas2dRef.current;
    if (!canvas) {
      return;
    }
    canvas.requestPaint?.();
  }, [onPaint, memoizedEffects]);
  reactExports.useLayoutEffect(() => {
    const canvas = canvas2dRef.current;
    if (!canvas) {
      return;
    }
    const handle = delayRender("waiting for first paint after canvas resize");
    canvas.addEventListener("paint", () => {
      continueRender2(handle);
    }, { once: true });
    return () => {
      continueRender2(handle);
    };
  }, [width, height, continueRender2]);
  const innerStyle = reactExports.useMemo(() => {
    return {
      width,
      height
    };
  }, [width, height]);
  if (isInsideAncestorHtmlInCanvas) {
    throw new Error("<HtmlInCanvas> effects cannot be nested together. Chrome will only display the outer effect. Consider merging the effects into one if you can.");
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Sequence, {
    durationInFrames: resolvedDuration,
    name: "<HtmlInCanvas>",
    _experimentalControls: controls,
    _experimentalEffects: memoizedEffects,
    layout: "none",
    ...sequenceProps,
    children: /* @__PURE__ */ jsxRuntimeExports.jsx(HtmlInCanvasAncestorContext.Provider, {
      value: true,
      children: /* @__PURE__ */ jsxRuntimeExports.jsx("canvas", {
        ref: setLayoutCanvasRef,
        width,
        height,
        style: style2,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
          ref: divRef,
          style: innerStyle,
          children
        })
      })
    })
  });
});
HtmlInCanvasInner.displayName = "HtmlInCanvas";
var HtmlInCanvasWrapped = wrapInSchema(HtmlInCanvasInner, sequenceStyleSchema);
var HtmlInCanvas = Object.assign(HtmlInCanvasWrapped, {
  isSupported: isHtmlInCanvasSupported
});
HtmlInCanvas.displayName = "HtmlInCanvas";
addSequenceStackTraces(HtmlInCanvas);
var validateArtifactFilename = (filename) => {
  if (typeof filename !== "string") {
    throw new TypeError(`The "filename" must be a string, but you passed a value of type ${typeof filename}`);
  }
  if (filename.trim() === "") {
    throw new Error("The `filename` must not be empty");
  }
  if (!filename.match(/^([0-9a-zA-Z-!_.*'()/:&$@=;+,?]+)/g)) {
    throw new Error('The `filename` must match "/^([0-9a-zA-Z-!_.*\'()/:&$@=;+,?]+)/g". Use forward slashes only, even on Windows.');
  }
};
var validateContent = (content) => {
  if (typeof content !== "string" && !(content instanceof Uint8Array)) {
    throw new TypeError(`The "content" must be a string or Uint8Array, but you passed a value of type ${typeof content}`);
  }
  if (typeof content === "string" && content.trim() === "") {
    throw new Error("The `content` must not be empty");
  }
};
var validateRenderAsset = (artifact) => {
  if (artifact.type !== "artifact") {
    return;
  }
  validateArtifactFilename(artifact.filename);
  if (artifact.contentType === "thumbnail") {
    return;
  }
  validateContent(artifact.content);
};
var RenderAssetManager = reactExports.createContext({
  registerRenderAsset: () => {
    return;
  },
  unregisterRenderAsset: () => {
    return;
  },
  renderAssets: []
});
var RenderAssetManagerProvider = ({ children, collectAssets }) => {
  const [renderAssets, setRenderAssets] = reactExports.useState([]);
  const renderAssetsRef = reactExports.useRef([]);
  const registerRenderAsset = reactExports.useCallback((renderAsset) => {
    validateRenderAsset(renderAsset);
    renderAssetsRef.current = [...renderAssetsRef.current, renderAsset];
    setRenderAssets(renderAssetsRef.current);
  }, []);
  if (collectAssets) {
    reactExports.useImperativeHandle(collectAssets, () => {
      return {
        collectAssets: () => {
          const assets = renderAssetsRef.current;
          renderAssetsRef.current = [];
          setRenderAssets([]);
          return assets;
        }
      };
    }, []);
  }
  const unregisterRenderAsset = reactExports.useCallback((id) => {
    renderAssetsRef.current = renderAssetsRef.current.filter((a2) => a2.id !== id);
    setRenderAssets(renderAssetsRef.current);
  }, []);
  reactExports.useLayoutEffect(() => {
    if (typeof window !== "undefined") {
      window.remotion_collectAssets = () => {
        const assets = renderAssetsRef.current;
        renderAssetsRef.current = [];
        setRenderAssets([]);
        return assets;
      };
    }
  }, []);
  const contextValue = reactExports.useMemo(() => {
    return {
      registerRenderAsset,
      unregisterRenderAsset,
      renderAssets
    };
  }, [renderAssets, registerRenderAsset, unregisterRenderAsset]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(RenderAssetManager.Provider, {
    value: contextValue,
    children
  });
};
var getAbsoluteSrc = (relativeSrc) => {
  if (typeof window === "undefined") {
    return relativeSrc;
  }
  if (relativeSrc.startsWith("http://") || relativeSrc.startsWith("https://") || relativeSrc.startsWith("file://") || relativeSrc.startsWith("blob:") || relativeSrc.startsWith("data:")) {
    return relativeSrc;
  }
  return new URL(relativeSrc, window.origin).href;
};
var calculateMediaDuration = ({
  trimAfter,
  mediaDurationInFrames,
  playbackRate,
  trimBefore
}) => {
  let duration = mediaDurationInFrames;
  if (typeof trimAfter !== "undefined") {
    duration = trimAfter;
  }
  if (typeof trimBefore !== "undefined") {
    duration -= trimBefore;
  }
  const actualDuration = duration / playbackRate;
  return Math.floor(actualDuration);
};
var LoopContext = reactExports.createContext(null);
var useLoop = () => {
  return React.useContext(LoopContext);
};
var Loop = ({
  durationInFrames,
  times = Infinity,
  children,
  name,
  showInTimeline,
  ...props
}) => {
  const currentFrame = useCurrentFrame();
  const { durationInFrames: compDuration } = useVideoConfig();
  validateDurationInFrames$2(durationInFrames, {
    component: "of the <Loop /> component",
    allowFloats: true
  });
  if (typeof times !== "number") {
    throw new TypeError(`You passed to "times" an argument of type ${typeof times}, but it must be a number.`);
  }
  if (times !== Infinity && times % 1 !== 0) {
    throw new TypeError(`The "times" prop of a loop must be an integer, but got ${times}.`);
  }
  if (times < 0) {
    throw new TypeError(`The "times" prop of a loop must be at least 0, but got ${times}`);
  }
  const maxTimes = Math.ceil(compDuration / durationInFrames);
  const actualTimes = Math.min(maxTimes, times);
  const style2 = props.layout === "none" ? void 0 : props.style;
  const maxFrame = durationInFrames * (actualTimes - 1);
  const iteration = Math.floor(currentFrame / durationInFrames);
  const start = iteration * durationInFrames;
  const from = Math.min(start, maxFrame);
  const loopDisplay = reactExports.useMemo(() => {
    return {
      numberOfTimes: Math.min(compDuration / durationInFrames, times),
      startOffset: -from,
      durationInFrames
    };
  }, [compDuration, durationInFrames, from, times]);
  const loopContext = reactExports.useMemo(() => {
    return {
      iteration: Math.floor(currentFrame / durationInFrames),
      durationInFrames
    };
  }, [currentFrame, durationInFrames]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(LoopContext.Provider, {
    value: loopContext,
    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Sequence, {
      durationInFrames,
      from,
      name: name ?? "<Loop>",
      _remotionInternalLoopDisplay: loopDisplay,
      layout: props.layout,
      style: style2,
      showInTimeline,
      children
    })
  });
};
Loop.useLoop = useLoop;
var playbackLogging = ({
  logLevel,
  tag,
  message,
  mountTime
}) => {
  const tags = [mountTime ? Date.now() - mountTime + "ms " : null, tag].filter(Boolean).join(" ");
  Log.trace({ logLevel, tag: null }, `[${tags}]`, message);
};
var PreloadContext = reactExports.createContext({});
var preloads = {};
var updaters = [];
var PrefetchProvider = ({ children }) => {
  const [_preloads, _setPreloads] = reactExports.useState(() => preloads);
  reactExports.useEffect(() => {
    const updaterFunction = () => {
      _setPreloads(preloads);
    };
    updaters.push(updaterFunction);
    return () => {
      updaters = updaters.filter((u) => u !== updaterFunction);
    };
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(PreloadContext.Provider, {
    value: _preloads,
    children
  });
};
var removeAndGetHashFragment = (src) => {
  const hashIndex = src.indexOf("#");
  if (hashIndex === -1) {
    return null;
  }
  return hashIndex;
};
var getSrcWithoutHash = (src) => {
  const hashIndex = removeAndGetHashFragment(src);
  if (hashIndex === null) {
    return src;
  }
  return src.slice(0, hashIndex);
};
var usePreload = (src) => {
  const preloads2 = reactExports.useContext(PreloadContext);
  const hashFragmentIndex = removeAndGetHashFragment(src);
  const withoutHashFragment = getSrcWithoutHash(src);
  if (!preloads2[withoutHashFragment]) {
    return src;
  }
  if (hashFragmentIndex !== null) {
    return preloads2[withoutHashFragment] + src.slice(hashFragmentIndex);
  }
  return preloads2[withoutHashFragment];
};
var validateMediaProps = (props, component) => {
  if (typeof props.volume !== "number" && typeof props.volume !== "function" && typeof props.volume !== "undefined") {
    throw new TypeError(`You have passed a volume of type ${typeof props.volume} to your <${component} /> component. Volume must be a number or a function with the signature '(frame: number) => number' undefined.`);
  }
  if (typeof props.volume === "number" && props.volume < 0) {
    throw new TypeError(`You have passed a volume below 0 to your <${component} /> component. Volume must be between 0 and 1`);
  }
  if (typeof props.playbackRate !== "number" && typeof props.playbackRate !== "undefined") {
    throw new TypeError(`You have passed a playbackRate of type ${typeof props.playbackRate} to your <${component} /> component. Playback rate must a real number or undefined.`);
  }
  if (typeof props.playbackRate === "number" && (isNaN(props.playbackRate) || !Number.isFinite(props.playbackRate) || props.playbackRate <= 0)) {
    throw new TypeError(`You have passed a playbackRate of ${props.playbackRate} to your <${component} /> component. Playback rate must be a real number above 0.`);
  }
};
var validateStartFromProps = (startFrom, endAt) => {
  if (typeof startFrom !== "undefined") {
    if (typeof startFrom !== "number") {
      throw new TypeError(`type of startFrom prop must be a number, instead got type ${typeof startFrom}.`);
    }
    if (isNaN(startFrom) || startFrom === Infinity) {
      throw new TypeError("startFrom prop can not be NaN or Infinity.");
    }
    if (startFrom < 0) {
      throw new TypeError(`startFrom must be greater than equal to 0 instead got ${startFrom}.`);
    }
  }
  if (typeof endAt !== "undefined") {
    if (typeof endAt !== "number") {
      throw new TypeError(`type of endAt prop must be a number, instead got type ${typeof endAt}.`);
    }
    if (isNaN(endAt)) {
      throw new TypeError("endAt prop can not be NaN.");
    }
    if (endAt <= 0) {
      throw new TypeError(`endAt must be a positive number, instead got ${endAt}.`);
    }
  }
  if (endAt < startFrom) {
    throw new TypeError("endAt prop must be greater than startFrom prop.");
  }
};
var validateTrimProps = (trimBefore, trimAfter) => {
  if (typeof trimBefore !== "undefined") {
    if (typeof trimBefore !== "number") {
      throw new TypeError(`type of trimBefore prop must be a number, instead got type ${typeof trimBefore}.`);
    }
    if (isNaN(trimBefore) || trimBefore === Infinity) {
      throw new TypeError("trimBefore prop can not be NaN or Infinity.");
    }
    if (trimBefore < 0) {
      throw new TypeError(`trimBefore must be greater than equal to 0 instead got ${trimBefore}.`);
    }
  }
  if (typeof trimAfter !== "undefined") {
    if (typeof trimAfter !== "number") {
      throw new TypeError(`type of trimAfter prop must be a number, instead got type ${typeof trimAfter}.`);
    }
    if (isNaN(trimAfter)) {
      throw new TypeError("trimAfter prop can not be NaN.");
    }
    if (trimAfter <= 0) {
      throw new TypeError(`trimAfter must be a positive number, instead got ${trimAfter}.`);
    }
  }
  if (trimAfter <= trimBefore) {
    throw new TypeError("trimAfter prop must be greater than trimBefore prop.");
  }
};
var validateMediaTrimProps = ({
  startFrom,
  endAt,
  trimBefore,
  trimAfter
}) => {
  if (typeof startFrom !== "undefined" && typeof trimBefore !== "undefined") {
    throw new TypeError("Cannot use both startFrom and trimBefore props. Use trimBefore instead as startFrom is deprecated.");
  }
  if (typeof endAt !== "undefined" && typeof trimAfter !== "undefined") {
    throw new TypeError("Cannot use both endAt and trimAfter props. Use trimAfter instead as endAt is deprecated.");
  }
  const hasNewProps = typeof trimBefore !== "undefined" || typeof trimAfter !== "undefined";
  const hasOldProps = typeof startFrom !== "undefined" || typeof endAt !== "undefined";
  if (hasNewProps) {
    validateTrimProps(trimBefore, trimAfter);
  } else if (hasOldProps) {
    validateStartFromProps(startFrom, endAt);
  }
};
var resolveTrimProps = ({
  startFrom,
  endAt,
  trimBefore,
  trimAfter
}) => {
  const trimBeforeValue = trimBefore ?? startFrom ?? void 0;
  const trimAfterValue = trimAfter ?? endAt ?? void 0;
  return { trimBeforeValue, trimAfterValue };
};
var durationReducer = (state, action) => {
  switch (action.type) {
    case "got-duration": {
      const absoluteSrc = getAbsoluteSrc(action.src);
      if (state[absoluteSrc] === action.durationInSeconds) {
        return state;
      }
      return {
        ...state,
        [absoluteSrc]: action.durationInSeconds
      };
    }
    default:
      return state;
  }
};
var DurationsContext = reactExports.createContext({
  durations: {},
  setDurations: () => {
    throw new Error("context missing");
  }
});
var DurationsContextProvider = ({ children }) => {
  const [durations, setDurations] = reactExports.useReducer(durationReducer, {});
  const value = reactExports.useMemo(() => {
    return {
      durations,
      setDurations
    };
  }, [durations]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(DurationsContext.Provider, {
    value,
    children
  });
};
var getCrossOriginValue = ({
  crossOrigin,
  requestsVideoFrame,
  isClientSideRendering
}) => {
  if (crossOrigin !== void 0 && crossOrigin !== null) {
    return crossOrigin;
  }
  if (isClientSideRendering) {
    return "anonymous";
  }
  if (requestsVideoFrame) {
    return "anonymous";
  }
  return;
};
var playAndHandleNotAllowedError = ({
  mediaRef,
  mediaType,
  onAutoPlayError,
  logLevel,
  mountTime,
  reason,
  isPlayer
}) => {
  const { current } = mediaRef;
  if (!current) {
    return;
  }
  playbackLogging({
    logLevel,
    tag: "play",
    message: `Attempting to play ${current.src}. Reason: ${reason}`,
    mountTime
  });
  const prom = current.play();
  if (!prom.catch) {
    return;
  }
  prom.catch((err) => {
    if (!current) {
      return;
    }
    if (err.message.includes("request was interrupted by a call to pause")) {
      return;
    }
    if (err.message.includes("The operation was aborted.")) {
      return;
    }
    if (err.message.includes("The fetching process for the media resource was aborted by the user agent")) {
      return;
    }
    if (err.message.includes("request was interrupted by a new load request")) {
      return;
    }
    if (err.message.includes("because the media was removed from the document")) {
      return;
    }
    if (err.message.includes("user didn't interact with the document") && current.muted) {
      return;
    }
    console.log(`Could not play ${mediaType} due to following error: `, err);
    if (!current.muted) {
      if (onAutoPlayError) {
        onAutoPlayError();
        return;
      }
      if (mediaType === "video" && isPlayer) {
        Log.info({ logLevel, tag: "<" + mediaType + ">" }, `The video will be muted and we'll retry playing it.`);
        Log.info({ logLevel, tag: "<" + mediaType + ">" }, "Use onAutoPlayError() to handle this error yourself.");
        current.muted = true;
        current.play();
      }
    }
  });
};
var makeSharedElementSourceNode = ({
  audioContext,
  ref
}) => {
  let connected = null;
  let disposed = false;
  return {
    attemptToConnect: () => {
      if (disposed) {
        throw new Error("SharedElementSourceNode has been disposed");
      }
      if (!connected && ref.current) {
        const mediaElementSourceNode = audioContext.createMediaElementSource(ref.current);
        connected = mediaElementSourceNode;
      }
    },
    get: () => {
      if (!connected) {
        throw new Error("Audio element not connected");
      }
      return connected;
    },
    cleanup: () => {
      if (connected) {
        connected.disconnect();
        connected = null;
      }
      disposed = true;
    }
  };
};
var warned = false;
var warnOnce = (logLevel) => {
  if (warned) {
    return;
  }
  warned = true;
  if (typeof window !== "undefined") {
    Log.warn({ logLevel, tag: null }, "AudioContext is not supported in this browser");
  }
};
var useSingletonAudioContext = ({
  logLevel,
  latencyHint,
  audioEnabled
}) => {
  const env = useRemotionEnvironment();
  const context = reactExports.useMemo(() => {
    if (env.isRendering) {
      return null;
    }
    if (!audioEnabled) {
      return null;
    }
    if (typeof AudioContext === "undefined") {
      warnOnce(logLevel);
      return null;
    }
    const audioContext = new AudioContext({
      latencyHint,
      sampleRate: 48e3
    });
    const gainNode = audioContext.createGain();
    gainNode.connect(audioContext.destination);
    Log.trace({ logLevel, tag: "audio" }, "Creating new audio context");
    audioContext.suspend();
    return {
      audioContext,
      gainNode
    };
  }, [logLevel, latencyHint, env.isRendering, audioEnabled]);
  return context;
};
var waitUntilActuallyResumed = (audioContext, logLevel) => {
  return new Promise((resolve) => {
    const startCurrentTime = audioContext.currentTime;
    const start = audioContext.getOutputTimestamp();
    const startOutputPerformanceTime = start.performanceTime;
    const startWallClock = performance.now();
    const check = () => {
      const { currentTime } = audioContext;
      const outputTimestamp = audioContext.getOutputTimestamp();
      const elapsedWallClock = performance.now() - startWallClock;
      if (startOutputPerformanceTime !== void 0 && outputTimestamp.performanceTime !== void 0 && outputTimestamp.performanceTime > startOutputPerformanceTime && outputTimestamp.contextTime !== void 0 && outputTimestamp.contextTime > startCurrentTime) {
        Log.verbose({ logLevel, tag: "audio" }, `waitUntilActuallyResumed: getOutputTimestamp.performanceTime advanced from ${startOutputPerformanceTime.toFixed(6)} to ${outputTimestamp.performanceTime.toFixed(6)} after ${elapsedWallClock.toFixed(1)}ms. currentTime=${currentTime.toFixed(6)} (advanced by ${(currentTime - startCurrentTime).toFixed(6)}), getOutputTimestamp.performanceTime=${outputTimestamp.performanceTime?.toFixed(1) ?? "undefined"}`);
        resolve();
        return;
      }
      requestAnimationFrame(check);
    };
    requestAnimationFrame(check);
  });
};
var EMPTY_AUDIO = "data:audio/mp3;base64,/+MYxAAJcAV8AAgAABn//////+/gQ5BAMA+D4Pg+BAQBAEAwD4Pg+D4EBAEAQDAPg++hYBH///hUFQVBUFREDQNHmf///////+MYxBUGkAGIMAAAAP/29Xt6lUxBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV/+MYxDUAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV";
var compareProps = (obj1, obj2) => {
  const keysA = Object.keys(obj1).sort();
  const keysB = Object.keys(obj2).sort();
  if (keysA.length !== keysB.length) {
    return false;
  }
  for (let i = 0; i < keysA.length; i++) {
    if (keysA[i] !== keysB[i]) {
      return false;
    }
    if (obj1[keysA[i]] !== obj2[keysB[i]]) {
      return false;
    }
  }
  return true;
};
var didPropChange = (key, newProp, prevProp) => {
  if (key === "src" && !prevProp.startsWith("data:") && !newProp.startsWith("data:")) {
    return new URL(prevProp, window.origin).toString() !== new URL(newProp, window.origin).toString();
  }
  if (prevProp === newProp) {
    return false;
  }
  return true;
};
var SharedAudioContext = reactExports.createContext(null);
var SharedAudioTagsContext = reactExports.createContext(null);
var SharedAudioContextProvider = ({ children, audioLatencyHint, audioEnabled }) => {
  const logLevel = useLogLevel();
  const ctxAndGain = useSingletonAudioContext({
    logLevel,
    latencyHint: audioLatencyHint,
    audioEnabled
  });
  const audioContextIsPlayingEventually = reactExports.useRef(false);
  const isResuming = reactExports.useRef(null);
  const audioSyncAnchor = reactExports.useMemo(() => ({ value: 0 }), []);
  const audioSyncAnchorListeners = reactExports.useRef([]);
  const audioSyncAnchorEmitter = reactExports.useMemo(() => {
    return {
      dispatch: (event) => {
        audioSyncAnchorListeners.current.forEach((l) => l(event));
      },
      subscribe: (listener) => {
        audioSyncAnchorListeners.current.push(listener);
        return {
          remove: () => {
            audioSyncAnchorListeners.current = audioSyncAnchorListeners.current.filter((l) => l !== listener);
          }
        };
      }
    };
  }, []);
  const prevEndTimes = reactExports.useRef({ scheduledEndTime: null, mediaEndTime: null });
  const nodesToResume = reactExports.useRef(/* @__PURE__ */ new Map());
  const unscheduleAudioNode = reactExports.useCallback((node) => {
    nodesToResume.current.delete(node);
  }, []);
  const scheduleAudioNode = reactExports.useMemo(() => {
    return ({
      node,
      mediaTimestamp,
      currentTime,
      scheduledTime,
      duration,
      offset,
      originalUnloopedMediaTimestamp
    }) => {
      if (!ctxAndGain) {
        throw new Error("Audio context not found");
      }
      const saveForLater = ctxAndGain.audioContext.state === "suspended" && !isResuming.current;
      if (duration > 0) {
        if (saveForLater) {
          nodesToResume.current.set(node, {
            scheduledTime,
            offset,
            duration
          });
        } else {
          node.start(scheduledTime, offset, duration);
        }
      }
      const scheduledEndTime = scheduledTime + duration / node.playbackRate.value;
      const mediaTime = mediaTimestamp + offset;
      const mediaEndTime = mediaTime + duration;
      const latency = ctxAndGain.audioContext.baseLatency + ctxAndGain.audioContext.outputLatency;
      const timeDiff = scheduledTime - ctxAndGain.audioContext.currentTime;
      const prev = prevEndTimes.current;
      const scheduledMismatch = prev.scheduledEndTime !== null && Math.abs(scheduledTime - prev.scheduledEndTime) > 1e-3;
      const mediaMismatch = prev.mediaEndTime !== null && Math.abs(mediaTime - prev.mediaEndTime) > 1e-3;
      Log.verbose({ logLevel, tag: "audio-scheduling" }, "scheduled %c%s%c %s %c%s%c %s %c%s%c %s %s %s %s %s", scheduledMismatch ? "color: red; font-weight: bold" : "", scheduledTime.toFixed(4), "", scheduledEndTime.toFixed(4), mediaMismatch ? "color: red; font-weight: bold" : "", mediaTime.toFixed(4), "", mediaEndTime.toFixed(4), duration < 0 ? "color: red; font-weight: bold" : timeDiff < 0 ? "color: red; font-weight: bold" : "color: blue; font-weight: bold", duration < 0 ? "missed " + Math.abs(offset).toFixed(2) + "s" : Math.abs(timeDiff).toFixed(2) + (timeDiff < 0 ? " delay" : " ahead"), "", "current=" + currentTime.toFixed(4), "actualcurrent=" + ctxAndGain.audioContext.currentTime.toFixed(4), "offset=" + offset.toFixed(4), "latency=" + latency.toFixed(4), "state=" + ctxAndGain.audioContext.state, originalUnloopedMediaTimestamp !== mediaTime ? "original_ts=" + originalUnloopedMediaTimestamp.toFixed(4) : "", "action=" + (saveForLater ? "schedule" : "start"), "");
      prev.scheduledEndTime = scheduledEndTime;
      prev.mediaEndTime = mediaEndTime;
      return duration > 0 ? {
        type: "started",
        scheduledTime
      } : {
        type: "not-started",
        reason: "missed " + Math.abs(offset).toFixed(2) + "s"
      };
    };
  }, [ctxAndGain, logLevel]);
  const resume = reactExports.useCallback(() => {
    if (!ctxAndGain) {
      return Promise.resolve();
    }
    if (audioContextIsPlayingEventually.current) {
      return Promise.resolve();
    }
    audioContextIsPlayingEventually.current = true;
    ctxAndGain.gainNode.gain.cancelScheduledValues(ctxAndGain.audioContext.currentTime);
    ctxAndGain.gainNode.gain.setValueAtTime(0, ctxAndGain.audioContext.currentTime);
    ctxAndGain.gainNode.gain.linearRampToValueAtTime(1, ctxAndGain.audioContext.currentTime + 0.03);
    nodesToResume.current.forEach((r, node) => {
      node.start(r.scheduledTime, r.offset, r.duration);
    });
    nodesToResume.current.clear();
    const resumePromise = ctxAndGain.audioContext.resume();
    isResuming.current = new Promise((resolve) => {
      waitUntilActuallyResumed(ctxAndGain.audioContext, logLevel).then(resolve);
      resumePromise.catch((err) => {
        Log.warn({ logLevel, tag: "audio" }, "AudioContext resume rejected, continuing without audio sync", err);
        resolve();
      });
    }).finally(() => {
      isResuming.current = null;
    });
    return resumePromise.catch(() => {
    });
  }, [ctxAndGain, logLevel]);
  const getIsResumingAudioContext = reactExports.useCallback(() => {
    return isResuming.current;
  }, []);
  const suspend = reactExports.useCallback(() => {
    if (!ctxAndGain) {
      return;
    }
    if (!audioContextIsPlayingEventually.current) {
      return;
    }
    audioContextIsPlayingEventually.current = false;
    ctxAndGain.audioContext.suspend();
  }, [ctxAndGain]);
  const audioContextValue = reactExports.useMemo(() => {
    return {
      audioContext: ctxAndGain?.audioContext ?? null,
      gainNode: ctxAndGain?.gainNode ?? null,
      audioSyncAnchor,
      audioSyncAnchorEmitter,
      scheduleAudioNode,
      resume,
      suspend,
      getIsResumingAudioContext,
      unscheduleAudioNode
    };
  }, [
    ctxAndGain,
    audioSyncAnchor,
    audioSyncAnchorEmitter,
    scheduleAudioNode,
    resume,
    suspend,
    getIsResumingAudioContext,
    unscheduleAudioNode
  ]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(SharedAudioContext.Provider, {
    value: audioContextValue,
    children
  });
};
var SharedAudioTagsContextProvider = ({ children, numberOfAudioTags }) => {
  const audios = reactExports.useRef([]);
  const [initialNumberOfAudioTags] = reactExports.useState(numberOfAudioTags);
  if (numberOfAudioTags !== initialNumberOfAudioTags) {
    throw new Error("The number of shared audio tags has changed dynamically. Once you have set this property, you cannot change it afterwards.");
  }
  const logLevel = useLogLevel();
  const mountTime = useMountTime();
  const env = useRemotionEnvironment();
  const audioCtx = reactExports.useContext(SharedAudioContext);
  const audioContext = audioCtx?.audioContext ?? null;
  const resume = audioCtx?.resume;
  const refs = reactExports.useMemo(() => {
    return new Array(numberOfAudioTags).fill(true).map(() => {
      const ref = reactExports.createRef();
      return {
        id: Math.random(),
        ref,
        mediaElementSourceNode: audioContext ? makeSharedElementSourceNode({
          audioContext,
          ref
        }) : null
      };
    });
  }, [audioContext, numberOfAudioTags]);
  const effectToUse = React.useInsertionEffect ?? React.useLayoutEffect;
  effectToUse(() => {
    return () => {
      requestAnimationFrame(() => {
        refs.forEach(({ mediaElementSourceNode }) => {
          mediaElementSourceNode?.cleanup();
        });
      });
    };
  }, [refs]);
  const takenAudios = reactExports.useRef(new Array(numberOfAudioTags).fill(false));
  const rerenderAudios = reactExports.useCallback(() => {
    refs.forEach(({ ref, id }) => {
      const data = audios.current?.find((a2) => a2.id === id);
      const { current } = ref;
      if (!current) {
        return;
      }
      if (data === void 0) {
        current.src = EMPTY_AUDIO;
        return;
      }
      if (!data) {
        throw new TypeError("Expected audio data to be there");
      }
      Object.keys(data.props).forEach((key) => {
        if (didPropChange(key, data.props[key], current[key])) {
          current[key] = data.props[key];
        }
      });
    });
  }, [refs]);
  const registerAudio = reactExports.useCallback((options) => {
    const { aud, audioId, premounting, postmounting } = options;
    const found = audios.current?.find((a2) => a2.audioId === audioId);
    if (found) {
      return found;
    }
    const firstFreeAudio = takenAudios.current.findIndex((a2) => a2 === false);
    if (firstFreeAudio === -1) {
      throw new Error(`Tried to simultaneously mount ${numberOfAudioTags + 1} <Html5Audio /> tags at the same time. With the current settings, the maximum amount of <Html5Audio /> tags is limited to ${numberOfAudioTags} at the same time. Remotion pre-mounts silent audio tags to help avoid browser autoplay restrictions. See https://remotion.dev/docs/player/autoplay#using-the-numberofsharedaudiotags-prop for more information on how to increase this limit.`);
    }
    const { id, ref, mediaElementSourceNode } = refs[firstFreeAudio];
    const cloned = [...takenAudios.current];
    cloned[firstFreeAudio] = id;
    takenAudios.current = cloned;
    const newElem = {
      props: aud,
      id,
      el: ref,
      audioId,
      mediaElementSourceNode,
      premounting,
      audioMounted: Boolean(ref.current),
      postmounting,
      cleanupOnMediaTagUnmount: () => {
      }
    };
    audios.current?.push(newElem);
    rerenderAudios();
    return newElem;
  }, [numberOfAudioTags, refs, rerenderAudios]);
  const unregisterAudio = reactExports.useCallback((id) => {
    const cloned = [...takenAudios.current];
    const index = refs.findIndex((r) => r.id === id);
    if (index === -1) {
      throw new TypeError("Error occured in ");
    }
    cloned[index] = false;
    takenAudios.current = cloned;
    audios.current = audios.current?.filter((a2) => a2.id !== id);
    rerenderAudios();
  }, [refs, rerenderAudios]);
  const updateAudio = reactExports.useCallback(({
    aud,
    audioId,
    id,
    premounting,
    postmounting
  }) => {
    let changed = false;
    audios.current = audios.current?.map((prevA) => {
      const audioMounted = Boolean(prevA.el.current);
      if (prevA.audioMounted !== audioMounted) {
        changed = true;
      }
      if (prevA.id === id) {
        const isTheSame = compareProps(aud, prevA.props) && prevA.premounting === premounting && prevA.postmounting === postmounting;
        if (isTheSame) {
          return prevA;
        }
        changed = true;
        return {
          ...prevA,
          props: aud,
          premounting,
          postmounting,
          audioId,
          audioMounted
        };
      }
      return prevA;
    });
    if (changed) {
      rerenderAudios();
    }
  }, [rerenderAudios]);
  const playAllAudios = reactExports.useCallback(() => {
    refs.forEach((ref) => {
      const audio = audios.current.find((a2) => a2.el === ref.ref);
      if (audio?.premounting) {
        return;
      }
      playAndHandleNotAllowedError({
        mediaRef: ref.ref,
        mediaType: "audio",
        onAutoPlayError: null,
        logLevel,
        mountTime,
        reason: "playing all audios",
        isPlayer: env.isPlayer
      });
    });
    resume?.();
  }, [logLevel, mountTime, refs, env.isPlayer, resume]);
  const audioTagsValue = reactExports.useMemo(() => {
    return {
      registerAudio,
      unregisterAudio,
      updateAudio,
      playAllAudios,
      numberOfAudioTags
    };
  }, [
    numberOfAudioTags,
    playAllAudios,
    registerAudio,
    unregisterAudio,
    updateAudio
  ]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(SharedAudioTagsContext.Provider, {
    value: audioTagsValue,
    children: [
      refs.map(({ id, ref }) => {
        return /* @__PURE__ */ jsxRuntimeExports.jsx("audio", {
          ref,
          preload: "metadata",
          src: EMPTY_AUDIO
        }, id);
      }),
      children
    ]
  });
};
var useSharedAudio = ({
  aud,
  audioId,
  premounting,
  postmounting
}) => {
  const audioCtx = reactExports.useContext(SharedAudioContext);
  const tagsCtx = reactExports.useContext(SharedAudioTagsContext);
  const [elem] = reactExports.useState(() => {
    if (tagsCtx && tagsCtx.numberOfAudioTags > 0) {
      return tagsCtx.registerAudio({ aud, audioId, premounting, postmounting });
    }
    const el = React.createRef();
    const mediaElementSourceNode = audioCtx?.audioContext ? makeSharedElementSourceNode({
      audioContext: audioCtx.audioContext,
      ref: el
    }) : null;
    return {
      el,
      id: Math.random(),
      props: aud,
      audioId,
      mediaElementSourceNode,
      premounting,
      audioMounted: Boolean(el.current),
      postmounting,
      cleanupOnMediaTagUnmount: () => {
        mediaElementSourceNode?.cleanup();
      }
    };
  });
  const effectToUse = React.useInsertionEffect ?? React.useLayoutEffect;
  if (typeof document !== "undefined") {
    effectToUse(() => {
      if (tagsCtx && tagsCtx.numberOfAudioTags > 0) {
        tagsCtx.updateAudio({
          id: elem.id,
          aud,
          audioId,
          premounting,
          postmounting
        });
      }
    }, [aud, tagsCtx, elem.id, audioId, premounting, postmounting]);
    effectToUse(() => {
      return () => {
        if (tagsCtx && tagsCtx.numberOfAudioTags > 0) {
          tagsCtx.unregisterAudio(elem.id);
        }
      };
    }, [tagsCtx, elem.id]);
  }
  return elem;
};
var FLOATING_POINT_ERROR_THRESHOLD = 1e-5;
var isApproximatelyTheSame = (num1, num2) => {
  return Math.abs(num1 - num2) < FLOATING_POINT_ERROR_THRESHOLD;
};
var toSeconds = (time, fps) => {
  return Math.round(time / fps * 100) / 100;
};
var isSafari = () => {
  if (typeof window === "undefined") {
    return false;
  }
  const isAppleWebKit = /AppleWebKit/.test(window.navigator.userAgent);
  if (!isAppleWebKit) {
    return false;
  }
  const isNotChrome = !window.navigator.userAgent.includes("Chrome/");
  return isNotChrome;
};
var isIosSafari = () => {
  if (typeof window === "undefined") {
    return false;
  }
  const isIpadIPodIPhone = /iP(ad|od|hone)/i.test(window.navigator.userAgent);
  return isIpadIPodIPhone && isSafari();
};
var isIOSSafariAndBlob = (actualSrc) => {
  return isIosSafari() && actualSrc.startsWith("blob:");
};
var getVideoFragmentStart = ({
  actualFrom,
  fps
}) => {
  return toSeconds(Math.max(0, -actualFrom), fps);
};
var getVideoFragmentEnd = ({
  duration,
  fps
}) => {
  return toSeconds(duration, fps);
};
var appendVideoFragment = ({
  actualSrc,
  actualFrom,
  duration,
  fps
}) => {
  if (isIOSSafariAndBlob(actualSrc)) {
    return actualSrc;
  }
  if (actualSrc.startsWith("data:")) {
    return actualSrc;
  }
  const existingHash = Boolean(new URL(actualSrc, (typeof window === "undefined" ? null : window.location.href) ?? "http://localhost:3000").hash);
  if (existingHash) {
    return actualSrc;
  }
  if (!Number.isFinite(actualFrom)) {
    return actualSrc;
  }
  const withStartHash = `${actualSrc}#t=${getVideoFragmentStart({ actualFrom, fps })}`;
  if (!Number.isFinite(duration)) {
    return withStartHash;
  }
  return `${withStartHash},${getVideoFragmentEnd({ duration, fps })}`;
};
var isSubsetOfDuration = ({
  prevStartFrom,
  newStartFrom,
  prevDuration,
  newDuration,
  fps
}) => {
  const previousFrom = getVideoFragmentStart({ actualFrom: prevStartFrom, fps });
  const newFrom = getVideoFragmentStart({ actualFrom: newStartFrom, fps });
  const previousEnd = getVideoFragmentEnd({ duration: prevDuration, fps });
  const newEnd = getVideoFragmentEnd({ duration: newDuration, fps });
  if (newFrom < previousFrom) {
    return false;
  }
  if (newEnd > previousEnd) {
    return false;
  }
  return true;
};
var useAppendVideoFragment = ({
  actualSrc: initialActualSrc,
  actualFrom: initialActualFrom,
  duration: initialDuration,
  fps
}) => {
  const actualFromRef = reactExports.useRef(initialActualFrom);
  const actualDuration = reactExports.useRef(initialDuration);
  const actualSrc = reactExports.useRef(initialActualSrc);
  if (!isSubsetOfDuration({
    prevStartFrom: actualFromRef.current,
    newStartFrom: initialActualFrom,
    prevDuration: actualDuration.current,
    newDuration: initialDuration,
    fps
  }) || initialActualSrc !== actualSrc.current) {
    actualFromRef.current = initialActualFrom;
    actualDuration.current = initialDuration;
    actualSrc.current = initialActualSrc;
  }
  const appended = appendVideoFragment({
    actualSrc: actualSrc.current,
    actualFrom: actualFromRef.current,
    duration: actualDuration.current,
    fps
  });
  return appended;
};
var warned2 = false;
var warnSafariOnce = (logLevel) => {
  if (warned2) {
    return;
  }
  warned2 = true;
  Log.warn({ logLevel, tag: null }, "In Safari, setting a volume and a playback rate at the same time is buggy.");
  Log.warn({ logLevel, tag: null }, "In Desktop Safari, only volumes <= 1 will be applied.");
  Log.warn({ logLevel, tag: null }, logLevel, "In Mobile Safari, the volume will be ignored and set to 1 if a playbackRate is set.");
};
var useVolume = ({
  mediaRef,
  volume,
  logLevel,
  source,
  shouldUseWebAudioApi
}) => {
  const audioStuffRef = reactExports.useRef(null);
  const currentVolumeRef = reactExports.useRef(volume);
  currentVolumeRef.current = volume;
  const sharedAudioContext = reactExports.useContext(SharedAudioContext);
  if (!sharedAudioContext) {
    throw new Error("useAmplification must be used within a SharedAudioContext");
  }
  const { audioContext, gainNode: masterGainNode } = sharedAudioContext;
  if (typeof window !== "undefined") {
    reactExports.useLayoutEffect(() => {
      if (!audioContext) {
        return;
      }
      if (!mediaRef.current) {
        return;
      }
      if (!shouldUseWebAudioApi) {
        return;
      }
      if (mediaRef.current.playbackRate !== 1 && isSafari()) {
        warnSafariOnce(logLevel);
        return;
      }
      if (!source) {
        return;
      }
      if (!masterGainNode) {
        return;
      }
      const gainNode = new GainNode(audioContext, {
        gain: currentVolumeRef.current
      });
      source.attemptToConnect();
      source.get().connect(gainNode);
      gainNode.connect(masterGainNode);
      audioStuffRef.current = {
        gainNode
      };
      Log.trace({ logLevel, tag: null }, `Starting to amplify ${mediaRef.current?.src}. Gain = ${currentVolumeRef.current}, playbackRate = ${mediaRef.current?.playbackRate}`);
      return () => {
        audioStuffRef.current = null;
        gainNode.disconnect();
        source.get().disconnect();
      };
    }, [
      logLevel,
      mediaRef,
      audioContext,
      source,
      shouldUseWebAudioApi,
      masterGainNode
    ]);
  }
  if (audioStuffRef.current) {
    const valueToSet = volume;
    if (!isApproximatelyTheSame(audioStuffRef.current.gainNode.gain.value, valueToSet)) {
      audioStuffRef.current.gainNode.gain.value = valueToSet;
      Log.trace({ logLevel, tag: null }, `Setting gain to ${valueToSet} for ${mediaRef.current?.src}`);
    }
  }
  const safariCase = isSafari() && mediaRef.current && mediaRef.current?.playbackRate !== 1;
  const shouldUseTraditionalVolume = safariCase || !shouldUseWebAudioApi;
  if (shouldUseTraditionalVolume && mediaRef.current && !isApproximatelyTheSame(volume, mediaRef.current?.volume)) {
    mediaRef.current.volume = Math.min(volume, 1);
  }
  return audioStuffRef;
};
var useMediaStartsAt = () => {
  const parentSequence = reactExports.useContext(SequenceContext);
  const startsAt = Math.min(0, parentSequence?.relativeFrom ?? 0);
  return startsAt;
};
var useFrameForVolumeProp = (behavior) => {
  const loop = Loop.useLoop();
  const frame = useCurrentFrame();
  const startsAt = useMediaStartsAt();
  if (behavior === "repeat" || loop === null) {
    return frame + startsAt;
  }
  return frame + startsAt + loop.durationInFrames * loop.iteration;
};
var getAssetDisplayName = (filename) => {
  if (/data:|blob:/.test(filename.substring(0, 5))) {
    return "Data URL";
  }
  const splitted = filename.split("/").map((s) => s.split("\\")).flat(1);
  return splitted[splitted.length - 1];
};
var getTimelineDuration = ({
  compositionDurationInFrames,
  playbackRate,
  trimBefore,
  trimAfter,
  parentSequenceDurationInFrames,
  loop
}) => {
  if (loop) {
    return compositionDurationInFrames;
  }
  const mediaDuration = calculateMediaDuration({
    mediaDurationInFrames: compositionDurationInFrames * playbackRate + (trimBefore ?? 0),
    playbackRate,
    trimBefore,
    trimAfter
  });
  if (parentSequenceDurationInFrames !== null) {
    return Math.floor(Math.min(parentSequenceDurationInFrames * playbackRate, mediaDuration));
  }
  return mediaDuration;
};
var evaluateVolume = ({
  frame,
  volume,
  mediaVolume = 1
}) => {
  if (typeof volume === "number") {
    return volume * mediaVolume;
  }
  if (typeof volume === "undefined") {
    return Number(mediaVolume);
  }
  const evaluated = volume(frame) * mediaVolume;
  if (typeof evaluated !== "number") {
    throw new TypeError(`You passed in a a function to the volume prop but it did not return a number but a value of type ${typeof evaluated} for frame ${frame}`);
  }
  if (Number.isNaN(evaluated)) {
    throw new TypeError(`You passed in a function to the volume prop but it returned NaN for frame ${frame}.`);
  }
  if (!Number.isFinite(evaluated)) {
    throw new TypeError(`You passed in a function to the volume prop but it returned a non-finite number for frame ${frame}.`);
  }
  return Math.max(0, evaluated);
};
var didWarn = {};
var warnOnce2 = (message) => {
  if (didWarn[message]) {
    return;
  }
  console.warn(message);
  didWarn[message] = true;
};
var useBasicMediaInTimeline = ({
  volume,
  mediaVolume,
  mediaType,
  src,
  displayName,
  trimBefore,
  trimAfter,
  playbackRate,
  sequenceDurationInFrames,
  mediaStartsAt,
  loop
}) => {
  if (!src) {
    throw new Error("No src passed");
  }
  const parentSequence = reactExports.useContext(SequenceContext);
  const [initialVolume] = reactExports.useState(() => volume);
  const duration = getTimelineDuration({
    compositionDurationInFrames: sequenceDurationInFrames,
    playbackRate,
    trimBefore,
    trimAfter,
    parentSequenceDurationInFrames: parentSequence?.durationInFrames ?? null,
    loop
  });
  const volumes = reactExports.useMemo(() => {
    if (typeof volume === "number") {
      return volume;
    }
    return new Array(Math.floor(Math.max(0, duration + mediaStartsAt))).fill(true).map((_, i) => {
      return evaluateVolume({
        frame: i + mediaStartsAt,
        volume,
        mediaVolume
      });
    }).join(",");
  }, [duration, mediaStartsAt, volume, mediaVolume]);
  reactExports.useEffect(() => {
    if (typeof volume === "number" && volume !== initialVolume) {
      warnOnce2(`Remotion: The ${mediaType} with src ${src} has changed it's volume. Prefer the callback syntax for setting volume to get better timeline display: https://www.remotion.dev/docs/audio/volume`);
    }
  }, [initialVolume, mediaType, src, volume]);
  const doesVolumeChange = typeof volume === "function";
  const nonce = useNonce();
  const { rootId } = useTimelineContext();
  const startMediaFrom = 0 - mediaStartsAt + (trimBefore ?? 0);
  const memoizedResult = reactExports.useMemo(() => {
    return {
      volumes,
      duration,
      doesVolumeChange,
      nonce,
      rootId,
      finalDisplayName: displayName ?? getAssetDisplayName(src),
      startMediaFrom,
      src,
      playbackRate
    };
  }, [
    volumes,
    duration,
    doesVolumeChange,
    nonce,
    rootId,
    displayName,
    src,
    startMediaFrom,
    playbackRate
  ]);
  return memoizedResult;
};
var useImageInTimeline = ({
  src,
  displayName,
  id,
  stack,
  showInTimeline,
  premountDisplay,
  postmountDisplay,
  loopDisplay,
  controls
}) => {
  const parentSequence = reactExports.useContext(SequenceContext);
  const { registerSequence, unregisterSequence } = reactExports.useContext(SequenceManager);
  const { durationInFrames } = useVideoConfig();
  const mediaStartsAt = useMediaStartsAt();
  const { duration, nonce, rootId, finalDisplayName } = useBasicMediaInTimeline({
    volume: void 0,
    mediaVolume: 0,
    mediaType: "image",
    src,
    displayName,
    trimAfter: void 0,
    trimBefore: void 0,
    playbackRate: 1,
    sequenceDurationInFrames: durationInFrames,
    mediaStartsAt,
    loop: false
  });
  const { isStudio } = useRemotionEnvironment();
  reactExports.useEffect(() => {
    if (!src) {
      throw new Error("No src passed");
    }
    if (!isStudio && window.process?.env?.NODE_ENV !== "test") {
      return;
    }
    if (!showInTimeline) {
      return;
    }
    registerSequence({
      type: "image",
      src,
      id,
      duration,
      from: 0,
      parent: parentSequence?.id ?? null,
      displayName: finalDisplayName,
      rootId,
      showInTimeline: true,
      nonce: nonce.get(),
      loopDisplay,
      stack,
      premountDisplay,
      postmountDisplay,
      controls,
      effects: []
    });
    return () => {
      unregisterSequence(id);
    };
  }, [
    duration,
    id,
    parentSequence,
    src,
    registerSequence,
    unregisterSequence,
    nonce,
    stack,
    showInTimeline,
    premountDisplay,
    postmountDisplay,
    isStudio,
    loopDisplay,
    rootId,
    finalDisplayName,
    controls
  ]);
};
var useMediaInTimeline = ({
  volume,
  mediaVolume,
  src,
  mediaType,
  playbackRate,
  displayName,
  id,
  stack,
  showInTimeline,
  premountDisplay,
  postmountDisplay,
  loopDisplay
}) => {
  const parentSequence = reactExports.useContext(SequenceContext);
  const startsAt = useMediaStartsAt();
  const { registerSequence, unregisterSequence } = reactExports.useContext(SequenceManager);
  const { durationInFrames } = useVideoConfig();
  const mediaStartsAt = useMediaStartsAt();
  const { volumes, duration, doesVolumeChange, nonce, rootId, finalDisplayName } = useBasicMediaInTimeline({
    volume,
    mediaVolume,
    mediaType,
    src,
    displayName,
    trimAfter: void 0,
    trimBefore: void 0,
    playbackRate,
    sequenceDurationInFrames: durationInFrames,
    mediaStartsAt,
    loop: false
  });
  const { isStudio } = useRemotionEnvironment();
  reactExports.useEffect(() => {
    if (!src) {
      throw new Error("No src passed");
    }
    if (!isStudio && window.process?.env?.NODE_ENV !== "test") {
      return;
    }
    if (!showInTimeline) {
      return;
    }
    registerSequence({
      type: mediaType,
      src,
      id,
      duration,
      from: 0,
      parent: parentSequence?.id ?? null,
      displayName: finalDisplayName,
      rootId,
      volume: volumes,
      showInTimeline: true,
      nonce: nonce.get(),
      startMediaFrom: 0 - startsAt,
      doesVolumeChange,
      loopDisplay,
      playbackRate,
      stack,
      premountDisplay,
      postmountDisplay,
      controls: null,
      effects: []
    });
    return () => {
      unregisterSequence(id);
    };
  }, [
    duration,
    id,
    parentSequence,
    src,
    registerSequence,
    unregisterSequence,
    volumes,
    doesVolumeChange,
    nonce,
    mediaType,
    startsAt,
    playbackRate,
    stack,
    showInTimeline,
    premountDisplay,
    postmountDisplay,
    loopDisplay,
    rootId,
    finalDisplayName,
    isStudio
  ]);
};
var useBufferManager = (logLevel, mountTime) => {
  const [blocks, setBlocks] = reactExports.useState([]);
  const [onBufferingCallbacks, setOnBufferingCallbacks] = reactExports.useState([]);
  const [onResumeCallbacks, setOnResumeCallbacks] = reactExports.useState([]);
  const env = useRemotionEnvironment();
  const rendering = env.isRendering;
  const buffering = reactExports.useRef(false);
  const addBlock = reactExports.useCallback((block) => {
    if (rendering) {
      return {
        unblock: () => {
          return;
        }
      };
    }
    let unblocked = false;
    setBlocks((b2) => [...b2, block]);
    return {
      unblock: () => {
        if (unblocked) {
          return;
        }
        unblocked = true;
        setBlocks((b2) => {
          const newArr = b2.filter((bx) => bx !== block);
          if (newArr.length === b2.length) {
            return b2;
          }
          return newArr;
        });
      }
    };
  }, [rendering]);
  const listenForBuffering = reactExports.useCallback((callback) => {
    setOnBufferingCallbacks((c2) => [...c2, callback]);
    return {
      remove: () => {
        setOnBufferingCallbacks((c2) => c2.filter((cb) => cb !== callback));
      }
    };
  }, []);
  const listenForResume = reactExports.useCallback((callback) => {
    setOnResumeCallbacks((c2) => [...c2, callback]);
    return {
      remove: () => {
        setOnResumeCallbacks((c2) => c2.filter((cb) => cb !== callback));
      }
    };
  }, []);
  reactExports.useEffect(() => {
    if (rendering) {
      return;
    }
    if (blocks.length > 0) {
      onBufferingCallbacks.forEach((c2) => c2());
      playbackLogging({
        logLevel,
        message: "Player is entering buffer state",
        mountTime,
        tag: "player"
      });
    }
  }, [blocks]);
  if (typeof window !== "undefined") {
    reactExports.useLayoutEffect(() => {
      if (rendering) {
        return;
      }
      if (blocks.length === 0) {
        onResumeCallbacks.forEach((c2) => c2());
        playbackLogging({
          logLevel,
          message: "Player is exiting buffer state",
          mountTime,
          tag: "player"
        });
      }
    }, [blocks]);
  }
  return reactExports.useMemo(() => {
    return { addBlock, listenForBuffering, listenForResume, buffering };
  }, [addBlock, buffering, listenForBuffering, listenForResume]);
};
var BufferingContextReact = React.createContext(null);
var BufferingProvider = ({ children }) => {
  const { logLevel, mountTime } = reactExports.useContext(LogLevelContext);
  const bufferManager = useBufferManager(logLevel ?? "info", mountTime);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(BufferingContextReact.Provider, {
    value: bufferManager,
    children
  });
};
var useIsPlayerBuffering = (bufferManager) => {
  const [isBuffering, setIsBuffering] = reactExports.useState(bufferManager.buffering.current);
  reactExports.useEffect(() => {
    const onBuffer = () => {
      setIsBuffering(true);
    };
    const onResume = () => {
      setIsBuffering(false);
    };
    bufferManager.listenForBuffering(onBuffer);
    bufferManager.listenForResume(onResume);
    return () => {
      bufferManager.listenForBuffering(() => {
        return;
      });
      bufferManager.listenForResume(() => {
        return;
      });
    };
  }, [bufferManager]);
  return isBuffering;
};
var useBufferState = () => {
  const buffer = reactExports.useContext(BufferingContextReact);
  const logLevel = useLogLevel();
  const addBlock = buffer ? buffer.addBlock : null;
  return reactExports.useMemo(() => ({
    delayPlayback: () => {
      if (!addBlock) {
        throw new Error("Tried to enable the buffering state, but a Remotion context was not found. This API can only be called in a component that was passed to the Remotion Player or a <Composition>. Or you might have experienced a version mismatch - run `npx remotion versions` and ensure all packages have the same version. This error is thrown by the buffer state https://remotion.dev/docs/player/buffer-state");
      }
      Log.trace({ logLevel, tag: "[buffer-state]" }, "Adding buffer handle", new Error().stack);
      const { unblock } = addBlock({
        id: String(Math.random())
      });
      let unblocked = false;
      return {
        unblock: () => {
          if (unblocked) {
            return;
          }
          unblocked = true;
          Log.trace({ logLevel, tag: "[buffer-state]" }, "Removing buffer handle");
          unblock();
        }
      };
    }
  }), [addBlock, logLevel]);
};
var isSafariWebkit = () => {
  const isSafari2 = /^((?!chrome|android).)*safari/i.test(window.navigator.userAgent);
  return isSafari2;
};
var useBufferUntilFirstFrame = ({
  mediaRef,
  mediaType,
  onVariableFpsVideoDetected,
  pauseWhenBuffering,
  logLevel,
  mountTime
}) => {
  const bufferingRef = reactExports.useRef(false);
  const { delayPlayback } = useBufferState();
  const bufferUntilFirstFrame = reactExports.useCallback((requestedTime) => {
    if (mediaType !== "video") {
      return;
    }
    if (!pauseWhenBuffering) {
      return;
    }
    const current = mediaRef.current;
    if (!current) {
      return;
    }
    if (current.readyState >= current.HAVE_FUTURE_DATA && !isSafariWebkit()) {
      playbackLogging({
        logLevel,
        message: `Not using buffer until first frame, because readyState is ${current.readyState} and is not Safari or Desktop Chrome`,
        mountTime,
        tag: "buffer"
      });
      return;
    }
    if (!current.requestVideoFrameCallback) {
      playbackLogging({
        logLevel,
        message: `Not using buffer until first frame, because requestVideoFrameCallback is not supported`,
        mountTime,
        tag: "buffer"
      });
      return;
    }
    bufferingRef.current = true;
    playbackLogging({
      logLevel,
      message: `Buffering ${mediaRef.current?.src} until the first frame is received`,
      mountTime,
      tag: "buffer"
    });
    const playback = delayPlayback();
    const unblock = () => {
      playback.unblock();
      current.removeEventListener("ended", unblock, {
        once: true
      });
      current.removeEventListener("pause", unblock, {
        once: true
      });
      bufferingRef.current = false;
    };
    const onEndedOrPauseOrCanPlay = () => {
      unblock();
    };
    current.requestVideoFrameCallback((_, info2) => {
      const differenceFromRequested = Math.abs(info2.mediaTime - requestedTime);
      if (differenceFromRequested > 0.5) {
        onVariableFpsVideoDetected();
      }
      unblock();
    });
    current.addEventListener("ended", onEndedOrPauseOrCanPlay, { once: true });
    current.addEventListener("pause", onEndedOrPauseOrCanPlay, { once: true });
    current.addEventListener("canplay", onEndedOrPauseOrCanPlay, {
      once: true
    });
  }, [
    delayPlayback,
    logLevel,
    mediaRef,
    mediaType,
    mountTime,
    onVariableFpsVideoDetected,
    pauseWhenBuffering
  ]);
  return reactExports.useMemo(() => {
    return {
      isBuffering: () => bufferingRef.current,
      bufferUntilFirstFrame
    };
  }, [bufferUntilFirstFrame]);
};
var useCurrentTimeOfMediaTagWithUpdateTimeStamp = (mediaRef) => {
  const lastUpdate = React.useRef({
    time: mediaRef.current?.currentTime ?? 0,
    lastUpdate: performance.now()
  });
  const nowCurrentTime = mediaRef.current?.currentTime ?? null;
  if (nowCurrentTime !== null) {
    if (lastUpdate.current.time !== nowCurrentTime) {
      lastUpdate.current.time = nowCurrentTime;
      lastUpdate.current.lastUpdate = performance.now();
    }
  }
  return lastUpdate;
};
var seek = ({
  mediaRef,
  time,
  logLevel,
  why,
  mountTime
}) => {
  const timeToSet = isIosSafari() ? Number(time.toFixed(1)) : time;
  playbackLogging({
    logLevel,
    tag: "seek",
    message: `Seeking from ${mediaRef.currentTime} to ${timeToSet}. src= ${mediaRef.src} Reason: ${why}`,
    mountTime
  });
  mediaRef.currentTime = timeToSet;
  return timeToSet;
};
var useMediaBuffering = ({
  element,
  shouldBuffer,
  isPremounting,
  isPostmounting,
  logLevel,
  mountTime,
  src
}) => {
  const buffer = useBufferState();
  const [isBuffering, setIsBuffering] = reactExports.useState(false);
  reactExports.useEffect(() => {
    let cleanupFns = [];
    const { current } = element;
    if (!current) {
      return;
    }
    if (!shouldBuffer) {
      return;
    }
    if (isPremounting || isPostmounting) {
      if ((isPremounting || isPostmounting) && current.readyState < current.HAVE_FUTURE_DATA) {
        if (!navigator.userAgent.includes("Firefox/")) {
          playbackLogging({
            logLevel,
            message: `Calling .load() on ${current.src} because readyState is ${current.readyState} and it is not Firefox. Element is premounted ${current.playbackRate}`,
            tag: "load",
            mountTime
          });
          const previousPlaybackRate = current.playbackRate;
          current.load();
          current.playbackRate = previousPlaybackRate;
        }
      }
      return;
    }
    const cleanup = (reason) => {
      let didDoSomething = false;
      cleanupFns.forEach((fn) => {
        fn(reason);
        didDoSomething = true;
      });
      cleanupFns = [];
      setIsBuffering((previous) => {
        if (previous) {
          didDoSomething = true;
        }
        return false;
      });
      if (didDoSomething) {
        playbackLogging({
          logLevel,
          message: `Unmarking as buffering: ${current.src}. Reason: ${reason}`,
          tag: "buffer",
          mountTime
        });
      }
    };
    const blockMedia = (reason) => {
      setIsBuffering(true);
      playbackLogging({
        logLevel,
        message: `Marking as buffering: ${current.src}. Reason: ${reason}`,
        tag: "buffer",
        mountTime
      });
      const { unblock } = buffer.delayPlayback();
      const onCanPlay = () => {
        cleanup('"canplay" was fired');
        init();
      };
      const onError = () => {
        cleanup('"error" event was occurred');
        init();
      };
      current.addEventListener("canplay", onCanPlay, {
        once: true
      });
      cleanupFns.push(() => {
        current.removeEventListener("canplay", onCanPlay);
      });
      current.addEventListener("error", onError, {
        once: true
      });
      cleanupFns.push(() => {
        current.removeEventListener("error", onError);
      });
      cleanupFns.push((cleanupReason) => {
        playbackLogging({
          logLevel,
          message: `Unblocking ${current.src} from buffer. Reason: ${cleanupReason}`,
          tag: "buffer",
          mountTime
        });
        unblock();
      });
    };
    const init = () => {
      if (current.readyState < current.HAVE_FUTURE_DATA) {
        blockMedia(`readyState is ${current.readyState}, which is less than HAVE_FUTURE_DATA`);
        if (!navigator.userAgent.includes("Firefox/")) {
          playbackLogging({
            logLevel,
            message: `Calling .load() on ${src} because readyState is ${current.readyState} and it is not Firefox. ${current.playbackRate}`,
            tag: "load",
            mountTime
          });
          const previousPlaybackRate = current.playbackRate;
          current.load();
          current.playbackRate = previousPlaybackRate;
        }
      } else {
        const onWaiting = () => {
          blockMedia('"waiting" event was fired');
        };
        current.addEventListener("waiting", onWaiting);
        cleanupFns.push(() => {
          current.removeEventListener("waiting", onWaiting);
        });
      }
    };
    init();
    return () => {
      cleanup("element was unmounted or prop changed");
    };
  }, [
    buffer,
    src,
    element,
    isPremounting,
    isPostmounting,
    logLevel,
    shouldBuffer,
    mountTime
  ]);
  return isBuffering;
};
var useRequestVideoCallbackTime = ({
  mediaRef,
  mediaType,
  lastSeek,
  onVariableFpsVideoDetected
}) => {
  const currentTime = reactExports.useRef(null);
  reactExports.useEffect(() => {
    const { current } = mediaRef;
    if (current) {
      currentTime.current = {
        time: current.currentTime,
        lastUpdate: performance.now()
      };
    } else {
      currentTime.current = null;
      return;
    }
    if (mediaType !== "video") {
      currentTime.current = null;
      return;
    }
    const videoTag = current;
    if (!videoTag.requestVideoFrameCallback) {
      return;
    }
    let cancel = () => {
      return;
    };
    const request = () => {
      if (!videoTag) {
        return;
      }
      const cb = videoTag.requestVideoFrameCallback((_, info2) => {
        if (currentTime.current !== null) {
          const difference = Math.abs(currentTime.current.time - info2.mediaTime);
          const differenceToLastSeek = Math.abs(lastSeek.current === null ? Infinity : info2.mediaTime - lastSeek.current);
          if (difference > 0.5 && differenceToLastSeek > 0.5 && info2.mediaTime > currentTime.current.time) {
            onVariableFpsVideoDetected();
          }
        }
        currentTime.current = {
          time: info2.mediaTime,
          lastUpdate: performance.now()
        };
        request();
      });
      cancel = () => {
        videoTag.cancelVideoFrameCallback(cb);
        cancel = () => {
          return;
        };
      };
    };
    request();
    return () => {
      cancel();
    };
  }, [lastSeek, mediaRef, mediaType, onVariableFpsVideoDetected]);
  return currentTime;
};
function interpolateFunction(input, inputRange, outputRange, options) {
  const { extrapolateLeft, extrapolateRight, easing } = options;
  let result = input;
  const [inputMin, inputMax] = inputRange;
  const [outputMin, outputMax] = outputRange;
  if (result < inputMin) {
    if (extrapolateLeft === "identity") {
      return result;
    }
    if (extrapolateLeft === "clamp") {
      result = inputMin;
    } else if (extrapolateLeft === "wrap") {
      const range = inputMax - inputMin;
      result = ((result - inputMin) % range + range) % range + inputMin;
    } else ;
  }
  if (result > inputMax) {
    if (extrapolateRight === "identity") {
      return result;
    }
    if (extrapolateRight === "clamp") {
      result = inputMax;
    } else if (extrapolateRight === "wrap") {
      const range = inputMax - inputMin;
      result = ((result - inputMin) % range + range) % range + inputMin;
    } else ;
  }
  if (outputMin === outputMax) {
    return outputMin;
  }
  result = (result - inputMin) / (inputMax - inputMin);
  result = easing(result);
  result = result * (outputMax - outputMin) + outputMin;
  return result;
}
function findRange(input, inputRange) {
  let i;
  for (i = 1; i < inputRange.length - 1; ++i) {
    if (inputRange[i] >= input) {
      break;
    }
  }
  return i - 1;
}
function checkValidInputRange(arr) {
  for (let i = 1; i < arr.length; ++i) {
    if (!(arr[i] > arr[i - 1])) {
      throw new Error(`inputRange must be strictly monotonically increasing but got [${arr.join(",")}]`);
    }
  }
}
function checkInfiniteRange(name, arr) {
  if (arr.length < 2) {
    throw new Error(name + " must have at least 2 elements");
  }
  for (const element of arr) {
    if (typeof element !== "number") {
      throw new Error(`${name} must contain only numbers`);
    }
    if (!Number.isFinite(element)) {
      throw new Error(`${name} must contain only finite numbers, but got [${arr.join(",")}]`);
    }
  }
}
function interpolate(input, inputRange, outputRange, options) {
  if (typeof input === "undefined") {
    throw new Error("input can not be undefined");
  }
  if (typeof inputRange === "undefined") {
    throw new Error("inputRange can not be undefined");
  }
  if (typeof outputRange === "undefined") {
    throw new Error("outputRange can not be undefined");
  }
  if (inputRange.length !== outputRange.length) {
    throw new Error("inputRange (" + inputRange.length + ") and outputRange (" + outputRange.length + ") must have the same length");
  }
  checkInfiniteRange("inputRange", inputRange);
  checkInfiniteRange("outputRange", outputRange);
  checkValidInputRange(inputRange);
  const easing = options?.easing ?? ((num) => num);
  let extrapolateLeft = "extend";
  if (options?.extrapolateLeft !== void 0) {
    extrapolateLeft = options.extrapolateLeft;
  }
  let extrapolateRight = "extend";
  if (options?.extrapolateRight !== void 0) {
    extrapolateRight = options.extrapolateRight;
  }
  if (typeof input !== "number") {
    throw new TypeError("Cannot interpolate an input which is not a number");
  }
  const range = findRange(input, inputRange);
  return interpolateFunction(input, [inputRange[range], inputRange[range + 1]], [outputRange[range], outputRange[range + 1]], {
    easing,
    extrapolateLeft,
    extrapolateRight
  });
}
var getExpectedMediaFrameUncorrected = ({
  frame,
  playbackRate,
  startFrom
}) => {
  return interpolate(frame, [-1, startFrom, startFrom + 1], [-1, startFrom, startFrom + playbackRate]);
};
var getMediaTime = ({
  fps,
  frame,
  playbackRate,
  startFrom
}) => {
  const expectedFrame = getExpectedMediaFrameUncorrected({
    frame,
    playbackRate,
    startFrom
  });
  const msPerFrame = 1e3 / fps;
  return expectedFrame * msPerFrame / 1e3;
};
var alreadyWarned = {};
var warnAboutNonSeekableMedia = (ref, type) => {
  if (ref === null) {
    return;
  }
  if (ref.seekable.length === 0) {
    return;
  }
  if (ref.seekable.length > 1) {
    return;
  }
  if (alreadyWarned[ref.src]) {
    return;
  }
  const range = { start: ref.seekable.start(0), end: ref.seekable.end(0) };
  if (range.start === 0 && range.end === 0) {
    const msg = [
      `The media ${ref.src} cannot be seeked. This could be one of few reasons:`,
      "1) The media resource was replaced while the video is playing but it was not loaded yet.",
      "2) The media does not support seeking.",
      "3) The media was loaded with security headers prventing it from being included.",
      "Please see https://remotion.dev/docs/non-seekable-media for assistance."
    ].join(`
`);
    if (type === "console-error") {
      console.error(msg);
    } else if (type === "console-warning") {
      console.warn(`The media ${ref.src} does not support seeking. The video will render fine, but may not play correctly in the Remotion Studio and in the <Player>. See https://remotion.dev/docs/non-seekable-media for an explanation.`);
    } else {
      throw new Error(msg);
    }
    alreadyWarned[ref.src] = true;
  }
};
var useMediaPlayback = ({
  mediaRef,
  src,
  mediaType,
  playbackRate: localPlaybackRate,
  onlyWarnForMediaSeekingError,
  acceptableTimeshift,
  pauseWhenBuffering,
  isPremounting,
  isPostmounting,
  onAutoPlayError
}) => {
  const { playbackRate: globalPlaybackRate } = usePlaybackRate();
  const frame = useCurrentFrame();
  const absoluteFrame = useTimelinePosition();
  const [playing] = usePlayingState();
  const buffering = reactExports.useContext(BufferingContextReact);
  const { fps } = useVideoConfig();
  const mediaStartsAt = useMediaStartsAt();
  const lastSeekDueToShift = reactExports.useRef(null);
  const lastSeek = reactExports.useRef(null);
  const logLevel = useLogLevel();
  const mountTime = useMountTime();
  if (!buffering) {
    throw new Error("useMediaPlayback must be used inside a <BufferingContext>");
  }
  const isVariableFpsVideoMap = reactExports.useRef({});
  const onVariableFpsVideoDetected = reactExports.useCallback(() => {
    if (!src) {
      return;
    }
    if (isVariableFpsVideoMap.current[src]) {
      return;
    }
    Log.verbose({ logLevel, tag: null }, `Detected ${src} as a variable FPS video. Disabling buffering while seeking.`);
    isVariableFpsVideoMap.current[src] = true;
  }, [logLevel, src]);
  const rvcCurrentTime = useRequestVideoCallbackTime({
    mediaRef,
    mediaType,
    lastSeek,
    onVariableFpsVideoDetected
  });
  const mediaTagCurrentTime = useCurrentTimeOfMediaTagWithUpdateTimeStamp(mediaRef);
  const desiredUnclampedTime = getMediaTime({
    frame,
    playbackRate: localPlaybackRate,
    startFrom: -mediaStartsAt,
    fps
  });
  const isMediaTagBuffering = useMediaBuffering({
    element: mediaRef,
    shouldBuffer: pauseWhenBuffering,
    isPremounting,
    isPostmounting,
    logLevel,
    mountTime,
    src: src ?? null
  });
  const { bufferUntilFirstFrame, isBuffering } = useBufferUntilFirstFrame({
    mediaRef,
    mediaType,
    onVariableFpsVideoDetected,
    pauseWhenBuffering,
    logLevel,
    mountTime
  });
  const playbackRate = localPlaybackRate * globalPlaybackRate;
  const acceptableTimeShiftButLessThanDuration = (() => {
    const DEFAULT_ACCEPTABLE_TIMESHIFT_WITH_NORMAL_PLAYBACK = 0.45;
    const DEFAULT_ACCEPTABLE_TIMESHIFT_WITH_AMPLIFICATION = DEFAULT_ACCEPTABLE_TIMESHIFT_WITH_NORMAL_PLAYBACK + 0.2;
    const defaultAcceptableTimeshift = DEFAULT_ACCEPTABLE_TIMESHIFT_WITH_AMPLIFICATION;
    if (mediaRef.current?.duration) {
      return Math.min(mediaRef.current.duration, acceptableTimeshift ?? defaultAcceptableTimeshift);
    }
    return acceptableTimeshift ?? defaultAcceptableTimeshift;
  })();
  const isPlayerBuffering = useIsPlayerBuffering(buffering);
  reactExports.useEffect(() => {
    if (mediaRef.current?.paused) {
      return;
    }
    if (!playing) {
      playbackLogging({
        logLevel,
        tag: "pause",
        message: `Pausing ${mediaRef.current?.src} because ${isPremounting ? "media is premounting" : isPostmounting ? "media is postmounting" : "Player is not playing"}`,
        mountTime
      });
      mediaRef.current?.pause();
      return;
    }
    const isMediaTagBufferingOrStalled = isMediaTagBuffering || isBuffering();
    const playerBufferingNotStateButLive = buffering.buffering.current;
    if (playerBufferingNotStateButLive && !isMediaTagBufferingOrStalled) {
      playbackLogging({
        logLevel,
        tag: "pause",
        message: `Pausing ${mediaRef.current?.src} because player is buffering but media tag is not`,
        mountTime
      });
      mediaRef.current?.pause();
    }
  }, [
    isBuffering,
    isMediaTagBuffering,
    buffering,
    isPlayerBuffering,
    isPremounting,
    logLevel,
    mediaRef,
    mediaType,
    mountTime,
    playing,
    isPostmounting
  ]);
  const env = useRemotionEnvironment();
  reactExports.useLayoutEffect(() => {
    const playbackRateToSet = Math.max(0, playbackRate);
    if (mediaRef.current && mediaRef.current.playbackRate !== playbackRateToSet) {
      mediaRef.current.playbackRate = playbackRateToSet;
    }
  }, [mediaRef, playbackRate]);
  reactExports.useEffect(() => {
    const tagName = mediaType === "audio" ? "<Html5Audio>" : "<Html5Video>";
    if (!mediaRef.current) {
      throw new Error(`No ${mediaType} ref found`);
    }
    if (!src) {
      throw new Error(`No 'src' attribute was passed to the ${tagName} element.`);
    }
    const { duration } = mediaRef.current;
    const shouldBeTime = !Number.isNaN(duration) && Number.isFinite(duration) ? Math.min(duration, desiredUnclampedTime) : desiredUnclampedTime;
    const mediaTagTime = mediaTagCurrentTime.current.time;
    const rvcTime = rvcCurrentTime.current?.time ?? null;
    const isVariableFpsVideo = isVariableFpsVideoMap.current[src];
    const timeShiftMediaTag = Math.abs(shouldBeTime - mediaTagTime);
    const timeShiftRvcTag = rvcTime ? Math.abs(shouldBeTime - rvcTime) : null;
    const mostRecentTimeshift = rvcCurrentTime.current?.lastUpdate && rvcCurrentTime.current.time > mediaTagCurrentTime.current.lastUpdate ? timeShiftRvcTag : timeShiftMediaTag;
    const timeShift = timeShiftRvcTag && !isVariableFpsVideo ? mostRecentTimeshift : timeShiftMediaTag;
    if (timeShift > acceptableTimeShiftButLessThanDuration && lastSeekDueToShift.current !== shouldBeTime) {
      lastSeek.current = seek({
        mediaRef: mediaRef.current,
        time: shouldBeTime,
        logLevel,
        why: `because time shift is too big. shouldBeTime = ${shouldBeTime}, isTime = ${mediaTagTime}, requestVideoCallbackTime = ${rvcTime}, timeShift = ${timeShift}${isVariableFpsVideo ? ", isVariableFpsVideo = true" : ""}, isPremounting = ${isPremounting}, isPostmounting = ${isPostmounting}, pauseWhenBuffering = ${pauseWhenBuffering}`,
        mountTime
      });
      lastSeekDueToShift.current = lastSeek.current;
      if (playing) {
        if (playbackRate > 0) {
          bufferUntilFirstFrame(shouldBeTime);
        }
        if (mediaRef.current.paused) {
          playAndHandleNotAllowedError({
            mediaRef,
            mediaType,
            onAutoPlayError,
            logLevel,
            mountTime,
            reason: "player is playing but media tag is paused, and just seeked",
            isPlayer: env.isPlayer
          });
        }
      }
      if (!onlyWarnForMediaSeekingError) {
        warnAboutNonSeekableMedia(mediaRef.current, onlyWarnForMediaSeekingError ? "console-warning" : "console-error");
      }
      return;
    }
    const seekThreshold = playing ? 0.15 : 0.01;
    const makesSenseToSeek = Math.abs(mediaRef.current.currentTime - shouldBeTime) > seekThreshold;
    const isMediaTagBufferingOrStalled = isMediaTagBuffering || isBuffering();
    const isSomethingElseBuffering = buffering.buffering.current && !isMediaTagBufferingOrStalled;
    if (!playing || isSomethingElseBuffering) {
      if (makesSenseToSeek) {
        lastSeek.current = seek({
          mediaRef: mediaRef.current,
          time: shouldBeTime,
          logLevel,
          why: `not playing or something else is buffering. time offset is over seek threshold (${seekThreshold})`,
          mountTime
        });
      }
      return;
    }
    if (!playing || buffering.buffering.current) {
      return;
    }
    const pausedCondition = mediaRef.current.paused && !mediaRef.current.ended;
    const firstFrameCondition = absoluteFrame === 0;
    if (pausedCondition || firstFrameCondition) {
      const reason = pausedCondition ? "media tag is paused" : "absolute frame is 0";
      if (makesSenseToSeek) {
        lastSeek.current = seek({
          mediaRef: mediaRef.current,
          time: shouldBeTime,
          logLevel,
          why: `is over timeshift threshold (threshold = ${seekThreshold}) and ${reason}`,
          mountTime
        });
      }
      playAndHandleNotAllowedError({
        mediaRef,
        mediaType,
        onAutoPlayError,
        logLevel,
        mountTime,
        reason: `player is playing and ${reason}`,
        isPlayer: env.isPlayer
      });
      if (!isVariableFpsVideo && playbackRate > 0) {
        bufferUntilFirstFrame(shouldBeTime);
      }
    }
  }, [
    absoluteFrame,
    acceptableTimeShiftButLessThanDuration,
    bufferUntilFirstFrame,
    buffering.buffering,
    rvcCurrentTime,
    logLevel,
    desiredUnclampedTime,
    isBuffering,
    isMediaTagBuffering,
    mediaRef,
    mediaType,
    onlyWarnForMediaSeekingError,
    playbackRate,
    playing,
    src,
    onAutoPlayError,
    isPremounting,
    isPostmounting,
    pauseWhenBuffering,
    mountTime,
    mediaTagCurrentTime,
    env.isPlayer
  ]);
};
var useMediaTag = ({
  mediaRef,
  id,
  mediaType,
  onAutoPlayError,
  isPremounting,
  isPostmounting
}) => {
  const { audioAndVideoTags, imperativePlaying } = useTimelineContext();
  const logLevel = useLogLevel();
  const mountTime = useMountTime();
  const env = useRemotionEnvironment();
  reactExports.useEffect(() => {
    const tag = {
      id,
      play: (reason) => {
        if (!imperativePlaying.current) {
          return;
        }
        if (isPremounting || isPostmounting) {
          return;
        }
        return playAndHandleNotAllowedError({
          mediaRef,
          mediaType,
          onAutoPlayError,
          logLevel,
          mountTime,
          reason,
          isPlayer: env.isPlayer
        });
      }
    };
    audioAndVideoTags.current.push(tag);
    return () => {
      audioAndVideoTags.current = audioAndVideoTags.current.filter((a2) => a2.id !== id);
    };
  }, [
    audioAndVideoTags,
    id,
    mediaRef,
    mediaType,
    onAutoPlayError,
    imperativePlaying,
    isPremounting,
    isPostmounting,
    logLevel,
    mountTime,
    env.isPlayer
  ]);
};
var MediaVolumeContext = reactExports.createContext({
  mediaMuted: false,
  mediaVolume: 1
});
var SetMediaVolumeContext = reactExports.createContext({
  setMediaMuted: () => {
    throw new Error("default");
  },
  setMediaVolume: () => {
    throw new Error("default");
  }
});
var useMediaVolumeState = () => {
  const { mediaVolume } = reactExports.useContext(MediaVolumeContext);
  const { setMediaVolume } = reactExports.useContext(SetMediaVolumeContext);
  return reactExports.useMemo(() => {
    return [mediaVolume, setMediaVolume];
  }, [mediaVolume, setMediaVolume]);
};
var useMediaMutedState = () => {
  const { mediaMuted } = reactExports.useContext(MediaVolumeContext);
  const { setMediaMuted } = reactExports.useContext(SetMediaVolumeContext);
  return reactExports.useMemo(() => {
    return [mediaMuted, setMediaMuted];
  }, [mediaMuted, setMediaMuted]);
};
var warnAboutTooHighVolume = (volume) => {
  if (volume >= 100) {
    throw new Error(`Volume was set to ${volume}, but regular volume is 1, not 100. Did you forget to divide by 100? Set a volume of less than 100 to dismiss this error.`);
  }
};
var AudioForDevelopmentForwardRefFunction = (props, ref) => {
  const [initialShouldPreMountAudioElements] = reactExports.useState(props.shouldPreMountAudioTags);
  if (props.shouldPreMountAudioTags !== initialShouldPreMountAudioElements) {
    throw new Error("Cannot change the behavior for pre-mounting audio tags dynamically.");
  }
  const logLevel = useLogLevel();
  const {
    volume,
    muted,
    playbackRate,
    shouldPreMountAudioTags,
    src,
    onDuration,
    acceptableTimeShiftInSeconds,
    _remotionInternalNeedsDurationCalculation,
    _remotionInternalNativeLoopPassed,
    _remotionInternalStack,
    allowAmplificationDuringRender,
    name,
    pauseWhenBuffering,
    showInTimeline,
    loopVolumeCurveBehavior,
    stack,
    crossOrigin,
    delayRenderRetries,
    delayRenderTimeoutInMilliseconds,
    toneFrequency,
    useWebAudioApi,
    onError,
    onNativeError,
    audioStreamIndex,
    ...nativeProps
  } = props;
  const [mediaVolume] = useMediaVolumeState();
  const [mediaMuted] = useMediaMutedState();
  const volumePropFrame = useFrameForVolumeProp(loopVolumeCurveBehavior ?? "repeat");
  const { hidden } = reactExports.useContext(SequenceVisibilityToggleContext);
  if (!src) {
    throw new TypeError("No 'src' was passed to <Html5Audio>.");
  }
  const preloadedSrc = usePreload(src);
  const sequenceContext = reactExports.useContext(SequenceContext);
  const [timelineId] = reactExports.useState(() => String(Math.random()));
  const isSequenceHidden = hidden[timelineId] ?? false;
  const userPreferredVolume = evaluateVolume({
    frame: volumePropFrame,
    volume,
    mediaVolume
  });
  warnAboutTooHighVolume(userPreferredVolume);
  const crossOriginValue = getCrossOriginValue({
    crossOrigin,
    requestsVideoFrame: false,
    isClientSideRendering: false
  });
  const propsToPass = reactExports.useMemo(() => {
    return {
      muted: muted || mediaMuted || isSequenceHidden || userPreferredVolume <= 0,
      src: preloadedSrc,
      loop: _remotionInternalNativeLoopPassed,
      crossOrigin: crossOriginValue,
      ...nativeProps
    };
  }, [
    _remotionInternalNativeLoopPassed,
    isSequenceHidden,
    mediaMuted,
    muted,
    nativeProps,
    preloadedSrc,
    userPreferredVolume,
    crossOriginValue
  ]);
  const id = reactExports.useMemo(() => `audio-${random(src ?? "")}-${sequenceContext?.relativeFrom}-${sequenceContext?.cumulatedFrom}-${sequenceContext?.durationInFrames}-muted:${props.muted}-loop:${props.loop}`, [
    src,
    sequenceContext?.relativeFrom,
    sequenceContext?.cumulatedFrom,
    sequenceContext?.durationInFrames,
    props.muted,
    props.loop
  ]);
  const {
    el: audioRef,
    mediaElementSourceNode,
    cleanupOnMediaTagUnmount
  } = useSharedAudio({
    aud: propsToPass,
    audioId: id,
    premounting: Boolean(sequenceContext?.premounting),
    postmounting: Boolean(sequenceContext?.postmounting)
  });
  useMediaInTimeline({
    volume,
    mediaVolume,
    src,
    mediaType: "audio",
    playbackRate: playbackRate ?? 1,
    displayName: name ?? null,
    id: timelineId,
    stack: _remotionInternalStack,
    showInTimeline,
    premountDisplay: sequenceContext?.premountDisplay ?? null,
    postmountDisplay: sequenceContext?.postmountDisplay ?? null,
    loopDisplay: void 0
  });
  useMediaPlayback({
    mediaRef: audioRef,
    src,
    mediaType: "audio",
    playbackRate: playbackRate ?? 1,
    onlyWarnForMediaSeekingError: false,
    acceptableTimeshift: acceptableTimeShiftInSeconds ?? null,
    isPremounting: Boolean(sequenceContext?.premounting),
    isPostmounting: Boolean(sequenceContext?.postmounting),
    pauseWhenBuffering,
    onAutoPlayError: null
  });
  useMediaTag({
    id: timelineId,
    isPostmounting: Boolean(sequenceContext?.postmounting),
    isPremounting: Boolean(sequenceContext?.premounting),
    mediaRef: audioRef,
    mediaType: "audio",
    onAutoPlayError: null
  });
  useVolume({
    logLevel,
    mediaRef: audioRef,
    source: mediaElementSourceNode,
    volume: userPreferredVolume,
    shouldUseWebAudioApi: useWebAudioApi ?? false
  });
  const effectToUse = React.useInsertionEffect ?? React.useLayoutEffect;
  effectToUse(() => {
    return () => {
      requestAnimationFrame(() => {
        cleanupOnMediaTagUnmount();
      });
    };
  }, [cleanupOnMediaTagUnmount]);
  reactExports.useImperativeHandle(ref, () => {
    return audioRef.current;
  }, [audioRef]);
  const currentOnDurationCallback = reactExports.useRef(onDuration);
  currentOnDurationCallback.current = onDuration;
  reactExports.useEffect(() => {
    const { current } = audioRef;
    if (!current) {
      return;
    }
    if (current.duration) {
      currentOnDurationCallback.current?.(current.src, current.duration);
      return;
    }
    const onLoadedMetadata = () => {
      currentOnDurationCallback.current?.(current.src, current.duration);
    };
    current.addEventListener("loadedmetadata", onLoadedMetadata);
    return () => {
      current.removeEventListener("loadedmetadata", onLoadedMetadata);
    };
  }, [audioRef, src]);
  if (initialShouldPreMountAudioElements) {
    return null;
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("audio", {
    ref: audioRef,
    preload: "metadata",
    crossOrigin: crossOriginValue,
    ...propsToPass
  });
};
var AudioForPreview = reactExports.forwardRef(AudioForDevelopmentForwardRefFunction);
var AudioForRenderingRefForwardingFunction = (props, ref) => {
  const audioRef = reactExports.useRef(null);
  const {
    volume: volumeProp,
    playbackRate,
    allowAmplificationDuringRender,
    onDuration,
    toneFrequency,
    _remotionInternalNeedsDurationCalculation,
    _remotionInternalNativeLoopPassed,
    acceptableTimeShiftInSeconds,
    name,
    onNativeError,
    delayRenderRetries,
    delayRenderTimeoutInMilliseconds,
    loopVolumeCurveBehavior,
    pauseWhenBuffering,
    audioStreamIndex,
    ...nativeProps
  } = props;
  const absoluteFrame = useTimelinePosition();
  const volumePropFrame = useFrameForVolumeProp(loopVolumeCurveBehavior ?? "repeat");
  const frame = useCurrentFrame();
  const sequenceContext = reactExports.useContext(SequenceContext);
  const { registerRenderAsset, unregisterRenderAsset } = reactExports.useContext(RenderAssetManager);
  const { delayRender: delayRender2, continueRender: continueRender2 } = useDelayRender();
  const id = reactExports.useMemo(() => `audio-${random(props.src ?? "")}-${sequenceContext?.relativeFrom}-${sequenceContext?.cumulatedFrom}-${sequenceContext?.durationInFrames}`, [
    props.src,
    sequenceContext?.relativeFrom,
    sequenceContext?.cumulatedFrom,
    sequenceContext?.durationInFrames
  ]);
  const volume = evaluateVolume({
    volume: volumeProp,
    frame: volumePropFrame,
    mediaVolume: 1
  });
  warnAboutTooHighVolume(volume);
  reactExports.useImperativeHandle(ref, () => {
    return audioRef.current;
  }, []);
  reactExports.useEffect(() => {
    if (!props.src) {
      throw new Error("No src passed");
    }
    if (!window.remotion_audioEnabled) {
      return;
    }
    if (props.muted) {
      return;
    }
    if (volume <= 0) {
      return;
    }
    registerRenderAsset({
      type: "audio",
      src: getAbsoluteSrc(props.src),
      id,
      frame: absoluteFrame,
      volume,
      mediaFrame: frame,
      playbackRate: props.playbackRate ?? 1,
      toneFrequency: toneFrequency ?? 1,
      audioStartFrame: Math.max(0, -(sequenceContext?.relativeFrom ?? 0)),
      audioStreamIndex: audioStreamIndex ?? 0
    });
    return () => unregisterRenderAsset(id);
  }, [
    props.muted,
    props.src,
    registerRenderAsset,
    absoluteFrame,
    id,
    unregisterRenderAsset,
    volume,
    volumePropFrame,
    frame,
    playbackRate,
    props.playbackRate,
    toneFrequency,
    sequenceContext?.relativeFrom,
    audioStreamIndex
  ]);
  const { src } = props;
  const needsToRenderAudioTag = ref || _remotionInternalNeedsDurationCalculation;
  reactExports.useLayoutEffect(() => {
    if (window.process?.env?.NODE_ENV === "test") {
      return;
    }
    if (!needsToRenderAudioTag) {
      return;
    }
    const newHandle = delayRender2("Loading <Html5Audio> duration with src=" + src, {
      retries: delayRenderRetries ?? void 0,
      timeoutInMilliseconds: delayRenderTimeoutInMilliseconds ?? void 0
    });
    const { current } = audioRef;
    const didLoad = () => {
      if (current?.duration) {
        onDuration(current.src, current.duration);
      }
      continueRender2(newHandle);
    };
    if (current?.duration) {
      onDuration(current.src, current.duration);
      continueRender2(newHandle);
    } else {
      current?.addEventListener("loadedmetadata", didLoad, { once: true });
    }
    return () => {
      current?.removeEventListener("loadedmetadata", didLoad);
      continueRender2(newHandle);
    };
  }, [
    src,
    onDuration,
    needsToRenderAudioTag,
    delayRenderRetries,
    delayRenderTimeoutInMilliseconds,
    continueRender2,
    delayRender2
  ]);
  if (!needsToRenderAudioTag) {
    return null;
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("audio", {
    ref: audioRef,
    ...nativeProps,
    onError: onNativeError
  });
};
var AudioForRendering = reactExports.forwardRef(AudioForRenderingRefForwardingFunction);
var AudioRefForwardingFunction = (props, ref) => {
  const audioTagsContext = reactExports.useContext(SharedAudioTagsContext);
  const {
    startFrom,
    endAt,
    trimBefore,
    trimAfter,
    name,
    stack,
    pauseWhenBuffering,
    showInTimeline,
    onError: onRemotionError,
    ...otherProps
  } = props;
  const { loop, ...propsOtherThanLoop } = props;
  const { fps } = useVideoConfig();
  const environment = useRemotionEnvironment();
  if (environment.isClientSideRendering) {
    throw new Error("<Html5Audio> is not supported in @remotion/web-renderer. Use <Audio> from @remotion/media instead. See https://remotion.dev/docs/client-side-rendering/limitations");
  }
  const { durations, setDurations } = reactExports.useContext(DurationsContext);
  if (typeof props.src !== "string") {
    throw new TypeError(`The \`<Html5Audio>\` tag requires a string for \`src\`, but got ${JSON.stringify(props.src)} instead.`);
  }
  const preloadedSrc = usePreload(props.src);
  const onError = reactExports.useCallback((e) => {
    console.log(e.currentTarget.error);
    const errMessage = `Could not play audio with src ${preloadedSrc}: ${e.currentTarget.error}. See https://remotion.dev/docs/media-playback-error for help.`;
    if (loop) {
      if (onRemotionError) {
        onRemotionError(new Error(errMessage));
        return;
      }
      cancelRender(new Error(errMessage));
    } else {
      onRemotionError?.(new Error(errMessage));
      console.warn(errMessage);
    }
  }, [loop, onRemotionError, preloadedSrc]);
  const onDuration = reactExports.useCallback((src, durationInSeconds) => {
    setDurations({ type: "got-duration", durationInSeconds, src });
  }, [setDurations]);
  const durationFetched = durations[getAbsoluteSrc(preloadedSrc)] ?? durations[getAbsoluteSrc(props.src)];
  validateMediaTrimProps({ startFrom, endAt, trimBefore, trimAfter });
  const { trimBeforeValue, trimAfterValue } = resolveTrimProps({
    startFrom,
    endAt,
    trimBefore,
    trimAfter
  });
  if (loop && durationFetched !== void 0) {
    if (!Number.isFinite(durationFetched)) {
      return /* @__PURE__ */ jsxRuntimeExports.jsx(Html5Audio, {
        ...propsOtherThanLoop,
        ref,
        _remotionInternalNativeLoopPassed: true
      });
    }
    const duration = durationFetched * fps;
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Loop, {
      layout: "none",
      durationInFrames: calculateMediaDuration({
        trimAfter: trimAfterValue,
        mediaDurationInFrames: duration,
        playbackRate: props.playbackRate ?? 1,
        trimBefore: trimBeforeValue
      }),
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Html5Audio, {
        ...propsOtherThanLoop,
        ref,
        _remotionInternalNativeLoopPassed: true
      })
    });
  }
  if (typeof trimBeforeValue !== "undefined" || typeof trimAfterValue !== "undefined") {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Sequence, {
      layout: "none",
      from: 0 - (trimBeforeValue ?? 0),
      showInTimeline: false,
      durationInFrames: trimAfterValue,
      name,
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Html5Audio, {
        _remotionInternalNeedsDurationCalculation: Boolean(loop),
        pauseWhenBuffering: pauseWhenBuffering ?? false,
        ...otherProps,
        ref
      })
    });
  }
  validateMediaProps({ playbackRate: props.playbackRate, volume: props.volume }, "Html5Audio");
  if (environment.isRendering) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(AudioForRendering, {
      onDuration,
      ...props,
      ref,
      onNativeError: onError,
      _remotionInternalNeedsDurationCalculation: Boolean(loop)
    });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AudioForPreview, {
    _remotionInternalNativeLoopPassed: props._remotionInternalNativeLoopPassed ?? false,
    _remotionInternalStack: stack ?? null,
    shouldPreMountAudioTags: audioTagsContext !== null && audioTagsContext.numberOfAudioTags > 0,
    ...props,
    ref,
    onNativeError: onError,
    onDuration,
    pauseWhenBuffering: pauseWhenBuffering ?? false,
    _remotionInternalNeedsDurationCalculation: Boolean(loop),
    showInTimeline: showInTimeline ?? true
  });
};
var Html5Audio = reactExports.forwardRef(AudioRefForwardingFunction);
addSequenceStackTraces(Html5Audio);
var NEWTON_ITERATIONS = 4;
var NEWTON_MIN_SLOPE = 1e-3;
var SUBDIVISION_PRECISION = 1e-7;
var SUBDIVISION_MAX_ITERATIONS = 10;
var kSplineTableSize = 11;
var kSampleStepSize = 1 / (kSplineTableSize - 1);
var float32ArraySupported = typeof Float32Array === "function";
function a(aA1, aA2) {
  return 1 - 3 * aA2 + 3 * aA1;
}
function b(aA1, aA2) {
  return 3 * aA2 - 6 * aA1;
}
function c(aA1) {
  return 3 * aA1;
}
function calcBezier(aT, aA1, aA2) {
  return ((a(aA1, aA2) * aT + b(aA1, aA2)) * aT + c(aA1)) * aT;
}
function getSlope(aT, aA1, aA2) {
  return 3 * a(aA1, aA2) * aT * aT + 2 * b(aA1, aA2) * aT + c(aA1);
}
function binarySubdivide({
  aX,
  _aA,
  _aB,
  mX1,
  mX2
}) {
  let currentX;
  let currentT;
  let i = 0;
  let aA = _aA;
  let aB = _aB;
  do {
    currentT = aA + (aB - aA) / 2;
    currentX = calcBezier(currentT, mX1, mX2) - aX;
    if (currentX > 0) {
      aB = currentT;
    } else {
      aA = currentT;
    }
  } while (Math.abs(currentX) > SUBDIVISION_PRECISION && ++i < SUBDIVISION_MAX_ITERATIONS);
  return currentT;
}
function newtonRaphsonIterate(aX, _aGuessT, mX1, mX2) {
  let aGuessT = _aGuessT;
  for (let i = 0; i < NEWTON_ITERATIONS; ++i) {
    const currentSlope = getSlope(aGuessT, mX1, mX2);
    if (currentSlope === 0) {
      return aGuessT;
    }
    const currentX = calcBezier(aGuessT, mX1, mX2) - aX;
    aGuessT -= currentX / currentSlope;
  }
  return aGuessT;
}
function bezier(mX1, mY1, mX2, mY2) {
  if (!(mX1 >= 0 && mX1 <= 1 && mX2 >= 0 && mX2 <= 1)) {
    throw new Error("bezier x values must be in [0, 1] range");
  }
  const sampleValues = float32ArraySupported ? new Float32Array(kSplineTableSize) : new Array(kSplineTableSize);
  if (mX1 !== mY1 || mX2 !== mY2) {
    for (let i = 0; i < kSplineTableSize; ++i) {
      sampleValues[i] = calcBezier(i * kSampleStepSize, mX1, mX2);
    }
  }
  function getTForX(aX) {
    let intervalStart = 0;
    let currentSample = 1;
    const lastSample = kSplineTableSize - 1;
    for (; currentSample !== lastSample && sampleValues[currentSample] <= aX; ++currentSample) {
      intervalStart += kSampleStepSize;
    }
    --currentSample;
    const dist = (aX - sampleValues[currentSample]) / (sampleValues[currentSample + 1] - sampleValues[currentSample]);
    const guessForT = intervalStart + dist * kSampleStepSize;
    const initialSlope = getSlope(guessForT, mX1, mX2);
    if (initialSlope >= NEWTON_MIN_SLOPE) {
      return newtonRaphsonIterate(aX, guessForT, mX1, mX2);
    }
    if (initialSlope === 0) {
      return guessForT;
    }
    return binarySubdivide({
      aX,
      _aA: intervalStart,
      _aB: intervalStart + kSampleStepSize,
      mX1,
      mX2
    });
  }
  return function(x) {
    const clampedX = Math.min(1, Math.max(0, x));
    if (mX1 === mY1 && mX2 === mY2) {
      return clampedX;
    }
    if (clampedX === 0) {
      return 0;
    }
    if (clampedX === 1) {
      return 1;
    }
    return calcBezier(getTForX(clampedX), mY1, mY2);
  };
}
var clampUnit = (t) => Math.min(1, Math.max(0, t));
class Easing {
  static step0(n) {
    return n > 0 ? 1 : 0;
  }
  static step1(n) {
    return n >= 1 ? 1 : 0;
  }
  static linear(t) {
    return t;
  }
  static ease(t) {
    return Easing.bezier(0.42, 0, 1, 1)(t);
  }
  static quad(t) {
    return t * t;
  }
  static cubic(t) {
    return t * t * t;
  }
  static poly(n) {
    return (t) => t ** n;
  }
  static sin(t) {
    return 1 - Math.cos(t * Math.PI / 2);
  }
  static circle(t) {
    const u = clampUnit(t);
    return 1 - Math.sqrt(1 - u * u);
  }
  static exp(t) {
    return 2 ** (10 * (t - 1));
  }
  static elastic(bounciness = 1) {
    const p = bounciness * Math.PI;
    return (t) => 1 - Math.cos(t * Math.PI / 2) ** 3 * Math.cos(t * p);
  }
  static back(s = 1.70158) {
    return (t) => t * t * ((s + 1) * t - s);
  }
  static bounce(t) {
    const u = clampUnit(t);
    if (u < 1 / 2.75) {
      return 7.5625 * u * u;
    }
    if (u < 2 / 2.75) {
      const t2_ = u - 1.5 / 2.75;
      return 7.5625 * t2_ * t2_ + 0.75;
    }
    if (u < 2.5 / 2.75) {
      const t2_ = u - 2.25 / 2.75;
      return 7.5625 * t2_ * t2_ + 0.9375;
    }
    const t2 = u - 2.625 / 2.75;
    return 7.5625 * t2 * t2 + 0.984375;
  }
  static bezier(x1, y1, x2, y2) {
    return bezier(x1, y1, x2, y2);
  }
  static in(easing) {
    return easing;
  }
  static out(easing) {
    return (t) => 1 - easing(1 - t);
  }
  static inOut(easing) {
    return (t) => {
      if (t < 0.5) {
        return easing(t * 2) / 2;
      }
      return 1 - easing((1 - t) * 2) / 2;
    };
  }
}
var IFrameRefForwarding = ({
  onLoad,
  onError,
  delayRenderRetries,
  delayRenderTimeoutInMilliseconds,
  ...props2
}, ref) => {
  const { delayRender: delayRender2, continueRender: continueRender2 } = useDelayRender();
  const [handle] = reactExports.useState(() => delayRender2(`Loading <IFrame> with source ${props2.src}`, {
    retries: delayRenderRetries ?? void 0,
    timeoutInMilliseconds: delayRenderTimeoutInMilliseconds ?? void 0
  }));
  const didLoad = reactExports.useCallback((e) => {
    continueRender2(handle);
    onLoad?.(e);
  }, [handle, onLoad, continueRender2]);
  const didGetError = reactExports.useCallback((e) => {
    continueRender2(handle);
    if (onError) {
      onError(e);
    } else {
      console.error("Error loading iframe:", e, "Handle the event using the onError() prop to make this message disappear.");
    }
  }, [handle, onError, continueRender2]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("iframe", {
    referrerPolicy: "strict-origin-when-cross-origin",
    ...props2,
    ref,
    onError: didGetError,
    onLoad: didLoad
  });
};
reactExports.forwardRef(IFrameRefForwarding);
function exponentialBackoff(errorCount) {
  return 1e3 * 2 ** (errorCount - 1);
}
function truncateSrcForLabel(src) {
  if (src.startsWith("data:") && src.length > 100) {
    return src.slice(0, 60) + "...[" + src.length + " chars total]";
  }
  return src;
}
var ImgInner = ({
  onError,
  maxRetries = 2,
  src,
  pauseWhenLoading,
  delayRenderRetries,
  delayRenderTimeoutInMilliseconds,
  onImageFrame,
  crossOrigin,
  showInTimeline,
  name,
  stack,
  ref,
  _experimentalControls: controls,
  ...props2
}) => {
  const imageRef = reactExports.useRef(null);
  const errors = reactExports.useRef({});
  const { delayPlayback } = useBufferState();
  const sequenceContext = reactExports.useContext(SequenceContext);
  const [timelineId] = reactExports.useState(() => String(Math.random()));
  if (!src) {
    throw new Error('No "src" prop was passed to <Img>.');
  }
  reactExports.useImperativeHandle(ref, () => {
    return imageRef.current;
  }, []);
  useImageInTimeline({
    src,
    displayName: name ?? null,
    id: timelineId,
    stack: stack ?? null,
    showInTimeline: showInTimeline ?? true,
    premountDisplay: sequenceContext?.premountDisplay ?? null,
    postmountDisplay: sequenceContext?.postmountDisplay ?? null,
    loopDisplay: void 0,
    controls: controls ?? null
  });
  const actualSrc = usePreload(src);
  const retryIn = reactExports.useCallback((timeout) => {
    if (!imageRef.current) {
      return;
    }
    const currentSrc = imageRef.current.src;
    setTimeout(() => {
      if (!imageRef.current) {
        return;
      }
      const newSrc = imageRef.current?.src;
      if (newSrc !== currentSrc) {
        return;
      }
      imageRef.current.removeAttribute("src");
      imageRef.current.setAttribute("src", newSrc);
    }, timeout);
  }, []);
  const { delayRender: delayRender2, continueRender: continueRender2, cancelRender: cancelRender2 } = useDelayRender();
  const didGetError = reactExports.useCallback((e) => {
    if (!errors.current) {
      return;
    }
    errors.current[imageRef.current?.src] = (errors.current[imageRef.current?.src] ?? 0) + 1;
    if (onError && (errors.current[imageRef.current?.src] ?? 0) > maxRetries) {
      onError(e);
      return;
    }
    if ((errors.current[imageRef.current?.src] ?? 0) <= maxRetries) {
      const backoff = exponentialBackoff(errors.current[imageRef.current?.src] ?? 0);
      console.warn(`Could not load image with source ${truncateSrcForLabel(imageRef.current?.src)}, retrying again in ${backoff}ms`);
      retryIn(backoff);
      return;
    }
    try {
      cancelRender2("Error loading image with src: " + truncateSrcForLabel(imageRef.current?.src));
    } catch {
    }
  }, [cancelRender2, maxRetries, onError, retryIn]);
  if (typeof window !== "undefined") {
    const isPremounting = Boolean(sequenceContext?.premounting);
    const isPostmounting = Boolean(sequenceContext?.postmounting);
    reactExports.useLayoutEffect(() => {
      if (window.process?.env?.NODE_ENV === "test") {
        if (imageRef.current) {
          imageRef.current.src = actualSrc;
        }
        return;
      }
      const { current } = imageRef;
      if (!current) {
        return;
      }
      const newHandle = delayRender2("Loading <Img> with src=" + truncateSrcForLabel(actualSrc), {
        retries: delayRenderRetries ?? void 0,
        timeoutInMilliseconds: delayRenderTimeoutInMilliseconds ?? void 0
      });
      const unblock = pauseWhenLoading && !isPremounting && !isPostmounting ? delayPlayback().unblock : () => {
        return;
      };
      let unmounted = false;
      const onComplete = () => {
        if (unmounted) {
          continueRender2(newHandle);
          return;
        }
        if ((errors.current[imageRef.current?.src] ?? 0) > 0) {
          delete errors.current[imageRef.current?.src];
          console.info(`Retry successful - ${truncateSrcForLabel(imageRef.current?.src)} is now loaded`);
        }
        if (current) {
          onImageFrame?.(current);
        }
        unblock();
        continueRender2(newHandle);
      };
      if (!imageRef.current) {
        onComplete();
        return;
      }
      current.src = actualSrc;
      current.decode().then(onComplete).catch((err) => {
        console.warn(err);
        if (current.complete && current.naturalWidth > 0 && current.naturalHeight > 0) {
          onComplete();
        } else {
          current.addEventListener("load", onComplete);
        }
      });
      return () => {
        unmounted = true;
        current.removeEventListener("load", onComplete);
        unblock();
        continueRender2(newHandle);
      };
    }, [
      actualSrc,
      delayPlayback,
      delayRenderRetries,
      delayRenderTimeoutInMilliseconds,
      pauseWhenLoading,
      isPremounting,
      isPostmounting,
      onImageFrame,
      continueRender2,
      delayRender2
    ]);
  }
  const { isClientSideRendering } = useRemotionEnvironment();
  const crossOriginValue = getCrossOriginValue({
    crossOrigin,
    requestsVideoFrame: false,
    isClientSideRendering
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsx("img", {
    ...props2,
    ref: imageRef,
    crossOrigin: crossOriginValue,
    onError: didGetError,
    decoding: "sync"
  });
};
var Img = wrapInSchema(ImgInner, sequenceStyleSchema);
addSequenceStackTraces(Img);
var compositionsRef = React.createRef();
var CompositionManagerProvider = ({
  children,
  onlyRenderComposition,
  currentCompositionMetadata,
  initialCompositions,
  initialCanvasContent
}) => {
  const [folders, setFolders] = reactExports.useState([]);
  const [canvasContent, setCanvasContent] = reactExports.useState(initialCanvasContent);
  const [compositions, setCompositions] = reactExports.useState(initialCompositions);
  const currentcompositionsRef = reactExports.useRef(compositions);
  const updateCompositions = reactExports.useCallback((updateComps) => {
    setCompositions((comps) => {
      const updated = updateComps(comps);
      currentcompositionsRef.current = updated;
      return updated;
    });
  }, []);
  const registerComposition = reactExports.useCallback((comp) => {
    updateCompositions((comps) => {
      if (comps.find((c2) => c2.id === comp.id)) {
        throw new Error(`Multiple composition with id ${comp.id} are registered.`);
      }
      return [...comps, comp];
    });
  }, [updateCompositions]);
  const unregisterComposition = reactExports.useCallback((id) => {
    setCompositions((comps) => {
      return comps.filter((c2) => c2.id !== id);
    });
  }, []);
  const registerFolder = reactExports.useCallback((name, parent, nonce) => {
    setFolders((prevFolders) => {
      return [
        ...prevFolders,
        {
          name,
          parent,
          nonce
        }
      ];
    });
  }, []);
  const unregisterFolder = reactExports.useCallback((name, parent) => {
    setFolders((prevFolders) => {
      return prevFolders.filter((p) => !(p.name === name && p.parent === parent));
    });
  }, []);
  reactExports.useImperativeHandle(compositionsRef, () => {
    return {
      getCompositions: () => currentcompositionsRef.current
    };
  }, []);
  const compositionManagerSetters = reactExports.useMemo(() => {
    return {
      registerComposition,
      unregisterComposition,
      registerFolder,
      unregisterFolder,
      setCanvasContent,
      onlyRenderComposition
    };
  }, [
    registerComposition,
    registerFolder,
    unregisterComposition,
    unregisterFolder,
    onlyRenderComposition
  ]);
  const compositionManagerContextValue = reactExports.useMemo(() => {
    return {
      compositions,
      folders,
      currentCompositionMetadata,
      canvasContent
    };
  }, [compositions, folders, currentCompositionMetadata, canvasContent]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(CompositionManager.Provider, {
    value: compositionManagerContextValue,
    children: /* @__PURE__ */ jsxRuntimeExports.jsx(CompositionSetters.Provider, {
      value: compositionManagerSetters,
      children
    })
  });
};
var exports_default_css = {};
__export(exports_default_css, {
  makeDefaultPreviewCSS: () => makeDefaultPreviewCSS,
  injectCSS: () => injectCSS,
  OBJECTFIT_CONTAIN_CLASS_NAME: () => OBJECTFIT_CONTAIN_CLASS_NAME
});
var injected = {};
var injectCSS = (css) => {
  if (typeof document === "undefined") {
    return () => {
    };
  }
  if (injected[css]) {
    return () => {
    };
  }
  const head = document.head || document.getElementsByTagName("head")[0];
  const style2 = document.createElement("style");
  style2.appendChild(document.createTextNode(css));
  head.prepend(style2);
  injected[css] = style2;
  return () => {
    const styleElement = injected[css];
    if (styleElement) {
      if (styleElement.parentNode) {
        styleElement.parentNode.removeChild(styleElement);
      }
      delete injected[css];
    }
  };
};
var OBJECTFIT_CONTAIN_CLASS_NAME = "__remotion_objectfitcontain";
var makeDefaultPreviewCSS = (scope, backgroundColor) => {
  if (!scope) {
    return `
    * {
      box-sizing: border-box;
    }
    body {
      margin: 0;
	    background-color: ${backgroundColor};
    }
    .${OBJECTFIT_CONTAIN_CLASS_NAME} {
      object-fit: contain;
    }
    `;
  }
  return `
    ${scope} * {
      box-sizing: border-box;
    }
    ${scope} *:-webkit-full-screen {
      width: 100%;
      height: 100%;
    }
    ${scope} .${OBJECTFIT_CONTAIN_CLASS_NAME} {
      object-fit: contain;
    }
  `;
};
var defineEffect = (definition) => definition;
var createDescriptor = (definition, params) => {
  const widened = definition;
  return {
    definition: widened,
    params,
    stack: new Error().stack,
    effectKey: widened.calculateKey(params),
    memoized: false
  };
};
var REMOTION_STUDIO_CONTAINER_ELEMENT = "__remotion-studio-container";
var getPreviewDomElement = () => {
  return document.getElementById(REMOTION_STUDIO_CONTAINER_ELEMENT);
};
var MaxMediaCacheSizeContext = React.createContext(null);
var Root = null;
var listeners = [];
var getRoot = () => {
  return Root;
};
var waitForRoot = (fn) => {
  listeners.push(fn);
  return () => {
    listeners = listeners.filter((l) => l !== fn);
  };
};
var MediaEnabledContext = reactExports.createContext(null);
var useVideoEnabled = () => {
  const context = reactExports.useContext(MediaEnabledContext);
  if (!context) {
    return window.remotion_videoEnabled;
  }
  if (context.videoEnabled === null) {
    return window.remotion_videoEnabled;
  }
  return context.videoEnabled;
};
var useAudioEnabled = () => {
  const context = reactExports.useContext(MediaEnabledContext);
  if (!context) {
    return window.remotion_audioEnabled;
  }
  if (context.audioEnabled === null) {
    return window.remotion_audioEnabled;
  }
  return context.audioEnabled;
};
var MediaEnabledProvider = ({
  children,
  videoEnabled,
  audioEnabled
}) => {
  const value = reactExports.useMemo(() => ({ videoEnabled, audioEnabled }), [videoEnabled, audioEnabled]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(MediaEnabledContext.Provider, {
    value,
    children
  });
};
var RemotionRootContexts = ({
  children,
  numberOfAudioTags,
  logLevel,
  audioLatencyHint,
  videoEnabled,
  audioEnabled,
  frameState
}) => {
  const nonceContext = reactExports.useMemo(() => {
    let counter = 0;
    return {
      getNonce: () => counter++
    };
  }, []);
  const logging = reactExports.useMemo(() => {
    return { logLevel, mountTime: Date.now() };
  }, [logLevel]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(LogLevelContext.Provider, {
    value: logging,
    children: /* @__PURE__ */ jsxRuntimeExports.jsx(NonceContext.Provider, {
      value: nonceContext,
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(TimelineContextProvider, {
        frameState,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(MediaEnabledProvider, {
          videoEnabled,
          audioEnabled,
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(EditorPropsProvider, {
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(PrefetchProvider, {
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(SequenceManagerProvider, {
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(DurationsContextProvider, {
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(BufferingProvider, {
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(SharedAudioContextProvider, {
                      audioLatencyHint,
                      audioEnabled,
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(SharedAudioTagsContextProvider, {
                        numberOfAudioTags,
                        children
                      })
                    })
                  })
                })
              })
            })
          })
        })
      })
    })
  });
};
var validCodecs = [
  "h264",
  "h265",
  "vp8",
  "vp9",
  "av1",
  "mp3",
  "aac",
  "wav",
  "prores",
  "h264-mkv",
  "h264-ts",
  "gif"
];
function validateCodec(defaultCodec, location, name) {
  if (typeof defaultCodec === "undefined") {
    return;
  }
  if (typeof defaultCodec !== "string") {
    throw new TypeError(`The "${name}" prop ${location} must be a string, but you passed a value of type ${typeof defaultCodec}.`);
  }
  if (!validCodecs.includes(defaultCodec)) {
    throw new Error(`The "${name}" prop ${location} must be one of ${validCodecs.join(", ")}, but you passed ${defaultCodec}.`);
  }
}
var validateCalculated = ({
  calculated,
  compositionId,
  compositionFps,
  compositionHeight,
  compositionWidth,
  compositionDurationInFrames
}) => {
  const calculateMetadataErrorLocation = `calculated by calculateMetadata() for the composition "${compositionId}"`;
  const defaultErrorLocation = `of the "<Composition />" component with the id "${compositionId}"`;
  const width = calculated?.width ?? compositionWidth ?? void 0;
  validateDimension$2(width, "width", calculated?.width ? calculateMetadataErrorLocation : defaultErrorLocation);
  const height = calculated?.height ?? compositionHeight ?? void 0;
  validateDimension$2(height, "height", calculated?.height ? calculateMetadataErrorLocation : defaultErrorLocation);
  const fps = calculated?.fps ?? compositionFps ?? null;
  validateFps$2(fps, calculated?.fps ? calculateMetadataErrorLocation : defaultErrorLocation);
  const durationInFrames = calculated?.durationInFrames ?? compositionDurationInFrames ?? null;
  validateDurationInFrames$2(durationInFrames, {
    allowFloats: false,
    component: `of the "<Composition />" component with the id "${compositionId}"`
  });
  const defaultCodec = calculated?.defaultCodec;
  validateCodec(defaultCodec, calculateMetadataErrorLocation, "defaultCodec");
  const defaultOutName = calculated?.defaultOutName;
  const defaultVideoImageFormat = calculated?.defaultVideoImageFormat;
  const defaultPixelFormat = calculated?.defaultPixelFormat;
  const defaultProResProfile = calculated?.defaultProResProfile;
  const defaultSampleRate = calculated?.defaultSampleRate;
  return {
    width,
    height,
    fps,
    durationInFrames,
    defaultCodec,
    defaultOutName,
    defaultVideoImageFormat,
    defaultPixelFormat,
    defaultProResProfile,
    defaultSampleRate
  };
};
var resolveVideoConfig = ({
  calculateMetadata,
  signal,
  defaultProps,
  inputProps: originalProps,
  compositionId,
  compositionDurationInFrames,
  compositionFps,
  compositionHeight,
  compositionWidth
}) => {
  const calculatedProm = calculateMetadata ? calculateMetadata({
    defaultProps,
    props: originalProps,
    abortSignal: signal,
    compositionId,
    isRendering: getRemotionEnvironment().isRendering
  }) : null;
  if (calculatedProm !== null && typeof calculatedProm === "object" && "then" in calculatedProm) {
    return calculatedProm.then((c2) => {
      const {
        height,
        width,
        durationInFrames,
        fps,
        defaultCodec,
        defaultOutName,
        defaultVideoImageFormat,
        defaultPixelFormat,
        defaultProResProfile,
        defaultSampleRate
      } = validateCalculated({
        calculated: c2,
        compositionDurationInFrames,
        compositionFps,
        compositionHeight,
        compositionWidth,
        compositionId
      });
      return {
        width,
        height,
        fps,
        durationInFrames,
        id: compositionId,
        defaultProps: serializeThenDeserializeInStudio(defaultProps),
        props: serializeThenDeserializeInStudio(c2.props ?? originalProps),
        defaultCodec: defaultCodec ?? null,
        defaultOutName: defaultOutName ?? null,
        defaultVideoImageFormat: defaultVideoImageFormat ?? null,
        defaultPixelFormat: defaultPixelFormat ?? null,
        defaultProResProfile: defaultProResProfile ?? null,
        defaultSampleRate: defaultSampleRate ?? null
      };
    });
  }
  const data = validateCalculated({
    calculated: calculatedProm,
    compositionDurationInFrames,
    compositionFps,
    compositionHeight,
    compositionWidth,
    compositionId
  });
  if (calculatedProm === null) {
    return {
      ...data,
      id: compositionId,
      defaultProps: serializeThenDeserializeInStudio(defaultProps ?? {}),
      props: serializeThenDeserializeInStudio(originalProps),
      defaultCodec: null,
      defaultOutName: null,
      defaultVideoImageFormat: null,
      defaultPixelFormat: null,
      defaultProResProfile: null,
      defaultSampleRate: null
    };
  }
  return {
    ...data,
    id: compositionId,
    defaultProps: serializeThenDeserializeInStudio(defaultProps ?? {}),
    props: serializeThenDeserializeInStudio(calculatedProm.props ?? originalProps),
    defaultCodec: calculatedProm.defaultCodec ?? null,
    defaultOutName: calculatedProm.defaultOutName ?? null,
    defaultVideoImageFormat: calculatedProm.defaultVideoImageFormat ?? null,
    defaultPixelFormat: calculatedProm.defaultPixelFormat ?? null,
    defaultProResProfile: calculatedProm.defaultProResProfile ?? null,
    defaultSampleRate: calculatedProm.defaultSampleRate ?? null
  };
};
var resolveVideoConfigOrCatch = (params) => {
  try {
    const promiseOrReturnValue = resolveVideoConfig(params);
    return {
      type: "success",
      result: promiseOrReturnValue
    };
  } catch (err) {
    return {
      type: "error",
      error: err
    };
  }
};
var SequenceStackTracesUpdateContext = React.createContext(() => {
});
var getEnvVariables = () => {
  if (getRemotionEnvironment().isRendering) {
    const param = window.remotion_envVariables;
    if (!param) {
      return {};
    }
    return { ...JSON.parse(param), NODE_ENV: "production" };
  }
  return {
    NODE_ENV: "production"
  };
};
var setupEnvVariables = () => {
  const env = getEnvVariables();
  if (!window.process) {
    window.process = {};
  }
  if (!window.process.env) {
    window.process.env = {};
  }
  Object.keys(env).forEach((key) => {
    window.process.env[key] = env[key];
  });
};
var CurrentScaleContext = React.createContext(null);
var PreviewSizeContext = reactExports.createContext({
  setSize: () => {
    return;
  },
  size: { size: "auto", translation: { x: 0, y: 0 } }
});
var calculateScale = ({
  canvasSize,
  compositionHeight,
  compositionWidth,
  previewSize
}) => {
  const heightRatio = canvasSize.height / compositionHeight;
  const widthRatio = canvasSize.width / compositionWidth;
  const ratio = Math.min(heightRatio, widthRatio);
  if (previewSize === "auto") {
    if (ratio === 0) {
      return 1;
    }
    return ratio;
  }
  return Number(previewSize);
};
var getOffthreadVideoSource = ({
  src,
  transparent,
  currentTime,
  toneMapped
}) => {
  return `http://localhost:${window.remotion_proxyPort}/proxy?src=${encodeURIComponent(getAbsoluteSrc(src))}&time=${encodeURIComponent(Math.max(0, currentTime))}&transparent=${String(transparent)}&toneMapped=${String(toneMapped)}`;
};
var OffthreadVideoForRendering = ({
  onError,
  volume: volumeProp,
  playbackRate,
  src,
  muted,
  allowAmplificationDuringRender,
  transparent,
  toneMapped,
  toneFrequency,
  name,
  loopVolumeCurveBehavior,
  delayRenderRetries,
  delayRenderTimeoutInMilliseconds,
  onVideoFrame,
  crossOrigin,
  audioStreamIndex,
  ...props2
}) => {
  const absoluteFrame = useTimelinePosition();
  const frame = useCurrentFrame();
  const volumePropsFrame = useFrameForVolumeProp(loopVolumeCurveBehavior);
  const videoConfig = useUnsafeVideoConfig();
  const sequenceContext = reactExports.useContext(SequenceContext);
  const mediaStartsAt = useMediaStartsAt();
  const { registerRenderAsset, unregisterRenderAsset } = reactExports.useContext(RenderAssetManager);
  if (!src) {
    throw new TypeError("No `src` was passed to <OffthreadVideo>.");
  }
  const id = reactExports.useMemo(() => `offthreadvideo-${random(src)}-${sequenceContext?.cumulatedFrom}-${sequenceContext?.relativeFrom}-${sequenceContext?.durationInFrames}`, [
    src,
    sequenceContext?.cumulatedFrom,
    sequenceContext?.relativeFrom,
    sequenceContext?.durationInFrames
  ]);
  if (!videoConfig) {
    throw new Error("No video config found");
  }
  const volume = evaluateVolume({
    volume: volumeProp,
    frame: volumePropsFrame,
    mediaVolume: 1
  });
  warnAboutTooHighVolume(volume);
  reactExports.useEffect(() => {
    if (!src) {
      throw new Error("No src passed");
    }
    if (!window.remotion_audioEnabled) {
      return;
    }
    if (muted) {
      return;
    }
    if (volume <= 0) {
      return;
    }
    registerRenderAsset({
      type: "video",
      src: getAbsoluteSrc(src),
      id,
      frame: absoluteFrame,
      volume,
      mediaFrame: frame,
      playbackRate,
      toneFrequency,
      audioStartFrame: Math.max(0, -(sequenceContext?.relativeFrom ?? 0)),
      audioStreamIndex
    });
    return () => unregisterRenderAsset(id);
  }, [
    muted,
    src,
    registerRenderAsset,
    id,
    unregisterRenderAsset,
    volume,
    frame,
    absoluteFrame,
    playbackRate,
    toneFrequency,
    sequenceContext?.relativeFrom,
    audioStreamIndex
  ]);
  const currentTime = reactExports.useMemo(() => {
    return getExpectedMediaFrameUncorrected({
      frame,
      playbackRate: playbackRate || 1,
      startFrom: -mediaStartsAt
    }) / videoConfig.fps;
  }, [frame, mediaStartsAt, playbackRate, videoConfig.fps]);
  const actualSrc = reactExports.useMemo(() => {
    return getOffthreadVideoSource({
      src,
      currentTime,
      transparent,
      toneMapped
    });
  }, [toneMapped, currentTime, src, transparent]);
  const [imageSrc, setImageSrc] = reactExports.useState(null);
  const { delayRender: delayRender2, continueRender: continueRender2 } = useDelayRender();
  reactExports.useLayoutEffect(() => {
    if (!window.remotion_videoEnabled) {
      return;
    }
    const cleanup = [];
    setImageSrc(null);
    const controller = new AbortController();
    const newHandle = delayRender2(`Fetching ${actualSrc} from server`, {
      retries: delayRenderRetries ?? void 0,
      timeoutInMilliseconds: delayRenderTimeoutInMilliseconds ?? void 0
    });
    const execute = async () => {
      try {
        const res = await fetch(actualSrc, {
          signal: controller.signal,
          cache: "no-store"
        });
        if (res.status !== 200) {
          if (res.status === 500) {
            const json = await res.json();
            if (json.error) {
              const cleanedUpErrorMessage = json.error.replace(/^Error: /, "");
              throw new Error(cleanedUpErrorMessage);
            }
          }
          throw new Error(`Server returned status ${res.status} while fetching ${actualSrc}`);
        }
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        cleanup.push(() => URL.revokeObjectURL(url));
        setImageSrc({
          src: url,
          handle: newHandle
        });
      } catch (err) {
        if (err.message.includes("aborted")) {
          continueRender2(newHandle);
          return;
        }
        if (controller.signal.aborted) {
          continueRender2(newHandle);
          return;
        }
        if (err.message.includes("Failed to fetch")) {
          err = new Error(`Failed to fetch ${actualSrc}. This could be caused by Chrome rejecting the request because the disk space is low. Consider increasing the disk size of your environment.`, { cause: err });
        }
        if (onError) {
          onError(err);
        } else {
          cancelRender(err);
        }
      }
    };
    execute();
    cleanup.push(() => {
      if (controller.signal.aborted) {
        return;
      }
      controller.abort();
    });
    return () => {
      cleanup.forEach((c2) => c2());
    };
  }, [
    actualSrc,
    delayRenderRetries,
    delayRenderTimeoutInMilliseconds,
    onError,
    continueRender2,
    delayRender2
  ]);
  const onErr = reactExports.useCallback(() => {
    if (onError) {
      onError?.(new Error("Failed to load image with src " + imageSrc));
    } else {
      cancelRender("Failed to load image with src " + imageSrc);
    }
  }, [imageSrc, onError]);
  const className2 = reactExports.useMemo(() => {
    return [OBJECTFIT_CONTAIN_CLASS_NAME, props2.className].filter(truthy).join(" ");
  }, [props2.className]);
  const onImageFrame = reactExports.useCallback((img) => {
    if (onVideoFrame) {
      onVideoFrame(img);
    }
  }, [onVideoFrame]);
  if (!imageSrc || !window.remotion_videoEnabled) {
    return null;
  }
  continueRender2(imageSrc.handle);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Img, {
    src: imageSrc.src,
    delayRenderRetries,
    delayRenderTimeoutInMilliseconds,
    onImageFrame,
    ...props2,
    onError: onErr,
    className: className2
  });
};
var useEmitVideoFrame = ({
  ref,
  onVideoFrame
}) => {
  reactExports.useEffect(() => {
    const { current } = ref;
    if (!current) {
      return;
    }
    if (!onVideoFrame) {
      return;
    }
    let handle = 0;
    const callback = () => {
      if (!ref.current) {
        return;
      }
      onVideoFrame(ref.current);
      handle = ref.current.requestVideoFrameCallback(callback);
    };
    callback();
    return () => {
      current.cancelVideoFrameCallback(handle);
    };
  }, [onVideoFrame, ref]);
};
class MediaPlaybackError extends Error {
  src;
  constructor({ message, src }) {
    super(message);
    this.name = "MediaPlaybackError";
    this.src = src;
  }
}
var VideoForDevelopmentRefForwardingFunction = (props2, ref) => {
  const context = reactExports.useContext(SharedAudioContext);
  if (!context) {
    throw new Error("SharedAudioContext not found");
  }
  const videoRef = reactExports.useRef(null);
  const sharedSource = reactExports.useMemo(() => {
    if (!context.audioContext) {
      return null;
    }
    return makeSharedElementSourceNode({
      audioContext: context.audioContext,
      ref: videoRef
    });
  }, [context.audioContext]);
  const effectToUse = React.useInsertionEffect ?? React.useLayoutEffect;
  effectToUse(() => {
    return () => {
      requestAnimationFrame(() => {
        sharedSource?.cleanup();
      });
    };
  }, [sharedSource]);
  const {
    volume,
    muted,
    playbackRate,
    onlyWarnForMediaSeekingError,
    src,
    onDuration,
    acceptableTimeShift,
    acceptableTimeShiftInSeconds,
    toneFrequency,
    name,
    _remotionInternalNativeLoopPassed,
    _remotionInternalStack,
    style: style2,
    pauseWhenBuffering,
    showInTimeline,
    loopVolumeCurveBehavior,
    onError,
    onAutoPlayError,
    onVideoFrame,
    crossOrigin,
    delayRenderRetries,
    delayRenderTimeoutInMilliseconds,
    allowAmplificationDuringRender,
    useWebAudioApi,
    audioStreamIndex,
    ...nativeProps
  } = props2;
  const volumePropFrame = useFrameForVolumeProp(loopVolumeCurveBehavior ?? "repeat");
  const { fps, durationInFrames } = useVideoConfig();
  const parentSequence = reactExports.useContext(SequenceContext);
  const { hidden } = reactExports.useContext(SequenceVisibilityToggleContext);
  const logLevel = useLogLevel();
  const mountTime = useMountTime();
  const [timelineId] = reactExports.useState(() => String(Math.random()));
  const isSequenceHidden = hidden[timelineId] ?? false;
  if (typeof acceptableTimeShift !== "undefined") {
    throw new Error("acceptableTimeShift has been removed. Use acceptableTimeShiftInSeconds instead.");
  }
  const [mediaVolume] = useMediaVolumeState();
  const [mediaMuted] = useMediaMutedState();
  const userPreferredVolume = evaluateVolume({
    frame: volumePropFrame,
    volume,
    mediaVolume
  });
  warnAboutTooHighVolume(userPreferredVolume);
  useMediaInTimeline({
    volume,
    mediaVolume,
    mediaType: "video",
    src,
    playbackRate: props2.playbackRate ?? 1,
    displayName: name ?? null,
    id: timelineId,
    stack: _remotionInternalStack,
    showInTimeline,
    premountDisplay: parentSequence?.premountDisplay ?? null,
    postmountDisplay: parentSequence?.postmountDisplay ?? null,
    loopDisplay: void 0
  });
  useMediaPlayback({
    mediaRef: videoRef,
    src,
    mediaType: "video",
    playbackRate: props2.playbackRate ?? 1,
    onlyWarnForMediaSeekingError,
    acceptableTimeshift: acceptableTimeShiftInSeconds ?? null,
    isPremounting: Boolean(parentSequence?.premounting),
    isPostmounting: Boolean(parentSequence?.postmounting),
    pauseWhenBuffering,
    onAutoPlayError: onAutoPlayError ?? null
  });
  useMediaTag({
    id: timelineId,
    isPostmounting: Boolean(parentSequence?.postmounting),
    isPremounting: Boolean(parentSequence?.premounting),
    mediaRef: videoRef,
    mediaType: "video",
    onAutoPlayError: onAutoPlayError ?? null
  });
  useVolume({
    logLevel,
    mediaRef: videoRef,
    volume: userPreferredVolume,
    source: sharedSource,
    shouldUseWebAudioApi: useWebAudioApi ?? false
  });
  const actualFrom = parentSequence ? parentSequence.relativeFrom : 0;
  const duration = parentSequence ? Math.min(parentSequence.durationInFrames, durationInFrames) : durationInFrames;
  const preloadedSrc = usePreload(src);
  const actualSrc = useAppendVideoFragment({
    actualSrc: preloadedSrc,
    actualFrom,
    duration,
    fps
  });
  reactExports.useImperativeHandle(ref, () => {
    return videoRef.current;
  }, []);
  reactExports.useState(() => playbackLogging({
    logLevel,
    message: `Mounting video with source = ${actualSrc}, v=${VERSION}, user agent=${typeof navigator === "undefined" ? "server" : navigator.userAgent}`,
    tag: "video",
    mountTime
  }));
  reactExports.useEffect(() => {
    const { current } = videoRef;
    if (!current) {
      return;
    }
    const errorHandler = () => {
      if (current.error) {
        console.error("Error occurred in video", current?.error);
        if (onError) {
          const err = new MediaPlaybackError({
            message: `Code ${current.error.code}: ${current.error.message}`,
            src
          });
          onError(err);
          return;
        }
        throw new MediaPlaybackError({
          message: `The browser threw an error while playing the video ${src}: Code ${current.error.code} - ${current?.error?.message}. See https://remotion.dev/docs/media-playback-error for help. Pass an onError() prop to handle the error.`,
          src
        });
      } else {
        if (onError) {
          const err = new MediaPlaybackError({
            message: `The browser threw an error while playing the video ${src}`,
            src
          });
          onError(err);
          return;
        }
        throw new MediaPlaybackError({
          message: "The browser threw an error while playing the video",
          src
        });
      }
    };
    current.addEventListener("error", errorHandler, { once: true });
    return () => {
      current.removeEventListener("error", errorHandler);
    };
  }, [onError, src]);
  const currentOnDurationCallback = reactExports.useRef(onDuration);
  currentOnDurationCallback.current = onDuration;
  useEmitVideoFrame({ ref: videoRef, onVideoFrame });
  reactExports.useEffect(() => {
    const { current } = videoRef;
    if (!current) {
      return;
    }
    if (current.duration) {
      currentOnDurationCallback.current?.(src, current.duration);
      return;
    }
    const onLoadedMetadata = () => {
      currentOnDurationCallback.current?.(src, current.duration);
    };
    current.addEventListener("loadedmetadata", onLoadedMetadata);
    return () => {
      current.removeEventListener("loadedmetadata", onLoadedMetadata);
    };
  }, [src]);
  reactExports.useEffect(() => {
    const { current } = videoRef;
    if (!current) {
      return;
    }
    if (isIosSafari()) {
      current.preload = "metadata";
    } else {
      current.preload = "auto";
    }
  }, []);
  const actualStyle = reactExports.useMemo(() => {
    return {
      ...style2,
      opacity: isSequenceHidden ? 0 : style2?.opacity ?? 1
    };
  }, [isSequenceHidden, style2]);
  const crossOriginValue = getCrossOriginValue({
    crossOrigin,
    requestsVideoFrame: Boolean(onVideoFrame),
    isClientSideRendering: false
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsx("video", {
    ref: videoRef,
    muted: muted || mediaMuted || isSequenceHidden || userPreferredVolume <= 0,
    playsInline: true,
    src: actualSrc,
    loop: _remotionInternalNativeLoopPassed,
    style: actualStyle,
    disableRemotePlayback: true,
    crossOrigin: crossOriginValue,
    ...nativeProps
  });
};
var VideoForPreview = reactExports.forwardRef(VideoForDevelopmentRefForwardingFunction);
var InnerOffthreadVideo = (props2) => {
  const {
    startFrom,
    endAt,
    trimBefore,
    trimAfter,
    name,
    pauseWhenBuffering,
    stack,
    showInTimeline,
    ...otherProps
  } = props2;
  const environment = useRemotionEnvironment();
  if (environment.isClientSideRendering) {
    throw new Error("<OffthreadVideo> is not supported in @remotion/web-renderer. Use <Video> from @remotion/media instead. See https://remotion.dev/docs/client-side-rendering/limitations");
  }
  const onDuration = reactExports.useCallback(() => {
    return;
  }, []);
  if (typeof props2.src !== "string") {
    throw new TypeError(`The \`<OffthreadVideo>\` tag requires a string for \`src\`, but got ${JSON.stringify(props2.src)} instead.`);
  }
  validateMediaTrimProps({ startFrom, endAt, trimBefore, trimAfter });
  const { trimBeforeValue, trimAfterValue } = resolveTrimProps({
    startFrom,
    endAt,
    trimBefore,
    trimAfter
  });
  if (typeof trimBeforeValue !== "undefined" || typeof trimAfterValue !== "undefined") {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Sequence, {
      layout: "none",
      from: 0 - (trimBeforeValue ?? 0),
      showInTimeline: false,
      durationInFrames: trimAfterValue,
      name,
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(InnerOffthreadVideo, {
        pauseWhenBuffering: pauseWhenBuffering ?? false,
        ...otherProps,
        trimAfter: void 0,
        name: void 0,
        showInTimeline,
        trimBefore: void 0,
        stack: void 0,
        startFrom: void 0,
        endAt: void 0
      })
    });
  }
  validateMediaProps(props2, "Video");
  if (environment.isRendering) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(OffthreadVideoForRendering, {
      pauseWhenBuffering: pauseWhenBuffering ?? false,
      ...otherProps,
      trimAfter: void 0,
      name: void 0,
      showInTimeline,
      trimBefore: void 0,
      stack: void 0,
      startFrom: void 0,
      endAt: void 0
    });
  }
  const {
    transparent,
    toneMapped,
    onAutoPlayError,
    onVideoFrame,
    crossOrigin,
    delayRenderRetries,
    delayRenderTimeoutInMilliseconds,
    ...propsForPreview
  } = otherProps;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(VideoForPreview, {
    _remotionInternalStack: stack ?? null,
    onDuration,
    onlyWarnForMediaSeekingError: true,
    pauseWhenBuffering: pauseWhenBuffering ?? false,
    showInTimeline: showInTimeline ?? true,
    onAutoPlayError: onAutoPlayError ?? void 0,
    onVideoFrame: onVideoFrame ?? null,
    crossOrigin,
    ...propsForPreview,
    _remotionInternalNativeLoopPassed: false
  });
};
var OffthreadVideo = ({
  src,
  acceptableTimeShiftInSeconds,
  allowAmplificationDuringRender,
  audioStreamIndex,
  className: className2,
  crossOrigin,
  delayRenderRetries,
  delayRenderTimeoutInMilliseconds,
  id,
  loopVolumeCurveBehavior,
  muted,
  name,
  onAutoPlayError,
  onError,
  onVideoFrame,
  pauseWhenBuffering,
  playbackRate,
  showInTimeline,
  style: style2,
  toneFrequency,
  toneMapped,
  transparent,
  trimAfter,
  trimBefore,
  useWebAudioApi,
  volume,
  _remotionInternalNativeLoopPassed,
  endAt,
  stack,
  startFrom,
  imageFormat
}) => {
  if (imageFormat) {
    throw new TypeError(`The \`<OffthreadVideo>\` tag does no longer accept \`imageFormat\`. Use the \`transparent\` prop if you want to render a transparent video.`);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(InnerOffthreadVideo, {
    acceptableTimeShiftInSeconds,
    allowAmplificationDuringRender: allowAmplificationDuringRender ?? true,
    audioStreamIndex: audioStreamIndex ?? 0,
    className: className2,
    crossOrigin,
    delayRenderRetries,
    delayRenderTimeoutInMilliseconds,
    id,
    loopVolumeCurveBehavior: loopVolumeCurveBehavior ?? "repeat",
    muted: muted ?? false,
    name,
    onAutoPlayError: onAutoPlayError ?? null,
    onError,
    onVideoFrame,
    pauseWhenBuffering: pauseWhenBuffering ?? true,
    playbackRate: playbackRate ?? 1,
    toneFrequency: toneFrequency ?? 1,
    showInTimeline: showInTimeline ?? true,
    src,
    stack,
    startFrom,
    _remotionInternalNativeLoopPassed: _remotionInternalNativeLoopPassed ?? false,
    endAt,
    style: style2,
    toneMapped: toneMapped ?? true,
    transparent: transparent ?? false,
    trimAfter,
    trimBefore,
    useWebAudioApi: useWebAudioApi ?? false,
    volume
  });
};
addSequenceStackTraces(OffthreadVideo);
var WATCH_REMOTION_STATIC_FILES = "remotion_staticFilesChanged";
function useRemotionContexts() {
  const compositionManagerCtx = React.useContext(CompositionManager);
  const timelineContext = React.useContext(TimelineContext);
  const setTimelineContext = React.useContext(SetTimelineContext);
  const sequenceContext = React.useContext(SequenceContext);
  const nonceContext = React.useContext(NonceContext);
  const canUseRemotionHooksContext = React.useContext(CanUseRemotionHooks);
  const preloadContext = React.useContext(PreloadContext);
  const resolveCompositionContext = React.useContext(ResolveCompositionContext);
  const renderAssetManagerContext = React.useContext(RenderAssetManager);
  const sequenceManagerContext = React.useContext(SequenceManager);
  const bufferManagerContext = React.useContext(BufferingContextReact);
  const logLevelContext = React.useContext(LogLevelContext);
  return reactExports.useMemo(() => ({
    compositionManagerCtx,
    timelineContext,
    setTimelineContext,
    sequenceContext,
    nonceContext,
    canUseRemotionHooksContext,
    preloadContext,
    resolveCompositionContext,
    renderAssetManagerContext,
    sequenceManagerContext,
    bufferManagerContext,
    logLevelContext
  }), [
    compositionManagerCtx,
    nonceContext,
    sequenceContext,
    setTimelineContext,
    timelineContext,
    canUseRemotionHooksContext,
    preloadContext,
    resolveCompositionContext,
    renderAssetManagerContext,
    sequenceManagerContext,
    bufferManagerContext,
    logLevelContext
  ]);
}
var RemotionContextProvider = (props2) => {
  const { children, contexts } = props2;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(LogLevelContext.Provider, {
    value: contexts.logLevelContext,
    children: /* @__PURE__ */ jsxRuntimeExports.jsx(CanUseRemotionHooks.Provider, {
      value: contexts.canUseRemotionHooksContext,
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(NonceContext.Provider, {
        value: contexts.nonceContext,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(PreloadContext.Provider, {
          value: contexts.preloadContext,
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(CompositionManager.Provider, {
            value: contexts.compositionManagerCtx,
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(SequenceManager.Provider, {
              value: contexts.sequenceManagerContext,
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(RenderAssetManager.Provider, {
                value: contexts.renderAssetManagerContext,
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(ResolveCompositionContext.Provider, {
                  value: contexts.resolveCompositionContext,
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(TimelineContext.Provider, {
                    value: contexts.timelineContext,
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(SetTimelineContext.Provider, {
                      value: contexts.setTimelineContext,
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(SequenceContext.Provider, {
                        value: contexts.sequenceContext,
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(BufferingContextReact.Provider, {
                          value: contexts.bufferManagerContext,
                          children
                        })
                      })
                    })
                  })
                })
              })
            })
          })
        })
      })
    })
  });
};
var compositionSelectorRef = reactExports.createRef();
var Internals = {
  MaxMediaCacheSizeContext,
  useUnsafeVideoConfig,
  useFrameForVolumeProp,
  useTimelinePosition,
  useAbsoluteTimelinePosition,
  evaluateVolume,
  getAbsoluteSrc,
  Timeline: exports_timeline_position_state,
  validateMediaTrimProps,
  validateMediaProps,
  resolveTrimProps,
  VideoForPreview,
  CompositionManager,
  CompositionSetters,
  VisualModeCodeValuesContext,
  VisualModeDragOverridesContext,
  VisualModeSettersContext,
  SequenceManager,
  SequenceStackTracesUpdateContext,
  SequenceVisibilityToggleContext,
  wrapInSchema,
  sequenceSchema,
  sequenceStyleSchema,
  flattenActiveSchema,
  getFlatSchemaWithAllKeys,
  RemotionRootContexts,
  CompositionManagerProvider,
  useVideo,
  getRoot,
  useMediaVolumeState,
  useMediaMutedState,
  useMediaInTimeline,
  useLazyComponent,
  truthy,
  SequenceContext,
  PremountContext,
  useRemotionContexts,
  RemotionContextProvider,
  CSSUtils: exports_default_css,
  setupEnvVariables,
  MediaVolumeContext,
  SetMediaVolumeContext,
  getRemotionEnvironment,
  SharedAudioContext,
  SharedAudioContextProvider,
  SharedAudioTagsContext,
  SharedAudioTagsContextProvider,
  invalidCompositionErrorMessage,
  calculateMediaDuration,
  isCompositionIdValid,
  getPreviewDomElement,
  compositionsRef,
  portalNode,
  waitForRoot,
  SetTimelineContext,
  CanUseRemotionHooksProvider,
  CanUseRemotionHooks,
  PrefetchProvider,
  DurationsContextProvider,
  IsPlayerContextProvider,
  useIsPlayer,
  EditorPropsProvider,
  EditorPropsContext,
  usePreload,
  NonceContext,
  resolveVideoConfig,
  resolveVideoConfigOrCatch,
  ResolveCompositionContext,
  useResolvedVideoConfig,
  resolveCompositionsRef,
  REMOTION_STUDIO_CONTAINER_ELEMENT,
  RenderAssetManager,
  persistCurrentFrame,
  usePlaybackRate,
  useTimelineContext,
  useTimelineSetFrame,
  isIosSafari,
  WATCH_REMOTION_STATIC_FILES,
  addSequenceStackTraces,
  useMediaStartsAt,
  BufferingProvider,
  BufferingContextReact,
  getComponentsToAddStacksTo,
  CurrentScaleContext,
  PreviewSizeContext,
  calculateScale,
  validateRenderAsset,
  Log,
  LogLevelContext,
  useLogLevel,
  playbackLogging,
  timeValueRef,
  compositionSelectorRef,
  RemotionEnvironmentContext,
  warnAboutTooHighVolume,
  AudioForPreview,
  OBJECTFIT_CONTAIN_CLASS_NAME,
  InnerOffthreadVideo,
  useBasicMediaInTimeline,
  getInputPropsOverride,
  setInputPropsOverride,
  useVideoEnabled,
  useAudioEnabled,
  useIsPlayerBuffering,
  TimelinePosition: exports_timeline_position_state,
  DelayRenderContextType,
  TimelineContext,
  PlaybackRateContext,
  AbsoluteTimeContext,
  RenderAssetManagerProvider,
  getEffectiveVisualModeValue,
  CompositionRenderErrorContext,
  useEffectChainState,
  runEffectChain,
  useMemoizedEffects,
  defineEffect,
  createDescriptor,
  computeEffectiveSchemaValuesDotNotation,
  OverrideIdsToNodePathsGettersContext,
  OverrideIdsToNodePathsSettersContext,
  findPropsToDelete,
  flattenEffects
};
var validateFrame = ({
  allowFloats,
  durationInFrames,
  frame
}) => {
  if (typeof frame === "undefined") {
    throw new TypeError(`Argument missing for parameter "frame"`);
  }
  if (typeof frame !== "number") {
    throw new TypeError(`Argument passed for "frame" is not a number: ${frame}`);
  }
  if (!Number.isFinite(frame)) {
    throw new RangeError(`Frame ${frame} is not finite`);
  }
  if (frame < 0 && frame < -durationInFrames) {
    throw new RangeError(`Cannot use frame ${frame}: Duration of composition is ${durationInFrames}, therefore the lowest frame that can be rendered is ${-durationInFrames}`);
  }
  if (frame > durationInFrames - 1) {
    throw new RangeError(`Cannot use frame ${frame}: Duration of composition is ${durationInFrames}, therefore the highest frame that can be rendered is ${durationInFrames - 1}`);
  }
};
var flattenChildren = (children) => {
  const childrenArray = React.Children.toArray(children);
  return childrenArray.reduce((flatChildren, child) => {
    if (child.type === React.Fragment) {
      return flatChildren.concat(flattenChildren(child.props.children));
    }
    flatChildren.push(child);
    return flatChildren;
  }, []);
};
var IsInsideSeriesContext = reactExports.createContext(false);
var IsInsideSeriesContainer = ({ children }) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(IsInsideSeriesContext.Provider, {
    value: true,
    children
  });
};
var IsNotInsideSeriesProvider = ({ children }) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(IsInsideSeriesContext.Provider, {
    value: false,
    children
  });
};
var useRequireToBeInsideSeries = () => {
  const isInsideSeries = React.useContext(IsInsideSeriesContext);
  if (!isInsideSeries) {
    throw new Error("This component must be inside a <Series /> component.");
  }
};
var SeriesSequenceRefForwardingFunction = ({ children }, _ref) => {
  useRequireToBeInsideSeries();
  return /* @__PURE__ */ jsxRuntimeExports.jsx(IsNotInsideSeriesProvider, {
    children
  });
};
var SeriesSequence = reactExports.forwardRef(SeriesSequenceRefForwardingFunction);
var SeriesInner = (props2) => {
  const childrenValue = reactExports.useMemo(() => {
    let startFrame = 0;
    const flattenedChildren = flattenChildren(props2.children);
    return reactExports.Children.map(flattenedChildren, (child, i) => {
      const castedChild = child;
      if (typeof castedChild === "string") {
        if (castedChild.trim() === "") {
          return null;
        }
        throw new TypeError(`The <Series /> component only accepts a list of <Series.Sequence /> components as its children, but you passed a string "${castedChild}"`);
      }
      if (castedChild.type !== SeriesSequence) {
        throw new TypeError(`The <Series /> component only accepts a list of <Series.Sequence /> components as its children, but got ${castedChild} instead`);
      }
      const debugInfo = `index = ${i}, duration = ${castedChild.props.durationInFrames}`;
      const durationInFramesProp = castedChild.props.durationInFrames;
      const {
        durationInFrames,
        children: _children,
        from,
        name,
        ...passedProps
      } = castedChild.props;
      if (i !== flattenedChildren.length - 1 || durationInFramesProp !== Infinity) {
        validateDurationInFrames$2(durationInFramesProp, {
          component: `of a <Series.Sequence /> component`,
          allowFloats: true
        });
      }
      const offset = castedChild.props.offset ?? 0;
      if (Number.isNaN(offset)) {
        throw new TypeError(`The "offset" property of a <Series.Sequence /> must not be NaN, but got NaN (${debugInfo}).`);
      }
      if (!Number.isFinite(offset)) {
        throw new TypeError(`The "offset" property of a <Series.Sequence /> must be finite, but got ${offset} (${debugInfo}).`);
      }
      if (offset % 1 !== 0) {
        throw new TypeError(`The "offset" property of a <Series.Sequence /> must be finite, but got ${offset} (${debugInfo}).`);
      }
      const currentStartFrame = startFrame + offset;
      startFrame += durationInFramesProp + offset;
      return /* @__PURE__ */ jsxRuntimeExports.jsx(Sequence, {
        name: name || "<Series.Sequence>",
        from: currentStartFrame,
        durationInFrames: durationInFramesProp,
        ...passedProps,
        ref: castedChild.ref,
        children: child
      });
    });
  }, [props2.children]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(IsInsideSeriesContainer, {
    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Sequence, {
      layout: "none",
      name: "<Series>",
      ...props2,
      children: childrenValue
    })
  });
};
var Series = Object.assign(wrapInSchema(SeriesInner, sequenceSchemaDefaultLayoutNone), {
  Sequence: SeriesSequence
});
addSequenceStackTraces(Series);
addSequenceStackTraces(SeriesSequence);
var validateSpringDuration = (dur) => {
  if (typeof dur === "undefined") {
    return;
  }
  if (typeof dur !== "number") {
    throw new TypeError(`A "duration" of a spring must be a "number" but is "${typeof dur}"`);
  }
  if (Number.isNaN(dur)) {
    throw new TypeError('A "duration" of a spring is NaN, which it must not be');
  }
  if (!Number.isFinite(dur)) {
    throw new TypeError('A "duration" of a spring must be finite, but is ' + dur);
  }
  if (dur <= 0) {
    throw new TypeError('A "duration" of a spring must be positive, but is ' + dur);
  }
};
var defaultSpringConfig = {
  damping: 10,
  mass: 1,
  stiffness: 100,
  overshootClamping: false
};
var advanceCache = {};
function advance({
  animation,
  now,
  config
}) {
  const { toValue, lastTimestamp, current, velocity } = animation;
  const deltaTime = Math.min(now - lastTimestamp, 64);
  if (config.damping <= 0) {
    throw new Error("Spring damping must be greater than 0, otherwise the spring() animation will never end, causing an infinite loop.");
  }
  const c2 = config.damping;
  const m = config.mass;
  const k = config.stiffness;
  const cacheKey = [
    toValue,
    lastTimestamp,
    current,
    velocity,
    c2,
    m,
    k,
    now
  ].join("-");
  if (advanceCache[cacheKey]) {
    return advanceCache[cacheKey];
  }
  const v0 = -velocity;
  const x0 = toValue - current;
  const zeta = c2 / (2 * Math.sqrt(k * m));
  const omega0 = Math.sqrt(k / m);
  const omega1 = omega0 * Math.sqrt(1 - zeta ** 2);
  const t = deltaTime / 1e3;
  const sin1 = Math.sin(omega1 * t);
  const cos1 = Math.cos(omega1 * t);
  const underDampedEnvelope = Math.exp(-zeta * omega0 * t);
  const underDampedFrag1 = underDampedEnvelope * (sin1 * ((v0 + zeta * omega0 * x0) / omega1) + x0 * cos1);
  const underDampedPosition = toValue - underDampedFrag1;
  const underDampedVelocity = zeta * omega0 * underDampedFrag1 - underDampedEnvelope * (cos1 * (v0 + zeta * omega0 * x0) - omega1 * x0 * sin1);
  const criticallyDampedEnvelope = Math.exp(-omega0 * t);
  const criticallyDampedPosition = toValue - criticallyDampedEnvelope * (x0 + (v0 + omega0 * x0) * t);
  const criticallyDampedVelocity = criticallyDampedEnvelope * (v0 * (t * omega0 - 1) + t * x0 * omega0 * omega0);
  const animationNode = {
    toValue,
    prevPosition: current,
    lastTimestamp: now,
    current: zeta < 1 ? underDampedPosition : criticallyDampedPosition,
    velocity: zeta < 1 ? underDampedVelocity : criticallyDampedVelocity
  };
  advanceCache[cacheKey] = animationNode;
  return animationNode;
}
var calculationCache = {};
function springCalculation({
  frame,
  fps,
  config = {}
}) {
  const from = 0;
  const to = 1;
  const cacheKey = [
    frame,
    fps,
    config.damping,
    config.mass,
    config.overshootClamping,
    config.stiffness
  ].join("-");
  if (calculationCache[cacheKey]) {
    return calculationCache[cacheKey];
  }
  let animation = {
    lastTimestamp: 0,
    current: from,
    toValue: to,
    velocity: 0,
    prevPosition: 0
  };
  const frameClamped = Math.max(0, frame);
  const unevenRest = frameClamped % 1;
  for (let f = 0; f <= Math.floor(frameClamped); f++) {
    if (f === Math.floor(frameClamped)) {
      f += unevenRest;
    }
    const time = f / fps * 1e3;
    animation = advance({
      animation,
      now: time,
      config: {
        ...defaultSpringConfig,
        ...config
      }
    });
  }
  calculationCache[cacheKey] = animation;
  return animation;
}
var cache = /* @__PURE__ */ new Map();
function measureSpring({
  fps,
  config = {},
  threshold = 5e-3
}) {
  if (typeof threshold !== "number") {
    throw new TypeError(`threshold must be a number, got ${threshold} of type ${typeof threshold}`);
  }
  if (threshold === 0) {
    return Infinity;
  }
  if (threshold === 1) {
    return 0;
  }
  if (isNaN(threshold)) {
    throw new TypeError("Threshold is NaN");
  }
  if (!Number.isFinite(threshold)) {
    throw new TypeError("Threshold is not finite");
  }
  if (threshold < 0) {
    throw new TypeError("Threshold is below 0");
  }
  const cacheKey = [
    fps,
    config.damping,
    config.mass,
    config.overshootClamping,
    config.stiffness,
    threshold
  ].join("-");
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey);
  }
  validateFps$2(fps, "to the measureSpring() function");
  let frame = 0;
  let finishedFrame = 0;
  const calc = () => {
    return springCalculation({
      fps,
      frame,
      config
    });
  };
  let animation = calc();
  const calcDifference = () => {
    return Math.abs(animation.current - animation.toValue);
  };
  let difference = calcDifference();
  while (difference >= threshold) {
    frame++;
    animation = calc();
    difference = calcDifference();
  }
  finishedFrame = frame;
  for (let i = 0; i < 20; i++) {
    frame++;
    animation = calc();
    difference = calcDifference();
    if (difference >= threshold) {
      i = 0;
      finishedFrame = frame + 1;
    }
  }
  cache.set(cacheKey, finishedFrame);
  return finishedFrame;
}
function spring({
  frame: passedFrame,
  fps,
  config = {},
  from = 0,
  to = 1,
  durationInFrames: passedDurationInFrames,
  durationRestThreshold,
  delay: delay2 = 0,
  reverse = false
}) {
  validateSpringDuration(passedDurationInFrames);
  validateFrame({
    frame: passedFrame,
    durationInFrames: Infinity,
    allowFloats: true
  });
  validateFps$2(fps, "to spring()");
  const needsToCalculateNaturalDuration = reverse || typeof passedDurationInFrames !== "undefined";
  const naturalDuration = needsToCalculateNaturalDuration ? measureSpring({
    fps,
    config,
    threshold: durationRestThreshold
  }) : void 0;
  const naturalDurationGetter = needsToCalculateNaturalDuration ? {
    get: () => naturalDuration
  } : {
    get: () => {
      throw new Error("did not calculate natural duration, this is an error with Remotion. Please report");
    }
  };
  const reverseProcessed = reverse ? (passedDurationInFrames ?? naturalDurationGetter.get()) - passedFrame : passedFrame;
  const delayProcessed = reverseProcessed + (reverse ? delay2 : -delay2);
  const durationProcessed = passedDurationInFrames === void 0 ? delayProcessed : delayProcessed / (passedDurationInFrames / naturalDurationGetter.get());
  if (passedDurationInFrames && delayProcessed > passedDurationInFrames) {
    return to;
  }
  const spr = springCalculation({
    fps,
    frame: durationProcessed,
    config
  });
  const inner2 = config.overshootClamping ? to >= from ? Math.min(spr.current, to) : Math.max(spr.current, to) : spr.current;
  const interpolated = from === 0 && to === 1 ? inner2 : interpolate(inner2, [0, 1], [from, to]);
  return interpolated;
}
var roundTo6Commas = (num) => {
  return Math.round(num * 1e5) / 1e5;
};
var seekToTime = ({
  element,
  desiredTime,
  logLevel,
  mountTime
}) => {
  if (isApproximatelyTheSame(element.currentTime, desiredTime)) {
    return {
      wait: Promise.resolve(desiredTime),
      cancel: () => {
      }
    };
  }
  seek({
    logLevel,
    mediaRef: element,
    time: desiredTime,
    why: "Seeking during rendering",
    mountTime
  });
  let cancel;
  let cancelSeeked = null;
  const prom = new Promise((resolve) => {
    cancel = element.requestVideoFrameCallback((now, metadata) => {
      const displayIn = metadata.expectedDisplayTime - now;
      if (displayIn <= 0) {
        resolve(metadata.mediaTime);
        return;
      }
      setTimeout(() => {
        resolve(metadata.mediaTime);
      }, displayIn + 150);
    });
  });
  const waitForSeekedEvent = new Promise((resolve) => {
    const onDone = () => {
      resolve();
    };
    element.addEventListener("seeked", onDone, {
      once: true
    });
    cancelSeeked = () => {
      element.removeEventListener("seeked", onDone);
    };
  });
  return {
    wait: Promise.all([prom, waitForSeekedEvent]).then(([time]) => time),
    cancel: () => {
      cancelSeeked?.();
      element.cancelVideoFrameCallback(cancel);
    }
  };
};
var seekToTimeMultipleUntilRight = ({
  element,
  desiredTime,
  fps,
  logLevel,
  mountTime
}) => {
  const threshold = 1 / fps / 2;
  let currentCancel = () => {
    return;
  };
  if (Number.isFinite(element.duration) && element.currentTime >= element.duration && desiredTime >= element.duration) {
    return {
      prom: Promise.resolve(),
      cancel: () => {
      }
    };
  }
  const prom = new Promise((resolve, reject) => {
    const firstSeek = seekToTime({
      element,
      desiredTime: desiredTime + threshold,
      logLevel,
      mountTime
    });
    firstSeek.wait.then((seekedTo) => {
      const difference = Math.abs(desiredTime - seekedTo);
      if (difference <= threshold) {
        return resolve();
      }
      const sign = desiredTime > seekedTo ? 1 : -1;
      const newSeek = seekToTime({
        element,
        desiredTime: seekedTo + threshold * sign,
        logLevel,
        mountTime
      });
      currentCancel = newSeek.cancel;
      newSeek.wait.then((newTime) => {
        const newDifference = Math.abs(desiredTime - newTime);
        if (roundTo6Commas(newDifference) <= roundTo6Commas(threshold)) {
          return resolve();
        }
        const thirdSeek = seekToTime({
          element,
          desiredTime: desiredTime + threshold,
          logLevel,
          mountTime
        });
        currentCancel = thirdSeek.cancel;
        return thirdSeek.wait.then(() => {
          resolve();
        }).catch((err) => {
          reject(err);
        });
      }).catch((err) => {
        reject(err);
      });
    });
    currentCancel = firstSeek.cancel;
  });
  return {
    prom,
    cancel: () => {
      currentCancel();
    }
  };
};
var VideoForRenderingForwardFunction = ({
  onError,
  volume: volumeProp,
  allowAmplificationDuringRender,
  playbackRate,
  onDuration,
  toneFrequency,
  name,
  acceptableTimeShiftInSeconds,
  delayRenderRetries,
  delayRenderTimeoutInMilliseconds,
  loopVolumeCurveBehavior,
  audioStreamIndex,
  onVideoFrame,
  ...props2
}, ref) => {
  const absoluteFrame = useTimelinePosition();
  const frame = useCurrentFrame();
  const volumePropsFrame = useFrameForVolumeProp(loopVolumeCurveBehavior ?? "repeat");
  const videoConfig = useUnsafeVideoConfig();
  const videoRef = reactExports.useRef(null);
  const sequenceContext = reactExports.useContext(SequenceContext);
  const mediaStartsAt = useMediaStartsAt();
  const environment = useRemotionEnvironment();
  const logLevel = useLogLevel();
  const mountTime = useMountTime();
  const { delayRender: delayRender2, continueRender: continueRender2 } = useDelayRender();
  const { registerRenderAsset, unregisterRenderAsset } = reactExports.useContext(RenderAssetManager);
  const id = reactExports.useMemo(() => `video-${random(props2.src ?? "")}-${sequenceContext?.cumulatedFrom}-${sequenceContext?.relativeFrom}-${sequenceContext?.durationInFrames}`, [
    props2.src,
    sequenceContext?.cumulatedFrom,
    sequenceContext?.relativeFrom,
    sequenceContext?.durationInFrames
  ]);
  if (!videoConfig) {
    throw new Error("No video config found");
  }
  const volume = evaluateVolume({
    volume: volumeProp,
    frame: volumePropsFrame,
    mediaVolume: 1
  });
  warnAboutTooHighVolume(volume);
  reactExports.useEffect(() => {
    if (!props2.src) {
      throw new Error("No src passed");
    }
    if (props2.muted) {
      return;
    }
    if (volume <= 0) {
      return;
    }
    if (!window.remotion_audioEnabled) {
      return;
    }
    registerRenderAsset({
      type: "video",
      src: getAbsoluteSrc(props2.src),
      id,
      frame: absoluteFrame,
      volume,
      mediaFrame: frame,
      playbackRate: playbackRate ?? 1,
      toneFrequency: toneFrequency ?? 1,
      audioStartFrame: Math.max(0, -(sequenceContext?.relativeFrom ?? 0)),
      audioStreamIndex: audioStreamIndex ?? 0
    });
    return () => unregisterRenderAsset(id);
  }, [
    props2.muted,
    props2.src,
    registerRenderAsset,
    id,
    unregisterRenderAsset,
    volume,
    frame,
    absoluteFrame,
    playbackRate,
    toneFrequency,
    sequenceContext?.relativeFrom,
    audioStreamIndex
  ]);
  reactExports.useImperativeHandle(ref, () => {
    return videoRef.current;
  }, []);
  reactExports.useEffect(() => {
    if (!window.remotion_videoEnabled) {
      return;
    }
    const { current } = videoRef;
    if (!current) {
      return;
    }
    const currentTime = getMediaTime({
      frame,
      playbackRate: playbackRate || 1,
      startFrom: -mediaStartsAt,
      fps: videoConfig.fps
    });
    const handle = delayRender2(`Rendering <Html5Video /> with src="${props2.src}" at time ${currentTime}`, {
      retries: delayRenderRetries ?? void 0,
      timeoutInMilliseconds: delayRenderTimeoutInMilliseconds ?? void 0
    });
    if (window.process?.env?.NODE_ENV === "test") {
      continueRender2(handle);
      return;
    }
    if (isApproximatelyTheSame(current.currentTime, currentTime)) {
      if (current.readyState >= 2) {
        continueRender2(handle);
        return;
      }
      const loadedDataHandler = () => {
        continueRender2(handle);
      };
      current.addEventListener("loadeddata", loadedDataHandler, { once: true });
      return () => {
        current.removeEventListener("loadeddata", loadedDataHandler);
      };
    }
    const endedHandler = () => {
      continueRender2(handle);
    };
    const seek2 = seekToTimeMultipleUntilRight({
      element: current,
      desiredTime: currentTime,
      fps: videoConfig.fps,
      logLevel,
      mountTime
    });
    seek2.prom.then(() => {
      continueRender2(handle);
    });
    current.addEventListener("ended", endedHandler, { once: true });
    const errorHandler = () => {
      if (current?.error) {
        console.error("Error occurred in video", current?.error);
        if (onError) {
          return;
        }
        throw new MediaPlaybackError({
          message: `The browser threw an error while playing the video ${props2.src}: Code ${current.error.code} - ${current?.error?.message}. See https://remotion.dev/docs/media-playback-error for help. Pass an onError() prop to handle the error.`,
          src: props2.src
        });
      } else {
        throw new MediaPlaybackError({
          message: "The browser threw an error",
          src: props2.src
        });
      }
    };
    current.addEventListener("error", errorHandler, { once: true });
    return () => {
      seek2.cancel();
      current.removeEventListener("ended", endedHandler);
      current.removeEventListener("error", errorHandler);
      continueRender2(handle);
    };
  }, [
    volumePropsFrame,
    props2.src,
    playbackRate,
    videoConfig.fps,
    frame,
    mediaStartsAt,
    onError,
    delayRenderRetries,
    delayRenderTimeoutInMilliseconds,
    logLevel,
    mountTime,
    continueRender2,
    delayRender2
  ]);
  const { src } = props2;
  if (environment.isRendering) {
    reactExports.useLayoutEffect(() => {
      if (window.process?.env?.NODE_ENV === "test") {
        return;
      }
      const newHandle = delayRender2("Loading <Html5Video> duration with src=" + src, {
        retries: delayRenderRetries ?? void 0,
        timeoutInMilliseconds: delayRenderTimeoutInMilliseconds ?? void 0
      });
      const { current } = videoRef;
      const didLoad = () => {
        if (current?.duration) {
          onDuration(src, current.duration);
        }
        continueRender2(newHandle);
      };
      if (current?.duration) {
        onDuration(src, current.duration);
        continueRender2(newHandle);
      } else {
        current?.addEventListener("loadedmetadata", didLoad, { once: true });
      }
      return () => {
        current?.removeEventListener("loadedmetadata", didLoad);
        continueRender2(newHandle);
      };
    }, [
      src,
      onDuration,
      delayRenderRetries,
      delayRenderTimeoutInMilliseconds,
      continueRender2,
      delayRender2
    ]);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("video", {
    ref: videoRef,
    disableRemotePlayback: true,
    ...props2
  });
};
var VideoForRendering = reactExports.forwardRef(VideoForRenderingForwardFunction);
var VideoForwardingFunction = (props2, ref) => {
  const {
    startFrom,
    endAt,
    trimBefore,
    trimAfter,
    name,
    pauseWhenBuffering,
    stack,
    _remotionInternalNativeLoopPassed,
    showInTimeline,
    onAutoPlayError,
    ...otherProps
  } = props2;
  const { loop, ...propsOtherThanLoop } = props2;
  const { fps } = useVideoConfig();
  const environment = useRemotionEnvironment();
  if (environment.isClientSideRendering) {
    throw new Error("<Html5Video> is not supported in @remotion/web-renderer. Use <Video> from @remotion/media instead. See https://remotion.dev/docs/client-side-rendering/limitations");
  }
  const { durations, setDurations } = reactExports.useContext(DurationsContext);
  if (typeof ref === "string") {
    throw new Error("string refs are not supported");
  }
  if (typeof props2.src !== "string") {
    throw new TypeError(`The \`<Html5Video>\` tag requires a string for \`src\`, but got ${JSON.stringify(props2.src)} instead.`);
  }
  const preloadedSrc = usePreload(props2.src);
  const onDuration = reactExports.useCallback((src, durationInSeconds) => {
    setDurations({ type: "got-duration", durationInSeconds, src });
  }, [setDurations]);
  const onVideoFrame = reactExports.useCallback(() => {
  }, []);
  const durationFetched = durations[getAbsoluteSrc(preloadedSrc)] ?? durations[getAbsoluteSrc(props2.src)];
  validateMediaTrimProps({ startFrom, endAt, trimBefore, trimAfter });
  const { trimBeforeValue, trimAfterValue } = resolveTrimProps({
    startFrom,
    endAt,
    trimBefore,
    trimAfter
  });
  if (loop && durationFetched !== void 0) {
    if (!Number.isFinite(durationFetched)) {
      return /* @__PURE__ */ jsxRuntimeExports.jsx(Html5Video, {
        ...propsOtherThanLoop,
        ref,
        stack,
        _remotionInternalNativeLoopPassed: true
      });
    }
    const mediaDuration = durationFetched * fps;
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Loop, {
      durationInFrames: calculateMediaDuration({
        trimAfter: trimAfterValue,
        mediaDurationInFrames: mediaDuration,
        playbackRate: props2.playbackRate ?? 1,
        trimBefore: trimBeforeValue
      }),
      layout: "none",
      name,
      showInTimeline: false,
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Html5Video, {
        ...propsOtherThanLoop,
        ref,
        stack,
        _remotionInternalNativeLoopPassed: true
      })
    });
  }
  if (typeof trimBeforeValue !== "undefined" || typeof trimAfterValue !== "undefined") {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Sequence, {
      layout: "none",
      from: 0 - (trimBeforeValue ?? 0),
      showInTimeline: false,
      durationInFrames: trimAfterValue === void 0 ? void 0 : trimAfterValue / (props2.playbackRate ?? 1),
      name,
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Html5Video, {
        pauseWhenBuffering: pauseWhenBuffering ?? false,
        ...otherProps,
        ref,
        stack
      })
    });
  }
  validateMediaProps({ playbackRate: props2.playbackRate, volume: props2.volume }, "Html5Video");
  if (environment.isRendering) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(VideoForRendering, {
      onDuration,
      onVideoFrame: onVideoFrame ?? null,
      ...otherProps,
      ref
    });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(VideoForPreview, {
    onlyWarnForMediaSeekingError: false,
    ...otherProps,
    ref,
    onVideoFrame: null,
    pauseWhenBuffering: pauseWhenBuffering ?? false,
    onDuration,
    _remotionInternalStack: stack ?? null,
    _remotionInternalNativeLoopPassed: _remotionInternalNativeLoopPassed ?? false,
    showInTimeline: showInTimeline ?? true,
    onAutoPlayError: onAutoPlayError ?? void 0
  });
};
var Html5Video = reactExports.forwardRef(VideoForwardingFunction);
addSequenceStackTraces(Html5Video);
checkMultipleRemotionVersions();
var proxyObj = {};
var Config = new Proxy(proxyObj, {
  get(_, prop) {
    if (prop === "Bundling" || prop === "Rendering" || prop === "Log" || prop === "Puppeteer" || prop === "Output") {
      return Config;
    }
    return () => {
      console.warn("⚠️  The CLI configuration has been extracted from Remotion Core.");
      console.warn("Update the import from the config file:");
      console.warn();
      console.warn("- Delete:");
      console.warn('import {Config} from "remotion";');
      console.warn("+ Replace:");
      console.warn('import {Config} from "@remotion/cli/config";');
      console.warn();
      console.warn("For more information, see https://www.remotion.dev/docs/4-0-migration.");
      process.exit(1);
    };
  }
});
Sequence.displayName = "Sequence";
addSequenceStackTraces(Sequence);
addSequenceStackTraces(Composition);
if (typeof window !== "undefined") {
  window.remotion_renderReady = false;
  if (!window.remotion_delayRenderTimeouts) {
    window.remotion_delayRenderTimeouts = {};
  }
  window.remotion_delayRenderHandles = [];
}
var validateDefaultAndInputProps$1 = (defaultProps, name, compositionId) => {
  if (!defaultProps) {
    return;
  }
  if (typeof defaultProps !== "object") {
    throw new Error(`"${name}" must be an object, but you passed a value of type ${typeof defaultProps}`);
  }
  if (Array.isArray(defaultProps)) {
    throw new Error(`"${name}" must be an object, an array was passed ${compositionId ? `for composition "${compositionId}"` : ""}`);
  }
};
function validateDimension$1(amount, nameOfProp, location) {
  if (typeof amount !== "number") {
    throw new Error(`The "${nameOfProp}" prop ${location} must be a number, but you passed a value of type ${typeof amount}`);
  }
  if (isNaN(amount)) {
    throw new TypeError(`The "${nameOfProp}" prop ${location} must not be NaN, but is NaN.`);
  }
  if (!Number.isFinite(amount)) {
    throw new TypeError(`The "${nameOfProp}" prop ${location} must be finite, but is ${amount}.`);
  }
  if (amount % 1 !== 0) {
    throw new TypeError(`The "${nameOfProp}" prop ${location} must be an integer, but is ${amount}.`);
  }
  if (amount <= 0) {
    throw new TypeError(`The "${nameOfProp}" prop ${location} must be positive, but got ${amount}.`);
  }
}
function validateDurationInFrames$1(durationInFrames, options) {
  const { allowFloats, component } = options;
  if (typeof durationInFrames === "undefined") {
    throw new Error(`The "durationInFrames" prop ${component} is missing.`);
  }
  if (typeof durationInFrames !== "number") {
    throw new Error(`The "durationInFrames" prop ${component} must be a number, but you passed a value of type ${typeof durationInFrames}`);
  }
  if (durationInFrames <= 0) {
    throw new TypeError(`The "durationInFrames" prop ${component} must be positive, but got ${durationInFrames}.`);
  }
  if (!allowFloats && durationInFrames % 1 !== 0) {
    throw new TypeError(`The "durationInFrames" prop ${component} must be an integer, but got ${durationInFrames}.`);
  }
  if (!Number.isFinite(durationInFrames)) {
    throw new TypeError(`The "durationInFrames" prop ${component} must be finite, but got ${durationInFrames}.`);
  }
}
function validateFps$1(fps, location, isGif) {
  if (typeof fps !== "number") {
    throw new Error(`"fps" must be a number, but you passed a value of type ${typeof fps} ${location}`);
  }
  if (!Number.isFinite(fps)) {
    throw new Error(`"fps" must be a finite, but you passed ${fps} ${location}`);
  }
  if (isNaN(fps)) {
    throw new Error(`"fps" must not be NaN, but got ${fps} ${location}`);
  }
  if (fps <= 0) {
    throw new TypeError(`"fps" must be positive, but got ${fps} ${location}`);
  }
  if (isGif && fps > 50) {
    throw new TypeError(`The FPS for a GIF cannot be higher than 50. Use the --every-nth-frame option to lower the FPS: https://remotion.dev/docs/render-as-gif`);
  }
}
var NoReactInternals = {
  validateFps: validateFps$1,
  validateDimension: validateDimension$1,
  validateDurationInFrames: validateDurationInFrames$1,
  validateDefaultAndInputProps: validateDefaultAndInputProps$1
};
var ICON_SIZE = 25;
var fullscreenIconSize = 16;
var PlayIcon = () => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("svg", {
    width: ICON_SIZE,
    height: ICON_SIZE,
    viewBox: "0 0 25 25",
    fill: "none",
    children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", {
      d: "M8 6.375C7.40904 8.17576 7.06921 10.2486 7.01438 12.3871C6.95955 14.5255 7.19163 16.6547 7.6875 18.5625C9.95364 18.2995 12.116 17.6164 14.009 16.5655C15.902 15.5147 17.4755 14.124 18.6088 12.5C17.5158 10.8949 15.9949 9.51103 14.1585 8.45082C12.3222 7.3906 10.2174 6.68116 8 6.375Z",
      fill: "white",
      stroke: "white",
      strokeWidth: "6.25",
      strokeLinejoin: "round"
    })
  });
};
var PauseIcon = () => {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", {
    viewBox: "0 0 100 100",
    width: ICON_SIZE,
    height: ICON_SIZE,
    children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("rect", {
        x: "25",
        y: "20",
        width: "20",
        height: "60",
        fill: "#fff",
        ry: "5",
        rx: "5"
      }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("rect", {
        x: "55",
        y: "20",
        width: "20",
        height: "60",
        fill: "#fff",
        ry: "5",
        rx: "5"
      })
    ]
  });
};
var FullscreenIcon = ({
  isFullscreen
}) => {
  const strokeWidth = 6;
  const viewSize = 32;
  const out = isFullscreen ? 0 : strokeWidth / 2;
  const middleInset = isFullscreen ? strokeWidth * 1.6 : strokeWidth / 2;
  const inset = isFullscreen ? strokeWidth * 1.6 : strokeWidth * 2;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", {
    viewBox: `0 0 ${viewSize} ${viewSize}`,
    height: fullscreenIconSize,
    width: fullscreenIconSize,
    children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("path", {
        d: `
				M ${out} ${inset}
				L ${middleInset} ${middleInset}
				L ${inset} ${out}
				`,
        stroke: "#fff",
        strokeWidth,
        fill: "none"
      }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("path", {
        d: `
				M ${viewSize - out} ${inset}
				L ${viewSize - middleInset} ${middleInset}
				L ${viewSize - inset} ${out}
				`,
        stroke: "#fff",
        strokeWidth,
        fill: "none"
      }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("path", {
        d: `
				M ${out} ${viewSize - inset}
				L ${middleInset} ${viewSize - middleInset}
				L ${inset} ${viewSize - out}
				`,
        stroke: "#fff",
        strokeWidth,
        fill: "none"
      }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("path", {
        d: `
				M ${viewSize - out} ${viewSize - inset}
				L ${viewSize - middleInset} ${viewSize - middleInset}
				L ${viewSize - inset} ${viewSize - out}
				`,
        stroke: "#fff",
        strokeWidth,
        fill: "none"
      })
    ]
  });
};
var VolumeOffIcon = () => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("svg", {
    width: ICON_SIZE,
    height: ICON_SIZE,
    viewBox: "0 0 24 24",
    children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", {
      d: "M3.63 3.63a.996.996 0 000 1.41L7.29 8.7 7 9H4c-.55 0-1 .45-1 1v4c0 .55.45 1 1 1h3l3.29 3.29c.63.63 1.71.18 1.71-.71v-4.17l4.18 4.18c-.49.37-1.02.68-1.6.91-.36.15-.58.53-.58.92 0 .72.73 1.18 1.39.91.8-.33 1.55-.77 2.22-1.31l1.34 1.34a.996.996 0 101.41-1.41L5.05 3.63c-.39-.39-1.02-.39-1.42 0zM19 12c0 .82-.15 1.61-.41 2.34l1.53 1.53c.56-1.17.88-2.48.88-3.87 0-3.83-2.4-7.11-5.78-8.4-.59-.23-1.22.23-1.22.86v.19c0 .38.25.71.61.85C17.18 6.54 19 9.06 19 12zm-8.71-6.29l-.17.17L12 7.76V6.41c0-.89-1.08-1.33-1.71-.7zM16.5 12A4.5 4.5 0 0014 7.97v1.79l2.48 2.48c.01-.08.02-.16.02-.24z",
      fill: "#fff"
    })
  });
};
var VolumeOnIcon = () => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("svg", {
    width: ICON_SIZE,
    height: ICON_SIZE,
    viewBox: "0 0 24 24",
    children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", {
      d: "M3 10v4c0 .55.45 1 1 1h3l3.29 3.29c.63.63 1.71.18 1.71-.71V6.41c0-.89-1.08-1.34-1.71-.71L7 9H4c-.55 0-1 .45-1 1zm13.5 2A4.5 4.5 0 0014 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 4.45v.2c0 .38.25.71.6.85C17.18 6.53 19 9.06 19 12s-1.82 5.47-4.4 6.5c-.36.14-.6.47-.6.85v.2c0 .63.63 1.07 1.21.85C18.6 19.11 21 15.84 21 12s-2.4-7.11-5.79-8.4c-.58-.23-1.21.22-1.21.85z",
      fill: "#fff"
    })
  });
};
var className = "__remotion_buffering_indicator";
var remotionBufferingAnimation = "__remotion_buffering_animation";
var playerStyle = {
  width: ICON_SIZE,
  height: ICON_SIZE,
  overflow: "hidden",
  lineHeight: "normal",
  fontSize: "inherit"
};
var studioStyle = {
  width: 14,
  height: 14,
  overflow: "hidden",
  lineHeight: "normal",
  fontSize: "inherit"
};
var BufferingIndicator = ({ type }) => {
  const style2 = type === "player" ? playerStyle : studioStyle;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, {
    children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("style", {
        type: "text/css",
        children: `
				@keyframes ${remotionBufferingAnimation} {
          0% {
            rotate: 0deg;
          }
          100% {
            rotate: 360deg;
          }
        }
        
        .${className} {
            animation: ${remotionBufferingAnimation} 1s linear infinite;
        }        
			`
      }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
        style: style2,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", {
          viewBox: type === "player" ? "0 0 22 22" : "0 0 18 18",
          style: style2,
          className,
          children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", {
            d: type === "player" ? "M 11 4 A 7 7 0 0 1 15.1145 16.66312" : "M 9 2 A 7 7 0 0 1 13.1145 14.66312",
            stroke: "white",
            strokeLinecap: "round",
            fill: "none",
            strokeWidth: 3
          })
        })
      })
    ]
  });
};
var calculatePlayerSize = ({
  currentSize,
  width,
  height,
  compositionWidth,
  compositionHeight
}) => {
  if (width !== void 0 && height === void 0) {
    return {
      aspectRatio: [compositionWidth, compositionHeight].join("/")
    };
  }
  if (height !== void 0 && width === void 0) {
    return {
      aspectRatio: [compositionWidth, compositionHeight].join("/")
    };
  }
  if (!currentSize) {
    return {
      width: compositionWidth,
      height: compositionHeight
    };
  }
  return {
    width: compositionWidth,
    height: compositionHeight
  };
};
var calculateCanvasTransformation = ({
  previewSize,
  compositionWidth,
  compositionHeight,
  canvasSize
}) => {
  const scale = Internals.calculateScale({
    canvasSize,
    compositionHeight,
    compositionWidth,
    previewSize
  });
  const correction = 0 - (1 - scale) / 2;
  const xCorrection = correction * compositionWidth;
  const yCorrection = correction * compositionHeight;
  const width = compositionWidth * scale;
  const height = compositionHeight * scale;
  const centerX = canvasSize.width / 2 - width / 2;
  const centerY = canvasSize.height / 2 - height / 2;
  return {
    centerX,
    centerY,
    xCorrection,
    yCorrection,
    scale
  };
};
var calculateOuterStyle = ({
  config,
  style: style2,
  canvasSize,
  overflowVisible,
  layout
}) => {
  if (!config) {
    return {};
  }
  return {
    position: "relative",
    overflow: overflowVisible ? "visible" : "hidden",
    ...calculatePlayerSize({
      compositionHeight: config.height,
      compositionWidth: config.width,
      currentSize: canvasSize,
      height: style2?.height,
      width: style2?.width
    }),
    opacity: layout ? 1 : 0,
    ...style2
  };
};
var calculateContainerStyle = ({
  config,
  layout,
  scale,
  overflowVisible
}) => {
  if (!config) {
    return {};
  }
  if (!layout) {
    return {
      position: "absolute",
      width: config.width,
      height: config.height,
      display: "flex",
      transform: `scale(${scale})`,
      overflow: overflowVisible ? "visible" : "hidden"
    };
  }
  return {
    position: "absolute",
    width: config.width,
    height: config.height,
    display: "flex",
    transform: `scale(${scale})`,
    marginLeft: layout.xCorrection,
    marginTop: layout.yCorrection,
    overflow: overflowVisible ? "visible" : "hidden"
  };
};
var calculateOuter = ({
  layout,
  scale,
  config,
  overflowVisible
}) => {
  if (!config) {
    return {};
  }
  if (!layout) {
    return {
      width: config.width * scale,
      height: config.height * scale,
      display: "flex",
      flexDirection: "column",
      position: "absolute",
      overflow: overflowVisible ? "visible" : "hidden"
    };
  }
  const { centerX, centerY } = layout;
  return {
    width: config.width * scale,
    height: config.height * scale,
    display: "flex",
    flexDirection: "column",
    position: "absolute",
    left: centerX,
    top: centerY,
    overflow: overflowVisible ? "visible" : "hidden"
  };
};
var PlayerEventEmitterContext = React.createContext(void 0);
var ThumbnailEmitterContext = React.createContext(void 0);
class PlayerEmitter {
  listeners = {
    ended: [],
    error: [],
    pause: [],
    play: [],
    ratechange: [],
    scalechange: [],
    seeked: [],
    timeupdate: [],
    frameupdate: [],
    fullscreenchange: [],
    volumechange: [],
    mutechange: [],
    waiting: [],
    resume: []
  };
  addEventListener(name, callback) {
    this.listeners[name].push(callback);
  }
  removeEventListener(name, callback) {
    this.listeners[name] = this.listeners[name].filter((l) => l !== callback);
  }
  dispatchEvent(dispatchName, context) {
    this.listeners[dispatchName].forEach((callback) => {
      callback({ detail: context });
    });
  }
  dispatchSeek = (frame) => {
    this.dispatchEvent("seeked", {
      frame
    });
  };
  dispatchVolumeChange = (volume) => {
    this.dispatchEvent("volumechange", {
      volume
    });
  };
  dispatchPause = () => {
    this.dispatchEvent("pause", void 0);
  };
  dispatchPlay = () => {
    this.dispatchEvent("play", void 0);
  };
  dispatchEnded = () => {
    this.dispatchEvent("ended", void 0);
  };
  dispatchRateChange = (playbackRate) => {
    this.dispatchEvent("ratechange", {
      playbackRate
    });
  };
  dispatchScaleChange = (scale) => {
    this.dispatchEvent("scalechange", {
      scale
    });
  };
  dispatchError = (error2) => {
    this.dispatchEvent("error", {
      error: error2
    });
  };
  dispatchTimeUpdate = (event) => {
    this.dispatchEvent("timeupdate", event);
  };
  dispatchFrameUpdate = (event) => {
    this.dispatchEvent("frameupdate", event);
  };
  dispatchFullscreenChange = (event) => {
    this.dispatchEvent("fullscreenchange", event);
  };
  dispatchMuteChange = (event) => {
    this.dispatchEvent("mutechange", event);
  };
  dispatchWaiting = (event) => {
    this.dispatchEvent("waiting", event);
  };
  dispatchResume = (event) => {
    this.dispatchEvent("resume", event);
  };
}
class ThumbnailEmitter {
  listeners = {
    error: [],
    waiting: [],
    resume: []
  };
  addEventListener(name, callback) {
    this.listeners[name].push(callback);
  }
  removeEventListener(name, callback) {
    this.listeners[name] = this.listeners[name].filter((l) => l !== callback);
  }
  dispatchEvent(dispatchName, context) {
    this.listeners[dispatchName].forEach((callback) => {
      callback({ detail: context });
    });
  }
  dispatchError = (error2) => {
    this.dispatchEvent("error", {
      error: error2
    });
  };
  dispatchWaiting = (event) => {
    this.dispatchEvent("waiting", event);
  };
  dispatchResume = (event) => {
    this.dispatchEvent("resume", event);
  };
}
var useBufferStateEmitter = (emitter) => {
  const bufferManager = reactExports.useContext(Internals.BufferingContextReact);
  if (!bufferManager) {
    throw new Error("BufferingContextReact not found");
  }
  reactExports.useLayoutEffect(() => {
    const clear1 = bufferManager.listenForBuffering(() => {
      bufferManager.buffering.current = true;
      emitter.dispatchWaiting({});
    });
    const clear2 = bufferManager.listenForResume(() => {
      bufferManager.buffering.current = false;
      emitter.dispatchResume({});
    });
    return () => {
      clear1.remove();
      clear2.remove();
    };
  }, [bufferManager, emitter]);
};
var PlayerEmitterProvider = ({ children, currentPlaybackRate }) => {
  const [emitter] = reactExports.useState(() => new PlayerEmitter());
  const bufferManager = reactExports.useContext(Internals.BufferingContextReact);
  if (!bufferManager) {
    throw new Error("BufferingContextReact not found");
  }
  reactExports.useEffect(() => {
    if (currentPlaybackRate) {
      emitter.dispatchRateChange(currentPlaybackRate);
    }
  }, [emitter, currentPlaybackRate]);
  useBufferStateEmitter(emitter);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(PlayerEventEmitterContext.Provider, {
    value: emitter,
    children
  });
};
var useHoverState = (ref, hideControlsWhenPointerDoesntMove) => {
  const [hovered, setHovered] = reactExports.useState(false);
  reactExports.useEffect(() => {
    const { current } = ref;
    if (!current) {
      return;
    }
    let hoverTimeout;
    const addHoverTimeout = () => {
      if (hideControlsWhenPointerDoesntMove) {
        clearTimeout(hoverTimeout);
        hoverTimeout = setTimeout(() => {
          setHovered(false);
        }, hideControlsWhenPointerDoesntMove === true ? 3e3 : hideControlsWhenPointerDoesntMove);
      }
    };
    const onHover = () => {
      setHovered(true);
      addHoverTimeout();
    };
    const onLeave = () => {
      setHovered(false);
      clearTimeout(hoverTimeout);
    };
    const onMove = () => {
      setHovered(true);
      addHoverTimeout();
    };
    current.addEventListener("mouseenter", onHover);
    current.addEventListener("mouseleave", onLeave);
    current.addEventListener("mousemove", onMove);
    return () => {
      current.removeEventListener("mouseenter", onHover);
      current.removeEventListener("mouseleave", onLeave);
      current.removeEventListener("mousemove", onMove);
      clearTimeout(hoverTimeout);
    };
  }, [hideControlsWhenPointerDoesntMove, ref]);
  return hovered;
};
var usePlayer = () => {
  const [playing, setPlaying, imperativePlaying] = Internals.Timeline.usePlayingState();
  const [hasPlayed, setHasPlayed] = reactExports.useState(false);
  const frame = Internals.Timeline.useTimelinePosition();
  const playStart = reactExports.useRef(frame);
  const setFrame = Internals.Timeline.useTimelineSetFrame();
  const setTimelinePosition = Internals.Timeline.useTimelineSetFrame();
  const audioContext = reactExports.useContext(Internals.SharedAudioContext);
  const audioTagsContext = reactExports.useContext(Internals.SharedAudioTagsContext);
  const { audioAndVideoTags } = Internals.useTimelineContext();
  const frameRef = reactExports.useRef(frame);
  frameRef.current = frame;
  const video = Internals.useVideo();
  const config = Internals.useUnsafeVideoConfig();
  const emitter = reactExports.useContext(PlayerEventEmitterContext);
  const lastFrame = (config?.durationInFrames ?? 1) - 1;
  const isLastFrame = frame === lastFrame;
  const isFirstFrame = frame === 0;
  if (!emitter) {
    throw new TypeError("Expected Player event emitter context");
  }
  const bufferingContext = reactExports.useContext(Internals.BufferingContextReact);
  if (!bufferingContext) {
    throw new Error("Missing the buffering context. Most likely you have a Remotion version mismatch.");
  }
  const { buffering } = bufferingContext;
  const seek2 = reactExports.useCallback((newFrame) => {
    if (video?.id) {
      setTimelinePosition((c2) => ({ ...c2, [video.id]: newFrame }));
    }
    frameRef.current = newFrame;
    emitter.dispatchSeek(newFrame);
  }, [emitter, setTimelinePosition, video?.id]);
  const play = reactExports.useCallback((e) => {
    if (imperativePlaying.current) {
      return;
    }
    setHasPlayed(true);
    if (isLastFrame) {
      seek2(0);
    }
    audioContext?.resume();
    if (audioTagsContext && audioTagsContext.numberOfAudioTags > 0 && e) {
      audioTagsContext.playAllAudios();
    }
    audioAndVideoTags.current.forEach((a2) => a2.play("player play() was called and playing audio from a click"));
    imperativePlaying.current = true;
    setPlaying(true);
    playStart.current = frameRef.current;
    emitter.dispatchPlay();
  }, [
    imperativePlaying,
    isLastFrame,
    audioContext,
    audioTagsContext,
    setPlaying,
    emitter,
    seek2,
    audioAndVideoTags
  ]);
  const pause = reactExports.useCallback(() => {
    if (imperativePlaying.current) {
      imperativePlaying.current = false;
      setPlaying(false);
      emitter.dispatchPause();
      audioContext?.suspend();
    }
  }, [emitter, imperativePlaying, setPlaying, audioContext]);
  const pauseAndReturnToPlayStart = reactExports.useCallback(() => {
    if (imperativePlaying.current) {
      imperativePlaying.current = false;
      frameRef.current = playStart.current;
      if (config) {
        setTimelinePosition((c2) => ({
          ...c2,
          [config.id]: playStart.current
        }));
        setPlaying(false);
        emitter.dispatchPause();
      }
    }
  }, [config, emitter, imperativePlaying, setPlaying, setTimelinePosition]);
  const videoId = video?.id;
  const frameBack = reactExports.useCallback((frames) => {
    if (!videoId) {
      return null;
    }
    if (imperativePlaying.current) {
      return;
    }
    setFrame((c2) => {
      const prevFrame = c2[videoId] ?? window.remotion_initialFrame ?? 0;
      const newFrame = Math.max(0, prevFrame - frames);
      if (prevFrame === newFrame) {
        return c2;
      }
      return {
        ...c2,
        [videoId]: newFrame
      };
    });
  }, [imperativePlaying, setFrame, videoId]);
  const frameForward = reactExports.useCallback((frames) => {
    if (!videoId) {
      return null;
    }
    if (imperativePlaying.current) {
      return;
    }
    setFrame((c2) => {
      const prevFrame = c2[videoId] ?? window.remotion_initialFrame ?? 0;
      const newFrame = Math.min(lastFrame, prevFrame + frames);
      if (prevFrame === newFrame) {
        return c2;
      }
      return {
        ...c2,
        [videoId]: newFrame
      };
    });
  }, [videoId, imperativePlaying, lastFrame, setFrame]);
  const toggle = reactExports.useCallback((e) => {
    if (imperativePlaying.current) {
      pause();
    } else {
      play(e);
    }
  }, [imperativePlaying, pause, play]);
  const isPlaying = reactExports.useCallback(() => {
    return imperativePlaying.current;
  }, [imperativePlaying]);
  const getCurrentFrame = reactExports.useCallback(() => {
    return frameRef.current;
  }, [frameRef]);
  const isBuffering = reactExports.useCallback(() => {
    return buffering.current;
  }, [buffering]);
  const returnValue = reactExports.useMemo(() => {
    return {
      frameBack,
      frameForward,
      isLastFrame,
      emitter,
      playing,
      play,
      pause,
      seek: seek2,
      isFirstFrame,
      getCurrentFrame,
      isPlaying,
      isBuffering,
      pauseAndReturnToPlayStart,
      hasPlayed,
      toggle
    };
  }, [
    emitter,
    frameBack,
    frameForward,
    hasPlayed,
    isFirstFrame,
    isLastFrame,
    getCurrentFrame,
    pause,
    pauseAndReturnToPlayStart,
    play,
    playing,
    seek2,
    toggle,
    isPlaying,
    isBuffering
  ]);
  return returnValue;
};
var useBrowserMediaSession = ({
  browserMediaControlsBehavior,
  videoConfig,
  playbackRate
}) => {
  const { playing, pause, play, emitter, getCurrentFrame, seek: seek2 } = usePlayer();
  const hasEverPlayed = reactExports.useRef(false);
  reactExports.useEffect(() => {
    if (playing) {
      hasEverPlayed.current = true;
    }
  }, [playing]);
  reactExports.useEffect(() => {
    if (!navigator.mediaSession) {
      return;
    }
    if (browserMediaControlsBehavior.mode === "do-nothing") {
      return;
    }
    if (playing) {
      navigator.mediaSession.playbackState = "playing";
    } else if (hasEverPlayed.current) {
      navigator.mediaSession.playbackState = "paused";
    }
  }, [browserMediaControlsBehavior.mode, playing]);
  reactExports.useEffect(() => {
    if (!navigator.mediaSession) {
      return;
    }
    if (browserMediaControlsBehavior.mode === "do-nothing") {
      return;
    }
    const onTimeUpdate = () => {
      if (!videoConfig) {
        return;
      }
      if (navigator.mediaSession) {
        navigator.mediaSession.setPositionState({
          duration: videoConfig.durationInFrames / videoConfig.fps,
          playbackRate,
          position: getCurrentFrame() / videoConfig.fps
        });
      }
    };
    emitter.addEventListener("timeupdate", onTimeUpdate);
    return () => {
      emitter.removeEventListener("timeupdate", onTimeUpdate);
    };
  }, [
    browserMediaControlsBehavior.mode,
    emitter,
    getCurrentFrame,
    playbackRate,
    videoConfig
  ]);
  reactExports.useEffect(() => {
    if (!navigator.mediaSession) {
      return;
    }
    if (browserMediaControlsBehavior.mode === "do-nothing") {
      return;
    }
    navigator.mediaSession.setActionHandler("play", () => {
      if (browserMediaControlsBehavior.mode === "register-media-session") {
        play();
      }
    });
    navigator.mediaSession.setActionHandler("pause", () => {
      if (browserMediaControlsBehavior.mode === "register-media-session") {
        pause();
      }
    });
    navigator.mediaSession.setActionHandler("seekto", (event) => {
      if (browserMediaControlsBehavior.mode === "register-media-session" && event.seekTime !== void 0 && videoConfig) {
        seek2(Math.round(event.seekTime * videoConfig.fps));
      }
    });
    navigator.mediaSession.setActionHandler("seekbackward", () => {
      if (browserMediaControlsBehavior.mode === "register-media-session" && videoConfig) {
        seek2(Math.max(0, Math.round((getCurrentFrame() - 10) * videoConfig.fps)));
      }
    });
    navigator.mediaSession.setActionHandler("seekforward", () => {
      if (browserMediaControlsBehavior.mode === "register-media-session" && videoConfig) {
        seek2(Math.max(videoConfig.durationInFrames - 1, Math.round((getCurrentFrame() + 10) * videoConfig.fps)));
      }
    });
    navigator.mediaSession.setActionHandler("previoustrack", () => {
      if (browserMediaControlsBehavior.mode === "register-media-session") {
        seek2(0);
      }
    });
    return () => {
      navigator.mediaSession.metadata = null;
      navigator.mediaSession.setActionHandler("play", null);
      navigator.mediaSession.setActionHandler("pause", null);
      navigator.mediaSession.setActionHandler("seekto", null);
      navigator.mediaSession.setActionHandler("seekbackward", null);
      navigator.mediaSession.setActionHandler("seekforward", null);
      navigator.mediaSession.setActionHandler("previoustrack", null);
    };
  }, [
    browserMediaControlsBehavior.mode,
    getCurrentFrame,
    pause,
    play,
    seek2,
    videoConfig
  ]);
};
var calculateNextFrame = ({
  time,
  currentFrame: startFrame,
  playbackSpeed,
  fps,
  actualLastFrame,
  actualFirstFrame,
  framesAdvanced,
  shouldLoop
}) => {
  const op = playbackSpeed < 0 ? Math.ceil : Math.floor;
  const framesToAdvance = op(time * playbackSpeed / (1e3 / fps)) - framesAdvanced;
  const nextFrame = framesToAdvance + startFrame;
  const isCurrentFrameOutside = startFrame > actualLastFrame || startFrame < actualFirstFrame;
  const isNextFrameOutside = nextFrame > actualLastFrame || nextFrame < actualFirstFrame;
  const hasEnded = !shouldLoop && isNextFrameOutside && !isCurrentFrameOutside;
  if (playbackSpeed > 0) {
    if (isNextFrameOutside) {
      return {
        nextFrame: actualFirstFrame,
        framesToAdvance,
        hasEnded
      };
    }
    return { nextFrame, framesToAdvance, hasEnded };
  }
  if (isNextFrameOutside) {
    return { nextFrame: actualLastFrame, framesToAdvance, hasEnded };
  }
  return { nextFrame, framesToAdvance, hasEnded };
};
var getIsBackgrounded = () => {
  if (typeof document === "undefined") {
    return false;
  }
  return document.visibilityState === "hidden";
};
var useIsBackgrounded = () => {
  const isBackgrounded = reactExports.useRef(getIsBackgrounded());
  reactExports.useEffect(() => {
    const onVisibilityChange = () => {
      isBackgrounded.current = getIsBackgrounded();
    };
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);
  return isBackgrounded;
};
var ALLOWED_GLOBAL_TIME_ANCHOR_SHIFT = 0.1;
var setGlobalTimeAnchor = ({
  audioContext,
  audioSyncAnchor,
  absoluteTimeInSeconds,
  globalPlaybackRate,
  logLevel,
  force
}) => {
  const newAnchor = audioContext.currentTime - absoluteTimeInSeconds / globalPlaybackRate;
  const shift = (newAnchor - audioSyncAnchor.value) * globalPlaybackRate;
  const { outputLatency } = audioContext;
  const safeOutputLatency = outputLatency === 0 ? 0.3 : outputLatency;
  const latency = audioContext.baseLatency + safeOutputLatency;
  if (Math.abs(shift) < ALLOWED_GLOBAL_TIME_ANCHOR_SHIFT + latency && !force) {
    return false;
  }
  Internals.Log.verbose({ logLevel, tag: "audio-scheduling" }, "Anchor " + (force ? "forcibly " : "") + "changed from %s to %s with shift %s", audioSyncAnchor.value, newAnchor, shift);
  audioSyncAnchor.value = newAnchor;
  return true;
};
var usePlayback = ({
  loop,
  playbackRate,
  moveToBeginningWhenEnded,
  inFrame,
  outFrame,
  browserMediaControlsBehavior,
  getCurrentFrame,
  muted
}) => {
  const config = Internals.useUnsafeVideoConfig();
  const frame = Internals.Timeline.useTimelinePosition();
  const { playing, pause, emitter, isPlaying } = usePlayer();
  const setFrame = Internals.Timeline.useTimelineSetFrame();
  const sharedAudioContext = reactExports.useContext(Internals.SharedAudioContext);
  const logLevel = Internals.useLogLevel();
  const isBackgroundedRef = useIsBackgrounded();
  const lastTimeUpdateTimestamp = reactExports.useRef(0);
  const context = reactExports.useContext(Internals.BufferingContextReact);
  if (!context) {
    throw new Error("Missing the buffering context. Most likely you have a Remotion version mismatch.");
  }
  useBrowserMediaSession({
    browserMediaControlsBehavior,
    playbackRate,
    videoConfig: config
  });
  reactExports.useLayoutEffect(() => {
    if (!sharedAudioContext) {
      return;
    }
    if (!sharedAudioContext.audioContext) {
      return;
    }
    if (!config) {
      return;
    }
    if (muted) {
      return;
    }
    const changed = setGlobalTimeAnchor({
      audioContext: sharedAudioContext.audioContext,
      audioSyncAnchor: sharedAudioContext.audioSyncAnchor,
      absoluteTimeInSeconds: frame / config.fps,
      globalPlaybackRate: playbackRate,
      logLevel,
      force: false
    });
    if (changed) {
      sharedAudioContext.audioSyncAnchorEmitter.dispatch("changed");
    }
  }, [config, frame, logLevel, playbackRate, sharedAudioContext, muted]);
  reactExports.useLayoutEffect(() => {
    const audioContext = sharedAudioContext?.audioContext;
    if (!audioContext) {
      return;
    }
    if (!config) {
      return;
    }
    if (muted) {
      return;
    }
    const callback = () => {
      if (audioContext.state !== "running") {
        setGlobalTimeAnchor({
          audioContext,
          audioSyncAnchor: sharedAudioContext.audioSyncAnchor,
          absoluteTimeInSeconds: getCurrentFrame() / config.fps,
          globalPlaybackRate: playbackRate,
          logLevel,
          force: true
        });
      }
    };
    audioContext?.addEventListener("statechange", callback);
    return () => {
      audioContext?.removeEventListener("statechange", callback);
    };
  }, [
    config,
    getCurrentFrame,
    logLevel,
    muted,
    playbackRate,
    sharedAudioContext
  ]);
  reactExports.useEffect(() => {
    if (!config) {
      return;
    }
    if (!playing) {
      sharedAudioContext?.suspend?.();
      return;
    }
    let hasBeenStopped = false;
    let reqAnimFrameCall = null;
    let startedTime = performance.now();
    let framesAdvanced = 0;
    const cancelQueuedFrame = () => {
      if (reqAnimFrameCall !== null) {
        if (reqAnimFrameCall.type === "raf") {
          cancelAnimationFrame(reqAnimFrameCall.id);
        } else {
          clearTimeout(reqAnimFrameCall.id);
        }
      }
    };
    const stop = () => {
      hasBeenStopped = true;
      cancelQueuedFrame();
    };
    const callback = () => {
      if (hasBeenStopped) {
        return;
      }
      if (!isPlaying()) {
        sharedAudioContext?.suspend?.();
        return;
      }
      if (!muted && !context.buffering.current) {
        sharedAudioContext?.resume?.();
      }
      const time = performance.now() - startedTime;
      const actualLastFrame = outFrame ?? config.durationInFrames - 1;
      const actualFirstFrame = inFrame ?? 0;
      const currentFrame = getCurrentFrame();
      const { nextFrame, framesToAdvance, hasEnded } = calculateNextFrame({
        time,
        currentFrame,
        playbackSpeed: playbackRate,
        fps: config.fps,
        actualFirstFrame,
        actualLastFrame,
        framesAdvanced,
        shouldLoop: loop
      });
      framesAdvanced += framesToAdvance;
      if (nextFrame !== getCurrentFrame() && (!hasEnded || moveToBeginningWhenEnded) && !context.buffering.current) {
        setFrame((c2) => ({ ...c2, [config.id]: nextFrame }));
      }
      if (hasEnded) {
        stop();
        pause();
        emitter.dispatchEnded();
        return;
      }
      queueNextFrame();
    };
    const queueNextFrame = () => {
      const getIsResumingAudioContext = sharedAudioContext?.getIsResumingAudioContext?.() ?? null;
      if (getIsResumingAudioContext !== null && !muted) {
        getIsResumingAudioContext.then(() => {
          startedTime = performance.now();
          framesAdvanced = 0;
          queueNextFrame();
        });
        return;
      }
      if (context.buffering.current) {
        if (!muted) {
          sharedAudioContext?.suspend?.();
        }
        const stopListening = context.listenForResume(() => {
          stopListening.remove();
          startedTime = performance.now();
          framesAdvanced = 0;
          queueNextFrame();
        });
        return;
      }
      if (isBackgroundedRef.current) {
        reqAnimFrameCall = {
          type: "timeout",
          id: setTimeout(callback, 1e3 / config.fps)
        };
        return;
      }
      reqAnimFrameCall = { type: "raf", id: requestAnimationFrame(callback) };
    };
    queueNextFrame();
    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        return;
      }
      cancelQueuedFrame();
      callback();
    };
    window.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      window.removeEventListener("visibilitychange", onVisibilityChange);
      stop();
    };
  }, [
    config,
    loop,
    pause,
    playing,
    setFrame,
    emitter,
    playbackRate,
    inFrame,
    outFrame,
    moveToBeginningWhenEnded,
    isBackgroundedRef,
    getCurrentFrame,
    context,
    isPlaying,
    sharedAudioContext,
    logLevel,
    muted
  ]);
  reactExports.useEffect(() => {
    const now = performance.now();
    const timeSinceLastUpdate = now - lastTimeUpdateTimestamp.current;
    if (timeSinceLastUpdate >= 250) {
      emitter.dispatchTimeUpdate({ frame });
      lastTimeUpdateTimestamp.current = now;
      return;
    }
    const timeoutId = setTimeout(() => {
      emitter.dispatchTimeUpdate({ frame });
      lastTimeUpdateTimestamp.current = performance.now();
    }, 250 - timeSinceLastUpdate);
    return () => clearTimeout(timeoutId);
  }, [emitter, frame]);
  reactExports.useEffect(() => {
    emitter.dispatchFrameUpdate({ frame });
  }, [emitter, frame]);
};
var elementSizeHooks = [];
var useElementSize = (ref, options) => {
  const [size, setSize] = reactExports.useState(() => {
    if (!ref.current) {
      return null;
    }
    const rect = ref.current.getClientRects();
    if (!rect[0]) {
      return null;
    }
    return {
      width: rect[0].width,
      height: rect[0].height,
      left: rect[0].x,
      top: rect[0].y,
      windowSize: {
        height: window.innerHeight,
        width: window.innerWidth
      }
    };
  });
  const observer = reactExports.useMemo(() => {
    if (typeof ResizeObserver === "undefined") {
      return null;
    }
    return new ResizeObserver((entries) => {
      const { contentRect, target } = entries[0];
      const newSize = target.getClientRects();
      if (!newSize?.[0]) {
        setSize(null);
        return;
      }
      const probableCssParentScaleX = contentRect.width === 0 ? 1 : newSize[0].width / contentRect.width;
      const probableCssParentScaleY = contentRect.height === 0 ? 1 : newSize[0].height / contentRect.height;
      const width = options.shouldApplyCssTransforms || probableCssParentScaleX === 0 ? newSize[0].width : newSize[0].width * (1 / probableCssParentScaleX);
      const height = options.shouldApplyCssTransforms || probableCssParentScaleY === 0 ? newSize[0].height : newSize[0].height * (1 / probableCssParentScaleY);
      setSize((prevState) => {
        const isSame = prevState && prevState.width === width && prevState.height === height && prevState.left === newSize[0].x && prevState.top === newSize[0].y && prevState.windowSize.height === window.innerHeight && prevState.windowSize.width === window.innerWidth;
        if (isSame) {
          return prevState;
        }
        return {
          width,
          height,
          left: newSize[0].x,
          top: newSize[0].y,
          windowSize: {
            height: window.innerHeight,
            width: window.innerWidth
          }
        };
      });
    });
  }, [options.shouldApplyCssTransforms]);
  const updateSize = reactExports.useCallback(() => {
    if (!ref.current) {
      return;
    }
    const rect = ref.current.getClientRects();
    if (!rect[0]) {
      setSize(null);
      return;
    }
    setSize((prevState) => {
      const isSame = prevState && prevState.width === rect[0].width && prevState.height === rect[0].height && prevState.left === rect[0].x && prevState.top === rect[0].y && prevState.windowSize.height === window.innerHeight && prevState.windowSize.width === window.innerWidth;
      if (isSame) {
        return prevState;
      }
      return {
        width: rect[0].width,
        height: rect[0].height,
        left: rect[0].x,
        top: rect[0].y,
        windowSize: {
          height: window.innerHeight,
          width: window.innerWidth
        }
      };
    });
  }, [ref]);
  reactExports.useEffect(() => {
    if (!observer) {
      return;
    }
    const { current } = ref;
    if (current) {
      observer.observe(current);
    }
    return () => {
      if (current) {
        observer.unobserve(current);
      }
    };
  }, [observer, ref, updateSize]);
  reactExports.useEffect(() => {
    if (!options.triggerOnWindowResize) {
      return;
    }
    window.addEventListener("resize", updateSize);
    return () => {
      window.removeEventListener("resize", updateSize);
    };
  }, [options.triggerOnWindowResize, updateSize]);
  reactExports.useEffect(() => {
    elementSizeHooks.push(updateSize);
    return () => {
      elementSizeHooks = elementSizeHooks.filter((e) => e !== updateSize);
    };
  }, [updateSize]);
  return reactExports.useMemo(() => {
    if (!size) {
      return null;
    }
    return { ...size, refresh: updateSize };
  }, [size, updateSize]);
};
var playerCssClassname = (override) => {
  return override ?? "__remotion-player";
};
var errorStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flex: 1,
  height: "100%",
  width: "100%"
};
class ErrorBoundary extends React.Component {
  state = { hasError: null };
  static getDerivedStateFromError(error2) {
    return { hasError: error2 };
  }
  componentDidCatch(error2) {
    this.props.onError(error2);
  }
  render() {
    if (this.state.hasError) {
      return /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
        style: errorStyle,
        children: this.props.errorFallback({
          error: this.state.hasError
        })
      });
    }
    return this.props.children;
  }
}
var getHashOfDomain = async () => {
  if (typeof window === "undefined") {
    return null;
  }
  if (typeof window.crypto === "undefined") {
    return null;
  }
  if (typeof window.crypto.subtle === "undefined") {
    return null;
  }
  try {
    const hashBuffer = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(window.location.hostname));
    return Array.from(new Uint8Array(hashBuffer)).map((b2) => b2.toString(16).padStart(2, "0")).join("");
  } catch {
    return null;
  }
};
var style = {
  backgroundColor: "red",
  position: "absolute",
  padding: 12,
  fontFamily: "Arial"
};
var DOMAIN_BLACKLIST = [
  "28d262b44cc61fa750f1686b16ad0604dabfe193fbc263eec05c89b7ad4c2cd6",
  "4db1b0a94be33165dfefcb3ba03d04c7a2666dd27c496d3dc9fa41858e94925e",
  "fbc48530bbf245da790f63675e84e06bab38c3b114fab07eb350025119922bdc",
  "7baf10a8932757b1b3a22b3fce10a048747ac2f8eaf638603487e3705b07eb83",
  "8a6c21a598d8c667272b5207c051b85997bf5b45d5fb712378be3f27cd72c6a6",
  "a2f7aaac9c50a9255e7fc376110c4e0bfe153722dc66ed3c5d3bf2a135f65518"
];
var ran = false;
var RenderWarningIfBlacklist = () => {
  const [unlicensed, setUnlicensed] = React.useState(false);
  reactExports.useEffect(() => {
    if (ran) {
      return;
    }
    ran = true;
    getHashOfDomain().then((hash) => {
      if (hash && DOMAIN_BLACKLIST.includes(hash)) {
        setUnlicensed(true);
      }
    }).catch(() => {
    });
  }, []);
  reactExports.useEffect(() => {
    if (!unlicensed) {
      return;
    }
    const ensureBanner = () => {
      const banner = document.querySelector(".warning-banner");
      if (!banner) {
        const div = document.createElement("div");
        div.className = "warning-banner";
        Object.assign(div.style, style, {
          zIndex: "9999",
          cssText: `${style.cssText} !important;`
        });
        div.innerHTML = `
	        <a href="https://github.com/remotion-dev/remotion/pull/4589" style="color: white;">
	          Remotion Unlicensed – Contact hi@remotion.dev
	        </a>
	      `;
        document.body.appendChild(div);
      }
    };
    const observer = new MutationObserver(() => ensureBanner());
    observer.observe(document.body, { childList: true, subtree: true });
    return () => {
      observer.disconnect();
    };
  }, [unlicensed]);
  if (!unlicensed) {
    return null;
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
    style,
    className: "warning-banner",
    children: /* @__PURE__ */ jsxRuntimeExports.jsx("a", {
      style: { color: "white" },
      href: "https://github.com/remotion-dev/remotion/pull/4589",
      children: "Remotion Unlicensed – Contact hi@remotion.dev"
    })
  });
};
var DefaultPlayPauseButton = ({ playing, buffering }) => {
  if (playing && buffering) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(BufferingIndicator, {
      type: "player"
    });
  }
  if (playing) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(PauseIcon, {});
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(PlayIcon, {});
};
var KNOB_SIZE = 12;
var BAR_HEIGHT = 5;
var DefaultVolumeSlider = ({
  volume,
  isVertical,
  onBlur,
  inputRef,
  setVolume
}) => {
  const sliderContainer = reactExports.useMemo(() => {
    const paddingLeft = 5;
    const common = {
      paddingLeft,
      height: ICON_SIZE,
      width: VOLUME_SLIDER_WIDTH,
      display: "inline-flex",
      alignItems: "center"
    };
    if (isVertical) {
      return {
        ...common,
        position: "absolute",
        transform: `rotate(-90deg) translateX(${VOLUME_SLIDER_WIDTH / 2 + ICON_SIZE / 2}px)`
      };
    }
    return {
      ...common
    };
  }, [isVertical]);
  const randomId = typeof React.useId === "undefined" ? "volume-slider" : React.useId();
  const [randomClass] = reactExports.useState(() => `__remotion-volume-slider-${random(randomId)}`.replace(".", ""));
  const onVolumeChange = reactExports.useCallback((e) => {
    setVolume(parseFloat(e.target.value));
  }, [setVolume]);
  const inputStyle = reactExports.useMemo(() => {
    const commonStyle = {
      WebkitAppearance: "none",
      backgroundColor: "rgba(255, 255, 255, 0.5)",
      borderRadius: BAR_HEIGHT / 2,
      cursor: "pointer",
      height: BAR_HEIGHT,
      width: VOLUME_SLIDER_WIDTH,
      backgroundImage: `linear-gradient(
				to right,
				white ${volume * 100}%, rgba(255, 255, 255, 0) ${volume * 100}%
			)`
    };
    if (isVertical) {
      return {
        ...commonStyle,
        bottom: ICON_SIZE + VOLUME_SLIDER_WIDTH / 2
      };
    }
    return commonStyle;
  }, [isVertical, volume]);
  const sliderStyle = `
	.${randomClass}::-webkit-slider-thumb {
		-webkit-appearance: none;
		background-color: white;
		border-radius: ${KNOB_SIZE / 2}px;
		box-shadow: 0 0 2px black;
		height: ${KNOB_SIZE}px;
		width: ${KNOB_SIZE}px;
	}

	.${randomClass}::-moz-range-thumb {
		-webkit-appearance: none;
		background-color: white;
		border-radius: ${KNOB_SIZE / 2}px;
		box-shadow: 0 0 2px black;
		height: ${KNOB_SIZE}px;
		width: ${KNOB_SIZE}px;
	}
`;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
    style: sliderContainer,
    children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("style", {
        dangerouslySetInnerHTML: {
          __html: sliderStyle
        }
      }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", {
        ref: inputRef,
        "aria-label": "Change volume",
        className: randomClass,
        max: 1,
        min: 0,
        onBlur,
        onChange: onVolumeChange,
        step: 0.01,
        type: "range",
        value: volume,
        style: inputStyle
      })
    ]
  });
};
var renderDefaultVolumeSlider = (props) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(DefaultVolumeSlider, {
    ...props
  });
};
var VOLUME_SLIDER_WIDTH = 100;
var MediaVolumeSlider = ({ displayVerticalVolumeSlider, renderMuteButton, renderVolumeSlider }) => {
  const [mediaMuted, setMediaMuted] = Internals.useMediaMutedState();
  const [mediaVolume, setMediaVolume] = Internals.useMediaVolumeState();
  const [focused, setFocused] = reactExports.useState(false);
  const parentDivRef = reactExports.useRef(null);
  const inputRef = reactExports.useRef(null);
  const hover = useHoverState(parentDivRef, false);
  const onBlur = reactExports.useCallback(() => {
    setTimeout(() => {
      if (inputRef.current && document.activeElement !== inputRef.current) {
        setFocused(false);
      }
    }, 10);
  }, []);
  const isVolume0 = mediaVolume === 0;
  const onClick = reactExports.useCallback(() => {
    if (isVolume0) {
      setMediaVolume(1);
      setMediaMuted(false);
      return;
    }
    setMediaMuted((mute) => !mute);
  }, [isVolume0, setMediaMuted, setMediaVolume]);
  const parentDivStyle = reactExports.useMemo(() => {
    return {
      display: "inline-flex",
      background: "none",
      border: "none",
      justifyContent: "center",
      alignItems: "center",
      touchAction: "none",
      ...displayVerticalVolumeSlider && { position: "relative" }
    };
  }, [displayVerticalVolumeSlider]);
  const volumeContainer = reactExports.useMemo(() => {
    return {
      display: "inline",
      width: ICON_SIZE,
      height: ICON_SIZE,
      cursor: "pointer",
      appearance: "none",
      background: "none",
      border: "none",
      padding: 0
    };
  }, []);
  const renderDefaultMuteButton = reactExports.useCallback(({ muted, volume }) => {
    const isMutedOrZero = muted || volume === 0;
    return /* @__PURE__ */ jsxRuntimeExports.jsx("button", {
      "aria-label": isMutedOrZero ? "Unmute sound" : "Mute sound",
      title: isMutedOrZero ? "Unmute sound" : "Mute sound",
      onClick,
      onBlur,
      onFocus: () => setFocused(true),
      style: volumeContainer,
      type: "button",
      children: isMutedOrZero ? /* @__PURE__ */ jsxRuntimeExports.jsx(VolumeOffIcon, {}) : /* @__PURE__ */ jsxRuntimeExports.jsx(VolumeOnIcon, {})
    });
  }, [onBlur, onClick, volumeContainer]);
  const muteButton = reactExports.useMemo(() => {
    return renderMuteButton ? renderMuteButton({ muted: mediaMuted, volume: mediaVolume }) : renderDefaultMuteButton({ muted: mediaMuted, volume: mediaVolume });
  }, [mediaMuted, mediaVolume, renderDefaultMuteButton, renderMuteButton]);
  const volumeSlider = reactExports.useMemo(() => {
    return (focused || hover) && !mediaMuted && !Internals.isIosSafari() ? (renderVolumeSlider ?? renderDefaultVolumeSlider)({
      isVertical: displayVerticalVolumeSlider,
      volume: mediaVolume,
      onBlur: () => setFocused(false),
      inputRef,
      setVolume: setMediaVolume
    }) : null;
  }, [
    displayVerticalVolumeSlider,
    focused,
    hover,
    mediaMuted,
    mediaVolume,
    renderVolumeSlider,
    setMediaVolume
  ]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
    ref: parentDivRef,
    style: parentDivStyle,
    children: [
      muteButton,
      volumeSlider
    ]
  });
};
function useComponentVisible(initialIsVisible) {
  const [isComponentVisible, setIsComponentVisible] = reactExports.useState(initialIsVisible);
  const ref = reactExports.useRef(null);
  reactExports.useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setIsComponentVisible(false);
      }
    };
    document.addEventListener("pointerup", handleClickOutside, true);
    return () => {
      document.removeEventListener("pointerup", handleClickOutside, true);
    };
  }, []);
  return { ref, isComponentVisible, setIsComponentVisible };
}
var BOTTOM = 35;
var THRESHOLD = 70;
var rateDiv = {
  height: 30,
  paddingRight: 15,
  paddingLeft: 12,
  display: "flex",
  flexDirection: "row",
  alignItems: "center"
};
var checkmarkContainer = {
  width: 22,
  display: "flex",
  alignItems: "center"
};
var checkmarkStyle = {
  width: 14,
  height: 14,
  color: "black"
};
var Checkmark = () => /* @__PURE__ */ jsxRuntimeExports.jsx("svg", {
  viewBox: "0 0 512 512",
  style: checkmarkStyle,
  children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", {
    fill: "currentColor",
    d: "M435.848 83.466L172.804 346.51l-96.652-96.652c-4.686-4.686-12.284-4.686-16.971 0l-28.284 28.284c-4.686 4.686-4.686 12.284 0 16.971l133.421 133.421c4.686 4.686 12.284 4.686 16.971 0l299.813-299.813c4.686-4.686 4.686-12.284 0-16.971l-28.284-28.284c-4.686-4.686-12.284-4.686-16.97 0z"
  })
});
var formatPlaybackRate = (rate) => {
  const str = rate.toString();
  return str.includes(".") ? str : str + ".0";
};
var PlaybackrateOption = ({ rate, onSelect, selectedRate, keyboardSelectedRate }) => {
  const onClick = reactExports.useCallback((e) => {
    e.stopPropagation();
    e.preventDefault();
    onSelect(rate);
  }, [onSelect, rate]);
  const [hovered, setHovered] = reactExports.useState(false);
  const onMouseEnter = reactExports.useCallback(() => {
    setHovered(true);
  }, []);
  const onMouseLeave = reactExports.useCallback(() => {
    setHovered(false);
  }, []);
  const isFocused = keyboardSelectedRate === rate;
  const actualStyle = reactExports.useMemo(() => {
    return {
      ...rateDiv,
      backgroundColor: hovered || isFocused ? "#eee" : "transparent"
    };
  }, [hovered, isFocused]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
    onPointerEnter: onMouseEnter,
    onPointerLeave: onMouseLeave,
    tabIndex: 0,
    style: actualStyle,
    onClick,
    children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
        style: checkmarkContainer,
        children: rate === selectedRate ? /* @__PURE__ */ jsxRuntimeExports.jsx(Checkmark, {}) : null
      }),
      formatPlaybackRate(rate),
      "x"
    ]
  }, rate);
};
var PlaybackPopup = ({ setIsComponentVisible, playbackRates, canvasSize }) => {
  const { setPlaybackRate, playbackRate } = Internals.usePlaybackRate();
  const [keyboardSelectedRate, setKeyboardSelectedRate] = reactExports.useState(playbackRate);
  reactExports.useEffect(() => {
    const listener = (e) => {
      e.preventDefault();
      if (e.key === "ArrowUp") {
        const currentIndex = playbackRates.findIndex((rate) => rate === keyboardSelectedRate);
        if (currentIndex === 0) {
          return;
        }
        if (currentIndex === -1) {
          setKeyboardSelectedRate(playbackRates[0]);
        } else {
          setKeyboardSelectedRate(playbackRates[currentIndex - 1]);
        }
      } else if (e.key === "ArrowDown") {
        const currentIndex = playbackRates.findIndex((rate) => rate === keyboardSelectedRate);
        if (currentIndex === playbackRates.length - 1) {
          return;
        }
        if (currentIndex === -1) {
          setKeyboardSelectedRate(playbackRates[playbackRates.length - 1]);
        } else {
          setKeyboardSelectedRate(playbackRates[currentIndex + 1]);
        }
      } else if (e.key === "Enter") {
        setPlaybackRate(keyboardSelectedRate);
        setIsComponentVisible(false);
      }
    };
    window.addEventListener("keydown", listener);
    return () => {
      window.removeEventListener("keydown", listener);
    };
  }, [
    playbackRates,
    keyboardSelectedRate,
    setPlaybackRate,
    setIsComponentVisible
  ]);
  const onSelect = reactExports.useCallback((rate) => {
    setPlaybackRate(rate);
    setIsComponentVisible(false);
  }, [setIsComponentVisible, setPlaybackRate]);
  const playbackPopup = reactExports.useMemo(() => {
    return {
      position: "absolute",
      right: 0,
      width: 125,
      maxHeight: canvasSize.height - THRESHOLD - BOTTOM,
      bottom: 35,
      background: "#fff",
      borderRadius: 4,
      overflow: "auto",
      color: "black",
      textAlign: "left"
    };
  }, [canvasSize.height]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
    style: playbackPopup,
    children: playbackRates.map((rate) => {
      return /* @__PURE__ */ jsxRuntimeExports.jsx(PlaybackrateOption, {
        selectedRate: playbackRate,
        onSelect,
        rate,
        keyboardSelectedRate
      }, rate);
    })
  });
};
var label = {
  fontSize: 13,
  fontWeight: "bold",
  color: "white",
  border: "2px solid white",
  borderRadius: 20,
  paddingLeft: 8,
  paddingRight: 8,
  paddingTop: 2,
  paddingBottom: 2
};
var playerButtonStyle = {
  appearance: "none",
  backgroundColor: "transparent",
  border: "none",
  cursor: "pointer",
  paddingLeft: 0,
  paddingRight: 0,
  paddingTop: 6,
  paddingBottom: 6,
  height: 37,
  display: "inline-flex",
  marginBottom: 0,
  marginTop: 0,
  alignItems: "center"
};
var button = {
  ...playerButtonStyle,
  position: "relative"
};
var PlaybackrateControl = ({ playbackRates, canvasSize }) => {
  const { ref, isComponentVisible, setIsComponentVisible } = useComponentVisible(false);
  const { playbackRate } = Internals.usePlaybackRate();
  const onClick = reactExports.useCallback((e) => {
    e.stopPropagation();
    e.preventDefault();
    setIsComponentVisible((prevIsComponentVisible) => !prevIsComponentVisible);
  }, [setIsComponentVisible]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
    ref,
    children: /* @__PURE__ */ jsxRuntimeExports.jsxs("button", {
      type: "button",
      "aria-label": "Change playback rate",
      style: button,
      onClick,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
          style: label,
          children: [
            playbackRate,
            "x"
          ]
        }),
        isComponentVisible && /* @__PURE__ */ jsxRuntimeExports.jsx(PlaybackPopup, {
          canvasSize,
          playbackRates,
          setIsComponentVisible
        })
      ]
    })
  });
};
var getFrameFromX = (clientX, durationInFrames, width) => {
  const pos = clientX;
  const frame = Math.round(interpolate(pos, [0, width], [0, durationInFrames - 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp"
  }));
  return frame;
};
var BAR_HEIGHT2 = 5;
var KNOB_SIZE2 = 12;
var VERTICAL_PADDING = 4;
var containerStyle = {
  userSelect: "none",
  WebkitUserSelect: "none",
  paddingTop: VERTICAL_PADDING,
  paddingBottom: VERTICAL_PADDING,
  boxSizing: "border-box",
  cursor: "pointer",
  position: "relative",
  touchAction: "none"
};
var barBackground = {
  height: BAR_HEIGHT2,
  backgroundColor: "rgba(255, 255, 255, 0.25)",
  width: "100%",
  borderRadius: BAR_HEIGHT2 / 2
};
var findBodyInWhichDivIsLocated = (div) => {
  let current = div;
  while (current.parentElement) {
    current = current.parentElement;
  }
  return current;
};
var PlayerSeekBar = ({ durationInFrames, onSeekEnd, onSeekStart, inFrame, outFrame }) => {
  const containerRef = reactExports.useRef(null);
  const barHovered = useHoverState(containerRef, false);
  const size = useElementSize(containerRef, {
    triggerOnWindowResize: true,
    shouldApplyCssTransforms: true
  });
  const { seek: seek2, play, pause, playing } = usePlayer();
  const frame = Internals.Timeline.useTimelinePosition();
  const [dragging, setDragging] = reactExports.useState({
    dragging: false
  });
  const width = size?.width ?? 0;
  const onPointerDown = reactExports.useCallback((e) => {
    if (e.button !== 0) {
      return;
    }
    const posLeft = containerRef.current?.getBoundingClientRect().left;
    const _frame = getFrameFromX(e.clientX - posLeft, durationInFrames, width);
    pause();
    seek2(_frame);
    setDragging({
      dragging: true,
      wasPlaying: playing
    });
    onSeekStart();
  }, [durationInFrames, width, pause, seek2, playing, onSeekStart]);
  const onPointerMove = reactExports.useCallback((e) => {
    if (!size) {
      throw new Error("Player has no size");
    }
    if (!dragging.dragging) {
      return;
    }
    const posLeft = containerRef.current?.getBoundingClientRect().left;
    const _frame = getFrameFromX(e.clientX - posLeft, durationInFrames, size.width);
    seek2(_frame);
  }, [dragging.dragging, durationInFrames, seek2, size]);
  const onPointerUp = reactExports.useCallback(() => {
    setDragging({
      dragging: false
    });
    if (!dragging.dragging) {
      return;
    }
    if (dragging.wasPlaying) {
      play();
    } else {
      pause();
    }
    onSeekEnd();
  }, [dragging, onSeekEnd, pause, play]);
  reactExports.useEffect(() => {
    if (!dragging.dragging) {
      return;
    }
    const body = findBodyInWhichDivIsLocated(containerRef.current);
    body.addEventListener("pointermove", onPointerMove);
    body.addEventListener("pointerup", onPointerUp);
    return () => {
      body.removeEventListener("pointermove", onPointerMove);
      body.removeEventListener("pointerup", onPointerUp);
    };
  }, [dragging.dragging, onPointerMove, onPointerUp]);
  const knobStyle = reactExports.useMemo(() => {
    return {
      height: KNOB_SIZE2,
      width: KNOB_SIZE2,
      borderRadius: KNOB_SIZE2 / 2,
      position: "absolute",
      top: VERTICAL_PADDING - KNOB_SIZE2 / 2 + 5 / 2,
      backgroundColor: "white",
      left: Math.max(0, frame / Math.max(1, durationInFrames - 1) * width - KNOB_SIZE2 / 2),
      boxShadow: "0 0 2px black",
      opacity: Number(barHovered || dragging.dragging)
    };
  }, [barHovered, dragging.dragging, durationInFrames, frame, width]);
  const fillStyle = reactExports.useMemo(() => {
    return {
      height: BAR_HEIGHT2,
      backgroundColor: "rgba(255, 255, 255, 1)",
      width: (frame - (inFrame ?? 0)) / (durationInFrames - 1) * width,
      marginLeft: (inFrame ?? 0) / (durationInFrames - 1) * width,
      borderRadius: BAR_HEIGHT2 / 2
    };
  }, [durationInFrames, frame, inFrame, width]);
  const active = reactExports.useMemo(() => {
    return {
      height: BAR_HEIGHT2,
      backgroundColor: "rgba(255, 255, 255, 0.25)",
      width: ((outFrame ?? durationInFrames - 1) - (inFrame ?? 0)) / (durationInFrames - 1) * 100 + "%",
      marginLeft: (inFrame ?? 0) / (durationInFrames - 1) * 100 + "%",
      borderRadius: BAR_HEIGHT2 / 2,
      position: "absolute"
    };
  }, [durationInFrames, inFrame, outFrame]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
    ref: containerRef,
    onPointerDown,
    style: containerStyle,
    children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
        style: barBackground,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
            style: active
          }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
            style: fillStyle
          })
        ]
      }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
        style: knobStyle
      })
    ]
  });
};
var formatTime = (timeInSeconds) => {
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = Math.floor(timeInSeconds - minutes * 60);
  return `${String(minutes)}:${String(seconds).padStart(2, "0")}`;
};
var PlayerTimeLabel = ({ durationInFrames, maxTimeLabelWidth, fps }) => {
  const frame = Internals.Timeline.useTimelinePosition();
  const timeLabel = reactExports.useMemo(() => {
    return {
      color: "white",
      fontFamily: "sans-serif",
      fontSize: 14,
      maxWidth: maxTimeLabelWidth === null ? void 0 : maxTimeLabelWidth,
      overflow: "hidden",
      textOverflow: "ellipsis"
    };
  }, [maxTimeLabelWidth]);
  const isLastFrame = frame === durationInFrames - 1;
  const frameToDisplay = isLastFrame ? frame + 1 : frame;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
    style: timeLabel,
    children: [
      formatTime(frameToDisplay / fps),
      " / ",
      formatTime(durationInFrames / fps)
    ]
  });
};
var X_SPACER = 10;
var X_PADDING = 12;
var useVideoControlsResize = ({
  allowFullscreen: allowFullScreen,
  playerWidth
}) => {
  const resizeInfo = reactExports.useMemo(() => {
    const playPauseIconSize = ICON_SIZE;
    const volumeIconSize = ICON_SIZE;
    const _fullscreenIconSize = allowFullScreen ? fullscreenIconSize : 0;
    const elementsSize = volumeIconSize + playPauseIconSize + _fullscreenIconSize + X_PADDING * 2 + X_SPACER * 2;
    const maxTimeLabelWidth = playerWidth - elementsSize;
    const maxTimeLabelWidthWithoutNegativeValue = Math.max(maxTimeLabelWidth, 0);
    const availableTimeLabelWidthIfVolumeOpen = maxTimeLabelWidthWithoutNegativeValue - VOLUME_SLIDER_WIDTH;
    const computedLabelWidth = availableTimeLabelWidthIfVolumeOpen < VOLUME_SLIDER_WIDTH ? maxTimeLabelWidthWithoutNegativeValue : availableTimeLabelWidthIfVolumeOpen;
    const minWidthForHorizontalDisplay = computedLabelWidth + elementsSize + VOLUME_SLIDER_WIDTH;
    const displayVerticalVolumeSlider = playerWidth < minWidthForHorizontalDisplay;
    return {
      maxTimeLabelWidth: maxTimeLabelWidthWithoutNegativeValue === 0 ? null : maxTimeLabelWidthWithoutNegativeValue,
      displayVerticalVolumeSlider
    };
  }, [allowFullScreen, playerWidth]);
  return resizeInfo;
};
var gradientSteps = [
  0,
  0.013,
  0.049,
  0.104,
  0.175,
  0.259,
  0.352,
  0.45,
  0.55,
  0.648,
  0.741,
  0.825,
  0.896,
  0.951,
  0.987
];
var gradientOpacities = [
  0,
  8.1,
  15.5,
  22.5,
  29,
  35.3,
  41.2,
  47.1,
  52.9,
  58.8,
  64.7,
  71,
  77.5,
  84.5,
  91.9
];
var globalGradientOpacity = 1 / 0.7;
var containerStyle2 = {
  boxSizing: "border-box",
  position: "absolute",
  bottom: 0,
  width: "100%",
  paddingTop: 40,
  paddingBottom: 10,
  backgroundImage: `linear-gradient(to bottom,${gradientSteps.map((g, i) => {
    return `hsla(0, 0%, 0%, ${g}) ${gradientOpacities[i] * globalGradientOpacity}%`;
  }).join(", ")}, hsl(0, 0%, 0%) 100%)`,
  backgroundSize: "auto 145px",
  display: "flex",
  paddingRight: X_PADDING,
  paddingLeft: X_PADDING,
  flexDirection: "column",
  transition: "opacity 0.3s"
};
var controlsRow = {
  display: "flex",
  flexDirection: "row",
  width: "100%",
  alignItems: "center",
  justifyContent: "center",
  userSelect: "none",
  WebkitUserSelect: "none"
};
var leftPartStyle = {
  display: "flex",
  flexDirection: "row",
  userSelect: "none",
  WebkitUserSelect: "none",
  alignItems: "center"
};
var xSpacer = {
  width: 12
};
var ySpacer = {
  height: 8
};
var flex1 = {
  flex: 1
};
var fullscreen = {};
var Controls = ({
  durationInFrames,
  isFullscreen,
  fps,
  showVolumeControls,
  onFullscreenButtonClick,
  allowFullscreen,
  onExitFullscreenButtonClick,
  spaceKeyToPlayOrPause,
  onSeekEnd,
  onSeekStart,
  inFrame,
  outFrame,
  initiallyShowControls,
  canvasSize,
  renderPlayPauseButton,
  renderFullscreenButton,
  alwaysShowControls,
  showPlaybackRateControl,
  containerRef,
  buffering,
  hideControlsWhenPointerDoesntMove,
  onPointerDown,
  onDoubleClick,
  renderMuteButton,
  renderVolumeSlider,
  playing,
  toggle,
  renderCustomControls
}) => {
  const playButtonRef = reactExports.useRef(null);
  const [supportsFullscreen, setSupportsFullscreen] = reactExports.useState(false);
  const hovered = useHoverState(containerRef, hideControlsWhenPointerDoesntMove);
  const { maxTimeLabelWidth, displayVerticalVolumeSlider } = useVideoControlsResize({
    allowFullscreen,
    playerWidth: canvasSize?.width ?? 0
  });
  const [shouldShowInitially, setInitiallyShowControls] = reactExports.useState(() => {
    if (typeof initiallyShowControls === "boolean") {
      return initiallyShowControls;
    }
    if (typeof initiallyShowControls === "number") {
      if (initiallyShowControls % 1 !== 0) {
        throw new Error("initiallyShowControls must be an integer or a boolean");
      }
      if (Number.isNaN(initiallyShowControls)) {
        throw new Error("initiallyShowControls must not be NaN");
      }
      if (!Number.isFinite(initiallyShowControls)) {
        throw new Error("initiallyShowControls must be finite");
      }
      if (initiallyShowControls <= 0) {
        throw new Error("initiallyShowControls must be a positive integer");
      }
      return initiallyShowControls;
    }
    throw new TypeError("initiallyShowControls must be a number or a boolean");
  });
  const containerCss = reactExports.useMemo(() => {
    const shouldShow = hovered || !playing || shouldShowInitially || alwaysShowControls;
    return {
      ...containerStyle2,
      opacity: Number(shouldShow)
    };
  }, [hovered, shouldShowInitially, playing, alwaysShowControls]);
  reactExports.useEffect(() => {
    if (playButtonRef.current && spaceKeyToPlayOrPause) {
      playButtonRef.current.focus({
        preventScroll: true
      });
    }
  }, [playing, spaceKeyToPlayOrPause]);
  reactExports.useEffect(() => {
    setSupportsFullscreen((typeof document !== "undefined" && (document.fullscreenEnabled || document.webkitFullscreenEnabled)) ?? false);
  }, []);
  reactExports.useEffect(() => {
    if (shouldShowInitially === false) {
      return;
    }
    const time = shouldShowInitially === true ? 2e3 : shouldShowInitially;
    const timeout = setTimeout(() => {
      setInitiallyShowControls(false);
    }, time);
    return () => {
      clearInterval(timeout);
    };
  }, [shouldShowInitially]);
  const playbackRates = reactExports.useMemo(() => {
    if (showPlaybackRateControl === true) {
      return [0.5, 0.8, 1, 1.2, 1.5, 1.8, 2, 2.5, 3];
    }
    if (Array.isArray(showPlaybackRateControl)) {
      for (const rate of showPlaybackRateControl) {
        if (typeof rate !== "number") {
          throw new Error("Every item in showPlaybackRateControl must be a number");
        }
        if (rate <= 0) {
          throw new Error("Every item in showPlaybackRateControl must be positive");
        }
      }
      return showPlaybackRateControl;
    }
    return null;
  }, [showPlaybackRateControl]);
  const customControlsElement = renderCustomControls ? renderCustomControls() : null;
  const ref = reactExports.useRef(null);
  const flexRef = reactExports.useRef(null);
  const onPointerDownIfContainer = reactExports.useCallback((e) => {
    if (e.target === ref.current || e.target === flexRef.current) {
      onPointerDown?.(e);
    }
  }, [onPointerDown]);
  const onDoubleClickIfContainer = reactExports.useCallback((e) => {
    if (e.target === ref.current || e.target === flexRef.current) {
      onDoubleClick?.(e);
    }
  }, [onDoubleClick]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
    ref,
    style: containerCss,
    onPointerDown: onPointerDownIfContainer,
    onDoubleClick: onDoubleClickIfContainer,
    children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
        ref: flexRef,
        style: controlsRow,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
            style: leftPartStyle,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", {
                ref: playButtonRef,
                type: "button",
                style: playerButtonStyle,
                onClick: toggle,
                "aria-label": playing ? "Pause video" : "Play video",
                title: playing ? "Pause video" : "Play video",
                children: renderPlayPauseButton === null ? /* @__PURE__ */ jsxRuntimeExports.jsx(DefaultPlayPauseButton, {
                  buffering,
                  playing
                }) : renderPlayPauseButton({
                  playing,
                  isBuffering: buffering
                }) ?? /* @__PURE__ */ jsxRuntimeExports.jsx(DefaultPlayPauseButton, {
                  buffering,
                  playing
                })
              }),
              showVolumeControls ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, {
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                    style: xSpacer
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(MediaVolumeSlider, {
                    renderMuteButton,
                    renderVolumeSlider,
                    displayVerticalVolumeSlider
                  })
                ]
              }) : null,
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                style: xSpacer
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(PlayerTimeLabel, {
                durationInFrames,
                fps,
                maxTimeLabelWidth
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                style: xSpacer
              })
            ]
          }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
            style: flex1
          }),
          customControlsElement,
          customControlsElement && playbackRates && canvasSize ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
            style: xSpacer
          }) : null,
          playbackRates && canvasSize && /* @__PURE__ */ jsxRuntimeExports.jsx(PlaybackrateControl, {
            canvasSize,
            playbackRates
          }),
          playbackRates && supportsFullscreen && allowFullscreen ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
            style: xSpacer
          }) : null,
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
            style: fullscreen,
            children: supportsFullscreen && allowFullscreen ? /* @__PURE__ */ jsxRuntimeExports.jsx("button", {
              type: "button",
              "aria-label": isFullscreen ? "Exit fullscreen" : "Enter Fullscreen",
              title: isFullscreen ? "Exit fullscreen" : "Enter Fullscreen",
              style: playerButtonStyle,
              onClick: isFullscreen ? onExitFullscreenButtonClick : onFullscreenButtonClick,
              children: renderFullscreenButton === null ? /* @__PURE__ */ jsxRuntimeExports.jsx(FullscreenIcon, {
                isFullscreen
              }) : renderFullscreenButton({ isFullscreen })
            }) : null
          })
        ]
      }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
        style: ySpacer
      }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(PlayerSeekBar, {
        onSeekEnd,
        onSeekStart,
        durationInFrames,
        inFrame,
        outFrame
      })
    ]
  });
};
var IS_NODE = typeof document === "undefined";
var cancellablePromise = (promise) => {
  let isCanceled = false;
  const wrappedPromise = new Promise((resolve, reject) => {
    promise.then((value) => {
      if (isCanceled) {
        reject({ isCanceled, value });
        return;
      }
      resolve(value);
    }).catch((error2) => {
      reject({ isCanceled, error: error2 });
    });
  });
  return {
    promise: wrappedPromise,
    cancel: () => {
      isCanceled = true;
    }
  };
};
var delay = (n) => new Promise((resolve) => setTimeout(resolve, n));
var useCancellablePromises = () => {
  const pendingPromises = reactExports.useRef([]);
  const appendPendingPromise = reactExports.useCallback((promise) => {
    pendingPromises.current = [...pendingPromises.current, promise];
  }, []);
  const removePendingPromise = reactExports.useCallback((promise) => {
    pendingPromises.current = pendingPromises.current.filter((p) => p !== promise);
  }, []);
  const clearPendingPromises = reactExports.useCallback(() => pendingPromises.current.map((p) => p.cancel()), []);
  const api = reactExports.useMemo(() => ({
    appendPendingPromise,
    removePendingPromise,
    clearPendingPromises
  }), [appendPendingPromise, clearPendingPromises, removePendingPromise]);
  return api;
};
var useClickPreventionOnDoubleClick = (onClick, onDoubleClick, doubleClickToFullscreen) => {
  const api = useCancellablePromises();
  const handleClick = reactExports.useCallback(async (e) => {
    if (e instanceof PointerEvent ? e.pointerType === "touch" : e.nativeEvent.pointerType === "touch") {
      onClick(e);
      return;
    }
    api.clearPendingPromises();
    const waitForClick = cancellablePromise(delay(200));
    api.appendPendingPromise(waitForClick);
    try {
      await waitForClick.promise;
      api.removePendingPromise(waitForClick);
      onClick(e);
    } catch (errorInfo) {
      const info2 = errorInfo;
      api.removePendingPromise(waitForClick);
      if (!info2.isCanceled) {
        throw info2.error;
      }
    }
  }, [api, onClick]);
  const handlePointerDown = reactExports.useCallback(() => {
    document.addEventListener("pointerup", (newEvt) => {
      handleClick(newEvt);
    }, {
      once: true
    });
  }, [handleClick]);
  const handleDoubleClick = reactExports.useCallback(() => {
    api.clearPendingPromises();
    onDoubleClick();
  }, [api, onDoubleClick]);
  const returnValue = reactExports.useMemo(() => {
    if (!doubleClickToFullscreen) {
      return { handlePointerDown: onClick, handleDoubleClick: () => {
        return;
      } };
    }
    return { handlePointerDown, handleDoubleClick };
  }, [doubleClickToFullscreen, handleDoubleClick, handlePointerDown, onClick]);
  return returnValue;
};
var reactVersion = React.version.split(".")[0];
if (reactVersion === "0") {
  throw new Error(`Version ${reactVersion} of "react" is not supported by Remotion`);
}
var doesReactVersionSupportSuspense = parseInt(reactVersion, 10) >= 18;
var PlayerUI = ({
  controls,
  style: style2,
  loop,
  autoPlay,
  allowFullscreen,
  inputProps,
  clickToPlay,
  showVolumeControls,
  doubleClickToFullscreen,
  spaceKeyToPlayOrPause,
  errorFallback,
  playbackRate,
  renderLoading,
  renderPoster,
  className: className2,
  moveToBeginningWhenEnded,
  showPosterWhenUnplayed,
  showPosterWhenEnded,
  showPosterWhenPaused,
  showPosterWhenBuffering,
  showPosterWhenBufferingAndPaused,
  inFrame,
  outFrame,
  initiallyShowControls,
  renderFullscreen: renderFullscreenButton,
  renderPlayPauseButton,
  renderMuteButton,
  renderVolumeSlider,
  renderCustomControls,
  alwaysShowControls,
  showPlaybackRateControl,
  posterFillMode,
  bufferStateDelayInMilliseconds,
  hideControlsWhenPointerDoesntMove,
  overflowVisible,
  browserMediaControlsBehavior,
  overrideInternalClassName,
  noSuspense
}, ref) => {
  const config = Internals.useUnsafeVideoConfig();
  const video = Internals.useVideo();
  const container2 = reactExports.useRef(null);
  const canvasSize = useElementSize(container2, {
    triggerOnWindowResize: false,
    shouldApplyCssTransforms: false
  });
  const [hasPausedToResume, setHasPausedToResume] = reactExports.useState(false);
  const [shouldAutoplay, setShouldAutoPlay] = reactExports.useState(autoPlay);
  const [isFullscreen, setIsFullscreen] = reactExports.useState(() => false);
  const [seeking, setSeeking] = reactExports.useState(false);
  const supportsFullScreen = reactExports.useMemo(() => {
    if (typeof document === "undefined") {
      return false;
    }
    return Boolean(document.fullscreenEnabled || document.webkitFullscreenEnabled);
  }, []);
  const player = usePlayer();
  const playerToggle = player.toggle;
  const { mediaMuted, mediaVolume } = reactExports.useContext(Internals.MediaVolumeContext);
  reactExports.useEffect(() => {
    player.emitter.dispatchVolumeChange(mediaVolume);
  }, [player.emitter, mediaVolume]);
  const isMuted = mediaMuted || mediaVolume === 0;
  reactExports.useEffect(() => {
    player.emitter.dispatchMuteChange({
      isMuted
    });
  }, [player.emitter, isMuted]);
  usePlayback({
    loop,
    playbackRate,
    moveToBeginningWhenEnded,
    inFrame,
    outFrame,
    getCurrentFrame: player.getCurrentFrame,
    browserMediaControlsBehavior,
    muted: isMuted
  });
  reactExports.useEffect(() => {
    if (hasPausedToResume && !player.playing) {
      setHasPausedToResume(false);
      player.play();
    }
  }, [hasPausedToResume, player]);
  reactExports.useEffect(() => {
    const { current } = container2;
    if (!current) {
      return;
    }
    const onFullscreenChange = () => {
      const newValue = document.fullscreenElement === current || document.webkitFullscreenElement === current;
      setIsFullscreen(newValue);
    };
    document.addEventListener("fullscreenchange", onFullscreenChange);
    document.addEventListener("webkitfullscreenchange", onFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", onFullscreenChange);
      document.removeEventListener("webkitfullscreenchange", onFullscreenChange);
    };
  }, []);
  const toggle = reactExports.useCallback((e) => {
    playerToggle(e);
  }, [playerToggle]);
  const requestFullscreen = reactExports.useCallback(() => {
    if (!allowFullscreen) {
      throw new Error("allowFullscreen is false");
    }
    if (!supportsFullScreen) {
      throw new Error("Browser doesnt support fullscreen");
    }
    if (!container2.current) {
      throw new Error("No player ref found");
    }
    if (container2.current.webkitRequestFullScreen) {
      container2.current.webkitRequestFullScreen();
    } else {
      container2.current.requestFullscreen();
    }
  }, [allowFullscreen, supportsFullScreen]);
  const exitFullscreen = reactExports.useCallback(() => {
    if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else {
      document.exitFullscreen();
    }
  }, []);
  reactExports.useEffect(() => {
    const { current } = container2;
    if (!current) {
      return;
    }
    const fullscreenChange = () => {
      const element = document.webkitFullscreenElement ?? document.fullscreenElement;
      if (element && element === container2.current) {
        player.emitter.dispatchFullscreenChange({
          isFullscreen: true
        });
      } else {
        player.emitter.dispatchFullscreenChange({
          isFullscreen: false
        });
      }
    };
    current.addEventListener("webkitfullscreenchange", fullscreenChange);
    current.addEventListener("fullscreenchange", fullscreenChange);
    return () => {
      current.removeEventListener("webkitfullscreenchange", fullscreenChange);
      current.removeEventListener("fullscreenchange", fullscreenChange);
    };
  }, [player.emitter]);
  const durationInFrames = config?.durationInFrames ?? 1;
  const layout = reactExports.useMemo(() => {
    if (!config || !canvasSize) {
      return null;
    }
    return calculateCanvasTransformation({
      canvasSize,
      compositionHeight: config.height,
      compositionWidth: config.width,
      previewSize: "auto"
    });
  }, [canvasSize, config]);
  const scale = layout?.scale ?? 1;
  const initialScaleIgnored = reactExports.useRef(false);
  reactExports.useEffect(() => {
    if (!initialScaleIgnored.current) {
      initialScaleIgnored.current = true;
      return;
    }
    player.emitter.dispatchScaleChange(scale);
  }, [player.emitter, scale]);
  const { setMediaVolume, setMediaMuted } = reactExports.useContext(Internals.SetMediaVolumeContext);
  const [showBufferIndicator, setShowBufferState] = reactExports.useState(false);
  reactExports.useEffect(() => {
    let timeout = null;
    let stopped = false;
    const onBuffer = () => {
      stopped = false;
      requestAnimationFrame(() => {
        if (bufferStateDelayInMilliseconds === 0) {
          setShowBufferState(true);
        } else {
          timeout = setTimeout(() => {
            if (!stopped) {
              setShowBufferState(true);
            }
          }, bufferStateDelayInMilliseconds);
        }
      });
    };
    const onResume = () => {
      requestAnimationFrame(() => {
        stopped = true;
        setShowBufferState(false);
        if (timeout) {
          clearTimeout(timeout);
        }
      });
    };
    player.emitter.addEventListener("waiting", onBuffer);
    player.emitter.addEventListener("resume", onResume);
    return () => {
      player.emitter.removeEventListener("waiting", onBuffer);
      player.emitter.removeEventListener("resume", onResume);
      setShowBufferState(false);
      if (timeout) {
        clearTimeout(timeout);
      }
      stopped = true;
    };
  }, [bufferStateDelayInMilliseconds, player.emitter]);
  reactExports.useImperativeHandle(ref, () => {
    const methods = {
      play: player.play,
      pause: () => {
        setHasPausedToResume(false);
        player.pause();
      },
      toggle,
      getContainerNode: () => container2.current,
      getCurrentFrame: player.getCurrentFrame,
      isPlaying: player.isPlaying,
      seekTo: (f) => {
        const lastFrame = durationInFrames - 1;
        const frameToSeekTo = Math.max(0, Math.min(lastFrame, f));
        if (player.isPlaying()) {
          const pauseToResume = frameToSeekTo !== lastFrame || loop;
          setHasPausedToResume(pauseToResume);
          player.pause();
        }
        if (frameToSeekTo === lastFrame && !loop) {
          player.emitter.dispatchEnded();
        }
        player.seek(frameToSeekTo);
      },
      isFullscreen: () => {
        const { current } = container2;
        if (!current) {
          return false;
        }
        return document.fullscreenElement === current || document.webkitFullscreenElement === current;
      },
      requestFullscreen,
      exitFullscreen,
      getVolume: () => {
        if (mediaMuted) {
          return 0;
        }
        return mediaVolume;
      },
      setVolume: (vol) => {
        if (typeof vol !== "number") {
          throw new TypeError(`setVolume() takes a number, got value of type ${typeof vol}`);
        }
        if (isNaN(vol)) {
          throw new TypeError(`setVolume() got a number that is NaN. Volume must be between 0 and 1.`);
        }
        if (vol < 0 || vol > 1) {
          throw new TypeError(`setVolume() got a number that is out of range. Must be between 0 and 1, got ${vol}`);
        }
        setMediaVolume(vol);
      },
      isMuted: () => isMuted,
      mute: () => {
        setMediaMuted(true);
      },
      unmute: () => {
        setMediaMuted(false);
      },
      getScale: () => scale,
      pauseAndReturnToPlayStart: () => {
        player.pauseAndReturnToPlayStart();
      }
    };
    return Object.assign(player.emitter, methods);
  }, [
    durationInFrames,
    exitFullscreen,
    loop,
    mediaMuted,
    isMuted,
    mediaVolume,
    player,
    requestFullscreen,
    setMediaMuted,
    setMediaVolume,
    toggle,
    scale
  ]);
  const VideoComponent = video ? video.component : null;
  const outerStyle = reactExports.useMemo(() => {
    return calculateOuterStyle({
      canvasSize,
      config,
      style: style2,
      overflowVisible,
      layout
    });
  }, [canvasSize, config, layout, overflowVisible, style2]);
  const outer = reactExports.useMemo(() => {
    return calculateOuter({ config, layout, scale, overflowVisible });
  }, [config, layout, overflowVisible, scale]);
  const containerStyle3 = reactExports.useMemo(() => {
    return calculateContainerStyle({
      config,
      layout,
      scale,
      overflowVisible
    });
  }, [config, layout, overflowVisible, scale]);
  const playerPause = player.pause;
  const playerDispatchError = player.emitter.dispatchError;
  const onError = reactExports.useCallback((error2) => {
    playerPause();
    playerDispatchError(error2);
  }, [playerDispatchError, playerPause]);
  const onFullscreenButtonClick = reactExports.useCallback((e) => {
    e.stopPropagation();
    requestFullscreen();
  }, [requestFullscreen]);
  const onExitFullscreenButtonClick = reactExports.useCallback((e) => {
    e.stopPropagation();
    exitFullscreen();
  }, [exitFullscreen]);
  const onSingleClick = reactExports.useCallback((e) => {
    const rightClick = e instanceof MouseEvent ? e.button === 2 : e.nativeEvent.button;
    if (rightClick) {
      return;
    }
    toggle(e);
  }, [toggle]);
  const onSeekStart = reactExports.useCallback(() => {
    setSeeking(true);
  }, []);
  const onSeekEnd = reactExports.useCallback(() => {
    setSeeking(false);
  }, []);
  const onDoubleClick = reactExports.useCallback(() => {
    if (isFullscreen) {
      exitFullscreen();
    } else {
      requestFullscreen();
    }
  }, [exitFullscreen, isFullscreen, requestFullscreen]);
  const { handlePointerDown, handleDoubleClick } = useClickPreventionOnDoubleClick(onSingleClick, onDoubleClick, doubleClickToFullscreen && allowFullscreen && supportsFullScreen);
  reactExports.useEffect(() => {
    if (shouldAutoplay) {
      player.play();
      setShouldAutoPlay(false);
    }
  }, [shouldAutoplay, player]);
  const loadingMarkup = reactExports.useMemo(() => {
    return renderLoading ? renderLoading({
      height: outerStyle.height,
      width: outerStyle.width,
      isBuffering: showBufferIndicator
    }) : null;
  }, [outerStyle.height, outerStyle.width, renderLoading, showBufferIndicator]);
  const currentScale = reactExports.useMemo(() => {
    return {
      type: "scale",
      scale
    };
  }, [scale]);
  if (!config) {
    return null;
  }
  const poster = renderPoster ? renderPoster({
    height: posterFillMode === "player-size" ? outerStyle.height : config.height,
    width: posterFillMode === "player-size" ? outerStyle.width : config.width,
    isBuffering: showBufferIndicator
  }) : null;
  if (poster === void 0) {
    throw new TypeError("renderPoster() must return a React element, but undefined was returned");
  }
  const shouldShowPoster = poster && [
    showPosterWhenPaused && !player.isPlaying() && !seeking,
    showPosterWhenEnded && player.isLastFrame && !player.isPlaying(),
    showPosterWhenUnplayed && !player.hasPlayed && !player.isPlaying(),
    showPosterWhenBuffering && showBufferIndicator && player.isPlaying(),
    showPosterWhenBufferingAndPaused && showBufferIndicator && !player.isPlaying()
  ].some(Boolean);
  const { left, top, width, height, ...outerWithoutScale } = outer;
  const content = /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, {
    children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
        style: outer,
        onPointerDown: clickToPlay ? handlePointerDown : void 0,
        onDoubleClick: doubleClickToFullscreen ? handleDoubleClick : void 0,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
            style: containerStyle3,
            className: playerCssClassname(overrideInternalClassName),
            children: [
              VideoComponent ? /* @__PURE__ */ jsxRuntimeExports.jsx(ErrorBoundary, {
                onError,
                errorFallback,
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Internals.CurrentScaleContext.Provider, {
                  value: currentScale,
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(VideoComponent, {
                    ...video?.props ?? {},
                    ...inputProps ?? {}
                  })
                })
              }) : null,
              shouldShowPoster && posterFillMode === "composition-size" ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                style: {
                  ...outerWithoutScale,
                  width: config.width,
                  height: config.height
                },
                onPointerDown: clickToPlay ? handlePointerDown : void 0,
                onDoubleClick: doubleClickToFullscreen ? handleDoubleClick : void 0,
                children: poster
              }) : null
            ]
          }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(RenderWarningIfBlacklist, {})
        ]
      }),
      shouldShowPoster && posterFillMode === "player-size" ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
        style: outer,
        onPointerDown: clickToPlay ? handlePointerDown : void 0,
        onDoubleClick: doubleClickToFullscreen ? handleDoubleClick : void 0,
        children: poster
      }) : null,
      controls ? /* @__PURE__ */ jsxRuntimeExports.jsx(Controls, {
        fps: config.fps,
        playing: player.playing,
        toggle: player.toggle,
        durationInFrames: config.durationInFrames,
        containerRef: container2,
        onFullscreenButtonClick,
        isFullscreen,
        allowFullscreen,
        showVolumeControls,
        onExitFullscreenButtonClick,
        spaceKeyToPlayOrPause,
        onSeekEnd,
        onSeekStart,
        inFrame,
        outFrame,
        initiallyShowControls,
        canvasSize,
        renderFullscreenButton,
        renderPlayPauseButton,
        alwaysShowControls,
        showPlaybackRateControl,
        buffering: showBufferIndicator,
        hideControlsWhenPointerDoesntMove,
        onDoubleClick: doubleClickToFullscreen ? handleDoubleClick : void 0,
        onPointerDown: clickToPlay ? handlePointerDown : void 0,
        renderMuteButton,
        renderVolumeSlider,
        renderCustomControls
      }) : null
    ]
  });
  if (noSuspense || IS_NODE && !doesReactVersionSupportSuspense) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
      ref: container2,
      style: outerStyle,
      className: className2,
      children: content
    });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
    ref: container2,
    style: outerStyle,
    className: className2,
    children: /* @__PURE__ */ jsxRuntimeExports.jsx(reactExports.Suspense, {
      fallback: loadingMarkup,
      children: content
    })
  });
};
var PlayerUI_default = reactExports.forwardRef(PlayerUI);
var DEFAULT_VOLUME_PERSISTENCE_KEY = "remotion.volumePreference";
var persistVolume = (volume, logLevel, volumePersistenceKey) => {
  if (typeof window === "undefined") {
    return;
  }
  try {
    window.localStorage.setItem(volumePersistenceKey ?? DEFAULT_VOLUME_PERSISTENCE_KEY, String(volume));
  } catch (e) {
    Internals.Log.error({ logLevel, tag: null }, "Could not persist volume", e);
  }
};
var getPreferredVolume = (volumePersistenceKey) => {
  if (typeof window === "undefined") {
    return 1;
  }
  try {
    const val = window.localStorage.getItem(volumePersistenceKey ?? DEFAULT_VOLUME_PERSISTENCE_KEY);
    return val ? Number(val) : 1;
  } catch {
    return 1;
  }
};
var PLAYER_COMP_ID = "player-comp";
var SharedPlayerContexts = ({
  children,
  timelineContext,
  playbackRateContext,
  fps,
  compositionHeight,
  compositionWidth,
  durationInFrames,
  component,
  numberOfSharedAudioTags,
  initiallyMuted,
  logLevel,
  audioLatencyHint,
  volumePersistenceKey,
  initialVolume,
  inputProps,
  audioEnabled
}) => {
  const persistVolumeToStorage = initialVolume === void 0;
  const compositionManagerContext = reactExports.useMemo(() => {
    const context = {
      compositions: [
        {
          component,
          durationInFrames,
          height: compositionHeight,
          width: compositionWidth,
          fps,
          id: PLAYER_COMP_ID,
          nonce: [[0, 777]],
          folderName: null,
          parentFolderName: null,
          schema: null,
          calculateMetadata: null,
          stack: null
        }
      ],
      folders: [],
      currentCompositionMetadata: {
        defaultCodec: null,
        defaultOutName: null,
        defaultPixelFormat: null,
        defaultProResProfile: null,
        defaultSampleRate: null,
        defaultVideoImageFormat: null,
        durationInFrames,
        fps,
        height: compositionHeight,
        width: compositionWidth,
        props: inputProps
      },
      canvasContent: { type: "composition", compositionId: "player-comp" }
    };
    return context;
  }, [
    component,
    durationInFrames,
    compositionHeight,
    compositionWidth,
    fps,
    inputProps
  ]);
  const [mediaMuted, setMediaMuted] = reactExports.useState(() => initiallyMuted);
  const [mediaVolume, setMediaVolume] = reactExports.useState(() => persistVolumeToStorage ? getPreferredVolume(volumePersistenceKey ?? null) : initialVolume);
  const mediaVolumeContextValue = reactExports.useMemo(() => {
    return {
      mediaMuted,
      mediaVolume
    };
  }, [mediaMuted, mediaVolume]);
  const setMediaVolumeAndPersist = reactExports.useCallback((vol) => {
    setMediaVolume(vol);
    if (persistVolumeToStorage) {
      persistVolume(vol, logLevel, volumePersistenceKey ?? null);
    }
  }, [persistVolumeToStorage, logLevel, volumePersistenceKey]);
  const setMediaVolumeContextValue = reactExports.useMemo(() => {
    return {
      setMediaMuted,
      setMediaVolume: setMediaVolumeAndPersist
    };
  }, [setMediaVolumeAndPersist]);
  const logLevelContext = reactExports.useMemo(() => {
    return {
      logLevel,
      mountTime: Date.now()
    };
  }, [logLevel]);
  const env = reactExports.useMemo(() => {
    return {
      isPlayer: true,
      isRendering: false,
      isStudio: false,
      isClientSideRendering: false,
      isReadOnlyStudio: false
    };
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Internals.RemotionEnvironmentContext.Provider, {
    value: env,
    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Internals.LogLevelContext.Provider, {
      value: logLevelContext,
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Internals.CanUseRemotionHooksProvider, {
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Internals.AbsoluteTimeContext.Provider, {
          value: timelineContext,
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Internals.PlaybackRateContext.Provider, {
            value: playbackRateContext,
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Internals.TimelineContext.Provider, {
              value: timelineContext,
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Internals.CompositionManager.Provider, {
                value: compositionManagerContext,
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Internals.PrefetchProvider, {
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Internals.DurationsContextProvider, {
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Internals.MediaVolumeContext.Provider, {
                      value: mediaVolumeContextValue,
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Internals.SetMediaVolumeContext.Provider, {
                        value: setMediaVolumeContextValue,
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Internals.BufferingProvider, {
                          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Internals.SharedAudioContextProvider, {
                            audioLatencyHint,
                            audioEnabled,
                            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Internals.SharedAudioTagsContextProvider, {
                              numberOfAudioTags: numberOfSharedAudioTags,
                              children
                            })
                          })
                        })
                      })
                    })
                  })
                })
              })
            })
          })
        })
      })
    })
  });
};
var warningShown = false;
var acknowledgeRemotionLicenseMessage = (acknowledge, logLevel) => {
  if (acknowledge) {
    return;
  }
  if (warningShown) {
    return;
  }
  warningShown = true;
  Internals.Log.warn({ logLevel, tag: null }, "Note: Some companies are required to obtain a license to use Remotion. See: https://remotion.dev/license\nPass the `acknowledgeRemotionLicense` prop to `<Player />` function to make this message disappear.");
};
var validateSingleFrame = (frame, variableName) => {
  if (typeof frame === "undefined" || frame === null) {
    return frame ?? null;
  }
  if (typeof frame !== "number") {
    throw new TypeError(`"${variableName}" must be a number, but is ${JSON.stringify(frame)}`);
  }
  if (Number.isNaN(frame)) {
    throw new TypeError(`"${variableName}" must not be NaN, but is ${JSON.stringify(frame)}`);
  }
  if (!Number.isFinite(frame)) {
    throw new TypeError(`"${variableName}" must be finite, but is ${JSON.stringify(frame)}`);
  }
  if (frame % 1 !== 0) {
    throw new TypeError(`"${variableName}" must be an integer, but is ${JSON.stringify(frame)}`);
  }
  return frame;
};
var validateInOutFrames = ({
  inFrame,
  durationInFrames,
  outFrame
}) => {
  const validatedInFrame = validateSingleFrame(inFrame, "inFrame");
  const validatedOutFrame = validateSingleFrame(outFrame, "outFrame");
  if (validatedInFrame === null && validatedOutFrame === null) {
    return;
  }
  if (validatedInFrame !== null && validatedInFrame > durationInFrames - 1) {
    throw new Error("inFrame must be less than (durationInFrames - 1), but is " + validatedInFrame);
  }
  if (validatedOutFrame !== null && validatedOutFrame > durationInFrames - 1) {
    throw new Error("outFrame must be less than (durationInFrames - 1), but is " + validatedOutFrame);
  }
  if (validatedInFrame !== null && validatedInFrame < 0) {
    throw new Error("inFrame must be greater than 0, but is " + validatedInFrame);
  }
  if (validatedOutFrame !== null && validatedOutFrame <= 0) {
    throw new Error(`outFrame must be greater than 0, but is ${validatedOutFrame}. If you want to render a single frame, use <Thumbnail /> instead.`);
  }
  if (validatedOutFrame !== null && validatedInFrame !== null && validatedOutFrame <= validatedInFrame) {
    throw new Error("outFrame must be greater than inFrame, but is " + validatedOutFrame + " <= " + validatedInFrame);
  }
};
var validateInitialFrame = ({
  initialFrame,
  durationInFrames
}) => {
  if (typeof durationInFrames !== "number") {
    throw new Error(`\`durationInFrames\` must be a number, but is ${JSON.stringify(durationInFrames)}`);
  }
  if (typeof initialFrame === "undefined") {
    return;
  }
  if (typeof initialFrame !== "number") {
    throw new Error(`\`initialFrame\` must be a number, but is ${JSON.stringify(initialFrame)}`);
  }
  if (Number.isNaN(initialFrame)) {
    throw new Error(`\`initialFrame\` must be a number, but is NaN`);
  }
  if (!Number.isFinite(initialFrame)) {
    throw new Error(`\`initialFrame\` must be a number, but is Infinity`);
  }
  if (initialFrame % 1 !== 0) {
    throw new Error(`\`initialFrame\` must be an integer, but is ${JSON.stringify(initialFrame)}`);
  }
  if (initialFrame > durationInFrames - 1) {
    throw new Error(`\`initialFrame\` must be less or equal than \`durationInFrames - 1\`, but is ${JSON.stringify(initialFrame)}`);
  }
};
var validatePlaybackRate = (playbackRate) => {
  if (playbackRate === void 0) {
    return;
  }
  if (playbackRate > 10) {
    throw new Error(`The highest possible playback rate is 10. You passed: ${playbackRate}`);
  }
  if (playbackRate < -10) {
    throw new Error(`The lowest possible playback rate is -10. You passed: ${playbackRate}`);
  }
  if (playbackRate === 0) {
    throw new Error(`A playback rate of 0 is not supported.`);
  }
};
var validateFps = NoReactInternals.validateFps;
var validateDimension = NoReactInternals.validateDimension;
var validateDurationInFrames = NoReactInternals.validateDurationInFrames;
var validateDefaultAndInputProps = NoReactInternals.validateDefaultAndInputProps;
var componentOrNullIfLazy = (props) => {
  if ("component" in props) {
    return props.component;
  }
  return null;
};
var PlayerFn = ({
  durationInFrames,
  compositionHeight,
  compositionWidth,
  fps,
  inputProps,
  style: style2,
  controls = false,
  loop = false,
  autoPlay = false,
  showVolumeControls = true,
  allowFullscreen = true,
  clickToPlay,
  doubleClickToFullscreen = false,
  spaceKeyToPlayOrPause = true,
  moveToBeginningWhenEnded = true,
  numberOfSharedAudioTags = 5,
  errorFallback = () => "⚠️",
  playbackRate = 1,
  renderLoading,
  className: className2,
  showPosterWhenUnplayed,
  showPosterWhenEnded,
  showPosterWhenPaused,
  showPosterWhenBuffering,
  showPosterWhenBufferingAndPaused,
  initialFrame,
  renderPoster,
  inFrame,
  outFrame,
  initiallyShowControls,
  renderFullscreenButton,
  renderPlayPauseButton,
  renderVolumeSlider,
  renderCustomControls,
  alwaysShowControls = false,
  initiallyMuted = false,
  showPlaybackRateControl = false,
  posterFillMode = "player-size",
  bufferStateDelayInMilliseconds,
  hideControlsWhenPointerDoesntMove = true,
  overflowVisible = false,
  renderMuteButton,
  browserMediaControlsBehavior: passedBrowserMediaControlsBehavior,
  overrideInternalClassName,
  logLevel = "info",
  noSuspense,
  acknowledgeRemotionLicense,
  audioLatencyHint = "playback",
  volumePersistenceKey,
  initialVolume,
  ...componentProps
}, ref) => {
  if (typeof window !== "undefined") {
    window.remotion_isPlayer = true;
  }
  if (componentProps.defaultProps !== void 0) {
    throw new Error("The <Player /> component does not accept `defaultProps`, but some were passed. Use `inputProps` instead.");
  }
  const componentForValidation = componentOrNullIfLazy(componentProps);
  if (componentForValidation?.type === Composition) {
    throw new TypeError(`'component' should not be an instance of <Composition/>. Pass the React component directly, and set the duration, fps and dimensions as separate props. See https://www.remotion.dev/docs/player/examples for an example.`);
  }
  if (componentForValidation === Composition) {
    throw new TypeError(`'component' must not be the 'Composition' component. Pass your own React component directly, and set the duration, fps and dimensions as separate props. See https://www.remotion.dev/docs/player/examples for an example.`);
  }
  reactExports.useState(() => acknowledgeRemotionLicenseMessage(Boolean(acknowledgeRemotionLicense), logLevel));
  const component = Internals.useLazyComponent({
    compProps: componentProps,
    componentName: "Player",
    noSuspense: Boolean(noSuspense)
  });
  validateInitialFrame({ initialFrame, durationInFrames });
  const [frame, setFrame] = reactExports.useState(() => ({
    [PLAYER_COMP_ID]: initialFrame ?? 0
  }));
  const [playing, setPlaying] = reactExports.useState(false);
  const [rootId] = reactExports.useState("player-comp");
  const rootRef = reactExports.useRef(null);
  const audioAndVideoTags = reactExports.useRef([]);
  const imperativePlaying = reactExports.useRef(false);
  const [currentPlaybackRate, setCurrentPlaybackRate] = reactExports.useState(playbackRate);
  if (typeof compositionHeight !== "number") {
    throw new TypeError(`'compositionHeight' must be a number but got '${typeof compositionHeight}' instead`);
  }
  if (typeof compositionWidth !== "number") {
    throw new TypeError(`'compositionWidth' must be a number but got '${typeof compositionWidth}' instead`);
  }
  validateDimension(compositionHeight, "compositionHeight", "of the <Player /> component");
  validateDimension(compositionWidth, "compositionWidth", "of the <Player /> component");
  validateDurationInFrames(durationInFrames, {
    component: "of the <Player/> component",
    allowFloats: false
  });
  validateFps(fps, "as a prop of the <Player/> component", false);
  validateDefaultAndInputProps(inputProps, "inputProps", null);
  validateInOutFrames({
    durationInFrames,
    inFrame,
    outFrame
  });
  if (typeof controls !== "boolean" && typeof controls !== "undefined") {
    throw new TypeError(`'controls' must be a boolean or undefined but got '${typeof controls}' instead`);
  }
  if (typeof autoPlay !== "boolean" && typeof autoPlay !== "undefined") {
    throw new TypeError(`'autoPlay' must be a boolean or undefined but got '${typeof autoPlay}' instead`);
  }
  if (typeof loop !== "boolean" && typeof loop !== "undefined") {
    throw new TypeError(`'loop' must be a boolean or undefined but got '${typeof loop}' instead`);
  }
  if (typeof doubleClickToFullscreen !== "boolean" && typeof doubleClickToFullscreen !== "undefined") {
    throw new TypeError(`'doubleClickToFullscreen' must be a boolean or undefined but got '${typeof doubleClickToFullscreen}' instead`);
  }
  if (typeof showVolumeControls !== "boolean" && typeof showVolumeControls !== "undefined") {
    throw new TypeError(`'showVolumeControls' must be a boolean or undefined but got '${typeof showVolumeControls}' instead`);
  }
  if (typeof allowFullscreen !== "boolean" && typeof allowFullscreen !== "undefined") {
    throw new TypeError(`'allowFullscreen' must be a boolean or undefined but got '${typeof allowFullscreen}' instead`);
  }
  if (typeof clickToPlay !== "boolean" && typeof clickToPlay !== "undefined") {
    throw new TypeError(`'clickToPlay' must be a boolean or undefined but got '${typeof clickToPlay}' instead`);
  }
  if (typeof spaceKeyToPlayOrPause !== "boolean" && typeof spaceKeyToPlayOrPause !== "undefined") {
    throw new TypeError(`'spaceKeyToPlayOrPause' must be a boolean or undefined but got '${typeof spaceKeyToPlayOrPause}' instead`);
  }
  if (typeof initialVolume !== "undefined" && typeof initialVolume !== "number") {
    throw new TypeError(`'initialVolume' must be a number or undefined but got '${typeof initialVolume}' instead`);
  }
  if (typeof initialVolume === "number" && (!Number.isFinite(initialVolume) || Number.isNaN(initialVolume) || initialVolume < 0 || initialVolume > 1)) {
    throw new TypeError(`'initialVolume' must be between 0 and 1 but got '${initialVolume}' instead`);
  }
  if (typeof numberOfSharedAudioTags !== "number" || numberOfSharedAudioTags % 1 !== 0 || !Number.isFinite(numberOfSharedAudioTags) || Number.isNaN(numberOfSharedAudioTags) || numberOfSharedAudioTags < 0) {
    throw new TypeError(`'numberOfSharedAudioTags' must be an integer but got '${numberOfSharedAudioTags}' instead`);
  }
  validatePlaybackRate(currentPlaybackRate);
  reactExports.useEffect(() => {
    setCurrentPlaybackRate(playbackRate);
  }, [playbackRate]);
  reactExports.useImperativeHandle(ref, () => rootRef.current, []);
  reactExports.useState(() => {
    Internals.playbackLogging({
      logLevel,
      message: `[player] Mounting <Player>. User agent = ${typeof navigator === "undefined" ? "server" : navigator.userAgent}`,
      tag: "player",
      mountTime: Date.now()
    });
  });
  const timelineContextValue = reactExports.useMemo(() => {
    return {
      frame,
      playing,
      rootId,
      imperativePlaying,
      audioAndVideoTags
    };
  }, [frame, playing, rootId]);
  const playbackRateContextValue = reactExports.useMemo(() => {
    return {
      playbackRate: currentPlaybackRate,
      setPlaybackRate: setCurrentPlaybackRate
    };
  }, [currentPlaybackRate]);
  const setTimelineContextValue = reactExports.useMemo(() => {
    return {
      setFrame,
      setPlaying
    };
  }, [setFrame]);
  if (typeof window !== "undefined") {
    reactExports.useLayoutEffect(() => {
      Internals.CSSUtils.injectCSS(Internals.CSSUtils.makeDefaultPreviewCSS(`.${playerCssClassname(overrideInternalClassName)}`, "#fff"));
    }, [overrideInternalClassName]);
  }
  const actualInputProps = reactExports.useMemo(() => inputProps ?? {}, [inputProps]);
  const browserMediaControlsBehavior = reactExports.useMemo(() => {
    return passedBrowserMediaControlsBehavior ?? {
      mode: "prevent-media-session"
    };
  }, [passedBrowserMediaControlsBehavior]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Internals.IsPlayerContextProvider, {
    children: /* @__PURE__ */ jsxRuntimeExports.jsx(SharedPlayerContexts, {
      timelineContext: timelineContextValue,
      playbackRateContext: playbackRateContextValue,
      component,
      compositionHeight,
      compositionWidth,
      durationInFrames,
      fps,
      numberOfSharedAudioTags,
      initiallyMuted,
      logLevel,
      audioLatencyHint,
      volumePersistenceKey,
      initialVolume,
      inputProps: actualInputProps,
      audioEnabled: true,
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Internals.SetTimelineContext.Provider, {
        value: setTimelineContextValue,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(PlayerEmitterProvider, {
          currentPlaybackRate,
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(PlayerUI_default, {
            ref: rootRef,
            posterFillMode,
            renderLoading,
            autoPlay: Boolean(autoPlay),
            loop: Boolean(loop),
            controls: Boolean(controls),
            errorFallback,
            style: style2,
            inputProps: actualInputProps,
            allowFullscreen: Boolean(allowFullscreen),
            moveToBeginningWhenEnded: Boolean(moveToBeginningWhenEnded),
            clickToPlay: typeof clickToPlay === "boolean" ? clickToPlay : Boolean(controls),
            showVolumeControls: Boolean(showVolumeControls),
            doubleClickToFullscreen: Boolean(doubleClickToFullscreen),
            spaceKeyToPlayOrPause: Boolean(spaceKeyToPlayOrPause),
            playbackRate: currentPlaybackRate,
            className: className2 ?? void 0,
            showPosterWhenUnplayed: Boolean(showPosterWhenUnplayed),
            showPosterWhenEnded: Boolean(showPosterWhenEnded),
            showPosterWhenPaused: Boolean(showPosterWhenPaused),
            showPosterWhenBuffering: Boolean(showPosterWhenBuffering),
            showPosterWhenBufferingAndPaused: Boolean(showPosterWhenBufferingAndPaused),
            renderPoster,
            inFrame: inFrame ?? null,
            outFrame: outFrame ?? null,
            initiallyShowControls: initiallyShowControls ?? true,
            renderFullscreen: renderFullscreenButton ?? null,
            renderPlayPauseButton: renderPlayPauseButton ?? null,
            renderMuteButton: renderMuteButton ?? null,
            renderVolumeSlider: renderVolumeSlider ?? null,
            renderCustomControls: renderCustomControls ?? null,
            alwaysShowControls,
            showPlaybackRateControl,
            bufferStateDelayInMilliseconds: bufferStateDelayInMilliseconds ?? 300,
            hideControlsWhenPointerDoesntMove,
            overflowVisible,
            browserMediaControlsBehavior,
            overrideInternalClassName: overrideInternalClassName ?? void 0,
            noSuspense: Boolean(noSuspense)
          })
        })
      })
    })
  });
};
var forward = reactExports.forwardRef;
var Player = forward(PlayerFn);
var useThumbnail = () => {
  const emitter = reactExports.useContext(ThumbnailEmitterContext);
  if (!emitter) {
    throw new TypeError("Expected Player event emitter context");
  }
  const returnValue = reactExports.useMemo(() => {
    return {
      emitter
    };
  }, [emitter]);
  return returnValue;
};
var reactVersion2 = React.version.split(".")[0];
if (reactVersion2 === "0") {
  throw new Error(`Version ${reactVersion2} of "react" is not supported by Remotion`);
}
var doesReactVersionSupportSuspense2 = parseInt(reactVersion2, 10) >= 18;
var ThumbnailUI = ({
  style: style2,
  inputProps,
  errorFallback,
  renderLoading,
  className: className2,
  overflowVisible,
  noSuspense,
  overrideInternalClassName
}, ref) => {
  const config = Internals.useUnsafeVideoConfig();
  const video = Internals.useVideo();
  const container2 = reactExports.useRef(null);
  const canvasSize = useElementSize(container2, {
    triggerOnWindowResize: false,
    shouldApplyCssTransforms: false
  });
  const layout = reactExports.useMemo(() => {
    if (!config || !canvasSize) {
      return null;
    }
    return calculateCanvasTransformation({
      canvasSize,
      compositionHeight: config.height,
      compositionWidth: config.width,
      previewSize: "auto"
    });
  }, [canvasSize, config]);
  const scale = layout?.scale ?? 1;
  const thumbnail = useThumbnail();
  useBufferStateEmitter(thumbnail.emitter);
  reactExports.useImperativeHandle(ref, () => {
    const methods = {
      getContainerNode: () => container2.current,
      getScale: () => scale
    };
    return Object.assign(thumbnail.emitter, methods);
  }, [scale, thumbnail.emitter]);
  const VideoComponent = video ? video.component : null;
  const outerStyle = reactExports.useMemo(() => {
    return calculateOuterStyle({
      config,
      style: style2,
      canvasSize,
      overflowVisible,
      layout
    });
  }, [canvasSize, config, layout, overflowVisible, style2]);
  const outer = reactExports.useMemo(() => {
    return calculateOuter({ config, layout, scale, overflowVisible });
  }, [config, layout, overflowVisible, scale]);
  const containerStyle3 = reactExports.useMemo(() => {
    return calculateContainerStyle({
      config,
      layout,
      scale,
      overflowVisible
    });
  }, [config, layout, overflowVisible, scale]);
  const onError = reactExports.useCallback((error2) => {
    thumbnail.emitter.dispatchError(error2);
  }, [thumbnail.emitter]);
  const loadingMarkup = reactExports.useMemo(() => {
    return renderLoading ? renderLoading({
      height: outerStyle.height,
      width: outerStyle.width,
      isBuffering: false
    }) : null;
  }, [outerStyle.height, outerStyle.width, renderLoading]);
  const currentScaleContext = reactExports.useMemo(() => {
    return {
      type: "scale",
      scale
    };
  }, [scale]);
  if (!config) {
    return null;
  }
  const content = /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
    style: outer,
    children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
      style: containerStyle3,
      className: playerCssClassname(overrideInternalClassName),
      children: VideoComponent ? /* @__PURE__ */ jsxRuntimeExports.jsx(ErrorBoundary, {
        onError,
        errorFallback,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Internals.CurrentScaleContext.Provider, {
          value: currentScaleContext,
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(VideoComponent, {
            ...video?.props ?? {},
            ...inputProps ?? {}
          })
        })
      }) : null
    })
  });
  if (noSuspense || IS_NODE && !doesReactVersionSupportSuspense2) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
      ref: container2,
      style: outerStyle,
      className: className2,
      children: content
    });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
    ref: container2,
    style: outerStyle,
    className: className2,
    children: /* @__PURE__ */ jsxRuntimeExports.jsx(reactExports.Suspense, {
      fallback: loadingMarkup,
      children: content
    })
  });
};
var ThumbnailUI_default = reactExports.forwardRef(ThumbnailUI);
var ThumbnailFn = ({
  frameToDisplay,
  style: style2,
  inputProps,
  compositionHeight,
  compositionWidth,
  durationInFrames,
  fps,
  className: className2,
  errorFallback = () => "⚠️",
  renderLoading,
  overflowVisible = false,
  overrideInternalClassName,
  logLevel = "info",
  noSuspense,
  ...componentProps
}, ref) => {
  if (typeof window !== "undefined") {
    reactExports.useLayoutEffect(() => {
      window.remotion_isPlayer = true;
    }, []);
  }
  const [thumbnailId] = reactExports.useState(() => String(random(null)));
  const rootRef = reactExports.useRef(null);
  const timelineState = reactExports.useMemo(() => {
    const value = {
      playing: false,
      frame: {
        [PLAYER_COMP_ID]: frameToDisplay
      },
      rootId: thumbnailId,
      imperativePlaying: {
        current: false
      },
      audioAndVideoTags: { current: [] }
    };
    return value;
  }, [frameToDisplay, thumbnailId]);
  const playbackRateContext = reactExports.useMemo(() => {
    return {
      playbackRate: 1,
      setPlaybackRate: () => {
        throw new Error("thumbnail");
      }
    };
  }, []);
  reactExports.useImperativeHandle(ref, () => rootRef.current, []);
  const Component = Internals.useLazyComponent({
    compProps: componentProps,
    componentName: "Thumbnail",
    noSuspense: Boolean(noSuspense)
  });
  const [emitter] = reactExports.useState(() => new ThumbnailEmitter());
  const passedInputProps = reactExports.useMemo(() => {
    return inputProps ?? {};
  }, [inputProps]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Internals.IsPlayerContextProvider, {
    children: /* @__PURE__ */ jsxRuntimeExports.jsx(SharedPlayerContexts, {
      timelineContext: timelineState,
      playbackRateContext,
      component: Component,
      compositionHeight,
      compositionWidth,
      durationInFrames,
      fps,
      numberOfSharedAudioTags: 0,
      initiallyMuted: true,
      logLevel,
      audioLatencyHint: "playback",
      inputProps: passedInputProps,
      audioEnabled: false,
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(ThumbnailEmitterContext.Provider, {
        value: emitter,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(ThumbnailUI_default, {
          ref: rootRef,
          className: className2,
          errorFallback,
          inputProps: passedInputProps,
          renderLoading,
          style: style2,
          overflowVisible,
          overrideInternalClassName,
          noSuspense: Boolean(noSuspense)
        })
      })
    })
  });
};
var forward2 = reactExports.forwardRef;
forward2(ThumbnailFn);
export {
  AbsoluteFill as A,
  Easing as E,
  Player as P,
  Sequence as S,
  useVideoConfig as a,
  interpolate as i,
  spring as s,
  useCurrentFrame as u
};