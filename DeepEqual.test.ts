import { DeepEqual, DeepEqualValue } from './DeepEqual';

type TestCase = [string, DeepEqualValue, DeepEqualValue, boolean];

describe('DeepEqual#compare', () => {
  let de: DeepEqual;

  beforeEach(() => {
    de = new DeepEqual();
    de.caseSensitive = true;
  });

  const selfRef = (name: string) => {
    const o: { name: string; self?: unknown } = { name };
    o.self = o;
    return o;
  };

  const mutual = (aName: string, bName: string) => {
    const a: { name: string; ref?: unknown } = { name: aName };
    const b: { name: string; ref?: unknown } = { name: bName, ref: a };
    a.ref = b;
    return a;
  };

  const selfRefArray = () => {
    const arr: unknown[] = [1, 2];
    arr.push(arr);
    return arr;
  };

  describe('примитивы', () => {
    it.each([
      ['числа равны', 1, 1, true],
      ['разные числа', 1, 2, false],
      ['отрицательные числа', -5, -5, true],
      ['знак важен', 5, -5, false],
      ['дробные равны', 3.14, 3.14, true],
      ['NaN !== NaN', NaN, NaN, false],
      ['Infinity === Infinity', Infinity, Infinity, true],
      ['Infinity !== -Infinity', Infinity, -Infinity, false],
      ['число не равно строке', 1, '1', false],
      ['число не равно boolean', 1, true, false],
    ] as TestCase[])('%s', (_name, a, b, expected) => {
      expect(de.compare(a, b)).toBe(expected);
    });

    it.each([
      ['строки равны', 'abc', 'abc', true],
      ['разные строки', 'abc', 'xyz', false],
      ['регистр важен', 'abc', 'ABC', false],
      ['пустые строки равны', '', '', true],
      ['пустая !== пробел', '', ' ', false],
      ['кириллица', 'привет', 'привет', true],
      ['emoji равны', '😀', '😀', true],
      ['разные emoji', '😀', '😁', false],
      ['перенос строки', 'a\nb', 'a\nb', true],
      ['строка не равна числу', '1', 1, false],
    ] as TestCase[])('%s', (_name, a, b, expected) => {
      expect(de.compare(a, b)).toBe(expected);
    });

    it.each([
      ['true === true', true, true, true],
      ['false === false', false, false, true],
      ['true !== false', true, false, false],
      ['true !== 1', true, 1, false],
      ['false !== 0', false, 0, false],
    ] as TestCase[])('%s', (_name, a, b, expected) => {
      expect(de.compare(a, b)).toBe(expected);
    });

    it.each([
      ['null === null', null, null, true],
      ['undefined === undefined', undefined, undefined, true],
      ['null !== undefined', null, undefined, false],
      ['null !== 0', null, 0, false],
      ['undefined !== ""', undefined, '', false],
      ['void 0 === undefined', void 0, undefined, true],
    ] as TestCase[])('%s', (_name, a, b, expected) => {
      expect(de.compare(a, b)).toBe(expected);
    });

    it.each([
      ['BigInt равны', 1n, 1n, true],
      ['разные BigInt', 1n, 2n, false],
      ['BigInt не равен number', 1n, 1, false],
      ['0n не равен 0', 0n, 0, false],
    ] as TestCase[])('%s', (_name, a, b, expected) => {
      expect(de.compare(a, b)).toBe(expected);
    });

    it('Symbol === сам себе', () => {
      const s = Symbol('x');
      expect(de.compare(s, s)).toBe(true);
    });

    it('разные Symbol с одинаковым description не равны', () => {
      expect(de.compare(Symbol('x'), Symbol('x'))).toBe(false);
    });

    it('Symbol.for с одним ключом равны', () => {
      expect(de.compare(Symbol.for('g'), Symbol.for('g'))).toBe(true);
    });

    it('примитив не равен объекту-обёртке', () => {
      expect(de.compare(1, new Number(1))).toBe(false);
      expect(de.compare('a', new String('a'))).toBe(false);
      expect(de.compare(true, new Boolean(true))).toBe(false);
    });
  });

  describe('плоские объекты', () => {
    it.each([
      ['одинаковые ключи и значения', { a: 1, b: 2 }, { a: 1, b: 2 }, true],
      ['порядок ключей не важен', { a: 1, b: 2 }, { b: 2, a: 1 }, true],
      ['разные значения', { a: 1 }, { a: 2 }, false],
      ['разные ключи', { a: 1 }, { b: 1 }, false],
      ['подмножество не равно', { a: 1 }, { a: 1, b: 2 }, false],
      ['пустые объекты равны', {}, {}, true],
      ['объект не равен массиву', {}, [], false],
      ['объект не равен null', {}, null, false],
    ] as TestCase[])('%s', (_name, a, b, expected) => {
      expect(de.compare(a, b)).toBe(expected);
    });
  });

  describe('вложенные объекты', () => {
    it('глубокая вложенность', () => {
      const a = { user: { profile: { name: 'Alice', age: 30 } } };
      const b = { user: { profile: { name: 'Alice', age: 30 } } };
      expect(de.compare(a, b)).toBe(true);
    });

    it('различие на 3-м уровне', () => {
      const a = { user: { profile: { name: 'Alice' } } };
      const b = { user: { profile: { name: 'Bob' } } };
      expect(de.compare(a, b)).toBe(false);
    });

    it('объект с массивами внутри', () => {
      const a = { list: [{ id: 1 }, { id: 2 }], meta: { total: 2 } };
      const b = { list: [{ id: 1 }, { id: 2 }], meta: { total: 2 } };
      expect(de.compare(a, b)).toBe(true);
    });
  });

  describe('массивы', () => {
    it.each([
      ['равные массивы', [1, 2, 3], [1, 2, 3], true],
      ['пустые массивы', [], [], true],
      ['вложенные массивы', [[1, 2], [3]], [[1, 2], [3]], true],
      ['разная длина', [1, 2], [1, 2, 3], false],
      ['разный порядок', [1, 2], [2, 1], false],
      ['разные типы элементов', [1, 2], [1, '2'], false],
      ['массив с объектами', [{ a: 1 }], [{ a: 1 }], true],
      ['массив с объектами различие', [{ a: 1 }], [{ a: 2 }], false],
    ] as TestCase[])('%s', (_name, a, b, expected) => {
      expect(de.compare(a, b)).toBe(expected);
    });
  });

  describe('специальные типы', () => {
    it.each([
      ['даты с одинаковым временем', new Date(1000), new Date(1000), true],
      ['разные даты', new Date(1000), new Date(2000), false],
      ['регулярки равны', /abc/gi, /abc/gi, true],
      ['разные флаги регулярки', /abc/g, /abc/i, false],
      ['разный паттерн регулярки', /abc/, /xyz/, false],
    ] as TestCase[])('%s', (_name, a, b, expected) => {
      expect(de.compare(a, b)).toBe(expected);
    });

    it('равные Map', () => {
      expect(de.compare(new Map([['a', 1]]), new Map([['a', 1]]))).toBe(true);
    });

    it('разные Map', () => {
      expect(de.compare(new Map([['a', 1]]), new Map([['a', 2]]))).toBe(false);
    });

    it('Map разного размера', () => {
      expect(de.compare(new Map([['a', 1]]), new Map())).toBe(false);
    });

    it('равные Set', () => {
      expect(de.compare(new Set([1, 2, 3]), new Set([1, 2, 3]))).toBe(true);
    });

    it('разные Set', () => {
      expect(de.compare(new Set([1, 2]), new Set([1, 3]))).toBe(false);
    });
  });

  describe('граничные случаи', () => {
    it('возвращает true для одного и того же объекта', () => {
      const obj = { a: 1 };
      expect(de.compare(obj, obj)).toBe(true);
    });

    it('симметричен: compare(a, b) === compare(b, a)', () => {
      const a = { x: [1, { y: 2 }] };
      const b = { x: [1, { y: 2 }] };
      expect(de.compare(a, b)).toBe(de.compare(b, a));
    });

    it('транзитивен: a = b, b = c ⇒ a = c', () => {
      const a = { x: 1 };
      const b = { x: 1 };
      const c = { x: 1 };
      expect(de.compare(a, b)).toBe(true);
      expect(de.compare(b, c)).toBe(true);
      expect(de.compare(a, c)).toBe(true);
    });

    it('не мутирует входные объекты', () => {
      const a = { x: [1, 2, 3] };
      const b = { x: [1, 2, 3] };
      const snapshotA = JSON.stringify(a);
      const snapshotB = JSON.stringify(b);

      de.compare(a, b);

      expect(JSON.stringify(a)).toBe(snapshotA);
      expect(JSON.stringify(b)).toBe(snapshotB);
    });

    it('не «залипает» на состоянии между вызовами', () => {
      const a = { x: 1 };
      const b = { x: 1 };
      const c = { x: 2 };
      expect(de.compare(a, b)).toBe(true);
      expect(de.compare(a, c)).toBe(false);
      expect(de.compare(a, b)).toBe(true);
    });

    it('разные экземпляры DeepEqual работают независимо', () => {
      const de1 = new DeepEqual();
      const de2 = new DeepEqual();
      expect(de1.compare({ a: 1 }, { a: 1 })).toBe(true);
      expect(de2.compare({ a: 1 }, { a: 1 })).toBe(true);
    });
  });

  describe('объект с self-ссылкой', () => {
    it('равен себе с теми же значениями', () => {
      expect(de.compare(selfRef('x'), selfRef('x'))).toBe(true);
    });

    it('не равен, если отличается скалярное поле', () => {
      expect(de.compare(selfRef('x'), selfRef('y'))).toBe(false);
    });

    it('сравнение объекта с самим собой даёт true', () => {
      const a = selfRef('x');
      expect(de.compare(a, a)).toBe(true);
    });

    it('циклический объект не равен плоскому с тем же полем', () => {
      const cyc = selfRef('x');
      const flat = { name: 'x' };
      expect(de.compare(cyc, flat)).toBe(false);
    });
  });

  describe('взаимные ссылки', () => {
    it('два взаимно-циклических объекта с одинаковыми именами равны', () => {
      expect(de.compare(mutual('a', 'b'), mutual('a', 'b'))).toBe(true);
    });

    it('различие во внутреннем имени — не равны', () => {
      expect(de.compare(mutual('a', 'b'), mutual('a', 'c'))).toBe(false);
    });

    it('объект с mutual-ссылкой не равен своей копии без обратной ссылки', () => {
      const a = mutual('x', 'y');
      const flat = { name: 'x', ref: { name: 'y' } };
      expect(de.compare(a, flat)).toBe(false);
    });
  });

  describe('self-reference массив', () => {
    it('два self-reference массива с одинаковым содержимым равны', () => {
      expect(de.compare(selfRefArray(), selfRefArray())).toBe(true);
    });

    it('self-reference массив не равен обычному массиву (разная длина)', () => {
      expect(de.compare(selfRefArray(), [1, 2])).toBe(false);
    });
  });

  describe('caseSensitive: false (значение по умолчанию)', () => {
    let deCI: DeepEqual;

    beforeEach(() => {
      deCI = new DeepEqual();
      expect(deCI.caseSensitive).toBe(false);
    });

    it.each([
      ['нижний vs верхний', 'abc', 'ABC', true],
      ['смешанный регистр', 'HeLLo', 'hello', true],
      ['разные строки', 'abc', 'xyz', false],
      ['пустая строка', '', '', true],
    ] as TestCase[])('%s', (_name, a, b, expected) => {
      expect(deCI.compare(a, b)).toBe(expected);
    });
  });
});