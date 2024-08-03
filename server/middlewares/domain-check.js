'use strict';

/**
 * `domain-check` middleware
 */

// module.exports = (config, { strapi }) => {
//   // Add your own logic here.
//   return async (ctx, next) => {
//     strapi.log.info('In domain-check middleware.');

//     await next();
//   };
// };

module.exports = async (ctx, next) => {
  const requestHost = ctx.request.hostname;
  // Récupérez la liste des domaines autorisés depuis votre configuration ou base de données

  const defaultDomain = [];
  const allowedDomains = (await strapi.plugin("domain-restrictor").service("domain").find(ctx.query)).map(domain => domain.name);
  allowedDomains.push(...defaultDomain);
  
  const authorizedAccess = () => {
    if(allowedDomains.length === 0) return true;
    return allowedDomains.includes(requestHost);
  }
  
  if (authorizedAccess()) {
    console.log(`Domaine autorisé : ${requestHost}`);
    await next();
  } else {
    console.log(`Domaine non autorisé : ${requestHost}`);
    ctx.status = 403;
    ctx.body = { error: 'Domaine non autorisé' };
  }
};
