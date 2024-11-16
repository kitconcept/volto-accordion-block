import accordionSVG from '@plone/volto/icons/circle-bottom.svg';
import imagesSVG from '@plone/volto/icons/images.svg';
import TestimonialIcon from '@plone/volto/icons/quote.svg';
import Edit from './components/Edit';
import View from './components/View';
import layoutSchema from './components/LayoutSchema';
import { AccordionStylingSchema } from './components/schema';
import PanelsWidget from './components/Widgets/PanelsWidget';
import { ImageSliderDataAdapter } from 'volto-fhnw-web25-base/components/ImageSlider/adapter';
import ImageSliderEdit from 'volto-fhnw-web25-base/components/ImageSlider/Edit';
import ImageSliderView from 'volto-fhnw-web25-base/components/ImageSlider/View';
import {
  NewsletterView,
  NewsletterEdit,
  newsletterSVG,
} from 'volto-fhnw-web25-base/components/Blocks/Newsletter';
import {
  TestimonialsView,
  TestimonialsEdit,
} from 'volto-fhnw-web25-base/components/Blocks/Testimonial';
import { defineMessages, createIntlCache, createIntl } from 'react-intl';
import { cloneDeep } from 'lodash';
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
        return key;
      }
    })
    .filter((val) => !!val);

  choices.push(['accordion', intl.formatMessage(messages.accordionTitle)]);
  const accordionLayoutSchema = layoutSchema(intl);
  console.log(choices);
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
    ...config.blocks.blocksConfig.accordion,
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
    non_exclusive: true,
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

  //Allowed blocks inside the accordion block.
  //Newsletter
  config.blocks.blocksConfig.newsletter = {
    id: 'newsletter',
    title: 'Newsletter (CleverReach)',
    icon: newsletterSVG,
    group: 'content',
    view: NewsletterView,
    edit: NewsletterEdit,
    restricted: false,
    mostUsed: false,
  };
  //Testimonial
  config.blocks.blocksConfig.testimonial = {
    id: 'testimonial',
    title: 'Testimonial',
    icon: TestimonialIcon,
    group: 'content',
    view: TestimonialsView,
    edit: TestimonialsEdit,
    restricted: false,
    sidebarTab: 1,
    enableStyling: false,
  };
  //ImageSlider
  config.blocks.blocksConfig.imageslider = {
    id: 'imageslider',
    title: 'Bildergalerie',
    icon: imagesSVG,
    group: 'media',
    view: ImageSliderView,
    edit: ImageSliderEdit,
    dataAdapter: ImageSliderDataAdapter,
    restricted: false,
    mostUsed: true,
    sidebarTab: 1,
    enableStyling: false,
  };
  return config;
};

export default applyConfig;
