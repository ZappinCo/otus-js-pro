
type BasePrimitive = boolean | number | bigint | symbol;
export type DeepEqualValue = string | BasePrimitive | null | undefined | object | RegExp |
  Map<DeepEqualValue, DeepEqualValue> | Set<DeepEqualValue> | Date;

interface ComparatorContext {
  compare(a: DeepEqualValue, b: DeepEqualValue): boolean;
  caseSensitive: boolean;
}

abstract class Comparator<T extends DeepEqualValue = DeepEqualValue> {
  abstract canHandle(value: DeepEqualValue): value is T;

  compare(a: DeepEqualValue, b: DeepEqualValue, context: ComparatorContext): boolean {
    if (!this.canHandle(a) || !this.canHandle(b)) return false;
    return this.compareValues(a, b, context);
  }

  protected abstract compareValues(a: T, b: T, context: ComparatorContext): boolean;
}


export class DeepEqual implements ComparatorContext {
  #comparators: Comparator[] = [];
  caseSensitive = false;
  #visited = new WeakMap<object, WeakSet<object>>();
  #inProgress = false;

  constructor() {
    this.#addComparator(new BaseComparator);
    this.#addComparator(new StringComparator);
    this.#addComparator(new ArrayComparator);
    this.#addComparator(new ObjectComparator);
    this.#addComparator(new DateComparator);
    this.#addComparator(new SetComparator);
    this.#addComparator(new MapComparator);
    this.#addComparator(new RegExpComparator);
  }

  #findComparator(value: DeepEqualValue) {
    return this.#comparators.find((comparator) => comparator.canHandle(value));
  }

  #addComparator(comparator: Comparator) {
    this.#comparators.push(comparator);
  }

  compare(a: DeepEqualValue, b: DeepEqualValue) {
    const isRoot = !this.#inProgress;
    if (isRoot) {
      this.#visited = new WeakMap();
      this.#inProgress = true;
    }
    try {
      let isNull = (value: DeepEqualValue) => {
        return value !== undefined && value !== null
      }

      if (!isNull(a) || !isNull(b))
        return a === b;

      if (typeof a !== typeof b) {
        console.log(`cant compare different types ${String(a)} ${String(b)}`);
        return false;
      }

      if (typeof a === "object" && a !== null
        && typeof b === 'object' && b !== null) {
        let seenB = this.#visited.get(a);
        if (seenB && seenB.has(b))
          return true;
        if (!seenB) {
          seenB = new WeakSet();
          this.#visited.set(a, seenB);
        }
        seenB.add(b);
      }

      const comparator = this.#findComparator(a);
      if (!comparator) {
        throw new Error(`No comparator for ${String(a)}`);
      }
      return comparator.compare(a, b, this);

    } finally {
      if (isRoot)
        this.#inProgress = false;
    }
  }
}


class BaseComparator extends Comparator<BasePrimitive> {
  canHandle(instance: DeepEqualValue) {
    return (
      typeof instance === "boolean" ||
      typeof instance === "number" ||
      typeof instance === "bigint" ||
      typeof instance === "symbol"
    )
  }

  protected compareValues(a: BasePrimitive, b: BasePrimitive) {
    return a === b
  }
}

class StringComparator extends Comparator<String> {
  canHandle(instance: DeepEqualValue) {
    return typeof instance === "string"
  }

  protected compareValues(a: String, b: String, context: ComparatorContext) {
    if (context.caseSensitive)
      return a === b;

    return a.toLowerCase() === b.toLowerCase();
  }
}

class ObjectComparator extends Comparator<Record<string, DeepEqualValue>> {
  canHandle(value: DeepEqualValue): value is Record<string, DeepEqualValue> {
    return Object.prototype.toString.call(value) === '[object Object]';
  }

  protected compareValues(a: Record<string, DeepEqualValue>, b: Record<string, DeepEqualValue>, context: ComparatorContext) {
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);

    if (keysA.length !== keysB.length)
      return false;

    return keysA.every(
      (key) => Object.hasOwn(b, key) && context.compare(a[key], b[key])
    );
  }
}


class ArrayComparator extends Comparator<Array<DeepEqualValue>> {
  canHandle(instance: DeepEqualValue) {
    return Array.isArray(instance)
  }

  protected compareValues(a: Array<DeepEqualValue>, b: Array<DeepEqualValue>, context: ComparatorContext) {
    if (!this.canHandle(a) || !this.canHandle(b))
      return false;

    if (a.length != b.length)
      return false;

    return a.every((val, index) => context.compare(val, b[index]));
  }
}

class DateComparator extends Comparator<Date> {
  canHandle(instance: DeepEqualValue) {
    return instance instanceof Date;
  }

  protected compareValues(a: Date, b: Date) {
    return a.getTime() === b.getTime();
  }
}

class SetComparator extends Comparator<Set<DeepEqualValue>> {
  canHandle(instance: DeepEqualValue) {
    return instance instanceof Set;
  }

  protected compareValues(a: Set<DeepEqualValue>, b: Set<DeepEqualValue>) {
    if (a.size !== b.size)
      return false

    for (const v of a) {
      if (!b.has(v)) {
        return false;
      }
    }
    return true;
  }
}

class MapComparator extends Comparator<Map<DeepEqualValue, DeepEqualValue>> {
  canHandle(instance: DeepEqualValue) {
    return instance instanceof Map;
  }

  protected compareValues(a: Map<DeepEqualValue, DeepEqualValue>,
    b: Map<DeepEqualValue, DeepEqualValue>,
    context: ComparatorContext) {
    if (a.size !== b.size)
      return false

    for (const [k, v] of a) {
      if (!b.has(k)) {
        return false;
      }
      if (!context.compare(v, b.get(k)))
        return false;
    }
    return true;
  }
}

class RegExpComparator extends Comparator<RegExp> {
  canHandle(value: DeepEqualValue) {
    return value instanceof RegExp;
  }

  protected compareValues(a: RegExp, b: RegExp) {
    return a.source === b.source && a.flags === b.flags;
  }
}