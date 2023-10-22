export function fetchConfig<T>(method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE', body: T) {
    return {
        method,
        headers: {
            'Content-Type': 'application/json;charset=utf-8',
        },
        body: JSON.stringify(body),
    };
}
