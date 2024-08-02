/*
 *
 * HomePage
 *
 */

import React, { useEffect, useState } from 'react';
import pluginId from '../../pluginId';
import { BaseCheckbox, Button, Table, Tbody, Td, TextInput, Th, Thead, Tr, Typography } from '@strapi/design-system';
import './style.css';

const HomePage = () => {
  const [domain, setDomain] = useState('');
  const [domains, setDomains] = useState([]);
  const [checkedAll, setCheckedAll] = useState(false);

  useEffect(() => {
    const currentDomain = window.location.hostname;
    setDomains([{ id: 1, name: currentDomain, checked: false, immutable: true }]);
  }, []);

  const addDomain = () => {
    if (!domain) return;

    const id = domains.length + 1;
    setDomains([...domains, { id: id, name: domain, checked: false, immutable: false }]);
    setDomain('');
  };

  const removeDomain = () => {
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

  const checkDomain = (id) => {
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

  const globalCheck = () => {
    setCheckedAll(!checkedAll);
    if (checkedAll) {
      uncheckAll();
    } else {
      checkAll();
    }
  };

  const checkAll = () => {
    const newDomains = domains.map(domain => ({ ...domain, checked: true }));
    setDomains(newDomains);
  };

  const uncheckAll = () => {
    const newDomains = domains.map(domain => ({ ...domain, checked: false }));
    setDomains(newDomains);
  };

  return (
    <div className='main'>
      <Typography variant="alpha">Limiteur de domaine</Typography>

      <div className='description'>
        <p>
          Sur votre server vous possédez <b>plusieurs</b> sous domaines et vous limitez ce strapi à seulement certains. Saisissez ci  dessous le/les domaines que vous souhaité autorisé !
        </p>
        <p className="warning-message">
          <b>Attention</b>, ne vous trompez pas une fois saisis, si vous rechargez la page et que ce n'est pas le bon domaine vous serez bloqué.
        </p>
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
  );
};

export default HomePage;