# Domain Restrictor Plugin for Strapi

![Strapi version](https://img.shields.io/badge/Strapi-4.x-green.svg)
![License](https://img.shields.io/github/license/AndrocodeFr/domain-restrictor)

## Description

The Domain Restrictor plugin is designed to manage domain-based access control within a Strapi application. It provides a way to specify allowed domains and restrict access to the application based on these domains.

## Features

- Create, Read, and Delete domains to control access.
- Middleware to enforce domain restrictions on incoming requests.
- User-friendly interface for managing allowed domains within the Strapi admin panel.
- Automatically adds the current domain to the allowed list if not present.
- Supports custom domain validation logic.

## Installation

To install the Domain Restrictor plugin, simply run the following command in your Strapi project:

```bash
npm install strapi-plugin-domain-restrictor
```

Then, add the plugin to your Strapi configuration:

```javascript
module.exports = {
  // Other configurations...
  'domain-restrictor': {
    enabled: true,
    resolve: './src/plugins/domain-restrictor'
  }
};
```

## Usage

### Managing Domains

1. Navigate to the Domain Restrictor section in the Strapi admin panel.
2. Add, delete, or view the list of allowed domains.
3. The current domain is automatically added to the list if it's not already included.

### Middleware

The plugin includes a middleware that checks incoming requests against the allowed domain list:

```javascript
module.exports = async (ctx, next) => {
  const requestHost = ctx.request.hostname;
  const allowedDomains = (await strapi.plugin("domain-restrictor").service("domain").find(ctx.query)).map(domain => domain.name);
  
  if (!allowedDomains.length || allowedDomains.includes(requestHost)) {
    await next();
  } else {
    ctx.unauthorized('Domain not allowed');
  }
};
```

## Configuration

You can configure the plugin via the Strapi admin interface or directly through the Strapi configuration files.

### Content Type

The plugin defines a content type `domain` which stores the list of allowed domains:

```json
{
  "kind": "collectionType",
  "collectionName": "domains",
  "info": {
    "singularName": "domain",
    "pluralName": "domains",
    "displayName": "Domain"
  },
  "attributes": {
    "name": {
      "type": "string"
    }
  }
}
```

### API Endpoints

- **GET** `/domains`: Retrieve the list of allowed domains.
- **POST** `/domains`: Add a new domain to the allowed list.
- **DELETE** `/domains/:id`: Remove a domain from the allowed list.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request with your improvements or bug fixes.

## License

This project is licensed under the MIT License.
