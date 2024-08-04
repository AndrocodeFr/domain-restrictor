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
    },
  },

  {
    method: 'POST',
    path: '/create',
    handler: 'domain.create',
    config: {
      policies: [],
    },
  },

  {
    method: 'DELETE',
    path: '/delete/:id',
    handler: 'domain.delete',
    config: {
      policies: [],
    },
  },
];