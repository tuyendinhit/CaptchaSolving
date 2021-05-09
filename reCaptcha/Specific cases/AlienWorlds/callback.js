function call_cbf(token) {
    let widgetId = 0;
    let widget = ___grecaptcha_cfg.clients[widgetId];
    let callback = undefined;
    for (let k1 in widget) {
        let obj = widget[k1];
        if (typeof obj !== "object") continue;
        for (let k2 in obj) {
            if (obj[k2] === null) continue;
            if (typeof obj[k2] !== "object") continue;
            if (obj[k2].callback === undefined) continue;
            callback = obj[k2].callback;
            break
        }
        if (callback === undefined) break;
    }
    callback.bind(this);
    callback(token);
}
call_cbf(arguments[0]);