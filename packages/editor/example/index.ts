import '../src/ide';
import { JsonEditorIde } from '../src/ide';
import { createEditorStore } from '../src/helpers/util';
import { detailSchemata, imageProvider, labelProvider, modelMapping } from './config';
import { taskSchema } from './schema';
import { materialFields, materialRenderers } from '@jsonforms/material-renderers';
import * as _ from 'lodash';
import { findAllContainerProperties, Property } from '../src/services/property.util';
import { setContainerProperties } from '../src/reducers';

window.onload = () => {
  const ide = document.createElement('json-editor-ide') as JsonEditorIde;

  const uischema = {
    'type': 'MasterDetailLayout',
    'scope': '#'
  };

  const filterPredicate = (data: Object) => {
    return (property: Property): boolean => {
      if (!_.isEmpty(modelMapping) &&
        !_.isEmpty(modelMapping.mapping)) {
        if (data[modelMapping.attribute]) {
          return property.schema.id === modelMapping.mapping[data[modelMapping.attribute]];
        }
        return true;
      }
    };
  };

  const store = createEditorStore({}, taskSchema, uischema, materialFields,
                                  materialRenderers, imageProvider, labelProvider, modelMapping,
                                  detailSchemata, {});

  ide.filterPredicate = filterPredicate;

  store.dispatch(setContainerProperties(findAllContainerProperties(taskSchema, taskSchema)));

  ide.store = store;

  document.getElementById('editor').appendChild(ide);
};
