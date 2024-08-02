"use strict";

module.exports = {
    async find(ctx) {
        try {
            return await strapi.plugin("domain-restrictor").service("domain").find(ctx.query);
        } catch (error) {
            ctx.trow(500, error);
        }
    },

    async delete(ctx) {
        try {
            ctx.body = await strapi
                .plugin("domain-restrictor")
                .service("domain")
                .delete(ctx.params.id);
        } catch (error) {
            ctx.throw(500, error);
        }
    },

    async create(ctx) {
        try {
            ctx.body = await strapi
                .plugin("domain-restrictor")
                .service("domain")
                .create(ctx.request.body);
        } catch (error) {
            ctx.throw(500, error);
        }
    },
}