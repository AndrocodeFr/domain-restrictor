'use strict';

module.exports = ({ strapi }) => ({
  async find(query) {
    return await strapi.entityService.findMany("plugin::domain-restrictor.domain", query);
  },

  async delete(id) {
    return await strapi.entityService.delete("plugin::domain-restrictor.domain", id);
  },

  async create(data) {
    return await strapi.entityService.create("plugin::domain-restrictor.domain", data);
  },
});
