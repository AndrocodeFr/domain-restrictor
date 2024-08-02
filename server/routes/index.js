module.exports = [
  {
    method: 'GET',
    path: '/',
    handler: 'myController.index',
    config: {
      policies: [],
    },
  },

  {
    method: 'GET',
    path: '/find',
    handler: 'domain.find',
    config: {
      policies: [],
      auth: false,
    },
  },

  {
    method: 'POST',
    path: '/create',
    handler: 'domain.create',
    config: {
      policies: [],
      auth: false,
    },
  },

  {
    method: 'DELETE',
    path: '/delete/:id',
    handler: 'domain.delete',
    config: {
      policies: [],
      auth: false,
    },
  },
];