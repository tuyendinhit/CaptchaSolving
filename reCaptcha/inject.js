window.location = "javascript: (" + function() {
    let recaptchaInstance;

    Object.defineProperty(window, "grecaptcha", {
        get: function() {
            return recaptchaInstance;
        },
        set: function(e) {
            recaptchaInstance = e;
            manageRecaptchaObj(e);
            manageEnterpriseObj(e);
        },
    });

    let manageRecaptchaObj = function(obj) {
        let originalExecuteFunc;
        let originalResetFunc;

        Object.defineProperty(obj, "execute", {
            get: function() {
                return async function(sitekey, options) {
                    if (!options) {
                        if (!isInvisible()) {
                            return await originalExecuteFunc(sitekey, options);
                        }
                    }

                    let widgetId = addWidgetInfo(sitekey, options);

                    return await waitForResult(widgetId);
                };
            },
            set: function(e) {
                originalExecuteFunc = e;
            },
        });

        Object.defineProperty(obj, "reset", {
            get: function() {
                return function(widgetId) {
                    if (widgetId === undefined) {
                        let ids = Object.keys(___grecaptcha_cfg.clients)[0];
                        widgetId = ids.length ? ids[0] : 0;
                    }

                    resetCaptchaWidget("recaptcha", widgetId);

                    return originalResetFunc(widgetId);
                };
            },
            set: function(e) {
                originalResetFunc = e;
            },
        });
    };

    let manageEnterpriseObj = function(obj) {
        let originalEnterpriseObj;

        Object.defineProperty(obj, "enterprise", {
            get: function() {
                return originalEnterpriseObj;
            },
            set: function(ent) {
                originalEnterpriseObj = ent;

                let originalExecuteFunc;
                let originalResetFunc;

                Object.defineProperty(ent, "execute", {
                    get: function() {
                        return async function(sitekey, options) {
                            if (!options) {
                                if (!isInvisible()) {
                                    return await originalExecuteFunc(sitekey, options);
                                }
                            }

                            let widgetId = addWidgetInfo(sitekey, options, "1");

                            return await waitForResult(widgetId);
                        };
                    },
                    set: function(e) {
                        originalExecuteFunc = e;
                    },
                });

                Object.defineProperty(ent, "reset", {
                    get: function() {
                        return function(widgetId) {
                            if (widgetId === undefined) {
                                let ids = Object.keys(___grecaptcha_cfg.clients)[0];
                                widgetId = ids.length ? ids[0] : 0;
                            }

                            resetCaptchaWidget("recaptcha", widgetId);

                            return originalResetFunc(widgetId);
                        };
                    },
                    set: function(e) {
                        originalResetFunc = e;
                    },
                });
            },
        });
    };

    let addWidgetInfo = function(sitekey, options, enterprise) {
        let widgetId = parseInt(Date.now() / 1000);

        let badge = document.querySelector(".grecaptcha-badge");
        if (!badge.id) badge.id = "recaptcha-badge-" + widgetId;

        let callback = "rv3ExecCallback" + widgetId;
        window[callback] = function(response) {
            getCaptchaWidgetButton("recaptcha", widgetId).dataset.response = response;
        };

        let widgetInfo = {
            captchaType: "recaptcha",
            widgetId: widgetId,
            version: "v3",
            sitekey: sitekey,
            action: options.action,
            s: null,
            enterprise: enterprise || "0",
            callback: callback,
            containerId: badge.id,
        };

        registerCaptchaWidget(widgetInfo);

        return widgetId;
    };

    let waitForResult = function(widgetId) {
        return new Promise(function(resolve, reject) {
            let interval = setInterval(function() {
                let button = getCaptchaWidgetButton("recaptcha", widgetId);

                if (button && button.dataset.response) {
                    resolve(button.dataset.response);
                    clearInterval(interval);
                }
            }, 500);
        });
    };

    let isInvisible = function() {
        const listCaptcha = JSON.parse(localStorage.getItem(randomNameForDataStorage) || '[]');

        for (let i = 0; i < listCaptcha.length; i++) {
            if (listCaptcha[i].version == 'v2_invisible') {
                let badge = document.querySelector('.grecaptcha-badge');
                badge.id = "recaptcha-badge-" + listCaptcha[i].widgetId;
                listCaptcha[i].containerId = badge.id;
                return true;
            }
        }

        return false;
    };

} + ")()";