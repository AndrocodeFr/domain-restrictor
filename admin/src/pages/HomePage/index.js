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

  const getCurrentDomain = () => {
    return window.location.hostname;
  };

  const fetchDomains = async () => {
    if (isLoading === false) setIsLoading(true);
    const data = await domainRequest.getDomains();
    const currentDomain = getCurrentDomain();
    let updatedData = data.map(domain => ({
      ...domain,
      checked: domain.name === currentDomain ? false : checkedAll
    }));

    if (!updatedData.find(d => d.name === currentDomain)) {
      await domainRequest.addDomain({ "data": { "name": currentDomain } });
      updatedData = [...updatedData, { id: Date.now(), name: currentDomain, checked: false }];
    }

    setDomains(updatedData);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchDomains();
  }, []);

  const isInDomainList = (domain) => {
    return domains.find(d => d.name === domain);
  }

  const handleAddDomain = async () => {
    if (domain && !isInDomainList(domain)) {
      await domainRequest.addDomain({ "data": { "name": domain } });
      setDomain('');
      fetchDomains();
    }
  };

  const handleDeleteDomain = async () => {
    const selectedDomains = domains.filter(domain => domain.checked);
    selectedDomains.forEach(async domain => {
      if(domain.name === getCurrentDomain()) return;
      await domainRequest.deleteDomain(domain.id);
    });
    fetchDomains();
  }
  
  const handleCheckAll = () => {
    const currentDomain = getCurrentDomain();
    const updatedDomains = domains.map(domain => ({
      ...domain,
      checked: domain.name !== currentDomain ? !checkedAll : domain.checked
    }));
    setDomains(updatedDomains);
    setCheckedAll(!checkedAll);
  };

  const handleCheck = (id) => {
    const updatedDomains = domains.map(domain => {
      if (domain.id === id) {
        return {
          ...domain,
          checked: !domain.checked
        }
      }
      return domain;
    });
    setDomains(updatedDomains);

    // if all domains are checked exepte currentDomain, checkedAll is true
    const currentDomain = getCurrentDomain();
    const checkedAll = updatedDomains.filter(domain => domain.name !== currentDomain).every(domain => domain.checked);
    setCheckedAll(checkedAll);
  }

  if (isLoading) {
    return <LoadingIndicatorPage />;
  }

  return (
    <Layout sideNav={null}>

      <BaseHeaderLayout
        title="Domain Restrictor"
        description="Allows you to restrict access to your Strapi to certain domains"
        as="h1"
      />

      <div className='main'>

        <div className='description'>
          <p>
            On your server, you have <b>multiple</b> (sub)domains and you restrict this Strapi to only certain ones. Enter the domain(s) you want to authorize below!
          </p>
          {/* <p className="warning-message">
            <b>Warning</b>, be careful once entered, if you reload the page and it is not the correct domain, you will be blocked.
          </p> */}
        </div>

        <div className='form'>
          <TextInput
            placeholder="Authorized domain"
            label="Enter an authorized domain name"
            aria-label="Authorized domain"
            onChange={e => setDomain(e.target.value)}
            onKeyPress={e => {
              if (e.key === 'Enter') {
                handleAddDomain();
              }
            }}
            value={domain} />
          <button
            className='btn'
            onClick={handleAddDomain}
          >Add!</button>
        </div>

        <div className='table'>
          {domains && domains.length > 0 ? (
            <>
              <button className='btn alert' onClick={handleDeleteDomain}>Delete</button>
              <Table>
                <Thead>
                  <Tr>
                    <Th>
                      <BaseCheckbox aria-label="Select all entries" checked={checkedAll} onClick={handleCheckAll} />
                    </Th>
                    <Th>
                      <Typography variant="sigma">Domain</Typography>
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {domains.map(entry =>
                    <Tr key={entry.id}>
                      <Td>
                        <BaseCheckbox aria-label={`Select ${entry.id}`} checked={entry.checked} onClick={e => { handleCheck(entry.id) }} disabled={getCurrentDomain() === entry.name} />
                      </Td>
                      <Td>
                        <Typography textColor="neutral800">{entry.name}</Typography>
                      </Td>
                    </Tr>)}
                </Tbody>
              </Table>
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