import m from 'mithril'
import hyperactiv from 'hyperactiv';
const { computed, dispose } = hyperactiv;

const subSym = Symbol();
export interface Morphing<V> {
    value: V;
    [subSym]: any | null;
}

export function morphing<V>(provider: () => V): Morphing<V> {
    const morph: Morphing<V> = {
        value: provider(),
        [subSym]: null
    }
    morph[subSym] = computed(() => {
        morph.value = provider();
        m.redraw();
    })
    return morph;
}

export function stop<V>(...morphs: Morphing<unknown>[]) {
    morphs.forEach(morph => dispose(morph[subSym]));
}
