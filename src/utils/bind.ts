import m from "mithril";
import { BehaviorSubject, Observable, Subscription } from "rxjs";

const subsSym = Symbol();
export interface Bind<V> {
    getValue(): V;
    [subsSym]: Subscription[]
}

export function bind<V>(initialValue: V, obs: Observable<V>): Bind<V> {
  const subject = new BehaviorSubject(initialValue);
  return {
    getValue: () => subject.getValue(),
    [subsSym]: [
      obs.subscribe(subject),
      subject.subscribe(() => m.redraw())
    ]
  }
}

export function unbind(...binds: Bind<unknown>[]) {
  binds.forEach(b => b[subsSym].forEach(sub => sub.unsubscribe()))
}
