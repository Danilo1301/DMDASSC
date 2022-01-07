const request = require('request');

export class Gamelog {
    public static URL = "http://localhost:3000/gamelog/log";
    public static SERVICE_NAME = "test";

    public static log(address: string, message: string, sendPing: boolean, isLocal: boolean) {
        let url = this.URL

        const data = {
            service: this.SERVICE_NAME,
            address: address,
            message: message,
            sendPing: sendPing,
            isLocal: isLocal
        }

        console.log("[gamelog] post", url, data)

        request.post(
            url,
            { headers: {'user-agent': `service-${this.SERVICE_NAME}`}, json: data },
            function (error, response, body) {

                if(error) {
                    console.log("[gamelog] post error");
                    return
                }

                if (response.statusCode == 200) {
                    console.log("[gamelog] post ok");
                }
            }
        );
    }
}