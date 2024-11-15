import cx from 'classnames';
import React from 'react';

import { injectIntl } from 'react-intl';
import config from '@plone/volto/registry';

import { defineMessages, useIntl } from 'react-intl';

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
  const non_exclusive = config.blocks?.blocksConfig?.accordion?.non_exclusive;
  const intl = useIntl();

  const handleClick = (e, itemProps) => {
    // // If the title was clicked, bail out, let the event bubble.
    if (e.preventToggle) {
      return;
    }
    // // Do not stop propagation, bubbling is needed for the editor to select the block.
    const { index } = itemProps;
    if (non_exclusive) {
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
    if (data.collapsed) {
      setActiveIndex([]);
    }
  }, [data.collapsed]);

  return (
    <div className={cx('accordion', isActive ? 'open' : '')}>
      <div
        className={cx('accordion-header')}
        onClick={(e) => handleClick(e, { index })}
        onKeyDown={(e) => null}
        role="button"
        tabIndex={0}
        aria-expanded={isActive}
        title={
          isActive
            ? intl.formatMessage(messages.Open)
            : intl.formatMessage(messages.Close)
        }
      >
        <div className="accordion-title">
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
        </div>
      </div>
      <div className={cx('accordion-body', isActive ? 'open' : '')}>
        <div className="accordion-content">{children}</div>
      </div>
    </div>
  );
};

export default injectIntl(AccordionEdit);
