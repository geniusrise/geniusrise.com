import textConfig from './text/config.json';
import chatConfig from './text/chat/config.json';
import entityConfig from './text/entity/config.json';
import lmConfig from './text/lm/config.json';
import nliConfig from './text/nli/config.json';
import summzConfig from './text/summz/config.json';
import transConfig from './text/trans/config.json';
import txtclassConfig from './text/txtclass/config.json';
import txtqaConfig from './text/txtqa/config.json';

const _config = textConfig

interface Model {
    name: string
    description: string
    model_name: string
    examples: string[]
    usecases: string[]
}

interface Config {
    short_name: string
    long_name: string
    description: string
    examples: string[]
    usecases: string[]
    models: Model[]
}

const config = {
  chat: {models: chatConfig, ..._config.chat} as Config,
  entity: {models: entityConfig, ..._config.entity} as Config,
  lm: {models: lmConfig, ..._config.lm} as Config,
  nli: {models: nliConfig, ..._config.nli} as Config,
  summz: {models: summzConfig, ..._config.summz} as Config,
  trans: {models: transConfig, ..._config.trans} as Config,
  txtclass: {models: txtclassConfig, ..._config.txtclass} as Config,
  txtqa: {models: txtqaConfig, ..._config.txtqa} as Config,
};

export { config };

export type {Config, Model}