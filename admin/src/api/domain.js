import { request } from "@strapi/helper-plugin";

const domainsRequest = {
    getDomains: async () => {
        return await request("/domain-restrictor/find", {
            method: "GET",
        });
    },
}

export default domainsRequest;