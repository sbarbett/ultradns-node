const axios = require('axios');
const { getClientUserAgent } = require('./about');

class UltraApi {
    constructor(bu, pr = null, useToken = false, debug = false, pprint = false, userAgent = null) {
        this.baseUrl = "https://api.ultradns.com";
        this.accessToken = '';
        this.refreshToken = '';
        this.debug = debug;
        this.pprint = pprint;
        this.userAgent = userAgent || getClientUserAgent();

        if (useToken) {
            this.accessToken = bu;
            this.refreshToken = pr;
            if (!this.refreshToken) {
                console.warn("Warning: Passing a Bearer token with no refresh token means the client state will expire after an hour.");
            }
        } else {
            if (!pr) {
                throw new Error("Password is required when providing a username.");
            }
            this._auth(bu, pr);
        }
    }

    static async connect(bu, pr, useToken = false, debug = false, pprint = false, userAgent = null) {
        const instance = new UltraApi(bu, pr, useToken, debug, pprint, userAgent);
        if (!useToken) {
            await instance._auth(bu, pr);
        }
        return instance;
    }

    async _auth(username, password) {
        const payload = new URLSearchParams();
        payload.append('grant_type', 'password');
        payload.append('username', username);
        payload.append('password', password);
        
        const response = await axios.post(`${this.baseUrl}/authorization/token`, payload, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
        
        this.accessToken = response.data.accessToken;
        this.refreshToken = response.data.refreshToken;
    }

    async _refresh() {
        if (this.refreshToken) {
            const payload = new URLSearchParams();
            payload.append('grant_type', 'refresh_token');
            payload.append('refresh_token', this.refreshToken);
            
            const response = await axios.post(`${this.baseUrl}/authorization/token`, payload, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });
            
            this.accessToken = response.data.accessToken;
            this.refreshToken = response.data.refreshToken;
        } else {
            throw new Error("Error: Your token cannot be refreshed.");
        }
    }

    _headers(contentType = null) {
        const headers = {
            Accept: "application/json",
            Authorization: `Bearer ${this.accessToken}`,
            "User-Agent": this.userAgent
        };
        if (contentType) {
            headers["Content-Type"] = contentType;
        }
        return headers;
    }

    toggleDebug() {
        this.debug = !this.debug;
        console.log(this.debug ? "Debug mode enabled." : "Debug mode disabled.");
    }

    togglePPrint() {
        this.pprint = !this.pprint;
        console.log(this.pprint ? "Pretty print mode enabled." : "Pretty print mode disabled.");
    }

    setUserAgent(userAgent) {
        console.log(`User agent set to '${userAgent}'`);
        this.userAgent = userAgent;
    }

    async post(uri, payload = null, plainText = false) {
        return await this._call(uri, "POST", null, payload, true, "application/json", plainText);
    }

    async put(uri, payload, plainText = false) {
        return await this._call(uri, "PUT", null, payload, true, "application/json", plainText);
    }

    async patch(uri, payload, plainText = false) {
        return await this._call(uri, "PATCH", null, payload, true, "application/json", plainText);
    }

    async get(uri, params = {}, contentType = null) {
        if (contentType) {
            return await this._call(uri, "GET", params, null, true, contentType, false);
        } else {
            return await this._call(uri, "GET", params, null, true, "application/json", false);
        }
    }

    async delete(uri, contentType = null) {
        if (contentType) {
            return await this._call(uri, "DELETE", null, null, true, contentType, false);
        } else {
            return await this._call(uri, "DELETE", null, null, true, "application/json", false);
        }
    }

    async _call(uri, method, params = {}, payload = null, retry = true, contentType = "application/json", plainText = false) {
        const options = {
            method,
            url: `${this.baseUrl}${uri}`,
            headers: this._headers(contentType),
            params,
            data: plainText ? payload : JSON.stringify(payload)
        };

        if (this.debug) {
            console.log("Debug info:", options);
        }

        try {
            const response = await axios(options);

            if (response.status === 204) {
                return this.pprint ? JSON.stringify({ status_code: 204, message: "No content" }, null, 4) : { status_code: 204, message: "No content" };
            }
            if (response.headers['content-type'] === 'application/zip') {
                return response.data;
            }
            if (response.headers['content-type'] === 'text/plain') {
                return response.data;
            }
            if (response.status === 202) {
                let responseData = response.data;
                responseData.task_id = response.headers['x-task-id'];
                return responseData;
            }

            return this.pprint ? JSON.stringify(response.data, null, 4) : response.data;
        } catch (error) {
            if (error.response && error.response.status === 401 && retry) {
                await this._refresh();
                return this._call(uri, method, params, payload, false, contentType, plainText);
            }
            throw error;
        }
    }
}

module.exports = UltraApi;