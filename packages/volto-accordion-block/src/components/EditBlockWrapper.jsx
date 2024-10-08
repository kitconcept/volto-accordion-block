import React from 'react';
import { Icon } from '@plone/volto/components';
import { buildStyleClassNamesFromData } from '@plone/volto/helpers';
import config from '@plone/volto/registry';
import includes from 'lodash/includes';
import isBoolean from 'lodash/isBoolean';
import { defineMessages, injectIntl } from 'react-intl';
import cx from 'classnames';
import NewBlockAddButton from './NewBlockAddButton';

import dragSVG from '@plone/volto/icons/drag.svg';
import trashSVG from '@plone/volto/icons/delete.svg';

const messages = defineMessages({
  unknownBlock: {
    id: 'Unknown Block',
    defaultMessage: 'Unknown Block {block}',
  },
  delete: {
    id: 'delete',
    defaultMessage: 'delete',
  },
  dragAndDrop: {
    id: 'Drag and drop',
    defaultMessage: 'Drag and drop',
  },
  removeBlock: {
    id: 'Remove block',
    defaultMessage: 'Remove block',
  },
});

class EditBlockWrapper extends React.Component {
  render() {
    const { intl, blockProps, draginfo, extraControls, disabled, children } =
      this.props;

    const {
      block,
      data,
      onDeleteBlock,
      onInsertBlock,
      onSelectBlock,
      selected,
      index,
      blocksConfig,
    } = blockProps;
    const type = data['@type'];
    const dragVisible = !data.fixed;
    const visible = selected;

    const required = isBoolean(data.required)
      ? data.required
      : includes(config.blocks.requiredBlocks, type);

    const styles = buildStyleClassNamesFromData(data.styles);

    return (
      <div>
        <div
          ref={draginfo?.innerRef}
          {...(selected ? draginfo?.draggableProps : null)}
          className={cx(`block-editor-${data['@type']}`, styles, {
            [data.align]: data.align,
          })}
        >
          {(!selected || !visible || disabled) && (
            <div
              style={{
                display: 'none',
                // keep react-beautiful-dnd happy
              }}
              {...draginfo.dragHandleProps}
            ></div>
          )}
          {visible && (
            <div className="block-toolbar">
              {extraControls}

              {!disabled && (
                <>
                  <button
                    title={intl.formatMessage(messages.dragAndDrop)}
                    style={{
                      display: dragVisible ? 'inline-block' : 'none',
                    }}
                    {...draginfo.dragHandleProps}
                    className="drag handle wrapper-accordion-block"
                  >
                    <Icon name={dragSVG} size="19px" />
                  </button>

                  <NewBlockAddButton
                    block={block}
                    index={index}
                    blocksConfig={blocksConfig}
                    onInsertBlock={(id, value) => {
                      onSelectBlock(onInsertBlock(id, value));
                    }}
                  />

                  {!required && (
                    <button
                      title={intl.formatMessage(messages.removeBlock)}
                      onClick={() => onDeleteBlock(block)}
                      className="delete-button-accordion-block"
                      aria-label={intl.formatMessage(messages.delete)}
                    >
                      <Icon name={trashSVG} size="19px" color="#e40166" />
                    </button>
                  )}
                </>
              )}
            </div>
          )}

          <div
            className={cx('ui drag block wrapper inner', type, {
              multiSelected: this.props.multiSelected,
            })}
          >
            {children}
          </div>
        </div>
      </div>
    );
  }
}

export default injectIntl(EditBlockWrapper);
