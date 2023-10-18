export function fetchConfig(method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE', body: any) {
    return {
        method,
        headers: {
            'Content-Type': 'application/json;charset=utf-8',
        },
        body: JSON.stringify(body),
    };
}
