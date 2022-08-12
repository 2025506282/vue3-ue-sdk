// promise 版本
export function ajax(options) {
    let { path, method, data } = options
    return new Promise(function (resolve, reject) {
        let request = new XMLHttpRequest()
        request.open(method, path)
        request.send(data)
        request.onreadystatechange = () => {
            if (request.readyState === 4) {
                if (request.status >= 200 && request.status < 300) {
                    resolve.call(undefined, JSON.parse(request.responseText))
                } else if (request.status >= 400) {
                    reject.call(undefined, request)
                }
            }
        }
    })
}