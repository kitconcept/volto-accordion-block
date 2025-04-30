import React, { useEffect, useRef } from 'react';
import { getPanels, accordionBlockHasValue } from './util';
import { withBlockExtensions } from '@plone/volto/helpers';
import { useLocation, useHistory } from 'react-router-dom';
import cx from 'classnames';
import { RenderBlocks } from '@plone/volto/components';
import config from '@plone/volto/registry';
import { defineMessages, useIntl } from 'react-intl';

const useQuery = (location) => {
  const { search } = location;
  return React.useMemo(() => new URLSearchParams(search), [search]);
};
const messages = defineMessages({
  Open: {
    id: 'Open',
    defaultMessage: 'Show less information',
  },
  Close: {
    id: 'Close',
    defaultMessage: 'Show more information',
  },
});

const View = (props) => {
  const { data, className } = props;
  const intl = useIntl();
  const location = useLocation();
  const history = useHistory();
  const panels = getPanels(data.data);
  const metadata = props.metadata || props.properties;
  const non_exclusive = config.blocks?.blocksConfig?.accordion?.non_exclusive;
  const query = useQuery(location);
  const activePanels =
    query.get('activeAccordion')?.split(',').filter(Boolean) ?? [];
  const initialActiveIndex = panels.reduce((acc, [panelId], index) => {
    if (activePanels.includes(panelId)) {
      acc.push(index);
    }
    return acc;
  }, []);

  const [activeIndex, setActiveIndex] = React.useState(initialActiveIndex);
  const [activePanel, setActivePanel] = React.useState(activePanels);

  const [firstIdFromPanels] = panels[0] || null;

  const activePanelsRef = React.useRef(activePanels);
  const firstIdFromPanelsRef = React.useRef(firstIdFromPanels);

  const addQueryParam = (key, value) => {
    const searchParams = new URLSearchParams(location.search);
    searchParams.set(key, value);

    history.push({
      hash: location.hash,
      pathname: location.pathname,
      search: searchParams.toString(),
    });
  };

  const handleClick = (itemProps) => {
    const { index, id } = itemProps;
    const newIndex =
      activeIndex.indexOf(index) === -1
        ? non_exclusive
          ? [...activeIndex, index]
          : [index]
        : activeIndex.filter((item) => item !== index);

    const newPanel =
      activePanel.indexOf(id) === -1
        ? non_exclusive
          ? [...activePanel, id]
          : [id]
        : activePanel.filter((item) => item !== id);

    handleActiveIndex(newIndex, newPanel);
  };

  const handleActiveIndex = (index, id) => {
    setActiveIndex(index);
    setActivePanel(id);
    addQueryParam('activeAccordion', id);
  };

  const handleKeyPress = (e, index, id) => {
    if (e.keyCode === 13 || e.keyCode === 32) {
      e.preventDefault();
      handleClick(e, { index, id });
    }
  };

  // Removing because of the issue selecting the first panel. But why we are selcting it is not clear to me.
  // Also we are not using data.collapsed in fhnw.

  // React.useEffect(() => {
  //   if (data.collapsed) {
  //     setActivePanel(activePanelsRef.current || []);
  //   } else {
  //     if (!!activePanelsRef.current && !!activePanelsRef.current[0].length) {
  //       setActivePanel(activePanelsRef.current || []);
  //     } else {
  //       setActivePanel([
  //         firstIdFromPanelsRef.current,
  //         ...(activePanelsRef.current || []),
  //       ]);
  //     }
  //   }
  // }, [data.collapsed]);

  // Scroll into view the first active(Open) panel.
  const hasScrolledRef = useRef(false);
  useEffect(() => {
    if (hasScrolledRef.current) return;

    const firstVisible = activePanels.find((panelId) =>
      document.getElementById(panelId),
    );
    if (firstVisible) {
      document
        .getElementById(firstVisible)
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      hasScrolledRef.current = true;
    }
  }, []);

  return (
    <div className={cx('block accordionBlock', className)}>
      {data.headline && <h2 className="headline">{data.headline}</h2>}
      {panels.map(([id, panel], index) => {
        const isActive = activeIndex.includes(index);
        return accordionBlockHasValue(panel) ? (
          <div
            key={id}
            id={id}
            className={cx('accordion', isActive ? 'open' : '')}
          >
            <div
              className={cx('accordion-header')}
              onClick={() => handleClick({ index, id })}
              onKeyDown={(e) => handleKeyPress(e, index, id)}
              role="button"
              tabIndex={0}
              aria-expanded={isActive}
              title={
                isActive
                  ? intl.formatMessage(messages.Open)
                  : intl.formatMessage(messages.Close)
              }
            >
              <div className="accordion-title">{panel?.title}</div>
            </div>
            <div className={cx('accordion-body', isActive ? 'open' : '')}>
              <div className="accordion-content">
                <RenderBlocks
                  {...props}
                  location={location}
                  metadata={metadata}
                  content={panel}
                />
              </div>
            </div>
          </div>
        ) : null;
      })}
    </div>
  );
};

export default withBlockExtensions(View);
