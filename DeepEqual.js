
class Comparator {
  canHandle(instance) {
    throw new Error("canHandle() undefinded");
  }

  compare(a, b, context) {
    throw new Error("compare() undefined");
  }
}

class BaseComparator extends Comparator {
  canHandle(instance) {
    return (
      typeof instance === "boolean" ||
      typeof instance === "number" ||
      typeof instance === "bigint" ||
      typeof instance === "symbol"
    )
  }

  compare(a, b, context) {
    return a == b
  }
}

class StringComparator extends Comparator {
  canHandle(instance) {
    return typeof instance === "string"
  }

  compare(a, b, context) {
    if (context.caseSensitive)
      return a === b;
    else
      return a.toLowerCase() === b.toLowerCase();
  }
}

class ObjectComparator extends Comparator {
  isObject(obj) {
    return Object.prototype.toString.call(obj) === '[object Object]'
  }

  canHandle(value) {
    return this.isObject(value);
  }

  compare(a, b, context) {
    if (!this.isObject(b))
      return false;
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);

    if (keysA.length !== keysB.length)
      return false;

    return keysA.every(
      (key) => Object.hasOwn(b, key) && context.compare(a[key], b[key])
    );
  }
}


class ArrayComparator extends Comparator {
  canHandle(instance) {
    return Array.isArray(instance)
  }

  compare(a, b, context) {
    if (a.length != b.length)
      return false;

    return a.every((val, index) => context.compare(val, b[index], this));
  }
}

class DateComparator extends Comparator {
  canHandle(instance) {
    return instance instanceof Date;
  }

  compare(a, b) {
    return a.getTime() === b.getTime();
  }
}

class SetComparator extends Comparator {
  canHandle(instance) {
    return instance instanceof Set;
  }

  compare(a, b, context) {
    if (a.length !== b.length)
      return false

    for (const v of a) {
      if (!b.has(v)) {
        return false;
      }
    }
    return true;
  }
}

class MapComparator extends Comparator {
  canHandle(instance) {
    return instance instanceof Map;
  }

  compare(a, b, context) {
    if (a.length !== b.length)
      return false

    for (const [k, v] of a) {
      if (!b.has(k)) {
        return false;
      }
      if (!context.compare(v, b.get(k), context))
        return false;
    }
    return true;
  }
}

class RegExpComparator extends Comparator {
  canHandle(value) {
    return value instanceof RegExp;
  }

  compare(a, b) {
    return a.source === b.source && a.flags === b.flags;
  }
}

class DeepEqual {
  #comparators = [];
  caseSensitive = true;
  #visited = new WeakMap();
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

  #findComparator(value) {
    return this.#comparators.find((comparator) => comparator.canHandle(value));
  }

  #addComparator(comparator) {
    if (!(comparator instanceof Comparator)) {
      throw new Error("addComparator() comparator error type");
      return
    }
    this.#comparators.push(comparator);
  }

  compare(a, b) {
    const isRoot = !this.#inProgress;
    if (isRoot) {
      this.#visited = new WeakMap();
      this.#inProgress = true;
    }
    try {
      let isNull = (value) => { return value !== undefined && value !== null && value !== NaN }
      if (!isNull(a) || !isNull(b))
        return a === b;

      if (typeof a !== typeof b) {
        console.log(`cant compare different types ${a} ${b}`);
        return false;
      }

      if (typeof a === "object" && a !== null) {
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
        throw new Error(`No comparator for ${a}`);
      }
      return comparator.compare(a, b, this);

    } finally {
      if (isRoot)
        this.#inProgress = false;
    }
  }
}

module.exports = { DeepEqual };