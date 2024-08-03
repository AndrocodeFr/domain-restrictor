import { request } from "@strapi/helper-plugin";

const domainsRequest = {
    getDomains: async () => {
        return await request("/domain-restrictor/find", {
            method: "GET",
        });
    },

    addDomain: async (data) => {
        console.log(data);
        return await request("/domain-restrictor/create", {
            method: "POST",
            body: data,
        });
    },
    
    deleteDomain: async (id) => {
        return await request(`/domain-restrictor/delete/${id}`, {
            method: "DELETE",
        });
    }
}

export default domainsRequest;