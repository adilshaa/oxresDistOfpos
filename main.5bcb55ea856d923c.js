"use strict";
(self.webpackChunkpos_app = self.webpackChunkpos_app || []).push([
  [179],
  {
    403: (Gu, ag, Wu) => {
      var pi = {};
      function ne(t) {
        return "function" == typeof t;
      }
      function Ku(t) {
        const n = t((r) => {
          Error.call(r), (r.stack = new Error().stack);
        });
        return (
          (n.prototype = Object.create(Error.prototype)),
          (n.prototype.constructor = n),
          n
        );
      }
      Wu.r(pi),
        Wu.d(pi, {
          Decoder: () => cp,
          Encoder: () => NH,
          PacketType: () => V,
          protocol: () => PH,
        });
      const Qu = Ku(
        (t) =>
          function (n) {
            t(this),
              (this.message = n
                ? `${n.length} errors occurred during unsubscription:\n${n
                    .map((r, o) => `${o + 1}) ${r.toString()}`)
                    .join("\n  ")}`
                : ""),
              (this.name = "UnsubscriptionError"),
              (this.errors = n);
          }
      );
      function Zu(t, e) {
        if (t) {
          const n = t.indexOf(e);
          0 <= n && t.splice(n, 1);
        }
      }
      class Vt {
        constructor(e) {
          (this.initialTeardown = e),
            (this.closed = !1),
            (this._parentage = null),
            (this._finalizers = null);
        }
        unsubscribe() {
          let e;
          if (!this.closed) {
            this.closed = !0;
            const { _parentage: n } = this;
            if (n)
              if (((this._parentage = null), Array.isArray(n)))
                for (const i of n) i.remove(this);
              else n.remove(this);
            const { initialTeardown: r } = this;
            if (ne(r))
              try {
                r();
              } catch (i) {
                e = i instanceof Qu ? i.errors : [i];
              }
            const { _finalizers: o } = this;
            if (o) {
              this._finalizers = null;
              for (const i of o)
                try {
                  cg(i);
                } catch (s) {
                  (e = e ?? []),
                    s instanceof Qu ? (e = [...e, ...s.errors]) : e.push(s);
                }
            }
            if (e) throw new Qu(e);
          }
        }
        add(e) {
          var n;
          if (e && e !== this)
            if (this.closed) cg(e);
            else {
              if (e instanceof Vt) {
                if (e.closed || e._hasParent(this)) return;
                e._addParent(this);
              }
              (this._finalizers =
                null !== (n = this._finalizers) && void 0 !== n ? n : []).push(
                e
              );
            }
        }
        _hasParent(e) {
          const { _parentage: n } = this;
          return n === e || (Array.isArray(n) && n.includes(e));
        }
        _addParent(e) {
          const { _parentage: n } = this;
          this._parentage = Array.isArray(n) ? (n.push(e), n) : n ? [n, e] : e;
        }
        _removeParent(e) {
          const { _parentage: n } = this;
          n === e ? (this._parentage = null) : Array.isArray(n) && Zu(n, e);
        }
        remove(e) {
          const { _finalizers: n } = this;
          n && Zu(n, e), e instanceof Vt && e._removeParent(this);
        }
      }
      Vt.EMPTY = (() => {
        const t = new Vt();
        return (t.closed = !0), t;
      })();
      const lg = Vt.EMPTY;
      function ug(t) {
        return (
          t instanceof Vt ||
          (t && "closed" in t && ne(t.remove) && ne(t.add) && ne(t.unsubscribe))
        );
      }
      function cg(t) {
        ne(t) ? t() : t.unsubscribe();
      }
      const Mr = {
          onUnhandledError: null,
          onStoppedNotification: null,
          Promise: void 0,
          useDeprecatedSynchronousErrorHandling: !1,
          useDeprecatedNextContext: !1,
        },
        Ys = {
          setTimeout(t, e, ...n) {
            const { delegate: r } = Ys;
            return r?.setTimeout
              ? r.setTimeout(t, e, ...n)
              : setTimeout(t, e, ...n);
          },
          clearTimeout(t) {
            const { delegate: e } = Ys;
            return (e?.clearTimeout || clearTimeout)(t);
          },
          delegate: void 0,
        };
      function dg(t) {
        Ys.setTimeout(() => {
          const { onUnhandledError: e } = Mr;
          if (!e) throw t;
          e(t);
        });
      }
      function fg() {}
      const JS = Yu("C", void 0, void 0);
      function Yu(t, e, n) {
        return { kind: t, value: e, error: n };
      }
      let Tr = null;
      function Xs(t) {
        if (Mr.useDeprecatedSynchronousErrorHandling) {
          const e = !Tr;
          if ((e && (Tr = { errorThrown: !1, error: null }), t(), e)) {
            const { errorThrown: n, error: r } = Tr;
            if (((Tr = null), n)) throw r;
          }
        } else t();
      }
      class Xu extends Vt {
        constructor(e) {
          super(),
            (this.isStopped = !1),
            e
              ? ((this.destination = e), ug(e) && e.add(this))
              : (this.destination = sM);
        }
        static create(e, n, r) {
          return new gi(e, n, r);
        }
        next(e) {
          this.isStopped
            ? ec(
                (function tM(t) {
                  return Yu("N", t, void 0);
                })(e),
                this
              )
            : this._next(e);
        }
        error(e) {
          this.isStopped
            ? ec(
                (function eM(t) {
                  return Yu("E", void 0, t);
                })(e),
                this
              )
            : ((this.isStopped = !0), this._error(e));
        }
        complete() {
          this.isStopped
            ? ec(JS, this)
            : ((this.isStopped = !0), this._complete());
        }
        unsubscribe() {
          this.closed ||
            ((this.isStopped = !0),
            super.unsubscribe(),
            (this.destination = null));
        }
        _next(e) {
          this.destination.next(e);
        }
        _error(e) {
          try {
            this.destination.error(e);
          } finally {
            this.unsubscribe();
          }
        }
        _complete() {
          try {
            this.destination.complete();
          } finally {
            this.unsubscribe();
          }
        }
      }
      const rM = Function.prototype.bind;
      function Ju(t, e) {
        return rM.call(t, e);
      }
      class oM {
        constructor(e) {
          this.partialObserver = e;
        }
        next(e) {
          const { partialObserver: n } = this;
          if (n.next)
            try {
              n.next(e);
            } catch (r) {
              Js(r);
            }
        }
        error(e) {
          const { partialObserver: n } = this;
          if (n.error)
            try {
              n.error(e);
            } catch (r) {
              Js(r);
            }
          else Js(e);
        }
        complete() {
          const { partialObserver: e } = this;
          if (e.complete)
            try {
              e.complete();
            } catch (n) {
              Js(n);
            }
        }
      }
      class gi extends Xu {
        constructor(e, n, r) {
          let o;
          if ((super(), ne(e) || !e))
            o = {
              next: e ?? void 0,
              error: n ?? void 0,
              complete: r ?? void 0,
            };
          else {
            let i;
            this && Mr.useDeprecatedNextContext
              ? ((i = Object.create(e)),
                (i.unsubscribe = () => this.unsubscribe()),
                (o = {
                  next: e.next && Ju(e.next, i),
                  error: e.error && Ju(e.error, i),
                  complete: e.complete && Ju(e.complete, i),
                }))
              : (o = e);
          }
          this.destination = new oM(o);
        }
      }
      function Js(t) {
        Mr.useDeprecatedSynchronousErrorHandling
          ? (function nM(t) {
              Mr.useDeprecatedSynchronousErrorHandling &&
                Tr &&
                ((Tr.errorThrown = !0), (Tr.error = t));
            })(t)
          : dg(t);
      }
      function ec(t, e) {
        const { onStoppedNotification: n } = Mr;
        n && Ys.setTimeout(() => n(t, e));
      }
      const sM = {
          closed: !0,
          next: fg,
          error: function iM(t) {
            throw t;
          },
          complete: fg,
        },
        tc =
          ("function" == typeof Symbol && Symbol.observable) || "@@observable";
      function ir(t) {
        return t;
      }
      function hg(t) {
        return 0 === t.length
          ? ir
          : 1 === t.length
          ? t[0]
          : function (n) {
              return t.reduce((r, o) => o(r), n);
            };
      }
      let Ce = (() => {
        class t {
          constructor(n) {
            n && (this._subscribe = n);
          }
          lift(n) {
            const r = new t();
            return (r.source = this), (r.operator = n), r;
          }
          subscribe(n, r, o) {
            const i = (function uM(t) {
              return (
                (t && t instanceof Xu) ||
                ((function lM(t) {
                  return t && ne(t.next) && ne(t.error) && ne(t.complete);
                })(t) &&
                  ug(t))
              );
            })(n)
              ? n
              : new gi(n, r, o);
            return (
              Xs(() => {
                const { operator: s, source: a } = this;
                i.add(
                  s
                    ? s.call(i, a)
                    : a
                    ? this._subscribe(i)
                    : this._trySubscribe(i)
                );
              }),
              i
            );
          }
          _trySubscribe(n) {
            try {
              return this._subscribe(n);
            } catch (r) {
              n.error(r);
            }
          }
          forEach(n, r) {
            return new (r = pg(r))((o, i) => {
              const s = new gi({
                next: (a) => {
                  try {
                    n(a);
                  } catch (l) {
                    i(l), s.unsubscribe();
                  }
                },
                error: i,
                complete: o,
              });
              this.subscribe(s);
            });
          }
          _subscribe(n) {
            var r;
            return null === (r = this.source) || void 0 === r
              ? void 0
              : r.subscribe(n);
          }
          [tc]() {
            return this;
          }
          pipe(...n) {
            return hg(n)(this);
          }
          toPromise(n) {
            return new (n = pg(n))((r, o) => {
              let i;
              this.subscribe(
                (s) => (i = s),
                (s) => o(s),
                () => r(i)
              );
            });
          }
        }
        return (t.create = (e) => new t(e)), t;
      })();
      function pg(t) {
        var e;
        return null !== (e = t ?? Mr.Promise) && void 0 !== e ? e : Promise;
      }
      const cM = Ku(
        (t) =>
          function () {
            t(this),
              (this.name = "ObjectUnsubscribedError"),
              (this.message = "object unsubscribed");
          }
      );
      let Ln = (() => {
        class t extends Ce {
          constructor() {
            super(),
              (this.closed = !1),
              (this.currentObservers = null),
              (this.observers = []),
              (this.isStopped = !1),
              (this.hasError = !1),
              (this.thrownError = null);
          }
          lift(n) {
            const r = new gg(this, this);
            return (r.operator = n), r;
          }
          _throwIfClosed() {
            if (this.closed) throw new cM();
          }
          next(n) {
            Xs(() => {
              if ((this._throwIfClosed(), !this.isStopped)) {
                this.currentObservers ||
                  (this.currentObservers = Array.from(this.observers));
                for (const r of this.currentObservers) r.next(n);
              }
            });
          }
          error(n) {
            Xs(() => {
              if ((this._throwIfClosed(), !this.isStopped)) {
                (this.hasError = this.isStopped = !0), (this.thrownError = n);
                const { observers: r } = this;
                for (; r.length; ) r.shift().error(n);
              }
            });
          }
          complete() {
            Xs(() => {
              if ((this._throwIfClosed(), !this.isStopped)) {
                this.isStopped = !0;
                const { observers: n } = this;
                for (; n.length; ) n.shift().complete();
              }
            });
          }
          unsubscribe() {
            (this.isStopped = this.closed = !0),
              (this.observers = this.currentObservers = null);
          }
          get observed() {
            var n;
            return (
              (null === (n = this.observers) || void 0 === n
                ? void 0
                : n.length) > 0
            );
          }
          _trySubscribe(n) {
            return this._throwIfClosed(), super._trySubscribe(n);
          }
          _subscribe(n) {
            return (
              this._throwIfClosed(),
              this._checkFinalizedStatuses(n),
              this._innerSubscribe(n)
            );
          }
          _innerSubscribe(n) {
            const { hasError: r, isStopped: o, observers: i } = this;
            return r || o
              ? lg
              : ((this.currentObservers = null),
                i.push(n),
                new Vt(() => {
                  (this.currentObservers = null), Zu(i, n);
                }));
          }
          _checkFinalizedStatuses(n) {
            const { hasError: r, thrownError: o, isStopped: i } = this;
            r ? n.error(o) : i && n.complete();
          }
          asObservable() {
            const n = new Ce();
            return (n.source = this), n;
          }
        }
        return (t.create = (e, n) => new gg(e, n)), t;
      })();
      class gg extends Ln {
        constructor(e, n) {
          super(), (this.destination = e), (this.source = n);
        }
        next(e) {
          var n, r;
          null ===
            (r =
              null === (n = this.destination) || void 0 === n
                ? void 0
                : n.next) ||
            void 0 === r ||
            r.call(n, e);
        }
        error(e) {
          var n, r;
          null ===
            (r =
              null === (n = this.destination) || void 0 === n
                ? void 0
                : n.error) ||
            void 0 === r ||
            r.call(n, e);
        }
        complete() {
          var e, n;
          null ===
            (n =
              null === (e = this.destination) || void 0 === e
                ? void 0
                : e.complete) ||
            void 0 === n ||
            n.call(e);
        }
        _subscribe(e) {
          var n, r;
          return null !==
            (r =
              null === (n = this.source) || void 0 === n
                ? void 0
                : n.subscribe(e)) && void 0 !== r
            ? r
            : lg;
        }
      }
      class Bt extends Ln {
        constructor(e) {
          super(), (this._value = e);
        }
        get value() {
          return this.getValue();
        }
        _subscribe(e) {
          const n = super._subscribe(e);
          return !n.closed && e.next(this._value), n;
        }
        getValue() {
          const { hasError: e, thrownError: n, _value: r } = this;
          if (e) throw n;
          return this._throwIfClosed(), r;
        }
        next(e) {
          super.next((this._value = e));
        }
      }
      function mg(t) {
        return ne(t?.lift);
      }
      function We(t) {
        return (e) => {
          if (mg(e))
            return e.lift(function (n) {
              try {
                return t(n, this);
              } catch (r) {
                this.error(r);
              }
            });
          throw new TypeError("Unable to lift unknown Observable type");
        };
      }
      function He(t, e, n, r, o) {
        return new dM(t, e, n, r, o);
      }
      class dM extends Xu {
        constructor(e, n, r, o, i, s) {
          super(e),
            (this.onFinalize = i),
            (this.shouldUnsubscribe = s),
            (this._next = n
              ? function (a) {
                  try {
                    n(a);
                  } catch (l) {
                    e.error(l);
                  }
                }
              : super._next),
            (this._error = o
              ? function (a) {
                  try {
                    o(a);
                  } catch (l) {
                    e.error(l);
                  } finally {
                    this.unsubscribe();
                  }
                }
              : super._error),
            (this._complete = r
              ? function () {
                  try {
                    r();
                  } catch (a) {
                    e.error(a);
                  } finally {
                    this.unsubscribe();
                  }
                }
              : super._complete);
        }
        unsubscribe() {
          var e;
          if (!this.shouldUnsubscribe || this.shouldUnsubscribe()) {
            const { closed: n } = this;
            super.unsubscribe(),
              !n &&
                (null === (e = this.onFinalize) ||
                  void 0 === e ||
                  e.call(this));
          }
        }
      }
      function oe(t, e) {
        return We((n, r) => {
          let o = 0;
          n.subscribe(
            He(r, (i) => {
              r.next(t.call(e, i, o++));
            })
          );
        });
      }
      function sr(t) {
        return this instanceof sr ? ((this.v = t), this) : new sr(t);
      }
      function Cg(t) {
        if (!Symbol.asyncIterator)
          throw new TypeError("Symbol.asyncIterator is not defined.");
        var n,
          e = t[Symbol.asyncIterator];
        return e
          ? e.call(t)
          : ((t = (function ic(t) {
              var e = "function" == typeof Symbol && Symbol.iterator,
                n = e && t[e],
                r = 0;
              if (n) return n.call(t);
              if (t && "number" == typeof t.length)
                return {
                  next: function () {
                    return (
                      t && r >= t.length && (t = void 0),
                      { value: t && t[r++], done: !t }
                    );
                  },
                };
              throw new TypeError(
                e
                  ? "Object is not iterable."
                  : "Symbol.iterator is not defined."
              );
            })(t)),
            (n = {}),
            r("next"),
            r("throw"),
            r("return"),
            (n[Symbol.asyncIterator] = function () {
              return this;
            }),
            n);
        function r(i) {
          n[i] =
            t[i] &&
            function (s) {
              return new Promise(function (a, l) {
                !(function o(i, s, a, l) {
                  Promise.resolve(l).then(function (u) {
                    i({ value: u, done: a });
                  }, s);
                })(a, l, (s = t[i](s)).done, s.value);
              });
            };
        }
      }
      const sc = (t) =>
        t && "number" == typeof t.length && "function" != typeof t;
      function Dg(t) {
        return ne(t?.then);
      }
      function wg(t) {
        return ne(t[tc]);
      }
      function bg(t) {
        return Symbol.asyncIterator && ne(t?.[Symbol.asyncIterator]);
      }
      function Eg(t) {
        return new TypeError(
          `You provided ${
            null !== t && "object" == typeof t ? "an invalid object" : `'${t}'`
          } where a stream was expected. You can provide an Observable, Promise, ReadableStream, Array, AsyncIterable, or Iterable.`
        );
      }
      const Sg = (function OM() {
        return "function" == typeof Symbol && Symbol.iterator
          ? Symbol.iterator
          : "@@iterator";
      })();
      function Mg(t) {
        return ne(t?.[Sg]);
      }
      function Tg(t) {
        return (function _g(t, e, n) {
          if (!Symbol.asyncIterator)
            throw new TypeError("Symbol.asyncIterator is not defined.");
          var o,
            r = n.apply(t, e || []),
            i = [];
          return (
            (o = {}),
            s("next"),
            s("throw"),
            s("return"),
            (o[Symbol.asyncIterator] = function () {
              return this;
            }),
            o
          );
          function s(f) {
            r[f] &&
              (o[f] = function (h) {
                return new Promise(function (p, g) {
                  i.push([f, h, p, g]) > 1 || a(f, h);
                });
              });
          }
          function a(f, h) {
            try {
              !(function l(f) {
                f.value instanceof sr
                  ? Promise.resolve(f.value.v).then(u, c)
                  : d(i[0][2], f);
              })(r[f](h));
            } catch (p) {
              d(i[0][3], p);
            }
          }
          function u(f) {
            a("next", f);
          }
          function c(f) {
            a("throw", f);
          }
          function d(f, h) {
            f(h), i.shift(), i.length && a(i[0][0], i[0][1]);
          }
        })(this, arguments, function* () {
          const n = t.getReader();
          try {
            for (;;) {
              const { value: r, done: o } = yield sr(n.read());
              if (o) return yield sr(void 0);
              yield yield sr(r);
            }
          } finally {
            n.releaseLock();
          }
        });
      }
      function Ag(t) {
        return ne(t?.getReader);
      }
      function Et(t) {
        if (t instanceof Ce) return t;
        if (null != t) {
          if (wg(t))
            return (function PM(t) {
              return new Ce((e) => {
                const n = t[tc]();
                if (ne(n.subscribe)) return n.subscribe(e);
                throw new TypeError(
                  "Provided object does not correctly implement Symbol.observable"
                );
              });
            })(t);
          if (sc(t))
            return (function NM(t) {
              return new Ce((e) => {
                for (let n = 0; n < t.length && !e.closed; n++) e.next(t[n]);
                e.complete();
              });
            })(t);
          if (Dg(t))
            return (function xM(t) {
              return new Ce((e) => {
                t.then(
                  (n) => {
                    e.closed || (e.next(n), e.complete());
                  },
                  (n) => e.error(n)
                ).then(null, dg);
              });
            })(t);
          if (bg(t)) return Ig(t);
          if (Mg(t))
            return (function RM(t) {
              return new Ce((e) => {
                for (const n of t) if ((e.next(n), e.closed)) return;
                e.complete();
              });
            })(t);
          if (Ag(t))
            return (function FM(t) {
              return Ig(Tg(t));
            })(t);
        }
        throw Eg(t);
      }
      function Ig(t) {
        return new Ce((e) => {
          (function kM(t, e) {
            var n, r, o, i;
            return (function yg(t, e, n, r) {
              return new (n || (n = Promise))(function (i, s) {
                function a(c) {
                  try {
                    u(r.next(c));
                  } catch (d) {
                    s(d);
                  }
                }
                function l(c) {
                  try {
                    u(r.throw(c));
                  } catch (d) {
                    s(d);
                  }
                }
                function u(c) {
                  c.done
                    ? i(c.value)
                    : (function o(i) {
                        return i instanceof n
                          ? i
                          : new n(function (s) {
                              s(i);
                            });
                      })(c.value).then(a, l);
                }
                u((r = r.apply(t, e || [])).next());
              });
            })(this, void 0, void 0, function* () {
              try {
                for (n = Cg(t); !(r = yield n.next()).done; )
                  if ((e.next(r.value), e.closed)) return;
              } catch (s) {
                o = { error: s };
              } finally {
                try {
                  r && !r.done && (i = n.return) && (yield i.call(n));
                } finally {
                  if (o) throw o.error;
                }
              }
              e.complete();
            });
          })(t, e).catch((n) => e.error(n));
        });
      }
      function Vn(t, e, n, r = 0, o = !1) {
        const i = e.schedule(function () {
          n(), o ? t.add(this.schedule(null, r)) : this.unsubscribe();
        }, r);
        if ((t.add(i), !o)) return i;
      }
      function Ke(t, e, n = 1 / 0) {
        return ne(e)
          ? Ke((r, o) => oe((i, s) => e(r, i, o, s))(Et(t(r, o))), n)
          : ("number" == typeof e && (n = e),
            We((r, o) =>
              (function LM(t, e, n, r, o, i, s, a) {
                const l = [];
                let u = 0,
                  c = 0,
                  d = !1;
                const f = () => {
                    d && !l.length && !u && e.complete();
                  },
                  h = (g) => (u < r ? p(g) : l.push(g)),
                  p = (g) => {
                    i && e.next(g), u++;
                    let y = !1;
                    Et(n(g, c++)).subscribe(
                      He(
                        e,
                        (_) => {
                          o?.(_), i ? h(_) : e.next(_);
                        },
                        () => {
                          y = !0;
                        },
                        void 0,
                        () => {
                          if (y)
                            try {
                              for (u--; l.length && u < r; ) {
                                const _ = l.shift();
                                s ? Vn(e, s, () => p(_)) : p(_);
                              }
                              f();
                            } catch (_) {
                              e.error(_);
                            }
                        }
                      )
                    );
                  };
                return (
                  t.subscribe(
                    He(e, h, () => {
                      (d = !0), f();
                    })
                  ),
                  () => {
                    a?.();
                  }
                );
              })(r, o, t, n)
            ));
      }
      function lo(t = 1 / 0) {
        return Ke(ir, t);
      }
      const hn = new Ce((t) => t.complete());
      function ac(t) {
        return t[t.length - 1];
      }
      function Og(t) {
        return ne(ac(t)) ? t.pop() : void 0;
      }
      function mi(t) {
        return (function BM(t) {
          return t && ne(t.schedule);
        })(ac(t))
          ? t.pop()
          : void 0;
      }
      function Pg(t, e = 0) {
        return We((n, r) => {
          n.subscribe(
            He(
              r,
              (o) => Vn(r, t, () => r.next(o), e),
              () => Vn(r, t, () => r.complete(), e),
              (o) => Vn(r, t, () => r.error(o), e)
            )
          );
        });
      }
      function Ng(t, e = 0) {
        return We((n, r) => {
          r.add(t.schedule(() => n.subscribe(r), e));
        });
      }
      function xg(t, e) {
        if (!t) throw new Error("Iterable cannot be null");
        return new Ce((n) => {
          Vn(n, e, () => {
            const r = t[Symbol.asyncIterator]();
            Vn(
              n,
              e,
              () => {
                r.next().then((o) => {
                  o.done ? n.complete() : n.next(o.value);
                });
              },
              0,
              !0
            );
          });
        });
      }
      function je(t, e) {
        return e
          ? (function GM(t, e) {
              if (null != t) {
                if (wg(t))
                  return (function jM(t, e) {
                    return Et(t).pipe(Ng(e), Pg(e));
                  })(t, e);
                if (sc(t))
                  return (function UM(t, e) {
                    return new Ce((n) => {
                      let r = 0;
                      return e.schedule(function () {
                        r === t.length
                          ? n.complete()
                          : (n.next(t[r++]), n.closed || this.schedule());
                      });
                    });
                  })(t, e);
                if (Dg(t))
                  return (function $M(t, e) {
                    return Et(t).pipe(Ng(e), Pg(e));
                  })(t, e);
                if (bg(t)) return xg(t, e);
                if (Mg(t))
                  return (function zM(t, e) {
                    return new Ce((n) => {
                      let r;
                      return (
                        Vn(n, e, () => {
                          (r = t[Sg]()),
                            Vn(
                              n,
                              e,
                              () => {
                                let o, i;
                                try {
                                  ({ value: o, done: i } = r.next());
                                } catch (s) {
                                  return void n.error(s);
                                }
                                i ? n.complete() : n.next(o);
                              },
                              0,
                              !0
                            );
                        }),
                        () => ne(r?.return) && r.return()
                      );
                    });
                  })(t, e);
                if (Ag(t))
                  return (function qM(t, e) {
                    return xg(Tg(t), e);
                  })(t, e);
              }
              throw Eg(t);
            })(t, e)
          : Et(t);
      }
      function j(...t) {
        return je(t, mi(t));
      }
      function Rg(t = {}) {
        const {
          connector: e = () => new Ln(),
          resetOnError: n = !0,
          resetOnComplete: r = !0,
          resetOnRefCountZero: o = !0,
        } = t;
        return (i) => {
          let s,
            a,
            l,
            u = 0,
            c = !1,
            d = !1;
          const f = () => {
              a?.unsubscribe(), (a = void 0);
            },
            h = () => {
              f(), (s = l = void 0), (c = d = !1);
            },
            p = () => {
              const g = s;
              h(), g?.unsubscribe();
            };
          return We((g, y) => {
            u++, !d && !c && f();
            const _ = (l = l ?? e());
            y.add(() => {
              u--, 0 === u && !d && !c && (a = lc(p, o));
            }),
              _.subscribe(y),
              !s &&
                u > 0 &&
                ((s = new gi({
                  next: (m) => _.next(m),
                  error: (m) => {
                    (d = !0), f(), (a = lc(h, n, m)), _.error(m);
                  },
                  complete: () => {
                    (c = !0), f(), (a = lc(h, r)), _.complete();
                  },
                })),
                Et(g).subscribe(s));
          })(i);
        };
      }
      function lc(t, e, ...n) {
        if (!0 === e) return void t();
        if (!1 === e) return;
        const r = new gi({
          next: () => {
            r.unsubscribe(), t();
          },
        });
        return Et(e(...n)).subscribe(r);
      }
      function Zt(t, e) {
        return We((n, r) => {
          let o = null,
            i = 0,
            s = !1;
          const a = () => s && !o && r.complete();
          n.subscribe(
            He(
              r,
              (l) => {
                o?.unsubscribe();
                let u = 0;
                const c = i++;
                Et(t(l, c)).subscribe(
                  (o = He(
                    r,
                    (d) => r.next(e ? e(l, d, c, u++) : d),
                    () => {
                      (o = null), a();
                    }
                  ))
                );
              },
              () => {
                (s = !0), a();
              }
            )
          );
        });
      }
      function QM(t, e) {
        return t === e;
      }
      function ue(t) {
        for (let e in t) if (t[e] === ue) return e;
        throw Error("Could not find renamed property on target object.");
      }
      function ea(t, e) {
        for (const n in e)
          e.hasOwnProperty(n) && !t.hasOwnProperty(n) && (t[n] = e[n]);
      }
      function $e(t) {
        if ("string" == typeof t) return t;
        if (Array.isArray(t)) return "[" + t.map($e).join(", ") + "]";
        if (null == t) return "" + t;
        if (t.overriddenName) return `${t.overriddenName}`;
        if (t.name) return `${t.name}`;
        const e = t.toString();
        if (null == e) return "" + e;
        const n = e.indexOf("\n");
        return -1 === n ? e : e.substring(0, n);
      }
      function uc(t, e) {
        return null == t || "" === t
          ? null === e
            ? ""
            : e
          : null == e || "" === e
          ? t
          : t + " " + e;
      }
      const ZM = ue({ __forward_ref__: ue });
      function he(t) {
        return (
          (t.__forward_ref__ = he),
          (t.toString = function () {
            return $e(this());
          }),
          t
        );
      }
      function z(t) {
        return cc(t) ? t() : t;
      }
      function cc(t) {
        return (
          "function" == typeof t &&
          t.hasOwnProperty(ZM) &&
          t.__forward_ref__ === he
        );
      }
      function dc(t) {
        return t && !!t.ɵproviders;
      }
      const Fg = "https://g.co/ng/security#xss";
      class v extends Error {
        constructor(e, n) {
          super(
            (function ta(t, e) {
              return `NG0${Math.abs(t)}${e ? ": " + e : ""}`;
            })(e, n)
          ),
            (this.code = e);
        }
      }
      function q(t) {
        return "string" == typeof t ? t : null == t ? "" : String(t);
      }
      function na(t, e) {
        throw new v(-201, !1);
      }
      function Ht(t, e) {
        null == t &&
          (function ae(t, e, n, r) {
            throw new Error(
              `ASSERTION ERROR: ${t}` +
                (null == r ? "" : ` [Expected=> ${n} ${r} ${e} <=Actual]`)
            );
          })(e, t, null, "!=");
      }
      function N(t) {
        return {
          token: t.token,
          providedIn: t.providedIn || null,
          factory: t.factory,
          value: void 0,
        };
      }
      function pt(t) {
        return { providers: t.providers || [], imports: t.imports || [] };
      }
      function ra(t) {
        return kg(t, oa) || kg(t, Vg);
      }
      function kg(t, e) {
        return t.hasOwnProperty(e) ? t[e] : null;
      }
      function Lg(t) {
        return t && (t.hasOwnProperty(fc) || t.hasOwnProperty(oT))
          ? t[fc]
          : null;
      }
      const oa = ue({ ɵprov: ue }),
        fc = ue({ ɵinj: ue }),
        Vg = ue({ ngInjectableDef: ue }),
        oT = ue({ ngInjectorDef: ue });
      var k = (() => (
        ((k = k || {})[(k.Default = 0)] = "Default"),
        (k[(k.Host = 1)] = "Host"),
        (k[(k.Self = 2)] = "Self"),
        (k[(k.SkipSelf = 4)] = "SkipSelf"),
        (k[(k.Optional = 8)] = "Optional"),
        k
      ))();
      let hc;
      function gt(t) {
        const e = hc;
        return (hc = t), e;
      }
      function Hg(t, e, n) {
        const r = ra(t);
        return r && "root" == r.providedIn
          ? void 0 === r.value
            ? (r.value = r.factory())
            : r.value
          : n & k.Optional
          ? null
          : void 0 !== e
          ? e
          : void na($e(t));
      }
      const pe = (() =>
          (typeof globalThis < "u" && globalThis) ||
          (typeof global < "u" && global) ||
          (typeof window < "u" && window) ||
          (typeof self < "u" &&
            typeof WorkerGlobalScope < "u" &&
            self instanceof WorkerGlobalScope &&
            self))(),
        yi = {},
        pc = "__NG_DI_FLAG__",
        ia = "ngTempTokenPath",
        sT = /\n/gm,
        jg = "__source";
      let uo;
      function lr(t) {
        const e = uo;
        return (uo = t), e;
      }
      function uT(t, e = k.Default) {
        if (void 0 === uo) throw new v(-203, !1);
        return null === uo
          ? Hg(t, void 0, e)
          : uo.get(t, e & k.Optional ? null : void 0, e);
      }
      function I(t, e = k.Default) {
        return (
          (function Bg() {
            return hc;
          })() || uT
        )(z(t), e);
      }
      function A(t, e = k.Default) {
        return I(t, sa(e));
      }
      function sa(t) {
        return typeof t > "u" || "number" == typeof t
          ? t
          : 0 |
              (t.optional && 8) |
              (t.host && 1) |
              (t.self && 2) |
              (t.skipSelf && 4);
      }
      function gc(t) {
        const e = [];
        for (let n = 0; n < t.length; n++) {
          const r = z(t[n]);
          if (Array.isArray(r)) {
            if (0 === r.length) throw new v(900, !1);
            let o,
              i = k.Default;
            for (let s = 0; s < r.length; s++) {
              const a = r[s],
                l = cT(a);
              "number" == typeof l
                ? -1 === l
                  ? (o = a.token)
                  : (i |= l)
                : (o = a);
            }
            e.push(I(o, i));
          } else e.push(I(r));
        }
        return e;
      }
      function vi(t, e) {
        return (t[pc] = e), (t.prototype[pc] = e), t;
      }
      function cT(t) {
        return t[pc];
      }
      function Bn(t) {
        return { toString: t }.toString();
      }
      var pn = (() => (
          ((pn = pn || {})[(pn.OnPush = 0)] = "OnPush"),
          (pn[(pn.Default = 1)] = "Default"),
          pn
        ))(),
        mt = (() => {
          return (
            ((t = mt || (mt = {}))[(t.Emulated = 0)] = "Emulated"),
            (t[(t.None = 2)] = "None"),
            (t[(t.ShadowDom = 3)] = "ShadowDom"),
            mt
          );
          var t;
        })();
      const gn = {},
        re = [],
        aa = ue({ ɵcmp: ue }),
        mc = ue({ ɵdir: ue }),
        yc = ue({ ɵpipe: ue }),
        Ug = ue({ ɵmod: ue }),
        Hn = ue({ ɵfac: ue }),
        _i = ue({ __NG_ELEMENT_ID__: ue }),
        zg = ue({ __NG_ENV_ID__: ue });
      function qg(t, e, n) {
        let r = t.length;
        for (;;) {
          const o = t.indexOf(e, n);
          if (-1 === o) return o;
          if (0 === o || t.charCodeAt(o - 1) <= 32) {
            const i = e.length;
            if (o + i === r || t.charCodeAt(o + i) <= 32) return o;
          }
          n = o + 1;
        }
      }
      function vc(t, e, n) {
        let r = 0;
        for (; r < n.length; ) {
          const o = n[r];
          if ("number" == typeof o) {
            if (0 !== o) break;
            r++;
            const i = n[r++],
              s = n[r++],
              a = n[r++];
            t.setAttribute(e, s, a, i);
          } else {
            const i = o,
              s = n[++r];
            Wg(i) ? t.setProperty(e, i, s) : t.setAttribute(e, i, s), r++;
          }
        }
        return r;
      }
      function Gg(t) {
        return 3 === t || 4 === t || 6 === t;
      }
      function Wg(t) {
        return 64 === t.charCodeAt(0);
      }
      function Ci(t, e) {
        if (null !== e && 0 !== e.length)
          if (null === t || 0 === t.length) t = e.slice();
          else {
            let n = -1;
            for (let r = 0; r < e.length; r++) {
              const o = e[r];
              "number" == typeof o
                ? (n = o)
                : 0 === n ||
                  Kg(t, n, o, null, -1 === n || 2 === n ? e[++r] : null);
            }
          }
        return t;
      }
      function Kg(t, e, n, r, o) {
        let i = 0,
          s = t.length;
        if (-1 === e) s = -1;
        else
          for (; i < t.length; ) {
            const a = t[i++];
            if ("number" == typeof a) {
              if (a === e) {
                s = -1;
                break;
              }
              if (a > e) {
                s = i - 1;
                break;
              }
            }
          }
        for (; i < t.length; ) {
          const a = t[i];
          if ("number" == typeof a) break;
          if (a === n) {
            if (null === r) return void (null !== o && (t[i + 1] = o));
            if (r === t[i + 1]) return void (t[i + 2] = o);
          }
          i++, null !== r && i++, null !== o && i++;
        }
        -1 !== s && (t.splice(s, 0, e), (i = s + 1)),
          t.splice(i++, 0, n),
          null !== r && t.splice(i++, 0, r),
          null !== o && t.splice(i++, 0, o);
      }
      const Qg = "ng-template";
      function hT(t, e, n) {
        let r = 0,
          o = !0;
        for (; r < t.length; ) {
          let i = t[r++];
          if ("string" == typeof i && o) {
            const s = t[r++];
            if (n && "class" === i && -1 !== qg(s.toLowerCase(), e, 0))
              return !0;
          } else {
            if (1 === i) {
              for (; r < t.length && "string" == typeof (i = t[r++]); )
                if (i.toLowerCase() === e) return !0;
              return !1;
            }
            "number" == typeof i && (o = !1);
          }
        }
        return !1;
      }
      function Zg(t) {
        return 4 === t.type && t.value !== Qg;
      }
      function pT(t, e, n) {
        return e === (4 !== t.type || n ? t.value : Qg);
      }
      function gT(t, e, n) {
        let r = 4;
        const o = t.attrs || [],
          i = (function vT(t) {
            for (let e = 0; e < t.length; e++) if (Gg(t[e])) return e;
            return t.length;
          })(o);
        let s = !1;
        for (let a = 0; a < e.length; a++) {
          const l = e[a];
          if ("number" != typeof l) {
            if (!s)
              if (4 & r) {
                if (
                  ((r = 2 | (1 & r)),
                  ("" !== l && !pT(t, l, n)) || ("" === l && 1 === e.length))
                ) {
                  if (Yt(r)) return !1;
                  s = !0;
                }
              } else {
                const u = 8 & r ? l : e[++a];
                if (8 & r && null !== t.attrs) {
                  if (!hT(t.attrs, u, n)) {
                    if (Yt(r)) return !1;
                    s = !0;
                  }
                  continue;
                }
                const d = mT(8 & r ? "class" : l, o, Zg(t), n);
                if (-1 === d) {
                  if (Yt(r)) return !1;
                  s = !0;
                  continue;
                }
                if ("" !== u) {
                  let f;
                  f = d > i ? "" : o[d + 1].toLowerCase();
                  const h = 8 & r ? f : null;
                  if ((h && -1 !== qg(h, u, 0)) || (2 & r && u !== f)) {
                    if (Yt(r)) return !1;
                    s = !0;
                  }
                }
              }
          } else {
            if (!s && !Yt(r) && !Yt(l)) return !1;
            if (s && Yt(l)) continue;
            (s = !1), (r = l | (1 & r));
          }
        }
        return Yt(r) || s;
      }
      function Yt(t) {
        return 0 == (1 & t);
      }
      function mT(t, e, n, r) {
        if (null === e) return -1;
        let o = 0;
        if (r || !n) {
          let i = !1;
          for (; o < e.length; ) {
            const s = e[o];
            if (s === t) return o;
            if (3 === s || 6 === s) i = !0;
            else {
              if (1 === s || 2 === s) {
                let a = e[++o];
                for (; "string" == typeof a; ) a = e[++o];
                continue;
              }
              if (4 === s) break;
              if (0 === s) {
                o += 4;
                continue;
              }
            }
            o += i ? 1 : 2;
          }
          return -1;
        }
        return (function _T(t, e) {
          let n = t.indexOf(4);
          if (n > -1)
            for (n++; n < t.length; ) {
              const r = t[n];
              if ("number" == typeof r) return -1;
              if (r === e) return n;
              n++;
            }
          return -1;
        })(e, t);
      }
      function Yg(t, e, n = !1) {
        for (let r = 0; r < e.length; r++) if (gT(t, e[r], n)) return !0;
        return !1;
      }
      function Xg(t, e) {
        return t ? ":not(" + e.trim() + ")" : e;
      }
      function DT(t) {
        let e = t[0],
          n = 1,
          r = 2,
          o = "",
          i = !1;
        for (; n < t.length; ) {
          let s = t[n];
          if ("string" == typeof s)
            if (2 & r) {
              const a = t[++n];
              o += "[" + s + (a.length > 0 ? '="' + a + '"' : "") + "]";
            } else 8 & r ? (o += "." + s) : 4 & r && (o += " " + s);
          else
            "" !== o && !Yt(s) && ((e += Xg(i, o)), (o = "")),
              (r = s),
              (i = i || !Yt(r));
          n++;
        }
        return "" !== o && (e += Xg(i, o)), e;
      }
      function Xt(t) {
        return Bn(() => {
          const e = em(t),
            n = {
              ...e,
              decls: t.decls,
              vars: t.vars,
              template: t.template,
              consts: t.consts || null,
              ngContentSelectors: t.ngContentSelectors,
              onPush: t.changeDetection === pn.OnPush,
              directiveDefs: null,
              pipeDefs: null,
              dependencies: (e.standalone && t.dependencies) || null,
              getStandaloneInjector: null,
              signals: t.signals ?? !1,
              data: t.data || {},
              encapsulation: t.encapsulation || mt.Emulated,
              styles: t.styles || re,
              _: null,
              schemas: t.schemas || null,
              tView: null,
              id: "",
            };
          tm(n);
          const r = t.dependencies;
          return (
            (n.directiveDefs = la(r, !1)),
            (n.pipeDefs = la(r, !0)),
            (n.id = (function IT(t) {
              let e = 0;
              const n = [
                t.selectors,
                t.ngContentSelectors,
                t.hostVars,
                t.hostAttrs,
                t.consts,
                t.vars,
                t.decls,
                t.encapsulation,
                t.standalone,
                t.signals,
                t.exportAs,
                JSON.stringify(t.inputs),
                JSON.stringify(t.outputs),
                Object.getOwnPropertyNames(t.type.prototype),
                !!t.contentQueries,
                !!t.viewQuery,
              ].join("|");
              for (const o of n) e = (Math.imul(31, e) + o.charCodeAt(0)) << 0;
              return (e += 2147483648), "c" + e;
            })(n)),
            n
          );
        });
      }
      function ST(t) {
        return ie(t) || et(t);
      }
      function MT(t) {
        return null !== t;
      }
      function Mt(t) {
        return Bn(() => ({
          type: t.type,
          bootstrap: t.bootstrap || re,
          declarations: t.declarations || re,
          imports: t.imports || re,
          exports: t.exports || re,
          transitiveCompileScopes: null,
          schemas: t.schemas || null,
          id: t.id || null,
        }));
      }
      function Jg(t, e) {
        if (null == t) return gn;
        const n = {};
        for (const r in t)
          if (t.hasOwnProperty(r)) {
            let o = t[r],
              i = o;
            Array.isArray(o) && ((i = o[1]), (o = o[0])),
              (n[o] = r),
              e && (e[o] = i);
          }
        return n;
      }
      function U(t) {
        return Bn(() => {
          const e = em(t);
          return tm(e), e;
        });
      }
      function yt(t) {
        return {
          type: t.type,
          name: t.name,
          factory: null,
          pure: !1 !== t.pure,
          standalone: !0 === t.standalone,
          onDestroy: t.type.prototype.ngOnDestroy || null,
        };
      }
      function ie(t) {
        return t[aa] || null;
      }
      function et(t) {
        return t[mc] || null;
      }
      function vt(t) {
        return t[yc] || null;
      }
      function Tt(t, e) {
        const n = t[Ug] || null;
        if (!n && !0 === e)
          throw new Error(`Type ${$e(t)} does not have '\u0275mod' property.`);
        return n;
      }
      function em(t) {
        const e = {};
        return {
          type: t.type,
          providersResolver: null,
          factory: null,
          hostBindings: t.hostBindings || null,
          hostVars: t.hostVars || 0,
          hostAttrs: t.hostAttrs || null,
          contentQueries: t.contentQueries || null,
          declaredInputs: e,
          inputTransforms: null,
          inputConfig: t.inputs || gn,
          exportAs: t.exportAs || null,
          standalone: !0 === t.standalone,
          signals: !0 === t.signals,
          selectors: t.selectors || re,
          viewQuery: t.viewQuery || null,
          features: t.features || null,
          setInput: null,
          findHostDirectiveDefs: null,
          hostDirectives: null,
          inputs: Jg(t.inputs, e),
          outputs: Jg(t.outputs),
        };
      }
      function tm(t) {
        t.features?.forEach((e) => e(t));
      }
      function la(t, e) {
        if (!t) return null;
        const n = e ? vt : ST;
        return () =>
          ("function" == typeof t ? t() : t).map((r) => n(r)).filter(MT);
      }
      const Ue = 0,
        T = 1,
        G = 2,
        De = 3,
        Jt = 4,
        Di = 5,
        tt = 6,
        fo = 7,
        Ne = 8,
        ho = 9,
        Ar = 10,
        W = 11,
        wi = 12,
        nm = 13,
        po = 14,
        xe = 15,
        bi = 16,
        go = 17,
        mn = 18,
        Ei = 19,
        rm = 20,
        ur = 21,
        jn = 22,
        ua = 23,
        ca = 24,
        J = 25,
        _c = 1,
        om = 2,
        yn = 7,
        mo = 9,
        nt = 11;
      function At(t) {
        return Array.isArray(t) && "object" == typeof t[_c];
      }
      function _t(t) {
        return Array.isArray(t) && !0 === t[_c];
      }
      function Cc(t) {
        return 0 != (4 & t.flags);
      }
      function Ir(t) {
        return t.componentOffset > -1;
      }
      function fa(t) {
        return 1 == (1 & t.flags);
      }
      function en(t) {
        return !!t.template;
      }
      function Dc(t) {
        return 0 != (512 & t[G]);
      }
      function Or(t, e) {
        return t.hasOwnProperty(Hn) ? t[Hn] : null;
      }
      let FT =
          pe.WeakRef ??
          class RT {
            constructor(e) {
              this.ref = e;
            }
            deref() {
              return this.ref;
            }
          },
        LT = 0,
        vn = null,
        ha = !1;
      function Qe(t) {
        const e = vn;
        return (vn = t), e;
      }
      class um {
        constructor() {
          (this.id = LT++),
            (this.ref = (function kT(t) {
              return new FT(t);
            })(this)),
            (this.producers = new Map()),
            (this.consumers = new Map()),
            (this.trackingVersion = 0),
            (this.valueVersion = 0);
        }
        consumerPollProducersForChange() {
          for (const [e, n] of this.producers) {
            const r = n.producerNode.deref();
            if (void 0 !== r && n.atTrackingVersion === this.trackingVersion) {
              if (r.producerPollStatus(n.seenValueVersion)) return !0;
            } else this.producers.delete(e), r?.consumers.delete(this.id);
          }
          return !1;
        }
        producerMayHaveChanged() {
          const e = ha;
          ha = !0;
          try {
            for (const [n, r] of this.consumers) {
              const o = r.consumerNode.deref();
              void 0 !== o && o.trackingVersion === r.atTrackingVersion
                ? o.onConsumerDependencyMayHaveChanged()
                : (this.consumers.delete(n), o?.producers.delete(this.id));
            }
          } finally {
            ha = e;
          }
        }
        producerAccessed() {
          if (ha) throw new Error("");
          if (null === vn) return;
          let e = vn.producers.get(this.id);
          void 0 === e
            ? ((e = {
                consumerNode: vn.ref,
                producerNode: this.ref,
                seenValueVersion: this.valueVersion,
                atTrackingVersion: vn.trackingVersion,
              }),
              vn.producers.set(this.id, e),
              this.consumers.set(vn.id, e))
            : ((e.seenValueVersion = this.valueVersion),
              (e.atTrackingVersion = vn.trackingVersion));
        }
        get hasProducers() {
          return this.producers.size > 0;
        }
        get producerUpdatesAllowed() {
          return !1 !== vn?.consumerAllowSignalWrites;
        }
        producerPollStatus(e) {
          return (
            this.valueVersion !== e ||
            (this.onProducerUpdateValueVersion(), this.valueVersion !== e)
          );
        }
      }
      let cm = null;
      const fm = () => {};
      class jT extends um {
        constructor(e, n, r) {
          super(),
            (this.watch = e),
            (this.schedule = n),
            (this.dirty = !1),
            (this.cleanupFn = fm),
            (this.registerOnCleanup = (o) => {
              this.cleanupFn = o;
            }),
            (this.consumerAllowSignalWrites = r);
        }
        notify() {
          this.dirty || this.schedule(this), (this.dirty = !0);
        }
        onConsumerDependencyMayHaveChanged() {
          this.notify();
        }
        onProducerUpdateValueVersion() {}
        run() {
          if (
            ((this.dirty = !1),
            0 !== this.trackingVersion &&
              !this.consumerPollProducersForChange())
          )
            return;
          const e = Qe(this);
          this.trackingVersion++;
          try {
            this.cleanupFn(),
              (this.cleanupFn = fm),
              this.watch(this.registerOnCleanup);
          } finally {
            Qe(e);
          }
        }
        cleanup() {
          this.cleanupFn();
        }
      }
      class $T {
        constructor(e, n, r) {
          (this.previousValue = e),
            (this.currentValue = n),
            (this.firstChange = r);
        }
        isFirstChange() {
          return this.firstChange;
        }
      }
      function jt() {
        return hm;
      }
      function hm(t) {
        return t.type.prototype.ngOnChanges && (t.setInput = zT), UT;
      }
      function UT() {
        const t = gm(this),
          e = t?.current;
        if (e) {
          const n = t.previous;
          if (n === gn) t.previous = e;
          else for (let r in e) n[r] = e[r];
          (t.current = null), this.ngOnChanges(e);
        }
      }
      function zT(t, e, n, r) {
        const o = this.declaredInputs[n],
          i =
            gm(t) ||
            (function qT(t, e) {
              return (t[pm] = e);
            })(t, { previous: gn, current: null }),
          s = i.current || (i.current = {}),
          a = i.previous,
          l = a[o];
        (s[o] = new $T(l && l.currentValue, e, a === gn)), (t[r] = e);
      }
      jt.ngInherit = !0;
      const pm = "__ngSimpleChanges__";
      function gm(t) {
        return t[pm] || null;
      }
      const _n = function (t, e, n) {};
      function me(t) {
        for (; Array.isArray(t); ) t = t[Ue];
        return t;
      }
      function ma(t, e) {
        return me(e[t]);
      }
      function Ct(t, e) {
        return me(e[t.index]);
      }
      function vm(t, e) {
        return t.data[e];
      }
      function It(t, e) {
        const n = e[t];
        return At(n) ? n : n[Ue];
      }
      function cr(t, e) {
        return null == e ? null : t[e];
      }
      function _m(t) {
        t[go] = 0;
      }
      function XT(t) {
        1024 & t[G] || ((t[G] |= 1024), Dm(t, 1));
      }
      function Cm(t) {
        1024 & t[G] && ((t[G] &= -1025), Dm(t, -1));
      }
      function Dm(t, e) {
        let n = t[De];
        if (null === n) return;
        n[Di] += e;
        let r = n;
        for (
          n = n[De];
          null !== n && ((1 === e && 1 === r[Di]) || (-1 === e && 0 === r[Di]));

        )
          (n[Di] += e), (r = n), (n = n[De]);
      }
      const $ = {
        lFrame: Nm(null),
        bindingsEnabled: !0,
        skipHydrationRootTNode: null,
      };
      function Em() {
        return $.bindingsEnabled;
      }
      function w() {
        return $.lFrame.lView;
      }
      function ee() {
        return $.lFrame.tView;
      }
      function Pr(t) {
        return ($.lFrame.contextLView = t), t[Ne];
      }
      function Nr(t) {
        return ($.lFrame.contextLView = null), t;
      }
      function Ye() {
        let t = Sm();
        for (; null !== t && 64 === t.type; ) t = t.parent;
        return t;
      }
      function Sm() {
        return $.lFrame.currentTNode;
      }
      function Cn(t, e) {
        const n = $.lFrame;
        (n.currentTNode = t), (n.isParent = e);
      }
      function Tc() {
        return $.lFrame.isParent;
      }
      function _o() {
        return $.lFrame.bindingIndex++;
      }
      function Un(t) {
        const e = $.lFrame,
          n = e.bindingIndex;
        return (e.bindingIndex = e.bindingIndex + t), n;
      }
      function cA(t, e) {
        const n = $.lFrame;
        (n.bindingIndex = n.bindingRootIndex = t), Ic(e);
      }
      function Ic(t) {
        $.lFrame.currentDirectiveIndex = t;
      }
      function Pc(t) {
        $.lFrame.currentQueryIndex = t;
      }
      function fA(t) {
        const e = t[T];
        return 2 === e.type ? e.declTNode : 1 === e.type ? t[tt] : null;
      }
      function Om(t, e, n) {
        if (n & k.SkipSelf) {
          let o = e,
            i = t;
          for (
            ;
            !((o = o.parent),
            null !== o ||
              n & k.Host ||
              ((o = fA(i)), null === o || ((i = i[po]), 10 & o.type)));

          );
          if (null === o) return !1;
          (e = o), (t = i);
        }
        const r = ($.lFrame = Pm());
        return (r.currentTNode = e), (r.lView = t), !0;
      }
      function Nc(t) {
        const e = Pm(),
          n = t[T];
        ($.lFrame = e),
          (e.currentTNode = n.firstChild),
          (e.lView = t),
          (e.tView = n),
          (e.contextLView = t),
          (e.bindingIndex = n.bindingStartIndex),
          (e.inI18n = !1);
      }
      function Pm() {
        const t = $.lFrame,
          e = null === t ? null : t.child;
        return null === e ? Nm(t) : e;
      }
      function Nm(t) {
        const e = {
          currentTNode: null,
          isParent: !0,
          lView: null,
          tView: null,
          selectedIndex: -1,
          contextLView: null,
          elementDepthCount: 0,
          currentNamespace: null,
          currentDirectiveIndex: -1,
          bindingRootIndex: -1,
          bindingIndex: -1,
          currentQueryIndex: 0,
          parent: t,
          child: null,
          inI18n: !1,
        };
        return null !== t && (t.child = e), e;
      }
      function xm() {
        const t = $.lFrame;
        return (
          ($.lFrame = t.parent), (t.currentTNode = null), (t.lView = null), t
        );
      }
      const Rm = xm;
      function xc() {
        const t = xm();
        (t.isParent = !0),
          (t.tView = null),
          (t.selectedIndex = -1),
          (t.contextLView = null),
          (t.elementDepthCount = 0),
          (t.currentDirectiveIndex = -1),
          (t.currentNamespace = null),
          (t.bindingRootIndex = -1),
          (t.bindingIndex = -1),
          (t.currentQueryIndex = 0);
      }
      function lt() {
        return $.lFrame.selectedIndex;
      }
      function xr(t) {
        $.lFrame.selectedIndex = t;
      }
      function we() {
        const t = $.lFrame;
        return vm(t.tView, t.selectedIndex);
      }
      let km = !0;
      function ya() {
        return km;
      }
      function dr(t) {
        km = t;
      }
      function va(t, e) {
        for (let n = e.directiveStart, r = e.directiveEnd; n < r; n++) {
          const i = t.data[n].type.prototype,
            {
              ngAfterContentInit: s,
              ngAfterContentChecked: a,
              ngAfterViewInit: l,
              ngAfterViewChecked: u,
              ngOnDestroy: c,
            } = i;
          s && (t.contentHooks ??= []).push(-n, s),
            a &&
              ((t.contentHooks ??= []).push(n, a),
              (t.contentCheckHooks ??= []).push(n, a)),
            l && (t.viewHooks ??= []).push(-n, l),
            u &&
              ((t.viewHooks ??= []).push(n, u),
              (t.viewCheckHooks ??= []).push(n, u)),
            null != c && (t.destroyHooks ??= []).push(n, c);
        }
      }
      function _a(t, e, n) {
        Lm(t, e, 3, n);
      }
      function Ca(t, e, n, r) {
        (3 & t[G]) === n && Lm(t, e, n, r);
      }
      function Rc(t, e) {
        let n = t[G];
        (3 & n) === e && ((n &= 8191), (n += 1), (t[G] = n));
      }
      function Lm(t, e, n, r) {
        const i = r ?? -1,
          s = e.length - 1;
        let a = 0;
        for (let l = void 0 !== r ? 65535 & t[go] : 0; l < s; l++)
          if ("number" == typeof e[l + 1]) {
            if (((a = e[l]), null != r && a >= r)) break;
          } else
            e[l] < 0 && (t[go] += 65536),
              (a < i || -1 == i) &&
                (CA(t, n, e, l), (t[go] = (4294901760 & t[go]) + l + 2)),
              l++;
      }
      function Vm(t, e) {
        _n(4, t, e);
        const n = Qe(null);
        try {
          e.call(t);
        } finally {
          Qe(n), _n(5, t, e);
        }
      }
      function CA(t, e, n, r) {
        const o = n[r] < 0,
          i = n[r + 1],
          a = t[o ? -n[r] : n[r]];
        o
          ? t[G] >> 13 < t[go] >> 16 &&
            (3 & t[G]) === e &&
            ((t[G] += 8192), Vm(a, i))
          : Vm(a, i);
      }
      const Co = -1;
      class Ti {
        constructor(e, n, r) {
          (this.factory = e),
            (this.resolving = !1),
            (this.canSeeViewProviders = n),
            (this.injectImpl = r);
        }
      }
      function Bm(t) {
        return t !== Co;
      }
      function Da(t) {
        return 32767 & t;
      }
      function wa(t, e) {
        let n = (function EA(t) {
            return t >> 16;
          })(t),
          r = e;
        for (; n > 0; ) (r = r[po]), n--;
        return r;
      }
      let kc = !0;
      function ba(t) {
        const e = kc;
        return (kc = t), e;
      }
      const Hm = 255,
        jm = 5;
      let SA = 0;
      const Dn = {};
      function Ea(t, e) {
        const n = $m(t, e);
        if (-1 !== n) return n;
        const r = e[T];
        r.firstCreatePass &&
          ((t.injectorIndex = e.length),
          Lc(r.data, t),
          Lc(e, null),
          Lc(r.blueprint, null));
        const o = Vc(t, e),
          i = t.injectorIndex;
        if (Bm(o)) {
          const s = Da(o),
            a = wa(o, e),
            l = a[T].data;
          for (let u = 0; u < 8; u++) e[i + u] = a[s + u] | l[s + u];
        }
        return (e[i + 8] = o), i;
      }
      function Lc(t, e) {
        t.push(0, 0, 0, 0, 0, 0, 0, 0, e);
      }
      function $m(t, e) {
        return -1 === t.injectorIndex ||
          (t.parent && t.parent.injectorIndex === t.injectorIndex) ||
          null === e[t.injectorIndex + 8]
          ? -1
          : t.injectorIndex;
      }
      function Vc(t, e) {
        if (t.parent && -1 !== t.parent.injectorIndex)
          return t.parent.injectorIndex;
        let n = 0,
          r = null,
          o = e;
        for (; null !== o; ) {
          if (((r = Qm(o)), null === r)) return Co;
          if ((n++, (o = o[po]), -1 !== r.injectorIndex))
            return r.injectorIndex | (n << 16);
        }
        return Co;
      }
      function Bc(t, e, n) {
        !(function MA(t, e, n) {
          let r;
          "string" == typeof n
            ? (r = n.charCodeAt(0) || 0)
            : n.hasOwnProperty(_i) && (r = n[_i]),
            null == r && (r = n[_i] = SA++);
          const o = r & Hm;
          e.data[t + (o >> jm)] |= 1 << o;
        })(t, e, n);
      }
      function Um(t, e, n) {
        if (n & k.Optional || void 0 !== t) return t;
        na();
      }
      function zm(t, e, n, r) {
        if (
          (n & k.Optional && void 0 === r && (r = null),
          !(n & (k.Self | k.Host)))
        ) {
          const o = t[ho],
            i = gt(void 0);
          try {
            return o ? o.get(e, r, n & k.Optional) : Hg(e, r, n & k.Optional);
          } finally {
            gt(i);
          }
        }
        return Um(r, 0, n);
      }
      function qm(t, e, n, r = k.Default, o) {
        if (null !== t) {
          if (2048 & e[G] && !(r & k.Self)) {
            const s = (function PA(t, e, n, r, o) {
              let i = t,
                s = e;
              for (
                ;
                null !== i && null !== s && 2048 & s[G] && !(512 & s[G]);

              ) {
                const a = Gm(i, s, n, r | k.Self, Dn);
                if (a !== Dn) return a;
                let l = i.parent;
                if (!l) {
                  const u = s[rm];
                  if (u) {
                    const c = u.get(n, Dn, r);
                    if (c !== Dn) return c;
                  }
                  (l = Qm(s)), (s = s[po]);
                }
                i = l;
              }
              return o;
            })(t, e, n, r, Dn);
            if (s !== Dn) return s;
          }
          const i = Gm(t, e, n, r, Dn);
          if (i !== Dn) return i;
        }
        return zm(e, n, r, o);
      }
      function Gm(t, e, n, r, o) {
        const i = (function IA(t) {
          if ("string" == typeof t) return t.charCodeAt(0) || 0;
          const e = t.hasOwnProperty(_i) ? t[_i] : void 0;
          return "number" == typeof e ? (e >= 0 ? e & Hm : OA) : e;
        })(n);
        if ("function" == typeof i) {
          if (!Om(e, t, r)) return r & k.Host ? Um(o, 0, r) : zm(e, n, r, o);
          try {
            const s = i(r);
            if (null != s || r & k.Optional) return s;
            na();
          } finally {
            Rm();
          }
        } else if ("number" == typeof i) {
          let s = null,
            a = $m(t, e),
            l = Co,
            u = r & k.Host ? e[xe][tt] : null;
          for (
            (-1 === a || r & k.SkipSelf) &&
            ((l = -1 === a ? Vc(t, e) : e[a + 8]),
            l !== Co && Km(r, !1)
              ? ((s = e[T]), (a = Da(l)), (e = wa(l, e)))
              : (a = -1));
            -1 !== a;

          ) {
            const c = e[T];
            if (Wm(i, a, c.data)) {
              const d = AA(a, e, n, s, r, u);
              if (d !== Dn) return d;
            }
            (l = e[a + 8]),
              l !== Co && Km(r, e[T].data[a + 8] === u) && Wm(i, a, e)
                ? ((s = c), (a = Da(l)), (e = wa(l, e)))
                : (a = -1);
          }
        }
        return o;
      }
      function AA(t, e, n, r, o, i) {
        const s = e[T],
          a = s.data[t + 8],
          c = (function Sa(t, e, n, r, o) {
            const i = t.providerIndexes,
              s = e.data,
              a = 1048575 & i,
              l = t.directiveStart,
              c = i >> 20,
              f = o ? a + c : t.directiveEnd;
            for (let h = r ? a : a + c; h < f; h++) {
              const p = s[h];
              if ((h < l && n === p) || (h >= l && p.type === n)) return h;
            }
            if (o) {
              const h = s[l];
              if (h && en(h) && h.type === n) return l;
            }
            return null;
          })(
            a,
            s,
            n,
            null == r ? Ir(a) && kc : r != s && 0 != (3 & a.type),
            o & k.Host && i === a
          );
        return null !== c ? Rr(e, s, c, a) : Dn;
      }
      function Rr(t, e, n, r) {
        let o = t[n];
        const i = e.data;
        if (
          (function DA(t) {
            return t instanceof Ti;
          })(o)
        ) {
          const s = o;
          s.resolving &&
            (function YM(t, e) {
              const n = e ? `. Dependency path: ${e.join(" > ")} > ${t}` : "";
              throw new v(
                -200,
                `Circular dependency in DI detected for ${t}${n}`
              );
            })(
              (function se(t) {
                return "function" == typeof t
                  ? t.name || t.toString()
                  : "object" == typeof t &&
                    null != t &&
                    "function" == typeof t.type
                  ? t.type.name || t.type.toString()
                  : q(t);
              })(i[n])
            );
          const a = ba(s.canSeeViewProviders);
          s.resolving = !0;
          const l = s.injectImpl ? gt(s.injectImpl) : null;
          Om(t, r, k.Default);
          try {
            (o = t[n] = s.factory(void 0, i, t, r)),
              e.firstCreatePass &&
                n >= r.directiveStart &&
                (function _A(t, e, n) {
                  const {
                    ngOnChanges: r,
                    ngOnInit: o,
                    ngDoCheck: i,
                  } = e.type.prototype;
                  if (r) {
                    const s = hm(e);
                    (n.preOrderHooks ??= []).push(t, s),
                      (n.preOrderCheckHooks ??= []).push(t, s);
                  }
                  o && (n.preOrderHooks ??= []).push(0 - t, o),
                    i &&
                      ((n.preOrderHooks ??= []).push(t, i),
                      (n.preOrderCheckHooks ??= []).push(t, i));
                })(n, i[n], e);
          } finally {
            null !== l && gt(l), ba(a), (s.resolving = !1), Rm();
          }
        }
        return o;
      }
      function Wm(t, e, n) {
        return !!(n[e + (t >> jm)] & (1 << t));
      }
      function Km(t, e) {
        return !(t & k.Self || (t & k.Host && e));
      }
      class Do {
        constructor(e, n) {
          (this._tNode = e), (this._lView = n);
        }
        get(e, n, r) {
          return qm(this._tNode, this._lView, e, sa(r), n);
        }
      }
      function OA() {
        return new Do(Ye(), w());
      }
      function Xe(t) {
        return Bn(() => {
          const e = t.prototype.constructor,
            n = e[Hn] || Hc(e),
            r = Object.prototype;
          let o = Object.getPrototypeOf(t.prototype).constructor;
          for (; o && o !== r; ) {
            const i = o[Hn] || Hc(o);
            if (i && i !== n) return i;
            o = Object.getPrototypeOf(o);
          }
          return (i) => new i();
        });
      }
      function Hc(t) {
        return cc(t)
          ? () => {
              const e = Hc(z(t));
              return e && e();
            }
          : Or(t);
      }
      function Qm(t) {
        const e = t[T],
          n = e.type;
        return 2 === n ? e.declTNode : 1 === n ? t[tt] : null;
      }
      const bo = "__parameters__";
      function So(t, e, n) {
        return Bn(() => {
          const r = (function jc(t) {
            return function (...n) {
              if (t) {
                const r = t(...n);
                for (const o in r) this[o] = r[o];
              }
            };
          })(e);
          function o(...i) {
            if (this instanceof o) return r.apply(this, i), this;
            const s = new o(...i);
            return (a.annotation = s), a;
            function a(l, u, c) {
              const d = l.hasOwnProperty(bo)
                ? l[bo]
                : Object.defineProperty(l, bo, { value: [] })[bo];
              for (; d.length <= c; ) d.push(null);
              return (d[c] = d[c] || []).push(s), l;
            }
          }
          return (
            n && (o.prototype = Object.create(n.prototype)),
            (o.prototype.ngMetadataName = t),
            (o.annotationCls = o),
            o
          );
        });
      }
      function Oi(t, e) {
        t.forEach((n) => (Array.isArray(n) ? Oi(n, e) : e(n)));
      }
      function Ym(t, e, n) {
        e >= t.length ? t.push(n) : t.splice(e, 0, n);
      }
      function Ta(t, e) {
        return e >= t.length - 1 ? t.pop() : t.splice(e, 1)[0];
      }
      function Ot(t, e, n) {
        let r = Mo(t, e);
        return (
          r >= 0
            ? (t[1 | r] = n)
            : ((r = ~r),
              (function kA(t, e, n, r) {
                let o = t.length;
                if (o == e) t.push(n, r);
                else if (1 === o) t.push(r, t[0]), (t[0] = n);
                else {
                  for (o--, t.push(t[o - 1], t[o]); o > e; )
                    (t[o] = t[o - 2]), o--;
                  (t[e] = n), (t[e + 1] = r);
                }
              })(t, r, e, n)),
          r
        );
      }
      function $c(t, e) {
        const n = Mo(t, e);
        if (n >= 0) return t[1 | n];
      }
      function Mo(t, e) {
        return (function Xm(t, e, n) {
          let r = 0,
            o = t.length >> n;
          for (; o !== r; ) {
            const i = r + ((o - r) >> 1),
              s = t[i << n];
            if (e === s) return i << n;
            s > e ? (o = i) : (r = i + 1);
          }
          return ~(o << n);
        })(t, e, 1);
      }
      const Ia = vi(So("Optional"), 8),
        Oa = vi(So("SkipSelf"), 4);
      function Ra(t) {
        return 128 == (128 & t.flags);
      }
      var Dt = (() => (
        ((Dt = Dt || {})[(Dt.Important = 1)] = "Important"),
        (Dt[(Dt.DashCase = 2)] = "DashCase"),
        Dt
      ))();
      const Kc = new Map();
      let sI = 0;
      const Zc = "__ngContext__";
      function rt(t, e) {
        At(e)
          ? ((t[Zc] = e[Ei]),
            (function lI(t) {
              Kc.set(t[Ei], t);
            })(e))
          : (t[Zc] = e);
      }
      let Yc;
      function Xc(t, e) {
        return Yc(t, e);
      }
      function Ri(t) {
        const e = t[De];
        return _t(e) ? e[De] : e;
      }
      function vy(t) {
        return Cy(t[wi]);
      }
      function _y(t) {
        return Cy(t[Jt]);
      }
      function Cy(t) {
        for (; null !== t && !_t(t); ) t = t[Jt];
        return t;
      }
      function Io(t, e, n, r, o) {
        if (null != r) {
          let i,
            s = !1;
          _t(r) ? (i = r) : At(r) && ((s = !0), (r = r[Ue]));
          const a = me(r);
          0 === t && null !== n
            ? null == o
              ? Sy(e, n, a)
              : Fr(e, n, a, o || null, !0)
            : 1 === t && null !== n
            ? Fr(e, n, a, o || null, !0)
            : 2 === t
            ? (function Ha(t, e, n) {
                const r = Va(t, e);
                r &&
                  (function TI(t, e, n, r) {
                    t.removeChild(e, n, r);
                  })(t, r, e, n);
              })(e, a, s)
            : 3 === t && e.destroyNode(a),
            null != i &&
              (function OI(t, e, n, r, o) {
                const i = n[yn];
                i !== me(n) && Io(e, t, r, i, o);
                for (let a = nt; a < n.length; a++) {
                  const l = n[a];
                  ki(l[T], l, t, e, r, i);
                }
              })(e, t, i, n, o);
        }
      }
      function La(t, e, n) {
        return t.createElement(e, n);
      }
      function wy(t, e) {
        const n = t[mo],
          r = n.indexOf(e);
        Cm(e), n.splice(r, 1);
      }
      function ed(t, e) {
        if (t.length <= nt) return;
        const n = nt + e,
          r = t[n];
        if (r) {
          const o = r[bi];
          null !== o && o !== t && wy(o, r), e > 0 && (t[n - 1][Jt] = r[Jt]);
          const i = Ta(t, nt + e);
          !(function _I(t, e) {
            ki(t, e, e[W], 2, null, null), (e[Ue] = null), (e[tt] = null);
          })(r[T], r);
          const s = i[mn];
          null !== s && s.detachView(i[T]),
            (r[De] = null),
            (r[Jt] = null),
            (r[G] &= -129);
        }
        return r;
      }
      function by(t, e) {
        if (!(256 & e[G])) {
          const n = e[W];
          e[ua]?.destroy(),
            e[ca]?.destroy(),
            n.destroyNode && ki(t, e, n, 3, null, null),
            (function wI(t) {
              let e = t[wi];
              if (!e) return td(t[T], t);
              for (; e; ) {
                let n = null;
                if (At(e)) n = e[wi];
                else {
                  const r = e[nt];
                  r && (n = r);
                }
                if (!n) {
                  for (; e && !e[Jt] && e !== t; )
                    At(e) && td(e[T], e), (e = e[De]);
                  null === e && (e = t), At(e) && td(e[T], e), (n = e && e[Jt]);
                }
                e = n;
              }
            })(e);
        }
      }
      function td(t, e) {
        if (!(256 & e[G])) {
          (e[G] &= -129),
            (e[G] |= 256),
            (function MI(t, e) {
              let n;
              if (null != t && null != (n = t.destroyHooks))
                for (let r = 0; r < n.length; r += 2) {
                  const o = e[n[r]];
                  if (!(o instanceof Ti)) {
                    const i = n[r + 1];
                    if (Array.isArray(i))
                      for (let s = 0; s < i.length; s += 2) {
                        const a = o[i[s]],
                          l = i[s + 1];
                        _n(4, a, l);
                        try {
                          l.call(a);
                        } finally {
                          _n(5, a, l);
                        }
                      }
                    else {
                      _n(4, o, i);
                      try {
                        i.call(o);
                      } finally {
                        _n(5, o, i);
                      }
                    }
                  }
                }
            })(t, e),
            (function SI(t, e) {
              const n = t.cleanup,
                r = e[fo];
              if (null !== n)
                for (let i = 0; i < n.length - 1; i += 2)
                  if ("string" == typeof n[i]) {
                    const s = n[i + 3];
                    s >= 0 ? r[s]() : r[-s].unsubscribe(), (i += 2);
                  } else n[i].call(r[n[i + 1]]);
              null !== r && (e[fo] = null);
              const o = e[ur];
              if (null !== o) {
                e[ur] = null;
                for (let i = 0; i < o.length; i++) (0, o[i])();
              }
            })(t, e),
            1 === e[T].type && e[W].destroy();
          const n = e[bi];
          if (null !== n && _t(e[De])) {
            n !== e[De] && wy(n, e);
            const r = e[mn];
            null !== r && r.detachView(t);
          }
          !(function uI(t) {
            Kc.delete(t[Ei]);
          })(e);
        }
      }
      function nd(t, e, n) {
        return (function Ey(t, e, n) {
          let r = e;
          for (; null !== r && 40 & r.type; ) r = (e = r).parent;
          if (null === r) return n[Ue];
          {
            const { componentOffset: o } = r;
            if (o > -1) {
              const { encapsulation: i } = t.data[r.directiveStart + o];
              if (i === mt.None || i === mt.Emulated) return null;
            }
            return Ct(r, n);
          }
        })(t, e.parent, n);
      }
      function Fr(t, e, n, r, o) {
        t.insertBefore(e, n, r, o);
      }
      function Sy(t, e, n) {
        t.appendChild(e, n);
      }
      function My(t, e, n, r, o) {
        null !== r ? Fr(t, e, n, r, o) : Sy(t, e, n);
      }
      function Va(t, e) {
        return t.parentNode(e);
      }
      let rd,
        ad,
        $a,
        Iy = function Ay(t, e, n) {
          return 40 & t.type ? Ct(t, n) : null;
        };
      function Ba(t, e, n, r) {
        const o = nd(t, r, e),
          i = e[W],
          a = (function Ty(t, e, n) {
            return Iy(t, e, n);
          })(r.parent || e[tt], r, e);
        if (null != o)
          if (Array.isArray(n))
            for (let l = 0; l < n.length; l++) My(i, o, n[l], a, !1);
          else My(i, o, n, a, !1);
        void 0 !== rd && rd(i, r, e, n, o);
      }
      function Fi(t, e) {
        if (null !== e) {
          const n = e.type;
          if (3 & n) return Ct(e, t);
          if (4 & n) return od(-1, t[e.index]);
          if (8 & n) {
            const r = e.child;
            if (null !== r) return Fi(t, r);
            {
              const o = t[e.index];
              return _t(o) ? od(-1, o) : me(o);
            }
          }
          if (32 & n) return Xc(e, t)() || me(t[e.index]);
          {
            const r = Py(t, e);
            return null !== r
              ? Array.isArray(r)
                ? r[0]
                : Fi(Ri(t[xe]), r)
              : Fi(t, e.next);
          }
        }
        return null;
      }
      function Py(t, e) {
        return null !== e ? t[xe][tt].projection[e.projection] : null;
      }
      function od(t, e) {
        const n = nt + t + 1;
        if (n < e.length) {
          const r = e[n],
            o = r[T].firstChild;
          if (null !== o) return Fi(r, o);
        }
        return e[yn];
      }
      function id(t, e, n, r, o, i, s) {
        for (; null != n; ) {
          const a = r[n.index],
            l = n.type;
          if (
            (s && 0 === e && (a && rt(me(a), r), (n.flags |= 2)),
            32 != (32 & n.flags))
          )
            if (8 & l) id(t, e, n.child, r, o, i, !1), Io(e, t, o, a, i);
            else if (32 & l) {
              const u = Xc(n, r);
              let c;
              for (; (c = u()); ) Io(e, t, o, c, i);
              Io(e, t, o, a, i);
            } else 16 & l ? xy(t, e, r, n, o, i) : Io(e, t, o, a, i);
          n = s ? n.projectionNext : n.next;
        }
      }
      function ki(t, e, n, r, o, i) {
        id(n, r, t.firstChild, e, o, i, !1);
      }
      function xy(t, e, n, r, o, i) {
        const s = n[xe],
          l = s[tt].projection[r.projection];
        if (Array.isArray(l))
          for (let u = 0; u < l.length; u++) Io(e, t, o, l[u], i);
        else {
          let u = l;
          const c = s[De];
          Ra(r) && (u.flags |= 128), id(t, e, u, c, o, i, !0);
        }
      }
      function Ry(t, e, n) {
        "" === n
          ? t.removeAttribute(e, "class")
          : t.setAttribute(e, "class", n);
      }
      function Fy(t, e, n) {
        const { mergedAttrs: r, classes: o, styles: i } = n;
        null !== r && vc(t, e, r),
          null !== o && Ry(t, e, o),
          null !== i &&
            (function NI(t, e, n) {
              t.setAttribute(e, "style", n);
            })(t, e, i);
      }
      function Vy(t) {
        return (
          (function ld() {
            if (void 0 === $a && (($a = null), pe.trustedTypes))
              try {
                $a = pe.trustedTypes.createPolicy("angular#unsafe-bypass", {
                  createHTML: (t) => t,
                  createScript: (t) => t,
                  createScriptURL: (t) => t,
                });
              } catch {}
            return $a;
          })()?.createScriptURL(t) || t
        );
      }
      class By {
        constructor(e) {
          this.changingThisBreaksApplicationSecurity = e;
        }
        toString() {
          return `SafeValue must use [property]=binding: ${this.changingThisBreaksApplicationSecurity} (see ${Fg})`;
        }
      }
      function fr(t) {
        return t instanceof By ? t.changingThisBreaksApplicationSecurity : t;
      }
      function Vi(t, e) {
        const n = (function $I(t) {
          return (t instanceof By && t.getTypeName()) || null;
        })(t);
        if (null != n && n !== e) {
          if ("ResourceURL" === n && "URL" === e) return !0;
          throw new Error(`Required a safe ${e}, got a ${n} (see ${Fg})`);
        }
        return n === e;
      }
      const GI = /^(?!javascript:)(?:[a-z0-9+.-]+:|[^&:\/?#]*(?:[\/?#]|$))/i;
      var Re = (() => (
        ((Re = Re || {})[(Re.NONE = 0)] = "NONE"),
        (Re[(Re.HTML = 1)] = "HTML"),
        (Re[(Re.STYLE = 2)] = "STYLE"),
        (Re[(Re.SCRIPT = 3)] = "SCRIPT"),
        (Re[(Re.URL = 4)] = "URL"),
        (Re[(Re.RESOURCE_URL = 5)] = "RESOURCE_URL"),
        Re
      ))();
      function hd(t) {
        const e = Hi();
        return e
          ? e.sanitize(Re.URL, t) || ""
          : Vi(t, "URL")
          ? fr(t)
          : (function ud(t) {
              return (t = String(t)).match(GI) ? t : "unsafe:" + t;
            })(q(t));
      }
      function Gy(t) {
        const e = Hi();
        if (e) return Vy(e.sanitize(Re.RESOURCE_URL, t) || "");
        if (Vi(t, "ResourceURL")) return Vy(fr(t));
        throw new v(904, !1);
      }
      function Hi() {
        const t = w();
        return t && t[Ar].sanitizer;
      }
      class O {
        constructor(e, n) {
          (this._desc = e),
            (this.ngMetadataName = "InjectionToken"),
            (this.ɵprov = void 0),
            "number" == typeof n
              ? (this.__NG_ELEMENT_ID__ = n)
              : void 0 !== n &&
                (this.ɵprov = N({
                  token: this,
                  providedIn: n.providedIn || "root",
                  factory: n.factory,
                }));
        }
        get multi() {
          return this;
        }
        toString() {
          return `InjectionToken ${this._desc}`;
        }
      }
      const ji = new O("ENVIRONMENT_INITIALIZER"),
        Ky = new O("INJECTOR", -1),
        Qy = new O("INJECTOR_DEF_TYPES");
      class Zy {
        get(e, n = yi) {
          if (n === yi) {
            const r = new Error(`NullInjectorError: No provider for ${$e(e)}!`);
            throw ((r.name = "NullInjectorError"), r);
          }
          return n;
        }
      }
      function iO(...t) {
        return { ɵproviders: Yy(0, t), ɵfromNgModule: !0 };
      }
      function Yy(t, ...e) {
        const n = [],
          r = new Set();
        let o;
        return (
          Oi(e, (i) => {
            const s = i;
            gd(s, n, [], r) && ((o ||= []), o.push(s));
          }),
          void 0 !== o && Xy(o, n),
          n
        );
      }
      function Xy(t, e) {
        for (let n = 0; n < t.length; n++) {
          const { providers: o } = t[n];
          md(o, (i) => {
            e.push(i);
          });
        }
      }
      function gd(t, e, n, r) {
        if (!(t = z(t))) return !1;
        let o = null,
          i = Lg(t);
        const s = !i && ie(t);
        if (i || s) {
          if (s && !s.standalone) return !1;
          o = t;
        } else {
          const l = t.ngModule;
          if (((i = Lg(l)), !i)) return !1;
          o = l;
        }
        const a = r.has(o);
        if (s) {
          if (a) return !1;
          if ((r.add(o), s.dependencies)) {
            const l =
              "function" == typeof s.dependencies
                ? s.dependencies()
                : s.dependencies;
            for (const u of l) gd(u, e, n, r);
          }
        } else {
          if (!i) return !1;
          {
            if (null != i.imports && !a) {
              let u;
              r.add(o);
              try {
                Oi(i.imports, (c) => {
                  gd(c, e, n, r) && ((u ||= []), u.push(c));
                });
              } finally {
              }
              void 0 !== u && Xy(u, e);
            }
            if (!a) {
              const u = Or(o) || (() => new o());
              e.push(
                { provide: o, useFactory: u, deps: re },
                { provide: Qy, useValue: o, multi: !0 },
                { provide: ji, useValue: () => I(o), multi: !0 }
              );
            }
            const l = i.providers;
            null == l ||
              a ||
              md(l, (c) => {
                e.push(c);
              });
          }
        }
        return o !== t && void 0 !== t.providers;
      }
      function md(t, e) {
        for (let n of t)
          dc(n) && (n = n.ɵproviders), Array.isArray(n) ? md(n, e) : e(n);
      }
      const sO = ue({ provide: String, useValue: ue });
      function yd(t) {
        return null !== t && "object" == typeof t && sO in t;
      }
      function kr(t) {
        return "function" == typeof t;
      }
      const vd = new O("Set Injector scope."),
        za = {},
        lO = {};
      let _d;
      function qa() {
        return void 0 === _d && (_d = new Zy()), _d;
      }
      class wn {}
      class Cd extends wn {
        get destroyed() {
          return this._destroyed;
        }
        constructor(e, n, r, o) {
          super(),
            (this.parent = n),
            (this.source = r),
            (this.scopes = o),
            (this.records = new Map()),
            (this._ngOnDestroyHooks = new Set()),
            (this._onDestroyHooks = []),
            (this._destroyed = !1),
            wd(e, (s) => this.processProvider(s)),
            this.records.set(Ky, Po(void 0, this)),
            o.has("environment") && this.records.set(wn, Po(void 0, this));
          const i = this.records.get(vd);
          null != i && "string" == typeof i.value && this.scopes.add(i.value),
            (this.injectorDefTypes = new Set(this.get(Qy.multi, re, k.Self)));
        }
        destroy() {
          this.assertNotDestroyed(), (this._destroyed = !0);
          try {
            for (const n of this._ngOnDestroyHooks) n.ngOnDestroy();
            const e = this._onDestroyHooks;
            this._onDestroyHooks = [];
            for (const n of e) n();
          } finally {
            this.records.clear(),
              this._ngOnDestroyHooks.clear(),
              this.injectorDefTypes.clear();
          }
        }
        onDestroy(e) {
          return (
            this.assertNotDestroyed(),
            this._onDestroyHooks.push(e),
            () => this.removeOnDestroy(e)
          );
        }
        runInContext(e) {
          this.assertNotDestroyed();
          const n = lr(this),
            r = gt(void 0);
          try {
            return e();
          } finally {
            lr(n), gt(r);
          }
        }
        get(e, n = yi, r = k.Default) {
          if ((this.assertNotDestroyed(), e.hasOwnProperty(zg)))
            return e[zg](this);
          r = sa(r);
          const o = lr(this),
            i = gt(void 0);
          try {
            if (!(r & k.SkipSelf)) {
              let a = this.records.get(e);
              if (void 0 === a) {
                const l =
                  (function hO(t) {
                    return (
                      "function" == typeof t ||
                      ("object" == typeof t && t instanceof O)
                    );
                  })(e) && ra(e);
                (a = l && this.injectableDefInScope(l) ? Po(Dd(e), za) : null),
                  this.records.set(e, a);
              }
              if (null != a) return this.hydrate(e, a);
            }
            return (r & k.Self ? qa() : this.parent).get(
              e,
              (n = r & k.Optional && n === yi ? null : n)
            );
          } catch (s) {
            if ("NullInjectorError" === s.name) {
              if (((s[ia] = s[ia] || []).unshift($e(e)), o)) throw s;
              return (function dT(t, e, n, r) {
                const o = t[ia];
                throw (
                  (e[jg] && o.unshift(e[jg]),
                  (t.message = (function fT(t, e, n, r = null) {
                    t =
                      t && "\n" === t.charAt(0) && "\u0275" == t.charAt(1)
                        ? t.slice(2)
                        : t;
                    let o = $e(e);
                    if (Array.isArray(e)) o = e.map($e).join(" -> ");
                    else if ("object" == typeof e) {
                      let i = [];
                      for (let s in e)
                        if (e.hasOwnProperty(s)) {
                          let a = e[s];
                          i.push(
                            s +
                              ":" +
                              ("string" == typeof a ? JSON.stringify(a) : $e(a))
                          );
                        }
                      o = `{${i.join(", ")}}`;
                    }
                    return `${n}${r ? "(" + r + ")" : ""}[${o}]: ${t.replace(
                      sT,
                      "\n  "
                    )}`;
                  })("\n" + t.message, o, n, r)),
                  (t.ngTokenPath = o),
                  (t[ia] = null),
                  t)
                );
              })(s, e, "R3InjectorError", this.source);
            }
            throw s;
          } finally {
            gt(i), lr(o);
          }
        }
        resolveInjectorInitializers() {
          const e = lr(this),
            n = gt(void 0);
          try {
            const r = this.get(ji.multi, re, k.Self);
            for (const o of r) o();
          } finally {
            lr(e), gt(n);
          }
        }
        toString() {
          const e = [],
            n = this.records;
          for (const r of n.keys()) e.push($e(r));
          return `R3Injector[${e.join(", ")}]`;
        }
        assertNotDestroyed() {
          if (this._destroyed) throw new v(205, !1);
        }
        processProvider(e) {
          let n = kr((e = z(e))) ? e : z(e && e.provide);
          const r = (function cO(t) {
            return yd(t) ? Po(void 0, t.useValue) : Po(tv(t), za);
          })(e);
          if (kr(e) || !0 !== e.multi) this.records.get(n);
          else {
            let o = this.records.get(n);
            o ||
              ((o = Po(void 0, za, !0)),
              (o.factory = () => gc(o.multi)),
              this.records.set(n, o)),
              (n = e),
              o.multi.push(e);
          }
          this.records.set(n, r);
        }
        hydrate(e, n) {
          return (
            n.value === za && ((n.value = lO), (n.value = n.factory())),
            "object" == typeof n.value &&
              n.value &&
              (function fO(t) {
                return (
                  null !== t &&
                  "object" == typeof t &&
                  "function" == typeof t.ngOnDestroy
                );
              })(n.value) &&
              this._ngOnDestroyHooks.add(n.value),
            n.value
          );
        }
        injectableDefInScope(e) {
          if (!e.providedIn) return !1;
          const n = z(e.providedIn);
          return "string" == typeof n
            ? "any" === n || this.scopes.has(n)
            : this.injectorDefTypes.has(n);
        }
        removeOnDestroy(e) {
          const n = this._onDestroyHooks.indexOf(e);
          -1 !== n && this._onDestroyHooks.splice(n, 1);
        }
      }
      function Dd(t) {
        const e = ra(t),
          n = null !== e ? e.factory : Or(t);
        if (null !== n) return n;
        if (t instanceof O) throw new v(204, !1);
        if (t instanceof Function)
          return (function uO(t) {
            const e = t.length;
            if (e > 0)
              throw (
                ((function Pi(t, e) {
                  const n = [];
                  for (let r = 0; r < t; r++) n.push(e);
                  return n;
                })(e, "?"),
                new v(204, !1))
              );
            const n = (function rT(t) {
              return (t && (t[oa] || t[Vg])) || null;
            })(t);
            return null !== n ? () => n.factory(t) : () => new t();
          })(t);
        throw new v(204, !1);
      }
      function tv(t, e, n) {
        let r;
        if (kr(t)) {
          const o = z(t);
          return Or(o) || Dd(o);
        }
        if (yd(t)) r = () => z(t.useValue);
        else if (
          (function ev(t) {
            return !(!t || !t.useFactory);
          })(t)
        )
          r = () => t.useFactory(...gc(t.deps || []));
        else if (
          (function Jy(t) {
            return !(!t || !t.useExisting);
          })(t)
        )
          r = () => I(z(t.useExisting));
        else {
          const o = z(t && (t.useClass || t.provide));
          if (
            !(function dO(t) {
              return !!t.deps;
            })(t)
          )
            return Or(o) || Dd(o);
          r = () => new o(...gc(t.deps));
        }
        return r;
      }
      function Po(t, e, n = !1) {
        return { factory: t, value: e, multi: n ? [] : void 0 };
      }
      function wd(t, e) {
        for (const n of t)
          Array.isArray(n) ? wd(n, e) : n && dc(n) ? wd(n.ɵproviders, e) : e(n);
      }
      const Ga = new O("AppId", { providedIn: "root", factory: () => pO }),
        pO = "ng",
        nv = new O("Platform Initializer"),
        Lr = new O("Platform ID", {
          providedIn: "platform",
          factory: () => "unknown",
        }),
        rv = new O("AnimationModuleType"),
        ov = new O("CSP nonce", {
          providedIn: "root",
          factory: () =>
            (function Li() {
              if (void 0 !== ad) return ad;
              if (typeof document < "u") return document;
              throw new v(210, !1);
            })()
              .body?.querySelector("[ngCspNonce]")
              ?.getAttribute("ngCspNonce") || null,
        });
      let sv = (t, e) => null;
      function av(t, e) {
        return sv(t, e);
      }
      class bO {}
      class cv {}
      class SO {
        resolveComponentFactory(e) {
          throw (function EO(t) {
            const e = Error(`No component factory found for ${$e(t)}.`);
            return (e.ngComponent = t), e;
          })(e);
        }
      }
      let Ya = (() => {
        class t {}
        return (t.NULL = new SO()), t;
      })();
      function MO() {
        return No(Ye(), w());
      }
      function No(t, e) {
        return new Pt(Ct(t, e));
      }
      let Pt = (() => {
        class t {
          constructor(n) {
            this.nativeElement = n;
          }
        }
        return (t.__NG_ELEMENT_ID__ = MO), t;
      })();
      class qi {}
      let qn = (() => {
          class t {
            constructor() {
              this.destroyNode = null;
            }
          }
          return (
            (t.__NG_ELEMENT_ID__ = () =>
              (function AO() {
                const t = w(),
                  n = It(Ye().index, t);
                return (At(n) ? n : t)[W];
              })()),
            t
          );
        })(),
        IO = (() => {
          class t {}
          return (
            (t.ɵprov = N({
              token: t,
              providedIn: "root",
              factory: () => null,
            })),
            t
          );
        })();
      class Gi {
        constructor(e) {
          (this.full = e),
            (this.major = e.split(".")[0]),
            (this.minor = e.split(".")[1]),
            (this.patch = e.split(".").slice(2).join("."));
        }
      }
      const OO = new Gi("16.1.1"),
        xd = {};
      function Wi(t) {
        for (; t; ) {
          t[G] |= 64;
          const e = Ri(t);
          if (Dc(t) && !e) return t;
          t = e;
        }
        return null;
      }
      function Rd(t) {
        return t.ngOriginalError;
      }
      class Vr {
        constructor() {
          this._console = console;
        }
        handleError(e) {
          const n = this._findOriginalError(e);
          this._console.error("ERROR", e),
            n && this._console.error("ORIGINAL ERROR", n);
        }
        _findOriginalError(e) {
          let n = e && Rd(e);
          for (; n && Rd(n); ) n = Rd(n);
          return n || null;
        }
      }
      const pv = new O("", { providedIn: "root", factory: () => !1 });
      function Gn(t) {
        return t instanceof Function ? t() : t;
      }
      class _v extends um {
        constructor() {
          super(...arguments),
            (this.consumerAllowSignalWrites = !1),
            (this._lView = null);
        }
        set lView(e) {
          this._lView = e;
        }
        onConsumerDependencyMayHaveChanged() {
          Wi(this._lView);
        }
        onProducerUpdateValueVersion() {}
        get hasReadASignal() {
          return this.hasProducers;
        }
        runInContext(e, n, r) {
          const o = Qe(this);
          this.trackingVersion++;
          try {
            e(n, r);
          } finally {
            Qe(o);
          }
        }
        destroy() {
          this.trackingVersion++;
        }
      }
      let Ja = null;
      function Cv() {
        return (Ja ??= new _v()), Ja;
      }
      function Dv(t, e) {
        return t[e] ?? Cv();
      }
      function wv(t, e) {
        const n = Cv();
        n.hasReadASignal && ((t[e] = Ja), (n.lView = t), (Ja = new _v()));
      }
      const K = {};
      function Q(t) {
        bv(ee(), w(), lt() + t, !1);
      }
      function bv(t, e, n, r) {
        if (!r)
          if (3 == (3 & e[G])) {
            const i = t.preOrderCheckHooks;
            null !== i && _a(e, i, n);
          } else {
            const i = t.preOrderHooks;
            null !== i && Ca(e, i, 0, n);
          }
        xr(n);
      }
      function Tv(t, e = null, n = null, r) {
        const o = Av(t, e, n, r);
        return o.resolveInjectorInitializers(), o;
      }
      function Av(t, e = null, n = null, r, o = new Set()) {
        const i = [n || re, iO(t)];
        return (
          (r = r || ("object" == typeof t ? void 0 : $e(t))),
          new Cd(i, e || qa(), r || null, o)
        );
      }
      let bn = (() => {
        class t {
          static create(n, r) {
            if (Array.isArray(n)) return Tv({ name: "" }, r, n, "");
            {
              const o = n.name ?? "";
              return Tv({ name: o }, n.parent, n.providers, o);
            }
          }
        }
        return (
          (t.THROW_IF_NOT_FOUND = yi),
          (t.NULL = new Zy()),
          (t.ɵprov = N({ token: t, providedIn: "any", factory: () => I(Ky) })),
          (t.__NG_ELEMENT_ID__ = -1),
          t
        );
      })();
      function C(t, e = k.Default) {
        const n = w();
        return null === n ? I(t, e) : qm(Ye(), n, z(t), e);
      }
      function el(t, e, n, r, o, i, s, a, l, u, c) {
        const d = e.blueprint.slice();
        return (
          (d[Ue] = o),
          (d[G] = 140 | r),
          (null !== u || (t && 2048 & t[G])) && (d[G] |= 2048),
          _m(d),
          (d[De] = d[po] = t),
          (d[Ne] = n),
          (d[Ar] = s || (t && t[Ar])),
          (d[W] = a || (t && t[W])),
          (d[ho] = l || (t && t[ho]) || null),
          (d[tt] = i),
          (d[Ei] = (function aI() {
            return sI++;
          })()),
          (d[jn] = c),
          (d[rm] = u),
          (d[xe] = 2 == e.type ? t[xe] : d),
          d
        );
      }
      function Ro(t, e, n, r, o) {
        let i = t.data[e];
        if (null === i)
          (i = (function Fd(t, e, n, r, o) {
            const i = Sm(),
              s = Tc(),
              l = (t.data[e] = (function YO(t, e, n, r, o, i) {
                let s = e ? e.injectorIndex : -1,
                  a = 0;
                return (
                  (function vo() {
                    return null !== $.skipHydrationRootTNode;
                  })() && (a |= 128),
                  {
                    type: n,
                    index: r,
                    insertBeforeIndex: null,
                    injectorIndex: s,
                    directiveStart: -1,
                    directiveEnd: -1,
                    directiveStylingLast: -1,
                    componentOffset: -1,
                    propertyBindings: null,
                    flags: a,
                    providerIndexes: 0,
                    value: o,
                    attrs: i,
                    mergedAttrs: null,
                    localNames: null,
                    initialInputs: void 0,
                    inputs: null,
                    outputs: null,
                    tView: null,
                    next: null,
                    prev: null,
                    projectionNext: null,
                    child: null,
                    parent: e,
                    projection: null,
                    styles: null,
                    stylesWithoutHost: null,
                    residualStyles: void 0,
                    classes: null,
                    classesWithoutHost: null,
                    residualClasses: void 0,
                    classBindings: 0,
                    styleBindings: 0,
                  }
                );
              })(0, s ? i : i && i.parent, n, e, r, o));
            return (
              null === t.firstChild && (t.firstChild = l),
              null !== i &&
                (s
                  ? null == i.child && null !== l.parent && (i.child = l)
                  : null === i.next && ((i.next = l), (l.prev = i))),
              l
            );
          })(t, e, n, r, o)),
            (function uA() {
              return $.lFrame.inI18n;
            })() && (i.flags |= 32);
        else if (64 & i.type) {
          (i.type = n), (i.value = r), (i.attrs = o);
          const s = (function Mi() {
            const t = $.lFrame,
              e = t.currentTNode;
            return t.isParent ? e : e.parent;
          })();
          i.injectorIndex = null === s ? -1 : s.injectorIndex;
        }
        return Cn(i, !0), i;
      }
      function Ki(t, e, n, r) {
        if (0 === n) return -1;
        const o = e.length;
        for (let i = 0; i < n; i++)
          e.push(r), t.blueprint.push(r), t.data.push(null);
        return o;
      }
      function Ov(t, e, n, r, o) {
        const i = Dv(e, ua),
          s = lt(),
          a = 2 & r;
        try {
          if (
            (xr(-1), a && e.length > J && bv(t, e, J, !1), _n(a ? 2 : 0, o), a)
          )
            i.runInContext(n, r, o);
          else {
            const u = Qe(null);
            try {
              n(r, o);
            } finally {
              Qe(u);
            }
          }
        } finally {
          a && null === e[ua] && wv(e, ua), xr(s), _n(a ? 3 : 1, o);
        }
      }
      function kd(t, e, n) {
        if (Cc(e)) {
          const r = Qe(null);
          try {
            const i = e.directiveEnd;
            for (let s = e.directiveStart; s < i; s++) {
              const a = t.data[s];
              a.contentQueries && a.contentQueries(1, n[s], s);
            }
          } finally {
            Qe(r);
          }
        }
      }
      function Ld(t, e, n) {
        Em() &&
          ((function oP(t, e, n, r) {
            const o = n.directiveStart,
              i = n.directiveEnd;
            Ir(n) &&
              (function dP(t, e, n) {
                const r = Ct(e, t),
                  o = Pv(n);
                let s = 16;
                n.signals ? (s = 4096) : n.onPush && (s = 64);
                const a = tl(
                  t,
                  el(
                    t,
                    o,
                    null,
                    s,
                    r,
                    e,
                    null,
                    t[Ar].rendererFactory.createRenderer(r, n),
                    null,
                    null,
                    null
                  )
                );
                t[e.index] = a;
              })(e, n, t.data[o + n.componentOffset]),
              t.firstCreatePass || Ea(n, e),
              rt(r, e);
            const s = n.initialInputs;
            for (let a = o; a < i; a++) {
              const l = t.data[a],
                u = Rr(e, t, a, n);
              rt(u, e),
                null !== s && fP(0, a - o, u, l, 0, s),
                en(l) && (It(n.index, e)[Ne] = Rr(e, t, a, n));
            }
          })(t, e, n, Ct(n, e)),
          64 == (64 & n.flags) && kv(t, e, n));
      }
      function Vd(t, e, n = Ct) {
        const r = e.localNames;
        if (null !== r) {
          let o = e.index + 1;
          for (let i = 0; i < r.length; i += 2) {
            const s = r[i + 1],
              a = -1 === s ? n(e, t) : t[s];
            t[o++] = a;
          }
        }
      }
      function Pv(t) {
        const e = t.tView;
        return null === e || e.incompleteFirstPass
          ? (t.tView = Bd(
              1,
              null,
              t.template,
              t.decls,
              t.vars,
              t.directiveDefs,
              t.pipeDefs,
              t.viewQuery,
              t.schemas,
              t.consts,
              t.id
            ))
          : e;
      }
      function Bd(t, e, n, r, o, i, s, a, l, u, c) {
        const d = J + r,
          f = d + o,
          h = (function qO(t, e) {
            const n = [];
            for (let r = 0; r < e; r++) n.push(r < t ? null : K);
            return n;
          })(d, f),
          p = "function" == typeof u ? u() : u;
        return (h[T] = {
          type: t,
          blueprint: h,
          template: n,
          queries: null,
          viewQuery: a,
          declTNode: e,
          data: h.slice().fill(null, d),
          bindingStartIndex: d,
          expandoStartIndex: f,
          hostBindingOpCodes: null,
          firstCreatePass: !0,
          firstUpdatePass: !0,
          staticViewQueries: !1,
          staticContentQueries: !1,
          preOrderHooks: null,
          preOrderCheckHooks: null,
          contentHooks: null,
          contentCheckHooks: null,
          viewHooks: null,
          viewCheckHooks: null,
          destroyHooks: null,
          cleanup: null,
          contentQueries: null,
          components: null,
          directiveRegistry: "function" == typeof i ? i() : i,
          pipeRegistry: "function" == typeof s ? s() : s,
          firstChild: null,
          schemas: l,
          consts: p,
          incompleteFirstPass: !1,
          ssrId: c,
        });
      }
      let Nv = (t) => null;
      function xv(t, e, n, r) {
        for (let o in t)
          if (t.hasOwnProperty(o)) {
            n = null === n ? {} : n;
            const i = t[o];
            null === r
              ? Rv(n, e, o, i)
              : r.hasOwnProperty(o) && Rv(n, e, r[o], i);
          }
        return n;
      }
      function Rv(t, e, n, r) {
        t.hasOwnProperty(n) ? t[n].push(e, r) : (t[n] = [e, r]);
      }
      function Hd(t, e, n, r) {
        if (Em()) {
          const o = null === r ? null : { "": -1 },
            i = (function sP(t, e) {
              const n = t.directiveRegistry;
              let r = null,
                o = null;
              if (n)
                for (let i = 0; i < n.length; i++) {
                  const s = n[i];
                  if (Yg(e, s.selectors, !1))
                    if ((r || (r = []), en(s)))
                      if (null !== s.findHostDirectiveDefs) {
                        const a = [];
                        (o = o || new Map()),
                          s.findHostDirectiveDefs(s, a, o),
                          r.unshift(...a, s),
                          jd(t, e, a.length);
                      } else r.unshift(s), jd(t, e, 0);
                    else
                      (o = o || new Map()),
                        s.findHostDirectiveDefs?.(s, r, o),
                        r.push(s);
                }
              return null === r ? null : [r, o];
            })(t, n);
          let s, a;
          null === i ? (s = a = null) : ([s, a] = i),
            null !== s && Fv(t, e, n, s, o, a),
            o &&
              (function aP(t, e, n) {
                if (e) {
                  const r = (t.localNames = []);
                  for (let o = 0; o < e.length; o += 2) {
                    const i = n[e[o + 1]];
                    if (null == i) throw new v(-301, !1);
                    r.push(e[o], i);
                  }
                }
              })(n, r, o);
        }
        n.mergedAttrs = Ci(n.mergedAttrs, n.attrs);
      }
      function Fv(t, e, n, r, o, i) {
        for (let u = 0; u < r.length; u++) Bc(Ea(n, e), t, r[u].type);
        !(function uP(t, e, n) {
          (t.flags |= 1),
            (t.directiveStart = e),
            (t.directiveEnd = e + n),
            (t.providerIndexes = e);
        })(n, t.data.length, r.length);
        for (let u = 0; u < r.length; u++) {
          const c = r[u];
          c.providersResolver && c.providersResolver(c);
        }
        let s = !1,
          a = !1,
          l = Ki(t, e, r.length, null);
        for (let u = 0; u < r.length; u++) {
          const c = r[u];
          (n.mergedAttrs = Ci(n.mergedAttrs, c.hostAttrs)),
            cP(t, n, e, l, c),
            lP(l, c, o),
            null !== c.contentQueries && (n.flags |= 4),
            (null !== c.hostBindings ||
              null !== c.hostAttrs ||
              0 !== c.hostVars) &&
              (n.flags |= 64);
          const d = c.type.prototype;
          !s &&
            (d.ngOnChanges || d.ngOnInit || d.ngDoCheck) &&
            ((t.preOrderHooks ??= []).push(n.index), (s = !0)),
            !a &&
              (d.ngOnChanges || d.ngDoCheck) &&
              ((t.preOrderCheckHooks ??= []).push(n.index), (a = !0)),
            l++;
        }
        !(function XO(t, e, n) {
          const o = e.directiveEnd,
            i = t.data,
            s = e.attrs,
            a = [];
          let l = null,
            u = null;
          for (let c = e.directiveStart; c < o; c++) {
            const d = i[c],
              f = n ? n.get(d) : null,
              p = f ? f.outputs : null;
            (l = xv(d.inputs, c, l, f ? f.inputs : null)),
              (u = xv(d.outputs, c, u, p));
            const g = null === l || null === s || Zg(e) ? null : hP(l, c, s);
            a.push(g);
          }
          null !== l &&
            (l.hasOwnProperty("class") && (e.flags |= 8),
            l.hasOwnProperty("style") && (e.flags |= 16)),
            (e.initialInputs = a),
            (e.inputs = l),
            (e.outputs = u);
        })(t, n, i);
      }
      function kv(t, e, n) {
        const r = n.directiveStart,
          o = n.directiveEnd,
          i = n.index,
          s = (function dA() {
            return $.lFrame.currentDirectiveIndex;
          })();
        try {
          xr(i);
          for (let a = r; a < o; a++) {
            const l = t.data[a],
              u = e[a];
            Ic(a),
              (null !== l.hostBindings ||
                0 !== l.hostVars ||
                null !== l.hostAttrs) &&
                iP(l, u);
          }
        } finally {
          xr(-1), Ic(s);
        }
      }
      function iP(t, e) {
        null !== t.hostBindings && t.hostBindings(1, e);
      }
      function jd(t, e, n) {
        (e.componentOffset = n), (t.components ??= []).push(e.index);
      }
      function lP(t, e, n) {
        if (n) {
          if (e.exportAs)
            for (let r = 0; r < e.exportAs.length; r++) n[e.exportAs[r]] = t;
          en(e) && (n[""] = t);
        }
      }
      function cP(t, e, n, r, o) {
        t.data[r] = o;
        const i = o.factory || (o.factory = Or(o.type)),
          s = new Ti(i, en(o), C);
        (t.blueprint[r] = s),
          (n[r] = s),
          (function nP(t, e, n, r, o) {
            const i = o.hostBindings;
            if (i) {
              let s = t.hostBindingOpCodes;
              null === s && (s = t.hostBindingOpCodes = []);
              const a = ~e.index;
              (function rP(t) {
                let e = t.length;
                for (; e > 0; ) {
                  const n = t[--e];
                  if ("number" == typeof n && n < 0) return n;
                }
                return 0;
              })(s) != a && s.push(a),
                s.push(n, r, i);
            }
          })(t, e, r, Ki(t, n, o.hostVars, K), o);
      }
      function En(t, e, n, r, o, i) {
        const s = Ct(t, e);
        !(function $d(t, e, n, r, o, i, s) {
          if (null == i) t.removeAttribute(e, o, n);
          else {
            const a = null == s ? q(i) : s(i, r || "", o);
            t.setAttribute(e, o, a, n);
          }
        })(e[W], s, i, t.value, n, r, o);
      }
      function fP(t, e, n, r, o, i) {
        const s = i[e];
        if (null !== s)
          for (let a = 0; a < s.length; ) Lv(r, n, s[a++], s[a++], s[a++]);
      }
      function Lv(t, e, n, r, o) {
        const i = Qe(null);
        try {
          const s = t.inputTransforms;
          null !== s && s.hasOwnProperty(r) && (o = s[r].call(e, o)),
            null !== t.setInput ? t.setInput(e, o, n, r) : (e[r] = o);
        } finally {
          Qe(i);
        }
      }
      function hP(t, e, n) {
        let r = null,
          o = 0;
        for (; o < n.length; ) {
          const i = n[o];
          if (0 !== i)
            if (5 !== i) {
              if ("number" == typeof i) break;
              if (t.hasOwnProperty(i)) {
                null === r && (r = []);
                const s = t[i];
                for (let a = 0; a < s.length; a += 2)
                  if (s[a] === e) {
                    r.push(i, s[a + 1], n[o + 1]);
                    break;
                  }
              }
              o += 2;
            } else o += 2;
          else o += 4;
        }
        return r;
      }
      function Vv(t, e, n, r) {
        return [t, !0, !1, e, null, 0, r, n, null, null, null];
      }
      function Bv(t, e) {
        const n = t.contentQueries;
        if (null !== n)
          for (let r = 0; r < n.length; r += 2) {
            const i = n[r + 1];
            if (-1 !== i) {
              const s = t.data[i];
              Pc(n[r]), s.contentQueries(2, e[i], i);
            }
          }
      }
      function tl(t, e) {
        return t[wi] ? (t[nm][Jt] = e) : (t[wi] = e), (t[nm] = e), e;
      }
      function Ud(t, e, n) {
        Pc(0);
        const r = Qe(null);
        try {
          e(t, n);
        } finally {
          Qe(r);
        }
      }
      function Uv(t, e) {
        const n = t[ho],
          r = n ? n.get(Vr, null) : null;
        r && r.handleError(e);
      }
      function zd(t, e, n, r, o) {
        for (let i = 0; i < n.length; ) {
          const s = n[i++],
            a = n[i++];
          Lv(t.data[s], e[s], r, a, o);
        }
      }
      function Wn(t, e, n) {
        const r = ma(e, t);
        !(function Dy(t, e, n) {
          t.setValue(e, n);
        })(t[W], r, n);
      }
      function pP(t, e) {
        const n = It(e, t),
          r = n[T];
        !(function gP(t, e) {
          for (let n = e.length; n < t.blueprint.length; n++)
            e.push(t.blueprint[n]);
        })(r, n);
        const o = n[Ue];
        null !== o && null === n[jn] && (n[jn] = av(o, n[ho])), qd(r, n, n[Ne]);
      }
      function qd(t, e, n) {
        Nc(e);
        try {
          const r = t.viewQuery;
          null !== r && Ud(1, r, n);
          const o = t.template;
          null !== o && Ov(t, e, o, 1, n),
            t.firstCreatePass && (t.firstCreatePass = !1),
            t.staticContentQueries && Bv(t, e),
            t.staticViewQueries && Ud(2, t.viewQuery, n);
          const i = t.components;
          null !== i &&
            (function mP(t, e) {
              for (let n = 0; n < e.length; n++) pP(t, e[n]);
            })(e, i);
        } catch (r) {
          throw (
            (t.firstCreatePass &&
              ((t.incompleteFirstPass = !0), (t.firstCreatePass = !1)),
            r)
          );
        } finally {
          (e[G] &= -5), xc();
        }
      }
      let zv = (() => {
        class t {
          constructor() {
            (this.all = new Set()), (this.queue = new Map());
          }
          create(n, r, o) {
            const i = typeof Zone > "u" ? null : Zone.current,
              s = new jT(
                n,
                (u) => {
                  this.all.has(u) && this.queue.set(u, i);
                },
                o
              );
            let a;
            this.all.add(s), s.notify();
            const l = () => {
              s.cleanup(), a?.(), this.all.delete(s), this.queue.delete(s);
            };
            return (a = r?.onDestroy(l)), { destroy: l };
          }
          flush() {
            if (0 !== this.queue.size)
              for (const [n, r] of this.queue)
                this.queue.delete(n), r ? r.run(() => n.run()) : n.run();
          }
          get isQueueEmpty() {
            return 0 === this.queue.size;
          }
        }
        return (
          (t.ɵprov = N({
            token: t,
            providedIn: "root",
            factory: () => new t(),
          })),
          t
        );
      })();
      function nl(t, e, n) {
        let r = n ? t.styles : null,
          o = n ? t.classes : null,
          i = 0;
        if (null !== e)
          for (let s = 0; s < e.length; s++) {
            const a = e[s];
            "number" == typeof a
              ? (i = a)
              : 1 == i
              ? (o = uc(o, a))
              : 2 == i && (r = uc(r, a + ": " + e[++s] + ";"));
          }
        n ? (t.styles = r) : (t.stylesWithoutHost = r),
          n ? (t.classes = o) : (t.classesWithoutHost = o);
      }
      function Qi(t, e, n, r, o = !1) {
        for (; null !== n; ) {
          const i = e[n.index];
          if ((null !== i && r.push(me(i)), _t(i))) {
            for (let a = nt; a < i.length; a++) {
              const l = i[a],
                u = l[T].firstChild;
              null !== u && Qi(l[T], l, u, r);
            }
            i[yn] !== i[Ue] && r.push(i[yn]);
          }
          const s = n.type;
          if (8 & s) Qi(t, e, n.child, r);
          else if (32 & s) {
            const a = Xc(n, e);
            let l;
            for (; (l = a()); ) r.push(l);
          } else if (16 & s) {
            const a = Py(e, n);
            if (Array.isArray(a)) r.push(...a);
            else {
              const l = Ri(e[xe]);
              Qi(l[T], l, a, r, !0);
            }
          }
          n = o ? n.projectionNext : n.next;
        }
        return r;
      }
      function rl(t, e, n, r = !0) {
        const o = e[Ar].rendererFactory;
        o.begin && o.begin();
        try {
          qv(t, e, t.template, n);
        } catch (s) {
          throw (r && Uv(e, s), s);
        } finally {
          o.end && o.end(), e[Ar].effectManager?.flush();
        }
      }
      function qv(t, e, n, r) {
        const o = e[G];
        if (256 != (256 & o)) {
          e[Ar].effectManager?.flush(), Nc(e);
          try {
            _m(e),
              (function Tm(t) {
                return ($.lFrame.bindingIndex = t);
              })(t.bindingStartIndex),
              null !== n && Ov(t, e, n, 2, r);
            const s = 3 == (3 & o);
            if (s) {
              const u = t.preOrderCheckHooks;
              null !== u && _a(e, u, null);
            } else {
              const u = t.preOrderHooks;
              null !== u && Ca(e, u, 0, null), Rc(e, 0);
            }
            if (
              ((function DP(t) {
                for (let e = vy(t); null !== e; e = _y(e)) {
                  if (!e[om]) continue;
                  const n = e[mo];
                  for (let r = 0; r < n.length; r++) {
                    XT(n[r]);
                  }
                }
              })(e),
              Gv(e, 2),
              null !== t.contentQueries && Bv(t, e),
              s)
            ) {
              const u = t.contentCheckHooks;
              null !== u && _a(e, u);
            } else {
              const u = t.contentHooks;
              null !== u && Ca(e, u, 1), Rc(e, 1);
            }
            !(function zO(t, e) {
              const n = t.hostBindingOpCodes;
              if (null === n) return;
              const r = Dv(e, ca);
              try {
                for (let o = 0; o < n.length; o++) {
                  const i = n[o];
                  if (i < 0) xr(~i);
                  else {
                    const s = i,
                      a = n[++o],
                      l = n[++o];
                    cA(a, s), r.runInContext(l, 2, e[s]);
                  }
                }
              } finally {
                null === e[ca] && wv(e, ca), xr(-1);
              }
            })(t, e);
            const a = t.components;
            null !== a && Kv(e, a, 0);
            const l = t.viewQuery;
            if ((null !== l && Ud(2, l, r), s)) {
              const u = t.viewCheckHooks;
              null !== u && _a(e, u);
            } else {
              const u = t.viewHooks;
              null !== u && Ca(e, u, 2), Rc(e, 2);
            }
            !0 === t.firstUpdatePass && (t.firstUpdatePass = !1),
              (e[G] &= -73),
              Cm(e);
          } finally {
            xc();
          }
        }
      }
      function Gv(t, e) {
        for (let n = vy(t); null !== n; n = _y(n))
          for (let r = nt; r < n.length; r++) Wv(n[r], e);
      }
      function wP(t, e, n) {
        Wv(It(e, t), n);
      }
      function Wv(t, e) {
        if (
          !(function ZT(t) {
            return 128 == (128 & t[G]);
          })(t)
        )
          return;
        const n = t[T];
        if ((80 & t[G] && 0 === e) || 1024 & t[G] || 2 === e)
          qv(n, t, n.template, t[Ne]);
        else if (t[Di] > 0) {
          Gv(t, 1);
          const o = t[T].components;
          null !== o && Kv(t, o, 1);
        }
      }
      function Kv(t, e, n) {
        for (let r = 0; r < e.length; r++) wP(t, e[r], n);
      }
      class Zi {
        get rootNodes() {
          const e = this._lView,
            n = e[T];
          return Qi(n, e, n.firstChild, []);
        }
        constructor(e, n) {
          (this._lView = e),
            (this._cdRefInjectingView = n),
            (this._appRef = null),
            (this._attachedToViewContainer = !1);
        }
        get context() {
          return this._lView[Ne];
        }
        set context(e) {
          this._lView[Ne] = e;
        }
        get destroyed() {
          return 256 == (256 & this._lView[G]);
        }
        destroy() {
          if (this._appRef) this._appRef.detachView(this);
          else if (this._attachedToViewContainer) {
            const e = this._lView[De];
            if (_t(e)) {
              const n = e[8],
                r = n ? n.indexOf(this) : -1;
              r > -1 && (ed(e, r), Ta(n, r));
            }
            this._attachedToViewContainer = !1;
          }
          by(this._lView[T], this._lView);
        }
        onDestroy(e) {
          !(function wm(t, e) {
            if (256 == (256 & t[G])) throw new v(911, !1);
            null === t[ur] && (t[ur] = []), t[ur].push(e);
          })(this._lView, e);
        }
        markForCheck() {
          Wi(this._cdRefInjectingView || this._lView);
        }
        detach() {
          this._lView[G] &= -129;
        }
        reattach() {
          this._lView[G] |= 128;
        }
        detectChanges() {
          rl(this._lView[T], this._lView, this.context);
        }
        checkNoChanges() {}
        attachToViewContainerRef() {
          if (this._appRef) throw new v(902, !1);
          this._attachedToViewContainer = !0;
        }
        detachFromAppRef() {
          (this._appRef = null),
            (function DI(t, e) {
              ki(t, e, e[W], 2, null, null);
            })(this._lView[T], this._lView);
        }
        attachToAppRef(e) {
          if (this._attachedToViewContainer) throw new v(902, !1);
          this._appRef = e;
        }
      }
      class bP extends Zi {
        constructor(e) {
          super(e), (this._view = e);
        }
        detectChanges() {
          const e = this._view;
          rl(e[T], e, e[Ne], !1);
        }
        checkNoChanges() {}
        get context() {
          return null;
        }
      }
      class Qv extends Ya {
        constructor(e) {
          super(), (this.ngModule = e);
        }
        resolveComponentFactory(e) {
          const n = ie(e);
          return new Yi(n, this.ngModule);
        }
      }
      function Zv(t) {
        const e = [];
        for (let n in t)
          t.hasOwnProperty(n) && e.push({ propName: t[n], templateName: n });
        return e;
      }
      class SP {
        constructor(e, n) {
          (this.injector = e), (this.parentInjector = n);
        }
        get(e, n, r) {
          r = sa(r);
          const o = this.injector.get(e, xd, r);
          return o !== xd || n === xd ? o : this.parentInjector.get(e, n, r);
        }
      }
      class Yi extends cv {
        get inputs() {
          return Zv(this.componentDef.inputs);
        }
        get outputs() {
          return Zv(this.componentDef.outputs);
        }
        constructor(e, n) {
          super(),
            (this.componentDef = e),
            (this.ngModule = n),
            (this.componentType = e.type),
            (this.selector = (function wT(t) {
              return t.map(DT).join(",");
            })(e.selectors)),
            (this.ngContentSelectors = e.ngContentSelectors
              ? e.ngContentSelectors
              : []),
            (this.isBoundToModule = !!n);
        }
        create(e, n, r, o) {
          let i = (o = o || this.ngModule) instanceof wn ? o : o?.injector;
          i &&
            null !== this.componentDef.getStandaloneInjector &&
            (i = this.componentDef.getStandaloneInjector(i) || i);
          const s = i ? new SP(e, i) : e,
            a = s.get(qi, null);
          if (null === a) throw new v(407, !1);
          const c = {
              rendererFactory: a,
              sanitizer: s.get(IO, null),
              effectManager: s.get(zv, null),
            },
            d = a.createRenderer(null, this.componentDef),
            f = this.componentDef.selectors[0][0] || "div",
            h = r
              ? (function GO(t, e, n, r) {
                  const i = r.get(pv, !1) || n === mt.ShadowDom,
                    s = t.selectRootElement(e, i);
                  return (
                    (function WO(t) {
                      Nv(t);
                    })(s),
                    s
                  );
                })(d, r, this.componentDef.encapsulation, s)
              : La(
                  d,
                  f,
                  (function EP(t) {
                    const e = t.toLowerCase();
                    return "svg" === e ? "svg" : "math" === e ? "math" : null;
                  })(f)
                ),
            y = this.componentDef.signals
              ? 4608
              : this.componentDef.onPush
              ? 576
              : 528,
            _ = Bd(0, null, null, 1, 0, null, null, null, null, null, null),
            m = el(null, _, null, y, null, null, c, d, s, null, null);
          let E, P;
          Nc(m);
          try {
            const R = this.componentDef;
            let le,
              Be = null;
            R.findHostDirectiveDefs
              ? ((le = []),
                (Be = new Map()),
                R.findHostDirectiveDefs(R, le, Be),
                le.push(R))
              : (le = [R]);
            const dn = (function TP(t, e) {
                const n = t[T],
                  r = J;
                return (t[r] = e), Ro(n, r, 2, "#host", null);
              })(m, h),
              fn = (function AP(t, e, n, r, o, i, s) {
                const a = o[T];
                !(function IP(t, e, n, r) {
                  for (const o of t)
                    e.mergedAttrs = Ci(e.mergedAttrs, o.hostAttrs);
                  null !== e.mergedAttrs &&
                    (nl(e, e.mergedAttrs, !0), null !== n && Fy(r, n, e));
                })(r, t, e, s);
                let l = null;
                null !== e && (l = av(e, o[ho]));
                const u = i.rendererFactory.createRenderer(e, n);
                let c = 16;
                n.signals ? (c = 4096) : n.onPush && (c = 64);
                const d = el(
                  o,
                  Pv(n),
                  null,
                  c,
                  o[t.index],
                  t,
                  i,
                  u,
                  null,
                  null,
                  l
                );
                return (
                  a.firstCreatePass && jd(a, t, r.length - 1),
                  tl(o, d),
                  (o[t.index] = d)
                );
              })(dn, h, R, le, m, c, d);
            (P = vm(_, J)),
              h &&
                (function PP(t, e, n, r) {
                  if (r) vc(t, n, ["ng-version", OO.full]);
                  else {
                    const { attrs: o, classes: i } = (function bT(t) {
                      const e = [],
                        n = [];
                      let r = 1,
                        o = 2;
                      for (; r < t.length; ) {
                        let i = t[r];
                        if ("string" == typeof i)
                          2 === o
                            ? "" !== i && e.push(i, t[++r])
                            : 8 === o && n.push(i);
                        else {
                          if (!Yt(o)) break;
                          o = i;
                        }
                        r++;
                      }
                      return { attrs: e, classes: n };
                    })(e.selectors[0]);
                    o && vc(t, n, o),
                      i && i.length > 0 && Ry(t, n, i.join(" "));
                  }
                })(d, R, h, r),
              void 0 !== n &&
                (function NP(t, e, n) {
                  const r = (t.projection = []);
                  for (let o = 0; o < e.length; o++) {
                    const i = n[o];
                    r.push(null != i ? Array.from(i) : null);
                  }
                })(P, this.ngContentSelectors, n),
              (E = (function OP(t, e, n, r, o, i) {
                const s = Ye(),
                  a = o[T],
                  l = Ct(s, o);
                Fv(a, o, s, n, null, r);
                for (let c = 0; c < n.length; c++)
                  rt(Rr(o, a, s.directiveStart + c, s), o);
                kv(a, o, s), l && rt(l, o);
                const u = Rr(o, a, s.directiveStart + s.componentOffset, s);
                if (((t[Ne] = o[Ne] = u), null !== i))
                  for (const c of i) c(u, e);
                return kd(a, s, t), u;
              })(fn, R, le, Be, m, [xP])),
              qd(_, m, null);
          } finally {
            xc();
          }
          return new MP(this.componentType, E, No(P, m), m, P);
        }
      }
      class MP extends bO {
        constructor(e, n, r, o, i) {
          super(),
            (this.location = r),
            (this._rootLView = o),
            (this._tNode = i),
            (this.previousInputValues = null),
            (this.instance = n),
            (this.hostView = this.changeDetectorRef = new bP(o)),
            (this.componentType = e);
        }
        setInput(e, n) {
          const r = this._tNode.inputs;
          let o;
          if (null !== r && (o = r[e])) {
            if (
              ((this.previousInputValues ??= new Map()),
              this.previousInputValues.has(e) &&
                Object.is(this.previousInputValues.get(e), n))
            )
              return;
            const i = this._rootLView;
            zd(i[T], i, o, e, n),
              this.previousInputValues.set(e, n),
              Wi(It(this._tNode.index, i));
          }
        }
        get injector() {
          return new Do(this._tNode, this._rootLView);
        }
        destroy() {
          this.hostView.destroy();
        }
        onDestroy(e) {
          this.hostView.onDestroy(e);
        }
      }
      function xP() {
        const t = Ye();
        va(w()[T], t);
      }
      function ce(t) {
        let e = (function Yv(t) {
            return Object.getPrototypeOf(t.prototype).constructor;
          })(t.type),
          n = !0;
        const r = [t];
        for (; e; ) {
          let o;
          if (en(t)) o = e.ɵcmp || e.ɵdir;
          else {
            if (e.ɵcmp) throw new v(903, !1);
            o = e.ɵdir;
          }
          if (o) {
            if (n) {
              r.push(o);
              const s = t;
              (s.inputs = ol(t.inputs)),
                (s.inputTransforms = ol(t.inputTransforms)),
                (s.declaredInputs = ol(t.declaredInputs)),
                (s.outputs = ol(t.outputs));
              const a = o.hostBindings;
              a && LP(t, a);
              const l = o.viewQuery,
                u = o.contentQueries;
              if (
                (l && FP(t, l),
                u && kP(t, u),
                ea(t.inputs, o.inputs),
                ea(t.declaredInputs, o.declaredInputs),
                ea(t.outputs, o.outputs),
                null !== o.inputTransforms &&
                  (null === s.inputTransforms && (s.inputTransforms = {}),
                  ea(s.inputTransforms, o.inputTransforms)),
                en(o) && o.data.animation)
              ) {
                const c = t.data;
                c.animation = (c.animation || []).concat(o.data.animation);
              }
            }
            const i = o.features;
            if (i)
              for (let s = 0; s < i.length; s++) {
                const a = i[s];
                a && a.ngInherit && a(t), a === ce && (n = !1);
              }
          }
          e = Object.getPrototypeOf(e);
        }
        !(function RP(t) {
          let e = 0,
            n = null;
          for (let r = t.length - 1; r >= 0; r--) {
            const o = t[r];
            (o.hostVars = e += o.hostVars),
              (o.hostAttrs = Ci(o.hostAttrs, (n = Ci(n, o.hostAttrs))));
          }
        })(r);
      }
      function ol(t) {
        return t === gn ? {} : t === re ? [] : t;
      }
      function FP(t, e) {
        const n = t.viewQuery;
        t.viewQuery = n
          ? (r, o) => {
              e(r, o), n(r, o);
            }
          : e;
      }
      function kP(t, e) {
        const n = t.contentQueries;
        t.contentQueries = n
          ? (r, o, i) => {
              e(r, o, i), n(r, o, i);
            }
          : e;
      }
      function LP(t, e) {
        const n = t.hostBindings;
        t.hostBindings = n
          ? (r, o) => {
              e(r, o), n(r, o);
            }
          : e;
      }
      function t_(t) {
        const e = t.inputConfig,
          n = {};
        for (const r in e)
          if (e.hasOwnProperty(r)) {
            const o = e[r];
            Array.isArray(o) && o[2] && (n[r] = o[2]);
          }
        t.inputTransforms = n;
      }
      function il(t) {
        return (
          !!(function Gd(t) {
            return (
              null !== t && ("function" == typeof t || "object" == typeof t)
            );
          })(t) &&
          (Array.isArray(t) || (!(t instanceof Map) && Symbol.iterator in t))
        );
      }
      function ot(t, e, n) {
        return !Object.is(t[e], n) && ((t[e] = n), !0);
      }
      function Br(t, e, n, r) {
        const o = ot(t, e, n);
        return ot(t, e + 1, r) || o;
      }
      function Mn(t, e, n, r) {
        const o = w();
        return ot(o, _o(), e) && (ee(), En(we(), o, t, e, n, r)), Mn;
      }
      function Lo(t, e, n, r, o, i) {
        const a = Br(
          t,
          (function $n() {
            return $.lFrame.bindingIndex;
          })(),
          n,
          o
        );
        return Un(2), a ? e + q(n) + r + q(o) + i : K;
      }
      function Se(t, e, n, r, o, i, s, a) {
        const l = w(),
          u = ee(),
          c = t + J,
          d = u.firstCreatePass
            ? (function lN(t, e, n, r, o, i, s, a, l) {
                const u = e.consts,
                  c = Ro(e, t, 4, s || null, cr(u, a));
                Hd(e, n, c, cr(u, l)), va(e, c);
                const d = (c.tView = Bd(
                  2,
                  c,
                  r,
                  o,
                  i,
                  e.directiveRegistry,
                  e.pipeRegistry,
                  null,
                  e.schemas,
                  u,
                  null
                ));
                return (
                  null !== e.queries &&
                    (e.queries.template(e, c),
                    (d.queries = e.queries.embeddedTView(c))),
                  c
                );
              })(c, u, l, e, n, r, o, i, s)
            : u.data[c];
        Cn(d, !1);
        const f = p_(u, l, d, t);
        ya() && Ba(u, l, f, d),
          rt(f, l),
          tl(l, (l[c] = Vv(f, l, f, d))),
          fa(d) && Ld(u, l, d),
          null != s && Vd(l, d, a);
      }
      let p_ = function g_(t, e, n, r) {
        return dr(!0), e[W].createComment("");
      };
      function fe(t, e, n) {
        const r = w();
        return (
          ot(r, _o(), e) &&
            (function Nt(t, e, n, r, o, i, s, a) {
              const l = Ct(e, n);
              let c,
                u = e.inputs;
              !a && null != u && (c = u[r])
                ? (zd(t, n, c, r, o),
                  Ir(e) &&
                    (function eP(t, e) {
                      const n = It(e, t);
                      16 & n[G] || (n[G] |= 64);
                    })(n, e.index))
                : 3 & e.type &&
                  ((r = (function JO(t) {
                    return "class" === t
                      ? "className"
                      : "for" === t
                      ? "htmlFor"
                      : "formaction" === t
                      ? "formAction"
                      : "innerHtml" === t
                      ? "innerHTML"
                      : "readonly" === t
                      ? "readOnly"
                      : "tabindex" === t
                      ? "tabIndex"
                      : t;
                  })(r)),
                  (o = null != s ? s(o, e.value || "", r) : o),
                  i.setProperty(l, r, o));
            })(ee(), we(), r, t, e, r[W], n, !1),
          fe
        );
      }
      function Xd(t, e, n, r, o) {
        const s = o ? "class" : "style";
        zd(t, n, e.inputs[s], s, r);
      }
      function D(t, e, n, r) {
        const o = w(),
          i = ee(),
          s = J + t,
          a = o[W],
          l = i.firstCreatePass
            ? (function hN(t, e, n, r, o, i) {
                const s = e.consts,
                  l = Ro(e, t, 2, r, cr(s, o));
                return (
                  Hd(e, n, l, cr(s, i)),
                  null !== l.attrs && nl(l, l.attrs, !1),
                  null !== l.mergedAttrs && nl(l, l.mergedAttrs, !0),
                  null !== e.queries && e.queries.elementStart(e, l),
                  l
                );
              })(s, i, o, e, n, r)
            : i.data[s],
          u = m_(i, o, l, a, e, t);
        o[s] = u;
        const c = fa(l);
        return (
          Cn(l, !0),
          Fy(a, u, l),
          32 != (32 & l.flags) && ya() && Ba(i, o, u, l),
          0 ===
            (function eA() {
              return $.lFrame.elementDepthCount;
            })() && rt(u, o),
          (function tA() {
            $.lFrame.elementDepthCount++;
          })(),
          c && (Ld(i, o, l), kd(i, l, o)),
          null !== r && Vd(o, l),
          D
        );
      }
      function b() {
        let t = Ye();
        Tc()
          ? (function Ac() {
              $.lFrame.isParent = !1;
            })()
          : ((t = t.parent), Cn(t, !1));
        const e = t;
        (function rA(t) {
          return $.skipHydrationRootTNode === t;
        })(e) &&
          (function aA() {
            $.skipHydrationRootTNode = null;
          })(),
          (function nA() {
            $.lFrame.elementDepthCount--;
          })();
        const n = ee();
        return (
          n.firstCreatePass && (va(n, t), Cc(t) && n.queries.elementEnd(t)),
          null != e.classesWithoutHost &&
            (function wA(t) {
              return 0 != (8 & t.flags);
            })(e) &&
            Xd(n, e, w(), e.classesWithoutHost, !0),
          null != e.stylesWithoutHost &&
            (function bA(t) {
              return 0 != (16 & t.flags);
            })(e) &&
            Xd(n, e, w(), e.stylesWithoutHost, !1),
          b
        );
      }
      function Ae(t, e, n, r) {
        return D(t, e, n, r), b(), Ae;
      }
      let m_ = (t, e, n, r, o, i) => (
        dr(!0),
        La(
          r,
          o,
          (function Fm() {
            return $.lFrame.currentNamespace;
          })()
        )
      );
      function ns() {
        return w();
      }
      function rs(t) {
        return !!t && "function" == typeof t.then;
      }
      function __(t) {
        return !!t && "function" == typeof t.subscribe;
      }
      function Ie(t, e, n, r) {
        const o = w(),
          i = ee(),
          s = Ye();
        return (
          (function D_(t, e, n, r, o, i, s) {
            const a = fa(r),
              u =
                t.firstCreatePass &&
                (function jv(t) {
                  return t.cleanup || (t.cleanup = []);
                })(t),
              c = e[Ne],
              d = (function Hv(t) {
                return t[fo] || (t[fo] = []);
              })(e);
            let f = !0;
            if (3 & r.type || s) {
              const g = Ct(r, e),
                y = s ? s(g) : g,
                _ = d.length,
                m = s ? (P) => s(me(P[r.index])) : r.index;
              let E = null;
              if (
                (!s &&
                  a &&
                  (E = (function _N(t, e, n, r) {
                    const o = t.cleanup;
                    if (null != o)
                      for (let i = 0; i < o.length - 1; i += 2) {
                        const s = o[i];
                        if (s === n && o[i + 1] === r) {
                          const a = e[fo],
                            l = o[i + 2];
                          return a.length > l ? a[l] : null;
                        }
                        "string" == typeof s && (i += 2);
                      }
                    return null;
                  })(t, e, o, r.index)),
                null !== E)
              )
                ((E.__ngLastListenerFn__ || E).__ngNextListenerFn__ = i),
                  (E.__ngLastListenerFn__ = i),
                  (f = !1);
              else {
                i = b_(r, e, c, i, !1);
                const P = n.listen(y, o, i);
                d.push(i, P), u && u.push(o, m, _, _ + 1);
              }
            } else i = b_(r, e, c, i, !1);
            const h = r.outputs;
            let p;
            if (f && null !== h && (p = h[o])) {
              const g = p.length;
              if (g)
                for (let y = 0; y < g; y += 2) {
                  const R = e[p[y]][p[y + 1]].subscribe(i),
                    le = d.length;
                  d.push(i, R), u && u.push(o, r.index, le, -(le + 1));
                }
            }
          })(i, o, o[W], s, t, e, r),
          Ie
        );
      }
      function w_(t, e, n, r) {
        try {
          return _n(6, e, n), !1 !== n(r);
        } catch (o) {
          return Uv(t, o), !1;
        } finally {
          _n(7, e, n);
        }
      }
      function b_(t, e, n, r, o) {
        return function i(s) {
          if (s === Function) return r;
          Wi(t.componentOffset > -1 ? It(t.index, e) : e);
          let l = w_(e, n, r, s),
            u = i.__ngNextListenerFn__;
          for (; u; ) (l = w_(e, n, u, s) && l), (u = u.__ngNextListenerFn__);
          return o && !1 === l && s.preventDefault(), l;
        };
      }
      function xt(t = 1) {
        return (function hA(t) {
          return ($.lFrame.contextLView = (function pA(t, e) {
            for (; t > 0; ) (e = e[po]), t--;
            return e;
          })(t, $.lFrame.contextLView))[Ne];
        })(t);
      }
      function cl(t, e) {
        return (t << 17) | (e << 2);
      }
      function hr(t) {
        return (t >> 17) & 32767;
      }
      function nf(t) {
        return 2 | t;
      }
      function Hr(t) {
        return (131068 & t) >> 2;
      }
      function rf(t, e) {
        return (-131069 & t) | (e << 2);
      }
      function sf(t) {
        return 1 | t;
      }
      function x_(t, e, n, r, o) {
        const i = t[n + 1],
          s = null === e;
        let a = r ? hr(i) : Hr(i),
          l = !1;
        for (; 0 !== a && (!1 === l || s); ) {
          const c = t[a + 1];
          AN(t[a], e) && ((l = !0), (t[a + 1] = r ? sf(c) : nf(c))),
            (a = r ? hr(c) : Hr(c));
        }
        l && (t[n + 1] = r ? nf(i) : sf(i));
      }
      function AN(t, e) {
        return (
          null === t ||
          null == e ||
          (Array.isArray(t) ? t[1] : t) === e ||
          (!(!Array.isArray(t) || "string" != typeof e) && Mo(t, e) >= 0)
        );
      }
      function dl(t, e) {
        return (
          (function tn(t, e, n, r) {
            const o = w(),
              i = ee(),
              s = Un(2);
            i.firstUpdatePass &&
              (function $_(t, e, n, r) {
                const o = t.data;
                if (null === o[n + 1]) {
                  const i = o[lt()],
                    s = (function j_(t, e) {
                      return e >= t.expandoStartIndex;
                    })(t, n);
                  (function G_(t, e) {
                    return 0 != (t.flags & (e ? 8 : 16));
                  })(i, r) &&
                    null === e &&
                    !s &&
                    (e = !1),
                    (e = (function LN(t, e, n, r) {
                      const o = (function Oc(t) {
                        const e = $.lFrame.currentDirectiveIndex;
                        return -1 === e ? null : t[e];
                      })(t);
                      let i = r ? e.residualClasses : e.residualStyles;
                      if (null === o)
                        0 === (r ? e.classBindings : e.styleBindings) &&
                          ((n = os((n = af(null, t, e, n, r)), e.attrs, r)),
                          (i = null));
                      else {
                        const s = e.directiveStylingLast;
                        if (-1 === s || t[s] !== o)
                          if (((n = af(o, t, e, n, r)), null === i)) {
                            let l = (function VN(t, e, n) {
                              const r = n ? e.classBindings : e.styleBindings;
                              if (0 !== Hr(r)) return t[hr(r)];
                            })(t, e, r);
                            void 0 !== l &&
                              Array.isArray(l) &&
                              ((l = af(null, t, e, l[1], r)),
                              (l = os(l, e.attrs, r)),
                              (function BN(t, e, n, r) {
                                t[hr(n ? e.classBindings : e.styleBindings)] =
                                  r;
                              })(t, e, r, l));
                          } else
                            i = (function HN(t, e, n) {
                              let r;
                              const o = e.directiveEnd;
                              for (
                                let i = 1 + e.directiveStylingLast;
                                i < o;
                                i++
                              )
                                r = os(r, t[i].hostAttrs, n);
                              return os(r, e.attrs, n);
                            })(t, e, r);
                      }
                      return (
                        void 0 !== i &&
                          (r
                            ? (e.residualClasses = i)
                            : (e.residualStyles = i)),
                        n
                      );
                    })(o, i, e, r)),
                    (function MN(t, e, n, r, o, i) {
                      let s = i ? e.classBindings : e.styleBindings,
                        a = hr(s),
                        l = Hr(s);
                      t[r] = n;
                      let c,
                        u = !1;
                      if (
                        (Array.isArray(n)
                          ? ((c = n[1]),
                            (null === c || Mo(n, c) > 0) && (u = !0))
                          : (c = n),
                        o)
                      )
                        if (0 !== l) {
                          const f = hr(t[a + 1]);
                          (t[r + 1] = cl(f, a)),
                            0 !== f && (t[f + 1] = rf(t[f + 1], r)),
                            (t[a + 1] = (function EN(t, e) {
                              return (131071 & t) | (e << 17);
                            })(t[a + 1], r));
                        } else
                          (t[r + 1] = cl(a, 0)),
                            0 !== a && (t[a + 1] = rf(t[a + 1], r)),
                            (a = r);
                      else
                        (t[r + 1] = cl(l, 0)),
                          0 === a ? (a = r) : (t[l + 1] = rf(t[l + 1], r)),
                          (l = r);
                      u && (t[r + 1] = nf(t[r + 1])),
                        x_(t, c, r, !0),
                        x_(t, c, r, !1),
                        (function TN(t, e, n, r, o) {
                          const i = o ? t.residualClasses : t.residualStyles;
                          null != i &&
                            "string" == typeof e &&
                            Mo(i, e) >= 0 &&
                            (n[r + 1] = sf(n[r + 1]));
                        })(e, c, t, r, i),
                        (s = cl(a, l)),
                        i ? (e.classBindings = s) : (e.styleBindings = s);
                    })(o, i, e, n, s, r);
                }
              })(i, t, s, r),
              e !== K &&
                ot(o, s, e) &&
                (function z_(t, e, n, r, o, i, s, a) {
                  if (!(3 & e.type)) return;
                  const l = t.data,
                    u = l[a + 1],
                    c = (function SN(t) {
                      return 1 == (1 & t);
                    })(u)
                      ? q_(l, e, n, o, Hr(u), s)
                      : void 0;
                  fl(c) ||
                    (fl(i) ||
                      ((function bN(t) {
                        return 2 == (2 & t);
                      })(u) &&
                        (i = q_(l, null, n, o, a, s))),
                    (function PI(t, e, n, r, o) {
                      if (e) o ? t.addClass(n, r) : t.removeClass(n, r);
                      else {
                        let i = -1 === r.indexOf("-") ? void 0 : Dt.DashCase;
                        null == o
                          ? t.removeStyle(n, r, i)
                          : ("string" == typeof o &&
                              o.endsWith("!important") &&
                              ((o = o.slice(0, -10)), (i |= Dt.Important)),
                            t.setStyle(n, r, o, i));
                      }
                    })(r, s, ma(lt(), n), o, i));
                })(
                  i,
                  i.data[lt()],
                  o,
                  o[W],
                  t,
                  (o[s + 1] = (function zN(t, e) {
                    return (
                      null == t ||
                        "" === t ||
                        ("string" == typeof e
                          ? (t += e)
                          : "object" == typeof t && (t = $e(fr(t)))),
                      t
                    );
                  })(e, n)),
                  r,
                  s
                );
          })(t, e, null, !0),
          dl
        );
      }
      function af(t, e, n, r, o) {
        let i = null;
        const s = n.directiveEnd;
        let a = n.directiveStylingLast;
        for (
          -1 === a ? (a = n.directiveStart) : a++;
          a < s && ((i = e[a]), (r = os(r, i.hostAttrs, o)), i !== t);

        )
          a++;
        return null !== t && (n.directiveStylingLast = a), r;
      }
      function os(t, e, n) {
        const r = n ? 1 : 2;
        let o = -1;
        if (null !== e)
          for (let i = 0; i < e.length; i++) {
            const s = e[i];
            "number" == typeof s
              ? (o = s)
              : o === r &&
                (Array.isArray(t) || (t = void 0 === t ? [] : ["", t]),
                Ot(t, s, !!n || e[++i]));
          }
        return void 0 === t ? null : t;
      }
      function q_(t, e, n, r, o, i) {
        const s = null === e;
        let a;
        for (; o > 0; ) {
          const l = t[o],
            u = Array.isArray(l),
            c = u ? l[1] : l,
            d = null === c;
          let f = n[o + 1];
          f === K && (f = d ? re : void 0);
          let h = d ? $c(f, r) : c === r ? f : void 0;
          if ((u && !fl(h) && (h = $c(l, r)), fl(h) && ((a = h), s))) return a;
          const p = t[o + 1];
          o = s ? hr(p) : Hr(p);
        }
        if (null !== e) {
          let l = i ? e.residualClasses : e.residualStyles;
          null != l && (a = $c(l, r));
        }
        return a;
      }
      function fl(t) {
        return void 0 !== t;
      }
      function S(t, e = "") {
        const n = w(),
          r = ee(),
          o = t + J,
          i = r.firstCreatePass ? Ro(r, o, 1, e, null) : r.data[o],
          s = W_(r, n, i, e, t);
        (n[o] = s), ya() && Ba(r, n, s, i), Cn(i, !1);
      }
      let W_ = (t, e, n, r, o) => (
        dr(!0),
        (function ka(t, e) {
          return t.createText(e);
        })(e[W], r)
      );
      function In(t) {
        return Kn("", t, ""), In;
      }
      function Kn(t, e, n) {
        const r = w(),
          o = (function ko(t, e, n, r) {
            return ot(t, _o(), n) ? e + q(n) + r : K;
          })(r, t, e, n);
        return o !== K && Wn(r, lt(), o), Kn;
      }
      function qo(t, e, n, r, o) {
        const i = w(),
          s = Lo(i, t, e, n, r, o);
        return s !== K && Wn(i, lt(), s), qo;
      }
      const jr = void 0;
      var fx = [
        "en",
        [["a", "p"], ["AM", "PM"], jr],
        [["AM", "PM"], jr, jr],
        [
          ["S", "M", "T", "W", "T", "F", "S"],
          ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
          [
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
          ],
          ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
        ],
        jr,
        [
          ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"],
          [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ],
          [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
          ],
        ],
        jr,
        [
          ["B", "A"],
          ["BC", "AD"],
          ["Before Christ", "Anno Domini"],
        ],
        0,
        [6, 0],
        ["M/d/yy", "MMM d, y", "MMMM d, y", "EEEE, MMMM d, y"],
        ["h:mm a", "h:mm:ss a", "h:mm:ss a z", "h:mm:ss a zzzz"],
        ["{1}, {0}", jr, "{1} 'at' {0}", jr],
        [
          ".",
          ",",
          ";",
          "%",
          "+",
          "-",
          "E",
          "\xd7",
          "\u2030",
          "\u221e",
          "NaN",
          ":",
        ],
        ["#,##0.###", "#,##0%", "\xa4#,##0.00", "#E0"],
        "USD",
        "$",
        "US Dollar",
        {},
        "ltr",
        function dx(t) {
          const n = Math.floor(Math.abs(t)),
            r = t.toString().replace(/^[^.]*\.?/, "").length;
          return 1 === n && 0 === r ? 1 : 5;
        },
      ];
      let Go = {};
      function ut(t) {
        const e = (function hx(t) {
          return t.toLowerCase().replace(/_/g, "-");
        })(t);
        let n = hC(e);
        if (n) return n;
        const r = e.split("-")[0];
        if (((n = hC(r)), n)) return n;
        if ("en" === r) return fx;
        throw new v(701, !1);
      }
      function hC(t) {
        return (
          t in Go ||
            (Go[t] =
              pe.ng &&
              pe.ng.common &&
              pe.ng.common.locales &&
              pe.ng.common.locales[t]),
          Go[t]
        );
      }
      var M = (() => (
        ((M = M || {})[(M.LocaleId = 0)] = "LocaleId"),
        (M[(M.DayPeriodsFormat = 1)] = "DayPeriodsFormat"),
        (M[(M.DayPeriodsStandalone = 2)] = "DayPeriodsStandalone"),
        (M[(M.DaysFormat = 3)] = "DaysFormat"),
        (M[(M.DaysStandalone = 4)] = "DaysStandalone"),
        (M[(M.MonthsFormat = 5)] = "MonthsFormat"),
        (M[(M.MonthsStandalone = 6)] = "MonthsStandalone"),
        (M[(M.Eras = 7)] = "Eras"),
        (M[(M.FirstDayOfWeek = 8)] = "FirstDayOfWeek"),
        (M[(M.WeekendRange = 9)] = "WeekendRange"),
        (M[(M.DateFormat = 10)] = "DateFormat"),
        (M[(M.TimeFormat = 11)] = "TimeFormat"),
        (M[(M.DateTimeFormat = 12)] = "DateTimeFormat"),
        (M[(M.NumberSymbols = 13)] = "NumberSymbols"),
        (M[(M.NumberFormats = 14)] = "NumberFormats"),
        (M[(M.CurrencyCode = 15)] = "CurrencyCode"),
        (M[(M.CurrencySymbol = 16)] = "CurrencySymbol"),
        (M[(M.CurrencyName = 17)] = "CurrencyName"),
        (M[(M.Currencies = 18)] = "Currencies"),
        (M[(M.Directionality = 19)] = "Directionality"),
        (M[(M.PluralCase = 20)] = "PluralCase"),
        (M[(M.ExtraData = 21)] = "ExtraData"),
        M
      ))();
      const Wo = "en-US";
      let pC = Wo;
      function cf(t, e, n, r, o) {
        if (((t = z(t)), Array.isArray(t)))
          for (let i = 0; i < t.length; i++) cf(t[i], e, n, r, o);
        else {
          const i = ee(),
            s = w();
          let a = kr(t) ? t : z(t.provide),
            l = tv(t);
          const u = Ye(),
            c = 1048575 & u.providerIndexes,
            d = u.directiveStart,
            f = u.providerIndexes >> 20;
          if (kr(t) || !t.multi) {
            const h = new Ti(l, o, C),
              p = ff(a, e, o ? c : c + f, d);
            -1 === p
              ? (Bc(Ea(u, s), i, a),
                df(i, t, e.length),
                e.push(a),
                u.directiveStart++,
                u.directiveEnd++,
                o && (u.providerIndexes += 1048576),
                n.push(h),
                s.push(h))
              : ((n[p] = h), (s[p] = h));
          } else {
            const h = ff(a, e, c + f, d),
              p = ff(a, e, c, c + f),
              y = p >= 0 && n[p];
            if ((o && !y) || (!o && !(h >= 0 && n[h]))) {
              Bc(Ea(u, s), i, a);
              const _ = (function c1(t, e, n, r, o) {
                const i = new Ti(t, n, C);
                return (
                  (i.multi = []),
                  (i.index = e),
                  (i.componentProviders = 0),
                  BC(i, o, r && !n),
                  i
                );
              })(o ? u1 : l1, n.length, o, r, l);
              !o && y && (n[p].providerFactory = _),
                df(i, t, e.length, 0),
                e.push(a),
                u.directiveStart++,
                u.directiveEnd++,
                o && (u.providerIndexes += 1048576),
                n.push(_),
                s.push(_);
            } else df(i, t, h > -1 ? h : p, BC(n[o ? p : h], l, !o && r));
            !o && r && y && n[p].componentProviders++;
          }
        }
      }
      function df(t, e, n, r) {
        const o = kr(e),
          i = (function aO(t) {
            return !!t.useClass;
          })(e);
        if (o || i) {
          const l = (i ? z(e.useClass) : e).prototype.ngOnDestroy;
          if (l) {
            const u = t.destroyHooks || (t.destroyHooks = []);
            if (!o && e.multi) {
              const c = u.indexOf(n);
              -1 === c ? u.push(n, [r, l]) : u[c + 1].push(r, l);
            } else u.push(n, l);
          }
        }
      }
      function BC(t, e, n) {
        return n && t.componentProviders++, t.multi.push(e) - 1;
      }
      function ff(t, e, n, r) {
        for (let o = n; o < r; o++) if (e[o] === t) return o;
        return -1;
      }
      function l1(t, e, n, r) {
        return hf(this.multi, []);
      }
      function u1(t, e, n, r) {
        const o = this.multi;
        let i;
        if (this.providerFactory) {
          const s = this.providerFactory.componentProviders,
            a = Rr(n, n[T], this.providerFactory.index, r);
          (i = a.slice(0, s)), hf(o, i);
          for (let l = s; l < a.length; l++) i.push(a[l]);
        } else (i = []), hf(o, i);
        return i;
      }
      function hf(t, e) {
        for (let n = 0; n < t.length; n++) e.push((0, t[n])());
        return e;
      }
      function ve(t, e = []) {
        return (n) => {
          n.providersResolver = (r, o) =>
            (function a1(t, e, n) {
              const r = ee();
              if (r.firstCreatePass) {
                const o = en(t);
                cf(n, r.data, r.blueprint, o, !0),
                  cf(e, r.data, r.blueprint, o, !1);
              }
            })(r, o ? o(t) : t, e);
        };
      }
      class Ko {}
      class HC {}
      class pf extends Ko {
        constructor(e, n, r) {
          super(),
            (this._parent = n),
            (this._bootstrapComponents = []),
            (this.destroyCbs = []),
            (this.componentFactoryResolver = new Qv(this));
          const o = Tt(e);
          (this._bootstrapComponents = Gn(o.bootstrap)),
            (this._r3Injector = Av(
              e,
              n,
              [
                { provide: Ko, useValue: this },
                { provide: Ya, useValue: this.componentFactoryResolver },
                ...r,
              ],
              $e(e),
              new Set(["environment"])
            )),
            this._r3Injector.resolveInjectorInitializers(),
            (this.instance = this._r3Injector.get(e));
        }
        get injector() {
          return this._r3Injector;
        }
        destroy() {
          const e = this._r3Injector;
          !e.destroyed && e.destroy(),
            this.destroyCbs.forEach((n) => n()),
            (this.destroyCbs = null);
        }
        onDestroy(e) {
          this.destroyCbs.push(e);
        }
      }
      class gf extends HC {
        constructor(e) {
          super(), (this.moduleType = e);
        }
        create(e) {
          return new pf(this.moduleType, e, []);
        }
      }
      class jC extends Ko {
        constructor(e) {
          super(),
            (this.componentFactoryResolver = new Qv(this)),
            (this.instance = null);
          const n = new Cd(
            [
              ...e.providers,
              { provide: Ko, useValue: this },
              { provide: Ya, useValue: this.componentFactoryResolver },
            ],
            e.parent || qa(),
            e.debugName,
            new Set(["environment"])
          );
          (this.injector = n),
            e.runEnvironmentInitializers && n.resolveInjectorInitializers();
        }
        destroy() {
          this.injector.destroy();
        }
        onDestroy(e) {
          this.injector.onDestroy(e);
        }
      }
      function mf(t, e, n = null) {
        return new jC({
          providers: t,
          parent: e,
          debugName: n,
          runEnvironmentInitializers: !0,
        }).injector;
      }
      let h1 = (() => {
        class t {
          constructor(n) {
            (this._injector = n), (this.cachedInjectors = new Map());
          }
          getOrCreateStandaloneInjector(n) {
            if (!n.standalone) return null;
            if (!this.cachedInjectors.has(n.id)) {
              const r = Yy(0, n.type),
                o =
                  r.length > 0
                    ? mf([r], this._injector, `Standalone[${n.type.name}]`)
                    : null;
              this.cachedInjectors.set(n.id, o);
            }
            return this.cachedInjectors.get(n.id);
          }
          ngOnDestroy() {
            try {
              for (const n of this.cachedInjectors.values())
                null !== n && n.destroy();
            } finally {
              this.cachedInjectors.clear();
            }
          }
        }
        return (
          (t.ɵprov = N({
            token: t,
            providedIn: "environment",
            factory: () => new t(I(wn)),
          })),
          t
        );
      })();
      function $C(t) {
        t.getStandaloneInjector = (e) =>
          e.get(h1).getOrCreateStandaloneInjector(t);
      }
      function ZC(t, e, n, r, o, i, s) {
        const a = e + n;
        return Br(t, a, o, i)
          ? (function Sn(t, e, n) {
              return (t[e] = n);
            })(t, a + 2, s ? r.call(s, o, i) : r(o, i))
          : (function cs(t, e) {
              const n = t[e];
              return n === K ? void 0 : n;
            })(t, a + 2);
      }
      function tD(t, e, n, r) {
        const o = t + J,
          i = w(),
          s = (function yo(t, e) {
            return t[e];
          })(i, o);
        return (function ds(t, e) {
          return t[T].data[e].pure;
        })(i, o)
          ? ZC(
              i,
              (function at() {
                const t = $.lFrame;
                let e = t.bindingRootIndex;
                return (
                  -1 === e &&
                    (e = t.bindingRootIndex = t.tView.bindingStartIndex),
                  e
                );
              })(),
              e,
              s.transform,
              n,
              r,
              s
            )
          : s.transform(n, r);
      }
      function vf(t) {
        return (e) => {
          setTimeout(t, void 0, e);
        };
      }
      const Te = class L1 extends Ln {
        constructor(e = !1) {
          super(), (this.__isAsync = e);
        }
        emit(e) {
          super.next(e);
        }
        subscribe(e, n, r) {
          let o = e,
            i = n || (() => null),
            s = r;
          if (e && "object" == typeof e) {
            const l = e;
            (o = l.next?.bind(l)),
              (i = l.error?.bind(l)),
              (s = l.complete?.bind(l));
          }
          this.__isAsync && ((i = vf(i)), o && (o = vf(o)), s && (s = vf(s)));
          const a = super.subscribe({ next: o, error: i, complete: s });
          return e instanceof Vt && e.add(a), a;
        }
      };
      let Qn = (() => {
        class t {}
        return (t.__NG_ELEMENT_ID__ = j1), t;
      })();
      const B1 = Qn,
        H1 = class extends B1 {
          constructor(e, n, r) {
            super(),
              (this._declarationLView = e),
              (this._declarationTContainer = n),
              (this.elementRef = r);
          }
          get ssrId() {
            return this._declarationTContainer.tView?.ssrId || null;
          }
          createEmbeddedView(e, n) {
            return this.createEmbeddedViewImpl(e, n, null);
          }
          createEmbeddedViewImpl(e, n, r) {
            const s = this._declarationTContainer.tView,
              a = el(
                this._declarationLView,
                s,
                e,
                4096 & this._declarationLView[G] ? 4096 : 16,
                null,
                s.declTNode,
                null,
                null,
                null,
                n || null,
                r || null
              );
            a[bi] = this._declarationLView[this._declarationTContainer.index];
            const u = this._declarationLView[mn];
            return (
              null !== u && (a[mn] = u.createEmbeddedView(s)),
              qd(s, a, e),
              new Zi(a)
            );
          }
        };
      function j1() {
        return (function yl(t, e) {
          return 4 & t.type ? new H1(e, t, No(t, e)) : null;
        })(Ye(), w());
      }
      let rn = (() => {
        class t {}
        return (t.__NG_ELEMENT_ID__ = K1), t;
      })();
      function K1() {
        return (function aD(t, e) {
          let n;
          const r = e[t.index];
          return (
            _t(r)
              ? (n = r)
              : ((n = Vv(r, e, null, t)), (e[t.index] = n), tl(e, n)),
            lD(n, e, t, r),
            new iD(n, t, e)
          );
        })(Ye(), w());
      }
      const Q1 = rn,
        iD = class extends Q1 {
          constructor(e, n, r) {
            super(),
              (this._lContainer = e),
              (this._hostTNode = n),
              (this._hostLView = r);
          }
          get element() {
            return No(this._hostTNode, this._hostLView);
          }
          get injector() {
            return new Do(this._hostTNode, this._hostLView);
          }
          get parentInjector() {
            const e = Vc(this._hostTNode, this._hostLView);
            if (Bm(e)) {
              const n = wa(e, this._hostLView),
                r = Da(e);
              return new Do(n[T].data[r + 8], n);
            }
            return new Do(null, this._hostLView);
          }
          clear() {
            for (; this.length > 0; ) this.remove(this.length - 1);
          }
          get(e) {
            const n = sD(this._lContainer);
            return (null !== n && n[e]) || null;
          }
          get length() {
            return this._lContainer.length - nt;
          }
          createEmbeddedView(e, n, r) {
            let o, i;
            "number" == typeof r
              ? (o = r)
              : null != r && ((o = r.index), (i = r.injector));
            const a = e.createEmbeddedViewImpl(n || {}, i, null);
            return this.insertImpl(a, o, false), a;
          }
          createComponent(e, n, r, o, i) {
            const s =
              e &&
              !(function Ii(t) {
                return "function" == typeof t;
              })(e);
            let a;
            if (s) a = n;
            else {
              const g = n || {};
              (a = g.index),
                (r = g.injector),
                (o = g.projectableNodes),
                (i = g.environmentInjector || g.ngModuleRef);
            }
            const l = s ? e : new Yi(ie(e)),
              u = r || this.parentInjector;
            if (!i && null == l.ngModule) {
              const y = (s ? u : this.parentInjector).get(wn, null);
              y && (i = y);
            }
            ie(l.componentType ?? {});
            const h = l.create(u, o, null, i);
            return this.insertImpl(h.hostView, a, false), h;
          }
          insert(e, n) {
            return this.insertImpl(e, n, !1);
          }
          insertImpl(e, n, r) {
            const o = e._lView,
              i = o[T];
            if (
              (function YT(t) {
                return _t(t[De]);
              })(o)
            ) {
              const l = this.indexOf(e);
              if (-1 !== l) this.detach(l);
              else {
                const u = o[De],
                  c = new iD(u, u[tt], u[De]);
                c.detach(c.indexOf(e));
              }
            }
            const s = this._adjustIndex(n),
              a = this._lContainer;
            if (
              ((function bI(t, e, n, r) {
                const o = nt + r,
                  i = n.length;
                r > 0 && (n[o - 1][Jt] = e),
                  r < i - nt
                    ? ((e[Jt] = n[o]), Ym(n, nt + r, e))
                    : (n.push(e), (e[Jt] = null)),
                  (e[De] = n);
                const s = e[bi];
                null !== s &&
                  n !== s &&
                  (function EI(t, e) {
                    const n = t[mo];
                    e[xe] !== e[De][De][xe] && (t[om] = !0),
                      null === n ? (t[mo] = [e]) : n.push(e);
                  })(s, e);
                const a = e[mn];
                null !== a && a.insertView(t), (e[G] |= 128);
              })(i, o, a, s),
              !r)
            ) {
              const l = od(s, a),
                u = o[W],
                c = Va(u, a[yn]);
              null !== c &&
                (function CI(t, e, n, r, o, i) {
                  (r[Ue] = o), (r[tt] = e), ki(t, r, n, 1, o, i);
                })(i, a[tt], u, o, c, l);
            }
            return e.attachToViewContainerRef(), Ym(Df(a), s, e), e;
          }
          move(e, n) {
            return this.insert(e, n);
          }
          indexOf(e) {
            const n = sD(this._lContainer);
            return null !== n ? n.indexOf(e) : -1;
          }
          remove(e) {
            const n = this._adjustIndex(e, -1),
              r = ed(this._lContainer, n);
            r && (Ta(Df(this._lContainer), n), by(r[T], r));
          }
          detach(e) {
            const n = this._adjustIndex(e, -1),
              r = ed(this._lContainer, n);
            return r && null != Ta(Df(this._lContainer), n) ? new Zi(r) : null;
          }
          _adjustIndex(e, n = 0) {
            return e ?? this.length + n;
          }
        };
      function sD(t) {
        return t[8];
      }
      function Df(t) {
        return t[8] || (t[8] = []);
      }
      let lD = function uD(t, e, n, r) {
        if (t[yn]) return;
        let o;
        (o =
          8 & n.type
            ? me(r)
            : (function Z1(t, e) {
                const n = t[W],
                  r = n.createComment(""),
                  o = Ct(e, t);
                return (
                  Fr(
                    n,
                    Va(n, o),
                    r,
                    (function AI(t, e) {
                      return t.nextSibling(e);
                    })(n, o),
                    !1
                  ),
                  r
                );
              })(e, n)),
          (t[yn] = o);
      };
      const Nf = new O("Application Initializer");
      let xf = (() => {
          class t {
            constructor() {
              (this.initialized = !1),
                (this.done = !1),
                (this.donePromise = new Promise((n, r) => {
                  (this.resolve = n), (this.reject = r);
                })),
                (this.appInits = A(Nf, { optional: !0 }) ?? []);
            }
            runInitializers() {
              if (this.initialized) return;
              const n = [];
              for (const o of this.appInits) {
                const i = o();
                if (rs(i)) n.push(i);
                else if (__(i)) {
                  const s = new Promise((a, l) => {
                    i.subscribe({ complete: a, error: l });
                  });
                  n.push(s);
                }
              }
              const r = () => {
                (this.done = !0), this.resolve();
              };
              Promise.all(n)
                .then(() => {
                  r();
                })
                .catch((o) => {
                  this.reject(o);
                }),
                0 === n.length && r(),
                (this.initialized = !0);
            }
          }
          return (
            (t.ɵfac = function (n) {
              return new (n || t)();
            }),
            (t.ɵprov = N({ token: t, factory: t.ɵfac, providedIn: "root" })),
            t
          );
        })(),
        RD = (() => {
          class t {
            log(n) {
              console.log(n);
            }
            warn(n) {
              console.warn(n);
            }
          }
          return (
            (t.ɵfac = function (n) {
              return new (n || t)();
            }),
            (t.ɵprov = N({
              token: t,
              factory: t.ɵfac,
              providedIn: "platform",
            })),
            t
          );
        })();
      const Zn = new O("LocaleId", {
        providedIn: "root",
        factory: () =>
          A(Zn, k.Optional | k.SkipSelf) ||
          (function TR() {
            return (typeof $localize < "u" && $localize.locale) || Wo;
          })(),
      });
      let _l = (() => {
        class t {
          constructor() {
            (this.taskId = 0),
              (this.pendingTasks = new Set()),
              (this.hasPendingTasks = new Bt(!1));
          }
          add() {
            this.hasPendingTasks.next(!0);
            const n = this.taskId++;
            return this.pendingTasks.add(n), n;
          }
          remove(n) {
            this.pendingTasks.delete(n),
              0 === this.pendingTasks.size && this.hasPendingTasks.next(!1);
          }
          ngOnDestroy() {
            this.pendingTasks.clear(), this.hasPendingTasks.next(!1);
          }
        }
        return (
          (t.ɵfac = function (n) {
            return new (n || t)();
          }),
          (t.ɵprov = N({ token: t, factory: t.ɵfac, providedIn: "root" })),
          t
        );
      })();
      class IR {
        constructor(e, n) {
          (this.ngModuleFactory = e), (this.componentFactories = n);
        }
      }
      let FD = (() => {
        class t {
          compileModuleSync(n) {
            return new gf(n);
          }
          compileModuleAsync(n) {
            return Promise.resolve(this.compileModuleSync(n));
          }
          compileModuleAndAllComponentsSync(n) {
            const r = this.compileModuleSync(n),
              i = Gn(Tt(n).declarations).reduce((s, a) => {
                const l = ie(a);
                return l && s.push(new Yi(l)), s;
              }, []);
            return new IR(r, i);
          }
          compileModuleAndAllComponentsAsync(n) {
            return Promise.resolve(this.compileModuleAndAllComponentsSync(n));
          }
          clearCache() {}
          clearCacheFor(n) {}
          getModuleId(n) {}
        }
        return (
          (t.ɵfac = function (n) {
            return new (n || t)();
          }),
          (t.ɵprov = N({ token: t, factory: t.ɵfac, providedIn: "root" })),
          t
        );
      })();
      const NR = (() => Promise.resolve(0))();
      function Rf(t) {
        typeof Zone > "u"
          ? NR.then(() => {
              t && t.apply(null, null);
            })
          : Zone.current.scheduleMicroTask("scheduleMicrotask", t);
      }
      function VD(...t) {}
      class ye {
        constructor({
          enableLongStackTrace: e = !1,
          shouldCoalesceEventChangeDetection: n = !1,
          shouldCoalesceRunChangeDetection: r = !1,
        }) {
          if (
            ((this.hasPendingMacrotasks = !1),
            (this.hasPendingMicrotasks = !1),
            (this.isStable = !0),
            (this.onUnstable = new Te(!1)),
            (this.onMicrotaskEmpty = new Te(!1)),
            (this.onStable = new Te(!1)),
            (this.onError = new Te(!1)),
            typeof Zone > "u")
          )
            throw new v(908, !1);
          Zone.assertZonePatched();
          const o = this;
          (o._nesting = 0),
            (o._outer = o._inner = Zone.current),
            Zone.TaskTrackingZoneSpec &&
              (o._inner = o._inner.fork(new Zone.TaskTrackingZoneSpec())),
            e &&
              Zone.longStackTraceZoneSpec &&
              (o._inner = o._inner.fork(Zone.longStackTraceZoneSpec)),
            (o.shouldCoalesceEventChangeDetection = !r && n),
            (o.shouldCoalesceRunChangeDetection = r),
            (o.lastRequestAnimationFrameId = -1),
            (o.nativeRequestAnimationFrame = (function xR() {
              let t = pe.requestAnimationFrame,
                e = pe.cancelAnimationFrame;
              if (typeof Zone < "u" && t && e) {
                const n = t[Zone.__symbol__("OriginalDelegate")];
                n && (t = n);
                const r = e[Zone.__symbol__("OriginalDelegate")];
                r && (e = r);
              }
              return {
                nativeRequestAnimationFrame: t,
                nativeCancelAnimationFrame: e,
              };
            })().nativeRequestAnimationFrame),
            (function kR(t) {
              const e = () => {
                !(function FR(t) {
                  t.isCheckStableRunning ||
                    -1 !== t.lastRequestAnimationFrameId ||
                    ((t.lastRequestAnimationFrameId =
                      t.nativeRequestAnimationFrame.call(pe, () => {
                        t.fakeTopEventTask ||
                          (t.fakeTopEventTask = Zone.root.scheduleEventTask(
                            "fakeTopEventTask",
                            () => {
                              (t.lastRequestAnimationFrameId = -1),
                                kf(t),
                                (t.isCheckStableRunning = !0),
                                Ff(t),
                                (t.isCheckStableRunning = !1);
                            },
                            void 0,
                            () => {},
                            () => {}
                          )),
                          t.fakeTopEventTask.invoke();
                      })),
                    kf(t));
                })(t);
              };
              t._inner = t._inner.fork({
                name: "angular",
                properties: { isAngularZone: !0 },
                onInvokeTask: (n, r, o, i, s, a) => {
                  try {
                    return BD(t), n.invokeTask(o, i, s, a);
                  } finally {
                    ((t.shouldCoalesceEventChangeDetection &&
                      "eventTask" === i.type) ||
                      t.shouldCoalesceRunChangeDetection) &&
                      e(),
                      HD(t);
                  }
                },
                onInvoke: (n, r, o, i, s, a, l) => {
                  try {
                    return BD(t), n.invoke(o, i, s, a, l);
                  } finally {
                    t.shouldCoalesceRunChangeDetection && e(), HD(t);
                  }
                },
                onHasTask: (n, r, o, i) => {
                  n.hasTask(o, i),
                    r === o &&
                      ("microTask" == i.change
                        ? ((t._hasPendingMicrotasks = i.microTask),
                          kf(t),
                          Ff(t))
                        : "macroTask" == i.change &&
                          (t.hasPendingMacrotasks = i.macroTask));
                },
                onHandleError: (n, r, o, i) => (
                  n.handleError(o, i),
                  t.runOutsideAngular(() => t.onError.emit(i)),
                  !1
                ),
              });
            })(o);
        }
        static isInAngularZone() {
          return typeof Zone < "u" && !0 === Zone.current.get("isAngularZone");
        }
        static assertInAngularZone() {
          if (!ye.isInAngularZone()) throw new v(909, !1);
        }
        static assertNotInAngularZone() {
          if (ye.isInAngularZone()) throw new v(909, !1);
        }
        run(e, n, r) {
          return this._inner.run(e, n, r);
        }
        runTask(e, n, r, o) {
          const i = this._inner,
            s = i.scheduleEventTask("NgZoneEvent: " + o, e, RR, VD, VD);
          try {
            return i.runTask(s, n, r);
          } finally {
            i.cancelTask(s);
          }
        }
        runGuarded(e, n, r) {
          return this._inner.runGuarded(e, n, r);
        }
        runOutsideAngular(e) {
          return this._outer.run(e);
        }
      }
      const RR = {};
      function Ff(t) {
        if (0 == t._nesting && !t.hasPendingMicrotasks && !t.isStable)
          try {
            t._nesting++, t.onMicrotaskEmpty.emit(null);
          } finally {
            if ((t._nesting--, !t.hasPendingMicrotasks))
              try {
                t.runOutsideAngular(() => t.onStable.emit(null));
              } finally {
                t.isStable = !0;
              }
          }
      }
      function kf(t) {
        t.hasPendingMicrotasks = !!(
          t._hasPendingMicrotasks ||
          ((t.shouldCoalesceEventChangeDetection ||
            t.shouldCoalesceRunChangeDetection) &&
            -1 !== t.lastRequestAnimationFrameId)
        );
      }
      function BD(t) {
        t._nesting++,
          t.isStable && ((t.isStable = !1), t.onUnstable.emit(null));
      }
      function HD(t) {
        t._nesting--, Ff(t);
      }
      class LR {
        constructor() {
          (this.hasPendingMicrotasks = !1),
            (this.hasPendingMacrotasks = !1),
            (this.isStable = !0),
            (this.onUnstable = new Te()),
            (this.onMicrotaskEmpty = new Te()),
            (this.onStable = new Te()),
            (this.onError = new Te());
        }
        run(e, n, r) {
          return e.apply(n, r);
        }
        runGuarded(e, n, r) {
          return e.apply(n, r);
        }
        runOutsideAngular(e) {
          return e();
        }
        runTask(e, n, r, o) {
          return e.apply(n, r);
        }
      }
      const jD = new O("", { providedIn: "root", factory: $D });
      function $D() {
        const t = A(ye);
        let e = !0;
        return (function WM(...t) {
          const e = mi(t),
            n = (function HM(t, e) {
              return "number" == typeof ac(t) ? t.pop() : e;
            })(t, 1 / 0),
            r = t;
          return r.length ? (1 === r.length ? Et(r[0]) : lo(n)(je(r, e))) : hn;
        })(
          new Ce((o) => {
            (e =
              t.isStable && !t.hasPendingMacrotasks && !t.hasPendingMicrotasks),
              t.runOutsideAngular(() => {
                o.next(e), o.complete();
              });
          }),
          new Ce((o) => {
            let i;
            t.runOutsideAngular(() => {
              i = t.onStable.subscribe(() => {
                ye.assertNotInAngularZone(),
                  Rf(() => {
                    !e &&
                      !t.hasPendingMacrotasks &&
                      !t.hasPendingMicrotasks &&
                      ((e = !0), o.next(!0));
                  });
              });
            });
            const s = t.onUnstable.subscribe(() => {
              ye.assertInAngularZone(),
                e &&
                  ((e = !1),
                  t.runOutsideAngular(() => {
                    o.next(!1);
                  }));
            });
            return () => {
              i.unsubscribe(), s.unsubscribe();
            };
          }).pipe(Rg())
        );
      }
      const UD = new O(""),
        Cl = new O("");
      let Bf,
        Lf = (() => {
          class t {
            constructor(n, r, o) {
              (this._ngZone = n),
                (this.registry = r),
                (this._pendingCount = 0),
                (this._isZoneStable = !0),
                (this._didWork = !1),
                (this._callbacks = []),
                (this.taskTrackingZone = null),
                Bf ||
                  ((function VR(t) {
                    Bf = t;
                  })(o),
                  o.addToWindow(r)),
                this._watchAngularEvents(),
                n.run(() => {
                  this.taskTrackingZone =
                    typeof Zone > "u"
                      ? null
                      : Zone.current.get("TaskTrackingZone");
                });
            }
            _watchAngularEvents() {
              this._ngZone.onUnstable.subscribe({
                next: () => {
                  (this._didWork = !0), (this._isZoneStable = !1);
                },
              }),
                this._ngZone.runOutsideAngular(() => {
                  this._ngZone.onStable.subscribe({
                    next: () => {
                      ye.assertNotInAngularZone(),
                        Rf(() => {
                          (this._isZoneStable = !0),
                            this._runCallbacksIfReady();
                        });
                    },
                  });
                });
            }
            increasePendingRequestCount() {
              return (
                (this._pendingCount += 1),
                (this._didWork = !0),
                this._pendingCount
              );
            }
            decreasePendingRequestCount() {
              if (((this._pendingCount -= 1), this._pendingCount < 0))
                throw new Error("pending async requests below zero");
              return this._runCallbacksIfReady(), this._pendingCount;
            }
            isStable() {
              return (
                this._isZoneStable &&
                0 === this._pendingCount &&
                !this._ngZone.hasPendingMacrotasks
              );
            }
            _runCallbacksIfReady() {
              if (this.isStable())
                Rf(() => {
                  for (; 0 !== this._callbacks.length; ) {
                    let n = this._callbacks.pop();
                    clearTimeout(n.timeoutId), n.doneCb(this._didWork);
                  }
                  this._didWork = !1;
                });
              else {
                let n = this.getPendingTasks();
                (this._callbacks = this._callbacks.filter(
                  (r) =>
                    !r.updateCb ||
                    !r.updateCb(n) ||
                    (clearTimeout(r.timeoutId), !1)
                )),
                  (this._didWork = !0);
              }
            }
            getPendingTasks() {
              return this.taskTrackingZone
                ? this.taskTrackingZone.macroTasks.map((n) => ({
                    source: n.source,
                    creationLocation: n.creationLocation,
                    data: n.data,
                  }))
                : [];
            }
            addCallback(n, r, o) {
              let i = -1;
              r &&
                r > 0 &&
                (i = setTimeout(() => {
                  (this._callbacks = this._callbacks.filter(
                    (s) => s.timeoutId !== i
                  )),
                    n(this._didWork, this.getPendingTasks());
                }, r)),
                this._callbacks.push({ doneCb: n, timeoutId: i, updateCb: o });
            }
            whenStable(n, r, o) {
              if (o && !this.taskTrackingZone)
                throw new Error(
                  'Task tracking zone is required when passing an update callback to whenStable(). Is "zone.js/plugins/task-tracking" loaded?'
                );
              this.addCallback(n, r, o), this._runCallbacksIfReady();
            }
            getPendingRequestCount() {
              return this._pendingCount;
            }
            registerApplication(n) {
              this.registry.registerApplication(n, this);
            }
            unregisterApplication(n) {
              this.registry.unregisterApplication(n);
            }
            findProviders(n, r, o) {
              return [];
            }
          }
          return (
            (t.ɵfac = function (n) {
              return new (n || t)(I(ye), I(Vf), I(Cl));
            }),
            (t.ɵprov = N({ token: t, factory: t.ɵfac })),
            t
          );
        })(),
        Vf = (() => {
          class t {
            constructor() {
              this._applications = new Map();
            }
            registerApplication(n, r) {
              this._applications.set(n, r);
            }
            unregisterApplication(n) {
              this._applications.delete(n);
            }
            unregisterAllApplications() {
              this._applications.clear();
            }
            getTestability(n) {
              return this._applications.get(n) || null;
            }
            getAllTestabilities() {
              return Array.from(this._applications.values());
            }
            getAllRootElements() {
              return Array.from(this._applications.keys());
            }
            findTestabilityInTree(n, r = !0) {
              return Bf?.findTestabilityInTree(this, n, r) ?? null;
            }
          }
          return (
            (t.ɵfac = function (n) {
              return new (n || t)();
            }),
            (t.ɵprov = N({
              token: t,
              factory: t.ɵfac,
              providedIn: "platform",
            })),
            t
          );
        })(),
        pr = null;
      const zD = new O("AllowMultipleToken"),
        Hf = new O("PlatformDestroyListeners"),
        jf = new O("appBootstrapListener");
      class GD {
        constructor(e, n) {
          (this.name = e), (this.token = n);
        }
      }
      function KD(t, e, n = []) {
        const r = `Platform: ${e}`,
          o = new O(r);
        return (i = []) => {
          let s = $f();
          if (!s || s.injector.get(zD, !1)) {
            const a = [...n, ...i, { provide: o, useValue: !0 }];
            t
              ? t(a)
              : (function jR(t) {
                  if (pr && !pr.get(zD, !1)) throw new v(400, !1);
                  (function qD() {
                    !(function BT(t) {
                      cm = t;
                    })(() => {
                      throw new v(600, !1);
                    });
                  })(),
                    (pr = t);
                  const e = t.get(ZD);
                  (function WD(t) {
                    t.get(nv, null)?.forEach((n) => n());
                  })(t);
                })(
                  (function QD(t = [], e) {
                    return bn.create({
                      name: e,
                      providers: [
                        { provide: vd, useValue: "platform" },
                        { provide: Hf, useValue: new Set([() => (pr = null)]) },
                        ...t,
                      ],
                    });
                  })(a, r)
                );
          }
          return (function UR(t) {
            const e = $f();
            if (!e) throw new v(401, !1);
            return e;
          })();
        };
      }
      function $f() {
        return pr?.get(ZD) ?? null;
      }
      let ZD = (() => {
        class t {
          constructor(n) {
            (this._injector = n),
              (this._modules = []),
              (this._destroyListeners = []),
              (this._destroyed = !1);
          }
          bootstrapModuleFactory(n, r) {
            const o = (function zR(t = "zone.js", e) {
              return "noop" === t ? new LR() : "zone.js" === t ? new ye(e) : t;
            })(
              r?.ngZone,
              (function YD(t) {
                return {
                  enableLongStackTrace: !1,
                  shouldCoalesceEventChangeDetection: t?.eventCoalescing ?? !1,
                  shouldCoalesceRunChangeDetection: t?.runCoalescing ?? !1,
                };
              })({
                eventCoalescing: r?.ngZoneEventCoalescing,
                runCoalescing: r?.ngZoneRunCoalescing,
              })
            );
            return o.run(() => {
              const i = (function f1(t, e, n) {
                  return new pf(t, e, n);
                })(
                  n.moduleType,
                  this.injector,
                  (function nw(t) {
                    return [
                      { provide: ye, useFactory: t },
                      {
                        provide: ji,
                        multi: !0,
                        useFactory: () => {
                          const e = A(GR, { optional: !0 });
                          return () => e.initialize();
                        },
                      },
                      { provide: tw, useFactory: qR },
                      { provide: jD, useFactory: $D },
                    ];
                  })(() => o)
                ),
                s = i.injector.get(Vr, null);
              return (
                o.runOutsideAngular(() => {
                  const a = o.onError.subscribe({
                    next: (l) => {
                      s.handleError(l);
                    },
                  });
                  i.onDestroy(() => {
                    Dl(this._modules, i), a.unsubscribe();
                  });
                }),
                (function XD(t, e, n) {
                  try {
                    const r = n();
                    return rs(r)
                      ? r.catch((o) => {
                          throw (
                            (e.runOutsideAngular(() => t.handleError(o)), o)
                          );
                        })
                      : r;
                  } catch (r) {
                    throw (e.runOutsideAngular(() => t.handleError(r)), r);
                  }
                })(s, o, () => {
                  const a = i.injector.get(xf);
                  return (
                    a.runInitializers(),
                    a.donePromise.then(
                      () => (
                        (function gC(t) {
                          Ht(t, "Expected localeId to be defined"),
                            "string" == typeof t &&
                              (pC = t.toLowerCase().replace(/_/g, "-"));
                        })(i.injector.get(Zn, Wo) || Wo),
                        this._moduleDoBootstrap(i),
                        i
                      )
                    )
                  );
                })
              );
            });
          }
          bootstrapModule(n, r = []) {
            const o = JD({}, r);
            return (function BR(t, e, n) {
              const r = new gf(n);
              return Promise.resolve(r);
            })(0, 0, n).then((i) => this.bootstrapModuleFactory(i, o));
          }
          _moduleDoBootstrap(n) {
            const r = n.injector.get($r);
            if (n._bootstrapComponents.length > 0)
              n._bootstrapComponents.forEach((o) => r.bootstrap(o));
            else {
              if (!n.instance.ngDoBootstrap) throw new v(-403, !1);
              n.instance.ngDoBootstrap(r);
            }
            this._modules.push(n);
          }
          onDestroy(n) {
            this._destroyListeners.push(n);
          }
          get injector() {
            return this._injector;
          }
          destroy() {
            if (this._destroyed) throw new v(404, !1);
            this._modules.slice().forEach((r) => r.destroy()),
              this._destroyListeners.forEach((r) => r());
            const n = this._injector.get(Hf, null);
            n && (n.forEach((r) => r()), n.clear()), (this._destroyed = !0);
          }
          get destroyed() {
            return this._destroyed;
          }
        }
        return (
          (t.ɵfac = function (n) {
            return new (n || t)(I(bn));
          }),
          (t.ɵprov = N({ token: t, factory: t.ɵfac, providedIn: "platform" })),
          t
        );
      })();
      function JD(t, e) {
        return Array.isArray(e) ? e.reduce(JD, t) : { ...t, ...e };
      }
      let $r = (() => {
        class t {
          constructor() {
            (this._bootstrapListeners = []),
              (this._runningTick = !1),
              (this._destroyed = !1),
              (this._destroyListeners = []),
              (this._views = []),
              (this.internalErrorHandler = A(tw)),
              (this.zoneIsStable = A(jD)),
              (this.componentTypes = []),
              (this.components = []),
              (this.isStable = A(_l).hasPendingTasks.pipe(
                Zt((n) => (n ? j(!1) : this.zoneIsStable)),
                (function KM(t, e = ir) {
                  return (
                    (t = t ?? QM),
                    We((n, r) => {
                      let o,
                        i = !0;
                      n.subscribe(
                        He(r, (s) => {
                          const a = e(s);
                          (i || !t(o, a)) && ((i = !1), (o = a), r.next(s));
                        })
                      );
                    })
                  );
                })(),
                Rg()
              )),
              (this._injector = A(wn));
          }
          get destroyed() {
            return this._destroyed;
          }
          get injector() {
            return this._injector;
          }
          bootstrap(n, r) {
            const o = n instanceof cv;
            if (!this._injector.get(xf).done)
              throw (
                (!o &&
                  (function co(t) {
                    const e = ie(t) || et(t) || vt(t);
                    return null !== e && e.standalone;
                  })(n),
                new v(405, !1))
              );
            let s;
            (s = o ? n : this._injector.get(Ya).resolveComponentFactory(n)),
              this.componentTypes.push(s.componentType);
            const a = (function HR(t) {
                return t.isBoundToModule;
              })(s)
                ? void 0
                : this._injector.get(Ko),
              u = s.create(bn.NULL, [], r || s.selector, a),
              c = u.location.nativeElement,
              d = u.injector.get(UD, null);
            return (
              d?.registerApplication(c),
              u.onDestroy(() => {
                this.detachView(u.hostView),
                  Dl(this.components, u),
                  d?.unregisterApplication(c);
              }),
              this._loadComponent(u),
              u
            );
          }
          tick() {
            if (this._runningTick) throw new v(101, !1);
            try {
              this._runningTick = !0;
              for (let n of this._views) n.detectChanges();
            } catch (n) {
              this.internalErrorHandler(n);
            } finally {
              this._runningTick = !1;
            }
          }
          attachView(n) {
            const r = n;
            this._views.push(r), r.attachToAppRef(this);
          }
          detachView(n) {
            const r = n;
            Dl(this._views, r), r.detachFromAppRef();
          }
          _loadComponent(n) {
            this.attachView(n.hostView), this.tick(), this.components.push(n);
            const r = this._injector.get(jf, []);
            r.push(...this._bootstrapListeners), r.forEach((o) => o(n));
          }
          ngOnDestroy() {
            if (!this._destroyed)
              try {
                this._destroyListeners.forEach((n) => n()),
                  this._views.slice().forEach((n) => n.destroy());
              } finally {
                (this._destroyed = !0),
                  (this._views = []),
                  (this._bootstrapListeners = []),
                  (this._destroyListeners = []);
              }
          }
          onDestroy(n) {
            return (
              this._destroyListeners.push(n),
              () => Dl(this._destroyListeners, n)
            );
          }
          destroy() {
            if (this._destroyed) throw new v(406, !1);
            const n = this._injector;
            n.destroy && !n.destroyed && n.destroy();
          }
          get viewCount() {
            return this._views.length;
          }
          warnIfDestroyed() {}
        }
        return (
          (t.ɵfac = function (n) {
            return new (n || t)();
          }),
          (t.ɵprov = N({ token: t, factory: t.ɵfac, providedIn: "root" })),
          t
        );
      })();
      function Dl(t, e) {
        const n = t.indexOf(e);
        n > -1 && t.splice(n, 1);
      }
      const tw = new O("", {
        providedIn: "root",
        factory: () => A(Vr).handleError.bind(void 0),
      });
      function qR() {
        const t = A(ye),
          e = A(Vr);
        return (n) => t.runOutsideAngular(() => e.handleError(n));
      }
      let GR = (() => {
        class t {
          constructor() {
            (this.zone = A(ye)), (this.applicationRef = A($r));
          }
          initialize() {
            this._onMicrotaskEmptySubscription ||
              (this._onMicrotaskEmptySubscription =
                this.zone.onMicrotaskEmpty.subscribe({
                  next: () => {
                    this.zone.run(() => {
                      this.applicationRef.tick();
                    });
                  },
                }));
          }
          ngOnDestroy() {
            this._onMicrotaskEmptySubscription?.unsubscribe();
          }
        }
        return (
          (t.ɵfac = function (n) {
            return new (n || t)();
          }),
          (t.ɵprov = N({ token: t, factory: t.ɵfac, providedIn: "root" })),
          t
        );
      })();
      let wl = (() => {
        class t {}
        return (t.__NG_ELEMENT_ID__ = KR), t;
      })();
      function KR(t) {
        return (function QR(t, e, n) {
          if (Ir(t) && !n) {
            const r = It(t.index, e);
            return new Zi(r, r);
          }
          return 47 & t.type ? new Zi(e[xe], e) : null;
        })(Ye(), w(), 16 == (16 & t));
      }
      class sw {
        constructor() {}
        supports(e) {
          return il(e);
        }
        create(e) {
          return new tF(e);
        }
      }
      const eF = (t, e) => e;
      class tF {
        constructor(e) {
          (this.length = 0),
            (this._linkedRecords = null),
            (this._unlinkedRecords = null),
            (this._previousItHead = null),
            (this._itHead = null),
            (this._itTail = null),
            (this._additionsHead = null),
            (this._additionsTail = null),
            (this._movesHead = null),
            (this._movesTail = null),
            (this._removalsHead = null),
            (this._removalsTail = null),
            (this._identityChangesHead = null),
            (this._identityChangesTail = null),
            (this._trackByFn = e || eF);
        }
        forEachItem(e) {
          let n;
          for (n = this._itHead; null !== n; n = n._next) e(n);
        }
        forEachOperation(e) {
          let n = this._itHead,
            r = this._removalsHead,
            o = 0,
            i = null;
          for (; n || r; ) {
            const s = !r || (n && n.currentIndex < lw(r, o, i)) ? n : r,
              a = lw(s, o, i),
              l = s.currentIndex;
            if (s === r) o--, (r = r._nextRemoved);
            else if (((n = n._next), null == s.previousIndex)) o++;
            else {
              i || (i = []);
              const u = a - o,
                c = l - o;
              if (u != c) {
                for (let f = 0; f < u; f++) {
                  const h = f < i.length ? i[f] : (i[f] = 0),
                    p = h + f;
                  c <= p && p < u && (i[f] = h + 1);
                }
                i[s.previousIndex] = c - u;
              }
            }
            a !== l && e(s, a, l);
          }
        }
        forEachPreviousItem(e) {
          let n;
          for (n = this._previousItHead; null !== n; n = n._nextPrevious) e(n);
        }
        forEachAddedItem(e) {
          let n;
          for (n = this._additionsHead; null !== n; n = n._nextAdded) e(n);
        }
        forEachMovedItem(e) {
          let n;
          for (n = this._movesHead; null !== n; n = n._nextMoved) e(n);
        }
        forEachRemovedItem(e) {
          let n;
          for (n = this._removalsHead; null !== n; n = n._nextRemoved) e(n);
        }
        forEachIdentityChange(e) {
          let n;
          for (
            n = this._identityChangesHead;
            null !== n;
            n = n._nextIdentityChange
          )
            e(n);
        }
        diff(e) {
          if ((null == e && (e = []), !il(e))) throw new v(900, !1);
          return this.check(e) ? this : null;
        }
        onDestroy() {}
        check(e) {
          this._reset();
          let o,
            i,
            s,
            n = this._itHead,
            r = !1;
          if (Array.isArray(e)) {
            this.length = e.length;
            for (let a = 0; a < this.length; a++)
              (i = e[a]),
                (s = this._trackByFn(a, i)),
                null !== n && Object.is(n.trackById, s)
                  ? (r && (n = this._verifyReinsertion(n, i, s, a)),
                    Object.is(n.item, i) || this._addIdentityChange(n, i))
                  : ((n = this._mismatch(n, i, s, a)), (r = !0)),
                (n = n._next);
          } else
            (o = 0),
              (function zP(t, e) {
                if (Array.isArray(t))
                  for (let n = 0; n < t.length; n++) e(t[n]);
                else {
                  const n = t[Symbol.iterator]();
                  let r;
                  for (; !(r = n.next()).done; ) e(r.value);
                }
              })(e, (a) => {
                (s = this._trackByFn(o, a)),
                  null !== n && Object.is(n.trackById, s)
                    ? (r && (n = this._verifyReinsertion(n, a, s, o)),
                      Object.is(n.item, a) || this._addIdentityChange(n, a))
                    : ((n = this._mismatch(n, a, s, o)), (r = !0)),
                  (n = n._next),
                  o++;
              }),
              (this.length = o);
          return this._truncate(n), (this.collection = e), this.isDirty;
        }
        get isDirty() {
          return (
            null !== this._additionsHead ||
            null !== this._movesHead ||
            null !== this._removalsHead ||
            null !== this._identityChangesHead
          );
        }
        _reset() {
          if (this.isDirty) {
            let e;
            for (
              e = this._previousItHead = this._itHead;
              null !== e;
              e = e._next
            )
              e._nextPrevious = e._next;
            for (e = this._additionsHead; null !== e; e = e._nextAdded)
              e.previousIndex = e.currentIndex;
            for (
              this._additionsHead = this._additionsTail = null,
                e = this._movesHead;
              null !== e;
              e = e._nextMoved
            )
              e.previousIndex = e.currentIndex;
            (this._movesHead = this._movesTail = null),
              (this._removalsHead = this._removalsTail = null),
              (this._identityChangesHead = this._identityChangesTail = null);
          }
        }
        _mismatch(e, n, r, o) {
          let i;
          return (
            null === e ? (i = this._itTail) : ((i = e._prev), this._remove(e)),
            null !==
            (e =
              null === this._unlinkedRecords
                ? null
                : this._unlinkedRecords.get(r, null))
              ? (Object.is(e.item, n) || this._addIdentityChange(e, n),
                this._reinsertAfter(e, i, o))
              : null !==
                (e =
                  null === this._linkedRecords
                    ? null
                    : this._linkedRecords.get(r, o))
              ? (Object.is(e.item, n) || this._addIdentityChange(e, n),
                this._moveAfter(e, i, o))
              : (e = this._addAfter(new nF(n, r), i, o)),
            e
          );
        }
        _verifyReinsertion(e, n, r, o) {
          let i =
            null === this._unlinkedRecords
              ? null
              : this._unlinkedRecords.get(r, null);
          return (
            null !== i
              ? (e = this._reinsertAfter(i, e._prev, o))
              : e.currentIndex != o &&
                ((e.currentIndex = o), this._addToMoves(e, o)),
            e
          );
        }
        _truncate(e) {
          for (; null !== e; ) {
            const n = e._next;
            this._addToRemovals(this._unlink(e)), (e = n);
          }
          null !== this._unlinkedRecords && this._unlinkedRecords.clear(),
            null !== this._additionsTail &&
              (this._additionsTail._nextAdded = null),
            null !== this._movesTail && (this._movesTail._nextMoved = null),
            null !== this._itTail && (this._itTail._next = null),
            null !== this._removalsTail &&
              (this._removalsTail._nextRemoved = null),
            null !== this._identityChangesTail &&
              (this._identityChangesTail._nextIdentityChange = null);
        }
        _reinsertAfter(e, n, r) {
          null !== this._unlinkedRecords && this._unlinkedRecords.remove(e);
          const o = e._prevRemoved,
            i = e._nextRemoved;
          return (
            null === o ? (this._removalsHead = i) : (o._nextRemoved = i),
            null === i ? (this._removalsTail = o) : (i._prevRemoved = o),
            this._insertAfter(e, n, r),
            this._addToMoves(e, r),
            e
          );
        }
        _moveAfter(e, n, r) {
          return (
            this._unlink(e),
            this._insertAfter(e, n, r),
            this._addToMoves(e, r),
            e
          );
        }
        _addAfter(e, n, r) {
          return (
            this._insertAfter(e, n, r),
            (this._additionsTail =
              null === this._additionsTail
                ? (this._additionsHead = e)
                : (this._additionsTail._nextAdded = e)),
            e
          );
        }
        _insertAfter(e, n, r) {
          const o = null === n ? this._itHead : n._next;
          return (
            (e._next = o),
            (e._prev = n),
            null === o ? (this._itTail = e) : (o._prev = e),
            null === n ? (this._itHead = e) : (n._next = e),
            null === this._linkedRecords && (this._linkedRecords = new aw()),
            this._linkedRecords.put(e),
            (e.currentIndex = r),
            e
          );
        }
        _remove(e) {
          return this._addToRemovals(this._unlink(e));
        }
        _unlink(e) {
          null !== this._linkedRecords && this._linkedRecords.remove(e);
          const n = e._prev,
            r = e._next;
          return (
            null === n ? (this._itHead = r) : (n._next = r),
            null === r ? (this._itTail = n) : (r._prev = n),
            e
          );
        }
        _addToMoves(e, n) {
          return (
            e.previousIndex === n ||
              (this._movesTail =
                null === this._movesTail
                  ? (this._movesHead = e)
                  : (this._movesTail._nextMoved = e)),
            e
          );
        }
        _addToRemovals(e) {
          return (
            null === this._unlinkedRecords &&
              (this._unlinkedRecords = new aw()),
            this._unlinkedRecords.put(e),
            (e.currentIndex = null),
            (e._nextRemoved = null),
            null === this._removalsTail
              ? ((this._removalsTail = this._removalsHead = e),
                (e._prevRemoved = null))
              : ((e._prevRemoved = this._removalsTail),
                (this._removalsTail = this._removalsTail._nextRemoved = e)),
            e
          );
        }
        _addIdentityChange(e, n) {
          return (
            (e.item = n),
            (this._identityChangesTail =
              null === this._identityChangesTail
                ? (this._identityChangesHead = e)
                : (this._identityChangesTail._nextIdentityChange = e)),
            e
          );
        }
      }
      class nF {
        constructor(e, n) {
          (this.item = e),
            (this.trackById = n),
            (this.currentIndex = null),
            (this.previousIndex = null),
            (this._nextPrevious = null),
            (this._prev = null),
            (this._next = null),
            (this._prevDup = null),
            (this._nextDup = null),
            (this._prevRemoved = null),
            (this._nextRemoved = null),
            (this._nextAdded = null),
            (this._nextMoved = null),
            (this._nextIdentityChange = null);
        }
      }
      class rF {
        constructor() {
          (this._head = null), (this._tail = null);
        }
        add(e) {
          null === this._head
            ? ((this._head = this._tail = e),
              (e._nextDup = null),
              (e._prevDup = null))
            : ((this._tail._nextDup = e),
              (e._prevDup = this._tail),
              (e._nextDup = null),
              (this._tail = e));
        }
        get(e, n) {
          let r;
          for (r = this._head; null !== r; r = r._nextDup)
            if (
              (null === n || n <= r.currentIndex) &&
              Object.is(r.trackById, e)
            )
              return r;
          return null;
        }
        remove(e) {
          const n = e._prevDup,
            r = e._nextDup;
          return (
            null === n ? (this._head = r) : (n._nextDup = r),
            null === r ? (this._tail = n) : (r._prevDup = n),
            null === this._head
          );
        }
      }
      class aw {
        constructor() {
          this.map = new Map();
        }
        put(e) {
          const n = e.trackById;
          let r = this.map.get(n);
          r || ((r = new rF()), this.map.set(n, r)), r.add(e);
        }
        get(e, n) {
          const o = this.map.get(e);
          return o ? o.get(e, n) : null;
        }
        remove(e) {
          const n = e.trackById;
          return this.map.get(n).remove(e) && this.map.delete(n), e;
        }
        get isEmpty() {
          return 0 === this.map.size;
        }
        clear() {
          this.map.clear();
        }
      }
      function lw(t, e, n) {
        const r = t.previousIndex;
        if (null === r) return r;
        let o = 0;
        return n && r < n.length && (o = n[r]), r + e + o;
      }
      function cw() {
        return new Sl([new sw()]);
      }
      let Sl = (() => {
        class t {
          constructor(n) {
            this.factories = n;
          }
          static create(n, r) {
            if (null != r) {
              const o = r.factories.slice();
              n = n.concat(o);
            }
            return new t(n);
          }
          static extend(n) {
            return {
              provide: t,
              useFactory: (r) => t.create(n, r || cw()),
              deps: [[t, new Oa(), new Ia()]],
            };
          }
          find(n) {
            const r = this.factories.find((o) => o.supports(n));
            if (null != r) return r;
            throw new v(901, !1);
          }
        }
        return (t.ɵprov = N({ token: t, providedIn: "root", factory: cw })), t;
      })();
      const lF = KD(null, "core", []);
      let uF = (() => {
        class t {
          constructor(n) {}
        }
        return (
          (t.ɵfac = function (n) {
            return new (n || t)(I($r));
          }),
          (t.ɵmod = Mt({ type: t })),
          (t.ɵinj = pt({})),
          t
        );
      })();
      function Yo(t) {
        return "boolean" == typeof t ? t : null != t && "false" !== t;
      }
      let Qf = null;
      function gr() {
        return Qf;
      }
      class DF {}
      const dt = new O("DocumentToken");
      let Zf = (() => {
        class t {
          historyGo(n) {
            throw new Error("Not implemented");
          }
        }
        return (
          (t.ɵfac = function (n) {
            return new (n || t)();
          }),
          (t.ɵprov = N({
            token: t,
            factory: function () {
              return A(bF);
            },
            providedIn: "platform",
          })),
          t
        );
      })();
      const wF = new O("Location Initialized");
      let bF = (() => {
        class t extends Zf {
          constructor() {
            super(),
              (this._doc = A(dt)),
              (this._location = window.location),
              (this._history = window.history);
          }
          getBaseHrefFromDOM() {
            return gr().getBaseHref(this._doc);
          }
          onPopState(n) {
            const r = gr().getGlobalEventTarget(this._doc, "window");
            return (
              r.addEventListener("popstate", n, !1),
              () => r.removeEventListener("popstate", n)
            );
          }
          onHashChange(n) {
            const r = gr().getGlobalEventTarget(this._doc, "window");
            return (
              r.addEventListener("hashchange", n, !1),
              () => r.removeEventListener("hashchange", n)
            );
          }
          get href() {
            return this._location.href;
          }
          get protocol() {
            return this._location.protocol;
          }
          get hostname() {
            return this._location.hostname;
          }
          get port() {
            return this._location.port;
          }
          get pathname() {
            return this._location.pathname;
          }
          get search() {
            return this._location.search;
          }
          get hash() {
            return this._location.hash;
          }
          set pathname(n) {
            this._location.pathname = n;
          }
          pushState(n, r, o) {
            this._history.pushState(n, r, o);
          }
          replaceState(n, r, o) {
            this._history.replaceState(n, r, o);
          }
          forward() {
            this._history.forward();
          }
          back() {
            this._history.back();
          }
          historyGo(n = 0) {
            this._history.go(n);
          }
          getState() {
            return this._history.state;
          }
        }
        return (
          (t.ɵfac = function (n) {
            return new (n || t)();
          }),
          (t.ɵprov = N({
            token: t,
            factory: function () {
              return new t();
            },
            providedIn: "platform",
          })),
          t
        );
      })();
      function Yf(t, e) {
        if (0 == t.length) return e;
        if (0 == e.length) return t;
        let n = 0;
        return (
          t.endsWith("/") && n++,
          e.startsWith("/") && n++,
          2 == n ? t + e.substring(1) : 1 == n ? t + e : t + "/" + e
        );
      }
      function vw(t) {
        const e = t.match(/#|\?|$/),
          n = (e && e.index) || t.length;
        return t.slice(0, n - ("/" === t[n - 1] ? 1 : 0)) + t.slice(n);
      }
      function Yn(t) {
        return t && "?" !== t[0] ? "?" + t : t;
      }
      let zr = (() => {
        class t {
          historyGo(n) {
            throw new Error("Not implemented");
          }
        }
        return (
          (t.ɵfac = function (n) {
            return new (n || t)();
          }),
          (t.ɵprov = N({
            token: t,
            factory: function () {
              return A(Cw);
            },
            providedIn: "root",
          })),
          t
        );
      })();
      const _w = new O("appBaseHref");
      let Cw = (() => {
          class t extends zr {
            constructor(n, r) {
              super(),
                (this._platformLocation = n),
                (this._removeListenerFns = []),
                (this._baseHref =
                  r ??
                  this._platformLocation.getBaseHrefFromDOM() ??
                  A(dt).location?.origin ??
                  "");
            }
            ngOnDestroy() {
              for (; this._removeListenerFns.length; )
                this._removeListenerFns.pop()();
            }
            onPopState(n) {
              this._removeListenerFns.push(
                this._platformLocation.onPopState(n),
                this._platformLocation.onHashChange(n)
              );
            }
            getBaseHref() {
              return this._baseHref;
            }
            prepareExternalUrl(n) {
              return Yf(this._baseHref, n);
            }
            path(n = !1) {
              const r =
                  this._platformLocation.pathname +
                  Yn(this._platformLocation.search),
                o = this._platformLocation.hash;
              return o && n ? `${r}${o}` : r;
            }
            pushState(n, r, o, i) {
              const s = this.prepareExternalUrl(o + Yn(i));
              this._platformLocation.pushState(n, r, s);
            }
            replaceState(n, r, o, i) {
              const s = this.prepareExternalUrl(o + Yn(i));
              this._platformLocation.replaceState(n, r, s);
            }
            forward() {
              this._platformLocation.forward();
            }
            back() {
              this._platformLocation.back();
            }
            getState() {
              return this._platformLocation.getState();
            }
            historyGo(n = 0) {
              this._platformLocation.historyGo?.(n);
            }
          }
          return (
            (t.ɵfac = function (n) {
              return new (n || t)(I(Zf), I(_w, 8));
            }),
            (t.ɵprov = N({ token: t, factory: t.ɵfac, providedIn: "root" })),
            t
          );
        })(),
        EF = (() => {
          class t extends zr {
            constructor(n, r) {
              super(),
                (this._platformLocation = n),
                (this._baseHref = ""),
                (this._removeListenerFns = []),
                null != r && (this._baseHref = r);
            }
            ngOnDestroy() {
              for (; this._removeListenerFns.length; )
                this._removeListenerFns.pop()();
            }
            onPopState(n) {
              this._removeListenerFns.push(
                this._platformLocation.onPopState(n),
                this._platformLocation.onHashChange(n)
              );
            }
            getBaseHref() {
              return this._baseHref;
            }
            path(n = !1) {
              let r = this._platformLocation.hash;
              return null == r && (r = "#"), r.length > 0 ? r.substring(1) : r;
            }
            prepareExternalUrl(n) {
              const r = Yf(this._baseHref, n);
              return r.length > 0 ? "#" + r : r;
            }
            pushState(n, r, o, i) {
              let s = this.prepareExternalUrl(o + Yn(i));
              0 == s.length && (s = this._platformLocation.pathname),
                this._platformLocation.pushState(n, r, s);
            }
            replaceState(n, r, o, i) {
              let s = this.prepareExternalUrl(o + Yn(i));
              0 == s.length && (s = this._platformLocation.pathname),
                this._platformLocation.replaceState(n, r, s);
            }
            forward() {
              this._platformLocation.forward();
            }
            back() {
              this._platformLocation.back();
            }
            getState() {
              return this._platformLocation.getState();
            }
            historyGo(n = 0) {
              this._platformLocation.historyGo?.(n);
            }
          }
          return (
            (t.ɵfac = function (n) {
              return new (n || t)(I(Zf), I(_w, 8));
            }),
            (t.ɵprov = N({ token: t, factory: t.ɵfac })),
            t
          );
        })(),
        Xf = (() => {
          class t {
            constructor(n) {
              (this._subject = new Te()),
                (this._urlChangeListeners = []),
                (this._urlChangeSubscription = null),
                (this._locationStrategy = n);
              const r = this._locationStrategy.getBaseHref();
              (this._basePath = (function TF(t) {
                if (new RegExp("^(https?:)?//").test(t)) {
                  const [, n] = t.split(/\/\/[^\/]+/);
                  return n;
                }
                return t;
              })(vw(Dw(r)))),
                this._locationStrategy.onPopState((o) => {
                  this._subject.emit({
                    url: this.path(!0),
                    pop: !0,
                    state: o.state,
                    type: o.type,
                  });
                });
            }
            ngOnDestroy() {
              this._urlChangeSubscription?.unsubscribe(),
                (this._urlChangeListeners = []);
            }
            path(n = !1) {
              return this.normalize(this._locationStrategy.path(n));
            }
            getState() {
              return this._locationStrategy.getState();
            }
            isCurrentPathEqualTo(n, r = "") {
              return this.path() == this.normalize(n + Yn(r));
            }
            normalize(n) {
              return t.stripTrailingSlash(
                (function MF(t, e) {
                  if (!t || !e.startsWith(t)) return e;
                  const n = e.substring(t.length);
                  return "" === n || ["/", ";", "?", "#"].includes(n[0])
                    ? n
                    : e;
                })(this._basePath, Dw(n))
              );
            }
            prepareExternalUrl(n) {
              return (
                n && "/" !== n[0] && (n = "/" + n),
                this._locationStrategy.prepareExternalUrl(n)
              );
            }
            go(n, r = "", o = null) {
              this._locationStrategy.pushState(o, "", n, r),
                this._notifyUrlChangeListeners(
                  this.prepareExternalUrl(n + Yn(r)),
                  o
                );
            }
            replaceState(n, r = "", o = null) {
              this._locationStrategy.replaceState(o, "", n, r),
                this._notifyUrlChangeListeners(
                  this.prepareExternalUrl(n + Yn(r)),
                  o
                );
            }
            forward() {
              this._locationStrategy.forward();
            }
            back() {
              this._locationStrategy.back();
            }
            historyGo(n = 0) {
              this._locationStrategy.historyGo?.(n);
            }
            onUrlChange(n) {
              return (
                this._urlChangeListeners.push(n),
                this._urlChangeSubscription ||
                  (this._urlChangeSubscription = this.subscribe((r) => {
                    this._notifyUrlChangeListeners(r.url, r.state);
                  })),
                () => {
                  const r = this._urlChangeListeners.indexOf(n);
                  this._urlChangeListeners.splice(r, 1),
                    0 === this._urlChangeListeners.length &&
                      (this._urlChangeSubscription?.unsubscribe(),
                      (this._urlChangeSubscription = null));
                }
              );
            }
            _notifyUrlChangeListeners(n = "", r) {
              this._urlChangeListeners.forEach((o) => o(n, r));
            }
            subscribe(n, r, o) {
              return this._subject.subscribe({
                next: n,
                error: r,
                complete: o,
              });
            }
          }
          return (
            (t.normalizeQueryParams = Yn),
            (t.joinWithSlash = Yf),
            (t.stripTrailingSlash = vw),
            (t.ɵfac = function (n) {
              return new (n || t)(I(zr));
            }),
            (t.ɵprov = N({
              token: t,
              factory: function () {
                return (function SF() {
                  return new Xf(I(zr));
                })();
              },
              providedIn: "root",
            })),
            t
          );
        })();
      function Dw(t) {
        return t.replace(/\/index.html$/, "");
      }
      var Oe = (() => (
          ((Oe = Oe || {})[(Oe.Format = 0)] = "Format"),
          (Oe[(Oe.Standalone = 1)] = "Standalone"),
          Oe
        ))(),
        X = (() => (
          ((X = X || {})[(X.Narrow = 0)] = "Narrow"),
          (X[(X.Abbreviated = 1)] = "Abbreviated"),
          (X[(X.Wide = 2)] = "Wide"),
          (X[(X.Short = 3)] = "Short"),
          X
        ))(),
        be = (() => (
          ((be = be || {})[(be.Short = 0)] = "Short"),
          (be[(be.Medium = 1)] = "Medium"),
          (be[(be.Long = 2)] = "Long"),
          (be[(be.Full = 3)] = "Full"),
          be
        ))(),
        L = (() => (
          ((L = L || {})[(L.Decimal = 0)] = "Decimal"),
          (L[(L.Group = 1)] = "Group"),
          (L[(L.List = 2)] = "List"),
          (L[(L.PercentSign = 3)] = "PercentSign"),
          (L[(L.PlusSign = 4)] = "PlusSign"),
          (L[(L.MinusSign = 5)] = "MinusSign"),
          (L[(L.Exponential = 6)] = "Exponential"),
          (L[(L.SuperscriptingExponent = 7)] = "SuperscriptingExponent"),
          (L[(L.PerMille = 8)] = "PerMille"),
          (L[(L.Infinity = 9)] = "Infinity"),
          (L[(L.NaN = 10)] = "NaN"),
          (L[(L.TimeSeparator = 11)] = "TimeSeparator"),
          (L[(L.CurrencyDecimal = 12)] = "CurrencyDecimal"),
          (L[(L.CurrencyGroup = 13)] = "CurrencyGroup"),
          L
        ))();
      function Tl(t, e) {
        return qt(ut(t)[M.DateFormat], e);
      }
      function Al(t, e) {
        return qt(ut(t)[M.TimeFormat], e);
      }
      function Il(t, e) {
        return qt(ut(t)[M.DateTimeFormat], e);
      }
      function zt(t, e) {
        const n = ut(t),
          r = n[M.NumberSymbols][e];
        if (typeof r > "u") {
          if (e === L.CurrencyDecimal) return n[M.NumberSymbols][L.Decimal];
          if (e === L.CurrencyGroup) return n[M.NumberSymbols][L.Group];
        }
        return r;
      }
      function bw(t) {
        if (!t[M.ExtraData])
          throw new Error(
            `Missing extra locale data for the locale "${
              t[M.LocaleId]
            }". Use "registerLocaleData" to load new data. See the "I18n guide" on angular.io to know more.`
          );
      }
      function qt(t, e) {
        for (let n = e; n > -1; n--) if (typeof t[n] < "u") return t[n];
        throw new Error("Locale data API: locale data undefined");
      }
      function eh(t) {
        const [e, n] = t.split(":");
        return { hours: +e, minutes: +n };
      }
      const HF =
          /^(\d{4,})-?(\d\d)-?(\d\d)(?:T(\d\d)(?::?(\d\d)(?::?(\d\d)(?:\.(\d+))?)?)?(Z|([+-])(\d\d):?(\d\d))?)?$/,
        ps = {},
        jF =
          /((?:[^BEGHLMOSWYZabcdhmswyz']+)|(?:'(?:[^']|'')*')|(?:G{1,5}|y{1,4}|Y{1,4}|M{1,5}|L{1,5}|w{1,2}|W{1}|d{1,2}|E{1,6}|c{1,6}|a{1,5}|b{1,5}|B{1,5}|h{1,2}|H{1,2}|m{1,2}|s{1,2}|S{1,3}|z{1,4}|Z{1,5}|O{1,4}))([\s\S]*)/;
      var Ge = (() => (
          ((Ge = Ge || {})[(Ge.Short = 0)] = "Short"),
          (Ge[(Ge.ShortGMT = 1)] = "ShortGMT"),
          (Ge[(Ge.Long = 2)] = "Long"),
          (Ge[(Ge.Extended = 3)] = "Extended"),
          Ge
        ))(),
        B = (() => (
          ((B = B || {})[(B.FullYear = 0)] = "FullYear"),
          (B[(B.Month = 1)] = "Month"),
          (B[(B.Date = 2)] = "Date"),
          (B[(B.Hours = 3)] = "Hours"),
          (B[(B.Minutes = 4)] = "Minutes"),
          (B[(B.Seconds = 5)] = "Seconds"),
          (B[(B.FractionalSeconds = 6)] = "FractionalSeconds"),
          (B[(B.Day = 7)] = "Day"),
          B
        ))(),
        Y = (() => (
          ((Y = Y || {})[(Y.DayPeriods = 0)] = "DayPeriods"),
          (Y[(Y.Days = 1)] = "Days"),
          (Y[(Y.Months = 2)] = "Months"),
          (Y[(Y.Eras = 3)] = "Eras"),
          Y
        ))();
      function $F(t, e, n, r) {
        let o = (function YF(t) {
          if (Mw(t)) return t;
          if ("number" == typeof t && !isNaN(t)) return new Date(t);
          if ("string" == typeof t) {
            if (((t = t.trim()), /^(\d{4}(-\d{1,2}(-\d{1,2})?)?)$/.test(t))) {
              const [o, i = 1, s = 1] = t.split("-").map((a) => +a);
              return Ol(o, i - 1, s);
            }
            const n = parseFloat(t);
            if (!isNaN(t - n)) return new Date(n);
            let r;
            if ((r = t.match(HF)))
              return (function XF(t) {
                const e = new Date(0);
                let n = 0,
                  r = 0;
                const o = t[8] ? e.setUTCFullYear : e.setFullYear,
                  i = t[8] ? e.setUTCHours : e.setHours;
                t[9] &&
                  ((n = Number(t[9] + t[10])), (r = Number(t[9] + t[11]))),
                  o.call(e, Number(t[1]), Number(t[2]) - 1, Number(t[3]));
                const s = Number(t[4] || 0) - n,
                  a = Number(t[5] || 0) - r,
                  l = Number(t[6] || 0),
                  u = Math.floor(1e3 * parseFloat("0." + (t[7] || 0)));
                return i.call(e, s, a, l, u), e;
              })(r);
          }
          const e = new Date(t);
          if (!Mw(e)) throw new Error(`Unable to convert "${t}" into a date`);
          return e;
        })(t);
        e = Xn(n, e) || e;
        let a,
          s = [];
        for (; e; ) {
          if (((a = jF.exec(e)), !a)) {
            s.push(e);
            break;
          }
          {
            s = s.concat(a.slice(1));
            const c = s.pop();
            if (!c) break;
            e = c;
          }
        }
        let l = o.getTimezoneOffset();
        r &&
          ((l = Sw(r, l)),
          (o = (function ZF(t, e, n) {
            const r = n ? -1 : 1,
              o = t.getTimezoneOffset();
            return (function QF(t, e) {
              return (
                (t = new Date(t.getTime())).setMinutes(t.getMinutes() + e), t
              );
            })(t, r * (Sw(e, o) - o));
          })(o, r, !0)));
        let u = "";
        return (
          s.forEach((c) => {
            const d = (function KF(t) {
              if (nh[t]) return nh[t];
              let e;
              switch (t) {
                case "G":
                case "GG":
                case "GGG":
                  e = ge(Y.Eras, X.Abbreviated);
                  break;
                case "GGGG":
                  e = ge(Y.Eras, X.Wide);
                  break;
                case "GGGGG":
                  e = ge(Y.Eras, X.Narrow);
                  break;
                case "y":
                  e = ke(B.FullYear, 1, 0, !1, !0);
                  break;
                case "yy":
                  e = ke(B.FullYear, 2, 0, !0, !0);
                  break;
                case "yyy":
                  e = ke(B.FullYear, 3, 0, !1, !0);
                  break;
                case "yyyy":
                  e = ke(B.FullYear, 4, 0, !1, !0);
                  break;
                case "Y":
                  e = Rl(1);
                  break;
                case "YY":
                  e = Rl(2, !0);
                  break;
                case "YYY":
                  e = Rl(3);
                  break;
                case "YYYY":
                  e = Rl(4);
                  break;
                case "M":
                case "L":
                  e = ke(B.Month, 1, 1);
                  break;
                case "MM":
                case "LL":
                  e = ke(B.Month, 2, 1);
                  break;
                case "MMM":
                  e = ge(Y.Months, X.Abbreviated);
                  break;
                case "MMMM":
                  e = ge(Y.Months, X.Wide);
                  break;
                case "MMMMM":
                  e = ge(Y.Months, X.Narrow);
                  break;
                case "LLL":
                  e = ge(Y.Months, X.Abbreviated, Oe.Standalone);
                  break;
                case "LLLL":
                  e = ge(Y.Months, X.Wide, Oe.Standalone);
                  break;
                case "LLLLL":
                  e = ge(Y.Months, X.Narrow, Oe.Standalone);
                  break;
                case "w":
                  e = th(1);
                  break;
                case "ww":
                  e = th(2);
                  break;
                case "W":
                  e = th(1, !0);
                  break;
                case "d":
                  e = ke(B.Date, 1);
                  break;
                case "dd":
                  e = ke(B.Date, 2);
                  break;
                case "c":
                case "cc":
                  e = ke(B.Day, 1);
                  break;
                case "ccc":
                  e = ge(Y.Days, X.Abbreviated, Oe.Standalone);
                  break;
                case "cccc":
                  e = ge(Y.Days, X.Wide, Oe.Standalone);
                  break;
                case "ccccc":
                  e = ge(Y.Days, X.Narrow, Oe.Standalone);
                  break;
                case "cccccc":
                  e = ge(Y.Days, X.Short, Oe.Standalone);
                  break;
                case "E":
                case "EE":
                case "EEE":
                  e = ge(Y.Days, X.Abbreviated);
                  break;
                case "EEEE":
                  e = ge(Y.Days, X.Wide);
                  break;
                case "EEEEE":
                  e = ge(Y.Days, X.Narrow);
                  break;
                case "EEEEEE":
                  e = ge(Y.Days, X.Short);
                  break;
                case "a":
                case "aa":
                case "aaa":
                  e = ge(Y.DayPeriods, X.Abbreviated);
                  break;
                case "aaaa":
                  e = ge(Y.DayPeriods, X.Wide);
                  break;
                case "aaaaa":
                  e = ge(Y.DayPeriods, X.Narrow);
                  break;
                case "b":
                case "bb":
                case "bbb":
                  e = ge(Y.DayPeriods, X.Abbreviated, Oe.Standalone, !0);
                  break;
                case "bbbb":
                  e = ge(Y.DayPeriods, X.Wide, Oe.Standalone, !0);
                  break;
                case "bbbbb":
                  e = ge(Y.DayPeriods, X.Narrow, Oe.Standalone, !0);
                  break;
                case "B":
                case "BB":
                case "BBB":
                  e = ge(Y.DayPeriods, X.Abbreviated, Oe.Format, !0);
                  break;
                case "BBBB":
                  e = ge(Y.DayPeriods, X.Wide, Oe.Format, !0);
                  break;
                case "BBBBB":
                  e = ge(Y.DayPeriods, X.Narrow, Oe.Format, !0);
                  break;
                case "h":
                  e = ke(B.Hours, 1, -12);
                  break;
                case "hh":
                  e = ke(B.Hours, 2, -12);
                  break;
                case "H":
                  e = ke(B.Hours, 1);
                  break;
                case "HH":
                  e = ke(B.Hours, 2);
                  break;
                case "m":
                  e = ke(B.Minutes, 1);
                  break;
                case "mm":
                  e = ke(B.Minutes, 2);
                  break;
                case "s":
                  e = ke(B.Seconds, 1);
                  break;
                case "ss":
                  e = ke(B.Seconds, 2);
                  break;
                case "S":
                  e = ke(B.FractionalSeconds, 1);
                  break;
                case "SS":
                  e = ke(B.FractionalSeconds, 2);
                  break;
                case "SSS":
                  e = ke(B.FractionalSeconds, 3);
                  break;
                case "Z":
                case "ZZ":
                case "ZZZ":
                  e = Nl(Ge.Short);
                  break;
                case "ZZZZZ":
                  e = Nl(Ge.Extended);
                  break;
                case "O":
                case "OO":
                case "OOO":
                case "z":
                case "zz":
                case "zzz":
                  e = Nl(Ge.ShortGMT);
                  break;
                case "OOOO":
                case "ZZZZ":
                case "zzzz":
                  e = Nl(Ge.Long);
                  break;
                default:
                  return null;
              }
              return (nh[t] = e), e;
            })(c);
            u += d
              ? d(o, n, l)
              : "''" === c
              ? "'"
              : c.replace(/(^'|'$)/g, "").replace(/''/g, "'");
          }),
          u
        );
      }
      function Ol(t, e, n) {
        const r = new Date(0);
        return r.setFullYear(t, e, n), r.setHours(0, 0, 0), r;
      }
      function Xn(t, e) {
        const n = (function AF(t) {
          return ut(t)[M.LocaleId];
        })(t);
        if (((ps[n] = ps[n] || {}), ps[n][e])) return ps[n][e];
        let r = "";
        switch (e) {
          case "shortDate":
            r = Tl(t, be.Short);
            break;
          case "mediumDate":
            r = Tl(t, be.Medium);
            break;
          case "longDate":
            r = Tl(t, be.Long);
            break;
          case "fullDate":
            r = Tl(t, be.Full);
            break;
          case "shortTime":
            r = Al(t, be.Short);
            break;
          case "mediumTime":
            r = Al(t, be.Medium);
            break;
          case "longTime":
            r = Al(t, be.Long);
            break;
          case "fullTime":
            r = Al(t, be.Full);
            break;
          case "short":
            const o = Xn(t, "shortTime"),
              i = Xn(t, "shortDate");
            r = Pl(Il(t, be.Short), [o, i]);
            break;
          case "medium":
            const s = Xn(t, "mediumTime"),
              a = Xn(t, "mediumDate");
            r = Pl(Il(t, be.Medium), [s, a]);
            break;
          case "long":
            const l = Xn(t, "longTime"),
              u = Xn(t, "longDate");
            r = Pl(Il(t, be.Long), [l, u]);
            break;
          case "full":
            const c = Xn(t, "fullTime"),
              d = Xn(t, "fullDate");
            r = Pl(Il(t, be.Full), [c, d]);
        }
        return r && (ps[n][e] = r), r;
      }
      function Pl(t, e) {
        return (
          e &&
            (t = t.replace(/\{([^}]+)}/g, function (n, r) {
              return null != e && r in e ? e[r] : n;
            })),
          t
        );
      }
      function sn(t, e, n = "-", r, o) {
        let i = "";
        (t < 0 || (o && t <= 0)) && (o ? (t = 1 - t) : ((t = -t), (i = n)));
        let s = String(t);
        for (; s.length < e; ) s = "0" + s;
        return r && (s = s.slice(s.length - e)), i + s;
      }
      function ke(t, e, n = 0, r = !1, o = !1) {
        return function (i, s) {
          let a = (function zF(t, e) {
            switch (t) {
              case B.FullYear:
                return e.getFullYear();
              case B.Month:
                return e.getMonth();
              case B.Date:
                return e.getDate();
              case B.Hours:
                return e.getHours();
              case B.Minutes:
                return e.getMinutes();
              case B.Seconds:
                return e.getSeconds();
              case B.FractionalSeconds:
                return e.getMilliseconds();
              case B.Day:
                return e.getDay();
              default:
                throw new Error(`Unknown DateType value "${t}".`);
            }
          })(t, i);
          if (((n > 0 || a > -n) && (a += n), t === B.Hours))
            0 === a && -12 === n && (a = 12);
          else if (t === B.FractionalSeconds)
            return (function UF(t, e) {
              return sn(t, 3).substring(0, e);
            })(a, e);
          const l = zt(s, L.MinusSign);
          return sn(a, e, l, r, o);
        };
      }
      function ge(t, e, n = Oe.Format, r = !1) {
        return function (o, i) {
          return (function qF(t, e, n, r, o, i) {
            switch (n) {
              case Y.Months:
                return (function PF(t, e, n) {
                  const r = ut(t),
                    i = qt([r[M.MonthsFormat], r[M.MonthsStandalone]], e);
                  return qt(i, n);
                })(e, o, r)[t.getMonth()];
              case Y.Days:
                return (function OF(t, e, n) {
                  const r = ut(t),
                    i = qt([r[M.DaysFormat], r[M.DaysStandalone]], e);
                  return qt(i, n);
                })(e, o, r)[t.getDay()];
              case Y.DayPeriods:
                const s = t.getHours(),
                  a = t.getMinutes();
                if (i) {
                  const u = (function FF(t) {
                      const e = ut(t);
                      return (
                        bw(e),
                        (e[M.ExtraData][2] || []).map((r) =>
                          "string" == typeof r ? eh(r) : [eh(r[0]), eh(r[1])]
                        )
                      );
                    })(e),
                    c = (function kF(t, e, n) {
                      const r = ut(t);
                      bw(r);
                      const i =
                        qt([r[M.ExtraData][0], r[M.ExtraData][1]], e) || [];
                      return qt(i, n) || [];
                    })(e, o, r),
                    d = u.findIndex((f) => {
                      if (Array.isArray(f)) {
                        const [h, p] = f,
                          g = s >= h.hours && a >= h.minutes,
                          y = s < p.hours || (s === p.hours && a < p.minutes);
                        if (h.hours < p.hours) {
                          if (g && y) return !0;
                        } else if (g || y) return !0;
                      } else if (f.hours === s && f.minutes === a) return !0;
                      return !1;
                    });
                  if (-1 !== d) return c[d];
                }
                return (function IF(t, e, n) {
                  const r = ut(t),
                    i = qt(
                      [r[M.DayPeriodsFormat], r[M.DayPeriodsStandalone]],
                      e
                    );
                  return qt(i, n);
                })(e, o, r)[s < 12 ? 0 : 1];
              case Y.Eras:
                return (function NF(t, e) {
                  return qt(ut(t)[M.Eras], e);
                })(e, r)[t.getFullYear() <= 0 ? 0 : 1];
              default:
                throw new Error(`unexpected translation type ${n}`);
            }
          })(o, i, t, e, n, r);
        };
      }
      function Nl(t) {
        return function (e, n, r) {
          const o = -1 * r,
            i = zt(n, L.MinusSign),
            s = o > 0 ? Math.floor(o / 60) : Math.ceil(o / 60);
          switch (t) {
            case Ge.Short:
              return (
                (o >= 0 ? "+" : "") + sn(s, 2, i) + sn(Math.abs(o % 60), 2, i)
              );
            case Ge.ShortGMT:
              return "GMT" + (o >= 0 ? "+" : "") + sn(s, 1, i);
            case Ge.Long:
              return (
                "GMT" +
                (o >= 0 ? "+" : "") +
                sn(s, 2, i) +
                ":" +
                sn(Math.abs(o % 60), 2, i)
              );
            case Ge.Extended:
              return 0 === r
                ? "Z"
                : (o >= 0 ? "+" : "") +
                    sn(s, 2, i) +
                    ":" +
                    sn(Math.abs(o % 60), 2, i);
            default:
              throw new Error(`Unknown zone width "${t}"`);
          }
        };
      }
      const GF = 0,
        xl = 4;
      function Ew(t) {
        return Ol(
          t.getFullYear(),
          t.getMonth(),
          t.getDate() + (xl - t.getDay())
        );
      }
      function th(t, e = !1) {
        return function (n, r) {
          let o;
          if (e) {
            const i = new Date(n.getFullYear(), n.getMonth(), 1).getDay() - 1,
              s = n.getDate();
            o = 1 + Math.floor((s + i) / 7);
          } else {
            const i = Ew(n),
              s = (function WF(t) {
                const e = Ol(t, GF, 1).getDay();
                return Ol(t, 0, 1 + (e <= xl ? xl : xl + 7) - e);
              })(i.getFullYear()),
              a = i.getTime() - s.getTime();
            o = 1 + Math.round(a / 6048e5);
          }
          return sn(o, t, zt(r, L.MinusSign));
        };
      }
      function Rl(t, e = !1) {
        return function (n, r) {
          return sn(Ew(n).getFullYear(), t, zt(r, L.MinusSign), e);
        };
      }
      const nh = {};
      function Sw(t, e) {
        t = t.replace(/:/g, "");
        const n = Date.parse("Jan 01, 1970 00:00:00 " + t) / 6e4;
        return isNaN(n) ? e : n;
      }
      function Mw(t) {
        return t instanceof Date && !isNaN(t.valueOf());
      }
      function Ow(t, e) {
        e = encodeURIComponent(e);
        for (const n of t.split(";")) {
          const r = n.indexOf("="),
            [o, i] = -1 == r ? [n, ""] : [n.slice(0, r), n.slice(r + 1)];
          if (o.trim() === e) return decodeURIComponent(i);
        }
        return null;
      }
      class fk {
        constructor(e, n, r, o) {
          (this.$implicit = e),
            (this.ngForOf = n),
            (this.index = r),
            (this.count = o);
        }
        get first() {
          return 0 === this.index;
        }
        get last() {
          return this.index === this.count - 1;
        }
        get even() {
          return this.index % 2 == 0;
        }
        get odd() {
          return !this.even;
        }
      }
      let kl = (() => {
        class t {
          set ngForOf(n) {
            (this._ngForOf = n), (this._ngForOfDirty = !0);
          }
          set ngForTrackBy(n) {
            this._trackByFn = n;
          }
          get ngForTrackBy() {
            return this._trackByFn;
          }
          constructor(n, r, o) {
            (this._viewContainer = n),
              (this._template = r),
              (this._differs = o),
              (this._ngForOf = null),
              (this._ngForOfDirty = !0),
              (this._differ = null);
          }
          set ngForTemplate(n) {
            n && (this._template = n);
          }
          ngDoCheck() {
            if (this._ngForOfDirty) {
              this._ngForOfDirty = !1;
              const n = this._ngForOf;
              !this._differ &&
                n &&
                (this._differ = this._differs
                  .find(n)
                  .create(this.ngForTrackBy));
            }
            if (this._differ) {
              const n = this._differ.diff(this._ngForOf);
              n && this._applyChanges(n);
            }
          }
          _applyChanges(n) {
            const r = this._viewContainer;
            n.forEachOperation((o, i, s) => {
              if (null == o.previousIndex)
                r.createEmbeddedView(
                  this._template,
                  new fk(o.item, this._ngForOf, -1, -1),
                  null === s ? void 0 : s
                );
              else if (null == s) r.remove(null === i ? void 0 : i);
              else if (null !== i) {
                const a = r.get(i);
                r.move(a, s), xw(a, o);
              }
            });
            for (let o = 0, i = r.length; o < i; o++) {
              const a = r.get(o).context;
              (a.index = o), (a.count = i), (a.ngForOf = this._ngForOf);
            }
            n.forEachIdentityChange((o) => {
              xw(r.get(o.currentIndex), o);
            });
          }
          static ngTemplateContextGuard(n, r) {
            return !0;
          }
        }
        return (
          (t.ɵfac = function (n) {
            return new (n || t)(C(rn), C(Qn), C(Sl));
          }),
          (t.ɵdir = U({
            type: t,
            selectors: [["", "ngFor", "", "ngForOf", ""]],
            inputs: {
              ngForOf: "ngForOf",
              ngForTrackBy: "ngForTrackBy",
              ngForTemplate: "ngForTemplate",
            },
            standalone: !0,
          })),
          t
        );
      })();
      function xw(t, e) {
        t.context.$implicit = e.item;
      }
      let Ll = (() => {
        class t {
          constructor(n, r) {
            (this._viewContainer = n),
              (this._context = new hk()),
              (this._thenTemplateRef = null),
              (this._elseTemplateRef = null),
              (this._thenViewRef = null),
              (this._elseViewRef = null),
              (this._thenTemplateRef = r);
          }
          set ngIf(n) {
            (this._context.$implicit = this._context.ngIf = n),
              this._updateView();
          }
          set ngIfThen(n) {
            Rw("ngIfThen", n),
              (this._thenTemplateRef = n),
              (this._thenViewRef = null),
              this._updateView();
          }
          set ngIfElse(n) {
            Rw("ngIfElse", n),
              (this._elseTemplateRef = n),
              (this._elseViewRef = null),
              this._updateView();
          }
          _updateView() {
            this._context.$implicit
              ? this._thenViewRef ||
                (this._viewContainer.clear(),
                (this._elseViewRef = null),
                this._thenTemplateRef &&
                  (this._thenViewRef = this._viewContainer.createEmbeddedView(
                    this._thenTemplateRef,
                    this._context
                  )))
              : this._elseViewRef ||
                (this._viewContainer.clear(),
                (this._thenViewRef = null),
                this._elseTemplateRef &&
                  (this._elseViewRef = this._viewContainer.createEmbeddedView(
                    this._elseTemplateRef,
                    this._context
                  )));
          }
          static ngTemplateContextGuard(n, r) {
            return !0;
          }
        }
        return (
          (t.ɵfac = function (n) {
            return new (n || t)(C(rn), C(Qn));
          }),
          (t.ɵdir = U({
            type: t,
            selectors: [["", "ngIf", ""]],
            inputs: {
              ngIf: "ngIf",
              ngIfThen: "ngIfThen",
              ngIfElse: "ngIfElse",
            },
            standalone: !0,
          })),
          t
        );
      })();
      class hk {
        constructor() {
          (this.$implicit = null), (this.ngIf = null);
        }
      }
      function Rw(t, e) {
        if (e && !e.createEmbeddedView)
          throw new Error(
            `${t} must be a TemplateRef, but received '${$e(e)}'.`
          );
      }
      const Mk = new O("DATE_PIPE_DEFAULT_TIMEZONE"),
        Tk = new O("DATE_PIPE_DEFAULT_OPTIONS");
      let kw = (() => {
          class t {
            constructor(n, r, o) {
              (this.locale = n),
                (this.defaultTimezone = r),
                (this.defaultOptions = o);
            }
            transform(n, r, o, i) {
              if (null == n || "" === n || n != n) return null;
              try {
                return $F(
                  n,
                  r ?? this.defaultOptions?.dateFormat ?? "mediumDate",
                  i || this.locale,
                  o ??
                    this.defaultOptions?.timezone ??
                    this.defaultTimezone ??
                    void 0
                );
              } catch (s) {
                throw (function an(t, e) {
                  return new v(2100, !1);
                })();
              }
            }
          }
          return (
            (t.ɵfac = function (n) {
              return new (n || t)(C(Zn, 16), C(Mk, 24), C(Tk, 24));
            }),
            (t.ɵpipe = yt({ name: "date", type: t, pure: !0, standalone: !0 })),
            t
          );
        })(),
        Lk = (() => {
          class t {}
          return (
            (t.ɵfac = function (n) {
              return new (n || t)();
            }),
            (t.ɵmod = Mt({ type: t })),
            (t.ɵinj = pt({})),
            t
          );
        })();
      function Bw(t) {
        return "server" === t;
      }
      let jk = (() => {
        class t {}
        return (
          (t.ɵprov = N({
            token: t,
            providedIn: "root",
            factory: () => new $k(I(dt), window),
          })),
          t
        );
      })();
      class $k {
        constructor(e, n) {
          (this.document = e), (this.window = n), (this.offset = () => [0, 0]);
        }
        setOffset(e) {
          this.offset = Array.isArray(e) ? () => e : e;
        }
        getScrollPosition() {
          return this.supportsScrolling()
            ? [this.window.pageXOffset, this.window.pageYOffset]
            : [0, 0];
        }
        scrollToPosition(e) {
          this.supportsScrolling() && this.window.scrollTo(e[0], e[1]);
        }
        scrollToAnchor(e) {
          if (!this.supportsScrolling()) return;
          const n = (function Uk(t, e) {
            const n = t.getElementById(e) || t.getElementsByName(e)[0];
            if (n) return n;
            if (
              "function" == typeof t.createTreeWalker &&
              t.body &&
              "function" == typeof t.body.attachShadow
            ) {
              const r = t.createTreeWalker(t.body, NodeFilter.SHOW_ELEMENT);
              let o = r.currentNode;
              for (; o; ) {
                const i = o.shadowRoot;
                if (i) {
                  const s =
                    i.getElementById(e) || i.querySelector(`[name="${e}"]`);
                  if (s) return s;
                }
                o = r.nextNode();
              }
            }
            return null;
          })(this.document, e);
          n && (this.scrollToElement(n), n.focus());
        }
        setHistoryScrollRestoration(e) {
          if (this.supportScrollRestoration()) {
            const n = this.window.history;
            n && n.scrollRestoration && (n.scrollRestoration = e);
          }
        }
        scrollToElement(e) {
          const n = e.getBoundingClientRect(),
            r = n.left + this.window.pageXOffset,
            o = n.top + this.window.pageYOffset,
            i = this.offset();
          this.window.scrollTo(r - i[0], o - i[1]);
        }
        supportScrollRestoration() {
          try {
            if (!this.supportsScrolling()) return !1;
            const e =
              Hw(this.window.history) ||
              Hw(Object.getPrototypeOf(this.window.history));
            return !(!e || (!e.writable && !e.set));
          } catch {
            return !1;
          }
        }
        supportsScrolling() {
          try {
            return (
              !!this.window &&
              !!this.window.scrollTo &&
              "pageXOffset" in this.window
            );
          } catch {
            return !1;
          }
        }
      }
      function Hw(t) {
        return Object.getOwnPropertyDescriptor(t, "scrollRestoration");
      }
      class jw {}
      class fL extends DF {
        constructor() {
          super(...arguments), (this.supportsDOMEvents = !0);
        }
      }
      class gh extends fL {
        static makeCurrent() {
          !(function CF(t) {
            Qf || (Qf = t);
          })(new gh());
        }
        onAndCancel(e, n, r) {
          return (
            e.addEventListener(n, r),
            () => {
              e.removeEventListener(n, r);
            }
          );
        }
        dispatchEvent(e, n) {
          e.dispatchEvent(n);
        }
        remove(e) {
          e.parentNode && e.parentNode.removeChild(e);
        }
        createElement(e, n) {
          return (n = n || this.getDefaultDocument()).createElement(e);
        }
        createHtmlDocument() {
          return document.implementation.createHTMLDocument("fakeTitle");
        }
        getDefaultDocument() {
          return document;
        }
        isElementNode(e) {
          return e.nodeType === Node.ELEMENT_NODE;
        }
        isShadowRoot(e) {
          return e instanceof DocumentFragment;
        }
        getGlobalEventTarget(e, n) {
          return "window" === n
            ? window
            : "document" === n
            ? e
            : "body" === n
            ? e.body
            : null;
        }
        getBaseHref(e) {
          const n = (function hL() {
            return (
              (ys = ys || document.querySelector("base")),
              ys ? ys.getAttribute("href") : null
            );
          })();
          return null == n
            ? null
            : (function pL(t) {
                (Hl = Hl || document.createElement("a")),
                  Hl.setAttribute("href", t);
                const e = Hl.pathname;
                return "/" === e.charAt(0) ? e : `/${e}`;
              })(n);
        }
        resetBaseElement() {
          ys = null;
        }
        getUserAgent() {
          return window.navigator.userAgent;
        }
        getCookie(e) {
          return Ow(document.cookie, e);
        }
      }
      let Hl,
        ys = null,
        mL = (() => {
          class t {
            build() {
              return new XMLHttpRequest();
            }
          }
          return (
            (t.ɵfac = function (n) {
              return new (n || t)();
            }),
            (t.ɵprov = N({ token: t, factory: t.ɵfac })),
            t
          );
        })();
      const mh = new O("EventManagerPlugins");
      let Gw = (() => {
        class t {
          constructor(n, r) {
            (this._zone = r),
              (this._eventNameToPlugin = new Map()),
              n.forEach((o) => {
                o.manager = this;
              }),
              (this._plugins = n.slice().reverse());
          }
          addEventListener(n, r, o) {
            return this._findPluginFor(r).addEventListener(n, r, o);
          }
          getZone() {
            return this._zone;
          }
          _findPluginFor(n) {
            let r = this._eventNameToPlugin.get(n);
            if (r) return r;
            if (((r = this._plugins.find((i) => i.supports(n))), !r))
              throw new v(5101, !1);
            return this._eventNameToPlugin.set(n, r), r;
          }
        }
        return (
          (t.ɵfac = function (n) {
            return new (n || t)(I(mh), I(ye));
          }),
          (t.ɵprov = N({ token: t, factory: t.ɵfac })),
          t
        );
      })();
      class Ww {
        constructor(e) {
          this._doc = e;
        }
      }
      const yh = "ng-app-id";
      let Kw = (() => {
        class t {
          constructor(n, r, o, i = {}) {
            (this.doc = n),
              (this.appId = r),
              (this.nonce = o),
              (this.platformId = i),
              (this.styleRef = new Map()),
              (this.hostNodes = new Set()),
              (this.styleNodesInDOM = this.collectServerRenderedStyles()),
              (this.platformIsServer = Bw(i)),
              this.resetHostNodes();
          }
          addStyles(n) {
            for (const r of n)
              1 === this.changeUsageCount(r, 1) && this.onStyleAdded(r);
          }
          removeStyles(n) {
            for (const r of n)
              this.changeUsageCount(r, -1) <= 0 && this.onStyleRemoved(r);
          }
          ngOnDestroy() {
            const n = this.styleNodesInDOM;
            n && (n.forEach((r) => r.remove()), n.clear());
            for (const r of this.getAllStyles()) this.onStyleRemoved(r);
            this.resetHostNodes();
          }
          addHost(n) {
            this.hostNodes.add(n);
            for (const r of this.getAllStyles()) this.addStyleToHost(n, r);
          }
          removeHost(n) {
            this.hostNodes.delete(n);
          }
          getAllStyles() {
            return this.styleRef.keys();
          }
          onStyleAdded(n) {
            for (const r of this.hostNodes) this.addStyleToHost(r, n);
          }
          onStyleRemoved(n) {
            const r = this.styleRef;
            r.get(n)?.elements?.forEach((o) => o.remove()), r.delete(n);
          }
          collectServerRenderedStyles() {
            const n = this.doc.head?.querySelectorAll(
              `style[${yh}="${this.appId}"]`
            );
            if (n?.length) {
              const r = new Map();
              return (
                n.forEach((o) => {
                  null != o.textContent && r.set(o.textContent, o);
                }),
                r
              );
            }
            return null;
          }
          changeUsageCount(n, r) {
            const o = this.styleRef;
            if (o.has(n)) {
              const i = o.get(n);
              return (i.usage += r), i.usage;
            }
            return o.set(n, { usage: r, elements: [] }), r;
          }
          getStyleElement(n, r) {
            const o = this.styleNodesInDOM,
              i = o?.get(r);
            if (i?.parentNode === n)
              return o.delete(r), i.removeAttribute(yh), i;
            {
              const s = this.doc.createElement("style");
              return (
                this.nonce && s.setAttribute("nonce", this.nonce),
                (s.textContent = r),
                this.platformIsServer && s.setAttribute(yh, this.appId),
                s
              );
            }
          }
          addStyleToHost(n, r) {
            const o = this.getStyleElement(n, r);
            n.appendChild(o);
            const i = this.styleRef,
              s = i.get(r)?.elements;
            s ? s.push(o) : i.set(r, { elements: [o], usage: 1 });
          }
          resetHostNodes() {
            const n = this.hostNodes;
            n.clear(), n.add(this.doc.head);
          }
        }
        return (
          (t.ɵfac = function (n) {
            return new (n || t)(I(dt), I(Ga), I(ov, 8), I(Lr));
          }),
          (t.ɵprov = N({ token: t, factory: t.ɵfac })),
          t
        );
      })();
      const vh = {
          svg: "http://www.w3.org/2000/svg",
          xhtml: "http://www.w3.org/1999/xhtml",
          xlink: "http://www.w3.org/1999/xlink",
          xml: "http://www.w3.org/XML/1998/namespace",
          xmlns: "http://www.w3.org/2000/xmlns/",
          math: "http://www.w3.org/1998/MathML/",
        },
        _h = /%COMP%/g,
        CL = new O("RemoveStylesOnCompDestory", {
          providedIn: "root",
          factory: () => !1,
        });
      function Zw(t, e) {
        return e.map((n) => n.replace(_h, t));
      }
      let Ch = (() => {
        class t {
          constructor(n, r, o, i, s, a, l, u = null) {
            (this.eventManager = n),
              (this.sharedStylesHost = r),
              (this.appId = o),
              (this.removeStylesOnCompDestory = i),
              (this.doc = s),
              (this.platformId = a),
              (this.ngZone = l),
              (this.nonce = u),
              (this.rendererByCompId = new Map()),
              (this.platformIsServer = Bw(a)),
              (this.defaultRenderer = new Dh(n, s, l, this.platformIsServer));
          }
          createRenderer(n, r) {
            if (!n || !r) return this.defaultRenderer;
            this.platformIsServer &&
              r.encapsulation === mt.ShadowDom &&
              (r = { ...r, encapsulation: mt.Emulated });
            const o = this.getOrCreateRenderer(n, r);
            return (
              o instanceof Xw
                ? o.applyToHost(n)
                : o instanceof wh && o.applyStyles(),
              o
            );
          }
          getOrCreateRenderer(n, r) {
            const o = this.rendererByCompId;
            let i = o.get(r.id);
            if (!i) {
              const s = this.doc,
                a = this.ngZone,
                l = this.eventManager,
                u = this.sharedStylesHost,
                c = this.removeStylesOnCompDestory,
                d = this.platformIsServer;
              switch (r.encapsulation) {
                case mt.Emulated:
                  i = new Xw(l, u, r, this.appId, c, s, a, d);
                  break;
                case mt.ShadowDom:
                  return new EL(l, u, n, r, s, a, this.nonce, d);
                default:
                  i = new wh(l, u, r, c, s, a, d);
              }
              (i.onDestroy = () => o.delete(r.id)), o.set(r.id, i);
            }
            return i;
          }
          ngOnDestroy() {
            this.rendererByCompId.clear();
          }
        }
        return (
          (t.ɵfac = function (n) {
            return new (n || t)(
              I(Gw),
              I(Kw),
              I(Ga),
              I(CL),
              I(dt),
              I(Lr),
              I(ye),
              I(ov)
            );
          }),
          (t.ɵprov = N({ token: t, factory: t.ɵfac })),
          t
        );
      })();
      class Dh {
        constructor(e, n, r, o) {
          (this.eventManager = e),
            (this.doc = n),
            (this.ngZone = r),
            (this.platformIsServer = o),
            (this.data = Object.create(null)),
            (this.destroyNode = null);
        }
        destroy() {}
        createElement(e, n) {
          return n
            ? this.doc.createElementNS(vh[n] || n, e)
            : this.doc.createElement(e);
        }
        createComment(e) {
          return this.doc.createComment(e);
        }
        createText(e) {
          return this.doc.createTextNode(e);
        }
        appendChild(e, n) {
          (Yw(e) ? e.content : e).appendChild(n);
        }
        insertBefore(e, n, r) {
          e && (Yw(e) ? e.content : e).insertBefore(n, r);
        }
        removeChild(e, n) {
          e && e.removeChild(n);
        }
        selectRootElement(e, n) {
          let r = "string" == typeof e ? this.doc.querySelector(e) : e;
          if (!r) throw new v(5104, !1);
          return n || (r.textContent = ""), r;
        }
        parentNode(e) {
          return e.parentNode;
        }
        nextSibling(e) {
          return e.nextSibling;
        }
        setAttribute(e, n, r, o) {
          if (o) {
            n = o + ":" + n;
            const i = vh[o];
            i ? e.setAttributeNS(i, n, r) : e.setAttribute(n, r);
          } else e.setAttribute(n, r);
        }
        removeAttribute(e, n, r) {
          if (r) {
            const o = vh[r];
            o ? e.removeAttributeNS(o, n) : e.removeAttribute(`${r}:${n}`);
          } else e.removeAttribute(n);
        }
        addClass(e, n) {
          e.classList.add(n);
        }
        removeClass(e, n) {
          e.classList.remove(n);
        }
        setStyle(e, n, r, o) {
          o & (Dt.DashCase | Dt.Important)
            ? e.style.setProperty(n, r, o & Dt.Important ? "important" : "")
            : (e.style[n] = r);
        }
        removeStyle(e, n, r) {
          r & Dt.DashCase ? e.style.removeProperty(n) : (e.style[n] = "");
        }
        setProperty(e, n, r) {
          e[n] = r;
        }
        setValue(e, n) {
          e.nodeValue = n;
        }
        listen(e, n, r) {
          if (
            "string" == typeof e &&
            !(e = gr().getGlobalEventTarget(this.doc, e))
          )
            throw new Error(`Unsupported event target ${e} for event ${n}`);
          return this.eventManager.addEventListener(
            e,
            n,
            this.decoratePreventDefault(r)
          );
        }
        decoratePreventDefault(e) {
          return (n) => {
            if ("__ngUnwrap__" === n) return e;
            !1 ===
              (this.platformIsServer
                ? this.ngZone.runGuarded(() => e(n))
                : e(n)) && n.preventDefault();
          };
        }
      }
      function Yw(t) {
        return "TEMPLATE" === t.tagName && void 0 !== t.content;
      }
      class EL extends Dh {
        constructor(e, n, r, o, i, s, a, l) {
          super(e, i, s, l),
            (this.sharedStylesHost = n),
            (this.hostEl = r),
            (this.shadowRoot = r.attachShadow({ mode: "open" })),
            this.sharedStylesHost.addHost(this.shadowRoot);
          const u = Zw(o.id, o.styles);
          for (const c of u) {
            const d = document.createElement("style");
            a && d.setAttribute("nonce", a),
              (d.textContent = c),
              this.shadowRoot.appendChild(d);
          }
        }
        nodeOrShadowRoot(e) {
          return e === this.hostEl ? this.shadowRoot : e;
        }
        appendChild(e, n) {
          return super.appendChild(this.nodeOrShadowRoot(e), n);
        }
        insertBefore(e, n, r) {
          return super.insertBefore(this.nodeOrShadowRoot(e), n, r);
        }
        removeChild(e, n) {
          return super.removeChild(this.nodeOrShadowRoot(e), n);
        }
        parentNode(e) {
          return this.nodeOrShadowRoot(
            super.parentNode(this.nodeOrShadowRoot(e))
          );
        }
        destroy() {
          this.sharedStylesHost.removeHost(this.shadowRoot);
        }
      }
      class wh extends Dh {
        constructor(e, n, r, o, i, s, a, l) {
          super(e, i, s, a),
            (this.sharedStylesHost = n),
            (this.removeStylesOnCompDestory = o),
            (this.rendererUsageCount = 0),
            (this.styles = l ? Zw(l, r.styles) : r.styles);
        }
        applyStyles() {
          this.sharedStylesHost.addStyles(this.styles),
            this.rendererUsageCount++;
        }
        destroy() {
          this.removeStylesOnCompDestory &&
            (this.sharedStylesHost.removeStyles(this.styles),
            this.rendererUsageCount--,
            0 === this.rendererUsageCount && this.onDestroy?.());
        }
      }
      class Xw extends wh {
        constructor(e, n, r, o, i, s, a, l) {
          const u = o + "-" + r.id;
          super(e, n, r, i, s, a, l, u),
            (this.contentAttr = (function DL(t) {
              return "_ngcontent-%COMP%".replace(_h, t);
            })(u)),
            (this.hostAttr = (function wL(t) {
              return "_nghost-%COMP%".replace(_h, t);
            })(u));
        }
        applyToHost(e) {
          this.applyStyles(), this.setAttribute(e, this.hostAttr, "");
        }
        createElement(e, n) {
          const r = super.createElement(e, n);
          return super.setAttribute(r, this.contentAttr, ""), r;
        }
      }
      let SL = (() => {
        class t extends Ww {
          constructor(n) {
            super(n);
          }
          supports(n) {
            return !0;
          }
          addEventListener(n, r, o) {
            return (
              n.addEventListener(r, o, !1),
              () => this.removeEventListener(n, r, o)
            );
          }
          removeEventListener(n, r, o) {
            return n.removeEventListener(r, o);
          }
        }
        return (
          (t.ɵfac = function (n) {
            return new (n || t)(I(dt));
          }),
          (t.ɵprov = N({ token: t, factory: t.ɵfac })),
          t
        );
      })();
      const Jw = ["alt", "control", "meta", "shift"],
        ML = {
          "\b": "Backspace",
          "\t": "Tab",
          "\x7f": "Delete",
          "\x1b": "Escape",
          Del: "Delete",
          Esc: "Escape",
          Left: "ArrowLeft",
          Right: "ArrowRight",
          Up: "ArrowUp",
          Down: "ArrowDown",
          Menu: "ContextMenu",
          Scroll: "ScrollLock",
          Win: "OS",
        },
        TL = {
          alt: (t) => t.altKey,
          control: (t) => t.ctrlKey,
          meta: (t) => t.metaKey,
          shift: (t) => t.shiftKey,
        };
      let AL = (() => {
        class t extends Ww {
          constructor(n) {
            super(n);
          }
          supports(n) {
            return null != t.parseEventName(n);
          }
          addEventListener(n, r, o) {
            const i = t.parseEventName(r),
              s = t.eventCallback(i.fullKey, o, this.manager.getZone());
            return this.manager
              .getZone()
              .runOutsideAngular(() => gr().onAndCancel(n, i.domEventName, s));
          }
          static parseEventName(n) {
            const r = n.toLowerCase().split("."),
              o = r.shift();
            if (0 === r.length || ("keydown" !== o && "keyup" !== o))
              return null;
            const i = t._normalizeKey(r.pop());
            let s = "",
              a = r.indexOf("code");
            if (
              (a > -1 && (r.splice(a, 1), (s = "code.")),
              Jw.forEach((u) => {
                const c = r.indexOf(u);
                c > -1 && (r.splice(c, 1), (s += u + "."));
              }),
              (s += i),
              0 != r.length || 0 === i.length)
            )
              return null;
            const l = {};
            return (l.domEventName = o), (l.fullKey = s), l;
          }
          static matchEventFullKeyCode(n, r) {
            let o = ML[n.key] || n.key,
              i = "";
            return (
              r.indexOf("code.") > -1 && ((o = n.code), (i = "code.")),
              !(null == o || !o) &&
                ((o = o.toLowerCase()),
                " " === o ? (o = "space") : "." === o && (o = "dot"),
                Jw.forEach((s) => {
                  s !== o && (0, TL[s])(n) && (i += s + ".");
                }),
                (i += o),
                i === r)
            );
          }
          static eventCallback(n, r, o) {
            return (i) => {
              t.matchEventFullKeyCode(i, n) && o.runGuarded(() => r(i));
            };
          }
          static _normalizeKey(n) {
            return "esc" === n ? "escape" : n;
          }
        }
        return (
          (t.ɵfac = function (n) {
            return new (n || t)(I(dt));
          }),
          (t.ɵprov = N({ token: t, factory: t.ɵfac })),
          t
        );
      })();
      const NL = KD(lF, "browser", [
          { provide: Lr, useValue: "browser" },
          {
            provide: nv,
            useValue: function IL() {
              gh.makeCurrent();
            },
            multi: !0,
          },
          {
            provide: dt,
            useFactory: function PL() {
              return (
                (function kI(t) {
                  ad = t;
                })(document),
                document
              );
            },
            deps: [],
          },
        ]),
        xL = new O(""),
        nb = [
          {
            provide: Cl,
            useClass: class gL {
              addToWindow(e) {
                (pe.getAngularTestability = (r, o = !0) => {
                  const i = e.findTestabilityInTree(r, o);
                  if (null == i) throw new v(5103, !1);
                  return i;
                }),
                  (pe.getAllAngularTestabilities = () =>
                    e.getAllTestabilities()),
                  (pe.getAllAngularRootElements = () => e.getAllRootElements()),
                  pe.frameworkStabilizers || (pe.frameworkStabilizers = []),
                  pe.frameworkStabilizers.push((r) => {
                    const o = pe.getAllAngularTestabilities();
                    let i = o.length,
                      s = !1;
                    const a = function (l) {
                      (s = s || l), i--, 0 == i && r(s);
                    };
                    o.forEach(function (l) {
                      l.whenStable(a);
                    });
                  });
              }
              findTestabilityInTree(e, n, r) {
                return null == n
                  ? null
                  : e.getTestability(n) ??
                      (r
                        ? gr().isShadowRoot(n)
                          ? this.findTestabilityInTree(e, n.host, !0)
                          : this.findTestabilityInTree(e, n.parentElement, !0)
                        : null);
              }
            },
            deps: [],
          },
          { provide: UD, useClass: Lf, deps: [ye, Vf, Cl] },
          { provide: Lf, useClass: Lf, deps: [ye, Vf, Cl] },
        ],
        rb = [
          { provide: vd, useValue: "root" },
          {
            provide: Vr,
            useFactory: function OL() {
              return new Vr();
            },
            deps: [],
          },
          { provide: mh, useClass: SL, multi: !0, deps: [dt, ye, Lr] },
          { provide: mh, useClass: AL, multi: !0, deps: [dt] },
          Ch,
          Kw,
          Gw,
          { provide: qi, useExisting: Ch },
          { provide: jw, useClass: mL, deps: [] },
          [],
        ];
      let ob = (() => {
          class t {
            constructor(n) {}
            static withServerTransition(n) {
              return {
                ngModule: t,
                providers: [{ provide: Ga, useValue: n.appId }],
              };
            }
          }
          return (
            (t.ɵfac = function (n) {
              return new (n || t)(I(xL, 12));
            }),
            (t.ɵmod = Mt({ type: t })),
            (t.ɵinj = pt({ providers: [...rb, ...nb], imports: [Lk, uF] })),
            t
          );
        })(),
        ib = (() => {
          class t {
            constructor(n) {
              this._doc = n;
            }
            getTitle() {
              return this._doc.title;
            }
            setTitle(n) {
              this._doc.title = n || "";
            }
          }
          return (
            (t.ɵfac = function (n) {
              return new (n || t)(I(dt));
            }),
            (t.ɵprov = N({
              token: t,
              factory: function (n) {
                let r = null;
                return (
                  (r = n
                    ? new n()
                    : (function FL() {
                        return new ib(I(dt));
                      })()),
                  r
                );
              },
              providedIn: "root",
            })),
            t
          );
        })();
      function ub(t, e, n, r, o, i, s) {
        try {
          var a = t[i](s),
            l = a.value;
        } catch (u) {
          return void n(u);
        }
        a.done ? e(l) : Promise.resolve(l).then(r, o);
      }
      typeof window < "u" && window;
      const { isArray: $L } = Array,
        { getPrototypeOf: UL, prototype: zL, keys: qL } = Object;
      function cb(t) {
        if (1 === t.length) {
          const e = t[0];
          if ($L(e)) return { args: e, keys: null };
          if (
            (function GL(t) {
              return t && "object" == typeof t && UL(t) === zL;
            })(e)
          ) {
            const n = qL(e);
            return { args: n.map((r) => e[r]), keys: n };
          }
        }
        return { args: t, keys: null };
      }
      const { isArray: WL } = Array;
      function Eh(t) {
        return oe((e) =>
          (function KL(t, e) {
            return WL(e) ? t(...e) : t(e);
          })(t, e)
        );
      }
      function db(t, e) {
        return t.reduce((n, r, o) => ((n[r] = e[o]), n), {});
      }
      function Sh(...t) {
        const e = mi(t),
          n = Og(t),
          { args: r, keys: o } = cb(t);
        if (0 === r.length) return je([], e);
        const i = new Ce(
          (function QL(t, e, n = ir) {
            return (r) => {
              fb(
                e,
                () => {
                  const { length: o } = t,
                    i = new Array(o);
                  let s = o,
                    a = o;
                  for (let l = 0; l < o; l++)
                    fb(
                      e,
                      () => {
                        const u = je(t[l], e);
                        let c = !1;
                        u.subscribe(
                          He(
                            r,
                            (d) => {
                              (i[l] = d),
                                c || ((c = !0), a--),
                                a || r.next(n(i.slice()));
                            },
                            () => {
                              --s || r.complete();
                            }
                          )
                        );
                      },
                      r
                    );
                },
                r
              );
            };
          })(r, e, o ? (s) => db(o, s) : ir)
        );
        return n ? i.pipe(Eh(n)) : i;
      }
      function fb(t, e, n) {
        t ? Vn(n, t, e) : e();
      }
      const jl = Ku(
        (t) =>
          function () {
            t(this),
              (this.name = "EmptyError"),
              (this.message = "no elements in sequence");
          }
      );
      function Mh(...t) {
        return (function ZL() {
          return lo(1);
        })()(je(t, mi(t)));
      }
      function hb(t) {
        return new Ce((e) => {
          Et(t()).subscribe(e);
        });
      }
      function vs(t, e) {
        const n = ne(t) ? t : () => t,
          r = (o) => o.error(n());
        return new Ce(e ? (o) => e.schedule(r, 0, o) : r);
      }
      function Th() {
        return We((t, e) => {
          let n = null;
          t._refCount++;
          const r = He(e, void 0, void 0, void 0, () => {
            if (!t || t._refCount <= 0 || 0 < --t._refCount)
              return void (n = null);
            const o = t._connection,
              i = n;
            (n = null),
              o && (!i || o === i) && o.unsubscribe(),
              e.unsubscribe();
          });
          t.subscribe(r), r.closed || (n = t.connect());
        });
      }
      class pb extends Ce {
        constructor(e, n) {
          super(),
            (this.source = e),
            (this.subjectFactory = n),
            (this._subject = null),
            (this._refCount = 0),
            (this._connection = null),
            mg(e) && (this.lift = e.lift);
        }
        _subscribe(e) {
          return this.getSubject().subscribe(e);
        }
        getSubject() {
          const e = this._subject;
          return (
            (!e || e.isStopped) && (this._subject = this.subjectFactory()),
            this._subject
          );
        }
        _teardown() {
          this._refCount = 0;
          const { _connection: e } = this;
          (this._subject = this._connection = null), e?.unsubscribe();
        }
        connect() {
          let e = this._connection;
          if (!e) {
            e = this._connection = new Vt();
            const n = this.getSubject();
            e.add(
              this.source.subscribe(
                He(
                  n,
                  void 0,
                  () => {
                    this._teardown(), n.complete();
                  },
                  (r) => {
                    this._teardown(), n.error(r);
                  },
                  () => this._teardown()
                )
              )
            ),
              e.closed && ((this._connection = null), (e = Vt.EMPTY));
          }
          return e;
        }
        refCount() {
          return Th()(this);
        }
      }
      function Xo(t) {
        return t <= 0
          ? () => hn
          : We((e, n) => {
              let r = 0;
              e.subscribe(
                He(n, (o) => {
                  ++r <= t && (n.next(o), t <= r && n.complete());
                })
              );
            });
      }
      function Jn(t, e) {
        return We((n, r) => {
          let o = 0;
          n.subscribe(He(r, (i) => t.call(e, i, o++) && r.next(i)));
        });
      }
      function $l(t) {
        return We((e, n) => {
          let r = !1;
          e.subscribe(
            He(
              n,
              (o) => {
                (r = !0), n.next(o);
              },
              () => {
                r || n.next(t), n.complete();
              }
            )
          );
        });
      }
      function gb(t = XL) {
        return We((e, n) => {
          let r = !1;
          e.subscribe(
            He(
              n,
              (o) => {
                (r = !0), n.next(o);
              },
              () => (r ? n.complete() : n.error(t()))
            )
          );
        });
      }
      function XL() {
        return new jl();
      }
      function qr(t, e) {
        const n = arguments.length >= 2;
        return (r) =>
          r.pipe(
            t ? Jn((o, i) => t(o, i, r)) : ir,
            Xo(1),
            n ? $l(e) : gb(() => new jl())
          );
      }
      function Jo(t, e) {
        return ne(e) ? Ke(t, e, 1) : Ke(t, 1);
      }
      function ft(t, e, n) {
        const r = ne(t) || e || n ? { next: t, error: e, complete: n } : t;
        return r
          ? We((o, i) => {
              var s;
              null === (s = r.subscribe) || void 0 === s || s.call(r);
              let a = !0;
              o.subscribe(
                He(
                  i,
                  (l) => {
                    var u;
                    null === (u = r.next) || void 0 === u || u.call(r, l),
                      i.next(l);
                  },
                  () => {
                    var l;
                    (a = !1),
                      null === (l = r.complete) || void 0 === l || l.call(r),
                      i.complete();
                  },
                  (l) => {
                    var u;
                    (a = !1),
                      null === (u = r.error) || void 0 === u || u.call(r, l),
                      i.error(l);
                  },
                  () => {
                    var l, u;
                    a &&
                      (null === (l = r.unsubscribe) ||
                        void 0 === l ||
                        l.call(r)),
                      null === (u = r.finalize) || void 0 === u || u.call(r);
                  }
                )
              );
            })
          : ir;
      }
      function Gr(t) {
        return We((e, n) => {
          let i,
            r = null,
            o = !1;
          (r = e.subscribe(
            He(n, void 0, void 0, (s) => {
              (i = Et(t(s, Gr(t)(e)))),
                r ? (r.unsubscribe(), (r = null), i.subscribe(n)) : (o = !0);
            })
          )),
            o && (r.unsubscribe(), (r = null), i.subscribe(n));
        });
      }
      function Ah(t) {
        return t <= 0
          ? () => hn
          : We((e, n) => {
              let r = [];
              e.subscribe(
                He(
                  n,
                  (o) => {
                    r.push(o), t < r.length && r.shift();
                  },
                  () => {
                    for (const o of r) n.next(o);
                    n.complete();
                  },
                  void 0,
                  () => {
                    r = null;
                  }
                )
              );
            });
      }
      function _s(t) {
        return We((e, n) => {
          try {
            e.subscribe(n);
          } finally {
            n.add(t);
          }
        });
      }
      const Z = "primary",
        Cs = Symbol("RouteTitle");
      class rV {
        constructor(e) {
          this.params = e || {};
        }
        has(e) {
          return Object.prototype.hasOwnProperty.call(this.params, e);
        }
        get(e) {
          if (this.has(e)) {
            const n = this.params[e];
            return Array.isArray(n) ? n[0] : n;
          }
          return null;
        }
        getAll(e) {
          if (this.has(e)) {
            const n = this.params[e];
            return Array.isArray(n) ? n : [n];
          }
          return [];
        }
        get keys() {
          return Object.keys(this.params);
        }
      }
      function ei(t) {
        return new rV(t);
      }
      function oV(t, e, n) {
        const r = n.path.split("/");
        if (
          r.length > t.length ||
          ("full" === n.pathMatch && (e.hasChildren() || r.length < t.length))
        )
          return null;
        const o = {};
        for (let i = 0; i < r.length; i++) {
          const s = r[i],
            a = t[i];
          if (s.startsWith(":")) o[s.substring(1)] = a;
          else if (s !== a.path) return null;
        }
        return { consumed: t.slice(0, r.length), posParams: o };
      }
      function On(t, e) {
        const n = t ? Object.keys(t) : void 0,
          r = e ? Object.keys(e) : void 0;
        if (!n || !r || n.length != r.length) return !1;
        let o;
        for (let i = 0; i < n.length; i++)
          if (((o = n[i]), !mb(t[o], e[o]))) return !1;
        return !0;
      }
      function mb(t, e) {
        if (Array.isArray(t) && Array.isArray(e)) {
          if (t.length !== e.length) return !1;
          const n = [...t].sort(),
            r = [...e].sort();
          return n.every((o, i) => r[i] === o);
        }
        return t === e;
      }
      function yb(t) {
        return t.length > 0 ? t[t.length - 1] : null;
      }
      function yr(t) {
        return (function jL(t) {
          return !!t && (t instanceof Ce || (ne(t.lift) && ne(t.subscribe)));
        })(t)
          ? t
          : rs(t)
          ? je(Promise.resolve(t))
          : j(t);
      }
      const sV = {
          exact: function Cb(t, e, n) {
            if (
              !Wr(t.segments, e.segments) ||
              !Ul(t.segments, e.segments, n) ||
              t.numberOfChildren !== e.numberOfChildren
            )
              return !1;
            for (const r in e.children)
              if (!t.children[r] || !Cb(t.children[r], e.children[r], n))
                return !1;
            return !0;
          },
          subset: Db,
        },
        vb = {
          exact: function aV(t, e) {
            return On(t, e);
          },
          subset: function lV(t, e) {
            return (
              Object.keys(e).length <= Object.keys(t).length &&
              Object.keys(e).every((n) => mb(t[n], e[n]))
            );
          },
          ignored: () => !0,
        };
      function _b(t, e, n) {
        return (
          sV[n.paths](t.root, e.root, n.matrixParams) &&
          vb[n.queryParams](t.queryParams, e.queryParams) &&
          !("exact" === n.fragment && t.fragment !== e.fragment)
        );
      }
      function Db(t, e, n) {
        return wb(t, e, e.segments, n);
      }
      function wb(t, e, n, r) {
        if (t.segments.length > n.length) {
          const o = t.segments.slice(0, n.length);
          return !(!Wr(o, n) || e.hasChildren() || !Ul(o, n, r));
        }
        if (t.segments.length === n.length) {
          if (!Wr(t.segments, n) || !Ul(t.segments, n, r)) return !1;
          for (const o in e.children)
            if (!t.children[o] || !Db(t.children[o], e.children[o], r))
              return !1;
          return !0;
        }
        {
          const o = n.slice(0, t.segments.length),
            i = n.slice(t.segments.length);
          return (
            !!(Wr(t.segments, o) && Ul(t.segments, o, r) && t.children[Z]) &&
            wb(t.children[Z], e, i, r)
          );
        }
      }
      function Ul(t, e, n) {
        return e.every((r, o) => vb[n](t[o].parameters, r.parameters));
      }
      class ti {
        constructor(e = new de([], {}), n = {}, r = null) {
          (this.root = e), (this.queryParams = n), (this.fragment = r);
        }
        get queryParamMap() {
          return (
            this._queryParamMap || (this._queryParamMap = ei(this.queryParams)),
            this._queryParamMap
          );
        }
        toString() {
          return dV.serialize(this);
        }
      }
      class de {
        constructor(e, n) {
          (this.segments = e),
            (this.children = n),
            (this.parent = null),
            Object.values(n).forEach((r) => (r.parent = this));
        }
        hasChildren() {
          return this.numberOfChildren > 0;
        }
        get numberOfChildren() {
          return Object.keys(this.children).length;
        }
        toString() {
          return zl(this);
        }
      }
      class Ds {
        constructor(e, n) {
          (this.path = e), (this.parameters = n);
        }
        get parameterMap() {
          return (
            this._parameterMap || (this._parameterMap = ei(this.parameters)),
            this._parameterMap
          );
        }
        toString() {
          return Sb(this);
        }
      }
      function Wr(t, e) {
        return t.length === e.length && t.every((n, r) => n.path === e[r].path);
      }
      let ws = (() => {
        class t {}
        return (
          (t.ɵfac = function (n) {
            return new (n || t)();
          }),
          (t.ɵprov = N({
            token: t,
            factory: function () {
              return new Ih();
            },
            providedIn: "root",
          })),
          t
        );
      })();
      class Ih {
        parse(e) {
          const n = new wV(e);
          return new ti(
            n.parseRootSegment(),
            n.parseQueryParams(),
            n.parseFragment()
          );
        }
        serialize(e) {
          const n = `/${bs(e.root, !0)}`,
            r = (function pV(t) {
              const e = Object.keys(t)
                .map((n) => {
                  const r = t[n];
                  return Array.isArray(r)
                    ? r.map((o) => `${ql(n)}=${ql(o)}`).join("&")
                    : `${ql(n)}=${ql(r)}`;
                })
                .filter((n) => !!n);
              return e.length ? `?${e.join("&")}` : "";
            })(e.queryParams);
          return `${n}${r}${
            "string" == typeof e.fragment
              ? `#${(function fV(t) {
                  return encodeURI(t);
                })(e.fragment)}`
              : ""
          }`;
        }
      }
      const dV = new Ih();
      function zl(t) {
        return t.segments.map((e) => Sb(e)).join("/");
      }
      function bs(t, e) {
        if (!t.hasChildren()) return zl(t);
        if (e) {
          const n = t.children[Z] ? bs(t.children[Z], !1) : "",
            r = [];
          return (
            Object.entries(t.children).forEach(([o, i]) => {
              o !== Z && r.push(`${o}:${bs(i, !1)}`);
            }),
            r.length > 0 ? `${n}(${r.join("//")})` : n
          );
        }
        {
          const n = (function cV(t, e) {
            let n = [];
            return (
              Object.entries(t.children).forEach(([r, o]) => {
                r === Z && (n = n.concat(e(o, r)));
              }),
              Object.entries(t.children).forEach(([r, o]) => {
                r !== Z && (n = n.concat(e(o, r)));
              }),
              n
            );
          })(t, (r, o) =>
            o === Z ? [bs(t.children[Z], !1)] : [`${o}:${bs(r, !1)}`]
          );
          return 1 === Object.keys(t.children).length && null != t.children[Z]
            ? `${zl(t)}/${n[0]}`
            : `${zl(t)}/(${n.join("//")})`;
        }
      }
      function bb(t) {
        return encodeURIComponent(t)
          .replace(/%40/g, "@")
          .replace(/%3A/gi, ":")
          .replace(/%24/g, "$")
          .replace(/%2C/gi, ",");
      }
      function ql(t) {
        return bb(t).replace(/%3B/gi, ";");
      }
      function Oh(t) {
        return bb(t)
          .replace(/\(/g, "%28")
          .replace(/\)/g, "%29")
          .replace(/%26/gi, "&");
      }
      function Gl(t) {
        return decodeURIComponent(t);
      }
      function Eb(t) {
        return Gl(t.replace(/\+/g, "%20"));
      }
      function Sb(t) {
        return `${Oh(t.path)}${(function hV(t) {
          return Object.keys(t)
            .map((e) => `;${Oh(e)}=${Oh(t[e])}`)
            .join("");
        })(t.parameters)}`;
      }
      const gV = /^[^\/()?;#]+/;
      function Ph(t) {
        const e = t.match(gV);
        return e ? e[0] : "";
      }
      const mV = /^[^\/()?;=#]+/,
        vV = /^[^=?&#]+/,
        CV = /^[^&#]+/;
      class wV {
        constructor(e) {
          (this.url = e), (this.remaining = e);
        }
        parseRootSegment() {
          return (
            this.consumeOptional("/"),
            "" === this.remaining ||
            this.peekStartsWith("?") ||
            this.peekStartsWith("#")
              ? new de([], {})
              : new de([], this.parseChildren())
          );
        }
        parseQueryParams() {
          const e = {};
          if (this.consumeOptional("?"))
            do {
              this.parseQueryParam(e);
            } while (this.consumeOptional("&"));
          return e;
        }
        parseFragment() {
          return this.consumeOptional("#")
            ? decodeURIComponent(this.remaining)
            : null;
        }
        parseChildren() {
          if ("" === this.remaining) return {};
          this.consumeOptional("/");
          const e = [];
          for (
            this.peekStartsWith("(") || e.push(this.parseSegment());
            this.peekStartsWith("/") &&
            !this.peekStartsWith("//") &&
            !this.peekStartsWith("/(");

          )
            this.capture("/"), e.push(this.parseSegment());
          let n = {};
          this.peekStartsWith("/(") &&
            (this.capture("/"), (n = this.parseParens(!0)));
          let r = {};
          return (
            this.peekStartsWith("(") && (r = this.parseParens(!1)),
            (e.length > 0 || Object.keys(n).length > 0) &&
              (r[Z] = new de(e, n)),
            r
          );
        }
        parseSegment() {
          const e = Ph(this.remaining);
          if ("" === e && this.peekStartsWith(";")) throw new v(4009, !1);
          return this.capture(e), new Ds(Gl(e), this.parseMatrixParams());
        }
        parseMatrixParams() {
          const e = {};
          for (; this.consumeOptional(";"); ) this.parseParam(e);
          return e;
        }
        parseParam(e) {
          const n = (function yV(t) {
            const e = t.match(mV);
            return e ? e[0] : "";
          })(this.remaining);
          if (!n) return;
          this.capture(n);
          let r = "";
          if (this.consumeOptional("=")) {
            const o = Ph(this.remaining);
            o && ((r = o), this.capture(r));
          }
          e[Gl(n)] = Gl(r);
        }
        parseQueryParam(e) {
          const n = (function _V(t) {
            const e = t.match(vV);
            return e ? e[0] : "";
          })(this.remaining);
          if (!n) return;
          this.capture(n);
          let r = "";
          if (this.consumeOptional("=")) {
            const s = (function DV(t) {
              const e = t.match(CV);
              return e ? e[0] : "";
            })(this.remaining);
            s && ((r = s), this.capture(r));
          }
          const o = Eb(n),
            i = Eb(r);
          if (e.hasOwnProperty(o)) {
            let s = e[o];
            Array.isArray(s) || ((s = [s]), (e[o] = s)), s.push(i);
          } else e[o] = i;
        }
        parseParens(e) {
          const n = {};
          for (
            this.capture("(");
            !this.consumeOptional(")") && this.remaining.length > 0;

          ) {
            const r = Ph(this.remaining),
              o = this.remaining[r.length];
            if ("/" !== o && ")" !== o && ";" !== o) throw new v(4010, !1);
            let i;
            r.indexOf(":") > -1
              ? ((i = r.slice(0, r.indexOf(":"))),
                this.capture(i),
                this.capture(":"))
              : e && (i = Z);
            const s = this.parseChildren();
            (n[i] = 1 === Object.keys(s).length ? s[Z] : new de([], s)),
              this.consumeOptional("//");
          }
          return n;
        }
        peekStartsWith(e) {
          return this.remaining.startsWith(e);
        }
        consumeOptional(e) {
          return (
            !!this.peekStartsWith(e) &&
            ((this.remaining = this.remaining.substring(e.length)), !0)
          );
        }
        capture(e) {
          if (!this.consumeOptional(e)) throw new v(4011, !1);
        }
      }
      function Mb(t) {
        return t.segments.length > 0 ? new de([], { [Z]: t }) : t;
      }
      function Tb(t) {
        const e = {};
        for (const r of Object.keys(t.children)) {
          const i = Tb(t.children[r]);
          if (r === Z && 0 === i.segments.length && i.hasChildren())
            for (const [s, a] of Object.entries(i.children)) e[s] = a;
          else (i.segments.length > 0 || i.hasChildren()) && (e[r] = i);
        }
        return (function bV(t) {
          if (1 === t.numberOfChildren && t.children[Z]) {
            const e = t.children[Z];
            return new de(t.segments.concat(e.segments), e.children);
          }
          return t;
        })(new de(t.segments, e));
      }
      function Kr(t) {
        return t instanceof ti;
      }
      function Ab(t) {
        let e;
        const o = Mb(
          (function n(i) {
            const s = {};
            for (const l of i.children) {
              const u = n(l);
              s[l.outlet] = u;
            }
            const a = new de(i.url, s);
            return i === t && (e = a), a;
          })(t.root)
        );
        return e ?? o;
      }
      function Ib(t, e, n, r) {
        let o = t;
        for (; o.parent; ) o = o.parent;
        if (0 === e.length) return Nh(o, o, o, n, r);
        const i = (function SV(t) {
          if ("string" == typeof t[0] && 1 === t.length && "/" === t[0])
            return new Pb(!0, 0, t);
          let e = 0,
            n = !1;
          const r = t.reduce((o, i, s) => {
            if ("object" == typeof i && null != i) {
              if (i.outlets) {
                const a = {};
                return (
                  Object.entries(i.outlets).forEach(([l, u]) => {
                    a[l] = "string" == typeof u ? u.split("/") : u;
                  }),
                  [...o, { outlets: a }]
                );
              }
              if (i.segmentPath) return [...o, i.segmentPath];
            }
            return "string" != typeof i
              ? [...o, i]
              : 0 === s
              ? (i.split("/").forEach((a, l) => {
                  (0 == l && "." === a) ||
                    (0 == l && "" === a
                      ? (n = !0)
                      : ".." === a
                      ? e++
                      : "" != a && o.push(a));
                }),
                o)
              : [...o, i];
          }, []);
          return new Pb(n, e, r);
        })(e);
        if (i.toRoot()) return Nh(o, o, new de([], {}), n, r);
        const s = (function MV(t, e, n) {
            if (t.isAbsolute) return new Kl(e, !0, 0);
            if (!n) return new Kl(e, !1, NaN);
            if (null === n.parent) return new Kl(n, !0, 0);
            const r = Wl(t.commands[0]) ? 0 : 1;
            return (function TV(t, e, n) {
              let r = t,
                o = e,
                i = n;
              for (; i > o; ) {
                if (((i -= o), (r = r.parent), !r)) throw new v(4005, !1);
                o = r.segments.length;
              }
              return new Kl(r, !1, o - i);
            })(n, n.segments.length - 1 + r, t.numberOfDoubleDots);
          })(i, o, t),
          a = s.processChildren
            ? Ss(s.segmentGroup, s.index, i.commands)
            : Nb(s.segmentGroup, s.index, i.commands);
        return Nh(o, s.segmentGroup, a, n, r);
      }
      function Wl(t) {
        return (
          "object" == typeof t && null != t && !t.outlets && !t.segmentPath
        );
      }
      function Es(t) {
        return "object" == typeof t && null != t && t.outlets;
      }
      function Nh(t, e, n, r, o) {
        let s,
          i = {};
        r &&
          Object.entries(r).forEach(([l, u]) => {
            i[l] = Array.isArray(u) ? u.map((c) => `${c}`) : `${u}`;
          }),
          (s = t === e ? n : Ob(t, e, n));
        const a = Mb(Tb(s));
        return new ti(a, i, o);
      }
      function Ob(t, e, n) {
        const r = {};
        return (
          Object.entries(t.children).forEach(([o, i]) => {
            r[o] = i === e ? n : Ob(i, e, n);
          }),
          new de(t.segments, r)
        );
      }
      class Pb {
        constructor(e, n, r) {
          if (
            ((this.isAbsolute = e),
            (this.numberOfDoubleDots = n),
            (this.commands = r),
            e && r.length > 0 && Wl(r[0]))
          )
            throw new v(4003, !1);
          const o = r.find(Es);
          if (o && o !== yb(r)) throw new v(4004, !1);
        }
        toRoot() {
          return (
            this.isAbsolute &&
            1 === this.commands.length &&
            "/" == this.commands[0]
          );
        }
      }
      class Kl {
        constructor(e, n, r) {
          (this.segmentGroup = e), (this.processChildren = n), (this.index = r);
        }
      }
      function Nb(t, e, n) {
        if (
          (t || (t = new de([], {})),
          0 === t.segments.length && t.hasChildren())
        )
          return Ss(t, e, n);
        const r = (function IV(t, e, n) {
            let r = 0,
              o = e;
            const i = { match: !1, pathIndex: 0, commandIndex: 0 };
            for (; o < t.segments.length; ) {
              if (r >= n.length) return i;
              const s = t.segments[o],
                a = n[r];
              if (Es(a)) break;
              const l = `${a}`,
                u = r < n.length - 1 ? n[r + 1] : null;
              if (o > 0 && void 0 === l) break;
              if (l && u && "object" == typeof u && void 0 === u.outlets) {
                if (!Rb(l, u, s)) return i;
                r += 2;
              } else {
                if (!Rb(l, {}, s)) return i;
                r++;
              }
              o++;
            }
            return { match: !0, pathIndex: o, commandIndex: r };
          })(t, e, n),
          o = n.slice(r.commandIndex);
        if (r.match && r.pathIndex < t.segments.length) {
          const i = new de(t.segments.slice(0, r.pathIndex), {});
          return (
            (i.children[Z] = new de(t.segments.slice(r.pathIndex), t.children)),
            Ss(i, 0, o)
          );
        }
        return r.match && 0 === o.length
          ? new de(t.segments, {})
          : r.match && !t.hasChildren()
          ? xh(t, e, n)
          : r.match
          ? Ss(t, 0, o)
          : xh(t, e, n);
      }
      function Ss(t, e, n) {
        if (0 === n.length) return new de(t.segments, {});
        {
          const r = (function AV(t) {
              return Es(t[0]) ? t[0].outlets : { [Z]: t };
            })(n),
            o = {};
          if (
            !r[Z] &&
            t.children[Z] &&
            1 === t.numberOfChildren &&
            0 === t.children[Z].segments.length
          ) {
            const i = Ss(t.children[Z], e, n);
            return new de(t.segments, i.children);
          }
          return (
            Object.entries(r).forEach(([i, s]) => {
              "string" == typeof s && (s = [s]),
                null !== s && (o[i] = Nb(t.children[i], e, s));
            }),
            Object.entries(t.children).forEach(([i, s]) => {
              void 0 === r[i] && (o[i] = s);
            }),
            new de(t.segments, o)
          );
        }
      }
      function xh(t, e, n) {
        const r = t.segments.slice(0, e);
        let o = 0;
        for (; o < n.length; ) {
          const i = n[o];
          if (Es(i)) {
            const l = OV(i.outlets);
            return new de(r, l);
          }
          if (0 === o && Wl(n[0])) {
            r.push(new Ds(t.segments[e].path, xb(n[0]))), o++;
            continue;
          }
          const s = Es(i) ? i.outlets[Z] : `${i}`,
            a = o < n.length - 1 ? n[o + 1] : null;
          s && a && Wl(a)
            ? (r.push(new Ds(s, xb(a))), (o += 2))
            : (r.push(new Ds(s, {})), o++);
        }
        return new de(r, {});
      }
      function OV(t) {
        const e = {};
        return (
          Object.entries(t).forEach(([n, r]) => {
            "string" == typeof r && (r = [r]),
              null !== r && (e[n] = xh(new de([], {}), 0, r));
          }),
          e
        );
      }
      function xb(t) {
        const e = {};
        return Object.entries(t).forEach(([n, r]) => (e[n] = `${r}`)), e;
      }
      function Rb(t, e, n) {
        return t == n.path && On(e, n.parameters);
      }
      const Ms = "imperative";
      class Pn {
        constructor(e, n) {
          (this.id = e), (this.url = n);
        }
      }
      class Rh extends Pn {
        constructor(e, n, r = "imperative", o = null) {
          super(e, n),
            (this.type = 0),
            (this.navigationTrigger = r),
            (this.restoredState = o);
        }
        toString() {
          return `NavigationStart(id: ${this.id}, url: '${this.url}')`;
        }
      }
      class Qr extends Pn {
        constructor(e, n, r) {
          super(e, n), (this.urlAfterRedirects = r), (this.type = 1);
        }
        toString() {
          return `NavigationEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}')`;
        }
      }
      class Ql extends Pn {
        constructor(e, n, r, o) {
          super(e, n), (this.reason = r), (this.code = o), (this.type = 2);
        }
        toString() {
          return `NavigationCancel(id: ${this.id}, url: '${this.url}')`;
        }
      }
      class Ts extends Pn {
        constructor(e, n, r, o) {
          super(e, n), (this.reason = r), (this.code = o), (this.type = 16);
        }
      }
      class Fh extends Pn {
        constructor(e, n, r, o) {
          super(e, n), (this.error = r), (this.target = o), (this.type = 3);
        }
        toString() {
          return `NavigationError(id: ${this.id}, url: '${this.url}', error: ${this.error})`;
        }
      }
      class PV extends Pn {
        constructor(e, n, r, o) {
          super(e, n),
            (this.urlAfterRedirects = r),
            (this.state = o),
            (this.type = 4);
        }
        toString() {
          return `RoutesRecognized(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
        }
      }
      class NV extends Pn {
        constructor(e, n, r, o) {
          super(e, n),
            (this.urlAfterRedirects = r),
            (this.state = o),
            (this.type = 7);
        }
        toString() {
          return `GuardsCheckStart(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
        }
      }
      class xV extends Pn {
        constructor(e, n, r, o, i) {
          super(e, n),
            (this.urlAfterRedirects = r),
            (this.state = o),
            (this.shouldActivate = i),
            (this.type = 8);
        }
        toString() {
          return `GuardsCheckEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state}, shouldActivate: ${this.shouldActivate})`;
        }
      }
      class RV extends Pn {
        constructor(e, n, r, o) {
          super(e, n),
            (this.urlAfterRedirects = r),
            (this.state = o),
            (this.type = 5);
        }
        toString() {
          return `ResolveStart(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
        }
      }
      class FV extends Pn {
        constructor(e, n, r, o) {
          super(e, n),
            (this.urlAfterRedirects = r),
            (this.state = o),
            (this.type = 6);
        }
        toString() {
          return `ResolveEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
        }
      }
      class kV {
        constructor(e) {
          (this.route = e), (this.type = 9);
        }
        toString() {
          return `RouteConfigLoadStart(path: ${this.route.path})`;
        }
      }
      class LV {
        constructor(e) {
          (this.route = e), (this.type = 10);
        }
        toString() {
          return `RouteConfigLoadEnd(path: ${this.route.path})`;
        }
      }
      class VV {
        constructor(e) {
          (this.snapshot = e), (this.type = 11);
        }
        toString() {
          return `ChildActivationStart(path: '${
            (this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""
          }')`;
        }
      }
      class BV {
        constructor(e) {
          (this.snapshot = e), (this.type = 12);
        }
        toString() {
          return `ChildActivationEnd(path: '${
            (this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""
          }')`;
        }
      }
      class HV {
        constructor(e) {
          (this.snapshot = e), (this.type = 13);
        }
        toString() {
          return `ActivationStart(path: '${
            (this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""
          }')`;
        }
      }
      class jV {
        constructor(e) {
          (this.snapshot = e), (this.type = 14);
        }
        toString() {
          return `ActivationEnd(path: '${
            (this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""
          }')`;
        }
      }
      class Fb {
        constructor(e, n, r) {
          (this.routerEvent = e),
            (this.position = n),
            (this.anchor = r),
            (this.type = 15);
        }
        toString() {
          return `Scroll(anchor: '${this.anchor}', position: '${
            this.position ? `${this.position[0]}, ${this.position[1]}` : null
          }')`;
        }
      }
      class $V {
        constructor() {
          (this.outlet = null),
            (this.route = null),
            (this.injector = null),
            (this.children = new As()),
            (this.attachRef = null);
        }
      }
      let As = (() => {
        class t {
          constructor() {
            this.contexts = new Map();
          }
          onChildOutletCreated(n, r) {
            const o = this.getOrCreateContext(n);
            (o.outlet = r), this.contexts.set(n, o);
          }
          onChildOutletDestroyed(n) {
            const r = this.getContext(n);
            r && ((r.outlet = null), (r.attachRef = null));
          }
          onOutletDeactivated() {
            const n = this.contexts;
            return (this.contexts = new Map()), n;
          }
          onOutletReAttached(n) {
            this.contexts = n;
          }
          getOrCreateContext(n) {
            let r = this.getContext(n);
            return r || ((r = new $V()), this.contexts.set(n, r)), r;
          }
          getContext(n) {
            return this.contexts.get(n) || null;
          }
        }
        return (
          (t.ɵfac = function (n) {
            return new (n || t)();
          }),
          (t.ɵprov = N({ token: t, factory: t.ɵfac, providedIn: "root" })),
          t
        );
      })();
      class kb {
        constructor(e) {
          this._root = e;
        }
        get root() {
          return this._root.value;
        }
        parent(e) {
          const n = this.pathFromRoot(e);
          return n.length > 1 ? n[n.length - 2] : null;
        }
        children(e) {
          const n = kh(e, this._root);
          return n ? n.children.map((r) => r.value) : [];
        }
        firstChild(e) {
          const n = kh(e, this._root);
          return n && n.children.length > 0 ? n.children[0].value : null;
        }
        siblings(e) {
          const n = Lh(e, this._root);
          return n.length < 2
            ? []
            : n[n.length - 2].children
                .map((o) => o.value)
                .filter((o) => o !== e);
        }
        pathFromRoot(e) {
          return Lh(e, this._root).map((n) => n.value);
        }
      }
      function kh(t, e) {
        if (t === e.value) return e;
        for (const n of e.children) {
          const r = kh(t, n);
          if (r) return r;
        }
        return null;
      }
      function Lh(t, e) {
        if (t === e.value) return [e];
        for (const n of e.children) {
          const r = Lh(t, n);
          if (r.length) return r.unshift(e), r;
        }
        return [];
      }
      class er {
        constructor(e, n) {
          (this.value = e), (this.children = n);
        }
        toString() {
          return `TreeNode(${this.value})`;
        }
      }
      function ni(t) {
        const e = {};
        return t && t.children.forEach((n) => (e[n.value.outlet] = n)), e;
      }
      class Lb extends kb {
        constructor(e, n) {
          super(e), (this.snapshot = n), Vh(this, e);
        }
        toString() {
          return this.snapshot.toString();
        }
      }
      function Vb(t, e) {
        const n = (function UV(t, e) {
            const s = new Zl([], {}, {}, "", {}, Z, e, null, {});
            return new Hb("", new er(s, []));
          })(0, e),
          r = new Bt([new Ds("", {})]),
          o = new Bt({}),
          i = new Bt({}),
          s = new Bt({}),
          a = new Bt(""),
          l = new ri(r, o, s, a, i, Z, e, n.root);
        return (l.snapshot = n.root), new Lb(new er(l, []), n);
      }
      class ri {
        constructor(e, n, r, o, i, s, a, l) {
          (this.urlSubject = e),
            (this.paramsSubject = n),
            (this.queryParamsSubject = r),
            (this.fragmentSubject = o),
            (this.dataSubject = i),
            (this.outlet = s),
            (this.component = a),
            (this._futureSnapshot = l),
            (this.title =
              this.dataSubject?.pipe(oe((u) => u[Cs])) ?? j(void 0)),
            (this.url = e),
            (this.params = n),
            (this.queryParams = r),
            (this.fragment = o),
            (this.data = i);
        }
        get routeConfig() {
          return this._futureSnapshot.routeConfig;
        }
        get root() {
          return this._routerState.root;
        }
        get parent() {
          return this._routerState.parent(this);
        }
        get firstChild() {
          return this._routerState.firstChild(this);
        }
        get children() {
          return this._routerState.children(this);
        }
        get pathFromRoot() {
          return this._routerState.pathFromRoot(this);
        }
        get paramMap() {
          return (
            this._paramMap ||
              (this._paramMap = this.params.pipe(oe((e) => ei(e)))),
            this._paramMap
          );
        }
        get queryParamMap() {
          return (
            this._queryParamMap ||
              (this._queryParamMap = this.queryParams.pipe(oe((e) => ei(e)))),
            this._queryParamMap
          );
        }
        toString() {
          return this.snapshot
            ? this.snapshot.toString()
            : `Future(${this._futureSnapshot})`;
        }
      }
      function Bb(t, e = "emptyOnly") {
        const n = t.pathFromRoot;
        let r = 0;
        if ("always" !== e)
          for (r = n.length - 1; r >= 1; ) {
            const o = n[r],
              i = n[r - 1];
            if (o.routeConfig && "" === o.routeConfig.path) r--;
            else {
              if (i.component) break;
              r--;
            }
          }
        return (function zV(t) {
          return t.reduce(
            (e, n) => ({
              params: { ...e.params, ...n.params },
              data: { ...e.data, ...n.data },
              resolve: {
                ...n.data,
                ...e.resolve,
                ...n.routeConfig?.data,
                ...n._resolvedData,
              },
            }),
            { params: {}, data: {}, resolve: {} }
          );
        })(n.slice(r));
      }
      class Zl {
        get title() {
          return this.data?.[Cs];
        }
        constructor(e, n, r, o, i, s, a, l, u) {
          (this.url = e),
            (this.params = n),
            (this.queryParams = r),
            (this.fragment = o),
            (this.data = i),
            (this.outlet = s),
            (this.component = a),
            (this.routeConfig = l),
            (this._resolve = u);
        }
        get root() {
          return this._routerState.root;
        }
        get parent() {
          return this._routerState.parent(this);
        }
        get firstChild() {
          return this._routerState.firstChild(this);
        }
        get children() {
          return this._routerState.children(this);
        }
        get pathFromRoot() {
          return this._routerState.pathFromRoot(this);
        }
        get paramMap() {
          return (
            this._paramMap || (this._paramMap = ei(this.params)), this._paramMap
          );
        }
        get queryParamMap() {
          return (
            this._queryParamMap || (this._queryParamMap = ei(this.queryParams)),
            this._queryParamMap
          );
        }
        toString() {
          return `Route(url:'${this.url
            .map((r) => r.toString())
            .join("/")}', path:'${
            this.routeConfig ? this.routeConfig.path : ""
          }')`;
        }
      }
      class Hb extends kb {
        constructor(e, n) {
          super(n), (this.url = e), Vh(this, n);
        }
        toString() {
          return jb(this._root);
        }
      }
      function Vh(t, e) {
        (e.value._routerState = t), e.children.forEach((n) => Vh(t, n));
      }
      function jb(t) {
        const e =
          t.children.length > 0 ? ` { ${t.children.map(jb).join(", ")} } ` : "";
        return `${t.value}${e}`;
      }
      function Bh(t) {
        if (t.snapshot) {
          const e = t.snapshot,
            n = t._futureSnapshot;
          (t.snapshot = n),
            On(e.queryParams, n.queryParams) ||
              t.queryParamsSubject.next(n.queryParams),
            e.fragment !== n.fragment && t.fragmentSubject.next(n.fragment),
            On(e.params, n.params) || t.paramsSubject.next(n.params),
            (function iV(t, e) {
              if (t.length !== e.length) return !1;
              for (let n = 0; n < t.length; ++n) if (!On(t[n], e[n])) return !1;
              return !0;
            })(e.url, n.url) || t.urlSubject.next(n.url),
            On(e.data, n.data) || t.dataSubject.next(n.data);
        } else
          (t.snapshot = t._futureSnapshot),
            t.dataSubject.next(t._futureSnapshot.data);
      }
      function Hh(t, e) {
        const n =
          On(t.params, e.params) &&
          (function uV(t, e) {
            return (
              Wr(t, e) && t.every((n, r) => On(n.parameters, e[r].parameters))
            );
          })(t.url, e.url);
        return (
          n &&
          !(!t.parent != !e.parent) &&
          (!t.parent || Hh(t.parent, e.parent))
        );
      }
      let Yl = (() => {
        class t {
          constructor() {
            (this.activated = null),
              (this._activatedRoute = null),
              (this.name = Z),
              (this.activateEvents = new Te()),
              (this.deactivateEvents = new Te()),
              (this.attachEvents = new Te()),
              (this.detachEvents = new Te()),
              (this.parentContexts = A(As)),
              (this.location = A(rn)),
              (this.changeDetector = A(wl)),
              (this.environmentInjector = A(wn)),
              (this.inputBinder = A(Xl, { optional: !0 })),
              (this.supportsBindingToComponentInputs = !0);
          }
          get activatedComponentRef() {
            return this.activated;
          }
          ngOnChanges(n) {
            if (n.name) {
              const { firstChange: r, previousValue: o } = n.name;
              if (r) return;
              this.isTrackedInParentContexts(o) &&
                (this.deactivate(),
                this.parentContexts.onChildOutletDestroyed(o)),
                this.initializeOutletWithName();
            }
          }
          ngOnDestroy() {
            this.isTrackedInParentContexts(this.name) &&
              this.parentContexts.onChildOutletDestroyed(this.name),
              this.inputBinder?.unsubscribeFromRouteData(this);
          }
          isTrackedInParentContexts(n) {
            return this.parentContexts.getContext(n)?.outlet === this;
          }
          ngOnInit() {
            this.initializeOutletWithName();
          }
          initializeOutletWithName() {
            if (
              (this.parentContexts.onChildOutletCreated(this.name, this),
              this.activated)
            )
              return;
            const n = this.parentContexts.getContext(this.name);
            n?.route &&
              (n.attachRef
                ? this.attach(n.attachRef, n.route)
                : this.activateWith(n.route, n.injector));
          }
          get isActivated() {
            return !!this.activated;
          }
          get component() {
            if (!this.activated) throw new v(4012, !1);
            return this.activated.instance;
          }
          get activatedRoute() {
            if (!this.activated) throw new v(4012, !1);
            return this._activatedRoute;
          }
          get activatedRouteData() {
            return this._activatedRoute
              ? this._activatedRoute.snapshot.data
              : {};
          }
          detach() {
            if (!this.activated) throw new v(4012, !1);
            this.location.detach();
            const n = this.activated;
            return (
              (this.activated = null),
              (this._activatedRoute = null),
              this.detachEvents.emit(n.instance),
              n
            );
          }
          attach(n, r) {
            (this.activated = n),
              (this._activatedRoute = r),
              this.location.insert(n.hostView),
              this.inputBinder?.bindActivatedRouteToOutletComponent(this),
              this.attachEvents.emit(n.instance);
          }
          deactivate() {
            if (this.activated) {
              const n = this.component;
              this.activated.destroy(),
                (this.activated = null),
                (this._activatedRoute = null),
                this.deactivateEvents.emit(n);
            }
          }
          activateWith(n, r) {
            if (this.isActivated) throw new v(4013, !1);
            this._activatedRoute = n;
            const o = this.location,
              s = n.snapshot.component,
              a = this.parentContexts.getOrCreateContext(this.name).children,
              l = new qV(n, a, o.injector);
            (this.activated = o.createComponent(s, {
              index: o.length,
              injector: l,
              environmentInjector: r ?? this.environmentInjector,
            })),
              this.changeDetector.markForCheck(),
              this.inputBinder?.bindActivatedRouteToOutletComponent(this),
              this.activateEvents.emit(this.activated.instance);
          }
        }
        return (
          (t.ɵfac = function (n) {
            return new (n || t)();
          }),
          (t.ɵdir = U({
            type: t,
            selectors: [["router-outlet"]],
            inputs: { name: "name" },
            outputs: {
              activateEvents: "activate",
              deactivateEvents: "deactivate",
              attachEvents: "attach",
              detachEvents: "detach",
            },
            exportAs: ["outlet"],
            standalone: !0,
            features: [jt],
          })),
          t
        );
      })();
      class qV {
        constructor(e, n, r) {
          (this.route = e), (this.childContexts = n), (this.parent = r);
        }
        get(e, n) {
          return e === ri
            ? this.route
            : e === As
            ? this.childContexts
            : this.parent.get(e, n);
        }
      }
      const Xl = new O("");
      let $b = (() => {
        class t {
          constructor() {
            this.outletDataSubscriptions = new Map();
          }
          bindActivatedRouteToOutletComponent(n) {
            this.unsubscribeFromRouteData(n), this.subscribeToRouteData(n);
          }
          unsubscribeFromRouteData(n) {
            this.outletDataSubscriptions.get(n)?.unsubscribe(),
              this.outletDataSubscriptions.delete(n);
          }
          subscribeToRouteData(n) {
            const { activatedRoute: r } = n,
              o = Sh([r.queryParams, r.params, r.data])
                .pipe(
                  Zt(
                    ([i, s, a], l) => (
                      (a = { ...i, ...s, ...a }),
                      0 === l ? j(a) : Promise.resolve(a)
                    )
                  )
                )
                .subscribe((i) => {
                  if (
                    !n.isActivated ||
                    !n.activatedComponentRef ||
                    n.activatedRoute !== r ||
                    null === r.component
                  )
                    return void this.unsubscribeFromRouteData(n);
                  const s = (function _F(t) {
                    const e = ie(t);
                    if (!e) return null;
                    const n = new Yi(e);
                    return {
                      get selector() {
                        return n.selector;
                      },
                      get type() {
                        return n.componentType;
                      },
                      get inputs() {
                        return n.inputs;
                      },
                      get outputs() {
                        return n.outputs;
                      },
                      get ngContentSelectors() {
                        return n.ngContentSelectors;
                      },
                      get isStandalone() {
                        return e.standalone;
                      },
                      get isSignal() {
                        return e.signals;
                      },
                    };
                  })(r.component);
                  if (s)
                    for (const { templateName: a } of s.inputs)
                      n.activatedComponentRef.setInput(a, i[a]);
                  else this.unsubscribeFromRouteData(n);
                });
            this.outletDataSubscriptions.set(n, o);
          }
        }
        return (
          (t.ɵfac = function (n) {
            return new (n || t)();
          }),
          (t.ɵprov = N({ token: t, factory: t.ɵfac })),
          t
        );
      })();
      function Is(t, e, n) {
        if (n && t.shouldReuseRoute(e.value, n.value.snapshot)) {
          const r = n.value;
          r._futureSnapshot = e.value;
          const o = (function WV(t, e, n) {
            return e.children.map((r) => {
              for (const o of n.children)
                if (t.shouldReuseRoute(r.value, o.value.snapshot))
                  return Is(t, r, o);
              return Is(t, r);
            });
          })(t, e, n);
          return new er(r, o);
        }
        {
          if (t.shouldAttach(e.value)) {
            const i = t.retrieve(e.value);
            if (null !== i) {
              const s = i.route;
              return (
                (s.value._futureSnapshot = e.value),
                (s.children = e.children.map((a) => Is(t, a))),
                s
              );
            }
          }
          const r = (function KV(t) {
              return new ri(
                new Bt(t.url),
                new Bt(t.params),
                new Bt(t.queryParams),
                new Bt(t.fragment),
                new Bt(t.data),
                t.outlet,
                t.component,
                t
              );
            })(e.value),
            o = e.children.map((i) => Is(t, i));
          return new er(r, o);
        }
      }
      const jh = "ngNavigationCancelingError";
      function Ub(t, e) {
        const { redirectTo: n, navigationBehaviorOptions: r } = Kr(e)
            ? { redirectTo: e, navigationBehaviorOptions: void 0 }
            : e,
          o = zb(!1, 0, e);
        return (o.url = n), (o.navigationBehaviorOptions = r), o;
      }
      function zb(t, e, n) {
        const r = new Error("NavigationCancelingError: " + (t || ""));
        return (r[jh] = !0), (r.cancellationCode = e), n && (r.url = n), r;
      }
      function qb(t) {
        return Gb(t) && Kr(t.url);
      }
      function Gb(t) {
        return t && t[jh];
      }
      let Wb = (() => {
        class t {}
        return (
          (t.ɵfac = function (n) {
            return new (n || t)();
          }),
          (t.ɵcmp = Xt({
            type: t,
            selectors: [["ng-component"]],
            standalone: !0,
            features: [$C],
            decls: 1,
            vars: 0,
            template: function (n, r) {
              1 & n && Ae(0, "router-outlet");
            },
            dependencies: [Yl],
            encapsulation: 2,
          })),
          t
        );
      })();
      function $h(t) {
        const e = t.children && t.children.map($h),
          n = e ? { ...t, children: e } : { ...t };
        return (
          !n.component &&
            !n.loadComponent &&
            (e || n.loadChildren) &&
            n.outlet &&
            n.outlet !== Z &&
            (n.component = Wb),
          n
        );
      }
      function ln(t) {
        return t.outlet || Z;
      }
      function Os(t) {
        if (!t) return null;
        if (t.routeConfig?._injector) return t.routeConfig._injector;
        for (let e = t.parent; e; e = e.parent) {
          const n = e.routeConfig;
          if (n?._loadedInjector) return n._loadedInjector;
          if (n?._injector) return n._injector;
        }
        return null;
      }
      class t2 {
        constructor(e, n, r, o, i) {
          (this.routeReuseStrategy = e),
            (this.futureState = n),
            (this.currState = r),
            (this.forwardEvent = o),
            (this.inputBindingEnabled = i);
        }
        activate(e) {
          const n = this.futureState._root,
            r = this.currState ? this.currState._root : null;
          this.deactivateChildRoutes(n, r, e),
            Bh(this.futureState.root),
            this.activateChildRoutes(n, r, e);
        }
        deactivateChildRoutes(e, n, r) {
          const o = ni(n);
          e.children.forEach((i) => {
            const s = i.value.outlet;
            this.deactivateRoutes(i, o[s], r), delete o[s];
          }),
            Object.values(o).forEach((i) => {
              this.deactivateRouteAndItsChildren(i, r);
            });
        }
        deactivateRoutes(e, n, r) {
          const o = e.value,
            i = n ? n.value : null;
          if (o === i)
            if (o.component) {
              const s = r.getContext(o.outlet);
              s && this.deactivateChildRoutes(e, n, s.children);
            } else this.deactivateChildRoutes(e, n, r);
          else i && this.deactivateRouteAndItsChildren(n, r);
        }
        deactivateRouteAndItsChildren(e, n) {
          e.value.component &&
          this.routeReuseStrategy.shouldDetach(e.value.snapshot)
            ? this.detachAndStoreRouteSubtree(e, n)
            : this.deactivateRouteAndOutlet(e, n);
        }
        detachAndStoreRouteSubtree(e, n) {
          const r = n.getContext(e.value.outlet),
            o = r && e.value.component ? r.children : n,
            i = ni(e);
          for (const s of Object.keys(i))
            this.deactivateRouteAndItsChildren(i[s], o);
          if (r && r.outlet) {
            const s = r.outlet.detach(),
              a = r.children.onOutletDeactivated();
            this.routeReuseStrategy.store(e.value.snapshot, {
              componentRef: s,
              route: e,
              contexts: a,
            });
          }
        }
        deactivateRouteAndOutlet(e, n) {
          const r = n.getContext(e.value.outlet),
            o = r && e.value.component ? r.children : n,
            i = ni(e);
          for (const s of Object.keys(i))
            this.deactivateRouteAndItsChildren(i[s], o);
          r &&
            (r.outlet &&
              (r.outlet.deactivate(), r.children.onOutletDeactivated()),
            (r.attachRef = null),
            (r.route = null));
        }
        activateChildRoutes(e, n, r) {
          const o = ni(n);
          e.children.forEach((i) => {
            this.activateRoutes(i, o[i.value.outlet], r),
              this.forwardEvent(new jV(i.value.snapshot));
          }),
            e.children.length && this.forwardEvent(new BV(e.value.snapshot));
        }
        activateRoutes(e, n, r) {
          const o = e.value,
            i = n ? n.value : null;
          if ((Bh(o), o === i))
            if (o.component) {
              const s = r.getOrCreateContext(o.outlet);
              this.activateChildRoutes(e, n, s.children);
            } else this.activateChildRoutes(e, n, r);
          else if (o.component) {
            const s = r.getOrCreateContext(o.outlet);
            if (this.routeReuseStrategy.shouldAttach(o.snapshot)) {
              const a = this.routeReuseStrategy.retrieve(o.snapshot);
              this.routeReuseStrategy.store(o.snapshot, null),
                s.children.onOutletReAttached(a.contexts),
                (s.attachRef = a.componentRef),
                (s.route = a.route.value),
                s.outlet && s.outlet.attach(a.componentRef, a.route.value),
                Bh(a.route.value),
                this.activateChildRoutes(e, null, s.children);
            } else {
              const a = Os(o.snapshot);
              (s.attachRef = null),
                (s.route = o),
                (s.injector = a),
                s.outlet && s.outlet.activateWith(o, s.injector),
                this.activateChildRoutes(e, null, s.children);
            }
          } else this.activateChildRoutes(e, null, r);
        }
      }
      class Kb {
        constructor(e) {
          (this.path = e), (this.route = this.path[this.path.length - 1]);
        }
      }
      class Jl {
        constructor(e, n) {
          (this.component = e), (this.route = n);
        }
      }
      function n2(t, e, n) {
        const r = t._root;
        return Ps(r, e ? e._root : null, n, [r.value]);
      }
      function oi(t, e) {
        const n = Symbol(),
          r = e.get(t, n);
        return r === n
          ? "function" != typeof t ||
            (function nT(t) {
              return null !== ra(t);
            })(t)
            ? e.get(t)
            : t
          : r;
      }
      function Ps(
        t,
        e,
        n,
        r,
        o = { canDeactivateChecks: [], canActivateChecks: [] }
      ) {
        const i = ni(e);
        return (
          t.children.forEach((s) => {
            (function o2(
              t,
              e,
              n,
              r,
              o = { canDeactivateChecks: [], canActivateChecks: [] }
            ) {
              const i = t.value,
                s = e ? e.value : null,
                a = n ? n.getContext(t.value.outlet) : null;
              if (s && i.routeConfig === s.routeConfig) {
                const l = (function i2(t, e, n) {
                  if ("function" == typeof n) return n(t, e);
                  switch (n) {
                    case "pathParamsChange":
                      return !Wr(t.url, e.url);
                    case "pathParamsOrQueryParamsChange":
                      return (
                        !Wr(t.url, e.url) || !On(t.queryParams, e.queryParams)
                      );
                    case "always":
                      return !0;
                    case "paramsOrQueryParamsChange":
                      return !Hh(t, e) || !On(t.queryParams, e.queryParams);
                    default:
                      return !Hh(t, e);
                  }
                })(s, i, i.routeConfig.runGuardsAndResolvers);
                l
                  ? o.canActivateChecks.push(new Kb(r))
                  : ((i.data = s.data), (i._resolvedData = s._resolvedData)),
                  Ps(t, e, i.component ? (a ? a.children : null) : n, r, o),
                  l &&
                    a &&
                    a.outlet &&
                    a.outlet.isActivated &&
                    o.canDeactivateChecks.push(new Jl(a.outlet.component, s));
              } else
                s && Ns(e, a, o),
                  o.canActivateChecks.push(new Kb(r)),
                  Ps(t, null, i.component ? (a ? a.children : null) : n, r, o);
            })(s, i[s.value.outlet], n, r.concat([s.value]), o),
              delete i[s.value.outlet];
          }),
          Object.entries(i).forEach(([s, a]) => Ns(a, n.getContext(s), o)),
          o
        );
      }
      function Ns(t, e, n) {
        const r = ni(t),
          o = t.value;
        Object.entries(r).forEach(([i, s]) => {
          Ns(s, o.component ? (e ? e.children.getContext(i) : null) : e, n);
        }),
          n.canDeactivateChecks.push(
            new Jl(
              o.component && e && e.outlet && e.outlet.isActivated
                ? e.outlet.component
                : null,
              o
            )
          );
      }
      function xs(t) {
        return "function" == typeof t;
      }
      function Qb(t) {
        return t instanceof jl || "EmptyError" === t?.name;
      }
      const eu = Symbol("INITIAL_VALUE");
      function ii() {
        return Zt((t) =>
          Sh(
            t.map((e) =>
              e.pipe(
                Xo(1),
                (function YL(...t) {
                  const e = mi(t);
                  return We((n, r) => {
                    (e ? Mh(t, n, e) : Mh(t, n)).subscribe(r);
                  });
                })(eu)
              )
            )
          ).pipe(
            oe((e) => {
              for (const n of e)
                if (!0 !== n) {
                  if (n === eu) return eu;
                  if (!1 === n || n instanceof ti) return n;
                }
              return !0;
            }),
            Jn((e) => e !== eu),
            Xo(1)
          )
        );
      }
      function Zb(t) {
        return (function aM(...t) {
          return hg(t);
        })(
          ft((e) => {
            if (Kr(e)) throw Ub(0, e);
          }),
          oe((e) => !0 === e)
        );
      }
      class tu {
        constructor(e) {
          this.segmentGroup = e || null;
        }
      }
      class Yb {
        constructor(e) {
          this.urlTree = e;
        }
      }
      function si(t) {
        return vs(new tu(t));
      }
      function Xb(t) {
        return vs(new Yb(t));
      }
      class S2 {
        constructor(e, n) {
          (this.urlSerializer = e), (this.urlTree = n);
        }
        noMatchError(e) {
          return new v(4002, !1);
        }
        lineralizeSegments(e, n) {
          let r = [],
            o = n.root;
          for (;;) {
            if (((r = r.concat(o.segments)), 0 === o.numberOfChildren))
              return j(r);
            if (o.numberOfChildren > 1 || !o.children[Z])
              return vs(new v(4e3, !1));
            o = o.children[Z];
          }
        }
        applyRedirectCommands(e, n, r) {
          return this.applyRedirectCreateUrlTree(
            n,
            this.urlSerializer.parse(n),
            e,
            r
          );
        }
        applyRedirectCreateUrlTree(e, n, r, o) {
          const i = this.createSegmentGroup(e, n.root, r, o);
          return new ti(
            i,
            this.createQueryParams(n.queryParams, this.urlTree.queryParams),
            n.fragment
          );
        }
        createQueryParams(e, n) {
          const r = {};
          return (
            Object.entries(e).forEach(([o, i]) => {
              if ("string" == typeof i && i.startsWith(":")) {
                const a = i.substring(1);
                r[o] = n[a];
              } else r[o] = i;
            }),
            r
          );
        }
        createSegmentGroup(e, n, r, o) {
          const i = this.createSegments(e, n.segments, r, o);
          let s = {};
          return (
            Object.entries(n.children).forEach(([a, l]) => {
              s[a] = this.createSegmentGroup(e, l, r, o);
            }),
            new de(i, s)
          );
        }
        createSegments(e, n, r, o) {
          return n.map((i) =>
            i.path.startsWith(":")
              ? this.findPosParam(e, i, o)
              : this.findOrReturn(i, r)
          );
        }
        findPosParam(e, n, r) {
          const o = r[n.path.substring(1)];
          if (!o) throw new v(4001, !1);
          return o;
        }
        findOrReturn(e, n) {
          let r = 0;
          for (const o of n) {
            if (o.path === e.path) return n.splice(r), o;
            r++;
          }
          return e;
        }
      }
      const Uh = {
        matched: !1,
        consumedSegments: [],
        remainingSegments: [],
        parameters: {},
        positionalParamSegments: {},
      };
      function M2(t, e, n, r, o) {
        const i = zh(t, e, n);
        return i.matched
          ? ((r = (function QV(t, e) {
              return (
                t.providers &&
                  !t._injector &&
                  (t._injector = mf(t.providers, e, `Route: ${t.path}`)),
                t._injector ?? e
              );
            })(e, r)),
            (function w2(t, e, n, r) {
              const o = e.canMatch;
              return o && 0 !== o.length
                ? j(
                    o.map((s) => {
                      const a = oi(s, t);
                      return yr(
                        (function d2(t) {
                          return t && xs(t.canMatch);
                        })(a)
                          ? a.canMatch(e, n)
                          : t.runInContext(() => a(e, n))
                      );
                    })
                  ).pipe(ii(), Zb())
                : j(!0);
            })(r, e, n).pipe(oe((s) => (!0 === s ? i : { ...Uh }))))
          : j(i);
      }
      function zh(t, e, n) {
        if ("" === e.path)
          return "full" === e.pathMatch && (t.hasChildren() || n.length > 0)
            ? { ...Uh }
            : {
                matched: !0,
                consumedSegments: [],
                remainingSegments: n,
                parameters: {},
                positionalParamSegments: {},
              };
        const o = (e.matcher || oV)(n, t, e);
        if (!o) return { ...Uh };
        const i = {};
        Object.entries(o.posParams ?? {}).forEach(([a, l]) => {
          i[a] = l.path;
        });
        const s =
          o.consumed.length > 0
            ? { ...i, ...o.consumed[o.consumed.length - 1].parameters }
            : i;
        return {
          matched: !0,
          consumedSegments: o.consumed,
          remainingSegments: n.slice(o.consumed.length),
          parameters: s,
          positionalParamSegments: o.posParams ?? {},
        };
      }
      function Jb(t, e, n, r) {
        return n.length > 0 &&
          (function I2(t, e, n) {
            return n.some((r) => nu(t, e, r) && ln(r) !== Z);
          })(t, n, r)
          ? {
              segmentGroup: new de(e, A2(r, new de(n, t.children))),
              slicedSegments: [],
            }
          : 0 === n.length &&
            (function O2(t, e, n) {
              return n.some((r) => nu(t, e, r));
            })(t, n, r)
          ? {
              segmentGroup: new de(t.segments, T2(t, 0, n, r, t.children)),
              slicedSegments: n,
            }
          : { segmentGroup: new de(t.segments, t.children), slicedSegments: n };
      }
      function T2(t, e, n, r, o) {
        const i = {};
        for (const s of r)
          if (nu(t, n, s) && !o[ln(s)]) {
            const a = new de([], {});
            i[ln(s)] = a;
          }
        return { ...o, ...i };
      }
      function A2(t, e) {
        const n = {};
        n[Z] = e;
        for (const r of t)
          if ("" === r.path && ln(r) !== Z) {
            const o = new de([], {});
            n[ln(r)] = o;
          }
        return n;
      }
      function nu(t, e, n) {
        return (
          (!(t.hasChildren() || e.length > 0) || "full" !== n.pathMatch) &&
          "" === n.path
        );
      }
      class R2 {
        constructor(e, n, r, o, i, s, a) {
          (this.injector = e),
            (this.configLoader = n),
            (this.rootComponentType = r),
            (this.config = o),
            (this.urlTree = i),
            (this.paramsInheritanceStrategy = s),
            (this.urlSerializer = a),
            (this.allowRedirects = !0),
            (this.applyRedirects = new S2(this.urlSerializer, this.urlTree));
        }
        noMatchError(e) {
          return new v(4002, !1);
        }
        recognize() {
          const e = Jb(this.urlTree.root, [], [], this.config).segmentGroup;
          return this.processSegmentGroup(
            this.injector,
            this.config,
            e,
            Z
          ).pipe(
            Gr((n) => {
              if (n instanceof Yb)
                return (
                  (this.allowRedirects = !1),
                  (this.urlTree = n.urlTree),
                  this.match(n.urlTree)
                );
              throw n instanceof tu ? this.noMatchError(n) : n;
            }),
            oe((n) => {
              const r = new Zl(
                  [],
                  Object.freeze({}),
                  Object.freeze({ ...this.urlTree.queryParams }),
                  this.urlTree.fragment,
                  {},
                  Z,
                  this.rootComponentType,
                  null,
                  {}
                ),
                o = new er(r, n),
                i = new Hb("", o),
                s = (function EV(t, e, n = null, r = null) {
                  return Ib(Ab(t), e, n, r);
                })(r, [], this.urlTree.queryParams, this.urlTree.fragment);
              return (
                (s.queryParams = this.urlTree.queryParams),
                (i.url = this.urlSerializer.serialize(s)),
                this.inheritParamsAndData(i._root),
                { state: i, tree: s }
              );
            })
          );
        }
        match(e) {
          return this.processSegmentGroup(
            this.injector,
            this.config,
            e.root,
            Z
          ).pipe(
            Gr((r) => {
              throw r instanceof tu ? this.noMatchError(r) : r;
            })
          );
        }
        inheritParamsAndData(e) {
          const n = e.value,
            r = Bb(n, this.paramsInheritanceStrategy);
          (n.params = Object.freeze(r.params)),
            (n.data = Object.freeze(r.data)),
            e.children.forEach((o) => this.inheritParamsAndData(o));
        }
        processSegmentGroup(e, n, r, o) {
          return 0 === r.segments.length && r.hasChildren()
            ? this.processChildren(e, n, r)
            : this.processSegment(e, n, r, r.segments, o, !0);
        }
        processChildren(e, n, r) {
          const o = [];
          for (const i of Object.keys(r.children))
            "primary" === i ? o.unshift(i) : o.push(i);
          return je(o).pipe(
            Jo((i) => {
              const s = r.children[i],
                a = (function JV(t, e) {
                  const n = t.filter((r) => ln(r) === e);
                  return n.push(...t.filter((r) => ln(r) !== e)), n;
                })(n, i);
              return this.processSegmentGroup(e, a, s, i);
            }),
            (function eV(t, e) {
              return We(
                (function JL(t, e, n, r, o) {
                  return (i, s) => {
                    let a = n,
                      l = e,
                      u = 0;
                    i.subscribe(
                      He(
                        s,
                        (c) => {
                          const d = u++;
                          (l = a ? t(l, c, d) : ((a = !0), c)), r && s.next(l);
                        },
                        o &&
                          (() => {
                            a && s.next(l), s.complete();
                          })
                      )
                    );
                  };
                })(t, e, arguments.length >= 2, !0)
              );
            })((i, s) => (i.push(...s), i)),
            $l(null),
            (function tV(t, e) {
              const n = arguments.length >= 2;
              return (r) =>
                r.pipe(
                  t ? Jn((o, i) => t(o, i, r)) : ir,
                  Ah(1),
                  n ? $l(e) : gb(() => new jl())
                );
            })(),
            Ke((i) => {
              if (null === i) return si(r);
              const s = eE(i);
              return (
                (function F2(t) {
                  t.sort((e, n) =>
                    e.value.outlet === Z
                      ? -1
                      : n.value.outlet === Z
                      ? 1
                      : e.value.outlet.localeCompare(n.value.outlet)
                  );
                })(s),
                j(s)
              );
            })
          );
        }
        processSegment(e, n, r, o, i, s) {
          return je(n).pipe(
            Jo((a) =>
              this.processSegmentAgainstRoute(
                a._injector ?? e,
                n,
                a,
                r,
                o,
                i,
                s
              ).pipe(
                Gr((l) => {
                  if (l instanceof tu) return j(null);
                  throw l;
                })
              )
            ),
            qr((a) => !!a),
            Gr((a) => {
              if (Qb(a))
                return (function N2(t, e, n) {
                  return 0 === e.length && !t.children[n];
                })(r, o, i)
                  ? j([])
                  : si(r);
              throw a;
            })
          );
        }
        processSegmentAgainstRoute(e, n, r, o, i, s, a) {
          return (function P2(t, e, n, r) {
            return (
              !!(ln(t) === r || (r !== Z && nu(e, n, t))) &&
              ("**" === t.path || zh(e, t, n).matched)
            );
          })(r, o, i, s)
            ? void 0 === r.redirectTo
              ? this.matchSegmentAgainstRoute(e, o, r, i, s, a)
              : a && this.allowRedirects
              ? this.expandSegmentAgainstRouteUsingRedirect(e, o, n, r, i, s)
              : si(o)
            : si(o);
        }
        expandSegmentAgainstRouteUsingRedirect(e, n, r, o, i, s) {
          return "**" === o.path
            ? this.expandWildCardWithParamsAgainstRouteUsingRedirect(e, r, o, s)
            : this.expandRegularSegmentAgainstRouteUsingRedirect(
                e,
                n,
                r,
                o,
                i,
                s
              );
        }
        expandWildCardWithParamsAgainstRouteUsingRedirect(e, n, r, o) {
          const i = this.applyRedirects.applyRedirectCommands(
            [],
            r.redirectTo,
            {}
          );
          return r.redirectTo.startsWith("/")
            ? Xb(i)
            : this.applyRedirects.lineralizeSegments(r, i).pipe(
                Ke((s) => {
                  const a = new de(s, {});
                  return this.processSegment(e, n, a, s, o, !1);
                })
              );
        }
        expandRegularSegmentAgainstRouteUsingRedirect(e, n, r, o, i, s) {
          const {
            matched: a,
            consumedSegments: l,
            remainingSegments: u,
            positionalParamSegments: c,
          } = zh(n, o, i);
          if (!a) return si(n);
          const d = this.applyRedirects.applyRedirectCommands(
            l,
            o.redirectTo,
            c
          );
          return o.redirectTo.startsWith("/")
            ? Xb(d)
            : this.applyRedirects
                .lineralizeSegments(o, d)
                .pipe(
                  Ke((f) => this.processSegment(e, r, n, f.concat(u), s, !1))
                );
        }
        matchSegmentAgainstRoute(e, n, r, o, i, s) {
          let a;
          if ("**" === r.path) {
            const l = o.length > 0 ? yb(o).parameters : {};
            (a = j({
              snapshot: new Zl(
                o,
                l,
                Object.freeze({ ...this.urlTree.queryParams }),
                this.urlTree.fragment,
                tE(r),
                ln(r),
                r.component ?? r._loadedComponent ?? null,
                r,
                nE(r)
              ),
              consumedSegments: [],
              remainingSegments: [],
            })),
              (n.children = {});
          } else
            a = M2(n, r, o, e).pipe(
              oe(
                ({
                  matched: l,
                  consumedSegments: u,
                  remainingSegments: c,
                  parameters: d,
                }) =>
                  l
                    ? {
                        snapshot: new Zl(
                          u,
                          d,
                          Object.freeze({ ...this.urlTree.queryParams }),
                          this.urlTree.fragment,
                          tE(r),
                          ln(r),
                          r.component ?? r._loadedComponent ?? null,
                          r,
                          nE(r)
                        ),
                        consumedSegments: u,
                        remainingSegments: c,
                      }
                    : null
              )
            );
          return a.pipe(
            Zt((l) =>
              null === l
                ? si(n)
                : this.getChildConfig((e = r._injector ?? e), r, o).pipe(
                    Zt(({ routes: u }) => {
                      const c = r._loadedInjector ?? e,
                        {
                          snapshot: d,
                          consumedSegments: f,
                          remainingSegments: h,
                        } = l,
                        { segmentGroup: p, slicedSegments: g } = Jb(n, f, h, u);
                      if (0 === g.length && p.hasChildren())
                        return this.processChildren(c, u, p).pipe(
                          oe((_) => (null === _ ? null : [new er(d, _)]))
                        );
                      if (0 === u.length && 0 === g.length)
                        return j([new er(d, [])]);
                      const y = ln(r) === i;
                      return this.processSegment(
                        c,
                        u,
                        p,
                        g,
                        y ? Z : i,
                        !0
                      ).pipe(oe((_) => [new er(d, _)]));
                    })
                  )
            )
          );
        }
        getChildConfig(e, n, r) {
          return n.children
            ? j({ routes: n.children, injector: e })
            : n.loadChildren
            ? void 0 !== n._loadedRoutes
              ? j({ routes: n._loadedRoutes, injector: n._loadedInjector })
              : (function D2(t, e, n, r) {
                  const o = e.canLoad;
                  return void 0 === o || 0 === o.length
                    ? j(!0)
                    : j(
                        o.map((s) => {
                          const a = oi(s, t);
                          return yr(
                            (function a2(t) {
                              return t && xs(t.canLoad);
                            })(a)
                              ? a.canLoad(e, n)
                              : t.runInContext(() => a(e, n))
                          );
                        })
                      ).pipe(ii(), Zb());
                })(e, n, r).pipe(
                  Ke((o) =>
                    o
                      ? this.configLoader.loadChildren(e, n).pipe(
                          ft((i) => {
                            (n._loadedRoutes = i.routes),
                              (n._loadedInjector = i.injector);
                          })
                        )
                      : (function E2(t) {
                          return vs(zb(!1, 3));
                        })()
                  )
                )
            : j({ routes: [], injector: e });
        }
      }
      function k2(t) {
        const e = t.value.routeConfig;
        return e && "" === e.path;
      }
      function eE(t) {
        const e = [],
          n = new Set();
        for (const r of t) {
          if (!k2(r)) {
            e.push(r);
            continue;
          }
          const o = e.find((i) => r.value.routeConfig === i.value.routeConfig);
          void 0 !== o ? (o.children.push(...r.children), n.add(o)) : e.push(r);
        }
        for (const r of n) {
          const o = eE(r.children);
          e.push(new er(r.value, o));
        }
        return e.filter((r) => !n.has(r));
      }
      function tE(t) {
        return t.data || {};
      }
      function nE(t) {
        return t.resolve || {};
      }
      function rE(t) {
        return "string" == typeof t.title || null === t.title;
      }
      function qh(t) {
        return Zt((e) => {
          const n = t(e);
          return n ? je(n).pipe(oe(() => e)) : j(e);
        });
      }
      const ai = new O("ROUTES");
      let Gh = (() => {
        class t {
          constructor() {
            (this.componentLoaders = new WeakMap()),
              (this.childrenLoaders = new WeakMap()),
              (this.compiler = A(FD));
          }
          loadComponent(n) {
            if (this.componentLoaders.get(n))
              return this.componentLoaders.get(n);
            if (n._loadedComponent) return j(n._loadedComponent);
            this.onLoadStartListener && this.onLoadStartListener(n);
            const r = yr(n.loadComponent()).pipe(
                oe(oE),
                ft((i) => {
                  this.onLoadEndListener && this.onLoadEndListener(n),
                    (n._loadedComponent = i);
                }),
                _s(() => {
                  this.componentLoaders.delete(n);
                })
              ),
              o = new pb(r, () => new Ln()).pipe(Th());
            return this.componentLoaders.set(n, o), o;
          }
          loadChildren(n, r) {
            if (this.childrenLoaders.get(r)) return this.childrenLoaders.get(r);
            if (r._loadedRoutes)
              return j({
                routes: r._loadedRoutes,
                injector: r._loadedInjector,
              });
            this.onLoadStartListener && this.onLoadStartListener(r);
            const i = this.loadModuleFactoryOrRoutes(r.loadChildren).pipe(
                oe((a) => {
                  this.onLoadEndListener && this.onLoadEndListener(r);
                  let l, u;
                  return (
                    Array.isArray(a)
                      ? (u = a)
                      : ((l = a.create(n).injector),
                        (u = l.get(ai, [], k.Self | k.Optional).flat())),
                    { routes: u.map($h), injector: l }
                  );
                }),
                _s(() => {
                  this.childrenLoaders.delete(r);
                })
              ),
              s = new pb(i, () => new Ln()).pipe(Th());
            return this.childrenLoaders.set(r, s), s;
          }
          loadModuleFactoryOrRoutes(n) {
            return yr(n()).pipe(
              oe(oE),
              Ke((r) =>
                r instanceof HC || Array.isArray(r)
                  ? j(r)
                  : je(this.compiler.compileModuleAsync(r))
              )
            );
          }
        }
        return (
          (t.ɵfac = function (n) {
            return new (n || t)();
          }),
          (t.ɵprov = N({ token: t, factory: t.ɵfac, providedIn: "root" })),
          t
        );
      })();
      function oE(t) {
        return (function U2(t) {
          return t && "object" == typeof t && "default" in t;
        })(t)
          ? t.default
          : t;
      }
      let ru = (() => {
        class t {
          get hasRequestedNavigation() {
            return 0 !== this.navigationId;
          }
          constructor() {
            (this.currentNavigation = null),
              (this.lastSuccessfulNavigation = null),
              (this.events = new Ln()),
              (this.configLoader = A(Gh)),
              (this.environmentInjector = A(wn)),
              (this.urlSerializer = A(ws)),
              (this.rootContexts = A(As)),
              (this.inputBindingEnabled = null !== A(Xl, { optional: !0 })),
              (this.navigationId = 0),
              (this.afterPreactivation = () => j(void 0)),
              (this.rootComponentType = null),
              (this.configLoader.onLoadEndListener = (o) =>
                this.events.next(new LV(o))),
              (this.configLoader.onLoadStartListener = (o) =>
                this.events.next(new kV(o)));
          }
          complete() {
            this.transitions?.complete();
          }
          handleNavigationRequest(n) {
            const r = ++this.navigationId;
            this.transitions?.next({ ...this.transitions.value, ...n, id: r });
          }
          setupNavigations(n) {
            return (
              (this.transitions = new Bt({
                id: 0,
                currentUrlTree: n.currentUrlTree,
                currentRawUrl: n.currentUrlTree,
                extractedUrl: n.urlHandlingStrategy.extract(n.currentUrlTree),
                urlAfterRedirects: n.urlHandlingStrategy.extract(
                  n.currentUrlTree
                ),
                rawUrl: n.currentUrlTree,
                extras: {},
                resolve: null,
                reject: null,
                promise: Promise.resolve(!0),
                source: Ms,
                restoredState: null,
                currentSnapshot: n.routerState.snapshot,
                targetSnapshot: null,
                currentRouterState: n.routerState,
                targetRouterState: null,
                guards: { canActivateChecks: [], canDeactivateChecks: [] },
                guardsResult: null,
              })),
              this.transitions.pipe(
                Jn((r) => 0 !== r.id),
                oe((r) => ({
                  ...r,
                  extractedUrl: n.urlHandlingStrategy.extract(r.rawUrl),
                })),
                Zt((r) => {
                  let o = !1,
                    i = !1;
                  return j(r).pipe(
                    ft((s) => {
                      this.currentNavigation = {
                        id: s.id,
                        initialUrl: s.rawUrl,
                        extractedUrl: s.extractedUrl,
                        trigger: s.source,
                        extras: s.extras,
                        previousNavigation: this.lastSuccessfulNavigation
                          ? {
                              ...this.lastSuccessfulNavigation,
                              previousNavigation: null,
                            }
                          : null,
                      };
                    }),
                    Zt((s) => {
                      const a = n.browserUrlTree.toString(),
                        l =
                          !n.navigated ||
                          s.extractedUrl.toString() !== a ||
                          a !== n.currentUrlTree.toString();
                      if (
                        !l &&
                        "reload" !==
                          (s.extras.onSameUrlNavigation ??
                            n.onSameUrlNavigation)
                      ) {
                        const c = "";
                        return (
                          this.events.next(
                            new Ts(s.id, n.serializeUrl(r.rawUrl), c, 0)
                          ),
                          (n.rawUrlTree = s.rawUrl),
                          s.resolve(null),
                          hn
                        );
                      }
                      if (n.urlHandlingStrategy.shouldProcessUrl(s.rawUrl))
                        return (
                          iE(s.source) && (n.browserUrlTree = s.extractedUrl),
                          j(s).pipe(
                            Zt((c) => {
                              const d = this.transitions?.getValue();
                              return (
                                this.events.next(
                                  new Rh(
                                    c.id,
                                    this.urlSerializer.serialize(
                                      c.extractedUrl
                                    ),
                                    c.source,
                                    c.restoredState
                                  )
                                ),
                                d !== this.transitions?.getValue()
                                  ? hn
                                  : Promise.resolve(c)
                              );
                            }),
                            (function L2(t, e, n, r, o, i) {
                              return Ke((s) =>
                                (function x2(
                                  t,
                                  e,
                                  n,
                                  r,
                                  o,
                                  i,
                                  s = "emptyOnly"
                                ) {
                                  return new R2(
                                    t,
                                    e,
                                    n,
                                    r,
                                    o,
                                    s,
                                    i
                                  ).recognize();
                                })(t, e, n, r, s.extractedUrl, o, i).pipe(
                                  oe(({ state: a, tree: l }) => ({
                                    ...s,
                                    targetSnapshot: a,
                                    urlAfterRedirects: l,
                                  }))
                                )
                              );
                            })(
                              this.environmentInjector,
                              this.configLoader,
                              this.rootComponentType,
                              n.config,
                              this.urlSerializer,
                              n.paramsInheritanceStrategy
                            ),
                            ft((c) => {
                              if (
                                ((r.targetSnapshot = c.targetSnapshot),
                                (r.urlAfterRedirects = c.urlAfterRedirects),
                                (this.currentNavigation = {
                                  ...this.currentNavigation,
                                  finalUrl: c.urlAfterRedirects,
                                }),
                                "eager" === n.urlUpdateStrategy)
                              ) {
                                if (!c.extras.skipLocationChange) {
                                  const f = n.urlHandlingStrategy.merge(
                                    c.urlAfterRedirects,
                                    c.rawUrl
                                  );
                                  n.setBrowserUrl(f, c);
                                }
                                n.browserUrlTree = c.urlAfterRedirects;
                              }
                              const d = new PV(
                                c.id,
                                this.urlSerializer.serialize(c.extractedUrl),
                                this.urlSerializer.serialize(
                                  c.urlAfterRedirects
                                ),
                                c.targetSnapshot
                              );
                              this.events.next(d);
                            })
                          )
                        );
                      if (
                        l &&
                        n.urlHandlingStrategy.shouldProcessUrl(n.rawUrlTree)
                      ) {
                        const {
                            id: c,
                            extractedUrl: d,
                            source: f,
                            restoredState: h,
                            extras: p,
                          } = s,
                          g = new Rh(c, this.urlSerializer.serialize(d), f, h);
                        this.events.next(g);
                        const y = Vb(0, this.rootComponentType).snapshot;
                        return j(
                          (r = {
                            ...s,
                            targetSnapshot: y,
                            urlAfterRedirects: d,
                            extras: {
                              ...p,
                              skipLocationChange: !1,
                              replaceUrl: !1,
                            },
                          })
                        );
                      }
                      {
                        const c = "";
                        return (
                          this.events.next(
                            new Ts(s.id, n.serializeUrl(r.extractedUrl), c, 1)
                          ),
                          (n.rawUrlTree = s.rawUrl),
                          s.resolve(null),
                          hn
                        );
                      }
                    }),
                    ft((s) => {
                      const a = new NV(
                        s.id,
                        this.urlSerializer.serialize(s.extractedUrl),
                        this.urlSerializer.serialize(s.urlAfterRedirects),
                        s.targetSnapshot
                      );
                      this.events.next(a);
                    }),
                    oe(
                      (s) =>
                        (r = {
                          ...s,
                          guards: n2(
                            s.targetSnapshot,
                            s.currentSnapshot,
                            this.rootContexts
                          ),
                        })
                    ),
                    (function h2(t, e) {
                      return Ke((n) => {
                        const {
                          targetSnapshot: r,
                          currentSnapshot: o,
                          guards: {
                            canActivateChecks: i,
                            canDeactivateChecks: s,
                          },
                        } = n;
                        return 0 === s.length && 0 === i.length
                          ? j({ ...n, guardsResult: !0 })
                          : (function p2(t, e, n, r) {
                              return je(t).pipe(
                                Ke((o) =>
                                  (function C2(t, e, n, r, o) {
                                    const i =
                                      e && e.routeConfig
                                        ? e.routeConfig.canDeactivate
                                        : null;
                                    return i && 0 !== i.length
                                      ? j(
                                          i.map((a) => {
                                            const l = Os(e) ?? o,
                                              u = oi(a, l);
                                            return yr(
                                              (function c2(t) {
                                                return t && xs(t.canDeactivate);
                                              })(u)
                                                ? u.canDeactivate(t, e, n, r)
                                                : l.runInContext(() =>
                                                    u(t, e, n, r)
                                                  )
                                            ).pipe(qr());
                                          })
                                        ).pipe(ii())
                                      : j(!0);
                                  })(o.component, o.route, n, e, r)
                                ),
                                qr((o) => !0 !== o, !0)
                              );
                            })(s, r, o, t).pipe(
                              Ke((a) =>
                                a &&
                                (function s2(t) {
                                  return "boolean" == typeof t;
                                })(a)
                                  ? (function g2(t, e, n, r) {
                                      return je(e).pipe(
                                        Jo((o) =>
                                          Mh(
                                            (function y2(t, e) {
                                              return (
                                                null !== t && e && e(new VV(t)),
                                                j(!0)
                                              );
                                            })(o.route.parent, r),
                                            (function m2(t, e) {
                                              return (
                                                null !== t && e && e(new HV(t)),
                                                j(!0)
                                              );
                                            })(o.route, r),
                                            (function _2(t, e, n) {
                                              const r = e[e.length - 1],
                                                i = e
                                                  .slice(0, e.length - 1)
                                                  .reverse()
                                                  .map((s) =>
                                                    (function r2(t) {
                                                      const e = t.routeConfig
                                                        ? t.routeConfig
                                                            .canActivateChild
                                                        : null;
                                                      return e && 0 !== e.length
                                                        ? { node: t, guards: e }
                                                        : null;
                                                    })(s)
                                                  )
                                                  .filter((s) => null !== s)
                                                  .map((s) =>
                                                    hb(() =>
                                                      j(
                                                        s.guards.map((l) => {
                                                          const u =
                                                              Os(s.node) ?? n,
                                                            c = oi(l, u);
                                                          return yr(
                                                            (function u2(t) {
                                                              return (
                                                                t &&
                                                                xs(
                                                                  t.canActivateChild
                                                                )
                                                              );
                                                            })(c)
                                                              ? c.canActivateChild(
                                                                  r,
                                                                  t
                                                                )
                                                              : u.runInContext(
                                                                  () => c(r, t)
                                                                )
                                                          ).pipe(qr());
                                                        })
                                                      ).pipe(ii())
                                                    )
                                                  );
                                              return j(i).pipe(ii());
                                            })(t, o.path, n),
                                            (function v2(t, e, n) {
                                              const r = e.routeConfig
                                                ? e.routeConfig.canActivate
                                                : null;
                                              if (!r || 0 === r.length)
                                                return j(!0);
                                              const o = r.map((i) =>
                                                hb(() => {
                                                  const s = Os(e) ?? n,
                                                    a = oi(i, s);
                                                  return yr(
                                                    (function l2(t) {
                                                      return (
                                                        t && xs(t.canActivate)
                                                      );
                                                    })(a)
                                                      ? a.canActivate(e, t)
                                                      : s.runInContext(() =>
                                                          a(e, t)
                                                        )
                                                  ).pipe(qr());
                                                })
                                              );
                                              return j(o).pipe(ii());
                                            })(t, o.route, n)
                                          )
                                        ),
                                        qr((o) => !0 !== o, !0)
                                      );
                                    })(r, i, t, e)
                                  : j(a)
                              ),
                              oe((a) => ({ ...n, guardsResult: a }))
                            );
                      });
                    })(this.environmentInjector, (s) => this.events.next(s)),
                    ft((s) => {
                      if (
                        ((r.guardsResult = s.guardsResult), Kr(s.guardsResult))
                      )
                        throw Ub(0, s.guardsResult);
                      const a = new xV(
                        s.id,
                        this.urlSerializer.serialize(s.extractedUrl),
                        this.urlSerializer.serialize(s.urlAfterRedirects),
                        s.targetSnapshot,
                        !!s.guardsResult
                      );
                      this.events.next(a);
                    }),
                    Jn(
                      (s) =>
                        !!s.guardsResult ||
                        (n.restoreHistory(s),
                        this.cancelNavigationTransition(s, "", 3),
                        !1)
                    ),
                    qh((s) => {
                      if (s.guards.canActivateChecks.length)
                        return j(s).pipe(
                          ft((a) => {
                            const l = new RV(
                              a.id,
                              this.urlSerializer.serialize(a.extractedUrl),
                              this.urlSerializer.serialize(a.urlAfterRedirects),
                              a.targetSnapshot
                            );
                            this.events.next(l);
                          }),
                          Zt((a) => {
                            let l = !1;
                            return j(a).pipe(
                              (function V2(t, e) {
                                return Ke((n) => {
                                  const {
                                    targetSnapshot: r,
                                    guards: { canActivateChecks: o },
                                  } = n;
                                  if (!o.length) return j(n);
                                  let i = 0;
                                  return je(o).pipe(
                                    Jo((s) =>
                                      (function B2(t, e, n, r) {
                                        const o = t.routeConfig,
                                          i = t._resolve;
                                        return (
                                          void 0 !== o?.title &&
                                            !rE(o) &&
                                            (i[Cs] = o.title),
                                          (function H2(t, e, n, r) {
                                            const o = (function j2(t) {
                                              return [
                                                ...Object.keys(t),
                                                ...Object.getOwnPropertySymbols(
                                                  t
                                                ),
                                              ];
                                            })(t);
                                            if (0 === o.length) return j({});
                                            const i = {};
                                            return je(o).pipe(
                                              Ke((s) =>
                                                (function $2(t, e, n, r) {
                                                  const o = Os(e) ?? r,
                                                    i = oi(t, o);
                                                  return yr(
                                                    i.resolve
                                                      ? i.resolve(e, n)
                                                      : o.runInContext(() =>
                                                          i(e, n)
                                                        )
                                                  );
                                                })(t[s], e, n, r).pipe(
                                                  qr(),
                                                  ft((a) => {
                                                    i[s] = a;
                                                  })
                                                )
                                              ),
                                              Ah(1),
                                              (function nV(t) {
                                                return oe(() => t);
                                              })(i),
                                              Gr((s) => (Qb(s) ? hn : vs(s)))
                                            );
                                          })(i, t, e, r).pipe(
                                            oe(
                                              (s) => (
                                                (t._resolvedData = s),
                                                (t.data = Bb(t, n).resolve),
                                                o &&
                                                  rE(o) &&
                                                  (t.data[Cs] = o.title),
                                                null
                                              )
                                            )
                                          )
                                        );
                                      })(s.route, r, t, e)
                                    ),
                                    ft(() => i++),
                                    Ah(1),
                                    Ke((s) => (i === o.length ? j(n) : hn))
                                  );
                                });
                              })(
                                n.paramsInheritanceStrategy,
                                this.environmentInjector
                              ),
                              ft({
                                next: () => (l = !0),
                                complete: () => {
                                  l ||
                                    (n.restoreHistory(a),
                                    this.cancelNavigationTransition(a, "", 2));
                                },
                              })
                            );
                          }),
                          ft((a) => {
                            const l = new FV(
                              a.id,
                              this.urlSerializer.serialize(a.extractedUrl),
                              this.urlSerializer.serialize(a.urlAfterRedirects),
                              a.targetSnapshot
                            );
                            this.events.next(l);
                          })
                        );
                    }),
                    qh((s) => {
                      const a = (l) => {
                        const u = [];
                        l.routeConfig?.loadComponent &&
                          !l.routeConfig._loadedComponent &&
                          u.push(
                            this.configLoader.loadComponent(l.routeConfig).pipe(
                              ft((c) => {
                                l.component = c;
                              }),
                              oe(() => {})
                            )
                          );
                        for (const c of l.children) u.push(...a(c));
                        return u;
                      };
                      return Sh(a(s.targetSnapshot.root)).pipe($l(), Xo(1));
                    }),
                    qh(() => this.afterPreactivation()),
                    oe((s) => {
                      const a = (function GV(t, e, n) {
                        const r = Is(t, e._root, n ? n._root : void 0);
                        return new Lb(r, e);
                      })(
                        n.routeReuseStrategy,
                        s.targetSnapshot,
                        s.currentRouterState
                      );
                      return (r = { ...s, targetRouterState: a });
                    }),
                    ft((s) => {
                      (n.currentUrlTree = s.urlAfterRedirects),
                        (n.rawUrlTree = n.urlHandlingStrategy.merge(
                          s.urlAfterRedirects,
                          s.rawUrl
                        )),
                        (n.routerState = s.targetRouterState),
                        "deferred" === n.urlUpdateStrategy &&
                          (s.extras.skipLocationChange ||
                            n.setBrowserUrl(n.rawUrlTree, s),
                          (n.browserUrlTree = s.urlAfterRedirects));
                    }),
                    ((t, e, n, r) =>
                      oe(
                        (o) => (
                          new t2(
                            e,
                            o.targetRouterState,
                            o.currentRouterState,
                            n,
                            r
                          ).activate(t),
                          o
                        )
                      ))(
                      this.rootContexts,
                      n.routeReuseStrategy,
                      (s) => this.events.next(s),
                      this.inputBindingEnabled
                    ),
                    Xo(1),
                    ft({
                      next: (s) => {
                        (o = !0),
                          (this.lastSuccessfulNavigation =
                            this.currentNavigation),
                          (n.navigated = !0),
                          this.events.next(
                            new Qr(
                              s.id,
                              this.urlSerializer.serialize(s.extractedUrl),
                              this.urlSerializer.serialize(n.currentUrlTree)
                            )
                          ),
                          n.titleStrategy?.updateTitle(
                            s.targetRouterState.snapshot
                          ),
                          s.resolve(!0);
                      },
                      complete: () => {
                        o = !0;
                      },
                    }),
                    _s(() => {
                      o || i || this.cancelNavigationTransition(r, "", 1),
                        this.currentNavigation?.id === r.id &&
                          (this.currentNavigation = null);
                    }),
                    Gr((s) => {
                      if (((i = !0), Gb(s))) {
                        qb(s) || ((n.navigated = !0), n.restoreHistory(r, !0));
                        const a = new Ql(
                          r.id,
                          this.urlSerializer.serialize(r.extractedUrl),
                          s.message,
                          s.cancellationCode
                        );
                        if ((this.events.next(a), qb(s))) {
                          const l = n.urlHandlingStrategy.merge(
                              s.url,
                              n.rawUrlTree
                            ),
                            u = {
                              skipLocationChange: r.extras.skipLocationChange,
                              replaceUrl:
                                "eager" === n.urlUpdateStrategy || iE(r.source),
                            };
                          n.scheduleNavigation(l, Ms, null, u, {
                            resolve: r.resolve,
                            reject: r.reject,
                            promise: r.promise,
                          });
                        } else r.resolve(!1);
                      } else {
                        n.restoreHistory(r, !0);
                        const a = new Fh(
                          r.id,
                          this.urlSerializer.serialize(r.extractedUrl),
                          s,
                          r.targetSnapshot ?? void 0
                        );
                        this.events.next(a);
                        try {
                          r.resolve(n.errorHandler(s));
                        } catch (l) {
                          r.reject(l);
                        }
                      }
                      return hn;
                    })
                  );
                })
              )
            );
          }
          cancelNavigationTransition(n, r, o) {
            const i = new Ql(
              n.id,
              this.urlSerializer.serialize(n.extractedUrl),
              r,
              o
            );
            this.events.next(i), n.resolve(!1);
          }
        }
        return (
          (t.ɵfac = function (n) {
            return new (n || t)();
          }),
          (t.ɵprov = N({ token: t, factory: t.ɵfac, providedIn: "root" })),
          t
        );
      })();
      function iE(t) {
        return t !== Ms;
      }
      let sE = (() => {
          class t {
            buildTitle(n) {
              let r,
                o = n.root;
              for (; void 0 !== o; )
                (r = this.getResolvedTitleForRoute(o) ?? r),
                  (o = o.children.find((i) => i.outlet === Z));
              return r;
            }
            getResolvedTitleForRoute(n) {
              return n.data[Cs];
            }
          }
          return (
            (t.ɵfac = function (n) {
              return new (n || t)();
            }),
            (t.ɵprov = N({
              token: t,
              factory: function () {
                return A(z2);
              },
              providedIn: "root",
            })),
            t
          );
        })(),
        z2 = (() => {
          class t extends sE {
            constructor(n) {
              super(), (this.title = n);
            }
            updateTitle(n) {
              const r = this.buildTitle(n);
              void 0 !== r && this.title.setTitle(r);
            }
          }
          return (
            (t.ɵfac = function (n) {
              return new (n || t)(I(ib));
            }),
            (t.ɵprov = N({ token: t, factory: t.ɵfac, providedIn: "root" })),
            t
          );
        })(),
        q2 = (() => {
          class t {}
          return (
            (t.ɵfac = function (n) {
              return new (n || t)();
            }),
            (t.ɵprov = N({
              token: t,
              factory: function () {
                return A(W2);
              },
              providedIn: "root",
            })),
            t
          );
        })();
      class G2 {
        shouldDetach(e) {
          return !1;
        }
        store(e, n) {}
        shouldAttach(e) {
          return !1;
        }
        retrieve(e) {
          return null;
        }
        shouldReuseRoute(e, n) {
          return e.routeConfig === n.routeConfig;
        }
      }
      let W2 = (() => {
        class t extends G2 {}
        return (
          (t.ɵfac = (function () {
            let e;
            return function (r) {
              return (e || (e = Xe(t)))(r || t);
            };
          })()),
          (t.ɵprov = N({ token: t, factory: t.ɵfac, providedIn: "root" })),
          t
        );
      })();
      const ou = new O("", { providedIn: "root", factory: () => ({}) });
      let K2 = (() => {
          class t {}
          return (
            (t.ɵfac = function (n) {
              return new (n || t)();
            }),
            (t.ɵprov = N({
              token: t,
              factory: function () {
                return A(Q2);
              },
              providedIn: "root",
            })),
            t
          );
        })(),
        Q2 = (() => {
          class t {
            shouldProcessUrl(n) {
              return !0;
            }
            extract(n) {
              return n;
            }
            merge(n, r) {
              return n;
            }
          }
          return (
            (t.ɵfac = function (n) {
              return new (n || t)();
            }),
            (t.ɵprov = N({ token: t, factory: t.ɵfac, providedIn: "root" })),
            t
          );
        })();
      var Rt = (() => (
        ((Rt = Rt || {})[(Rt.COMPLETE = 0)] = "COMPLETE"),
        (Rt[(Rt.FAILED = 1)] = "FAILED"),
        (Rt[(Rt.REDIRECTING = 2)] = "REDIRECTING"),
        Rt
      ))();
      function aE(t, e) {
        t.events
          .pipe(
            Jn(
              (n) =>
                n instanceof Qr ||
                n instanceof Ql ||
                n instanceof Fh ||
                n instanceof Ts
            ),
            oe((n) =>
              n instanceof Qr || n instanceof Ts
                ? Rt.COMPLETE
                : n instanceof Ql && (0 === n.code || 1 === n.code)
                ? Rt.REDIRECTING
                : Rt.FAILED
            ),
            Jn((n) => n !== Rt.REDIRECTING),
            Xo(1)
          )
          .subscribe(() => {
            e();
          });
      }
      function Z2(t) {
        throw t;
      }
      function Y2(t, e, n) {
        return e.parse("/");
      }
      const X2 = {
          paths: "exact",
          fragment: "ignored",
          matrixParams: "ignored",
          queryParams: "exact",
        },
        J2 = {
          paths: "subset",
          fragment: "ignored",
          matrixParams: "ignored",
          queryParams: "subset",
        };
      let Je = (() => {
          class t {
            get navigationId() {
              return this.navigationTransitions.navigationId;
            }
            get browserPageId() {
              if ("computed" === this.canceledNavigationResolution)
                return this.location.getState()?.ɵrouterPageId;
            }
            get events() {
              return this.navigationTransitions.events;
            }
            constructor() {
              (this.disposed = !1),
                (this.currentPageId = 0),
                (this.console = A(RD)),
                (this.isNgZoneEnabled = !1),
                (this.options = A(ou, { optional: !0 }) || {}),
                (this.pendingTasks = A(_l)),
                (this.errorHandler = this.options.errorHandler || Z2),
                (this.malformedUriErrorHandler =
                  this.options.malformedUriErrorHandler || Y2),
                (this.navigated = !1),
                (this.lastSuccessfulId = -1),
                (this.urlHandlingStrategy = A(K2)),
                (this.routeReuseStrategy = A(q2)),
                (this.titleStrategy = A(sE)),
                (this.onSameUrlNavigation =
                  this.options.onSameUrlNavigation || "ignore"),
                (this.paramsInheritanceStrategy =
                  this.options.paramsInheritanceStrategy || "emptyOnly"),
                (this.urlUpdateStrategy =
                  this.options.urlUpdateStrategy || "deferred"),
                (this.canceledNavigationResolution =
                  this.options.canceledNavigationResolution || "replace"),
                (this.config = A(ai, { optional: !0 })?.flat() ?? []),
                (this.navigationTransitions = A(ru)),
                (this.urlSerializer = A(ws)),
                (this.location = A(Xf)),
                (this.componentInputBindingEnabled = !!A(Xl, { optional: !0 })),
                (this.isNgZoneEnabled =
                  A(ye) instanceof ye && ye.isInAngularZone()),
                this.resetConfig(this.config),
                (this.currentUrlTree = new ti()),
                (this.rawUrlTree = this.currentUrlTree),
                (this.browserUrlTree = this.currentUrlTree),
                (this.routerState = Vb(0, null)),
                this.navigationTransitions.setupNavigations(this).subscribe(
                  (n) => {
                    (this.lastSuccessfulId = n.id),
                      (this.currentPageId = this.browserPageId ?? 0);
                  },
                  (n) => {
                    this.console.warn(`Unhandled Navigation Error: ${n}`);
                  }
                );
            }
            resetRootComponentType(n) {
              (this.routerState.root.component = n),
                (this.navigationTransitions.rootComponentType = n);
            }
            initialNavigation() {
              if (
                (this.setUpLocationChangeListener(),
                !this.navigationTransitions.hasRequestedNavigation)
              ) {
                const n = this.location.getState();
                this.navigateToSyncWithBrowser(this.location.path(!0), Ms, n);
              }
            }
            setUpLocationChangeListener() {
              this.locationSubscription ||
                (this.locationSubscription = this.location.subscribe((n) => {
                  const r = "popstate" === n.type ? "popstate" : "hashchange";
                  "popstate" === r &&
                    setTimeout(() => {
                      this.navigateToSyncWithBrowser(n.url, r, n.state);
                    }, 0);
                }));
            }
            navigateToSyncWithBrowser(n, r, o) {
              const i = { replaceUrl: !0 },
                s = o?.navigationId ? o : null;
              if (o) {
                const l = { ...o };
                delete l.navigationId,
                  delete l.ɵrouterPageId,
                  0 !== Object.keys(l).length && (i.state = l);
              }
              const a = this.parseUrl(n);
              this.scheduleNavigation(a, r, s, i);
            }
            get url() {
              return this.serializeUrl(this.currentUrlTree);
            }
            getCurrentNavigation() {
              return this.navigationTransitions.currentNavigation;
            }
            get lastSuccessfulNavigation() {
              return this.navigationTransitions.lastSuccessfulNavigation;
            }
            resetConfig(n) {
              (this.config = n.map($h)),
                (this.navigated = !1),
                (this.lastSuccessfulId = -1);
            }
            ngOnDestroy() {
              this.dispose();
            }
            dispose() {
              this.navigationTransitions.complete(),
                this.locationSubscription &&
                  (this.locationSubscription.unsubscribe(),
                  (this.locationSubscription = void 0)),
                (this.disposed = !0);
            }
            createUrlTree(n, r = {}) {
              const {
                  relativeTo: o,
                  queryParams: i,
                  fragment: s,
                  queryParamsHandling: a,
                  preserveFragment: l,
                } = r,
                u = l ? this.currentUrlTree.fragment : s;
              let d,
                c = null;
              switch (a) {
                case "merge":
                  c = { ...this.currentUrlTree.queryParams, ...i };
                  break;
                case "preserve":
                  c = this.currentUrlTree.queryParams;
                  break;
                default:
                  c = i || null;
              }
              null !== c && (c = this.removeEmptyProps(c));
              try {
                d = Ab(o ? o.snapshot : this.routerState.snapshot.root);
              } catch {
                ("string" != typeof n[0] || !n[0].startsWith("/")) && (n = []),
                  (d = this.currentUrlTree.root);
              }
              return Ib(d, n, c, u ?? null);
            }
            navigateByUrl(n, r = { skipLocationChange: !1 }) {
              const o = Kr(n) ? n : this.parseUrl(n),
                i = this.urlHandlingStrategy.merge(o, this.rawUrlTree);
              return this.scheduleNavigation(i, Ms, null, r);
            }
            navigate(n, r = { skipLocationChange: !1 }) {
              return (
                (function eB(t) {
                  for (let e = 0; e < t.length; e++)
                    if (null == t[e]) throw new v(4008, !1);
                })(n),
                this.navigateByUrl(this.createUrlTree(n, r), r)
              );
            }
            serializeUrl(n) {
              return this.urlSerializer.serialize(n);
            }
            parseUrl(n) {
              let r;
              try {
                r = this.urlSerializer.parse(n);
              } catch (o) {
                r = this.malformedUriErrorHandler(o, this.urlSerializer, n);
              }
              return r;
            }
            isActive(n, r) {
              let o;
              if (
                ((o = !0 === r ? { ...X2 } : !1 === r ? { ...J2 } : r), Kr(n))
              )
                return _b(this.currentUrlTree, n, o);
              const i = this.parseUrl(n);
              return _b(this.currentUrlTree, i, o);
            }
            removeEmptyProps(n) {
              return Object.keys(n).reduce((r, o) => {
                const i = n[o];
                return null != i && (r[o] = i), r;
              }, {});
            }
            scheduleNavigation(n, r, o, i, s) {
              if (this.disposed) return Promise.resolve(!1);
              let a, l, u;
              s
                ? ((a = s.resolve), (l = s.reject), (u = s.promise))
                : (u = new Promise((d, f) => {
                    (a = d), (l = f);
                  }));
              const c = this.pendingTasks.add();
              return (
                aE(this, () => {
                  Promise.resolve().then(() => this.pendingTasks.remove(c));
                }),
                this.navigationTransitions.handleNavigationRequest({
                  source: r,
                  restoredState: o,
                  currentUrlTree: this.currentUrlTree,
                  currentRawUrl: this.currentUrlTree,
                  rawUrl: n,
                  extras: i,
                  resolve: a,
                  reject: l,
                  promise: u,
                  currentSnapshot: this.routerState.snapshot,
                  currentRouterState: this.routerState,
                }),
                u.catch((d) => Promise.reject(d))
              );
            }
            setBrowserUrl(n, r) {
              const o = this.urlSerializer.serialize(n);
              if (
                this.location.isCurrentPathEqualTo(o) ||
                r.extras.replaceUrl
              ) {
                const s = {
                  ...r.extras.state,
                  ...this.generateNgRouterState(r.id, this.browserPageId),
                };
                this.location.replaceState(o, "", s);
              } else {
                const i = {
                  ...r.extras.state,
                  ...this.generateNgRouterState(
                    r.id,
                    (this.browserPageId ?? 0) + 1
                  ),
                };
                this.location.go(o, "", i);
              }
            }
            restoreHistory(n, r = !1) {
              if ("computed" === this.canceledNavigationResolution) {
                const i =
                  this.currentPageId -
                  (this.browserPageId ?? this.currentPageId);
                0 !== i
                  ? this.location.historyGo(i)
                  : this.currentUrlTree ===
                      this.getCurrentNavigation()?.finalUrl &&
                    0 === i &&
                    (this.resetState(n),
                    (this.browserUrlTree = n.currentUrlTree),
                    this.resetUrlToCurrentUrlTree());
              } else
                "replace" === this.canceledNavigationResolution &&
                  (r && this.resetState(n), this.resetUrlToCurrentUrlTree());
            }
            resetState(n) {
              (this.routerState = n.currentRouterState),
                (this.currentUrlTree = n.currentUrlTree),
                (this.rawUrlTree = this.urlHandlingStrategy.merge(
                  this.currentUrlTree,
                  n.rawUrl
                ));
            }
            resetUrlToCurrentUrlTree() {
              this.location.replaceState(
                this.urlSerializer.serialize(this.rawUrlTree),
                "",
                this.generateNgRouterState(
                  this.lastSuccessfulId,
                  this.currentPageId
                )
              );
            }
            generateNgRouterState(n, r) {
              return "computed" === this.canceledNavigationResolution
                ? { navigationId: n, ɵrouterPageId: r }
                : { navigationId: n };
            }
          }
          return (
            (t.ɵfac = function (n) {
              return new (n || t)();
            }),
            (t.ɵprov = N({ token: t, factory: t.ɵfac, providedIn: "root" })),
            t
          );
        })(),
        iu = (() => {
          class t {
            constructor(n, r, o, i, s, a) {
              (this.router = n),
                (this.route = r),
                (this.tabIndexAttribute = o),
                (this.renderer = i),
                (this.el = s),
                (this.locationStrategy = a),
                (this.href = null),
                (this.commands = null),
                (this.onChanges = new Ln()),
                (this.preserveFragment = !1),
                (this.skipLocationChange = !1),
                (this.replaceUrl = !1);
              const l = s.nativeElement.tagName?.toLowerCase();
              (this.isAnchorElement = "a" === l || "area" === l),
                this.isAnchorElement
                  ? (this.subscription = n.events.subscribe((u) => {
                      u instanceof Qr && this.updateHref();
                    }))
                  : this.setTabIndexIfNotOnNativeEl("0");
            }
            setTabIndexIfNotOnNativeEl(n) {
              null != this.tabIndexAttribute ||
                this.isAnchorElement ||
                this.applyAttributeValue("tabindex", n);
            }
            ngOnChanges(n) {
              this.isAnchorElement && this.updateHref(),
                this.onChanges.next(this);
            }
            set routerLink(n) {
              null != n
                ? ((this.commands = Array.isArray(n) ? n : [n]),
                  this.setTabIndexIfNotOnNativeEl("0"))
                : ((this.commands = null),
                  this.setTabIndexIfNotOnNativeEl(null));
            }
            onClick(n, r, o, i, s) {
              return (
                !!(
                  null === this.urlTree ||
                  (this.isAnchorElement &&
                    (0 !== n ||
                      r ||
                      o ||
                      i ||
                      s ||
                      ("string" == typeof this.target &&
                        "_self" != this.target)))
                ) ||
                (this.router.navigateByUrl(this.urlTree, {
                  skipLocationChange: this.skipLocationChange,
                  replaceUrl: this.replaceUrl,
                  state: this.state,
                }),
                !this.isAnchorElement)
              );
            }
            ngOnDestroy() {
              this.subscription?.unsubscribe();
            }
            updateHref() {
              this.href =
                null !== this.urlTree && this.locationStrategy
                  ? this.locationStrategy?.prepareExternalUrl(
                      this.router.serializeUrl(this.urlTree)
                    )
                  : null;
              const n =
                null === this.href
                  ? null
                  : (function Wy(t, e, n) {
                      return (function oO(t, e) {
                        return ("src" === e &&
                          ("embed" === t ||
                            "frame" === t ||
                            "iframe" === t ||
                            "media" === t ||
                            "script" === t)) ||
                          ("href" === e && ("base" === t || "link" === t))
                          ? Gy
                          : hd;
                      })(
                        e,
                        n
                      )(t);
                    })(
                      this.href,
                      this.el.nativeElement.tagName.toLowerCase(),
                      "href"
                    );
              this.applyAttributeValue("href", n);
            }
            applyAttributeValue(n, r) {
              const o = this.renderer,
                i = this.el.nativeElement;
              null !== r ? o.setAttribute(i, n, r) : o.removeAttribute(i, n);
            }
            get urlTree() {
              return null === this.commands
                ? null
                : this.router.createUrlTree(this.commands, {
                    relativeTo:
                      void 0 !== this.relativeTo ? this.relativeTo : this.route,
                    queryParams: this.queryParams,
                    fragment: this.fragment,
                    queryParamsHandling: this.queryParamsHandling,
                    preserveFragment: this.preserveFragment,
                  });
            }
          }
          return (
            (t.ɵfac = function (n) {
              return new (n || t)(
                C(Je),
                C(ri),
                (function Ma(t) {
                  return (function TA(t, e) {
                    if ("class" === e) return t.classes;
                    if ("style" === e) return t.styles;
                    const n = t.attrs;
                    if (n) {
                      const r = n.length;
                      let o = 0;
                      for (; o < r; ) {
                        const i = n[o];
                        if (Gg(i)) break;
                        if (0 === i) o += 2;
                        else if ("number" == typeof i)
                          for (o++; o < r && "string" == typeof n[o]; ) o++;
                        else {
                          if (i === e) return n[o + 1];
                          o += 2;
                        }
                      }
                    }
                    return null;
                  })(Ye(), t);
                })("tabindex"),
                C(qn),
                C(Pt),
                C(zr)
              );
            }),
            (t.ɵdir = U({
              type: t,
              selectors: [["", "routerLink", ""]],
              hostVars: 1,
              hostBindings: function (n, r) {
                1 & n &&
                  Ie("click", function (i) {
                    return r.onClick(
                      i.button,
                      i.ctrlKey,
                      i.shiftKey,
                      i.altKey,
                      i.metaKey
                    );
                  }),
                  2 & n && Mn("target", r.target);
              },
              inputs: {
                target: "target",
                queryParams: "queryParams",
                fragment: "fragment",
                queryParamsHandling: "queryParamsHandling",
                state: "state",
                relativeTo: "relativeTo",
                preserveFragment: ["preserveFragment", "preserveFragment", Yo],
                skipLocationChange: [
                  "skipLocationChange",
                  "skipLocationChange",
                  Yo,
                ],
                replaceUrl: ["replaceUrl", "replaceUrl", Yo],
                routerLink: "routerLink",
              },
              standalone: !0,
              features: [t_, jt],
            })),
            t
          );
        })();
      class lE {}
      let rB = (() => {
        class t {
          constructor(n, r, o, i, s) {
            (this.router = n),
              (this.injector = o),
              (this.preloadingStrategy = i),
              (this.loader = s);
          }
          setUpPreloading() {
            this.subscription = this.router.events
              .pipe(
                Jn((n) => n instanceof Qr),
                Jo(() => this.preload())
              )
              .subscribe(() => {});
          }
          preload() {
            return this.processRoutes(this.injector, this.router.config);
          }
          ngOnDestroy() {
            this.subscription && this.subscription.unsubscribe();
          }
          processRoutes(n, r) {
            const o = [];
            for (const i of r) {
              i.providers &&
                !i._injector &&
                (i._injector = mf(i.providers, n, `Route: ${i.path}`));
              const s = i._injector ?? n,
                a = i._loadedInjector ?? s;
              ((i.loadChildren && !i._loadedRoutes && void 0 === i.canLoad) ||
                (i.loadComponent && !i._loadedComponent)) &&
                o.push(this.preloadConfig(s, i)),
                (i.children || i._loadedRoutes) &&
                  o.push(this.processRoutes(a, i.children ?? i._loadedRoutes));
            }
            return je(o).pipe(lo());
          }
          preloadConfig(n, r) {
            return this.preloadingStrategy.preload(r, () => {
              let o;
              o =
                r.loadChildren && void 0 === r.canLoad
                  ? this.loader.loadChildren(n, r)
                  : j(null);
              const i = o.pipe(
                Ke((s) =>
                  null === s
                    ? j(void 0)
                    : ((r._loadedRoutes = s.routes),
                      (r._loadedInjector = s.injector),
                      this.processRoutes(s.injector ?? n, s.routes))
                )
              );
              return r.loadComponent && !r._loadedComponent
                ? je([i, this.loader.loadComponent(r)]).pipe(lo())
                : i;
            });
          }
        }
        return (
          (t.ɵfac = function (n) {
            return new (n || t)(I(Je), I(FD), I(wn), I(lE), I(Gh));
          }),
          (t.ɵprov = N({ token: t, factory: t.ɵfac, providedIn: "root" })),
          t
        );
      })();
      const Wh = new O("");
      let uE = (() => {
        class t {
          constructor(n, r, o, i, s = {}) {
            (this.urlSerializer = n),
              (this.transitions = r),
              (this.viewportScroller = o),
              (this.zone = i),
              (this.options = s),
              (this.lastId = 0),
              (this.lastSource = "imperative"),
              (this.restoredId = 0),
              (this.store = {}),
              (s.scrollPositionRestoration =
                s.scrollPositionRestoration || "disabled"),
              (s.anchorScrolling = s.anchorScrolling || "disabled");
          }
          init() {
            "disabled" !== this.options.scrollPositionRestoration &&
              this.viewportScroller.setHistoryScrollRestoration("manual"),
              (this.routerEventsSubscription = this.createScrollEvents()),
              (this.scrollEventsSubscription = this.consumeScrollEvents());
          }
          createScrollEvents() {
            return this.transitions.events.subscribe((n) => {
              n instanceof Rh
                ? ((this.store[this.lastId] =
                    this.viewportScroller.getScrollPosition()),
                  (this.lastSource = n.navigationTrigger),
                  (this.restoredId = n.restoredState
                    ? n.restoredState.navigationId
                    : 0))
                : n instanceof Qr
                ? ((this.lastId = n.id),
                  this.scheduleScrollEvent(
                    n,
                    this.urlSerializer.parse(n.urlAfterRedirects).fragment
                  ))
                : n instanceof Ts &&
                  0 === n.code &&
                  ((this.lastSource = void 0),
                  (this.restoredId = 0),
                  this.scheduleScrollEvent(
                    n,
                    this.urlSerializer.parse(n.url).fragment
                  ));
            });
          }
          consumeScrollEvents() {
            return this.transitions.events.subscribe((n) => {
              n instanceof Fb &&
                (n.position
                  ? "top" === this.options.scrollPositionRestoration
                    ? this.viewportScroller.scrollToPosition([0, 0])
                    : "enabled" === this.options.scrollPositionRestoration &&
                      this.viewportScroller.scrollToPosition(n.position)
                  : n.anchor && "enabled" === this.options.anchorScrolling
                  ? this.viewportScroller.scrollToAnchor(n.anchor)
                  : "disabled" !== this.options.scrollPositionRestoration &&
                    this.viewportScroller.scrollToPosition([0, 0]));
            });
          }
          scheduleScrollEvent(n, r) {
            this.zone.runOutsideAngular(() => {
              setTimeout(() => {
                this.zone.run(() => {
                  this.transitions.events.next(
                    new Fb(
                      n,
                      "popstate" === this.lastSource
                        ? this.store[this.restoredId]
                        : null,
                      r
                    )
                  );
                });
              }, 0);
            });
          }
          ngOnDestroy() {
            this.routerEventsSubscription?.unsubscribe(),
              this.scrollEventsSubscription?.unsubscribe();
          }
        }
        return (
          (t.ɵfac = function (n) {
            !(function Iv() {
              throw new Error("invalid");
            })();
          }),
          (t.ɵprov = N({ token: t, factory: t.ɵfac })),
          t
        );
      })();
      function tr(t, e) {
        return { ɵkind: t, ɵproviders: e };
      }
      function dE() {
        const t = A(bn);
        return (e) => {
          const n = t.get($r);
          if (e !== n.components[0]) return;
          const r = t.get(Je),
            o = t.get(fE);
          1 === t.get(Kh) && r.initialNavigation(),
            t.get(hE, null, k.Optional)?.setUpPreloading(),
            t.get(Wh, null, k.Optional)?.init(),
            r.resetRootComponentType(n.componentTypes[0]),
            o.closed || (o.next(), o.complete(), o.unsubscribe());
        };
      }
      const fE = new O("", { factory: () => new Ln() }),
        Kh = new O("", { providedIn: "root", factory: () => 1 }),
        hE = new O("");
      function aB(t) {
        return tr(0, [
          { provide: hE, useExisting: rB },
          { provide: lE, useExisting: t },
        ]);
      }
      const pE = new O("ROUTER_FORROOT_GUARD"),
        uB = [
          Xf,
          { provide: ws, useClass: Ih },
          Je,
          As,
          {
            provide: ri,
            useFactory: function cE(t) {
              return t.routerState.root;
            },
            deps: [Je],
          },
          Gh,
          [],
        ];
      function cB() {
        return new GD("Router", Je);
      }
      let gE = (() => {
        class t {
          constructor(n) {}
          static forRoot(n, r) {
            return {
              ngModule: t,
              providers: [
                uB,
                [],
                { provide: ai, multi: !0, useValue: n },
                {
                  provide: pE,
                  useFactory: pB,
                  deps: [[Je, new Ia(), new Oa()]],
                },
                { provide: ou, useValue: r || {} },
                r?.useHash
                  ? { provide: zr, useClass: EF }
                  : { provide: zr, useClass: Cw },
                {
                  provide: Wh,
                  useFactory: () => {
                    const t = A(jk),
                      e = A(ye),
                      n = A(ou),
                      r = A(ru),
                      o = A(ws);
                    return (
                      n.scrollOffset && t.setOffset(n.scrollOffset),
                      new uE(o, r, t, e, n)
                    );
                  },
                },
                r?.preloadingStrategy
                  ? aB(r.preloadingStrategy).ɵproviders
                  : [],
                { provide: GD, multi: !0, useFactory: cB },
                r?.initialNavigation ? gB(r) : [],
                r?.bindToComponentInputs
                  ? tr(8, [$b, { provide: Xl, useExisting: $b }]).ɵproviders
                  : [],
                [
                  { provide: mE, useFactory: dE },
                  { provide: jf, multi: !0, useExisting: mE },
                ],
              ],
            };
          }
          static forChild(n) {
            return {
              ngModule: t,
              providers: [{ provide: ai, multi: !0, useValue: n }],
            };
          }
        }
        return (
          (t.ɵfac = function (n) {
            return new (n || t)(I(pE, 8));
          }),
          (t.ɵmod = Mt({ type: t })),
          (t.ɵinj = pt({})),
          t
        );
      })();
      function pB(t) {
        return "guarded";
      }
      function gB(t) {
        return [
          "disabled" === t.initialNavigation
            ? tr(3, [
                {
                  provide: Nf,
                  multi: !0,
                  useFactory: () => {
                    const e = A(Je);
                    return () => {
                      e.setUpLocationChangeListener();
                    };
                  },
                },
                { provide: Kh, useValue: 2 },
              ]).ɵproviders
            : [],
          "enabledBlocking" === t.initialNavigation
            ? tr(2, [
                { provide: Kh, useValue: 0 },
                {
                  provide: Nf,
                  multi: !0,
                  deps: [bn],
                  useFactory: (e) => {
                    const n = e.get(wF, Promise.resolve());
                    return () =>
                      n.then(
                        () =>
                          new Promise((r) => {
                            const o = e.get(Je),
                              i = e.get(fE);
                            aE(o, () => {
                              r(!0);
                            }),
                              (e.get(ru).afterPreactivation = () => (
                                r(!0), i.closed ? j(void 0) : i
                              )),
                              o.initialNavigation();
                          })
                      );
                  },
                },
              ]).ɵproviders
            : [],
        ];
      }
      const mE = new O("");
      let Zr = (() => {
        class t {
          constructor(n) {
            this.router = n;
          }
          canActivate(n, r) {
            var o = this;
            return (function HL(t) {
              return function () {
                var e = this,
                  n = arguments;
                return new Promise(function (r, o) {
                  var i = t.apply(e, n);
                  function s(l) {
                    ub(i, r, o, s, a, "next", l);
                  }
                  function a(l) {
                    ub(i, r, o, s, a, "throw", l);
                  }
                  s(void 0);
                });
              };
            })(function* () {
              try {
                return localStorage.getItem("token")
                  ? (console.log(!0), !0)
                  : (o.router.navigate(["/poslogin"]), !1);
              } catch (i) {
                return (
                  console.error("An error occurred during authentication:", i),
                  o.router.navigate(["/poslogin"]),
                  !1
                );
              }
            })();
          }
        }
        return (
          (t.ɵfac = function (n) {
            return new (n || t)(I(Je));
          }),
          (t.ɵprov = N({ token: t, factory: t.ɵfac, providedIn: "root" })),
          t
        );
      })();
      class su {}
      class au {}
      class Nn {
        constructor(e) {
          (this.normalizedNames = new Map()),
            (this.lazyUpdate = null),
            e
              ? "string" == typeof e
                ? (this.lazyInit = () => {
                    (this.headers = new Map()),
                      e.split("\n").forEach((n) => {
                        const r = n.indexOf(":");
                        if (r > 0) {
                          const o = n.slice(0, r),
                            i = o.toLowerCase(),
                            s = n.slice(r + 1).trim();
                          this.maybeSetNormalizedName(o, i),
                            this.headers.has(i)
                              ? this.headers.get(i).push(s)
                              : this.headers.set(i, [s]);
                        }
                      });
                  })
                : typeof Headers < "u" && e instanceof Headers
                ? ((this.headers = new Map()),
                  e.forEach((n, r) => {
                    this.setHeaderEntries(r, n);
                  }))
                : (this.lazyInit = () => {
                    (this.headers = new Map()),
                      Object.entries(e).forEach(([n, r]) => {
                        this.setHeaderEntries(n, r);
                      });
                  })
              : (this.headers = new Map());
        }
        has(e) {
          return this.init(), this.headers.has(e.toLowerCase());
        }
        get(e) {
          this.init();
          const n = this.headers.get(e.toLowerCase());
          return n && n.length > 0 ? n[0] : null;
        }
        keys() {
          return this.init(), Array.from(this.normalizedNames.values());
        }
        getAll(e) {
          return this.init(), this.headers.get(e.toLowerCase()) || null;
        }
        append(e, n) {
          return this.clone({ name: e, value: n, op: "a" });
        }
        set(e, n) {
          return this.clone({ name: e, value: n, op: "s" });
        }
        delete(e, n) {
          return this.clone({ name: e, value: n, op: "d" });
        }
        maybeSetNormalizedName(e, n) {
          this.normalizedNames.has(n) || this.normalizedNames.set(n, e);
        }
        init() {
          this.lazyInit &&
            (this.lazyInit instanceof Nn
              ? this.copyFrom(this.lazyInit)
              : this.lazyInit(),
            (this.lazyInit = null),
            this.lazyUpdate &&
              (this.lazyUpdate.forEach((e) => this.applyUpdate(e)),
              (this.lazyUpdate = null)));
        }
        copyFrom(e) {
          e.init(),
            Array.from(e.headers.keys()).forEach((n) => {
              this.headers.set(n, e.headers.get(n)),
                this.normalizedNames.set(n, e.normalizedNames.get(n));
            });
        }
        clone(e) {
          const n = new Nn();
          return (
            (n.lazyInit =
              this.lazyInit && this.lazyInit instanceof Nn
                ? this.lazyInit
                : this),
            (n.lazyUpdate = (this.lazyUpdate || []).concat([e])),
            n
          );
        }
        applyUpdate(e) {
          const n = e.name.toLowerCase();
          switch (e.op) {
            case "a":
            case "s":
              let r = e.value;
              if (("string" == typeof r && (r = [r]), 0 === r.length)) return;
              this.maybeSetNormalizedName(e.name, n);
              const o = ("a" === e.op ? this.headers.get(n) : void 0) || [];
              o.push(...r), this.headers.set(n, o);
              break;
            case "d":
              const i = e.value;
              if (i) {
                let s = this.headers.get(n);
                if (!s) return;
                (s = s.filter((a) => -1 === i.indexOf(a))),
                  0 === s.length
                    ? (this.headers.delete(n), this.normalizedNames.delete(n))
                    : this.headers.set(n, s);
              } else this.headers.delete(n), this.normalizedNames.delete(n);
          }
        }
        setHeaderEntries(e, n) {
          const r = (Array.isArray(n) ? n : [n]).map((i) => i.toString()),
            o = e.toLowerCase();
          this.headers.set(o, r), this.maybeSetNormalizedName(e, o);
        }
        forEach(e) {
          this.init(),
            Array.from(this.normalizedNames.keys()).forEach((n) =>
              e(this.normalizedNames.get(n), this.headers.get(n))
            );
        }
      }
      class yB {
        encodeKey(e) {
          return yE(e);
        }
        encodeValue(e) {
          return yE(e);
        }
        decodeKey(e) {
          return decodeURIComponent(e);
        }
        decodeValue(e) {
          return decodeURIComponent(e);
        }
      }
      const _B = /%(\d[a-f0-9])/gi,
        CB = {
          40: "@",
          "3A": ":",
          24: "$",
          "2C": ",",
          "3B": ";",
          "3D": "=",
          "3F": "?",
          "2F": "/",
        };
      function yE(t) {
        return encodeURIComponent(t).replace(_B, (e, n) => CB[n] ?? e);
      }
      function lu(t) {
        return `${t}`;
      }
      class vr {
        constructor(e = {}) {
          if (
            ((this.updates = null),
            (this.cloneFrom = null),
            (this.encoder = e.encoder || new yB()),
            e.fromString)
          ) {
            if (e.fromObject)
              throw new Error("Cannot specify both fromString and fromObject.");
            this.map = (function vB(t, e) {
              const n = new Map();
              return (
                t.length > 0 &&
                  t
                    .replace(/^\?/, "")
                    .split("&")
                    .forEach((o) => {
                      const i = o.indexOf("="),
                        [s, a] =
                          -1 == i
                            ? [e.decodeKey(o), ""]
                            : [
                                e.decodeKey(o.slice(0, i)),
                                e.decodeValue(o.slice(i + 1)),
                              ],
                        l = n.get(s) || [];
                      l.push(a), n.set(s, l);
                    }),
                n
              );
            })(e.fromString, this.encoder);
          } else
            e.fromObject
              ? ((this.map = new Map()),
                Object.keys(e.fromObject).forEach((n) => {
                  const r = e.fromObject[n],
                    o = Array.isArray(r) ? r.map(lu) : [lu(r)];
                  this.map.set(n, o);
                }))
              : (this.map = null);
        }
        has(e) {
          return this.init(), this.map.has(e);
        }
        get(e) {
          this.init();
          const n = this.map.get(e);
          return n ? n[0] : null;
        }
        getAll(e) {
          return this.init(), this.map.get(e) || null;
        }
        keys() {
          return this.init(), Array.from(this.map.keys());
        }
        append(e, n) {
          return this.clone({ param: e, value: n, op: "a" });
        }
        appendAll(e) {
          const n = [];
          return (
            Object.keys(e).forEach((r) => {
              const o = e[r];
              Array.isArray(o)
                ? o.forEach((i) => {
                    n.push({ param: r, value: i, op: "a" });
                  })
                : n.push({ param: r, value: o, op: "a" });
            }),
            this.clone(n)
          );
        }
        set(e, n) {
          return this.clone({ param: e, value: n, op: "s" });
        }
        delete(e, n) {
          return this.clone({ param: e, value: n, op: "d" });
        }
        toString() {
          return (
            this.init(),
            this.keys()
              .map((e) => {
                const n = this.encoder.encodeKey(e);
                return this.map
                  .get(e)
                  .map((r) => n + "=" + this.encoder.encodeValue(r))
                  .join("&");
              })
              .filter((e) => "" !== e)
              .join("&")
          );
        }
        clone(e) {
          const n = new vr({ encoder: this.encoder });
          return (
            (n.cloneFrom = this.cloneFrom || this),
            (n.updates = (this.updates || []).concat(e)),
            n
          );
        }
        init() {
          null === this.map && (this.map = new Map()),
            null !== this.cloneFrom &&
              (this.cloneFrom.init(),
              this.cloneFrom
                .keys()
                .forEach((e) => this.map.set(e, this.cloneFrom.map.get(e))),
              this.updates.forEach((e) => {
                switch (e.op) {
                  case "a":
                  case "s":
                    const n =
                      ("a" === e.op ? this.map.get(e.param) : void 0) || [];
                    n.push(lu(e.value)), this.map.set(e.param, n);
                    break;
                  case "d":
                    if (void 0 === e.value) {
                      this.map.delete(e.param);
                      break;
                    }
                    {
                      let r = this.map.get(e.param) || [];
                      const o = r.indexOf(lu(e.value));
                      -1 !== o && r.splice(o, 1),
                        r.length > 0
                          ? this.map.set(e.param, r)
                          : this.map.delete(e.param);
                    }
                }
              }),
              (this.cloneFrom = this.updates = null));
        }
      }
      class DB {
        constructor() {
          this.map = new Map();
        }
        set(e, n) {
          return this.map.set(e, n), this;
        }
        get(e) {
          return (
            this.map.has(e) || this.map.set(e, e.defaultValue()),
            this.map.get(e)
          );
        }
        delete(e) {
          return this.map.delete(e), this;
        }
        has(e) {
          return this.map.has(e);
        }
        keys() {
          return this.map.keys();
        }
      }
      function vE(t) {
        return typeof ArrayBuffer < "u" && t instanceof ArrayBuffer;
      }
      function _E(t) {
        return typeof Blob < "u" && t instanceof Blob;
      }
      function CE(t) {
        return typeof FormData < "u" && t instanceof FormData;
      }
      class Rs {
        constructor(e, n, r, o) {
          let i;
          if (
            ((this.url = n),
            (this.body = null),
            (this.reportProgress = !1),
            (this.withCredentials = !1),
            (this.responseType = "json"),
            (this.method = e.toUpperCase()),
            (function wB(t) {
              switch (t) {
                case "DELETE":
                case "GET":
                case "HEAD":
                case "OPTIONS":
                case "JSONP":
                  return !1;
                default:
                  return !0;
              }
            })(this.method) || o
              ? ((this.body = void 0 !== r ? r : null), (i = o))
              : (i = r),
            i &&
              ((this.reportProgress = !!i.reportProgress),
              (this.withCredentials = !!i.withCredentials),
              i.responseType && (this.responseType = i.responseType),
              i.headers && (this.headers = i.headers),
              i.context && (this.context = i.context),
              i.params && (this.params = i.params)),
            this.headers || (this.headers = new Nn()),
            this.context || (this.context = new DB()),
            this.params)
          ) {
            const s = this.params.toString();
            if (0 === s.length) this.urlWithParams = n;
            else {
              const a = n.indexOf("?");
              this.urlWithParams =
                n + (-1 === a ? "?" : a < n.length - 1 ? "&" : "") + s;
            }
          } else (this.params = new vr()), (this.urlWithParams = n);
        }
        serializeBody() {
          return null === this.body
            ? null
            : vE(this.body) ||
              _E(this.body) ||
              CE(this.body) ||
              (function bB(t) {
                return (
                  typeof URLSearchParams < "u" && t instanceof URLSearchParams
                );
              })(this.body) ||
              "string" == typeof this.body
            ? this.body
            : this.body instanceof vr
            ? this.body.toString()
            : "object" == typeof this.body ||
              "boolean" == typeof this.body ||
              Array.isArray(this.body)
            ? JSON.stringify(this.body)
            : this.body.toString();
        }
        detectContentTypeHeader() {
          return null === this.body || CE(this.body)
            ? null
            : _E(this.body)
            ? this.body.type || null
            : vE(this.body)
            ? null
            : "string" == typeof this.body
            ? "text/plain"
            : this.body instanceof vr
            ? "application/x-www-form-urlencoded;charset=UTF-8"
            : "object" == typeof this.body ||
              "number" == typeof this.body ||
              "boolean" == typeof this.body
            ? "application/json"
            : null;
        }
        clone(e = {}) {
          const n = e.method || this.method,
            r = e.url || this.url,
            o = e.responseType || this.responseType,
            i = void 0 !== e.body ? e.body : this.body,
            s =
              void 0 !== e.withCredentials
                ? e.withCredentials
                : this.withCredentials,
            a =
              void 0 !== e.reportProgress
                ? e.reportProgress
                : this.reportProgress;
          let l = e.headers || this.headers,
            u = e.params || this.params;
          const c = e.context ?? this.context;
          return (
            void 0 !== e.setHeaders &&
              (l = Object.keys(e.setHeaders).reduce(
                (d, f) => d.set(f, e.setHeaders[f]),
                l
              )),
            e.setParams &&
              (u = Object.keys(e.setParams).reduce(
                (d, f) => d.set(f, e.setParams[f]),
                u
              )),
            new Rs(n, r, i, {
              params: u,
              headers: l,
              context: c,
              reportProgress: a,
              responseType: o,
              withCredentials: s,
            })
          );
        }
      }
      var Le = (() => (
        ((Le = Le || {})[(Le.Sent = 0)] = "Sent"),
        (Le[(Le.UploadProgress = 1)] = "UploadProgress"),
        (Le[(Le.ResponseHeader = 2)] = "ResponseHeader"),
        (Le[(Le.DownloadProgress = 3)] = "DownloadProgress"),
        (Le[(Le.Response = 4)] = "Response"),
        (Le[(Le.User = 5)] = "User"),
        Le
      ))();
      class Qh {
        constructor(e, n = 200, r = "OK") {
          (this.headers = e.headers || new Nn()),
            (this.status = void 0 !== e.status ? e.status : n),
            (this.statusText = e.statusText || r),
            (this.url = e.url || null),
            (this.ok = this.status >= 200 && this.status < 300);
        }
      }
      class Zh extends Qh {
        constructor(e = {}) {
          super(e), (this.type = Le.ResponseHeader);
        }
        clone(e = {}) {
          return new Zh({
            headers: e.headers || this.headers,
            status: void 0 !== e.status ? e.status : this.status,
            statusText: e.statusText || this.statusText,
            url: e.url || this.url || void 0,
          });
        }
      }
      class li extends Qh {
        constructor(e = {}) {
          super(e),
            (this.type = Le.Response),
            (this.body = void 0 !== e.body ? e.body : null);
        }
        clone(e = {}) {
          return new li({
            body: void 0 !== e.body ? e.body : this.body,
            headers: e.headers || this.headers,
            status: void 0 !== e.status ? e.status : this.status,
            statusText: e.statusText || this.statusText,
            url: e.url || this.url || void 0,
          });
        }
      }
      class DE extends Qh {
        constructor(e) {
          super(e, 0, "Unknown Error"),
            (this.name = "HttpErrorResponse"),
            (this.ok = !1),
            (this.message =
              this.status >= 200 && this.status < 300
                ? `Http failure during parsing for ${e.url || "(unknown url)"}`
                : `Http failure response for ${e.url || "(unknown url)"}: ${
                    e.status
                  } ${e.statusText}`),
            (this.error = e.error || null);
        }
      }
      function Yh(t, e) {
        return {
          body: e,
          headers: t.headers,
          context: t.context,
          observe: t.observe,
          params: t.params,
          reportProgress: t.reportProgress,
          responseType: t.responseType,
          withCredentials: t.withCredentials,
        };
      }
      let wE = (() => {
        class t {
          constructor(n) {
            this.handler = n;
          }
          request(n, r, o = {}) {
            let i;
            if (n instanceof Rs) i = n;
            else {
              let l, u;
              (l = o.headers instanceof Nn ? o.headers : new Nn(o.headers)),
                o.params &&
                  (u =
                    o.params instanceof vr
                      ? o.params
                      : new vr({ fromObject: o.params })),
                (i = new Rs(n, r, void 0 !== o.body ? o.body : null, {
                  headers: l,
                  context: o.context,
                  params: u,
                  reportProgress: o.reportProgress,
                  responseType: o.responseType || "json",
                  withCredentials: o.withCredentials,
                }));
            }
            const s = j(i).pipe(Jo((l) => this.handler.handle(l)));
            if (n instanceof Rs || "events" === o.observe) return s;
            const a = s.pipe(Jn((l) => l instanceof li));
            switch (o.observe || "body") {
              case "body":
                switch (i.responseType) {
                  case "arraybuffer":
                    return a.pipe(
                      oe((l) => {
                        if (null !== l.body && !(l.body instanceof ArrayBuffer))
                          throw new Error("Response is not an ArrayBuffer.");
                        return l.body;
                      })
                    );
                  case "blob":
                    return a.pipe(
                      oe((l) => {
                        if (null !== l.body && !(l.body instanceof Blob))
                          throw new Error("Response is not a Blob.");
                        return l.body;
                      })
                    );
                  case "text":
                    return a.pipe(
                      oe((l) => {
                        if (null !== l.body && "string" != typeof l.body)
                          throw new Error("Response is not a string.");
                        return l.body;
                      })
                    );
                  default:
                    return a.pipe(oe((l) => l.body));
                }
              case "response":
                return a;
              default:
                throw new Error(
                  `Unreachable: unhandled observe type ${o.observe}}`
                );
            }
          }
          delete(n, r = {}) {
            return this.request("DELETE", n, r);
          }
          get(n, r = {}) {
            return this.request("GET", n, r);
          }
          head(n, r = {}) {
            return this.request("HEAD", n, r);
          }
          jsonp(n, r) {
            return this.request("JSONP", n, {
              params: new vr().append(r, "JSONP_CALLBACK"),
              observe: "body",
              responseType: "json",
            });
          }
          options(n, r = {}) {
            return this.request("OPTIONS", n, r);
          }
          patch(n, r, o = {}) {
            return this.request("PATCH", n, Yh(o, r));
          }
          post(n, r, o = {}) {
            return this.request("POST", n, Yh(o, r));
          }
          put(n, r, o = {}) {
            return this.request("PUT", n, Yh(o, r));
          }
        }
        return (
          (t.ɵfac = function (n) {
            return new (n || t)(I(su));
          }),
          (t.ɵprov = N({ token: t, factory: t.ɵfac })),
          t
        );
      })();
      function SE(t, e) {
        return e(t);
      }
      function SB(t, e) {
        return (n, r) => e.intercept(n, { handle: (o) => t(o, r) });
      }
      const ME = new O(""),
        Fs = new O(""),
        TE = new O("");
      function TB() {
        let t = null;
        return (e, n) => {
          null === t &&
            (t = (A(ME, { optional: !0 }) ?? []).reduceRight(SB, SE));
          const r = A(_l),
            o = r.add();
          return t(e, n).pipe(_s(() => r.remove(o)));
        };
      }
      let AE = (() => {
        class t extends su {
          constructor(n, r) {
            super(),
              (this.backend = n),
              (this.injector = r),
              (this.chain = null),
              (this.pendingTasks = A(_l));
          }
          handle(n) {
            if (null === this.chain) {
              const o = Array.from(
                new Set([
                  ...this.injector.get(Fs),
                  ...this.injector.get(TE, []),
                ])
              );
              this.chain = o.reduceRight(
                (i, s) =>
                  (function MB(t, e, n) {
                    return (r, o) => n.runInContext(() => e(r, (i) => t(i, o)));
                  })(i, s, this.injector),
                SE
              );
            }
            const r = this.pendingTasks.add();
            return this.chain(n, (o) => this.backend.handle(o)).pipe(
              _s(() => this.pendingTasks.remove(r))
            );
          }
        }
        return (
          (t.ɵfac = function (n) {
            return new (n || t)(I(au), I(wn));
          }),
          (t.ɵprov = N({ token: t, factory: t.ɵfac })),
          t
        );
      })();
      const PB = /^\)\]\}',?\n/;
      let OE = (() => {
        class t {
          constructor(n) {
            this.xhrFactory = n;
          }
          handle(n) {
            if ("JSONP" === n.method) throw new v(-2800, !1);
            const r = this.xhrFactory;
            return (r.ɵloadImpl ? je(r.ɵloadImpl()) : j(null)).pipe(
              Zt(
                () =>
                  new Ce((i) => {
                    const s = r.build();
                    if (
                      (s.open(n.method, n.urlWithParams),
                      n.withCredentials && (s.withCredentials = !0),
                      n.headers.forEach((g, y) =>
                        s.setRequestHeader(g, y.join(","))
                      ),
                      n.headers.has("Accept") ||
                        s.setRequestHeader(
                          "Accept",
                          "application/json, text/plain, */*"
                        ),
                      !n.headers.has("Content-Type"))
                    ) {
                      const g = n.detectContentTypeHeader();
                      null !== g && s.setRequestHeader("Content-Type", g);
                    }
                    if (n.responseType) {
                      const g = n.responseType.toLowerCase();
                      s.responseType = "json" !== g ? g : "text";
                    }
                    const a = n.serializeBody();
                    let l = null;
                    const u = () => {
                        if (null !== l) return l;
                        const g = s.statusText || "OK",
                          y = new Nn(s.getAllResponseHeaders()),
                          _ =
                            (function NB(t) {
                              return "responseURL" in t && t.responseURL
                                ? t.responseURL
                                : /^X-Request-URL:/m.test(
                                    t.getAllResponseHeaders()
                                  )
                                ? t.getResponseHeader("X-Request-URL")
                                : null;
                            })(s) || n.url;
                        return (
                          (l = new Zh({
                            headers: y,
                            status: s.status,
                            statusText: g,
                            url: _,
                          })),
                          l
                        );
                      },
                      c = () => {
                        let {
                            headers: g,
                            status: y,
                            statusText: _,
                            url: m,
                          } = u(),
                          E = null;
                        204 !== y &&
                          (E =
                            typeof s.response > "u"
                              ? s.responseText
                              : s.response),
                          0 === y && (y = E ? 200 : 0);
                        let P = y >= 200 && y < 300;
                        if ("json" === n.responseType && "string" == typeof E) {
                          const R = E;
                          E = E.replace(PB, "");
                          try {
                            E = "" !== E ? JSON.parse(E) : null;
                          } catch (le) {
                            (E = R),
                              P && ((P = !1), (E = { error: le, text: E }));
                          }
                        }
                        P
                          ? (i.next(
                              new li({
                                body: E,
                                headers: g,
                                status: y,
                                statusText: _,
                                url: m || void 0,
                              })
                            ),
                            i.complete())
                          : i.error(
                              new DE({
                                error: E,
                                headers: g,
                                status: y,
                                statusText: _,
                                url: m || void 0,
                              })
                            );
                      },
                      d = (g) => {
                        const { url: y } = u(),
                          _ = new DE({
                            error: g,
                            status: s.status || 0,
                            statusText: s.statusText || "Unknown Error",
                            url: y || void 0,
                          });
                        i.error(_);
                      };
                    let f = !1;
                    const h = (g) => {
                        f || (i.next(u()), (f = !0));
                        let y = { type: Le.DownloadProgress, loaded: g.loaded };
                        g.lengthComputable && (y.total = g.total),
                          "text" === n.responseType &&
                            s.responseText &&
                            (y.partialText = s.responseText),
                          i.next(y);
                      },
                      p = (g) => {
                        let y = { type: Le.UploadProgress, loaded: g.loaded };
                        g.lengthComputable && (y.total = g.total), i.next(y);
                      };
                    return (
                      s.addEventListener("load", c),
                      s.addEventListener("error", d),
                      s.addEventListener("timeout", d),
                      s.addEventListener("abort", d),
                      n.reportProgress &&
                        (s.addEventListener("progress", h),
                        null !== a &&
                          s.upload &&
                          s.upload.addEventListener("progress", p)),
                      s.send(a),
                      i.next({ type: Le.Sent }),
                      () => {
                        s.removeEventListener("error", d),
                          s.removeEventListener("abort", d),
                          s.removeEventListener("load", c),
                          s.removeEventListener("timeout", d),
                          n.reportProgress &&
                            (s.removeEventListener("progress", h),
                            null !== a &&
                              s.upload &&
                              s.upload.removeEventListener("progress", p)),
                          s.readyState !== s.DONE && s.abort();
                      }
                    );
                  })
              )
            );
          }
        }
        return (
          (t.ɵfac = function (n) {
            return new (n || t)(I(jw));
          }),
          (t.ɵprov = N({ token: t, factory: t.ɵfac })),
          t
        );
      })();
      const Xh = new O("XSRF_ENABLED"),
        PE = new O("XSRF_COOKIE_NAME", {
          providedIn: "root",
          factory: () => "XSRF-TOKEN",
        }),
        NE = new O("XSRF_HEADER_NAME", {
          providedIn: "root",
          factory: () => "X-XSRF-TOKEN",
        });
      class xE {}
      let FB = (() => {
        class t {
          constructor(n, r, o) {
            (this.doc = n),
              (this.platform = r),
              (this.cookieName = o),
              (this.lastCookieString = ""),
              (this.lastToken = null),
              (this.parseCount = 0);
          }
          getToken() {
            if ("server" === this.platform) return null;
            const n = this.doc.cookie || "";
            return (
              n !== this.lastCookieString &&
                (this.parseCount++,
                (this.lastToken = Ow(n, this.cookieName)),
                (this.lastCookieString = n)),
              this.lastToken
            );
          }
        }
        return (
          (t.ɵfac = function (n) {
            return new (n || t)(I(dt), I(Lr), I(PE));
          }),
          (t.ɵprov = N({ token: t, factory: t.ɵfac })),
          t
        );
      })();
      function kB(t, e) {
        const n = t.url.toLowerCase();
        if (
          !A(Xh) ||
          "GET" === t.method ||
          "HEAD" === t.method ||
          n.startsWith("http://") ||
          n.startsWith("https://")
        )
          return e(t);
        const r = A(xE).getToken(),
          o = A(NE);
        return (
          null != r &&
            !t.headers.has(o) &&
            (t = t.clone({ headers: t.headers.set(o, r) })),
          e(t)
        );
      }
      var _e = (() => (
        ((_e = _e || {})[(_e.Interceptors = 0)] = "Interceptors"),
        (_e[(_e.LegacyInterceptors = 1)] = "LegacyInterceptors"),
        (_e[(_e.CustomXsrfConfiguration = 2)] = "CustomXsrfConfiguration"),
        (_e[(_e.NoXsrfProtection = 3)] = "NoXsrfProtection"),
        (_e[(_e.JsonpSupport = 4)] = "JsonpSupport"),
        (_e[(_e.RequestsMadeViaParent = 5)] = "RequestsMadeViaParent"),
        (_e[(_e.Fetch = 6)] = "Fetch"),
        _e
      ))();
      function Yr(t, e) {
        return { ɵkind: t, ɵproviders: e };
      }
      function LB(...t) {
        const e = [
          wE,
          OE,
          AE,
          { provide: su, useExisting: AE },
          { provide: au, useExisting: OE },
          { provide: Fs, useValue: kB, multi: !0 },
          { provide: Xh, useValue: !0 },
          { provide: xE, useClass: FB },
        ];
        for (const n of t) e.push(...n.ɵproviders);
        return (function pd(t) {
          return { ɵproviders: t };
        })(e);
      }
      const RE = new O("LEGACY_INTERCEPTOR_FN");
      let BB = (() => {
          class t {}
          return (
            (t.ɵfac = function (n) {
              return new (n || t)();
            }),
            (t.ɵmod = Mt({ type: t })),
            (t.ɵinj = pt({
              providers: [
                LB(
                  Yr(_e.LegacyInterceptors, [
                    { provide: RE, useFactory: TB },
                    { provide: Fs, useExisting: RE, multi: !0 },
                  ])
                ),
              ],
            })),
            t
          );
        })(),
        ui = (() => {
          class t {
            constructor(n) {
              (this.http = n),
                (this.mainUrl = "http://localhost:5000/"),
                (this.backRouter = "pos/");
            }
            staffLogin(n) {
              return (
                console.log(n),
                this.http.post(
                  `${this.mainUrl}${this.backRouter}staffLogin`,
                  n,
                  { withCredentials: !0 }
                )
              );
            }
            verifyStaff() {
              return this.http.get(
                `${this.mainUrl}${this.backRouter}VerifyPosStaff`,
                { withCredentials: !0 }
              );
            }
            generteQR(n) {
              return this.http.post(
                `${this.mainUrl}${this.backRouter}generateQr`,
                {},
                { withCredentials: !0 }
              );
            }
            proceesOrder(n) {
              return (
                console.log(n),
                this.http.get(
                  `${this.mainUrl}${this.backRouter}proceedOrder/${n}`,
                  { withCredentials: !0 }
                )
              );
            }
            filterSales(n, r) {
              return this.http.post(
                `${this.mainUrl}${this.backRouter}filterSales`,
                { start: n, end: r },
                { withCredentials: !0 }
              );
            }
          }
          return (
            (t.ɵfac = function (n) {
              return new (n || t)(I(wE));
            }),
            (t.ɵprov = N({ token: t, factory: t.ɵfac, providedIn: "root" })),
            t
          );
        })(),
        qB = (() => {
          class t {
            constructor(n) {
              this._router = n;
            }
            ngOnInit() {}
            logOutStaff() {
              localStorage.removeItem("token"),
                this._router.navigate(["/poslogin"]);
            }
          }
          return (
            (t.ɵfac = function (n) {
              return new (n || t)(C(Je));
            }),
            (t.ɵcmp = Xt({
              type: t,
              selectors: [["app-sidebar"]],
              decls: 29,
              vars: 0,
              consts: [
                [1, "sidebar-container"],
                [1, "sidebar"],
                [1, "sidebar__logo"],
                [1, "sidebar__menu"],
                [1, "sidebar__item"],
                [1, "sidebar_design"],
                ["routerLink", "/counter", 1, "sidebar__link", "active-link"],
                [1, "bx", "bx-home-alt", "sidebar__icon"],
                [1, "sidebar__name"],
                ["routerLink", "/order", 1, "sidebar__link"],
                [1, "bx", "bx-user", "sidebar__icon"],
                ["routerLink", "/sales", 1, "sidebar__link"],
                [1, "bx", "bx-book-alt", "sidebar__icon"],
                ["type", "button", 1, "sidebar__link", 3, "click"],
                [1, "bx", "bx-message-square-detail", "sidebar__icon"],
              ],
              template: function (n, r) {
                1 & n &&
                  (D(0, "div", 0)(1, "div", 1)(2, "div", 2),
                  S(3, "Turfyo"),
                  b(),
                  D(4, "ul", 3)(5, "li", 4)(6, "div", 5)(7, "a", 6),
                  Ae(8, "i", 7),
                  D(9, "span", 8),
                  S(10, "Counter"),
                  b()()()(),
                  D(11, "li", 4)(12, "div", 5)(13, "a", 9),
                  Ae(14, "i", 10),
                  D(15, "span", 8),
                  S(16, "Orders"),
                  b()()()(),
                  D(17, "li", 4)(18, "div", 5)(19, "a", 11),
                  Ae(20, "i", 12),
                  D(21, "span", 8),
                  S(22, "Sales"),
                  b()()()(),
                  D(23, "li", 4)(24, "div", 5)(25, "a", 13),
                  Ie("click", function () {
                    return r.logOutStaff();
                  }),
                  Ae(26, "i", 14),
                  D(27, "span", 8),
                  S(28, "Logout"),
                  b()()()()()()());
              },
              dependencies: [iu],
              styles: [
                ".sidebar-container[_ngcontent-%COMP%]{height:100%;overflow-y:auto}ul[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]{list-style:none}.sidebar[_ngcontent-%COMP%]{position:fixed;bottom:0;left:0;width:240px;height:100vh;background-color:#fff;z-index:1;transition:.4s;display:flex;flex-direction:column;align-items:center}.sidebar__logo[_ngcontent-%COMP%]{margin-top:1rem;color:var(--title-color);font-weight:600;font-size:1.25rem}.sidebar__menu[_ngcontent-%COMP%]{width:100%;margin-top:2rem;display:flex;flex-direction:column;align-items:center}.sidebar_design[_ngcontent-%COMP%]{background-color:#fff;box-shadow:0 0 11px orange;height:46px;width:177px;border-radius:20px}.sidebar_design[_ngcontent-%COMP%]:hover{background-color:#fff;transition:.4s;box-shadow:0 0 11px #ff8000;height:46px;width:177px;border-radius:20px}.sidebar__item[_ngcontent-%COMP%]{margin-bottom:1rem;display:flex;align-items:center}.sidebar__link[_ngcontent-%COMP%]{display:flex;align-items:center;justify-content:center;color:var(--title-color);font-weight:600;text-decoration:none}.sidebar__icon[_ngcontent-%COMP%]{font-size:1.5rem;margin-right:8px;margin-top:9px;color:orange}.sidebar__name[_ngcontent-%COMP%]{font-size:.75rem;margin-top:9px;display:flex;align-items:center;color:orange}.sidebar__img[_ngcontent-%COMP%]{margin-top:auto;margin-bottom:1rem}.sidebar__img[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{width:32px;border-radius:50%}.active-link[_ngcontent-%COMP%]{color:var(--first-color)}.scroll-sidebar[_ngcontent-%COMP%]{box-shadow:0 1px 12px hsla(var(--hue),var(--sat),15%,.15)}@media screen and (max-width: 900px){.sidebar[_ngcontent-%COMP%]{position:fixed;bottom:0;left:0;background-color:#fff;box-shadow:0 -1px 12px hsla(var(--hue),var(--sat),15%,.15);width:100%;height:4rem;padding:0 1rem;display:grid;align-content:center;border-radius:1.25rem 1.25rem 0 0;transition:.4s}.sidebar__logo[_ngcontent-%COMP%]{display:none}.sidebar__menu[_ngcontent-%COMP%]{flex-direction:row;justify-content:space-around;width:calc(100% - 80px)}.sidebar_design[_ngcontent-%COMP%]{background-color:#fff;box-shadow:none;height:60px;width:24px}.sidebar_design[_ngcontent-%COMP%]:hover{background-color:#fff;transition:.4s;box-shadow:none;height:60px;width:24px}.sidebar__item[_ngcontent-%COMP%]{margin-bottom:0;text-align:center}.sidebar__link[_ngcontent-%COMP%]{flex-direction:column;align-items:center;text-align:center}.sidebar__icon[_ngcontent-%COMP%]{margin-right:0}.sidebar__name[_ngcontent-%COMP%]{font-size:.628rem;text-align:center}.sidebar__img[_ngcontent-%COMP%]{margin-top:0;margin-bottom:0}.sidebar__img[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{width:24px}}@media screen and (min-width: 576px){.sidebar__item[_ngcontent-%COMP%]{justify-content:center;column-gap:3rem}}",
              ],
            })),
            t
          );
        })(),
        GB = (() => {
          class t {
            constructor(n, r) {
              (this._PosService = n), (this._router = r);
            }
            ngOnInit() {
              this.verifyStaff();
            }
            verifyStaff() {
              this._PosService.verifyStaff().subscribe(
                (n) => {},
                (n) => {
                  console.log(n),
                    localStorage.removeItem("token"),
                    this._router.navigate(["/poslogin"]);
                }
              );
            }
          }
          return (
            (t.ɵfac = function (n) {
              return new (n || t)(C(ui), C(Je));
            }),
            (t.ɵcmp = Xt({
              type: t,
              selectors: [["app-pos-lobby"]],
              decls: 7,
              vars: 0,
              consts: [
                [1, "container-fluid", "w-100"],
                [1, "row"],
                [1, "scroll__content", "col-md-2"],
                [1, "main__content", "col-md-10"],
                [1, "foem-sign"],
              ],
              template: function (n, r) {
                1 & n &&
                  (D(0, "div", 0)(1, "div", 1)(2, "div", 2),
                  Ae(3, "app-sidebar"),
                  b(),
                  D(4, "div", 3)(5, "main", 4),
                  Ae(6, "router-outlet"),
                  b()()()());
              },
              dependencies: [Yl, qB],
            })),
            t
          );
        })();
      const xn = Object.create(null);
      (xn.open = "0"),
        (xn.close = "1"),
        (xn.ping = "2"),
        (xn.pong = "3"),
        (xn.message = "4"),
        (xn.upgrade = "5"),
        (xn.noop = "6");
      const cu = Object.create(null);
      Object.keys(xn).forEach((t) => {
        cu[xn[t]] = t;
      });
      const WB = { type: "error", data: "parser error" },
        FE =
          "function" == typeof Blob ||
          (typeof Blob < "u" &&
            "[object BlobConstructor]" ===
              Object.prototype.toString.call(Blob)),
        kE = "function" == typeof ArrayBuffer,
        LE = (t) =>
          "function" == typeof ArrayBuffer.isView
            ? ArrayBuffer.isView(t)
            : t && t.buffer instanceof ArrayBuffer,
        Jh = ({ type: t, data: e }, n, r) =>
          FE && e instanceof Blob
            ? n
              ? r(e)
              : VE(e, r)
            : kE && (e instanceof ArrayBuffer || LE(e))
            ? n
              ? r(e)
              : VE(new Blob([e]), r)
            : r(xn[t] + (e || "")),
        VE = (t, e) => {
          const n = new FileReader();
          return (
            (n.onload = function () {
              const r = n.result.split(",")[1];
              e("b" + (r || ""));
            }),
            n.readAsDataURL(t)
          );
        };
      function BE(t) {
        return t instanceof Uint8Array
          ? t
          : t instanceof ArrayBuffer
          ? new Uint8Array(t)
          : new Uint8Array(t.buffer, t.byteOffset, t.byteLength);
      }
      let ep;
      function KB(t, e) {
        return FE && t.data instanceof Blob
          ? t.data.arrayBuffer().then(BE).then(e)
          : kE && (t.data instanceof ArrayBuffer || LE(t.data))
          ? e(BE(t.data))
          : void Jh(t, !1, (n) => {
              ep || (ep = new TextEncoder()), e(ep.encode(n));
            });
      }
      const ks = typeof Uint8Array > "u" ? [] : new Uint8Array(256);
      for (let t = 0; t < 64; t++)
        ks[
          "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charCodeAt(
            t
          )
        ] = t;
      const ZB = "function" == typeof ArrayBuffer,
        tp = (t, e) => {
          if ("string" != typeof t) return { type: "message", data: HE(t, e) };
          const n = t.charAt(0);
          return "b" === n
            ? { type: "message", data: YB(t.substring(1), e) }
            : cu[n]
            ? t.length > 1
              ? { type: cu[n], data: t.substring(1) }
              : { type: cu[n] }
            : WB;
        },
        YB = (t, e) => {
          if (ZB) {
            const n = ((t) => {
              let r,
                i,
                s,
                a,
                l,
                e = 0.75 * t.length,
                n = t.length,
                o = 0;
              "=" === t[t.length - 1] && (e--, "=" === t[t.length - 2] && e--);
              const u = new ArrayBuffer(e),
                c = new Uint8Array(u);
              for (r = 0; r < n; r += 4)
                (i = ks[t.charCodeAt(r)]),
                  (s = ks[t.charCodeAt(r + 1)]),
                  (a = ks[t.charCodeAt(r + 2)]),
                  (l = ks[t.charCodeAt(r + 3)]),
                  (c[o++] = (i << 2) | (s >> 4)),
                  (c[o++] = ((15 & s) << 4) | (a >> 2)),
                  (c[o++] = ((3 & a) << 6) | (63 & l));
              return u;
            })(t);
            return HE(n, e);
          }
          return { base64: !0, data: t };
        },
        HE = (t, e) =>
          "blob" === e
            ? t instanceof Blob
              ? t
              : new Blob([t])
            : t instanceof ArrayBuffer
            ? t
            : t.buffer,
        jE = String.fromCharCode(30);
      let np;
      function Ve(t) {
        if (t)
          return (function tH(t) {
            for (var e in Ve.prototype) t[e] = Ve.prototype[e];
            return t;
          })(t);
      }
      (Ve.prototype.on = Ve.prototype.addEventListener =
        function (t, e) {
          return (
            (this._callbacks = this._callbacks || {}),
            (this._callbacks["$" + t] = this._callbacks["$" + t] || []).push(e),
            this
          );
        }),
        (Ve.prototype.once = function (t, e) {
          function n() {
            this.off(t, n), e.apply(this, arguments);
          }
          return (n.fn = e), this.on(t, n), this;
        }),
        (Ve.prototype.off =
          Ve.prototype.removeListener =
          Ve.prototype.removeAllListeners =
          Ve.prototype.removeEventListener =
            function (t, e) {
              if (
                ((this._callbacks = this._callbacks || {}),
                0 == arguments.length)
              )
                return (this._callbacks = {}), this;
              var n = this._callbacks["$" + t];
              if (!n) return this;
              if (1 == arguments.length)
                return delete this._callbacks["$" + t], this;
              for (var r, o = 0; o < n.length; o++)
                if ((r = n[o]) === e || r.fn === e) {
                  n.splice(o, 1);
                  break;
                }
              return 0 === n.length && delete this._callbacks["$" + t], this;
            }),
        (Ve.prototype.emitReserved = Ve.prototype.emit =
          function (t) {
            this._callbacks = this._callbacks || {};
            for (
              var e = new Array(arguments.length - 1),
                n = this._callbacks["$" + t],
                r = 1;
              r < arguments.length;
              r++
            )
              e[r - 1] = arguments[r];
            if (n) {
              r = 0;
              for (var o = (n = n.slice(0)).length; r < o; ++r)
                n[r].apply(this, e);
            }
            return this;
          }),
        (Ve.prototype.listeners = function (t) {
          return (
            (this._callbacks = this._callbacks || {}),
            this._callbacks["$" + t] || []
          );
        }),
        (Ve.prototype.hasListeners = function (t) {
          return !!this.listeners(t).length;
        });
      const Gt =
        typeof self < "u"
          ? self
          : typeof window < "u"
          ? window
          : Function("return this")();
      function UE(t, ...e) {
        return e.reduce(
          (n, r) => (t.hasOwnProperty(r) && (n[r] = t[r]), n),
          {}
        );
      }
      const nH = Gt.setTimeout,
        rH = Gt.clearTimeout;
      function du(t, e) {
        e.useNativeTimers
          ? ((t.setTimeoutFn = nH.bind(Gt)), (t.clearTimeoutFn = rH.bind(Gt)))
          : ((t.setTimeoutFn = Gt.setTimeout.bind(Gt)),
            (t.clearTimeoutFn = Gt.clearTimeout.bind(Gt)));
      }
      function iH(t) {
        return "string" == typeof t
          ? (function sH(t) {
              let e = 0,
                n = 0;
              for (let r = 0, o = t.length; r < o; r++)
                (e = t.charCodeAt(r)),
                  e < 128
                    ? (n += 1)
                    : e < 2048
                    ? (n += 2)
                    : e < 55296 || e >= 57344
                    ? (n += 3)
                    : (r++, (n += 4));
              return n;
            })(t)
          : Math.ceil(1.33 * (t.byteLength || t.size));
      }
      class uH extends Error {
        constructor(e, n, r) {
          super(e),
            (this.description = n),
            (this.context = r),
            (this.type = "TransportError");
        }
      }
      class rp extends Ve {
        constructor(e) {
          super(),
            (this.writable = !1),
            du(this, e),
            (this.opts = e),
            (this.query = e.query),
            (this.socket = e.socket);
        }
        onError(e, n, r) {
          return super.emitReserved("error", new uH(e, n, r)), this;
        }
        open() {
          return (this.readyState = "opening"), this.doOpen(), this;
        }
        close() {
          return (
            ("opening" === this.readyState || "open" === this.readyState) &&
              (this.doClose(), this.onClose()),
            this
          );
        }
        send(e) {
          "open" === this.readyState && this.write(e);
        }
        onOpen() {
          (this.readyState = "open"),
            (this.writable = !0),
            super.emitReserved("open");
        }
        onData(e) {
          const n = tp(e, this.socket.binaryType);
          this.onPacket(n);
        }
        onPacket(e) {
          super.emitReserved("packet", e);
        }
        onClose(e) {
          (this.readyState = "closed"), super.emitReserved("close", e);
        }
        pause(e) {}
        createUri(e, n = {}) {
          return (
            e +
            "://" +
            this._hostname() +
            this._port() +
            this.opts.path +
            this._query(n)
          );
        }
        _hostname() {
          const e = this.opts.hostname;
          return -1 === e.indexOf(":") ? e : "[" + e + "]";
        }
        _port() {
          return this.opts.port &&
            ((this.opts.secure && +(443 !== this.opts.port)) ||
              (!this.opts.secure && 80 !== Number(this.opts.port)))
            ? ":" + this.opts.port
            : "";
        }
        _query(e) {
          const n = (function aH(t) {
            let e = "";
            for (let n in t)
              t.hasOwnProperty(n) &&
                (e.length && (e += "&"),
                (e += encodeURIComponent(n) + "=" + encodeURIComponent(t[n])));
            return e;
          })(e);
          return n.length ? "?" + n : "";
        }
      }
      const zE =
          "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_".split(
            ""
          ),
        fu = 64,
        qE = {};
      let WE,
        GE = 0,
        _r = 0;
      function KE(t) {
        let e = "";
        do {
          (e = zE[t % fu] + e), (t = Math.floor(t / fu));
        } while (t > 0);
        return e;
      }
      function QE() {
        const t = KE(+new Date());
        return t !== WE ? ((GE = 0), (WE = t)) : t + "." + KE(GE++);
      }
      for (; _r < fu; _r++) qE[zE[_r]] = _r;
      let ZE = !1;
      try {
        ZE =
          typeof XMLHttpRequest < "u" &&
          "withCredentials" in new XMLHttpRequest();
      } catch {}
      const cH = ZE;
      function YE(t) {
        const e = t.xdomain;
        try {
          if (typeof XMLHttpRequest < "u" && (!e || cH))
            return new XMLHttpRequest();
        } catch {}
        if (!e)
          try {
            return new Gt[["Active"].concat("Object").join("X")](
              "Microsoft.XMLHTTP"
            );
          } catch {}
      }
      function dH() {}
      const fH = null != new YE({ xdomain: !1 }).responseType;
      let hu = (() => {
        class t extends Ve {
          constructor(n, r) {
            super(),
              du(this, r),
              (this.opts = r),
              (this.method = r.method || "GET"),
              (this.uri = n),
              (this.data = void 0 !== r.data ? r.data : null),
              this.create();
          }
          create() {
            var n;
            const r = UE(
              this.opts,
              "agent",
              "pfx",
              "key",
              "passphrase",
              "cert",
              "ca",
              "ciphers",
              "rejectUnauthorized",
              "autoUnref"
            );
            r.xdomain = !!this.opts.xd;
            const o = (this.xhr = new YE(r));
            try {
              o.open(this.method, this.uri, !0);
              try {
                if (this.opts.extraHeaders) {
                  o.setDisableHeaderCheck && o.setDisableHeaderCheck(!0);
                  for (let i in this.opts.extraHeaders)
                    this.opts.extraHeaders.hasOwnProperty(i) &&
                      o.setRequestHeader(i, this.opts.extraHeaders[i]);
                }
              } catch {}
              if ("POST" === this.method)
                try {
                  o.setRequestHeader(
                    "Content-type",
                    "text/plain;charset=UTF-8"
                  );
                } catch {}
              try {
                o.setRequestHeader("Accept", "*/*");
              } catch {}
              null === (n = this.opts.cookieJar) ||
                void 0 === n ||
                n.addCookies(o),
                "withCredentials" in o &&
                  (o.withCredentials = this.opts.withCredentials),
                this.opts.requestTimeout &&
                  (o.timeout = this.opts.requestTimeout),
                (o.onreadystatechange = () => {
                  var i;
                  3 === o.readyState &&
                    (null === (i = this.opts.cookieJar) ||
                      void 0 === i ||
                      i.parseCookies(o)),
                    4 === o.readyState &&
                      (200 === o.status || 1223 === o.status
                        ? this.onLoad()
                        : this.setTimeoutFn(() => {
                            this.onError(
                              "number" == typeof o.status ? o.status : 0
                            );
                          }, 0));
                }),
                o.send(this.data);
            } catch (i) {
              return void this.setTimeoutFn(() => {
                this.onError(i);
              }, 0);
            }
            typeof document < "u" &&
              ((this.index = t.requestsCount++),
              (t.requests[this.index] = this));
          }
          onError(n) {
            this.emitReserved("error", n, this.xhr), this.cleanup(!0);
          }
          cleanup(n) {
            if (!(typeof this.xhr > "u" || null === this.xhr)) {
              if (((this.xhr.onreadystatechange = dH), n))
                try {
                  this.xhr.abort();
                } catch {}
              typeof document < "u" && delete t.requests[this.index],
                (this.xhr = null);
            }
          }
          onLoad() {
            const n = this.xhr.responseText;
            null !== n &&
              (this.emitReserved("data", n),
              this.emitReserved("success"),
              this.cleanup());
          }
          abort() {
            this.cleanup();
          }
        }
        return (t.requestsCount = 0), (t.requests = {}), t;
      })();
      function XE() {
        for (let t in hu.requests)
          hu.requests.hasOwnProperty(t) && hu.requests[t].abort();
      }
      typeof document < "u" &&
        ("function" == typeof attachEvent
          ? attachEvent("onunload", XE)
          : "function" == typeof addEventListener &&
            addEventListener(
              "onpagehide" in Gt ? "pagehide" : "unload",
              XE,
              !1
            ));
      const op =
          "function" == typeof Promise && "function" == typeof Promise.resolve
            ? (e) => Promise.resolve().then(e)
            : (e, n) => n(e, 0),
        pu = Gt.WebSocket || Gt.MozWebSocket,
        JE =
          typeof navigator < "u" &&
          "string" == typeof navigator.product &&
          "reactnative" === navigator.product.toLowerCase();
      function mH(t, e) {
        return (
          "message" === t.type &&
          "string" != typeof t.data &&
          e[0] >= 48 &&
          e[0] <= 54
        );
      }
      const vH = {
          websocket: class gH extends rp {
            constructor(e) {
              super(e), (this.supportsBinary = !e.forceBase64);
            }
            get name() {
              return "websocket";
            }
            doOpen() {
              if (!this.check()) return;
              const e = this.uri(),
                n = this.opts.protocols,
                r = JE
                  ? {}
                  : UE(
                      this.opts,
                      "agent",
                      "perMessageDeflate",
                      "pfx",
                      "key",
                      "passphrase",
                      "cert",
                      "ca",
                      "ciphers",
                      "rejectUnauthorized",
                      "localAddress",
                      "protocolVersion",
                      "origin",
                      "maxPayload",
                      "family",
                      "checkServerIdentity"
                    );
              this.opts.extraHeaders && (r.headers = this.opts.extraHeaders);
              try {
                this.ws = JE ? new pu(e, n, r) : n ? new pu(e, n) : new pu(e);
              } catch (o) {
                return this.emitReserved("error", o);
              }
              (this.ws.binaryType = this.socket.binaryType || "arraybuffer"),
                this.addEventListeners();
            }
            addEventListeners() {
              (this.ws.onopen = () => {
                this.opts.autoUnref && this.ws._socket.unref(), this.onOpen();
              }),
                (this.ws.onclose = (e) =>
                  this.onClose({
                    description: "websocket connection closed",
                    context: e,
                  })),
                (this.ws.onmessage = (e) => this.onData(e.data)),
                (this.ws.onerror = (e) => this.onError("websocket error", e));
            }
            write(e) {
              this.writable = !1;
              for (let n = 0; n < e.length; n++) {
                const o = n === e.length - 1;
                Jh(e[n], this.supportsBinary, (i) => {
                  try {
                    this.ws.send(i);
                  } catch {}
                  o &&
                    op(() => {
                      (this.writable = !0), this.emitReserved("drain");
                    }, this.setTimeoutFn);
                });
              }
            }
            doClose() {
              typeof this.ws < "u" && (this.ws.close(), (this.ws = null));
            }
            uri() {
              const e = this.opts.secure ? "wss" : "ws",
                n = this.query || {};
              return (
                this.opts.timestampRequests &&
                  (n[this.opts.timestampParam] = QE()),
                this.supportsBinary || (n.b64 = 1),
                this.createUri(e, n)
              );
            }
            check() {
              return !!pu;
            }
          },
          webtransport: class yH extends rp {
            get name() {
              return "webtransport";
            }
            doOpen() {
              "function" == typeof WebTransport &&
                ((this.transport = new WebTransport(
                  this.createUri("https"),
                  this.opts.transportOptions[this.name]
                )),
                this.transport.closed
                  .then(() => {
                    this.onClose();
                  })
                  .catch((e) => {
                    this.onError("webtransport error", e);
                  }),
                this.transport.ready.then(() => {
                  this.transport.createBidirectionalStream().then((e) => {
                    const n = e.readable.getReader();
                    let r;
                    this.writer = e.writable.getWriter();
                    const o = () => {
                      n.read()
                        .then(({ done: s, value: a }) => {
                          s ||
                            (r || 1 !== a.byteLength || 54 !== a[0]
                              ? (this.onPacket(
                                  (function eH(t, e, n) {
                                    return (
                                      np || (np = new TextDecoder()),
                                      tp(
                                        e || t[0] < 48 || t[0] > 54
                                          ? t
                                          : np.decode(t),
                                        n
                                      )
                                    );
                                  })(a, r, "arraybuffer")
                                ),
                                (r = !1))
                              : (r = !0),
                            o());
                        })
                        .catch((s) => {});
                    };
                    o();
                    const i = this.query.sid
                      ? `0{"sid":"${this.query.sid}"}`
                      : "0";
                    this.writer
                      .write(new TextEncoder().encode(i))
                      .then(() => this.onOpen());
                  });
                }));
            }
            write(e) {
              this.writable = !1;
              for (let n = 0; n < e.length; n++) {
                const r = e[n],
                  o = n === e.length - 1;
                KB(r, (i) => {
                  mH(r, i) && this.writer.write(Uint8Array.of(54)),
                    this.writer.write(i).then(() => {
                      o &&
                        op(() => {
                          (this.writable = !0), this.emitReserved("drain");
                        }, this.setTimeoutFn);
                    });
                });
              }
            }
            doClose() {
              var e;
              null === (e = this.transport) || void 0 === e || e.close();
            }
          },
          polling: class hH extends rp {
            constructor(e) {
              if ((super(e), (this.polling = !1), typeof location < "u")) {
                const r = "https:" === location.protocol;
                let o = location.port;
                o || (o = r ? "443" : "80"),
                  (this.xd =
                    (typeof location < "u" &&
                      e.hostname !== location.hostname) ||
                    o !== e.port);
              }
              (this.supportsBinary = fH && !(e && e.forceBase64)),
                this.opts.withCredentials && (this.cookieJar = void 0);
            }
            get name() {
              return "polling";
            }
            doOpen() {
              this.poll();
            }
            pause(e) {
              this.readyState = "pausing";
              const n = () => {
                (this.readyState = "paused"), e();
              };
              if (this.polling || !this.writable) {
                let r = 0;
                this.polling &&
                  (r++,
                  this.once("pollComplete", function () {
                    --r || n();
                  })),
                  this.writable ||
                    (r++,
                    this.once("drain", function () {
                      --r || n();
                    }));
              } else n();
            }
            poll() {
              (this.polling = !0), this.doPoll(), this.emitReserved("poll");
            }
            onData(e) {
              ((t, e) => {
                const n = t.split(jE),
                  r = [];
                for (let o = 0; o < n.length; o++) {
                  const i = tp(n[o], e);
                  if ((r.push(i), "error" === i.type)) break;
                }
                return r;
              })(e, this.socket.binaryType).forEach((r) => {
                if (
                  ("opening" === this.readyState &&
                    "open" === r.type &&
                    this.onOpen(),
                  "close" === r.type)
                )
                  return (
                    this.onClose({
                      description: "transport closed by the server",
                    }),
                    !1
                  );
                this.onPacket(r);
              }),
                "closed" !== this.readyState &&
                  ((this.polling = !1),
                  this.emitReserved("pollComplete"),
                  "open" === this.readyState && this.poll());
            }
            doClose() {
              const e = () => {
                this.write([{ type: "close" }]);
              };
              "open" === this.readyState ? e() : this.once("open", e);
            }
            write(e) {
              (this.writable = !1),
                ((t, e) => {
                  const n = t.length,
                    r = new Array(n);
                  let o = 0;
                  t.forEach((i, s) => {
                    Jh(i, !1, (a) => {
                      (r[s] = a), ++o === n && e(r.join(jE));
                    });
                  });
                })(e, (n) => {
                  this.doWrite(n, () => {
                    (this.writable = !0), this.emitReserved("drain");
                  });
                });
            }
            uri() {
              const e = this.opts.secure ? "https" : "http",
                n = this.query || {};
              return (
                !1 !== this.opts.timestampRequests &&
                  (n[this.opts.timestampParam] = QE()),
                !this.supportsBinary && !n.sid && (n.b64 = 1),
                this.createUri(e, n)
              );
            }
            request(e = {}) {
              return (
                Object.assign(
                  e,
                  { xd: this.xd, cookieJar: this.cookieJar },
                  this.opts
                ),
                new hu(this.uri(), e)
              );
            }
            doWrite(e, n) {
              const r = this.request({ method: "POST", data: e });
              r.on("success", n),
                r.on("error", (o, i) => {
                  this.onError("xhr post error", o, i);
                });
            }
            doPoll() {
              const e = this.request();
              e.on("data", this.onData.bind(this)),
                e.on("error", (n, r) => {
                  this.onError("xhr poll error", n, r);
                }),
                (this.pollXhr = e);
            }
          },
        },
        _H =
          /^(?:(?![^:@\/?#]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@\/?#]*)(?::([^:@\/?#]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/,
        CH = [
          "source",
          "protocol",
          "authority",
          "userInfo",
          "user",
          "password",
          "host",
          "port",
          "relative",
          "path",
          "directory",
          "file",
          "query",
          "anchor",
        ];
      function sp(t) {
        const e = t,
          n = t.indexOf("["),
          r = t.indexOf("]");
        -1 != n &&
          -1 != r &&
          (t =
            t.substring(0, n) +
            t.substring(n, r).replace(/:/g, ";") +
            t.substring(r, t.length));
        let o = _H.exec(t || ""),
          i = {},
          s = 14;
        for (; s--; ) i[CH[s]] = o[s] || "";
        return (
          -1 != n &&
            -1 != r &&
            ((i.source = e),
            (i.host = i.host
              .substring(1, i.host.length - 1)
              .replace(/;/g, ":")),
            (i.authority = i.authority
              .replace("[", "")
              .replace("]", "")
              .replace(/;/g, ":")),
            (i.ipv6uri = !0)),
          (i.pathNames = (function DH(t, e) {
            const r = e.replace(/\/{2,9}/g, "/").split("/");
            return (
              ("/" == e.slice(0, 1) || 0 === e.length) && r.splice(0, 1),
              "/" == e.slice(-1) && r.splice(r.length - 1, 1),
              r
            );
          })(0, i.path)),
          (i.queryKey = (function wH(t, e) {
            const n = {};
            return (
              e.replace(/(?:^|&)([^&=]*)=?([^&]*)/g, function (r, o, i) {
                o && (n[o] = i);
              }),
              n
            );
          })(0, i.query)),
          i
        );
      }
      let e0 = (() => {
        class t extends Ve {
          constructor(n, r = {}) {
            super(),
              (this.writeBuffer = []),
              n && "object" == typeof n && ((r = n), (n = null)),
              n
                ? ((n = sp(n)),
                  (r.hostname = n.host),
                  (r.secure = "https" === n.protocol || "wss" === n.protocol),
                  (r.port = n.port),
                  n.query && (r.query = n.query))
                : r.host && (r.hostname = sp(r.host).host),
              du(this, r),
              (this.secure =
                null != r.secure
                  ? r.secure
                  : typeof location < "u" && "https:" === location.protocol),
              r.hostname && !r.port && (r.port = this.secure ? "443" : "80"),
              (this.hostname =
                r.hostname ||
                (typeof location < "u" ? location.hostname : "localhost")),
              (this.port =
                r.port ||
                (typeof location < "u" && location.port
                  ? location.port
                  : this.secure
                  ? "443"
                  : "80")),
              (this.transports = r.transports || [
                "polling",
                "websocket",
                "webtransport",
              ]),
              (this.writeBuffer = []),
              (this.prevBufferLen = 0),
              (this.opts = Object.assign(
                {
                  path: "/engine.io",
                  agent: !1,
                  withCredentials: !1,
                  upgrade: !0,
                  timestampParam: "t",
                  rememberUpgrade: !1,
                  addTrailingSlash: !0,
                  rejectUnauthorized: !0,
                  perMessageDeflate: { threshold: 1024 },
                  transportOptions: {},
                  closeOnBeforeunload: !1,
                },
                r
              )),
              (this.opts.path =
                this.opts.path.replace(/\/$/, "") +
                (this.opts.addTrailingSlash ? "/" : "")),
              "string" == typeof this.opts.query &&
                (this.opts.query = (function lH(t) {
                  let e = {},
                    n = t.split("&");
                  for (let r = 0, o = n.length; r < o; r++) {
                    let i = n[r].split("=");
                    e[decodeURIComponent(i[0])] = decodeURIComponent(i[1]);
                  }
                  return e;
                })(this.opts.query)),
              (this.id = null),
              (this.upgrades = null),
              (this.pingInterval = null),
              (this.pingTimeout = null),
              (this.pingTimeoutTimer = null),
              "function" == typeof addEventListener &&
                (this.opts.closeOnBeforeunload &&
                  ((this.beforeunloadEventListener = () => {
                    this.transport &&
                      (this.transport.removeAllListeners(),
                      this.transport.close());
                  }),
                  addEventListener(
                    "beforeunload",
                    this.beforeunloadEventListener,
                    !1
                  )),
                "localhost" !== this.hostname &&
                  ((this.offlineEventListener = () => {
                    this.onClose("transport close", {
                      description: "network connection lost",
                    });
                  }),
                  addEventListener("offline", this.offlineEventListener, !1))),
              this.open();
          }
          createTransport(n) {
            const r = Object.assign({}, this.opts.query);
            (r.EIO = 4), (r.transport = n), this.id && (r.sid = this.id);
            const o = Object.assign(
              {},
              this.opts,
              {
                query: r,
                socket: this,
                hostname: this.hostname,
                secure: this.secure,
                port: this.port,
              },
              this.opts.transportOptions[n]
            );
            return new vH[n](o);
          }
          open() {
            let n;
            if (
              this.opts.rememberUpgrade &&
              t.priorWebsocketSuccess &&
              -1 !== this.transports.indexOf("websocket")
            )
              n = "websocket";
            else {
              if (0 === this.transports.length)
                return void this.setTimeoutFn(() => {
                  this.emitReserved("error", "No transports available");
                }, 0);
              n = this.transports[0];
            }
            this.readyState = "opening";
            try {
              n = this.createTransport(n);
            } catch {
              return this.transports.shift(), void this.open();
            }
            n.open(), this.setTransport(n);
          }
          setTransport(n) {
            this.transport && this.transport.removeAllListeners(),
              (this.transport = n),
              n
                .on("drain", this.onDrain.bind(this))
                .on("packet", this.onPacket.bind(this))
                .on("error", this.onError.bind(this))
                .on("close", (r) => this.onClose("transport close", r));
          }
          probe(n) {
            let r = this.createTransport(n),
              o = !1;
            t.priorWebsocketSuccess = !1;
            const i = () => {
              o ||
                (r.send([{ type: "ping", data: "probe" }]),
                r.once("packet", (f) => {
                  if (!o)
                    if ("pong" === f.type && "probe" === f.data) {
                      if (
                        ((this.upgrading = !0),
                        this.emitReserved("upgrading", r),
                        !r)
                      )
                        return;
                      (t.priorWebsocketSuccess = "websocket" === r.name),
                        this.transport.pause(() => {
                          o ||
                            ("closed" !== this.readyState &&
                              (d(),
                              this.setTransport(r),
                              r.send([{ type: "upgrade" }]),
                              this.emitReserved("upgrade", r),
                              (r = null),
                              (this.upgrading = !1),
                              this.flush()));
                        });
                    } else {
                      const h = new Error("probe error");
                      (h.transport = r.name),
                        this.emitReserved("upgradeError", h);
                    }
                }));
            };
            function s() {
              o || ((o = !0), d(), r.close(), (r = null));
            }
            const a = (f) => {
              const h = new Error("probe error: " + f);
              (h.transport = r.name), s(), this.emitReserved("upgradeError", h);
            };
            function l() {
              a("transport closed");
            }
            function u() {
              a("socket closed");
            }
            function c(f) {
              r && f.name !== r.name && s();
            }
            const d = () => {
              r.removeListener("open", i),
                r.removeListener("error", a),
                r.removeListener("close", l),
                this.off("close", u),
                this.off("upgrading", c);
            };
            r.once("open", i),
              r.once("error", a),
              r.once("close", l),
              this.once("close", u),
              this.once("upgrading", c),
              -1 !== this.upgrades.indexOf("webtransport") &&
              "webtransport" !== n
                ? this.setTimeoutFn(() => {
                    o || r.open();
                  }, 200)
                : r.open();
          }
          onOpen() {
            if (
              ((this.readyState = "open"),
              (t.priorWebsocketSuccess = "websocket" === this.transport.name),
              this.emitReserved("open"),
              this.flush(),
              "open" === this.readyState && this.opts.upgrade)
            ) {
              let n = 0;
              const r = this.upgrades.length;
              for (; n < r; n++) this.probe(this.upgrades[n]);
            }
          }
          onPacket(n) {
            if (
              "opening" === this.readyState ||
              "open" === this.readyState ||
              "closing" === this.readyState
            )
              switch (
                (this.emitReserved("packet", n),
                this.emitReserved("heartbeat"),
                n.type)
              ) {
                case "open":
                  this.onHandshake(JSON.parse(n.data));
                  break;
                case "ping":
                  this.resetPingTimeout(),
                    this.sendPacket("pong"),
                    this.emitReserved("ping"),
                    this.emitReserved("pong");
                  break;
                case "error":
                  const r = new Error("server error");
                  (r.code = n.data), this.onError(r);
                  break;
                case "message":
                  this.emitReserved("data", n.data),
                    this.emitReserved("message", n.data);
              }
          }
          onHandshake(n) {
            this.emitReserved("handshake", n),
              (this.id = n.sid),
              (this.transport.query.sid = n.sid),
              (this.upgrades = this.filterUpgrades(n.upgrades)),
              (this.pingInterval = n.pingInterval),
              (this.pingTimeout = n.pingTimeout),
              (this.maxPayload = n.maxPayload),
              this.onOpen(),
              "closed" !== this.readyState && this.resetPingTimeout();
          }
          resetPingTimeout() {
            this.clearTimeoutFn(this.pingTimeoutTimer),
              (this.pingTimeoutTimer = this.setTimeoutFn(() => {
                this.onClose("ping timeout");
              }, this.pingInterval + this.pingTimeout)),
              this.opts.autoUnref && this.pingTimeoutTimer.unref();
          }
          onDrain() {
            this.writeBuffer.splice(0, this.prevBufferLen),
              (this.prevBufferLen = 0),
              0 === this.writeBuffer.length
                ? this.emitReserved("drain")
                : this.flush();
          }
          flush() {
            if (
              "closed" !== this.readyState &&
              this.transport.writable &&
              !this.upgrading &&
              this.writeBuffer.length
            ) {
              const n = this.getWritablePackets();
              this.transport.send(n),
                (this.prevBufferLen = n.length),
                this.emitReserved("flush");
            }
          }
          getWritablePackets() {
            if (
              !(
                this.maxPayload &&
                "polling" === this.transport.name &&
                this.writeBuffer.length > 1
              )
            )
              return this.writeBuffer;
            let r = 1;
            for (let o = 0; o < this.writeBuffer.length; o++) {
              const i = this.writeBuffer[o].data;
              if ((i && (r += iH(i)), o > 0 && r > this.maxPayload))
                return this.writeBuffer.slice(0, o);
              r += 2;
            }
            return this.writeBuffer;
          }
          write(n, r, o) {
            return this.sendPacket("message", n, r, o), this;
          }
          send(n, r, o) {
            return this.sendPacket("message", n, r, o), this;
          }
          sendPacket(n, r, o, i) {
            if (
              ("function" == typeof r && ((i = r), (r = void 0)),
              "function" == typeof o && ((i = o), (o = null)),
              "closing" === this.readyState || "closed" === this.readyState)
            )
              return;
            (o = o || {}).compress = !1 !== o.compress;
            const s = { type: n, data: r, options: o };
            this.emitReserved("packetCreate", s),
              this.writeBuffer.push(s),
              i && this.once("flush", i),
              this.flush();
          }
          close() {
            const n = () => {
                this.onClose("forced close"), this.transport.close();
              },
              r = () => {
                this.off("upgrade", r), this.off("upgradeError", r), n();
              },
              o = () => {
                this.once("upgrade", r), this.once("upgradeError", r);
              };
            return (
              ("opening" === this.readyState || "open" === this.readyState) &&
                ((this.readyState = "closing"),
                this.writeBuffer.length
                  ? this.once("drain", () => {
                      this.upgrading ? o() : n();
                    })
                  : this.upgrading
                  ? o()
                  : n()),
              this
            );
          }
          onError(n) {
            (t.priorWebsocketSuccess = !1),
              this.emitReserved("error", n),
              this.onClose("transport error", n);
          }
          onClose(n, r) {
            ("opening" === this.readyState ||
              "open" === this.readyState ||
              "closing" === this.readyState) &&
              (this.clearTimeoutFn(this.pingTimeoutTimer),
              this.transport.removeAllListeners("close"),
              this.transport.close(),
              this.transport.removeAllListeners(),
              "function" == typeof removeEventListener &&
                (removeEventListener(
                  "beforeunload",
                  this.beforeunloadEventListener,
                  !1
                ),
                removeEventListener("offline", this.offlineEventListener, !1)),
              (this.readyState = "closed"),
              (this.id = null),
              this.emitReserved("close", n, r),
              (this.writeBuffer = []),
              (this.prevBufferLen = 0));
          }
          filterUpgrades(n) {
            const r = [];
            let o = 0;
            const i = n.length;
            for (; o < i; o++) ~this.transports.indexOf(n[o]) && r.push(n[o]);
            return r;
          }
        }
        return (t.protocol = 4), t;
      })();
      const EH = "function" == typeof ArrayBuffer,
        SH = (t) =>
          "function" == typeof ArrayBuffer.isView
            ? ArrayBuffer.isView(t)
            : t.buffer instanceof ArrayBuffer,
        t0 = Object.prototype.toString,
        MH =
          "function" == typeof Blob ||
          (typeof Blob < "u" && "[object BlobConstructor]" === t0.call(Blob)),
        TH =
          "function" == typeof File ||
          (typeof File < "u" && "[object FileConstructor]" === t0.call(File));
      function ap(t) {
        return (
          (EH && (t instanceof ArrayBuffer || SH(t))) ||
          (MH && t instanceof Blob) ||
          (TH && t instanceof File)
        );
      }
      function gu(t, e) {
        if (!t || "object" != typeof t) return !1;
        if (Array.isArray(t)) {
          for (let n = 0, r = t.length; n < r; n++) if (gu(t[n])) return !0;
          return !1;
        }
        if (ap(t)) return !0;
        if (t.toJSON && "function" == typeof t.toJSON && 1 === arguments.length)
          return gu(t.toJSON(), !0);
        for (const n in t)
          if (Object.prototype.hasOwnProperty.call(t, n) && gu(t[n])) return !0;
        return !1;
      }
      function AH(t) {
        const e = [],
          r = t;
        return (
          (r.data = lp(t.data, e)),
          (r.attachments = e.length),
          { packet: r, buffers: e }
        );
      }
      function lp(t, e) {
        if (!t) return t;
        if (ap(t)) {
          const n = { _placeholder: !0, num: e.length };
          return e.push(t), n;
        }
        if (Array.isArray(t)) {
          const n = new Array(t.length);
          for (let r = 0; r < t.length; r++) n[r] = lp(t[r], e);
          return n;
        }
        if ("object" == typeof t && !(t instanceof Date)) {
          const n = {};
          for (const r in t)
            Object.prototype.hasOwnProperty.call(t, r) && (n[r] = lp(t[r], e));
          return n;
        }
        return t;
      }
      function IH(t, e) {
        return (t.data = up(t.data, e)), delete t.attachments, t;
      }
      function up(t, e) {
        if (!t) return t;
        if (t && !0 === t._placeholder) {
          if ("number" == typeof t.num && t.num >= 0 && t.num < e.length)
            return e[t.num];
          throw new Error("illegal attachments");
        }
        if (Array.isArray(t))
          for (let n = 0; n < t.length; n++) t[n] = up(t[n], e);
        else if ("object" == typeof t)
          for (const n in t)
            Object.prototype.hasOwnProperty.call(t, n) && (t[n] = up(t[n], e));
        return t;
      }
      const OH = [
          "connect",
          "connect_error",
          "disconnect",
          "disconnecting",
          "newListener",
          "removeListener",
        ],
        PH = 5;
      var V = (() => (
        ((V = V || {})[(V.CONNECT = 0)] = "CONNECT"),
        (V[(V.DISCONNECT = 1)] = "DISCONNECT"),
        (V[(V.EVENT = 2)] = "EVENT"),
        (V[(V.ACK = 3)] = "ACK"),
        (V[(V.CONNECT_ERROR = 4)] = "CONNECT_ERROR"),
        (V[(V.BINARY_EVENT = 5)] = "BINARY_EVENT"),
        (V[(V.BINARY_ACK = 6)] = "BINARY_ACK"),
        V
      ))();
      class NH {
        constructor(e) {
          this.replacer = e;
        }
        encode(e) {
          return (e.type !== V.EVENT && e.type !== V.ACK) || !gu(e)
            ? [this.encodeAsString(e)]
            : this.encodeAsBinary({
                type: e.type === V.EVENT ? V.BINARY_EVENT : V.BINARY_ACK,
                nsp: e.nsp,
                data: e.data,
                id: e.id,
              });
        }
        encodeAsString(e) {
          let n = "" + e.type;
          return (
            (e.type === V.BINARY_EVENT || e.type === V.BINARY_ACK) &&
              (n += e.attachments + "-"),
            e.nsp && "/" !== e.nsp && (n += e.nsp + ","),
            null != e.id && (n += e.id),
            null != e.data && (n += JSON.stringify(e.data, this.replacer)),
            n
          );
        }
        encodeAsBinary(e) {
          const n = AH(e),
            r = this.encodeAsString(n.packet),
            o = n.buffers;
          return o.unshift(r), o;
        }
      }
      function n0(t) {
        return "[object Object]" === Object.prototype.toString.call(t);
      }
      class cp extends Ve {
        constructor(e) {
          super(), (this.reviver = e);
        }
        add(e) {
          let n;
          if ("string" == typeof e) {
            if (this.reconstructor)
              throw new Error(
                "got plaintext data when reconstructing a packet"
              );
            n = this.decodeString(e);
            const r = n.type === V.BINARY_EVENT;
            r || n.type === V.BINARY_ACK
              ? ((n.type = r ? V.EVENT : V.ACK),
                (this.reconstructor = new xH(n)),
                0 === n.attachments && super.emitReserved("decoded", n))
              : super.emitReserved("decoded", n);
          } else {
            if (!ap(e) && !e.base64) throw new Error("Unknown type: " + e);
            if (!this.reconstructor)
              throw new Error(
                "got binary data when not reconstructing a packet"
              );
            (n = this.reconstructor.takeBinaryData(e)),
              n &&
                ((this.reconstructor = null), super.emitReserved("decoded", n));
          }
        }
        decodeString(e) {
          let n = 0;
          const r = { type: Number(e.charAt(0)) };
          if (void 0 === V[r.type])
            throw new Error("unknown packet type " + r.type);
          if (r.type === V.BINARY_EVENT || r.type === V.BINARY_ACK) {
            const i = n + 1;
            for (; "-" !== e.charAt(++n) && n != e.length; );
            const s = e.substring(i, n);
            if (s != Number(s) || "-" !== e.charAt(n))
              throw new Error("Illegal attachments");
            r.attachments = Number(s);
          }
          if ("/" === e.charAt(n + 1)) {
            const i = n + 1;
            for (; ++n && "," !== e.charAt(n) && n !== e.length; );
            r.nsp = e.substring(i, n);
          } else r.nsp = "/";
          const o = e.charAt(n + 1);
          if ("" !== o && Number(o) == o) {
            const i = n + 1;
            for (; ++n; ) {
              const s = e.charAt(n);
              if (null == s || Number(s) != s) {
                --n;
                break;
              }
              if (n === e.length) break;
            }
            r.id = Number(e.substring(i, n + 1));
          }
          if (e.charAt(++n)) {
            const i = this.tryParse(e.substr(n));
            if (!cp.isPayloadValid(r.type, i))
              throw new Error("invalid payload");
            r.data = i;
          }
          return r;
        }
        tryParse(e) {
          try {
            return JSON.parse(e, this.reviver);
          } catch {
            return !1;
          }
        }
        static isPayloadValid(e, n) {
          switch (e) {
            case V.CONNECT:
              return n0(n);
            case V.DISCONNECT:
              return void 0 === n;
            case V.CONNECT_ERROR:
              return "string" == typeof n || n0(n);
            case V.EVENT:
            case V.BINARY_EVENT:
              return (
                Array.isArray(n) &&
                ("number" == typeof n[0] ||
                  ("string" == typeof n[0] && -1 === OH.indexOf(n[0])))
              );
            case V.ACK:
            case V.BINARY_ACK:
              return Array.isArray(n);
          }
        }
        destroy() {
          this.reconstructor &&
            (this.reconstructor.finishedReconstruction(),
            (this.reconstructor = null));
        }
      }
      class xH {
        constructor(e) {
          (this.packet = e), (this.buffers = []), (this.reconPack = e);
        }
        takeBinaryData(e) {
          if (
            (this.buffers.push(e),
            this.buffers.length === this.reconPack.attachments)
          ) {
            const n = IH(this.reconPack, this.buffers);
            return this.finishedReconstruction(), n;
          }
          return null;
        }
        finishedReconstruction() {
          (this.reconPack = null), (this.buffers = []);
        }
      }
      function un(t, e, n) {
        return (
          t.on(e, n),
          function () {
            t.off(e, n);
          }
        );
      }
      const RH = Object.freeze({
        connect: 1,
        connect_error: 1,
        disconnect: 1,
        disconnecting: 1,
        newListener: 1,
        removeListener: 1,
      });
      class r0 extends Ve {
        constructor(e, n, r) {
          super(),
            (this.connected = !1),
            (this.recovered = !1),
            (this.receiveBuffer = []),
            (this.sendBuffer = []),
            (this._queue = []),
            (this._queueSeq = 0),
            (this.ids = 0),
            (this.acks = {}),
            (this.flags = {}),
            (this.io = e),
            (this.nsp = n),
            r && r.auth && (this.auth = r.auth),
            (this._opts = Object.assign({}, r)),
            this.io._autoConnect && this.open();
        }
        get disconnected() {
          return !this.connected;
        }
        subEvents() {
          if (this.subs) return;
          const e = this.io;
          this.subs = [
            un(e, "open", this.onopen.bind(this)),
            un(e, "packet", this.onpacket.bind(this)),
            un(e, "error", this.onerror.bind(this)),
            un(e, "close", this.onclose.bind(this)),
          ];
        }
        get active() {
          return !!this.subs;
        }
        connect() {
          return (
            this.connected ||
              (this.subEvents(),
              this.io._reconnecting || this.io.open(),
              "open" === this.io._readyState && this.onopen()),
            this
          );
        }
        open() {
          return this.connect();
        }
        send(...e) {
          return e.unshift("message"), this.emit.apply(this, e), this;
        }
        emit(e, ...n) {
          if (RH.hasOwnProperty(e))
            throw new Error('"' + e.toString() + '" is a reserved event name');
          if (
            (n.unshift(e),
            this._opts.retries && !this.flags.fromQueue && !this.flags.volatile)
          )
            return this._addToQueue(n), this;
          const r = { type: V.EVENT, data: n, options: {} };
          if (
            ((r.options.compress = !1 !== this.flags.compress),
            "function" == typeof n[n.length - 1])
          ) {
            const s = this.ids++,
              a = n.pop();
            this._registerAckCallback(s, a), (r.id = s);
          }
          return (
            (this.flags.volatile &&
              (!(
                this.io.engine &&
                this.io.engine.transport &&
                this.io.engine.transport.writable
              ) ||
                !this.connected)) ||
              (this.connected
                ? (this.notifyOutgoingListeners(r), this.packet(r))
                : this.sendBuffer.push(r)),
            (this.flags = {}),
            this
          );
        }
        _registerAckCallback(e, n) {
          var r;
          const o =
            null !== (r = this.flags.timeout) && void 0 !== r
              ? r
              : this._opts.ackTimeout;
          if (void 0 === o) return void (this.acks[e] = n);
          const i = this.io.setTimeoutFn(() => {
            delete this.acks[e];
            for (let s = 0; s < this.sendBuffer.length; s++)
              this.sendBuffer[s].id === e && this.sendBuffer.splice(s, 1);
            n.call(this, new Error("operation has timed out"));
          }, o);
          this.acks[e] = (...s) => {
            this.io.clearTimeoutFn(i), n.apply(this, [null, ...s]);
          };
        }
        emitWithAck(e, ...n) {
          const r =
            void 0 !== this.flags.timeout || void 0 !== this._opts.ackTimeout;
          return new Promise((o, i) => {
            n.push((s, a) => (r ? (s ? i(s) : o(a)) : o(s))),
              this.emit(e, ...n);
          });
        }
        _addToQueue(e) {
          let n;
          "function" == typeof e[e.length - 1] && (n = e.pop());
          const r = {
            id: this._queueSeq++,
            tryCount: 0,
            pending: !1,
            args: e,
            flags: Object.assign({ fromQueue: !0 }, this.flags),
          };
          e.push((o, ...i) =>
            r !== this._queue[0]
              ? void 0
              : (null !== o
                  ? r.tryCount > this._opts.retries &&
                    (this._queue.shift(), n && n(o))
                  : (this._queue.shift(), n && n(null, ...i)),
                (r.pending = !1),
                this._drainQueue())
          ),
            this._queue.push(r),
            this._drainQueue();
        }
        _drainQueue(e = !1) {
          if (!this.connected || 0 === this._queue.length) return;
          const n = this._queue[0];
          (n.pending && !e) ||
            ((n.pending = !0),
            n.tryCount++,
            (this.flags = n.flags),
            this.emit.apply(this, n.args));
        }
        packet(e) {
          (e.nsp = this.nsp), this.io._packet(e);
        }
        onopen() {
          "function" == typeof this.auth
            ? this.auth((e) => {
                this._sendConnectPacket(e);
              })
            : this._sendConnectPacket(this.auth);
        }
        _sendConnectPacket(e) {
          this.packet({
            type: V.CONNECT,
            data: this._pid
              ? Object.assign({ pid: this._pid, offset: this._lastOffset }, e)
              : e,
          });
        }
        onerror(e) {
          this.connected || this.emitReserved("connect_error", e);
        }
        onclose(e, n) {
          (this.connected = !1),
            delete this.id,
            this.emitReserved("disconnect", e, n);
        }
        onpacket(e) {
          if (e.nsp === this.nsp)
            switch (e.type) {
              case V.CONNECT:
                e.data && e.data.sid
                  ? this.onconnect(e.data.sid, e.data.pid)
                  : this.emitReserved(
                      "connect_error",
                      new Error(
                        "It seems you are trying to reach a Socket.IO server in v2.x with a v3.x client, but they are not compatible (more information here: https://socket.io/docs/v3/migrating-from-2-x-to-3-0/)"
                      )
                    );
                break;
              case V.EVENT:
              case V.BINARY_EVENT:
                this.onevent(e);
                break;
              case V.ACK:
              case V.BINARY_ACK:
                this.onack(e);
                break;
              case V.DISCONNECT:
                this.ondisconnect();
                break;
              case V.CONNECT_ERROR:
                this.destroy();
                const r = new Error(e.data.message);
                (r.data = e.data.data), this.emitReserved("connect_error", r);
            }
        }
        onevent(e) {
          const n = e.data || [];
          null != e.id && n.push(this.ack(e.id)),
            this.connected
              ? this.emitEvent(n)
              : this.receiveBuffer.push(Object.freeze(n));
        }
        emitEvent(e) {
          if (this._anyListeners && this._anyListeners.length) {
            const n = this._anyListeners.slice();
            for (const r of n) r.apply(this, e);
          }
          super.emit.apply(this, e),
            this._pid &&
              e.length &&
              "string" == typeof e[e.length - 1] &&
              (this._lastOffset = e[e.length - 1]);
        }
        ack(e) {
          const n = this;
          let r = !1;
          return function (...o) {
            r || ((r = !0), n.packet({ type: V.ACK, id: e, data: o }));
          };
        }
        onack(e) {
          const n = this.acks[e.id];
          "function" == typeof n &&
            (n.apply(this, e.data), delete this.acks[e.id]);
        }
        onconnect(e, n) {
          (this.id = e),
            (this.recovered = n && this._pid === n),
            (this._pid = n),
            (this.connected = !0),
            this.emitBuffered(),
            this.emitReserved("connect"),
            this._drainQueue(!0);
        }
        emitBuffered() {
          this.receiveBuffer.forEach((e) => this.emitEvent(e)),
            (this.receiveBuffer = []),
            this.sendBuffer.forEach((e) => {
              this.notifyOutgoingListeners(e), this.packet(e);
            }),
            (this.sendBuffer = []);
        }
        ondisconnect() {
          this.destroy(), this.onclose("io server disconnect");
        }
        destroy() {
          this.subs && (this.subs.forEach((e) => e()), (this.subs = void 0)),
            this.io._destroy(this);
        }
        disconnect() {
          return (
            this.connected && this.packet({ type: V.DISCONNECT }),
            this.destroy(),
            this.connected && this.onclose("io client disconnect"),
            this
          );
        }
        close() {
          return this.disconnect();
        }
        compress(e) {
          return (this.flags.compress = e), this;
        }
        get volatile() {
          return (this.flags.volatile = !0), this;
        }
        timeout(e) {
          return (this.flags.timeout = e), this;
        }
        onAny(e) {
          return (
            (this._anyListeners = this._anyListeners || []),
            this._anyListeners.push(e),
            this
          );
        }
        prependAny(e) {
          return (
            (this._anyListeners = this._anyListeners || []),
            this._anyListeners.unshift(e),
            this
          );
        }
        offAny(e) {
          if (!this._anyListeners) return this;
          if (e) {
            const n = this._anyListeners;
            for (let r = 0; r < n.length; r++)
              if (e === n[r]) return n.splice(r, 1), this;
          } else this._anyListeners = [];
          return this;
        }
        listenersAny() {
          return this._anyListeners || [];
        }
        onAnyOutgoing(e) {
          return (
            (this._anyOutgoingListeners = this._anyOutgoingListeners || []),
            this._anyOutgoingListeners.push(e),
            this
          );
        }
        prependAnyOutgoing(e) {
          return (
            (this._anyOutgoingListeners = this._anyOutgoingListeners || []),
            this._anyOutgoingListeners.unshift(e),
            this
          );
        }
        offAnyOutgoing(e) {
          if (!this._anyOutgoingListeners) return this;
          if (e) {
            const n = this._anyOutgoingListeners;
            for (let r = 0; r < n.length; r++)
              if (e === n[r]) return n.splice(r, 1), this;
          } else this._anyOutgoingListeners = [];
          return this;
        }
        listenersAnyOutgoing() {
          return this._anyOutgoingListeners || [];
        }
        notifyOutgoingListeners(e) {
          if (this._anyOutgoingListeners && this._anyOutgoingListeners.length) {
            const n = this._anyOutgoingListeners.slice();
            for (const r of n) r.apply(this, e.data);
          }
        }
      }
      function di(t) {
        (this.ms = (t = t || {}).min || 100),
          (this.max = t.max || 1e4),
          (this.factor = t.factor || 2),
          (this.jitter = t.jitter > 0 && t.jitter <= 1 ? t.jitter : 0),
          (this.attempts = 0);
      }
      (di.prototype.duration = function () {
        var t = this.ms * Math.pow(this.factor, this.attempts++);
        if (this.jitter) {
          var e = Math.random(),
            n = Math.floor(e * this.jitter * t);
          t = 1 & Math.floor(10 * e) ? t + n : t - n;
        }
        return 0 | Math.min(t, this.max);
      }),
        (di.prototype.reset = function () {
          this.attempts = 0;
        }),
        (di.prototype.setMin = function (t) {
          this.ms = t;
        }),
        (di.prototype.setMax = function (t) {
          this.max = t;
        }),
        (di.prototype.setJitter = function (t) {
          this.jitter = t;
        });
      class dp extends Ve {
        constructor(e, n) {
          var r;
          super(),
            (this.nsps = {}),
            (this.subs = []),
            e && "object" == typeof e && ((n = e), (e = void 0)),
            ((n = n || {}).path = n.path || "/socket.io"),
            (this.opts = n),
            du(this, n),
            this.reconnection(!1 !== n.reconnection),
            this.reconnectionAttempts(n.reconnectionAttempts || 1 / 0),
            this.reconnectionDelay(n.reconnectionDelay || 1e3),
            this.reconnectionDelayMax(n.reconnectionDelayMax || 5e3),
            this.randomizationFactor(
              null !== (r = n.randomizationFactor) && void 0 !== r ? r : 0.5
            ),
            (this.backoff = new di({
              min: this.reconnectionDelay(),
              max: this.reconnectionDelayMax(),
              jitter: this.randomizationFactor(),
            })),
            this.timeout(null == n.timeout ? 2e4 : n.timeout),
            (this._readyState = "closed"),
            (this.uri = e);
          const o = n.parser || pi;
          (this.encoder = new o.Encoder()),
            (this.decoder = new o.Decoder()),
            (this._autoConnect = !1 !== n.autoConnect),
            this._autoConnect && this.open();
        }
        reconnection(e) {
          return arguments.length
            ? ((this._reconnection = !!e), this)
            : this._reconnection;
        }
        reconnectionAttempts(e) {
          return void 0 === e
            ? this._reconnectionAttempts
            : ((this._reconnectionAttempts = e), this);
        }
        reconnectionDelay(e) {
          var n;
          return void 0 === e
            ? this._reconnectionDelay
            : ((this._reconnectionDelay = e),
              null === (n = this.backoff) || void 0 === n || n.setMin(e),
              this);
        }
        randomizationFactor(e) {
          var n;
          return void 0 === e
            ? this._randomizationFactor
            : ((this._randomizationFactor = e),
              null === (n = this.backoff) || void 0 === n || n.setJitter(e),
              this);
        }
        reconnectionDelayMax(e) {
          var n;
          return void 0 === e
            ? this._reconnectionDelayMax
            : ((this._reconnectionDelayMax = e),
              null === (n = this.backoff) || void 0 === n || n.setMax(e),
              this);
        }
        timeout(e) {
          return arguments.length ? ((this._timeout = e), this) : this._timeout;
        }
        maybeReconnectOnOpen() {
          !this._reconnecting &&
            this._reconnection &&
            0 === this.backoff.attempts &&
            this.reconnect();
        }
        open(e) {
          if (~this._readyState.indexOf("open")) return this;
          this.engine = new e0(this.uri, this.opts);
          const n = this.engine,
            r = this;
          (this._readyState = "opening"), (this.skipReconnect = !1);
          const o = un(n, "open", function () {
              r.onopen(), e && e();
            }),
            i = (a) => {
              this.cleanup(),
                (this._readyState = "closed"),
                this.emitReserved("error", a),
                e ? e(a) : this.maybeReconnectOnOpen();
            },
            s = un(n, "error", i);
          if (!1 !== this._timeout) {
            const l = this.setTimeoutFn(() => {
              o(), i(new Error("timeout")), n.close();
            }, this._timeout);
            this.opts.autoUnref && l.unref(),
              this.subs.push(() => {
                this.clearTimeoutFn(l);
              });
          }
          return this.subs.push(o), this.subs.push(s), this;
        }
        connect(e) {
          return this.open(e);
        }
        onopen() {
          this.cleanup(),
            (this._readyState = "open"),
            this.emitReserved("open");
          const e = this.engine;
          this.subs.push(
            un(e, "ping", this.onping.bind(this)),
            un(e, "data", this.ondata.bind(this)),
            un(e, "error", this.onerror.bind(this)),
            un(e, "close", this.onclose.bind(this)),
            un(this.decoder, "decoded", this.ondecoded.bind(this))
          );
        }
        onping() {
          this.emitReserved("ping");
        }
        ondata(e) {
          try {
            this.decoder.add(e);
          } catch (n) {
            this.onclose("parse error", n);
          }
        }
        ondecoded(e) {
          op(() => {
            this.emitReserved("packet", e);
          }, this.setTimeoutFn);
        }
        onerror(e) {
          this.emitReserved("error", e);
        }
        socket(e, n) {
          let r = this.nsps[e];
          return (
            r
              ? this._autoConnect && !r.active && r.connect()
              : ((r = new r0(this, e, n)), (this.nsps[e] = r)),
            r
          );
        }
        _destroy(e) {
          const n = Object.keys(this.nsps);
          for (const r of n) if (this.nsps[r].active) return;
          this._close();
        }
        _packet(e) {
          const n = this.encoder.encode(e);
          for (let r = 0; r < n.length; r++) this.engine.write(n[r], e.options);
        }
        cleanup() {
          this.subs.forEach((e) => e()),
            (this.subs.length = 0),
            this.decoder.destroy();
        }
        _close() {
          (this.skipReconnect = !0),
            (this._reconnecting = !1),
            this.onclose("forced close"),
            this.engine && this.engine.close();
        }
        disconnect() {
          return this._close();
        }
        onclose(e, n) {
          this.cleanup(),
            this.backoff.reset(),
            (this._readyState = "closed"),
            this.emitReserved("close", e, n),
            this._reconnection && !this.skipReconnect && this.reconnect();
        }
        reconnect() {
          if (this._reconnecting || this.skipReconnect) return this;
          const e = this;
          if (this.backoff.attempts >= this._reconnectionAttempts)
            this.backoff.reset(),
              this.emitReserved("reconnect_failed"),
              (this._reconnecting = !1);
          else {
            const n = this.backoff.duration();
            this._reconnecting = !0;
            const r = this.setTimeoutFn(() => {
              e.skipReconnect ||
                (this.emitReserved("reconnect_attempt", e.backoff.attempts),
                !e.skipReconnect &&
                  e.open((o) => {
                    o
                      ? ((e._reconnecting = !1),
                        e.reconnect(),
                        this.emitReserved("reconnect_error", o))
                      : e.onreconnect();
                  }));
            }, n);
            this.opts.autoUnref && r.unref(),
              this.subs.push(() => {
                this.clearTimeoutFn(r);
              });
          }
        }
        onreconnect() {
          const e = this.backoff.attempts;
          (this._reconnecting = !1),
            this.backoff.reset(),
            this.emitReserved("reconnect", e);
        }
      }
      const Ls = {};
      function Xr(t, e) {
        "object" == typeof t && ((e = t), (t = void 0));
        const n = (function bH(t, e = "", n) {
            let r = t;
            (n = n || (typeof location < "u" && location)),
              null == t && (t = n.protocol + "//" + n.host),
              "string" == typeof t &&
                ("/" === t.charAt(0) &&
                  (t = "/" === t.charAt(1) ? n.protocol + t : n.host + t),
                /^(https?|wss?):\/\//.test(t) ||
                  (t = typeof n < "u" ? n.protocol + "//" + t : "https://" + t),
                (r = sp(t))),
              r.port ||
                (/^(http|ws)$/.test(r.protocol)
                  ? (r.port = "80")
                  : /^(http|ws)s$/.test(r.protocol) && (r.port = "443")),
              (r.path = r.path || "/");
            const i = -1 !== r.host.indexOf(":") ? "[" + r.host + "]" : r.host;
            return (
              (r.id = r.protocol + "://" + i + ":" + r.port + e),
              (r.href =
                r.protocol +
                "://" +
                i +
                (n && n.port === r.port ? "" : ":" + r.port)),
              r
            );
          })(t, (e = e || {}).path || "/socket.io"),
          r = n.source,
          o = n.id;
        let l;
        return (
          e.forceNew ||
          e["force new connection"] ||
          !1 === e.multiplex ||
          (Ls[o] && n.path in Ls[o].nsps)
            ? (l = new dp(r, e))
            : (Ls[o] || (Ls[o] = new dp(r, e)), (l = Ls[o])),
          n.query && !e.query && (e.query = n.queryKey),
          l.socket(n.path, e)
        );
      }
      Object.assign(Xr, { Manager: dp, Socket: r0, io: Xr, connect: Xr });
      let mu = (() => {
        class t {
          constructor() {
            (this.resId = localStorage.getItem("resId")),
              (this.socket = Xr("http://localhost:5000"));
          }
          listen(n) {
            return new Ce((r) => {
              this.socket.on(n, (o) => {
                r.next(o);
              });
            });
          }
          emit(n, r) {
            this.socket.emit(n, { data: r, resId: this.resId });
          }
        }
        return (
          (t.ɵfac = function (n) {
            return new (n || t)();
          }),
          (t.ɵprov = N({ token: t, factory: t.ɵfac, providedIn: "root" })),
          t
        );
      })();
      function FH(t, e) {
        1 & t && (D(0, "p", 14), S(1, " Served "), b());
      }
      function kH(t, e) {
        1 & t && (D(0, "p", 15), S(1, " Pendding "), b());
      }
      function LH(t, e) {
        1 & t && (D(0, "p", 15), S(1, " Ready "), b());
      }
      function VH(t, e) {
        if (1 & t) {
          const n = ns();
          D(0, "a", 12),
            Ie("click", function () {
              Pr(n);
              const o = xt().$implicit;
              return Nr(xt().ProceedOrder(o._id));
            }),
            S(1, " Proceed"),
            b();
        }
      }
      function BH(t, e) {
        if (1 & t) {
          const n = ns();
          D(0, "tr")(1, "td"),
            S(2, "1"),
            b(),
            D(3, "td"),
            S(4),
            b(),
            D(5, "td"),
            S(6),
            b(),
            D(7, "td"),
            S(8),
            b(),
            D(9, "td")(10, "strong"),
            S(11),
            b()(),
            D(12, "td"),
            Se(13, FH, 2, 0, "p", 10),
            Se(14, kH, 2, 0, "p", 11),
            Se(15, LH, 2, 0, "p", 11),
            b(),
            D(16, "td")(17, "a", 12),
            Ie("click", function () {
              const i = Pr(n).$implicit;
              return Nr(xt().moreView(i._id));
            }),
            S(18, " View"),
            b()(),
            D(19, "td")(20, "a", 12),
            Ie("click", function () {
              const i = Pr(n).$implicit;
              return Nr(xt().generateQr(i._id));
            }),
            S(21, " Q"),
            b()(),
            D(22, "td"),
            Se(23, VH, 2, 0, "a", 13),
            b()();
        }
        if (2 & t) {
          const n = e.$implicit;
          Q(4),
            qo("", n.tableId.table_Name, "-", n.tableId.table_No, ""),
            Q(2),
            In(n.staffId.username),
            Q(2),
            In(n.foods.length),
            Q(3),
            Kn("", n.total_price, " "),
            Q(2),
            fe("ngIf", "served" == n.order_status),
            Q(1),
            fe("ngIf", "pending" == n.order_status),
            Q(1),
            fe("ngIf", "ready" == n.order_status),
            Q(8),
            fe("ngIf", "served" == n.order_status);
        }
      }
      let HH = (() => {
        class t {
          constructor(n, r, o) {
            (this._posService = n),
              (this._posSocketService = r),
              (this._router = o),
              (this.socket = Xr("http://localhost:5000")),
              (this.resId = localStorage.getItem("resId"));
          }
          ngOnInit() {
            this.loadOrders();
          }
          loadOrders() {
            this._posSocketService.emit("loadOrdersToPOS", {}),
              this._posSocketService.listen("listOrdersToPOS").subscribe(
                (n) => {
                  this.orders = n;
                },
                (n) => console.log(n)
              );
          }
          generateQr(n) {
            this._posService.generteQR(n).subscribe((r) => {
              console.log(r);
            });
          }
          ProceedOrder(n) {
            this._posService.proceesOrder(n).subscribe((r) => {
              console.log(r),
                this._posSocketService.emit("loadOrdersToPOS", {}),
                this._posSocketService.emit("loadToOrdersHistory", {});
            });
          }
          moreView(n) {
            n && this._router.navigate(["", n]);
          }
        }
        return (
          (t.ɵfac = function (n) {
            return new (n || t)(C(ui), C(mu), C(Je));
          }),
          (t.ɵcmp = Xt({
            type: t,
            selectors: [["app-counter"]],
            decls: 47,
            vars: 1,
            consts: [
              [1, "table"],
              [1, "table__header"],
              [1, "input-group"],
              ["type", "search", "placeholder", "Search Data..."],
              [1, "export__file"],
              [
                "for",
                "export-file",
                "title",
                "Export File",
                1,
                "export__file-btn",
              ],
              ["type", "checkbox", "id", "export-file"],
              [1, "table__body"],
              [1, "icon-arrow"],
              [4, "ngFor", "ngForOf"],
              ["class", "status cancelled ", 4, "ngIf"],
              ["class", "status delivered", 4, "ngIf"],
              ["type", "button", 3, "click"],
              ["type", "button", 3, "click", 4, "ngIf"],
              [1, "status", "cancelled"],
              [1, "status", "delivered"],
            ],
            template: function (n, r) {
              1 & n &&
                (D(0, "main", 0)(1, "section", 1)(2, "h3"),
                S(3, "Counter"),
                b(),
                D(4, "div", 2),
                Ae(5, "input", 3),
                b(),
                D(6, "div", 4),
                Ae(7, "label", 5)(8, "input", 6),
                b()(),
                D(9, "section", 7)(10, "table")(11, "thead")(12, "tr")(
                  13,
                  "th"
                ),
                S(14, "Id "),
                D(15, "span", 8),
                S(16, "\u2191"),
                b()(),
                D(17, "th"),
                S(18, "Table "),
                D(19, "span", 8),
                S(20, "\u2191"),
                b()(),
                D(21, "th"),
                S(22, "Staff "),
                D(23, "span", 8),
                S(24, "\u2191"),
                b()(),
                D(25, "th"),
                S(26, "Food Count "),
                D(27, "span", 8),
                S(28, "\u2191"),
                b()(),
                D(29, "th"),
                S(30, "Amount "),
                D(31, "span", 8),
                S(32, "\u2191"),
                b()(),
                D(33, "th"),
                S(34, "Order Status "),
                D(35, "span", 8),
                S(36, "\u2191"),
                b()(),
                D(37, "th"),
                S(38, "Full Details"),
                D(39, "span", 8),
                S(40, "\u2191"),
                b()(),
                D(41, "th"),
                S(42, "Qr Code "),
                D(43, "span", 8),
                S(44, "\u2191"),
                b()()()(),
                D(45, "tbody"),
                Se(46, BH, 24, 9, "tr", 9),
                b()()()()),
                2 & n && (Q(46), fe("ngForOf", r.orders));
            },
            dependencies: [kl, Ll],
            styles: [
              "*[_ngcontent-%COMP%]{margin:0;padding:0;box-sizing:border-box;font-family:sans-serif}body[_ngcontent-%COMP%]{min-height:100vh;display:flex;justify-content:center;align-items:center}main.table[_ngcontent-%COMP%]{width:82vw;height:90vh;background-color:#fff5;-webkit-backdrop-filter:blur(7px);backdrop-filter:blur(7px);box-shadow:0 .4rem .8rem #0005;border-radius:.8rem;overflow:hidden}.table__header[_ngcontent-%COMP%]{width:100%;height:10%;background-color:#fff4;padding:.8rem 1rem;display:flex;justify-content:space-between;align-items:center}.table__header[_ngcontent-%COMP%]   .input-group[_ngcontent-%COMP%]{width:35%;height:100%;background-color:#fff5;padding:0 .8rem;border-radius:2rem;display:flex;justify-content:center;align-items:center;transition:.2s}.table__header[_ngcontent-%COMP%]   .input-group[_ngcontent-%COMP%]:hover{width:45%;background-color:#fff8;box-shadow:0 .1rem .4rem #0002}.table__header[_ngcontent-%COMP%]   .input-group[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{width:1.2rem;height:1.2rem}.table__header[_ngcontent-%COMP%]   .input-group[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]{width:100%;padding:0 .5rem 0 .3rem;background-color:transparent;border:none;outline:none}.table__body[_ngcontent-%COMP%]{width:95%;max-height:calc(89% - 1.6rem);background-color:#fffb;margin:.8rem auto;border-radius:.6rem;overflow:auto;overflow:overlay}.table__body[_ngcontent-%COMP%]::-webkit-scrollbar{width:.5rem;height:.5rem}.table__body[_ngcontent-%COMP%]::-webkit-scrollbar-thumb{border-radius:.5rem;background-color:#0004;visibility:hidden}.table__body[_ngcontent-%COMP%]:hover::-webkit-scrollbar-thumb{visibility:visible}table[_ngcontent-%COMP%]{width:100%}td[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{width:36px;height:36px;margin-right:.5rem;border-radius:50%;vertical-align:middle}table[_ngcontent-%COMP%], th[_ngcontent-%COMP%], td[_ngcontent-%COMP%]{border-collapse:collapse;padding:1rem;text-align:left}thead[_ngcontent-%COMP%]   th[_ngcontent-%COMP%]{position:sticky;top:0;left:0;background-color:#f4a91f;cursor:pointer;text-transform:capitalize}tbody[_ngcontent-%COMP%]   tr[_ngcontent-%COMP%]:nth-child(even){background-color:#0000000b}tbody[_ngcontent-%COMP%]   tr[_ngcontent-%COMP%]{--delay: .1s;transition:.5s ease-in-out var(--delay),background-color 0s}tbody[_ngcontent-%COMP%]   tr.hide[_ngcontent-%COMP%]{opacity:0;transform:translate(100%)}tbody[_ngcontent-%COMP%]   tr[_ngcontent-%COMP%]:hover{background-color:#fff6!important}tbody[_ngcontent-%COMP%]   tr[_ngcontent-%COMP%]   td[_ngcontent-%COMP%], tbody[_ngcontent-%COMP%]   tr[_ngcontent-%COMP%]   td[_ngcontent-%COMP%]   p[_ngcontent-%COMP%], tbody[_ngcontent-%COMP%]   tr[_ngcontent-%COMP%]   td[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{transition:.2s ease-in-out}tbody[_ngcontent-%COMP%]   tr.hide[_ngcontent-%COMP%]   td[_ngcontent-%COMP%], tbody[_ngcontent-%COMP%]   tr.hide[_ngcontent-%COMP%]   td[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{padding:0;font:0 / 0 sans-serif;transition:.2s ease-in-out .5s}tbody[_ngcontent-%COMP%]   tr.hide[_ngcontent-%COMP%]   td[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{width:0;height:0;transition:.2s ease-in-out .5s}.status[_ngcontent-%COMP%]{padding:.4rem 0;border-radius:2rem;text-align:center}.status.delivered[_ngcontent-%COMP%]{background-color:#6cf02979;color:#1ec704}.status.cancelled[_ngcontent-%COMP%]{background-color:#f91a1a51;color:#ff0505}.status.pending[_ngcontent-%COMP%]{background-color:#ebc474}.status.shipped[_ngcontent-%COMP%]{background-color:#6fcaea}@media (max-width: 1000px){td[_ngcontent-%COMP%]:not(:first-of-type){min-width:12.1rem}}thead[_ngcontent-%COMP%]   th[_ngcontent-%COMP%]   span.icon-arrow[_ngcontent-%COMP%]{display:inline-block;width:1.3rem;height:1.3rem;border-radius:50%;border:1.4px solid transparent;text-align:center;font-size:1rem;margin-left:.5rem;transition:.2s ease-in-out}thead[_ngcontent-%COMP%]   th[_ngcontent-%COMP%]:hover   span.icon-arrow[_ngcontent-%COMP%]{border:1.4px solid #6c00bd}thead[_ngcontent-%COMP%]   th[_ngcontent-%COMP%]:hover{color:#6c00bd}thead[_ngcontent-%COMP%]   th.active[_ngcontent-%COMP%]   span.icon-arrow[_ngcontent-%COMP%]{background-color:#6c00bd;color:#fff}thead[_ngcontent-%COMP%]   th.asc[_ngcontent-%COMP%]   span.icon-arrow[_ngcontent-%COMP%]{transform:rotate(180deg)}thead[_ngcontent-%COMP%]   th.active[_ngcontent-%COMP%], tbody[_ngcontent-%COMP%]   td.active[_ngcontent-%COMP%]{color:#6c00bd}.export__file[_ngcontent-%COMP%]{position:relative}.export__file[_ngcontent-%COMP%]   .export__file-btn[_ngcontent-%COMP%]{display:inline-block;width:2rem;height:2rem;border-radius:50%;transition:.2s ease-in-out}.export__file[_ngcontent-%COMP%]   .export__file-btn[_ngcontent-%COMP%]:hover{background-color:#fff;transform:scale(1.15);cursor:pointer}.export__file[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]{display:none}.export__file[_ngcontent-%COMP%]   .export__file-options[_ngcontent-%COMP%]{position:absolute;right:0;width:12rem;border-radius:.5rem;overflow:hidden;text-align:center;opacity:0;transform:scale(.8);transform-origin:top right;box-shadow:0 .2rem .5rem #0004;transition:.2s}.export__file[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]:checked + .export__file-options[_ngcontent-%COMP%]{opacity:1;transform:scale(1);z-index:100}.export__file[_ngcontent-%COMP%]   .export__file-options[_ngcontent-%COMP%]   label[_ngcontent-%COMP%]{display:block;width:100%;padding:.6rem 0;background-color:#f2f2f2;display:flex;justify-content:space-around;align-items:center;transition:.2s ease-in-out}.export__file[_ngcontent-%COMP%]   .export__file-options[_ngcontent-%COMP%]   label[_ngcontent-%COMP%]:first-of-type{padding:1rem 0;background-color:#86e49d!important}.export__file[_ngcontent-%COMP%]   .export__file-options[_ngcontent-%COMP%]   label[_ngcontent-%COMP%]:hover{transform:scale(1.05);background-color:#fff;cursor:pointer}.export__file[_ngcontent-%COMP%]   .export__file-options[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{width:2rem;height:auto}",
            ],
          })),
          t
        );
      })();
      const jH = ["addListener", "removeListener"],
        $H = ["addEventListener", "removeEventListener"],
        UH = ["on", "off"];
      function fp(t, e, n, r) {
        if ((ne(n) && ((r = n), (n = void 0)), r))
          return fp(t, e, n).pipe(Eh(r));
        const [o, i] = (function GH(t) {
          return ne(t.addEventListener) && ne(t.removeEventListener);
        })(t)
          ? $H.map((s) => (a) => t[s](e, a, n))
          : (function zH(t) {
              return ne(t.addListener) && ne(t.removeListener);
            })(t)
          ? jH.map(o0(t, e))
          : (function qH(t) {
              return ne(t.on) && ne(t.off);
            })(t)
          ? UH.map(o0(t, e))
          : [];
        if (!o && sc(t)) return Ke((s) => fp(s, e, n))(Et(t));
        if (!o) throw new TypeError("Invalid event target");
        return new Ce((s) => {
          const a = (...l) => s.next(1 < l.length ? l : l[0]);
          return o(a), () => i(a);
        });
      }
      function o0(t, e) {
        return (n) => (r) => t[n](e, r);
      }
      let s0 = (() => {
          class t {
            constructor(n, r) {
              (this._renderer = n),
                (this._elementRef = r),
                (this.onChange = (o) => {}),
                (this.onTouched = () => {});
            }
            setProperty(n, r) {
              this._renderer.setProperty(this._elementRef.nativeElement, n, r);
            }
            registerOnTouched(n) {
              this.onTouched = n;
            }
            registerOnChange(n) {
              this.onChange = n;
            }
            setDisabledState(n) {
              this.setProperty("disabled", n);
            }
          }
          return (
            (t.ɵfac = function (n) {
              return new (n || t)(C(qn), C(Pt));
            }),
            (t.ɵdir = U({ type: t })),
            t
          );
        })(),
        Jr = (() => {
          class t extends s0 {}
          return (
            (t.ɵfac = (function () {
              let e;
              return function (r) {
                return (e || (e = Xe(t)))(r || t);
              };
            })()),
            (t.ɵdir = U({ type: t, features: [ce] })),
            t
          );
        })();
      const Rn = new O("NgValueAccessor"),
        QH = { provide: Rn, useExisting: he(() => Vs), multi: !0 },
        YH = new O("CompositionEventMode");
      let Vs = (() => {
        class t extends s0 {
          constructor(n, r, o) {
            super(n, r),
              (this._compositionMode = o),
              (this._composing = !1),
              null == this._compositionMode &&
                (this._compositionMode = !(function ZH() {
                  const t = gr() ? gr().getUserAgent() : "";
                  return /android (\d+)/.test(t.toLowerCase());
                })());
          }
          writeValue(n) {
            this.setProperty("value", n ?? "");
          }
          _handleInput(n) {
            (!this._compositionMode ||
              (this._compositionMode && !this._composing)) &&
              this.onChange(n);
          }
          _compositionStart() {
            this._composing = !0;
          }
          _compositionEnd(n) {
            (this._composing = !1), this._compositionMode && this.onChange(n);
          }
        }
        return (
          (t.ɵfac = function (n) {
            return new (n || t)(C(qn), C(Pt), C(YH, 8));
          }),
          (t.ɵdir = U({
            type: t,
            selectors: [
              ["input", "formControlName", "", 3, "type", "checkbox"],
              ["textarea", "formControlName", ""],
              ["input", "formControl", "", 3, "type", "checkbox"],
              ["textarea", "formControl", ""],
              ["input", "ngModel", "", 3, "type", "checkbox"],
              ["textarea", "ngModel", ""],
              ["", "ngDefaultControl", ""],
            ],
            hostBindings: function (n, r) {
              1 & n &&
                Ie("input", function (i) {
                  return r._handleInput(i.target.value);
                })("blur", function () {
                  return r.onTouched();
                })("compositionstart", function () {
                  return r._compositionStart();
                })("compositionend", function (i) {
                  return r._compositionEnd(i.target.value);
                });
            },
            features: [ve([QH]), ce],
          })),
          t
        );
      })();
      function Cr(t) {
        return (
          null == t ||
          (("string" == typeof t || Array.isArray(t)) && 0 === t.length)
        );
      }
      function l0(t) {
        return null != t && "number" == typeof t.length;
      }
      const it = new O("NgValidators"),
        Dr = new O("NgAsyncValidators"),
        XH =
          /^(?=.{1,254}$)(?=.{1,64}@)[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
      class yu {
        static min(e) {
          return (function u0(t) {
            return (e) => {
              if (Cr(e.value) || Cr(t)) return null;
              const n = parseFloat(e.value);
              return !isNaN(n) && n < t
                ? { min: { min: t, actual: e.value } }
                : null;
            };
          })(e);
        }
        static max(e) {
          return (function c0(t) {
            return (e) => {
              if (Cr(e.value) || Cr(t)) return null;
              const n = parseFloat(e.value);
              return !isNaN(n) && n > t
                ? { max: { max: t, actual: e.value } }
                : null;
            };
          })(e);
        }
        static required(e) {
          return (function d0(t) {
            return Cr(t.value) ? { required: !0 } : null;
          })(e);
        }
        static requiredTrue(e) {
          return (function f0(t) {
            return !0 === t.value ? null : { required: !0 };
          })(e);
        }
        static email(e) {
          return (function h0(t) {
            return Cr(t.value) || XH.test(t.value) ? null : { email: !0 };
          })(e);
        }
        static minLength(e) {
          return (function p0(t) {
            return (e) =>
              Cr(e.value) || !l0(e.value)
                ? null
                : e.value.length < t
                ? {
                    minlength: {
                      requiredLength: t,
                      actualLength: e.value.length,
                    },
                  }
                : null;
          })(e);
        }
        static maxLength(e) {
          return (function g0(t) {
            return (e) =>
              l0(e.value) && e.value.length > t
                ? {
                    maxlength: {
                      requiredLength: t,
                      actualLength: e.value.length,
                    },
                  }
                : null;
          })(e);
        }
        static pattern(e) {
          return (function m0(t) {
            if (!t) return vu;
            let e, n;
            return (
              "string" == typeof t
                ? ((n = ""),
                  "^" !== t.charAt(0) && (n += "^"),
                  (n += t),
                  "$" !== t.charAt(t.length - 1) && (n += "$"),
                  (e = new RegExp(n)))
                : ((n = t.toString()), (e = t)),
              (r) => {
                if (Cr(r.value)) return null;
                const o = r.value;
                return e.test(o)
                  ? null
                  : { pattern: { requiredPattern: n, actualValue: o } };
              }
            );
          })(e);
        }
        static nullValidator(e) {
          return null;
        }
        static compose(e) {
          return w0(e);
        }
        static composeAsync(e) {
          return b0(e);
        }
      }
      function vu(t) {
        return null;
      }
      function y0(t) {
        return null != t;
      }
      function v0(t) {
        return rs(t) ? je(t) : t;
      }
      function _0(t) {
        let e = {};
        return (
          t.forEach((n) => {
            e = null != n ? { ...e, ...n } : e;
          }),
          0 === Object.keys(e).length ? null : e
        );
      }
      function C0(t, e) {
        return e.map((n) => n(t));
      }
      function D0(t) {
        return t.map((e) =>
          (function JH(t) {
            return !t.validate;
          })(e)
            ? e
            : (n) => e.validate(n)
        );
      }
      function w0(t) {
        if (!t) return null;
        const e = t.filter(y0);
        return 0 == e.length
          ? null
          : function (n) {
              return _0(C0(n, e));
            };
      }
      function hp(t) {
        return null != t ? w0(D0(t)) : null;
      }
      function b0(t) {
        if (!t) return null;
        const e = t.filter(y0);
        return 0 == e.length
          ? null
          : function (n) {
              return (function WH(...t) {
                const e = Og(t),
                  { args: n, keys: r } = cb(t),
                  o = new Ce((i) => {
                    const { length: s } = n;
                    if (!s) return void i.complete();
                    const a = new Array(s);
                    let l = s,
                      u = s;
                    for (let c = 0; c < s; c++) {
                      let d = !1;
                      Et(n[c]).subscribe(
                        He(
                          i,
                          (f) => {
                            d || ((d = !0), u--), (a[c] = f);
                          },
                          () => l--,
                          void 0,
                          () => {
                            (!l || !d) &&
                              (u || i.next(r ? db(r, a) : a), i.complete());
                          }
                        )
                      );
                    }
                  });
                return e ? o.pipe(Eh(e)) : o;
              })(C0(n, e).map(v0)).pipe(oe(_0));
            };
      }
      function pp(t) {
        return null != t ? b0(D0(t)) : null;
      }
      function E0(t, e) {
        return null === t ? [e] : Array.isArray(t) ? [...t, e] : [t, e];
      }
      function S0(t) {
        return t._rawValidators;
      }
      function M0(t) {
        return t._rawAsyncValidators;
      }
      function gp(t) {
        return t ? (Array.isArray(t) ? t : [t]) : [];
      }
      function _u(t, e) {
        return Array.isArray(t) ? t.includes(e) : t === e;
      }
      function T0(t, e) {
        const n = gp(e);
        return (
          gp(t).forEach((o) => {
            _u(n, o) || n.push(o);
          }),
          n
        );
      }
      function A0(t, e) {
        return gp(e).filter((n) => !_u(t, n));
      }
      class I0 {
        constructor() {
          (this._rawValidators = []),
            (this._rawAsyncValidators = []),
            (this._onDestroyCallbacks = []);
        }
        get value() {
          return this.control ? this.control.value : null;
        }
        get valid() {
          return this.control ? this.control.valid : null;
        }
        get invalid() {
          return this.control ? this.control.invalid : null;
        }
        get pending() {
          return this.control ? this.control.pending : null;
        }
        get disabled() {
          return this.control ? this.control.disabled : null;
        }
        get enabled() {
          return this.control ? this.control.enabled : null;
        }
        get errors() {
          return this.control ? this.control.errors : null;
        }
        get pristine() {
          return this.control ? this.control.pristine : null;
        }
        get dirty() {
          return this.control ? this.control.dirty : null;
        }
        get touched() {
          return this.control ? this.control.touched : null;
        }
        get status() {
          return this.control ? this.control.status : null;
        }
        get untouched() {
          return this.control ? this.control.untouched : null;
        }
        get statusChanges() {
          return this.control ? this.control.statusChanges : null;
        }
        get valueChanges() {
          return this.control ? this.control.valueChanges : null;
        }
        get path() {
          return null;
        }
        _setValidators(e) {
          (this._rawValidators = e || []),
            (this._composedValidatorFn = hp(this._rawValidators));
        }
        _setAsyncValidators(e) {
          (this._rawAsyncValidators = e || []),
            (this._composedAsyncValidatorFn = pp(this._rawAsyncValidators));
        }
        get validator() {
          return this._composedValidatorFn || null;
        }
        get asyncValidator() {
          return this._composedAsyncValidatorFn || null;
        }
        _registerOnDestroy(e) {
          this._onDestroyCallbacks.push(e);
        }
        _invokeOnDestroyCallbacks() {
          this._onDestroyCallbacks.forEach((e) => e()),
            (this._onDestroyCallbacks = []);
        }
        reset(e = void 0) {
          this.control && this.control.reset(e);
        }
        hasError(e, n) {
          return !!this.control && this.control.hasError(e, n);
        }
        getError(e, n) {
          return this.control ? this.control.getError(e, n) : null;
        }
      }
      class ht extends I0 {
        get formDirective() {
          return null;
        }
        get path() {
          return null;
        }
      }
      class wr extends I0 {
        constructor() {
          super(...arguments),
            (this._parent = null),
            (this.name = null),
            (this.valueAccessor = null);
        }
      }
      class O0 {
        constructor(e) {
          this._cd = e;
        }
        get isTouched() {
          return !!this._cd?.control?.touched;
        }
        get isUntouched() {
          return !!this._cd?.control?.untouched;
        }
        get isPristine() {
          return !!this._cd?.control?.pristine;
        }
        get isDirty() {
          return !!this._cd?.control?.dirty;
        }
        get isValid() {
          return !!this._cd?.control?.valid;
        }
        get isInvalid() {
          return !!this._cd?.control?.invalid;
        }
        get isPending() {
          return !!this._cd?.control?.pending;
        }
        get isSubmitted() {
          return !!this._cd?.submitted;
        }
      }
      let mp = (() => {
          class t extends O0 {
            constructor(n) {
              super(n);
            }
          }
          return (
            (t.ɵfac = function (n) {
              return new (n || t)(C(wr, 2));
            }),
            (t.ɵdir = U({
              type: t,
              selectors: [
                ["", "formControlName", ""],
                ["", "ngModel", ""],
                ["", "formControl", ""],
              ],
              hostVars: 14,
              hostBindings: function (n, r) {
                2 & n &&
                  dl("ng-untouched", r.isUntouched)("ng-touched", r.isTouched)(
                    "ng-pristine",
                    r.isPristine
                  )("ng-dirty", r.isDirty)("ng-valid", r.isValid)(
                    "ng-invalid",
                    r.isInvalid
                  )("ng-pending", r.isPending);
              },
              features: [ce],
            })),
            t
          );
        })(),
        P0 = (() => {
          class t extends O0 {
            constructor(n) {
              super(n);
            }
          }
          return (
            (t.ɵfac = function (n) {
              return new (n || t)(C(ht, 10));
            }),
            (t.ɵdir = U({
              type: t,
              selectors: [
                ["", "formGroupName", ""],
                ["", "formArrayName", ""],
                ["", "ngModelGroup", ""],
                ["", "formGroup", ""],
                ["form", 3, "ngNoForm", ""],
                ["", "ngForm", ""],
              ],
              hostVars: 16,
              hostBindings: function (n, r) {
                2 & n &&
                  dl("ng-untouched", r.isUntouched)("ng-touched", r.isTouched)(
                    "ng-pristine",
                    r.isPristine
                  )("ng-dirty", r.isDirty)("ng-valid", r.isValid)(
                    "ng-invalid",
                    r.isInvalid
                  )("ng-pending", r.isPending)("ng-submitted", r.isSubmitted);
              },
              features: [ce],
            })),
            t
          );
        })();
      const Bs = "VALID",
        Du = "INVALID",
        fi = "PENDING",
        Hs = "DISABLED";
      function _p(t) {
        return (wu(t) ? t.validators : t) || null;
      }
      function Cp(t, e) {
        return (wu(e) ? e.asyncValidators : t) || null;
      }
      function wu(t) {
        return null != t && !Array.isArray(t) && "object" == typeof t;
      }
      function x0(t, e, n) {
        const r = t.controls;
        if (!(e ? Object.keys(r) : r).length) throw new v(1e3, "");
        if (!r[n]) throw new v(1001, "");
      }
      function R0(t, e, n) {
        t._forEachChild((r, o) => {
          if (void 0 === n[o]) throw new v(1002, "");
        });
      }
      class bu {
        constructor(e, n) {
          (this._pendingDirty = !1),
            (this._hasOwnPendingAsyncValidator = !1),
            (this._pendingTouched = !1),
            (this._onCollectionChange = () => {}),
            (this._parent = null),
            (this.pristine = !0),
            (this.touched = !1),
            (this._onDisabledChange = []),
            this._assignValidators(e),
            this._assignAsyncValidators(n);
        }
        get validator() {
          return this._composedValidatorFn;
        }
        set validator(e) {
          this._rawValidators = this._composedValidatorFn = e;
        }
        get asyncValidator() {
          return this._composedAsyncValidatorFn;
        }
        set asyncValidator(e) {
          this._rawAsyncValidators = this._composedAsyncValidatorFn = e;
        }
        get parent() {
          return this._parent;
        }
        get valid() {
          return this.status === Bs;
        }
        get invalid() {
          return this.status === Du;
        }
        get pending() {
          return this.status == fi;
        }
        get disabled() {
          return this.status === Hs;
        }
        get enabled() {
          return this.status !== Hs;
        }
        get dirty() {
          return !this.pristine;
        }
        get untouched() {
          return !this.touched;
        }
        get updateOn() {
          return this._updateOn
            ? this._updateOn
            : this.parent
            ? this.parent.updateOn
            : "change";
        }
        setValidators(e) {
          this._assignValidators(e);
        }
        setAsyncValidators(e) {
          this._assignAsyncValidators(e);
        }
        addValidators(e) {
          this.setValidators(T0(e, this._rawValidators));
        }
        addAsyncValidators(e) {
          this.setAsyncValidators(T0(e, this._rawAsyncValidators));
        }
        removeValidators(e) {
          this.setValidators(A0(e, this._rawValidators));
        }
        removeAsyncValidators(e) {
          this.setAsyncValidators(A0(e, this._rawAsyncValidators));
        }
        hasValidator(e) {
          return _u(this._rawValidators, e);
        }
        hasAsyncValidator(e) {
          return _u(this._rawAsyncValidators, e);
        }
        clearValidators() {
          this.validator = null;
        }
        clearAsyncValidators() {
          this.asyncValidator = null;
        }
        markAsTouched(e = {}) {
          (this.touched = !0),
            this._parent && !e.onlySelf && this._parent.markAsTouched(e);
        }
        markAllAsTouched() {
          this.markAsTouched({ onlySelf: !0 }),
            this._forEachChild((e) => e.markAllAsTouched());
        }
        markAsUntouched(e = {}) {
          (this.touched = !1),
            (this._pendingTouched = !1),
            this._forEachChild((n) => {
              n.markAsUntouched({ onlySelf: !0 });
            }),
            this._parent && !e.onlySelf && this._parent._updateTouched(e);
        }
        markAsDirty(e = {}) {
          (this.pristine = !1),
            this._parent && !e.onlySelf && this._parent.markAsDirty(e);
        }
        markAsPristine(e = {}) {
          (this.pristine = !0),
            (this._pendingDirty = !1),
            this._forEachChild((n) => {
              n.markAsPristine({ onlySelf: !0 });
            }),
            this._parent && !e.onlySelf && this._parent._updatePristine(e);
        }
        markAsPending(e = {}) {
          (this.status = fi),
            !1 !== e.emitEvent && this.statusChanges.emit(this.status),
            this._parent && !e.onlySelf && this._parent.markAsPending(e);
        }
        disable(e = {}) {
          const n = this._parentMarkedDirty(e.onlySelf);
          (this.status = Hs),
            (this.errors = null),
            this._forEachChild((r) => {
              r.disable({ ...e, onlySelf: !0 });
            }),
            this._updateValue(),
            !1 !== e.emitEvent &&
              (this.valueChanges.emit(this.value),
              this.statusChanges.emit(this.status)),
            this._updateAncestors({ ...e, skipPristineCheck: n }),
            this._onDisabledChange.forEach((r) => r(!0));
        }
        enable(e = {}) {
          const n = this._parentMarkedDirty(e.onlySelf);
          (this.status = Bs),
            this._forEachChild((r) => {
              r.enable({ ...e, onlySelf: !0 });
            }),
            this.updateValueAndValidity({
              onlySelf: !0,
              emitEvent: e.emitEvent,
            }),
            this._updateAncestors({ ...e, skipPristineCheck: n }),
            this._onDisabledChange.forEach((r) => r(!1));
        }
        _updateAncestors(e) {
          this._parent &&
            !e.onlySelf &&
            (this._parent.updateValueAndValidity(e),
            e.skipPristineCheck || this._parent._updatePristine(),
            this._parent._updateTouched());
        }
        setParent(e) {
          this._parent = e;
        }
        getRawValue() {
          return this.value;
        }
        updateValueAndValidity(e = {}) {
          this._setInitialStatus(),
            this._updateValue(),
            this.enabled &&
              (this._cancelExistingSubscription(),
              (this.errors = this._runValidator()),
              (this.status = this._calculateStatus()),
              (this.status === Bs || this.status === fi) &&
                this._runAsyncValidator(e.emitEvent)),
            !1 !== e.emitEvent &&
              (this.valueChanges.emit(this.value),
              this.statusChanges.emit(this.status)),
            this._parent &&
              !e.onlySelf &&
              this._parent.updateValueAndValidity(e);
        }
        _updateTreeValidity(e = { emitEvent: !0 }) {
          this._forEachChild((n) => n._updateTreeValidity(e)),
            this.updateValueAndValidity({
              onlySelf: !0,
              emitEvent: e.emitEvent,
            });
        }
        _setInitialStatus() {
          this.status = this._allControlsDisabled() ? Hs : Bs;
        }
        _runValidator() {
          return this.validator ? this.validator(this) : null;
        }
        _runAsyncValidator(e) {
          if (this.asyncValidator) {
            (this.status = fi), (this._hasOwnPendingAsyncValidator = !0);
            const n = v0(this.asyncValidator(this));
            this._asyncValidationSubscription = n.subscribe((r) => {
              (this._hasOwnPendingAsyncValidator = !1),
                this.setErrors(r, { emitEvent: e });
            });
          }
        }
        _cancelExistingSubscription() {
          this._asyncValidationSubscription &&
            (this._asyncValidationSubscription.unsubscribe(),
            (this._hasOwnPendingAsyncValidator = !1));
        }
        setErrors(e, n = {}) {
          (this.errors = e), this._updateControlsErrors(!1 !== n.emitEvent);
        }
        get(e) {
          let n = e;
          return null == n ||
            (Array.isArray(n) || (n = n.split(".")), 0 === n.length)
            ? null
            : n.reduce((r, o) => r && r._find(o), this);
        }
        getError(e, n) {
          const r = n ? this.get(n) : this;
          return r && r.errors ? r.errors[e] : null;
        }
        hasError(e, n) {
          return !!this.getError(e, n);
        }
        get root() {
          let e = this;
          for (; e._parent; ) e = e._parent;
          return e;
        }
        _updateControlsErrors(e) {
          (this.status = this._calculateStatus()),
            e && this.statusChanges.emit(this.status),
            this._parent && this._parent._updateControlsErrors(e);
        }
        _initObservables() {
          (this.valueChanges = new Te()), (this.statusChanges = new Te());
        }
        _calculateStatus() {
          return this._allControlsDisabled()
            ? Hs
            : this.errors
            ? Du
            : this._hasOwnPendingAsyncValidator ||
              this._anyControlsHaveStatus(fi)
            ? fi
            : this._anyControlsHaveStatus(Du)
            ? Du
            : Bs;
        }
        _anyControlsHaveStatus(e) {
          return this._anyControls((n) => n.status === e);
        }
        _anyControlsDirty() {
          return this._anyControls((e) => e.dirty);
        }
        _anyControlsTouched() {
          return this._anyControls((e) => e.touched);
        }
        _updatePristine(e = {}) {
          (this.pristine = !this._anyControlsDirty()),
            this._parent && !e.onlySelf && this._parent._updatePristine(e);
        }
        _updateTouched(e = {}) {
          (this.touched = this._anyControlsTouched()),
            this._parent && !e.onlySelf && this._parent._updateTouched(e);
        }
        _registerOnCollectionChange(e) {
          this._onCollectionChange = e;
        }
        _setUpdateStrategy(e) {
          wu(e) && null != e.updateOn && (this._updateOn = e.updateOn);
        }
        _parentMarkedDirty(e) {
          return (
            !e &&
            !(!this._parent || !this._parent.dirty) &&
            !this._parent._anyControlsDirty()
          );
        }
        _find(e) {
          return null;
        }
        _assignValidators(e) {
          (this._rawValidators = Array.isArray(e) ? e.slice() : e),
            (this._composedValidatorFn = (function rj(t) {
              return Array.isArray(t) ? hp(t) : t || null;
            })(this._rawValidators));
        }
        _assignAsyncValidators(e) {
          (this._rawAsyncValidators = Array.isArray(e) ? e.slice() : e),
            (this._composedAsyncValidatorFn = (function oj(t) {
              return Array.isArray(t) ? pp(t) : t || null;
            })(this._rawAsyncValidators));
        }
      }
      class js extends bu {
        constructor(e, n, r) {
          super(_p(n), Cp(r, n)),
            (this.controls = e),
            this._initObservables(),
            this._setUpdateStrategy(n),
            this._setUpControls(),
            this.updateValueAndValidity({
              onlySelf: !0,
              emitEvent: !!this.asyncValidator,
            });
        }
        registerControl(e, n) {
          return this.controls[e]
            ? this.controls[e]
            : ((this.controls[e] = n),
              n.setParent(this),
              n._registerOnCollectionChange(this._onCollectionChange),
              n);
        }
        addControl(e, n, r = {}) {
          this.registerControl(e, n),
            this.updateValueAndValidity({ emitEvent: r.emitEvent }),
            this._onCollectionChange();
        }
        removeControl(e, n = {}) {
          this.controls[e] &&
            this.controls[e]._registerOnCollectionChange(() => {}),
            delete this.controls[e],
            this.updateValueAndValidity({ emitEvent: n.emitEvent }),
            this._onCollectionChange();
        }
        setControl(e, n, r = {}) {
          this.controls[e] &&
            this.controls[e]._registerOnCollectionChange(() => {}),
            delete this.controls[e],
            n && this.registerControl(e, n),
            this.updateValueAndValidity({ emitEvent: r.emitEvent }),
            this._onCollectionChange();
        }
        contains(e) {
          return this.controls.hasOwnProperty(e) && this.controls[e].enabled;
        }
        setValue(e, n = {}) {
          R0(this, 0, e),
            Object.keys(e).forEach((r) => {
              x0(this, !0, r),
                this.controls[r].setValue(e[r], {
                  onlySelf: !0,
                  emitEvent: n.emitEvent,
                });
            }),
            this.updateValueAndValidity(n);
        }
        patchValue(e, n = {}) {
          null != e &&
            (Object.keys(e).forEach((r) => {
              const o = this.controls[r];
              o && o.patchValue(e[r], { onlySelf: !0, emitEvent: n.emitEvent });
            }),
            this.updateValueAndValidity(n));
        }
        reset(e = {}, n = {}) {
          this._forEachChild((r, o) => {
            r.reset(e[o], { onlySelf: !0, emitEvent: n.emitEvent });
          }),
            this._updatePristine(n),
            this._updateTouched(n),
            this.updateValueAndValidity(n);
        }
        getRawValue() {
          return this._reduceChildren(
            {},
            (e, n, r) => ((e[r] = n.getRawValue()), e)
          );
        }
        _syncPendingControls() {
          let e = this._reduceChildren(
            !1,
            (n, r) => !!r._syncPendingControls() || n
          );
          return e && this.updateValueAndValidity({ onlySelf: !0 }), e;
        }
        _forEachChild(e) {
          Object.keys(this.controls).forEach((n) => {
            const r = this.controls[n];
            r && e(r, n);
          });
        }
        _setUpControls() {
          this._forEachChild((e) => {
            e.setParent(this),
              e._registerOnCollectionChange(this._onCollectionChange);
          });
        }
        _updateValue() {
          this.value = this._reduceValue();
        }
        _anyControls(e) {
          for (const [n, r] of Object.entries(this.controls))
            if (this.contains(n) && e(r)) return !0;
          return !1;
        }
        _reduceValue() {
          return this._reduceChildren(
            {},
            (n, r, o) => ((r.enabled || this.disabled) && (n[o] = r.value), n)
          );
        }
        _reduceChildren(e, n) {
          let r = e;
          return (
            this._forEachChild((o, i) => {
              r = n(r, o, i);
            }),
            r
          );
        }
        _allControlsDisabled() {
          for (const e of Object.keys(this.controls))
            if (this.controls[e].enabled) return !1;
          return Object.keys(this.controls).length > 0 || this.disabled;
        }
        _find(e) {
          return this.controls.hasOwnProperty(e) ? this.controls[e] : null;
        }
      }
      class F0 extends js {}
      const eo = new O("CallSetDisabledState", {
          providedIn: "root",
          factory: () => $s,
        }),
        $s = "always";
      function Eu(t, e) {
        return [...e.path, t];
      }
      function Us(t, e, n = $s) {
        Dp(t, e),
          e.valueAccessor.writeValue(t.value),
          (t.disabled || "always" === n) &&
            e.valueAccessor.setDisabledState?.(t.disabled),
          (function sj(t, e) {
            e.valueAccessor.registerOnChange((n) => {
              (t._pendingValue = n),
                (t._pendingChange = !0),
                (t._pendingDirty = !0),
                "change" === t.updateOn && k0(t, e);
            });
          })(t, e),
          (function lj(t, e) {
            const n = (r, o) => {
              e.valueAccessor.writeValue(r), o && e.viewToModelUpdate(r);
            };
            t.registerOnChange(n),
              e._registerOnDestroy(() => {
                t._unregisterOnChange(n);
              });
          })(t, e),
          (function aj(t, e) {
            e.valueAccessor.registerOnTouched(() => {
              (t._pendingTouched = !0),
                "blur" === t.updateOn && t._pendingChange && k0(t, e),
                "submit" !== t.updateOn && t.markAsTouched();
            });
          })(t, e),
          (function ij(t, e) {
            if (e.valueAccessor.setDisabledState) {
              const n = (r) => {
                e.valueAccessor.setDisabledState(r);
              };
              t.registerOnDisabledChange(n),
                e._registerOnDestroy(() => {
                  t._unregisterOnDisabledChange(n);
                });
            }
          })(t, e);
      }
      function Su(t, e, n = !0) {
        const r = () => {};
        e.valueAccessor &&
          (e.valueAccessor.registerOnChange(r),
          e.valueAccessor.registerOnTouched(r)),
          Tu(t, e),
          t &&
            (e._invokeOnDestroyCallbacks(),
            t._registerOnCollectionChange(() => {}));
      }
      function Mu(t, e) {
        t.forEach((n) => {
          n.registerOnValidatorChange && n.registerOnValidatorChange(e);
        });
      }
      function Dp(t, e) {
        const n = S0(t);
        null !== e.validator
          ? t.setValidators(E0(n, e.validator))
          : "function" == typeof n && t.setValidators([n]);
        const r = M0(t);
        null !== e.asyncValidator
          ? t.setAsyncValidators(E0(r, e.asyncValidator))
          : "function" == typeof r && t.setAsyncValidators([r]);
        const o = () => t.updateValueAndValidity();
        Mu(e._rawValidators, o), Mu(e._rawAsyncValidators, o);
      }
      function Tu(t, e) {
        let n = !1;
        if (null !== t) {
          if (null !== e.validator) {
            const o = S0(t);
            if (Array.isArray(o) && o.length > 0) {
              const i = o.filter((s) => s !== e.validator);
              i.length !== o.length && ((n = !0), t.setValidators(i));
            }
          }
          if (null !== e.asyncValidator) {
            const o = M0(t);
            if (Array.isArray(o) && o.length > 0) {
              const i = o.filter((s) => s !== e.asyncValidator);
              i.length !== o.length && ((n = !0), t.setAsyncValidators(i));
            }
          }
        }
        const r = () => {};
        return Mu(e._rawValidators, r), Mu(e._rawAsyncValidators, r), n;
      }
      function k0(t, e) {
        t._pendingDirty && t.markAsDirty(),
          t.setValue(t._pendingValue, { emitModelToViewChange: !1 }),
          e.viewToModelUpdate(t._pendingValue),
          (t._pendingChange = !1);
      }
      function bp(t, e) {
        if (!t.hasOwnProperty("model")) return !1;
        const n = t.model;
        return !!n.isFirstChange() || !Object.is(e, n.currentValue);
      }
      function Ep(t, e) {
        if (!e) return null;
        let n, r, o;
        return (
          Array.isArray(e),
          e.forEach((i) => {
            i.constructor === Vs
              ? (n = i)
              : (function dj(t) {
                  return Object.getPrototypeOf(t.constructor) === Jr;
                })(i)
              ? (r = i)
              : (o = i);
          }),
          o || r || n || null
        );
      }
      function B0(t, e) {
        const n = t.indexOf(e);
        n > -1 && t.splice(n, 1);
      }
      function H0(t) {
        return (
          "object" == typeof t &&
          null !== t &&
          2 === Object.keys(t).length &&
          "value" in t &&
          "disabled" in t
        );
      }
      const to = class extends bu {
          constructor(e = null, n, r) {
            super(_p(n), Cp(r, n)),
              (this.defaultValue = null),
              (this._onChange = []),
              (this._pendingChange = !1),
              this._applyFormState(e),
              this._setUpdateStrategy(n),
              this._initObservables(),
              this.updateValueAndValidity({
                onlySelf: !0,
                emitEvent: !!this.asyncValidator,
              }),
              wu(n) &&
                (n.nonNullable || n.initialValueIsDefault) &&
                (this.defaultValue = H0(e) ? e.value : e);
          }
          setValue(e, n = {}) {
            (this.value = this._pendingValue = e),
              this._onChange.length &&
                !1 !== n.emitModelToViewChange &&
                this._onChange.forEach((r) =>
                  r(this.value, !1 !== n.emitViewToModelChange)
                ),
              this.updateValueAndValidity(n);
          }
          patchValue(e, n = {}) {
            this.setValue(e, n);
          }
          reset(e = this.defaultValue, n = {}) {
            this._applyFormState(e),
              this.markAsPristine(n),
              this.markAsUntouched(n),
              this.setValue(this.value, n),
              (this._pendingChange = !1);
          }
          _updateValue() {}
          _anyControls(e) {
            return !1;
          }
          _allControlsDisabled() {
            return this.disabled;
          }
          registerOnChange(e) {
            this._onChange.push(e);
          }
          _unregisterOnChange(e) {
            B0(this._onChange, e);
          }
          registerOnDisabledChange(e) {
            this._onDisabledChange.push(e);
          }
          _unregisterOnDisabledChange(e) {
            B0(this._onDisabledChange, e);
          }
          _forEachChild(e) {}
          _syncPendingControls() {
            return !(
              "submit" !== this.updateOn ||
              (this._pendingDirty && this.markAsDirty(),
              this._pendingTouched && this.markAsTouched(),
              !this._pendingChange) ||
              (this.setValue(this._pendingValue, {
                onlySelf: !0,
                emitModelToViewChange: !1,
              }),
              0)
            );
          }
          _applyFormState(e) {
            H0(e)
              ? ((this.value = this._pendingValue = e.value),
                e.disabled
                  ? this.disable({ onlySelf: !0, emitEvent: !1 })
                  : this.enable({ onlySelf: !0, emitEvent: !1 }))
              : (this.value = this._pendingValue = e);
          }
        },
        mj = { provide: wr, useExisting: he(() => Mp) },
        U0 = (() => Promise.resolve())();
      let Mp = (() => {
          class t extends wr {
            constructor(n, r, o, i, s, a) {
              super(),
                (this._changeDetectorRef = s),
                (this.callSetDisabledState = a),
                (this.control = new to()),
                (this._registered = !1),
                (this.name = ""),
                (this.update = new Te()),
                (this._parent = n),
                this._setValidators(r),
                this._setAsyncValidators(o),
                (this.valueAccessor = Ep(0, i));
            }
            ngOnChanges(n) {
              if ((this._checkForErrors(), !this._registered || "name" in n)) {
                if (
                  this._registered &&
                  (this._checkName(), this.formDirective)
                ) {
                  const r = n.name.previousValue;
                  this.formDirective.removeControl({
                    name: r,
                    path: this._getPath(r),
                  });
                }
                this._setUpControl();
              }
              "isDisabled" in n && this._updateDisabled(n),
                bp(n, this.viewModel) &&
                  (this._updateValue(this.model),
                  (this.viewModel = this.model));
            }
            ngOnDestroy() {
              this.formDirective && this.formDirective.removeControl(this);
            }
            get path() {
              return this._getPath(this.name);
            }
            get formDirective() {
              return this._parent ? this._parent.formDirective : null;
            }
            viewToModelUpdate(n) {
              (this.viewModel = n), this.update.emit(n);
            }
            _setUpControl() {
              this._setUpdateStrategy(),
                this._isStandalone()
                  ? this._setUpStandalone()
                  : this.formDirective.addControl(this),
                (this._registered = !0);
            }
            _setUpdateStrategy() {
              this.options &&
                null != this.options.updateOn &&
                (this.control._updateOn = this.options.updateOn);
            }
            _isStandalone() {
              return (
                !this._parent || !(!this.options || !this.options.standalone)
              );
            }
            _setUpStandalone() {
              Us(this.control, this, this.callSetDisabledState),
                this.control.updateValueAndValidity({ emitEvent: !1 });
            }
            _checkForErrors() {
              this._isStandalone() || this._checkParentType(),
                this._checkName();
            }
            _checkParentType() {}
            _checkName() {
              this.options &&
                this.options.name &&
                (this.name = this.options.name),
                this._isStandalone();
            }
            _updateValue(n) {
              U0.then(() => {
                this.control.setValue(n, { emitViewToModelChange: !1 }),
                  this._changeDetectorRef?.markForCheck();
              });
            }
            _updateDisabled(n) {
              const r = n.isDisabled.currentValue,
                o = 0 !== r && Yo(r);
              U0.then(() => {
                o && !this.control.disabled
                  ? this.control.disable()
                  : !o && this.control.disabled && this.control.enable(),
                  this._changeDetectorRef?.markForCheck();
              });
            }
            _getPath(n) {
              return this._parent ? Eu(n, this._parent) : [n];
            }
          }
          return (
            (t.ɵfac = function (n) {
              return new (n || t)(
                C(ht, 9),
                C(it, 10),
                C(Dr, 10),
                C(Rn, 10),
                C(wl, 8),
                C(eo, 8)
              );
            }),
            (t.ɵdir = U({
              type: t,
              selectors: [
                [
                  "",
                  "ngModel",
                  "",
                  3,
                  "formControlName",
                  "",
                  3,
                  "formControl",
                  "",
                ],
              ],
              inputs: {
                name: "name",
                isDisabled: ["disabled", "isDisabled"],
                model: ["ngModel", "model"],
                options: ["ngModelOptions", "options"],
              },
              outputs: { update: "ngModelChange" },
              exportAs: ["ngModel"],
              features: [ve([mj]), ce, jt],
            })),
            t
          );
        })(),
        z0 = (() => {
          class t {}
          return (
            (t.ɵfac = function (n) {
              return new (n || t)();
            }),
            (t.ɵdir = U({
              type: t,
              selectors: [
                ["form", 3, "ngNoForm", "", 3, "ngNativeValidate", ""],
              ],
              hostAttrs: ["novalidate", ""],
            })),
            t
          );
        })(),
        G0 = (() => {
          class t {}
          return (
            (t.ɵfac = function (n) {
              return new (n || t)();
            }),
            (t.ɵmod = Mt({ type: t })),
            (t.ɵinj = pt({})),
            t
          );
        })();
      const Tp = new O("NgModelWithFormControlWarning"),
        wj = { provide: ht, useExisting: he(() => Au) };
      let Au = (() => {
        class t extends ht {
          constructor(n, r, o) {
            super(),
              (this.callSetDisabledState = o),
              (this.submitted = !1),
              (this._onCollectionChange = () => this._updateDomValue()),
              (this.directives = []),
              (this.form = null),
              (this.ngSubmit = new Te()),
              this._setValidators(n),
              this._setAsyncValidators(r);
          }
          ngOnChanges(n) {
            this._checkFormPresent(),
              n.hasOwnProperty("form") &&
                (this._updateValidators(),
                this._updateDomValue(),
                this._updateRegistrations(),
                (this._oldForm = this.form));
          }
          ngOnDestroy() {
            this.form &&
              (Tu(this.form, this),
              this.form._onCollectionChange === this._onCollectionChange &&
                this.form._registerOnCollectionChange(() => {}));
          }
          get formDirective() {
            return this;
          }
          get control() {
            return this.form;
          }
          get path() {
            return [];
          }
          addControl(n) {
            const r = this.form.get(n.path);
            return (
              Us(r, n, this.callSetDisabledState),
              r.updateValueAndValidity({ emitEvent: !1 }),
              this.directives.push(n),
              r
            );
          }
          getControl(n) {
            return this.form.get(n.path);
          }
          removeControl(n) {
            Su(n.control || null, n, !1),
              (function fj(t, e) {
                const n = t.indexOf(e);
                n > -1 && t.splice(n, 1);
              })(this.directives, n);
          }
          addFormGroup(n) {
            this._setUpFormContainer(n);
          }
          removeFormGroup(n) {
            this._cleanUpFormContainer(n);
          }
          getFormGroup(n) {
            return this.form.get(n.path);
          }
          addFormArray(n) {
            this._setUpFormContainer(n);
          }
          removeFormArray(n) {
            this._cleanUpFormContainer(n);
          }
          getFormArray(n) {
            return this.form.get(n.path);
          }
          updateModel(n, r) {
            this.form.get(n.path).setValue(r);
          }
          onSubmit(n) {
            return (
              (this.submitted = !0),
              (function V0(t, e) {
                t._syncPendingControls(),
                  e.forEach((n) => {
                    const r = n.control;
                    "submit" === r.updateOn &&
                      r._pendingChange &&
                      (n.viewToModelUpdate(r._pendingValue),
                      (r._pendingChange = !1));
                  });
              })(this.form, this.directives),
              this.ngSubmit.emit(n),
              "dialog" === n?.target?.method
            );
          }
          onReset() {
            this.resetForm();
          }
          resetForm(n = void 0) {
            this.form.reset(n), (this.submitted = !1);
          }
          _updateDomValue() {
            this.directives.forEach((n) => {
              const r = n.control,
                o = this.form.get(n.path);
              r !== o &&
                (Su(r || null, n),
                ((t) => t instanceof to)(o) &&
                  (Us(o, n, this.callSetDisabledState), (n.control = o)));
            }),
              this.form._updateTreeValidity({ emitEvent: !1 });
          }
          _setUpFormContainer(n) {
            const r = this.form.get(n.path);
            (function L0(t, e) {
              Dp(t, e);
            })(r, n),
              r.updateValueAndValidity({ emitEvent: !1 });
          }
          _cleanUpFormContainer(n) {
            if (this.form) {
              const r = this.form.get(n.path);
              r &&
                (function uj(t, e) {
                  return Tu(t, e);
                })(r, n) &&
                r.updateValueAndValidity({ emitEvent: !1 });
            }
          }
          _updateRegistrations() {
            this.form._registerOnCollectionChange(this._onCollectionChange),
              this._oldForm &&
                this._oldForm._registerOnCollectionChange(() => {});
          }
          _updateValidators() {
            Dp(this.form, this), this._oldForm && Tu(this._oldForm, this);
          }
          _checkFormPresent() {}
        }
        return (
          (t.ɵfac = function (n) {
            return new (n || t)(C(it, 10), C(Dr, 10), C(eo, 8));
          }),
          (t.ɵdir = U({
            type: t,
            selectors: [["", "formGroup", ""]],
            hostBindings: function (n, r) {
              1 & n &&
                Ie("submit", function (i) {
                  return r.onSubmit(i);
                })("reset", function () {
                  return r.onReset();
                });
            },
            inputs: { form: ["formGroup", "form"] },
            outputs: { ngSubmit: "ngSubmit" },
            exportAs: ["ngForm"],
            features: [ve([wj]), ce, jt],
          })),
          t
        );
      })();
      const Sj = { provide: wr, useExisting: he(() => Op) };
      let Op = (() => {
          class t extends wr {
            set isDisabled(n) {}
            constructor(n, r, o, i, s) {
              super(),
                (this._ngModelWarningConfig = s),
                (this._added = !1),
                (this.name = null),
                (this.update = new Te()),
                (this._ngModelWarningSent = !1),
                (this._parent = n),
                this._setValidators(r),
                this._setAsyncValidators(o),
                (this.valueAccessor = Ep(0, i));
            }
            ngOnChanges(n) {
              this._added || this._setUpControl(),
                bp(n, this.viewModel) &&
                  ((this.viewModel = this.model),
                  this.formDirective.updateModel(this, this.model));
            }
            ngOnDestroy() {
              this.formDirective && this.formDirective.removeControl(this);
            }
            viewToModelUpdate(n) {
              (this.viewModel = n), this.update.emit(n);
            }
            get path() {
              return Eu(
                null == this.name ? this.name : this.name.toString(),
                this._parent
              );
            }
            get formDirective() {
              return this._parent ? this._parent.formDirective : null;
            }
            _checkParentType() {}
            _setUpControl() {
              this._checkParentType(),
                (this.control = this.formDirective.addControl(this)),
                (this._added = !0);
            }
          }
          return (
            (t._ngModelWarningSentOnce = !1),
            (t.ɵfac = function (n) {
              return new (n || t)(
                C(ht, 13),
                C(it, 10),
                C(Dr, 10),
                C(Rn, 10),
                C(Tp, 8)
              );
            }),
            (t.ɵdir = U({
              type: t,
              selectors: [["", "formControlName", ""]],
              inputs: {
                name: ["formControlName", "name"],
                isDisabled: ["disabled", "isDisabled"],
                model: ["ngModel", "model"],
              },
              outputs: { update: "ngModelChange" },
              features: [ve([Sj]), ce, jt],
            })),
            t
          );
        })(),
        lS = (() => {
          class t {}
          return (
            (t.ɵfac = function (n) {
              return new (n || t)();
            }),
            (t.ɵmod = Mt({ type: t })),
            (t.ɵinj = pt({ imports: [G0] })),
            t
          );
        })();
      class uS extends bu {
        constructor(e, n, r) {
          super(_p(n), Cp(r, n)),
            (this.controls = e),
            this._initObservables(),
            this._setUpdateStrategy(n),
            this._setUpControls(),
            this.updateValueAndValidity({
              onlySelf: !0,
              emitEvent: !!this.asyncValidator,
            });
        }
        at(e) {
          return this.controls[this._adjustIndex(e)];
        }
        push(e, n = {}) {
          this.controls.push(e),
            this._registerControl(e),
            this.updateValueAndValidity({ emitEvent: n.emitEvent }),
            this._onCollectionChange();
        }
        insert(e, n, r = {}) {
          this.controls.splice(e, 0, n),
            this._registerControl(n),
            this.updateValueAndValidity({ emitEvent: r.emitEvent });
        }
        removeAt(e, n = {}) {
          let r = this._adjustIndex(e);
          r < 0 && (r = 0),
            this.controls[r] &&
              this.controls[r]._registerOnCollectionChange(() => {}),
            this.controls.splice(r, 1),
            this.updateValueAndValidity({ emitEvent: n.emitEvent });
        }
        setControl(e, n, r = {}) {
          let o = this._adjustIndex(e);
          o < 0 && (o = 0),
            this.controls[o] &&
              this.controls[o]._registerOnCollectionChange(() => {}),
            this.controls.splice(o, 1),
            n && (this.controls.splice(o, 0, n), this._registerControl(n)),
            this.updateValueAndValidity({ emitEvent: r.emitEvent }),
            this._onCollectionChange();
        }
        get length() {
          return this.controls.length;
        }
        setValue(e, n = {}) {
          R0(this, 0, e),
            e.forEach((r, o) => {
              x0(this, !1, o),
                this.at(o).setValue(r, {
                  onlySelf: !0,
                  emitEvent: n.emitEvent,
                });
            }),
            this.updateValueAndValidity(n);
        }
        patchValue(e, n = {}) {
          null != e &&
            (e.forEach((r, o) => {
              this.at(o) &&
                this.at(o).patchValue(r, {
                  onlySelf: !0,
                  emitEvent: n.emitEvent,
                });
            }),
            this.updateValueAndValidity(n));
        }
        reset(e = [], n = {}) {
          this._forEachChild((r, o) => {
            r.reset(e[o], { onlySelf: !0, emitEvent: n.emitEvent });
          }),
            this._updatePristine(n),
            this._updateTouched(n),
            this.updateValueAndValidity(n);
        }
        getRawValue() {
          return this.controls.map((e) => e.getRawValue());
        }
        clear(e = {}) {
          this.controls.length < 1 ||
            (this._forEachChild((n) => n._registerOnCollectionChange(() => {})),
            this.controls.splice(0),
            this.updateValueAndValidity({ emitEvent: e.emitEvent }));
        }
        _adjustIndex(e) {
          return e < 0 ? e + this.length : e;
        }
        _syncPendingControls() {
          let e = this.controls.reduce(
            (n, r) => !!r._syncPendingControls() || n,
            !1
          );
          return e && this.updateValueAndValidity({ onlySelf: !0 }), e;
        }
        _forEachChild(e) {
          this.controls.forEach((n, r) => {
            e(n, r);
          });
        }
        _updateValue() {
          this.value = this.controls
            .filter((e) => e.enabled || this.disabled)
            .map((e) => e.value);
        }
        _anyControls(e) {
          return this.controls.some((n) => n.enabled && e(n));
        }
        _setUpControls() {
          this._forEachChild((e) => this._registerControl(e));
        }
        _allControlsDisabled() {
          for (const e of this.controls) if (e.enabled) return !1;
          return this.controls.length > 0 || this.disabled;
        }
        _registerControl(e) {
          e.setParent(this),
            e._registerOnCollectionChange(this._onCollectionChange);
        }
        _find(e) {
          return this.at(e) ?? null;
        }
      }
      function cS(t) {
        return (
          !!t &&
          (void 0 !== t.asyncValidators ||
            void 0 !== t.validators ||
            void 0 !== t.updateOn)
        );
      }
      let Hj = (() => {
          class t {
            constructor() {
              this.useNonNullable = !1;
            }
            get nonNullable() {
              const n = new t();
              return (n.useNonNullable = !0), n;
            }
            group(n, r = null) {
              const o = this._reduceControls(n);
              let i = {};
              return (
                cS(r)
                  ? (i = r)
                  : null !== r &&
                    ((i.validators = r.validator),
                    (i.asyncValidators = r.asyncValidator)),
                new js(o, i)
              );
            }
            record(n, r = null) {
              const o = this._reduceControls(n);
              return new F0(o, r);
            }
            control(n, r, o) {
              let i = {};
              return this.useNonNullable
                ? (cS(r)
                    ? (i = r)
                    : ((i.validators = r), (i.asyncValidators = o)),
                  new to(n, { ...i, nonNullable: !0 }))
                : new to(n, r, o);
            }
            array(n, r, o) {
              const i = n.map((s) => this._createControl(s));
              return new uS(i, r, o);
            }
            _reduceControls(n) {
              const r = {};
              return (
                Object.keys(n).forEach((o) => {
                  r[o] = this._createControl(n[o]);
                }),
                r
              );
            }
            _createControl(n) {
              return n instanceof to || n instanceof bu
                ? n
                : Array.isArray(n)
                ? this.control(
                    n[0],
                    n.length > 1 ? n[1] : null,
                    n.length > 2 ? n[2] : null
                  )
                : this.control(n);
            }
          }
          return (
            (t.ɵfac = function (n) {
              return new (n || t)();
            }),
            (t.ɵprov = N({ token: t, factory: t.ɵfac, providedIn: "root" })),
            t
          );
        })(),
        jj = (() => {
          class t {
            static withConfig(n) {
              return {
                ngModule: t,
                providers: [
                  { provide: eo, useValue: n.callSetDisabledState ?? $s },
                ],
              };
            }
          }
          return (
            (t.ɵfac = function (n) {
              return new (n || t)();
            }),
            (t.ɵmod = Mt({ type: t })),
            (t.ɵinj = pt({ imports: [lS] })),
            t
          );
        })(),
        $j = (() => {
          class t {
            static withConfig(n) {
              return {
                ngModule: t,
                providers: [
                  {
                    provide: Tp,
                    useValue: n.warnOnNgModelWithFormControl ?? "always",
                  },
                  { provide: eo, useValue: n.callSetDisabledState ?? $s },
                ],
              };
            }
          }
          return (
            (t.ɵfac = function (n) {
              return new (n || t)();
            }),
            (t.ɵmod = Mt({ type: t })),
            (t.ɵinj = pt({ imports: [lS] })),
            t
          );
        })();
      function Uj(t, e) {
        if (
          (1 & t &&
            (D(0, "tr")(1, "td"),
            S(2, "1"),
            b(),
            D(3, "td"),
            S(4),
            b(),
            D(5, "td"),
            S(6),
            b(),
            D(7, "td"),
            S(8),
            b(),
            D(9, "td"),
            S(10),
            (function eD(t, e) {
              const n = ee();
              let r;
              const o = t + J;
              n.firstCreatePass
                ? ((r = (function N1(t, e) {
                    if (e)
                      for (let n = e.length - 1; n >= 0; n--) {
                        const r = e[n];
                        if (t === r.name) return r;
                      }
                  })(e, n.pipeRegistry)),
                  (n.data[o] = r),
                  r.onDestroy && (n.destroyHooks ??= []).push(o, r.onDestroy))
                : (r = n.data[o]);
              const i = r.factory || (r.factory = Or(r.type)),
                s = gt(C);
              try {
                const a = ba(!1),
                  l = i();
                return (
                  ba(a),
                  (function dN(t, e, n, r) {
                    n >= t.data.length &&
                      ((t.data[n] = null), (t.blueprint[n] = null)),
                      (e[n] = r);
                  })(n, w(), o, l),
                  l
                );
              } finally {
                gt(s);
              }
            })(11, "date"),
            b(),
            D(12, "td")(13, "strong"),
            S(14),
            b()(),
            Ae(15, "td"),
            D(16, "td"),
            S(17, "View"),
            b()()),
          2 & t)
        ) {
          const n = e.$implicit;
          Q(4),
            In(n.Order_id),
            Q(2),
            In(n.order_Staff.staff_id.username),
            Q(2),
            qo(
              " ",
              n.Ordered_table.table_Name,
              "-",
              n.Ordered_table.table_No,
              " "
            ),
            Q(2),
            Kn(" ", tD(11, 6, n.order_date, "dd/MM/yyyy"), " "),
            Q(4),
            Kn("", n.Total_order_Amount, " ");
        }
      }
      let zj = (() => {
        class t {
          constructor(n, r) {
            (this._PosServie = n),
              (this._posSocketService = r),
              (this.socket = Xr("http://localhost:5000")),
              (this.resId = localStorage.getItem("resId"));
          }
          ngOnInit() {
            this.loadOrderHistory();
          }
          loadOrderHistory() {
            this._posSocketService.emit("loadToOrdersHistory", {}),
              this._posSocketService.listen("listOrderHistories").subscribe(
                (n) => {
                  this.ListOrders$ = n;
                },
                (n) => console.log(n)
              ),
              fp(this.socket, "listorderHistories").subscribe((n) => {
                console.log(n);
              });
          }
          calculateSales() {
            console.log(this.startDate, this.endDate),
              this.startDate &&
                this.endDate &&
                this._PosServie
                  .filterSales(this.startDate, this.endDate)
                  .subscribe((n) => {
                    console.log(n), (this.ListOrders$ = n);
                  });
          }
        }
        return (
          (t.ɵfac = function (n) {
            return new (n || t)(C(ui), C(mu));
          }),
          (t.ɵcmp = Xt({
            type: t,
            selectors: [["app-sales"]],
            decls: 38,
            vars: 3,
            consts: [
              [1, "table"],
              [1, "table__header"],
              [1, "input-group"],
              ["type", "search", "placeholder", "Search Data..."],
              [1, "filter__section"],
              ["for", "startDate"],
              [
                "type",
                "date",
                "id",
                "startDate",
                3,
                "ngModel",
                "ngModelChange",
              ],
              ["for", "endDate"],
              ["type", "date", "id", "endDate", 3, "ngModel", "ngModelChange"],
              [1, "export__file"],
              [
                "for",
                "export-file",
                "title",
                "Export File",
                1,
                "export__file-btn",
              ],
              ["type", "checkbox", "id", "export-file"],
              [1, "table__body"],
              [4, "ngFor", "ngForOf"],
            ],
            template: function (n, r) {
              1 & n &&
                (D(0, "main", 0)(1, "section", 1)(2, "h3"),
                S(3, "Counter"),
                b(),
                D(4, "div", 2),
                Ae(5, "input", 3),
                b(),
                D(6, "div", 4)(7, "label", 5),
                S(8, "Start Date:"),
                b(),
                D(9, "input", 6),
                Ie("ngModelChange", function (i) {
                  return (r.startDate = i);
                })("ngModelChange", function () {
                  return r.calculateSales();
                }),
                b(),
                D(10, "label", 7),
                S(11, "End Date:"),
                b(),
                D(12, "input", 8),
                Ie("ngModelChange", function (i) {
                  return (r.endDate = i);
                })("ngModelChange", function () {
                  return r.calculateSales();
                }),
                b()(),
                D(13, "div", 9),
                Ae(14, "label", 10)(15, "input", 11),
                b()(),
                D(16, "section", 12)(17, "table")(18, "thead")(19, "tr")(
                  20,
                  "th"
                ),
                S(21, "Id "),
                b(),
                D(22, "th"),
                S(23, "Order Id "),
                b(),
                D(24, "th"),
                S(25, "Staff "),
                b(),
                D(26, "th"),
                S(27, "Ordered Table"),
                b(),
                D(28, "th"),
                S(29, "Order Date "),
                b(),
                D(30, "th"),
                S(31, "Total Amount "),
                b(),
                D(32, "th"),
                S(33, "Payment"),
                b(),
                D(34, "th"),
                S(35, "View"),
                b()()(),
                D(36, "tbody"),
                Se(37, Uj, 18, 9, "tr", 13),
                b()()()()),
                2 & n &&
                  (Q(9),
                  fe("ngModel", r.startDate),
                  Q(3),
                  fe("ngModel", r.endDate),
                  Q(25),
                  fe("ngForOf", r.ListOrders$));
            },
            dependencies: [kl, Vs, mp, Mp, kw],
            styles: [
              "*[_ngcontent-%COMP%]{margin:0;padding:0;box-sizing:border-box;font-family:sans-serif}body[_ngcontent-%COMP%]{min-height:100vh;display:flex;justify-content:center;align-items:center}main.table[_ngcontent-%COMP%]{width:82vw;height:90vh;background-color:#fff5;-webkit-backdrop-filter:blur(7px);backdrop-filter:blur(7px);box-shadow:0 .4rem .8rem #0005;border-radius:.8rem;overflow:hidden}.table__header[_ngcontent-%COMP%]{width:100%;height:10%;background-color:#fff4;padding:.8rem 1rem;display:flex;justify-content:space-between;align-items:center}.table__header[_ngcontent-%COMP%]   .input-group[_ngcontent-%COMP%]{width:35%;height:100%;background-color:#fff5;padding:0 .8rem;border-radius:2rem;display:flex;justify-content:center;align-items:center;transition:.2s}.table__header[_ngcontent-%COMP%]   .input-group[_ngcontent-%COMP%]:hover{width:45%;background-color:#fff8;box-shadow:0 .1rem .4rem #0002}.table__header[_ngcontent-%COMP%]   .input-group[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{width:1.2rem;height:1.2rem}.table__header[_ngcontent-%COMP%]   .input-group[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]{width:100%;padding:0 .5rem 0 .3rem;background-color:transparent;border:none;outline:none}.table__body[_ngcontent-%COMP%]{width:95%;max-height:calc(89% - 1.6rem);background-color:#fffb;margin:.8rem auto;border-radius:.6rem;overflow:auto;overflow:overlay}.table__body[_ngcontent-%COMP%]::-webkit-scrollbar{width:.5rem;height:.5rem}.table__body[_ngcontent-%COMP%]::-webkit-scrollbar-thumb{border-radius:.5rem;background-color:#0004;visibility:hidden}.table__body[_ngcontent-%COMP%]:hover::-webkit-scrollbar-thumb{visibility:visible}table[_ngcontent-%COMP%]{width:100%}td[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{width:36px;height:36px;margin-right:.5rem;border-radius:50%;vertical-align:middle}table[_ngcontent-%COMP%], th[_ngcontent-%COMP%], td[_ngcontent-%COMP%]{border-collapse:collapse;padding:1rem;text-align:left}thead[_ngcontent-%COMP%]   th[_ngcontent-%COMP%]{position:sticky;top:0;left:0;background-color:#f4a91f;cursor:pointer;text-transform:capitalize;text-align:center}tbody[_ngcontent-%COMP%]   tr[_ngcontent-%COMP%]:nth-child(even){background-color:#0000000b}tbody[_ngcontent-%COMP%]   tr[_ngcontent-%COMP%]{--delay: .1s;transition:.5s ease-in-out var(--delay),background-color 0s}tbody[_ngcontent-%COMP%]   tr.hide[_ngcontent-%COMP%]{opacity:0;transform:translate(100%)}tbody[_ngcontent-%COMP%]   tr[_ngcontent-%COMP%]:hover{background-color:#fff6!important}tbody[_ngcontent-%COMP%]   tr[_ngcontent-%COMP%]   td[_ngcontent-%COMP%], tbody[_ngcontent-%COMP%]   tr[_ngcontent-%COMP%]   td[_ngcontent-%COMP%]   p[_ngcontent-%COMP%], tbody[_ngcontent-%COMP%]   tr[_ngcontent-%COMP%]   td[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{transition:.2s ease-in-out;text-align:center}tbody[_ngcontent-%COMP%]   tr.hide[_ngcontent-%COMP%]   td[_ngcontent-%COMP%], tbody[_ngcontent-%COMP%]   tr.hide[_ngcontent-%COMP%]   td[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{padding:0;font:0 / 0 sans-serif;transition:.2s ease-in-out .5s}tbody[_ngcontent-%COMP%]   tr.hide[_ngcontent-%COMP%]   td[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{width:0;height:0;transition:.2s ease-in-out .5s}.status[_ngcontent-%COMP%]{padding:.4rem 0;border-radius:2rem;text-align:center}.status.delivered[_ngcontent-%COMP%]{background-color:#6cf02979;color:#1ec704}.status.cancelled[_ngcontent-%COMP%]{background-color:#f91a1a51;color:#ff0505}.status.pending[_ngcontent-%COMP%]{background-color:#ebc474}.status.shipped[_ngcontent-%COMP%]{background-color:#6fcaea}@media (max-width: 1000px){td[_ngcontent-%COMP%]:not(:first-of-type){min-width:12.1rem}}thead[_ngcontent-%COMP%]   th[_ngcontent-%COMP%]   span.icon-arrow[_ngcontent-%COMP%]{display:inline-block;width:1.3rem;height:1.3rem;border-radius:50%;border:1.4px solid transparent;text-align:center;font-size:1rem;margin-left:.5rem;transition:.2s ease-in-out}thead[_ngcontent-%COMP%]   th[_ngcontent-%COMP%]:hover   span.icon-arrow[_ngcontent-%COMP%]{border:1.4px solid #6c00bd}thead[_ngcontent-%COMP%]   th[_ngcontent-%COMP%]:hover{color:#6c00bd}thead[_ngcontent-%COMP%]   th.active[_ngcontent-%COMP%]   span.icon-arrow[_ngcontent-%COMP%]{background-color:#6c00bd;color:#fff}thead[_ngcontent-%COMP%]   th.asc[_ngcontent-%COMP%]   span.icon-arrow[_ngcontent-%COMP%]{transform:rotate(180deg)}thead[_ngcontent-%COMP%]   th.active[_ngcontent-%COMP%], tbody[_ngcontent-%COMP%]   td.active[_ngcontent-%COMP%]{color:#6c00bd}.export__file[_ngcontent-%COMP%]{position:relative}.export__file[_ngcontent-%COMP%]   .export__file-btn[_ngcontent-%COMP%]{display:inline-block;width:2rem;height:2rem;border-radius:50%;transition:.2s ease-in-out}.export__file[_ngcontent-%COMP%]   .export__file-btn[_ngcontent-%COMP%]:hover{background-color:#fff;transform:scale(1.15);cursor:pointer}.export__file[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]{display:none}.export__file[_ngcontent-%COMP%]   .export__file-options[_ngcontent-%COMP%]{position:absolute;right:0;width:12rem;border-radius:.5rem;overflow:hidden;text-align:center;opacity:0;transform:scale(.8);transform-origin:top right;box-shadow:0 .2rem .5rem #0004;transition:.2s}.export__file[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]:checked + .export__file-options[_ngcontent-%COMP%]{opacity:1;transform:scale(1);z-index:100}.export__file[_ngcontent-%COMP%]   .export__file-options[_ngcontent-%COMP%]   label[_ngcontent-%COMP%]{display:block;width:100%;padding:.6rem 0;background-color:#f2f2f2;display:flex;justify-content:space-around;align-items:center;transition:.2s ease-in-out}.export__file[_ngcontent-%COMP%]   .export__file-options[_ngcontent-%COMP%]   label[_ngcontent-%COMP%]:first-of-type{padding:1rem 0;background-color:#86e49d!important}.export__file[_ngcontent-%COMP%]   .export__file-options[_ngcontent-%COMP%]   label[_ngcontent-%COMP%]:hover{transform:scale(1.05);background-color:#fff;cursor:pointer}.export__file[_ngcontent-%COMP%]   .export__file-options[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{width:2rem;height:auto}.filter__section[_ngcontent-%COMP%]{width:600px;height:70px;color:#ff6a00;background-color:#fff;box-shadow:1px 1px 10px #eee5e5;display:flex;flex-direction:row;align-items:center;border-radius:20px;justify-content:space-evenly}input[type=date][_ngcontent-%COMP%]{background-color:#f9f9f9;font-family:Roboto Mono,monospace;color:#ff6a00;font-size:18px;border:none;outline:none;border-radius:20px}[_ngcontent-%COMP%]::-webkit-calendar-picker-indicator{filter:invert(1) hue-rotate(180deg);background-color:#ff6a00;color:#fff;padding:5px;cursor:pointer;border-radius:25px}",
            ],
          })),
          t
        );
      })();
      function qj(t, e) {
        1 & t && (D(0, "label", 23), S(1, "Email is requried"), b());
      }
      function Gj(t, e) {
        1 & t &&
          (D(0, "label", 23), S(1, "Email should be proper formate"), b());
      }
      function Wj(t, e) {
        if (
          (1 & t &&
            (D(0, "div", 21),
            Se(1, qj, 2, 0, "label", 22),
            Se(2, Gj, 2, 0, "label", 22),
            b()),
          2 & t)
        ) {
          const n = xt();
          Q(1),
            fe("ngIf", n.submitted && n.form.controls.email.errors.required),
            Q(1),
            fe("ngIf", n.submitted && n.form.controls.email.errors.email);
        }
      }
      function Kj(t, e) {
        1 & t && (D(0, "label", 23), S(1, "Password is requried"), b());
      }
      function Qj(t, e) {
        1 & t && (D(0, "label", 23), S(1, "Password min more than 4 "), b());
      }
      function Zj(t, e) {
        if (
          (1 & t &&
            (D(0, "div", 21),
            Se(1, Kj, 2, 0, "label", 22),
            Se(2, Qj, 2, 0, "label", 22),
            b()),
          2 & t)
        ) {
          const n = xt();
          Q(1),
            fe("ngIf", n.submitted && n.form.controls.password.errors.required),
            Q(1),
            fe(
              "ngIf",
              n.submitted && n.form.controls.password.errors.minlength
            );
        }
      }
      let Yj = (() => {
        class t {
          constructor(n, r, o) {
            (this.formBuilder = n), (this._posService = r), (this.router = o);
          }
          ngOnInit() {
            this.form = this.formBuilder.group({
              email: new to("", [yu.required, yu.email]),
              password: new to("", [yu.required, yu.minLength(4)]),
            });
          }
          pos_Login() {
            let n = this.form.getRawValue();
            this._posService.staffLogin(n).subscribe(
              (r) => {
                this.router.navigate(["/"]),
                  localStorage.setItem("pos-staffs", "true_and_verifyed"),
                  localStorage.setItem("token", r.token),
                  localStorage.setItem("resId", r.resId);
              },
              (r) => console.log(r)
            );
          }
        }
        return (
          (t.ɵfac = function (n) {
            return new (n || t)(C(Hj), C(ui), C(Je));
          }),
          (t.ɵcmp = Xt({
            type: t,
            selectors: [["app-login"]],
            decls: 32,
            vars: 3,
            consts: [
              [1, "container", "mx-auto", "mt-5"],
              [1, "card", "card0"],
              [1, "d-flex", "flex-lg-row", "flex-column-reverse"],
              [1, "card", "card2"],
              [1, "my-auto", "mx-md-5", "px-md-5", "right"],
              [1, "text-white"],
              [1, "card", "card1"],
              [1, "row", "justify-content-center", "my-auto"],
              [1, "col-md-8", "col-10"],
              [1, "row", "justify-content-center", "px-3", "mb-3"],
              ["id", "logo", "src", "https://i.imgur.com/PSXxjNY.png"],
              [1, "mb-5", "text-center", "heading"],
              [1, "msg-info"],
              [3, "formGroup", "submit"],
              [1, "form-group"],
              [1, "form-control-label", "text-muted"],
              [
                "formControlName",
                "email",
                "type",
                "text",
                "id",
                "email",
                "name",
                "email",
                "placeholder",
                "Phone no or email id",
                1,
                "form-control",
              ],
              ["class", "text-danger emailerror", 4, "ngIf"],
              [
                "formControlName",
                "password",
                "type",
                "password",
                "placeholder",
                "Password",
                1,
                "form-control",
              ],
              [1, "row", "justify-content-center", "my-3", "px-3"],
              ["type", "submit", 1, "btn-block", "btn-color"],
              [1, "text-danger", "emailerror"],
              ["class", "form-control-label text-danger", 4, "ngIf"],
              [1, "form-control-label", "text-danger"],
            ],
            template: function (n, r) {
              1 & n &&
                (D(0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "div", 3)(
                  4,
                  "div",
                  4
                )(5, "h3", 5),
                S(6, "We are more than just a company"),
                b(),
                D(7, "small", 5),
                S(
                  8,
                  "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
                ),
                b()()(),
                D(9, "div", 6)(10, "div", 7)(11, "div", 8)(12, "div", 9),
                Ae(13, "img", 10),
                b(),
                D(14, "h3", 11),
                S(15, "Welcome To Turfyo"),
                b(),
                D(16, "h6", 12),
                S(17, "Please login to your account"),
                b(),
                D(18, "form", 13),
                Ie("submit", function () {
                  return r.pos_Login();
                }),
                D(19, "div", 14)(20, "label", 15),
                S(21, "Email"),
                b(),
                Ae(22, "input", 16),
                Se(23, Wj, 3, 2, "div", 17),
                D(24, "div", 14)(25, "label", 15),
                S(26, "Password"),
                b(),
                Ae(27, "input", 18),
                Se(28, Zj, 3, 2, "div", 17),
                b(),
                D(29, "div", 19)(30, "button", 20),
                S(31, " Login to Turfyo "),
                b()()()()()()()()()()),
                2 & n &&
                  (Q(18),
                  fe("formGroup", r.form),
                  Q(5),
                  fe("ngIf", r.form.controls.email.errors),
                  Q(5),
                  fe("ngIf", r.form.controls.password.errors));
            },
            dependencies: [Ll, z0, Vs, mp, P0, Au, Op],
            styles: [
              ".form-outline[_ngcontent-%COMP%]   .form-control[_ngcontent-%COMP%]{border:solid .2px rgb(243,110,8);border-radius:20px;box-shadow:none}.custom-toast[_ngcontent-%COMP%]{width:20px;height:20px}body[_ngcontent-%COMP%]{color:#000;overflow-x:hidden;height:100%;background-image:linear-gradient(to right,#D500F9,#FFD54F);background-repeat:no-repeat}input[_ngcontent-%COMP%], textarea[_ngcontent-%COMP%]{background-color:#f3e5f5;border-radius:50px!important;padding:12px 15px!important;width:100%;box-sizing:border-box;border:none!important;border:1px solid #F3E5F5!important;font-size:16px!important;color:#000!important;font-weight:400}input[_ngcontent-%COMP%]:focus, textarea[_ngcontent-%COMP%]:focus{box-shadow:none!important;border:1px solid #f98715ec!important;outline-width:0;font-weight:400}button[_ngcontent-%COMP%]:focus{box-shadow:none!important;outline-width:0}.card[_ngcontent-%COMP%]{border-radius:0;border:none}.card1[_ngcontent-%COMP%]{width:50%;padding:40px 30px 10px}.card2[_ngcontent-%COMP%]{width:50%;border-radius:25px;background-image:linear-gradient(to right,#f5c118,#f98715ec)}#logo[_ngcontent-%COMP%]{width:70px;height:60px}.heading[_ngcontent-%COMP%]{margin-bottom:60px!important;font-weight:700;color:#f57b18}[_ngcontent-%COMP%]::placeholder{color:#f98715ec!important;opacity:1}[_ngcontent-%COMP%]:-ms-input-placeholder{color:#f98715ec!important}[_ngcontent-%COMP%]::-ms-input-placeholder{color:#f98715ec!important}.form-control-label[_ngcontent-%COMP%]{font-size:12px;margin-left:15px}.msg-info[_ngcontent-%COMP%]{padding-left:15px;margin-bottom:30px}.btn-color[_ngcontent-%COMP%]{border-radius:50px;color:#fff;background-image:linear-gradient(to right,#f5c118,#f98715ec);padding:15px;cursor:pointer;border:none!important;margin-top:40px}.btn-color[_ngcontent-%COMP%]:hover{color:#fff;background-image:linear-gradient(to right,#f98715ec,#FFD54F)}.btn-white[_ngcontent-%COMP%]{border-radius:50px;color:#d500f9;background-color:#fff;padding:8px 40px;cursor:pointer;border:2px solid #D500F9!important}.btn-white[_ngcontent-%COMP%]:hover{color:#fff;background-image:linear-gradient(to right,#FFD54F,#D500F9)}a[_ngcontent-%COMP%], a[_ngcontent-%COMP%]:hover{color:#000}.bottom[_ngcontent-%COMP%]{width:100%;margin-top:50px!important}.sm-text[_ngcontent-%COMP%]{font-size:15px}@media screen and (max-width: 992px){.card1[_ngcontent-%COMP%]{width:100%;padding:40px 30px 10px}.card2[_ngcontent-%COMP%]{width:100%}.right[_ngcontent-%COMP%]{margin-top:100px!important;margin-bottom:100px!important}}@media screen and (max-width: 768px){.container[_ngcontent-%COMP%]{padding:10px!important}.card2[_ngcontent-%COMP%]{padding:50px}.right[_ngcontent-%COMP%]{margin-top:50px!important;margin-bottom:50px!important}}@media screen and (max-width:450px){.container[_ngcontent-%COMP%]{width:100%}.card2[_ngcontent-%COMP%]{padding:50px}.right[_ngcontent-%COMP%]{margin-top:50px!important;margin-bottom:50px!important}}.fixed-div[_ngcontent-%COMP%]{position:fixed;top:0;left:0}",
            ],
          })),
          t
        );
      })();
      class dS {}
      class Xj {}
      const nr = "*";
      function Rp(t, e) {
        return { type: 7, name: t, definitions: e, options: {} };
      }
      function Iu(t, e = null) {
        return { type: 4, styles: e, timings: t };
      }
      function fS(t, e = null) {
        return { type: 2, steps: t, options: e };
      }
      function cn(t) {
        return { type: 6, styles: t, offset: null };
      }
      function Ou(t, e, n) {
        return { type: 0, name: t, styles: e, options: n };
      }
      function Fp(t, e, n = null) {
        return { type: 1, expr: t, animation: e, options: n };
      }
      function hS(t, e, n = null) {
        return { type: 11, selector: t, animation: e, options: n };
      }
      function pS(t) {
        Promise.resolve().then(t);
      }
      class qs {
        constructor(e = 0, n = 0) {
          (this._onDoneFns = []),
            (this._onStartFns = []),
            (this._onDestroyFns = []),
            (this._originalOnDoneFns = []),
            (this._originalOnStartFns = []),
            (this._started = !1),
            (this._destroyed = !1),
            (this._finished = !1),
            (this._position = 0),
            (this.parentPlayer = null),
            (this.totalTime = e + n);
        }
        _onFinish() {
          this._finished ||
            ((this._finished = !0),
            this._onDoneFns.forEach((e) => e()),
            (this._onDoneFns = []));
        }
        onStart(e) {
          this._originalOnStartFns.push(e), this._onStartFns.push(e);
        }
        onDone(e) {
          this._originalOnDoneFns.push(e), this._onDoneFns.push(e);
        }
        onDestroy(e) {
          this._onDestroyFns.push(e);
        }
        hasStarted() {
          return this._started;
        }
        init() {}
        play() {
          this.hasStarted() || (this._onStart(), this.triggerMicrotask()),
            (this._started = !0);
        }
        triggerMicrotask() {
          pS(() => this._onFinish());
        }
        _onStart() {
          this._onStartFns.forEach((e) => e()), (this._onStartFns = []);
        }
        pause() {}
        restart() {}
        finish() {
          this._onFinish();
        }
        destroy() {
          this._destroyed ||
            ((this._destroyed = !0),
            this.hasStarted() || this._onStart(),
            this.finish(),
            this._onDestroyFns.forEach((e) => e()),
            (this._onDestroyFns = []));
        }
        reset() {
          (this._started = !1),
            (this._finished = !1),
            (this._onStartFns = this._originalOnStartFns),
            (this._onDoneFns = this._originalOnDoneFns);
        }
        setPosition(e) {
          this._position = this.totalTime ? e * this.totalTime : 1;
        }
        getPosition() {
          return this.totalTime ? this._position / this.totalTime : 1;
        }
        triggerCallback(e) {
          const n = "start" == e ? this._onStartFns : this._onDoneFns;
          n.forEach((r) => r()), (n.length = 0);
        }
      }
      class gS {
        constructor(e) {
          (this._onDoneFns = []),
            (this._onStartFns = []),
            (this._finished = !1),
            (this._started = !1),
            (this._destroyed = !1),
            (this._onDestroyFns = []),
            (this.parentPlayer = null),
            (this.totalTime = 0),
            (this.players = e);
          let n = 0,
            r = 0,
            o = 0;
          const i = this.players.length;
          0 == i
            ? pS(() => this._onFinish())
            : this.players.forEach((s) => {
                s.onDone(() => {
                  ++n == i && this._onFinish();
                }),
                  s.onDestroy(() => {
                    ++r == i && this._onDestroy();
                  }),
                  s.onStart(() => {
                    ++o == i && this._onStart();
                  });
              }),
            (this.totalTime = this.players.reduce(
              (s, a) => Math.max(s, a.totalTime),
              0
            ));
        }
        _onFinish() {
          this._finished ||
            ((this._finished = !0),
            this._onDoneFns.forEach((e) => e()),
            (this._onDoneFns = []));
        }
        init() {
          this.players.forEach((e) => e.init());
        }
        onStart(e) {
          this._onStartFns.push(e);
        }
        _onStart() {
          this.hasStarted() ||
            ((this._started = !0),
            this._onStartFns.forEach((e) => e()),
            (this._onStartFns = []));
        }
        onDone(e) {
          this._onDoneFns.push(e);
        }
        onDestroy(e) {
          this._onDestroyFns.push(e);
        }
        hasStarted() {
          return this._started;
        }
        play() {
          this.parentPlayer || this.init(),
            this._onStart(),
            this.players.forEach((e) => e.play());
        }
        pause() {
          this.players.forEach((e) => e.pause());
        }
        restart() {
          this.players.forEach((e) => e.restart());
        }
        finish() {
          this._onFinish(), this.players.forEach((e) => e.finish());
        }
        destroy() {
          this._onDestroy();
        }
        _onDestroy() {
          this._destroyed ||
            ((this._destroyed = !0),
            this._onFinish(),
            this.players.forEach((e) => e.destroy()),
            this._onDestroyFns.forEach((e) => e()),
            (this._onDestroyFns = []));
        }
        reset() {
          this.players.forEach((e) => e.reset()),
            (this._destroyed = !1),
            (this._finished = !1),
            (this._started = !1);
        }
        setPosition(e) {
          const n = e * this.totalTime;
          this.players.forEach((r) => {
            const o = r.totalTime ? Math.min(1, n / r.totalTime) : 1;
            r.setPosition(o);
          });
        }
        getPosition() {
          const e = this.players.reduce(
            (n, r) => (null === n || r.totalTime > n.totalTime ? r : n),
            null
          );
          return null != e ? e.getPosition() : 0;
        }
        beforeDestroy() {
          this.players.forEach((e) => {
            e.beforeDestroy && e.beforeDestroy();
          });
        }
        triggerCallback(e) {
          const n = "start" == e ? this._onStartFns : this._onDoneFns;
          n.forEach((r) => r()), (n.length = 0);
        }
      }
      const e$ = Rp("fadeOut", [
          Ou("visible", cn({ opacity: 1 })),
          Ou("hidden", cn({ opacity: 0 })),
          Fp("visible => hidden", [
            cn({ transform: "scale(0)" }),
            Iu("300ms ease-out"),
          ]),
        ]),
        t$ = Rp("fadeIn", [
          Ou("visible", cn({ opacity: 1 })),
          Ou("hidden", cn({ opacity: 0 })),
          Fp("hidden => visible", [
            cn({ transform: "scale(0)" }),
            Iu("300ms ease-in"),
          ]),
        ]);
      function n$(t, e) {
        1 & t && (D(0, "div", 16), S(1, " pendding "), b());
      }
      function r$(t, e) {
        1 & t && (D(0, "div", 17), S(1, " Ready "), b());
      }
      function o$(t, e) {
        1 & t && (D(0, "div", 17), S(1, " Served "), b());
      }
      function i$(t, e) {
        if (1 & t) {
          const n = ns();
          D(0, "div", 6),
            Ie("click", function () {
              const i = Pr(n).$implicit;
              return Nr(xt().takeCurrentOrder(i._id));
            })("click", function () {
              return Pr(n), Nr(xt().openDiv());
            }),
            D(1, "div", 7)(2, "div", 8)(3, "h4"),
            S(4),
            b()(),
            D(5, "div", 9)(6, "section", 10)(7, "span"),
            S(8),
            b()()()(),
            Ae(9, "div", 11),
            D(10, "div", 12),
            Se(11, n$, 2, 0, "div", 13),
            Se(12, r$, 2, 0, "div", 14),
            Se(13, o$, 2, 0, "div", 14),
            D(14, "div", 15),
            S(15),
            b()()();
        }
        if (2 & t) {
          const n = e.$implicit;
          Q(4),
            In(n.resId.name),
            Q(4),
            qo("", n.tableId.table_Name, "-", n.tableId.table_No, ""),
            Q(3),
            fe("ngIf", "pending" == n.order_status),
            Q(1),
            fe("ngIf", "ready" == n.order_status),
            Q(1),
            fe("ngIf", "served" == n.order_status),
            Q(2),
            qo(
              " ",
              n.foods.length,
              " ",
              1 === n.foods.length ? "Food" : "Foods",
              " "
            );
        }
      }
      function s$(t, e) {
        1 & t && (D(0, "div", 27), Ae(1, "img", 28), b());
      }
      function a$(t, e) {
        if (
          (1 & t &&
            (D(0, "div", 29)(1, "div", 30),
            Ae(2, "img", 31),
            b(),
            D(3, "div", 32),
            S(4),
            b(),
            D(5, "div", 33),
            S(6, "full"),
            b(),
            D(7, "div", 34),
            S(8),
            b(),
            D(9, "div", 35),
            S(10, "X"),
            b(),
            D(11, "div", 34),
            S(12),
            b(),
            D(13, "div", 36),
            S(14),
            b()()),
          2 & t)
        ) {
          const n = e.$implicit;
          Q(2),
            fe(
              "src",
              "http://localhost:5000/foods-images/" + n.food_id.image,
              hd
            ),
            Q(2),
            In(n.food_id.name),
            Q(4),
            In(n.food_quantity),
            Q(4),
            In(n.food_id.price),
            Q(2),
            Kn("\u20b9 ", n.food_totalprice, "");
        }
      }
      function l$(t, e) {
        if (
          (1 & t &&
            (D(0, "div", 37)(1, "span"), S(2, " Food Count :"), b(), S(3), b()),
          2 & t)
        ) {
          const n = xt(2);
          Q(3), Kn(" ", n.total_Foods_Count, " ");
        }
      }
      function u$(t, e) {
        if (
          (1 & t &&
            (D(0, "div", 38)(1, "span"), S(2, "Total : "), b(), S(3), b()),
          2 & t)
        ) {
          const n = xt(2);
          Q(3), Kn("\u20b9", n.total_amount, " ");
        }
      }
      function c$(t, e) {
        if (1 & t) {
          const n = ns();
          D(0, "div")(1, "section", 18)(2, "div", 19)(3, "h3"),
            S(4, "Current Order"),
            b(),
            D(5, "button", 20),
            Ie("click", function () {
              return Pr(n), Nr(xt().closeDiv());
            }),
            S(6, "close"),
            b()(),
            Se(7, s$, 2, 0, "div", 21),
            D(8, "div", 22),
            Se(9, a$, 15, 5, "div", 23),
            b()(),
            D(10, "div", 24),
            Se(11, l$, 4, 1, "div", 25),
            Se(12, u$, 4, 1, "div", 26),
            b()();
        }
        if (2 & t) {
          const n = xt();
          fe("@fadeOut", n.closeState)("@fadeIn", n.openState),
            Q(9),
            fe("ngForOf", n.allFoods),
            Q(2),
            fe("ngIf", n.total_Foods_Count),
            Q(1),
            fe("ngIf", n.total_amount);
        }
      }
      Rp("showFood", [
        Fp("* => *", [
          hS(
            ":enter",
            [
              cn({ opacity: 0, transform: "translateY(-20px)" }),
              (function Jj(t, e) {
                return { type: 12, timings: t, animation: e };
              })(100, [
                Iu("300ms ease-in", cn({ opacity: 1, transform: "none" })),
              ]),
            ],
            { optional: !0 }
          ),
          hS(
            ":leave",
            [
              Iu(
                "300ms ease-out",
                cn({ opacity: 0, transform: "translateY(-20px)" })
              ),
            ],
            { optional: !0 }
          ),
        ]),
      ]);
      const d$ = [
        {
          path: "",
          component: GB,
          canActivate: [Zr],
          children: [
            { path: "", pathMatch: "full", redirectTo: "counter" },
            { path: "counter", component: HH, canActivate: [Zr] },
            { path: "sales", component: zj, canActivate: [Zr] },
            {
              path: "order",
              component: (() => {
                class t {
                  constructor(n, r) {
                    (this._posService = n),
                      (this._posSocketService = r),
                      (this.socket = Xr("http://localhost:5000")),
                      (this.resId = localStorage.getItem("resId")),
                      (this.CloseDiv = !0),
                      (this.openDIv = !0),
                      (this.openState = "hidden"),
                      (this.closeState = "visible");
                  }
                  ngOnInit() {
                    this.loadOrder();
                  }
                  closeDiv() {
                    (this.closeState = "hidden"),
                      (this.openState = "hidden"),
                      setTimeout(() => {
                        (this.CloseDiv = !0), (this.openDIv = !1);
                      }, 300);
                  }
                  openDiv() {
                    (this.closeState = "visible"),
                      (this.openState = "visible"),
                      setTimeout(() => {
                        (this.openDIv = !0), (this.CloseDiv = !1);
                      }, 300);
                  }
                  loadOrder() {
                    this._posSocketService.emit("loadOrdersToPOS", {}),
                      this._posSocketService
                        .listen("listOrdersToPOS")
                        .subscribe(
                          (n) => {
                            this.Orders = n;
                          },
                          (n) => {
                            console.error("An error occurred:", n);
                          }
                        );
                  }
                  takeCurrentOrder(n) {
                    let r = this.Orders.filter((o) => o._id == n);
                    (this.allFoods = r[0].foods),
                      (this.total_Foods_Count = r[0].foods.length),
                      (this.total_amount = r[0].total_price);
                  }
                }
                return (
                  (t.ɵfac = function (n) {
                    return new (n || t)(C(ui), C(mu));
                  }),
                  (t.ɵcmp = Xt({
                    type: t,
                    selectors: [["app-orders"]],
                    decls: 6,
                    vars: 2,
                    consts: [
                      [1, "container"],
                      [1, "col-md-8"],
                      [1, "orders"],
                      [
                        "class",
                        "order-card",
                        3,
                        "click",
                        4,
                        "ngFor",
                        "ngForOf",
                      ],
                      [1, "col-md-4"],
                      [4, "ngIf"],
                      [1, "order-card", 3, "click"],
                      [1, "order-table"],
                      [1, "order-id"],
                      [1, "table1"],
                      [1, "card-free-table", "custom-style-false"],
                      [1, "order-clear"],
                      [1, "order-status"],
                      ["class", "status", 4, "ngIf"],
                      ["class", "ready__status", 4, "ngIf"],
                      [1, "foods"],
                      [1, "status"],
                      [1, "ready__status"],
                      [1, "cart-card"],
                      [1, "cart-header"],
                      [1, "btn", "btn-warning", 3, "click"],
                      ["class", "empty_img", 4, "ngIf"],
                      [1, "empty_cheaker"],
                      ["class", "cart-info", 4, "ngFor", "ngForOf"],
                      [1, "proceed-btn"],
                      ["class", "total-amount", 4, "ngIf"],
                      ["class", "total-amount", "ng", "", 4, "ngIf"],
                      [1, "empty_img"],
                      [
                        "src",
                        "../../../../../assets/farmers-food-design-image-file.jpg",
                        "alt",
                        "",
                      ],
                      [1, "cart-info"],
                      [1, "items-img"],
                      ["alt", "", 3, "src"],
                      [1, "items-name"],
                      [1, "items-type"],
                      [1, "items-price"],
                      [1, "items-x"],
                      [1, "items-total-price"],
                      [1, "total-amount"],
                      ["ng", "", 1, "total-amount"],
                    ],
                    template: function (n, r) {
                      1 & n &&
                        (D(0, "div", 0)(1, "div", 1)(2, "div", 2),
                        Se(3, i$, 16, 8, "div", 3),
                        b()(),
                        D(4, "div", 4),
                        Se(5, c$, 13, 5, "div", 5),
                        b()()),
                        2 & n &&
                          (Q(3),
                          fe("ngForOf", r.Orders),
                          Q(2),
                          fe("ngIf", r.openDIv || r.CloseDiv));
                    },
                    dependencies: [kl, Ll],
                    styles: [
                      ".container[_ngcontent-%COMP%]{margin:0rem 0px;width:100%;display:flex;flex-direction:row}.grid[_ngcontent-%COMP%]{display:grid}.orders[_ngcontent-%COMP%]{padding:1.6rem 0rem;display:grid;grid-template-rows:repeat(4,91px);width:100%;height:600px;justify-content:space-around;overflow-y:auto}.order-card[_ngcontent-%COMP%]{width:636px;height:77px;background-color:#fff;box-shadow:1px 2px 18px #c4c3c3;border-radius:25px;display:flex;flex-direction:row;transition:width .5s ease}.order-table[_ngcontent-%COMP%]{justify-content:space-around;align-items:center;display:flex;flex-direction:row;text-align:center}.order-id[_ngcontent-%COMP%]{padding:1rem}.order-id[_ngcontent-%COMP%]   h4[_ngcontent-%COMP%]{font-size:20px;font-weight:600}.table1[_ngcontent-%COMP%]{display:flex;justify-content:center}.card-free-table.custom-style-true[_ngcontent-%COMP%]{position:relative;margin:1rem;width:81px;height:47px;box-shadow:10px 15px 30px -12px #30e50c,10px 15px 30px -12px #30e50c inset;border:solid rgba(44,171,15,.899) 10px;border-radius:.9rem;background-color:var(--red-card);color:#2fff0084;cursor:pointer;box-shadow:0 0 20px 10px #2fff0084;animation:shadows_ture 2s infinite}.card-free-table.custom-style-false[_ngcontent-%COMP%]{position:relative;margin:1rem;width:81px;height:47px;box-shadow:10px 15px 30px -12px #ff9100b9,10px 15px 30px -12px #ff9100b9 inset;border:solid rgba(255,145,0,.725) 10px;border-radius:.9rem;background-color:var(--red-card);color:#ff9100a2;cursor:pointer}.order-clear[_ngcontent-%COMP%]{width:70%}.order-status[_ngcontent-%COMP%]{width:40%;padding-right:10px;padding-top:13px;display:flex;flex-direction:column;column-gap:10px;align-items:center}.status[_ngcontent-%COMP%]{font-size:large;font-weight:600;color:#800400}.ready__status[_ngcontent-%COMP%]{font-size:large;font-weight:600;color:#0aa00a}.time[_ngcontent-%COMP%]{font-size:large;font-weight:600;color:#000}.foods[_ngcontent-%COMP%]{font-size:13px;font-weight:600;color:#000}@media screen and (max-width: 550px){.container[_ngcontent-%COMP%]{margin:.6rem 0rem;justify-content:center;width:100%;height:auto;display:flex;flex-direction:row}.order-card[_ngcontent-%COMP%]{width:321px;height:5rem;background-color:#fff;box-shadow:1px 2px 8px #4c4c4c;border-radius:24px;display:flex;flex-direction:row}.order-table[_ngcontent-%COMP%]{width:30%;justify-content:center;align-items:center;display:flex;flex-direction:column;text-align:center}.order-id[_ngcontent-%COMP%]   h4[_ngcontent-%COMP%]{font-size:12px;font-weight:600}.table1[_ngcontent-%COMP%]{max-width:96%;background-color:transparent}.card-free-table.custom-style-true[_ngcontent-%COMP%]{position:relative;margin:0px 1rem;width:160px;height:100px;box-shadow:10px 15px 30px -12px #30e50c,10px 15px 30px -12px #30e50c inset;border:solid rgba(44,171,15,.899) 10px;border-radius:.9rem;background-color:var(--red-card);color:#2fff0084;cursor:pointer;box-shadow:0 0 20px 10px #2fff0084;animation:shadows_ture 2s infinite}.card-free-table.custom-style-false[_ngcontent-%COMP%]{position:relative;margin:0px 0rem;width:60px;height:40px;box-shadow:10px 15px 30px -12px #ff9100b9,10px 15px 30px -12px #ff9100b9 inset;border:solid rgba(255,145,0,.725) 4px;border-radius:.7rem;background-color:var(--red-card);color:#ff9100a2;cursor:pointer}.order-clear[_ngcontent-%COMP%]{width:70%}.order-status[_ngcontent-%COMP%]{width:30%;padding-right:20px;display:flex;flex-direction:column;justify-content:space-evenly;align-items:center}.status[_ngcontent-%COMP%]{font-size:11px;font-weight:500;color:green}.time[_ngcontent-%COMP%], .foods[_ngcontent-%COMP%]{font-size:10px;font-weight:500;color:#000}}@media only screen and (max-width: 680px) and (min-width: 551px){.container[_ngcontent-%COMP%]{margin:3rem;justify-content:center;width:100%;height:auto;display:flex;flex-direction:row}.order-card[_ngcontent-%COMP%]{width:447px;height:6rem;background-color:#fff;box-shadow:1px 2px 8px #4c4c4c;border-radius:25px;display:flex;flex-direction:row}.order-table[_ngcontent-%COMP%]{width:30%;justify-content:center;align-items:center;display:flex;flex-direction:column;text-align:center}.order-id[_ngcontent-%COMP%]   h4[_ngcontent-%COMP%]{font-size:14px;font-weight:600}.table1[_ngcontent-%COMP%]{max-width:96%;background-color:transparent}.card-free-table.custom-style-true[_ngcontent-%COMP%]{position:relative;margin:0px 1rem;width:160px;height:100px;box-shadow:10px 15px 30px -12px #30e50c,10px 15px 30px -12px #30e50c inset;border:solid rgba(44,171,15,.899) 10px;border-radius:.9rem;background-color:var(--red-card);color:#2fff0084;cursor:pointer;box-shadow:0 0 20px 10px #2fff0084;animation:shadows_ture 2s infinite}.card-free-table.custom-style-false[_ngcontent-%COMP%]{position:relative;margin:0px 0rem;width:70px;height:50px;box-shadow:10px 15px 30px -12px #ff9100b9,10px 15px 30px -12px #ff9100b9 inset;border:solid rgba(255,145,0,.725) 6px;border-radius:.7rem;background-color:var(--red-card);color:#ff9100a2;cursor:pointer}.order-clear[_ngcontent-%COMP%]{width:70%}.order-status[_ngcontent-%COMP%]{width:30%;padding-right:20px;display:flex;flex-direction:column;justify-content:space-evenly;align-items:center}.status[_ngcontent-%COMP%]{font-size:15px;font-weight:600;color:green}.time[_ngcontent-%COMP%], .foods[_ngcontent-%COMP%]{font-size:13px;font-weight:600;color:#000}}.cart-card[_ngcontent-%COMP%]{position:relative;width:350px;height:32rem!important;box-shadow:1px 0 10px #9f9d9d;border-radius:.9rem .9rem 0rem 0rem;background-color:var(--red-card);color:var(--text);cursor:pointer;justify-content:center;align-items:center;overflow:hidden;overflow-y:auto}.cart-header[_ngcontent-%COMP%]{justify-content:space-around;align-items:center;display:flex;flex-direction:row;text-align:center;font-weight:600;font-size:medium}.cart-header[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%]{padding:10px;justify-content:left;text-align:left;font-weight:500;font-size:20px;font-weight:600;color:#3a3a3a}select[_ngcontent-%COMP%]{background-color:#f3f3f3;border:solid #ff8800 2px;color:#f80;border-radius:25px}option[_ngcontent-%COMP%]{background-color:#fff;color:#fff;border:solid #ff8800 2px;color:#f80}.cart-info[_ngcontent-%COMP%]{width:100%;height:70px;background-color:#fff;border-radius:25px;display:flex;flex-direction:row;align-items:center;justify-content:space-around}.items-img[_ngcontent-%COMP%]{border-image-outset:0cap;overflow:hidden}.items-img[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{height:60px;width:60px;border-radius:50px;transition:.1s}.items-img[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]:hover{transform:scale3d(50);height:70px;width:70px;border-radius:50px}.items-name[_ngcontent-%COMP%], .items-type[_ngcontent-%COMP%]{font-size:large;font-weight:600;color:#4d4d4d}.items-price[_ngcontent-%COMP%]{color:#353434}.cart_menu[_ngcontent-%COMP%]{justify-content:center}.cart_items[_ngcontent-%COMP%]{display:flex;flex-direction:row;justify-content:space-around}.items-x[_ngcontent-%COMP%]{font-size:small}.items-total-price[_ngcontent-%COMP%]{font-size:large;font-weight:600;color:#f80}.proceed-btn[_ngcontent-%COMP%]{position:relative;width:351px;height:50px;box-shadow:1px 2px 10px 1px #9f9d9d;border-radius:0rem 0rem .9rem .9rem;background-color:var(--red-card);color:var(--text);cursor:pointer;justify-content:space-around;align-items:center;display:flex}.proceed-btn[_ngcontent-%COMP%]{font-size:medium;font-weight:600;color:#f80}.proceed-btn[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]{font-size:large;font-weight:600;color:#595656}",
                    ],
                    data: { animation: [e$, t$] },
                  })),
                  t
                );
              })(),
              canActivate: [Zr],
            },
            {
              path: "orderdetaile/:id",
              component: (() => {
                class t {}
                return (
                  (t.ɵfac = function (n) {
                    return new (n || t)();
                  }),
                  (t.ɵcmp = Xt({
                    type: t,
                    selectors: [["app-order-details"]],
                    decls: 0,
                    vars: 0,
                    template: function (n, r) {},
                  })),
                  t
                );
              })(),
              canActivate: [Zr],
            },
            {
              path: "historyDetailes/:id",
              component: (() => {
                class t {}
                return (
                  (t.ɵfac = function (n) {
                    return new (n || t)();
                  }),
                  (t.ɵcmp = Xt({
                    type: t,
                    selectors: [["app-order-history-details"]],
                    decls: 2,
                    vars: 0,
                    template: function (n, r) {
                      1 & n &&
                        (D(0, "p"), S(1, "order-history-details works!"), b());
                    },
                  })),
                  t
                );
              })(),
              canActivate: [Zr],
            },
          ],
        },
        { path: "poslogin", component: Yj },
      ];
      let f$ = (() => {
          class t {}
          return (
            (t.ɵfac = function (n) {
              return new (n || t)();
            }),
            (t.ɵmod = Mt({ type: t })),
            (t.ɵinj = pt({ imports: [gE.forRoot(d$), gE] })),
            t
          );
        })(),
        h$ = (() => {
          class t {
            constructor() {
              this.title = "pos-app";
            }
          }
          return (
            (t.ɵfac = function (n) {
              return new (n || t)();
            }),
            (t.ɵcmp = Xt({
              type: t,
              selectors: [["app-root"]],
              decls: 1,
              vars: 0,
              template: function (n, r) {
                1 & n && Ae(0, "router-outlet");
              },
              dependencies: [Yl],
            })),
            t
          );
        })();
      function mS(t) {
        return new v(3e3, !1);
      }
      function br(t) {
        switch (t.length) {
          case 0:
            return new qs();
          case 1:
            return t[0];
          default:
            return new gS(t);
        }
      }
      function yS(t, e, n = new Map(), r = new Map()) {
        const o = [],
          i = [];
        let s = -1,
          a = null;
        if (
          (e.forEach((l) => {
            const u = l.get("offset"),
              c = u == s,
              d = (c && a) || new Map();
            l.forEach((f, h) => {
              let p = h,
                g = f;
              if ("offset" !== h)
                switch (((p = t.normalizePropertyName(p, o)), g)) {
                  case "!":
                    g = n.get(h);
                    break;
                  case nr:
                    g = r.get(h);
                    break;
                  default:
                    g = t.normalizeStyleValue(h, p, g, o);
                }
              d.set(p, g);
            }),
              c || i.push(d),
              (a = d),
              (s = u);
          }),
          o.length)
        )
          throw (function k$(t) {
            return new v(3502, !1);
          })();
        return i;
      }
      function Lp(t, e, n, r) {
        switch (e) {
          case "start":
            t.onStart(() => r(n && Vp(n, "start", t)));
            break;
          case "done":
            t.onDone(() => r(n && Vp(n, "done", t)));
            break;
          case "destroy":
            t.onDestroy(() => r(n && Vp(n, "destroy", t)));
        }
      }
      function Vp(t, e, n) {
        const i = Bp(
            t.element,
            t.triggerName,
            t.fromState,
            t.toState,
            e || t.phaseName,
            n.totalTime ?? t.totalTime,
            !!n.disabled
          ),
          s = t._data;
        return null != s && (i._data = s), i;
      }
      function Bp(t, e, n, r, o = "", i = 0, s) {
        return {
          element: t,
          triggerName: e,
          fromState: n,
          toState: r,
          phaseName: o,
          totalTime: i,
          disabled: !!s,
        };
      }
      function Ft(t, e, n) {
        let r = t.get(e);
        return r || t.set(e, (r = n)), r;
      }
      function vS(t) {
        const e = t.indexOf(":");
        return [t.substring(1, e), t.slice(e + 1)];
      }
      const K$ = (() =>
        typeof document > "u" ? null : document.documentElement)();
      function Hp(t) {
        const e = t.parentNode || t.host || null;
        return e === K$ ? null : e;
      }
      let ro = null,
        _S = !1;
      function CS(t, e) {
        for (; e; ) {
          if (e === t) return !0;
          e = Hp(e);
        }
        return !1;
      }
      function DS(t, e, n) {
        if (n) return Array.from(t.querySelectorAll(e));
        const r = t.querySelector(e);
        return r ? [r] : [];
      }
      let wS = (() => {
          class t {
            validateStyleProperty(n) {
              return (function Z$(t) {
                ro ||
                  ((ro =
                    (function Y$() {
                      return typeof document < "u" ? document.body : null;
                    })() || {}),
                  (_S = !!ro.style && "WebkitAppearance" in ro.style));
                let e = !0;
                return (
                  ro.style &&
                    !(function Q$(t) {
                      return "ebkit" == t.substring(1, 6);
                    })(t) &&
                    ((e = t in ro.style),
                    !e &&
                      _S &&
                      (e =
                        "Webkit" + t.charAt(0).toUpperCase() + t.slice(1) in
                        ro.style)),
                  e
                );
              })(n);
            }
            matchesElement(n, r) {
              return !1;
            }
            containsElement(n, r) {
              return CS(n, r);
            }
            getParentElement(n) {
              return Hp(n);
            }
            query(n, r, o) {
              return DS(n, r, o);
            }
            computeStyle(n, r, o) {
              return o || "";
            }
            animate(n, r, o, i, s, a = [], l) {
              return new qs(o, i);
            }
          }
          return (
            (t.ɵfac = function (n) {
              return new (n || t)();
            }),
            (t.ɵprov = N({ token: t, factory: t.ɵfac })),
            t
          );
        })(),
        jp = (() => {
          class t {}
          return (t.NOOP = new wS()), t;
        })();
      const X$ = 1e3,
        $p = "ng-enter",
        Pu = "ng-leave",
        Nu = "ng-trigger",
        xu = ".ng-trigger",
        ES = "ng-animating",
        Up = ".ng-animating";
      function rr(t) {
        if ("number" == typeof t) return t;
        const e = t.match(/^(-?[\.\d]+)(m?s)/);
        return !e || e.length < 2 ? 0 : zp(parseFloat(e[1]), e[2]);
      }
      function zp(t, e) {
        return "s" === e ? t * X$ : t;
      }
      function Ru(t, e, n) {
        return t.hasOwnProperty("duration")
          ? t
          : (function eU(t, e, n) {
              let o,
                i = 0,
                s = "";
              if ("string" == typeof t) {
                const a = t.match(
                  /^(-?[\.\d]+)(m?s)(?:\s+(-?[\.\d]+)(m?s))?(?:\s+([-a-z]+(?:\(.+?\))?))?$/i
                );
                if (null === a)
                  return e.push(mS()), { duration: 0, delay: 0, easing: "" };
                o = zp(parseFloat(a[1]), a[2]);
                const l = a[3];
                null != l && (i = zp(parseFloat(l), a[4]));
                const u = a[5];
                u && (s = u);
              } else o = t;
              if (!n) {
                let a = !1,
                  l = e.length;
                o < 0 &&
                  (e.push(
                    (function p$() {
                      return new v(3100, !1);
                    })()
                  ),
                  (a = !0)),
                  i < 0 &&
                    (e.push(
                      (function g$() {
                        return new v(3101, !1);
                      })()
                    ),
                    (a = !0)),
                  a && e.splice(l, 0, mS());
              }
              return { duration: o, delay: i, easing: s };
            })(t, e, n);
      }
      function Gs(t, e = {}) {
        return (
          Object.keys(t).forEach((n) => {
            e[n] = t[n];
          }),
          e
        );
      }
      function SS(t) {
        const e = new Map();
        return (
          Object.keys(t).forEach((n) => {
            e.set(n, t[n]);
          }),
          e
        );
      }
      function Er(t, e = new Map(), n) {
        if (n) for (let [r, o] of n) e.set(r, o);
        for (let [r, o] of t) e.set(r, o);
        return e;
      }
      function Fn(t, e, n) {
        e.forEach((r, o) => {
          const i = Gp(o);
          n && !n.has(o) && n.set(o, t.style[i]), (t.style[i] = r);
        });
      }
      function oo(t, e) {
        e.forEach((n, r) => {
          const o = Gp(r);
          t.style[o] = "";
        });
      }
      function Ws(t) {
        return Array.isArray(t) ? (1 == t.length ? t[0] : fS(t)) : t;
      }
      const qp = new RegExp("{{\\s*(.+?)\\s*}}", "g");
      function TS(t) {
        let e = [];
        if ("string" == typeof t) {
          let n;
          for (; (n = qp.exec(t)); ) e.push(n[1]);
          qp.lastIndex = 0;
        }
        return e;
      }
      function Ks(t, e, n) {
        const r = t.toString(),
          o = r.replace(qp, (i, s) => {
            let a = e[s];
            return (
              null == a &&
                (n.push(
                  (function y$(t) {
                    return new v(3003, !1);
                  })()
                ),
                (a = "")),
              a.toString()
            );
          });
        return o == r ? t : o;
      }
      function Fu(t) {
        const e = [];
        let n = t.next();
        for (; !n.done; ) e.push(n.value), (n = t.next());
        return e;
      }
      const rU = /-+([a-z0-9])/g;
      function Gp(t) {
        return t.replace(rU, (...e) => e[1].toUpperCase());
      }
      function kt(t, e, n) {
        switch (e.type) {
          case 7:
            return t.visitTrigger(e, n);
          case 0:
            return t.visitState(e, n);
          case 1:
            return t.visitTransition(e, n);
          case 2:
            return t.visitSequence(e, n);
          case 3:
            return t.visitGroup(e, n);
          case 4:
            return t.visitAnimate(e, n);
          case 5:
            return t.visitKeyframes(e, n);
          case 6:
            return t.visitStyle(e, n);
          case 8:
            return t.visitReference(e, n);
          case 9:
            return t.visitAnimateChild(e, n);
          case 10:
            return t.visitAnimateRef(e, n);
          case 11:
            return t.visitQuery(e, n);
          case 12:
            return t.visitStagger(e, n);
          default:
            throw (function v$(t) {
              return new v(3004, !1);
            })();
        }
      }
      function AS(t, e) {
        return window.getComputedStyle(t)[e];
      }
      const ku = "*";
      function sU(t, e) {
        const n = [];
        return (
          "string" == typeof t
            ? t.split(/\s*,\s*/).forEach((r) =>
                (function aU(t, e, n) {
                  if (":" == t[0]) {
                    const l = (function lU(t, e) {
                      switch (t) {
                        case ":enter":
                          return "void => *";
                        case ":leave":
                          return "* => void";
                        case ":increment":
                          return (n, r) => parseFloat(r) > parseFloat(n);
                        case ":decrement":
                          return (n, r) => parseFloat(r) < parseFloat(n);
                        default:
                          return (
                            e.push(
                              (function N$(t) {
                                return new v(3016, !1);
                              })()
                            ),
                            "* => *"
                          );
                      }
                    })(t, n);
                    if ("function" == typeof l) return void e.push(l);
                    t = l;
                  }
                  const r = t.match(/^(\*|[-\w]+)\s*(<?[=-]>)\s*(\*|[-\w]+)$/);
                  if (null == r || r.length < 4)
                    return (
                      n.push(
                        (function P$(t) {
                          return new v(3015, !1);
                        })()
                      ),
                      e
                    );
                  const o = r[1],
                    i = r[2],
                    s = r[3];
                  e.push(IS(o, s));
                  "<" == i[0] && !(o == ku && s == ku) && e.push(IS(s, o));
                })(r, n, e)
              )
            : n.push(t),
          n
        );
      }
      const Lu = new Set(["true", "1"]),
        Vu = new Set(["false", "0"]);
      function IS(t, e) {
        const n = Lu.has(t) || Vu.has(t),
          r = Lu.has(e) || Vu.has(e);
        return (o, i) => {
          let s = t == ku || t == o,
            a = e == ku || e == i;
          return (
            !s && n && "boolean" == typeof o && (s = o ? Lu.has(t) : Vu.has(t)),
            !a && r && "boolean" == typeof i && (a = i ? Lu.has(e) : Vu.has(e)),
            s && a
          );
        };
      }
      const uU = new RegExp("s*:selfs*,?", "g");
      function Wp(t, e, n, r) {
        return new cU(t).build(e, n, r);
      }
      class cU {
        constructor(e) {
          this._driver = e;
        }
        build(e, n, r) {
          const o = new hU(n);
          return this._resetContextStyleTimingState(o), kt(this, Ws(e), o);
        }
        _resetContextStyleTimingState(e) {
          (e.currentQuerySelector = ""),
            (e.collectedStyles = new Map()),
            e.collectedStyles.set("", new Map()),
            (e.currentTime = 0);
        }
        visitTrigger(e, n) {
          let r = (n.queryCount = 0),
            o = (n.depCount = 0);
          const i = [],
            s = [];
          return (
            "@" == e.name.charAt(0) &&
              n.errors.push(
                (function C$() {
                  return new v(3006, !1);
                })()
              ),
            e.definitions.forEach((a) => {
              if ((this._resetContextStyleTimingState(n), 0 == a.type)) {
                const l = a,
                  u = l.name;
                u
                  .toString()
                  .split(/\s*,\s*/)
                  .forEach((c) => {
                    (l.name = c), i.push(this.visitState(l, n));
                  }),
                  (l.name = u);
              } else if (1 == a.type) {
                const l = this.visitTransition(a, n);
                (r += l.queryCount), (o += l.depCount), s.push(l);
              } else
                n.errors.push(
                  (function D$() {
                    return new v(3007, !1);
                  })()
                );
            }),
            {
              type: 7,
              name: e.name,
              states: i,
              transitions: s,
              queryCount: r,
              depCount: o,
              options: null,
            }
          );
        }
        visitState(e, n) {
          const r = this.visitStyle(e.styles, n),
            o = (e.options && e.options.params) || null;
          if (r.containsDynamicStyles) {
            const i = new Set(),
              s = o || {};
            r.styles.forEach((a) => {
              a instanceof Map &&
                a.forEach((l) => {
                  TS(l).forEach((u) => {
                    s.hasOwnProperty(u) || i.add(u);
                  });
                });
            }),
              i.size &&
                (Fu(i.values()),
                n.errors.push(
                  (function w$(t, e) {
                    return new v(3008, !1);
                  })()
                ));
          }
          return {
            type: 0,
            name: e.name,
            style: r,
            options: o ? { params: o } : null,
          };
        }
        visitTransition(e, n) {
          (n.queryCount = 0), (n.depCount = 0);
          const r = kt(this, Ws(e.animation), n);
          return {
            type: 1,
            matchers: sU(e.expr, n.errors),
            animation: r,
            queryCount: n.queryCount,
            depCount: n.depCount,
            options: io(e.options),
          };
        }
        visitSequence(e, n) {
          return {
            type: 2,
            steps: e.steps.map((r) => kt(this, r, n)),
            options: io(e.options),
          };
        }
        visitGroup(e, n) {
          const r = n.currentTime;
          let o = 0;
          const i = e.steps.map((s) => {
            n.currentTime = r;
            const a = kt(this, s, n);
            return (o = Math.max(o, n.currentTime)), a;
          });
          return (
            (n.currentTime = o), { type: 3, steps: i, options: io(e.options) }
          );
        }
        visitAnimate(e, n) {
          const r = (function gU(t, e) {
            if (t.hasOwnProperty("duration")) return t;
            if ("number" == typeof t) return Kp(Ru(t, e).duration, 0, "");
            const n = t;
            if (
              n
                .split(/\s+/)
                .some((i) => "{" == i.charAt(0) && "{" == i.charAt(1))
            ) {
              const i = Kp(0, 0, "");
              return (i.dynamic = !0), (i.strValue = n), i;
            }
            const o = Ru(n, e);
            return Kp(o.duration, o.delay, o.easing);
          })(e.timings, n.errors);
          n.currentAnimateTimings = r;
          let o,
            i = e.styles ? e.styles : cn({});
          if (5 == i.type) o = this.visitKeyframes(i, n);
          else {
            let s = e.styles,
              a = !1;
            if (!s) {
              a = !0;
              const u = {};
              r.easing && (u.easing = r.easing), (s = cn(u));
            }
            n.currentTime += r.duration + r.delay;
            const l = this.visitStyle(s, n);
            (l.isEmptyStep = a), (o = l);
          }
          return (
            (n.currentAnimateTimings = null),
            { type: 4, timings: r, style: o, options: null }
          );
        }
        visitStyle(e, n) {
          const r = this._makeStyleAst(e, n);
          return this._validateStyleAst(r, n), r;
        }
        _makeStyleAst(e, n) {
          const r = [],
            o = Array.isArray(e.styles) ? e.styles : [e.styles];
          for (let a of o)
            "string" == typeof a
              ? a === nr
                ? r.push(a)
                : n.errors.push(new v(3002, !1))
              : r.push(SS(a));
          let i = !1,
            s = null;
          return (
            r.forEach((a) => {
              if (
                a instanceof Map &&
                (a.has("easing") && ((s = a.get("easing")), a.delete("easing")),
                !i)
              )
                for (let l of a.values())
                  if (l.toString().indexOf("{{") >= 0) {
                    i = !0;
                    break;
                  }
            }),
            {
              type: 6,
              styles: r,
              easing: s,
              offset: e.offset,
              containsDynamicStyles: i,
              options: null,
            }
          );
        }
        _validateStyleAst(e, n) {
          const r = n.currentAnimateTimings;
          let o = n.currentTime,
            i = n.currentTime;
          r && i > 0 && (i -= r.duration + r.delay),
            e.styles.forEach((s) => {
              "string" != typeof s &&
                s.forEach((a, l) => {
                  const u = n.collectedStyles.get(n.currentQuerySelector),
                    c = u.get(l);
                  let d = !0;
                  c &&
                    (i != o &&
                      i >= c.startTime &&
                      o <= c.endTime &&
                      (n.errors.push(
                        (function E$(t, e, n, r, o) {
                          return new v(3010, !1);
                        })()
                      ),
                      (d = !1)),
                    (i = c.startTime)),
                    d && u.set(l, { startTime: i, endTime: o }),
                    n.options &&
                      (function nU(t, e, n) {
                        const r = e.params || {},
                          o = TS(t);
                        o.length &&
                          o.forEach((i) => {
                            r.hasOwnProperty(i) ||
                              n.push(
                                (function m$(t) {
                                  return new v(3001, !1);
                                })()
                              );
                          });
                      })(a, n.options, n.errors);
                });
            });
        }
        visitKeyframes(e, n) {
          const r = { type: 5, styles: [], options: null };
          if (!n.currentAnimateTimings)
            return (
              n.errors.push(
                (function S$() {
                  return new v(3011, !1);
                })()
              ),
              r
            );
          let i = 0;
          const s = [];
          let a = !1,
            l = !1,
            u = 0;
          const c = e.steps.map((_) => {
            const m = this._makeStyleAst(_, n);
            let E =
                null != m.offset
                  ? m.offset
                  : (function pU(t) {
                      if ("string" == typeof t) return null;
                      let e = null;
                      if (Array.isArray(t))
                        t.forEach((n) => {
                          if (n instanceof Map && n.has("offset")) {
                            const r = n;
                            (e = parseFloat(r.get("offset"))),
                              r.delete("offset");
                          }
                        });
                      else if (t instanceof Map && t.has("offset")) {
                        const n = t;
                        (e = parseFloat(n.get("offset"))), n.delete("offset");
                      }
                      return e;
                    })(m.styles),
              P = 0;
            return (
              null != E && (i++, (P = m.offset = E)),
              (l = l || P < 0 || P > 1),
              (a = a || P < u),
              (u = P),
              s.push(P),
              m
            );
          });
          l &&
            n.errors.push(
              (function M$() {
                return new v(3012, !1);
              })()
            ),
            a &&
              n.errors.push(
                (function T$() {
                  return new v(3200, !1);
                })()
              );
          const d = e.steps.length;
          let f = 0;
          i > 0 && i < d
            ? n.errors.push(
                (function A$() {
                  return new v(3202, !1);
                })()
              )
            : 0 == i && (f = 1 / (d - 1));
          const h = d - 1,
            p = n.currentTime,
            g = n.currentAnimateTimings,
            y = g.duration;
          return (
            c.forEach((_, m) => {
              const E = f > 0 ? (m == h ? 1 : f * m) : s[m],
                P = E * y;
              (n.currentTime = p + g.delay + P),
                (g.duration = P),
                this._validateStyleAst(_, n),
                (_.offset = E),
                r.styles.push(_);
            }),
            r
          );
        }
        visitReference(e, n) {
          return {
            type: 8,
            animation: kt(this, Ws(e.animation), n),
            options: io(e.options),
          };
        }
        visitAnimateChild(e, n) {
          return n.depCount++, { type: 9, options: io(e.options) };
        }
        visitAnimateRef(e, n) {
          return {
            type: 10,
            animation: this.visitReference(e.animation, n),
            options: io(e.options),
          };
        }
        visitQuery(e, n) {
          const r = n.currentQuerySelector,
            o = e.options || {};
          n.queryCount++, (n.currentQuery = e);
          const [i, s] = (function dU(t) {
            const e = !!t.split(/\s*,\s*/).find((n) => ":self" == n);
            return (
              e && (t = t.replace(uU, "")),
              (t = t
                .replace(/@\*/g, xu)
                .replace(/@\w+/g, (n) => xu + "-" + n.slice(1))
                .replace(/:animating/g, Up)),
              [t, e]
            );
          })(e.selector);
          (n.currentQuerySelector = r.length ? r + " " + i : i),
            Ft(n.collectedStyles, n.currentQuerySelector, new Map());
          const a = kt(this, Ws(e.animation), n);
          return (
            (n.currentQuery = null),
            (n.currentQuerySelector = r),
            {
              type: 11,
              selector: i,
              limit: o.limit || 0,
              optional: !!o.optional,
              includeSelf: s,
              animation: a,
              originalSelector: e.selector,
              options: io(e.options),
            }
          );
        }
        visitStagger(e, n) {
          n.currentQuery ||
            n.errors.push(
              (function I$() {
                return new v(3013, !1);
              })()
            );
          const r =
            "full" === e.timings
              ? { duration: 0, delay: 0, easing: "full" }
              : Ru(e.timings, n.errors, !0);
          return {
            type: 12,
            animation: kt(this, Ws(e.animation), n),
            timings: r,
            options: null,
          };
        }
      }
      class hU {
        constructor(e) {
          (this.errors = e),
            (this.queryCount = 0),
            (this.depCount = 0),
            (this.currentTransition = null),
            (this.currentQuery = null),
            (this.currentQuerySelector = null),
            (this.currentAnimateTimings = null),
            (this.currentTime = 0),
            (this.collectedStyles = new Map()),
            (this.options = null),
            (this.unsupportedCSSPropertiesFound = new Set());
        }
      }
      function io(t) {
        return (
          t
            ? (t = Gs(t)).params &&
              (t.params = (function fU(t) {
                return t ? Gs(t) : null;
              })(t.params))
            : (t = {}),
          t
        );
      }
      function Kp(t, e, n) {
        return { duration: t, delay: e, easing: n };
      }
      function Qp(t, e, n, r, o, i, s = null, a = !1) {
        return {
          type: 1,
          element: t,
          keyframes: e,
          preStyleProps: n,
          postStyleProps: r,
          duration: o,
          delay: i,
          totalTime: o + i,
          easing: s,
          subTimeline: a,
        };
      }
      class Bu {
        constructor() {
          this._map = new Map();
        }
        get(e) {
          return this._map.get(e) || [];
        }
        append(e, n) {
          let r = this._map.get(e);
          r || this._map.set(e, (r = [])), r.push(...n);
        }
        has(e) {
          return this._map.has(e);
        }
        clear() {
          this._map.clear();
        }
      }
      const vU = new RegExp(":enter", "g"),
        CU = new RegExp(":leave", "g");
      function Zp(t, e, n, r, o, i = new Map(), s = new Map(), a, l, u = []) {
        return new DU().buildKeyframes(t, e, n, r, o, i, s, a, l, u);
      }
      class DU {
        buildKeyframes(e, n, r, o, i, s, a, l, u, c = []) {
          u = u || new Bu();
          const d = new Yp(e, n, u, o, i, c, []);
          d.options = l;
          const f = l.delay ? rr(l.delay) : 0;
          d.currentTimeline.delayNextStep(f),
            d.currentTimeline.setStyles([s], null, d.errors, l),
            kt(this, r, d);
          const h = d.timelines.filter((p) => p.containsAnimation());
          if (h.length && a.size) {
            let p;
            for (let g = h.length - 1; g >= 0; g--) {
              const y = h[g];
              if (y.element === n) {
                p = y;
                break;
              }
            }
            p &&
              !p.allowOnlyTimelineStyles() &&
              p.setStyles([a], null, d.errors, l);
          }
          return h.length
            ? h.map((p) => p.buildKeyframes())
            : [Qp(n, [], [], [], 0, f, "", !1)];
        }
        visitTrigger(e, n) {}
        visitState(e, n) {}
        visitTransition(e, n) {}
        visitAnimateChild(e, n) {
          const r = n.subInstructions.get(n.element);
          if (r) {
            const o = n.createSubContext(e.options),
              i = n.currentTimeline.currentTime,
              s = this._visitSubInstructions(r, o, o.options);
            i != s && n.transformIntoNewTimeline(s);
          }
          n.previousNode = e;
        }
        visitAnimateRef(e, n) {
          const r = n.createSubContext(e.options);
          r.transformIntoNewTimeline(),
            this._applyAnimationRefDelays(
              [e.options, e.animation.options],
              n,
              r
            ),
            this.visitReference(e.animation, r),
            n.transformIntoNewTimeline(r.currentTimeline.currentTime),
            (n.previousNode = e);
        }
        _applyAnimationRefDelays(e, n, r) {
          for (const o of e) {
            const i = o?.delay;
            if (i) {
              const s =
                "number" == typeof i ? i : rr(Ks(i, o?.params ?? {}, n.errors));
              r.delayNextStep(s);
            }
          }
        }
        _visitSubInstructions(e, n, r) {
          let i = n.currentTimeline.currentTime;
          const s = null != r.duration ? rr(r.duration) : null,
            a = null != r.delay ? rr(r.delay) : null;
          return (
            0 !== s &&
              e.forEach((l) => {
                const u = n.appendInstructionToTimeline(l, s, a);
                i = Math.max(i, u.duration + u.delay);
              }),
            i
          );
        }
        visitReference(e, n) {
          n.updateOptions(e.options, !0),
            kt(this, e.animation, n),
            (n.previousNode = e);
        }
        visitSequence(e, n) {
          const r = n.subContextCount;
          let o = n;
          const i = e.options;
          if (
            i &&
            (i.params || i.delay) &&
            ((o = n.createSubContext(i)),
            o.transformIntoNewTimeline(),
            null != i.delay)
          ) {
            6 == o.previousNode.type &&
              (o.currentTimeline.snapshotCurrentStyles(),
              (o.previousNode = Hu));
            const s = rr(i.delay);
            o.delayNextStep(s);
          }
          e.steps.length &&
            (e.steps.forEach((s) => kt(this, s, o)),
            o.currentTimeline.applyStylesToKeyframe(),
            o.subContextCount > r && o.transformIntoNewTimeline()),
            (n.previousNode = e);
        }
        visitGroup(e, n) {
          const r = [];
          let o = n.currentTimeline.currentTime;
          const i = e.options && e.options.delay ? rr(e.options.delay) : 0;
          e.steps.forEach((s) => {
            const a = n.createSubContext(e.options);
            i && a.delayNextStep(i),
              kt(this, s, a),
              (o = Math.max(o, a.currentTimeline.currentTime)),
              r.push(a.currentTimeline);
          }),
            r.forEach((s) => n.currentTimeline.mergeTimelineCollectedStyles(s)),
            n.transformIntoNewTimeline(o),
            (n.previousNode = e);
        }
        _visitTiming(e, n) {
          if (e.dynamic) {
            const r = e.strValue;
            return Ru(n.params ? Ks(r, n.params, n.errors) : r, n.errors);
          }
          return { duration: e.duration, delay: e.delay, easing: e.easing };
        }
        visitAnimate(e, n) {
          const r = (n.currentAnimateTimings = this._visitTiming(e.timings, n)),
            o = n.currentTimeline;
          r.delay && (n.incrementTime(r.delay), o.snapshotCurrentStyles());
          const i = e.style;
          5 == i.type
            ? this.visitKeyframes(i, n)
            : (n.incrementTime(r.duration),
              this.visitStyle(i, n),
              o.applyStylesToKeyframe()),
            (n.currentAnimateTimings = null),
            (n.previousNode = e);
        }
        visitStyle(e, n) {
          const r = n.currentTimeline,
            o = n.currentAnimateTimings;
          !o && r.hasCurrentStyleProperties() && r.forwardFrame();
          const i = (o && o.easing) || e.easing;
          e.isEmptyStep
            ? r.applyEmptyStep(i)
            : r.setStyles(e.styles, i, n.errors, n.options),
            (n.previousNode = e);
        }
        visitKeyframes(e, n) {
          const r = n.currentAnimateTimings,
            o = n.currentTimeline.duration,
            i = r.duration,
            a = n.createSubContext().currentTimeline;
          (a.easing = r.easing),
            e.styles.forEach((l) => {
              a.forwardTime((l.offset || 0) * i),
                a.setStyles(l.styles, l.easing, n.errors, n.options),
                a.applyStylesToKeyframe();
            }),
            n.currentTimeline.mergeTimelineCollectedStyles(a),
            n.transformIntoNewTimeline(o + i),
            (n.previousNode = e);
        }
        visitQuery(e, n) {
          const r = n.currentTimeline.currentTime,
            o = e.options || {},
            i = o.delay ? rr(o.delay) : 0;
          i &&
            (6 === n.previousNode.type ||
              (0 == r && n.currentTimeline.hasCurrentStyleProperties())) &&
            (n.currentTimeline.snapshotCurrentStyles(), (n.previousNode = Hu));
          let s = r;
          const a = n.invokeQuery(
            e.selector,
            e.originalSelector,
            e.limit,
            e.includeSelf,
            !!o.optional,
            n.errors
          );
          n.currentQueryTotal = a.length;
          let l = null;
          a.forEach((u, c) => {
            n.currentQueryIndex = c;
            const d = n.createSubContext(e.options, u);
            i && d.delayNextStep(i),
              u === n.element && (l = d.currentTimeline),
              kt(this, e.animation, d),
              d.currentTimeline.applyStylesToKeyframe(),
              (s = Math.max(s, d.currentTimeline.currentTime));
          }),
            (n.currentQueryIndex = 0),
            (n.currentQueryTotal = 0),
            n.transformIntoNewTimeline(s),
            l &&
              (n.currentTimeline.mergeTimelineCollectedStyles(l),
              n.currentTimeline.snapshotCurrentStyles()),
            (n.previousNode = e);
        }
        visitStagger(e, n) {
          const r = n.parentContext,
            o = n.currentTimeline,
            i = e.timings,
            s = Math.abs(i.duration),
            a = s * (n.currentQueryTotal - 1);
          let l = s * n.currentQueryIndex;
          switch (i.duration < 0 ? "reverse" : i.easing) {
            case "reverse":
              l = a - l;
              break;
            case "full":
              l = r.currentStaggerTime;
          }
          const c = n.currentTimeline;
          l && c.delayNextStep(l);
          const d = c.currentTime;
          kt(this, e.animation, n),
            (n.previousNode = e),
            (r.currentStaggerTime =
              o.currentTime - d + (o.startTime - r.currentTimeline.startTime));
        }
      }
      const Hu = {};
      class Yp {
        constructor(e, n, r, o, i, s, a, l) {
          (this._driver = e),
            (this.element = n),
            (this.subInstructions = r),
            (this._enterClassName = o),
            (this._leaveClassName = i),
            (this.errors = s),
            (this.timelines = a),
            (this.parentContext = null),
            (this.currentAnimateTimings = null),
            (this.previousNode = Hu),
            (this.subContextCount = 0),
            (this.options = {}),
            (this.currentQueryIndex = 0),
            (this.currentQueryTotal = 0),
            (this.currentStaggerTime = 0),
            (this.currentTimeline = l || new ju(this._driver, n, 0)),
            a.push(this.currentTimeline);
        }
        get params() {
          return this.options.params;
        }
        updateOptions(e, n) {
          if (!e) return;
          const r = e;
          let o = this.options;
          null != r.duration && (o.duration = rr(r.duration)),
            null != r.delay && (o.delay = rr(r.delay));
          const i = r.params;
          if (i) {
            let s = o.params;
            s || (s = this.options.params = {}),
              Object.keys(i).forEach((a) => {
                (!n || !s.hasOwnProperty(a)) &&
                  (s[a] = Ks(i[a], s, this.errors));
              });
          }
        }
        _copyOptions() {
          const e = {};
          if (this.options) {
            const n = this.options.params;
            if (n) {
              const r = (e.params = {});
              Object.keys(n).forEach((o) => {
                r[o] = n[o];
              });
            }
          }
          return e;
        }
        createSubContext(e = null, n, r) {
          const o = n || this.element,
            i = new Yp(
              this._driver,
              o,
              this.subInstructions,
              this._enterClassName,
              this._leaveClassName,
              this.errors,
              this.timelines,
              this.currentTimeline.fork(o, r || 0)
            );
          return (
            (i.previousNode = this.previousNode),
            (i.currentAnimateTimings = this.currentAnimateTimings),
            (i.options = this._copyOptions()),
            i.updateOptions(e),
            (i.currentQueryIndex = this.currentQueryIndex),
            (i.currentQueryTotal = this.currentQueryTotal),
            (i.parentContext = this),
            this.subContextCount++,
            i
          );
        }
        transformIntoNewTimeline(e) {
          return (
            (this.previousNode = Hu),
            (this.currentTimeline = this.currentTimeline.fork(this.element, e)),
            this.timelines.push(this.currentTimeline),
            this.currentTimeline
          );
        }
        appendInstructionToTimeline(e, n, r) {
          const o = {
              duration: n ?? e.duration,
              delay: this.currentTimeline.currentTime + (r ?? 0) + e.delay,
              easing: "",
            },
            i = new wU(
              this._driver,
              e.element,
              e.keyframes,
              e.preStyleProps,
              e.postStyleProps,
              o,
              e.stretchStartingKeyframe
            );
          return this.timelines.push(i), o;
        }
        incrementTime(e) {
          this.currentTimeline.forwardTime(this.currentTimeline.duration + e);
        }
        delayNextStep(e) {
          e > 0 && this.currentTimeline.delayNextStep(e);
        }
        invokeQuery(e, n, r, o, i, s) {
          let a = [];
          if ((o && a.push(this.element), e.length > 0)) {
            e = (e = e.replace(vU, "." + this._enterClassName)).replace(
              CU,
              "." + this._leaveClassName
            );
            let u = this._driver.query(this.element, e, 1 != r);
            0 !== r &&
              (u = r < 0 ? u.slice(u.length + r, u.length) : u.slice(0, r)),
              a.push(...u);
          }
          return (
            !i &&
              0 == a.length &&
              s.push(
                (function O$(t) {
                  return new v(3014, !1);
                })()
              ),
            a
          );
        }
      }
      class ju {
        constructor(e, n, r, o) {
          (this._driver = e),
            (this.element = n),
            (this.startTime = r),
            (this._elementTimelineStylesLookup = o),
            (this.duration = 0),
            (this.easing = null),
            (this._previousKeyframe = new Map()),
            (this._currentKeyframe = new Map()),
            (this._keyframes = new Map()),
            (this._styleSummary = new Map()),
            (this._localTimelineStyles = new Map()),
            (this._pendingStyles = new Map()),
            (this._backFill = new Map()),
            (this._currentEmptyStepKeyframe = null),
            this._elementTimelineStylesLookup ||
              (this._elementTimelineStylesLookup = new Map()),
            (this._globalTimelineStyles =
              this._elementTimelineStylesLookup.get(n)),
            this._globalTimelineStyles ||
              ((this._globalTimelineStyles = this._localTimelineStyles),
              this._elementTimelineStylesLookup.set(
                n,
                this._localTimelineStyles
              )),
            this._loadKeyframe();
        }
        containsAnimation() {
          switch (this._keyframes.size) {
            case 0:
              return !1;
            case 1:
              return this.hasCurrentStyleProperties();
            default:
              return !0;
          }
        }
        hasCurrentStyleProperties() {
          return this._currentKeyframe.size > 0;
        }
        get currentTime() {
          return this.startTime + this.duration;
        }
        delayNextStep(e) {
          const n = 1 === this._keyframes.size && this._pendingStyles.size;
          this.duration || n
            ? (this.forwardTime(this.currentTime + e),
              n && this.snapshotCurrentStyles())
            : (this.startTime += e);
        }
        fork(e, n) {
          return (
            this.applyStylesToKeyframe(),
            new ju(
              this._driver,
              e,
              n || this.currentTime,
              this._elementTimelineStylesLookup
            )
          );
        }
        _loadKeyframe() {
          this._currentKeyframe &&
            (this._previousKeyframe = this._currentKeyframe),
            (this._currentKeyframe = this._keyframes.get(this.duration)),
            this._currentKeyframe ||
              ((this._currentKeyframe = new Map()),
              this._keyframes.set(this.duration, this._currentKeyframe));
        }
        forwardFrame() {
          (this.duration += 1), this._loadKeyframe();
        }
        forwardTime(e) {
          this.applyStylesToKeyframe(),
            (this.duration = e),
            this._loadKeyframe();
        }
        _updateStyle(e, n) {
          this._localTimelineStyles.set(e, n),
            this._globalTimelineStyles.set(e, n),
            this._styleSummary.set(e, { time: this.currentTime, value: n });
        }
        allowOnlyTimelineStyles() {
          return this._currentEmptyStepKeyframe !== this._currentKeyframe;
        }
        applyEmptyStep(e) {
          e && this._previousKeyframe.set("easing", e);
          for (let [n, r] of this._globalTimelineStyles)
            this._backFill.set(n, r || nr), this._currentKeyframe.set(n, nr);
          this._currentEmptyStepKeyframe = this._currentKeyframe;
        }
        setStyles(e, n, r, o) {
          n && this._previousKeyframe.set("easing", n);
          const i = (o && o.params) || {},
            s = (function bU(t, e) {
              const n = new Map();
              let r;
              return (
                t.forEach((o) => {
                  if ("*" === o) {
                    r = r || e.keys();
                    for (let i of r) n.set(i, nr);
                  } else Er(o, n);
                }),
                n
              );
            })(e, this._globalTimelineStyles);
          for (let [a, l] of s) {
            const u = Ks(l, i, r);
            this._pendingStyles.set(a, u),
              this._localTimelineStyles.has(a) ||
                this._backFill.set(a, this._globalTimelineStyles.get(a) ?? nr),
              this._updateStyle(a, u);
          }
        }
        applyStylesToKeyframe() {
          0 != this._pendingStyles.size &&
            (this._pendingStyles.forEach((e, n) => {
              this._currentKeyframe.set(n, e);
            }),
            this._pendingStyles.clear(),
            this._localTimelineStyles.forEach((e, n) => {
              this._currentKeyframe.has(n) || this._currentKeyframe.set(n, e);
            }));
        }
        snapshotCurrentStyles() {
          for (let [e, n] of this._localTimelineStyles)
            this._pendingStyles.set(e, n), this._updateStyle(e, n);
        }
        getFinalKeyframe() {
          return this._keyframes.get(this.duration);
        }
        get properties() {
          const e = [];
          for (let n in this._currentKeyframe) e.push(n);
          return e;
        }
        mergeTimelineCollectedStyles(e) {
          e._styleSummary.forEach((n, r) => {
            const o = this._styleSummary.get(r);
            (!o || n.time > o.time) && this._updateStyle(r, n.value);
          });
        }
        buildKeyframes() {
          this.applyStylesToKeyframe();
          const e = new Set(),
            n = new Set(),
            r = 1 === this._keyframes.size && 0 === this.duration;
          let o = [];
          this._keyframes.forEach((a, l) => {
            const u = Er(a, new Map(), this._backFill);
            u.forEach((c, d) => {
              "!" === c ? e.add(d) : c === nr && n.add(d);
            }),
              r || u.set("offset", l / this.duration),
              o.push(u);
          });
          const i = e.size ? Fu(e.values()) : [],
            s = n.size ? Fu(n.values()) : [];
          if (r) {
            const a = o[0],
              l = new Map(a);
            a.set("offset", 0), l.set("offset", 1), (o = [a, l]);
          }
          return Qp(
            this.element,
            o,
            i,
            s,
            this.duration,
            this.startTime,
            this.easing,
            !1
          );
        }
      }
      class wU extends ju {
        constructor(e, n, r, o, i, s, a = !1) {
          super(e, n, s.delay),
            (this.keyframes = r),
            (this.preStyleProps = o),
            (this.postStyleProps = i),
            (this._stretchStartingKeyframe = a),
            (this.timings = {
              duration: s.duration,
              delay: s.delay,
              easing: s.easing,
            });
        }
        containsAnimation() {
          return this.keyframes.length > 1;
        }
        buildKeyframes() {
          let e = this.keyframes,
            { delay: n, duration: r, easing: o } = this.timings;
          if (this._stretchStartingKeyframe && n) {
            const i = [],
              s = r + n,
              a = n / s,
              l = Er(e[0]);
            l.set("offset", 0), i.push(l);
            const u = Er(e[0]);
            u.set("offset", NS(a)), i.push(u);
            const c = e.length - 1;
            for (let d = 1; d <= c; d++) {
              let f = Er(e[d]);
              const h = f.get("offset");
              f.set("offset", NS((n + h * r) / s)), i.push(f);
            }
            (r = s), (n = 0), (o = ""), (e = i);
          }
          return Qp(
            this.element,
            e,
            this.preStyleProps,
            this.postStyleProps,
            r,
            n,
            o,
            !0
          );
        }
      }
      function NS(t, e = 3) {
        const n = Math.pow(10, e - 1);
        return Math.round(t * n) / n;
      }
      class Xp {}
      const EU = new Set([
        "width",
        "height",
        "minWidth",
        "minHeight",
        "maxWidth",
        "maxHeight",
        "left",
        "top",
        "bottom",
        "right",
        "fontSize",
        "outlineWidth",
        "outlineOffset",
        "paddingTop",
        "paddingLeft",
        "paddingBottom",
        "paddingRight",
        "marginTop",
        "marginLeft",
        "marginBottom",
        "marginRight",
        "borderRadius",
        "borderWidth",
        "borderTopWidth",
        "borderLeftWidth",
        "borderRightWidth",
        "borderBottomWidth",
        "textIndent",
        "perspective",
      ]);
      class SU extends Xp {
        normalizePropertyName(e, n) {
          return Gp(e);
        }
        normalizeStyleValue(e, n, r, o) {
          let i = "";
          const s = r.toString().trim();
          if (EU.has(n) && 0 !== r && "0" !== r)
            if ("number" == typeof r) i = "px";
            else {
              const a = r.match(/^[+-]?[\d\.]+([a-z]*)$/);
              a &&
                0 == a[1].length &&
                o.push(
                  (function _$(t, e) {
                    return new v(3005, !1);
                  })()
                );
            }
          return s + i;
        }
      }
      function xS(t, e, n, r, o, i, s, a, l, u, c, d, f) {
        return {
          type: 0,
          element: t,
          triggerName: e,
          isRemovalTransition: o,
          fromState: n,
          fromStyles: i,
          toState: r,
          toStyles: s,
          timelines: a,
          queriedElements: l,
          preStyleProps: u,
          postStyleProps: c,
          totalTime: d,
          errors: f,
        };
      }
      const Jp = {};
      class RS {
        constructor(e, n, r) {
          (this._triggerName = e), (this.ast = n), (this._stateStyles = r);
        }
        match(e, n, r, o) {
          return (function MU(t, e, n, r, o) {
            return t.some((i) => i(e, n, r, o));
          })(this.ast.matchers, e, n, r, o);
        }
        buildStyles(e, n, r) {
          let o = this._stateStyles.get("*");
          return (
            void 0 !== e && (o = this._stateStyles.get(e?.toString()) || o),
            o ? o.buildStyles(n, r) : new Map()
          );
        }
        build(e, n, r, o, i, s, a, l, u, c) {
          const d = [],
            f = (this.ast.options && this.ast.options.params) || Jp,
            p = this.buildStyles(r, (a && a.params) || Jp, d),
            g = (l && l.params) || Jp,
            y = this.buildStyles(o, g, d),
            _ = new Set(),
            m = new Map(),
            E = new Map(),
            P = "void" === o,
            R = { params: TU(g, f), delay: this.ast.options?.delay },
            le = c ? [] : Zp(e, n, this.ast.animation, i, s, p, y, R, u, d);
          let Be = 0;
          if (
            (le.forEach((fn) => {
              Be = Math.max(fn.duration + fn.delay, Be);
            }),
            d.length)
          )
            return xS(n, this._triggerName, r, o, P, p, y, [], [], m, E, Be, d);
          le.forEach((fn) => {
            const or = fn.element,
              QS = Ft(m, or, new Set());
            fn.preStyleProps.forEach((so) => QS.add(so));
            const Zs = Ft(E, or, new Set());
            fn.postStyleProps.forEach((so) => Zs.add(so)),
              or !== n && _.add(or);
          });
          const dn = Fu(_.values());
          return xS(n, this._triggerName, r, o, P, p, y, le, dn, m, E, Be);
        }
      }
      function TU(t, e) {
        const n = Gs(e);
        for (const r in t) t.hasOwnProperty(r) && null != t[r] && (n[r] = t[r]);
        return n;
      }
      class AU {
        constructor(e, n, r) {
          (this.styles = e), (this.defaultParams = n), (this.normalizer = r);
        }
        buildStyles(e, n) {
          const r = new Map(),
            o = Gs(this.defaultParams);
          return (
            Object.keys(e).forEach((i) => {
              const s = e[i];
              null !== s && (o[i] = s);
            }),
            this.styles.styles.forEach((i) => {
              "string" != typeof i &&
                i.forEach((s, a) => {
                  s && (s = Ks(s, o, n));
                  const l = this.normalizer.normalizePropertyName(a, n);
                  (s = this.normalizer.normalizeStyleValue(a, l, s, n)),
                    r.set(a, s);
                });
            }),
            r
          );
        }
      }
      class OU {
        constructor(e, n, r) {
          (this.name = e),
            (this.ast = n),
            (this._normalizer = r),
            (this.transitionFactories = []),
            (this.states = new Map()),
            n.states.forEach((o) => {
              this.states.set(
                o.name,
                new AU(o.style, (o.options && o.options.params) || {}, r)
              );
            }),
            FS(this.states, "true", "1"),
            FS(this.states, "false", "0"),
            n.transitions.forEach((o) => {
              this.transitionFactories.push(new RS(e, o, this.states));
            }),
            (this.fallbackTransition = (function PU(t, e, n) {
              return new RS(
                t,
                {
                  type: 1,
                  animation: { type: 2, steps: [], options: null },
                  matchers: [(s, a) => !0],
                  options: null,
                  queryCount: 0,
                  depCount: 0,
                },
                e
              );
            })(e, this.states));
        }
        get containsQueries() {
          return this.ast.queryCount > 0;
        }
        matchTransition(e, n, r, o) {
          return (
            this.transitionFactories.find((s) => s.match(e, n, r, o)) || null
          );
        }
        matchStyles(e, n, r) {
          return this.fallbackTransition.buildStyles(e, n, r);
        }
      }
      function FS(t, e, n) {
        t.has(e)
          ? t.has(n) || t.set(n, t.get(e))
          : t.has(n) && t.set(e, t.get(n));
      }
      const NU = new Bu();
      class xU {
        constructor(e, n, r) {
          (this.bodyNode = e),
            (this._driver = n),
            (this._normalizer = r),
            (this._animations = new Map()),
            (this._playersById = new Map()),
            (this.players = []);
        }
        register(e, n) {
          const r = [],
            i = Wp(this._driver, n, r, []);
          if (r.length)
            throw (function L$(t) {
              return new v(3503, !1);
            })();
          this._animations.set(e, i);
        }
        _buildPlayer(e, n, r) {
          const o = e.element,
            i = yS(this._normalizer, e.keyframes, n, r);
          return this._driver.animate(
            o,
            i,
            e.duration,
            e.delay,
            e.easing,
            [],
            !0
          );
        }
        create(e, n, r = {}) {
          const o = [],
            i = this._animations.get(e);
          let s;
          const a = new Map();
          if (
            (i
              ? ((s = Zp(
                  this._driver,
                  n,
                  i,
                  $p,
                  Pu,
                  new Map(),
                  new Map(),
                  r,
                  NU,
                  o
                )),
                s.forEach((c) => {
                  const d = Ft(a, c.element, new Map());
                  c.postStyleProps.forEach((f) => d.set(f, null));
                }))
              : (o.push(
                  (function V$() {
                    return new v(3300, !1);
                  })()
                ),
                (s = [])),
            o.length)
          )
            throw (function B$(t) {
              return new v(3504, !1);
            })();
          a.forEach((c, d) => {
            c.forEach((f, h) => {
              c.set(h, this._driver.computeStyle(d, h, nr));
            });
          });
          const u = br(
            s.map((c) => {
              const d = a.get(c.element);
              return this._buildPlayer(c, new Map(), d);
            })
          );
          return (
            this._playersById.set(e, u),
            u.onDestroy(() => this.destroy(e)),
            this.players.push(u),
            u
          );
        }
        destroy(e) {
          const n = this._getPlayer(e);
          n.destroy(), this._playersById.delete(e);
          const r = this.players.indexOf(n);
          r >= 0 && this.players.splice(r, 1);
        }
        _getPlayer(e) {
          const n = this._playersById.get(e);
          if (!n)
            throw (function H$(t) {
              return new v(3301, !1);
            })();
          return n;
        }
        listen(e, n, r, o) {
          const i = Bp(n, "", "", "");
          return Lp(this._getPlayer(e), r, i, o), () => {};
        }
        command(e, n, r, o) {
          if ("register" == r) return void this.register(e, o[0]);
          if ("create" == r) return void this.create(e, n, o[0] || {});
          const i = this._getPlayer(e);
          switch (r) {
            case "play":
              i.play();
              break;
            case "pause":
              i.pause();
              break;
            case "reset":
              i.reset();
              break;
            case "restart":
              i.restart();
              break;
            case "finish":
              i.finish();
              break;
            case "init":
              i.init();
              break;
            case "setPosition":
              i.setPosition(parseFloat(o[0]));
              break;
            case "destroy":
              this.destroy(e);
          }
        }
      }
      const kS = "ng-animate-queued",
        eg = "ng-animate-disabled",
        VU = [],
        LS = {
          namespaceId: "",
          setForRemoval: !1,
          setForMove: !1,
          hasAnimation: !1,
          removedBeforeQueried: !1,
        },
        BU = {
          namespaceId: "",
          setForMove: !1,
          setForRemoval: !1,
          hasAnimation: !1,
          removedBeforeQueried: !0,
        },
        Wt = "__ng_removed";
      class tg {
        get params() {
          return this.options.params;
        }
        constructor(e, n = "") {
          this.namespaceId = n;
          const r = e && e.hasOwnProperty("value");
          if (
            ((this.value = (function UU(t) {
              return t ?? null;
            })(r ? e.value : e)),
            r)
          ) {
            const i = Gs(e);
            delete i.value, (this.options = i);
          } else this.options = {};
          this.options.params || (this.options.params = {});
        }
        absorbOptions(e) {
          const n = e.params;
          if (n) {
            const r = this.options.params;
            Object.keys(n).forEach((o) => {
              null == r[o] && (r[o] = n[o]);
            });
          }
        }
      }
      const Qs = "void",
        ng = new tg(Qs);
      class HU {
        constructor(e, n, r) {
          (this.id = e),
            (this.hostElement = n),
            (this._engine = r),
            (this.players = []),
            (this._triggers = new Map()),
            (this._queue = []),
            (this._elementListeners = new Map()),
            (this._hostClassName = "ng-tns-" + e),
            Kt(n, this._hostClassName);
        }
        listen(e, n, r, o) {
          if (!this._triggers.has(n))
            throw (function j$(t, e) {
              return new v(3302, !1);
            })();
          if (null == r || 0 == r.length)
            throw (function $$(t) {
              return new v(3303, !1);
            })();
          if (
            !(function zU(t) {
              return "start" == t || "done" == t;
            })(r)
          )
            throw (function U$(t, e) {
              return new v(3400, !1);
            })();
          const i = Ft(this._elementListeners, e, []),
            s = { name: n, phase: r, callback: o };
          i.push(s);
          const a = Ft(this._engine.statesByElement, e, new Map());
          return (
            a.has(n) || (Kt(e, Nu), Kt(e, Nu + "-" + n), a.set(n, ng)),
            () => {
              this._engine.afterFlush(() => {
                const l = i.indexOf(s);
                l >= 0 && i.splice(l, 1), this._triggers.has(n) || a.delete(n);
              });
            }
          );
        }
        register(e, n) {
          return !this._triggers.has(e) && (this._triggers.set(e, n), !0);
        }
        _getTrigger(e) {
          const n = this._triggers.get(e);
          if (!n)
            throw (function z$(t) {
              return new v(3401, !1);
            })();
          return n;
        }
        trigger(e, n, r, o = !0) {
          const i = this._getTrigger(n),
            s = new rg(this.id, n, e);
          let a = this._engine.statesByElement.get(e);
          a ||
            (Kt(e, Nu),
            Kt(e, Nu + "-" + n),
            this._engine.statesByElement.set(e, (a = new Map())));
          let l = a.get(n);
          const u = new tg(r, this.id);
          if (
            (!(r && r.hasOwnProperty("value")) &&
              l &&
              u.absorbOptions(l.options),
            a.set(n, u),
            l || (l = ng),
            u.value !== Qs && l.value === u.value)
          ) {
            if (
              !(function WU(t, e) {
                const n = Object.keys(t),
                  r = Object.keys(e);
                if (n.length != r.length) return !1;
                for (let o = 0; o < n.length; o++) {
                  const i = n[o];
                  if (!e.hasOwnProperty(i) || t[i] !== e[i]) return !1;
                }
                return !0;
              })(l.params, u.params)
            ) {
              const g = [],
                y = i.matchStyles(l.value, l.params, g),
                _ = i.matchStyles(u.value, u.params, g);
              g.length
                ? this._engine.reportError(g)
                : this._engine.afterFlush(() => {
                    oo(e, y), Fn(e, _);
                  });
            }
            return;
          }
          const f = Ft(this._engine.playersByElement, e, []);
          f.forEach((g) => {
            g.namespaceId == this.id &&
              g.triggerName == n &&
              g.queued &&
              g.destroy();
          });
          let h = i.matchTransition(l.value, u.value, e, u.params),
            p = !1;
          if (!h) {
            if (!o) return;
            (h = i.fallbackTransition), (p = !0);
          }
          return (
            this._engine.totalQueuedPlayers++,
            this._queue.push({
              element: e,
              triggerName: n,
              transition: h,
              fromState: l,
              toState: u,
              player: s,
              isFallbackTransition: p,
            }),
            p ||
              (Kt(e, kS),
              s.onStart(() => {
                hi(e, kS);
              })),
            s.onDone(() => {
              let g = this.players.indexOf(s);
              g >= 0 && this.players.splice(g, 1);
              const y = this._engine.playersByElement.get(e);
              if (y) {
                let _ = y.indexOf(s);
                _ >= 0 && y.splice(_, 1);
              }
            }),
            this.players.push(s),
            f.push(s),
            s
          );
        }
        deregister(e) {
          this._triggers.delete(e),
            this._engine.statesByElement.forEach((n) => n.delete(e)),
            this._elementListeners.forEach((n, r) => {
              this._elementListeners.set(
                r,
                n.filter((o) => o.name != e)
              );
            });
        }
        clearElementCache(e) {
          this._engine.statesByElement.delete(e),
            this._elementListeners.delete(e);
          const n = this._engine.playersByElement.get(e);
          n &&
            (n.forEach((r) => r.destroy()),
            this._engine.playersByElement.delete(e));
        }
        _signalRemovalForInnerTriggers(e, n) {
          const r = this._engine.driver.query(e, xu, !0);
          r.forEach((o) => {
            if (o[Wt]) return;
            const i = this._engine.fetchNamespacesByElement(o);
            i.size
              ? i.forEach((s) => s.triggerLeaveAnimation(o, n, !1, !0))
              : this.clearElementCache(o);
          }),
            this._engine.afterFlushAnimationsDone(() =>
              r.forEach((o) => this.clearElementCache(o))
            );
        }
        triggerLeaveAnimation(e, n, r, o) {
          const i = this._engine.statesByElement.get(e),
            s = new Map();
          if (i) {
            const a = [];
            if (
              (i.forEach((l, u) => {
                if ((s.set(u, l.value), this._triggers.has(u))) {
                  const c = this.trigger(e, u, Qs, o);
                  c && a.push(c);
                }
              }),
              a.length)
            )
              return (
                this._engine.markElementAsRemoved(this.id, e, !0, n, s),
                r && br(a).onDone(() => this._engine.processLeaveNode(e)),
                !0
              );
          }
          return !1;
        }
        prepareLeaveAnimationListeners(e) {
          const n = this._elementListeners.get(e),
            r = this._engine.statesByElement.get(e);
          if (n && r) {
            const o = new Set();
            n.forEach((i) => {
              const s = i.name;
              if (o.has(s)) return;
              o.add(s);
              const l = this._triggers.get(s).fallbackTransition,
                u = r.get(s) || ng,
                c = new tg(Qs),
                d = new rg(this.id, s, e);
              this._engine.totalQueuedPlayers++,
                this._queue.push({
                  element: e,
                  triggerName: s,
                  transition: l,
                  fromState: u,
                  toState: c,
                  player: d,
                  isFallbackTransition: !0,
                });
            });
          }
        }
        removeNode(e, n) {
          const r = this._engine;
          if (
            (e.childElementCount && this._signalRemovalForInnerTriggers(e, n),
            this.triggerLeaveAnimation(e, n, !0))
          )
            return;
          let o = !1;
          if (r.totalAnimations) {
            const i = r.players.length ? r.playersByQueriedElement.get(e) : [];
            if (i && i.length) o = !0;
            else {
              let s = e;
              for (; (s = s.parentNode); )
                if (r.statesByElement.get(s)) {
                  o = !0;
                  break;
                }
            }
          }
          if ((this.prepareLeaveAnimationListeners(e), o))
            r.markElementAsRemoved(this.id, e, !1, n);
          else {
            const i = e[Wt];
            (!i || i === LS) &&
              (r.afterFlush(() => this.clearElementCache(e)),
              r.destroyInnerAnimations(e),
              r._onRemovalComplete(e, n));
          }
        }
        insertNode(e, n) {
          Kt(e, this._hostClassName);
        }
        drainQueuedTransitions(e) {
          const n = [];
          return (
            this._queue.forEach((r) => {
              const o = r.player;
              if (o.destroyed) return;
              const i = r.element,
                s = this._elementListeners.get(i);
              s &&
                s.forEach((a) => {
                  if (a.name == r.triggerName) {
                    const l = Bp(
                      i,
                      r.triggerName,
                      r.fromState.value,
                      r.toState.value
                    );
                    (l._data = e), Lp(r.player, a.phase, l, a.callback);
                  }
                }),
                o.markedForDestroy
                  ? this._engine.afterFlush(() => {
                      o.destroy();
                    })
                  : n.push(r);
            }),
            (this._queue = []),
            n.sort((r, o) => {
              const i = r.transition.ast.depCount,
                s = o.transition.ast.depCount;
              return 0 == i || 0 == s
                ? i - s
                : this._engine.driver.containsElement(r.element, o.element)
                ? 1
                : -1;
            })
          );
        }
        destroy(e) {
          this.players.forEach((n) => n.destroy()),
            this._signalRemovalForInnerTriggers(this.hostElement, e);
        }
        elementContainsData(e) {
          let n = !1;
          return (
            this._elementListeners.has(e) && (n = !0),
            (n = !!this._queue.find((r) => r.element === e) || n),
            n
          );
        }
      }
      class jU {
        _onRemovalComplete(e, n) {
          this.onRemovalComplete(e, n);
        }
        constructor(e, n, r) {
          (this.bodyNode = e),
            (this.driver = n),
            (this._normalizer = r),
            (this.players = []),
            (this.newHostElements = new Map()),
            (this.playersByElement = new Map()),
            (this.playersByQueriedElement = new Map()),
            (this.statesByElement = new Map()),
            (this.disabledNodes = new Set()),
            (this.totalAnimations = 0),
            (this.totalQueuedPlayers = 0),
            (this._namespaceLookup = {}),
            (this._namespaceList = []),
            (this._flushFns = []),
            (this._whenQuietFns = []),
            (this.namespacesByHostElement = new Map()),
            (this.collectedEnterElements = []),
            (this.collectedLeaveElements = []),
            (this.onRemovalComplete = (o, i) => {});
        }
        get queuedPlayers() {
          const e = [];
          return (
            this._namespaceList.forEach((n) => {
              n.players.forEach((r) => {
                r.queued && e.push(r);
              });
            }),
            e
          );
        }
        createNamespace(e, n) {
          const r = new HU(e, n, this);
          return (
            this.bodyNode && this.driver.containsElement(this.bodyNode, n)
              ? this._balanceNamespaceList(r, n)
              : (this.newHostElements.set(n, r), this.collectEnterElement(n)),
            (this._namespaceLookup[e] = r)
          );
        }
        _balanceNamespaceList(e, n) {
          const r = this._namespaceList,
            o = this.namespacesByHostElement;
          if (r.length - 1 >= 0) {
            let s = !1,
              a = this.driver.getParentElement(n);
            for (; a; ) {
              const l = o.get(a);
              if (l) {
                const u = r.indexOf(l);
                r.splice(u + 1, 0, e), (s = !0);
                break;
              }
              a = this.driver.getParentElement(a);
            }
            s || r.unshift(e);
          } else r.push(e);
          return o.set(n, e), e;
        }
        register(e, n) {
          let r = this._namespaceLookup[e];
          return r || (r = this.createNamespace(e, n)), r;
        }
        registerTrigger(e, n, r) {
          let o = this._namespaceLookup[e];
          o && o.register(n, r) && this.totalAnimations++;
        }
        destroy(e, n) {
          if (!e) return;
          const r = this._fetchNamespace(e);
          this.afterFlush(() => {
            this.namespacesByHostElement.delete(r.hostElement),
              delete this._namespaceLookup[e];
            const o = this._namespaceList.indexOf(r);
            o >= 0 && this._namespaceList.splice(o, 1);
          }),
            this.afterFlushAnimationsDone(() => r.destroy(n));
        }
        _fetchNamespace(e) {
          return this._namespaceLookup[e];
        }
        fetchNamespacesByElement(e) {
          const n = new Set(),
            r = this.statesByElement.get(e);
          if (r)
            for (let o of r.values())
              if (o.namespaceId) {
                const i = this._fetchNamespace(o.namespaceId);
                i && n.add(i);
              }
          return n;
        }
        trigger(e, n, r, o) {
          if ($u(n)) {
            const i = this._fetchNamespace(e);
            if (i) return i.trigger(n, r, o), !0;
          }
          return !1;
        }
        insertNode(e, n, r, o) {
          if (!$u(n)) return;
          const i = n[Wt];
          if (i && i.setForRemoval) {
            (i.setForRemoval = !1), (i.setForMove = !0);
            const s = this.collectedLeaveElements.indexOf(n);
            s >= 0 && this.collectedLeaveElements.splice(s, 1);
          }
          if (e) {
            const s = this._fetchNamespace(e);
            s && s.insertNode(n, r);
          }
          o && this.collectEnterElement(n);
        }
        collectEnterElement(e) {
          this.collectedEnterElements.push(e);
        }
        markElementAsDisabled(e, n) {
          n
            ? this.disabledNodes.has(e) ||
              (this.disabledNodes.add(e), Kt(e, eg))
            : this.disabledNodes.has(e) &&
              (this.disabledNodes.delete(e), hi(e, eg));
        }
        removeNode(e, n, r) {
          if ($u(n)) {
            const o = e ? this._fetchNamespace(e) : null;
            o ? o.removeNode(n, r) : this.markElementAsRemoved(e, n, !1, r);
            const i = this.namespacesByHostElement.get(n);
            i && i.id !== e && i.removeNode(n, r);
          } else this._onRemovalComplete(n, r);
        }
        markElementAsRemoved(e, n, r, o, i) {
          this.collectedLeaveElements.push(n),
            (n[Wt] = {
              namespaceId: e,
              setForRemoval: o,
              hasAnimation: r,
              removedBeforeQueried: !1,
              previousTriggersValues: i,
            });
        }
        listen(e, n, r, o, i) {
          return $u(n) ? this._fetchNamespace(e).listen(n, r, o, i) : () => {};
        }
        _buildInstruction(e, n, r, o, i) {
          return e.transition.build(
            this.driver,
            e.element,
            e.fromState.value,
            e.toState.value,
            r,
            o,
            e.fromState.options,
            e.toState.options,
            n,
            i
          );
        }
        destroyInnerAnimations(e) {
          let n = this.driver.query(e, xu, !0);
          n.forEach((r) => this.destroyActiveAnimationsForElement(r)),
            0 != this.playersByQueriedElement.size &&
              ((n = this.driver.query(e, Up, !0)),
              n.forEach((r) => this.finishActiveQueriedAnimationOnElement(r)));
        }
        destroyActiveAnimationsForElement(e) {
          const n = this.playersByElement.get(e);
          n &&
            n.forEach((r) => {
              r.queued ? (r.markedForDestroy = !0) : r.destroy();
            });
        }
        finishActiveQueriedAnimationOnElement(e) {
          const n = this.playersByQueriedElement.get(e);
          n && n.forEach((r) => r.finish());
        }
        whenRenderingDone() {
          return new Promise((e) => {
            if (this.players.length) return br(this.players).onDone(() => e());
            e();
          });
        }
        processLeaveNode(e) {
          const n = e[Wt];
          if (n && n.setForRemoval) {
            if (((e[Wt] = LS), n.namespaceId)) {
              this.destroyInnerAnimations(e);
              const r = this._fetchNamespace(n.namespaceId);
              r && r.clearElementCache(e);
            }
            this._onRemovalComplete(e, n.setForRemoval);
          }
          e.classList?.contains(eg) && this.markElementAsDisabled(e, !1),
            this.driver.query(e, ".ng-animate-disabled", !0).forEach((r) => {
              this.markElementAsDisabled(r, !1);
            });
        }
        flush(e = -1) {
          let n = [];
          if (
            (this.newHostElements.size &&
              (this.newHostElements.forEach((r, o) =>
                this._balanceNamespaceList(r, o)
              ),
              this.newHostElements.clear()),
            this.totalAnimations && this.collectedEnterElements.length)
          )
            for (let r = 0; r < this.collectedEnterElements.length; r++)
              Kt(this.collectedEnterElements[r], "ng-star-inserted");
          if (
            this._namespaceList.length &&
            (this.totalQueuedPlayers || this.collectedLeaveElements.length)
          ) {
            const r = [];
            try {
              n = this._flushAnimations(r, e);
            } finally {
              for (let o = 0; o < r.length; o++) r[o]();
            }
          } else
            for (let r = 0; r < this.collectedLeaveElements.length; r++)
              this.processLeaveNode(this.collectedLeaveElements[r]);
          if (
            ((this.totalQueuedPlayers = 0),
            (this.collectedEnterElements.length = 0),
            (this.collectedLeaveElements.length = 0),
            this._flushFns.forEach((r) => r()),
            (this._flushFns = []),
            this._whenQuietFns.length)
          ) {
            const r = this._whenQuietFns;
            (this._whenQuietFns = []),
              n.length
                ? br(n).onDone(() => {
                    r.forEach((o) => o());
                  })
                : r.forEach((o) => o());
          }
        }
        reportError(e) {
          throw (function q$(t) {
            return new v(3402, !1);
          })();
        }
        _flushAnimations(e, n) {
          const r = new Bu(),
            o = [],
            i = new Map(),
            s = [],
            a = new Map(),
            l = new Map(),
            u = new Map(),
            c = new Set();
          this.disabledNodes.forEach((x) => {
            c.add(x);
            const F = this.driver.query(x, ".ng-animate-queued", !0);
            for (let H = 0; H < F.length; H++) c.add(F[H]);
          });
          const d = this.bodyNode,
            f = Array.from(this.statesByElement.keys()),
            h = HS(f, this.collectedEnterElements),
            p = new Map();
          let g = 0;
          h.forEach((x, F) => {
            const H = $p + g++;
            p.set(F, H), x.forEach((te) => Kt(te, H));
          });
          const y = [],
            _ = new Set(),
            m = new Set();
          for (let x = 0; x < this.collectedLeaveElements.length; x++) {
            const F = this.collectedLeaveElements[x],
              H = F[Wt];
            H &&
              H.setForRemoval &&
              (y.push(F),
              _.add(F),
              H.hasAnimation
                ? this.driver
                    .query(F, ".ng-star-inserted", !0)
                    .forEach((te) => _.add(te))
                : m.add(F));
          }
          const E = new Map(),
            P = HS(f, Array.from(_));
          P.forEach((x, F) => {
            const H = Pu + g++;
            E.set(F, H), x.forEach((te) => Kt(te, H));
          }),
            e.push(() => {
              h.forEach((x, F) => {
                const H = p.get(F);
                x.forEach((te) => hi(te, H));
              }),
                P.forEach((x, F) => {
                  const H = E.get(F);
                  x.forEach((te) => hi(te, H));
                }),
                y.forEach((x) => {
                  this.processLeaveNode(x);
                });
            });
          const R = [],
            le = [];
          for (let x = this._namespaceList.length - 1; x >= 0; x--)
            this._namespaceList[x].drainQueuedTransitions(n).forEach((H) => {
              const te = H.player,
                Ze = H.element;
              if ((R.push(te), this.collectedEnterElements.length)) {
                const st = Ze[Wt];
                if (st && st.setForMove) {
                  if (
                    st.previousTriggersValues &&
                    st.previousTriggersValues.has(H.triggerName)
                  ) {
                    const ao = st.previousTriggersValues.get(H.triggerName),
                      Qt = this.statesByElement.get(H.element);
                    if (Qt && Qt.has(H.triggerName)) {
                      const qu = Qt.get(H.triggerName);
                      (qu.value = ao), Qt.set(H.triggerName, qu);
                    }
                  }
                  return void te.destroy();
                }
              }
              const kn = !d || !this.driver.containsElement(d, Ze),
                Lt = E.get(Ze),
                Sr = p.get(Ze),
                Ee = this._buildInstruction(H, r, Sr, Lt, kn);
              if (Ee.errors && Ee.errors.length) return void le.push(Ee);
              if (kn)
                return (
                  te.onStart(() => oo(Ze, Ee.fromStyles)),
                  te.onDestroy(() => Fn(Ze, Ee.toStyles)),
                  void o.push(te)
                );
              if (H.isFallbackTransition)
                return (
                  te.onStart(() => oo(Ze, Ee.fromStyles)),
                  te.onDestroy(() => Fn(Ze, Ee.toStyles)),
                  void o.push(te)
                );
              const XS = [];
              Ee.timelines.forEach((st) => {
                (st.stretchStartingKeyframe = !0),
                  this.disabledNodes.has(st.element) || XS.push(st);
              }),
                (Ee.timelines = XS),
                r.append(Ze, Ee.timelines),
                s.push({ instruction: Ee, player: te, element: Ze }),
                Ee.queriedElements.forEach((st) => Ft(a, st, []).push(te)),
                Ee.preStyleProps.forEach((st, ao) => {
                  if (st.size) {
                    let Qt = l.get(ao);
                    Qt || l.set(ao, (Qt = new Set())),
                      st.forEach((qu, sg) => Qt.add(sg));
                  }
                }),
                Ee.postStyleProps.forEach((st, ao) => {
                  let Qt = u.get(ao);
                  Qt || u.set(ao, (Qt = new Set())),
                    st.forEach((qu, sg) => Qt.add(sg));
                });
            });
          if (le.length) {
            const x = [];
            le.forEach((F) => {
              x.push(
                (function G$(t, e) {
                  return new v(3505, !1);
                })()
              );
            }),
              R.forEach((F) => F.destroy()),
              this.reportError(x);
          }
          const Be = new Map(),
            dn = new Map();
          s.forEach((x) => {
            const F = x.element;
            r.has(F) &&
              (dn.set(F, F),
              this._beforeAnimationBuild(
                x.player.namespaceId,
                x.instruction,
                Be
              ));
          }),
            o.forEach((x) => {
              const F = x.element;
              this._getPreviousPlayers(
                F,
                !1,
                x.namespaceId,
                x.triggerName,
                null
              ).forEach((te) => {
                Ft(Be, F, []).push(te), te.destroy();
              });
            });
          const fn = y.filter((x) => $S(x, l, u)),
            or = new Map();
          BS(or, this.driver, m, u, nr).forEach((x) => {
            $S(x, l, u) && fn.push(x);
          });
          const Zs = new Map();
          h.forEach((x, F) => {
            BS(Zs, this.driver, new Set(x), l, "!");
          }),
            fn.forEach((x) => {
              const F = or.get(x),
                H = Zs.get(x);
              or.set(
                x,
                new Map([...(F?.entries() ?? []), ...(H?.entries() ?? [])])
              );
            });
          const so = [],
            ZS = [],
            YS = {};
          s.forEach((x) => {
            const { element: F, player: H, instruction: te } = x;
            if (r.has(F)) {
              if (c.has(F))
                return (
                  H.onDestroy(() => Fn(F, te.toStyles)),
                  (H.disabled = !0),
                  H.overrideTotalTime(te.totalTime),
                  void o.push(H)
                );
              let Ze = YS;
              if (dn.size > 1) {
                let Lt = F;
                const Sr = [];
                for (; (Lt = Lt.parentNode); ) {
                  const Ee = dn.get(Lt);
                  if (Ee) {
                    Ze = Ee;
                    break;
                  }
                  Sr.push(Lt);
                }
                Sr.forEach((Ee) => dn.set(Ee, Ze));
              }
              const kn = this._buildAnimation(H.namespaceId, te, Be, i, Zs, or);
              if ((H.setRealPlayer(kn), Ze === YS)) so.push(H);
              else {
                const Lt = this.playersByElement.get(Ze);
                Lt && Lt.length && (H.parentPlayer = br(Lt)), o.push(H);
              }
            } else
              oo(F, te.fromStyles),
                H.onDestroy(() => Fn(F, te.toStyles)),
                ZS.push(H),
                c.has(F) && o.push(H);
          }),
            ZS.forEach((x) => {
              const F = i.get(x.element);
              if (F && F.length) {
                const H = br(F);
                x.setRealPlayer(H);
              }
            }),
            o.forEach((x) => {
              x.parentPlayer ? x.syncPlayerEvents(x.parentPlayer) : x.destroy();
            });
          for (let x = 0; x < y.length; x++) {
            const F = y[x],
              H = F[Wt];
            if ((hi(F, Pu), H && H.hasAnimation)) continue;
            let te = [];
            if (a.size) {
              let kn = a.get(F);
              kn && kn.length && te.push(...kn);
              let Lt = this.driver.query(F, Up, !0);
              for (let Sr = 0; Sr < Lt.length; Sr++) {
                let Ee = a.get(Lt[Sr]);
                Ee && Ee.length && te.push(...Ee);
              }
            }
            const Ze = te.filter((kn) => !kn.destroyed);
            Ze.length ? qU(this, F, Ze) : this.processLeaveNode(F);
          }
          return (
            (y.length = 0),
            so.forEach((x) => {
              this.players.push(x),
                x.onDone(() => {
                  x.destroy();
                  const F = this.players.indexOf(x);
                  this.players.splice(F, 1);
                }),
                x.play();
            }),
            so
          );
        }
        elementContainsData(e, n) {
          let r = !1;
          const o = n[Wt];
          return (
            o && o.setForRemoval && (r = !0),
            this.playersByElement.has(n) && (r = !0),
            this.playersByQueriedElement.has(n) && (r = !0),
            this.statesByElement.has(n) && (r = !0),
            this._fetchNamespace(e).elementContainsData(n) || r
          );
        }
        afterFlush(e) {
          this._flushFns.push(e);
        }
        afterFlushAnimationsDone(e) {
          this._whenQuietFns.push(e);
        }
        _getPreviousPlayers(e, n, r, o, i) {
          let s = [];
          if (n) {
            const a = this.playersByQueriedElement.get(e);
            a && (s = a);
          } else {
            const a = this.playersByElement.get(e);
            if (a) {
              const l = !i || i == Qs;
              a.forEach((u) => {
                u.queued || (!l && u.triggerName != o) || s.push(u);
              });
            }
          }
          return (
            (r || o) &&
              (s = s.filter(
                (a) => !((r && r != a.namespaceId) || (o && o != a.triggerName))
              )),
            s
          );
        }
        _beforeAnimationBuild(e, n, r) {
          const i = n.element,
            s = n.isRemovalTransition ? void 0 : e,
            a = n.isRemovalTransition ? void 0 : n.triggerName;
          for (const l of n.timelines) {
            const u = l.element,
              c = u !== i,
              d = Ft(r, u, []);
            this._getPreviousPlayers(u, c, s, a, n.toState).forEach((h) => {
              const p = h.getRealPlayer();
              p.beforeDestroy && p.beforeDestroy(), h.destroy(), d.push(h);
            });
          }
          oo(i, n.fromStyles);
        }
        _buildAnimation(e, n, r, o, i, s) {
          const a = n.triggerName,
            l = n.element,
            u = [],
            c = new Set(),
            d = new Set(),
            f = n.timelines.map((p) => {
              const g = p.element;
              c.add(g);
              const y = g[Wt];
              if (y && y.removedBeforeQueried)
                return new qs(p.duration, p.delay);
              const _ = g !== l,
                m = (function GU(t) {
                  const e = [];
                  return jS(t, e), e;
                })((r.get(g) || VU).map((Be) => Be.getRealPlayer())).filter(
                  (Be) => !!Be.element && Be.element === g
                ),
                E = i.get(g),
                P = s.get(g),
                R = yS(this._normalizer, p.keyframes, E, P),
                le = this._buildPlayer(p, R, m);
              if ((p.subTimeline && o && d.add(g), _)) {
                const Be = new rg(e, a, g);
                Be.setRealPlayer(le), u.push(Be);
              }
              return le;
            });
          u.forEach((p) => {
            Ft(this.playersByQueriedElement, p.element, []).push(p),
              p.onDone(() =>
                (function $U(t, e, n) {
                  let r = t.get(e);
                  if (r) {
                    if (r.length) {
                      const o = r.indexOf(n);
                      r.splice(o, 1);
                    }
                    0 == r.length && t.delete(e);
                  }
                  return r;
                })(this.playersByQueriedElement, p.element, p)
              );
          }),
            c.forEach((p) => Kt(p, ES));
          const h = br(f);
          return (
            h.onDestroy(() => {
              c.forEach((p) => hi(p, ES)), Fn(l, n.toStyles);
            }),
            d.forEach((p) => {
              Ft(o, p, []).push(h);
            }),
            h
          );
        }
        _buildPlayer(e, n, r) {
          return n.length > 0
            ? this.driver.animate(
                e.element,
                n,
                e.duration,
                e.delay,
                e.easing,
                r
              )
            : new qs(e.duration, e.delay);
        }
      }
      class rg {
        constructor(e, n, r) {
          (this.namespaceId = e),
            (this.triggerName = n),
            (this.element = r),
            (this._player = new qs()),
            (this._containsRealPlayer = !1),
            (this._queuedCallbacks = new Map()),
            (this.destroyed = !1),
            (this.parentPlayer = null),
            (this.markedForDestroy = !1),
            (this.disabled = !1),
            (this.queued = !0),
            (this.totalTime = 0);
        }
        setRealPlayer(e) {
          this._containsRealPlayer ||
            ((this._player = e),
            this._queuedCallbacks.forEach((n, r) => {
              n.forEach((o) => Lp(e, r, void 0, o));
            }),
            this._queuedCallbacks.clear(),
            (this._containsRealPlayer = !0),
            this.overrideTotalTime(e.totalTime),
            (this.queued = !1));
        }
        getRealPlayer() {
          return this._player;
        }
        overrideTotalTime(e) {
          this.totalTime = e;
        }
        syncPlayerEvents(e) {
          const n = this._player;
          n.triggerCallback && e.onStart(() => n.triggerCallback("start")),
            e.onDone(() => this.finish()),
            e.onDestroy(() => this.destroy());
        }
        _queueEvent(e, n) {
          Ft(this._queuedCallbacks, e, []).push(n);
        }
        onDone(e) {
          this.queued && this._queueEvent("done", e), this._player.onDone(e);
        }
        onStart(e) {
          this.queued && this._queueEvent("start", e), this._player.onStart(e);
        }
        onDestroy(e) {
          this.queued && this._queueEvent("destroy", e),
            this._player.onDestroy(e);
        }
        init() {
          this._player.init();
        }
        hasStarted() {
          return !this.queued && this._player.hasStarted();
        }
        play() {
          !this.queued && this._player.play();
        }
        pause() {
          !this.queued && this._player.pause();
        }
        restart() {
          !this.queued && this._player.restart();
        }
        finish() {
          this._player.finish();
        }
        destroy() {
          (this.destroyed = !0), this._player.destroy();
        }
        reset() {
          !this.queued && this._player.reset();
        }
        setPosition(e) {
          this.queued || this._player.setPosition(e);
        }
        getPosition() {
          return this.queued ? 0 : this._player.getPosition();
        }
        triggerCallback(e) {
          const n = this._player;
          n.triggerCallback && n.triggerCallback(e);
        }
      }
      function $u(t) {
        return t && 1 === t.nodeType;
      }
      function VS(t, e) {
        const n = t.style.display;
        return (t.style.display = e ?? "none"), n;
      }
      function BS(t, e, n, r, o) {
        const i = [];
        n.forEach((l) => i.push(VS(l)));
        const s = [];
        r.forEach((l, u) => {
          const c = new Map();
          l.forEach((d) => {
            const f = e.computeStyle(u, d, o);
            c.set(d, f), (!f || 0 == f.length) && ((u[Wt] = BU), s.push(u));
          }),
            t.set(u, c);
        });
        let a = 0;
        return n.forEach((l) => VS(l, i[a++])), s;
      }
      function HS(t, e) {
        const n = new Map();
        if ((t.forEach((a) => n.set(a, [])), 0 == e.length)) return n;
        const o = new Set(e),
          i = new Map();
        function s(a) {
          if (!a) return 1;
          let l = i.get(a);
          if (l) return l;
          const u = a.parentNode;
          return (l = n.has(u) ? u : o.has(u) ? 1 : s(u)), i.set(a, l), l;
        }
        return (
          e.forEach((a) => {
            const l = s(a);
            1 !== l && n.get(l).push(a);
          }),
          n
        );
      }
      function Kt(t, e) {
        t.classList?.add(e);
      }
      function hi(t, e) {
        t.classList?.remove(e);
      }
      function qU(t, e, n) {
        br(n).onDone(() => t.processLeaveNode(e));
      }
      function jS(t, e) {
        for (let n = 0; n < t.length; n++) {
          const r = t[n];
          r instanceof gS ? jS(r.players, e) : e.push(r);
        }
      }
      function $S(t, e, n) {
        const r = n.get(t);
        if (!r) return !1;
        let o = e.get(t);
        return o ? r.forEach((i) => o.add(i)) : e.set(t, r), n.delete(t), !0;
      }
      class Uu {
        constructor(e, n, r) {
          (this.bodyNode = e),
            (this._driver = n),
            (this._normalizer = r),
            (this._triggerCache = {}),
            (this.onRemovalComplete = (o, i) => {}),
            (this._transitionEngine = new jU(e, n, r)),
            (this._timelineEngine = new xU(e, n, r)),
            (this._transitionEngine.onRemovalComplete = (o, i) =>
              this.onRemovalComplete(o, i));
        }
        registerTrigger(e, n, r, o, i) {
          const s = e + "-" + o;
          let a = this._triggerCache[s];
          if (!a) {
            const l = [],
              c = Wp(this._driver, i, l, []);
            if (l.length)
              throw (function F$(t, e) {
                return new v(3404, !1);
              })();
            (a = (function IU(t, e, n) {
              return new OU(t, e, n);
            })(o, c, this._normalizer)),
              (this._triggerCache[s] = a);
          }
          this._transitionEngine.registerTrigger(n, o, a);
        }
        register(e, n) {
          this._transitionEngine.register(e, n);
        }
        destroy(e, n) {
          this._transitionEngine.destroy(e, n);
        }
        onInsert(e, n, r, o) {
          this._transitionEngine.insertNode(e, n, r, o);
        }
        onRemove(e, n, r) {
          this._transitionEngine.removeNode(e, n, r);
        }
        disableAnimations(e, n) {
          this._transitionEngine.markElementAsDisabled(e, n);
        }
        process(e, n, r, o) {
          if ("@" == r.charAt(0)) {
            const [i, s] = vS(r);
            this._timelineEngine.command(i, n, s, o);
          } else this._transitionEngine.trigger(e, n, r, o);
        }
        listen(e, n, r, o, i) {
          if ("@" == r.charAt(0)) {
            const [s, a] = vS(r);
            return this._timelineEngine.listen(s, n, a, i);
          }
          return this._transitionEngine.listen(e, n, r, o, i);
        }
        flush(e = -1) {
          this._transitionEngine.flush(e);
        }
        get players() {
          return this._transitionEngine.players.concat(
            this._timelineEngine.players
          );
        }
        whenRenderingDone() {
          return this._transitionEngine.whenRenderingDone();
        }
      }
      let QU = (() => {
        class t {
          constructor(n, r, o) {
            (this._element = n),
              (this._startStyles = r),
              (this._endStyles = o),
              (this._state = 0);
            let i = t.initialStylesByElement.get(n);
            i || t.initialStylesByElement.set(n, (i = new Map())),
              (this._initialStyles = i);
          }
          start() {
            this._state < 1 &&
              (this._startStyles &&
                Fn(this._element, this._startStyles, this._initialStyles),
              (this._state = 1));
          }
          finish() {
            this.start(),
              this._state < 2 &&
                (Fn(this._element, this._initialStyles),
                this._endStyles &&
                  (Fn(this._element, this._endStyles),
                  (this._endStyles = null)),
                (this._state = 1));
          }
          destroy() {
            this.finish(),
              this._state < 3 &&
                (t.initialStylesByElement.delete(this._element),
                this._startStyles &&
                  (oo(this._element, this._startStyles),
                  (this._endStyles = null)),
                this._endStyles &&
                  (oo(this._element, this._endStyles),
                  (this._endStyles = null)),
                Fn(this._element, this._initialStyles),
                (this._state = 3));
          }
        }
        return (t.initialStylesByElement = new WeakMap()), t;
      })();
      function og(t) {
        let e = null;
        return (
          t.forEach((n, r) => {
            (function ZU(t) {
              return "display" === t || "position" === t;
            })(r) && ((e = e || new Map()), e.set(r, n));
          }),
          e
        );
      }
      class US {
        constructor(e, n, r, o) {
          (this.element = e),
            (this.keyframes = n),
            (this.options = r),
            (this._specialStyles = o),
            (this._onDoneFns = []),
            (this._onStartFns = []),
            (this._onDestroyFns = []),
            (this._initialized = !1),
            (this._finished = !1),
            (this._started = !1),
            (this._destroyed = !1),
            (this._originalOnDoneFns = []),
            (this._originalOnStartFns = []),
            (this.time = 0),
            (this.parentPlayer = null),
            (this.currentSnapshot = new Map()),
            (this._duration = r.duration),
            (this._delay = r.delay || 0),
            (this.time = this._duration + this._delay);
        }
        _onFinish() {
          this._finished ||
            ((this._finished = !0),
            this._onDoneFns.forEach((e) => e()),
            (this._onDoneFns = []));
        }
        init() {
          this._buildPlayer(), this._preparePlayerBeforeStart();
        }
        _buildPlayer() {
          if (this._initialized) return;
          this._initialized = !0;
          const e = this.keyframes;
          (this.domPlayer = this._triggerWebAnimation(
            this.element,
            e,
            this.options
          )),
            (this._finalKeyframe = e.length ? e[e.length - 1] : new Map()),
            this.domPlayer.addEventListener("finish", () => this._onFinish());
        }
        _preparePlayerBeforeStart() {
          this._delay ? this._resetDomPlayerState() : this.domPlayer.pause();
        }
        _convertKeyframesToObject(e) {
          const n = [];
          return (
            e.forEach((r) => {
              n.push(Object.fromEntries(r));
            }),
            n
          );
        }
        _triggerWebAnimation(e, n, r) {
          return e.animate(this._convertKeyframesToObject(n), r);
        }
        onStart(e) {
          this._originalOnStartFns.push(e), this._onStartFns.push(e);
        }
        onDone(e) {
          this._originalOnDoneFns.push(e), this._onDoneFns.push(e);
        }
        onDestroy(e) {
          this._onDestroyFns.push(e);
        }
        play() {
          this._buildPlayer(),
            this.hasStarted() ||
              (this._onStartFns.forEach((e) => e()),
              (this._onStartFns = []),
              (this._started = !0),
              this._specialStyles && this._specialStyles.start()),
            this.domPlayer.play();
        }
        pause() {
          this.init(), this.domPlayer.pause();
        }
        finish() {
          this.init(),
            this._specialStyles && this._specialStyles.finish(),
            this._onFinish(),
            this.domPlayer.finish();
        }
        reset() {
          this._resetDomPlayerState(),
            (this._destroyed = !1),
            (this._finished = !1),
            (this._started = !1),
            (this._onStartFns = this._originalOnStartFns),
            (this._onDoneFns = this._originalOnDoneFns);
        }
        _resetDomPlayerState() {
          this.domPlayer && this.domPlayer.cancel();
        }
        restart() {
          this.reset(), this.play();
        }
        hasStarted() {
          return this._started;
        }
        destroy() {
          this._destroyed ||
            ((this._destroyed = !0),
            this._resetDomPlayerState(),
            this._onFinish(),
            this._specialStyles && this._specialStyles.destroy(),
            this._onDestroyFns.forEach((e) => e()),
            (this._onDestroyFns = []));
        }
        setPosition(e) {
          void 0 === this.domPlayer && this.init(),
            (this.domPlayer.currentTime = e * this.time);
        }
        getPosition() {
          return this.domPlayer.currentTime / this.time;
        }
        get totalTime() {
          return this._delay + this._duration;
        }
        beforeDestroy() {
          const e = new Map();
          this.hasStarted() &&
            this._finalKeyframe.forEach((r, o) => {
              "offset" !== o &&
                e.set(o, this._finished ? r : AS(this.element, o));
            }),
            (this.currentSnapshot = e);
        }
        triggerCallback(e) {
          const n = "start" === e ? this._onStartFns : this._onDoneFns;
          n.forEach((r) => r()), (n.length = 0);
        }
      }
      class YU {
        validateStyleProperty(e) {
          return !0;
        }
        validateAnimatableStyleProperty(e) {
          return !0;
        }
        matchesElement(e, n) {
          return !1;
        }
        containsElement(e, n) {
          return CS(e, n);
        }
        getParentElement(e) {
          return Hp(e);
        }
        query(e, n, r) {
          return DS(e, n, r);
        }
        computeStyle(e, n, r) {
          return window.getComputedStyle(e)[n];
        }
        animate(e, n, r, o, i, s = []) {
          const l = {
            duration: r,
            delay: o,
            fill: 0 == o ? "both" : "forwards",
          };
          i && (l.easing = i);
          const u = new Map(),
            c = s.filter((h) => h instanceof US);
          (function oU(t, e) {
            return 0 === t || 0 === e;
          })(r, o) &&
            c.forEach((h) => {
              h.currentSnapshot.forEach((p, g) => u.set(g, p));
            });
          let d = (function tU(t) {
            return t.length
              ? t[0] instanceof Map
                ? t
                : t.map((e) => SS(e))
              : [];
          })(n).map((h) => Er(h));
          d = (function iU(t, e, n) {
            if (n.size && e.length) {
              let r = e[0],
                o = [];
              if (
                (n.forEach((i, s) => {
                  r.has(s) || o.push(s), r.set(s, i);
                }),
                o.length)
              )
                for (let i = 1; i < e.length; i++) {
                  let s = e[i];
                  o.forEach((a) => s.set(a, AS(t, a)));
                }
            }
            return e;
          })(e, d, u);
          const f = (function KU(t, e) {
            let n = null,
              r = null;
            return (
              Array.isArray(e) && e.length
                ? ((n = og(e[0])), e.length > 1 && (r = og(e[e.length - 1])))
                : e instanceof Map && (n = og(e)),
              n || r ? new QU(t, n, r) : null
            );
          })(e, d);
          return new US(e, d, l, f);
        }
      }
      let XU = (() => {
        class t extends dS {
          constructor(n, r) {
            super(),
              (this._nextAnimationId = 0),
              (this._renderer = n.createRenderer(r.body, {
                id: "0",
                encapsulation: mt.None,
                styles: [],
                data: { animation: [] },
              }));
          }
          build(n) {
            const r = this._nextAnimationId.toString();
            this._nextAnimationId++;
            const o = Array.isArray(n) ? fS(n) : n;
            return (
              zS(this._renderer, null, r, "register", [o]),
              new JU(r, this._renderer)
            );
          }
        }
        return (
          (t.ɵfac = function (n) {
            return new (n || t)(I(qi), I(dt));
          }),
          (t.ɵprov = N({ token: t, factory: t.ɵfac })),
          t
        );
      })();
      class JU extends Xj {
        constructor(e, n) {
          super(), (this._id = e), (this._renderer = n);
        }
        create(e, n) {
          return new e3(this._id, e, n || {}, this._renderer);
        }
      }
      class e3 {
        constructor(e, n, r, o) {
          (this.id = e),
            (this.element = n),
            (this._renderer = o),
            (this.parentPlayer = null),
            (this._started = !1),
            (this.totalTime = 0),
            this._command("create", r);
        }
        _listen(e, n) {
          return this._renderer.listen(this.element, `@@${this.id}:${e}`, n);
        }
        _command(e, ...n) {
          return zS(this._renderer, this.element, this.id, e, n);
        }
        onDone(e) {
          this._listen("done", e);
        }
        onStart(e) {
          this._listen("start", e);
        }
        onDestroy(e) {
          this._listen("destroy", e);
        }
        init() {
          this._command("init");
        }
        hasStarted() {
          return this._started;
        }
        play() {
          this._command("play"), (this._started = !0);
        }
        pause() {
          this._command("pause");
        }
        restart() {
          this._command("restart");
        }
        finish() {
          this._command("finish");
        }
        destroy() {
          this._command("destroy");
        }
        reset() {
          this._command("reset"), (this._started = !1);
        }
        setPosition(e) {
          this._command("setPosition", e);
        }
        getPosition() {
          return this._renderer.engine.players[+this.id]?.getPosition() ?? 0;
        }
      }
      function zS(t, e, n, r, o) {
        return t.setProperty(e, `@@${n}:${r}`, o);
      }
      const qS = "@.disabled";
      let t3 = (() => {
        class t {
          constructor(n, r, o) {
            (this.delegate = n),
              (this.engine = r),
              (this._zone = o),
              (this._currentId = 0),
              (this._microtaskId = 1),
              (this._animationCallbacksBuffer = []),
              (this._rendererCache = new Map()),
              (this._cdRecurDepth = 0),
              (this.promise = Promise.resolve(0)),
              (r.onRemovalComplete = (i, s) => {
                const a = s?.parentNode(i);
                a && s.removeChild(a, i);
              });
          }
          createRenderer(n, r) {
            const i = this.delegate.createRenderer(n, r);
            if (!(n && r && r.data && r.data.animation)) {
              let c = this._rendererCache.get(i);
              return (
                c ||
                  ((c = new GS("", i, this.engine, () =>
                    this._rendererCache.delete(i)
                  )),
                  this._rendererCache.set(i, c)),
                c
              );
            }
            const s = r.id,
              a = r.id + "-" + this._currentId;
            this._currentId++, this.engine.register(a, n);
            const l = (c) => {
              Array.isArray(c)
                ? c.forEach(l)
                : this.engine.registerTrigger(s, a, n, c.name, c);
            };
            return r.data.animation.forEach(l), new n3(this, a, i, this.engine);
          }
          begin() {
            this._cdRecurDepth++, this.delegate.begin && this.delegate.begin();
          }
          _scheduleCountTask() {
            this.promise.then(() => {
              this._microtaskId++;
            });
          }
          scheduleListenerCallback(n, r, o) {
            n >= 0 && n < this._microtaskId
              ? this._zone.run(() => r(o))
              : (0 == this._animationCallbacksBuffer.length &&
                  Promise.resolve(null).then(() => {
                    this._zone.run(() => {
                      this._animationCallbacksBuffer.forEach((i) => {
                        const [s, a] = i;
                        s(a);
                      }),
                        (this._animationCallbacksBuffer = []);
                    });
                  }),
                this._animationCallbacksBuffer.push([r, o]));
          }
          end() {
            this._cdRecurDepth--,
              0 == this._cdRecurDepth &&
                this._zone.runOutsideAngular(() => {
                  this._scheduleCountTask(),
                    this.engine.flush(this._microtaskId);
                }),
              this.delegate.end && this.delegate.end();
          }
          whenRenderingDone() {
            return this.engine.whenRenderingDone();
          }
        }
        return (
          (t.ɵfac = function (n) {
            return new (n || t)(I(qi), I(Uu), I(ye));
          }),
          (t.ɵprov = N({ token: t, factory: t.ɵfac })),
          t
        );
      })();
      class GS {
        constructor(e, n, r, o) {
          (this.namespaceId = e),
            (this.delegate = n),
            (this.engine = r),
            (this._onDestroy = o),
            (this.destroyNode = this.delegate.destroyNode
              ? (i) => n.destroyNode(i)
              : null);
        }
        get data() {
          return this.delegate.data;
        }
        destroy() {
          this.engine.destroy(this.namespaceId, this.delegate),
            this.delegate.destroy(),
            this._onDestroy?.();
        }
        createElement(e, n) {
          return this.delegate.createElement(e, n);
        }
        createComment(e) {
          return this.delegate.createComment(e);
        }
        createText(e) {
          return this.delegate.createText(e);
        }
        appendChild(e, n) {
          this.delegate.appendChild(e, n),
            this.engine.onInsert(this.namespaceId, n, e, !1);
        }
        insertBefore(e, n, r, o = !0) {
          this.delegate.insertBefore(e, n, r),
            this.engine.onInsert(this.namespaceId, n, e, o);
        }
        removeChild(e, n, r) {
          this.engine.onRemove(this.namespaceId, n, this.delegate);
        }
        selectRootElement(e, n) {
          return this.delegate.selectRootElement(e, n);
        }
        parentNode(e) {
          return this.delegate.parentNode(e);
        }
        nextSibling(e) {
          return this.delegate.nextSibling(e);
        }
        setAttribute(e, n, r, o) {
          this.delegate.setAttribute(e, n, r, o);
        }
        removeAttribute(e, n, r) {
          this.delegate.removeAttribute(e, n, r);
        }
        addClass(e, n) {
          this.delegate.addClass(e, n);
        }
        removeClass(e, n) {
          this.delegate.removeClass(e, n);
        }
        setStyle(e, n, r, o) {
          this.delegate.setStyle(e, n, r, o);
        }
        removeStyle(e, n, r) {
          this.delegate.removeStyle(e, n, r);
        }
        setProperty(e, n, r) {
          "@" == n.charAt(0) && n == qS
            ? this.disableAnimations(e, !!r)
            : this.delegate.setProperty(e, n, r);
        }
        setValue(e, n) {
          this.delegate.setValue(e, n);
        }
        listen(e, n, r) {
          return this.delegate.listen(e, n, r);
        }
        disableAnimations(e, n) {
          this.engine.disableAnimations(e, n);
        }
      }
      class n3 extends GS {
        constructor(e, n, r, o, i) {
          super(n, r, o, i), (this.factory = e), (this.namespaceId = n);
        }
        setProperty(e, n, r) {
          "@" == n.charAt(0)
            ? "." == n.charAt(1) && n == qS
              ? this.disableAnimations(e, (r = void 0 === r || !!r))
              : this.engine.process(this.namespaceId, e, n.slice(1), r)
            : this.delegate.setProperty(e, n, r);
        }
        listen(e, n, r) {
          if ("@" == n.charAt(0)) {
            const o = (function r3(t) {
              switch (t) {
                case "body":
                  return document.body;
                case "document":
                  return document;
                case "window":
                  return window;
                default:
                  return t;
              }
            })(e);
            let i = n.slice(1),
              s = "";
            return (
              "@" != i.charAt(0) &&
                ([i, s] = (function o3(t) {
                  const e = t.indexOf(".");
                  return [t.substring(0, e), t.slice(e + 1)];
                })(i)),
              this.engine.listen(this.namespaceId, o, i, s, (a) => {
                this.factory.scheduleListenerCallback(a._data || -1, r, a);
              })
            );
          }
          return this.delegate.listen(e, n, r);
        }
      }
      const WS = [
          { provide: dS, useClass: XU },
          {
            provide: Xp,
            useFactory: function s3() {
              return new SU();
            },
          },
          {
            provide: Uu,
            useClass: (() => {
              class t extends Uu {
                constructor(n, r, o, i) {
                  super(n.body, r, o);
                }
                ngOnDestroy() {
                  this.flush();
                }
              }
              return (
                (t.ɵfac = function (n) {
                  return new (n || t)(I(dt), I(jp), I(Xp), I($r));
                }),
                (t.ɵprov = N({ token: t, factory: t.ɵfac })),
                t
              );
            })(),
          },
          {
            provide: qi,
            useFactory: function a3(t, e, n) {
              return new t3(t, e, n);
            },
            deps: [Ch, Uu, ye],
          },
        ],
        ig = [
          { provide: jp, useFactory: () => new YU() },
          { provide: rv, useValue: "BrowserAnimations" },
          ...WS,
        ],
        KS = [
          { provide: jp, useClass: wS },
          { provide: rv, useValue: "NoopAnimations" },
          ...WS,
        ];
      let l3 = (() => {
          class t {
            static withConfig(n) {
              return { ngModule: t, providers: n.disableAnimations ? KS : ig };
            }
          }
          return (
            (t.ɵfac = function (n) {
              return new (n || t)();
            }),
            (t.ɵmod = Mt({ type: t })),
            (t.ɵinj = pt({ providers: ig, imports: [ob] })),
            t
          );
        })(),
        u3 = (() => {
          class t {
            constructor() {}
            intercept(n, r) {
              let o = localStorage.getItem("token");
              const i = n.clone({
                setHeaders: { Authorization: `Bearer ${o}` },
              });
              return r.handle(i);
            }
          }
          return (
            (t.ɵfac = function (n) {
              return new (n || t)();
            }),
            (t.ɵprov = N({ token: t, factory: t.ɵfac })),
            t
          );
        })(),
        c3 = (() => {
          class t {}
          return (
            (t.ɵfac = function (n) {
              return new (n || t)();
            }),
            (t.ɵmod = Mt({ type: t, bootstrap: [h$] })),
            (t.ɵinj = pt({
              providers: [ui, mu, Zr, { provide: ME, useClass: u3, multi: !0 }],
              imports: [ob, f$, l3, $j, jj, BB],
            })),
            t
          );
        })();
      NL()
        .bootstrapModule(c3)
        .catch((t) => console.error(t));
    },
  },
  (Gu) => {
    Gu((Gu.s = 403));
  },
]);
