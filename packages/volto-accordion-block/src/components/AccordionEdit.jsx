import cx from 'classnames';
import React from 'react';
import { Icon } from '@plone/volto/components';
import { injectIntl } from 'react-intl';

import rightSVG from '@plone/volto/icons/right-key.svg';

const AccordionEdit = (props) => {
  const {
    children,
    handleTitleChange,
    handleTitleClick,
    panel,
    data,
    index,
    uid,
  } = props;
  const [activeIndex, setActiveIndex] = React.useState([0]);
  const isActive = activeIndex.includes(index);

  const handleClick = (e, itemProps) => {
    // If the title was clicked, bail out, let the event bubble.
    if (e.preventToggle) {
      return;
    }
    // Do not stop propagation, bubbling is needed for the editor to select the block.
    const { index } = itemProps;
    if (data.non_exclusive) {
      const newIndex =
        activeIndex.indexOf(index) === -1
          ? [...activeIndex, index]
          : activeIndex.filter((item) => item !== index);

      setActiveIndex(newIndex);
    } else {
      const newIndex =
        activeIndex.indexOf(index) === -1
          ? [index]
          : activeIndex.filter((item) => item !== index);

      setActiveIndex(newIndex);
    }
  };

  React.useEffect(() => {
    return data.collapsed && setActiveIndex([]);
  }, [data.collapsed]);

  return (
    <div className={'accordion-item'}>
      <div
        className={cx('accordion-title')}
        onClick={(e) => handleClick(e, { index })}
        onKeyDown={(e) => null}
        role="button"
        tabIndex={0}
        aria-expanded={isActive}
      >
        <input
          placeholder="Enter title here..."
          value={panel?.title}
          onClick={(e) => {
            handleTitleClick();
            // Do not stop propagation, bubbling is needed for the editor to select the block.
            // However mark the event so we ignore the open/close.
            e.preventToggle = true;
          }}
          onChange={(e) => handleTitleChange(e, [uid, panel])}
        />
        <Icon
          className={cx(isActive ? 'open' : '')}
          name={rightSVG}
          size="20px"
        />
      </div>
      <div className={cx('content-wrapper', isActive ? 'open' : '')}>
        <div className="accordion-content">{children}</div>
      </div>
    </div>
  );
};

export default injectIntl(AccordionEdit);
