export const NUMBER = (value: number) => value.toString();
export const STRING = (value: string) => value;

type Stringifier<T> = (value: T) => string;

type InterpolationValue<T extends Stringifier<R>, R> = R;

type Placeholder<T> = {
    [key: string]: Stringifier<T>;
};

type InterpolationPartial<P extends Placeholder<T>, T> = {
    [K in keyof P]: InterpolationValue<P[K], T>
};

// prettier-ignore
export type InterpolationArgs<T> =
    T extends [Placeholder<infer A>] ? InterpolationPartial<T[0], A> :
    T extends [Placeholder<infer A>, Placeholder<infer B>] ? (InterpolationPartial<T[0], A> & InterpolationPartial<T[1], B>) :
    T extends [Placeholder<infer A>, Placeholder<infer B>, Placeholder<infer C>] ? (InterpolationPartial<T[0], A> & InterpolationPartial<T[1], B> & InterpolationPartial<T[2], C>) :
    never;

export type Interpolable<T> = (args: InterpolationArgs<T>) => string;

function stringify<T>(
    placeholder: Placeholder<T>,
    args: InterpolationPartial<Placeholder<T>, T>,
): string {
    const [name] = Object.keys(placeholder);
    const stringifier: Stringifier<T> = placeholder[name];
    const value: T = args[name];
    return stringifier(value);
}

export default function tpl<T extends any[]>(
    parts: TemplateStringsArray,
    ...placeholders: T
): Interpolable<T> {
    const length = parts.raw.length + placeholders.length;
    return (args: InterpolationArgs<T>) => {
        let result = '';
        for (let i = 0; i < length; i++) {
            if (i % 2 == 0) {
                result += parts[i / 2];
            } else {
                const index = (i - 1) / 2;
                const placeholder = placeholders[index];
                result += stringify(placeholder, args);
            }
        }

        return result;
    };
}
