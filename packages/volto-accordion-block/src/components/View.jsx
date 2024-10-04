import React from 'react';
import { getPanels, accordionBlockHasValue } from './util';
import { withBlockExtensions } from '@plone/volto/helpers';
import { useLocation, useHistory } from 'react-router-dom';
import cx from 'classnames';
import { RenderBlocks, Icon } from '@plone/volto/components';

import rightSVG from '@plone/volto/icons/right-key.svg';

const useQuery = (location) => {
  const { search } = location;
  return React.useMemo(() => new URLSearchParams(search), [search]);
};

const View = (props) => {
  const { data, className } = props;
  const location = useLocation();
  const history = useHistory();
  const panels = getPanels(data.data);
  const metadata = props.metadata || props.properties;

  const [activeIndex, setActiveIndex] = React.useState([]);
  const [activePanel, setActivePanel] = React.useState([]);

  const query = useQuery(location);
  const activePanels = query.get('activeAccordion')?.split(',');
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
        ? data.non_exclusive
          ? [...activeIndex, index]
          : [index]
        : activeIndex.filter((item) => item !== index);

    const newPanel =
      activePanel.indexOf(id) === -1
        ? data.non_exclusive
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

  React.useEffect(() => {
    if (data.collapsed) {
      setActivePanel(activePanelsRef.current || []);
    } else {
      if (!!activePanelsRef.current && !!activePanelsRef.current[0].length) {
        setActivePanel(activePanelsRef.current || []);
      } else {
        setActivePanel([
          firstIdFromPanelsRef.current,
          ...(activePanelsRef.current || []),
        ]);
      }
    }
  }, [data.collapsed]);

  return (
    <div className={cx('block accordion', className)}>
      {data.headline && <h2 className="headline">{data.headline}</h2>}
      {panels.map(([id, panel], index) => {
        const isActive = activeIndex.includes(index);
        return accordionBlockHasValue(panel) ? (
          <div key={id} id={id} className={'accordion-item'}>
            <div
              className={cx('accordion-title')}
              onClick={() => handleClick({ index, id })}
              onKeyDown={(e) => handleKeyPress(e, index, id)}
              role="button"
              tabIndex={0}
              aria-expanded={isActive}
            >
              <span>{panel?.title}</span>
              <Icon
                className={cx(isActive ? 'open' : '')}
                name={rightSVG}
                size="20px"
              />
            </div>
            <div className={cx('content-wrapper', isActive ? 'open' : '')}>
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
