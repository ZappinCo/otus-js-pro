import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import useLocalStorage from './useLocalStorage';
import { StoreProvider } from './StoreProvider';

const STORAGE_KEY = 'spa-routing-state';

const wrapper = ({ children }) => <StoreProvider>{children}</StoreProvider>;

const readStorage = () => {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
};

describe('useLocalStorage', () => {
    beforeEach(() => localStorage.clear());
    afterEach(() => vi.restoreAllMocks());

    describe('инициализация', () => {
        it('возвращает defaultValue, если хранилище пустое', () => {
            const { result } = renderHook(
                () => useLocalStorage('theme', 'light'),
                { wrapper }
            );
            expect(result.current[0]).toBe('light');
        });

        it('возвращает пустую строку, если defaultValue не передан', () => {
            const { result } = renderHook(() => useLocalStorage('missing'), {
                wrapper,
            });
            expect(result.current[0]).toBe('');
        });

        it('читает существующее значение из localStorage', () => {
            localStorage.setItem(STORAGE_KEY, JSON.stringify({ theme: 'dark' }));
            const { result } = renderHook(
                () => useLocalStorage('theme', 'light'),
                { wrapper }
            );
            expect(result.current[0]).toBe('dark');
        });

        it('возвращает defaultValue при битом JSON и предупреждает', () => {
            localStorage.setItem(STORAGE_KEY, '{not valid json');
            const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

            const { result } = renderHook(
                () => useLocalStorage('theme', 'light'),
                { wrapper }
            );

            expect(result.current[0]).toBe('light');
            expect(warn).toHaveBeenCalled();
        });

        it('игнорирует не-объектные данные', () => {
            localStorage.setItem(STORAGE_KEY, JSON.stringify('just a string'));
            const { result } = renderHook(
                () => useLocalStorage('theme', 'light'),
                { wrapper }
            );
            expect(result.current[0]).toBe('light');
        });

        it('игнорирует null в хранилище', () => {
            localStorage.setItem(STORAGE_KEY, 'null');
            const { result } = renderHook(
                () => useLocalStorage('theme', 'light'),
                { wrapper }
            );
            expect(result.current[0]).toBe('light');
        });

        it('возвращает defaultValue, если ключа нет, но есть другие', () => {
            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify({ userEmail: 'a@b.c' })
            );
            const { result } = renderHook(
                () => useLocalStorage('theme', 'light'),
                { wrapper }
            );
            expect(result.current[0]).toBe('light');
        });
    });

    describe('установка значения', () => {
        it('обновляет возвращаемое значение', () => {
            const { result } = renderHook(
                () => useLocalStorage('theme', 'light'),
                { wrapper }
            );
            act(() => result.current[1]('dark'));
            expect(result.current[0]).toBe('dark');
        });

        it('сохраняет значение в localStorage', () => {
            const { result } = renderHook(
                () => useLocalStorage('theme', 'light'),
                { wrapper }
            );
            act(() => result.current[1]('dark'));
            expect(readStorage().theme).toBe('dark');
        });

        it('не затирает другие ключи', () => {
            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify({ userEmail: 'a@b.c' })
            );
            const { result } = renderHook(
                () => useLocalStorage('theme', 'light'),
                { wrapper }
            );
            act(() => result.current[1]('dark'));

            const stored = readStorage();
            expect(stored.theme).toBe('dark');
            expect(stored.userEmail).toBe('a@b.c');
        });

        it('работает с массивами', () => {
            const { result } = renderHook(
                () => useLocalStorage('savedArticles', []),
                { wrapper }
            );
            act(() => result.current[1]([1, 2, 3]));
            expect(result.current[0]).toEqual([1, 2, 3]);
            expect(readStorage().savedArticles).toEqual([1, 2, 3]);
        });

        it('работает с объектами', () => {
            const { result } = renderHook(
                () => useLocalStorage('user', null),
                { wrapper }
            );
            act(() => result.current[1]({ email: 'a@b.c' }));
            expect(result.current[0]).toEqual({ email: 'a@b.c' });
            expect(readStorage().user).toEqual({ email: 'a@b.c' });
        });

        it('сохраняет пустую строку', () => {
            const { result } = renderHook(
                () => useLocalStorage('theme', 'light'),
                { wrapper }
            );
            act(() => result.current[1](''));
            expect(result.current[0]).toBe('');
        });

        it('перезаписывает предыдущее значение', () => {
            const { result } = renderHook(
                () => useLocalStorage('theme', 'light'),
                { wrapper }
            );
            act(() => result.current[1]('dark'));
            act(() => result.current[1]('light'));
            expect(result.current[0]).toBe('light');
            expect(readStorage().theme).toBe('light');
        });
    });

    describe('функциональный апдейтер', () => {
        it('применяет функцию к текущему значению', () => {
            const { result } = renderHook(
                () => useLocalStorage('count', 0),
                { wrapper }
            );
            act(() => result.current[1]((prev) => prev + 1));
            expect(result.current[0]).toBe(1);
        });

        it('функция получает defaultValue как начальное', () => {
            const { result } = renderHook(
                () => useLocalStorage('count', 10),
                { wrapper }
            );
            act(() => result.current[1]((prev) => prev + 1));
            expect(result.current[0]).toBe(11);
        });

        it('функция получает актуальное значение, а не defaultValue', () => {
            localStorage.setItem(STORAGE_KEY, JSON.stringify({ count: 5 }));
            const { result } = renderHook(
                () => useLocalStorage('count', 0),
                { wrapper }
            );
            act(() => result.current[1]((prev) => prev + 1));
            expect(result.current[0]).toBe(6);
        });
    });

    describe('поведение defaultValue', () => {
        it('после явного set значение сохраняется в localStorage', () => {
            const { result } = renderHook(
                () => useLocalStorage('theme', 'light'),
                { wrapper }
            );
            act(() => result.current[1]('light'));
            expect(readStorage().theme).toBe('light');
        });

        it('существующее значение не перезаписывается при монтировании', () => {
            localStorage.setItem(STORAGE_KEY, JSON.stringify({ theme: 'dark' }));
            renderHook(() => useLocalStorage('theme', 'light'), { wrapper });
            expect(readStorage().theme).toBe('dark');
        });
    });

    describe('синхронизация между инстансами', () => {
        it('два хука с одним ключом видят общее состояние', () => {
            const { result } = renderHook(
                () => ({
                    a: useLocalStorage('theme', 'light'),
                    b: useLocalStorage('theme', 'light'),
                }),
                { wrapper }
            );
            act(() => result.current.a[1]('dark'));
            expect(result.current.a[0]).toBe('dark');
            expect(result.current.b[0]).toBe('dark');
        });

        it('три инстанса синхронизированы', () => {
            const { result } = renderHook(
                () => ({
                    a: useLocalStorage('count', 0),
                    b: useLocalStorage('count', 0),
                    c: useLocalStorage('count', 0),
                }),
                { wrapper }
            );
            act(() => result.current.b[1](42));
            expect(result.current.a[0]).toBe(42);
            expect(result.current.b[0]).toBe(42);
            expect(result.current.c[0]).toBe(42);
        });

        it('изменение одного ключа не влияет на другие', () => {
            const { result } = renderHook(
                () => ({
                    theme: useLocalStorage('theme', 'light'),
                    user: useLocalStorage('userEmail', ''),
                }),
                { wrapper }
            );
            act(() => result.current.theme[1]('dark'));
            expect(result.current.theme[0]).toBe('dark');
            expect(result.current.user[0]).toBe('');
        });

        it('в localStorage оказываются все ключи', () => {
            const { result } = renderHook(
                () => ({
                    theme: useLocalStorage('theme', 'light'),
                    user: useLocalStorage('userEmail', ''),
                    articles: useLocalStorage('savedArticles', []),
                }),
                { wrapper }
            );
            act(() => result.current.theme[1]('dark'));
            act(() => result.current.user[1]('a@b.c'));
            act(() => result.current.articles[1]([1, 2]));

            const stored = readStorage();
            expect(stored.theme).toBe('dark');
            expect(stored.userEmail).toBe('a@b.c');
            expect(stored.savedArticles).toEqual([1, 2]);
        });
    });

    // ────────────────────────────────────────────────────────────────
    describe('persistence', () => {
        it('значение переживает перемонтирование провайдера', () => {
            const first = renderHook(
                () => useLocalStorage('theme', 'light'),
                { wrapper }
            );
            act(() => first.result.current[1]('dark'));
            first.unmount();

            const second = renderHook(
                () => useLocalStorage('theme', 'light'),
                { wrapper }
            );
            expect(second.result.current[0]).toBe('dark');
        });

        it('не падает при ошибке записи в localStorage', () => {
            const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
            vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
                throw new DOMException('QuotaExceededError');
            });

            const { result } = renderHook(
                () => useLocalStorage('theme', 'light'),
                { wrapper }
            );
            expect(() => act(() => result.current[1]('dark'))).not.toThrow();
            expect(result.current[0]).toBe('dark');
            expect(warn).toHaveBeenCalled();
        });
    });

    // ────────────────────────────────────────────────────────────────
    describe('требование StoreProvider', () => {
        it('бросает ошибку вне провайдера', () => {
            const consoleError = vi
                .spyOn(console, 'error')
                .mockImplementation(() => {});

            let error;
            try {
                renderHook(() => useLocalStorage('theme', 'light'));
            } catch (e) {
                error = e;
            }

            expect(error?.message).toMatch(/StoreProvider/);
            consoleError.mockRestore();
        });
    });
});