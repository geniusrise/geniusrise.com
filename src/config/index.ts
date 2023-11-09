import textConfig from './text/config.json'
import chatConfig from './text/chat/config.json'
import entityConfig from './text/entity/config.json'
import lmConfig from './text/lm/config.json'
import nliConfig from './text/nli/config.json'
import summzConfig from './text/summz/config.json'
import transConfig from './text/trans/config.json'
import txtclassConfig from './text/txtclass/config.json'
import txtqaConfig from './text/txtqa/config.json'
import emotionConfig from './text/emotion/config.json'

import api from './tasks/api.json'
import bulk from './tasks/bulk.json'
import fineTune from './tasks/fine_tune.json'

const _config = textConfig

interface Model {
    name: string
    inputs: Array<{name:string, type:string}>
    description: string
    model_name: string
    examples: string[]
    usecases: string[]
    bulk_formats: string[]
}

interface Config {
    short_name: string
    long_name: string
    description: string
    examples: string[]
    usecases: string[]
    models: Model[]
}

const taskConfig = {
  api: api,
  bulk: bulk,
  fine_tune: fineTune
}

const config = {
  CHAT: {models: chatConfig, ..._config.chat} as Config,
  ENTITY: {models: entityConfig, ..._config.entity} as Config,
  LM: {models: lmConfig, ..._config.lm} as Config,
  NLI: {models: nliConfig, ..._config.nli} as Config,
  SUMMZ: {models: summzConfig, ..._config.summz} as Config,
  TRANS: {models: transConfig, ..._config.trans} as Config,
  TXTCLASS: {models: txtclassConfig, ..._config.txtclass} as Config,
  TXTQA: { models: txtqaConfig, ..._config.txtqa } as Config,
  EMOTION: {models: emotionConfig, ..._config.emotion} as Config,
};

export { config, taskConfig };

export type {Config, Model}