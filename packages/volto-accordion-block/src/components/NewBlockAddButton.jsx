import React from 'react';
import { defineMessages, injectIntl } from 'react-intl';
import { BlockChooser, Icon } from '@plone/volto/components';
import { usePopper } from 'react-popper';
import { createPortal } from 'react-dom';
import addSVG from '@plone/volto/icons/add.svg';

const messages = defineMessages({
  AddBlockInPosition: {
    id: 'add_block_in_position',
    defaultMessage: 'Add block in position',
  },
});

const OpenedBlocksChooser = (props) => {
  const { blocksConfig, block, onInsertBlock } = props;

  const ref = React.useRef(null);

  function handleClickOutside(event) {
    if (ref.current && !ref.current.contains(event.target)) {
      props.setOpenMenu(false);
    }
  }

  React.useEffect(() => {
    document.body.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.body.removeEventListener('mousedown', handleClickOutside);
    };
  });

  return (
    <BlockChooser
      onInsertBlock={onInsertBlock}
      currentBlock={block}
      blocksConfig={blocksConfig}
      ref={ref}
    />
  );
};

const NewBlockAddButton = (props) => {
  const { index, intl } = props;
  const [isOpenMenu, setOpenMenu] = React.useState(false);

  const referenceElement = React.useRef(null);
  const popperElement = React.useRef(null);
  const { styles, attributes } = usePopper(
    referenceElement.current,
    popperElement.current,
    {
      placement: 'left',
      modifiers: [
        {
          name: 'offset',
          options: {
            offset: [0, 0],
          },
        },
        {
          name: 'flip',
        },
      ],
    },
  );

  return (
    <>
      <button
        onClick={() => setOpenMenu(true)}
        className="add-block-button"
        aria-label={`${intl.formatMessage(
          messages.AddBlockInPosition,
        )} ${index}`}
        ref={referenceElement}
      >
        <Icon name={addSVG} className="circled" size="19px" />
      </button>
      {createPortal(
        <div
          ref={popperElement}
          style={styles.popper}
          {...attributes.popper}
          className="accordion-chooser"
        >
          {isOpenMenu ? (
            <OpenedBlocksChooser {...props} setOpenMenu={setOpenMenu} />
          ) : null}
        </div>,
        document.body,
      )}
    </>
  );
};

export default injectIntl(NewBlockAddButton);
