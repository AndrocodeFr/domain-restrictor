import React, { useEffect, useState } from 'react';
import pluginId from '../../pluginId';
import domainRequest from '../../api/domain';
import { BaseCheckbox, Button, Table, Tbody, Td, TextInput, Th, Thead, Tr, Typography, BaseHeaderLayout, Layout } from '@strapi/design-system';
import './style.css';
import { LoadingIndicatorPage } from '@strapi/helper-plugin';

const HomePage = () => {

  const [isLoading, setIsLoading] = useState(true);
  const [domain, setDomain] = useState('');
  const [domains, setDomains] = useState([]);
  const [checkedAll, setCheckedAll] = useState(false);

  const fetchDomains = async () => {
    if (isLoading === false) setIsLoading(true);
    const data = await domainRequest.getDomains();
    setDomains(data);
    setIsLoading(false);
  }

  useEffect(() => {
    fetchDomains();
  }, []);

  const addDomain = async () => {
    if (!domain) return;

    const id = domains.length + 1;
    setDomains([...domains, { id: id, name: domain, checked: false, immutable: false }]);
    setDomain('');
  };

  const removeDomain = async () => {
    const currentDomain = domains.find(domain => domain.immutable);
    const otherDomains = domains.filter(domain => !domain.immutable);

    if (currentDomain.checked && otherDomains.length === 0) {
      alert('Vous ne pouvez pas supprimer le domaine actuel s\'il est le seul dans la liste.');
      return;
    }

    if (currentDomain.checked && otherDomains.length > 0) {
      const confirmDelete = window.confirm('Êtes-vous sûr de vouloir supprimer le domaine actuel ?');
      if (!confirmDelete) {
        return;
      }
    }

    const newDomains = domains.filter(domain => domain.checked === false || domain.immutable === true);
    setDomains(newDomains);

    if (checkedAll) {
      setCheckedAll(false);
    }
  };

  const checkDomain = async (id) => {
    const newDomains = domains.map(domain => {
      if (domain.id === id) {
        return { ...domain, checked: !domain.checked };
      }
      return domain;
    });
    setDomains(newDomains);

    if (newDomains.filter(domain => domain.checked === false).length === 0) {
      setCheckedAll(true);
    }

    if (newDomains.filter(domain => domain.checked === true).length === 0) {
      setCheckedAll(false);
    }
  };

  const globalCheck = async () => {
    setCheckedAll(!checkedAll);
    if (checkedAll) {
      uncheckAll();
    } else {
      checkAll();
    }
  };

  const checkAll = async () => {
    const newDomains = domains.map(domain => ({ ...domain, checked: true }));
    setDomains(newDomains);
  };

  const uncheckAll = async () => {
    const newDomains = domains.map(domain => ({ ...domain, checked: false }));
    setDomains(newDomains);
  };

  if (isLoading) {
    return <LoadingIndicatorPage />;
  }

  return (
    <Layout sideNav={null}>

      <BaseHeaderLayout
        title="Limiteur de domaine"
        description="Permet de limiter l'accès à votre strapi à certains domaines"
        as="h1"
      />

      <div className='main'>

        <div className='description'>
          <p>
            Sur votre server vous possédez <b>plusieurs</b> sous domaines et vous limitez ce strapi à seulement certains. Saisissez ci  dessous le/les domaines que vous souhaité autorisé !
          </p>
          {/* <p className="warning-message">
            <b>Attention</b>, ne vous trompez pas une fois saisis, si vous rechargez la page et que ce n'est pas le bon domaine vous serez bloqué.
          </p> */}
        </div>

        <div className='form'>
          <TextInput
            placeholder="Domaine autorisé"
            label="Saisir un nom le domaine autorisé"
            aria-label="Domaine autorisé"
            onChange={e => setDomain(e.target.value)}
            value={domain} />
          <button className='btn' onClick={addDomain}>Ajouter !</button>
        </div>

        <div className='table'>
          {domains && domains.length > 0 ? (
            <>
              <Table>
                <Thead>
                  <Tr>
                    <Th>
                      <BaseCheckbox aria-label="Select all entries" checked={checkedAll} onClick={globalCheck} />
                    </Th>
                    <Th>
                      <Typography variant="sigma">Domaine</Typography>
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {domains.map(entry =>
                    <Tr key={entry.id}>
                      <Td>
                        <BaseCheckbox aria-label={`Select ${entry.id}`} checked={entry.checked} onClick={e => { checkDomain(entry.id) }} />
                      </Td>
                      <Td>
                        <Typography textColor="neutral800">{entry.name}</Typography>
                      </Td>
                    </Tr>)}
                </Tbody>
              </Table>
              <button className='btn alert' onClick={removeDomain}>Supprimer</button>
            </>
          ) : (
            <></>
          )}
        </div>

      </div>

    </Layout>

  );
};

export default HomePage;