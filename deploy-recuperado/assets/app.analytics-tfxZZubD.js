import { W as jsxRuntimeExports, V as React, R as getDefaultExportFromCjs, r as reactExports } from "./server-C0e4gypg.js";
import { O as buildExerciseCatalog, g as getStoredLocale, h as getWeekDayLabels, t as translateWorkoutName, z as getCategoryLabel, l as loadOnboarding, m as motion, j as getModalityLabel, k as getPhaseLabel, n as getVolumeBiasLabel, L as Link } from "./router-BDD3RgVy.js";
import { u as useTrainingState } from "./use-training-state-DNcnklus.js";
import { g as getCaloriesFromOnboarding } from "./calorie-calculator-Fx-go2Aq.js";
import { a as clsx, c as cn } from "./utils-Bz4m9VPB.js";
import { u as useCurrentFrame, a as useVideoConfig, i as interpolate, s as spring, A as AbsoluteFill, S as Sequence } from "./index-CcuZFuTS.js";
import { G as GradientBackground } from "./VideoPlayerModal-BQaBY8IB.js";
import { B as BrandOverlay } from "./BrandOverlay-B4-tEure.js";
import { A as AnimatedCounter } from "./AnimatedCounter-D13SVpt3.js";
import { A as AnimatedBar } from "./AnimatedBar-OjSZ2IxW.js";
import { S as ShareVideoButton } from "./ShareVideoButton-DuyJVam8.js";
import { F as Flame } from "./flame-B4I7h4kj.js";
import { g as getTicks, C as CartesianAxis, X as XAxis, Y as YAxis, R as ResponsiveContainer, A as AreaChart, a as Area } from "./AreaChart-C6qdhETv.js";
import { f as filterProps, p as polarToCartesian, i as isFunction, D as Dot, L as Layer, A as Animate, a as interpolateNumber, b as isEqual, c as LabelList, G as Global, g as getValueByDataKey, l as last, d as isNil, u as useChartWidth, e as useChartHeight, h as useOffset, j as isNumber, k as useArbitraryXAxis, m as useYAxisWithFiniteDomainOrRandom, w as warn, n as getCoordinatesOfGrid, o as getTicksOfAxis, q as findAllByType, E as ErrorBar, C as Curve, r as hasClipDot, s as uniqueId, t as getCateCoordinateOfLine, v as generateCategoricalChart, x as formatAxisMap, B as Bar, y as formatAxisMap$1, T as Tooltip } from "./generateCategoricalChart-BuWpYmVk.js";
import { b as Polygon, P as PolarAngleAxis, c as PolarRadiusAxis, R as RadialBarChart, a as RadialBar } from "./RadialBarChart-DF6-4tNH.js";
import { D as Dumbbell } from "./dumbbell-DL1Diyp6.js";
import { T as Trophy } from "./trophy-D4ROBLa0.js";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./openai-config-D_XaIbeQ.js";
import "./workout-history-D2efW0ov.js";
import "./firebase-CeVmTMBf.js";
function WeeklyRecapVideo({
  name = "Atleta",
  weekNumber = 3,
  totalSessions = 4,
  plannedSessions = 4,
  totalVolume = 12400,
  consistency = 85,
  phase = "Base",
  muscleGroups = [],
  goal = "Hipertrofia"
}) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const headerOpacity = interpolate(frame, [0, 25], [0, 1], { extrapolateRight: "clamp" });
  const headerY = interpolate(frame, [0, 25], [30, 0], { extrapolateRight: "clamp" });
  const consistencyScale = spring({ frame: frame - 20, fps, config: { damping: 12, stiffness: 100 } });
  const consistencyAngle = interpolate(frame, [20, 70], [0, consistency / 100 * 360], { extrapolateRight: "clamp" });
  const defaultMuscles = muscleGroups.length > 0 ? muscleGroups : [
    { label: "Peito", pct: 88, color: "#22d3ee" },
    { label: "Costas", pct: 75, color: "#fb923c" },
    { label: "Pernas", pct: 92, color: "#4ade80" },
    { label: "Ombros", pct: 65, color: "#a78bfa" }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AbsoluteFill, { style: { fontFamily: "sans-serif" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(GradientBackground, { variant: "analytics" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(BrandOverlay, { position: "top" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
      position: "absolute",
      top: 140,
      left: 48,
      right: 48,
      opacity: headerOpacity,
      transform: `translateY(${headerY}px)`
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: 13, color: "rgba(148,163,184,0.6)", letterSpacing: 4, textTransform: "uppercase" }, children: [
        "Recap Semanal · Semana ",
        weekNumber,
        "/12"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
        fontSize: 40,
        fontWeight: 900,
        letterSpacing: -1,
        marginTop: 6,
        background: "linear-gradient(90deg,#a78bfa,#22d3ee)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent"
      }, children: name }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
        marginTop: 10,
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        background: "rgba(167,139,250,0.12)",
        border: "1px solid rgba(167,139,250,0.3)",
        borderRadius: 999,
        padding: "6px 16px"
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 13, color: "#a78bfa", fontWeight: 700 }, children: phase }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 13, color: "rgba(148,163,184,0.5)" }, children: "·" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 13, color: "rgba(148,163,184,0.7)" }, children: goal })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Sequence, { from: 20, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { position: "absolute", top: 300, left: 0, right: 0, display: "flex", justifyContent: "center" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { transform: `scale(${consistencyScale})`, position: "relative", width: 160, height: 160 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: 160, height: 160, style: { position: "absolute", top: 0, left: 0, transform: "rotate(-90deg)" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: 80, cy: 80, r: 70, fill: "none", stroke: "rgba(255,255,255,0.06)", strokeWidth: 12 }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "circle",
          {
            cx: 80,
            cy: 80,
            r: 70,
            fill: "none",
            stroke: "url(#consistGrad)",
            strokeWidth: 12,
            strokeDasharray: `${consistencyAngle / 360 * (2 * Math.PI * 70)} ${2 * Math.PI * 70}`,
            strokeLinecap: "round"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("defs", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("linearGradient", { id: "consistGrad", x1: "0%", y1: "0%", x2: "100%", y2: "0%", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: "#a78bfa" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: "#22d3ee" })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatedCounter, { from: 0, to: consistency, startFrame: 0, endFrame: 50, suffix: "%", style: { fontSize: 38, fontWeight: 900, color: "#fff" } }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 11, color: "rgba(148,163,184,0.6)", letterSpacing: 2, textTransform: "uppercase" }, children: "consistência" })
      ] })
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Sequence, { from: 40, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { position: "absolute", top: 490, left: 48, right: 48, display: "flex", gap: 14 }, children: [
      { label: "Sessões", value: `${totalSessions}/${plannedSessions}`, color: "#4ade80" },
      { label: "Volume", value: `${(totalVolume / 1e3).toFixed(1)}t`, color: "#fb923c" }
    ].map((s, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
      flex: 1,
      background: "rgba(255,255,255,0.04)",
      border: `1px solid ${s.color}25`,
      borderRadius: 20,
      padding: "18px 16px",
      textAlign: "center"
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 11, color: "rgba(148,163,184,0.6)", letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }, children: s.label }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 32, fontWeight: 900, color: s.color }, children: s.value })
    ] }, i)) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Sequence, { from: 60, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { position: "absolute", top: 620, left: 48, right: 48 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 12, color: "rgba(148,163,184,0.5)", letterSpacing: 3, textTransform: "uppercase", marginBottom: 16 }, children: "Equilíbrio muscular" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", flexDirection: "column", gap: 14 }, children: defaultMuscles.map((m, i) => {
        const labelOpacity = interpolate(frame, [i * 10, i * 10 + 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { opacity: labelOpacity }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", justifyContent: "space-between", marginBottom: 6 }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 14, fontWeight: 600, color: "#e2e8f0" }, children: m.label }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { fontSize: 13, fontWeight: 700, color: m.color }, children: [
              m.pct,
              "%"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatedBar, { pct: m.pct, startFrame: i * 10, color: m.color, height: 7 })
        ] }, i);
      }) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(BrandOverlay, { position: "bottom" })
  ] });
}
var _excluded$3 = ["cx", "cy", "innerRadius", "outerRadius", "gridType", "radialLines"];
function _typeof$3(o) {
  "@babel/helpers - typeof";
  return _typeof$3 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o2) {
    return typeof o2;
  } : function(o2) {
    return o2 && "function" == typeof Symbol && o2.constructor === Symbol && o2 !== Symbol.prototype ? "symbol" : typeof o2;
  }, _typeof$3(o);
}
function _objectWithoutProperties$3(source, excluded) {
  if (source == null) return {};
  var target = _objectWithoutPropertiesLoose$3(source, excluded);
  var key, i;
  if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
    for (i = 0; i < sourceSymbolKeys.length; i++) {
      key = sourceSymbolKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
      target[key] = source[key];
    }
  }
  return target;
}
function _objectWithoutPropertiesLoose$3(source, excluded) {
  if (source == null) return {};
  var target = {};
  for (var key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      if (excluded.indexOf(key) >= 0) continue;
      target[key] = source[key];
    }
  }
  return target;
}
function _extends$3() {
  _extends$3 = Object.assign ? Object.assign.bind() : function(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends$3.apply(this, arguments);
}
function ownKeys$3(e, r) {
  var t = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(e);
    r && (o = o.filter(function(r2) {
      return Object.getOwnPropertyDescriptor(e, r2).enumerable;
    })), t.push.apply(t, o);
  }
  return t;
}
function _objectSpread$3(e) {
  for (var r = 1; r < arguments.length; r++) {
    var t = null != arguments[r] ? arguments[r] : {};
    r % 2 ? ownKeys$3(Object(t), true).forEach(function(r2) {
      _defineProperty$3(e, r2, t[r2]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys$3(Object(t)).forEach(function(r2) {
      Object.defineProperty(e, r2, Object.getOwnPropertyDescriptor(t, r2));
    });
  }
  return e;
}
function _defineProperty$3(obj, key, value) {
  key = _toPropertyKey$3(key);
  if (key in obj) {
    Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
  } else {
    obj[key] = value;
  }
  return obj;
}
function _toPropertyKey$3(t) {
  var i = _toPrimitive$3(t, "string");
  return "symbol" == _typeof$3(i) ? i : i + "";
}
function _toPrimitive$3(t, r) {
  if ("object" != _typeof$3(t) || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r);
    if ("object" != _typeof$3(i)) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
var getPolygonPath = function getPolygonPath2(radius, cx, cy, polarAngles) {
  var path = "";
  polarAngles.forEach(function(angle, i) {
    var point = polarToCartesian(cx, cy, radius, angle);
    if (i) {
      path += "L ".concat(point.x, ",").concat(point.y);
    } else {
      path += "M ".concat(point.x, ",").concat(point.y);
    }
  });
  path += "Z";
  return path;
};
var PolarAngles = function PolarAngles2(props) {
  var cx = props.cx, cy = props.cy, innerRadius = props.innerRadius, outerRadius = props.outerRadius, polarAngles = props.polarAngles, radialLines = props.radialLines;
  if (!polarAngles || !polarAngles.length || !radialLines) {
    return null;
  }
  var polarAnglesProps = _objectSpread$3({
    stroke: "#ccc"
  }, filterProps(props, false));
  return /* @__PURE__ */ React.createElement("g", {
    className: "recharts-polar-grid-angle"
  }, polarAngles.map(function(entry) {
    var start = polarToCartesian(cx, cy, innerRadius, entry);
    var end = polarToCartesian(cx, cy, outerRadius, entry);
    return /* @__PURE__ */ React.createElement("line", _extends$3({}, polarAnglesProps, {
      key: "line-".concat(entry),
      x1: start.x,
      y1: start.y,
      x2: end.x,
      y2: end.y
    }));
  }));
};
var ConcentricCircle = function ConcentricCircle2(props) {
  var cx = props.cx, cy = props.cy, radius = props.radius, index = props.index;
  var concentricCircleProps = _objectSpread$3(_objectSpread$3({
    stroke: "#ccc"
  }, filterProps(props, false)), {}, {
    fill: "none"
  });
  return /* @__PURE__ */ React.createElement("circle", _extends$3({}, concentricCircleProps, {
    className: clsx("recharts-polar-grid-concentric-circle", props.className),
    key: "circle-".concat(index),
    cx,
    cy,
    r: radius
  }));
};
var ConcentricPolygon = function ConcentricPolygon2(props) {
  var radius = props.radius, index = props.index;
  var concentricPolygonProps = _objectSpread$3(_objectSpread$3({
    stroke: "#ccc"
  }, filterProps(props, false)), {}, {
    fill: "none"
  });
  return /* @__PURE__ */ React.createElement("path", _extends$3({}, concentricPolygonProps, {
    className: clsx("recharts-polar-grid-concentric-polygon", props.className),
    key: "path-".concat(index),
    d: getPolygonPath(radius, props.cx, props.cy, props.polarAngles)
  }));
};
var ConcentricPath = function ConcentricPath2(props) {
  var polarRadius = props.polarRadius, gridType = props.gridType;
  if (!polarRadius || !polarRadius.length) {
    return null;
  }
  return /* @__PURE__ */ React.createElement("g", {
    className: "recharts-polar-grid-concentric"
  }, polarRadius.map(function(entry, i) {
    var key = i;
    if (gridType === "circle") return /* @__PURE__ */ React.createElement(ConcentricCircle, _extends$3({
      key
    }, props, {
      radius: entry,
      index: i
    }));
    return /* @__PURE__ */ React.createElement(ConcentricPolygon, _extends$3({
      key
    }, props, {
      radius: entry,
      index: i
    }));
  }));
};
var PolarGrid = function PolarGrid2(_ref) {
  var _ref$cx = _ref.cx, cx = _ref$cx === void 0 ? 0 : _ref$cx, _ref$cy = _ref.cy, cy = _ref$cy === void 0 ? 0 : _ref$cy, _ref$innerRadius = _ref.innerRadius, innerRadius = _ref$innerRadius === void 0 ? 0 : _ref$innerRadius, _ref$outerRadius = _ref.outerRadius, outerRadius = _ref$outerRadius === void 0 ? 0 : _ref$outerRadius, _ref$gridType = _ref.gridType, gridType = _ref$gridType === void 0 ? "polygon" : _ref$gridType, _ref$radialLines = _ref.radialLines, radialLines = _ref$radialLines === void 0 ? true : _ref$radialLines, props = _objectWithoutProperties$3(_ref, _excluded$3);
  if (outerRadius <= 0) {
    return null;
  }
  return /* @__PURE__ */ React.createElement("g", {
    className: "recharts-polar-grid"
  }, /* @__PURE__ */ React.createElement(PolarAngles, _extends$3({
    cx,
    cy,
    innerRadius,
    outerRadius,
    gridType,
    radialLines
  }, props)), /* @__PURE__ */ React.createElement(ConcentricPath, _extends$3({
    cx,
    cy,
    innerRadius,
    outerRadius,
    gridType,
    radialLines
  }, props)));
};
PolarGrid.displayName = "PolarGrid";
var head_1;
var hasRequiredHead;
function requireHead() {
  if (hasRequiredHead) return head_1;
  hasRequiredHead = 1;
  function head(array) {
    return array && array.length ? array[0] : void 0;
  }
  head_1 = head;
  return head_1;
}
var first$1;
var hasRequiredFirst;
function requireFirst() {
  if (hasRequiredFirst) return first$1;
  hasRequiredFirst = 1;
  first$1 = requireHead();
  return first$1;
}
var firstExports = requireFirst();
const first = /* @__PURE__ */ getDefaultExportFromCjs(firstExports);
var _excluded$2 = ["key"];
function _typeof$2(o) {
  "@babel/helpers - typeof";
  return _typeof$2 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o2) {
    return typeof o2;
  } : function(o2) {
    return o2 && "function" == typeof Symbol && o2.constructor === Symbol && o2 !== Symbol.prototype ? "symbol" : typeof o2;
  }, _typeof$2(o);
}
function _objectWithoutProperties$2(source, excluded) {
  if (source == null) return {};
  var target = _objectWithoutPropertiesLoose$2(source, excluded);
  var key, i;
  if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
    for (i = 0; i < sourceSymbolKeys.length; i++) {
      key = sourceSymbolKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
      target[key] = source[key];
    }
  }
  return target;
}
function _objectWithoutPropertiesLoose$2(source, excluded) {
  if (source == null) return {};
  var target = {};
  for (var key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      if (excluded.indexOf(key) >= 0) continue;
      target[key] = source[key];
    }
  }
  return target;
}
function _extends$2() {
  _extends$2 = Object.assign ? Object.assign.bind() : function(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends$2.apply(this, arguments);
}
function ownKeys$2(e, r) {
  var t = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(e);
    r && (o = o.filter(function(r2) {
      return Object.getOwnPropertyDescriptor(e, r2).enumerable;
    })), t.push.apply(t, o);
  }
  return t;
}
function _objectSpread$2(e) {
  for (var r = 1; r < arguments.length; r++) {
    var t = null != arguments[r] ? arguments[r] : {};
    r % 2 ? ownKeys$2(Object(t), true).forEach(function(r2) {
      _defineProperty$2(e, r2, t[r2]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys$2(Object(t)).forEach(function(r2) {
      Object.defineProperty(e, r2, Object.getOwnPropertyDescriptor(t, r2));
    });
  }
  return e;
}
function _classCallCheck$1(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties$1(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, _toPropertyKey$2(descriptor.key), descriptor);
  }
}
function _createClass$1(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties$1(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties$1(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", { writable: false });
  return Constructor;
}
function _callSuper$1(t, o, e) {
  return o = _getPrototypeOf$1(o), _possibleConstructorReturn$1(t, _isNativeReflectConstruct$1() ? Reflect.construct(o, e || [], _getPrototypeOf$1(t).constructor) : o.apply(t, e));
}
function _possibleConstructorReturn$1(self, call) {
  if (call && (_typeof$2(call) === "object" || typeof call === "function")) {
    return call;
  } else if (call !== void 0) {
    throw new TypeError("Derived constructors may only return object or undefined");
  }
  return _assertThisInitialized$1(self);
}
function _assertThisInitialized$1(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }
  return self;
}
function _isNativeReflectConstruct$1() {
  try {
    var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
    }));
  } catch (t2) {
  }
  return (_isNativeReflectConstruct$1 = function _isNativeReflectConstruct2() {
    return !!t;
  })();
}
function _getPrototypeOf$1(o) {
  _getPrototypeOf$1 = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf2(o2) {
    return o2.__proto__ || Object.getPrototypeOf(o2);
  };
  return _getPrototypeOf$1(o);
}
function _inherits$1(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } });
  Object.defineProperty(subClass, "prototype", { writable: false });
  if (superClass) _setPrototypeOf$1(subClass, superClass);
}
function _setPrototypeOf$1(o, p) {
  _setPrototypeOf$1 = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf2(o2, p2) {
    o2.__proto__ = p2;
    return o2;
  };
  return _setPrototypeOf$1(o, p);
}
function _defineProperty$2(obj, key, value) {
  key = _toPropertyKey$2(key);
  if (key in obj) {
    Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
  } else {
    obj[key] = value;
  }
  return obj;
}
function _toPropertyKey$2(t) {
  var i = _toPrimitive$2(t, "string");
  return "symbol" == _typeof$2(i) ? i : i + "";
}
function _toPrimitive$2(t, r) {
  if ("object" != _typeof$2(t) || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r);
    if ("object" != _typeof$2(i)) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return String(t);
}
var Radar = /* @__PURE__ */ (function(_PureComponent) {
  function Radar2() {
    var _this;
    _classCallCheck$1(this, Radar2);
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = _callSuper$1(this, Radar2, [].concat(args));
    _defineProperty$2(_this, "state", {
      isAnimationFinished: false
    });
    _defineProperty$2(_this, "handleAnimationEnd", function() {
      var onAnimationEnd = _this.props.onAnimationEnd;
      _this.setState({
        isAnimationFinished: true
      });
      if (isFunction(onAnimationEnd)) {
        onAnimationEnd();
      }
    });
    _defineProperty$2(_this, "handleAnimationStart", function() {
      var onAnimationStart = _this.props.onAnimationStart;
      _this.setState({
        isAnimationFinished: false
      });
      if (isFunction(onAnimationStart)) {
        onAnimationStart();
      }
    });
    _defineProperty$2(_this, "handleMouseEnter", function(e) {
      var onMouseEnter = _this.props.onMouseEnter;
      if (onMouseEnter) {
        onMouseEnter(_this.props, e);
      }
    });
    _defineProperty$2(_this, "handleMouseLeave", function(e) {
      var onMouseLeave = _this.props.onMouseLeave;
      if (onMouseLeave) {
        onMouseLeave(_this.props, e);
      }
    });
    return _this;
  }
  _inherits$1(Radar2, _PureComponent);
  return _createClass$1(Radar2, [{
    key: "renderDots",
    value: function renderDots(points) {
      var _this$props = this.props, dot = _this$props.dot, dataKey = _this$props.dataKey;
      var baseProps = filterProps(this.props, false);
      var customDotProps = filterProps(dot, true);
      var dots = points.map(function(entry, i) {
        var dotProps = _objectSpread$2(_objectSpread$2(_objectSpread$2({
          key: "dot-".concat(i),
          r: 3
        }, baseProps), customDotProps), {}, {
          dataKey,
          cx: entry.x,
          cy: entry.y,
          index: i,
          payload: entry
        });
        return Radar2.renderDotItem(dot, dotProps);
      });
      return /* @__PURE__ */ React.createElement(Layer, {
        className: "recharts-radar-dots"
      }, dots);
    }
  }, {
    key: "renderPolygonStatically",
    value: function renderPolygonStatically(points) {
      var _this$props2 = this.props, shape = _this$props2.shape, dot = _this$props2.dot, isRange = _this$props2.isRange, baseLinePoints = _this$props2.baseLinePoints, connectNulls = _this$props2.connectNulls;
      var radar;
      if (/* @__PURE__ */ React.isValidElement(shape)) {
        radar = /* @__PURE__ */ React.cloneElement(shape, _objectSpread$2(_objectSpread$2({}, this.props), {}, {
          points
        }));
      } else if (isFunction(shape)) {
        radar = shape(_objectSpread$2(_objectSpread$2({}, this.props), {}, {
          points
        }));
      } else {
        radar = /* @__PURE__ */ React.createElement(Polygon, _extends$2({}, filterProps(this.props, true), {
          onMouseEnter: this.handleMouseEnter,
          onMouseLeave: this.handleMouseLeave,
          points,
          baseLinePoints: isRange ? baseLinePoints : null,
          connectNulls
        }));
      }
      return /* @__PURE__ */ React.createElement(Layer, {
        className: "recharts-radar-polygon"
      }, radar, dot ? this.renderDots(points) : null);
    }
  }, {
    key: "renderPolygonWithAnimation",
    value: function renderPolygonWithAnimation() {
      var _this2 = this;
      var _this$props3 = this.props, points = _this$props3.points, isAnimationActive = _this$props3.isAnimationActive, animationBegin = _this$props3.animationBegin, animationDuration = _this$props3.animationDuration, animationEasing = _this$props3.animationEasing, animationId = _this$props3.animationId;
      var prevPoints = this.state.prevPoints;
      return /* @__PURE__ */ React.createElement(Animate, {
        begin: animationBegin,
        duration: animationDuration,
        isActive: isAnimationActive,
        easing: animationEasing,
        from: {
          t: 0
        },
        to: {
          t: 1
        },
        key: "radar-".concat(animationId),
        onAnimationEnd: this.handleAnimationEnd,
        onAnimationStart: this.handleAnimationStart
      }, function(_ref) {
        var t = _ref.t;
        var prevPointsDiffFactor = prevPoints && prevPoints.length / points.length;
        var stepData = points.map(function(entry, index) {
          var prev = prevPoints && prevPoints[Math.floor(index * prevPointsDiffFactor)];
          if (prev) {
            var _interpolatorX = interpolateNumber(prev.x, entry.x);
            var _interpolatorY = interpolateNumber(prev.y, entry.y);
            return _objectSpread$2(_objectSpread$2({}, entry), {}, {
              x: _interpolatorX(t),
              y: _interpolatorY(t)
            });
          }
          var interpolatorX = interpolateNumber(entry.cx, entry.x);
          var interpolatorY = interpolateNumber(entry.cy, entry.y);
          return _objectSpread$2(_objectSpread$2({}, entry), {}, {
            x: interpolatorX(t),
            y: interpolatorY(t)
          });
        });
        return _this2.renderPolygonStatically(stepData);
      });
    }
  }, {
    key: "renderPolygon",
    value: function renderPolygon() {
      var _this$props4 = this.props, points = _this$props4.points, isAnimationActive = _this$props4.isAnimationActive, isRange = _this$props4.isRange;
      var prevPoints = this.state.prevPoints;
      if (isAnimationActive && points && points.length && !isRange && (!prevPoints || !isEqual(prevPoints, points))) {
        return this.renderPolygonWithAnimation();
      }
      return this.renderPolygonStatically(points);
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props5 = this.props, hide = _this$props5.hide, className = _this$props5.className, points = _this$props5.points, isAnimationActive = _this$props5.isAnimationActive;
      if (hide || !points || !points.length) {
        return null;
      }
      var isAnimationFinished = this.state.isAnimationFinished;
      var layerClass = clsx("recharts-radar", className);
      return /* @__PURE__ */ React.createElement(Layer, {
        className: layerClass
      }, this.renderPolygon(), (!isAnimationActive || isAnimationFinished) && LabelList.renderCallByParent(this.props, points));
    }
  }], [{
    key: "getDerivedStateFromProps",
    value: function getDerivedStateFromProps(nextProps, prevState) {
      if (nextProps.animationId !== prevState.prevAnimationId) {
        return {
          prevAnimationId: nextProps.animationId,
          curPoints: nextProps.points,
          prevPoints: prevState.curPoints
        };
      }
      if (nextProps.points !== prevState.curPoints) {
        return {
          curPoints: nextProps.points
        };
      }
      return null;
    }
  }, {
    key: "renderDotItem",
    value: function renderDotItem(option, props) {
      var dotItem;
      if (/* @__PURE__ */ React.isValidElement(option)) {
        dotItem = /* @__PURE__ */ React.cloneElement(option, props);
      } else if (isFunction(option)) {
        dotItem = option(props);
      } else {
        var key = props.key, dotProps = _objectWithoutProperties$2(props, _excluded$2);
        dotItem = /* @__PURE__ */ React.createElement(Dot, _extends$2({}, dotProps, {
          key,
          className: clsx("recharts-radar-dot", typeof option !== "boolean" ? option.className : "")
        }));
      }
      return dotItem;
    }
  }]);
})(reactExports.PureComponent);
_defineProperty$2(Radar, "displayName", "Radar");
_defineProperty$2(Radar, "defaultProps", {
  angleAxisId: 0,
  radiusAxisId: 0,
  hide: false,
  activeDot: true,
  dot: false,
  legendType: "rect",
  isAnimationActive: !Global.isSsr,
  animationBegin: 0,
  animationDuration: 1500,
  animationEasing: "ease"
});
_defineProperty$2(Radar, "getComposedData", function(_ref2) {
  var radiusAxis = _ref2.radiusAxis, angleAxis = _ref2.angleAxis, displayedData = _ref2.displayedData, dataKey = _ref2.dataKey, bandSize = _ref2.bandSize;
  var cx = angleAxis.cx, cy = angleAxis.cy;
  var isRange = false;
  var points = [];
  var angleBandSize = angleAxis.type !== "number" ? bandSize !== null && bandSize !== void 0 ? bandSize : 0 : 0;
  displayedData.forEach(function(entry, i) {
    var name = getValueByDataKey(entry, angleAxis.dataKey, i);
    var value = getValueByDataKey(entry, dataKey);
    var angle = angleAxis.scale(name) + angleBandSize;
    var pointValue = Array.isArray(value) ? last(value) : value;
    var radius = isNil(pointValue) ? void 0 : radiusAxis.scale(pointValue);
    if (Array.isArray(value) && value.length >= 2) {
      isRange = true;
    }
    points.push(_objectSpread$2(_objectSpread$2({}, polarToCartesian(cx, cy, radius, angle)), {}, {
      name,
      value,
      cx,
      cy,
      radius,
      angle,
      payload: entry
    }));
  });
  var baseLinePoints = [];
  if (isRange) {
    points.forEach(function(point) {
      if (Array.isArray(point.value)) {
        var baseValue = first(point.value);
        var radius = isNil(baseValue) ? void 0 : radiusAxis.scale(baseValue);
        baseLinePoints.push(_objectSpread$2(_objectSpread$2({}, point), {}, {
          radius
        }, polarToCartesian(cx, cy, radius, point.angle)));
      } else {
        baseLinePoints.push(point);
      }
    });
  }
  return {
    points,
    isRange,
    baseLinePoints
  };
});
var _excluded$1 = ["x1", "y1", "x2", "y2", "key"], _excluded2$1 = ["offset"];
function _typeof$1(o) {
  "@babel/helpers - typeof";
  return _typeof$1 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o2) {
    return typeof o2;
  } : function(o2) {
    return o2 && "function" == typeof Symbol && o2.constructor === Symbol && o2 !== Symbol.prototype ? "symbol" : typeof o2;
  }, _typeof$1(o);
}
function ownKeys$1(e, r) {
  var t = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(e);
    r && (o = o.filter(function(r2) {
      return Object.getOwnPropertyDescriptor(e, r2).enumerable;
    })), t.push.apply(t, o);
  }
  return t;
}
function _objectSpread$1(e) {
  for (var r = 1; r < arguments.length; r++) {
    var t = null != arguments[r] ? arguments[r] : {};
    r % 2 ? ownKeys$1(Object(t), true).forEach(function(r2) {
      _defineProperty$1(e, r2, t[r2]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys$1(Object(t)).forEach(function(r2) {
      Object.defineProperty(e, r2, Object.getOwnPropertyDescriptor(t, r2));
    });
  }
  return e;
}
function _defineProperty$1(obj, key, value) {
  key = _toPropertyKey$1(key);
  if (key in obj) {
    Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
  } else {
    obj[key] = value;
  }
  return obj;
}
function _toPropertyKey$1(t) {
  var i = _toPrimitive$1(t, "string");
  return "symbol" == _typeof$1(i) ? i : i + "";
}
function _toPrimitive$1(t, r) {
  if ("object" != _typeof$1(t) || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r);
    if ("object" != _typeof$1(i)) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
function _extends$1() {
  _extends$1 = Object.assign ? Object.assign.bind() : function(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends$1.apply(this, arguments);
}
function _objectWithoutProperties$1(source, excluded) {
  if (source == null) return {};
  var target = _objectWithoutPropertiesLoose$1(source, excluded);
  var key, i;
  if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
    for (i = 0; i < sourceSymbolKeys.length; i++) {
      key = sourceSymbolKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
      target[key] = source[key];
    }
  }
  return target;
}
function _objectWithoutPropertiesLoose$1(source, excluded) {
  if (source == null) return {};
  var target = {};
  for (var key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      if (excluded.indexOf(key) >= 0) continue;
      target[key] = source[key];
    }
  }
  return target;
}
var Background = function Background2(props) {
  var fill = props.fill;
  if (!fill || fill === "none") {
    return null;
  }
  var fillOpacity = props.fillOpacity, x = props.x, y = props.y, width = props.width, height = props.height, ry = props.ry;
  return /* @__PURE__ */ React.createElement("rect", {
    x,
    y,
    ry,
    width,
    height,
    stroke: "none",
    fill,
    fillOpacity,
    className: "recharts-cartesian-grid-bg"
  });
};
function renderLineItem(option, props) {
  var lineItem;
  if (/* @__PURE__ */ React.isValidElement(option)) {
    lineItem = /* @__PURE__ */ React.cloneElement(option, props);
  } else if (isFunction(option)) {
    lineItem = option(props);
  } else {
    var x1 = props.x1, y1 = props.y1, x2 = props.x2, y2 = props.y2, key = props.key, others = _objectWithoutProperties$1(props, _excluded$1);
    var _filterProps = filterProps(others, false);
    _filterProps.offset;
    var restOfFilteredProps = _objectWithoutProperties$1(_filterProps, _excluded2$1);
    lineItem = /* @__PURE__ */ React.createElement("line", _extends$1({}, restOfFilteredProps, {
      x1,
      y1,
      x2,
      y2,
      fill: "none",
      key
    }));
  }
  return lineItem;
}
function HorizontalGridLines(props) {
  var x = props.x, width = props.width, _props$horizontal = props.horizontal, horizontal = _props$horizontal === void 0 ? true : _props$horizontal, horizontalPoints = props.horizontalPoints;
  if (!horizontal || !horizontalPoints || !horizontalPoints.length) {
    return null;
  }
  var items = horizontalPoints.map(function(entry, i) {
    var lineItemProps = _objectSpread$1(_objectSpread$1({}, props), {}, {
      x1: x,
      y1: entry,
      x2: x + width,
      y2: entry,
      key: "line-".concat(i),
      index: i
    });
    return renderLineItem(horizontal, lineItemProps);
  });
  return /* @__PURE__ */ React.createElement("g", {
    className: "recharts-cartesian-grid-horizontal"
  }, items);
}
function VerticalGridLines(props) {
  var y = props.y, height = props.height, _props$vertical = props.vertical, vertical = _props$vertical === void 0 ? true : _props$vertical, verticalPoints = props.verticalPoints;
  if (!vertical || !verticalPoints || !verticalPoints.length) {
    return null;
  }
  var items = verticalPoints.map(function(entry, i) {
    var lineItemProps = _objectSpread$1(_objectSpread$1({}, props), {}, {
      x1: entry,
      y1: y,
      x2: entry,
      y2: y + height,
      key: "line-".concat(i),
      index: i
    });
    return renderLineItem(vertical, lineItemProps);
  });
  return /* @__PURE__ */ React.createElement("g", {
    className: "recharts-cartesian-grid-vertical"
  }, items);
}
function HorizontalStripes(props) {
  var horizontalFill = props.horizontalFill, fillOpacity = props.fillOpacity, x = props.x, y = props.y, width = props.width, height = props.height, horizontalPoints = props.horizontalPoints, _props$horizontal2 = props.horizontal, horizontal = _props$horizontal2 === void 0 ? true : _props$horizontal2;
  if (!horizontal || !horizontalFill || !horizontalFill.length) {
    return null;
  }
  var roundedSortedHorizontalPoints = horizontalPoints.map(function(e) {
    return Math.round(e + y - y);
  }).sort(function(a, b) {
    return a - b;
  });
  if (y !== roundedSortedHorizontalPoints[0]) {
    roundedSortedHorizontalPoints.unshift(0);
  }
  var items = roundedSortedHorizontalPoints.map(function(entry, i) {
    var lastStripe = !roundedSortedHorizontalPoints[i + 1];
    var lineHeight = lastStripe ? y + height - entry : roundedSortedHorizontalPoints[i + 1] - entry;
    if (lineHeight <= 0) {
      return null;
    }
    var colorIndex = i % horizontalFill.length;
    return /* @__PURE__ */ React.createElement("rect", {
      key: "react-".concat(i),
      y: entry,
      x,
      height: lineHeight,
      width,
      stroke: "none",
      fill: horizontalFill[colorIndex],
      fillOpacity,
      className: "recharts-cartesian-grid-bg"
    });
  });
  return /* @__PURE__ */ React.createElement("g", {
    className: "recharts-cartesian-gridstripes-horizontal"
  }, items);
}
function VerticalStripes(props) {
  var _props$vertical2 = props.vertical, vertical = _props$vertical2 === void 0 ? true : _props$vertical2, verticalFill = props.verticalFill, fillOpacity = props.fillOpacity, x = props.x, y = props.y, width = props.width, height = props.height, verticalPoints = props.verticalPoints;
  if (!vertical || !verticalFill || !verticalFill.length) {
    return null;
  }
  var roundedSortedVerticalPoints = verticalPoints.map(function(e) {
    return Math.round(e + x - x);
  }).sort(function(a, b) {
    return a - b;
  });
  if (x !== roundedSortedVerticalPoints[0]) {
    roundedSortedVerticalPoints.unshift(0);
  }
  var items = roundedSortedVerticalPoints.map(function(entry, i) {
    var lastStripe = !roundedSortedVerticalPoints[i + 1];
    var lineWidth = lastStripe ? x + width - entry : roundedSortedVerticalPoints[i + 1] - entry;
    if (lineWidth <= 0) {
      return null;
    }
    var colorIndex = i % verticalFill.length;
    return /* @__PURE__ */ React.createElement("rect", {
      key: "react-".concat(i),
      x: entry,
      y,
      width: lineWidth,
      height,
      stroke: "none",
      fill: verticalFill[colorIndex],
      fillOpacity,
      className: "recharts-cartesian-grid-bg"
    });
  });
  return /* @__PURE__ */ React.createElement("g", {
    className: "recharts-cartesian-gridstripes-vertical"
  }, items);
}
var defaultVerticalCoordinatesGenerator = function defaultVerticalCoordinatesGenerator2(_ref, syncWithTicks) {
  var xAxis = _ref.xAxis, width = _ref.width, height = _ref.height, offset = _ref.offset;
  return getCoordinatesOfGrid(getTicks(_objectSpread$1(_objectSpread$1(_objectSpread$1({}, CartesianAxis.defaultProps), xAxis), {}, {
    ticks: getTicksOfAxis(xAxis, true),
    viewBox: {
      x: 0,
      y: 0,
      width,
      height
    }
  })), offset.left, offset.left + offset.width, syncWithTicks);
};
var defaultHorizontalCoordinatesGenerator = function defaultHorizontalCoordinatesGenerator2(_ref2, syncWithTicks) {
  var yAxis = _ref2.yAxis, width = _ref2.width, height = _ref2.height, offset = _ref2.offset;
  return getCoordinatesOfGrid(getTicks(_objectSpread$1(_objectSpread$1(_objectSpread$1({}, CartesianAxis.defaultProps), yAxis), {}, {
    ticks: getTicksOfAxis(yAxis, true),
    viewBox: {
      x: 0,
      y: 0,
      width,
      height
    }
  })), offset.top, offset.top + offset.height, syncWithTicks);
};
var defaultProps = {
  horizontal: true,
  vertical: true,
  stroke: "#ccc",
  fill: "none",
  // The fill of colors of grid lines
  verticalFill: [],
  horizontalFill: []
};
function CartesianGrid(props) {
  var _props$stroke, _props$fill, _props$horizontal3, _props$horizontalFill, _props$vertical3, _props$verticalFill;
  var chartWidth = useChartWidth();
  var chartHeight = useChartHeight();
  var offset = useOffset();
  var propsIncludingDefaults = _objectSpread$1(_objectSpread$1({}, props), {}, {
    stroke: (_props$stroke = props.stroke) !== null && _props$stroke !== void 0 ? _props$stroke : defaultProps.stroke,
    fill: (_props$fill = props.fill) !== null && _props$fill !== void 0 ? _props$fill : defaultProps.fill,
    horizontal: (_props$horizontal3 = props.horizontal) !== null && _props$horizontal3 !== void 0 ? _props$horizontal3 : defaultProps.horizontal,
    horizontalFill: (_props$horizontalFill = props.horizontalFill) !== null && _props$horizontalFill !== void 0 ? _props$horizontalFill : defaultProps.horizontalFill,
    vertical: (_props$vertical3 = props.vertical) !== null && _props$vertical3 !== void 0 ? _props$vertical3 : defaultProps.vertical,
    verticalFill: (_props$verticalFill = props.verticalFill) !== null && _props$verticalFill !== void 0 ? _props$verticalFill : defaultProps.verticalFill,
    x: isNumber(props.x) ? props.x : offset.left,
    y: isNumber(props.y) ? props.y : offset.top,
    width: isNumber(props.width) ? props.width : offset.width,
    height: isNumber(props.height) ? props.height : offset.height
  });
  var x = propsIncludingDefaults.x, y = propsIncludingDefaults.y, width = propsIncludingDefaults.width, height = propsIncludingDefaults.height, syncWithTicks = propsIncludingDefaults.syncWithTicks, horizontalValues = propsIncludingDefaults.horizontalValues, verticalValues = propsIncludingDefaults.verticalValues;
  var xAxis = useArbitraryXAxis();
  var yAxis = useYAxisWithFiniteDomainOrRandom();
  if (!isNumber(width) || width <= 0 || !isNumber(height) || height <= 0 || !isNumber(x) || x !== +x || !isNumber(y) || y !== +y) {
    return null;
  }
  var verticalCoordinatesGenerator = propsIncludingDefaults.verticalCoordinatesGenerator || defaultVerticalCoordinatesGenerator;
  var horizontalCoordinatesGenerator = propsIncludingDefaults.horizontalCoordinatesGenerator || defaultHorizontalCoordinatesGenerator;
  var horizontalPoints = propsIncludingDefaults.horizontalPoints, verticalPoints = propsIncludingDefaults.verticalPoints;
  if ((!horizontalPoints || !horizontalPoints.length) && isFunction(horizontalCoordinatesGenerator)) {
    var isHorizontalValues = horizontalValues && horizontalValues.length;
    var generatorResult = horizontalCoordinatesGenerator({
      yAxis: yAxis ? _objectSpread$1(_objectSpread$1({}, yAxis), {}, {
        ticks: isHorizontalValues ? horizontalValues : yAxis.ticks
      }) : void 0,
      width: chartWidth,
      height: chartHeight,
      offset
    }, isHorizontalValues ? true : syncWithTicks);
    warn(Array.isArray(generatorResult), "horizontalCoordinatesGenerator should return Array but instead it returned [".concat(_typeof$1(generatorResult), "]"));
    if (Array.isArray(generatorResult)) {
      horizontalPoints = generatorResult;
    }
  }
  if ((!verticalPoints || !verticalPoints.length) && isFunction(verticalCoordinatesGenerator)) {
    var isVerticalValues = verticalValues && verticalValues.length;
    var _generatorResult = verticalCoordinatesGenerator({
      xAxis: xAxis ? _objectSpread$1(_objectSpread$1({}, xAxis), {}, {
        ticks: isVerticalValues ? verticalValues : xAxis.ticks
      }) : void 0,
      width: chartWidth,
      height: chartHeight,
      offset
    }, isVerticalValues ? true : syncWithTicks);
    warn(Array.isArray(_generatorResult), "verticalCoordinatesGenerator should return Array but instead it returned [".concat(_typeof$1(_generatorResult), "]"));
    if (Array.isArray(_generatorResult)) {
      verticalPoints = _generatorResult;
    }
  }
  return /* @__PURE__ */ React.createElement("g", {
    className: "recharts-cartesian-grid"
  }, /* @__PURE__ */ React.createElement(Background, {
    fill: propsIncludingDefaults.fill,
    fillOpacity: propsIncludingDefaults.fillOpacity,
    x: propsIncludingDefaults.x,
    y: propsIncludingDefaults.y,
    width: propsIncludingDefaults.width,
    height: propsIncludingDefaults.height,
    ry: propsIncludingDefaults.ry
  }), /* @__PURE__ */ React.createElement(HorizontalGridLines, _extends$1({}, propsIncludingDefaults, {
    offset,
    horizontalPoints,
    xAxis,
    yAxis
  })), /* @__PURE__ */ React.createElement(VerticalGridLines, _extends$1({}, propsIncludingDefaults, {
    offset,
    verticalPoints,
    xAxis,
    yAxis
  })), /* @__PURE__ */ React.createElement(HorizontalStripes, _extends$1({}, propsIncludingDefaults, {
    horizontalPoints
  })), /* @__PURE__ */ React.createElement(VerticalStripes, _extends$1({}, propsIncludingDefaults, {
    verticalPoints
  })));
}
CartesianGrid.displayName = "CartesianGrid";
var _excluded = ["type", "layout", "connectNulls", "ref"], _excluded2 = ["key"];
function _typeof(o) {
  "@babel/helpers - typeof";
  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o2) {
    return typeof o2;
  } : function(o2) {
    return o2 && "function" == typeof Symbol && o2.constructor === Symbol && o2 !== Symbol.prototype ? "symbol" : typeof o2;
  }, _typeof(o);
}
function _objectWithoutProperties(source, excluded) {
  if (source == null) return {};
  var target = _objectWithoutPropertiesLoose(source, excluded);
  var key, i;
  if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
    for (i = 0; i < sourceSymbolKeys.length; i++) {
      key = sourceSymbolKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
      target[key] = source[key];
    }
  }
  return target;
}
function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  for (var key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      if (excluded.indexOf(key) >= 0) continue;
      target[key] = source[key];
    }
  }
  return target;
}
function _extends() {
  _extends = Object.assign ? Object.assign.bind() : function(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends.apply(this, arguments);
}
function ownKeys(e, r) {
  var t = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(e);
    r && (o = o.filter(function(r2) {
      return Object.getOwnPropertyDescriptor(e, r2).enumerable;
    })), t.push.apply(t, o);
  }
  return t;
}
function _objectSpread(e) {
  for (var r = 1; r < arguments.length; r++) {
    var t = null != arguments[r] ? arguments[r] : {};
    r % 2 ? ownKeys(Object(t), true).forEach(function(r2) {
      _defineProperty(e, r2, t[r2]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function(r2) {
      Object.defineProperty(e, r2, Object.getOwnPropertyDescriptor(t, r2));
    });
  }
  return e;
}
function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}
function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}
function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}
function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}
function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
  return arr2;
}
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", { writable: false });
  return Constructor;
}
function _callSuper(t, o, e) {
  return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e));
}
function _possibleConstructorReturn(self, call) {
  if (call && (_typeof(call) === "object" || typeof call === "function")) {
    return call;
  } else if (call !== void 0) {
    throw new TypeError("Derived constructors may only return object or undefined");
  }
  return _assertThisInitialized(self);
}
function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }
  return self;
}
function _isNativeReflectConstruct() {
  try {
    var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
    }));
  } catch (t2) {
  }
  return (_isNativeReflectConstruct = function _isNativeReflectConstruct2() {
    return !!t;
  })();
}
function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf2(o2) {
    return o2.__proto__ || Object.getPrototypeOf(o2);
  };
  return _getPrototypeOf(o);
}
function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } });
  Object.defineProperty(subClass, "prototype", { writable: false });
  if (superClass) _setPrototypeOf(subClass, superClass);
}
function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf2(o2, p2) {
    o2.__proto__ = p2;
    return o2;
  };
  return _setPrototypeOf(o, p);
}
function _defineProperty(obj, key, value) {
  key = _toPropertyKey(key);
  if (key in obj) {
    Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
  } else {
    obj[key] = value;
  }
  return obj;
}
function _toPropertyKey(t) {
  var i = _toPrimitive(t, "string");
  return "symbol" == _typeof(i) ? i : i + "";
}
function _toPrimitive(t, r) {
  if ("object" != _typeof(t) || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r);
    if ("object" != _typeof(i)) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return String(t);
}
var Line = /* @__PURE__ */ (function(_PureComponent) {
  function Line2() {
    var _this;
    _classCallCheck(this, Line2);
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = _callSuper(this, Line2, [].concat(args));
    _defineProperty(_this, "state", {
      isAnimationFinished: true,
      totalLength: 0
    });
    _defineProperty(_this, "generateSimpleStrokeDasharray", function(totalLength, length) {
      return "".concat(length, "px ").concat(totalLength - length, "px");
    });
    _defineProperty(_this, "getStrokeDasharray", function(length, totalLength, lines) {
      var lineLength = lines.reduce(function(pre, next) {
        return pre + next;
      });
      if (!lineLength) {
        return _this.generateSimpleStrokeDasharray(totalLength, length);
      }
      var count = Math.floor(length / lineLength);
      var remainLength = length % lineLength;
      var restLength = totalLength - length;
      var remainLines = [];
      for (var i = 0, sum = 0; i < lines.length; sum += lines[i], ++i) {
        if (sum + lines[i] > remainLength) {
          remainLines = [].concat(_toConsumableArray(lines.slice(0, i)), [remainLength - sum]);
          break;
        }
      }
      var emptyLines = remainLines.length % 2 === 0 ? [0, restLength] : [restLength];
      return [].concat(_toConsumableArray(Line2.repeat(lines, count)), _toConsumableArray(remainLines), emptyLines).map(function(line) {
        return "".concat(line, "px");
      }).join(", ");
    });
    _defineProperty(_this, "id", uniqueId("recharts-line-"));
    _defineProperty(_this, "pathRef", function(node) {
      _this.mainCurve = node;
    });
    _defineProperty(_this, "handleAnimationEnd", function() {
      _this.setState({
        isAnimationFinished: true
      });
      if (_this.props.onAnimationEnd) {
        _this.props.onAnimationEnd();
      }
    });
    _defineProperty(_this, "handleAnimationStart", function() {
      _this.setState({
        isAnimationFinished: false
      });
      if (_this.props.onAnimationStart) {
        _this.props.onAnimationStart();
      }
    });
    return _this;
  }
  _inherits(Line2, _PureComponent);
  return _createClass(Line2, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      if (!this.props.isAnimationActive) {
        return;
      }
      var totalLength = this.getTotalLength();
      this.setState({
        totalLength
      });
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      if (!this.props.isAnimationActive) {
        return;
      }
      var totalLength = this.getTotalLength();
      if (totalLength !== this.state.totalLength) {
        this.setState({
          totalLength
        });
      }
    }
  }, {
    key: "getTotalLength",
    value: function getTotalLength() {
      var curveDom = this.mainCurve;
      try {
        return curveDom && curveDom.getTotalLength && curveDom.getTotalLength() || 0;
      } catch (err) {
        return 0;
      }
    }
  }, {
    key: "renderErrorBar",
    value: function renderErrorBar(needClip, clipPathId) {
      if (this.props.isAnimationActive && !this.state.isAnimationFinished) {
        return null;
      }
      var _this$props = this.props, points = _this$props.points, xAxis = _this$props.xAxis, yAxis = _this$props.yAxis, layout = _this$props.layout, children = _this$props.children;
      var errorBarItems = findAllByType(children, ErrorBar);
      if (!errorBarItems) {
        return null;
      }
      var dataPointFormatter = function dataPointFormatter2(dataPoint, dataKey) {
        return {
          x: dataPoint.x,
          y: dataPoint.y,
          value: dataPoint.value,
          errorVal: getValueByDataKey(dataPoint.payload, dataKey)
        };
      };
      var errorBarProps = {
        clipPath: needClip ? "url(#clipPath-".concat(clipPathId, ")") : null
      };
      return /* @__PURE__ */ React.createElement(Layer, errorBarProps, errorBarItems.map(function(item) {
        return /* @__PURE__ */ React.cloneElement(item, {
          key: "bar-".concat(item.props.dataKey),
          data: points,
          xAxis,
          yAxis,
          layout,
          dataPointFormatter
        });
      }));
    }
  }, {
    key: "renderDots",
    value: function renderDots(needClip, clipDot, clipPathId) {
      var isAnimationActive = this.props.isAnimationActive;
      if (isAnimationActive && !this.state.isAnimationFinished) {
        return null;
      }
      var _this$props2 = this.props, dot = _this$props2.dot, points = _this$props2.points, dataKey = _this$props2.dataKey;
      var lineProps = filterProps(this.props, false);
      var customDotProps = filterProps(dot, true);
      var dots = points.map(function(entry, i) {
        var dotProps = _objectSpread(_objectSpread(_objectSpread({
          key: "dot-".concat(i),
          r: 3
        }, lineProps), customDotProps), {}, {
          index: i,
          cx: entry.x,
          cy: entry.y,
          value: entry.value,
          dataKey,
          payload: entry.payload,
          points
        });
        return Line2.renderDotItem(dot, dotProps);
      });
      var dotsProps = {
        clipPath: needClip ? "url(#clipPath-".concat(clipDot ? "" : "dots-").concat(clipPathId, ")") : null
      };
      return /* @__PURE__ */ React.createElement(Layer, _extends({
        className: "recharts-line-dots",
        key: "dots"
      }, dotsProps), dots);
    }
  }, {
    key: "renderCurveStatically",
    value: function renderCurveStatically(points, needClip, clipPathId, props) {
      var _this$props3 = this.props, type = _this$props3.type, layout = _this$props3.layout, connectNulls = _this$props3.connectNulls;
      _this$props3.ref;
      var others = _objectWithoutProperties(_this$props3, _excluded);
      var curveProps = _objectSpread(_objectSpread(_objectSpread({}, filterProps(others, true)), {}, {
        fill: "none",
        className: "recharts-line-curve",
        clipPath: needClip ? "url(#clipPath-".concat(clipPathId, ")") : null,
        points
      }, props), {}, {
        type,
        layout,
        connectNulls
      });
      return /* @__PURE__ */ React.createElement(Curve, _extends({}, curveProps, {
        pathRef: this.pathRef
      }));
    }
  }, {
    key: "renderCurveWithAnimation",
    value: function renderCurveWithAnimation(needClip, clipPathId) {
      var _this2 = this;
      var _this$props4 = this.props, points = _this$props4.points, strokeDasharray = _this$props4.strokeDasharray, isAnimationActive = _this$props4.isAnimationActive, animationBegin = _this$props4.animationBegin, animationDuration = _this$props4.animationDuration, animationEasing = _this$props4.animationEasing, animationId = _this$props4.animationId, animateNewValues = _this$props4.animateNewValues, width = _this$props4.width, height = _this$props4.height;
      var _this$state = this.state, prevPoints = _this$state.prevPoints, totalLength = _this$state.totalLength;
      return /* @__PURE__ */ React.createElement(Animate, {
        begin: animationBegin,
        duration: animationDuration,
        isActive: isAnimationActive,
        easing: animationEasing,
        from: {
          t: 0
        },
        to: {
          t: 1
        },
        key: "line-".concat(animationId),
        onAnimationEnd: this.handleAnimationEnd,
        onAnimationStart: this.handleAnimationStart
      }, function(_ref) {
        var t = _ref.t;
        if (prevPoints) {
          var prevPointsDiffFactor = prevPoints.length / points.length;
          var stepData = points.map(function(entry, index) {
            var prevPointIndex = Math.floor(index * prevPointsDiffFactor);
            if (prevPoints[prevPointIndex]) {
              var prev = prevPoints[prevPointIndex];
              var interpolatorX = interpolateNumber(prev.x, entry.x);
              var interpolatorY = interpolateNumber(prev.y, entry.y);
              return _objectSpread(_objectSpread({}, entry), {}, {
                x: interpolatorX(t),
                y: interpolatorY(t)
              });
            }
            if (animateNewValues) {
              var _interpolatorX = interpolateNumber(width * 2, entry.x);
              var _interpolatorY = interpolateNumber(height / 2, entry.y);
              return _objectSpread(_objectSpread({}, entry), {}, {
                x: _interpolatorX(t),
                y: _interpolatorY(t)
              });
            }
            return _objectSpread(_objectSpread({}, entry), {}, {
              x: entry.x,
              y: entry.y
            });
          });
          return _this2.renderCurveStatically(stepData, needClip, clipPathId);
        }
        var interpolator = interpolateNumber(0, totalLength);
        var curLength = interpolator(t);
        var currentStrokeDasharray;
        if (strokeDasharray) {
          var lines = "".concat(strokeDasharray).split(/[,\s]+/gim).map(function(num) {
            return parseFloat(num);
          });
          currentStrokeDasharray = _this2.getStrokeDasharray(curLength, totalLength, lines);
        } else {
          currentStrokeDasharray = _this2.generateSimpleStrokeDasharray(totalLength, curLength);
        }
        return _this2.renderCurveStatically(points, needClip, clipPathId, {
          strokeDasharray: currentStrokeDasharray
        });
      });
    }
  }, {
    key: "renderCurve",
    value: function renderCurve(needClip, clipPathId) {
      var _this$props5 = this.props, points = _this$props5.points, isAnimationActive = _this$props5.isAnimationActive;
      var _this$state2 = this.state, prevPoints = _this$state2.prevPoints, totalLength = _this$state2.totalLength;
      if (isAnimationActive && points && points.length && (!prevPoints && totalLength > 0 || !isEqual(prevPoints, points))) {
        return this.renderCurveWithAnimation(needClip, clipPathId);
      }
      return this.renderCurveStatically(points, needClip, clipPathId);
    }
  }, {
    key: "render",
    value: function render() {
      var _filterProps;
      var _this$props6 = this.props, hide = _this$props6.hide, dot = _this$props6.dot, points = _this$props6.points, className = _this$props6.className, xAxis = _this$props6.xAxis, yAxis = _this$props6.yAxis, top = _this$props6.top, left = _this$props6.left, width = _this$props6.width, height = _this$props6.height, isAnimationActive = _this$props6.isAnimationActive, id = _this$props6.id;
      if (hide || !points || !points.length) {
        return null;
      }
      var isAnimationFinished = this.state.isAnimationFinished;
      var hasSinglePoint = points.length === 1;
      var layerClass = clsx("recharts-line", className);
      var needClipX = xAxis && xAxis.allowDataOverflow;
      var needClipY = yAxis && yAxis.allowDataOverflow;
      var needClip = needClipX || needClipY;
      var clipPathId = isNil(id) ? this.id : id;
      var _ref2 = (_filterProps = filterProps(dot, false)) !== null && _filterProps !== void 0 ? _filterProps : {
        r: 3,
        strokeWidth: 2
      }, _ref2$r = _ref2.r, r = _ref2$r === void 0 ? 3 : _ref2$r, _ref2$strokeWidth = _ref2.strokeWidth, strokeWidth = _ref2$strokeWidth === void 0 ? 2 : _ref2$strokeWidth;
      var _ref3 = hasClipDot(dot) ? dot : {}, _ref3$clipDot = _ref3.clipDot, clipDot = _ref3$clipDot === void 0 ? true : _ref3$clipDot;
      var dotSize = r * 2 + strokeWidth;
      return /* @__PURE__ */ React.createElement(Layer, {
        className: layerClass
      }, needClipX || needClipY ? /* @__PURE__ */ React.createElement("defs", null, /* @__PURE__ */ React.createElement("clipPath", {
        id: "clipPath-".concat(clipPathId)
      }, /* @__PURE__ */ React.createElement("rect", {
        x: needClipX ? left : left - width / 2,
        y: needClipY ? top : top - height / 2,
        width: needClipX ? width : width * 2,
        height: needClipY ? height : height * 2
      })), !clipDot && /* @__PURE__ */ React.createElement("clipPath", {
        id: "clipPath-dots-".concat(clipPathId)
      }, /* @__PURE__ */ React.createElement("rect", {
        x: left - dotSize / 2,
        y: top - dotSize / 2,
        width: width + dotSize,
        height: height + dotSize
      }))) : null, !hasSinglePoint && this.renderCurve(needClip, clipPathId), this.renderErrorBar(needClip, clipPathId), (hasSinglePoint || dot) && this.renderDots(needClip, clipDot, clipPathId), (!isAnimationActive || isAnimationFinished) && LabelList.renderCallByParent(this.props, points));
    }
  }], [{
    key: "getDerivedStateFromProps",
    value: function getDerivedStateFromProps(nextProps, prevState) {
      if (nextProps.animationId !== prevState.prevAnimationId) {
        return {
          prevAnimationId: nextProps.animationId,
          curPoints: nextProps.points,
          prevPoints: prevState.curPoints
        };
      }
      if (nextProps.points !== prevState.curPoints) {
        return {
          curPoints: nextProps.points
        };
      }
      return null;
    }
  }, {
    key: "repeat",
    value: function repeat(lines, count) {
      var linesUnit = lines.length % 2 !== 0 ? [].concat(_toConsumableArray(lines), [0]) : lines;
      var result = [];
      for (var i = 0; i < count; ++i) {
        result = [].concat(_toConsumableArray(result), _toConsumableArray(linesUnit));
      }
      return result;
    }
  }, {
    key: "renderDotItem",
    value: function renderDotItem(option, props) {
      var dotItem;
      if (/* @__PURE__ */ React.isValidElement(option)) {
        dotItem = /* @__PURE__ */ React.cloneElement(option, props);
      } else if (isFunction(option)) {
        dotItem = option(props);
      } else {
        var key = props.key, dotProps = _objectWithoutProperties(props, _excluded2);
        var className = clsx("recharts-line-dot", typeof option !== "boolean" ? option.className : "");
        dotItem = /* @__PURE__ */ React.createElement(Dot, _extends({
          key
        }, dotProps, {
          className
        }));
      }
      return dotItem;
    }
  }]);
})(reactExports.PureComponent);
_defineProperty(Line, "displayName", "Line");
_defineProperty(Line, "defaultProps", {
  xAxisId: 0,
  yAxisId: 0,
  connectNulls: false,
  activeDot: true,
  dot: true,
  legendType: "line",
  stroke: "#3182bd",
  strokeWidth: 1,
  fill: "#fff",
  points: [],
  isAnimationActive: !Global.isSsr,
  animateNewValues: true,
  animationBegin: 0,
  animationDuration: 1500,
  animationEasing: "ease",
  hide: false,
  label: false
});
_defineProperty(Line, "getComposedData", function(_ref4) {
  var props = _ref4.props, xAxis = _ref4.xAxis, yAxis = _ref4.yAxis, xAxisTicks = _ref4.xAxisTicks, yAxisTicks = _ref4.yAxisTicks, dataKey = _ref4.dataKey, bandSize = _ref4.bandSize, displayedData = _ref4.displayedData, offset = _ref4.offset;
  var layout = props.layout;
  var points = displayedData.map(function(entry, index) {
    var value = getValueByDataKey(entry, dataKey);
    if (layout === "horizontal") {
      return {
        x: getCateCoordinateOfLine({
          axis: xAxis,
          ticks: xAxisTicks,
          bandSize,
          entry,
          index
        }),
        y: isNil(value) ? null : yAxis.scale(value),
        value,
        payload: entry
      };
    }
    return {
      x: isNil(value) ? null : xAxis.scale(value),
      y: getCateCoordinateOfLine({
        axis: yAxis,
        ticks: yAxisTicks,
        bandSize,
        entry,
        index
      }),
      value,
      payload: entry
    };
  });
  return _objectSpread({
    points,
    layout
  }, offset);
});
var LineChart = generateCategoricalChart({
  chartName: "LineChart",
  GraphicalChild: Line,
  axisComponents: [{
    axisType: "xAxis",
    AxisComp: XAxis
  }, {
    axisType: "yAxis",
    AxisComp: YAxis
  }],
  formatAxisMap
});
var BarChart = generateCategoricalChart({
  chartName: "BarChart",
  GraphicalChild: Bar,
  defaultTooltipEventType: "axis",
  validateTooltipEventTypes: ["axis", "item"],
  axisComponents: [{
    axisType: "xAxis",
    AxisComp: XAxis
  }, {
    axisType: "yAxis",
    AxisComp: YAxis
  }],
  formatAxisMap
});
var RadarChart = generateCategoricalChart({
  chartName: "RadarChart",
  GraphicalChild: Radar,
  axisComponents: [{
    axisType: "angleAxis",
    AxisComp: PolarAngleAxis
  }, {
    axisType: "radiusAxis",
    AxisComp: PolarRadiusAxis
  }],
  formatAxisMap: formatAxisMap$1,
  defaultProps: {
    layout: "centric",
    startAngle: 90,
    endAngle: -270,
    cx: "50%",
    cy: "50%",
    innerRadius: 0,
    outerRadius: "80%"
  }
});
const ALL_MUSCLE_CATEGORIES = [
  "peitoral",
  "costas_trapezio",
  "deltoides",
  "biceps_antebraco",
  "triceps",
  "abdomen_core",
  "membros_inferiores_gluteos",
  "panturrilha"
];
const dayText = {
  pt: ["dia", "dias"],
  es: ["día", "días"],
  en: ["day", "days"],
  fr: ["jour", "jours"],
  de: ["Tag", "Tage"]
};
function getCategoryBaseLoad(category) {
  if (category === "membros_inferiores_gluteos") return 42;
  if (category === "costas_trapezio") return 32;
  if (category === "peitoral") return 28;
  if (category === "deltoides") return 16;
  if (category === "biceps_antebraco" || category === "triceps") return 14;
  if (category === "panturrilha") return 18;
  return 8;
}
function getEquipmentFactor(equipment) {
  if (equipment === "maquina") return 1.1;
  if (equipment === "barra") return 1.2;
  if (equipment === "halteres") return 1;
  if (equipment === "cabos") return 0.9;
  if (equipment === "peso_corporal") return 0.75;
  if (equipment === "barra_fixa" || equipment === "paralelas") return 0.85;
  return 0.8;
}
function getLevelFactor(profile) {
  if (profile.level === "avancado") return 1.2;
  if (profile.level === "intermediario") return 1;
  return 0.82;
}
function getConsistencyScore(profile) {
  if (profile.consistency === "elite") return 5;
  if (profile.consistency === "regular") return 4;
  return 3;
}
function estimateExerciseVolume(exerciseId, sets, catalogById, profile) {
  const record = catalogById.get(exerciseId);
  if (!record) return 0;
  const estimatedLoad = getCategoryBaseLoad(record.category) * getEquipmentFactor(record.equipment) * getLevelFactor(profile);
  return Math.round(sets.reduce((sum, set) => sum + set.reps * estimatedLoad, 0));
}
function getWorkoutVolume(workout, catalogById, profile) {
  return workout.exercises.reduce(
    (sum, item) => sum + estimateExerciseVolume(item.exerciseId, item.sets, catalogById, profile),
    0
  );
}
function getWorkoutCategories(workout, catalogById) {
  return workout.exercises.map((item) => catalogById.get(item.exerciseId)?.category).filter((value) => Boolean(value));
}
function buildVolumeTrend(state, catalogById, locale) {
  return getWeekDayLabels(locale).map((day, index) => {
    const workoutId = state.schedule[index]?.workoutId;
    const workout = state.workouts.find((item) => item.id === workoutId);
    return {
      day,
      volume: workout ? getWorkoutVolume(workout, catalogById, state.profile) : 0,
      exercises: workout?.exercises.length ?? 0
    };
  });
}
function buildMuscleRadar(state, catalogById, locale) {
  const distribution = /* @__PURE__ */ new Map();
  state.workouts.forEach((workout) => {
    getWorkoutCategories(workout, catalogById).forEach((category) => {
      distribution.set(category, (distribution.get(category) ?? 0) + 1);
    });
  });
  const max = Math.max(...distribution.values(), 1);
  return ALL_MUSCLE_CATEGORIES.map((category) => ({
    muscle: getCategoryLabel(category, locale),
    value: Math.round((distribution.get(category) ?? 0) / max * 100)
  }));
}
function buildConsistencyHeatmap(state) {
  const activeDays = new Set(
    state.schedule.filter((item) => item.workoutId).map((item) => item.dayIndex)
  );
  const base = getConsistencyScore(state.profile);
  return Array.from({ length: 84 }, (_, index) => {
    const dayIndex = index % 7;
    const active = activeDays.has(dayIndex);
    return {
      day: index,
      value: active ? base : Math.max(1, base - 2)
    };
  });
}
function buildProgressionData(state) {
  const baseSupino = state.profile.level === "avancado" ? 84 : state.profile.level === "intermediario" ? 68 : 52;
  const baseAgachamento = state.profile.level === "avancado" ? 118 : state.profile.level === "intermediario" ? 94 : 72;
  const baseTerra = state.profile.level === "avancado" ? 138 : state.profile.level === "intermediario" ? 112 : 86;
  const goalFactor = state.profile.goal === "forca" ? 1.5 : state.profile.goal === "ganho_massa" ? 1.2 : 0.9;
  return Array.from({ length: 12 }, (_, index) => ({
    week: `S${index + 1}`,
    supino: Math.round(baseSupino + index * goalFactor * 1.4),
    agachamento: Math.round(baseAgachamento + index * goalFactor * 1.8),
    terra: Math.round(baseTerra + index * goalFactor * 2)
  }));
}
function buildWorkoutHistory(state, catalogById, locale) {
  const [singular, plural] = dayText[locale] ?? dayText.pt;
  return state.workouts.map((workout, index) => ({
    id: workout.id,
    name: translateWorkoutName(workout.name, locale),
    date: `${index + 1} ${index === 0 ? singular : plural}`,
    duration: workout.duration,
    volume: getWorkoutVolume(workout, catalogById, state.profile),
    sets: workout.exercises.reduce((sum, item) => sum + item.sets.length, 0),
    prs: state.profile.goal === "forca" && index < 2 ? 1 : 0
  }));
}
function buildCompletionTrend(state, locale) {
  return getWeekDayLabels(locale).map((day, index) => ({
    day,
    completed: state.schedule[index]?.workoutId ? 1 : 0
  }));
}
function buildRecoveryScore(state) {
  let score = 82;
  if (state.environment.crowdLevel === "pico") score -= 4;
  if (state.environment.location === "casa") score -= 3;
  if (state.environment.location === "outdoor") score -= 1;
  if (state.profile.consistency === "elite") score += 5;
  if (state.profile.level === "iniciante") score += 2;
  if (state.profile.workoutDurationMin >= 75) score -= 3;
  if (state.nutrition.readinessLevel === "alta") score += 4;
  if (state.nutrition.readinessLevel === "media") score += 1;
  if (state.nutrition.needsRecoverySupport) score -= 5;
  if (state.nutrition.hydrationStatus === "alta") score += 2;
  if (state.nutrition.hydrationStatus === "baixa") score -= 4;
  if (state.body.priorityLevel === "alta") score += 2;
  if (state.body.recompositionFocus) score -= 2;
  if ((state.body.bodyFatPct ?? 0) >= 18) score -= 2;
  return Math.max(65, Math.min(96, score));
}
function buildTrainingAnalytics(state, catalog = buildExerciseCatalog(), locale = getStoredLocale()) {
  const catalogById = new Map(catalog.map((record) => [record.id, record]));
  return {
    volumeTrend: buildVolumeTrend(state, catalogById, locale),
    muscleRadar: buildMuscleRadar(state, catalogById, locale),
    consistencyHeatmap: buildConsistencyHeatmap(state),
    progressionData: buildProgressionData(state),
    workoutHistory: buildWorkoutHistory(state, catalogById, locale),
    recoveryScore: buildRecoveryScore(state),
    completionTrend: buildCompletionTrend(state, locale)
  };
}
const COPY = {
  pt: {
    subtitle: "Painel ligado ao treino atual, ao perfil e ao contexto real do atleta.",
    customNutrition: "Nutrição Personalizada",
    kcalDay: "kcal/dia",
    protein: "Proteína",
    carbs: "Carbs",
    fat: "Gordura",
    bmr: "TMB (Repouso)",
    tdee: "TDEE (Ativo)",
    blockTitle: (w) => `Bloco ${w}/12`,
    blockSubtitle: "Leitura profissional do ciclo atual",
    cycleTitle: "Horizonte do ciclo",
    cycleSubtitle: "Curto, médio e longo prazo ligados ao motor",
    recoveryAdjustment: "Ajuste de recuperação:",
    volumeLabel: "volume",
    volumeChartTitle: "Volume semanal planejado",
    volumeChartSubtitle: "Estimativa baseada no treino gerado, categoria e equipamento",
    muscleTitle: "Equilíbrio muscular",
    muscleSubtitle: "Distribuição do plano entre os grupos oficiais",
    recoverySubtitle: "Leitura baseada em ambiente, consistência, duração e prontidão estimada",
    readiness: "Prontidão",
    frequencyTitle: "Frequência semanal",
    frequencySubtitle: "Dias de treino ativos no plano atual",
    consistencyTitle: "Consistência",
    consistencySubtitle: "Mapa projetado das últimas 12 semanas pelo padrão do atleta",
    consistencyLabel: (v) => `Consistência ${v}`,
    progressionTitle: "Progressão estimada",
    progressionSubtitle: "Projeção de 12 semanas para os levantamentos principais",
    bench: "Supino",
    squat: "Agachamento",
    deadlift: "Terra",
    workoutsTitle: "Treinos da semana",
    workoutsSubtitle: "Leitura do plano atual com o volume estimado por sessão",
    sets: "séries",
    macroLabels: {
      mass: "Superávit p/ hipertrofia",
      strength: "Superávit leve p/ força",
      hybrid: "Manutenção ativa",
      definition: "Déficit leve p/ definição",
      weight_loss: "Déficit calórico p/ emagrecimento",
      endurance: "Superávit p/ resistência",
      wellness: "Manutenção / bem-estar",
      athletic: "Performance atlética",
      default: "Manutenção / performance"
    }
  },
  es: {
    subtitle: "Panel conectado al entrenamiento actual, perfil y contexto real del atleta.",
    customNutrition: "Nutrición Personalizada",
    kcalDay: "kcal/día",
    protein: "Proteína",
    carbs: "Carbos",
    fat: "Grasas",
    bmr: "TMB (Reposo)",
    tdee: "TDEE (Activo)",
    blockTitle: (w) => `Bloque ${w}/12`,
    blockSubtitle: "Lectura profesional del ciclo actual",
    cycleTitle: "Horizonte del ciclo",
    cycleSubtitle: "Corto, medio y largo plazo vinculados al motor",
    recoveryAdjustment: "Ajuste de recuperación:",
    volumeLabel: "volumen",
    volumeChartTitle: "Volumen semanal planificado",
    volumeChartSubtitle: "Estimación basada en el entrenamiento generado, categoría y equipamiento",
    muscleTitle: "Equilibrio muscular",
    muscleSubtitle: "Distribución del plan entre grupos oficiales",
    recoverySubtitle: "Basado en entorno, consistencia, duración y disponibilidad estimada",
    readiness: "Disponibilidad",
    frequencyTitle: "Frecuencia semanal",
    frequencySubtitle: "Días de entrenamiento activos en el plan actual",
    consistencyTitle: "Consistencia",
    consistencySubtitle: "Mapa proyectado de las últimas 12 semanas según el patrón del atleta",
    consistencyLabel: (v) => `Consistencia ${v}`,
    progressionTitle: "Progresión estimada",
    progressionSubtitle: "Proyección de 12 semanas para los levantamientos principales",
    bench: "Press de Banca",
    squat: "Sentadilla",
    deadlift: "Peso Muerto",
    workoutsTitle: "Entrenamientos de la semana",
    workoutsSubtitle: "Lectura del plan actual con el volumen estimado por sesión",
    sets: "series",
    macroLabels: {
      mass: "Superávit para hipertrofia",
      strength: "Superávit leve para fuerza",
      hybrid: "Mantenimiento activo",
      definition: "Déficit leve para definición",
      weight_loss: "Déficit calórico para adelgazar",
      endurance: "Superávit para resistencia",
      wellness: "Mantenimiento / bienestar",
      athletic: "Rendimiento atlético",
      default: "Mantenimiento / rendimiento"
    }
  },
  en: {
    subtitle: "Dashboard connected to the current workout, profile, and real athlete context.",
    customNutrition: "Personalized Nutrition",
    kcalDay: "kcal/day",
    protein: "Protein",
    carbs: "Carbs",
    fat: "Fat",
    bmr: "BMR (Rest)",
    tdee: "TDEE (Active)",
    blockTitle: (w) => `Block ${w}/12`,
    blockSubtitle: "Professional read of the current cycle",
    cycleTitle: "Cycle horizon",
    cycleSubtitle: "Short, mid and long term linked to the engine",
    recoveryAdjustment: "Recovery adjustment:",
    volumeLabel: "volume",
    volumeChartTitle: "Planned weekly volume",
    volumeChartSubtitle: "Estimate based on generated workout, category and equipment",
    muscleTitle: "Muscle balance",
    muscleSubtitle: "Distribution of the plan across official groups",
    recoverySubtitle: "Based on environment, consistency, duration and estimated readiness",
    readiness: "Readiness",
    frequencyTitle: "Weekly frequency",
    frequencySubtitle: "Active training days in the current plan",
    consistencyTitle: "Consistency",
    consistencySubtitle: "12-week projected map based on athlete pattern",
    consistencyLabel: (v) => `Consistency ${v}`,
    progressionTitle: "Estimated progression",
    progressionSubtitle: "12-week projection for the main lifts",
    bench: "Bench Press",
    squat: "Squat",
    deadlift: "Deadlift",
    workoutsTitle: "Week workouts",
    workoutsSubtitle: "Current plan with estimated volume per session",
    sets: "sets",
    macroLabels: {
      mass: "Surplus for hypertrophy",
      strength: "Light surplus for strength",
      hybrid: "Active maintenance",
      definition: "Light deficit for definition",
      weight_loss: "Caloric deficit for weight loss",
      endurance: "Surplus for endurance",
      wellness: "Maintenance / wellness",
      athletic: "Athletic performance",
      default: "Maintenance / performance"
    }
  },
  fr: {
    subtitle: "Tableau de bord lié à l'entraînement actuel, au profil et au contexte réel de l'athlète.",
    customNutrition: "Nutrition Personnalisée",
    kcalDay: "kcal/jour",
    protein: "Protéines",
    carbs: "Glucides",
    fat: "Lipides",
    bmr: "MB (Repos)",
    tdee: "TDEE (Actif)",
    blockTitle: (w) => `Bloc ${w}/12`,
    blockSubtitle: "Lecture professionnelle du cycle actuel",
    cycleTitle: "Horizon du cycle",
    cycleSubtitle: "Court, moyen et long terme liés au moteur",
    recoveryAdjustment: "Ajustement récupération :",
    volumeLabel: "volume",
    volumeChartTitle: "Volume hebdomadaire planifié",
    volumeChartSubtitle: "Estimation basée sur l'entraînement généré, catégorie et équipement",
    muscleTitle: "Équilibre musculaire",
    muscleSubtitle: "Distribution du plan entre les groupes officiels",
    recoverySubtitle: "Basé sur l'environnement, la constance, la durée et la disponibilité estimée",
    readiness: "Disponibilité",
    frequencyTitle: "Fréquence hebdomadaire",
    frequencySubtitle: "Jours d'entraînement actifs dans le plan actuel",
    consistencyTitle: "Constance",
    consistencySubtitle: "Carte projetée sur 12 semaines selon le schéma de l'athlète",
    consistencyLabel: (v) => `Constance ${v}`,
    progressionTitle: "Progression estimée",
    progressionSubtitle: "Projection sur 12 semaines pour les mouvements principaux",
    bench: "Développé Couché",
    squat: "Squat",
    deadlift: "Soulevé de Terre",
    workoutsTitle: "Entraînements de la semaine",
    workoutsSubtitle: "Lecture du plan actuel avec le volume estimé par séance",
    sets: "séries",
    macroLabels: {
      mass: "Surplus pour hypertrophie",
      strength: "Surplus léger pour la force",
      hybrid: "Maintien actif",
      definition: "Déficit léger pour définition",
      weight_loss: "Déficit calorique pour perte de poids",
      endurance: "Surplus pour l'endurance",
      wellness: "Maintien / bien-être",
      athletic: "Performance athlétique",
      default: "Maintien / performance"
    }
  },
  de: {
    subtitle: "Dashboard verbunden mit aktuellem Training, Profil und realem Athletenkontext.",
    customNutrition: "Personalisierte Ernährung",
    kcalDay: "kcal/Tag",
    protein: "Protein",
    carbs: "Kohlenhydrate",
    fat: "Fette",
    bmr: "Grundumsatz (Ruhe)",
    tdee: "TDEE (Aktiv)",
    blockTitle: (w) => `Block ${w}/12`,
    blockSubtitle: "Professionelle Analyse des aktuellen Zyklus",
    cycleTitle: "Zyklushorizont",
    cycleSubtitle: "Kurz-, mittel- und langfristige Ziele verknüpft mit der Engine",
    recoveryAdjustment: "Recovery-Anpassung:",
    volumeLabel: "Volumen",
    volumeChartTitle: "Geplantes Wochenvolumen",
    volumeChartSubtitle: "Schätzung basierend auf generiertem Training, Kategorie und Ausrüstung",
    muscleTitle: "Muskelbalance",
    muscleSubtitle: "Verteilung des Plans auf offizielle Gruppen",
    recoverySubtitle: "Basiert auf Umgebung, Konstanz, Dauer und geschätzter Bereitschaft",
    readiness: "Bereitschaft",
    frequencyTitle: "Wöchentliche Frequenz",
    frequencySubtitle: "Aktive Trainingstage im aktuellen Plan",
    consistencyTitle: "Konstanz",
    consistencySubtitle: "Projektierte 12-Wochen-Karte basierend auf dem Athletenmuster",
    consistencyLabel: (v) => `Konstanz ${v}`,
    progressionTitle: "Geschätzte Progression",
    progressionSubtitle: "12-Wochen-Projektion für die Hauptlifts",
    bench: "Bankdrücken",
    squat: "Kniebeuge",
    deadlift: "Kreuzheben",
    workoutsTitle: "Trainings der Woche",
    workoutsSubtitle: "Aktueller Plan mit geschätztem Volumen pro Einheit",
    sets: "Sätze",
    macroLabels: {
      mass: "Überschuss für Hypertrophie",
      strength: "Leichter Überschuss für Kraft",
      hybrid: "Aktive Erhaltung",
      definition: "Leichtes Defizit für Definition",
      weight_loss: "Kaloriendefizit zur Gewichtsabnahme",
      endurance: "Überschuss für Ausdauer",
      wellness: "Erhaltung / Wohlbefinden",
      athletic: "Athletische Performance",
      default: "Erhaltung / Performance"
    }
  }
};
const tooltipStyle = {
  background: "var(--surface)",
  border: "1px solid var(--border)",
  borderRadius: 12,
  color: "var(--foreground)",
  fontSize: 12
};
function getMacroLabel(goal, copy) {
  if (!goal) return copy.macroLabels.default;
  return copy.macroLabels[goal] ?? copy.macroLabels.default;
}
function Analytics() {
  const locale = getStoredLocale();
  const copy = COPY[locale] ?? COPY.pt;
  const trainingState = useTrainingState();
  const analytics = buildTrainingAnalytics(trainingState, void 0, locale);
  const {
    periodization
  } = trainingState;
  const currentWeek = periodization.weeks[periodization.currentWeek - 1];
  const onboarding = loadOnboarding();
  const macros = getCaloriesFromOnboarding(onboarding);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { initial: {
      opacity: 0,
      y: -8
    }, animate: {
      opacity: 1,
      y: 0
    }, transition: {
      duration: 0.3
    }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-3xl font-bold text-gradient-brand", children: "Analytics" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: copy.subtitle })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ShareVideoButton, { composition: WeeklyRecapVideo, inputProps: {
        name: onboarding.name ?? "Atleta",
        weekNumber: periodization.currentWeek,
        totalSessions: analytics.workoutHistory.length,
        plannedSessions: trainingState.profile.daysPerWeek ?? 4,
        totalVolume: Math.round(analytics.volumeTrend.reduce((a, d) => a + d.volume, 0) / 1e3),
        consistency: analytics.recoveryScore,
        phase: currentWeek?.phase ?? "base",
        muscleGroups: analytics.muscleRadar.map((m) => m.muscle),
        goal: onboarding.goal ?? "wellness"
      }, durationInFrames: 420, title: "Compartilhar semana", variant: "ghost" })
    ] }) }),
    macros && /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { initial: {
      opacity: 0,
      y: 18
    }, animate: {
      opacity: 1,
      y: 0
    }, transition: {
      duration: 0.38,
      ease: "easeOut"
    }, className: "rounded-2xl border border-primary/20 bg-surface p-5 space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-primary/15", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Flame, { className: "h-4 w-4 text-primary" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display text-base font-semibold", children: copy.customNutrition }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[11px] text-muted-foreground", children: getMacroLabel(onboarding.goal, copy) })
        ] }),
        macros.surplusOrDeficit !== 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: cn("ml-auto shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold", macros.surplusOrDeficit > 0 ? "bg-success/15 text-success" : "bg-destructive/15 text-destructive"), children: [
          macros.surplusOrDeficit > 0 ? "+" : "",
          macros.surplusOrDeficit,
          " kcal"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-baseline gap-2 border-y border-border/50 py-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display text-5xl font-black", style: {
          background: "linear-gradient(135deg,#22d3ee,#3b82f6,#fb923c)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent"
        }, children: macros.target }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold text-muted-foreground", children: copy.kcalDay })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(MacroStat, { label: copy.protein, value: macros.protein, unit: "g", color: "#22d3ee", pct: Math.round(macros.protein * 4 / macros.target * 100) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(MacroStat, { label: copy.carbs, value: macros.carbs, unit: "g", color: "#fb923c", pct: Math.round(macros.carbs * 4 / macros.target * 100) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(MacroStat, { label: copy.fat, value: macros.fat, unit: "g", color: "#a78bfa", pct: Math.round(macros.fat * 9 / macros.target * 100) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2 text-xs", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl bg-elevated p-2.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] uppercase tracking-wider text-muted-foreground", children: copy.bmr }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-display text-base font-bold", children: [
            macros.bmr,
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-medium text-muted-foreground", children: "kcal" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl bg-elevated p-2.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] uppercase tracking-wider text-muted-foreground", children: copy.tdee }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-display text-base font-bold", children: [
            macros.tdee,
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-medium text-muted-foreground", children: "kcal" })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-5 md:grid-cols-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { index: 1, title: copy.blockTitle(periodization.currentWeek), subtitle: copy.blockSubtitle, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 text-sm text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2 text-[10px] uppercase tracking-wider", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded-full bg-cyan/10 px-2 py-1 text-cyan", children: getModalityLabel(periodization.modality, locale) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded-full bg-primary/10 px-2 py-1 text-primary", children: getPhaseLabel(currentWeek?.phase ?? "base", locale) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "rounded-full bg-success/10 px-2 py-1 text-success", children: [
            copy.volumeLabel,
            " ",
            getVolumeBiasLabel(currentWeek?.volumeBias ?? "alto", locale)
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: periodization.summary.shortTerm }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: currentWeek?.emphasis })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { index: 2, title: copy.cycleTitle, subtitle: copy.cycleSubtitle, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 text-sm text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: periodization.summary.mediumTerm }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: periodization.summary.longTerm }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
          copy.recoveryAdjustment,
          " ",
          periodization.adjustments.recoveryBias
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { index: 3, title: copy.volumeChartTitle, subtitle: copy.volumeChartSubtitle, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-52", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AreaChart, { data: analytics.volumeTrend, margin: {
      top: 10,
      right: 0,
      bottom: 0,
      left: -20
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("defs", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("linearGradient", { id: "g1", x1: "0", y1: "0", x2: "0", y2: "1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: "var(--primary)", stopOpacity: 0.6 }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: "var(--primary)", stopOpacity: 0 })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(XAxis, { dataKey: "day", stroke: "var(--muted-foreground)", fontSize: 11, tickLine: false, axisLine: false }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(YAxis, { stroke: "var(--muted-foreground)", fontSize: 11, tickLine: false, axisLine: false }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip, { contentStyle: tooltipStyle }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Area, { type: "monotone", dataKey: "volume", stroke: "var(--primary)", strokeWidth: 2, fill: "url(#g1)" })
    ] }) }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-5 md:grid-cols-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { index: 4, title: copy.muscleTitle, subtitle: copy.muscleSubtitle, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-64", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(RadarChart, { data: analytics.muscleRadar, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(PolarGrid, { stroke: "var(--border)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(PolarAngleAxis, { dataKey: "muscle", tick: {
          fill: "var(--muted-foreground)",
          fontSize: 11
        } }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Radar, { dataKey: "value", stroke: "var(--cyan)", fill: "var(--cyan)", fillOpacity: 0.35 })
      ] }) }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { index: 5, title: "Recovery score", subtitle: copy.recoverySubtitle, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative grid h-64 place-items-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(RadialBarChart, { innerRadius: "70%", outerRadius: "100%", data: [{
          name: "Recovery",
          value: analytics.recoveryScore,
          fill: "var(--cyan)"
        }], startAngle: 90, endAngle: -270, children: /* @__PURE__ */ jsxRuntimeExports.jsx(RadialBar, { background: {
          fill: "var(--elevated)"
        }, dataKey: "value", cornerRadius: 20 }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pointer-events-none absolute inset-0 grid place-items-center text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-display text-4xl font-bold text-gradient-ai", children: [
            analytics.recoveryScore,
            "%"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 text-xs uppercase tracking-widest text-muted-foreground", children: copy.readiness })
        ] }) })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { index: 6, title: copy.frequencyTitle, subtitle: copy.frequencySubtitle, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-44", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(BarChart, { data: analytics.completionTrend, margin: {
      top: 10,
      right: 0,
      bottom: 0,
      left: -20
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(XAxis, { dataKey: "day", stroke: "var(--muted-foreground)", fontSize: 11, tickLine: false, axisLine: false }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(YAxis, { stroke: "var(--muted-foreground)", fontSize: 11, tickLine: false, axisLine: false }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip, { contentStyle: tooltipStyle }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Bar, { dataKey: "completed", fill: "var(--blue-accent)", radius: [8, 8, 0, 0] })
    ] }) }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { index: 7, title: copy.consistencyTitle, subtitle: copy.consistencySubtitle, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-12 gap-1", children: analytics.consistencyHeatmap.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "aspect-square rounded-sm", style: {
      background: `oklch(0.74 0.17 53 / ${0.08 + item.value * 0.18})`
    }, title: copy.consistencyLabel(item.value) }, item.day)) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { index: 8, title: copy.progressionTitle, subtitle: copy.progressionSubtitle, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-3 flex flex-wrap gap-3 text-xs text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(LegendDot, { color: "var(--primary)", label: copy.bench }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(LegendDot, { color: "var(--cyan)", label: copy.squat }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(LegendDot, { color: "var(--blue-accent)", label: copy.deadlift })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-56", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(LineChart, { data: analytics.progressionData, margin: {
        top: 10,
        right: 8,
        bottom: 0,
        left: -20
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CartesianGrid, { stroke: "var(--border)", strokeDasharray: "3 3", vertical: false }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(XAxis, { dataKey: "week", stroke: "var(--muted-foreground)", fontSize: 11, tickLine: false, axisLine: false }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(YAxis, { stroke: "var(--muted-foreground)", fontSize: 11, tickLine: false, axisLine: false }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip, { contentStyle: tooltipStyle }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Line, { type: "monotone", dataKey: "supino", name: copy.bench, stroke: "var(--primary)", strokeWidth: 2, dot: false }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Line, { type: "monotone", dataKey: "agachamento", name: copy.squat, stroke: "var(--cyan)", strokeWidth: 2, dot: false }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Line, { type: "monotone", dataKey: "terra", name: copy.deadlift, stroke: "var(--blue-accent)", strokeWidth: 2, dot: false })
      ] }) }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { index: 9, title: copy.workoutsTitle, subtitle: copy.workoutsSubtitle, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: analytics.workoutHistory.map((workout) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/app/treino/$id", params: {
      id: workout.id
    }, className: "flex items-center gap-3 rounded-xl border border-border bg-elevated/40 p-3 transition hover:border-primary/40 hover:bg-elevated/60", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid h-9 w-9 place-items-center rounded-lg bg-surface", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Dumbbell, { className: "h-4 w-4 text-primary" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "truncate text-sm font-semibold", children: workout.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground", children: [
          workout.date,
          " | ",
          workout.sets,
          " ",
          copy.sets
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-end gap-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-display text-sm font-bold text-gradient-primary", children: [
          (workout.volume / 1e3).toFixed(1),
          "t"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-[10px] text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            workout.duration,
            "min"
          ] }),
          workout.prs > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-0.5 rounded-full bg-primary/15 px-1.5 py-0.5 font-semibold text-primary", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Trophy, { className: "h-2.5 w-2.5" }),
            "+",
            workout.prs,
            " PR"
          ] }) : null
        ] })
      ] })
    ] }, workout.id)) }) })
  ] });
}
function LegendDot({
  color,
  label
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1.5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-2 w-2 rounded-full", style: {
      background: color
    } }),
    label
  ] });
}
function Card({
  title,
  subtitle,
  children,
  index = 0
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { initial: {
    opacity: 0,
    y: 18
  }, animate: {
    opacity: 1,
    y: 0
  }, transition: {
    duration: 0.38,
    delay: (index + 1) * 0.07,
    ease: "easeOut"
  }, className: "rounded-2xl border border-border bg-surface p-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display text-base font-semibold", children: title }),
      subtitle ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: subtitle }) : null
    ] }),
    children
  ] });
}
function MacroStat({
  label,
  value,
  unit,
  color,
  pct
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl bg-elevated p-3 text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] uppercase tracking-wider text-muted-foreground", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-display text-xl font-bold mt-1", style: {
      color
    }, children: [
      value,
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-medium text-muted-foreground ml-0.5", children: unit })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 h-1 w-full overflow-hidden rounded-full bg-background/60", children: /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { initial: {
      width: 0
    }, animate: {
      width: `${Math.min(100, pct)}%`
    }, transition: {
      duration: 0.7,
      ease: "easeOut",
      delay: 0.2
    }, className: "h-full rounded-full", style: {
      background: color
    } }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1 text-[10px] text-muted-foreground", children: [
      pct,
      "%"
    ] })
  ] });
}
export {
  Analytics as component
};