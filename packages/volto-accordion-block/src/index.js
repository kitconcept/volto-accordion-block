import accordionSVG from '@plone/volto/icons/list-arrows.svg';
import Edit from './components/Edit';
import View from './components/View';
import layoutSchema from './components/LayoutSchema';
import { AccordionStylingSchema } from './components/schema';
import PanelsWidget from './components/Widgets/PanelsWidget';
import filterSVG from '@plone/volto/icons/filter.svg';
import clearSVG from '@plone/volto/icons/clear.svg';
import { defineMessages, createIntlCache, createIntl } from 'react-intl';
import './theme/main.less';

const messages = defineMessages({
  accordionTitle: {
    id: 'Accordion',
    defaultMessage: 'Accordion',
  },
});

const cache = createIntlCache();

const intl = createIntl(
  {
    locale: 'en',
    messages: messages,
  },
  cache,
);

const extendedSchema = (config) => {
  const choices = Object.keys(config.blocks.blocksConfig)
    .map((key) => {
      if (config.blocks.blocksConfig[key]?.restricted) {
        return false;
      } else {
        const title = config.blocks.blocksConfig[key]?.title || key;
        return [key, title];
      }
    })
    .filter((val) => !!val);

  choices.push(['accordion', intl.formatMessage(messages.accordionTitle)]);
  const accordionLayoutSchema = layoutSchema(intl);

  return {
    ...accordionLayoutSchema,
    properties: {
      ...accordionLayoutSchema.properties,
      allowedBlocks: {
        ...accordionLayoutSchema.properties.allowedBlocks,
        items: {
          choices: choices,
        },
      },
    },
  };
};

const applyConfig = (config) => {
  config.widgets.type.panels = PanelsWidget;
  config.blocks.blocksConfig.accordion = {
    id: 'accordion',
    title: intl.formatMessage(messages.accordionTitle),
    icon: accordionSVG,
    group: 'common',
    view: View,
    edit: Edit,
    restricted: false,
    mostUsed: false,
    blockHasOwnFocusManagement: true,
    sidebarTab: 1,
    schema: extendedSchema(config),
    schemaEnhancer: AccordionStylingSchema,
    // See https://react.semantic-ui.com/modules/accordion/
    options: {
      styled: true,
      fluid: true,
    },
    defaults: {},
    security: {
      addPermission: [],
      view: [],
    },
  };
  return config;
};

export default applyConfig;
