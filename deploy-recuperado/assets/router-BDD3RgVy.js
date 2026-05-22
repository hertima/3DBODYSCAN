import { r as reactExports, f as functionalUpdate$1, a as arraysEqual, c as createLRUCache, i as isPromise, b as isRedirect, d as isNotFound, e as invariant$1, g as createControlledPromise, h as rootRouteId, j as isServer$1, k as compileDecodeCharMap, t as trimPath, l as rewriteBasepath, m as composeRewrites, p as processRouteTree, n as processRouteMasks, o as resolvePath, q as cleanPath, s as trimPathRight, u as parseHref, v as executeRewriteInput, w as isDangerousProtocol, x as redirect, y as findSingleMatch, z as deepEqual, D as DEFAULT_PROTOCOL_ALLOWLIST, A as buildRouteBranch, B as interpolatePath, C as nullReplaceEqualDeep, E as replaceEqualDeep$1, F as last, G as decodePath, H as findFlatMatch, I as findRouteMatch, J as hasKeys, K as executeRewriteOutput, L as encodePathLikeUrl, M as trimPathLeft, N as joinPaths, O as useRouter, P as dummyMatchContext, Q as matchContext, R as getDefaultExportFromCjs, S as requireReactDom, T as exactPathTest, U as removeTrailingSlash, V as React, W as jsxRuntimeExports, X as isModuleNotFoundError, Y as useHydrated, Z as escapeHtml, _ as isInlinableStylesheet, $ as getAssetCrossOrigin, a0 as resolveManifestAssetLink, a1 as Outlet } from "./server-C0e4gypg.js";
import { O as OPENAI_MODEL } from "./openai-config-D_XaIbeQ.js";
var reactUse = reactExports.use;
var useLayoutEffect = typeof window !== "undefined" ? reactExports.useLayoutEffect : reactExports.useEffect;
function useForwardedRef(ref) {
  const innerRef = reactExports.useRef(null);
  reactExports.useImperativeHandle(ref, () => innerRef.current, []);
  return innerRef;
}
function encode(obj, stringify = String) {
  const result = new URLSearchParams();
  for (const key in obj) {
    const val = obj[key];
    if (val !== void 0) result.set(key, stringify(val));
  }
  return result.toString();
}
function toValue(str) {
  if (!str) return "";
  if (str === "false") return false;
  if (str === "true") return true;
  return +str * 0 === 0 && +str + "" === str ? +str : str;
}
function decode(str) {
  const searchParams = new URLSearchParams(str);
  const result = /* @__PURE__ */ Object.create(null);
  for (const [key, value] of searchParams.entries()) {
    const previousValue = result[key];
    if (previousValue == null) result[key] = toValue(value);
    else if (Array.isArray(previousValue)) previousValue.push(toValue(value));
    else result[key] = [previousValue, toValue(value)];
  }
  return result;
}
const defaultParseSearch = parseSearchWith(JSON.parse);
const defaultStringifySearch = stringifySearchWith(JSON.stringify, JSON.parse);
function parseSearchWith(parser) {
  return (searchStr) => {
    if (searchStr[0] === "?") searchStr = searchStr.substring(1);
    const query = decode(searchStr);
    for (const key in query) {
      const value = query[key];
      if (typeof value === "string") try {
        query[key] = parser(value);
      } catch (_err) {
      }
    }
    return query;
  };
}
function stringifySearchWith(stringify, parser) {
  const hasParser = typeof parser === "function";
  function stringifyValue(val) {
    if (typeof val === "object" && val !== null) try {
      return stringify(val);
    } catch (_err) {
    }
    else if (hasParser && typeof val === "string") try {
      parser(val);
      return stringify(val);
    } catch (_err) {
    }
    return val;
  }
  return (search) => {
    const searchStr = encode(search, stringifyValue);
    return searchStr ? `?${searchStr}` : "";
  };
}
function createNonReactiveMutableStore(initialValue) {
  let value = initialValue;
  return {
    get() {
      return value;
    },
    set(nextOrUpdater) {
      value = functionalUpdate$1(nextOrUpdater, value);
    }
  };
}
function createNonReactiveReadonlyStore(read) {
  return { get() {
    return read();
  } };
}
function createRouterStores(initialState, config) {
  const { createMutableStore, createReadonlyStore, batch, init } = config;
  const matchStores = /* @__PURE__ */ new Map();
  const pendingMatchStores = /* @__PURE__ */ new Map();
  const cachedMatchStores = /* @__PURE__ */ new Map();
  const status = createMutableStore(initialState.status);
  const loadedAt = createMutableStore(initialState.loadedAt);
  const isLoading = createMutableStore(initialState.isLoading);
  const isTransitioning = createMutableStore(initialState.isTransitioning);
  const location = createMutableStore(initialState.location);
  const resolvedLocation = createMutableStore(initialState.resolvedLocation);
  const statusCode = createMutableStore(initialState.statusCode);
  const redirect2 = createMutableStore(initialState.redirect);
  const matchesId = createMutableStore([]);
  const pendingIds = createMutableStore([]);
  const cachedIds = createMutableStore([]);
  const matches = createReadonlyStore(() => readPoolMatches(matchStores, matchesId.get()));
  const pendingMatches = createReadonlyStore(() => readPoolMatches(pendingMatchStores, pendingIds.get()));
  const cachedMatches = createReadonlyStore(() => readPoolMatches(cachedMatchStores, cachedIds.get()));
  const firstId = createReadonlyStore(() => matchesId.get()[0]);
  const hasPending = createReadonlyStore(() => matchesId.get().some((matchId) => {
    return matchStores.get(matchId)?.get().status === "pending";
  }));
  const matchRouteDeps = createReadonlyStore(() => ({
    locationHref: location.get().href,
    resolvedLocationHref: resolvedLocation.get()?.href,
    status: status.get()
  }));
  const __store = createReadonlyStore(() => ({
    status: status.get(),
    loadedAt: loadedAt.get(),
    isLoading: isLoading.get(),
    isTransitioning: isTransitioning.get(),
    matches: matches.get(),
    location: location.get(),
    resolvedLocation: resolvedLocation.get(),
    statusCode: statusCode.get(),
    redirect: redirect2.get()
  }));
  const matchStoreByRouteIdCache = createLRUCache(64);
  function getRouteMatchStore(routeId) {
    let cached = matchStoreByRouteIdCache.get(routeId);
    if (!cached) {
      cached = createReadonlyStore(() => {
        const ids = matchesId.get();
        for (const id2 of ids) {
          const matchStore = matchStores.get(id2);
          if (matchStore && matchStore.routeId === routeId) return matchStore.get();
        }
      });
      matchStoreByRouteIdCache.set(routeId, cached);
    }
    return cached;
  }
  const store = {
    status,
    loadedAt,
    isLoading,
    isTransitioning,
    location,
    resolvedLocation,
    statusCode,
    redirect: redirect2,
    matchesId,
    pendingIds,
    cachedIds,
    matches,
    pendingMatches,
    cachedMatches,
    firstId,
    hasPending,
    matchRouteDeps,
    matchStores,
    pendingMatchStores,
    cachedMatchStores,
    __store,
    getRouteMatchStore,
    setMatches,
    setPending,
    setCached
  };
  setMatches(initialState.matches);
  init?.(store);
  function setMatches(nextMatches) {
    reconcileMatchPool(nextMatches, matchStores, matchesId, createMutableStore, batch);
  }
  function setPending(nextMatches) {
    reconcileMatchPool(nextMatches, pendingMatchStores, pendingIds, createMutableStore, batch);
  }
  function setCached(nextMatches) {
    reconcileMatchPool(nextMatches, cachedMatchStores, cachedIds, createMutableStore, batch);
  }
  return store;
}
function readPoolMatches(pool, ids) {
  const matches = [];
  for (const id2 of ids) {
    const matchStore = pool.get(id2);
    if (matchStore) matches.push(matchStore.get());
  }
  return matches;
}
function reconcileMatchPool(nextMatches, pool, idStore, createMutableStore, batch) {
  const nextIds = nextMatches.map((d) => d.id);
  const nextIdSet = new Set(nextIds);
  batch(() => {
    for (const id2 of pool.keys()) if (!nextIdSet.has(id2)) pool.delete(id2);
    for (const nextMatch of nextMatches) {
      const existing = pool.get(nextMatch.id);
      if (!existing) {
        const matchStore = createMutableStore(nextMatch);
        matchStore.routeId = nextMatch.routeId;
        pool.set(nextMatch.id, matchStore);
        continue;
      }
      existing.routeId = nextMatch.routeId;
      if (existing.get() !== nextMatch) existing.set(nextMatch);
    }
    if (!arraysEqual(idStore.get(), nextIds)) idStore.set(nextIds);
  });
}
const triggerOnReady = (inner) => {
  if (!inner.rendered) {
    inner.rendered = true;
    return inner.onReady?.();
  }
};
const resolvePreload = (inner, matchId) => {
  return !!(inner.preload && !inner.router.stores.matchStores.has(matchId));
};
const buildMatchContext = (inner, index, includeCurrentMatch = true) => {
  const context = { ...inner.router.options.context ?? {} };
  const end = includeCurrentMatch ? index : index - 1;
  for (let i = 0; i <= end; i++) {
    const innerMatch = inner.matches[i];
    if (!innerMatch) continue;
    const m = inner.router.getMatch(innerMatch.id);
    if (!m) continue;
    Object.assign(context, m.__routeContext, m.__beforeLoadContext);
  }
  return context;
};
const getNotFoundBoundaryIndex = (inner, err) => {
  if (!inner.matches.length) return;
  const requestedRouteId = err.routeId;
  const matchedRootIndex = inner.matches.findIndex((m) => m.routeId === inner.router.routeTree.id);
  const rootIndex = matchedRootIndex >= 0 ? matchedRootIndex : 0;
  let startIndex = requestedRouteId ? inner.matches.findIndex((match) => match.routeId === requestedRouteId) : inner.firstBadMatchIndex ?? inner.matches.length - 1;
  if (startIndex < 0) startIndex = rootIndex;
  for (let i = startIndex; i >= 0; i--) {
    const match = inner.matches[i];
    if (inner.router.looseRoutesById[match.routeId].options.notFoundComponent) return i;
  }
  return requestedRouteId ? startIndex : rootIndex;
};
const handleRedirectAndNotFound = (inner, match, err) => {
  if (!isRedirect(err) && !isNotFound(err)) return;
  if (isRedirect(err) && err.redirectHandled && !err.options.reloadDocument) throw err;
  if (match) {
    match._nonReactive.beforeLoadPromise?.resolve();
    match._nonReactive.loaderPromise?.resolve();
    match._nonReactive.beforeLoadPromise = void 0;
    match._nonReactive.loaderPromise = void 0;
    match._nonReactive.error = err;
    inner.updateMatch(match.id, (prev) => ({
      ...prev,
      status: isRedirect(err) ? "redirected" : isNotFound(err) ? "notFound" : prev.status === "pending" ? "success" : prev.status,
      context: buildMatchContext(inner, match.index),
      isFetching: false,
      error: err
    }));
    if (isNotFound(err) && !err.routeId) err.routeId = match.routeId;
    match._nonReactive.loadPromise?.resolve();
  }
  if (isRedirect(err)) {
    inner.rendered = true;
    err.options._fromLocation = inner.location;
    err.redirectHandled = true;
    err = inner.router.resolveRedirect(err);
  }
  throw err;
};
const shouldSkipLoader = (inner, matchId) => {
  const match = inner.router.getMatch(matchId);
  if (!match) return true;
  if (match.ssr === false) return true;
  return false;
};
const syncMatchContext = (inner, matchId, index) => {
  const nextContext = buildMatchContext(inner, index);
  inner.updateMatch(matchId, (prev) => {
    return {
      ...prev,
      context: nextContext
    };
  });
};
const handleSerialError = (inner, index, err, routerCode) => {
  const { id: matchId, routeId } = inner.matches[index];
  const route = inner.router.looseRoutesById[routeId];
  if (err instanceof Promise) throw err;
  err.routerCode = routerCode;
  inner.firstBadMatchIndex ??= index;
  handleRedirectAndNotFound(inner, inner.router.getMatch(matchId), err);
  try {
    route.options.onError?.(err);
  } catch (errorHandlerErr) {
    err = errorHandlerErr;
    handleRedirectAndNotFound(inner, inner.router.getMatch(matchId), err);
  }
  inner.updateMatch(matchId, (prev) => {
    prev._nonReactive.beforeLoadPromise?.resolve();
    prev._nonReactive.beforeLoadPromise = void 0;
    prev._nonReactive.loadPromise?.resolve();
    return {
      ...prev,
      error: err,
      status: "error",
      isFetching: false,
      updatedAt: Date.now(),
      abortController: new AbortController()
    };
  });
  if (!inner.preload && !isRedirect(err) && !isNotFound(err)) inner.serialError ??= err;
};
const isBeforeLoadSsr = (inner, matchId, index, route) => {
  const existingMatch = inner.router.getMatch(matchId);
  const parentMatchId = inner.matches[index - 1]?.id;
  const parentMatch = parentMatchId ? inner.router.getMatch(parentMatchId) : void 0;
  if (inner.router.isShell()) {
    existingMatch.ssr = route.id === rootRouteId;
    return;
  }
  if (parentMatch?.ssr === false) {
    existingMatch.ssr = false;
    return;
  }
  const parentOverride = (tempSsr2) => {
    if (tempSsr2 === true && parentMatch?.ssr === "data-only") return "data-only";
    return tempSsr2;
  };
  const defaultSsr = inner.router.options.defaultSsr ?? true;
  if (route.options.ssr === void 0) {
    existingMatch.ssr = parentOverride(defaultSsr);
    return;
  }
  if (typeof route.options.ssr !== "function") {
    existingMatch.ssr = parentOverride(route.options.ssr);
    return;
  }
  const { search, params } = existingMatch;
  const ssrFnContext = {
    search: makeMaybe(search, existingMatch.searchError),
    params: makeMaybe(params, existingMatch.paramsError),
    location: inner.location,
    matches: inner.matches.map((match) => ({
      index: match.index,
      pathname: match.pathname,
      fullPath: match.fullPath,
      staticData: match.staticData,
      id: match.id,
      routeId: match.routeId,
      search: makeMaybe(match.search, match.searchError),
      params: makeMaybe(match.params, match.paramsError),
      ssr: match.ssr
    }))
  };
  const tempSsr = route.options.ssr(ssrFnContext);
  if (isPromise(tempSsr)) return tempSsr.then((ssr) => {
    existingMatch.ssr = parentOverride(ssr ?? defaultSsr);
  });
  existingMatch.ssr = parentOverride(tempSsr ?? defaultSsr);
};
const setupPendingTimeout = (inner, matchId, route, match) => {
  if (match._nonReactive.pendingTimeout !== void 0) return;
  const pendingMs = route.options.pendingMs ?? inner.router.options.defaultPendingMs;
  if (!!(inner.onReady && false)) {
    const pendingTimeout = setTimeout(() => {
      triggerOnReady(inner);
    }, pendingMs);
    match._nonReactive.pendingTimeout = pendingTimeout;
  }
};
const preBeforeLoadSetup = (inner, matchId, route) => {
  const existingMatch = inner.router.getMatch(matchId);
  if (!existingMatch._nonReactive.beforeLoadPromise && !existingMatch._nonReactive.loaderPromise) return;
  setupPendingTimeout(inner, matchId, route, existingMatch);
  const then = () => {
    const match = inner.router.getMatch(matchId);
    if (match.preload && (match.status === "redirected" || match.status === "notFound")) handleRedirectAndNotFound(inner, match, match.error);
  };
  return existingMatch._nonReactive.beforeLoadPromise ? existingMatch._nonReactive.beforeLoadPromise.then(then) : then();
};
const executeBeforeLoad = (inner, matchId, index, route) => {
  const match = inner.router.getMatch(matchId);
  let prevLoadPromise = match._nonReactive.loadPromise;
  match._nonReactive.loadPromise = createControlledPromise(() => {
    prevLoadPromise?.resolve();
    prevLoadPromise = void 0;
  });
  const { paramsError, searchError } = match;
  if (paramsError) handleSerialError(inner, index, paramsError, "PARSE_PARAMS");
  if (searchError) handleSerialError(inner, index, searchError, "VALIDATE_SEARCH");
  setupPendingTimeout(inner, matchId, route, match);
  const abortController = new AbortController();
  let isPending = false;
  const pending = () => {
    if (isPending) return;
    isPending = true;
    inner.updateMatch(matchId, (prev) => ({
      ...prev,
      isFetching: "beforeLoad",
      fetchCount: prev.fetchCount + 1,
      abortController
    }));
  };
  const resolve = () => {
    match._nonReactive.beforeLoadPromise?.resolve();
    match._nonReactive.beforeLoadPromise = void 0;
    inner.updateMatch(matchId, (prev) => ({
      ...prev,
      isFetching: false
    }));
  };
  if (!route.options.beforeLoad) {
    inner.router.batch(() => {
      pending();
      resolve();
    });
    return;
  }
  match._nonReactive.beforeLoadPromise = createControlledPromise();
  const context = {
    ...buildMatchContext(inner, index, false),
    ...match.__routeContext
  };
  const { search, params, cause } = match;
  const preload = resolvePreload(inner, matchId);
  const beforeLoadFnContext = {
    search,
    abortController,
    params,
    preload,
    context,
    location: inner.location,
    navigate: (opts) => inner.router.navigate({
      ...opts,
      _fromLocation: inner.location
    }),
    buildLocation: inner.router.buildLocation,
    cause: preload ? "preload" : cause,
    matches: inner.matches,
    routeId: route.id,
    ...inner.router.options.additionalContext
  };
  const updateContext = (beforeLoadContext2) => {
    if (beforeLoadContext2 === void 0) {
      inner.router.batch(() => {
        pending();
        resolve();
      });
      return;
    }
    if (isRedirect(beforeLoadContext2) || isNotFound(beforeLoadContext2)) {
      pending();
      handleSerialError(inner, index, beforeLoadContext2, "BEFORE_LOAD");
    }
    inner.router.batch(() => {
      pending();
      inner.updateMatch(matchId, (prev) => ({
        ...prev,
        __beforeLoadContext: beforeLoadContext2
      }));
      resolve();
    });
  };
  let beforeLoadContext;
  try {
    beforeLoadContext = route.options.beforeLoad(beforeLoadFnContext);
    if (isPromise(beforeLoadContext)) {
      pending();
      return beforeLoadContext.catch((err) => {
        handleSerialError(inner, index, err, "BEFORE_LOAD");
      }).then(updateContext);
    }
  } catch (err) {
    pending();
    handleSerialError(inner, index, err, "BEFORE_LOAD");
  }
  updateContext(beforeLoadContext);
};
const handleBeforeLoad = (inner, index) => {
  const { id: matchId, routeId } = inner.matches[index];
  const route = inner.router.looseRoutesById[routeId];
  const serverSsr = () => {
    {
      const maybePromise = isBeforeLoadSsr(inner, matchId, index, route);
      if (isPromise(maybePromise)) return maybePromise.then(queueExecution);
    }
    return queueExecution();
  };
  const execute = () => executeBeforeLoad(inner, matchId, index, route);
  const queueExecution = () => {
    if (shouldSkipLoader(inner, matchId)) return;
    const result = preBeforeLoadSetup(inner, matchId, route);
    return isPromise(result) ? result.then(execute) : execute();
  };
  return serverSsr();
};
const executeHead = (inner, matchId, route) => {
  const match = inner.router.getMatch(matchId);
  if (!match) return;
  if (!route.options.head && !route.options.scripts && !route.options.headers) return;
  const assetContext = {
    ssr: inner.router.options.ssr,
    matches: inner.matches,
    match,
    params: match.params,
    loaderData: match.loaderData
  };
  return Promise.all([
    route.options.head?.(assetContext),
    route.options.scripts?.(assetContext),
    route.options.headers?.(assetContext)
  ]).then(([headFnContent, scripts, headers]) => {
    return {
      meta: headFnContent?.meta,
      links: headFnContent?.links,
      headScripts: headFnContent?.scripts,
      headers,
      scripts,
      styles: headFnContent?.styles
    };
  });
};
const getLoaderContext = (inner, matchPromises, matchId, index, route) => {
  const parentMatchPromise = matchPromises[index - 1];
  const { params, loaderDeps, abortController, cause } = inner.router.getMatch(matchId);
  const context = buildMatchContext(inner, index);
  const preload = resolvePreload(inner, matchId);
  return {
    params,
    deps: loaderDeps,
    preload: !!preload,
    parentMatchPromise,
    abortController,
    context,
    location: inner.location,
    navigate: (opts) => inner.router.navigate({
      ...opts,
      _fromLocation: inner.location
    }),
    cause: preload ? "preload" : cause,
    route,
    ...inner.router.options.additionalContext
  };
};
const runLoader = async (inner, matchPromises, matchId, index, route) => {
  try {
    const match = inner.router.getMatch(matchId);
    try {
      if (!(isServer$1 ?? inner.router.isServer) || match.ssr === true) loadRouteChunk(route);
      const routeLoader = route.options.loader;
      const loader = typeof routeLoader === "function" ? routeLoader : routeLoader?.handler;
      const loaderResult = loader?.(getLoaderContext(inner, matchPromises, matchId, index, route));
      const loaderResultIsPromise = !!loader && isPromise(loaderResult);
      if (!!(loaderResultIsPromise || route._lazyPromise || route._componentsPromise || route.options.head || route.options.scripts || route.options.headers || match._nonReactive.minPendingPromise)) inner.updateMatch(matchId, (prev) => ({
        ...prev,
        isFetching: "loader"
      }));
      if (loader) {
        const loaderData = loaderResultIsPromise ? await loaderResult : loaderResult;
        handleRedirectAndNotFound(inner, inner.router.getMatch(matchId), loaderData);
        if (loaderData !== void 0) inner.updateMatch(matchId, (prev) => ({
          ...prev,
          loaderData
        }));
      }
      if (route._lazyPromise) await route._lazyPromise;
      const pendingPromise = match._nonReactive.minPendingPromise;
      if (pendingPromise) await pendingPromise;
      if (route._componentsPromise) await route._componentsPromise;
      inner.updateMatch(matchId, (prev) => ({
        ...prev,
        error: void 0,
        context: buildMatchContext(inner, index),
        status: "success",
        isFetching: false,
        updatedAt: Date.now()
      }));
    } catch (e) {
      let error = e;
      if (error?.name === "AbortError") {
        if (match.abortController.signal.aborted) {
          match._nonReactive.loaderPromise?.resolve();
          match._nonReactive.loaderPromise = void 0;
          return;
        }
        inner.updateMatch(matchId, (prev) => ({
          ...prev,
          status: prev.status === "pending" ? "success" : prev.status,
          isFetching: false,
          context: buildMatchContext(inner, index)
        }));
        return;
      }
      const pendingPromise = match._nonReactive.minPendingPromise;
      if (pendingPromise) await pendingPromise;
      if (isNotFound(e)) await route.options.notFoundComponent?.preload?.();
      handleRedirectAndNotFound(inner, inner.router.getMatch(matchId), e);
      try {
        route.options.onError?.(e);
      } catch (onErrorError) {
        error = onErrorError;
        handleRedirectAndNotFound(inner, inner.router.getMatch(matchId), onErrorError);
      }
      if (!isRedirect(error) && !isNotFound(error)) await loadRouteChunk(route, ["errorComponent"]);
      inner.updateMatch(matchId, (prev) => ({
        ...prev,
        error,
        context: buildMatchContext(inner, index),
        status: "error",
        isFetching: false
      }));
    }
  } catch (err) {
    const match = inner.router.getMatch(matchId);
    if (match) match._nonReactive.loaderPromise = void 0;
    handleRedirectAndNotFound(inner, match, err);
  }
};
const loadRouteMatch = async (inner, matchPromises, index) => {
  async function handleLoader(preload, prevMatch, previousRouteMatchId, match2, route2) {
    const age = Date.now() - prevMatch.updatedAt;
    const staleAge = preload ? route2.options.preloadStaleTime ?? inner.router.options.defaultPreloadStaleTime ?? 3e4 : route2.options.staleTime ?? inner.router.options.defaultStaleTime ?? 0;
    const shouldReloadOption = route2.options.shouldReload;
    const shouldReload = typeof shouldReloadOption === "function" ? shouldReloadOption(getLoaderContext(inner, matchPromises, matchId, index, route2)) : shouldReloadOption;
    const { status, invalid } = match2;
    const staleMatchShouldReload = age >= staleAge && (!!inner.forceStaleReload || match2.cause === "enter" || previousRouteMatchId !== void 0 && previousRouteMatchId !== match2.id);
    loaderShouldRunAsync = status === "success" && (invalid || (shouldReload ?? staleMatchShouldReload));
    if (preload && route2.options.preload === false) ;
    else if (loaderShouldRunAsync && !inner.sync && shouldReloadInBackground) {
      loaderIsRunningAsync = true;
      (async () => {
        try {
          await runLoader(inner, matchPromises, matchId, index, route2);
          const match3 = inner.router.getMatch(matchId);
          match3._nonReactive.loaderPromise?.resolve();
          match3._nonReactive.loadPromise?.resolve();
          match3._nonReactive.loaderPromise = void 0;
          match3._nonReactive.loadPromise = void 0;
        } catch (err) {
          if (isRedirect(err)) await inner.router.navigate(err.options);
        }
      })();
    } else if (status !== "success" || loaderShouldRunAsync) await runLoader(inner, matchPromises, matchId, index, route2);
    else syncMatchContext(inner, matchId, index);
  }
  const { id: matchId, routeId } = inner.matches[index];
  let loaderShouldRunAsync = false;
  let loaderIsRunningAsync = false;
  const route = inner.router.looseRoutesById[routeId];
  const routeLoader = route.options.loader;
  const shouldReloadInBackground = ((typeof routeLoader === "function" ? void 0 : routeLoader?.staleReloadMode) ?? inner.router.options.defaultStaleReloadMode) !== "blocking";
  if (shouldSkipLoader(inner, matchId)) {
    if (!inner.router.getMatch(matchId)) return inner.matches[index];
    syncMatchContext(inner, matchId, index);
    return inner.router.getMatch(matchId);
  } else {
    const prevMatch = inner.router.getMatch(matchId);
    const activeIdAtIndex = inner.router.stores.matchesId.get()[index];
    const previousRouteMatchId = (activeIdAtIndex && inner.router.stores.matchStores.get(activeIdAtIndex) || null)?.routeId === routeId ? activeIdAtIndex : inner.router.stores.matches.get().find((d) => d.routeId === routeId)?.id;
    const preload = resolvePreload(inner, matchId);
    if (prevMatch._nonReactive.loaderPromise) {
      if (prevMatch.status === "success" && !inner.sync && !prevMatch.preload && shouldReloadInBackground) return prevMatch;
      await prevMatch._nonReactive.loaderPromise;
      const match2 = inner.router.getMatch(matchId);
      const error = match2._nonReactive.error || match2.error;
      if (error) handleRedirectAndNotFound(inner, match2, error);
      if (match2.status === "pending") await handleLoader(preload, prevMatch, previousRouteMatchId, match2, route);
    } else {
      const nextPreload = preload && !inner.router.stores.matchStores.has(matchId);
      const match2 = inner.router.getMatch(matchId);
      match2._nonReactive.loaderPromise = createControlledPromise();
      if (nextPreload !== match2.preload) inner.updateMatch(matchId, (prev) => ({
        ...prev,
        preload: nextPreload
      }));
      await handleLoader(preload, prevMatch, previousRouteMatchId, match2, route);
    }
  }
  const match = inner.router.getMatch(matchId);
  if (!loaderIsRunningAsync) {
    match._nonReactive.loaderPromise?.resolve();
    match._nonReactive.loadPromise?.resolve();
    match._nonReactive.loadPromise = void 0;
  }
  clearTimeout(match._nonReactive.pendingTimeout);
  match._nonReactive.pendingTimeout = void 0;
  if (!loaderIsRunningAsync) match._nonReactive.loaderPromise = void 0;
  match._nonReactive.dehydrated = void 0;
  const nextIsFetching = loaderIsRunningAsync ? match.isFetching : false;
  if (nextIsFetching !== match.isFetching || match.invalid !== false) {
    inner.updateMatch(matchId, (prev) => ({
      ...prev,
      isFetching: nextIsFetching,
      invalid: false
    }));
    return inner.router.getMatch(matchId);
  } else return match;
};
async function loadMatches(arg) {
  const inner = arg;
  const matchPromises = [];
  let beforeLoadNotFound;
  for (let i = 0; i < inner.matches.length; i++) {
    try {
      const beforeLoad = handleBeforeLoad(inner, i);
      if (isPromise(beforeLoad)) await beforeLoad;
    } catch (err) {
      if (isRedirect(err)) throw err;
      if (isNotFound(err)) beforeLoadNotFound = err;
      else if (!inner.preload) throw err;
      break;
    }
    if (inner.serialError || inner.firstBadMatchIndex != null) break;
  }
  const baseMaxIndexExclusive = inner.firstBadMatchIndex ?? inner.matches.length;
  const boundaryIndex = beforeLoadNotFound && !inner.preload ? getNotFoundBoundaryIndex(inner, beforeLoadNotFound) : void 0;
  const maxIndexExclusive = beforeLoadNotFound && inner.preload ? 0 : boundaryIndex !== void 0 ? Math.min(boundaryIndex + 1, baseMaxIndexExclusive) : baseMaxIndexExclusive;
  let firstNotFound;
  let firstUnhandledRejection;
  for (let i = 0; i < maxIndexExclusive; i++) matchPromises.push(loadRouteMatch(inner, matchPromises, i));
  try {
    await Promise.all(matchPromises);
  } catch {
    const settled = await Promise.allSettled(matchPromises);
    for (const result of settled) {
      if (result.status !== "rejected") continue;
      const reason = result.reason;
      if (isRedirect(reason)) throw reason;
      if (isNotFound(reason)) firstNotFound ??= reason;
      else firstUnhandledRejection ??= reason;
    }
    if (firstUnhandledRejection !== void 0) throw firstUnhandledRejection;
  }
  const notFoundToThrow = firstNotFound ?? (beforeLoadNotFound && !inner.preload ? beforeLoadNotFound : void 0);
  let headMaxIndex = inner.firstBadMatchIndex !== void 0 ? inner.firstBadMatchIndex : inner.matches.length - 1;
  if (!notFoundToThrow && beforeLoadNotFound && inner.preload) return inner.matches;
  if (notFoundToThrow) {
    const renderedBoundaryIndex = getNotFoundBoundaryIndex(inner, notFoundToThrow);
    if (renderedBoundaryIndex === void 0) {
      invariant$1();
    }
    const boundaryMatch = inner.matches[renderedBoundaryIndex];
    const boundaryRoute = inner.router.looseRoutesById[boundaryMatch.routeId];
    const defaultNotFoundComponent = inner.router.options?.defaultNotFoundComponent;
    if (!boundaryRoute.options.notFoundComponent && defaultNotFoundComponent) boundaryRoute.options.notFoundComponent = defaultNotFoundComponent;
    notFoundToThrow.routeId = boundaryMatch.routeId;
    const boundaryIsRoot = boundaryMatch.routeId === inner.router.routeTree.id;
    inner.updateMatch(boundaryMatch.id, (prev) => ({
      ...prev,
      ...boundaryIsRoot ? {
        status: "success",
        globalNotFound: true,
        error: void 0
      } : {
        status: "notFound",
        error: notFoundToThrow
      },
      isFetching: false
    }));
    headMaxIndex = renderedBoundaryIndex;
    await loadRouteChunk(boundaryRoute, ["notFoundComponent"]);
  } else if (!inner.preload) {
    const rootMatch = inner.matches[0];
    if (!rootMatch.globalNotFound) {
      if (inner.router.getMatch(rootMatch.id)?.globalNotFound) inner.updateMatch(rootMatch.id, (prev) => ({
        ...prev,
        globalNotFound: false,
        error: void 0
      }));
    }
  }
  if (inner.serialError && inner.firstBadMatchIndex !== void 0) {
    const errorRoute = inner.router.looseRoutesById[inner.matches[inner.firstBadMatchIndex].routeId];
    await loadRouteChunk(errorRoute, ["errorComponent"]);
  }
  for (let i = 0; i <= headMaxIndex; i++) {
    const { id: matchId, routeId } = inner.matches[i];
    const route = inner.router.looseRoutesById[routeId];
    try {
      const headResult = executeHead(inner, matchId, route);
      if (headResult) {
        const head = await headResult;
        inner.updateMatch(matchId, (prev) => ({
          ...prev,
          ...head
        }));
      }
    } catch (err) {
      console.error(`Error executing head for route ${routeId}:`, err);
    }
  }
  const readyPromise = triggerOnReady(inner);
  if (isPromise(readyPromise)) await readyPromise;
  if (notFoundToThrow) throw notFoundToThrow;
  if (inner.serialError && !inner.preload && !inner.onReady) throw inner.serialError;
  return inner.matches;
}
function preloadRouteComponents(route, componentTypesToLoad) {
  const preloads = componentTypesToLoad.map((type) => route.options[type]?.preload?.()).filter(Boolean);
  if (preloads.length === 0) return void 0;
  return Promise.all(preloads);
}
function loadRouteChunk(route, componentTypesToLoad = componentTypes) {
  if (!route._lazyLoaded && route._lazyPromise === void 0) if (route.lazyFn) route._lazyPromise = route.lazyFn().then((lazyRoute) => {
    const { id: _id, ...options } = lazyRoute.options;
    Object.assign(route.options, options);
    route._lazyLoaded = true;
    route._lazyPromise = void 0;
  });
  else route._lazyLoaded = true;
  const runAfterLazy = () => route._componentsLoaded ? void 0 : componentTypesToLoad === componentTypes ? (() => {
    if (route._componentsPromise === void 0) {
      const componentsPromise = preloadRouteComponents(route, componentTypes);
      if (componentsPromise) route._componentsPromise = componentsPromise.then(() => {
        route._componentsLoaded = true;
        route._componentsPromise = void 0;
      });
      else route._componentsLoaded = true;
    }
    return route._componentsPromise;
  })() : preloadRouteComponents(route, componentTypesToLoad);
  return route._lazyPromise ? route._lazyPromise.then(runAfterLazy) : runAfterLazy();
}
function makeMaybe(value, error) {
  if (error) return {
    status: "error",
    error
  };
  return {
    status: "success",
    value
  };
}
function routeNeedsPreload(route) {
  for (const componentType of componentTypes) if (route.options[componentType]?.preload) return true;
  return false;
}
const componentTypes = [
  "component",
  "errorComponent",
  "pendingComponent",
  "notFoundComponent"
];
function getLocationChangeInfo(location, resolvedLocation) {
  const fromLocation = resolvedLocation;
  const toLocation = location;
  return {
    fromLocation,
    toLocation,
    pathChanged: fromLocation?.pathname !== toLocation.pathname,
    hrefChanged: fromLocation?.href !== toLocation.href,
    hashChanged: fromLocation?.hash !== toLocation.hash
  };
}
var RouterCore = class {
  /**
  * @deprecated Use the `createRouter` function instead
  */
  constructor(options, getStoreConfig) {
    this.tempLocationKey = `${Math.round(Math.random() * 1e7)}`;
    this.resetNextScroll = true;
    this.shouldViewTransition = void 0;
    this.isViewTransitionTypesSupported = void 0;
    this.subscribers = /* @__PURE__ */ new Set();
    this.isScrollRestoring = false;
    this.isScrollRestorationSetup = false;
    this.routeBranchCache = /* @__PURE__ */ new WeakMap();
    this.startTransition = (fn) => fn();
    this.update = (newOptions) => {
      const prevOptions = this.options;
      const prevBasepath = this.basepath ?? prevOptions?.basepath ?? "/";
      const basepathWasUnset = this.basepath === void 0;
      const prevRewriteOption = prevOptions?.rewrite;
      this.options = {
        ...prevOptions,
        ...newOptions
      };
      this.isServer = this.options.isServer ?? typeof document === "undefined";
      this.protocolAllowlist = new Set(this.options.protocolAllowlist);
      if (this.options.pathParamsAllowedCharacters) this.pathParamsDecoder = compileDecodeCharMap(this.options.pathParamsAllowedCharacters);
      if (!this.history || this.options.history && this.options.history !== this.history) if (!this.options.history) ;
      else this.history = this.options.history;
      this.origin = this.options.origin;
      if (!this.origin) this.origin = "http://localhost";
      if (this.history) this.updateLatestLocation();
      if (this.options.routeTree !== this.routeTree) {
        this.routeTree = this.options.routeTree;
        let processRouteTreeResult;
        if (globalThis.__TSR_CACHE__ && globalThis.__TSR_CACHE__.routeTree === this.routeTree) {
          const cached = globalThis.__TSR_CACHE__;
          this.resolvePathCache = cached.resolvePathCache;
          processRouteTreeResult = cached.processRouteTreeResult;
        } else {
          this.resolvePathCache = createLRUCache(1e3);
          processRouteTreeResult = this.buildRouteTree();
          if (globalThis.__TSR_CACHE__ === void 0) globalThis.__TSR_CACHE__ = {
            routeTree: this.routeTree,
            processRouteTreeResult,
            resolvePathCache: this.resolvePathCache
          };
        }
        this.setRoutes(processRouteTreeResult);
      }
      if (!this.stores && this.latestLocation) {
        const config = this.getStoreConfig(this);
        this.batch = config.batch;
        this.stores = createRouterStores(getInitialRouterState(this.latestLocation), config);
      }
      let needsLocationUpdate = false;
      const nextBasepath = this.options.basepath ?? "/";
      const nextRewriteOption = this.options.rewrite;
      if (basepathWasUnset || prevBasepath !== nextBasepath || prevRewriteOption !== nextRewriteOption) {
        this.basepath = nextBasepath;
        const rewrites = [];
        const trimmed = trimPath(nextBasepath);
        if (trimmed && trimmed !== "/") rewrites.push(rewriteBasepath({ basepath: nextBasepath }));
        if (nextRewriteOption) rewrites.push(nextRewriteOption);
        this.rewrite = rewrites.length === 0 ? void 0 : rewrites.length === 1 ? rewrites[0] : composeRewrites(rewrites);
        if (this.history) this.updateLatestLocation();
        needsLocationUpdate = true;
      }
      if (needsLocationUpdate && this.stores) this.stores.location.set(this.latestLocation);
      if (typeof window !== "undefined" && "CSS" in window && typeof window.CSS?.supports === "function") this.isViewTransitionTypesSupported = window.CSS.supports("selector(:active-view-transition-type(a)");
    };
    this.updateLatestLocation = () => {
      this.latestLocation = this.parseLocation(this.history.location, this.latestLocation);
    };
    this.buildRouteTree = () => {
      const result = processRouteTree(this.routeTree, this.options.caseSensitive, (route, i) => {
        route.init({ originalIndex: i });
      });
      if (this.options.routeMasks) processRouteMasks(this.options.routeMasks, result.processedTree);
      return result;
    };
    this.subscribe = (eventType, fn) => {
      const listener = {
        eventType,
        fn
      };
      this.subscribers.add(listener);
      return () => {
        this.subscribers.delete(listener);
      };
    };
    this.emit = (routerEvent) => {
      this.subscribers.forEach((listener) => {
        if (listener.eventType === routerEvent.type) listener.fn(routerEvent);
      });
    };
    this.parseLocation = (locationToParse, previousLocation) => {
      const parse = ({ pathname, search, hash, href, state }) => {
        if (!this.rewrite && !/[ \x00-\x1f\x7f\u0080-\uffff]/.test(pathname)) {
          const parsedSearch2 = this.options.parseSearch(search);
          const searchStr2 = this.options.stringifySearch(parsedSearch2);
          return {
            href: pathname + searchStr2 + hash,
            publicHref: pathname + searchStr2 + hash,
            pathname: decodePath(pathname).path,
            external: false,
            searchStr: searchStr2,
            search: nullReplaceEqualDeep(previousLocation?.search, parsedSearch2),
            hash: decodePath(hash.slice(1)).path,
            state: replaceEqualDeep$1(previousLocation?.state, state)
          };
        }
        const fullUrl = new URL(href, this.origin);
        const url = executeRewriteInput(this.rewrite, fullUrl);
        const parsedSearch = this.options.parseSearch(url.search);
        const searchStr = this.options.stringifySearch(parsedSearch);
        url.search = searchStr;
        return {
          href: url.href.replace(url.origin, ""),
          publicHref: href,
          pathname: decodePath(url.pathname).path,
          external: !!this.rewrite && url.origin !== this.origin,
          searchStr,
          search: nullReplaceEqualDeep(previousLocation?.search, parsedSearch),
          hash: decodePath(url.hash.slice(1)).path,
          state: replaceEqualDeep$1(previousLocation?.state, state)
        };
      };
      const location = parse(locationToParse);
      const { __tempLocation, __tempKey } = location.state;
      if (__tempLocation && (!__tempKey || __tempKey === this.tempLocationKey)) {
        const parsedTempLocation = parse(__tempLocation);
        parsedTempLocation.state.key = location.state.key;
        parsedTempLocation.state.__TSR_key = location.state.__TSR_key;
        delete parsedTempLocation.state.__tempLocation;
        return {
          ...parsedTempLocation,
          maskedLocation: location
        };
      }
      return location;
    };
    this.resolvePathWithBase = (from, path) => {
      return resolvePath({
        base: from,
        to: path.includes("//") ? cleanPath(path) : path,
        trailingSlash: this.options.trailingSlash,
        cache: this.resolvePathCache
      });
    };
    this.matchRoutes = (pathnameOrNext, locationSearchOrOpts, opts) => {
      if (typeof pathnameOrNext === "string") return this.matchRoutesInternal({
        pathname: pathnameOrNext,
        search: locationSearchOrOpts
      }, opts);
      return this.matchRoutesInternal(pathnameOrNext, locationSearchOrOpts);
    };
    this.getMatchedRoutes = (pathname) => {
      return getMatchedRoutes({
        pathname,
        routesById: this.routesById,
        processedTree: this.processedTree
      });
    };
    this.cancelMatch = (id2) => {
      const match = this.getMatch(id2);
      if (!match) return;
      match.abortController.abort();
      clearTimeout(match._nonReactive.pendingTimeout);
      match._nonReactive.pendingTimeout = void 0;
    };
    this.cancelMatches = () => {
      this.stores.pendingIds.get().forEach((matchId) => {
        this.cancelMatch(matchId);
      });
      this.stores.matchesId.get().forEach((matchId) => {
        if (this.stores.pendingMatchStores.has(matchId)) return;
        const match = this.stores.matchStores.get(matchId)?.get();
        if (!match) return;
        if (match.status === "pending" || match.isFetching === "loader") this.cancelMatch(matchId);
      });
    };
    this.buildLocation = (opts) => {
      const build = (dest = {}) => {
        const currentLocation = dest._fromLocation || this.pendingBuiltLocation || this.latestLocation;
        const lightweightResult = this.matchRoutesLightweight(currentLocation);
        if (dest.from && false) ;
        const defaultedFromPath = dest.unsafeRelative === "path" ? currentLocation.pathname : dest.from ?? lightweightResult.fullPath;
        const destTo = dest.to ? `${dest.to}` : void 0;
        const fromSearch = lightweightResult.search;
        const fromParams = Object.assign(/* @__PURE__ */ Object.create(null), lightweightResult.params);
        const sourcePath = destTo?.charCodeAt(0) === 47 ? "/" : this.resolvePathWithBase(defaultedFromPath, ".");
        const nextTo = destTo ? this.resolvePathWithBase(sourcePath, destTo) : sourcePath;
        const nextParams = dest.params === false || dest.params === null ? /* @__PURE__ */ Object.create(null) : (dest.params ?? true) === true ? fromParams : Object.assign(fromParams, functionalUpdate$1(dest.params, fromParams));
        const destRoute = this.routesByPath[trimPathRight(nextTo)];
        let destRoutes;
        if (destRoute) destRoutes = this.getRouteBranch(destRoute);
        else if (nextTo.includes("$")) destRoutes = [];
        else {
          const destMatchResult = this.getMatchedRoutes(nextTo);
          destRoutes = destMatchResult.matchedRoutes;
          if (this.options.notFoundRoute && (!destMatchResult.foundRoute || destMatchResult.foundRoute.path !== "/" && destMatchResult.routeParams["**"])) destRoutes = [...destRoutes, this.options.notFoundRoute];
        }
        if (destRoutes.length && hasKeys(nextParams)) for (const route of destRoutes) {
          const fn = route.options.params?.stringify ?? route.options.stringifyParams;
          if (fn) try {
            Object.assign(nextParams, fn(nextParams));
          } catch {
          }
        }
        const nextPathname = opts.leaveParams ? nextTo : decodePath(interpolatePath({
          path: nextTo,
          params: nextParams,
          decoder: this.pathParamsDecoder,
          server: this.isServer
        }).interpolatedPath).path;
        let nextSearch = fromSearch;
        if (opts._includeValidateSearch && this.options.search?.strict) {
          const validatedSearch = {};
          destRoutes.forEach((route) => {
            if (route.options.validateSearch) try {
              Object.assign(validatedSearch, validateSearch(route.options.validateSearch, {
                ...validatedSearch,
                ...nextSearch
              }));
            } catch {
            }
          });
          nextSearch = validatedSearch;
        }
        nextSearch = applySearchMiddleware({
          search: nextSearch,
          dest,
          destRoutes,
          _includeValidateSearch: opts._includeValidateSearch
        });
        nextSearch = nullReplaceEqualDeep(fromSearch, nextSearch);
        const searchStr = this.options.stringifySearch(nextSearch);
        const hash = dest.hash === true ? currentLocation.hash : dest.hash ? functionalUpdate$1(dest.hash, currentLocation.hash) : void 0;
        const hashStr = hash ? `#${hash}` : "";
        let nextState = dest.state === true ? currentLocation.state : dest.state ? functionalUpdate$1(dest.state, currentLocation.state) : {};
        nextState = replaceEqualDeep$1(currentLocation.state, nextState);
        const fullPath = `${nextPathname}${searchStr}${hashStr}`;
        let href;
        let publicHref;
        let external = false;
        if (this.rewrite) {
          const url = new URL(fullPath, this.origin);
          const rewrittenUrl = executeRewriteOutput(this.rewrite, url);
          href = url.href.replace(url.origin, "");
          if (rewrittenUrl.origin !== this.origin) {
            publicHref = rewrittenUrl.href;
            external = true;
          } else publicHref = rewrittenUrl.pathname + rewrittenUrl.search + rewrittenUrl.hash;
        } else {
          href = encodePathLikeUrl(fullPath);
          publicHref = href;
        }
        return {
          publicHref,
          href,
          pathname: nextPathname,
          search: nextSearch,
          searchStr,
          state: nextState,
          hash: hash ?? "",
          external,
          unmaskOnReload: dest.unmaskOnReload
        };
      };
      const buildWithMatches = (dest = {}, maskedDest) => {
        const next = build(dest);
        let maskedNext = maskedDest ? build(maskedDest) : void 0;
        if (!maskedNext) {
          const params = /* @__PURE__ */ Object.create(null);
          if (this.options.routeMasks) {
            const match = findFlatMatch(next.pathname, this.processedTree);
            if (match) {
              Object.assign(params, match.rawParams);
              const { from: _from, params: maskParams, ...maskProps } = match.route;
              const nextParams = maskParams === false || maskParams === null ? /* @__PURE__ */ Object.create(null) : (maskParams ?? true) === true ? params : Object.assign(params, functionalUpdate$1(maskParams, params));
              maskedDest = {
                from: opts.from,
                ...maskProps,
                params: nextParams
              };
              maskedNext = build(maskedDest);
            }
          }
        }
        if (maskedNext) next.maskedLocation = maskedNext;
        return next;
      };
      if (opts.mask) return buildWithMatches(opts, {
        from: opts.from,
        ...opts.mask
      });
      return buildWithMatches(opts);
    };
    this.commitLocation = async ({ viewTransition, ignoreBlocker, ...next }) => {
      const isSameState = () => {
        const ignoredProps = [
          "key",
          "__TSR_key",
          "__TSR_index",
          "__hashScrollIntoViewOptions"
        ];
        ignoredProps.forEach((prop) => {
          next.state[prop] = this.latestLocation.state[prop];
        });
        const isEqual = deepEqual(next.state, this.latestLocation.state);
        ignoredProps.forEach((prop) => {
          delete next.state[prop];
        });
        return isEqual;
      };
      const isSameUrl = trimPathRight(this.latestLocation.href) === trimPathRight(next.href);
      let previousCommitPromise = this.commitLocationPromise;
      this.commitLocationPromise = createControlledPromise(() => {
        previousCommitPromise?.resolve();
        previousCommitPromise = void 0;
      });
      if (isSameUrl && isSameState()) this.load();
      else {
        let { maskedLocation, hashScrollIntoView, ...nextHistory } = next;
        if (maskedLocation) {
          nextHistory = {
            ...maskedLocation,
            state: {
              ...maskedLocation.state,
              __tempKey: void 0,
              __tempLocation: {
                ...nextHistory,
                search: nextHistory.searchStr,
                state: {
                  ...nextHistory.state,
                  __tempKey: void 0,
                  __tempLocation: void 0,
                  __TSR_key: void 0,
                  key: void 0
                }
              }
            }
          };
          if (nextHistory.unmaskOnReload ?? this.options.unmaskOnReload ?? false) nextHistory.state.__tempKey = this.tempLocationKey;
        }
        nextHistory.state.__hashScrollIntoViewOptions = hashScrollIntoView ?? this.options.defaultHashScrollIntoView ?? true;
        this.shouldViewTransition = viewTransition;
        this.history[next.replace ? "replace" : "push"](nextHistory.publicHref, nextHistory.state, { ignoreBlocker });
      }
      this.resetNextScroll = next.resetScroll ?? true;
      if (!this.history.subscribers.size) this.load();
      return this.commitLocationPromise;
    };
    this.buildAndCommitLocation = ({ replace, resetScroll, hashScrollIntoView, viewTransition, ignoreBlocker, href, ...rest } = {}) => {
      if (href) {
        const currentIndex = this.history.location.state.__TSR_index;
        const parsed = parseHref(href, { __TSR_index: replace ? currentIndex : currentIndex + 1 });
        const hrefUrl = new URL(parsed.pathname, this.origin);
        rest.to = executeRewriteInput(this.rewrite, hrefUrl).pathname;
        rest.search = this.options.parseSearch(parsed.search);
        rest.hash = parsed.hash.slice(1);
      }
      const location = this.buildLocation({
        ...rest,
        _includeValidateSearch: true
      });
      this.pendingBuiltLocation = location;
      const commitPromise = this.commitLocation({
        ...location,
        viewTransition,
        replace,
        resetScroll,
        hashScrollIntoView,
        ignoreBlocker
      });
      Promise.resolve().then(() => {
        if (this.pendingBuiltLocation === location) this.pendingBuiltLocation = void 0;
      });
      return commitPromise;
    };
    this.navigate = async ({ to, reloadDocument, href, publicHref, ...rest }) => {
      let hrefIsUrl = false;
      if (href) try {
        new URL(`${href}`);
        hrefIsUrl = true;
      } catch {
      }
      if (hrefIsUrl && !reloadDocument) reloadDocument = true;
      if (reloadDocument) {
        if (to !== void 0 || !href) {
          const location = this.buildLocation({
            to,
            ...rest
          });
          href = href ?? location.publicHref;
          publicHref = publicHref ?? location.publicHref;
        }
        const reloadHref = !hrefIsUrl && publicHref ? publicHref : href;
        if (isDangerousProtocol(reloadHref, this.protocolAllowlist)) {
          return Promise.resolve();
        }
        if (!rest.ignoreBlocker) {
          const blockers = this.history.getBlockers?.() ?? [];
          for (const blocker of blockers) if (blocker?.blockerFn) {
            if (await blocker.blockerFn({
              currentLocation: this.latestLocation,
              nextLocation: this.latestLocation,
              action: "PUSH"
            })) return Promise.resolve();
          }
        }
        if (rest.replace) window.location.replace(reloadHref);
        else window.location.href = reloadHref;
        return Promise.resolve();
      }
      return this.buildAndCommitLocation({
        ...rest,
        href,
        to,
        _isNavigate: true
      });
    };
    this.beforeLoad = () => {
      this.cancelMatches();
      this.updateLatestLocation();
      {
        const nextLocation = this.buildLocation({
          to: this.latestLocation.pathname,
          search: true,
          params: true,
          hash: true,
          state: true,
          _includeValidateSearch: true
        });
        if (this.latestLocation.publicHref !== nextLocation.publicHref) {
          const href = this.getParsedLocationHref(nextLocation);
          if (nextLocation.external) throw redirect({ href });
          else throw redirect({
            href,
            _builtLocation: nextLocation
          });
        }
      }
      const pendingMatches = this.matchRoutes(this.latestLocation);
      const nextCachedMatches = this.stores.cachedMatches.get().filter((d) => !pendingMatches.some((e) => e.id === d.id));
      this.batch(() => {
        this.stores.status.set("pending");
        this.stores.statusCode.set(200);
        this.stores.isLoading.set(true);
        this.stores.location.set(this.latestLocation);
        this.stores.setPending(pendingMatches);
        this.stores.setCached(nextCachedMatches);
      });
    };
    this.load = async (opts) => {
      let redirect2;
      let notFound;
      let loadPromise;
      const previousLocation = this.stores.resolvedLocation.get() ?? this.stores.location.get();
      loadPromise = new Promise((resolve) => {
        this.startTransition(async () => {
          try {
            this.beforeLoad();
            const next = this.latestLocation;
            const locationChangeInfo = getLocationChangeInfo(next, this.stores.resolvedLocation.get());
            if (!this.stores.redirect.get()) this.emit({
              type: "onBeforeNavigate",
              ...locationChangeInfo
            });
            this.emit({
              type: "onBeforeLoad",
              ...locationChangeInfo
            });
            await loadMatches({
              router: this,
              sync: opts?.sync,
              forceStaleReload: previousLocation.href === next.href,
              matches: this.stores.pendingMatches.get(),
              location: next,
              updateMatch: this.updateMatch,
              onReady: async () => {
                this.startTransition(() => {
                  this.startViewTransition(async () => {
                    let exitingMatches = null;
                    let hookExitingMatches = null;
                    let hookEnteringMatches = null;
                    let hookStayingMatches = null;
                    this.batch(() => {
                      const pendingMatches = this.stores.pendingMatches.get();
                      const mountPending = pendingMatches.length;
                      const currentMatches = this.stores.matches.get();
                      exitingMatches = mountPending ? currentMatches.filter((match) => !this.stores.pendingMatchStores.has(match.id)) : null;
                      const pendingRouteIds = /* @__PURE__ */ new Set();
                      for (const s of this.stores.pendingMatchStores.values()) if (s.routeId) pendingRouteIds.add(s.routeId);
                      const activeRouteIds = /* @__PURE__ */ new Set();
                      for (const s of this.stores.matchStores.values()) if (s.routeId) activeRouteIds.add(s.routeId);
                      hookExitingMatches = mountPending ? currentMatches.filter((match) => !pendingRouteIds.has(match.routeId)) : null;
                      hookEnteringMatches = mountPending ? pendingMatches.filter((match) => !activeRouteIds.has(match.routeId)) : null;
                      hookStayingMatches = mountPending ? pendingMatches.filter((match) => activeRouteIds.has(match.routeId)) : currentMatches;
                      this.stores.isLoading.set(false);
                      this.stores.loadedAt.set(Date.now());
                      if (mountPending) {
                        this.stores.setMatches(pendingMatches);
                        this.stores.setPending([]);
                        this.stores.setCached([...this.stores.cachedMatches.get(), ...exitingMatches.filter((d) => d.status !== "error" && d.status !== "notFound" && d.status !== "redirected")]);
                        this.clearExpiredCache();
                      }
                    });
                    for (const [matches, hook] of [
                      [hookExitingMatches, "onLeave"],
                      [hookEnteringMatches, "onEnter"],
                      [hookStayingMatches, "onStay"]
                    ]) {
                      if (!matches) continue;
                      for (const match of matches) this.looseRoutesById[match.routeId].options[hook]?.(match);
                    }
                  });
                });
              }
            });
          } catch (err) {
            if (isRedirect(err)) {
              redirect2 = err;
            } else if (isNotFound(err)) notFound = err;
            const nextStatusCode = redirect2 ? redirect2.status : notFound ? 404 : this.stores.matches.get().some((d) => d.status === "error") ? 500 : 200;
            this.batch(() => {
              this.stores.statusCode.set(nextStatusCode);
              this.stores.redirect.set(redirect2);
            });
          }
          if (this.latestLoadPromise === loadPromise) {
            this.commitLocationPromise?.resolve();
            this.latestLoadPromise = void 0;
            this.commitLocationPromise = void 0;
          }
          resolve();
        });
      });
      this.latestLoadPromise = loadPromise;
      await loadPromise;
      while (this.latestLoadPromise && loadPromise !== this.latestLoadPromise) await this.latestLoadPromise;
      let newStatusCode = void 0;
      if (this.hasNotFoundMatch()) newStatusCode = 404;
      else if (this.stores.matches.get().some((d) => d.status === "error")) newStatusCode = 500;
      if (newStatusCode !== void 0) this.stores.statusCode.set(newStatusCode);
    };
    this.startViewTransition = (fn) => {
      const shouldViewTransition = this.shouldViewTransition ?? this.options.defaultViewTransition;
      this.shouldViewTransition = void 0;
      if (shouldViewTransition && typeof document !== "undefined" && "startViewTransition" in document && typeof document.startViewTransition === "function") {
        let startViewTransitionParams;
        if (typeof shouldViewTransition === "object" && this.isViewTransitionTypesSupported) {
          const next = this.latestLocation;
          const prevLocation = this.stores.resolvedLocation.get();
          const resolvedViewTransitionTypes = typeof shouldViewTransition.types === "function" ? shouldViewTransition.types(getLocationChangeInfo(next, prevLocation)) : shouldViewTransition.types;
          if (resolvedViewTransitionTypes === false) {
            fn();
            return;
          }
          startViewTransitionParams = {
            update: fn,
            types: resolvedViewTransitionTypes
          };
        } else startViewTransitionParams = fn;
        document.startViewTransition(startViewTransitionParams);
      } else fn();
    };
    this.updateMatch = (id2, updater) => {
      this.startTransition(() => {
        const pendingMatch = this.stores.pendingMatchStores.get(id2);
        if (pendingMatch) {
          pendingMatch.set(updater);
          return;
        }
        const activeMatch = this.stores.matchStores.get(id2);
        if (activeMatch) {
          activeMatch.set(updater);
          return;
        }
        const cachedMatch = this.stores.cachedMatchStores.get(id2);
        if (cachedMatch) {
          const next = updater(cachedMatch.get());
          if (next.status === "redirected") {
            if (this.stores.cachedMatchStores.delete(id2)) this.stores.cachedIds.set((prev) => prev.filter((matchId) => matchId !== id2));
          } else cachedMatch.set(next);
        }
      });
    };
    this.getMatch = (matchId) => {
      return this.stores.cachedMatchStores.get(matchId)?.get() ?? this.stores.pendingMatchStores.get(matchId)?.get() ?? this.stores.matchStores.get(matchId)?.get();
    };
    this.invalidate = (opts) => {
      const invalidate = (d) => {
        if (opts?.filter?.(d) ?? true) return {
          ...d,
          invalid: true,
          ...opts?.forcePending || d.status === "error" || d.status === "notFound" ? {
            status: "pending",
            error: void 0
          } : void 0
        };
        return d;
      };
      this.batch(() => {
        this.stores.setMatches(this.stores.matches.get().map(invalidate));
        this.stores.setCached(this.stores.cachedMatches.get().map(invalidate));
        this.stores.setPending(this.stores.pendingMatches.get().map(invalidate));
      });
      this.shouldViewTransition = false;
      return this.load({ sync: opts?.sync });
    };
    this.getParsedLocationHref = (location) => {
      return location.publicHref || "/";
    };
    this.resolveRedirect = (redirect2) => {
      const locationHeader = redirect2.headers.get("Location");
      if (!redirect2.options.href || redirect2.options._builtLocation) {
        const location = redirect2.options._builtLocation ?? this.buildLocation(redirect2.options);
        const href = this.getParsedLocationHref(location);
        redirect2.options.href = href;
        redirect2.headers.set("Location", href);
      } else if (locationHeader) try {
        const url = new URL(locationHeader);
        if (this.origin && url.origin === this.origin) {
          const href = url.pathname + url.search + url.hash;
          redirect2.options.href = href;
          redirect2.headers.set("Location", href);
        }
      } catch {
      }
      if (redirect2.options.href && !redirect2.options._builtLocation && isDangerousProtocol(redirect2.options.href, this.protocolAllowlist)) throw new Error("Redirect blocked: unsafe protocol");
      if (!redirect2.headers.get("Location")) redirect2.headers.set("Location", redirect2.options.href);
      return redirect2;
    };
    this.clearCache = (opts) => {
      const filter2 = opts?.filter;
      if (filter2 !== void 0) this.stores.setCached(this.stores.cachedMatches.get().filter((m) => !filter2(m)));
      else this.stores.setCached([]);
    };
    this.clearExpiredCache = () => {
      const now2 = Date.now();
      const filter2 = (d) => {
        const route = this.looseRoutesById[d.routeId];
        if (!route.options.loader) return true;
        const gcTime = (d.preload ? route.options.preloadGcTime ?? this.options.defaultPreloadGcTime : route.options.gcTime ?? this.options.defaultGcTime) ?? 300 * 1e3;
        if (d.status === "error") return true;
        return now2 - d.updatedAt >= gcTime;
      };
      this.clearCache({ filter: filter2 });
    };
    this.loadRouteChunk = loadRouteChunk;
    this.preloadRoute = async (opts) => {
      const next = opts._builtLocation ?? this.buildLocation(opts);
      let matches = this.matchRoutes(next, {
        throwOnError: true,
        preload: true,
        dest: opts
      });
      const activeMatchIds = /* @__PURE__ */ new Set([...this.stores.matchesId.get(), ...this.stores.pendingIds.get()]);
      const loadedMatchIds = /* @__PURE__ */ new Set([...activeMatchIds, ...this.stores.cachedIds.get()]);
      const matchesToCache = matches.filter((match) => !loadedMatchIds.has(match.id));
      if (matchesToCache.length) {
        const cachedMatches = this.stores.cachedMatches.get();
        this.stores.setCached([...cachedMatches, ...matchesToCache]);
      }
      try {
        matches = await loadMatches({
          router: this,
          matches,
          location: next,
          preload: true,
          updateMatch: (id2, updater) => {
            if (activeMatchIds.has(id2)) matches = matches.map((d) => d.id === id2 ? updater(d) : d);
            else this.updateMatch(id2, updater);
          }
        });
        return matches;
      } catch (err) {
        if (isRedirect(err)) {
          if (err.options.reloadDocument) return;
          return await this.preloadRoute({
            ...err.options,
            _fromLocation: next
          });
        }
        if (!isNotFound(err)) console.error(err);
        return;
      }
    };
    this.matchRoute = (location, opts) => {
      const matchLocation = {
        ...location,
        to: location.to ? this.resolvePathWithBase(location.from || "", location.to) : void 0,
        params: location.params || {},
        leaveParams: true
      };
      const next = this.buildLocation(matchLocation);
      if (opts?.pending && this.stores.status.get() !== "pending") return false;
      const baseLocation = (opts?.pending === void 0 ? !this.stores.isLoading.get() : opts.pending) ? this.latestLocation : this.stores.resolvedLocation.get() || this.stores.location.get();
      const match = findSingleMatch(next.pathname, opts?.caseSensitive ?? false, opts?.fuzzy ?? false, baseLocation.pathname, this.processedTree);
      if (!match) return false;
      if (location.params) {
        if (!deepEqual(match.rawParams, location.params, { partial: true })) return false;
      }
      if (opts?.includeSearch ?? true) return deepEqual(baseLocation.search, next.search, { partial: true }) ? match.rawParams : false;
      return match.rawParams;
    };
    this.hasNotFoundMatch = () => {
      return this.stores.matches.get().some((d) => d.status === "notFound" || d.globalNotFound);
    };
    this.getStoreConfig = getStoreConfig;
    this.update({
      defaultPreloadDelay: 50,
      defaultPendingMs: 1e3,
      defaultPendingMinMs: 500,
      context: void 0,
      ...options,
      caseSensitive: options.caseSensitive ?? false,
      notFoundMode: options.notFoundMode ?? "fuzzy",
      stringifySearch: options.stringifySearch ?? defaultStringifySearch,
      parseSearch: options.parseSearch ?? defaultParseSearch,
      protocolAllowlist: options.protocolAllowlist ?? DEFAULT_PROTOCOL_ALLOWLIST
    });
    if (typeof document !== "undefined") self.__TSR_ROUTER__ = this;
  }
  isShell() {
    return !!this.options.isShell;
  }
  isPrerendering() {
    return !!this.options.isPrerendering;
  }
  get state() {
    return this.stores.__store.get();
  }
  setRoutes({ routesById, routesByPath, processedTree }) {
    this.routesById = routesById;
    this.routesByPath = routesByPath;
    this.processedTree = processedTree;
    const notFoundRoute = this.options.notFoundRoute;
    if (notFoundRoute) {
      notFoundRoute.init({ originalIndex: 99999999999 });
      this.routesById[notFoundRoute.id] = notFoundRoute;
    }
  }
  getRouteBranch(route) {
    let branch = this.routeBranchCache.get(route);
    if (!branch) {
      branch = buildRouteBranch(route);
      this.routeBranchCache.set(route, branch);
    }
    return branch;
  }
  get looseRoutesById() {
    return this.routesById;
  }
  getParentContext(parentMatch) {
    return !parentMatch?.id ? this.options.context ?? void 0 : parentMatch.context ?? this.options.context ?? void 0;
  }
  matchRoutesInternal(next, opts) {
    const matchedRoutesResult = this.getMatchedRoutes(next.pathname);
    const { foundRoute, routeParams } = matchedRoutesResult;
    let { matchedRoutes } = matchedRoutesResult;
    let isGlobalNotFound = false;
    if (foundRoute ? foundRoute.path !== "/" && routeParams["**"] : trimPathRight(next.pathname)) if (this.options.notFoundRoute) matchedRoutes = [...matchedRoutes, this.options.notFoundRoute];
    else isGlobalNotFound = true;
    const globalNotFoundRouteId = isGlobalNotFound ? findGlobalNotFoundRouteId(this.options.notFoundMode, matchedRoutes) : void 0;
    const matches = new Array(matchedRoutes.length);
    const previousActiveMatchesByRouteId = /* @__PURE__ */ new Map();
    for (const store of this.stores.matchStores.values()) if (store.routeId) previousActiveMatchesByRouteId.set(store.routeId, store.get());
    for (let index = 0; index < matchedRoutes.length; index++) {
      const route = matchedRoutes[index];
      const parentMatch = matches[index - 1];
      let preMatchSearch;
      let strictMatchSearch;
      let searchError;
      {
        const parentSearch = parentMatch?.search ?? next.search;
        const parentStrictSearch = parentMatch?._strictSearch ?? void 0;
        try {
          const strictSearch = validateSearch(route.options.validateSearch, { ...parentSearch }) ?? void 0;
          preMatchSearch = {
            ...parentSearch,
            ...strictSearch
          };
          strictMatchSearch = {
            ...parentStrictSearch,
            ...strictSearch
          };
          searchError = void 0;
        } catch (err) {
          let searchParamError = err;
          if (!(err instanceof SearchParamError)) searchParamError = new SearchParamError(err.message, { cause: err });
          if (opts?.throwOnError) throw searchParamError;
          preMatchSearch = parentSearch;
          strictMatchSearch = {};
          searchError = searchParamError;
        }
      }
      const loaderDeps = route.options.loaderDeps?.({ search: preMatchSearch }) ?? "";
      const loaderDepsHash = loaderDeps ? JSON.stringify(loaderDeps) : "";
      const { interpolatedPath, usedParams } = interpolatePath({
        path: route.fullPath,
        params: routeParams,
        decoder: this.pathParamsDecoder,
        server: this.isServer
      });
      const matchId = route.id + interpolatedPath + loaderDepsHash;
      const existingMatch = this.getMatch(matchId);
      const previousMatch = previousActiveMatchesByRouteId.get(route.id);
      const strictParams = existingMatch?._strictParams ?? usedParams;
      let paramsError = void 0;
      if (!existingMatch) try {
        extractStrictParams(route, strictParams);
      } catch (err) {
        if (isNotFound(err) || isRedirect(err)) paramsError = err;
        else paramsError = new PathParamError(err.message, { cause: err });
        if (opts?.throwOnError) throw paramsError;
      }
      Object.assign(routeParams, strictParams);
      const cause = previousMatch ? "stay" : "enter";
      let match;
      if (existingMatch) match = {
        ...existingMatch,
        cause,
        params: previousMatch?.params ?? routeParams,
        _strictParams: strictParams,
        search: previousMatch ? nullReplaceEqualDeep(previousMatch.search, preMatchSearch) : nullReplaceEqualDeep(existingMatch.search, preMatchSearch),
        _strictSearch: strictMatchSearch
      };
      else {
        const status = route.options.loader || route.options.beforeLoad || route.lazyFn || routeNeedsPreload(route) ? "pending" : "success";
        match = {
          id: matchId,
          ssr: void 0,
          index,
          routeId: route.id,
          params: previousMatch?.params ?? routeParams,
          _strictParams: strictParams,
          pathname: interpolatedPath,
          updatedAt: Date.now(),
          search: previousMatch ? nullReplaceEqualDeep(previousMatch.search, preMatchSearch) : preMatchSearch,
          _strictSearch: strictMatchSearch,
          searchError: void 0,
          status,
          isFetching: false,
          error: void 0,
          paramsError,
          __routeContext: void 0,
          _nonReactive: { loadPromise: createControlledPromise() },
          __beforeLoadContext: void 0,
          context: {},
          abortController: new AbortController(),
          fetchCount: 0,
          cause,
          loaderDeps: previousMatch ? replaceEqualDeep$1(previousMatch.loaderDeps, loaderDeps) : loaderDeps,
          invalid: false,
          preload: false,
          links: void 0,
          scripts: void 0,
          headScripts: void 0,
          meta: void 0,
          staticData: route.options.staticData || {},
          fullPath: route.fullPath
        };
      }
      if (!opts?.preload) match.globalNotFound = globalNotFoundRouteId === route.id;
      match.searchError = searchError;
      const parentContext = this.getParentContext(parentMatch);
      match.context = {
        ...parentContext,
        ...match.__routeContext,
        ...match.__beforeLoadContext
      };
      matches[index] = match;
    }
    for (let index = 0; index < matches.length; index++) {
      const match = matches[index];
      const route = this.looseRoutesById[match.routeId];
      const existingMatch = this.getMatch(match.id);
      const previousMatch = previousActiveMatchesByRouteId.get(match.routeId);
      match.params = previousMatch ? nullReplaceEqualDeep(previousMatch.params, routeParams) : routeParams;
      if (!existingMatch) {
        const parentMatch = matches[index - 1];
        const parentContext = this.getParentContext(parentMatch);
        if (route.options.context) {
          const contextFnContext = {
            deps: match.loaderDeps,
            params: match.params,
            context: parentContext ?? {},
            location: next,
            navigate: (opts2) => this.navigate({
              ...opts2,
              _fromLocation: next
            }),
            buildLocation: this.buildLocation,
            cause: match.cause,
            abortController: match.abortController,
            preload: !!match.preload,
            matches,
            routeId: route.id
          };
          match.__routeContext = route.options.context(contextFnContext) ?? void 0;
        }
        match.context = {
          ...parentContext,
          ...match.__routeContext,
          ...match.__beforeLoadContext
        };
      }
    }
    return matches;
  }
  /**
  * Lightweight route matching for buildLocation.
  * Only computes fullPath, accumulated search, and params - skipping expensive
  * operations like AbortController, ControlledPromise, loaderDeps, and full match objects.
  */
  matchRoutesLightweight(location) {
    const { matchedRoutes, routeParams } = this.getMatchedRoutes(location.pathname);
    const lastRoute = last(matchedRoutes);
    const accumulatedSearch = { ...location.search };
    for (const route of matchedRoutes) try {
      Object.assign(accumulatedSearch, validateSearch(route.options.validateSearch, accumulatedSearch));
    } catch {
    }
    const lastStateMatchId = last(this.stores.matchesId.get());
    const lastStateMatch = lastStateMatchId && this.stores.matchStores.get(lastStateMatchId)?.get();
    const canReuseParams = lastStateMatch && lastStateMatch.routeId === lastRoute.id && lastStateMatch.pathname === location.pathname;
    let params;
    if (canReuseParams) params = lastStateMatch.params;
    else {
      const strictParams = Object.assign(/* @__PURE__ */ Object.create(null), routeParams);
      for (const route of matchedRoutes) try {
        extractStrictParams(route, strictParams);
      } catch {
      }
      params = strictParams;
    }
    return {
      matchedRoutes,
      fullPath: lastRoute.fullPath,
      search: accumulatedSearch,
      params
    };
  }
};
var SearchParamError = class extends Error {
};
var PathParamError = class extends Error {
};
function getInitialRouterState(location) {
  return {
    loadedAt: 0,
    isLoading: false,
    isTransitioning: false,
    status: "idle",
    resolvedLocation: void 0,
    location,
    matches: [],
    statusCode: 200
  };
}
function validateSearch(validateSearch2, input) {
  if (validateSearch2 == null) return {};
  if ("~standard" in validateSearch2) {
    const result = validateSearch2["~standard"].validate(input);
    if (result instanceof Promise) throw new SearchParamError("Async validation not supported");
    if (result.issues) throw new SearchParamError(JSON.stringify(result.issues, void 0, 2), { cause: result });
    return result.value;
  }
  if ("parse" in validateSearch2) return validateSearch2.parse(input);
  if (typeof validateSearch2 === "function") return validateSearch2(input);
  return {};
}
function getMatchedRoutes({ pathname, routesById, processedTree }) {
  const routeParams = /* @__PURE__ */ Object.create(null);
  const trimmedPath = trimPathRight(pathname);
  let foundRoute = void 0;
  const match = findRouteMatch(trimmedPath, processedTree, true);
  if (match) {
    foundRoute = match.route;
    Object.assign(routeParams, match.rawParams);
  }
  return {
    matchedRoutes: match?.branch || [routesById["__root__"]],
    routeParams,
    foundRoute
  };
}
function applySearchMiddleware({ search, dest, destRoutes, _includeValidateSearch }) {
  return buildMiddlewareChain(destRoutes)(search, dest, _includeValidateSearch ?? false);
}
function buildMiddlewareChain(destRoutes) {
  const context = {
    dest: null,
    _includeValidateSearch: false,
    middlewares: []
  };
  for (const route of destRoutes) {
    if ("search" in route.options) {
      if (route.options.search?.middlewares) context.middlewares.push(...route.options.search.middlewares);
    } else if (route.options.preSearchFilters || route.options.postSearchFilters) {
      const legacyMiddleware = ({ search, next }) => {
        let nextSearch = search;
        if ("preSearchFilters" in route.options && route.options.preSearchFilters) nextSearch = route.options.preSearchFilters.reduce((prev, next2) => next2(prev), search);
        const result = next(nextSearch);
        if ("postSearchFilters" in route.options && route.options.postSearchFilters) return route.options.postSearchFilters.reduce((prev, next2) => next2(prev), result);
        return result;
      };
      context.middlewares.push(legacyMiddleware);
    }
    if (route.options.validateSearch) {
      const validate = ({ search, next }) => {
        const result = next(search);
        if (!context._includeValidateSearch) return result;
        try {
          return {
            ...result,
            ...validateSearch(route.options.validateSearch, result) ?? void 0
          };
        } catch {
          return result;
        }
      };
      context.middlewares.push(validate);
    }
  }
  const final = ({ search }) => {
    const dest = context.dest;
    if (!dest.search) return {};
    if (dest.search === true) return search;
    return functionalUpdate$1(dest.search, search);
  };
  context.middlewares.push(final);
  const applyNext = (index, currentSearch, middlewares) => {
    if (index >= middlewares.length) return currentSearch;
    const middleware = middlewares[index];
    const next = (newSearch) => {
      return applyNext(index + 1, newSearch, middlewares);
    };
    return middleware({
      search: currentSearch,
      next
    });
  };
  return function middleware(search, dest, _includeValidateSearch) {
    context.dest = dest;
    context._includeValidateSearch = _includeValidateSearch;
    return applyNext(0, search, context.middlewares);
  };
}
function findGlobalNotFoundRouteId(notFoundMode, routes) {
  if (notFoundMode !== "root") for (let i = routes.length - 1; i >= 0; i--) {
    const route = routes[i];
    if (route.children) return route.id;
  }
  return rootRouteId;
}
function extractStrictParams(route, accumulatedParams) {
  const parseParams = route.options.params?.parse ?? route.options.parseParams;
  if (parseParams) {
    const result = parseParams(accumulatedParams);
    if (result === false) throw new Error("Route params.parse returned false for a matched route");
    Object.assign(accumulatedParams, result);
  }
}
var BaseRoute = class {
  get to() {
    return this._to;
  }
  get id() {
    return this._id;
  }
  get path() {
    return this._path;
  }
  get fullPath() {
    return this._fullPath;
  }
  constructor(options) {
    this.init = (opts) => {
      this.originalIndex = opts.originalIndex;
      const options2 = this.options;
      const isRoot = !options2?.path && !options2?.id;
      this.parentRoute = this.options.getParentRoute?.();
      if (isRoot) this._path = rootRouteId;
      else if (!this.parentRoute) {
        invariant$1();
      }
      let path = isRoot ? rootRouteId : options2?.path;
      if (path && path !== "/") path = trimPathLeft(path);
      const customId = options2?.id || path;
      let id2 = isRoot ? rootRouteId : joinPaths([this.parentRoute.id === "__root__" ? "" : this.parentRoute.id, customId]);
      if (path === "__root__") path = "/";
      if (id2 !== "__root__") id2 = joinPaths(["/", id2]);
      const fullPath = id2 === "__root__" ? "/" : joinPaths([this.parentRoute.fullPath, path]);
      this._path = path;
      this._id = id2;
      this._fullPath = fullPath;
      this._to = trimPathRight(fullPath);
    };
    this.addChildren = (children) => {
      return this._addFileChildren(children);
    };
    this._addFileChildren = (children) => {
      if (Array.isArray(children)) this.children = children;
      if (typeof children === "object" && children !== null) this.children = Object.values(children);
      return this;
    };
    this._addFileTypes = () => {
      return this;
    };
    this.updateLoader = (options2) => {
      Object.assign(this.options, options2);
      return this;
    };
    this.update = (options2) => {
      Object.assign(this.options, options2);
      return this;
    };
    this.lazy = (lazyFn) => {
      this.lazyFn = lazyFn;
      return this;
    };
    this.redirect = (opts) => redirect({
      from: this.fullPath,
      ...opts
    });
    this.options = options || {};
    this.isRoot = !options?.getParentRoute;
    if (options?.id && options?.path) throw new Error(`Route cannot have both an 'id' and a 'path' option.`);
  }
};
var BaseRootRoute = class extends BaseRoute {
  constructor(options) {
    super(options);
  }
};
function useMatch(opts) {
  const router2 = useRouter();
  const nearestMatchId = reactExports.useContext(opts.from ? dummyMatchContext : matchContext);
  const key = opts.from ?? nearestMatchId;
  const matchStore = key ? opts.from ? router2.stores.getRouteMatchStore(key) : router2.stores.matchStores.get(key) : void 0;
  {
    const match = matchStore?.get();
    if ((opts.shouldThrow ?? true) && !match) {
      invariant$1();
    }
    if (match === void 0) return;
    return opts.select ? opts.select(match) : match;
  }
}
function useLoaderData(opts) {
  return useMatch({
    from: opts.from,
    strict: opts.strict,
    structuralSharing: opts.structuralSharing,
    select: (s) => {
      return opts.select ? opts.select(s.loaderData) : s.loaderData;
    }
  });
}
function useLoaderDeps(opts) {
  const { select, ...rest } = opts;
  return useMatch({
    ...rest,
    select: (s) => {
      return select ? select(s.loaderDeps) : s.loaderDeps;
    }
  });
}
function useParams(opts) {
  return useMatch({
    from: opts.from,
    shouldThrow: opts.shouldThrow,
    structuralSharing: opts.structuralSharing,
    strict: opts.strict,
    select: (match) => {
      const params = opts.strict === false ? match.params : match._strictParams;
      return opts.select ? opts.select(params) : params;
    }
  });
}
function useSearch(opts) {
  return useMatch({
    from: opts.from,
    strict: opts.strict,
    shouldThrow: opts.shouldThrow,
    structuralSharing: opts.structuralSharing,
    select: (match) => {
      return opts.select ? opts.select(match.search) : match.search;
    }
  });
}
function useNavigate(_defaultOpts) {
  const router2 = useRouter();
  return reactExports.useCallback((options) => {
    return router2.navigate({
      ...options,
      from: options.from ?? _defaultOpts?.from
    });
  }, [_defaultOpts?.from, router2]);
}
function Navigate(props) {
  const router2 = useRouter();
  const navigate = useNavigate();
  const previousPropsRef = reactExports.useRef(null);
  useLayoutEffect(() => {
    if (previousPropsRef.current !== props) {
      navigate(props);
      previousPropsRef.current = props;
    }
  }, [
    router2,
    props,
    navigate
  ]);
  return null;
}
function useRouteContext(opts) {
  return useMatch({
    ...opts,
    select: (match) => opts.select ? opts.select(match.context) : match.context
  });
}
var reactDomExports = requireReactDom();
const ReactDOM = /* @__PURE__ */ getDefaultExportFromCjs(reactDomExports);
function useLinkProps(options, forwardedRef) {
  const router2 = useRouter();
  const innerRef = useForwardedRef(forwardedRef);
  const { activeProps, inactiveProps, activeOptions, to, preload: userPreload, preloadDelay: userPreloadDelay, preloadIntentProximity: _preloadIntentProximity, hashScrollIntoView, replace, startTransition, resetScroll, viewTransition, children, target, disabled, style, className, onClick, onBlur, onFocus, onMouseEnter, onMouseLeave, onTouchStart, ignoreBlocker, params: _params, search: _search, hash: _hash, state: _state, mask: _mask, reloadDocument: _reloadDocument, unsafeRelative: _unsafeRelative, from: _from, _fromLocation, ...propsSafeToSpread } = options;
  {
    const safeInternal = isSafeInternal(to);
    if (typeof to === "string" && !safeInternal && to.indexOf(":") > -1) try {
      new URL(to);
      if (isDangerousProtocol(to, router2.protocolAllowlist)) {
        if (false) ;
        return {
          ...propsSafeToSpread,
          ref: innerRef,
          href: void 0,
          ...children && { children },
          ...target && { target },
          ...disabled && { disabled },
          ...style && { style },
          ...className && { className }
        };
      }
      return {
        ...propsSafeToSpread,
        ref: innerRef,
        href: to,
        ...children && { children },
        ...target && { target },
        ...disabled && { disabled },
        ...style && { style },
        ...className && { className }
      };
    } catch {
    }
    const next2 = router2.buildLocation({
      ...options,
      from: options.from
    });
    const hrefOption2 = getHrefOption(next2.maskedLocation ? next2.maskedLocation.publicHref : next2.publicHref, next2.maskedLocation ? next2.maskedLocation.external : next2.external, router2.history, disabled);
    const externalLink2 = (() => {
      if (hrefOption2?.external) {
        if (isDangerousProtocol(hrefOption2.href, router2.protocolAllowlist)) {
          return;
        }
        return hrefOption2.href;
      }
      if (safeInternal) return void 0;
      if (typeof to === "string" && to.indexOf(":") > -1) try {
        new URL(to);
        if (isDangerousProtocol(to, router2.protocolAllowlist)) {
          if (false) ;
          return;
        }
        return to;
      } catch {
      }
    })();
    const isActive2 = (() => {
      if (externalLink2) return false;
      const currentLocation2 = router2.stores.location.get();
      const exact = activeOptions?.exact ?? false;
      if (exact) {
        if (!exactPathTest(currentLocation2.pathname, next2.pathname, router2.basepath)) return false;
      } else {
        const currentPathSplit = removeTrailingSlash(currentLocation2.pathname, router2.basepath);
        const nextPathSplit = removeTrailingSlash(next2.pathname, router2.basepath);
        if (!(currentPathSplit.startsWith(nextPathSplit) && (currentPathSplit.length === nextPathSplit.length || currentPathSplit[nextPathSplit.length] === "/"))) return false;
      }
      if (activeOptions?.includeSearch ?? true) {
        if (currentLocation2.search !== next2.search) {
          const currentSearchEmpty = !currentLocation2.search || typeof currentLocation2.search === "object" && !hasKeys(currentLocation2.search);
          const nextSearchEmpty = !next2.search || typeof next2.search === "object" && !hasKeys(next2.search);
          if (!(currentSearchEmpty && nextSearchEmpty)) {
            if (!deepEqual(currentLocation2.search, next2.search, {
              partial: !exact,
              ignoreUndefined: !activeOptions?.explicitUndefined
            })) return false;
          }
        }
      }
      if (activeOptions?.includeHash) return false;
      return true;
    })();
    if (externalLink2) return {
      ...propsSafeToSpread,
      ref: innerRef,
      href: externalLink2,
      ...children && { children },
      ...target && { target },
      ...disabled && { disabled },
      ...style && { style },
      ...className && { className }
    };
    const resolvedActiveProps2 = isActive2 ? functionalUpdate$1(activeProps, {}) ?? STATIC_ACTIVE_OBJECT : STATIC_EMPTY_OBJECT;
    const resolvedInactiveProps2 = isActive2 ? STATIC_EMPTY_OBJECT : functionalUpdate$1(inactiveProps, {}) ?? STATIC_EMPTY_OBJECT;
    const resolvedStyle2 = (() => {
      const baseStyle = style;
      const activeStyle = resolvedActiveProps2.style;
      const inactiveStyle = resolvedInactiveProps2.style;
      if (!baseStyle && !activeStyle && !inactiveStyle) return;
      if (baseStyle && !activeStyle && !inactiveStyle) return baseStyle;
      if (!baseStyle && activeStyle && !inactiveStyle) return activeStyle;
      if (!baseStyle && !activeStyle && inactiveStyle) return inactiveStyle;
      return {
        ...baseStyle,
        ...activeStyle,
        ...inactiveStyle
      };
    })();
    const resolvedClassName2 = (() => {
      const baseClassName = className;
      const activeClassName = resolvedActiveProps2.className;
      const inactiveClassName = resolvedInactiveProps2.className;
      if (!baseClassName && !activeClassName && !inactiveClassName) return "";
      let out = "";
      if (baseClassName) out = baseClassName;
      if (activeClassName) out = out ? `${out} ${activeClassName}` : activeClassName;
      if (inactiveClassName) out = out ? `${out} ${inactiveClassName}` : inactiveClassName;
      return out;
    })();
    return {
      ...propsSafeToSpread,
      ...resolvedActiveProps2,
      ...resolvedInactiveProps2,
      href: hrefOption2?.href,
      ref: innerRef,
      disabled: !!disabled,
      target,
      ...resolvedStyle2 && { style: resolvedStyle2 },
      ...resolvedClassName2 && { className: resolvedClassName2 },
      ...disabled && STATIC_DISABLED_PROPS,
      ...isActive2 && STATIC_ACTIVE_PROPS
    };
  }
}
var STATIC_EMPTY_OBJECT = {};
var STATIC_ACTIVE_OBJECT = { className: "active" };
var STATIC_DISABLED_PROPS = {
  role: "link",
  "aria-disabled": true
};
var STATIC_ACTIVE_PROPS = {
  "data-status": "active",
  "aria-current": "page"
};
function getHrefOption(publicHref, external, history, disabled) {
  if (disabled) return void 0;
  if (external) return {
    href: publicHref,
    external: true
  };
  return {
    href: history.createHref(publicHref) || "/",
    external: false
  };
}
function isSafeInternal(to) {
  if (typeof to !== "string") return false;
  const zero = to.charCodeAt(0);
  if (zero === 47) return to.charCodeAt(1) !== 47;
  return zero === 46;
}
var Link = reactExports.forwardRef((props, ref) => {
  const { _asChild, ...rest } = props;
  const { type: _type, ...linkProps } = useLinkProps(rest, ref);
  const children = typeof rest.children === "function" ? rest.children({ isActive: linkProps["data-status"] === "active" }) : rest.children;
  if (!_asChild) {
    const { disabled: _, ...rest2 } = linkProps;
    return reactExports.createElement("a", rest2, children);
  }
  return reactExports.createElement(_asChild, linkProps, children);
});
var Route$o = class Route extends BaseRoute {
  /**
  * @deprecated Use the `createRoute` function instead.
  */
  constructor(options) {
    super(options);
    this.useMatch = (opts) => {
      return useMatch({
        select: opts?.select,
        from: this.id,
        structuralSharing: opts?.structuralSharing
      });
    };
    this.useRouteContext = (opts) => {
      return useRouteContext({
        ...opts,
        from: this.id
      });
    };
    this.useSearch = (opts) => {
      return useSearch({
        select: opts?.select,
        structuralSharing: opts?.structuralSharing,
        from: this.id
      });
    };
    this.useParams = (opts) => {
      return useParams({
        select: opts?.select,
        structuralSharing: opts?.structuralSharing,
        from: this.id
      });
    };
    this.useLoaderDeps = (opts) => {
      return useLoaderDeps({
        ...opts,
        from: this.id
      });
    };
    this.useLoaderData = (opts) => {
      return useLoaderData({
        ...opts,
        from: this.id
      });
    };
    this.useNavigate = () => {
      return useNavigate({ from: this.fullPath });
    };
    this.Link = React.forwardRef((props, ref) => {
      return /* @__PURE__ */ jsxRuntimeExports.jsx(Link, {
        ref,
        from: this.fullPath,
        ...props
      });
    });
  }
};
function createRoute(options) {
  return new Route$o(options);
}
function createRootRouteWithContext() {
  return (options) => {
    return createRootRoute(options);
  };
}
var RootRoute = class extends BaseRootRoute {
  /**
  * @deprecated `RootRoute` is now an internal implementation detail. Use `createRootRoute()` instead.
  */
  constructor(options) {
    super(options);
    this.useMatch = (opts) => {
      return useMatch({
        select: opts?.select,
        from: this.id,
        structuralSharing: opts?.structuralSharing
      });
    };
    this.useRouteContext = (opts) => {
      return useRouteContext({
        ...opts,
        from: this.id
      });
    };
    this.useSearch = (opts) => {
      return useSearch({
        select: opts?.select,
        structuralSharing: opts?.structuralSharing,
        from: this.id
      });
    };
    this.useParams = (opts) => {
      return useParams({
        select: opts?.select,
        structuralSharing: opts?.structuralSharing,
        from: this.id
      });
    };
    this.useLoaderDeps = (opts) => {
      return useLoaderDeps({
        ...opts,
        from: this.id
      });
    };
    this.useLoaderData = (opts) => {
      return useLoaderData({
        ...opts,
        from: this.id
      });
    };
    this.useNavigate = () => {
      return useNavigate({ from: this.fullPath });
    };
    this.Link = React.forwardRef((props, ref) => {
      return /* @__PURE__ */ jsxRuntimeExports.jsx(Link, {
        ref,
        from: this.fullPath,
        ...props
      });
    });
  }
};
function createRootRoute(options) {
  return new RootRoute(options);
}
function createFileRoute(path) {
  return new FileRoute(path, { silent: true }).createRoute;
}
var FileRoute = class {
  constructor(path, _opts) {
    this.path = path;
    this.createRoute = (options) => {
      const route = createRoute(options);
      route.isRoot = false;
      return route;
    };
    this.silent = _opts?.silent;
  }
};
function lazyRouteComponent(importer, exportName) {
  let loadPromise;
  let comp;
  let error;
  let reload;
  const load = () => {
    if (!loadPromise) loadPromise = importer().then((res) => {
      loadPromise = void 0;
      comp = res[exportName];
    }).catch((err) => {
      error = err;
      if (isModuleNotFoundError(error)) {
        if (error instanceof Error && typeof window !== "undefined" && typeof sessionStorage !== "undefined") {
          const storageKey = `tanstack_router_reload:${error.message}`;
          if (!sessionStorage.getItem(storageKey)) {
            sessionStorage.setItem(storageKey, "1");
            reload = true;
          }
        }
      }
    });
    return loadPromise;
  };
  const lazyComp = function Lazy(props) {
    if (reload) {
      window.location.reload();
      throw new Promise(() => {
      });
    }
    if (error) throw error;
    if (!comp) if (reactUse) reactUse(load());
    else throw load();
    return reactExports.createElement(comp, props);
  };
  lazyComp.preload = load;
  return lazyComp;
}
var getStoreFactory = (opts) => {
  return {
    createMutableStore: createNonReactiveMutableStore,
    createReadonlyStore: createNonReactiveReadonlyStore,
    batch: (fn) => fn()
  };
};
var createRouter = (options) => {
  return new Router(options);
};
var Router = class extends RouterCore {
  constructor(options) {
    super(options, getStoreFactory);
  }
};
function Asset(asset) {
  const { attrs, children, nonce } = asset;
  switch (asset.tag) {
    case "title":
      return /* @__PURE__ */ jsxRuntimeExports.jsx("title", {
        ...attrs,
        suppressHydrationWarning: true,
        children
      });
    case "meta":
      return /* @__PURE__ */ jsxRuntimeExports.jsx("meta", {
        ...attrs,
        suppressHydrationWarning: true
      });
    case "link":
      return /* @__PURE__ */ jsxRuntimeExports.jsx("link", {
        ...attrs,
        precedence: attrs?.precedence ?? (attrs?.rel === "stylesheet" ? "default" : void 0),
        nonce,
        suppressHydrationWarning: true
      });
    case "style":
      if (asset.inlineCss && false) ;
      return /* @__PURE__ */ jsxRuntimeExports.jsx("style", {
        ...attrs,
        dangerouslySetInnerHTML: { __html: children },
        nonce
      });
    case "script":
      return /* @__PURE__ */ jsxRuntimeExports.jsx(Script, {
        attrs,
        children
      });
    default:
      return null;
  }
}
function Script({ attrs, children }) {
  useRouter();
  useHydrated();
  const dataScript = typeof attrs?.type === "string" && attrs.type !== "" && attrs.type !== "text/javascript" && attrs.type !== "module";
  reactExports.useEffect(() => {
    if (dataScript) return;
    if (attrs?.src) {
      const normSrc = (() => {
        try {
          const base = document.baseURI || window.location.href;
          return new URL(attrs.src, base).href;
        } catch {
          return attrs.src;
        }
      })();
      if (Array.from(document.querySelectorAll("script[src]")).find((el) => el.src === normSrc)) return;
      const script = document.createElement("script");
      for (const [key, value] of Object.entries(attrs)) if (key !== "suppressHydrationWarning" && value !== void 0 && value !== false) script.setAttribute(key, typeof value === "boolean" ? "" : String(value));
      document.head.appendChild(script);
      return () => {
        if (script.parentNode) script.parentNode.removeChild(script);
      };
    }
    if (typeof children === "string") {
      const typeAttr = typeof attrs?.type === "string" ? attrs.type : "text/javascript";
      const nonceAttr = typeof attrs?.nonce === "string" ? attrs.nonce : void 0;
      if (Array.from(document.querySelectorAll("script:not([src])")).find((el) => {
        if (!(el instanceof HTMLScriptElement)) return false;
        const sType = el.getAttribute("type") ?? "text/javascript";
        const sNonce = el.getAttribute("nonce") ?? void 0;
        return el.textContent === children && sType === typeAttr && sNonce === nonceAttr;
      })) return;
      const script = document.createElement("script");
      script.textContent = children;
      if (attrs) {
        for (const [key, value] of Object.entries(attrs)) if (key !== "suppressHydrationWarning" && value !== void 0 && value !== false) script.setAttribute(key, typeof value === "boolean" ? "" : String(value));
      }
      document.head.appendChild(script);
      return () => {
        if (script.parentNode) script.parentNode.removeChild(script);
      };
    }
  }, [
    attrs,
    children,
    dataScript
  ]);
  {
    if (attrs?.src) return /* @__PURE__ */ jsxRuntimeExports.jsx("script", {
      ...attrs,
      suppressHydrationWarning: true
    });
    if (typeof children === "string") return /* @__PURE__ */ jsxRuntimeExports.jsx("script", {
      ...attrs,
      dangerouslySetInnerHTML: { __html: children },
      suppressHydrationWarning: true
    });
    return null;
  }
}
function buildTagsFromMatches(router2, nonce, matches, assetCrossOrigin) {
  const routeMeta = matches.map((match) => match.meta).filter(Boolean);
  const resultMeta = [];
  const metaByAttribute = {};
  let title;
  for (let i = routeMeta.length - 1; i >= 0; i--) {
    const metas = routeMeta[i];
    for (let j = metas.length - 1; j >= 0; j--) {
      const m = metas[j];
      if (!m) continue;
      if (m.title) {
        if (!title) title = {
          tag: "title",
          children: m.title
        };
      } else if ("script:ld+json" in m) try {
        const json = JSON.stringify(m["script:ld+json"]);
        resultMeta.push({
          tag: "script",
          attrs: { type: "application/ld+json" },
          children: escapeHtml(json)
        });
      } catch {
      }
      else {
        const attribute = m.name ?? m.property;
        if (attribute) if (metaByAttribute[attribute]) continue;
        else metaByAttribute[attribute] = true;
        resultMeta.push({
          tag: "meta",
          attrs: {
            ...m,
            nonce
          }
        });
      }
    }
  }
  if (title) resultMeta.push(title);
  if (nonce) resultMeta.push({
    tag: "meta",
    attrs: {
      property: "csp-nonce",
      content: nonce
    }
  });
  resultMeta.reverse();
  const constructedLinks = matches.map((match) => match.links).filter(Boolean).flat(1).map((link) => ({
    tag: "link",
    attrs: {
      ...link,
      nonce
    }
  }));
  const manifest = router2.ssr?.manifest;
  const assetLinks = matches.map((match) => manifest?.routes[match.routeId]?.assets ?? []).filter(Boolean).flat(1).flatMap((asset) => {
    if (asset.tag === "link") {
      if (isInlinableStylesheet(manifest, asset)) return [];
      return [{
        tag: "link",
        attrs: {
          ...asset.attrs,
          crossOrigin: getAssetCrossOrigin(assetCrossOrigin, "stylesheet") ?? asset.attrs?.crossOrigin,
          suppressHydrationWarning: true,
          nonce
        }
      }];
    }
    if (asset.tag === "style") return [{
      tag: "style",
      attrs: {
        ...asset.attrs,
        nonce
      },
      children: asset.children,
      ...asset.inlineCss ? { inlineCss: true } : {}
    }];
    return [];
  });
  const preloadLinks = [];
  matches.map((match) => router2.looseRoutesById[match.routeId]).forEach((route) => router2.ssr?.manifest?.routes[route.id]?.preloads?.filter(Boolean).forEach((preload) => {
    const preloadLink = resolveManifestAssetLink(preload);
    preloadLinks.push({
      tag: "link",
      attrs: {
        rel: "modulepreload",
        href: preloadLink.href,
        crossOrigin: getAssetCrossOrigin(assetCrossOrigin, "modulepreload") ?? preloadLink.crossOrigin,
        nonce
      }
    });
  }));
  const styles = matches.map((match) => match.styles).flat(1).filter(Boolean).map(({ children, ...attrs }) => ({
    tag: "style",
    attrs: {
      ...attrs,
      nonce
    },
    children
  }));
  const headScripts = matches.map((match) => match.headScripts).flat(1).filter(Boolean).map(({ children, ...script }) => ({
    tag: "script",
    attrs: {
      ...script,
      nonce
    },
    children
  }));
  return uniqBy([
    ...resultMeta,
    ...preloadLinks,
    ...constructedLinks,
    ...assetLinks,
    ...styles,
    ...headScripts
  ], (d) => JSON.stringify(d));
}
var useTags = (assetCrossOrigin) => {
  const router2 = useRouter();
  const nonce = router2.options.ssr?.nonce;
  return buildTagsFromMatches(router2, nonce, router2.stores.matches.get(), assetCrossOrigin);
};
function uniqBy(arr, fn) {
  const seen = /* @__PURE__ */ new Set();
  return arr.filter((item) => {
    const key = fn(item);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
function HeadContent(props) {
  const tags = useTags(props.assetCrossOrigin);
  const nonce = useRouter().options.ssr?.nonce;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: tags.map((tag) => /* @__PURE__ */ reactExports.createElement(Asset, {
    ...tag,
    key: `tsr-meta-${JSON.stringify(tag)}`,
    nonce
  })) });
}
var Scripts = () => {
  const router2 = useRouter();
  const nonce = router2.options.ssr?.nonce;
  const getAssetScripts = (matches) => {
    const assetScripts = [];
    const manifest = router2.ssr?.manifest;
    if (!manifest) return [];
    matches.map((match) => router2.looseRoutesById[match.routeId]).forEach((route) => manifest.routes[route.id]?.assets?.filter((d) => d.tag === "script").forEach((asset) => {
      assetScripts.push({
        tag: "script",
        attrs: {
          ...asset.attrs,
          nonce
        },
        children: asset.children
      });
    }));
    return assetScripts;
  };
  const getScripts = (matches) => matches.map((match) => match.scripts).flat(1).filter(Boolean).map(({ children, ...script }) => ({
    tag: "script",
    attrs: {
      ...script,
      suppressHydrationWarning: true,
      nonce
    },
    children
  }));
  {
    const activeMatches = router2.stores.matches.get();
    const assetScripts = getAssetScripts(activeMatches);
    return renderScripts(router2, getScripts(activeMatches), assetScripts);
  }
};
function renderScripts(router2, scripts, assetScripts) {
  let serverBufferedScript = void 0;
  if (router2.serverSsr) serverBufferedScript = router2.serverSsr.takeBufferedScripts();
  const allScripts = [...scripts, ...assetScripts];
  if (serverBufferedScript) allScripts.unshift(serverBufferedScript);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: allScripts.map((asset, i) => /* @__PURE__ */ reactExports.createElement(Asset, {
    ...asset,
    key: `tsr-scripts-${asset.tag}-${i}`
  })) });
}
var Subscribable = class {
  constructor() {
    this.listeners = /* @__PURE__ */ new Set();
    this.subscribe = this.subscribe.bind(this);
  }
  subscribe(listener) {
    this.listeners.add(listener);
    this.onSubscribe();
    return () => {
      this.listeners.delete(listener);
      this.onUnsubscribe();
    };
  }
  hasListeners() {
    return this.listeners.size > 0;
  }
  onSubscribe() {
  }
  onUnsubscribe() {
  }
};
var FocusManager = class extends Subscribable {
  #focused;
  #cleanup;
  #setup;
  constructor() {
    super();
    this.#setup = (onFocus) => {
      if (typeof window !== "undefined" && window.addEventListener) {
        const listener = () => onFocus();
        window.addEventListener("visibilitychange", listener, false);
        return () => {
          window.removeEventListener("visibilitychange", listener);
        };
      }
      return;
    };
  }
  onSubscribe() {
    if (!this.#cleanup) {
      this.setEventListener(this.#setup);
    }
  }
  onUnsubscribe() {
    if (!this.hasListeners()) {
      this.#cleanup?.();
      this.#cleanup = void 0;
    }
  }
  setEventListener(setup) {
    this.#setup = setup;
    this.#cleanup?.();
    this.#cleanup = setup((focused) => {
      if (typeof focused === "boolean") {
        this.setFocused(focused);
      } else {
        this.onFocus();
      }
    });
  }
  setFocused(focused) {
    const changed = this.#focused !== focused;
    if (changed) {
      this.#focused = focused;
      this.onFocus();
    }
  }
  onFocus() {
    const isFocused = this.isFocused();
    this.listeners.forEach((listener) => {
      listener(isFocused);
    });
  }
  isFocused() {
    if (typeof this.#focused === "boolean") {
      return this.#focused;
    }
    return globalThis.document?.visibilityState !== "hidden";
  }
};
var focusManager = new FocusManager();
var defaultTimeoutProvider = {
  // We need the wrapper function syntax below instead of direct references to
  // global setTimeout etc.
  //
  // BAD: `setTimeout: setTimeout`
  // GOOD: `setTimeout: (cb, delay) => setTimeout(cb, delay)`
  //
  // If we use direct references here, then anything that wants to spy on or
  // replace the global setTimeout (like tests) won't work since we'll already
  // have a hard reference to the original implementation at the time when this
  // file was imported.
  setTimeout: (callback, delay2) => setTimeout(callback, delay2),
  clearTimeout: (timeoutId) => clearTimeout(timeoutId),
  setInterval: (callback, delay2) => setInterval(callback, delay2),
  clearInterval: (intervalId) => clearInterval(intervalId)
};
var TimeoutManager = class {
  // We cannot have TimeoutManager<T> as we must instantiate it with a concrete
  // type at app boot; and if we leave that type, then any new timer provider
  // would need to support the default provider's concrete timer ID, which is
  // infeasible across environments.
  //
  // We settle for type safety for the TimeoutProvider type, and accept that
  // this class is unsafe internally to allow for extension.
  #provider = defaultTimeoutProvider;
  #providerCalled = false;
  setTimeoutProvider(provider) {
    this.#provider = provider;
  }
  setTimeout(callback, delay2) {
    return this.#provider.setTimeout(callback, delay2);
  }
  clearTimeout(timeoutId) {
    this.#provider.clearTimeout(timeoutId);
  }
  setInterval(callback, delay2) {
    return this.#provider.setInterval(callback, delay2);
  }
  clearInterval(intervalId) {
    this.#provider.clearInterval(intervalId);
  }
};
var timeoutManager = new TimeoutManager();
function systemSetTimeoutZero(callback) {
  setTimeout(callback, 0);
}
var isServer = typeof window === "undefined" || "Deno" in globalThis;
function noop$1() {
}
function functionalUpdate(updater, input) {
  return typeof updater === "function" ? updater(input) : updater;
}
function isValidTimeout(value) {
  return typeof value === "number" && value >= 0 && value !== Infinity;
}
function timeUntilStale(updatedAt, staleTime) {
  return Math.max(updatedAt + (staleTime || 0) - Date.now(), 0);
}
function resolveStaleTime(staleTime, query) {
  return typeof staleTime === "function" ? staleTime(query) : staleTime;
}
function resolveQueryBoolean(option, query) {
  return typeof option === "function" ? option(query) : option;
}
function matchQuery(filters, query) {
  const {
    type = "all",
    exact,
    fetchStatus,
    predicate,
    queryKey,
    stale
  } = filters;
  if (queryKey) {
    if (exact) {
      if (query.queryHash !== hashQueryKeyByOptions(queryKey, query.options)) {
        return false;
      }
    } else if (!partialMatchKey(query.queryKey, queryKey)) {
      return false;
    }
  }
  if (type !== "all") {
    const isActive = query.isActive();
    if (type === "active" && !isActive) {
      return false;
    }
    if (type === "inactive" && isActive) {
      return false;
    }
  }
  if (typeof stale === "boolean" && query.isStale() !== stale) {
    return false;
  }
  if (fetchStatus && fetchStatus !== query.state.fetchStatus) {
    return false;
  }
  if (predicate && !predicate(query)) {
    return false;
  }
  return true;
}
function matchMutation(filters, mutation) {
  const { exact, status, predicate, mutationKey } = filters;
  if (mutationKey) {
    if (!mutation.options.mutationKey) {
      return false;
    }
    if (exact) {
      if (hashKey(mutation.options.mutationKey) !== hashKey(mutationKey)) {
        return false;
      }
    } else if (!partialMatchKey(mutation.options.mutationKey, mutationKey)) {
      return false;
    }
  }
  if (status && mutation.state.status !== status) {
    return false;
  }
  if (predicate && !predicate(mutation)) {
    return false;
  }
  return true;
}
function hashQueryKeyByOptions(queryKey, options) {
  const hashFn = options?.queryKeyHashFn || hashKey;
  return hashFn(queryKey);
}
function hashKey(queryKey) {
  return JSON.stringify(
    queryKey,
    (_, val) => isPlainObject(val) ? Object.keys(val).sort().reduce((result, key) => {
      result[key] = val[key];
      return result;
    }, {}) : val
  );
}
function partialMatchKey(a, b) {
  if (a === b) {
    return true;
  }
  if (typeof a !== typeof b) {
    return false;
  }
  if (a && b && typeof a === "object" && typeof b === "object") {
    return Object.keys(b).every((key) => partialMatchKey(a[key], b[key]));
  }
  return false;
}
var hasOwn = Object.prototype.hasOwnProperty;
function replaceEqualDeep(a, b, depth = 0) {
  if (a === b) {
    return a;
  }
  if (depth > 500) return b;
  const array = isPlainArray(a) && isPlainArray(b);
  if (!array && !(isPlainObject(a) && isPlainObject(b))) return b;
  const aItems = array ? a : Object.keys(a);
  const aSize = aItems.length;
  const bItems = array ? b : Object.keys(b);
  const bSize = bItems.length;
  const copy = array ? new Array(bSize) : {};
  let equalItems = 0;
  for (let i = 0; i < bSize; i++) {
    const key = array ? i : bItems[i];
    const aItem = a[key];
    const bItem = b[key];
    if (aItem === bItem) {
      copy[key] = aItem;
      if (array ? i < aSize : hasOwn.call(a, key)) equalItems++;
      continue;
    }
    if (aItem === null || bItem === null || typeof aItem !== "object" || typeof bItem !== "object") {
      copy[key] = bItem;
      continue;
    }
    const v = replaceEqualDeep(aItem, bItem, depth + 1);
    copy[key] = v;
    if (v === aItem) equalItems++;
  }
  return aSize === bSize && equalItems === aSize ? a : copy;
}
function isPlainArray(value) {
  return Array.isArray(value) && value.length === Object.keys(value).length;
}
function isPlainObject(o) {
  if (!hasObjectPrototype(o)) {
    return false;
  }
  const ctor = o.constructor;
  if (ctor === void 0) {
    return true;
  }
  const prot = ctor.prototype;
  if (!hasObjectPrototype(prot)) {
    return false;
  }
  if (!prot.hasOwnProperty("isPrototypeOf")) {
    return false;
  }
  if (Object.getPrototypeOf(o) !== Object.prototype) {
    return false;
  }
  return true;
}
function hasObjectPrototype(o) {
  return Object.prototype.toString.call(o) === "[object Object]";
}
function sleep(timeout) {
  return new Promise((resolve) => {
    timeoutManager.setTimeout(resolve, timeout);
  });
}
function replaceData(prevData, data, options) {
  if (typeof options.structuralSharing === "function") {
    return options.structuralSharing(prevData, data);
  } else if (options.structuralSharing !== false) {
    return replaceEqualDeep(prevData, data);
  }
  return data;
}
function addToEnd(items, item, max = 0) {
  const newItems = [...items, item];
  return max && newItems.length > max ? newItems.slice(1) : newItems;
}
function addToStart(items, item, max = 0) {
  const newItems = [item, ...items];
  return max && newItems.length > max ? newItems.slice(0, -1) : newItems;
}
var skipToken = /* @__PURE__ */ Symbol();
function ensureQueryFn(options, fetchOptions) {
  if (!options.queryFn && fetchOptions?.initialPromise) {
    return () => fetchOptions.initialPromise;
  }
  if (!options.queryFn || options.queryFn === skipToken) {
    return () => Promise.reject(new Error(`Missing queryFn: '${options.queryHash}'`));
  }
  return options.queryFn;
}
function addConsumeAwareSignal(object, getSignal, onCancelled) {
  let consumed = false;
  let signal;
  Object.defineProperty(object, "signal", {
    enumerable: true,
    get: () => {
      signal ??= getSignal();
      if (consumed) {
        return signal;
      }
      consumed = true;
      if (signal.aborted) {
        onCancelled();
      } else {
        signal.addEventListener("abort", onCancelled, { once: true });
      }
      return signal;
    }
  });
  return object;
}
var environmentManager = /* @__PURE__ */ (() => {
  let isServerFn = () => isServer;
  return {
    /**
     * Returns whether the current runtime should be treated as a server environment.
     */
    isServer() {
      return isServerFn();
    },
    /**
     * Overrides the server check globally.
     */
    setIsServer(isServerValue) {
      isServerFn = isServerValue;
    }
  };
})();
function pendingThenable() {
  let resolve;
  let reject;
  const thenable = new Promise((_resolve, _reject) => {
    resolve = _resolve;
    reject = _reject;
  });
  thenable.status = "pending";
  thenable.catch(() => {
  });
  function finalize(data) {
    Object.assign(thenable, data);
    delete thenable.resolve;
    delete thenable.reject;
  }
  thenable.resolve = (value) => {
    finalize({
      status: "fulfilled",
      value
    });
    resolve(value);
  };
  thenable.reject = (reason) => {
    finalize({
      status: "rejected",
      reason
    });
    reject(reason);
  };
  return thenable;
}
var defaultScheduler = systemSetTimeoutZero;
function createNotifyManager() {
  let queue = [];
  let transactions = 0;
  let notifyFn = (callback) => {
    callback();
  };
  let batchNotifyFn = (callback) => {
    callback();
  };
  let scheduleFn = defaultScheduler;
  const schedule = (callback) => {
    if (transactions) {
      queue.push(callback);
    } else {
      scheduleFn(() => {
        notifyFn(callback);
      });
    }
  };
  const flush = () => {
    const originalQueue = queue;
    queue = [];
    if (originalQueue.length) {
      scheduleFn(() => {
        batchNotifyFn(() => {
          originalQueue.forEach((callback) => {
            notifyFn(callback);
          });
        });
      });
    }
  };
  return {
    batch: (callback) => {
      let result;
      transactions++;
      try {
        result = callback();
      } finally {
        transactions--;
        if (!transactions) {
          flush();
        }
      }
      return result;
    },
    /**
     * All calls to the wrapped function will be batched.
     */
    batchCalls: (callback) => {
      return (...args) => {
        schedule(() => {
          callback(...args);
        });
      };
    },
    schedule,
    /**
     * Use this method to set a custom notify function.
     * This can be used to for example wrap notifications with `React.act` while running tests.
     */
    setNotifyFunction: (fn) => {
      notifyFn = fn;
    },
    /**
     * Use this method to set a custom function to batch notifications together into a single tick.
     * By default React Query will use the batch function provided by ReactDOM or React Native.
     */
    setBatchNotifyFunction: (fn) => {
      batchNotifyFn = fn;
    },
    setScheduler: (fn) => {
      scheduleFn = fn;
    }
  };
}
var notifyManager = createNotifyManager();
var OnlineManager = class extends Subscribable {
  #online = true;
  #cleanup;
  #setup;
  constructor() {
    super();
    this.#setup = (onOnline) => {
      if (typeof window !== "undefined" && window.addEventListener) {
        const onlineListener = () => onOnline(true);
        const offlineListener = () => onOnline(false);
        window.addEventListener("online", onlineListener, false);
        window.addEventListener("offline", offlineListener, false);
        return () => {
          window.removeEventListener("online", onlineListener);
          window.removeEventListener("offline", offlineListener);
        };
      }
      return;
    };
  }
  onSubscribe() {
    if (!this.#cleanup) {
      this.setEventListener(this.#setup);
    }
  }
  onUnsubscribe() {
    if (!this.hasListeners()) {
      this.#cleanup?.();
      this.#cleanup = void 0;
    }
  }
  setEventListener(setup) {
    this.#setup = setup;
    this.#cleanup?.();
    this.#cleanup = setup(this.setOnline.bind(this));
  }
  setOnline(online) {
    const changed = this.#online !== online;
    if (changed) {
      this.#online = online;
      this.listeners.forEach((listener) => {
        listener(online);
      });
    }
  }
  isOnline() {
    return this.#online;
  }
};
var onlineManager = new OnlineManager();
function defaultRetryDelay(failureCount) {
  return Math.min(1e3 * 2 ** failureCount, 3e4);
}
function canFetch(networkMode) {
  return (networkMode ?? "online") === "online" ? onlineManager.isOnline() : true;
}
var CancelledError = class extends Error {
  constructor(options) {
    super("CancelledError");
    this.revert = options?.revert;
    this.silent = options?.silent;
  }
};
function createRetryer(config) {
  let isRetryCancelled = false;
  let failureCount = 0;
  let continueFn;
  const thenable = pendingThenable();
  const isResolved = () => thenable.status !== "pending";
  const cancel = (cancelOptions) => {
    if (!isResolved()) {
      const error = new CancelledError(cancelOptions);
      reject(error);
      config.onCancel?.(error);
    }
  };
  const cancelRetry = () => {
    isRetryCancelled = true;
  };
  const continueRetry = () => {
    isRetryCancelled = false;
  };
  const canContinue = () => focusManager.isFocused() && (config.networkMode === "always" || onlineManager.isOnline()) && config.canRun();
  const canStart = () => canFetch(config.networkMode) && config.canRun();
  const resolve = (value) => {
    if (!isResolved()) {
      continueFn?.();
      thenable.resolve(value);
    }
  };
  const reject = (value) => {
    if (!isResolved()) {
      continueFn?.();
      thenable.reject(value);
    }
  };
  const pause = () => {
    return new Promise((continueResolve) => {
      continueFn = (value) => {
        if (isResolved() || canContinue()) {
          continueResolve(value);
        }
      };
      config.onPause?.();
    }).then(() => {
      continueFn = void 0;
      if (!isResolved()) {
        config.onContinue?.();
      }
    });
  };
  const run = () => {
    if (isResolved()) {
      return;
    }
    let promiseOrValue;
    const initialPromise = failureCount === 0 ? config.initialPromise : void 0;
    try {
      promiseOrValue = initialPromise ?? config.fn();
    } catch (error) {
      promiseOrValue = Promise.reject(error);
    }
    Promise.resolve(promiseOrValue).then(resolve).catch((error) => {
      if (isResolved()) {
        return;
      }
      const retry = config.retry ?? (environmentManager.isServer() ? 0 : 3);
      const retryDelay = config.retryDelay ?? defaultRetryDelay;
      const delay2 = typeof retryDelay === "function" ? retryDelay(failureCount, error) : retryDelay;
      const shouldRetry = retry === true || typeof retry === "number" && failureCount < retry || typeof retry === "function" && retry(failureCount, error);
      if (isRetryCancelled || !shouldRetry) {
        reject(error);
        return;
      }
      failureCount++;
      config.onFail?.(failureCount, error);
      sleep(delay2).then(() => {
        return canContinue() ? void 0 : pause();
      }).then(() => {
        if (isRetryCancelled) {
          reject(error);
        } else {
          run();
        }
      });
    });
  };
  return {
    promise: thenable,
    status: () => thenable.status,
    cancel,
    continue: () => {
      continueFn?.();
      return thenable;
    },
    cancelRetry,
    continueRetry,
    canStart,
    start: () => {
      if (canStart()) {
        run();
      } else {
        pause().then(run);
      }
      return thenable;
    }
  };
}
var Removable = class {
  #gcTimeout;
  destroy() {
    this.clearGcTimeout();
  }
  scheduleGc() {
    this.clearGcTimeout();
    if (isValidTimeout(this.gcTime)) {
      this.#gcTimeout = timeoutManager.setTimeout(() => {
        this.optionalRemove();
      }, this.gcTime);
    }
  }
  updateGcTime(newGcTime) {
    this.gcTime = Math.max(
      this.gcTime || 0,
      newGcTime ?? (environmentManager.isServer() ? Infinity : 5 * 60 * 1e3)
    );
  }
  clearGcTimeout() {
    if (this.#gcTimeout !== void 0) {
      timeoutManager.clearTimeout(this.#gcTimeout);
      this.#gcTimeout = void 0;
    }
  }
};
function infiniteQueryBehavior(pages) {
  return {
    onFetch: (context, query) => {
      const options = context.options;
      const direction = context.fetchOptions?.meta?.fetchMore?.direction;
      const oldPages = context.state.data?.pages || [];
      const oldPageParams = context.state.data?.pageParams || [];
      let result = { pages: [], pageParams: [] };
      let currentPage = 0;
      const fetchFn = async () => {
        let cancelled = false;
        const addSignalProperty = (object) => {
          addConsumeAwareSignal(
            object,
            () => context.signal,
            () => cancelled = true
          );
        };
        const queryFn = ensureQueryFn(context.options, context.fetchOptions);
        const fetchPage = async (data, param, previous) => {
          if (cancelled) {
            return Promise.reject(context.signal.reason);
          }
          if (param == null && data.pages.length) {
            return Promise.resolve(data);
          }
          const createQueryFnContext = () => {
            const queryFnContext2 = {
              client: context.client,
              queryKey: context.queryKey,
              pageParam: param,
              direction: previous ? "backward" : "forward",
              meta: context.options.meta
            };
            addSignalProperty(queryFnContext2);
            return queryFnContext2;
          };
          const queryFnContext = createQueryFnContext();
          const page = await queryFn(queryFnContext);
          const { maxPages } = context.options;
          const addTo = previous ? addToStart : addToEnd;
          return {
            pages: addTo(data.pages, page, maxPages),
            pageParams: addTo(data.pageParams, param, maxPages)
          };
        };
        if (direction && oldPages.length) {
          const previous = direction === "backward";
          const pageParamFn = previous ? getPreviousPageParam : getNextPageParam;
          const oldData = {
            pages: oldPages,
            pageParams: oldPageParams
          };
          const param = pageParamFn(options, oldData);
          result = await fetchPage(oldData, param, previous);
        } else {
          const remainingPages = pages ?? oldPages.length;
          do {
            const param = currentPage === 0 ? oldPageParams[0] ?? options.initialPageParam : getNextPageParam(options, result);
            if (currentPage > 0 && param == null) {
              break;
            }
            result = await fetchPage(result, param);
            currentPage++;
          } while (currentPage < remainingPages);
        }
        return result;
      };
      if (context.options.persister) {
        context.fetchFn = () => {
          return context.options.persister?.(
            fetchFn,
            {
              client: context.client,
              queryKey: context.queryKey,
              meta: context.options.meta,
              signal: context.signal
            },
            query
          );
        };
      } else {
        context.fetchFn = fetchFn;
      }
    }
  };
}
function getNextPageParam(options, { pages, pageParams }) {
  const lastIndex = pages.length - 1;
  return pages.length > 0 ? options.getNextPageParam(
    pages[lastIndex],
    pages,
    pageParams[lastIndex],
    pageParams
  ) : void 0;
}
function getPreviousPageParam(options, { pages, pageParams }) {
  return pages.length > 0 ? options.getPreviousPageParam?.(pages[0], pages, pageParams[0], pageParams) : void 0;
}
var Query = class extends Removable {
  #queryType;
  #initialState;
  #revertState;
  #cache;
  #client;
  #retryer;
  #defaultOptions;
  #abortSignalConsumed;
  constructor(config) {
    super();
    this.#abortSignalConsumed = false;
    this.#defaultOptions = config.defaultOptions;
    this.setOptions(config.options);
    this.observers = [];
    this.#client = config.client;
    this.#cache = this.#client.getQueryCache();
    this.queryKey = config.queryKey;
    this.queryHash = config.queryHash;
    this.#initialState = getDefaultState$1(this.options);
    this.state = config.state ?? this.#initialState;
    this.scheduleGc();
  }
  get meta() {
    return this.options.meta;
  }
  get queryType() {
    return this.#queryType;
  }
  get promise() {
    return this.#retryer?.promise;
  }
  setOptions(options) {
    this.options = { ...this.#defaultOptions, ...options };
    if (options?._type) {
      this.#queryType = options._type;
    }
    this.updateGcTime(this.options.gcTime);
    if (this.state && this.state.data === void 0) {
      const defaultState = getDefaultState$1(this.options);
      if (defaultState.data !== void 0) {
        this.setState(
          successState(defaultState.data, defaultState.dataUpdatedAt)
        );
        this.#initialState = defaultState;
      }
    }
  }
  optionalRemove() {
    if (!this.observers.length && this.state.fetchStatus === "idle") {
      this.#cache.remove(this);
    }
  }
  setData(newData, options) {
    const data = replaceData(this.state.data, newData, this.options);
    this.#dispatch({
      data,
      type: "success",
      dataUpdatedAt: options?.updatedAt,
      manual: options?.manual
    });
    return data;
  }
  setState(state) {
    this.#dispatch({ type: "setState", state });
  }
  cancel(options) {
    const promise = this.#retryer?.promise;
    this.#retryer?.cancel(options);
    return promise ? promise.then(noop$1).catch(noop$1) : Promise.resolve();
  }
  destroy() {
    super.destroy();
    this.cancel({ silent: true });
  }
  get resetState() {
    return this.#initialState;
  }
  reset() {
    this.destroy();
    this.setState(this.resetState);
  }
  isActive() {
    return this.observers.some(
      (observer2) => resolveQueryBoolean(observer2.options.enabled, this) !== false
    );
  }
  isDisabled() {
    if (this.getObserversCount() > 0) {
      return !this.isActive();
    }
    return this.options.queryFn === skipToken || !this.isFetched();
  }
  isFetched() {
    return this.state.dataUpdateCount + this.state.errorUpdateCount > 0;
  }
  isStatic() {
    if (this.getObserversCount() > 0) {
      return this.observers.some(
        (observer2) => resolveStaleTime(observer2.options.staleTime, this) === "static"
      );
    }
    return false;
  }
  isStale() {
    if (this.getObserversCount() > 0) {
      return this.observers.some(
        (observer2) => observer2.getCurrentResult().isStale
      );
    }
    return this.state.data === void 0 || this.state.isInvalidated;
  }
  isStaleByTime(staleTime = 0) {
    if (this.state.data === void 0) {
      return true;
    }
    if (staleTime === "static") {
      return false;
    }
    if (this.state.isInvalidated) {
      return true;
    }
    return !timeUntilStale(this.state.dataUpdatedAt, staleTime);
  }
  onFocus() {
    const observer2 = this.observers.find((x) => x.shouldFetchOnWindowFocus());
    observer2?.refetch({ cancelRefetch: false });
    this.#retryer?.continue();
  }
  onOnline() {
    const observer2 = this.observers.find((x) => x.shouldFetchOnReconnect());
    observer2?.refetch({ cancelRefetch: false });
    this.#retryer?.continue();
  }
  addObserver(observer2) {
    if (!this.observers.includes(observer2)) {
      this.observers.push(observer2);
      this.clearGcTimeout();
      this.#cache.notify({ type: "observerAdded", query: this, observer: observer2 });
    }
  }
  removeObserver(observer2) {
    if (this.observers.includes(observer2)) {
      this.observers = this.observers.filter((x) => x !== observer2);
      if (!this.observers.length) {
        if (this.#retryer) {
          if (this.#abortSignalConsumed || this.#isInitialPausedFetch()) {
            this.#retryer.cancel({ revert: true });
          } else {
            this.#retryer.cancelRetry();
          }
        }
        this.scheduleGc();
      }
      this.#cache.notify({ type: "observerRemoved", query: this, observer: observer2 });
    }
  }
  getObserversCount() {
    return this.observers.length;
  }
  #isInitialPausedFetch() {
    return this.state.fetchStatus === "paused" && this.state.status === "pending";
  }
  invalidate() {
    if (!this.state.isInvalidated) {
      this.#dispatch({ type: "invalidate" });
    }
  }
  async fetch(options, fetchOptions) {
    if (this.state.fetchStatus !== "idle" && // If the promise in the retryer is already rejected, we have to definitely
    // re-start the fetch; there is a chance that the query is still in a
    // pending state when that happens
    this.#retryer?.status() !== "rejected") {
      if (this.state.data !== void 0 && fetchOptions?.cancelRefetch) {
        this.cancel({ silent: true });
      } else if (this.#retryer) {
        this.#retryer.continueRetry();
        return this.#retryer.promise;
      }
    }
    if (options) {
      this.setOptions(options);
    }
    if (!this.options.queryFn) {
      const observer2 = this.observers.find((x) => x.options.queryFn);
      if (observer2) {
        this.setOptions(observer2.options);
      }
    }
    const abortController = new AbortController();
    const addSignalProperty = (object) => {
      Object.defineProperty(object, "signal", {
        enumerable: true,
        get: () => {
          this.#abortSignalConsumed = true;
          return abortController.signal;
        }
      });
    };
    const fetchFn = () => {
      const queryFn = ensureQueryFn(this.options, fetchOptions);
      const createQueryFnContext = () => {
        const queryFnContext2 = {
          client: this.#client,
          queryKey: this.queryKey,
          meta: this.meta
        };
        addSignalProperty(queryFnContext2);
        return queryFnContext2;
      };
      const queryFnContext = createQueryFnContext();
      this.#abortSignalConsumed = false;
      if (this.options.persister) {
        return this.options.persister(
          queryFn,
          queryFnContext,
          this
        );
      }
      return queryFn(queryFnContext);
    };
    const createFetchContext = () => {
      const context2 = {
        fetchOptions,
        options: this.options,
        queryKey: this.queryKey,
        client: this.#client,
        state: this.state,
        fetchFn
      };
      addSignalProperty(context2);
      return context2;
    };
    const context = createFetchContext();
    const behavior = this.#queryType === "infinite" ? infiniteQueryBehavior(
      this.options.pages
    ) : this.options.behavior;
    behavior?.onFetch(context, this);
    this.#revertState = this.state;
    if (this.state.fetchStatus === "idle" || this.state.fetchMeta !== context.fetchOptions?.meta) {
      this.#dispatch({ type: "fetch", meta: context.fetchOptions?.meta });
    }
    this.#retryer = createRetryer({
      initialPromise: fetchOptions?.initialPromise,
      fn: context.fetchFn,
      onCancel: (error) => {
        if (error instanceof CancelledError && error.revert) {
          this.setState({
            ...this.#revertState,
            fetchStatus: "idle"
          });
        }
        abortController.abort();
      },
      onFail: (failureCount, error) => {
        this.#dispatch({ type: "failed", failureCount, error });
      },
      onPause: () => {
        this.#dispatch({ type: "pause" });
      },
      onContinue: () => {
        this.#dispatch({ type: "continue" });
      },
      retry: context.options.retry,
      retryDelay: context.options.retryDelay,
      networkMode: context.options.networkMode,
      canRun: () => true
    });
    try {
      const data = await this.#retryer.start();
      if (data === void 0) {
        if (false) ;
        throw new Error(`${this.queryHash} data is undefined`);
      }
      this.setData(data);
      this.#cache.config.onSuccess?.(data, this);
      this.#cache.config.onSettled?.(
        data,
        this.state.error,
        this
      );
      return data;
    } catch (error) {
      if (error instanceof CancelledError) {
        if (error.silent) {
          return this.#retryer.promise;
        } else if (error.revert) {
          if (this.state.data === void 0) {
            throw error;
          }
          return this.state.data;
        }
      }
      this.#dispatch({
        type: "error",
        error
      });
      this.#cache.config.onError?.(
        error,
        this
      );
      this.#cache.config.onSettled?.(
        this.state.data,
        error,
        this
      );
      throw error;
    } finally {
      this.scheduleGc();
    }
  }
  #dispatch(action) {
    const reducer = (state) => {
      switch (action.type) {
        case "failed":
          return {
            ...state,
            fetchFailureCount: action.failureCount,
            fetchFailureReason: action.error
          };
        case "pause":
          return {
            ...state,
            fetchStatus: "paused"
          };
        case "continue":
          return {
            ...state,
            fetchStatus: "fetching"
          };
        case "fetch":
          return {
            ...state,
            ...fetchState(state.data, this.options),
            fetchMeta: action.meta ?? null
          };
        case "success":
          const newState = {
            ...state,
            ...successState(action.data, action.dataUpdatedAt),
            dataUpdateCount: state.dataUpdateCount + 1,
            ...!action.manual && {
              fetchStatus: "idle",
              fetchFailureCount: 0,
              fetchFailureReason: null
            }
          };
          this.#revertState = action.manual ? newState : void 0;
          return newState;
        case "error":
          const error = action.error;
          return {
            ...state,
            error,
            errorUpdateCount: state.errorUpdateCount + 1,
            errorUpdatedAt: Date.now(),
            fetchFailureCount: state.fetchFailureCount + 1,
            fetchFailureReason: error,
            fetchStatus: "idle",
            status: "error",
            // flag existing data as invalidated if we get a background error
            // note that "no data" always means stale so we can set unconditionally here
            isInvalidated: true
          };
        case "invalidate":
          return {
            ...state,
            isInvalidated: true
          };
        case "setState":
          return {
            ...state,
            ...action.state
          };
      }
    };
    this.state = reducer(this.state);
    notifyManager.batch(() => {
      this.observers.forEach((observer2) => {
        observer2.onQueryUpdate();
      });
      this.#cache.notify({ query: this, type: "updated", action });
    });
  }
};
function fetchState(data, options) {
  return {
    fetchFailureCount: 0,
    fetchFailureReason: null,
    fetchStatus: canFetch(options.networkMode) ? "fetching" : "paused",
    ...data === void 0 && {
      error: null,
      status: "pending"
    }
  };
}
function successState(data, dataUpdatedAt) {
  return {
    data,
    dataUpdatedAt: dataUpdatedAt ?? Date.now(),
    error: null,
    isInvalidated: false,
    status: "success"
  };
}
function getDefaultState$1(options) {
  const data = typeof options.initialData === "function" ? options.initialData() : options.initialData;
  const hasData = data !== void 0;
  const initialDataUpdatedAt = hasData ? typeof options.initialDataUpdatedAt === "function" ? options.initialDataUpdatedAt() : options.initialDataUpdatedAt : 0;
  return {
    data,
    dataUpdateCount: 0,
    dataUpdatedAt: hasData ? initialDataUpdatedAt ?? Date.now() : 0,
    error: null,
    errorUpdateCount: 0,
    errorUpdatedAt: 0,
    fetchFailureCount: 0,
    fetchFailureReason: null,
    fetchMeta: null,
    isInvalidated: false,
    status: hasData ? "success" : "pending",
    fetchStatus: "idle"
  };
}
var Mutation = class extends Removable {
  #client;
  #observers;
  #mutationCache;
  #retryer;
  constructor(config) {
    super();
    this.#client = config.client;
    this.mutationId = config.mutationId;
    this.#mutationCache = config.mutationCache;
    this.#observers = [];
    this.state = config.state || getDefaultState();
    this.setOptions(config.options);
    this.scheduleGc();
  }
  setOptions(options) {
    this.options = options;
    this.updateGcTime(this.options.gcTime);
  }
  get meta() {
    return this.options.meta;
  }
  addObserver(observer2) {
    if (!this.#observers.includes(observer2)) {
      this.#observers.push(observer2);
      this.clearGcTimeout();
      this.#mutationCache.notify({
        type: "observerAdded",
        mutation: this,
        observer: observer2
      });
    }
  }
  removeObserver(observer2) {
    this.#observers = this.#observers.filter((x) => x !== observer2);
    this.scheduleGc();
    this.#mutationCache.notify({
      type: "observerRemoved",
      mutation: this,
      observer: observer2
    });
  }
  optionalRemove() {
    if (!this.#observers.length) {
      if (this.state.status === "pending") {
        this.scheduleGc();
      } else {
        this.#mutationCache.remove(this);
      }
    }
  }
  continue() {
    return this.#retryer?.continue() ?? // continuing a mutation assumes that variables are set, mutation must have been dehydrated before
    this.execute(this.state.variables);
  }
  async execute(variables) {
    const onContinue = () => {
      this.#dispatch({ type: "continue" });
    };
    const mutationFnContext = {
      client: this.#client,
      meta: this.options.meta,
      mutationKey: this.options.mutationKey
    };
    this.#retryer = createRetryer({
      fn: () => {
        if (!this.options.mutationFn) {
          return Promise.reject(new Error("No mutationFn found"));
        }
        return this.options.mutationFn(variables, mutationFnContext);
      },
      onFail: (failureCount, error) => {
        this.#dispatch({ type: "failed", failureCount, error });
      },
      onPause: () => {
        this.#dispatch({ type: "pause" });
      },
      onContinue,
      retry: this.options.retry ?? 0,
      retryDelay: this.options.retryDelay,
      networkMode: this.options.networkMode,
      canRun: () => this.#mutationCache.canRun(this)
    });
    const restored = this.state.status === "pending";
    const isPaused = !this.#retryer.canStart();
    try {
      if (restored) {
        onContinue();
      } else {
        this.#dispatch({ type: "pending", variables, isPaused });
        if (this.#mutationCache.config.onMutate) {
          await this.#mutationCache.config.onMutate(
            variables,
            this,
            mutationFnContext
          );
        }
        const context = await this.options.onMutate?.(
          variables,
          mutationFnContext
        );
        if (context !== this.state.context) {
          this.#dispatch({
            type: "pending",
            context,
            variables,
            isPaused
          });
        }
      }
      const data = await this.#retryer.start();
      await this.#mutationCache.config.onSuccess?.(
        data,
        variables,
        this.state.context,
        this,
        mutationFnContext
      );
      await this.options.onSuccess?.(
        data,
        variables,
        this.state.context,
        mutationFnContext
      );
      await this.#mutationCache.config.onSettled?.(
        data,
        null,
        this.state.variables,
        this.state.context,
        this,
        mutationFnContext
      );
      await this.options.onSettled?.(
        data,
        null,
        variables,
        this.state.context,
        mutationFnContext
      );
      this.#dispatch({ type: "success", data });
      return data;
    } catch (error) {
      try {
        await this.#mutationCache.config.onError?.(
          error,
          variables,
          this.state.context,
          this,
          mutationFnContext
        );
      } catch (e) {
        void Promise.reject(e);
      }
      try {
        await this.options.onError?.(
          error,
          variables,
          this.state.context,
          mutationFnContext
        );
      } catch (e) {
        void Promise.reject(e);
      }
      try {
        await this.#mutationCache.config.onSettled?.(
          void 0,
          error,
          this.state.variables,
          this.state.context,
          this,
          mutationFnContext
        );
      } catch (e) {
        void Promise.reject(e);
      }
      try {
        await this.options.onSettled?.(
          void 0,
          error,
          variables,
          this.state.context,
          mutationFnContext
        );
      } catch (e) {
        void Promise.reject(e);
      }
      this.#dispatch({ type: "error", error });
      throw error;
    } finally {
      this.#mutationCache.runNext(this);
    }
  }
  #dispatch(action) {
    const reducer = (state) => {
      switch (action.type) {
        case "failed":
          return {
            ...state,
            failureCount: action.failureCount,
            failureReason: action.error
          };
        case "pause":
          return {
            ...state,
            isPaused: true
          };
        case "continue":
          return {
            ...state,
            isPaused: false
          };
        case "pending":
          return {
            ...state,
            context: action.context,
            data: void 0,
            failureCount: 0,
            failureReason: null,
            error: null,
            isPaused: action.isPaused,
            status: "pending",
            variables: action.variables,
            submittedAt: Date.now()
          };
        case "success":
          return {
            ...state,
            data: action.data,
            failureCount: 0,
            failureReason: null,
            error: null,
            status: "success",
            isPaused: false
          };
        case "error":
          return {
            ...state,
            data: void 0,
            error: action.error,
            failureCount: state.failureCount + 1,
            failureReason: action.error,
            isPaused: false,
            status: "error"
          };
      }
    };
    this.state = reducer(this.state);
    notifyManager.batch(() => {
      this.#observers.forEach((observer2) => {
        observer2.onMutationUpdate(action);
      });
      this.#mutationCache.notify({
        mutation: this,
        type: "updated",
        action
      });
    });
  }
};
function getDefaultState() {
  return {
    context: void 0,
    data: void 0,
    error: null,
    failureCount: 0,
    failureReason: null,
    isPaused: false,
    status: "idle",
    variables: void 0,
    submittedAt: 0
  };
}
var MutationCache = class extends Subscribable {
  constructor(config = {}) {
    super();
    this.config = config;
    this.#mutations = /* @__PURE__ */ new Set();
    this.#scopes = /* @__PURE__ */ new Map();
    this.#mutationId = 0;
  }
  #mutations;
  #scopes;
  #mutationId;
  build(client, options, state) {
    const mutation = new Mutation({
      client,
      mutationCache: this,
      mutationId: ++this.#mutationId,
      options: client.defaultMutationOptions(options),
      state
    });
    this.add(mutation);
    return mutation;
  }
  add(mutation) {
    this.#mutations.add(mutation);
    const scope = scopeFor(mutation);
    if (typeof scope === "string") {
      const scopedMutations = this.#scopes.get(scope);
      if (scopedMutations) {
        scopedMutations.push(mutation);
      } else {
        this.#scopes.set(scope, [mutation]);
      }
    }
    this.notify({ type: "added", mutation });
  }
  remove(mutation) {
    if (this.#mutations.delete(mutation)) {
      const scope = scopeFor(mutation);
      if (typeof scope === "string") {
        const scopedMutations = this.#scopes.get(scope);
        if (scopedMutations) {
          if (scopedMutations.length > 1) {
            const index = scopedMutations.indexOf(mutation);
            if (index !== -1) {
              scopedMutations.splice(index, 1);
            }
          } else if (scopedMutations[0] === mutation) {
            this.#scopes.delete(scope);
          }
        }
      }
    }
    this.notify({ type: "removed", mutation });
  }
  canRun(mutation) {
    const scope = scopeFor(mutation);
    if (typeof scope === "string") {
      const mutationsWithSameScope = this.#scopes.get(scope);
      const firstPendingMutation = mutationsWithSameScope?.find(
        (m) => m.state.status === "pending"
      );
      return !firstPendingMutation || firstPendingMutation === mutation;
    } else {
      return true;
    }
  }
  runNext(mutation) {
    const scope = scopeFor(mutation);
    if (typeof scope === "string") {
      const foundMutation = this.#scopes.get(scope)?.find((m) => m !== mutation && m.state.isPaused);
      return foundMutation?.continue() ?? Promise.resolve();
    } else {
      return Promise.resolve();
    }
  }
  clear() {
    notifyManager.batch(() => {
      this.#mutations.forEach((mutation) => {
        this.notify({ type: "removed", mutation });
      });
      this.#mutations.clear();
      this.#scopes.clear();
    });
  }
  getAll() {
    return Array.from(this.#mutations);
  }
  find(filters) {
    const defaultedFilters = { exact: true, ...filters };
    return this.getAll().find(
      (mutation) => matchMutation(defaultedFilters, mutation)
    );
  }
  findAll(filters = {}) {
    return this.getAll().filter((mutation) => matchMutation(filters, mutation));
  }
  notify(event) {
    notifyManager.batch(() => {
      this.listeners.forEach((listener) => {
        listener(event);
      });
    });
  }
  resumePausedMutations() {
    const pausedMutations = this.getAll().filter((x) => x.state.isPaused);
    return notifyManager.batch(
      () => Promise.all(
        pausedMutations.map((mutation) => mutation.continue().catch(noop$1))
      )
    );
  }
};
function scopeFor(mutation) {
  return mutation.options.scope?.id;
}
var QueryCache = class extends Subscribable {
  constructor(config = {}) {
    super();
    this.config = config;
    this.#queries = /* @__PURE__ */ new Map();
  }
  #queries;
  build(client, options, state) {
    const queryKey = options.queryKey;
    const queryHash = options.queryHash ?? hashQueryKeyByOptions(queryKey, options);
    let query = this.get(queryHash);
    if (!query) {
      query = new Query({
        client,
        queryKey,
        queryHash,
        options: client.defaultQueryOptions(options),
        state,
        defaultOptions: client.getQueryDefaults(queryKey)
      });
      this.add(query);
    }
    return query;
  }
  add(query) {
    if (!this.#queries.has(query.queryHash)) {
      this.#queries.set(query.queryHash, query);
      this.notify({
        type: "added",
        query
      });
    }
  }
  remove(query) {
    const queryInMap = this.#queries.get(query.queryHash);
    if (queryInMap) {
      query.destroy();
      if (queryInMap === query) {
        this.#queries.delete(query.queryHash);
      }
      this.notify({ type: "removed", query });
    }
  }
  clear() {
    notifyManager.batch(() => {
      this.getAll().forEach((query) => {
        this.remove(query);
      });
    });
  }
  get(queryHash) {
    return this.#queries.get(queryHash);
  }
  getAll() {
    return [...this.#queries.values()];
  }
  find(filters) {
    const defaultedFilters = { exact: true, ...filters };
    return this.getAll().find(
      (query) => matchQuery(defaultedFilters, query)
    );
  }
  findAll(filters = {}) {
    const queries = this.getAll();
    return Object.keys(filters).length > 0 ? queries.filter((query) => matchQuery(filters, query)) : queries;
  }
  notify(event) {
    notifyManager.batch(() => {
      this.listeners.forEach((listener) => {
        listener(event);
      });
    });
  }
  onFocus() {
    notifyManager.batch(() => {
      this.getAll().forEach((query) => {
        query.onFocus();
      });
    });
  }
  onOnline() {
    notifyManager.batch(() => {
      this.getAll().forEach((query) => {
        query.onOnline();
      });
    });
  }
};
var QueryClient = class {
  #queryCache;
  #mutationCache;
  #defaultOptions;
  #queryDefaults;
  #mutationDefaults;
  #mountCount;
  #unsubscribeFocus;
  #unsubscribeOnline;
  constructor(config = {}) {
    this.#queryCache = config.queryCache || new QueryCache();
    this.#mutationCache = config.mutationCache || new MutationCache();
    this.#defaultOptions = config.defaultOptions || {};
    this.#queryDefaults = /* @__PURE__ */ new Map();
    this.#mutationDefaults = /* @__PURE__ */ new Map();
    this.#mountCount = 0;
  }
  mount() {
    this.#mountCount++;
    if (this.#mountCount !== 1) return;
    this.#unsubscribeFocus = focusManager.subscribe(async (focused) => {
      if (focused) {
        await this.resumePausedMutations();
        this.#queryCache.onFocus();
      }
    });
    this.#unsubscribeOnline = onlineManager.subscribe(async (online) => {
      if (online) {
        await this.resumePausedMutations();
        this.#queryCache.onOnline();
      }
    });
  }
  unmount() {
    this.#mountCount--;
    if (this.#mountCount !== 0) return;
    this.#unsubscribeFocus?.();
    this.#unsubscribeFocus = void 0;
    this.#unsubscribeOnline?.();
    this.#unsubscribeOnline = void 0;
  }
  isFetching(filters) {
    return this.#queryCache.findAll({ ...filters, fetchStatus: "fetching" }).length;
  }
  isMutating(filters) {
    return this.#mutationCache.findAll({ ...filters, status: "pending" }).length;
  }
  /**
   * Imperative (non-reactive) way to retrieve data for a QueryKey.
   * Should only be used in callbacks or functions where reading the latest data is necessary, e.g. for optimistic updates.
   *
   * Hint: Do not use this function inside a component, because it won't receive updates.
   * Use `useQuery` to create a `QueryObserver` that subscribes to changes.
   */
  getQueryData(queryKey) {
    const options = this.defaultQueryOptions({ queryKey });
    return this.#queryCache.get(options.queryHash)?.state.data;
  }
  ensureQueryData(options) {
    const defaultedOptions = this.defaultQueryOptions(options);
    const query = this.#queryCache.build(this, defaultedOptions);
    const cachedData = query.state.data;
    if (cachedData === void 0) {
      return this.fetchQuery(options);
    }
    if (options.revalidateIfStale && query.isStaleByTime(resolveStaleTime(defaultedOptions.staleTime, query))) {
      void this.prefetchQuery(defaultedOptions);
    }
    return Promise.resolve(cachedData);
  }
  getQueriesData(filters) {
    return this.#queryCache.findAll(filters).map(({ queryKey, state }) => {
      const data = state.data;
      return [queryKey, data];
    });
  }
  setQueryData(queryKey, updater, options) {
    const defaultedOptions = this.defaultQueryOptions({ queryKey });
    const query = this.#queryCache.get(
      defaultedOptions.queryHash
    );
    const prevData = query?.state.data;
    const data = functionalUpdate(updater, prevData);
    if (data === void 0) {
      return void 0;
    }
    return this.#queryCache.build(this, defaultedOptions).setData(data, { ...options, manual: true });
  }
  setQueriesData(filters, updater, options) {
    return notifyManager.batch(
      () => this.#queryCache.findAll(filters).map(({ queryKey }) => [
        queryKey,
        this.setQueryData(queryKey, updater, options)
      ])
    );
  }
  getQueryState(queryKey) {
    const options = this.defaultQueryOptions({ queryKey });
    return this.#queryCache.get(
      options.queryHash
    )?.state;
  }
  removeQueries(filters) {
    const queryCache = this.#queryCache;
    notifyManager.batch(() => {
      queryCache.findAll(filters).forEach((query) => {
        queryCache.remove(query);
      });
    });
  }
  resetQueries(filters, options) {
    const queryCache = this.#queryCache;
    return notifyManager.batch(() => {
      queryCache.findAll(filters).forEach((query) => {
        query.reset();
      });
      return this.refetchQueries(
        {
          type: "active",
          ...filters
        },
        options
      );
    });
  }
  cancelQueries(filters, cancelOptions = {}) {
    const defaultedCancelOptions = { revert: true, ...cancelOptions };
    const promises = notifyManager.batch(
      () => this.#queryCache.findAll(filters).map((query) => query.cancel(defaultedCancelOptions))
    );
    return Promise.all(promises).then(noop$1).catch(noop$1);
  }
  invalidateQueries(filters, options = {}) {
    return notifyManager.batch(() => {
      this.#queryCache.findAll(filters).forEach((query) => {
        query.invalidate();
      });
      if (filters?.refetchType === "none") {
        return Promise.resolve();
      }
      return this.refetchQueries(
        {
          ...filters,
          type: filters?.refetchType ?? filters?.type ?? "active"
        },
        options
      );
    });
  }
  refetchQueries(filters, options = {}) {
    const fetchOptions = {
      ...options,
      cancelRefetch: options.cancelRefetch ?? true
    };
    const promises = notifyManager.batch(
      () => this.#queryCache.findAll(filters).filter((query) => !query.isDisabled() && !query.isStatic()).map((query) => {
        let promise = query.fetch(void 0, fetchOptions);
        if (!fetchOptions.throwOnError) {
          promise = promise.catch(noop$1);
        }
        return query.state.fetchStatus === "paused" ? Promise.resolve() : promise;
      })
    );
    return Promise.all(promises).then(noop$1);
  }
  fetchQuery(options) {
    const defaultedOptions = this.defaultQueryOptions(options);
    if (defaultedOptions.retry === void 0) {
      defaultedOptions.retry = false;
    }
    const query = this.#queryCache.build(this, defaultedOptions);
    return query.isStaleByTime(
      resolveStaleTime(defaultedOptions.staleTime, query)
    ) ? query.fetch(defaultedOptions) : Promise.resolve(query.state.data);
  }
  prefetchQuery(options) {
    return this.fetchQuery(options).then(noop$1).catch(noop$1);
  }
  fetchInfiniteQuery(options) {
    options._type = "infinite";
    return this.fetchQuery(options);
  }
  prefetchInfiniteQuery(options) {
    return this.fetchInfiniteQuery(options).then(noop$1).catch(noop$1);
  }
  ensureInfiniteQueryData(options) {
    options._type = "infinite";
    return this.ensureQueryData(options);
  }
  resumePausedMutations() {
    if (onlineManager.isOnline()) {
      return this.#mutationCache.resumePausedMutations();
    }
    return Promise.resolve();
  }
  getQueryCache() {
    return this.#queryCache;
  }
  getMutationCache() {
    return this.#mutationCache;
  }
  getDefaultOptions() {
    return this.#defaultOptions;
  }
  setDefaultOptions(options) {
    this.#defaultOptions = options;
  }
  setQueryDefaults(queryKey, options) {
    this.#queryDefaults.set(hashKey(queryKey), {
      queryKey,
      defaultOptions: options
    });
  }
  getQueryDefaults(queryKey) {
    const defaults = [...this.#queryDefaults.values()];
    const result = {};
    defaults.forEach((queryDefault) => {
      if (partialMatchKey(queryKey, queryDefault.queryKey)) {
        Object.assign(result, queryDefault.defaultOptions);
      }
    });
    return result;
  }
  setMutationDefaults(mutationKey, options) {
    this.#mutationDefaults.set(hashKey(mutationKey), {
      mutationKey,
      defaultOptions: options
    });
  }
  getMutationDefaults(mutationKey) {
    const defaults = [...this.#mutationDefaults.values()];
    const result = {};
    defaults.forEach((queryDefault) => {
      if (partialMatchKey(mutationKey, queryDefault.mutationKey)) {
        Object.assign(result, queryDefault.defaultOptions);
      }
    });
    return result;
  }
  defaultQueryOptions(options) {
    if (options._defaulted) {
      return options;
    }
    const defaultedOptions = {
      ...this.#defaultOptions.queries,
      ...this.getQueryDefaults(options.queryKey),
      ...options,
      _defaulted: true
    };
    if (!defaultedOptions.queryHash) {
      defaultedOptions.queryHash = hashQueryKeyByOptions(
        defaultedOptions.queryKey,
        defaultedOptions
      );
    }
    if (defaultedOptions.refetchOnReconnect === void 0) {
      defaultedOptions.refetchOnReconnect = defaultedOptions.networkMode !== "always";
    }
    if (defaultedOptions.throwOnError === void 0) {
      defaultedOptions.throwOnError = !!defaultedOptions.suspense;
    }
    if (!defaultedOptions.networkMode && defaultedOptions.persister) {
      defaultedOptions.networkMode = "offlineFirst";
    }
    if (defaultedOptions.queryFn === skipToken) {
      defaultedOptions.enabled = false;
    }
    return defaultedOptions;
  }
  defaultMutationOptions(options) {
    if (options?._defaulted) {
      return options;
    }
    return {
      ...this.#defaultOptions.mutations,
      ...options?.mutationKey && this.getMutationDefaults(options.mutationKey),
      ...options,
      _defaulted: true
    };
  }
  clear() {
    this.#queryCache.clear();
    this.#mutationCache.clear();
  }
};
var QueryClientContext = reactExports.createContext(
  void 0
);
var QueryClientProvider = ({
  client,
  children
}) => {
  reactExports.useEffect(() => {
    client.mount();
    return () => {
      client.unmount();
    };
  }, [client]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(QueryClientContext.Provider, { value: client, children });
};
function __insertCSS(code) {
  if (typeof document == "undefined") return;
  let head = document.head || document.getElementsByTagName("head")[0];
  let style = document.createElement("style");
  style.type = "text/css";
  head.appendChild(style);
  style.styleSheet ? style.styleSheet.cssText = code : style.appendChild(document.createTextNode(code));
}
const getAsset = (type) => {
  switch (type) {
    case "success":
      return SuccessIcon;
    case "info":
      return InfoIcon;
    case "warning":
      return WarningIcon;
    case "error":
      return ErrorIcon;
    default:
      return null;
  }
};
const bars = Array(12).fill(0);
const Loader = ({ visible, className }) => {
  return /* @__PURE__ */ React.createElement("div", {
    className: [
      "sonner-loading-wrapper",
      className
    ].filter(Boolean).join(" "),
    "data-visible": visible
  }, /* @__PURE__ */ React.createElement("div", {
    className: "sonner-spinner"
  }, bars.map((_, i) => /* @__PURE__ */ React.createElement("div", {
    className: "sonner-loading-bar",
    key: `spinner-bar-${i}`
  }))));
};
const SuccessIcon = /* @__PURE__ */ React.createElement("svg", {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 20 20",
  fill: "currentColor",
  height: "20",
  width: "20"
}, /* @__PURE__ */ React.createElement("path", {
  fillRule: "evenodd",
  d: "M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z",
  clipRule: "evenodd"
}));
const WarningIcon = /* @__PURE__ */ React.createElement("svg", {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  fill: "currentColor",
  height: "20",
  width: "20"
}, /* @__PURE__ */ React.createElement("path", {
  fillRule: "evenodd",
  d: "M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z",
  clipRule: "evenodd"
}));
const InfoIcon = /* @__PURE__ */ React.createElement("svg", {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 20 20",
  fill: "currentColor",
  height: "20",
  width: "20"
}, /* @__PURE__ */ React.createElement("path", {
  fillRule: "evenodd",
  d: "M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z",
  clipRule: "evenodd"
}));
const ErrorIcon = /* @__PURE__ */ React.createElement("svg", {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 20 20",
  fill: "currentColor",
  height: "20",
  width: "20"
}, /* @__PURE__ */ React.createElement("path", {
  fillRule: "evenodd",
  d: "M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z",
  clipRule: "evenodd"
}));
const CloseIcon = /* @__PURE__ */ React.createElement("svg", {
  xmlns: "http://www.w3.org/2000/svg",
  width: "12",
  height: "12",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "1.5",
  strokeLinecap: "round",
  strokeLinejoin: "round"
}, /* @__PURE__ */ React.createElement("line", {
  x1: "18",
  y1: "6",
  x2: "6",
  y2: "18"
}), /* @__PURE__ */ React.createElement("line", {
  x1: "6",
  y1: "6",
  x2: "18",
  y2: "18"
}));
const useIsDocumentHidden = () => {
  const [isDocumentHidden, setIsDocumentHidden] = React.useState(document.hidden);
  React.useEffect(() => {
    const callback = () => {
      setIsDocumentHidden(document.hidden);
    };
    document.addEventListener("visibilitychange", callback);
    return () => window.removeEventListener("visibilitychange", callback);
  }, []);
  return isDocumentHidden;
};
let toastsCounter = 1;
class Observer {
  constructor() {
    this.subscribe = (subscriber) => {
      this.subscribers.push(subscriber);
      return () => {
        const index = this.subscribers.indexOf(subscriber);
        this.subscribers.splice(index, 1);
      };
    };
    this.publish = (data) => {
      this.subscribers.forEach((subscriber) => subscriber(data));
    };
    this.addToast = (data) => {
      this.publish(data);
      this.toasts = [
        ...this.toasts,
        data
      ];
    };
    this.create = (data) => {
      var _data_id;
      const { message, ...rest } = data;
      const id2 = typeof (data == null ? void 0 : data.id) === "number" || ((_data_id = data.id) == null ? void 0 : _data_id.length) > 0 ? data.id : toastsCounter++;
      const alreadyExists = this.toasts.find((toast2) => {
        return toast2.id === id2;
      });
      const dismissible = data.dismissible === void 0 ? true : data.dismissible;
      if (this.dismissedToasts.has(id2)) {
        this.dismissedToasts.delete(id2);
      }
      if (alreadyExists) {
        this.toasts = this.toasts.map((toast2) => {
          if (toast2.id === id2) {
            this.publish({
              ...toast2,
              ...data,
              id: id2,
              title: message
            });
            return {
              ...toast2,
              ...data,
              id: id2,
              dismissible,
              title: message
            };
          }
          return toast2;
        });
      } else {
        this.addToast({
          title: message,
          ...rest,
          dismissible,
          id: id2
        });
      }
      return id2;
    };
    this.dismiss = (id2) => {
      if (id2) {
        this.dismissedToasts.add(id2);
        requestAnimationFrame(() => this.subscribers.forEach((subscriber) => subscriber({
          id: id2,
          dismiss: true
        })));
      } else {
        this.toasts.forEach((toast2) => {
          this.subscribers.forEach((subscriber) => subscriber({
            id: toast2.id,
            dismiss: true
          }));
        });
      }
      return id2;
    };
    this.message = (message, data) => {
      return this.create({
        ...data,
        message
      });
    };
    this.error = (message, data) => {
      return this.create({
        ...data,
        message,
        type: "error"
      });
    };
    this.success = (message, data) => {
      return this.create({
        ...data,
        type: "success",
        message
      });
    };
    this.info = (message, data) => {
      return this.create({
        ...data,
        type: "info",
        message
      });
    };
    this.warning = (message, data) => {
      return this.create({
        ...data,
        type: "warning",
        message
      });
    };
    this.loading = (message, data) => {
      return this.create({
        ...data,
        type: "loading",
        message
      });
    };
    this.promise = (promise, data) => {
      if (!data) {
        return;
      }
      let id2 = void 0;
      if (data.loading !== void 0) {
        id2 = this.create({
          ...data,
          promise,
          type: "loading",
          message: data.loading,
          description: typeof data.description !== "function" ? data.description : void 0
        });
      }
      const p = Promise.resolve(promise instanceof Function ? promise() : promise);
      let shouldDismiss = id2 !== void 0;
      let result;
      const originalPromise = p.then(async (response) => {
        result = [
          "resolve",
          response
        ];
        const isReactElementResponse = React.isValidElement(response);
        if (isReactElementResponse) {
          shouldDismiss = false;
          this.create({
            id: id2,
            type: "default",
            message: response
          });
        } else if (isHttpResponse(response) && !response.ok) {
          shouldDismiss = false;
          const promiseData = typeof data.error === "function" ? await data.error(`HTTP error! status: ${response.status}`) : data.error;
          const description = typeof data.description === "function" ? await data.description(`HTTP error! status: ${response.status}`) : data.description;
          const isExtendedResult = typeof promiseData === "object" && !React.isValidElement(promiseData);
          const toastSettings = isExtendedResult ? promiseData : {
            message: promiseData
          };
          this.create({
            id: id2,
            type: "error",
            description,
            ...toastSettings
          });
        } else if (response instanceof Error) {
          shouldDismiss = false;
          const promiseData = typeof data.error === "function" ? await data.error(response) : data.error;
          const description = typeof data.description === "function" ? await data.description(response) : data.description;
          const isExtendedResult = typeof promiseData === "object" && !React.isValidElement(promiseData);
          const toastSettings = isExtendedResult ? promiseData : {
            message: promiseData
          };
          this.create({
            id: id2,
            type: "error",
            description,
            ...toastSettings
          });
        } else if (data.success !== void 0) {
          shouldDismiss = false;
          const promiseData = typeof data.success === "function" ? await data.success(response) : data.success;
          const description = typeof data.description === "function" ? await data.description(response) : data.description;
          const isExtendedResult = typeof promiseData === "object" && !React.isValidElement(promiseData);
          const toastSettings = isExtendedResult ? promiseData : {
            message: promiseData
          };
          this.create({
            id: id2,
            type: "success",
            description,
            ...toastSettings
          });
        }
      }).catch(async (error) => {
        result = [
          "reject",
          error
        ];
        if (data.error !== void 0) {
          shouldDismiss = false;
          const promiseData = typeof data.error === "function" ? await data.error(error) : data.error;
          const description = typeof data.description === "function" ? await data.description(error) : data.description;
          const isExtendedResult = typeof promiseData === "object" && !React.isValidElement(promiseData);
          const toastSettings = isExtendedResult ? promiseData : {
            message: promiseData
          };
          this.create({
            id: id2,
            type: "error",
            description,
            ...toastSettings
          });
        }
      }).finally(() => {
        if (shouldDismiss) {
          this.dismiss(id2);
          id2 = void 0;
        }
        data.finally == null ? void 0 : data.finally.call(data);
      });
      const unwrap = () => new Promise((resolve, reject) => originalPromise.then(() => result[0] === "reject" ? reject(result[1]) : resolve(result[1])).catch(reject));
      if (typeof id2 !== "string" && typeof id2 !== "number") {
        return {
          unwrap
        };
      } else {
        return Object.assign(id2, {
          unwrap
        });
      }
    };
    this.custom = (jsx, data) => {
      const id2 = (data == null ? void 0 : data.id) || toastsCounter++;
      this.create({
        jsx: jsx(id2),
        id: id2,
        ...data
      });
      return id2;
    };
    this.getActiveToasts = () => {
      return this.toasts.filter((toast2) => !this.dismissedToasts.has(toast2.id));
    };
    this.subscribers = [];
    this.toasts = [];
    this.dismissedToasts = /* @__PURE__ */ new Set();
  }
}
const ToastState = new Observer();
const toastFunction = (message, data) => {
  const id2 = (data == null ? void 0 : data.id) || toastsCounter++;
  ToastState.addToast({
    title: message,
    ...data,
    id: id2
  });
  return id2;
};
const isHttpResponse = (data) => {
  return data && typeof data === "object" && "ok" in data && typeof data.ok === "boolean" && "status" in data && typeof data.status === "number";
};
const basicToast = toastFunction;
const getHistory = () => ToastState.toasts;
const getToasts = () => ToastState.getActiveToasts();
const toast = Object.assign(basicToast, {
  success: ToastState.success,
  info: ToastState.info,
  warning: ToastState.warning,
  error: ToastState.error,
  custom: ToastState.custom,
  message: ToastState.message,
  promise: ToastState.promise,
  dismiss: ToastState.dismiss,
  loading: ToastState.loading
}, {
  getHistory,
  getToasts
});
__insertCSS("[data-sonner-toaster][dir=ltr],html[dir=ltr]{--toast-icon-margin-start:-3px;--toast-icon-margin-end:4px;--toast-svg-margin-start:-1px;--toast-svg-margin-end:0px;--toast-button-margin-start:auto;--toast-button-margin-end:0;--toast-close-button-start:0;--toast-close-button-end:unset;--toast-close-button-transform:translate(-35%, -35%)}[data-sonner-toaster][dir=rtl],html[dir=rtl]{--toast-icon-margin-start:4px;--toast-icon-margin-end:-3px;--toast-svg-margin-start:0px;--toast-svg-margin-end:-1px;--toast-button-margin-start:0;--toast-button-margin-end:auto;--toast-close-button-start:unset;--toast-close-button-end:0;--toast-close-button-transform:translate(35%, -35%)}[data-sonner-toaster]{position:fixed;width:var(--width);font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;--gray1:hsl(0, 0%, 99%);--gray2:hsl(0, 0%, 97.3%);--gray3:hsl(0, 0%, 95.1%);--gray4:hsl(0, 0%, 93%);--gray5:hsl(0, 0%, 90.9%);--gray6:hsl(0, 0%, 88.7%);--gray7:hsl(0, 0%, 85.8%);--gray8:hsl(0, 0%, 78%);--gray9:hsl(0, 0%, 56.1%);--gray10:hsl(0, 0%, 52.3%);--gray11:hsl(0, 0%, 43.5%);--gray12:hsl(0, 0%, 9%);--border-radius:8px;box-sizing:border-box;padding:0;margin:0;list-style:none;outline:0;z-index:999999999;transition:transform .4s ease}@media (hover:none) and (pointer:coarse){[data-sonner-toaster][data-lifted=true]{transform:none}}[data-sonner-toaster][data-x-position=right]{right:var(--offset-right)}[data-sonner-toaster][data-x-position=left]{left:var(--offset-left)}[data-sonner-toaster][data-x-position=center]{left:50%;transform:translateX(-50%)}[data-sonner-toaster][data-y-position=top]{top:var(--offset-top)}[data-sonner-toaster][data-y-position=bottom]{bottom:var(--offset-bottom)}[data-sonner-toast]{--y:translateY(100%);--lift-amount:calc(var(--lift) * var(--gap));z-index:var(--z-index);position:absolute;opacity:0;transform:var(--y);touch-action:none;transition:transform .4s,opacity .4s,height .4s,box-shadow .2s;box-sizing:border-box;outline:0;overflow-wrap:anywhere}[data-sonner-toast][data-styled=true]{padding:16px;background:var(--normal-bg);border:1px solid var(--normal-border);color:var(--normal-text);border-radius:var(--border-radius);box-shadow:0 4px 12px rgba(0,0,0,.1);width:var(--width);font-size:13px;display:flex;align-items:center;gap:6px}[data-sonner-toast]:focus-visible{box-shadow:0 4px 12px rgba(0,0,0,.1),0 0 0 2px rgba(0,0,0,.2)}[data-sonner-toast][data-y-position=top]{top:0;--y:translateY(-100%);--lift:1;--lift-amount:calc(1 * var(--gap))}[data-sonner-toast][data-y-position=bottom]{bottom:0;--y:translateY(100%);--lift:-1;--lift-amount:calc(var(--lift) * var(--gap))}[data-sonner-toast][data-styled=true] [data-description]{font-weight:400;line-height:1.4;color:#3f3f3f}[data-rich-colors=true][data-sonner-toast][data-styled=true] [data-description]{color:inherit}[data-sonner-toaster][data-sonner-theme=dark] [data-description]{color:#e8e8e8}[data-sonner-toast][data-styled=true] [data-title]{font-weight:500;line-height:1.5;color:inherit}[data-sonner-toast][data-styled=true] [data-icon]{display:flex;height:16px;width:16px;position:relative;justify-content:flex-start;align-items:center;flex-shrink:0;margin-left:var(--toast-icon-margin-start);margin-right:var(--toast-icon-margin-end)}[data-sonner-toast][data-promise=true] [data-icon]>svg{opacity:0;transform:scale(.8);transform-origin:center;animation:sonner-fade-in .3s ease forwards}[data-sonner-toast][data-styled=true] [data-icon]>*{flex-shrink:0}[data-sonner-toast][data-styled=true] [data-icon] svg{margin-left:var(--toast-svg-margin-start);margin-right:var(--toast-svg-margin-end)}[data-sonner-toast][data-styled=true] [data-content]{display:flex;flex-direction:column;gap:2px}[data-sonner-toast][data-styled=true] [data-button]{border-radius:4px;padding-left:8px;padding-right:8px;height:24px;font-size:12px;color:var(--normal-bg);background:var(--normal-text);margin-left:var(--toast-button-margin-start);margin-right:var(--toast-button-margin-end);border:none;font-weight:500;cursor:pointer;outline:0;display:flex;align-items:center;flex-shrink:0;transition:opacity .4s,box-shadow .2s}[data-sonner-toast][data-styled=true] [data-button]:focus-visible{box-shadow:0 0 0 2px rgba(0,0,0,.4)}[data-sonner-toast][data-styled=true] [data-button]:first-of-type{margin-left:var(--toast-button-margin-start);margin-right:var(--toast-button-margin-end)}[data-sonner-toast][data-styled=true] [data-cancel]{color:var(--normal-text);background:rgba(0,0,0,.08)}[data-sonner-toaster][data-sonner-theme=dark] [data-sonner-toast][data-styled=true] [data-cancel]{background:rgba(255,255,255,.3)}[data-sonner-toast][data-styled=true] [data-close-button]{position:absolute;left:var(--toast-close-button-start);right:var(--toast-close-button-end);top:0;height:20px;width:20px;display:flex;justify-content:center;align-items:center;padding:0;color:var(--gray12);background:var(--normal-bg);border:1px solid var(--gray4);transform:var(--toast-close-button-transform);border-radius:50%;cursor:pointer;z-index:1;transition:opacity .1s,background .2s,border-color .2s}[data-sonner-toast][data-styled=true] [data-close-button]:focus-visible{box-shadow:0 4px 12px rgba(0,0,0,.1),0 0 0 2px rgba(0,0,0,.2)}[data-sonner-toast][data-styled=true] [data-disabled=true]{cursor:not-allowed}[data-sonner-toast][data-styled=true]:hover [data-close-button]:hover{background:var(--gray2);border-color:var(--gray5)}[data-sonner-toast][data-swiping=true]::before{content:'';position:absolute;left:-100%;right:-100%;height:100%;z-index:-1}[data-sonner-toast][data-y-position=top][data-swiping=true]::before{bottom:50%;transform:scaleY(3) translateY(50%)}[data-sonner-toast][data-y-position=bottom][data-swiping=true]::before{top:50%;transform:scaleY(3) translateY(-50%)}[data-sonner-toast][data-swiping=false][data-removed=true]::before{content:'';position:absolute;inset:0;transform:scaleY(2)}[data-sonner-toast][data-expanded=true]::after{content:'';position:absolute;left:0;height:calc(var(--gap) + 1px);bottom:100%;width:100%}[data-sonner-toast][data-mounted=true]{--y:translateY(0);opacity:1}[data-sonner-toast][data-expanded=false][data-front=false]{--scale:var(--toasts-before) * 0.05 + 1;--y:translateY(calc(var(--lift-amount) * var(--toasts-before))) scale(calc(-1 * var(--scale)));height:var(--front-toast-height)}[data-sonner-toast]>*{transition:opacity .4s}[data-sonner-toast][data-x-position=right]{right:0}[data-sonner-toast][data-x-position=left]{left:0}[data-sonner-toast][data-expanded=false][data-front=false][data-styled=true]>*{opacity:0}[data-sonner-toast][data-visible=false]{opacity:0;pointer-events:none}[data-sonner-toast][data-mounted=true][data-expanded=true]{--y:translateY(calc(var(--lift) * var(--offset)));height:var(--initial-height)}[data-sonner-toast][data-removed=true][data-front=true][data-swipe-out=false]{--y:translateY(calc(var(--lift) * -100%));opacity:0}[data-sonner-toast][data-removed=true][data-front=false][data-swipe-out=false][data-expanded=true]{--y:translateY(calc(var(--lift) * var(--offset) + var(--lift) * -100%));opacity:0}[data-sonner-toast][data-removed=true][data-front=false][data-swipe-out=false][data-expanded=false]{--y:translateY(40%);opacity:0;transition:transform .5s,opacity .2s}[data-sonner-toast][data-removed=true][data-front=false]::before{height:calc(var(--initial-height) + 20%)}[data-sonner-toast][data-swiping=true]{transform:var(--y) translateY(var(--swipe-amount-y,0)) translateX(var(--swipe-amount-x,0));transition:none}[data-sonner-toast][data-swiped=true]{user-select:none}[data-sonner-toast][data-swipe-out=true][data-y-position=bottom],[data-sonner-toast][data-swipe-out=true][data-y-position=top]{animation-duration:.2s;animation-timing-function:ease-out;animation-fill-mode:forwards}[data-sonner-toast][data-swipe-out=true][data-swipe-direction=left]{animation-name:swipe-out-left}[data-sonner-toast][data-swipe-out=true][data-swipe-direction=right]{animation-name:swipe-out-right}[data-sonner-toast][data-swipe-out=true][data-swipe-direction=up]{animation-name:swipe-out-up}[data-sonner-toast][data-swipe-out=true][data-swipe-direction=down]{animation-name:swipe-out-down}@keyframes swipe-out-left{from{transform:var(--y) translateX(var(--swipe-amount-x));opacity:1}to{transform:var(--y) translateX(calc(var(--swipe-amount-x) - 100%));opacity:0}}@keyframes swipe-out-right{from{transform:var(--y) translateX(var(--swipe-amount-x));opacity:1}to{transform:var(--y) translateX(calc(var(--swipe-amount-x) + 100%));opacity:0}}@keyframes swipe-out-up{from{transform:var(--y) translateY(var(--swipe-amount-y));opacity:1}to{transform:var(--y) translateY(calc(var(--swipe-amount-y) - 100%));opacity:0}}@keyframes swipe-out-down{from{transform:var(--y) translateY(var(--swipe-amount-y));opacity:1}to{transform:var(--y) translateY(calc(var(--swipe-amount-y) + 100%));opacity:0}}@media (max-width:600px){[data-sonner-toaster]{position:fixed;right:var(--mobile-offset-right);left:var(--mobile-offset-left);width:100%}[data-sonner-toaster][dir=rtl]{left:calc(var(--mobile-offset-left) * -1)}[data-sonner-toaster] [data-sonner-toast]{left:0;right:0;width:calc(100% - var(--mobile-offset-left) * 2)}[data-sonner-toaster][data-x-position=left]{left:var(--mobile-offset-left)}[data-sonner-toaster][data-y-position=bottom]{bottom:var(--mobile-offset-bottom)}[data-sonner-toaster][data-y-position=top]{top:var(--mobile-offset-top)}[data-sonner-toaster][data-x-position=center]{left:var(--mobile-offset-left);right:var(--mobile-offset-right);transform:none}}[data-sonner-toaster][data-sonner-theme=light]{--normal-bg:#fff;--normal-border:var(--gray4);--normal-text:var(--gray12);--success-bg:hsl(143, 85%, 96%);--success-border:hsl(145, 92%, 87%);--success-text:hsl(140, 100%, 27%);--info-bg:hsl(208, 100%, 97%);--info-border:hsl(221, 91%, 93%);--info-text:hsl(210, 92%, 45%);--warning-bg:hsl(49, 100%, 97%);--warning-border:hsl(49, 91%, 84%);--warning-text:hsl(31, 92%, 45%);--error-bg:hsl(359, 100%, 97%);--error-border:hsl(359, 100%, 94%);--error-text:hsl(360, 100%, 45%)}[data-sonner-toaster][data-sonner-theme=light] [data-sonner-toast][data-invert=true]{--normal-bg:#000;--normal-border:hsl(0, 0%, 20%);--normal-text:var(--gray1)}[data-sonner-toaster][data-sonner-theme=dark] [data-sonner-toast][data-invert=true]{--normal-bg:#fff;--normal-border:var(--gray3);--normal-text:var(--gray12)}[data-sonner-toaster][data-sonner-theme=dark]{--normal-bg:#000;--normal-bg-hover:hsl(0, 0%, 12%);--normal-border:hsl(0, 0%, 20%);--normal-border-hover:hsl(0, 0%, 25%);--normal-text:var(--gray1);--success-bg:hsl(150, 100%, 6%);--success-border:hsl(147, 100%, 12%);--success-text:hsl(150, 86%, 65%);--info-bg:hsl(215, 100%, 6%);--info-border:hsl(223, 43%, 17%);--info-text:hsl(216, 87%, 65%);--warning-bg:hsl(64, 100%, 6%);--warning-border:hsl(60, 100%, 9%);--warning-text:hsl(46, 87%, 65%);--error-bg:hsl(358, 76%, 10%);--error-border:hsl(357, 89%, 16%);--error-text:hsl(358, 100%, 81%)}[data-sonner-toaster][data-sonner-theme=dark] [data-sonner-toast] [data-close-button]{background:var(--normal-bg);border-color:var(--normal-border);color:var(--normal-text)}[data-sonner-toaster][data-sonner-theme=dark] [data-sonner-toast] [data-close-button]:hover{background:var(--normal-bg-hover);border-color:var(--normal-border-hover)}[data-rich-colors=true][data-sonner-toast][data-type=success]{background:var(--success-bg);border-color:var(--success-border);color:var(--success-text)}[data-rich-colors=true][data-sonner-toast][data-type=success] [data-close-button]{background:var(--success-bg);border-color:var(--success-border);color:var(--success-text)}[data-rich-colors=true][data-sonner-toast][data-type=info]{background:var(--info-bg);border-color:var(--info-border);color:var(--info-text)}[data-rich-colors=true][data-sonner-toast][data-type=info] [data-close-button]{background:var(--info-bg);border-color:var(--info-border);color:var(--info-text)}[data-rich-colors=true][data-sonner-toast][data-type=warning]{background:var(--warning-bg);border-color:var(--warning-border);color:var(--warning-text)}[data-rich-colors=true][data-sonner-toast][data-type=warning] [data-close-button]{background:var(--warning-bg);border-color:var(--warning-border);color:var(--warning-text)}[data-rich-colors=true][data-sonner-toast][data-type=error]{background:var(--error-bg);border-color:var(--error-border);color:var(--error-text)}[data-rich-colors=true][data-sonner-toast][data-type=error] [data-close-button]{background:var(--error-bg);border-color:var(--error-border);color:var(--error-text)}.sonner-loading-wrapper{--size:16px;height:var(--size);width:var(--size);position:absolute;inset:0;z-index:10}.sonner-loading-wrapper[data-visible=false]{transform-origin:center;animation:sonner-fade-out .2s ease forwards}.sonner-spinner{position:relative;top:50%;left:50%;height:var(--size);width:var(--size)}.sonner-loading-bar{animation:sonner-spin 1.2s linear infinite;background:var(--gray11);border-radius:6px;height:8%;left:-10%;position:absolute;top:-3.9%;width:24%}.sonner-loading-bar:first-child{animation-delay:-1.2s;transform:rotate(.0001deg) translate(146%)}.sonner-loading-bar:nth-child(2){animation-delay:-1.1s;transform:rotate(30deg) translate(146%)}.sonner-loading-bar:nth-child(3){animation-delay:-1s;transform:rotate(60deg) translate(146%)}.sonner-loading-bar:nth-child(4){animation-delay:-.9s;transform:rotate(90deg) translate(146%)}.sonner-loading-bar:nth-child(5){animation-delay:-.8s;transform:rotate(120deg) translate(146%)}.sonner-loading-bar:nth-child(6){animation-delay:-.7s;transform:rotate(150deg) translate(146%)}.sonner-loading-bar:nth-child(7){animation-delay:-.6s;transform:rotate(180deg) translate(146%)}.sonner-loading-bar:nth-child(8){animation-delay:-.5s;transform:rotate(210deg) translate(146%)}.sonner-loading-bar:nth-child(9){animation-delay:-.4s;transform:rotate(240deg) translate(146%)}.sonner-loading-bar:nth-child(10){animation-delay:-.3s;transform:rotate(270deg) translate(146%)}.sonner-loading-bar:nth-child(11){animation-delay:-.2s;transform:rotate(300deg) translate(146%)}.sonner-loading-bar:nth-child(12){animation-delay:-.1s;transform:rotate(330deg) translate(146%)}@keyframes sonner-fade-in{0%{opacity:0;transform:scale(.8)}100%{opacity:1;transform:scale(1)}}@keyframes sonner-fade-out{0%{opacity:1;transform:scale(1)}100%{opacity:0;transform:scale(.8)}}@keyframes sonner-spin{0%{opacity:1}100%{opacity:.15}}@media (prefers-reduced-motion){.sonner-loading-bar,[data-sonner-toast],[data-sonner-toast]>*{transition:none!important;animation:none!important}}.sonner-loader{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);transform-origin:center;transition:opacity .2s,transform .2s}.sonner-loader[data-visible=false]{opacity:0;transform:scale(.8) translate(-50%,-50%)}");
function isAction(action) {
  return action.label !== void 0;
}
const VISIBLE_TOASTS_AMOUNT = 3;
const VIEWPORT_OFFSET = "24px";
const MOBILE_VIEWPORT_OFFSET = "16px";
const TOAST_LIFETIME = 4e3;
const TOAST_WIDTH = 356;
const GAP = 14;
const SWIPE_THRESHOLD = 45;
const TIME_BEFORE_UNMOUNT = 200;
function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}
function getDefaultSwipeDirections(position) {
  const [y, x] = position.split("-");
  const directions = [];
  if (y) {
    directions.push(y);
  }
  if (x) {
    directions.push(x);
  }
  return directions;
}
const Toast = (props) => {
  var _toast_classNames, _toast_classNames1, _toast_classNames2, _toast_classNames3, _toast_classNames4, _toast_classNames5, _toast_classNames6, _toast_classNames7, _toast_classNames8;
  const { invert: ToasterInvert, toast: toast2, unstyled, interacting, setHeights, visibleToasts, heights, index, toasts, expanded, removeToast, defaultRichColors, closeButton: closeButtonFromToaster, style, cancelButtonStyle, actionButtonStyle, className = "", descriptionClassName = "", duration: durationFromToaster, position, gap, expandByDefault, classNames, icons, closeButtonAriaLabel = "Close toast" } = props;
  const [swipeDirection, setSwipeDirection] = React.useState(null);
  const [swipeOutDirection, setSwipeOutDirection] = React.useState(null);
  const [mounted, setMounted] = React.useState(false);
  const [removed, setRemoved] = React.useState(false);
  const [swiping, setSwiping] = React.useState(false);
  const [swipeOut, setSwipeOut] = React.useState(false);
  const [isSwiped, setIsSwiped] = React.useState(false);
  const [offsetBeforeRemove, setOffsetBeforeRemove] = React.useState(0);
  const [initialHeight, setInitialHeight] = React.useState(0);
  const remainingTime = React.useRef(toast2.duration || durationFromToaster || TOAST_LIFETIME);
  const dragStartTime = React.useRef(null);
  const toastRef = React.useRef(null);
  const isFront = index === 0;
  const isVisible = index + 1 <= visibleToasts;
  const toastType = toast2.type;
  const dismissible = toast2.dismissible !== false;
  const toastClassname = toast2.className || "";
  const toastDescriptionClassname = toast2.descriptionClassName || "";
  const heightIndex = React.useMemo(() => heights.findIndex((height) => height.toastId === toast2.id) || 0, [
    heights,
    toast2.id
  ]);
  const closeButton = React.useMemo(() => {
    var _toast_closeButton;
    return (_toast_closeButton = toast2.closeButton) != null ? _toast_closeButton : closeButtonFromToaster;
  }, [
    toast2.closeButton,
    closeButtonFromToaster
  ]);
  const duration = React.useMemo(() => toast2.duration || durationFromToaster || TOAST_LIFETIME, [
    toast2.duration,
    durationFromToaster
  ]);
  const closeTimerStartTimeRef = React.useRef(0);
  const offset = React.useRef(0);
  const lastCloseTimerStartTimeRef = React.useRef(0);
  const pointerStartRef = React.useRef(null);
  const [y, x] = position.split("-");
  const toastsHeightBefore = React.useMemo(() => {
    return heights.reduce((prev, curr, reducerIndex) => {
      if (reducerIndex >= heightIndex) {
        return prev;
      }
      return prev + curr.height;
    }, 0);
  }, [
    heights,
    heightIndex
  ]);
  const isDocumentHidden = useIsDocumentHidden();
  const invert = toast2.invert || ToasterInvert;
  const disabled = toastType === "loading";
  offset.current = React.useMemo(() => heightIndex * gap + toastsHeightBefore, [
    heightIndex,
    toastsHeightBefore
  ]);
  React.useEffect(() => {
    remainingTime.current = duration;
  }, [
    duration
  ]);
  React.useEffect(() => {
    setMounted(true);
  }, []);
  React.useEffect(() => {
    const toastNode = toastRef.current;
    if (toastNode) {
      const height = toastNode.getBoundingClientRect().height;
      setInitialHeight(height);
      setHeights((h) => [
        {
          toastId: toast2.id,
          height,
          position: toast2.position
        },
        ...h
      ]);
      return () => setHeights((h) => h.filter((height2) => height2.toastId !== toast2.id));
    }
  }, [
    setHeights,
    toast2.id
  ]);
  React.useLayoutEffect(() => {
    if (!mounted) return;
    const toastNode = toastRef.current;
    const originalHeight = toastNode.style.height;
    toastNode.style.height = "auto";
    const newHeight = toastNode.getBoundingClientRect().height;
    toastNode.style.height = originalHeight;
    setInitialHeight(newHeight);
    setHeights((heights2) => {
      const alreadyExists = heights2.find((height) => height.toastId === toast2.id);
      if (!alreadyExists) {
        return [
          {
            toastId: toast2.id,
            height: newHeight,
            position: toast2.position
          },
          ...heights2
        ];
      } else {
        return heights2.map((height) => height.toastId === toast2.id ? {
          ...height,
          height: newHeight
        } : height);
      }
    });
  }, [
    mounted,
    toast2.title,
    toast2.description,
    setHeights,
    toast2.id,
    toast2.jsx,
    toast2.action,
    toast2.cancel
  ]);
  const deleteToast = React.useCallback(() => {
    setRemoved(true);
    setOffsetBeforeRemove(offset.current);
    setHeights((h) => h.filter((height) => height.toastId !== toast2.id));
    setTimeout(() => {
      removeToast(toast2);
    }, TIME_BEFORE_UNMOUNT);
  }, [
    toast2,
    removeToast,
    setHeights,
    offset
  ]);
  React.useEffect(() => {
    if (toast2.promise && toastType === "loading" || toast2.duration === Infinity || toast2.type === "loading") return;
    let timeoutId;
    const pauseTimer = () => {
      if (lastCloseTimerStartTimeRef.current < closeTimerStartTimeRef.current) {
        const elapsedTime = (/* @__PURE__ */ new Date()).getTime() - closeTimerStartTimeRef.current;
        remainingTime.current = remainingTime.current - elapsedTime;
      }
      lastCloseTimerStartTimeRef.current = (/* @__PURE__ */ new Date()).getTime();
    };
    const startTimer = () => {
      if (remainingTime.current === Infinity) return;
      closeTimerStartTimeRef.current = (/* @__PURE__ */ new Date()).getTime();
      timeoutId = setTimeout(() => {
        toast2.onAutoClose == null ? void 0 : toast2.onAutoClose.call(toast2, toast2);
        deleteToast();
      }, remainingTime.current);
    };
    if (expanded || interacting || isDocumentHidden) {
      pauseTimer();
    } else {
      startTimer();
    }
    return () => clearTimeout(timeoutId);
  }, [
    expanded,
    interacting,
    toast2,
    toastType,
    isDocumentHidden,
    deleteToast
  ]);
  React.useEffect(() => {
    if (toast2.delete) {
      deleteToast();
      toast2.onDismiss == null ? void 0 : toast2.onDismiss.call(toast2, toast2);
    }
  }, [
    deleteToast,
    toast2.delete
  ]);
  function getLoadingIcon() {
    var _toast_classNames9;
    if (icons == null ? void 0 : icons.loading) {
      var _toast_classNames12;
      return /* @__PURE__ */ React.createElement("div", {
        className: cn(classNames == null ? void 0 : classNames.loader, toast2 == null ? void 0 : (_toast_classNames12 = toast2.classNames) == null ? void 0 : _toast_classNames12.loader, "sonner-loader"),
        "data-visible": toastType === "loading"
      }, icons.loading);
    }
    return /* @__PURE__ */ React.createElement(Loader, {
      className: cn(classNames == null ? void 0 : classNames.loader, toast2 == null ? void 0 : (_toast_classNames9 = toast2.classNames) == null ? void 0 : _toast_classNames9.loader),
      visible: toastType === "loading"
    });
  }
  const icon = toast2.icon || (icons == null ? void 0 : icons[toastType]) || getAsset(toastType);
  var _toast_richColors, _icons_close;
  return /* @__PURE__ */ React.createElement("li", {
    tabIndex: 0,
    ref: toastRef,
    className: cn(className, toastClassname, classNames == null ? void 0 : classNames.toast, toast2 == null ? void 0 : (_toast_classNames = toast2.classNames) == null ? void 0 : _toast_classNames.toast, classNames == null ? void 0 : classNames.default, classNames == null ? void 0 : classNames[toastType], toast2 == null ? void 0 : (_toast_classNames1 = toast2.classNames) == null ? void 0 : _toast_classNames1[toastType]),
    "data-sonner-toast": "",
    "data-rich-colors": (_toast_richColors = toast2.richColors) != null ? _toast_richColors : defaultRichColors,
    "data-styled": !Boolean(toast2.jsx || toast2.unstyled || unstyled),
    "data-mounted": mounted,
    "data-promise": Boolean(toast2.promise),
    "data-swiped": isSwiped,
    "data-removed": removed,
    "data-visible": isVisible,
    "data-y-position": y,
    "data-x-position": x,
    "data-index": index,
    "data-front": isFront,
    "data-swiping": swiping,
    "data-dismissible": dismissible,
    "data-type": toastType,
    "data-invert": invert,
    "data-swipe-out": swipeOut,
    "data-swipe-direction": swipeOutDirection,
    "data-expanded": Boolean(expanded || expandByDefault && mounted),
    "data-testid": toast2.testId,
    style: {
      "--index": index,
      "--toasts-before": index,
      "--z-index": toasts.length - index,
      "--offset": `${removed ? offsetBeforeRemove : offset.current}px`,
      "--initial-height": expandByDefault ? "auto" : `${initialHeight}px`,
      ...style,
      ...toast2.style
    },
    onDragEnd: () => {
      setSwiping(false);
      setSwipeDirection(null);
      pointerStartRef.current = null;
    },
    onPointerDown: (event) => {
      if (event.button === 2) return;
      if (disabled || !dismissible) return;
      dragStartTime.current = /* @__PURE__ */ new Date();
      setOffsetBeforeRemove(offset.current);
      event.target.setPointerCapture(event.pointerId);
      if (event.target.tagName === "BUTTON") return;
      setSwiping(true);
      pointerStartRef.current = {
        x: event.clientX,
        y: event.clientY
      };
    },
    onPointerUp: () => {
      var _toastRef_current, _toastRef_current1, _dragStartTime_current;
      if (swipeOut || !dismissible) return;
      pointerStartRef.current = null;
      const swipeAmountX = Number(((_toastRef_current = toastRef.current) == null ? void 0 : _toastRef_current.style.getPropertyValue("--swipe-amount-x").replace("px", "")) || 0);
      const swipeAmountY = Number(((_toastRef_current1 = toastRef.current) == null ? void 0 : _toastRef_current1.style.getPropertyValue("--swipe-amount-y").replace("px", "")) || 0);
      const timeTaken = (/* @__PURE__ */ new Date()).getTime() - ((_dragStartTime_current = dragStartTime.current) == null ? void 0 : _dragStartTime_current.getTime());
      const swipeAmount = swipeDirection === "x" ? swipeAmountX : swipeAmountY;
      const velocity = Math.abs(swipeAmount) / timeTaken;
      if (Math.abs(swipeAmount) >= SWIPE_THRESHOLD || velocity > 0.11) {
        setOffsetBeforeRemove(offset.current);
        toast2.onDismiss == null ? void 0 : toast2.onDismiss.call(toast2, toast2);
        if (swipeDirection === "x") {
          setSwipeOutDirection(swipeAmountX > 0 ? "right" : "left");
        } else {
          setSwipeOutDirection(swipeAmountY > 0 ? "down" : "up");
        }
        deleteToast();
        setSwipeOut(true);
        return;
      } else {
        var _toastRef_current2, _toastRef_current3;
        (_toastRef_current2 = toastRef.current) == null ? void 0 : _toastRef_current2.style.setProperty("--swipe-amount-x", `0px`);
        (_toastRef_current3 = toastRef.current) == null ? void 0 : _toastRef_current3.style.setProperty("--swipe-amount-y", `0px`);
      }
      setIsSwiped(false);
      setSwiping(false);
      setSwipeDirection(null);
    },
    onPointerMove: (event) => {
      var _window_getSelection, _toastRef_current, _toastRef_current1;
      if (!pointerStartRef.current || !dismissible) return;
      const isHighlighted = ((_window_getSelection = window.getSelection()) == null ? void 0 : _window_getSelection.toString().length) > 0;
      if (isHighlighted) return;
      const yDelta = event.clientY - pointerStartRef.current.y;
      const xDelta = event.clientX - pointerStartRef.current.x;
      var _props_swipeDirections;
      const swipeDirections = (_props_swipeDirections = props.swipeDirections) != null ? _props_swipeDirections : getDefaultSwipeDirections(position);
      if (!swipeDirection && (Math.abs(xDelta) > 1 || Math.abs(yDelta) > 1)) {
        setSwipeDirection(Math.abs(xDelta) > Math.abs(yDelta) ? "x" : "y");
      }
      let swipeAmount = {
        x: 0,
        y: 0
      };
      const getDampening = (delta) => {
        const factor = Math.abs(delta) / 20;
        return 1 / (1.5 + factor);
      };
      if (swipeDirection === "y") {
        if (swipeDirections.includes("top") || swipeDirections.includes("bottom")) {
          if (swipeDirections.includes("top") && yDelta < 0 || swipeDirections.includes("bottom") && yDelta > 0) {
            swipeAmount.y = yDelta;
          } else {
            const dampenedDelta = yDelta * getDampening(yDelta);
            swipeAmount.y = Math.abs(dampenedDelta) < Math.abs(yDelta) ? dampenedDelta : yDelta;
          }
        }
      } else if (swipeDirection === "x") {
        if (swipeDirections.includes("left") || swipeDirections.includes("right")) {
          if (swipeDirections.includes("left") && xDelta < 0 || swipeDirections.includes("right") && xDelta > 0) {
            swipeAmount.x = xDelta;
          } else {
            const dampenedDelta = xDelta * getDampening(xDelta);
            swipeAmount.x = Math.abs(dampenedDelta) < Math.abs(xDelta) ? dampenedDelta : xDelta;
          }
        }
      }
      if (Math.abs(swipeAmount.x) > 0 || Math.abs(swipeAmount.y) > 0) {
        setIsSwiped(true);
      }
      (_toastRef_current = toastRef.current) == null ? void 0 : _toastRef_current.style.setProperty("--swipe-amount-x", `${swipeAmount.x}px`);
      (_toastRef_current1 = toastRef.current) == null ? void 0 : _toastRef_current1.style.setProperty("--swipe-amount-y", `${swipeAmount.y}px`);
    }
  }, closeButton && !toast2.jsx && toastType !== "loading" ? /* @__PURE__ */ React.createElement("button", {
    "aria-label": closeButtonAriaLabel,
    "data-disabled": disabled,
    "data-close-button": true,
    onClick: disabled || !dismissible ? () => {
    } : () => {
      deleteToast();
      toast2.onDismiss == null ? void 0 : toast2.onDismiss.call(toast2, toast2);
    },
    className: cn(classNames == null ? void 0 : classNames.closeButton, toast2 == null ? void 0 : (_toast_classNames2 = toast2.classNames) == null ? void 0 : _toast_classNames2.closeButton)
  }, (_icons_close = icons == null ? void 0 : icons.close) != null ? _icons_close : CloseIcon) : null, (toastType || toast2.icon || toast2.promise) && toast2.icon !== null && ((icons == null ? void 0 : icons[toastType]) !== null || toast2.icon) ? /* @__PURE__ */ React.createElement("div", {
    "data-icon": "",
    className: cn(classNames == null ? void 0 : classNames.icon, toast2 == null ? void 0 : (_toast_classNames3 = toast2.classNames) == null ? void 0 : _toast_classNames3.icon)
  }, toast2.promise || toast2.type === "loading" && !toast2.icon ? toast2.icon || getLoadingIcon() : null, toast2.type !== "loading" ? icon : null) : null, /* @__PURE__ */ React.createElement("div", {
    "data-content": "",
    className: cn(classNames == null ? void 0 : classNames.content, toast2 == null ? void 0 : (_toast_classNames4 = toast2.classNames) == null ? void 0 : _toast_classNames4.content)
  }, /* @__PURE__ */ React.createElement("div", {
    "data-title": "",
    className: cn(classNames == null ? void 0 : classNames.title, toast2 == null ? void 0 : (_toast_classNames5 = toast2.classNames) == null ? void 0 : _toast_classNames5.title)
  }, toast2.jsx ? toast2.jsx : typeof toast2.title === "function" ? toast2.title() : toast2.title), toast2.description ? /* @__PURE__ */ React.createElement("div", {
    "data-description": "",
    className: cn(descriptionClassName, toastDescriptionClassname, classNames == null ? void 0 : classNames.description, toast2 == null ? void 0 : (_toast_classNames6 = toast2.classNames) == null ? void 0 : _toast_classNames6.description)
  }, typeof toast2.description === "function" ? toast2.description() : toast2.description) : null), /* @__PURE__ */ React.isValidElement(toast2.cancel) ? toast2.cancel : toast2.cancel && isAction(toast2.cancel) ? /* @__PURE__ */ React.createElement("button", {
    "data-button": true,
    "data-cancel": true,
    style: toast2.cancelButtonStyle || cancelButtonStyle,
    onClick: (event) => {
      if (!isAction(toast2.cancel)) return;
      if (!dismissible) return;
      toast2.cancel.onClick == null ? void 0 : toast2.cancel.onClick.call(toast2.cancel, event);
      deleteToast();
    },
    className: cn(classNames == null ? void 0 : classNames.cancelButton, toast2 == null ? void 0 : (_toast_classNames7 = toast2.classNames) == null ? void 0 : _toast_classNames7.cancelButton)
  }, toast2.cancel.label) : null, /* @__PURE__ */ React.isValidElement(toast2.action) ? toast2.action : toast2.action && isAction(toast2.action) ? /* @__PURE__ */ React.createElement("button", {
    "data-button": true,
    "data-action": true,
    style: toast2.actionButtonStyle || actionButtonStyle,
    onClick: (event) => {
      if (!isAction(toast2.action)) return;
      toast2.action.onClick == null ? void 0 : toast2.action.onClick.call(toast2.action, event);
      if (event.defaultPrevented) return;
      deleteToast();
    },
    className: cn(classNames == null ? void 0 : classNames.actionButton, toast2 == null ? void 0 : (_toast_classNames8 = toast2.classNames) == null ? void 0 : _toast_classNames8.actionButton)
  }, toast2.action.label) : null);
};
function getDocumentDirection() {
  if (typeof window === "undefined") return "ltr";
  if (typeof document === "undefined") return "ltr";
  const dirAttribute = document.documentElement.getAttribute("dir");
  if (dirAttribute === "auto" || !dirAttribute) {
    return window.getComputedStyle(document.documentElement).direction;
  }
  return dirAttribute;
}
function assignOffset(defaultOffset2, mobileOffset) {
  const styles = {};
  [
    defaultOffset2,
    mobileOffset
  ].forEach((offset, index) => {
    const isMobile = index === 1;
    const prefix = isMobile ? "--mobile-offset" : "--offset";
    const defaultValue = isMobile ? MOBILE_VIEWPORT_OFFSET : VIEWPORT_OFFSET;
    function assignAll(offset2) {
      [
        "top",
        "right",
        "bottom",
        "left"
      ].forEach((key) => {
        styles[`${prefix}-${key}`] = typeof offset2 === "number" ? `${offset2}px` : offset2;
      });
    }
    if (typeof offset === "number" || typeof offset === "string") {
      assignAll(offset);
    } else if (typeof offset === "object") {
      [
        "top",
        "right",
        "bottom",
        "left"
      ].forEach((key) => {
        if (offset[key] === void 0) {
          styles[`${prefix}-${key}`] = defaultValue;
        } else {
          styles[`${prefix}-${key}`] = typeof offset[key] === "number" ? `${offset[key]}px` : offset[key];
        }
      });
    } else {
      assignAll(defaultValue);
    }
  });
  return styles;
}
const Toaster = /* @__PURE__ */ React.forwardRef(function Toaster2(props, ref) {
  const { id: id2, invert, position = "bottom-right", hotkey = [
    "altKey",
    "KeyT"
  ], expand, closeButton, className, offset, mobileOffset, theme = "light", richColors, duration, style, visibleToasts = VISIBLE_TOASTS_AMOUNT, toastOptions, dir = getDocumentDirection(), gap = GAP, icons, containerAriaLabel = "Notifications" } = props;
  const [toasts, setToasts] = React.useState([]);
  const filteredToasts = React.useMemo(() => {
    if (id2) {
      return toasts.filter((toast2) => toast2.toasterId === id2);
    }
    return toasts.filter((toast2) => !toast2.toasterId);
  }, [
    toasts,
    id2
  ]);
  const possiblePositions = React.useMemo(() => {
    return Array.from(new Set([
      position
    ].concat(filteredToasts.filter((toast2) => toast2.position).map((toast2) => toast2.position))));
  }, [
    filteredToasts,
    position
  ]);
  const [heights, setHeights] = React.useState([]);
  const [expanded, setExpanded] = React.useState(false);
  const [interacting, setInteracting] = React.useState(false);
  const [actualTheme, setActualTheme] = React.useState(theme !== "system" ? theme : typeof window !== "undefined" ? window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light" : "light");
  const listRef = React.useRef(null);
  const hotkeyLabel = hotkey.join("+").replace(/Key/g, "").replace(/Digit/g, "");
  const lastFocusedElementRef = React.useRef(null);
  const isFocusWithinRef = React.useRef(false);
  const removeToast = React.useCallback((toastToRemove) => {
    setToasts((toasts2) => {
      var _toasts_find;
      if (!((_toasts_find = toasts2.find((toast2) => toast2.id === toastToRemove.id)) == null ? void 0 : _toasts_find.delete)) {
        ToastState.dismiss(toastToRemove.id);
      }
      return toasts2.filter(({ id: id3 }) => id3 !== toastToRemove.id);
    });
  }, []);
  React.useEffect(() => {
    return ToastState.subscribe((toast2) => {
      if (toast2.dismiss) {
        requestAnimationFrame(() => {
          setToasts((toasts2) => toasts2.map((t) => t.id === toast2.id ? {
            ...t,
            delete: true
          } : t));
        });
        return;
      }
      setTimeout(() => {
        ReactDOM.flushSync(() => {
          setToasts((toasts2) => {
            const indexOfExistingToast = toasts2.findIndex((t) => t.id === toast2.id);
            if (indexOfExistingToast !== -1) {
              return [
                ...toasts2.slice(0, indexOfExistingToast),
                {
                  ...toasts2[indexOfExistingToast],
                  ...toast2
                },
                ...toasts2.slice(indexOfExistingToast + 1)
              ];
            }
            return [
              toast2,
              ...toasts2
            ];
          });
        });
      });
    });
  }, [
    toasts
  ]);
  React.useEffect(() => {
    if (theme !== "system") {
      setActualTheme(theme);
      return;
    }
    if (theme === "system") {
      if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
        setActualTheme("dark");
      } else {
        setActualTheme("light");
      }
    }
    if (typeof window === "undefined") return;
    const darkMediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    try {
      darkMediaQuery.addEventListener("change", ({ matches }) => {
        if (matches) {
          setActualTheme("dark");
        } else {
          setActualTheme("light");
        }
      });
    } catch (error) {
      darkMediaQuery.addListener(({ matches }) => {
        try {
          if (matches) {
            setActualTheme("dark");
          } else {
            setActualTheme("light");
          }
        } catch (e) {
          console.error(e);
        }
      });
    }
  }, [
    theme
  ]);
  React.useEffect(() => {
    if (toasts.length <= 1) {
      setExpanded(false);
    }
  }, [
    toasts
  ]);
  React.useEffect(() => {
    const handleKeyDown = (event) => {
      var _listRef_current;
      const isHotkeyPressed = hotkey.every((key) => event[key] || event.code === key);
      if (isHotkeyPressed) {
        var _listRef_current1;
        setExpanded(true);
        (_listRef_current1 = listRef.current) == null ? void 0 : _listRef_current1.focus();
      }
      if (event.code === "Escape" && (document.activeElement === listRef.current || ((_listRef_current = listRef.current) == null ? void 0 : _listRef_current.contains(document.activeElement)))) {
        setExpanded(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [
    hotkey
  ]);
  React.useEffect(() => {
    if (listRef.current) {
      return () => {
        if (lastFocusedElementRef.current) {
          lastFocusedElementRef.current.focus({
            preventScroll: true
          });
          lastFocusedElementRef.current = null;
          isFocusWithinRef.current = false;
        }
      };
    }
  }, [
    listRef.current
  ]);
  return (
    // Remove item from normal navigation flow, only available via hotkey
    /* @__PURE__ */ React.createElement("section", {
      ref,
      "aria-label": `${containerAriaLabel} ${hotkeyLabel}`,
      tabIndex: -1,
      "aria-live": "polite",
      "aria-relevant": "additions text",
      "aria-atomic": "false",
      suppressHydrationWarning: true
    }, possiblePositions.map((position2, index) => {
      var _heights_;
      const [y, x] = position2.split("-");
      if (!filteredToasts.length) return null;
      return /* @__PURE__ */ React.createElement("ol", {
        key: position2,
        dir: dir === "auto" ? getDocumentDirection() : dir,
        tabIndex: -1,
        ref: listRef,
        className,
        "data-sonner-toaster": true,
        "data-sonner-theme": actualTheme,
        "data-y-position": y,
        "data-x-position": x,
        style: {
          "--front-toast-height": `${((_heights_ = heights[0]) == null ? void 0 : _heights_.height) || 0}px`,
          "--width": `${TOAST_WIDTH}px`,
          "--gap": `${gap}px`,
          ...style,
          ...assignOffset(offset, mobileOffset)
        },
        onBlur: (event) => {
          if (isFocusWithinRef.current && !event.currentTarget.contains(event.relatedTarget)) {
            isFocusWithinRef.current = false;
            if (lastFocusedElementRef.current) {
              lastFocusedElementRef.current.focus({
                preventScroll: true
              });
              lastFocusedElementRef.current = null;
            }
          }
        },
        onFocus: (event) => {
          const isNotDismissible = event.target instanceof HTMLElement && event.target.dataset.dismissible === "false";
          if (isNotDismissible) return;
          if (!isFocusWithinRef.current) {
            isFocusWithinRef.current = true;
            lastFocusedElementRef.current = event.relatedTarget;
          }
        },
        onMouseEnter: () => setExpanded(true),
        onMouseMove: () => setExpanded(true),
        onMouseLeave: () => {
          if (!interacting) {
            setExpanded(false);
          }
        },
        onDragEnd: () => setExpanded(false),
        onPointerDown: (event) => {
          const isNotDismissible = event.target instanceof HTMLElement && event.target.dataset.dismissible === "false";
          if (isNotDismissible) return;
          setInteracting(true);
        },
        onPointerUp: () => setInteracting(false)
      }, filteredToasts.filter((toast2) => !toast2.position && index === 0 || toast2.position === position2).map((toast2, index2) => {
        var _toastOptions_duration, _toastOptions_closeButton;
        return /* @__PURE__ */ React.createElement(Toast, {
          key: toast2.id,
          icons,
          index: index2,
          toast: toast2,
          defaultRichColors: richColors,
          duration: (_toastOptions_duration = toastOptions == null ? void 0 : toastOptions.duration) != null ? _toastOptions_duration : duration,
          className: toastOptions == null ? void 0 : toastOptions.className,
          descriptionClassName: toastOptions == null ? void 0 : toastOptions.descriptionClassName,
          invert,
          visibleToasts,
          closeButton: (_toastOptions_closeButton = toastOptions == null ? void 0 : toastOptions.closeButton) != null ? _toastOptions_closeButton : closeButton,
          interacting,
          position: position2,
          style: toastOptions == null ? void 0 : toastOptions.style,
          unstyled: toastOptions == null ? void 0 : toastOptions.unstyled,
          classNames: toastOptions == null ? void 0 : toastOptions.classNames,
          cancelButtonStyle: toastOptions == null ? void 0 : toastOptions.cancelButtonStyle,
          actionButtonStyle: toastOptions == null ? void 0 : toastOptions.actionButtonStyle,
          closeButtonAriaLabel: toastOptions == null ? void 0 : toastOptions.closeButtonAriaLabel,
          removeToast,
          toasts: filteredToasts.filter((t) => t.position == toast2.position),
          heights: heights.filter((h) => h.position == toast2.position),
          setHeights,
          expandByDefault: expand,
          gap,
          expanded,
          swipeDirections: props.swipeDirections
        });
      }));
    }))
  );
});
const LayoutGroupContext = reactExports.createContext({});
function useConstant(init) {
  const ref = reactExports.useRef(null);
  if (ref.current === null) {
    ref.current = init();
  }
  return ref.current;
}
const isBrowser$1 = typeof window !== "undefined";
const useIsomorphicLayoutEffect = isBrowser$1 ? reactExports.useLayoutEffect : reactExports.useEffect;
const PresenceContext = /* @__PURE__ */ reactExports.createContext(null);
function addUniqueItem(arr, item) {
  if (arr.indexOf(item) === -1)
    arr.push(item);
}
function removeItem(arr, item) {
  const index = arr.indexOf(item);
  if (index > -1)
    arr.splice(index, 1);
}
const clamp = (min, max, v) => {
  if (v > max)
    return max;
  if (v < min)
    return min;
  return v;
};
let invariant = () => {
};
const MotionGlobalConfig = {};
const isNumericalString = (v) => /^-?(?:\d+(?:\.\d+)?|\.\d+)$/u.test(v);
function isObject(value) {
  return typeof value === "object" && value !== null;
}
const isZeroValueString = (v) => /^0[^.\s]+$/u.test(v);
// @__NO_SIDE_EFFECTS__
function memo(callback) {
  let result;
  return () => {
    if (result === void 0)
      result = callback();
    return result;
  };
}
const noop = /* @__NO_SIDE_EFFECTS__ */ (any) => any;
const combineFunctions = (a, b) => (v) => b(a(v));
const pipe = (...transformers) => transformers.reduce(combineFunctions);
const progress = /* @__NO_SIDE_EFFECTS__ */ (from, to, value) => {
  const toFromDifference = to - from;
  return toFromDifference === 0 ? 1 : (value - from) / toFromDifference;
};
class SubscriptionManager {
  constructor() {
    this.subscriptions = [];
  }
  add(handler) {
    addUniqueItem(this.subscriptions, handler);
    return () => removeItem(this.subscriptions, handler);
  }
  notify(a, b, c) {
    const numSubscriptions = this.subscriptions.length;
    if (!numSubscriptions)
      return;
    if (numSubscriptions === 1) {
      this.subscriptions[0](a, b, c);
    } else {
      for (let i = 0; i < numSubscriptions; i++) {
        const handler = this.subscriptions[i];
        handler && handler(a, b, c);
      }
    }
  }
  getSize() {
    return this.subscriptions.length;
  }
  clear() {
    this.subscriptions.length = 0;
  }
}
const secondsToMilliseconds = /* @__NO_SIDE_EFFECTS__ */ (seconds) => seconds * 1e3;
const millisecondsToSeconds = /* @__NO_SIDE_EFFECTS__ */ (milliseconds) => milliseconds / 1e3;
function velocityPerSecond(velocity, frameDuration) {
  return frameDuration ? velocity * (1e3 / frameDuration) : 0;
}
const calcBezier = (t, a1, a2) => (((1 - 3 * a2 + 3 * a1) * t + (3 * a2 - 6 * a1)) * t + 3 * a1) * t;
const subdivisionPrecision = 1e-7;
const subdivisionMaxIterations = 12;
function binarySubdivide(x, lowerBound, upperBound, mX1, mX2) {
  let currentX;
  let currentT;
  let i = 0;
  do {
    currentT = lowerBound + (upperBound - lowerBound) / 2;
    currentX = calcBezier(currentT, mX1, mX2) - x;
    if (currentX > 0) {
      upperBound = currentT;
    } else {
      lowerBound = currentT;
    }
  } while (Math.abs(currentX) > subdivisionPrecision && ++i < subdivisionMaxIterations);
  return currentT;
}
function cubicBezier(mX1, mY1, mX2, mY2) {
  if (mX1 === mY1 && mX2 === mY2)
    return noop;
  const getTForX = (aX) => binarySubdivide(aX, 0, 1, mX1, mX2);
  return (t) => t === 0 || t === 1 ? t : calcBezier(getTForX(t), mY1, mY2);
}
const mirrorEasing = (easing) => (p) => p <= 0.5 ? easing(2 * p) / 2 : (2 - easing(2 * (1 - p))) / 2;
const reverseEasing = (easing) => (p) => 1 - easing(1 - p);
const backOut = /* @__PURE__ */ cubicBezier(0.33, 1.53, 0.69, 0.99);
const backIn = /* @__PURE__ */ reverseEasing(backOut);
const backInOut = /* @__PURE__ */ mirrorEasing(backIn);
const anticipate = (p) => p >= 1 ? 1 : (p *= 2) < 1 ? 0.5 * backIn(p) : 0.5 * (2 - Math.pow(2, -10 * (p - 1)));
const circIn = (p) => 1 - Math.sin(Math.acos(p));
const circOut = reverseEasing(circIn);
const circInOut = mirrorEasing(circIn);
const easeIn = /* @__PURE__ */ cubicBezier(0.42, 0, 1, 1);
const easeOut = /* @__PURE__ */ cubicBezier(0, 0, 0.58, 1);
const easeInOut = /* @__PURE__ */ cubicBezier(0.42, 0, 0.58, 1);
const isEasingArray = (ease2) => {
  return Array.isArray(ease2) && typeof ease2[0] !== "number";
};
const isBezierDefinition = (easing) => Array.isArray(easing) && typeof easing[0] === "number";
const easingLookup = {
  linear: noop,
  easeIn,
  easeInOut,
  easeOut,
  circIn,
  circInOut,
  circOut,
  backIn,
  backInOut,
  backOut,
  anticipate
};
const isValidEasing = (easing) => {
  return typeof easing === "string";
};
const easingDefinitionToFunction = (definition) => {
  if (isBezierDefinition(definition)) {
    invariant(definition.length === 4);
    const [x1, y1, x2, y2] = definition;
    return cubicBezier(x1, y1, x2, y2);
  } else if (isValidEasing(definition)) {
    return easingLookup[definition];
  }
  return definition;
};
const stepsOrder = [
  "setup",
  // Compute
  "read",
  // Read
  "resolveKeyframes",
  // Write/Read/Write/Read
  "preUpdate",
  // Compute
  "update",
  // Compute
  "preRender",
  // Compute
  "render",
  // Write
  "postRender"
  // Compute
];
function createRenderStep(runNextFrame, stepName) {
  let thisFrame = /* @__PURE__ */ new Set();
  let nextFrame = /* @__PURE__ */ new Set();
  let isProcessing = false;
  let flushNextFrame = false;
  const toKeepAlive = /* @__PURE__ */ new WeakSet();
  let latestFrameData = {
    delta: 0,
    timestamp: 0,
    isProcessing: false
  };
  function triggerCallback(callback) {
    if (toKeepAlive.has(callback)) {
      step.schedule(callback);
      runNextFrame();
    }
    callback(latestFrameData);
  }
  const step = {
    /**
     * Schedule a process to run on the next frame.
     */
    schedule: (callback, keepAlive = false, immediate = false) => {
      const addToCurrentFrame = immediate && isProcessing;
      const queue = addToCurrentFrame ? thisFrame : nextFrame;
      if (keepAlive)
        toKeepAlive.add(callback);
      queue.add(callback);
      return callback;
    },
    /**
     * Cancel the provided callback from running on the next frame.
     */
    cancel: (callback) => {
      nextFrame.delete(callback);
      toKeepAlive.delete(callback);
    },
    /**
     * Execute all schedule callbacks.
     */
    process: (frameData2) => {
      latestFrameData = frameData2;
      if (isProcessing) {
        flushNextFrame = true;
        return;
      }
      isProcessing = true;
      const prevFrame = thisFrame;
      thisFrame = nextFrame;
      nextFrame = prevFrame;
      thisFrame.forEach(triggerCallback);
      thisFrame.clear();
      isProcessing = false;
      if (flushNextFrame) {
        flushNextFrame = false;
        step.process(frameData2);
      }
    }
  };
  return step;
}
const maxElapsed = 40;
function createRenderBatcher(scheduleNextBatch, allowKeepAlive) {
  let runNextFrame = false;
  let useDefaultElapsed = true;
  const state = {
    delta: 0,
    timestamp: 0,
    isProcessing: false
  };
  const flagRunNextFrame = () => runNextFrame = true;
  const steps = stepsOrder.reduce((acc, key) => {
    acc[key] = createRenderStep(flagRunNextFrame);
    return acc;
  }, {});
  const { setup, read, resolveKeyframes, preUpdate, update, preRender, render, postRender } = steps;
  const processBatch = () => {
    const useManualTiming = MotionGlobalConfig.useManualTiming;
    const timestamp = useManualTiming ? state.timestamp : performance.now();
    runNextFrame = false;
    if (!useManualTiming) {
      state.delta = useDefaultElapsed ? 1e3 / 60 : Math.max(Math.min(timestamp - state.timestamp, maxElapsed), 1);
    }
    state.timestamp = timestamp;
    state.isProcessing = true;
    setup.process(state);
    read.process(state);
    resolveKeyframes.process(state);
    preUpdate.process(state);
    update.process(state);
    preRender.process(state);
    render.process(state);
    postRender.process(state);
    state.isProcessing = false;
    if (runNextFrame && allowKeepAlive) {
      useDefaultElapsed = false;
      scheduleNextBatch(processBatch);
    }
  };
  const wake = () => {
    runNextFrame = true;
    useDefaultElapsed = true;
    if (!state.isProcessing) {
      scheduleNextBatch(processBatch);
    }
  };
  const schedule = stepsOrder.reduce((acc, key) => {
    const step = steps[key];
    acc[key] = (process2, keepAlive = false, immediate = false) => {
      if (!runNextFrame)
        wake();
      return step.schedule(process2, keepAlive, immediate);
    };
    return acc;
  }, {});
  const cancel = (process2) => {
    for (let i = 0; i < stepsOrder.length; i++) {
      steps[stepsOrder[i]].cancel(process2);
    }
  };
  return { schedule, cancel, state, steps };
}
const { schedule: frame, cancel: cancelFrame, state: frameData, steps: frameSteps } = /* @__PURE__ */ createRenderBatcher(typeof requestAnimationFrame !== "undefined" ? requestAnimationFrame : noop, true);
let now;
function clearTime() {
  now = void 0;
}
const time = {
  now: () => {
    if (now === void 0) {
      time.set(frameData.isProcessing || MotionGlobalConfig.useManualTiming ? frameData.timestamp : performance.now());
    }
    return now;
  },
  set: (newTime) => {
    now = newTime;
    queueMicrotask(clearTime);
  }
};
const checkStringStartsWith = (token) => (key) => typeof key === "string" && key.startsWith(token);
const isCSSVariableName = /* @__PURE__ */ checkStringStartsWith("--");
const startsAsVariableToken = /* @__PURE__ */ checkStringStartsWith("var(--");
const isCSSVariableToken = (value) => {
  const startsWithToken = startsAsVariableToken(value);
  if (!startsWithToken)
    return false;
  return singleCssVariableRegex.test(value.split("/*")[0].trim());
};
const singleCssVariableRegex = /var\(--(?:[\w-]+\s*|[\w-]+\s*,(?:\s*[^)(\s]|\s*\((?:[^)(]|\([^)(]*\))*\))+\s*)\)$/iu;
function containsCSSVariable(value) {
  if (typeof value !== "string")
    return false;
  return value.split("/*")[0].includes("var(--");
}
const number = {
  test: (v) => typeof v === "number",
  parse: parseFloat,
  transform: (v) => v
};
const alpha = {
  ...number,
  transform: (v) => clamp(0, 1, v)
};
const scale = {
  ...number,
  default: 1
};
const sanitize = (v) => Math.round(v * 1e5) / 1e5;
const floatRegex = /-?(?:\d+(?:\.\d+)?|\.\d+)/gu;
function isNullish(v) {
  return v == null;
}
const singleColorRegex = /^(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))$/iu;
const isColorString = (type, testProp) => (v) => {
  return Boolean(typeof v === "string" && singleColorRegex.test(v) && v.startsWith(type) || testProp && !isNullish(v) && Object.prototype.hasOwnProperty.call(v, testProp));
};
const splitColor = (aName, bName, cName) => (v) => {
  if (typeof v !== "string")
    return v;
  const [a, b, c, alpha2] = v.match(floatRegex);
  return {
    [aName]: parseFloat(a),
    [bName]: parseFloat(b),
    [cName]: parseFloat(c),
    alpha: alpha2 !== void 0 ? parseFloat(alpha2) : 1
  };
};
const clampRgbUnit = (v) => clamp(0, 255, v);
const rgbUnit = {
  ...number,
  transform: (v) => Math.round(clampRgbUnit(v))
};
const rgba = {
  test: /* @__PURE__ */ isColorString("rgb", "red"),
  parse: /* @__PURE__ */ splitColor("red", "green", "blue"),
  transform: ({ red, green, blue, alpha: alpha$1 = 1 }) => "rgba(" + rgbUnit.transform(red) + ", " + rgbUnit.transform(green) + ", " + rgbUnit.transform(blue) + ", " + sanitize(alpha.transform(alpha$1)) + ")"
};
function parseHex(v) {
  let r = "";
  let g = "";
  let b = "";
  let a = "";
  if (v.length > 5) {
    r = v.substring(1, 3);
    g = v.substring(3, 5);
    b = v.substring(5, 7);
    a = v.substring(7, 9);
  } else {
    r = v.substring(1, 2);
    g = v.substring(2, 3);
    b = v.substring(3, 4);
    a = v.substring(4, 5);
    r += r;
    g += g;
    b += b;
    a += a;
  }
  return {
    red: parseInt(r, 16),
    green: parseInt(g, 16),
    blue: parseInt(b, 16),
    alpha: a ? parseInt(a, 16) / 255 : 1
  };
}
const hex = {
  test: /* @__PURE__ */ isColorString("#"),
  parse: parseHex,
  transform: rgba.transform
};
const createUnitType = /* @__NO_SIDE_EFFECTS__ */ (unit) => ({
  test: (v) => typeof v === "string" && v.endsWith(unit) && v.split(" ").length === 1,
  parse: parseFloat,
  transform: (v) => `${v}${unit}`
});
const degrees = /* @__PURE__ */ createUnitType("deg");
const percent = /* @__PURE__ */ createUnitType("%");
const px = /* @__PURE__ */ createUnitType("px");
const vh = /* @__PURE__ */ createUnitType("vh");
const vw = /* @__PURE__ */ createUnitType("vw");
const progressPercentage = /* @__PURE__ */ (() => ({
  ...percent,
  parse: (v) => percent.parse(v) / 100,
  transform: (v) => percent.transform(v * 100)
}))();
const hsla = {
  test: /* @__PURE__ */ isColorString("hsl", "hue"),
  parse: /* @__PURE__ */ splitColor("hue", "saturation", "lightness"),
  transform: ({ hue, saturation, lightness, alpha: alpha$1 = 1 }) => {
    return "hsla(" + Math.round(hue) + ", " + percent.transform(sanitize(saturation)) + ", " + percent.transform(sanitize(lightness)) + ", " + sanitize(alpha.transform(alpha$1)) + ")";
  }
};
const color = {
  test: (v) => rgba.test(v) || hex.test(v) || hsla.test(v),
  parse: (v) => {
    if (rgba.test(v)) {
      return rgba.parse(v);
    } else if (hsla.test(v)) {
      return hsla.parse(v);
    } else {
      return hex.parse(v);
    }
  },
  transform: (v) => {
    return typeof v === "string" ? v : v.hasOwnProperty("red") ? rgba.transform(v) : hsla.transform(v);
  },
  getAnimatableNone: (v) => {
    const parsed = color.parse(v);
    parsed.alpha = 0;
    return color.transform(parsed);
  }
};
const colorRegex = /(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))/giu;
function test(v) {
  return isNaN(v) && typeof v === "string" && (v.match(floatRegex)?.length || 0) + (v.match(colorRegex)?.length || 0) > 0;
}
const NUMBER_TOKEN = "number";
const COLOR_TOKEN = "color";
const VAR_TOKEN = "var";
const VAR_FUNCTION_TOKEN = "var(";
const SPLIT_TOKEN = "${}";
const complexRegex = /var\s*\(\s*--(?:[\w-]+\s*|[\w-]+\s*,(?:\s*[^)(\s]|\s*\((?:[^)(]|\([^)(]*\))*\))+\s*)\)|#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\)|-?(?:\d+(?:\.\d+)?|\.\d+)/giu;
function analyseComplexValue(value) {
  const originalValue = value.toString();
  const values = [];
  const indexes = {
    color: [],
    number: [],
    var: []
  };
  const types = [];
  let i = 0;
  const tokenised = originalValue.replace(complexRegex, (parsedValue) => {
    if (color.test(parsedValue)) {
      indexes.color.push(i);
      types.push(COLOR_TOKEN);
      values.push(color.parse(parsedValue));
    } else if (parsedValue.startsWith(VAR_FUNCTION_TOKEN)) {
      indexes.var.push(i);
      types.push(VAR_TOKEN);
      values.push(parsedValue);
    } else {
      indexes.number.push(i);
      types.push(NUMBER_TOKEN);
      values.push(parseFloat(parsedValue));
    }
    ++i;
    return SPLIT_TOKEN;
  });
  const split = tokenised.split(SPLIT_TOKEN);
  return { values, split, indexes, types };
}
function parseComplexValue(v) {
  return analyseComplexValue(v).values;
}
function buildTransformer({ split, types }) {
  const numSections = split.length;
  return (v) => {
    let output = "";
    for (let i = 0; i < numSections; i++) {
      output += split[i];
      if (v[i] !== void 0) {
        const type = types[i];
        if (type === NUMBER_TOKEN) {
          output += sanitize(v[i]);
        } else if (type === COLOR_TOKEN) {
          output += color.transform(v[i]);
        } else {
          output += v[i];
        }
      }
    }
    return output;
  };
}
function createTransformer(source) {
  return buildTransformer(analyseComplexValue(source));
}
const convertNumbersToZero = (v) => typeof v === "number" ? 0 : color.test(v) ? color.getAnimatableNone(v) : v;
const convertToZero = (value, splitBefore) => {
  if (typeof value === "number") {
    return splitBefore?.trim().endsWith("/") ? value : 0;
  }
  return convertNumbersToZero(value);
};
function getAnimatableNone$1(v) {
  const info = analyseComplexValue(v);
  const transformer = buildTransformer(info);
  return transformer(info.values.map((value, i) => convertToZero(value, info.split[i])));
}
const complex = {
  test,
  parse: parseComplexValue,
  createTransformer,
  getAnimatableNone: getAnimatableNone$1
};
function hueToRgb(p, q, t) {
  if (t < 0)
    t += 1;
  if (t > 1)
    t -= 1;
  if (t < 1 / 6)
    return p + (q - p) * 6 * t;
  if (t < 1 / 2)
    return q;
  if (t < 2 / 3)
    return p + (q - p) * (2 / 3 - t) * 6;
  return p;
}
function hslaToRgba({ hue, saturation, lightness, alpha: alpha2 }) {
  hue /= 360;
  saturation /= 100;
  lightness /= 100;
  let red = 0;
  let green = 0;
  let blue = 0;
  if (!saturation) {
    red = green = blue = lightness;
  } else {
    const q = lightness < 0.5 ? lightness * (1 + saturation) : lightness + saturation - lightness * saturation;
    const p = 2 * lightness - q;
    red = hueToRgb(p, q, hue + 1 / 3);
    green = hueToRgb(p, q, hue);
    blue = hueToRgb(p, q, hue - 1 / 3);
  }
  return {
    red: Math.round(red * 255),
    green: Math.round(green * 255),
    blue: Math.round(blue * 255),
    alpha: alpha2
  };
}
function mixImmediate(a, b) {
  return (p) => p > 0 ? b : a;
}
const mixNumber$1 = (from, to, progress2) => {
  return from + (to - from) * progress2;
};
const mixLinearColor = (from, to, v) => {
  const fromExpo = from * from;
  const expo = v * (to * to - fromExpo) + fromExpo;
  return expo < 0 ? 0 : Math.sqrt(expo);
};
const colorTypes = [hex, rgba, hsla];
const getColorType = (v) => colorTypes.find((type) => type.test(v));
function asRGBA(color2) {
  const type = getColorType(color2);
  if (!Boolean(type))
    return false;
  let model = type.parse(color2);
  if (type === hsla) {
    model = hslaToRgba(model);
  }
  return model;
}
const mixColor = (from, to) => {
  const fromRGBA = asRGBA(from);
  const toRGBA = asRGBA(to);
  if (!fromRGBA || !toRGBA) {
    return mixImmediate(from, to);
  }
  const blended = { ...fromRGBA };
  return (v) => {
    blended.red = mixLinearColor(fromRGBA.red, toRGBA.red, v);
    blended.green = mixLinearColor(fromRGBA.green, toRGBA.green, v);
    blended.blue = mixLinearColor(fromRGBA.blue, toRGBA.blue, v);
    blended.alpha = mixNumber$1(fromRGBA.alpha, toRGBA.alpha, v);
    return rgba.transform(blended);
  };
};
const invisibleValues = /* @__PURE__ */ new Set(["none", "hidden"]);
function mixVisibility(origin, target) {
  if (invisibleValues.has(origin)) {
    return (p) => p <= 0 ? origin : target;
  } else {
    return (p) => p >= 1 ? target : origin;
  }
}
function mixNumber(a, b) {
  return (p) => mixNumber$1(a, b, p);
}
function getMixer(a) {
  if (typeof a === "number") {
    return mixNumber;
  } else if (typeof a === "string") {
    return isCSSVariableToken(a) ? mixImmediate : color.test(a) ? mixColor : mixComplex;
  } else if (Array.isArray(a)) {
    return mixArray;
  } else if (typeof a === "object") {
    return color.test(a) ? mixColor : mixObject;
  }
  return mixImmediate;
}
function mixArray(a, b) {
  const output = [...a];
  const numValues = output.length;
  const blendValue = a.map((v, i) => getMixer(v)(v, b[i]));
  return (p) => {
    for (let i = 0; i < numValues; i++) {
      output[i] = blendValue[i](p);
    }
    return output;
  };
}
function mixObject(a, b) {
  const output = { ...a, ...b };
  const blendValue = {};
  for (const key in output) {
    if (a[key] !== void 0 && b[key] !== void 0) {
      blendValue[key] = getMixer(a[key])(a[key], b[key]);
    }
  }
  return (v) => {
    for (const key in blendValue) {
      output[key] = blendValue[key](v);
    }
    return output;
  };
}
function matchOrder(origin, target) {
  const orderedOrigin = [];
  const pointers = { color: 0, var: 0, number: 0 };
  for (let i = 0; i < target.values.length; i++) {
    const type = target.types[i];
    const originIndex = origin.indexes[type][pointers[type]];
    const originValue = origin.values[originIndex] ?? 0;
    orderedOrigin[i] = originValue;
    pointers[type]++;
  }
  return orderedOrigin;
}
const mixComplex = (origin, target) => {
  const template = complex.createTransformer(target);
  const originStats = analyseComplexValue(origin);
  const targetStats = analyseComplexValue(target);
  const canInterpolate = originStats.indexes.var.length === targetStats.indexes.var.length && originStats.indexes.color.length === targetStats.indexes.color.length && originStats.indexes.number.length >= targetStats.indexes.number.length;
  if (canInterpolate) {
    if (invisibleValues.has(origin) && !targetStats.values.length || invisibleValues.has(target) && !originStats.values.length) {
      return mixVisibility(origin, target);
    }
    return pipe(mixArray(matchOrder(originStats, targetStats), targetStats.values), template);
  } else {
    return mixImmediate(origin, target);
  }
};
function mix(from, to, p) {
  if (typeof from === "number" && typeof to === "number" && typeof p === "number") {
    return mixNumber$1(from, to, p);
  }
  const mixer = getMixer(from);
  return mixer(from, to);
}
const frameloopDriver = (update) => {
  const passTimestamp = ({ timestamp }) => update(timestamp);
  return {
    start: (keepAlive = true) => frame.update(passTimestamp, keepAlive),
    stop: () => cancelFrame(passTimestamp),
    /**
     * If we're processing this frame we can use the
     * framelocked timestamp to keep things in sync.
     */
    now: () => frameData.isProcessing ? frameData.timestamp : time.now()
  };
};
const generateLinearEasing = (easing, duration, resolution = 10) => {
  let points = "";
  const numPoints = Math.max(Math.round(duration / resolution), 2);
  for (let i = 0; i < numPoints; i++) {
    points += Math.round(easing(i / (numPoints - 1)) * 1e4) / 1e4 + ", ";
  }
  return `linear(${points.substring(0, points.length - 2)})`;
};
const maxGeneratorDuration = 2e4;
function calcGeneratorDuration(generator) {
  let duration = 0;
  const timeStep = 50;
  let state = generator.next(duration);
  while (!state.done && duration < maxGeneratorDuration) {
    duration += timeStep;
    state = generator.next(duration);
  }
  return duration >= maxGeneratorDuration ? Infinity : duration;
}
function createGeneratorEasing(options, scale2 = 100, createGenerator) {
  const generator = createGenerator({ ...options, keyframes: [0, scale2] });
  const duration = Math.min(calcGeneratorDuration(generator), maxGeneratorDuration);
  return {
    type: "keyframes",
    ease: (progress2) => {
      return generator.next(duration * progress2).value / scale2;
    },
    duration: /* @__PURE__ */ millisecondsToSeconds(duration)
  };
}
const springDefaults = {
  // Default spring physics
  stiffness: 100,
  damping: 10,
  mass: 1,
  velocity: 0,
  // Default duration/bounce-based options
  duration: 800,
  // in ms
  bounce: 0.3,
  visualDuration: 0.3,
  // in seconds
  // Rest thresholds
  restSpeed: {
    granular: 0.01,
    default: 2
  },
  restDelta: {
    granular: 5e-3,
    default: 0.5
  },
  // Limits
  minDuration: 0.01,
  // in seconds
  maxDuration: 10,
  // in seconds
  minDamping: 0.05,
  maxDamping: 1
};
function calcAngularFreq(undampedFreq, dampingRatio) {
  return undampedFreq * Math.sqrt(1 - dampingRatio * dampingRatio);
}
const rootIterations = 12;
function approximateRoot(envelope, derivative, initialGuess) {
  let result = initialGuess;
  for (let i = 1; i < rootIterations; i++) {
    result = result - envelope(result) / derivative(result);
  }
  return result;
}
const safeMin = 1e-3;
function findSpring({ duration = springDefaults.duration, bounce = springDefaults.bounce, velocity = springDefaults.velocity, mass = springDefaults.mass }) {
  let envelope;
  let derivative;
  let dampingRatio = 1 - bounce;
  dampingRatio = clamp(springDefaults.minDamping, springDefaults.maxDamping, dampingRatio);
  duration = clamp(springDefaults.minDuration, springDefaults.maxDuration, /* @__PURE__ */ millisecondsToSeconds(duration));
  if (dampingRatio < 1) {
    envelope = (undampedFreq2) => {
      const exponentialDecay = undampedFreq2 * dampingRatio;
      const delta = exponentialDecay * duration;
      const a = exponentialDecay - velocity;
      const b = calcAngularFreq(undampedFreq2, dampingRatio);
      const c = Math.exp(-delta);
      return safeMin - a / b * c;
    };
    derivative = (undampedFreq2) => {
      const exponentialDecay = undampedFreq2 * dampingRatio;
      const delta = exponentialDecay * duration;
      const d = delta * velocity + velocity;
      const e = Math.pow(dampingRatio, 2) * Math.pow(undampedFreq2, 2) * duration;
      const f = Math.exp(-delta);
      const g = calcAngularFreq(Math.pow(undampedFreq2, 2), dampingRatio);
      const factor = -envelope(undampedFreq2) + safeMin > 0 ? -1 : 1;
      return factor * ((d - e) * f) / g;
    };
  } else {
    envelope = (undampedFreq2) => {
      const a = Math.exp(-undampedFreq2 * duration);
      const b = (undampedFreq2 - velocity) * duration + 1;
      return -safeMin + a * b;
    };
    derivative = (undampedFreq2) => {
      const a = Math.exp(-undampedFreq2 * duration);
      const b = (velocity - undampedFreq2) * (duration * duration);
      return a * b;
    };
  }
  const initialGuess = 5 / duration;
  const undampedFreq = approximateRoot(envelope, derivative, initialGuess);
  duration = /* @__PURE__ */ secondsToMilliseconds(duration);
  if (isNaN(undampedFreq)) {
    return {
      stiffness: springDefaults.stiffness,
      damping: springDefaults.damping,
      duration
    };
  } else {
    const stiffness = Math.pow(undampedFreq, 2) * mass;
    return {
      stiffness,
      damping: dampingRatio * 2 * Math.sqrt(mass * stiffness),
      duration
    };
  }
}
const durationKeys = ["duration", "bounce"];
const physicsKeys = ["stiffness", "damping", "mass"];
function isSpringType(options, keys) {
  return keys.some((key) => options[key] !== void 0);
}
function getSpringOptions(options) {
  let springOptions = {
    velocity: springDefaults.velocity,
    stiffness: springDefaults.stiffness,
    damping: springDefaults.damping,
    mass: springDefaults.mass,
    isResolvedFromDuration: false,
    ...options
  };
  if (!isSpringType(options, physicsKeys) && isSpringType(options, durationKeys)) {
    springOptions.velocity = 0;
    if (options.visualDuration) {
      const visualDuration = options.visualDuration;
      const root = 2 * Math.PI / (visualDuration * 1.2);
      const stiffness = root * root;
      const damping = 2 * clamp(0.05, 1, 1 - (options.bounce || 0)) * Math.sqrt(stiffness);
      springOptions = {
        ...springOptions,
        mass: springDefaults.mass,
        stiffness,
        damping
      };
    } else {
      const derived = findSpring({ ...options, velocity: 0 });
      springOptions = {
        ...springOptions,
        ...derived,
        mass: springDefaults.mass
      };
      springOptions.isResolvedFromDuration = true;
    }
  }
  return springOptions;
}
function spring(optionsOrVisualDuration = springDefaults.visualDuration, bounce = springDefaults.bounce) {
  const options = typeof optionsOrVisualDuration !== "object" ? {
    visualDuration: optionsOrVisualDuration,
    keyframes: [0, 1],
    bounce
  } : optionsOrVisualDuration;
  let { restSpeed, restDelta } = options;
  const origin = options.keyframes[0];
  const target = options.keyframes[options.keyframes.length - 1];
  const state = { done: false, value: origin };
  const { stiffness, damping, mass, duration, velocity, isResolvedFromDuration } = getSpringOptions({
    ...options,
    velocity: -/* @__PURE__ */ millisecondsToSeconds(options.velocity || 0)
  });
  const initialVelocity = velocity || 0;
  const dampingRatio = damping / (2 * Math.sqrt(stiffness * mass));
  const initialDelta = target - origin;
  const undampedAngularFreq = /* @__PURE__ */ millisecondsToSeconds(Math.sqrt(stiffness / mass));
  const isGranularScale = Math.abs(initialDelta) < 5;
  restSpeed || (restSpeed = isGranularScale ? springDefaults.restSpeed.granular : springDefaults.restSpeed.default);
  restDelta || (restDelta = isGranularScale ? springDefaults.restDelta.granular : springDefaults.restDelta.default);
  let resolveSpring;
  let resolveVelocity;
  let angularFreq;
  let A;
  let sinCoeff;
  let cosCoeff;
  if (dampingRatio < 1) {
    angularFreq = calcAngularFreq(undampedAngularFreq, dampingRatio);
    A = (initialVelocity + dampingRatio * undampedAngularFreq * initialDelta) / angularFreq;
    resolveSpring = (t) => {
      const envelope = Math.exp(-dampingRatio * undampedAngularFreq * t);
      return target - envelope * (A * Math.sin(angularFreq * t) + initialDelta * Math.cos(angularFreq * t));
    };
    sinCoeff = dampingRatio * undampedAngularFreq * A + initialDelta * angularFreq;
    cosCoeff = dampingRatio * undampedAngularFreq * initialDelta - A * angularFreq;
    resolveVelocity = (t) => {
      const envelope = Math.exp(-dampingRatio * undampedAngularFreq * t);
      return envelope * (sinCoeff * Math.sin(angularFreq * t) + cosCoeff * Math.cos(angularFreq * t));
    };
  } else if (dampingRatio === 1) {
    resolveSpring = (t) => target - Math.exp(-undampedAngularFreq * t) * (initialDelta + (initialVelocity + undampedAngularFreq * initialDelta) * t);
    const C = initialVelocity + undampedAngularFreq * initialDelta;
    resolveVelocity = (t) => Math.exp(-undampedAngularFreq * t) * (undampedAngularFreq * C * t - initialVelocity);
  } else {
    const dampedAngularFreq = undampedAngularFreq * Math.sqrt(dampingRatio * dampingRatio - 1);
    resolveSpring = (t) => {
      const envelope = Math.exp(-dampingRatio * undampedAngularFreq * t);
      const freqForT = Math.min(dampedAngularFreq * t, 300);
      return target - envelope * ((initialVelocity + dampingRatio * undampedAngularFreq * initialDelta) * Math.sinh(freqForT) + dampedAngularFreq * initialDelta * Math.cosh(freqForT)) / dampedAngularFreq;
    };
    const P = (initialVelocity + dampingRatio * undampedAngularFreq * initialDelta) / dampedAngularFreq;
    const sinhCoeff = dampingRatio * undampedAngularFreq * P - initialDelta * dampedAngularFreq;
    const coshCoeff = dampingRatio * undampedAngularFreq * initialDelta - P * dampedAngularFreq;
    resolveVelocity = (t) => {
      const envelope = Math.exp(-dampingRatio * undampedAngularFreq * t);
      const freqForT = Math.min(dampedAngularFreq * t, 300);
      return envelope * (sinhCoeff * Math.sinh(freqForT) + coshCoeff * Math.cosh(freqForT));
    };
  }
  const generator = {
    calculatedDuration: isResolvedFromDuration ? duration || null : null,
    velocity: (t) => /* @__PURE__ */ secondsToMilliseconds(resolveVelocity(t)),
    next: (t) => {
      if (!isResolvedFromDuration && dampingRatio < 1) {
        const envelope = Math.exp(-dampingRatio * undampedAngularFreq * t);
        const sin = Math.sin(angularFreq * t);
        const cos = Math.cos(angularFreq * t);
        const current2 = target - envelope * (A * sin + initialDelta * cos);
        const currentVelocity = /* @__PURE__ */ secondsToMilliseconds(envelope * (sinCoeff * sin + cosCoeff * cos));
        state.done = Math.abs(currentVelocity) <= restSpeed && Math.abs(target - current2) <= restDelta;
        state.value = state.done ? target : current2;
        return state;
      }
      const current = resolveSpring(t);
      if (!isResolvedFromDuration) {
        const currentVelocity = /* @__PURE__ */ secondsToMilliseconds(resolveVelocity(t));
        state.done = Math.abs(currentVelocity) <= restSpeed && Math.abs(target - current) <= restDelta;
      } else {
        state.done = t >= duration;
      }
      state.value = state.done ? target : current;
      return state;
    },
    toString: () => {
      const calculatedDuration = Math.min(calcGeneratorDuration(generator), maxGeneratorDuration);
      const easing = generateLinearEasing((progress2) => generator.next(calculatedDuration * progress2).value, calculatedDuration, 30);
      return calculatedDuration + "ms " + easing;
    },
    toTransition: () => {
    }
  };
  return generator;
}
spring.applyToOptions = (options) => {
  const generatorOptions = createGeneratorEasing(options, 100, spring);
  options.ease = generatorOptions.ease;
  options.duration = /* @__PURE__ */ secondsToMilliseconds(generatorOptions.duration);
  options.type = "keyframes";
  return options;
};
const velocitySampleDuration = 5;
function getGeneratorVelocity(resolveValue, t, current) {
  const prevT = Math.max(t - velocitySampleDuration, 0);
  return velocityPerSecond(current - resolveValue(prevT), t - prevT);
}
function inertia({ keyframes: keyframes2, velocity = 0, power = 0.8, timeConstant = 325, bounceDamping = 10, bounceStiffness = 500, modifyTarget, min, max, restDelta = 0.5, restSpeed }) {
  const origin = keyframes2[0];
  const state = {
    done: false,
    value: origin
  };
  const isOutOfBounds = (v) => min !== void 0 && v < min || max !== void 0 && v > max;
  const nearestBoundary = (v) => {
    if (min === void 0)
      return max;
    if (max === void 0)
      return min;
    return Math.abs(min - v) < Math.abs(max - v) ? min : max;
  };
  let amplitude = power * velocity;
  const ideal = origin + amplitude;
  const target = modifyTarget === void 0 ? ideal : modifyTarget(ideal);
  if (target !== ideal)
    amplitude = target - origin;
  const calcDelta = (t) => -amplitude * Math.exp(-t / timeConstant);
  const calcLatest = (t) => target + calcDelta(t);
  const applyFriction = (t) => {
    const delta = calcDelta(t);
    const latest = calcLatest(t);
    state.done = Math.abs(delta) <= restDelta;
    state.value = state.done ? target : latest;
  };
  let timeReachedBoundary;
  let spring$1;
  const checkCatchBoundary = (t) => {
    if (!isOutOfBounds(state.value))
      return;
    timeReachedBoundary = t;
    spring$1 = spring({
      keyframes: [state.value, nearestBoundary(state.value)],
      velocity: getGeneratorVelocity(calcLatest, t, state.value),
      // TODO: This should be passing * 1000
      damping: bounceDamping,
      stiffness: bounceStiffness,
      restDelta,
      restSpeed
    });
  };
  checkCatchBoundary(0);
  return {
    calculatedDuration: null,
    next: (t) => {
      let hasUpdatedFrame = false;
      if (!spring$1 && timeReachedBoundary === void 0) {
        hasUpdatedFrame = true;
        applyFriction(t);
        checkCatchBoundary(t);
      }
      if (timeReachedBoundary !== void 0 && t >= timeReachedBoundary) {
        return spring$1.next(t - timeReachedBoundary);
      } else {
        !hasUpdatedFrame && applyFriction(t);
        return state;
      }
    }
  };
}
function createMixers(output, ease2, customMixer) {
  const mixers = [];
  const mixerFactory = customMixer || MotionGlobalConfig.mix || mix;
  const numMixers = output.length - 1;
  for (let i = 0; i < numMixers; i++) {
    let mixer = mixerFactory(output[i], output[i + 1]);
    if (ease2) {
      const easingFunction = Array.isArray(ease2) ? ease2[i] || noop : ease2;
      mixer = pipe(easingFunction, mixer);
    }
    mixers.push(mixer);
  }
  return mixers;
}
function interpolate(input, output, { clamp: isClamp = true, ease: ease2, mixer } = {}) {
  const inputLength = input.length;
  invariant(inputLength === output.length);
  if (inputLength === 1)
    return () => output[0];
  if (inputLength === 2 && output[0] === output[1])
    return () => output[1];
  const isZeroDeltaRange = input[0] === input[1];
  if (input[0] > input[inputLength - 1]) {
    input = [...input].reverse();
    output = [...output].reverse();
  }
  const mixers = createMixers(output, ease2, mixer);
  const numMixers = mixers.length;
  const interpolator = (v) => {
    if (isZeroDeltaRange && v < input[0])
      return output[0];
    let i = 0;
    if (numMixers > 1) {
      for (; i < input.length - 2; i++) {
        if (v < input[i + 1])
          break;
      }
    }
    const progressInRange = /* @__PURE__ */ progress(input[i], input[i + 1], v);
    return mixers[i](progressInRange);
  };
  return isClamp ? (v) => interpolator(clamp(input[0], input[inputLength - 1], v)) : interpolator;
}
function fillOffset(offset, remaining) {
  const min = offset[offset.length - 1];
  for (let i = 1; i <= remaining; i++) {
    const offsetProgress = /* @__PURE__ */ progress(0, remaining, i);
    offset.push(mixNumber$1(min, 1, offsetProgress));
  }
}
function defaultOffset(arr) {
  const offset = [0];
  fillOffset(offset, arr.length - 1);
  return offset;
}
function convertOffsetToTimes(offset, duration) {
  return offset.map((o) => o * duration);
}
function defaultEasing(values, easing) {
  return values.map(() => easing || easeInOut).splice(0, values.length - 1);
}
function keyframes({ duration = 300, keyframes: keyframeValues, times, ease: ease2 = "easeInOut" }) {
  const easingFunctions = isEasingArray(ease2) ? ease2.map(easingDefinitionToFunction) : easingDefinitionToFunction(ease2);
  const state = {
    done: false,
    value: keyframeValues[0]
  };
  const absoluteTimes = convertOffsetToTimes(
    // Only use the provided offsets if they're the correct length
    // TODO Maybe we should warn here if there's a length mismatch
    times && times.length === keyframeValues.length ? times : defaultOffset(keyframeValues),
    duration
  );
  const mapTimeToKeyframe = interpolate(absoluteTimes, keyframeValues, {
    ease: Array.isArray(easingFunctions) ? easingFunctions : defaultEasing(keyframeValues, easingFunctions)
  });
  return {
    calculatedDuration: duration,
    next: (t) => {
      state.value = mapTimeToKeyframe(t);
      state.done = t >= duration;
      return state;
    }
  };
}
const isNotNull = (value) => value !== null;
function getFinalKeyframe(keyframes2, { repeat, repeatType = "loop" }, finalKeyframe, speed = 1) {
  const resolvedKeyframes = keyframes2.filter(isNotNull);
  const useFirstKeyframe = speed < 0 || repeat && repeatType !== "loop" && repeat % 2 === 1;
  const index = useFirstKeyframe ? 0 : resolvedKeyframes.length - 1;
  return !index || finalKeyframe === void 0 ? resolvedKeyframes[index] : finalKeyframe;
}
const transitionTypeMap = {
  decay: inertia,
  inertia,
  tween: keyframes,
  keyframes,
  spring
};
function replaceTransitionType(transition) {
  if (typeof transition.type === "string") {
    transition.type = transitionTypeMap[transition.type];
  }
}
class WithPromise {
  constructor() {
    this.updateFinished();
  }
  get finished() {
    return this._finished;
  }
  updateFinished() {
    this._finished = new Promise((resolve) => {
      this.resolve = resolve;
    });
  }
  notifyFinished() {
    this.resolve();
  }
  /**
   * Allows the animation to be awaited.
   *
   * @deprecated Use `finished` instead.
   */
  then(onResolve, onReject) {
    return this.finished.then(onResolve, onReject);
  }
}
const percentToProgress = (percent2) => percent2 / 100;
class JSAnimation extends WithPromise {
  constructor(options) {
    super();
    this.state = "idle";
    this.startTime = null;
    this.isStopped = false;
    this.currentTime = 0;
    this.holdTime = null;
    this.playbackSpeed = 1;
    this.delayState = {
      done: false,
      value: void 0
    };
    this.stop = () => {
      const { motionValue: motionValue2 } = this.options;
      if (motionValue2 && motionValue2.updatedAt !== time.now()) {
        this.tick(time.now());
      }
      this.isStopped = true;
      if (this.state === "idle")
        return;
      this.teardown();
      this.options.onStop?.();
    };
    this.options = options;
    this.initAnimation();
    this.play();
    if (options.autoplay === false)
      this.pause();
  }
  initAnimation() {
    const { options } = this;
    replaceTransitionType(options);
    const { type = keyframes, repeat = 0, repeatDelay = 0, repeatType, velocity = 0 } = options;
    let { keyframes: keyframes$1 } = options;
    const generatorFactory = type || keyframes;
    if (generatorFactory !== keyframes && typeof keyframes$1[0] !== "number") {
      this.mixKeyframes = pipe(percentToProgress, mix(keyframes$1[0], keyframes$1[1]));
      keyframes$1 = [0, 100];
    }
    const generator = generatorFactory({ ...options, keyframes: keyframes$1 });
    if (repeatType === "mirror") {
      this.mirroredGenerator = generatorFactory({
        ...options,
        keyframes: [...keyframes$1].reverse(),
        velocity: -velocity
      });
    }
    if (generator.calculatedDuration === null) {
      generator.calculatedDuration = calcGeneratorDuration(generator);
    }
    const { calculatedDuration } = generator;
    this.calculatedDuration = calculatedDuration;
    this.resolvedDuration = calculatedDuration + repeatDelay;
    this.totalDuration = this.resolvedDuration * (repeat + 1) - repeatDelay;
    this.generator = generator;
  }
  updateTime(timestamp) {
    const animationTime = Math.round(timestamp - this.startTime) * this.playbackSpeed;
    if (this.holdTime !== null) {
      this.currentTime = this.holdTime;
    } else {
      this.currentTime = animationTime;
    }
  }
  tick(timestamp, sample = false) {
    const { generator, totalDuration, mixKeyframes, mirroredGenerator, resolvedDuration, calculatedDuration } = this;
    if (this.startTime === null)
      return generator.next(0);
    const { delay: delay2 = 0, keyframes: keyframes2, repeat, repeatType, repeatDelay, type, onUpdate, finalKeyframe } = this.options;
    if (this.speed > 0) {
      this.startTime = Math.min(this.startTime, timestamp);
    } else if (this.speed < 0) {
      this.startTime = Math.min(timestamp - totalDuration / this.speed, this.startTime);
    }
    if (sample) {
      this.currentTime = timestamp;
    } else {
      this.updateTime(timestamp);
    }
    const timeWithoutDelay = this.currentTime - delay2 * (this.playbackSpeed >= 0 ? 1 : -1);
    const isInDelayPhase = this.playbackSpeed >= 0 ? timeWithoutDelay < 0 : timeWithoutDelay > totalDuration;
    this.currentTime = Math.max(timeWithoutDelay, 0);
    if (this.state === "finished" && this.holdTime === null) {
      this.currentTime = totalDuration;
    }
    let elapsed = this.currentTime;
    let frameGenerator = generator;
    if (repeat) {
      const progress2 = Math.min(this.currentTime, totalDuration) / resolvedDuration;
      let currentIteration = Math.floor(progress2);
      let iterationProgress = progress2 % 1;
      if (!iterationProgress && progress2 >= 1) {
        iterationProgress = 1;
      }
      iterationProgress === 1 && currentIteration--;
      currentIteration = Math.min(currentIteration, repeat + 1);
      const isOddIteration = Boolean(currentIteration % 2);
      if (isOddIteration) {
        if (repeatType === "reverse") {
          iterationProgress = 1 - iterationProgress;
          if (repeatDelay) {
            iterationProgress -= repeatDelay / resolvedDuration;
          }
        } else if (repeatType === "mirror") {
          frameGenerator = mirroredGenerator;
        }
      }
      elapsed = clamp(0, 1, iterationProgress) * resolvedDuration;
    }
    let state;
    if (isInDelayPhase) {
      this.delayState.value = keyframes2[0];
      state = this.delayState;
    } else {
      state = frameGenerator.next(elapsed);
    }
    if (mixKeyframes && !isInDelayPhase) {
      state.value = mixKeyframes(state.value);
    }
    let { done } = state;
    if (!isInDelayPhase && calculatedDuration !== null) {
      done = this.playbackSpeed >= 0 ? this.currentTime >= totalDuration : this.currentTime <= 0;
    }
    const isAnimationFinished = this.holdTime === null && (this.state === "finished" || this.state === "running" && done);
    if (isAnimationFinished && type !== inertia) {
      state.value = getFinalKeyframe(keyframes2, this.options, finalKeyframe, this.speed);
    }
    if (onUpdate) {
      onUpdate(state.value);
    }
    if (isAnimationFinished) {
      this.finish();
    }
    return state;
  }
  /**
   * Allows the returned animation to be awaited or promise-chained. Currently
   * resolves when the animation finishes at all but in a future update could/should
   * reject if its cancels.
   */
  then(resolve, reject) {
    return this.finished.then(resolve, reject);
  }
  get duration() {
    return /* @__PURE__ */ millisecondsToSeconds(this.calculatedDuration);
  }
  get iterationDuration() {
    const { delay: delay2 = 0 } = this.options || {};
    return this.duration + /* @__PURE__ */ millisecondsToSeconds(delay2);
  }
  get time() {
    return /* @__PURE__ */ millisecondsToSeconds(this.currentTime);
  }
  set time(newTime) {
    newTime = /* @__PURE__ */ secondsToMilliseconds(newTime);
    this.currentTime = newTime;
    if (this.startTime === null || this.holdTime !== null || this.playbackSpeed === 0) {
      this.holdTime = newTime;
    } else if (this.driver) {
      this.startTime = this.driver.now() - newTime / this.playbackSpeed;
    }
    if (this.driver) {
      this.driver.start(false);
    } else {
      this.startTime = 0;
      this.state = "paused";
      this.holdTime = newTime;
      this.tick(newTime);
    }
  }
  /**
   * Returns the generator's velocity at the current time in units/second.
   * Uses the analytical derivative when available (springs), avoiding
   * the MotionValue's frame-dependent velocity estimation.
   */
  getGeneratorVelocity() {
    const t = this.currentTime;
    if (t <= 0)
      return this.options.velocity || 0;
    if (this.generator.velocity) {
      return this.generator.velocity(t);
    }
    const current = this.generator.next(t).value;
    return getGeneratorVelocity((s) => this.generator.next(s).value, t, current);
  }
  get speed() {
    return this.playbackSpeed;
  }
  set speed(newSpeed) {
    const hasChanged = this.playbackSpeed !== newSpeed;
    if (hasChanged && this.driver) {
      this.updateTime(time.now());
    }
    this.playbackSpeed = newSpeed;
    if (hasChanged && this.driver) {
      this.time = /* @__PURE__ */ millisecondsToSeconds(this.currentTime);
    }
  }
  play() {
    if (this.isStopped)
      return;
    const { driver = frameloopDriver, startTime } = this.options;
    if (!this.driver) {
      this.driver = driver((timestamp) => this.tick(timestamp));
    }
    this.options.onPlay?.();
    const now2 = this.driver.now();
    if (this.state === "finished") {
      this.updateFinished();
      this.startTime = now2;
    } else if (this.holdTime !== null) {
      this.startTime = now2 - this.holdTime;
    } else if (!this.startTime) {
      this.startTime = startTime ?? now2;
    }
    if (this.state === "finished" && this.speed < 0) {
      this.startTime += this.calculatedDuration;
    }
    this.holdTime = null;
    this.state = "running";
    this.driver.start();
  }
  pause() {
    this.state = "paused";
    this.updateTime(time.now());
    this.holdTime = this.currentTime;
  }
  complete() {
    if (this.state !== "running") {
      this.play();
    }
    this.state = "finished";
    this.holdTime = null;
  }
  finish() {
    this.notifyFinished();
    this.teardown();
    this.state = "finished";
    this.options.onComplete?.();
  }
  cancel() {
    this.holdTime = null;
    this.startTime = 0;
    this.tick(0);
    this.teardown();
    this.options.onCancel?.();
  }
  teardown() {
    this.state = "idle";
    this.stopDriver();
    this.startTime = this.holdTime = null;
  }
  stopDriver() {
    if (!this.driver)
      return;
    this.driver.stop();
    this.driver = void 0;
  }
  sample(sampleTime) {
    this.startTime = 0;
    return this.tick(sampleTime, true);
  }
  attachTimeline(timeline) {
    if (this.options.allowFlatten) {
      this.options.type = "keyframes";
      this.options.ease = "linear";
      this.initAnimation();
    }
    this.driver?.stop();
    return timeline.observe(this);
  }
}
function fillWildcards(keyframes2) {
  for (let i = 1; i < keyframes2.length; i++) {
    keyframes2[i] ?? (keyframes2[i] = keyframes2[i - 1]);
  }
}
const radToDeg = (rad) => rad * 180 / Math.PI;
const rotate = (v) => {
  const angle = radToDeg(Math.atan2(v[1], v[0]));
  return rebaseAngle(angle);
};
const matrix2dParsers = {
  x: 4,
  y: 5,
  translateX: 4,
  translateY: 5,
  scaleX: 0,
  scaleY: 3,
  scale: (v) => (Math.abs(v[0]) + Math.abs(v[3])) / 2,
  rotate,
  rotateZ: rotate,
  skewX: (v) => radToDeg(Math.atan(v[1])),
  skewY: (v) => radToDeg(Math.atan(v[2])),
  skew: (v) => (Math.abs(v[1]) + Math.abs(v[2])) / 2
};
const rebaseAngle = (angle) => {
  angle = angle % 360;
  if (angle < 0)
    angle += 360;
  return angle;
};
const rotateZ = rotate;
const scaleX = (v) => Math.sqrt(v[0] * v[0] + v[1] * v[1]);
const scaleY = (v) => Math.sqrt(v[4] * v[4] + v[5] * v[5]);
const matrix3dParsers = {
  x: 12,
  y: 13,
  z: 14,
  translateX: 12,
  translateY: 13,
  translateZ: 14,
  scaleX,
  scaleY,
  scale: (v) => (scaleX(v) + scaleY(v)) / 2,
  rotateX: (v) => rebaseAngle(radToDeg(Math.atan2(v[6], v[5]))),
  rotateY: (v) => rebaseAngle(radToDeg(Math.atan2(-v[2], v[0]))),
  rotateZ,
  rotate: rotateZ,
  skewX: (v) => radToDeg(Math.atan(v[4])),
  skewY: (v) => radToDeg(Math.atan(v[1])),
  skew: (v) => (Math.abs(v[1]) + Math.abs(v[4])) / 2
};
function defaultTransformValue(name) {
  return name.includes("scale") ? 1 : 0;
}
function parseValueFromTransform(transform, name) {
  if (!transform || transform === "none") {
    return defaultTransformValue(name);
  }
  const matrix3dMatch = transform.match(/^matrix3d\(([-\d.e\s,]+)\)$/u);
  let parsers;
  let match;
  if (matrix3dMatch) {
    parsers = matrix3dParsers;
    match = matrix3dMatch;
  } else {
    const matrix2dMatch = transform.match(/^matrix\(([-\d.e\s,]+)\)$/u);
    parsers = matrix2dParsers;
    match = matrix2dMatch;
  }
  if (!match) {
    return defaultTransformValue(name);
  }
  const valueParser = parsers[name];
  const values = match[1].split(",").map(convertTransformToNumber);
  return typeof valueParser === "function" ? valueParser(values) : values[valueParser];
}
const readTransformValue = (instance, name) => {
  const { transform = "none" } = getComputedStyle(instance);
  return parseValueFromTransform(transform, name);
};
function convertTransformToNumber(value) {
  return parseFloat(value.trim());
}
const transformPropOrder = [
  "transformPerspective",
  "x",
  "y",
  "z",
  "translateX",
  "translateY",
  "translateZ",
  "scale",
  "scaleX",
  "scaleY",
  "rotate",
  "rotateX",
  "rotateY",
  "rotateZ",
  "skew",
  "skewX",
  "skewY"
];
const transformProps = /* @__PURE__ */ (() => new Set(transformPropOrder))();
const isNumOrPxType = (v) => v === number || v === px;
const transformKeys = /* @__PURE__ */ new Set(["x", "y", "z"]);
const nonTranslationalTransformKeys = transformPropOrder.filter((key) => !transformKeys.has(key));
function removeNonTranslationalTransform(visualElement) {
  const removedTransforms = [];
  nonTranslationalTransformKeys.forEach((key) => {
    const value = visualElement.getValue(key);
    if (value !== void 0) {
      removedTransforms.push([key, value.get()]);
      value.set(key.startsWith("scale") ? 1 : 0);
    }
  });
  return removedTransforms;
}
const positionalValues = {
  // Dimensions
  width: ({ x }, { paddingLeft = "0", paddingRight = "0", boxSizing }) => {
    const width = x.max - x.min;
    return boxSizing === "border-box" ? width : width - parseFloat(paddingLeft) - parseFloat(paddingRight);
  },
  height: ({ y }, { paddingTop = "0", paddingBottom = "0", boxSizing }) => {
    const height = y.max - y.min;
    return boxSizing === "border-box" ? height : height - parseFloat(paddingTop) - parseFloat(paddingBottom);
  },
  top: (_bbox, { top }) => parseFloat(top),
  left: (_bbox, { left }) => parseFloat(left),
  bottom: ({ y }, { top }) => parseFloat(top) + (y.max - y.min),
  right: ({ x }, { left }) => parseFloat(left) + (x.max - x.min),
  // Transform
  x: (_bbox, { transform }) => parseValueFromTransform(transform, "x"),
  y: (_bbox, { transform }) => parseValueFromTransform(transform, "y")
};
positionalValues.translateX = positionalValues.x;
positionalValues.translateY = positionalValues.y;
const toResolve = /* @__PURE__ */ new Set();
let isScheduled = false;
let anyNeedsMeasurement = false;
let isForced = false;
function measureAllKeyframes() {
  if (anyNeedsMeasurement) {
    const resolversToMeasure = Array.from(toResolve).filter((resolver) => resolver.needsMeasurement);
    const elementsToMeasure = new Set(resolversToMeasure.map((resolver) => resolver.element));
    const transformsToRestore = /* @__PURE__ */ new Map();
    elementsToMeasure.forEach((element) => {
      const removedTransforms = removeNonTranslationalTransform(element);
      if (!removedTransforms.length)
        return;
      transformsToRestore.set(element, removedTransforms);
      element.render();
    });
    resolversToMeasure.forEach((resolver) => resolver.measureInitialState());
    elementsToMeasure.forEach((element) => {
      element.render();
      const restore = transformsToRestore.get(element);
      if (restore) {
        restore.forEach(([key, value]) => {
          element.getValue(key)?.set(value);
        });
      }
    });
    resolversToMeasure.forEach((resolver) => resolver.measureEndState());
    resolversToMeasure.forEach((resolver) => {
      if (resolver.suspendedScrollY !== void 0) {
        window.scrollTo(0, resolver.suspendedScrollY);
      }
    });
  }
  anyNeedsMeasurement = false;
  isScheduled = false;
  toResolve.forEach((resolver) => resolver.complete(isForced));
  toResolve.clear();
}
function readAllKeyframes() {
  toResolve.forEach((resolver) => {
    resolver.readKeyframes();
    if (resolver.needsMeasurement) {
      anyNeedsMeasurement = true;
    }
  });
}
function flushKeyframeResolvers() {
  isForced = true;
  readAllKeyframes();
  measureAllKeyframes();
  isForced = false;
}
class KeyframeResolver {
  constructor(unresolvedKeyframes, onComplete, name, motionValue2, element, isAsync = false) {
    this.state = "pending";
    this.isAsync = false;
    this.needsMeasurement = false;
    this.unresolvedKeyframes = [...unresolvedKeyframes];
    this.onComplete = onComplete;
    this.name = name;
    this.motionValue = motionValue2;
    this.element = element;
    this.isAsync = isAsync;
  }
  scheduleResolve() {
    this.state = "scheduled";
    if (this.isAsync) {
      toResolve.add(this);
      if (!isScheduled) {
        isScheduled = true;
        frame.read(readAllKeyframes);
        frame.resolveKeyframes(measureAllKeyframes);
      }
    } else {
      this.readKeyframes();
      this.complete();
    }
  }
  readKeyframes() {
    const { unresolvedKeyframes, name, element, motionValue: motionValue2 } = this;
    if (unresolvedKeyframes[0] === null) {
      const currentValue = motionValue2?.get();
      const finalKeyframe = unresolvedKeyframes[unresolvedKeyframes.length - 1];
      if (currentValue !== void 0) {
        unresolvedKeyframes[0] = currentValue;
      } else if (element && name) {
        const valueAsRead = element.readValue(name, finalKeyframe);
        if (valueAsRead !== void 0 && valueAsRead !== null) {
          unresolvedKeyframes[0] = valueAsRead;
        }
      }
      if (unresolvedKeyframes[0] === void 0) {
        unresolvedKeyframes[0] = finalKeyframe;
      }
      if (motionValue2 && currentValue === void 0) {
        motionValue2.set(unresolvedKeyframes[0]);
      }
    }
    fillWildcards(unresolvedKeyframes);
  }
  setFinalKeyframe() {
  }
  measureInitialState() {
  }
  renderEndStyles() {
  }
  measureEndState() {
  }
  complete(isForcedComplete = false) {
    this.state = "complete";
    this.onComplete(this.unresolvedKeyframes, this.finalKeyframe, isForcedComplete);
    toResolve.delete(this);
  }
  cancel() {
    if (this.state === "scheduled") {
      toResolve.delete(this);
      this.state = "pending";
    }
  }
  resume() {
    if (this.state === "pending")
      this.scheduleResolve();
  }
}
const isCSSVar = (name) => name.startsWith("--");
function setStyle(element, name, value) {
  isCSSVar(name) ? element.style.setProperty(name, value) : element.style[name] = value;
}
const supportsFlags = {};
function memoSupports(callback, supportsFlag) {
  const memoized = /* @__PURE__ */ memo(callback);
  return () => supportsFlags[supportsFlag] ?? memoized();
}
const supportsScrollTimeline = /* @__PURE__ */ memoSupports(() => window.ScrollTimeline !== void 0, "scrollTimeline");
const supportsLinearEasing = /* @__PURE__ */ memoSupports(() => {
  try {
    document.createElement("div").animate({ opacity: 0 }, { easing: "linear(0, 1)" });
  } catch (e) {
    return false;
  }
  return true;
}, "linearEasing");
const cubicBezierAsString = ([a, b, c, d]) => `cubic-bezier(${a}, ${b}, ${c}, ${d})`;
const supportedWaapiEasing = {
  linear: "linear",
  ease: "ease",
  easeIn: "ease-in",
  easeOut: "ease-out",
  easeInOut: "ease-in-out",
  circIn: /* @__PURE__ */ cubicBezierAsString([0, 0.65, 0.55, 1]),
  circOut: /* @__PURE__ */ cubicBezierAsString([0.55, 0, 1, 0.45]),
  backIn: /* @__PURE__ */ cubicBezierAsString([0.31, 0.01, 0.66, -0.59]),
  backOut: /* @__PURE__ */ cubicBezierAsString([0.33, 1.53, 0.69, 0.99])
};
function mapEasingToNativeEasing(easing, duration) {
  if (!easing) {
    return void 0;
  } else if (typeof easing === "function") {
    return supportsLinearEasing() ? generateLinearEasing(easing, duration) : "ease-out";
  } else if (isBezierDefinition(easing)) {
    return cubicBezierAsString(easing);
  } else if (Array.isArray(easing)) {
    return easing.map((segmentEasing) => mapEasingToNativeEasing(segmentEasing, duration) || supportedWaapiEasing.easeOut);
  } else {
    return supportedWaapiEasing[easing];
  }
}
function startWaapiAnimation(element, valueName, keyframes2, { delay: delay2 = 0, duration = 300, repeat = 0, repeatType = "loop", ease: ease2 = "easeOut", times } = {}, pseudoElement = void 0) {
  const keyframeOptions = {
    [valueName]: keyframes2
  };
  if (times)
    keyframeOptions.offset = times;
  const easing = mapEasingToNativeEasing(ease2, duration);
  if (Array.isArray(easing))
    keyframeOptions.easing = easing;
  const options = {
    delay: delay2,
    duration,
    easing: !Array.isArray(easing) ? easing : "linear",
    fill: "both",
    iterations: repeat + 1,
    direction: repeatType === "reverse" ? "alternate" : "normal"
  };
  if (pseudoElement)
    options.pseudoElement = pseudoElement;
  const animation = element.animate(keyframeOptions, options);
  return animation;
}
function isGenerator(type) {
  return typeof type === "function" && "applyToOptions" in type;
}
function applyGeneratorOptions({ type, ...options }) {
  if (isGenerator(type) && supportsLinearEasing()) {
    return type.applyToOptions(options);
  } else {
    options.duration ?? (options.duration = 300);
    options.ease ?? (options.ease = "easeOut");
  }
  return options;
}
class NativeAnimation extends WithPromise {
  constructor(options) {
    super();
    this.finishedTime = null;
    this.isStopped = false;
    this.manualStartTime = null;
    if (!options)
      return;
    const { element, name, keyframes: keyframes2, pseudoElement, allowFlatten = false, finalKeyframe, onComplete } = options;
    this.isPseudoElement = Boolean(pseudoElement);
    this.allowFlatten = allowFlatten;
    this.options = options;
    invariant(typeof options.type !== "string");
    const transition = applyGeneratorOptions(options);
    this.animation = startWaapiAnimation(element, name, keyframes2, transition, pseudoElement);
    if (transition.autoplay === false) {
      this.animation.pause();
    }
    this.animation.onfinish = () => {
      this.finishedTime = this.time;
      if (!pseudoElement) {
        const keyframe = getFinalKeyframe(keyframes2, this.options, finalKeyframe, this.speed);
        if (this.updateMotionValue) {
          this.updateMotionValue(keyframe);
        }
        setStyle(element, name, keyframe);
        this.animation.cancel();
      }
      onComplete?.();
      this.notifyFinished();
    };
  }
  play() {
    if (this.isStopped)
      return;
    this.manualStartTime = null;
    this.animation.play();
    if (this.state === "finished") {
      this.updateFinished();
    }
  }
  pause() {
    this.animation.pause();
  }
  complete() {
    this.animation.finish?.();
  }
  cancel() {
    try {
      this.animation.cancel();
    } catch (e) {
    }
  }
  stop() {
    if (this.isStopped)
      return;
    this.isStopped = true;
    const { state } = this;
    if (state === "idle" || state === "finished") {
      return;
    }
    if (this.updateMotionValue) {
      this.updateMotionValue();
    } else {
      this.commitStyles();
    }
    if (!this.isPseudoElement)
      this.cancel();
  }
  /**
   * WAAPI doesn't natively have any interruption capabilities.
   *
   * In this method, we commit styles back to the DOM before cancelling
   * the animation.
   *
   * This is designed to be overridden by NativeAnimationExtended, which
   * will create a renderless JS animation and sample it twice to calculate
   * its current value, "previous" value, and therefore allow
   * Motion to also correctly calculate velocity for any subsequent animation
   * while deferring the commit until the next animation frame.
   */
  commitStyles() {
    const element = this.options?.element;
    if (!this.isPseudoElement && element?.isConnected) {
      this.animation.commitStyles?.();
    }
  }
  get duration() {
    const duration = this.animation.effect?.getComputedTiming?.().duration || 0;
    return /* @__PURE__ */ millisecondsToSeconds(Number(duration));
  }
  get iterationDuration() {
    const { delay: delay2 = 0 } = this.options || {};
    return this.duration + /* @__PURE__ */ millisecondsToSeconds(delay2);
  }
  get time() {
    return /* @__PURE__ */ millisecondsToSeconds(Number(this.animation.currentTime) || 0);
  }
  set time(newTime) {
    const wasFinished = this.finishedTime !== null;
    this.manualStartTime = null;
    this.finishedTime = null;
    this.animation.currentTime = /* @__PURE__ */ secondsToMilliseconds(newTime);
    if (wasFinished) {
      this.animation.pause();
    }
  }
  /**
   * The playback speed of the animation.
   * 1 = normal speed, 2 = double speed, 0.5 = half speed.
   */
  get speed() {
    return this.animation.playbackRate;
  }
  set speed(newSpeed) {
    if (newSpeed < 0)
      this.finishedTime = null;
    this.animation.playbackRate = newSpeed;
  }
  get state() {
    return this.finishedTime !== null ? "finished" : this.animation.playState;
  }
  get startTime() {
    return this.manualStartTime ?? Number(this.animation.startTime);
  }
  set startTime(newStartTime) {
    this.manualStartTime = this.animation.startTime = newStartTime;
  }
  /**
   * Attaches a timeline to the animation, for instance the `ScrollTimeline`.
   */
  attachTimeline({ timeline, rangeStart, rangeEnd, observe }) {
    if (this.allowFlatten) {
      this.animation.effect?.updateTiming({ easing: "linear" });
    }
    this.animation.onfinish = null;
    if (timeline && supportsScrollTimeline()) {
      this.animation.timeline = timeline;
      if (rangeStart)
        this.animation.rangeStart = rangeStart;
      if (rangeEnd)
        this.animation.rangeEnd = rangeEnd;
      return noop;
    } else {
      return observe(this);
    }
  }
}
const unsupportedEasingFunctions = {
  anticipate,
  backInOut,
  circInOut
};
function isUnsupportedEase(key) {
  return key in unsupportedEasingFunctions;
}
function replaceStringEasing(transition) {
  if (typeof transition.ease === "string" && isUnsupportedEase(transition.ease)) {
    transition.ease = unsupportedEasingFunctions[transition.ease];
  }
}
const sampleDelta = 10;
class NativeAnimationExtended extends NativeAnimation {
  constructor(options) {
    replaceStringEasing(options);
    replaceTransitionType(options);
    super(options);
    if (options.startTime !== void 0 && options.autoplay !== false) {
      this.startTime = options.startTime;
    }
    this.options = options;
  }
  /**
   * WAAPI doesn't natively have any interruption capabilities.
   *
   * Rather than read committed styles back out of the DOM, we can
   * create a renderless JS animation and sample it twice to calculate
   * its current value, "previous" value, and therefore allow
   * Motion to calculate velocity for any subsequent animation.
   */
  updateMotionValue(value) {
    const { motionValue: motionValue2, onUpdate, onComplete, element, ...options } = this.options;
    if (!motionValue2)
      return;
    if (value !== void 0) {
      motionValue2.set(value);
      return;
    }
    const sampleAnimation = new JSAnimation({
      ...options,
      autoplay: false
    });
    const sampleTime = Math.max(sampleDelta, time.now() - this.startTime);
    const delta = clamp(0, sampleDelta, sampleTime - sampleDelta);
    const current = sampleAnimation.sample(sampleTime).value;
    const { name } = this.options;
    if (element && name)
      setStyle(element, name, current);
    motionValue2.setWithVelocity(sampleAnimation.sample(Math.max(0, sampleTime - delta)).value, current, delta);
    sampleAnimation.stop();
  }
}
const isAnimatable = (value, name) => {
  if (name === "zIndex")
    return false;
  if (typeof value === "number" || Array.isArray(value))
    return true;
  if (typeof value === "string" && // It's animatable if we have a string
  (complex.test(value) || value === "0") && // And it contains numbers and/or colors
  !value.startsWith("url(")) {
    return true;
  }
  return false;
};
function hasKeyframesChanged(keyframes2) {
  const current = keyframes2[0];
  if (keyframes2.length === 1)
    return true;
  for (let i = 0; i < keyframes2.length; i++) {
    if (keyframes2[i] !== current)
      return true;
  }
}
function canAnimate(keyframes2, name, type, velocity) {
  const originKeyframe = keyframes2[0];
  if (originKeyframe === null) {
    return false;
  }
  if (name === "display" || name === "visibility")
    return true;
  const targetKeyframe = keyframes2[keyframes2.length - 1];
  const isOriginAnimatable = isAnimatable(originKeyframe, name);
  const isTargetAnimatable = isAnimatable(targetKeyframe, name);
  if (!isOriginAnimatable || !isTargetAnimatable) {
    return false;
  }
  return hasKeyframesChanged(keyframes2) || (type === "spring" || isGenerator(type)) && velocity;
}
function makeAnimationInstant(options) {
  options.duration = 0;
  options.type = "keyframes";
}
const acceleratedValues = /* @__PURE__ */ new Set([
  "opacity",
  "clipPath",
  "filter",
  "transform"
  // TODO: Can be accelerated but currently disabled until https://issues.chromium.org/issues/41491098 is resolved
  // or until we implement support for linear() easing.
  // "background-color"
]);
const browserColorFunctions = /^(?:oklch|oklab|lab|lch|color|color-mix|light-dark)\(/;
function hasBrowserOnlyColors(keyframes2) {
  for (let i = 0; i < keyframes2.length; i++) {
    if (typeof keyframes2[i] === "string" && browserColorFunctions.test(keyframes2[i])) {
      return true;
    }
  }
  return false;
}
const colorProperties = /* @__PURE__ */ new Set([
  "color",
  "backgroundColor",
  "outlineColor",
  "fill",
  "stroke",
  "borderColor",
  "borderTopColor",
  "borderRightColor",
  "borderBottomColor",
  "borderLeftColor"
]);
const supportsWaapi = /* @__PURE__ */ memo(() => Object.hasOwnProperty.call(Element.prototype, "animate"));
function supportsBrowserAnimation(options) {
  const { motionValue: motionValue2, name, repeatDelay, repeatType, damping, type, keyframes: keyframes2 } = options;
  const subject = motionValue2?.owner?.current;
  if (!(subject instanceof HTMLElement)) {
    return false;
  }
  const { onUpdate, transformTemplate } = motionValue2.owner.getProps();
  return supportsWaapi() && name && /**
   * Force WAAPI for color properties with browser-only color formats
   * (oklch, oklab, lab, lch, etc.) that the JS animation path can't parse.
   */
  (acceleratedValues.has(name) || colorProperties.has(name) && hasBrowserOnlyColors(keyframes2)) && (name !== "transform" || !transformTemplate) && /**
   * If we're outputting values to onUpdate then we can't use WAAPI as there's
   * no way to read the value from WAAPI every frame.
   */
  !onUpdate && !repeatDelay && repeatType !== "mirror" && damping !== 0 && type !== "inertia";
}
const MAX_RESOLVE_DELAY = 40;
class AsyncMotionValueAnimation extends WithPromise {
  constructor({ autoplay = true, delay: delay2 = 0, type = "keyframes", repeat = 0, repeatDelay = 0, repeatType = "loop", keyframes: keyframes2, name, motionValue: motionValue2, element, ...options }) {
    super();
    this.stop = () => {
      if (this._animation) {
        this._animation.stop();
        this.stopTimeline?.();
      }
      this.keyframeResolver?.cancel();
    };
    this.createdAt = time.now();
    const optionsWithDefaults = {
      autoplay,
      delay: delay2,
      type,
      repeat,
      repeatDelay,
      repeatType,
      name,
      motionValue: motionValue2,
      element,
      ...options
    };
    const KeyframeResolver$1 = element?.KeyframeResolver || KeyframeResolver;
    this.keyframeResolver = new KeyframeResolver$1(keyframes2, (resolvedKeyframes, finalKeyframe, forced) => this.onKeyframesResolved(resolvedKeyframes, finalKeyframe, optionsWithDefaults, !forced), name, motionValue2, element);
    this.keyframeResolver?.scheduleResolve();
  }
  onKeyframesResolved(keyframes2, finalKeyframe, options, sync) {
    this.keyframeResolver = void 0;
    const { name, type, velocity, delay: delay2, isHandoff, onUpdate } = options;
    this.resolvedAt = time.now();
    let canAnimateValue = true;
    if (!canAnimate(keyframes2, name, type, velocity)) {
      canAnimateValue = false;
      if (MotionGlobalConfig.instantAnimations || !delay2) {
        onUpdate?.(getFinalKeyframe(keyframes2, options, finalKeyframe));
      }
      keyframes2[0] = keyframes2[keyframes2.length - 1];
      makeAnimationInstant(options);
      options.repeat = 0;
    }
    const startTime = sync ? !this.resolvedAt ? this.createdAt : this.resolvedAt - this.createdAt > MAX_RESOLVE_DELAY ? this.resolvedAt : this.createdAt : void 0;
    const resolvedOptions = {
      startTime,
      finalKeyframe,
      ...options,
      keyframes: keyframes2
    };
    const useWaapi = canAnimateValue && !isHandoff && supportsBrowserAnimation(resolvedOptions);
    const element = resolvedOptions.motionValue?.owner?.current;
    let animation;
    if (useWaapi) {
      try {
        animation = new NativeAnimationExtended({
          ...resolvedOptions,
          element
        });
      } catch {
        animation = new JSAnimation(resolvedOptions);
      }
    } else {
      animation = new JSAnimation(resolvedOptions);
    }
    animation.finished.then(() => {
      this.notifyFinished();
    }).catch(noop);
    if (this.pendingTimeline) {
      this.stopTimeline = animation.attachTimeline(this.pendingTimeline);
      this.pendingTimeline = void 0;
    }
    this._animation = animation;
  }
  get finished() {
    if (!this._animation) {
      return this._finished;
    } else {
      return this.animation.finished;
    }
  }
  then(onResolve, _onReject) {
    return this.finished.finally(onResolve).then(() => {
    });
  }
  get animation() {
    if (!this._animation) {
      this.keyframeResolver?.resume();
      flushKeyframeResolvers();
    }
    return this._animation;
  }
  get duration() {
    return this.animation.duration;
  }
  get iterationDuration() {
    return this.animation.iterationDuration;
  }
  get time() {
    return this.animation.time;
  }
  set time(newTime) {
    this.animation.time = newTime;
  }
  get speed() {
    return this.animation.speed;
  }
  get state() {
    return this.animation.state;
  }
  set speed(newSpeed) {
    this.animation.speed = newSpeed;
  }
  get startTime() {
    return this.animation.startTime;
  }
  attachTimeline(timeline) {
    if (this._animation) {
      this.stopTimeline = this.animation.attachTimeline(timeline);
    } else {
      this.pendingTimeline = timeline;
    }
    return () => this.stop();
  }
  play() {
    this.animation.play();
  }
  pause() {
    this.animation.pause();
  }
  complete() {
    this.animation.complete();
  }
  cancel() {
    if (this._animation) {
      this.animation.cancel();
    }
    this.keyframeResolver?.cancel();
  }
}
function calcChildStagger(children, child, delayChildren, staggerChildren = 0, staggerDirection = 1) {
  const index = Array.from(children).sort((a, b) => a.sortNodePosition(b)).indexOf(child);
  const numChildren = children.size;
  const maxStaggerDuration = (numChildren - 1) * staggerChildren;
  const delayIsFunction = typeof delayChildren === "function";
  return delayIsFunction ? delayChildren(index, numChildren) : staggerDirection === 1 ? index * staggerChildren : maxStaggerDuration - index * staggerChildren;
}
const splitCSSVariableRegex = (
  // eslint-disable-next-line redos-detector/no-unsafe-regex -- false positive, as it can match a lot of words
  /^var\(--(?:([\w-]+)|([\w-]+), ?([a-zA-Z\d ()%#.,-]+))\)/u
);
function parseCSSVariable(current) {
  const match = splitCSSVariableRegex.exec(current);
  if (!match)
    return [,];
  const [, token1, token2, fallback] = match;
  return [`--${token1 ?? token2}`, fallback];
}
function getVariableValue(current, element, depth = 1) {
  const [token, fallback] = parseCSSVariable(current);
  if (!token)
    return;
  const resolved = window.getComputedStyle(element).getPropertyValue(token);
  if (resolved) {
    const trimmed = resolved.trim();
    return isNumericalString(trimmed) ? parseFloat(trimmed) : trimmed;
  }
  return isCSSVariableToken(fallback) ? getVariableValue(fallback, element, depth + 1) : fallback;
}
const underDampedSpring = {
  type: "spring",
  stiffness: 500,
  damping: 25,
  restSpeed: 10
};
const criticallyDampedSpring = (target) => ({
  type: "spring",
  stiffness: 550,
  damping: target === 0 ? 2 * Math.sqrt(550) : 30,
  restSpeed: 10
});
const keyframesTransition = {
  type: "keyframes",
  duration: 0.8
};
const ease = {
  type: "keyframes",
  ease: [0.25, 0.1, 0.35, 1],
  duration: 0.3
};
const getDefaultTransition = (valueKey, { keyframes: keyframes2 }) => {
  if (keyframes2.length > 2) {
    return keyframesTransition;
  } else if (transformProps.has(valueKey)) {
    return valueKey.startsWith("scale") ? criticallyDampedSpring(keyframes2[1]) : underDampedSpring;
  }
  return ease;
};
function resolveTransition(transition, parentTransition) {
  if (transition?.inherit && parentTransition) {
    const { inherit: _, ...rest } = transition;
    return { ...parentTransition, ...rest };
  }
  return transition;
}
function getValueTransition(transition, key) {
  const valueTransition = transition?.[key] ?? transition?.["default"] ?? transition;
  if (valueTransition !== transition) {
    return resolveTransition(valueTransition, transition);
  }
  return valueTransition;
}
const orchestrationKeys = /* @__PURE__ */ new Set([
  "when",
  "delay",
  "delayChildren",
  "staggerChildren",
  "staggerDirection",
  "repeat",
  "repeatType",
  "repeatDelay",
  "from",
  "elapsed"
]);
function isTransitionDefined(transition) {
  for (const key in transition) {
    if (!orchestrationKeys.has(key))
      return true;
  }
  return false;
}
const animateMotionValue = (name, value, target, transition = {}, element, isHandoff) => (onComplete) => {
  const valueTransition = getValueTransition(transition, name) || {};
  const delay2 = valueTransition.delay || transition.delay || 0;
  let { elapsed = 0 } = transition;
  elapsed = elapsed - /* @__PURE__ */ secondsToMilliseconds(delay2);
  const options = {
    keyframes: Array.isArray(target) ? target : [null, target],
    ease: "easeOut",
    velocity: value.getVelocity(),
    ...valueTransition,
    delay: -elapsed,
    onUpdate: (v) => {
      value.set(v);
      valueTransition.onUpdate && valueTransition.onUpdate(v);
    },
    onComplete: () => {
      onComplete();
      valueTransition.onComplete && valueTransition.onComplete();
    },
    name,
    motionValue: value,
    element: isHandoff ? void 0 : element
  };
  if (!isTransitionDefined(valueTransition)) {
    Object.assign(options, getDefaultTransition(name, options));
  }
  options.duration && (options.duration = /* @__PURE__ */ secondsToMilliseconds(options.duration));
  options.repeatDelay && (options.repeatDelay = /* @__PURE__ */ secondsToMilliseconds(options.repeatDelay));
  if (options.from !== void 0) {
    options.keyframes[0] = options.from;
  }
  let shouldSkip = false;
  if (options.type === false || options.duration === 0 && !options.repeatDelay) {
    makeAnimationInstant(options);
    if (options.delay === 0) {
      shouldSkip = true;
    }
  }
  if (MotionGlobalConfig.instantAnimations || MotionGlobalConfig.skipAnimations || element?.shouldSkipAnimations) {
    shouldSkip = true;
    makeAnimationInstant(options);
    options.delay = 0;
  }
  options.allowFlatten = !valueTransition.type && !valueTransition.ease;
  if (shouldSkip && !isHandoff && value.get() !== void 0) {
    const finalKeyframe = getFinalKeyframe(options.keyframes, valueTransition);
    if (finalKeyframe !== void 0) {
      frame.update(() => {
        options.onUpdate(finalKeyframe);
        options.onComplete();
      });
      return;
    }
  }
  return valueTransition.isSync ? new JSAnimation(options) : new AsyncMotionValueAnimation(options);
};
function getValueState(visualElement) {
  const state = [{}, {}];
  visualElement?.values.forEach((value, key) => {
    state[0][key] = value.get();
    state[1][key] = value.getVelocity();
  });
  return state;
}
function resolveVariantFromProps(props, definition, custom, visualElement) {
  if (typeof definition === "function") {
    const [current, velocity] = getValueState(visualElement);
    definition = definition(custom !== void 0 ? custom : props.custom, current, velocity);
  }
  if (typeof definition === "string") {
    definition = props.variants && props.variants[definition];
  }
  if (typeof definition === "function") {
    const [current, velocity] = getValueState(visualElement);
    definition = definition(custom !== void 0 ? custom : props.custom, current, velocity);
  }
  return definition;
}
function resolveVariant(visualElement, definition, custom) {
  const props = visualElement.getProps();
  return resolveVariantFromProps(props, definition, custom !== void 0 ? custom : props.custom, visualElement);
}
const positionalKeys = /* @__PURE__ */ new Set([
  "width",
  "height",
  "top",
  "left",
  "right",
  "bottom",
  ...transformPropOrder
]);
const MAX_VELOCITY_DELTA = 30;
const isFloat = (value) => {
  return !isNaN(parseFloat(value));
};
class MotionValue {
  /**
   * @param init - The initiating value
   * @param config - Optional configuration options
   *
   * -  `transformer`: A function to transform incoming values with.
   */
  constructor(init, options = {}) {
    this.canTrackVelocity = null;
    this.events = {};
    this.updateAndNotify = (v) => {
      const currentTime = time.now();
      if (this.updatedAt !== currentTime) {
        this.setPrevFrameValue();
      }
      this.prev = this.current;
      this.setCurrent(v);
      if (this.current !== this.prev) {
        this.events.change?.notify(this.current);
        if (this.dependents) {
          for (const dependent of this.dependents) {
            dependent.dirty();
          }
        }
      }
    };
    this.hasAnimated = false;
    this.setCurrent(init);
    this.owner = options.owner;
  }
  setCurrent(current) {
    this.current = current;
    this.updatedAt = time.now();
    if (this.canTrackVelocity === null && current !== void 0) {
      this.canTrackVelocity = isFloat(this.current);
    }
  }
  setPrevFrameValue(prevFrameValue = this.current) {
    this.prevFrameValue = prevFrameValue;
    this.prevUpdatedAt = this.updatedAt;
  }
  /**
   * Adds a function that will be notified when the `MotionValue` is updated.
   *
   * It returns a function that, when called, will cancel the subscription.
   *
   * When calling `onChange` inside a React component, it should be wrapped with the
   * `useEffect` hook. As it returns an unsubscribe function, this should be returned
   * from the `useEffect` function to ensure you don't add duplicate subscribers..
   *
   * ```jsx
   * export const MyComponent = () => {
   *   const x = useMotionValue(0)
   *   const y = useMotionValue(0)
   *   const opacity = useMotionValue(1)
   *
   *   useEffect(() => {
   *     function updateOpacity() {
   *       const maxXY = Math.max(x.get(), y.get())
   *       const newOpacity = transform(maxXY, [0, 100], [1, 0])
   *       opacity.set(newOpacity)
   *     }
   *
   *     const unsubscribeX = x.on("change", updateOpacity)
   *     const unsubscribeY = y.on("change", updateOpacity)
   *
   *     return () => {
   *       unsubscribeX()
   *       unsubscribeY()
   *     }
   *   }, [])
   *
   *   return <motion.div style={{ x }} />
   * }
   * ```
   *
   * @param subscriber - A function that receives the latest value.
   * @returns A function that, when called, will cancel this subscription.
   *
   * @deprecated
   */
  onChange(subscription) {
    return this.on("change", subscription);
  }
  on(eventName, callback) {
    if (!this.events[eventName]) {
      this.events[eventName] = new SubscriptionManager();
    }
    const unsubscribe = this.events[eventName].add(callback);
    if (eventName === "change") {
      return () => {
        unsubscribe();
        frame.read(() => {
          if (!this.events.change.getSize()) {
            this.stop();
          }
        });
      };
    }
    return unsubscribe;
  }
  clearListeners() {
    for (const eventManagers in this.events) {
      this.events[eventManagers].clear();
    }
  }
  /**
   * Attaches a passive effect to the `MotionValue`.
   */
  attach(passiveEffect, stopPassiveEffect) {
    this.passiveEffect = passiveEffect;
    this.stopPassiveEffect = stopPassiveEffect;
  }
  /**
   * Sets the state of the `MotionValue`.
   *
   * @remarks
   *
   * ```jsx
   * const x = useMotionValue(0)
   * x.set(10)
   * ```
   *
   * @param latest - Latest value to set.
   * @param render - Whether to notify render subscribers. Defaults to `true`
   *
   * @public
   */
  set(v) {
    if (!this.passiveEffect) {
      this.updateAndNotify(v);
    } else {
      this.passiveEffect(v, this.updateAndNotify);
    }
  }
  setWithVelocity(prev, current, delta) {
    this.set(current);
    this.prev = void 0;
    this.prevFrameValue = prev;
    this.prevUpdatedAt = this.updatedAt - delta;
  }
  /**
   * Set the state of the `MotionValue`, stopping any active animations,
   * effects, and resets velocity to `0`.
   */
  jump(v, endAnimation = true) {
    this.updateAndNotify(v);
    this.prev = v;
    this.prevUpdatedAt = this.prevFrameValue = void 0;
    endAnimation && this.stop();
    if (this.stopPassiveEffect)
      this.stopPassiveEffect();
  }
  dirty() {
    this.events.change?.notify(this.current);
  }
  addDependent(dependent) {
    if (!this.dependents) {
      this.dependents = /* @__PURE__ */ new Set();
    }
    this.dependents.add(dependent);
  }
  removeDependent(dependent) {
    if (this.dependents) {
      this.dependents.delete(dependent);
    }
  }
  /**
   * Returns the latest state of `MotionValue`
   *
   * @returns - The latest state of `MotionValue`
   *
   * @public
   */
  get() {
    return this.current;
  }
  /**
   * @public
   */
  getPrevious() {
    return this.prev;
  }
  /**
   * Returns the latest velocity of `MotionValue`
   *
   * @returns - The latest velocity of `MotionValue`. Returns `0` if the state is non-numerical.
   *
   * @public
   */
  getVelocity() {
    const currentTime = time.now();
    if (!this.canTrackVelocity || this.prevFrameValue === void 0 || currentTime - this.updatedAt > MAX_VELOCITY_DELTA) {
      return 0;
    }
    const delta = Math.min(this.updatedAt - this.prevUpdatedAt, MAX_VELOCITY_DELTA);
    return velocityPerSecond(parseFloat(this.current) - parseFloat(this.prevFrameValue), delta);
  }
  /**
   * Registers a new animation to control this `MotionValue`. Only one
   * animation can drive a `MotionValue` at one time.
   *
   * ```jsx
   * value.start()
   * ```
   *
   * @param animation - A function that starts the provided animation
   */
  start(startAnimation) {
    this.stop();
    return new Promise((resolve) => {
      this.hasAnimated = true;
      this.animation = startAnimation(resolve);
      if (this.events.animationStart) {
        this.events.animationStart.notify();
      }
    }).then(() => {
      if (this.events.animationComplete) {
        this.events.animationComplete.notify();
      }
      this.clearAnimation();
    });
  }
  /**
   * Stop the currently active animation.
   *
   * @public
   */
  stop() {
    if (this.animation) {
      this.animation.stop();
      if (this.events.animationCancel) {
        this.events.animationCancel.notify();
      }
    }
    this.clearAnimation();
  }
  /**
   * Returns `true` if this value is currently animating.
   *
   * @public
   */
  isAnimating() {
    return !!this.animation;
  }
  clearAnimation() {
    delete this.animation;
  }
  /**
   * Destroy and clean up subscribers to this `MotionValue`.
   *
   * The `MotionValue` hooks like `useMotionValue` and `useTransform` automatically
   * handle the lifecycle of the returned `MotionValue`, so this method is only necessary if you've manually
   * created a `MotionValue` via the `motionValue` function.
   *
   * @public
   */
  destroy() {
    this.dependents?.clear();
    this.events.destroy?.notify();
    this.clearListeners();
    this.stop();
    if (this.stopPassiveEffect) {
      this.stopPassiveEffect();
    }
  }
}
function motionValue(init, options) {
  return new MotionValue(init, options);
}
const isKeyframesTarget = (v) => {
  return Array.isArray(v);
};
function setMotionValue(visualElement, key, value) {
  if (visualElement.hasValue(key)) {
    visualElement.getValue(key).set(value);
  } else {
    visualElement.addValue(key, motionValue(value));
  }
}
function resolveFinalValueInKeyframes(v) {
  return isKeyframesTarget(v) ? v[v.length - 1] || 0 : v;
}
function setTarget(visualElement, definition) {
  const resolved = resolveVariant(visualElement, definition);
  let { transitionEnd = {}, transition = {}, ...target } = resolved || {};
  target = { ...target, ...transitionEnd };
  for (const key in target) {
    const value = resolveFinalValueInKeyframes(target[key]);
    setMotionValue(visualElement, key, value);
  }
}
const isMotionValue = (value) => Boolean(value && value.getVelocity);
function isWillChangeMotionValue(value) {
  return Boolean(isMotionValue(value) && value.add);
}
function addValueToWillChange(visualElement, key) {
  const willChange = visualElement.getValue("willChange");
  if (isWillChangeMotionValue(willChange)) {
    return willChange.add(key);
  } else if (!willChange && MotionGlobalConfig.WillChange) {
    const newWillChange = new MotionGlobalConfig.WillChange("auto");
    visualElement.addValue("willChange", newWillChange);
    newWillChange.add(key);
  }
}
function camelToDash(str) {
  return str.replace(/([A-Z])/g, (match) => `-${match.toLowerCase()}`);
}
const optimizedAppearDataId = "framerAppearId";
const optimizedAppearDataAttribute = "data-" + camelToDash(optimizedAppearDataId);
function getOptimisedAppearId(visualElement) {
  return visualElement.props[optimizedAppearDataAttribute];
}
function shouldBlockAnimation({ protectedKeys, needsAnimating }, key) {
  const shouldBlock = protectedKeys.hasOwnProperty(key) && needsAnimating[key] !== true;
  needsAnimating[key] = false;
  return shouldBlock;
}
function animateTarget(visualElement, targetAndTransition, { delay: delay2 = 0, transitionOverride, type } = {}) {
  let { transition, transitionEnd, ...target } = targetAndTransition;
  const defaultTransition = visualElement.getDefaultTransition();
  transition = transition ? resolveTransition(transition, defaultTransition) : defaultTransition;
  const reduceMotion = transition?.reduceMotion;
  if (transitionOverride)
    transition = transitionOverride;
  const animations2 = [];
  const animationTypeState = type && visualElement.animationState && visualElement.animationState.getState()[type];
  for (const key in target) {
    const value = visualElement.getValue(key, visualElement.latestValues[key] ?? null);
    const valueTarget = target[key];
    if (valueTarget === void 0 || animationTypeState && shouldBlockAnimation(animationTypeState, key)) {
      continue;
    }
    const valueTransition = {
      delay: delay2,
      ...getValueTransition(transition || {}, key)
    };
    const currentValue = value.get();
    if (currentValue !== void 0 && !value.isAnimating() && !Array.isArray(valueTarget) && valueTarget === currentValue && !valueTransition.velocity) {
      frame.update(() => value.set(valueTarget));
      continue;
    }
    let isHandoff = false;
    if (window.MotionHandoffAnimation) {
      const appearId = getOptimisedAppearId(visualElement);
      if (appearId) {
        const startTime = window.MotionHandoffAnimation(appearId, key, frame);
        if (startTime !== null) {
          valueTransition.startTime = startTime;
          isHandoff = true;
        }
      }
    }
    addValueToWillChange(visualElement, key);
    const shouldReduceMotion = reduceMotion ?? visualElement.shouldReduceMotion;
    value.start(animateMotionValue(key, value, valueTarget, shouldReduceMotion && positionalKeys.has(key) ? { type: false } : valueTransition, visualElement, isHandoff));
    const animation = value.animation;
    if (animation) {
      animations2.push(animation);
    }
  }
  if (transitionEnd) {
    const applyTransitionEnd = () => frame.update(() => {
      transitionEnd && setTarget(visualElement, transitionEnd);
    });
    if (animations2.length) {
      Promise.all(animations2).then(applyTransitionEnd);
    } else {
      applyTransitionEnd();
    }
  }
  return animations2;
}
function animateVariant(visualElement, variant, options = {}) {
  const resolved = resolveVariant(visualElement, variant, options.type === "exit" ? visualElement.presenceContext?.custom : void 0);
  let { transition = visualElement.getDefaultTransition() || {} } = resolved || {};
  if (options.transitionOverride) {
    transition = options.transitionOverride;
  }
  const getAnimation = resolved ? () => Promise.all(animateTarget(visualElement, resolved, options)) : () => Promise.resolve();
  const getChildAnimations = visualElement.variantChildren && visualElement.variantChildren.size ? (forwardDelay = 0) => {
    const { delayChildren = 0, staggerChildren, staggerDirection } = transition;
    return animateChildren(visualElement, variant, forwardDelay, delayChildren, staggerChildren, staggerDirection, options);
  } : () => Promise.resolve();
  const { when } = transition;
  if (when) {
    const [first, last2] = when === "beforeChildren" ? [getAnimation, getChildAnimations] : [getChildAnimations, getAnimation];
    return first().then(() => last2());
  } else {
    return Promise.all([getAnimation(), getChildAnimations(options.delay)]);
  }
}
function animateChildren(visualElement, variant, delay2 = 0, delayChildren = 0, staggerChildren = 0, staggerDirection = 1, options) {
  const animations2 = [];
  for (const child of visualElement.variantChildren) {
    child.notify("AnimationStart", variant);
    animations2.push(animateVariant(child, variant, {
      ...options,
      delay: delay2 + (typeof delayChildren === "function" ? 0 : delayChildren) + calcChildStagger(visualElement.variantChildren, child, delayChildren, staggerChildren, staggerDirection)
    }).then(() => child.notify("AnimationComplete", variant)));
  }
  return Promise.all(animations2);
}
function animateVisualElement(visualElement, definition, options = {}) {
  visualElement.notify("AnimationStart", definition);
  let animation;
  if (Array.isArray(definition)) {
    const animations2 = definition.map((variant) => animateVariant(visualElement, variant, options));
    animation = Promise.all(animations2);
  } else if (typeof definition === "string") {
    animation = animateVariant(visualElement, definition, options);
  } else {
    const resolvedDefinition = typeof definition === "function" ? resolveVariant(visualElement, definition, options.custom) : definition;
    animation = Promise.all(animateTarget(visualElement, resolvedDefinition, options));
  }
  return animation.then(() => {
    visualElement.notify("AnimationComplete", definition);
  });
}
const auto = {
  test: (v) => v === "auto",
  parse: (v) => v
};
const testValueType = (v) => (type) => type.test(v);
const dimensionValueTypes = [number, px, percent, degrees, vw, vh, auto];
const findDimensionValueType = (v) => dimensionValueTypes.find(testValueType(v));
function isNone(value) {
  if (typeof value === "number") {
    return value === 0;
  } else if (value !== null) {
    return value === "none" || value === "0" || isZeroValueString(value);
  } else {
    return true;
  }
}
const maxDefaults = /* @__PURE__ */ new Set(["brightness", "contrast", "saturate", "opacity"]);
function applyDefaultFilter(v) {
  const [name, value] = v.slice(0, -1).split("(");
  if (name === "drop-shadow")
    return v;
  const [number2] = value.match(floatRegex) || [];
  if (!number2)
    return v;
  const unit = value.replace(number2, "");
  let defaultValue = maxDefaults.has(name) ? 1 : 0;
  if (number2 !== value)
    defaultValue *= 100;
  return name + "(" + defaultValue + unit + ")";
}
const functionRegex = /\b([a-z-]*)\(.*?\)/gu;
const filter = {
  ...complex,
  getAnimatableNone: (v) => {
    const functions = v.match(functionRegex);
    return functions ? functions.map(applyDefaultFilter).join(" ") : v;
  }
};
const mask = {
  ...complex,
  getAnimatableNone: (v) => {
    const parsed = complex.parse(v);
    const transformer = complex.createTransformer(v);
    return transformer(parsed.map((v2) => typeof v2 === "number" ? 0 : typeof v2 === "object" ? { ...v2, alpha: 1 } : v2));
  }
};
const int = {
  ...number,
  transform: Math.round
};
const transformValueTypes = {
  rotate: degrees,
  rotateX: degrees,
  rotateY: degrees,
  rotateZ: degrees,
  scale,
  scaleX: scale,
  scaleY: scale,
  scaleZ: scale,
  skew: degrees,
  skewX: degrees,
  skewY: degrees,
  distance: px,
  translateX: px,
  translateY: px,
  translateZ: px,
  x: px,
  y: px,
  z: px,
  perspective: px,
  transformPerspective: px,
  opacity: alpha,
  originX: progressPercentage,
  originY: progressPercentage,
  originZ: px
};
const numberValueTypes = {
  // Border props
  borderWidth: px,
  borderTopWidth: px,
  borderRightWidth: px,
  borderBottomWidth: px,
  borderLeftWidth: px,
  borderRadius: px,
  borderTopLeftRadius: px,
  borderTopRightRadius: px,
  borderBottomRightRadius: px,
  borderBottomLeftRadius: px,
  // Positioning props
  width: px,
  maxWidth: px,
  height: px,
  maxHeight: px,
  top: px,
  right: px,
  bottom: px,
  left: px,
  inset: px,
  insetBlock: px,
  insetBlockStart: px,
  insetBlockEnd: px,
  insetInline: px,
  insetInlineStart: px,
  insetInlineEnd: px,
  // Spacing props
  padding: px,
  paddingTop: px,
  paddingRight: px,
  paddingBottom: px,
  paddingLeft: px,
  paddingBlock: px,
  paddingBlockStart: px,
  paddingBlockEnd: px,
  paddingInline: px,
  paddingInlineStart: px,
  paddingInlineEnd: px,
  margin: px,
  marginTop: px,
  marginRight: px,
  marginBottom: px,
  marginLeft: px,
  marginBlock: px,
  marginBlockStart: px,
  marginBlockEnd: px,
  marginInline: px,
  marginInlineStart: px,
  marginInlineEnd: px,
  // Typography
  fontSize: px,
  // Misc
  backgroundPositionX: px,
  backgroundPositionY: px,
  ...transformValueTypes,
  zIndex: int,
  // SVG
  fillOpacity: alpha,
  strokeOpacity: alpha,
  numOctaves: int
};
const defaultValueTypes = {
  ...numberValueTypes,
  // Color props
  color,
  backgroundColor: color,
  outlineColor: color,
  fill: color,
  stroke: color,
  // Border props
  borderColor: color,
  borderTopColor: color,
  borderRightColor: color,
  borderBottomColor: color,
  borderLeftColor: color,
  filter,
  WebkitFilter: filter,
  mask,
  WebkitMask: mask
};
const getDefaultValueType = (key) => defaultValueTypes[key];
const customTypes = /* @__PURE__ */ new Set([filter, mask]);
function getAnimatableNone(key, value) {
  let defaultValueType = getDefaultValueType(key);
  if (!customTypes.has(defaultValueType))
    defaultValueType = complex;
  return defaultValueType.getAnimatableNone ? defaultValueType.getAnimatableNone(value) : void 0;
}
const invalidTemplates = /* @__PURE__ */ new Set(["auto", "none", "0"]);
function makeNoneKeyframesAnimatable(unresolvedKeyframes, noneKeyframeIndexes, name) {
  let i = 0;
  let animatableTemplate = void 0;
  while (i < unresolvedKeyframes.length && !animatableTemplate) {
    const keyframe = unresolvedKeyframes[i];
    if (typeof keyframe === "string" && !invalidTemplates.has(keyframe) && analyseComplexValue(keyframe).values.length) {
      animatableTemplate = unresolvedKeyframes[i];
    }
    i++;
  }
  if (animatableTemplate && name) {
    for (const noneIndex of noneKeyframeIndexes) {
      unresolvedKeyframes[noneIndex] = getAnimatableNone(name, animatableTemplate);
    }
  }
}
class DOMKeyframesResolver extends KeyframeResolver {
  constructor(unresolvedKeyframes, onComplete, name, motionValue2, element) {
    super(unresolvedKeyframes, onComplete, name, motionValue2, element, true);
  }
  readKeyframes() {
    const { unresolvedKeyframes, element, name } = this;
    if (!element || !element.current)
      return;
    super.readKeyframes();
    for (let i = 0; i < unresolvedKeyframes.length; i++) {
      let keyframe = unresolvedKeyframes[i];
      if (typeof keyframe === "string") {
        keyframe = keyframe.trim();
        if (isCSSVariableToken(keyframe)) {
          const resolved = getVariableValue(keyframe, element.current);
          if (resolved !== void 0) {
            unresolvedKeyframes[i] = resolved;
          }
          if (i === unresolvedKeyframes.length - 1) {
            this.finalKeyframe = keyframe;
          }
        }
      }
    }
    this.resolveNoneKeyframes();
    if (!positionalKeys.has(name) || unresolvedKeyframes.length !== 2) {
      return;
    }
    const [origin, target] = unresolvedKeyframes;
    const originType = findDimensionValueType(origin);
    const targetType = findDimensionValueType(target);
    const originHasVar = containsCSSVariable(origin);
    const targetHasVar = containsCSSVariable(target);
    if (originHasVar !== targetHasVar && positionalValues[name]) {
      this.needsMeasurement = true;
      return;
    }
    if (originType === targetType)
      return;
    if (isNumOrPxType(originType) && isNumOrPxType(targetType)) {
      for (let i = 0; i < unresolvedKeyframes.length; i++) {
        const value = unresolvedKeyframes[i];
        if (typeof value === "string") {
          unresolvedKeyframes[i] = parseFloat(value);
        }
      }
    } else if (positionalValues[name]) {
      this.needsMeasurement = true;
    }
  }
  resolveNoneKeyframes() {
    const { unresolvedKeyframes, name } = this;
    const noneKeyframeIndexes = [];
    for (let i = 0; i < unresolvedKeyframes.length; i++) {
      if (unresolvedKeyframes[i] === null || isNone(unresolvedKeyframes[i])) {
        noneKeyframeIndexes.push(i);
      }
    }
    if (noneKeyframeIndexes.length) {
      makeNoneKeyframesAnimatable(unresolvedKeyframes, noneKeyframeIndexes, name);
    }
  }
  measureInitialState() {
    const { element, unresolvedKeyframes, name } = this;
    if (!element || !element.current)
      return;
    if (name === "height") {
      this.suspendedScrollY = window.pageYOffset;
    }
    this.measuredOrigin = positionalValues[name](element.measureViewportBox(), window.getComputedStyle(element.current));
    unresolvedKeyframes[0] = this.measuredOrigin;
    const measureKeyframe = unresolvedKeyframes[unresolvedKeyframes.length - 1];
    if (measureKeyframe !== void 0) {
      element.getValue(name, measureKeyframe).jump(measureKeyframe, false);
    }
  }
  measureEndState() {
    const { element, name, unresolvedKeyframes } = this;
    if (!element || !element.current)
      return;
    const value = element.getValue(name);
    value && value.jump(this.measuredOrigin, false);
    const finalKeyframeIndex = unresolvedKeyframes.length - 1;
    const finalKeyframe = unresolvedKeyframes[finalKeyframeIndex];
    unresolvedKeyframes[finalKeyframeIndex] = positionalValues[name](element.measureViewportBox(), window.getComputedStyle(element.current));
    if (finalKeyframe !== null && this.finalKeyframe === void 0) {
      this.finalKeyframe = finalKeyframe;
    }
    if (this.removedTransforms?.length) {
      this.removedTransforms.forEach(([unsetTransformName, unsetTransformValue]) => {
        element.getValue(unsetTransformName).set(unsetTransformValue);
      });
    }
    this.resolveNoneKeyframes();
  }
}
function resolveElements(elementOrSelector, scope, selectorCache) {
  if (elementOrSelector == null) {
    return [];
  }
  if (elementOrSelector instanceof EventTarget) {
    return [elementOrSelector];
  } else if (typeof elementOrSelector === "string") {
    let root = document;
    const elements = selectorCache?.[elementOrSelector] ?? root.querySelectorAll(elementOrSelector);
    return elements ? Array.from(elements) : [];
  }
  return Array.from(elementOrSelector).filter((element) => element != null);
}
const getValueAsType = (value, type) => {
  return type && typeof value === "number" ? type.transform(value) : value;
};
function isHTMLElement(element) {
  return isObject(element) && "offsetHeight" in element && !("ownerSVGElement" in element);
}
const { schedule: microtask } = /* @__PURE__ */ createRenderBatcher(queueMicrotask, false);
const isDragging = {
  x: false,
  y: false
};
function isDragActive() {
  return isDragging.x || isDragging.y;
}
function setDragLock(axis) {
  if (axis === "x" || axis === "y") {
    if (isDragging[axis]) {
      return null;
    } else {
      isDragging[axis] = true;
      return () => {
        isDragging[axis] = false;
      };
    }
  } else {
    if (isDragging.x || isDragging.y) {
      return null;
    } else {
      isDragging.x = isDragging.y = true;
      return () => {
        isDragging.x = isDragging.y = false;
      };
    }
  }
}
function setupGesture(elementOrSelector, options) {
  const elements = resolveElements(elementOrSelector);
  const gestureAbortController = new AbortController();
  const eventOptions = {
    passive: true,
    ...options,
    signal: gestureAbortController.signal
  };
  const cancel = () => gestureAbortController.abort();
  return [elements, eventOptions, cancel];
}
function isValidHover(event) {
  return !(event.pointerType === "touch" || isDragActive());
}
function hover(elementOrSelector, onHoverStart, options = {}) {
  const [elements, eventOptions, cancel] = setupGesture(elementOrSelector, options);
  elements.forEach((element) => {
    let isPressed = false;
    let deferredHoverEnd = false;
    let hoverEndCallback;
    const removePointerLeave = () => {
      element.removeEventListener("pointerleave", onPointerLeave);
    };
    const endHover = (event) => {
      if (hoverEndCallback) {
        hoverEndCallback(event);
        hoverEndCallback = void 0;
      }
      removePointerLeave();
    };
    const onPointerUp = (event) => {
      isPressed = false;
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
      if (deferredHoverEnd) {
        deferredHoverEnd = false;
        endHover(event);
      }
    };
    const onPointerDown = () => {
      isPressed = true;
      window.addEventListener("pointerup", onPointerUp, eventOptions);
      window.addEventListener("pointercancel", onPointerUp, eventOptions);
    };
    const onPointerLeave = (leaveEvent) => {
      if (leaveEvent.pointerType === "touch")
        return;
      if (isPressed) {
        deferredHoverEnd = true;
        return;
      }
      endHover(leaveEvent);
    };
    const onPointerEnter = (enterEvent) => {
      if (!isValidHover(enterEvent))
        return;
      deferredHoverEnd = false;
      const onHoverEnd = onHoverStart(element, enterEvent);
      if (typeof onHoverEnd !== "function")
        return;
      hoverEndCallback = onHoverEnd;
      element.addEventListener("pointerleave", onPointerLeave, eventOptions);
    };
    element.addEventListener("pointerenter", onPointerEnter, eventOptions);
    element.addEventListener("pointerdown", onPointerDown, eventOptions);
  });
  return cancel;
}
const isNodeOrChild = (parent, child) => {
  if (!child) {
    return false;
  } else if (parent === child) {
    return true;
  } else {
    return isNodeOrChild(parent, child.parentElement);
  }
};
const isPrimaryPointer = (event) => {
  if (event.pointerType === "mouse") {
    return typeof event.button !== "number" || event.button <= 0;
  } else {
    return event.isPrimary !== false;
  }
};
const keyboardAccessibleElements = /* @__PURE__ */ new Set([
  "BUTTON",
  "INPUT",
  "SELECT",
  "TEXTAREA",
  "A"
]);
function isElementKeyboardAccessible(element) {
  return keyboardAccessibleElements.has(element.tagName) || element.isContentEditable === true;
}
const textInputElements = /* @__PURE__ */ new Set(["INPUT", "SELECT", "TEXTAREA"]);
function isElementTextInput(element) {
  return textInputElements.has(element.tagName) || element.isContentEditable === true;
}
const isPressing = /* @__PURE__ */ new WeakSet();
function filterEvents(callback) {
  return (event) => {
    if (event.key !== "Enter")
      return;
    callback(event);
  };
}
function firePointerEvent(target, type) {
  target.dispatchEvent(new PointerEvent("pointer" + type, { isPrimary: true, bubbles: true }));
}
const enableKeyboardPress = (focusEvent, eventOptions) => {
  const element = focusEvent.currentTarget;
  if (!element)
    return;
  const handleKeydown = filterEvents(() => {
    if (isPressing.has(element))
      return;
    firePointerEvent(element, "down");
    const handleKeyup = filterEvents(() => {
      firePointerEvent(element, "up");
    });
    const handleBlur = () => firePointerEvent(element, "cancel");
    element.addEventListener("keyup", handleKeyup, eventOptions);
    element.addEventListener("blur", handleBlur, eventOptions);
  });
  element.addEventListener("keydown", handleKeydown, eventOptions);
  element.addEventListener("blur", () => element.removeEventListener("keydown", handleKeydown), eventOptions);
};
function isValidPressEvent(event) {
  return isPrimaryPointer(event) && !isDragActive();
}
const claimedPointerDownEvents = /* @__PURE__ */ new WeakSet();
function press(targetOrSelector, onPressStart, options = {}) {
  const [targets, eventOptions, cancelEvents] = setupGesture(targetOrSelector, options);
  const startPress = (startEvent) => {
    const target = startEvent.currentTarget;
    if (!isValidPressEvent(startEvent))
      return;
    if (claimedPointerDownEvents.has(startEvent))
      return;
    isPressing.add(target);
    if (options.stopPropagation) {
      claimedPointerDownEvents.add(startEvent);
    }
    const onPressEnd = onPressStart(target, startEvent);
    const onPointerEnd = (endEvent, success) => {
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerCancel);
      if (isPressing.has(target)) {
        isPressing.delete(target);
      }
      if (!isValidPressEvent(endEvent)) {
        return;
      }
      if (typeof onPressEnd === "function") {
        onPressEnd(endEvent, { success });
      }
    };
    const onPointerUp = (upEvent) => {
      onPointerEnd(upEvent, target === window || target === document || options.useGlobalTarget || isNodeOrChild(target, upEvent.target));
    };
    const onPointerCancel = (cancelEvent) => {
      onPointerEnd(cancelEvent, false);
    };
    window.addEventListener("pointerup", onPointerUp, eventOptions);
    window.addEventListener("pointercancel", onPointerCancel, eventOptions);
  };
  targets.forEach((target) => {
    const pointerDownTarget = options.useGlobalTarget ? window : target;
    pointerDownTarget.addEventListener("pointerdown", startPress, eventOptions);
    if (isHTMLElement(target)) {
      target.addEventListener("focus", (event) => enableKeyboardPress(event, eventOptions));
      if (!isElementKeyboardAccessible(target) && !target.hasAttribute("tabindex")) {
        target.tabIndex = 0;
      }
    }
  });
  return cancelEvents;
}
function isSVGElement(element) {
  return isObject(element) && "ownerSVGElement" in element;
}
const resizeHandlers = /* @__PURE__ */ new WeakMap();
let observer;
const getSize = (borderBoxAxis, svgAxis, htmlAxis) => (target, borderBoxSize) => {
  if (borderBoxSize && borderBoxSize[0]) {
    return borderBoxSize[0][borderBoxAxis + "Size"];
  } else if (isSVGElement(target) && "getBBox" in target) {
    return target.getBBox()[svgAxis];
  } else {
    return target[htmlAxis];
  }
};
const getWidth = /* @__PURE__ */ getSize("inline", "width", "offsetWidth");
const getHeight = /* @__PURE__ */ getSize("block", "height", "offsetHeight");
function notifyTarget({ target, borderBoxSize }) {
  resizeHandlers.get(target)?.forEach((handler) => {
    handler(target, {
      get width() {
        return getWidth(target, borderBoxSize);
      },
      get height() {
        return getHeight(target, borderBoxSize);
      }
    });
  });
}
function notifyAll(entries) {
  entries.forEach(notifyTarget);
}
function createResizeObserver() {
  if (typeof ResizeObserver === "undefined")
    return;
  observer = new ResizeObserver(notifyAll);
}
function resizeElement(target, handler) {
  if (!observer)
    createResizeObserver();
  const elements = resolveElements(target);
  elements.forEach((element) => {
    let elementHandlers = resizeHandlers.get(element);
    if (!elementHandlers) {
      elementHandlers = /* @__PURE__ */ new Set();
      resizeHandlers.set(element, elementHandlers);
    }
    elementHandlers.add(handler);
    observer?.observe(element);
  });
  return () => {
    elements.forEach((element) => {
      const elementHandlers = resizeHandlers.get(element);
      elementHandlers?.delete(handler);
      if (!elementHandlers?.size) {
        observer?.unobserve(element);
      }
    });
  };
}
const windowCallbacks = /* @__PURE__ */ new Set();
let windowResizeHandler;
function createWindowResizeHandler() {
  windowResizeHandler = () => {
    const info = {
      get width() {
        return window.innerWidth;
      },
      get height() {
        return window.innerHeight;
      }
    };
    windowCallbacks.forEach((callback) => callback(info));
  };
  window.addEventListener("resize", windowResizeHandler);
}
function resizeWindow(callback) {
  windowCallbacks.add(callback);
  if (!windowResizeHandler)
    createWindowResizeHandler();
  return () => {
    windowCallbacks.delete(callback);
    if (!windowCallbacks.size && typeof windowResizeHandler === "function") {
      window.removeEventListener("resize", windowResizeHandler);
      windowResizeHandler = void 0;
    }
  };
}
function resize(a, b) {
  return typeof a === "function" ? resizeWindow(a) : resizeElement(a, b);
}
function isSVGSVGElement(element) {
  return isSVGElement(element) && element.tagName === "svg";
}
const valueTypes = [...dimensionValueTypes, color, complex];
const findValueType = (v) => valueTypes.find(testValueType(v));
const createAxisDelta = () => ({
  translate: 0,
  scale: 1,
  origin: 0,
  originPoint: 0
});
const createDelta = () => ({
  x: createAxisDelta(),
  y: createAxisDelta()
});
const createAxis = () => ({ min: 0, max: 0 });
const createBox = () => ({
  x: createAxis(),
  y: createAxis()
});
const visualElementStore = /* @__PURE__ */ new WeakMap();
function isAnimationControls(v) {
  return v !== null && typeof v === "object" && typeof v.start === "function";
}
function isVariantLabel(v) {
  return typeof v === "string" || Array.isArray(v);
}
const variantPriorityOrder = [
  "animate",
  "whileInView",
  "whileFocus",
  "whileHover",
  "whileTap",
  "whileDrag",
  "exit"
];
const variantProps = ["initial", ...variantPriorityOrder];
function isControllingVariants(props) {
  return isAnimationControls(props.animate) || variantProps.some((name) => isVariantLabel(props[name]));
}
function isVariantNode(props) {
  return Boolean(isControllingVariants(props) || props.variants);
}
function updateMotionValuesFromProps(element, next, prev) {
  for (const key in next) {
    const nextValue = next[key];
    const prevValue = prev[key];
    if (isMotionValue(nextValue)) {
      element.addValue(key, nextValue);
    } else if (isMotionValue(prevValue)) {
      element.addValue(key, motionValue(nextValue, { owner: element }));
    } else if (prevValue !== nextValue) {
      if (element.hasValue(key)) {
        const existingValue = element.getValue(key);
        if (existingValue.liveStyle === true) {
          existingValue.jump(nextValue);
        } else if (!existingValue.hasAnimated) {
          existingValue.set(nextValue);
        }
      } else {
        const latestValue = element.getStaticValue(key);
        element.addValue(key, motionValue(latestValue !== void 0 ? latestValue : nextValue, { owner: element }));
      }
    }
  }
  for (const key in prev) {
    if (next[key] === void 0)
      element.removeValue(key);
  }
  return next;
}
const prefersReducedMotion = { current: null };
const hasReducedMotionListener = { current: false };
const isBrowser = typeof window !== "undefined";
function initPrefersReducedMotion() {
  hasReducedMotionListener.current = true;
  if (!isBrowser)
    return;
  if (window.matchMedia) {
    const motionMediaQuery = window.matchMedia("(prefers-reduced-motion)");
    const setReducedMotionPreferences = () => prefersReducedMotion.current = motionMediaQuery.matches;
    motionMediaQuery.addEventListener("change", setReducedMotionPreferences);
    setReducedMotionPreferences();
  } else {
    prefersReducedMotion.current = false;
  }
}
const propEventHandlers = [
  "AnimationStart",
  "AnimationComplete",
  "Update",
  "BeforeLayoutMeasure",
  "LayoutMeasure",
  "LayoutAnimationStart",
  "LayoutAnimationComplete"
];
let featureDefinitions = {};
function setFeatureDefinitions(definitions) {
  featureDefinitions = definitions;
}
function getFeatureDefinitions() {
  return featureDefinitions;
}
class VisualElement {
  /**
   * This method takes React props and returns found MotionValues. For example, HTML
   * MotionValues will be found within the style prop, whereas for Three.js within attribute arrays.
   *
   * This isn't an abstract method as it needs calling in the constructor, but it is
   * intended to be one.
   */
  scrapeMotionValuesFromProps(_props, _prevProps, _visualElement) {
    return {};
  }
  constructor({ parent, props, presenceContext, reducedMotionConfig, skipAnimations, blockInitialAnimation, visualState }, options = {}) {
    this.current = null;
    this.children = /* @__PURE__ */ new Set();
    this.isVariantNode = false;
    this.isControllingVariants = false;
    this.shouldReduceMotion = null;
    this.shouldSkipAnimations = false;
    this.values = /* @__PURE__ */ new Map();
    this.KeyframeResolver = KeyframeResolver;
    this.features = {};
    this.valueSubscriptions = /* @__PURE__ */ new Map();
    this.prevMotionValues = {};
    this.hasBeenMounted = false;
    this.events = {};
    this.propEventSubscriptions = {};
    this.notifyUpdate = () => this.notify("Update", this.latestValues);
    this.render = () => {
      if (!this.current)
        return;
      this.triggerBuild();
      this.renderInstance(this.current, this.renderState, this.props.style, this.projection);
    };
    this.renderScheduledAt = 0;
    this.scheduleRender = () => {
      const now2 = time.now();
      if (this.renderScheduledAt < now2) {
        this.renderScheduledAt = now2;
        frame.render(this.render, false, true);
      }
    };
    const { latestValues, renderState } = visualState;
    this.latestValues = latestValues;
    this.baseTarget = { ...latestValues };
    this.initialValues = props.initial ? { ...latestValues } : {};
    this.renderState = renderState;
    this.parent = parent;
    this.props = props;
    this.presenceContext = presenceContext;
    this.depth = parent ? parent.depth + 1 : 0;
    this.reducedMotionConfig = reducedMotionConfig;
    this.skipAnimationsConfig = skipAnimations;
    this.options = options;
    this.blockInitialAnimation = Boolean(blockInitialAnimation);
    this.isControllingVariants = isControllingVariants(props);
    this.isVariantNode = isVariantNode(props);
    if (this.isVariantNode) {
      this.variantChildren = /* @__PURE__ */ new Set();
    }
    this.manuallyAnimateOnMount = Boolean(parent && parent.current);
    const { willChange, ...initialMotionValues } = this.scrapeMotionValuesFromProps(props, {}, this);
    for (const key in initialMotionValues) {
      const value = initialMotionValues[key];
      if (latestValues[key] !== void 0 && isMotionValue(value)) {
        value.set(latestValues[key]);
      }
    }
  }
  mount(instance) {
    if (this.hasBeenMounted) {
      for (const key in this.initialValues) {
        this.values.get(key)?.jump(this.initialValues[key]);
        this.latestValues[key] = this.initialValues[key];
      }
    }
    this.current = instance;
    visualElementStore.set(instance, this);
    if (this.projection && !this.projection.instance) {
      this.projection.mount(instance);
    }
    if (this.parent && this.isVariantNode && !this.isControllingVariants) {
      this.removeFromVariantTree = this.parent.addVariantChild(this);
    }
    this.values.forEach((value, key) => this.bindToMotionValue(key, value));
    if (this.reducedMotionConfig === "never") {
      this.shouldReduceMotion = false;
    } else if (this.reducedMotionConfig === "always") {
      this.shouldReduceMotion = true;
    } else {
      if (!hasReducedMotionListener.current) {
        initPrefersReducedMotion();
      }
      this.shouldReduceMotion = prefersReducedMotion.current;
    }
    this.shouldSkipAnimations = this.skipAnimationsConfig ?? false;
    this.parent?.addChild(this);
    this.update(this.props, this.presenceContext);
    this.hasBeenMounted = true;
  }
  unmount() {
    this.projection && this.projection.unmount();
    cancelFrame(this.notifyUpdate);
    cancelFrame(this.render);
    this.valueSubscriptions.forEach((remove) => remove());
    this.valueSubscriptions.clear();
    this.removeFromVariantTree && this.removeFromVariantTree();
    this.parent?.removeChild(this);
    for (const key in this.events) {
      this.events[key].clear();
    }
    for (const key in this.features) {
      const feature = this.features[key];
      if (feature) {
        feature.unmount();
        feature.isMounted = false;
      }
    }
    this.current = null;
  }
  addChild(child) {
    this.children.add(child);
    this.enteringChildren ?? (this.enteringChildren = /* @__PURE__ */ new Set());
    this.enteringChildren.add(child);
  }
  removeChild(child) {
    this.children.delete(child);
    this.enteringChildren && this.enteringChildren.delete(child);
  }
  bindToMotionValue(key, value) {
    if (this.valueSubscriptions.has(key)) {
      this.valueSubscriptions.get(key)();
    }
    if (value.accelerate && acceleratedValues.has(key) && this.current instanceof HTMLElement) {
      const { factory, keyframes: keyframes2, times, ease: ease2, duration } = value.accelerate;
      const animation = new NativeAnimation({
        element: this.current,
        name: key,
        keyframes: keyframes2,
        times,
        ease: ease2,
        duration: /* @__PURE__ */ secondsToMilliseconds(duration)
      });
      const cleanup = factory(animation);
      this.valueSubscriptions.set(key, () => {
        cleanup();
        animation.cancel();
      });
      return;
    }
    const valueIsTransform = transformProps.has(key);
    if (valueIsTransform && this.onBindTransform) {
      this.onBindTransform();
    }
    const removeOnChange = value.on("change", (latestValue) => {
      this.latestValues[key] = latestValue;
      this.props.onUpdate && frame.preRender(this.notifyUpdate);
      if (valueIsTransform && this.projection) {
        this.projection.isTransformDirty = true;
      }
      this.scheduleRender();
    });
    let removeSyncCheck;
    if (typeof window !== "undefined" && window.MotionCheckAppearSync) {
      removeSyncCheck = window.MotionCheckAppearSync(this, key, value);
    }
    this.valueSubscriptions.set(key, () => {
      removeOnChange();
      if (removeSyncCheck)
        removeSyncCheck();
      if (value.owner)
        value.stop();
    });
  }
  sortNodePosition(other) {
    if (!this.current || !this.sortInstanceNodePosition || this.type !== other.type) {
      return 0;
    }
    return this.sortInstanceNodePosition(this.current, other.current);
  }
  updateFeatures() {
    let key = "animation";
    for (key in featureDefinitions) {
      const featureDefinition = featureDefinitions[key];
      if (!featureDefinition)
        continue;
      const { isEnabled, Feature: FeatureConstructor } = featureDefinition;
      if (!this.features[key] && FeatureConstructor && isEnabled(this.props)) {
        this.features[key] = new FeatureConstructor(this);
      }
      if (this.features[key]) {
        const feature = this.features[key];
        if (feature.isMounted) {
          feature.update();
        } else {
          feature.mount();
          feature.isMounted = true;
        }
      }
    }
  }
  triggerBuild() {
    this.build(this.renderState, this.latestValues, this.props);
  }
  /**
   * Measure the current viewport box with or without transforms.
   * Only measures axis-aligned boxes, rotate and skew must be manually
   * removed with a re-render to work.
   */
  measureViewportBox() {
    return this.current ? this.measureInstanceViewportBox(this.current, this.props) : createBox();
  }
  getStaticValue(key) {
    return this.latestValues[key];
  }
  setStaticValue(key, value) {
    this.latestValues[key] = value;
  }
  /**
   * Update the provided props. Ensure any newly-added motion values are
   * added to our map, old ones removed, and listeners updated.
   */
  update(props, presenceContext) {
    if (props.transformTemplate || this.props.transformTemplate) {
      this.scheduleRender();
    }
    this.prevProps = this.props;
    this.props = props;
    this.prevPresenceContext = this.presenceContext;
    this.presenceContext = presenceContext;
    for (let i = 0; i < propEventHandlers.length; i++) {
      const key = propEventHandlers[i];
      if (this.propEventSubscriptions[key]) {
        this.propEventSubscriptions[key]();
        delete this.propEventSubscriptions[key];
      }
      const listenerName = "on" + key;
      const listener = props[listenerName];
      if (listener) {
        this.propEventSubscriptions[key] = this.on(key, listener);
      }
    }
    this.prevMotionValues = updateMotionValuesFromProps(this, this.scrapeMotionValuesFromProps(props, this.prevProps || {}, this), this.prevMotionValues);
    if (this.handleChildMotionValue) {
      this.handleChildMotionValue();
    }
  }
  getProps() {
    return this.props;
  }
  /**
   * Returns the variant definition with a given name.
   */
  getVariant(name) {
    return this.props.variants ? this.props.variants[name] : void 0;
  }
  /**
   * Returns the defined default transition on this component.
   */
  getDefaultTransition() {
    return this.props.transition;
  }
  getTransformPagePoint() {
    return this.props.transformPagePoint;
  }
  getClosestVariantNode() {
    return this.isVariantNode ? this : this.parent ? this.parent.getClosestVariantNode() : void 0;
  }
  /**
   * Add a child visual element to our set of children.
   */
  addVariantChild(child) {
    const closestVariantNode = this.getClosestVariantNode();
    if (closestVariantNode) {
      closestVariantNode.variantChildren && closestVariantNode.variantChildren.add(child);
      return () => closestVariantNode.variantChildren.delete(child);
    }
  }
  /**
   * Add a motion value and bind it to this visual element.
   */
  addValue(key, value) {
    const existingValue = this.values.get(key);
    if (value !== existingValue) {
      if (existingValue)
        this.removeValue(key);
      this.bindToMotionValue(key, value);
      this.values.set(key, value);
      this.latestValues[key] = value.get();
    }
  }
  /**
   * Remove a motion value and unbind any active subscriptions.
   */
  removeValue(key) {
    this.values.delete(key);
    const unsubscribe = this.valueSubscriptions.get(key);
    if (unsubscribe) {
      unsubscribe();
      this.valueSubscriptions.delete(key);
    }
    delete this.latestValues[key];
    this.removeValueFromRenderState(key, this.renderState);
  }
  /**
   * Check whether we have a motion value for this key
   */
  hasValue(key) {
    return this.values.has(key);
  }
  getValue(key, defaultValue) {
    if (this.props.values && this.props.values[key]) {
      return this.props.values[key];
    }
    let value = this.values.get(key);
    if (value === void 0 && defaultValue !== void 0) {
      value = motionValue(defaultValue === null ? void 0 : defaultValue, { owner: this });
      this.addValue(key, value);
    }
    return value;
  }
  /**
   * If we're trying to animate to a previously unencountered value,
   * we need to check for it in our state and as a last resort read it
   * directly from the instance (which might have performance implications).
   */
  readValue(key, target) {
    let value = this.latestValues[key] !== void 0 || !this.current ? this.latestValues[key] : this.getBaseTargetFromProps(this.props, key) ?? this.readValueFromInstance(this.current, key, this.options);
    if (value !== void 0 && value !== null) {
      if (typeof value === "string" && (isNumericalString(value) || isZeroValueString(value))) {
        value = parseFloat(value);
      } else if (!findValueType(value) && complex.test(target)) {
        value = getAnimatableNone(key, target);
      }
      this.setBaseTarget(key, isMotionValue(value) ? value.get() : value);
    }
    return isMotionValue(value) ? value.get() : value;
  }
  /**
   * Set the base target to later animate back to. This is currently
   * only hydrated on creation and when we first read a value.
   */
  setBaseTarget(key, value) {
    this.baseTarget[key] = value;
  }
  /**
   * Find the base target for a value thats been removed from all animation
   * props.
   */
  getBaseTarget(key) {
    const { initial } = this.props;
    let valueFromInitial;
    if (typeof initial === "string" || typeof initial === "object") {
      const variant = resolveVariantFromProps(this.props, initial, this.presenceContext?.custom);
      if (variant) {
        valueFromInitial = variant[key];
      }
    }
    if (initial && valueFromInitial !== void 0) {
      return valueFromInitial;
    }
    const target = this.getBaseTargetFromProps(this.props, key);
    if (target !== void 0 && !isMotionValue(target))
      return target;
    return this.initialValues[key] !== void 0 && valueFromInitial === void 0 ? void 0 : this.baseTarget[key];
  }
  on(eventName, callback) {
    if (!this.events[eventName]) {
      this.events[eventName] = new SubscriptionManager();
    }
    return this.events[eventName].add(callback);
  }
  notify(eventName, ...args) {
    if (this.events[eventName]) {
      this.events[eventName].notify(...args);
    }
  }
  scheduleRenderMicrotask() {
    microtask.render(this.render);
  }
}
class DOMVisualElement extends VisualElement {
  constructor() {
    super(...arguments);
    this.KeyframeResolver = DOMKeyframesResolver;
  }
  sortInstanceNodePosition(a, b) {
    return a.compareDocumentPosition(b) & 2 ? 1 : -1;
  }
  getBaseTargetFromProps(props, key) {
    const style = props.style;
    return style ? style[key] : void 0;
  }
  removeValueFromRenderState(key, { vars, style }) {
    delete vars[key];
    delete style[key];
  }
  handleChildMotionValue() {
    if (this.childSubscription) {
      this.childSubscription();
      delete this.childSubscription;
    }
    const { children } = this.props;
    if (isMotionValue(children)) {
      this.childSubscription = children.on("change", (latest) => {
        if (this.current) {
          this.current.textContent = `${latest}`;
        }
      });
    }
  }
}
class Feature {
  constructor(node) {
    this.isMounted = false;
    this.node = node;
  }
  update() {
  }
}
function convertBoundingBoxToBox({ top, left, right, bottom }) {
  return {
    x: { min: left, max: right },
    y: { min: top, max: bottom }
  };
}
function convertBoxToBoundingBox({ x, y }) {
  return { top: y.min, right: x.max, bottom: y.max, left: x.min };
}
function transformBoxPoints(point, transformPoint2) {
  if (!transformPoint2)
    return point;
  const topLeft = transformPoint2({ x: point.left, y: point.top });
  const bottomRight = transformPoint2({ x: point.right, y: point.bottom });
  return {
    top: topLeft.y,
    left: topLeft.x,
    bottom: bottomRight.y,
    right: bottomRight.x
  };
}
function isIdentityScale(scale2) {
  return scale2 === void 0 || scale2 === 1;
}
function hasScale({ scale: scale2, scaleX: scaleX2, scaleY: scaleY2 }) {
  return !isIdentityScale(scale2) || !isIdentityScale(scaleX2) || !isIdentityScale(scaleY2);
}
function hasTransform(values) {
  return hasScale(values) || has2DTranslate(values) || values.z || values.rotate || values.rotateX || values.rotateY || values.skewX || values.skewY;
}
function has2DTranslate(values) {
  return is2DTranslate(values.x) || is2DTranslate(values.y);
}
function is2DTranslate(value) {
  return value && value !== "0%";
}
function scalePoint(point, scale2, originPoint) {
  const distanceFromOrigin = point - originPoint;
  const scaled = scale2 * distanceFromOrigin;
  return originPoint + scaled;
}
function applyPointDelta(point, translate, scale2, originPoint, boxScale) {
  if (boxScale !== void 0) {
    point = scalePoint(point, boxScale, originPoint);
  }
  return scalePoint(point, scale2, originPoint) + translate;
}
function applyAxisDelta(axis, translate = 0, scale2 = 1, originPoint, boxScale) {
  axis.min = applyPointDelta(axis.min, translate, scale2, originPoint, boxScale);
  axis.max = applyPointDelta(axis.max, translate, scale2, originPoint, boxScale);
}
function applyBoxDelta(box, { x, y }) {
  applyAxisDelta(box.x, x.translate, x.scale, x.originPoint);
  applyAxisDelta(box.y, y.translate, y.scale, y.originPoint);
}
const TREE_SCALE_SNAP_MIN = 0.999999999999;
const TREE_SCALE_SNAP_MAX = 1.0000000000001;
function applyTreeDeltas(box, treeScale, treePath, isSharedTransition = false) {
  const treeLength = treePath.length;
  if (!treeLength)
    return;
  treeScale.x = treeScale.y = 1;
  let node;
  let delta;
  for (let i = 0; i < treeLength; i++) {
    node = treePath[i];
    delta = node.projectionDelta;
    const { visualElement } = node.options;
    if (visualElement && visualElement.props.style && visualElement.props.style.display === "contents") {
      continue;
    }
    if (isSharedTransition && node.options.layoutScroll && node.scroll && node !== node.root) {
      translateAxis(box.x, -node.scroll.offset.x);
      translateAxis(box.y, -node.scroll.offset.y);
    }
    if (delta) {
      treeScale.x *= delta.x.scale;
      treeScale.y *= delta.y.scale;
      applyBoxDelta(box, delta);
    }
    if (isSharedTransition && hasTransform(node.latestValues)) {
      transformBox(box, node.latestValues, node.layout?.layoutBox);
    }
  }
  if (treeScale.x < TREE_SCALE_SNAP_MAX && treeScale.x > TREE_SCALE_SNAP_MIN) {
    treeScale.x = 1;
  }
  if (treeScale.y < TREE_SCALE_SNAP_MAX && treeScale.y > TREE_SCALE_SNAP_MIN) {
    treeScale.y = 1;
  }
}
function translateAxis(axis, distance2) {
  axis.min += distance2;
  axis.max += distance2;
}
function transformAxis(axis, axisTranslate, axisScale, boxScale, axisOrigin = 0.5) {
  const originPoint = mixNumber$1(axis.min, axis.max, axisOrigin);
  applyAxisDelta(axis, axisTranslate, axisScale, originPoint, boxScale);
}
function resolveAxisTranslate(value, axis) {
  if (typeof value === "string") {
    return parseFloat(value) / 100 * (axis.max - axis.min);
  }
  return value;
}
function transformBox(box, transform, sourceBox) {
  const resolveBox = sourceBox ?? box;
  transformAxis(box.x, resolveAxisTranslate(transform.x, resolveBox.x), transform.scaleX, transform.scale, transform.originX);
  transformAxis(box.y, resolveAxisTranslate(transform.y, resolveBox.y), transform.scaleY, transform.scale, transform.originY);
}
function measureViewportBox(instance, transformPoint2) {
  return convertBoundingBoxToBox(transformBoxPoints(instance.getBoundingClientRect(), transformPoint2));
}
function measurePageBox(element, rootProjectionNode2, transformPagePoint) {
  const viewportBox = measureViewportBox(element, transformPagePoint);
  const { scroll } = rootProjectionNode2;
  if (scroll) {
    translateAxis(viewportBox.x, scroll.offset.x);
    translateAxis(viewportBox.y, scroll.offset.y);
  }
  return viewportBox;
}
const translateAlias = {
  x: "translateX",
  y: "translateY",
  z: "translateZ",
  transformPerspective: "perspective"
};
const numTransforms = transformPropOrder.length;
function buildTransform(latestValues, transform, transformTemplate) {
  let transformString = "";
  let transformIsDefault = true;
  for (let i = 0; i < numTransforms; i++) {
    const key = transformPropOrder[i];
    const value = latestValues[key];
    if (value === void 0)
      continue;
    let valueIsDefault = true;
    if (typeof value === "number") {
      valueIsDefault = value === (key.startsWith("scale") ? 1 : 0);
    } else {
      const parsed = parseFloat(value);
      valueIsDefault = key.startsWith("scale") ? parsed === 1 : parsed === 0;
    }
    if (!valueIsDefault || transformTemplate) {
      const valueAsType = getValueAsType(value, numberValueTypes[key]);
      if (!valueIsDefault) {
        transformIsDefault = false;
        const transformName = translateAlias[key] || key;
        transformString += `${transformName}(${valueAsType}) `;
      }
      if (transformTemplate) {
        transform[key] = valueAsType;
      }
    }
  }
  transformString = transformString.trim();
  if (transformTemplate) {
    transformString = transformTemplate(transform, transformIsDefault ? "" : transformString);
  } else if (transformIsDefault) {
    transformString = "none";
  }
  return transformString;
}
function buildHTMLStyles(state, latestValues, transformTemplate) {
  const { style, vars, transformOrigin } = state;
  let hasTransform2 = false;
  let hasTransformOrigin = false;
  for (const key in latestValues) {
    const value = latestValues[key];
    if (transformProps.has(key)) {
      hasTransform2 = true;
      continue;
    } else if (isCSSVariableName(key)) {
      vars[key] = value;
      continue;
    } else {
      const valueAsType = getValueAsType(value, numberValueTypes[key]);
      if (key.startsWith("origin")) {
        hasTransformOrigin = true;
        transformOrigin[key] = valueAsType;
      } else {
        style[key] = valueAsType;
      }
    }
  }
  if (!latestValues.transform) {
    if (hasTransform2 || transformTemplate) {
      style.transform = buildTransform(latestValues, state.transform, transformTemplate);
    } else if (style.transform) {
      style.transform = "none";
    }
  }
  if (hasTransformOrigin) {
    const { originX = "50%", originY = "50%", originZ = 0 } = transformOrigin;
    style.transformOrigin = `${originX} ${originY} ${originZ}`;
  }
}
function renderHTML(element, { style, vars }, styleProp, projection) {
  const elementStyle = element.style;
  let key;
  for (key in style) {
    elementStyle[key] = style[key];
  }
  projection?.applyProjectionStyles(elementStyle, styleProp);
  for (key in vars) {
    elementStyle.setProperty(key, vars[key]);
  }
}
function pixelsToPercent(pixels, axis) {
  if (axis.max === axis.min)
    return 0;
  return pixels / (axis.max - axis.min) * 100;
}
const correctBorderRadius = {
  correct: (latest, node) => {
    if (!node.target)
      return latest;
    if (typeof latest === "string") {
      if (px.test(latest)) {
        latest = parseFloat(latest);
      } else {
        return latest;
      }
    }
    const x = pixelsToPercent(latest, node.target.x);
    const y = pixelsToPercent(latest, node.target.y);
    return `${x}% ${y}%`;
  }
};
const correctBoxShadow = {
  correct: (latest, { treeScale, projectionDelta }) => {
    const original = latest;
    const shadow = complex.parse(latest);
    if (shadow.length > 5)
      return original;
    const template = complex.createTransformer(latest);
    const offset = typeof shadow[0] !== "number" ? 1 : 0;
    const xScale = projectionDelta.x.scale * treeScale.x;
    const yScale = projectionDelta.y.scale * treeScale.y;
    shadow[0 + offset] /= xScale;
    shadow[1 + offset] /= yScale;
    const averageScale = mixNumber$1(xScale, yScale, 0.5);
    if (typeof shadow[2 + offset] === "number")
      shadow[2 + offset] /= averageScale;
    if (typeof shadow[3 + offset] === "number")
      shadow[3 + offset] /= averageScale;
    return template(shadow);
  }
};
const scaleCorrectors = {
  borderRadius: {
    ...correctBorderRadius,
    applyTo: [
      "borderTopLeftRadius",
      "borderTopRightRadius",
      "borderBottomLeftRadius",
      "borderBottomRightRadius"
    ]
  },
  borderTopLeftRadius: correctBorderRadius,
  borderTopRightRadius: correctBorderRadius,
  borderBottomLeftRadius: correctBorderRadius,
  borderBottomRightRadius: correctBorderRadius,
  boxShadow: correctBoxShadow
};
function isForcedMotionValue(key, { layout: layout2, layoutId }) {
  return transformProps.has(key) || key.startsWith("origin") || (layout2 || layoutId !== void 0) && (!!scaleCorrectors[key] || key === "opacity");
}
function scrapeMotionValuesFromProps$1(props, prevProps, visualElement) {
  const style = props.style;
  const prevStyle = prevProps?.style;
  const newValues = {};
  if (!style)
    return newValues;
  for (const key in style) {
    if (isMotionValue(style[key]) || prevStyle && isMotionValue(prevStyle[key]) || isForcedMotionValue(key, props) || visualElement?.getValue(key)?.liveStyle !== void 0) {
      newValues[key] = style[key];
    }
  }
  return newValues;
}
function getComputedStyle$1(element) {
  return window.getComputedStyle(element);
}
class HTMLVisualElement extends DOMVisualElement {
  constructor() {
    super(...arguments);
    this.type = "html";
    this.renderInstance = renderHTML;
  }
  readValueFromInstance(instance, key) {
    if (transformProps.has(key)) {
      return this.projection?.isProjecting ? defaultTransformValue(key) : readTransformValue(instance, key);
    } else {
      const computedStyle = getComputedStyle$1(instance);
      const value = (isCSSVariableName(key) ? computedStyle.getPropertyValue(key) : computedStyle[key]) || 0;
      return typeof value === "string" ? value.trim() : value;
    }
  }
  measureInstanceViewportBox(instance, { transformPagePoint }) {
    return measureViewportBox(instance, transformPagePoint);
  }
  build(renderState, latestValues, props) {
    buildHTMLStyles(renderState, latestValues, props.transformTemplate);
  }
  scrapeMotionValuesFromProps(props, prevProps, visualElement) {
    return scrapeMotionValuesFromProps$1(props, prevProps, visualElement);
  }
}
const dashKeys = {
  offset: "stroke-dashoffset",
  array: "stroke-dasharray"
};
const camelKeys = {
  offset: "strokeDashoffset",
  array: "strokeDasharray"
};
function buildSVGPath(attrs, length, spacing = 1, offset = 0, useDashCase = true) {
  attrs.pathLength = 1;
  const keys = useDashCase ? dashKeys : camelKeys;
  attrs[keys.offset] = `${-offset}`;
  attrs[keys.array] = `${length} ${spacing}`;
}
const cssMotionPathProperties = [
  "offsetDistance",
  "offsetPath",
  "offsetRotate",
  "offsetAnchor"
];
function buildSVGAttrs(state, {
  attrX,
  attrY,
  attrScale,
  pathLength,
  pathSpacing = 1,
  pathOffset = 0,
  // This is object creation, which we try to avoid per-frame.
  ...latest
}, isSVGTag2, transformTemplate, styleProp) {
  buildHTMLStyles(state, latest, transformTemplate);
  if (isSVGTag2) {
    if (state.style.viewBox) {
      state.attrs.viewBox = state.style.viewBox;
    }
    return;
  }
  state.attrs = state.style;
  state.style = {};
  const { attrs, style } = state;
  if (attrs.transform) {
    style.transform = attrs.transform;
    delete attrs.transform;
  }
  if (style.transform || attrs.transformOrigin) {
    style.transformOrigin = attrs.transformOrigin ?? "50% 50%";
    delete attrs.transformOrigin;
  }
  if (style.transform) {
    style.transformBox = styleProp?.transformBox ?? "fill-box";
    delete attrs.transformBox;
  }
  for (const key of cssMotionPathProperties) {
    if (attrs[key] !== void 0) {
      style[key] = attrs[key];
      delete attrs[key];
    }
  }
  if (attrX !== void 0)
    attrs.x = attrX;
  if (attrY !== void 0)
    attrs.y = attrY;
  if (attrScale !== void 0)
    attrs.scale = attrScale;
  if (pathLength !== void 0) {
    buildSVGPath(attrs, pathLength, pathSpacing, pathOffset, false);
  }
}
const camelCaseAttributes = /* @__PURE__ */ new Set([
  "baseFrequency",
  "diffuseConstant",
  "kernelMatrix",
  "kernelUnitLength",
  "keySplines",
  "keyTimes",
  "limitingConeAngle",
  "markerHeight",
  "markerWidth",
  "numOctaves",
  "targetX",
  "targetY",
  "surfaceScale",
  "specularConstant",
  "specularExponent",
  "stdDeviation",
  "tableValues",
  "viewBox",
  "gradientTransform",
  "pathLength",
  "startOffset",
  "textLength",
  "lengthAdjust"
]);
const isSVGTag = (tag) => typeof tag === "string" && tag.toLowerCase() === "svg";
function renderSVG(element, renderState, _styleProp, projection) {
  renderHTML(element, renderState, void 0, projection);
  for (const key in renderState.attrs) {
    element.setAttribute(!camelCaseAttributes.has(key) ? camelToDash(key) : key, renderState.attrs[key]);
  }
}
function scrapeMotionValuesFromProps(props, prevProps, visualElement) {
  const newValues = scrapeMotionValuesFromProps$1(props, prevProps, visualElement);
  for (const key in props) {
    if (isMotionValue(props[key]) || isMotionValue(prevProps[key])) {
      const targetKey = transformPropOrder.indexOf(key) !== -1 ? "attr" + key.charAt(0).toUpperCase() + key.substring(1) : key;
      newValues[targetKey] = props[key];
    }
  }
  return newValues;
}
class SVGVisualElement extends DOMVisualElement {
  constructor() {
    super(...arguments);
    this.type = "svg";
    this.isSVGTag = false;
    this.measureInstanceViewportBox = createBox;
  }
  getBaseTargetFromProps(props, key) {
    return props[key];
  }
  readValueFromInstance(instance, key) {
    if (transformProps.has(key)) {
      const defaultType = getDefaultValueType(key);
      return defaultType ? defaultType.default || 0 : 0;
    }
    key = !camelCaseAttributes.has(key) ? camelToDash(key) : key;
    return instance.getAttribute(key);
  }
  scrapeMotionValuesFromProps(props, prevProps, visualElement) {
    return scrapeMotionValuesFromProps(props, prevProps, visualElement);
  }
  build(renderState, latestValues, props) {
    buildSVGAttrs(renderState, latestValues, this.isSVGTag, props.transformTemplate, props.style);
  }
  renderInstance(instance, renderState, styleProp, projection) {
    renderSVG(instance, renderState, styleProp, projection);
  }
  mount(instance) {
    this.isSVGTag = isSVGTag(instance.tagName);
    super.mount(instance);
  }
}
const numVariantProps = variantProps.length;
function getVariantContext(visualElement) {
  if (!visualElement)
    return void 0;
  if (!visualElement.isControllingVariants) {
    const context2 = visualElement.parent ? getVariantContext(visualElement.parent) || {} : {};
    if (visualElement.props.initial !== void 0) {
      context2.initial = visualElement.props.initial;
    }
    return context2;
  }
  const context = {};
  for (let i = 0; i < numVariantProps; i++) {
    const name = variantProps[i];
    const prop = visualElement.props[name];
    if (isVariantLabel(prop) || prop === false) {
      context[name] = prop;
    }
  }
  return context;
}
function shallowCompare(next, prev) {
  if (!Array.isArray(prev))
    return false;
  const prevLength = prev.length;
  if (prevLength !== next.length)
    return false;
  for (let i = 0; i < prevLength; i++) {
    if (prev[i] !== next[i])
      return false;
  }
  return true;
}
const reversePriorityOrder = [...variantPriorityOrder].reverse();
const numAnimationTypes = variantPriorityOrder.length;
function createAnimateFunction(visualElement) {
  return (animations2) => {
    return Promise.all(animations2.map(({ animation, options }) => animateVisualElement(visualElement, animation, options)));
  };
}
function createAnimationState(visualElement) {
  let animate = createAnimateFunction(visualElement);
  let state = createState();
  let isInitialRender = true;
  let wasReset = false;
  const buildResolvedTypeValues = (type) => (acc, definition) => {
    const resolved = resolveVariant(visualElement, definition, type === "exit" ? visualElement.presenceContext?.custom : void 0);
    if (resolved) {
      const { transition, transitionEnd, ...target } = resolved;
      acc = { ...acc, ...target, ...transitionEnd };
    }
    return acc;
  };
  function setAnimateFunction(makeAnimator) {
    animate = makeAnimator(visualElement);
  }
  function animateChanges(changedActiveType) {
    const { props } = visualElement;
    const context = getVariantContext(visualElement.parent) || {};
    const animations2 = [];
    const removedKeys = /* @__PURE__ */ new Set();
    let encounteredKeys = {};
    let removedVariantIndex = Infinity;
    for (let i = 0; i < numAnimationTypes; i++) {
      const type = reversePriorityOrder[i];
      const typeState = state[type];
      const prop = props[type] !== void 0 ? props[type] : context[type];
      const propIsVariant = isVariantLabel(prop);
      const activeDelta = type === changedActiveType ? typeState.isActive : null;
      if (activeDelta === false)
        removedVariantIndex = i;
      let isInherited = prop === context[type] && prop !== props[type] && propIsVariant;
      if (isInherited && (isInitialRender || wasReset) && visualElement.manuallyAnimateOnMount) {
        isInherited = false;
      }
      typeState.protectedKeys = { ...encounteredKeys };
      if (
        // If it isn't active and hasn't *just* been set as inactive
        !typeState.isActive && activeDelta === null || // If we didn't and don't have any defined prop for this animation type
        !prop && !typeState.prevProp || // Or if the prop doesn't define an animation
        isAnimationControls(prop) || typeof prop === "boolean"
      ) {
        continue;
      }
      if (type === "exit" && typeState.isActive && activeDelta !== true) {
        if (typeState.prevResolvedValues) {
          encounteredKeys = {
            ...encounteredKeys,
            ...typeState.prevResolvedValues
          };
        }
        continue;
      }
      const variantDidChange = checkVariantsDidChange(typeState.prevProp, prop);
      let shouldAnimateType = variantDidChange || // If we're making this variant active, we want to always make it active
      type === changedActiveType && typeState.isActive && !isInherited && propIsVariant || // If we removed a higher-priority variant (i is in reverse order)
      i > removedVariantIndex && propIsVariant;
      let handledRemovedValues = false;
      const definitionList = Array.isArray(prop) ? prop : [prop];
      let resolvedValues = definitionList.reduce(buildResolvedTypeValues(type), {});
      if (activeDelta === false)
        resolvedValues = {};
      const { prevResolvedValues = {} } = typeState;
      const allKeys = {
        ...prevResolvedValues,
        ...resolvedValues
      };
      const markToAnimate = (key) => {
        shouldAnimateType = true;
        if (removedKeys.has(key)) {
          handledRemovedValues = true;
          removedKeys.delete(key);
        }
        typeState.needsAnimating[key] = true;
        const motionValue2 = visualElement.getValue(key);
        if (motionValue2)
          motionValue2.liveStyle = false;
      };
      for (const key in allKeys) {
        const next = resolvedValues[key];
        const prev = prevResolvedValues[key];
        if (encounteredKeys.hasOwnProperty(key))
          continue;
        let valueHasChanged = false;
        if (isKeyframesTarget(next) && isKeyframesTarget(prev)) {
          valueHasChanged = !shallowCompare(next, prev);
        } else {
          valueHasChanged = next !== prev;
        }
        if (valueHasChanged) {
          if (next !== void 0 && next !== null) {
            markToAnimate(key);
          } else {
            removedKeys.add(key);
          }
        } else if (next !== void 0 && removedKeys.has(key)) {
          markToAnimate(key);
        } else {
          typeState.protectedKeys[key] = true;
        }
      }
      typeState.prevProp = prop;
      typeState.prevResolvedValues = resolvedValues;
      if (typeState.isActive) {
        encounteredKeys = { ...encounteredKeys, ...resolvedValues };
      }
      if ((isInitialRender || wasReset) && visualElement.blockInitialAnimation) {
        shouldAnimateType = false;
      }
      const willAnimateViaParent = isInherited && variantDidChange;
      const needsAnimating = !willAnimateViaParent || handledRemovedValues;
      if (shouldAnimateType && needsAnimating) {
        animations2.push(...definitionList.map((animation) => {
          const options = { type };
          if (typeof animation === "string" && (isInitialRender || wasReset) && !willAnimateViaParent && visualElement.manuallyAnimateOnMount && visualElement.parent) {
            const { parent } = visualElement;
            const parentVariant = resolveVariant(parent, animation);
            if (parent.enteringChildren && parentVariant) {
              const { delayChildren } = parentVariant.transition || {};
              options.delay = calcChildStagger(parent.enteringChildren, visualElement, delayChildren);
            }
          }
          return {
            animation,
            options
          };
        }));
      }
    }
    if (removedKeys.size) {
      const fallbackAnimation = {};
      if (typeof props.initial !== "boolean") {
        const initialTransition = resolveVariant(visualElement, Array.isArray(props.initial) ? props.initial[0] : props.initial);
        if (initialTransition && initialTransition.transition) {
          fallbackAnimation.transition = initialTransition.transition;
        }
      }
      removedKeys.forEach((key) => {
        const fallbackTarget = visualElement.getBaseTarget(key);
        const motionValue2 = visualElement.getValue(key);
        if (motionValue2)
          motionValue2.liveStyle = true;
        fallbackAnimation[key] = fallbackTarget ?? null;
      });
      animations2.push({ animation: fallbackAnimation });
    }
    let shouldAnimate = Boolean(animations2.length);
    if (isInitialRender && (props.initial === false || props.initial === props.animate) && !visualElement.manuallyAnimateOnMount) {
      shouldAnimate = false;
    }
    isInitialRender = false;
    wasReset = false;
    return shouldAnimate ? animate(animations2) : Promise.resolve();
  }
  function setActive(type, isActive) {
    if (state[type].isActive === isActive)
      return Promise.resolve();
    visualElement.variantChildren?.forEach((child) => child.animationState?.setActive(type, isActive));
    state[type].isActive = isActive;
    const animations2 = animateChanges(type);
    for (const key in state) {
      state[key].protectedKeys = {};
    }
    return animations2;
  }
  return {
    animateChanges,
    setActive,
    setAnimateFunction,
    getState: () => state,
    reset: () => {
      state = createState();
      wasReset = true;
    }
  };
}
function checkVariantsDidChange(prev, next) {
  if (typeof next === "string") {
    return next !== prev;
  } else if (Array.isArray(next)) {
    return !shallowCompare(next, prev);
  }
  return false;
}
function createTypeState(isActive = false) {
  return {
    isActive,
    protectedKeys: {},
    needsAnimating: {},
    prevResolvedValues: {}
  };
}
function createState() {
  return {
    animate: createTypeState(true),
    whileInView: createTypeState(),
    whileHover: createTypeState(),
    whileTap: createTypeState(),
    whileDrag: createTypeState(),
    whileFocus: createTypeState(),
    exit: createTypeState()
  };
}
function copyAxisInto(axis, originAxis) {
  axis.min = originAxis.min;
  axis.max = originAxis.max;
}
function copyBoxInto(box, originBox) {
  copyAxisInto(box.x, originBox.x);
  copyAxisInto(box.y, originBox.y);
}
function copyAxisDeltaInto(delta, originDelta) {
  delta.translate = originDelta.translate;
  delta.scale = originDelta.scale;
  delta.originPoint = originDelta.originPoint;
  delta.origin = originDelta.origin;
}
const SCALE_PRECISION = 1e-4;
const SCALE_MIN = 1 - SCALE_PRECISION;
const SCALE_MAX = 1 + SCALE_PRECISION;
const TRANSLATE_PRECISION = 0.01;
const TRANSLATE_MIN = 0 - TRANSLATE_PRECISION;
const TRANSLATE_MAX = 0 + TRANSLATE_PRECISION;
function calcLength(axis) {
  return axis.max - axis.min;
}
function isNear(value, target, maxDistance) {
  return Math.abs(value - target) <= maxDistance;
}
function calcAxisDelta(delta, source, target, origin = 0.5) {
  delta.origin = origin;
  delta.originPoint = mixNumber$1(source.min, source.max, delta.origin);
  delta.scale = calcLength(target) / calcLength(source);
  delta.translate = mixNumber$1(target.min, target.max, delta.origin) - delta.originPoint;
  if (delta.scale >= SCALE_MIN && delta.scale <= SCALE_MAX || isNaN(delta.scale)) {
    delta.scale = 1;
  }
  if (delta.translate >= TRANSLATE_MIN && delta.translate <= TRANSLATE_MAX || isNaN(delta.translate)) {
    delta.translate = 0;
  }
}
function calcBoxDelta(delta, source, target, origin) {
  calcAxisDelta(delta.x, source.x, target.x, origin ? origin.originX : void 0);
  calcAxisDelta(delta.y, source.y, target.y, origin ? origin.originY : void 0);
}
function calcRelativeAxis(target, relative, parent, anchor = 0) {
  const anchorPoint = anchor ? mixNumber$1(parent.min, parent.max, anchor) : parent.min;
  target.min = anchorPoint + relative.min;
  target.max = target.min + calcLength(relative);
}
function calcRelativeBox(target, relative, parent, anchor) {
  calcRelativeAxis(target.x, relative.x, parent.x, anchor?.x);
  calcRelativeAxis(target.y, relative.y, parent.y, anchor?.y);
}
function calcRelativeAxisPosition(target, layout2, parent, anchor = 0) {
  const anchorPoint = anchor ? mixNumber$1(parent.min, parent.max, anchor) : parent.min;
  target.min = layout2.min - anchorPoint;
  target.max = target.min + calcLength(layout2);
}
function calcRelativePosition(target, layout2, parent, anchor) {
  calcRelativeAxisPosition(target.x, layout2.x, parent.x, anchor?.x);
  calcRelativeAxisPosition(target.y, layout2.y, parent.y, anchor?.y);
}
function removePointDelta(point, translate, scale2, originPoint, boxScale) {
  point -= translate;
  point = scalePoint(point, 1 / scale2, originPoint);
  if (boxScale !== void 0) {
    point = scalePoint(point, 1 / boxScale, originPoint);
  }
  return point;
}
function removeAxisDelta(axis, translate = 0, scale2 = 1, origin = 0.5, boxScale, originAxis = axis, sourceAxis = axis) {
  if (percent.test(translate)) {
    translate = parseFloat(translate);
    const relativeProgress = mixNumber$1(sourceAxis.min, sourceAxis.max, translate / 100);
    translate = relativeProgress - sourceAxis.min;
  }
  if (typeof translate !== "number")
    return;
  let originPoint = mixNumber$1(originAxis.min, originAxis.max, origin);
  if (axis === originAxis)
    originPoint -= translate;
  axis.min = removePointDelta(axis.min, translate, scale2, originPoint, boxScale);
  axis.max = removePointDelta(axis.max, translate, scale2, originPoint, boxScale);
}
function removeAxisTransforms(axis, transforms, [key, scaleKey, originKey], origin, sourceAxis) {
  removeAxisDelta(axis, transforms[key], transforms[scaleKey], transforms[originKey], transforms.scale, origin, sourceAxis);
}
const xKeys = ["x", "scaleX", "originX"];
const yKeys = ["y", "scaleY", "originY"];
function removeBoxTransforms(box, transforms, originBox, sourceBox) {
  removeAxisTransforms(box.x, transforms, xKeys, originBox ? originBox.x : void 0, sourceBox ? sourceBox.x : void 0);
  removeAxisTransforms(box.y, transforms, yKeys, originBox ? originBox.y : void 0, sourceBox ? sourceBox.y : void 0);
}
function isAxisDeltaZero(delta) {
  return delta.translate === 0 && delta.scale === 1;
}
function isDeltaZero(delta) {
  return isAxisDeltaZero(delta.x) && isAxisDeltaZero(delta.y);
}
function axisEquals(a, b) {
  return a.min === b.min && a.max === b.max;
}
function boxEquals(a, b) {
  return axisEquals(a.x, b.x) && axisEquals(a.y, b.y);
}
function axisEqualsRounded(a, b) {
  return Math.round(a.min) === Math.round(b.min) && Math.round(a.max) === Math.round(b.max);
}
function boxEqualsRounded(a, b) {
  return axisEqualsRounded(a.x, b.x) && axisEqualsRounded(a.y, b.y);
}
function aspectRatio(box) {
  return calcLength(box.x) / calcLength(box.y);
}
function axisDeltaEquals(a, b) {
  return a.translate === b.translate && a.scale === b.scale && a.originPoint === b.originPoint;
}
function eachAxis(callback) {
  return [callback("x"), callback("y")];
}
function buildProjectionTransform(delta, treeScale, latestTransform) {
  let transform = "";
  const xTranslate = delta.x.translate / treeScale.x;
  const yTranslate = delta.y.translate / treeScale.y;
  const zTranslate = latestTransform?.z || 0;
  if (xTranslate || yTranslate || zTranslate) {
    transform = `translate3d(${xTranslate}px, ${yTranslate}px, ${zTranslate}px) `;
  }
  if (treeScale.x !== 1 || treeScale.y !== 1) {
    transform += `scale(${1 / treeScale.x}, ${1 / treeScale.y}) `;
  }
  if (latestTransform) {
    const { transformPerspective, rotate: rotate2, rotateX, rotateY, skewX, skewY } = latestTransform;
    if (transformPerspective)
      transform = `perspective(${transformPerspective}px) ${transform}`;
    if (rotate2)
      transform += `rotate(${rotate2}deg) `;
    if (rotateX)
      transform += `rotateX(${rotateX}deg) `;
    if (rotateY)
      transform += `rotateY(${rotateY}deg) `;
    if (skewX)
      transform += `skewX(${skewX}deg) `;
    if (skewY)
      transform += `skewY(${skewY}deg) `;
  }
  const elementScaleX = delta.x.scale * treeScale.x;
  const elementScaleY = delta.y.scale * treeScale.y;
  if (elementScaleX !== 1 || elementScaleY !== 1) {
    transform += `scale(${elementScaleX}, ${elementScaleY})`;
  }
  return transform || "none";
}
const borderLabels = [
  "borderTopLeftRadius",
  "borderTopRightRadius",
  "borderBottomLeftRadius",
  "borderBottomRightRadius"
];
const numBorders = borderLabels.length;
const asNumber = (value) => typeof value === "string" ? parseFloat(value) : value;
const isPx = (value) => typeof value === "number" || px.test(value);
function mixValues(target, follow, lead, progress2, shouldCrossfadeOpacity, isOnlyMember) {
  if (shouldCrossfadeOpacity) {
    target.opacity = mixNumber$1(0, lead.opacity ?? 1, easeCrossfadeIn(progress2));
    target.opacityExit = mixNumber$1(follow.opacity ?? 1, 0, easeCrossfadeOut(progress2));
  } else if (isOnlyMember) {
    target.opacity = mixNumber$1(follow.opacity ?? 1, lead.opacity ?? 1, progress2);
  }
  for (let i = 0; i < numBorders; i++) {
    const borderLabel = borderLabels[i];
    let followRadius = getRadius(follow, borderLabel);
    let leadRadius = getRadius(lead, borderLabel);
    if (followRadius === void 0 && leadRadius === void 0)
      continue;
    followRadius || (followRadius = 0);
    leadRadius || (leadRadius = 0);
    const canMix = followRadius === 0 || leadRadius === 0 || isPx(followRadius) === isPx(leadRadius);
    if (canMix) {
      target[borderLabel] = Math.max(mixNumber$1(asNumber(followRadius), asNumber(leadRadius), progress2), 0);
      if (percent.test(leadRadius) || percent.test(followRadius)) {
        target[borderLabel] += "%";
      }
    } else {
      target[borderLabel] = leadRadius;
    }
  }
  if (follow.rotate || lead.rotate) {
    target.rotate = mixNumber$1(follow.rotate || 0, lead.rotate || 0, progress2);
  }
}
function getRadius(values, radiusName) {
  return values[radiusName] !== void 0 ? values[radiusName] : values.borderRadius;
}
const easeCrossfadeIn = /* @__PURE__ */ compress(0, 0.5, circOut);
const easeCrossfadeOut = /* @__PURE__ */ compress(0.5, 0.95, noop);
function compress(min, max, easing) {
  return (p) => {
    if (p < min)
      return 0;
    if (p > max)
      return 1;
    return easing(/* @__PURE__ */ progress(min, max, p));
  };
}
function animateSingleValue(value, keyframes2, options) {
  const motionValue$1 = isMotionValue(value) ? value : motionValue(value);
  motionValue$1.start(animateMotionValue("", motionValue$1, keyframes2, options));
  return motionValue$1.animation;
}
function addDomEvent(target, eventName, handler, options = { passive: true }) {
  target.addEventListener(eventName, handler, options);
  return () => target.removeEventListener(eventName, handler);
}
const compareByDepth = (a, b) => a.depth - b.depth;
class FlatTree {
  constructor() {
    this.children = [];
    this.isDirty = false;
  }
  add(child) {
    addUniqueItem(this.children, child);
    this.isDirty = true;
  }
  remove(child) {
    removeItem(this.children, child);
    this.isDirty = true;
  }
  forEach(callback) {
    this.isDirty && this.children.sort(compareByDepth);
    this.isDirty = false;
    this.children.forEach(callback);
  }
}
function delay(callback, timeout) {
  const start = time.now();
  const checkElapsed = ({ timestamp }) => {
    const elapsed = timestamp - start;
    if (elapsed >= timeout) {
      cancelFrame(checkElapsed);
      callback(elapsed - timeout);
    }
  };
  frame.setup(checkElapsed, true);
  return () => cancelFrame(checkElapsed);
}
function resolveMotionValue(value) {
  return isMotionValue(value) ? value.get() : value;
}
class NodeStack {
  constructor() {
    this.members = [];
  }
  add(node) {
    addUniqueItem(this.members, node);
    for (let i = this.members.length - 1; i >= 0; i--) {
      const member = this.members[i];
      if (member === node || member === this.lead || member === this.prevLead)
        continue;
      const inst = member.instance;
      if ((!inst || inst.isConnected === false) && !member.snapshot) {
        removeItem(this.members, member);
        member.unmount();
      }
    }
    node.scheduleRender();
  }
  remove(node) {
    removeItem(this.members, node);
    if (node === this.prevLead)
      this.prevLead = void 0;
    if (node === this.lead) {
      const prevLead = this.members[this.members.length - 1];
      if (prevLead)
        this.promote(prevLead);
    }
  }
  relegate(node) {
    for (let i = this.members.indexOf(node) - 1; i >= 0; i--) {
      const member = this.members[i];
      if (member.isPresent !== false && member.instance?.isConnected !== false) {
        this.promote(member);
        return true;
      }
    }
    return false;
  }
  promote(node, preserveFollowOpacity) {
    const prevLead = this.lead;
    if (node === prevLead)
      return;
    this.prevLead = prevLead;
    this.lead = node;
    node.show();
    if (prevLead) {
      prevLead.updateSnapshot();
      node.scheduleRender();
      const { layoutDependency: prevDep } = prevLead.options;
      const { layoutDependency: nextDep } = node.options;
      if (prevDep === void 0 || prevDep !== nextDep) {
        node.resumeFrom = prevLead;
        if (preserveFollowOpacity)
          prevLead.preserveOpacity = true;
        if (prevLead.snapshot) {
          node.snapshot = prevLead.snapshot;
          node.snapshot.latestValues = prevLead.animationValues || prevLead.latestValues;
        }
        if (node.root?.isUpdating)
          node.isLayoutDirty = true;
      }
      if (node.options.crossfade === false)
        prevLead.hide();
    }
  }
  exitAnimationComplete() {
    this.members.forEach((member) => {
      member.options.onExitComplete?.();
      member.resumingFrom?.options.onExitComplete?.();
    });
  }
  scheduleRender() {
    this.members.forEach((member) => member.instance && member.scheduleRender(false));
  }
  removeLeadSnapshot() {
    if (this.lead?.snapshot)
      this.lead.snapshot = void 0;
  }
}
const globalProjectionState = {
  /**
   * Global flag as to whether the tree has animated since the last time
   * we resized the window
   */
  hasAnimatedSinceResize: true,
  /**
   * We set this to true once, on the first update. Any nodes added to the tree beyond that
   * update will be given a `data-projection-id` attribute.
   */
  hasEverUpdated: false
};
const transformAxes = ["", "X", "Y", "Z"];
const animationTarget = 1e3;
let id$1 = 0;
function resetDistortingTransform(key, visualElement, values, sharedAnimationValues) {
  const { latestValues } = visualElement;
  if (latestValues[key]) {
    values[key] = latestValues[key];
    visualElement.setStaticValue(key, 0);
    if (sharedAnimationValues) {
      sharedAnimationValues[key] = 0;
    }
  }
}
function cancelTreeOptimisedTransformAnimations(projectionNode) {
  projectionNode.hasCheckedOptimisedAppear = true;
  if (projectionNode.root === projectionNode)
    return;
  const { visualElement } = projectionNode.options;
  if (!visualElement)
    return;
  const appearId = getOptimisedAppearId(visualElement);
  if (window.MotionHasOptimisedAnimation(appearId, "transform")) {
    const { layout: layout2, layoutId } = projectionNode.options;
    window.MotionCancelOptimisedAnimation(appearId, "transform", frame, !(layout2 || layoutId));
  }
  const { parent } = projectionNode;
  if (parent && !parent.hasCheckedOptimisedAppear) {
    cancelTreeOptimisedTransformAnimations(parent);
  }
}
function createProjectionNode$1({ attachResizeListener, defaultParent, measureScroll, checkIsScrollRoot, resetTransform }) {
  return class ProjectionNode {
    constructor(latestValues = {}, parent = defaultParent?.()) {
      this.id = id$1++;
      this.animationId = 0;
      this.animationCommitId = 0;
      this.children = /* @__PURE__ */ new Set();
      this.options = {};
      this.isTreeAnimating = false;
      this.isAnimationBlocked = false;
      this.isLayoutDirty = false;
      this.isProjectionDirty = false;
      this.isSharedProjectionDirty = false;
      this.isTransformDirty = false;
      this.updateManuallyBlocked = false;
      this.updateBlockedByResize = false;
      this.isUpdating = false;
      this.isSVG = false;
      this.needsReset = false;
      this.shouldResetTransform = false;
      this.hasCheckedOptimisedAppear = false;
      this.treeScale = { x: 1, y: 1 };
      this.eventHandlers = /* @__PURE__ */ new Map();
      this.hasTreeAnimated = false;
      this.layoutVersion = 0;
      this.updateScheduled = false;
      this.scheduleUpdate = () => this.update();
      this.projectionUpdateScheduled = false;
      this.checkUpdateFailed = () => {
        if (this.isUpdating) {
          this.isUpdating = false;
          this.clearAllSnapshots();
        }
      };
      this.updateProjection = () => {
        this.projectionUpdateScheduled = false;
        this.nodes.forEach(propagateDirtyNodes);
        this.nodes.forEach(resolveTargetDelta);
        this.nodes.forEach(calcProjection);
        this.nodes.forEach(cleanDirtyNodes);
      };
      this.resolvedRelativeTargetAt = 0;
      this.linkedParentVersion = 0;
      this.hasProjected = false;
      this.isVisible = true;
      this.animationProgress = 0;
      this.sharedNodes = /* @__PURE__ */ new Map();
      this.latestValues = latestValues;
      this.root = parent ? parent.root || parent : this;
      this.path = parent ? [...parent.path, parent] : [];
      this.parent = parent;
      this.depth = parent ? parent.depth + 1 : 0;
      for (let i = 0; i < this.path.length; i++) {
        this.path[i].shouldResetTransform = true;
      }
      if (this.root === this)
        this.nodes = new FlatTree();
    }
    addEventListener(name, handler) {
      if (!this.eventHandlers.has(name)) {
        this.eventHandlers.set(name, new SubscriptionManager());
      }
      return this.eventHandlers.get(name).add(handler);
    }
    notifyListeners(name, ...args) {
      const subscriptionManager = this.eventHandlers.get(name);
      subscriptionManager && subscriptionManager.notify(...args);
    }
    hasListeners(name) {
      return this.eventHandlers.has(name);
    }
    /**
     * Lifecycles
     */
    mount(instance) {
      if (this.instance)
        return;
      this.isSVG = isSVGElement(instance) && !isSVGSVGElement(instance);
      this.instance = instance;
      const { layoutId, layout: layout2, visualElement } = this.options;
      if (visualElement && !visualElement.current) {
        visualElement.mount(instance);
      }
      this.root.nodes.add(this);
      this.parent && this.parent.children.add(this);
      if (this.root.hasTreeAnimated && (layout2 || layoutId)) {
        this.isLayoutDirty = true;
      }
      if (attachResizeListener) {
        let cancelDelay;
        let innerWidth = 0;
        const resizeUnblockUpdate = () => this.root.updateBlockedByResize = false;
        frame.read(() => {
          innerWidth = window.innerWidth;
        });
        attachResizeListener(instance, () => {
          const newInnerWidth = window.innerWidth;
          if (newInnerWidth === innerWidth)
            return;
          innerWidth = newInnerWidth;
          this.root.updateBlockedByResize = true;
          cancelDelay && cancelDelay();
          cancelDelay = delay(resizeUnblockUpdate, 250);
          if (globalProjectionState.hasAnimatedSinceResize) {
            globalProjectionState.hasAnimatedSinceResize = false;
            this.nodes.forEach(finishAnimation);
          }
        });
      }
      if (layoutId) {
        this.root.registerSharedNode(layoutId, this);
      }
      if (this.options.animate !== false && visualElement && (layoutId || layout2)) {
        this.addEventListener("didUpdate", ({ delta, hasLayoutChanged, hasRelativeLayoutChanged, layout: newLayout }) => {
          if (this.isTreeAnimationBlocked()) {
            this.target = void 0;
            this.relativeTarget = void 0;
            return;
          }
          const layoutTransition = this.options.transition || visualElement.getDefaultTransition() || defaultLayoutTransition;
          const { onLayoutAnimationStart, onLayoutAnimationComplete } = visualElement.getProps();
          const hasTargetChanged = !this.targetLayout || !boxEqualsRounded(this.targetLayout, newLayout);
          const hasOnlyRelativeTargetChanged = !hasLayoutChanged && hasRelativeLayoutChanged;
          if (this.options.layoutRoot || this.resumeFrom || hasOnlyRelativeTargetChanged || hasLayoutChanged && (hasTargetChanged || !this.currentAnimation)) {
            if (this.resumeFrom) {
              this.resumingFrom = this.resumeFrom;
              this.resumingFrom.resumingFrom = void 0;
            }
            const animationOptions = {
              ...getValueTransition(layoutTransition, "layout"),
              onPlay: onLayoutAnimationStart,
              onComplete: onLayoutAnimationComplete
            };
            if (visualElement.shouldReduceMotion || this.options.layoutRoot) {
              animationOptions.delay = 0;
              animationOptions.type = false;
            }
            this.startAnimation(animationOptions);
            this.setAnimationOrigin(delta, hasOnlyRelativeTargetChanged);
          } else {
            if (!hasLayoutChanged) {
              finishAnimation(this);
            }
            if (this.isLead() && this.options.onExitComplete) {
              this.options.onExitComplete();
            }
          }
          this.targetLayout = newLayout;
        });
      }
    }
    unmount() {
      this.options.layoutId && this.willUpdate();
      this.root.nodes.remove(this);
      const stack = this.getStack();
      stack && stack.remove(this);
      this.parent && this.parent.children.delete(this);
      this.instance = void 0;
      this.eventHandlers.clear();
      cancelFrame(this.updateProjection);
    }
    // only on the root
    blockUpdate() {
      this.updateManuallyBlocked = true;
    }
    unblockUpdate() {
      this.updateManuallyBlocked = false;
    }
    isUpdateBlocked() {
      return this.updateManuallyBlocked || this.updateBlockedByResize;
    }
    isTreeAnimationBlocked() {
      return this.isAnimationBlocked || this.parent && this.parent.isTreeAnimationBlocked() || false;
    }
    // Note: currently only running on root node
    startUpdate() {
      if (this.isUpdateBlocked())
        return;
      this.isUpdating = true;
      this.nodes && this.nodes.forEach(resetSkewAndRotation);
      this.animationId++;
    }
    getTransformTemplate() {
      const { visualElement } = this.options;
      return visualElement && visualElement.getProps().transformTemplate;
    }
    willUpdate(shouldNotifyListeners = true) {
      this.root.hasTreeAnimated = true;
      if (this.root.isUpdateBlocked()) {
        this.options.onExitComplete && this.options.onExitComplete();
        return;
      }
      if (window.MotionCancelOptimisedAnimation && !this.hasCheckedOptimisedAppear) {
        cancelTreeOptimisedTransformAnimations(this);
      }
      !this.root.isUpdating && this.root.startUpdate();
      if (this.isLayoutDirty)
        return;
      this.isLayoutDirty = true;
      for (let i = 0; i < this.path.length; i++) {
        const node = this.path[i];
        node.shouldResetTransform = true;
        if (typeof node.latestValues.x === "string" || typeof node.latestValues.y === "string") {
          node.isLayoutDirty = true;
        }
        node.updateScroll("snapshot");
        if (node.options.layoutRoot) {
          node.willUpdate(false);
        }
      }
      const { layoutId, layout: layout2 } = this.options;
      if (layoutId === void 0 && !layout2)
        return;
      const transformTemplate = this.getTransformTemplate();
      this.prevTransformTemplateValue = transformTemplate ? transformTemplate(this.latestValues, "") : void 0;
      this.updateSnapshot();
      shouldNotifyListeners && this.notifyListeners("willUpdate");
    }
    update() {
      this.updateScheduled = false;
      const updateWasBlocked = this.isUpdateBlocked();
      if (updateWasBlocked) {
        const wasBlockedByResize = this.updateBlockedByResize;
        this.unblockUpdate();
        this.updateBlockedByResize = false;
        this.clearAllSnapshots();
        if (wasBlockedByResize) {
          this.nodes.forEach(forceLayoutMeasure);
        }
        this.nodes.forEach(clearMeasurements);
        return;
      }
      if (this.animationId <= this.animationCommitId) {
        this.nodes.forEach(clearIsLayoutDirty);
        return;
      }
      this.animationCommitId = this.animationId;
      if (!this.isUpdating) {
        this.nodes.forEach(clearIsLayoutDirty);
      } else {
        this.isUpdating = false;
        this.nodes.forEach(ensureDraggedNodesSnapshotted);
        this.nodes.forEach(resetTransformStyle);
        this.nodes.forEach(updateLayout);
        this.nodes.forEach(notifyLayoutUpdate);
      }
      this.clearAllSnapshots();
      const now2 = time.now();
      frameData.delta = clamp(0, 1e3 / 60, now2 - frameData.timestamp);
      frameData.timestamp = now2;
      frameData.isProcessing = true;
      frameSteps.update.process(frameData);
      frameSteps.preRender.process(frameData);
      frameSteps.render.process(frameData);
      frameData.isProcessing = false;
    }
    didUpdate() {
      if (!this.updateScheduled) {
        this.updateScheduled = true;
        microtask.read(this.scheduleUpdate);
      }
    }
    clearAllSnapshots() {
      this.nodes.forEach(clearSnapshot);
      this.sharedNodes.forEach(removeLeadSnapshots);
    }
    scheduleUpdateProjection() {
      if (!this.projectionUpdateScheduled) {
        this.projectionUpdateScheduled = true;
        frame.preRender(this.updateProjection, false, true);
      }
    }
    scheduleCheckAfterUnmount() {
      frame.postRender(() => {
        if (this.isLayoutDirty) {
          this.root.didUpdate();
        } else {
          this.root.checkUpdateFailed();
        }
      });
    }
    /**
     * Update measurements
     */
    updateSnapshot() {
      if (this.snapshot || !this.instance)
        return;
      this.snapshot = this.measure();
      if (this.snapshot && !calcLength(this.snapshot.measuredBox.x) && !calcLength(this.snapshot.measuredBox.y)) {
        this.snapshot = void 0;
      }
    }
    updateLayout() {
      if (!this.instance)
        return;
      this.updateScroll();
      if (!(this.options.alwaysMeasureLayout && this.isLead()) && !this.isLayoutDirty) {
        return;
      }
      if (this.resumeFrom && !this.resumeFrom.instance) {
        for (let i = 0; i < this.path.length; i++) {
          const node = this.path[i];
          node.updateScroll();
        }
      }
      const prevLayout = this.layout;
      this.layout = this.measure(false);
      this.layoutVersion++;
      if (!this.layoutCorrected)
        this.layoutCorrected = createBox();
      this.isLayoutDirty = false;
      this.projectionDelta = void 0;
      this.notifyListeners("measure", this.layout.layoutBox);
      const { visualElement } = this.options;
      visualElement && visualElement.notify("LayoutMeasure", this.layout.layoutBox, prevLayout ? prevLayout.layoutBox : void 0);
    }
    updateScroll(phase = "measure") {
      let needsMeasurement = Boolean(this.options.layoutScroll && this.instance);
      if (this.scroll && this.scroll.animationId === this.root.animationId && this.scroll.phase === phase) {
        needsMeasurement = false;
      }
      if (needsMeasurement && this.instance) {
        const isRoot = checkIsScrollRoot(this.instance);
        this.scroll = {
          animationId: this.root.animationId,
          phase,
          isRoot,
          offset: measureScroll(this.instance),
          wasRoot: this.scroll ? this.scroll.isRoot : isRoot
        };
      }
    }
    resetTransform() {
      if (!resetTransform)
        return;
      const isResetRequested = this.isLayoutDirty || this.shouldResetTransform || this.options.alwaysMeasureLayout;
      const hasProjection = this.projectionDelta && !isDeltaZero(this.projectionDelta);
      const transformTemplate = this.getTransformTemplate();
      const transformTemplateValue = transformTemplate ? transformTemplate(this.latestValues, "") : void 0;
      const transformTemplateHasChanged = transformTemplateValue !== this.prevTransformTemplateValue;
      if (isResetRequested && this.instance && (hasProjection || hasTransform(this.latestValues) || transformTemplateHasChanged)) {
        resetTransform(this.instance, transformTemplateValue);
        this.shouldResetTransform = false;
        this.scheduleRender();
      }
    }
    measure(removeTransform = true) {
      const pageBox = this.measurePageBox();
      let layoutBox = this.removeElementScroll(pageBox);
      if (removeTransform) {
        layoutBox = this.removeTransform(layoutBox);
      }
      roundBox(layoutBox);
      return {
        animationId: this.root.animationId,
        measuredBox: pageBox,
        layoutBox,
        latestValues: {},
        source: this.id
      };
    }
    measurePageBox() {
      const { visualElement } = this.options;
      if (!visualElement)
        return createBox();
      const box = visualElement.measureViewportBox();
      const wasInScrollRoot = this.scroll?.wasRoot || this.path.some(checkNodeWasScrollRoot);
      if (!wasInScrollRoot) {
        const { scroll } = this.root;
        if (scroll) {
          translateAxis(box.x, scroll.offset.x);
          translateAxis(box.y, scroll.offset.y);
        }
      }
      return box;
    }
    removeElementScroll(box) {
      const boxWithoutScroll = createBox();
      copyBoxInto(boxWithoutScroll, box);
      if (this.scroll?.wasRoot) {
        return boxWithoutScroll;
      }
      for (let i = 0; i < this.path.length; i++) {
        const node = this.path[i];
        const { scroll, options } = node;
        if (node !== this.root && scroll && options.layoutScroll) {
          if (scroll.wasRoot) {
            copyBoxInto(boxWithoutScroll, box);
          }
          translateAxis(boxWithoutScroll.x, scroll.offset.x);
          translateAxis(boxWithoutScroll.y, scroll.offset.y);
        }
      }
      return boxWithoutScroll;
    }
    applyTransform(box, transformOnly = false, output) {
      const withTransforms = output || createBox();
      copyBoxInto(withTransforms, box);
      for (let i = 0; i < this.path.length; i++) {
        const node = this.path[i];
        if (!transformOnly && node.options.layoutScroll && node.scroll && node !== node.root) {
          translateAxis(withTransforms.x, -node.scroll.offset.x);
          translateAxis(withTransforms.y, -node.scroll.offset.y);
        }
        if (!hasTransform(node.latestValues))
          continue;
        transformBox(withTransforms, node.latestValues, node.layout?.layoutBox);
      }
      if (hasTransform(this.latestValues)) {
        transformBox(withTransforms, this.latestValues, this.layout?.layoutBox);
      }
      return withTransforms;
    }
    removeTransform(box) {
      const boxWithoutTransform = createBox();
      copyBoxInto(boxWithoutTransform, box);
      for (let i = 0; i < this.path.length; i++) {
        const node = this.path[i];
        if (!hasTransform(node.latestValues))
          continue;
        let sourceBox;
        if (node.instance) {
          hasScale(node.latestValues) && node.updateSnapshot();
          sourceBox = createBox();
          copyBoxInto(sourceBox, node.measurePageBox());
        }
        removeBoxTransforms(boxWithoutTransform, node.latestValues, node.snapshot?.layoutBox, sourceBox);
      }
      if (hasTransform(this.latestValues)) {
        removeBoxTransforms(boxWithoutTransform, this.latestValues);
      }
      return boxWithoutTransform;
    }
    setTargetDelta(delta) {
      this.targetDelta = delta;
      this.root.scheduleUpdateProjection();
      this.isProjectionDirty = true;
    }
    setOptions(options) {
      this.options = {
        ...this.options,
        ...options,
        crossfade: options.crossfade !== void 0 ? options.crossfade : true
      };
    }
    clearMeasurements() {
      this.scroll = void 0;
      this.layout = void 0;
      this.snapshot = void 0;
      this.prevTransformTemplateValue = void 0;
      this.targetDelta = void 0;
      this.target = void 0;
      this.isLayoutDirty = false;
    }
    forceRelativeParentToResolveTarget() {
      if (!this.relativeParent)
        return;
      if (this.relativeParent.resolvedRelativeTargetAt !== frameData.timestamp) {
        this.relativeParent.resolveTargetDelta(true);
      }
    }
    resolveTargetDelta(forceRecalculation = false) {
      const lead = this.getLead();
      this.isProjectionDirty || (this.isProjectionDirty = lead.isProjectionDirty);
      this.isTransformDirty || (this.isTransformDirty = lead.isTransformDirty);
      this.isSharedProjectionDirty || (this.isSharedProjectionDirty = lead.isSharedProjectionDirty);
      const isShared = Boolean(this.resumingFrom) || this !== lead;
      const canSkip = !(forceRecalculation || isShared && this.isSharedProjectionDirty || this.isProjectionDirty || this.parent?.isProjectionDirty || this.attemptToResolveRelativeTarget || this.root.updateBlockedByResize);
      if (canSkip)
        return;
      const { layout: layout2, layoutId } = this.options;
      if (!this.layout || !(layout2 || layoutId))
        return;
      this.resolvedRelativeTargetAt = frameData.timestamp;
      const relativeParent = this.getClosestProjectingParent();
      if (relativeParent && this.linkedParentVersion !== relativeParent.layoutVersion && !relativeParent.options.layoutRoot) {
        this.removeRelativeTarget();
      }
      if (!this.targetDelta && !this.relativeTarget) {
        if (this.options.layoutAnchor !== false && relativeParent && relativeParent.layout) {
          this.createRelativeTarget(relativeParent, this.layout.layoutBox, relativeParent.layout.layoutBox);
        } else {
          this.removeRelativeTarget();
        }
      }
      if (!this.relativeTarget && !this.targetDelta)
        return;
      if (!this.target) {
        this.target = createBox();
        this.targetWithTransforms = createBox();
      }
      if (this.relativeTarget && this.relativeTargetOrigin && this.relativeParent && this.relativeParent.target) {
        this.forceRelativeParentToResolveTarget();
        calcRelativeBox(this.target, this.relativeTarget, this.relativeParent.target, this.options.layoutAnchor || void 0);
      } else if (this.targetDelta) {
        if (Boolean(this.resumingFrom)) {
          this.applyTransform(this.layout.layoutBox, false, this.target);
        } else {
          copyBoxInto(this.target, this.layout.layoutBox);
        }
        applyBoxDelta(this.target, this.targetDelta);
      } else {
        copyBoxInto(this.target, this.layout.layoutBox);
      }
      if (this.attemptToResolveRelativeTarget) {
        this.attemptToResolveRelativeTarget = false;
        if (this.options.layoutAnchor !== false && relativeParent && Boolean(relativeParent.resumingFrom) === Boolean(this.resumingFrom) && !relativeParent.options.layoutScroll && relativeParent.target && this.animationProgress !== 1) {
          this.createRelativeTarget(relativeParent, this.target, relativeParent.target);
        } else {
          this.relativeParent = this.relativeTarget = void 0;
        }
      }
    }
    getClosestProjectingParent() {
      if (!this.parent || hasScale(this.parent.latestValues) || has2DTranslate(this.parent.latestValues)) {
        return void 0;
      }
      if (this.parent.isProjecting()) {
        return this.parent;
      } else {
        return this.parent.getClosestProjectingParent();
      }
    }
    isProjecting() {
      return Boolean((this.relativeTarget || this.targetDelta || this.options.layoutRoot) && this.layout);
    }
    createRelativeTarget(relativeParent, layout2, parentLayout) {
      this.relativeParent = relativeParent;
      this.linkedParentVersion = relativeParent.layoutVersion;
      this.forceRelativeParentToResolveTarget();
      this.relativeTarget = createBox();
      this.relativeTargetOrigin = createBox();
      calcRelativePosition(this.relativeTargetOrigin, layout2, parentLayout, this.options.layoutAnchor || void 0);
      copyBoxInto(this.relativeTarget, this.relativeTargetOrigin);
    }
    removeRelativeTarget() {
      this.relativeParent = this.relativeTarget = void 0;
    }
    calcProjection() {
      const lead = this.getLead();
      const isShared = Boolean(this.resumingFrom) || this !== lead;
      let canSkip = true;
      if (this.isProjectionDirty || this.parent?.isProjectionDirty) {
        canSkip = false;
      }
      if (isShared && (this.isSharedProjectionDirty || this.isTransformDirty)) {
        canSkip = false;
      }
      if (this.resolvedRelativeTargetAt === frameData.timestamp) {
        canSkip = false;
      }
      if (canSkip)
        return;
      const { layout: layout2, layoutId } = this.options;
      this.isTreeAnimating = Boolean(this.parent && this.parent.isTreeAnimating || this.currentAnimation || this.pendingAnimation);
      if (!this.isTreeAnimating) {
        this.targetDelta = this.relativeTarget = void 0;
      }
      if (!this.layout || !(layout2 || layoutId))
        return;
      copyBoxInto(this.layoutCorrected, this.layout.layoutBox);
      const prevTreeScaleX = this.treeScale.x;
      const prevTreeScaleY = this.treeScale.y;
      applyTreeDeltas(this.layoutCorrected, this.treeScale, this.path, isShared);
      if (lead.layout && !lead.target && (this.treeScale.x !== 1 || this.treeScale.y !== 1)) {
        lead.target = lead.layout.layoutBox;
        lead.targetWithTransforms = createBox();
      }
      const { target } = lead;
      if (!target) {
        if (this.prevProjectionDelta) {
          this.createProjectionDeltas();
          this.scheduleRender();
        }
        return;
      }
      if (!this.projectionDelta || !this.prevProjectionDelta) {
        this.createProjectionDeltas();
      } else {
        copyAxisDeltaInto(this.prevProjectionDelta.x, this.projectionDelta.x);
        copyAxisDeltaInto(this.prevProjectionDelta.y, this.projectionDelta.y);
      }
      calcBoxDelta(this.projectionDelta, this.layoutCorrected, target, this.latestValues);
      if (this.treeScale.x !== prevTreeScaleX || this.treeScale.y !== prevTreeScaleY || !axisDeltaEquals(this.projectionDelta.x, this.prevProjectionDelta.x) || !axisDeltaEquals(this.projectionDelta.y, this.prevProjectionDelta.y)) {
        this.hasProjected = true;
        this.scheduleRender();
        this.notifyListeners("projectionUpdate", target);
      }
    }
    hide() {
      this.isVisible = false;
    }
    show() {
      this.isVisible = true;
    }
    scheduleRender(notifyAll2 = true) {
      this.options.visualElement?.scheduleRender();
      if (notifyAll2) {
        const stack = this.getStack();
        stack && stack.scheduleRender();
      }
      if (this.resumingFrom && !this.resumingFrom.instance) {
        this.resumingFrom = void 0;
      }
    }
    createProjectionDeltas() {
      this.prevProjectionDelta = createDelta();
      this.projectionDelta = createDelta();
      this.projectionDeltaWithTransform = createDelta();
    }
    setAnimationOrigin(delta, hasOnlyRelativeTargetChanged = false) {
      const snapshot = this.snapshot;
      const snapshotLatestValues = snapshot ? snapshot.latestValues : {};
      const mixedValues = { ...this.latestValues };
      const targetDelta = createDelta();
      if (!this.relativeParent || !this.relativeParent.options.layoutRoot) {
        this.relativeTarget = this.relativeTargetOrigin = void 0;
      }
      this.attemptToResolveRelativeTarget = !hasOnlyRelativeTargetChanged;
      const relativeLayout = createBox();
      const snapshotSource = snapshot ? snapshot.source : void 0;
      const layoutSource = this.layout ? this.layout.source : void 0;
      const isSharedLayoutAnimation = snapshotSource !== layoutSource;
      const stack = this.getStack();
      const isOnlyMember = !stack || stack.members.length <= 1;
      const shouldCrossfadeOpacity = Boolean(isSharedLayoutAnimation && !isOnlyMember && this.options.crossfade === true && !this.path.some(hasOpacityCrossfade));
      this.animationProgress = 0;
      let prevRelativeTarget;
      this.mixTargetDelta = (latest) => {
        const progress2 = latest / 1e3;
        mixAxisDelta(targetDelta.x, delta.x, progress2);
        mixAxisDelta(targetDelta.y, delta.y, progress2);
        this.setTargetDelta(targetDelta);
        if (this.relativeTarget && this.relativeTargetOrigin && this.layout && this.relativeParent && this.relativeParent.layout) {
          calcRelativePosition(relativeLayout, this.layout.layoutBox, this.relativeParent.layout.layoutBox, this.options.layoutAnchor || void 0);
          mixBox(this.relativeTarget, this.relativeTargetOrigin, relativeLayout, progress2);
          if (prevRelativeTarget && boxEquals(this.relativeTarget, prevRelativeTarget)) {
            this.isProjectionDirty = false;
          }
          if (!prevRelativeTarget)
            prevRelativeTarget = createBox();
          copyBoxInto(prevRelativeTarget, this.relativeTarget);
        }
        if (isSharedLayoutAnimation) {
          this.animationValues = mixedValues;
          mixValues(mixedValues, snapshotLatestValues, this.latestValues, progress2, shouldCrossfadeOpacity, isOnlyMember);
        }
        this.root.scheduleUpdateProjection();
        this.scheduleRender();
        this.animationProgress = progress2;
      };
      this.mixTargetDelta(this.options.layoutRoot ? 1e3 : 0);
    }
    startAnimation(options) {
      this.notifyListeners("animationStart");
      this.currentAnimation?.stop();
      this.resumingFrom?.currentAnimation?.stop();
      if (this.pendingAnimation) {
        cancelFrame(this.pendingAnimation);
        this.pendingAnimation = void 0;
      }
      this.pendingAnimation = frame.update(() => {
        globalProjectionState.hasAnimatedSinceResize = true;
        this.motionValue || (this.motionValue = motionValue(0));
        this.motionValue.jump(0, false);
        this.currentAnimation = animateSingleValue(this.motionValue, [0, 1e3], {
          ...options,
          velocity: 0,
          isSync: true,
          onUpdate: (latest) => {
            this.mixTargetDelta(latest);
            options.onUpdate && options.onUpdate(latest);
          },
          onStop: () => {
          },
          onComplete: () => {
            options.onComplete && options.onComplete();
            this.completeAnimation();
          }
        });
        if (this.resumingFrom) {
          this.resumingFrom.currentAnimation = this.currentAnimation;
        }
        this.pendingAnimation = void 0;
      });
    }
    completeAnimation() {
      if (this.resumingFrom) {
        this.resumingFrom.currentAnimation = void 0;
        this.resumingFrom.preserveOpacity = void 0;
      }
      const stack = this.getStack();
      stack && stack.exitAnimationComplete();
      this.resumingFrom = this.currentAnimation = this.animationValues = void 0;
      this.notifyListeners("animationComplete");
    }
    finishAnimation() {
      if (this.currentAnimation) {
        this.mixTargetDelta && this.mixTargetDelta(animationTarget);
        this.currentAnimation.stop();
      }
      this.completeAnimation();
    }
    applyTransformsToTarget() {
      const lead = this.getLead();
      let { targetWithTransforms, target, layout: layout2, latestValues } = lead;
      if (!targetWithTransforms || !target || !layout2)
        return;
      if (this !== lead && this.layout && layout2 && shouldAnimatePositionOnly(this.options.animationType, this.layout.layoutBox, layout2.layoutBox)) {
        target = this.target || createBox();
        const xLength = calcLength(this.layout.layoutBox.x);
        target.x.min = lead.target.x.min;
        target.x.max = target.x.min + xLength;
        const yLength = calcLength(this.layout.layoutBox.y);
        target.y.min = lead.target.y.min;
        target.y.max = target.y.min + yLength;
      }
      copyBoxInto(targetWithTransforms, target);
      transformBox(targetWithTransforms, latestValues);
      calcBoxDelta(this.projectionDeltaWithTransform, this.layoutCorrected, targetWithTransforms, latestValues);
    }
    registerSharedNode(layoutId, node) {
      if (!this.sharedNodes.has(layoutId)) {
        this.sharedNodes.set(layoutId, new NodeStack());
      }
      const stack = this.sharedNodes.get(layoutId);
      stack.add(node);
      const config = node.options.initialPromotionConfig;
      node.promote({
        transition: config ? config.transition : void 0,
        preserveFollowOpacity: config && config.shouldPreserveFollowOpacity ? config.shouldPreserveFollowOpacity(node) : void 0
      });
    }
    isLead() {
      const stack = this.getStack();
      return stack ? stack.lead === this : true;
    }
    getLead() {
      const { layoutId } = this.options;
      return layoutId ? this.getStack()?.lead || this : this;
    }
    getPrevLead() {
      const { layoutId } = this.options;
      return layoutId ? this.getStack()?.prevLead : void 0;
    }
    getStack() {
      const { layoutId } = this.options;
      if (layoutId)
        return this.root.sharedNodes.get(layoutId);
    }
    promote({ needsReset, transition, preserveFollowOpacity } = {}) {
      const stack = this.getStack();
      if (stack)
        stack.promote(this, preserveFollowOpacity);
      if (needsReset) {
        this.projectionDelta = void 0;
        this.needsReset = true;
      }
      if (transition)
        this.setOptions({ transition });
    }
    relegate() {
      const stack = this.getStack();
      if (stack) {
        return stack.relegate(this);
      } else {
        return false;
      }
    }
    resetSkewAndRotation() {
      const { visualElement } = this.options;
      if (!visualElement)
        return;
      let hasDistortingTransform = false;
      const { latestValues } = visualElement;
      if (latestValues.z || latestValues.rotate || latestValues.rotateX || latestValues.rotateY || latestValues.rotateZ || latestValues.skewX || latestValues.skewY) {
        hasDistortingTransform = true;
      }
      if (!hasDistortingTransform)
        return;
      const resetValues = {};
      if (latestValues.z) {
        resetDistortingTransform("z", visualElement, resetValues, this.animationValues);
      }
      for (let i = 0; i < transformAxes.length; i++) {
        resetDistortingTransform(`rotate${transformAxes[i]}`, visualElement, resetValues, this.animationValues);
        resetDistortingTransform(`skew${transformAxes[i]}`, visualElement, resetValues, this.animationValues);
      }
      visualElement.render();
      for (const key in resetValues) {
        visualElement.setStaticValue(key, resetValues[key]);
        if (this.animationValues) {
          this.animationValues[key] = resetValues[key];
        }
      }
      visualElement.scheduleRender();
    }
    applyProjectionStyles(targetStyle, styleProp) {
      if (!this.instance || this.isSVG)
        return;
      if (!this.isVisible) {
        targetStyle.visibility = "hidden";
        return;
      }
      const transformTemplate = this.getTransformTemplate();
      if (this.needsReset) {
        this.needsReset = false;
        targetStyle.visibility = "";
        targetStyle.opacity = "";
        targetStyle.pointerEvents = resolveMotionValue(styleProp?.pointerEvents) || "";
        targetStyle.transform = transformTemplate ? transformTemplate(this.latestValues, "") : "none";
        return;
      }
      const lead = this.getLead();
      if (!this.projectionDelta || !this.layout || !lead.target) {
        if (this.options.layoutId) {
          targetStyle.opacity = this.latestValues.opacity !== void 0 ? this.latestValues.opacity : 1;
          targetStyle.pointerEvents = resolveMotionValue(styleProp?.pointerEvents) || "";
        }
        if (this.hasProjected && !hasTransform(this.latestValues)) {
          targetStyle.transform = transformTemplate ? transformTemplate({}, "") : "none";
          this.hasProjected = false;
        }
        return;
      }
      targetStyle.visibility = "";
      const valuesToRender = lead.animationValues || lead.latestValues;
      this.applyTransformsToTarget();
      let transform = buildProjectionTransform(this.projectionDeltaWithTransform, this.treeScale, valuesToRender);
      if (transformTemplate) {
        transform = transformTemplate(valuesToRender, transform);
      }
      targetStyle.transform = transform;
      const { x, y } = this.projectionDelta;
      targetStyle.transformOrigin = `${x.origin * 100}% ${y.origin * 100}% 0`;
      if (lead.animationValues) {
        targetStyle.opacity = lead === this ? valuesToRender.opacity ?? this.latestValues.opacity ?? 1 : this.preserveOpacity ? this.latestValues.opacity : valuesToRender.opacityExit;
      } else {
        targetStyle.opacity = lead === this ? valuesToRender.opacity !== void 0 ? valuesToRender.opacity : "" : valuesToRender.opacityExit !== void 0 ? valuesToRender.opacityExit : 0;
      }
      for (const key in scaleCorrectors) {
        if (valuesToRender[key] === void 0)
          continue;
        const { correct, applyTo, isCSSVariable } = scaleCorrectors[key];
        const corrected = transform === "none" ? valuesToRender[key] : correct(valuesToRender[key], lead);
        if (applyTo) {
          const num = applyTo.length;
          for (let i = 0; i < num; i++) {
            targetStyle[applyTo[i]] = corrected;
          }
        } else {
          if (isCSSVariable) {
            this.options.visualElement.renderState.vars[key] = corrected;
          } else {
            targetStyle[key] = corrected;
          }
        }
      }
      if (this.options.layoutId) {
        targetStyle.pointerEvents = lead === this ? resolveMotionValue(styleProp?.pointerEvents) || "" : "none";
      }
    }
    clearSnapshot() {
      this.resumeFrom = this.snapshot = void 0;
    }
    // Only run on root
    resetTree() {
      this.root.nodes.forEach((node) => node.currentAnimation?.stop());
      this.root.nodes.forEach(clearMeasurements);
      this.root.sharedNodes.clear();
    }
  };
}
function updateLayout(node) {
  node.updateLayout();
}
function notifyLayoutUpdate(node) {
  const snapshot = node.resumeFrom?.snapshot || node.snapshot;
  if (node.isLead() && node.layout && snapshot && node.hasListeners("didUpdate")) {
    const { layoutBox: layout2, measuredBox: measuredLayout } = node.layout;
    const { animationType } = node.options;
    const isShared = snapshot.source !== node.layout.source;
    if (animationType === "size") {
      eachAxis((axis) => {
        const axisSnapshot = isShared ? snapshot.measuredBox[axis] : snapshot.layoutBox[axis];
        const length = calcLength(axisSnapshot);
        axisSnapshot.min = layout2[axis].min;
        axisSnapshot.max = axisSnapshot.min + length;
      });
    } else if (animationType === "x" || animationType === "y") {
      const snapAxis = animationType === "x" ? "y" : "x";
      copyAxisInto(isShared ? snapshot.measuredBox[snapAxis] : snapshot.layoutBox[snapAxis], layout2[snapAxis]);
    } else if (shouldAnimatePositionOnly(animationType, snapshot.layoutBox, layout2)) {
      eachAxis((axis) => {
        const axisSnapshot = isShared ? snapshot.measuredBox[axis] : snapshot.layoutBox[axis];
        const length = calcLength(layout2[axis]);
        axisSnapshot.max = axisSnapshot.min + length;
        if (node.relativeTarget && !node.currentAnimation) {
          node.isProjectionDirty = true;
          node.relativeTarget[axis].max = node.relativeTarget[axis].min + length;
        }
      });
    }
    const layoutDelta = createDelta();
    calcBoxDelta(layoutDelta, layout2, snapshot.layoutBox);
    const visualDelta = createDelta();
    if (isShared) {
      calcBoxDelta(visualDelta, node.applyTransform(measuredLayout, true), snapshot.measuredBox);
    } else {
      calcBoxDelta(visualDelta, layout2, snapshot.layoutBox);
    }
    const hasLayoutChanged = !isDeltaZero(layoutDelta);
    let hasRelativeLayoutChanged = false;
    if (!node.resumeFrom) {
      const relativeParent = node.getClosestProjectingParent();
      if (relativeParent && !relativeParent.resumeFrom) {
        const { snapshot: parentSnapshot, layout: parentLayout } = relativeParent;
        if (parentSnapshot && parentLayout) {
          const anchor = node.options.layoutAnchor || void 0;
          const relativeSnapshot = createBox();
          calcRelativePosition(relativeSnapshot, snapshot.layoutBox, parentSnapshot.layoutBox, anchor);
          const relativeLayout = createBox();
          calcRelativePosition(relativeLayout, layout2, parentLayout.layoutBox, anchor);
          if (!boxEqualsRounded(relativeSnapshot, relativeLayout)) {
            hasRelativeLayoutChanged = true;
          }
          if (relativeParent.options.layoutRoot) {
            node.relativeTarget = relativeLayout;
            node.relativeTargetOrigin = relativeSnapshot;
            node.relativeParent = relativeParent;
          }
        }
      }
    }
    node.notifyListeners("didUpdate", {
      layout: layout2,
      snapshot,
      delta: visualDelta,
      layoutDelta,
      hasLayoutChanged,
      hasRelativeLayoutChanged
    });
  } else if (node.isLead()) {
    const { onExitComplete } = node.options;
    onExitComplete && onExitComplete();
  }
  node.options.transition = void 0;
}
function propagateDirtyNodes(node) {
  if (!node.parent)
    return;
  if (!node.isProjecting()) {
    node.isProjectionDirty = node.parent.isProjectionDirty;
  }
  node.isSharedProjectionDirty || (node.isSharedProjectionDirty = Boolean(node.isProjectionDirty || node.parent.isProjectionDirty || node.parent.isSharedProjectionDirty));
  node.isTransformDirty || (node.isTransformDirty = node.parent.isTransformDirty);
}
function cleanDirtyNodes(node) {
  node.isProjectionDirty = node.isSharedProjectionDirty = node.isTransformDirty = false;
}
function clearSnapshot(node) {
  node.clearSnapshot();
}
function clearMeasurements(node) {
  node.clearMeasurements();
}
function forceLayoutMeasure(node) {
  node.isLayoutDirty = true;
  node.updateLayout();
}
function clearIsLayoutDirty(node) {
  node.isLayoutDirty = false;
}
function ensureDraggedNodesSnapshotted(node) {
  if (node.isAnimationBlocked && node.layout && !node.isLayoutDirty) {
    node.snapshot = node.layout;
    node.isLayoutDirty = true;
  }
}
function resetTransformStyle(node) {
  const { visualElement } = node.options;
  if (visualElement && visualElement.getProps().onBeforeLayoutMeasure) {
    visualElement.notify("BeforeLayoutMeasure");
  }
  node.resetTransform();
}
function finishAnimation(node) {
  node.finishAnimation();
  node.targetDelta = node.relativeTarget = node.target = void 0;
  node.isProjectionDirty = true;
}
function resolveTargetDelta(node) {
  node.resolveTargetDelta();
}
function calcProjection(node) {
  node.calcProjection();
}
function resetSkewAndRotation(node) {
  node.resetSkewAndRotation();
}
function removeLeadSnapshots(stack) {
  stack.removeLeadSnapshot();
}
function mixAxisDelta(output, delta, p) {
  output.translate = mixNumber$1(delta.translate, 0, p);
  output.scale = mixNumber$1(delta.scale, 1, p);
  output.origin = delta.origin;
  output.originPoint = delta.originPoint;
}
function mixAxis(output, from, to, p) {
  output.min = mixNumber$1(from.min, to.min, p);
  output.max = mixNumber$1(from.max, to.max, p);
}
function mixBox(output, from, to, p) {
  mixAxis(output.x, from.x, to.x, p);
  mixAxis(output.y, from.y, to.y, p);
}
function hasOpacityCrossfade(node) {
  return node.animationValues && node.animationValues.opacityExit !== void 0;
}
const defaultLayoutTransition = {
  duration: 0.45,
  ease: [0.4, 0, 0.1, 1]
};
const userAgentContains = (string) => typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().includes(string);
const roundPoint = userAgentContains("applewebkit/") && !userAgentContains("chrome/") ? Math.round : noop;
function roundAxis(axis) {
  axis.min = roundPoint(axis.min);
  axis.max = roundPoint(axis.max);
}
function roundBox(box) {
  roundAxis(box.x);
  roundAxis(box.y);
}
function shouldAnimatePositionOnly(animationType, snapshot, layout2) {
  return animationType === "position" || animationType === "preserve-aspect" && !isNear(aspectRatio(snapshot), aspectRatio(layout2), 0.2);
}
function checkNodeWasScrollRoot(node) {
  return node !== node.root && node.scroll?.wasRoot;
}
const DocumentProjectionNode = createProjectionNode$1({
  attachResizeListener: (ref, notify) => addDomEvent(ref, "resize", notify),
  measureScroll: () => ({
    x: document.documentElement.scrollLeft || document.body?.scrollLeft || 0,
    y: document.documentElement.scrollTop || document.body?.scrollTop || 0
  }),
  checkIsScrollRoot: () => true
});
const rootProjectionNode = {
  current: void 0
};
const HTMLProjectionNode = createProjectionNode$1({
  measureScroll: (instance) => ({
    x: instance.scrollLeft,
    y: instance.scrollTop
  }),
  defaultParent: () => {
    if (!rootProjectionNode.current) {
      const documentNode = new DocumentProjectionNode({});
      documentNode.mount(window);
      documentNode.setOptions({ layoutScroll: true });
      rootProjectionNode.current = documentNode;
    }
    return rootProjectionNode.current;
  },
  resetTransform: (instance, value) => {
    instance.style.transform = value !== void 0 ? value : "none";
  },
  checkIsScrollRoot: (instance) => Boolean(window.getComputedStyle(instance).position === "fixed")
});
const MotionConfigContext = reactExports.createContext({
  transformPagePoint: (p) => p,
  isStatic: false,
  reducedMotion: "never"
});
function setRef(ref, value) {
  if (typeof ref === "function") {
    return ref(value);
  } else if (ref !== null && ref !== void 0) {
    ref.current = value;
  }
}
function composeRefs(...refs) {
  return (node) => {
    let hasCleanup = false;
    const cleanups = refs.map((ref) => {
      const cleanup = setRef(ref, node);
      if (!hasCleanup && typeof cleanup === "function") {
        hasCleanup = true;
      }
      return cleanup;
    });
    if (hasCleanup) {
      return () => {
        for (let i = 0; i < cleanups.length; i++) {
          const cleanup = cleanups[i];
          if (typeof cleanup === "function") {
            cleanup();
          } else {
            setRef(refs[i], null);
          }
        }
      };
    }
  };
}
function useComposedRefs(...refs) {
  return reactExports.useCallback(composeRefs(...refs), refs);
}
class PopChildMeasure extends reactExports.Component {
  getSnapshotBeforeUpdate(prevProps) {
    const element = this.props.childRef.current;
    if (isHTMLElement(element) && prevProps.isPresent && !this.props.isPresent && this.props.pop !== false) {
      const parent = element.offsetParent;
      const parentWidth = isHTMLElement(parent) ? parent.offsetWidth || 0 : 0;
      const parentHeight = isHTMLElement(parent) ? parent.offsetHeight || 0 : 0;
      const computedStyle = getComputedStyle(element);
      const size = this.props.sizeRef.current;
      size.height = parseFloat(computedStyle.height);
      size.width = parseFloat(computedStyle.width);
      size.top = element.offsetTop;
      size.left = element.offsetLeft;
      size.right = parentWidth - size.width - size.left;
      size.bottom = parentHeight - size.height - size.top;
    }
    return null;
  }
  /**
   * Required with getSnapshotBeforeUpdate to stop React complaining.
   */
  componentDidUpdate() {
  }
  render() {
    return this.props.children;
  }
}
function PopChild({ children, isPresent, anchorX, anchorY, root, pop }) {
  const id2 = reactExports.useId();
  const ref = reactExports.useRef(null);
  const size = reactExports.useRef({
    width: 0,
    height: 0,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  });
  const { nonce } = reactExports.useContext(MotionConfigContext);
  const childRef = children.props?.ref ?? children?.ref;
  const composedRef = useComposedRefs(ref, childRef);
  reactExports.useInsertionEffect(() => {
    const { width, height, top, left, right, bottom } = size.current;
    if (isPresent || pop === false || !ref.current || !width || !height)
      return;
    const x = anchorX === "left" ? `left: ${left}` : `right: ${right}`;
    const y = anchorY === "bottom" ? `bottom: ${bottom}` : `top: ${top}`;
    ref.current.dataset.motionPopId = id2;
    const style = document.createElement("style");
    if (nonce)
      style.nonce = nonce;
    const parent = root ?? document.head;
    parent.appendChild(style);
    if (style.sheet) {
      style.sheet.insertRule(`
          [data-motion-pop-id="${id2}"] {
            position: absolute !important;
            width: ${width}px !important;
            height: ${height}px !important;
            ${x}px !important;
            ${y}px !important;
          }
        `);
    }
    return () => {
      ref.current?.removeAttribute("data-motion-pop-id");
      if (parent.contains(style)) {
        parent.removeChild(style);
      }
    };
  }, [isPresent]);
  return jsxRuntimeExports.jsx(PopChildMeasure, { isPresent, childRef: ref, sizeRef: size, pop, children: pop === false ? children : reactExports.cloneElement(children, { ref: composedRef }) });
}
const PresenceChild = ({ children, initial, isPresent, onExitComplete, custom, presenceAffectsLayout, mode, anchorX, anchorY, root }) => {
  const presenceChildren = useConstant(newChildrenMap);
  const id2 = reactExports.useId();
  let isReusedContext = true;
  let context = reactExports.useMemo(() => {
    isReusedContext = false;
    return {
      id: id2,
      initial,
      isPresent,
      custom,
      onExitComplete: (childId) => {
        presenceChildren.set(childId, true);
        for (const isComplete of presenceChildren.values()) {
          if (!isComplete)
            return;
        }
        onExitComplete && onExitComplete();
      },
      register: (childId) => {
        presenceChildren.set(childId, false);
        return () => presenceChildren.delete(childId);
      }
    };
  }, [isPresent, presenceChildren, onExitComplete]);
  if (presenceAffectsLayout && isReusedContext) {
    context = { ...context };
  }
  reactExports.useMemo(() => {
    presenceChildren.forEach((_, key) => presenceChildren.set(key, false));
  }, [isPresent]);
  reactExports.useEffect(() => {
    !isPresent && !presenceChildren.size && onExitComplete && onExitComplete();
  }, [isPresent]);
  children = jsxRuntimeExports.jsx(PopChild, { pop: mode === "popLayout", isPresent, anchorX, anchorY, root, children });
  return jsxRuntimeExports.jsx(PresenceContext.Provider, { value: context, children });
};
function newChildrenMap() {
  return /* @__PURE__ */ new Map();
}
function usePresence(subscribe = true) {
  const context = reactExports.useContext(PresenceContext);
  if (context === null)
    return [true, null];
  const { isPresent, onExitComplete, register } = context;
  const id2 = reactExports.useId();
  reactExports.useEffect(() => {
    if (subscribe) {
      return register(id2);
    }
  }, [subscribe]);
  const safeToRemove = reactExports.useCallback(() => subscribe && onExitComplete && onExitComplete(id2), [id2, onExitComplete, subscribe]);
  return !isPresent && onExitComplete ? [false, safeToRemove] : [true];
}
const getChildKey = (child) => child.key || "";
function onlyElements(children) {
  const filtered = [];
  reactExports.Children.forEach(children, (child) => {
    if (reactExports.isValidElement(child))
      filtered.push(child);
  });
  return filtered;
}
const AnimatePresence = ({ children, custom, initial = true, onExitComplete, presenceAffectsLayout = true, mode = "sync", propagate = false, anchorX = "left", anchorY = "top", root }) => {
  const [isParentPresent, safeToRemove] = usePresence(propagate);
  const presentChildren = reactExports.useMemo(() => onlyElements(children), [children]);
  const presentKeys = propagate && !isParentPresent ? [] : presentChildren.map(getChildKey);
  const isInitialRender = reactExports.useRef(true);
  const pendingPresentChildren = reactExports.useRef(presentChildren);
  const exitComplete = useConstant(() => /* @__PURE__ */ new Map());
  const exitingComponents = reactExports.useRef(/* @__PURE__ */ new Set());
  const [diffedChildren, setDiffedChildren] = reactExports.useState(presentChildren);
  const [renderedChildren, setRenderedChildren] = reactExports.useState(presentChildren);
  useIsomorphicLayoutEffect(() => {
    isInitialRender.current = false;
    pendingPresentChildren.current = presentChildren;
    for (let i = 0; i < renderedChildren.length; i++) {
      const key = getChildKey(renderedChildren[i]);
      if (!presentKeys.includes(key)) {
        if (exitComplete.get(key) !== true) {
          exitComplete.set(key, false);
        }
      } else {
        exitComplete.delete(key);
        exitingComponents.current.delete(key);
      }
    }
  }, [renderedChildren, presentKeys.length, presentKeys.join("-")]);
  const exitingChildren = [];
  if (presentChildren !== diffedChildren) {
    let nextChildren = [...presentChildren];
    for (let i = 0; i < renderedChildren.length; i++) {
      const child = renderedChildren[i];
      const key = getChildKey(child);
      if (!presentKeys.includes(key)) {
        nextChildren.splice(i, 0, child);
        exitingChildren.push(child);
      }
    }
    if (mode === "wait" && exitingChildren.length) {
      nextChildren = exitingChildren;
    }
    setRenderedChildren(onlyElements(nextChildren));
    setDiffedChildren(presentChildren);
    return null;
  }
  const { forceRender } = reactExports.useContext(LayoutGroupContext);
  return jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: renderedChildren.map((child) => {
    const key = getChildKey(child);
    const isPresent = propagate && !isParentPresent ? false : presentChildren === renderedChildren || presentKeys.includes(key);
    const onExit = () => {
      if (exitingComponents.current.has(key)) {
        return;
      }
      if (exitComplete.has(key)) {
        exitingComponents.current.add(key);
        exitComplete.set(key, true);
      } else {
        return;
      }
      let isEveryExitComplete = true;
      exitComplete.forEach((isExitComplete) => {
        if (!isExitComplete)
          isEveryExitComplete = false;
      });
      if (isEveryExitComplete) {
        forceRender?.();
        setRenderedChildren(pendingPresentChildren.current);
        propagate && safeToRemove?.();
        onExitComplete && onExitComplete();
      }
    };
    return jsxRuntimeExports.jsx(PresenceChild, { isPresent, initial: !isInitialRender.current || initial ? void 0 : false, custom, presenceAffectsLayout, mode, root, onExitComplete: isPresent ? void 0 : onExit, anchorX, anchorY, children: child }, key);
  }) });
};
const LazyContext = reactExports.createContext({ strict: false });
const featureProps = {
  animation: [
    "animate",
    "variants",
    "whileHover",
    "whileTap",
    "exit",
    "whileInView",
    "whileFocus",
    "whileDrag"
  ],
  exit: ["exit"],
  drag: ["drag", "dragControls"],
  focus: ["whileFocus"],
  hover: ["whileHover", "onHoverStart", "onHoverEnd"],
  tap: ["whileTap", "onTap", "onTapStart", "onTapCancel"],
  pan: ["onPan", "onPanStart", "onPanSessionStart", "onPanEnd"],
  inView: ["whileInView", "onViewportEnter", "onViewportLeave"],
  layout: ["layout", "layoutId"]
};
let isInitialized = false;
function initFeatureDefinitions() {
  if (isInitialized)
    return;
  const initialFeatureDefinitions = {};
  for (const key in featureProps) {
    initialFeatureDefinitions[key] = {
      isEnabled: (props) => featureProps[key].some((name) => !!props[name])
    };
  }
  setFeatureDefinitions(initialFeatureDefinitions);
  isInitialized = true;
}
function getInitializedFeatureDefinitions() {
  initFeatureDefinitions();
  return getFeatureDefinitions();
}
function loadFeatures(features) {
  const featureDefinitions2 = getInitializedFeatureDefinitions();
  for (const key in features) {
    featureDefinitions2[key] = {
      ...featureDefinitions2[key],
      ...features[key]
    };
  }
  setFeatureDefinitions(featureDefinitions2);
}
const validMotionProps = /* @__PURE__ */ new Set([
  "animate",
  "exit",
  "variants",
  "initial",
  "style",
  "values",
  "variants",
  "transition",
  "transformTemplate",
  "custom",
  "inherit",
  "onBeforeLayoutMeasure",
  "onAnimationStart",
  "onAnimationComplete",
  "onUpdate",
  "onDragStart",
  "onDrag",
  "onDragEnd",
  "onMeasureDragConstraints",
  "onDirectionLock",
  "onDragTransitionEnd",
  "_dragX",
  "_dragY",
  "onHoverStart",
  "onHoverEnd",
  "onViewportEnter",
  "onViewportLeave",
  "globalTapTarget",
  "propagate",
  "ignoreStrict",
  "viewport"
]);
function isValidMotionProp(key) {
  return key.startsWith("while") || key.startsWith("drag") && key !== "draggable" || key.startsWith("layout") || key.startsWith("onTap") || key.startsWith("onPan") || key.startsWith("onLayout") || validMotionProps.has(key);
}
let shouldForward = (key) => !isValidMotionProp(key);
function loadExternalIsValidProp(isValidProp) {
  if (typeof isValidProp !== "function")
    return;
  shouldForward = (key) => key.startsWith("on") ? !isValidMotionProp(key) : isValidProp(key);
}
try {
  const emotionPkg = "@emotion/is-prop-valid";
  loadExternalIsValidProp(require(emotionPkg).default);
} catch {
}
function filterProps(props, isDom, forwardMotionProps) {
  const filteredProps = {};
  for (const key in props) {
    if (key === "values" && typeof props.values === "object")
      continue;
    if (isMotionValue(props[key]))
      continue;
    if (shouldForward(key) || forwardMotionProps === true && isValidMotionProp(key) || !isDom && !isValidMotionProp(key) || // If trying to use native HTML drag events, forward drag listeners
    props["draggable"] && key.startsWith("onDrag")) {
      filteredProps[key] = props[key];
    }
  }
  return filteredProps;
}
const MotionContext = /* @__PURE__ */ reactExports.createContext({});
function getCurrentTreeVariants(props, context) {
  if (isControllingVariants(props)) {
    const { initial, animate } = props;
    return {
      initial: initial === false || isVariantLabel(initial) ? initial : void 0,
      animate: isVariantLabel(animate) ? animate : void 0
    };
  }
  return props.inherit !== false ? context : {};
}
function useCreateMotionContext(props) {
  const { initial, animate } = getCurrentTreeVariants(props, reactExports.useContext(MotionContext));
  return reactExports.useMemo(() => ({ initial, animate }), [variantLabelsAsDependency(initial), variantLabelsAsDependency(animate)]);
}
function variantLabelsAsDependency(prop) {
  return Array.isArray(prop) ? prop.join(" ") : prop;
}
const createHtmlRenderState = () => ({
  style: {},
  transform: {},
  transformOrigin: {},
  vars: {}
});
function copyRawValuesOnly(target, source, props) {
  for (const key in source) {
    if (!isMotionValue(source[key]) && !isForcedMotionValue(key, props)) {
      target[key] = source[key];
    }
  }
}
function useInitialMotionValues({ transformTemplate }, visualState) {
  return reactExports.useMemo(() => {
    const state = createHtmlRenderState();
    buildHTMLStyles(state, visualState, transformTemplate);
    return Object.assign({}, state.vars, state.style);
  }, [visualState]);
}
function useStyle(props, visualState) {
  const styleProp = props.style || {};
  const style = {};
  copyRawValuesOnly(style, styleProp, props);
  Object.assign(style, useInitialMotionValues(props, visualState));
  return style;
}
function useHTMLProps(props, visualState) {
  const htmlProps = {};
  const style = useStyle(props, visualState);
  if (props.drag && props.dragListener !== false) {
    htmlProps.draggable = false;
    style.userSelect = style.WebkitUserSelect = style.WebkitTouchCallout = "none";
    style.touchAction = props.drag === true ? "none" : `pan-${props.drag === "x" ? "y" : "x"}`;
  }
  if (props.tabIndex === void 0 && (props.onTap || props.onTapStart || props.whileTap)) {
    htmlProps.tabIndex = 0;
  }
  htmlProps.style = style;
  return htmlProps;
}
const createSvgRenderState = () => ({
  ...createHtmlRenderState(),
  attrs: {}
});
function useSVGProps(props, visualState, _isStatic, Component) {
  const visualProps = reactExports.useMemo(() => {
    const state = createSvgRenderState();
    buildSVGAttrs(state, visualState, isSVGTag(Component), props.transformTemplate, props.style);
    return {
      ...state.attrs,
      style: { ...state.style }
    };
  }, [visualState]);
  if (props.style) {
    const rawStyles = {};
    copyRawValuesOnly(rawStyles, props.style, props);
    visualProps.style = { ...rawStyles, ...visualProps.style };
  }
  return visualProps;
}
const lowercaseSVGElements = [
  "animate",
  "circle",
  "defs",
  "desc",
  "ellipse",
  "g",
  "image",
  "line",
  "filter",
  "marker",
  "mask",
  "metadata",
  "path",
  "pattern",
  "polygon",
  "polyline",
  "rect",
  "stop",
  "switch",
  "symbol",
  "svg",
  "text",
  "tspan",
  "use",
  "view"
];
function isSVGComponent(Component) {
  if (
    /**
     * If it's not a string, it's a custom React component. Currently we only support
     * HTML custom React components.
     */
    typeof Component !== "string" || /**
     * If it contains a dash, the element is a custom HTML webcomponent.
     */
    Component.includes("-")
  ) {
    return false;
  } else if (
    /**
     * If it's in our list of lowercase SVG tags, it's an SVG component
     */
    lowercaseSVGElements.indexOf(Component) > -1 || /**
     * If it contains a capital letter, it's an SVG component
     */
    /[A-Z]/u.test(Component)
  ) {
    return true;
  }
  return false;
}
function useRender(Component, props, ref, { latestValues }, isStatic, forwardMotionProps = false, isSVG) {
  const useVisualProps = isSVG ?? isSVGComponent(Component) ? useSVGProps : useHTMLProps;
  const visualProps = useVisualProps(props, latestValues, isStatic, Component);
  const filteredProps = filterProps(props, typeof Component === "string", forwardMotionProps);
  const elementProps = Component !== reactExports.Fragment ? { ...filteredProps, ...visualProps, ref } : {};
  const { children } = props;
  const renderedChildren = reactExports.useMemo(() => isMotionValue(children) ? children.get() : children, [children]);
  return reactExports.createElement(Component, {
    ...elementProps,
    children: renderedChildren
  });
}
function makeState({ scrapeMotionValuesFromProps: scrapeMotionValuesFromProps2, createRenderState }, props, context, presenceContext) {
  const state = {
    latestValues: makeLatestValues(props, context, presenceContext, scrapeMotionValuesFromProps2),
    renderState: createRenderState()
  };
  return state;
}
function makeLatestValues(props, context, presenceContext, scrapeMotionValues) {
  const values = {};
  const motionValues = scrapeMotionValues(props, {});
  for (const key in motionValues) {
    values[key] = resolveMotionValue(motionValues[key]);
  }
  let { initial, animate } = props;
  const isControllingVariants$1 = isControllingVariants(props);
  const isVariantNode$1 = isVariantNode(props);
  if (context && isVariantNode$1 && !isControllingVariants$1 && props.inherit !== false) {
    if (initial === void 0)
      initial = context.initial;
    if (animate === void 0)
      animate = context.animate;
  }
  let isInitialAnimationBlocked = presenceContext ? presenceContext.initial === false : false;
  isInitialAnimationBlocked = isInitialAnimationBlocked || initial === false;
  const variantToSet = isInitialAnimationBlocked ? animate : initial;
  if (variantToSet && typeof variantToSet !== "boolean" && !isAnimationControls(variantToSet)) {
    const list = Array.isArray(variantToSet) ? variantToSet : [variantToSet];
    for (let i = 0; i < list.length; i++) {
      const resolved = resolveVariantFromProps(props, list[i]);
      if (resolved) {
        const { transitionEnd, transition, ...target } = resolved;
        for (const key in target) {
          let valueTarget = target[key];
          if (Array.isArray(valueTarget)) {
            const index = isInitialAnimationBlocked ? valueTarget.length - 1 : 0;
            valueTarget = valueTarget[index];
          }
          if (valueTarget !== null) {
            values[key] = valueTarget;
          }
        }
        for (const key in transitionEnd) {
          values[key] = transitionEnd[key];
        }
      }
    }
  }
  return values;
}
const makeUseVisualState = (config) => (props, isStatic) => {
  const context = reactExports.useContext(MotionContext);
  const presenceContext = reactExports.useContext(PresenceContext);
  const make = () => makeState(config, props, context, presenceContext);
  return isStatic ? make() : useConstant(make);
};
const useHTMLVisualState = /* @__PURE__ */ makeUseVisualState({
  scrapeMotionValuesFromProps: scrapeMotionValuesFromProps$1,
  createRenderState: createHtmlRenderState
});
const useSVGVisualState = /* @__PURE__ */ makeUseVisualState({
  scrapeMotionValuesFromProps,
  createRenderState: createSvgRenderState
});
const motionComponentSymbol = /* @__PURE__ */ Symbol.for("motionComponentSymbol");
function useMotionRef(visualState, visualElement, externalRef) {
  const externalRefContainer = reactExports.useRef(externalRef);
  reactExports.useInsertionEffect(() => {
    externalRefContainer.current = externalRef;
  });
  const refCleanup = reactExports.useRef(null);
  return reactExports.useCallback((instance) => {
    if (instance) {
      visualState.onMount?.(instance);
    }
    const ref = externalRefContainer.current;
    if (typeof ref === "function") {
      if (instance) {
        const cleanup = ref(instance);
        if (typeof cleanup === "function") {
          refCleanup.current = cleanup;
        }
      } else if (refCleanup.current) {
        refCleanup.current();
        refCleanup.current = null;
      } else {
        ref(instance);
      }
    } else if (ref) {
      ref.current = instance;
    }
    if (visualElement) {
      instance ? visualElement.mount(instance) : visualElement.unmount();
    }
  }, [visualElement]);
}
const SwitchLayoutGroupContext = reactExports.createContext({});
function isRefObject(ref) {
  return ref && typeof ref === "object" && Object.prototype.hasOwnProperty.call(ref, "current");
}
function useVisualElement(Component, visualState, props, createVisualElement, ProjectionNodeConstructor, isSVG) {
  const { visualElement: parent } = reactExports.useContext(MotionContext);
  const lazyContext = reactExports.useContext(LazyContext);
  const presenceContext = reactExports.useContext(PresenceContext);
  const motionConfig = reactExports.useContext(MotionConfigContext);
  const reducedMotionConfig = motionConfig.reducedMotion;
  const skipAnimations = motionConfig.skipAnimations;
  const visualElementRef = reactExports.useRef(null);
  const hasMountedOnce = reactExports.useRef(false);
  createVisualElement = createVisualElement || lazyContext.renderer;
  if (!visualElementRef.current && createVisualElement) {
    visualElementRef.current = createVisualElement(Component, {
      visualState,
      parent,
      props,
      presenceContext,
      blockInitialAnimation: presenceContext ? presenceContext.initial === false : false,
      reducedMotionConfig,
      skipAnimations,
      isSVG
    });
    if (hasMountedOnce.current && visualElementRef.current) {
      visualElementRef.current.manuallyAnimateOnMount = true;
    }
  }
  const visualElement = visualElementRef.current;
  const initialLayoutGroupConfig = reactExports.useContext(SwitchLayoutGroupContext);
  if (visualElement && !visualElement.projection && ProjectionNodeConstructor && (visualElement.type === "html" || visualElement.type === "svg")) {
    createProjectionNode(visualElementRef.current, props, ProjectionNodeConstructor, initialLayoutGroupConfig);
  }
  const isMounted = reactExports.useRef(false);
  reactExports.useInsertionEffect(() => {
    if (visualElement && isMounted.current) {
      visualElement.update(props, presenceContext);
    }
  });
  const optimisedAppearId = props[optimizedAppearDataAttribute];
  const wantsHandoff = reactExports.useRef(Boolean(optimisedAppearId) && typeof window !== "undefined" && !window.MotionHandoffIsComplete?.(optimisedAppearId) && window.MotionHasOptimisedAnimation?.(optimisedAppearId));
  useIsomorphicLayoutEffect(() => {
    hasMountedOnce.current = true;
    if (!visualElement)
      return;
    isMounted.current = true;
    window.MotionIsMounted = true;
    visualElement.updateFeatures();
    visualElement.scheduleRenderMicrotask();
    if (wantsHandoff.current && visualElement.animationState) {
      visualElement.animationState.animateChanges();
    }
  });
  reactExports.useEffect(() => {
    if (!visualElement)
      return;
    if (!wantsHandoff.current && visualElement.animationState) {
      visualElement.animationState.animateChanges();
    }
    if (wantsHandoff.current) {
      queueMicrotask(() => {
        window.MotionHandoffMarkAsComplete?.(optimisedAppearId);
      });
      wantsHandoff.current = false;
    }
    visualElement.enteringChildren = void 0;
  });
  return visualElement;
}
function createProjectionNode(visualElement, props, ProjectionNodeConstructor, initialPromotionConfig) {
  const { layoutId, layout: layout2, drag: drag2, dragConstraints, layoutScroll, layoutRoot, layoutAnchor, layoutCrossfade } = props;
  visualElement.projection = new ProjectionNodeConstructor(visualElement.latestValues, props["data-framer-portal-id"] ? void 0 : getClosestProjectingNode(visualElement.parent));
  visualElement.projection.setOptions({
    layoutId,
    layout: layout2,
    alwaysMeasureLayout: Boolean(drag2) || dragConstraints && isRefObject(dragConstraints),
    visualElement,
    /**
     * TODO: Update options in an effect. This could be tricky as it'll be too late
     * to update by the time layout animations run.
     * We also need to fix this safeToRemove by linking it up to the one returned by usePresence,
     * ensuring it gets called if there's no potential layout animations.
     *
     */
    animationType: typeof layout2 === "string" ? layout2 : "both",
    initialPromotionConfig,
    crossfade: layoutCrossfade,
    layoutScroll,
    layoutRoot,
    layoutAnchor
  });
}
function getClosestProjectingNode(visualElement) {
  if (!visualElement)
    return void 0;
  return visualElement.options.allowProjection !== false ? visualElement.projection : getClosestProjectingNode(visualElement.parent);
}
function createMotionComponent(Component, { forwardMotionProps = false, type } = {}, preloadedFeatures, createVisualElement) {
  preloadedFeatures && loadFeatures(preloadedFeatures);
  const isSVG = type ? type === "svg" : isSVGComponent(Component);
  const useVisualState = isSVG ? useSVGVisualState : useHTMLVisualState;
  function MotionDOMComponent(props, externalRef) {
    let MeasureLayout2;
    const configAndProps = {
      ...reactExports.useContext(MotionConfigContext),
      ...props,
      layoutId: useLayoutId(props)
    };
    const { isStatic } = configAndProps;
    const context = useCreateMotionContext(props);
    const visualState = useVisualState(props, isStatic);
    if (!isStatic && typeof window !== "undefined") {
      useStrictMode();
      const layoutProjection = getProjectionFunctionality(configAndProps);
      MeasureLayout2 = layoutProjection.MeasureLayout;
      context.visualElement = useVisualElement(Component, visualState, configAndProps, createVisualElement, layoutProjection.ProjectionNode, isSVG);
    }
    return jsxRuntimeExports.jsxs(MotionContext.Provider, { value: context, children: [MeasureLayout2 && context.visualElement ? jsxRuntimeExports.jsx(MeasureLayout2, { visualElement: context.visualElement, ...configAndProps }) : null, useRender(Component, props, useMotionRef(visualState, context.visualElement, externalRef), visualState, isStatic, forwardMotionProps, isSVG)] });
  }
  MotionDOMComponent.displayName = `motion.${typeof Component === "string" ? Component : `create(${Component.displayName ?? Component.name ?? ""})`}`;
  const ForwardRefMotionComponent = reactExports.forwardRef(MotionDOMComponent);
  ForwardRefMotionComponent[motionComponentSymbol] = Component;
  return ForwardRefMotionComponent;
}
function useLayoutId({ layoutId }) {
  const layoutGroupId = reactExports.useContext(LayoutGroupContext).id;
  return layoutGroupId && layoutId !== void 0 ? layoutGroupId + "-" + layoutId : layoutId;
}
function useStrictMode(configAndProps, preloadedFeatures) {
  reactExports.useContext(LazyContext).strict;
}
function getProjectionFunctionality(props) {
  const featureDefinitions2 = getInitializedFeatureDefinitions();
  const { drag: drag2, layout: layout2 } = featureDefinitions2;
  if (!drag2 && !layout2)
    return {};
  const combined = { ...drag2, ...layout2 };
  return {
    MeasureLayout: drag2?.isEnabled(props) || layout2?.isEnabled(props) ? combined.MeasureLayout : void 0,
    ProjectionNode: combined.ProjectionNode
  };
}
function createMotionProxy(preloadedFeatures, createVisualElement) {
  if (typeof Proxy === "undefined") {
    return createMotionComponent;
  }
  const componentCache = /* @__PURE__ */ new Map();
  const factory = (Component, options) => {
    return createMotionComponent(Component, options, preloadedFeatures, createVisualElement);
  };
  const deprecatedFactoryFunction = (Component, options) => {
    return factory(Component, options);
  };
  return new Proxy(deprecatedFactoryFunction, {
    /**
     * Called when `motion` is referenced with a prop: `motion.div`, `motion.input` etc.
     * The prop name is passed through as `key` and we can use that to generate a `motion`
     * DOM component with that name.
     */
    get: (_target, key) => {
      if (key === "create")
        return factory;
      if (!componentCache.has(key)) {
        componentCache.set(key, createMotionComponent(key, void 0, preloadedFeatures, createVisualElement));
      }
      return componentCache.get(key);
    }
  });
}
const createDomVisualElement = (Component, options) => {
  const isSVG = options.isSVG ?? isSVGComponent(Component);
  return isSVG ? new SVGVisualElement(options) : new HTMLVisualElement(options, {
    allowProjection: Component !== reactExports.Fragment
  });
};
class AnimationFeature extends Feature {
  /**
   * We dynamically generate the AnimationState manager as it contains a reference
   * to the underlying animation library. We only want to load that if we load this,
   * so people can optionally code split it out using the `m` component.
   */
  constructor(node) {
    super(node);
    node.animationState || (node.animationState = createAnimationState(node));
  }
  updateAnimationControlsSubscription() {
    const { animate } = this.node.getProps();
    if (isAnimationControls(animate)) {
      this.unmountControls = animate.subscribe(this.node);
    }
  }
  /**
   * Subscribe any provided AnimationControls to the component's VisualElement
   */
  mount() {
    this.updateAnimationControlsSubscription();
  }
  update() {
    const { animate } = this.node.getProps();
    const { animate: prevAnimate } = this.node.prevProps || {};
    if (animate !== prevAnimate) {
      this.updateAnimationControlsSubscription();
    }
  }
  unmount() {
    this.node.animationState.reset();
    this.unmountControls?.();
  }
}
let id = 0;
class ExitAnimationFeature extends Feature {
  constructor() {
    super(...arguments);
    this.id = id++;
    this.isExitComplete = false;
  }
  update() {
    if (!this.node.presenceContext)
      return;
    const { isPresent, onExitComplete } = this.node.presenceContext;
    const { isPresent: prevIsPresent } = this.node.prevPresenceContext || {};
    if (!this.node.animationState || isPresent === prevIsPresent) {
      return;
    }
    if (isPresent && prevIsPresent === false) {
      if (this.isExitComplete) {
        const { initial, custom } = this.node.getProps();
        if (typeof initial === "string") {
          const resolved = resolveVariant(this.node, initial, custom);
          if (resolved) {
            const { transition, transitionEnd, ...target } = resolved;
            for (const key in target) {
              this.node.getValue(key)?.jump(target[key]);
            }
          }
        }
        this.node.animationState.reset();
        this.node.animationState.animateChanges();
      } else {
        this.node.animationState.setActive("exit", false);
      }
      this.isExitComplete = false;
      return;
    }
    const exitAnimation = this.node.animationState.setActive("exit", !isPresent);
    if (onExitComplete && !isPresent) {
      exitAnimation.then(() => {
        this.isExitComplete = true;
        onExitComplete(this.id);
      });
    }
  }
  mount() {
    const { register, onExitComplete } = this.node.presenceContext || {};
    if (onExitComplete) {
      onExitComplete(this.id);
    }
    if (register) {
      this.unmount = register(this.id);
    }
  }
  unmount() {
  }
}
const animations = {
  animation: {
    Feature: AnimationFeature
  },
  exit: {
    Feature: ExitAnimationFeature
  }
};
function extractEventInfo(event) {
  return {
    point: {
      x: event.pageX,
      y: event.pageY
    }
  };
}
const addPointerInfo = (handler) => (event) => isPrimaryPointer(event) && handler(event, extractEventInfo(event));
function addPointerEvent(target, eventName, handler, options) {
  return addDomEvent(target, eventName, addPointerInfo(handler), options);
}
const getContextWindow = ({ current }) => {
  return current ? current.ownerDocument.defaultView : null;
};
const distance = (a, b) => Math.abs(a - b);
function distance2D(a, b) {
  const xDelta = distance(a.x, b.x);
  const yDelta = distance(a.y, b.y);
  return Math.sqrt(xDelta ** 2 + yDelta ** 2);
}
const overflowStyles = /* @__PURE__ */ new Set(["auto", "scroll"]);
class PanSession {
  constructor(event, handlers, { transformPagePoint, contextWindow = window, dragSnapToOrigin = false, distanceThreshold = 3, element } = {}) {
    this.startEvent = null;
    this.lastMoveEvent = null;
    this.lastMoveEventInfo = null;
    this.lastRawMoveEventInfo = null;
    this.handlers = {};
    this.contextWindow = window;
    this.scrollPositions = /* @__PURE__ */ new Map();
    this.removeScrollListeners = null;
    this.onElementScroll = (event2) => {
      this.handleScroll(event2.target);
    };
    this.onWindowScroll = () => {
      this.handleScroll(window);
    };
    this.updatePoint = () => {
      if (!(this.lastMoveEvent && this.lastMoveEventInfo))
        return;
      if (this.lastRawMoveEventInfo) {
        this.lastMoveEventInfo = transformPoint(this.lastRawMoveEventInfo, this.transformPagePoint);
      }
      const info2 = getPanInfo(this.lastMoveEventInfo, this.history);
      const isPanStarted = this.startEvent !== null;
      const isDistancePastThreshold = distance2D(info2.offset, { x: 0, y: 0 }) >= this.distanceThreshold;
      if (!isPanStarted && !isDistancePastThreshold)
        return;
      const { point: point2 } = info2;
      const { timestamp: timestamp2 } = frameData;
      this.history.push({ ...point2, timestamp: timestamp2 });
      const { onStart, onMove } = this.handlers;
      if (!isPanStarted) {
        onStart && onStart(this.lastMoveEvent, info2);
        this.startEvent = this.lastMoveEvent;
      }
      onMove && onMove(this.lastMoveEvent, info2);
    };
    this.handlePointerMove = (event2, info2) => {
      this.lastMoveEvent = event2;
      this.lastRawMoveEventInfo = info2;
      this.lastMoveEventInfo = transformPoint(info2, this.transformPagePoint);
      frame.update(this.updatePoint, true);
    };
    this.handlePointerUp = (event2, info2) => {
      this.end();
      const { onEnd, onSessionEnd, resumeAnimation } = this.handlers;
      if (this.dragSnapToOrigin || !this.startEvent) {
        resumeAnimation && resumeAnimation();
      }
      if (!(this.lastMoveEvent && this.lastMoveEventInfo))
        return;
      const panInfo = getPanInfo(event2.type === "pointercancel" ? this.lastMoveEventInfo : transformPoint(info2, this.transformPagePoint), this.history);
      if (this.startEvent && onEnd) {
        onEnd(event2, panInfo);
      }
      onSessionEnd && onSessionEnd(event2, panInfo);
    };
    if (!isPrimaryPointer(event))
      return;
    this.dragSnapToOrigin = dragSnapToOrigin;
    this.handlers = handlers;
    this.transformPagePoint = transformPagePoint;
    this.distanceThreshold = distanceThreshold;
    this.contextWindow = contextWindow || window;
    const info = extractEventInfo(event);
    const initialInfo = transformPoint(info, this.transformPagePoint);
    const { point } = initialInfo;
    const { timestamp } = frameData;
    this.history = [{ ...point, timestamp }];
    const { onSessionStart } = handlers;
    onSessionStart && onSessionStart(event, getPanInfo(initialInfo, this.history));
    this.removeListeners = pipe(addPointerEvent(this.contextWindow, "pointermove", this.handlePointerMove), addPointerEvent(this.contextWindow, "pointerup", this.handlePointerUp), addPointerEvent(this.contextWindow, "pointercancel", this.handlePointerUp));
    if (element) {
      this.startScrollTracking(element);
    }
  }
  /**
   * Start tracking scroll on ancestors and window.
   */
  startScrollTracking(element) {
    let current = element.parentElement;
    while (current) {
      const style = getComputedStyle(current);
      if (overflowStyles.has(style.overflowX) || overflowStyles.has(style.overflowY)) {
        this.scrollPositions.set(current, {
          x: current.scrollLeft,
          y: current.scrollTop
        });
      }
      current = current.parentElement;
    }
    this.scrollPositions.set(window, {
      x: window.scrollX,
      y: window.scrollY
    });
    window.addEventListener("scroll", this.onElementScroll, {
      capture: true
    });
    window.addEventListener("scroll", this.onWindowScroll);
    this.removeScrollListeners = () => {
      window.removeEventListener("scroll", this.onElementScroll, {
        capture: true
      });
      window.removeEventListener("scroll", this.onWindowScroll);
    };
  }
  /**
   * Handle scroll compensation during drag.
   *
   * For element scroll: adjusts history origin since pageX/pageY doesn't change.
   * For window scroll: adjusts lastMoveEventInfo since pageX/pageY would change.
   */
  handleScroll(target) {
    const initial = this.scrollPositions.get(target);
    if (!initial)
      return;
    const isWindow = target === window;
    const current = isWindow ? { x: window.scrollX, y: window.scrollY } : {
      x: target.scrollLeft,
      y: target.scrollTop
    };
    const delta = { x: current.x - initial.x, y: current.y - initial.y };
    if (delta.x === 0 && delta.y === 0)
      return;
    if (isWindow) {
      if (this.lastMoveEventInfo) {
        this.lastMoveEventInfo.point.x += delta.x;
        this.lastMoveEventInfo.point.y += delta.y;
      }
    } else {
      if (this.history.length > 0) {
        this.history[0].x -= delta.x;
        this.history[0].y -= delta.y;
      }
    }
    this.scrollPositions.set(target, current);
    frame.update(this.updatePoint, true);
  }
  updateHandlers(handlers) {
    this.handlers = handlers;
  }
  end() {
    this.removeListeners && this.removeListeners();
    this.removeScrollListeners && this.removeScrollListeners();
    this.scrollPositions.clear();
    cancelFrame(this.updatePoint);
  }
}
function transformPoint(info, transformPagePoint) {
  return transformPagePoint ? { point: transformPagePoint(info.point) } : info;
}
function subtractPoint(a, b) {
  return { x: a.x - b.x, y: a.y - b.y };
}
function getPanInfo({ point }, history) {
  return {
    point,
    delta: subtractPoint(point, lastDevicePoint(history)),
    offset: subtractPoint(point, startDevicePoint(history)),
    velocity: getVelocity(history, 0.1)
  };
}
function startDevicePoint(history) {
  return history[0];
}
function lastDevicePoint(history) {
  return history[history.length - 1];
}
function getVelocity(history, timeDelta) {
  if (history.length < 2) {
    return { x: 0, y: 0 };
  }
  let i = history.length - 1;
  let timestampedPoint = null;
  const lastPoint = lastDevicePoint(history);
  while (i >= 0) {
    timestampedPoint = history[i];
    if (lastPoint.timestamp - timestampedPoint.timestamp > /* @__PURE__ */ secondsToMilliseconds(timeDelta)) {
      break;
    }
    i--;
  }
  if (!timestampedPoint) {
    return { x: 0, y: 0 };
  }
  if (timestampedPoint === history[0] && history.length > 2 && lastPoint.timestamp - timestampedPoint.timestamp > /* @__PURE__ */ secondsToMilliseconds(timeDelta) * 2) {
    timestampedPoint = history[1];
  }
  const time2 = /* @__PURE__ */ millisecondsToSeconds(lastPoint.timestamp - timestampedPoint.timestamp);
  if (time2 === 0) {
    return { x: 0, y: 0 };
  }
  const currentVelocity = {
    x: (lastPoint.x - timestampedPoint.x) / time2,
    y: (lastPoint.y - timestampedPoint.y) / time2
  };
  if (currentVelocity.x === Infinity) {
    currentVelocity.x = 0;
  }
  if (currentVelocity.y === Infinity) {
    currentVelocity.y = 0;
  }
  return currentVelocity;
}
function applyConstraints(point, { min, max }, elastic) {
  if (min !== void 0 && point < min) {
    point = elastic ? mixNumber$1(min, point, elastic.min) : Math.max(point, min);
  } else if (max !== void 0 && point > max) {
    point = elastic ? mixNumber$1(max, point, elastic.max) : Math.min(point, max);
  }
  return point;
}
function calcRelativeAxisConstraints(axis, min, max) {
  return {
    min: min !== void 0 ? axis.min + min : void 0,
    max: max !== void 0 ? axis.max + max - (axis.max - axis.min) : void 0
  };
}
function calcRelativeConstraints(layoutBox, { top, left, bottom, right }) {
  return {
    x: calcRelativeAxisConstraints(layoutBox.x, left, right),
    y: calcRelativeAxisConstraints(layoutBox.y, top, bottom)
  };
}
function calcViewportAxisConstraints(layoutAxis, constraintsAxis) {
  let min = constraintsAxis.min - layoutAxis.min;
  let max = constraintsAxis.max - layoutAxis.max;
  if (constraintsAxis.max - constraintsAxis.min < layoutAxis.max - layoutAxis.min) {
    [min, max] = [max, min];
  }
  return { min, max };
}
function calcViewportConstraints(layoutBox, constraintsBox) {
  return {
    x: calcViewportAxisConstraints(layoutBox.x, constraintsBox.x),
    y: calcViewportAxisConstraints(layoutBox.y, constraintsBox.y)
  };
}
function calcOrigin(source, target) {
  let origin = 0.5;
  const sourceLength = calcLength(source);
  const targetLength = calcLength(target);
  if (targetLength > sourceLength) {
    origin = /* @__PURE__ */ progress(target.min, target.max - sourceLength, source.min);
  } else if (sourceLength > targetLength) {
    origin = /* @__PURE__ */ progress(source.min, source.max - targetLength, target.min);
  }
  return clamp(0, 1, origin);
}
function rebaseAxisConstraints(layout2, constraints) {
  const relativeConstraints = {};
  if (constraints.min !== void 0) {
    relativeConstraints.min = constraints.min - layout2.min;
  }
  if (constraints.max !== void 0) {
    relativeConstraints.max = constraints.max - layout2.min;
  }
  return relativeConstraints;
}
const defaultElastic = 0.35;
function resolveDragElastic(dragElastic = defaultElastic) {
  if (dragElastic === false) {
    dragElastic = 0;
  } else if (dragElastic === true) {
    dragElastic = defaultElastic;
  }
  return {
    x: resolveAxisElastic(dragElastic, "left", "right"),
    y: resolveAxisElastic(dragElastic, "top", "bottom")
  };
}
function resolveAxisElastic(dragElastic, minLabel, maxLabel) {
  return {
    min: resolvePointElastic(dragElastic, minLabel),
    max: resolvePointElastic(dragElastic, maxLabel)
  };
}
function resolvePointElastic(dragElastic, label) {
  return typeof dragElastic === "number" ? dragElastic : dragElastic[label] || 0;
}
const elementDragControls = /* @__PURE__ */ new WeakMap();
class VisualElementDragControls {
  constructor(visualElement) {
    this.openDragLock = null;
    this.isDragging = false;
    this.currentDirection = null;
    this.originPoint = { x: 0, y: 0 };
    this.constraints = false;
    this.hasMutatedConstraints = false;
    this.elastic = createBox();
    this.latestPointerEvent = null;
    this.latestPanInfo = null;
    this.visualElement = visualElement;
  }
  start(originEvent, { snapToCursor = false, distanceThreshold } = {}) {
    const { presenceContext } = this.visualElement;
    if (presenceContext && presenceContext.isPresent === false)
      return;
    const onSessionStart = (event) => {
      if (snapToCursor) {
        this.snapToCursor(extractEventInfo(event).point);
      }
      this.stopAnimation();
    };
    const onStart = (event, info) => {
      const { drag: drag2, dragPropagation, onDragStart } = this.getProps();
      if (drag2 && !dragPropagation) {
        if (this.openDragLock)
          this.openDragLock();
        this.openDragLock = setDragLock(drag2);
        if (!this.openDragLock)
          return;
      }
      this.latestPointerEvent = event;
      this.latestPanInfo = info;
      this.isDragging = true;
      this.currentDirection = null;
      this.resolveConstraints();
      if (this.visualElement.projection) {
        this.visualElement.projection.isAnimationBlocked = true;
        this.visualElement.projection.target = void 0;
      }
      eachAxis((axis) => {
        let current = this.getAxisMotionValue(axis).get() || 0;
        if (percent.test(current)) {
          const { projection } = this.visualElement;
          if (projection && projection.layout) {
            const measuredAxis = projection.layout.layoutBox[axis];
            if (measuredAxis) {
              const length = calcLength(measuredAxis);
              current = length * (parseFloat(current) / 100);
            }
          }
        }
        this.originPoint[axis] = current;
      });
      if (onDragStart) {
        frame.update(() => onDragStart(event, info), false, true);
      }
      addValueToWillChange(this.visualElement, "transform");
      const { animationState } = this.visualElement;
      animationState && animationState.setActive("whileDrag", true);
    };
    const onMove = (event, info) => {
      this.latestPointerEvent = event;
      this.latestPanInfo = info;
      const { dragPropagation, dragDirectionLock, onDirectionLock, onDrag } = this.getProps();
      if (!dragPropagation && !this.openDragLock)
        return;
      const { offset } = info;
      if (dragDirectionLock && this.currentDirection === null) {
        this.currentDirection = getCurrentDirection(offset);
        if (this.currentDirection !== null) {
          onDirectionLock && onDirectionLock(this.currentDirection);
        }
        return;
      }
      this.updateAxis("x", info.point, offset);
      this.updateAxis("y", info.point, offset);
      this.visualElement.render();
      if (onDrag) {
        frame.update(() => onDrag(event, info), false, true);
      }
    };
    const onSessionEnd = (event, info) => {
      this.latestPointerEvent = event;
      this.latestPanInfo = info;
      this.stop(event, info);
      this.latestPointerEvent = null;
      this.latestPanInfo = null;
    };
    const resumeAnimation = () => {
      const { dragSnapToOrigin: snap } = this.getProps();
      if (snap || this.constraints) {
        this.startAnimation({ x: 0, y: 0 });
      }
    };
    const { dragSnapToOrigin } = this.getProps();
    this.panSession = new PanSession(originEvent, {
      onSessionStart,
      onStart,
      onMove,
      onSessionEnd,
      resumeAnimation
    }, {
      transformPagePoint: this.visualElement.getTransformPagePoint(),
      dragSnapToOrigin,
      distanceThreshold,
      contextWindow: getContextWindow(this.visualElement),
      element: this.visualElement.current
    });
  }
  /**
   * @internal
   */
  stop(event, panInfo) {
    const finalEvent = event || this.latestPointerEvent;
    const finalPanInfo = panInfo || this.latestPanInfo;
    const isDragging2 = this.isDragging;
    this.cancel();
    if (!isDragging2 || !finalPanInfo || !finalEvent)
      return;
    const { velocity } = finalPanInfo;
    this.startAnimation(velocity);
    const { onDragEnd } = this.getProps();
    if (onDragEnd) {
      frame.postRender(() => onDragEnd(finalEvent, finalPanInfo));
    }
  }
  /**
   * @internal
   */
  cancel() {
    this.isDragging = false;
    const { projection, animationState } = this.visualElement;
    if (projection) {
      projection.isAnimationBlocked = false;
    }
    this.endPanSession();
    const { dragPropagation } = this.getProps();
    if (!dragPropagation && this.openDragLock) {
      this.openDragLock();
      this.openDragLock = null;
    }
    animationState && animationState.setActive("whileDrag", false);
  }
  /**
   * Clean up the pan session without modifying other drag state.
   * This is used during unmount to ensure event listeners are removed
   * without affecting projection animations or drag locks.
   * @internal
   */
  endPanSession() {
    this.panSession && this.panSession.end();
    this.panSession = void 0;
  }
  updateAxis(axis, _point, offset) {
    const { drag: drag2 } = this.getProps();
    if (!offset || !shouldDrag(axis, drag2, this.currentDirection))
      return;
    const axisValue = this.getAxisMotionValue(axis);
    let next = this.originPoint[axis] + offset[axis];
    if (this.constraints && this.constraints[axis]) {
      next = applyConstraints(next, this.constraints[axis], this.elastic[axis]);
    }
    axisValue.set(next);
  }
  resolveConstraints() {
    const { dragConstraints, dragElastic } = this.getProps();
    const layout2 = this.visualElement.projection && !this.visualElement.projection.layout ? this.visualElement.projection.measure(false) : this.visualElement.projection?.layout;
    const prevConstraints = this.constraints;
    if (dragConstraints && isRefObject(dragConstraints)) {
      if (!this.constraints) {
        this.constraints = this.resolveRefConstraints();
      }
    } else {
      if (dragConstraints && layout2) {
        this.constraints = calcRelativeConstraints(layout2.layoutBox, dragConstraints);
      } else {
        this.constraints = false;
      }
    }
    this.elastic = resolveDragElastic(dragElastic);
    if (prevConstraints !== this.constraints && !isRefObject(dragConstraints) && layout2 && this.constraints && !this.hasMutatedConstraints) {
      eachAxis((axis) => {
        if (this.constraints !== false && this.getAxisMotionValue(axis)) {
          this.constraints[axis] = rebaseAxisConstraints(layout2.layoutBox[axis], this.constraints[axis]);
        }
      });
    }
  }
  resolveRefConstraints() {
    const { dragConstraints: constraints, onMeasureDragConstraints } = this.getProps();
    if (!constraints || !isRefObject(constraints))
      return false;
    const constraintsElement = constraints.current;
    const { projection } = this.visualElement;
    if (!projection || !projection.layout)
      return false;
    const constraintsBox = measurePageBox(constraintsElement, projection.root, this.visualElement.getTransformPagePoint());
    let measuredConstraints = calcViewportConstraints(projection.layout.layoutBox, constraintsBox);
    if (onMeasureDragConstraints) {
      const userConstraints = onMeasureDragConstraints(convertBoxToBoundingBox(measuredConstraints));
      this.hasMutatedConstraints = !!userConstraints;
      if (userConstraints) {
        measuredConstraints = convertBoundingBoxToBox(userConstraints);
      }
    }
    return measuredConstraints;
  }
  startAnimation(velocity) {
    const { drag: drag2, dragMomentum, dragElastic, dragTransition, dragSnapToOrigin, onDragTransitionEnd } = this.getProps();
    const constraints = this.constraints || {};
    const momentumAnimations = eachAxis((axis) => {
      if (!shouldDrag(axis, drag2, this.currentDirection)) {
        return;
      }
      let transition = constraints && constraints[axis] || {};
      if (dragSnapToOrigin === true || dragSnapToOrigin === axis)
        transition = { min: 0, max: 0 };
      const bounceStiffness = dragElastic ? 200 : 1e6;
      const bounceDamping = dragElastic ? 40 : 1e7;
      const inertia2 = {
        type: "inertia",
        velocity: dragMomentum ? velocity[axis] : 0,
        bounceStiffness,
        bounceDamping,
        timeConstant: 750,
        restDelta: 1,
        restSpeed: 10,
        ...dragTransition,
        ...transition
      };
      return this.startAxisValueAnimation(axis, inertia2);
    });
    return Promise.all(momentumAnimations).then(onDragTransitionEnd);
  }
  startAxisValueAnimation(axis, transition) {
    const axisValue = this.getAxisMotionValue(axis);
    addValueToWillChange(this.visualElement, axis);
    return axisValue.start(animateMotionValue(axis, axisValue, 0, transition, this.visualElement, false));
  }
  stopAnimation() {
    eachAxis((axis) => this.getAxisMotionValue(axis).stop());
  }
  /**
   * Drag works differently depending on which props are provided.
   *
   * - If _dragX and _dragY are provided, we output the gesture delta directly to those motion values.
   * - Otherwise, we apply the delta to the x/y motion values.
   */
  getAxisMotionValue(axis) {
    const dragKey = `_drag${axis.toUpperCase()}`;
    const props = this.visualElement.getProps();
    const externalMotionValue = props[dragKey];
    return externalMotionValue ? externalMotionValue : this.visualElement.getValue(axis, (props.initial ? props.initial[axis] : void 0) || 0);
  }
  snapToCursor(point) {
    eachAxis((axis) => {
      const { drag: drag2 } = this.getProps();
      if (!shouldDrag(axis, drag2, this.currentDirection))
        return;
      const { projection } = this.visualElement;
      const axisValue = this.getAxisMotionValue(axis);
      if (projection && projection.layout) {
        const { min, max } = projection.layout.layoutBox[axis];
        const current = axisValue.get() || 0;
        axisValue.set(point[axis] - mixNumber$1(min, max, 0.5) + current);
      }
    });
  }
  /**
   * When the viewport resizes we want to check if the measured constraints
   * have changed and, if so, reposition the element within those new constraints
   * relative to where it was before the resize.
   */
  scalePositionWithinConstraints() {
    if (!this.visualElement.current)
      return;
    const { drag: drag2, dragConstraints } = this.getProps();
    const { projection } = this.visualElement;
    if (!isRefObject(dragConstraints) || !projection || !this.constraints)
      return;
    this.stopAnimation();
    const boxProgress = { x: 0, y: 0 };
    eachAxis((axis) => {
      const axisValue = this.getAxisMotionValue(axis);
      if (axisValue && this.constraints !== false) {
        const latest = axisValue.get();
        boxProgress[axis] = calcOrigin({ min: latest, max: latest }, this.constraints[axis]);
      }
    });
    const { transformTemplate } = this.visualElement.getProps();
    this.visualElement.current.style.transform = transformTemplate ? transformTemplate({}, "") : "none";
    projection.root && projection.root.updateScroll();
    projection.updateLayout();
    this.constraints = false;
    this.resolveConstraints();
    eachAxis((axis) => {
      if (!shouldDrag(axis, drag2, null))
        return;
      const axisValue = this.getAxisMotionValue(axis);
      const { min, max } = this.constraints[axis];
      axisValue.set(mixNumber$1(min, max, boxProgress[axis]));
    });
    this.visualElement.render();
  }
  addListeners() {
    if (!this.visualElement.current)
      return;
    elementDragControls.set(this.visualElement, this);
    const element = this.visualElement.current;
    const stopPointerListener = addPointerEvent(element, "pointerdown", (event) => {
      const { drag: drag2, dragListener = true } = this.getProps();
      const target = event.target;
      const isClickingTextInputChild = target !== element && isElementTextInput(target);
      if (drag2 && dragListener && !isClickingTextInputChild) {
        this.start(event);
      }
    });
    let stopResizeObservers;
    const measureDragConstraints = () => {
      const { dragConstraints } = this.getProps();
      if (isRefObject(dragConstraints) && dragConstraints.current) {
        this.constraints = this.resolveRefConstraints();
        if (!stopResizeObservers) {
          stopResizeObservers = startResizeObservers(element, dragConstraints.current, () => this.scalePositionWithinConstraints());
        }
      }
    };
    const { projection } = this.visualElement;
    const stopMeasureLayoutListener = projection.addEventListener("measure", measureDragConstraints);
    if (projection && !projection.layout) {
      projection.root && projection.root.updateScroll();
      projection.updateLayout();
    }
    frame.read(measureDragConstraints);
    const stopResizeListener = addDomEvent(window, "resize", () => this.scalePositionWithinConstraints());
    const stopLayoutUpdateListener = projection.addEventListener("didUpdate", (({ delta, hasLayoutChanged }) => {
      if (this.isDragging && hasLayoutChanged) {
        eachAxis((axis) => {
          const motionValue2 = this.getAxisMotionValue(axis);
          if (!motionValue2)
            return;
          this.originPoint[axis] += delta[axis].translate;
          motionValue2.set(motionValue2.get() + delta[axis].translate);
        });
        this.visualElement.render();
      }
    }));
    return () => {
      stopResizeListener();
      stopPointerListener();
      stopMeasureLayoutListener();
      stopLayoutUpdateListener && stopLayoutUpdateListener();
      stopResizeObservers && stopResizeObservers();
    };
  }
  getProps() {
    const props = this.visualElement.getProps();
    const { drag: drag2 = false, dragDirectionLock = false, dragPropagation = false, dragConstraints = false, dragElastic = defaultElastic, dragMomentum = true } = props;
    return {
      ...props,
      drag: drag2,
      dragDirectionLock,
      dragPropagation,
      dragConstraints,
      dragElastic,
      dragMomentum
    };
  }
}
function skipFirstCall(callback) {
  let isFirst = true;
  return () => {
    if (isFirst) {
      isFirst = false;
      return;
    }
    callback();
  };
}
function startResizeObservers(element, constraintsElement, onResize) {
  const stopElement = resize(element, skipFirstCall(onResize));
  const stopContainer = resize(constraintsElement, skipFirstCall(onResize));
  return () => {
    stopElement();
    stopContainer();
  };
}
function shouldDrag(direction, drag2, currentDirection) {
  return (drag2 === true || drag2 === direction) && (currentDirection === null || currentDirection === direction);
}
function getCurrentDirection(offset, lockThreshold = 10) {
  let direction = null;
  if (Math.abs(offset.y) > lockThreshold) {
    direction = "y";
  } else if (Math.abs(offset.x) > lockThreshold) {
    direction = "x";
  }
  return direction;
}
class DragGesture extends Feature {
  constructor(node) {
    super(node);
    this.removeGroupControls = noop;
    this.removeListeners = noop;
    this.controls = new VisualElementDragControls(node);
  }
  mount() {
    const { dragControls } = this.node.getProps();
    if (dragControls) {
      this.removeGroupControls = dragControls.subscribe(this.controls);
    }
    this.removeListeners = this.controls.addListeners() || noop;
  }
  update() {
    const { dragControls } = this.node.getProps();
    const { dragControls: prevDragControls } = this.node.prevProps || {};
    if (dragControls !== prevDragControls) {
      this.removeGroupControls();
      if (dragControls) {
        this.removeGroupControls = dragControls.subscribe(this.controls);
      }
    }
  }
  unmount() {
    this.removeGroupControls();
    this.removeListeners();
    if (!this.controls.isDragging) {
      this.controls.endPanSession();
    }
  }
}
const asyncHandler = (handler) => (event, info) => {
  if (handler) {
    frame.update(() => handler(event, info), false, true);
  }
};
class PanGesture extends Feature {
  constructor() {
    super(...arguments);
    this.removePointerDownListener = noop;
  }
  onPointerDown(pointerDownEvent) {
    this.session = new PanSession(pointerDownEvent, this.createPanHandlers(), {
      transformPagePoint: this.node.getTransformPagePoint(),
      contextWindow: getContextWindow(this.node)
    });
  }
  createPanHandlers() {
    const { onPanSessionStart, onPanStart, onPan, onPanEnd } = this.node.getProps();
    return {
      onSessionStart: asyncHandler(onPanSessionStart),
      onStart: asyncHandler(onPanStart),
      onMove: asyncHandler(onPan),
      onEnd: (event, info) => {
        delete this.session;
        if (onPanEnd) {
          frame.postRender(() => onPanEnd(event, info));
        }
      }
    };
  }
  mount() {
    this.removePointerDownListener = addPointerEvent(this.node.current, "pointerdown", (event) => this.onPointerDown(event));
  }
  update() {
    this.session && this.session.updateHandlers(this.createPanHandlers());
  }
  unmount() {
    this.removePointerDownListener();
    this.session && this.session.end();
  }
}
let hasTakenAnySnapshot = false;
class MeasureLayoutWithContext extends reactExports.Component {
  /**
   * This only mounts projection nodes for components that
   * need measuring, we might want to do it for all components
   * in order to incorporate transforms
   */
  componentDidMount() {
    const { visualElement, layoutGroup, switchLayoutGroup, layoutId } = this.props;
    const { projection } = visualElement;
    if (projection) {
      if (layoutGroup.group)
        layoutGroup.group.add(projection);
      if (switchLayoutGroup && switchLayoutGroup.register && layoutId) {
        switchLayoutGroup.register(projection);
      }
      if (hasTakenAnySnapshot) {
        projection.root.didUpdate();
      }
      projection.addEventListener("animationComplete", () => {
        this.safeToRemove();
      });
      projection.setOptions({
        ...projection.options,
        layoutDependency: this.props.layoutDependency,
        onExitComplete: () => this.safeToRemove()
      });
    }
    globalProjectionState.hasEverUpdated = true;
  }
  getSnapshotBeforeUpdate(prevProps) {
    const { layoutDependency, visualElement, drag: drag2, isPresent } = this.props;
    const { projection } = visualElement;
    if (!projection)
      return null;
    projection.isPresent = isPresent;
    if (prevProps.layoutDependency !== layoutDependency) {
      projection.setOptions({
        ...projection.options,
        layoutDependency
      });
    }
    hasTakenAnySnapshot = true;
    if (drag2 || prevProps.layoutDependency !== layoutDependency || layoutDependency === void 0 || prevProps.isPresent !== isPresent) {
      projection.willUpdate();
    } else {
      this.safeToRemove();
    }
    if (prevProps.isPresent !== isPresent) {
      if (isPresent) {
        projection.promote();
      } else if (!projection.relegate()) {
        frame.postRender(() => {
          const stack = projection.getStack();
          if (!stack || !stack.members.length) {
            this.safeToRemove();
          }
        });
      }
    }
    return null;
  }
  componentDidUpdate() {
    const { visualElement, layoutAnchor } = this.props;
    const { projection } = visualElement;
    if (projection) {
      projection.options.layoutAnchor = layoutAnchor;
      projection.root.didUpdate();
      microtask.postRender(() => {
        if (!projection.currentAnimation && projection.isLead()) {
          this.safeToRemove();
        }
      });
    }
  }
  componentWillUnmount() {
    const { visualElement, layoutGroup, switchLayoutGroup: promoteContext } = this.props;
    const { projection } = visualElement;
    hasTakenAnySnapshot = true;
    if (projection) {
      projection.scheduleCheckAfterUnmount();
      if (layoutGroup && layoutGroup.group)
        layoutGroup.group.remove(projection);
      if (promoteContext && promoteContext.deregister)
        promoteContext.deregister(projection);
    }
  }
  safeToRemove() {
    const { safeToRemove } = this.props;
    safeToRemove && safeToRemove();
  }
  render() {
    return null;
  }
}
function MeasureLayout(props) {
  const [isPresent, safeToRemove] = usePresence();
  const layoutGroup = reactExports.useContext(LayoutGroupContext);
  return jsxRuntimeExports.jsx(MeasureLayoutWithContext, { ...props, layoutGroup, switchLayoutGroup: reactExports.useContext(SwitchLayoutGroupContext), isPresent, safeToRemove });
}
const drag = {
  pan: {
    Feature: PanGesture
  },
  drag: {
    Feature: DragGesture,
    ProjectionNode: HTMLProjectionNode,
    MeasureLayout
  }
};
function handleHoverEvent(node, event, lifecycle) {
  const { props } = node;
  if (node.animationState && props.whileHover) {
    node.animationState.setActive("whileHover", lifecycle === "Start");
  }
  const eventName = "onHover" + lifecycle;
  const callback = props[eventName];
  if (callback) {
    frame.postRender(() => callback(event, extractEventInfo(event)));
  }
}
class HoverGesture extends Feature {
  mount() {
    const { current } = this.node;
    if (!current)
      return;
    this.unmount = hover(current, (_element, startEvent) => {
      handleHoverEvent(this.node, startEvent, "Start");
      return (endEvent) => handleHoverEvent(this.node, endEvent, "End");
    });
  }
  unmount() {
  }
}
class FocusGesture extends Feature {
  constructor() {
    super(...arguments);
    this.isActive = false;
  }
  onFocus() {
    let isFocusVisible = false;
    try {
      isFocusVisible = this.node.current.matches(":focus-visible");
    } catch (e) {
      isFocusVisible = true;
    }
    if (!isFocusVisible || !this.node.animationState)
      return;
    this.node.animationState.setActive("whileFocus", true);
    this.isActive = true;
  }
  onBlur() {
    if (!this.isActive || !this.node.animationState)
      return;
    this.node.animationState.setActive("whileFocus", false);
    this.isActive = false;
  }
  mount() {
    this.unmount = pipe(addDomEvent(this.node.current, "focus", () => this.onFocus()), addDomEvent(this.node.current, "blur", () => this.onBlur()));
  }
  unmount() {
  }
}
function handlePressEvent(node, event, lifecycle) {
  const { props } = node;
  if (node.current instanceof HTMLButtonElement && node.current.disabled) {
    return;
  }
  if (node.animationState && props.whileTap) {
    node.animationState.setActive("whileTap", lifecycle === "Start");
  }
  const eventName = "onTap" + (lifecycle === "End" ? "" : lifecycle);
  const callback = props[eventName];
  if (callback) {
    frame.postRender(() => callback(event, extractEventInfo(event)));
  }
}
class PressGesture extends Feature {
  mount() {
    const { current } = this.node;
    if (!current)
      return;
    const { globalTapTarget, propagate } = this.node.props;
    this.unmount = press(current, (_element, startEvent) => {
      handlePressEvent(this.node, startEvent, "Start");
      return (endEvent, { success }) => handlePressEvent(this.node, endEvent, success ? "End" : "Cancel");
    }, {
      useGlobalTarget: globalTapTarget,
      stopPropagation: propagate?.tap === false
    });
  }
  unmount() {
  }
}
const observerCallbacks = /* @__PURE__ */ new WeakMap();
const observers = /* @__PURE__ */ new WeakMap();
const fireObserverCallback = (entry) => {
  const callback = observerCallbacks.get(entry.target);
  callback && callback(entry);
};
const fireAllObserverCallbacks = (entries) => {
  entries.forEach(fireObserverCallback);
};
function initIntersectionObserver({ root, ...options }) {
  const lookupRoot = root || document;
  if (!observers.has(lookupRoot)) {
    observers.set(lookupRoot, {});
  }
  const rootObservers = observers.get(lookupRoot);
  const key = JSON.stringify(options);
  if (!rootObservers[key]) {
    rootObservers[key] = new IntersectionObserver(fireAllObserverCallbacks, { root, ...options });
  }
  return rootObservers[key];
}
function observeIntersection(element, options, callback) {
  const rootInteresectionObserver = initIntersectionObserver(options);
  observerCallbacks.set(element, callback);
  rootInteresectionObserver.observe(element);
  return () => {
    observerCallbacks.delete(element);
    rootInteresectionObserver.unobserve(element);
  };
}
const thresholdNames = {
  some: 0,
  all: 1
};
class InViewFeature extends Feature {
  constructor() {
    super(...arguments);
    this.hasEnteredView = false;
    this.isInView = false;
  }
  startObserver() {
    this.stopObserver?.();
    const { viewport = {} } = this.node.getProps();
    const { root, margin: rootMargin, amount = "some", once } = viewport;
    const options = {
      root: root ? root.current : void 0,
      rootMargin,
      threshold: typeof amount === "number" ? amount : thresholdNames[amount]
    };
    const onIntersectionUpdate = (entry) => {
      const { isIntersecting } = entry;
      if (this.isInView === isIntersecting)
        return;
      this.isInView = isIntersecting;
      if (once && !isIntersecting && this.hasEnteredView) {
        return;
      } else if (isIntersecting) {
        this.hasEnteredView = true;
      }
      if (this.node.animationState) {
        this.node.animationState.setActive("whileInView", isIntersecting);
      }
      const { onViewportEnter, onViewportLeave } = this.node.getProps();
      const callback = isIntersecting ? onViewportEnter : onViewportLeave;
      callback && callback(entry);
    };
    this.stopObserver = observeIntersection(this.node.current, options, onIntersectionUpdate);
  }
  mount() {
    this.startObserver();
  }
  update() {
    if (typeof IntersectionObserver === "undefined")
      return;
    const { props, prevProps } = this.node;
    const hasOptionsChanged = ["amount", "margin", "root"].some(hasViewportOptionChanged(props, prevProps));
    if (hasOptionsChanged) {
      this.startObserver();
    }
  }
  unmount() {
    this.stopObserver?.();
    this.hasEnteredView = false;
    this.isInView = false;
  }
}
function hasViewportOptionChanged({ viewport = {} }, { viewport: prevViewport = {} } = {}) {
  return (name) => viewport[name] !== prevViewport[name];
}
const gestureAnimations = {
  inView: {
    Feature: InViewFeature
  },
  tap: {
    Feature: PressGesture
  },
  focus: {
    Feature: FocusGesture
  },
  hover: {
    Feature: HoverGesture
  }
};
const layout = {
  layout: {
    ProjectionNode: HTMLProjectionNode,
    MeasureLayout
  }
};
const featureBundle = {
  ...animations,
  ...gestureAnimations,
  ...drag,
  ...layout
};
const motion = /* @__PURE__ */ createMotionProxy(featureBundle, createDomVisualElement);
const mergeClasses = (...classes) => classes.filter((className, index, array) => {
  return Boolean(className) && className.trim() !== "" && array.indexOf(className) === index;
}).join(" ").trim();
const toKebabCase = (string) => string.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
const toCamelCase = (string) => string.replace(
  /^([A-Z])|[\s-_]+(\w)/g,
  (match, p1, p2) => p2 ? p2.toUpperCase() : p1.toLowerCase()
);
const toPascalCase = (string) => {
  const camelCase = toCamelCase(string);
  return camelCase.charAt(0).toUpperCase() + camelCase.slice(1);
};
var defaultAttributes = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round"
};
const hasA11yProp = (props) => {
  for (const prop in props) {
    if (prop.startsWith("aria-") || prop === "role" || prop === "title") {
      return true;
    }
  }
  return false;
};
const Icon = reactExports.forwardRef(
  ({
    color: color2 = "currentColor",
    size = 24,
    strokeWidth = 2,
    absoluteStrokeWidth,
    className = "",
    children,
    iconNode,
    ...rest
  }, ref) => reactExports.createElement(
    "svg",
    {
      ref,
      ...defaultAttributes,
      width: size,
      height: size,
      stroke: color2,
      strokeWidth: absoluteStrokeWidth ? Number(strokeWidth) * 24 / Number(size) : strokeWidth,
      className: mergeClasses("lucide", className),
      ...!children && !hasA11yProp(rest) && { "aria-hidden": "true" },
      ...rest
    },
    [
      ...iconNode.map(([tag, attrs]) => reactExports.createElement(tag, attrs)),
      ...Array.isArray(children) ? children : [children]
    ]
  )
);
const createLucideIcon = (iconName, iconNode) => {
  const Component = reactExports.forwardRef(
    ({ className, ...props }, ref) => reactExports.createElement(Icon, {
      ref,
      iconNode,
      className: mergeClasses(
        `lucide-${toKebabCase(toPascalCase(iconName))}`,
        `lucide-${iconName}`,
        className
      ),
      ...props
    })
  );
  Component.displayName = toPascalCase(iconName);
  return Component;
};
const __iconNode$2 = [
  ["path", { d: "M5 12h14", key: "1ays0h" }],
  ["path", { d: "M12 5v14", key: "s699le" }]
];
const Plus = createLucideIcon("plus", __iconNode$2);
const __iconNode$1 = [
  ["path", { d: "M12 2v13", key: "1km8f5" }],
  ["path", { d: "m16 6-4-4-4 4", key: "13yo43" }],
  ["path", { d: "M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8", key: "1b2hhj" }]
];
const Share = createLucideIcon("share", __iconNode$1);
const __iconNode = [
  ["path", { d: "M18 6 6 18", key: "1bl5f8" }],
  ["path", { d: "m6 6 12 12", key: "d8bk6v" }]
];
const X = createLucideIcon("x", __iconNode);
function detectPlatform() {
  if (typeof navigator === "undefined") return null;
  const ua = navigator.userAgent;
  if (/iphone|ipad|ipod/i.test(ua)) return "ios";
  if (/android/i.test(ua)) return "android";
  return null;
}
function isStandalone() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(display-mode: standalone)").matches || "standalone" in window.navigator && window.navigator.standalone === true;
}
function InstallBanner() {
  const [visible, setVisible] = reactExports.useState(false);
  const [platform, setPlatform] = reactExports.useState(null);
  const [deferredPrompt, setDeferredPrompt] = reactExports.useState(null);
  reactExports.useEffect(() => {
    if (isStandalone()) return;
    if (sessionStorage.getItem("install-dismissed")) return;
    const p = detectPlatform();
    setPlatform(p);
    if (p === "android") {
      const handler = (e) => {
        e.preventDefault();
        setDeferredPrompt(e);
        setVisible(true);
      };
      window.addEventListener("beforeinstallprompt", handler);
      return () => window.removeEventListener("beforeinstallprompt", handler);
    }
    if (p === "ios") {
      const t = setTimeout(() => setVisible(true), 3e3);
      return () => clearTimeout(t);
    }
  }, []);
  const dismiss = () => {
    sessionStorage.setItem("install-dismissed", "1");
    setVisible(false);
  };
  const install = async () => {
    if (deferredPrompt?.prompt) {
      deferredPrompt.prompt();
    }
    dismiss();
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: visible && /* @__PURE__ */ jsxRuntimeExports.jsx(
    motion.div,
    {
      initial: { y: 120, opacity: 0 },
      animate: { y: 0, opacity: 1 },
      exit: { y: 120, opacity: 0 },
      transition: { type: "spring", damping: 20, stiffness: 200 },
      className: "fixed bottom-20 inset-x-3 z-50 rounded-2xl border border-border shadow-2xl",
      style: { background: "oklch(0.20 0.04 262)", boxShadow: "0 0 40px rgba(34,211,238,0.15)" },
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3 p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "/favicon.png", alt: "", className: "h-12 w-12 rounded-xl shrink-0" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-bold text-sm text-foreground", children: "Instalar 3D Body Scan" }),
          platform === "ios" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-1 text-xs text-muted-foreground leading-relaxed", children: [
            "Abra no ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-foreground", children: "Safari" }),
            ", toque em",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(Share, { className: "inline h-3.5 w-3.5 text-blue-400" }),
            " e selecione",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-foreground", children: '"Adicionar à Tela Inicial"' })
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs text-muted-foreground", children: "Instale para acesso rápido e tela cheia sem barra do browser." }),
          platform === "android" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: install,
              className: "mt-2 flex items-center gap-1.5 rounded-xl bg-gradient-primary px-3 py-1.5 text-xs font-bold text-primary-foreground",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3.5 w-3.5" }),
                " Instalar agora"
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: dismiss, className: "shrink-0 rounded-full p-1 text-muted-foreground hover:text-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" }) })
      ] })
    }
  ) });
}
const appCss = "/assets/styles-BnlS9jVq.css";
const siteUrl = "https://zyrox.app";
const previewImage = "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/9b8986db-6a4c-499c-a7c2-163470809a3f/id-preview-ebe8a614--2615779a-270e-4fcf-bd98-70b8371b1978.lovable.app-1778172039316.png";
const seoTitle = "3D Body Scan | Treino com IA para musculação, calistenia e híbrido";
const seoDescription = "3D Body Scan é a plataforma fitness com IA para musculação, calistenia, treino híbrido, evolução corporal e personalização inteligente do treino.";
const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: "3D Body Scan",
      url: siteUrl,
      logo: `${siteUrl}/favicon.png`,
      image: previewImage,
      sameAs: []
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: "3D Body Scan",
      description: seoDescription,
      publisher: { "@id": `${siteUrl}/#organization` },
      inLanguage: ["pt-BR", "es", "en", "fr", "de"]
    },
    {
      "@type": "WebApplication",
      "@id": `${siteUrl}/#webapp`,
      name: "3D Body Scan",
      url: siteUrl,
      applicationCategory: "HealthApplication",
      operatingSystem: "Web",
      image: previewImage,
      description: seoDescription,
      inLanguage: ["pt-BR", "es", "en", "fr", "de"],
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD"
      },
      publisher: { "@id": `${siteUrl}/#organization` },
      featureList: [
        "Treinos personalizados com IA",
        "Musculação, calistenia e treino híbrido",
        "Análise corporal e evolução",
        "Biblioteca de exercícios",
        "Analytics e progressão de treino"
      ]
    }
  ]
};
function NotFoundComponent() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-7xl font-bold text-gradient-primary", children: "404" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-4 text-xl font-semibold text-foreground", children: "P\\u00E1gina n\\u00E3o encontrada" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "A p\\u00E1gina que voc\\u00EA procura n\\u00E3o existe ou foi movida." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Link,
      {
        to: "/",
        className: "inline-flex items-center justify-center rounded-2xl bg-gradient-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow-primary transition hover:opacity-90",
        children: "Voltar ao in\\u00EDcio"
      }
    ) })
  ] }) });
}
function ErrorComponent({ error, reset }) {
  console.error(error);
  const router2 = useRouter();
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-semibold tracking-tight text-foreground", children: "Algo deu errado" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: error.message }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 flex flex-wrap justify-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => {
            router2.invalidate();
            reset();
          },
          className: "rounded-2xl bg-gradient-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground",
          children: "Tentar novamente"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "a",
        {
          href: "/",
          className: "rounded-2xl border border-border bg-surface px-5 py-2.5 text-sm font-medium text-foreground",
          children: "In\\u00EDcio"
        }
      )
    ] })
  ] }) });
}
const Route$n = createRootRouteWithContext()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover, interactive-widget=resizes-visual" },
      { name: "theme-color", content: "#070B14" },
      { name: "mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-title", content: "3D Body Scan" },
      { name: "apple-mobile-web-app-status-bar-style", content: "black-translucent" },
      { title: seoTitle },
      { name: "description", content: seoDescription },
      { name: "robots", content: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" },
      { property: "og:site_name", content: "3D Body Scan" },
      { property: "og:title", content: seoTitle },
      { property: "og:description", content: seoDescription },
      { property: "og:type", content: "website" },
      { property: "og:url", content: siteUrl },
      { property: "og:image", content: previewImage },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: "3D Body Scan — Treino com IA" },
      { property: "og:locale", content: "pt_BR" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: seoTitle },
      { name: "twitter:description", content: seoDescription },
      { name: "twitter:image", content: previewImage }
    ],
    links: [
      { rel: "canonical", href: siteUrl },
      { rel: "stylesheet", href: appCss },
      { rel: "icon", type: "image/png", href: "/favicon.png" },
      { rel: "manifest", href: "/manifest.json" },
      { rel: "apple-touch-icon", href: "/favicon.png" },
      { rel: "apple-touch-icon", sizes: "180x180", href: "/favicon.png" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap"
      }
    ]
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent
});
function RootShell({ children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("html", { lang: "pt-BR", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("head", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(HeadContent, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "script",
        {
          type: "application/ld+json",
          dangerouslySetInnerHTML: { __html: JSON.stringify(structuredData) }
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("body", { children: [
      children,
      /* @__PURE__ */ jsxRuntimeExports.jsx(Scripts, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx("script", { dangerouslySetInnerHTML: { __html: `if('serviceWorker' in navigator){navigator.serviceWorker.register('/sw.js')}` } })
    ] })
  ] });
}
function useAppHeight() {
  reactExports.useEffect(() => {
    const set = () => document.documentElement.style.setProperty("--app-height", `${window.innerHeight}px`);
    set();
    let lastWidth = window.innerWidth;
    const onResize = () => {
      if (window.innerWidth !== lastWidth) {
        lastWidth = window.innerWidth;
        set();
      }
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
}
function RootComponent() {
  const { queryClient } = Route$n.useRouteContext();
  useAppHeight();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(QueryClientProvider, { client: queryClient, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(InstallBanner, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Toaster,
      {
        theme: "dark",
        position: "bottom-center",
        toastOptions: {
          style: { background: "oklch(0.24 0.04 262)", border: "1px solid oklch(0.30 0.04 262)", color: "oklch(0.98 0.01 250)" }
        }
      }
    )
  ] });
}
const $$splitComponentImporter$i = () => import("./recuperar-senha-SMEAey-p.js");
const Route$m = createFileRoute("/recuperar-senha")({
  head: () => ({
    meta: [{
      title: "Recuperar Senha | 3D Body Scan"
    }, {
      name: "description",
      content: "Recuperacao local de senha no ambiente 3D Body Scan."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$i, "component")
});
const $$splitComponentImporter$h = () => import("./paywall-BxbUefW4.js");
const Route$l = createFileRoute("/paywall")({
  head: () => ({
    meta: [{
      title: "Seu Plano Está Pronto | 3D Body Scan"
    }, {
      name: "description",
      content: "A IA criou seu plano exclusivo de evolução corporal."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$h, "component")
});
const $$splitComponentImporter$g = () => import("./onboarding-BoZC2xM2.js");
const Route$k = createFileRoute("/onboarding")({
  head: () => ({
    meta: [{
      title: "Onboarding · 3D Body Scan"
    }, {
      name: "description",
      content: "Configuração inteligente do seu plano fitness 3D Body Scan."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$g, "component")
});
const $$splitComponentImporter$f = () => import("./criar-conta-BYjeKRCy.js");
const Route$j = createFileRoute("/criar-conta")({
  head: () => ({
    meta: [{
      title: "Criar Conta | 3D Body Scan"
    }, {
      name: "description",
      content: "Crie sua conta local 3D Body Scan e inicie seu onboarding."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$f, "component")
});
const $$splitComponentImporter$e = () => import("./app-AcPCnwSa.js");
const Route$i = createFileRoute("/app")({
  head: () => ({
    meta: [{
      title: "3D Body Scan | Dashboard"
    }, {
      name: "description",
      content: "Seu painel de evolucao 3D Body Scan."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$e, "component")
});
const $$splitComponentImporter$d = () => import("./index-0het0lnJ.js");
const Route$h = createFileRoute("/")({
  head: () => ({
    meta: [{
      title: "Entrar | 3D Body Scan"
    }, {
      name: "description",
      content: "Acesse sua conta 3D Body Scan e continue sua evolucao."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$d, "component")
});
const $$splitComponentImporter$c = () => import("./onboarding.index-COTe0ydn.js");
const Route$g = createFileRoute("/onboarding/")({
  component: lazyRouteComponent($$splitComponentImporter$c, "component")
});
const $$splitComponentImporter$b = () => import("./app.index-CSWqf55s.js");
const Route$f = createFileRoute("/app/")({
  head: () => ({
    meta: [{
      title: "Início | 3D Body Scan"
    }, {
      name: "description",
      content: "Resumo de treinos, IA e progresso."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$b, "component")
});
const $$splitComponentImporter$a = () => import("./onboarding._step-x3k4IuO7.js");
const Route$e = createFileRoute("/onboarding/$step")({
  component: lazyRouteComponent($$splitComponentImporter$a, "component")
});
const $$splitComponentImporter$9 = () => import("./app.treinos-D3syAPit.js");
const Route$d = createFileRoute("/app/treinos")({
  head: () => ({
    meta: [{
      title: "Treinos | 3D Body Scan"
    }, {
      name: "description",
      content: "Sua semana de treinos organizada pela IA."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
const $$splitComponentImporter$8 = () => import("./app.perfil-DMM-tY0I.js");
const Route$c = createFileRoute("/app/perfil")({
  head: () => ({
    meta: [{
      title: "Perfil | 3D Body Scan"
    }, {
      name: "description",
      content: "Sua jornada, contexto e configurações do motor."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
const $$splitComponentImporter$7 = () => import("./app.nutricao-CNkuUYie.js");
const Route$b = createFileRoute("/app/nutricao")({
  head: () => ({
    meta: [{
      title: "Plano Alimentar | 3D Body Scan"
    }, {
      name: "description",
      content: "Seu plano alimentar personalizado de 12 semanas."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
const $$splitComponentImporter$6 = () => import("./app.exercicios-DA8mmmkT.js");
const Route$a = createFileRoute("/app/exercicios")({
  head: () => ({
    meta: [{
      title: "Biblioteca | 3D Body Scan"
    }, {
      name: "description",
      content: "Biblioteca de exercícios com biomecânica, instruções e substituições."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
const $$splitComponentImporter$5 = () => import("./app.corpo-BQaIcoUH.js");
const Route$9 = createFileRoute("/app/corpo")({
  head: () => ({
    meta: [{
      title: "3D Body Scan | Scan Corporal IA"
    }, {
      name: "description",
      content: "Scan corporal 3D com IA — medidas, composição e evolução do corpo em tempo real."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
const $$splitComponentImporter$4 = () => import("./app.configuracoes-ByHOFed1.js");
const Route$8 = createFileRoute("/app/configuracoes")({
  head: () => ({
    meta: [{
      title: "Configurações | 3D Body Scan"
    }, {
      name: "description",
      content: "Preferências, privacidade e ajustes do app."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
const $$splitComponentImporter$3 = () => import("./app.analytics-tfxZZubD.js");
const Route$7 = createFileRoute("/app/analytics")({
  head: () => ({
    meta: [{
      title: "Analytics | 3D Body Scan"
    }, {
      name: "description",
      content: "Training analytics, muscle balance, recovery and consistency."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
const GOAL_LABEL$1 = {
  mass: "ganho de massa muscular",
  strength: "força máxima",
  hybrid: "hipertrofia + força",
  athletic: "performance atlética",
  weight_loss: "perda de peso",
  definition: "definição muscular",
  endurance: "resistência",
  wellness: "saúde e bem-estar"
};
const Route$6 = createFileRoute("/api/meal-plan")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { profile, locale = "pt", regenerationId, avoidFoods = [] } = await request.json();
        const key = process.env.OPENAI_API_KEY;
        const goalLabel = GOAL_LABEL$1[profile.goal] ?? profile.goal;
        const bmr = profile.gender === "female" ? 655 + 9.6 * profile.weight + 1.8 * profile.height - 4.7 * profile.age : 88.4 + 13.4 * profile.weight + 4.8 * profile.height - 5.7 * profile.age;
        const tdee = Math.round(bmr * 1.55);
        const variationSeed = regenerationId ?? crypto.randomUUID();
        const avoidList = avoidFoods.slice(0, 35).join(", ");
        const fallbackPlan = () => buildFallbackMealPlan(profile, locale, variationSeed);
        if (!key) {
          return jsonResponse(fallbackPlan());
        }
        const prompt = `Você é um nutricionista esportivo de elite. Crie SOMENTE um plano alimentar de 12 semanas personalizado.

IMPORTANTE:
- Isto NÃO é treino.
- NÃO escreva exercícios, séries, repetições, descanso, workout, treino, aquecimento ou blocos de musculação.
- A resposta deve conter apenas refeições, alimentos, calorias e macros.
- O idioma da resposta deve seguir este locale: ${locale}.

PERFIL:
- Objetivo: ${goalLabel}
- Peso: ${profile.weight}kg | Altura: ${profile.height}cm | Idade: ${profile.age} anos
- Gênero: ${profile.gender === "female" ? "Feminino" : profile.gender === "male" ? "Masculino" : "Outro"}
- Tipo de dieta: ${profile.dietType || "onívoro"}
- Metabolismo: ${profile.metabolismType || "balanceado"}
- TDEE estimado: ${tdee} kcal/dia
${profile.name ? `- Nome: ${profile.name}` : ""}
- Seed obrigatório de variação: ${variationSeed}
${avoidList ? `- Evite repetir estes alimentos do plano anterior, exceto se forem essenciais: ${avoidList}` : ""}

REGRAS:
- Semanas 1-4: fase de adaptação (calorias base)
- Semanas 5-8: fase de desenvolvimento (+5-10% calorias se ganho de massa, -5% se perda)
- Semanas 9-12: fase de otimização/pico
- Proteína: mínimo 1.8g/kg de peso corporal
- O plano deve parecer uma prescrição profissional de nutricionista: estratégia, ajuste calórico, timing, hidratação, adesão, lista de compras e substituições.
- Cada refeição deve ter nome criativo, 2-5 alimentos, calorias e macros
- O "tip" deve ser uma dica prática e específica para aquela semana
- Cada semana deve ter 7 dias com refeições diferentes. Não use o mesmo cardápio de segunda a domingo.
- Varie fontes de proteína, carboidratos, gorduras e vegetais entre os dias e entre as semanas.
- Não repita a mesma combinação de alimentos em dias seguidos.
- Ao regenerar, crie um plano visivelmente diferente usando o seed de variação.
- "weekFocus" deve falar de nutrição, exemplo: calorias, proteína, hidratação, adesão alimentar.
- "tip" deve ser uma dica alimentar prática. Nunca dica de treino.

Responda SOMENTE com JSON válido neste formato exato:
{
  "weeks": [
    {
      "week": 1,
      "phase": "adaptacao",
      "weekFocus": "string curta (ex: Adaptação e controle calórico)",
      "strategy": "estratégia nutricional profissional da semana em 1 frase",
      "dailyCalories": número,
      "calorieAdjustment": "ex: manutenção técnica, déficit leve, superávit controlado",
      "macros": {"protein": número, "carbs": número, "fat": número},
      "macroStrategy": "como distribuir proteína, carboidrato e gordura ao longo do dia",
      "breakfast": {"name": "string", "foods": ["alimento1","alimento2","alimento3"], "calories": número, "protein": número, "carbs": número, "fat": número},
      "morningSnack": {"name": "string", "foods": ["alimento1","alimento2"], "calories": número, "protein": número, "carbs": número, "fat": número},
      "lunch": {"name": "string", "foods": ["alimento1","alimento2","alimento3","alimento4"], "calories": número, "protein": número, "carbs": número, "fat": número},
      "preWorkout": {"name": "string", "foods": ["alimento1","alimento2"], "calories": número, "protein": número, "carbs": número, "fat": número},
      "dinner": {"name": "string", "foods": ["alimento1","alimento2","alimento3"], "calories": número, "protein": número, "carbs": número, "fat": número},
      "tip": "string",
      "hydrationTarget": "meta prática de água/eletrólitos da semana",
      "mealTiming": "orientação de horários e pré/pós-treino",
      "adherenceGoal": "meta simples de adesão da semana",
      "groceryFocus": ["item de compra 1","item de compra 2","item de compra 3","item de compra 4"],
      "swapOptions": ["troca alimentar 1","troca alimentar 2","troca alimentar 3"],
      "days": [
        {
          "day": 0,
          "breakfast": {"name": "string", "foods": ["alimento1","alimento2"], "calories": número, "protein": número, "carbs": número, "fat": número},
          "morningSnack": {"name": "string", "foods": ["alimento1","alimento2"], "calories": número, "protein": número, "carbs": número, "fat": número},
          "lunch": {"name": "string", "foods": ["alimento1","alimento2","alimento3"], "calories": número, "protein": número, "carbs": número, "fat": número},
          "preWorkout": {"name": "string", "foods": ["alimento1","alimento2"], "calories": número, "protein": número, "carbs": número, "fat": número},
          "dinner": {"name": "string", "foods": ["alimento1","alimento2","alimento3"], "calories": número, "protein": número, "carbs": número, "fat": número}
        }
      ]
    }
  ]
}
Gere as 12 semanas completas. Se couber, em cada semana, "days" deve ter exatamente 7 itens, com day de 0 a 6.`;
        try {
          const res = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${key}`,
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              model: OPENAI_MODEL,
              messages: [
                {
                  role: "system",
                  content: "Você é um nutricionista esportivo especializado. Responda APENAS com JSON válido, sem markdown, sem explicações."
                },
                { role: "user", content: prompt }
              ],
              max_tokens: 7e3,
              temperature: 0.95,
              response_format: { type: "json_object" }
            })
          });
          if (!res.ok) {
            return jsonResponse(fallbackPlan());
          }
          const json = await res.json();
          const content = json.choices?.[0]?.message?.content;
          if (!content) {
            return jsonResponse(fallbackPlan());
          }
          const parsed = JSON.parse(content);
          const weeks = normalizeMealPlanWeeks(parsed.weeks, profile, variationSeed);
          if (parsed.workouts || !isValidMealPlanWeeks(weeks)) {
            return jsonResponse(fallbackPlan());
          }
          return jsonResponse({
            version: 2,
            generatedAt: (/* @__PURE__ */ new Date()).toISOString(),
            locale,
            weeks
          });
        } catch {
          return jsonResponse(fallbackPlan());
        }
      }
    }
  }
});
function jsonResponse(body) {
  return new Response(JSON.stringify(body), {
    headers: { "Content-Type": "application/json" }
  });
}
function isNumber(value) {
  return typeof value === "number" && Number.isFinite(value);
}
function isMeal(value) {
  if (!value || typeof value !== "object") return false;
  const meal = value;
  return typeof meal.name === "string" && Array.isArray(meal.foods) && meal.foods.length >= 2 && meal.foods.every((food) => typeof food === "string") && isNumber(meal.calories) && isNumber(meal.protein) && isNumber(meal.carbs) && isNumber(meal.fat);
}
function cloneMeal(meal) {
  return {
    name: meal.name,
    foods: [...meal.foods],
    calories: meal.calories,
    protein: meal.protein,
    carbs: meal.carbs,
    fat: meal.fat
  };
}
const proteinRotations = [
  ["ovos", "iogurte grego", "frango grelhado", "tilapia", "patinho moido"],
  ["claras", "cottage", "atum", "salmão", "tofu"],
  ["whey protein", "queijo minas", "peru", "carne magra", "lentilha"],
  ["omelete", "kefir", "frango desfiado", "merluza", "grão-de-bico"]
];
const carbRotations = [
  ["aveia", "banana", "arroz integral", "batata doce", "mandioca"],
  ["pão integral", "mamão", "quinoa", "inhame", "macarrão integral"],
  ["tapioca", "maçã", "feijão", "abóbora", "cuscuz"],
  ["granola sem açúcar", "morango", "arroz parboilizado", "batata inglesa", "lentilha"]
];
const fatRotations = [
  ["pasta de amendoim", "castanhas", "azeite de oliva", "abacate", "sementes"],
  ["chia", "nozes", "azeite extra virgem", "tahine", "linhaça"],
  ["queijo cottage", "amêndoas", "azeitonas", "gema de ovo", "castanha-do-pará"],
  ["iogurte natural", "amendoim", "óleo de coco", "sardinha", "gergelim"]
];
const vegetableRotations = [
  ["brócolis", "salada verde", "abobrinha", "cenoura"],
  ["espinafre", "rúcula", "pepino", "tomate"],
  ["couve", "aspargos", "berinjela", "beterraba"],
  ["vagem", "alface", "repolho", "chuchu"]
];
function hashString$2(value) {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = Math.imul(31, hash) + value.charCodeAt(i) | 0;
  }
  return Math.abs(hash);
}
function pickRotation(items, seed, day) {
  return items[(seed + day) % items.length];
}
function buildMealVariant(base, mealKey, week, day, seed) {
  const protein = pickRotation(proteinRotations, seed + week, day);
  const carbs = pickRotation(carbRotations, seed + week * 3, day);
  const fats = pickRotation(fatRotations, seed + week * 5, day);
  const veggies = pickRotation(vegetableRotations, seed + week * 7, day);
  const shift = (week + day + seed) % 5;
  const foodsByMeal = {
    breakfast: [protein[shift % protein.length], carbs[0], fats[0]],
    morningSnack: [protein[1], carbs[1], fats[1]],
    lunch: [protein[2], carbs[2], veggies[day % veggies.length], fats[2]],
    preWorkout: [carbs[3], protein[3]],
    dinner: [protein[3], veggies[(day + 1) % veggies.length], carbs[4], fats[3]]
  };
  const mealNames = {
    breakfast: ["Café Proteico", "Manhã de Energia", "Base Matinal", "Início Forte"],
    morningSnack: ["Snack Leve", "Pausa Proteica", "Lanche Funcional", "Reforço da Manhã"],
    lunch: ["Almoço Completo", "Prato de Performance", "Almoço Equilibrado", "Base do Dia"],
    preWorkout: ["Combustível Pré-Treino", "Energia Sustentada", "Pré-Treino Leve", "Carga de Energia"],
    dinner: ["Jantar de Recuperação", "Noite Leve", "Final Nutritivo", "Jantar Equilibrado"]
  };
  return {
    ...cloneMeal(base),
    name: mealNames[mealKey][(day + week + seed) % mealNames[mealKey].length],
    foods: foodsByMeal[mealKey]
  };
}
function buildFallbackDays(week, profile, seedText) {
  const seed = hashString$2(`${seedText}|${profile.goal}|${profile.dietType}|${week.week}`);
  return Array.from({ length: 7 }, (_, day) => ({
    day,
    breakfast: buildMealVariant(week.breakfast, "breakfast", week.week, day, seed),
    morningSnack: buildMealVariant(week.morningSnack, "morningSnack", week.week, day, seed),
    lunch: buildMealVariant(week.lunch, "lunch", week.week, day, seed),
    preWorkout: buildMealVariant(week.preWorkout, "preWorkout", week.week, day, seed),
    dinner: buildMealVariant(week.dinner, "dinner", week.week, day, seed)
  }));
}
function resolvePhase(week) {
  if (week <= 4) return "adaptacao";
  if (week <= 8) return "desenvolvimento";
  return "otimizacao";
}
function resolveCalorieAdjustment(profile, week) {
  const goal = profile.goal;
  if (goal === "weight_loss" || goal === "definition") {
    if (week.week <= 4) return "Déficit leve com proteína alta para preservar massa magra.";
    if (week.week <= 8) return "Déficit moderado com carboidratos posicionados em torno do treino.";
    return "Ajuste fino do déficit conforme energia, fome e evolução das medidas.";
  }
  if (goal === "mass") {
    if (week.week <= 4) return "Calorias próximas da manutenção para consolidar adesão.";
    if (week.week <= 8) return "Superávit controlado para ganho gradual sem excesso de gordura.";
    return "Otimização do superávit com digestibilidade e performance como prioridade.";
  }
  return "Calorias calibradas para energia estável, recuperação e consistência.";
}
function completeProfessionalFields(week, profile) {
  const phase = week.phase ?? resolvePhase(week.week);
  const phaseLabel = phase === "adaptacao" ? "adaptação" : phase === "desenvolvimento" ? "desenvolvimento" : "otimização";
  const proteinAnchor = Math.max(25, Math.round(week.macros.protein / 5));
  return {
    ...week,
    phase,
    strategy: week.strategy ?? `Semana de ${phaseLabel} com proteína distribuída, fibras em todas as refeições principais e carboidratos ajustados à rotina de treino.`,
    calorieAdjustment: week.calorieAdjustment ?? resolveCalorieAdjustment(profile, week),
    macroStrategy: week.macroStrategy ?? `Mirar cerca de ${proteinAnchor}g de proteína por refeição e concentrar carboidratos no almoço e pré-treino.`,
    hydrationTarget: week.hydrationTarget ?? `Meta base: 35 ml/kg de água ao dia, com uma porção extra de 500 ml em dias de treino.`,
    mealTiming: week.mealTiming ?? "Pré-treino 60-120 min antes da sessão; jantar com proteína magra e vegetais para recuperação sem pesar.",
    adherenceGoal: week.adherenceGoal ?? "Cumprir pelo menos 85% das refeições planejadas e registrar ajustes de fome, energia e saciedade.",
    groceryFocus: Array.isArray(week.groceryFocus) && week.groceryFocus.length >= 3 ? week.groceryFocus : ["proteínas magras", "carboidratos integrais", "vegetais variados", "gorduras boas"],
    swapOptions: Array.isArray(week.swapOptions) && week.swapOptions.length >= 3 ? week.swapOptions : ["frango por peixe ou ovos", "arroz por batata doce ou quinoa", "iogurte por cottage ou kefir"]
  };
}
function buildFallbackMealPlan(profile, locale, seedText) {
  const bmr = profile.gender === "female" ? 655 + 9.6 * profile.weight + 1.8 * profile.height - 4.7 * profile.age : 88.4 + 13.4 * profile.weight + 4.8 * profile.height - 5.7 * profile.age;
  const tdee = Math.round(bmr * 1.55);
  const seed = hashString$2(`${seedText}|${profile.goal}|${profile.dietType}|${profile.metabolismType}`);
  const weeks = Array.from({ length: 12 }, (_, index) => {
    const weekNumber = index + 1;
    const phase = resolvePhase(weekNumber);
    const dailyCalories = resolveDailyCalories(tdee, profile.goal, weekNumber);
    const protein = Math.max(Math.round(profile.weight * 1.9), 110);
    const fat = Math.max(Math.round(dailyCalories * 0.25 / 9), 45);
    const carbs = Math.max(Math.round((dailyCalories - protein * 4 - fat * 9) / 4), 90);
    const macros = { protein, carbs, fat };
    const meals = buildBaseMeals(macros, dailyCalories, weekNumber, seed);
    const baseWeek = {
      week: weekNumber,
      phase,
      weekFocus: resolveWeekFocus(profile.goal, phase),
      strategy: resolveNutritionStrategy(profile.goal, phase),
      dailyCalories,
      calorieAdjustment: resolveCalorieAdjustment(profile, {
        week: weekNumber,
        ...meals
      }),
      macros,
      macroStrategy: "Proteína distribuída em todas as refeições, carboidratos mais presentes no almoço e pré-treino, gorduras boas longe do horário imediato do treino.",
      ...meals,
      tip: resolveWeekTip(weekNumber, profile.goal),
      hydrationTarget: `Meta de ${Math.round(profile.weight * 35)} ml de água ao dia, com 500 ml extras nos dias de maior suor.`,
      mealTiming: "Pré-treino entre 60 e 120 minutos antes da sessão; última refeição com proteína magra, vegetais e carboidrato conforme fome.",
      adherenceGoal: "Manter 85% de adesão semanal e ajustar temperos, preparo e substituições sem sair das calorias.",
      groceryFocus: resolveGroceryFocus(seed, weekNumber),
      swapOptions: resolveSwapOptions(profile.dietType)
    };
    return {
      ...baseWeek,
      days: buildFallbackDays(baseWeek, profile, seedText)
    };
  });
  return {
    version: 2,
    generatedAt: (/* @__PURE__ */ new Date()).toISOString(),
    locale,
    weeks
  };
}
function resolveDailyCalories(tdee, goal, week) {
  if (goal === "weight_loss" || goal === "definition") {
    const deficit = week <= 4 ? 300 : week <= 8 ? 400 : 350;
    return Math.max(1500, tdee - deficit);
  }
  if (goal === "mass") {
    const surplus = week <= 4 ? 150 : week <= 8 ? 250 : 200;
    return tdee + surplus;
  }
  if (goal === "strength" || goal === "hybrid" || goal === "athletic") {
    return tdee + (week <= 4 ? 0 : week <= 8 ? 120 : 80);
  }
  return tdee;
}
function buildBaseMeals(macros, dailyCalories, week, seed) {
  const protein = pickRotation(proteinRotations, seed + week, 0);
  const carbs = pickRotation(carbRotations, seed + week * 3, 0);
  const fats = pickRotation(fatRotations, seed + week * 5, 0);
  const veggies = pickRotation(vegetableRotations, seed + week * 7, 0);
  return {
    breakfast: buildMeal("Café da Manhã Proteico", [protein[0], carbs[0], fats[0]], dailyCalories, macros, 0.22),
    morningSnack: buildMeal("Lanche de Sustentação", [protein[1], carbs[1]], dailyCalories, macros, 0.1),
    lunch: buildMeal("Almoço Completo", [protein[2], carbs[2], veggies[0], fats[2]], dailyCalories, macros, 0.3),
    preWorkout: buildMeal("Combustível Pré-Treino", [carbs[3], protein[3]], dailyCalories, macros, 0.14),
    dinner: buildMeal("Jantar de Recuperação", [protein[4] ?? protein[3], veggies[1], carbs[4], fats[3]], dailyCalories, macros, 0.24)
  };
}
function buildMeal(name, foods, dailyCalories, macros, ratio) {
  return {
    name,
    foods,
    calories: Math.round(dailyCalories * ratio),
    protein: Math.round(macros.protein * ratio),
    carbs: Math.round(macros.carbs * ratio),
    fat: Math.round(macros.fat * ratio)
  };
}
function resolveWeekFocus(goal, phase) {
  if (phase === "adaptacao") return "Adaptação alimentar e rotina proteica";
  if (phase === "desenvolvimento") {
    return goal === "weight_loss" || goal === "definition" ? "Controle de déficit com energia para treinar" : "Desenvolvimento calórico e recuperação muscular";
  }
  return "Otimização de aderência, digestão e performance";
}
function resolveNutritionStrategy(goal, phase) {
  if (goal === "weight_loss" || goal === "definition") {
    return phase === "adaptacao" ? "Criar déficit leve com alto volume alimentar, proteínas magras e vegetais em refeições principais." : "Sustentar o déficit com carboidratos estratégicos e opções de alta saciedade.";
  }
  if (goal === "mass") {
    return phase === "adaptacao" ? "Subir calorias com digestibilidade, proteína suficiente e carboidratos de fácil execução." : "Manter superávit controlado priorizando treino bem alimentado e recuperação.";
  }
  return "Manter energia estável com refeições simples, proteína suficiente e carboidratos bem distribuídos.";
}
function resolveWeekTip(week, goal) {
  const tips = [
    "Prepare duas proteínas base no início da semana para reduzir decisões e manter aderência.",
    "Use vegetais em almoço e jantar para melhorar saciedade sem estourar calorias.",
    "Deixe o pré-treino simples e repetível: carboidrato fácil + proteína leve.",
    "Ajuste temperos e molhos sem transformar pequenas escolhas em excesso calórico."
  ];
  if (goal === "weight_loss" || goal === "definition") {
    tips.push("Se a fome subir, aumente salada, legumes e água antes de cortar mais calorias.");
  } else {
    tips.push("Se o peso não subir após duas semanas, aumente uma porção de carboidrato no almoço.");
  }
  return tips[(week - 1) % tips.length];
}
function resolveGroceryFocus(seed, week) {
  const protein = pickRotation(proteinRotations, seed, week);
  const carbs = pickRotation(carbRotations, seed + 2, week);
  const veggies = pickRotation(vegetableRotations, seed + 4, week);
  const fats = pickRotation(fatRotations, seed + 6, week);
  return [protein[0], protein[2], carbs[2], veggies[0], fats[0]];
}
function resolveSwapOptions(dietType) {
  if (/veg/i.test(dietType)) {
    return ["tofu por tempeh", "lentilha por grão-de-bico", "iogurte vegetal proteico por shake vegetal"];
  }
  return ["frango por tilápia ou ovos", "arroz por batata doce ou quinoa", "iogurte grego por cottage ou kefir"];
}
function isBaseWeekPlan(value, index) {
  if (!value || typeof value !== "object") return false;
  const item = value;
  const textFields = [item.weekFocus, item.tip].filter((field) => typeof field === "string");
  return item.week === index + 1 && typeof item.weekFocus === "string" && !textFields.some(containsTrainingText) && isNumber(item.dailyCalories) && item.macros != null && isNumber(item.macros.protein) && isNumber(item.macros.carbs) && isNumber(item.macros.fat) && isMeal(item.breakfast) && isMeal(item.morningSnack) && isMeal(item.lunch) && isMeal(item.preWorkout) && isMeal(item.dinner) && typeof item.tip === "string";
}
function hasValidDays(week) {
  return Array.isArray(week.days) && week.days.length === 7 && week.days.every((day, dayIndex) => isValidDayPlan(day, dayIndex)) && !hasDuplicateAdjacentDayMeals(week);
}
function normalizeMealPlanWeeks(weeks, profile, seedText) {
  if (!Array.isArray(weeks) || weeks.length !== 12) return null;
  return weeks.map((week, index) => {
    if (!isBaseWeekPlan(week, index)) return null;
    const completed = completeProfessionalFields(week, profile);
    return {
      ...completed,
      days: hasValidDays(completed) ? completed.days : buildFallbackDays(completed, profile, seedText)
    };
  }).filter((week) => week !== null);
}
function hasDuplicateAdjacentDayMeals(week) {
  if (!Array.isArray(week.days)) return true;
  const signature = (day) => ["breakfast", "morningSnack", "lunch", "preWorkout", "dinner"].map((mealKey) => day[mealKey]).filter((meal) => typeof meal === "object" && meal !== null && "foods" in meal).flatMap((meal) => meal.foods.map((food) => food.toLowerCase().trim())).sort().join("|");
  for (let i = 1; i < week.days.length; i++) {
    if (signature(week.days[i]) === signature(week.days[i - 1])) return true;
  }
  return false;
}
function isValidDayPlan(value, index) {
  if (!value || typeof value !== "object") return false;
  const day = value;
  return day.day === index && isMeal(day.breakfast) && isMeal(day.morningSnack) && isMeal(day.lunch) && isMeal(day.preWorkout) && isMeal(day.dinner);
}
function containsTrainingText(value) {
  return /\b(treino|exerc[ií]cio|s[eé]rie|repeti[cç][aã]o|workout|descanso|supino|agachamento|remada|puxada)\b/i.test(value);
}
function isValidMealPlanWeeks(weeks) {
  if (!Array.isArray(weeks) || weeks.length !== 12) return false;
  return weeks.every((week, index) => {
    return isBaseWeekPlan(week, index) && hasValidDays(week);
  });
}
const LANGUAGE_NAME$1 = {
  pt: "português brasileiro",
  es: "español",
  en: "English",
  fr: "français",
  de: "Deutsch"
};
const Route$5 = createFileRoute("/api/chat-stream")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const key = process.env.OPENAI_API_KEY;
        if (!key) return new Response("API key not configured", { status: 500 });
        const { messages, userContext, locale, athleteMemory } = await request.json();
        const lang = LANGUAGE_NAME$1[locale] ?? LANGUAGE_NAME$1.pt;
        try {
          const res = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${key}`,
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              model: OPENAI_MODEL,
              messages: [
                { role: "system", content: buildCoachPrompt(userContext, lang, athleteMemory) },
                ...messages
              ],
              max_tokens: 500,
              temperature: 0.75,
              stream: true
            })
          });
          if (!res.ok) {
            return new Response(await res.text(), { status: res.status });
          }
          return new Response(res.body, {
            headers: {
              "Content-Type": "text/event-stream",
              "Cache-Control": "no-cache",
              "X-Accel-Buffering": "no"
            }
          });
        } catch (err) {
          console.error("[chat-stream]", err);
          return new Response("Internal Server Error", { status: 500 });
        }
      }
    }
  }
});
function buildCoachPrompt(userContext, lang, athleteMemory) {
  return `You are ZYROX 3D Body Scan AI Coach — an elite personal trainer and sports nutritionist with full access to the athlete's scan history, workout logs, and body measurements. You are the intelligent engine of the app.

${userContext}
${athleteMemory ? "\n" + athleteMemory : ""}

CRITICAL RULE: Always respond in ${lang}. Never switch languages regardless of how the user writes.

## Expert Knowledge Base (Brazilian Fitness Methodology)

**Beginner training:**
- Full Body 3x/week, machines preferred for safety, 15 reps 30–60s rest
- Technique before load — stop at technical failure, not muscular failure
- Warm-up 5–10 min aerobic before resistance training
- Compound movements: squat, leg press, pulley row, bench press machine, shoulder press
- Core: simple abdominal → plank → knee raises → dragon flag progression

**Intermediate / Advanced:**
- AB or ABC split, 4–6x/week; intermediate: 8–12 reps hypertrophy; advanced: 15–20 sets/muscle group
- Synergist groupings: chest+shoulder+triceps / back+biceps / legs separate
- Progressive overload is mandatory for continued results

**Plateau breaking (advanced):**
- Cluster sets: heavy load → 4-rep blocks, 20s intra-set rest, reach 20 total reps
- Rest-pause: train to failure → 15s rest → failure again → repeat
- Peak contraction (isometry): 3s hold at maximum tension point
- Periodization waves: alternate weekly between power (4–6 reps), hypertrophy (8–12), metabolic (15–30)
- Inverse exercise order: start with small/accessory muscles to strengthen limiters
- Submaximal pump sessions between heavy days for recovery + density

**Female athlete specifics:**
- Prioritize glutes + lower body 2x/week (quadriceps day + hamstring/glute day)
- Upper body for symmetry: back + shoulders narrow waist visually
- Calves + adductors 2x/week; adductor chair for knee stability
- Adapt intensity to hormonal cycle phases
- High frequency inferiores OK if alternating heavy / submaximal sessions

**Weight loss / fat loss:**
- Hypertrophy focus burns more fat long-term than cardio alone
- Compound movements = maximum motor unit recruitment = more calories burned
- HIIT aerobic AFTER weights (not on leg day), or separate session
- Caloric deficit + 1.6–2.4g protein/kg bodyweight
- Full Body workouts in deficit: up to 2x hypertrophy vs isolation split

**Recovery & posture:**
- Articular cartilage has no vascular supply → recovers slower than muscle
- Supercompensation curve: growth happens during recovery, not training
- "Spine like an ironing board" for squats, rows, deadlifts
- Core braced at all times under load; stop when posture breaks

**Calisthenics fundamentals:**
- 5 pillars: Push (push-up → handstand push-up), Pull (pull-up), Legs (squat → pistol), Core (plank → hollow body → dragon flag), Mobility (wrist, shoulder, hip, ankle)
- Progression tests: max push-ups, Australian pull-ups, squats, plank hold (sec), bar hang (sec)

Guidelines:
- Be direct, technical, and motivating
- Personalize every response using the user profile
- Keep responses concise: 2–4 short paragraphs
- Suggest concrete, actionable steps — never generic advice
- Never invent data not present in the profile`;
}
const Route$4 = createFileRoute("/api/analyze-image")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const key = process.env.OPENAI_API_KEY;
        if (!key) return new Response("API key not configured", { status: 500 });
        const { imageBase64, userContext, locale, kind, height, weight } = await request.json();
        const LANGUAGE_NAME2 = {
          pt: "português brasileiro",
          es: "español",
          en: "English",
          fr: "français",
          de: "Deutsch"
        };
        const lang = LANGUAGE_NAME2[locale] ?? LANGUAGE_NAME2.pt;
        let systemContent;
        let userText;
        if (kind === "body") {
          const cal = height && weight ? `Calibration data: height=${height}cm, weight=${weight}kg.` : "";
          systemContent = `You are an expert body composition analyst for ZYROX 3D Body Scan. ${cal}
Analyze the full-body photo and respond with ONLY a valid JSON object — no markdown, no extra text:
{
  "analysis": "<2-sentence encouraging summary in ${lang}>",
  "measurements": {
    "peito": <chest circumference cm, integer>,
    "cintura": <waist circumference cm, integer>,
    "quadril": <hip circumference cm, integer>,
    "braco": <bicep circumference cm, integer>,
    "coxa": <thigh circumference cm, integer>,
    "panturrilha": <calf circumference cm, integer>,
    "bodyFat": <body fat percentage, 1 decimal>,
    "muscleMass": <muscle mass kg, 1 decimal>
  }
}
Use visible body proportions and calibration data. Estimates must be realistic.`;
          userText = "Analyze this body scan and return the JSON.";
        } else {
          systemContent = `You are a sports nutritionist for ZYROX. Analyze the food photo and respond with ONLY valid JSON — no markdown:
{
  "analysis": "<2-sentence nutritional summary in ${lang}>",
  "measurements": {
    "kcal": <total calories integer>,
    "protein": <protein grams integer>,
    "carbs": <carbs grams integer>,
    "fat": <fat grams integer>
  }
}`;
          userText = "Analyze this food photo and return the JSON.";
        }
        try {
          const res = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
            body: JSON.stringify({
              model: OPENAI_MODEL,
              messages: [
                { role: "system", content: `${systemContent}

${userContext}` },
                {
                  role: "user",
                  content: [
                    { type: "image_url", image_url: { url: `data:image/jpeg;base64,${imageBase64}`, detail: "high" } },
                    { type: "text", text: userText }
                  ]
                }
              ],
              max_tokens: 600,
              response_format: { type: "json_object" }
            })
          });
          if (!res.ok) {
            const err = await res.text();
            console.error("[analyze-image] OpenAI error:", res.status, err);
            return new Response(JSON.stringify({ analysis: "", measurements: null }), {
              status: 200,
              headers: { "Content-Type": "application/json" }
            });
          }
          const json = await res.json();
          try {
            const parsed = JSON.parse(json.choices[0].message.content);
            return new Response(JSON.stringify({ analysis: parsed.analysis ?? "", measurements: parsed.measurements ?? null }), {
              headers: { "Content-Type": "application/json" }
            });
          } catch {
            return new Response(JSON.stringify({ analysis: json.choices[0].message.content, measurements: null }), {
              headers: { "Content-Type": "application/json" }
            });
          }
        } catch (err) {
          console.error("[analyze-image] Error:", err);
          return new Response(JSON.stringify({ analysis: "", measurements: null }), {
            status: 200,
            headers: { "Content-Type": "application/json" }
          });
        }
      }
    }
  }
});
const LANGUAGE_NAME = {
  pt: "português brasileiro",
  es: "español",
  en: "English",
  fr: "français",
  de: "Deutsch"
};
const CATEGORY_LABEL = {
  peitoral: "Peitoral",
  costas_trapezio: "Costas/Trapézio",
  deltoides: "Deltóides",
  biceps_antebraco: "Bíceps",
  triceps: "Tríceps",
  abdomen_core: "Abdômen/Core",
  membros_inferiores_gluteos: "Pernas/Glúteos",
  panturrilha: "Panturrilha"
};
const GOAL_LABEL = {
  ganho_massa: "hipertrofia (ganho de massa muscular)",
  perda_peso: "perda de peso/gordura",
  definicao: "definição muscular",
  forca: "força máxima",
  performance: "performance atlética",
  saude: "saúde e bem-estar"
};
const Route$3 = createFileRoute("/api/ai-workout")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const key = process.env.OPENAI_API_KEY;
        if (!key) return new Response("not configured", { status: 500 });
        const payload = await request.json();
        const { profile, workoutCandidates, locale, athleteMemory, regenerationId, avoidExerciseIds = [] } = payload;
        const lang = LANGUAGE_NAME[locale] ?? LANGUAGE_NAME.pt;
        const prompt = buildAIWorkoutPrompt(
          profile,
          workoutCandidates,
          lang,
          athleteMemory,
          { regenerationId, avoidExerciseIds }
        );
        try {
          const res = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${key}`,
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              model: OPENAI_MODEL,
              messages: [
                {
                  role: "system",
                  content: `You are ZYROX AI Coach — elite certified personal trainer and sports scientist. You create hyper-personalized training programs. CRITICAL: Respond in ${lang}. Return ONLY valid JSON, no markdown, no explanation.`
                },
                { role: "user", content: prompt }
              ],
              max_tokens: 1800,
              temperature: regenerationId ? 0.9 : 0.7,
              response_format: { type: "json_object" }
            })
          });
          if (!res.ok) {
            const err = await res.text();
            return new Response(err, { status: res.status });
          }
          const json = await res.json();
          const content = json.choices[0]?.message?.content;
          if (!content) return new Response("Invalid AI response", { status: 502 });
          return new Response(content, {
            headers: { "Content-Type": "application/json" }
          });
        } catch (err) {
          console.error("[ai-workout]", err);
          return new Response("Internal Server Error", { status: 500 });
        }
      }
    }
  }
});
function buildAIWorkoutPrompt(profile, candidates, lang, athleteMemory, regeneration) {
  const goalDescription = GOAL_LABEL[profile.goal] ?? profile.goal;
  const levelText = profile.level === "iniciante" ? "Iniciante (primeiro ano de treino, foco em técnica e neuroadaptação)" : profile.level === "intermediario" ? "Intermediário (1-3 anos, base sólida, busca progressão de carga)" : "Avançado (3+ anos, periodização complexa, alto volume tolerado)";
  const setsRepsGuide = profile.goal === "ganho_massa" ? "3-4 séries, 8-12 reps, 60-90s descanso" : profile.goal === "forca" ? "4-5 séries, 4-6 reps, 120-180s descanso" : profile.goal === "perda_peso" || profile.goal === "definicao" ? "3 séries, 12-15 reps, 45-60s descanso" : "3-4 séries, 8-12 reps, 60-90s descanso";
  const levelSetsAdjust = profile.level === "iniciante" ? "Iniciante: reduzir para 2-3 séries, garantir técnica perfeita antes de carga." : profile.level === "avancado" ? "Avançado: pode usar 4-5 séries, incluir variações de periodização." : "";
  const workoutBlocks = candidates.map((w, i) => {
    const exerciseLines = w.exercises.map((e) => `  - ${e.id} | "${e.name}" | ${CATEGORY_LABEL[e.category] ?? e.category} | ${e.equipment}`).join("\n");
    return `### Treino ${i + 1}: ${w.workoutName}
Foco muscular: ${w.workoutFocus.split(",").map((c) => CATEGORY_LABEL[c.trim()] ?? c).join(", ")}
ID do treino: ${w.workoutId}
Exercícios disponíveis (selecione exatamente 8):
${exerciseLines}`;
  }).join("\n\n");
  const consistencyText = profile.consistency === "elite" ? "Elite (treina 5-6x/semana com alta disciplina)" : profile.consistency === "regular" ? "Regular (treina 3-4x/semana com boa consistência)" : "Ocasional (treina quando pode, irregularidade comum)";
  const phaseContext = profile.currentPhase ? `Fase atual: ${profile.currentPhase} (semana ${profile.currentWeek ?? 1}/12) — ${profile.phaseEmphasis ?? ""}
Volume desta semana: ${profile.volumeBias ?? "moderado"} | Intensidade: ${profile.intensityBias ?? "moderada"}` : "";
  const locationLabel = profile.location === "academia" ? "Academia (acesso completo: barras, halteres, cabos, máquinas, banco)" : profile.location === "casa" ? "Casa (SEM máquinas e SEM cabos/polias — use apenas halteres, barras, peso corporal, elásticos)" : profile.location === "outdoor" ? "Outdoor/Parque (SOMENTE calistenia e peso corporal — sem equipamentos de academia)" : "Híbrido (academia + casa — priorize exercícios versáteis que funcionem nos dois ambientes)";
  const equipmentContext = profile.equipment && profile.equipment.length > 0 ? `Equipamentos disponíveis: ${profile.equipment.join(", ")}` : profile.location === "academia" ? "Equipamentos: acesso completo à academia" : profile.location === "casa" ? "Equipamentos caseiros disponíveis" : "";
  const trainingTypeLabel = profile.trainingType === "funcional" ? "Funcional" : profile.trainingType === "calistenia" ? "Calistenia" : "Musculação";
  const focusContext = profile.focusMuscles && profile.focusMuscles.length > 0 ? `Músculos prioritários (foco do atleta): ${profile.focusMuscles.join(", ")}` : "";
  const injuryContext = [
    ...profile.injuries && profile.injuries.length > 0 ? [`LESÕES ATIVAS: ${profile.injuries.join(", ")} — EVITE exercícios que agravem`] : [],
    ...profile.limitations && profile.limitations.length > 0 ? [`Limitações: ${profile.limitations.join(", ")}`] : []
  ].join("\n");
  const nutritionContext = [
    profile.dietType ? `Dieta: ${profile.dietType}` : "",
    profile.metabolismType ? `Metabolismo: ${profile.metabolismType}` : ""
  ].filter(Boolean).join(" | ");
  const cycleContext = profile.trackCycle ? `Ciclo menstrual ativado no onboarding${profile.menstrualCyclePhase ? `; fase atual: ${profile.menstrualCyclePhase}` : ""}. Ajuste volume, descanso e intensidade à fase informada.` : "";
  const femaleContext = profile.sex === "feminino" ? `PERFIL FEMININO: não use divisão genérica masculina como padrão. Priorize glúteos e membros inferiores, com superior em manutenção/postura. ${cycleContext}` : "";
  const variationContext = regeneration?.regenerationId ? `
REGENERAÇÃO SOLICITADA:
- Seed de variação: ${regeneration.regenerationId}
- Gere uma seleção visivelmente diferente do plano anterior.
${regeneration.avoidExerciseIds?.length ? `- Evite repetir estes IDs quando houver alternativa compatível: ${regeneration.avoidExerciseIds.slice(0, 40).join(", ")}` : ""}
- Preserve a coerência com modalidade, ambiente, fase e segurança, mas varie exercícios, ordem e notas técnicas.` : "";
  return `${athleteMemory ? athleteMemory + "\n\n" : ""}PERFIL DO ATLETA${profile.name ? ` — ${profile.name}` : ""}:
- Objetivo: ${goalDescription}
- Nível: ${levelText}
- Consistência: ${consistencyText}
- Sexo: ${profile.sex === "feminino" ? "Feminino" : profile.sex === "masculino" ? "Masculino" : "Não informado"}
- Modalidade escolhida no onboarding: ${trainingTypeLabel}
- Local de treino: ${locationLabel}
- Dias por semana: ${profile.availableDays}
- Duração por sessão: ${profile.workoutDurationMin} minutos
${equipmentContext}
${focusContext}
${nutritionContext ? `- ${nutritionContext}` : ""}
${phaseContext}
${femaleContext}
${injuryContext}
${variationContext}

TAREFA: Crie um programa de treino ALTAMENTE PERSONALIZADO para ESTE atleta específico. Use TODOS os dados acima para tomar decisões de seleção de exercício, volume e intensidade. Trate como um personal trainer de bolso que conhece o histórico completo do atleta.

Parâmetros base de volume/intensidade:
- ${setsRepsGuide}
- ${levelSetsAdjust}

${workoutBlocks}

REGRAS CRÍTICAS:
1. Selecione EXATAMENTE 8 exercícios por treino
2. Use SOMENTE os IDs da lista acima (nunca invente IDs) — os candidatos já foram filtrados por local e equipamento
3. RESPEITE a modalidade do onboarding: Musculação=exercícios de musculação; Funcional=movimentos funcionais, core, estabilidade, unilateralidade e condicionamento; Calistenia=peso corporal/calistenia
4. RESPEITE o local de treino: casa=sem máquinas/cabos, outdoor=só calistenia, academia=tudo disponível
5. Priorize compostos primeiro, isolados depois. Para feminino: glúteos/inferiores comandam a divisão; superior entra como manutenção, postura e definição
6. Nunca use rosca/bíceps em vaga de tríceps; tríceps precisa ser extensão, corda, francês, testa, coice ou mergulho
7. Não repita família/padrão do mesmo exercício: mudança de pegada, abertura ou máquina parecida NÃO conta como exercício novo. Exemplo proibido no mesmo treino: Remada Curvada + Remada Curvada Pronada + Remada Curvada Aberta
8. Em treino de costas, use no máximo 2 remadas horizontais; combine com puxada vertical, trapézio, deltoide posterior, bíceps ou core quando a divisão pedir
9. O "aiNote" deve ser uma dica técnica ESPECÍFICA para este atleta (máx 15 palavras, em ${lang})
10. Personalize sets/reps dentro dos parâmetros base conforme nível, objetivo e fase atual
11. "scheduleReasons": 3 razões específicas sobre POR QUÊ esta seleção é ideal para ESTE atleta (cite dados reais do perfil: modalidade, lesões, foco muscular, fase, consistência)
12. "weekFocus": uma frase de foco PERSONALIZADA para esta semana e este atleta específico
13. Em regeneração, varie o plano anterior sem violar as regras de segurança e compatibilidade

Responda com JSON exatamente neste formato:
{
  "workouts": [
    {
      "id": "workout-id-aqui",
      "exercises": [
        {"exerciseId": "id-do-exercicio", "sets": N, "repsMin": N, "repsMax": N, "rest": N, "aiNote": "dica técnica"}
      ]
    }
  ],
  "scheduleReasons": ["razão específica 1", "razão específica 2", "razão específica 3"],
  "weekFocus": "frase de foco da semana"
}`;
}
const calistheniaPuraCatalog = [
  "Afundo no banco.mp4",
  "Afundo Profundo.mp4",
  "Afundo.mp4",
  "Agachamento Búlgaro com Peso Corporal.mp4",
  "Agachamento búlgaro com salto.mp4",
  "Agachamento Camarão.mp4",
  "Agachamento com Joelho Elevado.mp4",
  "Agachamento com Salto.mp4",
  "Agachamento com Sustentação e Elevação de Panturrilhas.mp4",
  "Agachamento havaiano.mp4",
  "Agachamento no Banco com Peso Corporal.mp4",
  "Agachamento Pistol com TRX.mp4",
  "Agachamento Pistola Apoiado.mp4",
  "Agachamento Pistola com Kettlebell.mp4",
  "Agachamento Pistola na Caixa.mp4",
  "Agachamento pistola.mp4",
  "Agachamento Sissy ajoelhado com Peso Corporal.mp4",
  "Agachamento Skater.mp4",
  "Agachamento Sumô sem Pesos.mp4",
  "Agachamento.mp4",
  "Alongamento do peitoral reverso.mp4",
  "Andar de Pato.mp4",
  "Avanço sem Peso Corporal.mp4",
  "Back Lever.mp4",
  "Bandeira Humana.mp4",
  "Barra fixa Assistida com Faixa Elástica.mp4",
  "Barra fixa com Arco.mp4",
  "Barra fixa com braços alternados.mp4",
  "Barra Fixa com Giro.mp4",
  "Barra fixa com L-sit.mp4",
  "Barra Fixa com Pegada Fechada.mp4",
  "Barra fixa com pegada invertida assistido.mp4",
  "Barra fixa com pegada neutra.mp4",
  "Barra Fixa com Pegada por Trás do Pescoço.mp4",
  "Barra Fixa com Pegada Supinada.mp4",
  "Barra fixa com peso.mp4",
  "Barra fixa com Salto.mp4",
  "Barra Fixa de Cabeça para Baixo.mp4",
  "Barra Fixa para o Braquial.mp4",
  "Barra fixa pegada invertida.mp4",
  "Caminhada na Parada de Mão.mp4",
  "Crucifixo com TRX.mp4",
  "Dips na cadeira.mp4",
  "Elevação de panturrilha em pé.mp4",
  "Elevação de Panturrilha em Uma Perna.mp4",
  "Elevação de Quadril com Peso Corporal.mp4",
  "Elevação lateral com toalha na parede.mp4",
  "Elevação Pélvica Declinado.mp4",
  "Elevações de ombros na paralela.mp4",
  "Extensão de tríceps.mp4",
  "Flexão com barras de apoio.mp4",
  "Flexão com Cruzamento dos Braços.mp4",
  "Flexão com kettlebell profunda.mp4",
  "Flexão com parada de mãos.mp4",
  "Flexão com peso.mp4",
  "Flexão com Toque no Peito.mp4",
  "Flexão com Toque nos Dedos dos Pés.mp4",
  "Flexão com um braço.mp4",
  "Flexão de braço com adução da escapula.mp4",
  "Flexão de Braço com Arqueamento.mp4",
  "Flexão de Braço com Bola de Estabilidade.mp4",
  "Flexão de Braço com Bola Medicinal com Apoio em Um Braço.mp4",
  "Flexão de braço com palmas.mp4",
  "Flexão de Braço com Uma Perna.mp4",
  "Flexão de Braço Declinada com Bola de Estabilidade.mp4",
  "Flexão de Braço na Parede com Pegada Fechada.mp4",
  "Flexão de Braços com Apoio dos Joelhos Fechada.mp4",
  "Flexão de Braços com Toque no Ombro.mp4",
  "Flexão de Cotovelos na Barra.mp4",
  "Flexão de Dedos.mp4",
  "Flexão de diamante de joelhos.mp4",
  "Flexão de joelhos.mp4",
  "Flexão de Parede.mp4",
  "Flexão de Peito com TRX.mp4",
  "Flexão de Perna com Halteres em Decúbito Dorsal.mp4",
  "Flexão de pernas com toalha.mp4",
  "Flexão de pivô com banco.mp4",
  "Flexão de pivô entre cadeiras.mp4",
  "Flexão de Punho Fechado.mp4",
  "Flexão de Queda.mp4",
  "Flexão de um braço com apoio.mp4",
  "Flexão de um braço com bola medicinal.mp4",
  "Flexão diamante.mp4",
  "Flexão em pivô.mp4",
  "Flexão Fechada com bola medicinal.mp4",
  "Flexão hindu modificada.mp4",
  "Flexão inclinada.mp4",
  "Flexão Invertida.mp4",
  "Flexão na parede.mp4",
  "Flexão plus.mp4",
  "Flexão reversa com cotovelos.mp4",
  "Flexão.mp4",
  "Flexões de apoio de mão na parede.mp4",
  "Flexões hindu.mp4",
  "Impossible Dips.mp4",
  "Levantamento de panturrilha com apoio e sobrecarga.mp4",
  "Levantamento Terra Unilateral.mp4",
  "Mergulho Coreano.mp4",
  "Mergulho de tríceps.mp4",
  "Mergulhos para tríceps no chão.mp4",
  "Muscle up.mp4",
  "Paralela.mp4",
  "Paralelas entre Cadeiras.mp4",
  "Paralelas na Argola.mp4",
  "Paralelas na Barra.mp4",
  "Planche com Flexão de Braço.mp4",
  "Planche.mp4",
  "Ponte em Unilateral.mp4",
  "Pulo de impulso de quadril de uma perna.mp4",
  "Puxada escapular na barra fixa.mp4",
  "Puxada Front Lever.mp4",
  "Puxada isométrica.mp4",
  "Remada com o Peso do Corpo na Porta.mp4",
  "Remada Invertida Com Argolas.mp4",
  "Remada Invertida na Mesa.mp4",
  "Rosca concentrada com perna.mp4",
  "Salto em Caixa com uma Perna.mp4",
  "Salto em Distância.mp4",
  "Salto na Caixa para Agachamento Pistola.mp4",
  "Salto para Caixa 2 para 1.mp4",
  "Suspensão Passiva.mp4",
  "Swing 360.mp4"
];
const musculacaoPrincipalCatalog = [
  "ABDOMEN CORE (1)/Abdominal bicleta (1).mp4",
  "ABDOMEN CORE (1)/Abdominal com rotação de tronco (1).mp4",
  "ABDOMEN CORE (1)/Abdominal declinado (1).mp4",
  "ABDOMEN CORE (1)/Abdominal pegando a bola (1).mp4",
  "ABDOMEN CORE (1)/ABS  rolinho (1).mp4",
  "ABDOMEN CORE (1)/ABS alternado com rotação (1).mp4",
  "ABDOMEN CORE (1)/ABS alternando pernas (1).mp4",
  "ABDOMEN CORE (1)/Abs banco (1).mp4",
  "ABDOMEN CORE (1)/ABS banco declinado completo (1).mp4",
  "ABDOMEN CORE (1)/Abs bola flexão de quadril (1).mp4",
  "ABDOMEN CORE (1)/ABS borboleta (1).mp4",
  "ABDOMEN CORE (1)/ABS carga nos pés (1).mp4",
  "ABDOMEN CORE (1)/ABS com flexão lateral (1).mp4",
  "ABDOMEN CORE (1)/ABS completo (1).mp4",
  "ABDOMEN CORE (1)/Abs completo tocando os pés (1).mp4",
  "ABDOMEN CORE (1)/ABS curto pernas elevadas (1).mp4",
  "ABDOMEN CORE (1)/Abs flog (1).mp4",
  "ABDOMEN CORE (1)/ABS infra (1).mp4",
  "ABDOMEN CORE (1)/Abs infra apoiado (1).mp4",
  "ABDOMEN CORE (1)/Abs isometrico (1).png",
  "ABDOMEN CORE (1)/Abs isométrico alternando pernas (1).mp4",
  "ABDOMEN CORE (1)/Abs lateral (1).mp4",
  "ABDOMEN CORE (1)/ABS máquina (1).mp4",
  "ABDOMEN CORE (1)/ABS obliquo (1).mp4",
  "ABDOMEN CORE (1)/ABS oblíquo 3 (1).mp4",
  "ABDOMEN CORE (1)/ABS oblíquo pernas extendidas (1).mp4",
  "ABDOMEN CORE (1)/ABs pernas alternando (1).mp4",
  "ABDOMEN CORE (1)/ABS polia alta (1).mp4",
  "ABDOMEN CORE (1)/ABS polia alta 2 (1).mp4",
  "ABDOMEN CORE (1)/ABS remador pernas extendidas (1).mp4",
  "ABDOMEN CORE (1)/ABS rolinho com barra (1).mp4",
  "ABDOMEN CORE (1)/ABS tesoura (1).mp4",
  "ABDOMEN CORE (1)/ABS tocando os pés 2 (1).mp4",
  "ABDOMEN CORE (1)/ball-sit-up (1).mp4",
  "ABDOMEN CORE (1)/Bicicleta 2 (1).mp4",
  "ABDOMEN CORE (1)/conventional-sit-up (1).mp4",
  "ABDOMEN CORE (1)/crunch (1).mp4",
  "ABDOMEN CORE (1)/Crunch 3 (1).mp4",
  "ABDOMEN CORE (1)/Crunch 4 (1).mp4",
  "ABDOMEN CORE (1)/Crunch com carga (1).mp4",
  "ABDOMEN CORE (1)/Crunch pernas elevadas (1).mp4",
  "ABDOMEN CORE (1)/Crunch reverso (1).mp4",
  "ABDOMEN CORE (1)/crunch-floor (1).mp4",
  "ABDOMEN CORE (1)/Crunch-With-Leg-Raise (1).mp4",
  "ABDOMEN CORE (1)/Dead bug (1).mp4",
  "ABDOMEN CORE (1)/dragon-flag (1).mp4",
  "ABDOMEN CORE (1)/Elevação de pernas banco (1).mp4",
  "ABDOMEN CORE (1)/Elevação de pernas solo (1).mp4",
  "ABDOMEN CORE (1)/Escalador (1).mp4",
  "ABDOMEN CORE (1)/Escalador cruzado (1).mp4",
  "ABDOMEN CORE (1)/Flexão de quadril ABS (1).mp4",
  "ABDOMEN CORE (1)/Flexão de quadril banco (1).mp4",
  "ABDOMEN CORE (1)/Flexão lateral bola (1).mp4",
  "ABDOMEN CORE (1)/frog-crunch (1).mp4",
  "ABDOMEN CORE (1)/Hanging-Knee-Raises (1).mp4",
  "ABDOMEN CORE (1)/Oblíquo banco (1).mp4",
  "ABDOMEN CORE (1)/oblíquo polia baixa (1).mp4",
  "ABDOMEN CORE (1)/Prancha (1).mp4",
  "ABDOMEN CORE (1)/Prancha com flexão lateral de quadril (1).mp4",
  "ABDOMEN CORE (1)/Prancha dinamica bola (1).mp4",
  "ABDOMEN CORE (1)/Prancha frente trás (1).mp4",
  "ABDOMEN CORE (1)/Prancha lateral (1).jpg",
  "ABDOMEN CORE (1)/Prancha lateral com flexão lateral (1).mp4",
  "ABDOMEN CORE (1)/Rolinho completo (1).mp4",
  "ABDOMEN CORE (1)/Rotação de tronco diagonal baixa (1).mp4",
  "ABDOMEN CORE (1)/Russian twist (1).mp4",
  "ABDOMEN CORE (1)/v-sit-ups (1).mp4",
  "ABDOMEN CORE (1)/weightedsitups (1).mp4",
  "BÍCEPS e ANTEBRAÇO (1)/arm-blaster-benefits (1).mp4",
  "BÍCEPS e ANTEBRAÇO (1)/barbell-curl (1).mp4",
  "BÍCEPS e ANTEBRAÇO (1)/bayesian-curl (1).mp4",
  "BÍCEPS e ANTEBRAÇO (1)/bicep-curl-machine (1).mp4",
  "BÍCEPS e ANTEBRAÇO (1)/cable-bicep-curl (1).mp4",
  "BÍCEPS e ANTEBRAÇO (1)/cable-one-arm-curl (1).mp4",
  "BÍCEPS e ANTEBRAÇO (1)/cable-preacher-curl (1).mp4",
  "BÍCEPS e ANTEBRAÇO (1)/cross-body-hammer-curl (1).mp4",
  "BÍCEPS e ANTEBRAÇO (1)/dumbbell-bicep-curl (1).mp4",
  "BÍCEPS e ANTEBRAÇO (1)/dumbbell-hammer-curl (1).mp4",
  "BÍCEPS e ANTEBRAÇO (1)/dumbbell-incline-hammer-curl (1).mp4",
  "BÍCEPS e ANTEBRAÇO (1)/dumbbell-preacher-curl (1).mp4",
  "BÍCEPS e ANTEBRAÇO (1)/dumbbell-reverse-curl (1).mp4",
  "BÍCEPS e ANTEBRAÇO (1)/dumbbell-seated-zottman-curl (1).mp4",
  "BÍCEPS e ANTEBRAÇO (1)/dumbbell-wrist-curl (1).mp4",
  "BÍCEPS e ANTEBRAÇO (1)/Enrolar (1).mp4",
  "BÍCEPS e ANTEBRAÇO (1)/ez-bar-bicep-curl (1).mp4",
  "BÍCEPS e ANTEBRAÇO (1)/ez-bar-preacher-curl (1).mp4",
  "BÍCEPS e ANTEBRAÇO (1)/Hand grip (1).mp4",
  "BÍCEPS e ANTEBRAÇO (1)/incline-dumbbell-curl (1).mp4",
  "BÍCEPS e ANTEBRAÇO (1)/overhead-cable-curl (1).mp4",
  "BÍCEPS e ANTEBRAÇO (1)/prone-incline-dumbbell-curl (1).mp4",
  "BÍCEPS e ANTEBRAÇO (1)/Rosca agachado (1).mp4",
  "BÍCEPS e ANTEBRAÇO (1)/Rosca alta unilateral (1).mp4",
  "BÍCEPS e ANTEBRAÇO (1)/Rosca alternada (1).mp4",
  "BÍCEPS e ANTEBRAÇO (1)/Rosca alternada máquina (1).mp4",
  "BÍCEPS e ANTEBRAÇO (1)/Rosca alternada no banco inclinado (1).mp4",
  "BÍCEPS e ANTEBRAÇO (1)/Rosca apoio banco (1).mp4",
  "BÍCEPS e ANTEBRAÇO (1)/Rosca apoio banco 02 (1).mp4",
  "BÍCEPS e ANTEBRAÇO (1)/Rosca apoio no banco (1).mp4",
  "BÍCEPS e ANTEBRAÇO (1)/Rosca bíceps diagonal (1).mp4",
  "BÍCEPS e ANTEBRAÇO (1)/Rosca bíceps no cabo (1).mp4",
  "BÍCEPS e ANTEBRAÇO (1)/Rosca cabo (1).mp4",
  "BÍCEPS e ANTEBRAÇO (1)/Rosca com rotação (1).mp4",
  "BÍCEPS e ANTEBRAÇO (1)/Rosca concentrada feminino (1).mp4",
  "BÍCEPS e ANTEBRAÇO (1)/Rosca concentrada masculino (1).mp4",
  "BÍCEPS e ANTEBRAÇO (1)/Rosca deitado no banco inclinado (1).mp4",
  "BÍCEPS e ANTEBRAÇO (1)/Rosca direta (1).mp4",
  "BÍCEPS e ANTEBRAÇO (1)/Rosca direta 03 (1).mp4",
  "BÍCEPS e ANTEBRAÇO (1)/Rosca direta 04 (1).mp4",
  "BÍCEPS e ANTEBRAÇO (1)/Rosca direta apoio braquial (1).mp4",
  "BÍCEPS e ANTEBRAÇO (1)/Rosca direta curta (1).mp4",
  "BÍCEPS e ANTEBRAÇO (1)/Rosca inclinada no cabo (1).mp4",
  "BÍCEPS e ANTEBRAÇO (1)/Rosca inversa (1).mp4",
  "BÍCEPS e ANTEBRAÇO (1)/Rosca inversa com halteres (1).mp4",
  "BÍCEPS e ANTEBRAÇO (1)/Rosca inversa no cabo (1).mp4",
  "BÍCEPS e ANTEBRAÇO (1)/Rosca lateral (1).mp4",
  "BÍCEPS e ANTEBRAÇO (1)/Rosca lateral no cabo (1).mp4",
  "BÍCEPS e ANTEBRAÇO (1)/Rosca lateral polia alta (1).mp4",
  "BÍCEPS e ANTEBRAÇO (1)/Rosca martelo 01 (1).mp4",
  "BÍCEPS e ANTEBRAÇO (1)/Rosca martelo alternada (1).mp4",
  "BÍCEPS e ANTEBRAÇO (1)/Rosca martelo alternada 02 (1).mp4",
  "BÍCEPS e ANTEBRAÇO (1)/Rosca martelo corda (1).mp4",
  "BÍCEPS e ANTEBRAÇO (1)/Rosca martelo scott (1).mp4",
  "BÍCEPS e ANTEBRAÇO (1)/Rosca martelo suporte braquial (1).mp4",
  "BÍCEPS e ANTEBRAÇO (1)/Rosca punho 02 (1).mp4",
  "BÍCEPS e ANTEBRAÇO (1)/Rosca punho com anilha (1).mp4",
  "BÍCEPS e ANTEBRAÇO (1)/Rosca punho com barra (1).mp4",
  "BÍCEPS e ANTEBRAÇO (1)/Rosca punho invertida (1).mp4",
  "BÍCEPS e ANTEBRAÇO (1)/Rosca punho invertida apoio antebraço (1).mp4",
  "BÍCEPS e ANTEBRAÇO (1)/Rosca punho invertida com halteres (1).mp4",
  "BÍCEPS e ANTEBRAÇO (1)/Rosca punho martelo (1).mp4",
  "BÍCEPS e ANTEBRAÇO (1)/Rosca punho por trás (1).mp4",
  "BÍCEPS e ANTEBRAÇO (1)/Rosca punho unilatera (1).mp4",
  "BÍCEPS e ANTEBRAÇO (1)/Rosca scott alternada (1).mp4",
  "BÍCEPS e ANTEBRAÇO (1)/Rosca scott barra reta (1).mp4",
  "BÍCEPS e ANTEBRAÇO (1)/Rosca scott com halteres em pé (1).mp4",
  "BÍCEPS e ANTEBRAÇO (1)/Rosca scott de pé (1).mp4",
  "BÍCEPS e ANTEBRAÇO (1)/Rosca scott martelo (1).mp4",
  "BÍCEPS e ANTEBRAÇO (1)/Rosca scott martelo unilateral (1).mp4",
  "BÍCEPS e ANTEBRAÇO (1)/Rosca scott na máquina (1).mp4",
  "BÍCEPS e ANTEBRAÇO (1)/Rosca unilateral corda (1).mp4",
  "BÍCEPS e ANTEBRAÇO (1)/Roscadireta aberta (1).mp4",
  "BÍCEPS e ANTEBRAÇO (1)/wide-grip-ez-bar-curl (1).mp4",
  "COSTAS E TRAPÉZIO (1)/back-extension (1).mp4",
  "COSTAS E TRAPÉZIO (1)/band-assisted-pull-up (1).mp4",
  "COSTAS E TRAPÉZIO (1)/banded-wide-grip-row (1).mp4",
  "COSTAS E TRAPÉZIO (1)/Barra fixa nuca (1).mp4",
  "COSTAS E TRAPÉZIO (1)/Barra fixa pegada aberta (1).mp4",
  "COSTAS E TRAPÉZIO (1)/Barra no graviton (1).mp4",
  "COSTAS E TRAPÉZIO (1)/Barra pegada fechada (1).mp4",
  "COSTAS E TRAPÉZIO (1)/Barra pegada supinada (1).mp4",
  "COSTAS E TRAPÉZIO (1)/cable-face-pull (1).mp4",
  "COSTAS E TRAPÉZIO (1)/cable-rear-delt-fly (1).mp4",
  "COSTAS E TRAPÉZIO (1)/cable-seated-row (1).mp4",
  "COSTAS E TRAPÉZIO (1)/cable-wide-grip-row (1).mp4",
  "COSTAS E TRAPÉZIO (1)/chin-ups (1).mp4",
  "COSTAS E TRAPÉZIO (1)/close-grip-lat-pulldown-standard-bar-attachment (1).mp4",
  "COSTAS E TRAPÉZIO (1)/Crcifixo inverto máquina (1).mp4",
  "COSTAS E TRAPÉZIO (1)/Crucifixo invertido com halter (1).mp4",
  "COSTAS E TRAPÉZIO (1)/Crucifixo invertido com halteres (1).mp4",
  "COSTAS E TRAPÉZIO (1)/Crucifixo invertido elástico (1).mp4",
  "COSTAS E TRAPÉZIO (1)/Crucifixo invertido polia baixa (1).mp4",
  "COSTAS E TRAPÉZIO (1)/dumbbell-back-extension (1).mp4",
  "COSTAS E TRAPÉZIO (1)/dumbbell-face-pull (1).mp4",
  "COSTAS E TRAPÉZIO (1)/dumbbell-jefferson-curl (1).mp4",
  "COSTAS E TRAPÉZIO (1)/eccentric-pull-up (1).mp4",
  "COSTAS E TRAPÉZIO (1)/Elevação frontal cabo (1).mp4",
  "COSTAS E TRAPÉZIO (1)/Encolhimento 3 (1).mp4",
  "COSTAS E TRAPÉZIO (1)/Encolhimento barra (1).mp4",
  "COSTAS E TRAPÉZIO (1)/Encolhimento barra atrás (1).mp4",
  "COSTAS E TRAPÉZIO (1)/Encolhimento com halteres (1).mp4",
  "COSTAS E TRAPÉZIO (1)/Encolhimento máquina (1).mp4",
  "COSTAS E TRAPÉZIO (1)/Encolhimento máquina (3).mp4",
  "COSTAS E TRAPÉZIO (1)/Facepull (1).mp4",
  "COSTAS E TRAPÉZIO (1)/inverted-row (1).mp4",
  "COSTAS E TRAPÉZIO (1)/landmine-row (1).mp4",
  "COSTAS E TRAPÉZIO (1)/pull-up (1).mp4",
  "COSTAS E TRAPÉZIO (1)/Pulldown com corda (1).mp4",
  "COSTAS E TRAPÉZIO (1)/Pulldown1 (1).mp4",
  "COSTAS E TRAPÉZIO (1)/Puxada alta com elástico (1).mp4",
  "COSTAS E TRAPÉZIO (1)/Puxada alta fechada (1).mp4",
  "COSTAS E TRAPÉZIO (1)/Puxada alta nuca (1).mp4",
  "COSTAS E TRAPÉZIO (1)/Puxada alta polia (1).mp4",
  "COSTAS E TRAPÉZIO (1)/Puxada alta tradicional (1).mp4",
  "COSTAS E TRAPÉZIO (1)/Puxada alta triangulo (1).mp4",
  "COSTAS E TRAPÉZIO (1)/Puxada cruzada (1).mp4",
  "COSTAS E TRAPÉZIO (1)/Puxada máquina (1).mp4",
  "COSTAS E TRAPÉZIO (1)/Puxada unilateral 1 (1).mp4",
  "COSTAS E TRAPÉZIO (1)/Puxada unilateral cabo (1).mp4",
  "COSTAS E TRAPÉZIO (1)/Remada aberta pronada (1).mp4",
  "COSTAS E TRAPÉZIO (1)/Remada ajoelhado (1).mp4",
  "COSTAS E TRAPÉZIO (1)/Remada alta (1).mp4",
  "COSTAS E TRAPÉZIO (1)/Remada alta barra (1).mp4",
  "COSTAS E TRAPÉZIO (1)/Remada alta com halteres (1).mp4",
  "COSTAS E TRAPÉZIO (1)/Remada alta no cabo (1).mp4",
  "COSTAS E TRAPÉZIO (1)/Remada apoio banco com halteres (1).mp4",
  "COSTAS E TRAPÉZIO (1)/Remada apoio banco inclinado (1).mp4",
  "COSTAS E TRAPÉZIO (1)/Remada apoio peitoral banco (1).mp4",
  "COSTAS E TRAPÉZIO (1)/Remada cabo (1).mp4",
  "COSTAS E TRAPÉZIO (1)/Remada cavalinho (1).mp4",
  "COSTAS E TRAPÉZIO (1)/Remada cavalinho barra (1).mp4",
  "COSTAS E TRAPÉZIO (1)/Remada com halteres (1).mp4",
  "COSTAS E TRAPÉZIO (1)/Remada com triangulo (1).mp4",
  "COSTAS E TRAPÉZIO (1)/Remada curvada no cabo (1).mp4",
  "COSTAS E TRAPÉZIO (1)/Remada curvada pronada (1).mp4",
  "COSTAS E TRAPÉZIO (1)/Remada curvada pronada aberta (1).mp4",
  "COSTAS E TRAPÉZIO (1)/Remada fechada supinada (1).mp4",
  "COSTAS E TRAPÉZIO (1)/Remada inclinada (1).mp4",
  "COSTAS E TRAPÉZIO (1)/Remada invertida TRX (1).mp4",
  "COSTAS E TRAPÉZIO (1)/Remada máquina (1).mp4",
  "COSTAS E TRAPÉZIO (1)/Remada no smith (1).mp4",
  "COSTAS E TRAPÉZIO (1)/Remada serrote (1).mp4",
  "COSTAS E TRAPÉZIO (1)/Remada unilateral (1).mp4",
  "COSTAS E TRAPÉZIO (1)/reverse-pec-dec-machine (1).mp4",
  "COSTAS E TRAPÉZIO (1)/single-arm-dumbbell-row (1).mp4",
  "COSTAS E TRAPÉZIO (1)/standing-cable-row (1).mp4",
  "COSTAS E TRAPÉZIO (1)/t-bar-row-muscles (1).mp4",
  "COSTAS E TRAPÉZIO (1)/upright-cable-row (1).mp4",
  "COSTAS E TRAPÉZIO (1)/wide-grip-lat-pulldown (1).mp4",
  "COSTAS E TRAPÉZIO (1)/yates-row (1).mp4",
  "DELTÓIDES (1)/Abdução máquina (1).mp4",
  "DELTÓIDES (1)/Arnol press femino (1).mp4",
  "DELTÓIDES (1)/Arnolda press (1).mp4",
  "DELTÓIDES (1)/barbell-push-jerk-muscles (1).mp4",
  "DELTÓIDES (1)/Crucifixo invertido cabo (1).mp4",
  "DELTÓIDES (1)/Crucifixo invertido com halteres 1 (1).mp4",
  "DELTÓIDES (1)/Crucifixo invertido na máqina (1).mp4",
  "DELTÓIDES (1)/Crucifixo inverto com halteres 01 (1).mp4",
  "DELTÓIDES (1)/Desenvolvimento (1).mp4",
  "DELTÓIDES (1)/Desenvolvimento com halteres (1).mp4",
  "DELTÓIDES (1)/Desenvolvimento máquina (1).mp4",
  "DELTÓIDES (1)/Desenvolvimento no cabo (1).mp4",
  "DELTÓIDES (1)/Desenvolvimento no smith (1).mp4",
  "DELTÓIDES (1)/Desenvolvimento nuca (1).mp4",
  "DELTÓIDES (1)/Desenvolvimento unilateral (1).mp4",
  "DELTÓIDES (1)/Elevação frontal com barra (1).mp4",
  "DELTÓIDES (1)/Elevação frontal com halteres (1).mp4",
  "DELTÓIDES (1)/Elevação frontal Inclinado (1).mp4",
  "DELTÓIDES (1)/Elevação frontal mão juntas (1).mp4",
  "DELTÓIDES (1)/Elevação frontal no cabo (1).mp4",
  "DELTÓIDES (1)/Elevação frontal sentado (1).mp4",
  "DELTÓIDES (1)/Elevação frontal unilateral (1).mp4",
  "DELTÓIDES (1)/Elevação frontal unilateral 3 (1).mp4",
  "DELTÓIDES (1)/Elevação lateral + descida frontal (1).mp4",
  "DELTÓIDES (1)/Elevação lateral 01 (1).mp4",
  "DELTÓIDES (1)/Elevação lateral 4 (1).mp4",
  "DELTÓIDES (1)/Elevação lateral com inclinação (1).mp4",
  "DELTÓIDES (1)/Elevação lateral inclinado apoio banco (1).mp4",
  "DELTÓIDES (1)/Elevação lateral inclinado no cabo 2 (1).mp4",
  "DELTÓIDES (1)/Elevação lateral no cabo (1).mp4",
  "DELTÓIDES (1)/Elevação lateral no cross cruzado (1).mp4",
  "DELTÓIDES (1)/Elevação lateral tronco apoiado (1).mp4",
  "DELTÓIDES (1)/Elevação lateral uni no cabo (1).mp4",
  "DELTÓIDES (1)/Frontal, lateral, invertido (1).mp4",
  "DELTÓIDES (1)/landmine-press (1).mp4",
  "DELTÓIDES (1)/lateral-raise-machine (1).mp4",
  "DELTÓIDES (1)/Military press 3 (1).mp4",
  "DELTÓIDES (1)/military-press (1).mp4",
  "DELTÓIDES (1)/push-press (1).mp4",
  "DELTÓIDES (1)/Rotação externa (1).mp4",
  "DELTÓIDES (1)/Rotação interna (1).mp4",
  "DELTÓIDES (1)/seated-overhead-press (1).mp4",
  "DELTÓIDES (1)/shoulder-pin-press (1).mp4",
  "MEMBROS INFERIORES E GLÚTEOS (1)/Abdução máquina 02 (1).mp4",
  "MEMBROS INFERIORES E GLÚTEOS (1)/Abdução no cabo (1).mp4",
  "MEMBROS INFERIORES E GLÚTEOS (1)/Abdutora em pé 01 (1).mp4",
  "MEMBROS INFERIORES E GLÚTEOS (1)/Adução deitada unilateral (1).mp4",
  "MEMBROS INFERIORES E GLÚTEOS (1)/Adução máquina em pe (1).mp4",
  "MEMBROS INFERIORES E GLÚTEOS (1)/Adução no cabo (1).mp4",
  "MEMBROS INFERIORES E GLÚTEOS (1)/Afundo com barra (1).mp4",
  "MEMBROS INFERIORES E GLÚTEOS (1)/Afundo cruzando perna de tras (1).mp4",
  "MEMBROS INFERIORES E GLÚTEOS (1)/Afundo lateral com barra (1).mp4",
  "MEMBROS INFERIORES E GLÚTEOS (1)/Afundo no smith (1).mp4",
  "MEMBROS INFERIORES E GLÚTEOS (1)/Agachamento 03 (1).mp4",
  "MEMBROS INFERIORES E GLÚTEOS (1)/Agachamento apoio bola (1).mp4",
  "MEMBROS INFERIORES E GLÚTEOS (1)/Agachamento com cabo (1).mp4",
  "MEMBROS INFERIORES E GLÚTEOS (1)/Agachamento com salto (1).mp4",
  "MEMBROS INFERIORES E GLÚTEOS (1)/Agachamento frontal 02 (1).mp4",
  "MEMBROS INFERIORES E GLÚTEOS (1)/Agachamento hack (1).mp4",
  "MEMBROS INFERIORES E GLÚTEOS (1)/Agachamento hack 03 (1).mp4",
  "MEMBROS INFERIORES E GLÚTEOS (1)/Agachamento sumo 01 (1).mp4",
  "MEMBROS INFERIORES E GLÚTEOS (1)/Agachamento sumo barra (1).mp4",
  "MEMBROS INFERIORES E GLÚTEOS (1)/Agachamento sumo com halter (1).mp4",
  "MEMBROS INFERIORES E GLÚTEOS (1)/Agachmento sumo (1).mp4",
  "MEMBROS INFERIORES E GLÚTEOS (1)/Agachmento sumo com halter 02 (1).mp4",
  "MEMBROS INFERIORES E GLÚTEOS (1)/Agchamento smith (1).mp4",
  "MEMBROS INFERIORES E GLÚTEOS (1)/Avanço (1).mp4",
  "MEMBROS INFERIORES E GLÚTEOS (1)/Avanço com barra (1).mp4",
  "MEMBROS INFERIORES E GLÚTEOS (1)/Aviaão com halteres (1).mp4",
  "MEMBROS INFERIORES E GLÚTEOS (1)/Avião com barra (1).mp4",
  "MEMBROS INFERIORES E GLÚTEOS (1)/Avião unilateral (1).mp4",
  "MEMBROS INFERIORES E GLÚTEOS (1)/band-standing-hip-extension (1).mp4",
  "MEMBROS INFERIORES E GLÚTEOS (1)/barbell-good-morning (1).mp4",
  "MEMBROS INFERIORES E GLÚTEOS (1)/barbell-hip-thrust (1).mp4",
  "MEMBROS INFERIORES E GLÚTEOS (1)/barbell-romanian-deadlift-movement (1).mp4",
  "MEMBROS INFERIORES E GLÚTEOS (1)/benefits-of-farmers-walks (1).mp4",
  "MEMBROS INFERIORES E GLÚTEOS (1)/bodyweight-hip-thrust (1).mp4",
  "MEMBROS INFERIORES E GLÚTEOS (1)/bulgarian-split-spuat (1).mp4",
  "MEMBROS INFERIORES E GLÚTEOS (1)/Bulgaro com barra (1).mp4",
  "MEMBROS INFERIORES E GLÚTEOS (1)/Bulgaro com halteres (1).mp4",
  "MEMBROS INFERIORES E GLÚTEOS (1)/cable-kickback (1).mp4",
  "MEMBROS INFERIORES E GLÚTEOS (1)/cable-step-up (1).mp4",
  "MEMBROS INFERIORES E GLÚTEOS (1)/Cadeira abdutora (1).mp4",
  "MEMBROS INFERIORES E GLÚTEOS (1)/Cadeira adutora (1).mp4",
  "MEMBROS INFERIORES E GLÚTEOS (1)/Cadeira extensora (1).mp4",
  "MEMBROS INFERIORES E GLÚTEOS (1)/Cadeira extensora unilateral (1).mp4",
  "MEMBROS INFERIORES E GLÚTEOS (1)/Cadeira flexora (1).mp4",
  "MEMBROS INFERIORES E GLÚTEOS (1)/Clean (1).mp4",
  "MEMBROS INFERIORES E GLÚTEOS (1)/dumbbell-good-morning (1).mp4",
  "MEMBROS INFERIORES E GLÚTEOS (1)/Elevação pélvica (1).mp4",
  "MEMBROS INFERIORES E GLÚTEOS (1)/ELEVAÇÃO PÉLVICA APOIO UNILATERAL (1).mp4",
  "MEMBROS INFERIORES E GLÚTEOS (1)/Elevação pélvica pés elevados (1).mp4",
  "MEMBROS INFERIORES E GLÚTEOS (1)/Elevação pélvica pés elevados 02 (1).mp4",
  "MEMBROS INFERIORES E GLÚTEOS (1)/Elevação pélvica unilateral (1).mp4",
  "MEMBROS INFERIORES E GLÚTEOS (1)/Extensão 6 apoios (1).mp4",
  "MEMBROS INFERIORES E GLÚTEOS (1)/Extensão de quadril 01 (1).mp4",
  "MEMBROS INFERIORES E GLÚTEOS (1)/Extensão de quadril banco romano 02 (1).mp4",
  "MEMBROS INFERIORES E GLÚTEOS (1)/Extensão de quadril elastico (1).mp4",
  "MEMBROS INFERIORES E GLÚTEOS (1)/Extensão de quadril graviton (1).mp4",
  "MEMBROS INFERIORES E GLÚTEOS (1)/Extensão glúteo no cabo (1).mp4",
  "MEMBROS INFERIORES E GLÚTEOS (1)/Flexão nórdica (1).mp4",
  "MEMBROS INFERIORES E GLÚTEOS (1)/Flexora em pé unilateral (1).mp4",
  "MEMBROS INFERIORES E GLÚTEOS (1)/Flexora máquina (1).mp4",
  "MEMBROS INFERIORES E GLÚTEOS (1)/Flexora no cabo (1).mp4",
  "MEMBROS INFERIORES E GLÚTEOS (1)/frog-pump (1).mp4",
  "MEMBROS INFERIORES E GLÚTEOS (1)/Front squat (1).mp4",
  "MEMBROS INFERIORES E GLÚTEOS (1)/glute-bridge (1).mp4",
  "MEMBROS INFERIORES E GLÚTEOS (1)/Gluteo 4 apoios máquina (1).mp4",
  "MEMBROS INFERIORES E GLÚTEOS (1)/Gluteo máquina (1).mp4",
  "MEMBROS INFERIORES E GLÚTEOS (1)/Gluteos no banco (1).mp4",
  "MEMBROS INFERIORES E GLÚTEOS (1)/Good morning (1).mp4",
  "MEMBROS INFERIORES E GLÚTEOS (1)/heel-elevated-hip-thrust (1).mp4",
  "MEMBROS INFERIORES E GLÚTEOS (1)/Hip thrust (1).mp4",
  "MEMBROS INFERIORES E GLÚTEOS (1)/Hip thrust 02 (1).mp4",
  "MEMBROS INFERIORES E GLÚTEOS (1)/Hip thrust smith (1).mp4",
  "MEMBROS INFERIORES E GLÚTEOS (1)/Leg press 45 (1).mp4",
  "MEMBROS INFERIORES E GLÚTEOS (1)/Leg press 45 02 (1).mp4",
  "MEMBROS INFERIORES E GLÚTEOS (1)/Leg press 45 unilateral (1).mp4",
  "MEMBROS INFERIORES E GLÚTEOS (1)/Leg press horizontal (1).mp4",
  "MEMBROS INFERIORES E GLÚTEOS (1)/Levantamento terra (1).mp4",
  "MEMBROS INFERIORES E GLÚTEOS (1)/Mesa flexora (1).mp4",
  "MEMBROS INFERIORES E GLÚTEOS (1)/Mesa flexora unilateral (1).mp4",
  "MEMBROS INFERIORES E GLÚTEOS (1)/Passadas com halteres (1).mp4",
  "MEMBROS INFERIORES E GLÚTEOS (1)/Pistol (1).mp4",
  "MEMBROS INFERIORES E GLÚTEOS (1)/Pistol 02 (1).mp4",
  "MEMBROS INFERIORES E GLÚTEOS (1)/Recuo (1).mp4",
  "MEMBROS INFERIORES E GLÚTEOS (1)/reverse-hyperextension (1).mp4",
  "MEMBROS INFERIORES E GLÚTEOS (1)/single-leg-glute-bridge (1).mp4",
  "MEMBROS INFERIORES E GLÚTEOS (1)/single-leg-hip-thrust-muscles (1).mp4",
  "MEMBROS INFERIORES E GLÚTEOS (1)/Step up 01 (1).mp4",
  "MEMBROS INFERIORES E GLÚTEOS (1)/Stiff (1).mp4",
  "MEMBROS INFERIORES E GLÚTEOS (1)/Stiff 03 (1).mp4",
  "MEMBROS INFERIORES E GLÚTEOS (1)/Stiff com halteres (1).mp4",
  "MEMBROS INFERIORES E GLÚTEOS (1)/Stiff02 (1).mp4",
  "MEMBROS INFERIORES E GLÚTEOS (1)/straight-leg-glute-bridge (1).mp4",
  "MEMBROS INFERIORES E GLÚTEOS (1)/Terra barra hexagonal (1).mp4",
  "MEMBROS INFERIORES E GLÚTEOS (1)/terra na máquina (1).mp4",
  "MEMBROS INFERIORES E GLÚTEOS (1)/Terra sumo (1).mp4",
  "PANTURRILHA (1)/cable-standing-calf-raise (1).mp4",
  "PANTURRILHA (1)/calf-squats (1).mp4",
  "PANTURRILHA (1)/donkey-calf-raise (1).mp4",
  "PANTURRILHA (1)/dumbbell-calf-raise (1).mp4",
  "PANTURRILHA (1)/Gemeos sentado (1).mp4",
  "PANTURRILHA (1)/leg-press-calf-raise (1).mp4",
  "PANTURRILHA (1)/negative-calf-raise (1).mp4",
  "PANTURRILHA (1)/Panturrilha com halteres (1).mp4",
  "PANTURRILHA (1)/Panturrilha em pé máquina (1).mp4",
  "PANTURRILHA (1)/Panturrilha em pé unilateral (1).mp4",
  "PANTURRILHA (1)/Panturrilha leg 45 (1).mp4",
  "PANTURRILHA (1)/Panturrilha leg press horizontal (1).mp4",
  "PANTURRILHA (1)/Panturrilha maquina 02 (1).mp4",
  "PANTURRILHA (1)/seated-calf-raise (1).mp4",
  "PANTURRILHA (1)/seated-calf-raise-dumbbell (1).mp4",
  "PANTURRILHA (1)/single-leg-calf-raise (1).mp4",
  "PANTURRILHA (1)/smith-machine-calf-raise (1).mp4",
  "PANTURRILHA (1)/Sóleo 01 (1).mp4",
  "PANTURRILHA (1)/standing-calf-raise (2).mp4",
  "PANTURRILHA (1)/standing-calf-raise (3).mp4",
  "PEITORAL (1)/Apoio batendo palmas (1).mp4",
  "PEITORAL (1)/barbell-decline-bench-press (1).mp4",
  "PEITORAL (1)/barbell-pullover (1).mp4",
  "PEITORAL (1)/bench-press-feet-up (1).mp4",
  "PEITORAL (1)/cable-cross-over (1).mp4",
  "PEITORAL (1)/cable-fly (1).mp4",
  "PEITORAL (1)/chest-press-machine (1).mp4",
  "PEITORAL (1)/Cross over 1 (1).mp4",
  "PEITORAL (1)/Cross over 2 (1).mp4",
  "PEITORAL (1)/Cross over alto (1).mp4",
  "PEITORAL (1)/Cross over polia baixa (1).mp4",
  "PEITORAL (1)/CROSSOVER (1).mp4",
  "PEITORAL (1)/Crucifico com halteres (1).mp4",
  "PEITORAL (1)/Crucifixo inclinado com halteres (1).mp4",
  "PEITORAL (1)/Crucifixo inclinado no cabo 2 (1).mp4",
  "PEITORAL (1)/Crucifixo máquina (1).mp4",
  "PEITORAL (1)/Crucifixo pegada pronada (1).mp4",
  "PEITORAL (1)/CRUCIFIXO POLIA BAIXA (1).mp4",
  "PEITORAL (1)/Crucifixo unilateral declinado (1).mp4",
  "PEITORAL (1)/Declinado smith (1).mp4",
  "PEITORAL (1)/decline-cable-fly (1).mp4",
  "PEITORAL (1)/decline-push-up (1).mp4",
  "PEITORAL (1)/deficit-push-ups (1).mp4",
  "PEITORAL (1)/dumbbell-chest-press (1).mp4",
  "PEITORAL (1)/dumbbell-floor-press (1).mp4",
  "PEITORAL (1)/dumbbell-one-arm-chest-press (1).mp4",
  "PEITORAL (1)/dumbbell-pullover (1).mp4",
  "PEITORAL (1)/Elevação frontal diagonal (1).mp4",
  "PEITORAL (1)/Flexão aberta lateral (1).mp4",
  "PEITORAL (1)/Flexão apoio alto (1).mp4",
  "PEITORAL (1)/Flexão apoio alto banco (1).mp4",
  "PEITORAL (1)/Flexão assistida (1).mp4",
  "PEITORAL (1)/Flexão com apoio dos joelhos (1).mp4",
  "PEITORAL (1)/high-cable-fly (1).mp4",
  "PEITORAL (1)/INCLINADO NO SMITH (1).mp4",
  "PEITORAL (1)/incline-barbell-bench-press (1).mp4",
  "PEITORAL (1)/knee-push-ups (1).mp4",
  "PEITORAL (1)/low-cable-chest-flys (1).mp4",
  "PEITORAL (1)/Paralelas (1).mp4",
  "PEITORAL (1)/Paralelas graviton (1).mp4",
  "PEITORAL (1)/Peck deck (1).mp4",
  "PEITORAL (1)/pike-push-up (1).mp4",
  "PEITORAL (1)/plyometric-push-ups (1).mp4",
  "PEITORAL (1)/Press alto inclinado (1).mp4",
  "PEITORAL (1)/Press peitoral (1).mp4",
  "PEITORAL (1)/Press peitoral 3 (1).mp4",
  "PEITORAL (1)/Press peitoral cabo (1).mp4",
  "PEITORAL (1)/Pullover apoio dorsal (1).mp4",
  "PEITORAL (1)/Pullover com instabilidade (1).mp4",
  "PEITORAL (1)/Pullover máquina (1).mp4",
  "PEITORAL (1)/push-up-bars (1).mp4",
  "PEITORAL (1)/Supino (1).mp4",
  "PEITORAL (1)/SUPINO ALTERNADO COM HALTERES (1).mp4",
  "PEITORAL (1)/Supino barra (1).mp4",
  "PEITORAL (1)/Supino canadense (1).mp4",
  "PEITORAL (1)/Supino com halteres (1).mp4",
  "PEITORAL (1)/Supino fechado com halteres (1).mp4",
  "PEITORAL (1)/Supino incliando com halteres (1).mp4",
  "PEITORAL (1)/Supino inclinado (1).mp4",
  "PEITORAL (1)/Supino inclinado cabo (1).mp4",
  "PEITORAL (1)/Supino máquina (1).mp4",
  "PEITORAL (1)/Supino smith (1).mp4",
  "PEITORAL (1)/weighted-dips (1).mp4",
  "TRÍCEPS (1)/bench-tricep-dips (1).mp4",
  "TRÍCEPS (1)/cable-tricep-kickback (1).mp4",
  "TRÍCEPS (1)/cable-tricep-overhead-extensions (1).mp4",
  "TRÍCEPS (1)/close-grip-bench-press-movement (1).mp4",
  "TRÍCEPS (1)/dumbbell-tricep-kickback (1).mp4",
  "TRÍCEPS (1)/Extensão no elástico (1).mp4",
  "TRÍCEPS (1)/Extensão unilateral (1).mp4",
  "TRÍCEPS (1)/Extensão unilateral no cabo (1).mp4",
  "TRÍCEPS (1)/ez-bar-tricep-pushdown (1).mp4",
  "TRÍCEPS (1)/Flexão diamante (1).mp4",
  "TRÍCEPS (1)/Mergulho banco (1).mp4",
  "TRÍCEPS (1)/overhead-cable-tricep-extension (1).mp4",
  "TRÍCEPS (1)/Paralelas (1).mp4",
  "TRÍCEPS (1)/Paralelas no graviton (1).mp4",
  "TRÍCEPS (1)/sphinx-push-up (1).mp4",
  "TRÍCEPS (1)/tricep-overhead-extensions (1).mp4",
  "TRÍCEPS (1)/Triceps coice com halteres (1).mp4",
  "TRÍCEPS (1)/Triceps coice no cabo (1).mp4",
  "TRÍCEPS (1)/Triceps com coice com halteres 2 (1).mp4",
  "TRÍCEPS (1)/Triceps cord (1).mp4",
  "TRÍCEPS (1)/Triceps extensão unilateral (1).mp4",
  "TRÍCEPS (1)/Triceps fechado (1).mp4",
  "TRÍCEPS (1)/Triceps frances (1).mp4",
  "TRÍCEPS (1)/Triceps frances barra w (1).mp4",
  "TRÍCEPS (1)/Triceps frances com barra (1).mp4",
  "TRÍCEPS (1)/Triceps frances inclinado com halter (1).mp4",
  "TRÍCEPS (1)/Triceps frances no cabo com corda (1).mp4",
  "TRÍCEPS (1)/Triceps frances sentado (1).mp4",
  "TRÍCEPS (1)/Triceps frances unilateral cabo (1).mp4",
  "TRÍCEPS (1)/Triceps frances unilateral sentado (1).mp4",
  "TRÍCEPS (1)/Triceps máquina 01 (1).mp4",
  "TRÍCEPS (1)/Triceps maquina 02 (1).mp4",
  "TRÍCEPS (1)/Triceps pulley (1).mp4",
  "TRÍCEPS (1)/Triceps pulley pronado (1).mp4",
  "TRÍCEPS (1)/Triceps pulley supinado (1).mp4",
  "TRÍCEPS (1)/Triceps supinado 02 (1).mp4",
  "TRÍCEPS (1)/Triceps testa 01 (1).mp4",
  "TRÍCEPS (1)/Triceps testa com halteres (1).mp4",
  "TRÍCEPS (1)/Triceps testa incliando 02 (1).mp4",
  "TRÍCEPS (1)/Triceps testa inclinado (1).mp4",
  "TRÍCEPS (1)/Triceps testa no cabo (1).mp4",
  "TRÍCEPS (1)/Triceps testa polia alta (1).mp4",
  "TRÍCEPS (1)/Triceps testa supinado (1).mp4",
  "TRÍCEPS (1)/Triceps testa unilateral (1).mp4",
  "TRÍCEPS (1)/Triceps unilateral cabo ajoelhado (1).mp4",
  "TRÍCEPS (1)/v-bar-tricep-pushdown (1).mp4"
];
const curatedExercises = [
  { id: "supino-reto", name: "Supino Reto", type: "Musculação", muscle: "Peito", equipment: "Barra", biomechanics: "Empurrar horizontal", instructions: ["Deite no banco com os pés firmes no chão", "Pegada um pouco mais aberta que os ombros", "Desça a barra controlado até o peito", "Empurre explosivo mantendo escápulas retraídas"], mistakes: ["Arquear lombar excessivamente", "Cotovelos abertos 90°", "Saltar barra do peito"], alternatives: ["supino-halter", "flexao"] },
  { id: "supino-halter", name: "Supino com Halteres", type: "Musculação", muscle: "Peito", equipment: "Banco", biomechanics: "Empurrar horizontal", instructions: ["Halteres na altura do peito", "Empurre em arco até quase tocar"], mistakes: ["Travar cotovelos", "Pouca amplitude"], alternatives: ["supino-reto", "crucifixo"] },
  { id: "crucifixo", name: "Crucifixo", type: "Musculação", muscle: "Peito", equipment: "Halteres", biomechanics: "Adução horizontal", instructions: ["Cotovelos levemente flexionados", "Abra controlado e feche contraindo o peito"], mistakes: ["Descer demais e perder tensão"], alternatives: ["crossover"] },
  { id: "crossover", name: "Crossover Cabos", type: "Musculação", muscle: "Peito", equipment: "Cabos", biomechanics: "Adução horizontal", instructions: ["Inclinação leve à frente", "Puxe cruzando à frente"], mistakes: ["Usar peso demais"], alternatives: ["crucifixo"] },
  { id: "remada-curvada", name: "Remada Curvada", type: "Musculação", muscle: "Costas", equipment: "Barra", biomechanics: "Puxar horizontal", instructions: ["Tronco a 45°", "Puxe a barra ao umbigo", "Aperte escápulas"], mistakes: ["Tronco subindo a cada repetição"], alternatives: ["remada-baixa", "remada-australiana"] },
  { id: "remada-baixa", name: "Remada Baixa", type: "Musculação", muscle: "Costas", equipment: "Cabos", biomechanics: "Puxar horizontal", instructions: ["Coluna neutra", "Puxe ao abdômen"], mistakes: ["Balançar tronco"], alternatives: ["remada-curvada"] },
  { id: "puxada-frente", name: "Puxada Frontal", type: "Musculação", muscle: "Costas", equipment: "Cabos", biomechanics: "Puxar vertical", instructions: ["Pegada pronada larga", "Puxe ao peito alto"], mistakes: ["Inclinar demais"], alternatives: ["barra-fixa"] },
  { id: "barra-fixa", name: "Barra Fixa", type: "Calistenia", muscle: "Costas", equipment: "Barra fixa", biomechanics: "Puxar vertical", instructions: ["Suba até queixo passar a barra", "Desça controlado total"], mistakes: ["Balanço com pernas"], alternatives: ["puxada-frente"] },
  { id: "desenvolvimento", name: "Desenvolvimento Militar", type: "Musculação", muscle: "Ombros", equipment: "Barra", biomechanics: "Empurrar vertical", instructions: ["Barra na altura do queixo", "Empurre acima da cabeça"], mistakes: ["Arquear lombar"], alternatives: ["desenvolvimento-halter"] },
  { id: "desenvolvimento-halter", name: "Desenvolvimento com Halteres", type: "Musculação", muscle: "Ombros", equipment: "Halteres", biomechanics: "Empurrar vertical", instructions: ["Halteres na altura dos ombros", "Suba em arco"], mistakes: ["Tocar halteres no topo bruscamente"], alternatives: ["desenvolvimento"] },
  { id: "elevacao-lateral", name: "Elevação Lateral", type: "Musculação", muscle: "Ombros", equipment: "Halteres", biomechanics: "Abdução", instructions: ["Cotovelos levemente flexionados", "Suba até linha do ombro"], mistakes: ["Usar trapézio"], alternatives: ["elevacao-cabos"] },
  { id: "elevacao-cabos", name: "Elevação Lateral Cabos", type: "Musculação", muscle: "Ombros", equipment: "Cabos", biomechanics: "Abdução", instructions: ["Cabo cruza pelo corpo"], mistakes: ["Inclinar tronco"], alternatives: ["elevacao-lateral"] },
  { id: "rosca-direta", name: "Rosca Direta", type: "Musculação", muscle: "Bíceps", equipment: "Barra", biomechanics: "Flexão de cotovelo", instructions: ["Cotovelos colados ao tronco", "Suba contraindo bíceps"], mistakes: ["Balanço de tronco"], alternatives: ["rosca-alternada"] },
  { id: "rosca-alternada", name: "Rosca Alternada", type: "Musculação", muscle: "Bíceps", equipment: "Halteres", biomechanics: "Flexão de cotovelo", instructions: ["Supinação no meio do movimento"], mistakes: ["Movimento muito rápido"], alternatives: ["rosca-direta"] },
  { id: "rosca-martelo", name: "Rosca Martelo", type: "Musculação", muscle: "Bíceps", equipment: "Halteres", biomechanics: "Flexão neutra", instructions: ["Pegada neutra", "Trabalha braquial"], mistakes: ["Usar inércia"], alternatives: ["rosca-alternada"] },
  { id: "triceps-corda", name: "Tríceps Corda", type: "Musculação", muscle: "Tríceps", equipment: "Cabos", biomechanics: "Extensão", instructions: ["Cotovelos fixos", "Abra a corda no final"], mistakes: ["Mover cotovelo"], alternatives: ["triceps-frances"] },
  { id: "triceps-frances", name: "Tríceps Francês", type: "Musculação", muscle: "Tríceps", equipment: "Halteres", biomechanics: "Extensão", instructions: ["Cotovelos apontando ao teto", "Desça atrás da cabeça"], mistakes: ["Abrir cotovelos"], alternatives: ["triceps-corda"] },
  { id: "mergulho", name: "Mergulho em Paralelas", type: "Calistenia", muscle: "Tríceps", equipment: "Paralelas", biomechanics: "Empurrar vertical", instructions: ["Tronco vertical para tríceps", "Desça até 90°"], mistakes: ["Cabeça caindo à  frente"], alternatives: ["triceps-corda"] },
  { id: "agachamento", name: "Agachamento Livre", type: "Musculação", muscle: "Pernas", equipment: "Barra", biomechanics: "Agachamento", instructions: ["Barra apoiada no trapézio", "Desça até paralelo", "Suba empurrando o chão"], mistakes: ["Joelhos colapsando para dentro", "Lombar arredondada"], alternatives: ["leg-press", "agachamento-pc"] },
  { id: "leg-press", name: "Leg Press 45°", type: "Musculação", muscle: "Pernas", equipment: "Máquina", biomechanics: "Empurrar pernas", instructions: ["Pés na largura dos ombros", "Desça até 90°"], mistakes: ["Tirar quadril do banco"], alternatives: ["agachamento"] },
  { id: "stiff", name: "Stiff", type: "Musculação", muscle: "Pernas", equipment: "Barra", biomechanics: "Hip hinge", instructions: ["Pernas semi-flexionadas", "Desça com coluna neutra"], mistakes: ["Arredondar lombar"], alternatives: ["levantamento-terra"] },
  { id: "levantamento-terra", name: "Levantamento Terra", type: "Musculação", muscle: "Pernas", equipment: "Barra", biomechanics: "Hip hinge", instructions: ["Barra junto ao corpo", "Empurre o chão"], mistakes: ["Subir com lombar"], alternatives: ["stiff"] },
  { id: "cadeira-extensora", name: "Cadeira Extensora", type: "Musculação", muscle: "Pernas", equipment: "Máquina", biomechanics: "Extensão joelho", instructions: ["Contração total no topo"], mistakes: ["Parar muito no topo"], alternatives: ["agachamento"] },
  { id: "mesa-flexora", name: "Mesa Flexora", type: "Musculação", muscle: "Pernas", equipment: "Máquina", biomechanics: "Flexão joelho", instructions: ["Quadril fixo no banco"], mistakes: ["Usar quadril"], alternatives: ["stiff"] },
  { id: "panturrilha", name: "Panturrilha em Pé", type: "Musculação", muscle: "Pernas", equipment: "Máquina", biomechanics: "Flexão plantar", instructions: ["Amplitude total"], mistakes: ["Amplitude curta"], alternatives: [] },
  { id: "elevacao-quadril", name: "Elevação de Quadril", type: "Musculação", muscle: "Glúteos", equipment: "Barra", biomechanics: "Hip thrust", instructions: ["Apoio escapular no banco", "Empurre quadril ao teto"], mistakes: ["Hiperextender lombar"], alternatives: ["agachamento"] },
  { id: "abdutor", name: "Cadeira Abdutora", type: "Musculação", muscle: "Glúteos", equipment: "Máquina", biomechanics: "Abdução quadril", instructions: ["Tronco levemente à frente"], mistakes: ["Balançar"], alternatives: [] },
  { id: "panturrilha-pc", name: "Panturrilha em Pé (Peso Corporal)", type: "Calistenia", muscle: "Pernas", equipment: "Peso corporal", biomechanics: "Flexão plantar", instructions: ["Fique na ponta dos pés na borda de um degrau ou plano", "Suba ao máximo e desça abaixo do nível do calcanhar", "Controle em 2s de descida"], mistakes: ["Amplitude curta", "Usar impulso"], alternatives: ["panturrilha-halter"] },
  { id: "panturrilha-halter", name: "Panturrilha com Haltere", type: "Musculação", muscle: "Pernas", equipment: "Halteres", biomechanics: "Flexão plantar", instructions: ["Segure haltere em uma mão, apoie a outra na parede", "Suba na ponta do pé fazendo movimento completo"], mistakes: ["Amplitude curta", "Velocidade alta"], alternatives: ["panturrilha-pc"] },
  { id: "prancha", name: "Prancha", type: "Calistenia", muscle: "Core", equipment: "Peso corporal", biomechanics: "Anti-extensão", instructions: ["Linha reta corpo", "Glúteos contraídos"], mistakes: ["Quadril alto demais"], alternatives: ["abdominal"] },
  { id: "abdominal", name: "Abdominal Crunch", type: "Calistenia", muscle: "Core", equipment: "Peso corporal", biomechanics: "Flexão tronco", instructions: ["Eleve apenas escápulas"], mistakes: ["Puxar pescoço"], alternatives: ["prancha"] },
  { id: "leg-raise", name: "Elevação de Pernas", type: "Calistenia", muscle: "Core", equipment: "Barra fixa", biomechanics: "Flexão quadril", instructions: ["Pernas estendidas até 90°"], mistakes: ["Balanço"], alternatives: ["abdominal"] },
  { id: "ab-roller", name: "Ab Roller", type: "Calistenia", muscle: "Core", equipment: "Peso corporal", biomechanics: "Anti-extensão", instructions: ["Avance sem arquear lombar"], mistakes: ["Arquear lombar"], alternatives: ["prancha"] },
  { id: "flexao", name: "Flexão de Braço", type: "Calistenia", muscle: "Peito", equipment: "Peso corporal", biomechanics: "Empurrar horizontal", instructions: ["Corpo alinhado", "Desça até peito quase tocar o chão"], mistakes: ["Quadril caindo"], alternatives: ["supino-halter"] },
  { id: "flexao-fechada", name: "Flexão Fechada", type: "Calistenia", muscle: "Tríceps", equipment: "Peso corporal", biomechanics: "Extensão cotovelo", instructions: ["Mãos próximas abaixo do peito", "Cotovelos colados ao tronco na subida"], mistakes: ["Abrir cotovelos", "Quadril caindo"], alternatives: ["triceps-corda", "mergulho"] },
  { id: "dips-cadeira", name: "Dips na Cadeira", type: "Calistenia", muscle: "Tríceps", equipment: "Peso corporal", biomechanics: "Extensão cotovelo", instructions: ["Apoio nas mãos atrás do corpo", "Desça até cotovelos a 90°", "Empurre subindo sem travar"], mistakes: ["Ombros subindo", "Amplitude curta"], alternatives: ["mergulho", "flexao-fechada"] },
  { id: "remada-australiana", name: "Remada Australiana", type: "Calistenia", muscle: "Costas", equipment: "Barra fixa", biomechanics: "Puxar horizontal", instructions: ["Corpo inclinado sob a barra, calcanhar no chão", "Puxe o peito até a barra mantendo escápulas retraídas", "Desça controlado"], mistakes: ["Quadril caindo", "Usar impulso"], alternatives: ["remada-curvada", "barra-fixa"] },
  { id: "superman", name: "Superman", type: "Calistenia", muscle: "Costas", equipment: "Peso corporal", biomechanics: "Extensão", instructions: ["Deite de bruços com braços estendidos à frente", "Eleve peito e pernas simultaneamente contraindo as costas", "Segure 2s no topo e desça controlado"], mistakes: ["Usar impulso", "Pescoço tenso"], alternatives: ["remada-australiana"] },
  { id: "curl-barra-fixa", name: "Rosca na Barra Fixa", type: "Calistenia", muscle: "Bíceps", equipment: "Barra fixa", biomechanics: "Flexão de cotovelo", instructions: ["Pegada supinada na barra", "Puxe concentrando a contração no bíceps", "Cotovelso na frente do corpo"], mistakes: ["Balanço corporal", "Usar as costas"], alternatives: ["rosca-direta", "remada-australiana"] },
  { id: "elevacao-toalha", name: "Elevação Lateral com Toalha", type: "Calistenia", muscle: "Ombros", equipment: "Parede", biomechanics: "Abdução", instructions: ["Toalha presa na parede ou porta", "Incline o corpo e eleve lateralmente com resistência", "Controle a descida"], mistakes: ["Usar trapézio", "Movimento rápido"], alternatives: ["elevacao-lateral", "handstand"] },
  { id: "pike-push-up", name: "Pike Push-up", type: "Calistenia", muscle: "Ombros", equipment: "Peso corporal", biomechanics: "Empurrar vertical", instructions: ["Quadril elevado formando V invertido", "Desça a cabeça entre as mãos", "Empurre subindo sem abrir o quadril"], mistakes: ["Quadril caindo", "Cotovelos muito abertos"], alternatives: ["handstand", "desenvolvimento"] },
  { id: "agachamento-pc", name: "Agachamento Livre (Peso Corporal)", type: "Calistenia", muscle: "Pernas", equipment: "Peso corporal", biomechanics: "Agachamento", instructions: ["Pés na largura dos ombros", "Desça até coxa paralela ao chão", "Suba empurrando com os calcanhares"], mistakes: ["Joelhos colapsando para dentro", "Levantar calcanhares"], alternatives: ["agachamento-bulgaro-pc", "pistol-squat"] },
  { id: "afundo-pc", name: "Afundo (Peso Corporal)", type: "Calistenia", muscle: "Pernas", equipment: "Peso corporal", biomechanics: "Agachamento unilateral", instructions: ["Dê um passo largo à frente", "Desça o joelho traseiro próximo ao chão", "Suba e alterne as pernas"], mistakes: ["Tronco muito inclinado", "Joelho ultrapassar o pé"], alternatives: ["agachamento-bulgaro-pc", "pistol-squat"] },
  { id: "agachamento-bulgaro-pc", name: "Agachamento Búlgaro", type: "Calistenia", muscle: "Pernas", equipment: "Peso corporal", biomechanics: "Agachamento unilateral", instructions: ["Pé traseiro elevado num banco ou degrau", "Desça o joelho traseiro próximo ao chão", "Suba empurrando com o calcanhar da frente"], mistakes: ["Joelho ultrapassar muito o pé", "Tronco muito inclinado"], alternatives: ["pistol-squat", "afundo-pc"] },
  { id: "hip-thrust-solo", name: "Hip Thrust no Solo", type: "Calistenia", muscle: "Glúteos", equipment: "Peso corporal", biomechanics: "Hip thrust", instructions: ["Deite com joelhos dobrados e pés no chão", "Eleve o quadril contraindo glúteos no topo", "Segure 2s no pico e desça controlado"], mistakes: ["Hiperextender lombar", "Usar impulso"], alternatives: ["elevacao-quadril", "agachamento-bulgaro-pc"] },
  { id: "ponte-gluteos-unilateral", name: "Ponte de Glúteos Unilateral", type: "Calistenia", muscle: "Glúteos", equipment: "Peso corporal", biomechanics: "Hip thrust", instructions: ["Deite com uma perna estendida", "Eleve o quadril empurrando com o calcanhar da perna apoiada", "Contraia glúteos no topo e desça controlado"], mistakes: ["Usar impulso", "Quadril torto"], alternatives: ["hip-thrust-solo", "elevacao-quadril"] },
  { id: "muscle-up", name: "Muscle Up", type: "Calistenia", muscle: "Costas", equipment: "Barra fixa", biomechanics: "Puxar + Empurrar", instructions: ["Explosão na transição"], mistakes: ["Falta de puxada alta"], alternatives: ["barra-fixa"] },
  { id: "pistol-squat", name: "Pistol Squat", type: "Calistenia", muscle: "Pernas", equipment: "Peso corporal", biomechanics: "Agachamento unilateral", instructions: ["Equilíbrio em uma perna"], mistakes: ["Calcanhar levantando"], alternatives: ["agachamento-bulgaro-pc"] },
  { id: "handstand", name: "Handstand Push-up", type: "Calistenia", muscle: "Ombros", equipment: "Parede", biomechanics: "Empurrar vertical invertido", instructions: ["Cabeça toca o chão controlado"], mistakes: ["Hiperextender lombar"], alternatives: ["pike-push-up"] },
  { id: "front-lever", name: "Front Lever", type: "Calistenia", muscle: "Core", equipment: "Barra fixa", biomechanics: "Isometria", instructions: ["Corpo paralelo ao chão"], mistakes: ["Quadril caindo"], alternatives: ["leg-raise"] }
];
const strengthType = curatedExercises[0].type;
const calisthenicsType = curatedExercises.find((exercise) => exercise.type !== strengthType)?.type ?? strengthType;
const chestMuscle = curatedExercises.find((exercise) => exercise.id === "supino-reto").muscle;
const backMuscle = curatedExercises.find((exercise) => exercise.id === "remada-curvada").muscle;
const shouldersMuscle = curatedExercises.find((exercise) => exercise.id === "desenvolvimento").muscle;
const bicepsMuscle = curatedExercises.find((exercise) => exercise.id === "rosca-direta").muscle;
const tricepsMuscle = curatedExercises.find((exercise) => exercise.id === "triceps-corda").muscle;
const legsMuscle = curatedExercises.find((exercise) => exercise.id === "agachamento").muscle;
const glutesMuscle = curatedExercises.find((exercise) => exercise.id === "elevacao-quadril").muscle;
const coreMuscle = curatedExercises.find((exercise) => exercise.id === "prancha").muscle;
const forearmMuscle = "Antebraço";
const fullBodyMuscle = coreMuscle;
const catalogMuscleMap = [
  { match: "ABDOMEN CORE", muscle: coreMuscle },
  { match: "BICEPS", muscle: bicepsMuscle },
  { match: "ANTEBRACO", muscle: forearmMuscle },
  { match: "TRICEPS", muscle: tricepsMuscle },
  { match: "TRICEP", muscle: tricepsMuscle },
  { match: "PEITORAL", muscle: chestMuscle },
  { match: "PEITO", muscle: chestMuscle },
  { match: "DELTOIDES", muscle: shouldersMuscle },
  { match: "COSTAS", muscle: backMuscle },
  { match: "TRAPEZIO", muscle: backMuscle },
  { match: "OMBRO", muscle: shouldersMuscle },
  { match: "PANTURRILHA", muscle: legsMuscle },
  { match: "GLUTEOS", muscle: glutesMuscle },
  { match: "GLUTEO", muscle: glutesMuscle },
  { match: "PERNAS", muscle: legsMuscle },
  { match: "MEMBROS INFERIORES", muscle: legsMuscle },
  { match: "GLUTE", muscle: glutesMuscle },
  { match: "FOREARM", muscle: forearmMuscle },
  { match: "FULL BODY", muscle: coreMuscle }
];
const calisthenicsKeywords = [
  "pull up",
  "chin up",
  "pushup",
  "push up",
  "muscle up",
  "handstand",
  "front lever",
  "back lever",
  "planche",
  "human flag",
  "pistol",
  "dip",
  "parallel",
  "bars",
  "inverted row",
  "sphinx",
  "dragon flag",
  "prancha",
  "plank",
  "l sit",
  "toes to bar",
  "abdominal",
  "crunch",
  "sit up",
  "bicicleta",
  "prancha",
  "barra livre"
];
const gymEquipmentKeywords = [
  "halter",
  "dumbbell",
  "barra",
  "barbell",
  "anilha",
  "plate",
  "pulley",
  "smith",
  "guiada",
  "polia",
  "cabo",
  "cable",
  "cross",
  "crossover",
  "maquina",
  "machine",
  "chest press",
  "shoulder press",
  "press peitoral",
  "press alto",
  "supino",
  "fly",
  "peitoral",
  "leg press",
  "extensora",
  "flexora",
  "hack",
  "bench press"
];
const chestBodyweightOverrides = [
  "apoio batendo palmas",
  "apoio de frente com medball",
  "apoio de frente de joelhos",
  "decline push up",
  "deficit push ups",
  "flex de cotovelo declinado utilizando o banco",
  "flexao aberta lateral",
  "flexao apoio alto",
  "flexao assistida",
  "flex de cotovelo braços aberto",
  "flex de cotovelo completa",
  "knee push ups",
  "pike push up",
  "plyometric push ups",
  "push up bars",
  "paralelas"
];
const gymCableOverrides = [
  "puxada alta nuca",
  "puxada alta tradicional",
  "puxada alta triangulo",
  "puxada cruzada",
  "remada aberta",
  "remada",
  "crucifixo baixo no croos em pe",
  "crucifixo baixo no cross em pe"
];
const coreOverrides = [
  "declinado smith"
];
const corePathOverrides = [
  "PEITORAL (1)/DECLINADO SMITH"
];
const catalogOverrides = [
  { match: "cadeira flex", muscle: legsMuscle, type: strengthType, equipment: "Maquina" },
  { match: "avanco", muscle: legsMuscle, type: strengthType, equipment: "Halteres" },
  { match: "agachamento pes afastados", muscle: legsMuscle, type: strengthType, equipment: "Barra" },
  { match: "agachamento sumo peso corporal", muscle: legsMuscle, type: strengthType, equipment: "Halteres" },
  { match: "facepull", muscle: backMuscle, type: strengthType, equipment: "Cabos" },
  { match: "cable fly", muscle: shouldersMuscle, type: strengthType, equipment: "Cabos" },
  { match: "cable rear delt fly", muscle: shouldersMuscle, type: strengthType, equipment: "Cabos" },
  { match: "rear delt fly", muscle: shouldersMuscle, type: strengthType, equipment: "Cabos" },
  { match: "abs lateral", muscle: coreMuscle, type: strengthType, equipment: "Maquina" },
  { match: "aducao deitada unilateral", muscle: legsMuscle, type: strengthType, equipment: "Maquina" },
  { match: "afundo lateral com barra", muscle: legsMuscle, type: strengthType, equipment: "Barra" },
  { match: "flexora em pe unilateral", muscle: legsMuscle, type: strengthType, equipment: "Maquina" },
  { match: "flexao de joelho", muscle: legsMuscle, type: strengthType, equipment: "Maquina" },
  { match: "mesa flexora", muscle: legsMuscle, type: strengthType, equipment: "Maquina" },
  { match: "pulley pegada aberta atras da nuca", muscle: backMuscle, type: strengthType, equipment: "Cabos" },
  { match: "pulley pegada aberta pronada", muscle: backMuscle, type: strengthType, equipment: "Cabos" },
  { match: "crucifixo polia baixa", muscle: shouldersMuscle, type: strengthType, equipment: "Cabos" },
  { match: "crucifixo invertido polia baixa", muscle: shouldersMuscle, type: strengthType, equipment: "Cabos" },
  { match: "crucifixo inverto com halteres", muscle: shouldersMuscle, type: strengthType, equipment: "Halteres" },
  { match: "crucifixo invertido com halter", muscle: shouldersMuscle, type: strengthType, equipment: "Halteres" },
  { match: "crucifixo invertido na maquina", muscle: shouldersMuscle, type: strengthType, equipment: "Maquina" },
  { match: "voador invertido", muscle: backMuscle, type: strengthType, equipment: "Maquina" },
  { match: "elevacao lateral com halters", muscle: shouldersMuscle, type: strengthType, equipment: "Halteres" },
  { match: "elevacao do cotovelo unilateral", muscle: shouldersMuscle, type: strengthType, equipment: "Halteres" },
  { match: "fitness gifs 4 u", muscle: backMuscle, type: strengthType, equipment: "Barra" },
  { match: "arnold dips maschine", muscle: tricepsMuscle, type: strengthType, equipment: "Maquina" },
  { match: "triceps coice com halteres", muscle: tricepsMuscle, type: strengthType, equipment: "Halteres" },
  { match: "extensao unilateral", muscle: forearmMuscle, type: strengthType, equipment: "Barra" },
  { match: "frontal lateral invertido", muscle: shouldersMuscle, type: strengthType, equipment: "Halteres" },
  { match: "gemeos sentado", muscle: legsMuscle, type: strengthType, equipment: "Maquina" },
  { match: "negative calf raise", muscle: legsMuscle, type: strengthType, equipment: "Maquina" },
  { match: "reverse hyperextension", muscle: glutesMuscle, type: strengthType, equipment: "Maquina" },
  { match: "extensao no elastico", muscle: glutesMuscle, type: strengthType, equipment: "Elastico" },
  { match: "flex de joelho em pe no cabo cross", muscle: backMuscle, type: calisthenicsType, equipment: "Barra fixa" }
];
const strengthNameKeywords = [
  "agachamento frontal",
  "agachamento livre",
  "agachamento sumo",
  "agachamento bulgaro",
  "supino",
  "remada",
  "puxada",
  "levantamento",
  "terra",
  "stiff",
  "rosca",
  "triceps",
  "tricep",
  "desenvolvimento",
  "elevacao lateral",
  "crucifixo",
  "crossover",
  "extensora",
  "flexora",
  "leg press",
  "panturrilha",
  "abdutora",
  "abdutor",
  "adutora",
  "afundo",
  "passada",
  "hack",
  "smith",
  "curl",
  "pulldown",
  "row",
  "bench press",
  "facepull",
  "face pull",
  "voador",
  "voador invertido",
  "voador inverso",
  "front squat",
  "goblet squat",
  "lunge"
];
const explicitBodyweightKeywords = [
  "peso corporal",
  "bodyweight",
  "com salto",
  "jump squat",
  "pistol squat",
  "push up",
  "pushup",
  "pull up",
  "pullup",
  "chin up",
  "chinup",
  "barra fixa",
  "prancha",
  "plank",
  "abdominal",
  "crunch",
  "sit up",
  "flexao",
  "flexao de braco",
  "paralela",
  "dip"
];
function normalizeCatalogValue(value) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[._]/g, " ").toLowerCase();
}
function toTitleCase(value) {
  return value.split(" ").filter(Boolean).map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(" ");
}
function inferMuscleFromCatalog(path) {
  const normalized = normalizeCatalogValue(path).toUpperCase();
  const normalizedName = normalizeCatalogValue(extractCatalogName(path));
  const override = catalogOverrides.find((item) => normalizedName.includes(item.match));
  if (override) return override.muscle;
  const folderMatch = catalogMuscleMap.find((item) => normalized.includes(item.match));
  if (folderMatch) {
    return folderMatch.muscle;
  }
  if (normalizedName.includes("abs") || normalizedName.includes("abdominal") || normalizedName.includes("crunch") || normalizedName.includes("prancha") || normalizedName.includes("plank") || normalizedName.includes("leg raise") || normalizedName.includes("knee raise") || normalizedName.includes("core")) {
    return coreMuscle;
  }
  if (normalizedName.includes("aducao") || normalizedName.includes("abducao") || normalizedName.includes("afundo") || normalizedName.includes("agachamento") || normalizedName.includes("passada") || normalizedName.includes("avanco") || normalizedName.includes("lunge") || normalizedName.includes("stiff") || normalizedName.includes("terra") || normalizedName.includes("leg press") || normalizedName.includes("extensora") || normalizedName.includes("flexora")) {
    return legsMuscle;
  }
  if (normalizedName.includes("glute") || normalizedName.includes("gluteo") || normalizedName.includes("gluteos") || normalizedName.includes("hip thrust") || normalizedName.includes("coice de gluteo") || normalizedName.includes("coice no cabo") || normalizedName.includes("kickback") || normalizedName.includes("abdutora")) {
    return glutesMuscle;
  }
  if (normalizedName.includes("ombro") || normalizedName.includes("deltoid") || normalizedName.includes("deltoide") || normalizedName.includes("deltoides") || normalizedName.includes("elevacao lateral") || normalizedName.includes("elevacao frontal") || normalizedName.includes("desenvolvimento") || normalizedName.includes("arnold") || normalizedName.includes("frontal") || normalizedName.includes("lateral") || normalizedName.includes("encolhimento") || normalizedName.includes("shrug")) {
    return shouldersMuscle;
  }
  if (normalizedName.includes("triceps") || normalizedName.includes("tricep") || normalizedName.includes("frances") || normalizedName.includes("corda") || normalizedName.includes("coice") || normalizedName.includes("overhead extension") || normalizedName.includes("overhead extensions") || normalizedName.includes("pushdown") || normalizedName.includes("testa")) {
    return tricepsMuscle;
  }
  if (normalizedName.includes("biceps") || normalizedName.includes("rosca") || normalizedName.includes("curl") || normalizedName.includes("martelo")) {
    return bicepsMuscle;
  }
  if (normalizedName.includes("costas") || normalizedName.includes("remada") || normalizedName.includes("puxada") || normalizedName.includes("pulldown") || normalizedName.includes("pulley") || normalizedName.includes("trap")) {
    return backMuscle;
  }
  if (normalizedName.includes("peito") || normalizedName.includes("supino") || normalizedName.includes("crossover") || normalizedName.includes("crucifixo") || normalizedName.includes("fly")) {
    return chestMuscle;
  }
  if (normalizedName.includes("panturrilha") || normalizedName.includes("gemeos") || normalizedName.includes("calf raise") || normalizedName.includes("calf")) {
    return legsMuscle;
  }
  if (corePathOverrides.some((keyword) => normalized.includes(keyword))) {
    return coreMuscle;
  }
  if (coreOverrides.some((keyword) => normalizedName.includes(keyword))) {
    return coreMuscle;
  }
  return coreMuscle;
}
function inferTypeFromCatalog(path) {
  const normalized = normalizeCatalogValue(path);
  const normalizedName = normalizeCatalogValue(extractCatalogName(path));
  const override = catalogOverrides.find((item) => normalizedName.includes(item.match));
  if (override) return override.type;
  const isCalisthenics = calisthenicsKeywords.some((keyword) => normalized.includes(keyword));
  const hasGymEquipment = gymEquipmentKeywords.some((keyword) => normalized.includes(keyword));
  const hasStrengthName = strengthNameKeywords.some((keyword) => normalizedName.includes(keyword));
  const isExplicitBodyweight = explicitBodyweightKeywords.some((keyword) => normalized.includes(keyword) || normalizedName.includes(keyword));
  const inferredEquipment = inferEquipmentFromCatalog(path);
  const hasStrengthEquipment = inferredEquipment === "Barra" || inferredEquipment === "Halteres" || inferredEquipment === "Cabos" || inferredEquipment === "Maquina";
  const bodyweightStyleEquipment = inferredEquipment === "Peso corporal" || inferredEquipment === "Barra fixa" || inferredEquipment === "Paralelas" || inferredEquipment === "Parede" || inferredEquipment === "TRX";
  if (chestBodyweightOverrides.some((keyword) => normalizedName.includes(keyword))) {
    return calisthenicsType;
  }
  if (gymCableOverrides.some((keyword) => normalizedName.includes(keyword))) {
    return strengthType;
  }
  if (hasStrengthEquipment && !isExplicitBodyweight) return strengthType;
  if (hasStrengthName && !isExplicitBodyweight) return strengthType;
  if (hasGymEquipment) return strengthType;
  if (isExplicitBodyweight || isCalisthenics || bodyweightStyleEquipment) {
    return calisthenicsType;
  }
  return strengthType;
}
function inferEquipmentFromCatalog(path) {
  const normalized = normalizeCatalogValue(path);
  const normalizedName = normalizeCatalogValue(extractCatalogName(path));
  const override = catalogOverrides.find((item) => normalizedName.includes(item.match));
  if (override) return override.equipment;
  const hasStrengthName = strengthNameKeywords.some((keyword) => normalizedName.includes(keyword));
  const isExplicitBodyweight = explicitBodyweightKeywords.some((keyword) => normalized.includes(keyword) || normalizedName.includes(keyword));
  if (chestBodyweightOverrides.some((keyword) => normalizedName.includes(keyword))) {
    return "Peso corporal";
  }
  if (gymCableOverrides.some((keyword) => normalizedName.includes(keyword))) {
    return "Cabos";
  }
  if (normalized.includes("barra fixa") || normalized.includes("pull-up")) return "Barra fixa";
  if (normalized.includes("paralela") || normalized.includes("dip")) return "Paralelas";
  if (normalized.includes("parede") || normalized.includes("handstand")) return "Parede";
  if (normalized.includes("maquina") || normalized.includes("machine") || normalized.includes("press") || normalized.includes("peitoral") || normalized.includes("guiada") || normalized.includes("hack") || normalized.includes("voador")) return "Maquina";
  if (normalized.includes("pulley")) return "Cabos";
  if (normalized.includes("facepull") || normalized.includes("face pull")) return "Cabos";
  if (normalized.includes("barra") || normalized.includes("barbell")) return "Barra";
  if (normalized.includes("halter") || normalized.includes("dumbbell")) return "Halteres";
  if (normalized.includes("anilha") || normalized.includes("plate")) return "Barra";
  if (normalized.includes("polia") || normalized.includes("cabo") || normalized.includes("cross") || normalized.includes("crossover") || normalized.includes("cable") || normalized.includes("fly")) return "Cabos";
  if (hasStrengthName && !isExplicitBodyweight) return "Maquina";
  if (normalized.includes("bola")) return "Bola";
  if (normalized.includes("trx")) return "TRX";
  if (normalized.includes("bench") || normalized.includes("banco")) return "Banco";
  if (isExplicitBodyweight) return "Peso corporal";
  return "Maquina";
}
function inferBiomechanicsFromCatalog(muscle, type) {
  if (muscle === "Peito") return "Empurrar horizontal";
  if (muscle === "Costas") return "Puxar";
  if (muscle === "Ombros") return "Empurrar vertical";
  if (muscle === bicepsMuscle || muscle === tricepsMuscle) return "Isolamento de braços";
  if (muscle === legsMuscle || muscle === glutesMuscle) return "Dominante de pernas";
  if (muscle === "Core") return "Estabilidade de core";
  if (muscle === forearmMuscle) return "Pegada e antebraço";
  if (type === calisthenicsType) return "Controle corporal";
  return "Movimento global";
}
function extractCatalogName(path) {
  const filename = path.split("/").pop() ?? path;
  const withoutExtension = filename.replace(/\.(gif|mp4|webm|mov)$/i, "");
  const withoutCounter = withoutExtension.replace(/\s*\(\d+\)\s*$/g, "");
  const normalized = normalizeCatalogValue(withoutCounter).replace(/-/g, " ");
  return toTitleCase(normalized);
}
function extractCatalogSourceGroup(path) {
  const folder = path.split("/")[0] ?? "";
  return toTitleCase(
    normalizeCatalogValue(folder).replace(/\(\d+\)/g, "").replace(/\s+/g, " ").trim()
  );
}
const catalogExercises = [];
const typeOrder = [strengthType, calisthenicsType];
const muscleOrder = [
  chestMuscle,
  backMuscle,
  shouldersMuscle,
  bicepsMuscle,
  tricepsMuscle,
  legsMuscle,
  glutesMuscle,
  coreMuscle,
  forearmMuscle,
  fullBodyMuscle
];
musculacaoPrincipalCatalog.forEach((path) => {
  const name = extractCatalogName(path);
  const sourceGroup = extractCatalogSourceGroup(path);
  const muscle = inferMuscleFromCatalog(path);
  const type = inferTypeFromCatalog(path);
  catalogExercises.push({
    id: `catalog-${catalogExercises.length + 1}`,
    name,
    type,
    muscle,
    sourceGroup,
    equipment: inferEquipmentFromCatalog(path),
    biomechanics: inferBiomechanicsFromCatalog(muscle, type),
    instructions: ["Abra o exercício para visualizar o GIF completo e usar este item como referência visual."],
    mistakes: ["Este item veio do catálogo automático e ainda não tem observações técnicas manuais."],
    alternatives: [],
    gifUrl: encodeURI(`/musculacao-media/${path}`)
  });
});
calistheniaPuraCatalog.forEach((path) => {
  const name = extractCatalogName(path);
  const muscle = inferMuscleFromCatalog(path);
  catalogExercises.push({
    id: `catalog-${catalogExercises.length + 1}`,
    name,
    type: calisthenicsType,
    muscle,
    sourceGroup: "Calistenia",
    equipment: inferEquipmentFromCatalog(path),
    biomechanics: inferBiomechanicsFromCatalog(muscle, calisthenicsType),
    instructions: ["Abra o exercício para visualizar o GIF completo e usar este item como referência visual."],
    mistakes: ["Este item veio do catálogo automático e ainda não tem observações técnicas manuais."],
    alternatives: [],
    gifUrl: encodeURI(`/calistenia-pura/Calistenia/${path}`)
  });
});
const compareLibraryExercises = (left, right) => {
  const typeDifference = typeOrder.indexOf(left.type) - typeOrder.indexOf(right.type);
  if (typeDifference !== 0) return typeDifference;
  const muscleDifference = muscleOrder.indexOf(left.muscle) - muscleOrder.indexOf(right.muscle);
  if (muscleDifference !== 0) return muscleDifference;
  return left.name.localeCompare(right.name);
};
const exercises = [...curatedExercises, ...catalogExercises];
const libraryExercises = [...curatedExercises, ...catalogExercises].sort(compareLibraryExercises);
function getExercise(id2) {
  return exercises.find((e) => e.id === id2);
}
const goalMap = {
  mass: "ganho_massa",
  strength: "forca",
  hybrid: "performance",
  athletic: "performance",
  weight_loss: "perda_peso",
  definition: "definicao",
  endurance: "performance",
  wellness: "saude"
};
const levelMap = {
  beginner: "iniciante",
  intermediate: "intermediario",
  advanced: "avancado"
};
const consistencyMap = {
  occasional: "ocasional",
  regular: "regular",
  elite: "elite"
};
const locationMap = {
  gym: "academia",
  home: "casa",
  hybrid: "hibrido",
  outdoor: "outdoor"
};
const resultMap = {
  hypertrophy: "ganho_massa",
  strength: "forca",
  skill: "performance",
  performance: "performance"
};
const sexMap = {
  male: "masculino",
  female: "feminino",
  other: null
};
function resolveSex(state) {
  return state.gender ? sexMap[state.gender] : null;
}
function dedupeStrings(values) {
  return Array.from(new Set((values ?? []).map((value) => value.trim()).filter(Boolean)));
}
function sortDays(days) {
  return Array.from(new Set((days ?? []).filter((day) => day >= 0 && day <= 6))).sort((a, b) => a - b);
}
function resolveGoal(state) {
  if (state.result && resultMap[state.result]) return resultMap[state.result];
  if (state.goal) return goalMap[state.goal];
  return "ganho_massa";
}
function resolveLevel(state) {
  return state.experience ? levelMap[state.experience] : "iniciante";
}
function resolveConsistency(state) {
  return state.consistency ? consistencyMap[state.consistency] : "ocasional";
}
function resolveLocation(state) {
  return state.location ? locationMap[state.location] : "academia";
}
function resolveTrainingType$1(state) {
  if (state.trainingType) return state.trainingType;
  if (state.location === "outdoor") return "calistenia";
  if (state.location === "home" && (state.equipment?.length ?? 0) === 0) return "calistenia";
  return "musculacao";
}
function resolveDuration(state) {
  if (!state.duration) return 60;
  return Math.min(120, Math.max(30, state.duration));
}
function buildAthleteProfile(onboarding, input = {}) {
  return {
    id: input.id ?? "local-athlete",
    name: input.name?.trim() || onboarding.name?.trim() || onboarding.email?.trim() || "Atleta 3D Body Scan",
    sex: input.sex ?? resolveSex(onboarding),
    age: input.age ?? onboarding.age ?? null,
    heightCm: input.heightCm ?? onboarding.height ?? null,
    weightKg: input.weightKg ?? onboarding.weight ?? null,
    goal: resolveGoal(onboarding),
    level: resolveLevel(onboarding),
    consistency: resolveConsistency(onboarding),
    location: resolveLocation(onboarding),
    equipment: dedupeStrings(onboarding.equipment),
    availableDays: sortDays(onboarding.days),
    workoutDurationMin: resolveDuration(onboarding),
    preferredFocus: dedupeStrings([...onboarding.focusMuscles ?? [], ...input.preferredFocus ?? []]),
    limitations: dedupeStrings(input.limitations),
    injuries: dedupeStrings(input.injuries),
    trainingType: resolveTrainingType$1(onboarding),
    trackCycle: onboarding.gender === "female" && Boolean(onboarding.trackCycle),
    menstrualCyclePhase: onboarding.gender === "female" && onboarding.trackCycle ? onboarding.menstrualCyclePhase ?? null : null,
    onboardingCompletedAt: onboarding.completedAt ?? null
  };
}
const bodyMeasures = [
  { key: "peito", label: "Peito", value: 102, unit: "cm", delta: 1.2, history: [99, 99.5, 100, 100.4, 100.8, 101.2, 101.5, 102] },
  { key: "cintura", label: "Cintura", value: 78, unit: "cm", delta: -0.8, history: [82, 81.4, 80.8, 80.2, 79.7, 79.2, 78.6, 78] },
  { key: "quadril", label: "Quadril", value: 96, unit: "cm", delta: 0.3, history: [95, 95.1, 95.3, 95.4, 95.6, 95.7, 95.8, 96] },
  { key: "braco", label: "Braço", value: 36, unit: "cm", delta: 0.5, history: [34, 34.3, 34.6, 34.9, 35.2, 35.5, 35.8, 36] },
  { key: "coxa", label: "Coxa", value: 58, unit: "cm", delta: 0.4, history: [56.5, 56.8, 57, 57.2, 57.4, 57.6, 57.8, 58] },
  { key: "panturrilha", label: "Panturrilha", value: 39, unit: "cm", delta: 0.2, history: [38.2, 38.3, 38.5, 38.6, 38.7, 38.8, 38.9, 39] }
];
const bodyComposition = {
  weight: 78.4,
  bodyFat: 14.2,
  muscleMass: 38.6
};
const bodyScans = [
  {
    id: "b1",
    data: "2026-05-06",
    miniatura: "linear-gradient(135deg,#1a2740,#0f1a2e)",
    origem: "camera",
    calibragem: { alturaCm: 178, pesoKg: 78.4, vestimenta: "normal" },
    estimativas: {
      peitoCmEstimado: 102,
      cinturaCmEstimada: 78,
      quadrilCmEstimado: 96,
      bracoCmEstimado: 36,
      coxaCmEstimada: 58,
      panturrilhaCmEstimada: 39,
      percentualGorduraEstimado: 14.2
    },
    qualidade: {
      iluminacao: "boa",
      enquadramento: "boa",
      postura: "boa",
      confiancaLeitura: 92
    },
    analiseIA: {
      tendenciaCorporal: "recomposicao",
      prioridadeMuscular: ["peitoral", "deltoides"],
      sinalDeRecomposicao: "cintura reduzindo com manutencao de peitoral",
      mudancaDesdeUltimoScan: "ganho visual de tronco com queda de gordura"
    }
  },
  {
    id: "b2",
    data: "2026-04-29",
    miniatura: "linear-gradient(135deg,#1a2540,#0d1828)",
    origem: "galeria",
    calibragem: { alturaCm: 178, pesoKg: 78.9, vestimenta: "normal" },
    estimativas: {
      peitoCmEstimado: 101.5,
      cinturaCmEstimada: 78.6,
      quadrilCmEstimado: 95.8,
      bracoCmEstimado: 35.8,
      coxaCmEstimada: 57.8,
      panturrilhaCmEstimada: 38.9,
      percentualGorduraEstimado: 14.6
    },
    qualidade: {
      iluminacao: "boa",
      enquadramento: "boa",
      postura: "media",
      confiancaLeitura: 89
    },
    analiseIA: {
      tendenciaCorporal: "recomposicao",
      prioridadeMuscular: ["peitoral", "abdomen_core"],
      sinalDeRecomposicao: "cintura em queda gradual",
      mudancaDesdeUltimoScan: "tronco mais seco e cintura menor"
    }
  },
  {
    id: "b3",
    data: "2026-04-22",
    miniatura: "linear-gradient(135deg,#16223a,#0c1626)",
    origem: "camera",
    calibragem: { alturaCm: 178, pesoKg: 79.2, vestimenta: "normal" },
    estimativas: {
      peitoCmEstimado: 101.2,
      cinturaCmEstimada: 79.2,
      quadrilCmEstimado: 95.7,
      bracoCmEstimado: 35.5,
      coxaCmEstimada: 57.6,
      panturrilhaCmEstimada: 38.8,
      percentualGorduraEstimado: 14.9
    },
    qualidade: {
      iluminacao: "media",
      enquadramento: "boa",
      postura: "boa",
      confiancaLeitura: 87
    },
    analiseIA: {
      tendenciaCorporal: "ajuste_estetico",
      prioridadeMuscular: ["abdomen_core", "peitoral"],
      sinalDeRecomposicao: "gordura visual estabilizando",
      mudancaDesdeUltimoScan: "leve reducao de cintura"
    }
  },
  {
    id: "b4",
    data: "2026-04-15",
    miniatura: "linear-gradient(135deg,#142036,#0a1322)",
    origem: "camera",
    calibragem: { alturaCm: 178, pesoKg: 79.5, vestimenta: "normal" },
    estimativas: {
      peitoCmEstimado: 100.8,
      cinturaCmEstimada: 79.7,
      quadrilCmEstimado: 95.6,
      bracoCmEstimado: 35.2,
      coxaCmEstimada: 57.4,
      panturrilhaCmEstimada: 38.7,
      percentualGorduraEstimado: 15.2
    },
    qualidade: {
      iluminacao: "media",
      enquadramento: "media",
      postura: "boa",
      confiancaLeitura: 84
    },
    analiseIA: {
      tendenciaCorporal: "ajuste_estetico",
      prioridadeMuscular: ["abdomen_core"],
      sinalDeRecomposicao: "cintura ainda acima do alvo",
      mudancaDesdeUltimoScan: "melhora inicial de definicao"
    }
  },
  {
    id: "b5",
    data: "2026-04-08",
    miniatura: "linear-gradient(135deg,#121e32,#091120)",
    origem: "galeria",
    calibragem: { alturaCm: 178, pesoKg: 79.9, vestimenta: "larga" },
    estimativas: {
      peitoCmEstimado: 100.4,
      cinturaCmEstimada: 80.2,
      quadrilCmEstimado: 95.4,
      bracoCmEstimado: 34.9,
      coxaCmEstimada: 57.2,
      panturrilhaCmEstimada: 38.6,
      percentualGorduraEstimado: 15.6
    },
    qualidade: {
      iluminacao: "media",
      enquadramento: "media",
      postura: "media",
      confiancaLeitura: 79
    },
    analiseIA: {
      tendenciaCorporal: "baseline",
      prioridadeMuscular: ["abdomen_core"],
      sinalDeRecomposicao: "ponto inicial do bloco",
      mudancaDesdeUltimoScan: "sem comparacao relevante"
    }
  },
  {
    id: "b6",
    data: "2026-04-01",
    miniatura: "linear-gradient(135deg,#101b2e,#080f1d)",
    origem: "camera",
    calibragem: { alturaCm: 178, pesoKg: 80.3, vestimenta: "normal" },
    estimativas: {
      peitoCmEstimado: 100,
      cinturaCmEstimada: 80.8,
      quadrilCmEstimado: 95,
      bracoCmEstimado: 34.6,
      coxaCmEstimada: 57,
      panturrilhaCmEstimada: 38.5,
      percentualGorduraEstimado: 15.9
    },
    qualidade: {
      iluminacao: "boa",
      enquadramento: "media",
      postura: "media",
      confiancaLeitura: 81
    },
    analiseIA: {
      tendenciaCorporal: "baseline",
      prioridadeMuscular: ["peitoral", "abdomen_core"],
      sinalDeRecomposicao: "scan inicial do ciclo",
      mudancaDesdeUltimoScan: "ponto zero"
    }
  }
];
const foodScans = [
  {
    id: "f1",
    data: "2026-05-07",
    refeicao: "Almoco",
    miniatura: "linear-gradient(135deg,#3a2410,#1f1408)",
    origem: "camera",
    estimativas: { kcal: 520, proteinaG: 32, carboG: 48 },
    qualidade: { confiancaLeitura: 88 }
  },
  {
    id: "f2",
    data: "2026-05-06",
    refeicao: "Jantar",
    miniatura: "linear-gradient(135deg,#2e1f10,#1a1208)",
    origem: "galeria",
    estimativas: { kcal: 610, proteinaG: 41, carboG: 52 },
    qualidade: { confiancaLeitura: 91 }
  },
  {
    id: "f3",
    data: "2026-05-06",
    refeicao: "Cafe",
    miniatura: "linear-gradient(135deg,#3a2e10,#1f1908)",
    origem: "camera",
    estimativas: { kcal: 380, proteinaG: 22, carboG: 41 },
    qualidade: { confiancaLeitura: 84 }
  },
  {
    id: "f4",
    data: "2026-05-05",
    refeicao: "Almoco",
    miniatura: "linear-gradient(135deg,#2a2410,#161208)",
    origem: "camera",
    estimativas: { kcal: 560, proteinaG: 36, carboG: 58 },
    qualidade: { confiancaLeitura: 86 }
  },
  {
    id: "f5",
    data: "2026-05-04",
    refeicao: "Lanche",
    miniatura: "linear-gradient(135deg,#3a2818,#20140a)",
    origem: "galeria",
    estimativas: { kcal: 220, proteinaG: 14, carboG: 22 },
    qualidade: { confiancaLeitura: 79 }
  }
];
function formatScanDate(iso, locale) {
  const d = new Date(iso);
  const l = locale === "pt" ? "pt-BR" : locale === "es" ? "es-ES" : locale === "de" ? "de-DE" : locale === "fr" ? "fr-FR" : locale ? "en-US" : "pt-BR";
  return d.toLocaleDateString(l, { day: "2-digit", month: "short" });
}
const scanPriorityMap = {
  peitoral: "peitoral",
  costas: "costas_trapezio",
  costas_trapezio: "costas_trapezio",
  deltoides: "deltoides",
  ombros: "deltoides",
  biceps: "biceps_antebraco",
  biceps_antebraco: "biceps_antebraco",
  triceps: "triceps",
  abdomen_core: "abdomen_core",
  core: "abdomen_core",
  membros_inferiores_gluteos: "membros_inferiores_gluteos",
  gluteos: "membros_inferiores_gluteos",
  inferiores: "membros_inferiores_gluteos",
  panturrilha: "panturrilha"
};
function dedupe(values) {
  return Array.from(new Set(values));
}
function resolvePriorityLevel(scan) {
  const confidence = scan?.qualidade.confiancaLeitura ?? 0;
  if (confidence >= 88) return "alta";
  if (confidence >= 75) return "media";
  return "baixa";
}
function resolveMuscularPriorities(scan) {
  if (!scan) return [];
  return dedupe(
    scan.analiseIA.prioridadeMuscular.map((item) => scanPriorityMap[item]).filter((value) => Boolean(value))
  );
}
function buildBodyTrainingContext(scans = bodyScans) {
  const latestScan = scans[0] ?? null;
  const bodyFatPct = latestScan?.estimativas.percentualGorduraEstimado ?? bodyComposition.bodyFat;
  const waistCm = latestScan?.estimativas.cinturaCmEstimada ?? null;
  const muscularPriorities = resolveMuscularPriorities(latestScan);
  const priorityLevel = resolvePriorityLevel(latestScan);
  return {
    latestScan,
    bodyFatPct,
    waistCm,
    confidenceScore: latestScan?.qualidade.confiancaLeitura ?? 0,
    muscularPriorities,
    priorityLevel,
    recompositionFocus: latestScan?.analiseIA.tendenciaCorporal === "recomposicao" || bodyFatPct >= 16
  };
}
function dedupeNotes(notes) {
  return Array.from(new Set((notes ?? []).map((note) => note.trim()).filter(Boolean)));
}
function resolveDefaultGymSize(location) {
  return location === "academia" || location === "hibrido" ? "media" : null;
}
function resolveDefaultCrowdLevel(location) {
  return location === "academia" || location === "hibrido" ? "normal" : null;
}
function resolveDefaultAvailability(location) {
  if (location === "casa") return "baixa";
  if (location === "outdoor") return "media";
  return "alta";
}
function buildEnvironmentContext(profile, input = {}) {
  return {
    location: profile.location,
    gymSize: input.gymSize ?? resolveDefaultGymSize(profile.location),
    crowdLevel: input.crowdLevel ?? resolveDefaultCrowdLevel(profile.location),
    equipmentAvailability: input.equipmentAvailability ?? resolveDefaultAvailability(profile.location),
    notes: dedupeNotes(input.notes)
  };
}
function buildEnvironmentContextFromOnboarding(profile, onboarding) {
  return buildEnvironmentContext(profile, {
    gymSize: onboarding.gymSize ?? null,
    crowdLevel: onboarding.crowdLevel ?? null,
    equipmentAvailability: onboarding.equipmentAvailability ?? null,
    notes: onboarding.environmentNotes
  });
}
function createLocalizedText(base) {
  return {
    pt: base,
    es: base,
    en: base,
    fr: base,
    de: base
  };
}
function normalizeText(value) {
  return cleanLegacyText(value).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}
function repairUtf8MojibakeOnce(value) {
  try {
    const bytes = Uint8Array.from(value, (char) => char.charCodeAt(0) & 255);
    return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
  } catch {
    return value;
  }
}
function repairUtf8Mojibake(value) {
  let current = value;
  for (let index = 0; index < 2; index += 1) {
    const repaired = repairUtf8MojibakeOnce(current);
    if (repaired === current) break;
    current = repaired;
  }
  return current;
}
function cleanupSymbols(value) {
  return value.replaceAll("?", " graus").replaceAll("?", " graus").replaceAll("?", " | ").replaceAll("?", "-").replaceAll("?", "-").replaceAll("?", "-").replaceAll("?", "x").replaceAll("?", "'").replaceAll("?", "'").replaceAll("?", '"').replaceAll("?", '"').replaceAll("??", " | ").replaceAll("??", " | ").replaceAll("??", " ").replaceAll("??", "ao").replaceAll("??", "a").replaceAll("??", "e").replaceAll("??", "a").replaceAll("??", "i").replaceAll("??", "u").replaceAll("??", "o").replaceAll("??", "e").replaceAll("??", " graus");
}
function cleanLegacyText(value) {
  const baseValue = String(value ?? "");
  const repairedValue = repairUtf8Mojibake(baseValue);
  const asciiValue = cleanupSymbols(repairedValue).normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  return cleanupSymbols(asciiValue).replace(/\s*\|\s*/g, " | ").replace(/\s+/g, " ").trim();
}
function normalize(value) {
  return normalizeText(value);
}
function slugify(value) {
  return normalize(value).replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}
function displayValue(value) {
  return cleanLegacyText(value);
}
function resolveTrainingType(exercise) {
  return normalize(exercise.type).includes("calisten") ? "calistenia" : "musculacao";
}
function resolveCategory(exercise) {
  const muscle = normalize(displayValue(exercise.muscle));
  const sourceGroup = normalize(exercise.sourceGroup ?? "");
  const name = normalize(displayValue(exercise.name));
  const hasToken = (...tokens) => tokens.some((token) => muscle.includes(token) || sourceGroup.includes(token) || name.includes(token));
  if (hasToken("panturrilha", "gemeos", "calf")) return "panturrilha";
  if (hasToken("gluteos", "gluteo", "glute", "abdutora", "hip thrust", "coice")) {
    return "membros_inferiores_gluteos";
  }
  if (hasToken(
    "membros inferiores",
    "pernas",
    "quadriceps",
    "posterior",
    "isquiotib",
    "agach",
    "afundo",
    "avanco",
    "passada",
    "stiff",
    "terra",
    "leg press",
    "extensora",
    "flexora"
  )) {
    return "membros_inferiores_gluteos";
  }
  if (hasToken("costas", "trapezio", "remada", "puxada", "pulldown", "pulley", "barra fixa")) {
    return "costas_trapezio";
  }
  if (hasToken("peitoral", "peito", "supino", "crossover", "crucifixo", "fly", "flexao")) {
    return "peitoral";
  }
  if (hasToken(
    "deltoides",
    "ombro",
    "ombros",
    "arnold",
    "elevacao lateral",
    "elevacao frontal",
    "desenvolvimento"
  )) {
    return "deltoides";
  }
  if (hasToken("triceps", "tricep", "corda", "frances", "testa", "mergulho")) {
    return "triceps";
  }
  if (hasToken("biceps", "antebraco", "rosca", "curl", "martelo")) {
    return "biceps_antebraco";
  }
  if (hasToken("abdomen", "core", "abdominal", "crunch", "prancha", "plank", "leg raise", "ab roller")) {
    return "abdomen_core";
  }
  if (resolveTrainingType(exercise) === "calistenia") {
    return "abdomen_core";
  }
  return "membros_inferiores_gluteos";
}
function resolveEquipment(exercise) {
  const value = normalize(displayValue(exercise.equipment));
  if (value.includes("barra fixa")) return "barra_fixa";
  if (value.includes("paralela")) return "paralelas";
  if (value.includes("parede")) return "parede";
  if (value.includes("peso corporal")) return "peso_corporal";
  if (value.includes("halter")) return "halteres";
  if (value.includes("cabo")) return "cabos";
  if (value.includes("maquina")) return "maquina";
  if (value.includes("banco")) return "banco";
  if (value.includes("trx")) return "trx";
  if (value.includes("bola")) return "bola";
  if (value.includes("elastico")) return "elastico";
  return "barra";
}
function resolveGifSource(exercise) {
  if (!exercise.gifUrl) return "fallback";
  if (exercise.gifUrl.includes("/musculacao-media/") || exercise.gifUrl.includes("/calistenia-pura/")) {
    return "catalog";
  }
  return "official";
}
function mapExerciseToCatalogRecord(exercise) {
  const normalizedName = displayValue(exercise.name);
  return {
    id: exercise.id,
    slug: slugify(normalizedName || exercise.id),
    name: createLocalizedText(normalizedName),
    aliases: [exercise.id, normalizedName, exercise.sourceGroup ?? ""].filter(Boolean),
    trainingType: resolveTrainingType(exercise),
    category: resolveCategory(exercise),
    secondaryCategories: [],
    equipment: resolveEquipment(exercise),
    movementPattern: createLocalizedText(displayValue(exercise.biomechanics)),
    sourceGroup: exercise.sourceGroup ?? null,
    gifPath: exercise.gifUrl ?? null,
    gifSource: resolveGifSource(exercise),
    status: "active"
  };
}
function isFunctionalExerciseRecord(record) {
  const movement = normalize(
    [record.name.pt, record.movementPattern.pt, record.sourceGroup ?? ""].join(" ")
  );
  if (record.trainingType === "calistenia") return true;
  const functionalEquipment = [
    "peso_corporal",
    "parede",
    "trx",
    "bola",
    "elastico"
  ];
  return functionalEquipment.includes(record.equipment) || [
    "agach",
    "afundo",
    "unilateral",
    "core",
    "prancha",
    "plank",
    "estabil",
    "isometr",
    "mobilidade",
    "potencia",
    "salto",
    "controle",
    "condicionamento"
  ].some((token) => movement.includes(token));
}
function buildExerciseCatalog(exercises2 = libraryExercises) {
  return exercises2.map(mapExerciseToCatalogRecord);
}
function clampIndex(value, max) {
  return Math.min(Math.max(value, 0), max);
}
function applyWorkoutCustomization(workout, customization) {
  if (customization.workoutId !== workout.id) return workout;
  let exercises2 = [...workout.exercises];
  for (const edit of customization.edits) {
    if (edit.workoutId !== workout.id) continue;
    if (edit.type === "replace_exercise") {
      exercises2 = exercises2.map(
        (exercise2) => exercise2.exerciseId === edit.fromExerciseId ? { ...exercise2, exerciseId: edit.toExerciseId } : exercise2
      );
      continue;
    }
    if (edit.type === "add_exercise") {
      const reference = exercises2[exercises2.length - 1];
      exercises2 = [
        ...exercises2,
        {
          exerciseId: edit.exerciseId,
          sets: reference?.sets ?? [{ reps: 12, weight: 0 }],
          rest: reference?.rest ?? 60
        }
      ];
      continue;
    }
    if (edit.type === "remove_exercise") {
      exercises2 = exercises2.filter((exercise2) => exercise2.exerciseId !== edit.exerciseId);
      continue;
    }
    const currentIndex = exercises2.findIndex((exercise2) => exercise2.exerciseId === edit.exerciseId);
    if (currentIndex === -1) continue;
    const [exercise] = exercises2.splice(currentIndex, 1);
    const nextIndex = clampIndex(edit.newOrder, exercises2.length);
    exercises2.splice(nextIndex, 0, exercise);
  }
  return { ...workout, exercises: exercises2 };
}
function validateWorkoutCustomization(workout, customization) {
  if (customization.workoutId !== workout.id) {
    return { valid: false, issues: ["Customização enviada para treino incorreto."] };
  }
  const customizedWorkout = applyWorkoutCustomization(workout, customization);
  const issues = [];
  if (customizedWorkout.exercises.length === 0) {
    issues.push("O treino não pode ficar sem exercícios.");
  }
  const duplicateIds = customizedWorkout.exercises.map((exercise) => exercise.exerciseId).filter((exerciseId, index, array) => array.indexOf(exerciseId) !== index);
  if (duplicateIds.length > 0) {
    issues.push("A customização gerou exercícios duplicados.");
  }
  return {
    valid: issues.length === 0,
    issues
  };
}
const EXERCISES_PER_WORKOUT = 8;
function resolveGoalBias(goal) {
  if (goal === "ganho_massa") return "hipertrofia";
  if (goal === "perda_peso") return "densidade";
  if (goal === "definicao") return "recomposicao";
  if (goal === "forca") return "forca";
  return "performance";
}
function prefersLowerPriority$1(sex, goal) {
  return sex === "feminino" && ["ganho_massa", "definicao", "perda_peso"].includes(goal);
}
function hashString$1(value) {
  let hash = 0;
  for (let index = 0; index < value.length; index++) {
    hash = Math.imul(31, hash) + value.charCodeAt(index) | 0;
  }
  return Math.abs(hash);
}
function resolveBlockIndex(profile) {
  if (!profile.onboardingCompletedAt) return 0;
  const start = new Date(profile.onboardingCompletedAt);
  if (Number.isNaN(start.getTime())) return 0;
  const diffMs = Date.now() - start.getTime();
  const diffWeeks = Math.max(0, Math.floor(diffMs / (7 * 24 * 60 * 60 * 1e3)));
  return Math.floor(diffWeeks / 12);
}
function resolveRegenerationIndex() {
  if (typeof window === "undefined") return 0;
  try {
    return hashString$1(window.localStorage.getItem("_zyrox_regen_seed") ?? "") % 7;
  } catch {
    return 0;
  }
}
function resolveRotationIndex(profile, variants) {
  return (resolveBlockIndex(profile) + resolveRegenerationIndex()) % variants;
}
function resolveTrainingSplit(profile) {
  const trainingDays = profile.availableDays.length || 3;
  const usesBodyweight = profile.location === "outdoor" || profile.location === "casa";
  if (profile.trainingType === "funcional") return "performance_hybrid";
  if (profile.goal === "performance" && !usesBodyweight && profile.trainingType !== "musculacao") return "performance_hybrid";
  if (trainingDays <= 2) return "full_body";
  if (prefersLowerPriority$1(profile.sex, profile.goal)) return "female_lower_priority";
  if (trainingDays === 3) return "push_pull_legs";
  if (trainingDays === 4 && profile.sex === "masculino") return "male_upper_lower_bias";
  if (trainingDays >= 5) return "push_pull_legs";
  return "upper_lower";
}
function buildPushA() {
  return {
    name: "Push A — Peito",
    split: "push_pull_legs",
    categories: [
      { primary: "peitoral", slots: 3 },
      { primary: "deltoides", slots: 2 },
      { primary: "triceps", slots: 2 },
      { primary: "abdomen_core", slots: 1 }
    ]
  };
}
function buildPushB() {
  return {
    name: "Push B — Ombros",
    split: "push_pull_legs",
    categories: [
      { primary: "deltoides", slots: 3 },
      { primary: "peitoral", slots: 2 },
      { primary: "triceps", slots: 2 },
      { primary: "abdomen_core", slots: 1 }
    ]
  };
}
function buildPullA() {
  return {
    name: "Pull A — Costas",
    split: "push_pull_legs",
    categories: [
      { primary: "costas_trapezio", slots: 4 },
      { primary: "biceps_antebraco", slots: 2 },
      { primary: "deltoides", slots: 1 },
      { primary: "abdomen_core", slots: 1 }
    ]
  };
}
function buildPullB() {
  return {
    name: "Pull B — Bíceps",
    split: "push_pull_legs",
    categories: [
      { primary: "costas_trapezio", slots: 3 },
      { primary: "biceps_antebraco", slots: 3 },
      { primary: "costas_trapezio", secondary: "biceps_antebraco", slots: 1 },
      { primary: "abdomen_core", slots: 1 }
    ]
  };
}
function buildLegsA() {
  return {
    name: "Legs A — Quadríceps",
    split: "push_pull_legs",
    categories: [
      { primary: "membros_inferiores_gluteos", slots: 4 },
      { primary: "membros_inferiores_gluteos", secondary: "panturrilha", slots: 1 },
      { primary: "panturrilha", slots: 1 },
      { primary: "abdomen_core", slots: 2 }
    ]
  };
}
function buildLegsB() {
  return {
    name: "Legs B — Posterior",
    split: "push_pull_legs",
    categories: [
      { primary: "membros_inferiores_gluteos", slots: 4 },
      { primary: "membros_inferiores_gluteos", secondary: "abdomen_core", slots: 2 },
      { primary: "panturrilha", slots: 1 },
      { primary: "abdomen_core", slots: 1 }
    ]
  };
}
function buildFullBodyA() {
  return {
    name: "Full Body A",
    split: "full_body",
    categories: [
      { primary: "membros_inferiores_gluteos", slots: 2 },
      { primary: "peitoral", slots: 1 },
      { primary: "costas_trapezio", slots: 2 },
      { primary: "deltoides", slots: 1 },
      { primary: "triceps", slots: 1 },
      { primary: "abdomen_core", slots: 1 }
    ]
  };
}
function buildFullBodyB() {
  return {
    name: "Full Body B",
    split: "full_body",
    categories: [
      { primary: "membros_inferiores_gluteos", slots: 2 },
      { primary: "costas_trapezio", slots: 2 },
      { primary: "peitoral", slots: 1 },
      { primary: "biceps_antebraco", slots: 1 },
      { primary: "triceps", slots: 1 },
      { primary: "abdomen_core", slots: 1 }
    ]
  };
}
function buildUpperA(split) {
  return {
    name: "Upper A — Empurrar",
    split,
    categories: [
      { primary: "peitoral", slots: 3 },
      { primary: "costas_trapezio", slots: 2 },
      { primary: "deltoides", slots: 1 },
      { primary: "triceps", slots: 1 },
      { primary: "abdomen_core", slots: 1 }
    ]
  };
}
function buildUpperB(split) {
  return {
    name: "Upper B — Puxar",
    split,
    categories: [
      { primary: "costas_trapezio", slots: 3 },
      { primary: "peitoral", slots: 2 },
      { primary: "biceps_antebraco", slots: 2 },
      { primary: "abdomen_core", slots: 1 }
    ]
  };
}
function buildLowerA(split) {
  return {
    name: "Lower A — Quadríceps",
    split,
    categories: [
      { primary: "membros_inferiores_gluteos", slots: 5 },
      { primary: "panturrilha", slots: 1 },
      { primary: "abdomen_core", slots: 1 },
      { primary: "membros_inferiores_gluteos", secondary: "panturrilha", slots: 1 }
    ]
  };
}
function buildLowerB(split) {
  return {
    name: "Lower B — Posterior",
    split,
    categories: [
      { primary: "membros_inferiores_gluteos", slots: 4 },
      { primary: "membros_inferiores_gluteos", secondary: "abdomen_core", slots: 2 },
      { primary: "panturrilha", slots: 1 },
      { primary: "abdomen_core", slots: 1 }
    ]
  };
}
function buildStrengthClassicTemplates(profile, trainingDays, variant) {
  if (trainingDays <= 2) return [buildFullBodyA(), buildFullBodyB()];
  if (trainingDays === 3) {
    return variant === "A" ? [buildPushA(), buildPullA(), buildLegsA()] : [buildPullB(), buildPushB(), buildLegsB()];
  }
  if (trainingDays === 4) {
    const split = profile.sex === "masculino" ? "male_upper_lower_bias" : "upper_lower";
    return [buildUpperA(split), buildLowerA(split), buildUpperB(split), buildLowerB(split)];
  }
  return [buildPushA(), buildPullA(), buildLegsA(), buildPushB(), buildPullB(), buildLegsB()].slice(0, Math.min(6, trainingDays));
}
function buildStrengthCrossPairTemplates(trainingDays) {
  const split = "upper_lower";
  const templates = [
    {
      name: "Peito + Ombro",
      split,
      categories: [
        { primary: "peitoral", slots: 4 },
        { primary: "deltoides", slots: 3 },
        { primary: "triceps", slots: 1 }
      ]
    },
    {
      name: "Costas + Bíceps",
      split,
      categories: [
        { primary: "costas_trapezio", slots: 4 },
        { primary: "biceps_antebraco", slots: 3 },
        { primary: "abdomen_core", slots: 1 }
      ]
    },
    {
      name: "Costas + Tríceps",
      split,
      categories: [
        { primary: "costas_trapezio", slots: 4 },
        { primary: "triceps", slots: 3 },
        { primary: "abdomen_core", slots: 1 }
      ]
    },
    {
      name: "Pernas + Abdômen",
      split,
      categories: [
        { primary: "membros_inferiores_gluteos", slots: 5 },
        { primary: "panturrilha", slots: 1 },
        { primary: "abdomen_core", slots: 2 }
      ]
    },
    {
      name: "Peito + Bíceps",
      split,
      categories: [
        { primary: "peitoral", slots: 4 },
        { primary: "biceps_antebraco", slots: 3 },
        { primary: "abdomen_core", slots: 1 }
      ]
    },
    {
      name: "Ombros + Braços",
      split,
      categories: [
        { primary: "deltoides", slots: 3 },
        { primary: "triceps", slots: 2 },
        { primary: "biceps_antebraco", slots: 2 },
        { primary: "abdomen_core", slots: 1 }
      ]
    },
    {
      name: "Braços",
      split,
      categories: [
        { primary: "biceps_antebraco", slots: 3 },
        { primary: "triceps", slots: 3 },
        { primary: "deltoides", slots: 1 },
        { primary: "abdomen_core", slots: 1 }
      ]
    },
    {
      name: "Posterior + Panturrilha",
      split,
      categories: [
        { primary: "membros_inferiores_gluteos", slots: 5 },
        { primary: "panturrilha", slots: 2 },
        { primary: "abdomen_core", slots: 1 }
      ]
    }
  ];
  if (trainingDays <= 3) return [templates[0], templates[1], templates[3]];
  return templates.slice(0, Math.min(templates.length, trainingDays));
}
function buildStrengthAntagonistTemplates(trainingDays) {
  const split = "upper_lower";
  const templates = [
    {
      name: "Peito + Ombro",
      split,
      categories: [
        { primary: "peitoral", slots: 4 },
        { primary: "deltoides", slots: 3 },
        { primary: "triceps", slots: 1 }
      ]
    },
    {
      name: "Costas + Bíceps",
      split,
      categories: [
        { primary: "costas_trapezio", slots: 4 },
        { primary: "biceps_antebraco", slots: 3 },
        { primary: "abdomen_core", slots: 1 }
      ]
    },
    {
      name: "Peito + Costas",
      split,
      categories: [
        { primary: "peitoral", slots: 3 },
        { primary: "costas_trapezio", slots: 3 },
        { primary: "deltoides", slots: 1 },
        { primary: "abdomen_core", slots: 1 }
      ]
    },
    {
      name: "Pernas + Abdômen",
      split,
      categories: [
        { primary: "membros_inferiores_gluteos", slots: 5 },
        { primary: "panturrilha", slots: 1 },
        { primary: "abdomen_core", slots: 2 }
      ]
    },
    {
      name: "Ombros + Braços",
      split,
      categories: [
        { primary: "deltoides", slots: 3 },
        { primary: "biceps_antebraco", slots: 2 },
        { primary: "triceps", slots: 2 },
        { primary: "abdomen_core", slots: 1 }
      ]
    },
    {
      name: "Braços",
      split,
      categories: [
        { primary: "biceps_antebraco", slots: 3 },
        { primary: "triceps", slots: 3 },
        { primary: "deltoides", slots: 1 },
        { primary: "abdomen_core", slots: 1 }
      ]
    },
    {
      name: "Posterior + Glúteos",
      split,
      categories: [
        { primary: "membros_inferiores_gluteos", slots: 5 },
        { primary: "panturrilha", slots: 1 },
        { primary: "abdomen_core", slots: 2 }
      ]
    },
    {
      name: "Costas + Tríceps",
      split,
      categories: [
        { primary: "costas_trapezio", slots: 4 },
        { primary: "triceps", slots: 3 },
        { primary: "abdomen_core", slots: 1 }
      ]
    }
  ];
  if (trainingDays <= 3) return [templates[0], templates[1], templates[3]];
  return templates.slice(0, Math.min(templates.length, trainingDays));
}
function buildStrengthLowerPriorityTemplates(trainingDays, rotation = 0) {
  const glutesPosterior = {
    name: "Glúteos + Posterior",
    split: "female_lower_priority",
    categories: [
      { primary: "membros_inferiores_gluteos", slots: 6 },
      { primary: "panturrilha", slots: 1 },
      { primary: "abdomen_core", slots: 1 }
    ]
  };
  const upperCore = {
    name: "Superior + Core",
    split: "female_lower_priority",
    categories: [
      { primary: "costas_trapezio", slots: 2 },
      { primary: "peitoral", slots: 1 },
      { primary: "deltoides", slots: 2 },
      { primary: "triceps", secondary: "biceps_antebraco", slots: 1 },
      { primary: "abdomen_core", slots: 2 }
    ]
  };
  const quadCalves = {
    name: "Quadríceps + Panturrilha",
    split: "female_lower_priority",
    categories: [
      { primary: "membros_inferiores_gluteos", slots: 5 },
      { primary: "panturrilha", slots: 2 },
      { primary: "abdomen_core", slots: 1 }
    ]
  };
  const unilateralGlute = {
    name: "Glúteos + Unilateral",
    split: "female_lower_priority",
    categories: [
      { primary: "membros_inferiores_gluteos", slots: 6 },
      { primary: "membros_inferiores_gluteos", secondary: "abdomen_core", slots: 1 },
      { primary: "abdomen_core", slots: 1 }
    ]
  };
  const upperBackArms = {
    name: "Costas + Braços",
    split: "female_lower_priority",
    categories: [
      { primary: "costas_trapezio", slots: 3 },
      { primary: "deltoides", slots: 1 },
      { primary: "biceps_antebraco", slots: 2 },
      { primary: "triceps", slots: 1 },
      { primary: "abdomen_core", slots: 1 }
    ]
  };
  const upperPosture = {
    name: "Upper — Postura e Definição",
    split: "female_lower_priority",
    categories: [
      { primary: "costas_trapezio", slots: 3 },
      { primary: "deltoides", slots: 2 },
      { primary: "triceps", slots: 1 },
      { primary: "biceps_antebraco", slots: 1 },
      { primary: "abdomen_core", slots: 1 }
    ]
  };
  const variants = [
    [glutesPosterior, upperCore, quadCalves, unilateralGlute, upperBackArms, upperPosture],
    [quadCalves, upperCore, glutesPosterior, unilateralGlute, upperBackArms, upperPosture],
    [glutesPosterior, upperPosture, quadCalves, upperBackArms, unilateralGlute, upperCore]
  ];
  const templates = variants[rotation % variants.length];
  if (trainingDays <= 2) return [templates[0], templates[1]];
  if (trainingDays === 3) return templates.slice(0, 3);
  if (trainingDays === 4) return templates.slice(0, 4);
  return templates.slice(0, Math.min(templates.length, trainingDays));
}
function buildStrengthBlockTemplates(profile, trainingDays, variant) {
  if (prefersLowerPriority$1(profile.sex, profile.goal)) {
    const rotation2 = resolveRotationIndex(profile, 3);
    return buildStrengthLowerPriorityTemplates(trainingDays, rotation2);
  }
  const rotation = resolveRotationIndex(profile, 3);
  if (rotation === 1) return buildStrengthCrossPairTemplates(trainingDays);
  if (rotation === 2) return buildStrengthAntagonistTemplates(trainingDays);
  return buildStrengthClassicTemplates(profile, trainingDays, variant);
}
function buildFunctionalTemplates(trainingDays) {
  const templates = [
    {
      name: "Funcional A — Força global",
      split: "performance_hybrid",
      categories: [
        { primary: "membros_inferiores_gluteos", slots: 2 },
        { primary: "peitoral", slots: 1 },
        { primary: "costas_trapezio", slots: 1 },
        { primary: "deltoides", slots: 1 },
        { primary: "abdomen_core", slots: 3 }
      ]
    },
    {
      name: "Funcional B — Core e estabilidade",
      split: "performance_hybrid",
      categories: [
        { primary: "abdomen_core", slots: 4 },
        { primary: "membros_inferiores_gluteos", slots: 2 },
        { primary: "deltoides", slots: 1 },
        { primary: "costas_trapezio", secondary: "peitoral", slots: 1 }
      ]
    },
    {
      name: "Funcional C — Pernas e condicionamento",
      split: "performance_hybrid",
      categories: [
        { primary: "membros_inferiores_gluteos", slots: 4 },
        { primary: "abdomen_core", slots: 2 },
        { primary: "panturrilha", slots: 1 },
        { primary: "peitoral", secondary: "costas_trapezio", slots: 1 }
      ]
    },
    {
      name: "Funcional D — Superior e core",
      split: "performance_hybrid",
      categories: [
        { primary: "peitoral", slots: 2 },
        { primary: "costas_trapezio", slots: 2 },
        { primary: "deltoides", slots: 1 },
        { primary: "triceps", secondary: "biceps_antebraco", slots: 1 },
        { primary: "abdomen_core", slots: 2 }
      ]
    },
    {
      name: "Funcional E — Mobilidade ativa",
      split: "performance_hybrid",
      categories: [
        { primary: "abdomen_core", slots: 3 },
        { primary: "membros_inferiores_gluteos", slots: 2 },
        { primary: "deltoides", slots: 1 },
        { primary: "costas_trapezio", slots: 1 },
        { primary: "peitoral", slots: 1 }
      ]
    },
    {
      name: "Funcional F — Potência e coordenação",
      split: "performance_hybrid",
      categories: [
        { primary: "membros_inferiores_gluteos", slots: 3 },
        { primary: "abdomen_core", slots: 2 },
        { primary: "deltoides", slots: 1 },
        { primary: "peitoral", secondary: "costas_trapezio", slots: 2 }
      ]
    }
  ];
  const sequences = [
    templates,
    [templates[1], templates[0], templates[2], templates[3], templates[4], templates[5]],
    [templates[2], templates[1], templates[3], templates[0], templates[5], templates[4]]
  ];
  return sequences[0].slice(0, Math.min(templates.length, Math.max(1, trainingDays)));
}
function buildCalistheniaTemplates(trainingDays) {
  const templates = [
    {
      name: "Calistenia Push",
      split: "performance_hybrid",
      categories: [
        { primary: "peitoral", slots: 3 },
        { primary: "deltoides", slots: 2 },
        { primary: "triceps", slots: 2 },
        { primary: "abdomen_core", slots: 1 }
      ]
    },
    {
      name: "Calistenia Pull",
      split: "performance_hybrid",
      categories: [
        { primary: "costas_trapezio", slots: 4 },
        { primary: "biceps_antebraco", slots: 2 },
        { primary: "deltoides", slots: 1 },
        { primary: "abdomen_core", slots: 1 }
      ]
    },
    {
      name: "Calistenia Legs",
      split: "performance_hybrid",
      categories: [
        { primary: "membros_inferiores_gluteos", slots: 5 },
        { primary: "panturrilha", slots: 1 },
        { primary: "abdomen_core", slots: 2 }
      ]
    },
    {
      name: "Calistenia Core",
      split: "performance_hybrid",
      categories: [
        { primary: "abdomen_core", slots: 5 },
        { primary: "membros_inferiores_gluteos", slots: 1 },
        { primary: "deltoides", slots: 1 },
        { primary: "costas_trapezio", slots: 1 }
      ]
    },
    {
      name: "Calistenia Skills",
      split: "performance_hybrid",
      categories: [
        { primary: "deltoides", slots: 2 },
        { primary: "costas_trapezio", slots: 2 },
        { primary: "peitoral", slots: 1 },
        { primary: "triceps", slots: 1 },
        { primary: "abdomen_core", slots: 2 }
      ]
    },
    {
      name: "Calistenia Full Body",
      split: "performance_hybrid",
      categories: [
        { primary: "membros_inferiores_gluteos", slots: 2 },
        { primary: "costas_trapezio", slots: 2 },
        { primary: "peitoral", slots: 1 },
        { primary: "deltoides", slots: 1 },
        { primary: "abdomen_core", slots: 2 }
      ]
    }
  ];
  if (trainingDays <= 2) return [templates[5], templates[3]].slice(0, Math.max(1, trainingDays));
  if (trainingDays === 3) return [templates[0], templates[1], templates[2]];
  if (trainingDays === 4) return [templates[0], templates[1], templates[2], templates[3]];
  if (trainingDays === 5) return [templates[0], templates[1], templates[2], templates[3], templates[4]];
  return templates.slice(0, Math.min(templates.length, trainingDays));
}
function currentWeekVariant() {
  const weekOfYear = Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1e3));
  return weekOfYear % 2 === 0 ? "A" : "B";
}
function resolveWorkoutTemplates(profile) {
  const split = resolveTrainingSplit(profile);
  const variant = currentWeekVariant();
  const trainingDays = profile.availableDays.length || 3;
  if (profile.trainingType === "funcional") {
    return buildFunctionalTemplates(trainingDays);
  }
  if (profile.trainingType === "calistenia") {
    return buildCalistheniaTemplates(trainingDays);
  }
  if (profile.trainingType === "musculacao" && split !== "performance_hybrid") {
    return buildStrengthBlockTemplates(profile, trainingDays, variant);
  }
  if (split === "push_pull_legs") {
    if (trainingDays >= 5) {
      return [buildPushA(), buildPullA(), buildLegsA(), buildPushB(), buildPullB(), buildLegsB()];
    }
    return variant === "A" ? [buildPushA(), buildPullA(), buildLegsA()] : [buildPushB(), buildPullB(), buildLegsB()];
  }
  if (split === "female_lower_priority") {
    return buildStrengthLowerPriorityTemplates(trainingDays, resolveRotationIndex(profile, 3));
  }
  if (split === "male_upper_lower_bias" || split === "upper_lower") {
    if (trainingDays >= 4) {
      return [buildUpperA(split), buildLowerA(split), buildUpperB(split), buildLowerB(split)];
    }
    return variant === "A" ? [buildUpperA(split), buildLowerA(split)] : [buildUpperB(split), buildLowerB(split)];
  }
  if (split === "performance_hybrid") {
    return [
      {
        name: "Hybrid Performance",
        split,
        categories: [
          { primary: "costas_trapezio", slots: 2 },
          { primary: "peitoral", slots: 1 },
          { primary: "deltoides", slots: 1 },
          { primary: "membros_inferiores_gluteos", slots: 2 },
          { primary: "abdomen_core", slots: 1 },
          { primary: "biceps_antebraco", secondary: "triceps", slots: 1 }
        ]
      }
    ];
  }
  return variant === "A" ? [buildFullBodyA()] : [buildFullBodyB()];
}
function resolveWorkoutDensity(profile) {
  const goalBias = resolveGoalBias(profile.goal);
  const duration = profile.workoutDurationMin;
  if (goalBias === "densidade" || duration <= 40) return "alta";
  if (profile.level === "avancado" || profile.consistency === "elite") return "moderada";
  return "controlada";
}
function resolveWorkoutIntensity(level, consistency, goal) {
  if (goal === "forca") {
    if (level === "iniciante") return "moderada";
    return "pesada";
  }
  if (level === "avancado" && consistency === "elite") return "pesada";
  if (level === "intermediario") return "moderada";
  return "leve";
}
const rules = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  EXERCISES_PER_WORKOUT,
  resolveTrainingSplit,
  resolveWorkoutDensity,
  resolveWorkoutIntensity,
  resolveWorkoutTemplates
}, Symbol.toStringTag, { value: "Module" }));
const emphasisCopy = {
  pt: {
    base: { calistenia: "técnica, controle corporal e volume base", hibrido: "fundação de força e skill", default: "volume base e execução limpa" },
    progressao: { forca: "sobrecarga progressiva nos movimentos principais", ganho_massa: "crescimento de volume e tensão mecânica", default: "construção de capacidade e aderência" },
    intensificacao: { calistenia: "alavancas mais difíceis e consolidação de skill", hibrido: "transferência entre carga externa e domínio corporal", default: "mais carga, menos dispersão e foco nos compostos" },
    deload: "redução de fadiga, consolidação técnica e transição do bloco"
  },
  es: {
    base: { calistenia: "técnica, control corporal y volumen base", hibrido: "fundamento de fuerza y skill", default: "volumen base y ejecución limpia" },
    progressao: { forca: "sobrecarga progresiva en movimientos principales", ganho_massa: "crecimiento de volumen y tensión mecánica", default: "construcción de capacidad y adherencia" },
    intensificacao: { calistenia: "palancas más difíciles y consolidación de skill", hibrido: "transferencia entre carga externa y dominio corporal", default: "más carga, menos dispersión y foco en compuestos" },
    deload: "reducción de fatiga, consolidación técnica y transición del bloque"
  },
  en: {
    base: { calistenia: "technique, body control and base volume", hibrido: "strength foundation and skill", default: "base volume and clean execution" },
    progressao: { forca: "progressive overload on main movements", ganho_massa: "volume growth and mechanical tension", default: "capacity building and adherence" },
    intensificacao: { calistenia: "harder levers and skill consolidation", hibrido: "transfer between external load and body control", default: "more load, less dispersion and focus on compounds" },
    deload: "fatigue reduction, technical consolidation and block transition"
  },
  fr: {
    base: { calistenia: "technique, contrôle corporel et volume de base", hibrido: "fondation de force et skill", default: "volume de base et exécution propre" },
    progressao: { forca: "surcharge progressive sur les mouvements principaux", ganho_massa: "croissance du volume et tension mécanique", default: "construction de capacité et adhérence" },
    intensificacao: { calistenia: "leviers plus difficiles et consolidation du skill", hibrido: "transfert entre charge externe et maîtrise corporelle", default: "plus de charge, moins de dispersion et focus sur les composés" },
    deload: "réduction de la fatigue, consolidation technique et transition de bloc"
  },
  de: {
    base: { calistenia: "Technik, Körperkontrolle und Basisvolumen", hibrido: "Kraftfundament und Skill", default: "Basisvolumen und saubere Ausführung" },
    progressao: { forca: "progressive Überlastung bei Hauptbewegungen", ganho_massa: "Volumenwachstum und mechanische Spannung", default: "Kapazitätsaufbau und Kontinuität" },
    intensificacao: { calistenia: "schwierigere Hebel und Skill-Konsolidierung", hibrido: "Übertragung zwischen externer Last und Körperkontrolle", default: "mehr Last, weniger Streuung und Fokus auf Grundübungen" },
    deload: "Müdigkeitsreduktion, technische Konsolidierung und Blockwechsel"
  }
};
const summaryCopy = {
  pt: {
    short: (w, g, m) => `Semana ${w} do bloco de 12 semanas com foco em ${g} dentro da modalidade ${m}.`,
    medium: "O trimestre alterna base, progressão, intensificação e deload para evitar platô e manter recorrência.",
    long: "A jornada anual usa quatro blocos de 12 semanas para sustentar curto, médio e longo prazo com fundamento profissional."
  },
  es: {
    short: (w, g, m) => `Semana ${w} del bloque de 12 semanas con foco en ${g} dentro de la modalidad ${m}.`,
    medium: "El trimestre alterna base, progresión, intensificación y descarga para evitar estancamiento y mantener recurrencia.",
    long: "La jornada anual usa cuatro bloques de 12 semanas para sostener corto, medio y largo plazo con fundamento profesional."
  },
  en: {
    short: (w, g, m) => `Week ${w} of the 12-week block focused on ${g} within the ${m} modality.`,
    medium: "The quarter alternates base, progression, intensification and deload to avoid plateaus and maintain consistency.",
    long: "The annual path uses four 12-week blocks to support short-, mid-, and long-term progress with a professional foundation."
  },
  fr: {
    short: (w, g, m) => `Semaine ${w} du bloc de 12 semaines axée sur ${g} dans la modalité ${m}.`,
    medium: "Le trimestre alterne base, progression, intensification et deload pour éviter les plateaux et maintenir la régularité.",
    long: "Le parcours annuel utilise quatre blocs de 12 semaines pour soutenir le court, moyen et long terme avec une base professionnelle."
  },
  de: {
    short: (w, g, m) => `Woche ${w} des 12-Wochen-Blocks mit Fokus auf ${g} innerhalb der ${m}-Modalität.`,
    medium: "Das Quartal wechselt zwischen Basis, Progression, Intensivierung und Deload, um Plateaus zu vermeiden und Konstanz zu halten.",
    long: "Der Jahresverlauf nutzt vier 12-Wochen-Blöcke, um kurz-, mittel- und langfristigen Fortschritt mit professioneller Grundlage zu sichern."
  }
};
const adjustmentsCopy = {
  pt: {
    recovery: { femaleRecomp: "volume distribuído com recuperação mais protegida", femaleDefault: "frequência consistente com margem boa de recuperação", maleRecovery: "intensidade preservada com volume mais controlado", maleDefault: "janela maior para intensificação progressiva quando a base nutricional sustenta.", neutral: "recuperação ajustada pelo estado corporal e nutricional atual." },
    split: { femaleMassDef: "prioridade de inferiores e glúteos quando o objetivo pedir.", femaleDefault: "divisão equilibrada sem perder o foco principal.", maleMassStrength: "mais espaço para peitoral, costas e ombros quando o objetivo justificar.", maleDefault: "divisão equilibrada com foco no objetivo real.", neutral: "o split respeita objetivo, modalidade e contexto do atleta." },
    hormonal: { female: "ajustes finos de densidade e fadiga devem respeitar flutuações hormonais e resposta individual.", male: "blocos de carga podem ser mais agressivos, mas ainda dependem de sono, nutrição e fadiga acumulada.", neutral: "ajustes hormonais dependem do perfil completo e da resposta individual." },
    metabolic: { femaleHigh: "foco em aderência metabólica, densidade moderada e consistência.", femaleLow: "boa tolerância para frequência e bloco estético quando a recuperação acompanha.", maleHigh: "metabolismo pede melhor controle de densidade, energia e aderência.", maleLow: "contexto metabólico favorece ciclos de hipertrofia ou força com boa resposta.", neutral: "o metabolismo do bloco é calibrado por composição corporal, nutrição e aderência." }
  },
  es: {
    recovery: { femaleRecomp: "volumen distribuido con recuperación más protegida", femaleDefault: "frecuencia consistente con buena margen de recuperación", maleRecovery: "intensidad preservada con volumen más controlado", maleDefault: "mayor margen para intensificación progresiva cuando la base nutricional lo sostiene.", neutral: "recuperación ajustada por el estado corporal y nutricional actual." },
    split: { femaleMassDef: "prioridad de piernas y glúteos cuando el objetivo lo requiera.", femaleDefault: "división equilibrada sin perder el enfoque principal.", maleMassStrength: "más espacio para pecho, espalda y hombros cuando el objetivo lo justifique.", maleDefault: "división equilibrada con enfoque en el objetivo real.", neutral: "el split respeta el objetivo, la modalidad y el contexto del atleta." },
    hormonal: { female: "los ajustes finos de densidad y fatiga deben respetar las fluctuaciones hormonales y la respuesta individual.", male: "los bloques de carga pueden ser más agresivos, pero aún dependen del sueño, la nutrición y la fatiga acumulada.", neutral: "los ajustes hormonales dependen del perfil completo y de la respuesta individual." },
    metabolic: { femaleHigh: "foco en adherencia metabólica, densidad moderada y consistencia.", femaleLow: "buena tolerancia para frecuencia y bloque estético cuando la recuperación acompaña.", maleHigh: "el metabolismo pide mejor control de densidad, energía y adherencia.", maleLow: "el contexto metabólico favorece ciclos de hipertrofia o fuerza con buena respuesta.", neutral: "el metabolismo del bloque se calibra por composición corporal, nutrición y adherencia." }
  },
  en: {
    recovery: { femaleRecomp: "distributed volume with more protected recovery", femaleDefault: "consistent frequency with good recovery margin", maleRecovery: "intensity preserved with more controlled volume", maleDefault: "larger window for progressive intensification when nutritional base supports.", neutral: "recovery adjusted by current body and nutritional state." },
    split: { femaleMassDef: "priority of lower body and glutes when objective requires.", femaleDefault: "balanced split without losing main focus.", maleMassStrength: "more space for chest, back and shoulders when objective justifies.", maleDefault: "balanced split focused on real objective.", neutral: "the split respects goal, modality and athlete context." },
    hormonal: { female: "fine adjustments to density and fatigue should respect hormonal fluctuations and individual response.", male: "load blocks can be more aggressive, but still depend on sleep, nutrition and accumulated fatigue.", neutral: "hormonal adjustments depend on the full profile and individual response." },
    metabolic: { femaleHigh: "focus on metabolic adherence, moderate density and consistency.", femaleLow: "good tolerance for frequency and aesthetic block when recovery follows.", maleHigh: "metabolism requires better control of density, energy and adherence.", maleLow: "metabolic context supports hypertrophy or strength cycles with good response.", neutral: "block metabolism is calibrated by body composition, nutrition and adherence." }
  },
  fr: {
    recovery: { femaleRecomp: "volume distribué avec récupération plus protégée", femaleDefault: "fréquence cohérente avec une bonne marge de récupération", maleRecovery: "intensité préservée avec un volume plus contrôlé", maleDefault: "plus grande fenêtre pour l'intensification progressive quand la base nutritionnelle le permet.", neutral: "récupération ajustée par l'état corporel et nutritionnel actuel." },
    split: { femaleMassDef: "priorité aux membres inférieurs et fessiers selon l'objectif.", femaleDefault: "division équilibrée sans perdre le focus principal.", maleMassStrength: "plus de place pour pectoraux, dos et épaules si l'objectif le justifie.", maleDefault: "division équilibrée axée sur l'objectif réel.", neutral: "le split respecte l'objectif, la modalité et le contexte de l'athlète." },
    hormonal: { female: "les ajustements fins de densité et fatigue doivent respecter les fluctuations hormonales et la réponse individuelle.", male: "les blocs de charge peuvent être plus agressifs, mais dépendent toujours du sommeil, de la nutrition et de la fatigue accumulée.", neutral: "les ajustements hormonaux dépendent du profil complet et de la réponse individuelle." },
    metabolic: { femaleHigh: "focus sur l'adhérence métabolique, la densité modérée et la régularité.", femaleLow: "bonne tolérance pour la fréquence et le bloc esthétique quand la récupération suit.", maleHigh: "le métabolisme nécessite un meilleur contrôle de la densité, de l'énergie et de l'adhérence.", maleLow: "le contexte métabolique favorise les cycles d'hypertrophie ou de force avec une bonne réponse.", neutral: "le métabolisme du bloc est calibré par la composition corporelle, la nutrition et l'adhérence." }
  },
  de: {
    recovery: { femaleRecomp: "verteiltes Volumen mit besser geschützter Erholung", femaleDefault: "konsistente Frequenz mit gutem Erholungspuffer", maleRecovery: "Intensität erhalten mit kontrolliertierem Volumen", maleDefault: "größeres Fenster für progressive Intensivierung, wenn die Ernährungsbasis es trägt.", neutral: "Erholung angepasst an aktuellen Körper- und Ernährungszustand." },
    split: { femaleMassDef: "Priorität auf Unterkörper und Gesäß, wenn das Ziel es erfordert.", femaleDefault: "ausgewogene Aufteilung ohne den Hauptfokus zu verlieren.", maleMassStrength: "mehr Raum für Brust, Rücken und Schultern, wenn das Ziel es rechtfertigt.", maleDefault: "ausgewogene Aufteilung mit Fokus auf das tatsächliche Ziel.", neutral: "der Split berücksichtigt Ziel, Modalität und Athletenkontext." },
    hormonal: { female: "Feinabstimmungen bei Dichte und Müdigkeit sollten hormonelle Schwankungen und individuelle Reaktion berücksichtigen.", male: "Lastblöcke können aggressiver sein, hängen aber weiterhin von Schlaf, Ernährung und angesammelter Müdigkeit ab.", neutral: "Hormonelle Anpassungen hängen vom vollständigen Profil und der individuellen Reaktion ab." },
    metabolic: { femaleHigh: "Fokus auf metabolische Kontinuität, moderate Dichte und Konsistenz.", femaleLow: "gute Toleranz für Frequenz und ästhetischen Block, wenn die Erholung mithält.", maleHigh: "Metabolismus erfordert bessere Kontrolle von Dichte, Energie und Kontinuität.", maleLow: "Metabolischer Kontext begünstigt Hypertrophie- oder Kraftzyklen mit guter Reaktion.", neutral: "Block-Metabolismus wird durch Körperzusammensetzung, Ernährung und Kontinuität kalibriert." }
  }
};
function resolveTrainingModality(profile, environment) {
  if (profile.trainingType === "funcional") return "funcional";
  if (profile.trainingType === "calistenia") return "calistenia";
  if (environment.location === "outdoor") return "calistenia";
  return "musculacao";
}
function resolveCurrentWeek(profile) {
  if (!profile.onboardingCompletedAt) return 1;
  const start = new Date(profile.onboardingCompletedAt);
  if (Number.isNaN(start.getTime())) return 1;
  const diffMs = Date.now() - start.getTime();
  const diffWeeks = Math.floor(diffMs / (7 * 24 * 60 * 60 * 1e3)) + 1;
  return Math.max(1, (diffWeeks - 1) % 12 + 1);
}
function resolveWeekPhase(week) {
  if (week <= 4) return "base";
  if (week <= 8) return "progressao";
  if (week <= 11) return "intensificacao";
  return "deload";
}
function resolveWeekEmphasis(phase, modality, profile, locale) {
  const lang = emphasisCopy[locale] ?? emphasisCopy.pt;
  if (phase === "deload") return lang.deload;
  if (phase === "base") {
    if (modality === "calistenia") return lang.base.calistenia;
    if (modality === "funcional") return lang.base.hibrido;
    return lang.base.default;
  }
  if (phase === "progressao") {
    if (profile.goal === "forca") return lang.progressao.forca;
    if (profile.goal === "ganho_massa") return lang.progressao.ganho_massa;
    return lang.progressao.default;
  }
  if (modality === "calistenia") return lang.intensificacao.calistenia;
  if (modality === "funcional") return lang.intensificacao.hibrido;
  return lang.intensificacao.default;
}
function resolveVolumeBias(phase) {
  if (phase === "base" || phase === "progressao") return "alto";
  if (phase === "intensificacao") return "moderado";
  return "baixo";
}
function resolveIntensityBias(phase) {
  if (phase === "base") return "leve";
  if (phase === "progressao") return "moderada";
  if (phase === "intensificacao") return "pesada";
  return "leve";
}
function applyMenstrualCycleVolume(volume, profile) {
  if (!profile.trackCycle || profile.sex !== "feminino") return volume;
  if (profile.menstrualCyclePhase === "menstrual") return "baixo";
  if (profile.menstrualCyclePhase === "luteal") return volume === "alto" ? "moderado" : volume;
  return volume;
}
function applyMenstrualCycleIntensity$1(intensity, profile) {
  if (!profile.trackCycle || profile.sex !== "feminino") return intensity;
  if (profile.menstrualCyclePhase === "menstrual") return "leve";
  if (profile.menstrualCyclePhase === "luteal") return intensity === "pesada" ? "moderada" : intensity;
  if (profile.menstrualCyclePhase === "ovulatory") return intensity === "leve" ? "moderada" : intensity;
  return intensity;
}
function resolveCycleContext(profile, fallback) {
  if (!profile.trackCycle || profile.sex !== "feminino") return fallback;
  const phase = profile.menstrualCyclePhase;
  if (phase === "menstrual") {
    return "ciclo menstrual ativo: reduzir densidade, preservar técnica e proteger recuperação.";
  }
  if (phase === "follicular") {
    return "fase folicular informada: boa janela para progressão técnica e aumento gradual de carga.";
  }
  if (phase === "ovulatory") {
    return "fase ovulatória informada: janela favorável para performance, mantendo controle articular.";
  }
  if (phase === "luteal") {
    return "fase lútea informada: controlar fadiga, volume e retenção, sem forçar picos de carga.";
  }
  return "ciclo menstrual ativado no onboarding: ajuste fino por fase quando informada.";
}
function buildSexSpecificAdjustment(profile, body, nutrition, locale) {
  const t = adjustmentsCopy[locale] ?? adjustmentsCopy.pt;
  if (profile.sex === "feminino") {
    return {
      recoveryBias: body.recompositionFocus || nutrition.needsRecoverySupport ? t.recovery.femaleRecomp : t.recovery.femaleDefault,
      hormonalContext: resolveCycleContext(profile, t.hormonal.female),
      metabolicContext: body.bodyFatPct && body.bodyFatPct > 18 ? t.metabolic.femaleHigh : t.metabolic.femaleLow,
      splitBias: profile.goal === "ganho_massa" || profile.goal === "definicao" ? t.split.femaleMassDef : t.split.femaleDefault
    };
  }
  if (profile.sex === "masculino") {
    return {
      recoveryBias: nutrition.needsRecoverySupport ? t.recovery.maleRecovery : t.recovery.maleDefault,
      hormonalContext: t.hormonal.male,
      metabolicContext: body.bodyFatPct && body.bodyFatPct > 20 ? t.metabolic.maleHigh : t.metabolic.maleLow,
      splitBias: profile.goal === "ganho_massa" || profile.goal === "forca" ? t.split.maleMassStrength : t.split.maleDefault
    };
  }
  return {
    recoveryBias: t.recovery.neutral,
    hormonalContext: t.hormonal.neutral,
    metabolicContext: t.metabolic.neutral,
    splitBias: t.split.neutral
  };
}
function buildSummary(modality, goal, currentWeek, locale) {
  const t = summaryCopy[locale] ?? summaryCopy.pt;
  return {
    shortTerm: t.short(currentWeek, goal.replaceAll("_", " "), modality),
    mediumTerm: t.medium,
    longTerm: t.long
  };
}
function buildPeriodizationBlock(profile, body, nutrition, environment, locale = "pt") {
  const modality = resolveTrainingModality(profile, environment);
  const currentWeek = resolveCurrentWeek(profile);
  return {
    modality,
    goal: profile.goal,
    currentWeek,
    weeks: Array.from({ length: 12 }, (_, index) => {
      const week = index + 1;
      const phase = resolveWeekPhase(week);
      return {
        week,
        phase,
        emphasis: resolveWeekEmphasis(phase, modality, profile, locale),
        volumeBias: applyMenstrualCycleVolume(resolveVolumeBias(phase), profile),
        intensityBias: applyMenstrualCycleIntensity$1(resolveIntensityBias(phase), profile)
      };
    }),
    summary: buildSummary(modality, profile.goal, currentWeek, locale),
    adjustments: buildSexSpecificAdjustment(profile, body, nutrition, locale)
  };
}
const nutritionToday = {
  kcal: { eaten: 1300, goal: 2400 },
  hydration: { eatenMl: 1400, goalMl: 2500 },
  macros: {
    protein: { eaten: 80, goal: 200 },
    fat: { eaten: 88, goal: 136 },
    carbs: { eaten: 120, goal: 240 }
  },
  meals: [
    { id: "m1", name: "Café da manhã", time: "08:00", kcal: 420, goal: 500 },
    { id: "m2", name: "Almoço", time: "12:30", kcal: 680, goal: 800 },
    { id: "m3", name: "Lanche", time: "16:00", kcal: 200, goal: 300 },
    { id: "m4", name: "Jantar", time: "20:00", kcal: 0, goal: 800 }
  ]
};
function toPercent(eaten, goal) {
  if (goal <= 0) return 0;
  return Math.max(0, Math.min(100, Math.round(eaten / goal * 100)));
}
function resolveReadinessLevel(kcalPct, proteinPct, confidence) {
  if (kcalPct >= 75 && proteinPct >= 70 && confidence >= 85) return "alta";
  if (kcalPct >= 55 && proteinPct >= 50) return "media";
  return "baixa";
}
function buildNutritionTrainingContext(snapshot = nutritionToday, scans = foodScans) {
  const lastFoodScan = scans[0] ?? null;
  const kcalCompletionPct = toPercent(snapshot.kcal.eaten, snapshot.kcal.goal);
  const proteinCompletionPct = toPercent(snapshot.macros.protein.eaten, snapshot.macros.protein.goal);
  const carbsCompletionPct = toPercent(snapshot.macros.carbs.eaten, snapshot.macros.carbs.goal);
  const hydrationCompletionPct = toPercent(
    snapshot.hydration.eatenMl,
    snapshot.hydration.goalMl
  );
  const confidence = lastFoodScan?.qualidade.confiancaLeitura ?? 0;
  const readinessLevel = resolveReadinessLevel(kcalCompletionPct, proteinCompletionPct, confidence);
  const hydrationStatus = hydrationCompletionPct >= 80 ? "alta" : hydrationCompletionPct >= 55 ? "media" : "baixa";
  return {
    kcalCompletionPct,
    proteinCompletionPct,
    carbsCompletionPct,
    hydrationCompletionPct,
    lastFoodScan,
    readinessLevel,
    needsRecoverySupport: kcalCompletionPct < 60 || proteinCompletionPct < 55 || hydrationCompletionPct < 55,
    hydrationStatus
  };
}
const KEY = "zyrox.onboarding";
function loadOnboarding() {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}
function saveOnboarding(state) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(state));
  import("./firestore-profile-CBXOZDAC.js").then(
    ({ saveProfileToFirestore }) => import("./firebase-CeVmTMBf.js").then((n) => n.n).then(({ auth }) => {
      const user = auth.currentUser;
      if (!user) return;
      saveProfileToFirestore(user.uid, state).catch(() => {
      });
      import("./firestore-local-state-D31V5Cyg.js").then(({ scheduleLocalStateSync }) => {
        scheduleLocalStateSync(user.uid);
      });
    })
  );
}
function clearOnboarding() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(KEY);
}
function isOnboarded() {
  return Boolean(loadOnboarding().completedAt);
}
const LOCALE_KEY = "zyrox.locale";
const DEFAULT_LOCALE = "pt";
const SUPPORTED_LOCALES = [
  { code: "pt", label: "Portuguese", nativeLabel: "Português (Brasil)", countryLabel: "Brasil", flag: "BR", flagSrc: "https://flagcdn.com/w40/br.png" },
  { code: "es", label: "Spanish", nativeLabel: "Español", countryLabel: "España", flag: "ES", flagSrc: "https://flagcdn.com/w40/es.png" },
  { code: "en", label: "English", nativeLabel: "English", countryLabel: "United States", flag: "US", flagSrc: "https://flagcdn.com/w40/us.png" },
  { code: "fr", label: "French", nativeLabel: "Français", countryLabel: "France", flag: "FR", flagSrc: "https://flagcdn.com/w40/fr.png" },
  { code: "de", label: "German", nativeLabel: "Deutsch", countryLabel: "Deutschland", flag: "DE", flagSrc: "https://flagcdn.com/w40/de.png" }
];
const localeToHtmlLang = {
  pt: "pt-BR",
  es: "es",
  en: "en",
  fr: "fr",
  de: "de"
};
function normalizeLocaleTag(value) {
  return value.trim().toLowerCase();
}
function inferLocaleFromTag(value) {
  const tag = normalizeLocaleTag(value);
  if (tag.startsWith("pt")) return "pt";
  if (tag.startsWith("es")) return "es";
  if (tag.startsWith("fr")) return "fr";
  if (tag.startsWith("de")) return "de";
  if (tag.startsWith("en")) return "en";
  return DEFAULT_LOCALE;
}
function applyLocaleToDocument(locale) {
  if (typeof document === "undefined") return;
  document.documentElement.lang = localeToHtmlLang[locale] ?? localeToHtmlLang[DEFAULT_LOCALE];
}
function getDefaultLocale() {
  return DEFAULT_LOCALE;
}
function detectBrowserLocale() {
  if (typeof window === "undefined") return DEFAULT_LOCALE;
  const candidates = Array.isArray(window.navigator.languages) && window.navigator.languages.length > 0 ? window.navigator.languages : [window.navigator.language];
  for (const candidate of candidates) {
    if (!candidate) continue;
    return inferLocaleFromTag(candidate);
  }
  return DEFAULT_LOCALE;
}
function getStoredLocale() {
  if (typeof window === "undefined") return DEFAULT_LOCALE;
  const value = window.localStorage.getItem(LOCALE_KEY);
  const locale = SUPPORTED_LOCALES.some((item) => item.code === value) ? value : detectBrowserLocale();
  applyLocaleToDocument(locale);
  return locale;
}
function setStoredLocale(locale) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(LOCALE_KEY, locale);
  applyLocaleToDocument(locale);
}
const defaultLocale = getDefaultLocale();
const trainingCopy = {
  pt: {
    focusSeparator: " | ",
    categoryLabels: {
      peitoral: "Peitoral",
      costas_trapezio: "Costas e Trapézio",
      deltoides: "Deltoides",
      biceps_antebraco: "Bíceps e Antebraço",
      triceps: "Tríceps",
      abdomen_core: "Abdômen e Core",
      membros_inferiores_gluteos: "Membros Inferiores e Glúteos",
      panturrilha: "Panturrilha"
    },
    splitLabels: {
      full_body: "Corpo Inteiro",
      upper_lower: "Superior/Inferior",
      push_pull_legs: "Empurrar/Puxar/Pernas",
      female_lower_priority: "Inferiores Prioritários",
      male_upper_lower_bias: "Superior/Inferior com Viés Superior",
      performance_hybrid: "Performance Híbrida"
    },
    workoutTypes: { musculacao: "Musculação", funcional: "Funcional", calistenia: "Calistenia", hibrido: "Híbrido" },
    workoutNames: {
      Push: "Treino de Empurrar",
      Pull: "Treino de Puxar",
      Legs: "Treino de Pernas",
      LegsLowerPriority: "Treino de Inferiores e Glúteos",
      Upper: "Treino de Superiores",
      Lower: "Treino Inferior",
      "Hybrid Performance": "Treino de Performance Híbrida",
      "Functional Performance": "Treino Funcional"
    },
    goalTags: { ganho_massa: "Hipertrofia", perda_peso: "Definição", definicao: "Definição", forca: "Força", performance: "Performance", saude: "Saúde" },
    weekDays: ["Seg", "Ter", "Qua", "Qui", "Sex", "Sab", "Dom"],
    intensityLabels: { leve: "Leve", moderada: "Moderada", pesada: "Pesada" },
    phaseLabels: { base: "Base", progressao: "Progressão", intensificacao: "Intensificação", deload: "Deload" },
    modalityLabels: { academia: "Academia", musculacao: "Musculação", funcional: "Funcional", calistenia: "Calistenia", hibrido: "Híbrido" }
  },
  es: {
    focusSeparator: " | ",
    categoryLabels: {
      peitoral: "Pecho",
      costas_trapezio: "Espalda y Trapecio",
      deltoides: "Deltoides",
      biceps_antebraco: "Bíceps y Antebrazo",
      triceps: "Tríceps",
      abdomen_core: "Abdomen y Core",
      membros_inferiores_gluteos: "Piernas y Glúteos",
      panturrilha: "Pantorrilla"
    },
    splitLabels: {
      full_body: "Cuerpo Completo",
      upper_lower: "Superior/Inferior",
      push_pull_legs: "Empuje/Tirón/Piernas",
      female_lower_priority: "Prioridad en Inferiores",
      male_upper_lower_bias: "Superior/Inferior con Sesgo Superior",
      performance_hybrid: "Rendimiento Híbrido"
    },
    workoutTypes: { musculacao: "Musculación", funcional: "Funcional", calistenia: "Calistenia", hibrido: "Híbrido" },
    workoutNames: {
      Push: "Entrenamiento de Empuje",
      Pull: "Entrenamiento de Tirón",
      Legs: "Entrenamiento de Piernas",
      LegsLowerPriority: "Entrenamiento de Piernas y Glúteos",
      Upper: "Entrenamiento Superior",
      Lower: "Entrenamiento Inferior",
      "Hybrid Performance": "Entrenamiento de Rendimiento Híbrido",
      "Functional Performance": "Entrenamiento Funcional"
    },
    goalTags: { ganho_massa: "Hipertrofia", perda_peso: "Definición", definicao: "Definición", forca: "Fuerza", performance: "Rendimiento", saude: "Salud" },
    weekDays: ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"],
    intensityLabels: { leve: "Suave", moderada: "Moderada", pesada: "Pesada" },
    phaseLabels: { base: "Base", progressao: "Progresión", intensificacao: "Intensificación", deload: "Descarga" },
    modalityLabels: { academia: "Gimnasio", musculacao: "Musculación", funcional: "Funcional", calistenia: "Calistenia", hibrido: "Híbrido" }
  },
  en: {
    focusSeparator: " | ",
    categoryLabels: {
      peitoral: "Chest",
      costas_trapezio: "Back and Traps",
      deltoides: "Delts",
      biceps_antebraco: "Biceps and Forearms",
      triceps: "Triceps",
      abdomen_core: "Abs and Core",
      membros_inferiores_gluteos: "Lower Body and Glutes",
      panturrilha: "Calves"
    },
    splitLabels: {
      full_body: "Full Body",
      upper_lower: "Upper/Lower",
      push_pull_legs: "Push/Pull/Legs",
      female_lower_priority: "Lower Priority",
      male_upper_lower_bias: "Upper/Lower with Upper Bias",
      performance_hybrid: "Hybrid Performance"
    },
    workoutTypes: { musculacao: "Strength", funcional: "Functional", calistenia: "Calisthenics", hibrido: "Hybrid" },
    workoutNames: {
      Push: "Push Workout",
      Pull: "Pull Workout",
      Legs: "Leg Workout",
      LegsLowerPriority: "Lower Body and Glutes Workout",
      Upper: "Upper Workout",
      Lower: "Lower Workout",
      "Hybrid Performance": "Hybrid Performance Workout",
      "Functional Performance": "Functional Workout"
    },
    goalTags: { ganho_massa: "Hypertrophy", perda_peso: "Cut", definicao: "Cut", forca: "Strength", performance: "Performance", saude: "Health" },
    weekDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    intensityLabels: { leve: "Light", moderada: "Moderate", pesada: "Heavy" },
    phaseLabels: { base: "Base", progressao: "Progression", intensificacao: "Intensification", deload: "Deload" },
    modalityLabels: { academia: "Gym", musculacao: "Strength", funcional: "Functional", calistenia: "Calisthenics", hibrido: "Hybrid" }
  },
  fr: {
    focusSeparator: " | ",
    categoryLabels: {
      peitoral: "Pectoraux",
      costas_trapezio: "Dos et Trapèzes",
      deltoides: "Deltoïdes",
      biceps_antebraco: "Biceps et Avant-bras",
      triceps: "Triceps",
      abdomen_core: "Abdos et Core",
      membros_inferiores_gluteos: "Bas du Corps et Fessiers",
      panturrilha: "Mollets"
    },
    splitLabels: {
      full_body: "Corps Complet",
      upper_lower: "Haut/Bas",
      push_pull_legs: "Poussée/Tirage/Jambes",
      female_lower_priority: "Priorité Bas du Corps",
      male_upper_lower_bias: "Haut/Bas avec Biais Haut",
      performance_hybrid: "Performance Hybride"
    },
    workoutTypes: { musculacao: "Musculation", funcional: "Fonctionnel", calistenia: "Calisthénie", hibrido: "Hybride" },
    workoutNames: {
      Push: "Séance de Poussée",
      Pull: "Séance de Tirage",
      Legs: "Séance Jambes",
      LegsLowerPriority: "Séance Jambes et Fessiers",
      Upper: "Séance Haut du Corps",
      Lower: "Séance Bas du Corps",
      "Hybrid Performance": "Séance de Performance Hybride",
      "Functional Performance": "Séance Fonctionnelle"
    },
    goalTags: { ganho_massa: "Hypertrophie", perda_peso: "Définition", definicao: "Définition", forca: "Force", performance: "Performance", saude: "Santé" },
    weekDays: ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"],
    intensityLabels: { leve: "Légère", moderada: "Modérée", pesada: "Lourde" },
    phaseLabels: { base: "Base", progressao: "Progression", intensificacao: "Intensification", deload: "Deload" },
    modalityLabels: { academia: "Salle", musculacao: "Musculation", funcional: "Fonctionnel", calistenia: "Calisthénie", hibrido: "Hybride" }
  },
  de: {
    focusSeparator: " | ",
    categoryLabels: {
      peitoral: "Brust",
      costas_trapezio: "Rücken und Trapez",
      deltoides: "Deltoideus",
      biceps_antebraco: "Bizeps und Unterarme",
      triceps: "Trizeps",
      abdomen_core: "Bauch und Core",
      membros_inferiores_gluteos: "Unterkörper und Gluteus",
      panturrilha: "Waden"
    },
    splitLabels: {
      full_body: "Ganzkörper",
      upper_lower: "Oberkörper/Unterkörper",
      push_pull_legs: "Push/Pull/Beine",
      female_lower_priority: "Unterkörper-Priorität",
      male_upper_lower_bias: "Ober/Unter mit Oberkörper-Bias",
      performance_hybrid: "Hybride Performance"
    },
    workoutTypes: { musculacao: "Krafttraining", funcional: "Funktionell", calistenia: "Calisthenics", hibrido: "Hybrid" },
    workoutNames: {
      Push: "Push-Training",
      Pull: "Pull-Training",
      Legs: "Beintraining",
      LegsLowerPriority: "Beine-und-Gluteus-Training",
      Upper: "Oberkörper-Training",
      Lower: "Unterkörper-Training",
      "Hybrid Performance": "Hybrides Performance-Training",
      "Functional Performance": "Funktionelles Training"
    },
    goalTags: { ganho_massa: "Hypertrophie", perda_peso: "Definition", definicao: "Definition", forca: "Kraft", performance: "Performance", saude: "Gesundheit" },
    weekDays: ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"],
    intensityLabels: { leve: "Leicht", moderada: "Moderat", pesada: "Schwer" },
    phaseLabels: { base: "Basis", progressao: "Progression", intensificacao: "Intensivierung", deload: "Deload" },
    modalityLabels: { academia: "Fitnessstudio", musculacao: "Krafttraining", funcional: "Funktionell", calistenia: "Calisthenics", hibrido: "Hybrid" }
  }
};
function getTrainingCopy(locale = getStoredLocale()) {
  return trainingCopy[locale] ?? trainingCopy[defaultLocale];
}
function normalizeKey(value) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}
function getCategoryLabel(category, locale = getStoredLocale()) {
  return getTrainingCopy(locale).categoryLabels[category];
}
function getFocusSeparator(locale = getStoredLocale()) {
  return getTrainingCopy(locale).focusSeparator;
}
function getSplitLabel(split, locale = getStoredLocale()) {
  return getTrainingCopy(locale).splitLabels[split];
}
function getWorkoutTypeLabel(type, locale = getStoredLocale()) {
  const normalized = normalizeKey(type);
  const labels = getTrainingCopy(locale).workoutTypes;
  if (normalized === "musculacao") return labels.musculacao;
  if (normalized === "funcional") return labels.funcional;
  if (normalized === "hibrido") return labels.hibrido;
  if (normalized === "calistenia") return labels.calistenia;
  return type;
}
function getWorkoutNameLabel(templateName, options = {}, locale = getStoredLocale()) {
  const labels = getTrainingCopy(locale).workoutNames;
  if (templateName === "Push") return labels.Push;
  if (templateName === "Pull") return labels.Pull;
  if (templateName === "Legs") return options.prefersLowerPriority ? labels.LegsLowerPriority : labels.Legs;
  if (templateName === "Upper") return labels.Upper;
  if (templateName === "Lower") return `${labels.Lower} ${(options.index ?? 0) + 1}`;
  if (templateName === "Hybrid Performance") return labels["Hybrid Performance"];
  if (templateName === "Functional Performance") return labels["Functional Performance"];
  return templateName;
}
function getGoalTagLabel(goal, locale = getStoredLocale()) {
  return getTrainingCopy(locale).goalTags[goal];
}
function getWeekDayLabels(locale = getStoredLocale()) {
  return getTrainingCopy(locale).weekDays;
}
function getIntensityLabel(value, locale = getStoredLocale()) {
  const normalized = normalizeKey(value);
  const labels = getTrainingCopy(locale).intensityLabels;
  if (normalized.startsWith("lev")) return labels.leve;
  if (normalized.startsWith("mod")) return labels.moderada;
  return labels.pesada;
}
function getPhaseLabel(value, locale = getStoredLocale()) {
  return getTrainingCopy(locale).phaseLabels[value];
}
function getModalityLabel(value, locale = getStoredLocale()) {
  return getTrainingCopy(locale).modalityLabels[value];
}
const volumeBiasLabels = {
  pt: { alto: "Alto", moderado: "Moderado", baixo: "Baixo" },
  es: { alto: "Alto", moderado: "Moderado", baixo: "Bajo" },
  en: { alto: "High", moderado: "Moderate", baixo: "Low" },
  fr: { alto: "Élevé", moderado: "Modéré", baixo: "Bas" },
  de: { alto: "Hoch", moderado: "Moderat", baixo: "Niedrig" }
};
function getVolumeBiasLabel(value, locale = getStoredLocale()) {
  return (volumeBiasLabels[locale] ?? volumeBiasLabels.pt)[value];
}
const readinessLevelLabels = {
  pt: { alta: "Alta", media: "Média", baixa: "Baixa" },
  es: { alta: "Alta", media: "Media", baixa: "Baja" },
  en: { alta: "High", media: "Medium", baixa: "Low" },
  fr: { alta: "Élevée", media: "Moyenne", baixa: "Faible" },
  de: { alta: "Hoch", media: "Mittel", baixa: "Niedrig" }
};
function getReadinessLevelLabel(value, locale = getStoredLocale()) {
  return (readinessLevelLabels[locale] ?? readinessLevelLabels.pt)[value];
}
const workoutNameTranslations = {
  "Push A — Força": { en: "Push A — Strength", es: "Empuje A — Fuerza", fr: "Poussée A — Force", de: "Drücken A — Kraft" },
  "Pull A — Costas": { en: "Pull A — Back", es: "Tirón A — Espalda", fr: "Tirage A — Dos", de: "Ziehen A — Rücken" },
  "Legs A — Quadríceps": { en: "Legs A — Quads", es: "Piernas A — Cuádriceps", fr: "Jambes A — Quadriceps", de: "Beine A — Quadrizeps" },
  "Push B — Ombros": { en: "Push B — Shoulders", es: "Empuje B — Hombros", fr: "Poussée B — Épaules", de: "Drücken B — Schultern" },
  "Pull B — Bíceps": { en: "Pull B — Biceps", es: "Tirón B — Bíceps", fr: "Tirage B — Biceps", de: "Ziehen B — Bizeps" },
  "Legs B — Glúteos": { en: "Legs B — Glutes", es: "Piernas B — Glúteos", fr: "Jambes B — Fessiers", de: "Beine B — Gesäß" },
  "Full Body A": { en: "Full Body A", es: "Cuerpo Completo A", fr: "Corps Complet A", de: "Ganzkörper A" },
  "Full Body B": { en: "Full Body B", es: "Cuerpo Completo B", fr: "Corps Complet B", de: "Ganzkörper B" },
  "Upper A — Empurrar": { en: "Upper A — Push", es: "Superior A — Empuje", fr: "Haut A — Poussée", de: "Oberkörper A — Drücken" },
  "Upper B — Puxar": { en: "Upper B — Pull", es: "Superior B — Tirón", fr: "Haut B — Tirage", de: "Oberkörper B — Ziehen" },
  "Lower A — Quadríceps": { en: "Lower A — Quads", es: "Inferior A — Cuádriceps", fr: "Bas A — Quadriceps", de: "Unterkörper A — Quadrizeps" },
  "Lower B — Posterior": { en: "Lower B — Hamstrings", es: "Inferior B — Isquios", fr: "Bas B — Ischio-jambiers", de: "Unterkörper B — Beinbeuger" },
  "Lower A — Glúteos": { en: "Lower A — Glutes", es: "Inferior A — Glúteos", fr: "Bas A — Fessiers", de: "Unterkörper A — Gesäß" },
  "Upper — Definição": { en: "Upper — Sculpting", es: "Superior — Definición", fr: "Haut — Sculpture", de: "Oberkörper — Definition" },
  "Hybrid Performance": { en: "Hybrid Performance", es: "Rendimiento Híbrido", fr: "Performance Hybride", de: "Hybride Performance" }
};
function translateWorkoutName(name, locale = getStoredLocale()) {
  if (locale === "pt") return name;
  const entry = workoutNameTranslations[name];
  return entry?.[locale] ?? name;
}
const STORAGE_KEY = "zyrox-workout-customizations-v1";
function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}
function readStore() {
  if (!canUseStorage()) return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}
function writeStore(store) {
  if (!canUseStorage()) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch {
  }
}
function getWorkoutCustomization(workoutId) {
  return readStore()[workoutId] ?? null;
}
function saveWorkoutCustomization(customization) {
  const store = readStore();
  store[customization.workoutId] = customization;
  writeStore(store);
  import("./firestore-customizations-CC87Xh8r.js").then(
    ({ saveCustomizationToFirestore }) => import("./firebase-CeVmTMBf.js").then((n) => n.n).then(({ auth }) => {
      const user = auth.currentUser;
      if (user) saveCustomizationToFirestore(user.uid, customization).catch(() => {
      });
    })
  );
}
function clearWorkoutCustomization(workoutId) {
  const store = readStore();
  delete store[workoutId];
  writeStore(store);
  import("./firestore-customizations-CC87Xh8r.js").then(
    ({ deleteCustomizationFromFirestore }) => import("./firebase-CeVmTMBf.js").then((n) => n.n).then(({ auth }) => {
      const user = auth.currentUser;
      if (user) deleteCustomizationFromFirestore(user.uid, workoutId).catch(() => {
      });
    })
  );
}
const DEFAULT_WEEK_DAYS = [0, 1, 2];
function capitalize(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
function unique(values) {
  return Array.from(new Set(values));
}
function normalizeName(value) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}
function resolveWorkoutName(template, profile, index) {
  return getWorkoutNameLabel(
    template.name,
    {
      prefersLowerPriority: prefersLowerPriority(profile),
      index
    }
  );
}
function prefersLowerPriority(profile) {
  return profile.sex === "feminino" && ["ganho_massa", "definicao", "perda_peso"].includes(profile.goal);
}
function resolveFocus(template) {
  return unique(template.categories.map((item) => getCategoryLabel(item.primary))).join(
    getFocusSeparator()
  );
}
function resolveWorkoutTag(profile) {
  return getGoalTagLabel(profile.goal);
}
function resolveRestSeconds(category, intensity) {
  if (category === "membros_inferiores_gluteos") return intensity === "pesada" ? 120 : 90;
  if (category === "peitoral" || category === "costas_trapezio" || category === "deltoides") {
    return intensity === "pesada" ? 90 : 75;
  }
  return intensity === "leve" ? 45 : 60;
}
function resolveSetScheme(category, intensity, density) {
  const repsBase = category === "abdomen_core" ? 15 : category === "panturrilha" ? 18 : intensity === "pesada" ? 8 : 12;
  const numberOfSets = density === "alta" ? 2 : 3;
  return Array.from({ length: numberOfSets }).map((_, index) => ({
    reps: Math.max(8, repsBase - (intensity === "pesada" ? index : 0)),
    weight: 0
  }));
}
function supportsProfileEquipment(record, profile) {
  if (record.equipment === "peso_corporal") return true;
  if (profile.equipment.length === 0) {
    if (profile.location === "casa") return false;
    if (profile.location === "outdoor") {
      return ["barra_fixa", "paralelas", "parede", "trx"].includes(record.equipment);
    }
    return true;
  }
  const equipmentMap = {
    barra: ["barras", "barra", "anilhas", "rack"],
    halteres: ["halteres", "halter", "kettlebell"],
    cabos: ["cabos", "cabo"],
    maquina: ["maquinas", "maquina"],
    peso_corporal: ["peso corporal"],
    barra_fixa: ["barra fixa"],
    paralelas: ["paralelas", "argolas"],
    parede: ["parede"],
    banco: ["banco"],
    trx: ["trx"],
    bola: ["bola"],
    elastico: ["elasticos", "elastico", "elasticos"]
  };
  const accepted = equipmentMap[record.equipment] ?? [record.equipment];
  const normalizedEquipment = profile.equipment.map(normalizeName);
  return accepted.some((candidate) => normalizedEquipment.includes(normalizeName(candidate)));
}
function supportsEnvironment(record, environment) {
  if (environment.location === "outdoor") {
    return record.trainingType === "calistenia" && ["peso_corporal", "barra_fixa", "paralelas", "parede", "trx"].includes(record.equipment);
  }
  if (environment.location === "casa") {
    return record.equipment !== "maquina" && record.equipment !== "cabos";
  }
  return true;
}
function supportsTrainingType(record, profile, environment) {
  if (profile.trainingType === "calistenia") return record.trainingType === "calistenia";
  if (profile.trainingType === "musculacao") return record.trainingType === "musculacao";
  if (profile.trainingType === "funcional") {
    if (record.trainingType === "calistenia") return true;
    if (["barra", "halteres", "banco", "maquina", "cabos"].includes(record.equipment)) return false;
    return isFunctionalExerciseRecord(record);
  }
  if (environment.location === "outdoor" || environment.location === "casa") return true;
  return record.trainingType === "musculacao";
}
function scoreEnvironmentFit(record, environment) {
  let score = 0;
  if (environment.location === "casa" && ["peso_corporal", "halteres", "barra", "elastico", "banco"].includes(record.equipment)) {
    score += 3;
  }
  if (environment.location === "outdoor" && ["peso_corporal", "barra_fixa", "paralelas", "parede", "trx"].includes(record.equipment)) {
    score += 4;
  }
  if (environment.gymSize === "pequena" && (record.equipment === "maquina" || record.equipment === "cabos")) {
    score -= 1;
  }
  if (environment.crowdLevel === "pico" && (record.equipment === "maquina" || record.equipment === "cabos")) {
    score -= 2;
  }
  return score;
}
function getMovementPattern(record) {
  return record.movementPattern.pt;
}
function resolveExerciseFamily(record) {
  const name = normalizeName(record.name.pt);
  const movement = normalizeName(getMovementPattern(record));
  if (name.includes("remada curvada")) return "costas:remada_curvada";
  if (name.includes("remada baixa")) return "costas:remada_baixa";
  if (name.includes("remada unilateral")) return "costas:remada_unilateral";
  if (name.includes("remada")) return `costas:${name.replace(/\b(pronada|supinada|aberta|fechada|neutra|pegada|com|no|na|cabo|halteres?)\b/g, "").replace(/\s+/g, "_")}`;
  if (name.includes("puxada alta") || name.includes("pulldown") || name.includes("pulley")) return "costas:puxada_alta";
  if (name.includes("barra fixa") || name.includes("pull up") || name.includes("chin up")) return "costas:barra_fixa";
  if (name.includes("rosca martelo")) return "biceps:rosca_martelo";
  if (name.includes("rosca scott")) return "biceps:rosca_scott";
  if (name.includes("rosca direta")) return "biceps:rosca_direta";
  if (name.includes("rosca unilateral")) return "biceps:rosca_unilateral";
  if (record.category === "biceps_antebraco" && (name.includes("rosca") || name.includes("curl"))) {
    return `biceps:${name.replace(/\b(unilateral|bilateral|pronada|supinada|alternada|com|no|na|cabo|halteres?|barra)\b/g, "").replace(/\s+/g, "_")}`;
  }
  if (record.category === "triceps") {
    if (name.includes("corda")) return "triceps:corda";
    if (name.includes("frances")) return "triceps:frances";
    if (name.includes("testa")) return "triceps:testa";
    if (name.includes("coice") || name.includes("patada")) return "triceps:coice";
    if (name.includes("mergulho") || name.includes("paralela")) return "triceps:mergulho";
    if (name.includes("extensao") || movement.includes("extensao")) return "triceps:extensao";
  }
  if (name.includes("supino reto")) return "peitoral:supino_reto";
  if (name.includes("supino inclinado")) return "peitoral:supino_inclinado";
  if (name.includes("supino declinado")) return "peitoral:supino_declinado";
  if (name.includes("crucifixo")) return "peitoral:crucifixo";
  if (name.includes("crossover")) return "peitoral:crossover";
  return `${record.category}:${name.replace(/\b(pronada|supinada|aberta|fechada|neutra|pegada|unilateral|bilateral)\b/g, "").replace(/\s+/g, "_")}`;
}
function resolveMovementBucket(record) {
  const name = normalizeName(record.name.pt);
  const movement = normalizeName(getMovementPattern(record));
  if (name.includes("remada") || movement.includes("puxar horizontal")) return "horizontal_pull";
  if (name.includes("puxada") || name.includes("pulldown") || name.includes("pulley") || name.includes("barra fixa") || movement.includes("puxar vertical")) return "vertical_pull";
  if (record.category === "biceps_antebraco" || name.includes("rosca") || name.includes("curl")) return "biceps_curl";
  if (record.category === "triceps") return "triceps_extension";
  if (name.includes("face pull") || name.includes("posterior") || name.includes("crucifixo invertido") || name.includes("encolhimento")) return "scapula_rear_delt";
  if (name.includes("supino") || name.includes("chest press") || name.includes("flexao") || movement.includes("empurrar horizontal")) return "horizontal_press";
  if (name.includes("desenvolvimento") || movement.includes("empurrar vertical")) return "vertical_press";
  if (name.includes("crucifixo") || name.includes("crossover") || name.includes("fly")) return "fly";
  if (name.includes("agach") || name.includes("leg press") || name.includes("extensora")) return "squat_knee";
  if (name.includes("stiff") || name.includes("terra") || name.includes("flexora") || movement.includes("hip hinge")) return "hinge_posterior";
  if (name.includes("hip thrust") || name.includes("ponte") || name.includes("abdutor")) return "glute_hip";
  if (record.category === "panturrilha") return "calf";
  if (record.category === "abdomen_core") return "core";
  return record.category;
}
function getMovementBucketLimit(bucket) {
  if (bucket === "horizontal_pull") return 2;
  if (bucket === "vertical_pull") return 2;
  if (bucket === "biceps_curl") return 2;
  if (bucket === "triceps_extension") return 2;
  if (bucket === "horizontal_press") return 2;
  if (bucket === "vertical_press") return 2;
  if (bucket === "fly") return 1;
  if (bucket === "squat_knee") return 2;
  if (bucket === "hinge_posterior") return 2;
  if (bucket === "glute_hip") return 2;
  if (bucket === "core") return 2;
  return 3;
}
function canAddExerciseToSelection(selected, candidate, options = {}) {
  const candidateFamily = resolveExerciseFamily(candidate);
  if (selected.some((record) => resolveExerciseFamily(record) === candidateFamily)) return false;
  if (options.relaxBucketLimit) return true;
  const candidateBucket = resolveMovementBucket(candidate);
  const bucketCount = selected.filter((record) => resolveMovementBucket(record) === candidateBucket).length;
  return bucketCount < getMovementBucketLimit(candidateBucket);
}
function scoreExerciseQuality(record) {
  let score = 0;
  const name = normalizeName(record.name.pt);
  const movement = normalizeName(getMovementPattern(record));
  if (record.status === "active") score += 100;
  if (record.gifSource === "official") score += 8;
  if (record.gifSource === "catalog") score += 2;
  if (["agachamento", "supino", "remada", "puxada", "desenvolvimento", "stiff", "leg press", "elevacao", "triceps", "rosca", "panturrilha", "abdutor", "abdominal", "prancha"].some((token) => name.includes(token))) {
    score += 6;
  }
  if (["coice", "agachado", "deitado unilateral", "com apoio", "improviso"].some((token) => name.includes(token))) {
    score -= 8;
  }
  if (movement.includes("empurrar horizontal") || movement.includes("puxar horizontal") || movement.includes("puxar vertical") || movement.includes("empurrar vertical") || movement.includes("agach") || movement.includes("hip hinge")) {
    score += 4;
  }
  return score;
}
function scoreGenderFit(record, profile) {
  if (!profile.sex) return 0;
  const name = normalizeName(record.name.pt);
  const movement = normalizeName(getMovementPattern(record));
  if (profile.sex === "feminino") {
    let score = 0;
    if (["hip thrust", "abdutor", "ponte", "abdutora", "sumo"].some((t) => name.includes(t))) score += 14;
    if (record.category === "membros_inferiores_gluteos" && movement.includes("hip thrust")) score += 14;
    if (["stiff", "passada", "afundo", "avanco", "agachamento bulgaro"].some((t) => name.includes(t))) score += 10;
    if (["extensora", "flexora", "cadeira"].some((t) => name.includes(t))) score += 6;
    if (["feminino"].some((t) => name.includes(t))) score += 8;
    if (["masculino"].some((t) => name.includes(t))) score -= 8;
    if (["supino reto", "supino inclinado"].some((t) => name.includes(t)) && record.category === "peitoral") score -= 4;
    return score;
  }
  if (profile.sex === "masculino") {
    let score = 0;
    if (["masculino"].some((t) => name.includes(t))) score += 8;
    if (["feminino"].some((t) => name.includes(t))) score -= 8;
    if (["supino", "agachamento", "barra fixa", "desenvolvimento", "levantamento", "stiff", "remada curvada"].some((t) => name.includes(t))) score += 6;
    return score;
  }
  return 0;
}
function scoreTemplateFit(record, template, profile) {
  let score = 0;
  const name = normalizeName(record.name.pt);
  const movement = normalizeName(getMovementPattern(record));
  const tName = template.name;
  if (tName.includes("Costas") && record.category === "costas_trapezio") score += 12;
  if (tName.includes("Peito") && record.category === "peitoral") score += 12;
  if (tName.includes("Tríceps") && record.category === "triceps") score += 10;
  if (tName.includes("Bíceps") && record.category === "biceps_antebraco") score += 10;
  if (tName.includes("Ombros") && record.category === "deltoides") score += 10;
  if (tName.includes("Ombro") && record.category === "deltoides") score += 10;
  if (tName.includes("Braços") && ["biceps_antebraco", "triceps"].includes(record.category)) score += 12;
  if ((tName.includes("Pernas") || tName.includes("Quadríceps") || tName.includes("Posterior") || tName.includes("Glúteos")) && record.category === "membros_inferiores_gluteos") score += 12;
  if ((tName.includes("Panturrilha") || tName.includes("Pernas")) && record.category === "panturrilha") score += 8;
  if ((tName.includes("Core") || tName.includes("Abdômen")) && record.category === "abdomen_core") score += 8;
  if (tName.startsWith("Push") || tName.includes(" Push") || tName.startsWith("Upper A")) {
    if (record.category === "peitoral" && movement.includes("empurrar horizontal")) score += 12;
    if (record.category === "deltoides" && movement.includes("empurrar vertical")) score += 10;
    if (record.category === "triceps") score += 8;
    if (record.category === "abdomen_core") score += 2;
  }
  if (tName.startsWith("Pull") || tName.includes(" Pull") || tName.startsWith("Upper B")) {
    if (record.category === "costas_trapezio" && (movement.includes("puxar") || movement.includes("remada"))) score += 12;
    if (record.category === "biceps_antebraco") score += 8;
    if (record.category === "deltoides" && name.includes("posterior")) score += 6;
    if (record.category === "abdomen_core") score += 2;
  }
  if (tName === "Upper A — Empurrar") {
    if (record.category === "peitoral") score += 10;
    if (record.category === "costas_trapezio") score += 8;
    if (record.category === "deltoides") score += 6;
    if (record.category === "triceps") score += 6;
  }
  if (tName === "Upper B — Puxar") {
    if (record.category === "costas_trapezio") score += 12;
    if (record.category === "biceps_antebraco") score += 10;
    if (record.category === "peitoral") score += 6;
  }
  if (tName.startsWith("Legs") || tName.includes(" Legs") || tName.startsWith("Lower")) {
    if (record.category === "membros_inferiores_gluteos") score += 12;
    if (record.category === "panturrilha") score += 8;
    if (record.category === "abdomen_core") score += 3;
    if (["agachamento", "leg press", "stiff", "extensora", "flexora", "panturrilha", "abdutor", "quadril", "hip thrust", "passada", "afundo"].some((t) => name.includes(t))) {
      score += 6;
    }
  }
  if (tName.startsWith("Upper")) {
    if (record.category === "costas_trapezio") score += 8;
    if (record.category === "peitoral") score += 8;
    if (record.category === "deltoides") score += 6;
    if (record.category === "triceps") score += 5;
    if (record.category === "biceps_antebraco") score += 5;
  }
  if (tName === "Hybrid Performance" || tName === "Functional Performance" || tName.startsWith("Funcional")) {
    if (["costas_trapezio", "peitoral", "deltoides", "membros_inferiores_gluteos", "abdomen_core"].includes(record.category)) score += 6;
    if (record.trainingType === "calistenia") score += 6;
    if (isFunctionalExerciseRecord(record)) score += 6;
    if (record.equipment === "peso_corporal") score += 5;
    if (["barra", "halteres", "banco", "maquina", "cabos"].includes(record.equipment)) score -= 10;
  }
  if (tName.startsWith("Calistenia")) {
    if (record.trainingType === "calistenia") score += 14;
    if (["peso_corporal", "barra_fixa", "paralelas", "parede", "trx"].includes(record.equipment)) score += 8;
    if (record.equipment === "maquina" || record.equipment === "cabos") score -= 20;
    if (tName.includes("Skills") && (movement.includes("controle") || movement.includes("vertical") || record.category === "abdomen_core")) score += 8;
    if (tName.includes("Full Body") && ["membros_inferiores_gluteos", "costas_trapezio", "peitoral", "abdomen_core"].includes(record.category)) score += 6;
  }
  if (tName.startsWith("Full Body")) {
    if (movement.includes("agach") || movement.includes("hip hinge") || movement.includes("empurrar") || movement.includes("puxar")) score += 4;
  }
  if (profile.location === "casa" && ["halteres", "peso_corporal", "barra", "elastico", "banco"].includes(record.equipment)) {
    score += 5;
  }
  if (profile.location === "hibrido" && (record.trainingType === "calistenia" || ["halteres", "barra", "peso_corporal", "barra_fixa", "paralelas"].includes(record.equipment))) {
    score += 4;
  }
  if (profile.goal === "performance" && (record.trainingType === "calistenia" || movement.includes("vertical") || movement.includes("controle"))) {
    score += 3;
  }
  return score;
}
function getBodyPriorityScore(record, body) {
  const priorityIndex = body.muscularPriorities.indexOf(record.category);
  if (priorityIndex === -1) return 0;
  if (body.priorityLevel === "alta") return 5 - priorityIndex;
  if (body.priorityLevel === "media") return 3 - Math.min(priorityIndex, 2);
  return 1;
}
function downgradeIntensity(intensity) {
  if (intensity === "pesada") return "moderada";
  if (intensity === "moderada") return "leve";
  return intensity;
}
function resolveAdaptiveIntensity(intensity, nutrition) {
  if (nutrition.readinessLevel === "alta") return intensity;
  if (nutrition.readinessLevel === "media") return intensity === "pesada" ? "moderada" : intensity;
  return downgradeIntensity(intensity);
}
function resolveAdaptiveDensity(density, nutrition, body) {
  if (nutrition.needsRecoverySupport) return "controlada";
  if (body.recompositionFocus && density === "controlada") return "moderada";
  return density;
}
function hashString(value) {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = Math.imul(31, hash) + value.charCodeAt(i) | 0;
  }
  return Math.abs(hash);
}
function getUserSeed(profile) {
  if (typeof window === "undefined") return 54321;
  try {
    if (profile) {
      const regenerationSeed = localStorage.getItem("_zyrox_regen_seed") ?? "";
      const profileKey = `${profile.name}|${profile.goal}|${profile.level}|${profile.sex ?? ""}|${profile.location}`;
      return hashString(`${profileKey}|${regenerationSeed}`) % 999983 || 12345;
    }
    let seed = localStorage.getItem("_zyrox_seed");
    if (!seed) {
      seed = String(Math.floor(Math.random() * 999983));
      localStorage.setItem("_zyrox_seed", seed);
    }
    return parseInt(seed, 10);
  } catch {
    return 54321;
  }
}
function lcgRandom(seed) {
  const s = seed * 1664525 + 1013904223 & 2147483647;
  return s;
}
function seededPick(ranked, count, seed) {
  const poolSize = Math.min(ranked.length, Math.max(count + 2, Math.ceil(count * 1.7)));
  const pool = ranked.slice(0, poolSize);
  const result = [];
  const buf = [...pool];
  let s = seed;
  while (result.length < count && buf.length > 0) {
    s = lcgRandom(s);
    const idx = s % buf.length;
    result.push(buf.splice(idx, 1)[0]);
  }
  return result;
}
function pickDiverseRecords(candidates, count, seed, selected) {
  const picked = [];
  const working = [...selected];
  const poolSize = Math.min(candidates.length, Math.max(count + 6, count * 4));
  const randomizedPool = seededPick(candidates.slice(0, poolSize), poolSize, seed);
  const tryPick = (relaxBucketLimit = false) => {
    for (const candidate of randomizedPool) {
      if (picked.length >= count) return;
      if (picked.some((item) => item.id === candidate.id)) continue;
      if (!canAddExerciseToSelection(working, candidate, { relaxBucketLimit })) continue;
      picked.push(candidate);
      working.push(candidate);
    }
  };
  tryPick(false);
  tryPick(true);
  for (const candidate of candidates) {
    if (picked.length >= count) break;
    if (picked.some((item) => item.id === candidate.id)) continue;
    if (working.some((item) => item.id === candidate.id)) continue;
    picked.push(candidate);
    working.push(candidate);
  }
  return picked;
}
function selectExercisesForTemplate(template, catalog, profile, environment, body, templateIndex = 0) {
  const selected = [];
  const allowedCategories = new Set(
    template.categories.flatMap(
      (rule) => rule.secondary ? [rule.primary, rule.secondary] : [rule.primary]
    )
  );
  const available = catalog.filter((record) => record.status === "active").filter((record) => supportsProfileEquipment(record, profile)).filter((record) => supportsEnvironment(record, environment)).filter((record) => supportsTrainingType(record, profile, environment));
  const rankRecords = (records) => [...records].sort(
    (left, right) => scoreExerciseQuality(right) + scoreTemplateFit(right, template, profile) + scoreEnvironmentFit(right, environment) + getBodyPriorityScore(right, body) + scoreGenderFit(right, profile) - (scoreExerciseQuality(left) + scoreTemplateFit(left, template, profile) + scoreEnvironmentFit(left, environment) + getBodyPriorityScore(left, body) + scoreGenderFit(left, profile))
  );
  const weekOfYear = Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1e3));
  const userSeed = getUserSeed(profile);
  let slotSeed = userSeed ^ weekOfYear * 2654435769 ^ templateIndex * 1367130551;
  for (const categoryRule of template.categories) {
    const candidates = rankRecords(
      available.filter(
        (record) => !selected.some((item) => item.id === record.id) && (record.category === categoryRule.primary || (categoryRule.secondary ? record.category === categoryRule.secondary : false))
      )
    );
    selected.push(...pickDiverseRecords(candidates, categoryRule.slots, slotSeed, selected));
    slotSeed = lcgRandom(slotSeed);
  }
  if (selected.length < EXERCISES_PER_WORKOUT) {
    const fallback = rankRecords(
      available.filter(
        (record) => !selected.some((item) => item.id === record.id) && allowedCategories.has(record.category)
      )
    );
    selected.push(...pickDiverseRecords(fallback, EXERCISES_PER_WORKOUT - selected.length, slotSeed, selected));
  }
  return selected.slice(0, EXERCISES_PER_WORKOUT);
}
function buildAIWorkoutCandidates(profile, environment, body, templates, catalog) {
  const available = catalog.filter((r) => r.status === "active").filter((r) => supportsProfileEquipment(r, profile)).filter((r) => supportsEnvironment(r, environment)).filter((r) => supportsTrainingType(r, profile, environment));
  return templates.map((template, index) => {
    const seen = /* @__PURE__ */ new Set();
    const candidates = [];
    for (const categoryRule of template.categories) {
      const pool = [...available].filter((r) => r.category === categoryRule.primary || r.category === categoryRule.secondary).sort(
        (a, b) => scoreExerciseQuality(b) + scoreTemplateFit(b, template, profile) + getBodyPriorityScore(b, body) + scoreGenderFit(b, profile) - (scoreExerciseQuality(a) + scoreTemplateFit(a, template, profile) + getBodyPriorityScore(a, body) + scoreGenderFit(a, profile))
      ).slice(0, (categoryRule.slots + 2) * 2);
      for (const r of pool) {
        if (!seen.has(r.id)) {
          seen.add(r.id);
          candidates.push({ id: r.id, name: r.name.pt, category: r.category, equipment: r.equipment });
        }
      }
    }
    return {
      workoutId: `${resolveTrainingSplit(profile)}-${index + 1}`,
      workoutName: template.name,
      workoutFocus: template.categories.map((c) => c.primary).join(", "),
      exercises: candidates
    };
  });
}
function buildWorkoutExercises(selected, intensity, density) {
  return selected.map((record, index) => ({
    exerciseId: record.id,
    sets: resolveSetScheme(record.category, intensity, density),
    rest: resolveRestSeconds(record.category, intensity),
    tag: index === EXERCISES_PER_WORKOUT - 1 && record.category === "abdomen_core" ? "Rest-Pause" : void 0
  }));
}
function estimateWorkoutDuration(exercises2, density, targetDuration) {
  const workMinutes = exercises2.reduce((total, exercise) => total + exercise.sets.length * 2, 0);
  const restMinutes = exercises2.reduce(
    (total, exercise) => total + exercise.rest * exercise.sets.length / 60,
    0
  );
  const rawDuration = Math.round(workMinutes + restMinutes);
  if (density === "alta") return Math.min(targetDuration, Math.max(30, rawDuration - 8));
  if (density === "controlada") return Math.min(targetDuration, Math.max(35, rawDuration));
  return Math.min(targetDuration, Math.max(35, rawDuration - 3));
}
function mapIntensityLabel(intensity) {
  if (intensity === "pesada") return "Pesado";
  if (intensity === "moderada") return "Moderado";
  return "Leve";
}
function applyMenstrualCycleIntensity(intensity, profile) {
  if (profile.sex !== "feminino" || !profile.trackCycle) return intensity;
  if (profile.menstrualCyclePhase === "menstrual") return "leve";
  if (profile.menstrualCyclePhase === "luteal") return intensity === "pesada" ? "moderada" : intensity;
  if (profile.menstrualCyclePhase === "ovulatory") return intensity === "leve" ? "moderada" : intensity;
  return intensity;
}
function applyMenstrualCycleDensity(density, profile) {
  if (profile.sex !== "feminino" || !profile.trackCycle) return density;
  if (profile.menstrualCyclePhase === "menstrual") return "controlada";
  if (profile.menstrualCyclePhase === "luteal") return density === "alta" ? "moderada" : density;
  return density;
}
function resolveWorkoutTypeLabel(profile) {
  if (profile.trainingType === "calistenia") return "Calistenia";
  if (profile.trainingType === "funcional") return "Funcional";
  return "Musculação";
}
function applyStoredCustomizations(workouts) {
  if (typeof window === "undefined") return workouts;
  return workouts.map((workout) => {
    const customization = getWorkoutCustomization(workout.id);
    return customization ? applyWorkoutCustomization(workout, customization) : workout;
  });
}
function buildGeneratedTrainingState(profile, catalog = buildExerciseCatalog(), environment, options = {}) {
  const templates = resolveWorkoutTemplates(profile);
  const body = buildBodyTrainingContext();
  const nutrition = buildNutritionTrainingContext();
  const resolvedEnvironment = environment ?? buildEnvironmentContextFromOnboarding(profile, {});
  const locale = getStoredLocale();
  const periodization = buildPeriodizationBlock(profile, body, nutrition, resolvedEnvironment, locale);
  const intensity = applyMenstrualCycleIntensity(
    resolveAdaptiveIntensity(
      resolveWorkoutIntensity(profile.level, profile.consistency, profile.goal),
      nutrition
    ),
    profile
  );
  const density = applyMenstrualCycleDensity(
    resolveAdaptiveDensity(resolveWorkoutDensity(profile), nutrition, body),
    profile
  );
  const workouts = templates.map((template, index) => {
    const selected = selectExercisesForTemplate(
      template,
      catalog,
      profile,
      resolvedEnvironment,
      body,
      index
    );
    const exercises2 = buildWorkoutExercises(selected, intensity, density);
    return {
      id: `${resolveTrainingSplit(profile)}-${index + 1}`,
      name: resolveWorkoutName(template, profile, index),
      focus: resolveFocus(template),
      duration: estimateWorkoutDuration(exercises2, density, profile.workoutDurationMin),
      type: resolveWorkoutTypeLabel(profile),
      exercises: exercises2
    };
  });
  const resolvedWorkouts = options.applyCustomizations === false ? workouts : applyStoredCustomizations(workouts);
  const trainingDays = profile.availableDays.length > 0 ? profile.availableDays : [...DEFAULT_WEEK_DAYS];
  const schedule = Array.from({ length: 7 }).map((_, dayIndex) => {
    const trainingIndex = trainingDays.indexOf(dayIndex);
    if (trainingIndex === -1) {
      return { dayIndex, workoutId: null, intensity: null, tag: null };
    }
    const workout = resolvedWorkouts[trainingIndex % resolvedWorkouts.length];
    return {
      dayIndex,
      workoutId: workout?.id ?? null,
      intensity: mapIntensityLabel(intensity),
      tag: capitalize(resolveWorkoutTag(profile))
    };
  });
  return {
    profile,
    environment: resolvedEnvironment,
    body,
    nutrition,
    periodization,
    workouts: resolvedWorkouts,
    schedule
  };
}
function getCurrentTrainingState(options = {}) {
  const onboarding = loadOnboarding();
  const profile = buildAthleteProfile(onboarding);
  const environment = buildEnvironmentContextFromOnboarding(profile, onboarding);
  return buildGeneratedTrainingState(profile, buildExerciseCatalog(), environment, options);
}
function getGeneratedWorkouts(options = {}) {
  return getCurrentTrainingState(options).workouts;
}
function getGeneratedWorkout(id2, options = {}) {
  return getGeneratedWorkouts(options).find((workout) => workout.id === id2) ?? null;
}
const $$splitComponentImporter$2 = () => import("./app.treino._id-DJtT4Pnr.js");
const Route$2 = createFileRoute("/app/treino/$id")({
  head: ({
    params
  }) => ({
    meta: [{
      title: `${getGeneratedWorkout(params.id)?.name ?? "Treino"} | 3D Body Scan`
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
const $$splitComponentImporter$1 = () => import("./app.historico._id-CgzZPEBx.js");
const Route$1 = createFileRoute("/app/historico/$id")({
  head: ({
    params
  }) => ({
    meta: [{
      title: `Histórico | 3D Body Scan`
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
const $$splitComponentImporter = () => import("./app.exercicio._id--U3C2n9B.js");
const Route2 = createFileRoute("/app/exercicio/$id")({
  head: ({
    params
  }) => ({
    meta: [{
      title: `${cleanLegacyText(getExercise(params.id)?.name ?? "Exercício")} | 3D Body Scan`
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter, "component")
});
const RecuperarSenhaRoute = Route$m.update({
  id: "/recuperar-senha",
  path: "/recuperar-senha",
  getParentRoute: () => Route$n
});
const PaywallRoute = Route$l.update({
  id: "/paywall",
  path: "/paywall",
  getParentRoute: () => Route$n
});
const OnboardingRoute = Route$k.update({
  id: "/onboarding",
  path: "/onboarding",
  getParentRoute: () => Route$n
});
const CriarContaRoute = Route$j.update({
  id: "/criar-conta",
  path: "/criar-conta",
  getParentRoute: () => Route$n
});
const AppRoute = Route$i.update({
  id: "/app",
  path: "/app",
  getParentRoute: () => Route$n
});
const IndexRoute = Route$h.update({
  id: "/",
  path: "/",
  getParentRoute: () => Route$n
});
const OnboardingIndexRoute = Route$g.update({
  id: "/",
  path: "/",
  getParentRoute: () => OnboardingRoute
});
const AppIndexRoute = Route$f.update({
  id: "/",
  path: "/",
  getParentRoute: () => AppRoute
});
const OnboardingStepRoute = Route$e.update({
  id: "/$step",
  path: "/$step",
  getParentRoute: () => OnboardingRoute
});
const AppTreinosRoute = Route$d.update({
  id: "/treinos",
  path: "/treinos",
  getParentRoute: () => AppRoute
});
const AppPerfilRoute = Route$c.update({
  id: "/perfil",
  path: "/perfil",
  getParentRoute: () => AppRoute
});
const AppNutricaoRoute = Route$b.update({
  id: "/nutricao",
  path: "/nutricao",
  getParentRoute: () => AppRoute
});
const AppExerciciosRoute = Route$a.update({
  id: "/exercicios",
  path: "/exercicios",
  getParentRoute: () => AppRoute
});
const AppCorpoRoute = Route$9.update({
  id: "/corpo",
  path: "/corpo",
  getParentRoute: () => AppRoute
});
const AppConfiguracoesRoute = Route$8.update({
  id: "/configuracoes",
  path: "/configuracoes",
  getParentRoute: () => AppRoute
});
const AppAnalyticsRoute = Route$7.update({
  id: "/analytics",
  path: "/analytics",
  getParentRoute: () => AppRoute
});
const ApiMealPlanRoute = Route$6.update({
  id: "/api/meal-plan",
  path: "/api/meal-plan",
  getParentRoute: () => Route$n
});
const ApiChatStreamRoute = Route$5.update({
  id: "/api/chat-stream",
  path: "/api/chat-stream",
  getParentRoute: () => Route$n
});
const ApiAnalyzeImageRoute = Route$4.update({
  id: "/api/analyze-image",
  path: "/api/analyze-image",
  getParentRoute: () => Route$n
});
const ApiAiWorkoutRoute = Route$3.update({
  id: "/api/ai-workout",
  path: "/api/ai-workout",
  getParentRoute: () => Route$n
});
const AppTreinoIdRoute = Route$2.update({
  id: "/treino/$id",
  path: "/treino/$id",
  getParentRoute: () => AppRoute
});
const AppHistoricoIdRoute = Route$1.update({
  id: "/historico/$id",
  path: "/historico/$id",
  getParentRoute: () => AppRoute
});
const AppExercicioIdRoute = Route2.update({
  id: "/exercicio/$id",
  path: "/exercicio/$id",
  getParentRoute: () => AppRoute
});
const AppRouteChildren = {
  AppAnalyticsRoute,
  AppConfiguracoesRoute,
  AppCorpoRoute,
  AppExerciciosRoute,
  AppNutricaoRoute,
  AppPerfilRoute,
  AppTreinosRoute,
  AppIndexRoute,
  AppExercicioIdRoute,
  AppHistoricoIdRoute,
  AppTreinoIdRoute
};
const AppRouteWithChildren = AppRoute._addFileChildren(AppRouteChildren);
const OnboardingRouteChildren = {
  OnboardingStepRoute,
  OnboardingIndexRoute
};
const OnboardingRouteWithChildren = OnboardingRoute._addFileChildren(
  OnboardingRouteChildren
);
const rootRouteChildren = {
  IndexRoute,
  AppRoute: AppRouteWithChildren,
  CriarContaRoute,
  OnboardingRoute: OnboardingRouteWithChildren,
  PaywallRoute,
  RecuperarSenhaRoute,
  ApiAiWorkoutRoute,
  ApiAnalyzeImageRoute,
  ApiChatStreamRoute,
  ApiMealPlanRoute
};
const routeTree = Route$n._addFileChildren(rootRouteChildren)._addFileTypes();
const getRouter = () => {
  const queryClient = new QueryClient();
  const router2 = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0
  });
  return router2;
};
const router = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getRouter
}, Symbol.toStringTag, { value: "Module" }));
export {
  getDefaultLocale as $,
  AnimatePresence as A,
  getWorkoutTypeLabel as B,
  bodyScans as C,
  bodyComposition as D,
  nutritionToday as E,
  formatScanDate as F,
  foodScans as G,
  bodyMeasures as H,
  exercises as I,
  reactDomExports as J,
  ReactDOM as K,
  Link as L,
  detectBrowserLocale as M,
  Navigate as N,
  buildExerciseCatalog as O,
  Plus as P,
  Route$2 as Q,
  Route$e as R,
  SUPPORTED_LOCALES as S,
  getGeneratedWorkout as T,
  getWorkoutCustomization as U,
  validateWorkoutCustomization as V,
  toast as W,
  X,
  getExercise as Y,
  clearWorkoutCustomization as Z,
  saveWorkoutCustomization as _,
  useParams as a,
  getCurrentTrainingState as a0,
  buildEnvironmentContextFromOnboarding as a1,
  buildBodyTrainingContext as a2,
  buildAIWorkoutCandidates as a3,
  buildNutritionTrainingContext as a4,
  buildPeriodizationBlock as a5,
  canAddExerciseToSelection as a6,
  Route$1 as a7,
  Route2 as a8,
  rules as a9,
  router as aa,
  saveOnboarding as b,
  createLucideIcon as c,
  clearOnboarding as d,
  getSplitLabel as e,
  getReadinessLevelLabel as f,
  getStoredLocale as g,
  getWeekDayLabels as h,
  isOnboarded as i,
  getModalityLabel as j,
  getPhaseLabel as k,
  loadOnboarding as l,
  motion as m,
  getVolumeBiasLabel as n,
  getIntensityLabel as o,
  cleanLegacyText as p,
  buildAthleteProfile as q,
  resolveTrainingSplit as r,
  setStoredLocale as s,
  translateWorkoutName as t,
  useNavigate as u,
  buildGeneratedTrainingState as v,
  isFunctionalExerciseRecord as w,
  libraryExercises as x,
  normalizeText as y,
  getCategoryLabel as z
};